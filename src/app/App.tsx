import { useState, useRef, useCallback } from "react";
import { MessageInterface } from "@/app/components/MessageInterface";
import { AnalysisPanel } from "@/app/components/AnalysisPanel";
import { Sparkles } from "lucide-react";

export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  { id: 1, text: "Hey! Did you get a chance to review the proposal I sent over?", sender: "other", timestamp: "10:32 AM" },
  { id: 2, text: "Not yet, been swamped with other stuff. Will try to look at it later.", sender: "user", timestamp: "10:45 AM" },
  { id: 3, text: "No worries! Just wanted to check in. It would be great if you could give me feedback by end of day though.", sender: "other", timestamp: "10:47 AM" },
  { id: 4, text: "Yeah, I'll try.", sender: "user", timestamp: "10:48 AM" },
  { id: 5, text: "Thanks! I really appreciate it. Let me know if you have any questions.", sender: "other", timestamp: "10:49 AM" },
  { id: 6, text: "Sure thing.", sender: "user", timestamp: "10:50 AM" },
];

export type InputSelection = { start: number; end: number };

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selection, setSelection] = useState<InputSelection>({ start: 0, end: 0 });
  const [cursorAfterApply, setCursorAfterApply] = useState<number | null>(null);
  const [messages] = useState<ChatMessage[]>(initialMessages);
  const lastNonEmptySelectionRef = useRef<InputSelection>({ start: 0, end: 0 });

  const handleSelectionChange = useCallback((start: number, end: number) => {
    setSelection({ start, end });
    if (end > start) {
      lastNonEmptySelectionRef.current = { start, end };
    }
  }, []);

  const handleApplyTone = useCallback(
    (message: string, options?: { replaceSelection: InputSelection }) => {
      const hasText = inputValue.trim().length > 0;
      if (!hasText) return;

      const fromOptions = options?.replaceSelection && options.replaceSelection.end > options.replaceSelection.start;
      const fromRef = lastNonEmptySelectionRef.current.end > lastNonEmptySelectionRef.current.start;
      const replaceSelection = fromOptions
        ? options!.replaceSelection
        : fromRef
          ? lastNonEmptySelectionRef.current
          : null;

      if (!replaceSelection) return;

      const { start, end } = replaceSelection;
      const before = inputValue.slice(0, start);
      const after = inputValue.slice(end);
      const newText = before + message + after;
      setInputValue(newText);
      setCursorAfterApply(start + message.length);
    },
    [inputValue]
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100">
      {/* Main messaging interface */}
      <div className="flex-1 relative">
        <MessageInterface
          value={inputValue}
          onChange={setInputValue}
          onSelectionChange={handleSelectionChange}
          cursorAfterApply={cursorAfterApply}
          onCursorApplied={() => setCursorAfterApply(null)}
          messages={messages}
        />
        
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
        selection={selection}
        inputValue={inputValue}
        messages={messages}
      />
    </div>
  );
}