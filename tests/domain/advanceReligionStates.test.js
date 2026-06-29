/**
 * advanceReligionStates.test.js — the gradual pantheon DRIVER (religion rework).
 * Verifies: dormancy (religion off ⇒ null, no-op), gradual entry of a reaching faith
 * (a cult, NOT an instant flip), gradual patron change over many ticks, and
 * determinism (same inputs ⇒ same output).
 */
import { describe, it, expect } from 'vitest';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

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

// One advance: build snapshot, drive, persist religionStates, and mirror each patron
// back onto config.primaryDeitySnapshot (what the kernel does via deityReembed).
function step(campaign, saves, rules) {
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const rng = createPRNG(`${campaign.worldState.rngSeed}::tick:${campaign.worldState.tick}`);
  const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: campaign.worldState.tick, now: NOW, rules, rng });
  const nextWS = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
  if (r.religionStates) nextWS.religionStates = r.religionStates;
  const nextSaves = saves.map((s) => {
    const st = r.religionStates?.[s.id];
    const patron = st ? patronSnapshot(st) : null;
    return patron ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron } } } : s;
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
    expect(b.patronRef).toBe(ref('Faded'));                              // B has NOT flipped — still Faded
    const sum = Object.values(b.deities).filter((d) => !d.suppressed).reduce((t, d) => t + d.share, 0);
    expect(sum).toBe(100);                                              // shares conserved
  });

  it('a strong major faith gradually overtakes a weak cult to become patron', () => {
    let { campaign, saves } = makeRegion();
    const rules = { religionDynamicsEnabled: true };
    let patronFlipped = false;
    for (let t = 0; t < 30; t++) {
      const out = step(campaign, saves, rules);
      campaign = out.campaign; saves = out.saves;
      if (out.result.outcomes.some((o) => o.targetSaveId === 'b')) patronFlipped = true;
    }
    expect(campaign.worldState.religionStates.b.patronRef).toBe(ref('Aurum'));   // Aurum is now B's patron
    expect(patronFlipped).toBe(true);                                            // and it happened via a patron-change outcome
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

describe('advanceReligionStates — imposed-cult schism (the contest, end to end)', () => {
  // A settlement whose patron (Korl, warlike:evil) has a cult imposed in its OWN
  // niche (Vorr, warlike:evil) via config.cultDeitySnapshots — a schism that the
  // seeded patron contest must RESOLVE (the niche cannot stay two-deity forever).
  function imposedRegion() {
    const Korl = deity('Korl', 'warlike', 'evil', 'major');
    const Vorr = deity('Vorr', 'warlike', 'evil', 'cult');   // SAME niche as the patron
    const s = save('x', 'Xburg', Korl, 'city');
    s.settlement.config.cultDeitySnapshots = [{ ...Vorr, lawAxis: 'neutral' }];
    const campaign = {
      id: 'sch', name: 'sch', settlementIds: ['x'],
      worldState: { rngSeed: 'schism', tick: 1, simulationRules: { religionDynamicsEnabled: true } },
      regionalGraph: ensureRegionalGraph({ edges: [] }),
      wizardNews: { currentTick: 1, entries: [] },
    };
    return { campaign, saves: [s] };
  }

  it('seeds the imposed cult as a contestant in the patron niche, then resolves the schism', () => {
    let { campaign, saves } = imposedRegion();
    const rules = { religionDynamicsEnabled: true };
    // tick 1: both faiths share the warlike:evil niche (the schism is live).
    let out = step(campaign, saves, rules); campaign = out.campaign; saves = out.saves;
    const x0 = campaign.worldState.religionStates.x;
    const niche0 = Object.values(x0.deities).filter((d) => d.niche === 'warlike:evil' && !d.suppressed);
    expect(niche0.length).toBe(2);                                   // contested: patron + imposed cult
    expect(x0.deities[ref('Vorr')].heresyStain).toBeGreaterThan(0);  // the cult rose by fiat

    // Run the siege out — the contest must collapse the niche back to ONE active faith.
    for (let t = 0; t < 60; t++) { out = step(campaign, saves, rules); campaign = out.campaign; saves = out.saves; }
    const xN = campaign.worldState.religionStates.x;
    const niche = Object.values(xN.deities).filter((d) => d.niche === 'warlike:evil' && !d.suppressed);
    expect(niche.length).toBe(1);                                    // schism RESOLVED to a single creed
    expect(niche[0].deityRef).toBe(xN.patronRef);                   // and that creed holds the patron seat
    const sum = Object.values(xN.deities).filter((d) => !d.suppressed).reduce((t, d) => t + d.share, 0);
    expect(sum).toBe(100);                                           // shares stay conserved
  });

  it('is deterministic across the whole schism (same seed ⇒ same patron)', () => {
    const run = () => {
      let { campaign, saves } = imposedRegion();
      const rules = { religionDynamicsEnabled: true };
      for (let t = 0; t < 40; t++) ({ campaign, saves } = step(campaign, saves, rules));
      return campaign.worldState.religionStates.x.patronRef;
    };
    expect(run()).toBe(run());
  });
});
