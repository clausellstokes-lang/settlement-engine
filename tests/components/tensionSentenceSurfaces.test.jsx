/** @vitest-environment jsdom */
/**
 * PAGE-13's CAUSES-WIRING-2 (PAGE-9's `briefs/CAUSES-WIRING.md` steps 3 and 4; the seventh chair's condition of 20:44 UTC
 * 2026-11-20: THE CAUSE SENTENCE REPLACES THE DESCRIPTION; NO SURFACE SAYS ONE TROUBLE IN TWO WAYS). The six surfaces the
 * readers' census marks "to wire" print a trouble's sentence only through `tensionShown.js :: tensionSentenceShown`, with
 * the document each was given: the web Overview list (`OverviewTab.jsx`), the web History tab and the dossier search's
 * found tension (`HistoryTab.jsx :: TensionRow`), the PDF Overview and the PDF History (`pdf/lib/viewModel.js`'s
 * `overviewSlice` and `historySlice`), and the Foundry journal's "## Tensions" (`powerSlice`). On a born town whose live
 * tensions are MADE UP: one kind with a table (crime_wave) and one without (tyranny), each with a stored sentence of its
 * own; every expected sentence is COMPUTED through `tensionCauseSentenceOf`, never quoted.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { tensionCauseSentenceOf } from '../../src/domain/display/tensionCause.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { TensionRow } from '../../src/components/new/tabs/HistoryTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { HistoryFounding } from '../../src/pdf/sections/HistoryFounding.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CRIME_STORED = 'Thefts and worse have been climbing here this season, the stored words.';
const TYRANNY_STORED = 'The hand that rules here grows heavier each year, the stored words.';
const CRIME = { type: 'crime_wave', severity: 'major', description: CRIME_STORED, factions: [], plotHooks: [] };
const TYRANNY = { type: 'tyranny', severity: 'major', description: TYRANNY_STORED, factions: [], plotHooks: [] };

/** @type {any} */ let doc;
/** @type {string} */ let crimeSentence;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const born = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'town' }), null, { seed: 'hxd-town-0', customContent: {} });
  doc = { ...born, history: { ...born.history, historicalEvents: [], currentTensions: [CRIME, TYRANNY] } };
  crimeSentence = /** @type {string} */ (tensionCauseSentenceOf(doc, CRIME));
}, 240000);
afterEach(cleanup);

// The PDF's element tree walked to its text, as tests/pdf do (the sections are plain functions).
/** @param {any} node @param {string[]} [out] @returns {string[]} */
function pdfLeaves(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { if (String(node).trim()) out.push(String(node).trim()); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfLeaves(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return pdfLeaves(node.type(node.props), out);
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return pdfLeaves({ type: node.type.type, props: node.props }, out);
    if (node.props?.defaultValue !== undefined && node.props?.children === undefined) { pdfLeaves(node.props.defaultValue, out); return out; }
    return pdfLeaves(node.props?.children, out);
  }
  return out;
}
/** the premise: the made-up crime_wave takes a table's sentence, the tyranny none */
const premise = () => {
  expect(typeof crimeSentence).toBe('string');
  expect(crimeSentence).not.toBe(CRIME_STORED);
  expect(tensionCauseSentenceOf(doc, TYRANNY)).toBeNull();
};
/** one surface's text: the cause sentence for crime_wave, the stored text for tyranny, the crime's stored text nowhere */
const expectSentences = (/** @type {string} */ text, /** @type {string} */ what) => {
  expect(text, `${what}: the cause sentence`).toContain(crimeSentence);
  expect(text, `${what}: the stored text where no table holds`).toContain(TYRANNY_STORED);
  expectAbsentWithAnchor([text], CRIME_STORED, crimeSentence, `${what}: the cause sentence replaces the description`);
};

describe('the web surfaces print a trouble\'s sentence through tensionSentenceShown', () => {
  it('the Overview list (OverviewTab "Tensions & Conflicts")', () => {
    premise();
    const { container } = render(<OverviewTab settlement={doc} narrativeNote={null} />);
    expectSentences(container.textContent || '', 'the Overview list');
  });
  it('the History tab\'s row, mounted by the dossier search too (HistoryTab.jsx :: TensionRow)', () => {
    premise();
    const a = render(<TensionRow t={CRIME} settlement={doc} />).container.textContent || '';
    const b = render(<TensionRow t={TYRANNY} settlement={doc} />).container.textContent || '';
    expectSentences(`${a}\n${b}`, 'the History row');
  });
  it('a served page passes its served document: the row prints the served document\'s sentence', () => {
    premise();
    const served = toPublicSafe(doc);
    const t2 = served.history.currentTensions.find((/** @type {any} */ x) => x.type === 'crime_wave');
    expect(t2).toBeTruthy();
    const text = render(<TensionRow t={t2} settlement={served} />).container.textContent || '';
    expect(text).toContain(/** @type {string} */ (tensionCauseSentenceOf(served, t2)));
    expectAbsentWithAnchor([text], CRIME_STORED, /** @type {string} */ (tensionCauseSentenceOf(served, t2)), 'the served row prints no stored text');
  });
});

describe('the exports print a trouble\'s sentence through tensionSentenceShown', () => {
  it('the view model\'s three tension rows carry the sentence shown (overview, power, history)', () => {
    premise();
    const vm = buildViewModel({ settlement: doc });
    for (const slice of ['overview', 'power', 'history']) {
      expect(vm[slice].tensions.map((/** @type {any} */ t) => t.description), slice).toEqual([crimeSentence, TYRANNY_STORED]);
    }
  });
  it('the PDF Overview (a variant without History: the Overview is the home) and the PDF History', () => {
    premise();
    const vm = buildViewModel({ settlement: doc });
    expectSentences(pdfLeaves(Overview({ settlement: doc, vm, historyPrinted: false })).join('\n'), 'the PDF Overview');
    expectSentences(pdfLeaves(HistoryFounding({ settlement: doc, vm })).join('\n'), 'the PDF History');
  });
  it('the Foundry journal\'s "## Tensions"', () => {
    premise();
    const vm = buildViewModel({ settlement: doc });
    const all = buildJournalPages(vm, { settlement: doc }).map((/** @type {{ markdown: string }} */ p) => p.markdown).join('\n').replace(/\\/g, '');
    expect(all).toContain('## Tensions');
    expectSentences(all, 'the Foundry journal');
  });
});
