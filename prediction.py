import os
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess
from .preprocessing import clahe_preprocess_cv2

IMAGE_SIZE = (224, 224)

def load_all_models(model_dir):
    scaler = joblib.load(os.path.join(model_dir, "scaler.joblib"))
    svm = joblib.load(os.path.join(model_dir, "svm_classifier.joblib"))
    class_labels = joblib.load(os.path.join(model_dir, "class_labels.joblib"))
    feat_mn = load_model(os.path.join(model_dir, "mobilenetv2_feature_extractor.h5"))
    feat_en = load_model(os.path.join(model_dir, "efficientnetb0_feature_extractor.h5"))
    return scaler, svm, class_labels, feat_mn, feat_en


def tta_predict(file_path, scaler, svm, class_labels, feat_mn, feat_en, tta_transforms=5):
    probs = []

    img_orig = load_img(file_path, target_size=IMAGE_SIZE)
    img_base = img_to_array(img_orig).astype("float32") / 255.0

    for i in range(tta_transforms):
        img = img_base.copy()

        if np.random.rand() < 0.5:
            img = np.fliplr(img)

        dx = np.random.randint(-4, 5)
        dy = np.random.randint(-4, 5)
        img = np.roll(img, dx, axis=0)
        img = np.roll(img, dy, axis=1)

        x_mn = np.expand_dims(clahe_preprocess_cv2(img, mobilenet_preprocess), axis=0)
        f_mn = feat_mn.predict(x_mn, verbose=0)

        x_en = np.expand_dims(clahe_preprocess_cv2(img, efficientnet_preprocess), axis=0)
        f_en = feat_en.predict(x_en, verbose=0)

        x_concat = np.concatenate([f_mn, f_en], axis=1)
        x_scaled = scaler.transform(x_concat)
        prob = svm.predict_proba(x_scaled)[0]
        probs.append(prob)

    avg_prob = np.mean(probs, axis=0)
    pred_idx = np.argmax(avg_prob)
    pred_label = class_labels[pred_idx]
    return pred_label, avg_prob
