/**
 * domain/worldPulse/convergenceReactive.js — W-CONVERGENCE Stage 3: THE REACTIVE ART
 * OF WAR (DESIGN_CONVERGENCE §3). Deployments become LOUD FACTS that enter the rumor
 * machinery — degradable, corroborable, and (via the information engine) FAKEABLE. The
 * strategy EV gains three typed REACTIVE moves, each consuming a BELIEVED enemy/ally
 * deployment. The reaction is PRICED ON THE BELIEF, not the truth: a phantom column (a
 * false believed deployment) triggers a real, priced muster.
 *
 * ── WHY THIS IS ITS OWN LEAF, AND IT IS THE MODULE'S OWN DECLARED LAW MADE STRUCTURAL ──
 * `convergence.js`'s header carries a recorded, vetoable judgment: intervention
 * initiation is **war-gated, not belief-gated** — "an intervention is a PHYSICAL military
 * operation (armies march regardless of the info layer) … the loaded-dice initiation is
 * deterministic on live state, not on believed fog." Stage 3 is the ONE part of that
 * design that inverts the rule: it is priced on a BELIEVED column and is deliberately
 * indifferent to whether the column is real. Two opposite laws living in one file is how
 * a reader learns the wrong one; the split puts the boundary where the header already
 * said it was. `contestSideLookup` rides along because it is the same stage's declared
 * INTERCEPT seam — a lookup built FOR the transit kernel's `hostilePairFor`, and
 * deliberately unthreaded in wave 1.
 *
 * ⛔ NO BEHAVIOUR MOVED. Every function below is the pre-split source verbatim; the only
 * edits are the module-private helpers (`num`, `round4`, `codepoint`) re-declared here,
 * because `convergence.js` keeps its own and a leaf that imported them would make the
 * split a dependency rather than a separation. `convergence.js` RE-EXPORTS all four
 * symbols, so no consumer import site moves and no test changed.
 *
 * PURE + DETERMINISTIC: no rng, no wall clock, no writes, codepoint-ordered iteration.
 */

import { clamp01 } from '../../kernel/math.js';
import { fieldBattleWinProbability } from '../spatial/armyTransit.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) { return Math.round(v * 10000) / 10000; }

export const REACTIVE_MOVES = Object.freeze(['reinforce', 'intercept', 'counter_intervene', 'stand']);

/** The typed relation a believed column bears to the reactor (what the rumor is ABOUT). */
export const REACTIVE_RELATIONS = Object.freeze({
  ALLY_UNDER_SIEGE: 'ally_under_siege',   // a treaty-ally's gates → REINFORCE (the relief column)
  ENEMY_INTERVENER: 'enemy_intervener',   // a rival joining a contest → COUNTER-INTERVENE (denial)
  ENEMY_COLUMN: 'enemy_column',           // a hostile column en route → INTERCEPT (before it lands)
});

/**
 * The reactive response to a BELIEVED enemy/ally deployment (design §3). REINFORCE (kinetic
 * teeth for compelled-alliance / mutual-defense — the relief column), INTERCEPT (move against
 * a believed column before it arrives), COUNTER-INTERVENE (the denial motive). THE PHANTOM
 * COLUMN: the reaction is priced on the BELIEF (`believed.present`), never on `believed.real`
 * — a FALSE believed deployment triggers a real, priced muster ("the muster answered a rumor,
 * true or not"). Pure, deterministic.
 * @param {{ believed?: { present?: boolean, real?: boolean, strength01?: number } | null,
 *   relation?: string, myStrength01?: number, exhaustion01?: number }} args
 * @returns {{ move: string, ev: number, priced: boolean, believedReal: boolean, receipt: string }}
 */
export function reactiveResponse({ believed = null, relation = REACTIVE_RELATIONS.ENEMY_COLUMN, myStrength01 = 0.5, exhaustion01 = 0 } = {}) {
  if (!believed || believed.present !== true) {
    return { move: 'stand', ev: 0, priced: false, believedReal: false, receipt: 'No word of banners on the roads: the muster stands down.' };
  }
  const bel = clamp01(num(believed.strength01, 0.5));
  const mine = clamp01(num(myStrength01, 0.5));
  const ex = clamp01(num(exhaustion01, 0));
  const believedReal = believed.real !== false; // the reactor cannot tell; the caller may know it's a phantom
  let move; let ev; let receipt;
  if (relation === REACTIVE_RELATIONS.ALLY_UNDER_SIEGE) {
    move = 'reinforce';
    ev = clamp01(mine * (1 - 0.5 * ex));
    receipt = 'Word came of banners at a treaty-ally\'s gates. The relief column marches (the oath has teeth now).';
  } else if (relation === REACTIVE_RELATIONS.ENEMY_INTERVENER) {
    move = 'counter_intervene';
    ev = clamp01(bel * (1 - 0.4 * ex));
    receipt = 'A rival marches to claim the seat: we march to deny it them.';
  } else {
    move = 'intercept';
    ev = clamp01(fieldBattleWinProbability(mine * 100, bel * 100) * (1 - 0.3 * ex));
    receipt = 'Word came of banners on the north road: the muster answered a rumor, true or not, and moved to intercept.';
  }
  // PRICED regardless of truth (the phantom-column law): real force commits to a believed fact.
  return { move, ev: round4(ev), priced: true, believedReal, receipt };
}

/** The INTERCEPT contest-side lookup builder (design §3/§4): maps an army id to its
 *  { contest, side } from the interventions ledger, for the transit kernel's hostilePairFor
 *  extension. Returns null for a non-intervener id ⇒ the predicate is unchanged for it. This
 *  is the spatial-INTERCEPT seam feeder; the transit caller stays byte-identical until it
 *  threads this (documented deferral — intervention columns ride the isolated ledger, not the
 *  transit ledger, so nothing to intercept spatially in wave 1).
 *  ⚠ The record shape is spelled inline rather than type-imported from `convergence.js`:
 *  that module re-exports this one, and a type import back would close an import cycle for
 *  the sake of a JSDoc annotation.
 *  @param {Record<string, { interId: string, target: string, side: string }> | null} ledger
 *  @returns {(armyId: string) => { contest: string, side: string } | null} */
export function contestSideLookup(ledger) {
  /** @type {Map<string, { contest: string, side: string }>} */
  const byInterId = new Map();
  if (ledger) {
    for (const k of Object.keys(ledger).sort(codepoint)) {
      const r = ledger[k];
      // An intervener's "army" is keyed by its own id; its contest is the target.
      if (!byInterId.has(r.interId)) byInterId.set(r.interId, { contest: r.target, side: r.side });
    }
  }
  return (/** @type {string} */ armyId) => byInterId.get(String(armyId)) || null;
}
