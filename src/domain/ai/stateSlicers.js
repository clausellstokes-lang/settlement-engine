/**
 * domain/ai/stateSlicers.js — the RETRIEVAL layer of the analyst (S1,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 1).
 *
 * A question maps to the relevant read-model slices via a registry of state-slicers.
 * DM questions may include ground-truth slices; player-framed questions receive ONLY
 * projections. THE AUDIENCE RULE IS STRUCTURAL, enforced by construction, NEVER by a
 * prompt:
 *
 *   1. A player-framed question ALWAYS resolves to the 'player' audience — even if the
 *      caller passed 'dm' (a downgrade, never an upgrade).
 *   2. The player audience routes only to player-audience brief composers, which emit
 *      only player-safe sources.
 *   3. As a fail-closed backstop, selectSlices() FILTERS a player selection to
 *      player-safe sources — a ground-truth slice is mechanically dropped, so a
 *      player-framed question CANNOT receive one even if a route were misconfigured.
 *
 * The slices are the analyst's grounding: each carries the SOURCE receipt it derives
 * from, so the AI answer can cite it and an unsourceable claim is answered "the engine
 * does not record this".
 *
 * Pure; the slices are produced by the S2 brief composers (reused, not reinvented).
 */

import { BRIEF_COMPOSERS } from '../briefs/index.js';
import { isPlayerSafeSource } from '../briefs/citations.js';

/** Keyword → candidate brief kinds, per audience. First match wins; falls back to the
 *  settlement-scoped default when a settlement is in scope. */
const ROUTES = Object.freeze([
  { rx: /(faction|sphere|hegemon|bloc|alliance|allies|vassal|tributar|empire)/i, dm: ['faction'], player: ['faction'] },
  { rx: /(war|peace|conflict|battle|siege|army|fight|treaty|frontier)/i, dm: ['regional'], player: ['faction'] },
  { rx: /(week|digest|recent|happening|news|lately|going on|state of|overview)/i, dm: ['weekly'], player: ['faction'] },
  { rx: /(secret|conspirac|hidden|irony|really|behind|don't know|do not know)/i, dm: ['dramaticIrony', 'settlement'], player: ['playerSafe'] },
  { rx: /(session|prep|run|tonight|prepare|next game)/i, dm: ['sessionPrep'], player: ['playerSafe'] },
]);

/** Signals that a question is FRAMED for players (safe to share with the party). Any
 *  hit forces the 'player' audience regardless of the caller's request. */
const PLAYER_FRAMED_RE = /(player|party|share|tell the (players|party)|what (do|can) (they|the players|my players)|public|safe to (say|share)|hand out|reveal to)/i;

/** The always-available settlement-scoped default kinds, by audience. */
const DEFAULT_KINDS = Object.freeze({ dm: ['settlement'], player: ['playerSafe'] });

/**
 * True iff the question is player-framed (must receive projections only).
 * @param {unknown} question
 * @returns {boolean}
 */
export function isPlayerFramed(question) {
  return typeof question === 'string' && PLAYER_FRAMED_RE.test(question);
}

/**
 * Resolve the EFFECTIVE audience. Fail-closed:
 *   - a player-framed question ⇒ 'player' (downgrade even a 'dm' request);
 *   - an explicit 'dm' on a non-player-framed question ⇒ 'dm';
 *   - anything else (unset / unknown) ⇒ 'player' (projections only).
 * @param {unknown} question @param {unknown} requested
 * @returns {'dm'|'player'}
 */
export function resolveAudience(question, requested) {
  if (isPlayerFramed(question)) return 'player';
  return requested === 'dm' ? 'dm' : 'player';
}

/**
 * The brief kinds a question routes to, for the given effective audience. A settlement
 * in scope adds the audience default; a realm-only question keeps the routed kinds.
 * @param {string} question @param {'dm'|'player'} audience @param {boolean} hasSettlement
 * @returns {string[]}
 */
function routeKinds(question, audience, hasSettlement) {
  const q = typeof question === 'string' ? question : '';
  const kinds = new Set();
  for (const route of ROUTES) {
    if (route.rx.test(q)) for (const k of route[audience]) kinds.add(k);
  }
  if (kinds.size === 0 || hasSettlement) {
    for (const k of DEFAULT_KINDS[audience]) if (hasSettlement || kinds.size === 0) kinds.add(k);
  }
  return [...kinds];
}

/**
 * A retrieval SLICE: a sourced fragment of the read-model, ready to ground the answer.
 * @typedef {Object} Slice
 * @property {string} id        `${briefKind}:${sectionId}`
 * @property {string} source    one of SOURCE.* (the receipt)
 * @property {string} title
 * @property {Array<Record<string, unknown>>} data
 */

/**
 * Select the relevant read-model slices for a question, under the STRUCTURAL audience
 * rule. Player audience yields ONLY player-safe slices — a ground-truth slice is
 * dropped by construction.
 *
 * @param {{ question?: string,
 *           worldState?: Record<string, unknown>|null,
 *           settlements?: Array<Record<string, unknown>>,
 *           settlement?: Record<string, unknown>|null,
 *           tick?: number,
 *           audience?: 'dm'|'player' }} args
 * @returns {{ audience: 'dm'|'player', slices: Slice[] }}
 */
export function selectSlices({ question = '', worldState = null, settlements = [], settlement = null, tick = 0, audience } = {}) {
  const effective = resolveAudience(question, audience);
  const hasSettlement = !!(settlement && typeof settlement === 'object');
  const kinds = routeKinds(question, effective, hasSettlement);

  const slices = [];
  const composers = /** @type {Record<string, { compose: Function, audience: string, scope: string }>} */ (BRIEF_COMPOSERS);
  for (const kind of kinds) {
    const entry = composers[kind];
    if (!entry) continue;
    // A settlement-scoped brief with no settlement in scope contributes nothing.
    if (entry.scope === 'settlement' && !hasSettlement) continue;
    let brief;
    try {
      brief = entry.compose({ settlement, worldState, settlements, tick, audience: effective });
    } catch { continue; } // inert-not-crash: a bad ingredient never fails retrieval
    for (const sec of brief.sections) {
      slices.push({ id: `${kind}:${sec.id}`, source: sec.source, title: sec.title, data: sec.items });
    }
  }

  // ── STRUCTURAL FAIL-CLOSED BACKSTOP ──────────────────────────────────────────
  // A player-framed / player-audience selection can carry ONLY player-safe sources.
  // Any slice whose source is not player-safe is DROPPED here, so a player-framed
  // question CANNOT receive a ground-truth slice even if a route were misconfigured.
  const gated = effective === 'player'
    ? slices.filter((s) => isPlayerSafeSource(s.source))
    : slices;

  return { audience: effective, slices: gated };
}
