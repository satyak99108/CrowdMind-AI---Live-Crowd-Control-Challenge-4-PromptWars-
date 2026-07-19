import React, { useState } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { StadiumMap, getStatusColor } from "../components/StadiumMap";
import { ZoneDetailModal } from "../components/ZoneDetailModal";
import { PredictiveForecastBar } from "../components/PredictiveForecastBar";
import { PredictiveQueueCard } from "../components/PredictiveQueueCard";
import { Search, Zap, Activity, Users, ShieldAlert, Utensils, Restroom } from "lucide-react";

export default function GatesMatrix() {
  const { stadiumData, setSelectedItem, injectSpike } = useCrowd();
  const [search, setSearch] = useState("");

  const filteredGates = stadiumData.gates.filter(
    (g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSectors = stadiumData.sectors.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Perimeter Gates, Sectors & Amenity Matrix</h1>
            <p className="text-[11px] text-muted-foreground">Detailed telemetry, queue forecasting, and food court/restroom congestion</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter by gate, sector, or amenity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-[12px]"
            />
          </div>
        </div>

        <PredictiveForecastBar />

        {/* Gates Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Perimeter Access Gates A-H
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredGates.map((gate) => {
              const occPct = Math.round((gate.currentOccupancy / gate.capacity) * 100);
              const color = getStatusColor(gate.status);

              return (
                <div
                  key={gate.id}
                  onClick={() => setSelectedItem(gate)}
                  className="border border-border rounded-lg bg-card p-4 space-y-3 hover:border-primary/50 cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{gate.id.toUpperCase()}</span>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold leading-tight line-clamp-1">{gate.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-mono">{gate.sector} Sector</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-muted-foreground">Occupancy:</span>
                      <span style={{ color }} className="font-bold">{occPct}%</span>
                    </div>
                    <Progress value={occPct} className="h-1.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="bg-muted/30 p-1.5 rounded">
                      <span className="text-muted-foreground block text-[9px]">Entry Rate</span>
                      <span className="font-bold">{gate.entryRate} <span className="text-[9px] text-muted-foreground">f/m</span></span>
                    </div>
                    <div className="bg-muted/30 p-1.5 rounded">
                      <span className="text-muted-foreground block text-[9px]">Queue</span>
                      <span className="font-bold text-amber-400">{gate.queueLength} fans</span>
                    </div>
                  </div>

                  {/* 5-10 Min Forecast Line */}
                  <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono space-y-0.5">
                    <span className="text-indigo-400 font-bold block">10-MIN AI FORECAST:</span>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Queue Surge:</span>
                      <span className="font-bold text-indigo-300">{gate.queueLength}q → {gate.predictedQueue10m}q</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      injectSpike(gate.id);
                    }}
                    className="w-full h-7 text-[11px] font-mono border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-1"
                  >
                    <Zap className="h-3 w-3" /> Inject Spike
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stadium Food Courts & Restroom Amenity Predictions */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Utensils className="h-4 w-4 text-indigo-400" /> Food Courts & Restroom Queue Forecasting
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stadiumData.amenities.map((am) => (
              <PredictiveQueueCard key={am.id} item={am} />
            ))}
          </div>
        </div>

        <ZoneDetailModal />
      </div>
    </AppLayout>
  );
}
