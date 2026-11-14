/**
 * pdf/lib/chainStateOnPage.js — A CHAIN'S STATE ON THE PDF AND IN THE FOUNDRY JOURNAL IS THE TAB'S (SURFACES-1 item 1,
 * 2026-11-14; LV-CHAINSTATE-PDF, LV-RUNNING-JOURNAL; the chair's law: ONE READER FOR ONE FACT ON EVERY SURFACE).
 *
 * The Economics tab's chain card prints the state a crisis in force leaves (`domain/display/chainStateShown.js ::
 * chainAsShown`: Impaired under a siege that stopped field work and trade, or a famine that failed the chain's ground;
 * no state where the chain's only house is a neighbour's) in the words of its chip (`EconomicsTab.jsx :: FLOW_STATUS`).
 * The PDF's chain cards (`pdf/sections/Services.jsx`) and flow (`pdf/sections/SupplyChainFlow.jsx`) read the record's
 * stored state ("Active" beside "Field work and trade have stopped"), and the journal printed the stored key itself
 * ("*(entrepot)*"). Each now reads this one call: the tab's reader for the state, the tab's chip words for its word
 * (the chip's glyphs struck: the PDF's fonts carry none). A state with no word on the tab (`NO_STATE_SHOWN`) prints
 * none here either.
 *
 * Display only: the record's chains are not touched. Pure.
 * @enforced-by tests/pdf/chainStateThreeSurfaces.test.jsx
 */
import { chainAsShown } from '../../domain/display/chainStateShown.js';

/** The tab's chip words by state (`EconomicsTab.jsx :: FLOW_STATUS`, its labels without their glyphs). */
export const CHAIN_STATE_WORDS = Object.freeze({
  impaired: 'Impaired',
  vulnerable: 'Vulnerable',
  running: 'Running',
  entrepot: 'Entrepôt',
  magically_sustained: 'Magically Sustained',
  operational: 'Operational',
});

/**
 * The chain as the tab's card shows it, and the word its chip prints ('' where the tab prints no chip). A state the
 * table does not hold prints the tab's own fallback, Operational.
 * @template {{ status?: unknown }} C
 * @param {C} chain one of the record's chains (the caller hands it in)
 * @param {unknown} town the settlement record
 * @returns {{ chain: C, key: string, word: string }}
 */
export function chainStateOnPage(chain, town) {
  const shown = town ? chainAsShown(/** @type {any} */ (chain), town) : chain;
  const key = String(shown?.status ?? '');
  const words = /** @type {Record<string, string>} */ (CHAIN_STATE_WORDS);
  return { chain: shown, key, word: key === '' ? '' : (words[key] ?? CHAIN_STATE_WORDS.operational) };
}
