/**
 * domain/facts/criticalImportBroughtIn.js — THE GOOD A HOUSE NEEDS FROM ELSEWHERE IS BROUGHT IN (BAR8-DESKS-ECO, J's rules
 * 11c.needed, 11c.venture and 11c.idle; BRIEF-BAR8 seat DESKS-ECO item 2, the chair's ruling BR17 (3) of 2026-11-17: "a
 * declaration on the `{good}` of the 'comes from elsewhere' line (the good is brought in: a per-good atom value)". NEW
 * VOCABULARY, on the owner's veto list).
 *
 *   criticalImportBroughtInOf(record)   `critical import brought in`: the good DS-ECO-12's lens "CRITICAL IMPORT: a house
 *                                       needs what the land lacks" fills `{good}` with (`economyStateProse.js ::
 *                                       criticalImportRow`: the first `resourceAnalysis.imports.critical` item whose reason
 *                                       is "Required by <House> but not available …", in bare-common form) is one an import
 *                                       of the stored list brings: its words, or its family (iron beside "iron ore", precious
 *                                       metals beside "gold/silver ore"), as the page's own need list matches a need to an
 *                                       arriving import (`tradeListDisplay.js :: needMetBy`). undefined where the record holds
 *                                       no such good (the lens draws nothing there).
 *
 * "A good part of the copper ore Brightwater's work uses must come from elsewhere; when none comes, that work stands idle."
 * printed beside "Needed, and not brought in: copper ore." (bar0-city-wartime-rand-47), and for the failed venture's clay
 * (C34102: no clay lies near and none is brought in). The line presumes the good arrives; where none does, its twin says so.
 *
 * WHY A SECOND HOME, AND HOW IT STAYS ONE FACT (the precedent: `catchStopped.js`): the page's reading of "brought in" is the
 * need list's (`tradeListDisplay.js :: importsAsPrinted`), and the lens's row is the desk's (`criticalImportRow`); both modules
 * read `factsOf`, which reads this leaf, and the trade list reads modules pinned lazy (EG1), so neither can be imported here.
 * This leaf states their verdict in the record's own words, and the guard `tests/domain/bar8DesksEco.test.js` holds it EQUAL
 * to theirs (the row's good to `criticalImportRow`'s; brought in to an arriving import that names it or meets it by
 * `needMetBy`) on every town it births, so the two cannot drift: a change to either reds it.
 *
 * Layer 4 (over the resource analysis, stored at layer 3, and the economy's imports). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/bar8DesksEco.test.js
 */
import { canonImports } from '../canonicalAccessors.js';

/** The desk's reason shape for a house-required import (`economyStateProse.js :: REQUIRED_BY_RE`). */
const REQUIRED_BY_RE = /^Required by (.+?) but not available\b/;

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.trim() : '');

/** The desk's bare-common fill (`economyStateProse.js :: bareCommonFill`), as a test. @param {string} v */
const bareCommon = (v) => !!v && !/^(?:the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(v) && !/[—–]/.test(v)
  && !/[.!?]\s|[.!?]$/.test(v) && !/[0-9]/.test(v) && !/[a-z]+_[a-z]+/.test(v) && /^[a-z]/.test(v);
/** The desk's proper fill (`economyStateProse.js :: properFill`), as a test. @param {string} v */
const proper = (v) => !!v && !/[—–]/.test(v) && !/[.!?]\s|[.!?]$/.test(v) && !/[0-9]/.test(v) && !/[a-z]+_[a-z]+/.test(v) && /^[A-Z]/.test(v);

/**
 * THE MATERIAL FAMILIES a need and an import are matched by: a COPY of `tradeListDisplay.js :: NEED_FAMILY_WORDS`,
 * `NEED_WIDE_WORDS` and `WORKED_GOOD` (that module is not importable here: see the header), held to the page's own matching
 * by the guard, need by need.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const FAMILY_WORDS = Object.freeze({
  iron: ['iron', 'steel'], copper: ['copper'], precious: ['gold', 'silver', 'precious'], tin: ['tin'],
  timber: ['timber', 'lumber', 'plank'], stone: ['stone', 'masonry'], clay: ['clay'], salt: ['salt'],
  grain: ['grain', 'flour', 'wheat', 'barley'], textile: ['textile', 'cloth', 'linen', 'silk'], luxury: ['luxury', 'exotic'],
  spice: ['spice'], grape: ['grape'], livestock: ['livestock', 'cattle', 'ox', 'oxen'], herb: ['herb'],
  hide: ['hide', 'leather', 'fur', 'pelt'], fish: ['fish'], fuel: ['charcoal', 'fuel', 'peat', 'coal'],
  provision: ['provision', 'foodstuff', 'preserved'], glass: ['glass'],
});
const WIDE_WORDS = Object.freeze({ metal: ['iron', 'copper', 'precious', 'tin'] });
export const WORKED_GOOD = /\b(?:tools?|arms|armou?r|weapons?|fittings?|components?|torcs?|jewel(?:le)?ry|candles?|supplies|equipment|vessels?|rigging|cordage)\b/i;

/** @param {string} label @returns {string[]} */
export const wordsOf = (label) => label.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/).filter(Boolean)
  .map((w) => (w.length > 3 && /[^su]s$/.test(w) ? w.slice(0, -1) : w));
/** @param {string[]} words @returns {Set<string>} */
export const familiesOf = (words) => new Set(Object.entries(FAMILY_WORDS).filter(([, ws]) => ws.some((w) => words.includes(w))).map(([f]) => f));

/** An import meets a need under another name (`needMetBy`'s rule). @param {string} need @param {string} imp */
export function meets(need, imp) {
  if (WORKED_GOOD.test(imp)) return false;
  const needWords = wordsOf(need);
  const asked = familiesOf(needWords);
  for (const [w, fams] of Object.entries(WIDE_WORDS)) if (needWords.includes(w)) for (const f of fams) asked.add(f);
  if (!asked.size) return false;
  const have = familiesOf(wordsOf(imp));
  return [...asked].some((f) => have.has(f));
}

/**
 * THE LENS'S GOOD: the raw critical item the desk fills `{good}` with, or '' where the record holds none.
 * @param {unknown} record @returns {string}
 */
export function criticalImportGoodOf(record) {
  const imports = /** @type {{ resourceAnalysis?: { imports?: unknown } | null } | null | undefined} */ (record)?.resourceAnalysis?.imports;
  if (!imports || typeof imports !== 'object' || Array.isArray(imports)) return '';
  const o = /** @type {{ critical?: unknown, reasons?: unknown }} */ (imports);
  const critical = Array.isArray(o.critical) ? o.critical : [];
  const reasons = o.reasons && typeof o.reasons === 'object' ? /** @type {Record<string, unknown>} */ (o.reasons) : {};
  for (const item of critical) {
    const raw = str(item);
    if (!raw || raw.includes('(') || !bareCommon(raw)) continue;
    const house = REQUIRED_BY_RE.exec(str(reasons[raw]));
    if (house && proper(house[1])) return raw;
  }
  return '';
}

/**
 * THE ONE READER of `critical import brought in`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined} undefined where the record holds no such good
 */
export function criticalImportBroughtInOf(record) {
  if (!record || typeof record !== 'object') return undefined;
  const good = criticalImportGoodOf(record);
  if (!good) return undefined;
  const g = good.toLowerCase();
  return canonImports(/** @type {Parameters<typeof canonImports>[0]} */ (record))
    .map((x) => str(x)).filter(Boolean)
    .some((imp) => imp.toLowerCase().includes(g) || meets(good, imp));
}
