/**
 * domain/migrationDirection.js — THE MIGRATION DIRECTION, DECLARED ONCE (lane WIRING-W0, 2026-11-07;
 * the chair's ruling R-W7 (e), docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md, on the
 * wiring inventory's owner finding 1). Pure; no imports.
 *
 * THE DEFECT IT ENDS. A `mass_migration` crisis was told three ways: the crisis text and the
 * pressure line (the Tonight opening when no crisis line exists) always said ARRIVALS, while the
 * Power vignette (`governanceNarrative.js :: buildMigrationNarrative`) said DEPARTURES whenever
 * the institution economy scored under 50 — 45 of the 71 migration places in the soak 1,000 read
 * "Three families left this week" beside "receiving more people than its infrastructure was
 * built for" (`coh:migration-direction`, scripts/audit/soak-review/checks.mjs).
 *
 * THE ONE FACT. `stress[].direction` ∈ {'arrivals', 'departures'}, on the `mass_migration` entry
 * only, written ONCE by `stressGenerator.js :: buildStressEntry` where the stressor is drawn.
 * Every surface that says which way people move reads it, never a score of its own:
 *   - the crisis text (`stressNarrative.js`), the record's `viabilityNote` half;
 *   - the pressure line (`narrativeText.js`), the Power vignette and the stability label
 *     (`governanceNarrative.js`), the newcomers' faction (`power/stressFactions.js`);
 *   - the crisis secret pool (`stressInstitutionEffects.js`, filtered in `npcGenerator.js`);
 *   - the spine strain phrase (`simulationSpine.js`);
 *   - the food multiplier (`foodGenerator.js`, `economy/foodBalance.js`): more mouths on arrivals.
 * Readers that hold only the resolved config read the PROJECTION `config.migrationDirection`,
 * stamped from the confirmed stress container by `steps/stressConfirmPass.js` beside
 * `config.stressTypes` (the same projection the types already ride; a derived key,
 * DERIVED_CONFIG_KEYS).
 *
 * THE ONE RULE, AND WHY IT IS NOT THE ECONOMY. At birth the direction is ARRIVALS. The stressor is
 * drawn at step 4 (`resolveStress`), before any institution or economy exists, so the
 * `economyOutput >= 50` test the Power vignette used cannot be read where the stressor is drawn;
 * reading it later, at the power step, would be a second writer. Arrivals is also the direction
 * chair ruling 2 already declared for every surface (2026-10-30, ODQ §934.101: "mass migration is
 * an INFLUX everywhere it is named"), and the direction every mechanic already assumes (the food
 * multiplier, prosperity, the safety and NPC pools). A DEPARTURES record is reachable only by a
 * record that declares it (an authored entry, or the campaign's re-derive from the migration
 * ledger, which is the simulation's and waits on FPZ); every reader above has its departures text.
 */

/** The two directions a mass migration can run. */
export const MIGRATION_DIRECTIONS = Object.freeze(['arrivals', 'departures']);

/** The one rule at birth (see the header): a drawn mass migration is an arrival. */
export const MIGRATION_DIRECTION_AT_BIRTH = 'arrivals';

/**
 * The direction one stress entry carries. A `mass_migration` entry without a valid direction
 * (an authored entry, a record saved before this field) reads as arrivals, the §934.101 default.
 * @param {unknown} entry @returns {'arrivals'|'departures'|null} null when the entry is not a migration
 */
export function migrationDirectionOfEntry(entry) {
  const row = /** @type {{ type?: unknown, direction?: unknown } | null} */ (entry && typeof entry === 'object' ? entry : null);
  if (!row || row.type !== 'mass_migration') return null;
  return row.direction === 'departures' ? 'departures' : 'arrivals';
}

/**
 * The direction a settlement's stress container carries (bare object or array), or null.
 * @param {unknown} stress @returns {'arrivals'|'departures'|null}
 */
export function migrationDirectionOfStress(stress) {
  const rows = Array.isArray(stress) ? stress : stress ? [stress] : [];
  for (const row of rows) {
    const direction = migrationDirectionOfEntry(row);
    if (direction) return direction;
  }
  return null;
}

/**
 * The direction a resolved config carries: its projection, read only when the config's stress
 * types hold a mass migration (a stale projection on a config without one is not a migration).
 * @param {{ stressTypes?: unknown, stressType?: unknown, migrationDirection?: unknown } | null | undefined} config
 * @returns {'arrivals'|'departures'|null}
 */
export function migrationDirectionOfConfig(config) {
  const types = Array.isArray(config?.stressTypes) ? config.stressTypes : config?.stressType ? [config.stressType] : [];
  if (!types.includes('mass_migration')) return null;
  return config?.migrationDirection === 'departures' ? 'departures' : 'arrivals';
}
