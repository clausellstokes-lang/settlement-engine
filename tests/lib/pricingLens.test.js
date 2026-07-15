/**
 * tests/lib/pricingLens.test.js — the lightweight, deterministic, privacy-light
 * lens inference (UX Phase 9, plan §3.3).
 */

import { describe, it, expect } from 'vitest';
import {
  inferPricingLens,
  lensDefaultAltitude,
  lensMomentReason,
} from '../../src/lib/pricingLens.js';

describe('inferPricingLens', () => {
  it('defaults to "new" for an empty / default signal bag', () => {
    expect(inferPricingLens()).toBe('new');
    expect(inferPricingLens({})).toBe('new');
    expect(inferPricingLens({ chosenSize: 'town' })).toBe('new');
  });

  it('treats opening the map as the strongest worldbuilder tell', () => {
    expect(inferPricingLens({ openedMap: true })).toBe('worldbuilder');
    expect(inferPricingLens({ chosenSize: 'thorp', openedMap: true })).toBe('worldbuilder');
  });

  it('treats slider use OR a big size as intermediate (hands-on, map unopened)', () => {
    expect(inferPricingLens({ touchedSliders: true })).toBe('intermediate');
    expect(inferPricingLens({ chosenSize: 'city' })).toBe('intermediate');
    expect(inferPricingLens({ chosenSize: 'metropolis' })).toBe('intermediate');
  });

  it('is deterministic — identical signals always yield the same lens', () => {
    const sig = { chosenSize: 'city', touchedSliders: false, openedMap: false };
    const a = inferPricingLens(sig);
    const b = inferPricingLens(sig);
    expect(a).toBe(b);
    expect(a).toBe('intermediate');
  });
});

describe('lensDefaultAltitude', () => {
  it('maps each lens to its default progressive-disclosure rung', () => {
    expect(lensDefaultAltitude('new')).toBe('guided');
    expect(lensDefaultAltitude('intermediate')).toBe('standard');
    expect(lensDefaultAltitude('worldbuilder')).toBe('expert');
  });

  it('falls back to guided for an unknown lens', () => {
    expect(lensDefaultAltitude('???')).toBe('guided');
  });
});

describe('lensMomentReason', () => {
  it('maps a concrete system reach to its moment reason', () => {
    expect(lensMomentReason('advance')).toBe('first_advance_attempt');
    expect(lensMomentReason('war')).toBe('war_layer_curiosity');
    expect(lensMomentReason('pantheon')).toBe('pantheon_preview');
    expect(lensMomentReason('realm')).toBe('map_realm_teaser');
  });

  it('a worldbuilder with no concrete system gets the realm teaser; others get nothing', () => {
    expect(lensMomentReason(undefined, 'worldbuilder')).toBe('map_realm_teaser');
    expect(lensMomentReason(undefined, 'new')).toBe('');
    expect(lensMomentReason('nonsense', 'intermediate')).toBe('');
  });
});
