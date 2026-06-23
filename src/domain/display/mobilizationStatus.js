/**
 * domain/display/mobilizationStatus.js — read-model SELECTOR for the DM UI.
 *
 * A `warStatus.js`-style projection of the LIVE mobilization posture
 * (worldState.warPosture) and the FEASIBILITY of a hypothetical siege, in HEURISTIC
 * DM language — NO internal jargon (no posture enum names, no capacity numbers, no
 * ratio, no rng). This module just provides the read-model; the UI does the wiring.
 *
 * PRESENTATION ONLY. Pure projection: nothing here mutates worldState, forks rng, or
 * reads a wall clock. INERT, NOT CRASH, WHEN ABSENT — a no-war campaign (absent
 * warPosture ledger) yields empty results, never throws. Every list is codepoint-
 * sorted for stable order.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import {
  feasibilityRatio,
  classifyFeasibility,
} from '../worldPulse/feasibilityGate.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

// Heuristic phrasing for each posture state — DM-facing, no enum jargon. `peace` /
// `demobilizing` read as winding-down; war_preparation / mobilized read as gearing.
const POSTURE_PHRASE = Object.freeze({
  peace: 'at peace',
  alert: 'on alert',
  war_preparation: 'gearing for war, the economy shifting to a war footing',
  mobilized: 'fully mobilized, a war economy ready to march',
  deployed: 'army in the field',
  war_exhaustion: 'war-weary, its army spent',
  demobilizing: 'standing down, the war economy unwinding',
});

// The linear ramp rungs (peace=0 … mobilized=3) → how many rungs to the top.
const RAMP_ORDER = Object.freeze(['peace', 'alert', 'war_preparation', 'mobilized']);

/**
 * The heuristic phrase for a posture state. Unknown states fall back to a neutral
 * "at peace" so the read-model is total.
 * @param {string} state @returns {string}
 */
export function posturePhrase(state) {
  return /** @type {Record<string, string>} */ (POSTURE_PHRASE)[String(state)] || 'at peace';
}

/**
 * A rough "ticks to deploy" estimate from a posture record — how many more rungs a
 * settlement has to climb before it is war-ready, plus the fractional progress within
 * the current rung. Heuristic, presentation-only (the real rate is disposition-gated;
 * this is the optimistic "~N ticks" the DM sees). A war-ready / non-ramp posture
 * returns 0.
 * @param {{ state?: string, progress?: number }} rec
 * @returns {number} an integer estimate of remaining ticks to mobilized (≥ 0).
 */
export function ticksToDeploy(rec) {
  const state = String(rec?.state || 'peace');
  const idx = RAMP_ORDER.indexOf(state);
  if (idx < 0) return 0; // deployed / war_exhaustion / demobilizing — not ramping up
  const top = RAMP_ORDER.length - 1;
  if (idx >= top) return 0;
  const progress = Number.isFinite(rec?.progress) ? Math.max(0, Math.min(1, Number(rec.progress))) : 0;
  // Rungs remaining minus the progress already made in the current rung; a neutral
  // settlement crosses a rung in ~3 ticks, so scale by 3 for the optimistic estimate.
  const rungsLeft = (top - idx) - progress;
  return Math.max(1, Math.ceil(rungsLeft * 3));
}

/**
 * The live mobilization standings: one entry per settlement that has LEFT peace,
 * codepoint-sorted by id, each with a heuristic phrase + a ticks-to-deploy estimate.
 * A COVERT mobilizer is INCLUDED only for the GM view (`includeCovert: true`); a
 * player-facing call (`includeCovert: false`, the default) omits covert preparation —
 * honouring the channel-visibility convention. Returns [] when the ledger is absent /
 * everyone is at peace.
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {boolean} [args.includeCovert]  GM view ⇒ true; player view ⇒ false (default).
 * @returns {Array<{ id: string, phrase: string, ticksToDeploy: number, covert: boolean }>}
 */
export function mobilizationStandings({ worldState, includeCovert = false } = /** @type {any} */ ({})) {
  const ledger = worldState?.warPosture && typeof worldState.warPosture === 'object' ? worldState.warPosture : {};
  /** @type {Array<{ id: string, phrase: string, ticksToDeploy: number, covert: boolean }>} */
  const out = [];
  for (const id of Object.keys(ledger).sort(codepoint)) {
    const rec = ledger[id] || {};
    const state = String(rec.state || 'peace');
    if (state === 'peace') continue; // not mobilizing
    const covert = rec.covert === true;
    if (covert && !includeCovert) continue; // hidden from player views
    out.push({ id, phrase: posturePhrase(state), ticksToDeploy: ticksToDeploy(rec), covert });
  }
  return out;
}

/**
 * The mobilization status of ONE settlement — null when at peace / absent. Honours
 * the covert convention: a player-view (`includeCovert:false`) call on a covertly-
 * preparing settlement returns null.
 * @param {Object} args
 * @param {any} args.settlementId
 * @param {any} args.worldState
 * @param {boolean} [args.includeCovert]
 * @returns {{ phrase: string, ticksToDeploy: number, covert: boolean } | null}
 */
export function settlementMobilization({ settlementId, worldState, includeCovert = false } = /** @type {any} */ ({})) {
  if (settlementId == null) return null;
  const ledger = worldState?.warPosture && typeof worldState.warPosture === 'object' ? worldState.warPosture : {};
  const rec = ledger[String(settlementId)];
  if (!rec) return null;
  const state = String(rec.state || 'peace');
  if (state === 'peace') return null;
  const covert = rec.covert === true;
  if (covert && !includeCovert) return null;
  return { phrase: posturePhrase(state), ticksToDeploy: ticksToDeploy(rec), covert };
}

// Heuristic phrasing for a feasibility verdict — DM language, NO ratio / capacity /
// enum jargon. This is the "siege implausible: defender far stronger, needs a
// coalition" surfacing the proposal §16 asks for.
const FEASIBILITY_PHRASE = Object.freeze({
  plausible: 'a real contest, the outcome uncertain',
  auto_fail: 'hopeless; the defender is far too strong to assault',
  harassment: 'too weak to take the town; it could only raid the approaches',
  require_coalition: 'not alone; it would take a coalition to threaten the defender',
  require_betrayal: 'only from within: the defender would have to fracture first (a coup or revolt)',
  require_magic: 'only with decisive magical force could the attack succeed',
});

/**
 * The heuristic feasibility outlook of a hypothetical attacker→defender siege, from
 * two CURRENT-capacity scores (0..100). Presentation-only: it RE-RUNS the same
 * deterministic classifier the engine uses, then phrases it in DM language — so the
 * DM preview and the engine verdict can never disagree. Returns the phrase + a coarse
 * "feasible enough to contest" boolean.
 *
 * @param {Object} args
 * @param {number} args.attackerCurrent  0..100 — the (coalition-summed) attacker current capacity.
 * @param {number} args.defenderCurrent  0..100 — the defender current capacity.
 * @param {number} [args.coalitionSize]
 * @param {any} [args.defenderItem]      the defender snapshot item (collapse read).
 * @param {{ materiel?: number }} [args.attackerFacets]
 * @param {{ materiel?: number }} [args.defenderFacets]
 * @returns {{ phrase: string, contestable: boolean, verdict: string }}
 */
export function feasibilityOutlook({ attackerCurrent, defenderCurrent, coalitionSize = 1, defenderItem = null, attackerFacets = {}, defenderFacets = {} }) {
  const { verdict } = classifyFeasibility({ attackerCurrent, defenderCurrent, coalitionSize, defenderItem, attackerFacets, defenderFacets });
  const contestable = verdict === 'plausible' || verdict === 'require_betrayal' || verdict === 'require_magic';
  return {
    phrase: /** @type {Record<string, string>} */ (FEASIBILITY_PHRASE)[verdict] || FEASIBILITY_PHRASE.plausible,
    contestable,
    verdict,
  };
}

/**
 * Whether ANY live mobilization posture is present (the gate a panel uses to decide
 * whether to render its mobilization block). A dormant campaign yields false ⇒
 * nothing renders ⇒ byte-identical.
 * @param {Object} args
 * @param {any} args.worldState
 * @param {boolean} [args.includeCovert]
 * @returns {boolean}
 */
export function hasLiveMobilization({ worldState, includeCovert = false } = /** @type {any} */ ({})) {
  return mobilizationStandings({ worldState, includeCovert }).length > 0;
}

// Re-export the raw ratio for callers that want the underlying number (kept out of
// the heuristic surfacing — DM views use the phrases above).
export { feasibilityRatio };

export const MOBILIZATION_STATUS_PHRASES = Object.freeze({ POSTURE_PHRASE, FEASIBILITY_PHRASE });
