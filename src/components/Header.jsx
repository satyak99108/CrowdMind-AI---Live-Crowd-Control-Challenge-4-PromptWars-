import React from 'react';
import { Clock } from 'lucide-react';

export default function Header({ stadiumData, simState }) {
  const formatMatchTime = (min) => {
    if (min < 0) return `T${min}m (Pre-Match)`;
    if (min === 45) return `Halftime Break`;
    if (min > 90) return `Post-Match`;
    return `${min}' 1st Half`;
  };

  return (
    <header className="glass-panel header-bar">
      <div className="brand-section">
        <div className="brand-icon">🏟️</div>
        <div className="brand-title">
          <h1>
            CrowdMind AI <span className="mvp-badge">MVP 1 • Live Heatmap</span>
          </h1>
          <p className="sub-title">FIFA World Cup Stadium Crowd Intelligence System</p>
        </div>
      </div>

      <div className="match-status-pill">
        <div className="match-info-box">
          <span className="match-teams">{stadiumData.matchInfo.teams}</span>
          <span className="match-detail">{stadiumData.matchInfo.stage} • {stadiumData.stadiumName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
          <Clock size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#38bdf8' }}>
            {formatMatchTime(simState.matchMinute)}
          </span>
        </div>

        <div className="live-indicator">
          <span className={`dot-live ${simState.isRunning ? '' : 'paused'}`}></span>
          <span>{simState.isRunning ? 'LIVE TELEMETRY' : 'PAUSED'}</span>
        </div>
      </div>
    </header>
  );
}
