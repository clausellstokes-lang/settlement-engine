import { describe, it, expect } from 'vitest';

import {
  TIER_OPTIONS,
  TERRAIN_OPTIONS,
  MAGIC_OPTIONS,
  CULTURE_OPTIONS,
  PROSPERITY_OPTIONS,
} from '../../../src/components/gallery/galleryUtils.js';

import { TIER_ORDER, PROSPERITY_TIERS, getMagicLevel } from '../../../src/data/constants.js';
import { TERRAIN_WEIGHTS, CULTURES } from '../../../src/generators/steps/resolveConfig.js';

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

describe('gallery facet vocabularies stay aligned to engine output', () => {
  it('TIER_OPTIONS matches the canonical tier ladder (TIER_ORDER)', () => {
    expectSuperset(TIER_OPTIONS, TIER_ORDER, 'tier');
    expectNoExtras(TIER_OPTIONS, TIER_ORDER, 'tier');
  });

  it('TERRAIN_OPTIONS matches the values resolveConfig rolls into config.terrainType', () => {
    const canonicalTerrains = TERRAIN_WEIGHTS.map(([terrain]) => terrain);
    expectSuperset(TERRAIN_OPTIONS, canonicalTerrains, 'terrain');
    expectNoExtras(TERRAIN_OPTIONS, canonicalTerrains, 'terrain');
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
});
