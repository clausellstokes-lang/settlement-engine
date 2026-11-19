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
  const b = partitionDefenseInstitutions(institutions || []);
  const watch = /** @type {Array<{ name?: unknown }>} */ (b.watch || []);
  return watch.length > 0 && (b.garrison || []).length === 0 && watch.every((i) => UNPAID_WATCH.test(String(i?.name ?? '').trim()));
}

/**
 * BAR6-PEOPLE (LAW 10 rule 10e-house; BRIEF-BAR6 fact (f), amendment B6; vetoable by the owner; on the veto list as new
 * vocabulary): THE ONE READER of the atom `paid watch`: someone is paid to keep order, so a line of drawn pay (a roster padded
 * with names that never walk it) has pay to draw. False only where the village's unpaid rota is the whole watch (this
 * file's 'unpaid'), the card that says "Nobody is paid" (the wide read's C200774). Read on the roster alone, so a birth in
 * progress answers it as the final record does.
 * SEAM-DESKS (2026-11-17, SEAM-LIST's PEOPLE item; vetoable by the owner): A WATCH MUST STAND. Read as "not the unpaid rota"
 * the atom was true where the roster holds no watch at all, so the watch sergeant's padded roster could print in a town with
 * no watch to pad. It now reads a watch on the live roster that is not the village's unpaid rota alone. The atom is kept,
 * not folded into BAR6-CRIME's `force: paid`, because its one declaration stands in a file outside this seat
 * (`data/people/titleSecretsPresentations.js`): that move and the atom's removal are left by name for the close.
 * @param {{ institutions?: unknown } | null | undefined} record
 * @returns {boolean}
 */
export function paidWatchOf(record) {
  const live = liveInstitutions(record);
  return (partitionDefenseInstitutions(live || []).watch || []).length > 0 && !watchIsUnpaidRota(live);
}

/**
 * @param {{ institutions?: unknown, defenseProfile?: { economicGates?: { military?: unknown } } } | null | undefined} record
 * @returns {'full' | 'short' | 'unpaid' | null}
 */
export function guardPayOf(record) {
  if (watchIsUnpaidRota(liveInstitutions(record))) return 'unpaid';
  const gate = record?.defenseProfile?.economicGates?.military;
  if (typeof gate !== 'number' || !Number.isFinite(gate)) return null;
  return gate >= 1 ? 'full' : 'short';
}
