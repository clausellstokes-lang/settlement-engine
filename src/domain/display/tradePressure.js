/**
 * domain/display/tradePressure.js — read-model SELECTOR for the DM UI:
 * STRATEGIC TRADE in heuristic DM language — trade PRESSURE, DEPENDENCY, and
 * COERCION leverage.
 *
 * A projection of the trade-salience model (worldPulse/tradeSalience.js) that
 * surfaces, in PLAIN WORDS:
 *   - trade PRESSURE: a valuable, hard-to-replace tie makes war between two
 *     settlements costlier ⇒ less likely ("a vital grain tie restrains them");
 *   - DEPENDENCY: a CRITICAL-supplier dependency ("dependent on N for X — losing
 *     it would mean famine") names the dependent + its supplier;
 *   - COERCION: the leverage a critical supplier holds over its dependent ("holds
 *     leverage over N — it could choke the supply").
 *
 * ── PLAYER-SAFE / NO LEAKS. ──────────────────────────────────────────────────
 * COVERT/SMUGGLING ties between battlefield enemies are GM-ONLY. A player-facing /
 * public call (`includeCovert: false`, the DEFAULT) NEVER surfaces a covert
 * smuggling tie — honouring the channel-visibility convention exactly like
 * mobilizationStatus's covert mobilization. A GM view (`includeCovert: true`) may
 * see them. The covert flag rides on the overlay entry (`{ status:'smuggling',
 * covert:true }`); this module drops every covert tie unless the GM opts in.
 *
 * HEURISTIC DM LANGUAGE — NO INTERNALS. No salience/need/replace float, no factor,
 * no dampening number, no rng. The scalars are bucketed into words.
 *
 * PRESENTATION ONLY. Pure projection: nothing mutates worldState, forks rng, or
 * reads a wall clock. INERT, NOT CRASH, WHEN ABSENT — a no-graph / no-tie campaign
 * yields []/null. Codepoint-sorted everywhere.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import {
  pairTradeSalience,
  computeSecondaryStatusOverlay,
  TRADE_SALIENCE_TUNING,
} from '../worldPulse/tradeSalience.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * Build the minimal snapshot shape the salience selectors expect from a regional
 * graph + the campaign's settlement items. `byId` is the only field the selectors
 * read for settlement economic/food/military state; `regionalGraph` carries the
 * confirmed trade carriers. Tolerates an absent graph / items.
 *
 * @param {any} regionalGraph
 * @param {Array<{ id?: any, settlement?: any }>} items
 * @param {any} worldState
 * @returns {any}
 */
function snapshotFrom(regionalGraph, items, worldState) {
  const byId = new Map();
  for (const it of (Array.isArray(items) ? items : [])) {
    const id = it?.id != null ? String(it.id) : (it?.settlement?.id != null ? String(it.settlement.id) : null);
    if (!id) continue;
    const anyIt = /** @type {any} */ (it);
    byId.set(id, { id, settlement: anyIt.settlement || anyIt, name: anyIt.settlement?.name || anyIt.name });
  }
  return {
    byId,
    regionalGraph: regionalGraph || worldState?.regionalGraph || null,
    worldState,
  };
}

// Salience bands (0..1) → DM phrase for the TIE's strategic weight.
const SALIENCE_BANDS = Object.freeze([
  { floor: TRADE_SALIENCE_TUNING.CRITICAL_GATE, phrase: 'a vital, hard-to-replace tie' },
  { floor: TRADE_SALIENCE_TUNING.VALUABLE_GATE, phrase: 'a valuable trade tie' },
  { floor: 0, phrase: 'a routine trade tie' },
]);

/** The DM phrase for a 0..1 salience. @param {number} v @returns {string} */
export function saliencePhrase(v) {
  const s = Math.max(0, Math.min(1, Number(v) || 0));
  const band = SALIENCE_BANDS.find(b => s >= b.floor) || SALIENCE_BANDS[SALIENCE_BANDS.length - 1];
  return band.phrase;
}

/**
 * The strategic-trade reading between TWO settlements: how valuable the tie is (in
 * words), whether either side is CRITICALLY dependent on the other, and — when
 * critical — the dependency/coercion direction (who depends, who holds leverage).
 * Null when there is no meaningful tie. Pure.
 *
 * @param {Object} args
 * @param {any} args.aId @param {any} args.bId
 * @param {any} args.regionalGraph
 * @param {Array<{ id?: any, settlement?: any }>} args.settlements
 * @param {any} [args.worldState]
 * @param {number} [args.tick]
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {{ phrase: string, restrains: boolean, critical: boolean, dependentId: any, supplierId: any, dependentName: string|null, supplierName: string|null } | null}
 */
export function pairTradePressure({ aId, bId, regionalGraph, settlements, worldState = {}, tick, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  if (aId == null || bId == null) return null;
  const snapshot = snapshotFrom(regionalGraph, settlements, worldState);
  const pair = pairTradeSalience(snapshot, worldState, aId, bId, { tick });
  if (!pair || pair.salience < TRADE_SALIENCE_TUNING.VALUABLE_GATE) return null;
  return {
    phrase: saliencePhrase(pair.salience),
    // A valuable tie RESTRAINS hostility (trade-as-peace): war between them is
    // costlier. Always true at/above the valuable gate (we filtered below it).
    restrains: true,
    critical: pair.critical === true,
    // Raw ids so callers resolve the dependent/supplier ROLE by identity, not by
    // comparing rendered display names (two settlements can render the same name).
    dependentId: pair.critical ? (pair.dependentId ?? null) : null,
    supplierId: pair.critical ? (pair.supplierId ?? null) : null,
    dependentName: pair.critical && pair.dependentId != null ? nameFor(pair.dependentId) : null,
    supplierName: pair.critical && pair.supplierId != null ? nameFor(pair.supplierId) : null,
  };
}

/**
 * The strategic-trade ties involving ONE settlement — the valuable / critical ties
 * it sits in, in heuristic language, for its dossier. Each entry names the partner,
 * the tie's weight, and — for a critical dependency — whether THIS settlement is the
 * dependent (vulnerable) or the supplier (holds leverage / coercion).
 *
 * PLAYER-SAFE: covert smuggling ties (battlefield-enemy trade) are surfaced ONLY
 * for the GM (`includeCovert: true`). The default omits them.
 *
 * @param {Object} args
 * @param {any} args.settlementId
 * @param {any} args.regionalGraph
 * @param {Array<{ id?: any, settlement?: any }>} args.settlements
 * @param {any} [args.worldState]
 * @param {number} [args.tick]
 * @param {boolean} [args.includeCovert]  GM view ⇒ true; player view ⇒ false (default).
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {Array<{ partnerName: string, phrase: string, role: 'dependent'|'supplier'|'partner', covert: boolean }>}
 */
export function settlementTradePressure({ settlementId, regionalGraph, settlements, worldState = {}, tick, includeCovert = false, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  if (settlementId == null) return [];
  const id = String(settlementId);
  const snapshot = snapshotFrom(regionalGraph, settlements, worldState);
  const overlay = computeSecondaryStatusOverlay(snapshot, worldState, { tick });

  const edges = snapshot?.regionalGraph?.edges || snapshot?.regionalGraph?.channels || [];
  /** @type {Array<{ partnerName: string, phrase: string, role: 'dependent'|'supplier'|'partner', covert: boolean }>} */
  const out = [];
  /** @type {Set<string>} */
  const seen = new Set();

  for (const edge of edges) {
    const key = edge?.id || `rel.${edge?.from}.${edge?.to}`;
    const from = edge?.from ?? edge?.source ?? edge?.a;
    const to = edge?.to ?? edge?.target ?? edge?.b;
    if (from == null || to == null) continue;
    if (String(from) !== id && String(to) !== id) continue;
    const partnerId = String(from) === id ? String(to) : String(from);
    if (seen.has(partnerId)) continue;

    const statuses = overlay[key] || [];
    const overtStatuses = statuses.filter((/** @type {any} */ s) => s?.covert !== true);
    const covertOnly = statuses.length > 0 && overtStatuses.length === 0;

    // PLAYER-SAFE GATE: a covert-only tie (smuggling between battlefield enemies)
    // is hidden from player views entirely. A GM view surfaces it with explicit
    // smuggling phrasing — NEVER the trade-as-peace "valuable tie" framing (that
    // would mislead the DM about a battlefield-enemy black-market channel).
    if (covertOnly) {
      if (!includeCovert) continue; // player view: never see it
      seen.add(partnerId);
      out.push({ partnerName: nameFor(partnerId), phrase: 'a covert smuggling tie', role: 'partner', covert: true });
      continue;
    }

    const pressure = pairTradePressure({ aId: id, bId: partnerId, regionalGraph, settlements, worldState, tick, nameFor });
    if (!pressure) continue; // no overt valuable tie ⇒ nothing to surface
    seen.add(partnerId);

    /** @type {'dependent'|'supplier'|'partner'} */
    let role = 'partner';
    if (pressure.critical) {
      // The salience rollup carries the dependent + supplier ids; map to THIS
      // settlement by id (never by rendered name — two settlements can share one).
      if (String(pressure.dependentId) === id) role = 'dependent';
      else if (String(pressure.supplierId) === id) role = 'supplier';
    }
    out.push({
      partnerName: nameFor(partnerId),
      phrase: pressure.phrase,
      role,
      covert: false,
    });
  }
  return out.sort((a, b) => codepoint(a.partnerName, b.partnerName));
}

/**
 * Whether ANY strategic-trade pressure surfaces for a settlement (the panel gate).
 * Player-safe by default (covert excluded). [] / false off-state.
 * @param {any} args  same as settlementTradePressure.
 * @returns {boolean}
 */
export function hasTradePressure(args = {}) {
  return settlementTradePressure(args).length > 0;
}

export const TRADE_PRESSURE_PHRASES = Object.freeze({ SALIENCE_BANDS });
