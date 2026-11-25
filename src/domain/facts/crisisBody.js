/**
 * domain/facts/crisisBody.js — THE CRISIS-BODY HOME (BIRTH-1 D7; the tenth chair's ruling G18 of 2026-11-25: "ONE row
 * `crisis body: <kind>`, presence, home the leaf `domain/facts/crisisBody.js`"; vetoable by the owner). ONE atom, the
 * record's fact: the settled roster holds a power of the crisis's OWN, the body that crisis pushes on the roster
 * (`power/stressFactions.js :: applyStressEventFactions`), not the governing one. A crisis line that names such a body
 * ("the creditor's agent", "two priests, two congregations") presumes one; the indebted line named the creditor's agent
 * where no creditor stood on the roster (C 24, V 27 births at 0ec96f13d; `gen/birth-1/d7/`).
 *
 *   crisisBodyOf(record, kind)  THE ONE READER: true where a power that is not the governing one (`isGoverning !== true`)
 *                               is the kind's own: its row in the stress-power table, read with that one crisis alone
 *                               (`people/stressPowerFaces.js :: stressPowerRowOf`, the page's own reading), or one of the
 *                               kind's powers with no face row (`NO_FACE`, by name); false where the record holds powers
 *                               and none such; `undefined` where it holds no power list or names no kind (fail-closed)
 *
 * ⛔ TRUE OF THE SETTLED RECORD ONLY (as `rivalPower.js`, the chair's ruling K10): a line rendered before the roster settles
 * must not be keyed by it; the power step's sentence is resolved after the roster settles (`assembleSettlement.js`).
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/crisisNamesWhatItHolds.test.js
 */
import { stressPowerRowOf } from '../people/stressPowerFaces.js';

/** The crisis powers with no face row, by name (`power/stressFactions.js`, at the base). */
export const NO_FACE = Object.freeze({
  indebted: Object.freeze(["Creditor's Representative"]),
  recently_betrayed: Object.freeze(['The Inquiry']),
  insurgency: Object.freeze(["Journeymen's League", 'Reform Movement']),
  mass_migration: Object.freeze(["Newcomers' Settlement", 'Departure Committee']),
  wartime: Object.freeze(['Peace Movement']),
  slave_revolt: Object.freeze(['Revolt Leadership', 'Abolitionist Network']),
});

/**
 * THE ONE READER of `crisis body: <kind>`.
 * @param {{ powerStructure?: { factions?: unknown } | null } | null | undefined} record
 * @param {string | null | undefined} kind a crisis kind (`data/stressTypes.js :: STRESS_TYPE_MAP`'s keys)
 * @returns {boolean | undefined}
 */
export function crisisBodyOf(record, kind) {
  const factions = record?.powerStructure?.factions;
  if (!Array.isArray(factions) || !kind) return undefined;
  const alone = { stress: [{ type: kind }] };
  const named = /** @type {Readonly<Record<string, ReadonlyArray<string>>>} */ (NO_FACE)[kind] || [];
  return factions.some((/** @type {{ isGoverning?: unknown, faction?: unknown } | null | undefined} */ f) =>
    !!f && f.isGoverning !== true && (!!stressPowerRowOf(alone, f) || named.includes(String(f.faction ?? ''))));
}
