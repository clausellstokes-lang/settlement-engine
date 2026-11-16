/**
 * domain/facts/guardPay.js — HOW THE GUARD IS PAID, ONCE (BAR4-SAFETY, kind F1 of BRIEF-BAR4; REVIEW-BAR-4 C7336 C6022
 * C44796; vetoable by the owner). Every line that says how the guard is paid (well paid, paid in full, irregular pay,
 * not paid this month, an unpaid rota) reads this one fact:
 *   'unpaid' — no garrison stands and every watch on the live roster is the village's own rota (the catalogue's Village
 *              watch: "Householders who take turns walking the lanes after dark"; its two descriptions say "Nobody is
 *              paid" and "A rota of unpaid householders"): nobody is paid to keep order;
 *   'full'   — the defence generator's funded gate of the forces is 1 (`defenseProfile.economicGates.military`, the home
 *              BAR2-LABELS-2 LB4 named for the defenders' pay: `safetyLineTruth.js :: payTruth`);
 *   'short'  — the gate is below 1 (the defence desk's own cut: "fall short on the watch's wages");
 *   null     — the record holds no gate (no force; a record not yet through the defence step).
 * Pure: no draw, no clock, no write.
 */
import { partitionDefenseInstitutions } from '../institutions/defenseInstitutionBuckets.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/** The village's own rota by its roster name (the catalogue's Village watch row). */
export const UNPAID_WATCH = /^village watch$/i;

/**
 * Is the only watch the village's unpaid rota, with no garrison beside it?
 * @param {ReadonlyArray<{ name?: unknown } | null | undefined>} institutions the live roster
 * @returns {boolean}
 */
export function watchIsUnpaidRota(institutions) {
  const b = partitionDefenseInstitutions(/** @type {any} */ (institutions || []));
  const watch = /** @type {Array<{ name?: unknown }>} */ (b.watch || []);
  return watch.length > 0 && (b.garrison || []).length === 0 && watch.every((i) => UNPAID_WATCH.test(String(i?.name ?? '').trim()));
}

/**
 * @param {{ institutions?: unknown, defenseProfile?: { economicGates?: { military?: unknown } } } | null | undefined} record
 * @returns {'full' | 'short' | 'unpaid' | null}
 */
export function guardPayOf(record) {
  if (watchIsUnpaidRota(liveInstitutions(/** @type {any} */ (record)))) return 'unpaid';
  const gate = record?.defenseProfile?.economicGates?.military;
  if (typeof gate !== 'number' || !Number.isFinite(gate)) return null;
  return gate >= 1 ? 'full' : 'short';
}
