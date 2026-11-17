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

/**
 * ONE GOOD, ONCE, ON "Needed, and not brought in" (BAR7-ECON item 7, the auditor's low.doubled; vetoable by the owner). The need
 * line names each need by its plain name (`tradeListDisplay.js :: plainGoodName` over `resourceDisplayName`), and two tables can
 * give one good twice: "timber" beside "mountain timber", "fine glass sand" twice (17 towns of the census's 720 at cfc2b680a).
 * A name is said once, and a name whose words stand whole inside another need's name (its qualifier in brackets read apart)
 * gives way to the longer: "mountain timber", not "timber, mountain timber"; "timber (for large vessels)" stays the one
 * timber. The order is the list's own. Display only.
 * @param {ReadonlyArray<string>} needs the needs' names as the line prints them (the tab names each by the label seam)
 * @returns {string[]} the names printed, each good once
 */
export function neededNamesShown(needs) {
  const names = needs.map(String);
  const bare = (/** @type {string} */ n) => n.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  const within = (/** @type {string} */ a, /** @type {string} */ b) => a !== b && ` ${b} `.includes(` ${a} `);
  /** @type {Map<string, number>} the fullest name of each bare name, by its index */
  const best = new Map();
  names.forEach((n, i) => { const b = bare(n); const at = best.get(b); if (at === undefined || n.length > names[at].length) best.set(b, i); });
  const bares = [...best.keys()];
  return names.filter((n, i) => best.get(bare(n)) === i && !bares.some((m) => within(bare(n), m)));
}
