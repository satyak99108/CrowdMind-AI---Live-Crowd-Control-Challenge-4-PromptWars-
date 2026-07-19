import { LayoutDashboard, Grid, AlertTriangle, BarChart3, Settings, Activity, Sparkles, Bot } from "lucide-react";
import { StackedLogo } from "./StackedLogo";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useCrowd } from "../contexts/CrowdContext";

export const navItems = [
  { icon: LayoutDashboard, label: "Live Telemetry", path: "/dashboard" },
  { icon: Bot, label: "Fan Copilot (MVP 4)", path: "/copilot" },
  { icon: Sparkles, label: "AI Recommendations", path: "/recommendations" },
  { icon: Grid, label: "Gates & Sectors", path: "/gates" },
  { icon: AlertTriangle, label: "Incident Triage", path: "/incidents" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Sim Controls & Config", path: "/settings" },
];

export function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const location = useLocation();
  const { incidents, simState, recommendations } = useCrowd();

  const openIncidentsCount = incidents.filter(i => !["resolved", "closed"].includes(i.status)).length;
  const criticalCount = incidents.filter(i => i.severity === "critical" && !["resolved", "closed"].includes(i.status)).length;
  const activeRecsCount = recommendations.filter(r => r.status === "active").length;

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-between px-3 h-12 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center text-primary">
            <StackedLogo size={14} color="currentColor" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-[0.08em] text-[13px] text-sidebar-accent-foreground leading-none">
                CrowdMind AI
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">LIVE CONTROL</span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <span className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider",
            simState.isRunning ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          )}>
            <Activity className="w-2.5 h-2.5 mr-1 animate-pulse" />
            {simState.isRunning ? "LIVE" : "PAUSED"}
          </span>
        )}
      </div>

      <nav className="flex-1 py-2 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded text-[13px] font-medium transition-all group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary" : "text-muted-foreground")} />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

              {!collapsed && item.path === "/recommendations" && activeRecsCount > 0 && (
                <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeRecsCount}
                </span>
              )}

              {!collapsed && item.path === "/incidents" && openIncidentsCount > 0 && (
                <span className={cn(
                  "ml-auto text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full",
                  criticalCount > 0 ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-muted text-muted-foreground"
                )}>
                  {openIncidentsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 mx-2 mb-2 rounded border border-border/50 bg-card/40 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Stadium Mode</span>
            <span className="font-mono text-foreground font-medium">{simState.scenario}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Simulation Speed</span>
            <span className="font-mono text-primary font-bold">{simState.speed}x</span>
          </div>
        </div>
      )}

      <div className="border-t border-sidebar-border p-2">
        <ThemeToggle />
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 w-56">
      <SidebarContent />
    </aside>
  );
}
