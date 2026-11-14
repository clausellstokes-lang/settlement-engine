/**
 * R3-CODE-C (ROUND-3-CUT #1386, MED; the chair's addition of 2026-11-13): rr2s-metropolis-plague_onset-port-1, Systems/
 * Defense printed "Those trying to keep Knockford's sick apart from the healthy are being ignored, and the quarantine
 * holds nowhere." beside the same tab's "The garrison holds the quarantine lines, but not everyone obeys." and the
 * Overview's "A cordon has gone up around one quarter of Knockford". The vantage table's own law (crisisSummaryVantage.js):
 * a line states only what its crisis kind guarantees, and the kind's catalogue says "Quarantine measures are being
 * resisted", never that they hold nowhere.
 */
import { describe, expect, it } from 'vitest';
import { CRISIS_SUMMARY_POOLS } from '../../../src/domain/crisis/crisisSummaryVantage.js';

describe('an outbreak\'s vantages say the quarantine is resisted, never that it holds nowhere (ROUND-3-CUT #1386)', () => {
  const lines = Object.values(CRISIS_SUMMARY_POOLS.plague_onset).flatMap((pool) => Object.values(pool));
  it('no line of the four surfaces says the quarantine holds nowhere', () => {
    expect(lines.length).toBe(16);
    expect(lines.filter((line) => /holds nowhere|nobody keeps|no one keeps/i.test(line))).toEqual([]);
  });
  it('the Defence watch vantage still speaks of the quarantine and those who keep it', () => {
    expect(CRISIS_SUMMARY_POOLS.plague_onset.defence.watch).toMatch(/quarantine/);
  });
});
