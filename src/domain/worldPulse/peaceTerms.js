/**
 * domain/worldPulse/peaceTerms.js — W-PEACE-2: THE PRICE OF PEACE
 * (DESIGN_PEACE_ENGINE.md §11 term catalog, §12 compliance, §13 composability,
 * §15 prize ranking + term limits).
 *
 * When a war winds down through the EXISTING sue-for-peace path (a deployment
 * stamped `recalled.cause` = 'sue_for_peace'* by the strategy chooser or the
 * W-PEACE-1 sueForPeaceOrder decree), the VICTOR — the party its own belief map
 * ranks stronger at the table — mints a TERM BUDGET from its BELIEVED advantage
 * (readBeliefStrength, never truth: a fog-deceived victor over/under-spends,
 * §15.1), APPRAISES the loser's portfolio through its own lens (scarcity,
 * archetype, threat — §15.1's top-three rule), and drafts DURATION-CAPPED terms
 * (§15.2 — perpetual extraction is structurally unrepresentable: every stream/
 * status term REQUIRES an expiresTick) into a conditionally-materialized treaty
 * ledger. Terms EXECUTE through existing machinery (tribute = a conserved
 * transfer, never minted; compelled alliance = the relationship-overlay nudge;
 * demilitarization = a readiness ceiling the mobilization reads consult) and
 * accrue per-term COMPLIANCE that evolves under FOG (a distant, poorly-informed
 * victor can be cheated — §12.2), the strain feeding the loser's resentment
 * (§12.3 / §5 revanchism) and a detected default MINTING the warReasons
 * treaty_default casus (§12.4 — closing W-PEACE-1's registration seam).
 *
 * CONSTITUTIONAL POSTURE (design §8 + the wave brief), identical to W-PEACE-1:
 *   - GATE: peaceCausalActive(worldState) — warLayerEnabled AND the virtual
 *     peaceEngineEnabled, both fail-closed. Absent ⇒ immediate no-op: zero
 *     forks, zero ledger keys, byte-identical (the peace-causal dormancy golden,
 *     extended to fence the treaties ledger, proves it).
 *   - DETERMINISTIC: no rng — the budget, ranking, and compliance are READS, not
 *     rolls (the §H loaded draw that produced the peace is the existing
 *     settlementStrategy softmax; the treaty is its bounded consequence).
 *   - CONSERVATION: material terms move value on a MATCHED credit/debit — the
 *     victor gains exactly what the loser loses; tribute never mints.
 *   - Ledger writes ride getSpatialLedger/setSpatialLedger/dropSpatialLedger
 *     (drop-when-empty at every level; zero eager first-paint bytes).
 *
 * WAVE-3 SEAMS (rendered/negotiated later — NOT this wave): treaties-as-documents
 * rendering, coalition negotiation + separate exits, the cross-pressure mediation
 * table. puppet_seat (the corruption-web foreign-grip feed) and disclosure (the
 * M9b compelled-intel feed) ship as TYPED registration seams — minted + recorded,
 * executor documented-unlanded (the W-PEACE-1 treaty_default/corruption_exposed
 * idiom), fed when those upstreams land. The deeper economic CONSUMPTION of a
 * transfer (domestic shortage from a resource share; war-support credit) and the
 * differential faction-strain feed for W-DOCTRINE-4 are recorded (per-term
 * burden01) and seam-noted here, integrated there.
 */

import { peaceCausalActive, reasonPairKey } from './warReasons.js';
// D7 THE REFRAME LAYER (DESIGN_SIM_DEPTH_R2 §D7, consumer 2): a victor's dark-aid reframe of the
// loser (the reframed debt claim, restitutionClaim01) pushes a restitution asset — the reframed
// claim priced + settleable through the EXISTING terms machinery (real goods move only here,
// conservation untouched). reframeKernel is a pure leaf. 0 when dark ⇒ no asset ⇒ byte-identical.
import { restitutionClaim01 } from './reframeKernel.js';
import { setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
// THE TERMS THAT BITE. The three enforcement READS (readiness_cap · war_block ·
// occupation_hold) live in a dependency-free leaf so the war-layer consumers can
// consult them: this module imports warReasons' gate, and warReasons reaches
// mobilization through corruptionWeb/settlementPolitics, so a consumer importing
// THIS module would close a cycle. Same cure as sacredClaim.faithProximityOf. The
// historic names are re-exported at the bottom, so callers and the battery are
// untouched. `streamInstallmentFraction` is the stream terms' per-tick draw.
import {
  treatyLedgerOf, demilitarizationCapFor, treatyBlocksWar, occupationHoldFor,
  streamInstallmentFraction,
} from './treatyEnforcement.js';
import { affordableTreatyDuration, CURRENT_TREATY_TICKS_PER_YEAR, treatyTicksPerYearOf, treatyYearsRemaining } from './treatyClock.js';
// THE MATERIAL EXECUTOR: a stream term's installment moves REAL granary months
// through the conserved sink-only primitive, applied by the existing single
// food applicator. See treatyTransfer.js for why grain is the honest denomination.
import { computeTreatyGrainDraw, applyTreatyFoodDeltas, freshestSettlement } from './treatyTransfer.js';
import { stablePart } from './stablePart.js';
import { buildPressureSummary, settlementStrength, applyRelationshipPatch } from './relationshipEvolution.js';
import { readBeliefStrength, readBeliefRelationship, governingCoalition } from './beliefMap.js';
import { buildThreatByCid } from './martialReadiness.js';
import { faithAlignmentQuadrant, crossPressureMediation } from '../spatial/cohesionWeave.js';
import { evil01 } from './deityAxes.js';
// The pair's faith×alignment proximity read — owned by sacredClaim.js (a pure leaf) so the
// war side can read it too without closing a cycle back through this module.
import { faithProximityOf } from './sacredClaim.js';
import { relationshipKeyFromEdge, normalizeRelationshipType } from './relationshipState.js';
import { deepClone } from '../clone.js';
import { clamp01 } from '../../kernel/math.js';
// ── Tuning (bounded named constants — owner-retunable per design §8/§15) ─────
export const PEACE_TERMS_TUNING = Object.freeze({
  /** Newly minted treaty ticks/year. Persisted treaties carry their own marker. */
  TICKS_PER_YEAR: CURRENT_TREATY_TICKS_PER_YEAR,
  /** The believed strength gap (settlementStrength is clamp01 0..1) that saturates
   *  the margin — a ~0.5 lead is a crushing victory; margin01 = margin / this. */
  BUDGET_MARGIN_SCALE: 0.5,
  /** Budget at a saturated margin (~3 terms at weight ~1). White peace = 0. */
  BUDGET_MAX: 3.0,
  /** Below this normalized margin the peace is a WHITE PEACE — no extraction, no key. */
  CLEAN_EXIT_FLOOR: 0.08,
  /** §15.1 top-N rule: the victor drafts from its top-ranked asset classes. */
  TOP_ASSETS: 3,
  /** §4 magnanimity: alignment presses the ask — press = BASE + EVIL_W·evil01. */
  PRESS_BASE: 0.6,
  PRESS_EVIL_W: 0.8,
  DURATION_CURVE: Object.freeze({ base: 0.5, marginWeight: 1.0, extremityWeight: 1.0 }), // decisive-victory bend; affordability shortens below
  /** Compliance thresholds on the loser's true per-tick delivery capacity. */
  HONORED_FLOOR: 0.75,
  DEFAULT_FLOOR: 0.4,
  /** §12.2 monitoring: below this reach the victor cannot detect under-delivery. */
  DETECT_FLOOR: 0.6,
  /** §12.3 strain → resentment: annual bump, divided by the treaty's own clock. */
  STRAIN_RESENTMENT_PER_YEAR: 0.6,
  /** How many ticks after a war's negotiated-peace de-escalation the treaty may
   *  still mint — the confirmed peace (proposal machinery) can land a tick or two
   *  after the incident; a live-treaty check keeps it mint-once. */
  PEACE_MINT_WINDOW: 3,
  /** A believed-loser-wealth proxy scale — readBeliefStrength is already 0..1, so
   *  1.0 passes it through (retunable to compress/expand the richness read). */
  WEALTH_SCALE: 1.0,
  /** Loser ally-network saturation (edges) for the compelled-alliance appraisal. */
  ALLY_SATURATION: 3,

  // ── WAVE-3: mediation at the table (§13 / §14.2) ─────────────────────────
  /** §12 magnanimity nudge: a mediated peace softens the term budget by this
   *  bounded fraction (a neighbour's envoys carry lighter terms both courts hear). */
  MEDIATION_SOFTEN: 0.2,
  /** The trust a named mediator earns on BOTH its edges (the E1 reactions bump). */
  MEDIATION_TRUST_W: 0.12,

  // ── WAVE-3: coalition negotiation + the separate exit (§7 / §13) ─────────
  /** The §H-loaded peel read: exhaustion vs tie-strength weights. A war-weary
   *  member with weak ties to its co-besiegers peels; a fresh, close one stays. */
  PEEL_EXHAUSTION_W: 0.6,
  PEEL_TIE_W: 0.5,
  /** The peel-propensity above which a coalition member takes a SEPARATE EXIT
   *  (buys its own smaller peace and abandons its co-besiegers). */
  PEEL_THRESHOLD: 0.5,
  /** The lighter terms a separate-exit member gets (it bargains alone, not with
   *  the coalition's combined weight) — its own budget scales by this. */
  SEPARATE_EXIT_BUDGET: 0.7,
  /** §7 THE EXIT'S PRICE: the resentment a betrayed co-besieger holds toward the
   *  deserter (bounded; typed 'coalition_betrayal' ⇒ the §5 revanchism clock reads it). */
  BETRAYAL_RESENTMENT_W: 0.35,
  /** §7 the reliability discount a deserter carries in FUTURE table-strength sums —
   *  RECORDED on the fracture (the W-DOCTRINE-2 credibility seam), not yet enforced. */
  CREDIBILITY_HIT: 0.3,
  /** How many ticks a fracture record stays live for the coalition_fracture peace
   *  reason to consume (the peel is legible for a window after it is signed). */
  FRACTURE_WINDOW: 6,
});

// ── The typed term catalog (§11) ────────────────────────────────────────────
//
// executor: 'transfer' (conserved value move), 'overlay' (relationship nudge),
// 'readiness_cap' (mobilization ceiling read), 'war_block' (the war chooser's
// read), 'occupation_hold' (the occupation ladder), 'seam' (typed-now, fed later).
// family: the §13 stacking axis (at most one drafted term per family).

/**
 * @typedef {Object} TermSpec
 * @property {string} family    the §13 composability axis
 * @property {number} weight    the §15 price-weight (a base term spends this much budget)
 * @property {number} baseYears the nominal duration at a modest victory
 * @property {number} maxYears  the §15.2 HARD duration ceiling
 * @property {number} baseMag   the base magnitude (fraction) where a term carries one
 * @property {boolean} stream   true ⇒ executes an installment each live tick
 * @property {'transfer'|'overlay'|'readiness_cap'|'war_block'|'occupation_hold'|'seam'} executor
 */

/** @type {Readonly<Record<string, TermSpec>>} */
export const TERM_CATALOG = Object.freeze({
  tribute: Object.freeze({ family: 'economic', weight: 1.0, baseYears: 4, maxYears: 12, baseMag: 0.25, stream: true, executor: 'transfer' }),
  reparations: Object.freeze({ family: 'economic', weight: 0.8, baseYears: 2, maxYears: 5, baseMag: 0.4, stream: true, executor: 'transfer' }),
  // D7: the reframed-debt REPAYMENT — a victor's dark-aid reframe ("the grain we gave is a debt
  // unpaid") priced + settled as conserved installments. Shares the 'economic' family (one per
  // family under §13 stacking — JUDGMENT: a reframed debt IS an economic repayment, and reuse
  // avoids a house-voice-totality expansion that the tight 800-line ceiling cannot afford;
  // vetoable to mint a 'restitution' family). Draftable only when restitutionClaim01 > 0 (the
  // reframe-fed producer below) ⇒ never drafted when the reframe layer is dark ⇒ byte-identical.
  restitution: Object.freeze({ family: 'economic', weight: 0.8, baseYears: 3, maxYears: 8, baseMag: 0.35, stream: true, executor: 'transfer' }),
  resource_share: Object.freeze({ family: 'economic', weight: 1.0, baseYears: 4, maxYears: 12, baseMag: 0.5, stream: true, executor: 'transfer' }),
  compelled_alliance: Object.freeze({ family: 'relational', weight: 1.2, baseYears: 4, maxYears: 8, baseMag: 0.3, stream: false, executor: 'overlay' }),
  demilitarization: Object.freeze({ family: 'security', weight: 0.9, baseYears: 5, maxYears: 10, baseMag: 0.5, stream: false, executor: 'readiness_cap' }),
  non_aggression: Object.freeze({ family: 'security', weight: 0.4, baseYears: 8, maxYears: 20, baseMag: 1.0, stream: false, executor: 'war_block' }),
  occupation_continuation: Object.freeze({ family: 'territorial', weight: 1.1, baseYears: 3, maxYears: 6, baseMag: 1.0, stream: false, executor: 'occupation_hold' }),
  puppet_seat: Object.freeze({ family: 'political', weight: 1.5, baseYears: 4, maxYears: 8, baseMag: 1.0, stream: false, executor: 'seam' }),
  disclosure: Object.freeze({ family: 'informational', weight: 0.6, baseYears: 3, maxYears: 6, baseMag: 1.0, stream: false, executor: 'seam' }),
  // W-CONVERGENCE: a pledge NOT to intervene in each other's internal contests — the
  // spheres_understanding made a treaty term. Its OWN family 'sovereignty' (design §4
  // JUDGMENT: a security family would make it mutually exclusive with non_aggression
  // under one-per-family stacking; historically they are distinct demands — vetoable).
  // executor:'seam' — recorded-not-enforced this wave (no non_intervention asset producer
  // yet ⇒ never drafted ⇒ byte-identical; the demand-side wire lands with the composer).
  non_intervention: Object.freeze({ family: 'sovereignty', weight: 0.5, baseYears: 6, maxYears: 15, baseMag: 1.0, stream: false, executor: 'seam' }),
});

/** The typed term-type taxonomy (catalog keys, codepoint-frozen for the walker). */
export const TERM_TYPES = Object.freeze(Object.keys(TERM_CATALOG).sort());

/** The §11 term families (the §13 stacking axes). */
export const TERM_FAMILIES = Object.freeze([...new Set(TERM_TYPES.map((t) => TERM_CATALOG[t].family))].sort());

// ── The prize-ranking asset classes (§15.1) → their canonical term type ──────
//
// Each class is appraised through the VICTOR'S OWN lens (its scarcity, threat,
// archetype) against the loser's BELIEVED holdings; the top-three become terms.

/** @typedef {'export_flows'|'treasury'|'military_posture'|'territory'|'alliance_network'|'security'|'government'|'intel'|'reframed_debt'} AssetClass */

/** Asset class → the term type it drafts (resource_share falls back to tribute
 *  when the loser has no named export to fraction). */
const CLASS_TERM = Object.freeze({
  export_flows: 'resource_share',
  treasury: 'tribute',
  military_posture: 'demilitarization',
  territory: 'occupation_continuation',
  alliance_network: 'compelled_alliance',
  security: 'non_aggression',
  government: 'puppet_seat',
  intel: 'disclosure',
  reframed_debt: 'restitution', // D7: the reframe-fed producer's asset → restitution term
});

// ── Small shared helpers ────────────────────────────────────────────────────

/** @param {number} n @returns {number} */
function round4(n) { return Math.round(n * 10000) / 10000; }

/** The directed treaty key: the victor's treaty OVER the loser. `${victor}>${loser}`.
 *  @param {unknown} victorId @param {unknown} loserId @returns {string} */
export function treatyPairKey(victorId, loserId) {
  return reasonPairKey(victorId, loserId);
}

/**
 * The victor's OWN believed lead over a foe: believed(self) − believed(foe),
 * both through readBeliefStrength (self reads truth; the foe reads BELIEF).
 * @param {string} selfId @param {string} foeId
 * @param {Record<string, unknown>} worldState
 * @param {(id: string) => number} truthFor
 * @returns {number}
 */
export function believedAdvantage(selfId, foeId, worldState, truthFor) {
  return readBeliefStrength(selfId, selfId, worldState, truthFor(selfId))
    - readBeliefStrength(selfId, foeId, worldState, truthFor(foeId));
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
  return PEACE_TERMS_TUNING.PRESS_BASE + PEACE_TERMS_TUNING.PRESS_EVIL_W * clamp01(evil01(deity));
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
 * @typedef {Object} AppraisedAsset
 * @property {AssetClass} assetClass
 * @property {string} termType     the catalog term this class drafts
 * @property {number} value        the victor's own belief-appraised valuation (0..1)
 * @property {string} [good]       the named export (resource_share only)
 */

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
  const believedWealth01 = clamp01(believedLoserStrength / PEACE_TERMS_TUNING.WEALTH_SCALE);

  const econScarcity = clamp01(0.6 * clamp01(Number(victorPressure?.food) || 0) + 0.4 * clamp01(Number(victorPressure?.economy) || 0));
  const tradeScarcity = clamp01(Number(victorPressure?.trade) || 0);
  const exports = loserExports(loserItem);
  const archetype = String(governingCoalition(/** @type {import('./beliefMap.js').SnapItem} */ (victorItem)).governing || '');
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
  push('export_flows', (0.4 + econScarcity) * believedWealth01 * (exports.length ? 1.15 : 0.85) * tilt.economic, exports[0] || '');
  push('treasury', (0.35 + econScarcity) * believedWealth01 * tilt.economic, '');
  // MILITARY GEOGRAPHY — the threatened victor ranks the loser's arms + ground.
  push('military_posture', (0.3 + victorThreat01) * believedWealth01 * tilt.military, '');
  push('territory', (0.2 + victorThreat01) * believedWealth01 * 0.9 * tilt.military, '');
  // THE LOSER'S ALLIANCE NETWORK — compelled alliance ranks high when it has friends.
  push('alliance_network', (0.25 + loserAllyStrength01) * tilt.relational, '');
  // SECURITY — the low-weight fallback every peace can afford.
  push('security', (0.35 + 0.4 * victorThreat01) * tilt.security, '');
  // D7 REFRAME CLAIM — a victor that has re-read its old aid to the loser as a debt unpaid
  // (restitutionClaim01 > 0) brings that reframed claim to the table as an economic restitution
  // term. Pushed ONLY when the reframe reading exists ⇒ the asset list is byte-identical when the
  // reframe layer is dark (no phantom 0-value asset). Ranks by the reframe strength × believed
  // ability to pay — a strong grievance against a wealthy loser is a strong claim.
  const restitution01 = restitutionClaim01(worldState, victorId, loserId);
  if (restitution01 > 0) push('reframed_debt', restitution01 * (0.6 + believedWealth01), '');
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
  push('intel', (0.15 + 0.5 * tradeScarcity) * tilt.informational, '');

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

// ── Term drafting (§15.2 — every term duration-capped; duration enters the price) ──

/**
 * @typedef {Object} TermRecord
 * @property {string} type          a TERM_TYPES member
 * @property {string} family
 * @property {number} magnitude     bounded 0..1
 * @property {number} mintedTick
 * @property {number} expiresTick   REQUIRED (§15.2 — a term without it is unrepresentable)
 * @property {number} weightSpent   budget consumed (weight × duration factor)
 * @property {'honored'|'strained'|'defaulted'|'expired'} complianceState  the OBSERVED state (what the victor sees)
 * @property {'honored'|'strained'|'defaulted'} trueState  the ACTUAL state (the fog gap; §12.2)
 * @property {number} burden01      the compliant party's differential burden (W-DOCTRINE-4 seam)
 * @property {string} receipt
 * @property {string} [good]        the named export (resource_share)
 * @property {number} [deliveredToVictor]  cumulative conserved credit (stream terms)
 * @property {number} [extractedFromLoser] cumulative conserved debit (== delivered; tribute never mints)
 * @property {boolean} [seam]       true ⇒ a typed registration seam (executor unlanded)
 */

/**
 * Draft the treaty's terms from the ranked assets and the budget (§15). Walks
 * value-desc, drafting one term per asset class (and at most one per family —
 * the §13 stacking rule) while budget remains; each term's duration scales with
 * the margin × alignment press inside its HARD ceiling, and LONGER SPENDS MORE
 * (§15.2). Pure + deterministic.
 * @param {{ ranked: AppraisedAsset[], budget: number, margin01: number, press: number, tick: number }} args
 * @returns {{ terms: TermRecord[], budgetSpent: number }}
 */
export function draftTerms({ ranked, budget, margin01, press, tick }) {
  /** @type {TermRecord[]} */
  const terms = [];
  const usedFamilies = new Set();
  const usedTypes = new Set();
  let remaining = budget;
  let drafted = 0;

  for (const asset of ranked) {
    if (drafted >= PEACE_TERMS_TUNING.TOP_ASSETS) break;
    const type = asset.termType;
    const spec = TERM_CATALOG[type];
    if (!spec) continue;
    if (usedTypes.has(type) || usedFamilies.has(spec.family)) continue; // §13: no redundant stacking

    // Duration (§15.2): decisive victories bend upward inside the hard ceiling.
    // Unaffordable asks shorten to whole years, never disappear at the margin boundary.
    const { years, weightSpent } = affordableTreatyDuration(
      spec, remaining, margin01, press, PEACE_TERMS_TUNING.DURATION_CURVE);
    if (years < 1) continue;

    const expiresTick = tick + Math.round(years * PEACE_TERMS_TUNING.TICKS_PER_YEAR);
    const magnitude = round4(clamp01(spec.baseMag * (0.5 + margin01) * Math.min(1.5, press)));

    /** @type {TermRecord} */
    const term = {
      type,
      family: spec.family,
      magnitude,
      mintedTick: tick,
      expiresTick,
      weightSpent,
      complianceState: 'honored',
      trueState: 'honored',
      burden01: 0,
      receipt: draftReceipt(type, asset, years, magnitude),
    };
    if (asset.good) term.good = asset.good;
    if (spec.executor === 'seam') term.seam = true;
    if (spec.stream) { term.deliveredToVictor = 0; term.extractedFromLoser = 0; }

    terms.push(term);
    remaining -= weightSpent;
    usedFamilies.add(spec.family);
    usedTypes.add(type);
    drafted += 1;
  }

  // Codepoint-stable term order (deterministic serialization).
  terms.sort((x, y) => (x.type < y.type ? -1 : x.type > y.type ? 1 : 0));
  const budgetSpent = round4(terms.reduce((s, t) => s + t.weightSpent, 0));
  return { terms, budgetSpent };
}

/** @param {string} type @param {AppraisedAsset} asset @param {number} years @param {number} magnitude @returns {string} */
function draftReceipt(type, asset, years, magnitude) {
  switch (type) {
    case 'tribute': return `A tribute stream — ${(magnitude * 100).toFixed(0)}% of the treasury for ${years} year${years === 1 ? '' : 's'}; it was always the coin they wanted.`;
    case 'resource_share': return `${asset.good || 'The staple export'} shall flow to the victor — a ${(magnitude * 100).toFixed(0)}% share for ${years} year${years === 1 ? '' : 's'}.`;
    case 'reparations': return `Reparations in ${years} year${years === 1 ? '' : 's'} of installments — the price of the war laid on the loser.`;
    case 'restitution': return `Restitution for a debt long unpaid — ${(magnitude * 100).toFixed(0)}% for ${years} year${years === 1 ? '' : 's'}; the old grain-years, called in at last.`;
    case 'compelled_alliance': return `Forced allyship for ${years} year${years === 1 ? '' : 's'} — a banner compelled, and compelled loyalty rots.`;
    case 'demilitarization': return `A mobilization cap for ${years} year${years === 1 ? '' : 's'} — the beaten foe may not rearm.`;
    case 'non_aggression': return `A non-aggression pact ${years} year${years === 1 ? '' : 's'} — no war between these courts while it stands.`;
    case 'occupation_continuation': return `The occupation continues ${years} year${years === 1 ? '' : 's'} — the garrison stays at the walls.`;
    case 'puppet_seat': return `A victor-aligned seat installed (registration seam) — cheap control, brittle control.`;
    case 'disclosure': return `Observer/disclosure clause (registration seam) — the loser's court opened to the victor's eyes.`;
    default: return `Term ${type} for ${years} year${years === 1 ? '' : 's'}.`;
  }
}

/** @param {unknown} value */
function humanTermGood(value) {
  const text = String(value || 'the staple export').replace(/_/g, ' ').trim();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : 'The staple export';
}

/**
 * Signing-card reason for one typed term. Exact magnitudes, durations and
 * budget arithmetic stay on the treaty record; the feed names the obligation.
 * @param {TermRecord} term @param {string} victorName @param {string} loserName
 */
function signingReason(term, victorName, loserName) {
  if (term.type === 'resource_share') return `${humanTermGood(term.good)} will flow from ${loserName} to ${victorName}.`;
  return `${loserName} accepts the ${termLabel(term.type)} demanded by ${victorName}.`;
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

// ── Read helpers (the enforcement-seam consumers + the treaty_default feed) ──

/** @typedef {Record<string, unknown>} TreatyRecord */
/** @typedef {Record<string, TreatyRecord>} TreatyLedger */

// treatyLedgerOf / demilitarizationCapFor / treatyBlocksWar MOVED to
// treatyEnforcement.js (see the import block's note) and are RE-EXPORTED at the
// bottom of this file, so every historic import path keeps working.

/**
 * Every live treaty whose parties include BOTH ids (either direction) — the
 * shape warReasons.scoreTreatyDefault consumes ({ parties, complianceState,
 * defaultedBy, defaultSeverity01 }). This CLOSES W-PEACE-1's treaty_default
 * registration seam: advanceWarReasons feeds this into its scorer.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} aId @param {unknown} bId
 * @returns {Array<{ parties: string[], complianceState: string, defaultedBy: string, defaultSeverity01: number }>}
 */
export function treatiesForPair(worldState, aId, bId) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  const a = String(aId); const b = String(bId);
  /** @type {Array<{ parties: string[], complianceState: string, defaultedBy: string, defaultSeverity01: number }>} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(a) || !parties.includes(b)) continue;
    out.push({
      parties,
      complianceState: String(t?.complianceState || 'honored'),
      defaultedBy: String(t?.defaultedBy || ''),
      defaultSeverity01: clamp01(Number(t?.defaultSeverity01) || 0),
    });
  }
  return out;
}

// ── The mover ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PeaceTermsAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<Record<string, unknown>>} [settlementUpdates] the tick's pending
 *   per-settlement writes, with this tick's conserved tribute/reparations/restitution/
 *   resource_share installments folded in. Present only when grain actually moved.
 */

/**
 * Advance the treaty ledger one tick. DETERMINISTIC; gate absent ⇒ immediate
 * no-op. Two passes: (1) MINT — a treaty for each war winding down via the
 * sue-for-peace path this tick (a fresh `recalled.cause` = sue_for_peace* stamp
 * the war layer has not yet consumed); (2) ADVANCE — execute installments, evolve
 * compliance under fog, accrue strain → resentment (§12.3 E1b seam), mark
 * detected defaults (feeding warReasons treaty_default), and expire/prune terms.
 * Persist only on real change (serialize-compare; drop-when-empty).
 *
 * @param {{ snapshot: { byId?: Map<string, Record<string, unknown>>,
 *                       regionalGraph?: { edges?: Array<Record<string, unknown>> } },
 *           worldState: Record<string, unknown>,
 *           settlementUpdates?: Array<Record<string, unknown>>,
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           pIndex?: Record<string, unknown> | null,
 *           tick: number, now?: unknown }} args
 * @returns {PeaceTermsAdvanceResult}
 */
export function advanceTreaties({ snapshot, worldState, settlementUpdates = [], graph, pIndex = null, tick, now = null }) {
  // ── DORMANCY GATE (§8): absent ⇒ an immediate no-op. No key, no read. ──
  if (!peaceCausalActive(/** @type {{ simulationRules?: Record<string, unknown> }} */(worldState))) {
    return { worldState, changed: false, newsEntries: [] };
  }

  const prevLedger = treatyLedgerOf(worldState);
  const edges = (graph?.edges && Array.isArray(graph.edges) ? graph.edges : null)
    || (Array.isArray(snapshot?.regionalGraph?.edges) ? snapshot.regionalGraph.edges : []);
  const threatByCid = buildThreatByCid(snapshot, worldState);

  /** @type {Map<string, number>} */
  const strengthCache = new Map();
  const truthFor = (/** @type {string} */ id) => {
    if (strengthCache.has(id)) return /** @type {number} */ (strengthCache.get(id));
    const item = snapshot?.byId?.get?.(id);
    const s = item ? settlementStrength(item, buildPressureSummary(pIndex, id)) : 0;
    strengthCache.set(id, s);
    return s;
  };

  // Adjacency (for the loser's ally-network appraisal + the resentment edge key).
  const adjacency = buildAdjacency(edges);

  /** @type {TreatyLedger} */
  const nextLedger = {};
  for (const key of Object.keys(prevLedger || {})) nextLedger[key] = deepClone(/** @type {TreatyRecord} */((prevLedger || {})[key]));

  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  let workingState = worldState;
  // The tick's conserved granary movements, accumulated across every stream term and
  // folded onto settlementUpdates ONCE at the end (the generosity mover's idiom): a
  // loser paying two victors debits a single, ordered running total rather than two
  // independent draws that could each believe the whole granary was theirs to take.
  /** @type {Map<string, number>} */
  const foodDeltas = new Map();

  // ── PASS 1: MINT from a war just ended by a NEGOTIATED PEACE. The DURABLE,
  // reliable signal is the relationship overlay — an edge that has DE-ESCALATED
  // off 'hostile' (the sue-for-peace label change, confirmed through the existing
  // proposal machinery) carrying a fresh 'sue_for_peace' incident. The transient
  // deployment recall is NOT the trigger: the deployment and the label change fall
  // out of sync (the army marches home ticks before the court signs the peace, and
  // the war layer consumes the recall before this late mover runs), so the recorded
  // incident is the authoritative "this war ended by treaty" mark. A short window
  // (the confirmed peace can land a tick or two after the beat) + the live-treaty
  // check keep it mint-once per war.
  const relStates = /** @type {Record<string, { relationshipType?: unknown, recentIncidents?: Array<{ type?: unknown, tick?: unknown, outcomeId?: unknown }> }>} */ (
    workingState.relationshipStates && typeof workingState.relationshipStates === 'object' ? workingState.relationshipStates : {});
  /** @type {Set<string>} */
  const mintedThisPair = new Set();
  for (const rawEdge of edges) {
    const a = rawEdge?.from != null ? String(rawEdge.from) : '';
    const b = rawEdge?.to != null ? String(rawEdge.to) : '';
    if (!a || !b || a === b) continue;
    const rel = relStates[relationshipKeyFromEdge(rawEdge)];
    if (!rel) continue;
    if (normalizeRelationshipType(String(rel.relationshipType || '')) === 'hostile') continue; // the war has NOT ended
    if (!recentSueForPeace(rel.recentIncidents, tick)) continue;                 // no fresh negotiated peace here
    const unordered = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (mintedThisPair.has(unordered)) continue;                                 // one treaty per unordered pair
    mintedThisPair.add(unordered);

    const { victorId, loserId, believedMargin } = resolveVictor(a, b, workingState, truthFor);
    // Already under a live treaty? Don't re-mint (idempotent within the window).
    if (nextLedger[treatyPairKey(victorId, loserId)] || nextLedger[treatyPairKey(loserId, victorId)]) continue;

    const mint = mintTreaty({
      victorId, loserId, believedMargin, worldState: workingState, snapshot,
      pIndex, threatByCid, adjacency, truthFor, tick, edges,
    });
    if (!mint) continue; // white peace / no affordable term ⇒ no key (the clean exit)
    nextLedger[treatyPairKey(victorId, loserId)] = mint.treaty;
    // Mint-time executions (overlay nudge, seam registration) + the signing beat.
    workingState = mint.applyMintEffects(workingState, /** @type {Array<Record<string, unknown>>} */ (edges), now);
    newsEntries.push(mint.signingBeat);
  }

  // ── PASS 2: ADVANCE live treaties (execute · monitor · strain · expire) ────
  for (const key of Object.keys(nextLedger).sort()) {
    const treaty = nextLedger[key];
    const victorId = String(treaty.victorId);
    const loserId = String(treaty.loserId);
    const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty.terms) ? treaty.terms : []);

    // WR-0c — a deliberate repudiation is already a resolved compliance verdict,
    // not another delivery roll. Its writer ended every live term at the breach
    // tick, lifting ALL enforcement and streams immediately. Keep the broken shell
    // until the terms' ORIGINAL horizon so treatiesForPair can feed the standing
    // treaty_default casus, then prune it as spent history. Never restore honored,
    // execute installments, or accrue ordinary payment strain on this branch.
    if (String(treaty.breachType || '') === 'repudiation') {
      const horizon = Number(treaty.breachExpiresTick);
      if (!Number.isFinite(horizon) || Number(tick) >= horizon) delete nextLedger[key];
      else {
        treaty.complianceState = 'defaulted';
        treaty.defaultSeverity01 = 1;
        treaty.terms = terms;
      }
      continue;
    }

    // The loser's true delivery capacity (economic headroom) + the victor's
    // monitoring reach (belief source — truth ⇒ sight, banded belief ⇒ fog).
    const loserPressure = buildPressureSummary(pIndex, loserId);
    const loserBurden01 = clamp01(0.6 * clamp01(Number(loserPressure?.economy) || 0) + 0.4 * clamp01(Number(loserPressure?.food) || 0));
    const loserCapacity01 = clamp01(1 - loserBurden01);
    const monitorReach01 = victorMonitorReach(victorId, loserId, workingState, truthFor);

    /** @type {TermRecord[]} */
    const liveTerms = [];
    let worstObserved = 'honored';
    let anyStrainThisTick = false;
    let defaultSeverity01 = 0;
    for (const term of terms) {
      if (Number(tick) >= Number(term.expiresTick)) {
        // EXPIRY (§12.5): the term lapses; its effect lifts (the reads stop
        // returning it once it is gone). Dropped from the live set.
        continue;
      }
      const comp = evolveCompliance({ loserCapacity01, monitorReach01 });
      term.trueState = comp.trueState;
      term.complianceState = comp.observedState;
      term.burden01 = round4(loserBurden01);

      // ── STREAMS EXECUTE A REAL, CONSERVED INSTALLMENT. The term's magnitude is its
      // nominal YEARLY share; one tick draws one installment of it from the loser's
      // granary ABOVE its reserve floor and credits the victor's, through the
      // sink-only primitive (absolute food is reduced by the carry, never minted —
      // see treatyTransfer.js for why grain is the honest denomination here).
      // The accumulators now record the REAL storage-months moved, so
      // `extractedFromLoser` is what the payer actually lost and `deliveredToVictor`
      // what the payee actually received; they DIVERGE by the road's spoilage, which
      // is the sink. A payer at its reserve floor moves nothing — and that silence is
      // exactly the under-delivery §12's compliance read is watching for.
      const spec = TERM_CATALOG[term.type];
      if (spec?.stream) {
        const draw = computeTreatyGrainDraw({
          payer: freshestSettlement(settlementUpdates, snapshot, loserId),
          payee: freshestSettlement(settlementUpdates, snapshot, victorId),
          takeFraction: streamInstallmentFraction(term, comp.trueDelivery01, treaty),
          committedDebit: -(foodDeltas.get(loserId) || 0),
          committedCredit: foodDeltas.get(victorId) || 0,
        });
        if (draw && draw.lostMonths > 0) {
          foodDeltas.set(loserId, round4((foodDeltas.get(loserId) || 0) - draw.lostMonths));
          if (draw.gainedMonths > 0) foodDeltas.set(victorId, round4((foodDeltas.get(victorId) || 0) + draw.gainedMonths));
          term.extractedFromLoser = round4((Number(term.extractedFromLoser) || 0) + draw.lostMonths);
          term.deliveredToVictor = round4((Number(term.deliveredToVictor) || 0) + draw.gainedMonths);
        }
      }
      if (comp.trueState !== 'honored') anyStrainThisTick = true;
      if (comp.observedState === 'defaulted') defaultSeverity01 = Math.max(defaultSeverity01, round4(1 - comp.trueDelivery01));
      if (rankState(comp.observedState) > rankState(worstObserved)) worstObserved = comp.observedState;
      liveTerms.push(term);
    }

    if (liveTerms.length === 0) {
      delete nextLedger[key]; // all terms lapsed ⇒ the treaty is spent history (prune)
      continue;
    }
    treaty.terms = liveTerms;
    treaty.complianceState = worstObserved;
    if (defaultSeverity01 > 0) {
      treaty.defaultedBy = loserId;                 // the loser is the oathbreaker (feeds scoreTreatyDefault)
      treaty.defaultSeverity01 = defaultSeverity01;
    } else if ('defaultedBy' in treaty) {
      delete treaty.defaultedBy; delete treaty.defaultSeverity01;
    }

    // §12.3 STRAIN → the E1b resentment seam: the paying loser resents its burden;
    // that resentment is the §5 revanchism fuel a future war reads.
    if (anyStrainThisTick) {
      workingState = accrueStrainResentment(workingState, /** @type {Array<Record<string, unknown>>} */ (edges), loserId, victorId, loserBurden01, now, treaty);
    }
  }

  // ── PERSIST (serialize-compare; drop-when-empty) ───────────────────────────
  // The tick's granary movements fold on through the EXISTING single food applicator
  // (clamped to each granary's capacity, rounded to the tenth-month). Zero deltas ⇒ the
  // same array by reference, so a tick where no term drew is byte-identical here.
  const nextUpdates = applyTreatyFoodDeltas(
    /** @type {Array<{ saveId?: unknown }>} */ (settlementUpdates), foodDeltas);
  const grainMoved = nextUpdates !== settlementUpdates;
  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? sortedLedger(nextLedger) : null);
  const relChanged = workingState !== worldState;
  if (prevSerialized === nextSerialized && !relChanged && !grainMoved && newsEntries.length === 0) {
    return { worldState, changed: false, newsEntries: [] };
  }
  let out = workingState;
  out = hasNext ? setSpatialLedger(out, 'treaties', sortedLedger(nextLedger)) : dropSpatialLedger(out, 'treaties');
  return {
    worldState: out,
    changed: true,
    newsEntries,
    settlementUpdates: /** @type {Array<Record<string, unknown>>} */ (nextUpdates),
  };
}

// ── Mint internals ───────────────────────────────────────────────────────────

/**
 * Build a treaty from a resolved victor/loser + budget/ranking, plus a closure
 * that applies the mint-time executions. Returns null on white peace / no
 * affordable term (the clean exit — no key materializes).
 *
 * WAVE-3 composes the table (§7 / §13): a named MEDIATOR softens the budget +
 * earns trust both ways; a co-besieger COALITION either negotiates JOINTLY (one
 * treaty, burden split by strength shares) or lets the victor take a SEPARATE
 * EXIT (a lighter solo peace that ABANDONS its co-besiegers — betrayal priced,
 * a fracture record typed for the coalition_fracture peace reason to consume).
 * The joint-vs-peel choice is a DETERMINISTIC §H-loaded read (the module's
 * no-rng law): the loading is exhaustion + tie-strength, resolved by threshold.
 *
 * @param {{ victorId: string, loserId: string, believedMargin: number,
 *           worldState: Record<string, unknown>, snapshot: { byId?: Map<string, Record<string, unknown>> },
 *           pIndex: Record<string, unknown> | null, threatByCid: Map<string, number>,
 *           adjacency: Map<string, Set<string>>, truthFor: (id: string) => number, tick: number,
 *           edges: Array<Record<string, unknown>> }} args
 * @returns {{ treaty: TreatyRecord, signingBeat: Record<string, unknown>,
 *             applyMintEffects: (ws: Record<string, unknown>, edges: Array<Record<string, unknown>>, now: unknown) => Record<string, unknown> } | null}
 */
function mintTreaty(args) {
  const { victorId, loserId, believedMargin, worldState, snapshot, pIndex, threatByCid, adjacency, truthFor, tick, edges } = args;
  const { margin01, budget, whitePeace } = termBudgetFor(believedMargin);
  if (whitePeace || budget <= 0) return null;

  const victorItem = snapshot?.byId?.get?.(victorId) || null;
  const loserItem = snapshot?.byId?.get?.(loserId) || null;
  const press = alignmentPress(victorItem);

  // ── MEDIATION (§13): a cross-pressured neighbour brokering the table softens
  // the terms (the §12 magnanimity nudge — bounded) and earns trust both ways.
  const mediator = findCrossPressuredMediator(snapshot, { edges }, victorId, loserId);
  let effectiveBudget = mediator ? budget * (1 - PEACE_TERMS_TUNING.MEDIATION_SOFTEN) : budget;

  // ── COALITION (§7): the victor's co-besiegers of this loser. >1 member ⇒ the
  // table is COMPOSED; the §H-loaded peel read decides joint vs separate exit.
  const deployments = /** @type {Record<string, { targetId?: unknown }>} */ (
    worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {});
  const warExhaustion = /** @type {Record<string, unknown>} */ (
    worldState.warExhaustion && typeof worldState.warExhaustion === 'object' ? worldState.warExhaustion : {});
  const coBesiegers = coBesiegersOf(deployments, victorId, loserId);
  const coalition = [victorId, ...coBesiegers].sort();
  const { mode, peelPropensity } = chooseCoalitionMode({
    victorExhaustion01: Number(warExhaustion[victorId]) || 0,
    avgTie01: avgTieStrength(worldState, edges, victorId, coBesiegers),
    coalitionSize: coalition.length,
  });
  const separateExit = coalition.length > 1 && mode === 'separate_exit';
  if (separateExit) effectiveBudget *= PEACE_TERMS_TUNING.SEPARATE_EXIT_BUDGET; // a solo bargain is lighter

  const ranked = appraiseLoserPortfolio({
    victorId, loserId, worldState, victorItem, loserItem,
    victorPressure: buildPressureSummary(pIndex, victorId),
    victorThreat01: clamp01(threatByCid.get(victorId) || 0),
    loserTruthStrength: truthFor(loserId),
    loserAllyStrength01: loserAllyStrength(adjacency, loserId, victorId),
  });
  const { terms, budgetSpent } = draftTerms({ ranked, budget: effectiveBudget, margin01, press, tick });
  if (terms.length === 0) return null; // budget too thin for any term ⇒ clean exit

  const victorName = String(/** @type {{ name?: unknown }} */ (victorItem || {}).name || victorId);
  const loserName = String(/** @type {{ name?: unknown }} */ (loserItem || {}).name || loserId);

  /** @type {string[]} */
  const receipts = [`The Peace of ${loserName} — signed under ${victorName}'s terms (${terms.map((t) => t.type).join(', ')}).`];
  if (mediator) receipts.push(`Brokered by ${mediator.name}, torn between the courts — the terms were the lighter for it.`);

  /** @type {TreatyRecord} */
  const treaty = {
    parties: [victorId, loserId],
    victorId,
    loserId,
    victorName,
    loserName,
    mintedTick: tick,
    believedMarginAtSignature: round4(believedMargin),
    budgetGranted: round4(effectiveBudget),
    budgetSpent,
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
    terms,
    complianceState: 'honored',
    receipts,
  };
  if (mediator) treaty.mediator = { id: mediator.id, name: mediator.name };

  // JOINT coalition: the roster + committed-strength shares are legible on the
  // treaty (§7 — reparations distribute pro-rata; the transfer physics credit the
  // lead negotiator, per-member distribution is a later-wave transfer seam).
  if (coalition.length > 1 && !separateExit) {
    treaty.coalitionScope = coalition;
    treaty.shares = coalitionShares(coalition, truthFor);
    receipts.push(`A coalition peace — ${coalition.length} besiegers bind ${loserName} jointly, the spoils split by the strength each brought.`);
  }
  // SEPARATE EXIT: the typed fracture record (§7) — the deserter, its abandoned
  // co-besiegers, the coalition size, and the recorded credibility hit (the
  // W-DOCTRINE-2 reliability seam). The coalition_fracture peace reason reads it.
  if (separateExit) {
    const fractureReceipt = `${victorName} left the siege — its own peace bought, its co-besiegers abandoned at the walls.`;
    treaty.separateExit = true;
    treaty.fracture = {
      deserter: victorId,
      abandoned: coBesiegers,
      coalitionSize: coalition.length,
      credibilityHit: round4(PEACE_TERMS_TUNING.CREDIBILITY_HIT),
      peelPropensity,
      tick,
      receipt: fractureReceipt,
    };
    receipts.push(fractureReceipt);
  }

  const signingBeat = {
    // THE FEED'S ADMISSION KEY (see the wizardNews.js authoring guard). This beat went
    // WITHOUT one, so every treaty this engine has ever signed was narrated into a void:
    // normalizeEntry refuses an id-less entry and the audit sink skips it. COLLISION-FREE:
    // the minting loop keeps a `mintedThisPair` set and takes one treaty per unordered
    // pair per tick, and re-mint is refused while a treaty is live, so (victor, loser)
    // cannot repeat within a tick.
    id: `wizard_news.${tick}.treaty_signed.${stablePart(victorId)}.${stablePart(loserId)}`,
    kind: 'treaty_signed',
    impactKind: 'diplomacy',
    // A dictated peace ENDS A WAR — a major beat by any in-world reading, on par with
    // the climb-down (major/68). Without these three, normalizeEntry graded it notable
    // with severity 0 and score 0: invisible weight on the one beat that closes an arc.
    // Also the reader-facing meters: absent severity renders "Severity 0%" on the card
    // and seeds rumors at the mildest magnitude band.
    significance: 'major',
    severity: 0.55,
    score: 66,
    tick,
    headline: separateExit
      ? `${victorName} peels from the siege and makes a separate peace with ${loserName}`
      : `${victorName} dictates the peace with ${loserName}`,
    summary: `${separateExit
      ? `${victorName} makes a separate peace with ${loserName}, binding the defeated court to`
      : `${victorName} binds ${loserName} to`} ${terms.map((term) => termLabel(term.type)).join(', ')}.${mediator ? ` ${mediator.name} brokered the settlement.` : ''}`,
    reasons: terms.map((term) => signingReason(term, victorName, loserName)),
    // THE NEWS ADDRESS LAW's place layer. `parties` is this module's own vocabulary and no
    // feed consumer reads it (normalizeEntry, the rumor seeder, the panel's
    // AffectedSettlements and arcIdForEntry all read `settlementIds`), so without this the
    // beat would reach the feed addressed to nowhere. `parties` is retained because the
    // treaty ledger's own readers speak it.
    settlementIds: [victorId, loserId],
    parties: [victorId, loserId],
  };

  /** Apply the mint-time executions (§11): the relational overlay nudge + the
   *  seam registrations, plus WAVE-3 the mediation trust (both mediator edges)
   *  and the separate-exit betrayal (each abandoned co-besiegers' edge). Streams/
   *  readiness/war-block execute lazily via the reads + the advance pass. */
  const applyMintEffects = (/** @type {Record<string, unknown>} */ ws, /** @type {Array<Record<string, unknown>>} */ eff, /** @type {unknown} */ now) => {
    let state = ws;
    for (const term of terms) {
      if (term.type === 'compelled_alliance') {
        // The relationship-overlay nudge (the E1c overture lane): the loser is
        // pulled toward the victor's banner AND its resentment rises (compelled
        // loyalty is resented — §11's defection window is a wave-3 read).
        state = nudgeCompelledAlliance(state, eff, loserId, victorId, term.magnitude, now);
      }
    }
    if (mediator) state = accrueMediationTrust(state, eff, mediator.id, victorId, loserId, now);
    if (separateExit) state = accrueBetrayal(state, eff, victorId, coBesiegers, now);
    return state;
  };

  return { treaty, signingBeat, applyMintEffects };
}

// ── Overlay + strain writes (the E1b/E1c relationship seam) ──────────────────

/** Find the REAL graph edge key between two settlements (the relationshipStates
 *  overlay is keyed by the edge's own id, so a synthesized key would orphan).
 *  @param {Array<Record<string, unknown>>} edges @param {string} a @param {string} b @returns {string | null} */
function edgeKeyBetween(edges, a, b) {
  for (const edge of edges) {
    const f = edge?.from != null ? String(edge.from) : '';
    const t = edge?.to != null ? String(edge.to) : '';
    if ((f === a && t === b) || (f === b && t === a)) return relationshipKeyFromEdge(edge);
  }
  return null;
}

/** The pinned updatedAt for an overlay write — `now` when threaded, else the
 *  world's own stamp (deterministic; never a wall clock). @param {Record<string, unknown>} ws @param {unknown} now @returns {unknown} */
function overlayStamp(ws, now) {
  return now == null ? (/** @type {{ updatedAt?: unknown }} */ (ws).updatedAt ?? null) : now;
}

/**
 * Nudge the compelled-alliance overlay: pull trust up + resentment up on the
 * loser→victor edge (bounded), through the sanctioned applyRelationshipPatch
 * mechanism (the E1c overture lane). Compelled loyalty is REAL but resented — the
 * §11 defection window that reads this is a wave-3 concern. No edge ⇒ byte-safe no-op.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} loserId @param {string} victorId @param {number} magnitude @param {unknown} now
 * @returns {Record<string, unknown>}
 */
function nudgeCompelledAlliance(worldState, edges, loserId, victorId, magnitude, now) {
  const key = edgeKeyBetween(edges, loserId, victorId);
  if (!key) return worldState;
  const current = /** @type {{ relationshipStates?: Record<string, { trust?: number, resentment?: number }> }} */ (worldState).relationshipStates?.[key];
  const m = clamp01(magnitude);
  const trust = clamp01((Number(current?.trust) || 0) + 0.15 * m);
  const resentment = clamp01((Number(current?.resentment) || 0) + 0.1 * m);
  return applyRelationshipPatch(worldState, {
    relationshipKey: key,
    relationshipPatch: { trust, resentment },
    metadata: { incidentType: 'compelled_alliance' },
    proposalPayload: null,
  }, overlayStamp(worldState, now));
}

/**
 * §12.3 STRAIN → E1b resentment: bump the paying loser's resentment toward the
 * victor (bounded, per-tick), typed as a 'tribute_strain' incident so the §5
 * revanchism clock (which reads old tribute wounds under a live grudge) catches
 * it. Uses applyRelationshipPatch on the REAL edge; no edge ⇒ byte-safe no-op.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} loserId @param {string} victorId @param {number} burden01 @param {unknown} now
 * @param {TreatyRecord | null | undefined} treaty
 * @returns {Record<string, unknown>}
 */
function accrueStrainResentment(worldState, edges, loserId, victorId, burden01, now, treaty) {
  const key = edgeKeyBetween(edges, loserId, victorId);
  if (!key) return worldState;
  const current = /** @type {{ relationshipStates?: Record<string, { resentment?: number }> }} */ (worldState).relationshipStates?.[key];
  const resentment = clamp01((Number(current?.resentment) || 0) + (PEACE_TERMS_TUNING.STRAIN_RESENTMENT_PER_YEAR / treatyTicksPerYearOf(treaty)) * clamp01(burden01));
  return applyRelationshipPatch(worldState, {
    relationshipKey: key,
    relationshipPatch: { resentment },
    metadata: { incidentType: 'tribute_strain' },
    proposalPayload: null,
  }, overlayStamp(worldState, now));
}

// ── Appraisal internals ──────────────────────────────────────────────────────

/** @param {Array<Record<string, unknown>>} edges @returns {Map<string, Set<string>>} */
function buildAdjacency(edges) {
  /** @type {Map<string, Set<string>>} */
  const adjacency = new Map();
  for (const edge of edges) {
    const a = edge?.from != null ? String(edge.from) : '';
    const b = edge?.to != null ? String(edge.to) : '';
    if (!a || !b) continue;
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    /** @type {Set<string>} */ (adjacency.get(a)).add(b);
    /** @type {Set<string>} */ (adjacency.get(b)).add(a);
  }
  return adjacency;
}

/** The loser's ally-network strength (its non-victor neighbours), 0..1 — compelled
 *  alliance ranks high precisely when the loser has strong friends (§15.1).
 *  @param {Map<string, Set<string>>} adjacency @param {string} loserId @param {string} victorId @returns {number} */
function loserAllyStrength(adjacency, loserId, victorId) {
  const near = adjacency.get(loserId);
  if (!near) return 0;
  let n = 0;
  for (const id of near) { if (id !== victorId) n += 1; }
  return clamp01(n / PEACE_TERMS_TUNING.ALLY_SATURATION);
}

/** Did this edge carry a sue-for-peace de-escalation within the mint window? The
 *  incident is stamped by applyRelationshipPatch when the peace label change applies
 *  ({ type: 'strategy_sue_for_peace', outcomeId: '…sue_for_peace…' }). Durable —
 *  it survives on recentIncidents long after the deployment recall is consumed.
 *  @param {Array<{ type?: unknown, tick?: unknown, outcomeId?: unknown }> | undefined} incidents
 *  @param {number} tick @returns {boolean} */
function recentSueForPeace(incidents, tick) {
  if (!Array.isArray(incidents)) return false;
  for (const inc of incidents) {
    const at = Number(inc?.tick);
    if (!Number.isFinite(at) || at > tick || tick - at > PEACE_TERMS_TUNING.PEACE_MINT_WINDOW) continue;
    if (String(inc?.type || '').includes('sue_for_peace') || String(inc?.outcomeId || '').includes('sue_for_peace')) return true;
  }
  return false;
}

/** The victor's monitoring reach over the loser (§12.2): truth-sourced belief ⇒
 *  full sight (1), a banded/absent belief ⇒ fog (the neutral-band read maps low).
 *  @param {string} victorId @param {string} loserId @param {Record<string, unknown>} worldState @param {(id: string) => number} truthFor @returns {number} */
function victorMonitorReach(victorId, loserId, worldState, truthFor) {
  const truth = truthFor(loserId);
  const believed = readBeliefStrength(victorId, loserId, worldState, truth);
  // When belief == truth (self / dormant / a truth-sourced read) the victor sees
  // clearly; the wider the belief/truth gap, the poorer the intel.
  if (truth <= 0) return believed <= 0 ? 1 : 0.5;
  const err = Math.abs(believed - truth) / Math.max(1, truth);
  return clamp01(1 - err);
}

// ── Mediation at the table (§13 / §14.2 — the cross-pressured broker) ────────
//
// The single source of the cross-pressured-mediator read: the MINT names a
// qualified mediator in the treaty (softening the terms, earning trust both
// directions), and peaceReasons.advancePeaceReasons imports THIS finder for its
// mediation peace-reason — one finder, so the reason and the treaty never drift.

// faithProximityOf now lives in sacredClaim.js and is RE-EXPORTED here so this module's
// historic import path keeps working. It moved because the faith casus belli
// (sacred_claim ↔ common_rite) needs the same read from warReasons.js, and warReasons
// could never import peaceTerms — peaceTerms imports warReasons' gate, so the edge would
// close a cycle. ONE reader, three consumers (the treaty mint, the mediation reason, and
// the two faith reasons), no fork.
export { faithProximityOf };

/**
 * Find the first (codepoint-ordered) third settlement adjacent to BOTH
 * belligerents whose quadrant reads are cross-pressured per cohesionWeave — the
 * neutral broker torn between the pair (a faith-brother of one, alignment-kin of
 * the other). Null when none stands between them.
 * @param {{ byId?: Map<string, Record<string, unknown>> } | null | undefined} snapshot
 * @param {{ edges?: Array<Record<string, unknown>> } | null} graph
 * @param {string} partyId @param {string} foeId
 * @returns {{ id: string, name: string } | null}
 */
export function findCrossPressuredMediator(snapshot, graph, partyId, foeId) {
  const edges = Array.isArray(graph?.edges) ? graph.edges : [];
  const adjacency = buildAdjacency(edges);
  const partyItem = snapshot?.byId?.get?.(partyId);
  const foeItem = snapshot?.byId?.get?.(foeId);
  for (const mId of [...adjacency.keys()].sort()) {
    if (mId === partyId || mId === foeId) continue;
    const near = /** @type {Set<string>} */ (adjacency.get(mId));
    if (!near.has(partyId) || !near.has(foeId)) continue;
    const mItem = snapshot?.byId?.get?.(mId);
    if (!mItem) continue;
    const toA = faithAlignmentQuadrant(faithProximityOf(mItem, partyItem));
    const toB = faithAlignmentQuadrant(faithProximityOf(mItem, foeItem));
    if (crossPressureMediation({ toA, toB }).crossPressured) {
      return { id: mId, name: String(/** @type {{ name?: unknown }} */ (mItem).name || mId) };
    }
  }
  return null;
}

/**
 * Bump trust on BOTH the mediator's edges (mediator↔victor and mediator↔loser)
 * — the broker earns standing in both courts (§13 / the E1 reactions machinery).
 * Typed 'mediation' incidents; missing edges are byte-safe no-ops.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} mediatorId @param {string} victorId @param {string} loserId @param {unknown} now
 * @returns {Record<string, unknown>}
 */
function accrueMediationTrust(worldState, edges, mediatorId, victorId, loserId, now) {
  let state = worldState;
  for (const otherId of [victorId, loserId]) {
    const key = edgeKeyBetween(edges, mediatorId, otherId);
    if (!key) continue;
    const current = /** @type {{ relationshipStates?: Record<string, { trust?: number }> }} */ (state).relationshipStates?.[key];
    const trust = clamp01((Number(current?.trust) || 0) + PEACE_TERMS_TUNING.MEDIATION_TRUST_W);
    state = applyRelationshipPatch(state, {
      relationshipKey: key,
      relationshipPatch: { trust },
      metadata: { incidentType: 'mediation' },
      proposalPayload: null,
    }, overlayStamp(state, now));
  }
  return state;
}

// ── Coalition negotiation + the separate exit (§7 / §13) ─────────────────────

/**
 * The victor's co-besieger coalition against this loser: OTHER attackers whose
 * live deployment targets the same loser (the exact primitive the coalition_
 * fracture peace reason reads — reused so the two features stay consistent).
 * Codepoint-ordered; excludes the victor itself.
 * @param {Record<string, { targetId?: unknown }> | null | undefined} deployments
 * @param {string} victorId @param {string} loserId @returns {string[]}
 */
export function coBesiegersOf(deployments, victorId, loserId) {
  if (!deployments || typeof deployments !== 'object') return [];
  /** @type {string[]} */
  const out = [];
  for (const attackerId of Object.keys(deployments).sort()) {
    if (attackerId === victorId) continue;
    if (String(deployments[attackerId]?.targetId || '') === String(loserId)) out.push(attackerId);
  }
  return out;
}

/**
 * The §H-LOADED coalition-mode read (DETERMINISTIC — the module's no-rng law):
 * a member takes a SEPARATE EXIT when its peel-propensity clears the threshold.
 * Propensity is loaded by the member's own war-exhaustion (a worn court buys the
 * quick separate peace) and the WEAKNESS of its ties to the coalition (weak ties
 * desert; strong ties hold the line). No coalition (no co-besiegers) ⇒ never a
 * peel — the plain per-pair peace. Pure.
 * @param {{ victorExhaustion01: number, avgTie01: number, coalitionSize: number }} args
 * @returns {{ mode: 'joint' | 'separate_exit', peelPropensity: number }}
 */
export function chooseCoalitionMode({ victorExhaustion01, avgTie01, coalitionSize }) {
  if (!(Number(coalitionSize) > 1)) return { mode: 'joint', peelPropensity: 0 };
  const peelPropensity = round4(clamp01(
    PEACE_TERMS_TUNING.PEEL_EXHAUSTION_W * clamp01(Number(victorExhaustion01) || 0)
    + PEACE_TERMS_TUNING.PEEL_TIE_W * (1 - clamp01(Number(avgTie01) || 0)),
  ));
  return { mode: peelPropensity >= PEACE_TERMS_TUNING.PEEL_THRESHOLD ? 'separate_exit' : 'joint', peelPropensity };
}

/** Committed-strength shares for a coalition, pro-rata to each member's strength
 *  (§7: reparations split by contribution). Codepoint-keyed, sums to ~1.
 *  @param {string[]} members @param {(id: string) => number} truthFor @returns {Record<string, number>} */
function coalitionShares(members, truthFor) {
  const weights = members.map((id) => Math.max(0, Number(truthFor(id)) || 0));
  const total = weights.reduce((s, w) => s + w, 0);
  /** @type {Record<string, number>} */
  const shares = {};
  for (let i = 0; i < members.length; i++) {
    shares[members[i]] = total > 0 ? round4(weights[i] / total) : round4(1 / members.length);
  }
  return shares;
}

/** The victor's average believed tie-strength (trust) to its co-besiegers — the
 *  cohesion the peel read weighs against. No edges ⇒ 0 (isolated ⇒ peels easily).
 *  @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 *  @param {string} victorId @param {string[]} coBesiegers @returns {number} */
function avgTieStrength(worldState, edges, victorId, coBesiegers) {
  if (coBesiegers.length === 0) return 0;
  let sum = 0; let n = 0;
  for (const ally of coBesiegers) {
    const key = edgeKeyBetween(edges, victorId, ally);
    if (!key) continue;
    const rel = /** @type {{ relationshipStates?: Record<string, { trust?: number }> }} */ (worldState).relationshipStates?.[key];
    sum += clamp01(Number(rel?.trust) || 0); n += 1;
  }
  return n > 0 ? clamp01(sum / n) : 0;
}

/**
 * §7 THE EXIT'S PRICE: mint betrayal on every abandoned co-besieger's edge to the
 * deserter — resentment bump, typed 'coalition_betrayal' (the /betray/ revanchism
 * clock reads it). The reliability discount is RECORDED on the fracture record
 * (the W-DOCTRINE-2 credibility seam), not yet enforced. Missing edges are no-ops.
 * @param {Record<string, unknown>} worldState @param {Array<Record<string, unknown>>} edges
 * @param {string} deserterId @param {string[]} abandoned @param {unknown} now
 * @returns {Record<string, unknown>}
 */
function accrueBetrayal(worldState, edges, deserterId, abandoned, now) {
  let state = worldState;
  for (const allyId of abandoned) {
    const key = edgeKeyBetween(edges, allyId, deserterId);
    if (!key) continue;
    const current = /** @type {{ relationshipStates?: Record<string, { resentment?: number, trust?: number }> }} */ (state).relationshipStates?.[key];
    const resentment = clamp01((Number(current?.resentment) || 0) + PEACE_TERMS_TUNING.BETRAYAL_RESENTMENT_W);
    const trust = clamp01((Number(current?.trust) || 0) * (1 - PEACE_TERMS_TUNING.CREDIBILITY_HIT));
    state = applyRelationshipPatch(state, {
      relationshipKey: key,
      relationshipPatch: { resentment, trust },
      metadata: { incidentType: 'coalition_betrayal' },
      proposalPayload: null,
    }, overlayStamp(state, now));
  }
  return state;
}

/**
 * Every live fracture record that names `partyId` among the ABANDONED within the
 * fracture window — the durable, legible signal the coalition_fracture peace
 * reason consumes (a peel is legible for a window even after the deserter's
 * deployment is recalled). Returns the deserter + coalition size per fracture.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} partyId @param {number} tick
 * @returns {Array<{ deserter: string, coalitionSize: number, abandonedCount: number, tick: number }>}
 */
export function fracturesAbandoning(worldState, partyId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  const id = String(partyId);
  const now = Number(tick);
  /** @type {Array<{ deserter: string, coalitionSize: number, abandonedCount: number, tick: number }>} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const fr = /** @type {{ deserter?: unknown, abandoned?: unknown[], coalitionSize?: unknown, tick?: unknown }} */ (
      /** @type {Record<string, unknown>} */ (ledger[key]).fracture);
    if (!fr || !Array.isArray(fr.abandoned)) continue;
    if (!fr.abandoned.map(String).includes(id)) continue;
    const at = Number(fr.tick);
    if (Number.isFinite(now) && Number.isFinite(at) && now - at > PEACE_TERMS_TUNING.FRACTURE_WINDOW) continue;
    out.push({
      deserter: String(fr.deserter || ''),
      coalitionSize: Math.max(0, Math.floor(Number(fr.coalitionSize) || 0)),
      abandonedCount: fr.abandoned.length,
      tick: Number.isFinite(at) ? at : now,
    });
  }
  return out;
}

// ── THE TREATY DOCUMENT read-model (§13 legibility — the structured facts) ────
//
// PURE structured read: the treaty rendered as the vision's document — parties,
// terms with years remaining + per-term compliance, the fraying seam named.
// House-VOICE prose lives in the lazy display layer (domain/display/
// treatyDocument.js); THIS returns only ledger facts (the InstitutionCard honesty
// gate — never invent, render what the ledger holds). Dark/absent ⇒ null.

/** Compliance rank for the fraying-seam pick (defaulted worst). @param {string} s @returns {number} */
function complianceRank(s) { return s === 'defaulted' ? 2 : s === 'strained' ? 1 : 0; }

/**
 * The term nearest default — the seam that will tear first (§13 "the DM watches
 * the seam that will tear"). Worst observed compliance wins; ties break to the
 * term closest to expiry, then codepoint. Null when every term holds clean.
 * @param {TermRecord[]} terms @param {number} tick
 * @param {TreatyRecord | null | undefined} [treaty]
 * @returns {TermRecord | null}
 */
export function frayingTermOf(terms, tick, treaty) {
  /** @type {TermRecord | null} */
  let worst = null;
  for (const t of terms) {
    if (complianceRank(String(t.complianceState)) <= 0) continue; // honored terms do not fray
    if (!worst) { worst = t; continue; }
    const dr = complianceRank(String(t.complianceState)) - complianceRank(String(worst.complianceState));
    if (dr > 0) { worst = t; continue; }
    if (dr < 0) continue;
    const dy = treatyYearsRemaining(t.expiresTick, tick, treaty) - treatyYearsRemaining(worst.expiresTick, tick, treaty);
    if (dy < 0 || (dy === 0 && String(t.type) < String(worst.type))) worst = t;
  }
  return worst;
}

/**
 * A terse, dependency-free fraying summary the irony brief renders (§14.4 — "the
 * peace holds by two terms of five; the tribute frays"). honoredCount / total +
 * the fraying term's type. Pure; safe on any treaty record.
 * @param {Record<string, unknown> | null | undefined} treaty @param {number} tick
 * @returns {{ total: number, honored: number, frayingType: string | null, line: string } | null}
 */
export function treatyFrayingSummary(treaty, tick) {
  const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty?.terms) ? treaty.terms : []);
  if (terms.length === 0) return null;
  const honored = terms.filter((t) => complianceRank(String(t.complianceState)) <= 0).length;
  const fray = frayingTermOf(terms, tick, treaty);
  const frayingType = fray ? String(fray.type) : null;
  const line = frayingType
    ? `The peace holds by ${honored} term${honored === 1 ? '' : 's'} of ${terms.length}; the ${termLabel(frayingType)} frays.`
    : `The peace holds — all ${terms.length} term${terms.length === 1 ? '' : 's'} stand.`;
  return { total: terms.length, honored, frayingType, line };
}

/** A short human label for a term type (the document/irony voice). @param {string} type @returns {string} */
export function termLabel(type) {
  switch (type) {
    case 'tribute': return 'tribute';
    case 'reparations': return 'reparations';
    case 'resource_share': return 'resource share';
    case 'compelled_alliance': return 'compelled alliance';
    case 'demilitarization': return 'demilitarization';
    case 'restitution': return 'restitution';
    case 'non_aggression': return 'non-aggression pact';
    case 'occupation_continuation': return 'occupation';
    case 'puppet_seat': return 'installed seat';
    case 'disclosure': return 'disclosure clause';
    default: return String(type).replace(/_/g, ' ');
  }
}

/**
 * @typedef {Object} TreatyTermView
 * @property {string} type
 * @property {string} label
 * @property {string} family
 * @property {number} magnitude
 * @property {number} yearsRemaining
 * @property {string} complianceState
 * @property {number} burden01
 * @property {boolean} fraying   whether this is the seam nearest default
 * @property {string} [good]
 */

/**
 * @typedef {Object} TreatyDocument
 * @property {string} pairKey
 * @property {string} victorId @property {string} loserId
 * @property {string} victorName @property {string} loserName
 * @property {number} signedTick
 * @property {number} believedMarginAtSignature
 * @property {number} budgetGranted @property {number} budgetSpent
 * @property {string} complianceState
 * @property {TreatyTermView[]} terms
 * @property {string | null} frayingType
 * @property {{ id: string, name: string } | null} mediator
 * @property {string[] | null} coalitionScope
 * @property {Record<string, number> | null} shares
 * @property {boolean} separateExit
 * @property {{ deserter: string, abandoned: string[], coalitionSize: number, credibilityHit: number, receipt: string } | null} fracture
 * @property {string[]} receipts
 * @property {{ total: number, honored: number, frayingType: string | null, line: string } | null} summary
 */

/** Locate a treaty by directed OR undirected pair key (`victor>loser`). Accepts
 *  either direction. @param {TreatyLedger | null} ledger @param {string} pairKey @returns {TreatyRecord | null} */
function findTreatyByKey(ledger, pairKey) {
  if (!ledger) return null;
  if (ledger[pairKey]) return ledger[pairKey];
  // Try the reverse direction (the caller may hold either order).
  const parts = String(pairKey).split('>');
  if (parts.length === 2) {
    const rev = treatyPairKey(parts[1], parts[0]);
    if (ledger[rev]) return ledger[rev];
  }
  return null;
}

/**
 * THE TREATY DOCUMENT read-model (§13): the treaty as a legible document —
 * parties, terms with years remaining and per-term compliance, the fraying seam
 * named. Pure; renders ONLY ledger facts. Null when the ledger is dark/absent or
 * no treaty stands for the pair.
 * @param {Record<string, unknown> | null | undefined} worldState @param {string} pairKey
 * @returns {TreatyDocument | null}
 */
export function treatyDocument(worldState, pairKey) {
  const ledger = treatyLedgerOf(worldState);
  const treaty = findTreatyByKey(ledger, String(pairKey));
  if (!treaty) return null;
  const tick = Number(/** @type {{ tick?: unknown }} */ (worldState || {}).tick) || 0;
  const victorId = String(treaty.victorId);
  const loserId = String(treaty.loserId);
  const terms = /** @type {TermRecord[]} */ (Array.isArray(treaty.terms) ? treaty.terms : []);
  const fray = frayingTermOf(terms, tick, treaty);
  const frayingType = fray ? String(fray.type) : null;
  /** @type {TreatyTermView[]} */
  const termViews = terms.map((t) => {
    /** @type {TreatyTermView} */
    const v = {
      type: String(t.type),
      label: termLabel(String(t.type)),
      family: String(t.family),
      magnitude: round4(clamp01(Number(t.magnitude) || 0)),
      yearsRemaining: treatyYearsRemaining(t.expiresTick, tick, treaty),
      complianceState: String(t.complianceState || 'honored'),
      burden01: round4(clamp01(Number(t.burden01) || 0)),
      fraying: !!fray && t === fray,
    };
    if (t.good) v.good = String(t.good);
    return v;
  });
  const fr = /** @type {{ deserter?: unknown, abandoned?: unknown[], coalitionSize?: unknown, credibilityHit?: unknown, receipt?: unknown }} */ (
    /** @type {Record<string, unknown>} */ (treaty).fracture);
  return {
    pairKey: treatyPairKey(victorId, loserId),
    victorId,
    loserId,
    victorName: String(treaty.victorName || victorId),
    loserName: String(treaty.loserName || loserId),
    signedTick: Number(treaty.mintedTick) || 0,
    believedMarginAtSignature: round4(Number(treaty.believedMarginAtSignature) || 0),
    budgetGranted: round4(Number(treaty.budgetGranted) || 0),
    budgetSpent: round4(Number(treaty.budgetSpent) || 0),
    complianceState: String(treaty.complianceState || 'honored'),
    terms: termViews,
    frayingType,
    mediator: treaty.mediator && typeof treaty.mediator === 'object'
      ? { id: String(/** @type {{ id?: unknown }} */ (treaty.mediator).id || ''), name: String(/** @type {{ name?: unknown }} */ (treaty.mediator).name || '') }
      : null,
    coalitionScope: Array.isArray(treaty.coalitionScope) ? treaty.coalitionScope.map(String) : null,
    shares: treaty.shares && typeof treaty.shares === 'object' ? /** @type {Record<string, number>} */ (treaty.shares) : null,
    separateExit: !!treaty.separateExit,
    fracture: fr && Array.isArray(fr.abandoned)
      ? {
        deserter: String(fr.deserter || ''),
        abandoned: fr.abandoned.map(String),
        coalitionSize: Math.max(0, Math.floor(Number(fr.coalitionSize) || 0)),
        credibilityHit: round4(clamp01(Number(fr.credibilityHit) || 0)),
        receipt: String(fr.receipt || ''),
      }
      : null,
    receipts: Array.isArray(treaty.receipts) ? treaty.receipts.map(String) : [],
    summary: treatyFrayingSummary(treaty, tick),
  };
}

/**
 * Every treaty document where `settlementId` is a party (victor or loser),
 * codepoint-ordered by pair key — the dossier's "treaties where this settlement
 * is a party" read. Empty when dark/absent.
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} settlementId
 * @returns {TreatyDocument[]}
 */
export function treatyDocumentsForSettlement(worldState, settlementId) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return [];
  const id = String(settlementId);
  /** @type {TreatyDocument[]} */
  const out = [];
  for (const key of Object.keys(ledger).sort()) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(id)) continue;
    const doc = treatyDocument(worldState, key);
    if (doc) out.push(doc);
  }
  return out;
}

// ── Small utilities ──────────────────────────────────────────────────────────

/** @param {string} s @returns {number} */
function rankState(s) { return s === 'defaulted' ? 2 : s === 'strained' ? 1 : 0; }

/** @param {TreatyLedger} ledger @returns {TreatyLedger} */
function sortedLedger(ledger) {
  /** @type {TreatyLedger} */
  const out = {};
  for (const k of Object.keys(ledger).sort()) out[k] = ledger[k];
  return out;
}

// Re-export the believed-relationship read the wave-3 stance/defection reads will
// consume (the compelled-alliance defection window reads a believed victor weakness).
export { readBeliefRelationship };

// The three ENFORCEMENT reads now live in treatyEnforcement.js (a dependency-free leaf
// the war-layer consumers can import without closing a cycle back through this module —
// see the import block). Re-exported under their historic names so every existing caller,
// the display layer and the battery keep their import path. occupationHoldFor rides the
// same seam: one reader, so a term's expiry lifts every effect on the same tick.
export { treatyLedgerOf, demilitarizationCapFor, treatyBlocksWar, occupationHoldFor };
