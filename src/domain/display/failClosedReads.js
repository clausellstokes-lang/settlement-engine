// @ts-check
/**
 * domain/display/failClosedReads.js — A PAGE READER OF AN ALWAYS-WITHHELD KEY PRINTS NOTHING WHERE THE KEY IS ABSENT
 * (VEIL-53's FAIL-CLOSED PAGES, the chair's RULING V6 (b), vetoable by the owner; brief
 * docs/chair/2026-11-24/tenth/veil/briefs/V53-FAILCLOSED-BRIEF.md).
 *
 * Every non-owner read withholds the keys of `galleryWithholdAlways.js :: withholdAlways` (each rule naming its row of
 * the roster-choice registry). The page puts some of them back from the served document alone (`pageRederive.js ::
 * rederiveForPage`); where it does not, the key is ABSENT on the page, and a reader that reads it anyway draws a band or
 * a default sentence from nothing ("Criminal opportunity: Contained" beside the owner's "Elevated"; "Life goes on as
 * usual" where the owner's page names its war). Each predicate below answers ONE question, by presence alone (no value
 * is read): the object that holds the key was served and the key is not on it. The owner's own record carries every one
 * of these keys (the generator writes them on every birth), so on the owner's read each answers false and the reader
 * prints as before. A reader that can tell "absent because withheld" only by the key's absence says nothing there.
 *
 * Each predicate names its row of the registry (`// registry: <id>`, as `withholdAlways` does) and states the path in
 * the walker's form (`absentAt(record, [<parent path>], '<key>')`), so the totality walker
 * (tests/lint/failClosedPages.walker.test.js) finds it as a reader of the path and holds it to its fail-closed arm.
 * Pure: no draw, no write.
 */

/** @param {unknown} v @returns {v is Record<string, unknown>} */
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * The object at `path` was served and does not hold `key`.
 * @param {unknown} record @param {ReadonlyArray<string>} path @param {string} key @returns {boolean}
 */
function absentAt(record, path, key) {
  /** @type {unknown} */ let v = record;
  for (const k of path) { if (!isRec(v)) return false; v = v[k]; }
  return isRec(v) && !Object.hasOwn(v, key);
}

/**
 * The black market's capture is withheld (absent where the safety profile was served). The Foundations' "Criminal
 * opportunity" and "Law & order" rows read it (`causalState.js :: deriveCriminalOpportunity`, `deriveLawOrder`), and the
 * law's band (`facts/lawBand.js :: lawBandOf`) with them; the page puts it back only on an unmarked share's own read.
 * @param {unknown} record @returns {boolean}
 */
export function captureWithheld(record) {
  // registry: safety.blackMarketCapture
  return absentAt(record, ['economicState', 'safetyProfile'], 'blackMarketCapture');
}

/**
 * The defence's readiness score is withheld (absent where the readiness was served): the page re-derives it only inside
 * the served label's band (`pageRederive.js :: inLabelBand`); elsewhere `defenseLedger.js` reads 50, a band from nothing.
 * @param {unknown} record @returns {boolean}
 */
export function readinessScoreWithheld(record) {
  // registry: defence.readiness.score
  return absentAt(record, ['defenseProfile', 'readiness'], 'score');
}

/**
 * The history's legacy and its siege sentence are both withheld (absent where the history was served). The generator
 * writes `siegeNarrative` on every birth (null where there is none) and `legacyAnnotations` where there is a legacy,
 * so both absent together is the withholding read alone; the Daily Life's recent-changes beat reads the legacy
 * (`historyBeats.js :: deriveRecentDisruption`).
 * @param {unknown} record @returns {boolean}
 */
export function legacyWithheld(record) {
  // registry: history.legacy
  // registry: history.siegeNarrative
  return absentAt(record, ['history'], 'legacyAnnotations') && absentAt(record, ['history'], 'siegeNarrative');
}
