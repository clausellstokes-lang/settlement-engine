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
  Object.freeze({
    rule: 'demographicsEnabled',
    title: 'The demographic engine (births, deaths, carrying capacity)',
    module: 'src/domain/worldPulse/demographicsKernel.js,src/domain/worldPulse/demographicsRates.js,src/domain/worldPulse/demographicsPushPull.js,src/domain/worldPulse/demographicsMigration.js,src/domain/worldPulse/demographicsPlans.js,src/domain/worldPulse/demographicsResponses.js,src/domain/worldPulse/demographicsLand.js,src/domain/worldPulse/demographicsWorks.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and traced rather than assumed. The kernel is a POST-APPLY
      // step at the settlementLifecycleKernel seam: it mints NO candidate, so it carries
      // no candidateType literal at all and eventTypeCounts (which observes
      // result.selected only) can never see it however hard the realm breeds or buries.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the row's sharpest refusal. `population` is the
      // obvious family to claim and it would be the WORST claim in the registry: that
      // family is fed by populationDynamics, the migration kernel, the calamity lane and
      // the war lanes, so declaring it would let this row grade ALIVE off exactly the
      // subsystem it exists to replace. A row with no dispositive channel is graded ALIVE
      // off its mover family alone (subsystemCertification.js: the anti-vacuity law only
      // bites when a dispositive channel IS declared), so claiming `population` here would
      // manufacture a green from the runaway itself.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and it is a property of the slice rather than a gap. P1
      // persists NOTHING: K_food and D_tier are derived every tick and never stored
      // (never-store-a-derivable), and the design's persisted surface (migrationDebt,
      // overflowLedger) belongs to P3 and P2. The lane's whole output is a population
      // number and a populationHistory entry on the settlement record, and the stateKeys
      // census cannot see a per-settlement field. There is no worldState container to
      // claim, so none is claimed.
      //
      // WAVE P2 DOES PERSIST, AND STILL CLAIMS NOTHING, for the reason the generosity
      // and upswing rows both give. The homeostat's in-transit columns ride
      // spatialLedgers.migration, which is the EXISTING M4 crisis-flight ledger (design
      // section 4: zero new ledger kinds, so J2's population extractor counts the
      // homeostat's traffic for free). That key has a SECOND WRITER gated on a DIFFERENT
      // flag: M4 dispatches under the spatial-canon marker, with no reference to
      // demographicsEnabled at all. A row that claimed it could therefore grade ALIVE off
      // a crisis evacuation in a realm where this lane never ran. The two lanes are kept
      // apart at the RECORD instead: every column the homeostat raises carries a
      // travelClass of refugee or voluntary (spatial/migration.js declares the
      // vocabulary), each release pass lands only its own, and the class is part of the
      // column key so a same-tick same-pair collision cannot merge them. That ownership
      // mark is what a later instrument would read to attribute the ledger, and it is
      // pinned at source rather than claimed here.
      //
      // WAVE P3 GIVES THIS ROW ITS FIRST DISPOSITIVE CHANNEL, and it is claimed
      // because it passes the test the migration ledger fails. spatialLedgers.
      // demographicPlans has EXACTLY ONE writer (demographicsPlans.js), that writer
      // returns its inert result before touching a key unless demographicsEnabled is
      // true, and no other lane in the tree writes or reads the name. The key can
      // therefore exist only in a realm where this wave ran, which is exactly what a
      // dispositive channel has to mean. It is conditional and drop-when-empty, so its
      // ABSENCE is never evidence of a dead lane, only of a realm that never crossed an
      // overflow band; the row grades UNOBSERVED there, which stays the honest verdict.
      // DELIBERATELY EMPTY UNTIL THE INSTRUMENT EXISTS. P3 declared
      // 'spatialLedgers.demographicPlans' here and the corpus guard refused it: every
      // completed release case is a v4 envelope with NO stateKeys census, so the
      // channel cannot fire in any receipt that exists, which converts a real SILENT
      // into an instrument gap and pushes the reviewed override set past its ceiling.
      // The guard is right and this row's own prose already said so: wiring the
      // demographic receipt into the v5 census is P4 work. The channel gets declared
      // THEN, in the same slice as the instrument that can read it, never a slice
      // earlier. Declaring a channel before its reader exists is a claim, not evidence.
      stateKeys: Object.freeze([]),
      other: 'THE ROW WITH NO CHANNEL, AND THE REASON IS THE SLICE. Wave P1 (docs/DESIGN_DEMOGRAPHIC_ENGINE.md) cures the finding that every soak redo waits on: the 300-year research soak FAILED its realm-population-bounded check because two settlements compounded at a smooth x1.07/year to 29.1 trillion and 16.4 trillion people while six siblings floored at 200 to 500. Root cause: the population model had births without a death side, growth without a carrying capacity, and no redistribution. P1 supplies the missing half as a difference of rates, next = pop + births - deaths, against the effective bound min(K_food, D_tier). IT SHIPS DARK behind the VIRTUAL flag demographicsEnabled (absent from DEFAULT_SIMULATION_RULES, declared false in full_simulation exactly so this row can census it), and dark is a no-op by OBJECT IDENTITY: the same worldState and settlementUpdates references come back, zero forks, zero keys. TWO SEAMS, ONE FLAG, AND THE SECOND ONE IS A SUPPRESSION. Lit, demographicsKernel owns the growth side AND populationDynamics.js stops emitting its organic-growth candidate under the same key, because design law 1 says there is no growth term that is not a birth. That suppression is the ONE channel a receipt can read today, and it reads as an ABSENCE rather than a presence, which is why it is declared as an invariant below rather than as an aliveness channel: a row may not grade itself ALIVE on another lane going quiet. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a receipt channel carrying per-settlement demographic terms. The kernel already emits a full per-settlement receipt every tick something is born or buried (kind demographic_step, carrying before, after, births, deaths, bound, binding, pressure01, deficit01, birthBand, deathBand, namedFloor and an in-world line), but the pulse drops mover receipts at applyPulseMover and no soak envelope collects them. Wiring that receipt into the v5 census is the instrument this row is waiting for, and it is P4 work alongside the Herald lines. UNTIL THEN THIS ROW GRADES UNOBSERVED WHEN LIT, which is the honest verdict and never a pass. NEAR-MISS TOKENS, recorded so a later reader does not adopt them: population_growth, population_decline and population_emigration are populationDynamics vocabulary, NOT this lane. Lit, the first of the three must read ZERO precisely because this lane replaced it, so a row that declared it would invert its own meaning. WAVE P1a EXTENSION, THE FLOOR: the same flag now also governs three lanes this row did not originally reach, because the design section 0 finding is that the runaway and the floor are ONE defect, an uncapped rate read through an integer deadband. (1) populationDynamics integerizes a DECLINING settlement through the wave primitive instead of rounding it and then discarding anything under two people, which is what froze six settlements between two and five hundred souls for two centuries. (2) tier drift eligibility gains one demographic input, the effective bound below the tier population floor, so a settlement that can no longer be fed or housed at its grade descends the ladder it was previously stuck above; it is an INPUT to the existing single transition writer and never a second one. (3) the terminal lane reads the bottom rung from the head count as well as the tier label, because the label is written by a streak-gated probabilistic lane and could lag a collapsing census forever. All three read the SAME flag, all three are absent-by-default virtual reads, and none of them mints a candidate type or a state key either, so the channels above stay empty and this row still cannot grade itself ALIVE. WAVE P2 EXTENSION, THE HOMEOSTAT: the same flag now also governs the push-pull migration lane (demographicsPushPull.js and demographicsMigration.js), which is the half of the design that makes the two tails of the bifurcation MEET. A cap alone gives smaller winners and a thawed floor alone gives deaths; only redistribution levels a crowded settlement against a viable underpopulated one. FIVE MIGRATION CHANNELS ARRIVE WITH IT AND NOT ONE OF THEM IS OBSERVABLE FROM AN ENVELOPE, which is why they are declared as invariants below rather than as aliveness. (1) THE PUSH SCORE: five banded drivers, food and crowding and prosperity and defense and internal security, each carrying an applicability guard that is a REFUSAL rather than a discount. (2) THE PULL SCORE: evaluated ONLY over settlements reachable on the LIVED route network J4 publishes, priced by the grade-aware hop cost people actually pay and discounted by it, so a far destination pulls measurably less than a near one of identical quality and an unconnected settlement neither sends nor receives. (3) DESTINATION COMPETITION: the emigration flow resolves against RANKED existing destinations whose spare capacity is consumed in rank order, and the leftover is reported by name; that leftover is the ONLY thing that could ever justify a P3 founding, which is why this slice precedes the valves. (4) ARRIVALS AND TRANSIT: columns ride the EXISTING migration ledger and land at their own speed, with the accounting identity departures equals arrivals plus in transit plus returned plus lost held exact. (5) THE TWO CLASSES: a refugee flees regardless of destination quality and a voluntary migrant refuses to move unless a destination out-pulls their own home by a margin. THE LANE OPENS NO STREAM: its one stochastic step is integerized against a HASH of settlement and tick through the wave own primitive, exactly as P1a chose, so P1 pin that each settlement consumes EXACTLY TWO draws on its own fork still holds with the homeostat lit. NEAR-MISS TOKEN, recorded so a later reader does not adopt it: population_emigration is populationDynamics vocabulary and rides the mass-emigration crisis path with M4, NOT this lane. The two are deliberately separate: that path models a sacked town shedding under a stressor and loses people to two mortality sinks, while the homeostat models ordinary movement and is conservation exact by construction, because law 5 says a curb is a world event and never invisible math and P2 carries no stressor coupling at all. WAVE P3 EXTENSION, THE VALVES AND THE PLANS: the same flag now also governs the overflow lane (demographicsPlans.js, demographicsResponses.js, demographicsLand.js and demographicsWorks.js), which is where a settlement stops merely reacting to its own crowding and DECIDES about it. FOUR THINGS ARRIVE AND ONE OF THEM IS FINALLY OBSERVABLE. (1) THE COMPETING RESPONSES: six banded options, emigration and imports and infrastructure and promotion and satellite and send, weighted by conditions and drawn between, never ordered by rule, so the owner three sentences fall out of the weights rather than out of a special case. Send carries the weight of what the homeostat ALREADY answered this tick, and when the realm absorbed everyone the founding lane is not merely out-weighed but REFUSED by name (absorbed), which makes acceptance claim 6 structural instead of lucky. (2) THE SPATIAL LAW (design section 5b): every engine founding must sit no closer than a tier-PAIR banded MIN_SEPARATION to any other settlement and no farther than MAX_REACH from its nearest, both ends measured against the WHOLE realm. THE LOAD-BEARING FINDING, verified in three places rather than assumed: the frozen spatial digest persists NO coordinates (the per-cell centroid array is consumed at build time), so a radius law is not derivable at tick time and wave G own cell distance cannot serve. The band is therefore written in the digest OWN persisted nearness vocabulary, the frozen integer cost field Dijkstra, with two named evidence classes: a FRONTIER candidate the digest recorded as a gate reads its neighbour pair cost exactly, and a HINTERLAND candidate is only ENVELOPED by its country radius, conservative in the direction that refuses. The user exception is total and runs one way (J-P8). (3) SATURATION IS DISCOVERED (J-P7): the bounded Weyl-sampled candidate set comes back EMPTY after the band filters, and that empty answer is the whole signal, re-asked every attempt, never a stored census. At saturation the founding lean collapses to zero by name and the deepening leans (imports, infrastructure, promotion) all rise, so a saturated realm stops sprawling and starts deepening up the EXISTING conserved ladder; this wave adds NO second tier writer and a completed promotion plan raises no tier and mints nobody. (4) THE PLAN (design section 5c): the draw fires on a band CROSSING and the selection becomes ONE persistent plan per settlement, proposed then underway then completed or failed or abandoned, with a startup cost in provision, a duration, real progress, named failure conditions, a reconsideration threshold that is a band-crossing MAGNITUDE of two rungs rather than drift, a cooldown afterwards, and a receipt naming why it was chosen. MEASURED: two hundred ticks of oscillating pressure produce ONE episode, and the control that drops the persistence produces more than ten. THE LANE STILL OPENS NO STREAM: the response race is the exponential race over per-response keyed hashes, order-independent by construction so an unrelated candidate cannot steal another settlement draw, and the site pick is a keyed hash too, so P1 pin that each settlement consumes EXACTLY TWO draws on its own fork survives the valves. FOUNDING COSTS: a satellite is minted through the ONE existing path (mintSteading), so wave E conservation-exact population debit covers it verbatim, and the capital cost is the plan own provision, raised per tick against a prosperity band and spent at completion or forfeited with a named outcome. RECORDED HONESTLY: the tree carries NO settlement treasury (economicState holds foodSecurity, a prosperity LABEL, exports, chains, safety, local production, stockpiles and complexity, and not one of them is a spendable stock), and storageMonths was REFUSED as the denomination because design section 0b names its five writers and warns against a sixth, so provision is the lane own unit and should be re-denominated the day a real treasury lands.',
    }),
    // The step runs for every settlement every tick, and natural mortality is a floor
    // rather than an event, so a realm of any size is demographically busy in every
    // observed year. The tempo floor is moot until an instrument exists.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_raw_growth_line_is_replaced_not_supplemented',
        description: 'Lit, the demographic kernel is the ONLY source of positive population change. populationDynamics returns null for any positive delta under the same flag, so the two lanes can never both mint the same people. This is design law 1 expressed as a countable absence, and it is the one claim about this lane a receipt can settle today.',
        check: 'In any receipt whose subsystems.rules records demographicsEnabled true, the summed eventTypeCounts for population_growth is exactly zero across every observed year, while population_decline and population_emigration are unconstrained (their lane is deliberately unchanged in P1). In any receipt recording demographicsEnabled false or omitting it, population_growth is unconstrained. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'the_bound_is_a_plateau_and_not_a_clamp',
        description: 'The equilibrium is a fixed point of the rate pair, not a ceiling anyone enforces. Far from min(K_food, D_tier) births dominate; approaching it the birth suppression and death strain close the gap; past it deaths dominate. Nothing in the kernel clamps a population, so a settlement CAN briefly exceed its food bound under a siege and then pay for it (J-P5, famine lag). The observable consequence is that a long horizon shows settlements FLATTENING rather than either compounding or pinning to a round number.',
        check: 'For a receipt of at least one hundred observed years whose subsystems.rules records demographicsEnabled true, the realm-population-bounded assertion passes and no settlement final population exceeds fifty times its value one century earlier. The FAILING baseline this is measured against is on record: research-300y-12s-seed1.json, source b66e9551, in which two settlements reached 2.91e13 and 1.64e13. NOT expressible from the current v4 or v5 envelope, which carries realm totals rather than a per-settlement population series; the soak harness own bounded check is the instrument, and the receipt diff between that run and its re-run IS the cure proof the design names as acceptance.',
      }),
      Object.freeze({
        name: 'natural_mortality_has_no_off_switch',
        description: 'The death rate is the tier natural-mortality band times a multiplier that is at least one, so no combination of prosperity, peace, food surplus and empty land anywhere in the engine can produce a deathless settlement (J-P2: even paradise ages). The absence of exactly this property is what let a town reach 29 trillion people, so it is stated as an invariant rather than left as an implementation detail.',
        check: 'NOT expressible from any receipt schema today: no envelope carries a per-settlement death count, and the natural floor is a rate rather than an event. It is pinned at source instead, by a zero-pressure prosperous fixture run over a window and asserted to bury somebody, with the floor deleted as an executed negative control (tests/domain/demographicsKernel.test.js). Recorded here as an honest instrument gap rather than implied by an empty pass.',
      }),
      Object.freeze({
        name: 'no_frozen_nonzero_equilibrium_on_decline',
        description: 'WAVE P1a. A settlement under sustained negative pressure keeps losing people until it dies or the pressure lifts, at every population. The pre-cure lane could not: a delta was rounded to an integer and then discarded unless it reached two people, so a shrinking settlement shrank until its delta rounded to minus one and froze permanently at pop* = 1.5 / (rate x interval magnitude), measured at 301 souls under the soak own configuration. Lit, the decline is integerized the way the death term is, the whole part landing every tick and the fraction carrying as a probability, so the expected decline rate is preserved exactly and there is no population at which a negative rate stops emitting. Merely lowering the discard bar to one would NOT satisfy this: it moves the fixed point to 0.5 / (rate x magnitude) and the same settlement refreezes near a hundred, still above the thorp ceiling of sixty and still unable to descend.',
        check: 'Partially expressible: in a receipt of at least one hundred observed years recording demographicsEnabled true, no settlement holds an identical population across the whole second century while the realm reports sustained pressure on it. The v4 and v5 envelopes carry realm totals rather than a per-settlement series, so the dispositive instrument is the soak harness own bounded check plus the floored-six seed. Pinned at source by a fixture placed at the MEASURED frozen equilibrium (population 300 at pressure 0.70) which must resume declining lit and must stay frozen dark, the dark arm being the negative control that proves the fence rather than the arithmetic (tests/domain/demographicsFloor.test.js).',
      }),
      Object.freeze({
        name: 'a_tier_change_creates_nobody',
        description: 'WAVE P1a, design law 4. Lit, a promotion raises the tier and touches no head count. The legacy applier raised population to the new tier minimum, self-annotated as a deliberate unconserved mint, which moved the realm total without a birth and made the conservation check inexact by construction. That mint existed to cover a gap the eligibility opened by promoting at 92 percent of the floor; lit, eligibility requires the whole floor instead, so the gap is closed at the source rather than filled with people who were never born. Demotion was already conservation exact and is unchanged. The two halves MUST travel together: removing the mint while leaving the 92 percent window re-opens the promote/demote churn loop the mint was built to stop.',
        check: 'NOT expressible from any receipt schema today: no envelope pairs a tier transition with the population on both sides of it. Pinned at source on BOTH arms, a lit promotion applying with the population unchanged and a dark promotion applying with the legacy mint intact, since a golden depends on the dark arm (tests/domain/demographicsFloor.test.js).',
      }),
      Object.freeze({
        name: 'the_bottom_of_the_ladder_is_reachable',
        description: 'WAVE P1a, design section 7b. A nonviable settlement descends town to village to hamlet to thorp through the EXISTING tier-drift eligibility and then becomes eligible for the existing terminal lane. Two things blocked that and both are now fixed lit: the population could not fall past its frozen equilibrium to trigger the population-failure tests, and the terminal lane read the bottom rung from the tier LABEL, which is written by a streak-gated probabilistic and proposal-gateable lane and can lag a collapsing census indefinitely. Lit, the lane reads the rung from the census as well, and the death writer honors the same reading through a stamp on its own outcome so a parked proposal cannot be refused by the writer its evaluator authorized. No second demotion writer exists: tier transitions are still authored only by tier drift eligibility and the DM SHIFT_TIER verb.',
        check: 'NOT expressible from any receipt schema today: the envelope counts settlement_terminal_death events but carries no tier trajectory per settlement, so a reachable ladder and a lucky death are indistinguishable in it. Pinned at source by a 300-tick fixture driving the real evaluators in pulse order, asserting the full descent and the terminal candidate, with the same fixture dark asserting the settlement never leaves its starting tier (tests/domain/demographicsFloor.test.js).',
      }),
      Object.freeze({
        name: 'a_departure_is_an_arrival_or_a_column_on_the_road',
        description: 'WAVE P2, design law 4. Every emigrant this lane raises either reaches a destination, turns back when the destination is gone, or is still walking; the realm total moves only through births, deaths and world edges. The homeostat carries ZERO road mortality on purpose, because law 5 says a curb is a world event with a named cause and P2 has no stressor coupling at all, so the identity is exact rather than approximately exact. M4 crisis columns keep their two mortality sinks and are a different lane.',
        check: 'NOT expressible from any receipt schema today: no envelope carries a per-settlement migration series or the in-transit column ledger. Pinned at source over a THREE HUNDRED tick run on a three-settlement road network, where the sum of every population delta the lane wrote onto the settlement records, read tick by tick because populationHistory keeps only twelve rows, equals minus the people still in transit. The negative control patches the column-ownership predicate so the release pass no longer recognizes its own columns, and the identical run then leaks every one of the 1068 people it sent (tests/domain/demographicsMigration.test.js).',
      }),
      Object.freeze({
        name: 'the_crowded_and_the_empty_level_toward_each_other',
        description: 'WAVE P2, and the whole reason the wave exists. The soak finding was a BIFURCATION rather than a runaway: unbounded winners, floored losers, nothing between. A carrying capacity alone produces smaller winners and P1a floor thaw alone produces deaths; only migration makes the two tails meet. A crowded well fed settlement beside a reachable viable underpopulated one must measurably level BOTH, and the movement must be the road rather than the rates.',
        check: 'Partially expressible: in a receipt of at least one hundred observed years recording demographicsEnabled true, the spread of settlement populations must narrow rather than widen, but the envelope carries realm totals rather than a per-settlement series so the soak harness own bounded check is the dispositive instrument. Pinned at source on a two settlement fixture measured 2026-08-01: joined by one road, 765 people cross it over 200 ticks, the town falls from 10,500 and the village rises from 200 past 700, and the load gap closes by more than a quarter. The negative control removes the ONE road and changes nothing else: zero departures, and the gap does not close, which is the finding reproduced.',
      }),
      Object.freeze({
        name: 'nobody_is_teleported_and_distance_is_priced',
        description: 'WAVE P2, J-P3. Pull is evaluated ONLY over settlements reachable on the LIVED route network, priced by the grade-aware hop cost, and discounted by that price on a halving curve that never reaches zero: far is expensive, not forbidden. A settlement with no living route neither sends nor receives, and a hidden remnant is not a road, because an overgrown way a smuggler can push through is not a road three hundred villagers walk with their carts.',
        check: 'NOT expressible from any receipt schema today: no envelope pairs a migration with the route that carried it. Pinned at source on three arms, each anchored on a connected sibling in the SAME realm that does migrate: an unconnected twin receives nobody, a pair joined only by a hidden edge moves nobody while the same pair at track grade moves people, and a dark route network moves nobody at all. The hidden arm reads DEPARTURES rather than the net delta, because a conserved run net is zero whether or not anybody moved; the executed control that admits hidden hops passed the net reading and failed the departure reading, which is how the vacuity was found.',
      }),
      Object.freeze({
        name: 'existing_capacity_outcompetes_a_new_founding',
        description: 'WAVE P2, review amendment 2, and the reason this slice precedes P3. Spare capacity in every reachable viable settlement is consumed in RANK order before anything could justify founding a new one. What the existing realm could not take is reported by name with its refusal, and that leftover is the whole of P3 licence to found: a founding lane that never asked would mint settlements over a realm with empty houses in it. A destination is bounded by its OWN room, counting the columns already walking toward it, so two origins in one tick cannot be promised the same beds.',
        check: 'NOT expressible from any receipt schema today: no envelope records a founding alongside the capacity that was available instead. Pinned at source through the exported competeForDestinations seam P3 will call, on four arms: capacity taken in rank order with the leftover named partial, a full realm answering no_capacity and an empty one none and an unreachable one unreachable, a nonviable destination taking nobody while its viable twin takes everyone, and end to end a village that saturates after ninety ticks whose early ticks all refuse nothing.',
      }),
      Object.freeze({
        name: 'the_three_readings_choose_differently',
        description: 'WAVE P2, design section 2b. foodFlowRatio, reserveCoverage and urbanLoadRatio are held separate and NO single binding-cause enum collapses them. The proof is behavioural rather than structural: a food-poor column and a space-poor column, handed the IDENTICAL menu of destinations, rank it differently. Reserves appear in neither ranking; they scale how fast people leave and never where they go, which is the acceptance claim that reserves delay crisis and never create permanent capacity, expressed as code.',
        check: 'NOT expressible from any receipt schema today. Pinned at source with a menu whose two destinations carry the SAME effective bound and the same distance and differ only in WHICH headroom they hold, so no min(K_food, D_tier) could tell them apart: the starving column takes the granary and the crowded column takes the open land. The negative control collapses the two need-weighted pull terms into one min() over both slacks, and the two columns then choose identically. A second arm pins that a deep granary and a bare one produce the same K_food, the same bound and the same need vector, and differ only in the departure rate.',
      }),
      Object.freeze({
        name: 'the_guards_are_refusals_not_discounts',
        description: 'WAVE P2, the owner where-appropriate clause. Each push driver carries an applicability guard that zeroes it outright rather than reducing it, because a half-measure here would be untestable. The owner own example is the binding one: a garrison town does not shed its soldiers over prosperity, since being poor and armed is what a garrison IS. Three siblings follow: low defense with no threat at the gate is a budget line rather than a reason to walk and the threat is read from the relationship-derived hostility pressure rather than from the same defense score the driver stands on, crowding is refused where the GRANARY is the wall so no settlement sheds twice for one cause, and an absent food measurement is never a famine.',
        check: 'NOT expressible from any receipt schema today: no envelope records why a settlement did not shed. Pinned at source pairwise, each guard measured on two settlements identical in every respect except the one the guard reads: the garrison contributes EXACTLY zero for prosperity while its ungarrisoned twin contributes over 0.9, the peaceful town contributes zero for defense while the same town under hostility pressure contributes over 0.9 and is classed refugee, and the walled town sheds for crowding while the starving town sheds for food instead. The negative control opens the garrison guard and the garrison then sheds its soldiers.',
      }),
      Object.freeze({
        name: 'a_refugee_flees_and_a_volunteer_chooses',
        description: 'WAVE P2. The two migrant classes fall out of the driver table rather than from a second rule: only food and an enemy at the gate carry a crisis rung, so hunger and war make people flee while crowding, poverty and thieves make people CHOOSE to leave. A refugee ignores the destination-quality margin entirely; a voluntary migrant will not move unless a destination out-pulls their own home, priced at zero distance so the comparison is like with like. Without the margin every settlement in the realm would swap people with its neighbours forever, which is churn rather than a homeostat.',
        check: 'NOT expressible from any receipt schema today. Pinned at source on ONE menu and one home reading, with the destination proven worse than home before the divergence is measured: the refugee column places all 120 people and the voluntary column places none and answers unattractive. A second arm proves the class is not a mute button, since a volunteer offered a genuinely better and nearer destination does move. A third arm end to end: a starving town raises a column the receipt names refugee, and the persisted columns carry travelClass refugee. The negative control applies the voluntary margin to refugees too, and the refugee then stays home to weigh their options.',
      }),
      Object.freeze({
        name: 'the_named_cast_is_never_in_the_lottery',
        description: 'The death draw is taken against population minus residentNamedNpcCount and the result floors at that count, so the engine starves the NUMBER and never the cast (law 3, composing with H3 floor). No engine path here removes a roster character; the DM KILL verb remains the only named death. WAVE P2 EXTENDS THE SAME SUBTRACTION TO THE ROAD: an emigrant column is drawn against the anonymous pool too, so the named cast never emigrates either. H3 circulation owns every named soul movement and this lane moves a number, so the two can never both move one person.',
        check: 'NOT expressible from any receipt schema today: no envelope pairs a settlement population with its named-cast size. Pinned at source by a fixture whose head count already equals its cast, asserted never to fall below it across a long window (tests/domain/demographicsKernel.test.js). WAVE P2 pins the road half on two arms: a town that is nothing but its cast raises no column while its anonymous twin in the same realm does, and a starving town whose roster is most of its people never drops below that roster at ANY of two hundred ticks, checked per tick rather than at the end (tests/domain/demographicsMigration.test.js). The same instrument gap the H3 floor records.',
      }),
      Object.freeze({
        name: 'existing_capacity_is_consumed_before_a_founding_is_possible',
        description: 'WAVE P3, acceptance claim 6, and it is STRUCTURAL rather than weighted. The valve lane runs after the homeostat in the same tick and is handed its per-origin receipts, so spare capacity in reachable existing settlements has already been consumed before a single response is scored. When the realm was asked, answered, and took EVERYONE, the founding lane is not on the menu at all: it is refused by the name absorbed. A settlement that raised no column is NOT absorbed, because that is the realm never being asked rather than the realm answering.',
        check: 'NOT expressible from any receipt schema today: no envelope carries the per-origin migration answer or the response menu. Pinned at source on both arms over a seed family of twelve realms (tests/domain/demographicsPlans.test.js): a crowded town beside one half-empty viable village refuses the founding lane by name in every realm and founds nothing, and the identical town with the one village removed carries the founding lane on its menu in every realm and breaks ground in some of them. The executed negative control replaces the absorption clause with a constant true and the beside-the-village arm goes red on the refusal it can no longer name.',
      }),
      Object.freeze({
        name: 'a_response_is_a_plan_and_not_a_weekly_reroll',
        description: 'WAVE P3, design section 5c, acceptance claim 5. The draw fires on a band CROSSING and the selection becomes ONE persistent plan per settlement, with a startup cost, a duration, progress, named failure conditions, a reconsideration threshold that is a band-crossing MAGNITUDE of two rungs rather than drift, and a cooldown afterwards. A city that commits to founding a satellite does not change its mind because one weekly ratio moved a fraction.',
        check: 'NOT expressible from any receipt schema today: no envelope carries a per-settlement plan or its state. MEASURED at source: two hundred ticks of pressure oscillating across the demand rung produce exactly ONE opened episode. The executed negative control strips the persistence, so every tick reads as a fresh crossing, and the identical run opens more than ten.',
      }),
      Object.freeze({
        name: 'every_engine_founding_satisfies_the_proximity_band_on_both_ends',
        description: 'WAVE P3, design section 5b, J-P6 and J-P6b. An engine founding must sit no closer than a tier-PAIR banded MIN_SEPARATION to any other settlement and no farther than MAX_REACH from its nearest, both ends measured against the whole realm rather than against its parent. The band is read in the frozen digest own cost units because the digest persists no coordinates. The user exception (J-P8) is total and runs one way: a user-placed settlement is never refused or relocated, and still constrains the engine.',
        check: 'NOT expressible from any receipt schema today: no envelope carries a founding site or the realm geometry it was measured against. Pinned at source on both ends. The MIN end: the identical candidate cell on the identical realm is legal beside a town and refused for too_close beside a metropolis, with the threshold derived from the live band table rather than restated. The MAX end: a settlement whose country runs wider than the reach law refuses its own hinterland for beyond_reach. The executed negative controls flatten the tier-pair table to one number, at which point the metropolis case passes exactly like the town case and J-P6 distinction is gone, and raise MAX_REACH out of range, at which point the reach arm reds.',
      }),
      Object.freeze({
        name: 'saturation_stops_the_sprawl_and_starts_the_deepening',
        description: 'WAVE P3, design section 5b and J-P7. Saturation is DISCOVERED as an empty filtered candidate set, re-asked at every attempt, and never a stored census. With no legal ground the founding lane leaves the menu by the name no_ground and the deepening leans (imports, infrastructure, promotion) all rise, so pressure resolves up the EXISTING conserved tier ladder. This wave adds NO second tier writer: a completed promotion plan raises no tier and mints nobody, and the valve lane never writes a population row of its own.',
        check: 'NOT expressible from any receipt schema today: no envelope carries the candidate set or the response menu. Pinned at source by a realm whose every cell of the parent country is already held, which returns zero legal sites and reports saturated; by the scored menu, where the founding lane weight falls to exactly zero under the no_ground refusal while all three deepening weights rise; and by a one hundred and twenty tick run asserting that no populationHistory row anywhere carries a demographics.plan outcomeId. The control restores the ground and the identical realm reports open sites again.',
      }),
      Object.freeze({
        name: 'a_founding_conserves_people_and_accounts_for_its_capital',
        description: 'WAVE P3, acceptance claim 7. A satellite is minted through the ONE existing founding path, so wave E conservation-exact population debit covers a plan-driven founding verbatim: the parent loses exactly what the child gains. The capital is the plan own provision, raised per tick against a prosperity band and either spent at completion or forfeited with a named outcome, so every unit raised is in a completed undertaking, forfeited by name, or still held by an open plan, and there is no fourth place for it to be.',
        check: 'NOT expressible from any receipt schema today: no envelope pairs a founding with its parent head count. Pinned at source over a seed family of eight realms driving the REAL host seam with both flags lit, JSON round-tripped so the child is proven to survive a save rather than merely to exist in memory, asserting the parent debit equals the child population and the founding receipt carries the plan identity and the provision it spent. The capital identity is added up independently over a sixty tick run: what the lane says it raised equals what its closed receipts account for plus what open plans still hold.',
      }),
    ]),
    // Ships dark, and its dispositive instrument does not exist yet. UNOBSERVED is the
    // verdict this row can reach and it is the honest one; it becomes readable the day a
    // v5 census collects the demographic_step receipt.
    soakEvidence: 'unobserved',
  }),
]);

/**
 * Lifecycle-and-growth rule keys that do not yet carry a row. SHRINK-ONLY, and empty:
 * this lane authored every key it claimed in the same edit that created it.
 * @type {ReadonlyArray<string>}
 */
export const GROWTH_PENDING_RULE_KEYS = Object.freeze([]);
