/**
 * adaptiveGovernor.test.js -- K-5 THE ADAPTIVE FIDELITY GOVERNOR spine (the pure sense->decide ladder).
 *
 * The canonical governor lives in the non-golden VIEW policy at
 * src/lib/townScene/adaptiveQuality.js. The file:// exhibits require an
 * import-free compatibility mirror in scripts/lib/adaptiveGovernor.mjs. This
 * pins the canonical logic with SYNTHETIC frame-time sequences and proves the
 * compatibility artifact cannot drift:
 *   - monotone degradation under sustained overload (quality only drops while over budget);
 *   - THE FLOOR is never crossed and is always reachable (the usable massing-only floor);
 *   - recovery with hysteresis -- headroom lifts quality, and a boundary/dead-band signal never
 *     ping-pongs (degrade fast, recover slow: M-frames-under > N-frames-over + asymmetric steps);
 *   - the manual override CAP wins (the governor treats it as a ceiling);
 *   - the 2D bird's-eye escape hatch trips only when even the floor is drowning, and clears on recovery;
 *   - E-A FLOOR PLANT (isolation-proven): a mutant step without the floor clamp DROPS below the floor
 *     on the exact sequence the real step holds -- proving the floor assertion is not vacuous.
 *
 * The byte-independence of geometry/GLB from qualityLevel is pinned separately
 * in archViewWall.test.js.
 */
import { describe, it, expect } from 'vitest';
import * as canonicalGovernor from '../../src/lib/townScene/adaptiveQuality.js';
import * as exhibitGovernor from '../../scripts/lib/adaptiveGovernor.mjs';

const {
  GOVERNOR_TUNING,
  QUALITY_CEILINGS,
  OVERRIDE_MODES,
  createGovernorState,
  observeFrame,
  setQualityCeiling,
  ceilingForMode,
  ladderFor,
  actuationPlanFor,
} = canonicalGovernor;

const T = GOVERNOR_TUNING;

/** fold a synthetic frame-time sequence; return the final state + the quality trajectory. @param {number[]} frames @param {object} [init] @returns {{ state: object, trace: number[] }} */
function runSeq(frames, init) {
  let state = init || createGovernorState();
  const trace = [state.quality];
  for (const f of frames) { state = observeFrame(state, f); trace.push(state.quality); }
  return { state, trace };
}
/** a flat sequence of n frames at ms each. @param {number} n @param {number} ms @returns {number[]} */
const flat = (n, ms) => Array.from({ length: n }, () => ms);
/** is the trace non-increasing? @param {number[]} t @returns {boolean} */
const nonIncreasing = (t) => t.every((v, i) => i === 0 || v <= t[i - 1] + 1e-12);
/** is the trace non-decreasing? @param {number[]} t @returns {boolean} */
const nonDecreasing = (t) => t.every((v, i) => i === 0 || v >= t[i - 1] - 1e-12);
/** count the direction reversals in a trajectory (up-after-down or down-after-up). @param {number[]} t @returns {number} */
function reversals(t) {
  let dir = 0, n = 0;
  for (let i = 1; i < t.length; i++) {
    const d = Math.sign(Math.round((t[i] - t[i - 1]) * 10000));
    if (d !== 0) { if (dir !== 0 && d !== dir) n += 1; dir = d; }
  }
  return n;
}

describe('K-5 governor: monotone degradation under sustained overload', () => {
  it('quality only drops (never rises) while frames are sustained over budget', () => {
    // 33ms/frame ~ 30fps, well over the 20ms HIGH watermark.
    const { trace } = runSeq(flat(600, 33));
    expect(nonIncreasing(trace)).toBe(true);
  });
  it('sustained overload drives quality all the way to the floor and PINS it there', () => {
    const { state, trace } = runSeq(flat(1000, 33));
    expect(state.quality).toBeCloseTo(T.QUALITY_FLOOR, 10);
    expect(Math.min(...trace)).toBeGreaterThanOrEqual(T.QUALITY_FLOOR - 1e-12);
  });
  it('degrades FAST, recovers SLOW: first degrade needs fewer frames than first recover', () => {
    // frames-to-first-degrade (N path) under overload vs frames-to-first-recover (M path) under headroom.
    let s = createGovernorState(); let overN = 0;
    while (s.quality === T.QUALITY_CEIL && overN < 10000) { s = observeFrame(s, 33); overN += 1; }
    let r = createGovernorState(); r = { ...r, quality: 0.5 }; let underM = 0;
    while (r.quality === 0.5 && underM < 10000) { r = observeFrame(r, 6); underM += 1; }
    expect(overN).toBeLessThan(underM); // degrade fast < recover slow
    expect(T.DEGRADE_AFTER_FRAMES).toBeLessThan(T.RECOVER_AFTER_FRAMES);
    expect(T.DEGRADE_STEP).toBeGreaterThan(T.RECOVER_STEP);
  });
});

describe('K-5 governor: the floor is never crossed and is always in-band', () => {
  it('an extreme, sustained overload never pushes quality below the floor (or negative)', () => {
    const { state, trace } = runSeq(flat(5000, 1000));
    expect(state.quality).toBe(T.QUALITY_FLOOR);
    expect(Math.min(...trace)).toBe(T.QUALITY_FLOOR);
  });
  it('quality stays within [FLOOR, ceiling] at EVERY step of a mixed random-ish ramp', () => {
    // a deterministic pseudo-random mix of load spikes and lulls (no rng: a fixed generator).
    const frames = [];
    let x = 12345;
    for (let i = 0; i < 2000; i++) { x = (1103515245 * x + 12345) & 0x7fffffff; frames.push(4 + (x % 60)); }
    let s = createGovernorState();
    for (const f of frames) {
      s = observeFrame(s, f);
      expect(s.quality).toBeGreaterThanOrEqual(T.QUALITY_FLOOR - 1e-12);
      expect(s.quality).toBeLessThanOrEqual(T.QUALITY_CEIL + 1e-12);
    }
  });
});

describe('K-5 governor: recovery with hysteresis (no ping-pong)', () => {
  it('sustained headroom lifts quality monotonically back to the ceiling', () => {
    const start = { ...createGovernorState(), quality: T.QUALITY_FLOOR };
    const { state, trace } = runSeq(flat(3000, 6), start); // 6ms ~ 166fps, deep headroom
    expect(nonDecreasing(trace)).toBe(true);
    expect(state.quality).toBeCloseTo(T.QUALITY_CEIL, 10);
  });
  it('a signal parked INSIDE the dead-band never changes quality (pure hysteresis)', () => {
    const start = { ...createGovernorState(), quality: 0.6 };
    // 16.7ms sits between LOW (14) and HIGH (20): the EMA settles inside the dead-band.
    const { state, trace } = runSeq(flat(2000, T.FRAME_BUDGET_MS), start);
    expect(state.quality).toBe(0.6);
    expect(new Set(trace).size).toBe(1); // exactly one distinct value: no motion at all
  });
  it('a boundary square-wave does NOT oscillate quality up and down', () => {
    // alternate 10ms / 30ms (mean 20ms, straddling the HIGH watermark): the classic pop trap.
    const frames = []; for (let i = 0; i < 2000; i++) frames.push(i % 2 ? 30 : 10);
    const { trace } = runSeq(frames);
    expect(reversals(trace)).toBeLessThanOrEqual(1); // at most one settle, never a ping-pong
  });
});

describe('K-5 governor: the manual override cap wins (it is a ceiling)', () => {
  it('a LOW cap keeps quality at/under the cap even under deep sustained headroom', () => {
    let s = setQualityCeiling(createGovernorState(), QUALITY_CEILINGS.low);
    expect(s.quality).toBeLessThanOrEqual(QUALITY_CEILINGS.low + 1e-12);
    const { state, trace } = runSeq(flat(3000, 5), s);
    expect(Math.max(...trace)).toBeLessThanOrEqual(QUALITY_CEILINGS.low + 1e-12);
    expect(state.quality).toBeLessThanOrEqual(QUALITY_CEILINGS.low + 1e-12);
  });
  it('lowering the cap while quality is HIGH clamps it down immediately, not a frame later', () => {
    const hi = { ...createGovernorState(), quality: 1.0 };
    const capped = setQualityCeiling(hi, QUALITY_CEILINGS.medium);
    expect(capped.quality).toBe(QUALITY_CEILINGS.medium);
  });
  it('under the cap, the governor STILL degrades below it under load (cap is a ceiling, not a floor)', () => {
    let s = setQualityCeiling(createGovernorState(), QUALITY_CEILINGS.medium);
    const { state } = runSeq(flat(1500, 40), s); // heavy load under a medium cap
    expect(state.quality).toBeLessThan(QUALITY_CEILINGS.medium);
    expect(state.quality).toBeGreaterThanOrEqual(T.QUALITY_FLOOR - 1e-12);
  });
  it('ceilingForMode maps the dial + OVERRIDE_MODES are the four documented caps', () => {
    expect(OVERRIDE_MODES).toEqual(['auto', 'high', 'medium', 'low']);
    expect(ceilingForMode('auto')).toBe(1.0);
    expect(ceilingForMode('high')).toBe(1.0);
    expect(ceilingForMode('medium')).toBe(0.7);
    expect(ceilingForMode('low')).toBe(0.45);
    expect(ceilingForMode('nonsense')).toBe(1.0); // unknown => auto (fail-open to full)
  });
});

describe('K-5 governor: the 2D bird\'s-eye escape hatch (never blank, never a slideshow)', () => {
  it('does NOT trip while quality is above the floor, however bad the frames', () => {
    const { state } = runSeq(flat(T.BIRDS_EYE_FRAMES + 5, 25)); // over budget but not yet floored
    // early frames are above floor, so the hatch must not have engaged during them
    expect(state.birdsEye === false || state.quality <= T.QUALITY_FLOOR + 1e-9).toBe(true);
  });
  it('trips only after the floor is reached AND frames stay past the bird\'s-eye watermark', () => {
    const { state } = runSeq(flat(4000, 60)); // 60ms > 40ms trip; long enough to floor then trip
    expect(state.quality).toBe(T.QUALITY_FLOOR);
    expect(state.birdsEye).toBe(true);
  });
  it('clears the escape hatch once the EMA recovers under the clear watermark', () => {
    const tripped = runSeq(flat(4000, 60)).state;
    expect(tripped.birdsEye).toBe(true);
    const { state } = runSeq(flat(500, 8), tripped); // headroom returns
    expect(state.birdsEye).toBe(false);
  });
});

describe('K-5 governor: the continuous fidelity ladder (best-value-retained-first, in doc order)', () => {
  it('at full quality every rung is at max fidelity; at the floor it is massing-only', () => {
    const top = ladderFor(1.0);
    expect(top.resScale).toBe(1.0);
    expect(top.contact).toBe(true);
    expect(top.lodBias).toBe(0);
    expect(top.ink).toBe(true);
    expect(top.cullScale).toBe(1.0);
    expect(top.massingOnly).toBe(false);
    const floor = ladderFor(T.QUALITY_FLOOR);
    expect(floor.massingOnly).toBe(true);
    expect(floor.lodBias).toBe(2); // deepest LOD bias -> silhouettes
    expect(floor.ink).toBe(false);
    expect(floor.resScale).toBeCloseTo(0.6, 6);
  });
  it('the ladder is monotone in quality (resScale/cullScale up, lodBias down) across the range', () => {
    let prev = null;
    for (let q = T.QUALITY_FLOOR; q <= 1.0 + 1e-9; q += 0.01) {
      const L = ladderFor(q);
      if (prev) {
        expect(L.resScale).toBeGreaterThanOrEqual(prev.resScale - 1e-9);
        expect(L.cullScale).toBeGreaterThanOrEqual(prev.cullScale - 1e-9);
        expect(L.lodBias).toBeLessThanOrEqual(prev.lodBias);
      }
      prev = L;
    }
  });
  it('resolution sheds FIRST (cheapest big win): it drops before the ink pass turns off', () => {
    // just below full, resolution is already reduced while ink is still on.
    const near = ladderFor(0.9);
    expect(near.resScale).toBeLessThan(1.0);
    expect(near.ink).toBe(true);
  });
});

describe('settlement-scene governor: renderer actuation is explicit', () => {
  it('maps every ladder rung into concrete renderer vocabulary', () => {
    expect(actuationPlanFor(1.0)).toEqual({
      quality: 1.0,
      renderScale: 1.0,
      lodBias: 0,
      contactShadows: true,
      creaseInk: true,
      cullScale: 1.0,
      massingOnly: false,
      fallback: 'scene3d',
    });

    const floor = actuationPlanFor(T.QUALITY_FLOOR);
    expect(floor).toMatchObject({
      quality: T.QUALITY_FLOOR,
      lodBias: 2,
      contactShadows: false,
      creaseInk: false,
      cullScale: 0,
      massingOnly: true,
      fallback: 'scene3d',
    });
  });

  it('turns sustained floor overload into an actual plan2d presentation instruction', () => {
    const tripped = runSeq(flat(4000, 60)).state;
    const plan = actuationPlanFor(tripped);
    expect(tripped.birdsEye).toBe(true);
    expect(plan.fallback).toBe('plan2d');
    expect(Object.isFrozen(plan)).toBe(true);
  });

  it('fails neutral on malformed sensor values instead of poisoning state with NaN', () => {
    let state = createGovernorState();
    for (const frame of [Number.NaN, Number.POSITIVE_INFINITY, 0, -10]) {
      state = observeFrame(state, frame);
    }
    expect(Number.isFinite(state.ema)).toBe(true);
    expect(state.quality).toBe(1);
    expect(ladderFor(Number.NaN)).toEqual(ladderFor(1));
    expect(actuationPlanFor({
      ...state,
      quality: Number.NaN,
      ceiling: QUALITY_CEILINGS.low,
    }).quality).toBe(QUALITY_CEILINGS.low);
  });
});

describe('K-5 governor: determinism (pure sense->decide, no clock/rng)', () => {
  it('the same synthetic sequence yields the identical trajectory every run', () => {
    const seq = [12, 40, 9, 33, 33, 7, 50, 16, 16, 60, 6, 6, 6];
    const a = runSeq(seq).trace;
    const b = runSeq(seq).trace;
    expect(a).toEqual(b);
  });
});

describe('the import-free exhibit mirror stays behaviorally identical to the canonical governor', () => {
  it('exports the exact same public vocabulary and tuning data', () => {
    expect(Object.keys(exhibitGovernor).sort()).toEqual(
      Object.keys(canonicalGovernor).sort(),
    );
    expect(exhibitGovernor.GOVERNOR_TUNING).toEqual(GOVERNOR_TUNING);
    expect(exhibitGovernor.QUALITY_CEILINGS).toEqual(QUALITY_CEILINGS);
    expect(exhibitGovernor.OVERRIDE_MODES).toEqual(OVERRIDE_MODES);
  });

  it('produces identical states, ladders, ceilings, and actuation plans', () => {
    const frames = [
      ...flat(500, 60),
      ...flat(120, 16.7),
      Number.NaN,
      Number.POSITIVE_INFINITY,
      0,
      -10,
      ...flat(800, 6),
    ];
    let canonical = canonicalGovernor.createGovernorState();
    let exhibit = exhibitGovernor.createGovernorState();

    canonical = canonicalGovernor.setQualityCeiling(
      canonical,
      canonicalGovernor.ceilingForMode('medium'),
    );
    exhibit = exhibitGovernor.setQualityCeiling(
      exhibit,
      exhibitGovernor.ceilingForMode('medium'),
    );
    for (const frame of frames) {
      canonical = canonicalGovernor.observeFrame(canonical, frame);
      exhibit = exhibitGovernor.observeFrame(exhibit, frame);
      expect(exhibit).toEqual(canonical);
      expect(exhibitGovernor.ladderFor(exhibit.quality)).toEqual(
        canonicalGovernor.ladderFor(canonical.quality),
      );
      expect(exhibitGovernor.actuationPlanFor(exhibit)).toEqual(
        canonicalGovernor.actuationPlanFor(canonical),
      );
    }

    for (let quality = -0.25; quality <= 1.25; quality += 0.01) {
      expect(exhibitGovernor.ladderFor(quality)).toEqual(
        canonicalGovernor.ladderFor(quality),
      );
      expect(exhibitGovernor.actuationPlanFor(quality)).toEqual(
        canonicalGovernor.actuationPlanFor(quality),
      );
    }
    for (const mode of [...OVERRIDE_MODES, 'unknown']) {
      expect(exhibitGovernor.ceilingForMode(mode)).toBe(
        canonicalGovernor.ceilingForMode(mode),
      );
    }
  });
});

describe('K-5 governor: E-A FLOOR PLANT (isolation-proven -- the floor assertion is not vacuous)', () => {
  // A deliberately-broken copy of the decision step WITHOUT the floor clamp. If the floor-invariant
  // test could pass against this mutant, the real test would be vacuous. It must NOT: the mutant
  // crosses the floor on the very sequence the real step holds. (E-A: plant a mutation, prove it dies.)
  function observeFrameNoFloor(state, frameMs) {
    const ema = state.ema + T.EMA_ALPHA * (frameMs - state.ema);
    let quality = state.quality, overFrames = state.overFrames;
    if (ema > T.HIGH_WATERMARK_MS) overFrames += 1; else overFrames = 0;
    if (overFrames >= T.DEGRADE_AFTER_FRAMES) { quality = Math.round((quality - T.DEGRADE_STEP) * 10000) / 10000; overFrames = 0; }
    // BUG (the plant): no clamp to [FLOOR, ceiling] -- quality free-falls past the floor.
    return { ...state, ema, quality, overFrames };
  }
  const overload = flat(1000, 33);

  it('the REAL step holds the floor on the overload sequence', () => {
    let s = createGovernorState();
    let min = s.quality;
    for (const f of overload) { s = observeFrame(s, f); if (s.quality < min) min = s.quality; }
    expect(min).toBeGreaterThanOrEqual(T.QUALITY_FLOOR - 1e-12);
  });
  it('the PLANTED mutant (no floor clamp) crosses the floor on the SAME sequence -- so the pin has teeth', () => {
    let s = createGovernorState();
    let min = s.quality;
    for (const f of overload) { s = observeFrameNoFloor(s, f); if (s.quality < min) min = s.quality; }
    expect(min).toBeLessThan(T.QUALITY_FLOOR); // the mutant is caught: the floor invariant is real
  });
});
