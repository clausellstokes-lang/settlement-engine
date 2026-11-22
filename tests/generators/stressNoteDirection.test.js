/**
 * R-W7 (e), STYLE-RULINGS §1(b), WAVE-RULINGS item 8 (W5 HIS 2026-11-07): the migration FOUNDING NOTE
 * reads the declared direction. A departures town draws MASS_MIGRATION_DEPARTURE_NOTES; an
 * arrivals town (or a config that does not say) draws STRESS_NOTES.mass_migration. Never one set
 * printed for both.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { genArrivalDetail } from '../../src/generators/narrativeGenerator.js';
import { STRESS_NOTES, MASS_MIGRATION_DEPARTURE_NOTES } from '../../src/data/narrativeData.js';

afterEach(() => clearActiveRng());

const noteOf = (migrationDirection, seed) => (setActiveRng(createPRNG(seed)), genArrivalDetail({
  stressTypes: ['mass_migration'], tradeRouteAccess: 'road', settType: 'town', _seed: seed,
  ...(migrationDirection ? { migrationDirection } : {}),
}).stressNote);

describe('the migration founding note follows stress[].direction', () => {
  it('departures draw the departures set, across seeds', () => {
    for (let i = 0; i < 24; i += 1) expect(MASS_MIGRATION_DEPARTURE_NOTES).toContain(noteOf('departures', `w5-d-${i}`));
  });
  it('arrivals, and a config that does not say, draw the arrivals set', () => {
    for (let i = 0; i < 24; i += 1) {
      expect(STRESS_NOTES.mass_migration).toContain(noteOf('arrivals', `w5-a-${i}`));
      expect(STRESS_NOTES.mass_migration).toContain(noteOf(null, `w5-n-${i}`));
    }
  });
  it('the two sets never share a line, and neither tells the other direction', () => {
    expect(MASS_MIGRATION_DEPARTURE_NOTES.filter((l) => STRESS_NOTES.mass_migration.includes(l))).toEqual([]);
    expect(MASS_MIGRATION_DEPARTURE_NOTES.filter((l) => /arriv|newcomer|crowd/i.test(l))).toEqual([]);
    expect(STRESS_NOTES.mass_migration.filter((l) => /leaving|empty|shuttered/i.test(l))).toEqual([]);
  });
});
