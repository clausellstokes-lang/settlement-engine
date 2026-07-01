/**
 * domain/display/warStatusVocab.js — ONE canonical war-status vocabulary shared
 * by every banner that answers "is this settlement at war / under siege?".
 *
 * The break this closes (SUBSYSTEM_INTEGRATION_PLAN §S1, the dual-stressor-vocab
 * parity gap): a settlement can arrive at "under siege" two ways, and they used
 * to surface through DIFFERENT vocabularies, so a pulse-born siege lit neither
 * banner while a generation-born siege lit both:
 *
 *   - GENERATION-born: stressGenerator stamps a `settlement.stress[]` entry whose
 *     `type` is a generation key — `under_siege`, `occupied`, `wartime`,
 *     `insurgency` (the STRESS_TYPE_MAP vocabulary).
 *   - PULSE-born: the world pulse (war layer) never writes a
 *     `stress[]` entry. It stamps `settlement.activeConditions[]` — the besieged
 *     VICTIM carries `war_pressure`; the AGGRESSOR carries `war_drain` +
 *     `army_deployed` (archetypeCatalog WAR_* groups). It also tracks the army in
 *     `worldState.deployments`, but that lives upstream of the settlement object;
 *     the conditions are the settlement-level footprint both banners can read.
 *
 * This module is the single source of truth that folds BOTH into one canonical
 * status. The alias is built by INVERTING `stressorPicker.GEN_TO_PULSE_TYPE`
 * (the existing one-way generation→pulse map) so the two vocabularies can never
 * drift: PULSE_TO_GEN is mechanically derived, not re-typed.
 *
 * `resolveMilitaryStress` returns a generation-vocab stress entry — either the
 * real one (when generation already stamped it) or one SYNTHESIZED from the
 * pulse conditions. Because a real generation stress is returned UNCHANGED, a
 * generation-born siege renders byte-identically (no fixture churn); the
 * synthesized entry only appears when a war condition is present and no
 * generation stress already covers it.
 *
 * Pure display: no store, no React, no worldState write, codepoint-stable.
 */

import { GEN_TO_PULSE_TYPE } from '../stressorPicker.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

/**
 * The inverse of GEN_TO_PULSE_TYPE: a roaming/pulse type → the generation stress
 * key it corresponds to. Built mechanically so it cannot drift from the forward
 * map. A pulse type with no generation counterpart simply has no entry.
 * @type {Readonly<Record<string, string>>}
 */
export const PULSE_TO_GEN = Object.freeze(
  Object.fromEntries(
    Object.entries(GEN_TO_PULSE_TYPE).map(([gen, pulse]) => [pulse, gen]),
  ),
);

/**
 * A war-layer condition archetype → the GENERATION stress vocabulary it should
 * surface as. This is the pulse→generation bridge for the war layer's
 * settlement-level conditions (which are NOT in GEN_TO_PULSE_TYPE — that map
 * covers authored stressors, not derived conditions). Each maps to the
 * generation key whose existing banner presentation best fits the lived state:
 *
 *   - war_pressure   → under_siege  (the VICTIM is besieged / actively under war)
 *   - war_drain      → wartime      (the AGGRESSOR is waging a campaign abroad)
 *   - army_deployed  → wartime      (its army is committed to that campaign)
 *
 * `under_siege` and `wartime` both already exist in STRESS_TYPE_MAP and in both
 * banners' presentation, so a synthesized entry reuses the SAME styling/label a
 * generation-born one would — parity by construction. Recovery archetypes
 * (siege_lifted / occupation_lifted) are intentionally absent: a lifted siege is
 * no longer an active military status and must not light the banner.
 * @type {Readonly<Record<string, string>>}
 */
export const WAR_CONDITION_TO_GEN = Object.freeze({
  war_pressure: 'under_siege',
  war_drain: 'wartime',
  army_deployed: 'wartime',
});

/**
 * Priority order when several war conditions are present at once: a besieged
 * settlement reads as "under siege" before "wartime". Deterministic, codepoint-
 * independent (an explicit list, not Object key order).
 * @type {readonly string[]}
 */
const GEN_PRIORITY = Object.freeze(['under_siege', 'occupied', 'wartime', 'insurgency']);

/**
 * @param {import('../settlement.schema.js').SimSettlement} s
 * @returns {any[]} the settlement's stress entries as an array (tolerates the
 *   array / single-object / null shapes stressGenerator produces).
 */
function stressArray(s) {
  if (Array.isArray(s?.stress)) return s.stress;
  if (s?.stress) return [s.stress];
  return [];
}

/**
 * Synthesize a generation-vocab stress entry from a war-layer condition so the
 * banner predicates (which match on generation `type`) fire identically to a
 * generation-born stress. The entry carries the canonical generation `type`
 * plus the condition's own severity/summary so the banner copy stays specific.
 * `_synthetic` marks it as pulse-derived for callers that care; the banners do
 * not branch on it (they read type/summary/label like any stress entry).
 * @param {string} genType  the generation stress key (e.g. 'under_siege')
 * @param {any} cond        the canonical active condition it was derived from
 * @returns {any}
 */
function synthStress(genType, cond) {
  const tmpl = /** @type {Record<string, any>} */ (STRESS_TYPE_MAP)[genType] || {};
  return {
    type: genType,
    name: tmpl.label || genType,
    label: tmpl.label || genType,
    icon: tmpl.icon || '',
    colour: tmpl.colour || null,
    severity: cond?.severity,
    severityBand: cond?.severityBand,
    // The condition's own description is the most specific available prose; fall
    // back to the generation viabilityNote so the banner is never empty.
    summary: cond?.description || tmpl.viabilityNote || null,
    viabilityNote: tmpl.viabilityNote || null,
    // Provenance — pulse-derived, from this condition archetype.
    _synthetic: true,
    _fromCondition: cond?.archetype || null,
  };
}

/**
 * Resolve the settlement's ACTIVE military status as a single generation-vocab
 * stress entry, folding generation stress AND pulse war conditions through the
 * one shared alias. Returns null when neither vocabulary reports a war status.
 *
 * Resolution order (generation wins, so its rendering is byte-identical):
 *   1. If a generation `stress[]` entry already matches a war/banner type, return
 *      it UNCHANGED — generation-born sieges render exactly as before.
 *   2. Otherwise, if a war-layer condition is present, synthesize the matching
 *      generation entry so a PULSE-born siege lights the SAME banner.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {{ types?: readonly string[] }} [opts]
 *   `types` restricts which generation keys count as a hit (defaults to the war
 *   banner set). Each banner passes the set its inline predicate used so the
 *   alias is a faithful superset of that banner's prior scope.
 * @returns {any | null}
 */
export function resolveMilitaryStress(settlement, opts = {}) {
  const types = opts.types && opts.types.length ? opts.types : GEN_PRIORITY;
  const typeSet = new Set(types);

  // ── 1. Generation stress wins (byte-identical legacy rendering). ──
  const existing = stressArray(settlement);
  const genHit = existing.find((x) => x && typeSet.has(x.type));
  if (genHit) return genHit;

  // ── 2. Synthesize from a pulse war condition, honoring the same priority. ──
  const conditions = deriveAllActiveConditions(settlement);
  if (!conditions.length) return null;

  // Index the war conditions by the generation type they bridge to, so priority
  // selection is over a stable, explicit list rather than condition array order.
  const byGen = new Map();
  for (const cond of conditions) {
    const genType = /** @type {Record<string, string>} */ (WAR_CONDITION_TO_GEN)[cond.archetype];
    if (!genType || !typeSet.has(genType)) continue;
    if (!byGen.has(genType)) byGen.set(genType, cond);
  }
  if (!byGen.size) return null;

  for (const genType of GEN_PRIORITY) {
    if (byGen.has(genType)) return synthStress(genType, byGen.get(genType));
  }
  // Any war type outside the priority list (none today) — first by alias order.
  const [firstGen, firstCond] = [...byGen.entries()][0];
  return synthStress(firstGen, firstCond);
}

/**
 * Boolean convenience: is the settlement at war / under siege by EITHER
 * vocabulary? Thin wrapper over resolveMilitaryStress.
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {{ types?: readonly string[] }} [opts]
 * @returns {boolean}
 */
export function isAtWar(settlement, opts = {}) {
  return resolveMilitaryStress(settlement, opts) != null;
}
