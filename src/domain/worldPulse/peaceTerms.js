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
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { buildPressureSummary, settlementStrength, applyRelationshipPatch } from './relationshipEvolution.js';
import { readBeliefStrength, readBeliefRelationship, governingCoalition } from './beliefMap.js';
import { buildThreatByCid } from './martialReadiness.js';
import { evil01 } from './deityAxes.js';
import { relationshipKeyFromEdge, normalizeRelationshipType } from './relationshipState.js';
import { deepClone } from '../clone.js';
import { clamp01 } from '../../kernel/math.js';

// ── Tuning (bounded named constants — owner-retunable per design §8/§15) ─────

export const PEACE_TERMS_TUNING = Object.freeze({
  /** Nominal ticks/year — maps the §15.2 year-guides onto the engine's tick clock. */
  TICKS_PER_YEAR: 12,
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
  /** Compliance thresholds on the loser's true per-tick delivery capacity. */
  HONORED_FLOOR: 0.75,
  DEFAULT_FLOOR: 0.4,
  /** §12.2 monitoring: below this reach the victor cannot detect under-delivery. */
  DETECT_FLOOR: 0.6,
  /** §12.3 strain → resentment: per-tick bump on the paying loser's edge (bounded). */
  STRAIN_RESENTMENT_W: 0.05,
  /** How many ticks after a war's negotiated-peace de-escalation the treaty may
   *  still mint — the confirmed peace (proposal machinery) can land a tick or two
   *  after the incident; a live-treaty check keeps it mint-once. */
  PEACE_MINT_WINDOW: 3,
  /** A believed-loser-wealth proxy scale — readBeliefStrength is already 0..1, so
   *  1.0 passes it through (retunable to compress/expand the richness read). */
  WEALTH_SCALE: 1.0,
  /** Loser ally-network saturation (edges) for the compelled-alliance appraisal. */
  ALLY_SATURATION: 3,
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
  resource_share: Object.freeze({ family: 'economic', weight: 1.0, baseYears: 4, maxYears: 12, baseMag: 0.5, stream: true, executor: 'transfer' }),
  compelled_alliance: Object.freeze({ family: 'relational', weight: 1.2, baseYears: 4, maxYears: 8, baseMag: 0.3, stream: false, executor: 'overlay' }),
  demilitarization: Object.freeze({ family: 'security', weight: 0.9, baseYears: 5, maxYears: 10, baseMag: 0.5, stream: false, executor: 'readiness_cap' }),
  non_aggression: Object.freeze({ family: 'security', weight: 0.4, baseYears: 8, maxYears: 20, baseMag: 1.0, stream: false, executor: 'war_block' }),
  occupation_continuation: Object.freeze({ family: 'territorial', weight: 1.1, baseYears: 3, maxYears: 6, baseMag: 1.0, stream: false, executor: 'occupation_hold' }),
  puppet_seat: Object.freeze({ family: 'political', weight: 1.5, baseYears: 4, maxYears: 8, baseMag: 1.0, stream: false, executor: 'seam' }),
  disclosure: Object.freeze({ family: 'informational', weight: 0.6, baseYears: 3, maxYears: 6, baseMag: 1.0, stream: false, executor: 'seam' }),
});

/** The typed term-type taxonomy (catalog keys, codepoint-frozen for the walker). */
export const TERM_TYPES = Object.freeze(Object.keys(TERM_CATALOG).sort());

/** The §11 term families (the §13 stacking axes). */
export const TERM_FAMILIES = Object.freeze([...new Set(TERM_TYPES.map((t) => TERM_CATALOG[t].family))].sort());

// ── The prize-ranking asset classes (§15.1) → their canonical term type ──────
//
// Each class is appraised through the VICTOR'S OWN lens (its scarcity, threat,
// archetype) against the loser's BELIEVED holdings; the top-three become terms.

/** @typedef {'export_flows'|'treasury'|'military_posture'|'territory'|'alliance_network'|'security'|'government'|'intel'} AssetClass */

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

    // Duration (§15.2): baseYears scaled by the margin × press, hard-capped.
    const years = Math.min(spec.maxYears, Math.max(1, Math.round(spec.baseYears * (0.5 + margin01) * press)));
    const durationFactor = years / spec.baseYears; // longer ⇒ more budget
    const weightSpent = round4(spec.weight * durationFactor);
    if (weightSpent > remaining + 1e-9) continue; // cannot afford this term at this length

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
    case 'compelled_alliance': return `Forced allyship for ${years} year${years === 1 ? '' : 's'} — a banner compelled, and compelled loyalty rots.`;
    case 'demilitarization': return `A mobilization cap for ${years} year${years === 1 ? '' : 's'} — the beaten foe may not rearm.`;
    case 'non_aggression': return `A non-aggression pact ${years} year${years === 1 ? '' : 's'} — no war between these courts while it stands.`;
    case 'occupation_continuation': return `The occupation continues ${years} year${years === 1 ? '' : 's'} — the garrison stays at the walls.`;
    case 'puppet_seat': return `A victor-aligned seat installed (registration seam) — cheap control, brittle control.`;
    case 'disclosure': return `Observer/disclosure clause (registration seam) — the loser's court opened to the victor's eyes.`;
    default: return `Term ${type} for ${years} year${years === 1 ? '' : 's'}.`;
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

// ── Read helpers (the enforcement-seam consumers + the treaty_default feed) ──

/** @typedef {Record<string, unknown>} TreatyRecord */
/** @typedef {Record<string, TreatyRecord>} TreatyLedger */

/** The treaties ledger, or null when dark/absent.
 *  @param {Record<string, unknown> | null | undefined} worldState @returns {TreatyLedger | null} */
export function treatyLedgerOf(worldState) {
  return /** @type {TreatyLedger | null} */ (getSpatialLedger(worldState, 'treaties')) || null;
}

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

/**
 * The DEMILITARIZATION ceiling on a settlement (0..1 readiness cap), or null when
 * unbound — the mobilization/readiness reads consult this (§11 seam). Lowest cap
 * across live treaties wins.
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} settlementId
 * @param {number} tick @returns {number | null}
 */
export function demilitarizationCapFor(worldState, settlementId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return null;
  const id = String(settlementId);
  let cap = null;
  for (const key of Object.keys(ledger)) {
    const t = ledger[key];
    if (String(t?.loserId || '') !== id) continue;
    for (const term of /** @type {TermRecord[]} */ (Array.isArray(t?.terms) ? t.terms : [])) {
      if (term.type !== 'demilitarization') continue;
      if (Number(tick) >= Number(term.expiresTick)) continue;
      const c = clamp01(term.magnitude);
      cap = cap == null ? c : Math.min(cap, c);
    }
  }
  return cap;
}

/**
 * Does a live non-aggression / active treaty BLOCK war between two parties?
 * (the war chooser's read — §6/§11 the treaty war-block). A defaulted treaty no
 * longer blocks (the war-block lifts on repudiation, §12.4).
 * @param {Record<string, unknown> | null | undefined} worldState @param {unknown} aId @param {unknown} bId
 * @param {number} tick @returns {boolean}
 */
export function treatyBlocksWar(worldState, aId, bId, tick) {
  const ledger = treatyLedgerOf(worldState);
  if (!ledger) return false;
  const a = String(aId); const b = String(bId);
  for (const key of Object.keys(ledger)) {
    const t = ledger[key];
    const parties = Array.isArray(t?.parties) ? t.parties.map(String) : [];
    if (!parties.includes(a) || !parties.includes(b)) continue;
    if (String(t?.complianceState || '') === 'defaulted') continue; // repudiated ⇒ block lifts
    for (const term of /** @type {TermRecord[]} */ (Array.isArray(t?.terms) ? t.terms : [])) {
      if (term.type !== 'non_aggression') continue;
      if (Number(tick) < Number(term.expiresTick)) return true;
    }
  }
  return false;
}

// ── The mover ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PeaceTermsAdvanceResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
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
 *           graph?: { edges?: Array<Record<string, unknown>> } | null,
 *           pIndex?: Record<string, unknown> | null,
 *           tick: number, now?: unknown }} args
 * @returns {PeaceTermsAdvanceResult}
 */
export function advanceTreaties({ snapshot, worldState, graph, pIndex = null, tick, now = null }) {
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
      pIndex, threatByCid, adjacency, truthFor, tick,
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

      // Streams execute a CONSERVED installment (victor credit == loser debit).
      const spec = TERM_CATALOG[term.type];
      if (spec?.stream) {
        const inst = round4(clamp01(term.magnitude) * comp.trueDelivery01);
        term.deliveredToVictor = round4((Number(term.deliveredToVictor) || 0) + inst);
        term.extractedFromLoser = round4((Number(term.extractedFromLoser) || 0) + inst);
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
      workingState = accrueStrainResentment(workingState, /** @type {Array<Record<string, unknown>>} */ (edges), loserId, victorId, loserBurden01, now);
    }
  }

  // ── PERSIST (serialize-compare; drop-when-empty) ───────────────────────────
  const hasNext = Object.keys(nextLedger).length > 0;
  const prevSerialized = JSON.stringify(prevLedger || null);
  const nextSerialized = JSON.stringify(hasNext ? sortedLedger(nextLedger) : null);
  const relChanged = workingState !== worldState;
  if (prevSerialized === nextSerialized && !relChanged && newsEntries.length === 0) {
    return { worldState, changed: false, newsEntries: [] };
  }
  let out = workingState;
  out = hasNext ? setSpatialLedger(out, 'treaties', sortedLedger(nextLedger)) : dropSpatialLedger(out, 'treaties');
  return { worldState: out, changed: true, newsEntries };
}

// ── Mint internals ───────────────────────────────────────────────────────────

/**
 * Build a treaty from a resolved victor/loser + budget/ranking, plus a closure
 * that applies the mint-time executions. Returns null on white peace / no
 * affordable term (the clean exit — no key materializes).
 * @param {{ victorId: string, loserId: string, believedMargin: number,
 *           worldState: Record<string, unknown>, snapshot: { byId?: Map<string, Record<string, unknown>> },
 *           pIndex: Record<string, unknown> | null, threatByCid: Map<string, number>,
 *           adjacency: Map<string, Set<string>>, truthFor: (id: string) => number, tick: number }} args
 * @returns {{ treaty: TreatyRecord, signingBeat: Record<string, unknown>,
 *             applyMintEffects: (ws: Record<string, unknown>, edges: Array<Record<string, unknown>>, now: unknown) => Record<string, unknown> } | null}
 */
function mintTreaty(args) {
  const { victorId, loserId, believedMargin, worldState, snapshot, pIndex, threatByCid, adjacency, truthFor, tick } = args;
  const { margin01, budget, whitePeace } = termBudgetFor(believedMargin);
  if (whitePeace || budget <= 0) return null;

  const victorItem = snapshot?.byId?.get?.(victorId) || null;
  const loserItem = snapshot?.byId?.get?.(loserId) || null;
  const press = alignmentPress(victorItem);
  const ranked = appraiseLoserPortfolio({
    victorId, loserId, worldState, victorItem, loserItem,
    victorPressure: buildPressureSummary(pIndex, victorId),
    victorThreat01: clamp01(threatByCid.get(victorId) || 0),
    loserTruthStrength: truthFor(loserId),
    loserAllyStrength01: loserAllyStrength(adjacency, loserId, victorId),
  });
  const { terms, budgetSpent } = draftTerms({ ranked, budget, margin01, press, tick });
  if (terms.length === 0) return null; // budget too thin for any term ⇒ clean exit

  const victorName = String(/** @type {{ name?: unknown }} */ (victorItem || {}).name || victorId);
  const loserName = String(/** @type {{ name?: unknown }} */ (loserItem || {}).name || loserId);

  /** @type {TreatyRecord} */
  const treaty = {
    parties: [victorId, loserId],
    victorId,
    loserId,
    mintedTick: tick,
    believedMarginAtSignature: round4(believedMargin),
    budgetGranted: round4(budget),
    budgetSpent,
    terms,
    complianceState: 'honored',
    receipts: [`The Peace of ${loserName} — signed under ${victorName}'s terms (${terms.map((t) => t.type).join(', ')}).`],
  };

  const signingBeat = {
    kind: 'treaty_signed',
    impactKind: 'diplomacy',
    tick,
    headline: `${victorName} dictates the peace with ${loserName}`,
    summary: `A treaty is signed — ${terms.length} term${terms.length === 1 ? '' : 's'} at ${budgetSpent.toFixed(2)} of a ${round4(budget).toFixed(2)} budget.`,
    parties: [victorId, loserId],
  };

  /** Apply the mint-time executions (§11): the relational overlay nudge + the
   *  seam registrations. Streams/readiness/war-block execute lazily via the reads
   *  + the advance pass — nothing to write at mint. */
  const applyMintEffects = (/** @type {Record<string, unknown>} */ ws, /** @type {Array<Record<string, unknown>>} */ edges, /** @type {unknown} */ now) => {
    let state = ws;
    for (const term of terms) {
      if (term.type === 'compelled_alliance') {
        // The relationship-overlay nudge (the E1c overture lane): the loser is
        // pulled toward the victor's banner AND its resentment rises (compelled
        // loyalty is resented — §11's defection window is a wave-3 read).
        state = nudgeCompelledAlliance(state, edges, loserId, victorId, term.magnitude, now);
      }
    }
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
    incidentType: 'compelled_alliance',
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
 * @returns {Record<string, unknown>}
 */
function accrueStrainResentment(worldState, edges, loserId, victorId, burden01, now) {
  const key = edgeKeyBetween(edges, loserId, victorId);
  if (!key) return worldState;
  const current = /** @type {{ relationshipStates?: Record<string, { resentment?: number }> }} */ (worldState).relationshipStates?.[key];
  const resentment = clamp01((Number(current?.resentment) || 0) + PEACE_TERMS_TUNING.STRAIN_RESENTMENT_W * clamp01(burden01));
  return applyRelationshipPatch(worldState, {
    relationshipKey: key,
    relationshipPatch: { resentment },
    incidentType: 'tribute_strain',
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
