/**
 * journeyProgress.test.js — the per-surface load→[0,1] mappings are MONOTONE and
 * BOUNDED (owner order 2026-07-22: the video moves only with the progress of the
 * load, and — THE UNIFYING LAW — can never complete before the real thing exists).
 */
import { describe, it, expect } from 'vitest';
import { pipelineStepFraction } from '../../src/components/loadingJourney/journeyProgress.js';
import {
  computeRealmLoadFraction, REALM_CREEP,
} from '../../src/components/loadingJourney/useRealmLoadProgress.js';

describe('pipelineStepFraction — map-generation step progress', () => {
  it('0 before any step, 1 when all complete', () => {
    expect(pipelineStepFraction(0, 12)).toBe(0);
    expect(pipelineStepFraction(6, 12)).toBeCloseTo(0.5, 10);
    expect(pipelineStepFraction(12, 12)).toBe(1);
  });
  it('empty history → 0 (never NaN)', () => {
    expect(pipelineStepFraction(0, 0)).toBe(0);
    expect(pipelineStepFraction(3, 0)).toBe(0);
  });
  it('clamps a runaway index to 1', () => {
    expect(pipelineStepFraction(20, 12)).toBe(1);
  });
  it('is monotone non-decreasing as the index advances', () => {
    let prev = -1;
    for (let i = 0; i <= 17; i++) {
      const f = pipelineStepFraction(i, 17);
      expect(f).toBeGreaterThanOrEqual(prev);
      prev = f;
    }
  });
});

describe('computeRealmLoadFraction — realm/FMG boot creep', () => {
  it('ready snaps to 1 regardless of elapsed', () => {
    expect(computeRealmLoadFraction({ ready: true, elapsedMs: 0 })).toBe(1);
    expect(computeRealmLoadFraction({ ready: true, bridgeReady: true, elapsedMs: 999999 })).toBe(1);
  });

  it('pre-bridge creep starts near 0, rises, and stays under MOUNT_CAP (< BRIDGE_AT)', () => {
    const a = computeRealmLoadFraction({ elapsedMs: 0 });
    const b = computeRealmLoadFraction({ elapsedMs: 3000 });
    const c = computeRealmLoadFraction({ elapsedMs: 60000 });
    expect(a).toBeCloseTo(0, 6);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
    expect(c).toBeLessThan(REALM_CREEP.MOUNT_CAP);
    expect(REALM_CREEP.MOUNT_CAP).toBeLessThan(REALM_CREEP.BRIDGE_AT);
  });

  it('bridgeReady floors at BRIDGE_AT and creeps under BRIDGE_CAP (< 1)', () => {
    const at = computeRealmLoadFraction({ bridgeReady: true, elapsedSinceBridgeMs: 0 });
    const later = computeRealmLoadFraction({ bridgeReady: true, elapsedSinceBridgeMs: 60000 });
    expect(at).toBeCloseTo(REALM_CREEP.BRIDGE_AT, 6);
    expect(later).toBeGreaterThan(at);
    expect(later).toBeLessThan(REALM_CREEP.BRIDGE_CAP);
  });

  it('is monotone across the mount → bridge → ready transition', () => {
    const mountLate = computeRealmLoadFraction({ elapsedMs: 60000 });
    const bridgeStart = computeRealmLoadFraction({ bridgeReady: true, elapsedSinceBridgeMs: 0 });
    const ready = computeRealmLoadFraction({ ready: true });
    expect(bridgeStart).toBeGreaterThan(mountLate);
    expect(ready).toBeGreaterThan(bridgeStart);
  });
});
