/**
 * W2-FIX-DATA-13 (2026-11-14; the chair's 12:11 ruling on REVIEW-W2-FIX-DATA-4's HIGH): QUARTERS AND DISTRICTS BELONG TO
 * A TOWN OR LARGER, whatever the head count. "Newcomer and old-family districts remain socially distinct" printed in a
 * thorp of 7 and a thorp of 12: the event tables' lasting effects were drawn raw. Each one that names a district or a
 * quarter declares its size in `historyData.js :: HISTORY_DESC_SIBLINGS`. The chair's 12:50 ruling: A TIER TWIN where the
 * event can be said of a small place in its own words, ELSE SILENCE. Draw-free: the severity roll and the effect rolls
 * (`historyGenerator.js :: generateEventNarrative`) are unchanged; each drawn effect resolves to itself or its twin, and
 * one with no admitted twin is left out (an event's, or a tension's whole list).
 */
import { resolveSibling } from '../../domain/facts/drawDeclared.js';
import { HISTORY_DESC_SIBLINGS } from '../../data/historyData.js';

/** @param {unknown} effect @param {object | (() => object) | null} facts @returns {string | null} */
const sizedEffect = (effect, facts) => resolveSibling(/** @type {any} */ (effect), HISTORY_DESC_SIBLINGS, { facts, poolId: 'historyData:HISTORY_DESC_SIBLINGS', surface: 'history', drawKind: 'T', dropRefused: true });

/**
 * @param {ReadonlyArray<any>} effects the effects the rolls chose (an event), or a tension's whole list
 * @param {object | (() => object) | null} facts the history's facts (`hookFacts`)
 * @returns {any[]} each effect, or its tier twin; a refused effect with no admitted twin left out
 */
export function sizedLastingEffects(effects, facts) {
  return effects.map((effect) => sizedEffect(effect, facts)).filter((line) => line != null);
}
