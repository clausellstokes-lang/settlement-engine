/**
 * domain/facts/famine.js — THE FAMINE HOME (CENSUS-1 wave 0, fact 6; the design's §1 row "food
 * state", Appendix A competing reading 6: three famine rules).
 *
 * ONE RULE: `foodSurplus.js :: recordAllowsStarving` — a line that says people are starving holds
 * only where the food record's band is 'deficit' or 'famine'. Its readers before this home:
 *   hook-truth — the band LABEL in {famine, deficit} AND the months low; the label and the band
 *     agree on every born record (soak1k-0..1999 measured, 2026-11-04), so the label half is this
 *     rule, and the months half is the stores atom (`facts/storesMonths.js`), read beside it.
 *   A-01 — its own `band !== 'famine' && gap < 20`, which let a deficit place with a gap under 20%
 *     read as "fed" (it differs from the rule on 55 of those 2,000 records).
 *
 * A record with no food record keeps the legacy answer: its band label when it carries one,
 * otherwise the line is allowed (an unknown band refuses nothing).
 *
 * Pure: no randomness, no clock.
 */
import { FOOD_SECURITY_BANDS } from '../../data/bandLadders.js';
import { recordAllowsStarving } from '../foodSurplus.js';

const HUNGRY_LABELS = new Set([FOOD_SECURITY_BANDS.famine.label, FOOD_SECURITY_BANDS.deficit.label]);

/**
 * The fields the famine home reads: the food record (its band, as `recordAllowsStarving` takes it)
 * and the food security block's legacy band label.
 * @typedef {{
 *   economicState?: {
 *     foodSecurity?: { foodRecord?: Parameters<typeof recordAllowsStarving>[0], label?: unknown } | null,
 *   } | null,
 * } | null | undefined} FamineRecord
 */

/**
 * THE ONE READER.
 * @param {unknown} record a settlement record (read as a `FamineRecord`)
 * @returns {Readonly<{ band: string|null, known: boolean, starvingAllowed: boolean, famine: boolean }>}
 */
export function famineOf(record) {
  const fs = /** @type {FamineRecord} */ (record)?.economicState?.foodSecurity;
  const foodRecord = fs?.foodRecord && typeof fs.foodRecord === 'object' ? fs.foodRecord : null;
  const label = typeof fs?.label === 'string' && fs.label !== '' ? fs.label : null;
  const band = typeof foodRecord?.band === 'string' ? foodRecord.band : null;
  const starvingAllowed = foodRecord ? recordAllowsStarving(foodRecord) : (label === null || HUNGRY_LABELS.has(label));
  return Object.freeze({
    band,
    known: foodRecord !== null || label !== null,
    starvingAllowed,
    famine: band === 'famine' || label === FOOD_SECURITY_BANDS.famine.label,
  });
}
