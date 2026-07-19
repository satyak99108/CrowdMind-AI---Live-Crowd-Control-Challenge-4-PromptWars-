import React from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Shield, Cpu } from "lucide-react";

export default function Settings() {
  const { simState, setSimSpeed, setSimScenario } = useCrowd();

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card shrink-0">
          <div>
            <h1 className="text-sm font-bold tracking-tight">System Controls & Telemetry Configuration</h1>
            <p className="text-[11px] text-muted-foreground">Adjust simulation engine parameters and AI risk sensitivity</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 max-w-[1000px] mx-auto w-full space-y-6">
          <div className="border border-border rounded-lg bg-card p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold border-b border-border pb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" /> Simulation Engine Parameters
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Simulation Speed Multiplier</p>
                  <p className="text-muted-foreground text-[11px]">Controls real-time tick frequency (1x to 5x)</p>
                </div>
                <div className="flex items-center gap-1 border border-border rounded p-1 bg-background">
                  {[1, 2, 5].map((speed) => (
                    <Button
                      key={speed}
                      variant={simState.speed === speed ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSimSpeed(speed)}
                      className="h-7 text-xs font-mono px-3"
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="font-semibold text-foreground">Stadium Scenario Preset</p>
                  <p className="text-muted-foreground text-[11px]">Baseline crowd distribution timeline</p>
                </div>
                <div className="flex items-center gap-1">
                  {[
                    { key: "PRE_MATCH", label: "Pre-Match Rush" },
                    { key: "HALFTIME", label: "Halftime" },
                    { key: "POST_MATCH", label: "Mass Exit" }
                  ].map((sc) => (
                    <Button
                      key={sc.key}
                      variant={simState.scenario === sc.key ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setSimScenario(sc.key)}
                      className="h-7 text-xs px-2.5"
                    >
                      {sc.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg bg-card p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold border-b border-border pb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> AI Risk Sensitivity & Alert Rules
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Automated Incident Generation</p>
                  <p className="text-muted-foreground text-[11px]">Automatically log critical incident when gate occupancy &gt;85%</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="font-semibold text-foreground">Sound & Visual Flash Alerts</p>
                  <p className="text-muted-foreground text-[11px]">Trigger pulsing red aura on stadium heatmap during bottlenecks</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
