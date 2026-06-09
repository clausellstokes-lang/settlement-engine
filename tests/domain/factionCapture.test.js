import { describe, it, expect } from 'vitest';
import { advanceFactionCapture, settlementCaptureState } from '../../src/domain/worldPulse/factionCapture.js';
import { createPRNG } from '../../src/generators/prng.js';

const snap = ({ secure }) => ({
  settlements: [{
    id: 's1',
    settlement: {
      institutions: [{ name: 'Thieves Guild' }],
      economicState: {
        prosperity: secure ? 'Wealthy' : 'Poor',
        safetyProfile: { safetyRatio: secure ? 3 : 0.5, blackMarketCapture: secure ? 5 : 60, compound: { criminalEffective: secure ? 12 : 80 } },
      },
    },
  }],
});

const wsWith = ({ corruptLeader, captureState = 'none' }) => ({
  npcStates: { n1: { npcId: 'n1', corruption: !!corruptLeader, dotRank: 3 } },
  factionStates: {
    f1: {
      factionId: 'f1', settlementId: 's1', name: 'City Watch', captureState,
      internalSeats: { leader_champion: { npcId: 'n1', dotRank: 3 }, lieutenant_operator: null, agent_protege: null },
    },
  },
});

describe('advanceFactionCapture — Phase 2 faction capture ladder', () => {
  it('a faction with a corrupt leader climbs toward capture in a crime-ridden settlement', () => {
    let ws = wsWith({ corruptLeader: true });
    const s = snap({ secure: false });
    const base = createPRNG('climb').fork('faction-capture');
    for (let t = 0; t < 40; t++) ws = advanceFactionCapture(ws, s, base, { tick: t }).worldState;
    expect(['equilibrium', 'corrupted', 'capture']).toContain(ws.factionStates.f1.captureState);
  });

  it('a clean faction recedes toward none in a secure, prosperous settlement', () => {
    let ws = wsWith({ corruptLeader: false, captureState: 'corrupted' });
    const s = snap({ secure: true });
    const base = createPRNG('heal').fork('faction-capture');
    for (let t = 0; t < 40; t++) ws = advanceFactionCapture(ws, s, base, { tick: t }).worldState;
    expect(ws.factionStates.f1.captureState).toBe('none');
  });

  it('records ladder transitions', () => {
    let ws = wsWith({ corruptLeader: true });
    const s = snap({ secure: false });
    const base = createPRNG('trans').fork('faction-capture');
    let saw = false;
    for (let t = 0; t < 40; t++) { const r = advanceFactionCapture(ws, s, base, { tick: t }); ws = r.worldState; if (r.transitions.length) saw = true; }
    expect(saw).toBe(true);
  });

  it('settlementCaptureState rolls up the worst faction in a settlement', () => {
    const fs = {
      a: { settlementId: 's1', captureState: 'equilibrium' },
      b: { settlementId: 's1', captureState: 'capture' },
      c: { settlementId: 's2', captureState: 'none' },
    };
    expect(settlementCaptureState(fs, 's1')).toBe('capture');
    expect(settlementCaptureState(fs, 's2')).toBe('none');
  });

  it('is deterministic', () => {
    const run = () => {
      let ws = wsWith({ corruptLeader: true });
      const s = snap({ secure: false });
      const base = createPRNG('det').fork('faction-capture');
      for (let t = 0; t < 20; t++) ws = advanceFactionCapture(ws, s, base, { tick: t }).worldState;
      return ws.factionStates.f1.captureState;
    };
    expect(run()).toBe(run());
  });
});
