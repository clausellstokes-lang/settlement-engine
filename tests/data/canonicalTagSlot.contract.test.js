/**
 * tests/data/canonicalTagSlot.contract.test.js — CENSUS-1f unit 5c (the chair's item 3 of
 * 2026-11-05 ~04:50): the projector's canonical-at-zero row (`0. *(canonical)* …`) carries ONE
 * optional tag slot after its marker, every part of which is a mark (the angle is fixed). A row
 * without the slot reads exactly as before (marks [], the whole remainder is the text).
 *
 * The projector runs at import, so its row grammar is read from its source (the one regex and
 * the slot split, nothing else).
 *
 * @enforced-by npx vitest run tests/data/canonicalTagSlot.contract.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const SRC = readFileSync(new URL('../../scripts/lib/dossier-annex-parse.mjs', import.meta.url), 'utf8'); // CENSUS-1g unit 5: the parse moved verbatim
const CANONICAL_RE = new Function(`${/^export const CANONICAL_RE = .*;$/m.exec(SRC)[0].replace(/^export /, '')} return CANONICAL_RE;`)();
const row = (line) => {
  const m = line.match(CANONICAL_RE);
  return m && { marks: m[2] ? m[2].split('·').map((p) => p.trim()).filter(Boolean) : [], text: m[3] };
};

describe('the canonical row tag slot (CENSUS-1f unit 5c)', () => {
  it('a slot\'s parts are marks; the text follows it', () => {
    expect(row('0. *(canonical)* `[market · no crisis: hunger]` Prices hold at the stalls.')).toEqual({ marks: ['market', 'no crisis: hunger'], text: 'Prices hold at the stalls.' });
  });
  it('a row with no slot is unchanged', () => {
    expect(row('0. *(frozen, canonical)* The granaries are full.')).toEqual({ marks: [], text: 'The granaries are full.' });
  });
  it('the projector folds the slot into the v0 variant\'s marks', () => {
    expect(SRC).toMatch(/index: 0, angle: 'canonical', marks: slot,/);
  });
});
