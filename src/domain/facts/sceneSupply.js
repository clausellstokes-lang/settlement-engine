/**
 * domain/facts/sceneSupply.js — WHAT A SCENE SHOWS IS SUPPLIED (BAR4-SCENES, kind A1 of REVIEW-BAR-4, 2026-11-16;
 * BRIEF-BAR4's amendment 5b: new atoms beside their own family, vetoable by the owner, on the veto list as new
 * vocabulary). Three facts of the record's PRESENT state that an arrival line which SHOWS a trade at work presumes:
 *
 *   timberAtHandOf(record)       `timber at hand`: a timber ground stands here and is not spent
 *                                (`resourceSemantics.js :: availableNativeResourceKeys`: managed forest, mountain timber,
 *                                shipbuilding timber), or timber is imported (`canonicalAccessors.js :: canonImports`).
 *                                "The smell of sawn timber is everywhere in Harthafen" printed in a village with no timber
 *                                ground and none brought in, its sawmill's own gap "lacks access to timber" (REVIEW-BAR-4
 *                                C45961, bar0-village-famine-rand-21; the record is split there: a river-mill chain runs
 *                                and exports milled lumber beside the gap: named for the chair, not cured here).
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
 * Layer 2 (over the economy, the resources and the services). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/bar4ScenePresumption.test.js
 */
import { availableNativeResourceKeys } from '../resourceSemantics.js';
import { canonImports } from '../canonicalAccessors.js';

/** A native timber ground, by its resource key. */
const TIMBER_GROUND = /timber|forest/;
/** An import that is timber, by its printed name ("Timber", "Lumber", "Wood (fuel)", "Logs"). */
const TIMBER_GOOD = /timber|\bwood|lumber|\blogs?\b/i;
/** A service of enchanting or identification, by its name. */
const ENCHANTING = /enchant|identif/i;

/** @param {unknown} x an import row or its name @returns {string} */
const goodName = (x) => (typeof x === 'string' ? x : String(/** @type {{ name?: unknown, good?: unknown }} */ (x)?.name ?? /** @type {{ good?: unknown }} */ (x)?.good ?? ''));

/**
 * THE ONE READER of `timber at hand`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where there is no record
 */
export function timberAtHandOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  const config = /** @type {{ config?: unknown }} */ (record).config;
  if (availableNativeResourceKeys(/** @type {any} */ (config)).some((k) => TIMBER_GROUND.test(k))) return true;
  return canonImports(/** @type {Parameters<typeof canonImports>[0]} */ (record)).some((x) => TIMBER_GOOD.test(goodName(x)));
}

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
