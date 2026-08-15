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
   *  recorded on the fracture and consumed by fractureCredibilityDeltas next tick. */
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
// read), 'occupation_hold' (the occupation ladder), 'grant' (a STANDING RIGHT one
// party holds while the term lives — GR-3's seventh kind, read from
// treatyEnforcement.js under the one-reader law so the right lifts on the same tick
// the term expires), 'seam' (typed-now, fed later).
// family: the §13 stacking axis (at most one drafted term per family — widened by
// GR-2 to family × beneficiary for NEGOTIATED terms; see pactAmendment.js).

/**
 * The TYPE face of the closed executor vocabulary. Its runtime twin is TERM_EXECUTORS
 * below, and tests/domain/peaceTerms.test.js scans THIS line to assert the two carry the
 * same members — a type union and a runtime allowlist that disagree is precisely how the
 * seventh kind reddened a suite, so the agreement is executed rather than trusted.
 * @typedef {'transfer'|'overlay'|'readiness_cap'|'war_block'|'occupation_hold'|'grant'|'seam'} TermExecutor
 */

/**
 * @typedef {Object} TermSpec
 * @property {string} family    the §13 composability axis
 * @property {number} weight    the §15 price-weight (a base term spends this much budget)
 * @property {number} baseYears the nominal duration at a modest victory
 * @property {number} maxYears  the §15.2 HARD duration ceiling
 * @property {number} baseMag   the base magnitude (fraction) where a term carries one
 * @property {boolean} stream   true ⇒ executes an installment each live tick
 * @property {TermExecutor} executor
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
 * @property {string} [assetId]     WR-10: the CONVEYED SETTLEMENT (sovereignty_transfer
 *   only — the `good` precedent). Conditional and drop-when-absent, so every term the
 *   engine has ever minted stays byte-identical. A conveyance without its object is
 *   deliberately unrepresentable: peaceTermsCarriedSheet's validator refuses the clause
 *   in BOTH directions, and the writer refuses to execute a term that carries none.
 * @property {number} [deliveredToVictor]  cumulative conserved credit (stream terms)
 * @property {number} [extractedFromLoser] cumulative conserved debit (== delivered; tribute never mints)
 * @property {boolean} [seam]       true ⇒ a typed registration seam (executor unlanded)
 * @property {string} [beneficiary] GR-2: the party a NEGOTIATED term runs to, or the
 *   literal `'both'` for a symmetric clause. Conditional and drop-when-absent on the
 *   `assetId` precedent, so every war-door term the engine has ever minted stays
 *   byte-identical and its §13 stacking cell stays the bare family it always was. The
 *   obligor of a directional term is the OTHER party; a term carrying none resolves its
 *   direction through `treatyOrientationOf` instead (GR-3's grant reads do exactly that).
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
  // WR-10 (amendment S, THE SOVEREIGNTY MARKET): a settlement trade IS a treaty, and this
  // is the asset side of it — a satellite or vassal edge changing hands. ITS OWN FAMILY,
  // and that is FORCED rather than chosen: amendment S puts "the asset on one side, ANY
  // composition of EXISTING term families on the other", so a sovereignty_transfer sharing
  // a family with any existing term would make itself mutually exclusive with the very
  // consideration it is being exchanged for under §13 one-per-family stacking. Sharing
  // 'sovereignty' with non_intervention (and with TB-4's planned route_restriction) would
  // have been that bug, silently.
  // baseMag 1.0 because sovereignty does not come in fractions — a town changes hands or
  // it does not; weight 2.0 as the catalog's heaviest ask (puppet_seat's 1.5 was the prior
  // ceiling, and a seat installed is less than a town conveyed); 10/25 years as its most
  // DURABLE (non_aggression's 8/20 was the prior longest) because a cession's warranty
  // outlives every extraction. ⚠ ALL FOUR ARE UNSOAKED BANDS — §7 THE TUNING SURFACE owns
  // them and the owner signs them at the soak redo; they are inert until then (below).
  // executor:'seam' + NO CLASS_TERM ENTRY (the non_intervention precedent verbatim): no
  // asset class drafts it ⇒ peaceTermsAppraisal's `CLASS_TERM[assetClass]` never names it
  // ⇒ draftTerms' `if (!spec) continue` is never even reached for it ⇒ registration is
  // BYTE-IDENTICAL. Deliberately NOT a SUBORDINATING_TERM_TYPE (hegemony.js): a sold
  // satellite is PROPERTY changing owner, not a polity bending its knee, and hegemony's
  // own docstring already excludes satellites/steadings from subordinate-tie counting.
  sovereignty_transfer: Object.freeze({ family: 'sovereignty_transfer', weight: 2.0, baseYears: 10, maxYears: 25, baseMag: 1.0, stream: false, executor: 'seam' }),

  // ── GR-3: THE NEW TERM FAMILIES (rides `pactFormationEnabled`, second slice) ──────
  //
  // GRAMMAR §4 is CANONICAL corpus-wide for term membership and spelling (chair ruling
  // R3): ONE list, ONE spelling, ONE closure contract. FAITH (WF-6), POPULATIONS (POP-5b)
  // and TRADE (TR-5) CONSUME these rows by pointer and never re-mint them.
  //
  // ⚠ EVERY BAND BELOW IS UNSOAKED — authored raw, never owner-signed. §7 THE TUNING
  // SURFACE owns them and the owner signs them at the soak redo under THE PROMISE. They
  // are deliberately NOT in proposedSoakBands.js, whose gate requires a status this wave
  // has no authority to grant. The `weight` column is load-bearing beyond price: it is
  // ALSO the ask-ladder a peacetime occasion climbs (`orderTermsByAsk` below), so a
  // retune reorders which clause a faint crossing writes. That is the intended coupling —
  // a heavier ask should need a stronger reason — and it is stated here so a tuner knows.

  // FAITH — Augsburg's cuius regio, the rite settled by compact. LAW ONE IS ABSOLUTE:
  // every one of these moves BELIEVERS and never a god. Nothing here confirms a divine,
  // resolves a theological claim, or writes deity truth; the engine is a clerk of what
  // courts promise each other about people who worship.
  //
  // `shared_rite` is the lightest because it is a RECOGNITION rather than a concession —
  // two courts already keeping the rites agree to keep them together — and it is what
  // `peaceReasons`' existing `common_rite` scorer finally has something signed to point
  // at. It runs long (a communion is not a season's bargain).
  shared_rite: Object.freeze({ family: 'faith', weight: 0.4, baseYears: 6, maxYears: 15, baseMag: 1.0, stream: false, executor: 'grant' }),
  // A route-scoped right: pilgrims may lawfully travel. FAITH's legates and the route
  // layer's existing flow classes are the consumers (deferred by name, coupling row).
  pilgrimage_right: Object.freeze({ family: 'faith', weight: 0.5, baseYears: 5, maxYears: 12, baseMag: 1.0, stream: false, executor: 'grant' }),
  // The grantor FORSWEARS suppression of a named creed — so a suppression becomes a
  // BREACH rather than a policy. Priced above pilgrimage because it binds the grantor's
  // own hand at home, and it runs as long as non_aggression for the same reason: a
  // forswearing that expires in a season forswears nothing.
  tolerance_guarantee: Object.freeze({ family: 'faith', weight: 0.6, baseYears: 8, maxYears: 20, baseMag: 1.0, stream: false, executor: 'grant' }),
  // Lawful access to preach. The heaviest GRANT in the family because it is the only one
  // that asks a court to admit another court's persuasion — and it is the row a war's end
  // can EXTRACT (Augsburg's darker half), which is why it is priced like a concession.
  missionary_access: Object.freeze({ family: 'faith', weight: 0.8, baseYears: 4, maxYears: 10, baseMag: 1.0, stream: false, executor: 'grant' }),
  // The repair of an impaired temple-class institution, paid as CONSERVED INSTALLMENTS on
  // the existing stream physics (the `restitution` precedent verbatim — same executor,
  // same stream flag, same magnitude scale). Nothing new moves; the grain moves the way
  // reparations already move.
  temple_restitution: Object.freeze({ family: 'faith', weight: 0.9, baseYears: 3, maxYears: 8, baseMag: 0.35, stream: true, executor: 'transfer' }),

  // POPULATION — the Ostsiedlung locatio charters, settlers invited on written terms.
  // NO CENSUS REALISM ANYWHERE HERE: these are RIGHTS and BANDS, never headcounts. A
  // `labor_compact` colours an economy; it never replaces one, and it exposes no count.
  migration_right: Object.freeze({ family: 'population', weight: 0.6, baseYears: 5, maxYears: 12, baseMag: 1.0, stream: false, executor: 'grant' }),
  labor_compact: Object.freeze({ family: 'population', weight: 0.8, baseYears: 4, maxYears: 10, baseMag: 1.0, stream: false, executor: 'grant' }),
  // Grain-for-settlement: a founding provision delivered as conserved installments, the
  // direction carried by the term's own `beneficiary` field rather than by a victor.
  settlement_provision: Object.freeze({ family: 'population', weight: 1.0, baseYears: 3, maxYears: 8, baseMag: 0.3, stream: true, executor: 'transfer' }),

  // SECURITY GAINS THE SHARED-THREAT PRODUCT. `defensive_pact` edges have had FIVE
  // reader families and NO writer since the survey (warHomeCosts' levy, warCapacityReads'
  // ally relief, thirdPartyRansom, warAllianceRisk, the certification notes); this is the
  // instrument side of that label. It shares 'security' with non_aggression DELIBERATELY
  // — §4's frozen COMPOSABLE pair is exactly {non_aggression, mutual_defense}, so the two
  // stack on one instrument where any other same-family pair would be refused. Weight 1.0
  // against non_aggression's 0.4 because promising to FIGHT is a heavier thing than
  // promising not to, and the same twenty-year ceiling because both are about the future.
  mutual_defense: Object.freeze({ family: 'security', weight: 1.0, baseYears: 8, maxYears: 20, baseMag: 1.0, stream: false, executor: 'grant' }),

  // ── THE TRADE-RIGHTS SEAMS (GR-3 mints the ROWS; TR-5 lands the executors) ────────
  //
  // WR-10's sovereignty bundle names trade rights as composable consideration and
  // `sovereigntyBundle.js` derives its component set from TERM_FAMILIES at call time, so
  // these three rows are what make that dimension NAMEABLE. `executor:'seam'` + NO
  // CLASS_TERM entry + NO peacetime draft-lens membership is the `non_intervention`
  // mechanism verbatim: no producer ⇒ never drafted ⇒ BYTE-IDENTICAL registration. The
  // seam-2 tripwire (tests/domain/peaceTermsGrantTerms.test.js) asserts they stay
  // producer-less, and reds the day TR-5 lands — which is the instruction to move the
  // reachability obligation into TR-5's own commit.
  //
  // ⚠ SPELLING DIVERGENCE, REPORTED NOT RESOLVED (chair escalation, 2026-08-06). The WAR
  // volume (CR-WR10-B) and docs/DESIGN_FP_ARCH_GR.md §5/§7 Q1 both say "exclusivity";
  // docs/DESIGN_FP_TRADE.md's TR-5 body says `trade_exclusivity`; GRAMMAR §4 — declared
  // CANONICAL by all three — carries NO trade-rights row at all, so the citation cycle
  // has a hole in it. This wave takes the compiled architecture's spelling (`exclusivity`)
  // because it is also the catalog's own convention — not one of the twelve rows above
  // carries a family prefix — and because bare `exclusivity` is what the two chair
  // documents say. TR-5 POINTS HERE; it must not re-mint under the other spelling.
  exclusivity: Object.freeze({ family: 'commercial', weight: 1.0, baseYears: 4, maxYears: 10, baseMag: 1.0, stream: false, executor: 'seam' }),
  market_access: Object.freeze({ family: 'commercial', weight: 0.7, baseYears: 5, maxYears: 12, baseMag: 1.0, stream: false, executor: 'seam' }),
  toll_exemption: Object.freeze({ family: 'commercial', weight: 0.5, baseYears: 4, maxYears: 10, baseMag: 1.0, stream: false, executor: 'seam' }),
});

/** The typed term-type taxonomy (catalog keys, codepoint-frozen for the walker). */
export const TERM_TYPES = Object.freeze(Object.keys(TERM_CATALOG).sort());

/** The §11 term families (the §13 stacking axes). */
export const TERM_FAMILIES = Object.freeze([...new Set(TERM_TYPES.map((t) => TERM_CATALOG[t].family))].sort());

/**
 * THE CLOSED EXECUTOR VOCABULARY — the ONE declaration of what a term may DO.
 *
 * GR-3 (2026-08-06). This constant exists because its absence cost a red: the seventh
 * kind (`grant`) landed in the JSDoc union above while a HAND-RESTATED copy of the same
 * list sat in tests/domain/peaceTerms.test.js, and the two disagreed the moment the
 * catalog grew. That is the estate's recorded DERIVE-DON'T-RESTATE class, and the cure
 * is not a longer restatement — it is ONE home that every table points at.
 *
 * ⚠ DELIBERATELY A LITERAL, NOT A DERIVATION FROM TERM_CATALOG. Deriving it from the
 * rows would make the membership check `expect(usedKinds).toContain(spec.executor)` —
 * a list compared against itself, which is the recorded SELF-REFERENTIAL PIN class and
 * would green for a typo'd executor on every row at once. The literal is an INDEPENDENT
 * denominator; the catalog is checked against it, and the both-directions totality pin
 * in tests/domain/peaceTerms.test.js keeps the two from drifting apart in either
 * direction — a kind declared but unused reds exactly as loudly as a kind used but
 * undeclared. Keep it codepoint-sorted.
 */
export const TERM_EXECUTORS = Object.freeze([
  'grant', 'occupation_hold', 'overlay', 'readiness_cap', 'seam', 'transfer', 'war_block',
]);

/**
 * ORDER CANDIDATE TERM TYPES BY THE ASK THEY MAKE — cheapest first, codepoint on a tie.
 *
 * GR-3. A peacetime occasion does not name one clause; it names a SET of clauses its
 * family can offer, and how far up that set the crossing reaches is what the evidence
 * decides. This is the ordering primitive that turns a set into a ladder, and it lives
 * HERE because the ask IS the §15 price-weight and the catalog is the one place a term
 * is priced.
 *
 * ⚠ DERIVED, NEVER RESTATED, and that is the point rather than a nicety. A hand-written
 * ordering beside a weight column is the recorded stale-restatement class: retune one
 * weight and the two disagree silently, forever, with every pin still green. Nothing
 * anywhere stores this order.
 *
 * Types the catalog does not carry are DROPPED rather than ranked at zero, so a caller
 * naming a row that has not landed yet gets a shorter ladder instead of a phantom rung.
 *
 * @param {ReadonlyArray<string>} types @returns {ReadonlyArray<string>}
 */
export function orderTermsByAsk(types) {
  const known = (Array.isArray(types) ? types : []).map(String).filter((t) => TERM_CATALOG[t]);
  return Object.freeze([...new Set(known)].sort((a, b) => (
    (TERM_CATALOG[a].weight - TERM_CATALOG[b].weight) || (a < b ? -1 : a > b ? 1 : 0)
  )));
}

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
    case 'sovereignty_transfer': return 'cession of sovereignty';
    // GR-3. Each label is what a HERALD would call the clause, not what the key spells —
    // the default de-underscoring would say "shared rite" and "labor compact", which are
    // legible but not house voice, and would say "exclusivity" for a thing whose whole
    // subject is trade. A term type without a case here is not a bug (the default is
    // total); it is a clause nobody has found the crier's word for yet.
    case 'missionary_access': return 'right of mission';
    case 'shared_rite': return 'shared rite';
    case 'pilgrimage_right': return 'pilgrim\'s road';
    case 'tolerance_guarantee': return 'guarantee of tolerance';
    case 'temple_restitution': return 'temple restitution';
    case 'migration_right': return 'right of passage';
    case 'labor_compact': return 'labour compact';
    case 'settlement_provision': return 'settler\'s provision';
    case 'mutual_defense': return 'bond of mutual defence';
    case 'exclusivity': return 'pledge of trade primacy';
    case 'market_access': return 'grant of market access';
    case 'toll_exemption': return 'exemption from tolls';
    default: return String(type).replace(/_/g, ' ');
  }
}

/** @param {unknown} value */
export function humanTermGood(value) {
  const text = String(value || 'the staple export').replace(/_/g, ' ').trim();
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : 'The staple export';
}
