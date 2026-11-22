/**
 * Coherence-warning tests — wrap-policy invariants for draft mode.
 */

import { describe, test, expect } from 'vitest';
import { checkDraftEdit } from '../../src/domain/coherence/checkDraftEdit.js';

describe('checkDraftEdit', () => {
  test('empty settlement does not throw and returns an array', () => {
    // Empty doesn't necessarily mean "no warnings" — the validator runs
    // against tier defaults (e.g. defaults to 'town' + 'frontier'), and
    // a town with no fortification on a frontier is a survival crisis.
    // The contract we care about here is "doesn't throw, returns an
    // array of well-formed warnings."
    const empty = checkDraftEdit({});
    expect(Array.isArray(empty)).toBe(true);
    expect(checkDraftEdit(null)).toEqual([]);
  });

  test('returns an array even when validator throws', () => {
    // Pass a settlement with malformed institutions to provoke the validator
    const out = checkDraftEdit({ institutions: 'not an array', config: {} });
    expect(Array.isArray(out)).toBe(true);
  });

  test('warnings have severity + message at minimum', () => {
    // Any non-trivial settlement may produce warnings; if it does, they
    // should obey the contract.
    const out = checkDraftEdit({
      tier: 'thorp',
      institutions: [{ name: 'Wizard Tower' }],   // tier-violation candidate
      config: { tier: 'thorp', tradeRouteAccess: 'none' },
    });
    for (const w of out) {
      expect(['warning', 'mismatch', 'suggestion']).toContain(w.severity);
      expect(typeof w.message).toBe('string');
      expect(w.message.length).toBeGreaterThan(0);
    }
  });
});
