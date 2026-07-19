import React from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { Navigation, Footprints, Clock, ShieldCheck, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export function SeatWayfinderMap() {
  const { fanProfile, stadiumData } = useCrowd();

  // Selected Section target info
  const currentSection = stadiumData.sectors.find((s) => s.id === fanProfile.seatSection) || stadiumData.sectors[4];

  // Route steps calculation based on profile
  const routeSteps = [
    {
      step: 1,
      title: "Entry Security Gate",
      detail: `Enter via Gate C (East Fan Zone)`,
      status: "low",
      time: "1.5 mins",
      instruction: "Scan mobile QR ticket at Turnstiles 5-8 (lowest line)."
    },
    {
      step: 2,
      title: "East Interior Concourse",
      detail: "Walk 120m straight past Fan Merch Kiosk",
      status: currentSection.density > 0.8 ? "high" : currentSection.density > 0.5 ? "moderate" : "low",
      time: "1.0 min",
      instruction: "Stay on the inner walking lane to bypass food stand queue."
    },
    {
      step: 3,
      title: "Escalator Bay E-3",
      detail: "Ascend to Upper Level 2",
      status: "low",
      time: "1.0 min",
      instruction: "Take Escalator E-3 directly up to Section 100-112 corridor."
    },
    {
      step: 4,
      title: "Seat Arrival",
      detail: `${currentSection.name} • ${fanProfile.seatRow}, ${fanProfile.seatNumber}`,
      status: "low",
      time: "0.5 mins",
      instruction: "Present ticket to Sector 104 usher at Portal 12."
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Turn-By-Turn Seat Wayfinder</h3>
            <p className="text-[10px] text-muted-foreground">Optimal indoor route with lowest crowd congestion</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
            TOTAL TIME: ~4 MINS
          </span>
          <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
            DISTANCE: 210M
          </span>
        </div>
      </div>

      {/* SVG Path Diagram */}
      <div className="relative bg-background/80 border border-border/70 rounded-lg p-3 overflow-hidden flex items-center justify-center min-h-[200px]">
        <svg viewBox="0 0 800 240" className="w-full h-auto max-h-[220px]">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <path d="M 50 120 C 200 40, 350 200, 500 100 T 750 120" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />

          {/* Active Route Path */}
          <path d="M 50 120 C 200 40, 350 200, 500 100 T 750 120" fill="none" stroke="url(#routeGrad)" strokeWidth="6" strokeDasharray="8 4" className="animate-pulse" />

          {/* Waypoint 1 - Gate */}
          <g transform="translate(50, 120)">
            <circle r="18" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
            <circle r="6" fill="#10b981" />
            <text x="0" y="34" fill="currentColor" textAnchor="middle" className="text-[10px] font-mono font-bold fill-foreground">Gate C</text>
          </g>

          {/* Waypoint 2 - Concourse */}
          <g transform="translate(270, 105)">
            <circle r="16" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="2" />
            <circle r="5" fill="#6366f1" />
            <text x="0" y="32" fill="currentColor" textAnchor="middle" className="text-[10px] font-mono fill-muted-foreground">Concourse E</text>
          </g>

          {/* Waypoint 3 - Escalator */}
          <g transform="translate(500, 100)">
            <circle r="16" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="2" />
            <circle r="5" fill="#6366f1" />
            <text x="0" y="32" fill="currentColor" textAnchor="middle" className="text-[10px] font-mono fill-muted-foreground">Escalator E3</text>
          </g>

          {/* Waypoint 4 - Seat */}
          <g transform="translate(750, 120)">
            <circle r="22" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="3" filter="url(#glow)" />
            <circle r="8" fill="#3b82f6" />
            <text x="0" y="38" fill="currentColor" textAnchor="middle" className="text-[11px] font-mono font-bold fill-primary">SEAT {fanProfile.seatNumber}</text>
          </g>
        </svg>
      </div>

      {/* Step List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {routeSteps.map((s) => (
          <div key={s.step} className="flex items-start gap-3 p-2.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
              {s.step}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-foreground truncate">{s.title}</h4>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {s.time}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{s.detail}</p>
              <p className="text-[10px] text-foreground/80 mt-1 font-sans">{s.instruction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
