/**
 * domain/facts/ownPlots.js — THE OWN-PLOTS HOME (BAR4-CORPUS-ECO, BRIEF-BAR4 amendment 5b; the chair's ruling FW1 of
 * 2026-11-16, vetoable by the owner). ONE atom, the record's fact: the town's families till holdings for the table (a
 * subsistence farming house stands on the live roster) while the food record names no grain source, so the holdings feed
 * the town beside a source the record does list. "Quirigche leans first on its hunting for its food" printed beside the
 * page's own "Each family tills a small holding, all of it for the table" (REVIEW-BAR-4 C33209, bar0-thorp-calm-rand-21):
 * the line gives the hunt as what every table leans on first where the holdings feed it too. The food record is not moved
 * (FW1: `foodLand.js` feeds the food band; grain needs grain fields there): the line reads the roster.
 *
 *   ownPlotsOf(record, liveNames)   THE ONE READER: a live house whose name holds "subsistence" (the caller hands the
 *                        live roster's names, `liveInstitutionNames.js`, the roster less its ruins and its stand-ins: `factsOf`
 *                        reads them through the institutions seam it already imports, so this module imports nothing and pulls
 *                        no roster code into the eager core's first paint) and no grain or mill on the food record's sources
 *                        (`institutions.js :: isGrainFoodSource`, spelled here).
 *
 * Layer 2 (the roster and the food record). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar4CorpusEcoKinds.test.js
 */
/** The grain food sources (`institutions.js :: isGrainFoodSource`, the same two words: that module rides a lazy chunk and the
 * facts are eager, so it is not imported). */
const GRAIN_SOURCES = Object.freeze(['grain', 'mill']);

/**
 * THE ONE READER of `own plots`.
 * @param {unknown} record the settlement record
 * @param {ReadonlyArray<string>} liveNames the live roster's names (`liveInstitutionNames(record)`)
 * @returns {boolean | undefined} undefined where there is no record
 */
export function ownPlotsOf(record, liveNames) {
  if (!record || typeof record !== 'object') return undefined;
  const sources = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodSources?: unknown } | null } | null } | null }} */ (record).economicState?.foodSecurity?.foodRecord?.foodSources;
  if (Array.isArray(sources) && sources.some((s) => GRAIN_SOURCES.includes(String(s)))) return false;
  return (Array.isArray(liveNames) ? liveNames : []).some((n) => String(n).toLowerCase().includes('subsistence'));
}
