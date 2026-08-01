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
 * pulseKernel.js:392 gates on this same flag.
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
      // is NOT a faithful gate: pulseKernel.js:377 falls back to worldState.stressors
      // verbatim when the flag is dark, so a legacy or DM-authored stressor keeps the
      // container populated in a world where the rules never ran. Declaring it would
      // grade this row ALIVE off state nobody wrote this run.
      stateKeys: Object.freeze([]),
      other: 'The gate is a single seam: candidateEvents.js:442 admits evaluateStressorRules only when rules.stressorsEnabled is true, and pulseKernel.js:377 and :392 gate the aging pass and the coup verdicts on the same flag, so every literal above is unreachable when it is dark. TWO EXPECTED ZEROES, neither a silence. stressor_spread_disease_outbreak is suppressed at candidateEvents.js:477 whenever the spatial-canon marker is set, because the epidemic front materializes that same stressor hop by hop post-apply; and stressor_birth_slave_revolt cannot fire at all, because the catalog marks the type deprecated and stressors.js:386 filters deprecated types out of the birth gate. MEASURED 2026-07-31: 30 of 30 years in both 30-year 12-settlement cases (431 and 584 events), but only 2 of 100 years in the 100-year 4-settlement case (15 events). A century that quiet is what the tempo floor exists to surface.',
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
      // is NOT a faithful gate: pulseKernel calls ensureAllRelationshipStates
      // (pulseKernel.js:290) and relaxRelationshipStates (:309) unconditionally, so
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
      // pulseKernel.js:2045 dispatches into it whenever migrationActive (the
      // spatial-canon marker) holds, over every realized emigration outcome including
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
    title: 'The personal consequence economy (durable identity + the world NPC ledger)',
    module: 'src/domain/worldPulse/npcLedger.js,src/domain/worldPulse/npcLedgerFacets.js,src/domain/worldPulse/npcLedgerProjection.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY AT H1, and this is a statement about today rather than a
      // permanent one. The design's testing section anticipates verdict / rejection /
      // arrival event types, but H1 ships IDENTITY AND STATE only: it emits no
      // candidate, so nothing it produces can reach result.selected, and
      // eventTypeCounts observes result.selected only. Declaring those three types
      // NOW would manufacture a channel that reads zero forever and mint a false
      // SILENT on every receipt written before H2 lands (the npcGrowth row's
      // reasoning, applied to a subsystem that is early rather than post-apply).
      // H2 AND H3 MUST EXTEND THIS LIST when their candidate types exist.
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
      other: 'DARK BY DECLARATION AT H1. npcConsequencesEnabled is a virtual flag declared FALSE in the full_simulation spread and lit in no preset, so every receipt grades this row DORMANT_BY_CONFIG until the W-H program lights it at its golden boundary. That is the honest verdict for a slice that is built and gated, and it is exactly why the key is declared at all: a rule key reachable from neither the defaults nor any preset spread is invisible to the totality walker, and a subsystem behind an invisible key can ship completely dead with no check ever asking. npcCredibilityEnabled is that shape in-tree today and carries no row as a consequence. THE INSTRUMENT GAP TO CLOSE LATER: the census records the ledger key\'s ENTRY COUNT per year, not its contents, so it can prove that souls are in the ledger and cannot yet prove which ledger they are in. The disjointness and never-reminted invariants below are written against that limit rather than around it.',
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
        check: 'NOT EXPRESSIBLE FROM ANY RECEIPT, and named here rather than omitted so the reader knows where the proof lives instead of assuming a soak covers it. A soak receipt records engine state, never a rendered projection. The property is pinned statically in tests/domain/npcLedgerProjection.test.js with an anchored negative (the DM view of the SAME fixture must report the covert path through the same helper), and independently by publicSafe.js\'s recursive denylist, whose PRIVATE_KEY_RE matches the dmTruth spelling.',
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
