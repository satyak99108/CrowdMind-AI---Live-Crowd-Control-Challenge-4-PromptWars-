import React from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { StadiumMap, getStatusColor } from "../components/StadiumMap";
import { SimController } from "../components/SimController";
import { LiveActivityFeed } from "../components/LiveActivityFeed";
import { ZoneDetailModal } from "../components/ZoneDetailModal";
import { Users, AlertTriangle, Flame, Activity, Clock } from "lucide-react";

export default function Dashboard() {
  const { stadiumData, simState, setSelectedItem } = useCrowd();

  const totalStadiumFans = stadiumData.gates.reduce((sum, g) => sum + g.currentOccupancy, 0);
  const totalPercent = Math.round((totalStadiumFans / stadiumData.totalCapacity) * 100);
  const attendanceStatus: "low" | "moderate" | "high" = totalPercent >= 80 ? "high" : totalPercent >= 50 ? "moderate" : "low";

  const congestedGatesCount = stadiumData.gates.filter((g) => g.status === "high").length;
  const gateStatus: "low" | "moderate" | "high" = congestedGatesCount >= 4 ? "high" : congestedGatesCount >= 2 ? "moderate" : "low";

  const allItems = [...stadiumData.gates, ...stadiumData.sectors];
  const maxDensityItem = allItems.reduce((max, cur) => {
    const curRatio = cur.currentOccupancy / cur.capacity;
    const maxRatio = max.currentOccupancy / max.capacity;
    return curRatio > maxRatio ? cur : max;
  }, allItems[0]);

  const maxDensityRatio = Math.round((maxDensityItem.currentOccupancy / maxDensityItem.capacity) * 100);
  const peakStatus: "low" | "moderate" | "high" = maxDensityRatio >= 80 ? "high" : maxDensityRatio >= 50 ? "moderate" : "low";

  const totalInflowRate = stadiumData.gates.reduce((sum, g) => sum + g.entryRate, 0);
  const inflowStatus: "low" | "moderate" | "high" = totalInflowRate >= 1600 ? "high" : totalInflowRate >= 1000 ? "moderate" : "low";

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-2.5 border-b border-border bg-card shrink-0 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight">{stadiumData.stadiumName}</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                {stadiumData.venueCode}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              {stadiumData.matchInfo.teams} — <span className="text-primary font-semibold">{stadiumData.matchInfo.stage}</span> ({stadiumData.matchInfo.kickoffTime})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono bg-muted/40 px-2.5 py-1 rounded border border-border">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Sim Minute: <strong>{simState.matchMinute}'</strong></span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              TELEMETRY STREAMING
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-background p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground font-medium">Total Attendance</span>
                <Users className="h-4 w-4" style={{ color: getStatusColor(attendanceStatus) }} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{totalStadiumFans.toLocaleString()}</p>
                <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${totalPercent}%`,
                      backgroundColor: getStatusColor(attendanceStatus)
                    }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                {totalPercent}% of {stadiumData.totalCapacity.toLocaleString()} Max Capacity
              </p>
            </div>

            <div className="bg-background p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground font-medium">Congested Gates</span>
                <AlertTriangle className="h-4 w-4" style={{ color: getStatusColor(gateStatus) }} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono" style={{ color: getStatusColor(gateStatus) }}>
                  {congestedGatesCount} / {stadiumData.gates.length} <span className="text-xs font-normal text-muted-foreground">Gates</span>
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                {stadiumData.gates.length - congestedGatesCount} gates running optimal inflow
              </p>
            </div>

            <div className="bg-background p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground font-medium">Peak Density Zone</span>
                <Flame className="h-4 w-4" style={{ color: getStatusColor(peakStatus) }} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono" style={{ color: getStatusColor(peakStatus) }}>
                  {maxDensityRatio}%
                </p>
                <p className="text-xs font-bold truncate mt-1" style={{ color: getStatusColor(peakStatus) }}>
                  {maxDensityItem.name}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">Highest real-time crowd saturation</p>
            </div>

            <div className="bg-background p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground font-medium">Total Inflow Speed</span>
                <Activity className="h-4 w-4" style={{ color: getStatusColor(inflowStatus) }} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono" style={{ color: getStatusColor(inflowStatus) }}>
                  {totalInflowRate.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">fans/min</span>
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">Aggregate perimeter turnstile rate</p>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <StadiumMap />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="border border-border bg-card rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-[12px] font-medium border-b border-border pb-2">
                  <span>Perimeter Gate Occupancy Grid</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Click gate to inspect</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {stadiumData.gates.map((gate) => {
                    const color = getStatusColor(gate.status);
                    return (
                      <div
                        key={gate.id}
                        onClick={() => setSelectedItem(gate)}
                        className="p-2 border border-border rounded bg-background hover:bg-muted/40 cursor-pointer transition-all space-y-1 group"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold group-hover:text-primary">{gate.id.replace("gate-", "").toUpperCase()}</span>
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        </div>
                        <p className="text-[13px] font-bold font-mono" style={{ color }}>
                          {Math.round((gate.currentOccupancy / gate.capacity) * 100)}%
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">{gate.entryRate} f/m</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <SimController />
              <LiveActivityFeed />
            </div>
          </div>
        </div>
      </div>

      <ZoneDetailModal />
    </AppLayout>
  );
}
