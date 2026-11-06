/**
 * tests/lint/holderCitesBySymbol.test.js — REVIEW-INTAKE-3 unit R8: a holder citation that
 * DRIFTED is re-addressed to a SYMBOL, permanently (OPERATING_STANDARD rule 32).
 *
 * Unit 3 of this lane moved two writes inside `viability.js :: generateEconomicViability`
 * two lines up, and the holder table's `viable` and `criticalIssueCount` rows went stale
 * (`proseWiringCensus.walker` "EVERY MAPPING ROW IS CITED TO A PRODUCER THE TREE STILL
 * CARRIES" red on both). Re-pointing them at the new line numbers would only wait for the next
 * drift, so they cite the declaration that owns the write, and the producer index learns to
 * resolve that form from the SAME syntax-tree pass that resolves `file:line`: a write is
 * citable as `path :: <top-level declaration it sits in>` as well as `path:line`.
 *
 * Planted refusals ride beside it so the symbol form can be caught lying exactly as the line
 * form can: a real declaration that does not write the token, and a declaration that does not
 * exist, both resolve to nothing.
 */
import { describe, expect, test } from 'vitest';
import { astTokens, producerCitations } from '../../scripts/wiring-census.mjs';
import { HOLDER_SOURCES } from '../../src/domain/prose/holderTable.js';

const VIABILITY = 'src/generators/economy/viability.js';

describe('a holder citation that drifted cites its SYMBOL (rule 32)', () => {
  test('the two drifted rows cite the declaration that owns their write', () => {
    expect(HOLDER_SOURCES.viable.cite).toBe(`${VIABILITY} :: generateEconomicViability`);
    expect(HOLDER_SOURCES.criticalIssueCount.cite).toBe(`${VIABILITY} :: generateEconomicViability`);
  });

  test('the producer index resolves `path :: symbol` from the same tree pass, and refuses a false one', () => {
    const { cites } = producerCitations();
    expect(cites.get('viable') || []).toContain(`${VIABILITY} :: generateEconomicViability`);
    expect(cites.get('criticalIssueCount') || []).toContain(`${VIABILITY} :: generateEconomicViability`);
    // the line form is still there, unmoved, beside the symbol form
    expect((cites.get('viable') || []).some((c) => /^src\/generators\/economy\/viability\.js:\d+$/.test(c))).toBe(true);
    // ⛔ THE PLANTS: a real declaration of that file that does not write the token, and one
    // that does not exist.
    expect(cites.get('viable') || []).not.toContain(`${VIABILITY} :: isCityScale`);
    expect(cites.get('viable') || []).not.toContain(`${VIABILITY} :: noSuchDeclaration`);
  });

  test('astTokens names the top-level declaration each write sits in', () => {
    const { writes } = astTokens([
      'export const A = { one: 1 }, B = { two: 2 };',
      'export function f() { return { three: 3 }; }',
      'const g = () => { x.four = 4; };',
      'export default { five: 5 };',
    ].join('\n'));
    expect(writes.map((w) => `${w.name}@${w.symbol}`)).toEqual([
      'one@A', 'two@B', 'three@f', 'four@g', 'five@',
    ]);
  });
});
