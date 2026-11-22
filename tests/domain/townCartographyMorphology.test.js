/**
 * townCartographyMorphology.test.js — A-10, THE URBAN MORPHOLOGY LAW, measured.
 *
 * "STATE decides order vs chaos" and "grid cores ONLY where a planned era earns
 * them" are binding on this slice. The way they fail in practice is not that
 * someone writes the wrong formula; it is that someone adds a style parameter
 * "just for now" and the map stops answering to the settlement. So these pins
 * measure two things: that each governance term MOVES the reading in the direction
 * the law states, one term at a time, and that the reading has no other input.
 *
 * ABSENCE IS NOT NEUTRALITY is pinned separately, because it is the failure mode a
 * dormant subsystem causes: coalescing a null fabric drift to 0.5 would let a dark
 * layer silently vote on the shape of every town in the product.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import {
  CARTOGRAPHY_PLACEMENTS,
  readTownMorphology,
} from '../../src/domain/townCartography/cartographyMorphology.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
} from '../../src/domain/townCartography/cartographyTuning.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE = readFileSync(
  join(ROOT, 'src/domain/townCartography/cartographyMorphology.js'),
  'utf8',
);

/** The neutral settlement: every term present and centred, so a single-field edit
 *  measures that field alone. */
function neutralSettlement(overrides = {}) {
  return {
    tier: 'city',
    powerStructure: { legitimacy: 0.5, factions: [{ power: 50 }, { power: 50 }] },
    activeConditions: [],
    urbanFabric: { drift: 0.5, stocks: { market: 0.5 } },
    age: 1040,
    ...overrides,
  };
}

describe('A-10 layer 1: each governance term moves order in the stated direction', () => {
  test('the neutral settlement reads exactly 0.5 (the terms are centred)', () => {
    expect(readTownMorphology(neutralSettlement()).order01).toBeCloseTo(0.5, 10);
  });

  test('legitimacy raises order; nothing else changes', () => {
    const low = readTownMorphology(neutralSettlement({
      powerStructure: { legitimacy: 0.1, factions: [{ power: 50 }, { power: 50 }] },
    }));
    const high = readTownMorphology(neutralSettlement({
      powerStructure: { legitimacy: 0.95, factions: [{ power: 50 }, { power: 50 }] },
    }));
    expect(high.order01).toBeGreaterThan(low.order01);
    expect(high.evidence.concentration01).toBe(low.evidence.concentration01);
  });

  test('power concentration raises order (one hand lays out a town)', () => {
    const fragmented = readTownMorphology(neutralSettlement({
      powerStructure: {
        legitimacy: 0.5,
        factions: [{ power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }],
      },
    }));
    const concentrated = readTownMorphology(neutralSettlement({
      powerStructure: { legitimacy: 0.5, factions: [{ power: 90 }, { power: 10 }] },
    }));
    expect(concentrated.order01).toBeGreaterThan(fragmented.order01);
  });

  test('revealed corruption lowers order', () => {
    const clean = readTownMorphology(neutralSettlement());
    const corrupt = readTownMorphology(neutralSettlement({
      activeConditions: [{ id: 'c', archetype: 'corruption_ring', severity: 0.9 }],
    }));
    expect(corrupt.order01).toBeLessThan(clean.order01);
    expect(corrupt.evidence.corruption01).toBe(0.9);
  });

  test('revealed unrest lowers order', () => {
    const calm = readTownMorphology(neutralSettlement());
    const restive = readTownMorphology(neutralSettlement({
      activeConditions: [{ id: 'u', archetype: 'civil_unrest', severity: 0.8 }],
    }));
    expect(restive.order01).toBeLessThan(calm.order01);
    expect(restive.evidence.unrest01).toBe(0.8);
  });

  test('chaotic fabric drift lowers order; lawful drift raises it', () => {
    const lawful = readTownMorphology(neutralSettlement({
      urbanFabric: { drift: 0.02, stocks: { market: 0.5 } },
    }));
    const chaotic = readTownMorphology(neutralSettlement({
      urbanFabric: { drift: 0.98, stocks: { market: 0.5 } },
    }));
    expect(lawful.order01).toBeGreaterThan(0.5);
    expect(chaotic.order01).toBeLessThan(0.5);
  });

  test('a COVERT condition never moves the map (the audience-projection law)', () => {
    const open = readTownMorphology(neutralSettlement());
    const concealed = readTownMorphology(neutralSettlement({
      activeConditions: [{ id: 'c', archetype: 'corruption_ring', severity: 1, covert: true }],
    }));
    expect(concealed.order01).toBe(open.order01);
    expect(concealed.evidence.corruption01).toBe(0);
  });
});

describe('absence is not neutrality', () => {
  test('a dark fabric layer contributes NO drift term, and says so', () => {
    const dark = readTownMorphology(neutralSettlement({ urbanFabric: undefined }));
    expect(dark.evidence.fabricDrift01).toBeNull();
    expect(dark.evidence.fabricAccumulation01).toBeNull();
  });

  test('an ABSENT fabric stock is not a coalesced value at either end or the middle', () => {
    const absent = readTownMorphology(neutralSettlement({ urbanFabric: { drift: 0.5 } }));
    const barely = readTownMorphology(neutralSettlement({
      urbanFabric: { drift: 0.5, stocks: { market: 0.01 } },
    }));
    const middling = readTownMorphology(neutralSettlement({
      urbanFabric: { drift: 0.5, stocks: { market: 0.5 } },
    }));
    const full = readTownMorphology(neutralSettlement({
      urbanFabric: { drift: 0.5, stocks: { market: 1 } },
    }));
    // Absence drops the TERM, which changes the denominator of the weighted mean.
    // A coalesce-to-zero implementation would equal `barely`; a coalesce-to-neutral
    // one would equal `middling`. It equals neither, and that is the whole claim.
    expect(absent.planning01).not.toBe(barely.planning01);
    expect(absent.planning01).not.toBe(middling.planning01);
    expect(absent.planning01).not.toBe(full.planning01);
    expect(absent.evidence.fabricAccumulation01).toBeNull();
    expect(barely.evidence.fabricAccumulation01).toBe(0.01);
  });

  test('DISCOVERED: fabricStocksFor drops zero stocks, so a zeroed layer reads as dark', () => {
    // Not a bug here, but a seam worth naming: townMap/fabricRead.js filters out
    // non-positive stocks, so `stocks: { market: 0 }` reaches this module as an
    // EMPTY record and is indistinguishable from a dormant fabric layer. The
    // reading is the same either way, which is the honest answer -- a settlement
    // that has accumulated nothing and a settlement whose ledger is dark both have
    // no evidence to offer -- but a future consumer that needs to tell them apart
    // must go to the ledger, not to this reading.
    const zeroed = readTownMorphology(neutralSettlement({
      urbanFabric: { drift: 0.5, stocks: { market: 0 } },
    }));
    const dark = readTownMorphology(neutralSettlement({ urbanFabric: { drift: 0.5 } }));
    expect(zeroed.evidence.fabricAccumulation01).toBeNull();
    expect(zeroed.planning01).toBe(dark.planning01);
  });

  test('an unrecorded age contributes no maturity term', () => {
    const undated = readTownMorphology(neutralSettlement({ age: null }));
    expect(undated.evidence.ageTicks).toBeNull();
    expect(Number.isFinite(undated.planning01)).toBe(true);
  });

  test('a settlement with no power structure at all still reads (totality)', () => {
    const bare = readTownMorphology({ tier: 'town' });
    expect(bare.evidence.legitimacy01).toBeNull();
    expect(bare.evidence.concentration01).toBeNull();
    expect(bare.order01).toBe(0.5);
    expect(CARTOGRAPHY_PLACEMENTS).toContain(bare.placement);
  });
});

describe('A-10 layer 4: a grid core must be EARNED', () => {
  test('a thorp with perfect planning still gets no grid core (the tier floor binds)', () => {
    const perfect = {
      tier: 'thorp',
      powerStructure: { legitimacy: 1, factions: [{ power: 100 }] },
      activeConditions: [],
      urbanFabric: { drift: 0, stocks: { market: 1, craft: 1 } },
      age: 99999,
    };
    const reading = readTownMorphology(perfect);
    expect(reading.planning01).toBeGreaterThan(
      TOWN_CARTOGRAPHY_TUNING.MORPHOLOGY.GRID_CORE_PLANNING_FLOOR,
    );
    expect(reading.gridCore).toBe(false);
  });

  test('the same governance at metropolis DOES earn a grid core (the transition)', () => {
    const earned = readTownMorphology({
      tier: 'metropolis',
      powerStructure: { legitimacy: 1, factions: [{ power: 100 }] },
      activeConditions: [],
      urbanFabric: { drift: 0, stocks: { market: 1, craft: 1 } },
      age: 99999,
    });
    expect(earned.gridCore).toBe(true);
  });

  test('a lawless metropolis gets no grid core however old and large it is', () => {
    const lawless = readTownMorphology({
      tier: 'metropolis',
      powerStructure: {
        legitimacy: 0.02,
        factions: [{ power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }],
      },
      activeConditions: [
        { id: 'c', archetype: 'corruption_ring', severity: 1 },
        { id: 'u', archetype: 'civil_unrest', severity: 1 },
      ],
      urbanFabric: { drift: 1, stocks: { market: 1 } },
      age: 99999,
    });
    // THE REGRESSION THIS PINS (found 2026-08-01, fixed in the same change):
    // planning maturity is a weighted MEAN, so this settlement's age, size and
    // accumulated fabric summed to 0.667 maturity while its order01 was ZERO, and
    // it earned a planned grid core. Law is now a GATE on top of the mean.
    expect(lawless.order01).toBe(0);
    expect(lawless.planning01).toBeGreaterThan(
      TOWN_CARTOGRAPHY_TUNING.MORPHOLOGY.GRID_CORE_PLANNING_FLOOR,
    );
    expect(lawless.gridCore).toBe(false);
    expect(lawless.placement).toBe('dispersed_chaotic');
  });
});

describe('the placement vocabulary is closed and every member is reachable', () => {
  const POSTURES = Object.freeze({
    district: {
      tier: 'city',
      powerStructure: { legitimacy: 1, factions: [{ power: 90 }, { power: 10 }] },
      activeConditions: [],
      urbanFabric: { drift: 0 },
    },
    clustered: {
      tier: 'city',
      powerStructure: {
        legitimacy: 1,
        factions: [{ power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }],
      },
      activeConditions: [],
      urbanFabric: { drift: 0 },
    },
    dispersed_orderly: {
      tier: 'city',
      powerStructure: { legitimacy: 0.5, factions: [{ power: 50 }, { power: 50 }] },
      activeConditions: [],
      urbanFabric: { drift: 0.5 },
    },
    dispersed_chaotic: {
      tier: 'city',
      powerStructure: {
        legitimacy: 0,
        factions: [{ power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }, { power: 20 }],
      },
      activeConditions: [{ id: 'u', archetype: 'civil_unrest', severity: 1 }],
      urbanFabric: { drift: 1 },
    },
  });

  test('each authored posture yields its own placement (no member is dead)', () => {
    const failures = collectSeedFailures(Object.keys(POSTURES), (name) => {
      expect(readTownMorphology(POSTURES[name]).placement).toBe(name);
    });
    expectNoSeedFailures(failures, 'all four placement values are reachable from real state');
  });

  test('the vocabulary is exactly four values and every reading is a member', () => {
    expect([...CARTOGRAPHY_PLACEMENTS].sort()).toEqual([
      'clustered', 'dispersed_chaotic', 'dispersed_orderly', 'district',
    ]);
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(CARTOGRAPHY_PLACEMENTS).toContain(readTownMorphology({ tier }).placement);
    }
  });
});

describe('the reading is derived, never dialled', () => {
  test('readTownMorphology takes the settlement and nothing else', () => {
    expect(readTownMorphology.length).toBe(1);
  });

  test('the source declares no style, preset, or knob input', () => {
    const code = SOURCE
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    // anchored: the positive half is that the derivation's own terms are present,
    // which only holds while this file still computes the reading it claims to.
    expect(code).toContain('LEGITIMACY_WEIGHT');
    expect(code).toContain('FABRIC_DRIFT_WEIGHT');
    for (const knob of ['styleKnob', 'chaosLevel', 'organicness', 'layoutPreset']) {
      expect(code.includes(knob)).toBe(false);
    }
  });

  test('the reading is frozen and pure (same input, deep-equal output)', () => {
    const settlement = neutralSettlement();
    const first = readTownMorphology(settlement);
    const second = readTownMorphology(settlement);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.evidence)).toBe(true);
  });
});
