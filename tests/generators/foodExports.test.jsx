/** @vitest-environment jsdom */
/**
 * tests/generators/foodExports.test.jsx — FOOD-EXPORTS (docs/SOAK_1000_2026-11-03.md §2 row 5,
 * §4b R4): a place short of food never sells a food surplus.
 *
 * The export writers (computeActiveChains.js :: deriveExportsFromChains, and the chain outputs
 * economicState.js hands every surface) read the food record
 * (foodBalance.js :: offersFoodSurplus — `growsMoreThanEats`, and not a famine) before they offer
 * "Grain surplus", "Agricultural surplus", "Food surplus", "Date surplus" or "Bulk food exports".
 * Red before the cure: the Economics tab of soak1k-376 printed "Baked goods Grain surplus
 * Agricultural surplus" for a city that grows 38% of what it eats.
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

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { deriveExportsFromChains } from '../../src/generators/computeActiveChains.js';
import { isFoodSurplusGood, offersFoodSurplus } from '../../src/generators/economy/foodBalance.js';

afterEach(cleanup);

const surplusFindings = (s, text) => foodWordsFindings(s, text).filter((f) => f.code === 'surplus_without_surplus');
/** The rendered text, one line per text node (textContent glues "Baked goods" to "Grain surplus"). */
const textLines = (root) => {
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const lines = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) lines.push(n.nodeValue.trim());
  return lines.join('\n');
};

describe('a place short of food sells no food surplus', () => {
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (a city short of food with its grain chain on the tab): was soak1k-376.
  it('soak1k-28 (a city short of food): the Economics tab says no surplus', async () => {
    await ensureLaws();
    const { settlement: s } = birth(28);
    const record = s.economicState.foodSecurity.foodRecord;
    expect(record.growsMoreThanEats).toBe(false);
    const { container } = render(<EconomicsTab settlement={s} economicState={s.economicState} narrativeNote={null} />);
    const text = textLines(container);
    expect(text).toMatch(/Baked goods/); // the grain chain is on the tab
    expect(surplusFindings(s, text)).toEqual([]);
  });

  it('over 60 corpus settlements: no export row and no chain output names a food surplus the record does not hold', async () => {
    await ensureLaws();
    const wrong = [];
    let short = 0; let shortWithExports = 0; let heldSurplus = 0;
    for (let i = 0; i < 60; i += 1) {
      const { settlement: s, seed } = birth(i * 16 + 7);
      const econ = s.economicState;
      const record = econ.foodSecurity.foodRecord;
      const goods = [...(econ.primaryExports || []), ...(econ.activeChains || []).flatMap((c) => c.outputs || [])];
      if (offersFoodSurplus(record)) { if (goods.some(isFoodSurplusGood)) heldSurplus += 1; continue; }
      short += 1;
      if ((econ.primaryExports || []).length) shortWithExports += 1;
      for (const g of goods.filter(isFoodSurplusGood)) wrong.push(`${seed}: ${g}`);
    }
    expect(wrong).toEqual([]);
    // Not vacuous: the corpus holds food-short places that still export, and fed places that sell their surplus.
    expect(short).toBeGreaterThan(10);
    expect(shortWithExports).toBeGreaterThan(5);
    expect(heldSurplus).toBeGreaterThan(0);
  });

  it('the writer reads the record: grain fields offer a surplus only to a place that grows more than it eats', () => {
    const offer = (record) => deriveExportsFromChains([], ['grain_fields'], 'village', 'road', [], {}, [], [{ name: 'Mill' }], null, record);
    expect(offer({ growsMoreThanEats: true, band: 'surplus' })).toEqual(['Grain surplus', 'Milled flour', 'Bulk food exports']);
    expect(offer({ growsMoreThanEats: false, band: 'deficit' }).filter(isFoodSurplusGood)).toEqual([]);
    expect(offer({ growsMoreThanEats: true, band: 'famine' }).filter(isFoodSurplusGood)).toEqual([]);
    expect(offer({ growsMoreThanEats: false, band: 'deficit' })).toEqual(['Milled flour']); // the land's crafted goods stay
    expect(offer(null)).toEqual(offer({ growsMoreThanEats: true, band: 'surplus' })); // no record: legacy behaviour
    expect(isFoodSurplusGood('Grain surplus (taxed by occupation)')).toBe(true);
    expect(isFoodSurplusGood('Milled flour')).toBe(false);
  });
});
