/**
 * generosityEV.js — THE GENEROSITY ENGINE decision kernel (E1a).
 *
 * docs/DESIGN_GENEROSITY_ENGINE.md. Generosity is THE MIRROR OF GREED (design §1):
 * where dispatchEV.js weighs a caravan's GO/NO-GO (need-premium × appetite vs believed
 * danger × caution), this kernel weighs a relief decision's GIVE vs WITHHOLD using the
 * SAME decision physics — one W-C2 alignment read, belief-not-truth for anything remote,
 * enter/exit thresholds + dwell (aid never flip-flops), mandatory receipts. Two
 * instances of one decision shape.
 *
 * THE OWNER'S THREE LAWS (binding):
 *   1. Generosity is GATED by relationship AND history (§0.1 qualifiesForGenerosity —
 *      sparse by construction; strangers do not get grain, save the conscience exception).
 *   2. Every action has an equal-and-opposite reaction (the reaction ledger lives in
 *      generosityReactions.js; this kernel emits the terms it reads).
 *   3. Every decision carries a full-context RISK ASSESSMENT (§2.2 withhold terms): the
 *      canonical case — ally famine + the giver's deployed army + a razor margin ⇒
 *      REFUSE, flipping to GIVE_PARTIAL when a war-strategic read finds the ally
 *      garrisons the pass that shields the giver's flank.
 *
 * THE DECISION (framed, like dispatchEV, so a no-bond pair is a pure early-out and the
 * verdict is EXPLAINABLE — the loaded dice are the receipts, §H):
 *
 *     giveScore    = Σ wᵢ · giveTermᵢ   (bond, history, conscience, strategy, faith)
 *     withholdScore= Σ wⱼ · withholdTermⱼ (own-margin, commitment, route, domestic, dependency)
 *     netWithhold  = withholdScore − giveScore
 *     REFUSE  when netWithhold > REFUSE_ENTER  (risk clearly wins) OR the floor forbids any gift
 *     RESUME  when netWithhold < REFUSE_EXIT   AND dwelled (the hysteresis deadband)
 *     magnitude scales with the margin ABOVE the hard GRANARY_RESERVE_FLOOR (never crossed);
 *     tier = GIVE_FULL / GIVE_PARTIAL / GIVE_AS_CREDIT / REFUSE.
 *
 * CONSTITUTIONAL: DORMANT behind constructiveFlowsActive (absent ⇒ never even asked ⇒
 * byte-identical); PURE + LAZY spatial leaf (no worldPulse import — the adapter feeds
 * live reads, mirroring dispatchEV.js; chunk-safe, zero first-paint bytes); explicit
 * rng/now (no Date, no Math.random on the verdict path); bounded centered-on-1.0
 * modulators; the hard reserve floor is a property-tested invariant; the significance
 * gate keeps generosity RARE (design §6). NOT a spontaneous DRAMA CLASS: relief is
 * REACTIVE (a response to an existing famine/war/calamity arc) — under the pacing law
 * (throttle spontaneity, never causality) it is consequence-adjacent, never throttled,
 * so it registers no producer with the E0 governor (DRAMA_CLASS_PRIORITY stays at 7).
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { believedDestinationDanger } from './dispatchEV.js';

// ── Tuning (documented; retuned in the E1a soak) ──────────────────────────────
export const GENEROSITY_TUNING = Object.freeze({
  // GIVE-side term weights (sum 1.0 ⇒ giveScore ∈ [0,1]). §2.1.
  W_BOND: 0.30,
  W_HISTORY: 0.22,
  W_CONSCIENCE: 0.20,
  W_STRATEGY: 0.18,
  W_FAITH: 0.10,

  // WITHHOLD-side term weights (sum 1.0 ⇒ withholdScore ∈ [0,1]). §2.2.
  W_MARGIN: 0.32,
  W_COMMIT: 0.24,
  W_ROUTE: 0.14,
  W_DOMESTIC: 0.18,
  W_DEPEND: 0.12,

  // The REFUSE deadband (the M1 hysteresis discipline — aid never flip-flops, §2.3).
  // netWithhold > ENTER ⇒ enter refusing; < EXIT AND dwelled ⇒ resume giving.
  REFUSE_ENTER: 0.12,
  REFUSE_EXIT: -0.02,
  REFUSE_DWELL: 4,

  // The verdict-magnitude tiers. magnitudeFraction ∈ [0,1] is the share of the ask the
  // giver both can spare (above the floor) and wants to give. FULL at/above FULL_AT;
  // PARTIAL in (EPS, FULL_AT); a fraction ≤ EPS is a floor-forbidden gift ⇒ REFUSE.
  FULL_AT: 0.85,
  MAGNITUDE_EPS: 0.02,
  // Reluctance floor on magnitude: even a fully-affording giver at give-willingness 0
  // gives only RELUCTANCE_BASE of what it can spare; a maximally willing one gives all.
  RELUCTANCE_BASE: 0.5,
  // The give-score at which a giver gives with FULL enthusiasm (magnitude scales to the
  // affordable maximum). A strong bond + real need reaches it; a thin motive falls short.
  GIVE_ENTHUSIASM_FULL: 0.35,

  // GIVE_AS_CREDIT: when the giver's leverage intent (evil/merchant/ambitious — §2.1
  // "gives to indebt, prefers credit") is at/above this, a gift becomes a LOAN.
  CREDIT_AT: 0.6,

  // THE STRATEGIC OVERRIDE (canonical example, part 2 — §0.3): a war-strategic read at/
  // above OVERRIDE_AT relaxes the effective reserve floor by OVERRIDE_FLOOR_RELIEF
  // ("feeding the pass-garrison ally IS defense spending"), flipping a floor-forbidden
  // REFUSE into a GIVE_PARTIAL. Bounded so it can dip the reserve, never empty it.
  OVERRIDE_AT: 0.6,
  OVERRIDE_FLOOR_RELIEF: 0.5,

  // The conscience EXCEPTION magnitude cap (§2.1 / scenario 2): a strongly-good giver
  // with a charity roster gives to NON-bonded neighbours at small, capped magnitude.
  CONSCIENCE_EXCEPTION_CAP: 0.2,
});

/** The four verdict tiers (design §2.3). */
export const VERDICTS = Object.freeze({
  GIVE_FULL: 'give_full', GIVE_PARTIAL: 'give_partial', GIVE_AS_CREDIT: 'give_as_credit', REFUSE: 'refuse',
});

// ── Small pure helpers (clamp/clamp01 are the sanctioned kernel primitives) ─────
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

// ── THE GATE (§0.1) — sparse by construction ──────────────────────────────────
/**
 * @typedef {Object} BondRead
 * @property {string} kind         the live relationship kind ('allied'|'trade_partner'|'vassal'|'patron'|'client'|…)
 * @property {number} strength01   bond strength in [0,1] (trust/pact — the live edge, never a parallel derivation)
 * @property {number} [duty01]     patron/vassal duty weighting in [0,1] (a lord SHOULD relieve his vassal)
 */

/** The relationship kinds whose bond can, above a floor, open the generosity gate. */
const QUALIFYING_KINDS = new Set(['allied', 'trade_partner', 'vassal', 'patron', 'client']);

/**
 * THE §0.1 GATE — is this pair even ASKED the generosity question? True when ANY holds:
 *  - a qualifying relationship kind above BOND_FLOOR (ally / trade-partner⁺ / vassal / patron);
 *  - a live obligation record between them (a standing debt keeps the channel open);
 *  - the conscience exception (a strongly-good, charity-capable giver evaluates even a
 *    non-bonded neighbour at small magnitude — §2.1).
 * A cold pair with none of these is NEVER evaluated (design law 1). Pure, total.
 * @param {Object} args
 * @param {BondRead|null} [args.bond]
 * @param {boolean} [args.hasObligation]           a live obligation record exists between the pair
 * @param {boolean} [args.conscienceException]     the good-aligned charity-roster exception applies
 * @param {number} [args.bondFloor]                the qualifying bond floor (default 0.2)
 * @returns {boolean}
 */
export function qualifiesForGenerosity({ bond = null, hasObligation = false, conscienceException = false, bondFloor = 0.2 } = {}) {
  if (hasObligation === true) return true;
  if (conscienceException === true) return true;
  if (bond && QUALIFYING_KINDS.has(String(bond.kind)) && finiteNumber(bond.strength01, 0) >= bondFloor) return true;
  return false;
}

// ── GIVE-side terms (§2.1) — each bounded, named, documented, retunable ────────
/**
 * BOND: relationship kind × strength, plus the vassal/patron DUTY weighting (a lord
 * SHOULD relieve his vassal — failing is a legitimacy event in the vassal's eyes, §3.2).
 * @param {BondRead|null|undefined} bond @returns {number} [0,1]
 */
export function bondTerm(bond) {
  if (!bond) return 0;
  const strength = clamp01(finiteNumber(bond.strength01, 0));
  const duty = clamp01(finiteNumber(bond.duty01, 0));
  // Kind weight: allies/vassal-patron bind harder than a bare trade partner.
  const kindWeight = bond.kind === 'allied' ? 1.0
    : (bond.kind === 'vassal' || bond.kind === 'patron' || bond.kind === 'client') ? 0.95
      : bond.kind === 'trade_partner' ? 0.7 : 0.4;
  return clamp01(kindWeight * (0.7 * strength + 0.3 * duty));
}

/**
 * @typedef {Object} HistoryRead
 * @property {number} [reliefReceived01]   they-helped-us-once (SLOW-decay positive — "the old debt from the flood-year")
 * @property {number} [reliefRefusedByThem01] they-refused-us (negative)
 * @property {boolean} [betrayal]           an existing betrayal weighting (zeros the give-side outright)
 */
/**
 * HISTORY: the reciprocity memory (§2.1). Reads typed incidents from relationshipMemory
 * (relief_given/received/refused, credit_repaid/defaulted, refuge_granted). Betrayal
 * ZEROS the give-side. Returns { value01, betrayalKill }: value01 the positive-lean
 * reciprocity, betrayalKill the killswitch the composite honours. Pure.
 * @param {HistoryRead|null|undefined} history
 * @returns {{ value01: number, betrayalKill: boolean }}
 */
export function historyTerm(history) {
  if (!history) return { value01: 0, betrayalKill: false };
  if (history.betrayal === true) return { value01: 0, betrayalKill: true };
  const received = clamp01(finiteNumber(history.reliefReceived01, 0));
  const refused = clamp01(finiteNumber(history.reliefRefusedByThem01, 0));
  return { value01: clamp01(received - 0.6 * refused), betrayalKill: false };
}

/**
 * @typedef {Object} ConscienceRead
 * @property {number} [good01]     1 − malice (0.5 = no signal)
 * @property {number} [lawful01]   lawfulness (0.5 = no signal)
 * @property {number} [need01]     the receiver's raw NEED (belief-mediated by the adapter)
 * @property {boolean} [charityRoster] a temple/almshouse roster read (the conscience exception's gate)
 */
/**
 * CONSCIENCE (the ONE W-C2 read, §2.1): lawfulness/goodness scales how much the
 * receiver's raw NEED counts by itself. A saintly, lawful giver weighs a stranger's
 * hunger; a malicious one does not. The charity roster is read for the exception (the
 * caller gates the exception; this term supplies the magnitude). Pure. @returns {number} [0,1]
 * @param {ConscienceRead|null|undefined} conscience
 */
export function conscienceTerm(conscience) {
  if (!conscience) return 0;
  const good = clamp01(finiteNumber(conscience.good01, 0.5));
  const lawful = clamp01(finiteNumber(conscience.lawful01, 0.5));
  const need = clamp01(finiteNumber(conscience.need01, 0));
  // Goodness dominates; lawfulness adds a smaller duty-of-care lean.
  const moralWeight = clamp01(0.7 * good + 0.3 * lawful);
  return clamp01(moralWeight * need);
}

/**
 * @typedef {Object} StrategyRead
 * @property {number} [warStrategic01]   does the receiver's survival serve the giver's security? (shared enemy / buffer geometry / coalition)
 * @property {number} [supplyDependency01] is the receiver UPSTREAM of the giver? (their famine = my shortage next season)
 * @property {number} [leverage01]        the obligation-as-asset appetite (ambitious/evil gives to indebt)
 */
/**
 * STRATEGY (the owner's example made mechanical — three explicit reads, §2.1). Returns
 * the blended give-value AND the two sub-reads the verdict consumes directly: the
 * war-strategic override read and the leverage (credit-preference) read. Pure.
 * @param {StrategyRead|null|undefined} strategy
 * @returns {{ value01: number, warStrategic01: number, leverage01: number }}
 */
export function strategyTerm(strategy) {
  if (!strategy) return { value01: 0, warStrategic01: 0, leverage01: 0 };
  const war = clamp01(finiteNumber(strategy.warStrategic01, 0));
  const supply = clamp01(finiteNumber(strategy.supplyDependency01, 0));
  const leverage = clamp01(finiteNumber(strategy.leverage01, 0));
  return { value01: clamp01(0.45 * war + 0.3 * supply + 0.25 * leverage), warStrategic01: war, leverage01: leverage };
}

/**
 * @typedef {Object} FaithRead
 * @property {boolean} [templeMediated]  the relief runs through a temple (piety warmth + the M11a temple-relief seam)
 * @property {number} [sharedFaith01]    shared-faith closeness in [0,1] (cultureDistance's faith axis — already computed)
 */
/**
 * FAITH (§2.1): temple-mediated relief adds piety warmth; a shared faith adds a modest
 * term. Pure. @param {FaithRead|null|undefined} faith @returns {number} [0,1]
 */
export function faithTerm(faith) {
  if (!faith) return 0;
  const shared = clamp01(finiteNumber(faith.sharedFaith01, 0));
  const temple = faith.templeMediated === true ? 0.4 : 0;
  return clamp01(temple + 0.6 * shared);
}

// ── WITHHOLD-side terms (§2.2) — the risk assessment ──────────────────────────
/**
 * @typedef {Object} MarginRead
 * @property {number} [reserveAboveFloor01] the granary's headroom above the hard reserve floor, 0 (at the floor) … 1 (deep surplus)
 * @property {number} [granaryTrend01]      the granary trend, 0 (falling fast) … 1 (rising) — 0.5 = flat
 * @property {number} [seasonalOutlook01]   the SEASONS forward outlook, 0 (autumn before the hungry gap) … 1 (spring flush)
 */
/**
 * OWN-MARGIN, GRADED AND FORWARD-LOOKING (§2.2): margin is granary trend vs the SEASONAL
 * outlook vs the hard reserve floor — never a binary. Razor-thin (little headroom, falling,
 * autumn) ⇒ this term alone approaches prohibitive (the owner's canonical case). Returns
 * the RISK in [0,1] (high = withhold). Pure.
 * @param {MarginRead|null|undefined} margin @returns {number} [0,1]
 */
export function ownMarginTerm(margin) {
  if (!margin) return 0.5;
  const headroom = clamp01(finiteNumber(margin.reserveAboveFloor01, 0.5));
  const trend = clamp01(finiteNumber(margin.granaryTrend01, 0.5));
  const outlook = clamp01(finiteNumber(margin.seasonalOutlook01, 0.5));
  // A thin, falling reserve in a lean season is near-prohibitive risk. Headroom dominates.
  const safety = clamp01(0.55 * headroom + 0.25 * trend + 0.2 * outlook);
  return clamp01(1 - safety);
}

/**
 * @typedef {Object} CommitmentRead
 * @property {number} [deployedArmies]   count of the giver's armies afield (a standing claim on the granary)
 * @property {number} [mobilization01]   mobilized-posture consumption multiplier read, 0..1
 * @property {number} [warDrain01]       the existing war_drain state, 0..1
 */
/**
 * COMMITMENT LOAD (§2.2): deployed armies + mobilized postures multiply projected
 * consumption. An army afield is a standing claim on the granary — the owner's example
 * term, first-class. Returns RISK in [0,1]. Pure.
 * @param {CommitmentRead|null|undefined} commitment @returns {number} [0,1]
 */
export function commitmentLoadTerm(commitment) {
  if (!commitment) return 0;
  const armies = Math.max(0, Math.floor(finiteNumber(commitment.deployedArmies, 0)));
  const mob = clamp01(finiteNumber(commitment.mobilization01, 0));
  const drain = clamp01(finiteNumber(commitment.warDrain01, 0));
  // Each deployed army is a heavy claim; saturating so two armies ≈ near-max.
  const armyLoad = 1 - Math.pow(0.5, armies); // 0 → 0, 1 → 0.5, 2 → 0.75, 3 → 0.875
  return clamp01(0.6 * armyLoad + 0.25 * mob + 0.15 * drain);
}

/**
 * ROUTE RISK, BELIEF-MEDIATED (§2.2): the relief travels real roads — embattlement,
 * banditry, gate seizure (grain seized at a hostile gate FEEDS THE ENEMY — priced as a
 * hostile-supply transfer), plague hazard — all read through the BELIEF map, never truth
 * (a giver may wrongly withhold on a stale rumor the pass is cut). Delegates the
 * belief-gated read to dispatchEV.believedDestinationDanger, then adds the hostile-gate
 * seizure premium. Returns RISK in [0,1]. Pure.
 * @param {Object} args
 * @param {string} args.giverId
 * @param {string} args.receiverId
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, spatialLedgers?: unknown }|null|undefined} args.worldState
 * @param {{ occupationState?: string|null, besieged?: boolean }} [args.groundTruthStressor]
 * @param {boolean} [args.hostileGateOnRoute]  a gate at war with the receiver sits on the route (seizure feeds the enemy)
 * @returns {number} [0,1]
 */
export function routeRiskTerm({ giverId, receiverId, worldState, groundTruthStressor = {}, hostileGateOnRoute = false }) {
  const believed = clamp01(believedDestinationDanger(String(giverId), String(receiverId), worldState, groundTruthStressor));
  const seizure = hostileGateOnRoute === true ? 0.3 : 0;
  return clamp01(Math.max(believed, seizure) + 0.15 * Math.min(believed, seizure));
}

/**
 * @typedef {Object} DomesticRead
 * @property {number} [ownScarcity01]  the giver's own scarcity band, 0 (comfortable) … 1 (hungry)
 * @property {number} [nerveMod]       the structural-lens domestic-nerve modulator (centered on 1.0)
 */
/**
 * DOMESTIC REACTION (the equal-and-opposite core, §2.2): shipping food out of an anxious
 * town costs the ruler LEGITIMACY scaled by own scarcity — courage with a political
 * price. Comfortable generosity is cheap (a small "granary city" LIFT, returned as a
 * negative risk). Returns SIGNED risk in [-lift, 1]: positive = a legitimacy cost that
 * withholds; negative = the comfortable-giver reputation lift that leans give. Pure.
 * @param {DomesticRead|null|undefined} domestic @returns {number}
 */
export function domesticReactionTerm(domestic) {
  if (!domestic) return 0;
  const scarcity = clamp01(finiteNumber(domestic.ownScarcity01, 0));
  const nerve = clamp(finiteNumber(domestic.nerveMod, 1), 0.5, 2);
  // Hungry ⇒ shipping food out is politically costly (risk up, nerve-scaled). Comfortable
  // ⇒ a small bounded reputation lift (the "granary city" earns legitimacy).
  const cost = scarcity * nerve;
  const lift = (1 - scarcity) * 0.15;
  return clamp(cost - lift, -0.15, 1);
}

/**
 * DEPENDENCY / MORAL HAZARD (§2.2): repeated relief to the same receiver is a governance
 * problem, not a harvest problem ("the third famine in five years"). The kernel discounts
 * chronic asks — the risk rises with the recent relief count to this receiver. Returns
 * RISK in [0,1]. Pure. @param {number} [reliefCountRecent] @returns {number}
 */
export function dependencyTerm(reliefCountRecent = 0) {
  const n = Math.max(0, Math.floor(finiteNumber(reliefCountRecent, 0)));
  // 0 → 0, 1 → 0, 2 → 0.25, 3 → 0.5, 4+ → ramps toward 0.75 (chronic dependence).
  if (n <= 1) return 0;
  return clamp01((n - 1) * 0.25);
}

// ── THE VERDICT — EV + the willingness hysteresis latch (§2.3) ─────────────────
/**
 * @typedef {Object} GenerosityWillingness
 * @property {'refusing'} phase   only the REFUSING phase materializes (giving = absent/default)
 * @property {number} sinceTick   the tick refusal began (the dwell clock)
 * @property {number} lastTick    the tick this record last advanced
 */

/**
 * @typedef {Object} GenerosityInputs
 * @property {string} giverId
 * @property {string} receiverId
 * @property {string} [kind]        the instrument kind (default 'grain_relief')
 * @property {number} now           tick-time
 * @property {BondRead|null} [bond]
 * @property {HistoryRead|null} [history]
 * @property {ConscienceRead|null} [conscience]
 * @property {StrategyRead|null} [strategy]
 * @property {FaithRead|null} [faith]
 * @property {MarginRead|null} [margin]
 * @property {CommitmentRead|null} [commitment]
 * @property {number} [routeRisk]    a pre-computed belief-gated route risk [0,1] (else 0)
 * @property {DomesticRead|null} [domestic]
 * @property {number} [reliefCountRecent]
 * @property {number} [askFraction01]  the share of the giver's spareable reserve the ask represents (1 = asks all headroom)
 * @property {{ bond?: number, conscience?: number, gate?: number }} [quadrantMod]  the faith-alignment quadrant modulators (cohesion B; centered 1.0)
 * @property {{ conscience?: number, strategy?: number, leverage?: number, domesticNerve?: number, hysteresisWiden?: number }} [lensMod]  the structural-lens modulators (cohesion C)
 * @property {boolean} [conscienceException]  the good-aligned charity exception (caps magnitude)
 * @property {GenerosityWillingness|null} [priorWillingness]
 */

/**
 * @typedef {Object} GenerosityVerdict
 * @property {string} verdict            one of VERDICTS.*
 * @property {number} magnitudeFraction  the share of the ask granted [0,1] (0 for REFUSE)
 * @property {number} giveScore          the blended attraction [0,1]
 * @property {number} withholdScore      the blended risk [0,1]
 * @property {number} netWithhold        withholdScore − giveScore (the deadband variable)
 * @property {boolean} floorForbids      the hard reserve floor forbade any gift (before override)
 * @property {boolean} strategicOverride a war-strategic read relaxed the floor (the canonical flip)
 * @property {GenerosityWillingness|null} willingness  the next latch (null ⇒ giving ⇒ prune)
 * @property {{ bond: number, history: number, conscience: number, strategy: number, faith: number, margin: number, commitment: number, route: number, domestic: number, dependency: number }} terms  the deciding terms (the loaded-dice receipts, §H)
 * @property {string} receipt            the house-voice narration of the ACTUAL deciding terms
 */

/**
 * THE GENEROSITY KERNEL — one qualifying pair's relief verdict this tick (§2). Assumes
 * the §0.1 gate already passed (qualifiesForGenerosity); a caller that skips the gate on
 * a cold pair gets a REFUSE. The verdict is DETERMINISTIC given its inputs (the dice are
 * loaded by the terms, and the terms ARE the receipt — §H); hysteresis mirrors
 * dispatchDecision. Pure. @param {GenerosityInputs} inputs @returns {GenerosityVerdict}
 */
export function generosityEV(inputs) {
  const T = GENEROSITY_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(inputs?.now, 0)));
  const qMod = inputs?.quadrantMod || {};
  const lMod = inputs?.lensMod || {};
  const qBond = clamp(finiteNumber(qMod.bond, 1), 0.5, 2);
  const qConscience = clamp(finiteNumber(qMod.conscience, 1), 0.5, 2);
  const qGate = clamp(finiteNumber(qMod.gate, 1), 0.5, 2);
  const lConscience = clamp(finiteNumber(lMod.conscience, 1), 0.5, 2);
  const lStrategy = clamp(finiteNumber(lMod.strategy, 1), 0.5, 2);
  const lLeverage = clamp(finiteNumber(lMod.leverage, 1), 0.5, 2);
  const lDomesticNerve = clamp(finiteNumber(lMod.domesticNerve, 1), 0.5, 2);
  const hysteresisWiden = clamp(finiteNumber(lMod.hysteresisWiden, 1), 1, 3);

  // GIVE-side terms, each modulated (quadrant/lens, centered 1.0) then clamped to [0,1].
  const bond = clamp01(bondTerm(inputs?.bond) * qBond);
  const hist = historyTerm(inputs?.history);
  const conscienceRaw = clamp01(conscienceTerm(inputs?.conscience) * qConscience * lConscience);
  const strat = strategyTerm(inputs?.strategy);
  const strategyVal = clamp01(strat.value01 * lStrategy);
  const leverageIntent = clamp01(strat.leverage01 * lLeverage);
  const faith = faithTerm(inputs?.faith);

  // The betrayal killswitch zeros the give-side (§2.1).
  const giveRaw = hist.betrayalKill ? 0 : clamp01(
    T.W_BOND * bond
    + T.W_HISTORY * hist.value01
    + T.W_CONSCIENCE * conscienceRaw
    + T.W_STRATEGY * strategyVal
    + T.W_FAITH * faith,
  );
  const giveScore = giveRaw;

  // WITHHOLD-side terms (the risk assessment, §2.2).
  const margin = ownMarginTerm(inputs?.margin);
  const commitment = commitmentLoadTerm(inputs?.commitment);
  const route = clamp01(finiteNumber(inputs?.routeRisk, 0));
  const domestic = domesticReactionTerm(inputs?.domestic
    ? { ...inputs.domestic, nerveMod: finiteNumber(inputs.domestic.nerveMod, lDomesticNerve) }
    : null);
  const dependency = dependencyTerm(inputs?.reliefCountRecent);

  const withholdScore = clamp01(
    T.W_MARGIN * margin
    + T.W_COMMIT * commitment
    + T.W_ROUTE * route
    + T.W_DOMESTIC * domestic
    + T.W_DEPEND * dependency,
  );

  const netWithhold = withholdScore - giveScore;

  // The hysteresis latch (mirror of dispatchDecision): enter refusing > ENTER, resume <
  // EXIT AND dwelled. The structural-lens hysteresisWiden multiplies the deadband + dwell
  // (a council's averaged decisions are stickier — §C). The gate modulator sharpens the
  // refusal boundary (a natural-enemy pair refuses more readily).
  const enter = T.REFUSE_ENTER * hysteresisWiden / qGate;
  const exit = T.REFUSE_EXIT * hysteresisWiden;
  const dwell = Math.ceil(T.REFUSE_DWELL * hysteresisWiden);
  const priorWillingness = inputs?.priorWillingness || null;
  const priorRefusing = !!(priorWillingness && priorWillingness.phase === 'refusing');
  const priorSince = priorRefusing && priorWillingness ? Math.floor(finiteNumber(priorWillingness.sinceTick, now)) : now;
  let latchRefusing = priorRefusing;
  let sinceTick = priorSince;
  if (!priorRefusing) {
    if (netWithhold > enter) { latchRefusing = true; sinceTick = now; }
  } else if (netWithhold < exit && (now - priorSince) >= dwell) {
    latchRefusing = false;
  }

  // MAGNITUDE above the HARD reserve floor (never crossed — the property invariant). The
  // floor keys on the giver's ACTUAL headroom above the reserve (reserveAboveFloor01) — the
  // graded, forward-looking ownMarginTerm above feeds the EV/latch, but the hard floor is
  // the reserve itself. The ask consumes askFraction01 of that headroom.
  const askFraction = clamp01(finiteNumber(inputs?.askFraction01, 1));
  const reserveHeadroom = clamp01(finiteNumber(inputs?.margin?.reserveAboveFloor01, 0.5));
  // THE STRATEGIC OVERRIDE (canonical example, part 2): a war-strategic read at/above
  // OVERRIDE_AT is a "defense spending" imperative that both RELAXES the hard floor AND
  // OVERRIDES the risk latch (mirroring dispatchDecision's must-go/relief override) —
  // feeding the pass-garrison ally IS defense spending. It flips a REFUSE to a GIVE_PARTIAL.
  const strategicOverrideActive = strat.warStrategic01 >= T.OVERRIDE_AT;
  const effectiveHeadroom = strategicOverrideActive
    ? clamp01(reserveHeadroom + T.OVERRIDE_FLOOR_RELIEF * strat.warStrategic01 * (1 - reserveHeadroom))
    : reserveHeadroom;
  const rawAffordability = askFraction <= 0 ? 1 : clamp01(reserveHeadroom / askFraction);
  const affordability = askFraction <= 0 ? 1 : clamp01(effectiveHeadroom / askFraction);
  const rawFloorForbids = rawAffordability <= T.MAGNITUDE_EPS;
  // Without the override, would this have been a REFUSE? (the latch OR the hard floor) —
  // the flag the receipt/verdict use to know the override was consequential.
  const wouldRefuse = latchRefusing || rawFloorForbids;
  const refusing = strategicOverrideActive ? false : latchRefusing;
  const floorForbids = strategicOverrideActive ? false : rawFloorForbids;

  // How much the giver WANTS to give ramps magnitude from a reluctance base to full at
  // GIVE_ENTHUSIASM_FULL give-score (a strongly-motivated giver gives all it can spare).
  const willingnessScale = clamp01(T.RELUCTANCE_BASE + (1 - T.RELUCTANCE_BASE) * clamp01(giveScore / T.GIVE_ENTHUSIASM_FULL));
  let magnitudeFraction = clamp01(affordability * willingnessScale);

  // The conscience EXCEPTION caps magnitude to a small charitable dole (§2.1 / scenario 2).
  if (inputs?.conscienceException === true) {
    magnitudeFraction = Math.min(magnitudeFraction, T.CONSCIENCE_EXCEPTION_CAP);
  }

  // Compose the tier. REFUSE if the latch is refusing OR the floor forbids any gift.
  /** @type {string} */
  let verdict;
  if (refusing || magnitudeFraction <= T.MAGNITUDE_EPS) {
    verdict = VERDICTS.REFUSE;
    magnitudeFraction = 0;
  } else if (leverageIntent >= T.CREDIT_AT) {
    verdict = VERDICTS.GIVE_AS_CREDIT; // gives to indebt — prefers a loan over a gift (§2.1)
  } else if (magnitudeFraction >= T.FULL_AT) {
    verdict = VERDICTS.GIVE_FULL;
  } else {
    verdict = VERDICTS.GIVE_PARTIAL;
  }

  const terms = {
    bond: round4(bond), history: round4(hist.value01), conscience: round4(conscienceRaw),
    strategy: round4(strategyVal), faith: round4(faith),
    margin: round4(margin), commitment: round4(commitment), route: round4(route),
    domestic: round4(domestic), dependency: round4(dependency),
  };

  return {
    verdict,
    magnitudeFraction: round4(magnitudeFraction),
    giveScore: round4(giveScore),
    withholdScore: round4(withholdScore),
    netWithhold: round4(netWithhold),
    floorForbids,
    strategicOverride: strategicOverrideActive && wouldRefuse,
    willingness: refusing ? { phase: 'refusing', sinceTick, lastTick: now } : null,
    terms,
    receipt: generosityReceipt({
      verdict, giverId: String(inputs?.giverId ?? ''), receiverId: String(inputs?.receiverId ?? ''),
      terms, strategicOverride: strategicOverrideActive && wouldRefuse, leverageIntent,
    }),
  };
}

// ── PRECEDENT / TRIAGE (§2.2 / scenario 4) — many claimants, one granary ────────
/**
 * @typedef {Object} TriageClaimant
 * @property {string} id
 * @property {number} giveScore01   the pair's blended attraction (from generosityEV) — the triage rank
 * @property {number} need01        the claimant's desperation (drives the split share + the slight)
 */
/**
 * Allocate one granary across several simultaneous claimants (§2.2 PRECEDENT/TRIAGE). All
 * are scored by the SAME EV (giveScore01); then character decides the SHAPE: a LAWFUL giver
 * splits toward fairness (proportional to need across the funded claimants), a PRAGMATIC one
 * feeds the buffer state (the top-ranked claimant) whole, then the next, until the budget is
 * spent. A claimant left short banks a SLIGHT (§3.3) — REDUCED when the giver's constraint is
 * PUBLICLY BELIEVED (fog-forgiveness applies to triage too). Deterministic (codepoint tiebreak
 * on id; zero rng — the loading is the need/score, §H). Pure.
 * @param {Object} args
 * @param {ReadonlyArray<TriageClaimant>} args.claimants
 * @param {number} args.budget01                 the giver's total spareable headroom [0,1]
 * @param {number} [args.lawfulness01]           0 pragmatic … 1 lawful (default 0.5)
 * @param {boolean} [args.constraintPubliclyBelieved]  the giver's scarcity is public ⇒ smaller slights
 * @returns {{ allocations: Record<string, number>, slights: Record<string, number> }}
 */
export function triageAllocation({ claimants, budget01, lawfulness01 = 0.5, constraintPubliclyBelieved = false }) {
  const budget = clamp01(finiteNumber(budget01, 0));
  const lawful = clamp01(finiteNumber(lawfulness01, 0.5));
  const list = (Array.isArray(claimants) ? claimants : [])
    .filter((c) => c && typeof c === 'object')
    .map((c) => ({ id: String(c.id), score: clamp01(finiteNumber(c.giveScore01, 0)), need: clamp01(finiteNumber(c.need01, 0)) }))
    // Rank by attraction desc, then codepoint id asc (deterministic tiebreak).
    .sort((a, b) => (b.score - a.score) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  /** @type {Record<string, number>} */
  const allocations = {};
  /** @type {Record<string, number>} */
  const slights = {};
  if (!list.length) return { allocations, slights };

  // Lawful: split the budget across claimants in proportion to NEED (fairness). Pragmatic:
  // feed the top-ranked whole, then the next, until the budget drains (the buffer state
  // whole). A blend interpolates by lawfulness.
  const needSum = list.reduce((a, c) => a + c.need, 0) || 1;
  let remaining = budget;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    const fairShare = budget * (c.need / needSum);              // lawful split
    const greedyShare = Math.min(remaining, c.need);            // pragmatic: top-first, need-capped
    const share = clamp01(lawful * fairShare + (1 - lawful) * greedyShare);
    const granted = Math.min(share, remaining, c.need);
    allocations[c.id] = round4(granted);
    remaining = clamp01(remaining - granted);
    // The slight: unmet need, reduced when the constraint is publicly believed (fog).
    const unmet = clamp01(c.need - granted);
    const fogReduce = constraintPubliclyBelieved === true ? 0.4 : 1;
    if (unmet > 0.02) slights[c.id] = round4(clamp01(unmet * fogReduce));
  }
  return { allocations, slights };
}

// ── THE HOUSE-VOICE RECEIPT — narrates the ACTUAL deciding terms (§2.3, §H) ─────
/**
 * The dominant deciding term drives the receipt's voice — the loaded dice narrated
 * (design §2.3: "Thornwall's granaries stayed shut: the army at the front eats first" /
 * "Grain went to Marchmont — the old debt from the flood-year, and their pass shields the
 * valley"). Pure, deterministic.
 * @param {{ verdict: string, giverId: string, receiverId: string, terms: { bond: number, history: number, conscience: number, strategy: number, faith: number, margin: number, commitment: number, route: number, domestic: number, dependency: number }, strategicOverride: boolean, leverageIntent: number }} a
 * @returns {string}
 */
export function generosityReceipt({ verdict, giverId, receiverId, terms, strategicOverride, leverageIntent }) {
  const g = giverId || 'the giver';
  const r = receiverId || 'the receiver';
  if (verdict === VERDICTS.REFUSE) {
    // Name the dominant withhold term.
    if (terms.commitment >= terms.margin && terms.commitment >= terms.route && terms.commitment > 0.2) {
      return `${g}'s granaries stayed shut: the army at the front eats first.`;
    }
    if (terms.route >= terms.margin && terms.route > 0.2) {
      return `${g} held the grain back — the road to ${r} is cut, and seized bushels feed the enemy.`;
    }
    if (terms.dependency > 0.3) {
      return `${g}'s patience thins: ${r} asks again, and a repeated dole is a governance problem, not a harvest one.`;
    }
    return `${g} kept the granaries shut — the reserve sits a razor above its own hunger line.`;
  }
  if (verdict === VERDICTS.GIVE_AS_CREDIT) {
    return `${g} advanced grain to ${r} — as a loan, not a gift: the ledger of the debt begins.`;
  }
  // A gift (full or partial).
  const reasons = [];
  if (strategicOverride) reasons.push(`their ground shields ${g}'s flank — the granary opened as defense spending`);
  if (terms.history > 0.35) reasons.push('the old debt from the flood-year');
  if (terms.bond > 0.4) reasons.push('the bond between the two courts');
  if (terms.conscience > 0.3) reasons.push('plain mercy for the hungry');
  if (terms.faith > 0.3) reasons.push('a shared altar');
  if (leverageIntent > 0.3) reasons.push('and a favour owed is a favour banked');
  const tail = reasons.length ? ` — ${reasons.slice(0, 3).join(', ')}` : '';
  const head = verdict === VERDICTS.GIVE_PARTIAL
    ? `A tenth of what was asked went to ${r}, with apologies`
    : `Grain went to ${r}`;
  return `${head}${tail}.`;
}

// ── THE LOADED-DICE PRIMITIVE (§H) — seeded fork on a stable key, weighted draw ──
/**
 * The stable composite fork key for a generosity draw (design §2 / §H): content-derived,
 * order-independent per (giver, receiver, kind, tick). The dice are keyed here; the
 * WEIGHTS (the situation loading) are supplied to loadedDraw. Pure.
 * @param {string} giverId @param {string} receiverId @param {string} kind @param {number} tick
 * @returns {string}
 */
export function generosityForkKey(giverId, receiverId, kind, tick) {
  return `generosity:${String(giverId)}:${String(receiverId)}:${String(kind)}:${Math.max(0, Math.floor(finiteNumber(tick, 0)))}`;
}

/**
 * THE LOADED DRAW (§H): sample an index from a SITUATION-WEIGHTED distribution on a
 * seeded fork. The weights come FIRST from state (EV scores, pressures, character) — the
 * fork only picks within what the world has already made probable. A flat draw among
 * options the situation differentiates is a DESIGN BUG (§H); this primitive forbids it by
 * construction (equal weights degrade to a uniform tie-break, the only legal flat case).
 * Deterministic given (rng, key). @param {{ fork?: (k: string) => { random: () => number } }|null} rng
 * @param {string} key @param {ReadonlyArray<number>} weights @returns {number} the selected index (0 when empty/degenerate)
 */
export function loadedDraw(rng, key, weights) {
  const ws = (Array.isArray(weights) ? weights : []).map((w) => Math.max(0, finiteNumber(w, 0)));
  const total = ws.reduce((a, b) => a + b, 0);
  if (ws.length === 0) return 0;
  if (total <= 0) return 0; // genuinely indifferent ⇒ index 0 (the caller's canonical default)
  const fork = rng && typeof rng.fork === 'function' ? rng.fork(key) : null;
  const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 0)) : 0;
  let acc = 0;
  const threshold = u * total;
  for (let i = 0; i < ws.length; i++) {
    acc += ws[i];
    if (threshold < acc) return i;
  }
  return ws.length - 1;
}

/**
 * THE SIGNIFICANCE / INITIATION GATE (§6): does a relief ASK even fire this tick? A
 * situation-LOADED bernoulli on the seeded fork — the base chance is scaled by the
 * pressure (a deep famine + a strong bond makes the ask near-certain; a mild need barely
 * whispers), keeping generosity RARE AND MEANINGFUL. Deterministic given (rng, key).
 * Monotone in pressure (more pressure ⇒ ≥ fire probability). Pure.
 * @param {{ fork?: (k: string) => { random: () => number } }|null} rng
 * @param {string} key @param {number} pressure01  the situation loading [0,1]
 * @param {number} [baseChance]  the rarity baseline (default 0.15)
 * @returns {boolean}
 */
export function shouldInitiateAsk(rng, key, pressure01, baseChance = 0.15) {
  const p = clamp01(finiteNumber(pressure01, 0));
  const base = clamp01(finiteNumber(baseChance, 0.15));
  const chance = clamp01(base + (1 - base) * p * p); // loaded: pressure² ramps the rarity baseline
  const fork = rng && typeof rng.fork === 'function' ? rng.fork(key) : null;
  const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
  return u < chance;
}

// ── THE INSTRUMENT CATALOG (§4) — what generosity can move ─────────────────────
/**
 * @typedef {Object} GenerosityInstrument
 * @property {string} kind
 * @property {boolean} conservationExact  the gift/credit/purchase balances to the integer (§6)
 * @property {boolean} live               shipped in E1a (grain_relief + warning); others registered, wiring deferred
 * @property {string} note
 */

/**
 * The instrument set (design §4). E1a ships GRAIN RELIEF (the flagship) LIVE and registers
 * the WARNING act (statecraft §2.4, sacrifice-priced) LIVE; PURCHASE / CREDIT / TRADE
 * OVERTURE / REFUGE are registered with their wiring deferred to E1b–E1c (design §8), so
 * the catalog is auditable rather than aspirational. FROZEN.
 * @type {Readonly<Record<string, GenerosityInstrument>>}
 */
export const GENEROSITY_INSTRUMENTS = Object.freeze({
  grain_relief: { kind: 'grain_relief', conservationExact: true, live: true, note: 'The flagship: rides supplyShipments kind:relief; tolls apply; aspatial fallback = a bounded instant transfer.' },
  warning: { kind: 'warning', conservationExact: false, live: true, note: 'Statecraft §2.4 GIVE lane: warning an ally, priced by the SACRIFICE of the telling (strategic advantage spent + eyes exposed), not the value received. The intel-posture coupling lands with W-DOCTRINE.' },
  purchase: { kind: 'purchase', conservationExact: true, live: false, note: 'The market twin (E1b) — shares the dispatch scorer.' },
  credit: { kind: 'credit', conservationExact: true, live: false, note: 'Credit/investment maturity + appetite (E1b, §3.4).' },
  trade_overture: { kind: 'trade_overture', conservationExact: true, live: false, note: 'Subsidized channel (E1b).' },
  refuge: { kind: 'refuge', conservationExact: true, live: false, note: 'People, not goods (E1c): an acceptance posture gating M4 destination choice.' },
});

/**
 * THE WARNING-GIFT SACRIFICE PRICE (statecraft §2.4): a warning's sacrifice is what the
 * TELLING cost — strategic advantage surrendered plus (sometimes) paid eyes exposed —
 * NOT what the intelligence was worth to hear. This feeds the widow's-mite gratitude
 * (generosityReactions): a warning that saved the granary binds like grain given in
 * famine. Returns the sacrifice in [0,1]. Pure.
 * @param {{ strategicAdvantageSpent01?: number, eyesExposed01?: number }} [inputs]
 * @returns {number}
 */
export function warningSacrifice({ strategicAdvantageSpent01 = 0, eyesExposed01 = 0 } = {}) {
  const adv = clamp01(finiteNumber(strategicAdvantageSpent01, 0));
  const eyes = clamp01(finiteNumber(eyesExposed01, 0));
  return clamp01(0.7 * adv + 0.5 * eyes - 0.2 * adv * eyes); // both cost, with mild overlap
}

// ── THE DORMANCY GATE (§6) — a virtual, defensively-read flag (no serialized default) ──
/**
 * Is the constructive-flows layer LIT? Reads simulationRules.constructiveFlowsEnabled ===
 * true, defensively — ABSENT ⇒ false ⇒ DORMANT ⇒ the pair is never even asked (byte-
 * identical; NO default is added to DEFAULT_SIMULATION_RULES, so goldens do not move —
 * the owner lights presets in a later signed event). Mirrors E0's narrativeTempoOf
 * fail-closed reader. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function constructiveFlowsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).constructiveFlowsEnabled === true);
}
