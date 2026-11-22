/**
 * tests/design/organicPosture.test.js — THE THREE-POSTURE MODEL contract
 * (Organic Craft law §10). Pins the derivation: width sets the macro structure,
 * pointer+hover refine an expanded window into DESK vs SPREAD, orientation is a
 * separate axis, and every capability combination resolves to exactly one posture
 * (totality). Nothing here depends on a user-agent — capabilities decide.
 */
import { describe, expect, it } from 'vitest';

import {
  POSTURE, COMPACT_MAX, EXPANDED_MIN, POSTURE_QUERIES,
  derivePosture, readPosture, SSR_POSTURE,
} from '../../src/design/organic/posture.js';

const desktop = { width: 1440, finePointer: true, canHover: true, landscape: true };
const tabletLandscape = { width: 1180, finePointer: false, canHover: false, landscape: true };
const tabletPortrait = { width: 820, finePointer: false, canHover: false, landscape: false };
const phone = { width: 390, finePointer: false, canHover: false, landscape: false };
const bigTouch = { width: 1400, finePointer: false, canHover: false, landscape: true }; // large touch tablet
const splitDesktop = { width: 500, finePointer: true, canHover: true, landscape: true }; // desktop window in split view

describe('derivePosture — width sets macro structure', () => {
  it('compact window → FIELD', () => {
    expect(derivePosture(phone)).toBe(POSTURE.FIELD);
    expect(derivePosture(splitDesktop)).toBe(POSTURE.FIELD); // classify the window, not the device
  });
  it('medium window → SPREAD', () => {
    expect(derivePosture(tabletPortrait)).toBe(POSTURE.SPREAD);
    expect(derivePosture(tabletLandscape)).toBe(POSTURE.SPREAD);
  });
  it('expanded window: fine pointer + hover → DESK', () => {
    expect(derivePosture(desktop)).toBe(POSTURE.DESK);
  });
  it('expanded window: coarse / hover-less pointer → SPREAD (a big touch tablet is not a desk)', () => {
    expect(derivePosture(bigTouch)).toBe(POSTURE.SPREAD);
  });
});

describe('derivePosture — totality + thresholds', () => {
  it('returns exactly one of the three postures for every combination', () => {
    const widths = [0, COMPACT_MAX - 1, COMPACT_MAX, EXPANDED_MIN - 1, EXPANDED_MIN, 4000];
    for (const width of widths)
      for (const finePointer of [true, false])
        for (const canHover of [true, false]) {
          const p = derivePosture({ width, finePointer, canHover });
          expect(Object.values(POSTURE)).toContain(p);
        }
  });
  it('the thresholds are inclusive-below / inclusive-at as documented', () => {
    expect(derivePosture({ width: COMPACT_MAX - 1, finePointer: true, canHover: true })).toBe(POSTURE.FIELD);
    expect(derivePosture({ width: COMPACT_MAX, finePointer: false, canHover: false })).toBe(POSTURE.SPREAD);
    expect(derivePosture({ width: EXPANDED_MIN, finePointer: true, canHover: true })).toBe(POSTURE.DESK);
  });
});

describe('readPosture — the full reading', () => {
  it('exposes the posture booleans and orientation as a separate axis', () => {
    const r = readPosture(tabletLandscape);
    expect(r.isSpread).toBe(true);
    expect(r.isDesk).toBe(false);
    expect(r.orientation).toBe('landscape');
    const p = readPosture(tabletPortrait);
    expect(p.orientation).toBe('portrait');
    expect(p.isSpread).toBe(true); // same posture, different composition axis
  });
  it('is frozen and carries the raw affordance axes', () => {
    const r = readPosture(desktop);
    expect(Object.isFrozen(r)).toBe(true);
    expect(r.canHover).toBe(true);
    expect(r.finePointer).toBe(true);
  });
});

describe('SSR default + query surface', () => {
  it('the SSR default is the DESK (never ship the compressed field layout unmeasured)', () => {
    expect(SSR_POSTURE.isDesk).toBe(true);
  });
  it('declares the five capability queries a live environment supplies', () => {
    expect(Object.keys(POSTURE_QUERIES).sort())
      .toEqual(['canHover', 'expandedUp', 'finePointer', 'landscape', 'mediumUp']);
    expect(POSTURE_QUERIES.finePointer).toContain('any-pointer');
    expect(POSTURE_QUERIES.canHover).toContain('any-hover');
  });
});
