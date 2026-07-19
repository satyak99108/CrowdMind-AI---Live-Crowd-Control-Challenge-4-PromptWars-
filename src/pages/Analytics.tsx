import React, { useMemo } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../components/ui/chart";
import { NeonPatternDefs } from "../components/NeonPatternDefs";
import { useNeonCharts } from "../hooks/use-neon-charts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Activity, Users } from "lucide-react";
import { getStatusColor } from "../components/StadiumMap";

export default function Analytics() {
  const { stadiumData } = useCrowd();
  const { getFill } = useNeonCharts();

  const gateData = useMemo(() => {
    return stadiumData.gates.map((g) => ({
      name: g.id.replace("gate-", "").toUpperCase(),
      rate: g.entryRate,
      occupancy: Math.round((g.currentOccupancy / g.capacity) * 100),
      fill: getStatusColor(g.status)
    }));
  }, [stadiumData.gates]);

  const gateChartConfig: ChartConfig = {
    rate: { label: "Entry Rate (fans/min)", color: "hsl(var(--primary))" }
  };

  const sectorData = useMemo(() => {
    return stadiumData.sectors.map((s) => ({
      name: s.name.replace(" (Lower Tier)", "").replace(" (Upper Tier)", ""),
      value: Math.round((s.currentOccupancy / s.capacity) * 100),
      fill: getStatusColor(s.status)
    }));
  }, [stadiumData.sectors]);

  const sectorChartConfig: ChartConfig = {
    value: { label: "Occupancy Density %", color: "hsl(var(--info))" }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-card shrink-0">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Real-Time Predictive Analytics & Heatmaps</h1>
            <p className="text-[11px] text-muted-foreground">Inflow rate throughput graphs and sector density breakdown</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <NeonPatternDefs colors={gateData.map((d) => d.fill)} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Gate Inflow Throughput (fans/min)
                </h2>
                <p className="text-[11px] text-muted-foreground">Real-time entry rate across Gates A-H</p>
              </div>

              <ChartContainer config={gateChartConfig} className="h-[260px] w-full">
                <BarChart data={gateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" radius={2}>
                    {gateData.map((entry, i) => (
                      <Cell key={i} {...getFill(entry.fill)} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="border border-border rounded-lg bg-card p-5 space-y-4 shadow-sm">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Sector Crowd Saturation %
                </h2>
                <p className="text-[11px] text-muted-foreground">Density distribution across stadium rings</p>
              </div>

              <ChartContainer config={sectorChartConfig} className="h-[260px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={sectorData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {sectorData.map((entry, i) => (
                      <Cell key={i} {...getFill(entry.fill)} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
