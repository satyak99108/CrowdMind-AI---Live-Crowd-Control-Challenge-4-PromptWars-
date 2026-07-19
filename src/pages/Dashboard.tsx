import React, { useState } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { StadiumMap } from "../components/StadiumMap";
import { SimController } from "../components/SimController";
import { LiveActivityFeed } from "../components/LiveActivityFeed";
import { ZoneDetailModal } from "../components/ZoneDetailModal";
import { PredictiveForecastBar } from "../components/PredictiveForecastBar";
import { PredictiveQueueCard } from "../components/PredictiveQueueCard";
import { RecommendationDeck } from "../components/RecommendationDeck";
import { Users, AlertTriangle, TrendingUp, Zap, Sparkles, Layers, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const { stadiumData, setSelectedItem, recommendations } = useCrowd();
  const [activeTab, setActiveTab] = useState<"heatmap" | "recommendations" | "forecasts">("heatmap");

  const totalStadiumFans = stadiumData.gates.reduce((sum, g) => sum + g.currentOccupancy, 0);
  const totalPercent = Math.round((totalStadiumFans / stadiumData.totalCapacity) * 100);
  const congestedGatesCount = stadiumData.gates.filter((g) => g.status === "high").length;

  const allItems = [...stadiumData.gates, ...stadiumData.sectors];
  const highestDensityItem = allItems.reduce((prev, current) => {
    const prevRatio = prev.currentOccupancy / prev.capacity;
    const currentRatio = current.currentOccupancy / current.capacity;
    return currentRatio > prevRatio ? current : prev;
  }, allItems[0]);

  const peakPercent = Math.round((highestDensityItem.currentOccupancy / highestDensityItem.capacity) * 100);
  const totalInflowRate = stadiumData.gates.reduce((sum, g) => sum + g.entryRate, 0);
  const activeRecsCount = recommendations.filter((r) => r.status === "active").length;

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-5 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-base font-bold tracking-tight">{stadiumData.stadiumName}</h1>
              <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                {stadiumData.venueCode}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {stadiumData.matchInfo.teams} — <span className="text-primary font-semibold">{stadiumData.matchInfo.stage}</span> ({stadiumData.matchInfo.kickoffTime})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItem(stadiumData.gates[0])}
              className="h-8 text-[12px] gap-1.5 border-border/60"
            >
              <Users className="h-3.5 w-3.5" /> Inspect Gates
            </Button>
          </div>
        </div>

        {/* Minimal Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-border/60 rounded-xl bg-card/40 backdrop-blur-md p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-muted-foreground text-xs font-medium">
              <span>Attendance Density</span>
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono">{totalStadiumFans.toLocaleString()}</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">{totalPercent}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {totalPercent}% of {stadiumData.totalCapacity.toLocaleString()} Capacity
            </p>
          </div>

          <div className="border border-border/60 rounded-xl bg-card/40 backdrop-blur-md p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-muted-foreground text-xs font-medium">
              <span>Gate Congestion</span>
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-rose-400">
                {congestedGatesCount} / {stadiumData.gates.length} <span className="text-xs font-normal text-muted-foreground">High</span>
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {stadiumData.gates.length - congestedGatesCount} gates optimal inflow
            </p>
          </div>

          <div className="border border-border/60 rounded-xl bg-card/40 backdrop-blur-md p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-muted-foreground text-xs font-medium">
              <span>Peak Zone</span>
              <Zap className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold truncate text-amber-400">{highestDensityItem.name}</span>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground">
              {peakPercent}% Density ({highestDensityItem.currentOccupancy}/{highestDensityItem.capacity})
            </p>
          </div>

          <div className="border border-border/60 rounded-xl bg-card/40 backdrop-blur-md p-3.5 space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-muted-foreground text-xs font-medium">
              <span>Inflow Speed</span>
              <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-sky-400">{totalInflowRate}</span>
              <span className="text-xs text-muted-foreground font-mono">fans/min</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Turnstile throughput rate</p>
          </div>
        </div>

        {/* Minimal Predictive Time-Travel Bar */}
        <PredictiveForecastBar />

        {/* Minimal Navigation Workspace Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-1 pt-1">
          {[
            { id: "heatmap", label: "Stadium Heatmap & Live Ops", icon: Layers },
            { id: "recommendations", label: "AI Recommendations", icon: Sparkles, count: activeRecsCount },
            { id: "forecasts", label: "5–10 Min Queue Forecasts", icon: TrendingUp }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative",
                  isActive
                    ? "bg-primary/10 text-primary font-bold border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/30"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Views */}
        {activeTab === "heatmap" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StadiumMap />
            </div>
            <div className="space-y-6">
              <SimController />
              <LiveActivityFeed />
            </div>
          </div>
        )}

        {activeTab === "recommendations" && (
          <RecommendationDeck />
        )}

        {activeTab === "forecasts" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stadiumData.gates.map((gate) => (
                <PredictiveQueueCard key={gate.id} item={gate} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ZoneDetailModal />
    </AppLayout>
  );
}
