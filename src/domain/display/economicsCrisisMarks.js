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
import { stoppingCrisesOf, rowStoppedBy, crisisMarkText, crisisOfMarkKind, markedDescription, ordinaryTimesLine } from './crisisStoppedRow.js';
import { liveHouseOf } from '../facts/presence.js'; // BAR3-LABELS-2 L3: the roster house a chain's catalogue house answers to

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
 * @template {{ status?: unknown }} C
 * @param {object | null | undefined} town the settlement
 * @param {Record<string, unknown>} record the chain as the record holds it (`economicState.activeChains[]`)
 * @param {C} shown the same chain as its card prints it (`chainAsShown`)
 * @returns {C}
 */
export function chainCardUnderSiege(town, record, shown) {
  if (!CARD_WORKING.has(String(shown?.status ?? '')) || !stoppingCrisesOf(town).includes('under_siege')) return shown;
  if (rowStoppedBy(town, 'chain', record, ['under_siege']) === 'under_siege') return { ...shown, status: 'impaired' }; // the card's own mark
  const houses = (Array.isArray(record?.processingInstitutions) ? /** @type {unknown[]} */ (record.processingInstitutions) : [])
    .map((h) => liveHouseOf(town, h)).filter(Boolean);
  // SW1: a house the siege stops or curtails (its partial kind, `under_siege:curtailed`) carries the siege's mark
  const marked = (/** @type {string | null} */ kind) => kind !== null && crisisOfMarkKind(kind) === 'under_siege';
  const stopped = houses.length > 0 && houses.every((h) => marked(rowStoppedBy(town, 'house', /** @type {Record<string, unknown>} */ (h), ['under_siege'])));
  return stopped ? { ...shown, status: 'impaired' } : shown;
}

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
  return { chain, incomeStopped: (income) => rowStoppedBy(town, 'income', income, crises) !== null };
}

/**
 * An income share's description as the tab prints it: the leaf's mark, then the description of ordinary times.
 * @param {object | null | undefined} town @param {{ source?: unknown, desc?: unknown }} src `economicState.incomeSources[]`
 * @returns {string}
 */
export function incomeDescShown(town, src) {
  return markedDescription(crisisMarkText(town, rowStoppedBy(town, 'income', src)), src?.desc);
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
  const income = (eco?.incomeSources || []).map((src) => rowStoppedBy(town, 'income', src, crises));
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
  const reading = resourceWorkReading(/** @type {any} */ (town), card.rawResource);
  const words = chainsWorking(town, reading.keys, reading.good)
    .map((c) => String(chainCardUnderSiege(town, /** @type {Record<string, unknown>} */ (c), chainAsShown(/** @type {any} */ (c), /** @type {any} */ (town)))?.status ?? ''));
  if (words.length === 0 || words.some((w) => CARD_STILL_WORKING.has(w) || w === '')) return null;
  return words[0];
}

/** The chain words that say the chain still works its ground (`facts/chainWorking.js :: WORKING_CHAIN_STATUSES`). */
const CARD_STILL_WORKING = new Set(WORKING_CHAIN_STATUSES);
import { tradeStoppedHere, chainAsShown } from './chainStateShown.js';
import { resourceWorkReading } from './validationOnPage.js';
import { chainsWorking, WORKING_CHAIN_STATUSES } from '../facts/chainWorking.js';
