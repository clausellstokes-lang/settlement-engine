/**
 * beliefTruthBands.test.js — FP IN-6 U3, THE DISPLAY-SAFE BANDED TRUTH PROVIDER
 * (DESIGN_FP_INFORMATION.md §5 IN-6: "the strength-axis gap closes" + the
 * provider-parity pin; J-INF-11; DESIGN_FP_ARCH_IN.md S27).
 *
 * WHAT IS PINNED.
 *   PARITY       on a fixture corpus the provider's bands EQUAL the engine's own
 *                cold-start seed (advanceBeliefMaps seeds ground truth at confidence
 *                one), for every observer and subject the seed holds. The corpus is
 *                built so a fork can be seen: the pressure index moves the strength
 *                band of most settlements, so a provider that read strength without
 *                the live pressures (the obvious second spelling) reds here.
 *   DISPLAY-SAFE the projected truth is bands only: an integer strength band, the
 *                posture readiness anchor, the labels. No strength score, pressure or
 *                confidence key ever leaves the provider.
 *   FAIL-CLOSED  the player call (the default) and a dormant world answer null.
 *   HONEST GAPS  a subject outside the observer's neighbourhood carries no relationship
 *                truth, and a settlement the realm does not carry has no truth at all.
 */
import { describe, expect, test } from 'vitest';

import { beliefTruthProvider } from '../../src/domain/display/beliefTruthBands.js';
import { advanceBeliefMaps, GOVERNING_SEAT_KEY, strengthBandOf } from '../../src/domain/worldPulse/beliefMap.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { settlementStrength } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

function settlement(name, p = {}) {
  return {
    name,
    tier: p.tier || 'city',
    population: p.population || 45000,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 40,
      ...(p.deity ? { primaryDeitySnapshot: { name: p.deity } } : {}),
    },
    institutions: [],
    economicState: { prosperity: p.prosperity || 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: p.legit ?? 62, label: 'Stable' },
      factions: [{ faction: 'War Council', category: 'military', power: 82, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: p.conditions || [],
  };
}
const save = (id, name, p) => ({ id, name, phase: 'canon', settlement: settlement(name, p), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

/** Four settlements whose pressures differ, so the strength bands differ and move under pressure. */
const saves = () => [
  save('ash', 'Ashkar', { tier: 'metropolis', population: 120000, deity: 'Vareth' }),
  save('bel', 'Belmoor', {
    tier: 'town', population: 3000, legit: 10, prosperity: 'Struggling',
    conditions: [{ archetype: 'famine', severity: 0.9 }, { archetype: 'war_drain', severity: 0.8 }],
  }),
  save('cor', 'Corvel', { tier: 'village', population: 400, deity: 'Old Sea-God' }),
  save('dun', 'Dunmere', { tier: 'city', population: 30000, legit: 20, conditions: [{ archetype: 'plague', severity: 0.7 }] }),
];

function campaign({ beliefMaps } = {}) {
  return {
    id: 'truth-bands',
    settlementIds: ['ash', 'bel', 'cor', 'dun'],
    worldState: {
      rngSeed: 'truth-bands', tick: 12, spatialCanonVersion: 1,
      simulationRules: { infoMode: 'full' },
      warPosture: { bel: { state: 'mobilized' }, dun: { state: 'alert' } },
      // the overlay outranks the edge's declared type, exactly as the engine reads it
      relationshipStates: { 'edge.ash.bel': { relationshipType: 'hostile' } },
      ...(beliefMaps ? { spatialLedgers: { beliefMaps } } : {}),
    },
    regionalGraph: ensureRegionalGraph({ edges: [
      { id: 'edge.ash.bel', from: 'ash', to: 'bel', relationshipType: 'rival' },
      { id: 'edge.ash.cor', from: 'ash', to: 'cor', relationshipType: 'trade_partner' },
      { id: 'edge.bel.dun', from: 'bel', to: 'dun', relationshipType: 'allied' },
      { id: 'edge.cor.dun', from: 'cor', to: 'dun', relationshipType: 'neutral' },
    ] }),
  };
}

/** The engine's own ground truth: the cold-start seed of the belief advance. */
function engineSeed() {
  const c = campaign();
  const snapshot = buildWorldSnapshot({ campaign: c, saves: saves(), worldState: c.worldState });
  const pressureIdx = pressureIndex(deriveSettlementPressures(snapshot));
  const { next } = advanceBeliefMaps({ snapshot, pressureIdx, worldState: snapshot.worldState, tick: 12 });
  return { next, snapshot };
}

/** The live world carrying the seeded maps, as the band reads it after the pulse. */
function liveCampaign() {
  return campaign({ beliefMaps: engineSeed().next });
}

describe('PARITY — the display-safe bands equal the engine cold-start seed (no silent fork)', () => {
  test('guard-the-guard: the corpus is not vacuous and a pressure-blind fork would differ', () => {
    const { next, snapshot } = engineSeed();
    const records = Object.values(next).flatMap((byFaction) => Object.values(byFaction[GOVERNING_SEAT_KEY]));
    expect(records.length).toBeGreaterThanOrEqual(8);
    expect(new Set(records.map((r) => r.strengthBand)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(records.map((r) => r.allianceLabel)).size).toBeGreaterThanOrEqual(3);
    expect(records.some((r) => r.readiness > 0)).toBe(true);
    expect(records.some((r) => r.faithLabel == null) && records.some((r) => r.faithLabel != null)).toBe(true);
    // The fork this pin exists to catch: strength read WITHOUT the live pressures.
    /** @type {Map<string, number>} subject id to its seeded (true) strength band */
    const seededBand = new Map();
    for (const byFaction of Object.values(next)) {
      for (const [subjectId, rec] of Object.entries(byFaction[GOVERNING_SEAT_KEY])) seededBand.set(subjectId, rec.strengthBand);
    }
    const blind = snapshot.settlements
      .filter((item) => seededBand.has(item.id) && strengthBandOf(settlementStrength(item, {})) !== seededBand.get(item.id));
    expect(blind.length, 'the pressure index moves at least one band in this corpus').toBeGreaterThan(0);
  });

  test('every seeded belief is matched band for band by the provider', () => {
    const { next } = engineSeed();
    const truthFor = beliefTruthProvider({ campaign: liveCampaign(), saves: saves(), includeGroundTruth: true });
    expect(truthFor).not.toBeNull();
    let compared = 0;
    for (const observerId of Object.keys(next).sort()) {
      const bySubject = next[observerId][GOVERNING_SEAT_KEY];
      for (const subjectId of Object.keys(bySubject).sort()) {
        const seed = bySubject[subjectId];
        expect(truthFor(observerId)(subjectId), `${observerId} of ${subjectId}`).toEqual({
          strengthBand: seed.strengthBand,
          readiness: seed.readiness,
          allianceLabel: seed.allianceLabel,
          faithLabel: seed.faithLabel,
        });
        compared += 1;
      }
    }
    expect(compared).toBeGreaterThanOrEqual(8);
  });
});

describe('DISPLAY-SAFE — bands only, never the raw ground truth', () => {
  test('the projected truth carries only the four banded keys', () => {
    const truthFor = beliefTruthProvider({ campaign: liveCampaign(), saves: saves(), includeGroundTruth: true });
    const truth = truthFor('ash')('bel');
    expect(Object.keys(truth).sort()).toEqual(['allianceLabel', 'faithLabel', 'readiness', 'strengthBand']);
    expect(Number.isInteger(truth.strengthBand)).toBe(true);
    expect(truth.strengthBand).toBeGreaterThanOrEqual(0);
    expect(truth.strengthBand).toBeLessThanOrEqual(4);
    // readiness is the posture's own anchor (bel is mobilized), never a computed score
    expect(truth.readiness).toBe(0.75);
    // anchored: no strength score, pressure, or confidence key leaves the provider
    for (const key of ['strength01', 'confidence01', 'pressure', 'lastUpdateTick']) expect(truth).not.toHaveProperty(key);
  });
});

describe('FAIL-CLOSED — the player call and the dormant world build nothing', () => {
  test('the default (player) call answers null', () => {
    // anchored: the player projection carries no truth provider
    expect(beliefTruthProvider({ campaign: liveCampaign(), saves: saves() })).toBeNull();
    // anchored: an explicit false is the same fail-closed answer
    expect(beliefTruthProvider({ campaign: liveCampaign(), saves: saves(), includeGroundTruth: false })).toBeNull();
  });

  test('a dormant world (no belief map) and garbage answer null', () => {
    // anchored: no belief map means no comparison and no snapshot built
    expect(beliefTruthProvider({ campaign: campaign(), saves: saves(), includeGroundTruth: true })).toBeNull();
    // anchored: total on garbage
    expect(beliefTruthProvider({ includeGroundTruth: true })).toBeNull();
    // anchored: total on no arguments at all
    expect(beliefTruthProvider()).toBeNull();
  });
});

describe('HONEST GAPS — no truth is claimed the engine does not hold', () => {
  test('a subject beyond the declared neighbourhood carries no relationship truth', () => {
    const truthFor = beliefTruthProvider({ campaign: liveCampaign(), saves: saves(), includeGroundTruth: true });
    // ash and dun share no edge: strength and readiness are still true facts of dun
    const truth = truthFor('ash')('dun');
    expect(truth.strengthBand).toBe(3);
    expect(truth.readiness).toBe(0.25);
    // anchored: the engine holds no true ash to dun label, so none is supplied
    expect(truth).not.toHaveProperty('allianceLabel');
  });

  test('a settlement the realm does not carry has no truth at all', () => {
    const truthFor = beliefTruthProvider({ campaign: liveCampaign(), saves: saves(), includeGroundTruth: true });
    // anchored: an unknown subject id answers null rather than a neutral guess
    expect(truthFor('ash')('nowhere')).toBeNull();
  });
});
