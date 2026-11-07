/**
 * NO CRIME WAVE WITHOUT CRIME (lane RUNG1B-F4 unit 3b, 2026-11-04; docs/F4_CRIME_SIGNAL_2026-11-04.md §1).
 *
 * `historyGenerator.js :: buildHistoricalEvent` filled its tension slots from the whole template
 * pool, so a place with no criminal faction and no criminal house could draw `crime_wave`: "the
 * criminal network" in its factions and "A guard captain is on the payroll of the criminal
 * network" in its hooks, printed beside the Defense tab's "No criminal infrastructure has been
 * identified" (soak1k-134, -830, -842: three of A-06's 16). The fill now reads the crime signal's
 * one home and sets the drawn template aside where none exists.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { crimeSignalOf } from '../../src/domain/crimeSignal.js';

describe('the crime-wave tension reads the crime signal', () => {
  beforeAll(async () => { await ensureLaws(); });

  for (const i of [134, 830]) {
    it(`soak1k-${i}: a place with no criminal faction or house tells no crime wave`, () => {
      const { settlement } = birth(i);
      expect(crimeSignalOf({ seats: settlement.powerStructure.factions, estate: settlement.institutions }).present).toBe(false);
      const tensions = settlement.history?.currentTensions || [];
      expect(tensions.filter((t) => /criminal network/i.test(JSON.stringify(t))).map((t) => t.name)).toEqual([]);
      expect(tensions.length).toBeGreaterThan(0);
    });
  }
});
