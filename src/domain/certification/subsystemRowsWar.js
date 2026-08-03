/**
 * subsystemRowsWar.js — SUBSYSTEM CERTIFICATION ROWS for the WAR STACK:
 * warLayerEnabled, the eight war-depth sub-flags that ship lit only in the
 * full_simulation ceiling preset, the three declared-dark WR reads
 * (warTerminationEnabled, dispositionChannelsEnabled, and
 * lineageClaimEnabled), and the three
 * war-adjacent switches this lane
 * ADOPTED from their home cohorts because they certify as war and nowhere else
 * (navalEnabled and peaceEngineEnabled out of the WAVES cohort, and
 * allyIntelSharingEnabled out of the baseline opt-in singles). Lane placement is
 * free: subsystemCertification.js composes every lane into one registry and the
 * totality walker asserts the PARTITION, not the address. The adoption is
 * recorded here so the next reader does not go looking for them in a lane file
 * whose PENDING list no longer names them.
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and the evidence law. Both are binding here.
 *
 * THE NESTING (traced, not assumed, and NOT uniform). The execution-side war-depth
 * switches are AND-gated under warLayerEnabled in the engine: warDeployment.js:1082
 * returns an untouched world before it reads a single sub-flag, and occupation.js:753
 * does the same. peaceEngineEnabled and warTerminationEnabled each join through
 * their own strict two-flag gate. warDispositionEnabled is nested only IN EFFECT:
 * coup.js:113 reads it on
 * the stressorsEnabled path, but the war-exhaustion scar it consumes is written
 * nowhere except inside the war layer. THE TWO EXCEPTIONS, stated so nobody infers
 * a gate that is not there: navalActive (navalKernel.js:78) is armyTransitActive AND
 * navalEnabled, with NO warLayerEnabled term, and allyIntelSharingEnabled rides
 * beliefsActive through pulseKernel.js:1838. So a receipt with the war layer dark
 * grades the nested rows DORMANT_BY_CONFIG rather than SILENT even when their own
 * key reads true, while the two exceptions keep answering for themselves. Each row
 * states its own gate in `other` so the reading is recorded rather than inferred.
 *
 * THE MOVER-FAMILY RULE THIS LANE FOLLOWS: no row declares one, and the reason is
 * MEASURED rather than stylistic. Running the production classifier
 * (moverFamilyOf, scripts/audit/behavioral-observation.mjs) on the war layer's real
 * record shapes on 2026-07-31 shows that conquest, war_drain, army_deployed,
 * war_exhaustion and war_spoils all classify as PRESSURE, not war, because they
 * carry ruleFamily 'stressor' and the classifier takes the first matching family
 * over a concatenation that starts with ruleFamily. Only war_conscription and
 * war_levy land in `war`. A `war` claim on any row here would therefore be false
 * about most of its own vocabulary, on top of the ordinary shared-family vacuity.
 * Where a sub-flag has no vocabulary of its own the row declares NO channel at
 * all and says so through soakEvidence 'unobserved' plus a TO OBSERVE note, which
 * is the honest deliverable rather than a borrowed pass.
 *
 * WHAT THE COMPLETED SOAK ACTUALLY MEASURED (all seven release cases read
 * 2026-07-31 from artifacts/soak/release.cases). The war layer is loud:
 * strategy_deploy is NOT its evidence (settlementStrategy.js:498 emits the same
 * literal from its own chooser, which is why the 30y-12s case shows 126 of them
 * against 7 army_deployed), but army_deployed, war_drain, war_exhaustion,
 * war_mobilization, conquest, occupation_* and war_spoils all fire in every case.
 * war_levy fires ZERO times in every case while its siblings fire, which is the
 * SILENT diagnosis this contract exists to make. navalEnabled is lit and gated
 * open, yet the soak's spatial fixture is a pure land grid whose digest carries
 * reserved.seaLanes === null, so the layer has no sea to work on.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemRowsWar.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

// The candidate-type vocabulary that is reachable ONLY through the war layer.
// Traced to the emitting `candidateType` literal, not to a consumer that merely
// reads the archetype: warDeployment.js:1539 (conquest) and its warConditionOutcome
// calls at 2000/2014/2033/2054/2101 (war_drain, army_deployed, reinforcement_cost,
// war_exhaustion) plus warRecordMode.js:130 (war_exhaustion_cleared);
// deploymentReturn.js:202/334/360/396 (war_exhaustion, army_homecoming,
// occupation_lifted, siege_lifted); occupation.js:559/687/998 (occupation_resistance,
// occupation_burden, occupation_vassalized, war_spoils); mobilizationEffects.js:175
// (war_mobilization) and mobilizationReactions.js:166 (the four reaction moves).
//
// DELIBERATELY ABSENT, each for a traced reason:
//   strategy_deploy  settlementStrategy.js:498 emits `strategy_${move}` from the
//                    settlementStrategyEnabled chooser, so the literal is shared.
//   war_pressure     candidateEvents.js:225, tradeWar.js:594 and warDeployment.js:1492
//                    all emit it; a shared archetype cannot carry one row.
//   war_conscription / war_levy  each belongs to its own sub-flag row below.
const WAR_LAYER_EVENT_TYPES = Object.freeze([
  'army_deployed',
  'army_homecoming',
  'conquest',
  'mobilization_reaction_fortify',
  'mobilization_reaction_negotiate',
  'mobilization_reaction_pre_empt',
  'mobilization_reaction_seek_allies',
  'occupation_burden',
  'occupation_lifted',
  'occupation_resistance',
  'occupation_vassalized',
  'reinforcement_cost',
  'siege_lifted',
  'war_drain',
  'war_exhaustion',
  'war_exhaustion_cleared',
  'war_mobilization',
  'war_spoils',
]);

/**
 * The war lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const WAR_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'warLayerEnabled',
    title: 'War layer',
    module: 'src/domain/worldPulse/warDeployment.js,src/domain/worldPulse/occupation.js,src/domain/worldPulse/deploymentReturn.js,src/domain/worldPulse/mobilizationEffects.js,src/domain/worldPulse/mobilizationReactions.js,src/domain/worldPulse/warIntent.js,src/domain/spatial/armyTransit.js',
    aliveness: Object.freeze({
      eventTypes: WAR_LAYER_EVENT_TYPES,
      // DELIBERATELY EMPTY, and NOT for the usual shared-family reason. MEASURED
      // 2026-07-31 by running the production classifier on the real record shapes:
      // moverFamilyOf takes the FIRST family whose tokens match a concatenation
      // that begins with ruleFamily, and every warConditionOutcome and the conquest
      // outcome carry ruleFamily 'stressor', which is a `pressure` token. So
      // conquest, war_drain, army_deployed, war_exhaustion and war_spoils all
      // classify as PRESSURE, not war, and only war_conscription and war_levy (which
      // carry no ruleFamily) land in `war`. Declaring `war` here would therefore be
      // false about sixteen of the eighteen literals above, and would let a receipt
      // whose war family read zero report a spurious partiallySilent.
      moverFamilies: Object.freeze([]),
      // Four TOP-LEVEL worldState containers, each written only inside a
      // warLayerEnabled branch of pulseKernel (878 and 1061 for deployments and
      // warExhaustion, 774 for warPosture, 1017 for occupations) and each dropped
      // back to absent when its lane empties. censusWorldStateKeys enumerates every
      // top-level key, so a v5 receipt reads all four.
      stateKeys: Object.freeze(['deployments', 'occupations', 'warExhaustion', 'warPosture']),
      other: 'THE PARENT GATE. warDeployment.js:1082 returns the world untouched before any sub-flag is read, so every row below it grades DORMANT_BY_CONFIG when this key is false. The war stack owns both W1 consumers: the opener reads the chooser\'s resolved target through warIntent.js and the apply pass retires it once the army is committed, while the opener calls armyTransit.siegeArrivalGate so a column still on the road cannot besiege. Neither creates a new dispositive state key for this row: warIntents is the chooser\'s two-tick instruction, while armyTransit is the spatial mover\'s canonical ledger; deployments remains the war layer\'s durable observable. MEASURED across all seven completed release cases: the 30-year 12-settlement seed1 case carries war_mobilization 73, war_exhaustion 26, occupation_burden 10, war_drain 9, war_spoils 8, army_homecoming 8, army_deployed 7, occupation_resistance 3, conquest 2 and occupation_vassalized 2. THE TRAP THIS ROW AVOIDS: strategy_deploy reads 126 in that same case and is NOT war-layer evidence, because settlementStrategy.js:498 mints the identical literal from the settlement-strategy chooser; a row that claimed it would grade ALIVE in a world where the war layer never opened a front. Public counts UNDER-read the tick rate by design: recurringWarConditionRecordMode files an unchanged recurring condition as recordMode state_only, and the behavioral observer counts only public selected outcomes, so army_deployed counts deployment EPISODES rather than deployed ticks.',
    }),
    // A war layer that fires in EVERY observed year is a bug, not a standard. Wars
    // are episodic: a mobilization, a siege, a resolution, then a quiet stretch
    // while the exhaustion scar decays. multi_year asks only that the layer keep
    // reaching new years across the span.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'war_layer_is_gated',
        description: 'The whole vocabulary is unreachable while warLayerEnabled is dark. The flag is the subsystem, not a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records warLayerEnabled false, the summed eventTypeCounts over the eighteen declared types is exactly zero and the census carries none of deployments, occupations, warExhaustion, warPosture. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'war_is_episodic_not_annual',
        description: 'A realm at war in every single year has lost its peace, which is a calibration failure rather than a healthy war layer.',
        check: 'In a receipt of at least thirty observed years, the share of years carrying army_deployed is strictly below 1 and at least one observed year carries none of the eighteen declared types. Expressible from the v4 per-year eventTypeCounts.',
      }),
      Object.freeze({
        name: 'a_conquest_leaves_an_occupation',
        description: 'A conquest seeds an occupation authority, so a fallen town is administered rather than simply vanishing from the record.',
        check: 'For every receipt year carrying conquest, the same year or a later year in the same case carries occupation_resistance, occupation_burden or occupation_vassalized. Expressible from the v4 per-year eventTypeCounts.',
      }),
    ]),
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'warEconomyDrainEnabled',
    title: 'War economy population drain',
    module: 'src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      // warDeployment.js:1877. The only emitter of this literal in the estate.
      eventTypes: Object.freeze(['war_conscription']),
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The conscripted head-count is banked at
      // deployments[id].deployedPopulation, which is NESTED inside the deployments
      // container; censusWorldStateKeys counts a container's entries and never
      // descends into them, so declaring `deployments` here would grade this row
      // ALIVE off the parent war layer's own ledger.
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1281, inside the gate at 1082). MEASURED alive in every completed release case: war_conscription reads 8 in the 30-year 12-settlement seed1 case and 18 in the one-year 24-settlement case. The public count is a floor, not the tick rate: warDeployment.js:1877 stamps recordMode state_only once deploymentAge exceeds 0, so only the first tick of each deployment episode is a public event. The matching return credit rides deploymentReturn, so the books balance as deployed minus returned equals war dead.',
    }),
    // The drain exists only while an army is in the field. Its cadence is the
    // war's, not the calendar's, so a quiet decade is correct rather than slow.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'conscription_requires_a_deployment',
        description: 'Men march to a front that exists. No settlement conscripts for a war it is not fighting.',
        check: 'No receipt year carries war_conscription unless that year or an earlier year in the same case carries army_deployed. Expressible from the v4 per-year eventTypeCounts.',
      }),
      Object.freeze({
        name: 'the_drain_is_conserved',
        description: 'Conscription is a debit against the home, and homecoming credits back exactly the survivors. The lane moves people and never mints them.',
        check: 'In every year carrying war_conscription the conscripting settlement stateVectors population falls, and in every year carrying army_homecoming a deployer population rises. Expressible at YEAR granularity from the v4 stateVectors series plus eventTypeCounts; NOT expressible at head-count granularity, because no receipt field records a per-outcome populationDelta.',
      }),
    ]),
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'warLevyEnabled',
    title: 'War levy',
    module: 'src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      // warDeployment.js:1970. The only emitter of this literal in the estate.
      eventTypes: Object.freeze(['war_levy']),
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, for the same reason as war conscription: the per-vassal
      // head-count lands at deployments[id].leviedPopulationBySource, nested one
      // level below anything the census records.
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1290, inside the gate at 1082). MEASURED SILENT, and that is this row\'s whole point. Every one of the seven completed release cases reads war_levy exactly ZERO while its siblings fire in the same cases (war_conscription 8, army_deployed 7, conquest 2 in the 30-year 12-settlement seed1 case), so the gate that fails sits inside the levy rather than upstream of the war. The receipts also prove levy-eligible relationships exist: vassal_rebellion reads 354 and vassal_protection_burden 44 in that same case. THE THINGS TO INSPECT, all traced: computeLevySources (warDeployment.js:273) admits only a LEVY_SUPPORT_TYPES edge (vassal, allied, ally, defensive_pact) and, for a vassal edge, only the SENIOR side may levy its junior; the exclude set drops any source that is itself besieged, is fielding its own army, or was already levied this tick by another overlord; and LEVY_POP_RATE_PER_TICK 0.004 against LEVY_POP_FLOOR 300 means a source under roughly 550 people levies nobody at all.',
    }),
    // The levy rides an active deployment that also holds junior support edges, so
    // it is reactive rather than periodic. reactive carries no share floor, which
    // is exactly why a zero here reads as SILENT rather than as a slow tempo.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'a_war_with_vassals_levies',
        description: 'An overlord that fields an army while holding unbesieged junior clients draws men and grain from them. A span with wars, vassals, and no levy at all is the finding.',
        check: 'A case whose receipt carries army_deployed in some year AND vassal_rebellion or vassal_protection_burden in some year carries at least one war_levy across its whole span. Expressible from the v4 per-year eventTypeCounts. The completed release set FAILS this check in every case.',
      }),
      Object.freeze({
        name: 'the_levy_is_conserved_per_source',
        description: 'Levied men return to the client that sent them, not to the overlord that spent them, so population never pumps one way up the hierarchy.',
        check: 'Across a case, the sum of levied debits equals the sum of returned credits apportioned by source. NOT expressible from any current receipt field: the levy ledger is per-source and nested, and stateVectors carries only year-end population. A per-source levy census in the subsystems section would make it expressible.',
      }),
    ]),
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'warForageEnabled',
    title: 'Sack and forage',
    module: 'src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. The sack has no vocabulary: it
      // rides the EXISTING conquest outcome as extra populationDeltas
      // (computeSackTransfer, warDeployment.js:1518) and foodStockpileDeltas
      // (computeSackFoodTransfer, 1526), so eventTypeCounts cannot tell a sacking
      // conquest from a bloodless one, and no container is written.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1289). THE MISREADING THIS ROW EXISTS TO PREVENT: war_spoils looks like sack evidence and is NOT. occupation.js:998 emits war_spoils under warLayerEnabled alone as the capped occupation-benefit relief, so it fires whether or not this flag is lit, and it read 8 in the 30-year 12-settlement seed1 case with nothing proven about forage. TO OBSERVE: the receipt needs either a per-conquest delta census (how many conquest outcomes carried populationDeltas) or a conquest-year settlement population census. The v4 stateVectors series carries year-end population per settlement, so a conquest-year drop in the conquered town is the closest available proxy and it is not clean, because migration, famine and the calamity kernel move the same number.',
    }),
    // A sack rides a conquest, and a conquest is rare. Nothing here should recur
    // on a calendar.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_sack_is_conserved_with_a_sink',
        description: 'A sack carries off SACK_POP_FRACTION of the conquered, of which FORAGE_CAPTURE_FRACTION reaches the victor; the shortfall is the war dead and is never minted anywhere. SACK_POP_FLOOR spares a skeleton population.',
        check: 'In a conquest year the conquered settlement stateVectors population never falls below the 150 skeleton floor, and the victor rise never exceeds the conquered fall. Expressible as a BOUND from the v4 stateVectors series plus eventTypeCounts; exact conservation needs a per-outcome delta census.',
      }),
      Object.freeze({
        name: 'the_sack_is_atomic_with_its_conquest',
        description: 'A dismissed or deferred conquest withholds the sack whole, so a takeover that did not stick leaves no phantom population or granary loss.',
        check: 'NOT expressible from a soak receipt: the soak runs at full political autonomy and dismisses nothing, so no case exercises the withhold path. A DM-dismissal probe receipt carrying the dismissed outcome ids would make it expressible.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'warSupplyQualityEnabled',
    title: 'Supply-gap deployed quality',
    module: 'src/domain/worldPulse/supplyQuality.js,src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. deployedQualityMult is a pure
      // multiplier over deployed strength and attrition kit (warDeployment.js:1286);
      // it mints no candidate and writes no container.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1285). The flag scales a deploying settlement\'s force by its supplyCompleteness over the WAR_KIT basket (arms, iron, leather, livestock, provisions), floored at SUPPLY_QUALITY_TUNING.FLOOR 0.55 so a chainless settlement still fields a degraded force, and it deliberately does NOT feed readiness (readiness is training, this is kit). Every effect lands as a number inside a siege roll. TO OBSERVE: record the applied quality multiplier on the strategy_deploy or conquest outcome, or census currentEffectiveStrength at mint time from the deployments ledger; either makes the axis readable. Failing that, only a paired lit and dark run at one seed separates it, and the whole-world soak records no such pair for this flag.',
    }),
    // The multiplier is read once per deployment, at the moment an army commits.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'quality_is_floored_never_zero',
        description: 'A settlement that sources none of its own war kit still deploys. The multiplier lives in a closed band and can degrade a force but never erase it.',
        check: 'Across a lit and dark receipt pair at one seed, both cases still carry army_deployed, and neither carries a conquest count of zero purely because the lit case starved its armies. Expressible from the v4 eventTypeCounts over TWO receipts; not expressible from one.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'defenderAttritionEnabled',
    title: 'Defender siege attrition',
    module: 'src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      // A TOP-LEVEL worldState container that exists ONLY under this flag:
      // warDeployment.js:1291 allocates it at the flag read and returns null
      // otherwise, and pulseKernel.js:883 writes it back only when non-null. That
      // makes it a genuinely dispositive channel, readable from a v5 census.
      stateKeys: Object.freeze(['defenderSiegeLedger']),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1280). The ledger seeds from the target\'s fresh homeDefense on the first besieged tick, wears down through applyAttritionToRecord with isAttacker false, feeds the siege verdict as defenderStrengthOverride, and is RETIRED the moment the siege ends, with a final prune at warDeployment.js:2133 dropping every target that is no longer besieged. So a census year with no live siege legitimately reads zero: maxEntries over the span is the aliveness signal and finalEntries is not. The completed release receipts are envelope v4 and carry no subsystems census at all, which is why this row reports an INSTRUMENT GAP rather than a silence; a v5 rerun of the same cases reads it for free.',
    }),
    // The ledger exists only while somebody is under siege.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'attrition_never_exceeds_fresh_defense',
        description: 'The eroded defender strength is clamped to the town\'s own fresh home defense, so a besieged town is never made stronger by having been besieged.',
        check: 'Expressible only as a PRESENCE bound from a v5 census today: the ledger appears in years the case also carries army_deployed. The eroded value itself is nested inside the ledger entry and the census records entry counts, not values, so the exact clamp needs a per-key value census.',
      }),
      Object.freeze({
        name: 'the_ledger_never_leaks',
        description: 'Only ongoing sieges survive the end-of-loop prune, so a relieved town heals to full and the container returns to absent when no siege is live.',
        check: 'In a v5 census, defenderSiegeLedger finalEntries is 0 or the key is absent in any case whose final observed year carries no army_deployed and no war_drain. Expressible from the v5 subsystems.stateKeys fold plus the v4 per-year eventTypeCounts.',
      }),
    ]),
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'defenderResolveEnabled',
    title: 'Two-track defender resolve',
    module: 'src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. The will score biases the siege
      // log-odds and, at the floor, returns a capitulation verdict; neither the
      // bias nor the capitulation ever leaves resolveSiegeVerdict.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1287). composeDefenderWillScore folds the defender\'s will facet, public legitimacy, logistics and the odds it faces into a bias of WILL_BIAS_STRENGTH 2.2, and a score at or below WILL_CAPITULATE_FLOOR -0.72 returns a bloodless capitulation instead of a storm. THE GAP IS EXACT: the verdict object carries capitulation true (warDeployment.js:971) but nothing downstream reads it. The conquest outcome minted afterwards carries the same candidateType either way and only its reasons prose differs, so no receipt field distinguishes a town that surrendered from a town that was stormed. TO OBSERVE: promote the capitulation flag onto the conquest outcome, either as outcome metadata or as its own candidateType such as settlement_capitulated, and eventTypeCounts reads it with no schema change at all.',
    }),
    // A will collapse is the rarest of the siege paths and rides a live siege.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'a_capitulation_is_bloodless',
        description: 'A town whose will breaks yields rather than being stormed, so it must not also carry the storm\'s sack.',
        check: 'NOT expressible today, because no receipt field separates a capitulation from a storm. It becomes expressible from the v4 eventTypeCounts the moment the capitulation reaches the outcome as a distinct type or a recorded flag.',
      }),
      Object.freeze({
        name: 'resolve_moves_the_roll_not_the_gate',
        description: 'The will term biases how a plausible siege resolves; it never lets an infeasible siege proceed, because the hard feasibility gate sits in front of the roll.',
        check: 'Across a lit and dark receipt pair at one seed, the count of years carrying army_deployed is unchanged while the conquest count may differ. Expressible from the v4 eventTypeCounts over TWO receipts.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'allyDefenseEnabled',
    title: 'Ally defense relief',
    module: 'src/domain/worldPulse/warDeployment.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. computeAllyRelief returns a number
      // that enters the siege verdict as defenderReliefBonus and is never recorded.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled (read at warDeployment.js:1288). computeAllyRelief (warDeployment.js:240) sums ALLY_RELIEF_FRACTION 0.4 of each supporting neighbour\'s home defense over the ALLY_SUPPORT_TYPES edges (allied, ally, vassal, patron, defensive_pact), skipping any ally under its own siege, and hands the total to resolveSiegeVerdict. Nothing about the relief is minted, stamped or stored, so a besieged town that was relieved and a besieged town that stood alone produce byte-identical receipts. TO OBSERVE: record defenderReliefBonus on the conquest or siege outcome, which also gives the Chronicle the sentence it is currently missing (that the walls held because help came).',
    }),
    // Relief is computed per besieged target per tick, so it rides sieges.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'a_besieged_ally_sends_nothing',
        description: 'An ally fighting for its own walls cannot spare relief, so alliance does not create defense out of nothing.',
        check: 'NOT expressible from one receipt. Across a lit and dark receipt pair at one seed, targets holding support edges fall no more often in the lit case than in the dark one. Expressible from the v4 eventTypeCounts over TWO receipts once the relief itself is recorded.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'warDispositionEnabled',
    title: 'War disposition flywheel',
    module: 'src/domain/worldPulse/coup.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. The flag adds one term to the coup
      // hold-chance (coup.js:113) and touches nothing else in the estate.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled in effect: the war-exhaustion scar it reads is only ever written inside the war layer. THE MISREADING THIS ROW PREVENTS: coup_succeeded and coup_suppressed are minted by coupVerdictOutcomes on the stressorsEnabled path whatever this flag says, so their presence in a receipt proves the coup lane ran and proves nothing at all about war sentiment. The flag adds WAR_SENTIMENT_PHOLD_WEIGHT times computeWarSentiment to the hold chance and writes no container. THE NEAREST OBSERVABLE is already in the receipt: the per-year succession block records attempts and completions, and the RATE of completions is exactly what this flag moves. TO OBSERVE: a lit and dark pair at one seed compared over succession.completions, or record the warSentimentAdj term on the coup outcome so a single receipt can carry it.',
    }),
    // The term is read once per coup verdict, and coups are resolved stressors.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'war_sentiment_moves_the_seat_not_the_stressor',
        description: 'An unpopular war changes how often a coup SUCCEEDS. It never changes how often one is born, because the coup stressor is minted upstream of this term.',
        check: 'Across a lit and dark receipt pair at one seed, the summed succession attempts match exactly while the summed succession completions may differ. Expressible from the v4 per-year succession observation over TWO receipts.',
      }),
      Object.freeze({
        name: 'an_exhausted_aggressor_is_couplable',
        description: 'A regime that overextends loses on its own home front, so the scar it accrued abroad is legible in the politics at home.',
        check: 'In a receipt whose years carry war_exhaustion in volume, the same case carries at least one succession attempt across its span. Expressible from the v4 per-year eventTypeCounts plus succession, as a WEAK necessary condition only: it cannot attribute the attempt to the war.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'dispositionChannelsEnabled',
    title: 'Learned disposition channels',
    module: 'src/domain/worldPulse/dispositionLedger.js,src/domain/worldPulse/dispositionProfile.js,src/domain/worldPulse/dispositionDeltas.js,src/domain/worldPulse/worldState.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. The eight authored disposition
      // impact kinds are wizard-news receipts, not selected pulse outcomes, so
      // behavioral eventTypeCounts and moverFamilyOf never see them. The durable
      // data extends each EXISTING dispositionStats entry in place; the total v5
      // census counts only that shared top-level ledger and does not descend into
      // an entry to distinguish legacy {wins,losses,score} from WR-2 channels.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'AUTHORED IN THE WAR LANE, BUT NOT FALSELY CLAIMED AS A STRICT CHILD GATE. Fresh martial, mercantile and insular learning is gathered from the war, trade-war and occupation resolvers inside the war-layer pulse path, and diplomatic learning comes from the peace/treaty path; however, worldState.js migrates an existing legacy dispositionStats entry and settlementStrategy consumes its thresholds whenever dispositionChannelsEnabled itself is exactly true. A dark warLayerEnabled therefore does not by itself make this row dormant when a campaign already carries legacy disposition memory. The extension is SAME-SCHEMA: dispositionLedger.js remains the one writer, preserves wins/losses/score as the martial compatibility mirror, and adds four bounded, decaying channel stocks inside each existing dispositionStats entry rather than inventing a second ledger. THE TWO NEARBY CHANNELS ARE BOTH FALSE EVIDENCE. dispositionStats predates WR-2 and can be non-empty while this flag is dark, so its top-level v5 census entry cannot prove the four-channel extension ran; disposition_martial_crossed, disposition_mercantile_crossed, disposition_diplomatic_crossed, disposition_insular_crossed, disposition_reversal, deity_war_pressure, deity_peace_pressure and war_culture_suppressed are wizard-news impact kinds rather than behavioral selected event types, so declaring any of them here would manufacture a permanently silent event channel. TO OBSERVE: extend the v5 subsystem instrument with a channel-shape census over dispositionStats entries (legacy-only entries, four-channel entries and non-neutral entries by channel) and fold the authored transition family IDs into WR-9 story-mix evidence. That pair can prove both mechanics and reader-visible variety without borrowing traffic from the parent war row.',
    }),
    // Existing learned entries decay and feed threshold reads every tick; outcome
    // resolutions are reactive, but the live memory they create is continuously
    // consumed. The later channel-shape census therefore owes per-tick coverage.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_extension_never_invents_a_second_ledger',
        description: 'Four learned channels live inside the established dispositionStats entry, while the legacy wins, losses and score fields remain its compatibility face.',
        check: 'A future channel-shape census reports four-channel entries only beneath dispositionStats and the total v5 stateKeys census never acquires a dispositionChannels or dispositionProfiles top-level key.',
      }),
      Object.freeze({
        name: 'news_is_not_behavioral_aliveness',
        description: 'A disposition transition may be legible in Wizard News without pretending that a reader-facing receipt is a selected simulation outcome.',
        check: 'WR-9 may count the eight authored disposition impact kinds in its story mix, while behavioral yearly eventTypeCounts and mover counts remain unchanged by those wizard-news receipts.',
      }),
      Object.freeze({
        name: 'dark_means_legacy_shape_and_behavior',
        description: 'An absent or false flag preserves installed saves and their old disposition behavior exactly; migration and new threshold reads require explicit true.',
        check: 'Across absent and explicit-false golden runs, serialized dispositionStats entries contain only their legacy wins, losses and score fields and every non-disposition output is byte-identical.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'allyIntelSharingEnabled',
    title: 'Ally intel sharing',
    module: 'src/domain/worldPulse/beliefMap.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three channels. The pass injects belief records
      // into an existing ledger, and the ledger exists whenever beliefs are active.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Wired at pulseKernel.js:1838, which passes an allyIntel closure only when the key reads true, into advanceBeliefMaps. The pass shares high-confidence beliefs across FRIENDLY_LABELS edges, styles them by the sharer\'s derived alignment (lawful relays faithfully, chaotic garbles, evil feeds false intel), and leaks the sharer\'s own footing to a real enemy through a presumed ally that has turned. EVERY ONE of those effects lands as a record INSIDE spatialLedgers.beliefMaps, which materializes whenever beliefsActive is true, so the container proves the belief layer ran and never proves this pass ran. censusWorldStateKeys counts a ledger\'s entries and never their provenance. TO OBSERVE: a provenance census over beliefMaps records, counting entries that carry the ally-share styling or the ALLY_INTEL_TUNING.LEAK_CONFIDENCE 0.9 marker, which would also give the knowledge mover family the source split it currently lacks. This is DISTINCT from intelTradeEnabled (spatial/intelActs.js), the bounded sell and gift twin, which certifies separately.',
    }),
    // The sharing pass runs for every believed-ally pair on every tick the belief
    // layer advances, so a healthy realm shares continuously rather than in bursts.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'sharing_converges_allies_toward_truth',
        description: 'A well allied lawful bloc that shares high-confidence intel should misjudge its neighbours less often, which is the whole point of the channel.',
        check: 'NOT expressible today. settlementStrategy stamps a misjudgment on a deploy chosen against a divergent belief, but no receipt field tallies them. A per-year misjudgment count would make a lit and dark comparison at one seed expressible.',
      }),
      Object.freeze({
        name: 'a_turned_ally_is_a_leak',
        description: 'A settlement shares with who it BELIEVES is an ally, so an ally that has turned relays the sharer\'s own high-confidence intel to its real enemy. Belief accuracy is load bearing, not cosmetic.',
        check: 'NOT expressible today, for the same reason: the leak is a belief record with no distinguishing censused field. A provenance census would make it expressible without any change to the engine.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'navalEnabled',
    title: 'Naval layer',
    module: 'src/domain/worldPulse/navalKernel.js,src/domain/spatial/navalLayer.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. blockade_declared and convoy_ordered look like the
      // obvious channel and are NOT: navalKernel mints them as wizard-news beats
      // and realm-verb PROPOSALS, never as selected candidates, so the behavioral
      // observer's eventTypeCounts (built from result.selected) never carries
      // them. Declaring them would be a false channel.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      // The authoritative sidecar, written through setSpatialLedger at
      // navalKernel.js:493 and dropped when no navy is afield. censusWorldStateKeys
      // enumerates spatialLedgers sub-keys, so a v5 receipt reads it.
      stateKeys: Object.freeze(['spatialLedgers.navalTransit']),
      other: 'MEASURED 2026-07-31, and the measurement is the finding. navalActive (navalKernel.js:78) requires the spatial-canon marker AND the virtual navalEnabled key; the whole-world soak canonizes a real digest and full_simulation lights the key, so the gate is OPEN in every completed release case. The layer still has nothing to do: the soak fixture builds a pure land grid (makeGridPack in tests/fixtures/spatialPackFixtures.js via scripts/audit/whole-world-soak-spatial-fixture.mjs), buildSpatialDigest returns reserved.seaLanes null, and navalPortsOf therefore returns an EMPTY port list, so neither a convoy nor a blockade can be derived. That is a HARNESS gap rather than an engine silence, and the distinction is exactly what this row records. TO OBSERVE: canonize a soak fixture whose pack carries water cells, so the digest emits reserved.seaLanes with at least two hostile-owned ports.',
    }),
    // A blockade is a loaded-dice initiation over BLOCKADE_INITIATE_BASE and a
    // convoy needs a sea-reachable hostile port, so both are rare by design.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_naval_layer_needs_a_sea',
        description: 'With no sea lanes in the digest the layer is a no-op even with the flag lit, so an empty ledger in a landlocked fixture is an unexercised subsystem rather than a broken one.',
        check: 'An absent spatialLedgers.navalTransit key in a v5 census is a SILENCE only when the receipt also records that its digest carried sea lanes. The receipt does not carry that fact today, so this check needs one added field (a sea-lane port count in the subsystems section).',
      }),
      Object.freeze({
        name: 'a_blockade_is_a_siege_from_the_water',
        description: 'A blockade mints a siege through the existing interdiction machinery rather than a parallel one, so the war layer and the naval layer never run two different sieges over one port.',
        check: 'A case whose v5 census carries spatialLedgers.navalTransit also carries army_deployed or war_drain in the same or a later year. Expressible from the v5 subsystems.stateKeys fold plus the v4 per-year eventTypeCounts.',
      }),
    ]),
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'peaceEngineEnabled',
    title: 'Peace engine',
    module: 'src/domain/worldPulse/warReasons.js,src/domain/worldPulse/peaceReasons.js,src/domain/worldPulse/peaceTerms.js,src/domain/worldPulse/treatyEnforcement.js,src/domain/worldPulse/treatyTransfer.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. strategy_sue_for_peace is the nearest-looking literal
      // and is NOT this row's: settlementStrategy mints it with or without the
      // peace engine, which only reweights the softmax that chooses it. It read 5
      // in the 30-year 12-settlement seed1 case with nothing proven about this
      // flag. treaty_signed is a wizard-news beat, not a selected candidate.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      // Three conditionally-materialized sidecars, each written only inside the
      // peaceCausalActive gate: warReasons.js:867, peaceReasons.js:505 and
      // peaceTerms.js (the treaties ledger). All three are spatialLedgers sub-keys,
      // which the v5 census enumerates.
      stateKeys: Object.freeze([
        'spatialLedgers.peaceReasons',
        'spatialLedgers.treaties',
        'spatialLedgers.warReasons',
      ]),
      other: 'peaceCausalActive (warReasons.js:408) is warLayerEnabled AND peaceEngineEnabled, both lit in full_simulation, so the two reason movers ran on every tick of every completed case. They emit no candidate on purpose: reasons are READS, not rolls, and the loaded draw that consumes them is the existing settlementStrategy softmax, so the engine\'s output is a REWEIGHTING of candidates that would fire anyway. The treaty lane is now material: treatyEnforcement.js publishes the live war, mobilization and occupation reads, and treatyTransfer.js supplies the conserved grain-transfer executor used by peaceTerms.js. spatialLedgers.treaties remains the ONE canonical observable for those effects; the read helpers and transfer primitive do not invent duplicate state. That makes the three sidecars the only honest channels. The completed release receipts are envelope v4 and carry no subsystems census, which is why this row reports an INSTRUMENT GAP rather than a silence; a v5 rerun of the same cases reads all three for free. treaty_default is now fed from live treaty compliance through peaceTerms.js; corruption_exposed remains the confirmed unfed W-DOCTRINE registration seam, so a thinner-than-expected warReasons ledger is still expected rather than alarming.',
    }),
    // The reason ledgers are recomputed from state every tick, so in a realm that
    // carries any hostility at all they should be populated in most observed years.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'reasons_decay_with_their_state',
        description: 'Every reason is recomputed each tick from existing state, so a record drops when the state behind it clears. The ledger is a mirror, never an archive.',
        check: 'In a v5 census, spatialLedgers.warReasons finalEntries may fall below maxEntries, and the key may be absent at the end of a case that wound its wars down. A ledger whose finalEntries only ever equals its maxEntries across every case is the finding. Expressible from the v5 subsystems.stateKeys fold.',
      }),
      Object.freeze({
        name: 'a_treaty_requires_a_war_that_ended',
        description: 'The treaties sidecar materializes only through the sue-for-peace path, so a treaty without a war behind it would mean the price of peace was charged where no peace was made.',
        check: 'A case whose v5 census carries spatialLedgers.treaties also carries strategy_sue_for_peace in some year of its eventTypeCounts. Expressible from the v5 subsystems.stateKeys fold plus the v4 per-year eventTypeCounts.',
      }),
    ]),
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'warTerminationEnabled',
    title: 'War termination and comparative-cost read',
    module: 'src/domain/certification/couplingRegistry.js,src/domain/worldPulse/warCosts.js,src/domain/worldPulse/warCostsNews.js,src/domain/worldPulse/warTermination.js,src/domain/worldPulse/warSeatBooks.js,src/domain/worldPulse/warPeaceDecision.js,src/domain/worldPulse/warPeaceRefusal.js,src/domain/worldPulse/warPoliticalLoop.js,src/domain/worldPulse/warRulingsEvidence.js,src/domain/worldPulse/warRulingsNews.js,src/domain/worldPulse/npcLadderKernel.js,src/domain/worldPulse/eventProse.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. WR-1, WR-4 and WR-5 share one pulse-record receipt for each
      // valid surviving deployment and store no parallel termination/cost ledger.
      // The receipt and its transition-only news are outside the current soak's
      // event, mover-family and state-key censuses, so neither may masquerade as
      // behavioral aliveness before WR-9 instruments their exact vocabulary.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'Nested under warLayerEnabled through a strict two-flag gate: both warLayerEnabled and warTerminationEnabled must be exactly true before the pure reader runs. Each surviving deployment receives one attacker-centric four-term read per pulse. WR-4 extends that same read rather than adding another feature row or dedicated state owner: warCosts.js compares the newest current-episode receipt\'s believedBalanceBand with the current believedBalanceBand carried by pulseRecord.warTerminationReads, yielding winning, losing or an explicitly decision-silent even trajectory; truthBalanceBand can only support the private trajectoryMisread diagnostic. The homeFrontComponents receipt carries roads, stores, hands, institutions and markets as qualitative band plus stateRead evidence from existing ledgers, with duration scaling only degradation that is already present; the existing tradeWarState prize row retains each displaced holder\'s own lostSupplierSinceTick so a later flip cannot re-date its loss. warCostsNews.js projects only onset or upward crossings through war_trajectory_winning, war_trajectory_losing, home_front_roads, home_front_stores, home_front_hands, home_front_institutions, home_front_markets, winning_abroad_losing_at_home and the DM-only trajectory_misread family; the combined public victory requires both believed and true winning trajectories, so a mistaken court cannot manufacture a real victory, and institution degradation is an events receipt rather than an adjudication act. WR-5 extends the same four-term read through the two books: realm interests and the exact living ruling seat are combined through bounded security, legitimacy, facet and alignment weights, while an exact covert patron may substitute its books without ever entering public prose. The target court now reads every peace offer through that evaluator: only two yeses resume the existing relationship, recall and treaty writers, while one refusal leaves the deployment live and applies relationship grievance, legitimacy and true allied co-besieger patience once by outcome id. That decision can feed the existing faction-pair challenge lane in either direction; a successful applied power transfer writes one bounded ladder-owned seatTransitions row whose optional typed warDemand is honored only by the current seat transition. A semantic authority-signature change re-reads the same deployment, discounts momentum only at consumption, and permanently dissolves an opening corruption_exposed cause only when an exact typed applyNpcVerdict receipt names the removed prior ruler; raw organic ouster events are not verdict provenance. The transition composer projects exactly fourteen governed families: sued_for_peace_seat, sued_for_peace_realm, war_continued_for_the_seat, war_ended_against_rival_triumph, peace_refused, refusal_cost_legitimacy, refusal_cost_ally_patience, ruler_books_compromised, war_party_overturns_peacemaker, peace_party_overturns_warmonger, succession_demand_inherited, successor_repudiates_war, successor_escalates_war and war_dissolved_by_verdict. pulseRecord.warTerminationReads remains pulse evidence, pulseRecord.warAuthorityVerdicts is the gated H2 provenance receipt, seatTransitions remains the existing ladder owner\'s bounded history, and governed Wizard News families are presentation evidence rather than eventTypes. NO EXCLUSIVE ALIVENESS CHANNEL therefore exists in the current certification envelope. TO OBSERVE: WR-9 must fold decidingTerm, believedBalanceBand, truthBalanceBand, trajectory, trajectoryMisread, homeFrontBand, each homeFrontComponents.*.{band,stateRead}, authoritySignature, opponentAuthoritySignature, booksInterest, booksDirection, rulerSecurityBand, rulerLawfulnessBand, rulerMoralityBand, rulerId, opponentRulerId, factionId, patronId, rivalTriumphBand, momentumBroken, authorityChangeKind, authorityVerdictId, authorityDissolvedCauseTypes, opponentAuthorityDissolvedCauseTypes, opponentBelievedBalanceBand, opponentTruthBalanceBand, pulseRecord.warAuthorityVerdicts[].{kind,source,settlementId,npcId,rosterId,verdict,exposureKind,tick}, the bilateral decision fields decision, actualAction, interestServed and inheritedDemand, the nine war-cost familyId values and all fourteen war-ruling familyId values into behavioral story-mix fields. Only that fold can distinguish a live cause, comparative cost, continuing/stopping decision, home-front reading, bilateral court decision or authority re-read without borrowing traffic from the parent war lane. Until a post-WR-9 receipt executes that fold, DORMANT_BY_CONFIG while this declared flag is false and UNOBSERVED when lit are the only honest verdicts.',
    }),
    // The reader evaluates every active deployment on every pulse. A quiet realm
    // has no read to emit, but an active war must not sample its exit sporadically.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'one_read_per_valid_surviving_deployment',
        description: 'Every valid active deployment is read exactly once from its attacker perspective on a lit pulse, with no duplicate graph-front pass.',
        check: 'Not expressible in the current envelope. WR-9 must record the per-year decidingTerm total beside an active-deployment denominator before a soak receipt can execute this invariant.',
      }),
      Object.freeze({
        name: 'termination_receipts_are_not_state',
        description: 'The four-term and comparative-cost answer is pulse evidence, not a second war ledger, so pulse-history retention never creates a dedicated state twin.',
        check: 'A v5 stateKeys census must never acquire a terminationRead, warTerminationReads, warCosts or homeFrontCosts key; WR-9 observes the existing pulse-record fold instead of adding persisted state.',
      }),
      Object.freeze({
        name: 'belief_drives_trajectory_truth_only_diagnoses',
        description: 'Winning and losing follow consecutive believed balance bands; the parallel truth bands may reveal a misread but can never alter the behavioral comparison, and an even result is decision-silent.',
        check: 'WR-9 must reject a non-even trajectory without two believed bands, reject a trajectory decision term on an even row, and show through the separate diagnostic API that changing only its truth-band arguments changes trajectoryMisread but not the belief evaluator output.',
      }),
      Object.freeze({
        name: 'home_front_reuses_existing_degradation',
        description: 'Roads, stores, hands, institutions and markets are qualitative reads of existing state, never a new war-tax stock or a second count of attrition, exhaustion or economy pressure.',
        check: 'Every non-quiet homeFrontComponents member must carry its own stateRead and closed band; a source-absent fixture stays quiet, and no component stateRead may name attrition, warExhaustion or the existing economy-pressure term.',
      }),
      Object.freeze({
        name: 'duration_never_invents_home_front_cost',
        description: 'Deployment duration accelerates degradation that exists but supplies no evidence by itself.',
        check: 'WR-9 must compare opening and protracted receipts with every component quiet and require homeFrontBand quiet in both, while a matched non-quiet source may harden monotonically with duration.',
      }),
      Object.freeze({
        name: 'war_cost_news_is_transition_only',
        description: 'Reader receipts speak only on trajectory onset/change, a home-front upward crossing, the first winning-abroad contradiction, or the first belief/truth misread.',
        check: 'WR-9 story-mix evidence must show no repeated familyId for an unchanged attacker-target receipt; trajectory_misread is DM-only and home_front_institutions files under events rather than adjudication.',
      }),
      Object.freeze({
        name: 'two_books_never_mint_a_fifth_term',
        description: 'Realm, ruling-seat and exact covert-patron interests may reweight the existing four terms but never create a fifth stopping rule or fabricate a ruler.',
        check: 'Every WR-9 war-ruling receipt must retain exactly the four canonical term keys; a missing living ruling seat records realm books only, and a patron identity is admissible only on the exact compromise edge.',
      }),
      Object.freeze({
        name: 'bilateral_peace_requires_two_yeses',
        description: 'The offerer and target read the same live offer independently; either refusal leaves hostility and deployments intact and prices the refusal once.',
        check: 'A WR-9 decision fold must show label, recall and treaty mutation only when both party decisions accept, and at most one refusal consequence group for each stable outcome id.',
      }),
      Object.freeze({
        name: 'only_the_current_seat_inherits_a_war_demand',
        description: 'An installing faction demand rides the bounded ladder-owned transition that earned it and expires when a later seat transition supersedes that authority.',
        check: 'For each settlement, WR-9 must reject an inherited-demand decision whose transition id is not the newest applicable seatTransitions row and reject any parallel succession ledger.',
      }),
      Object.freeze({
        name: 'private_patron_books_never_enter_public_prose',
        description: 'A compromised court can optimize for its exact patron, but public receipts name only supportable public actors while the compromise reading remains DM-only.',
        check: 'Every public WR-9 war-ruling story row must omit patronId and patronName; ruler_books_compromised must remain DM-only and covert.',
      }),
      Object.freeze({
        name: 'seat_transitions_have_one_bounded_writer',
        description: 'Organic succession and applied power transfer share the ladder normalizer and append helper, with deterministic identity, retry deduplication and oldest-first retention.',
        check: 'A v5 state census may find seatTransitions only beneath spatialLedgers.npcLadder; WR-9 must reject duplicate transition or decision ids and any history longer than the declared bound.',
      }),
      Object.freeze({
        name: 'verdict_dissolution_cannot_revive_the_exposed_quarrel',
        description: 'Only an exact typed applyNpcVerdict receipt for the replaced prior ruler may dissolve an opening corruption_exposed cause; later pulses retain that exact dissolution while the external scandal ledger decays.',
        check: 'WR-9 must show one momentum-broken war_dissolved_by_verdict transition with matching authorityVerdictId and gated warAuthorityVerdicts provenance, followed by continued authorityDissolvedCauseTypes without a revived corruption_exposed deciding cause; a raw corruptionEvents ouster must never satisfy this check.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'lineageClaimEnabled',
    title: 'Lineage claim and kinship mirror',
    module: 'src/domain/certification/couplingRegistry.js,src/domain/worldPulse/lineageClaim.js,src/domain/worldPulse/lineageNews.js,src/domain/worldPulse/warReasons.js,src/domain/worldPulse/peaceReasons.js,src/domain/worldPulse/eventProse.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. WR-3's five governed kinds are Wizard News
      // presentation receipts, not selected behavioral outcomes, and the
      // transition composer owns no exclusive state key. A numeric suppression
      // onset memo rides the shared warReasons pair entry solely for once-only
      // narration. Borrowing that shared ledger here would still let any other
      // casus falsely certify lineage.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'BUILT AND DEFAULT-DARK, WITH NO BORROWED ALIVENESS CHANNEL. lineageClaimEnabled is a virtual key absent from defaults and explicitly false in full_simulation. When deliberately lit beneath the warLayerEnabled plus peaceEngineEnabled reason engine, a real campaign-member parentRef and its live edge feed one shared POP→WAR read: a size inversion materializes lineage_claim, the opposite sign materializes kinship_bond on a live war, and corroborated provisioning defeats the claim. The reason records themselves use the governed lineage prose pools. lineage_edge_recorded, casus_lineage_claim_parent, casus_lineage_claim_child, mirror_kinship_bond and lineage_claim_suppressed now all reach Wizard News with familyId, significance, audience and desk metadata; claim and bond beats fire only on reason materialization, while a numeric onset memo inside the shared warReasons pair makes suppression fire exactly once even when founding support predates the later inversion. None is a selected candidate type or an exclusive state container. spatialLedgers.warReasons and spatialLedgers.peaceReasons are shared by every cause and mirror, so this row may not borrow either key as proof. TO OBSERVE: WR-9 must fold the five lineage familyId values into its story-mix evidence and record a reachable campaign-member parent-child pair denominator beside positive claim, kinship and suppression totals. Until that instrument executes, a false flag is DORMANT_BY_CONFIG and a deliberately true flag is behaviorally implemented but soak-UNOBSERVED.',
    }),
    // Once lit, both signs are recomputed from the same live edge each pulse;
    // presentation emission is reactive, but the causal read itself is per-tick.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'one_edge_two_opposite_signs',
        description: 'Lineage claim and kinship bond read one parent-child evidence record in opposite directions rather than maintaining drifting twins.',
        check: 'WR-9 must record one shared lineage evidence identity beside both signs and reject a receipt whose claim and bond name different relationship records.',
      }),
      Object.freeze({
        name: 'reader_receipts_are_not_behavioral_aliveness',
        description: 'Five fully authored Wizard News kinds make the cause legible without masquerading as selected simulation outcomes.',
        check: 'The story-mix instrument may count lineage familyId values while behavioral eventTypeCounts, mover counts and the subsystem state-key census remain unchanged by prose alone.',
      }),
      Object.freeze({
        name: 'dark_lineage_adds_no_persisted_surface',
        description: 'Absent and explicit-false lineage flags preserve the pre-WR-3 world and never mint an empty reason, mirror, or lineage sidecar.',
        check: 'A pre-wire dormancy golden compares absent versus explicit false and requires byte identity across world state, settlements, graph, news and pulse receipts.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
]);

/**
 * War-cohort rule keys that do not yet carry a row. SHRINK-ONLY, and now EMPTY:
 * every war-stack switch above is authored. It stays exported because
 * subsystemCertification.js composes the four lane lists unconditionally and the
 * next war switch added to the engine belongs here until its row lands.
 * @type {ReadonlyArray<string>}
 */
export const WAR_PENDING_RULE_KEYS = Object.freeze([]);
