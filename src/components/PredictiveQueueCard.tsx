import React from "react";
import { Gate, Amenity } from "../contexts/CrowdContext";
import { getStatusColor } from "./StadiumMap";
import { ArrowRight, TrendingUp, Users, Clock } from "lucide-react";
import { cn } from "../lib/utils";

export function PredictiveQueueCard({ item }: { item: Gate | Amenity }) {
  const isGate = "entryRate" in item;
  const currentQueue = isGate ? (item as Gate).queueLength : (item as Amenity).currentQueue;
  const pred5m = item.predictedQueue5m;
  const pred10m = item.predictedQueue10m;

  const currentStatusColor = getStatusColor(item.status);
  const pred10mColor = getStatusColor(item.predictedStatus10m);

  return (
    <div className="border border-border rounded-lg bg-card p-3 space-y-2 hover:border-primary/50 transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold truncate">{item.name}</span>
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: currentStatusColor }}
        />
      </div>

      {/* Current vs +5m vs +10m Prediction Flow */}
      <div className="flex items-center justify-between bg-muted/30 p-2 rounded text-[11px] font-mono border border-border/50">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-muted-foreground uppercase">Now</span>
          <span className="font-bold text-foreground">{currentQueue}</span>
        </div>

        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-indigo-400 font-semibold uppercase">+5 Min</span>
          <span className="font-bold text-indigo-300">{pred5m}</span>
        </div>

        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-rose-400 font-semibold uppercase">+10 Min</span>
          <span className="font-bold" style={{ color: pred10mColor }}>{pred10m}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>{isGate ? `${(item as Gate).entryRate} fans/min inflow` : (item as Amenity).location}</span>
        <span className="text-indigo-400 flex items-center gap-0.5">
          <TrendingUp className="h-3 w-3" /> Predicted Queue
        </span>
      </div>
    </div>
  );
}
