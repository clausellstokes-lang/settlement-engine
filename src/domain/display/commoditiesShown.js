/**
 * domain/display/commoditiesShown.js — THE TOWN'S COMMODITIES AS THE RESOURCES TAB LISTS THEM, THE FAILED FOOD MARKED
 * (BAR5-FOOD, LAW 3's `L3.failedFood`; BRIEF-BAR5's fact (a); vetoable by the owner).
 *
 * The Resources tab printed "✗ Failed this year · Grain" (the famine's failed source, `validationOnPage.js ::
 * famineFailedResourceOf`) and, ten lines below under "Commodities available", "Extensive Grain Fields · grain · flour"
 * bare (bar0-village-famine-rand-24): the list read `resourceAnalysis.availableResources` raw and never the food record's
 * `failedSource`. The list now reads the famine the card reads, through the chain leaf's one reading of the failed
 * grounds (`chainStateShown.js :: failedGroundsOf`): a ground the famine failed, and each good of the failed food
 * (`FAILED_GOODS`), carries the chip mark `(failed)`; every other item prints as before. Outside a famine in force, and
 * where the record names no failed source, nothing is marked.
 *
 *   commoditiesShown(record)   [{ key, label, failed }] in the record's order (`availableResources`), each label the tab's
 *                              own (`RESOURCE_DISPLAY_LABELS`, else the key spaced).
 *   FAILED_MARK                the chip's mark word.
 *
 * Display only: the record's list does not change. Pure: no randomness, no clock, no write.
 */
import { failedGroundsOf } from './chainStateShown.js';
import { RESOURCE_DISPLAY_LABELS } from './resourceDisplayName.js';

/** The chip's mark, after the item (the tab's own chip form, "(stopped)"). VETOABLE wording. */
export const FAILED_MARK = 'failed';

/**
 * The goods each failed food source takes with it (the food a famine failed, `foodBalance.js :: FAILED_SOURCE_WORDS`: the
 * grain harvest and its flour; the mill's flour; the herds' meat and milk; the fishing's fish; the hunt's game). The
 * herds' wool and hides, and a fishing ground's salt, are not the food that failed.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const FAILED_GOODS = Object.freeze({
  grain: Object.freeze(['grain', 'flour']),
  mill: Object.freeze(['flour']),
  livestock: Object.freeze(['livestock', 'dairy']),
  fish: Object.freeze(['fish', 'seafood', 'catch']), // the catch's own goods as the trade lists name them ("Smoked seafood", "Freshwater catch")
  game: Object.freeze(['game meat']),
});

/** Food that arrives under names no food source's own good carries (G72 (6)): a frozen list of its own, beside `FAILED_GOODS`. */
const FOOD_ARRIVING_GOODS = Object.freeze(['provisions', 'game']);

/**
 * VIABILITY-TRUE (the tenth chair's G61 (1)): is this trade good one of the food sources' own goods (`FAILED_GOODS`: grain,
 * flour, livestock, dairy, fish, seafood, the catch, game meat), read as the Economics tab reads a failed food against a
 * label (a whole word, lower case)? Salt, hides and the other goods the regional catalogue files under food are not.
 * FOOD THAT ARRIVES UNDER OTHER NAMES (CURE-119, the tenth chair's G72 (6)): it also answers yes to the whole words of
 * `FOOD_ARRIVING_GOODS` ("Preserved provisions", "Game and hides (...)"). THE "KNOWN MISSES" PARAGRAPH (VIABILITY-TRUE-2,
 * G68 (V3)) IS CLOSED: its measure ("none neither": every place where they arrived also printed food pounds or a food
 * source's own good) held on the small tiers it was taken on (thorps, hamlets, villages) and failed in towns (r7x-town-68,
 * C dp-town-101 printed "feeds itself" beside an arriving "Preserved provisions" and no pounds). `FAILED_GOODS` stays as it
 * is: the famine's marks read it.
 * @param {unknown} label @returns {boolean}
 */
export function isFoodSourceGood(label) {
  const item = String(label ?? '').toLowerCase().replace(/_/g, ' ');
  return [...Object.values(FAILED_GOODS), FOOD_ARRIVING_GOODS].some((words) => words.some((g) => new RegExp(`\\b${g}\\b`).test(item)));
}

/**
 * The goods of the food a famine in force failed (`FAILED_GOODS`), spaced and lower case; none outside a famine or where
 * the record names no failed source. The Economics tab's "Produced locally" reads it too
 * (`tradeListDisplay.js :: localProductionAsPrinted`): the one reading of what the famine took.
 * @param {unknown} record @returns {ReadonlyArray<string>}
 */
export function failedFoodGoodsOf(record) {
  if (failedGroundsOf(record).length === 0) return [];
  const failed = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } | null } | null | undefined} */ (record)
    ?.economicState?.foodSecurity?.foodRecord?.failedSource;
  return typeof failed === 'string' && Object.hasOwn(FAILED_GOODS, failed) ? FAILED_GOODS[failed] : [];
}

/** @param {string} key @returns {string} */
const labelOf = (key) => (Object.hasOwn(RESOURCE_DISPLAY_LABELS, key) ? RESOURCE_DISPLAY_LABELS[/** @type {keyof typeof RESOURCE_DISPLAY_LABELS} */ (key)] : key.replace(/_/g, ' '));

/**
 * @param {unknown} record the settlement record
 * @returns {Array<{ key: string, label: string, failed: boolean }>}
 */
export function commoditiesShown(record) {
  const s = /** @type {{ resourceAnalysis?: { availableResources?: unknown } | null, economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } | null } | null | undefined} */ (record);
  const list = Array.isArray(s?.resourceAnalysis?.availableResources) ? s.resourceAnalysis.availableResources : [];
  const grounds = failedGroundsOf(record);
  const goods = failedFoodGoodsOf(record);
  return list.filter((k) => typeof k === 'string' && k).map((k) => {
    const key = String(k);
    const plain = key.toLowerCase().replace(/_/g, ' ');
    return { key, label: labelOf(key), failed: grounds.includes(key) || goods.includes(plain) };
  });
}
