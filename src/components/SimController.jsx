import React from 'react';
import { Play, Pause, Zap, AlertOctagon } from 'lucide-react';

export default function SimController({ simEngine, simState, onInjectSpike }) {
  const isRunning = simState.isRunning;
  const activeScenario = simState.scenario;
  const speed = simState.speed;

  return (
    <div className="glass-panel sim-controls-panel">
      <div className="section-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#f59e0b" />
          Crowd Telemetry Simulation Deck
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Real-time Engine Controls
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Play / Pause & Speed Group */}
        <div className="sim-btn-group">
          <button
            className={`sim-btn ${isRunning ? 'danger' : 'success'}`}
            onClick={() => {
              if (simEngine) {
                if (isRunning) {
                  simEngine.pause();
                } else {
                  simEngine.start();
                }
              }
            }}
          >
            {isRunning ? (
              <Pause size={16} color="#ef4444" />
            ) : (
              <Play size={16} color="#10b981" />
            )}
            <span style={{ color: isRunning ? '#ef4444' : '#10b981', fontWeight: 700 }}>
              {isRunning ? 'Pause Telemetry' : 'Resume Telemetry'}
            </span>
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>Speed:</span>
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              className={`sim-btn ${speed === s ? 'active' : ''}`}
              onClick={() => simEngine.setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Scenario Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Simulated Match Flow Scenarios:
          </span>
          <div className="sim-btn-group">
            <button
              className={`sim-btn ${activeScenario === 'PRE_MATCH' ? 'active' : ''}`}
              onClick={() => simEngine.setScenario('PRE_MATCH')}
            >
              1. Pre-Match Gate Rush
            </button>
            <button
              className={`sim-btn ${activeScenario === 'HALFTIME' ? 'active' : ''}`}
              onClick={() => simEngine.setScenario('HALFTIME')}
            >
              2. Halftime Concourse Peak
            </button>
            <button
              className={`sim-btn ${activeScenario === 'POST_MATCH' ? 'active' : ''}`}
              onClick={() => simEngine.setScenario('POST_MATCH')}
            >
              3. Post-Match Exit
            </button>
            <button
              className={`sim-btn ${activeScenario === 'BALANCED' ? 'active' : ''}`}
              onClick={() => simEngine.setScenario('BALANCED')}
            >
              4. Normal Flow
            </button>
          </div>
        </div>

        {/* Inject Bottleneck Trigger */}
        <div style={{ marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <button
            className="sim-btn danger"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onInjectSpike('gate-a')}
          >
            <AlertOctagon size={16} />
            <span>Trigger Emergency Bottleneck Spike at Gate A</span>
          </button>
        </div>
      </div>
    </div>
  );
}
