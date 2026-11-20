/**
 * corpusEcoKinds.js — BAR4-CORPUS-ECO's THREE DETECTORS (BRIEF-BAR4, amendment K: a detector first). Each is a PURE
 * function over a town's RECORD and its PRINTED LINES (a census dump's lines, or the lines a desk drew) that returns
 * EVERY instance of its kind: the line, and the settled fact that makes it false there. They read the record's own
 * facts, never the words of the one sentence a reader met; the lines they watch are named below by block, pool and vid
 * of the economy and power desks (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md), and matched by the member's own
 * authored text, so a reworded member is still watched.
 *
 *   E1 · THE FOOD LINE AND ITS SOURCE: a line that names the town's leading home food source as what it eats, where
 *        every ground of that source on the resource record is spent (depleted). The record split beneath it (the
 *        food record still lists the source: a fish row on water counts as the catch, `foodLand.js :: fishSource`) is
 *        counted by `leadingSourceSpent` alone.
 *   E2 · A REASSURANCE WHILE THE TABLES ARE SHORT: a line that presumes the tables are not short (`REASSURANCE`), where
 *        they are: the food band is famine or deficit, or the hunger family is on (a famine, a siege, or any crisis over
 *        a deficit: `crisisKind.js :: familyActiveIn`), or a crisis is on while the counts fall short at all.
 *   E3 · ONE FACT, ONE SIZE: a line that sizes the unrecorded trade (`SIZING`) at a size the settled share does not
 *        have (the economy desk's own tiers over `safetyProfile.blackMarketCapture`: ≥ 30 large, ≥ 15 significant,
 *        ≥ 3 minor), or two printed lines that size it differently.
 *
 * NAMED EXCLUSIONS (judged true, kept out by name with the reason, never by narrowing until quiet) are written where
 * each kind's state is read (`tablesShort`, `calmFalse`), and E1 does not watch a member that declares `source spent`.
 *
 * Pure: no randomness, no clock, no write.
 */
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { activeCrisisTypes, familyActiveIn } from '../../src/domain/facts/crisisKind.js';
import { liveInstitutionNames } from '../../src/domain/facts/liveInstitutionNames.js';

const LEAVES = { ...DOSSIER_STATE_PROSE_ECONOMY, ...DOSSIER_STATE_PROSE_POWER };
const TIER_NOUN = '(?:thorp|hamlet|village|town|city|metropolis)';

/** A member's authored text as a search over printed lines: its slots any words, "town" any tier's noun. @param {string} text */
export function memberSearch(text) {
  const body = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\\\{\w+\\\}/g, '.+?')
    .replace(/\btown\b/g, TIER_NOUN);
  return new RegExp(body, 'i');
}

/** @param {string} blockId @param {string} poolKey @returns {ReadonlyArray<{vid: number, text: string}>} */
function pool(blockId, poolKey) {
  const members = /** @type {any} */ (LEAVES)[blockId]?.pools?.[poolKey];
  if (!Array.isArray(members)) throw new Error(`corpusEcoKinds: no pool ${blockId}::${poolKey}`);
  return members;
}

/** @param {string} blockId @param {string} poolKey @param {ReadonlyArray<number>|null} vids */
function watched(blockId, poolKey, vids, extra = {}) {
  return pool(blockId, poolKey).filter((m) => !vids || vids.includes(m.vid))
    .map((m) => ({ id: `${blockId}::${poolKey}::v${m.vid}`, text: m.text, re: memberSearch(m.text),
      // a member that DECLARES the spent source is the twin written for that state (it says the grounds are worked out)
      spentTwin: (m.marks || []).includes('source spent'),
      // a member that DECLARES the own plots is the twin written for that state (it names the holdings beside the source)
      plotsTwin: (m.marks || []).includes('own plots'), ...extra }));
}

// ── E1 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
/** Each home food source's grounds on the resource record (the keys `foodLand.js` reads it by). */
export const SOURCE_GROUNDS = Object.freeze({
  fish: Object.freeze(['fishing_grounds', 'river_fish']),
  grain: Object.freeze(['grain_fields', 'fertile_floodplain']),
  livestock: Object.freeze(['grazing_land']),
  game: Object.freeze(['hunting_grounds']),
  mill: Object.freeze(['river_mills']),
});
const SPENT = Object.freeze(['depleted', 'exhausted']);

/**
 * THE RECORD SPLIT (K6): the food record's leading source, and whether every ground of it on the resource record is
 * spent. Null where the record names no source or the resource record holds no ground of it.
 * @param {any} record @returns {{source: string, grounds: string[], spent: boolean}|null}
 */
export function leadingSourceSpent(record) {
  const source = record?.economicState?.foodSecurity?.foodRecord?.foodSources?.[0];
  const keys = /** @type {Record<string, ReadonlyArray<string>>} */ (SOURCE_GROUNDS)[source];
  if (!keys) return null;
  const grounds = (record?.resourceAnalysis?.resourceConditions || [])
    .filter((/** @type {any} */ c) => keys.some((k) => String(c?.key ?? '').includes(k)));
  if (grounds.length === 0) return null;
  return { source, grounds: grounds.map((/** @type {any} */ c) => `${c.key}:${c.condition}`),
    spent: grounds.every((/** @type {any} */ c) => SPENT.includes(String(c?.condition))) };
}

/** The lines that name the leading home food source as what the town eats (DS-ECO-9's three food-source pools). */
export const LEADING_SOURCE_LINES = Object.freeze([
  ...watched('DS-ECO-9', 'FOOD SOURCES: one source', null),
  ...watched('DS-ECO-9', 'FOOD SOURCES: several, the largest named', null),
  ...watched('DS-ECO-9', 'FOOD SOURCES: four or more', null),
].filter((w) => !w.spentTwin && !w.plotsTwin));

/**
 * E1's SECOND ROW (the chair's ruling FW1, 2026-11-16): the families till holdings for the table (a subsistence house on the
 * live roster) while the food record names one source and no grain: a line that gives that source as what the table leans
 * on FIRST (the one-source pool's members) is false there.
 * @param {any} record @returns {boolean}
 */
export function plotsBesideOneSource(record) {
  const sources = record?.economicState?.foodSecurity?.foodRecord?.foodSources;
  if (!Array.isArray(sources) || sources.length !== 1 || ['grain', 'mill'].includes(sources[0])) return false;
  return liveInstitutionNames(record).some((n) => n.toLowerCase().includes('subsistence'));
}
const SOURCE_FIRST_LINES = Object.freeze(watched('DS-ECO-9', 'FOOD SOURCES: one source', null).filter((w) => !w.spentTwin && !w.plotsTwin));

/** @param {any} record @param {ReadonlyArray<string>} lines */
export function detectE1(record, lines) {
  const split = leadingSourceSpent(record);
  const spent = split?.spent ? LEADING_SOURCE_LINES.flatMap((w) => lines.filter((l) => w.re.test(l))
    .map((line) => ({ kind: 'E1', id: w.id, line, state: `${split.source} leads; ${split.grounds.join(', ')}` }))) : [];
  const plots = plotsBesideOneSource(record) ? SOURCE_FIRST_LINES.flatMap((w) => lines.filter((l) => w.re.test(l))
    .map((line) => ({ kind: 'E1', id: w.id, line, state: 'plots: a subsistence house beside one source, no grain' }))) : [];
  return [...spent, ...plots];
}

// ── E2 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
/**
 * The lines of the economy desk that presume the tables are not short, each of one of two strengths:
 *   CALM: a calm-times line (food "is not a subject", "nobody worries about the next meal", "the least of it"): false where
 *         the tables are short, AND where any crisis is on while the counts fall short at all (rule 3 of the measure: a
 *         caveat elsewhere does not save a line the crisis plainly touches);
 *   STRUCTURAL: a line about the town's sources or band ("a poor year in one does not empty the tables"): false where the
 *         tables are short.
 */
export const REASSURANCE = Object.freeze([
  ...watched('DS-ECO-2', 'FOOD: balanced', [2], { calm: true }),
  ...watched('DS-ECO-8', 'FOOD AND PROSPERITY: full stores lift the town', [2], { calm: true }),
  ...watched('DS-ECO-9', 'SURPLUS', [2, 3], { calm: true }),
  ...watched('DS-ECO-9', 'SECURE', [2], { calm: true }),
  ...watched('DS-ECO-9', 'SECURE', [1, 3, 7], { calm: false }),
  ...watched('DS-ECO-9', 'FOOD SOURCES: several, the largest named', [1, 2, 3], { calm: false }),
  ...watched('DS-ECO-9', 'FOOD SOURCES: four or more', [1, 2, 3], { calm: false }),
]);
const SHORT_BANDS = Object.freeze(['famine', 'deficit']);
const UNDER_BOUGHT = Object.freeze(['famine', 'deficit', 'importDependent']);

/**
 * Are the tables short in this town? The band at deficit or worse; a famine; a siege over a town that buys its food.
 * NAMED EXCLUSION (judged true): a siege over a town whose own band is Pressured or better: the band says the town feeds
 * itself inside the lines, and a line about its sources carrying a lean year is true there.
 * @param {any} record @returns {string|null} the reason, or null
 */
export function tablesShort(record) {
  const band = record?.economicState?.foodSecurity?.foodRecord?.band;
  if (SHORT_BANDS.includes(band)) return `band ${band}`;
  const types = activeCrisisTypes(record);
  if (types.includes('famine')) return 'famine';
  if (types.includes('under_siege') && UNDER_BOUGHT.includes(band)) return `under_siege over band ${band}`;
  return null;
}

/**
 * Is a calm-times line false here? Where the tables are short; where the hunger family is on; where a crisis is on while
 * the counts fall short at all.
 * NAMED EXCLUSION (judged true): the Secure band's own STRUCTURAL lines (v1 "in an ordinary season … or near enough",
 * v3 and v7 of the stores) under a crisis over a shortfall the band still calls Secure: each speaks of an ordinary season
 * or of the stores, and both are true of the band.
 * @param {any} record @returns {string|null}
 */
export function calmFalse(record) {
  const short = tablesShort(record);
  if (short) return short;
  const hunger = familyActiveIn(record, 'hunger');
  if (hunger.length) return `hunger: ${hunger.join(',')}`;
  const food = record?.economicState?.foodSecurity;
  const types = activeCrisisTypes(record);
  if (types.length && Number(food?.deficitPct) > 0) return `${types.join(',')} over a ${food.deficitPct}% shortfall`;
  return null;
}

/** @param {any} record @param {ReadonlyArray<string>} lines */
export function detectE2(record, lines) {
  const calm = calmFalse(record); const structural = tablesShort(record);
  return REASSURANCE.flatMap((w) => {
    const why = w.calm ? calm : structural;
    return why ? lines.filter((l) => w.re.test(l)).map((line) => ({ kind: 'E2', id: w.id, line, state: why })) : [];
  });
}

// ── E3 ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const SIZE_ORDER = Object.freeze(['none', 'minor', 'significant', 'large']);
/** The settled size of the unrecorded trade: the economy desk's tiers over the capture. @param {any} record */
export function shadowTradeSize(record) {
  const c = Number(record?.economicState?.safetyProfile?.blackMarketCapture);
  if (!Number.isFinite(c)) return 'none';
  return c >= 30 ? 'large' : c >= 15 ? 'significant' : c >= 3 ? 'minor' : 'none';
}
/** The lines that size the unrecorded trade, each with the sizes it says (`at`: the sizes where it is true). */
export const SIZING = Object.freeze([
  ...watched('DS-ECO-6', 'TIER: a large share off the books (≥30)', [1, 2], { at: ['large'] }),
  ...watched('DS-ECO-6', 'TIER: significant off-book activity (≥15)', [0, 1, 7], { at: ['significant', 'large'] }),
  ...watched('DS-ECO-6', 'TIER: minor shadow activity (≥3)', [0, 4, 5], { at: ['none', 'minor'] }),
  ...watched('DS-POW-6', 'operation role duty evasion', [2, 3], { at: ['significant', 'large'] }),
].filter((w) => /\b(small|large|good share|good part|real portion|little of|much of|nothing more)\b/i.test(w.text)));

/** @param {any} record @param {ReadonlyArray<string>} lines */
export function detectE3(record, lines) {
  const size = shadowTradeSize(record);
  const printed = SIZING.flatMap((w) => lines.filter((l) => w.re.test(l)).map((line) => ({ w, line })));
  const out = [];
  for (const { w, line } of printed) {
    if (!w.at.includes(size)) out.push({ kind: 'E3', id: w.id, line, state: `settled size ${size} (capture ${record?.economicState?.safetyProfile?.blackMarketCapture})` });
  }
  const common = printed.reduce((acc, { w }) => acc.filter((x) => w.at.includes(x)), [...SIZE_ORDER]);
  if (printed.length > 1 && common.length === 0 && out.length === 0) out.push({ kind: 'E3', id: 'two sizes', line: printed.map(({ line }) => line).join(' || '), state: `settled size ${size}` });
  return out;
}
