/**
 * domain/display/economicsCrisisMarks.js — THE ECONOMICS TAB'S ROWS A CRISIS STOPS, MARKED BY THE ONE LEAF
 * (TAIL-DISPLAY-ECON-4, batch 4; the chair's ruling X25.1, 2026-11-15; vetoable by the owner).
 *
 * The Foundry journal marks an income share and a supply chain that live on what a siege, an outbreak or a famine stops
 * (`crisisStoppedRow.js :: rowStoppedBy`, keyed by the share's `source` and the chain's `chainId`); the Economics tab did
 * not ("Gate Tolls" under a siege, unmarked, beside a journal that marks it). ONE VOICE: the tab's income rows and chain
 * cards read the same leaf and print its mark in the Services tab's form (the mark, then the description of ordinary
 * times), and the tab says once at its head that its descriptions are of ordinary times (`ordinaryTimesLine`).
 *
 * Batch 2's own silence of "Contributes to X - N% of income" (a card the crisis left impaired, by
 * `chainStateShown.js :: chainCrisisStateShown`) gives way to the leaf: a card leaves the line out where the leaf marks
 * the share it names (`incomeStopped`).
 *
 * The Economics tab calls this leaf, and the Resources tab its `fullCardWordUnderSiege` (BAR3-LABELS-3 L3b). Pure: no
 * randomness, no clock, no write.
 */
import { stoppingCrisesOf, rowStoppedBy, crisisMarkText, crisisOfMarkKind, markedDescription, ordinaryTimesLine, STOPPED_WORD, incomeShortOf, shortMarkText, rowMarkText, crisisNounOf, rowShortOf } from './crisisStoppedRow.js';
import { liveHouseOf } from '../facts/presence.js'; // BAR3-LABELS-2 L3: the roster house a chain's catalogue house answers to
import { serviceRowsOf } from '../dossier/entityLinks.js'; // BAR5-CHAINS CC1: the service rows as the Services and Institutions tabs read them

/** The states a flow card prints as working (`chainStateShown.js`'s own set). */
const CARD_WORKING = new Set(['running', 'operational', 'entrepot']);

/**
 * THE CARD'S WORKING WORD READS THE LEAF THE HOUSES' MARKS READ (BAR3-LABELS-2 L3, the chair's direction of 2026-11-15;
 * the wide read's C12020; vetoable by the owner). Under a siege, a flow card whose every live processing house the
 * Services tab marks "stopped" (`crisisStoppedRow.js :: rowStoppedBy`, the houses' one leaf), or that the same leaf
 * marks stopped itself (the card's own mark), printed a working word ("Running" over a harbour whose harbour master and
 * docks are stopped, the wide read's city-under_siege+famine-rand-15; "Entrepôt" for a besieged metropolis's smuggling;
 * "Running" for a tavern trade whose taverns are shut: 4 of the census's 720 at 8b45191a5): the card prints "impaired". Any other card is the one it was given (`chainStateShown.js :: chainAsShown`).
 * RULING SW1 (the chair, 2026-11-15 22:55 UTC; vetoable by the owner; BAR3-CLOSE-SWEEP-A): a house the siege CURTAILS
 * (the leaf's partial kind, `under_siege:curtailed`, SV7/SV7b/SV8) carries the siege's mark as a stopped one does: a card
 * whose every live house is stopped or curtailed prints "impaired" (1 card of the census's 720 at 98363cb84,
 * r2s-under_siege-village-0's tavern trade beside its curtailed inn). The partial kind is read through the leaf's own
 * `crisisOfMarkKind`, never a copy of its table.
 * RULING SW1b (the chair, 2026-11-15 23:41 UTC; vetoable by the owner; BAR3-CLOSE-SWEEP-A): SW1 holds for EVERY crisis
 * that marks houses, not the siege alone. A card whose every live house carries ONE crisis's mark (an outbreak's
 * "Curtailed", a famine's "Scarce", the siege's "Stopped" or "Curtailed", each read by the leaf for that crisis alone)
 * prints "impaired" too (14 cards in 11 towns of the census's 720 at 661f08aee). The general form is
 * `chainCardUnderCrisis`; this function, the Economics tab's and the Resources tab's entry, is its caller.
 * @template {{ status?: unknown }} C
 * @param {object | null | undefined} town the settlement
 * @param {Record<string, unknown>} record the chain as the record holds it (`economicState.activeChains[]`)
 * @param {C} shown the same chain as its card prints it (`chainAsShown`)
 * @returns {C}
 */
export function chainCardUnderSiege(town, record, shown) {
  return chainCardUnderCrisis(town, record, shown);
}

/**
 * THE GENERAL FORM (SW1b): under each crisis in force that marks rows (`crisisStoppedRow.js :: stoppingCrisesOf`), a
 * card printing a working word takes "impaired" where the siege marks the chain itself (L3, the card's own mark), or
 * where every live processing house carries that one crisis's mark: `rowStoppedBy` asked of that crisis alone, its
 * partial kind read through `crisisOfMarkKind` (the leaf's own reading, no table copied). A card with one house the
 * crisis leaves unmarked keeps its word; any other card is the one it was given.
 * RULING CC1 (the chair, 2026-11-16 17:54 UTC; vetoable by the owner; BAR5-CHAINS, LAW 3's L3.outputs and
 * L3.chainOverStopped): THE CARD'S WORD AND ITS SERVICES' MARKS ARE ONE DECISION. (i) A card that names among its outputs
 * a service the leaf marks for a crisis in force ("Armed escort" on "Adventuring & Escort", its row "(stopped)" on the
 * Services tab) prints "impaired"; (ii) a house whose every service row one crisis marks counts as marked by it, as a house
 * the leaf marks itself does (a wayside shrine whose every service the siege stops, under "Faith & Worship"). The leaf is
 * read by its own function (`rowStoppedBy`, kind 'service'), so every mark it gives counts here unspelled.
 * @template {{ status?: unknown }} C
 * @param {object | null | undefined} town the settlement
 * @param {Record<string, unknown>} record the chain as the record holds it (`economicState.activeChains[]`)
 * @param {C} shown the same chain as its card prints it (`chainAsShown`)
 * @returns {C}
 */
export function chainCardUnderCrisis(town, record, shown) {
  const crises = stoppingCrisesOf(town);
  if (!CARD_WORKING.has(String(shown?.status ?? '')) || crises.length === 0) return shown;
  if (crises.includes('under_siege') && rowStoppedBy(town, 'chain', record, ['under_siege']) === 'under_siege') return { ...shown, status: 'impaired' }; // the card's own mark
  const rows = serviceRowsOf(/** @type {{ availableServices?: unknown } | null | undefined} */ (town)?.availableServices).map(({ svc }) => svc); // the tabs' own rows (`dossier/entityLinks.js`)
  /** @param {string} crisis @param {Record<string, unknown>} row the leaf marks this service row for this crisis */
  const serviceMarked = (crisis, row) => {
    const kind = rowStoppedBy(town, 'service', row, [crisis]);
    return kind !== null && crisisOfMarkKind(kind) === crisis;
  };
  // CC1 (i): an output the card names that is a service the leaf marks (the Services tab's own row)
  const named = /** @type {{ outputs?: unknown } | null | undefined} */ (/** @type {unknown} */ (shown))?.outputs;
  if (outputNamesMarkedService(town, crises, Array.isArray(named) ? named : [])) return { ...shown, status: 'impaired' };
  const houses = (Array.isArray(record?.processingInstitutions) ? /** @type {unknown[]} */ (record.processingInstitutions) : [])
    .map((h) => liveHouseOf(town, h)).filter(Boolean);
  if (houses.length === 0) return shown;
  /** @param {string} crisis @param {unknown} h */
  const marks = (crisis, h) => {
    const kind = rowStoppedBy(town, 'house', /** @type {Record<string, unknown>} */ (h), [crisis]);
    if (kind !== null && crisisOfMarkKind(kind) === crisis) return true; // SW1: stopped, or the crisis's partial kind
    // CC1 (ii): a house whose every service row the crisis marks is marked (its card on the Institutions tab prints every
    // service so)
    const name = String(/** @type {{ name?: unknown }} */ (h)?.name ?? '');
    const own = rows.filter((row) => row.institution === name);
    return own.length > 0 && own.every((row) => serviceMarked(crisis, row));
  };
  const marked = crises.some((crisis) => houses.every((h) => marks(crisis, h)));
  return marked ? { ...shown, status: 'impaired' } : shown;
}

/**
 * CC1 (i), the one reading the chain cards and the service economy's cards share: does an output a card names hold, by
 * its name, a service row (the Services tab's own, `dossier/entityLinks.js :: serviceRowsOf`) the leaf marks for one of
 * these crises (`rowStoppedBy`, kind 'service', the mark's crisis read through `crisisOfMarkKind`)?
 * @param {object | null | undefined} town @param {ReadonlyArray<string>} crises @param {ReadonlyArray<unknown>} named
 * @returns {boolean}
 */
function outputNamesMarkedService(town, crises, named) {
  if (crises.length === 0 || named.length === 0) return false;
  const rows = serviceRowsOf(/** @type {{ availableServices?: unknown } | null | undefined} */ (town)?.availableServices).map(({ svc }) => svc);
  const outputs = named.map(folded);
  return crises.some((crisis) => rows.some((row) => {
    const name = folded(row.name);
    if (name.length < 6 || !outputs.some((o) => ` ${o} `.includes(` ${name} `))) return false;
    const kind = rowStoppedBy(town, 'service', row, [crisis]);
    return kind !== null && crisisOfMarkKind(kind) === crisis;
  }));
}

/**
 * THE SERVICE ECONOMY'S CARD READS THE PAGE'S OWN STATE (BAR6-ECON, LAW 8's rules 8d.export and 8e.svcOutput of
 * BRIEF-BAR6; the wide read's C5702 C26071 C26077 C33585; vetoable by the owner). A card of
 * `economicState.institutionalServices` printed "Export ○ Operational" under a siege whose page says none of the town's
 * export trades can reach a buyer, and "Operational" over an output ("Armed escort & mercenary hire") whose service the
 * Services tab marks stopped. The record's `status` is untouched; the card reads two facts it did not:
 *   - THE EXPORT: where trade is stopped (`chainStateShown.js :: tradeStoppedHere`, the siege's own record line, the reading
 *     the Imports list and the chain cards make), an exportable service's export is stopped: its tag says so
 *     (`exportStopped`); the service's work for those inside goes on, and its state word is its own;
 *   - THE OUTPUT: a card whose output names a service the leaf marks for a crisis in force prints "impaired", as a chain
 *     card does under ruling CC1 (i) (`outputNamesMarkedService`, the one reading both cards share).
 * Otherwise the card's state is `chainStateShown.js :: serviceStateShown` (its houses the Institutions tab marks impaired).
 * The flow header counts what this gives (`EconomicsTab.jsx :: flowHeaderCount`).
 * @param {object | null | undefined} town the settlement
 * @param {{ exportable?: unknown, output?: unknown } | null | undefined} svc one service card's record
 * @param {'impaired' | 'operational'} ownState the card's state by its own houses, as the caller reads it
 *   (`chainStateShown.js :: serviceStateShown` over the card's houses and the Institutions tab's impaired set)
 * @returns {{ state: 'impaired' | 'operational', exportStopped: boolean }}
 */
export function serviceCardShown(town, svc, ownState) {
  const own = ownState;
  const output = typeof svc?.output === 'string' ? [svc.output] : [];
  const impaired = own === 'impaired' || outputNamesMarkedService(town, stoppingCrisesOf(town), output);
  return { state: impaired ? 'impaired' : 'operational', exportStopped: svc?.exportable === true && tradeStoppedHere(town) };
}

/** The export tag of a service card whose export the siege stops (the leaf's own word for the siege's stop). VETOABLE. */
export const EXPORT_STOPPED_TAG = `Export ${STOPPED_WORD.under_siege}`;

/** @param {unknown} x @returns {string} lower case, words only, single spaces (a service's name inside an output's) */
const folded = (x) => String(x ?? '').toLowerCase().replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * The marks of the flow cards (keyed by the card's chain as shown) and the reading of the share a card names.
 * @param {object | null | undefined} town the settlement
 * @param {ReadonlyArray<Record<string, unknown>>} records `economicState.activeChains`, in the record's order
 * @param {ReadonlyArray<object>} shown the same chains as the cards print them (`chainAsShown`), index for index
 * @returns {{ chain: Map<object, string>, incomeStopped: (income: Record<string, unknown>) => boolean }}
 */
export function flowCrisisMarks(town, records, shown) {
  const crises = stoppingCrisesOf(town);
  const chain = new Map();
  shown.forEach((c, i) => {
    const mark = crisisMarkText(town, rowStoppedBy(town, 'chain', records[i], crises));
    if (mark) chain.set(c, mark);
  });
  return { chain, incomeStopped: (income) => incomeKindShown(town, income, crises) !== null };
}

/**
 * AN INCOME SHARE TITLED BY A CHAIN READS THAT CHAIN'S STATE (BAR6-ECON, LAW 8's rule 8d.income of BRIEF-BAR6; the wide
 * read's C25863; vetoable by the owner). Under a siege, the share "Iron & Metalwork" printed its description of ordinary
 * times bare, while the chain card of the same name, two sections down, prints "Impaired" (its ore worked out, and the
 * siege bringing none in) and the shares beside it carry their marks. The share's mark is the leaf's (`rowStoppedBy`,
 * kind 'income'); where the leaf gives none and trade is stopped (`tradeStoppedHere`), a share whose title is a chain's
 * printed name (`chainPrintName`, the one leaf of a chain's name) takes the siege's partial mark, "Curtailed by the siege.", where
 * that chain's card prints "impaired" by the siege (`impairedBySiege`: `chainCardUnderCrisis` over `chainAsShown`, the card's
 * own reading, of a chain the record holds at work or on a worked-out ground): the trade works what it holds and nothing
 * comes in to mend it. Outside a siege the share reads the leaf alone.
 * @param {object | null | undefined} town @param {Record<string, unknown> | null | undefined} src `economicState.incomeSources[]`
 * @param {string[]} [crises] the stopping crises in force (read from the town when absent)
 * @returns {string | null} the mark's kind, else null
 */
export function incomeKindShown(town, src, crises = stoppingCrisesOf(town)) {
  const kind = rowStoppedBy(town, 'income', src, crises);
  if (kind !== null || !src || !tradeStoppedHere(town)) return kind;
  const title = folded(src.source);
  if (!title) return null;
  const chains = /** @type {{ economicState?: { activeChains?: unknown } } | null | undefined} */ (town)?.economicState?.activeChains;
  const all = (Array.isArray(chains) ? /** @type {Record<string, unknown>[]} */ (chains) : []).filter((c) => c && typeof c === 'object');
  const incomes = /** @type {{ economicState?: { incomeSources?: unknown } } | null | undefined} */ (town)?.economicState?.incomeSources;
  const titled = all
    .filter((c) => folded(chainPrintName(/** @type {Parameters<typeof chainPrintName>[0]} */ (c), town)?.label) === title // the chain's printed name, the leaf's (chainPrintSites F1)
      // BAR7-ECON item 1 (8f.chain, C4828): or the chain whose card says it feeds this share ("Contributes to Timber Trade"),
      // the card's own reading (`incomeShareOfChain`): "Timber & Lumber · Impaired" feeds "Timber Trade", whose row printed
      // "managed felling and sawmilling keep production consistent" bare under the siege
      || String(incomeShareOfChain(c, Array.isArray(incomes) ? /** @type {Array<{ source?: unknown }>} */ (incomes) : [])?.source ?? '\u0000') === String(src.source));
  return titled.some((c) => impairedBySiege(town, c)) ? SIEGE_CURTAILED : null;
}

/**
 * THE INCOME SHARE A CHAIN CARD SAYS IT FEEDS ("Contributes to <share> - N% of income"; the Economics tab's own reading, moved
 * here by BAR7-ECON so the card's line and the share's mark read one rule): the first share whose title holds the first word
 * of the chain's label (lower case), or, for the entrepôt chain, the first share titled an entrepôt; else null.
 * @template {{ source?: unknown }} S
 * @param {{ label?: unknown, needKey?: unknown } | null | undefined} chain @param {ReadonlyArray<S>} incomes `economicState.incomeSources`
 * @returns {S | null}
 */
export function incomeShareOfChain(chain, incomes) {
  const safe = incomes.filter((inc) => typeof inc?.source === 'string');
  const keyword = String(chain?.label || '').split(' ')[0].toLowerCase();
  const entrepot = chain?.needKey === 'trade_entrepot';
  if (!keyword && !entrepot) return null;
  const src = (/** @type {S} */ inc) => String(inc.source).toLowerCase();
  return safe.find((inc) => src(inc).includes(keyword) || (entrepot && src(inc).includes('entrepôt'))) || null;
}

/**
 * Is this chain's card impaired by the siege: its card prints "impaired" where the record's own state is a working one (the
 * siege's reading of the card did it), or the record's impairment is a ground worked out (`resourceDepleted`) that no import
 * can now mend? A chain the record holds impaired for a cause of its own (a spellcasting trade short of its casters) is not
 * the siege's, and its share keeps no siege mark.
 * @param {object | null | undefined} town @param {Record<string, unknown>} c `economicState.activeChains[]`
 * @returns {boolean}
 */
function impairedBySiege(town, c) {
  if (String(chainCardUnderCrisis(town, c, chainAsShown(c, town))?.status ?? '') !== 'impaired') return false;
  return CARD_WORKING.has(String(c.status ?? '')) || String(c.status ?? '') === 'vulnerable' || c.resourceDepleted === true;
}

/** The siege's partial kind, the leaf's own key (`crisisStoppedRow.js :: MARK_LINES`, "Curtailed by the siege."). */
const SIEGE_CURTAILED = 'under_siege:curtailed';

/**
 * An income share's description as the tab prints it: the leaf's mark, then the description of ordinary times.
 * @param {object | null | undefined} town @param {{ source?: unknown, desc?: unknown }} src `economicState.incomeSources[]`
 * @param {((desc: unknown, town: { institutions?: unknown } | null | undefined, reading?: { forgeIdle: boolean }) => string | null) | null} [ordinaryOf] the trade's ordinary line in place of a stored short twin, or null
 * @returns {string}
 */
export function incomeDescShown(town, src, ordinaryOf = null) {
  const mark = incomeMarkShown(town, /** @type {Record<string, unknown>} */ (src));
  // BAR7-ECON after the second reader (the chair's point (1)): a stored short twin prints only under a mark; an unmarked share
  // prints its trade's ordinary line, given by the caller (`economy/incomeLineSiblings.js :: ordinaryIncomeLineOf`: the texts
  // live in the generator, which this layer does not import, `tests/build/domainGeneratorsBoundary.test.js`)
  // LEFT-CHAIN L7: the caller is told whether the share's working houses stand idle beside a mine at work (`forgeIdleHere`)
  const ordinary = mark === null && ordinaryOf ? ordinaryOf(src?.desc, town, { forgeIdle: forgeIdleHere(town, src) }) : null;
  return markedDescription(mark, ordinary ?? src?.desc);
}

/** The metal share's title (`crisisDependence.js :: INCOME_TRADE_HOUSES`). */
const METAL_SHARE = 'Iron & Metalwork';

/**
 * THE METAL SHARE'S FORGE STANDS IDLE BESIDE A MINE AT WORK (LEFT-CHAIN L7; the chair's BRIEF-LEFT, 2026-11-17; vetoable by
 * the owner). "Iron & Metalwork · Metal is smelted or worked here." printed bare where every smelting or working house of the
 * trade is marked short and the share kept no mark only because a mine of the trade, at work, is unmarked (r2r-metropolis-24,
 * r2s-monster_pressure-metropolis-2: the blacksmiths, the metalworkers and the smelter short of iron, the mine digging coal).
 * The share's houses are its trade's live catalogue houses (`INCOME_TRADE_HOUSES`, read only); a mine is told from a working
 * house by the houses' kinds (`houseKinds.js :: isSourceHouse`, read only): true where at least one working house stands,
 * EVERY working house carries the page's short mark (`crisisStoppedRow.js :: rowShortOf`, the mark its card prints) and a
 * source house of the trade carries no mark. No mark is invented and the mine is not marked. Display only.
 * @param {object | null | undefined} town @param {{ source?: unknown } | null | undefined} src `economicState.incomeSources[]`
 * @returns {boolean}
 */
export function forgeIdleHere(town, src) {
  if (!town || typeof town !== 'object' || String(src?.source ?? '').trim() !== METAL_SHARE) return false;
  const ids = new Set(INCOME_TRADE_HOUSES[METAL_SHARE] || []);
  // the houses of the trade BY CATALOGUE ID (`supplyStory.js :: idOfHouse`: the stored id, else the catalogue's own id for the
  // name), never by a name test (`tests/joins/labelJoins.test.js`)
  const houses = /** @type {Array<Record<string, unknown>>} */ (liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (town)))
    .filter(isCatalogueHouse)
    .filter((h) => ids.has(idOfHouse(h)));
  const workers = houses.filter((h) => !isSourceHouse(idOfHouse(h)));
  const sources = houses.filter((h) => isSourceHouse(idOfHouse(h)));
  if (!workers.length || !sources.length) return false;
  if (!workers.every((i) => rowShortOf(town, 'house', i) !== null)) return false;
  return sources.some((i) => rowShortOf(town, 'house', i) === null && rowStoppedBy(town, 'house', i) === null);
}
/** A live roster row of the catalogue (named, not a custom house). @param {unknown} h @returns {h is Record<string, unknown>} */
const isCatalogueHouse = (h) => !!h && typeof h === 'object' && typeof (/** @type {{ name?: unknown }} */ (h)).name === 'string'
  && !!(/** @type {{ name?: unknown }} */ (h)).name && !(/** @type {{ custom?: unknown }} */ (h)).custom;
import { INCOME_TRADE_HOUSES } from '../../data/crisisDependence.js';
import { isSourceHouse } from '../facts/houseKinds.js';
import { idOfHouse } from '../facts/supplyStory.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * Every mark an income share prints, in the leaf's order (`rowMarkText`'s): its crisis's (`incomeKindShown`), then its houses'
 * short mark (BAR7-ECON item 1, `crisisStoppedRow.js :: incomeShortOf`); null where it takes none. One mark a row: the share
 * cell beside it is covered by it.
 * @param {object | null | undefined} town @param {Record<string, unknown> | null | undefined} src `economicState.incomeSources[]`
 * @param {string[]} [crises]
 * @returns {string | null}
 */
export function incomeMarkShown(town, src, crises = stoppingCrisesOf(town)) {
  const marks = [crisisMarkText(town, incomeKindShown(town, src, crises)), shortMarkText(incomeShortOf(town, src, crises))].filter(Boolean);
  return marks.length ? marks.join(' ') : null;
}

/**
 * The tab's one head line, where the leaf marks an income share or a supply chain; else null.
 * @param {object | null | undefined} town
 * @param {{ incomeSources?: ReadonlyArray<Record<string, unknown>>, activeChains?: ReadonlyArray<Record<string, unknown>> } | null | undefined} eco
 * @returns {string | null}
 */
export function econOrdinaryTimesLine(town, eco) {
  const crises = stoppingCrisesOf(town);
  // BAR7-ECON item 1: a share marked short says, as the Services tab's head does, what a row marked short is (SUPPLIED_LINE)
  const shortMarked = (eco?.incomeSources || []).some((src) => incomeShortOf(town, src, crises) !== null);
  if (crises.length === 0) return ordinaryTimesLine([], shortMarked);
  const income = (eco?.incomeSources || []).map((src) => incomeKindShown(town, src, crises));
  const chains = (eco?.activeChains || []).map((c) => rowStoppedBy(town, 'chain', c, crises));
  return ordinaryTimesLine(/** @type {string[]} */ ([...income, ...chains].filter(Boolean)), shortMarked);
}

/**
 * THE WORD A FULL EXPLOITATION CARD PRINTS UNDER A SIEGE THAT STOPS THE FIELD WORK (BAR3-LABELS-3, RULING L3b of the
 * chair, 2026-11-15 21:20 UTC; the wide read's C7371 C7595; vetoable by the owner). The Resources tab's card printed
 * "✓ Fully exploited" for a ground whose every chain card on the Economics tab prints "Impaired" under the siege (14 Full
 * cards in 10 of the census's 720 at d38c247af stand under a siege that stops trade; in 7 of them every chain card on the
 * ground prints a word that is not working). NO NEW WORD: the card takes the chain cards' own state word for the same
 * ground (the chains that work it, `facts/chainWorking.js :: chainsWorking`, through `validationOnPage.js ::
 * resourceWorkReading`'s keys, each as its card prints it: `chainCardUnderSiege(town, c, chainAsShown(c, town))`). Where
 * any chain card of the ground still prints a working word (fish under an open sea, `seaOpenTo`: the sea chain works) or
 * no chain card speaks of the ground, the card's grade stands: the function returns null.
 * @param {object | null | undefined} town the settlement
 * @param {{ rawResource?: unknown } | null | undefined} card the exploitation card (filed Full)
 * @returns {string | null} the chain cards' state word ('impaired', …), else null
 */
export function fullCardWordUnderSiege(town, card) {
  if (!town || !card || !tradeStoppedHere(town)) return null;
  const reading = resourceWorkReading(/** @type {import('./validationOnPage.js').PageRecord} */ (town), card.rawResource);
  const cards = chainsWorking(town, reading.keys, reading.good)
    .map((c) => /** @type {Record<string, unknown>} */ (c))
    // BAR7-ECON item 3 (LAW 8's 8i.resource, C20287; vetoable by the owner): a card whose every live Via house the leaf
    // marks is no working card here, whatever its word ("Fishing & Seafood · Vulnerable" over a fisher's landing
    // "Curtailed by the siege."): it reads as SW1's impaired card does
    .map((c) => (everyHouseMarked(town, c) ? 'impaired' : String(chainCardUnderSiege(town, c, chainAsShown(c, town))?.status ?? '')));
  if (cards.length === 0 || cards.some((w) => CARD_STILL_WORKING.has(w) || w === '')) return null;
  return cards[0];
}

/**
 * Does the leaf mark every live house on this chain's Via (`rowMarkText`, kind house: a crisis's mark or the short one)?
 * A chain with no live house is not.
 * @param {object | null | undefined} town @param {Record<string, unknown>} c `economicState.activeChains[]`
 * @returns {boolean}
 */
function everyHouseMarked(town, c) {
  const houses = (Array.isArray(c?.processingInstitutions) ? /** @type {unknown[]} */ (c.processingInstitutions) : [])
    .map((h) => liveHouseOf(town, h)).filter(Boolean);
  return houses.length > 0 && houses.every((h) => rowMarkText(town, 'house', /** @type {Record<string, unknown>} */ (h)) !== null);
}

/** The chain words that say the chain still works its ground (`facts/chainWorking.js :: WORKING_CHAIN_STATUSES`). */
const CARD_STILL_WORKING = new Set(WORKING_CHAIN_STATUSES);
import { tradeStoppedHere, chainAsShown } from './chainStateShown.js';
import { chainPrintName } from './chainPrintName.js';
import { resourceWorkReading } from './validationOnPage.js';
import { chainsWorking, WORKING_CHAIN_STATUSES } from '../facts/chainWorking.js';

/**
 * A STOPPED CHAIN'S "Normally yields" LINE NAMES NO SERVICE WHOSE OWN ROW THE PAGE KEEPS ON OFFER (BAR7-ECON item 4; THE CHAIR'S
 * RULING CY1, 2026-11-17; LAW 8's 8i.chainStopped, C7539; vetoable by the owner). "Harbour and Maritime ... Normally yields Ship
 * construction · Vessel maintenance / Stopped by the siege." beside a shipyard whose card and Services row offer "Ship
 * construction" bare: the dependence table's ruling stands (the yard builds from its own timber, `SERVICE_DEPENDENCE`), and a
 * temple's "Religious services" under a stopped pilgrimage chain is true; the chain card's line is the fault. Where the card
 * refuses its yield (`chainYield.js :: chainYieldRefused`, the card's own header), an output that names, by the reading the
 * cards share (`outputNamesService`), a service row of the town's that the leaf leaves unmarked (`rowMarkText`, kind
 * service) leaves the line; the chips stay. Otherwise the card's outputs are `tradeListDisplay.js :: chainOutputsShown`'s.
 * Read here and not in `chainOutputsShown`: that file sits below the mark's leaf (`crisisStoppedRow.js` imports it through
 * `validationOnPage.js`, the shrink-only cycle guard), so the leaf is read one layer up. Display only.
 * @param {Parameters<typeof chainOutputsShown>[0] & { status?: unknown }} chain the chain as its card prints it
 * @param {object | null | undefined} town
 * @returns {string[]}
 */
export function chainOutputsOnCard(chain, town) {
  const outs = chainOutputsShown(chain, /** @type {Parameters<typeof chainOutputsShown>[1]} */ (town));
  if (!town || !chainYieldRefused(chain)) return outs;
  const onOffer = serviceRowsOf(/** @type {{ availableServices?: unknown } | null | undefined} */ (town)?.availableServices).map(({ svc }) => svc)
    .filter((row) => rowMarkText(town, 'service', row) === null);
  if (onOffer.length === 0) return outs;
  return outs.filter((o) => !onOffer.some((row) => outputNamesService(o, row)));
}

/**
 * Does this output name this service row (its name, six letters or more, as whole words inside the output's, folded)? The
 * reading `outputNamesMarkedService` makes.
 * @param {unknown} output @param {Record<string, unknown>} row
 * @returns {boolean}
 */
function outputNamesService(output, row) {
  const name = folded(row.name);
  return name.length >= 6 && ` ${folded(output)} `.includes(` ${name} `);
}
import { chainOutputsShown } from './tradeListDisplay.js';
import { chainYieldRefused } from '../chainYield.js';

/** The empty export column's line of ordinary times. VETOABLE. */
export const NO_EXPORTS_LINE = 'No significant exports.';

/**
 * THE EMPTY EXPORT COLUMN UNDER A CRISIS SAYS THE CRISIS (BAR7-ECON item 6, LAW 9's 9h.no-exports and 9h.no-exports-record;
 * C20830, the wide read's C211337 C217617; vetoable by the owner). The Exports column printed a bare "No significant
 * exports." where the printed list (`tradeListDisplay.js :: tradeListsAsPrinted`) is empty, on a tab whose head says its rows
 * are of ordinary times, beside "… had several trades selling outward before the siege, and none of them can reach a buyer
 * now." (a besieged hamlet whose record exports salted fish), and under a famine whose village's record exports raw wool and
 * livestock. Where the record holds an export of its own (transit alone is none on this page) and a crisis that marks rows is
 * in force (`stoppingCrisesOf`, the first in the leaf's order), the column says what is true now, in the crisis's own noun:
 * "Nothing is sold outward while the siege lasts."; any other empty column keeps the line of ordinary times. Display only.
 * @param {object | null | undefined} town
 * @returns {string}
 */
export function exportsEmptyLineShown(town) {
  const recorded = /** @type {{ economicState?: { primaryExports?: unknown } } | null | undefined} */ (town)?.economicState?.primaryExports;
  const own = (Array.isArray(recorded) ? recorded : []).filter((x) => typeof x === 'string' && x.trim() && !/^transit trade$/i.test(x.trim()));
  const noun = own.length > 0 ? stoppingCrisesOf(town).map(crisisNounOf).find(Boolean) : null;
  return noun ? `Nothing is sold outward while ${noun} lasts.` : NO_EXPORTS_LINE;
}
