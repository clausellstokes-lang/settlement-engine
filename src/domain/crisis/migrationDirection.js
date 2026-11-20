/**
 * domain/crisis/migrationDirection.js — THE ONE DIRECTION OF A MASS MIGRATION, AS THE CENSUS SAYS IT
 * (lane RUNG2-F13, 2026-11-04; docs/SOAK_10000_RUNG2_2026-11-04.md §3c).
 *
 * MERGE-R2 (2026-11-07, the chair's ruling 1 at the rung-2 merge; WIRING-RULINGS R-W7 (e)): the
 * direction is written ONCE, at the draw, as `stress[].direction` ∈ {'arrivals', 'departures'}
 * (`stressGenerator.js :: buildStressEntry`; domain/migrationDirection.js). This module no longer
 * derives a direction of its own (its catalog read is retired); it READS that field and answers in
 * the census's words (`influx` | `exodus`, the `migration: …` fact vocabulary), so every census
 * caller keeps working. An entry without the field answers what it answered before: influx, the
 * ruled default (ODQ §934.101). A record that carries the census's own words is read as it says.
 *
 * Pure.
 */

import { migrationDirectionOfEntry } from '../migrationDirection.js';

/** @typedef {'influx' | 'exodus'} MigrationDirection */

/** The direction an entry without the field reads as: the ruled influx (ODQ §934.101). */
export const DEFAULT_MIGRATION_DIRECTION = /** @type {MigrationDirection} */ ('influx');

/**
 * The direction of a mass migration, in the census's words: W0's field read (`departures` →
 * exodus, `arrivals` → influx), else influx.
 * @param {{ direction?: unknown } | null | undefined} entry
 * @returns {MigrationDirection}
 */
export function migrationDirectionOf(entry) {
  const own = entry?.direction;
  if (own === 'influx' || own === 'exodus') return own;
  return migrationDirectionOfEntry({ type: 'mass_migration', direction: own }) === 'departures' ? 'exodus' : DEFAULT_MIGRATION_DIRECTION;
}
