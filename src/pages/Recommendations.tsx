import React from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { RecommendationDeck } from "../components/RecommendationDeck";
import { Sparkles, CheckCircle2, Zap, Clock, ShieldCheck } from "lucide-react";

export default function Recommendations() {
  const { recommendations } = useCrowd();

  const activeCount = recommendations.filter((r) => r.status === "active").length;
  const executedCount = recommendations.filter((r) => r.status === "executed").length;
  const totalSavedMinutes = recommendations
    .filter((r) => r.status === "executed")
    .reduce((sum, r) => sum + r.timeSavedMinutes, 0);

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h1 className="text-sm font-bold tracking-tight">Generative AI Recommendation Deck</h1>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Transparent, actionable crowd management recommendations powered by LLM predictive telemetry
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-muted/30 border border-border px-3 py-1.5 rounded-md">
              <span className="text-muted-foreground">Active AI Recommendations: </span>
              <span className="text-indigo-400 font-bold">{activeCount}</span>
            </div>
            <div className="bg-muted/30 border border-border px-3 py-1.5 rounded-md">
              <span className="text-muted-foreground">Executed Mitigations: </span>
              <span className="text-emerald-400 font-bold">{executedCount}</span>
            </div>
          </div>
        </div>

        <RecommendationDeck />
      </div>
    </AppLayout>
  );
}
