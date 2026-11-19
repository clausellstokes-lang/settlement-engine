/**
 * domain/facts/leadingSourceSpent.js — THE SPENT-SOURCE HOME (BAR4-CORPUS-ECO, BRIEF-BAR4 amendment 5b: one atom added beside
 * the food-source atoms). ONE atom, the record's fact: the town's leading home food source (the food record's first source,
 * `economicState.foodSecurity.foodRecord.foodSources[0]`) has grounds among the place's resources and every one of them is spent.
 * A line that says the town "leans first on its fishing for its food" presumes the fishing still feeds it; printed beside
 * the page's own "The fishery here is fished out; the fish sold now is salted and bought in" (REVIEW-BAR-4 C30469,
 * bar0-metropolis-calm-rand-23) and "It has worked out its river fisheries" (C26403, rand-22) it is false.
 *
 *   leadingSourceSpentOf(record)   THE ONE READER: the leading source's grounds are the config's resources
 *                                  (`config.nearbyResources`) whose key holds one of the source's ground keys (the keys
 *                                  `generators/foodLand.js` names a source by); true where there is at least one and every
 *                                  one is on the config's depleted list (`nearbyResourcesDepleted`: the generator's own
 *                                  writer; the keyed state form `foodLand.js` also reads has no generation writer). The page's
 *                                  land rows (`resourceAnalysis.resourceConditions`) print the same conditions; the guard's
 *                                  detector reads those, so the two readings are held equal on the census.
 *
 * THE RECORD SPLIT beneath it (named to the chair, not cured here): `foodLand.js :: fishSource` counts a fish row on water as
 * the catch even where every fishing ground is depleted, so the food record keeps naming fish. Measured on the census's 720
 * at 8aef8e7d4 (see the BAR4-CORPUS-ECO hand-back).
 *
 * THE RITES (the chair's FS1 and CORPUS-DEF's measure, 2026-11-16): 26 of the 36 spent-ground towns of the 720 work a fishing
 * chain the rites hold up (`activeChains[].magicRecovery` > 0, still running). The atom is still true there: the grounds ARE
 * spent (the page's land rows and the services' shortage marks read them), and the twins written for it say what is true of
 * both readings ("once came first … the grounds are worked out: what the town still raises for itself is the less for it").
 * Layer 2 (the config's resources and the food record). Pure: no randomness, no clock.
 *
 * @enforced-by tests/domain/bar4CorpusEcoKinds.test.js
 */

/** Each home food source's ground keys on the resource record (`foodLand.js`'s `hasRes` keys for each source). */
export const SOURCE_GROUND_KEYS = Object.freeze({
  fish: Object.freeze(['fishing_grounds', 'river_fish']),
  grain: Object.freeze(['grain_fields', 'fertile_floodplain']),
  livestock: Object.freeze(['grazing_land']),
  game: Object.freeze(['hunting_grounds']),
  mill: Object.freeze(['river_mills']),
});

/**
 * THE ONE READER of `source spent`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where there is no record
 */
export function leadingSourceSpentOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  const r = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodSources?: unknown } | null } | null } | null, config?: { nearbyResources?: unknown, nearbyResourcesDepleted?: unknown } | null }} */ (record);
  const sources = r.economicState?.foodSecurity?.foodRecord?.foodSources;
  const keys = Array.isArray(sources) ? /** @type {Record<string, ReadonlyArray<string>>} */ (SOURCE_GROUND_KEYS)[String(sources[0])] : undefined;
  if (!keys) return false;
  const config = r.config && typeof r.config === 'object' ? r.config : {};
  const depleted = new Set((Array.isArray(config.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : []).map(String));
  const grounds = (Array.isArray(config.nearbyResources) ? config.nearbyResources : []).map(String)
    .filter((/** @type {string} */ key) => keys.some((k) => key.includes(k)));
  return grounds.length > 0 && grounds.every((/** @type {string} */ key) => depleted.has(key));
}
