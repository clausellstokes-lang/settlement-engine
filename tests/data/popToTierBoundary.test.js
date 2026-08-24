import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import { tierFor } from '../../src/components/map/TierIcon.jsx';
import { popToTier, POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { createMapSlice } from '../../src/store/mapSlice.js';

// Regression + invariant: popToTier's boundaries must agree with
// POPULATION_RANGES exactly, or a settlement is stamped with a tier whose own
// max it exceeds. The thorp/hamlet boundary was previously 80 (thorp), leaking
// pop 61-80 into `thorp` while POPULATION_RANGES.thorp maxes at 60.
describe('popToTier boundaries agree with POPULATION_RANGES', () => {
  test('the 61-80 window classifies as hamlet, not thorp', () => {
    expect(popToTier(60)).toBe('thorp');
    expect(popToTier(61)).toBe('hamlet');
    expect(popToTier(80)).toBe('hamlet');
    expect(popToTier(400)).toBe('hamlet');
  });

  test('every non-metropolis tier max maps to that tier, and max+1 to the next', () => {
    for (let i = 0; i < TIER_ORDER.length - 1; i++) {
      const tier = TIER_ORDER[i];
      const next = TIER_ORDER[i + 1];
      const { max } = POPULATION_RANGES[tier];
      expect(popToTier(max)).toBe(tier);
      expect(popToTier(max + 1)).toBe(next);
    }
  });

  test('a resulting tier never has the population above its own range max', () => {
    for (const pop of [8, 60, 61, 79, 80, 400, 401, 900, 5000, 25000, 25001, 99999]) {
      const tier = popToTier(pop);
      const { min, max } = POPULATION_RANGES[tier];
      expect(pop).toBeGreaterThanOrEqual(min);
      if (tier !== 'metropolis') expect(pop).toBeLessThanOrEqual(max);
    }
  });
});

// ── PRODUCER EQUALITY: every population→tier classifier is popToTier ──────────
// TE-SEAM §3. Two map-side surfaces carried their OWN inline copy of the tier
// chain with hamlet capped at 240 against POPULATION_RANGES' 400, so a
// settlement of 241-400 souls drew a village icon and was handed to the wizard
// as a `village` config while the dossier, compendium and engine all said
// hamlet. Both now call popToTier. These assertions are what makes a re-fork
// RED rather than silent — the behavioural half proves the answers agree, the
// structural half proves no NEW inline chain has been introduced beside them.
const BOUNDARY_POPULATIONS = [
  60, 61,       // thorp | hamlet
  240, 241,     // ⚠ the seam: the retired chain's false hamlet cap
  400, 401,     // hamlet | village
  900, 901,     // village | town
  5000, 5001,   // town | city
  25000, 25001, // city | metropolis
];

/** burgToConfig is a pure classifier on the slice — no state, no persistence. */
const mapSliceActions = createMapSlice(() => {}, () => ({}));

describe('producer equality — every tier classifier agrees with popToTier', () => {
  test('TierIcon.tierFor derives the same tier as popToTier at every boundary', () => {
    for (const pop of BOUNDARY_POPULATIONS) {
      expect(tierFor({ population: pop })).toBe(popToTier(pop));
    }
  });

  test('mapSlice.burgToConfig stamps the same settType as popToTier at every boundary', () => {
    for (const pop of BOUNDARY_POPULATIONS) {
      expect(mapSliceActions.burgToConfig({ population: pop }).settType).toBe(popToTier(pop));
    }
  });

  test('the 241-400 window is hamlet on every surface, not village', () => {
    for (const pop of [241, 300, 400]) {
      expect(popToTier(pop)).toBe('hamlet');
      expect(tierFor({ population: pop })).toBe('hamlet');
      expect(mapSliceActions.burgToConfig({ population: pop }).settType).toBe('hamlet');
    }
  });

  // The `?? 0` in tierFor is load-bearing, not decoration: the retired inline
  // chain defaulted its parameter to 0, but popToTier(undefined) falls through
  // every `<=` comparison and returns 'metropolis'. PlacementsLayer passes a
  // bare `{ population: p.population }` for an unlinked placement, so dropping
  // the guard would put a metropolis crown on a placement of unknown size.
  test('a placement with no population stays a thorp, never a metropolis', () => {
    expect(tierFor({ population: undefined })).toBe('thorp');
    expect(tierFor({})).toBe('thorp');
    expect(popToTier(undefined)).toBe('metropolis'); // the trap being guarded
  });

  test('an explicit stored tier still wins over the derived one', () => {
    expect(tierFor({ tier: 'city', population: 300 })).toBe('city');
    expect(tierFor({ settType: 'town', population: 300 })).toBe('town');
    expect(tierFor({ tier: 'nonsense', population: 300 })).toBe('hamlet');
  });
});

describe('structural — no source file re-forks the tier chain', () => {
  // Habitat removal. Both cured files now hold ZERO population-threshold
  // comparisons; anything matching here is a new inline chain, which is the
  // exact shape that produced this defect. When a third surface starts
  // classifying populations, add a THIRD literal-title test below.
  //
  // ⛔ DELIBERATELY NOT `test.each(FILES)`: this repo's sovereignty-lighting
  // walker (tests/lint/sovereigntyLightingContract.walker.test.js) PARKS any
  // test file that calls `each` on a NON-LITERAL table, because a parked file's
  // titles cannot be statically registered and therefore prove nothing to the
  // census. A `test.each` here moved the frozen parked-file count 366 -> 367 and
  // RED the gate. Two literal-title tests keep the file statically walkable.
  const THRESHOLD_COMPARISON =
    /(?:<=|>=|<|>)\s*(?:60|61|240|241|400|401|900|901|5000|5001|25000|25001)\b/g;

  const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

  /** Assert one file classifies only through popToTier, never an inline chain. */
  function expectSingleSpelling(rel) {
    const source = readFileSync(repoRoot + rel, 'utf8');
    expect(source, `${rel} no longer reaches popToTier`).toMatch(/\bpopToTier\b/);
    expect(
      source.match(THRESHOLD_COMPARISON) || [],
      `${rel} grew an inline population-threshold chain`,
    ).toEqual([]);
  }

  test('src/components/map/TierIcon.jsx classifies through popToTier only', () => {
    expectSingleSpelling('src/components/map/TierIcon.jsx');
  });

  test('src/store/mapSlice.js classifies through popToTier only', () => {
    expectSingleSpelling('src/store/mapSlice.js');
  });
});
