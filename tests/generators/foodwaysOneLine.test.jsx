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
import { recordBatteryFindings } from '../../src/generators/recordBatteryFindings.js';
import { foodwaysLineOf, sourcesNamedIn } from '../../src/domain/foodways.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

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
// The journal escapes an apostrophe as an HTML entity, which Foundry renders as the apostrophe (COHERENCE-AGREE:
// a livestock line, "the herds' milk", first reached this corpus when grazing became a source by its own name).
const unmark = (md) => String(md).replace(/\\(.)/g, '$1').replace(/\*\*/g, '').replace(/&#39;/g, "'");
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

/**
 * URBAN-FIX C-1: THE FOODWAYS LINE HAS ONE HOME ON THE STORED RECORD (the chair's urban ruling C,
 * 2026-11-09; URBAN-AUDIT §3). From town up no settlement in the 1,000 holds grain or livestock as a
 * source of its own, so the culture's raw sentence (cultureProfiles.js :: materializeCulturalIdentity)
 * named a staple the place lacks and the receipt's food-words check flagged the STORED line no page
 * prints. Where the food record exists, `culturalIdentity.foodways` now stores the record's line
 * (assembleSettlement.js); the receipt (recordBatteryFindings.js :: recordTextSurfaces) skips the
 * superseded line BY PATH, so a record stored before the cure reads the same.
 */
describe('C-1 — the stored foodways line is the food record\'s line', () => {
  /** Golden rows whose receipt carried `battery.food-words` at the base (fe55408b9), town and up. */
  const ROWS = [
    'town|germanic|hills|road|civilized|golden-master-v3',
    // COHERENCE-AGREE (the chair's food-sources ruling, 2026-11-11): the plains city's grazing is a livestock
    // source now; the planted condition (no staple held) is carried by the coastal port city, which holds fish.
    'city|germanic|coastal|port|civilized|golden-master-v3',
    'metropolis|germanic|plains|road|civilized|golden-master-v3',
  ];
  const birthOf = (key) => {
    const { _seed, ...cfg } = goldenCorpus().find((c) => keyOf(c) === key);
    return generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  };
  const foodWords = (s) => recordBatteryFindings(s).filter((f) => f.path === 'battery.food-words');

  it('three golden rows: the stored line is the printed line, and the receipt finds no food word', () => {
    const failures = collectSeedFailures(ROWS, (key) => {
      const s = birthOf(key);
      const printed = foodwaysLineOf(s);
      expect(printed, `${key}: the food record carries its composed line`).toBeTruthy();
      expect(s.culturalIdentity.foodways, `${key}: one sentence, stored = printed`).toBe(printed);
      expect(foodWords(s), `${key}: no food-words finding on the stored record`).toEqual([]);
    });
    expectNoSeedFailures(failures, 'every row stores the record\'s line');
  });

  it('the planted condition holds: the place holds no staple, and the record\'s line claims none', () => {
    const s = birthOf(ROWS[1]);
    const held = new Set(s.economicState.foodSecurity.foodRecord.foodSources);
    expect(held.has('grain') || held.has('livestock')).toBe(false);
    expect(sourcesNamedIn(foodwaysLineOf(s)).every((src) => held.has(src))).toBe(true);
  });

  // anchored: invented wording (a culture-pool sentence quoted here would be a literal anchor)
  const RAW = 'Rye breads and smoked herd meat fill ordinary meals.';
  const planted = (extra = {}) => ({
    tier: 'city',
    economicState: { foodSecurity: { foodRecord: { foodSources: ['fish'], foodwaysLine: 'Most meals start from the day\'s catch.' } } },
    culturalIdentity: { foodways: RAW },
    ...extra,
  });
  it('the fallback, by PATH: a record stored before the cure does not read its superseded culture line', () => {
    expect(foodWords(planted())).toEqual([]);
  });
  it('control: the same sentence under another path\'s `foodways` key is still read', () => {
    expect(foodWords(planted({ customNotes: { foodways: RAW } })).length).toBeGreaterThan(0);
  });
  it('control: with no food record line, the culture line is the only line and is read', () => {
    const s = planted();
    s.economicState.foodSecurity.foodRecord.foodwaysLine = '';
    expect(foodWords(s).length).toBeGreaterThan(0);
  });
});
