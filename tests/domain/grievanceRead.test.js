/**
 * grievanceRead.test.js — DEEP COUPLINGS D-7a leaf pins (design §10.5).
 *
 * The pure memory-weave substrate read: the scoreGrievance clone (resentment +
 * memoryScore), the scoreRevanchism clone (the decade clock over typed
 * recentIncidents, extended to catch the ghost-event marks), and the combined
 * grievanceLean the D-4 fixation term multiplies. Pure, flag-free, dormancy-neutral.
 */
import { describe, it, expect } from 'vitest';
import {
  GRIEVANCE_READ_TUNING, scoreGrievanceLean, scoreRevanchismLean, grievanceLean,
} from '../../src/domain/worldPulse/grievanceRead.js';

const T = GRIEVANCE_READ_TUNING;

describe('D-7a grievanceRead — the grievance component (scoreGrievance clone)', () => {
  it('an absent / empty edge scores 0 (a pair with no history stays rational)', () => {
    expect(scoreGrievanceLean(null)).toBe(0);
    expect(scoreGrievanceLean(undefined)).toBe(0);
    expect(scoreGrievanceLean({})).toBe(0);
    expect(grievanceLean(null, 100)).toBe(0);
  });
  it('blends resentment (0.65) and memoryScore (0.35) — never the coarse rung', () => {
    // Only resentment fields are read; a relationshipType/rung is ignored.
    expect(scoreGrievanceLean({ resentment: 1, memoryScore: 0, relationshipType: 'hostile' }))
      .toBeCloseTo(T.GRIEVANCE_RESENTMENT_W, 10);
    expect(scoreGrievanceLean({ resentment: 0, memoryScore: 1 }))
      .toBeCloseTo(T.GRIEVANCE_MEMORY_W, 10);
    expect(scoreGrievanceLean({ resentment: 1, memoryScore: 1 })).toBe(1);
  });
});

describe('D-7a grievanceRead — the revanchism component (the decade clock)', () => {
  const RESENT = { resentment: 0.9 };
  it('no wound under the resentment floor scores 0 (no grudge, no revanche)', () => {
    const below = { resentment: T.REVANCHISM_RESENTMENT_FLOOR - 0.01, recentIncidents: [{ type: 'war', tick: 0 }] };
    expect(scoreRevanchismLean(below, 100)).toBe(0);
  });
  it('counts only OLD typed wounds (>= REVANCHISM_MIN_AGE_TICKS)', () => {
    const fresh = { ...RESENT, recentIncidents: [{ type: 'war', tick: 98 }] };
    const old = { ...RESENT, recentIncidents: [{ type: 'war', tick: 90 }] };
    expect(scoreRevanchismLean(fresh, 100)).toBe(0); // age 2 < 8
    expect(scoreRevanchismLean(old, 100)).toBeGreaterThan(0); // age 10 >= 8
  });
  it('CATCHES the ghost-event marks (route_seized ⇒ /seiz/, rite_imposed ⇒ /impos/)', () => {
    const seized = { ...RESENT, recentIncidents: [{ type: 'route_seized', tick: 80 }] };
    const imposed = { ...RESENT, recentIncidents: [{ type: 'rite_imposed', tick: 80 }] };
    const lost = { ...RESENT, recentIncidents: [{ type: 'contest_loss', tick: 80 }] };
    expect(scoreRevanchismLean(seized, 100)).toBeGreaterThan(0);
    expect(scoreRevanchismLean(imposed, 100)).toBeGreaterThan(0);
    expect(scoreRevanchismLean(lost, 100)).toBeGreaterThan(0);
  });
  it('ignores untyped / non-wound incidents (trade_partner chatter is not a wound)', () => {
    const chatter = { ...RESENT, recentIncidents: [{ type: 'trade_partner_normalized', tick: 0 }, { type: 'compelled_alliance', tick: 0 }] };
    expect(scoreRevanchismLean(chatter, 100)).toBe(0);
  });
  it('scales with wound count, gated by resentment, bounded to 1', () => {
    const many = { resentment: 1, recentIncidents: Array.from({ length: 10 }, (_, i) => ({ type: 'raid', tick: i })) };
    expect(scoreRevanchismLean(many, 1000)).toBe(1);
  });
});

describe('D-7a grievanceRead — the combined grievanceLean (the fixation term)', () => {
  it('grievance alone with no old wound equals the grievance component', () => {
    const rel = { resentment: 0.5, memoryScore: 0.2, recentIncidents: [] };
    expect(grievanceLean(rel, 100)).toBeCloseTo(scoreGrievanceLean(rel), 10);
  });
  it('an old held wound deepens the lean beyond fresh resentment (bounded <= 1)', () => {
    const noWound = { resentment: 0.6, memoryScore: 0.3, recentIncidents: [] };
    const withWound = { resentment: 0.6, memoryScore: 0.3, recentIncidents: [{ type: 'conquest', tick: 0 }] };
    expect(grievanceLean(withWound, 100)).toBeGreaterThan(grievanceLean(noWound, 100));
    expect(grievanceLean({ resentment: 1, memoryScore: 1, recentIncidents: Array.from({ length: 8 }, (_, i) => ({ type: 'war', tick: i })) }, 1000)).toBeLessThanOrEqual(1);
  });
  it('is deterministic and pure (same inputs ⇒ same output; no tick side effect)', () => {
    const rel = { resentment: 0.7, memoryScore: 0.4, recentIncidents: [{ type: 'sack', tick: 5 }] };
    expect(grievanceLean(rel, 100)).toBe(grievanceLean(rel, 100));
  });
});
