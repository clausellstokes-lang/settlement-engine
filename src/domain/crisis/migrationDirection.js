/**
 * domain/crisis/migrationDirection.js — THE ONE DIRECTION OF A MASS MIGRATION (lane RUNG2-F13,
 * 2026-11-04; docs/SOAK_10000_RUNG2_2026-11-04.md §3c).
 *
 * A mass migration is an influx or an exodus, and the crisis record says which, once: the
 * entry's `direction`. The chair's ruling 2 of 2026-10-30 (ODQ §934.101) made it an INFLUX
 * everywhere it is named ("receiving more people than its infrastructure was built for"), so
 * that is the kind's direction in the catalog (`STRESS_TYPE_MAP.mass_migration.direction`) and
 * the default for an entry that predates the field. Every migration line reads this reader;
 * none decides a direction of its own.
 *
 * Pure.
 */

import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

/** @typedef {'influx' | 'exodus'} MigrationDirection */

/** The kind's direction when the entry carries none: the catalog's, else the ruled influx. */
export const DEFAULT_MIGRATION_DIRECTION = /** @type {MigrationDirection} */ ('influx');

/**
 * The direction of a mass migration: the entry's own field, else the catalog's, else influx.
 * @param {{ direction?: unknown } | null | undefined} entry
 * @returns {MigrationDirection}
 */
export function migrationDirectionOf(entry) {
  const own = entry?.direction;
  if (own === 'influx' || own === 'exodus') return own;
  const kind = /** @type {{ direction?: unknown }} */ (STRESS_TYPE_MAP.mass_migration || {}).direction;
  return kind === 'exodus' ? 'exodus' : DEFAULT_MIGRATION_DIRECTION;
}
