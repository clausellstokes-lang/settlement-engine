/**
 * clampPrimitive.parity.test.js — proves the equivalence class for code-quality-4.
 *
 * The kernel clamp/clamp01 (src/kernel/math.js) adopt the ISFINITE policy: any
 * non-finite input clamps to the low bound (lo / 0). A local clamp copy may be
 * MIGRATED to the kernel import ONLY IF its expression is byte-identical to the
 * kernel over EVERY input — not just the finite ones. This test pins that:
 *
 *  - POSITIVE: each variant this wave migrated is Object.is-equal to the kernel
 *    primitive over the full battery (finite, non-finite, -0, non-numbers). The
 *    migration is therefore byte-identical BY CONSTRUCTION — no golden needed.
 *  - NEGATIVE CONTROL: the passthrough / coerce / -0-ternary variants (which this
 *    wave deliberately did NOT migrate — they stay frozen in the ratchet baseline)
 *    are shown to DIFFER, proving the battery actually discriminates non-finite
 *    policy rather than passing everything.
 */
import { describe, test, expect } from 'vitest';
import { clamp, clamp01 } from '../../src/kernel/math.js';

// The full input battery — the non-finite / -0 / non-number edge is where the
// three historical clamp families diverge.
const INPUTS = [
  -1000, -2, -1, -0.5, -0.0001, -0, 0, 0.0001, 0.3, 0.5, 0.9999, 1, 1.5, 2, 100, 1000,
  NaN, Infinity, -Infinity,
  '5', '0.5', '', '  ', 'abc', null, undefined, true, false, {}, [], [0.5],
];

/** Object.is over the battery so +0 vs -0 and NaN are compared exactly. */
function sameAsClamp01(fn) {
  return INPUTS.every((x) => Object.is(fn(x), clamp01(x)));
}
function sameAsClamp(fn, lo, hi) {
  return INPUTS.every((x) => Object.is(fn(x, lo, hi), clamp(x, lo, hi)));
}

describe('clamp primitive — migrated variants are byte-identical (Object.is over battery)', () => {
  // ── clamp01 equivalence class (migrated this wave) ──────────────────────────
  test('isFinite→0 then Math.max/min  (rulingPower, npcAgency, tierResourceDynamics, factionCompetition, stressorDynamics, applyWorldPulse, pressureModel, stressorSeverity)', () => {
    const v = (value) => { const n = Number.isFinite(value) ? value : 0; return Math.max(0, Math.min(1, n)); };
    expect(sameAsClamp01(v)).toBe(true);
  });
  test('typeof-guard + isFinite  (region/graph, region/propagation, display/newsBody)', () => {
    const v = (value) => { const n = (typeof value === 'number' && Number.isFinite(value)) ? value : 0; return Math.max(0, Math.min(1, n)); };
    expect(sameAsClamp01(v)).toBe(true);
  });
  test('institutionLifecycle inline form', () => {
    const v = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);
    expect(sameAsClamp01(v)).toBe(true);
  });
  test('contestMath inline form (exported)', () => {
    const v = (val) => Math.max(0, Math.min(1, Number.isFinite(val) ? val : 0));
    expect(sameAsClamp01(v)).toBe(true);
  });

  // ── clamp(x, lo, hi) equivalence class (migrated this wave) ─────────────────
  test('foodStockpile isFinite→lo clamp form matches kernel clamp over lo/hi pairs', () => {
    const v = (val, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(val) ? val : lo));
    for (const [lo, hi] of [[0, 1], [0, 100], [-5, 5], [1, 10]]) {
      expect(sameAsClamp(v, lo, hi)).toBe(true);
    }
  });

  // ── NEGATIVE CONTROLS — deliberately NOT migrated; must DIFFER ───────────────
  test('passthrough (x<0?0:x>1?1:x) DIFFERS from kernel (NaN / +Inf / -0 ride through)', () => {
    const v = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
    expect(sameAsClamp01(v)).toBe(false);
  });
  test('coerce Number(v)||0 DIFFERS from kernel (+Inf→1, strings coerce)', () => {
    const v = (val) => Math.max(0, Math.min(1, Number(val) || 0));
    expect(sameAsClamp01(v)).toBe(false);
  });
  test('isFinite + ternary (status.js) DIFFERS from kernel on -0', () => {
    const v = (x) => (Number.isFinite(x) ? (x < 0 ? 0 : x > 1 ? 1 : x) : 0);
    // finite/non-finite all match EXCEPT -0: ternary returns -0, kernel returns +0.
    expect(sameAsClamp01(v)).toBe(false);
  });
});
