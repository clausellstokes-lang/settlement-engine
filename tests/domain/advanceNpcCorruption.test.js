import { describe, it, expect } from 'vitest';
import { ensureNpcStates, advanceNpcCorruption } from '../../src/domain/worldPulse/npcAgency.js';
import { createPRNG } from '../../src/generators/prng.js';

// §corruption Phase 1b — per-tick onset + organic exposure over worldState.npcStates.
const snapshotWith = ({ crime, secure }) => ({
  settlements: [{
    id: 's1',
    activeConditions: [],
    settlement: {
      tier: 'city',
      institutions: [{ name: 'Thieves Guild' }, { name: 'City Watch' }],
      economicState: {
        prosperity: secure ? 'Wealthy' : 'Poor',
        safetyProfile: {
          safetyRatio: secure ? 3 : 0.5,
          blackMarketCapture: crime ? 60 : 5,
          compound: { criminalEffective: crime ? 80 : 15 },
        },
      },
      npcs: [
        { name: 'Greedy Guard', personality: { flaw: 'greedy' }, factionAffiliation: 'Watch', institutionId: 'inst_watch', importance: 'key' },
        { name: 'Honest Clerk', personality: { flaw: 'kind' }, factionAffiliation: 'Admin', institutionId: 'inst_admin' },
      ],
    },
  }],
});

const find = (ws, re) => Object.values(ws.npcStates).find((s) => re.test(s.name));

describe('advanceNpcCorruption — per-tick onset + organic exposure', () => {
  it('clean eligible NPCs turn corrupt over ticks under crime pressure; ineligible never do', () => {
    const snap = snapshotWith({ crime: true, secure: false });
    let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG('seed').fork('init'));
    for (const id of Object.keys(ws.npcStates)) {
      ws.npcStates[id] = { ...ws.npcStates[id], corruption: false, corruptionProfile: { corrupted: false, vector: null } };
    }
    const base = createPRNG('onset').fork('corruption');
    for (let t = 0; t < 40; t++) ws = advanceNpcCorruption(ws, snap, base, { tick: t }).worldState;
    expect(find(ws, /Greedy Guard/).corruption).toBe(true);
    expect(find(ws, /Greedy Guard/).corruptionProfile.vector).toBe('greed');
    expect(find(ws, /Honest Clerk/).corruption).toBe(false); // not a corruptible flaw → never
  });

  it('organic exposure demotes then ousts a corrupt NPC in a secure, prosperous settlement', () => {
    const snap = snapshotWith({ crime: false, secure: true });
    let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG('seed2').fork('init'));
    for (const id of Object.keys(ws.npcStates)) {
      const s = ws.npcStates[id];
      ws.npcStates[id] = /Greedy Guard/.test(s.name)
        ? { ...s, corruption: true, corruptionProfile: { corrupted: true, vector: 'greed' }, dotRank: 3 }
        : { ...s, corruption: false };
    }
    const base = createPRNG('expose').fork('corruption');
    let ousted = false; let minRank = 3; let sawTie = false;
    for (let t = 0; t < 40; t++) {
      const r = advanceNpcCorruption(ws, snap, base, { tick: t });
      ws = r.worldState;
      const g = find(ws, /Greedy Guard/);
      minRank = Math.min(minRank, g.dotRank);
      if (g.ousted) ousted = true;
      if (r.exposures.length) sawTie = sawTie || !!r.exposures[0].criminalInstitution;
    }
    expect(minRank).toBeLessThan(3); // demoted
    expect(ousted).toBe(true);       // eventually ousted
    expect(sawTie).toBe(true);       // exposure names the tied criminal institution
  });

  it('no criminal institution → no onset (rule)', () => {
    const snap = snapshotWith({ crime: true, secure: false });
    snap.settlements[0].settlement.institutions = [{ name: 'Market' }];
    snap.settlements[0].settlement.economicState.safetyProfile = { safetyRatio: 1, blackMarketCapture: 0, compound: { criminalEffective: 5 } };
    let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG('seed3').fork('init'));
    for (const id of Object.keys(ws.npcStates)) ws.npcStates[id] = { ...ws.npcStates[id], corruption: false };
    const base = createPRNG('noop').fork('corruption');
    for (let t = 0; t < 40; t++) ws = advanceNpcCorruption(ws, snap, base, { tick: t }).worldState;
    expect(Object.values(ws.npcStates).every((s) => s.corruption === false)).toBe(true);
  });

  it('is deterministic — same seed + ticks yields identical states', () => {
    const snap = snapshotWith({ crime: true, secure: false });
    const run = () => {
      let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG('detseed').fork('init'));
      const base = createPRNG('det').fork('corruption');
      for (let t = 0; t < 20; t++) ws = advanceNpcCorruption(ws, snap, base, { tick: t }).worldState;
      return Object.values(ws.npcStates).map((s) => `${s.name}:${s.corruption}:${s.dotRank}:${s.ousted || false}`);
    };
    expect(run()).toEqual(run());
  });
});
