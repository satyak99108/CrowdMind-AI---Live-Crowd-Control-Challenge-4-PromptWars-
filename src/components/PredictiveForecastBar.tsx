import React from "react";
import { useCrowd, ForecastMode } from "../contexts/CrowdContext";
import { Button } from "./ui/button";
import { Cpu, TrendingUp, AlertTriangle, Sparkles, Clock } from "lucide-react";
import { cn } from "../lib/utils";

export function PredictiveForecastBar() {
  const { forecastMode, setForecastMode, stadiumData } = useCrowd();

  // Find predicted surge gates (+5m or +10m high status while now is not high)
  const predictedSurgeGates = stadiumData.gates.filter(
    (g) => (g.predictedStatus5m === "high" || g.predictedStatus10m === "high") && g.status !== "high"
  );

  return (
    <div className="border border-border bg-card rounded-lg p-3 space-y-3 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider">AI Predictive Crowd Horizon</span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-3 w-3 mr-1" /> MVP 2 FORECASTING
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Select forecast timeline mode to project gate & sector density ahead of real-time</p>
          </div>
        </div>

        {/* Time Travel Buttons */}
        <div className="flex items-center gap-1 border border-border rounded-md p-1 bg-background">
          {(
            [
              { mode: "NOW", label: "LIVE NOW", icon: Clock },
              { mode: "+5MIN", label: "+5 MIN FORECAST", icon: TrendingUp },
              { mode: "+10MIN", label: "+10 MIN FORECAST", icon: TrendingUp }
            ] as const
          ).map((item) => {
            const isActive = forecastMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setForecastMode(item.mode as ForecastMode)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono font-bold transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Early Warning Surge Banner */}
      {predictedSurgeGates.length > 0 && (
        <div className="flex items-center gap-2.5 p-2.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono">
          <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" />
          <div className="flex-1 truncate">
            <strong>PREDICTED BOTTLENECK SURGE:</strong>{" "}
            {predictedSurgeGates.map((g) => `${g.name} (${g.queueLength}q → ${g.predictedQueue10m}q predicted in 10m)`).join(" | ")}
          </div>
        </div>
      )}
    </div>
  );
}
