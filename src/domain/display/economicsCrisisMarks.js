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
 * Only the Economics tab calls this leaf. Pure: no randomness, no clock, no write.
 */
import { stoppingCrisesOf, rowStoppedBy, crisisMarkText, markedDescription, ordinaryTimesLine } from './crisisStoppedRow.js';

/**
 * The marks of the flow cards (keyed by the card's chain as shown) and the reading of the share a card names.
 * @param {unknown} town the settlement
 * @param {ReadonlyArray<object>} records `economicState.activeChains`, in the record's order
 * @param {ReadonlyArray<object>} shown the same chains as the cards print them (`chainAsShown`), index for index
 * @returns {{ chain: Map<object, string>, incomeStopped: (income: object) => boolean }}
 */
export function flowCrisisMarks(town, records, shown) {
  const crises = stoppingCrisesOf(/** @type {any} */ (town));
  const chain = new Map();
  shown.forEach((c, i) => {
    const mark = crisisMarkText(/** @type {any} */ (town), rowStoppedBy(/** @type {any} */ (town), 'chain', /** @type {any} */ (records[i]), crises));
    if (mark) chain.set(c, mark);
  });
  return { chain, incomeStopped: (income) => rowStoppedBy(/** @type {any} */ (town), 'income', /** @type {any} */ (income), crises) !== null };
}

/**
 * An income share's description as the tab prints it: the leaf's mark, then the description of ordinary times.
 * @param {unknown} town @param {{ source?: unknown, desc?: unknown }} src `economicState.incomeSources[]`
 * @returns {string}
 */
export function incomeDescShown(town, src) {
  return markedDescription(crisisMarkText(/** @type {any} */ (town), rowStoppedBy(/** @type {any} */ (town), 'income', /** @type {any} */ (src))), src?.desc);
}

/**
 * The tab's one head line, where the leaf marks an income share or a supply chain; else null.
 * @param {unknown} town
 * @param {{ incomeSources?: ReadonlyArray<object>, activeChains?: ReadonlyArray<object> } | null | undefined} eco
 * @returns {string | null}
 */
export function econOrdinaryTimesLine(town, eco) {
  const crises = stoppingCrisesOf(/** @type {any} */ (town));
  if (crises.length === 0) return null;
  const income = (eco?.incomeSources || []).map((src) => rowStoppedBy(/** @type {any} */ (town), 'income', /** @type {any} */ (src), crises));
  const chains = (eco?.activeChains || []).map((c) => rowStoppedBy(/** @type {any} */ (town), 'chain', /** @type {any} */ (c), crises));
  return ordinaryTimesLine(/** @type {string[]} */ ([...income, ...chains].filter(Boolean)));
}
