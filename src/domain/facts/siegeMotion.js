/**
 * domain/facts/siegeMotion.js — WHETHER THE BESIEGERS MOVE, ONCE (BAR4-SAFETY, kind F2 of BRIEF-BAR4; REVIEW-BAR-4 C2020
 * C20892; vetoable by the owner). The stressor desk's crisis direction pools (DS-CND-1 "DIRECTION: <status> · CRISIS:
 * under_siege": "The besiegers draw closer …", "the lines outside do not move", "The besiegers have drawn back …") speak
 * the status of the active condition the siege promotes to (`conditionPromotion.js :: archetypeForStressor`, the match
 * `stressorsStateProse.js :: conditionCrisisKind` makes). Every other line that says whether a siege advances reads the
 * same status here:
 *   'advancing' — the condition is `worsening`;
 *   'easing'    — the condition is `easing`;
 *   'holding'   — any other status (the desk's FLAT case: `stable`, absent or unrecognised);
 *   null        — no siege on the record, or no condition promoted from it.
 * Pure: no draw, no clock, no write.
 */
/**
 * The archetype the siege promotes to (`conditionPromotion.js :: archetypeForStressor`'s answer for an `under_siege` entry),
 * held as a constant so this leaf does not draw the promotion table into the eager bundle (the worker's and first paint's byte
 * ceilings); `tests/domain/bar4SafetyKinds.test.js` pins it to the promotion table's own answer.
 */
export const SIEGE_ARCHETYPE = 'war_pressure';

/** @param {unknown} stress @returns {Array<{ type?: unknown }>} */
const entriesOf = (stress) => /** @type {Array<{ type?: unknown }>} */ (Array.isArray(stress) ? stress : stress && typeof stress === 'object' ? [stress] : []);

/**
 * @param {{ stress?: unknown, activeConditions?: unknown } | null | undefined} record
 * @returns {'advancing' | 'holding' | 'easing' | null}
 */
export function siegeMotionOf(record) {
  const siege = entriesOf(record?.stress).find((e) => e?.type === 'under_siege');
  if (!siege) return null;
  const conditions = /** @type {Array<{ archetype?: unknown, status?: unknown }>} */ (Array.isArray(record?.activeConditions) ? record.activeConditions : []);
  const condition = conditions.find((c) => c?.archetype === SIEGE_ARCHETYPE);
  if (!condition) return null;
  return condition.status === 'worsening' ? 'advancing' : condition.status === 'easing' ? 'easing' : 'holding';
}
