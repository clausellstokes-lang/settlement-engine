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
// W-C3 item 1: the MORAL FOUNDING catalog — the lifecycle-only benevolent/exploitative
// institutions the founding lane can raise. A golden-inert worldPulse leaf generation
// never imports (proven byte-identical by generatorGoldenMaster). Its `lean` is the
// engine coding the founding fit reads AND the value stamped onto the founded instance.
import { FOUNDING_INSTITUTIONS } from './foundingCatalog.js';
// W-C3 item 2a: the founding weights read a settlement's EFFECTIVE tolerance (patron
// conviction + trade-normalized drift), not the raw patron plane — "trade normalizes what
// you tolerate." Absent ledger ⇒ effective === baseline conviction ⇒ byte-identical.
import { patronConviction, effectiveToleranceOf, effectiveMoralLean } from './institutionTolerance.js';

export const MORAL_PRESSURE_TUNING = Object.freeze({
  // per-tick integrator clamp — the "arcs not insta-demolition" seam. A full-opposition
  // devout purge accrues at most this much viability erosion per tick; a slave market
  // under a fervent saint's city takes ~ABOLITION_FLOOR / MAX_STEP ticks to fall.
  MAX_STEP: 0.12,
  DECAY: 0.05,               // when pressure reverses (a new patron), the integrator relaxes
  ABOLITION_FLOOR: 0.6,      // integrator crossing ⇒ an abolition candidate fires
  FOUNDING_FLOOR: 0.6,       // entrenchment crossing ⇒ a founding candidate fires (W-C3 item 1)
  // W-C3 item 1: the founding integrator STEP. Founding is a YEARS-scale event, not
  // monthly churn — deliberately ~1/8 of abolition's MAX_STEP (0.12). Tearing an
  // institution DOWN under a fervent seat is a fast political act; RAISING an endowed
  // one (land, capital, staffing) is the slow years-scale process. At tick = 1 week
  // (temporal constitution), a strongly-aligned pious town (fit ~0.6) crosses
  // FOUNDING_FLOOR in ~0.6/(0.015·0.6) ≈ 67 ticks ≈ 1.3 years; a moderate one (fit ~0.4)
  // in ~1.9 years. Below that, at most ~8·0.015·0.6 ≈ 0.07 accrues per 8-tick golden
  // window — far under the floor, so no candidate fires and the goldens stay identical.
  FOUNDING_STEP: 0.015,
  // Base per-tick emission chance ONCE the integrator has crossed FOUNDING_FLOOR (the arc
  // is complete; ground is broken probabilistically over a few further weeks).
  FOUNDING_EMIT_P: 0.2,
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
  // W-C3 item 2b FAITH PRESCRIBES: a foreign patron's plane presses its CONVERT settlements'
  // institutions over the faith carriers, at carrier-attenuated strength × this bounded
  // weight — deliberately < a devout local's undiluted megaphone (1.0), so a settlement's own
  // seat still leads and a distant proselytizer only nudges. σ 0 (no carrier) ⇒ 0 ⇒ identical.
  FAITH_PRESCRIBE_W: 0.6,
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
/** @typedef {{ acc?: Record<string, number>, lastCandidateTick?: (number|null) }} ViabilityMeta */
/** @typedef {{ tick?: number, simulationRules?: object, institutionTolerance?: Record<string, { cruelty: number, disorder: number }>, settlementTickStates?: Record<string, { moralViability?: ViabilityMeta, moralFounding?: ViabilityMeta }> }} PressureWorldState */
/** @typedef {{ tick?: number, simulationRules?: object, faithReach?: (Map<string, Array<{ patron: DeitySnapshot, strength: number }>>|null) }} PressureContext */
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

/**
 * The FOUNDING FIT for a candidate institution's lean under a patron: the ENTRENCHMENT
 * side of the viability geometry (positive = the patron's plane EMBRACES this lean, so
 * it would RAISE the institution). This is exactly −moralViabilityPressure clamped to
 * the positive half — a merciful house (−cruelty) under a good patron (−cruelty
 * conviction) shares sign ⇒ +fit; a cruel one (+cruelty) under an evil patron
 * (+cruelty) shares sign ⇒ +fit; opposite signs ⇒ 0 (that patron would ABOLISH, not
 * found). Per-axis dampened by the piety bleed megaphone. EXACTLY 0 for a neutral
 * patron (conviction 0) or zero bleed ⇒ the founding neutrality theorem, by geometry.
 * @param {PlaneLean|null|undefined} lean @param {DeitySnapshot|null|undefined} patron @param {number} moralBleed 0..1 @param {number} lawBleed 0..1
 * @returns {number}
 */
export function foundingViabilityFit(lean, patron, moralBleed, lawBleed) {
  if (!lean || !patron) return 0;
  return foundingFitFromTolerance(lean, patronConviction(patron), moralBleed, lawBleed);
}

/**
 * The founding fit against an explicit TOLERANCE vector (the item-2a seam): identical to
 * foundingViabilityFit but takes the settlement's EFFECTIVE tolerance (baseline conviction
 * + trade-normalized drift) instead of deriving conviction from the patron. With no trade
 * drift the tolerance equals the patron conviction, so this is byte-identical to the raw
 * founding fit. @param {PlaneLean|null|undefined} lean @param {{cruelty:number,disorder:number}|null|undefined} tol @param {number} moralBleed @param {number} lawBleed @returns {number}
 */
export function foundingFitFromTolerance(lean, tol, moralBleed, lawBleed) {
  if (!lean || !tol) return 0;
  const T = MORAL_PRESSURE_TUNING;
  const moral = T.MORAL_AXIS_W * (lean.cruelty * tol.cruelty) * clamp01(moralBleed);
  const law = T.LAW_AXIS_W * (lean.disorder * tol.disorder) * clamp01(lawBleed);
  return clamp01(moral + law); // only the positive (embrace) half founds
}

/**
 * Advance a per-institution FOUNDING integrator toward a founding fit, at the slow
 * FOUNDING_STEP (years-scale). A reversal (a new opposed patron) relaxes it at DECAY.
 * Crossing FOUNDING_FLOOR arms a founding candidate. Pure.
 * @param {number|null|undefined} prior @param {number} fit 0..1 @returns {number}
 */
export function stepFoundingViability(prior, fit) {
  const T = MORAL_PRESSURE_TUNING;
  const p = Number.isFinite(prior) ? clamp01(/** @type {number} */ (prior)) : 0;
  if (fit > 0) return clamp01(p + T.FOUNDING_STEP * pos(fit));
  return clamp01(p - T.DECAY);
}

/** @typedef {{ cruelty: number, disorder: number }} PlaneLean */

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

/** @param {InstLike|null|undefined} inst @param {DeitySnapshot|null} deity @returns {string} the offending axis phrase for the cause chain */
function abolitionCause(inst, deity) {
  const lean = effectiveMoralLean(inst);
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
 * @param {PressureWorldState} worldState @param {PressureSnapshot} snapshot @param {PressureContext} [context]
 * @returns {{ worldState: PressureWorldState, candidates: CandidateLike[] }}
 */
export function evaluateMoralInstitutionPressure(worldState, snapshot, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  if (!rules.institutionLifecycleEnabled) return { worldState, candidates: [] };
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  // item 2b FAITH PRESCRIBES: convertId → reaching foreign patrons + carrier strength. Built
  // in religiousContest (reusing faithCarriersOut — no second graph) and threaded via context;
  // absent / deity-free ⇒ no reach ⇒ byte-identical (the local-only lane).
  const faithReach = context.faithReach || null;
  /** @type {CandidateLike[]} */
  const candidates = [];
  for (const item of snapshot?.settlements || []) {
    const settlement = item.settlement || {};
    const patron = settlement?.config?.primaryDeitySnapshot;
    const cid = String(item.id ?? '');
    const reaching = (faithReach && faithReach.get && faithReach.get(cid)) || [];
    // Process a settlement judged by its OWN seat OR PRESCRIBED by a reaching foreign faith.
    // No patron AND no reach ⇒ skip (identical to the prior local-only faith gate).
    if (!patron && !reaching.length) continue;
    const insts = Array.isArray(settlement.institutions) ? settlement.institutions : [];
    if (!insts.length) continue;
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
      const moralLean = effectiveMoralLean(inst);
      const martialLean = institutionMartialLean(inst);
      if (!moralLean && !martialLean) continue;
      const key = stablePart(String(inst.name || inst.id || ''));
      let pressure = 0;
      // LOCAL seat pressure (the settlement's own patron), then FOREIGN prescription from
      // every reaching patron at carrier-attenuated strength × FAITH_PRESCRIBE_W (bounded).
      if (moralLean && patron) pressure += moralViabilityPressure(inst, patron, moralBleed, lawBleed);
      if (moralLean && reaching.length) {
        const W = MORAL_PRESSURE_TUNING.FAITH_PRESCRIBE_W;
        for (const r of reaching) {
          pressure += moralViabilityPressure(inst, r.patron, r.strength * W, r.strength * W);
        }
      }
      // Martial lapse stays LOCAL (readiness/posture, not conscience) and patron-gated as
      // before, so a patron-less settlement reached only by a foreign faith gets no martial
      // evaluation it did not get before (byte-identical for the martial lane).
      if (martialLean && patron) pressure += martialViabilityPressure(inst, readiness, peace);
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
      // The abolition's LEADER: the local seat if present, else the strongest reaching
      // (prescribing) foreign patron. Names the receipt without assuming a local patron.
      let prescriber = patron || null;
      if (!prescriber && reaching.length) {
        let top = reaching[0];
        for (const r of reaching) if (r.strength > top.strength) top = r;
        prescriber = top.patron;
      }
      const patronName = String((prescriber && prescriber.name) || 'a reaching faith');
      const severity = clamp01(0.4 + best.accum * 0.4);
      const fate = best.martial ? 'disbanded' : 'abolished';
      const cause = best.martial
        ? 'a generation of peace has softened the need for it'
        : abolitionCause(best.inst, prescriber);
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

// ── the MORAL FOUNDING lane (W-C3 item 1) ──────────────────────────────────────

const MORAL_FOUNDING_COOLDOWN = 8;   // ticks between founding candidates per settlement

/** The cause phrase for a founding receipt — the plane that demands the institution.
 *  @param {{ set: string, lean: PlaneLean }} entry @param {DeitySnapshot} patron @returns {string} */
function foundingCause(entry, patron) {
  if (entry.set === 'benevolent') {
    const orderly = entry.lean.disorder < 0 && (2 * chaos01(patron) - 1) < -0.2;
    return orderly ? 'the plane\'s ordered mercy demands it' : 'the plane\'s mercy demands it';
  }
  // exploitative: the patron's cruelty/disorder makes room for it
  const disorderLed = entry.lean.disorder > 0 && (2 * chaos01(patron) - 1) > 0.2;
  return disorderLed ? 'the plane\'s cruelty and disorder make room for it' : 'the plane\'s cruelty makes room for it';
}

/** Indefinite article for a founded institution's lowercase name (receipt copy). */
function articleFor(/** @type {string} */ name) {
  return /^[aeiou]/i.test(String(name || '')) ? 'an' : 'a';
}

/**
 * The MORAL FOUNDING lane — new benevolent/exploitative institutions RAISED by who
 * holds the patron seat (W-C3 item 1). The mirror of the abolition lane: where the
 * abolition integrator tracks a patron REJECTING a standing institution, this tracks a
 * patron EMBRACING a founding-catalog institution the settlement LACKS, at the slow
 * FOUNDING_STEP. A crossing of FOUNDING_FLOOR arms ONE cause-chained founding candidate
 * per settlement per tick (cooldown-guarded); it reuses the institution build/apply
 * path via institutionPatch action 'found'. Weighted by the settlement's moral plane +
 * patron axes: good/merciful planes preferentially found the benevolent set, cruel/
 * disorderly planes the exploitative set — the weighting IS the founding fit (positive
 * only where the institution's lean and the patron's conviction share sign).
 *
 * DORMANCY/NEUTRALITY: gated on a patron (config.primaryDeitySnapshot) ⇒ byte-identical
 * for deity-free worlds; a neutral patron or zero piety bleed ⇒ fit 0 ⇒ nothing accrues
 * ⇒ nothing written (conditional materialization). Founding is years-scale, so no
 * candidate fires inside a golden's few-tick window. Pure; ordering inherited from the
 * snapshot's settlement order + the catalog's authored order.
 * @param {PressureWorldState} worldState @param {PressureSnapshot} snapshot @param {{ tick?: number, simulationRules?: object }} [context]
 * @returns {{ worldState: PressureWorldState, candidates: CandidateLike[] }}
 */
export function evaluateMoralInstitutionFounding(worldState, snapshot, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || worldState?.simulationRules);
  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  if (!rules.institutionLifecycleEnabled) return { worldState, candidates: [] };
  const settlementTickStates = { ...(worldState?.settlementTickStates || {}) };
  // item 2a: the trade-normalized tolerance ledger (absent ⇒ effective === patron
  // conviction ⇒ byte-identical to the raw founding fit).
  const toleranceLedger = worldState?.institutionTolerance || null;
  /** @type {CandidateLike[]} */
  const candidates = [];
  for (const item of snapshot?.settlements || []) {
    const settlement = item.settlement || {};
    const patron = settlement?.config?.primaryDeitySnapshot;
    if (!patron) continue;                                  // faith gate ⇒ byte-identical
    const cid = String(item.id ?? '');
    const s = /** @type {SimSettlement} */ (settlement);
    const moralBleed = pietyMoralBleedOf(s);
    const lawBleed = pietyLawBleedOf(s);
    // EFFECTIVE tolerance = patron conviction + trade-normalized drift. What a settlement
    // TOLERATES drives what it founds (item 2a). Equals the patron conviction with no drift.
    const tolerance = effectiveToleranceOf(settlement, toleranceLedger, cid);
    // A settlement never founds what it already has standing (no duplicate almshouse).
    const present = new Set(
      (Array.isArray(settlement.institutions) ? settlement.institutions : [])
        .filter((/** @type {InstLike} */ inst) => isStandingInstitution(inst))
        .map((/** @type {InstLike} */ inst) => String(inst.name || '').toLowerCase()),
    );
    const prevMeta = settlementTickStates[cid]?.moralFounding || null;
    /** @type {Record<string, number>} */
    const nextAcc = { ...((prevMeta && prevMeta.acc) || {}) };
    /** @type {{ entry: typeof FOUNDING_INSTITUTIONS[number], key: string, accum: number }|null} */
    let best = null;
    for (const entry of FOUNDING_INSTITUTIONS) {
      const key = stablePart(entry.name);
      if (present.has(entry.name.toLowerCase())) { delete nextAcc[key]; continue; }  // already stands
      const fit = foundingFitFromTolerance(entry.lean, tolerance, moralBleed, lawBleed);
      const accum = stepFoundingViability(nextAcc[key], fit);
      if (accum > 0.001) nextAcc[key] = accum; else delete nextAcc[key];
      if (accum >= MORAL_PRESSURE_TUNING.FOUNDING_FLOOR && (!best || accum > nextAcc[best.key])) {
        best = { entry, key, accum };
      }
    }
    const lastCandidateTick = prevMeta?.lastCandidateTick ?? null;
    let nextLastCandidateTick = lastCandidateTick;
    const cooled = lastCandidateTick == null || tick - lastCandidateTick >= MORAL_FOUNDING_COOLDOWN;
    if (best && cooled) {
      nextLastCandidateTick = tick;
      const entry = best.entry;
      const nameLower = entry.name.toLowerCase();
      const patronName = String(patron.name || 'the patron');
      const cause = foundingCause(entry, patron);
      const severity = clamp01(0.34 + best.accum * 0.3);
      const probability = clamp01(MORAL_PRESSURE_TUNING.FOUNDING_EMIT_P + best.accum * 0.3);
      candidates.push({
        id: `candidate.institution.found.${stablePart(cid)}.${best.key}.${tick}`,
        type: 'institution',
        candidateType: 'institution_founding',
        ruleId: entry.set === 'benevolent' ? 'institution_moral_founding_benevolent' : 'institution_moral_founding_exploitative',
        ruleFamily: 'institution_lifecycle',
        targetSaveId: item.id,
        severity,
        probability,
        applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto',
        headline: `${item.name || item.id} may raise ${articleFor(entry.name)} ${nameLower}`,
        summary: `Under ${patronName}, ${nameLower} rises because ${cause}.`,
        reasons: [
          `${patronName} raises the ${nameLower}: ${cause}.`,
          `Founding pressure has built to ${Math.round(best.accum * 100)}% over sustained years (an arc, not a decree).`,
        ],
        institutionPatch: {
          saveId: item.id,
          action: 'found',
          name: entry.name,
          category: entry.category,
          description: entry.desc,
          tags: [...entry.tags],
          moralLean: { cruelty: entry.lean.cruelty, disorder: entry.lean.disorder },
          set: entry.set,
          reason: `Founded under ${patronName}: ${cause}.`,
        },
        proposalPayload: { kind: 'institution_founding', saveId: item.id, name: entry.name, category: entry.category },
        metadata: { founding: best.accum, set: entry.set, patron: patronName },
        conflictTags: [`${cid}:institution:${best.key}`, `${cid}:institution:lifecycle`],
      });
    }
    // CONDITIONAL materialization (byte-neutral when nothing is tracked): only write
    // moralFounding when an integrator is accumulating or a cooldown is live.
    const hasState = Object.keys(nextAcc).length > 0 || nextLastCandidateTick != null;
    if (hasState) {
      settlementTickStates[cid] = {
        ...(settlementTickStates[cid] || {}),
        moralFounding: { acc: nextAcc, lastCandidateTick: nextLastCandidateTick },
      };
    } else if (prevMeta && settlementTickStates[cid]) {
      const rest = { ...settlementTickStates[cid] };
      delete rest.moralFounding;
      settlementTickStates[cid] = rest;
    }
  }
  return { worldState: { ...worldState, settlementTickStates }, candidates };
}

export { readinessOf };
