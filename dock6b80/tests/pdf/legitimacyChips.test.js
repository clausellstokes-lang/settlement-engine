/**
 * @vitest-environment jsdom
 *
 * tests/pdf/legitimacyChips.test.js
 *
 * The PDF legitimacy banner renders its breakdown as chips via ScoreWithBreakdown,
 * which prints "<±delta> <label>". The view-model normalized the engine's
 * breakdown map ({ prosperity, safety, defense, food } -> delta) into
 * { key, delta } WITHOUT a `label`, so every chip printed a bare delta ("+12")
 * with nothing naming the contributing factor. viewModel now attaches a human
 * `label` per factor.
 *
 * Pins: (1) every breakdown chip carries a non-empty, ASCII-only label naming its
 * factor; (2) the labels actually reach the rendered chip's text leaves.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { ScoreWithBreakdown } from '../../src/pdf/primitives/Visuals.jsx';

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

const CFG = { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'civilized' };

let vm;
beforeAll(() => {
  const settlement = generateSettlementPipeline(CFG, null, { seed: 'legit-chips', customContent: {} });
  vm = buildViewModel({ settlement });
});

describe('PDF legitimacy breakdown chips carry factor labels', () => {
  it('every breakdown item has a non-empty ASCII label alongside its numeric delta', () => {
    const bd = vm.power.legitimacyBreakdown;
    expect(Array.isArray(bd)).toBe(true);
    expect(bd.length, 'a city should have a populated legitimacy breakdown').toBeGreaterThan(0);
    for (const b of bd) {
      expect(typeof b.label, `factor ${b.key} must have a string label`).toBe('string');
      expect(b.label.length, `factor ${b.key} label must be non-empty`).toBeGreaterThan(0);
      // fontGlyphCoverage contract: PDF text is ASCII-only.
      // eslint-disable-next-line no-control-regex
      expect(b.label, `label "${b.label}" must be ASCII`).toMatch(/^[\x00-\x7F]+$/);
      expect(typeof b.delta, `factor ${b.key} must carry a numeric delta`).toBe('number');
    }
  });

  it('the known legitimacy factors resolve to their human labels', () => {
    const byKey = Object.fromEntries(vm.power.legitimacyBreakdown.map((b) => [b.key, b.label]));
    // computePublicLegitimacy always emits all four factors.
    expect(byKey.prosperity).toBe('Prosperity');
    expect(byKey.safety).toBe('Safety');
    expect(byKey.defense).toBe('Defense');
    expect(byKey.food).toBe('Food security');
  });

  it('the labels reach the rendered chip text leaves (not just the view-model)', () => {
    const texts = collectText(
      ScoreWithBreakdown({
        label: 'PUBLIC LEGITIMACY',
        score: vm.power.legitimacy?.score ?? 50,
        scoreLabel: '',
        breakdown: vm.power.legitimacyBreakdown,
      }),
    ).join(' ');
    for (const b of vm.power.legitimacyBreakdown) {
      expect(texts, `chip label "${b.label}" must print`).toContain(b.label);
    }
  });
});
