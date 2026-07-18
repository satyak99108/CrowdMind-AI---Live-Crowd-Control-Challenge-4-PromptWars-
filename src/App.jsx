import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_STADIUM_DATA, getStatusColor } from './data/stadiumData';
import { StadiumSimulationEngine } from './services/simulationEngine';
import Header from './components/Header';
import StadiumMap from './components/StadiumMap';
import GateOccupancyGrid from './components/GateOccupancyGrid';
import SimController from './components/SimController';
import LiveActivityFeed from './components/LiveActivityFeed';
import ZoneDetailModal from './components/ZoneDetailModal';

import { Users, AlertTriangle, Activity, Flame } from 'lucide-react';
import './App.css';

export default function App() {
  const [stadiumData, setStadiumData] = useState(INITIAL_STADIUM_DATA);
  const [simState, setSimState] = useState({
    matchMinute: -45,
    speed: 1,
    scenario: 'PRE_MATCH',
    isRunning: false
  });
  const [logs, setLogs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const engineRef = useRef(null);

  useEffect(() => {
    // Initialize simulation engine
    const engine = new StadiumSimulationEngine(
      INITIAL_STADIUM_DATA,
      (updatedData, updatedState) => {
        setStadiumData(updatedData);
        setSimState(updatedState);
      },
      (logEntry) => {
        setLogs((prevLogs) => [logEntry, ...prevLogs.slice(0, 49)]); // Keep last 50 logs
      }
    );

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.pause();
    };
  }, []);

  // Compute overall stats (sum of all gate metric-val occupancies)
  const totalStadiumFans = stadiumData.gates.reduce((sum, g) => sum + g.currentOccupancy, 0);
  const totalGateCapacity = stadiumData.gates.reduce((sum, g) => sum + g.capacity, 0);
  const totalPercent = Math.round((totalStadiumFans / totalGateCapacity) * 100);

  // 1. Attendance Dynamic Status
  const attendanceStatusClass = totalPercent >= 80 ? 'high' : totalPercent >= 50 ? 'moderate' : 'low';
  const attendanceStatusColor = getStatusColor(attendanceStatusClass);

  // 2. Gate Congestion Dynamic Status (0-2 Low [Green], 3-5 Moderate [Yellow], 6-8 High [Red])
  const congestedGatesCount = stadiumData.gates.filter(g => g.status === 'high').length;
  const gateStatusClass = congestedGatesCount >= 6 ? 'high' : congestedGatesCount >= 3 ? 'moderate' : 'low';
  const gateStatusColor = getStatusColor(gateStatusClass);

  // 3. Peak Density Zone Dynamic Status
  const allItems = [...stadiumData.gates, ...stadiumData.sectors];
  const maxDensityItem = allItems.reduce((max, cur) => {
    const curRatio = cur.currentOccupancy / cur.capacity;
    const maxRatio = max.currentOccupancy / max.capacity;
    return curRatio > maxRatio ? cur : max;
  }, allItems[0]);

  const maxDensityRatio = Math.round((maxDensityItem.currentOccupancy / maxDensityItem.capacity) * 100);
  const peakStatusClass = maxDensityRatio >= 80 ? 'high' : maxDensityRatio >= 50 ? 'moderate' : 'low';
  const peakStatusColor = getStatusColor(peakStatusClass);

  // 4. Aggregate Inflow Speed Dynamic Status
  const totalInflowRate = stadiumData.gates.reduce((sum, g) => sum + g.entryRate, 0);
  const inflowStatusClass = totalInflowRate >= 1600 ? 'high' : totalInflowRate >= 1000 ? 'moderate' : 'low';
  const inflowStatusColor = getStatusColor(inflowStatusClass);

  const handleInjectSpike = (gateId) => {
    if (engineRef.current) {
      engineRef.current.injectCongestionSpike(gateId);
    }
  };

  return (
    <div className="app-container">
      {/* Top Telemetry Header */}
      <Header stadiumData={stadiumData} simState={simState} />

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        {/* Card 1: Total Attendance */}
        <div className={`glass-panel kpi-card ${attendanceStatusClass}`}>
          <div className="kpi-header">
            <span>Total Attendance</span>
            <Users size={18} color={attendanceStatusColor} />
          </div>
          <div className="kpi-value">{totalStadiumFans.toLocaleString()}</div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${totalPercent}%`,
                backgroundColor: attendanceStatusColor
              }}
            />
          </div>
          <div className="kpi-subtext">
            <span>{totalPercent}% of {stadiumData.totalCapacity.toLocaleString()} Max Capacity</span>
          </div>
        </div>

        {/* Card 2: Congested Gates (0-2 Green, 3-5 Yellow, 6-8 Red) */}
        <div className={`glass-panel kpi-card ${gateStatusClass}`}>
          <div className="kpi-header">
            <span>Congested Gates</span>
            <AlertTriangle size={18} color={gateStatusColor} />
          </div>
          <div className="kpi-value" style={{ color: gateStatusColor }}>
            {congestedGatesCount} / {stadiumData.gates.length} Gates
          </div>
          <div className="kpi-subtext">
            <span>{stadiumData.gates.length - congestedGatesCount} gates running optimal entry</span>
          </div>
        </div>

        {/* Card 3: Peak Density Sector */}
        <div className={`glass-panel kpi-card ${peakStatusClass}`}>
          <div className="kpi-header">
            <span>Peak Density Zone</span>
            <Flame size={18} color={peakStatusColor} />
          </div>
          <div className="kpi-value" style={{ color: peakStatusColor }}>{maxDensityRatio}%</div>
          <div className="kpi-subtext">
            <span style={{ color: peakStatusColor, fontWeight: 700 }}>{maxDensityItem.name}</span>
          </div>
        </div>

        {/* Card 4: Active Inflow Speed */}
        <div className={`glass-panel kpi-card ${inflowStatusClass}`}>
          <div className="kpi-header">
            <span>Total Inflow Rate</span>
            <Activity size={18} color={inflowStatusColor} />
          </div>
          <div className="kpi-value" style={{ color: inflowStatusColor }}>
            {totalInflowRate.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>fans/min</span>
          </div>
          <div className="kpi-subtext">
            <span>Aggregate stadium entry throughput</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Side Telemetry Panel */}
      <div className="main-dashboard-grid">
        {/* Left Column: Interactive Stadium Map */}
        <StadiumMap
          stadiumData={stadiumData}
          selectedItem={selectedItem}
          onSelectItem={(item) => setSelectedItem(item)}
        />

        {/* Right Column: Gate Occupancy, Simulation Controls, Live Feed */}
        <div className="side-column">
          <GateOccupancyGrid
            gates={stadiumData.gates}
            selectedGateId={selectedItem?.id}
            onSelectGate={(gate) => setSelectedItem(gate)}
          />

          <SimController
            simEngine={engineRef.current}
            simState={simState}
            onInjectSpike={handleInjectSpike}
          />

          <LiveActivityFeed logs={logs} />
        </div>
      </div>

      {/* Zone / Gate Detail Modal Drawer */}
      {selectedItem && (
        <ZoneDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
