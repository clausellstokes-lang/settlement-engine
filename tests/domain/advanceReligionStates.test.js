/**
 * advanceReligionStates.test.js — the gradual pantheon DRIVER (religion rework).
 * Verifies: dormancy (religion off ⇒ null, no-op), gradual entry of a reaching faith
 * (a cult, NOT an instant flip), gradual chief change over many ticks, and
 * determinism (same inputs ⇒ same output).
 */
import { describe, it, expect } from 'vitest';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { chiefSnapshot } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';
const deity = (name, temper, align, rank) => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: rank });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;

function save(id, name, d, tier = 'town') {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier, population: tier === 'city' ? 20000 : 3000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, ...(d ? { primaryDeityRef: d._deityRef, primaryDeitySnapshot: d } : {}) },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

// One advance: build snapshot, drive, persist religionStates, and mirror each chief
// back onto config.primaryDeitySnapshot (what the kernel does via deityReembed).
function step(campaign, saves, rules) {
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: campaign.worldState.tick, now: NOW, rules });
  const nextWS = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
  if (r.religionStates) nextWS.religionStates = r.religionStates;
  const nextSaves = saves.map((s) => {
    const st = r.religionStates?.[s.id];
    const chief = st ? chiefSnapshot(st) : null;
    return chief ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: chief._deityRef, primaryDeitySnapshot: chief } } } : s;
  });
  return { campaign: { ...campaign, worldState: nextWS }, saves: nextSaves, result: r };
}

function makeRegion() {
  const A = deity('Aurum', 'peaceful', 'good', 'major');
  const F = deity('Faded', 'neutral', 'neutral', 'cult');
  const saves = [save('a', 'Acity', A, 'city'), save('b', 'Btown', F, 'town')];
  const campaign = {
    id: 'rel', name: 'rel', settlementIds: ['a', 'b'],
    worldState: { rngSeed: 'rel', tick: 1, simulationRules: { religionDynamicsEnabled: true } },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

describe('advanceReligionStates — dormancy', () => {
  it('religion off ⇒ null religionStates, no outcomes (byte-identical no-op)', () => {
    const { campaign, saves } = makeRegion();
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
    const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: 1, now: NOW, rules: { religionDynamicsEnabled: false } });
    expect(r.religionStates).toBeNull();
    expect(r.outcomes).toEqual([]);
  });
});

describe('advanceReligionStates — gradual spread', () => {
  it('a reaching faith ENTERS as a cult, not an instant flip', () => {
    const { campaign, saves } = makeRegion();
    const rules = { religionDynamicsEnabled: true };
    const b = step(campaign, saves, rules).campaign.worldState.religionStates.b;   // one tick
    expect(b.deities[ref('Aurum')]).toBeTruthy();                       // Aurum reached B
    expect(b.deities[ref('Aurum')].standing).toBe('cult');             // entered as a cult
    expect(b.chiefRef).toBe(ref('Faded'));                              // B has NOT flipped — still Faded
    const sum = Object.values(b.deities).filter((d) => !d.suppressed).reduce((t, d) => t + d.share, 0);
    expect(sum).toBe(100);                                              // shares conserved
  });

  it('a strong major faith gradually overtakes a weak cult to become chief', () => {
    let { campaign, saves } = makeRegion();
    const rules = { religionDynamicsEnabled: true };
    let chiefFlipped = false;
    for (let t = 0; t < 30; t++) {
      const out = step(campaign, saves, rules);
      campaign = out.campaign; saves = out.saves;
      if (out.result.outcomes.some((o) => o.targetSaveId === 'b')) chiefFlipped = true;
    }
    expect(campaign.worldState.religionStates.b.chiefRef).toBe(ref('Aurum'));   // Aurum is now B's chief
    expect(chiefFlipped).toBe(true);                                            // and it happened via a chief-change outcome
  });
});

describe('advanceReligionStates — determinism', () => {
  it('same inputs ⇒ identical religionStates', () => {
    const run = () => {
      let { campaign, saves } = makeRegion();
      const rules = { religionDynamicsEnabled: true };
      for (let t = 0; t < 8; t++) ({ campaign, saves } = step(campaign, saves, rules));
      return JSON.stringify(campaign.worldState.religionStates);
    };
    expect(run()).toBe(run());
  });
});
