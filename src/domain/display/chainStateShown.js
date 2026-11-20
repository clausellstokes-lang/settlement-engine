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
 * THE RULE ABOVE LIVES IN `facts/tradeAtWork.js` (LAST-DECLARE item 3, the chair's ruling LR5, 2026-11-18), moved whole, so the
 * `trade at work` atom reads the state this card prints; this module imports it back and re-exports its names.
 *
 * Pure: no randomness, no clock, no write.
 */
import { crisisOf } from '../facts/crisisKind.js';
import { NO_STATE_SHOWN, FOOD_SOURCE_GROUND, SHOWN_WORKING, chainCrisisStateShown, runsOnlyThroughAccess, tradeStoppedHere } from '../facts/tradeAtWork.js'; // LAST-DECLARE item 3 (LR5): the crisis state's one home, a lazy fact module
export { NO_STATE_SHOWN, chainCrisisStateShown, tradeStoppedHere };
import { chainWorksResource } from '../facts/chainWorking.js'; // BAR6-MARKS (6c-unworked): the one answer


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
  return SHOWN_WORKING.has(state) && (runsOnlyThroughAccess(chain, record) || worksNotItsGround(chain)) ? NO_STATE_SHOWN : state;
}

/**
 * BAR6-MARKS (LAW 6's 6c-unworked, named by BAR6-RECORD through the chair, 2026-11-16; vetoable by the owner): A CHAIN WHOSE
 * HOUSES DO NOT WORK ITS GROUND IS NOT RUN HERE. A stone chain's card printed "✓ Running" via the brickmaker alone, where the
 * Resources tab says no one here works the stone (11 towns of the census's 720). THE ONE ANSWER to "does a chain work this
 * resource here?" (`facts/chainWorking.js :: chainWorksResource`, its `NOT_WORKED_THROUGH` exceptions) is asked of this chain
 * alone, read as available and working, so that only its houses decide: where they do not work the ground, no state prints,
 * as for a chain run only through a neighbour's house above.
 * @param {unknown} chain
 * @returns {boolean}
 */
function worksNotItsGround(chain) {
  const c = /** @type {{ resourceInputKey?: unknown } | null} */ (chain && typeof chain === 'object' ? chain : null);
  if (!c || typeof c.resourceInputKey !== 'string' || !c.resourceInputKey) return false;
  const alone = { economicState: { activeChains: [{ ...c, resourceInputAvailable: true, status: 'running' }] } };
  return !chainWorksResource(alone, c.resourceInputKey);
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
 * (`magicProvisionShown.js :: magicNoteShown`, W2-C-LEAVES-5 item 5), and the outputs a half-way gap leaves (BAR5-CHAINS,
 * `outputsShown`). The record is not touched: the chain itself is
 * returned where nothing differs, else a copy.
 * @template {{ status?: unknown, magicNote?: unknown }} C
 * @param {C} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record
 * @returns {C & { status?: unknown, magicNote?: unknown, outputs?: unknown }}
 */
export function chainAsShown(chain, record) {
  const status = chainStateShown(chain, record), magicNote = magicNoteShown(chain, record);
  const outputs = outputsShown(chain, record);
  if (status === chain?.status && magicNote === chain?.magicNote && outputs === null) return chain;
  return outputs === null ? { ...chain, status, magicNote } : { ...chain, status, magicNote, outputs };
}

/**
 * THE OUTPUTS THE CARD PRINTS (BAR5-CHAINS, LAW 3's L3.halfway, the chair's direction (a) of BRIEF-BAR5; vetoable by the
 * owner): a card on a material the record's gap says is worked only half-way does not print the finished goods of the
 * house that gap names missing (`facts/halfWayGoods.js :: halfWayGoodsDenied`): "Boots and shoes · Saddles and harness ·
 * Leather armour" stood over a lone Tanner beside "Work on the animal hides here stops half-way". The tab, the PDF and the
 * journal read the chain as shown; the record keeps its outputs. Null where nothing is denied.
 * @param {unknown} chain @param {unknown} record
 * @returns {unknown[] | null}
 */
function outputsShown(chain, record) {
  const outputs = chain && typeof chain === 'object' ? /** @type {{ outputs?: unknown }} */ (chain).outputs : undefined;
  if (!Array.isArray(outputs)) return null;
  const denied = halfWayGoodsDenied(record, chain);
  if (denied.size === 0 || !outputs.some((o) => denied.has(String(o)))) return null;
  return outputs.filter((o) => !denied.has(String(o)));
}
import { magicNoteShown } from './magicProvisionShown.js';
import { halfWayGoodsDenied } from '../facts/halfWayGoods.js';
