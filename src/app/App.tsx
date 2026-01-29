import { useState } from "react";
import { MessageInterface } from "@/app/components/MessageInterface";
import { AnalysisPanel } from "@/app/components/AnalysisPanel";
import { Sparkles } from "lucide-react";

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [suggestedMessage, setSuggestedMessage] = useState<string>("");

  const handleApplyTone = (message: string) => {
    setSuggestedMessage(message);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100">
      {/* Main messaging interface */}
      <div className="flex-1 relative">
        <MessageInterface suggestedMessage={suggestedMessage} />
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`absolute bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-xl border-2 ${
            isPanelOpen
              ? "bg-gray-800/80 hover:bg-gray-900/80 border-gray-700/50 hover:scale-110"
              : "bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 animate-pulse border-white/20 hover:scale-110"
          } active:scale-95`}
        >
          <Sparkles className="w-7 h-7 text-white drop-shadow-lg" />
        </button>
      </div>

      {/* AI Analysis Panel */}
      <AnalysisPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onApplyTone={handleApplyTone}
      />
    </div>
  );
}