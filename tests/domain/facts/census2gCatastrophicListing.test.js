/**
 * CENSUS-2g unit 4 — R-AS amended (the chair's answer 1, block j): POLITICAL_FLAVOR catastrophic[1]
 * is LISTED "presumes walls + militia, unverified; printed in 0 of 1,000; waiting on a per-branch
 * closure channel" — no split (the pool keeps its eight rows), no declaration on the row (its other
 * branch is colour), the never-printed branch kept (R-AK).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { POLITICAL_FLAVOR } from '../../../src/generators/narrativeText.js';

const ledger = JSON.parse(readFileSync(new URL('../../../docs/census/declarations/POLITICAL_FLAVOR.json', import.meta.url), 'utf8'));
/** @param {any} o @param {string} id @returns {any} */
const find = (o, id) => {
  if (Array.isArray(o)) { for (const x of o) { const f = find(x, id); if (f) return f; } return null; }
  if (o && typeof o === 'object') {
    if (o.lineId === id) return o;
    for (const v of Object.values(o)) { const f = find(v, id); if (f) return f; }
  }
  return null;
};

describe('POLITICAL_FLAVOR catastrophic[1] — listed, not split (R-AS amended)', () => {
  it('the ledger lists the monster branch as an unverified presumption waiting on a closure channel', () => {
    const line = find(ledger, 'POLITICAL_FLAVOR.catastrophic[1].monster_incursion');
    expect(line.needs).toEqual(['walls', 'militia']);
    expect(line.listing).toMatch(/^presumes walls \+ militia, unverified; printed in 0 of 1,000;/);
    expect(line.listing).toMatch(/per-branch closure declaration channel/);
  });
  it('the pool keeps its rows and the row stays a bare closure carrying both branches (no split)', () => {
    const row = POLITICAL_FLAVOR.catastrophic[1];
    expect(typeof row).toBe('function');
    const event = (type) => [{ severity: 'catastrophic', type, name: 'Long Night' }];
    expect(/** @type {any} */ (row)(event('monster_incursion'))).toMatch(/has walls where others do not/);
    // Re-keyed at W5 HIS's style pass (2026-11-07): the non-monster branch, plainly worded.
    expect(/** @type {any} */ (row)(event('disaster'))).toMatch(/people here date everything from it/);
  });
});
