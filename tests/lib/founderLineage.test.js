/**
 * tests/lib/founderLineage.test.js — the fail-closed seat-lineage skeleton
 * (THE FOUNDER LANE).
 *
 * buildSeatLineage is what makes the /founders page render the dignified
 * all-unclaimed pre-launch state with no backend: it always yields exactly `cap`
 * rows (seat 1..cap), overlaying any live rows and leaving the rest Open. These pins
 * guard that invariant + the isSeatHeld predicate the page renders by.
 */
import { describe, it, expect } from 'vitest';
import { buildSeatLineage, isSeatHeld } from '../../src/lib/founderLineage.js';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';

describe('buildSeatLineage — the fail-closed 1..cap skeleton', () => {
  it('yields exactly cap rows, seat 1..cap ascending, from an empty lineage', () => {
    const seats = buildSeatLineage([]);
    expect(seats).toHaveLength(FOUNDER_SEAT_CAP);
    expect(seats.map((s) => s.seatId)).toEqual(
      Array.from({ length: FOUNDER_SEAT_CAP }, (_, i) => i + 1),
    );
    // Every seat is Open (unheld) with no leaked holder fields.
    expect(seats.every((s) => !isSeatHeld(s))).toBe(true);
    expect(seats.every((s) => s.displayName === undefined)).toBe(true);
  });

  it('tolerates null/undefined lineage (fail-closed to all-Open)', () => {
    expect(buildSeatLineage(null)).toHaveLength(FOUNDER_SEAT_CAP);
    expect(buildSeatLineage(undefined)).toHaveLength(FOUNDER_SEAT_CAP);
    expect(buildSeatLineage(null).every((s) => !isSeatHeld(s))).toBe(true);
  });

  it('overlays a live row onto its seat and leaves the rest Open', () => {
    const lineage = [{ seatId: 3, displayName: 'Alaric', heldSince: '2026-01-01', priorNames: [] }];
    const seats = buildSeatLineage(lineage);
    expect(seats).toHaveLength(FOUNDER_SEAT_CAP);
    const seat3 = seats.find((s) => s.seatId === 3);
    expect(isSeatHeld(seat3)).toBe(true);
    expect(seat3.displayName).toBe('Alaric');
    // Exactly one seat is held; all others stay Open.
    expect(seats.filter(isSeatHeld)).toHaveLength(1);
  });

  it('never adds seats beyond the cap even if given out-of-range rows', () => {
    const lineage = [
      { seatId: 99, displayName: 'Out of range', priorNames: [] },
      { seatId: 1, displayName: 'In range', priorNames: [] },
    ];
    const seats = buildSeatLineage(lineage);
    expect(seats).toHaveLength(FOUNDER_SEAT_CAP);
    expect(seats.some((s) => s.seatId === 99)).toBe(false);
    expect(seats.find((s) => s.seatId === 1).displayName).toBe('In range');
  });
});

describe('isSeatHeld', () => {
  it('is held only when an opted-in display name is present', () => {
    expect(isSeatHeld({ seatId: 1, displayName: 'Named' })).toBe(true);
    expect(isSeatHeld({ seatId: 1 })).toBe(false);
    expect(isSeatHeld({ seatId: 1, displayName: '' })).toBe(false);
    expect(isSeatHeld(null)).toBe(false);
  });
});
