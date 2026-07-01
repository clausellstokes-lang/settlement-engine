/**
 * domain/corruption.js — pure substrate for the NPC/faction corruption system.
 *
 * Corruption is gated, hazard-driven, and DAMPED so it reaches an equilibrium a
 * DM can push either way rather than a death spiral:
 *   • An NPC is only ELIGIBLE if they carry a corruptible personality flaw AND
 *     the settlement has at least one criminal institution present.
 *   • Onset is a per-tick HAZARD (compounds over time), scaled UP by crime
 *     pressure and DOWN by internal security + prosperity.
 *   • Organic EXPOSURE is the counter-force: it rises with security + prosperity
 *     (a healthy settlement self-cleans) and falls with thieves-guild strength
 *     (a captured one shields its own). This is what keeps the loop bounded.
 *
 * All functions are pure (no rng, no store, no Date) — the rng draw happens at
 * the call site (generation pipeline rng / world-pulse rng.fork) so replays stay
 * deterministic. Inputs are normalized 0..1 (crime, security, prosperity,
 * guildStrength, visibility); the adapters that read a settlement's
 * safetyProfile / economicState / causal scores live with their callers.
 */

import { institutionHasTag, TAG } from '../lib/entities.js';
import { TRAIT_ALIGNMENT } from '../data/npcData.js';

// ── Eligibility: corruptible flaws → corruption vector ──────────────────────
// Maps the susceptible NPC personality flaws (from npcData.js negative+neutral)
// to the engine's corruption vectors {greed, hunger_for_status, fear,
// forbidden_patron, fanaticism}. A flaw NOT in this map is not corruptible.
const FLAW_VECTOR = Object.freeze({
  greedy: 'greed',
  corrupt: 'greed',
  'self-serving': 'greed',
  ruthless: 'greed',
  callous: 'greed',
  'cold-blooded': 'greed',
  ambitious: 'hunger_for_status',
  calculating: 'hunger_for_status',
  opportunistic: 'hunger_for_status',
  vain: 'hunger_for_status',
  cowardly: 'fear',
  suspicious: 'fear',
  paranoid: 'fear',
  deceitful: 'forbidden_patron',
  manipulative: 'forbidden_patron',
  mendacious: 'forbidden_patron',
  cynical: 'forbidden_patron',
});

export const CORRUPTIBLE_FLAWS = Object.freeze(Object.keys(FLAW_VECTOR));

/** @param {any} flaw */
export function isCorruptibleFlaw(flaw) {
  if (!flaw) return false;
  return Object.prototype.hasOwnProperty.call(FLAW_VECTOR, String(flaw).toLowerCase());
}

/** Corruption vector for a flaw; defaults to 'greed' for an unmapped value.
 *  @param {any} flaw */
export function corruptionVectorForFlaw(flaw) {
  return /** @type {Record<string, string>} */ (FLAW_VECTOR)[String(flaw || '').toLowerCase()] || 'greed';
}

/** The NPC's corruptible flaw (lowercased) if any, else null. Reads ONLY the
 *  real flaw slots: npc.personality.flaw, npc.flaw. It deliberately does NOT fall
 *  back to npc.personality.dominant — that slot is the steady TEMPERAMENT, not a
 *  flaw. Since trait generation now makes flaw genuinely optional, a temperament
 *  must never masquerade as a corruptible flaw, or a temperament-only NPC would be
 *  (mis)read as corruptible and turned by the sim, breaking the no-flaw rule.
 *  @param {import('./settlement.schema.js').SimNpc} npc @returns {string|null} */
export function npcCorruptibleFlaw(npc) {
  const candidates = [npc?.personality?.flaw, npc?.flaw];
  for (const c of candidates) {
    if (isCorruptibleFlaw(c)) return String(c).toLowerCase();
  }
  return null;
}

/** True when the NPC carries a steady TEMPERAMENT (the personality.dominant
 *  slot). A temperament makes the NPC harder for the world-pulse sim to turn (it
 *  does NOT, on its own, make them corruptible — that requires a flaw).
 *  @param {import('./settlement.schema.js').SimNpc} npc @returns {boolean} */
export function npcHasTemperament(npc) {
  return Boolean(npc?.personality?.dominant);
}

/** Pure per-NPC susceptibility of the BACKGROUND world-pulse turning loop,
 *  expressed as the steadiness multiplier the onset hazard is scaled by:
 *    • NO corruptible flaw           ⇒ 0   (the sim can NEVER turn them)
 *    • flaw, no temperament          ⇒ 1   (full baseline onset chance)
 *    • flaw + steady temperament     ⇒ CORRUPTION_TUNING.temperamentSteadiness
 *                                       (a real, strictly-lower-but-positive chance)
 *  This governs ONLY the background sim. The manual "Impose corruption" DM
 *  override (mutate.js imposeCorruption) does NOT consult this — it turns any NPC.
 *  @param {import('./settlement.schema.js').SimNpc} npc @returns {number} a factor in [0, 1] */
export function corruptibility(npc) {
  if (!npcCorruptibleFlaw(npc)) return 0;
  return npcHasTemperament(npc) ? CORRUPTION_TUNING.temperamentSteadiness : 1;
}

// ── Damped probability model (tunable in one place) ─────────────────────────
export const CORRUPTION_TUNING = Object.freeze({
  // Generation-time roll for an eligible NPC when a criminal institution exists.
  spawn: { base: 0.10, crime: 0.35, security: 0.20, prosperity: 0.15, min: 0.02, max: 0.60 },
  // Per-(month-equivalent)-tick onset hazard for a clean eligible NPC.
  // `exposurePenalty`: each PRIOR exposure (organic or DM) makes re-corruption
  // progressively harder (a burned official is warier + more watched).
  onset: { base: 0.04, crime: 0.12, security: 0.08, prosperity: 0.06, exposurePenalty: 0.6, min: 0.005, max: 0.25 },
  // Per-tick organic exposure of a corrupt NPC — the self-cleaning counter-force.
  // `repeatBoost`: each prior exposure makes re-exposure EASIER (a known repeat
  // offender draws more scrutiny once they relapse).
  exposure: { base: 0.05, security: 0.20, prosperity: 0.12, guild: 0.22, visibility: 0.06, repeatBoost: 0.35, min: 0.01, max: 0.50 },
  // Once a corrupt NPC has eroded to 'notable', each further exposure rolls this
  // (very low) chance to be outed entirely + replaced by a fresh NPC.
  outReplaceAtNotable: 0.08,
  // Steadiness multiplier on the ONSET hazard when an NPC has a temperament
  // (personality.dominant). A steady disposition resists organized crime's pull:
  // 0.5 ⇒ a flaw+temperament NPC turns at HALF the rate of a flaw-only NPC. It is
  // a post-sum threshold shift (never an rng draw), so the deterministic stream is
  // unperturbed — exactly like the deity-disfavor multiplier. ∈ (0, 1]; 1 disables.
  temperamentSteadiness: 0.5,
});

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
/** @param {any} x @returns {number} */
const n01 = (x) => (Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0);

// ── Good/evil deity → corruption pressure ───────────────────────────────────
// A bounded, centered-on-1.0 multiplier into the corruption knobs. ONE
// multiplier (onset OR exposure per NPC, never both stacked) keeps the deity
// pressure inside corruption's deliberate equilibrium damping — no death
// spiral. The span is DELIBERATELY small (±0.40 max swing) so the deity tilts
// the loop's balance, it never overwhelms the security/prosperity counter-force.
export const DEITY_CORRUPTION_TUNING = Object.freeze({
  // Max swing of the centered-on-1.0 multiplier at full per-NPC disfavor.
  // 0.40 ⇒ multiplier ∈ [0.60, 1.40] — bounded, well inside the equilibrium.
  span: 0.40,
  // The deity's own alignment-axis magnitude as a signed direction.
  axisSign: Object.freeze({ evil: -1, good: 1, neutral: 0 }),
});

/** Lowercased authored personality descriptor strings for an NPC: reads the
 *  {dominant, flaw, modifier} slots the generator writes, tolerant of a flat
 *  string / array shape. NEVER reads npcStates.alignment (RNG-rolled).
 * @param {import('./settlement.schema.js').SimNpc} npc @returns {string[]} */
function authoredAlignmentTraits(npc = {}) {
  const p = npc?.personality;
  if (!p) return [];
  if (typeof p === 'string') return [p];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
  return [p.dominant, p.flaw, p.modifier].filter((x) => typeof x === 'string');
}

/** Signed good↔evil conscience score for an NPC's AUTHORED personality (Σ of
 *  TRAIT_ALIGNMENT weights, clamped to [-1, 1]). + is good-leaning, − is
 *  evil-leaning. Absent personality ⇒ 0 (neutral, no signal).
 * @param {import('./settlement.schema.js').SimNpc} npc @returns {number} */
export function npcAlignmentScore(npc) {
  let score = 0;
  for (const trait of authoredAlignmentTraits(npc)) {
    const w = /** @type {Record<string, number>} */ (TRAIT_ALIGNMENT)[String(trait).trim().toLowerCase()];
    if (Number.isFinite(w)) score += w;
  }
  return clamp(score, -1, 1);
}

/** The signed alignment direction of an embedded deity snapshot: evil → −1,
 *  good → +1, neutral / absent → 0.
 * @param {any} deity @returns {-1|0|1} */
export function deityAlignmentDirection(deity) {
  if (!deity) return 0;
  const sign = /** @type {Record<string, number>} */ (DEITY_CORRUPTION_TUNING.axisSign)[deity.alignmentAxis];
  return /** @type {-1|0|1} */ (Number.isFinite(sign) ? sign : 0);
}

// ── Lawful/chaotic deity → corruption-TOLERANCE ─────────────────────────────
// The 4th deity axis is a DISTINCT lever from the good/evil knobs above. Good/
// evil drives the ONSET/EXPOSURE *rate* (npcDeityDisfavor); the law axis instead
// shifts how much corruption a settlement TOLERATES — a chaotic god means the
// streets shrug at graft (corruption sits easier, order checks slacken), a lawful
// god means oaths are kept and order is enforced. We model that tolerance shift
// as a small, bounded, signed term primarily consumed by law_order (causalState
// deriveLawOrder), NOT re-applied to onset/exposure — so it can NEVER double-count
// the good/evil corruption magnitude. The magnitudes are deliberately small.
export const DEITY_LAW_TUNING = Object.freeze({
  // The law-axis magnitude as a signed direction: lawful +1 (raises order /
  // lowers tolerance), chaotic −1 (lowers order / raises tolerance), else 0.
  axisSign: Object.freeze({ lawful: 1, chaotic: -1, neutral: 0 }),
  // The law_order score swing a fully lawful/chaotic patron applies. A
  // lawful god ADDS this; a chaotic god SUBTRACTS it. Comparable in scale to the
  // government-archetype term in deriveLawOrder (±8), so a patron meaningfully
  // tilts order without overwhelming the institutional signals.
  lawOrderSwing: 8,
  // The signed corruption-TOLERANCE shift (0..1 scale): a chaotic god raises
  // tolerance (corruption sits easier), a lawful god lowers it. Distinct lever —
  // surfaced for callers that want the tolerance signal itself (e.g. the order
  // check), never folded into onset/exposure. Chaotic → +, lawful → −.
  tolerance: 0.15,
});

/** The signed law direction of an embedded deity snapshot: lawful → +1,
 *  chaotic → −1, neutral / absent / legacy-3-axis → 0. A deity authored before
 *  the law axis existed carries no lawAxis ⇒ 0 ⇒ no law_order term (back-compat, byte-identical).
 * @param {any} deity @returns {-1|0|1} */
export function deityLawDirection(deity) {
  if (!deity) return 0;
  const sign = /** @type {Record<string, number>} */ (DEITY_LAW_TUNING.axisSign)[deity.lawAxis];
  return /** @type {-1|0|1} */ (Number.isFinite(sign) ? sign : 0);
}

/** The signed corruption-TOLERANCE shift an embedded deity snapshot imposes: a
 *  chaotic god RAISES tolerance (+), a lawful god LOWERS it (−), neutral/absent 0.
 *  DISTINCT from the good/evil onset/exposure magnitude — this is the order-check
 *  slackening lever, not the corruption *rate*. @param {any} deity @returns {number} */
export function deityCorruptionTolerance(deity) {
  // dir<0 (chaotic) ⇒ +tolerance; dir>0 (lawful) ⇒ −tolerance; dir 0 ⇒ exactly 0
  // (the `|| 0` collapses the −0 that `-0 * x` would otherwise yield).
  const dir = deityLawDirection(deity);
  return (-dir * DEITY_LAW_TUNING.tolerance) || 0;
}

/** True iff the settlement carries an embedded EVIL-aligned primary deity. This
 *  is the per-settlement form of the activation gate: the caller still gates
 *  on religionDynamicsEnabled + isSubsystemActive, but the per-settlement deity
 *  presence is what relaxes the onset gate for THAT settlement.
 * @param {import('./settlement.schema.js').SimSettlement} settlement @returns {boolean} */
export function hasCorruptingDeity(settlement) {
  return deityAlignmentDirection(settlement?.config?.primaryDeitySnapshot) < 0;
}

/** True iff the settlement carries an embedded GOOD-aligned primary deity.
 * @param {import('./settlement.schema.js').SimSettlement} settlement @returns {boolean} */
export function hasRepressingDeity(settlement) {
  return deityAlignmentDirection(settlement?.config?.primaryDeitySnapshot) > 0;
}

/**
 * The per-NPC deity-disfavor multipliers (each centered on 1.0) for the
 * corruption knobs, given a deity snapshot and an NPC. The KEY invariant: AT
 * MOST ONE of `{onset, exposure}` differs from 1.0 for any NPC — the deity
 * pressure is a SINGLE bounded multiplier, never stacked across knobs (stacking
 * onset+exposure+demotion blows past corruption's equilibrium damping →
 * death-spiral). Routing:
 *
 *   • EVIL deity (dir −1) → drives the ONSET side ("corrupts the faithful from
 *     within"). An evil-aligned NPC (score < 0) ⇒ onset > 1 (corrupts faster);
 *     a good-aligned NPC (score > 0) ⇒ onset < 1 (resists). exposure = 1.0.
 *   • GOOD deity (dir +1) → drives the EXPOSURE side, which runs REGARDLESS of a
 *     criminal institution ("the temple installs an incorruptible successor").
 *     An evil-aligned corrupt NPC (score < 0) ⇒ exposure > 1 (outed faster); a
 *     good-aligned NPC ⇒ exposure < 1. onset = 1.0 (a good deity NEVER raises
 *     onset).
 *   • NEUTRAL / absent deity ⇒ both EXACTLY 1.0 (byte-identical).
 *
 * Each multiplier lies in [1 − span, 1 + span] (bounded), so it can never
 * death-spiral the substrate.
 *
 * @param {any} deity - an embedded primaryDeitySnapshot (or null)
 * @param {import('./settlement.schema.js').SimNpc} npc - the NPC record (reads AUTHORED personality only)
 * @returns {{ onset: number, exposure: number }} centered-on-1.0 multipliers
 */
export function npcDeityDisfavor(deity, npc) {
  const dir = deityAlignmentDirection(deity);
  if (dir === 0) return { onset: 1.0, exposure: 1.0 };
  const score = npcAlignmentScore(npc); // −1 (evil-leaning) .. +1 (good-leaning)

  if (dir < 0) {
    // EVIL deity → ONSET side. It RECRUITS its own kind: amplify onset for an
    // evil-aligned NPC (score < 0 ⇒ −score > 0 ⇒ mult > 1), suppress for a
    // good-aligned one (score > 0 ⇒ mult < 1, they resist). exposure untouched.
    const onset = 1 + DEITY_CORRUPTION_TUNING.span * clamp(-score, -1, 1);
    return { onset, exposure: 1.0 };
  }
  // GOOD deity → EXPOSURE side (runs regardless of a criminal institution). It
  // PURGES its enemies: amplify exposure of an evil-aligned corrupt NPC
  // (score < 0 ⇒ −score > 0 ⇒ mult > 1, outed faster), protect a good-aligned
  // one (score > 0 ⇒ mult < 1). onset stays EXACTLY 1.0 (a good deity NEVER
  // raises onset). One knob moves — never both.
  const exposure = 1 + DEITY_CORRUPTION_TUNING.span * clamp(-score, -1, 1);
  return { onset: 1.0, exposure };
}

/** Re-clamp an externally-supplied disfavor multiplier into the bounded span so
 *  a caller can never push the corruption knob past the equilibrium damping.
 * @param {number} mult @returns {number} */
function deityDisfavorMult(mult) {
  if (!Number.isFinite(mult)) return 1.0;
  const lo = 1 - DEITY_CORRUPTION_TUNING.span;
  const hi = 1 + DEITY_CORRUPTION_TUNING.span;
  return clamp(mult, lo, hi);
}

/**
 * Generation-time corruption probability for an ELIGIBLE NPC with a criminal
 * institution present. Caller must check eligibility + criminal presence first.
 * @param {{crime?:number, security?:number, prosperity?:number}} climate
 */
export function spawnCorruptionChance({ crime = 0, security = 0.5, prosperity = 0.5 } = {}) {
  const t = CORRUPTION_TUNING.spawn;
  const p = t.base + n01(crime) * t.crime - n01(security) * t.security - n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

/**
 * Per-tick onset hazard for a clean eligible NPC (criminal institution present).
 * Independent per-NPC rolls make the settlement's corrupt FRACTION saturate
 * naturally (corrupt NPCs stop rolling), so no explicit logistic is needed here.
 *
 * `deityDisfavor` is a bounded, centered-on-1.0 multiplier
 * applied AFTER the existing sum and BEFORE the final clamp — an evil deity's
 * patronage (>1) raises the hazard for its aligned faithful; a good deity (<1)
 * represses onset. Defaults to 1.0 ⇒ deity-free / dormant is byte-identical (the
 * sum and clamp are unchanged). NEVER mutates the frozen TUNING.
 *
 * `steadiness` is a bounded (0, 1] multiplier applied AFTER the sum and BEFORE
 * the final clamp — alongside deityDisfavor — modelling a steady TEMPERAMENT
 * resisting the pull: a flaw+temperament NPC turns at `steadiness`× a flaw-only
 * NPC's rate. Defaults to 1.0 ⇒ no temperament / dormant is byte-identical.
 *
 * @param {{crime?:number, security?:number, prosperity?:number, priorExposures?:number, deityDisfavor?:number, steadiness?:number}} [args]
 * @returns {number}
 */
export function onsetHazard({ crime = 0, security = 0.5, prosperity = 0.5, priorExposures = 0, deityDisfavor = 1, steadiness = 1 } = {}) {
  const t = CORRUPTION_TUNING.onset;
  let p = t.base + n01(crime) * t.crime - n01(security) * t.security - n01(prosperity) * t.prosperity;
  // A burned official is warier + more watched: each prior exposure makes
  // re-corruption progressively harder (diminishing, never zero).
  p /= 1 + t.exposurePenalty * Math.max(0, priorExposures);
  p *= deityDisfavorMult(deityDisfavor);
  // A steady temperament resists the pull (post-sum threshold shift, not a draw).
  p *= clamp(steadiness, 0, 1);
  return clamp(p, t.min, t.max);
}

/**
 * Per-tick organic exposure probability for a corrupt NPC. Rises with security +
 * prosperity and the NPC's visibility (standing); falls with guild strength.
 *
 * `deityDisfavor` is the SAME bounded centered-on-1.0
 * multiplier as `onsetHazard`, applied AFTER the existing product and BEFORE the
 * clamp. This is the side that runs REGARDLESS of a criminal institution, so a
 * GOOD deity's repression rides HERE: a good deity passes a disfavor > 1 for an
 * evil-aligned corrupt NPC ⇒ faster exposure / demotion ("the temple installed
 * an incorruptible successor"). Defaults to 1.0 ⇒ byte-identical when dormant.
 *
 * @param {{security?:number, prosperity?:number, guildStrength?:number, visibility?:number, priorExposures?:number, deityDisfavor?:number}} [args]
 * @returns {number}
 */
export function exposureChance({ security = 0.5, prosperity = 0.5, guildStrength = 0, visibility = 0.5, priorExposures = 0, deityDisfavor = 1 } = {}) {
  const t = CORRUPTION_TUNING.exposure;
  let p = t.base
    + n01(security) * t.security
    + n01(prosperity) * t.prosperity
    - n01(guildStrength) * t.guild
    + n01(visibility) * t.visibility;
  // A repeat offender draws more scrutiny: each prior exposure makes re-exposure easier.
  p *= 1 + t.repeatBoost * Math.max(0, priorExposures);
  p *= deityDisfavorMult(deityDisfavor);
  return clamp(p, t.min, t.max);
}

// ── Standing ladder (for exposure-driven demotion) ──────────────────────────
// Importance tiers (entities/npcs.js): pillar > key > notable > minor.
export const IMPORTANCE_LADDER = Object.freeze(['pillar', 'key', 'notable', 'minor']);

/** Demote one importance step (floor = minor). Unknown → 'notable'.
 *  @param {any} importance */
export function demoteImportance(importance) {
  const i = IMPORTANCE_LADDER.indexOf(importance);
  if (i < 0) return 'notable';
  return IMPORTANCE_LADDER[Math.min(IMPORTANCE_LADDER.length - 1, i + 1)];
}

/** Demote one dotRank step (3=leader → 2=lieutenant → 1=agent; floor = 1).
 *  @param {any} dotRank */
export function demoteDotRank(dotRank) {
  return Math.max(1, (Number(dotRank) || 1) - 1);
}

/** A corrupt NPC eroded to 'notable' (or lower) is eligible to be outed+replaced.
 *  @param {any} importance */
export function canBeOuted(importance) {
  return importance === 'notable' || importance === 'minor';
}

// ── Faction capture ladder ──────────────────────────────────────────────────
// Reuses the engine's existing criminalCaptureState vocabulary. A faction with
// corrupt seat-holders climbs toward 'capture'; one that's been cleaned recedes
// toward 'none'. Higher the corrupt member's seat, the faster it climbs.
export const CAPTURE_LADDER = Object.freeze(['none', 'adversarial', 'equilibrium', 'corrupted', 'capture']);

/** Step the ladder one rung up (toward capture) or down (toward none).
 *  @param {any} state @param {any} up */
export function advanceCaptureState(state, up) {
  const i = CAPTURE_LADDER.indexOf(state);
  const cur = i < 0 ? 0 : i;
  const next = up ? Math.min(CAPTURE_LADDER.length - 1, cur + 1) : Math.max(0, cur - 1);
  return CAPTURE_LADDER[next];
}

export const CAPTURE_TUNING = Object.freeze({
  advance: { base: 0.05, rank: 0.15, security: 0.08, prosperity: 0.05, min: 0.01, max: 0.40 },
  recover: { base: 0.04, security: 0.12, prosperity: 0.08, min: 0.02, max: 0.40 },
});

/** Per-tick chance a faction with a corrupt seat-holder climbs the ladder. The
 *  corrupt member's seat rank (1=agent..3=leader) drives it; security+prosperity
 *  damp it. */
export function captureAdvanceChance({ rank = 1, security = 0.5, prosperity = 0.5 } = {}) {
  const t = CAPTURE_TUNING.advance;
  const p = t.base + n01((Number(rank) || 1) / 3) * t.rank - n01(security) * t.security - n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

/** Per-tick chance a faction with NO corrupt seat-holders recedes toward 'none'
 *  — the faction-level self-cleaning, rising with security + prosperity. */
export function captureRecoverChance({ security = 0.5, prosperity = 0.5 } = {}) {
  const t = CAPTURE_TUNING.recover;
  const p = t.base + n01(security) * t.security + n01(prosperity) * t.prosperity;
  return clamp(p, t.min, t.max);
}

// ── Thieves-guild power loop ─────────────────────────────────────────────────
// The guild's strength accrues from the factions it has captured — their POWER
// and their DIVERSITY — but SATURATES (exp curve) so it can never run away. A
// stronger guild drags effective security down (the feedback loop) but only by a
// bounded fraction, and is hard-capped on legitimacy: it can out-rank on power,
// never on legitimacy.
export const GUILD_TUNING = Object.freeze({
  powerRate: 0.9,       // saturation rate for captured-power share → strength
  diversityFull: 4,     // distinct captured factions for the full diversity bonus
  securityDrag: 0.5,    // a max-strength guild HALVES effective security (bounded floor)
  legitimacyCap: 25,    // guild legitimacy is hard-capped here — never legitimate
  powerFloorBase: 30,   // criminal-faction power floor base…
  powerFloorRange: 55,  // …+ strength × range (up to ~85 at full strength)
});

/**
 * Guild strength (0..1) from the factions it has captured. Saturating in total
 * captured power (so it asymptotes, never runs away) and lifted by diversity
 * (crime spread across many factions is harder to root out than one).
 * @param {{capturedPowers?:number[], distinctArchetypes?:number}} args
 */
export function guildStrength({ capturedPowers = [], distinctArchetypes = 0 } = {}) {
  const totalShare = (Array.isArray(capturedPowers) ? capturedPowers : [])
    .reduce((a, p) => a + n01((Number(p) || 0) / 100), 0);
  const base = 1 - Math.exp(-totalShare * GUILD_TUNING.powerRate); // saturating
  const diversityMult = 0.6 + 0.4 * Math.min(1, (Number(distinctArchetypes) || 0) / GUILD_TUNING.diversityFull);
  return clamp(base * diversityMult, 0, 1);
}

/** Effective security after the guild's drag — bounded so it never reaches zero.
 *  @param {number} security @param {number} strength */
export function guildEffectiveSecurity(security, strength) {
  return n01(n01(security) * (1 - n01(strength) * GUILD_TUNING.securityDrag));
}

// ── Settlement → climate adapter ────────────────────────────────────────────
// Reads the corruption climate off a generated settlement: normalized crime /
// security / prosperity (0..1), whether a criminal institution is present, and
// the criminal-institution names (for second-relation matching). Defensive — any
// missing field degrades to a neutral default rather than throwing. No rng/Date.
const PROSPERITY_SCORE = Object.freeze({
  subsistence: 0.0, destitute: 0.0, poor: 0.2, struggling: 0.2, meager: 0.2,
  moderate: 0.4, modest: 0.4, stable: 0.45, comfortable: 0.6,
  prosperous: 0.8, thriving: 0.8, wealthy: 1.0, affluent: 1.0, opulent: 1.0,
});

/** @param {any} value */
function prosperityScore(value) {
  const s = String(value || '').toLowerCase();
  for (const [k, v] of Object.entries(PROSPERITY_SCORE)) { if (s.includes(k)) return v; }
  return 0.4; // unknown → middling
}

/** @param {import('./settlement.schema.js').SimInstitution} inst */
function isCriminalInstitution(inst) {
  if (!inst) return false;
  // Tag dispatch — declared 'criminal' tag OR a criminal name keyword, both
  // resolved by the centralized institutionTags map (lib/entities) — plus the
  // category signal. Replaces the local CRIMINAL_NAME_RE (its terms now live in
  // the one shared keyword map, so a rename can't silently desync this check).
  return institutionHasTag(inst, TAG.CRIMINAL) || /criminal/i.test(String(inst.category || ''));
}

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {{crime:number, security:number, prosperity:number, hasCriminalInst:boolean, criminalInstitutions:string[]}}
 */
export function readCorruptionClimate(settlement) {
  const eco = settlement?.economicState || {};
  const sp = eco.safetyProfile || settlement?.safetyProfile || {};
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];

  const criminalInstitutions = institutions.filter(isCriminalInstitution).map((/** @type {any} */ i) => i.name).filter(Boolean);
  const hasCriminalInst = criminalInstitutions.length > 0
    || (Array.isArray(sp.criminalInstitutions) && sp.criminalInstitutions.length > 0);

  const crimEff = Number(sp?.compound?.criminalEffective);
  const crime = Number.isFinite(crimEff) ? n01(crimEff / 100)
    : Number.isFinite(sp.blackMarketCapture) ? n01(sp.blackMarketCapture / 80)
      : 0.3;

  // safetyRatio = militaryEffective / criminalEffective (≈0..3+). Map to 0..1.
  const safetyRatio = Number.isFinite(sp.safetyRatio) ? sp.safetyRatio : 1;
  const security = n01(safetyRatio / 2.5);

  return {
    crime,
    security,
    prosperity: prosperityScore(eco.prosperity),
    hasCriminalInst,
    criminalInstitutions,
  };
}

// ── Corrupted-institution duality (patronage vs exposure) ───────────────────
// A corrupted security institution cuts BOTH ways:
//   • Patronage (onset side): criminals with a stooge in the watch operate
//     more freely — effective security is dragged down for ONSET suppression.
//   • Exposure (discovery side): organic exposure reads RAW security — a
//     strong watch keeps catching people even while parts of it are bought
//     (the guild's shielding is already priced into exposureChance's
//     -guildStrength term; passing dragged security in double-dipped it).
// Net dynamic: high security + corrupted institution = a purge state — fewer
// NEW corruptions than a lawless town, but a steady drum of scandals.
// Low security + corrupted institution = quiet rot toward capture.

export const SECURITY_INSTITUTION_RE = /(watch|garrison|constab|guard|magistrate|court|barracks)/i;

export const PATRONAGE_TUNING = Object.freeze({
  dragPerInstitution: 0.15,      // each compromised security institution…
  maxDrag: 0.3,                  // …capped well above the floor (security never zeroes)
  proximityVisibilityBonus: 0.25, // investigators circle a PUBLICLY corrupt institution
});

/** @param {any} a @param {any} b */
function nameMatches(a, b) {
  const x = String(a || '').trim().toLowerCase();
  const y = String(b || '').trim().toLowerCase();
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/** The home-institution fields the exposure path reads, in the same order.
 *  @param {import('./settlement.schema.js').SimNpc} npc */
export function npcHomeInstitution(npc) {
  return npc?.factionAffiliation || npc?.factionLink || npc?.institutionId || null;
}

/**
 * Which of the settlement's security institutions are compromised, and how.
 *   covert   — an unexposed corrupt NPC is homed there (the hidden stooge);
 *              drags onset security, invisible to the public.
 *   revealed — the institution carries a 'corruption' impairment (a scandal
 *              made it public); drags onset security AND raises the exposure
 *              visibility of anyone still corrupt inside it.
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {{covert: string[], revealed: string[]}}
 */
export function compromisedSecurityInstitutions(settlement) {
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  const securityInstitutions = institutions
    .filter((/** @type {any} */ inst) => SECURITY_INSTITUTION_RE.test(String(inst?.name || '')));
  if (!securityInstitutions.length) return { covert: [], revealed: [] };

  // A 'corruption'-typed impairment is PUBLIC record only when it is not flagged
  // covert. A covert mark (an institution-scope Impose Corruption that quietly
  // captured a node) is the hidden channel: it must NOT read as a public scandal,
  // or it would wrongly drag exposure-proximity scrutiny onto the very NPC it was
  // meant to conceal.
  const revealed = new Set();
  const covert = new Set();
  for (const inst of securityInstitutions) {
    const corruptionImps = (inst.impairments || []).filter((/** @type {any} */ imp) => imp?.type === 'corruption');
    if (!corruptionImps.length) continue;
    if (corruptionImps.some((/** @type {any} */ imp) => imp?.covert !== true)) revealed.add(inst.name);
    else covert.add(inst.name);
  }

  for (const npc of settlement?.npcs || []) {
    if (npc?.corrupt !== true || npc?.ousted) continue;
    const home = npcHomeInstitution(npc);
    if (!home) continue;
    const match = securityInstitutions.find((/** @type {any} */ inst) => nameMatches(inst.name, home));
    if (match && !revealed.has(match.name)) covert.add(match.name);
  }

  return { covert: [...covert], revealed: [...revealed] };
}

/**
 * The patronage drag corrupted security institutions exert on ONSET-side
 * effective security (covert + revealed both count: a bought watch shields
 * recruits whether or not the town knows it's bought).
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {{drag: number, covert: string[], revealed: string[]}}
 */
export function patronageSecurityDrag(settlement) {
  const { covert, revealed } = compromisedSecurityInstitutions(settlement);
  const count = covert.length + revealed.length;
  return {
    drag: Math.min(PATRONAGE_TUNING.maxDrag, count * PATRONAGE_TUNING.dragPerInstitution),
    covert,
    revealed,
  };
}
