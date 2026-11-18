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
 *   under_siege   nothing comes in or goes out by road, gate or water: travellers and goods, and the work beyond the gates;
 *                 the land the town still works is curtailed, not stopped (SV8, `CURTAILED_BY`: "Curtailed by the siege.")
 *   plague_onset  travel is discouraged and people do not gather: travellers and gatherings (curtailed, not stopped)
 *   famine        the food the famine failed (`economicState.foodSecurity.foodRecord.failedSource`; a failed mill is
 *                 the grain's, and a record naming no source failed the crops, the grain): that food grows scarce
 *   wartime       (BAR5-MARKS, the chair's ruling WM1 of 2026-11-16; vetoable by the owner) ONLY what the page itself says
 *                 the war took (`facts/warReach.js :: warTakesOf`): the iron, where the war's iron hook prints; the working
 *                 animals, where the paddocks' line prints. A war whose page says neither stops nothing here. The mark is
 *                 "Curtailed by the war.": the forge works what scrap it holds, the stables what the army left
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
 * gives both marks. THE SECOND CAUSE'S SECOND READING (SV6, 2026-11-15): a house that makes from what reaches it, on a ground
 * the page itself prints as depleted and no import feeds, is short of it as a gapped house is (`housesOnSpentGround`).
 *
 * A SERVICE ROW CARRIES THE MARK ITS HOUSE CARRIES (BAR2-SERVICES, the chair's ruling SV1 of 2026-11-15; vetoable by the
 * owner): a service row lives on its own line AND on its house's (`serviceRowDependence`), so where the house's row is
 * stopped, curtailed or short of its input, the house's rows that live on the same thing take the same mark (the quarry
 * "Stopped by the siege." and its "Cut stone" with it; the fair's spectacles with the fair; the bakers' pastries with their
 * bread). The one exception is declared, row by row: `crisisDependence.js :: SERVICE_FREE_OF_HOUSE`.
 *
 * THE MARK'S PROMISE (BAR4-SERVICES, the chair's direction S1 of 2026-11-16; vetoable by the owner; the detector
 * `tests/helpers/markPromise.js`): two rows the crisis touched printed bare beside the head line's promise.
 *   (i)  A HOUSE ON AN IMPORTED INPUT UNDER A SIEGE: where the record says the house's input comes in by trade
 *        (`resourceAnalysis.gaps[]`, `kind: 'imported'`: "Smelter runs on imported iron ore"), the house and its rows that
 *        live on that input take the siege's partial kind, "Curtailed by the siege." (`IMPORTED_INPUT`, `CURTAILED_BY`): it
 *        works what it holds, and nothing more comes in (the smelter's iron refining beside the impaired smiths).
 *   (ii) AN INCOME SHARE OF A HOUSE'S TRADE READS ITS HOUSES: a share titled by a resource trade
 *        (`crisisDependence.js :: INCOME_TRADE_HOUSES`: "Stone Quarrying", the fish trades) whose every live house of that
 *        trade the leaf marks takes the mildest of their marks (the quarry "Stopped by the siege." and its share with it).
 *
 * Pure: no randomness, no clock, no write.
 */
import { resourceGapLines } from './validationOnPage.js';
import { housesOnSpentGround, housesShortOf, housesWantingTradeInput, impliedGroundsOnPage, ventureHouseOf } from '../facts/houseInputAtHand.js'; // BAR4-SCENES-2 (HW1): the spent-ground reading's one home; BIRTH-2: the failed venture
import { FAMILY_NOUN, GROUND_YIELD, STORY_OF_RECORD, sourceStoryOf, ventureMarkText } from '../facts/supplyStory.js';
import { MATERIAL_OF } from '../facts/houseKinds.js'; // LEFT-MARKS M7: a house's material, by family // BIRTH-2: the failed venture's mark; BIRTH-3: the whole record's story
import { resourceShortageImport } from '../resourceSemantics.js'; // BIRTH-3: the spent ground's word, handed to the source story
import { crisisOf } from '../facts/crisisKind.js';
import { warTakesOf, WAR_TAKES_IRON, WAR_TAKES_ANIMALS } from '../facts/warReach.js'; // BAR5-MARKS (WM1): what the war takes, one home
import { filterDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { houseDependenceOf, HOUSE_TRADE_INPUT, SURPLUS_HOUSES } from '../../data/crisisDependence.js'; // BAR7-ECON item 5: its one home, beside its table; LEFT-MARKS item 4: the houses of a surplus
import { foodRowShown } from './foodRowShown.js'; // LEFT-MARKS item 4: the page's food line, as the Economics tab prints it
import { carriersOf } from './foodCarrier.js';
import { hasTradeRouteConnection } from '../tradeRouteSemantics.js'; // LEFT-MARKS item 4: BIRTH-1's calm road
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { SERVICE_DESC_SIBLINGS } from '../../data/institutionServices.js';
import { serviceRowsOf } from '../dossier/entityLinks.js';
import { chainCrisisStateShown } from './chainStateShown.js';
import {
  SERVICE_DEPENDENCE, SERVICE_DEPENDENCE_BY_DESC, CHAIN_DEPENDENCE, INCOME_DEPENDENCE, INPUT_GAP_HELD_EVERYWHERE, SERVICE_FREE_OF_HOUSE,
  SIEGE_TWINS_ON_OFFER, GATES_WORK_HELD_BY_RECORD, TRAVELLERS, GOODS, GATHERINGS, GRAIN, LIVESTOCK, FISH, GAME, INPUT, GATES, FIELD_WORK, IMPORTED_INPUT, INCOME_TRADE_HOUSES, NONE,
  IRON, WORKING_ANIMALS, INPUT_IMPORTED_AS, INCOME_REMEDY_HOUSES, INCOME_CLOTH_HOUSES,
} from '../../data/crisisDependence.js';
import { canonImports } from '../canonicalAccessors.js';

/** The crises this leaf reads, in the order a row's mark takes them. @type {ReadonlyArray<string>} */
export const STOPPING_CRISES = Object.freeze(['under_siege', 'plague_onset', 'famine', 'wartime']); // BAR5-MARKS (WM1): the war, last

/** The crisis as the page names it. VETOABLE wording. @type {Readonly<Record<string, string>>} */
const CRISIS_NOUN = Object.freeze({ under_siege: 'the siege', plague_onset: 'the outbreak', famine: 'the famine', wartime: 'the war' });
/** The crisis's noun as the page's lines name it ("the siege"), or null (BAR7-ECON item 6: the empty export line). @param {string} crisis @returns {string | null} */
export const crisisNounOf = (crisis) => (Object.prototype.hasOwnProperty.call(CRISIS_NOUN, crisis) ? CRISIS_NOUN[/** @type {keyof typeof CRISIS_NOUN} */ (crisis)] : null);

/**
 * The mark before a row's description, by crisis. Each names its crisis, so each is DECLARED and handed to the list door
 * (`filterDeclared`): it prints only where the vocabulary's own reader holds that crisis in force. VETOABLE wording.
 * @type {ReadonlyArray<Readonly<{ text: string, needs: ReadonlyArray<string>, kind: string }>>}
 */
const MARK_LINES = Object.freeze([
  Object.freeze({ text: 'Stopped by the siege.', needs: Object.freeze(['crisis: under_siege']), kind: 'under_siege' }),
  Object.freeze({ text: 'Curtailed by the outbreak.', needs: Object.freeze(['crisis: plague_onset']), kind: 'plague_onset' }),
  Object.freeze({ text: 'Scarce in the famine.', needs: Object.freeze(['crisis: famine']), kind: 'famine' }),
  // SV7 (the chair's ruling, 2026-11-15; vetoable by the owner): a house the siege stops but for a row of its own that goes on
  Object.freeze({ text: 'Curtailed by the siege.', needs: Object.freeze(['crisis: under_siege']), kind: 'under_siege:curtailed' }),
  // WM1 (the chair's ruling, 2026-11-16; vetoable by the owner): what the page says the war took, curtailed and not stopped
  Object.freeze({ text: 'Curtailed by the war.', needs: Object.freeze(['crisis: wartime']), kind: 'wartime' }),
]);

/**
 * A HOUSE IS "STOPPED" ONLY IF EVERY ROW OF IT IS STOPPED (BAR3-SERVICES-2, the chair's ruling SV7 of 2026-11-15; vetoable
 * by the owner). Where the siege stops a house but a row of its own prints on offer beside it (a row
 * `crisisDependence.js :: SERVICE_FREE_OF_HOUSE` declares free of what the siege stops: the district inns' "Entertainment",
 * the luxury quarter's "Custom commissions", the cemetery's "Central register"), the house's mark is the siege's partial
 * kind, "Curtailed by the siege."; the rows keep their own marks. A row whose description is the siege's own twin says in
 * its own words what the siege did to it and is not on offer in ordinary wording. The outbreak's mark already reads
 * "Curtailed"; the famine's "Scarce" is true of a house partly scarce: neither takes a partial kind.
 * @type {Readonly<Record<string, string>>}
 */
const PARTLY_STOPPED_KIND = Object.freeze({ under_siege: 'under_siege:curtailed' });

/**
 * WHAT A CRISIS CURTAILS AND DOES NOT STOP (BAR3-SERVICES-3, the chair's ruling SV8 of 2026-11-15; vetoable by the owner):
 * under a siege, the town's own land worked (`crisisDependence.js :: FIELD_WORK`: the fields, herds, hives, woods, pits and
 * pans), by the record's own reading of the siege (a third of the yield kept; every own-ground chain "impaired"). A row
 * living on it alone takes the siege's partial kind, "Curtailed by the siege."; a row living on what the siege stops as
 * well is stopped.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const CURTAILED_BY = Object.freeze({ under_siege: Object.freeze([FIELD_WORK, IMPORTED_INPUT]) }); // BAR4-SERVICES S1 (i): an imported input

/** A partial kind's crisis, a crisis's itself. @param {string} kind @returns {string} */
export function crisisOfMarkKind(kind) {
  const i = typeof kind === 'string' ? kind.indexOf(':') : -1;
  return i > 0 ? kind.slice(0, i) : kind;
}

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
export const STOPPED_WORD = Object.freeze({ under_siege: 'stopped', plague_onset: 'curtailed', famine: 'scarce', 'under_siege:curtailed': 'curtailed', wartime: 'curtailed' });

/** The food a failed source names. @type {Readonly<Record<string, string>>} */
const FOOD_OF_FAILED_SOURCE = Object.freeze({ grain: GRAIN, mill: GRAIN, livestock: LIVESTOCK, fish: FISH, game: GAME });

/**
 * The dependences a crisis stops in this place.
 * @param {string} kind @param {object | null | undefined} settlement
 * @returns {ReadonlyArray<string>}
 */
function stoppedBy(kind, settlement) {
  if (kind === 'under_siege') return noHerdsHere(settlement) ? [TRAVELLERS, GOODS, GATES, LIVESTOCK] : [TRAVELLERS, GOODS, GATES];
  if (kind === 'plague_onset') return [TRAVELLERS, GATHERINGS];
  if (kind === 'famine') {
    const failed = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { failedSource?: unknown } } } } | null | undefined} */ (settlement)
      ?.economicState?.foodSecurity?.foodRecord?.failedSource;
    // A famine whose record names no source failed "the crops" (foodBalance.js's own hook, FAILED_SOURCE_WORDS' fallback): the grain.
    const food = typeof failed === 'string' ? FOOD_OF_FAILED_SOURCE[failed] : GRAIN;
    return food ? [food, ...harvestFoodsScarce(settlement, food)] : [];
  }
  if (kind === 'wartime') {
    // WM1: what the page says the war took, and nothing more
    const takes = warTakesOf(settlement);
    return [...(takes.includes(WAR_TAKES_IRON) ? [IRON] : []), ...(takes.includes(WAR_TAKES_ANIMALS) ? [WORKING_ANIMALS] : [])];
  }
  return [];
}

/**
 * BAR6-MARKS (LAW 8's 8c, BRIEF-BAR6 fact (c), 2026-11-16; vetoable by the owner): THE FAMINE'S SCARCE GOODS AS THE PAGE
 * MARKS THEM ON THE INCOME ROW. An income share that lives on the crops and on another food (the small places' "Harvest":
 * "What the households grow and raise on their holdings", the crops and the herds) is printed "Scarce in the famine."
 * wherever one of its foods failed; where the herds failed, the harvest's crop is read scarce with it by the rows that sell
 * or work the grain (the farmland's "Grain at harvest" beside a "Harvest Scarce in the famine" in a town whose grain comes
 * in at four times the price; the maltster that only runs on a grain surplus). The herds are not read scarce where the
 * crop failed (a famine of the fields leaves the flocks). The record's own shares are read (`incomeSources[]`, by their
 * title's line in `INCOME_DEPENDENCE`); a town with no such share adds nothing.
 * @param {object | null | undefined} settlement @param {string} food the failed food's dependence word
 * @returns {string[]} the grain, where the page marks it scarce with the failed food
 */
function harvestFoodsScarce(settlement, food) {
  const shares = /** @type {{ economicState?: { incomeSources?: unknown } | null } | null | undefined} */ (settlement)?.economicState?.incomeSources;
  /** @type {Set<string>} */
  const out = new Set();
  for (const share of Array.isArray(shares) ? shares : []) {
    const deps = incomeDependenceOf(/** @type {{ source?: unknown }} */ (share));
    if (deps.includes(food) && food !== GRAIN && deps.includes(GRAIN)) out.add(GRAIN);
  }
  return [...out];
}

/**
 * BAR5-MARKS (LAW 2's `L2.famine.meat`, 2026-11-16; vetoable by the owner): under a siege nothing comes in, so the meat of
 * a town that raises no herds of its own is not to be had: the food record's own sources (`foodRecord.foodSources`, the
 * page's food line) name no livestock and the food ledger's pastoral chain is off. A town whose record states neither is not
 * read (nothing is guessed).
 * @param {object | null | undefined} settlement
 * @returns {boolean}
 */
function noHerdsHere(settlement) {
  const food = /** @type {{ economicState?: { foodSecurity?: { chains?: Record<string, unknown> | null, foodRecord?: { foodSources?: unknown } | null } | null } | null } | null | undefined} */ (settlement)
    ?.economicState?.foodSecurity;
  const sources = food?.foodRecord?.foodSources;
  // and the food ledger's own pastoral chain is off (a shepherd's town keeps its herds whatever the sources list)
  if (!(Array.isArray(sources) && !sources.includes('livestock') && food?.chains?.['Pastoral & livestock'] === false)) return false;
  // and no house of the town's own herds stands (a house declared on both the herds and the land it works: the shepherd,
  // the dairy farmer): its flocks are here, whatever the ledger counts (bar3ServicesRows' r2s-under_siege-hamlet-2)
  return !liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .some((h) => h && typeof h.name === 'string' && !isCustom(h) && houseDependenceOf(h).includes(LIVESTOCK) && houseDependenceOf(h).includes(FIELD_WORK));
}

/**
 * The stopping crises active in this place, in the leaf's order.
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

/** Each record's houses by roster name, read once a record. @type {WeakMap<object, ReadonlyMap<string, Record<string, unknown>>>} */
const HOUSES_BY_NAME = new WeakMap();

/**
 * The house a service row belongs to (the record's `institutions[]` entry its `institution` names), else a bare
 * `{ name }` (the catalogue still knows the name).
 * @param {object | null | undefined} settlement @param {{ institution?: unknown }} row
 * @returns {Record<string, unknown> | null}
 */
function houseOfServiceRow(settlement, row) {
  const name = typeof row?.institution === 'string' ? row.institution : '';
  if (!name) return null;
  let houses = settlement && typeof settlement === 'object' ? HOUSES_BY_NAME.get(settlement) : undefined;
  if (!houses && settlement && typeof settlement === 'object') {
    // the LIVE roster (a ruined house is read by its name from the catalogue, as a bare row is): the ruin-filter law
    houses = new Map(liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement)).filter((i) => i && typeof i.name === 'string').map((i) => [i.name, i]));
    HOUSES_BY_NAME.set(settlement, houses);
  }
  return houses?.get(name) ?? { name };
}

/**
 * What a service row lives on IN THIS PLACE (SV1): its own line, and its house's line but for what
 * `SERVICE_FREE_OF_HOUSE` declares the row free of. A custom house declares nothing.
 * @param {object | null | undefined} settlement @param {{ name?: unknown, desc?: unknown, institution?: unknown }} row
 * @returns {ReadonlyArray<string>}
 */
export function serviceRowDependence(settlement, row) {
  const own = serviceDependenceOf(row);
  const house = houseOfServiceRow(settlement, row);
  if (!house || isCustom(house)) return own;
  const houseDeps = houseDependenceIn(settlement, house).filter((d) => d !== IMPORTED_INPUT);
  const id = typeof house.catalogId === 'string' && house.catalogId ? house.catalogId : catalogIdForName(typeof house.name === 'string' ? house.name : null);
  const name = typeof row?.name === 'string' ? row.name : '';
  const freeOf = id && Object.prototype.hasOwnProperty.call(SERVICE_FREE_OF_HOUSE, id) && Object.prototype.hasOwnProperty.call(SERVICE_FREE_OF_HOUSE[id], name)
    ? SERVICE_FREE_OF_HOUSE[id][name] : NONE;
  const inherited = houseDeps.filter((d) => !own.includes(d) && !freeOf.includes(d));
  const deps = inherited.length ? [...own, ...inherited] : own;
  // S1 (i): a row that lives on its house's input, where that input comes in by trade, under a siege (BAR8 MARKS-2: or on a
  // house whose input the siege's reading of the imports alone declares, `boughtByNameOnly`)
  return (deps.includes(INPUT) || boughtByNameOnly(house)) && onImportedInputUnderSiege(settlement, house) ? [...deps, IMPORTED_INPUT] : deps;
}

/** Each record's houses the record says run on an imported input, read once a record. @type {WeakMap<object, ReadonlySet<string>>} */
const IMPORTED_HOUSES = new WeakMap();

/**
 * S1 (i): the houses whose input the record says comes in by trade (`resourceAnalysis.gaps[]`, `kind: 'imported'`).
 * @param {object | null | undefined} settlement
 * @returns {ReadonlySet<string>} house names
 */
export function housesOnImportedInput(settlement) {
  if (!settlement || typeof settlement !== 'object') return new Set();
  const cached = IMPORTED_HOUSES.get(settlement);
  if (cached) return cached;
  const s = /** @type {{ resourceAnalysis?: { gaps?: unknown } | null }} */ (settlement);
  const gaps = Array.isArray(s.resourceAnalysis?.gaps) ? /** @type {Array<{ institution?: unknown, kind?: unknown }>} */ (s.resourceAnalysis.gaps) : [];
  const out = new Set(gaps.filter((g) => g && g.kind === 'imported' && typeof g.institution === 'string' && g.institution).map((g) => /** @type {string} */ (g.institution)));
  // BAR5-MARKS (L2.siege.cutgood): a house whose input the record's imports bring by its own name (`INPUT_IMPORTED_AS`)
  const imports = canonImports(/** @type {Parameters<typeof canonImports>[0]} */ (settlement)).map((x) => (typeof x === 'string' ? x : String(/** @type {{ name?: unknown }} */ (x)?.name ?? '')).toLowerCase());
  for (const house of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))) {
    if (!house || typeof house.name !== 'string' || isCustom(house)) continue;
    const id = typeof house.catalogId === 'string' && house.catalogId ? house.catalogId : catalogIdForName(house.name);
    const good = id && Object.prototype.hasOwnProperty.call(INPUT_IMPORTED_AS, id) ? INPUT_IMPORTED_AS[id] : null;
    if (good && imports.some((x) => new RegExp(`\\b(?:${good})\\b`).test(x))) out.add(house.name); // BAR8 MARKS-2: a value of several words is any one of them
    // BAR8 MARKS-2 item 2 (K's 12a): or the house is the one house of a chain that IS the trade in its material (the chain
    // lives on goods: the furs brought from the north, `furs_north`), so its material comes in by that trade
    else if (good && ownTradeChainOf(settlement, house.name)) out.add(house.name);
  }
  // BAR6-MARKS (8a.input, fact (a)): a house whose trade is a good no gap speaks of, which the imports bring
  for (const [house, want] of housesWantingTradeInput(settlement)) if (want.reach === 'imported') out.add(house);
  IMPORTED_HOUSES.set(settlement, out);
  return out;
}

/**
 * BAR8 MARKS-2 item 2 (K's 12a; vetoable by the owner): is this house the one house of a chain of the record that lives on
 * goods (`CHAIN_DEPENDENCE`: the trade itself, as the furs brought from the north)? The furrier's district is its furs chain's
 * one house; under a siege the chain prints "Stopped by the siege." and the district works the pelts it holds.
 * @param {object} settlement @param {string} name a roster house's name @returns {boolean}
 */
function ownTradeChainOf(settlement, name) {
  const chains = /** @type {{ economicState?: { activeChains?: unknown } | null }} */ (settlement).economicState?.activeChains;
  return (Array.isArray(chains) ? chains : []).some((c) => c && Array.isArray(c.processingInstitutions) && c.processingInstitutions.length === 1
    && c.processingInstitutions[0] === name && typeof c.chainId === 'string' && Object.prototype.hasOwnProperty.call(CHAIN_DEPENDENCE, c.chainId)
    && CHAIN_DEPENDENCE[c.chainId].includes(GOODS));
}

/**
 * Is this house on an imported input, and a siege in force here?
 * @param {object | null | undefined} settlement @param {{ name?: unknown }} house
 * @returns {boolean}
 */
function onImportedInputUnderSiege(settlement, house) {
  return typeof house?.name === 'string' && housesOnImportedInput(settlement).has(house.name) && stoppingCrisesOf(settlement).includes('under_siege');
}

/**
 * BAR8 MARKS-2 items 1 and 2 (J's 11e.siegeBought, K's 12a; the sixth chair's BRIEF-BAR8, 2026-11-17; vetoable by the owner):
 * A HOUSE WHOSE INPUT ONLY THE IMPORTS' OWN NAME DECLARES. The dyer, the furrier's district, the river boatyard and the mint
 * live on nothing a crisis stops (`HOUSE_DEPENDENCE`: `NONE`), but they work a material (`INPUT_IMPORTED_AS`): where the
 * imports bring it by name and a siege is in force, they work what they hold and nothing more comes in, as the smelter beside
 * them ("Curtailed by the siege."), and their rows with them. Their table row stays `NONE`, so no short reading opens on them.
 * @param {{ catalogId?: unknown, name?: unknown } | null | undefined} inst @returns {boolean}
 */
function boughtByNameOnly(inst) {
  const id = typeof inst?.catalogId === 'string' && inst.catalogId ? inst.catalogId : catalogIdForName(typeof inst?.name === 'string' ? inst.name : null);
  return !!id && Object.prototype.hasOwnProperty.call(INPUT_IMPORTED_AS, id) && !houseDependenceOf(/** @type {{ catalogId?: unknown, name?: unknown }} */ (inst)).includes(INPUT);
}

/* What a house lives on, by its catalogue id: `houseDependenceOf`, moved VERBATIM to the data table's own file
 * (`data/crisisDependence.js`, BAR7-ECON item 5, 2026-11-17) so that the trade lists, which sit below this leaf, read the same
 * fact of "a house marked short" (`rowShortOf`: a house of the short set whose dependence holds INPUT); re-exported here. */
export { houseDependenceOf };

/** The chain states a card prints as working (`chainStateShown.js`'s own set). */
const CARD_WORKING = new Set(['running', 'operational', 'entrepot']);

/**
 * What a house lives on IN THIS PLACE (SV8b): its line, but where a siege is in force and the town's own record holds its
 * work beyond the gates going on (`crisisDependence.js :: GATES_WORK_HELD_BY_RECORD`), that work is `field work`
 * (curtailed), or nothing the siege touches where the chain's card keeps a working state.
 * @param {object | null | undefined} settlement @param {{ catalogId?: unknown, name?: unknown }} inst
 * @returns {ReadonlyArray<string>}
 */
export function houseDependenceIn(settlement, inst) {
  const deps = gatesWorkIn(settlement, inst);
  // S1 (i): a house on its input, where that input comes in by trade, under a siege (BAR8 MARKS-2: or a house whose input
  // only the imports' own name declares, `boughtByNameOnly`)
  if ((deps.includes(INPUT) || boughtByNameOnly(inst)) && onImportedInputUnderSiege(settlement, inst)) return [...deps, IMPORTED_INPUT];
  // LEFT-MARKS M7 (RULING BR11, the sixth chair, 2026-11-17; vetoable by the owner): A HOUSE WHOSE MATERIAL IS THE TOWN'S OWN
  // BY A PROVEN GROUND reads under a siege as the town's own land reads (SV8: curtailed, not stopped): its input is the land
  // the town still works, `field work`. The ground a house proves and the story leaves there (`impliedGroundsOnPage(s).there`)
  // yields the material of the carpenters, the cooper, the sawmill (`MATERIAL_OF`, `HOUSE_TRADE_INPUT`): the dependency card
  // "Needs Timber. Supply route severed." stood beside them bare (bar0-city-under_siege+famine-rand-28, -35; r2r-metropolis-14)
  if (deps.includes(INPUT) && !deps.includes(FIELD_WORK) && onProvenGroundUnderSiege(settlement, inst)) return [...deps, FIELD_WORK];
  return deps;
}

/**
 * LEFT-MARKS M7: is a siege in force here, and the house's material the yield of a ground the town's houses prove and the
 * story leaves there? @param {object | null | undefined} settlement @param {{ catalogId?: unknown, name?: unknown }} inst
 */
function onProvenGroundUnderSiege(settlement, inst) {
  if (!settlement || typeof settlement !== 'object' || !stoppingCrisesOf(settlement).includes('under_siege')) return false;
  const id = typeof inst?.catalogId === 'string' && inst.catalogId ? inst.catalogId : catalogIdForName(typeof inst?.name === 'string' ? inst.name : null);
  if (!id) return false;
  const family = Object.prototype.hasOwnProperty.call(MATERIAL_OF, id) ? MATERIAL_OF[id] : Object.prototype.hasOwnProperty.call(HOUSE_TRADE_INPUT, id) ? HOUSE_TRADE_INPUT[id] : '';
  const noun = family && Object.prototype.hasOwnProperty.call(FAMILY_NOUN, family) ? FAMILY_NOUN[family] : '';
  if (!noun) return false;
  return impliedGroundsOnPage(/** @type {Parameters<typeof impliedGroundsOnPage>[0]} */ (settlement)).there.some((g) => Object.prototype.hasOwnProperty.call(GROUND_YIELD, g) && GROUND_YIELD[g] === noun);
}

/**
 * SV8b's reading of the house's work beyond the gates (`houseDependenceIn`'s first step).
 * @param {object | null | undefined} settlement @param {{ catalogId?: unknown, name?: unknown }} inst
 * @returns {ReadonlyArray<string>}
 */
function gatesWorkIn(settlement, inst) {
  const deps = houseDependenceOf(inst);
  if (!deps.includes(GATES) || !settlement || typeof settlement !== 'object') return deps;
  const id = typeof inst?.catalogId === 'string' && inst.catalogId ? inst.catalogId : catalogIdForName(typeof inst?.name === 'string' ? inst.name : null);
  const rule = id && Object.prototype.hasOwnProperty.call(GATES_WORK_HELD_BY_RECORD, id) ? GATES_WORK_HELD_BY_RECORD[id] : null;
  if (!rule || !stoppingCrisesOf(settlement).includes('under_siege')) return deps;
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { foodSources?: unknown } | null } | null, activeChains?: unknown } | null }} */ (settlement);
  /** @type {'curtailed' | 'open' | null} */
  let held = null;
  if (rule.foodSource) {
    const sources = s.economicState?.foodSecurity?.foodRecord?.foodSources;
    if (Array.isArray(sources) && sources.includes(rule.foodSource)) held = 'curtailed';
  }
  if (rule.waterGrounds && typeof inst?.name === 'string') {
    const chains = /** @type {Array<{ resourceKey?: unknown, processingInstitutions?: unknown }>} */ (Array.isArray(s.economicState?.activeChains) ? s.economicState.activeChains : [])
      .filter((c) => c && rule.waterGrounds?.includes(String(c.resourceKey)) && Array.isArray(c.processingInstitutions) && c.processingInstitutions.includes(inst.name));
    if (chains.some((c) => CARD_WORKING.has(chainCrisisStateShown(c, settlement)))) held = 'open';
    else if (chains.length) held = 'curtailed';
  }
  if (!held) return deps;
  const rest = deps.filter((d) => d !== GATES);
  return held === 'open' ? rest : [...rest, FIELD_WORK];
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

/** Each kind of row's reader of the table (a service row reads its house's line too, SV1). @type {Readonly<Record<string, (row: Record<string, unknown>, settlement: object | null | undefined) => ReadonlyArray<string>>>} */
const DEPENDENCE_OF = Object.freeze({ service: (row, settlement) => serviceRowDependence(settlement, row), house: (row, settlement) => houseDependenceIn(settlement, row), chain: chainDependenceOf, income: incomeDependenceOf });

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
 * The crisis that stops this row, or null; for a house the siege stops but for a row of its own that goes on, the
 * siege's partial kind (`under_siege:curtailed`, SV7), which the mark, the door word and the head line all read.
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
  const deps = read(row, settlement);
  if (deps.length === 0) return kind === 'income' ? incomeHouseKind(settlement, row, crises) : null;
  const desc = typeof row.desc === 'string' ? row.desc : '';
  /** @type {string | null} */
  let curtailed = null;
  for (const crisis of crises) {
    if (kind === 'service' && isCrisisTwin(desc, crisis)) continue;
    const stops = stoppedBy(crisis, settlement);
    if (!deps.some((d) => stops.includes(d))) {
      // SV8: what the crisis curtails and does not stop; a later crisis that stops the row marks it before this
      const curtails = Object.prototype.hasOwnProperty.call(CURTAILED_BY, crisis) ? CURTAILED_BY[crisis] : NONE;
      if (!curtailed && deps.some((d) => curtails.includes(d))) curtailed = PARTLY_STOPPED_KIND[crisis] ?? null;
      continue;
    }
    if (kind === 'house' && Object.prototype.hasOwnProperty.call(PARTLY_STOPPED_KIND, crisis) && houseRowGoesOn(settlement, row, crisis, crises)) return PARTLY_STOPPED_KIND[crisis];
    return crisis;
  }
  return curtailed ?? (kind === 'income' ? incomeHouseKind(settlement, row, crises) : null);
}

/**
 * S1 (ii): the mark of an income share of a house's trade (`INCOME_TRADE_HOUSES`, keyed by the share's title): where every
 * live house of the trade (by catalogue id) carries a crisis mark, the share takes the mildest of them (a partial kind before
 * a stopping one); else none.
 * @param {object | null | undefined} settlement @param {Record<string, unknown>} income @param {string[]} crises
 * @returns {string | null}
 */
function incomeHouseKind(settlement, income, crises) {
  const houses = incomeTradeHousesOf(settlement, income);
  if (houses.length === 0) return null;
  const kinds = houses.map((h) => rowStoppedBy(settlement, 'house', h, crises));
  if (kinds.some((k) => k === null)) return null;
  return kinds.find((k) => k !== crisisOfMarkKind(/** @type {string} */ (k))) ?? /** @type {string} */ (kinds[0]);
}

/**
 * The live catalogue houses of an income share's trade (`INCOME_TRADE_HOUSES`, `INCOME_REMEDY_HOUSES`, `INCOME_CLOTH_HOUSES`,
 * keyed by the share's title), by catalogue id; none for a share of no house's trade.
 * @param {object | null | undefined} settlement @param {Record<string, unknown> | null | undefined} income
 * @returns {Array<Record<string, unknown>>}
 */
function incomeTradeHousesOf(settlement, income) {
  const title = typeof income?.source === 'string' ? income.source.trim() : '';
  const ids = Object.prototype.hasOwnProperty.call(INCOME_TRADE_HOUSES, title) ? INCOME_TRADE_HOUSES[title]
    : Object.prototype.hasOwnProperty.call(INCOME_REMEDY_HOUSES, title) ? INCOME_REMEDY_HOUSES[title] // BAR5-MARKS: the remedies' shares
      : Object.prototype.hasOwnProperty.call(INCOME_CLOTH_HOUSES, title) ? INCOME_CLOTH_HOUSES[title] : null; // BAR7-ECON: the cloth trade's
  if (!ids || !settlement || typeof settlement !== 'object') return [];
  return /** @type {Array<Record<string, unknown>>} */ (liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .filter((i) => i && typeof i.name === 'string' && !isCustom(i)) // a catalogue house (a custom one has no catalogue id)
    .filter((i) => ids.includes(String((typeof i.catalogId === 'string' && i.catalogId) || catalogIdForName(i.name) || '')))); // of the trade, by id
}

/**
 * BAR7-ECON item 1 (LAW 8's 8f.short; the chair's BRIEF-BAR7, 2026-11-17; vetoable by the owner): THE SHORT HALF OF AN INCOME
 * SHARE'S MARK. "Iron & Metalwork · Metal is smelted or worked here." printed bare beside its only smith, "Short of iron."
 * (C41826): the share read its houses' crisis marks (`incomeHouseKind`) and never their short mark. It reads it as it reads
 * the crisis half, house by house, through the leaf's own reading (`rowShortOf`, the mark the house's card prints): where
 * every live house of the trade carries a mark (a crisis's or the short one) and at least one of them is short and not
 * stopped by a crisis, the share is short of what those houses lack ("its materials" where they lack different things).
 * Where every house carries a crisis mark the crisis half speaks alone, as before. Display only.
 * @param {object | null | undefined} settlement @param {Record<string, unknown> | null | undefined} income
 * @param {string[]} [crises]
 * @returns {string | null} the input the share's houses are short of, or null
 */
export function incomeShortOf(settlement, income, crises = stoppingCrisesOf(settlement)) {
  if (!income || typeof income !== 'object' || isCustom(income)) return null;
  const houses = incomeTradeHousesOf(settlement, income);
  if (houses.length === 0) return null;
  /** @type {string[]} */
  const inputs = [];
  for (const h of houses) {
    const short = rowShortOf(settlement, 'house', h);
    if (short) { inputs.push(short); continue; }
    if (crises.length === 0 || rowStoppedBy(settlement, 'house', h, crises) === null) return null; // a house at work
  }
  if (inputs.length === 0) return null;
  return new Set(inputs).size === 1 ? inputs[0] : 'its materials';
}

/** Each record's service rows by their house's roster name, read once a record. @type {WeakMap<object, ReadonlyMap<string, ReadonlyArray<Record<string, unknown>>>>} */
const ROWS_BY_HOUSE = new WeakMap();

/**
 * Does a row of this house's own (the record's `availableServices`, joined by `institution`) print on offer under this
 * crisis: not stopped by any crisis in force, and not the crisis's own twin (SV7)? A custom row is not read.
 * @param {object | null | undefined} settlement @param {Record<string, unknown>} house @param {string} crisis @param {string[]} crises
 * @returns {boolean}
 */
function houseRowGoesOn(settlement, house, crisis, crises) {
  if (!settlement || typeof settlement !== 'object' || typeof house.name !== 'string' || !house.name) return false;
  let byHouse = ROWS_BY_HOUSE.get(settlement);
  if (!byHouse) {
    /** @type {Map<string, Record<string, unknown>[]>} */
    const map = new Map();
    for (const { svc } of serviceRowsOf(/** @type {{ availableServices?: unknown }} */ (settlement).availableServices)) {
      const name = typeof svc.institution === 'string' ? svc.institution : '';
      if (!name) continue;
      if (!map.has(name)) map.set(name, []);
      /** @type {Record<string, unknown>[]} */ (map.get(name)).push(svc);
    }
    byHouse = map;
    ROWS_BY_HOUSE.set(settlement, byHouse);
  }
  const rows = byHouse.get(house.name) || [];
  // SV7b: a siege twin whose words say the service goes on, thinly, is a row on offer (`SIEGE_TWINS_ON_OFFER`)
  const onOffer = (/** @type {string} */ desc) => !isCrisisTwin(desc, crisis) || (crisis === 'under_siege' && SIEGE_TWINS_ON_OFFER.includes(desc));
  return rows.some((svc) => !isCustom(svc) && onOffer(typeof svc.desc === 'string' ? svc.desc : '') && rowStoppedBy(settlement, 'service', svc, crises) === null);
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
 * LEFT-MARKS M3 (the second reader on BIRTH-3, 2026-11-17): A FAILED VENTURE'S MARK IS NO SHORT MARK FOR THIS LINE. Its
 * second sentence ("A row marked short is what its house makes when supplied.") printed where the only mark on the tab was
 * a failed venture's ("Abandoned: a failed venture."), so no row was marked short (10 towns of the 720, 3 of the 150). The
 * leaf decides it: handed the rows' short readings (`rowShortOf`'s answers), it counts a row marked short only where the
 * answer is the short mark, never the venture's (`isVentureMark`); a caller that hands a boolean keeps its reading.
 * @param {string[]} crises the crises that marked a row on this tab, in the leaf's order
 * @param {boolean | ReadonlyArray<unknown>} [shortMarked] whether a row of the tab is marked short of its input (S5), or
 *   the rows' short readings, from which the leaf reads it
 * @returns {string | null}
 */
export function ordinaryTimesLine(crises, shortMarked = false) {
  const named = crises.map(crisisOfMarkKind);
  const nouns = STOPPING_CRISES.filter((k) => named.includes(k)).map((k) => CRISIS_NOUN[k]);
  const short = Array.isArray(shortMarked) ? shortMarked.some((m) => typeof m === 'string' && m !== '' && !isVentureMark(m)) : !!shortMarked;
  const supplied = short ? SUPPLIED_LINE : null;
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
 * `resourceGapLines`, so a house is short exactly where that reading of its own gaps says "No … reaches the …" of it (the
 * general gap line; the Resources tab may print the house's supply-story line in its place, and this mark reads the
 * general line whatever the tab prints).
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
    const lines = resourceGapLines(/** @type {Parameters<typeof resourceGapLines>[0]} */ ({ ...settlement, resourceAnalysis: { ...s.resourceAnalysis, gaps: own }, [STORY_OF_RECORD]: settlement })); // BIRTH-3 (BR8): the story is the whole record's
    const said = lines.map((l) => SHORT_LINE.exec(String(l?.impact ?? ''))).find(Boolean);
    if (said) out.set(house, said[1]);
  }
  // SV6: a house on a spent ground, by the page's own Depleted list (`SPENT_GROUND_YIELD`'s header)
  for (const [house, ground] of housesOnSpentGround(settlement)) if (!out.has(house)) out.set(house, ground);
  // BAR6-MARKS (8a.input, fact (a) and (e)): a house whose trade is a good no gap of its own speaks of, where that good is
  // not had (`houseInputAtHand.js :: housesWantingTradeInput`, the one fact `housesShortOf` (iii) reads too)
  for (const [house, want] of housesWantingTradeInput(settlement)) if (want.reach === 'missing' && !out.has(house)) out.set(house, want.noun);
  // BIRTH-3 (BR8 (2)): the failed venture's stored row is read by the one fact (`housesShortOf` (i)) where no chain asks its
  // house and so no gap line names it (a cobbler's guild, a mine): the page reads it as the fact does
  const venture = ventureHouseOf(/** @type {Parameters<typeof ventureHouseOf>[0]} */ (settlement));
  if (venture && !out.has(venture.name)) { const fact = housesShortOf(settlement).get(venture.name); if (fact) out.set(venture.name, fact); }
  // LEFT-MARKS item 4 (L16, rule 8i.surplus; the auditor's cure): A HOUSE THAT WORKS ONLY A SURPLUS (`SURPLUS_HOUSES`: the
  // maltster, "Requires grain surplus.") is short where the page's food line is short ("Short: N lbs/day", the Economics
  // tab's row: `foodRowShown` with the carriers the tab reads), in a crisis or not: "Short of grain.". Read off the public
  // fields the shared page keeps (the food record, the route, the roster: N4); the gate is `rowShortOf`'s (its INPUT). NOT IN
  // A CALM TOWN ON A CONNECTED ROAD: there BIRTH-1's law holds a buyer (the maltster is one, `houseKinds.js ::
  // BUYS_AND_WORKS`) unmarked, its material brought in (tests/domain/birthKindsLaw.test.js arm 1); left by name to the chair
  if (foodLineShort(settlement) && !calmOnRoad(settlement)) for (const inst of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))) {
    const name = inst && typeof inst.name === 'string' ? inst.name : '';
    if (!name || isCustom(inst) || out.has(name)) continue;
    const id = String((typeof inst.catalogId === 'string' && inst.catalogId) || catalogIdForName(name) || '');
    if (Object.prototype.hasOwnProperty.call(SURPLUS_HOUSES, id)) out.set(name, SURPLUS_HOUSES[id]);
  }
  SHORT_HOUSES.set(settlement, out);
  return out;
}

/**
 * LEFT-MARKS item 4: whether the page's food line is short (the Economics tab's "Short: N lbs/day": `foodRowShown` handed
 * the carriers the tab reads, `foodCarrier.js :: carriersOf`). @param {object} settlement @returns {boolean}
 */
function foodLineShort(settlement) {
  const s = /** @type {Parameters<typeof foodRowShown>[0] & Parameters<typeof carriersOf>[0]} */ (settlement);
  const row = foodRowShown(s, !!carriersOf(s, /** @type {Parameters<typeof carriersOf>[1]} */ (s?.economicState)));
  return !!row && row.fb.deficit > 0;
}

/** LEFT-MARKS item 4: a town with no crisis on a connected road (BIRTH-1's law's own reading). @param {object} settlement */
function calmOnRoad(settlement) {
  const config = /** @type {{ config?: { stressTypes?: unknown, tradeRouteAccess?: unknown } }} */ (settlement).config;
  return (Array.isArray(config?.stressTypes) ? config.stressTypes : []).length === 0 && hasTradeRouteConnection(String(config?.tradeRouteAccess ?? ''));
}

/* THE THIRD READING (SV6), `housesOnSpentGround`, moved VERBATIM to the fact `facts/houseInputAtHand.js` (BAR4-SCENES-2, the
 * chair's ruling HW1 of 2026-11-16 12:26 UTC, vetoable by the owner: ONE FACT FOR "this house is short", read by the mark and
 * by the arrival scene; the layer law, facts import no display, holds by the move). This leaf calls it. */

/**
 * The input this row's house is short of, or null: a row declared `input` whose house the page says no input reaches;
 * for the failed venture, its own mark (BIRTH-3).
 * @param {object | null | undefined} settlement
 * @param {'service' | 'house'} kind
 * @param {Record<string, unknown> | null | undefined} row a service row ({ name, desc, institution }) or a house
 * @returns {string | null}
 */
export function rowShortOf(settlement, kind, row) {
  if (!row || typeof row !== 'object' || isCustom(row)) return null;
  const deps = kind === 'house' ? houseDependenceOf(row) : kind === 'service' ? serviceRowDependence(settlement, row) : NONE;
  const house = kind === 'house' ? row.name : row.institution;
  if (typeof house !== 'string' || !house) return null;
  // BIRTH-3 (the chair's AMENDMENT 2 (B)): the supply rule's own reading passes the gate whatever the crisis table's class of
  // the row (a peat cutter is `NONE` there): a source house its story leaves idle on a spent ground, and the failed venture
  if (!deps.includes(INPUT) && !supplyToldShort(/** @type {object} */ (settlement), house)) return null;
  // BIRTH-3 (BR6; the second reader's H2): THE FAILED VENTURE PASSES THE SAME GATE AS THE SHORT MARK, its own mark in place of
  // "Short of ..." ("Abandoned: a failed venture." / "Failing: a failed venture."), so every caller that asks this reading
  // before the mark (the tabs, the person's card, the PDF) prints it where the short mark would
  const venture = ventureHouseOf(/** @type {Parameters<typeof ventureHouseOf>[0]} */ (settlement));
  if (venture && venture.name === house) return ventureMarkText(venture);
  return housesShortOfInput(settlement).get(house) ?? null;
}

/**
 * BIRTH-3 (AMENDMENT 2 (B)): whether the supply rule itself tells this house short: the failed venture, or a source house its
 * story leaves idle on a used-up ground (`supplyStory.js :: sourceStoryOf`, read off the stored record).
 * @param {object} settlement @param {string} house
 */
function supplyToldShort(settlement, house) {
  if (ventureHouseOf(/** @type {Parameters<typeof ventureHouseOf>[0]} */ (settlement))?.name === house) return true;
  const inst = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement)).find((i) => i?.name === house);
  const story = inst && !isCustom(inst) ? sourceStoryOf(/** @type {Parameters<typeof sourceStoryOf>[0]} */ (settlement), inst, resourceShortageImport) : null;
  return story?.story === 'idle' && !!story.ground;
}

/** The failed venture's two marks (`supplyStory.js :: ventureMarkText`), which `shortMarkText` prints as they are. */
const VENTURE_MARK = /^(?:Abandoned|Failing): a failed venture\.$/;
/** BIRTH-3: whether a gate's answer is the failed venture's own mark (no door word "short" beside it). @param {unknown} x */
export const isVentureMark = (x) => typeof x === 'string' && VENTURE_MARK.test(x);

/**
 * The mark for a row short of its input. Four words at most (a mark repeats on a house's rows: X-50 counts a sentence
 * at five): an input the line names in more words is "its materials". VETOABLE wording.
 * @param {string | null} input
 * @returns {string | null}
 */
export function shortMarkText(input) {
  if (!input) return null;
  if (VENTURE_MARK.test(input)) return input; // BIRTH-3: the failed venture's own mark, through the same gate (`rowShortOf`)
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


/**
 * BAR6-MARKS (LAW 8's 8a.mild, BRIEF-BAR6 fact (f), 2026-11-16; vetoable by the owner): THE CARD'S STATE WORD PRINTS THE
 * LEAF'S WORSE STATE. The Institutions card's head and the Services row's title print a house's chain state
 * (`tabHelpers.js :: computeChainSets`: Impaired, Reduced, Vulnerable) beside the mark this leaf gives it; a house the
 * leaf marks stopped, curtailed, scarce or short printed " · Vulnerable" over "Short of timber.": two readings of one house.
 * Where the leaf marks a house the sets hold as reduced or vulnerable, the house is read as impaired; a house the sets
 * hold in no state keeps none (its mark speaks), and a service's own name keeps its state. Display only.
 * @template {{ impaired: Set<string>, degraded: Set<string>, vulnerable: Set<string> }} T
 * @param {object | null | undefined} settlement @param {T} sets the tab's chain-status reading
 * @returns {T}
 */
export function setsWithMarkedHousesWorse(settlement, sets) {
  if (!settlement || typeof settlement !== 'object' || !sets) return sets;
  const lifted = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .filter((h) => h && typeof h.name === 'string' && (sets.degraded?.has(h.name) || sets.vulnerable?.has(h.name)) && !sets.impaired?.has(h.name))
    .filter((h) => rowMarkText(settlement, 'house', /** @type {Record<string, unknown>} */ (h)) !== null)
    .map((h) => /** @type {string} */ (h.name));
  if (lifted.length === 0) return sets;
  const out = new Set(lifted);
  return { ...sets, impaired: new Set([...sets.impaired, ...out]), degraded: new Set([...sets.degraded].filter((n) => !out.has(n))), vulnerable: new Set([...sets.vulnerable].filter((n) => !out.has(n))) };
}
