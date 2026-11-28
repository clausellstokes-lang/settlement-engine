/**
 * domain/facts/catchStopped.js — THE SIEGE AND THE TOWN'S CATCH (BAR5-FOOD, LAW 3's `L3.foodLineStopped`; BRIEF-BAR5's
 * fact (b); vetoable by the owner).
 *
 * Two readings disagreed. The crisis mark (`display/crisisStoppedRow.js :: rowStoppedBy`, its income share of the fish
 * trade read through the trade's houses, `incomeHouseKind`) printed "Fish & Maritime Produce Stopped by the siege." and
 * "Fresh fish (stopped)" where every live house of the fish trade is one the siege stops (a landing's or a fishing
 * community's boats on the water beyond the walls, `data/crisisDependence.js :: HOUSE_DEPENDENCE` GATES; a fish market's
 * goods from outside, GOODS), while the foodways line (`foodways.js :: foodwaysLineOf`) put "the day's catch" on the
 * table ten lines below (bar0-hamlet-under_siege-rand-24: a Fisher's landing alone).
 *
 *   catchStoppedBySiege(record)   true where a siege is in force and every live catalogue house of the fish trade is one
 *                                 the siege stops (none is a fishmonger, the one trade house whose stall the siege
 *                                 does not shut); false where the town has no house of the fish trade. The leaf
 *                                 marks such a house stopped, or curtailed where a row of its own other than the catch
 *                                 goes on (its SV7): either way the catch rows are the siege's.
 *
 * WHY A SECOND HOME, AND HOW IT STAYS ONE FACT: the foodways line rides the eager engine core (the identity record at
 * assembly reads it), and the mark leaf reads modules pinned lazy (`facts/crisisKind.js`, `data/crisisDependence.js`:
 * `tests/architecture/engineCoreLazyEdge.test.js`), so the line cannot call the leaf. This module states the leaf's own
 * verdict for the one share in the record's own words (the food record's `hasSiege`, the roster's catalogue ids), and the
 * guard `tests/domain/bar5FoodFacts.test.js` holds it EQUAL to the leaf's verdict on every town of the corpus it reads,
 * so the two cannot drift: a change to the trade's houses or their dependence reds it.
 *
 * Layer 2 (over the economy's food record and the roster). Pure: no randomness, no clock, no write.
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';

/**
 * The houses of the fish trade (`data/crisisDependence.js :: INCOME_TRADE_HOUSES`'s fish shares) and whether a siege stops
 * each (its row's dependence there: GATES or GOODS stop; the fishmonger's FISH and INPUT do not).
 * @type {Readonly<Record<string, boolean>>}
 */
export const FISH_TRADE_STOPPED_BY_SIEGE = Object.freeze({
  fish_market: true,
  fisher_s_landing: true,
  fishing_community: true,
  fishmonger: false,
});

/** @param {unknown} inst @returns {boolean} */
const isCustom = (inst) => {
  const i = /** @type {{ custom?: unknown, source?: unknown, isCustom?: unknown }} */ (inst || {});
  return i.custom === true || i.source === 'custom' || i.isCustom === true;
};

/**
 * Is the town's catch stopped by a siege in force?
 * @param {unknown} record the settlement record (or `{ institutions, economicState }`, as the assembly hands it)
 * @returns {boolean}
 */
export function catchStoppedBySiege(record) {
  const s = /** @type {{ economicState?: { foodSecurity?: { hasSiege?: unknown } | null } | null, institutions?: unknown } | null | undefined} */ (record);
  if (s?.economicState?.foodSecurity?.hasSiege !== true || !Array.isArray(s?.institutions)) return false;
  const ids = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (s))
    .filter((i) => i && typeof i.name === 'string' && !isCustom(i))
    .map((i) => String((typeof i.catalogId === 'string' && i.catalogId) || catalogIdForName(String(i.name)) || ''))
    .filter((id) => Object.prototype.hasOwnProperty.call(FISH_TRADE_STOPPED_BY_SIEGE, id));
  return ids.length > 0 && ids.every((id) => FISH_TRADE_STOPPED_BY_SIEGE[id]);
}
