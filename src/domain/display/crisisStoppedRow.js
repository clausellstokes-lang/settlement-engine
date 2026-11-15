/**
 * domain/display/crisisStoppedRow.js — A ROW OF ORDINARY TIMES UNDER A CRISIS, MARKED (TAIL-SERVICES, the chair's
 * ruling S1 of 2026-11-14; vetoable by the owner).
 *
 * A service's or a house's description is written for ordinary times: a bed for a traveller, merchants from distant
 * regions, performances nightly, bread as the staple. Under a siege, an outbreak or a famine the description is not
 * rewritten row by row. Instead:
 *   (i)  a row that LIVES ON what the crisis stops (its declaration in `data/crisisDependence.js`) is marked, the mark
 *        printed before its description (`stoppedRowMark`);
 *   (ii) the tab says once, at its head, that its descriptions are of ordinary times (`ordinaryTimesLine`).
 *
 * WHAT EACH CRISIS STOPS (the record's own crisis kinds, `facts/crisisKind.js :: crisisOf`):
 *   under_siege   nothing comes in or goes out by road, gate or water: travellers and goods, and the work beyond the gates
 *   plague_onset  travel is discouraged and people do not gather: travellers and gatherings (curtailed, not stopped)
 *   famine        the food the famine failed (`economicState.foodSecurity.foodRecord.failedSource`; a failed mill is
 *                 the grain's, and a record naming no source failed the crops, the grain): that food grows scarce
 *
 * A ROW WITH A WRITTEN CRISIS TWIN KEEPS ITS TWIN: a service whose description is the twin
 * `institutionServices.js :: SERVICE_DESC_SIBLINGS` wrote for that crisis already says the crisis, and is not marked
 * for it. A custom row declares nothing and is never marked. A town under none of the three crises marks nothing.
 *
 * ONE HOME: the Services tab and the Institutions tab read this leaf; the PDF and the Foundry journal print the same
 * rows and are to read it too (their seat's files).
 *
 * FOUR KINDS OF ROW (`rowStoppedBy(settlement, kind, row)`), one table, the same marks:
 *   'service'  a service row ({ name, desc }), by its name (or, for a name of two meanings, its description)
 *   'house'    a house, by its catalogue id (`catalogId`, else its name's)
 *   'chain'    a supply chain's row (the chair's ruling S6), by the record's `chainId` (`economicState.activeChains[]`)
 *   'income'   an income source's share (S6), by the record's `source` (`economicState.incomeSources[]`). A source a
 *              siege closes keeps its share and prints no description (`economy/incomeLineSiblings.js ::
 *              trueIncomeDesc`, SIEGE_CLOSED_SOURCES): the mark is the share's one reading of the siege. The economy's
 *              one income twin of a crisis (the alchemy trade under a siege) is a source that lives on none of these.
 *
 * THE SECOND CAUSE: A HOUSE SHORT OF ITS INPUT (the chair's ruling S5, 2026-11-15; vetoable by the owner). A row that
 * is what its house MAKES from what reaches it (declared `input` in the table: the vintner's wine, the potter's pots,
 * the dairy's milk) prints the trade of a house supplied. Where the page itself says no input reaches that house (the
 * Resources tab's gap line, `validationOnPage.js :: resourceGapLines`, "No grapes reach the vintner.", read of that
 * house's own gaps and nothing else: the same reading, so the mark and the gap line never disagree), the row is marked
 * short of it (`shortMarkText`: "Short of grapes."), and the tab says once that a row so marked is what its house makes
 * when supplied (`ordinaryTimesLine`'s second sentence). No vocabulary atom: the record's own gap is the fact. A custom
 * row is never marked; a calm town is read as a crisis town is (a gap is no crisis). A house whose gap the record holds in
 * nearly every town that holds it (`INPUT_GAP_HELD_EVERYWHERE`, the chair's ruling S7) is not marked: that gap is the
 * record's fault, not the town's state. One leaf, two causes: `rowMarkText`
 * gives both marks.
 *
 * Pure: no randomness, no clock, no write.
 */
import { resourceGapLines } from './validationOnPage.js';
import { crisisOf } from '../facts/crisisKind.js';
import { filterDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { SERVICE_DESC_SIBLINGS } from '../../data/institutionServices.js';
import {
  SERVICE_DEPENDENCE, SERVICE_DEPENDENCE_BY_DESC, HOUSE_DEPENDENCE, CHAIN_DEPENDENCE, INCOME_DEPENDENCE, INPUT_GAP_HELD_EVERYWHERE,
  TRAVELLERS, GOODS, GATHERINGS, GRAIN, LIVESTOCK, FISH, GAME, INPUT, GATES, NONE,
} from '../../data/crisisDependence.js';

/** The crises this leaf reads, in the order a row's mark takes them. @type {ReadonlyArray<string>} */
export const STOPPING_CRISES = Object.freeze(['under_siege', 'plague_onset', 'famine']);

/** The crisis as the page names it. VETOABLE wording. @type {Readonly<Record<string, string>>} */
const CRISIS_NOUN = Object.freeze({ under_siege: 'the siege', plague_onset: 'the outbreak', famine: 'the famine' });

/**
 * The mark before a row's description, by crisis. Each names its crisis, so each is DECLARED and handed to the list door
 * (`filterDeclared`): it prints only where the vocabulary's own reader holds that crisis in force. VETOABLE wording.
 * @type {ReadonlyArray<Readonly<{ text: string, needs: ReadonlyArray<string>, kind: string }>>}
 */
const MARK_LINES = Object.freeze([
  Object.freeze({ text: 'Stopped by the siege.', needs: Object.freeze(['crisis: under_siege']), kind: 'under_siege' }),
  Object.freeze({ text: 'Curtailed by the outbreak.', needs: Object.freeze(['crisis: plague_onset']), kind: 'plague_onset' }),
  Object.freeze({ text: 'Scarce in the famine.', needs: Object.freeze(['crisis: famine']), kind: 'famine' }),
]);

/** The marks the door admits for one record, read once a record. @type {WeakMap<object, ReadonlyArray<{ text: string, kind: string }>>} */
const ADMITTED = new WeakMap();

/**
 * The mark for this crisis in this place, through the list door; null where the door refuses it.
 * @param {object | null | undefined} settlement @param {string | null} crisis
 * @returns {string | null}
 */
export function crisisMarkText(settlement, crisis) {
  if (!crisis || !settlement || typeof settlement !== 'object') return null;
  let admitted = ADMITTED.get(settlement);
  if (!admitted) {
    admitted = filterDeclared(MARK_LINES, { facts: () => factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (settlement)), poolId: 'crisisStoppedRow:mark', surface: 'services', drawKind: 'A' });
    ADMITTED.set(settlement, admitted);
  }
  const line = admitted.find((l) => l.kind === crisis);
  return line ? lineText(line) : null;
}

/** The same, as one word after a service's name where no description prints (the Institutions tab's doors). VETOABLE. @type {Readonly<Record<string, string>>} */
export const STOPPED_WORD = Object.freeze({ under_siege: 'stopped', plague_onset: 'curtailed', famine: 'scarce' });

/** The food a failed source names. @type {Readonly<Record<string, string>>} */
const FOOD_OF_FAILED_SOURCE = Object.freeze({ grain: GRAIN, mill: GRAIN, livestock: LIVESTOCK, fish: FISH, game: GAME });

/**
 * The dependences a crisis stops in this place.
 * @param {string} kind @param {object | null | undefined} settlement
 * @returns {ReadonlyArray<string>}
 */
function stoppedBy(kind, settlement) {
  if (kind === 'under_siege') return [TRAVELLERS, GOODS, GATES];
  if (kind === 'plague_onset') return [TRAVELLERS, GATHERINGS];
  if (kind === 'famine') {
    const failed = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } } } } | null | undefined} */ (settlement)
      ?.economicState?.foodSecurity?.foodRecord?.failedSource;
    // A famine whose record names no source failed "the crops" (foodBalance.js's own hook, FAILED_SOURCE_WORDS' fallback): the grain.
    const food = typeof failed === 'string' ? FOOD_OF_FAILED_SOURCE[failed] : GRAIN;
    return food ? [food] : [];
  }
  return [];
}

/**
 * The three crises active in this place, in the leaf's order.
 * @param {object | null | undefined} settlement
 * @returns {string[]}
 */
export function stoppingCrisesOf(settlement) {
  const facts = crisisOf(settlement);
  return STOPPING_CRISES.filter((kind) => facts.kinds.includes(kind));
}

/**
 * What a service row lives on: the row's own description's line, else its name's, else none.
 * @param {{ name?: unknown, desc?: unknown }} row
 * @returns {ReadonlyArray<string>}
 */
export function serviceDependenceOf(row) {
  const name = typeof row?.name === 'string' ? row.name : '';
  const desc = typeof row?.desc === 'string' ? row.desc : '';
  const byDesc = Object.prototype.hasOwnProperty.call(SERVICE_DEPENDENCE_BY_DESC, name) ? SERVICE_DEPENDENCE_BY_DESC[name] : null;
  if (byDesc && Object.prototype.hasOwnProperty.call(byDesc, desc)) return byDesc[desc];
  return Object.prototype.hasOwnProperty.call(SERVICE_DEPENDENCE, name) ? SERVICE_DEPENDENCE[name] : NONE;
}

/**
 * What a house lives on, by its catalogue id (the record's `catalogId`, else its name's).
 * @param {{ catalogId?: unknown, name?: unknown }} inst
 * @returns {ReadonlyArray<string>}
 */
export function houseDependenceOf(inst) {
  const id = typeof inst?.catalogId === 'string' && inst.catalogId ? inst.catalogId : catalogIdForName(typeof inst?.name === 'string' ? inst.name : null);
  return id && Object.prototype.hasOwnProperty.call(HOUSE_DEPENDENCE, id) ? HOUSE_DEPENDENCE[id] : NONE;
}

/**
 * What a supply chain lives on, by the record's chain id (`chainId`, else a bare `id`).
 * @param {{ chainId?: unknown, id?: unknown }} chain
 * @returns {ReadonlyArray<string>}
 */
export function chainDependenceOf(chain) {
  const id = typeof chain?.chainId === 'string' ? chain.chainId : typeof chain?.id === 'string' ? chain.id : '';
  return Object.prototype.hasOwnProperty.call(CHAIN_DEPENDENCE, id) ? CHAIN_DEPENDENCE[id] : NONE;
}

/**
 * What an income source's share lives on, by the record's title (`source`).
 * @param {{ source?: unknown }} income
 * @returns {ReadonlyArray<string>}
 */
export function incomeDependenceOf(income) {
  const source = typeof income?.source === 'string' ? income.source.trim() : '';
  return Object.prototype.hasOwnProperty.call(INCOME_DEPENDENCE, source) ? INCOME_DEPENDENCE[source] : NONE;
}

/** Each kind of row's reader of the table. @type {Readonly<Record<string, (row: any) => ReadonlyArray<string>>>} */
const DEPENDENCE_OF = Object.freeze({ service: serviceDependenceOf, house: houseDependenceOf, chain: chainDependenceOf, income: incomeDependenceOf });

/**
 * Is this row's description the twin written for this crisis?
 * @param {string} desc @param {string} kind
 * @returns {boolean}
 */
function isCrisisTwin(desc, kind) {
  for (const set of Object.values(SERVICE_DESC_SIBLINGS)) {
    for (const line of /** @type {ReadonlyArray<{ text?: string, crisis?: ReadonlyArray<string> }>} */ (set)) {
      if (line?.text === desc && Array.isArray(line.crisis) && line.crisis.includes(kind)) return true;
    }
  }
  return false;
}

/**
 * @param {Record<string, unknown> | null | undefined} row
 * @returns {boolean}
 */
const isCustom = (row) => row?.custom === true || row?.source === 'custom' || row?.isCustom === true;

/**
 * The crisis that stops this row, or null.
 * @param {object | null | undefined} settlement
 * @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row a service row ({ name, desc, institution }), a house, a chain
 *   (`economicState.activeChains[]`) or an income source (`economicState.incomeSources[]`)
 * @param {string[]} [crises] the active stopping crises (read from the record when absent)
 * @returns {string | null}
 */
export function rowStoppedBy(settlement, kind, row, crises = stoppingCrisesOf(settlement)) {
  if (!row || typeof row !== 'object' || isCustom(row) || crises.length === 0) return null;
  const read = Object.prototype.hasOwnProperty.call(DEPENDENCE_OF, kind) ? DEPENDENCE_OF[kind] : null;
  if (!read) return null;
  const deps = read(row);
  if (deps.length === 0) return null;
  const desc = typeof row.desc === 'string' ? row.desc : '';
  for (const crisis of crises) {
    if (kind === 'service' && isCrisisTwin(desc, crisis)) continue;
    const stops = stoppedBy(crisis, settlement);
    if (deps.some((d) => stops.includes(d))) return crisis;
  }
  return null;
}

/**
 * The mark printed before a row's description, or null.
 * @param {object | null | undefined} settlement
 * @param {'service' | 'house' | 'chain' | 'income'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @param {string[]} [crises]
 * @returns {string | null}
 */
export function stoppedRowMark(settlement, kind, row, crises) {
  return crisisMarkText(settlement, rowStoppedBy(settlement, kind, row, crises));
}

/**
 * The description as the tab prints it: the mark, then the description of ordinary times.
 * @param {string | null} mark @param {unknown} desc
 * @returns {string}
 */
export function markedDescription(mark, desc) {
  const text = typeof desc === 'string' ? desc.trim() : '';
  if (!mark) return text;
  return text ? `${mark} ${text}` : mark;
}

/** The head's sentence where a row is marked short of its input (S5). VETOABLE wording. */
export const SUPPLIED_LINE = 'A row marked short is what its house makes when supplied.';

/**
 * The tab's one head line where at least one of its rows is marked; else null. VETOABLE wording.
 * @param {string[]} crises the crises that marked a row on this tab, in the leaf's order
 * @param {boolean} [shortMarked] whether a row of the tab is marked short of its input (S5)
 * @returns {string | null}
 */
export function ordinaryTimesLine(crises, shortMarked = false) {
  const nouns = STOPPING_CRISES.filter((k) => crises.includes(k)).map((k) => CRISIS_NOUN[k]);
  const supplied = shortMarked ? SUPPLIED_LINE : null;
  if (nouns.length === 0) return supplied;
  const list = nouns.length === 1 ? nouns[0] : `${nouns.slice(0, -1).join(', ')} and ${nouns[nouns.length - 1]}`;
  const head = nouns.length === 1
    ? `The descriptions here are of ordinary times. While ${list} lasts, a row it touches is marked.`
    : `The descriptions here are of ordinary times. While ${list} last, a row they touch is marked.`;
  return supplied ? `${head} ${supplied}` : head;
}

/** The page's gap line of a house short of its input: "No <input> reach(es) <the house>." */
const SHORT_LINE = /^No (.+?) reach(?:es)? .+\.$/;

/** The houses the page says no input reaches, by roster name -> the input as the line names it; read once a record. @type {WeakMap<object, ReadonlyMap<string, string>>} */
const SHORT_HOUSES = new WeakMap();

/**
 * The houses of this place short of their input, BY THE PAGE'S OWN GAP LINE: each house's gaps read alone through
 * `resourceGapLines`, so a house is short exactly where the Resources tab says "No … reaches the …" of it.
 * @param {object | null | undefined} settlement
 * @returns {ReadonlyMap<string, string>} house name -> the input ("grapes", "clay", "glass sand")
 */
export function housesShortOfInput(settlement) {
  if (!settlement || typeof settlement !== 'object') return new Map();
  const cached = SHORT_HOUSES.get(settlement);
  if (cached) return cached;
  const s = /** @type {{ resourceAnalysis?: { gaps?: unknown } | null }} */ (settlement);
  const gaps = Array.isArray(s.resourceAnalysis?.gaps) ? /** @type {Array<{ institution?: unknown }>} */ (s.resourceAnalysis.gaps) : [];
  /** @type {Map<string, string>} */
  const out = new Map();
  const houses = [...new Set(gaps.map((g) => (g && typeof g.institution === 'string' ? g.institution : '')).filter(Boolean))];
  for (const house of houses) {
    if (Object.prototype.hasOwnProperty.call(INPUT_GAP_HELD_EVERYWHERE, house)) continue; // S7: the record's fault, not the town's state
    const own = gaps.filter((g) => g?.institution === house);
    const lines = resourceGapLines(/** @type {Parameters<typeof resourceGapLines>[0]} */ ({ ...settlement, resourceAnalysis: { ...s.resourceAnalysis, gaps: own } }));
    const said = lines.map((l) => SHORT_LINE.exec(String(l?.impact ?? ''))).find(Boolean);
    if (said) out.set(house, said[1]);
  }
  SHORT_HOUSES.set(settlement, out);
  return out;
}

/**
 * The input this row's house is short of, or null: a row declared `input` whose house the page says no input reaches.
 * @param {object | null | undefined} settlement
 * @param {'service' | 'house'} kind
 * @param {Record<string, unknown> | null | undefined} row a service row ({ name, desc, institution }) or a house
 * @returns {string | null}
 */
export function rowShortOf(settlement, kind, row) {
  if (!row || typeof row !== 'object' || isCustom(row)) return null;
  const deps = kind === 'house' ? houseDependenceOf(row) : kind === 'service' ? serviceDependenceOf(row) : NONE;
  if (!deps.includes(INPUT)) return null;
  const house = kind === 'house' ? row.name : row.institution;
  if (typeof house !== 'string' || !house) return null;
  return housesShortOfInput(settlement).get(house) ?? null;
}

/**
 * The mark for a row short of its input. Four words at most (a mark repeats on a house's rows: X-50 counts a sentence
 * at five): an input the line names in more words is "its materials". VETOABLE wording.
 * @param {string | null} input
 * @returns {string | null}
 */
export function shortMarkText(input) {
  if (!input) return null;
  return input.split(/\s+/).length <= 2 ? `Short of ${input}.` : 'Short of its materials.';
}

/** The same, as one word after a service's name where no description prints (the Institutions tab's doors). VETOABLE. */
export const SHORT_WORD = 'short';

/**
 * Every mark a row takes, in order: its crisis's, then its input's; null where it takes none.
 * @param {object | null | undefined} settlement
 * @param {'service' | 'house'} kind
 * @param {Record<string, unknown> | null | undefined} row
 * @param {string[]} [crises]
 * @returns {string | null}
 */
export function rowMarkText(settlement, kind, row, crises) {
  const marks = [stoppedRowMark(settlement, kind, row, crises), shortMarkText(rowShortOf(settlement, kind, row))].filter(Boolean);
  return marks.length ? marks.join(' ') : null;
}

