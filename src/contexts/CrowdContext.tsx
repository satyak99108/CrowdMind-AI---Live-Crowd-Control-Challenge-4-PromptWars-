import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface Gate {
  id: string;
  name: string;
  sector: string;
  capacity: number;
  currentOccupancy: number;
  predictedOccupancy5m: number;
  predictedOccupancy10m: number;
  entryRate: number;
  queueLength: number;
  predictedQueue5m: number;
  predictedQueue10m: number;
  status: "low" | "moderate" | "high";
  predictedStatus5m: "low" | "moderate" | "high";
  predictedStatus10m: "low" | "moderate" | "high";
  trend: "up" | "down" | "stable";
  type: "gate";
  coords: { x: number; y: number; radius: number };
}

export interface Sector {
  id: string;
  name: string;
  category: "Lower Ring" | "Upper Ring" | "Concourse";
  capacity: number;
  currentOccupancy: number;
  predictedOccupancy5m: number;
  predictedOccupancy10m: number;
  status: "low" | "moderate" | "high";
  predictedStatus5m: "low" | "moderate" | "high";
  predictedStatus10m: "low" | "moderate" | "high";
  density: number;
  predictedDensity5m: number;
  predictedDensity10m: number;
  pathId: string;
}

export interface Amenity {
  id: string;
  name: string;
  type: "food_court" | "restroom";
  location: string;
  capacity: number;
  currentQueue: number;
  predictedQueue5m: number;
  predictedQueue10m: number;
  status: "low" | "moderate" | "high";
  predictedStatus5m: "low" | "moderate" | "high";
  predictedStatus10m: "low" | "moderate" | "high";
}

export interface StadiumData {
  stadiumName: string;
  venueCode: string;
  totalCapacity: number;
  matchInfo: {
    teams: string;
    stage: string;
    kickoffTime: string;
    status: string;
  };
  gates: Gate[];
  sectors: Sector[];
  amenities: Amenity[];
}

export interface Incident {
  id: string;
  trackingId: string;
  title: string;
  location: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "new" | "assigned" | "in_progress" | "testing" | "resolved" | "closed";
  description: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  recommendedAction: string;
}

export interface LogEntry {
  id: string | number;
  timestamp: string;
  type: "INFO" | "WARNING" | "ALERT" | "SYSTEM" | "SCENARIO" | "PREDICTION" | "RECOMMENDATION";
  message: string;
}

export interface Recommendation {
  id: string;
  type: "gate_reroute" | "food_court_alt" | "restroom_alt" | "concession_wait";
  title: string;
  actionText: string;
  timeSavedMinutes: number;
  sourceZone: string;
  targetZone: string;
  urgency: "high" | "medium" | "low";
  llmReasoning: string; // Transparent WHY explanation
  telemetryEvidence: {
    sourceOccupancy: string;
    targetOccupancy: string;
    timeHorizon: string;
    throughputDiff: string;
  };
  status: "active" | "executed" | "dismissed";
}

export type ForecastMode = "NOW" | "+5MIN" | "+10MIN";

export const INITIAL_AMENITIES: Amenity[] = [
  {
    id: "fc-north",
    name: "North Concourse Food Plaza",
    type: "food_court",
    location: "North Concourse Level 1",
    capacity: 300,
    currentQueue: 180,
    predictedQueue5m: 240,
    predictedQueue10m: 310,
    status: "moderate",
    predictedStatus5m: "high",
    predictedStatus10m: "high"
  },
  {
    id: "fc-west",
    name: "West VIP Grill & Bar",
    type: "food_court",
    location: "West Terrace Level 2",
    capacity: 150,
    currentQueue: 45,
    predictedQueue5m: 60,
    predictedQueue10m: 75,
    status: "low",
    predictedStatus5m: "low",
    predictedStatus10m: "moderate"
  },
  {
    id: "rr-north-1",
    name: "Restroom Block A (North)",
    type: "restroom",
    location: "North Concourse Gate A",
    capacity: 80,
    currentQueue: 65,
    predictedQueue5m: 85,
    predictedQueue10m: 110,
    status: "high",
    predictedStatus5m: "high",
    predictedStatus10m: "high"
  },
  {
    id: "rr-south-2",
    name: "Restroom Block D (South)",
    type: "restroom",
    location: "South Shuttle Hub",
    capacity: 100,
    currentQueue: 25,
    predictedQueue5m: 30,
    predictedQueue10m: 40,
    status: "low",
    predictedStatus5m: "low",
    predictedStatus10m: "low"
  }
];

export const INITIAL_STADIUM_DATA: StadiumData = {
  stadiumName: "Lusail Iconic Stadium",
  venueCode: "FWC-STAD-01",
  totalCapacity: 80000,
  matchInfo: {
    teams: "ARGENTINA vs FRANCE",
    stage: "FINAL MATCH",
    kickoffTime: "20:00 UTC",
    status: "PRE-MATCH ENTRY"
  },
  gates: [
    {
      id: "gate-a",
      name: "Gate A (North Metro Entrance)",
      sector: "North",
      capacity: 12000,
      currentOccupancy: 6840,
      predictedOccupancy5m: 8200,
      predictedOccupancy10m: 10100,
      entryRate: 240,
      queueLength: 480,
      predictedQueue5m: 650,
      predictedQueue10m: 890,
      status: "moderate",
      predictedStatus5m: "high",
      predictedStatus10m: "high",
      trend: "up",
      type: "gate",
      coords: { x: 500, y: 80, radius: 28 }
    },
    {
      id: "gate-b",
      name: "Gate B (North-East Plaza)",
      sector: "North-East",
      capacity: 10000,
      currentOccupancy: 3200,
      predictedOccupancy5m: 3600,
      predictedOccupancy10m: 4100,
      entryRate: 110,
      queueLength: 140,
      predictedQueue5m: 160,
      predictedQueue10m: 190,
      status: "low",
      predictedStatus5m: "low",
      predictedStatus10m: "low",
      trend: "stable",
      type: "gate",
      coords: { x: 780, y: 180, radius: 28 }
    },
    {
      id: "gate-c",
      name: "Gate C (East Fan Zone)",
      sector: "East",
      capacity: 10000,
      currentOccupancy: 4100,
      predictedOccupancy5m: 4800,
      predictedOccupancy10m: 5700,
      entryRate: 160,
      queueLength: 290,
      predictedQueue5m: 350,
      predictedQueue10m: 430,
      status: "low",
      predictedStatus5m: "moderate",
      predictedStatus10m: "moderate",
      trend: "up",
      type: "gate",
      coords: { x: 880, y: 380, radius: 28 }
    },
    {
      id: "gate-d",
      name: "Gate D (South-East Parking)",
      sector: "South-East",
      capacity: 8000,
      currentOccupancy: 5800,
      predictedOccupancy5m: 6400,
      predictedOccupancy10m: 7200,
      entryRate: 195,
      queueLength: 410,
      predictedQueue5m: 510,
      predictedQueue10m: 640,
      status: "moderate",
      predictedStatus5m: "high",
      predictedStatus10m: "high",
      trend: "up",
      type: "gate",
      coords: { x: 780, y: 580, radius: 28 }
    },
    {
      id: "gate-e",
      name: "Gate E (South Shuttle Hub)",
      sector: "South",
      capacity: 12000,
      currentOccupancy: 4400,
      predictedOccupancy5m: 4200,
      predictedOccupancy10m: 3900,
      entryRate: 130,
      queueLength: 180,
      predictedQueue5m: 140,
      predictedQueue10m: 110,
      status: "low",
      predictedStatus5m: "low",
      predictedStatus10m: "low",
      trend: "down",
      type: "gate",
      coords: { x: 500, y: 680, radius: 28 }
    },
    {
      id: "gate-f",
      name: "Gate F (South-West VIP Gate)",
      sector: "South-West",
      capacity: 6000,
      currentOccupancy: 1800,
      predictedOccupancy5m: 1950,
      predictedOccupancy10m: 2100,
      entryRate: 65,
      queueLength: 45,
      predictedQueue5m: 50,
      predictedQueue10m: 60,
      status: "low",
      predictedStatus5m: "low",
      predictedStatus10m: "low",
      trend: "stable",
      type: "gate",
      coords: { x: 220, y: 580, radius: 28 }
    },
    {
      id: "gate-g",
      name: "Gate G (West Main Boulevard)",
      sector: "West",
      capacity: 12000,
      currentOccupancy: 6400,
      predictedOccupancy5m: 7800,
      predictedOccupancy10m: 9600,
      entryRate: 275,
      queueLength: 520,
      predictedQueue5m: 710,
      predictedQueue10m: 940,
      status: "moderate",
      predictedStatus5m: "high",
      predictedStatus10m: "high",
      trend: "up",
      type: "gate",
      coords: { x: 120, y: 380, radius: 28 }
    },
    {
      id: "gate-h",
      name: "Gate H (North-West Transit)",
      sector: "North-West",
      capacity: 10000,
      currentOccupancy: 4700,
      predictedOccupancy5m: 5100,
      predictedOccupancy10m: 5600,
      entryRate: 170,
      queueLength: 320,
      predictedQueue5m: 360,
      predictedQueue10m: 410,
      status: "low",
      predictedStatus5m: "moderate",
      predictedStatus10m: "moderate",
      trend: "stable",
      type: "gate",
      coords: { x: 220, y: 180, radius: 28 }
    }
  ],
  sectors: [
    { id: "sec-north-lower", name: "North Stand (Lower Tier)", category: "Lower Ring", capacity: 10000, currentOccupancy: 8100, predictedOccupancy5m: 8900, predictedOccupancy10m: 9600, status: "high", predictedStatus5m: "high", predictedStatus10m: "high", density: 0.81, predictedDensity5m: 0.89, predictedDensity10m: 0.96, pathId: "north-lower" },
    { id: "sec-east-lower", name: "East Stand (Lower Tier)", category: "Lower Ring", capacity: 12000, currentOccupancy: 8640, predictedOccupancy5m: 9400, predictedOccupancy10m: 10200, status: "moderate", predictedStatus5m: "high", predictedStatus10m: "high", density: 0.72, predictedDensity5m: 0.78, predictedDensity10m: 0.85, pathId: "east-lower" },
    { id: "sec-south-lower", name: "South Stand (Lower Tier)", category: "Lower Ring", capacity: 10000, currentOccupancy: 4800, predictedOccupancy5m: 5200, predictedOccupancy10m: 5700, status: "low", predictedStatus5m: "low", predictedStatus10m: "moderate", density: 0.48, predictedDensity5m: 0.52, predictedDensity10m: 0.57, pathId: "south-lower" },
    { id: "sec-west-lower", name: "West Stand (Lower Tier)", category: "Lower Ring", capacity: 12000, currentOccupancy: 10440, predictedOccupancy5m: 11100, predictedOccupancy10m: 11800, status: "high", predictedStatus5m: "high", predictedStatus10m: "high", density: 0.87, predictedDensity5m: 0.92, predictedDensity10m: 0.98, pathId: "west-lower" },
    { id: "sec-north-upper", name: "North Stand (Upper Tier)", category: "Upper Ring", capacity: 8000, currentOccupancy: 5600, predictedOccupancy5m: 6100, predictedOccupancy10m: 6700, status: "moderate", predictedStatus5m: "moderate", predictedStatus10m: "high", density: 0.70, predictedDensity5m: 0.76, predictedDensity10m: 0.84, pathId: "north-upper" },
    { id: "sec-east-upper", name: "East Stand (Upper Tier)", category: "Upper Ring", capacity: 10000, currentOccupancy: 4100, predictedOccupancy5m: 4500, predictedOccupancy10m: 5000, status: "low", predictedStatus5m: "low", predictedStatus10m: "moderate", density: 0.41, predictedDensity5m: 0.45, predictedDensity10m: 0.50, pathId: "east-upper" },
    { id: "sec-south-upper", name: "South Stand (Upper Tier)", category: "Upper Ring", capacity: 8000, currentOccupancy: 2800, predictedOccupancy5m: 3100, predictedOccupancy10m: 3500, status: "low", predictedStatus5m: "low", predictedStatus10m: "low", density: 0.35, predictedDensity5m: 0.38, predictedDensity10m: 0.43, pathId: "south-upper" },
    { id: "sec-west-upper", name: "West Stand (Upper Tier)", category: "Upper Ring", capacity: 10000, currentOccupancy: 7900, predictedOccupancy5m: 8400, predictedOccupancy10m: 9100, status: "moderate", predictedStatus5m: "high", predictedStatus10m: "high", density: 0.79, predictedDensity5m: 0.84, predictedDensity10m: 0.91, pathId: "west-upper" },
    { id: "sec-north-concourse", name: "North Concourse & Food Plaza", category: "Concourse", capacity: 5000, currentOccupancy: 4350, predictedOccupancy5m: 4650, predictedOccupancy10m: 4900, status: "high", predictedStatus5m: "high", predictedStatus10m: "high", density: 0.87, predictedDensity5m: 0.93, predictedDensity10m: 0.98, pathId: "north-concourse" },
    { id: "sec-east-concourse", name: "East Concourse", category: "Concourse", capacity: 5000, currentOccupancy: 2900, predictedOccupancy5m: 3200, predictedOccupancy10m: 3600, status: "moderate", predictedStatus5m: "moderate", predictedStatus10m: "moderate", density: 0.58, predictedDensity5m: 0.64, predictedDensity10m: 0.72, pathId: "east-concourse" },
    { id: "sec-south-concourse", name: "South Concourse & Fan Shop", category: "Concourse", capacity: 5000, currentOccupancy: 1850, predictedOccupancy5m: 2000, predictedOccupancy10m: 2200, status: "low", predictedStatus5m: "low", predictedStatus10m: "low", density: 0.37, predictedDensity5m: 0.40, predictedDensity10m: 0.44, pathId: "south-concourse" },
    { id: "sec-west-concourse", name: "West VIP Terrace", category: "Concourse", capacity: 4000, currentOccupancy: 3400, predictedOccupancy5m: 3600, predictedOccupancy10m: 3850, status: "high", predictedStatus5m: "high", predictedStatus10m: "high", density: 0.85, predictedDensity5m: 0.90, predictedDensity10m: 0.96, pathId: "west-concourse" }
  ],
  amenities: INITIAL_AMENITIES
};

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc-101",
    trackingId: "CMD-801",
    title: "Metro Crowd Surge at Gate A Entry",
    location: "Gate A (North Metro Entrance)",
    severity: "critical",
    status: "in_progress",
    description: "Train arrival generated a sudden backlog of 750+ fans exceeding turnstile throughput.",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    assignee: "Commander Sarah Vance",
    recommendedAction: "Reroute incoming metro fans via LED digital signs toward Gate B (22% capacity free)."
  },
  {
    id: "inc-102",
    trackingId: "CMD-802",
    title: "North Concourse Food Plaza Density Bottleneck",
    location: "North Concourse & Food Plaza",
    severity: "high",
    status: "assigned",
    description: "Concourse density reaching 87%. Fan movement stagnated near concession stand #4.",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    assignee: "Steward Dispatcher Ray",
    recommendedAction: "Deploy 8 crowd marshals to establish one-way foot traffic lanes."
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-01",
    type: "gate_reroute",
    title: "Perimeter Gate Rerouting Recommendation",
    actionText: "Redirect incoming fans from Gate A to Gate C — Save 15 Minutes",
    timeSavedMinutes: 15,
    sourceZone: "Gate A (North Metro Entrance)",
    targetZone: "Gate C (East Fan Zone)",
    urgency: "high",
    llmReasoning: "Gate A occupancy is currently at 57% and predicted to surge to 84% (+10m) with an 890 queue backlog. Gate C is running at 41% occupancy with only 290 queue length. Redirecting incoming fans via North LED signs balances perimeter throughput and reduces entry wait time by 15 minutes.",
    telemetryEvidence: {
      sourceOccupancy: "57% now → 84% (+10m)",
      targetOccupancy: "41% now → 57% (+10m)",
      timeHorizon: "+10 Min Forecast",
      throughputDiff: "Gate C has 120 fans/min excess turnstile bandwidth"
    },
    status: "active"
  },
  {
    id: "rec-02",
    type: "food_court_alt",
    title: "Concourse Concession Guidance",
    actionText: "Visit West VIP Grill instead of North Food Plaza — Save 12 Minutes",
    timeSavedMinutes: 12,
    sourceZone: "North Concourse Food Plaza",
    targetZone: "West VIP Grill & Bar",
    urgency: "high",
    llmReasoning: "North Concourse Food Plaza is experiencing 87% density with a predicted 10m queue of 310 fans. West VIP Grill has only 45 queue backlog (30% capacity). Diverting fan stream saves 12 minutes of concourse wait time.",
    telemetryEvidence: {
      sourceOccupancy: "180 in queue → 310 (+10m)",
      targetOccupancy: "45 in queue → 75 (+10m)",
      timeHorizon: "+10 Min Forecast",
      throughputDiff: "West Grill wait time is 3 min vs 15 min at North Plaza"
    },
    status: "active"
  },
  {
    id: "rec-03",
    type: "restroom_alt",
    title: "Sanitation Routing Recommendation",
    actionText: "Use Restroom Block D (South) instead of Block A (North) — Save 8 Minutes",
    timeSavedMinutes: 8,
    sourceZone: "Restroom Block A (North)",
    targetZone: "Restroom Block D (South)",
    urgency: "medium",
    llmReasoning: "Restroom Block A (North) queue is at 81% capacity (predicted 110 fans in line at +10m). Restroom Block D (South Shuttle Hub) has only 25 fans in line. Directing fans south cuts restroom wait times by 8 minutes.",
    telemetryEvidence: {
      sourceOccupancy: "65 queue → 110 (+10m)",
      targetOccupancy: "25 queue → 40 (+10m)",
      timeHorizon: "+10 Min Forecast",
      throughputDiff: "South Hub wait time is 2 min vs 10 min at North Block"
    },
    status: "active"
  },
  {
    id: "rec-04",
    type: "concession_wait",
    title: "Halftime Concourse Timing Guidance",
    actionText: "Wait 7 Minutes before visiting concession stands to avoid peak surge",
    timeSavedMinutes: 10,
    sourceZone: "Concourse Concession Stand #4",
    targetZone: "Concourse Concession Stand #4",
    urgency: "medium",
    llmReasoning: "Concourse density spikes by 24% during the first 5 minutes of halftime. Waiting 7 minutes allows the initial wave to pass, dropping stand queue wait times from 16 minutes down to 4 minutes.",
    telemetryEvidence: {
      sourceOccupancy: "Peak surge at min 45–50",
      targetOccupancy: "Optimal flow at min 52",
      timeHorizon: "+5 Min Forecast",
      throughputDiff: "7-minute delay saves 12 minutes in physical queue"
    },
    status: "active"
  }
];

interface CrowdContextType {
  stadiumData: StadiumData;
  simState: {
    matchMinute: number;
    speed: number;
    scenario: string;
    isRunning: boolean;
  };
  forecastMode: ForecastMode;
  setForecastMode: (mode: ForecastMode) => void;
  logs: LogEntry[];
  incidents: Incident[];
  recommendations: Recommendation[];
  selectedItem: Gate | Sector | Amenity | null;
  setSelectedItem: (item: Gate | Sector | Amenity | null) => void;
  startSim: () => void;
  pauseSim: () => void;
  setSimSpeed: (speed: number) => void;
  setSimScenario: (scenario: string) => void;
  injectSpike: (gateId: string) => void;
  updateIncidentStatus: (id: string, status: Incident["status"]) => void;
  addIncident: (newInc: Partial<Incident>) => void;
  executeRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
}

const CrowdContext = createContext<CrowdContextType | undefined>(undefined);

export const CrowdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stadiumData, setStadiumData] = useState<StadiumData>(INITIAL_STADIUM_DATA);
  const [simState, setSimState] = useState({
    matchMinute: -45,
    speed: 1,
    scenario: "PRE_MATCH",
    isRunning: true
  });
  const [forecastMode, setForecastMode] = useState<ForecastMode>("NOW");
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toLocaleTimeString(), type: "SYSTEM", message: "CrowdMind AI Telemetry & Predictive AI Engine Online" },
    { id: 2, timestamp: new Date().toLocaleTimeString(), type: "PREDICTION", message: "AI Prediction Engine: 5m & 10m crowd forecasting active" },
    { id: 3, timestamp: new Date().toLocaleTimeString(), type: "RECOMMENDATION", message: "MVP 3 Generative AI Recommendation Engine ready" }
  ]);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [selectedItem, setSelectedItem] = useState<Gate | Sector | Amenity | null>(null);

  const speedRef = useRef(1);
  const scenarioRef = useRef("PRE_MATCH");
  const isRunningRef = useRef(true);

  useEffect(() => {
    let intervalId: any = null;

    const tick = () => {
      if (!isRunningRef.current) return;

      setSimState((prev) => ({
        ...prev,
        matchMinute: prev.matchMinute < 120 ? Math.min(120, prev.matchMinute + 0.2 * speedRef.current) : -45
      }));

      setStadiumData((prevData) => {
        const scenario = scenarioRef.current;
        const currentSpeed = speedRef.current;

        // Gates update & 5m/10m forecasting
        const updatedGates = prevData.gates.map((gate) => {
          let deltaRate = Math.random() * 20 - 10;
          if (scenario === "PRE_MATCH" && (gate.id === "gate-a" || gate.id === "gate-g")) deltaRate += 12;
          if (scenario === "POST_MATCH") deltaRate += 18;

          const newRate = Math.max(30, Math.min(450, Math.round(gate.entryRate + deltaRate)));
          const netChange = Math.floor((newRate / 60) * (2 * currentSpeed)) + (Math.floor(Math.random() * 9) - 4);
          const newOccupancy = Math.max(100, Math.min(gate.capacity, gate.currentOccupancy + netChange));
          const newQueue = Math.max(10, Math.round(gate.queueLength + (netChange * 0.7) - 2));

          const occupancyRatio = newOccupancy / gate.capacity;
          const status: Gate["status"] = occupancyRatio >= 0.8 ? "high" : occupancyRatio >= 0.5 ? "moderate" : "low";
          const trend: Gate["trend"] = netChange > 2 ? "up" : netChange < -2 ? "down" : "stable";

          const multiplier5m = trend === "up" ? 1.25 : trend === "down" ? 0.85 : 1.05;
          const multiplier10m = trend === "up" ? 1.55 : trend === "down" ? 0.70 : 1.10;

          const predOcc5m = Math.max(100, Math.min(gate.capacity, Math.round(newOccupancy + newRate * 5 * 0.85 * multiplier5m)));
          const predOcc10m = Math.max(100, Math.min(gate.capacity, Math.round(newOccupancy + newRate * 10 * 0.80 * multiplier10m)));

          const predQueue5m = Math.max(10, Math.round(newQueue + (newRate * 0.4 * multiplier5m)));
          const predQueue10m = Math.max(10, Math.round(newQueue + (newRate * 0.85 * multiplier10m)));

          const ratio5m = predOcc5m / gate.capacity;
          const ratio10m = predOcc10m / gate.capacity;

          const predStatus5m: Gate["status"] = ratio5m >= 0.8 ? "high" : ratio5m >= 0.5 ? "moderate" : "low";
          const predStatus10m: Gate["status"] = ratio10m >= 0.8 ? "high" : ratio10m >= 0.5 ? "moderate" : "low";

          return {
            ...gate,
            entryRate: newRate,
            currentOccupancy: newOccupancy,
            predictedOccupancy5m: predOcc5m,
            predictedOccupancy10m: predOcc10m,
            queueLength: newQueue,
            predictedQueue5m: predQueue5m,
            predictedQueue10m: predQueue10m,
            status,
            predictedStatus5m: predStatus5m,
            predictedStatus10m: predStatus10m,
            trend
          };
        });

        // Sectors update & 5m/10m forecasting
        const updatedSectors = prevData.sectors.map((sector) => {
          let sectorDelta = Math.floor(Math.random() * 21) - 9;
          if (scenario === "HALFTIME" && sector.category === "Concourse") sectorDelta += 24;

          const newOcc = Math.max(100, Math.min(sector.capacity, sector.currentOccupancy + sectorDelta));
          const density = Number((newOcc / sector.capacity).toFixed(2));
          const status: Sector["status"] = density >= 0.8 ? "high" : density >= 0.5 ? "moderate" : "low";

          const predOcc5m = Math.max(100, Math.min(sector.capacity, Math.round(newOcc + sectorDelta * 5)));
          const predOcc10m = Math.max(100, Math.min(sector.capacity, Math.round(newOcc + sectorDelta * 10)));

          const predDens5m = Number((predOcc5m / sector.capacity).toFixed(2));
          const predDens10m = Number((predOcc10m / sector.capacity).toFixed(2));

          const predStatus5m: Sector["status"] = predDens5m >= 0.8 ? "high" : predDens5m >= 0.5 ? "moderate" : "low";
          const predStatus10m: Sector["status"] = predDens10m >= 0.8 ? "high" : predDens10m >= 0.5 ? "moderate" : "low";

          return {
            ...sector,
            currentOccupancy: newOcc,
            predictedOccupancy5m: predOcc5m,
            predictedOccupancy10m: predOcc10m,
            density,
            predictedDensity5m: predDens5m,
            predictedDensity10m: predDens10m,
            status,
            predictedStatus5m: predStatus5m,
            predictedStatus10m: predStatus10m
          };
        });

        // Amenities update & 5m/10m forecasting
        const updatedAmenities = prevData.amenities.map((am) => {
          let queueDelta = Math.floor(Math.random() * 9) - 4;
          if (scenario === "HALFTIME") queueDelta += 8;

          const newQueue = Math.max(5, Math.min(am.capacity, am.currentQueue + queueDelta));
          const predQueue5m = Math.max(5, Math.min(am.capacity * 1.3, Math.round(newQueue + queueDelta * 4)));
          const predQueue10m = Math.max(5, Math.min(am.capacity * 1.5, Math.round(newQueue + queueDelta * 8)));

          const status: Amenity["status"] = newQueue / am.capacity >= 0.8 ? "high" : newQueue / am.capacity >= 0.5 ? "moderate" : "low";
          const predStatus5m: Amenity["status"] = predQueue5m / am.capacity >= 0.8 ? "high" : predQueue5m / am.capacity >= 0.5 ? "moderate" : "low";
          const predStatus10m: Amenity["status"] = predQueue10m / am.capacity >= 0.8 ? "high" : predQueue10m / am.capacity >= 0.5 ? "moderate" : "low";

          return {
            ...am,
            currentQueue: newQueue,
            predictedQueue5m: predQueue5m,
            predictedQueue10m: predQueue10m,
            status,
            predictedStatus5m: predStatus5m,
            predictedStatus10m: predStatus10m
          };
        });

        return {
          ...prevData,
          gates: updatedGates,
          sectors: updatedSectors,
          amenities: updatedAmenities
        };
      });
    };

    intervalId = setInterval(tick, 1200);
    return () => clearInterval(intervalId);
  }, []);

  const startSim = () => {
    isRunningRef.current = true;
    setSimState((prev) => ({ ...prev, isRunning: true }));
    setLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "SYSTEM", message: "Simulation Resumed" }, ...prev]);
  };

  const pauseSim = () => {
    isRunningRef.current = false;
    setSimState((prev) => ({ ...prev, isRunning: false }));
    setLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "SYSTEM", message: "Simulation Paused" }, ...prev]);
  };

  const setSimSpeed = (speed: number) => {
    speedRef.current = speed;
    setSimState((prev) => ({ ...prev, speed }));
    setLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "SYSTEM", message: `Simulation Speed set to ${speed}x` }, ...prev]);
  };

  const setSimScenario = (scenarioKey: string) => {
    scenarioRef.current = scenarioKey;
    let matchMinute = -45;
    if (scenarioKey === "PRE_MATCH") matchMinute = -30;
    if (scenarioKey === "HALFTIME") matchMinute = 45;
    if (scenarioKey === "POST_MATCH") matchMinute = 90;

    setSimState((prev) => ({ ...prev, scenario: scenarioKey, matchMinute }));
    setLogs((prev) => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "SCENARIO", message: `Scenario Switch: ${scenarioKey}` }, ...prev]);
  };

  const injectSpike = (gateId: string) => {
    setStadiumData((prev) => ({
      ...prev,
      gates: prev.gates.map((g) => {
        if (g.id === gateId) {
          const spikedOcc = Math.floor(g.capacity * 0.95);
          return {
            ...g,
            currentOccupancy: spikedOcc,
            predictedOccupancy5m: Math.floor(g.capacity * 0.98),
            predictedOccupancy10m: g.capacity,
            queueLength: g.queueLength + 500,
            predictedQueue5m: g.queueLength + 700,
            predictedQueue10m: g.queueLength + 900,
            status: "high",
            predictedStatus5m: "high",
            predictedStatus10m: "high",
            trend: "up"
          };
        }
        return g;
      })
    }));

    const target = stadiumData.gates.find((g) => g.id === gateId);
    const gateName = target ? target.name : gateId;

    setLogs((prev) => [
      { id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "ALERT", message: `MANUAL SPIKE: Emergency bottleneck injected at ${gateName}` },
      ...prev
    ]);
  };

  const updateIncidentStatus = (id: string, status: Incident["status"]) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status, updatedAt: new Date().toISOString() } : inc))
    );
  };

  const addIncident = (newInc: Partial<Incident>) => {
    const fullInc: Incident = {
      id: `inc-${Date.now()}`,
      trackingId: `CMD-${Math.floor(100 + Math.random() * 900)}`,
      title: newInc.title || "Crowd Incident Alert",
      location: newInc.location || "Stadium Perimeter",
      severity: newInc.severity || "medium",
      status: newInc.status || "new",
      description: newInc.description || "Reported crowd congestion or bottleneck event.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: newInc.assignee || "Unassigned",
      recommendedAction: newInc.recommendedAction || "Inspect zone telemetry and dispatch field steward team."
    };
    setIncidents((prev) => [fullInc, ...prev]);
  };

  const executeRecommendation = (id: string) => {
    const rec = recommendations.find((r) => r.id === id);
    if (!rec) return;

    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "executed" } : r))
    );

    setLogs((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: "RECOMMENDATION",
        message: `EXECUTION SUCCESS: ${rec.actionText} (Saved ${rec.timeSavedMinutes}m crowd wait time)`
      },
      ...prev
    ]);
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r))
    );
  };

  return (
    <CrowdContext.Provider
      value={{
        stadiumData,
        simState,
        forecastMode,
        setForecastMode,
        logs,
        incidents,
        recommendations,
        selectedItem,
        setSelectedItem,
        startSim,
        pauseSim,
        setSimSpeed,
        setSimScenario,
        injectSpike,
        updateIncidentStatus,
        addIncident,
        executeRecommendation,
        dismissRecommendation
      }}
    >
      {children}
    </CrowdContext.Provider>
  );
};

export const useCrowd = () => {
  const context = useContext(CrowdContext);
  if (!context) throw new Error("useCrowd must be used within a CrowdProvider");
  return context;
};
