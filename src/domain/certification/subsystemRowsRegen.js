/**
 * subsystemRowsRegen.js — SUBSYSTEM CERTIFICATION ROWS for the ONE REGEN cohort:
 * the eight chartered engine lifts plus the roads adjunct, lit together at the
 * single declared golden boundary (the `ONE_REGEN` spread in
 * worldPulse/simulationRules.js).
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and the evidence law. Both are binding here.
 *
 * SIDECAR NOTE for whoever authors these rows: most of this cohort writes an
 * authoritative spatialLedgers sidecar plus a compact per-settlement mirror
 * (urbanFabric, npcLadder, traditions, provenance). The sidecar key is the honest
 * aliveness channel and it is receipt-expressible from the v5
 * subsystems.stateKeys census; the settlement mirror is not carried in any
 * receipt, so it cannot be claimed.
 *
 * EPISTEMICS NOTE (2026-07-31): the two knowledge-lane members of this cohort
 * (distancePricedNewsEnabled, provenanceLedgerEnabled) are authored below. Their
 * aliveness sources come from ./knowledgeLaneEvidence.js rather than being
 * re-derived here, because the `knowledge` mover family is CONTAMINATED (fifteen
 * unrelated impactKinds fall into it through the `news` token in their own
 * wizard-news id) and a row that re-derived it by hand would almost certainly
 * claim it. See that file for the executed census behind the finding.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemRowsEpistemics.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The regen lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const REGEN_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'distancePricedNewsEnabled',
    title: 'Distance-priced news',
    module: 'src/domain/worldPulse/distancePricedNews.js,src/domain/worldPulse/beliefMap.js,src/domain/display/settlementRumors.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. This subsystem mints NO candidate type and NO news
      // entry of its own. It is a pure MODIFIER: routeAwareHopDelayTicks adds an
      // integer surcharge to a report's effective age inside an existing fold
      // (beliefMap.js:660) and to a displayed rumor's age (settlementRumors.js:571).
      // The lane it modifies is the belief lane, whose one vocabulary literal is
      // KNOWLEDGE_LANE_EVENT_TYPES; claiming that literal here would grade this
      // row ALIVE on the belief engine's work rather than on the surcharge.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and emphatically so: the `knowledge` family is a
      // RESIDUAL bucket (see knowledgeLaneEvidence.js), so it cannot corroborate
      // anything here, let alone carry a verdict.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. spatialLedgers.beliefMaps is the obvious container and
      // is NOT a faithful gate: the belief advance writes it on every active tick
      // whether or not the surcharge applied — the write is
      // pulseKernel.js `setSpatialLedger(memoryState, 'beliefMaps', beliefs.next)`,
      // reached through beliefsActive alone. Declaring it would certify a world in
      // which every hop delay evaluated to zero.
      stateKeys: Object.freeze([]),
      other: 'THE HONEST GAP. distancePricedNewsActive (beliefMap.js:282) is an AND of beliefsActive (a spatialCanonVersion marker AND infoMode other than omniscient) and the virtual flag, so the flag alone never proves the lane ran. The surcharge then changes only the RATE at which a belief converges on ground truth, and no receipt field observed that rate until 2026-07-31. What would close the gap is a PAIRED run, not a richer single receipt: two soaks on one seed, one with the flag lit and one dark, compared over the new per-year beliefDivergence series (BELIEF_DIVERGENCE_RECEIPT_PATH). The lit arm must show belief lagging ground truth by more at equal distance. Half of that instrument now exists; the differential harness does not, so this row reads UNOBSERVED and says why, rather than borrowing evidence from the belief engine it merely modifies.',
    }),
    // The surcharge is recomputed on EVERY read of EVERY report, every tick (it
    // stores nothing, which is exactly why it re-prices in flight as routes sever
    // and open). The cadence is real even though nothing observes it.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'pricing_needs_a_canonized_realm',
        description: 'A lit flag over an uncanonized or omniscient realm is a configuration finding, not aliveness. Both halves of the gate must hold before this subsystem can have run at all.',
        check: 'In any receipt whose subsystems.rules records distancePricedNewsEnabled true, the v5 subsystems.stateKeys census carries spatialCanonVersion (the marker half of beliefsActive) and every behavioral.yearly[].beliefDivergence.infoMode reads something other than omniscient. Expressible from the v5 census plus the per-year belief-divergence block.',
      }),
      Object.freeze({
        name: 'pricing_never_severs_belief',
        description: 'The surcharge only AGES a report; it must never age every report out of existence. A realm that hears rumors and forms no belief at all has been silenced by the pricing rather than fogged by it.',
        check: 'When the v5 census carries spatialLedgers.rumorLedgers with maxEntries above zero, it also carries spatialLedgers.beliefMaps with maxEntries above zero, and the beliefMaps years count is at least the rumorLedgers years count minus one (a belief forms the tick after its report arrives). Expressible from the folded v5 stateKeys census alone.',
      }),
      Object.freeze({
        name: 'divergence_is_fog_not_blindness',
        description: 'Distance-priced news deepens fog. It does not make every observer permanently wrong: a belief that is never corrected is a broken lane, not a slow one.',
        check: 'Across behavioral.yearly[].beliefDivergence, divergence01 is either null (nothing comparable) or within 0..1, and it is not pinned at exactly 1 in every year of the final decade while relationshipComparable reads above zero in those years. Expressible from the per-year belief-divergence block.',
      }),
    ]),
    // Nothing in any completed receipt can separate a priced run from an unpriced
    // one. That is the diagnosis, and it is the deliverable.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'provenanceLedgerEnabled',
    title: 'Provenance ledger',
    module: 'src/domain/worldPulse/provenanceKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The provenance kernel is a RECORDER at the durable
      // commit seam (appendPulseHistoryWithProvenance, provenanceKernel.js:451).
      // It mints no candidate and no news entry, so it can never appear in a
      // receipt's eventTypeCounts.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. It classifies nothing into a mover family; it records
      // the edges BETWEEN other subsystems' receipts.
      moverFamilies: Object.freeze([]),
      // The authoritative ledger, and this row's only dispositive channel. Traced
      // to the literal-key writes in recordProvenanceLedger (setSpatialLedger at
      // provenanceKernel.js:305, dropSpatialLedger at :304 and :376). Receipt
      // expressible only from the v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.provenance']),
      other: 'TWO ROUTES, ONE SUBSYSTEM. On a v5 receipt the census reads the ledger directly. On a v4 receipt the ledger is still visible INDIRECTLY: behavioral-observation.mjs causalObservationOf switches to the recorded ledger whenever provenanceLedgerEnabled is true, so a lit v4 receipt reporting behavioral.yearly[].causal.crossFamilyEdges above zero could only have got those edges from a materialized ledger. Measured on the completed cases: 68 cross-family edges over 30 years at 12 settlements, 24 over 100 years at 4. KNOWN INSTRUMENT LIMIT: the folded census keeps years, maxEntries and finalEntries only, and the ledger key PERSISTS once created, so the census proves the recorder ran but cannot show the year in which it stopped growing. The causal series is the finer cadence signal and it is per year.',
    }),
    // Recorded at every durable commit that carries at least one receipt with a
    // parent edge, or any mechanical receipt at all. Mechanical receipts land
    // constantly, so a recorder quiet in most years has stopped recording.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormant_writes_no_ledger',
        description: 'The flag is the whole subsystem. A dark campaign must serialize byte-identically to one that never had a provenance kernel, which means the ledger key is never created at all.',
        check: 'In any receipt whose subsystems.rules records provenanceLedgerEnabled false and whose subsystems.stateKeysComplete is true, the stateKeys census carries no spatialLedgers.provenance entry. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'ledger_respects_the_size_governor',
        description: 'The ledger is horizon-compacted at MAX_PROVENANCE_EDGES (4096, provenanceKernel.js:90), evicting lowest-tick first. An unbounded ledger is the cost regression this governor exists to prevent.',
        check: 'The v5 stateKeys census entry for spatialLedgers.provenance has maxEntries at or below 4096. Expressible from the folded v5 census alone, at any horizon.',
      }),
      Object.freeze({
        name: 'recorded_causality_replaces_inference',
        description: 'When the ledger is lit, the receipt\'s causal composition is RECORDED rather than entity-inferred. A lit run whose cross-family edge count is zero at every horizon means the DAG never crossed a family boundary, which is a composition finding worth surfacing.',
        check: 'In a receipt whose recorded rule state has provenanceLedgerEnabled true, the summed behavioral.yearly[].causal.crossFamilyEdges is above zero over the release horizon, and the same receipt carries spatialLedgers.provenance in its v5 census when it has one. Expressible from the v4 causal block plus the v5 census.',
      }),
    ]),
    // The 30-year and 100-year release cases both measured recorded cross-family
    // edges, which only the materialized ledger can produce.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'traditionsEnabled',
    title: 'Living traditions',
    module: 'src/domain/worldPulse/traditionsKernel.js,src/domain/traditions/genesis.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The traditions mover emits NO candidateType at all: its
      // whole output is post-apply wizardNews (impactKind 'tradition' at
      // traditionsKernel.js:501, 'tradition_change' at :534) plus its sidecar. The
      // observer builds eventTypeCounts from the SELECTED records only
      // (behavioral-observation.mjs:605), so a post-apply beat can never enter that
      // channel, however loudly the lane fires. Declaring a literal here would be a
      // channel this subsystem is structurally unable to reach.
      eventTypes: Object.freeze([]),
      // Corroborating only, and unusually informative for a shared family: on a
      // deity-free fixture the religion lane is inert, so the receipt `faith` family
      // is dominated by this lane. See `other` for the executed rate match.
      moverFamilies: Object.freeze(['faith']),
      // The authoritative sidecar (setSpatialLedger at traditionsKernel.js:825,
      // dropped when empty at :826). The compact settlement.traditions mirror is the
      // display copy and rides no receipt, so it cannot be claimed. Receipt
      // expressible only from the v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.traditions']),
      other: 'THE RATE MATCH, EXECUTED 2026-07-31. Traditions are minted once per settlement at its first lit tick (deriveFoundingTraditions, capped per tier by traditionCountCap) and each one opens ONE occurrence window per year, so a healthy lane emits about one beat per tradition per settlement-year. Re-deriving the founding sets under the exact soak seeds and archetypes and comparing them to the single observed year of the one-year release cases: 12 settlements minted 38 traditions against 38 postApply faith beats, 30 settlements minted 94 against 94, 24 settlements minted 74 against 75, 4 settlements minted 12 against 15. The multi-year cases hold the same rate (3.20 and 3.32 faith beats per settlement-year at 30 years, 3.25 at 100). That is strong corroboration that the lane runs every year of every completed case, and it is STILL NOT PROOF, because `faith` is a shared family: the correct verdict on a v4 receipt is UNOBSERVED with the corroborating-only flag set, not ALIVE. A tradition beat lands in `faith` rather than `knowledge` only because the token `tradition` precedes `news` in the family order; a tradition whose generated name carried an earlier family token (for instance a harvest rite, since `harvest` is a `place` token) would be filed elsewhere, which is a second reason this family cannot be dispositive. THE OBSERVATION NEEDED: the v5 subsystems.stateKeys census, which makes spatialLedgers.traditions readable and turns this row ALIVE on its own sidecar.',
    }),
    // The occurrence window opens once per year per tradition (weeks are canonical),
    // so a settlement with traditions should carry beats in most observed years. A
    // year of hard stressors or a desperate economy cancels the observance, which is
    // the lane working rather than failing.
    expectedTempo: 'yearly',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormant_writes_no_ledger_and_no_beat',
        description: 'The virtual flag is the whole subsystem: dark means zero derivation, zero ledger key, zero mirror and zero news, byte-identical to the pre-wire engine.',
        check: 'In any receipt whose subsystems.rules records traditionsEnabled false and whose subsystems.stateKeysComplete is true, the stateKeys census carries no spatialLedgers.traditions entry. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'observance_is_annual_not_per_tick',
        description: 'A tradition occurs once a year, not once a tick. A per-tick cadence would mean the yearly window guard failed and the calendar stopped bounding the lane.',
        check: 'The postApply faith beats attributable to this lane in any observed year do not exceed the summed per-settlement traditionCountCap of the realm. Expressible from behavioral.yearly[].postApplyMoverCounts.faith ONLY as an upper bound, because the family is shared; it becomes exact when the receipt carries a per-impactKind census.',
      }),
      Object.freeze({
        name: 'traditions_persist_once_founded',
        description: 'The founding set is minted once and persists. A ledger that shrinks toward empty means observances are being dropped rather than kept, cancelled or reshaped.',
        check: 'The v5 stateKeys census entry for spatialLedgers.traditions has finalEntries at or above the first observed maxEntries, and its years count equals the observed year count. Expressible from the folded v5 census alone.',
      }),
    ]),
    // Gates lit and the lane almost certainly running, but the only dispositive
    // channel is a v5 census no completed receipt carries.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'reframeEnabled',
    title: 'The reframe layer',
    module: 'src/domain/worldPulse/reframeKernel.js,src/domain/worldPulse/warReasons.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The reframe mover mints NO candidate and NO news entry:
      // advanceReframe returns newsEntries always empty (reframeKernel.js:344 and
      // the fold at :488), a fact two display modules already record in comments
      // (newsVoice.js:489 and :633). It re-READS frozen facts and folds an
      // interpretation; nothing it does is an event.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. With no news entry there is nothing for the observer to
      // classify, so this subsystem cannot move any mover family, not even a shared
      // one. Its downstream consumers (the ingratitude_debt and dependency_by_design
      // war reasons, their debt_forgiven and bonds_of_commerce peace mirrors, the
      // restitution term, the corruption leash) change how OTHER lanes score; a
      // family that moved because of them would be their evidence, never this row.
      moverFamilies: Object.freeze([]),
      // The one artifact this subsystem owns (setSpatialLedger at
      // reframeKernel.js:488, dropped when empty at :489). Receipt expressible only
      // from the v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.reframes']),
      other: 'A SUBSYSTEM WITH ONE OBSERVABLE, AND v4 CANNOT SEE IT. The mover is folded into advanceWarReasons behind its OWN gate (warReasons.js:650), independent of the peace engine, so it runs in any realm that lights the flag. Its fact sources are the immutable obligations ledger (reframeKernel.js:416), the relationship states, and the traditions ledger (:461, the imposed-rite lane), and it never writes any of them: the frozen-facts pin is the constitution of this design. So the ONLY thing a receipt could show is spatialLedgers.reframes, which no v4 receipt censuses. The release corpus therefore says nothing whatever about this subsystem, and this row says so rather than inferring life from a war layer that moves for a dozen other reasons. THE OBSERVATION NEEDED: the v5 subsystems.stateKeys census. A second, sharper instrument would be a per-year count of war and peace reason kinds, which would show the four reframe-fed kinds entering the causal vocabulary.',
    }),
    // E0-classed and scarcity-capped at six concurrent non-neutral readings, sticky
    // once set, and hysteresis-guarded so oscillation inside the deadband mints
    // nothing. Story-grade rare by construction.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormant_writes_no_ledger',
        description: 'The flag is purely virtual and the gate is fail-closed, so a dark realm serializes byte-identically to one that never had a reframe layer.',
        check: 'In any receipt whose subsystems.rules records reframeEnabled false and whose subsystems.stateKeysComplete is true, the stateKeys census carries no spatialLedgers.reframes entry. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'scarcity_cap_holds',
        description: 'Concurrent non-neutral readings are capped at REFRAME_TUNING.CAP (6, reframeKernel.js:143). Exceeding it would mean the world reframed everything at once, which is the drama inflation the cap exists to prevent.',
        check: 'The v5 stateKeys census entry for spatialLedgers.reframes has maxEntries at or below 6. Expressible from the folded v5 census alone, at any horizon. NOTE the entry count is an upper bound on non-neutral readings, so a census above 6 is a finding to inspect rather than an automatic violation.',
      }),
      Object.freeze({
        name: 'meaning_moves_without_facts_moving',
        description: 'Facts frozen, meaning derived: a reframe transition must never coincide with a rewrite of the obligations ledger it reads. If the fact ledger changes when a reading changes, the layer has stopped interpreting and started editing history.',
        check: 'In a receipt carrying the v5 census, growth in the spatialLedgers.reframes entry count in a year carries no DECREASE in the spatialLedgers.obligations entry count attributable to that year. NOT expressible from the folded census as it stands (it keeps years, maxEntries and finalEntries, not a per-year series), and recorded here as the check a per-year census would enable.',
      }),
    ]),
    // No completed receipt carries the only channel this subsystem can reach.
    soakEvidence: 'unobserved',
  }),
]);

/**
 * ONE-REGEN-cohort rule keys that do not yet carry a row. SHRINK-ONLY.
 * @type {ReadonlyArray<string>}
 */
export const REGEN_PENDING_RULE_KEYS = Object.freeze([
  // npcGrowthEnabled and npcLadderEnabled left this list on 2026-07-31. They are
  // AUTHORED, in subsystemRowsPeople.js, so the six people-subject keys are read
  // together: both are post-apply movers with NO candidate vocabulary at all, and
  // that shared shape is easier to keep honest in one place than split across two
  // cohort lanes. The partition stays exact, so this is a move, never a gap.
  //
  // roadsEnabled, spatialConsequenceEnabled and urbanFabricEnabled left this list
  // on 2026-07-31, emptying it. They are AUTHORED, in subsystemRowsPlace.js, so
  // the six place-and-spatial keys are read together: they share ONE finding (the
  // `place` mover family is a seven-lane bucket that none of them may claim) and
  // three of them are the same shape (a sidecar ledger is the only honest channel,
  // and a wizard-news beat the only narrative one). The partition stays exact, so
  // this is a move, never a gap. The list stays exported and empty so the composed
  // pending list keeps one entry per lane.
]);
