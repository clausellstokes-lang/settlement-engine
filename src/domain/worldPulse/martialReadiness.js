/**
 * domain/worldPulse/martialReadiness.js — MARTIAL READINESS + STRATEGIC RUST (W-F8).
 *
 * The owner's gap (verified): war memory lives in relationships (grievance ratchets)
 * and wounds (exhaustion) but NOT in STRUCTURE — five sieges leave a settlement
 * economically identical to unbroken peace. This module is the pure derivation of
 * TWO independent per-settlement scalars, projected like piety and read at the next
 * tick's expression seams:
 *
 *   • readiness01 — STRUCTURAL militarization. Asymmetric hysteresis: war experience
 *     (mobilizations, sieges, occupations — the worldState war ledgers) SPIKES it in
 *     seasons; extended peace DECAYS it over a generation (the peace dividend). The
 *     patron's DERIVED TEMPER through the piety megaphone holds the edge (war-gods)
 *     or releases it (peacelike patrons accelerate the dividend). Feeds: martial
 *     institution emergence/viability, the development value-ranking (war-supply
 *     chains), faster mobilization, gentler first-tick + slower deployment attrition,
 *     higher effective stats.
 *   • experience01 — STRATEGIC SHARPNESS. A recency-weighted read of ACTUAL recent
 *     engagement (any skirmish/siege/deployment teaches, weighted to the recent),
 *     decaying FAST through peace. Its INVERSE is RUST — the second fidelity term:
 *     a long-peace realm blunders its first war (the 1914 problem, derived). Feeds
 *     fidelityNoise as an additive error term alongside chaosPull.
 *
 * The two are INDEPENDENT axes by construction (different inputs, different decay):
 * a ready-but-rusty fortress town (readiness persists across a long peace, experience
 * faded) and a threadbare-but-sharp raider camp (constant small skirmishes keep
 * experience high while no sustained footing lifts readiness) are BOTH expressible.
 *
 * THE MILITARISM SPIRAL, braked at birth (readiness → cheaper war → more war →
 * readiness). Three brakes, all here or wired from here:
 *   1. UPKEEP DRAG on prosperity — `readinessUpkeepDrag` dampens civilian
 *      development value (guns-vs-butter); garrison economies are poorer in peace.
 *   2. THE PEACE DECAY — the slow-down asymmetry, accelerated under peacelike patrons.
 *   3. CONDUCT-FIT — `readinessConductLean` feeds the settlement's endogenous conduct
 *      plane (a war machine under a gentle god is DRIFT), so the reciprocal fit loop
 *      pressures demilitarization through the SAME signal that erodes legitimacy/piety.
 *
 * NEUTRALITY THEOREM: every reader returns the identity (mult 1 / lean 0 / rust 0)
 * when the settlement carries NO projected martial record — a deity-free / war-free
 * world never materializes one, so it is byte-identical. The record materializes only
 * when readiness is non-zero (war experienced); its FIRST materialization is at first
 * mobilization, with experience ≈ 0 ⇒ maximal rust ⇒ the blundered first war.
 *
 * PURE: no rng, no wall-clock, no mutation. Imports only the axis leaf (deityTemper)
 * and the piety readers (both leaves reached without a religion-engine cycle).
 */

import { deityTemper } from './deityAxes.js';
import { pietyMultOf } from './piety.js';

export const MARTIAL_READINESS_TUNING = Object.freeze({
  // ── the instantaneous war-footing INTENSITY (0..1 accrual driver) ──────────
  // Readiness is a RATCHET (warExhaustion's model): footing > 0 accrues it, peace
  // decays it. The intensity weights STRUCTURAL/sustained war (occupation, the
  // deployment scar) over TRANSIENT posture, so a brief skirmish barely moves
  // readiness (that lands on the fast experience EMA instead) while a long siege or
  // occupation hardens it — the source of readiness↔experience independence.
  FOOTING_EXHAUSTION_W: 0.9, // the sustained-deployment scar (warExhaustion 0..1) — PRIMARY
  FOOTING_OCCUPIED: 0.75,    // enduring occupation (a long structural imposition) — PRIMARY
  FOOTING_OCCUPYING: 0.55,   // garrisoning a conquest
  FOOTING_DEPLOYED_LIFT: 0.3,   // an army committed in the field this tick (transient)
  FOOTING_MOBILIZED_LIFT: 0.22, // mobilized / deploying (transient)
  FOOTING_ALERT_LIFT: 0.12,     // ramping (alert / war_preparation) (transient)
  FOOTING_THREAT_W: 0.3,     // weight on the threat environment (0..1 neighbour belligerence)
  // ── asymmetric hysteresis (the peace dividend) — the RATCHET ───────────────
  UP_ACCRUE: 0.28,           // readiness SPIKES: saturating accrual per war tick (fast, seasons)
  DOWN_DECAY: 0.04,          // …and DECAYS slowly in peace — half-life ~17 ticks (a generation)
  // patron temper (derived) through the megaphone: warlike HOLDS the edge (accrues
  // faster, decays slower), peacelike RELEASES it (the accelerated peace dividend).
  PEACE_DIVIDEND_W: 1.2,     // peacelike megaphone speeds the decay (× up to 1+this)
  WARHOLD_W: 0.6,            // warlike megaphone slows the decay / speeds accrual (× this)
  // ── strategic experience / rust (the second fidelity term) ─────────────────
  EXP_UP_RATE: 0.55,         // sharpness climbs fast with fresh engagement
  EXP_DOWN_RATE: 0.16,       // …and fades fast through peace — half-life ~4 ticks (recency)
  ENGAGE_DEPLOYED: 1.0,      // an active field engagement this tick
  ENGAGE_BESIEGED: 0.9,      // enduring a siege this tick
  ENGAGE_OCCUPIED: 0.6,      // resisting occupation this tick
  ENGAGE_WINLOSS_W: 0.5,     // recent win/loss beats teach (either outcome)
  RUST_MAX_ERROR: 0.35,      // CAP on the rust error magnitude (degraded, never random)
  RUST_EXP: 1.4,             // inexperience → error curve (superlinear toward zero experience)
  RUST_FLOOR_EXPERIENCE: 0.85, // experience at/above this ⇒ rust ≈ 0 (seasoned veterans)
  FIDELITY_TOTAL_MAX: 0.75,  // hard cap on chaos+rust combined error (independent floors, capped sum)
  // ── expression magnitudes (all compose INSIDE the existing seam clamps) ────
  MOBILIZE_SPEED_W: 0.6,     // readiness → up to +60% ramp rate
  FIRST_TICK_ATTRITION_W: 0.4,   // readiness → up to −40% opening-tick attrition (the practiced hold)
  DECAY_ATTRITION_W: 0.3,    // readiness → up to −30% sustained attrition decay (drilled, supplied)
  EFFECTIVE_STAT_W: 0.25,    // readiness → up to +25% effective strength (maintained arms) — efficiency, not invincibility
  VALUE_TILT_W: 0.5,         // readiness → up to +50% development value on war-supply chains
  UPKEEP_DRAG_W: 0.3,        // readiness (in peace) → up to −30% civilian development value (guns-vs-butter)
  // ── endogenous conduct lean (the fit-loop brake) ───────────────────────────
  CONDUCT_LEAN_W: 0.6,       // readiness → signed warlike conduct lean (raises evil+chaos in the plane)
});

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {number} x @returns {number} */
const clamp01 = (x) => clamp(x, 0, 1);
/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string }} DeitySnapshot */
/** @typedef {{ patronRef?: string|null, deities?: Record<string, { snapshot?: DeitySnapshot }> }} ReligionStateLike */
/** @typedef {{ byId?: { get?: (id: string) => ({ settlement?: SimSettlement }|undefined) } }} SnapshotLike */
/** @typedef {{ warPosture?: Record<string, { state?: string }>, deployments?: Record<string, object>, occupations?: Record<string, { occupierId?: string|number }>, warExhaustion?: Record<string, number>, martialReadiness?: Record<string, MartialRecord> }} MartialWorldState */
/** @typedef {{ snapshot?: SnapshotLike, worldState?: MartialWorldState, religionStates?: Record<string, ReligionStateLike>|null, pietyByCid?: Record<string, { composite?: number }>|null, priorMartial?: Record<string, MartialRecord>|null }} AdvanceMartialArgs */
/** @typedef {Object} MartialRecord
 * @property {number} readiness01   0..1 structural militarization (asymmetric hysteresis)
 * @property {number} experience01  0..1 recency-weighted engagement sharpness (rust = its inverse)
 * @property {number} footing       0..1 this tick's raw war-footing (the readiness target driver)
 * @property {Array<{ source: string, value: number }>} causes  receipts substrate
 */

/** patron temper as a signed sign: +1 warlike · −1 peacelike · 0 neutral/none.
 *  @param {{ alignmentAxis?: string, lawAxis?: string }|null|undefined} patron @returns {number} */
export function patronTemperSign(patron) {
  const t = deityTemper(patron);
  return t === 'warlike' ? 1 : t === 'peacelike' ? -1 : 0;
}

// ── instantaneous signals (the kernel gathers the ledger reads and calls these) ──

/**
 * The 0..1 instantaneous WAR-FOOTING INTENSITY of a settlement this tick — the
 * readiness ratchet's accrual driver, from its own worldState war ledgers + threat
 * environment. STRUCTURAL/sustained war (the deployment scar, occupation) dominates;
 * transient posture adds a smaller lift, so a brief skirmish barely arms a town while
 * a long siege hardens it. Pure.
 * @param {{ mobilized?: boolean, alert?: boolean, deployed?: boolean, occupied?: boolean,
 *   occupying?: boolean, exhaustion?: number, threat?: number }} signals
 * @returns {number}
 */
export function warFooting01(signals = {}) {
  const T = MARTIAL_READINESS_TUNING;
  // PRIMARY (structural) — the persistent war-footing that hardens a town.
  let structural = T.FOOTING_EXHAUSTION_W * clamp01(Number(signals.exhaustion) || 0);
  if (signals.occupied) structural = Math.max(structural, T.FOOTING_OCCUPIED);
  if (signals.occupying) structural = Math.max(structural, T.FOOTING_OCCUPYING);
  // TRANSIENT (posture) — a smaller lift for this tick's mobilization state.
  const transient = signals.deployed ? T.FOOTING_DEPLOYED_LIFT
    : signals.mobilized ? T.FOOTING_MOBILIZED_LIFT
    : signals.alert ? T.FOOTING_ALERT_LIFT : 0;
  return clamp01(structural + transient + T.FOOTING_THREAT_W * clamp01(Number(signals.threat) || 0));
}

/**
 * The 0..1 instantaneous ENGAGEMENT INTENSITY this tick — the experience/sharpness
 * driver. Reads ACTUAL contact (field deployment, siege, occupation resistance) +
 * recent win/loss beats. Deliberately keyed on ENGAGEMENT not footing so it diverges
 * from readiness (a raider's brief skirmishes teach without lifting structure). Pure.
 * @param {{ deployed?: boolean, besieged?: boolean, occupied?: boolean, winloss?: number }} signals
 * @returns {number}
 */
export function engagement01(signals = {}) {
  const T = MARTIAL_READINESS_TUNING;
  let e = 0;
  if (signals.deployed) e = Math.max(e, T.ENGAGE_DEPLOYED);
  if (signals.besieged) e = Math.max(e, T.ENGAGE_BESIEGED);
  if (signals.occupied) e = Math.max(e, T.ENGAGE_OCCUPIED);
  e += T.ENGAGE_WINLOSS_W * clamp01(Number(signals.winloss) || 0);
  return clamp01(e);
}

/**
 * Advance readiness01 with ASYMMETRIC hysteresis as a RATCHET (warExhaustion's model):
 * a war-footing tick ACCRUES it fast (saturating toward 1, scaled by footing intensity),
 * peace DECAYS it slowly (the generation-half-life peace dividend). The patron temper
 * megaphone modulates BOTH: a WARLIKE patron (temperSign +1) accrues faster and decays
 * slower (holds the edge); a PEACELIKE patron (−1) decays faster (accelerated dividend),
 * both scaled by the piety BLEED (how loud the god is). `prior` null ⇒ seed from 0 (first
 * materialization at first mobilization). 0 temper / 0 bleed ⇒ un-amplified structure. Pure.
 * @param {number|null|undefined} prior @param {number} footing 0..1 intensity
 * @param {{ temperSign?: number, megaphoneBleed?: number }} [opts]
 * @returns {number}
 */
export function stepReadiness(prior, footing, { temperSign = 0, megaphoneBleed = 0 } = {}) {
  const T = MARTIAL_READINESS_TUNING;
  const f = clamp01(footing);
  const p = Number.isFinite(prior) ? clamp01(/** @type {number} */ (prior)) : 0;
  const bleed = clamp01(megaphoneBleed);
  const s = clamp(temperSign, -1, 1);
  if (f > 0) {
    // ACCRUE toward saturation; a warlike patron speeds it (holds the edge).
    const accrueMult = clamp(1 + T.WARHOLD_W * pos(s) * bleed, 0.5, 2.5);
    return clamp01(p + T.UP_ACCRUE * f * accrueMult * (1 - p));
  }
  // DECAY (peace): peacelike speeds the dividend, warlike slows it.
  const decayMult = clamp(1 + T.PEACE_DIVIDEND_W * pos(-s) * bleed - T.WARHOLD_W * pos(s) * bleed, 0.1, 3);
  return clamp01(p - T.DOWN_DECAY * decayMult * p);
}

/**
 * Advance experience01 with a FAST symmetric-ish EMA (up fast, down fast) — recency:
 * sharpness climbs with engagement and fades quickly through peace. `prior` null ⇒
 * seed at the engagement level (so a never-fought settlement's first materialization
 * at mobilization starts near 0 ⇒ maximal rust). Pure.
 * @param {number|null|undefined} prior @param {number} engagement @returns {number}
 */
export function stepExperience(prior, engagement) {
  const T = MARTIAL_READINESS_TUNING;
  const e = clamp01(engagement);
  if (!Number.isFinite(prior)) return e;
  const p = clamp01(/** @type {number} */ (prior));
  const rate = e >= p ? T.EXP_UP_RATE : T.EXP_DOWN_RATE;
  return clamp01(p + rate * (e - p));
}

/**
 * The RUST error MAGNITUDE from an experience level — the second fidelity term. High
 * when inexperienced (the blundered first war), ≈0 for seasoned veterans, CAPPED
 * (degraded, never random). 0 experience ⇒ RUST_MAX_ERROR. Pure.
 * @param {number} experience01 @returns {number}
 */
export function rustMagnitude(experience01) {
  const T = MARTIAL_READINESS_TUNING;
  const inexp = clamp01((T.RUST_FLOOR_EXPERIENCE - clamp01(experience01)) / T.RUST_FLOOR_EXPERIENCE);
  if (inexp <= 0) return 0;
  return Math.min(T.RUST_MAX_ERROR, T.RUST_MAX_ERROR * Math.pow(inexp, T.RUST_EXP));
}

// ── site readers: identity short-circuit (absent record ⇒ neutral) ─────────────

/** The projected martial record on a settlement, or null. @param {SimSettlement|null|undefined} settlement @returns {MartialRecord|null} */
function martialOf(settlement) {
  const m = /** @type {{ config?: { faithProfile?: { martial?: MartialRecord } } }|null|undefined} */ (settlement)?.config?.faithProfile?.martial;
  return m && typeof m === 'object' ? /** @type {MartialRecord} */ (m) : null;
}

/** 0..1 readiness of a settlement (absent record ⇒ 0). @param {SimSettlement} settlement @returns {number} */
export function readinessOf(settlement) {
  const m = martialOf(settlement);
  return m && Number.isFinite(m.readiness01) ? clamp01(m.readiness01) : 0;
}

/** 0..1 strategic experience of a settlement (absent record ⇒ 1 = no rust, byte-identical). @param {SimSettlement} settlement @returns {number} */
export function experienceOf(settlement) {
  const m = martialOf(settlement);
  return m && Number.isFinite(m.experience01) ? clamp01(m.experience01) : 1;
}

/** The RUST error magnitude for a settlement's war decisions — 0 when no record (the
 *  identity short-circuit, byte-identical) OR a seasoned veteran. @param {SimSettlement} settlement @returns {number} */
export function rustOf(settlement) {
  const m = martialOf(settlement);
  if (!m) return 0;                                   // no record ⇒ no rust term ⇒ byte-identical
  return rustMagnitude(Number.isFinite(m.experience01) ? m.experience01 : 1);
}

/** ≥1 mobilization-ramp multiplier — the practiced mobilize FASTER. 1 when no record. @param {SimSettlement} settlement @returns {number} */
export function readinessMobilizationMult(settlement) {
  return 1 + MARTIAL_READINESS_TUNING.MOBILIZE_SPEED_W * readinessOf(settlement);
}

/** ≤1 first-tick attrition multiplier — the practiced take gentler opening losses. 1 at readiness 0. @param {number} readiness01 @returns {number} */
export function firstTickAttritionMult(readiness01) {
  return 1 - MARTIAL_READINESS_TUNING.FIRST_TICK_ATTRITION_W * clamp01(readiness01);
}

/** ≤1 sustained attrition-decay multiplier — drilled, supplied forces bleed slower throughout. 1 at readiness 0. @param {number} readiness01 @returns {number} */
export function attritionDecayMult(readiness01) {
  return 1 - MARTIAL_READINESS_TUNING.DECAY_ATTRITION_W * clamp01(readiness01);
}

/** ≥1 effective-strength multiplier — maintained arms, drilled levies (efficiency, never invincibility;
 *  the capacity clamps still govern). 1 at readiness 0. @param {number} readiness01 @returns {number} */
export function effectiveStatMult(readiness01) {
  return 1 + MARTIAL_READINESS_TUNING.EFFECTIVE_STAT_W * clamp01(readiness01);
}

/** ≥1 development value tilt for a WAR-SUPPLY chain in a militarized town. 1 when no record.
 *  @param {SimSettlement} settlement @returns {number} */
export function readinessValueTilt(settlement) {
  return 1 + MARTIAL_READINESS_TUNING.VALUE_TILT_W * readinessOf(settlement);
}

/** ≤1 UPKEEP DRAG on CIVILIAN (non-war-supply) development — guns-vs-butter (brake 1).
 *  Scaled by how MUCH at peace the town is (footing low ⇒ full drag; actively at war ⇒
 *  the garrison earns its keep, drag fades). 1 when no record. @param {SimSettlement} settlement @returns {number} */
export function readinessUpkeepDrag(settlement) {
  const m = martialOf(settlement);
  if (!m) return 1;
  const readiness = Number.isFinite(m.readiness01) ? clamp01(m.readiness01) : 0;
  const peaceFraction = 1 - clamp01(Number.isFinite(m.footing) ? m.footing : 0);
  return 1 - MARTIAL_READINESS_TUNING.UPKEEP_DRAG_W * readiness * peaceFraction;
}

/** Signed WARLIKE conduct lean from readiness — the endogenous-conduct brake (brake 3):
 *  a war machine reads as warlike conduct (raises evil+chaos in the plane), so a
 *  peacelike patron over it registers DRIFT. 0 at readiness 0 ⇒ byte-identical. Pure.
 *  @param {number} readiness01 @returns {number} */
export function readinessConductLean(readiness01) {
  return MARTIAL_READINESS_TUNING.CONDUCT_LEAN_W * clamp01(readiness01);
}

/** The signed warlike conduct lean of a settlement from its projected readiness (0 when
 *  no record) — the seam the endogenous conduct plane reads. @param {SimSettlement} settlement @returns {number} */
export function settlementMartialConductLean(settlement) {
  return readinessConductLean(readinessOf(settlement));
}

/** The piety-megaphone BLEED for a settlement (0..1) — how loud its patron is, the
 *  magnitude knob on the temper target shift + peace dividend. @param {SimSettlement} settlement @returns {number} */
export function megaphoneBleedOf(settlement) {
  return clamp01(pietyMultOf(settlement) - 1);
}

const READINESS_EPS = 0.005;   // below this on BOTH scalars ⇒ drop the entry (byte-neutral)

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The tick-END readiness/experience pass (the kernel driver). READ-LAST/WRITE-NEXT: for
 * each FAITH settlement (a religionState with a patron — the faith gate keeps deity-free
 * worlds byte-identical), it reads THIS tick's worldState war ledgers (warPosture,
 * deployments, occupations, warExhaustion) + the patron's derived temper through the
 * piety megaphone, ratchets readiness (structural) and EMAs experience (recency-sharp),
 * and materializes a per-cid record ONLY when non-trivial (a war-free faith settlement
 * carries no martial record ⇒ byte-identical). Codepoint-ordered, pure, rng-free.
 * @param {AdvanceMartialArgs} args
 * @returns {{ martialByCid: Record<string, MartialRecord>|null }}
 */
export function advanceMartialReadiness({ snapshot, worldState, religionStates, pietyByCid, priorMartial } = /** @type {AdvanceMartialArgs} */ ({})) {
  const states = religionStates && typeof religionStates === 'object' ? religionStates : null;
  if (!states) return { martialByCid: null };
  const posture = worldState?.warPosture || {};
  const deployments = worldState?.deployments || {};
  const occupations = worldState?.occupations || {};
  const exhaustion = worldState?.warExhaustion || {};
  const prior = priorMartial && typeof priorMartial === 'object' ? priorMartial : {};
  const piety = pietyByCid && typeof pietyByCid === 'object' ? pietyByCid : {};
  // Reverse index: who is occupying (garrisoning a conquest) this tick.
  const occupierSet = new Set();
  for (const k of Object.keys(occupations)) {
    const occ = occupations[k];
    if (occ && occ.occupierId != null) occupierSet.add(String(occ.occupierId));
  }
  /** @type {Record<string, MartialRecord>} */
  const out = {};
  for (const cid of Object.keys(states).sort(codepoint)) {
    const state = /** @type {ReligionStateLike} */ (states[cid]);
    const patronRef = state?.patronRef;
    const patron = (patronRef && state.deities?.[patronRef]?.snapshot)
      || snapshot?.byId?.get?.(String(cid))?.settlement?.config?.primaryDeitySnapshot
      || null;
    if (!patron) continue;                       // no patron ⇒ no megaphone ⇒ skip (byte-identical)
    const st = String(posture[cid]?.state || 'peace');
    const mobilized = st === 'mobilized' || st === 'deployed';
    const alert = st === 'alert' || st === 'war_preparation';
    const deployed = deployments[cid] !== undefined;
    const occupied = occupations[cid] !== undefined;
    const occupying = occupierSet.has(String(cid));
    const exh = clamp01(Number(exhaustion[cid]) || 0);
    const footing = warFooting01({ mobilized, alert, deployed, occupied, occupying, exhaustion: exh, threat: 0 });
    const engage = engagement01({ deployed, besieged: mobilized, occupied, winloss: 0 });
    const temperSign = patronTemperSign(patron);
    const composite = Number(piety[cid]?.composite);
    const megaphoneBleed = Number.isFinite(composite) ? clamp01(composite - 1) : 0;
    const priorRec = prior[cid] || null;
    const readiness01 = stepReadiness(priorRec ? priorRec.readiness01 : null, footing, { temperSign, megaphoneBleed });
    const experience01 = stepExperience(priorRec ? priorRec.experience01 : null, engage);
    if (readiness01 <= READINESS_EPS && experience01 <= READINESS_EPS) continue;  // drop ⇒ byte-neutral
    /** @type {Array<{ source: string, value: number }>} */
    const causes = [];
    if (footing > 0) causes.push({ source: 'war_footing', value: footing });
    if (readiness01 > READINESS_EPS && footing <= 0) causes.push({ source: 'peace_dividend', value: readiness01 });
    if (temperSign !== 0 && megaphoneBleed > 0) causes.push({ source: temperSign > 0 ? 'war_patron' : 'peace_patron', value: megaphoneBleed });
    if (experience01 < 1) causes.push({ source: 'strategic_rust', value: rustMagnitude(experience01) });
    out[cid] = { readiness01, experience01, footing, causes };
  }
  return { martialByCid: Object.keys(out).length ? out : null };
}
