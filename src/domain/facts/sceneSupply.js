/**
 * domain/facts/sceneSupply.js — WHAT A SCENE SHOWS IS SUPPLIED (BAR4-SCENES, kind A1 of REVIEW-BAR-4, 2026-11-16;
 * BRIEF-BAR4's amendment 5b: new atoms beside their own family, vetoable by the owner, on the veto list as new
 * vocabulary). Two facts of the record's PRESENT state that an arrival line which SHOWS a trade at work presumes:
 *
 *   (`timber at hand` moved to `timberAtHand.js`, one home with BAR4-HOUSES' atom of the same name, read through
 *   BAR4-RECORD's `houseInputAtHand.js`: BAR4-SCENES-2, the chair's ruling of 2026-11-16 12:16 UTC.)
 *   failedFoodSourceOf(record)   `failed: <source>`: the food source the famine failed
 *                                (`economicState.foodSecurity.foodRecord.failedSource`, the Crisis tab's "The herds failed
 *                                here this year"). The food record keeps a failed source among its `foodSources`, so the
 *                                source atoms (`livestock`, `fish`, ...) cannot say it; "Drovers push their herds along the
 *                                road" printed where the herds failed (C46725, bar0-village-famine-rand-22).
 *   enchantingOfferedOf(record)  `enchanting`: some house offers enchanting or identification among the record's services
 *                                (`availableServices`, the Services tab's rows). "signs offer enchanting and identification
 *                                by the hour" printed where the only magic for sale is alchemy (C2056,
 *                                bar0-city-under_siege+famine-rand-22).
 *
 * Layer 2 (over the economy and the services). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 */
/** A service of enchanting or identification, by its name. */
const ENCHANTING = /enchant|identif/i;

/**
 * THE ONE READER of `failed: <source>`: the source the famine failed, or null where none failed.
 * @param {unknown} record the settlement record
 * @returns {string | null | undefined} undefined where there is no food record
 */
export function failedFoodSourceOf(record) {
  const fr = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } }} */ (record)
    ?.economicState?.foodSecurity?.foodRecord;
  if (!fr || typeof fr !== 'object') return undefined;
  return typeof fr.failedSource === 'string' && fr.failedSource !== '' ? fr.failedSource : null;
}

/**
 * THE ONE READER of `enchanting`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where the record carries no services
 */
export function enchantingOfferedOf(record) {
  const services = /** @type {{ availableServices?: unknown }} */ (record)?.availableServices;
  if (!services || typeof services !== 'object') return undefined;
  return Object.values(services).some((rows) => Array.isArray(rows)
    && rows.some((r) => ENCHANTING.test(String(/** @type {{ name?: unknown }} */ (r)?.name ?? ''))));
}
