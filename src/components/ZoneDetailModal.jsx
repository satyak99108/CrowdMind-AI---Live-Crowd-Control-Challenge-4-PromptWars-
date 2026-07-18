import React, { useEffect } from 'react';
import { getStatusColor } from '../data/stadiumData';
import { X, Activity } from 'lucide-react';

export default function ZoneDetailModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const color = getStatusColor(item.status);
  const occPercent = Math.round((item.currentOccupancy / item.capacity) * 100);
  const isGate = item.type === 'gate';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: `${color}20`, border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            <Activity size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{item.name}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isGate ? 'Primary Access Gate' : item.category || 'Stadium Sector'}</p>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Occupancy Status:</span>
            <span style={{ fontWeight: 800, color, textTransform: 'uppercase' }}>
              {item.status === 'high' ? 'High Congestion' : item.status === 'moderate' ? 'Moderate' : 'Optimal'}
            </span>
          </div>

          <div className="progress-track" style={{ height: '10px' }}>
            <div className="progress-fill" style={{ width: `${occPercent}%`, backgroundColor: color, boxShadow: `0 0 12px ${color}` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Count: <strong>{item.currentOccupancy.toLocaleString()}</strong> fans</span>
            <span>Limit: <strong>{item.capacity.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Key Metrics */}
        {isGate && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Entry Speed</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {item.entryRate} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>fans/min</span>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Queue Length</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.queueLength > 500 ? '#ef4444' : 'var(--text-main)', marginTop: '4px' }}>
                {item.queueLength} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>waiting</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
