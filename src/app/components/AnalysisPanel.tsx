import { X, TrendingUp, Lightbulb, Wand2, Target, AlertTriangle, Pencil, ArrowUp, Minus, ArrowDown, Inbox, Send, Users, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useState } from "react";

type InteractionType = "low-stakes-formal" | "low-stakes-informal" | "high-stakes-formal" | "high-stakes-informal";

/** Interaction type that AI analysis suggests (e.g. from "72% confidence"). */
const AI_SUGGESTED_INTERACTION: InteractionType = "low-stakes-formal";

interface AnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTone: (message: string) => void;
}

const interactionConfigs = {
  "low-stakes-formal": {
    label: "Low-stakes, Formal",
    role: "Professional Communicator",
    description: "Professional courtesy in routine matters",
    tones: [
      {
        title: "Polite & Professional",
        description: "Maintain formal language while being approachable. Use complete sentences and avoid slang.",
        gradient: "from-blue-50/80 to-blue-100/60",
        border: "border-blue-200/50",
        dot: "from-blue-500 to-blue-600"
      },
      {
        title: "Clear & Concise",
        description: "Get to the point quickly while maintaining professionalism. Respect their time.",
        gradient: "from-purple-50/80 to-purple-100/60",
        border: "border-purple-200/50",
        dot: "from-purple-500 to-purple-600"
      },
      {
        title: "Friendly but Bounded",
        description: "Be warm but maintain professional distance. Avoid oversharing personal details.",
        gradient: "from-green-50/80 to-emerald-100/60",
        border: "border-green-200/50",
        dot: "from-green-500 to-emerald-600"
      }
    ],
    message: "Thank you for reaching out regarding the proposal. I'll review it and provide feedback by 3pm today. Please let me know if you have any specific questions."
  },
  "low-stakes-informal": {
    label: "Low-stakes, Informal",
    role: "Friendly Colleague",
    description: "Casual and relaxed for everyday chats",
    tones: [
      {
        title: "Casual & Relaxed",
        description: "Use conversational language and friendly expressions. Feel free to be yourself.",
        gradient: "from-amber-50/80 to-yellow-100/60",
        border: "border-amber-200/50",
        dot: "from-amber-500 to-yellow-600"
      },
      {
        title: "Show Personality",
        description: "Let your personality shine through with humor or emojis if it feels natural.",
        gradient: "from-pink-50/80 to-rose-100/60",
        border: "border-pink-200/50",
        dot: "from-pink-500 to-rose-600"
      },
      {
        title: "Keep it Light",
        description: "Don't overthink responses. Brief and friendly works great for low-stakes conversations.",
        gradient: "from-cyan-50/80 to-sky-100/60",
        border: "border-cyan-200/50",
        dot: "from-cyan-500 to-sky-600"
      }
    ],
    message: "Hey! Thanks for the reminder 😊 I'll check out the proposal and get back to you this afternoon. Appreciate the patience!"
  },
  "high-stakes-formal": {
    label: "High-stakes, Formal",
    role: "Executive Communicator",
    description: "Precision and formality for important matters",
    tones: [
      {
        title: "Authoritative & Clear",
        description: "Be decisive and direct. Demonstrate competence through clear, structured communication.",
        gradient: "from-indigo-50/80 to-indigo-100/60",
        border: "border-indigo-200/50",
        dot: "from-indigo-500 to-indigo-600"
      },
      {
        title: "Detail-Oriented",
        description: "Provide specific timelines and commitments. Show you take this seriously with thorough responses.",
        gradient: "from-violet-50/80 to-violet-100/60",
        border: "border-violet-200/50",
        dot: "from-violet-500 to-violet-600"
      },
      {
        title: "Respectful & Measured",
        description: "Acknowledge the importance of the matter. Use formal language and show appreciation for their time.",
        gradient: "from-slate-50/80 to-slate-100/60",
        border: "border-slate-200/50",
        dot: "from-slate-500 to-slate-600"
      }
    ],
    message: "Thank you for your follow-up on this important proposal. I understand the time sensitivity and have prioritized my review. You can expect comprehensive feedback by 3:00 PM today, including specific recommendations on the key points you've outlined. Please don't hesitate to reach out if you need any clarification in the interim."
  },
  "high-stakes-informal": {
    label: "High-stakes, Informal",
    role: "Trusted Partner",
    description: "Serious but authentic connection",
    tones: [
      {
        title: "Authentic & Direct",
        description: "Be genuine while showing you understand the stakes. Skip formalities but not professionalism.",
        gradient: "from-emerald-50/80 to-teal-100/60",
        border: "border-emerald-200/50",
        dot: "from-emerald-500 to-teal-600"
      },
      {
        title: "Committed & Accountable",
        description: "Make clear commitments and follow through. Show ownership without corporate speak.",
        gradient: "from-orange-50/80 to-orange-100/60",
        border: "border-orange-200/50",
        dot: "from-orange-500 to-orange-600"
      },
      {
        title: "Build Trust",
        description: "Communicate openly about constraints and priorities. Transparency builds credibility.",
        gradient: "from-blue-50/80 to-cyan-100/60",
        border: "border-blue-200/50",
        dot: "from-blue-500 to-cyan-600"
      }
    ],
    message: "Really appreciate you following up, Jordan. I know this is important and I've got it on my priority list. You'll have my detailed thoughts by 3pm today — I'll make sure to cover everything you need. Hit me up if anything urgent comes up before then."
  }
};

type SidebarSection = "setup" | "insights" | "recommendations";

export function AnalysisPanel({ isOpen, onClose, onApplyTone }: AnalysisPanelProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionType>("low-stakes-formal");
  const [selectedRole, setSelectedRole] = useState<InteractionType>("low-stakes-formal");
  const [activeSection, setActiveSection] = useState<SidebarSection>("setup");
  const [roleMismatchWarningDismissed, setRoleMismatchWarningDismissed] = useState(false);
  const [relationshipRecipientLabel, setRelationshipRecipientLabel] = useState("Colleague");
  const [relationshipSenderLabel, setRelationshipSenderLabel] = useState("You");
  const [editingRelationshipNode, setEditingRelationshipNode] = useState<"recipient" | null>(null);
  const [relationshipEditDraft, setRelationshipEditDraft] = useState("");

  if (!isOpen) return null;

  const config = interactionConfigs[selectedInteraction];
  const displayRole = interactionConfigs[selectedRole].role;
  const roleMismatchesInteraction = selectedRole !== selectedInteraction;

  const handleInteractionChange = (type: InteractionType) => {
    setSelectedInteraction(type);
    setSelectedRole(type);
    setRoleMismatchWarningDismissed(false);
  };

  const handleRoleChange = (value: string) => {
    const newRole = value as InteractionType;
    setSelectedRole(newRole);
    if (newRole !== selectedInteraction) {
      setRoleMismatchWarningDismissed(false);
    }
  };

  const handleApplyRecommendedTone = () => {
    onApplyTone(config.message);
  };

  return (
    <div className="w-[420px] flex flex-col h-full overflow-hidden bg-zinc-950/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      {/* Header: dark glass with soft liquid glow */}
      <div className="relative px-6 py-5 flex items-center justify-between border-b border-white/[0.08] bg-gradient-to-r from-white/[0.06] via-white/[0.04] to-transparent backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-cyan-500/[0.04] pointer-events-none" />
        <div className="relative">
          <h2 className="font-semibold text-lg text-white tracking-tight">Replywise</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{displayRole}</p>
        </div>
        <button
          onClick={onClose}
          className="relative w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] hover:bg-white/[0.12] hover:border-white/20 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 text-zinc-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content: vertical sidebar + expandable panel */}
      <div className="flex-1 flex min-h-0">
        {/* Left: dark glass icon rail with liquid glow on active */}
        <div className="flex flex-col items-center py-3 gap-1 w-14 shrink-0 bg-black/40 backdrop-blur-xl border-r border-white/[0.08]">
          <button
            onClick={() => setActiveSection("setup")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeSection === "setup"
                ? "bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] border border-transparent"
            }`}
            title="Setup"
          >
            <Target className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => setActiveSection("insights")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeSection === "insights"
                ? "bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] border border-transparent"
            }`}
            title="Insights"
          >
            <TrendingUp className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => setActiveSection("recommendations")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeSection === "recommendations"
                ? "bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] border border-transparent"
            }`}
            title="Recommendations"
          >
            <Lightbulb className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Right: expandable content panel — dark glass + liquid gradient */}
        <div className="flex-1 min-w-0 overflow-y-auto relative backdrop-blur-xl border-l border-white/[0.04] bg-zinc-900/60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-cyan-500/[0.02] pointer-events-none" aria-hidden />
          <div className="relative">
          {activeSection === "setup" && (
            <div className="opacity-100 transition-opacity duration-200">
            {/* Interaction Type Selector */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.15)]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Interaction Type</h3>
                  <p className="text-xs text-zinc-400">{config.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleInteractionChange("low-stakes-formal")}
                  className={`p-3 rounded-xl text-left transition-all duration-300 border ${
                    selectedInteraction === "low-stakes-formal"
                      ? "bg-white/[0.1] border-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.07] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">Low-stakes</span>
                    {AI_SUGGESTED_INTERACTION === "low-stakes-formal" && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/30 text-blue-400" title="AI suggested">
                        <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">Formal</div>
                </button>

                <button
                  onClick={() => handleInteractionChange("low-stakes-informal")}
                  className={`p-3 rounded-xl text-left transition-all duration-300 border ${
                    selectedInteraction === "low-stakes-informal"
                      ? "bg-white/[0.1] border-amber-500/40 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.07] hover:border-white/15"
                  }`}
                >
                  <div className="text-xs font-semibold">Low-stakes</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Informal</div>
                </button>

                <button
                  onClick={() => handleInteractionChange("high-stakes-formal")}
                  className={`p-3 rounded-xl text-left transition-all duration-300 border ${
                    selectedInteraction === "high-stakes-formal"
                      ? "bg-white/[0.1] border-violet-500/40 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.07] hover:border-white/15"
                  }`}
                >
                  <div className="text-xs font-semibold">High-stakes</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Formal</div>
                </button>

                <button
                  onClick={() => handleInteractionChange("high-stakes-informal")}
                  className={`p-3 rounded-xl text-left transition-all duration-300 border ${
                    selectedInteraction === "high-stakes-informal"
                      ? "bg-white/[0.1] border-emerald-500/40 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.07] hover:border-white/15"
                  }`}
                >
                  <div className="text-xs font-semibold">High-stakes</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Informal</div>
                </button>
              </div>

              {/* AI Role — dropdown (four role options); does not change interaction type */}
              <div className="mt-4 p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
                <label className="block text-xs font-medium text-zinc-400 mb-2">AI Role</label>
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full h-auto min-h-10 px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/15 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 [&_svg]:text-zinc-400">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-xl min-w-[var(--radix-select-trigger-width)]">
                    <SelectItem value="low-stakes-formal" className="text-white focus:bg-white/10 focus:text-white rounded-lg cursor-pointer">
                      <span className="flex items-center gap-2">
                        Professional Communicator
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 shrink-0 [&_svg]:!text-blue-400" title="AI suggested">
                          <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </span>
                      </span>
                    </SelectItem>
                    <SelectItem value="low-stakes-informal" className="text-white focus:bg-white/10 focus:text-white rounded-lg cursor-pointer">
                      Friendly Colleague
                    </SelectItem>
                    <SelectItem value="high-stakes-formal" className="text-white focus:bg-white/10 focus:text-white rounded-lg cursor-pointer">
                      Executive Communicator
                    </SelectItem>
                    <SelectItem value="high-stakes-informal" className="text-white focus:bg-white/10 focus:text-white rounded-lg cursor-pointer">
                      Trusted Partner
                    </SelectItem>
                  </SelectContent>
                </Select>
                {roleMismatchesInteraction && !roleMismatchWarningDismissed && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-200/90">AI recommendations may not reflect the interaction type as well now.</p>
                      <button
                        type="button"
                        onClick={() => setRoleMismatchWarningDismissed(true)}
                        className="mt-1.5 text-xs text-amber-400/90 hover:text-amber-300 underline"
                      >
                        Dismiss
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRoleMismatchWarningDismissed(true)}
                      className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Dismiss warning"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-200/90">
                <div className="text-xs font-medium">AI Analysis Suggests:</div>
                <div className="text-xs mt-1 text-zinc-300">Low-stakes, Formal (72% confidence)</div>
              </div>
            </div>
            </div>
          )}

          {activeSection === "insights" && (
            <div className="opacity-100 transition-opacity duration-200">
            {/* Relationship Analysis — org-tree node structure */}
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.15)]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-lg">Relationship Dynamic</h3>
              </div>
              <div className="flex flex-col items-center gap-0">
                {/* Recipient node (top) — editable */}
                <div className="w-full rounded-xl overflow-hidden border border-white/[0.1] bg-white/[0.04] shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-800/80 border-b border-white/[0.08]">
                    {editingRelationshipNode === "recipient" ? (
                      <input
                        type="text"
                        value={relationshipEditDraft}
                        onChange={(e) => setRelationshipEditDraft(e.target.value)}
                        onBlur={() => {
                          if (relationshipEditDraft.trim()) setRelationshipRecipientLabel(relationshipEditDraft.trim());
                          setEditingRelationshipNode(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (relationshipEditDraft.trim()) setRelationshipRecipientLabel(relationshipEditDraft.trim());
                            setEditingRelationshipNode(null);
                          }
                        }}
                        autoFocus
                        className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-400/50"
                      />
                    ) : (
                      <>
                        <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">
                          {relationshipRecipientLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setRelationshipEditDraft(relationshipRecipientLabel);
                            setEditingRelationshipNode("recipient");
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0"
                          title="Edit"
                          aria-label="Edit recipient"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="px-3 py-2 bg-white/[0.03] border-t border-white/[0.06]">
                    <span className="text-xs font-medium text-zinc-400">Recipient</span>
                  </div>
                </div>
                {/* Connector line */}
                <div className="w-px h-6 bg-gradient-to-b from-white/20 to-white/10" aria-hidden />
                {/* Sender node (bottom) — not editable */}
                <div className="w-full rounded-xl overflow-hidden border border-white/[0.1] bg-white/[0.04] shadow-sm">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-800/80 border-b border-white/[0.08]">
                    <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">
                      {relationshipSenderLabel}
                    </span>
                  </div>
                  <div className="px-3 py-2 bg-white/[0.03] border-t border-white/[0.06]">
                    <span className="text-xs font-medium text-zinc-400">Sender (You)</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] leading-relaxed">
                This appears to be a <strong className="text-white">collaborative work relationship</strong>{" "}
                with moderate familiarity. The other person is seeking your input and values your feedback.
              </p>
            </div>

            {/* Other Person's Tone */}
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-blue-400">
                  <Inbox className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-lg">Recipient's Tone</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Polite & Courteous", level: "High", glow: "blue" },
                  { label: "Appreciative", level: "High", glow: "emerald" },
                  { label: "Professional", level: "High", glow: "violet" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-200">
                    <span className="text-sm font-medium text-zinc-200">{item.label}</span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.1] text-zinc-200 border border-white/[0.08] inline-flex items-center gap-1.5">
                      {item.level === "High" && <ArrowUp className="w-3.5 h-3.5 shrink-0" />}
                      {item.level === "Med" && <Minus className="w-3.5 h-3.5 shrink-0" />}
                      {item.level === "Low" && <ArrowDown className="w-3.5 h-3.5 shrink-0" />}
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Tone */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-blue-400">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-lg">Your Tone</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Casual", level: "High" },
                  { label: "Brief", level: "High" },
                  { label: "Somewhat Dismissive", level: "Med" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-200">
                    <span className="text-sm font-medium text-zinc-200">{item.label}</span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.1] text-zinc-200 border border-white/[0.08] inline-flex items-center gap-1.5">
                      {item.level === "High" && <ArrowUp className="w-3.5 h-3.5 shrink-0" />}
                      {item.level === "Med" && <Minus className="w-3.5 h-3.5 shrink-0" />}
                      {item.level === "Low" && <ArrowDown className="w-3.5 h-3.5 shrink-0" />}
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-amber-200/90 mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 border-l-4 border-l-amber-400/50 leading-relaxed">
                ⚠️ Your responses may come across as less engaged than intended.
              </p>
            </div>
            </div>
          )}

          {activeSection === "recommendations" && (
            <div className="opacity-100 transition-opacity duration-200">
            {/* Tone Recommendations */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.15)]">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-lg">Recommended Tones</h3>
              </div>
              <div className="space-y-3">
                {config.tones.map((tone, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rotate-45 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0" />
                      <span className="font-semibold text-white">{tone.title}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{tone.description}</p>
                  </div>
                ))}
              </div>

              {/* Apply — liquid glow button */}
              <button
                onClick={handleApplyRecommendedTone}
                className="w-full mt-5 px-5 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] bg-white text-zinc-900 border border-white/80 shadow-lg hover:bg-zinc-100 hover:border-white"
              >
                <Wand2 className="w-5 h-5" />
                Apply Recommended Tones
              </button>
            </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}