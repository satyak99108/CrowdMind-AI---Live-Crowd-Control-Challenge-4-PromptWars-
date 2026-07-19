import React from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { Button } from "./ui/button";
import { Play, Pause, Zap, Flame, Clock } from "lucide-react";
import { cn } from "../lib/utils";

export function SimController() {
  const { simState, startSim, pauseSim, setSimSpeed, setSimScenario, injectSpike, stadiumData } = useCrowd();

  const formatMinute = (min: number) => {
    if (min < 0) return `${Math.abs(min)}m Pre-Match`;
    if (min <= 90) return `${min}' Match Time`;
    return `+${min - 90}' Full-Time Exit`;
  };

  return (
    <div className="border border-border bg-card rounded-lg p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-[13px] font-medium">Simulation Control Deck</span>
        </div>
        <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-muted">
          {formatMinute(simState.matchMinute)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {simState.isRunning ? (
          <Button variant="outline" size="sm" onClick={pauseSim} className="h-8 text-[12px] gap-1.5 flex-1">
            <Pause className="h-3.5 w-3.5 fill-current" /> Pause
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={startSim} className="h-8 text-[12px] gap-1.5 flex-1">
            <Play className="h-3.5 w-3.5 fill-current" /> Run Live
          </Button>
        )}

        <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => setSimSpeed(s)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-mono font-medium transition-colors border-r border-border last:border-0",
                simState.speed === s ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Crowd Scenario Presets</label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { key: "PRE_MATCH", label: "Pre-Match Rush" },
            { key: "HALFTIME", label: "Halftime Concourse" },
            { key: "POST_MATCH", label: "Mass Exit" }
          ].map((sc) => (
            <Button
              key={sc.key}
              variant={simState.scenario === sc.key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSimScenario(sc.key)}
              className="h-7 text-[11px] px-1 truncate"
            >
              {sc.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-destructive font-semibold flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" /> Emergency Anomaly Injector
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {stadiumData.gates.slice(0, 4).map((g) => (
            <Button
              key={g.id}
              variant="outline"
              size="sm"
              onClick={() => injectSpike(g.id)}
              className="h-7 text-[11px] font-mono border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <Zap className="h-3 w-3 mr-0.5" /> {g.id.replace("gate-", "").toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
