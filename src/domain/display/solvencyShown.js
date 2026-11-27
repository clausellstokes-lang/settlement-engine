/**
 * domain/display/solvencyShown.js — WHERE A LINE THAT SAYS THE PLACE HAS SAVINGS, PAYS ITS WAY OR OWES NO ONE STANDS
 * DOWN (RULING-R, the eleventh chair, 2026-11-27: R5, R10, R12; unit B2).
 *
 * The page's other side says one of two things, and each is read here from the record the page prints it from:
 *   · THE PLACE OWES A DEBT NOW (`owesDebtShown`): the `indebted` stress (its card, "owes an outside power more than it
 *     can ever repay", and the governing modifier "the creditors have a say in every decision"); the `outside_debt`
 *     tension ("The settlement owes a heavy debt to an outside power, and the power is preparing to collect"); and, read
 *     here since RULING-R, an `outside_debt` event of the timeline ("The Debt Crisis": "The settlement had borrowed
 *     heavily from a foreign power now ready to call the debt in", its hooks "A creditor's agent is in town conducting a
 *     quiet assessment before enforcement"), whose printed words say the creditor is collecting now.
 *   · IT HAS NOTHING LAID BY (`nothingLaidByShown`): the Economic Survival row reads Weak or Critical
 *     (`defenseScoreBands.js :: economicSurvivalBandOf`, the one home the Defense desk's DS-DEF-2 row is keyed on: "has
 *     nothing laid by to pay for a long defence", "would have to borrow the money first").
 * A pays-its-way line beside the Weak GRADE alone is ruled no fault (one is a margin, the other a shock), so the
 * viability rows read the debt alone; the savings lines read both. Pure, display only.
 */
import { economicSurvivalBandOf } from './defenseScoreBands.js';

/**
 * @param {unknown} settlement @returns {boolean} the page says the place owes a debt now
 */
export function owesDebtShown(settlement) {
  const s = /** @type {{ stress?: unknown, history?: { currentTensions?: unknown, historicalEvents?: unknown } | null } | null | undefined} */ (settlement);
  const stress = Array.isArray(s?.stress) ? s.stress : s?.stress ? [s.stress] : [];
  if (stress.some((e) => /** @type {{ type?: unknown } | null} */ (e)?.type === 'indebted')) return true;
  const tensions = s?.history?.currentTensions;
  if (Array.isArray(tensions) && tensions.some((t) => /** @type {{ type?: unknown } | null} */ (t)?.type === 'outside_debt')) return true;
  const events = s?.history?.historicalEvents;
  return Array.isArray(events) && events.some((e) => /** @type {{ templateType?: unknown } | null} */ (e)?.templateType === 'outside_debt');
}

/**
 * @param {unknown} settlement @returns {boolean} the Economic Survival row reads Weak or Critical
 */
export function nothingLaidByShown(settlement) {
  const band = economicSurvivalBandOf(/** @type {Parameters<typeof economicSurvivalBandOf>[0]} */ (settlement));
  return band === 'WEAK' || band === 'CRITICAL';
}
