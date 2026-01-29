import { Send } from "lucide-react";
import { useState, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

interface MessageInterfaceProps {
  suggestedMessage?: string;
}

export function MessageInterface({ suggestedMessage }: MessageInterfaceProps) {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! Did you get a chance to review the proposal I sent over?",
      sender: "other",
      timestamp: "10:32 AM",
    },
    {
      id: 2,
      text: "Not yet, been swamped with other stuff. Will try to look at it later.",
      sender: "user",
      timestamp: "10:45 AM",
    },
    {
      id: 3,
      text: "No worries! Just wanted to check in. It would be great if you could give me feedback by end of day though.",
      sender: "other",
      timestamp: "10:47 AM",
    },
    {
      id: 4,
      text: "Yeah, I'll try.",
      sender: "user",
      timestamp: "10:48 AM",
    },
    {
      id: 5,
      text: "Thanks! I really appreciate it. Let me know if you have any questions.",
      sender: "other",
      timestamp: "10:49 AM",
    },
    {
      id: 6,
      text: "Sure thing.",
      sender: "user",
      timestamp: "10:50 AM",
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (suggestedMessage) {
      setInputValue(suggestedMessage);
    }
  }, [suggestedMessage]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/60 border-b border-white/20 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
            JD
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Jordan Davis</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50 animate-pulse" />
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md rounded-3xl px-5 py-3 transition-all duration-300 hover:scale-[1.02] ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  : "backdrop-blur-xl bg-white/70 text-gray-900 border border-white/40 shadow-lg"
              }`}
            >
              <p className="leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1.5 ${
                  message.sender === "user"
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="backdrop-blur-xl bg-white/60 border-t border-white/20 px-6 py-5 shadow-lg">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-5 py-3 backdrop-blur-xl bg-white/80 border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent shadow-md transition-all duration-300 placeholder:text-gray-400"
          />
          <button className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}