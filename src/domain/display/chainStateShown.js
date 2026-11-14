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
 *   · under that siege, a chain whose only house is a neighbour's, reached through an "Access to ..." row
 *     (`facts/institutions.js :: ACCESS_ONLY`; "Faith & Worship" in a thorp whose roster holds "Access to parish
 *     church" and no church), prints NO state (`NO_STATE_SHOWN`): the roads to that house are cut, and the siege's
 *     own note stands on the tab (W2-C-LEAVES-4 item 1, the chair's ruling of 2026-11-13; no new state word);
 *   · a port's sea grounds are not field work a land siege takes (`seaOpenTo`): its fishing keeps its state.
 *   · outside a siege too, a chain whose only house is reached through an "Access to ..." row prints no state on its
 *     card: it is not run here (`chainStateShown`, W2-C-LEAVES-7 item 9, record 375).
 *
 * Pure: no randomness, no clock, no write.
 */
import { crisisOf } from '../facts/crisisKind.js';
import { chainCarrierOf } from '../facts/chainCarrier.js';
import { ACCESS_ONLY, liveInstitutionNames } from '../facts/institutions.js';

/** The state a card prints as nothing: no chip (W2-C-LEAVES-4 item 1). */
export const NO_STATE_SHOWN = '';

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
 * @returns {string} the state a crisis leaves (a key of the flow card's status table); the card prints `chainStateShown`
 */
export function chainCrisisStateShown(chain, record) {
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
  if (tradeStoppedHere(record) && c.needKey !== 'criminal_economy') {
    const fieldWork = carrier === 'own' && typeof c.resourceInputKey === 'string' && c.resourceInputKey !== '' && !seaOpenTo(c.resourceInputKey, record);
    const trade = c.entrepot === true || c.needKey === 'trade_entrepot' || carrier === 'transit' || carrier === 'bought';
    if (fieldWork || trade) return 'impaired';
    if (runsOnlyThroughAccess(chain, record)) return NO_STATE_SHOWN;
  }
  return status;
}

/**
 * THE STATE A CHAIN CARD PRINTS (W2-C-LEAVES-7 item 9, record 375): the crisis state above, and NO state where the
 * chain's only house is reached through an "Access to ..." row, siege or none: it is not run here (a River Mill card
 * printed "✓ Running" where the only mill is "Access to external mill", r2r-hamlet-18, -29). The goods pills read the
 * crisis state alone (`chainCrisisStateShown`): the land a chain's raw good comes from is worked here though its mill
 * is a neighbour's (a thorp's grain fields beside "Access to external mill" still grow grain).
 * @param {unknown} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record
 * @returns {string}
 */
export function chainStateShown(chain, record) {
  const state = chainCrisisStateShown(chain, record);
  return SHOWN_WORKING.has(state) && runsOnlyThroughAccess(chain, record) ? NO_STATE_SHOWN : state;
}

/**
 * THE SEA A LAND SIEGE DOES NOT TAKE (W2-C-LEAVES-4 item 1): a port's sea grounds (`SEA_GROUNDS`, the catalogue's
 * "water" grounds off the coast) lie outside no wall the siege holds; the record's own exports go out "by the naval
 * route only" (`computeActiveChains.js :: deriveExportsFromChains`). A river's fish is the land's.
 * @param {string} ground @param {unknown} record
 * @returns {boolean}
 */
function seaOpenTo(ground, record) {
  const access = /** @type {{ economicState?: { tradeAccess?: unknown } | null }} */ (record).economicState?.tradeAccess;
  return SEA_GROUNDS.has(ground) && access === 'port';
}
/** The sea grounds (`data/goods/identity.js :: RESOURCE_DATA`, kind "water", off the coast). */
const SEA_GROUNDS = new Set(['fishing_grounds', 'deep_harbour']);

/**
 * WHETHER A CHAIN'S ONLY HOUSE IS A NEIGHBOUR'S (W2-C-LEAVES-4 item 1): each of its houses is met on the live roster
 * only by an "Access to ..." row, by the flow card's own reading of a house as present (the house's first word in a
 * roster name, `SupplyChainsPanel.jsx :: chainFlowFacts`), and at least one is met so.
 * @param {unknown} chain @param {unknown} record
 * @returns {boolean}
 */
function runsOnlyThroughAccess(chain, record) {
  const houses = chain && typeof chain === 'object' && Array.isArray(/** @type {{ processingInstitutions?: unknown }} */ (chain).processingInstitutions)
    ? /** @type {ReadonlyArray<unknown>} */ (/** @type {{ processingInstitutions: unknown[] }} */ (chain).processingInstitutions) : [];
  const roster = liveInstitutionNames(/** @type {Parameters<typeof liveInstitutionNames>[0]} */ (record)).map((n) => n.toLowerCase());
  const heads = houses.map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
  const met = (/** @type {boolean} */ access) => heads.some((w) => roster.some((n) => ACCESS_ONLY.test(n) === access && n.includes(w)));
  return heads.length > 0 && met(true) && !met(false);
}

/**
 * THE GROUNDS A FAMINE IN FORCE FAILED (W2-C-LEAVES-4 item 2): the ground the food record's failed source is grown,
 * grazed, fished or hunted on (`FOOD_SOURCE_GROUND`), the reading the famine branch above makes; none outside a famine.
 * @param {unknown} record the settlement record
 * @returns {ReadonlyArray<string>}
 */
export function failedGroundsOf(record) {
  if (!record || typeof record !== 'object' || !crisisOf(/** @type {object} */ (record)).has('famine')) return [];
  const failed = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } | null }} */ (record)
    .economicState?.foodSecurity?.foodRecord?.failedSource;
  return (typeof failed === 'string' && FOOD_SOURCE_GROUND[/** @type {keyof typeof FOOD_SOURCE_GROUND} */ (failed)]) || [];
}

/**
 * WHETHER TRADE COMES IN AT ALL (W2-C-LEAVES-3, #169): a siege in force stops field work and trade (the siege's own
 * record line, `data/stressTypes.js :: STRESS_TYPE_MAP.under_siege.viabilityNote`, printed on the page). The one home
 * the chain cards and the Economics tab's Imports list read.
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function tradeStoppedHere(record) {
  return !!record && typeof record === 'object' && crisisOf(/** @type {object} */ (record)).has('under_siege');
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

/**
 * THE CHAIN AS ITS CARD PRINTS IT (W2-C-LEAVES-7 item 9: the Economics tab's own reader, `EconomicsTab.jsx ::
 * shownStateOf`, moved here whole, so the tab, the Foundry journal's chain line and the PDF's chain flow read ONE
 * reader): the state a crisis left (`chainStateShown`) and the magic note whose tradition the town holds
 * (`magicProvisionShown.js :: magicNoteShown`, W2-C-LEAVES-5 item 5). The record is not touched: the chain itself is
 * returned where nothing differs, else a copy.
 * @template {{ status?: unknown, magicNote?: unknown }} C
 * @param {C} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record
 * @returns {C & { status?: unknown, magicNote?: unknown }}
 */
export function chainAsShown(chain, record) {
  const status = chainStateShown(chain, record), magicNote = magicNoteShown(chain, record);
  return status === chain?.status && magicNote === chain?.magicNote ? chain : { ...chain, status, magicNote };
}
import { magicNoteShown } from './magicProvisionShown.js';
