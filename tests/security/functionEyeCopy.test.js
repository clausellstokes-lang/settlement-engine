/**
 * functionEyeCopy.test.js — THE FLOOR'S COPY OF THE FUNCTION EYE IS HELD EQUAL TO THE VEIL'S DECLARATION (RULING 122-B-3, the
 * eleventh chair, 2026-11-28).
 *
 * `traditions/traditionFloor.js` takes `withoutFunction` from the leaf `traditions/functionEye.js`, which holds ITS OWN COPY of
 * the field names the veil's `function` eye removes, so the advance worker no longer carries the description tables and the
 * veil module. `traditions/traditionDescription.js` keeps deriving its names from the veil's own declaration
 * (`galleryVeil.js :: CARD_KINDS.institution.fields.function`) and keeps its own `withoutFunction`. This file holds the two
 * equal: (i) the names, as a set, both directions, read from the veil module here; (ii) on 200 houses of born towns and a
 * house planted with every function field, the two functions give JSON-equal results. Beside
 * tests/security/traditionDescriptionSharedPage.test.js, which holds the floor's draw.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { CARD_KINDS } from '../../src/domain/display/galleryVeil.js';
import { FUNCTION_EYE_KEYS, withoutFunction as floorWithoutFunction } from '../../src/domain/traditions/functionEye.js';
import { withoutFunction as readerWithoutFunction } from '../../src/domain/traditions/traditionDescription.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

const DRIFT = 'the veil\'s declaration (galleryVeil.js :: CARD_KINDS.institution.fields.function) gained or lost a field, and the'
  + ' floor\'s copy (traditions/functionEye.js :: FUNCTION_EYE_KEYS) must follow it, or the traditions draw can lean on a'
  + ' field the DM has hidden';

describe('the floor\'s function eye is the veil\'s (RULING 122-B-3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);
  it('(i) the leaf\'s names equal the veil\'s function-eye fields, as a set, both directions', () => {
    const veil = [...CARD_KINDS.institution.fields.function].sort();
    expect([...FUNCTION_EYE_KEYS].sort(), DRIFT).toEqual(veil);
  });
  it('(ii) on 200 houses of born towns and a house planted with every function field, the two functions agree', () => {
    /** @type {unknown[]} */ const houses = [];
    for (let i = 0; houses.length < 200 && i < 60; i++) {
      const town = generateSettlementPipeline(birthConfig({ settType: 'village' }), null, { seed: `dp-village-${i}`, customContent: {} });
      houses.push(...(town.institutions || []));
    }
    expect(houses.length).toBeGreaterThanOrEqual(200);
    const planted = { name: 'Planted House', category: 'Economy', ...Object.fromEntries(CARD_KINDS.institution.fields.function.map((k) => [k, [`${k}-value`]])) };
    const all = [...houses.slice(0, 200), planted];
    expect(JSON.stringify(all.map(floorWithoutFunction)), DRIFT).toBe(JSON.stringify(all.map(readerWithoutFunction)));
  }, 300000);
});
