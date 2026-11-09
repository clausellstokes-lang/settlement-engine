/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(c); DS-GEN-11's by-design read arm, SW-B2's leftover by
 * the chair's ruling of 02:5x): the Viability coherence line read the battery's verdict and not the
 * by-design items, so Shangjin (soak1k-9) printed "Look as closely as you like at Shangjin: nothing
 * about it fails to add up." above its own "By-Design Contradictions (1)". By-design items are not
 * battery findings, so the battery passes over them. The cure: ONE reader of the by-design list
 * (`validationOnPage.js :: byDesignItemsOf`, the list the tab prints), read by the desk's battery
 * reading too (`generalDeskRead.js :: recordCleanOf`); the vouching pool leaves wherever that list is
 * non-empty.
 */
import { describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { byDesignItemsOf } from '../../src/domain/display/validationOnPage.js';

const VOUCHES = /holds up; its story is clean|nothing about it fails to add up/;

describe('SW-B1 · DS-GEN-11: the coherence line never vouches above a by-design contradiction', () => {
  it('the vouching line prints over a clean record and leaves once a by-design row is on it', async () => {
    await ensureLaws();
    const s = birth(9).settlement;
    const lines = (/** @type {any} */ rec) => generalDeskLines(rec, { tier: rec.tier }).viability.verdictLines
      .map((/** @type {any} */ l) => (typeof l === 'string' ? l : l?.sentence ?? l?.text ?? JSON.stringify(l))).join(' ');
    const clean = {
      ...s,
      structuralViolations: (s.structuralViolations || []).filter((/** @type {any} */ i) => i?.severity !== 'by_design'),
      economicViability: { ...s.economicViability, issues: (s.economicViability.issues || []).filter((/** @type {any} */ i) => i?.severity !== 'by_design') },
    };
    expect(byDesignItemsOf(clean.economicViability, clean)).toHaveLength(0);
    expect(lines(clean), 'the positive control: a clean, passing record is vouched for').toMatch(VOUCHES);
  }, 60_000);

  it('soak1k-9 (Shangjin): one by-design item on the tab, no vouching line above it', async () => {
    await ensureLaws();
    const s = birth(9).settlement;
    expect(byDesignItemsOf(s.economicViability, s).length).toBeGreaterThan(0);
    const lines = generalDeskLines(s, { tier: s.tier }).viability.verdictLines.map((/** @type {any} */ l) => (typeof l === 'string' ? l : l?.sentence ?? l?.text ?? JSON.stringify(l))).join(' ');
    expect(lines).not.toMatch(VOUCHES);
  }, 60_000);
});
