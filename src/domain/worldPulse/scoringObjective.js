/**
 * domain/worldPulse/scoringObjective.js — the scoring objective descriptors
 * (Phase 5.5 WAVE A down-payment, VI.3 → M9a completion, VI.1's two-step).
 *
 * The four move-utility formulas the settlement chooser (settlementStrategy.js
 * enumerateMoves) once inlined are DATA here — a single frozen descriptor per
 * governing archetype. Wave A shipped ONLY the DEFAULT descriptor (byte-identical
 * to the pre-Wave-A inlined formulas). M9a (VI.1's second step) adds PER-ARCHETYPE
 * objective SETS + the NEW NON-WAR MOVE LEVERS a merchant / church / warlord polity
 * scores over — the political-depth wave.
 *
 * THE BYTE-IDENTITY CONTRACT (binding): DEFAULT_SCORING_OBJECTIVE is UNCHANGED, and
 * enumerateMoves reconstructs the EXACT same arithmetic from it in the SAME operation
 * order, so a DEFAULT-scored settlement is byte-identical (golden-pinned). The
 * per-archetype override only applies when the M9a marker is live (beliefsActive)
 * AND the settlement's governing seat maps to an overriding archetype; otherwise the
 * scorer reduces EXACTLY to the default (dormant / no-archetype ⇒ zero change).
 *
 * The base-move formulas (verbatim, for the reader — enumerateMoves builds these from
 * the fields below in the SAME operation order, so IEEE-754 bytes match):
 *   defend        = clamp01(base + (besieged ? besiegedBonus : 0)
 *                            + (0.5 − sStrength) × weaknessBonus − aggr × aggrDamp)
 *   hold          = clamp01(base − aggr × aggrDamp + exhaustion × exhaustionBonus)
 *   deploy        = clamp01(base + best × marginGain + aggr × aggrGain
 *                            − exhaustion × exhaustionDamp)
 *   sueForPeace   = clamp01(base + perceived × exhaustionGain − aggr × aggrDamp)
 *
 * The NON-WAR LEVER formulas (M9a — each `levers` bag holds the coefficients; the
 * formula owner is enumerateMoves, mirroring the base-4 pattern):
 *   merchant.reroute      = clamp01(base + exhaustion × exhaustionGain + (besieged ? besiegedBonus : 0))
 *   merchant.embargo      = clamp01(base + hostile × hostileGain − exhaustion × exhaustionDamp)
 *   merchant.credit       = clamp01(base + peace × peaceGain − aggr × aggrDamp)
 *   church.missionize     = clamp01(base + peace × peaceGain − aggr × aggrDamp)
 *   church.legitimacy     = clamp01(base + (besieged ? besiegedBonus : 0) + exhaustion × exhaustionGain)
 *   warlord.prestige      = clamp01(base + aggr × aggrGain + hostile × hostileGain)
 *   warlord.opportunity   = clamp01(base + max(0,best) × marginGain + aggr × aggrGain)
 * where hostile / peace ∈ {0,1} (a hostile target present / none), besieged ∈ {0,1}.
 *
 * PURE data leaf — zero imports, zero first-paint bytes (imported only by the lazy
 * chooser).
 */

/**
 * @typedef {Object} ScoringObjective
 * @property {{ base: number, besiegedBonus: number, weaknessBonus: number, aggrDamp: number }} defend
 * @property {{ base: number, aggrDamp: number, exhaustionBonus: number }} hold
 * @property {{ base: number, marginGain: number, aggrGain: number, exhaustionDamp: number }} deploy
 * @property {{ base: number, exhaustionGain: number, aggrDamp: number }} sueForPeace
 * @property {Record<string, Record<string, number>>} [levers]  the archetype's NON-WAR
 *   move levers (name → coefficient bag). ABSENT on the default ⇒ no extra moves ⇒
 *   byte-identical.
 */

/** The default (governing-seat) objective — the coefficients extracted verbatim
 *  from the pre-Wave-A inlined formulas. NO `levers` (byte-identical). @type {ScoringObjective} */
export const DEFAULT_SCORING_OBJECTIVE = Object.freeze({
  defend: Object.freeze({ base: 0.35, besiegedBonus: 0.4, weaknessBonus: 0.4, aggrDamp: 0.3 }),
  hold: Object.freeze({ base: 0.4, aggrDamp: 0.2, exhaustionBonus: 0.15 }),
  deploy: Object.freeze({ base: 0.3, marginGain: 0.6, aggrGain: 0.5, exhaustionDamp: 0.4 }),
  sueForPeace: Object.freeze({ base: 0.15, exhaustionGain: 0.6, aggrDamp: 0.4 }),
});

// ── M9a: the per-archetype objective SETS (VI.1's second step) ────────────────
// Each set EXTENDS the default's four base moves (with archetype-tuned coefficients
// that shift the war/peace balance) and adds its own NON-WAR levers. A merchant
// polity de-emphasizes deploy and reaches for reroute/embargo/credit; a church for
// missionize/legitimacy; a warlord LEANS INTO deploy and adds prestige/opportunity.
// The levers ENUMERATE + rank here; their apply-side world effects are the M9b seam
// (they emit as inert posture markers this wave — see settlementStrategy.emitMove).

/** The merchant seat: trade-minded, war-averse. @type {ScoringObjective} */
const MERCHANT_OBJECTIVE = Object.freeze({
  defend: Object.freeze({ base: 0.35, besiegedBonus: 0.4, weaknessBonus: 0.4, aggrDamp: 0.3 }),
  hold: Object.freeze({ base: 0.45, aggrDamp: 0.2, exhaustionBonus: 0.2 }),
  // A merchant seat marches reluctantly: a much lower deploy base than the default.
  deploy: Object.freeze({ base: 0.12, marginGain: 0.5, aggrGain: 0.4, exhaustionDamp: 0.5 }),
  sueForPeace: Object.freeze({ base: 0.25, exhaustionGain: 0.6, aggrDamp: 0.4 }),
  levers: Object.freeze({
    reroute: Object.freeze({ base: 0.4, exhaustionGain: 0.4, besiegedBonus: 0.25 }),
    embargo: Object.freeze({ base: 0.28, hostileGain: 0.3, exhaustionDamp: 0.25 }),
    credit: Object.freeze({ base: 0.3, peaceGain: 0.25, aggrDamp: 0.25 }),
  }),
});

/** The church (religious) seat: influence + legitimacy over conquest. @type {ScoringObjective} */
const CHURCH_OBJECTIVE = Object.freeze({
  defend: Object.freeze({ base: 0.35, besiegedBonus: 0.4, weaknessBonus: 0.4, aggrDamp: 0.3 }),
  hold: Object.freeze({ base: 0.42, aggrDamp: 0.2, exhaustionBonus: 0.15 }),
  deploy: Object.freeze({ base: 0.16, marginGain: 0.5, aggrGain: 0.45, exhaustionDamp: 0.45 }),
  sueForPeace: Object.freeze({ base: 0.2, exhaustionGain: 0.6, aggrDamp: 0.4 }),
  levers: Object.freeze({
    missionize: Object.freeze({ base: 0.38, peaceGain: 0.3, aggrDamp: 0.25 }),
    legitimacy: Object.freeze({ base: 0.3, besiegedBonus: 0.3, exhaustionGain: 0.3 }),
  }),
});

/** The warlord (military) seat: glory + opportunistic conquest. @type {ScoringObjective} */
const WARLORD_OBJECTIVE = Object.freeze({
  defend: Object.freeze({ base: 0.35, besiegedBonus: 0.4, weaknessBonus: 0.4, aggrDamp: 0.3 }),
  hold: Object.freeze({ base: 0.35, aggrDamp: 0.25, exhaustionBonus: 0.15 }),
  // A warlord seat leans into the offensive: a higher deploy base + aggression gain.
  deploy: Object.freeze({ base: 0.42, marginGain: 0.6, aggrGain: 0.6, exhaustionDamp: 0.35 }),
  sueForPeace: Object.freeze({ base: 0.12, exhaustionGain: 0.55, aggrDamp: 0.5 }),
  levers: Object.freeze({
    prestige: Object.freeze({ base: 0.34, aggrGain: 0.5, hostileGain: 0.2 }),
    opportunity: Object.freeze({ base: 0.2, marginGain: 0.7, aggrGain: 0.3 }),
  }),
});

/** Governing archetype → its objective set. Archetypes NOT here (government, noble,
 *  civic, craft, labor, arcane, occupation, outsider, other) fall to the DEFAULT —
 *  the byte-identical war-only descriptor. Frozen so a typo'd key reads `undefined`. */
export const SCORING_OBJECTIVES = Object.freeze({
  merchant: MERCHANT_OBJECTIVE,
  religious: CHURCH_OBJECTIVE,
  military: WARLORD_OBJECTIVE,
});

/**
 * The objective descriptor for a governing archetype. Returns the DEFAULT (the
 * byte-identical war-only set) for any archetype without an override — so a
 * no-archetype / unmapped-archetype seat scores EXACTLY as Wave A did.
 * @param {string | null | undefined} archetype
 * @returns {ScoringObjective}
 */
export function objectiveForArchetype(archetype) {
  const key = /** @type {keyof typeof SCORING_OBJECTIVES} */ (String(archetype || ''));
  return SCORING_OBJECTIVES[key] || DEFAULT_SCORING_OBJECTIVE;
}

/** The non-war lever names an objective enumerates (codepoint-sorted; empty for the
 *  default). @param {ScoringObjective} objective @returns {string[]} */
export function leverNamesOf(objective) {
  const levers = objective && objective.levers;
  return levers ? Object.keys(levers).sort() : [];
}
