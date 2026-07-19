import React, { useState } from "react";
import { useCrowd, Recommendation } from "../contexts/CrowdContext";
import { Button } from "./ui/button";
import { Sparkles, CheckCircle2, HelpCircle, Clock, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { LLMReasoningModal } from "./LLMReasoningModal";
import { cn } from "../lib/utils";

export function RecommendationDeck() {
  const { recommendations, executeRecommendation } = useCrowd();
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  const activeRecs = recommendations.filter((r) => r.status === "active");
  const totalSavedMinutes = recommendations
    .filter((r) => r.status === "executed")
    .reduce((sum, r) => sum + r.timeSavedMinutes, 0);

  return (
    <div className="space-y-4">
      {/* Header Stat Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-border bg-card p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              AI Actionable Recommendations Engine
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                AI TRANSPARENCY
              </span>
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Predictive AI recommendations convert telemetry spikes into fan time savings with transparent LLM rationale.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/30 border border-border px-3 py-1.5 rounded-md font-mono text-xs">
          <span className="text-muted-foreground">Total Fan Time Saved:</span>
          <span className="text-emerald-400 font-bold text-sm">⚡ {totalSavedMinutes} Minutes</span>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeRecs.length === 0 ? (
          <div className="col-span-2 border border-dashed border-border rounded-lg p-8 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-foreground">All AI Recommendations Executed</h3>
            <p className="text-xs text-muted-foreground">Stadium perimeter and concourse flow running at optimal efficiency.</p>
          </div>
        ) : (
          activeRecs.map((rec) => (
            <div
              key={rec.id}
              className="border border-indigo-500/30 rounded-lg bg-card p-4 space-y-3 shadow-sm hover:border-indigo-500/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {rec.type.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ⚡ Save {rec.timeSavedMinutes}m
                  </span>
                </div>

                <h3 className="text-sm font-bold leading-snug text-foreground">{rec.actionText}</h3>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {rec.llmReasoning}
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRec(rec)}
                  className="h-7 text-[11px] gap-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Explain WHY (AI Rationale)
                </Button>

                <Button
                  size="sm"
                  onClick={() => executeRecommendation(rec.id)}
                  className="h-7 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Execute Strategy
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <LLMReasoningModal
        recommendation={selectedRec}
        onClose={() => setSelectedRec(null)}
        onExecute={executeRecommendation}
      />
    </div>
  );
}
