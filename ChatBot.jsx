import React, { useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react"; // For icons

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/chat",
        { question: newMessage.text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("💬 Backend response:", res.data);

      const botText =
        typeof res.data.response === "object"
          ? res.data.response.error || JSON.stringify(res.data.response)
          : res.data.response;

      const botReply = {
        sender: "bot",
        text: botText || "No response received.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Error communicating with backend:", err);
      const botReply = {
        sender: "bot",
        text:
          err.response?.data?.error ||
          "⚠️ Something went wrong while contacting the backend.",
      };
      setMessages((prev) => [...prev, botReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[480px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-3">
            <h2 className="font-semibold text-lg">💬 Medical Assistant</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center mt-16">
                Start the conversation 👇
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`my-2 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] break-words ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white ml-6"
                        : "bg-gray-200 text-gray-800 mr-6"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center border-t p-2">
            <input
              type="text"
              className="flex-grow border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
