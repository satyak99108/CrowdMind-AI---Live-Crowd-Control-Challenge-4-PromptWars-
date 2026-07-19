import React from "react";
import { Recommendation } from "../contexts/CrowdContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Sparkles, CheckCircle2, Clock, Activity, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export function LLMReasoningModal({
  recommendation,
  onClose,
  onExecute
}: {
  recommendation: Recommendation | null;
  onClose: () => void;
  onExecute: (id: string) => void;
}) {
  if (!recommendation) return null;

  return (
    <Dialog open={!!recommendation} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">AI Transparent Reasoning Engine</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                WHY EXPLANATION — GENERATIVE CROWD FLOW MODEL
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Action Banner */}
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 space-y-1">
            <div className="flex items-center justify-between text-indigo-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Proposed Action
              </span>
              <span className="font-mono text-emerald-400">⚡ Save {recommendation.timeSavedMinutes} Minutes</span>
            </div>
            <p className="text-sm font-bold text-foreground leading-snug">{recommendation.actionText}</p>
          </div>

          {/* Transparent WHY Rationale */}
          <div className="space-y-2">
            <h4 className="font-bold text-muted-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Transparent LLM Rationale (Why this recommendation is made)
            </h4>
            <div className="p-3 rounded border border-border bg-muted/20 text-foreground/90 leading-relaxed text-xs space-y-2">
              <p>{recommendation.llmReasoning}</p>
            </div>
          </div>

          {/* Telemetry Evidence Grid */}
          <div className="space-y-2">
            <h4 className="font-bold text-muted-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-sky-400" /> Supporting Telemetry Evidence
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded border border-border bg-background space-y-1">
                <span className="text-[10px] text-muted-foreground block">Source Zone Density</span>
                <p className="font-bold text-rose-400 truncate">{recommendation.sourceZone}</p>
                <span className="text-xs text-foreground font-bold">{recommendation.telemetryEvidence.sourceOccupancy}</span>
              </div>

              <div className="p-2.5 rounded border border-border bg-background space-y-1">
                <span className="text-[10px] text-muted-foreground block">Target Zone Capacity</span>
                <p className="font-bold text-emerald-400 truncate">{recommendation.targetZone}</p>
                <span className="text-xs text-foreground font-bold">{recommendation.telemetryEvidence.targetOccupancy}</span>
              </div>
            </div>

            <div className="p-2 rounded bg-muted/30 border border-border/50 font-mono text-[10px] flex justify-between text-muted-foreground">
              <span>Time Horizon: {recommendation.telemetryEvidence.timeHorizon}</span>
              <span className="text-primary font-bold">{recommendation.telemetryEvidence.throughputDiff}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Explanation
            </Button>
            {recommendation.status === "active" && (
              <Button
                size="sm"
                onClick={() => {
                  onExecute(recommendation.id);
                  onClose();
                }}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Execute & Save {recommendation.timeSavedMinutes}m
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
