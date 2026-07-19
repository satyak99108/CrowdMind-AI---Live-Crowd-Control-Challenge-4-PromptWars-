import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface Gate {
  id: string;
  name: string;
  sector: string;
  capacity: number;
  currentOccupancy: number;
  entryRate: number;
  queueLength: number;
  status: "low" | "moderate" | "high";
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
  status: "low" | "moderate" | "high";
  density: number;
  pathId: string;
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
  type: "INFO" | "WARNING" | "ALERT" | "SYSTEM" | "SCENARIO";
  message: string;
}

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
      entryRate: 240,
      queueLength: 480,
      status: "moderate",
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
      entryRate: 110,
      queueLength: 140,
      status: "low",
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
      entryRate: 160,
      queueLength: 290,
      status: "low",
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
      entryRate: 195,
      queueLength: 410,
      status: "moderate",
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
      entryRate: 130,
      queueLength: 180,
      status: "low",
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
      entryRate: 65,
      queueLength: 45,
      status: "low",
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
      entryRate: 275,
      queueLength: 520,
      status: "moderate",
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
      entryRate: 170,
      queueLength: 320,
      status: "low",
      trend: "stable",
      type: "gate",
      coords: { x: 220, y: 180, radius: 28 }
    }
  ],
  sectors: [
    { id: "sec-north-lower", name: "North Stand (Lower Tier)", category: "Lower Ring", capacity: 10000, currentOccupancy: 8100, status: "high", density: 0.81, pathId: "north-lower" },
    { id: "sec-east-lower", name: "East Stand (Lower Tier)", category: "Lower Ring", capacity: 12000, currentOccupancy: 8640, status: "moderate", density: 0.72, pathId: "east-lower" },
    { id: "sec-south-lower", name: "South Stand (Lower Tier)", category: "Lower Ring", capacity: 10000, currentOccupancy: 4800, status: "low", density: 0.48, pathId: "south-lower" },
    { id: "sec-west-lower", name: "West Stand (Lower Tier)", category: "Lower Ring", capacity: 12000, currentOccupancy: 10440, status: "high", density: 0.87, pathId: "west-lower" },
    { id: "sec-north-upper", name: "North Stand (Upper Tier)", category: "Upper Ring", capacity: 8000, currentOccupancy: 5600, status: "moderate", density: 0.70, pathId: "north-upper" },
    { id: "sec-east-upper", name: "East Stand (Upper Tier)", category: "Upper Ring", capacity: 10000, currentOccupancy: 4100, status: "low", density: 0.41, pathId: "east-upper" },
    { id: "sec-south-upper", name: "South Stand (Upper Tier)", category: "Upper Ring", capacity: 8000, currentOccupancy: 2800, status: "low", density: 0.35, pathId: "south-upper" },
    { id: "sec-west-upper", name: "West Stand (Upper Tier)", category: "Upper Ring", capacity: 10000, currentOccupancy: 7900, status: "moderate", density: 0.79, pathId: "west-upper" },
    { id: "sec-north-concourse", name: "North Concourse & Food Plaza", category: "Concourse", capacity: 5000, currentOccupancy: 4350, status: "high", density: 0.87, pathId: "north-concourse" },
    { id: "sec-east-concourse", name: "East Concourse", category: "Concourse", capacity: 5000, currentOccupancy: 2900, status: "moderate", density: 0.58, pathId: "east-concourse" },
    { id: "sec-south-concourse", name: "South Concourse & Fan Shop", category: "Concourse", capacity: 5000, currentOccupancy: 1850, status: "low", density: 0.37, pathId: "south-concourse" },
    { id: "sec-west-concourse", name: "West VIP Terrace", category: "Concourse", capacity: 4000, currentOccupancy: 3400, status: "high", density: 0.85, pathId: "west-concourse" }
  ]
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
  },
  {
    id: "inc-103",
    trackingId: "CMD-803",
    title: "Gate G Queue Overflow into West Boulevard",
    location: "Gate G (West Main Boulevard)",
    severity: "medium",
    status: "new",
    description: "Queue tailing back 120 meters due to slow digital ticket scanner response.",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    assignee: "Unassigned",
    recommendedAction: "Reboot scanner lanes 3 & 4 and activate handheld manual validators."
  },
  {
    id: "inc-104",
    trackingId: "CMD-804",
    title: "West Stand Lower Tier High Capacity Threshold Alert",
    location: "West Stand (Lower Tier)",
    severity: "high",
    status: "testing",
    description: "Occupancy crossed 87% (10,440/12,000). AISLE 14 aisleways partially blocked.",
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    assignee: "Safety Officer Chen",
    recommendedAction: "Instruct stadium announcers to direct fans to upper tier stairwells."
  },
  {
    id: "inc-105",
    trackingId: "CMD-805",
    title: "South Shuttle Gate E Underutilization",
    location: "Gate E (South Shuttle Hub)",
    severity: "low",
    status: "resolved",
    description: "Gate E operating at only 36% capacity while Gate D is bottlenecked.",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    assignee: "Operations Lead Marcus",
    recommendedAction: "Adjust shuttle bus drop-off points to balance Gate D and E load."
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
  logs: LogEntry[];
  incidents: Incident[];
  selectedItem: Gate | Sector | null;
  setSelectedItem: (item: Gate | Sector | null) => void;
  startSim: () => void;
  pauseSim: () => void;
  setSimSpeed: (speed: number) => void;
  setSimScenario: (scenario: string) => void;
  injectSpike: (gateId: string) => void;
  updateIncidentStatus: (id: string, status: Incident["status"]) => void;
  addIncident: (newInc: Partial<Incident>) => void;
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
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toLocaleTimeString(), type: "SYSTEM", message: "CrowdMind AI Telemetry Engine Online" },
    { id: 2, timestamp: new Date().toLocaleTimeString(), type: "INFO", message: "Pre-Match telemetry stream initialized for Lusail Iconic Stadium" }
  ]);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedItem, setSelectedItem] = useState<Gate | Sector | null>(null);

  const speedRef = useRef(1);
  const scenarioRef = useRef("PRE_MATCH");
  const isRunningRef = useRef(true);

  // Tick simulation loop
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

        const updatedGates = prevData.gates.map((gate) => {
          let deltaRate = (Math.random() * 20 - 10);
          if (scenario === "PRE_MATCH" && (gate.id === "gate-a" || gate.id === "gate-g")) deltaRate += 12;
          if (scenario === "POST_MATCH") deltaRate += 18;

          const newRate = Math.max(30, Math.min(450, Math.round(gate.entryRate + deltaRate)));
          const netChange = Math.floor((newRate / 60) * (2 * currentSpeed)) + (Math.floor(Math.random() * 9) - 4);
          const newOccupancy = Math.max(100, Math.min(gate.capacity, gate.currentOccupancy + netChange));
          const newQueue = Math.max(10, Math.round(gate.queueLength + (netChange * 0.7) - 2));

          const occupancyRatio = newOccupancy / gate.capacity;
          const status: Gate["status"] = occupancyRatio >= 0.8 ? "high" : occupancyRatio >= 0.5 ? "moderate" : "low";
          const trend: Gate["trend"] = netChange > 2 ? "up" : netChange < -2 ? "down" : "stable";

          if (gate.status !== status && status === "high") {
            const logMsg = `CRITICAL SPIKE: ${gate.name} reached ${Math.round(occupancyRatio * 100)}% capacity!`;
            setLogs((prevLogs) => [
              { id: Date.now() + Math.random(), timestamp: new Date().toLocaleTimeString(), type: "ALERT", message: logMsg },
              ...prevLogs.slice(0, 75)
            ]);
          }

          return {
            ...gate,
            entryRate: newRate,
            currentOccupancy: newOccupancy,
            queueLength: newQueue,
            status,
            trend
          };
        });

        const updatedSectors = prevData.sectors.map((sector) => {
          let sectorDelta = Math.floor(Math.random() * 21) - 9;
          if (scenario === "HALFTIME" && sector.category === "Concourse") sectorDelta += 24;

          const newOcc = Math.max(100, Math.min(sector.capacity, sector.currentOccupancy + sectorDelta));
          const density = Number((newOcc / sector.capacity).toFixed(2));
          const status: Sector["status"] = density >= 0.8 ? "high" : density >= 0.5 ? "moderate" : "low";

          return {
            ...sector,
            currentOccupancy: newOcc,
            density,
            status
          };
        });

        return {
          ...prevData,
          gates: updatedGates,
          sectors: updatedSectors
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

    // Apply baseline adjust
    setStadiumData((prev) => ({
      ...prev,
      gates: prev.gates.map((g) => {
        let occRatio = 0.45;
        if (scenarioKey === "PRE_MATCH" && (g.id === "gate-a" || g.id === "gate-g")) occRatio = 0.88;
        if (scenarioKey === "POST_MATCH") occRatio = 0.85;

        const newOcc = Math.floor(g.capacity * occRatio);
        const status: Gate["status"] = occRatio >= 0.8 ? "high" : occRatio >= 0.5 ? "moderate" : "low";
        return {
          ...g,
          currentOccupancy: newOcc,
          queueLength: Math.floor(g.capacity * occRatio * 0.08),
          entryRate: Math.floor(100 + occRatio * 200),
          status
        };
      })
    }));
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
            queueLength: g.queueLength + 500,
            entryRate: g.entryRate + 150,
            status: "high",
            trend: "up"
          };
        }
        return g;
      })
    }));

    const target = stadiumData.gates.find((g) => g.id === gateId);
    const gateName = target ? target.name : gateId;

    setLogs((prev) => [
      { id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "ALERT", message: `MANUAL CONGESTION SPIKE injected at ${gateName}` },
      ...prev
    ]);

    // Add high severity incident
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      trackingId: `CMD-${Math.floor(100 + Math.random() * 900)}`,
      title: `Emergency Bottleneck Spike at ${gateName}`,
      location: gateName,
      severity: "critical",
      status: "new",
      description: `Manual congestion injection triggered queue spike of +500 fans. Occupancy exceeded 95%.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: "Unassigned",
      recommendedAction: "Immediately activate auxiliary relief turnstiles and broadcast queue reroute."
    };
    setIncidents((prev) => [newInc, ...prev]);
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

  return (
    <CrowdContext.Provider
      value={{
        stadiumData,
        simState,
        logs,
        incidents,
        selectedItem,
        setSelectedItem,
        startSim,
        pauseSim,
        setSimSpeed,
        setSimScenario,
        injectSpike,
        updateIncidentStatus,
        addIncident
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
