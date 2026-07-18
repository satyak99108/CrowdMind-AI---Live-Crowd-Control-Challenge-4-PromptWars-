import React from 'react';
import { Radio } from 'lucide-react';

export default function LiveActivityFeed({ logs }) {
  return (
    <div className="glass-panel activity-feed-panel">
      <div className="section-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={16} color="#10b981" />
          Live Congestion Activity Feed
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {logs.length} events logged
        </span>
      </div>

      <div className="log-list">
        {logs.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
            Awaiting live telemetry stream...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-item ${log.type}`}>
              <span className="log-time">{log.timestamp}</span>
              <span style={{ flex: 1 }}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
