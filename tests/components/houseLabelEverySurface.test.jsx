/** @vitest-environment jsdom */
/**
 * ROUND THREE, ruling (a) — THE GUARD: NO HOUSE IS PRINTED WITH THE CATALOGUE'S MACHINERY, ON ANY RENDERED
 * SURFACE (the chair, 2026-11-13; ROUND-3-CUT §7 (a), lane round-3-cut-2026-11-13 at 892904c1d).
 *
 * Four towns born in the app's own shape (`selectedStresses` with `selectedStressesRandom:false`, the
 * reader's rr2s seeds and one of the census's own), each rendered on EVERY surface a reader meets:
 *   - the page: the real OutputContainer as its owner sees it, every group and sub-tab clicked, every
 *     disclosure opened (the reader's REVIEW-R2-STAGES walk);
 *   - the PDF: SettlementPDF, all three variants, walked to its text leaves;
 *   - the Foundry journal: buildJournalPages, all three variants, its MARKDOWN UNESCAPED (the cut's
 *     census missed this surface because the journal escapes a bracket: "Mills \(2-5\)");
 *   - the Tonight sheet: composeTonightSheet.
 * A house the town's own record holds with a machinery bracket (a digit-led count range, household range or
 * floor, population gate; "(multiple)"; "(if …)"; "(high magic)"), in its raw or display spelling, must not
 * print. The towns hold every form: "Craft guilds (100-150+)", "Housing (3500+ households)", "Housing
 * (75-650 households)", "Inn (multiple)", "Gates (if walled)", "Parish churches (2-5)" / "Houses of worship
 * (2-5)", "Taverns (5-20)" in the Outlook's stored list, and the conversion hook's "(50-100+)".
 *
 * THE DEFENCE SURFACES ARE ANOTHER LANE'S (the chair's brief: src/components/new/tabs/DefenseTab.jsx and
 * src/pdf/sections/DefenseSecurity.jsx are not this lane's). Their occurrences are counted EXACTLY in
 * DEFENCE_ALLOWANCE below: a new one reds, and the defence lane's cure reds it too, so the row is struck
 * when it lands.
 */
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; useStore.setState = () => {};
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { INSTITUTION_DISPLAY_NAMES } from '../../src/domain/display/institutionDisplayName.js';

/** The machinery a house's name may carry in the catalogue (ruling (a)); a qualifier ("(guild)") is not. */
const MACHINERY = /\((?:\d[^)]*|multiple|if [^)]*|high magic)\)/i;

const SEEDS = ['rr2s-town-under_siege-rand-1', 'rr2s-town-calm-rand-1', 'rr2s-metropolis-calm-rand-1', 'r2s-religious_conversion-metropolis-0'];
/** The defence lane's surfaces, counted exactly (see the header). */
const DEFENCE_ALLOWANCE = Object.freeze({ 'rr2s-town-under_siege-rand-1': { 'page Systems/Defense': 1, 'pdf-canon_dossier': 1, 'pdf-draft_brief': 1 } });

function cfgFor(seed) {
  let m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if (!m) throw new Error(seed);
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
}

/** Every spelling of a held house that carries machinery, lower-cased, longest first. */
function machineryNamesOf(town) {
  const names = new Set();
  for (const i of town.institutions || []) {
    const raw = String(i?.name || '');
    if (!MACHINERY.test(raw)) continue;
    names.add(raw.toLowerCase());
    const shown = INSTITUTION_DISPLAY_NAMES[raw];
    if (shown && MACHINERY.test(shown)) names.add(shown.toLowerCase());
  }
  return [...names].sort((a, b) => b.length - a.length);
}

/** Occurrences of the town's machinery names in one surface's lines. */
function machineryHits(lines, names) {
  const hits = [];
  for (const line of lines) {
    let rest = String(line).toLowerCase();
    for (const n of names) {
      if (!rest.includes(n)) continue;
      hits.push({ name: n, line: String(line).slice(0, 140) });
      rest = rest.split(n).join(' ');
    }
  }
  return hits;
}

const viewport = { matches: false, listeners: new Set() };
function storeFor(town) {
  return { settlement: town, aiSettlement: null, setAiSettlement: vi.fn(), clearAiSettlement: vi.fn(), regenSection: vi.fn(), requestNarrative: vi.fn(), requestDailyLife: vi.fn(), getCost: vi.fn(() => 0), creditBalance: 0, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '', aiPartialFailure: null, aiViolations: null, clearAiViolations: vi.fn(), lastRegenerationDelta: null, clearLastRegenerationDelta: vi.fn(), showNarrative: false, setShowNarrative: vi.fn(), savedSettlements: [{ id: 'save-1', settlement: town }], campaigns: [], eventLog: [], systemState: null, pinNpc: vi.fn(), unpinNpc: vi.fn(), queueEdit: vi.fn(), applyUserEditAction: vi.fn(), revertUserEditAction: vi.fn(), focusEntity: vi.fn(), editMode: false, phase: 'draft', auth: { tier: 'premium' }, isElevated: () => false, isSettlementClockBound: () => false, userPrefs: { tableViewOpen: false }, setUserPref: vi.fn() };
}
const BLOCK = new Set(['DIV', 'P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'TR', 'UL', 'OL', 'TABLE', 'HEADER', 'FOOTER', 'ARTICLE', 'BR', 'DT', 'DD', 'DETAILS', 'SUMMARY', 'BLOCKQUOTE', 'FIGCAPTION']);
function domLines(root) {
  const out = []; let cur = '';
  const flush = () => { const t = cur.replace(/\s+/g, ' ').trim(); if (t) out.push(t); cur = ''; };
  (function walk(n) { for (const c of n.childNodes) { if (c.nodeType === 3) cur += c.nodeValue; else if (c.nodeType === 1) { if (c.tagName === 'STYLE') continue; const b = BLOCK.has(c.tagName); if (b) flush(); walk(c); if (b) flush(); } } })(root);
  flush(); return out;
}
function openAll(panel, snap) {
  const disc = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
  for (let p = 0; p < 4; p++) { const c = disc().filter((e) => e.getAttribute('aria-expanded') === 'false'); if (!c.length) break; for (const e of c) fireEvent.click(e); }
  snap();
  const n = disc().length; for (let i = 0; i < n; i++) { const e = disc()[i]; if (!e || e.getAttribute('aria-expanded') !== 'false') continue; fireEvent.click(e); if (e.getAttribute('aria-expanded') === 'true') snap(); }
}
/** The PDF tree walked to its text leaves (as tests/pdf do). */
function pdfText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') { out.push('\n'); pdfText(node.type(node.props), out); out.push('\n'); return out; }
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return pdfText({ type: node.type.type, props: node.props }, out);
    out.push('\n'); pdfText(node.props?.children, out); out.push('\n');
  }
  return out;
}
const unescapeMarkdown = (t) => String(t).replace(/\\([()_*[\]#+.!-])/g, '$1');

beforeAll(async () => {
  window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
  await loadGenerationLawPayloads();
}, 120_000);
afterEach(cleanup);

describe('ruling (a): no house prints with the catalogue\'s machinery, on any rendered surface', () => {
  test('the detector sees a planted house and passes its label', () => {
    const names = ['mills (2-5)', 'houses of worship (2-5)'];
    expect(machineryHits(['Mills (2-5) · held by Sak Xul'], names)).toHaveLength(1);
    expect(machineryHits(['- Mills (2-5), held by Sak Xul'.replace(/[()]/g, (c) => `\\${c}`)].map(unescapeMarkdown), names)).toHaveLength(1);
    expect(machineryHits(['Mills · held by Sak Xul', 'Houses of worship'], names)).toHaveLength(0);
  });

  for (const seed of SEEDS) {
    test(`${seed}: every surface`, async () => {
      let town = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
      town = withPublicProse(town, composePublicProse(town));
      const names = machineryNamesOf(town);
      expect(names.length, `${seed} holds houses with machinery in their names (the guard is not vacuous)`).toBeGreaterThan(1);
      /** @type {Record<string, Array<{ name: string, line: string }>>} */
      const bySurface = {};
      const add = (surface, lines) => { const h = machineryHits(lines, names); if (h.length) (bySurface[surface] ||= []).push(...h); };

      // THE PAGE
      mocks.store = storeFor(town);
      const { container } = render(<OutputContainer settlement={town} />);
      const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
      const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
      await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
      let views = 0;
      for (let g = 0; g < groupTabs().length; g++) {
        const groupName = groupTabs()[g].textContent.trim(); fireEvent.click(groupTabs()[g]);
        await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
        for (let t = 0; t < subTabs().length; t++) {
          const b = subTabs()[t]; const tabName = b.textContent.trim(); const id = (b.id || '').replace(/^sf-tab-/, '');
          fireEvent.click(b);
          try { await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect(p).toBeTruthy(); expect((p.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 }); } catch { /* an empty panel is read as it is */ }
          const panel = container.querySelector(`#sf-panel-${id}`);
          if (!panel) continue;
          views++;
          const seen = new Set(); const acc = [];
          openAll(panel, () => { for (const l of domLines(panel)) if (!seen.has(l)) { seen.add(l); acc.push(l); } });
          add(`page ${groupName}/${tabName}`, acc);
        }
      }
      expect(views, 'the page walk opened the dossier\'s views').toBeGreaterThan(10);

      // THE PDF, THE FOUNDRY JOURNAL (unescaped), THE TONIGHT SHEET
      for (const variant of ['canon_dossier', 'draft_brief', 'timeline_packet']) {
        const phase = variant === 'draft_brief' ? 'draft' : 'canon';
        const pdf = pdfText({ type: SettlementPDF, props: { settlement: town, phase, variant, faithUnlocked: true } }).join(' ').split('\n');
        add(`pdf-${variant}`, pdf);
        const pages = buildJournalPages(buildViewModel({ settlement: town, phase }), { variant, faithUnlocked: true, settlement: town });
        add(`foundry-${variant}`, pages.flatMap((p) => unescapeMarkdown(p.markdown ?? p.text?.content ?? p.html ?? p.content ?? '').split('\n')));
      }
      add('tonight', JSON.stringify(composeTonightSheet(town), null, 1).split('\n'));

      const allowed = DEFENCE_ALLOWANCE[seed] || {};
      const over = Object.entries(bySurface).filter(([k, v]) => v.length !== (allowed[k] || 0)).map(([k, v]) => `${k}: ${v.length} (allowed ${allowed[k] || 0}) e.g. ${v[0].line}`);
      const struck = Object.entries(allowed).filter(([k, n]) => (bySurface[k]?.length || 0) !== n).map(([k, n]) => `${k}: allowed ${n}, found ${bySurface[k]?.length || 0}`);
      expect([...over, ...struck]).toEqual([]);
    }, 300_000);
  }
});
