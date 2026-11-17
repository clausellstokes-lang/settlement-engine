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

// THE READING REFINED BY ITS OWN RULE (DEBT-1, 2026-11-17). The rule bars a singular pronoun that refers back to THE SLOT.
// SEAM-CULTURE (1d72767c88) wrote "it" for "the town" in v1 and v5, and there the pronoun is {settlement}'s: it is the
// subject of "built", and a calamity builds nothing. Each such pronoun is declared here by its exact phrase; the phrase
// must stand in the line (so the row cannot go stale), and every other "it" or "its" of the line is still read.
const SETTLEMENT_IT = /** @type {Record<string, string>} */ ({
  'LEGACY-RECOVERED v1': 'what it built',
  'LEGACY-RECOVERED v5': 'what it had built',
});

describe('DS-GEN-16: {calamity} is never the subject of a verb it may not agree with', () => {
  it('the control: the slot holds a plural value, and the block names the slot', () => {
    const fills = Object.values(EVENT_TYPE_NAMES).map((name) => calamityFill(name)).filter(Boolean);
    expect(fills).toContain('plague years');
    expect(fills).toContain('heresy trials');
    expect(lines.length).toBeGreaterThan(10);
  });
  for (const { id, text } of lines) {
    it(`${id}: no number-marked verb after the slot, no singular pronoun back to it`, () => {
      expect(text, `${id} names the slot`).toContain('{calamity}');
      // anchored: the line above shows the slot prints in this text
      expect(text, `${id} makes {calamity} the subject of a singular verb`).not.toMatch(/\{calamity\}(?:,\s*which)?\s+(?:is|was|has|does|[a-z]{2,}s)\b/);
      const own = SETTLEMENT_IT[id];
      if (own) expect(text, `${id}: the declared settlement's pronoun stands in the line`).toContain(own);
      // anchored: the slot's presence in this text is asserted above; only a declared settlement's phrase is set aside
      expect(own ? text.split(own).join(' ') : text, `${id} refers back to {calamity} as "it"`).not.toMatch(/\b(?:it|its|It|Its)\b/);
    });
  }
});
