/**
 * subsystemRowsPeople.js — SUBSYSTEM CERTIFICATION ROWS for the PEOPLE cohort: the
 * six rule keys that govern who lives in the realm, how many of them there are,
 * where they go, and how their settlements regard one another.
 *
 * WHY A LANE OF ITS OWN. The other lane files split by rule-key COHORT (defaults,
 * WAVES, war, ONE_REGEN). This one splits by SUBJECT, and deliberately: its six
 * keys straddle two cohorts (four ride DEFAULT_SIMULATION_RULES, npcGrowth and
 * npcLadder are ONE_REGEN virtuals), and their vocabularies are the estate's
 * largest (52 relationship literals, 66 stressor literals). Folding them into the
 * baseline and regen lanes would push both toward the 800-effective-line domain
 * ceiling and put four authors in one file. npcAgencyEnabled, the seventh people
 * key, keeps its authored row in subsystemRowsBaseline.js: it is the contract's
 * exemplar and moving it would rewrite another author's bytes for no gain.
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and the evidence law. Both are binding here.
 *
 * WHAT THIS LANE MEASURED (2026-07-31, over the seven completed release cases in
 * artifacts/soak/release.cases; 163 observed years, the longest a century):
 *   relationshipDynamics  100/100, 30/30 and 30/30 years carried its vocabulary.
 *   stressors             30/30 years in both 30-year cases, but 2/100 in the
 *                         century case: a four-settlement realm ran a hundred
 *                         years on fifteen stressor events.
 *   populationDynamics    zero population_growth and zero population_decline in
 *                         every case (they are recordMode state_only unless
 *                         major); population_emigration in five of seven.
 *   migrationFlows        ZERO flow_migration in every case, every year. The
 *                         refugee lane never fired once in 163 observed years.
 *   npcGrowth, npcLadder  no dispositive channel exists in a v4 receipt; both
 *                         write a spatialLedgers sidecar the v5 census reads.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemRowsPeople.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The stressor catalog's type keys (STRESSOR_CATALOG, worldPulse/stressorsCore.js),
 * enumerated here rather than imported so this data file pulls no engine module
 * into the certification chunk. tests/domain/subsystemRowsPeople.test.js pins the
 * list against the live catalog, so a new stressor type reds rather than silently
 * escaping the vocabulary. slave_revolt is retained although the catalog marks it
 * deprecated: it never births organically (stressors.js:386 filters it out of the
 * birth gate) but a legacy or DM-authored instance still escalates and spreads.
 * @type {ReadonlyArray<string>}
 */
const STRESSOR_TYPES = Object.freeze([
  'betrayal',
  'coup_detat',
  'criminal_corridor',
  'disease_outbreak',
  'famine',
  'indebtedness',
  'infiltration',
  'insurgency',
  'magic_deadzone',
  'magical_instability',
  'market_shock',
  'mass_migration',
  'monster_raider_pressure',
  'occupation',
  'political_fracture',
  'rebellion',
  'religious_conversion_fracture',
  'siege',
  'slave_revolt',
  'succession_void',
  'wartime',
]);

/**
 * The stressor lane's full candidate vocabulary. The three per-type templates are
 * the exact source expressions: `stressor_birth_${type}` (stressors.js:422),
 * `stressor_escalate_${stressor.type}` (:639) and `stressor_spread_${stressor.type}`
 * (:675), plus the wander residual (:138) and the two coup verdicts, which
 * pulseKernel.js `const coupOutcomes = simulationRules.stressorsEnabled` gates on
 * this same flag.
 * @type {ReadonlyArray<string>}
 */
const STRESSOR_EVENT_TYPES = Object.freeze([
  'coup_succeeded',
  'coup_suppressed',
  'stressor_residual',
  ...STRESSOR_TYPES.flatMap((type) => [
    `stressor_birth_${type}`,
    `stressor_escalate_${type}`,
    `stressor_spread_${type}`,
  ]),
]);

/**
 * Every candidateType the relationship rule files emit, one per authored rule:
 * the 46 that ride the labelProposal/internalDrift helpers plus the six built
 * inline (ally_burden, cold_war_supply_sanctions, hostile_raid,
 * trade_embargo_collapse, vassal_rebellion, vassal_tribute_extraction).
 * tests/domain/subsystemRowsPeople.test.js re-extracts them from the two rule
 * files and the helper, so a new relationship rule cannot enter unlisted.
 * @type {ReadonlyArray<string>}
 */
const RELATIONSHIP_EVENT_TYPES = Object.freeze([
  'allied_overburdened',
  'allied_shared_recovery',
  'ally_burden',
  'ally_cold_war_support',
  'ally_conflict_mirror',
  'client_appeals_for_protection',
  'client_autonomy_bid',
  'client_compliance',
  'client_debt_spiral',
  'cold_war_escalation',
  'cold_war_espionage',
  'cold_war_proxy_conflict',
  'cold_war_supply_sanctions',
  'cold_war_thaw',
  'criminal_legitimizes_trade',
  'criminal_protection_racket',
  'criminal_smuggling_expands',
  'criminal_to_cold_war',
  'hostile_attrition_deescalation',
  'hostile_forced_tribute',
  'hostile_occupation_pressure',
  'hostile_raid',
  'hostile_truce',
  'neutral_border_incident',
  'neutral_to_patronage',
  'neutral_to_rival',
  'neutral_to_trade_partner',
  'patron_extracts_tribute',
  'patron_forces_alignment',
  'patron_intervenes',
  'patron_overreach',
  'patron_protects_investment',
  'rival_arms_race',
  'rival_detente',
  'rival_power_play',
  'rival_sabotage',
  'rival_to_cold_war_or_hostile',
  'shared_enemy_alliance',
  'trade_dependency_coercion',
  'trade_embargo_collapse',
  'trade_route_disruption',
  'trade_smuggling_pressure',
  'trade_to_allied',
  'trade_to_patron_client',
  'vassal_cold_war_support',
  'vassal_overlord_weakness_memory',
  'vassal_protection_burden',
  'vassal_rebellion',
  'vassal_rebellion_quashed',
  'vassal_rebellion_succeeds',
  'vassal_stability_compact',
  'vassal_tribute_extraction',
]);

/**
 * The three population candidate kinds. `kind` is computed at
 * populationDynamics.js:363 and interpolated into `population_${kind}` at :367.
 * @type {ReadonlyArray<string>}
 */
const POPULATION_EVENT_TYPES = Object.freeze([
  'population_decline',
  'population_emigration',
  'population_growth',
]);

/**
 * The people lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const PEOPLE_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'stressorsEnabled',
    title: 'Stressors',
    module: 'src/domain/worldPulse/stressors.js,src/domain/worldPulse/stressorsCore.js,src/domain/worldPulse/coup.js',
    aliveness: Object.freeze({
      eventTypes: STRESSOR_EVENT_TYPES,
      // Corroborating only. The `pressure` family is fed by the emergent pressure
      // conditions and by every aftermath producer as well as by this lane, so it
      // cannot carry ALIVE; the 66 literals above are the dispositive channel.
      moverFamilies: Object.freeze(['pressure']),
      // DELIBERATELY EMPTY. worldState.stressors looks like the obvious ledger and
      // is NOT a faithful gate: pulseKernel.js `const agedStressors = simulationRules.stressorsEnabled`
      // falls back to worldState.stressors
      // verbatim when the flag is dark, so a legacy or DM-authored stressor keeps the
      // container populated in a world where the rules never ran. Declaring it would
      // grade this row ALIVE off state nobody wrote this run.
      stateKeys: Object.freeze([]),
      other: 'The gate is a single seam: candidateEvents.js:442 admits evaluateStressorRules only when rules.stressorsEnabled is true, and pulseKernel.js `const agedStressors = simulationRules.stressorsEnabled` and pulseKernel.js `const coupOutcomes = simulationRules.stressorsEnabled` gate the aging pass and the coup verdicts on the same flag, so every literal above is unreachable when it is dark. TWO EXPECTED ZEROES, neither a silence. stressor_spread_disease_outbreak is suppressed at candidateEvents.js:477 whenever the spatial-canon marker is set, because the epidemic front materializes that same stressor hop by hop post-apply; and stressor_birth_slave_revolt cannot fire at all, because the catalog marks the type deprecated and stressors.js:386 filters deprecated types out of the birth gate. MEASURED 2026-07-31: 30 of 30 years in both 30-year 12-settlement cases (431 and 584 events), but only 2 of 100 years in the 100-year 4-settlement case (15 events). A century that quiet is what the tempo floor exists to surface.',
    }),
    // Births are pressure-gated rather than guaranteed, so a quiet year is legal;
    // a realm that carries pressures at all should still birth, escalate or resolve
    // a stressor in most years.
    expectedTempo: 'yearly',
    invariants: Object.freeze([
      Object.freeze({
        name: 'stressors_are_gated',
        description: 'No stressor candidate, and no coup verdict, can appear while stressorsEnabled is dark. The flag is the whole lane, not a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records stressorsEnabled false, the summed eventTypeCounts over the declared literals is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'escalation_follows_a_birth',
        description: 'A stressor escalates or spreads only after it exists. In a receipt observed from world genesis, no escalate or spread of a type can precede that type first appearing.',
        check: 'For every year carrying stressor_escalate_TYPE or stressor_spread_TYPE, an earlier or same year in the case carries stressor_birth_TYPE for the identical TYPE. Expressible from the v4 per-year eventTypeCounts. NOT expressible for a receipt whose observation starts mid-campaign, because a stressor authored before the window has no observable birth.',
      }),
      Object.freeze({
        name: 'a_coup_verdict_has_a_coup_behind_it',
        description: 'coup_succeeded and coup_suppressed are the resolution of a coup_detat stressor, never spontaneous regime change.',
        check: 'Every year carrying coup_succeeded or coup_suppressed has an earlier or same year carrying stressor_birth_coup_detat. Expressible from the v4 per-year eventTypeCounts, with the same mid-campaign limit as escalation_follows_a_birth.',
      }),
    ]),
    // Measured in every completed release case; the century case measured it thin
    // rather than absent, which is a tempo finding and not a silence.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'relationshipDynamicsEnabled',
    title: 'Relationship dynamics',
    module: 'src/domain/worldPulse/relationshipEvolution.js,src/domain/worldPulse/relationshipRulesCore.js,src/domain/worldPulse/relationshipRulesAdversarial.js,src/domain/worldPulse/relationshipRuleHelpers.js',
    aliveness: Object.freeze({
      eventTypes: RELATIONSHIP_EVENT_TYPES,
      // DELIBERATELY EMPTY. This vocabulary does not classify into ONE mover family
      // and never could: the observation classifier files vassal_* and the challenges
      // under politics, trade_* under economy, cold_war_* and hostile_* under war,
      // and several literals (rival_sabotage, rival_power_play, client_compliance)
      // match no family token at all and land in unclassifiedEventCount. Claiming any
      // single family would be false in both directions.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. worldState.relationshipStates is the obvious ledger and
      // is NOT a faithful gate: both calls are unconditional —
      // pulseKernel.js `worldState = ensureAllRelationshipStates(worldState, snapshot);` and
      // pulseKernel.js `worldState = relaxRelationshipStates(worldState, buildMemoryHorizonResolver(snapshot));`
      // — so
      // every edge carries a state even in a world where the rules never ran. This is
      // the npcStates precedent from the npcAgency exemplar, one layer out.
      stateKeys: Object.freeze([]),
      other: 'The gate is a single seam: candidateEvents.js:481 admits evaluateRelationshipRules only when rules.relationshipDynamicsEnabled is true, so all 52 literals are unreachable when it is dark. The vocabulary is wider than the name suggests and that is deliberate, not drift: trade_route_disruption and trade_smuggling_pressure read as economy and vassal_rebellion reads as politics, but every one of them is authored in the relationship rule files and emitted through this gate, so an economy or politics reading of the realm can be healthy while this lane is dead. Two consumers depend on it downstream: SimulationRulesDialog.jsx:240 forces warLayerEnabled and settlementStrategyEnabled dark whenever this flag is dark, so a SILENT verdict here should be read together with those two rows.',
    }),
    // Every regional edge is evaluated every tick, so a realm with any relationships
    // at all should carry this vocabulary in most observed years. Measured 100/100,
    // 30/30 and 30/30 years in the three multi-year release cases.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'relationships_are_gated',
        description: 'No relationship candidate can appear while relationshipDynamicsEnabled is dark.',
        check: 'In any receipt whose subsystems.rules records relationshipDynamicsEnabled false, the summed eventTypeCounts over the 52 declared literals is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'drift_reaches_the_final_decade',
        description: 'Relationship evolution is a per-tick lane over a graph that does not shrink, so it must still be firing at the end of the run rather than exhausting itself early.',
        check: 'The share of observed years carrying at least one declared literal is at least the per_tick tempo floor, and at least one such year falls in the final decade of the receipt. Expressible from the v4 per-year eventTypeCounts.',
      }),
      Object.freeze({
        name: 'a_label_change_leaves_a_trace',
        description: 'The label proposals (neutral_to_rival, rival_detente, hostile_truce and their siblings) retype an edge, so a realm carrying them should show its politics or war mover families move in the same year.',
        check: 'Every year whose eventTypeCounts carries a labelProposal literal has a non-zero moverCounts entry in politics, war or economy for that year. Expressible from the v4 per-year eventTypeCounts plus moverCounts. Corroborating only: those families are shared, so this check can fail to alarm, never falsely alarm.',
      }),
    ]),
    // The richest measured lane in the completed soak.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'populationDynamicsEnabled',
    title: 'Population dynamics',
    module: 'src/domain/worldPulse/populationDynamics.js',
    aliveness: Object.freeze({
      eventTypes: POPULATION_EVENT_TYPES,
      // Corroborating only. The `population` family is also fed by the migration
      // flows, the spatial migration kernel and the calamity exodus, so it can never
      // carry ALIVE for this row on its own.
      moverFamilies: Object.freeze(['population']),
      // DELIBERATELY EMPTY. This lane writes settlement.population through
      // populationDeltas, not a worldState container, so the stateKeys census has
      // nothing of its own to enumerate. The receipt's per-year stateVectors DO carry
      // the resulting populations, but the aliveness instrument does not read them;
      // that gap is named in the invariants below rather than papered over.
      stateKeys: Object.freeze([]),
      other: 'THE RECORD-MODE BLIND SPOT, and it is structural. Every ordinary growth or decline candidate carries recordMode state_only (populationDynamics.js:377), and the receipt counts event types over result.selected filtered by isPublicOutcome, so only a MAJOR transition or a mass emigration can ever reach eventTypeCounts. MEASURED 2026-07-31: zero population_growth and zero population_decline in all seven completed release cases, while population_emigration measured 111, 31, 16, 107 and 323 in five of them and zero in both 4-settlement cases, including the 100-year run. A low count is therefore expected; a zero count in a realm whose stateVectors populations move is the finding, and the century case is exactly that shape. The literal population_emigration is shared with calamityKernel.js:679, which builds a shape-identical exodus outcome, but that twin is applied inside the calamity mover (applyExodusToUpdates) and never joins result.selected, so an eventTypeCounts hit belongs to this lane.',
    }),
    // The chooser runs per settlement per tick, but its PUBLIC vocabulary is only
    // major transitions and mass emigration, which are genuinely multi-year events.
    // Declaring per_tick here would certify against a standard the design forbids.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'population_is_gated',
        description: 'No population candidate can appear while populationDynamicsEnabled is dark (populationDynamics.js:409 returns the empty list before any settlement is read).',
        check: 'In any receipt whose subsystems.rules records populationDynamicsEnabled false, the summed eventTypeCounts over the three declared literals is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'an_emigration_empties_its_origin',
        description: 'A mass emigration debits the settlement it leaves. People move; they are not minted at the destination out of nothing.',
        check: 'In every year carrying population_emigration, at least one settlement stateVector population falls against the prior year. Expressible from the v4 per-year stateVectors plus eventTypeCounts. NOT expressible per candidate: the receipt records no per-outcome origin id, so the check is realm-level rather than settlement-level.',
      }),
      Object.freeze({
        name: 'ordinary_drift_stays_mechanical',
        description: 'Ordinary growth and decline are state math, not Chronicle beats. A public population_growth or population_decline therefore means a MAJOR transition happened that year.',
        check: 'Every year whose eventTypeCounts carries population_growth or population_decline has majorEventCount at least 1. Expressible from the v4 per-year observation directly.',
      }),
    ]),
    // Measured through the emigration channel in five of seven cases; the growth and
    // decline channels are measurable in principle and read zero everywhere.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'migrationFlowsEnabled',
    title: 'Migration flows',
    module: 'src/domain/worldPulse/flows.js,src/domain/worldPulse/populationDynamics.js',
    aliveness: Object.freeze({
      eventTypes: Object.freeze(['flow_migration']),
      // DELIBERATELY EMPTY, and the obvious `population` claim is FALSE. MEASURED
      // 2026-07-31 by running the production classifier over the real record shape:
      // a flow_migration candidate carries type 'condition' (flows.js:81), and
      // `condition` is a PRESSURE token, so moverFamilyOf files this lane under
      // pressure, not population. The classifier reads runtime fields the emitting
      // module alone does not determine, so no family is claimed here.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. spatialLedgers.migration (the in-transit refugee column
      // ledger) looks like the obvious sidecar and is NOT a faithful gate:
      // pulseKernel.js `if (migrationActive(memoryState)) {` dispatches into it whenever
      // that spatial-canon marker holds, over every realized emigration outcome including
      // calamityKernel's exodus, which this flag does not gate at all.
      stateKeys: Object.freeze([]),
      other: 'THE HEADLINE SILENCE OF THIS LANE. MEASURED 2026-07-31: flow_migration appears ZERO times in all seven completed release cases, across 163 observed years including a full century, while the shared population family moved in four of them. Both conjuncts of the emission gate are worth inspecting: flows.js:62 requires a displacement stressor (famine, siege, plague, disease_outbreak, occupation, wartime, mass_migration, monster_raider_pressure, insurgency) at severity at least 0.6, and flows.js:73 requires an active channel of type migration_pressure, trade_route or political_authority out of the afflicted settlement. ONE KEY, TWO LANES. This flag ALSO admits the mass-emigration transfer inside populationDynamics.js:335, and that second lane is NOT separately observable: population_emigration fires with or without it, and only transferMode and the paired destination credits change. What would close the gap: a receipt field recording the emigration outcomes metadata.transferMode, which would separate a distributed emigration from a void one. Until then a SILENT verdict here reports the refugee-candidate lane only, and the row says so rather than implying the whole flag is dead.',
    }),
    // A realm that carries famines, sieges and occupations should push refugees down
    // a channel within a decade. Declaring `rare` would make 163 silent years pass.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'migration_flows_are_gated',
        description: 'No flow_migration can appear while migrationFlowsEnabled is dark, or while propagationMode is off or local (candidateEvents.js:513 excludes both).',
        check: 'In any receipt whose subsystems.rules records migrationFlowsEnabled false, eventTypeCounts.flow_migration is absent or zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts. The propagationMode half is NOT expressible: propagationMode is a string, and subsystems.rules records boolean switches only.',
      }),
      Object.freeze({
        name: 'refugees_leave_somewhere_and_arrive_somewhere',
        description: 'A refugee flow is a transfer: it debits the source and credits the destination in the same tick, so it moves two settlements in opposite directions.',
        check: 'In every year carrying flow_migration, at least two settlement stateVectors populations move against the prior year and at least one of them rises. Expressible from the v4 per-year stateVectors plus eventTypeCounts; realm-level rather than pair-level, because the receipt records no per-outcome endpoints.',
      }),
      Object.freeze({
        name: 'a_displacement_crisis_should_displace',
        description: 'The lane keys off displacement stressors. A realm that carries severe famines, sieges or occupations for years and never moves a refugee is the silence this contract exists to name.',
        check: 'Over the whole receipt, if the summed eventTypeCounts for stressor_birth_famine, stressor_birth_siege, stressor_birth_occupation, stressor_birth_wartime, stressor_birth_disease_outbreak, stressor_birth_mass_migration, stressor_birth_monster_raider_pressure and stressor_birth_insurgency is non-zero, flow_migration should be non-zero. Expressible from the v4 eventTypeCounts. Note the severity floor: a birth alone does not prove the 0.6 band was ever reached, so this check is a lead to inspect rather than a proof of defect.',
      }),
    ]),
    // Measured, and it measured zero everywhere. The instrument worked; the lane did
    // not fire.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'npcGrowthEnabled',
    title: 'NPC growth layer',
    module: 'src/domain/worldPulse/npcGrowthKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The growth layer is a post-apply mover: it emits no
      // candidate at all, so nothing it produces can reach result.selected, and
      // eventTypeCounts observes result.selected only. Its public output is a wizard
      // news entry carrying impactKind npc_growth (npcGrowthKernel.js:708), and an
      // impactKind is invisible to the event-type channel by construction. Declaring
      // it would manufacture a channel that reads zero forever and mint a false
      // SILENT on every receipt ever written.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The growth beat DOES classify into `people` today, but
      // only by accident of its own id: moverFamilyOf reads the wizard-news id, which
      // is `wizard_news.<tick>.npc_growth.<npcId>.<trait>.<gain|shed>`, so a future
      // trait word that happens to be a faith or politics token would silently move
      // the whole lane into another family. MEASURED 2026-07-31 on the real record
      // shape; the sibling ladder row proves the hazard is not hypothetical. A family
      // claim here would also be corroborating-only and could never carry ALIVE, so
      // nothing is lost by declining it.
      moverFamilies: Object.freeze([]),
      // The authoritative deposit ledger, and an exclusive one: advanceNpcGrowth
      // returns an immediate no-op at npcGrowthKernel.js:402 when npcGrowthActive is
      // false, so the key cannot exist with the flag dark. Receipt-expressible only
      // from the v5 subsystems.stateKeys census, which enumerates spatialLedgers
      // sub-keys by dotted path.
      stateKeys: Object.freeze(['spatialLedgers.npcGrowth']),
      other: 'NOT OBSERVABLE IN A v4 RECEIPT, and the row says so instead of borrowing a verdict. Every completed release case is envelope v4 and carries no stateKeys census, so this row has no instrumented channel there at all and grades UNOBSERVED with stateKeys named as the gap. It is deliberately NOT declared soakEvidence unobserved: that flag suppresses the SILENT verdict permanently, and the first v5 receipt whose total census shows NO npcGrowth ledger is exactly the diagnosis this contract was built to make. What would make the completed evidence dispositive: rerun a case on the v5 envelope, or extend the per-year observation to count post-apply impactKinds alongside candidate types.',
    }),
    // Deposits are READS of durable outcomes, not rolls, so a realm carrying
    // calamities, busts and sieges should hold a non-empty ledger in most years.
    // Mints are rare by design; the ledger's presence, not a mint, is the signal.
    expectedTempo: 'yearly',
    invariants: Object.freeze([
      Object.freeze({
        name: 'growth_is_gated',
        description: 'The growth ledger cannot exist while npcGrowthEnabled is dark. The dormancy gate is a whole-mover early return, not a suppressed write.',
        check: 'In any receipt whose subsystems.rules records npcGrowthEnabled false, subsystems.stateKeys carries no spatialLedgers.npcGrowth entry. Expressible from the v5 receipt alone, because the census claims to be total.',
      }),
      Object.freeze({
        name: 'growth_stays_inside_the_roster',
        description: 'The ledger is keyed by the canonical npcId, the same key npcStates uses, so it can never hold more souls than the world is tracking.',
        check: 'subsystems.stateKeys spatialLedgers.npcGrowth maxEntries is at most npcStates maxEntries in the same census. Expressible from the v5 subsystems.stateKeys census alone.',
      }),
    ]),
    // The completed soak carries only the shared people family for this row.
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'npcLadderEnabled',
    title: 'The contested court (NPC ladder)',
    module: 'src/domain/worldPulse/npcLadderKernel.js,src/domain/worldPulse/npcLadderContest.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, for the same structural reason as the growth layer: the
      // ladder is a post-apply mover whose output is wizard news carrying impactKind
      // npc_ladder (npcLadderKernel.js:870 and :907), npc_contest and npc_support
      // (npcLadderContest.js:814 and :834). None of those reach result.selected, so
      // none can appear in eventTypeCounts.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and the obvious `people` claim is FALSE. MEASURED
      // 2026-07-31 by running the production classifier over the real beat: the
      // ladder id is `wizard_news.<tick>.npc_ladder.<sid>.<kind>.<faction>.<nids>`
      // (npcLadderKernel.js:866) and <kind> is `challenge` or `coup`, both POLITICS
      // tokens, and politics precedes people in the family order. So the challenge
      // beats file under politics, npc_contest files under politics through its own
      // token, and only npc_support reaches people. One lane, two families, decided
      // by a runtime id: no family is claimed.
      moverFamilies: Object.freeze([]),
      // The authoritative rank sidecar, exclusive: advanceNpcLadder returns an
      // immediate no-op at npcLadderKernel.js:301 when npcLadderActive is false.
      // spatialLedgers.bluffExposures is written by the same lit path but is a
      // conditional sub-lane, so it is not claimed here.
      stateKeys: Object.freeze(['spatialLedgers.npcLadder']),
      other: 'NOT OBSERVABLE IN A v4 RECEIPT; see the npcGrowth row for the full reading, which applies verbatim. One difference matters: the ladder DERIVES at first lit for every faction from the existing structural positions and then persists, so unlike the growth ledger it should be present in essentially every observed year once the flag is on. A v5 census that carries spatialLedgers.npcLadder in only a few years of a long run is therefore a finding even though the verdict reads ALIVE, and the tempo floor is set to catch exactly that. THE CONTESTED-GOALS ADJUNCT is a second gate, recorded so a reader does not misread a quiet ladder: npcLadderContest.js runs on contestedGoalsEnabled AND npcLadderEnabled, so its npc_contest and npc_support beats can be absent while the ladder itself is entirely healthy.',
    }),
    // Derived at first lit and carried forever after, so its sidecar should be
    // present in essentially every observed year.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'ladder_is_gated',
        description: 'The ladder sidecar cannot exist while npcLadderEnabled is dark.',
        check: 'In any receipt whose subsystems.rules records npcLadderEnabled false, subsystems.stateKeys carries no spatialLedgers.npcLadder entry. Expressible from the v5 receipt alone.',
      }),
      Object.freeze({
        name: 'the_ladder_persists_once_derived',
        description: 'A ladder is derived once per faction and then carried, so its census presence must not flicker: a year that loses the key means the sidecar was dropped, not that the court went quiet.',
        check: 'subsystems.stateKeys spatialLedgers.npcLadder years equals subsystems.observedYears minus the years before it first derived, and finalEntries is at least 1. Expressible from the v5 census; the first-derivation year is NOT recorded, so the check is exact only for a run lit from tick zero.',
      }),
      Object.freeze({
        name: 'a_contest_swaps_rungs_rather_than_minting_them',
        description: 'A challenge displaces a named rival: one soul rises and one falls. The ladder never grows a rung to accommodate a winner.',
        check: 'Across the census, spatialLedgers.npcLadder maxEntries changes only in years where the faction population itself changed. NOT expressible from any receipt today: the census records the entry count per year but no per-faction rung roster, so a swap and a mint are indistinguishable. Recorded here as the instrument gap it is.',
      }),
    ]),
    // The completed soak carries the shared people family in post-apply receipts,
    // which is consistent with the ladder running and proves nothing on its own.
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'npcConsequencesEnabled',
    title: 'The personal consequence economy (durable identity, the world NPC ledger, the verdict table, circulation and replacement)',
    module: 'src/domain/worldPulse/npcLedger.js,src/domain/worldPulse/npcLedgerFacets.js,src/domain/worldPulse/npcLedgerProjection.js,src/domain/worldPulse/npcVerdictTable.js,src/domain/worldPulse/npcVerdictApply.js,src/domain/worldPulse/npcConsequencesTuning.js,src/domain/worldPulse/npcCirculation.js,src/domain/worldPulse/npcCirculationTable.js,src/domain/worldPulse/npcCirculationBelief.js,src/domain/worldPulse/npcCirculationTransit.js,src/domain/worldPulse/npcReplacement.js,src/domain/worldPulse/npcResidency.js,src/domain/worldPulse/npcDmVerbs.js,src/domain/worldPulse/npcRulingRegister.js',
    aliveness: Object.freeze({
      // STILL DELIBERATELY EMPTY AFTER H2, and the reason has changed shape, so it is
      // restated rather than left standing. H1 had no candidate type at all. H2 MINTS
      // one (`npc_verdict`, npcVerdictApply.VERDICT_NEWS_TYPE) and builds the item in
      // pulse-row shape, but NO PULSE PATH ROUTES IT YET: the verdict lane's trigger
      // is the corruption web's exposure record, and wiring that call site belongs to
      // the slice that owns the exposure loop, not to this one. eventTypeCounts
      // observes result.selected only, so declaring `npc_verdict` here today would
      // manufacture a channel that reads zero forever and mint a false SILENT on every
      // receipt written before the wiring lands. THE SLICE THAT WIRES THE TRIGGER MUST
      // ADD IT HERE IN THE SAME EDIT, and H3 must add its rejection / arrival types
      // when their emitters reach the selection.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. A `people` claim would be corroborating-only and could
      // never carry ALIVE, so nothing is lost by declining it; and the sibling rows
      // measured that the family a beat lands in is decided at runtime by tokens in
      // its wizard-news id, which for this lane would straddle people and politics
      // (a banishment is a court act, an arrival is a person act). No family is
      // claimed rather than one guessed.
      moverFamilies: Object.freeze([]),
      // THE ONE REAL H1 CHANNEL, and an exclusive one: every write goes through
      // setNpcLedger, and graduateNpc returns an immediate no-op when
      // npcConsequencesActive is false, so the key cannot exist with the flag dark.
      // Receipt-expressible from the v5 subsystems.stateKeys census, which enumerates
      // spatialLedgers sub-keys by dotted path.
      stateKeys: Object.freeze(['spatialLedgers.npcLedger']),
      other: 'DARK BY DECLARATION, STILL, AFTER H4, AND THE eventTypes LIST IS STILL EMPTY, THOUGH FOR A NEW REASON THAT MATTERS. H4 is the first slice with a LIVE CALLER: the three DM verbs (assign, kill, pardon) and their one inverse are registered store operations a human can press, so unlike every earlier wave this lane is now reachable in a running app rather than only from a test. It is still not reachable from THE PULSE, and eventTypeCounts observes result.selected from a pulse only, so declaring the three H4 candidate types (npc_assignment, npc_death, npc_pardon) here would still manufacture channels that read zero forever. THE SAME GOES FOR THE NEW STATE KEY, and the reasoning is worth writing down because it is the opposite of the usual one: spatialLedgers.npcRulings is a REAL conditional ledger, written by a real caller, and it is deliberately NOT listed in stateKeys because a soak has no DM in it. A key that only ever materializes when a human presses a button would read SILENT on every soak receipt ever written, which would be a false alarm rather than a diagnosis. WHAT H4 ADDED: the Wanderers register as a conditional Herald door (ABSENT when the lane is dark rather than present and empty), the settlement dossier unaffiliates section as the LOCAL projection of the same ledger through the same projection call, the three DM verbs with typed receipts and a typed inverse, the ruling register their address-chain news lands in, and the one function in the estate that can drop a soul out of the ledger, handed to the KILL verb alone. WHAT H4 DID NOT ADD: any pulse call site, any golden movement, and any route from a verdict or a circulation pass into a death. THE H3 TEXT, UNCHANGED, FOLLOWS. DARK BY DECLARATION, STILL, AFTER H3, AND THE eventTypes LIST IS STILL EMPTY FOR THE SAME REASON. H3 mints THREE further candidate types (npc_rejection, npc_arrival, npc_dispersal) and builds every one of them in pulse-row shape, and NO PULSE PATH ROUTES ANY OF THEM YET: the circulation lane has no caller, exactly as the verdict lane has none, because wiring the trigger belongs to the slice that owns the exposure and lifecycle loops. Declaring the three here today would manufacture three channels that read zero forever and mint a false SILENT on every receipt written before the wiring lands. THE SLICE THAT WIRES THEM MUST ADD THEM HERE IN THE SAME EDIT. WHAT H3 ADDED, AND WHAT IT DID NOT: the banded replacement delay and the marginal settlement-state trait bias (envelope-pinned at its designed effect size AND stationarity-pinned at a century horizon, both through the registered distribution-envelope pair); the rehost candidate flow with exclusion edges filtered FIRST; the authored closed rejection compatibility table and its cooldown edge; sibling-faction founding under a full power; the turncoat capacity vocabulary; the belief derivation that makes admission run on LOCAL BELIEF rather than global truth; the one-hop travel physics with its mid-route conditional leg; residency with banded stays, floored preference weights and growth-system drift inside the growth kernel own caps; and the population-floor reconciliation with its dispersal. Every one exists and is pinned as a pure function; none is called from the pulse. NOTE FOR THE READER OF A RECEIPT: the ledger key census now counts souls that reached it through FIVE doors rather than one (verdict graduation, destruction dispersal, rehost placement, residency, and the DM verbs H4 will add), so the entry count alone still cannot say which door, and the disjointness and never-reminted invariants below remain the honest limit. THE H2 TEXT, UNCHANGED, FOLLOWS. DARK BY DECLARATION, STILL, AFTER H2. npcConsequencesEnabled is a virtual flag declared FALSE in the full_simulation spread and lit in no preset, so every receipt grades this row DORMANT_BY_CONFIG until the W-H program lights it at its golden boundary. That is the honest verdict for a slice that is built and gated, and it is exactly why the key is declared at all: a rule key reachable from neither the defaults nor any preset spread is invisible to the totality walker, and a subsystem behind an invisible key can ship completely dead with no check ever asking. npcCredibilityEnabled is that shape in-tree today and carries no row as a consequence. THE INSTRUMENT GAP TO CLOSE LATER: the census records the ledger key\'s ENTRY COUNT per year, not its contents, so it can prove that souls are in the ledger and cannot yet prove which ledger they are in, nor which verdict put them there. The disjointness, never-reminted and relinquishment invariants below are written against that limit rather than around it. WHAT H2 ADDED, AND WHAT IT DID NOT: the total verdict table, atomic influence relinquishment across both NPC alias homes, the banishment exclusion edge, the jail hold, the contested opening and the verdict Herald item all exist and are pinned as pure functions; NOTHING calls them from the pulse yet, so no receipt of any generation can observe them and no new aliveness channel is honest. That is why the eventTypes list above is still empty after a slice that mints a candidate type.',
    }),
    // REACTIVE, per the design. Graduation fires on the corruption web's covert to
    // revealed transition, not on a clock: a realm can honestly run years with no
    // exposure at all, so no per-year floor applies and a single firing anywhere in
    // the span is the aliveness bar.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'consequences_are_gated',
        description: 'The world NPC ledger cannot exist while npcConsequencesEnabled is dark. The dormancy gate is a whole-entry-point early return, not a suppressed write, so the constitutional dormancy law is observable in the receipt rather than only in the golden.',
        check: 'In any receipt whose subsystems.rules records npcConsequencesEnabled false, subsystems.stateKeys carries no spatialLedgers.npcLedger entry. Expressible from the v5 receipt alone, because the census claims to be total.',
      }),
      Object.freeze({
        name: 'the_ledger_never_exceeds_the_cast',
        description: 'CONSERVATION (law 6) at receipt scale: a durable identity is minted for somebody who already exists, so the ledger can never hold more souls than the world is tracking. A ledger larger than the roster would mean graduation invented people.',
        check: 'subsystems.stateKeys spatialLedgers.npcLedger maxEntries is at most npcStates maxEntries in the same census. Expressible from the v5 subsystems.stateKeys census alone. Note the direction of the proof: it can catch invention, and it cannot catch loss, because a soul dropped from the ledger only lowers the count.',
      }),
      Object.freeze({
        name: 'graduation_is_monotone',
        description: 'Graduation is a one-way door: an identity, once minted, is never unminted. So the ledger population may fall only when a lifecycle path legitimately removes a soul, and it must never oscillate year over year the way a re-derived sidecar would.',
        check: 'Across the census, spatialLedgers.npcLedger years equals subsystems.observedYears minus the years before the first graduation, and finalEntries is at least the largest single-year drop. PARTIALLY expressible today: the census gives years, maxEntries and finalEntries but no per-year series, so a fall followed by a rise is indistinguishable from a plateau. Recorded as the instrument gap it is; the exact per-graduation proof lives in the unit pins (mint idempotency, one-way re-graduation) rather than in a receipt.',
      }),
      Object.freeze({
        name: 'no_dm_truth_in_a_player_projection',
        description: 'AUDIENCE PROJECTION (law 7): compromise sources are covert intelligence and must never reach a player view. The projection is allowlist-built, so an unwritten field cannot appear.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT, and named here rather than omitted so the reader knows where the proof lives instead of assuming a soak covers it. A soak receipt records engine state, never a rendered projection. The property is pinned statically in tests/domain/npcLedgerProjection.test.js with an anchored negative (the DM view of the SAME fixture must report the covert path through the same helper), and independently by publicSafe.js\'s recursive denylist, whose PRIVATE_KEY_RE matches the dmTruth spelling. W-H2 EXTENDS THE SAME PROPERTY TO THE VERDICT NEWS ITEM: its typed receipt (which arm ran, the roll, the weights, the compromise source) is written under the SAME dmTruth key, so both mechanisms cover it without either needing to learn a second spelling.',
      }),
      Object.freeze({
        name: 'a_verdict_fires_only_on_a_revealed_exposure',
        description: 'REVEALED-ONLY (law 2, constitutional): the lane fires exclusively on the corruption web\'s covert to revealed transition. A corrupt NPC with no exposure record is COVERT, and npc.corrupt is the hidden state rather than the trigger, so no verdict, no graduation and no ledger write may follow from it.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT: the census records ledger entry counts, never the exposure that produced them, so a receipt cannot distinguish a verdict fired on a revealed exposure from one fired on a covert flag. Pinned statically in tests/domain/npcVerdictTable.test.js with an anchored negative (a covert-but-corrupt fixture yields null while the SAME fixture with an ousting exposure yields a verdict, through the same entry point), which is the shape a receipt cannot reach.',
      }),
      Object.freeze({
        name: 'a_verdict_relinquishes_at_both_alias_homes',
        description: 'INFLUENCE RELINQUISHMENT (design section 4): ladder position, faction role and influence contributions are stripped ATOMICALLY across npcs[] and every factions[].members[] home. The two homes alias in memory and split on serialization, so a one-home strip leaves a disgraced official still holding influence in the faction roster of every RELOADED campaign, and only a reloaded world can see it.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT: no census field reads a faction member\'s influence, and the defect is invisible in memory by construction. Pinned statically in tests/domain/npcVerdictApply.test.js against a JSON-ROUND-TRIPPED fixture (the alias split is the precondition of the measurement, not an incidental detail) with per-home hit counts asserted, so a strip that reached only the roster reds.',
      }),
      Object.freeze({
        name: 'a_replacement_carries_the_town_fingerprint_without_compounding_it',
        description: 'REPLACEMENT (design section 5): a fresh mint draws its traits with a MARGINAL bias toward the settlement own state, and that bias must never COMPOUND. The two halves pull against each other, so both are held at once: the bias is real enough to read at scale, and a cohort minted at year 100 lands inside the same envelope as one minted at year 10. The loop is cut at the INPUT rather than damped at the output: the bias reader consumes settlement state only and never touches the roster, so no cast can feed back into the distribution its successors are drawn from at any horizon.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT: the census records ledger entry counts, never a trait distribution, so a receipt cannot see a fingerprint at all, let alone a compounding one. Pinned statically in tests/domain/npcReplacement.test.js against the registered two-sided distribution envelope (npcConsequences.replacementBias.favoured.upper/lower, derived at alpha 1e-4 with 3.79 and 3.77 sigma of power), with TWO executed negative controls: at bias weight 0 the favoured count falls under the lower bound, and a MUTANT bias that reads the cast escapes the upper bound by year 100 while the real one does not.',
      }),
      Object.freeze({
        name: 'a_gate_answers_on_local_belief_never_on_global_truth',
        description: 'REPUTATION AS BELIEF (design section 6b): the ledger records truth, and what a settlement believes is DERIVED through the information layer, distance-priced from the origin and complicated by infoMode. Admission and rejection run against the LOCAL BELIEF, so a wanderer can outrun their story on a long road and be preceded by it on a short one. The derivation is on demand and NEVER stored per pair: a stored belief would be an S x roamers table, a fresh save-shape contract, and a second thing that can drift from the truth it summarizes.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT, and that is structural rather than an instrument gap: there is no state to census, because the whole point is that no belief is ever written. Pinned statically in tests/domain/npcCirculationBelief.test.js and tests/domain/npcCirculation.test.js: one roamer, one truth, two towns, refused where the story arrived and admitted where it did not, with the near town believed-notoriety rank asserted through the SAME derivation as the positive anchor. The never-stored guard is pinned twice over, by an exact export list carrying no writer and by the world being byte-identical before and after a derivation. NEGATIVE CONTROL EXECUTED: feeding the compatibility table the global truth instead of the local belief reds the pin.',
      }),
      Object.freeze({
        name: 'a_shut_door_is_read_before_anybody_is_judged',
        description: 'CIRCULATION (design section 6): exclusion edges are filtered FIRST, before a belief is derived or a compatibility table is consulted. Not as an optimization: a banished person scored and then refused on COMPATIBILITY grounds would carry the wrong reason into the Herald and could be admitted the day their scandal faded, which is exactly what an edict of banishment exists to prevent. A refusal records a cooldown edge so a roamer does not knock on the same door every tick, and that cooldown is bookkeeping rather than a legal fact, so it never reaches a reader register as a shut door.',
        check: 'PARTIALLY expressible once the lane is wired: a receipt can see the ledger key but never an exclusion edge, so it cannot distinguish a door shut by edict from one shut by cooldown, nor see the order the checks ran in. Pinned statically in tests/domain/npcCirculation.test.js: a banished roamer never rehosts home inside the window while THE SAME roamer at THE SAME tick is admitted elsewhere (the anchor that makes the refusal specific rather than universal), and the candidate flow reports what the filter removed and why. NEGATIVE CONTROL EXECUTED: deleting the exclusion guard lets the banished roamer walk back in and reds the pin.',
      }),
      Object.freeze({
        name: 'the_pool_is_bounded_and_roaming_is_never_trivially_brief',
        description: 'EQUILIBRIUM (design section 6 and section 14): rehost pressure RISES with time in the pool so unassigned roamers eventually settle themselves and the Wanderers register cannot become a graveyard of forgotten names. The inverse failure is named in the design too, so the curve has a FLOOR: no roamer attempts a rehost at all for the first weeks on the road, which keeps roaming from being trivially brief and the register from being vestigial.',
        check: 'EXPRESSIBLE ONLY AS A CEILING once the lane is wired: subsystems.stateKeys spatialLedgers.npcLedger maxEntries is at most the pool ceiling (roamers per mapped settlement) plus the placed population, and the census cannot separate the two maps, so the receipt bounds the union rather than the pool. Pinned statically in tests/domain/npcCirculation.test.js: the pressure curve is EXACTLY zero inside the floor and monotone and capped outside it, no member of a 200-strong synthetic pool attempts inside the floor while a good share of the same population does afterwards (the anchor), and a single roamer facing a welcoming town does settle themselves within the horizon. NEGATIVE CONTROL EXECUTED: setting the roaming floor to zero reds the pin.',
      }),
      Object.freeze({
        name: 'a_person_travels_at_road_speed_while_their_story_travels_at_news_speed',
        description: 'TRAVEL PHYSICS (design section 6, owner amendment 2026-07-31): a roamer moves at most ONE route-hop per tick, only on routes connected to their current settlement, and may be MID-ROUTE at any pause. The gap between a person and their reputation is the designed consequence: let a roamer teleport to their destination and the reputation race disappears, taking the most interesting property of the whole circulation system with it. The mid-route leg is a drop-when-empty field on the roamer own ledger record rather than a second top-level ledger key, so a walker cannot exist without a soul.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT: the census counts ledger entries and cannot see a transit leg, let alone how many edges an advance crossed. Pinned statically in tests/domain/npcCirculationTransit.test.js TWO independent ways, because each catches a different break: STRUCTURALLY, every planned hop lands on a node whose cheapest route from the walker current settlement is a two-node path (which only an adjacent node can be); and BEHAVIOURALLY, a whole journey walked tick by tick visits the road own node order with nothing skipped. NEGATIVE CONTROL EXECUTED: chaining a second leg onto the arrival tick reds both.',
      }),
      Object.freeze({
        name: 'a_decade_bends_a_person_and_never_replaces_them',
        description: 'RESIDENCY (design section 6c): while resident, experiences reshape a roamer through the EXISTING growth system, bounded within facet bands at capped rates. Nothing residency-specific is minted: the trait vocabulary, the signal routing, the distance-from-core resistance and the saturation are all the growth kernel own, and what residency adds is a smaller loudness, a ramp with the length of the stay, and a hard per-tick total cap, because lodging somewhere bends a person more slowly than holding office there does.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT: the npcGrowth census counts entries, not the door a deposit came through, so a residency deposit and an office-holder deposit are indistinguishable in a receipt by construction. Pinned statically in tests/domain/npcResidency.test.js: every emitted trait is in the growth kernel closed vocabulary, every magnitude is under the residency loudness, every tick total is under the tick cap, and a simulated CENTURY of the harshest lodging (with the kernel own half-life decay and saturation applied) raises exactly the four-word bank and nothing else. NEGATIVE CONTROL EXECUTED: removing the even-scaling that enforces the tick cap reds both the cap pin and the century pin.',
      }),
      Object.freeze({
        name: 'a_town_reduced_to_its_cast_is_mortal_and_its_cast_survives_it',
        description: 'THE POPULATION FLOOR (design section 9): population is at least the resident named-NPC count at all times and anonymous residents drain first, so the empty fast path evaluates its effective-zero floor against population MINUS the resident named cast. Without that subtraction a settlement whose last anonymous residents left would still read as a population of six and live forever on the strength of its own paperwork. Terminal resolution then DISPERSES the cast into the pool in the SAME outcome, which is how the never-kill law survives a town that does not: nobody dies, everybody becomes a story-seed.',
        check: 'PARTIALLY expressible once the lane is wired: a receipt whose settlement count fell in a year that grew the ledger is CONSISTENT with a dispersal, but the census carries no per-settlement population-versus-cast reading, so it can see neither the floor nor which souls came from where. Pinned statically in tests/domain/npcReplacement.test.js (the cast is counted ONCE across the alias homes and the count is identical after a JSON round trip; the effective population is population minus the cast; a violation is repaired UPWARD, never by removing a named character; a loss drains anonymous residents first and reports the shortfall rather than eating the cast) and in tests/domain/npcCirculation.test.js (every named soul enters the pool, the dispersal is idempotent and independent of roster array order, and a rival-compromised member keeps their turncoat option through dm truth that no player projection carries). NEGATIVE CONTROL EXECUTED: dropping the named-cast subtraction reds the effective-population pin.',
      }),
      Object.freeze({
        name: 'a_vacancy_is_emitted_never_refilled',
        description: 'THE CONTESTED OPENING (design section 4): the seat a verdict vacates is NEVER silently refilled. It is emitted as a typed opening carrying the vacancy_from_disgrace cause tag for the existing succession, ladder-contest and faction-competition machinery to fight over. A verdict that quietly installed a successor would delete the story the whole system exists to produce.',
        check: 'PARTIALLY expressible once the lane is wired: a receipt whose npcStates maxEntries is unchanged across a year that graduated souls is consistent with no silent mint, but it cannot prove the OPENING was emitted, and it cannot see the cause tag at all. The exact proof is static, in tests/domain/npcVerdictApply.test.js: the apply result carries the opening with its cause tag, and the settlement roster after the verdict holds the SAME ids it held before (no successor minted anywhere in this slice).',
      }),
      Object.freeze({
        name: 'only_the_dm_ends_a_life',
        description: 'NEVER-KILL / DM-SOVEREIGN (law 1, constitutional, and the reason the whole subsystem exists in the shape it does): the engine kills no named character, ever. W-H4 is the wave that makes that testable rather than merely true, because it introduces the one function in the estate that can drop a soul out of the world ledger (npcLedger.removeNpcRecord) and hands it to exactly one caller: the DM KILL verb, which carries a receipt and a typed inverse. Every engine lane still moves people through the single conservation-safe mover, so the removal door is not a hole in law 6, it IS law 1.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT, and structurally so rather than as an instrument gap: a census counts ledger entries per year, and a soak has no DM in it at all, so no receipt any soak can write could ever observe either the presence or the absence of a death. Pinned statically in tests/domain/npcDmVerbs.test.js as an ANCHORED NEGATIVE over the source: no module in the verdict, circulation, replacement, residency, transit or belief lanes names the removal symbol, while the DM verb module does (the positive anchor that makes the absence non-vacuous), and the kill is proved undoable by restoring the removed record with its exclusion edges intact through the same entry point. NEGATIVE CONTROL EXECUTED: adding the removal import to a circulation lane reds the scan, and dropping the edges from the inverse payload reds the round trip.',
      }),
      Object.freeze({
        name: 'a_sovereign_override_is_named_in_the_receipt_that_carries_it',
        description: 'DM SOVEREIGNTY WITH RECEIPTS (design section 7): the ASSIGN verb may walk a banished person back through the gate that threw them out, and when it does the override is NAMED in the receipt. The two halves are one rule: an override that happened SILENTLY would be indistinguishable from a missing exclusion check, and the person who has to tell those apart is a GM six months later reading their own campaign. So the verb REFUSES an assignment into a settlement whose door is shut unless the caller says so explicitly, and only then records which edict it set aside.',
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT: a census sees ledger entry counts, never an exclusion edge, and never the provenance of a placement. Pinned statically in tests/domain/npcDmVerbs.test.js with the refusal and the override run against the SAME fixture at the SAME tick, so the override is proved specific rather than universal, and the receipt is asserted to name the exact edge kind and door. A REHOST COOLDOWN deliberately does NOT gate the verb, because a cooldown is circulation bookkeeping rather than a legal fact and refusing a DM over one would be the engine overruling them on a technicality it invented for its own pacing. NEGATIVE CONTROL EXECUTED: dropping the override flag from the receipt reds the pin while the placement still succeeds, which is exactly the silent-override shape this invariant exists to forbid.',
      }),
    ]),
    // NOT 'unobserved', and the refusal is deliberate: that flag suppresses the SILENT
    // verdict permanently, and once this lane is lit, a v5 receipt whose total census
    // shows NO npcLedger key is precisely the diagnosis this contract exists to make.
    // 'indirect' is the least wrong of the three labels rather than a claim that the
    // completed soak carries corroboration for this row: it carries none, because the
    // subsystem did not exist when those receipts were written. What the label BUYS is
    // the correct behaviour on both receipt generations: a v4 receipt has no census, so
    // the row grades UNOBSERVED through the no-instrumented-channel branch, while a v5
    // receipt with the flag lit and no ledger grades SILENT and raises the alarm.
    soakEvidence: 'indirect',
  }),
]);

/**
 * People-cohort rule keys that do not yet carry a row. SHRINK-ONLY. Empty: the
 * cohort is fully authored, and npcAgencyEnabled lives in the baseline lane.
 * @type {ReadonlyArray<string>}
 */
export const PEOPLE_PENDING_RULE_KEYS = Object.freeze([]);
