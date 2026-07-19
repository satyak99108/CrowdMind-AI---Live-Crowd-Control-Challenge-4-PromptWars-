import React, { useState } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { CopilotChatWidget } from "../components/CopilotChatWidget";
import { SeatWayfinderMap } from "../components/SeatWayfinderMap";
import { 
  Utensils, 
  DoorOpen, 
  LogOut, 
  Clock, 
  Train, 
  Car, 
  Bus, 
  Ticket 
} from "lucide-react";
import { cn } from "../lib/utils";

export default function FanCopilot() {
  const { stadiumData, fanProfile, updateFanProfile, forecastMode, setForecastMode } = useCrowd();
  const [activeAmenityTab, setActiveAmenityTab] = useState<"food" | "restroom">("food");

  // 1. Calculate Best Entry Gate
  const gates = stadiumData.gates;
  const sortedGates = [...gates].sort((a, b) => a.queueLength - b.queueLength);
  const bestEntryGate = sortedGates[0];
  const busyEntryGate = gates.find((g) => g.id === fanProfile.preferredGateId) || sortedGates[sortedGates.length - 1];
  const timeSavedGate = Math.max(2, Math.round((busyEntryGate.queueLength - bestEntryGate.queueLength) / 25));

  // 2. Amenities calculations
  const foodCourts = stadiumData.amenities.filter((a) => a.type === "food_court");
  const restrooms = stadiumData.amenities.filter((a) => a.type === "restroom");
  const currentAmenities = activeAmenityTab === "food" ? foodCourts : restrooms;

  // 3. Smart Exit Calculations
  const getExitRecommendation = () => {
    switch (fanProfile.transitMode) {
      case "metro":
        return {
          recommendedExitGate: "Gate C (East Fan Zone)",
          transitHub: "Lusail Metro Red Line - Platform 3",
          staggerWindow: "Depart 5 mins before whistle OR wait 10 mins post-match",
          avoidZone: "Gate A (Main Metro Plaza) - 1,400 person peak bottleneck",
          timeSaved: "18 mins"
        };
      case "uber":
        return {
          recommendedExitGate: "Gate E / South Shuttle Hub",
          transitHub: "Designated Rideshare Pick-up Bay R-2",
          staggerWindow: "Request Uber right at 88' minute",
          avoidZone: "North Ring Road Taxi Loop (Gridlock)",
          timeSaved: "12 mins"
        };
      case "car":
        return {
          recommendedExitGate: "Gate H (North-West Transit)",
          transitHub: "Multi-story Car Park P-2 (Exit Lane B)",
          staggerWindow: "Depart at 90+2' or wait 15 mins post-match",
          avoidZone: "South Perimeter Boulevard",
          timeSaved: "15 mins"
        };
      case "bus":
      default:
        return {
          recommendedExitGate: "Gate D (South-East Shuttle)",
          transitHub: "Express Shuttle Platform B",
          staggerWindow: "Board Express Shuttle within 8 mins of whistle",
          avoidZone: "East Pedestrian Overpass",
          timeSaved: "10 mins"
        };
    }
  };

  const exitInfo = getExitRecommendation();

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                FAN COPILOT ACTIVE
              </span>
              <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                Personalized Fan Copilot
              </h1>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              AI-driven individual guidance for gate entry, seat navigation, amenity wait times, and exit timing
            </p>
          </div>

          {/* Quick Forecast Mode Selector */}
          <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border shrink-0">
            <span className="text-[11px] font-mono text-muted-foreground px-2">Predictive Horizon:</span>
            {(["NOW", "+5MIN", "+10MIN"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setForecastMode(mode)}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-mono font-bold transition-all",
                  forecastMode === mode
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Fan Profile & Context Controls Header Bar */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Interactive Fan Ticket & Context Settings</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              Match Status: <strong className="text-foreground">{stadiumData.matchInfo.status}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Target Seat Section */}
            <div className="space-y-1">
              <label htmlFor="ticket-section-select" className="text-[10px] font-mono text-muted-foreground uppercase">Ticket Section</label>
              <select
                id="ticket-section-select"
                value={fanProfile.seatSection}
                onChange={(e) => updateFanProfile({ seatSection: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {stadiumData.sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Gate */}
            <div className="space-y-1">
              <label htmlFor="preferred-gate-select" className="text-[10px] font-mono text-muted-foreground uppercase">Nearby / Preferred Gate</label>
              <select
                id="preferred-gate-select"
                value={fanProfile.preferredGateId}
                onChange={(e) => updateFanProfile({ preferredGateId: e.target.value })}
                className="w-full bg-muted/50 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {stadiumData.gates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transit Mode */}
            <div className="space-y-1">
              <label id="transit-mode-label" className="text-[10px] font-mono text-muted-foreground uppercase">Transit Mode</label>
              <div role="group" aria-labelledby="transit-mode-label" className="grid grid-cols-4 gap-1">
                {[
                  { id: "metro", icon: Train, label: "Metro" },
                  { id: "uber", icon: Car, label: "Uber" },
                  { id: "car", icon: Car, label: "Car" },
                  { id: "bus", icon: Bus, label: "Bus" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateFanProfile({ transitMode: item.id as any })}
                    aria-pressed={fanProfile.transitMode === item.id}
                    className={cn(
                      "flex flex-col items-center justify-center p-1.5 rounded border text-[10px] transition-all",
                      fanProfile.transitMode === item.id
                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5 mb-0.5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Match Phase */}
            <div className="space-y-1">
              <label htmlFor="journey-phase-select" className="text-[10px] font-mono text-muted-foreground uppercase">Stadium Journey Phase</label>
              <select
                id="journey-phase-select"
                value={fanProfile.matchPhase}
                onChange={(e) => updateFanProfile({ matchPhase: e.target.value as any })}
                className="w-full bg-muted/50 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="entry">1. Pre-Match Gate Entry</option>
                <option value="in_seat">2. In-Seat Live Match</option>
                <option value="halftime">3. Halftime Concourse Break</option>
                <option value="exit">4. Post-Match Egress Exit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Copilot Capabilities (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. Best Entry Gate Advisor */}
            <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Best Entry Gate Recommendation</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Saves ~{timeSavedGate} Mins
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Default/Busy Gate */}
                <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 font-bold uppercase">
                    <span>Default / High Queue</span>
                    <span>{busyEntryGate.queueLength} In Line</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{busyEntryGate.name}</h4>
                  <p className="text-[10px] text-muted-foreground">High congestion due to train arrivals. Est. wait: 18-22 mins.</p>
                </div>

                {/* AI Recommended Gate */}
                <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    <span>★ AI Recommended</span>
                    <span>{bestEntryGate.queueLength} In Line</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{bestEntryGate.name}</h4>
                  <p className="text-[10px] text-emerald-300 font-medium">Optimal flow. Turnstile throughput: 160 fans/min. Est. wait: ~3 mins.</p>
                </div>
              </div>
            </div>

            {/* 2. Turn-by-Turn Wayfinder */}
            <SeatWayfinderMap />

            {/* 3. Lowest Queue Amenities Radar */}
            <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-400" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Lowest Queue Amenities Radar</h3>
                    <p className="text-[10px] text-muted-foreground">Real-time queue & predicted wait time</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border shrink-0">
                  <button
                    onClick={() => setActiveAmenityTab("food")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-medium transition-all",
                      activeAmenityTab === "food" ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30" : "text-muted-foreground"
                    )}
                  >
                    Food & Grill
                  </button>
                  <button
                    onClick={() => setActiveAmenityTab("restroom")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-medium transition-all",
                      activeAmenityTab === "restroom" ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30" : "text-muted-foreground"
                    )}
                  >
                    Restrooms
                  </button>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-2.5">
                {currentAmenities.map((amenity) => {
                  const effectiveQueue = 
                    forecastMode === "+5MIN" ? amenity.predictedQueue5m :
                    forecastMode === "+10MIN" ? amenity.predictedQueue10m :
                    amenity.currentQueue;

                  const waitMins = Math.max(1, Math.round(effectiveQueue / 15));
                  const isLowest = amenity === currentAmenities.reduce((min, cur) => cur.currentQueue < min.currentQueue ? cur : min, currentAmenities[0]);

                  return (
                    <div
                      key={amenity.id}
                      className={cn(
                        "p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all",
                        isLowest
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-muted/20 border-border/70"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-foreground">{amenity.name}</h4>
                          {isLowest && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              SHORTEST LINE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{amenity.location}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                        <div className="text-right">
                          <span className="text-muted-foreground text-[10px] block">Queue:</span>
                          <span className={cn("font-bold", effectiveQueue > 150 ? "text-rose-400" : effectiveQueue > 60 ? "text-amber-400" : "text-emerald-400")}>
                            {effectiveQueue} people
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground text-[10px] block">Est Wait:</span>
                          <span className="font-bold text-foreground">~{waitMins} mins</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Timing Advice */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
                <Clock className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold font-mono text-[10px] uppercase text-amber-400 block">Smart Halftime Concession Timing Tip</span>
                  <span>Concourse queues spike by 300% during the first 5 minutes of halftime. Head out 3 minutes before the halftime whistle (min 42) to cut wait time from 18 mins to 2 mins!</span>
                </div>
              </div>
            </div>

            {/* 4. Smart Staggered Exit Recommendations */}
            <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Smart Staggered Exit Guidance</h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">
                  Mode: {fanProfile.transitMode.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-muted/30 border border-border/70 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">Optimal Exit Gate</span>
                  <p className="font-bold text-foreground">{exitInfo.recommendedExitGate}</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-1">Direct route to {exitInfo.transitHub}</p>
                </div>

                <div className="bg-muted/30 border border-border/70 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">Departure Window</span>
                  <p className="font-bold text-indigo-300">{exitInfo.staggerWindow}</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-1">Avoids {exitInfo.avoidZone}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Conversational AI Assistant Widget (5 Cols) */}
          <div className="lg:col-span-5 sticky top-4">
            <CopilotChatWidget fullHeight />
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
