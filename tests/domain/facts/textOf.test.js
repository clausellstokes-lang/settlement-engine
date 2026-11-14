/**
 * tests/domain/facts/textOf.test.js — the table-consumer tolerance (R-C): a bare line comes back
 * as it is; a declared row gives back its `text` unchanged, so a consumer reading through it is
 * byte-identical whether or not its table carries declarations yet.
 *
 * @enforced-by npx vitest run tests/domain/facts/textOf.test.js
 */
import { describe, expect, it } from 'vitest';
import { textOf } from '../../../src/domain/facts/textOf.js';
import { ARRIVAL_PEOPLE, ARRIVAL_SENSES } from '../../../src/data/arrivalProse.js';
import { ARRIVAL_SCENES } from '../../../src/data/narrativeData.js';

describe('textOf', () => {
  it('a bare string or template comes back unchanged; a declared row gives back its text', () => {
    const f = (n) => `${n} wakes.`;
    expect(textOf('A line.')).toBe('A line.');
    expect(textOf(f)).toBe(f);
    expect(textOf({ text: f, excludes: ['crisis: threat'] })).toBe(f);
    expect(textOf({ text: 'A line.', needs: ['market'] })).toBe('A line.');
    expect(textOf(null)).toBe(null);
  });

  it('the arrival tables carry their declarations (CENSUS-2b item 3), each read back to a template', () => {
    const pilgrims = ARRIVAL_SENSES.find((s) => s.key === 'faith').dominant[2];
    expect(pilgrims).toEqual(expect.objectContaining({ excludes: ['crisis: threat', 'crisis: unrest'] }));
    expect(textOf(pilgrims)('X')).toBe('Pilgrims in travel-stained cloaks queue patiently for their turn at the holy places.');
    const rows = [...ARRIVAL_SENSES.flatMap((s) => [...s.lines, ...s.dominant]), ...Object.values(ARRIVAL_PEOPLE).flat(), ...Object.values(ARRIVAL_SCENES).flat()];
    expect(rows.every((r) => typeof textOf(r) === 'function' || typeof textOf(r) === 'string')).toBe(true);
    // 86 → 92 by cause: CENSUS-2f unit 2 (R-AP) declared the fish key's three bare lines and the faith key's bell, incense and hymn;
    // 92 → 99: CENSUS-2f unit 7 — fish.dominant[1] declares `fish` (R-AP amended) and six read bare lines are marked colour (R-AO)
    // 99 → 105: R2-CODE-A item 4 — the port scene's four harbour rows declare `docks` and two shore rows (`coast`) join them
    // W2-FIX-DATA, on its own lane from the same 99: 99 → 101 (the REVIEW-W2B cold list) — the smiths' ironwork carts (siege)
    // and the arabic water for travellers (siege) declare; 101 → 105 (W2-FIX-DATA-3, REVIEW-W2A-3 #366, #2) — the smiths'
    // three bare dominant lines declare `tier: ≥ town` (fb48fb8bc) and the mesoamerican craftspeople row declares `market`
    // (c0f8dd279); 105 → 109 (W2-FIX-DATA-HISTORY item F, 9d952d02b) — the east-asian lanes of trades (tier: ≥ town), the tea
    // for a merchant and the oath on the scales (market), and the timber planks waiting for carts (no crisis: under_siege).
    // → 115 at THE JOIN (JOIN-2, 2026-11-14, lane/join-2026-11-14): MEASURED by this assertion's own count at the joined tree,
    // re-keyed by identity: R2-CODE-A's six rows and W2-FIX-DATA's ten (six and the history's four) are disjoint rows.
    expect(rows.filter((r) => typeof r === 'object').length).toBe(115);
  });
});
