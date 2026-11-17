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
 * A name is said once (the fullest of equal names, its qualifier in brackets read apart: "timber (for large vessels)" is a
 * timber), and a name gives way to a longer name OF THE SAME GOOD only where this table says the two are one good
 * (`ONE_GOOD_NAMES`, the pairs measured over the census's 720 and the wide read's 150 at the seat's tip): never across two goods
 * ("iron" stays beside "iron ore"; the second reader's point (2), 2026-11-17). The order is the list's own. Display only.
 * @param {ReadonlyArray<string>} needs the needs' names as the line prints them (the tab names each by the label seam)
 * @returns {string[]} the names printed, each good once
 */
export function neededNamesShown(needs) {
  const names = needs.map(String);
  const bare = (/** @type {string} */ n) => n.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  /** @type {Map<string, number>} the fullest name of each bare name, by its index */
  const best = new Map();
  names.forEach((n, i) => { const b = bare(n); const at = best.get(b); if (at === undefined || n.length > names[at].length) best.set(b, i); });
  const bares = [...best.keys()];
  const oneGood = (/** @type {string} */ a, /** @type {string} */ b) => (Object.prototype.hasOwnProperty.call(ONE_GOOD_NAMES, a) ? ONE_GOOD_NAMES[a] : []).includes(b);
  return names.filter((n, i) => best.get(bare(n)) === i && !bares.some((m) => oneGood(bare(n), m)));
}

/** A need's short name -> the longer names of the same good it gives way to (the pairs measured; one good each). VETOABLE. */
export const ONE_GOOD_NAMES = Object.freeze(/** @type {Record<string, ReadonlyArray<string>>} */ ({
  timber: Object.freeze(['mountain timber', 'timber and building wood']),
  livestock: Object.freeze(['livestock for meat and draft']),
}));
