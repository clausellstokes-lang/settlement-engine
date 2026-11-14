/**
 * @vitest-environment jsdom
 *
 * legitimacyPlainWords.test.jsx — COHERENCE-POWERS-7 (the cold list REVIEW-W2A-3, MEDIUM #20 #51 #107 #169 #199 #287):
 * THE PAGE SHOWS RATINGS, NEVER THE MACHINERY (the owner, restated 2026-11-13: no points, sums, limits or explanations of
 * how a rating was worked out on any page, PDF or export). The Power tab printed the public legitimacy score's
 * "Breakdown" in points ("Prosperity -10", "Safety -20", "Defense -1", "Food -4"), and the PDF's Power chapter the same
 * chips ("-10 Prosperity"). The rating (the score and its band) stays; the causes stay in words, in the governance
 * paragraph (domain/display/governanceAccount.js :: legitimacyCausesOf); the points go from both.
 *
 * Before the cure, at the lane's base 714381934: the census's 720 rendered as the owner sees them print the chips in
 * 718 towns. Births through the reviewer's own app shape; every expected word a literal.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

afterEach(cleanup);

/** The reviewer's seeds in the app's shape (render.rw3.jsx :: cfgFor). @param {string} seed */
function born(seed) {
  const m = seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
/** A point chip of the legitimacy breakdown, in either order the two surfaces print it. */
const POINTS = /(?:^|\s)(?:(?:Prosperity|Safety|Defense|Food(?: security)?) [+-]\d+|[+-]\d+ (?:Prosperity|Safety|Defense|Food(?: security)?))(?:\s|$)/;

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

describe('COHERENCE-POWERS-7 · public legitimacy: the rating, never its points', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each(['rw3-thorp-calm-1', 'rw3-thorp-famine-1', 'rw3-hamlet-calm-1', 'rw3-metropolis-under_siege-1',
    'rw3-metropolis-politically_fractured-1'])('%s: the Power tab shows the score and its band, no "Breakdown" and no points', (seed) => {
    const s = born(seed);
    const leg = s.powerStructure.publicLegitimacy;
    expect(Object.values(leg.breakdown).some((v) => Number(v) !== 0), 'premise: the score was moved by its causes').toBe(true);
    const page = render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />).container;
    const blocks = [...page.querySelectorAll('div, p, span')].map((e) => (e.textContent || '').trim());
    expect(page.textContent).toContain('Public legitimacy');
    expect(page.textContent).toContain(leg.label);
    expect(blocks.filter((t) => t === 'Breakdown')).toEqual([]);
    expect(blocks.filter((t) => POINTS.test(` ${t} `) && t.length < 24)).toEqual([]);
  }, 60_000);
  it.each(['rw3-thorp-famine-1', 'rw3-metropolis-under_siege-1'])('%s: the PDF\'s Power chapter prints the score, no points', (seed) => {
    const s = born(seed);
    const leaves = collectText(PowerStructure({ settlement: s, vm: buildViewModel({ settlement: s }) }));
    expect(leaves.join(' ')).toContain('PUBLIC LEGITIMACY');
    // a chip is one Text whose two leaves are the signed figure and the label ("-10 " + "Prosperity")
    expect(leaves.join('')).not.toMatch(/(?:[+-]\d+|\b0) (?:Prosperity|Safety|Defense|Food security)\b/); // anchored: these same leaves are asserted to hold PUBLIC LEGITIMACY just above
  }, 60_000);
});
