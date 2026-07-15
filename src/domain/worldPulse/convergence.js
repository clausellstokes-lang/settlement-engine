/**
 * domain/worldPulse/convergence.js — W-CONVERGENCE: foreign military intervention in
 * internal contests, the multi-sided engagement law, and the reactive art of war
 * (DESIGN_CONVERGENCE.md).
 *
 * The owner's three laws (design §0):
 *   1. Foreign armies may join a settlement's INTERNAL contest on either side
 *      (empire-retention, regime-change, investment-protection, kinship, denial).
 *   2. Counterforce resolves as battle — the existing collision semantics verbatim,
 *      then the survivor tilts the contest.
 *   3. NO BINARY THINKING — sides are aim-groups; three-plus rivalrous sides are
 *      first-class, and rivals NEVER merge.
 *
 * WAVE 1 is COUP-SCOPED (design §2): the only verdict-bearing internal contest today
 * is the coup_detat stressor (birth → brewing → resolveCoupVerdict). This module gives
 * the coup's already-stamped hostile-neighbor `sponsorSettlementId` PHYSICS: a foreign
 * power with a typed MOTIVE + feasibility + the loaded-dice roll deploys to a live coup
 * and TILTS the verdict (interventionAdj → resolveCoupVerdict, the warSentimentAdj
 * precedent). Rebellion-verdict and occupation-uprising tilts are typed seams for a
 * later owner call.
 *
 * CONSTITUTIONAL POSTURE (design §6):
 *   - GATE: interventionActive(worldState) — warLayerEnabled === true AND the VIRTUAL
 *     interventionEnabled === true (the supplyWebWarfare / peaceCausal idiom: NO entry
 *     in DEFAULT_SIMULATION_RULES, so every existing golden is byte-identical; an
 *     explicitly-lit rules blob survives normalizeSimulationRules' spread). Gate absent
 *     ⇒ an IMMEDIATE no-op: zero forks, zero ledger keys.
 *       [JUDGMENT — war-gated, not belief-gated: an intervention is a PHYSICAL military
 *        operation (armies march regardless of the info layer), like armyTransit. The
 *        loaded-dice initiation is deterministic on live state, not on believed fog.
 *        Say "veto" to AND-in beliefsActive.]
 *   - Stable fork keys `intervene:<target>:<tick>` and `battle:<a>:<b>:<tick>` (the M9d
 *     idiom); codepoint-sorted iteration everywhere; every constant named/frozen/
 *     retunable (CONVERGENCE_TUNING). Aggregate-only (strength NUMBERS; no npc roster —
 *     the armyTransit named-character boundary). Ledger writes ride
 *     getSpatialLedger/setSpatialLedger/dropSpatialLedger (drop-when-empty; absent ⇒
 *     byte-identical; ZERO eager first-paint bytes — the spatialLedgers family carries
 *     the name; this kernel is imported ONLY by the lazy pulseKernel + coup.js).
 *   - CONSERVATION: interveners are conserved units; attrition bounded (resolveFieldBattle
 *     never annihilates); a beaten column retreats, it is never wiped.
 *
 * ISOLATED LEDGER (JUDGMENT, vetoable): intervention records live in a DEDICATED
 * `interventions` spatial ledger, NOT the shared `deployments` ledger. This guarantees
 * byte-identity-when-dark by construction and sidesteps warDeployment's one-army law +
 * siege-verdict machinery entirely. The one-army law is honored at DERIVATION (a power
 * holding a live deployment is ineligible to also intervene — a settlement cannot
 * besiege AND intervene). The 6 role:'siege' readers (warDeployment 621/671/709/1726,
 * warStatus 122, regionWakeReplay fixtures) are therefore provably unaffected — this
 * wave never writes a deployment record with role:'intervene'. Say "veto" to instead
 * write role:'intervene' into deployments and integrate the siege machinery.
 *
 * DOCUMENTED DEFERRALS (deliberate, clean boundaries — not gaps):
 *   - The full proposal-queue re-mint under DM-driven autonomy: the autonomous mover
 *     writes the ledger directly under legacy `auto` (byte-identical — the feature is
 *     dark by default) and DEFERS (visible, no mint — the corruptionWeb deferral-not-
 *     denial idiom) under dm_only/recommendations/routine-with-major-approval. The
 *     proposalPayload re-mint apply-branch + pendingActorMajorFor live dedup land with
 *     W-COMPOSER-2 (the verb-registration wave — the supplyWebWarfare forceable-verb
 *     precedent). intervention_ordered is REGISTERED + contract-tested now so the seam
 *     is ready.
 *   - The ORDER_INTERVENTION / REINFORCE / INTERCEPT verbs ship registrable-shape (the
 *     affordance entry-factory) but are NOT registered into the settlement-scoped
 *     manifest — the realm-manifest lift is W-COMPOSER-2 (the declareCasus / sueForPeace
 *     precedent).
 */

import { clamp01 } from '../../kernel/math.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { obligationMintMagnitude, foldObligations } from '../spatial/generosityReactions.js';
import { coupContenders } from '../rulingPowerCoup.js';
import { foreignGripOf, obligationDebt01, directionBias } from './corruptionWeb.js';
import { authorityFor } from './changeAuthorityPolicy.js';

// ── Tuning (documented here; retuned in the checkpoint soaks) ──────────────────────
export const CONVERGENCE_TUNING = Object.freeze({
  // THE LOADED-DICE INITIATION (design §H, the corruptionWeb INITIATE_BASE idiom):
  // p = INITIATE_BASE × pull², cap-held — a rare, deferral-visible event, not a hum.
  // pull ∈ [0,1] is the situation-weighted initiation weight (best motive × feasibility).
  INITIATE_BASE: 0.12,
  // The floor a best-motive score must clear for a power to consider intervening at all.
  MOTIVE_FLOOR: 0.2,

  // THE COUP TILT (design §2 — the warSentimentAdj precedent, weight 0.22). A backed
  // incumbent raises pHold; a backed challenger lowers it. Signed, bounded; the
  // resolveCoupVerdict clamp [0.1, 0.9] holds the final value. Scaled by the surviving
  // intervener's strength share so a token column barely moves a secure seat.
  PHOLD_WEIGHT: 0.22,

  // MOTIVE THRESHOLDS (design §2, all recon-verified computable).
  GRIP_PRESERVE_THRESHOLD: 0.25, // foreignGrip at/above which preserve_order fires
  KINSHIP_FLOOR: 0.2,            // §G kinship tie floor to matter

  // INSTALLED-REGIME OBLIGATION (design §2 — the predatory-patron mint). A successful
  // challenger-intervention mints an obligation the installed regime OWES its patron,
  // leverage-weighted (obligationMintMagnitude). kind:'intervention'.
  OBLIGATION_BASE_MAG: 0.4,     // baseMagnitude01 for the mint
  OBLIGATION_LEVERAGE_MAX: 1.0, // leverageIntent01 ceiling (predatory patrons)

  // INVITED / UNINVITED LEGITIMACY (design §2). Propping an incumbent at request is
  // legitimacy-cheap; backing rebels is casus-generative and raises the region's
  // encirclement read (interventionism makes neighbors arm).
  LEGIT_COST_INVITED: 0.05,     // an invited incumbent-prop pays almost nothing
  LEGIT_COST_UNINVITED: 0.45,   // backing rebels is dear

  // FEASIBILITY (design §2). The overextension read: an intervener far over its means
  // or opposed by strong counter-interveners aborts. Kept simple in wave 1 — the
  // strength-vs-opposition ratio, bounded.
  FEASIBILITY_FLOOR: 0.15,
});

// The intervention SIDE — which pole of the internal contest a foreign force backs.
export const INTERVENTION_SIDES = Object.freeze({ INCUMBENT: 'incumbent', CHALLENGER: 'challenger' });

// The typed MOTIVE catalog (design §2). Each motive names its canonical side.
export const MOTIVE_TYPES = Object.freeze([
  'preserve_order',            // empire-retention — backs the INCUMBENT
  'install_friendlier_regime', // the puppet path — backs the CHALLENGER
  'protect_investment',        // your debtor's regime — backs the INCUMBENT
  'kinship',                   // §G ties — backs whichever side shares them
  'denial',                    // counter-intervention — backs the OPPOSITE of a rival
]);

/** The canonical side a motive backs (kinship/denial are resolved at scoring). */
const MOTIVE_SIDE = Object.freeze({
  preserve_order: INTERVENTION_SIDES.INCUMBENT,
  install_friendlier_regime: INTERVENTION_SIDES.CHALLENGER,
  protect_investment: INTERVENTION_SIDES.INCUMBENT,
});

// ── Small pure helpers ─────────────────────────────────────────────────────────────
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) { return Math.round(v * 10000) / 10000; }
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

// ── The activation gate (dormancy / byte-identity seam) ─────────────────────────────
/**
 * Intervention is LIVE iff warLayerEnabled AND the virtual interventionEnabled flag are
 * both true. NO entry in DEFAULT_SIMULATION_RULES (the supplyWebWarfare idiom) ⇒ every
 * existing golden is byte-identical. Absent ⇒ an immediate no-op.
 * @param {{ simulationRules?: unknown } | null | undefined} worldState @returns {boolean}
 */
export function interventionActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  if (!rules || typeof rules !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (rules);
  return r.warLayerEnabled === true && r.interventionEnabled === true;
}

// ── The typed MOTIVE catalog (pure scorers — design §2) ─────────────────────────────
/**
 * preserve_order (EMPIRE-RETENTION): the patron's foreign grip over the target ≥ the
 * threshold, OR a tribute/vassal/compelled-alliance treaty binds the incumbent to it.
 * Backs the INCUMBENT. @param {{ foreignGrip01?: number, treatyWithIncumbent?: boolean }} inputs
 * @returns {{ score: number, receipt: string }}
 */
export function scorePreserveOrder({ foreignGrip01 = 0, treatyWithIncumbent = false } = {}) {
  const grip = clamp01(num(foreignGrip01, 0));
  const gripHit = grip >= CONVERGENCE_TUNING.GRIP_PRESERVE_THRESHOLD ? grip : 0;
  const treatyHit = treatyWithIncumbent ? 0.6 : 0;
  const score = clamp01(Math.max(gripHit, treatyHit));
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: treatyHit >= gripHit
    ? 'A tribute binds the seat to us — a client that falls is an empire that shrinks.'
    : 'Our hand already moves beneath this seat; better the devil we hold than the one they raise.' };
}

/**
 * install_friendlier_regime (THE PUPPET PATH): a hostile edge to the incumbent + an
 * affinity for the challenger's quadrant, OR a corruption leash on the challenger
 * faction (paid eyes see the coup brewing). Backs the CHALLENGER.
 * @param {{ hostile01?: number, challengerAffinity01?: number, leashOnChallenger01?: number }} inputs
 * @returns {{ score: number, receipt: string }}
 */
export function scoreInstallFriendlier({ hostile01 = 0, challengerAffinity01 = 0, leashOnChallenger01 = 0 } = {}) {
  const hostile = clamp01(num(hostile01, 0));
  const affinity = clamp01(num(challengerAffinity01, 0));
  const leash = clamp01(num(leashOnChallenger01, 0));
  // The hostile+affinity path; OR a leash is a direct puppet lever (paid eyes).
  const politicalPath = hostile > 0 ? clamp01(0.5 * hostile + 0.5 * affinity) : 0;
  const score = clamp01(Math.max(politicalPath, leash));
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: leash >= politicalPath
    ? 'We already hold a string on the pretender — install him and the seat is ours by proxy.'
    : 'The seat is no friend of ours; a friendlier claimant is worth an army.' };
}

/**
 * protect_investment: the target already OWES the patron (a debtor whose regime is the
 * collateral), or trade dependence makes the incumbent's stability the patron's. Backs
 * the INCUMBENT. @param {{ obligationDebt01?: number, tradeDependence01?: number }} inputs
 * @returns {{ score: number, receipt: string }}
 */
export function scoreProtectInvestment({ obligationDebt01 = 0, tradeDependence01 = 0 } = {}) {
  const debt = clamp01(num(obligationDebt01, 0));
  const trade = clamp01(num(tradeDependence01, 0));
  const score = clamp01(Math.max(debt, 0.7 * trade));
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: debt >= 0.7 * trade
    ? 'This seat owes us a decade of debts — a change of hands is a change of ledgers.'
    : 'Our trade runs through this seat; its fall is our loss.' };
}

/**
 * kinship (§G ties): shared people with one side. Backs whichever side the tie is
 * stronger toward. @param {{ kinshipIncumbent01?: number, kinshipChallenger01?: number }} inputs
 * @returns {{ score: number, receipt: string, side: string|null }}
 */
export function scoreKinship({ kinshipIncumbent01 = 0, kinshipChallenger01 = 0 } = {}) {
  const inc = clamp01(num(kinshipIncumbent01, 0));
  const cha = clamp01(num(kinshipChallenger01, 0));
  const best = Math.max(inc, cha);
  if (best < CONVERGENCE_TUNING.KINSHIP_FLOOR) return { score: 0, receipt: '', side: null };
  const side = cha > inc ? INTERVENTION_SIDES.CHALLENGER : INTERVENTION_SIDES.INCUMBENT;
  return { score: clamp01(best), side, receipt: side === INTERVENTION_SIDES.CHALLENGER
    ? 'Our kin rise against the seat — we do not watch our blood fight alone.'
    : 'Our kin hold this seat — we will not see them thrown down.' };
}

/**
 * denial (COUNTER-INTERVENTION): a rival is already backing one side; the patron backs
 * the OTHER to deny them the prize. @param {{ rivalSide?: string|null, rivalStrength01?: number }} inputs
 * @returns {{ score: number, receipt: string, side: string|null }}
 */
export function scoreDenial({ rivalSide = null, rivalStrength01 = 0 } = {}) {
  if (rivalSide !== INTERVENTION_SIDES.INCUMBENT && rivalSide !== INTERVENTION_SIDES.CHALLENGER) {
    return { score: 0, receipt: '', side: null };
  }
  const strength = clamp01(num(rivalStrength01, 0));
  if (strength <= 0) return { score: 0, receipt: '', side: null };
  const side = rivalSide === INTERVENTION_SIDES.INCUMBENT ? INTERVENTION_SIDES.CHALLENGER : INTERVENTION_SIDES.INCUMBENT;
  return { score: clamp01(strength), side, receipt: 'A rival marches to claim this seat — we march to deny it them.' };
}

/**
 * Score every motive and pick the strongest. Returns the chosen motive, its side, its
 * score, and its receipt — plus the full typed breakdown (the design's "typed weights
 * as receipts"). Deterministic tiebreak: MOTIVE_TYPES order.
 * @param {{ foreignGrip01?: number, treatyWithIncumbent?: boolean, hostile01?: number,
 *   challengerAffinity01?: number, leashOnChallenger01?: number, obligationDebt01?: number,
 *   tradeDependence01?: number, kinshipIncumbent01?: number, kinshipChallenger01?: number,
 *   rivalSide?: string|null, rivalStrength01?: number }} inputs
 * @returns {{ motive: string|null, side: string|null, score: number, receipt: string,
 *   breakdown: Array<{ motive: string, side: string|null, score: number, receipt: string }> }}
 */
export function scoreMotives(inputs = {}) {
  const po = scorePreserveOrder(inputs);
  const if_ = scoreInstallFriendlier(inputs);
  const pi = scoreProtectInvestment(inputs);
  const ki = scoreKinship(inputs);
  const de = scoreDenial(inputs);
  const breakdown = [
    { motive: 'preserve_order', side: MOTIVE_SIDE.preserve_order, score: round4(po.score), receipt: po.receipt },
    { motive: 'install_friendlier_regime', side: MOTIVE_SIDE.install_friendlier_regime, score: round4(if_.score), receipt: if_.receipt },
    { motive: 'protect_investment', side: MOTIVE_SIDE.protect_investment, score: round4(pi.score), receipt: pi.receipt },
    { motive: 'kinship', side: ki.side, score: round4(ki.score), receipt: ki.receipt },
    { motive: 'denial', side: de.side, score: round4(de.score), receipt: de.receipt },
  ];
  let best = null;
  for (const row of breakdown) {
    if (row.score <= 0 || !row.side) continue;
    if (!best || row.score > best.score) best = row; // MOTIVE_TYPES order is the stable tiebreak
  }
  return best
    ? { motive: best.motive, side: best.side, score: best.score, receipt: best.receipt, breakdown }
    : { motive: null, side: null, score: 0, receipt: '', breakdown };
}

// ── Feasibility + the loaded-dice initiation (design §H) ────────────────────────────
/**
 * The feasibility read (design §2 overextension/opposition): the patron's projectable
 * strength vs the strongest opposing force already committed. 1 = unopposed & strong;
 * → 0 as opposition or overextension bites. Bounded ≥ 0.
 * @param {{ patronStrength01?: number, opposingStrength01?: number }} inputs @returns {number}
 */
export function interventionFeasibility({ patronStrength01 = 0.5, opposingStrength01 = 0 } = {}) {
  const mine = clamp01(num(patronStrength01, 0.5));
  const foe = clamp01(num(opposingStrength01, 0));
  // A simple bounded ratio: my strength discounted by the opposition already present.
  const feas = clamp01(mine * (1 - 0.6 * foe));
  return round4(feas);
}

/**
 * The situation-weighted INITIATION PULL ∈ [0,1] — the loaded-dice weight (best motive ×
 * feasibility). Below FEASIBILITY_FLOOR feasibility the pull is 0 (the operation aborts).
 * @param {{ motiveScore01?: number, feasibility01?: number }} inputs @returns {number}
 */
export function initiationPull({ motiveScore01 = 0, feasibility01 = 0 } = {}) {
  const motive = clamp01(num(motiveScore01, 0));
  const feas = clamp01(num(feasibility01, 0));
  if (motive < CONVERGENCE_TUNING.MOTIVE_FLOOR) return 0;
  if (feas < CONVERGENCE_TUNING.FEASIBILITY_FLOOR) return 0;
  return round4(clamp01(motive * feas));
}

/**
 * The loaded-dice DECISION (design §H — the corruptionWeb INITIATE_BASE idiom): a draw u
 * initiates iff u < INITIATE_BASE × pull². A rare, deferral-visible event. Pure.
 * @param {number} pull the initiation pull ∈ [0,1] @param {number} u the roll ∈ [0,1)
 * @returns {boolean}
 */
export function shouldInitiateIntervention(pull, u) {
  const p = clamp01(num(pull, 0));
  const roll = clamp01(num(u, 1));
  return roll < CONVERGENCE_TUNING.INITIATE_BASE * p * p;
}

// ── Invited / uninvited legitimacy (design §2) ──────────────────────────────────────
/**
 * The legitimacy price an intervention pays. Propping an INCUMBENT at request
 * (invited) is legitimacy-cheap; backing a CHALLENGER (never invited by the seat) is
 * casus-generative and raises the region's encirclement read. Returns the cost + the
 * casus-generative flag. @param {{ side?: string, invited?: boolean }} inputs
 * @returns {{ legitimacyCost: number, casusGenerative: boolean, receipt: string }}
 */
export function interventionLegitimacy({ side = INTERVENTION_SIDES.CHALLENGER, invited = false } = {}) {
  const T = CONVERGENCE_TUNING;
  // Only an incumbent-prop can be invited; backing a challenger is uninvited by nature.
  const trulyInvited = invited && side === INTERVENTION_SIDES.INCUMBENT;
  const cost = trulyInvited ? T.LEGIT_COST_INVITED : T.LEGIT_COST_UNINVITED;
  const casusGenerative = !trulyInvited;
  return {
    legitimacyCost: round4(cost),
    casusGenerative,
    receipt: trulyInvited
      ? 'Called in by the rightful seat — the neighbors read a friend answering, not an aggressor.'
      : 'An army sent to raise up rebels — every neighbor now reads a ring tightening, and arms.',
  };
}

// ── The coup TILT (design §2 — the warSentimentAdj precedent) ───────────────────────
/**
 * The signed, bounded interventionAdj for a contested settlement: sum over the present
 * (surviving) interveners of ±PHOLD_WEIGHT × strengthShare, where an INCUMBENT-backer is
 * + (raises pHold) and a CHALLENGER-backer is − (lowers it). Returns 0 with no records
 * ⇒ byte-identical (resolveCoupVerdict adds 0). The final value is bounded by
 * resolveCoupVerdict's own [0.1, 0.9] clamp; this term is additionally soft-bounded here
 * to ±PHOLD_WEIGHT so a swarm of token columns can't run it away.
 * @param {Array<{ side: string, strengthShare01?: number }>} records @returns {number}
 */
export function interventionTilt(records) {
  if (!Array.isArray(records) || !records.length) return 0;
  const W = CONVERGENCE_TUNING.PHOLD_WEIGHT;
  let signed = 0;
  for (const r of records) {
    const share = clamp01(num(r?.strengthShare01, 0));
    if (share <= 0) continue;
    if (r.side === INTERVENTION_SIDES.INCUMBENT) signed += share;
    else if (r.side === INTERVENTION_SIDES.CHALLENGER) signed -= share;
  }
  // Soft-bound the net share to ±1 so the term stays within ±PHOLD_WEIGHT.
  const bounded = Math.max(-1, Math.min(1, signed));
  return round4(W * bounded);
}

// ── Installed-regime obligation (design §2 — the predatory-patron mint) ─────────────
/**
 * The obligation a successful challenger-intervention mints: the installed regime OWES
 * its patron, leverage-weighted (obligationMintMagnitude — the predatory idiom). Returns
 * a mint descriptor for foldObligations (from → the installed target, to → the patron,
 * kind:'intervention'). Leverage scales with the patron's grip/motive intensity.
 * @param {{ patronId: string, targetId: string, leverage01?: number }} inputs
 * @returns {{ from: string, to: string, kind: string, magnitude: number, predatory: boolean }}
 */
export function interventionObligationMint({ patronId, targetId, leverage01 = 0 }) {
  const T = CONVERGENCE_TUNING;
  const lev = clamp01(num(leverage01, 0)) * T.OBLIGATION_LEVERAGE_MAX;
  const magnitude = obligationMintMagnitude({ baseMagnitude01: T.OBLIGATION_BASE_MAG, leverageIntent01: lev });
  return { from: String(targetId), to: String(patronId), kind: 'intervention', magnitude, predatory: lev > 0.5 };
}

// ── Proxy-stays-proxy: foreign_clash detection (design §2/§4) ───────────────────────
/**
 * Detect a sponsors' CLASH: two interveners at the same contested target backing OPPOSING
 * sides are minting their `foreign_clash` casus BETWEEN the sponsors — but PROXY STAYS
 * PROXY: this returns the clashing pairs for the reasons machinery, never an auto-declared
 * war (the reasons layer decides escalation). Deterministic codepoint-sorted pairs.
 * @param {Array<{ interId: string, side: string }>} records @returns {Array<{ a: string, b: string }>}
 */
export function foreignClashes(records) {
  if (!Array.isArray(records) || records.length < 2) return [];
  const inc = records.filter((r) => r.side === INTERVENTION_SIDES.INCUMBENT).map((r) => String(r.interId));
  const cha = records.filter((r) => r.side === INTERVENTION_SIDES.CHALLENGER).map((r) => String(r.interId));
  /** @type {Array<{ a: string, b: string }>} */
  const out = [];
  for (const x of inc.sort(codepoint)) {
    for (const y of cha.sort(codepoint)) {
      const [a, b] = [x, y].sort(codepoint);
      if (a !== b) out.push({ a, b });
    }
  }
  return out.sort((p, q) => codepoint(p.a, q.a) || codepoint(p.b, q.b));
}

// ── The ledger (dormant-safe: drop-when-empty) ──────────────────────────────────────
/**
 * @typedef {Object} InterventionRecord
 * @property {string} interId  the intervening (patron) settlement id
 * @property {string} target   the contested settlement id
 * @property {string} side     'incumbent' | 'challenger'
 * @property {string} motive   a MOTIVE_TYPES value
 * @property {boolean} invited  true iff an incumbent-prop the seat requested
 * @property {number} strength  aggregate effective strength (a number)
 * @property {number} sinceTick the tick the column committed
 * @property {number} lastTick  the tick this record last advanced
 */

/** The live interventions ledger keyed `<interId>:<target>`, or null when absent/dormant.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {Record<string, InterventionRecord> | null} */
export function interventionLedger(worldState) {
  const raw = asObject(getSpatialLedger(worldState, 'interventions'));
  const keys = Object.keys(raw);
  if (!keys.length) return null;
  /** @type {Record<string, InterventionRecord>} */
  const out = {};
  for (const k of keys) {
    const r = asObject(raw[k]);
    if (!r.interId || !r.target) continue;
    out[k] = {
      interId: String(r.interId),
      target: String(r.target),
      side: r.side === INTERVENTION_SIDES.INCUMBENT ? INTERVENTION_SIDES.INCUMBENT : INTERVENTION_SIDES.CHALLENGER,
      motive: String(r.motive || ''),
      invited: r.invited === true,
      strength: Math.max(0, num(r.strength, 0)),
      sinceTick: Math.max(0, Math.floor(num(r.sinceTick, 0))),
      lastTick: Math.max(0, Math.floor(num(r.lastTick, 0))),
    };
  }
  return Object.keys(out).length ? out : null;
}

/** The intervention records committed against a given target (codepoint-sorted keys).
 * @param {Record<string, InterventionRecord> | null} ledger @param {string} targetId
 * @returns {InterventionRecord[]} */
export function recordsForTarget(ledger, targetId) {
  if (!ledger) return [];
  const id = String(targetId);
  return Object.keys(ledger).sort(codepoint).map((k) => ledger[k]).filter((r) => r.target === id);
}

/**
 * The interventionAdj a coup verdict at `saveId` reads (design §2). Sums the present
 * interveners' signed strength-shares into interventionTilt. 0 when dormant / no records
 * ⇒ resolveCoupVerdict is byte-identical. The share is each intervener's strength over
 * the total intervener strength at the target (a token column barely tilts).
 * @param {{ simulationRules?: unknown, spatialLedgers?: unknown } | null | undefined} worldState @param {string} saveId
 * @returns {number}
 */
export function interventionAdjFor(worldState, saveId) {
  if (!interventionActive(worldState)) return 0;
  const ledger = interventionLedger(worldState);
  const recs = recordsForTarget(ledger, saveId);
  if (!recs.length) return 0;
  const total = recs.reduce((s, r) => s + Math.max(0, r.strength), 0);
  if (total <= 0) return 0;
  const shares = recs.map((r) => ({ side: r.side, strengthShare01: r.strength / total }));
  return interventionTilt(shares);
}

// ── Live derivation (the snapshot reads that feed the pure scorers) ─────────────────
/** The relationship neighbors of a settlement from the edge list, codepoint-sorted, with
 *  the edge's relationship type (for hostility/affinity reads — the hostileNeighborsOf
 *  idiom). @param {Array<Record<string, unknown>>} edges @param {string} id
 *  @returns {Array<{ otherId: string, relType: string }>} */
function neighborsOf(edges, id) {
  const self = String(id);
  /** @type {Array<{ otherId: string, relType: string }>} */
  const out = [];
  for (const e of Array.isArray(edges) ? edges : []) {
    const from = String(e?.from ?? '');
    const to = String(e?.to ?? '');
    if (from !== self && to !== self) continue;
    out.push({ otherId: from === self ? to : from, relType: String(e?.relationshipType ?? e?.relType ?? '') });
  }
  return out.sort((a, b) => codepoint(a.otherId, b.otherId));
}

const HOSTILE_REL = new Set(['hostile', 'cold_war', 'rival', 'criminal_network']);
const FRIENDLY_REL = new Set(['ally', 'trade_partner', 'vassal', 'tributary', 'protectorate']);

/** The 0..1 prosperity/strength proxy for a patron (the fundingOf idiom — economic
 *  capacity as the projectable-strength stand-in in wave 1). @param {any} snapshot @param {string} id */
function patronStrength01Of(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  const score = item?.causal?.scores?.economic_capacity;
  return Number.isFinite(score) ? clamp01(Number(score) / 100) : 0.5;
}

/**
 * Gather the live motive inputs for a (patron, target) pair from the snapshot + world
 * state — the reads that feed the pure scorers. Belief-free (a physical operation).
 * @param {any} snapshot @param {any} worldState @param {string} patronId @param {string} targetId
 * @param {string} relType @param {string|null} sponsorId @param {string|null} rivalSide @param {number} rivalStrength01
 * @returns {Record<string, unknown>}
 */
function motiveInputsFor(snapshot, worldState, patronId, targetId, relType, sponsorId, rivalSide, rivalStrength01) {
  const hostile01 = HOSTILE_REL.has(relType) ? 1 : 0;
  const friendly = FRIENDLY_REL.has(relType);
  return {
    // preserve_order
    foreignGrip01: foreignGripOf(worldState, snapshot, patronId),
    treatyWithIncumbent: friendly,
    // install_friendlier_regime — the birth-stamped sponsor is the challenger's backer;
    // a corruption lever toward the target is the puppet string (directionBias).
    hostile01,
    challengerAffinity01: String(patronId) === String(sponsorId) ? 0.6 : 0,
    leashOnChallenger01: directionBias(worldState, snapshot, targetId, patronId),
    // protect_investment — the target owes the patron (a debtor's regime is collateral).
    obligationDebt01: obligationDebt01(worldState, targetId, patronId),
    tradeDependence01: friendly ? 0.5 : 0,
    // kinship — §G ties are a later seam; wave 1 leaves them 0 (documented).
    kinshipIncumbent01: 0,
    kinshipChallenger01: 0,
    // denial — a rival already committed to one side.
    rivalSide,
    rivalStrength01,
  };
}

/** The live coup contests this tick: brewing (unresolved) coup_detat stressors with a
 *  contested settlement that still has a live coup field. @param {any} worldState @param {any} snapshot
 *  @returns {Array<{ targetId: string, sponsorId: string|null }>} */
function liveCoupContests(worldState, snapshot) {
  const stressors = Array.isArray(worldState?.stressors) ? worldState.stressors : [];
  /** @type {Array<{ targetId: string, sponsorId: string|null }>} */
  const out = [];
  const seen = new Set();
  for (const s of stressors) {
    if (s?.type !== 'coup_detat') continue;
    if (s?.resolutionReason) continue; // a directed resolution ends the coup — no verdict window
    const targetId = String(s.originSettlementId || (s.affectedSettlementIds || [])[0] || '');
    if (!targetId || seen.has(targetId)) continue;
    const entry = snapshot?.byId?.get?.(targetId);
    if (!entry?.settlement) continue;
    const { challengers } = coupContenders(entry.settlement);
    if (!challengers.length) continue; // no live field to intervene in
    seen.add(targetId);
    const sponsorId = s?.originContext?.sponsorSettlementId != null ? String(s.originContext.sponsorSettlementId) : null;
    out.push({ targetId, sponsorId });
  }
  return out.sort((a, b) => codepoint(a.targetId, b.targetId));
}

/**
 * Advance the intervention layer one tick (design §2). DORMANT (gate absent) ⇒
 * { worldState, changed:false, newsEntries:[] } — byte-identical. When lit: for every
 * live coup contest, every eligible foreign neighbor computes its best MOTIVE, the
 * loaded-dice initiation fires or defers (deferral-visible), and a hit commits an
 * intervention record to the isolated `interventions` ledger. Success/obligation minting
 * happens at the coup VERDICT (coup.js reads interventionAdjFor); this pass is the
 * COMMITMENT of columns to a live contest.
 *
 * @param {Object} args
 * @param {any} args.snapshot @param {any} args.worldState @param {any} [args.graph] @param {any} args.rng
 * @param {number} args.tick @param {string|null} [args.now]
 * @returns {{ worldState: any, changed: boolean, newsEntries: Array<Record<string, unknown>>, deferrals: Array<Record<string, unknown>> }}
 */
export function advanceIntervention({ snapshot, worldState, graph = null, rng, tick, now = null }) {
  if (!interventionActive(worldState)) {
    return { worldState, changed: false, newsEntries: [], deferrals: [] };
  }
  const nowTick = Math.max(0, Math.floor(num(tick, 0)));
  // Relationship edges: the graph the war layer reads, falling back to the snapshot
  // (the hostileNeighborsOf source order).
  const edges = (graph && Array.isArray(graph.edges)) ? graph.edges
    : (snapshot?.regionalGraph?.edges || snapshot?.relationships || []);
  const rules = /** @type {Record<string, unknown>} */ (asObject(worldState.simulationRules));
  // The authority consult (design §4): under legacy routine/full ⇒ 'auto' (the mover
  // mints directly); under a DM-driven mode ⇒ 'proposal' ⇒ DEFER (visible, no mint) —
  // the corruptionWeb deferral-not-denial idiom. The full proposal-queue re-mint is
  // W-COMPOSER-2 (documented deferral).
  const applyMode = authorityFor(rules, 'intervention_ordered', 'auto');
  const deferForApproval = applyMode !== 'auto';

  const prior = interventionLedger(worldState);
  /** @type {Record<string, InterventionRecord>} */
  const next = {};
  if (prior) for (const k of Object.keys(prior)) next[k] = prior[k];
  // A settlement already holding a live deployment (besieging) cannot ALSO intervene
  // (the one-army law, honored at derivation).
  const deployments = asObject(worldState.deployments);
  const busy = new Set(Object.keys(deployments));

  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Array<Record<string, unknown>>} */
  const deferrals = [];
  let mutated = false;

  const contests = liveCoupContests(worldState, snapshot);
  const liveTargets = new Set(contests.map((c) => c.targetId));

  // ── AFTERMATH (design §2 consequences): a record whose contest has RESOLVED goes home.
  // A CHALLENGER-backer whose side PREVAILED (the target now carries a fresh
  // government_overthrown condition) leaves the INSTALLED REGIME OWING its patron — the
  // predatory obligation mint (kind:'intervention', leverage-weighted by the patron's grip).
  /** @type {Array<{ from: string, to: string, kind: string, magnitude: number, predatory: boolean, mintTick: number, lastTick: number }>} */
  const obligationMints = [];
  for (const k of Object.keys(next).sort(codepoint)) {
    const rec = next[k];
    if (liveTargets.has(rec.target)) continue; // still contested — no aftermath yet
    delete next[k];
    mutated = true;
    if (rec.side === INTERVENTION_SIDES.CHALLENGER && coupFellAt(snapshot, rec.target, rec.sinceTick)) {
      const leverage01 = foreignGripOf(worldState, snapshot, rec.interId);
      // mintTick/lastTick are stamped by foldObligations from `now`; carry placeholders
      // so the descriptor satisfies the ObligationRecord mint type.
      obligationMints.push({ ...interventionObligationMint({ patronId: rec.interId, targetId: rec.target, leverage01 }), mintTick: nowTick, lastTick: nowTick });
    }
  }

  for (const { targetId, sponsorId } of contests) {
    // Rival tracking within this target (denial): who already backs which side.
    const already = recordsForTarget(prior, targetId);

    // Evaluate every eligible candidate patron; keep the target's STRONGEST suitor this
    // tick (highest pull, codepoint tiebreak). One loaded-dice roll per target per tick —
    // the design fork key `intervene:<target>:<tick>` (at most one new column commits per
    // contest per tick; interventions accrue over ticks, never a same-tick swarm).
    /** @type {{ patronId: string, relType: string, side: string, motive: string, receipt: string, chosen: ReturnType<typeof scoreMotives>, pull: number, patronStrength01: number } | null} */
    let best = null;
    for (const { otherId: patronId, relType } of neighborsOf(edges, targetId)) {
      if (patronId === targetId) continue;
      if (busy.has(patronId)) continue; // one-army law
      const key = `${patronId}:${targetId}`;
      if (next[key]) continue; // already intervening here

      // Denial read: the strongest rival already committed (opposite side is the target).
      let rivalSide = null; let rivalStrength01 = 0;
      for (const r of already) {
        const s = clamp01(r.strength / 100);
        if (s > rivalStrength01) { rivalStrength01 = s; rivalSide = r.side; }
      }
      const inputs = motiveInputsFor(snapshot, worldState, patronId, targetId, relType, sponsorId, rivalSide, rivalStrength01);
      const chosen = scoreMotives(inputs);
      if (!chosen.motive || !chosen.side) continue;

      // Feasibility + the loaded-dice pull.
      const patronStrength01 = patronStrength01Of(snapshot, patronId);
      const opposing = already.filter((r) => r.side !== chosen.side).reduce((m, r) => Math.max(m, clamp01(r.strength / 100)), 0);
      const feasibility01 = interventionFeasibility({ patronStrength01, opposingStrength01: opposing });
      const pull = initiationPull({ motiveScore01: chosen.score, feasibility01 });
      if (pull <= 0) continue;

      if (!best || pull > best.pull || (pull === best.pull && patronId < best.patronId)) {
        // chosen.side/motive are narrowed to string by the guard above; capture them so
        // the strict typechecker keeps that narrowing on the escaping `best` object.
        best = { patronId, relType, side: chosen.side, motive: chosen.motive, receipt: chosen.receipt, chosen, pull, patronStrength01 };
      }
    }
    if (!best) continue;

    if (deferForApproval) {
      deferrals.push({ patronId: best.patronId, targetId, motive: best.motive, side: best.side, reason: 'dm_approval' });
      continue;
    }

    // THE LOADED DICE (design §H): u < INITIATE_BASE × pull².
    const fork = rng && typeof rng.fork === 'function' ? rng.fork(`intervene:${targetId}:${nowTick}`) : null;
    const u = fork && typeof fork.random === 'function' ? clamp01(num(fork.random(), 1)) : 1;
    if (!shouldInitiateIntervention(best.pull, u)) {
      deferrals.push({ patronId: best.patronId, targetId, motive: best.motive, side: best.side, reason: 'loaded_dice_deferred' });
      continue;
    }

    // COMMIT: an incumbent-prop is invited iff a friendly treaty binds them.
    const invited = best.side === INTERVENTION_SIDES.INCUMBENT && FRIENDLY_REL.has(best.relType);
    const legit = interventionLegitimacy({ side: best.side, invited });
    const strength = round4(Math.max(1, best.patronStrength01 * 100));
    next[`${best.patronId}:${targetId}`] = {
      interId: best.patronId, target: targetId, side: best.side, motive: best.motive,
      invited, strength, sinceTick: nowTick, lastTick: nowTick,
    };
    mutated = true;
    newsEntries.push(interventionNews({ patronId: best.patronId, targetId, chosen: best.chosen, legit, snapshot, tick: nowTick, now }));
  }

  if (!mutated && !obligationMints.length) {
    return { worldState, changed: false, newsEntries: [], deferrals };
  }
  const hasRecords = Object.keys(next).length > 0;
  let nextWorldState = hasRecords
    ? setSpatialLedger(worldState, 'interventions', next)
    : dropSpatialLedger(worldState, 'interventions');
  // Mint the installed-regime obligations (only when a challenger-intervention prevailed).
  if (obligationMints.length) {
    const priorObligations = /** @type {Record<string, unknown> | null} */ (getSpatialLedger(nextWorldState, 'obligations') || null);
    const folded = foldObligations(priorObligations, { mints: obligationMints, now: nowTick });
    nextWorldState = folded
      ? setSpatialLedger(nextWorldState, 'obligations', folded)
      : dropSpatialLedger(nextWorldState, 'obligations');
  }
  return { worldState: nextWorldState, changed: true, newsEntries, deferrals };
}

/** Did the coup at `targetId` FALL (challenger prevailed) at/after `sinceTick`? Read from
 *  the target's activeConditions (a fresh government_overthrown from the coup verdict).
 *  @param {any} snapshot @param {string} targetId @param {number} sinceTick @returns {boolean} */
function coupFellAt(snapshot, targetId, sinceTick) {
  const entry = snapshot?.byId?.get?.(String(targetId));
  const conditions = entry?.settlement?.activeConditions || [];
  for (const c of conditions) {
    const arch = c?.archetype || c?.condition?.archetype;
    if (arch !== 'government_overthrown') continue;
    const at = num(c?.triggeredAt?.tick ?? c?.tick, -1);
    if (at >= num(sinceTick, 0)) return true;
  }
  return false;
}

/**
 * The 0..1 foreign_clash intensity between two sponsors `aId`/`bId` (design §2/§4): they
 * clash iff they back OPPOSING sides at a shared contested target. Intensity scales with
 * their committed strengths. 0 when dormant / no shared target ⇒ byte-identical (the war-
 * reasons scorer stays silent). Symmetric in the pair.
 * @param {{ simulationRules?: unknown, spatialLedgers?: unknown } | null | undefined} worldState @param {string} aId @param {string} bId
 * @returns {number}
 */
export function foreignClashIntensityOf(worldState, aId, bId) {
  if (!interventionActive(worldState)) return 0;
  const ledger = interventionLedger(worldState);
  if (!ledger) return 0;
  const a = String(aId); const b = String(bId);
  /** @type {Map<string, InterventionRecord>} */
  const byTargetA = new Map();
  /** @type {Map<string, InterventionRecord>} */
  const byTargetB = new Map();
  for (const k of Object.keys(ledger).sort(codepoint)) {
    const r = ledger[k];
    if (r.interId === a) byTargetA.set(r.target, r);
    else if (r.interId === b) byTargetB.set(r.target, r);
  }
  let intensity = 0;
  for (const [target, ra] of byTargetA) {
    const rb = byTargetB.get(target);
    if (!rb) continue;
    if (ra.side === rb.side) continue; // same side — allies, not a clash
    const s = clamp01(Math.min(ra.strength, rb.strength) / 100);
    if (s > intensity) intensity = s;
  }
  return round4(intensity);
}

/** The display name for an id. @param {any} snapshot @param {string} id @returns {string} */
function nameOf(snapshot, id) {
  const item = snapshot?.byId?.get?.(String(id));
  return item?.name || item?.settlement?.name || String(id);
}

/** A regional wizard-news entry for a committed intervention (house voice, AGGREGATE —
 *  no npc named). Carries the typed motive (design §5 legibility). @param {any} args */
function interventionNews({ patronId, targetId, chosen, legit, snapshot, tick, now }) {
  const patron = nameOf(snapshot, patronId);
  const target = nameOf(snapshot, targetId);
  const sideWord = chosen.side === INTERVENTION_SIDES.INCUMBENT ? 'to prop the seat' : 'to raise the challengers';
  return {
    id: `wizard_news.${tick}.intervention.${patronId}.${targetId}`,
    tick,
    scope: 'regional',
    significance: 'notable',
    score: 64,
    headline: `${patron}'s banners march on ${target}'s succession`,
    summary: `${patron} threw an army into ${target}'s contest ${sideWord}. ${chosen.receipt}`,
    kind: 'applied',
    impactKind: 'intervention',
    channelType: null,
    severity: 0.6,
    settlementIds: [String(patronId), String(targetId)],
    impactIds: [],
    channelIds: [],
    sourceEventId: `intervention.${patronId}.${targetId}.${tick}`,
    tags: legit.casusGenerative
      ? ['world_pulse', 'war', 'intervention', chosen.motive, 'casus_generative']
      : ['world_pulse', 'war', 'intervention', chosen.motive],
    reasons: [chosen.receipt, legit.receipt].filter(Boolean),
    createdAt: now,
  };
}

// ── Verb factory (registrable shape — NOT registered; W-COMPOSER-2 lift) ─────────────
/**
 * The ORDER_INTERVENTION verb in affordance entry-factory shape (design §5/§7). Ships
 * registrable but is NOT registered into the settlement-scoped manifest — the realm-
 * manifest lift takes it with the peace/doctrine verbs (the declareCasus precedent).
 * @returns {Record<string, unknown>}
 */
export function orderInterventionVerbFactory() {
  return Object.freeze({
    verb: 'ORDER_INTERVENTION',
    scope: 'realm',
    candidateType: 'intervention_ordered',
    dials: Object.freeze({ side: ['incumbent', 'challenger'], invited: [true, false] }),
    registered: false,
    note: 'Registrable shape; realm-manifest registration is W-COMPOSER-2.',
  });
}

