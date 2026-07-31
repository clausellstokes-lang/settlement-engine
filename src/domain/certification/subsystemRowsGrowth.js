/**
 * subsystemRowsGrowth.js — SUBSYSTEM CERTIFICATION ROWS for the LIFECYCLE-AND-GROWTH
 * cohort: the three gates that decide whether a realm can BUILD as well as break.
 * Institutions opening and shuttering, the pressure conditions a strained settlement
 * grows on its own, and the upswing arcs (reconstruction, boom and bust, flourishing).
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol, and
 * the evidence law. All three are binding here.
 *
 * WHY THESE THREE READ TOGETHER. They are the estate's UPWARD write traffic, and they
 * fail in the same direction: a realm whose downward movers all run can look completely
 * healthy to the whole-world oracle while nothing is ever founded, rebuilt or grown. Each
 * row below therefore names its own vocabulary rather than leaning on the shared mover
 * families, which is the only way a certification can tell a quiet realm from a dead lane.
 *
 * TWO OF THE THREE CARRY A HALF THAT NEVER RAN IN THE COMPLETED CORPUS, and both are
 * recorded rather than averaged away: the institution lanes' faith-gated arm found no
 * deity to answer to in a deity-free soak fixture, and the upswing ledger is visible only
 * to the v5 census that no completed release case carries.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemRowsGrowth.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

// The THREE institution literals, enumerated from the four emission sites rather than
// from any receipt: institutionLifecycle.js:752 (build) and :821 (closure) on the economy
// lane, moralInstitutionPressure.js:355 (closure) on the abolition lane and :515
// (founding) on the founding lane. Every one of the four sits downstream of an
// `if (!rules.institutionLifecycleEnabled) return { worldState, candidates: [] }` guard
// (institutionLifecycle.js:658, moralInstitutionPressure.js:278 and :451), so all three
// are unreachable when the flag is dark. No other module in the tree emits any of them:
// heraldRouting.js, chroniclersLetter.js and settlementRumors.js name the same literals
// and are READERS keyed by candidate type, never producers.
const INSTITUTION_EVENT_TYPES = Object.freeze([
  'institution_build',
  'institution_closure',
  'institution_founding',
]);

// The SIX pressure-condition literals. pressureConditionCandidate composes
// `candidateType: `${pressure.kind}_pressure`` (candidateEvents.js:243) and returns null
// for any kind outside its archetype map, so the six kinds the map names (food, disease,
// conflict, trade, legitimacy, crime) are the whole vocabulary.
//
// TWO PRODUCER KINDS ARE DELIBERATELY ABSENT, and this is a source finding rather than an
// oversight in the enumeration: pressureModel.js pushes EIGHT kinds (:180, :193, :211,
// :229, :248, :257, :275, :291), and `economy` and `defense` have no entry in the
// archetype map, so a settlement can carry an economy or defense pressure at any score
// and the condition lane will still return null for it. Declaring economy_pressure or
// defense_pressure here would plant two channels that can never fire, which is the same
// trap the settlement-strategy row avoids with its two suppression-only moves.
const EMERGENT_EVENT_TYPES = Object.freeze([
  'conflict_pressure',
  'crime_pressure',
  'disease_pressure',
  'food_pressure',
  'legitimacy_pressure',
  'trade_pressure',
]);

/**
 * The lifecycle-and-growth lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const GROWTH_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'institutionLifecycleEnabled',
    title: 'Institution lifecycle',
    module: 'src/domain/worldPulse/institutionLifecycle.js,src/domain/worldPulse/moralInstitutionPressure.js,src/domain/worldPulse/institutionTolerance.js',
    aliveness: Object.freeze({
      eventTypes: INSTITUTION_EVENT_TYPES,
      // DELIBERATELY EMPTY. All three literals classify into the broad `place` family
      // (CLASSIFIED 2026-07-31 through the live moverFamilyOf: the `institution` token is
      // a place token and it is matched before any other family sees the record), and
      // `place` is the seven-lane bucket tier drift, resource drift, the calamity kernel,
      // the season clock, urban fabric and the settlement lifecycle all feed. Claiming it
      // would let this row grade ALIVE off six other subsystems.
      moverFamilies: Object.freeze([]),
      // The ONE worldState container this flag gates. pulseKernel.js:1498 enters the
      // tolerance pass only when the flag is lit or a ledger already exists, and the
      // second arm is a RELAX-ONLY path for a lingering ledger (:1505 deletes the key
      // when nothing drifts), so for any run observed from genesis the key cannot appear
      // behind a dark flag. settlementTickStates is deliberately NOT claimed: the tier
      // lane writes it unconditionally every tick, which is the npcStates trap, and the
      // census cannot see a nested per-settlement bag in any case.
      stateKeys: Object.freeze(['institutionTolerance']),
      other: 'THREE LANES BEHIND ONE FLAG, AND ONLY ONE OF THEM RAN IN THE COMPLETED CORPUS. The ECONOMY lane needs nothing but a settlement: a sustained economyDrift streak (three ticks, hysteresis band 0.4 to 0.62, streaks capped at ten) arms one build or one closure per settlement per tick. The two MORAL lanes are FAITH GATED: the abolition lane skips any settlement carrying neither a patron nor a reaching foreign faith (moralInstitutionPressure.js:292), and the founding lane returns early on a patron-less settlement (:461), so a deity-free realm mints no institution_founding at all and no moral closure either. The TOLERANCE ledger is faith-derived too, because its baseline IS the patron conviction: an all-neutral realm drifts exactly zero and the kernel drops the key. MEASURED 2026-07-31 across the seven completed release cases: the economy vocabulary fires everywhere (61 events in 37 of 100 observed years at 4 settlements, 51 in 16 of 30 and 128 in 28 of 30 at 12 settlements, and a build or a closure inside the single observed year of every one-year case), while institution_founding is ZERO in every case and every year. That zero is an ABSENT PRECONDITION and not a defect: the soak fixture carries no deities, exactly as the faith rows measured. THE OBSERVATION NEEDED to certify the faith-gated half: one soak case whose settlements carry config.primaryDeitySnapshot, plus the v5 subsystems.stateKeys census, which is the only instrument that can read worldState.institutionTolerance. NEAR-MISS TOKENS, recorded so a later reader does not adopt them: faction_institution_capture and faction_institution_suppression are NOT this vocabulary. They are minted by the faction chooser under factionCompetitionEnabled, and a row that declared them could grade ALIVE with all three institution lanes dark.',
    }),
    // A build or a closure needs a three-tick streak and burns a per-settlement cooldown
    // on emission, so a quiet year is legitimate. A realm of any size should still open or
    // shutter a hall in a good share of its years; the measured shares run 0.37 to 0.93.
    expectedTempo: 'yearly',
    invariants: Object.freeze([
      Object.freeze({
        name: 'institution_vocabulary_is_gated',
        description: 'None of the three literals can appear while institutionLifecycleEnabled is dark. All four emission sites sit behind the same early return, so the flag is the whole subsystem rather than a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records institutionLifecycleEnabled false, the summed eventTypeCounts over the three declared types is exactly zero, and subsystems.stateKeys carries no institutionTolerance key unless the run began from a save that already held one. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'one_candidate_per_lane_per_settlement_per_tick',
        description: 'Each of the three lanes emits at most one candidate per settlement per tick, and each stamps its cooldown on EMISSION rather than on application. The realm-level volume therefore has a hard structural ceiling, and exceeding it would mean a lane stopped honouring its own per-settlement slot.',
        check: 'For every observed year, the summed eventTypeCounts over the three declared types is at most three times the receipt settlements count times 52. MEASURED 2026-07-31: the busiest year in the whole corpus carries 20 at 24 settlements, far under its 3744 ceiling. Expressible from the v4 per-year eventTypeCounts plus the receipt settlements field.',
      }),
      Object.freeze({
        name: 'founding_presupposes_a_patron',
        description: 'A moral founding is raised by whoever holds the patron seat. With no settlement carrying a patron the founding lane returns before any integrator step, so a zero reading proves nothing about that lane.',
        check: 'A receipt may only be read as an institution_founding SILENCE when it also records that at least one settlement carried a deity. NOT expressible from any receipt schema today: neither v4 nor v5 carries a deity-bearer count. This is the same instrument gap the faith rows record, and it is why the founding zero is reported here as an absent precondition rather than as a finding against the lane.',
      }),
    ]),
    // The economy lane is measured in every completed release case, at every horizon and
    // every scale. The faith-gated half is unobserved, and the row says so above.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'emergentEventsEnabled',
    title: 'Emergent pressure conditions',
    module: 'src/domain/worldPulse/candidateEvents.js,src/domain/worldPulse/pressureModel.js',
    aliveness: Object.freeze({
      eventTypes: EMERGENT_EVENT_TYPES,
      // Corroborating only, and disclosed as such by its sibling: the stressor row in
      // subsystemRowsPeople.js declares the SAME family and names this lane as one of its
      // co-feeders. `pressure` is also fed by every aftermath producer, so it can never
      // carry ALIVE here; the six literals above are the dispositive channel. The family
      // is declared anyway because a receipt whose pressure family roars while all six
      // literals read zero is a specific, readable diagnosis (the world is under strain
      // and this lane is not the one expressing it), which the evaluator surfaces as
      // corroboratingOnlyEvidence.
      moverFamilies: Object.freeze(['pressure']),
      // DELIBERATELY EMPTY. The lane is a pure candidate producer: it plants a condition
      // on the target settlement through the ordinary apply path and writes no worldState
      // container of its own. The conditions land in settlement.activeConditions, a
      // per-settlement array the census cannot see.
      stateKeys: Object.freeze([]),
      other: 'ONE SEAM, ONE FLOOR, SIX KINDS OUT OF EIGHT. candidateEvents.js:435 admits the pressure-condition map only when rules.emergentEventsEnabled is true, and pressureConditionCandidate rejects any pressure scoring under 0.5, so the six literals share ONE producer and ONE gate. The pressure model itself pushes EIGHT kinds: economy and defense carry no archetype, so they can never become a condition candidate however hard they press, and this row declares neither of them. The candidate is probability-gated after that (0.06 plus 0.3 times the score, capped at 0.42) and AUTHORITY-ROUTED through authorityFor as a pressure_event, so under a dm_only or recommendations political autonomy it becomes a DM proposal instead of an applied outcome; the release cases run full_simulation at full autonomy, so a receipt taken under a forcing autonomy mode is a different instrument and must not be compared with these counts. MEASURED 2026-07-31 across the seven completed release cases: 850 events in 100 of 100 observed years at 4 settlements, 423 in 30 of 30 and 569 in 30 of 30 at 12 settlements, and 19 to 30 inside the single observed year of every one-year case. FIVE OF THE SIX KINDS FIRE; disease_pressure is ZERO in every case and across all 193 observed years, because healing_capacity never fell far enough for the shared 0.5 floor to open. That is a tuning reading about one input, not a subsystem silence, and the five siblings crossing the identical seam are the proof. NEAR-MISS TOKEN, recorded so a later reader does not adopt it: conflict_pressure is ALSO a regional propagation impactKind (region/propagation.js:422 and :556), but propagation impacts ride the wizard-news feed rather than result.selected, and eventTypeCounts observes the selected lane only, so the event channel stays exclusive to this lane while the post-apply pressure family does not.',
    }),
    // The pressure sweep runs for every settlement every tick and any pressure at or above
    // the floor arms a candidate, so a realm of any size should carry this vocabulary in
    // nearly every observed year. Measured share is 1.00 in every multi-year case.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'emergent_vocabulary_is_gated',
        description: 'None of the six literals can appear while emergentEventsEnabled is dark. The single seam admits the whole map or none of it, which is why static_campaign darkens this key to freeze organic drift.',
        check: 'In any receipt whose subsystems.rules records emergentEventsEnabled false, the summed eventTypeCounts over the six declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'one_candidate_per_settlement_per_kind_per_tick',
        description: 'The producer maps each settlement pressure to at most one condition candidate, and the pressure model emits at most one pressure per kind per settlement per tick. The realm-level volume therefore has a hard structural ceiling.',
        check: 'For every observed year, the summed eventTypeCounts over the six declared types is at most six times the receipt settlements count times 52. MEASURED 2026-07-31: the busiest year in the corpus carries 44 at 12 settlements, far under its 3744 ceiling. Expressible from the v4 per-year eventTypeCounts plus the receipt settlements field.',
      }),
      Object.freeze({
        name: 'a_single_kind_zero_is_a_tuning_reading',
        description: 'The six kinds share one producer, one severity floor and one seam. A receipt carrying any of them proves the seam ran, so a zero on one kind is a statement about the input score behind that kind and never a diagnosis of this subsystem.',
        check: 'In any receipt whose summed eventTypeCounts over the six declared types is above zero, a zero on an individual kind may not be reported as an emergent-lane silence. MEASURED 2026-07-31: disease_pressure is zero in all seven completed cases while the other five fire, across 193 observed years. Expressible from the v4 per-year eventTypeCounts alone.',
      }),
    ]),
    // Nonzero in every completed release case, at every horizon and every scale.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'upswingArcsEnabled',
    title: 'Upswing arcs (reconstruction, boom, flourishing)',
    module: 'src/domain/worldPulse/upswingKernel.js,src/domain/worldPulse/settlementStrategy.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and traced rather than assumed. The mover contains no
      // `candidateType` literal at all: it is a POST-APPLY lane that runs at the
      // advanceGenerosity seam (pulseKernel.js:2250), writes its arcs onto
      // settlementUpdates and emits wizard news. eventTypeCounts observes result.selected
      // only, so nothing this subsystem does can reach it, however far the realm climbs.
      eventTypes: Object.freeze([]),
      // Corroborating only, and SPLIT ACROSS TWO FAMILIES on purpose. All four receipts
      // carry an id (upswingKernel.js:843, :926, :943, :960) so they survive normalizeEntry
      // and reach the observation sink, unlike the id-less momentum and supply-web
      // receipts. CLASSIFIED 2026-07-31 through the live moverFamilyOf: reconstruction and
      // flourishing land in `constructive`, while boom and bust land in `economy`, because
      // the classifier matches the economy tokens `boom` and `bust` before it ever reaches
      // the constructive list. Both families are shared with the generosity lane, so a
      // moving family proves the world climbed somewhere, never that these arcs ran.
      moverFamilies: Object.freeze(['constructive', 'economy']),
      // The ONE ledger this mover exclusively owns (upswingKernel.js:785, dropped when
      // every sub-map empties at :787). Nothing else in the tree writes it. Deliberately
      // NOT spatialLedgers.obligations: the generosity kernel, the obligation decay pass,
      // convergence and the assize kernel all write that one too, and the generosity row
      // refuses it for the same reason.
      stateKeys: Object.freeze(['spatialLedgers.upswing']),
      other: 'ONE GATE, READ AS ABSENT-MEANS-DARK. upswingArcsActive requires upswingArcsEnabled === true (upswingKernel.js:96) and the key is VIRTUAL, absent from DEFAULT_SIMULATION_RULES, so an unlit realm is an immediate no-op with zero forks and zero keys. THE LEDGER COUNTS ARC KINDS, NOT SETTLEMENTS: the census walks one level into spatialLedgers, so spatialLedgers.upswing reports how many of the three sub-maps (reconstruction, boom, flourishing) are live, capping maxEntries at 3 however many settlements are arcing. Each arc is PRECONDITIONED: reconstruction needs a calamity stamp within three years or a siege or occupation clearing, a boom needs sustained surplus throughput plus earned centrality over a three-tick dwell, and flourishing is bounded and cooldown-gated, so a peaceful, un-struck, un-boomed realm holds none and is not thereby dead. A SECOND CONSUMER, invisible to every channel above: with the flag lit the settlement-strategy chooser gains a bounded extraction term on its deploy score (settlementStrategy.js:1012), so this key changes war behaviour even in a run whose ledger stays empty. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.upswing. Every completed release case is a v4 envelope with no census, so the mover families are all this row can see there, and by contract a family can never carry ALIVE. For the reader who checks: the completed corpus records a large post-apply constructive family (4361 in the 100-year case, 1216 and 3285 in the two 30-year cases) against ZERO selected constructive, which is the signature of a post-apply lane, but it is shared with generosity and is not attributed here.',
    }),
    // Every arc needs a shock, a surplus or a golden age behind it, so a quiet decade is
    // legitimate. A realm that never arcs across a whole century is not.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'upswing_is_gated',
        description: 'The dormancy gate is one line: advanceUpswing returns before any fork or key when the flag is absent or false, so the ledger cannot materialize behind a dark switch.',
        check: 'In any v5 receipt whose subsystems.rules records upswingArcsEnabled false or omits it, subsystems.stateKeys carries no spatialLedgers.upswing. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'the_arcs_complete_rather_than_ratchet',
        description: 'An arc is a bounded course, not a permanent state: reconstruction completes at full progress and clears, a boom cools or busts, and a flourishing ends at its endsTick and enters a cooldown. A ledger that only ever grew would mean the completion paths stopped running.',
        check: 'For a receipt of at least thirty observed years whose census carries spatialLedgers.upswing, either maxEntries is strictly greater than finalEntries, or the key years count is below the receipt observedYears. Either reading shows arcs retiring. Expressible from the v5 stateKeys census plus the receipt observedYears.',
      }),
      Object.freeze({
        name: 'the_lane_never_reaches_the_selected_vocabulary',
        description: 'The mover mints no candidate, so its whole output is post-apply. A receipt recording a SELECTED constructive mover means some other lane began minting constructive candidates, and this row would have to be re-traced before its family disclosure could be trusted.',
        check: 'In any receipt, selectedMoverCounts.constructive is zero. MEASURED 2026-07-31: it is zero in all seven completed release cases while postApplyMoverCounts.constructive runs from 8 to 4361. Expressible from the v4 per-year selectedMoverCounts alone.',
      }),
    ]),
    // The dispositive channel is instrumented ONLY by the v5 census, and every completed
    // release case is a v4 envelope, so no dispositive reading exists yet.
    soakEvidence: 'indirect',
  }),
]);

/**
 * Lifecycle-and-growth rule keys that do not yet carry a row. SHRINK-ONLY, and empty:
 * this lane authored every key it claimed in the same edit that created it.
 * @type {ReadonlyArray<string>}
 */
export const GROWTH_PENDING_RULE_KEYS = Object.freeze([]);
