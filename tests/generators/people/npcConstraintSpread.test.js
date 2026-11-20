/**
 * npcConstraintSpread.test.js — PEOPLE-1 B1b (2026-11-20; the chair's ruling of 16:51 UTC on
 * `docs/chair/2026-11-20/content/people/PROPOSAL-activeConstraint.md`): NO LIMIT OF A POST READS THE SAME IN MOST CITIES.
 * A card's `activeConstraint` was one line per `T` row (`generators/npcStructure.js`), printed on the card as
 * "Constraint: <text>", so the calm rows printed on most cities alike (SAME-1 by containment: top share thorp to metropolis
 * 57/40/42/69/95/85%). The cure pools each row (`data/npcStructureVariants.js :: CONSTRAINT_VARIANTS`). The bar: of 30 cities
 * born as the chair's instrument births them (`hxd-city-0..29`), no constraint sentence on more than 6 of them.
 *
 * RED AT 2609dd3a1 (B1's tip, the constraint not yet pooled): the calm defaults on most of the 30.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

/** The bar: no sentence on more than this many of the 30. */
const AT_MOST = 6;

describe('PEOPLE-1 B1b · the limit of a post reads apart from city to city', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it(`of 30 cities (hxd-city-0..29), no constraint sentence on more than ${AT_MOST}`, () => {
    /** @type {Map<string, number>} */ const places = new Map();
    let holding = 0;
    for (let i = 0; i < 30; i++) {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: `hxd-city-${i}`, customContent: {} });
      const said = new Set((s.npcs || []).map((/** @type {any} */ c) => c.activeConstraint).filter((/** @type {unknown} */ p) => typeof p === 'string' && p !== ''));
      if (said.size) holding++;
      for (const p of said) places.set(p, (places.get(p) || 0) + 1);
    }
    expect(holding, 'premise: the cities print constraints').toBeGreaterThan(20);
    const over = [...places].filter(([, n]) => n > AT_MOST).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${n}/30 ${p}`);
    expect(over).toEqual([]);
  }, 300_000);
});
