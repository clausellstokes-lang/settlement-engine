/**
 * domain/display/foodCarrier.js — WHO BRINGS THE FOOD IN, AND THE FOOD FIGURES AS THE TAB'S ROW PRINTS THEM, FOR EVERY
 * SURFACE (SURFACES-3 item 1; the chair's law of 2026-11-14, ONE READER FOR ONE FACT ON EVERY SURFACE).
 *
 * The Economics tab's Food Security row prints `foodRowShown(s, !!carriersOf(s, eco))` (the food record's own pounds; the
 * import only where the sentence names a carrier that brings food in). `carriersOf` was a module const of the TAB FILE,
 * so the PDF's FOOD SECURITY block could not call the tab's line: it printed the viability view's figures instead
 * (`viewModelPrimitives.js :: foodCore`), a DEFICIT of 2 lb/day beside the tab's "Short: 1 lbs/day" (r2r-thorp-32), and
 * "imports cover N% of gap" under a siege whose tab row brings nothing in: 253 of the 772 births of SURFACES-1's table.
 * `carriersOf` lives here now, moved whole (the tab imports it back), and `foodBlockShown` gives the PDF's block the
 * tab's row in the block's own field names. A town with no food record keeps the view (an older save), as the tab does.
 *
 * Pure: no randomness, no clock, no write.
 */
import { hasInstitution, liveInstitutionNames } from '../facts/institutions.js';
import { tradeStoppedHere } from './chainStateShown.js';
import { foodRowShown } from './foodRowShown.js';
import { magicFoodChannelWord } from './foodBalanceBar.js';

/**
 * W2-C-LEAVES-4 item 3(b) (the cut's #218, CENSUS-2's six BROUGHT_BANDS hits: "ships bring in" in a thorp with no wharf):
 * WHO BRINGS THE FOOD IN reads the route's own home (`economicState.tradeAccess`) and the roster: ships only where a
 * dock, wharf, quay or harbour stands (`facts/institutions.js :: hasInstitution(s, 'docks')`), boats only where one or a
 * ferry, a barge or a boatyard does; else no carrier is named ("trade brings in"). A road town's carts need no house.
 * Under a siege in force (`chainStateShown.js :: tradeStoppedHere`) nothing is said to come in but by a port's own ships:
 * '' (the sentence says no food comes in by trade, beside the siege's own note).
 * @param {unknown} s the settlement record
 * @param {{ tradeAccess?: unknown } | null | undefined} eco the economic state the tab reads
 * @returns {string} the carriers and their verb, or '' where nothing comes in
 */
export const carriersOf = (s, eco, r = /** @type {{ institutions?: unknown } | null | undefined} */ (s)) => (eco?.tradeAccess === 'port' && hasInstitution(r, 'docks') ? 'ships bring' : tradeStoppedHere(s) ? '' : eco?.tradeAccess === 'port' ? 'trade brings' : eco?.tradeAccess !== 'river' ? 'carts bring'
  : hasInstitution(r, 'docks') || liveInstitutionNames(r).some((n) => /\bferry|\bbarge|\bboat/i.test(n)) ? 'boats bring' : 'trade brings');

/**
 * The PDF's FOOD SECURITY block, fed the tab's row: PRODUCED, NEEDED, DEFICIT (the tab's Short) and its share, the
 * import's cover of the gap and the provision are the row's own pounds; the view's other fields (the farmland and crisis
 * multipliers, the summary) stand. The view where the town has no food record.
 * @param {unknown} town the settlement record
 * @param {Readonly<Record<string, unknown>> | null | undefined} viewFb the view model's food balance (`vm.economics.foodBalance`)
 * @returns {Readonly<Record<string, unknown>> | null | undefined} the block's fields
 */
export function foodBlockShown(town, viewFb) {
  const t = /** @type {Parameters<typeof foodRowShown>[0] & { economicState?: { tradeAccess?: unknown } | null }} */ (town);
  const row = foodRowShown(t, !!carriersOf(t, t?.economicState));
  if (!row) return viewFb;
  const f = row.fb;
  return {
    ...(viewFb || {}),
    production: f.dailyProduction,
    need: f.dailyNeed,
    deficit: f.deficit > 0 ? f.deficit : null,
    deficitPct: f.deficit > 0 ? row.deficitPct : null,
    surplus: f.surplus > 0 ? f.surplus : null,
    importCoverage: f.importCoverage,
    rawDeficit: f.rawDeficit,
    coveragePct: f.importCoverage > 0 ? Math.round((f.importCoverage / (f.rawDeficit || f.importCoverage)) * 100) : null,
    magicOffset: f.magicFoodOffset > 0 ? Math.round(f.magicFoodOffset) : null,
    magicChannel: f.magicFoodOffset > 0 ? magicFoodChannelWord(f.magicFoodNote) : null,
  };
}
