import { Link } from "react-router-dom";
import { ArrowRight, Moon, Sun, Activity, Layers, Radio, Cpu, ShieldAlert } from "lucide-react";
import { Logo3D } from "../components/Logo3D";
import { StackedLogo } from "../components/StackedLogo";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const CUBE_SIZE = 840;
const CUBE_OFFSET_X = -140;
const CUBE_OFFSET_Y = -80;

const Landing = () => {
  const { theme, setTheme } = useTheme();
  const [cubeZoom, setCubeZoom] = useState(() => {
    const w = window.innerWidth;
    return w < 1024 ? 270 : 360;
  });

  useEffect(() => {
    const handleResize = () => {
      setCubeZoom(window.innerWidth < 1024 ? 270 : 360);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <nav className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border px-6">
        <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center text-primary">
              <StackedLogo size={15} color="currentColor" />
            </div>
            <span className="text-[14px] font-bold text-foreground tracking-[0.08em] uppercase">
              CrowdMind AI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <Link to="/dashboard">
              <button className="text-[13px] font-medium h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 rounded-sm">
                Launch Command Center <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-16 pb-0 px-6 overflow-hidden">
        <div className="mx-auto max-w-[1200px] relative">
          <div className="pt-[52px] pb-16 relative flex">
            <div className="relative z-[3] flex-1 min-w-0 max-w-[560px]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-primary/30 bg-primary/10 text-primary text-[12px] font-mono mb-4">
                <Radio className="h-3.5 w-3.5 animate-pulse" /> LIVE TELEMETRY & STADIUM CROWD CONTROL
              </div>
              <h1 className="text-[clamp(2.2rem,4vw,3.4rem)] font-[600] leading-[1.08] tracking-[-0.04em] text-foreground">
                Next-Gen Crowd Mind AI for Live Venues & Mega Events
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-[460px]">
                Real-time stadium occupancy heatmaps, perimeter gate congestion tracking, automated bottleneck alerts, and incident triage operations.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Link to="/dashboard">
                  <button className="group relative inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium bg-foreground text-background transition-all duration-200 hover:bg-foreground/90">
                    Open Control Deck
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <Link to="/incidents">
                  <button className="px-5 py-3 text-[14px] border border-border text-foreground hover:bg-muted transition-colors">
                    View Incident Triage
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block flex-1 relative z-[1] pointer-events-none" style={{ minWidth: 0 }}>
              <div
                className="absolute top-1/2 right-0 -translate-y-1/2"
                style={{
                  width: CUBE_SIZE,
                  height: CUBE_SIZE,
                  transform: `translate(${-CUBE_OFFSET_X}px, calc(-50% + ${CUBE_OFFSET_Y}px))`
                }}
              >
                <Logo3D
                  variant={0}
                  size={CUBE_SIZE}
                  zoom={cubeZoom}
                  bgHex={theme === "dark" ? "#0e0e10" : "#ffffff"}
                  lineHex={theme === "dark" ? "#58585e" : "#c0c0c8"}
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-visible">
            <div className="relative z-10 rounded-t-xl border border-b-0 border-border bg-card overflow-hidden">
              <div className="flex min-h-[380px]">
                <div className="w-[200px] border-r border-border p-3 flex flex-col gap-2 shrink-0 bg-sidebar">
                  <div className="flex items-center gap-2 px-2 h-8">
                    <StackedLogo size={16} />
                    <span className="text-xs font-bold font-mono">LUSAIL STADIUM</span>
                  </div>
                  <div className="h-px bg-border my-1" />
                  {["Live Heatmap", "Gates Matrix", "Incident Queue", "Analytics"].map((name, i) => (
                    <div key={i} className={`flex items-center gap-2 px-2.5 h-8 rounded text-xs ${i === 0 ? "bg-sidebar-accent font-semibold" : "text-muted-foreground"}`}>
                      <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-emerald-500 animate-ping" : "bg-muted-foreground/30"}`} />
                      {name}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <Activity className="h-6 w-6 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold">Lusail Iconic Stadium Operational</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    80,000 max venue capacity. Real-time telemetry monitoring 8 perimeter gates and 12 seating ring sectors.
                  </p>
                  <Link to="/dashboard">
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-medium text-xs rounded shadow-lg hover:bg-primary/90 transition-all">
                      Launch Interactive Simulator
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full border-t border-border" />

      <section className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground mb-3 font-mono">
            Key Architecture Features
          </p>
          <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-[600] tracking-[-0.03em] text-foreground max-w-[540px]">
            Engineered for zero latency crowd safety.
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-md overflow-hidden">
            {[
              {
                icon: Layers,
                title: "Perimeter Gate Telemetry",
                desc: "Live throughput monitoring across Gates A-H. Instant detection of queue bottlenecks and entry rate spikes."
              },
              {
                icon: ShieldAlert,
                title: "Crowd Anomaly Triage",
                desc: "Filter, track, and dispatch field stewards for high-density bottlenecks using Kanban and Table views."
              },
              {
                icon: Cpu,
                title: "Predictive Heatmaps",
                desc: "Recharts real-time density visualization for lower tiers, upper tiers, and concourse food plazas."
              }
            ].map((f, i) => (
              <div key={i} className="bg-background p-8 space-y-3">
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border py-6 px-6 bg-sidebar">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono font-bold text-foreground">CROWDMIND AI TELEMETRY PLATFORM</span>
          <span>FIFA World Cup Challenge 4 PromptWars</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
