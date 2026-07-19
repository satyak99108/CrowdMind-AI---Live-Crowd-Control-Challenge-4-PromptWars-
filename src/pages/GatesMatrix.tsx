import React, { useState } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { getStatusColor } from "../components/StadiumMap";
import { Search, Zap, Grid, Layers, Users, Activity } from "lucide-react";
import { ZoneDetailModal } from "../components/ZoneDetailModal";

export default function GatesMatrix() {
  const { stadiumData, setSelectedItem, injectSpike } = useCrowd();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "GATES" | "SECTORS">("ALL");

  const filteredGates = stadiumData.gates.filter(
    (g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.sector.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSectors = stadiumData.sectors.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card shrink-0 gap-3">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Perimeter Gates & Sector Matrix</h1>
            <p className="text-[11px] text-muted-foreground">Comprehensive venue entry portal and seating ring telemetry</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter gates or sectors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-[12px]"
              />
            </div>
            <div className="flex items-center border border-border rounded bg-muted/20 p-0.5">
              {(["ALL", "GATES", "SECTORS"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-1 text-[11px] font-medium rounded ${filterType === type ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {(filterType === "ALL" || filterType === "GATES") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
                  <Grid className="h-4 w-4 text-primary" /> Active Perimeter Gates ({filteredGates.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredGates.map((gate) => {
                  const percent = Math.round((gate.currentOccupancy / gate.capacity) * 100);
                  const color = getStatusColor(gate.status);

                  return (
                    <div
                      key={gate.id}
                      className="border border-border rounded-lg bg-card p-4 space-y-3 hover:border-primary/50 transition-all cursor-pointer shadow-sm relative overflow-hidden group"
                      onClick={() => setSelectedItem(gate)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{gate.sector} Sector</span>
                          <h3 className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">{gate.name}</h3>
                        </div>
                        <span className="h-2.5 w-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: color }} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span>Occupancy</span>
                          <span className="font-bold" style={{ color }}>{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                          <span>{gate.currentOccupancy.toLocaleString()} fans</span>
                          <span>Cap: {gate.capacity.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px] font-mono">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Activity className="h-3 w-3 text-primary" />
                          <span>{gate.entryRate} f/m</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground justify-end">
                          <Users className="h-3 w-3 text-amber-400" />
                          <span>{gate.queueLength} q</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          injectSpike(gate.id);
                        }}
                        className="w-full h-7 text-[11px] font-mono border-rose-500/30 text-rose-400 hover:bg-rose-500/10 mt-1"
                      >
                        <Zap className="h-3 w-3 mr-1" /> Inject Congestion Spike
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(filterType === "ALL" || filterType === "SECTORS") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 font-mono">
                  <Layers className="h-4 w-4 text-primary" /> Stadium Seating Ring & Concourse Sectors ({filteredSectors.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSectors.map((sec) => {
                  const percent = Math.round((sec.currentOccupancy / sec.capacity) * 100);
                  const color = getStatusColor(sec.status);

                  return (
                    <div
                      key={sec.id}
                      className="border border-border rounded-lg bg-card p-4 space-y-3 hover:border-primary/50 transition-all cursor-pointer shadow-sm group"
                      onClick={() => setSelectedItem(sec)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{sec.category}</span>
                          <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{sec.name}</h3>
                        </div>
                        <span className="h-2.5 w-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: color }} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span>Density Index ({sec.density})</span>
                          <span className="font-bold" style={{ color }}>{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                          <span>{sec.currentOccupancy.toLocaleString()} seats</span>
                          <span>Cap: {sec.capacity.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ZoneDetailModal />
    </AppLayout>
  );
}
