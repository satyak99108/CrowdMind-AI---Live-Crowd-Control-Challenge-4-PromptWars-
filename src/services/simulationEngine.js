import { getStatusFromOccupancy } from '../data/stadiumData';

export class StadiumSimulationEngine {
  constructor(initialData, onTickCallback, onLogCallback) {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.onTick = onTickCallback;
    this.onLog = onLogCallback;
    this.isRunning = false;
    this.speedMultiplier = 1;
    this.activeScenario = 'PRE_MATCH';
    this.timerId = null;
    this.matchMinute = -45;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextTick();
    this.log('SYSTEM', 'Simulation telemetry streaming started');
    this.triggerUpdate();
  }

  pause() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.log('SYSTEM', 'Simulation telemetry paused');
    this.triggerUpdate();
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    this.log('SYSTEM', `Simulation speed set to ${multiplier}x`);
    this.triggerUpdate();
  }

  setScenario(scenarioKey) {
    this.activeScenario = scenarioKey;
    const labels = {
      PRE_MATCH: 'Pre-Match Gate Rush Scenario',
      HALFTIME: 'Halftime Concourse Peak Scenario',
      POST_MATCH: 'Post-Match Mass Exit Scenario',
      BALANCED: 'Normal Balanced Flow'
    };

    if (scenarioKey === 'PRE_MATCH') this.matchMinute = -30;
    if (scenarioKey === 'HALFTIME') this.matchMinute = 45;
    if (scenarioKey === 'POST_MATCH') this.matchMinute = 90;

    this.applyScenarioBaseline(scenarioKey);
    this.log('SCENARIO', `Activated Scenario: ${labels[scenarioKey] || scenarioKey}`);
    this.triggerUpdate();
  }

  applyScenarioBaseline(scenarioKey) {
    this.data.gates.forEach(g => {
      if (scenarioKey === 'PRE_MATCH' && (g.id === 'gate-a' || g.id === 'gate-g')) {
        g.currentOccupancy = Math.floor(g.capacity * 0.88);
        g.queueLength = 750;
        g.entryRate = 310;
      } else if (scenarioKey === 'POST_MATCH') {
        g.currentOccupancy = Math.floor(g.capacity * 0.85);
        g.queueLength = 900;
        g.entryRate = 350;
      } else {
        g.currentOccupancy = Math.floor(g.capacity * 0.45);
        g.queueLength = 180;
        g.entryRate = 140;
      }
      g.status = getStatusFromOccupancy(g.currentOccupancy, g.capacity);
    });
  }

  scheduleNextTick() {
    if (!this.isRunning) return;
    this.timerId = setTimeout(() => {
      this.tick();
      this.scheduleNextTick();
    }, 1500 / this.speedMultiplier);
  }

  tick() {
    this.matchMinute += 0.2;

    // Update Gates Telemetry
    this.data.gates.forEach(gate => {
      const prevStatus = gate.status;
      let deltaRate = (Math.random() * 26 - 12);
      
      if (this.activeScenario === 'PRE_MATCH' && (gate.id === 'gate-a' || gate.id === 'gate-g')) deltaRate += 16;
      if (this.activeScenario === 'POST_MATCH') deltaRate += 20;

      gate.entryRate = Math.max(20, Math.min(450, Math.round(gate.entryRate + deltaRate)));
      const netChange = Math.floor((gate.entryRate / 60) * (1.5 * this.speedMultiplier)) + (Math.floor(Math.random() * 9) - 4);
      
      gate.currentOccupancy = Math.max(100, Math.min(gate.capacity, gate.currentOccupancy + netChange));
      gate.queueLength = Math.max(10, Math.round(gate.queueLength + (netChange * 0.7) - 3));
      gate.trend = netChange > 2 ? 'up' : netChange < -2 ? 'down' : 'stable';
      gate.status = getStatusFromOccupancy(gate.currentOccupancy, gate.capacity);

      if (prevStatus !== gate.status) {
        const type = gate.status === 'high' ? 'ALERT' : gate.status === 'moderate' ? 'WARNING' : 'INFO';
        this.log(type, `${gate.name} density shifted to ${gate.status.toUpperCase()} (${Math.round((gate.currentOccupancy / gate.capacity) * 100)}% occupied)`);
      }
    });

    // Update Sectors
    this.data.sectors.forEach(sector => {
      let sectorDelta = Math.floor(Math.random() * 21) - 9;
      if (this.activeScenario === 'HALFTIME' && sector.category === 'Concourse') sectorDelta += 22;

      sector.currentOccupancy = Math.max(100, Math.min(sector.capacity, sector.currentOccupancy + sectorDelta));
      sector.density = Number((sector.currentOccupancy / sector.capacity).toFixed(2));
      sector.status = getStatusFromOccupancy(sector.currentOccupancy, sector.capacity);
    });

    this.triggerUpdate();
  }

  log(type, message) {
    if (this.onLog) {
      this.onLog({
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message
      });
    }
  }

  triggerUpdate() {
    if (this.onTick) {
      this.onTick(JSON.parse(JSON.stringify(this.data)), {
        matchMinute: Math.floor(this.matchMinute),
        speed: this.speedMultiplier,
        scenario: this.activeScenario,
        isRunning: this.isRunning
      });
    }
  }

  injectCongestionSpike(gateId) {
    const target = this.data.gates.find(g => g.id === gateId);
    if (target) {
      target.currentOccupancy = Math.floor(target.capacity * 0.94);
      target.queueLength += 450;
      target.entryRate += 120;
      target.status = 'high';
      target.trend = 'up';
      this.log('ALERT', `MANUAL SPIKE: Emergency bottleneck created at ${target.name}`);
      this.triggerUpdate();
    }
  }
}
