/**
 * domain/display/criticalImportsShown.js — THE TERRAIN'S CRITICAL IMPORTS AS THE ECONOMICS TAB SHOWS THEM, FOR EVERY
 * SURFACE (TAIL-EXPORTS-PDF batch 1, the chair's ruling E1 of 2026-11-14).
 *
 * `resourceAnalysis.imports.critical` is the terrain's NEED list ("Plains terrain cannot produce this locally"), not a
 * list of what trade brings. The Economics tab prints a critical good only where an Imports pill it prints meets it
 * (marked "Terrain cannot produce"; `EconomicsTab.jsx :: shownCriticals`, composed inline) or as a need not met
 * ("Needed, and not brought in:", `tradeListDisplay.js :: importsAsPrinted().needed`, every item held to its declaration:
 * a thorp or a hamlet trades in no luxury goods). The PDF's CRITICAL DEPENDENCIES and IMPORT DEPENDENCIES printed the
 * need list raw: "luxury goods" in 420 of the census's 720 towns, a thorp of seven under a siege among them. This leaf
 * keeps the critical goods the tab prints, in the record's order; the tab's switch to it is the DISPLAY-ECON group's.
 *
 * Display only: the record's lists do not change. Pure: no randomness, no clock, no write.
 */
import { tradeListsAsPrinted } from './tradeListDisplay.js';

/**
 * @param {Parameters<typeof tradeListsAsPrinted>[0]} settlement the record
 * @returns {string[]} the critical goods the tab prints, raw (catalogue keys), in the record's order
 */
export function criticalImportsShown(settlement) {
  const res = /** @type {{ imports?: unknown } | null | undefined} */ (settlement?.resourceAnalysis);
  const imports = /** @type {{ critical?: unknown } | unknown[] | null | undefined} */ (res?.imports);
  const critical = !res || Array.isArray(imports) ? [] : (Array.isArray(imports?.critical) ? imports.critical : []);
  const trade = tradeListsAsPrinted(settlement);
  const meets = (/** @type {string} */ tc) => trade.imports.some((imp) => imp.toLowerCase().includes(tc.toLowerCase()) || tc.toLowerCase().includes(imp.toLowerCase()));
  return critical.filter((x) => typeof x === 'string').map(String).filter((tc) => trade.needed.includes(tc) || meets(tc));
}
