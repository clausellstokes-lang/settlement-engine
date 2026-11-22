/** @vitest-environment jsdom */
/**
 * tests/components/economicsFoodStores.test.jsx — the stored food has ONE home: the Economics tab
 * (FOOD-1, chair addendum 2, the owner 2026-11-03: "Do add storehouse months the economy tab.").
 *
 * The figure is the food record's `storageMonths` (economicState.foodSecurity.foodRecord), said
 * in plain words with the granary yes/no, printed once, and on no other tab.
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { foodStoresWords } from '../../src/domain/summary/tonightSheet.js';
import { readFileSync } from 'node:fs';

/** A stored-food figure: a span of time in store. */
const STORES_FIGURE = /\b(?:\w+ months?|a month|a few weeks|weeks)\b[^.]{0,30}\b(?:of grain|in store|in the larder|household stores)\b/gi;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const seeds = (n) => TIERS.flatMap((tier) => Array.from({ length: n }, (_, i) => ({ tier, seed: `food-stores-${tier}-${i}` })));
const gen = ({ tier, seed }) => generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });

afterEach(cleanup);

describe('the stored food is printed once, on the Economics tab', () => {
  // The two 60-seed loops carry their own budget (the house form: economicsImpactOnce, tabSentencesOnce).
  // 60 births + 60 renders measured ~14 s plain and over the 20 s default under CI's coverage
  // instrumentation on a saturated runner (run 41852088236, 2026-11-04); the budget is the work's, not a retry.
  it('the Economics tab prints the record\'s months exactly once, in words that follow the record, over 60 seeds', () => {
    const wrong = [];
    for (const row of seeds(10)) {
      const s = gen(row);
      const record = s.economicState.foodSecurity.foodRecord;
      const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} />);
      const text = container.textContent;
      const hits = text.match(STORES_FIGURE) || [];
      const row1 = container.querySelector('[data-testid="economics-food-stores"]');
      if (hits.length !== 1 || !row1) wrong.push(`${row.seed}: ${hits.length} figures`);
      else if (/granary/i.test(row1.textContent) && /^No granary/.test(row1.textContent) === record.hasGranary) wrong.push(`${row.seed}: granary words disagree`);
      unmount();
    }
    expect(wrong).toEqual([]);
  }, 120000);

  it('the stores sentence has one writer: the Economics row prints the Tonight sheet\'s own words, over 60 seeds', () => {
    const src = readFileSync('src/components/new/tabs/EconomicsTab.jsx', 'utf8');
    expect(src).toMatch(/import \{[^}]*\bfoodStoresWords\b[^}]*\} from '\.\.\/\.\.\/\.\.\/domain\/summary\/tonightSheet\.js'/);
    // anchored: the import above is the one writer; a second spelling of the sentence is what left.
    expect(src).not.toMatch(/function foodStoresLine\(/);
    const wrong = [];
    for (const row of seeds(10)) {
      const s = gen(row);
      const { container, unmount } = render(<EconomicsTab settlement={s} narrativeNote={null} />);
      const printed = container.querySelector('[data-testid="economics-food-stores"]')?.textContent || '';
      if (printed !== foodStoresWords(s.economicState.foodSecurity.foodRecord)) wrong.push(`${row.seed}: ${printed}`);
      unmount();
    }
    expect(wrong).toEqual([]);
  }, 120000);

  it('no other tab prints a stored-food figure', () => {
    const found = [];
    for (const row of seeds(1)) {
      const s = gen(row);
      for (const [name, Tab] of [['defense', DefenseTab], ['overview', OverviewTab]]) {
        const { container, unmount } = render(<Tab settlement={s} narrativeNote={null} />);
        const hits = container.textContent.match(STORES_FIGURE) || [];
        if (hits.length) found.push(`${row.seed} ${name}: ${hits[0]}`);
        unmount();
      }
    }
    expect(found).toEqual([]);
  });
});
