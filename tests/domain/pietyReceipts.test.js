/**
 * pietyReceipts.test.js — the W-F3 LEGIBILITY pin (§2.4.4 + the owner's legibility law).
 * Every amplified outcome names BOTH multipliers with causes; a piety record always
 * carries a non-empty cause chain; and a legacy / deity-free outcome is byte-identical
 * (no amplifier key at all).
 */
import { describe, it, expect } from 'vitest';
import { pietyRecord, amplifierTag } from '../../src/domain/worldPulse/piety.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { patronSnapshot } from '../../src/domain/worldPulse/religionState.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

describe('piety receipts — the cause substrate', () => {
  it('a piety record ALWAYS carries a non-empty, correctly-named cause chain', () => {
    const rec = pietyRecord({ authority01: 0.7, institutionBacking: 0.5, devotion01: 0.9, realmMult: 1.1 });
    expect(rec.causes.length).toBeGreaterThanOrEqual(3);
    expect(rec.causes.map((c) => c.source).slice(0, 3)).toEqual(['religious_authority', 'institutions', 'devotion']);
    for (const c of rec.causes) expect(c.value).toBeGreaterThanOrEqual(0);
  });
  it('a clergy-distorted record adds a clergy_distortion cause; a clean one does not', () => {
    const dirty = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, clergy: { e: 1, c: 0.5, taint: 1, variance: 0.4, revealedTaint: 0, weight: 1 } });
    const clean = pietyRecord({ authority01: 1, institutionBacking: 1, devotion01: 1, clergy: null });
    expect(dirty.causes.some((c) => c.source === 'clergy_distortion')).toBe(true);
    expect(clean.causes.some((c) => c.source === 'clergy_distortion')).toBe(false);
  });
  it('amplifierTag names both multipliers off a projected record; null without one', () => {
    const withRec = { config: { faithProfile: { piety: { localMult: 1.4, realmMult: 1.2, composite: 1.68 } } } };
    expect(amplifierTag(withRec)).toEqual({ localMult: 1.4, realmMult: 1.2 });
    expect(amplifierTag({ config: {} })).toBe(null);
  });
});

// ── integration: an amplified conversion outcome carries the amplifier receipt ──
const NOW = '2026-01-01T00:00:00.000Z';
const deity = (name, temper, align) => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: temper, alignmentAxis: align, rankAxis: name === 'Aurum' ? 'major' : 'cult' });
const ref = (x) => `custom:lu_${x.toLowerCase()}`;

function save(id, name, d, tier, extraConfig = {}) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier, population: tier === 'city' ? 20000 : 3000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, ...(d ? { primaryDeityRef: d._deityRef, primaryDeitySnapshot: d } : {}), ...extraConfig },
      institutions: [], economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function step(campaign, saves, rules) {
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  const rng = createPRNG(`${campaign.worldState.rngSeed}::tick:${campaign.worldState.tick}`);
  const r = advanceReligionStates({ snapshot, worldState: campaign.worldState, tick: campaign.worldState.tick, now: NOW, rules, rng, realmMult: 1 });
  const nextWS = { ...campaign.worldState, tick: campaign.worldState.tick + 1 };
  if (r.religionStates) nextWS.religionStates = r.religionStates;
  const nextSaves = saves.map((s) => {
    const st = r.religionStates?.[s.id];
    const patron = st ? patronSnapshot(st) : null;
    return patron ? { ...s, settlement: { ...s.settlement, config: { ...s.settlement.config, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron } } } : s;
  });
  return { campaign: { ...campaign, worldState: nextWS }, saves: nextSaves, result: r };
}

function region(bPiety) {
  const A = deity('Aurum', 'peaceful', 'good');
  const F = deity('Faded', 'neutral', 'neutral');
  // Seed Btown's tick-START piety record (what last tick's projection would have written).
  const bExtra = bPiety ? { faithProfile: { patron: null, deities: [], contested: false, patronSecurity: 0, piety: bPiety } } : {};
  const saves = [save('a', 'Acity', A, 'city'), save('b', 'Btown', F, 'town', bExtra)];
  const campaign = {
    id: 'rel', name: 'rel', settlementIds: ['a', 'b'],
    worldState: { rngSeed: 'rel', tick: 1, simulationRules: { faithSpreadEnabled: true } },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }] }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function runUntilFlip(bPiety) {
  let { campaign, saves } = region(bPiety);
  const rules = { faithSpreadEnabled: true };
  for (let t = 0; t < 40; t++) {
    const out = step(campaign, saves, rules);
    campaign = out.campaign; saves = out.saves;
    const flip = out.result.outcomes.find((o) => o.targetSaveId === 'b' && o.deityReembed?.snapshot?.name === 'Aurum');
    if (flip) return flip;
  }
  return null;
}

describe('piety receipts — amplified conversion outcome (integration)', () => {
  it('a conversion of a DEVOUT settlement names both multipliers on the receipt', () => {
    const flip = runUntilFlip({ local01: 0.9, localMult: 1.5, realmMult: 1.1, composite: 1.65, causes: [] });
    expect(flip).toBeTruthy();
    expect(flip.metadata.amplifiers).toEqual({ localMult: 1.5, realmMult: 1.1 });
    // legibility law: the reason chain is non-empty and mentions the devotion.
    expect(Array.isArray(flip.reasons) && flip.reasons.length).toBeGreaterThan(0);
    expect(flip.reasons.some((r) => /devotion|piety/i.test(r))).toBe(true);
    // site #4: the amplified severity exceeds the un-amplified 0.5 base.
    expect(flip.severity).toBeGreaterThan(0.5);
  });

  it('a conversion with NO piety record is byte-identical (no amplifier key, severity 0.5)', () => {
    const flip = runUntilFlip(null);
    expect(flip).toBeTruthy();
    expect('amplifiers' in flip.metadata).toBe(false);
    expect(flip.severity).toBe(0.5);
  });
});
