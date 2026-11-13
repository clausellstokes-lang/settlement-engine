/**
 * @vitest-environment jsdom
 *
 * prosperityInCrisisSurfaces.test.jsx — the chair's ruling 1(a) on REVIEW-UPKEEP-2 (2026-11-13):
 * "Wherever the shown prosperity label prints and the standing label differs, that same surface says
 * both in the world's words." Every surface that prints the label reads the ONE sentence
 * (`domain/display/prosperityInCrisis.js :: prosperityInCrisisLine`, in the owner's kept form
 * "Comfortable before the famine; Struggling while it lasts.") and prints it beside the label:
 * the Overview tab, the Economics tab, the Summary tab (its tile row and its copied text), the
 * Tonight table view, the PDF's cover, Overview and Economics chapters, the Foundry journal's
 * Overview and Economics pages, and the realm register's line.
 *
 * And it prints NOTHING NEW where it has nothing to say: a calm birth's pages are byte-identical to
 * the same record without the second word (as the deployed client stored it), and a capped birth
 * without the second word prints no sentence.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { prosperityInCrisisLine } from '../../src/domain/display/prosperityInCrisis.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';
import TableView from '../../src/components/TableView.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { gazetteerRows } from '../../src/components/map/heraldRegister.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** A famine birth the famine capped at Struggling (Moderate in ordinary years), and a calm birth. */
const CAPPED = ['cold-famine-town-0', 'town', 'famine'];
const CALM = ['cold-town-1', 'town', null];

/** @param {[string, string, string|null]} row */
const bear = ([key, tier, stress]) => generateSettlementPipeline(stress
  ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false })
  : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed: key, customContent: {} });
/** The record as a save written before the second word existed. @param {any} s */
const withoutStanding = (s) => { const old = JSON.parse(JSON.stringify(s)); delete old.economicState.prosperityStanding; return old; };

/** The PDF's text leaves (the sections are plain hook-free functions; the goldenViewModel idiom). */
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}
/** @param {any} s */
const pdfText = (s) => {
  const vm = buildViewModel({ settlement: s });
  return {
    cover: collectText(Cover({ settlement: s, vm })).join('\n'),
    overview: collectText(Overview({ settlement: s, vm })).join('\n'),
    economics: collectText(EconomicsTrade({ settlement: s, vm })).join('\n'),
  };
};
/** @param {any} s */
const journal = (s) => Object.fromEntries(buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).map((p) => [p.name, p.markdown]));
/** @param {any} s */
const registerLine = (s) => gazetteerRows({ campaign: { settlementIds: ['r1'] }, saves: [{ id: 'r1', settlement: s }] })[0].line;

/** The screen surfaces, each rendered alone. */
const SCREENS = {
  overview: (s) => <OverviewTab settlement={s} />,
  economics: (s) => <EconomicsTab economicState={s.economicState} settlement={s} />,
  summary: (s) => <SummaryTab settlement={s} />,
  tonight: (s) => <TableView settlement={s} onClose={() => {}} />,
};
/** @param {any} s @param {keyof typeof SCREENS} which */
const screenHtml = (s, which) => { const { container } = render(SCREENS[which](s)); const html = container.innerHTML; cleanup(); return html; };
/** @param {any} s @param {keyof typeof SCREENS} which */
const screenText = (s, which) => { const { container } = render(SCREENS[which](s)); const text = container.textContent || ''; cleanup(); return text; };

let capped; let calm; let sentence;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  capped = bear(CAPPED);
  calm = bear(CALM);
  sentence = prosperityInCrisisLine(capped);
}, 120000);
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('a capped birth: every surface that prints the label says both', () => {
  test('the fixture is what it claims: capped by the famine, the sentence in the owner\'s form', () => {
    expect(capped.economicState.prosperity).toBe('Struggling');
    expect(sentence).toBe(`${capped.economicState.prosperityStanding} before the famine; Struggling while it lasts.`);
    expect(deriveDossierViewModel(capped).prosperity.inCrisis).toBe(sentence);
  });

  for (const which of /** @type {Array<keyof typeof SCREENS>} */ (Object.keys(SCREENS))) {
    test(`screen: the ${which} surface prints the sentence once`, () => {
      expect(screenText(capped, which).split(sentence).length - 1, which).toBe(1);
    });
  }

  test('screen: the Summary tab\'s copied text carries it beside the Economy line', () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<SummaryTab settlement={capped} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    const copied = String(writeText.mock.calls[0]?.[0] || '');
    const economyLine = copied.split('\n').find((l) => l.startsWith('**Economy:**')) || '';
    expect(economyLine).toContain(sentence);
  });

  test('PDF: the cover, the Overview chapter and the Economics chapter print it', () => {
    const t = pdfText(capped);
    for (const [where, text] of Object.entries(t)) expect(text.includes(sentence), where).toBe(true);
    const vm = buildViewModel({ settlement: capped });
    expect(vm.overview.prosperityInCrisis).toBe(sentence);
    expect(vm.economics.prosperityInCrisis).toBe(sentence);
  });

  test('Foundry: the Overview and the Economics pages print it beneath their Prosperity row', () => {
    const pages = journal(capped);
    for (const name of ['Overview', 'Economics & Trade']) {
      const md = pages[name] || '';
      const rows = md.split('\n');
      const at = rows.findIndex((r) => r.startsWith('- **Prosperity:**'));
      expect(at, name).toBeGreaterThanOrEqual(0);
      expect(rows[at + 1], name).toBe(`  - ${sentence}`);
    }
  });

  test('the realm register: its line names the label and says both', () => {
    expect(registerLine(capped)).toBe(`A struggling town, at peace. ${sentence}`);
  });
});

describe('nothing new where there is nothing to say', () => {
  test('a calm birth: every surface is byte-identical to the same record without the second word', () => {
    expect(prosperityInCrisisLine(calm)).toBeNull();
    const old = withoutStanding(calm);
    for (const which of /** @type {Array<keyof typeof SCREENS>} */ (Object.keys(SCREENS))) {
      expect(screenHtml(calm, which), which).toBe(screenHtml(old, which));
    }
    expect(pdfText(calm)).toEqual(pdfText(old));
    expect(journal(calm)).toEqual(journal(old));
    expect(registerLine(calm)).toBe(registerLine(old));
  });

  test('a capped record saved before the second word existed prints no sentence, and differs from the capped birth by the sentence alone', () => {
    const old = withoutStanding(capped);
    for (const which of /** @type {Array<keyof typeof SCREENS>} */ (Object.keys(SCREENS))) {
      const text = screenText(old, which);
      expect(text.includes(sentence), which).toBe(false);
      expect(screenText(capped, which).replace(sentence, ''), which).toBe(text);
    }
    const before = pdfText(old);
    const after = pdfText(capped);
    for (const where of Object.keys(before)) {
      expect(before[where].includes(sentence), where).toBe(false);
      expect(after[where].replace(`${sentence}\n`, '').replace(`\n${sentence}`, ''), where).toBe(before[where]);
    }
    expect(Object.values(journal(old)).join('\n').includes(sentence)).toBe(false);
    expect(registerLine(old)).toBe('A struggling town, at peace.');
  });
});
