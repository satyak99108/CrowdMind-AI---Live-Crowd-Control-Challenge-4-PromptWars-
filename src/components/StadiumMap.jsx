import React, { useState } from 'react';
import { getStatusColor } from '../data/stadiumData';
import { Layers } from 'lucide-react';

export default function StadiumMap({ stadiumData, selectedItem, onSelectItem }) {
  const [hoveredSector, setHoveredSector] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'GATES', 'STANDS', 'CONCOURSE'

  // Map sector lookup helper
  const getSector = (id) => stadiumData.sectors.find(s => s.id === id);

  return (
    <div className="glass-panel stadium-map-container">
      <div className="map-header">
        <div className="map-title">
          <Layers size={20} color="#38bdf8" />
          <span>Interactive Stadium Heatmap Visualizer</span>
        </div>

        <div className="heatmap-legend">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Density Zones:</span>
          <div className="legend-item">
            <span className="legend-dot green"></span>
            <span>Low (&lt;50%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot yellow"></span>
            <span>Moderate (50-80%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot red"></span>
            <span>High (&gt;80%)</span>
          </div>
        </div>
      </div>

      <div className="svg-map-wrapper">
        <svg viewBox="0 0 1000 760" className="stadium-svg">
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Perimeter Ground */}
          <ellipse cx="500" cy="380" rx="460" ry="320" fill="rgba(15, 23, 42, 0.4)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

          {/* Concourse Ring (Outer Buffer) */}
          <ellipse cx="500" cy="380" rx="410" ry="275" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="18" strokeDasharray="10 8" />

          {/* Upper Tier Seating Ring Sectors */}
          {/* North Upper */}
          <path
            d="M 220 220 A 400 260 0 0 1 780 220 L 720 260 A 320 200 0 0 0 280 260 Z"
            fill={getStatusColor(getSector('sec-north-upper')?.status || 'low')}
            fillOpacity={0.65}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-north-upper'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-north-upper'))}
            onMouseLeave={() => setHoveredSector(null)}
          />
          {/* South Upper */}
          <path
            d="M 220 540 A 400 260 0 0 0 780 540 L 720 500 A 320 200 0 0 1 280 500 Z"
            fill={getStatusColor(getSector('sec-south-upper')?.status || 'low')}
            fillOpacity={0.65}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-south-upper'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-south-upper'))}
            onMouseLeave={() => setHoveredSector(null)}
          />
          {/* East Upper */}
          <path
            d="M 780 220 A 400 260 0 0 1 780 540 L 720 500 A 320 200 0 0 0 720 260 Z"
            fill={getStatusColor(getSector('sec-east-upper')?.status || 'low')}
            fillOpacity={0.65}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-east-upper'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-east-upper'))}
            onMouseLeave={() => setHoveredSector(null)}
          />
          {/* West Upper */}
          <path
            d="M 220 220 A 400 260 0 0 0 220 540 L 280 500 A 320 200 0 0 1 280 260 Z"
            fill={getStatusColor(getSector('sec-west-upper')?.status || 'low')}
            fillOpacity={0.65}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-west-upper'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-west-upper'))}
            onMouseLeave={() => setHoveredSector(null)}
          />

          {/* Middle Tier Separator */}
          <ellipse cx="500" cy="380" rx="310" ry="195" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />

          {/* Lower Tier Seating Ring Sectors */}
          {/* North Lower */}
          <path
            d="M 290 265 A 300 185 0 0 1 710 265 L 640 300 A 210 130 0 0 0 360 300 Z"
            fill={getStatusColor(getSector('sec-north-lower')?.status || 'low')}
            fillOpacity={0.8}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-north-lower'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-north-lower'))}
            onMouseLeave={() => setHoveredSector(null)}
          />
          {/* South Lower */}
          <path
            d="M 290 495 A 300 185 0 0 0 710 495 L 640 460 A 210 130 0 0 1 360 460 Z"
            fill={getStatusColor(getSector('sec-south-lower')?.status || 'low')}
            fillOpacity={0.8}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-south-lower'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-south-lower'))}
            onMouseLeave={() => setHoveredSector(null)}
          />
          {/* East Lower */}
          <path
            d="M 710 265 A 300 185 0 0 1 710 495 L 640 460 A 210 130 0 0 0 640 300 Z"
            fill={getStatusColor(getSector('sec-east-lower')?.status || 'low')}
            fillOpacity={0.8}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-east-lower'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-east-lower'))}
            onMouseLeave={() => setHoveredSector(null)}
          />
          {/* West Lower */}
          <path
            d="M 290 265 A 300 185 0 0 0 290 495 L 360 460 A 210 130 0 0 1 360 300 Z"
            fill={getStatusColor(getSector('sec-west-lower')?.status || 'low')}
            fillOpacity={0.8}
            className="sector-zone"
            onClick={() => onSelectItem(getSector('sec-west-lower'))}
            onMouseEnter={() => setHoveredSector(getSector('sec-west-lower'))}
            onMouseLeave={() => setHoveredSector(null)}
          />

          {/* Central Pitch / Field */}
          <rect x="375" y="310" width="250" height="140" rx="8" className="stadium-pitch" />
          {/* Pitch Markings */}
          <line x1="500" y1="310" x2="500" y2="450" className="pitch-line" />
          <circle cx="500" cy="380" r="32" className="pitch-line" />
          <rect x="375" y="340" width="35" height="80" className="pitch-line" />
          <rect x="590" y="340" width="35" height="80" className="pitch-line" />
          <text x="500" y="385" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="800" letterSpacing="2">
            FIFA WORLD CUP FIELD
          </text>

          {/* Gate Nodes overlay (Gates A to H around perimeter) */}
          {stadiumData.gates.map((gate) => {
            const color = getStatusColor(gate.status);
            const isSelected = selectedItem?.id === gate.id;

            return (
              <g
                key={gate.id}
                className="gate-node"
                transform={`translate(${gate.coords.x}, ${gate.coords.y})`}
                onClick={() => onSelectItem(gate)}
                onMouseEnter={() => setHoveredSector(gate)}
                onMouseLeave={() => setHoveredSector(null)}
              >
                {/* Heat aura ring for high density */}
                {gate.status === 'high' && (
                  <circle cx="0" cy="0" r="38" fill="rgba(239,68,68,0.25)" className="heat-pulse" />
                )}

                <circle
                  cx="0"
                  cy="0"
                  r={gate.coords.radius}
                  fill={color}
                  className="gate-circle"
                  stroke={isSelected ? '#38bdf8' : '#ffffff'}
                  strokeWidth={isSelected ? 4 : 2}
                  filter={gate.status === 'high' ? 'url(#glow-red)' : 'none'}
                />

                {/* Gate Code Label */}
                <text x="0" y="0" className="gate-label-text">
                  {gate.id.replace('gate-', '').toUpperCase()}
                </text>

                {/* Queue badge indicator */}
                <rect x="-18" y="24" width="36" height="16" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke={color} strokeWidth="1" />
                <text x="0" y="35" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
                  {gate.queueLength}q
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredSector && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1px solid ${getStatusColor(hoveredSector.status)}`,
              boxShadow: `0 0 20px ${getStatusColor(hoveredSector.status)}40`,
              padding: '12px 18px',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.85rem',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: getStatusColor(hoveredSector.status) }}>
              {hoveredSector.name}
            </div>
            <div>Occupancy: <strong>{hoveredSector.currentOccupancy.toLocaleString()}</strong> / {hoveredSector.capacity.toLocaleString()} ({Math.round((hoveredSector.currentOccupancy / hoveredSector.capacity) * 100)}%)</div>
            {hoveredSector.entryRate && <div>Entry Speed: <strong>{hoveredSector.entryRate} fans/min</strong></div>}
            {hoveredSector.queueLength !== undefined && <div>Queue Length: <strong>{hoveredSector.queueLength} people</strong></div>}
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Click item for detailed analytics modal</div>
          </div>
        )}
      </div>
    </div>
  );
}
