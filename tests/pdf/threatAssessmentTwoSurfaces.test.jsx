/** @vitest-environment jsdom */
/**
 * threatAssessmentTwoSurfaces.test.jsx — EXPORTS-B1 (the chair's ruling on EXPORTS-MEASURE-1 B1, candidate C): THE
 * THREAT ASSESSMENT'S TWO BRANCHES TAKE THE CONDITIONS THEIR WORDS NEED, ON THE TAB'S OPENED ROW AND THE PDF'S ROW.
 *
 * One reader (`domain/display/threatAssessment.js :: buildThreatAssessment`) writes the sentence under each threat bar:
 * the Defense tab prints it when its row is opened, the PDF's Defence chapter prints it under "THREAT ASSESSMENT"
 * (through `defenseDisplay.js :: deriveDefenseReadiness`). Two of its sentences were false:
 * - "Clergy provide basic wound care…" where the town's only sacred row is "Access to parish church" (a neighbour's
 *   church) or a wayside shrine: no house with clergy stands on the live roster (r2r-thorp-0, r2r-hamlet-0 under siege,
 *   r2s-famine-thorp-0 in famine). Its guard: r2s-under_siege-village-0, whose own parish church keeps the line.
 * - "The defenders are already paid late…" where no force stands (r2r-thorp-0, r2r-thorp-14): its twin "Money is already
 *   short; a long crisis would empty the reserves." Its guard: r2r-thorp-1, where a force stands and keeps the line.
 * Births in the app's own shape (the census's 720, SECOND-WAVE-CENSUS/births.mjs: the r2r- and r2s- arms).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { forceStands } from '../../src/domain/display/threatAssessment.js';
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's 720 (r2r-<size>-<n>, r2s-<stress>-<size>-<n>). @param {string} seed */
const birth720 = (seed) => {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (s)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (s)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc @returns {any[]} */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};

const LABELS = ['Beasts & Monsters', 'Invasion & War', 'Internal Security', 'Economic Survival', 'Disasters & Famine'];

/** The PDF's THREAT ASSESSMENT rows, label → the row's printed text. @param {any} town */
const pdfRows = (town) => {
  const vm = buildViewModel({ settlement: town });
  const rows = find(DefenseSecurity({ settlement: town, narrativeMode: false, vm, stateProse: null }),
    (n) => typeof n.key === 'string' && n.key.startsWith('rd-'));
  return Object.fromEntries(rows.map((v) => { const t = leaves(v); return [t[0], t.join(' ')]; }));
};
/** The Defense tab's rows, each OPENED by its own header, label → the opened card's text. @param {any} town */
const tabRows = (town) => {
  const { container } = render(<DefenseTab settlement={town} />);
  /** @type {Record<string, string>} */ const out = {};
  for (const label of LABELS) {
    const head = [...container.querySelectorAll('[role="button"]')].find((b) => (b.textContent || '').startsWith(label));
    if (!head) continue;
    fireEvent.click(head);
    // The opened card: its header, the town's own line, and the reader's sentence (printed only while it is open).
    out[label] = head.parentElement?.textContent || '';
    fireEvent.click(head);
  }
  cleanup();
  return out;
};
/** Both surfaces of a town, row by row. @param {string} seed */
const surfaces = (seed) => { const town = birth720(seed); return { town, tab: tabRows(town), pdf: pdfRows(town) }; };

const CLERGY = 'Clergy provide basic wound care';
const PAID_LATE = 'The defenders are already paid late';
const TWIN = 'Money is already short; a long crisis would empty the reserves.';

describe('the threat assessment speaks of clergy and defenders only where they stand (EXPORTS-B1), on the tab and the PDF', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  afterEach(cleanup);

  test('no clergy line where the only sacred row is a neighbour\'s church: a thorp, a siege hamlet, a famine thorp', () => {
    for (const seed of ['r2r-thorp-0', 'r2r-hamlet-0', 'r2s-famine-thorp-0']) {
      const { town, tab, pdf } = surfaces(seed);
      expect(liveInstitutionNames(town), `${seed} anchored: access to a neighbour's church`).toContain('Access to parish church');
      expect(tab['Disasters & Famine'], `${seed} tab`).toContain('Nobody here treats the sick');
      expect(pdf['Disasters & Famine'], `${seed} pdf`).toContain('Nobody here treats the sick');
      expect(tab['Disasters & Famine'], `${seed} tab`).not.toContain(CLERGY);
      expect(pdf['Disasters & Famine'], `${seed} pdf`).not.toContain(CLERGY);
    }
    const famine = surfaces('r2s-famine-thorp-0');
    expect(famine.pdf['Disasters & Famine'], 'the famine is still named first').toContain('In famine.');
  }, 240000);

  test('the guard: a village whose own parish church stands keeps the clergy line (r2s-under_siege-village-0)', () => {
    const { town, tab, pdf } = surfaces('r2s-under_siege-village-0');
    expect(liveInstitutionNames(town), 'anchored: its own parish church').toContain('Parish church');
    expect(tab['Disasters & Famine']).toContain(CLERGY);
    expect(pdf['Disasters & Famine']).toContain(CLERGY);
  }, 120000);

  test('no defenders paid late where no force stands: the twin prints (r2r-thorp-0, r2r-thorp-14)', () => {
    for (const seed of ['r2r-thorp-0', 'r2r-thorp-14']) {
      const { town, tab, pdf } = surfaces(seed);
      expect(forceStands(town), `${seed} anchored: no force stands`).toBe(false);
      for (const [side, rows] of [['tab', tab], ['pdf', pdf]]) {
        expect(rows['Economic Survival'], `${seed} ${side}`).toContain(TWIN);
        expect(rows['Economic Survival'], `${seed} ${side}`).not.toMatch(/defenders|defend the place/);
      }
    }
  }, 180000);

  test('the guard: where a force stands, the defenders paid late keep their line (r2r-thorp-1)', () => {
    const { town, tab, pdf } = surfaces('r2r-thorp-1');
    expect(forceStands(town), 'anchored: a force stands').toBe(true);
    expect(tab['Economic Survival']).toContain(PAID_LATE);
    expect(pdf['Economic Survival']).toContain(PAID_LATE);
  }, 120000);
});
