// Stadium initial layout and sector definition for FIFA World Cup Stadium

export const INITIAL_STADIUM_DATA = {
  stadiumName: "Lusail Iconic Stadium",
  venueCode: "FWC-STAD-01",
  totalCapacity: 80000,
  matchInfo: {
    teams: "ARGENTINA vs FRANCE",
    stage: "FINAL MATCH",
    kickoffTime: "20:00 UTC",
    status: "PRE-MATCH ENTRY"
  },
  // Active Gates monitoring
  gates: [
    {
      id: "gate-a",
      name: "Gate A (North Metro Entrance)",
      sector: "North",
      capacity: 12000,
      currentOccupancy: 6840,
      entryRate: 240, // fans/min
      queueLength: 480,
      status: "moderate", // < 50% low, 50-80% moderate, > 80% high
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
  // Stadium Seating Rings & Zones
  sectors: [
    // Lower Tier
    { id: "sec-north-lower", name: "North Stand (Lower Tier)", category: "Lower Ring", capacity: 10000, currentOccupancy: 8100, status: "high", density: 0.81, pathId: "north-lower" },
    { id: "sec-east-lower", name: "East Stand (Lower Tier)", category: "Lower Ring", capacity: 12000, currentOccupancy: 8640, status: "moderate", density: 0.72, pathId: "east-lower" },
    { id: "sec-south-lower", name: "South Stand (Lower Tier)", category: "Lower Ring", capacity: 10000, currentOccupancy: 4800, status: "low", density: 0.48, pathId: "south-lower" },
    { id: "sec-west-lower", name: "West Stand (Lower Tier)", category: "Lower Ring", capacity: 12000, currentOccupancy: 10440, status: "high", density: 0.87, pathId: "west-lower" },
    
    // Upper Tier
    { id: "sec-north-upper", name: "North Stand (Upper Tier)", category: "Upper Ring", capacity: 8000, currentOccupancy: 5600, status: "moderate", density: 0.70, pathId: "north-upper" },
    { id: "sec-east-upper", name: "East Stand (Upper Tier)", category: "Upper Ring", capacity: 10000, currentOccupancy: 4100, status: "low", density: 0.41, pathId: "east-upper" },
    { id: "sec-south-upper", name: "South Stand (Upper Tier)", category: "Upper Ring", capacity: 8000, currentOccupancy: 2800, status: "low", density: 0.35, pathId: "south-upper" },
    { id: "sec-west-upper", name: "West Stand (Upper Tier)", category: "Upper Ring", capacity: 10000, currentOccupancy: 7900, status: "moderate", density: 0.79, pathId: "west-upper" },
    
    // Concourses & Amenities
    { id: "sec-north-concourse", name: "North Concourse & Food Plaza", category: "Concourse", capacity: 5000, currentOccupancy: 4350, status: "high", density: 0.87, pathId: "north-concourse" },
    { id: "sec-east-concourse", name: "East Concourse", category: "Concourse", capacity: 5000, currentOccupancy: 2900, status: "moderate", density: 0.58, pathId: "east-concourse" },
    { id: "sec-south-concourse", name: "South Concourse & Fan Shop", category: "Concourse", capacity: 5000, currentOccupancy: 1850, status: "low", density: 0.37, pathId: "south-concourse" },
    { id: "sec-west-concourse", name: "West VIP Terrace", category: "Concourse", capacity: 4000, currentOccupancy: 3400, status: "high", density: 0.85, pathId: "west-concourse" }
  ]
};

export const CONGESTION_THRESHOLD = {
  LOW: 0.50, // < 50% = Green
  MODERATE: 0.80 // 50-80% = Yellow, > 80% = Red
};

export function getStatusFromOccupancy(current, max) {
  const ratio = current / max;
  if (ratio >= CONGESTION_THRESHOLD.MODERATE) return "high";
  if (ratio >= CONGESTION_THRESHOLD.LOW) return "moderate";
  return "low";
}

export function getStatusColor(status) {
  switch (status) {
    case "high":
      return "#ef4444"; // Crimson Red
    case "moderate":
      return "#f59e0b"; // Amber Yellow
    case "low":
    default:
      return "#10b981"; // Emerald Green
  }
}
