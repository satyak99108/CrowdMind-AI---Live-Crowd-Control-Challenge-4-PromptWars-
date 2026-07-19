import React, { useMemo } from "react";
import { useCrowd } from "../contexts/CrowdContext";
import { AppLayout } from "../components/AppLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../components/ui/chart";
import { NeonPatternDefs } from "../components/NeonPatternDefs";
import { useNeonCharts } from "../hooks/use-neon-charts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Activity, Sparkles, Users } from "lucide-react";
import { getStatusColor } from "../components/StadiumMap";
import { PredictiveForecastBar } from "../components/PredictiveForecastBar";

export default function Analytics() {
  const { stadiumData } = useCrowd();

  const gateData = useMemo(() => {
    return stadiumData.gates.map((g) => ({
      name: g.id.replace("gate-", "").toUpperCase(),
      currentQueue: g.queueLength,
      predictedQueue5m: g.predictedQueue5m,
      predictedQueue10m: g.predictedQueue10m
    }));
  }, [stadiumData.gates]);

  const gateChartConfig: ChartConfig = {
    currentQueue: { label: "Current Queue (now)", color: "hsl(var(--primary))" },
    predictedQueue5m: { label: "Predicted (+5m)", color: "hsl(250, 80%, 65%)" },
    predictedQueue10m: { label: "Predicted (+10m)", color: "hsl(350, 80%, 60%)" }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Real-Time & Predictive AI Crowd Analytics</h1>
            <p className="text-[11px] text-muted-foreground">Comparative queue projection graphs 5–10 minutes ahead across Gates A-H</p>
          </div>
        </div>

        <PredictiveForecastBar />

        <div className="border border-border rounded-lg bg-card p-5 space-y-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" /> Gate Queue Length Forecast (Current vs +5m vs +10m)
            </h2>
            <p className="text-[11px] text-muted-foreground">AI Predictive extrapolation predicting queue backlogs across gates</p>
          </div>

          <ChartContainer config={gateChartConfig} className="h-[320px] w-full">
            <BarChart data={gateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="currentQueue" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} name="Current Queue" />
              <Bar dataKey="predictedQueue5m" fill="#818cf8" radius={[2, 2, 0, 0]} name="+5 Min Forecast" />
              <Bar dataKey="predictedQueue10m" fill="#fb7185" radius={[2, 2, 0, 0]} name="+10 Min Forecast" />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </AppLayout>
  );
}
