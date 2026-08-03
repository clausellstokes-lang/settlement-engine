/**
 * domain/worldPulse/peaceTermsAppraisal.js — §15 THE VICTOR'S OWN LENS.
 *
 * Who won at the table, what the win is worth, what the loser's portfolio is
 * worth to THIS victor, and how well the victor can see whether the terms are
 * being kept. Every read is BELIEF-sourced, never truth (§15.1): a fog-deceived
 * victor over- or under-spends its budget and misprices the prize, and a distant
 * one cannot detect the cheat (§12.2). Pure and deterministic — no rng.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4).
 */
import { clamp01 } from '../../kernel/math.js';
import { readBeliefStrength, governingCoalition } from './beliefMap.js';
import { evil01 } from './deityAxes.js';
// D7 THE REFRAME LAYER (DESIGN_SIM_DEPTH_R2 §D7, consumer 2): a victor's dark-aid reframe of the
// loser (the reframed debt claim, restitutionClaim01) pushes a restitution asset — the reframed
// claim priced + settleable through the EXISTING terms machinery (real goods move only here,
// conservation untouched). reframeKernel is a pure leaf. 0 when dark ⇒ no asset ⇒ byte-identical.
import { restitutionClaim01 } from './reframeKernel.js';
import { PEACE_TERMS_TUNING, CLASS_TERM } from './peaceTermsCatalog.js';
import { round4, finite01OrNull } from './peaceTermsPrimitives.js';

/** @typedef {import('./peaceTermsCatalog.js').AssetClass} AssetClass */
/** @typedef {import('./peaceTermsCatalog.js').AppraisedAsset} AppraisedAsset */

/**
 * The victor's OWN believed lead over a foe: believed(self) − believed(foe),
 * both through readBeliefStrength (self reads truth; the foe reads BELIEF).
 * @param {string} selfId @param {string} foeId
 * @param {Record<string, unknown>} worldState
 * @param {(id: string) => number} truthFor
 * @returns {number}
 */
export function believedAdvantage(selfId, foeId, worldState, truthFor) {
  return believedAdvantageFromInputs(
    readBeliefStrength(selfId, selfId, worldState, truthFor(selfId)),
    readBeliefStrength(selfId, foeId, worldState, truthFor(foeId)),
  );
}

/**
 * The terms evaluator's input-only strength leaf. WR-7b calls this once for
 * each frozen negotiating picture; the historic adapter above supplies the
 * same two belief reads and therefore retains byte-exact dark behavior.
 * @param {number} believedSelfStrength @param {number} believedFoeStrength
 * @returns {number}
 */
export function believedAdvantageFromInputs(believedSelfStrength, believedFoeStrength) {
  return believedSelfStrength - believedFoeStrength;
}

/**
 * Determine the victor + loser of a peace between A and B by BELIEVED advantage
 * (§15: strength decides terms, from belief not truth). The victor is the party
 * whose own belief map ranks its lead higher; codepoint tiebreak on an exact tie
 * (which is the dormant-belief case — both read truth, so the tie breaks to the
 * materially stronger side). Returns the victor's believed margin over the loser.
 * @param {string} a @param {string} b
 * @param {Record<string, unknown>} worldState
 * @param {(id: string) => number} truthFor
 * @returns {{ victorId: string, loserId: string, believedMargin: number }}
 */
export function resolveVictor(a, b, worldState, truthFor) {
  const advA = believedAdvantage(a, b, worldState, truthFor);
  const advB = believedAdvantage(b, a, worldState, truthFor);
  const aWins = advA > advB || (advA === advB && a <= b);
  const victorId = aWins ? a : b;
  const loserId = aWins ? b : a;
  return { victorId, loserId, believedMargin: believedAdvantage(victorId, loserId, worldState, truthFor) };
}

/**
 * Mint the TERM BUDGET from the victor's believed margin (§15). Normalized to
 * 0..1 against BUDGET_MARGIN_SCALE, then scaled to BUDGET_MAX. A margin at/below
 * CLEAN_EXIT_FLOOR is a WHITE PEACE — zero budget, no extraction.
 * @param {number} believedMargin @returns {{ margin01: number, budget: number, whitePeace: boolean }}
 */
export function termBudgetFor(believedMargin) {
  const margin01 = clamp01((Number(believedMargin) || 0) / PEACE_TERMS_TUNING.BUDGET_MARGIN_SCALE);
  if (margin01 <= PEACE_TERMS_TUNING.CLEAN_EXIT_FLOOR) {
    return { margin01, budget: 0, whitePeace: true };
  }
  return { margin01, budget: round4(margin01 * PEACE_TERMS_TUNING.BUDGET_MAX), whitePeace: false };
}

/** The §4 magnanimity press: a good-aligned victor asks light (~0.6), an evil one
 *  presses hard (~1.4). Scales both magnitude and duration.
 *  @param {Record<string, unknown> | null | undefined} victorItem @returns {number} */
export function alignmentPress(victorItem) {
  const deity = readDeitySnapshot(victorItem);
  return alignmentPressFromInput(evil01(deity));
}

/**
 * Input-only alignment leaf for a frozen negotiating picture. The coordinate
 * is the same 0..1 malice axis used by the existing deity adapter.
 * @param {number} evilCoordinate @returns {number}
 */
export function alignmentPressFromInput(evilCoordinate) {
  return PEACE_TERMS_TUNING.PRESS_BASE
    + PEACE_TERMS_TUNING.PRESS_EVIL_W * clamp01(evilCoordinate);
}

/** @param {unknown} item @returns {Record<string, unknown> | null} */
function readDeitySnapshot(item) {
  const cfg = /** @type {{ settlement?: { config?: { primaryDeitySnapshot?: Record<string, unknown> | null } } }} */ (item);
  return cfg?.settlement?.config?.primaryDeitySnapshot || null;
}

/** The loser's named exports (normalized to strings), for the resource-share appraisal.
 *  @param {unknown} item @returns {string[]} */
function loserExports(item) {
  const econ = /** @type {{ settlement?: { economicState?: { primaryExports?: unknown } } }} */ (item);
  const raw = econ?.settlement?.economicState?.primaryExports;
  if (!Array.isArray(raw)) return [];
  /** @type {string[]} */
  const out = [];
  for (const e of raw) {
    const name = typeof e === 'string' ? e : (e && typeof e === 'object' ? String(/** @type {{ name?: unknown }} */ (e).name || '') : '');
    if (name) out.push(name);
  }
  return out.sort();
}

// ── The prize ranking (§15.1 — the victor asks for what IT values) ───────────

/**
 * Appraise the LOSER'S portfolio through the VICTOR'S OWN lens (§15.1). Every
 * value is the victor's need (its scarcity / threat / archetype) × the loser's
 * BELIEVED holding (readBeliefStrength — a fog-deceived victor misprices). Returns
 * the classes ranked value-desc (codepoint tiebreak) — the caller drafts the top-N.
 * @param {{ victorId: string, loserId: string, worldState: Record<string, unknown>,
 *           victorItem: unknown, loserItem: unknown,
 *           victorPressure: { food?: number, economy?: number, trade?: number },
 *           victorThreat01: number, loserTruthStrength: number,
 *           loserAllyStrength01: number }} args
 * @returns {AppraisedAsset[]}
 */
export function appraiseLoserPortfolio(args) {
  const {
    victorId, loserId, worldState, victorItem, loserItem,
    victorPressure, victorThreat01, loserTruthStrength, loserAllyStrength01,
  } = args;

  // The victor's BELIEF of the loser's wealth/strength (never truth) — the fog
  // that lets a deceived victor over- or under-value the prize.
  const believedLoserStrength = readBeliefStrength(victorId, loserId, worldState, loserTruthStrength);
  const archetype = String(governingCoalition(/** @type {import('./beliefMap.js').SnapItem} */ (victorItem)).governing || '');
  return appraiseLoserPortfolioFromInputs({
    believedLoserStrength,
    victorFoodPressure01: clamp01(Number(victorPressure?.food) || 0),
    victorEconomyPressure01: clamp01(Number(victorPressure?.economy) || 0),
    victorTradePressure01: clamp01(Number(victorPressure?.trade) || 0),
    victorThreat01: clamp01(victorThreat01),
    loserAllyStrength01: clamp01(loserAllyStrength01),
    loserExports: loserExports(loserItem),
    victorArchetype: archetype,
    restitutionClaim01: restitutionClaim01(worldState, victorId, loserId),
  });
}

/**
 * Input-only §15 appraisal leaf. A caller may pass `null` for an observation it
 * does not possess; the affected asset is then omitted instead of silently
 * treating ignorance as a neutral or zero fact. The legacy adapter above passes
 * every historic numeric fallback explicitly, preserving its exact behavior.
 *
 * @param {{ believedLoserStrength:number|null,
 *   victorFoodPressure01:number|null, victorEconomyPressure01:number|null,
 *   victorTradePressure01:number|null, victorThreat01:number|null,
 *   loserAllyStrength01:number|null, loserExports:string[]|null,
 *   victorArchetype:string|null, restitutionClaim01:number|null }} args
 * @returns {AppraisedAsset[]}
 */
export function appraiseLoserPortfolioFromInputs(args) {
  const believedLoserStrength = finite01OrNull(args.believedLoserStrength);
  const foodPressure = finite01OrNull(args.victorFoodPressure01);
  const economyPressure = finite01OrNull(args.victorEconomyPressure01);
  const tradePressure = finite01OrNull(args.victorTradePressure01);
  const threat = finite01OrNull(args.victorThreat01);
  const allyStrength = finite01OrNull(args.loserAllyStrength01);
  const restitution = finite01OrNull(args.restitutionClaim01);
  const exports = Array.isArray(args.loserExports)
    ? [...args.loserExports].map(String).filter(Boolean).sort()
    : null;
  const archetype = typeof args.victorArchetype === 'string'
    ? args.victorArchetype
    : null;
  if (believedLoserStrength == null || archetype == null) return [];

  const believedWealth01 = clamp01(believedLoserStrength / PEACE_TERMS_TUNING.WEALTH_SCALE);
  const econScarcity = foodPressure == null || economyPressure == null
    ? null
    : clamp01(0.6 * foodPressure + 0.4 * economyPressure);
  const tradeScarcity = tradePressure;
  const tilt = archetypeTilt(archetype);

  /** @type {AppraisedAsset[]} */
  const assets = [];
  const push = (/** @type {AssetClass} */ assetClass, /** @type {number} */ value, /** @type {string} */ good) => {
    const termType = assetClass === 'export_flows' && exports.length === 0 ? 'tribute' : CLASS_TERM[assetClass];
    /** @type {AppraisedAsset} */
    const a = { assetClass, termType, value: round4(clamp01(value)) };
    if (good) a.good = good;
    assets.push(a);
  };

  // ECONOMIC — the iron-starved / trade-poor victor ranks the loser's flows first.
  if (econScarcity != null && exports != null) {
    push('export_flows', (0.4 + econScarcity) * believedWealth01 * (exports.length ? 1.15 : 0.85) * tilt.economic, exports[0] || '');
  }
  if (econScarcity != null) push('treasury', (0.35 + econScarcity) * believedWealth01 * tilt.economic, '');
  // MILITARY GEOGRAPHY — the threatened victor ranks the loser's arms + ground.
  if (threat != null) {
    push('military_posture', (0.3 + threat) * believedWealth01 * tilt.military, '');
    push('territory', (0.2 + threat) * believedWealth01 * 0.9 * tilt.military, '');
  }
  // THE LOSER'S ALLIANCE NETWORK — compelled alliance ranks high when it has friends.
  if (allyStrength != null) push('alliance_network', (0.25 + allyStrength) * tilt.relational, '');
  // SECURITY — the low-weight fallback every peace can afford.
  if (threat != null) push('security', (0.35 + 0.4 * threat) * tilt.security, '');
  // D7 REFRAME CLAIM — a victor that has re-read its old aid to the loser as a debt unpaid
  // (restitutionClaim01 > 0) brings that reframed claim to the table as an economic restitution
  // term. Pushed ONLY when the reframe reading exists ⇒ the asset list is byte-identical when the
  // reframe layer is dark (no phantom 0-value asset). Ranks by the reframe strength × believed
  // ability to pay — a strong grievance against a wealthy loser is a strong claim.
  if (restitution != null && restitution > 0) push('reframed_debt', restitution * (0.6 + believedWealth01), '');
  // D4 SEAM (DELIBERATELY DEFERRED — DESIGN_SIM_DEPTH_R2 D4 consumers (i)/(ii)): the design
  // has fear_of_dominance TILT defensive/mutual_defense + sovereignty/non_intervention term
  // weights between free settlements near a hegemon. NOT built this wave: `defensive`/
  // `mutual_defense` terms do NOT exist in TERM_CATALOG, and `non_intervention` has ZERO
  // asset-class producers here (it is a recorded-not-enforced seam already — see its catalog
  // entry). Minting those term producers is a separate, larger change that would move the
  // peace-causal LIT goldens and is outside D4's pinned scope (the pins cover the
  // fear_of_dominance REASON, which IS wired into the war/peace reason ledgers, plus the
  // DENIAL motive). The fear read is available via makeHegemonyFear when this seam is closed.
  // POLITICAL / INTEL — seam classes; low base, only a rich budget + fitting lens reaches them.
  push('government', 0.18 * believedWealth01 * tilt.political, '');
  if (tradeScarcity != null) push('intel', (0.15 + 0.5 * tradeScarcity) * tilt.informational, '');

  return assets.sort((x, y) => (y.value - x.value) || (x.assetClass < y.assetClass ? -1 : 1));
}

/** Archetype lens multipliers (§15.1: archetype picks the term TYPE emphasis).
 *  @param {string} archetype @returns {{ economic: number, military: number, relational: number, security: number, political: number, informational: number }} */
function archetypeTilt(archetype) {
  switch (archetype) {
    case 'merchant': return { economic: 1.4, military: 0.8, relational: 1.0, security: 0.9, political: 0.9, informational: 1.2 };
    case 'military': return { economic: 0.9, military: 1.4, relational: 1.1, security: 1.1, political: 1.1, informational: 0.9 };
    case 'religious': return { economic: 0.85, military: 0.8, relational: 1.0, security: 1.2, political: 1.0, informational: 1.0 };
    default: return { economic: 1.0, military: 1.0, relational: 1.0, security: 1.0, political: 1.0, informational: 1.0 };
  }
}

// ── Compliance evolution (§12 — belief-monitored; a distant victor is cheated) ──

/**
 * Evolve one term's compliance for a tick. The loser's TRUE delivery capacity
 * (its economic headroom) sets the true state; the victor's MONITORING REACH
 * (belief source — truth ⇒ full sight, banded belief ⇒ fog) sets what it
 * OBSERVES. A poorly-informed victor sees 'honored' while the loser cheats
 * (§12.2 — non-detection quietly rewards the informed cheat). Deterministic.
 * @param {{ loserCapacity01: number, monitorReach01: number }} args
 * @returns {{ trueState: 'honored'|'strained'|'defaulted', observedState: 'honored'|'strained'|'defaulted', trueDelivery01: number }}
 */
export function evolveCompliance({ loserCapacity01, monitorReach01 }) {
  const trueDelivery01 = clamp01(Number(loserCapacity01) || 0);
  /** @type {'honored'|'strained'|'defaulted'} */
  const trueState = trueDelivery01 >= PEACE_TERMS_TUNING.HONORED_FLOOR ? 'honored'
    : trueDelivery01 >= PEACE_TERMS_TUNING.DEFAULT_FLOOR ? 'strained'
    : 'defaulted';
  // Detected iff the victor's monitoring reach clears the floor; else it ghosts
  // as 'honored' (the victor believes the treaty kept).
  const detected = clamp01(Number(monitorReach01) || 0) >= PEACE_TERMS_TUNING.DETECT_FLOOR;
  const observedState = detected ? trueState : 'honored';
  return { trueState, observedState, trueDelivery01 };
}

/** The victor's monitoring reach over the loser (§12.2): truth-sourced belief ⇒
 *  full sight (1), a banded/absent belief ⇒ fog (the neutral-band read maps low).
 *  @param {string} victorId @param {string} loserId @param {Record<string, unknown>} worldState @param {(id: string) => number} truthFor @returns {number} */
export function victorMonitorReach(victorId, loserId, worldState, truthFor) {
  const truth = truthFor(loserId);
  const believed = readBeliefStrength(victorId, loserId, worldState, truth);
  // When belief == truth (self / dormant / a truth-sourced read) the victor sees
  // clearly; the wider the belief/truth gap, the poorer the intel.
  if (truth <= 0) return believed <= 0 ? 1 : 0.5;
  const err = Math.abs(believed - truth) / Math.max(1, truth);
  return clamp01(1 - err);
}
