/**
 * domain/facts/rosterGrounds.js — THREE COMMON GROUNDS THE ROSTER ALREADY HOLDS AS ROWS (BUILD-CONFLICT, DEPTH-2,
 * 2026-11-20; the chair's leave for three vocabulary atoms, vetoable by the owner, on the veto list as new vocabulary).
 *
 *   waterSourceOf(record)    `water source`: a live 'Water source' or 'Multiple water sources' row stands (the catalogue's
 *                            ladder of the two, `data/institutionLadders.js`: a place with several water sources has one;
 *                            the chair's word of 16:22 UTC, "Water source READS BROADLY")
 *   externalMillOf(record)   `access to external mill`: a live 'Access to external mill' row stands: the households carry
 *                            their grain to a neighbour's mill (`institution: mill` never reads it: an access row is not the
 *                            house standing here, `liveInstitutionNames.js :: ACCESS_ONLY`)
 *   commonGrazingOf(record)  `common grazing land`: a live 'Common grazing land' row stands
 *
 * Each reads the live roster's native names (`liveInstitutionNames.js`, the reading every institution fact uses), so a
 * custom display name moves nothing. Measured at the power step's site (`CONFLICT-MEASURE.md` §3): every thorp and hamlet
 * of hxd-<size>-0..99 names a water source and the access to an external mill, every hamlet and village the common
 * grazing; the cities and metropolises name none of the three by these rows.
 *
 * Layer 1 (over the roster). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/facts/factVocabulary.test.js
 * @enforced-by tests/generators/power/conflictQuarrelPick.test.js
 */
import { liveInstitutionNames } from './liveInstitutionNames.js';

/** @param {unknown} record @param {RegExp} row @returns {boolean | undefined} undefined where there is no record */
const holdsRow = (record, row) => (record && typeof record === 'object'
  ? liveInstitutionNames(/** @type {{ institutions?: unknown }} */ (record)).some((n) => row.test(n.trim()))
  : undefined);

/** THE ONE READER of `water source`. @param {unknown} record @returns {boolean | undefined} */
export const waterSourceOf = (record) => holdsRow(record, /^(?:water source|multiple water sources)$/i);

/** THE ONE READER of `access to external mill`. @param {unknown} record @returns {boolean | undefined} */
export const externalMillOf = (record) => holdsRow(record, /^access to external mill$/i);

/** THE ONE READER of `common grazing land`. @param {unknown} record @returns {boolean | undefined} */
export const commonGrazingOf = (record) => holdsRow(record, /^common grazing land$/i);
