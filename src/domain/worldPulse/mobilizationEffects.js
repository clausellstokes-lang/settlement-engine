/**
 * domain/worldPulse/mobilizationEffects.js — mobilization side-effects.
 *
 * Turns the per-tick mobilization posture events (mobilization.js) into the three
 * things the rest of the pulse consumes:
 *
 *  1. `war_mobilization` ACTIVE CONDITIONS — the war-economy footing cost
 *     (economic_capacity sink, the existing machinery carries it). Stamped on every
 *     settlement at war_preparation / mobilized / deployed posture.
 *  2. VISIBLE MOBILIZATION SIGNALS — `information_flow` directed channels from the
 *     mobilizing settlement to each neighbour, honoring the channel-visibility
 *     convention: an OVERT preparation is `public` (neighbours see it); a COVERT
 *     preparation is `gm` (hidden from player views). Carries posture metadata.
 *  3. The list of (mobilizer → state) facts the neighbour-REACTION rule reads to
 *     decide who reacts and how.
 *
 * DETERMINISM CONTRACT: PURE. No rng, no wall-clock (the `now` stamp is threaded in),
 * no mutation of inputs. Every iteration is over a CODEPOINT-SORTED id list. Reading
 * only the pre-tick snapshot + the posture events.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { mintDirectedChannel } from '../region/graph.js';
import {
  getRelationshipSettlements,
  normalizeRelationshipEdge,
} from './relationshipEvolution.js';
import { stablePart } from './worldState.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));

// The posture states that carry a war-economy footing (a war_mobilization
// condition). peace / alert / demobilizing do NOT — preparation only costs once the
// economy actually shifts. deployed is carried by the war layer's own conditions, so
// it is NOT re-stamped here (avoids double-counting the economic sink).
const FOOTING_STATES = new Set(['war_preparation', 'mobilized']);

/**
 * The settlements visible to (neighbouring) a given settlement, with the
 * relationship type, read from the pre-tick edges. Codepoint-sorted. A neighbour is
 * anyone sharing an edge — the reaction rule filters by relationship class.
 * @param {any} snapshot
 * @param {string} fromId
 * @returns {Array<{ id: string, relationshipType: string }>}
 */
export function neighboursOf(snapshot, fromId) {
  const id = String(fromId);
  const states = snapshot?.worldState?.relationshipStates || {};
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;
    const key = rawEdge?.id || `${a}->${b}`;
    const relState = states[key] || {};
    out.set(other, String(relState.relationshipType || rawEdge?.relationshipType || 'neutral'));
  }
  return [...out.keys()].sort(codepoint).map((nid) => ({ id: nid, relationshipType: out.get(nid) || 'neutral' }));
}

/**
 * Build the mobilization conditions + visible signals from this tick's posture
 * events. Returns:
 *   - outcomes: probability-1 `war_mobilization` condition outcomes (the footing cost).
 *   - graphChannels: `information_flow` directed channels (public overt / gm covert).
 *   - mobilizers: codepoint-sorted facts { id, state, covert, severity } the reaction
 *     rule reads.
 *
 * RESUME DISMISSAL (parity with the conquest-dismiss path): a `war_mobilization`
 * major the DM dismissed must commit NOTHING — not its footing condition, not its
 * neighbour signals (and the caller drops its warPosture ledger entry too). The
 * dismissal set is keyed by the outcome id (`world_outcome.war_mobilization.<id>.<tick>`),
 * the SAME id minted below; a settlement whose footing outcome id is dismissed is
 * skipped entirely (no outcome, no signal channels) and reported back on
 * `dismissedIds` so the caller can drop its posture-ledger key. EMPTY/null ⇒ no
 * exclusion ⇒ byte-identical to the autoresolve-ON tick (the equivalence invariant).
 *
 * @param {Object} args
 * @param {any} args.snapshot
 * @param {Array<{ id: string, prev: string, next: string, transitioned: boolean, cooled: boolean, covert: boolean, severity: number, reasons: string[] }>} args.events
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @param {ReadonlySet<string>|null} [args.dismissedOutcomeIds]  outcome ids the DM dismissed.
 * @returns {{ outcomes: any[], graphChannels: any[], mobilizers: Array<{ id: string, state: string, covert: boolean, severity: number }>, dismissedIds: string[] }}
 */
export function mobilizationEffects({ snapshot, events, tick, now = null, dismissedOutcomeIds = null }) {
  const outcomes = [];
  const graphChannels = [];
  /** @type {Array<{ id: string, state: string, covert: boolean, severity: number }>} */
  const mobilizers = [];
  // The settlement ids whose war_mobilization major the DM dismissed (skipped here):
  // the caller drops their warPosture ledger key so the dismissal leaves no residue.
  /** @type {string[]} */
  const dismissedIds = [];
  const isDismissed = dismissedOutcomeIds && typeof dismissedOutcomeIds.has === 'function' && dismissedOutcomeIds.size > 0
    ? (/** @type {string} */ outcomeId) => dismissedOutcomeIds.has(outcomeId)
    : null;

  const settlementNameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };

  // events are already codepoint-sorted (mobilization iterates sorted ids).
  for (const ev of events) {
    const onFooting = FOOTING_STATES.has(ev.next);
    if (!onFooting) continue;
    const id = ev.id;
    const outcomeId = `world_outcome.war_mobilization.${stablePart(id)}.${tick}`;
    // A DM-DISMISSED war_mobilization commits nothing: no footing condition, no
    // mobilizer fact, no neighbour signal channels — and the caller drops its
    // warPosture ledger key (reported via dismissedIds). Parity with conquest-dismiss.
    if (isDismissed && isDismissed(outcomeId)) {
      dismissedIds.push(id);
      continue;
    }
    const name = settlementNameFor(id);
    const severity = clamp01(ev.severity);

    // ── 1. The war-economy footing condition (economic_capacity sink). ─────────────
    outcomes.push({
      id: outcomeId,
      type: 'condition',
      candidateType: 'war_mobilization',
      ruleId: 'war_layer_war_mobilization',
      ruleFamily: 'stressor',
      applyMode: 'auto',
      probability: 1,
      targetSaveId: id,
      severity,
      headline: `${name} mobilizes for war`,
      summary: `${name} is shifting its economy onto a war footing.`,
      reasons: ev.reasons.slice(0, 4),
      condition: {
        archetype: 'war_mobilization',
        severity,
        triggeredAt: { tick, sourceEventType: 'WAR_LAYER_MOBILIZATION', sourceEventTargetId: id },
        causes: [{ source: id, effect: 'war_mobilization', reason: `${name} is gearing for war (${ev.next}).` }],
      },
    });

    mobilizers.push({ id, state: ev.next, covert: ev.covert === true, severity });

    // ── 2. The VISIBLE mobilization signal — one information_flow channel per
    // neighbour. visibility honours the channel-visibility convention: OVERT prep is
    // `public` (neighbours' player views see it); COVERT prep is `gm` (hidden from
    // player views — only the DM / the reaction rule sees it). ─────────────────────
    const visibility = ev.covert ? 'gm' : 'public';
    for (const neighbour of neighboursOf(snapshot, id)) {
      graphChannels.push(mintDirectedChannel({
        type: 'information_flow',
        from: id,
        to: neighbour.id,
        strength: clamp01(0.45 + severity * 0.4),
        confidence: 0.75,
        visibility,
        explanation: `${name} is visibly mobilizing for war (${ev.next}).`,
        relationshipKey: `mobilization_signal.${stablePart(id)}.${stablePart(neighbour.id)}`,
        source: 'war_layer_mobilization',
        now,
      }));
    }
  }

  return { outcomes, graphChannels, mobilizers, dismissedIds };
}
