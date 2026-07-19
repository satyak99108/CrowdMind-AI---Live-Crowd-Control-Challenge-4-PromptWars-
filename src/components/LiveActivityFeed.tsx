import React from "react";
import { useCrowd, LogEntry } from "../contexts/CrowdContext";
import { Activity, ShieldAlert, AlertTriangle, Info, Cpu } from "lucide-react";
import { cn } from "../lib/utils";

export function LiveActivityFeed() {
  const { logs } = useCrowd();

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "ALERT":
        return <ShieldAlert className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      case "SCENARIO":
        return <Cpu className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
      case "SYSTEM":
      case "INFO":
      default:
        return <Info className="h-3.5 w-3.5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden flex flex-col h-[280px]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[13px] font-medium">Real-Time Operations Telemetry Feed</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{logs.length} events</span>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2 font-mono text-[11px]">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Waiting for telemetry ticks...</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "flex items-start gap-2 p-2 rounded border transition-colors",
                log.type === "ALERT" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" :
                log.type === "WARNING" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" :
                "bg-muted/30 border-border text-foreground/90"
              )}
            >
              {getLogIcon(log.type)}
              <span className="text-[10px] text-muted-foreground shrink-0">{log.timestamp}</span>
              <span className="flex-1 leading-snug break-words">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
