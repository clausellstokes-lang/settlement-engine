// THE CORPUS LANE'S AGREEMENT GUARD (W2-WRITE-SIDE-13, the reader's M1 at 70e5e7468: "The plague years is a
// generation old", 61 towns). The chair's ruling of 2026-11-14: A SLOT IS NOT MADE THE SUBJECT OF A VERB IT
// DOES NOT AGREE WITH.
//
// DS-GEN-16's `{calamity}` fills from the event row's own name (`calamityFill`, the article stripped), and the
// names it can hold are both singular ("the flood") and plural ("the plague years", "the heresy trials"). So no
// line of the block may make the slot the subject of a number-marked verb ("The {calamity} is", "the {calamity},
// which is", "the {calamity} comes up"), and no line that names the slot may refer back to it by a singular pronoun ("it", "its"): either
// reads false for one of the values the slot is filled with. The control proves the plural case is live, so the
// guard can never pass because the slot stopped holding a plural.
import { describe, expect, it } from 'vitest';
import { EVENT_TYPE_NAMES } from '../../src/data/historyData.js';
import { calamityFill } from '../../src/domain/display/stateProse/generalStateProse.js';
import * as general from '../../src/data/dossierStateProse/general.generated.js';

const leaf = /** @type {Record<string, any>} */ (Object.values(general).find((v) => v && typeof v === 'object'));
const block = leaf['DS-GEN-16'];
const lines = Object.entries(block.pools).flatMap(([key, pool]) => /** @type {any[]} */ (pool)
  .filter((v) => /\{calamity\}/.test(v.text)).map((v) => ({ id: `${key} v${v.vid}`, text: /** @type {string} */ (v.text) })));

describe('DS-GEN-16: {calamity} is never the subject of a verb it may not agree with', () => {
  it('the control: the slot holds a plural value, and the block names the slot', () => {
    const fills = Object.values(EVENT_TYPE_NAMES).map((name) => calamityFill(name)).filter(Boolean);
    expect(fills).toContain('plague years');
    expect(fills).toContain('heresy trials');
    expect(lines.length).toBeGreaterThan(10);
  });
  for (const { id, text } of lines) {
    it(`${id}: no number-marked verb after the slot, no singular pronoun back to it`, () => {
      expect(text, `${id} makes {calamity} the subject of a singular verb`).not.toMatch(/\{calamity\}(?:,\s*which)?\s+(?:is|was|has|does|[a-z]{2,}s)\b/);
      expect(text, `${id} refers back to {calamity} as "it"`).not.toMatch(/\b(?:it|its|It|Its)\b/);
    });
  }
});
