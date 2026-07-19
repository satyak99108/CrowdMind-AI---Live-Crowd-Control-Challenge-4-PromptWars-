import React, { useState } from "react";
import { useCrowd, Gate, Sector } from "../contexts/CrowdContext";
import { Layers, Info, Sparkles, Clock } from "lucide-react";

export function getStatusColor(status: "low" | "moderate" | "high") {
  switch (status) {
    case "high":
      return "#ef4444";
    case "moderate":
      return "#f59e0b";
    case "low":
    default:
      return "#10b981";
  }
}

export function StadiumMap() {
  const { stadiumData, selectedItem, setSelectedItem, forecastMode } = useCrowd();
  const [hoveredSector, setHoveredSector] = useState<Gate | Sector | null>(null);

  const getSector = (id: string) => stadiumData.sectors.find((s) => s.id === id);

  const getEffectiveStatus = (item: Gate | Sector) => {
    if (forecastMode === "+5MIN") return item.predictedStatus5m;
    if (forecastMode === "+10MIN") return item.predictedStatus10m;
    return item.status;
  };

  const getEffectiveOccupancy = (item: Gate | Sector) => {
    if (forecastMode === "+5MIN") return item.predictedOccupancy5m;
    if (forecastMode === "+10MIN") return item.predictedOccupancy10m;
    return item.currentOccupancy;
  };

  const getEffectiveQueue = (gate: Gate) => {
    if (forecastMode === "+5MIN") return gate.predictedQueue5m;
    if (forecastMode === "+10MIN") return gate.predictedQueue10m;
    return gate.queueLength;
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: Gate | Sector) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedItem(item);
    }
  };

  const getAriaLabel = (item: Gate | Sector) => {
    const occupancy = getEffectiveOccupancy(item);
    const pct = Math.round((occupancy / item.capacity) * 100);
    const statusText = getEffectiveStatus(item);
    if ("entryRate" in item) {
      const q = getEffectiveQueue(item as Gate);
      return `${item.name}. Status: ${statusText}. Occupancy: ${occupancy.toLocaleString()} of ${item.capacity.toLocaleString()} (${pct}%). Queue: ${q} fans.`;
    }
    return `${item.name}. Status: ${statusText}. Occupancy: ${occupancy.toLocaleString()} of ${item.capacity.toLocaleString()} (${pct}%).`;
  };

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-[13px] font-medium">Interactive Stadium Heatmap Visualizer</span>
          {forecastMode !== "NOW" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3 w-3" /> {forecastMode} PREVIEW
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">Density Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Low (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Mod (50-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>High (&gt;80%)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-background p-4 flex items-center justify-center min-h-[440px]">
        <svg viewBox="0 0 1000 760" className="w-full h-auto max-h-[580px] drop-shadow-md">
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <ellipse cx="500" cy="380" rx="460" ry="320" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          <ellipse cx="500" cy="380" rx="410" ry="275" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="18" strokeDasharray="10 8" />

          {/* Sectors */}
          <path
            d="M 220 220 A 400 260 0 0 1 780 220 L 720 260 A 320 200 0 0 0 280 260 Z"
            fill={getStatusColor(getSector("sec-north-upper") ? getEffectiveStatus(getSector("sec-north-upper")!) : "low")}
            fillOpacity={0.65}
            className="cursor-pointer transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-north-upper") && setSelectedItem(getSector("sec-north-upper")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-north-upper") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-north-upper") ? getAriaLabel(getSector("sec-north-upper")!) : "North Stand (Upper Tier)"}
            onKeyDown={(e) => getSector("sec-north-upper") && handleKeyDown(e, getSector("sec-north-upper")!)}
          />
          <path
            d="M 220 540 A 400 260 0 0 0 780 540 L 720 500 A 320 200 0 0 1 280 500 Z"
            fill={getStatusColor(getSector("sec-south-upper") ? getEffectiveStatus(getSector("sec-south-upper")!) : "low")}
            fillOpacity={0.65}
            className="cursor-pointer transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-south-upper") && setSelectedItem(getSector("sec-south-upper")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-south-upper") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-south-upper") ? getAriaLabel(getSector("sec-south-upper")!) : "South Stand (Upper Tier)"}
            onKeyDown={(e) => getSector("sec-south-upper") && handleKeyDown(e, getSector("sec-south-upper")!)}
          />
          <path
            d="M 780 220 A 400 260 0 0 1 780 540 L 720 500 A 320 200 0 0 0 720 260 Z"
            fill={getStatusColor(getSector("sec-east-upper") ? getEffectiveStatus(getSector("sec-east-upper")!) : "low")}
            fillOpacity={0.65}
            className="cursor-pointer transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-east-upper") && setSelectedItem(getSector("sec-east-upper")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-east-upper") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-east-upper") ? getAriaLabel(getSector("sec-east-upper")!) : "East Stand (Upper Tier)"}
            onKeyDown={(e) => getSector("sec-east-upper") && handleKeyDown(e, getSector("sec-east-upper")!)}
          />
          <path
            d="M 220 220 A 400 260 0 0 0 220 540 L 280 500 A 320 200 0 0 1 280 260 Z"
            fill={getStatusColor(getSector("sec-west-upper") ? getEffectiveStatus(getSector("sec-west-upper")!) : "low")}
            fillOpacity={0.65}
            className="cursor-pointer transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-west-upper") && setSelectedItem(getSector("sec-west-upper")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-west-upper") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-west-upper") ? getAriaLabel(getSector("sec-west-upper")!) : "West Stand (Upper Tier)"}
            onKeyDown={(e) => getSector("sec-west-upper") && handleKeyDown(e, getSector("sec-west-upper")!)}
          />

          <ellipse cx="500" cy="380" rx="310" ry="195" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />

          <path
            d="M 290 265 A 300 185 0 0 1 710 265 L 640 300 A 210 130 0 0 0 360 300 Z"
            fill={getStatusColor(getSector("sec-north-lower") ? getEffectiveStatus(getSector("sec-north-lower")!) : "low")}
            fillOpacity={0.8}
            className="cursor-pointer transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-north-lower") && setSelectedItem(getSector("sec-north-lower")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-north-lower") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-north-lower") ? getAriaLabel(getSector("sec-north-lower")!) : "North Stand (Lower Tier)"}
            onKeyDown={(e) => getSector("sec-north-lower") && handleKeyDown(e, getSector("sec-north-lower")!)}
          />
          <path
            d="M 290 495 A 300 185 0 0 0 710 495 L 640 460 A 210 130 0 0 1 360 460 Z"
            fill={getStatusColor(getSector("sec-south-lower") ? getEffectiveStatus(getSector("sec-south-lower")!) : "low")}
            fillOpacity={0.8}
            className="cursor-pointer transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-south-lower") && setSelectedItem(getSector("sec-south-lower")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-south-lower") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-south-lower") ? getAriaLabel(getSector("sec-south-lower")!) : "South Stand (Lower Tier)"}
            onKeyDown={(e) => getSector("sec-south-lower") && handleKeyDown(e, getSector("sec-south-lower")!)}
          />
          <path
            d="M 710 265 A 300 185 0 0 1 710 495 L 640 460 A 210 130 0 0 0 640 300 Z"
            fill={getStatusColor(getSector("sec-east-lower") ? getEffectiveStatus(getSector("sec-east-lower")!) : "low")}
            fillOpacity={0.8}
            className="cursor-pointer transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-east-lower") && setSelectedItem(getSector("sec-east-lower")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-east-lower") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-east-lower") ? getAriaLabel(getSector("sec-east-lower")!) : "East Stand (Lower Tier)"}
            onKeyDown={(e) => getSector("sec-east-lower") && handleKeyDown(e, getSector("sec-east-lower")!)}
          />
          <path
            d="M 290 265 A 300 185 0 0 0 290 495 L 360 460 A 210 130 0 0 1 360 300 Z"
            fill={getStatusColor(getSector("sec-west-lower") ? getEffectiveStatus(getSector("sec-west-lower")!) : "low")}
            fillOpacity={0.8}
            className="cursor-pointer transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
            onClick={() => getSector("sec-west-lower") && setSelectedItem(getSector("sec-west-lower")!)}
            onMouseEnter={() => setHoveredSector(getSector("sec-west-lower") || null)}
            onMouseLeave={() => setHoveredSector(null)}
            tabIndex={0}
            role="button"
            aria-label={getSector("sec-west-lower") ? getAriaLabel(getSector("sec-west-lower")!) : "West Stand (Lower Tier)"}
            onKeyDown={(e) => getSector("sec-west-lower") && handleKeyDown(e, getSector("sec-west-lower")!)}
          />

          <rect x="375" y="310" width="250" height="140" rx="8" fill="#047857" stroke="#10b981" strokeWidth="2" />
          <line x1="500" y1="310" x2="500" y2="450" stroke="#ffffff" strokeWidth="1.5" opacity={0.6} />
          <circle cx="500" cy="380" r="32" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={0.6} />
          <rect x="375" y="340" width="35" height="80" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={0.6} />
          <rect x="590" y="340" width="35" height="80" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={0.6} />
          <text x="500" y="384" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" letterSpacing="1.5">
            LUSAIL FIELD
          </text>

          {/* Gates */}
          {stadiumData.gates.map((gate) => {
            const status = getEffectiveStatus(gate);
            const color = getStatusColor(status);
            const queue = getEffectiveQueue(gate);
            const isSelected = selectedItem?.id === gate.id;

            return (
              <g
                key={gate.id}
                className="cursor-pointer group focus:outline-none"
                transform={`translate(${gate.coords.x}, ${gate.coords.y})`}
                onClick={() => setSelectedItem(gate)}
                onMouseEnter={() => setHoveredSector(gate)}
                onMouseLeave={() => setHoveredSector(null)}
                tabIndex={0}
                role="button"
                aria-label={getAriaLabel(gate)}
                onKeyDown={(e) => handleKeyDown(e, gate)}
              >
                {status === "high" && (
                  <circle cx="0" cy="0" r="38" fill="rgba(239,68,68,0.25)" className="animate-ping" />
                )}

                <circle
                  cx="0"
                  cy="0"
                  r={gate.coords.radius}
                  fill={color}
                  stroke={isSelected ? "hsl(var(--primary))" : "#ffffff"}
                  strokeWidth={isSelected ? 4 : 2}
                  className="transition-transform group-hover:scale-110"
                  filter={status === "high" ? "url(#glow-red)" : "none"}
                />

                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                  {gate.id.replace("gate-", "").toUpperCase()}
                </text>

                <rect x="-20" y="24" width="40" height="16" rx="4" fill="hsl(var(--background))" stroke={color} strokeWidth="1.5" />
                <text x="0" y="35" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9" fontWeight="700" className="font-mono">
                  {queue}q
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredSector && (
          <div className="absolute bottom-4 left-4 z-20 bg-background/95 backdrop-blur border border-border p-3 rounded-lg shadow-xl text-xs space-y-1 min-w-[220px]">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[13px]" style={{ color: getStatusColor(getEffectiveStatus(hoveredSector)) }}>
                {hoveredSector.name}
              </p>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{forecastMode}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Occupancy ({forecastMode}):</span>
              <span className="font-mono font-medium text-foreground">
                {getEffectiveOccupancy(hoveredSector).toLocaleString()} / {hoveredSector.capacity.toLocaleString()} ({Math.round((getEffectiveOccupancy(hoveredSector) / hoveredSector.capacity) * 100)}%)
              </span>
            </div>

            {"entryRate" in hoveredSector && (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>Entry Speed:</span>
                  <span className="font-mono font-medium text-foreground">{hoveredSector.entryRate} fans/min</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Queue ({forecastMode}):</span>
                  <span className="font-mono font-bold text-indigo-400">{getEffectiveQueue(hoveredSector as Gate)} fans</span>
                </div>
              </>
            )}

            <p className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1">
              <Info className="h-3 w-3" /> Click to view full 5m & 10m prediction breakdown
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
