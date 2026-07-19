import React from "react";
import { useCrowd, Gate, Sector } from "../contexts/CrowdContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { getStatusColor } from "./StadiumMap";
import { Activity, Users, ShieldCheck, Zap, AlertTriangle } from "lucide-react";

export function ZoneDetailModal() {
  const { selectedItem, setSelectedItem, injectSpike, addIncident } = useCrowd();

  if (!selectedItem) return null;

  const isGate = "entryRate" in selectedItem;
  const occupancyPercent = Math.round((selectedItem.currentOccupancy / selectedItem.capacity) * 100);
  const statusColor = getStatusColor(selectedItem.status);

  const handleCreateIncident = () => {
    addIncident({
      title: `High Density Investigation requested at ${selectedItem.name}`,
      location: selectedItem.name,
      severity: occupancyPercent >= 85 ? "critical" : occupancyPercent >= 60 ? "high" : "medium",
      status: "new",
      description: `Manual telemetry inspection reported ${occupancyPercent}% occupancy (${selectedItem.currentOccupancy}/${selectedItem.capacity}).`,
      recommendedAction: "Dispatch field supervisor to verify fan flow and open secondary aisles."
    });
    setSelectedItem(null);
  };

  return (
    <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColor }} />
            <DialogTitle className="text-base font-bold">{selectedItem.name}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            ID: {selectedItem.id} | TYPE: {isGate ? "Perimeter Gate" : "Stadium Seating Sector"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span>Current Occupancy Density</span>
              <span style={{ color: statusColor }} className="font-bold font-mono">
                {occupancyPercent}%
              </span>
            </div>
            <Progress value={occupancyPercent} className="h-2" />
            <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
              <span>{selectedItem.currentOccupancy.toLocaleString()} active fans</span>
              <span>{selectedItem.capacity.toLocaleString()} max capacity</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {isGate && (
              <>
                <div className="p-3 border rounded-md bg-muted/20 space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Entry Rate
                  </span>
                  <p className="text-base font-bold font-mono">{(selectedItem as Gate).entryRate} <span className="text-[10px] font-normal text-muted-foreground">fans/min</span></p>
                </div>
                <div className="p-3 border rounded-md bg-muted/20 space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Queue Backlog
                  </span>
                  <p className="text-base font-bold font-mono">{(selectedItem as Gate).queueLength} <span className="text-[10px] font-normal text-muted-foreground">in line</span></p>
                </div>
              </>
            )}

            {!isGate && (
              <>
                <div className="p-3 border rounded-md bg-muted/20 space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Category
                  </span>
                  <p className="text-sm font-bold">{(selectedItem as Sector).category}</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/20 space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Density Index
                  </span>
                  <p className="text-sm font-bold font-mono">{(selectedItem as Sector).density}</p>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2">
            {isGate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  injectSpike(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="flex-1 text-[12px] gap-1.5 border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
              >
                <Zap className="h-3.5 w-3.5" /> Inject Spike
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateIncident}
              className="flex-1 text-[12px] gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Create Incident Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
