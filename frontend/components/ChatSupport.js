// components/ChatSupport.js
import { useState } from "react";
import axios from "axios";

export default function ChatSupport() {
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // ✅ Toggle for chat window
    const [context, setContext] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const sendMessage = async () => {
        if (!message.trim()) return;
    
        const userMessage = { sender: "user", text: message };
        setChatLog((prev) => [...prev, userMessage]);
    
        try {
            console.log("🟢 Sending message:", message);  // ✅ Add log
            const res = await axios.post("http://localhost:3001/api/chat", {
                message: message, // ✅ Correctly send the message
                context: context  
            });
            console.log("✅ Bot Response:", res.data.reply);  // ✅ Log bot reply
            const botReply = { sender: "bot", text: res.data.reply };
            setChatLog((prev) => [...prev, botReply]);
            if (context === "Order Related Queries") {
                setSuggestions(["Track my order", "Cancel my order", "Order not delivered"]);
            } else if (context === "Return and Refund") {
                setSuggestions(["How to return a product?", "Refund status", "Return policy"]);
            } else if (context === "Product Information") {
                setSuggestions(["Product warranty", "Available colors", "Delivery options"]);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Chat error:", error);
        }
    
        
    };
    const handleContextSelection = (selectedContext) => {
        setContext(selectedContext);
        setChatLog([{ sender: "bot", text: `You selected ${selectedContext}. How can I assist you?` }]);
        setSuggestions([]);
    };
    
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#77DD77] text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
            >
                💬
            </button>

            {isOpen && (
                <div className="bg-[#FAE1DD] p-4 rounded shadow-md w-80 mt-2 relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
                    >
                        ❌
                    </button>
                    <h2 className="text-xl font-bold mb-2">Chat Support</h2>

                    {/* Context Selection UI */}
                    {!context ? (
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleContextSelection("Order Related Queries")} className="bg-gray-200 p-2 rounded hover:bg-gray-300">Order Related Queries</button>
                            <button onClick={() => handleContextSelection("Return and Refund")} className="bg-gray-200 p-2 rounded hover:bg-gray-300">Return and Refund</button>
                            <button onClick={() => handleContextSelection("Product Information")} className="bg-gray-200 p-2 rounded hover:bg-gray-300">Product Information</button>
                        </div>
                    ) : (
                        <>
                            <div className="h-64 overflow-y-auto mb-2 border p-2 rounded">
                                {chatLog.map((msg, idx) => (
                                    <div key={idx} className={`mb-2 p-2 rounded ${msg.sender === "user" ? "bg-[#77DD77] text-right" : "bg-gray-100 text-left"}`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Suggested Replies */}
                            {suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => sendMessage(suggestion)}
                                            className="bg-[#77DD77] text-sm px-2 py-1 rounded hover:bg-gray-300"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="border rounded w-full p-2 mb-2"
                            />
                            <button onClick={() => sendMessage()} className="bg-[#77DD77] text-black w-full py-2 rounded">
                                Send
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}