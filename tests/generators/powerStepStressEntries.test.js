/**
 * tests/generators/powerStepStressEntries.test.js — CENSUS-1b unit B: THE POWER STEP READS THE
 * ENTRIES (CENSUS-1's question 3; F13's census debt).
 *
 * `governanceNarrative` and `stressFactions` called `migrationDirectionOf(null)` because the
 * power step received `config.stressTypes`, not the stress entries, so an exodus entry still
 * told an influx. The chair ruled the pipeline change: the step is handed the ENTRIES (through
 * the power intent), and the migration direction is the entry's. At birth every entry carries
 * the catalog's direction, so births do not move (proved on the 525 golden records and sixty soak
 * records hashed before and after; `docs/CENSUS_1B_LANE_2026-11-04.md`).
 *
 * @enforced-by npx vitest run tests/generators/powerStepStressEntries.test.js
 */
import { describe, expect, it } from 'vitest';
import { applyStressEventFactions } from '../../src/generators/power/stressFactions.js';
import { buildGovernanceLabels } from '../../src/generators/power/governanceNarrative.js';
import { createPowerGenerationIntent } from '../../src/generators/power/economyReconciliation.js';
import { createPRNG } from '../../src/kernel/prng.js';

const MIGRATION = (direction) => [{ type: 'mass_migration', direction }];
const ke = (t) => t === 'mass_migration';

describe('unit B: the power step reads the migration direction from the stress entry', () => {
  it('RED-FIRST: an exodus entry mints the departure committee; an influx entry does not', () => {
    const factions = (entries) => {
      const list = [{ faction: 'Town Council', power: 30, isGoverning: true }];
      applyStressEventFactions(list, ke, 'Town Council', false, { priorityEconomy: 5 }, [], entries);
      return list.map((f) => f.faction);
    };
    expect(factions(MIGRATION('exodus'))).toContain('Departure Committee');
    expect(factions(MIGRATION('influx'))).not.toContain('Departure Committee'); // anchored: the same reader mints the committee under exodus on the line above
  });

  it('RED-FIRST: the governance narrative tells the departure under an exodus entry', () => {
    const conflict = (entries) => buildGovernanceLabels({
      factions: [{ faction: 'Town Council', power: 30, isGoverning: true }],
      config: { priorityEconomy: 5 }, stressFlags: {}, instFlags: { economyOutput: 10 }, neighbourRelationship: null,
      instNames: [], priorities: {}, tier: 'town', governingFaction: 'Town Council', hasNobleInstitution: false,
      stressTypes: ['mass_migration'], stressEntries: entries, fallbackStressType: 'mass_migration',
    }).recentConflict;
    expect(conflict(MIGRATION('exodus'))).toMatch(/families left/);
    expect(conflict(MIGRATION('influx'))).not.toMatch(/families left/); // anchored: the same reader tells the departure under exodus on the line above
  });

  it('the intent carries the entries (kind and direction only); a legacy caller carries none', () => {
    const rng = createPRNG('unit-b');
    const intent = createPowerGenerationIntent({ stepRng: rng, tier: 'town', neighbourRelationship: null, config: {}, institutions: [],
      stressEntries: [{ type: 'mass_migration', direction: 'exodus', description: 'x' }, { type: 'famine' }] });
    expect(intent.stressEntries).toEqual([{ type: 'mass_migration', direction: 'exodus' }, { type: 'famine' }]);
    expect(createPowerGenerationIntent({ stepRng: createPRNG('unit-b'), tier: 'town', neighbourRelationship: null, config: {}, institutions: [] }).stressEntries).toBeNull();
  });
});
