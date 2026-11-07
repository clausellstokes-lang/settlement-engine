/**
 * CENSUS-1h unit 7 — THE CHAIR'S R-AQ: the position-keyed declaration channel for a vid-less,
 * modulus-drawn family (the connectives), and the decree family handed the record (R-Z).
 *
 * (a) `resolveDeclaredPosition` is checked AFTER the draw: a list with no declaration, or an
 *     admitted drawn position, comes back unchanged (byte-identity 0); a refused position resolves
 *     to the hash argmax over the admitted positions; none admitted → -1 (the slot drops, R-AU);
 *     a declared position with no facts is refused (fail-closed).
 * (b) The annex grammar projects a joint's `[atoms]` into a list parallel to the phrase list, and
 *     refuses an atom the vocabulary cannot declare.
 * (c) The decree draw reads `options.facts`: a pool whose variants declare is refused without
 *     the fact and admitted with it (the family carries vids, so its marks ARE the channel).
 */
import { describe, expect, it, vi } from 'vitest';
import { resolveDeclaredPosition } from '../../../../src/domain/display/stateProse/stateProseKernel.js';
import { parseConnectives } from '../../../../scripts/lib/dossier-annex-grammar.mjs';
import { DOSSIER_CONNECTIVES, DOSSIER_CONNECTIVE_DECLARATIONS } from '../../../../src/data/dossierConnectives.generated.js';

vi.mock('../../../../src/domain/display/stateProse/decreeProsePools.js', async (importOriginal) => {
  const real = /** @type {any} */ (await importOriginal());
  const declare = (/** @type {any} */ pools) => Object.fromEntries(Object.entries(pools).map(([k, list]) => [
    k, /** @type {any[]} */ (list).map((v) => ({ ...v, marks: [...(v.marks || []), 'market'] })),
  ]));
  return { ...real, DECREE_HAND_POOLS: declare(real.DECREE_HAND_POOLS) };
});

const { decreeLineParts } = await import('../../../../src/domain/display/stateProse/decreeProse.js');

describe('R-AQ (a): resolveDeclaredPosition, checked after the modulus draw', () => {
  it('a list with no declaration returns the drawn position (byte-identity 0)', () => {
    expect(resolveDeclaredPosition(undefined, 2, null, 'k')).toBe(2);
    expect(resolveDeclaredPosition([null, null, null], 1, null, 'k')).toBe(1);
    expect(resolveDeclaredPosition([[], null], 0, null, 'k')).toBe(0);
  });
  it('an admitted drawn position is kept, a refused one resolves to an admitted position', () => {
    const decl = [['market'], null, ['no market']];
    expect(resolveDeclaredPosition(decl, 0, { market: true }, 'k')).toBe(0);
    const resolved = resolveDeclaredPosition(decl, 0, { market: false }, 'k');
    expect([1, 2]).toContain(resolved);
    // the argmax is keyed on the caller's key: the same key resolves the same way every time
    expect(resolveDeclaredPosition(decl, 0, { market: false }, 'k')).toBe(resolved);
  });
  it('nothing admitted answers -1; a declared position with no facts is refused (fail-closed)', () => {
    expect(resolveDeclaredPosition([['market'], ['market']], 1, { market: false }, 'k')).toBe(-1);
    expect(resolveDeclaredPosition([['market'], null], 0, null, 'k')).toBe(1);
  });
});

describe('R-AQ (b): the annex grammar projects position-keyed declarations', () => {
  const annex = (cell) => [
    '## §7b THE STATE CONNECTIVES', '',
    '| relation | seat | floor | pin | joints, in order |', '|---|---|---|---|---|',
    '| `consequence` | `clause` | 3 | 3 | `, so` · `, and so` · `, leaving` |',
    '| `tension` | `sentence` | 3 | 3 | `Against that,` · `Even so,` · `At the same time,` |',
    `| \`contrast\` | \`sentence\` | 3 | 3 | ${cell} |`,
    '| `addition` | `sentence` | 3 | 3 | `EMPTY-OPENER` · `Beside that,` · `Also,` |', '',
  ].join('\n');
  it('a tagged joint declares at its position; the phrase list is unchanged', () => {
    const parsed = parseConnectives(annex('`EMPTY-OPENER` · `Instead,` [market] · `In its place,`'));
    expect(parsed.lists.contrast.sentence).toEqual(['', 'Instead,', 'In its place,']);
    expect(parsed.declarations.contrast.sentence).toEqual([null, ['market'], null]);
    expect(parsed.declarations.addition.sentence).toEqual([null, null, null]);
  });
  it('an atom the vocabulary cannot declare is a projector error', () => {
    expect(() => parseConnectives(annex('`EMPTY-OPENER` · `Instead,` [not-an-atom] · `In its place,`'))).toThrow(/not-an-atom/);
  });
  it('the shipped leaf carries a parallel list for every list, none declaring ({colour}, CENSUS-2e)', () => {
    for (const [relation, bySeat] of Object.entries(DOSSIER_CONNECTIVES)) {
      for (const [seat, list] of Object.entries(/** @type {any} */ (bySeat))) {
        const decl = /** @type {any} */ (DOSSIER_CONNECTIVE_DECLARATIONS)[relation][seat];
        expect(decl).toHaveLength(list.length);
        expect(decl.every((d) => d === null)).toBe(true);
      }
    }
  });
});

describe('R-AQ (c), R-Z: the decree draw is handed the record', () => {
  const entry = { id: 'd1', op: { type: 'add_institution' }, status: 'applied', addedBy: 'dm' };
  it('a declared hand pool is refused without the fact and admitted with it', () => {
    expect(decreeLineParts(entry, { name: 'Ash' }, { seed: 's' })).toHaveLength(0);
    expect(decreeLineParts(entry, { name: 'Ash' }, { seed: 's', facts: { market: false } })).toHaveLength(0);
    expect(decreeLineParts(entry, { name: 'Ash' }, { seed: 's', facts: { market: true } }).length).toBeGreaterThan(0);
  });
});
