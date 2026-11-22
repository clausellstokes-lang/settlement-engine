/**
 * advanceTicksDrift.test.js — the drift pin for the advance-session progress seed.
 *
 * useAdvanceSession.js keeps a LOCAL copy of the interval→week-count table
 * (ADVANCE_TICKS) so the hook can seed the progress bar's "of Y" total without
 * importing the heavy, lazy-loaded worldPulse domain module (which would drag
 * simulationRules/clock/clone into the hook's chunk and threaten the first-paint
 * budget). A local copy can drift — and it DID: the 48→52 / 12→13 calendar change
 * (4-4-5 grid) left this table on the old 48-week year. This pin asserts the copy
 * equals the single-source domain table so that class of drift is caught at CI.
 */
import { describe, it, expect } from 'vitest';
import { ADVANCE_TICKS } from '../../src/hooks/useAdvanceSession.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/worldState.js';

describe('ADVANCE_TICKS drift pin', () => {
  it('mirrors the single-source domain INTERVAL_WEEKS exactly', () => {
    expect({ ...ADVANCE_TICKS }).toEqual({ ...INTERVAL_WEEKS });
  });

  it('encodes the committed 4-4-5 calendar (13-week seasons, 52-week years)', () => {
    expect(ADVANCE_TICKS.one_week).toBe(1);
    expect(ADVANCE_TICKS.one_month).toBe(4);
    expect(ADVANCE_TICKS.one_season).toBe(13);
    expect(ADVANCE_TICKS.one_year).toBe(52);
  });
});
