/**
 * domain/display/chainStateShown.js — THE STATE A CHAIN CARD PRINTS UNDER A CRISIS IN FORCE (W2-C-LEAVES item 4(c),
 * 2026-11-13; the cold list REVIEW-W2A-3 #165, #273, #276, #278, #875: "✓ Running" under a famine that failed the
 * chain's own harvest, and under a siege whose record says "Field work and trade have stopped").
 *
 * The chain model sets a chain's `status` before the crisis is read for most chains, so a card printed the calm
 * state beside a crisis the same page states. The record already holds the facts; this leaf reads them and changes
 * no record:
 *   · a FAMINE in force (`facts/crisisKind.js :: crisisOf`) fails one food source (`foodSecurity.foodRecord.
 *     failedSource`, FOOD-3): a chain that works that source's own ground is impaired;
 *   · a SIEGE in force stops field work and trade (`data/stressTypes.js :: STRESS_TYPE_MAP.under_siege.viabilityNote`,
 *     printed on the page): a chain carried by the town's own ground (`facts/chainCarrier.js :: chainCarrierOf`,
 *     kind `own`) or by trade (an entrepôt, passing trade, a bought input) is impaired. Smuggling (the criminal
 *     economy) is not trade the siege names, and a chain that works no ground and no trade (a house of worship, a
 *     court) keeps its state.
 * Only a state that reads as working is replaced (running, operational, entrepôt), and only by the record's own
 * word for a chain a crisis has hit, `impaired`; a vulnerable, impaired or magically sustained chain keeps its own.
 *
 * Pure: no randomness, no clock, no write.
 */
import { crisisOf } from '../facts/crisisKind.js';
import { chainCarrierOf } from '../facts/chainCarrier.js';

/** The ground each food source of the food record is grown, grazed, fished or hunted on (`generators/foodLand.js`). */
const FOOD_SOURCE_GROUND = Object.freeze({
  grain: Object.freeze(['grain_fields', 'fertile_floodplain']),
  livestock: Object.freeze(['grazing_land']),
  fish: Object.freeze(['fishing_grounds', 'river_fish']),
  mill: Object.freeze(['river_mills']),
  game: Object.freeze(['hunting_grounds']),
});

/** The states a card prints as working. */
const SHOWN_WORKING = new Set(['running', 'operational', 'entrepot']);

/**
 * @param {unknown} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record
 * @returns {string} the state the card prints (a key of the flow card's status table)
 */
export function chainStateShown(chain, record) {
  const c = chain && typeof chain === 'object'
    ? /** @type {{ status?: unknown, resourceInputKey?: unknown, entrepot?: unknown, needKey?: unknown }} */ (chain)
    : {};
  const status = String(c.status ?? '');
  if (!SHOWN_WORKING.has(status) || !record || typeof record !== 'object') return status;
  const crisis = crisisOf(/** @type {object} */ (record));
  const carrier = chainCarrierOf(chain, record).kind;
  if (crisis.has('famine')) {
    const failed = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } | null }} */ (record)
      .economicState?.foodSecurity?.foodRecord?.failedSource;
    const ground = typeof failed === 'string' ? FOOD_SOURCE_GROUND[/** @type {keyof typeof FOOD_SOURCE_GROUND} */ (failed)] : undefined;
    if (carrier === 'own' && ground && ground.includes(String(c.resourceInputKey))) return 'impaired';
  }
  if (crisis.has('under_siege') && c.needKey !== 'criminal_economy') {
    const fieldWork = carrier === 'own' && typeof c.resourceInputKey === 'string' && c.resourceInputKey !== '';
    const trade = c.entrepot === true || c.needKey === 'trade_entrepot' || carrier === 'transit' || carrier === 'bought';
    if (fieldWork || trade) return 'impaired';
  }
  return status;
}

/**
 * A service card's state: `impaired` where every house it runs through is one the Institutions tab marks impaired
 * (`components/new/tabHelpers.js :: computeChainSets`, passed in by the caller), else the card's own `operational`.
 * @param {ReadonlyArray<unknown> | null | undefined} serviceHouses the house names a service of
 *   `economicState.institutionalServices` runs through (the caller reads them off the service)
 * @param {ReadonlySet<string>} impairedHouses the impaired house names, lower case
 * @returns {'impaired' | 'operational'}
 */
export function serviceStateShown(serviceHouses, impairedHouses) {
  const houses = (serviceHouses || []).map((h) => String(h).toLowerCase());
  return houses.length > 0 && houses.every((h) => impairedHouses.has(h)) ? 'impaired' : 'operational';
}
