/**
 * domain/worldPulse/eliteBleed.js — DEEP COUPLINGS D-7f THE ELITE BLEED (the final owner clause).
 *
 * Cross-settlement elite RELATIONSHIPS ↔ settlement diplomacy, bidirectional, influence-
 * weighted. This leaf owns the UPWARD shape (the bleed): personal elite relations become
 * interstate relations, weighted by WHO the NPCs are. The DOWNWARD flavor (settlement
 * disposition biasing formation) rides grievanceRead.dispositionOf.
 *
 * THE WEIGHT: `importanceWeight(npc) × factionPowerStanding01 × politicsRank01` — the
 * governing faction's pillar ≫ a marginal faction's notable. BOTH NPCs must be ≥ notable
 * AND weight ≥ ELITE_BLEED_FLOOR or the pair contributes NOTHING (two feuding nobodies are
 * noise BY LAW).
 *
 * ⚠ THE DOUBLE-COUNTING GUARD (law-shaped, PINNED): EVENTS mark the plane they occur on,
 * exactly as today (an embassy detention marks the settlement pair directly AND the NPC pair
 * via its contact mark, ONCE EACH). The BLEED carries ONLY the pair's CURRENT accumulated
 * bond/grudge STANDING and NEVER re-counts events — it is state-driven, not event-driven.
 * eliteBleedContribution therefore reads a single `standing01` scalar (the net accumulated
 * bond−grudge), so the same standing yields the same delta regardless of how many events
 * produced it; a crossing incident mints ONLY on a significance-threshold STATE TRANSITION
 * (a persisting state is not an event). One event, one mark per plane — enforced by shape.
 *
 * PRE-FOLD VACUITY: the formation vectors are the roads contact events (embassies, ransoms,
 * visits, cross-border contest outcomes), so a PRE-FOLD world holds ZERO cross-border marks
 * (no foreignSid on any bond/grudge) and this machinery idles vacuously. The in-pass wiring
 * — reading foreignSid marks from the ladder records, computing weight from live faction/
 * politics state, and invoking inside relationshipEvolution's own pass over post-fold roads
 * contacts — is the POST-FOLD seam; this leaf ships the pure, testable bleed core + the guard.
 *
 * PURE / lazy worldPulse leaf: no store/React import, no clock, no rng.
 * @enforced-by tests/domain/eliteBleed.test.js
 */
import { clamp, clamp01 } from '../../kernel/math.js';
import { mintMemoryWeaveIncident, MEMORY_WEAVE_INCIDENT_TYPES } from './relationshipEvolution.js';

export const ELITE_BLEED_TUNING = Object.freeze({
  // BOTH NPCs must be ≥ notable AND the product weight ≥ this or the pair is noise (law).
  FLOOR: 0.12,
  // The per-settlement-pair per-tick cap on the bleed term (a slow scalar nudge, never a lurch).
  CAP: 0.05,
  // A typed crossing incident (elite_feud/elite_amity) mints only when |accumulated term|
  // crosses this significance threshold (a state transition — never per event).
  CROSSING_THRESHOLD: 0.15,
  // The gain converting net standing × weight into the bounded diplomacy nudge.
  GAIN: 0.2,
});

/** @param {unknown} v @param {number} d @returns {number} */
function num(v, d) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

/**
 * The influence weight of an elite for the bleed: importanceWeight × factionPowerStanding ×
 * politicsRank, each 0..1. Returns 0 when either NPC is below notable (bothNotable false) —
 * a hard gate BEFORE the product, so a nobody never contributes even with a maxed rank.
 * @param {{ importanceWeight01?: number, factionPowerStanding01?: number, politicsRank01?: number, bothNotable?: boolean }} a
 * @returns {number} 0..1
 */
export function eliteBleedWeight({ importanceWeight01 = 0, factionPowerStanding01 = 0, politicsRank01 = 0, bothNotable = true }) {
  if (!bothNotable) return 0;
  return clamp01(clamp01(importanceWeight01) * clamp01(factionPowerStanding01) * clamp01(politicsRank01));
}

/**
 * The SIGNED bleed contribution for one settlement pair from its CURRENT accumulated
 * cross-border elite standing. `standing01` is the net bond−grudge, −1..1 (positive ⇒ amity,
 * negative ⇒ feud). BELOW the weight floor ⇒ EXACTLY 0 (two nobodies are noise — the
 * threshold pin). Bounded by ±CAP (a slow nudge). STATE-DRIVEN: a pure function of standing +
 * weight, never of event count (the double-counting guard). Pure.
 * @param {{ standing01: number, weight01: number }} a
 * @returns {number} the signed, capped settlement-pair nudge (−CAP..CAP)
 */
export function eliteBleedContribution({ standing01, weight01 }) {
  const w = clamp01(num(weight01, 0));
  if (w < ELITE_BLEED_TUNING.FLOOR) return 0; // the notable-floor threshold — noise by law
  const s = clamp(num(standing01, 0), -1, 1);
  return clamp(s * w * ELITE_BLEED_TUNING.GAIN, -ELITE_BLEED_TUNING.CAP, ELITE_BLEED_TUNING.CAP);
}

/** Does the accumulated bleed term cross the significance threshold (a state transition)?
 *  A crossing is |now| ≥ threshold while |prev| < threshold — mints the typed incident ONCE.
 *  @param {number} prevTerm @param {number} nowTerm @returns {boolean} */
export function crossedSignificance(prevTerm, nowTerm) {
  const t = ELITE_BLEED_TUNING.CROSSING_THRESHOLD;
  return Math.abs(num(nowTerm, 0)) >= t && Math.abs(num(prevTerm, 0)) < t;
}

/**
 * Apply the elite bleed to a set of settlement pairs INSIDE the relationship plane's own
 * writer (mintMemoryWeaveIncident — ZERO new writers). Each pair carries its edge key, its
 * CURRENT accumulated cross-border standing, its weight, and its prior accumulated term (for
 * crossing detection). A positive contribution warms the pair (trust up), a negative cools it
 * (resentment up); the elite_amity/elite_feud incident mints ONLY on a significance crossing.
 * The caller has gated on memoryWeaveActive and computed standing/weight from the ladder marks
 * (the post-fold wiring). Empty ⇒ a byte-safe no-op (the pre-fold vacuity path). Pure-ish
 * (threads worldState through the applicator).
 * @param {any} worldState
 * @param {{ pairs?: Array<{ key: string, standing01: number, weight01: number, priorSignificance?: number, aFid?: string, bFid?: string }>, tick: number }} spec
 * @returns {{ worldState: any, applied: number, crossings: number }}
 */
export function applyEliteBleed(worldState, { pairs = [], tick }) {
  let ws = worldState;
  let applied = 0;
  let crossings = 0;
  // Codepoint-stable order (the shared-record determinism law).
  const ordered = [...pairs].filter((p) => p && p.key).sort((x, y) => (x.key < y.key ? -1 : x.key > y.key ? 1 : 0));
  for (const p of ordered) {
    // The per-tick NUDGE is capped (a slow scalar); the CROSSING is judged on the elite
    // relationship's SIGNIFICANCE (standing × weight, uncapped) — a persisting significance
    // never re-mints (the double-counting guard: state transition, not per-event).
    const term = eliteBleedContribution({ standing01: p.standing01, weight01: p.weight01 });
    if (term === 0) continue;
    const significance = clamp(num(p.standing01, 0), -1, 1) * clamp01(num(p.weight01, 0));
    const cur = /** @type {{ trust?: number, resentment?: number }} */ ((worldState?.relationshipStates || {})[p.key] || {});
    // A warming term lifts trust; a cooling term lifts resentment. Bounded by the applicator.
    /** @type {Record<string, number>} */
    const patch = term > 0
      ? { trust: clamp01(num(cur.trust, 0) + term) }
      : { resentment: clamp01(num(cur.resentment, 0) - term) };
    const crossing = crossedSignificance(p.priorSignificance || 0, significance);
    ws = mintMemoryWeaveIncident(ws, {
      relationshipKey: p.key,
      incidentType: term > 0 ? MEMORY_WEAVE_INCIDENT_TYPES.ELITE_AMITY : MEMORY_WEAVE_INCIDENT_TYPES.ELITE_FEUD,
      patch,
      severity: Math.abs(term) / ELITE_BLEED_TUNING.CAP,
      id: crossing ? `elite_bleed.${p.key}.${Math.floor(num(tick, 0))}` : null,
    }, worldState?.updatedAt ?? null);
    applied += 1;
    if (crossing) crossings += 1;
  }
  return { worldState: ws, applied, crossings };
}
