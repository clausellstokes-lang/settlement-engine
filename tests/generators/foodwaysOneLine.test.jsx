/** @vitest-environment jsdom */
/**
 * tests/generators/foodwaysOneLine.test.jsx — FOOD-4: THE FOODWAYS LINE HAS ONE WRITER.
 *
 * The line is composed once, at generation, from the place's own food sources
 * (foodGenerator.js :: generateFoodSecurity → composeFoodwaysLine) and carried on the food
 * record (economicState.foodSecurity.foodRecord.foodwaysLine). Every surface that speaks of
 * foodways reads it through ONE reader (domain/foodways.js :: foodwaysLineOf): the Economy tab,
 * the PDF's Identity & Daily Life chapter and the Foundry journal's Identity & Daily Life page.
 * The Overview quotes no foodways line, so it has nothing to read. No surface composes its own.
 * Red before the cure: the Economy tab and the journal printed no foodways line at all.
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
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

afterEach(cleanup);

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SEEDS = TIERS.flatMap((tier) => [0, 1].map((i) => ({ tier, seed: `foodways-one-line-${tier}-${i}` })));

/** @react-pdf text leaves, calling each function component (generationContractsViewModel.test.jsx). */
function pdfText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { node.forEach((child) => pdfText(child, out)); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return pdfText(node.type(node.props), out);
    return pdfText(node.props?.children, out);
  }
  return out;
}
/** Journal markdown back to plain words: the shared escaper's backslashes and the bold marks. */
const unmark = (md) => String(md).replace(/\\(.)/g, '$1').replace(/\*\*/g, '');
const count = (text, line) => text.split(line).length - 1;

describe('the foodways line: one writer on the record, the same line on every surface', () => {
  it('12 seeds, two per tier: the Economy tab, the PDF chapter and the journal print the record\'s line once each', () => {
    const wrong = [];
    const lines = new Set();
    // Collected, so every seed runs and the failure count is the true count (seedLoopTotality).
    const failures = collectSeedFailures(SEEDS, ({ tier, seed }) => {
      const s = generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} });
      const line = s.economicState.foodSecurity.foodRecord.foodwaysLine;
      expect(typeof line === 'string' && line.length > 10, `${seed}: the record carries a line`).toBe(true);
      lines.add(line);

      const { container, unmount } = render(<EconomicsTab settlement={s} economicState={s.economicState} narrativeNote={null} />);
      const economy = container.textContent;
      unmount();
      const vm = buildViewModel({ settlement: s });
      const pdf = pdfText(IdentityDailyLife({ settlement: s, narrativeMode: false, vm })).join(' | ');
      const journalPage = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true, settlement: s })
        .find((p) => p.name === 'Identity & Daily Life');
      const journal = unmark(journalPage?.markdown ?? '');

      for (const [surface, text] of Object.entries({ economy, pdf, journal })) {
        if (count(text, line) !== 1) wrong.push(`${seed} / ${surface}: the line printed ${count(text, line)} times`);
      }
      // No surface prints the culture's own authored line beside or instead of the record's.
      const cultureLine = s.culturalIdentity?.foodways;
      if (cultureLine && cultureLine !== line && !line.includes(cultureLine)) {
        for (const [surface, text] of Object.entries({ economy, pdf, journal })) {
          if (text.includes(cultureLine)) wrong.push(`${seed} / ${surface}: printed the culture's line`);
        }
      }
    });
    expectNoSeedFailures(failures, 'every seed\'s record carries its foodways line');
    expect(wrong).toEqual([]);
    // Measured 6 distinct lines over these 12 seeds (default configs share culture and terrain).
    expect(lines.size, 'the line is the place\'s own, not one sentence for all').toBeGreaterThanOrEqual(5);
  });
});
