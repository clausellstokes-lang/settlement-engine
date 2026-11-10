/**
 * domain/display/validationOnPage.js — THE GENERATOR'S CHECKS ARE NOT FACTS ABOUT THE PLACE
 * (lane READER-R1, 2026-11-04; `docs/READER_R1_VALIDATION_ON_PAGE_2026-11-04.md`).
 *
 * The generator's own consistency checks used to print on three DM surfaces (the Overview's
 * "Structural Issues", the Resources tab's "Gaps & Opportunities", the Viability tab's
 * "Structural Crises" and "Critical Issues") and on their PDF twins, as if they described the
 * town: "River fisheries require river access" on a riverside town, "Mill exists but lacks
 * access to grain" in a village exporting its grain surplus, "Not viable — 2 critical issues"
 * beside "Critical Issues (1)". The chair's rulings, read here:
 *
 *  1. Validation text never renders on a DM surface. The rule text (`structuralViolations`,
 *     `structuralSuggestions`, the raw gap rows, the priority notes) stays on the record and
 *     is shown only on the staff panel (`staffValidationRows`, the Viability tab, elevated
 *     viewers only).
 *  2. The viability verdict's count and the Critical Issues list are ONE list
 *     (`criticalIssuesOf`): the record's own critical issues, the list `metrics.
 *     criticalIssueCount` and the summary sentence already count.
 *  3. A resource gap prints only when the RECORD truly lacks the input (`resourceGapLines`),
 *     read through the record's own fields — the economy's production, imports and exports,
 *     the nearby resources that are not depleted, the food record's sources and ordinary
 *     supply, the trade route — and never a match on an institution's name. A true gap is a
 *     fact about the place, in the house voice ("No clay reaches the potter.").
 *  4. "has no dependable trade route" is said only where the record's route is disconnected
 *     (`viabilityIssueText`): a besieged crossroads town has a route that is cut.
 *
 * Render-time only: nothing here writes the record, so no generated settlement moves.
 * Pure.
 */

import { RESOURCE_CHAINS } from '../../data/goods/chains.js';
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { availableNativeResourceKeys } from '../resourceSemantics.js';
import { isTradeRouteDisconnected } from '../tradeRouteSemantics.js';
import { institutionHasAnyTag } from '../../lib/entities.js';
import { institutionDisplayName } from './institutionDisplayName.js';
import { resourceDisplayName } from './resourceDisplayName.js';
import { compareCodepoint } from '../deterministicSort.js';

/** @typedef {{ chain: string|null, impact: string, severity: string }} GapLine */

/** @typedef {{ institution?: unknown, chain?: unknown, impact?: unknown, severity?: unknown, missing?: unknown }} GapRow */

/**
 * One viability issue or warning as the record carries it (`economicViability.issues` /
 * `.warnings`); a description is a sentence or a `{ short, text }` pair.
 * @typedef {{
 *   severity?: unknown, type?: unknown, title?: unknown, message?: unknown,
 *   description?: string | { short?: unknown, text?: unknown } | null,
 *   [key: string]: unknown,
 * }} ViabilityIssue
 */

/** @typedef {{ issues?: ReadonlyArray<ViabilityIssue> | null, warnings?: ReadonlyArray<ViabilityIssue> | null } | null | undefined} ViabilityRecord */

/**
 * The settlement fields these readers consult. Leaves are `unknown` (read through `str`, `norm`
 * and `arr`), save the trade-route keys `isTradeRouteDisconnected` reads, the food record's sources
 * (matched against the chain table's words) and the row lists the loops walk.
 * @typedef {{
 *   name?: unknown,
 *   config?: { tradeRouteAccess?: string | null, [key: string]: unknown } | null,
 *   economicState?: {
 *     localProduction?: unknown, primaryImports?: unknown, primaryExports?: unknown,
 *     tradeAccess?: string | null,
 *     foodSecurity?: { foodRecord?: { foodSources?: ReadonlyArray<string> | null, normalImportPct?: unknown } | null } | null,
 *   } | null,
 *   institutions?: ReadonlyArray<{ name?: unknown } | null> | null,
 *   resourceAnalysis?: { gaps?: ReadonlyArray<GapRow | null> | null, priorityNotes?: unknown } | null,
 *   economicViability?: { metrics?: { tradeAccess?: string | null } | null } | null,
 *   structuralViolations?: ReadonlyArray<{ severity?: unknown, institution?: unknown, group?: unknown, reason?: unknown }> | null,
 *   structuralSuggestions?: ReadonlyArray<{ reason?: unknown, suggested?: unknown }> | null,
 * } | null | undefined} PageRecord
 */

/**
 * What `arr` hands back for a value of type T: an array's own elements, none for anything else
 * (an `unknown` value may be any array, so its elements stay `unknown`). An absent value adds no
 * element type: `readonly string[] | undefined` hands back `string[]`, not `string[] | never[]`.
 * @template T
 * @typedef {unknown extends T ? unknown[] : NonNullable<T> extends ReadonlyArray<infer E> ? E[] : never[]} ArrOf
 */

/** @param {unknown} x @returns {string} */
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));
/** @template T @param {T} x @returns {ArrOf<T>} */
const arr = (x) => /** @type {ArrOf<T>} */ (Array.isArray(x) ? x : []);
/** @param {string} text a `recordGoods` text @param {string} word the singular word @returns {boolean} the word or its plural ("mineral salts" answers salt) */
const holds = (text, word) => text.includes(norm(word)) || text.includes(norm(`${word}s`));
/** @param {string} x */
const norm = (x) => ` ${x.toLowerCase().replace(/[_/()\-,.]+/g, ' ').replace(/\s+/g, ' ').trim()} `;

/**
 * What each chain's input is CALLED on the record (the economy's goods vocabulary and the
 * nearby-resource keys), and how the DM sentence names it. Keyed by the chain's key in
 * `RESOURCE_CHAINS`, never by an institution. `food` names the food record's source that
 * answers the input; `route` says a connected trade route brings it (caravans bring camels).
 * @type {Readonly<Record<string, { words: ReadonlyArray<string>, noun: string, raw?: string, plural?: boolean, food?: ReadonlyArray<string>, staple?: boolean, route?: boolean }>>}
 */
const CHAIN_INPUTS = Object.freeze({
  wool: { words: ['wool'], noun: 'wool' },
  flax: { words: ['flax', 'linen'], noun: 'flax' },
  grain: { words: ['grain', 'flour', 'grain fields', 'fertile floodplain'], noun: 'grain', food: ['grain', 'mill'], staple: true },
  grapes: { words: ['grapes', 'vineyard', 'vineyards'], noun: 'grapes', plural: true },
  livestock: { words: ['livestock', 'dairy', 'grazing land', 'cattle'], noun: 'livestock', food: ['livestock'] },
  ironOre: { words: ['iron', 'iron ore', 'iron deposits'], noun: 'iron ore' },
  copperOre: { words: ['copper', 'copper ore'], noun: 'copper ore' },
  preciousMetals: { words: ['precious metals', 'gold', 'silver'], noun: 'gold or silver ore' },
  timber: { words: ['timber', 'wood', 'lumber', 'managed forest'], noun: 'timber' },
  stone: { words: ['stone', 'stone quarry'], noun: 'stone' },
  clay: { words: ['clay', 'river clay'], noun: 'clay' },
  hides: { words: ['animal hides', 'hides', 'furs'], noun: 'hides', plural: true },
  fish: { words: ['fish', 'fishing grounds', 'river fish'], noun: 'fish', food: ['fish'] },
  gemstones: { words: ['gems', 'gemstones', 'gemstone deposits'], noun: 'gemstones', plural: true },
  sand: { words: ['glass sand', 'glass'], noun: 'glass sand', raw: 'glass sand' },
  herbs: { words: ['medicinal herbs', 'herbs'], noun: 'medicinal herbs', plural: true },
  alpineWool: { words: ['wool', 'alpine pasture'], noun: 'wool' },
  mountainTimber: { words: ['timber', 'wood', 'mountain timber'], noun: 'timber', raw: 'timber' },
  desertSalt: { words: ['salt', 'desert salt', 'salt flats', 'salt pans'], noun: 'salt' },
  desertGlass: { words: ['glass sand', 'glass'], noun: 'glass sand', raw: 'glass sand' },
  camelCaravan: { words: ['camel', 'camels', 'camel herds'], noun: 'camels', plural: true, route: true },
  oasisDate: { words: ['dates', 'date palms', 'oasis water'], noun: 'dates', plural: true },
  mineralHot: { words: ['hot springs', 'hot springs mineral', 'healing waters'], noun: 'water from the hot springs', raw: 'mineral hot springs' },
});

/** The catalogue tags of a house whose trade IS the route (a market, a caravanserai). */
const ROUTE_HOUSE_TAGS = Object.freeze(['market', 'transport']);

/**
 * The record's own goods, as one searchable text: what the economy produces, imports and
 * exports, and the nearby resources that are not depleted (their keys and their commodities).
 * @param {PageRecord} s
 */
function recordGoods(s) {
  const es = s?.economicState || {};
  const keys = availableNativeResourceKeys(s?.config || {});
  /** @type {string[]} */
  const goods = [
    ...arr(es.localProduction), ...arr(es.primaryImports), ...arr(es.primaryExports),
    ...keys, ...keys.flatMap((/** @type {string} */ k) => arr(/** @type {Readonly<Record<string, { commodities?: unknown } | undefined>>} */ (RESOURCE_DATA)[k]?.commodities)),
  ].map(str);
  return goods.map(norm).join('|');
}

/**
 * Whether the record answers a chain's input.
 * @param {PageRecord} s @param {string} chainKey @param {unknown} inst @param {string} goods from `recordGoods`
 */
function inputAnswered(s, chainKey, inst, goods) {
  const spec = CHAIN_INPUTS[chainKey];
  if (!spec) return true; // a chain this reader cannot name prints nothing (never a rule sentence)
  if (spec.words.some((w) => holds(goods, w))) return true;
  const food = s?.economicState?.foodSecurity?.foodRecord;
  if (food && spec.food && arr(food.foodSources).some((x) => spec.food?.includes(x))) return true;
  // The staple comes in by ordinary supply (hinterland carts, trade) when the food record says so.
  if (food && spec.staple && Number(food.normalImportPct) > 0) return true;
  const route = s?.config?.tradeRouteAccess ?? s?.economicState?.tradeAccess;
  const connected = Boolean(route) && !isTradeRouteDisconnected(route);
  if (connected && (spec.route || institutionHasAnyTag(inst, [...ROUTE_HOUSE_TAGS]))) return true;
  return false;
}

/** @param {{ name?: unknown } | null | undefined} inst @returns {string} the house as the sentence names it ("the potter") */
function houseWords(inst) {
  const name = str(institutionDisplayName(inst) || inst?.name).replace(/^access to (?:an? )?/i, '');
  return `the ${name.charAt(0).toLowerCase()}${name.slice(1)}`;
}

/** @param {string[]} nouns */
const orList = (nouns) => (nouns.length < 2 ? nouns.join('') : `${nouns.slice(0, -1).join(', ')} or ${nouns[nouns.length - 1]}`);

/** @typedef {(typeof RESOURCE_CHAINS)[keyof typeof RESOURCE_CHAINS]} ResourceChain */

/** @param {string} rawResource @returns {[string, ResourceChain]|null} the chain entry for a gap's raw resource */
const chainFor = (rawResource) => /** @type {[string, ResourceChain]|undefined} */ (
  Object.entries(RESOURCE_CHAINS).find(([, c]) => c.rawResource === rawResource)) || null;

/**
 * THE RESOURCE GAPS THE DM READS: only the gaps the record does not answer, in the house
 * voice, each once.
 *  - a house that works none of its inputs: "No clay reaches the potter." — only when the
 *    record holds none of the inputs the house could work (a smelter with iron ore coming in
 *    is not idle because it has no gold);
 *  - a raw resource no house works: "No one here works the stone near Ashford." — unless
 *    the economy already exports it;
 *  - a chain worked part-way: "Work on the glass sand here stops half-way: no glassblower
 *    finishes it."
 * @param {PageRecord} s the settlement record
 * @returns {GapLine[]}
 */
export function resourceGapLines(s) {
  const ra = s?.resourceAnalysis;
  const gaps = arr(ra?.gaps);
  if (!gaps.length) return [];
  const goods = recordGoods(s);
  const exportsText = arr(s?.economicState?.primaryExports).map(str).map(norm).join('|');
  const institutions = arr(s?.institutions);
  /** @type {GapLine[]} */
  const out = [];
  const said = new Set();
  /** @param {GapLine} line */
  const push = (line) => { if (!said.has(line.impact)) { said.add(line.impact); out.push(line); } };

  for (const g of gaps) {
    if (!g || typeof g !== 'object' || g.institution) continue;
    const entry = chainFor(str(g.chain));
    const spec = entry ? CHAIN_INPUTS[entry[0]] : null;
    const raw = (spec?.raw || str(resourceDisplayName(str(g.chain)))).toLowerCase();
    if (spec && spec.words.some((w) => holds(exportsText, w))) continue; // the economy sells it: someone works it
    const missing = arr(g.missing).map((n) => str(institutionDisplayName(n) || n)).filter(Boolean).map((n) => n.charAt(0).toLowerCase() + n.slice(1));
    if (/not being processed/.test(str(g.impact))) {
      push({ chain: null, impact: `No one here works the ${raw} near ${str(s?.name) || 'the place'}.`, severity: str(g.severity) || 'low' });
    } else if (missing.length) {
      push({ chain: null, impact: `Work on the ${raw} here stops half-way: no ${orList(missing)} finishes it.`, severity: str(g.severity) || 'medium' });
    }
  }

  // The houses the generator calls short of an input, grouped by house: one line per idle house.
  /** @type {Map<string, GapRow>} */
  const flagged = new Map();
  for (const g of gaps) if (g && typeof g === 'object' && g.institution) flagged.set(str(g.institution), g);
  for (const [name, g] of flagged) {
    const inst = institutions.find((i) => i?.name === name) || { name };
    const chains = Object.entries(RESOURCE_CHAINS).filter(([, c]) => arr(c.processingInstitutions).includes(name));
    if (chains.some(([key]) => inputAnswered(s, key, inst, goods))) continue;
    const specs = chains.map(([key]) => CHAIN_INPUTS[key]).filter(Boolean);
    const nouns = [...new Set(specs.map((x) => x.noun))];
    if (!nouns.length) continue;
    const plural = specs[specs.length - 1]?.plural === true && nouns.length === 1;
    push({ chain: null, impact: `No ${orList(nouns)} ${plural ? 'reach' : 'reaches'} ${houseWords(inst)}.`, severity: str(g.severity) || 'high' });
  }
  return out;
}

/**
 * THE ONE CRITICAL LIST: the record's critical issues, every one the verdict counts
 * (`metrics.criticalIssueCount` and the summary sentence count `severity === 'critical'`,
 * a stress consequence included). The Critical Issues header and the verdict read this list.
 * @param {ViabilityRecord} v the economicViability record
 * @returns {ViabilityIssue[]}
 */
export function criticalIssuesOf(v) {
  return arr(v?.issues).filter((i) => str(i?.severity).toLowerCase() === 'critical');
}

/**
 * The by-design contradictions the Viability tab lists (SW-B1, STYLE-RULINGS-2 B1(c)): the viability
 * issues and the structural violations marked `by_design`, one row per (type, institution, reason),
 * sorted by institution name (codepoint order). ONE reader of the fact: the tab prints this list and the DS-GEN-11 desk reads
 * its length, so the coherence line can never vouch above a by-design row the tab shows.
 * @param {ViabilityRecord} v the economicViability record
 * @param {{ structuralViolations?: ReadonlyArray<ViabilityIssue | null> | null } | null | undefined} s the settlement
 * @returns {ViabilityIssue[]}
 */
export function byDesignItemsOf(v, s) {
  /** @type {ViabilityIssue[]} */ const rows = [
    ...arr(v?.issues).filter((i) => i?.severity === 'by_design'),
    ...arr(s?.structuralViolations).filter((i) => i?.severity === 'by_design').map((i) => /** @type {ViabilityIssue} */ (i)),
  ];
  return rows.filter((item, index, all) => all.findIndex((c) => (
    c?.type === item?.type && c?.institution === item?.institution && c?.reason === item?.reason
  )) === index).sort((a, b) => compareCodepoint(/** @type {string} */ (a.institution || ''), /** @type {string} */ (b.institution || ''))); // the codepoint order (determinism lint), not the host's collation
}

/**
 * The stress effects that are NOT critical (a critical one is in `criticalIssuesOf`, once).
 * @param {ViabilityRecord} v the economicViability record
 * @returns {ViabilityIssue[]}
 */
export function stressEffectsOf(v) {
  return [...arr(v?.issues), ...arr(v?.warnings)].filter((i) => i?.type === 'stress_consequence' && str(i?.severity).toLowerCase() !== 'critical');
}

const NO_ROUTE_CLAUSE = / and has no dependable trade route\./;

/**
 * An issue's description as the DM reads it: "has no dependable trade route" only where the
 * record's route is disconnected. A connected route under siege is cut, not absent.
 * @param {ViabilityIssue | null | undefined} issue @param {PageRecord} s the settlement record
 * @returns {string}
 */
export function viabilityIssueText(issue, s) {
  const d = issue?.description;
  const text = typeof d === 'object' && d ? str(d.short || d.text) : str(d || issue?.message);
  if (!NO_ROUTE_CLAUSE.test(text)) return text;
  const route = s?.config?.tradeRouteAccess ?? s?.economicViability?.metrics?.tradeAccess;
  if (!route || isTradeRouteDisconnected(route)) return text;
  return text.replace(NO_ROUTE_CLAUSE, ' and its trade route is cut.');
}

/**
 * THE STAFF PANEL'S ROWS: the generator's own checks, verbatim, for an elevated viewer only.
 * @param {PageRecord} s the settlement record
 * @returns {Array<{ source: string, label: string, text: string }>}
 */
export function staffValidationRows(s) {
  /** @type {Array<{ source: string, label: string, text: string }>} */
  const rows = [];
  for (const v of arr(s?.structuralViolations)) {
    if (v?.severity === 'by_design') continue;
    rows.push({ source: 'structuralValidator', label: str(v?.institution || v?.group), text: str(v?.reason) });
  }
  for (const v of arr(s?.structuralSuggestions)) {
    const tail = arr(v?.suggested).length ? ` Consider: ${arr(v.suggested).join(', ')}.` : '';
    rows.push({ source: 'structuralSuggestion', label: '', text: `${str(v?.reason || v).trim().replace(/\.+$/, '')}.${tail}` });
  }
  for (const g of arr(s?.resourceAnalysis?.gaps)) {
    rows.push({ source: 'resourceGap', label: str(g?.chain), text: str(g?.impact || arr(g?.missing).join(', ')) });
  }
  for (const n of arr(s?.resourceAnalysis?.priorityNotes)) rows.push({ source: 'priorityNote', label: '', text: str(n) });
  return rows;
}
