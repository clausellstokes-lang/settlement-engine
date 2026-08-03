/**
 * domain/worldPulse/peaceTermsCatalog.js — the peace engine's TYPED VOCABULARY
 * (DESIGN_PEACE_ENGINE.md §11 term catalog, §13 composability, §15 price weights).
 *
 * THE FAMILY'S FLOOR. Every other peaceTerms member sits above this one, and this
 * one reaches nothing but the treaty clock — so the tuning constants, the typed
 * term catalog, the asset-class → term map and the term LABEL cannot be forked:
 * there is exactly one place a term type can be minted, priced or named.
 *
 * Extracted verbatim from peaceTerms.js by THE DECOMPOSITION WAVE (war tranche,
 * file 2 of 4) under R-BLD-4's writer-family reading: the head keeps the writer
 * and entry roles, the leaves are pure.
 */
import { CURRENT_TREATY_TICKS_PER_YEAR } from './treatyClock.js';

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

export const COALITION_BETRAYAL_CHARACTER_TUNING = Object.freeze({
  MIN_MULTIPLIER: 0.8,
  MAX_MULTIPLIER: 1.2,
  PRUDENCE_MAX: 0.95,
  GRIEVANCE_MIN: 1.05,
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

/** @typedef {'export_flows'|'treasury'|'military_posture'|'territory'|'alliance_network'|'security'|'government'|'intel'|'reframed_debt'} AssetClass */

/**
 * @typedef {Object} AppraisedAsset
 * @property {AssetClass} assetClass
 * @property {string} termType     the catalog term this class drafts
 * @property {number} value        the victor's own belief-appraised valuation (0..1)
 * @property {string} [good]       the named export (resource_share only)
 */

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

/** @typedef {Record<string, unknown>} TreatyRecord */
/** @typedef {Record<string, TreatyRecord>} TreatyLedger */

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

/** Asset class → the term type it drafts (resource_share falls back to tribute
 *  when the loser has no named export to fraction). */
export const CLASS_TERM = Object.freeze({
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

/** @param {unknown} value */
export function humanTermGood(value) {
  const text = String(value || 'the staple export').replace(/_/g, ' ').trim();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : 'The staple export';
}
