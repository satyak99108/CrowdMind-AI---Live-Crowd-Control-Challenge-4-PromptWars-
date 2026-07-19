import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCrowd, Incident } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/ui/button";
import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, updateIncidentStatus } = useCrowd();

  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    return (
      <AppLayout>
        <div className="p-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">Incident not found or has been purged.</p>
          <Button onClick={() => navigate("/incidents")} size="sm">
            Back to Incident Triage
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/incidents")} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">{incident.trackingId}</span>
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
              </div>
              <h1 className="text-base font-bold leading-tight mt-0.5">{incident.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono hidden sm:inline">Update Status:</span>
            <Select
              value={incident.status}
              onValueChange={(val: Incident["status"]) => updateIncidentStatus(incident.id, val)}
            >
              <SelectTrigger className="h-8 text-xs font-mono w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New (Detected)</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">Dispatching</SelectItem>
                <SelectItem value="testing">Mitigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 max-w-[1200px] mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-border rounded-lg bg-card p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold border-b border-border pb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Incident Synopsis & Telemetry
                </h2>

                <div className="space-y-2 text-xs leading-relaxed text-foreground/90">
                  <p className="font-semibold text-muted-foreground">Location Target:</p>
                  <p className="text-sm font-mono font-bold text-primary">{incident.location}</p>
                </div>

                <div className="space-y-2 text-xs leading-relaxed text-foreground/90 pt-2 border-t border-border/50">
                  <p className="font-semibold text-muted-foreground">Telemetry Anomaly Description:</p>
                  <p className="text-sm bg-muted/20 p-3 rounded border border-border">{incident.description}</p>
                </div>

                <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Lightbulb className="h-4 w-4" /> AI Crowd Controller Recommendation
                  </div>
                  <p className="text-foreground/90 text-xs leading-relaxed">{incident.recommendedAction}</p>
                  <Button
                    size="sm"
                    onClick={() => updateIncidentStatus(incident.id, "in_progress")}
                    className="h-7 text-[11px] mt-2 gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Execute Recommended Action
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-border rounded-lg bg-card p-5 space-y-4 text-xs shadow-sm">
                <h3 className="font-bold border-b border-border pb-2 text-muted-foreground uppercase tracking-wider font-mono">
                  Incident Metadata
                </h3>

                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking ID</span>
                    <span className="font-bold text-primary">{incident.trackingId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Assignee</span>
                    <span className="font-medium text-foreground">{incident.assignee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reported</span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
