import React, { useState, useRef, useEffect } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { Sparkles, Send, Bot, User, ArrowRight, ShieldCheck, Zap, HelpCircle, Clock, MapPin, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  reasoning?: string;
  actionableTip?: string;
  metrics?: { label: string; value: string; color?: string }[];
}

export function CopilotChatWidget({ fullHeight = false }: { fullHeight?: boolean }) {
  const { stadiumData, fanProfile, forecastMode, recommendations } = useCrowd();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello! I'm your CrowdMind AI Personal Copilot for ${stadiumData.stadiumName}. I have live telemetry of all gates, concourses, and amenities to guide you smoothly today.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoning: "Initialized with real-time stadium sensor grid & 5m/10m predictive model.",
      actionableTip: `Your ticket is set to ${fanProfile.seatSection} (${fanProfile.seatRow}, ${fanProfile.seatNumber}). Select a quick question below or ask me anything!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAiResponse = (userQuestion: string): ChatMessage => {
    const q = userQuestion.toLowerCase();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Food Court query
    if (q.includes("food") || q.includes("snack") || q.includes("hungry") || q.includes("eat")) {
      const foodCourts = stadiumData.amenities.filter((a) => a.type === "food_court");
      const lowestFC = [...foodCourts].sort((a, b) => a.currentQueue - b.currentQueue)[0];
      const highestFC = [...foodCourts].sort((a, b) => b.currentQueue - a.currentQueue)[0];

      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `The shortest food queue is currently at **${lowestFC?.name || "West VIP Grill"}** with only **${lowestFC?.currentQueue || 45} people** waiting (est. 3 min wait).`,
        timestamp: now,
        reasoning: `Compared ${foodCourts.length} food plazas. ${highestFC?.name} is experiencing peak surge (${highestFC?.currentQueue} in queue, ~18m wait) while ${lowestFC?.name} has 70% lower congestion.`,
        actionableTip: `Walk 3 minutes towards ${lowestFC?.location}. If you wait until minute 42, queue forecast drops to near zero!`,
        metrics: [
          { label: "Best Option", value: lowestFC?.name || "West Terrace Grill", color: "emerald" },
          { label: "Wait Time", value: "~3 mins", color: "emerald" },
          { label: "Avoid Zone", value: highestFC?.name || "North Concourse Plaza", color: "rose" }
        ]
      };
    }

    // 2. Restroom query
    if (q.includes("restroom") || q.includes("toilet") || q.includes("bathroom") || q.includes("washroom")) {
      const restrooms = stadiumData.amenities.filter((a) => a.type === "restroom");
      const lowestRR = [...restrooms].sort((a, b) => a.currentQueue - b.currentQueue)[0];

      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `For zero wait time, head to **${lowestRR?.name || "Restroom Block D (South)"}**. It currently has only **${lowestRR?.currentQueue || 25} waiting fans** (less than 1 minute queue).`,
        timestamp: now,
        reasoning: "North concourse restrooms are experiencing heavy entry-wave traffic (85+ wait queue). South concourse restrooms have 65% capacity headroom.",
        actionableTip: `Located at ${lowestRR?.location || "South Shuttle Hub"}. Recommended before halftime whistle at min 45.`,
        metrics: [
          { label: "Optimal Restroom", value: lowestRR?.name || "Block D (South)", color: "emerald" },
          { label: "Est. Wait", value: "< 1 min", color: "emerald" }
        ]
      };
    }

    // 3. Entry Gate query
    if (q.includes("gate") || q.includes("entry") || q.includes("enter") || q.includes("best gate")) {
      const gates = stadiumData.gates;
      const sortedGates = [...gates].sort((a, b) => a.queueLength - b.queueLength);
      const bestGate = sortedGates[0];
      const busyGate = gates.find((g) => g.id === "gate-a") || sortedGates[sortedGates.length - 1];

      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Based on your seating zone (**${fanProfile.seatSection}**), your fastest entry path is via **${bestGate.name}**. Queue length is just **${bestGate.queueLength} fans** compared to **${busyGate.queueLength} fans** at ${busyGate.name}.`,
        timestamp: now,
        reasoning: `${busyGate.name} is receiving heavy Metro train arrivals. Gate C and Gate B have 4 active turnstiles open with high throughput.`,
        actionableTip: `Rerouting to ${bestGate.name} saves you approximately **14 minutes** in entry delay.`,
        metrics: [
          { label: "Recommended Gate", value: bestGate.name, color: "emerald" },
          { label: "Current Queue", value: `${bestGate.queueLength} people`, color: "emerald" },
          { label: "Time Saved", value: "14 mins", color: "amber" }
        ]
      };
    }

    // 4. Exit & Transit query
    if (q.includes("exit") || q.includes("leave") || q.includes("metro") || q.includes("uber") || q.includes("transit") || q.includes("car")) {
      const mode = fanProfile.transitMode;
      let exitAdvice = "";
      let gateTip = "";

      if (mode === "metro") {
        exitAdvice = "Exit via **East Gate C** instead of Main Gate A. Gate A will see a 1,200-person bottleneck right after the final whistle.";
        gateTip = "Board Metro Line 2 from East Plaza Platform 4 to avoid 25-minute platform queue.";
      } else if (mode === "uber") {
        exitAdvice = "Head towards **South Shuttle Gate E/F** where designated Uber/Rideshare pickup zones have zero wait time.";
        gateTip = "Request vehicle 5 minutes before leaving seat for seamless connection at Zone R-3.";
      } else {
        exitAdvice = "Use **North-West Exit H** for quick access to Multi-story Car Park 2.";
        gateTip = "Staggered exit recommended: wait 8 minutes post-match for 40% reduction in ring road congestion.";
      }

      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: exitAdvice,
        timestamp: now,
        reasoning: `Analyzed egress predictive simulation for transit mode: ${mode.toUpperCase()}. Directing away from high-density crush zones.`,
        actionableTip: gateTip,
        metrics: [
          { label: "Transit Strategy", value: `${mode.toUpperCase()} Optimized`, color: "indigo" },
          { label: "Predicted Delay", value: "Minimal (3 mins)", color: "emerald" }
        ]
      };
    }

    // 5. Section / Wayfinding query
    if (q.includes("seat") || q.includes("section") || q.includes("find") || q.includes("route") || q.includes("104")) {
      return {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `To reach your seat in **${fanProfile.seatSection} (${fanProfile.seatRow})**: Enter through Gate C -> Take Escalator E3 to Upper Level 2 -> Turn Left past Concourse Bay 12 -> Door 104 is on your right.`,
        timestamp: now,
        reasoning: "Calculated shortest interior concourse path with lowest crowd density (East Concourse density 58% vs North Concourse 87%).",
        actionableTip: "Follow illuminated Green Overhead Wayfinder arrows in Escalator Bay 3.",
        metrics: [
          { label: "Target", value: fanProfile.seatSection, color: "emerald" },
          { label: "Est. Walk", value: "4 mins", color: "emerald" }
        ]
      };
    }

    // Default response
    return {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: `I've analyzed live stadium sensors for your query "${userQuestion}". All major zones are currently operating under real-time predictive monitoring.`,
      timestamp: now,
      reasoning: `Matched against stadium data for ${stadiumData.stadiumName}. 8 Gates and 12 Sectors active.`,
      actionableTip: "You can ask about food queues, restroom wait times, best entry gates, or smart exit routes!",
      metrics: [
        { label: "System Status", value: "Live Monitoring", color: "emerald" },
        { label: "Stadium Status", value: stadiumData.matchInfo.status, color: "indigo" }
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAiResponse(query);
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    { text: "🍕 Shortest food court queue?", query: "Where is the shortest food court queue?" },
    { text: "🚻 Restroom with 0 wait time", query: "Find nearest restroom with 0 wait time" },
    { text: "🚪 Best gate for my seat?", query: "What is the best entry gate for my seat?" },
    { text: "🚕 Best exit route for Metro/Uber?", query: "Which exit route should I take for Metro or Uber?" },
    { text: "📍 Route to my seat section", query: "How do I get to my seat section?" }
  ];

  return (
    <div className={cn(
      "flex flex-col bg-card border border-border rounded-xl shadow-lg overflow-hidden",
      fullHeight ? "h-full min-h-[550px]" : "h-[500px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">AI Fan Assistant</h3>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                LIVE CONTEXT
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              Powered by CrowdMind Generative Telemetry
            </p>
          </div>
        </div>

        <button 
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1 bg-muted/50 px-2 py-1 rounded border border-border"
          title="Reset conversation"
        >
          <RefreshCw className="h-3 w-3" /> Clear
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/50 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[88%]",
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5",
              msg.sender === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
            )}>
              {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            </div>

            {/* Content Box */}
            <div className="space-y-2">
              <div
                className={cn(
                  "p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed",
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border/80 text-foreground rounded-tl-none space-y-2.5"
                )}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                {/* AI Extra Artifacts */}
                {msg.sender === "ai" && msg.metrics && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
                    {msg.metrics.map((m, idx) => (
                      <div key={idx} className="bg-muted/40 border border-border px-2 py-1 rounded text-[10px] flex items-center gap-1.5 font-mono">
                        <span className="text-muted-foreground">{m.label}:</span>
                        <span className={cn(
                          "font-bold",
                          m.color === "emerald" && "text-emerald-400",
                          m.color === "rose" && "text-rose-400",
                          m.color === "amber" && "text-amber-400",
                          m.color === "indigo" && "text-indigo-400"
                        )}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.sender === "ai" && msg.reasoning && (
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                      <Zap className="h-3 w-3" /> LLM Reasoning Engine
                    </div>
                    <p className="text-[11px] text-foreground/80 leading-normal">{msg.reasoning}</p>
                  </div>
                )}

                {msg.sender === "ai" && msg.actionableTip && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-[11px] text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[9px] block text-emerald-400 font-mono">Copilot Action Recommendation</span>
                      <span>{msg.actionableTip}</span>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[9px] font-mono text-muted-foreground block px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
            <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse">
              <Bot className="h-3 w-3" />
            </div>
            <span className="font-mono text-[11px] animate-pulse">Analyzing live stadium telemetry...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-muted/20 border-t border-border overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className="whitespace-nowrap bg-muted/60 hover:bg-indigo-500/20 hover:text-indigo-300 border border-border/70 text-[10px] px-2.5 py-1 rounded-full text-muted-foreground transition-all duration-150"
          >
            {p.text}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-card border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Copilot about food queues, restrooms, gates, or exits..."
          className="flex-1 bg-muted/40 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-foreground placeholder:text-muted-foreground/70 font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim()}
          className="h-8 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </div>
    </div>
  );
}
