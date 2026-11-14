/** @vitest-environment jsdom */
/**
 * R3-TABS, the second seat (round three's cut #486 #487 #592 #593 #743 #744 #1422 #1423; the increment's HIGH
 * #ww-466 #ww-467 #ww-530 #ww-531, #ww-468, #ww-569; CENSUS-2 kind d "Legitimacy crisismajorcatastrophic").
 * THE CHAIR'S RULING: A RANGE IS NOT A RATING. A tension's record holds the TEMPLATE's list of severities copied
 * whole (historyGenerator.js never resolves it for a tension; 276 of 290 tensions on 164 towns carry two words),
 * and every surface printed the list: the History tab one chip per member run together ("minormajor"), the PDF's
 * Overview joined "Minor / major", the PDF's History pill the list run together. Where the record holds more than
 * one severity for a tension, NO severity word prints for it on any surface; one severity prints its one word as
 * before. Nothing is chosen for the reader. The History row's border colour and the search's sort are untouched.
 *
 * RED-FIRST at fdfd471d9: the tab, the PDF's Overview and the PDF's History print two severity words for one
 * tension in all three towns (the first seat's three: item 5 of the lane's hand-back).
 */
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { HistoryTab, TensionRow } from '../../src/components/new/tabs/HistoryTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';

const SEEDS = ['rr2s-town-under_siege-rand-1', 'rr2s-city-calm-rand-1', 'rr2s-metropolis-plague_onset-port-1'];
const VARIANTS = ['canon_dossier', 'draft_brief', 'timeline_packet'];
const SEV = /^(minor|major|catastrophic)$/i;
const JOINED = /^(minor|major|catastrophic)\s*[/,·]?\s*(minor|major|catastrophic)$/i;
// Inside a line: "(minor / major)" or the words run together ("crisismajorcatastrophic", CENSUS-2 kind d).
const INLINE = /\b(minor|major|catastrophic)\s*\/\s*(minor|major|catastrophic)\b|(minor|major|catastrophic)(minor|major|catastrophic)\b/i;

function appBirth(seed) {
  const m = seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true });
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}
const severities = (t) => [...new Set((Array.isArray(t.severity) ? t.severity : [t.severity]).filter(Boolean))];
function domLeaves(root) {
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  const out = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) out.push(n.nodeValue.trim());
  return out;
}
// The PDF's element tree walked to its text leaves (as tests/pdf do: the sections are plain functions).
function pdfLeaves(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { if (String(node).trim()) out.push(String(node).trim()); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfLeaves(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return pdfLeaves(node.type(node.props), out);
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return pdfLeaves({ type: node.type.type, props: node.props }, out);
    return pdfLeaves(node.props?.children, out);
  }
  return out;
}
// A journal page is { name, markdown }: its lines, the Markdown's emphasis and escapes taken off.
const journalLeaves = (pages) => (pages || []).flatMap((p) => String(p.markdown ?? '')
  .split('\n').map((l) => l.replace(/[*_\\]/g, '').replace(/^[-#|\s]+/, '').trim()).filter(Boolean));
/** Every place a surface prints two severity words for one thing: one leaf "minor / major", or two leaves running. */
function twoWords(leaves) {
  const hits = leaves.filter((l) => JOINED.test(l) || INLINE.test(l));
  for (let i = 1; i < leaves.length; i += 1) if (SEV.test(leaves[i - 1]) && SEV.test(leaves[i])) hits.push(`${leaves[i - 1]}|${leaves[i]}`);
  return hits;
}

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) towns[seed] = appBirth(seed);
}, 240000);
afterEach(cleanup);

describe('a range is not a rating: no surface prints two severity words for one tension', () => {
  for (const seed of SEEDS) {
    test(`${seed}: the premise, its record holds a tension with a range of severities`, () => {
      const ranged = towns[seed].history.currentTensions.filter((t) => severities(t).length > 1);
      expect(ranged.length).toBeGreaterThan(0);
    });
    test(`${seed}: the History tab prints no two severity words for one tension, and the tensions still print`, () => {
      const { container } = render(<HistoryTab settlement={towns[seed]} />);
      for (let p = 0; p < 4; p += 1) for (const b of [...container.querySelectorAll('[aria-expanded="false"]')]) fireEvent.click(b);
      const leaves = domLeaves(container);
      expect(leaves).toContain(`Current Tensions (${towns[seed].history.currentTensions.length})`);
      expect(twoWords(leaves)).toEqual([]);
    });
    test(`${seed}: each ranged tension's row prints no severity word; its label and description print`, () => {
      for (const t of towns[seed].history.currentTensions.filter((x) => severities(x).length > 1)) {
        const { container } = render(<TensionRow t={t} />);
        const leaves = domLeaves(container);
        expect(leaves.join(' ')).toContain(t.description.slice(0, 20));
        expect(leaves.filter((l) => SEV.test(l))).toEqual([]);
        cleanup();
      }
    });
    test(`${seed}: the PDF (every variant) prints no two severity words for one tension`, () => {
      const town = towns[seed];
      for (const variant of VARIANTS) {
        const phase = variant === 'draft_brief' ? 'draft' : 'canon';
        const leaves = pdfLeaves({ type: SettlementPDF, props: { settlement: town, phase, variant, faithUnlocked: true } });
        expect(leaves.length, variant).toBeGreaterThan(20);
        expect(twoWords(leaves), variant).toEqual([]);
      }
    });
    // The timeline packet writes no journal pages (measured: 0 pages at fdfd471d9); the two that do are read.
    test(`${seed}: the Foundry journal (canon and draft) prints no two severity words for one tension`, () => {
      const town = towns[seed];
      for (const variant of ['canon_dossier', 'draft_brief']) {
        const vm = buildViewModel({ settlement: town, phase: variant === 'draft_brief' ? 'draft' : 'canon' });
        const leaves = journalLeaves(buildJournalPages(vm, { variant, faithUnlocked: true, settlement: town }));
        expect(leaves.length).toBeGreaterThan(20);
        expect(twoWords(leaves), variant).toEqual([]);
      }
    });
  }
});

describe('a tension whose record holds ONE severity prints that one word as before', () => {
  test('the tab row, the PDF view model of the Overview and of the History print the one word', () => {
    const town = structuredClone(towns[SEEDS[0]]);
    const t = town.history.currentTensions[0];
    t.severity = ['major'];
    const { container } = render(<TensionRow t={t} />);
    expect(domLeaves(container).filter((l) => SEV.test(l))).toEqual(['major']);
    const vm = buildViewModel({ settlement: town });
    expect(vm.overview.tensions[0].severity).toBe('major');
    expect(vm.history.tensions[0].severity).toEqual(['major']);
    const ranged = structuredClone(towns[SEEDS[0]]);
    ranged.history.currentTensions[0].severity = ['minor', 'major'];
    expect(buildViewModel({ settlement: ranged }).overview.tensions[0].severity).toBe(null);
  });
});
