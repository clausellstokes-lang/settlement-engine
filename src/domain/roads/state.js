/**
 * roads/state.js — THE ROADS (owner commission, ENGINE LIFT #5: named-NPC travel ·
 * capture · ransom · conversion; DESIGN_THE_ROADS.md is binding law). Slice R-1a — THE
 * STATE LEAF.
 *
 * Owner (one sentence, §0): named NPCs travel to NEIGHBOUR settlements on PURPOSED
 * missions; ROUTING reads the faction's KNOWN picture while OUTCOMES roll against truth;
 * capture is a weighted PRNG (threat × exposure ÷ protection) with protection scaling on
 * importance AND home military might; a HOSTAGE is mechanically off-stage; the faction pays
 * RANSOM over time; a low personality-weighted chance the captive turns COVERT for the
 * captor through the EXISTING corruption web. Cadence: infrequent, near, ~1-week stays.
 *
 * WHAT THIS LEAF OWNS (R-1a, pure + total): the sidecar ledger SHAPES (MissionRec /
 * RansomRec / Whereabouts typedefs, §3); the ONE participation chokepoint predicate
 * isOffStage (§8, built ON the existing isInStasis); the DORMANCY GATE roadsActive (the
 * virtual roadsEnabled flag, §1 law 2); the soak-certified TUNING tables (§4-§10, every
 * entry vetoable); and the PURE ROADS MATH (risk tolerance, military quality, exposure,
 * capture probability, ransom term, conversion probability) + the two write-bounded
 * applicators (legitimacy / prosperity band-step), reimplemented self-contained per the
 * traditions §5 precedent so the mover stays a standalone leaf.
 *
 * FIRST-PAINT LAW (§1 law 11): a LAZY domain leaf — imported only from the lazy engine
 * chunk (roadsKernel at the pulse seam) and the master gate (worldSnapshot). It reads NO
 * entitlements and pulls NO UI. Its own imports (isInStasis, importanceWeight,
 * prosperityRank) already ride the engine chunk.
 *
 * Pure, deterministic, side-effect-free, clock-free. The pure math takes NORMALIZED
 * SCALARS (readiness01/experience01/capacityBand01) — the kernel does the engine reads and
 * passes them in, so this leaf stays dependency-light and fully unit-testable without a
 * spatial fixture.
 *
 * @enforced-by tests/domain/roadsState.test.js + tests/property/roadsDormancyGolden.test.js
 */
import { isInStasis } from '../npc/npcOps.js';
import { importanceWeight } from '../entities/npcs.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { clamp01 } from '../../kernel/math.js';

// ── narrowing helpers (self-contained; the traditionsKernel/npcLadderState idiom) ──────
/** @param {unknown} x @returns {Record<string, unknown>} */
export function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}
/** @param {unknown} x @param {number} d @returns {number} */
export function num(x, d) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
export function clampNum(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}
// clamp01 = the ONE kernel primitive (code-quality-4). Re-exported so roads consumers keep
// importing it from the state leaf; roads only ever feeds it finite numeric axes, so the
// kernel's non-finite⇒0 policy is byte-neutral to the prior coerce-then-clamp local form.
export { clamp01 };
/** Codepoint-stable string compare (byte-stable iteration). @param {string} a @param {string} b @returns {number} */
export function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ── §3 STATE SHAPES ────────────────────────────────────────────────────────────
/**
 * @typedef {Object} MissionRec
 * @property {string} id                 `road.${homeId}.${npcKey}.${departTick}`
 * @property {string} npcKey             npcId(sid, npc, index) — the ladder/agency idiom
 * @property {string} npcName
 * @property {string} homeId
 * @property {string} destId
 * @property {{ kind: string, ref: string }} purpose   observance|trade|diplomacy|ladder
 * @property {string} phase              outbound|visiting|returning
 * @property {string[]} path             the KNOWN-scored route, frozen at dispatch
 * @property {number} departTick
 * @property {number} legArrivalTick     per current leg
 * @property {number} stayWeeks
 * @property {number} escort01           the home military-quality escort factor, frozen
 * @property {number} riskTolerance01
 * @property {number} knownDangerAtDispatch  the stale-intel receipt
 * @property {boolean} trappedBySiege
 * @property {number} startedYear
 */
/**
 * @typedef {Object} RansomRec
 * @property {string} id                 `ransom.${missionId}`
 * @property {string} npcKey
 * @property {string} npcName
 * @property {string} homeId
 * @property {string} captorId
 * @property {string} threatClass        T1|T2|T3|T4
 * @property {number} startedTick
 * @property {number} termWeeks
 * @property {number} remainingWeeks
 * @property {boolean} conversionRolled
 * @property {boolean} willConvert
 */
/**
 * @typedef {Object} Whereabouts
 * @property {'traveling'|'visiting'|'returning'|'hostage'} state
 * @property {string} placeId            destId while traveling/visiting; captorId while hostage
 * @property {string} purposeKind
 * @property {number} sinceTick
 * @property {number|null} expectedReturnTick  null while hostage or trappedBySiege
 * @property {string} missionId
 */

export const WHEREABOUTS_STATES = Object.freeze(['traveling', 'visiting', 'returning', 'hostage']);
export const PURPOSE_KINDS = Object.freeze(['observance', 'trade', 'diplomacy', 'ladder']);
export const THREAT_CLASSES = Object.freeze(['T1', 'T2', 'T3', 'T4']);

// ── THE DORMANCY GATE (constitutional §1 law 2) — a virtual, defensively-read flag ─────
/**
 * Is the roads layer LIT? Reads simulationRules.roadsEnabled === true, defensively —
 * ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never entered (byte-identical; NO default in
 * DEFAULT_SIMULATION_RULES, so goldens do not move). Mirrors traditionsActive /
 * npcLadderActive. Pure, total.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState
 * @returns {boolean}
 */
export function roadsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).roadsEnabled === true);
}

// ── §8 THE ONE PARTICIPATION CHOKEPOINT ────────────────────────────────────────
/**
 * Is this NPC OFF-STAGE — excluded from every participation read? Built ON the existing
 * stasis predicate (npcOps.js:151): a DM-shelved NPC (isInStasis) OR a roads hostage
 * (whereabouts.state === 'hostage'). TRAVELERS (outbound/visiting/returning) are NEVER
 * off-stage — travel is narrative, captivity is mechanical (§1 law 5). Presence-driven:
 * the whereabouts key only exists when the mover wrote it, so a dark world reduces this to
 * isInStasis exactly ⇒ byte-identical. Pure, total.
 * @param {unknown} npc
 * @returns {boolean}
 */
export function isOffStage(npc) {
  if (isInStasis(/** @type {Parameters<typeof isInStasis>[0]} */ (npc))) return true;
  const w = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc).whereabouts : null;
  return !!(w && typeof w === 'object' && /** @type {Record<string, unknown>} */ (w).state === 'hostage');
}

// ── §4-§10 TUNING (soak-certified dials; every entry vetoable) ──────────────────
export const ROADS_TUNING = Object.freeze({
  // §4 GENESIS — range, cadence, selection, stay
  OBSERVANCE_LEAD_WEEKS: 2, // window opens within hop-time + this
  MAX_JOURNEY_HOPS: 2, // near-radius: destinations within 2 trade-graph hops
  MAX_HOP_WEEKS: 3, // near-radius: hopWeeks(home,dest) <= this
  OBSERVANCE_MIN_SCALE_BAND: 2, // a neighbour observance must be town-scale (band >= 2) to draw a pilgrim
  JOURNEY_CHANCE: 0.35, // per eligible NPC-year (the world-seed cadence draw)
  ABROAD_CAP: 2, // per-settlement concurrency cap
  MIN_TRAVEL_WEIGHT: 0.4, // importance >= notable travels; minor/nameless never
  DRAW_WEIGHT_BASE: 1.15, // selection draw weight = this - importanceWeight (importance-INVERSE)
  STAY_BASE_WEEKS: 1, // stayWeeks = this + seeded 0..1
  // §4 RISK COHERENCE (personality → riskTolerance01)
  RISK_TIMID: 0.35, // cowardly / paranoid
  RISK_CAUTIOUS: 0.5, // cautious dominant
  RISK_BASE: 0.65,
  RISK_BOLD: 0.9, // bold / prideful / zealous
  // §5 ROUTING
  DANGER_REFUSAL_CEILING: 2.0, // refuse when believedDanger > riskTolerance01 × this (vetoable)
  SILENCE_CALM_WEEKS: 26, // no news from a region for this long ⇒ ASSUMED calm
  // §7 PROTECTION (amendment C) + EXPOSURE
  ESCORT_SCALE: 1.0, // protection = (1 + this×importanceWeight) × militaryQuality01
  MIL_QUALITY_BASE: 0.6,
  MIL_QUALITY_READINESS: 0.5,
  MIL_QUALITY_EXPERIENCE: 0.3,
  MIL_QUALITY_CAPACITY: 0.2,
  MIL_QUALITY_MIN: 0.6,
  MIL_QUALITY_MAX: 1.6,
  EXPOSURE_BASE: 0.45,
  EXPOSURE_PER_WEEK: 0.08,
  EXPOSURE_VISITING: 0.15,
  CAPTURE_CAP: 0.6, // captureP(T1-T3) clamp ceiling
  // §7 THE FOUR CLASSES (base capture strength + protection exponent α)
  T1_BASE: 0.35, T1_ALPHA: 0.25, // army on route / occupation — barely respects escorts
  T2_BASE: 0.22, T2_ALPHA: 0.5, // siege during stay
  T3_BASE: 0.12, T3_ALPHA: 1.0, // embattled roads (× level)
  EMBATTLED_THRESHOLD: 0.35, // T3 fires when embattlementLevel(hop) >= this
  // §7 T4 HOST ROLL (self-balancing)
  T4_DETENTION_PER_RUNG: 0.10, // detentionP = this × hostilityRung × exposure ÷ protection × restraint
  T4_RUNG: Object.freeze({ rival: 1, cold_war: 2, hostile: 3 }),
  LEGITIMACY_RESTRAINT: 0.4, // restraint factor when host NOT at open war
  GUEST_RIGHT_MULT: 0.35, // an active host tradition window ⇒ detentionP × this
  DETAIN_LEGIT_HIT: -2, // a non-war detainer's own seat bleeds this on detention
  // §9 RANSOM
  RANSOM_TERM_BASE_WEEKS: 13, // termWeeks = this + round(SCALE × importanceWeight)
  RANSOM_TERM_SCALE_WEEKS: 26,
  CAPTURE_LEGIT_BASE: 1, // home seat hit at capture = -(this + round(SCALE × importanceWeight))
  CAPTURE_LEGIT_SCALE: 2,
  RANSOM_PAID_HOME_LEGIT: -1, // home seat -1 at ransom completion (the treasury bled)
  CAPTOR_PROSPERITY_STEP: 1, // captor +1 band-step for key/pillar captives
  HOME_PILLAR_PROSPERITY_STEP: -1, // home -1 band-step for PILLAR captives only (§20 Q10)
  CAPTOR_CREDIT_MIN_WEIGHT: 0.7, // "key/pillar" = importanceWeight >= this
  PILLAR_WEIGHT: 1.0, // pillar exactly
  // §10 CONVERSION
  CONVERT_BASE: 0.05,
  CONVERT_FLAW_CORRUPTIBLE: 1.6, // personality.flaw ∈ CORRUPTIBLE_FLAWS
  CONVERT_FLAW_RESISTANT: 0.4, // dominant zealous/principled
  CONVERT_FLAW_BASE: 1.0,
  CONVERT_DURATION_MIN: 0.5,
  CONVERT_DURATION_MAX: 2,
  CONVERT_DURATION_DENOM: 26, // durationFactor = clamp(termWeeks/this, MIN, MAX)
  RETURNED_CAPTIVE_CHANNEL_QUALITY: 0.6, // the quality-boosted channel the web consumes (§10)
});

// ── §4 RISK COHERENCE — personality → riskTolerance01 ──────────────────────────
const TIMID_TRAITS = new Set(['cowardly', 'paranoid']);
const BOLD_TRAITS = new Set(['bold', 'prideful', 'zealous']);
const CAUTIOUS_TRAITS = new Set(['cautious']);
/**
 * The traveler's risk tolerance from personality (dominant/flaw — the corruption
 * npcAlignmentScore read surface). Timid (cowardly/paranoid) 0.35 · cautious 0.5 · bold/
 * prideful/zealous 0.9 · base 0.65. Read priority: timid wins (a coward is cautious first),
 * then bold, then cautious. Pure.
 * @param {unknown} npc @returns {number}
 */
export function riskToleranceOf(npc) {
  const T = ROADS_TUNING;
  const p = asObject(asObject(npc).personality);
  const dominant = String(p.dominant || '').toLowerCase();
  const flaw = String(p.flaw || '').toLowerCase();
  if (TIMID_TRAITS.has(dominant) || TIMID_TRAITS.has(flaw)) return T.RISK_TIMID;
  if (BOLD_TRAITS.has(dominant) || BOLD_TRAITS.has(flaw)) return T.RISK_BOLD;
  if (CAUTIOUS_TRAITS.has(dominant)) return T.RISK_CAUTIOUS;
  return T.RISK_BASE;
}

// ── §7 PROTECTION + EXPOSURE + CAPTURE (pure math over normalized scalars) ──────
/**
 * The home settlement's military quality band (frozen onto escort01 at dispatch — "the
 * guards who left with you are the guards you have"). Takes normalized [0,1] scalars; the
 * kernel supplies readinessOf/experienceOf/militaryCapacityScalar. Clamped [0.6, 1.6].
 * "Better soldiers and equipment do make a difference." Pure.
 * @param {{ readiness01?: number, experience01?: number, capacityBand01?: number }} a
 * @returns {number}
 */
export function militaryQuality01(a) {
  const T = ROADS_TUNING;
  const q = T.MIL_QUALITY_BASE
    + T.MIL_QUALITY_READINESS * clamp01(/** @type {number} */ (a.readiness01))
    + T.MIL_QUALITY_EXPERIENCE * clamp01(/** @type {number} */ (a.experience01))
    + T.MIL_QUALITY_CAPACITY * clamp01(/** @type {number} */ (a.capacityBand01));
  return clampNum(q, T.MIL_QUALITY_MIN, T.MIL_QUALITY_MAX);
}

/**
 * Protection = (1 + ESCORT_SCALE × importanceWeight) × militaryQuality01 (§7 amendment C):
 * notable 1.4 · key 1.7 · pillar 2.0 escort factor before the quality multiplier. Pure.
 * @param {{ importanceWeight: number, militaryQuality01: number }} a @returns {number}
 */
export function protectionOf(a) {
  const T = ROADS_TUNING;
  return (1 + T.ESCORT_SCALE * clamp01(a.importanceWeight)) * Math.max(0.01, num(a.militaryQuality01, 1));
}

/**
 * Exposure = clamp01(0.45 + 0.08 × legWeeks + 0.15 × (visiting ? 1 : 0)) — long roads and
 * foreign courts expose more. Pure.
 * @param {{ legWeeks: number, phase: string }} a @returns {number}
 */
export function exposureOf(a) {
  const T = ROADS_TUNING;
  return clamp01(T.EXPOSURE_BASE + T.EXPOSURE_PER_WEEK * Math.max(0, num(a.legWeeks, 0))
    + (a.phase === 'visiting' ? T.EXPOSURE_VISITING : 0));
}

/**
 * captureP(T1-T3) = clamp(base × exposure ÷ protection^α, 0, CAPTURE_CAP) — the partial-
 * bypass law: a small α means armies barely respect escorts. Pure.
 * @param {{ base: number, exposure: number, protection: number, alpha: number }} a
 * @returns {number}
 */
export function captureProbability(a) {
  const T = ROADS_TUNING;
  const divisor = Math.pow(Math.max(0.01, num(a.protection, 1)), num(a.alpha, 1));
  return clampNum(num(a.base, 0) * clamp01(a.exposure) / divisor, 0, T.CAPTURE_CAP);
}

// ── §9 RANSOM term + §10 CONVERSION probability (pure) ──────────────────────────
/**
 * termWeeks = 13 + round(26 × importanceWeight): notable ~23 · key ~31 · pillar 39. Pure.
 * @param {number} importanceWeight01 @returns {number}
 */
export function termWeeksFor(importanceWeight01) {
  const T = ROADS_TUNING;
  return T.RANSOM_TERM_BASE_WEEKS + Math.round(T.RANSOM_TERM_SCALE_WEEKS * clamp01(importanceWeight01));
}

const CONVERSION_RESISTANT_DOMINANTS = new Set(['zealous', 'principled']);
/**
 * Conversion flaw factor (§10): a corruptible flaw amplifies (1.6); a zealous/principled
 * dominant resists (0.4); else base (1.0). CORRUPTIBLE_FLAWS is passed in (the corruption
 * leaf owns the canonical set) to keep this leaf dependency-light. Pure.
 * @param {unknown} npc @param {Set<string>|readonly string[]} corruptibleFlaws @returns {number}
 */
export function conversionFlawFactor(npc, corruptibleFlaws) {
  const T = ROADS_TUNING;
  const set = corruptibleFlaws instanceof Set ? corruptibleFlaws : new Set(Array.isArray(corruptibleFlaws) ? corruptibleFlaws : []);
  const p = asObject(asObject(npc).personality);
  const flaw = String(p.flaw || '').toLowerCase();
  const dominant = String(p.dominant || '').toLowerCase();
  if (set.has(flaw)) return T.CONVERT_FLAW_CORRUPTIBLE;
  if (CONVERSION_RESISTANT_DOMINANTS.has(dominant)) return T.CONVERT_FLAW_RESISTANT;
  return T.CONVERT_FLAW_BASE;
}

/**
 * p = 0.05 × flawFactor × durationFactor, durationFactor = clamp(termWeeks/26, 0.5, 2) —
 * LOW by construction (~2-12%). Pure.
 * @param {{ flawFactor: number, termWeeks: number }} a @returns {number}
 */
export function conversionProbability(a) {
  const T = ROADS_TUNING;
  const durationFactor = clampNum(num(a.termWeeks, 0) / T.CONVERT_DURATION_DENOM, T.CONVERT_DURATION_MIN, T.CONVERT_DURATION_MAX);
  return clamp01(T.CONVERT_BASE * Math.max(0, num(a.flawFactor, 1)) * durationFactor);
}

// ── §6/§9 WRITE-BOUNDED APPLICATORS (self-contained; the traditions §5 reimplementation) ──
/**
 * Apply signed publicLegitimacy.score deltas to snapshot updates (the applyLegitimacyHits
 * idiom, reimplemented self-contained): integer, clamped [0,100], skipping a legacy bare-
 * number / absent legitimacy (Number.isFinite(pl.score) guard). Same-reference when nothing
 * changed. Pure.
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} updates
 * @param {Map<string, number>} index saveId → update array position
 * @param {Map<string, number>} hits settlementId → signed delta
 * @returns {Array<{ saveId?: unknown, settlement?: unknown }>}
 */
export function applyLegitimacySteps(updates, index, hits) {
  if (!hits.size) return updates;
  let next = updates;
  let cloned = false;
  for (const [id, delta] of hits) {
    if (!delta) continue;
    const ui = index.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = asObject(entry && entry.settlement);
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw) ? asObject(plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(clampNum(Number(pl.score) + delta, 0, 100));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = { ...entry, settlement: { ...settlement, powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } } } };
  }
  return next;
}

/**
 * Apply prosperity BAND-STEP deltas on the canonical PROSPERITY_TIERS ladder (the upswing/
 * traditions applicator idiom): clamp [0,6], write back IN KIND (string label / {tier}
 * object), via prosperityRank ONLY (never a string match). Skips an unreadable band. Same-
 * reference when nothing changed. Pure.
 * @param {Array<{ saveId?: unknown, settlement?: unknown }>} updates
 * @param {Map<string, number>} index saveId → update array position
 * @param {Map<string, number>} deltas settlementId → signed band-step
 * @returns {Array<{ saveId?: unknown, settlement?: unknown }>}
 */
export function applyProsperityBandSteps(updates, index, deltas) {
  if (!deltas.size) return updates;
  let next = updates;
  let cloned = false;
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  for (const [id, delta] of deltas) {
    if (!delta) continue;
    const ui = index.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = asObject(entry && entry.settlement);
    const ec = asObject(settlement.economicState);
    const cur = ec.prosperity;
    const rank = prosperityRank(typeof cur === 'string' ? cur : String(asObject(cur).tier ?? ''));
    if (rank < 0) continue;
    const nextRank = Math.round(clampNum(rank + delta, 0, maxRank));
    if (nextRank === rank) continue;
    const nextLabel = PROSPERITY_TIERS[nextRank];
    const nextProsperity = cur && typeof cur === 'object' && !Array.isArray(cur)
      ? { ...asObject(cur), tier: nextLabel } : nextLabel;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = { ...entry, settlement: { ...settlement, economicState: { ...ec, prosperity: nextProsperity } } };
  }
  return next;
}

/**
 * Convenience: the numeric importance weight of an NPC (re-exported read surface so the
 * kernel and tests share one spelling). Pure.
 * @param {unknown} npc @returns {number}
 */
export function roadsImportanceWeight(npc) {
  return clamp01(importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (npc)));
}
