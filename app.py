from flask import Flask, request, jsonify, session
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
from dotenv import load_dotenv
from utils.prediction import load_all_models, tta_predict
from utils.chatbot import ask_gemini

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True) 
app.secret_key = os.getenv("SECRET_KEY", "supersecretkey")  # For session handling

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'final_models')

# Load models once at startup
print("🔄 Loading saved models...")
scaler, svm, class_labels, feat_mn, feat_en = load_all_models(MODEL_DIR)
print("✅ Models loaded successfully!")

# --- ROUTES ---

@app.route('/')
def home():
    return jsonify({
        "message": "🧠 Tumor Classification Backend is Running!",
        "available_routes": {
            "POST /predict": "Upload MRI/CT image → get tumor prediction",
            "POST /chat": "Ask questions about predicted tumor type"
        }
    })


@app.route('/predict', methods=['POST'])
def predict():
    """Handles tumor prediction from uploaded image."""
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    if not file.filename:
        return jsonify({"error": "Invalid or empty filename"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        label, prob = tta_predict(
            file_path=file_path,
            scaler=scaler,
            svm=svm,
            class_labels=class_labels,
            feat_mn=feat_mn,
            feat_en=feat_en,
            tta_transforms=5
        )

        # Store the last predicted label in session (per user)
        session['last_predicted_label'] = label

        return jsonify({
            "predicted_label": label,
            "probabilities": {class_labels[i]: float(prob[i]) for i in range(len(class_labels))},
            "message": f"Prediction successful! Tumor type detected: {label}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


@app.route('/chat', methods=['POST'])
def chat():
    """Handles medical Q&A about last predicted tumor type."""
    print("💬 Chat request received.")
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "Please provide a 'question' field"}), 400

    question = data['question']
    tumor_class = session.get('last_predicted_label')

    if not tumor_class:
        return jsonify({
            "error": "No tumor prediction found. Please upload an image first via /predict."
        }), 400

    result = ask_gemini(question, tumor_class)
    return jsonify({
        "tumor_class": tumor_class,
        "response": result.get("response", result)
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
