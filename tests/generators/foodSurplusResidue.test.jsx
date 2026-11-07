/** @vitest-environment jsdom */
/**
 * tests/generators/foodSurplusResidue.test.jsx — FOOD-EXPORTS, the residue the battery still
 * counted after the export cure (the chair's rulings on unit A, 2026-11-04):
 *
 * 1. "Requires grain surplus." (the Maltster's description) is a REQUIREMENT, not a claim that
 *    the place holds one: foodWordsFindings licenses a "Requires X" clause exactly as R7
 *    licenses a "Needs X" row.
 * 2. The Foundations row "Food · Surplus" (SubstrateTab, the causal state's shared band ladder)
 *    is a bare claim on a food-short place: the tab reads the food record
 *    (domain/foodSurplus.js :: offersFoodSurplus) and grades Food no higher than Adequate unless
 *    the record holds a surplus.
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';

afterEach(cleanup);

const short = { economicState: { foodSecurity: { foodRecord: { band: 'secure', storageMonths: 1, growsMoreThanEats: false, foodSources: ['grain'] } } } };
const surplusCodes = (s, text) => foodWordsFindings(s, text).filter((f) => f.code === 'surplus_without_surplus').map((f) => f.sentence);
const textLines = (root) => {
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const lines = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) lines.push(n.nodeValue.trim());
  return lines.join('\n');
};

describe('the food-surplus residue', () => {
  it('a "Requires grain surplus" clause is a requirement, not a claim', () => {
    expect(surplusCodes(short, 'Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus.')).toEqual([]);
    expect(surplusCodes(short, '- **Maltster**: Converts barley into malt. Requires grain surplus.')).toEqual([]);
    // Anchored: a claim to HOLD a surplus is still caught, on its own or after a requirement.
    expect(surplusCodes(short, 'The valley runs a grain surplus.')).toEqual(['The valley runs a grain surplus.']);
    expect(surplusCodes(short, 'Requires grain surplus; the valley sells its grain surplus')).toHaveLength(1);
  });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (band secure, grows less than it eats): was soak1k-65.
  it('soak1k-5 (band secure, grows less than it eats): the Foundations Food row is not graded Surplus', async () => {
    await ensureLaws();
    const { settlement: s } = birth(5);
    expect(s.economicState.foodSecurity.foodRecord.growsMoreThanEats).toBe(false);
    const { container } = render(<SubstrateTab settlement={s} />);
    const text = textLines(container);
    expect(text).toMatch(/^Food$/m); // the row is on the tab
    expect(text).not.toMatch(/^Food\nSurplus$/m); // anchored: the line above pins the Food row on the tab, and the next pins its Adequate grade
    expect(text).toMatch(/^Food\nAdequate$/m);
  });
});
