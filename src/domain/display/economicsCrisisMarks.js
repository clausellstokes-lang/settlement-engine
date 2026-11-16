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
import { stoppingCrisesOf, rowStoppedBy, crisisMarkText, crisisOfMarkKind, markedDescription, ordinaryTimesLine, STOPPED_WORD } from './crisisStoppedRow.js';
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
 * @param {{ institutions?: unknown, exportable?: unknown, output?: unknown } | null | undefined} svc one service card's record
 * @param {ReadonlySet<string>} impairedHouses the houses the Institutions tab marks impaired, lower case
 * @returns {{ state: 'impaired' | 'operational', exportStopped: boolean }}
 */
export function serviceCardShown(town, svc, impairedHouses) {
  const houses = Array.isArray(svc?.institutions) ? /** @type {unknown[]} */ (svc.institutions) : [];
  const own = serviceStateShown(houses, impairedHouses);
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
 * printed name (`chainPrintName`, or the record's label) takes the siege's partial mark, "Curtailed by the siege.", where
 * that chain's card prints "impaired" (`chainCardUnderCrisis` over `chainAsShown`, the card's own reading): the trade works
 * what it holds and nothing comes in to mend it. Outside a siege the share reads the leaf alone.
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
  const titled = (Array.isArray(chains) ? /** @type {Record<string, unknown>[]} */ (chains) : [])
    .filter((c) => c && (folded(c.label) === title || folded(chainPrintName(/** @type {any} */ (c), town)) === title));
  return titled.some((c) => String(chainCardUnderCrisis(town, c, chainAsShown(c, town))?.status ?? '') === 'impaired') ? SIEGE_CURTAILED : null;
}

/** The siege's partial kind, the leaf's own key (`crisisStoppedRow.js :: MARK_LINES`, "Curtailed by the siege."). */
const SIEGE_CURTAILED = 'under_siege:curtailed';

/**
 * An income share's description as the tab prints it: the leaf's mark, then the description of ordinary times.
 * @param {object | null | undefined} town @param {{ source?: unknown, desc?: unknown }} src `economicState.incomeSources[]`
 * @returns {string}
 */
export function incomeDescShown(town, src) {
  return markedDescription(crisisMarkText(town, incomeKindShown(town, /** @type {Record<string, unknown>} */ (src))), src?.desc);
}

/**
 * The tab's one head line, where the leaf marks an income share or a supply chain; else null.
 * @param {object | null | undefined} town
 * @param {{ incomeSources?: ReadonlyArray<Record<string, unknown>>, activeChains?: ReadonlyArray<Record<string, unknown>> } | null | undefined} eco
 * @returns {string | null}
 */
export function econOrdinaryTimesLine(town, eco) {
  const crises = stoppingCrisesOf(town);
  if (crises.length === 0) return null;
  const income = (eco?.incomeSources || []).map((src) => incomeKindShown(town, src, crises));
  const chains = (eco?.activeChains || []).map((c) => rowStoppedBy(town, 'chain', c, crises));
  return ordinaryTimesLine(/** @type {string[]} */ ([...income, ...chains].filter(Boolean)));
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
  const words = chainsWorking(town, reading.keys, reading.good)
    .map((c) => /** @type {Record<string, unknown>} */ (c))
    .map((c) => String(chainCardUnderSiege(town, c, chainAsShown(c, town))?.status ?? ''));
  if (words.length === 0 || words.some((w) => CARD_STILL_WORKING.has(w) || w === '')) return null;
  return words[0];
}

/** The chain words that say the chain still works its ground (`facts/chainWorking.js :: WORKING_CHAIN_STATUSES`). */
const CARD_STILL_WORKING = new Set(WORKING_CHAIN_STATUSES);
import { tradeStoppedHere, chainAsShown, serviceStateShown } from './chainStateShown.js';
import { chainPrintName } from './chainPrintName.js';
import { resourceWorkReading } from './validationOnPage.js';
import { chainsWorking, WORKING_CHAIN_STATUSES } from '../facts/chainWorking.js';
