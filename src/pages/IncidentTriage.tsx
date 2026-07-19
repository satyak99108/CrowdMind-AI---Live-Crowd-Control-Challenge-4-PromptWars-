import React, { useState } from "react";
import { useCrowd, Incident } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Search, Plus, List, LayoutGrid, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColumns: Incident["status"][] = ["new", "assigned", "in_progress", "testing", "resolved", "closed"];

export default function IncidentTriage() {
  const { incidents, addIncident } = useCrowd();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [openAddModal, setOpenAddModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    severity: "high" as Incident["severity"],
    description: "",
    recommendedAction: ""
  });

  const filtered = incidents.filter(
    (inc) =>
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      inc.location.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: incidents.length,
    critical: incidents.filter((i) => i.severity === "critical" && !["resolved", "closed"].includes(i.status)).length,
    open: incidents.filter((i) => !["resolved", "closed"].includes(i.status)).length,
    resolved: incidents.filter((i) => i.status === "resolved" || i.status === "closed").length
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    addIncident({
      ...form,
      status: "new"
    });
    setOpenAddModal(false);
    setForm({ title: "", location: "", severity: "high", description: "", recommendedAction: "" });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card shrink-0">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Crowd Anomaly Triage Queue</h1>
            <p className="text-[11px] text-muted-foreground">Monitor, assign, and mitigate live stadium crowd risks</p>
          </div>
          <Button onClick={() => setOpenAddModal(true)} size="sm" className="h-8 text-[12px] gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Report Incident
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-background p-4">
              <p className="text-[11px] text-muted-foreground font-medium">Total Incidents</p>
              <p className="text-2xl font-bold font-mono mt-1">{counts.total}</p>
            </div>
            <div className="bg-background p-4">
              <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> Active Critical
              </p>
              <p className="text-2xl font-bold font-mono mt-1 text-destructive">{counts.critical}</p>
            </div>
            <div className="bg-background p-4">
              <p className="text-[11px] text-amber-500 font-medium">Pending Triage</p>
              <p className="text-2xl font-bold font-mono mt-1 text-amber-400">{counts.open}</p>
            </div>
            <div className="bg-background p-4">
              <p className="text-[11px] text-emerald-500 font-medium">Mitigated & Closed</p>
              <p className="text-2xl font-bold font-mono mt-1 text-emerald-400">{counts.resolved}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by ID, location, or anomaly title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-[12px]"
              />
            </div>
            <div className="flex items-center border border-border rounded-md bg-muted/20">
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
                className="h-8 w-8 p-0"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("kanban")}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {view === "table" && (
            <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
              <table className="w-full text-[13px] text-left">
                <thead className="bg-muted/40 text-[11px] uppercase font-mono text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5">Incident ID</th>
                    <th className="px-4 py-2.5">Title & Location</th>
                    <th className="px-4 py-2.5">Severity</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Assignee</th>
                    <th className="px-4 py-2.5">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                        No crowd incidents match your filter query.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inc) => (
                      <tr
                        key={inc.id}
                        onClick={() => navigate(`/incidents/${inc.id}`)}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{inc.trackingId}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold leading-tight">{inc.title}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{inc.location}</p>
                        </td>
                        <td className="px-4 py-3"><SeverityBadge severity={inc.severity} /></td>
                        <td className="px-4 py-3"><StatusBadge status={inc.status} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{inc.assignee}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(inc.createdAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {view === "kanban" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statusColumns.map((colStatus) => {
                const colIncidents = filtered.filter((i) => i.status === colStatus);
                return (
                  <div key={colStatus} className="space-y-2">
                    <div className="flex items-center justify-between px-1 border-b border-border pb-1.5">
                      <StatusBadge status={colStatus} />
                      <span className="text-[11px] font-mono text-muted-foreground font-bold">{colIncidents.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colIncidents.map((inc) => (
                        <div
                          key={inc.id}
                          onClick={() => navigate(`/incidents/${inc.id}`)}
                          className="border border-border rounded-lg p-3 bg-card hover:border-primary/50 cursor-pointer space-y-2 shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-primary font-bold">{inc.trackingId}</span>
                            <SeverityBadge severity={inc.severity} />
                          </div>
                          <p className="text-xs font-bold leading-snug line-clamp-2">{inc.title}</p>
                          <p className="text-[11px] text-muted-foreground truncate font-mono">{inc.location}</p>
                        </div>
                      ))}
                      {colIncidents.length === 0 && (
                        <div className="border border-dashed border-border rounded-lg p-4 text-center">
                          <p className="text-[11px] text-muted-foreground font-mono">No incidents</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Report New Crowd Anomaly</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Manually flag a crowd risk, bottleneck, or safety anomaly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Incident Title</Label>
              <Input
                placeholder="e.g. Turnstile scanner malfunction at Gate C"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Location / Gate / Sector</Label>
              <Input
                placeholder="e.g. Gate C (East Fan Zone)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Severity Level</Label>
              <Select
                value={form.severity}
                onValueChange={(val: Incident["severity"]) => setForm({ ...form, severity: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical (Stampede Risk / Evacuation)</SelectItem>
                  <SelectItem value="high">High (Severe Queue Bottleneck &gt;85%)</SelectItem>
                  <SelectItem value="medium">Medium (Concourse Stagnation)</SelectItem>
                  <SelectItem value="low">Low (Minor Delay)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea
                placeholder="Detail the cause and current crowd telemetry..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Recommended Action</Label>
              <Input
                placeholder="e.g. Reroute crowd stream via North LED signs"
                value={form.recommendedAction}
                onChange={(e) => setForm({ ...form, recommendedAction: e.target.value })}
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpenAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit Incident Alert
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
