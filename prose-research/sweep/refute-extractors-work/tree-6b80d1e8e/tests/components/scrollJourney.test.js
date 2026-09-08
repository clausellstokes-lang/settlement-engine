/**
 * scrollJourney.test.js — THE SCROLL DRIVER's pure core (Slice C2, THE WELCOME).
 *
 * The Welcome's travel-and-stop film reuses the SHARED leg projection
 * (projectLegFrame) and adds only the pure scroll→progress map
 * (computeScrollProgress, the reference marketing/website/src/main.js `apply()`
 * made deterministic). These pin both: the shared projection lands stops on their
 * crisp still, and the scroll map judges by viewport centre — scrubbing inside a
 * leg, freezing between legs.
 */
import { describe, it, expect } from 'vitest';
import { projectLegFrame } from '../../src/components/loadingJourney/useJourneyConductor.js';
import { computeScrollProgress } from '../../src/components/loadingJourney/useScrollJourney.js';

describe('projectLegFrame — the shared leg-scrub projection', () => {
  it('progress 0 sits on the desk still (stop 0), leg 0 unscrubbed', () => {
    expect(projectLegFrame(0, 6)).toEqual({ progress: 0, currentLeg: 0, legT: 0, floorStill: 0 });
  });
  it('a stop boundary lands crisply on that stop still (legT 0)', () => {
    // p = 1/6 → the mouth of leg 2 = the thorp stop (still 1).
    expect(projectLegFrame(1 / 6, 6)).toEqual({ progress: 1 / 6, currentLeg: 1, legT: 0, floorStill: 1 });
  });
  it('the near stop is the floor in the first half of a leg', () => {
    const f = projectLegFrame(1 / 6 + 1 / 6 * 0.25, 6); // 25% into leg 2
    expect(f.currentLeg).toBe(1);
    expect(f.legT).toBeCloseTo(0.25, 6);
    expect(f.floorStill).toBe(1); // legT < 0.5 → near stop
  });
  it('the far stop is the floor in the second half of a leg', () => {
    const f = projectLegFrame(1 / 6 + 1 / 6 * 0.75, 6); // 75% into leg 2
    expect(f.currentLeg).toBe(1);
    expect(f.floorStill).toBe(2); // legT >= 0.5 → far stop
  });
  it('progress 1 lands finished on the ordered-tier still (legsToPlay)', () => {
    expect(projectLegFrame(1, 6)).toEqual({ progress: 1, currentLeg: 5, legT: 1, floorStill: 6 });
  });
  it('clamps out-of-range progress to [0,1]', () => {
    expect(projectLegFrame(-3, 6).progress).toBe(0);
    expect(projectLegFrame(9, 6).progress).toBe(1);
    expect(projectLegFrame(9, 6).floorStill).toBe(6);
  });
  it('degenerate leg counts never divide by zero', () => {
    expect(projectLegFrame(0.5, 0)).toEqual({ progress: 0.5, currentLeg: 0, legT: 0.5, floorStill: 1 });
  });
});

describe('computeScrollProgress — scroll position → journey progress', () => {
  const LEGS = 6;
  const VH = 800;
  // Six 1000px legs with a 1000px stop section after each (leg i at 2000*i).
  const ranges = Array.from({ length: LEGS }, (_, i) => ({ i, top: i * 2000, bottom: i * 2000 + 1000 }));
  // Judge by viewport centre: choose scrollY so the centre (scrollY + VH/2) = y.
  const atCentre = (y) => computeScrollProgress(ranges, LEGS, y - VH / 2, VH);

  it('before the first leg → progress 0 (still on the desk/hero)', () => {
    expect(atCentre(-500)).toBe(0);
  });
  it('mid-first-leg scrubs proportionally', () => {
    // centre halfway through leg 0 → (0 + 0.5)/6.
    expect(atCentre(500)).toBeCloseTo(0.5 / 6, 6);
  });
  it('between legs FREEZES at the stop just passed (no film time)', () => {
    // centre in the gap after leg 0 → stopsPassed 1 → 1/6, exactly the thorp stop.
    expect(atCentre(1500)).toBeCloseTo(1 / 6, 6);
  });
  it('deep in a later leg reflects the legs already passed', () => {
    // centre halfway through leg 3 → (3 + 0.5)/6.
    expect(atCentre(3 * 2000 + 500)).toBeCloseTo(3.5 / 6, 6);
  });
  it('past every leg → progress 1 (the metropolis stop)', () => {
    expect(atCentre(50_000)).toBe(1);
  });
  it('the whole map composes with the shared projection to a crisp stop', () => {
    // In the gap after leg 4 → 5/6 → the city stop still (5).
    const p = atCentre(4 * 2000 + 1500);
    expect(projectLegFrame(p, LEGS).floorStill).toBe(5);
  });
});
