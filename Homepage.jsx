import React, { useState } from "react";
import Navbar from "./Navbar";
import ChatBot from "./ChatBot";
import {
  Brain,
  Activity,
  Shield,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/Card";
import { Alert, AlertDescription } from "./ui/Alert";
import { Progress } from "./ui/progress";


import {  Zap, Clock, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-blue-600" />,
    title: "AI-Powered Analysis",
    description:
      "Advanced deep learning models trained on thousands of MRI scans for accurate detection.",
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-600" />,
    title: "Fast Results",
    description:
      "Get comprehensive analysis results in under 30 seconds with detailed insights.",
  },
  {
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    title: "HIPAA Compliant",
    description:
      "Enterprise-grade security ensuring patient data privacy and regulatory compliance.",
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    title: "24/7 Availability",
    description:
      "Access the detection system anytime, anywhere for continuous support.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
    title: "High Accuracy",
    description:
      "Proven 95%+ accuracy rate validated against expert medical analysis.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: "Expert Support",
    description:
      "Medical professionals available for consultation and result interpretation.",
  },
];

export default function Homepage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedImage(URL.createObjectURL(file));
    setAnalysisComplete(false);
    setResults(null);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const mockResults = {
        detected: Math.random() > 0.5,
        confidence: Math.floor(Math.random() * 30) + 70,
        tumorType: ["Glioma", "Meningioma", "Pituitary Tumor"][
          Math.floor(Math.random() * 3)
        ],
        location: [
          "Frontal Lobe",
          "Temporal Lobe",
          "Parietal Lobe",
          "Occipital Lobe",
        ][Math.floor(Math.random() * 4)],
        size: `${(Math.random() * 3 + 0.5).toFixed(1)} cm`,
        recommendation:
          "Consult with a neurologist for further evaluation and treatment options.",
      };
      setResults(mockResults);
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
        >
            <source src="/videoplayback.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        {/* Overlay (for better text visibility) */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Foreground Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h2 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-blue-400">NeuroDetect AI</span>
            </h2>
            <p className="max-w-2xl text-lg text-gray-200 leading-relaxed">
            Leverage cutting-edge artificial intelligence to analyze brain MRI scans
            with high accuracy. Get rapid, reliable results to support medical
            decision-making.
            </p>
        </div>
        </div>


      {/* Alert */}
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="size-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            This is a demonstration tool only. Always consult qualified medical
            professionals for accurate diagnosis.
          </AlertDescription>
        </Alert>
      </div>

      {/* Features Section */}

       <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            Why Choose NeuroDetect AI
          </h2>
          <p className="text-gray-600 mt-3">
            Our platform combines state-of-the-art AI technology with medical expertise
            to provide reliable brain tumor detection and analysis.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="bg-blue-100 p-3 rounded-xl inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">About NeuroDetect AI</h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Our AI-powered system uses advanced deep learning algorithms to
            analyze brain MRI scans and detect potential tumors. Early detection
            is crucial for successful treatment outcomes.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center max-w-3xl mx-auto">
            <Card className="p-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">95%</div>
              <p className="text-gray-600">Accuracy Rate</p>
            </Card>
            <Card className="p-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">
                {"< 30s"}
              </div>
              <p className="text-gray-600">Analysis Time</p>
            </Card>
            <Card className="p-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">24/7</div>
              <p className="text-gray-600">Availability</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <Brain className="mx-auto mb-2 text-blue-400" />
          <p>© 2025 NeuroDetect AI. For demonstration purposes only.</p>
        </div>
      </footer>

      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
}
