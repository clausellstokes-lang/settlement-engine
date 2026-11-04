import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import { tierFor } from '../../src/components/map/TierIcon.jsx';
import { popToTier, POPULATION_RANGES, TIER_ORDER, TIER_STAMP_CUTS } from '../../src/data/constants.js';
import { createMapSlice } from '../../src/store/mapSlice.js';

// X-46 THE HISTORICAL SCALE, car 1 (ODQ §934.104, 2026-11-03) — the owner's historical table.
// The ROLL bands overlap by design (a large hamlet and a small village are the same size); the
// STAMP does not: popToTier cuts each overlap at one point (25 / 88 / 350 / 2,250 / 15,000), so
// a 'custom' population and every tier-change resolver read ONE disjoint law. The DM's chosen
// tier always wins at generation; the stamp is never re-applied to a rolled population.
const OWNER_TABLE = {
  thorp:      { min: 5,     max: 30 },
  hamlet:     { min: 20,    max: 100 },
  village:    { min: 75,    max: 400 },
  town:       { min: 300,   max: 2500 },
  city:       { min: 2000,  max: 15000 },
  metropolis: { min: 15000, max: 50000 }, // the roll's body; it thins past it to 1,000,000 (car 1b, 2026-11-04)
};

describe('the roll bands are the owner\'s table; the stamp cuts each overlap once', () => {
  test('POPULATION_RANGES is the owner\'s historical table', () => {
    expect(POPULATION_RANGES).toEqual(OWNER_TABLE);
  });

  test('popToTier stamps at the cut points 25 / 88 / 350 / 2,250 / 15,000', () => {
    const expected = [
      [24, 'thorp'], [25, 'hamlet'], [87, 'hamlet'], [88, 'village'],
      [349, 'village'], [350, 'town'], [2249, 'town'], [2250, 'city'],
      [14999, 'city'], [15000, 'metropolis'],
    ];
    expect(expected.map(([pop]) => [pop, popToTier(pop)])).toEqual(expected);
  });

  test('adjacent roll bands overlap, and every cut point lies inside its overlap', () => {
    for (let i = 0; i < TIER_ORDER.length - 1; i++) {
      const lower = POPULATION_RANGES[TIER_ORDER[i]];
      const upper = POPULATION_RANGES[TIER_ORDER[i + 1]];
      expect(upper.min, `${TIER_ORDER[i + 1]} starts inside ${TIER_ORDER[i]}`).toBeLessThanOrEqual(lower.max);
      const cut = TIER_STAMP_CUTS[TIER_ORDER[i + 1]];
      expect(cut).toBeGreaterThanOrEqual(upper.min);
      expect(cut).toBeLessThanOrEqual(lower.max);
      expect(popToTier(cut - 1)).toBe(TIER_ORDER[i]);
      expect(popToTier(cut)).toBe(TIER_ORDER[i + 1]);
    }
  });

  test('the stamp is monotone: a larger population never stamps a smaller tier', () => {
    let previous = 0;
    const backwards = [];
    for (let pop = 1; pop <= 70000; pop++) {
      const rank = TIER_ORDER.indexOf(popToTier(pop));
      if (rank < previous) backwards.push(pop);
      previous = rank;
    }
    expect(backwards).toEqual([]);
  });

  test('every stamped tier\'s own roll band holds the population it was stamped from', () => {
    const outside = [];
    for (let pop = OWNER_TABLE.thorp.min; pop <= OWNER_TABLE.metropolis.max; pop++) {
      const { min, max } = POPULATION_RANGES[popToTier(pop)];
      if (pop < min || pop > max) outside.push(pop);
    }
    expect(outside).toEqual([]);
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
  24, 25,       // thorp | hamlet
  87, 88,       // hamlet | village
  240, 241,     // ⚠ the seam: the retired chain's false hamlet cap
  349, 350,     // village | town
  2249, 2250,   // town | city
  14999, 15000, // city | metropolis
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

  test('the 25-87 window is hamlet on every surface, not thorp or village', () => {
    for (const pop of [25, 60, 87]) {
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
    expect(tierFor({ tier: 'nonsense', population: 300 })).toBe('village');
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
    /(?:<=|>=|<|>)\s*(?:24|25|87|88|240|241|349|350|2249|2250|14999|15000|60|61|400|401|900|901|5000|5001|25000|25001)\b/g;

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
