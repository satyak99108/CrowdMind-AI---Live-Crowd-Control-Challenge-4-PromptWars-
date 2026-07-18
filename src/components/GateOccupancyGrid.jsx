import React from 'react';
import { getStatusColor } from '../data/stadiumData';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function GateOccupancyGrid({ gates, onSelectGate, selectedGateId }) {
  return (
    <div className="glass-panel gate-section">
      <div className="section-title">
        <span>Live Gate Occupancy</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {gates.filter(g => g.status === 'high').length} Gates High Density
        </span>
      </div>

      <div className="gate-cards-list">
        {gates.map((gate) => {
          const occPercent = Math.round((gate.currentOccupancy / gate.capacity) * 100);
          const color = getStatusColor(gate.status);
          const isSelected = selectedGateId === gate.id;

          return (
            <div
              key={gate.id}
              className="gate-card"
              style={{
                borderColor: isSelected ? '#38bdf8' : 'var(--border-card)',
                boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
              }}
              onClick={() => onSelectGate(gate)}
            >
              <div className="gate-card-header">
                <div className="gate-name">{gate.name}</div>
                <span className={`status-badge ${gate.status}`}>
                  {gate.status === 'high' ? 'CONGESTED' : gate.status === 'moderate' ? 'MODERATE' : 'OPTIMAL'}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${occPercent}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}`
                  }}
                />
              </div>

              <div className="gate-metrics">
                <div className="metric-item">
                  <span className="metric-label">Occupancy</span>
                  <span className="metric-val">{occPercent}% ({gate.currentOccupancy.toLocaleString()})</span>
                </div>

                <div className="metric-item">
                  <span className="metric-label">Entry Rate</span>
                  <span className="metric-val" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {gate.entryRate} /min
                    {gate.trend === 'up' && <ArrowUpRight size={14} color="#ef4444" />}
                    {gate.trend === 'down' && <ArrowDownRight size={14} color="#10b981" />}
                    {gate.trend === 'stable' && <Minus size={14} color="#94a3b8" />}
                  </span>
                </div>

                <div className="metric-item">
                  <span className="metric-label">Queue Length</span>
                  <span className="metric-val" style={{ color: gate.queueLength > 500 ? '#ef4444' : 'var(--text-main)' }}>
                    {gate.queueLength} fans
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
