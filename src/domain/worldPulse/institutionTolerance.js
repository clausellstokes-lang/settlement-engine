/**
 * domain/worldPulse/institutionTolerance.js — INSTITUTIONAL ECOLOGY: trade-normalized
 * tolerance + the conscience (embargo) math (W-C3 item 2a / 2c).
 *
 * TOLERANCE is the moral-plane LENIENCY a settlement applies when JUDGING institutions —
 * how much cruelty (+) or disorder (+) it will abide — NOT its actual plane. Its BASELINE
 * is the patron's conviction (2·evil01−1 cruelty, 2·chaos01−1 disorder). Sustained TRADE
 * NORMALIZES it: a per-settlement per-axis OFFSET drifts toward the mass-weighted average
 * of trade partners' effective tolerances — SLOW (multi-year half-life), CAPPED (never full
 * convergence: trade normalizes what you TOLERATE before it changes what you ARE),
 * asymmetric by relative mass (a metropolis norms a hamlet more than the reverse — the
 * faithMass precedent). The EFFECTIVE tolerance (baseline + offset, clamped) feeds the
 * founding weights (item 1) and the embargo thresholds (item 2c).
 *
 * READ-LAST/WRITE-NEXT LEDGER. The offset lives on worldState.institutionTolerance
 * (Record<cid,{cruelty,disorder,causes?}>), advanced from the PRIOR tick's ledger. Three-
 * way byte-identity when absent (the conquestFeeds template): (a) the offset accessor
 * returns {0,0} on a missing ledger/entry; (b) advance returns null when nothing drifts;
 * (c) the kernel deletes the key when advance returns null. A world with no trade, or all-
 * neutral baselines, drifts nothing ⇒ byte-identical.
 *
 * PURE: no rng, no wall-clock, no mutation. A worldPulse leaf (lazy chunk); imports only
 * sibling worldPulse leaves (deityAxes, religionState mass helpers, the moral-lean leaf).
 */

import { evil01, chaos01 } from './deityAxes.js';
import { faithMass, neighbourFaithInfluence } from './religionState.js';
import { institutionMoralLean, isStandingInstitution } from './moralMartialLean.js';

export const TOLERANCE_TUNING = Object.freeze({
  // Drift RATE per unit of MASS-WEIGHTED pull toward a partner's tolerance. The mass weight
  // (neighbourFaithInfluence: partner_mass / self_mass, clamped [0.12,4]) scales the drift,
  // so a metropolis norms a hamlet HARDER than the reverse — the asymmetry the brief names,
  // present even with a single partner (a weighted-AVERAGE target would cancel it out). At
  // tick = 1 week (measured, soak panel B): an equal-mass town takes ~2.5 years to reach the
  // ±CAP; a hamlet beside a metropolis (weight 4) ~0.6 years; the metropolis back (weight
  // 0.12) barely moves over decades. Slow, multi-year, asymmetric — NOT a seasonal swing.
  RATE: 0.002,
  // Per-tick STEP cap — bounds the drift when many large partners pull at once, so the arc
  // stays slow even in a dense trade web (no single-tick lurch).
  STEP_CAP: 0.03,
  // OFFSET magnitude CAP — the "never full convergence" seam. A settlement's tolerance can
  // shift at most ±0.5 on an axis from its baseline, so a good town heavily trading with a
  // cruel metropolis grows MORE lenient toward cruelty but never crosses into cruelty
  // itself (baseline −1 → effective at worst −0.5). Trade normalizes; it does not convert.
  CAP: 0.5,
  // Drop offsets below EPS ⇒ byte-neutral for a truly-inert world (no trade, or all-neutral
  // planes ⇒ drift exactly 0). Kept well BELOW the per-tick drift so a slowly-accumulating
  // offset is never dropped mid-climb (that would stall normalization at zero).
  EPS: 1e-4,
  MAX_CAUSES: 3,              // cap the cause list on a ledger record (chronicle legibility)
  // ── conscience / embargo (item 2c) ──────────────────────────────────────────
  // Abhorrence = how far a supplier's WORST standing institution exceeds the buyer's
  // effective tolerance (per axis, the moral/law weights of the pressure model). The
  // trade-score penalty scales with it: mult = clamp(1 − abhorrence·EMBARGO_W, FLOOR, 1).
  MORAL_AXIS_W: 1.0,
  LAW_AXIS_W: 0.85,
  EMBARGO_W: 0.4,             // abhorrence→penalty scale (slave-market-under-a-saint ⇒ mult ~0.24)
  EMBARGO_FLOOR: 0.15,        // a curtailment, never a total cutoff — a trickle of trade persists
  EMBARGO_ABHOR_MIN: 0.15,    // below this abhorrence there is no objection (mult exactly 1)
});

/** @typedef {{ cruelty: number, disorder: number }} PlaneVec signed −1..+1 per axis */
/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string }} DeitySnapshot */
/** @typedef {{ name?: string, id?: (string|number), status?: unknown, moralLean?: PlaneVec, _worldPulseInactive?: boolean }} InstLike */
/** @typedef {{ config?: { primaryDeitySnapshot?: (DeitySnapshot|null) }, institutions?: InstLike[], tier?: string, population?: (number|string) }} SettleLike */
/** @typedef {{ id?: (string|number), name?: string, settlement?: SettleLike }} SnapItem */
/** @typedef {{ from?: (string|number), to?: (string|number), source?: (string|number), target?: (string|number), a?: (string|number), b?: (string|number), relationshipType?: string }} EdgeLike */
/** @typedef {{ settlements?: SnapItem[], regionalGraph?: { edges?: EdgeLike[] }, relationships?: EdgeLike[] }} SnapLike */
/** @typedef {{ snapshot?: SnapLike, worldState?: { institutionTolerance?: Record<string, PlaneVec> } }} AdvanceArgs */

const clamp = (/** @type {number} */ x, /** @type {number} */ lo, /** @type {number} */ hi) => (x < lo ? lo : x > hi ? hi : x);
const clampUnit = (/** @type {number} */ x) => clamp(x, -1, 1);
const pos = (/** @type {number} */ x) => (x > 0 ? x : 0);
const byCodepoint = (/** @type {string} */ a, /** @type {string} */ b) => { const x = String(a); const y = String(b); return x < y ? -1 : x > y ? 1 : 0; };

/** The BASELINE tolerance (a patron's signed conviction), {0,0} for a patron-less
 *  settlement. @param {DeitySnapshot|null|undefined} patron @returns {PlaneVec} */
export function patronConviction(patron) {
  if (!patron) return { cruelty: 0, disorder: 0 };
  return { cruelty: 2 * evil01(patron) - 1, disorder: 2 * chaos01(patron) - 1 };
}

/** The accumulated trade-drift OFFSET for a settlement, {0,0} when absent (byte-identity).
 *  @param {Record<string, PlaneVec>|null|undefined} ledger @param {string|number} cid @returns {PlaneVec} */
export function toleranceOffsetOf(ledger, cid) {
  const rec = ledger ? ledger[String(cid)] : null;
  if (!rec) return { cruelty: 0, disorder: 0 };
  return { cruelty: Number(rec.cruelty) || 0, disorder: Number(rec.disorder) || 0 };
}

/** The EFFECTIVE tolerance (baseline + trade drift, clamped) a settlement applies when
 *  judging institutions. Equals the patron conviction exactly when the ledger is absent.
 *  @param {SettleLike|null|undefined} settlement @param {Record<string, PlaneVec>|null|undefined} ledger @param {string|number} cid @returns {PlaneVec} */
export function effectiveToleranceOf(settlement, ledger, cid) {
  const base = patronConviction(settlement?.config?.primaryDeitySnapshot);
  const off = toleranceOffsetOf(ledger, cid);
  return { cruelty: clampUnit(base.cruelty + off.cruelty), disorder: clampUnit(base.disorder + off.disorder) };
}

/** The EFFECTIVE moral lean of an institution: the frozen name/tag leaf for generated
 *  institutions, else the stamped `moralLean` a founded (lifecycle-only) institution
 *  carries. Null when neither. @param {InstLike|null|undefined} inst @returns {PlaneVec|null} */
export function effectiveMoralLean(inst) {
  const frozen = institutionMoralLean(inst);
  if (frozen) return frozen;
  const m = inst && inst.moralLean;
  if (m && Number.isFinite(m.cruelty) && Number.isFinite(m.disorder)) return { cruelty: m.cruelty, disorder: m.disorder };
  return null;
}

/**
 * The CONSCIENCE multiplier a buyer applies to a supplier's trade score: 1 when the buyer
 * tolerates everything the supplier houses, falling toward EMBARGO_FLOOR as the supplier's
 * WORST standing institution exceeds the buyer's tolerance. Abhorrence is the MAX per-axis
 * excess (the single most offensive institution drives the embargo). Returns { mult,
 * abhorrence, worst } — worst = the offending institution's name (for the receipt).
 * @param {PlaneVec} buyerTol @param {InstLike[]} supplierInstitutions @returns {{ mult: number, abhorrence: number, worst: (string|null) }}
 */
export function institutionConscience(buyerTol, supplierInstitutions) {
  const T = TOLERANCE_TUNING;
  let abhorrence = 0;
  let worst = null;
  for (const inst of (Array.isArray(supplierInstitutions) ? supplierInstitutions : [])) {
    if (!isStandingInstitution(inst)) continue;
    const lean = effectiveMoralLean(inst);
    if (!lean) continue;
    const excess = Math.max(
      T.MORAL_AXIS_W * pos(lean.cruelty - buyerTol.cruelty),
      T.LAW_AXIS_W * pos(lean.disorder - buyerTol.disorder),
    );
    if (excess > abhorrence) { abhorrence = excess; worst = String(inst.name || inst.id || ''); }
  }
  if (abhorrence < T.EMBARGO_ABHOR_MIN) return { mult: 1, abhorrence: 0, worst: null };
  return { mult: clamp(1 - abhorrence * T.EMBARGO_W, T.EMBARGO_FLOOR, 1), abhorrence, worst };
}

/** Trade-relationship carriers — the durable ties tolerance normalizes along (bidirectional
 *  relationship edges of these types). Mirrors the faith-carrier relationship set. */
const TRADE_TOLERANCE_CARRIERS = Object.freeze(['trade_partner', 'allied', 'ally', 'patron', 'vassal']);

/** cid → Set<partner cid> over sustained trade relationships (regionalGraph edges, bidirectional).
 *  @param {SnapLike|null|undefined} snapshot @returns {Map<string, Set<string>>} */
function tradePartnerMap(snapshot) {
  /** @type {Map<string, Set<string>>} */
  const out = new Map();
  const add = (/** @type {string} */ a, /** @type {string} */ b) => {
    if (!a || !b || a === b) return;
    if (!out.has(a)) out.set(a, new Set());
    /** @type {Set<string>} */ (out.get(a)).add(b);
  };
  for (const edge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const type = String(edge?.relationshipType || '');
    if (!TRADE_TOLERANCE_CARRIERS.includes(type)) continue;
    const from = String(edge?.from || edge?.source || edge?.a || '');
    const to = String(edge?.to || edge?.target || edge?.b || '');
    add(from, to);
    add(to, from);   // sustained trade normalizes both parties (asymmetry rides the mass weight)
  }
  return out;
}

/**
 * Advance the institution-tolerance offsets one tick: each settlement's offset drifts, at
 * TOLERANCE_TUNING.RATE, toward the MASS-WEIGHTED AVERAGE of its trade partners' EFFECTIVE
 * tolerances (read-last: partner tolerances use the PRIOR ledger), capped at ±CAP. Returns
 * { institutionToleranceByCid } = null when nothing drifts (byte-identical when absent).
 * Pure + deterministic (codepoint partner ordering).
 * @param {AdvanceArgs} [args]
 * @returns {{ institutionToleranceByCid: (Record<string, PlaneVec> | null) }}
 */
export function advanceInstitutionTolerance({ snapshot, worldState } = {}) {
  const prior = worldState?.institutionTolerance || {};
  const settlements = snapshot?.settlements || [];
  if (!settlements.length) return { institutionToleranceByCid: Object.keys(prior).length ? prior : null };

  const byId = new Map(settlements.map((/** @type {SnapItem} */ it) => [String(it.id), it]));
  // Effective tolerance of every settlement from the PRIOR ledger (read-last).
  /** @type {Map<string, PlaneVec>} */
  const effective = new Map();
  for (const it of settlements) {
    const cid = String(it.id);
    effective.set(cid, effectiveToleranceOf(it.settlement || {}, prior, cid));
  }
  const partnersOf = tradePartnerMap(snapshot);
  const T = TOLERANCE_TUNING;
  /** @type {Record<string, PlaneVec>} */
  const out = {};
  for (const it of settlements) {
    const cid = String(it.id);
    const partners = [...(partnersOf.get(cid) || [])].filter((p) => byId.has(p)).sort(byCodepoint);
    const priorOff = toleranceOffsetOf(prior, cid);
    if (!partners.length) {
      // No trade ⇒ no pull; a prior offset decays gently back toward the baseline so a
      // severed trade relationship un-normalizes over time (symmetric with the drift).
      const relaxC = priorOff.cruelty * (1 - T.RATE);
      const relaxD = priorOff.disorder * (1 - T.RATE);
      if (Math.abs(relaxC) > T.EPS || Math.abs(relaxD) > T.EPS) out[cid] = { cruelty: relaxC, disorder: relaxD };
      continue;
    }
    const self = effective.get(cid) || { cruelty: 0, disorder: 0 };
    const selfMass = faithMass(it.settlement);
    // Summed MASS-WEIGHTED pull toward each partner's effective tolerance. The weight scales
    // the drift (mass asymmetry), so a big partner pulls harder than a small one.
    let pullC = 0; let pullD = 0;
    const contributors = [];
    for (const pid of partners) {
      const pEff = effective.get(pid);
      if (!pEff) continue;
      const w = neighbourFaithInfluence(faithMass(byId.get(pid)?.settlement), selfMass); // partner bigger ⇒ norms more
      pullC += w * (pEff.cruelty - self.cruelty);
      pullD += w * (pEff.disorder - self.disorder);
      contributors.push({ pid, w });
    }
    if (!contributors.length) { if (Math.abs(priorOff.cruelty) > T.EPS || Math.abs(priorOff.disorder) > T.EPS) out[cid] = priorOff; continue; }
    // Drift the OFFSET so the EFFECTIVE tolerance moves toward partners, per-tick step-capped
    // (no lurch in a dense web) and offset-capped at ±CAP (never full convergence).
    const nextC = clamp(priorOff.cruelty + clamp(T.RATE * pullC, -T.STEP_CAP, T.STEP_CAP), -T.CAP, T.CAP);
    const nextD = clamp(priorOff.disorder + clamp(T.RATE * pullD, -T.STEP_CAP, T.STEP_CAP), -T.CAP, T.CAP);
    if (Math.abs(nextC) <= T.EPS && Math.abs(nextD) <= T.EPS) continue;   // negligible ⇒ byte-neutral
    /** @type {PlaneVec & { causes?: string[] }} */
    const rec = { cruelty: nextC, disorder: nextD };
    // Cause chain: the heaviest-mass partners pulling this settlement's tolerance.
    const causes = contributors.sort((a, b) => b.w - a.w || byCodepoint(a.pid, b.pid))
      .slice(0, T.MAX_CAUSES)
      .map((c) => String(byId.get(c.pid)?.name || c.pid));
    if (causes.length) rec.causes = causes;
    out[cid] = rec;
  }
  return { institutionToleranceByCid: Object.keys(out).length ? out : null };
}
