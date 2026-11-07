/**
 * domain/facts/migration.js — THE MIGRATION-DIRECTION HOME (CENSUS-1 wave 0, fact 9; the design's
 * §1 row "migration direction": no reader on the record before F13).
 *
 * F13 born the direction on the mass-migration entry (`direction: 'influx' | 'exodus'`) and gave
 * it one reader, `crisis/migrationDirection.js :: migrationDirectionOf(entry)`. This home reads it
 * off the RECORD: the crisis home's entries (`facts/crisisKind.js :: crisisEntries`), the first
 * `mass_migration` entry's own direction, else the catalog's, else the ruled influx.
 *
 * ⚠ THE POWER STEP STILL READS THE KIND, NOT THE ENTRY (F13's census debt, left open by CENSUS-1):
 * `governanceNarrative.js` and `stressFactions.js` call `migrationDirectionOf(null)` because the
 * power step is handed `config.stressTypes`, never the entries; at birth the entry is born from the
 * same catalog fact, so they agree, but an authored exodus entry would not be seen there. Handing
 * the entries to the power step is a pipeline change, named in the lane report.
 *
 * Pure: no randomness, no clock.
 */
import { migrationDirectionOf } from '../crisis/migrationDirection.js';
import { crisisEntries } from './crisisKind.js';

/**
 * THE ONE READER.
 * @param {object | null | undefined} record a settlement record
 * @returns {Readonly<{ active: boolean, direction: 'influx'|'exodus'|null }>}
 */
export function migrationOf(record) {
  const entry = crisisEntries(record).find((e) => e.type === 'mass_migration');
  return Object.freeze({ active: !!entry, direction: entry ? migrationDirectionOf(entry) : null });
}
