import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  TIER_OPTIONS,
  TERRAIN_OPTIONS,
  MAGIC_OPTIONS,
  CULTURE_OPTIONS,
  PROSPERITY_OPTIONS,
} from '../../../src/components/gallery/galleryUtils.js';

import { TIER_ORDER, PROSPERITY_TIERS, getMagicLevel } from '../../../src/data/constants.js';
import { TERRAIN_WEIGHTS, CULTURES } from '../../../src/generators/steps/resolveConfig.js';
import { NAMING_DATA } from '../../../src/data/namingData.js';
// ⭐ EM-P3 — THE ONE HOME, read from BOTH of its addresses. The option VALUES live
// in src/data (the generation worker reaches them there); the stable domain address
// re-exports them and owns the citation index, and it is what the gallery imports.
import {
  TERRAIN_WEIGHTS as DATA_TERRAIN_WEIGHTS,
  TERRAINS as DATA_TERRAINS,
  CULTURES as DATA_CULTURES,
} from '../../../src/data/worldFactOptions.js';
import {
  TERRAINS as DOMAIN_TERRAINS,
  CULTURES as DOMAIN_CULTURES,
  WORLD_FACT_SOURCES,
} from '../../../src/domain/worldFactOptions.js';
import { CULTURE_PROFILE_KEYS } from '../../../src/data/cultureProfiles.js';

// ─────────────────────────────────────────────────────────────────────────────
// Gallery facet ↔ engine vocabulary alignment.
//
// The whole gallery-filter fix (migration 063) rests on a four-way string
// agreement that nothing else can verify automatically:
//
//   engine output  →  galleryUtils *_OPTIONS  →  migration 063 backfill paths
//                                              →  list_gallery_dossiers WHERE IN-lists
//
// The SQL ends of that chain cannot import JS constants, so the durable guard
// is here: pin each sidebar vocabulary to the canonical engine source it
// claims to mirror, and fail the build on drift. An IN-list silently returns
// empty when a value drifts (exactly the migration-019 bug class that shipped
// broken and went undetected), so a rename of a prosperity LABEL, a culture
// key, or a terrain value must light up red here instead.
//
// Each facet must be a SUPERSET of (a superset that is, in practice, equal to)
// the values the engine actually persists. A superset is safe: an extra option
// just never matches a row. A subset is the bug: a real persisted value the
// sidebar can never select. The equality assertions below also catch dead
// options.
// ─────────────────────────────────────────────────────────────────────────────

/** Assert `options` covers every value in `canonical` (no persisted value is unreachable). */
function expectSuperset(options, canonical, label) {
  const missing = canonical.filter((v) => !options.includes(v));
  expect(missing, `${label}: sidebar is missing engine value(s) ${JSON.stringify(missing)}`).toEqual([]);
}

/** Assert `options` adds nothing the engine never emits (no dead, never-matching option). */
function expectNoExtras(options, canonical, label) {
  const extra = options.filter((v) => !canonical.includes(v));
  expect(extra, `${label}: sidebar has option(s) the engine never emits ${JSON.stringify(extra)}`).toEqual([]);
}

// ─────────────────────────────────────────────────────────────────────────────
// ⭐ EM-P3 — THE SINGLE-SOURCE ARM, AND WHY IT IS AN EQUALITY RATHER THAN A
// SUPERSET. The superset/no-extras pair above is the right shape for a FACET
// (an extra chip is harmless; a missing one is the bug). It is the wrong shape
// for the question EM-P3 asks, which is whether two modules still spell the SAME
// LIST. Order is part of that: TERRAIN_WEIGHTS is read BY POSITION by
// rng.weightedPick, so a list with the right members in the wrong order is a
// generation shift wearing a move's clothes. Never a superset test where an
// equality is available.
// ─────────────────────────────────────────────────────────────────────────────

/** Name the divergence between two spellings, so a red says WHICH member moved. */
function arrayDivergence(actual, canonical) {
  const missing = canonical.filter((v) => !actual.includes(v));
  const extra = actual.filter((v) => !canonical.includes(v));
  const reordered = missing.length === 0 && extra.length === 0
    && canonical.some((v, i) => actual[i] !== v);
  return { missing, extra, reordered };
}

/** Assert `spelling` is the canonical list EXACTLY — same members, same order. */
function expectSameArray(spelling, canonical, label) {
  const actual = [...spelling];
  const { missing, extra, reordered } = arrayDivergence(actual, [...canonical]);
  expect(
    actual,
    `${label}: this spelling has drifted from the one home in `
    + `src/data/worldFactOptions.js — missing ${JSON.stringify(missing)}, `
    + `extra ${JSON.stringify(extra)}${reordered ? ', same members in a DIFFERENT ORDER' : ''}. `
    + 'Re-point the spelling at the canonical list; never re-word the list to match a spelling.',
  ).toEqual([...canonical]);
}

/** The SEVEN world facts WORLD_FACT_SOURCES cites. Trade access is EM-P3b's row. */
const WORLD_FACTS = [
  'terrain', 'culture', 'monsterThreat', 'stressors', 'resources', 'goods', 'services',
];

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

describe('gallery facet vocabularies stay aligned to engine output', () => {
  it('TIER_OPTIONS matches the canonical tier ladder (TIER_ORDER)', () => {
    expectSuperset(TIER_OPTIONS, TIER_ORDER, 'tier');
    expectNoExtras(TIER_OPTIONS, TIER_ORDER, 'tier');
  });

  it('TERRAIN_OPTIONS matches the values resolveConfig rolls into config.terrainType', () => {
    const canonicalTerrains = TERRAIN_WEIGHTS.map(([terrain]) => terrain);
    expectSuperset(TERRAIN_OPTIONS, canonicalTerrains, 'terrain');
    expectNoExtras(TERRAIN_OPTIONS, canonicalTerrains, 'terrain');

    // A1 — ONE SOURCE. Every live production spelling of terrain, equal AS ARRAYS
    // to the canonical list, in both directions (toEqual is symmetric).
    expectSameArray(DATA_TERRAINS, canonicalTerrains, 'terrain (src/data/worldFactOptions.js)');
    expectSameArray(DOMAIN_TERRAINS, canonicalTerrains, 'terrain (the src/domain address)');
    expectSameArray(TERRAIN_OPTIONS, canonicalTerrains, 'terrain (the gallery facet)');
    expectSameArray(
      DATA_TERRAIN_WEIGHTS.map(([terrain]) => terrain),
      canonicalTerrains,
      'terrain (resolveConfig’s re-export vs the data leaf it re-exports)',
    );

    // A5 — ORDER IS LOAD-BEARING, pinned against the pre-move literal. This is the
    // arm that makes EM-P3 a move rather than a re-vocabulary: the weights ride
    // rng.weightedPick BY POSITION (resolveConfig.js), so a reorder or a re-weight
    // moves every random-terrain world ever generated from a stored seed.
    expect(
      TERRAIN_WEIGHTS.map(([terrain, weight]) => [terrain, weight]),
      'terrain: TERRAIN_WEIGHTS is consumed positionally by rng.weightedPick, so this array '
      + 'is a generation input and not a list. EM-P3 moved it and changed no value: restore '
      + 'the members, the order AND the weights. Never re-record a golden to match a reorder.',
    ).toEqual([
      ['plains', 22], ['hills', 18], ['forest', 13],
      ['riverside', 16], ['coastal', 16], ['mountain', 9], ['desert', 6],
    ]);

    // A3 — GUARD THE GUARD. An equality arm that cannot see a planted divergence is
    // a green that means nothing, so plant one and require the arm to red BY NAME.
    let plantedRed = null;
    try {
      expectSameArray([...TERRAIN_OPTIONS, 'tundra'], canonicalTerrains, 'terrain (planted)');
    } catch (error) {
      plantedRed = String((error && error.message) || '');
    }
    expect(
      plantedRed,
      'the single-source arm ACCEPTED a planted extra terrain: it cannot see a divergence, '
      + 'so every green above is vacuous',
    ).toBeTruthy();
    expect(plantedRed, 'the planted red must name the world fact it is about').toContain('terrain');
    expect(plantedRed, 'the planted red must name the divergent member').toContain('tundra');
  });

  it('MAGIC_OPTIONS matches every band getMagicLevel can emit', () => {
    // Derive the band set by exercising the canonical mapping across its full
    // priority domain rather than hardcoding — if the thresholds or labels in
    // getMagicLevel change, the derived set changes and this assertion moves
    // with it.
    const emitted = new Set();
    for (let priority = 0; priority <= 100; priority += 1) emitted.add(getMagicLevel(priority));
    const canonicalMagic = [...emitted];
    expectSuperset(MAGIC_OPTIONS, canonicalMagic, 'magicLevel');
    expectNoExtras(MAGIC_OPTIONS, canonicalMagic, 'magicLevel');
  });

  it('CULTURE_OPTIONS matches resolveConfig’s canonical 11-culture catalog', () => {
    expectSuperset(CULTURE_OPTIONS, CULTURES, 'culture');
    expectNoExtras(CULTURE_OPTIONS, CULTURES, 'culture');
    expect(CULTURE_OPTIONS.length, 'culture: expected the canonical 11-culture catalog').toBe(11);

    // A1 — ONE SOURCE, for culture's four live production spellings. The profile
    // corpus is measured to carry the catalogue in the SAME ORDER, so it takes the
    // equality too rather than the weaker sorted comparison the NAMING_DATA arm
    // below must use (an object's key order is not the catalogue's order).
    expectSameArray(DATA_CULTURES, CULTURES, 'culture (src/data/worldFactOptions.js)');
    expectSameArray(DOMAIN_CULTURES, CULTURES, 'culture (the src/domain address)');
    expectSameArray(CULTURE_OPTIONS, CULTURES, 'culture (the gallery facet)');
    expectSameArray(CULTURE_PROFILE_KEYS, CULTURES, 'culture (CULTURE_PROFILE_KEYS)');
  });

  it('NAMING_DATA supplies a name set for every canonical culture (no silent germanic fallback)', () => {
    // The generator resolves names via `NAMING_DATA[culture] || NAMING_DATA.germanic`,
    // so a culture added to CULTURES but forgotten in NAMING_DATA would silently
    // generate germanic names — invisible to the facet tests above (which only pin
    // CULTURE_OPTIONS↔CULTURES). Pin the third copy of the culture list too, so a new
    // culture must ship its own naming data or this reds.
    expect(Object.keys(NAMING_DATA).sort()).toEqual([...CULTURES].sort());
  });

  it('PROSPERITY_OPTIONS matches the labels economicGenerator emits', () => {
    // economicGenerator's generateEconomicNarrative emits PROSPERITY_TIERS minus
    // the internal 'Subsistence' base label, which is always remapped to
    // Struggling/Poor before emission (see constants.js PROSPERITY_TIERS note).
    // The persisted economicState.prosperity the gallery facet filters on is
    // therefore the six emitted labels — and never 'Subsistence'.
    const emittedProsperity = PROSPERITY_TIERS.filter((label) => label !== 'Subsistence');
    expectSuperset(PROSPERITY_OPTIONS, emittedProsperity, 'prosperity');
    expectNoExtras(PROSPERITY_OPTIONS, emittedProsperity, 'prosperity');
    expect(
      PROSPERITY_OPTIONS.includes('Subsistence'),
      'prosperity: ‘Subsistence’ is an internal-only label and must not be a facet (it is remapped before persistence)',
    ).toBe(false);
  });

  it('WORLD_FACT_SOURCES cites the seven world facts exactly, and trade access is not among them', () => {
    // The NAMED set, not merely the count: a dropped key hiding behind a key
    // someone else added is exactly the drift a count-only arm cannot see.
    expect(
      Object.keys(WORLD_FACT_SOURCES).sort(),
      'WORLD_FACT_SOURCES must name every world fact that HAS a canonical home, and only those',
    ).toEqual([...WORLD_FACTS].sort());
    expect(
      Object.prototype.hasOwnProperty.call(WORLD_FACT_SOURCES, 'tradeAccess'),
      'trade access is EM-P3b’s row (the charter, 2026-09-19); EM-P3b adds the eighth key and '
      + 'moves this arm. Its absence here is a ruling, not an omission: no list exists to cite '
      + 'yet, and an empty or placeholder key would answer [] to a real caller.',
    ).toBe(false);
  });

  it('every WORLD_FACT_SOURCES citation resolves: the file exists and spells the symbol verbatim', () => {
    const entries = Object.entries(WORLD_FACT_SOURCES);
    // Non-vacuity first: a walk over an empty index convicts nothing.
    expect(entries.length, 'the citation index is empty, so the walk below proves nothing').toBe(7);

    const unresolved = [];
    let resolved = 0;
    for (const [fact, citation] of entries) {
      const [relPath, symbol] = String(citation).split('#');
      if (!relPath || !symbol) {
        unresolved.push(`${fact}: “${citation}” is not a path#SYMBOL citation`);
        continue;
      }
      if (!existsSync(join(REPO_ROOT, relPath))) {
        unresolved.push(`${fact}: ${relPath} does not exist`);
        continue;
      }
      if (!readFileSync(join(REPO_ROOT, relPath), 'utf8').includes(`export const ${symbol}`)) {
        unresolved.push(`${fact}: ${relPath} carries no “export const ${symbol}”`);
        continue;
      }
      resolved += 1;
    }
    expect(
      unresolved,
      `WORLD_FACT_SOURCES cites a vocabulary that is not there: ${unresolved.join('; ')}. `
      + 'A citation index whose addresses have rotted is worse than no index: it tells the next '
      + 'reader a fact is single-sourced when it is not.',
    ).toEqual([]);
    expect(resolved, 'every citation must have been resolved by reading a real file').toBe(entries.length);
  });
});
