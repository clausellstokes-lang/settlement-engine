/**
 * domain/worldPulse/moralInstitutionPressure.js — the W-F8 institution VIABILITY
 * PRESSURE math (moral + martial), pure.
 *
 * The visible battleground (owner, 2026-07-11): morally-loaded institutions are BUILT
 * or TORN DOWN by who holds the patron seat. Viability pressure = patron-fit × piety
 * megaphone, PER-AXIS dampened by opposed runners-up (a divided city cannot purge
 * decisively). Exceptions derive, never special-cased: CG abolishes the slave market
 * (+cruelty) but keeps the gambling house (+disorder); LE runs the market and shutters
 * the rowdy pit (+disorder); LG raises orderly charity; CE keeps what bleeds.
 *
 * The pressure is SIGNED: positive = ABOLITION (the seat's plane rejects the
 * institution's lean), negative = ENTRENCHMENT (the seat's plane embraces it). An
 * integrator in the lifecycle accumulates it with a per-tick CLAMP so closure is an
 * ARC, not insta-demolition. Neutral/absent patron ⇒ 0 ⇒ byte-identical.
 *
 * Martial institutions rise/fall with READINESS on the same seams: a garrison lapses
 * when a town demilitarizes, entrenches when it arms.
 *
 * PURE: no rng, no wall-clock, no mutation. Imports only the lean-table leaf, the axis
 * leaf, and the piety readers — all reached without a religion-engine cycle.
 */

import { institutionMoralLean, institutionMartialLean, isStandingInstitution } from './moralMartialLean.js';
import { evil01, chaos01 } from './deityAxes.js';
import { pietyMoralBleedOf, pietyLawBleedOf } from './piety.js';
import { readinessOf } from './martialReadiness.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { stablePart } from './stablePart.js';

export const MORAL_PRESSURE_TUNING = Object.freeze({
  // per-tick integrator clamp — the "arcs not insta-demolition" seam. A full-opposition
  // devout purge accrues at most this much viability erosion per tick; a slave market
  // under a fervent saint's city takes ~ABOLITION_FLOOR / MAX_STEP ticks to fall.
  MAX_STEP: 0.12,
  DECAY: 0.05,               // when pressure reverses (a new patron), the integrator relaxes
  ABOLITION_FLOOR: 0.6,      // integrator crossing ⇒ an abolition candidate fires
  FOUNDING_FLOOR: 0.6,       // entrenchment crossing ⇒ a founding/emergence bias (Phase-5 catalog)
  MORAL_AXIS_W: 1.0,         // weight on the moral (cruelty) opposition…
  LAW_AXIS_W: 0.85,          // …vs the law (disorder) opposition in the composite pressure
  // martial viability: a martial institution's fate tracks readiness. In a demilitarized
  // town (low readiness, deep peace) it accrues LAPSE pressure; in an arming one it
  // entrenches. Keyed on readiness, not patron plane (structure, not conscience).
  MARTIAL_LAPSE_W: 0.9,      // peaceFraction × (1−readiness) → lapse pressure magnitude
  MARTIAL_ENTRENCH_W: 0.9,   // readiness → entrenchment magnitude
  // emergence tilt: readiness lifts martial-gap affinity (the war-supply/garrison birth
  // distribution — the font pattern); patron-fit lifts morally-fit gaps (Phase-5 catalog).
  MARTIAL_EMERGENCE_W: 0.5,
});

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {number} x @returns {number} */
const clamp01 = (x) => clamp(x, 0, 1);
/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string }} DeitySnapshot */
/** @typedef {{ name?: string, id?: string|number, category?: string, priorityCategory?: string, tags?: string[], status?: unknown, required?: boolean, requiredForTier?: boolean, _worldPulseInactive?: boolean }} InstLike */
/** @typedef {{ institutions?: InstLike[], config?: { primaryDeitySnapshot?: DeitySnapshot, faithProfile?: { martial?: { footing?: number } } } }} SettlementLike */
/** @typedef {{ tick?: number, simulationRules?: object, settlementTickStates?: Record<string, { moralViability?: { acc?: Record<string, number>, lastCandidateTick?: (number|null) } }> }} PressureWorldState */
/** @typedef {{ settlements?: Array<{ id?: string|number, name?: string, settlement?: SettlementLike }> }} PressureSnapshot */
/** @typedef {Record<string, unknown>} CandidateLike */

/**
 * SIGNED moral viability pressure for one institution under a patron (+ abolition …
 * − entrenchment), per-axis dampened by the piety bleed channels. Compares the
 * institution's (cruelty, disorder) lean against the patron's plane TOLERANCE
 * (2·evil01−1 cruelty, 2·chaos01−1 disorder): where the institution exceeds what the
 * patron tolerates ⇒ abolition; where the patron out-tolerates it ⇒ entrenchment.
 * EXACTLY 0 for a non-morally-coded institution, a neutral patron, or zero bleed. Pure.
 * @param {InstLike|null|undefined} inst @param {DeitySnapshot|null|undefined} patron @param {number} moralBleed 0..1 @param {number} lawBleed 0..1
 * @returns {number}
 */
export function moralViabilityPressure(inst, patron, moralBleed, lawBleed) {
  const lean = institutionMoralLean(inst);
  if (!lean || !patron) return 0;
  const T = MORAL_PRESSURE_TUNING;
  // The patron's signed CONVICTION on each axis (−1 good/lawful … +1 evil/chaotic). A
  // NEUTRAL patron has conviction 0 ⇒ zero pressure (the neutrality theorem, by geometry).
  const patronCruelty = 2 * evil01(patron) - 1;
  const patronDisorder = 2 * chaos01(patron) - 1;
  // Pressure = −(institution lean · patron conviction) per axis: OPPOSITE signs (a cruel
  // institution under a good patron) ⇒ +abolition; SAME signs (a cruel institution under
  // an evil patron) ⇒ −entrenchment; either factor 0 ⇒ 0. Per-axis dampened by the piety
  // bleed channel (a moral-/law-opposed runner-up dilutes that axis — the divided city).
  const moral = T.MORAL_AXIS_W * (-(lean.cruelty * patronCruelty)) * clamp01(moralBleed);
  const law = T.LAW_AXIS_W * (-(lean.disorder * patronDisorder)) * clamp01(lawBleed);
  return clamp(moral + law, -1, 1);
}

/** Moral viability pressure for a SPECIFIC institution on a settlement, reading the
 *  settlement's projected per-axis piety bleed channels (moral-opposed / law-opposed
 *  runners-up dilute the respective axis — the divided-city dampener). 0 when no faith
 *  record / neutral patron. Pure.
 *  @param {SettlementLike|null|undefined} settlement @param {InstLike|null|undefined} inst @param {DeitySnapshot} [patron] defaults to config.primaryDeitySnapshot @returns {number} */
export function moralViabilityPressureForInst(settlement, inst, patron) {
  const p = patron ?? settlement?.config?.primaryDeitySnapshot;
  if (!p) return 0;
  const s = /** @type {SimSettlement} */ (settlement);
  return moralViabilityPressure(inst, p, pietyMoralBleedOf(s), pietyLawBleedOf(s));
}

/**
 * SIGNED martial viability pressure for one institution (+ lapse … − entrenchment),
 * keyed on the town's readiness rather than the patron plane (structure, not
 * conscience). A martial institution in a demilitarized, peacetime town accrues LAPSE
 * pressure (the softened garrison); an arming one entrenches. EXACTLY 0 for a
 * non-martial institution or a settlement with no readiness record. Pure.
 * @param {InstLike|null|undefined} inst @param {number} readiness01 @param {number} peaceFraction 0..1 (1 = deep peace)
 * @returns {number}
 */
export function martialViabilityPressure(inst, readiness01, peaceFraction) {
  const lean = institutionMartialLean(inst);
  if (!lean) return 0;
  const T = MORAL_PRESSURE_TUNING;
  const r = clamp01(readiness01);
  const peace = clamp01(peaceFraction);
  const lapse = T.MARTIAL_LAPSE_W * peace * (1 - r);
  const entrench = T.MARTIAL_ENTRENCH_W * r;
  return clamp(lapse - entrench, -1, 1);
}

/**
 * Advance a per-institution abolition-viability integrator toward a signed pressure,
 * CLAMPED per tick — the arc, not insta-demolition. Positive pressure adds at most
 * MAX_STEP (scaled by pressure magnitude); a reversal (entrenchment / a new patron)
 * relaxes it at DECAY. The integrator tracks the ABOLITION side [0,1]; crossing
 * ABOLITION_FLOOR fires a closure candidate. Pure.
 * @param {number|null|undefined} prior @param {number} pressure signed −1..+1 @returns {number}
 */
export function stepAbolitionViability(prior, pressure) {
  const T = MORAL_PRESSURE_TUNING;
  const p = Number.isFinite(prior) ? clamp01(/** @type {number} */ (prior)) : 0;
  if (pressure > 0) return clamp01(p + Math.min(T.MAX_STEP, T.MAX_STEP * pos(pressure)));
  return clamp01(p - T.DECAY);
}

/** ≥1 martial-gap emergence affinity tilt for a militarized town (the garrison/war-supply
 *  birth distribution). 1 at readiness 0. @param {number} readiness01 @returns {number} */
export function martialEmergenceTilt(readiness01) {
  return 1 + MORAL_PRESSURE_TUNING.MARTIAL_EMERGENCE_W * clamp01(readiness01);
}

/** The peace fraction (1 − footing) of a settlement's projected martial record, or 1
 *  (deep peace / no record) — used by martial viability. @param {SettlementLike|null|undefined} settlement @returns {number} */
export function peaceFractionOf(settlement) {
  const footing = Number(settlement?.config?.faithProfile?.martial?.footing);
  return clamp01(1 - (Number.isFinite(footing) ? footing : 0));
}

// ── the lifecycle evaluator (built/torn-down by who holds the seat) ────────────

const MORAL_ABOLITION_COOLDOWN = 4;   // ticks between moral-abolition candidates per settlement

/** @param {InstLike|null|undefined} inst @param {DeitySnapshot} deity @returns {string} the offending axis phrase for the cause chain */
function abolitionCause(inst, deity) {
  const lean = institutionMoralLean(inst);
  if (!lean) return 'no longer serves the settlement it arms';
  const patronCruelty = 2 * evil01(deity) - 1;
  const patronDisorder = 2 * chaos01(deity) - 1;
  // The offending axis is one where lean and conviction have OPPOSITE signs (positive
  // opposition after negation), above a small threshold.
  const cruelOffense = -(lean.cruelty * patronCruelty) > 0.2;
  const disorderOffense = -(lean.disorder * patronDisorder) > 0.2;
  if (cruelOffense && disorderOffense) return 'its cruelty and disorder offend the seat';
  if (cruelOffense) return 'the seat will no longer abide its cruelty';
  if (disorderOffense) return 'the seat will no longer abide its disorder';
  return 'it sits ill with the settlement\'s patron';
}

/**
 * The MORAL/MARTIAL institution VIABILITY lane — built or torn down by who holds the
 * patron seat (owner, 2026-07-11). Gated on a patron (a projected primaryDeitySnapshot)
 * ⇒ byte-identical for deity-free worlds. For each STANDING morally-coded / martial
 * institution it accumulates a CLAMPED-per-tick viability integrator (moral = patron-fit
 * × per-axis piety bleed; martial = readiness-driven lapse); a crossing of ABOLITION_FLOOR
 * emits ONE cause-chained closure candidate per settlement per tick (cooldown-guarded). The
 * candidate reuses the institution_closure apply path (action 'abolish'). Pure; codepoint
 * ordering inherited from the snapshot's settlement order + institution order.
 * @param {PressureWorldState} worldState @param {PressureSnapshot} snapshot @param {{ tick?: number, simulationRules?: object }} [context]
 * @returns {{ worldState: PressureWorldState, candidates: CandidateLike[] }}
 */
export function evaluateMoralInstitutionPressure(worldState, snapshot, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  if (!rules.institutionLifecycleEnabled) return { worldState, candidates: [] };
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  /** @type {CandidateLike[]} */
  const candidates = [];
  for (const item of snapshot?.settlements || []) {
    const settlement = item.settlement || {};
    const patron = settlement?.config?.primaryDeitySnapshot;
    if (!patron) continue;                                  // faith gate ⇒ byte-identical
    const insts = Array.isArray(settlement.institutions) ? settlement.institutions : [];
    if (!insts.length) continue;
    const cid = String(item.id ?? '');
    const s = /** @type {SimSettlement} */ (settlement);
    const moralBleed = pietyMoralBleedOf(s);
    const lawBleed = pietyLawBleedOf(s);
    const readiness = readinessOf(s);
    const peace = peaceFractionOf(settlement);
    const prevMeta = settlementTickStates[cid]?.moralViability || null;
    /** @type {Record<string, number>} */
    const nextAcc = { ...((prevMeta && prevMeta.acc) || {}) };
    /** @type {{ inst: InstLike, key: string, accum: number, martial: boolean }|null} */
    let best = null;
    for (const inst of insts) {
      if (!isStandingInstitution(inst)) continue;
      const moralLean = institutionMoralLean(inst);
      const martialLean = institutionMartialLean(inst);
      if (!moralLean && !martialLean) continue;
      const key = stablePart(String(inst.name || inst.id || ''));
      let pressure = 0;
      if (moralLean) pressure += moralViabilityPressure(inst, patron, moralBleed, lawBleed);
      if (martialLean) pressure += martialViabilityPressure(inst, readiness, peace);
      const accum = stepAbolitionViability(nextAcc[key], pressure);
      if (accum > 0.001) nextAcc[key] = accum; else delete nextAcc[key];
      if (accum >= MORAL_PRESSURE_TUNING.ABOLITION_FLOOR && (!best || accum > nextAcc[best.key])) {
        best = { inst, key, accum, martial: !moralLean && !!martialLean };
      }
    }
    const lastCandidateTick = prevMeta?.lastCandidateTick ?? null;
    let nextLastCandidateTick = lastCandidateTick;
    const cooled = lastCandidateTick == null || tick - lastCandidateTick >= MORAL_ABOLITION_COOLDOWN;
    if (best && cooled) {
      nextLastCandidateTick = tick;
      const instName = String(best.inst.name || best.key);
      const patronName = String(patron.name || 'the patron');
      const severity = clamp01(0.4 + best.accum * 0.4);
      const fate = best.martial ? 'disbanded' : 'abolished';
      const cause = best.martial
        ? 'a generation of peace has softened the need for it'
        : abolitionCause(best.inst, patron);
      candidates.push({
        id: `candidate.institution.abolish.${stablePart(cid)}.${best.key}.${tick}`,
        type: 'institution',
        candidateType: 'institution_closure',
        ruleId: best.martial ? 'institution_martial_lapse' : 'institution_moral_abolition',
        ruleFamily: 'institution_lifecycle',
        targetSaveId: item.id,
        severity,
        probability: clamp01(0.25 + best.accum * 0.5),
        applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto',
        headline: best.martial
          ? `${item.name || item.id} may disband its ${instName}`
          : `${item.name || item.id} may abolish its ${instName}`,
        summary: best.martial
          ? `Long peace under ${patronName} is letting the ${instName} lapse.`
          : `Under ${patronName}, ${instName} faces abolition — ${cause}.`,
        reasons: [
          best.martial
            ? `A demilitarizing town no longer sustains the ${instName}.`
            : `${patronName} leads the abolition: ${cause}.`,
          `Viability pressure has built to ${Math.round(best.accum * 100)}% over sustained ticks (an arc, not a decree).`,
        ],
        institutionPatch: {
          saveId: item.id,
          action: 'abolish',
          name: instName,
          category: best.inst.category || null,
          fate,
          reason: best.martial ? `Disbanded under a lasting peace.` : `Abolished under ${patronName}: ${cause}.`,
        },
        proposalPayload: { kind: 'institution_closure', saveId: item.id, name: instName, category: best.inst.category || null },
        metadata: { viability: best.accum, martial: best.martial, patron: patronName },
        conflictTags: [`${cid}:institution:${best.key}`, `${cid}:institution:lifecycle`],
      });
    }
    // CONDITIONAL materialization: only write moralViability when there is something to
    // track (an accumulating integrator, a live cooldown, or a prior record to carry). A
    // patron-bearing settlement with NO morally-coded/martial institution writes nothing ⇒
    // byte-neutral (the empty-integrator case never bloats settlementTickStates).
    const hasState = Object.keys(nextAcc).length > 0 || nextLastCandidateTick != null;
    if (hasState) {
      settlementTickStates[cid] = {
        ...(settlementTickStates[cid] || {}),
        moralViability: { acc: nextAcc, lastCandidateTick: nextLastCandidateTick },
      };
    } else if (prevMeta && settlementTickStates[cid]) {
      // an integrator that fully relaxed away — drop the sub-key (back to byte-neutral).
      const rest = { ...settlementTickStates[cid] };
      delete rest.moralViability;
      settlementTickStates[cid] = rest;
    }
  }
  return { worldState: { ...worldState, settlementTickStates }, candidates };
}

export { readinessOf };
