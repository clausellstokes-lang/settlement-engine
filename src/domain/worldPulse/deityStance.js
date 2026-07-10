/**
 * domain/worldPulse/deityStance.js — the PURE, rng-free inter-deity STANCE core
 * (Phase 4 W-F2).
 *
 * §3.2 found the certified religion engine has NO stance function: inter-deity
 * interaction is purely competitive conversion inside one settlement, and the law
 * axis is invisible to it. This module is the delta — a target-conditional
 * `stanceOf(source, target)` built ENTIRELY from the two signed alignment axes
 * (good–evil INTENT × law–chaos METHOD), per the owner's binding stance heuristic:
 *
 *   EVIL is self-centered, non-consolidated: HIGH aggression against ALL
 *   alignments INCLUDING its own axis, only a SLIGHT tilt toward good/neutral over
 *   evil (evil forms no bloc); its cooperation is transactional and betrayal-priced.
 *   GOOD is common-ground-seeking, consolidated: LOW aggression against everyone
 *   EXCEPT one strong, consolidated aggression against evil, and strong cooperation
 *   on shared good ground.
 *   The LAW axis governs METHOD + DURABILITY, never direction: lawful evil holds
 *   coercive-but-durable pacts and betrays only when triggered (devils); chaotic
 *   evil raids and betrays capriciously (demons); treaty durability and evil-pact
 *   cohesion key on the MINIMUM lawfulness across the parties, so LE×LE > LE×CE ≥
 *   CE×CE — and the consolidation cap holds: evil's best cooperation APPROACHES but
 *   never EXCEEDS good's consolidated baseline (coalitions of light vs a fractious
 *   darkness fall out of the asymmetry itself).
 *
 * The nine archetypes are NOT branched by name — they emerge from the two signed
 * coordinates (malice, disorder), each derived from the single-source `evil01` /
 * `chaos01` projections in the dependency-free deityConstants leaf. True Neutral
 * (the legacy default — a deity with neither alignment nor law axis) reads a
 * fully-ZERO stance: today's behavior, byte-identical.
 *
 * Determinism: PURE — no rng, no wall-clock, no mutation. Every field is a bounded
 * arithmetic combination of the two coordinates. The tuning table STANCE_TUNING is
 * the ONE source (deityEffects-pattern); consumers read it, never re-type it.
 *
 * Consumption (this wave = the LOCAL lane only): the law-METHOD terms `methodClash`
 * / `lawSign` feed the within-settlement patron-contest + receptivity substrate,
 * gated on the law axis so every law-neutral/legacy fixture is byte-identical
 * (deltas only on law-authored deities). The good–evil aggression/cooperation/
 * betrayal fields are the GLOBAL inter-settlement lane's inputs (W-F4).
 */

import { evil01, chaos01 } from './deityAxes.js';

/** @typedef {{ alignmentAxis?: string, lawAxis?: string, temperamentAxis?: string } | null | undefined} DeityAxes */
/**
 * @typedef {Object} DeityStance
 * @property {number} aggression       0..1 — source's drive to strike/dominate the target
 * @property {number} cooperation      0..1 — mutual cooperation/pact-cohesion propensity
 * @property {number} betrayalHazard   0..1 — source's propensity to betray a partner
 * @property {number} treatyDurability -1..+1 — SIGNED decay-resistance modifier (0 = no signal)
 */

export const STANCE_TUNING = Object.freeze({
  // ── INTENT (good–evil) → aggression + cooperation direction ──────────────────
  AGG_EVIL_BASE: 0.40,          // evil strikes EVERYONE, its own axis included
  AGG_EVIL_TILT: 0.10,          // + only a SLIGHT extra vs less-evil (good/neutral) targets
  AGG_EVIL_RAID: 0.15,          // chaotic-evil raids impulsively (adds to aggression)
  AGG_GOOD_VS_EVIL: 0.55,       // good's ONE strong, consolidated aggression: vs evil
  COOP_GOOD_BASE: 0.55,         // good's consolidated cooperation on shared good ground (the cap ref)
  COOP_EVIL_TRANSACTIONAL: 0.20,// evil bands for convenience only — transactional floor
  COHESION_LAW: 0.30,           // evil-pact cohesion scales on MIN lawfulness across parties
  EVIL_COOP_CAP: 0.52,          // HARD cap: evil's best cooperation stays under good's baseline
  // ── METHOD (law–chaos) → betrayal + durability ──────────────────────────────
  BETRAYAL_EVIL_FLOOR: 0.15,    // evil betrays everyone ≥ this
  BETRAYAL_CHAOS_AMP: 0.45,     // chaotic evil: capricious, unconditional betrayal (demons)
  BETRAYAL_LAW_DAMP: 0.10,      // lawful evil: strategic/triggered only — honors the pact letter (devils)
  DURABILITY_LAW: 0.50,         // treaty half-life scales with (min) lawfulness across parties
  EVIL_BRITTLE: 0.12,           // an evil party makes any pact more brittle (the transactional discount)
  // ── LOCAL-lane method-clash weights (law axis ONLY; zero for law-neutral/legacy) ──
  LAW_METHOD_COUNTER: 0.35,     // incumbentCounterForce: opposed methods add receptivity resistance
  CONTEST_METHOD: 0.12,         // organic-contest eligibility: opposed method destabilizes the seat
  MANDATE_LAW: 0.12,            // mandateAlignmentFit: lawful patron props traditional rule, chaotic props less
});

/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {number} x @returns {number} */
const clampSigned = (x) => (x < -1 ? -1 : x > 1 ? 1 : x);

/** Signed malice coordinate: +1 evil · 0 neutral · −1 good (from evil01). @param {DeityAxes} d @returns {number} */
const malice = (d) => 2 * evil01(d) - 1;
/** Signed disorder coordinate: +1 chaotic · 0 neutral · −1 lawful (from chaos01). @param {DeityAxes} d @returns {number} */
const disorder = (d) => 2 * chaos01(d) - 1;

/**
 * The signed law-axis direction of a deity: +1 lawful · −1 chaotic · 0
 * neutral/legacy (mirrors DEITY_LAW_TUNING.axisSign, but sourced off chaos01 so
 * the whole religion lane reads ONE axis projection). Pure.
 * @param {DeityAxes} d
 * @returns {number}
 */
export function lawSign(d) {
  const c = chaos01(d);
  return c < 0.5 ? 1 : c > 0.5 ? -1 : 0;
}

/**
 * The LOCAL-lane law-METHOD clash, 0..1: 1 iff the two deities carry OPPOSED law
 * axes (lawful ↔ chaotic), else 0 — in particular 0 whenever EITHER is
 * law-neutral/legacy, so every law-neutral fixture stays byte-identical. This is
 * the additive term the receptivity + patron-contest seams consume this wave. Pure.
 * @param {DeityAxes} a
 * @param {DeityAxes} b
 * @returns {number}
 */
export function methodClash(a, b) {
  const la = lawSign(a);
  const lb = lawSign(b);
  if (la === 0 || lb === 0) return 0;
  return Math.abs(la - lb) / 2;
}

/**
 * The target-conditional stance of `source` toward `target`, built from the two
 * signed alignment axes (see the module header for the heuristic). Every field is
 * bounded; a fully-neutral source-and-target (True Neutral / legacy) reads all
 * zero — the byte-identity anchor. Pure, rng-free.
 * @param {DeityAxes} source
 * @param {DeityAxes} target
 * @returns {DeityStance}
 */
export function stanceOf(source, target) {
  const T = STANCE_TUNING;
  const mA = malice(source);
  const mB = malice(target);
  const dA = disorder(source);
  const dB = disorder(target);

  // AGGRESSION — evil strikes all (slight tilt vs less-evil, +raid if chaotic);
  // good strikes ONLY evil (its one consolidated aggression); neutral strikes none.
  const evilAgg = pos(mA) * (T.AGG_EVIL_BASE + T.AGG_EVIL_TILT * (1 - pos(mB)));
  const raidAgg = pos(mA) * T.AGG_EVIL_RAID * pos(dA);
  const goodAgg = pos(-mA) * T.AGG_GOOD_VS_EVIL * pos(mB);
  const aggression = clamp01(evilAgg + raidAgg + goodAgg);

  // COOPERATION — good's consolidated cooperation on shared GOOD ground; evil's
  // transactional banding on shared EVIL ground, cohesion keyed on MIN lawfulness
  // and hard-capped so it approaches but never exceeds good's baseline.
  const goodCoop = pos(-mA) * pos(-mB) * T.COOP_GOOD_BASE;
  const minLawfulness = (1 - Math.max(dA, dB)) / 2;                 // 0..1, least-lawful party sets the ceiling
  const evilBand = Math.min(
    pos(mA) * pos(mB) * (T.COOP_EVIL_TRANSACTIONAL + T.COHESION_LAW * minLawfulness),
    T.EVIL_COOP_CAP,
  );
  const cooperation = clamp01(goodCoop + evilBand);

  // BETRAYAL HAZARD — an evil source betrays everyone ≥ a floor; chaotic evil
  // amplifies it (capricious), lawful evil damps it (triggered-only, honors the
  // letter). Good and neutral never initiate a betrayal ⇒ 0.
  const betrayalHazard = clamp01(
    pos(mA) * (T.BETRAYAL_EVIL_FLOOR + T.BETRAYAL_CHAOS_AMP * pos(dA) - T.BETRAYAL_LAW_DAMP * pos(-dA)),
  );

  // TREATY DURABILITY — a SIGNED decay-resistance modifier (0 = no signal / TN):
  // rises with the MIN lawfulness across parties (both-lawful pacts hold), an evil
  // party makes any pact more brittle (the transactional discount).
  const signedMinLawfulness = -Math.max(dA, dB);                   // +1 both lawful · 0 any neutral · −1 any chaotic
  const treatyDurability = clampSigned(
    T.DURABILITY_LAW * signedMinLawfulness - T.EVIL_BRITTLE * (pos(mA) + pos(mB)),
  ) + 0;                                                            // `+ 0` normalizes a −0 (TN center) to +0 for exact toBe(0)

  return { aggression, cooperation, betrayalHazard, treatyDurability };
}
