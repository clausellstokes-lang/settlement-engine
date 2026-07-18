/**
 * townMap/ladderRead.js — THE LADDER READ API (ENGINE LIFT #3 → consumed by the
 * dossier Power tab, the NPC card, and the §8 standing-loop power/legitimacy reads
 * when lit).
 *
 * The ladder layer (worldPulse/npcLadderKernel.js) projects its authoritative sidecar
 * ledger (spatialLedgers.npcLadder) onto a compact NON-core `settlement.npcLadder`
 * mirror each advance (the fabric/acquiredTraits idiom — self-healing, re-projected
 * every advance, so no settlement rebuild can ghost it). THIS module is the pure,
 * zero-engine-import reader every consumer uses: it reads the serialized mirror
 * directly, never the engine leaf (the provenance zero-engine→display-coupling law —
 * the fabricRead precedent).
 *
 * ABSENT/DARK ⇒ EMPTY: with the ladder layer dormant (or on any pre-ladder save) the
 * mirror field does not exist, every reader here returns its empty value, and every
 * consumer falls back to its pre-ladder behaviour. The §8 modifier reads return NULL
 * when absent (null ≠ 1.0 — absence is not neutrality; the consumer coalesces null→1.0
 * at the flag-gated consumption site, so a dark world stays byte-identical).
 *
 * Shape (the mirror, written by mirrorOf in the kernel):
 *   settlement.npcLadder = {
 *     factions: { [factionId]: {
 *       rungs: [{ npcId, name, standing }],     // ordered top-rung first, standing 0..1
 *       powerModifier: number,                  // §8a leadership-quality (≈0.85..1.15)
 *       legitimacyModifier: number,             // §8c legitimacy-of-the-how (≈0.85..1.0)
 *       instability: number,                    // §8b churn tax 0..1 (decaying)
 *     } },
 *     goals: { [npcId]: { rung, goal, stakes } },  // display stock for the NPC card
 *   }
 *
 * Pure, deterministic, tolerant of malformed/partial data. No engine imports, no
 * React, no store.
 */
import { slugify } from '../../kernel/slugify.js';


/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {number} */
function num01(v) {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** @param {unknown} v @returns {number|null} */
function finiteOrNull(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/** The mirror blob, or null when absent (dark / pre-ladder save).
 *  @param {{ npcLadder?: unknown }|null|undefined} settlement
 *  @returns {Record<string, unknown>|null} */
function mirror(settlement) {
  const m = settlement && typeof settlement === 'object' ? settlement.npcLadder : null;
  return m && typeof m === 'object' && !Array.isArray(m) ? /** @type {Record<string, unknown>} */ (m) : null;
}

/** The per-faction record blob for a faction id, or null when absent/dark.
 *  @param {{ npcLadder?: unknown }|null|undefined} settlement @param {string} factionId
 *  @returns {Record<string, unknown>|null} */
function factionRec(settlement, factionId) {
  const m = mirror(settlement);
  if (!m) return null;
  const facs = asObject(m.factions);
  const rec = facs[String(factionId)];
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {Record<string, unknown>} */ (rec) : null;
}

/**
 * The per-faction ladder records, or {} when absent/dark. Keyed by factionId; each
 * value carries { rungs, powerModifier, legitimacyModifier, instability }.
 * @param {{ npcLadder?: unknown }|null|undefined} settlement
 * @returns {Record<string, unknown>}
 */
export function ladderFactionsOf(settlement) {
  const m = mirror(settlement);
  if (!m) return {};
  const facs = asObject(m.factions);
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const fid of Object.keys(facs).sort()) {
    const rec = asObject(facs[fid]);
    if (Object.keys(rec).length) out[fid] = rec;
  }
  return out;
}

/**
 * The ordered rungs of a faction ([{ npcId, name, standing }], top rung first,
 * standing 0..1), or [] when absent/dark — the dossier Power tab + NPC card input.
 * @param {{ npcLadder?: unknown }|null|undefined} settlement @param {string} factionId
 * @returns {Array<{ npcId: string, name: string, standing: number }>}
 */
export function ladderRungsOf(settlement, factionId) {
  const rec = factionRec(settlement, factionId);
  if (!rec || !Array.isArray(rec.rungs)) return [];
  /** @type {Array<{ npcId: string, name: string, standing: number }>} */
  const out = [];
  for (const r of rec.rungs) {
    const o = asObject(r);
    const npcId = typeof o.npcId === 'string' ? o.npcId : '';
    if (!npcId) continue;
    out.push({ npcId, name: typeof o.name === 'string' ? o.name : npcId, standing: num01(o.standing) });
  }
  return out;
}

/**
 * The §8a leadership-quality power modifier for a faction (a bounded multiplier the
 * effective-power read consumes), or NULL when absent/dark. NULL ≠ 1.0 — the consumer
 * coalesces null→1.0 at its flag-gated consumption site (byte-identical dark).
 * @param {{ npcLadder?: unknown }|null|undefined} settlement @param {string} factionId
 * @returns {number|null}
 */
export function ladderPowerModifierOf(settlement, factionId) {
  const rec = factionRec(settlement, factionId);
  return rec ? finiteOrNull(rec.powerModifier) : null;
}

/**
 * The §8c legitimacy-of-the-how modifier for a faction (a bounded multiplier the
 * legitimacy read consumes), or NULL when absent/dark. NULL ≠ 1.0 (see above).
 * @param {{ npcLadder?: unknown }|null|undefined} settlement @param {string} factionId
 * @returns {number|null}
 */
export function ladderLegitimacyModifierOf(settlement, factionId) {
  const rec = factionRec(settlement, factionId);
  return rec ? finiteOrNull(rec.legitimacyModifier) : null;
}

/**
 * The §8b transition-instability (churn) tax for a faction (0..1, decaying), or 0
 * when absent/dark — no ladder memory ⇒ no churn.
 * @param {{ npcLadder?: unknown }|null|undefined} settlement @param {string} factionId
 * @returns {number}
 */
export function ladderInstabilityOf(settlement, factionId) {
  const rec = factionRec(settlement, factionId);
  return rec ? num01(rec.instability) : 0;
}

/**
 * The display-stock goal record for an NPC ({ rung, goal, stakes }), or null when
 * absent/dark — the NPC card's "current goal" line.
 * @param {{ npcLadder?: unknown }|null|undefined} settlement @param {string} npcId
 * @returns {{ rung: number, goal: string, stakes: number }|null}
 */
export function ladderGoalOf(settlement, npcId) {
  const m = mirror(settlement);
  if (!m) return null;
  const goals = asObject(m.goals);
  const g = asObject(goals[String(npcId)]);
  if (!Object.keys(g).length) return null;
  return {
    rung: typeof g.rung === 'number' && Number.isFinite(g.rung) ? g.rung : 0,
    goal: typeof g.goal === 'string' ? g.goal : '',
    stakes: typeof g.stakes === 'number' && Number.isFinite(g.stakes) ? g.stakes : 0,
  };
}

/** Does the settlement carry ANY ladder memory (the lit-and-populated check a
 *  consumer branches on before preferring the ladder over its fallback)?
 *  @param {{ npcLadder?: unknown }|null|undefined} settlement @returns {boolean} */
export function hasLadder(settlement) {
  return mirror(settlement) != null;
}

// ── §8 THE STANDING LOOP read-side consumption (dark-safe by mirror-presence) ──
// The share of effective power a maximally-unstable faction sheds (churn erodes power —
// a coup exploits turmoil). JUDGMENT — say "veto".
const INSTAB_POWER_WEIGHT = 0.4;

/** The stable ladder key for a faction entry — MUST match npcLadderState.ladderFactionKey
 *  byte-for-byte (the write side keys the mirror identically; a drift silently misses the
 *  lookup ⇒ no §8 effect when lit, still dark-safe). Cross-checked by ladderRead.test.js.
 *  @param {{ id?: unknown, name?: unknown }|null|undefined} faction @returns {string} */
function factionKeyOf(faction) {
  const f = faction && typeof faction === 'object' ? faction : {};
  const id = /** @type {{ id?: unknown }} */ (f).id;
  if (typeof id === 'string' && id) return id;
  const name = typeof (/** @type {{ name?: unknown }} */ (f).name) === 'string' ? /** @type {{ name: string }} */ (f).name : '';
  const token = slugify(name, { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' });
  return `fac.${token}`;
}

/**
 * The §8 EFFECTIVE-POWER multiplier for a faction — leadership quality (the power modifier)
 * eroded by churn instability. Returns EXACTLY 1.0 when the ladder is dark/absent (no
 * mirror ⇒ null modifier + 0 instability), so a consumer that gates on `factor === 1`
 * stays byte-identical dark. Lit ⇒ a well-led, stable faction reads ABOVE 1 (resists the
 * coup harder); a churning one BELOW.
 * @param {{ npcLadder?: unknown }|null|undefined} settlement
 * @param {{ id?: unknown, name?: unknown }|null|undefined} faction @returns {number}
 */
export function ladderEffectivePowerFactor(settlement, faction) {
  const fkey = factionKeyOf(faction);
  const mod = ladderPowerModifierOf(settlement, fkey);
  const instab = ladderInstabilityOf(settlement, fkey);
  const powerMod = mod == null ? 1 : mod;
  return powerMod * (1 - INSTAB_POWER_WEIGHT * instab);
}
