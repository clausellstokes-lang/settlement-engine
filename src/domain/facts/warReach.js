/**
 * domain/facts/warReach.js — WHAT THE WAR TAKES, AS THE PAGE ITSELF PRINTS IT (BAR5-MARKS, the chair's ruling WM1 of
 * 2026-11-16; vetoable by the owner). ONE reading, two things, each true only where a war is in force (the record's
 * `wartime` crisis, `crisisKind.js :: crisisOf`) AND the record holds the line that says the war took it:
 *
 *   iron              the record's supply hook of the iron trade under a war (`economicViability.plotHooks[]`, category
 *                     `Strategic Resource`: `economy/foodBalance.js` writes that category for the iron hooks only, and
 *                     under a war the war's own line, "War has taken the iron: … the smiths have nothing to mend tools
 *                     with", or its twin where no smith stands). The page prints it under Plot Hooks.
 *   working animals   the arrival scene the record holds (`arrivalScene`) is the war's line of the paddocks
 *                     (`data/narrativeData.js :: STRESS_DESCS.wartime`: "The horses in … are old, or lame, or foals. Every
 *                     sound animal of working age has a receipt where it used to be"). The page prints it on the Overview.
 *
 * WHY THIS LEAF: a row that lives on iron (the smiths' forge work) or on working animals (horse and cart hire, the
 * stables, the pack-animal trade) printed bare beside the page's own word that the war took them (BAR5-AUDIT-B, LAW 2's
 * `L2.war.iron` and `L2.war.animals`). The mark leaf (`display/crisisStoppedRow.js`) reads THIS leaf for what the war
 * stops, so the mark and the line it answers read one fact. A war whose page says neither takes nothing here: the war's
 * reach is never guessed from the war alone (the chair's WM1: "only where the page itself prints the war's reach").
 *
 * The paddocks' line is read by its own words (`RECEIPTS`), the one fixed clause of that line (the name before it
 * varies); `tests/domain/bar5MarksLaw2.test.js` holds the pool to it, so a rewording of the line reds there first.
 *
 * Layer 2 (over the economy's hooks, the arrival scene and the crises). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar5MarksLaw2.test.js
 */
import { crisisOf } from './crisisKind.js';
import { warHoldsIron } from './warIronHook.js'; // BIRTH-3 (BR9): the iron hook's own predicate

/** What the war can take, as the dependence words of `data/crisisDependence.js` spell them. */
export const WAR_TAKES_IRON = 'iron';
export const WAR_TAKES_ANIMALS = 'working animals';


/** The fixed clause of the war's paddocks line (`narrativeData.js :: STRESS_DESCS.wartime`). */
export const RECEIPTS = /\bEvery sound animal of working age has a receipt\b/;

/** Each record's reading, once a record. @type {WeakMap<object, ReadonlyArray<string>>} */
const READ = new WeakMap();

/**
 * THE ONE READER: what the war takes in this place, as the page prints it; empty where no war is in force or the page
 * says the war took nothing of these.
 * @param {object | null | undefined} record a settlement record
 * @returns {ReadonlyArray<string>} of `WAR_TAKES_IRON`, `WAR_TAKES_ANIMALS`
 */
export function warTakesOf(record) {
  if (!record || typeof record !== 'object') return Object.freeze([]);
  const cached = READ.get(record);
  if (cached) return cached;
  /** @type {string[]} */
  const out = [];
  if (crisisOf(record).has('wartime')) {
    const r = /** @type {{ arrivalScene?: unknown }} */ (record);
    // BIRTH-3 (the chair's ruling BR9: a mark the players see is never read off the DM's hooks): the war's hold on the iron
    // is the iron hook's own predicate (`warIronHook.js`), over the fields every view keeps
    const v = /** @type {{ economicViability?: { dependencies?: unknown } | null, economicState?: { primaryImports?: unknown } | null }} */ (record);
    if (warHoldsIron(Array.isArray(v.economicViability?.dependencies) ? v.economicViability.dependencies : [], Array.isArray(v.economicState?.primaryImports) ? v.economicState.primaryImports : [], 'at war')) out.push(WAR_TAKES_IRON);
    if (typeof r.arrivalScene === 'string' && RECEIPTS.test(r.arrivalScene)) out.push(WAR_TAKES_ANIMALS);
  }
  const frozen = Object.freeze(out);
  READ.set(record, frozen);
  return frozen;
}
