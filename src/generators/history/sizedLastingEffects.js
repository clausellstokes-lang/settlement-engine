/**
 * W2-FIX-DATA-13 (2026-11-14; the chair's 12:11 ruling on REVIEW-W2-FIX-DATA-4's HIGH): QUARTERS AND DISTRICTS BELONG TO
 * A TOWN OR LARGER, whatever the head count. "Newcomer and old-family districts remain socially distinct" printed in a
 * thorp of 7 and a thorp of 12: the event tables' lasting effects were drawn raw. Each one that names a district or a
 * quarter declares its size in `historyData.js :: HISTORY_DESC_SIBLINGS` (no twin). Draw-free: the severity roll and the
 * effect rolls (`historyGenerator.js :: generateEventNarrative`) are unchanged; a refused effect gives way to the
 * template's next unchosen effect whose own test holds, in the table's order, else to silence. A tension prints its
 * template's whole list: a refused effect leaves it.
 */
import { resolveSibling } from '../../domain/facts/drawDeclared.js';
import { HISTORY_DESC_SIBLINGS } from '../../data/historyData.js';

/** @param {unknown} effect @param {object | (() => object) | null} facts @returns {string | null} */
const sizedEffect = (effect, facts) => resolveSibling(/** @type {any} */ (effect), HISTORY_DESC_SIBLINGS, { facts, poolId: 'historyData:HISTORY_DESC_SIBLINGS', surface: 'history', drawKind: 'T', dropRefused: true });

/**
 * @param {ReadonlyArray<any>} selected the effects the rolls chose, in roll order
 * @param {ReadonlyArray<any>} rest the template's unchosen effects, in the table's order
 * @param {object | (() => object) | null} facts the history's facts (`hookFacts`)
 * @returns {any[]}
 */
export function sizedLastingEffects(selected, rest, facts) {
  const spare = [...rest]; const out = [];
  for (const effect of selected) {
    let line = sizedEffect(effect, facts);
    while (line == null && spare.length) line = sizedEffect(spare.shift(), facts);
    if (line != null) out.push(line);
  }
  return out;
}

/** @param {ReadonlyArray<any>} effects a tension's whole list @param {object | (() => object) | null} facts @returns {any[]} */
export function sizedTensionEffects(effects, facts) {
  return effects.map((effect) => sizedEffect(effect, facts)).filter((line) => line != null);
}
