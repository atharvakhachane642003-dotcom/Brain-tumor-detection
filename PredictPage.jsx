import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Upload,
  Brain,
  Activity,
  Cpu,
  ShieldCheck,
  Microscope,
  CheckCircle2,
} from "lucide-react";

export default function PredictPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!result?.probabilities) return [];
    return Object.entries(result.probabilities).map(([label, value]) => ({
      label,
      value: (value * 100).toFixed(2),
    }));
  };

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-4">
      {/* Header Section */}
      <div className="text-center max-w-3xl mb-10">
        <div className="flex justify-center items-center gap-3 mb-3">
          <Brain className="text-blue-600 w-10 h-10" />
          <h1 className="text-4xl font-bold text-blue-700">
            NeuroDetect AI
          </h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          Upload your MRI or CT image below to detect potential tumor presence
          using our AI-powered deep learning model. The system analyzes brain
          regions and predicts the most probable tumor type with visual
          confidence levels.
        </p>
      </div>

      {/* Upload + Result Section */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-6xl flex flex-col md:flex-row gap-8 justify-between items-start">
        {/* Left Section */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Upload className="text-blue-600 w-5 h-5" />
            <h3 className="text-xl font-semibold text-gray-700">
              Upload MRI / CT Image
            </h3>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-md cursor-pointer"
          />

          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Uploaded preview"
                className="rounded-xl shadow-lg w-80 h-80 object-cover border-4 border-blue-100"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-6 px-6 py-2 rounded-md text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            <Activity className="w-4 h-4" />
            {loading ? "Analyzing Image..." : "Upload & Predict"}
          </button>
        </div>

        {/* Right Section */}
        {result && (
          <div className="flex-1 bg-gray-50 p-6 rounded-2xl shadow-md transition-all duration-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="text-blue-600 w-6 h-6" />
              <h3 className="text-2xl font-bold text-blue-700">
                Prediction Result
              </h3>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg">
                <b>Tumor Type:</b>{" "}
                <span className="text-green-600 font-semibold">
                  {result.predicted_label}
                </span>
              </p>
            </div>

            <h4 className="text-lg font-semibold mb-2 text-gray-700">
              Confidence Chart
            </h4>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getChartData()}>
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {getChartData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 text-center text-gray-700">
              <p className="italic">
                The model predicts{" "}
                <b>{result.predicted_label}</b> with a confidence of{" "}
                <b>
                  {(
                    result.probabilities[
                      result.predicted_label.toLowerCase()
                    ] * 100
                  ).toFixed(2)}
                  %
                </b>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <section className="mt-16 max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: <Cpu className="w-8 h-8 text-blue-600" />,
              title: "AI-Powered Analysis",
              desc: "Deep neural networks analyze MRI scans and extract key features of the brain structure.",
            },
            {
              icon: <Microscope className="w-8 h-8 text-blue-600" />,
              title: "Pattern Detection",
              desc: "Advanced pattern recognition detects abnormal regions associated with different tumor types.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
              title: "Accurate Results",
              desc: "Validated model ensures over 95% accuracy with medical expert collaboration.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-blue-100 p-3 rounded-xl inline-block mb-3">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model Info Section */}
      <section className="mt-20 max-w-4xl text-center bg-white shadow-md rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          About the Model
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The model is trained on thousands of MRI images sourced from verified
          datasets like BRATS and Kaggle. It uses convolutional neural networks
          (CNNs) to classify tumor types such as Glioma, Meningioma, and
          Pituitary with robust accuracy.
        </p>
        <p className="text-gray-600">
          Each prediction is accompanied by a probability score, helping medical
          professionals and users understand confidence levels and reliability.
        </p>
      </section>

      {/* Footer Note */}
      <div className="mt-16 text-center text-gray-500 text-sm flex items-center gap-1">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <p>NeuroDetect AI © 2025 — Built for reliable and ethical AI healthcare</p>
      </div>
    </div>
  );
}
