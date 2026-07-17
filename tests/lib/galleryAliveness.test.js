/**
 * galleryAliveness.test.js — pins for the aliveness formula (GALLERY-2 phase 2).
 *
 * The formula is an owner-vetoable JUDGMENT; these pins freeze the shipped
 * numbers so a silent re-weight can't ride in on a refactor:
 *   • weights 0.7 depth / 0.3 age; depth saturates at the worldState
 *     MAX_HISTORY cap (80); the age ladder covers every AGE_BANDS id.
 *   • anchor values (fresh world ≈ 5, year-of-play ≈ 96, saturated old
 *     world = 100).
 *   • null posture: no campaign / no worldState ⇒ null (mirrors at_war's
 *     cannot-recompute rule) — never 0, which would smear "unknown" into
 *     "provably lifeless".
 *   • ALIVENESS_DEPTH_CAP == worldState MAX_HISTORY (drift pin, the
 *     ageBands.js not-imported-on-purpose idiom).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  computeAliveness,
  campaignWorldAgeBand,
  ALIVENESS_DEPTH_CAP,
  ALIVENESS_WEIGHTS,
  ALIVENESS_AGE_SCORES,
} from '../../src/lib/galleryAliveness.js';
import { AGE_BAND_IDS } from '../../src/domain/ageBands.js';

const campaign = (pulses, elapsedWeeks) => ({
  worldState: {
    pulseHistory: Array.from({ length: pulses }, (_, i) => ({ id: `p${i}` })),
    tick: elapsedWeeks,
    calendar: { elapsedWeeks },
  },
});

describe('computeAliveness — the shipped formula (vetoable JUDGMENT, pinned)', () => {
  it('weights are 0.7 depth / 0.3 age and the ladder covers every age band', () => {
    expect(ALIVENESS_WEIGHTS).toEqual({ depth: 0.7, age: 0.3 });
    expect(Object.keys(ALIVENESS_AGE_SCORES).sort()).toEqual([...AGE_BAND_IDS].sort());
  });

  it('depth saturation == the worldState pulseHistory retention cap (MAX_HISTORY)', () => {
    // MAX_HISTORY is deliberately module-private in worldState.js (an engine
    // file this wave must not touch), so pin against the source text — the
    // same not-imported-on-purpose idiom ageBands.js documents.
    const src = readFileSync(resolve(process.cwd(), 'src/domain/worldPulse/worldState.js'), 'utf-8');
    const m = src.match(/const\s+MAX_HISTORY\s*=\s*(\d+)/);
    expect(m, 'MAX_HISTORY not found in worldState.js — re-point this drift pin').toBeTruthy();
    expect(ALIVENESS_DEPTH_CAP).toBe(Number(m[1]));
  });

  it('anchors: fresh world ≈ 5; a year of steady play ≈ 96; saturated years-past world = 100', () => {
    expect(computeAliveness(campaign(0, 1))).toBe(5);       // 0.3·0.15 = 4.5 → 5
    expect(computeAliveness(campaign(80, 52))).toBe(96);    // 70 + 0.3·0.85·100 = 95.5 → 96
    expect(computeAliveness(campaign(80, 200))).toBe(100);  // saturated depth + years-past
  });

  it('history depth DOMINATES: a deep young world outranks a shallow old one', () => {
    const deepYoung = computeAliveness(campaign(80, 10));   // full history, this-season
    const shallowOld = computeAliveness(campaign(5, 500));  // 5 pulses, years-past
    expect(deepYoung).toBeGreaterThan(shallowOld);
  });

  it('age contributes MILDLY but monotonically at fixed depth', () => {
    const scores = [1, 4, 13, 52, 500].map(w => computeAliveness(campaign(40, w)));
    for (let i = 1; i < scores.length; i++) expect(scores[i]).toBeGreaterThan(scores[i - 1]);
    // The whole age sweep at fixed depth spans exactly the 0.3 band (±rounding).
    expect(scores[scores.length - 1] - scores[0]).toBeLessThanOrEqual(26);
  });

  it('clamps: depth beyond the cap and absurd elapsed never exceed 100; malformed shapes read 0-depth', () => {
    expect(computeAliveness(campaign(9999, 99999))).toBe(100);
    expect(computeAliveness({ worldState: { pulseHistory: 'not-an-array', tick: 1, calendar: {} } })).toBe(5);
  });

  it('falls back to worldState.tick when calendar is absent (tick == week)', () => {
    expect(computeAliveness({ worldState: { pulseHistory: [], tick: 52 } }))
      .toBe(computeAliveness(campaign(0, 52)));
  });

  it('NULL posture: no campaign / no worldState ⇒ null, never 0', () => {
    expect(computeAliveness(null)).toBeNull();
    expect(computeAliveness(undefined)).toBeNull();
    expect(computeAliveness({})).toBeNull();
    expect(computeAliveness({ worldState: null })).toBeNull();
  });

  it('is deterministic (same inputs, same score)', () => {
    const c = campaign(37, 29);
    expect(computeAliveness(c)).toBe(computeAliveness(c));
  });
});

describe('campaignWorldAgeBand', () => {
  it('reads the canonical band off calendar.elapsedWeeks (tick fallback), null when unknowable', () => {
    expect(campaignWorldAgeBand(campaign(0, 1))).toBe('this-week');
    expect(campaignWorldAgeBand(campaign(0, 13))).toBe('this-season');
    expect(campaignWorldAgeBand(campaign(0, 500))).toBe('years-past');
    expect(campaignWorldAgeBand({ worldState: { tick: 5 } })).toBe('this-season');
    expect(campaignWorldAgeBand(null)).toBeNull();
    expect(campaignWorldAgeBand({})).toBeNull();
  });
});
