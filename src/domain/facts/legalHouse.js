/**
 * domain/facts/legalHouse.js — A HOUSE THAT WRITES, WITNESSES OR TRIES THE LAW STANDS (BAR5-THINGS, LAW 4 "the notary",
 * 2026-11-16; BRIEF-BAR5 seat BAR5-THINGS (a); BRIEF-BAR4 amendment 5b: an atom beside its family, vetoable by the owner,
 * on the veto list as new vocabulary).
 *
 *   legalHouseOf(record)   `legal house`: some house on the live roster is, BY ITS CATALOGUE IDENTITY (its native name,
 *                          never a display name custom content may rewrite), a court or a scribe, the houses whose own
 *                          catalogued services are a notary's work: a courthouse ("Notary services: Witness contracts,
 *                          wills"), a city's courthouses, the court buildings ("Civil litigation … contracts"), a scroll scribe ("Legal
 *                          documents: … wills, deeds, and binding contracts") or a village scribe ("Contract recording:
 *                          Write down and witness simple agreements"). A line that names a notary, a lawyer or an advocate
 *                          presumes one ("… has written down what … owes and left a copy with a notary.": 46 towns of the
 *                          census's 720 and 22 of the fresh 300 that hold none at 600b7683a).
 *
 * OR THE RECORD OFFERS A NOTARY: a "Notary services" row on the town's own offered services (the audit's detector reads the
 * same: `servicesText`).
 *
 * NOT A HALL (measured): a town hall's, a city hall's or a city administration's registry is a council's office, not a
 * notary's house: the audit's precision draw (BAR5-AUDIT-A, seed 517) judged the notary line STANDS in three towns whose
 * only such house is a Town hall (r2s-indebted-town-1, r2s-monster_pressure-town-3, r2s-religious_conversion-town-0).
 *
 * ONE READING FOR TWO READERS: the draw door (a line's `needs: ['legal house']`) and the presumed-things register's word
 * `notary` (`registeredWords.js`: its atom and its reader of absence) read this one fact; before it the register read its
 * own name test (a guild or a government counted) and the line read nothing.
 *
 * LEGAL_HOUSES is the catalogue's own houses (`data/institutionalCatalog.js`: every house named for a court or a scribe), copied
 * so that the fact (eager) does not carry the catalogue; the guard pins the copy to the catalogue both ways
 * (`tests/domain/bar5ThingsLaw4.test.js`).
 * A headman's, an elder's or a council's mediation by custom is not a house of written law; a barracks officer's
 * occasional witnessing is a force's, not a legal house. The page check's own legal-house test (`tests/helpers/pageLaws/
 * law4.mjs :: LEGAL_HOUSE`, a name for `scribe|court|…`) reads the same houses.
 *
 * Layer 1 (over the roster). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/bar5ThingsLaw4.test.js
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';

/** The catalogue's houses of written law, by native name (lower case). */
export const LEGAL_HOUSES = Object.freeze(new Set(['courthouse', 'multiple courthouses', 'multiple court buildings', 'scroll scribe', 'village scribe']));

/**
 * The record's own offered services hold a notary's (`availableServices.<category>[]`, "Notary services": a town hall may
 * keep the courthouse's rows where no courthouse stands, `tradeListDisplay.js`): the page prints it, so a notary is there.
 * @param {object} record @returns {boolean}
 */
const offersNotary = (record) => {
  const av = /** @type {{ availableServices?: unknown }} */ (record).availableServices;
  if (!av || typeof av !== 'object') return false;
  return Object.values(av).some((rows) => Array.isArray(rows) && rows.some((r) => /^notary services$/i.test(String(/** @type {{ name?: unknown }} */ (r)?.name ?? ''))));
};

/**
 * THE ONE READER of `legal house`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where there is no record
 */
export function legalHouseOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  if (offersNotary(record)) return true;
  return liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).some((inst) => {
    const name = String(nativeSemanticName(/** @type {object} */ (inst)) || /** @type {{ name?: unknown }} */ (inst)?.name || '').toLowerCase().trim();
    return LEGAL_HOUSES.has(name);
  });
}
