/**
 * domain/worldPulse/disposition.js — Feature C `computeAggressiveness` (pure).
 *
 * A per-settlement aggression DISPOSITION, recomputed each tick from the pre-tick
 * snapshot (NOT cached — the inputs drift via corruption / promotion / coups).
 * Expressed as a centered-on-1.0 multiplier, matching dispositionLedger's
 * convention so it composes with the ratcheted history through the SAME signed
 * `candidateBase` multiplier (> 1.0 belligerent, < 1.0 pacific, EXACTLY 1.0 when
 * there is no signal at all). Three blended terms:
 *
 *   1. govBaseline   — the existing COUP_COERCION coercion map (rulingPower.js),
 *                      re-centered into a signed aggression baseline keyed on the
 *                      governing faction's archetype.
 *   2. personality   — importance-weighted mean of TRAIT_AGGRESSION over the
 *                      settlement's AUTHORED NPC personality strings (OQ13 — the
 *                      authored `npc.personality`, NEVER the RNG-rolled
 *                      `npcStates.alignment`), each NPC weighted by importance
 *                      (notability) × its governing-faction power, governing
 *                      faction up-weighted.
 *   3. history       — `readDispositionMultiplier` over the ratcheted win/loss
 *                      ledger (worldState.dispositionStats): the "we succeed at
 *                      war / at trade" memory.
 *   4. deityTemper   — ONE additional term derived from
 *                      the embedded primary-deity snapshot's temperamentAxis
 *                      (warlike ⇒ +, peacelike ⇒ −, neutral / absent ⇒ 0). It
 *                      folds into the SAME signed `drive` sum as ONE additive
 *                      term — NEVER a parallel war/peace multiplier elsewhere.
 *                      Absent deity ⇒ 0 ⇒ byte-identical. Only takes effect when
 *                      the disposition layer is itself active (warLayerEnabled —
 *                      the disposition gate at the candidate-build call site); when
 *                      the war layer is off this function isn't on the live path.
 *
 * Determinism: pure — no rng, no wall-clock, no mutation. Iterates NPCs in array
 * order but the aggregation is an order-INDEPENDENT weighted mean (commutative
 * sum), so member order never changes the result. A settlement with no governing
 * faction, no scoring NPC, and an empty ledger reads EXACTLY 1.0 — the
 * byte-identity anchor that keeps a legacy / layer-off campaign unchanged.
 */

import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { governingFactionOf, COUP_COERCION } from '../rulingPower.js';
import { TRAIT_AGGRESSION } from '../../data/npcData.js';
import { readDispositionMultiplier } from './dispositionLedger.js';

const A = FACTION_ARCHETYPES;

// Re-center COUP_COERCION (≈0.85 craft/labor … 1.25 military) onto a SIGNED
// aggression baseline: subtract the neutral pivot (GOVERNMENT/CIVIC = 1.0) so a
// civic/government/religious archetype contributes 0 (no government tilt), a
// garrison leans positive, a craft/merchant guild leans negative. The OCCUPATION
// archetype — a settlement ruled at spearpoint — is the one place we depart from
// COUP_COERCION's 1.0: an occupation authority is overtly belligerent.
const GOV_PIVOT = COUP_COERCION[A.GOVERNMENT]; // 1.0
const OCCUPATION_AGGRESSION = 0.25;

/** Signed government aggression baseline for a governing-faction archetype.
 * @param {string} archetype @returns {number} */
function govBaselineFor(archetype) {
  if (archetype === A.OCCUPATION) return OCCUPATION_AGGRESSION;
  if (archetype === A.CRIMINAL) return 0.1; // not in COUP_COERCION; mildly coercive
  const coercion = /** @type {Record<string, number>} */ (COUP_COERCION)[archetype];
  if (!Number.isFinite(coercion)) return 0; // unknown ⇒ neutral
  return coercion - GOV_PIVOT;
}

// Importance → weight (mirrors npcAgency.notability so the agency layer and the
// disposition read the same authored-importance ladder). Authored importance
// strings dominate; falls back to dots/notability; an unranked NPC still counts
// at a small floor so a town of minor NPCs isn't silently weightless.
/** @param {any} npc @returns {number} */
function importanceWeight(npc = {}) {
  if (npc.importance === 'pillar') return 1;
  if (npc.importance === 'key') return 0.82;
  if (npc.importance === 'notable') return 0.62;
  if (npc.notability === 3 || npc.dots === 3) return 0.9;
  if (npc.notability === 2 || npc.dots === 2) return 0.68;
  if (npc.notability === 1 || npc.dots === 1) return 0.48;
  return 0.38;
}

// AUTHORED personality strings only. Reads the {dominant, flaw, modifier}
// slots the generator writes (npcGenerator.js:81-84); tolerant of a flat string
// or array shape. NEVER reads npcStates.alignment.
/** @param {any} npc @returns {string[]} */
function authoredTraits(npc = {}) {
  const p = npc.personality;
  if (!p) return [];
  if (typeof p === 'string') return [p];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
  return [p.dominant, p.flaw, p.modifier].filter((x) => typeof x === 'string');
}

/** Signed aggression score for one NPC's authored personality (Σ of trait weights).
 * @param {any} npc @returns {number} */
function npcTraitScore(npc) {
  let score = 0;
  for (const trait of authoredTraits(npc)) {
    const w = /** @type {Record<string, number>} */ (TRAIT_AGGRESSION)[String(trait).trim().toLowerCase()];
    if (Number.isFinite(w)) score += w;
  }
  return score;
}

// Normalize a faction power field to 0..1 (mirrors factionCompetition.factionPower:
// >1 is treated as a 0..100 scale). A missing power is a neutral 0.5 so the NPC
// still contributes rather than vanishing.
/** @param {any} faction @returns {number} */
function normFactionPower(faction) {
  const raw = faction?.power ?? faction?.influence ?? faction?.score ?? faction?.weight;
  if (!Number.isFinite(raw)) return 0.5;
  return raw > 1 ? Math.max(0, Math.min(1, raw / 100)) : Math.max(0, Math.min(1, raw));
}

// The governing faction's power is up-weighted so the seat of power colours the
// settlement's disposition more than a back-bench guild.
const GOVERNING_UPWEIGHT = 1.5;

/**
 * The importance × faction-power weighted mean of NPC trait scores. Empty / no
 * scoring NPCs ⇒ 0 (no personality signal). Order-independent (weighted mean is
 * a commutative sum).
 */
/** @param {any} settlement @returns {number} */
function personalityDrive(settlement) {
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  if (!npcs.length) return 0;
  const governing = governingFactionOf(settlement);
  const governingPower = governing ? normFactionPower(governing) : 0.5;

  let weighted = 0;
  let totalWeight = 0;
  for (const npc of npcs) {
    const score = npcTraitScore(npc);
    if (score === 0) continue; // no authored aggression signal — contributes nothing
    // Weight = authored importance × the governing faction's power, up-weighted
    // (the chooser doesn't bind NPCs to factions here; the governing faction is
    // the settlement-level power lens, per the C.1 "governing faction up-weighted").
    const w = importanceWeight(npc) * governingPower * GOVERNING_UPWEIGHT;
    if (w <= 0) continue;
    weighted += score * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weighted / totalWeight : 0;
}

// Blend weights — the signed terms combine into one centered drive, then squash
// into a bounded centered-on-1.0 multiplier. Government + history are modest;
// the authored-personality term carries the most signal (the dossier's "who runs
// this place" answer). W_GOV + W_PERS + W_HIST sum to 1 (the legacy blend);
// W_DEITY is a FOURTH additive term that is 0 when no deity is embedded, so the
// no-deity sum is byte-identical to the legacy blend.
const W_GOV = 0.3;
const W_PERS = 0.45;
const W_HIST = 0.25;
// The warlike-deity term's weight. Modest — a deity
// tilts a settlement's posture, it does not by itself make a peaceful merchant
// town a crusader state (the tanh squash bounds the combined drive regardless).
const W_DEITY = 0.35;

// The embedded deity's temperament as a signed drive: warlike → +1, peacelike →
// −1, neutral / absent → 0. Read off the resolved primaryDeitySnapshot (never
// customContent — the pulse is store-decoupled).
export const DEITY_TEMPER_SIGN = Object.freeze({ warlike: 1, peacelike: -1, neutral: 0 });

/** Signed warlike drive for a settlement's embedded primary-deity snapshot.
 *  0 (no tilt) when there is no deity, a neutral-temperament deity, or an
 *  unrecognized axis — the byte-identity anchor for a deity-free settlement.
 * @param {any} settlement @returns {number} */
function deityTemperDrive(settlement) {
  const axis = settlement?.config?.primaryDeitySnapshot?.temperamentAxis;
  const sign = /** @type {Record<string, number>} */ (DEITY_TEMPER_SIGN)[axis];
  return Number.isFinite(sign) ? sign : 0;
}
// Multiplier span at full saturation (matches dispositionLedger's MULTIPLIER_SPAN
// so disposition and ratcheted history live on the same scale).
const MULTIPLIER_SPAN = 0.5;

/** tanh squash: a signed drive (roughly −1..+1) → a bounded signed value.
 * @param {number} x @returns {number} */
function squash(x) {
  return Math.tanh(x);
}

/**
 * The settlement's aggression disposition as a centered-on-1.0 multiplier.
 *
 * @param {{ id?: string, settlement?: any }} item - a worldSnapshot settlement item.
 * @param {any} worldState - carries the ratcheted `dispositionStats` ledger.
 * @param {{ historyMultiplier?: number }} [opts] - test seam to inject history.
 * @returns {number} EXACTLY 1.0 when there is no signal; >1.0 belligerent; <1.0 pacific.
 */
export function computeAggressiveness(item, worldState, opts = {}) {
  const settlement = item?.settlement || item || {};
  const id = item?.id != null ? String(item.id) : null;

  const gov = govBaselineFor(factionArchetype(governingFactionOf(settlement)));
  const pers = personalityDrive(settlement);

  // History rides the SAME ledger the ratchet writes. readDispositionMultiplier
  // is already centered on 1.0 (EXACTLY 1.0 when absent/net-zero), so convert it
  // to a signed drive for the blend: (mult − 1) / SPAN ∈ roughly [−1, 1].
  const histMult = Number.isFinite(opts.historyMultiplier)
    ? Number(opts.historyMultiplier)
    : (id != null ? readDispositionMultiplier(worldState?.dispositionStats || {}, id) : 1.0);
  const hist = (histMult - 1) / MULTIPLIER_SPAN;

  // ONE additive warlike-deity term into the SAME drive
  // sum — never a parallel multiplier. 0 when no deity ⇒ the legacy blend ⇒
  // byte-identical.
  const deityTemper = deityTemperDrive(settlement);

  const drive = W_GOV * gov + W_PERS * pers + W_HIST * hist + W_DEITY * deityTemper;
  if (drive === 0) return 1.0; // no signal anywhere ⇒ the byte-identity anchor

  return 1.0 + MULTIPLIER_SPAN * squash(drive);
}

/**
 * The LIVE disposition factor map for the candidate-build chokepoint, when the
 * geopolitical layer is ACTIVE: blend each settlement's `computeAggressiveness`
 * (govBaseline + authored NPC personality + ratcheted history) into a per-id
 * centered-on-1.0 multiplier. Only entries that differ from 1.0 are emitted —
 * so a settlement with no signal (no government tilt, no aggressive NPC, empty
 * ledger) is omitted ⇒ candidateBase reads EXACTLY 1.0 for it (`{}`-equivalent).
 *
 * This SUPERSEDES `dispositionFactorMap(dispositionStats)` on the active path
 * (the history term it carried is folded in here via readDispositionMultiplier),
 * so the two must NOT both be applied. Off-path callers keep using
 * `dispositionFactorMap` directly (history-only, byte-identical for an empty
 * ledger). Pure, order-independent (object keys), deterministic.
 *
 * @param {{ settlements?: Array<{id?:string, settlement?:any}> }} snapshot
 * @param {any} worldState - carries `dispositionStats`.
 * @returns {Record<string, number>} { settlementId -> multiplier }, 1.0 entries omitted.
 */
export function computeDispositionFactorMap(snapshot, worldState) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const item of snapshot?.settlements || []) {
    const id = item?.id != null ? String(item.id) : null;
    if (id == null) continue;
    const mult = computeAggressiveness(item, worldState);
    if (mult !== 1.0) out[id] = mult;
  }
  return out;
}

export const AGGRESSION_TUNING = Object.freeze({
  W_GOV, W_PERS, W_HIST, W_DEITY, MULTIPLIER_SPAN, GOVERNING_UPWEIGHT, OCCUPATION_AGGRESSION,
});
