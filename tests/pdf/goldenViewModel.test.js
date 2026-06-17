/**
 * @vitest-environment jsdom
 *
 * goldenViewModel.test.js — A+ pdf.6.
 *
 * Two guarantees that sit on top of the field-level VALUE parity
 * (viewModelParity.test.js, which proves canon === PDF view-model per fact):
 *
 *   1. GOLDEN SNAPSHOT — the canonical values of every SHARED_FIELDS fact for a
 *      fixed seed are snapshotted, so ANY change to a derived dossier value is
 *      surfaced for review (not auto-updated) instead of slipping through.
 *
 *   2. RENDER-LEAF — parity of the view-model is necessary but not sufficient: a
 *      section can read the right value yet fail to PRINT it. This renders the
 *      owning PDF section and asserts the value actually reaches its text leaves.
 *      (PDF components are plain hook-free functions returning element trees, so
 *      we execute them and collect the text leaves — same trade-off as
 *      missingValuePlaceholders.test.js / sections.smoke.test.js; no PDF bytes.)
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { SHARED_FIELDS, getByPath } from '../../src/domain/display/parityContract.js';
import { Overview } from '../../src/pdf/sections/Overview.jsx';

// Recursively flatten an element tree to its text leaves. Function components are
// executed (plain functions in src/pdf — no hooks); hosts walked via children.
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

const CFG = { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' };
const SEED = 'parity-town-2026';

let settlement, canon, vm;
beforeAll(() => {
  settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
  canon = deriveDossierViewModel(settlement);
  vm = buildViewModel({ settlement });
});

describe('pdf.6 — golden snapshot of the SHARED_FIELDS canon values', () => {
  it('canon values for the fixed seed are golden (review any change, do not auto-update)', () => {
    const snap = {};
    for (const row of SHARED_FIELDS) snap[row.fact] = getByPath(canon, row.canonPath);
    expect(snap).toMatchSnapshot();
  });
});

describe('pdf.6 — render-leaf: pinned values reach the rendered PDF section', () => {
  it('the prosperity label is printed in the Overview chapter (vm value → page)', () => {
    const label = canon.prosperity.label;
    expect(label, 'fixture should produce a prosperity label').toBeTruthy();
    const texts = collectText(Overview({ settlement, vm }));
    // Distinctive string fact (unlike ambiguous integer counts); match
    // case-insensitively since the chapter may upper-case its labels.
    const hit = texts.some(t => t.toLowerCase().includes(String(label).toLowerCase()));
    expect(hit, `Overview text leaves must contain prosperity label "${label}"; got: ${texts.join(' | ').slice(0, 300)}`).toBe(true);
  });

  it('the headcount totals reach the Overview chapter', () => {
    const texts = collectText(Overview({ settlement, vm }));
    // Institutions count is non-zero for a town; assert its formatted integer
    // appears (it renders as "<n> total" in the institutions header).
    expect(texts.some(t => t.includes(String(canon.headcounts.institutions)))).toBe(true);
  });
});
