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
    expect(rows.filter((r) => typeof r === 'object').length).toBe(99);
  });
});
