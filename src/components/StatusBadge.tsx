import { cn } from "../lib/utils";

export type IncidentStatus = "new" | "assigned" | "in_progress" | "testing" | "resolved" | "closed";

const statusConfig: Record<IncidentStatus, { label: string; dotClass: string }> = {
  new: { label: "Detected", dotClass: "bg-info" },
  assigned: { label: "Monitoring", dotClass: "bg-primary" },
  in_progress: { label: "Dispatching", dotClass: "bg-warning" },
  testing: { label: "Mitigating", dotClass: "bg-[hsl(280,60%,55%)]" },
  resolved: { label: "Resolved", dotClass: "bg-success" },
  closed: { label: "Closed", dotClass: "bg-muted-foreground" },
};

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const config = statusConfig[status] || statusConfig["new"];
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full shrink-0", config.dotClass)} />
      {config.label}
    </span>
  );
}
