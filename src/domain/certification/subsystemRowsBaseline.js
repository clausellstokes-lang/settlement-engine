/**
 * subsystemRowsBaseline.js — SUBSYSTEM CERTIFICATION ROWS for the baseline rule
 * cohort: every boolean flag that lives in DEFAULT_SIMULATION_RULES plus the
 * opt-in singles that ride a preset override spread (seasons, disasters,
 * commodity flow, ally intel, settlement strategy, the faith-spread pair).
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and the evidence law. Both are binding here.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemCertification.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

// The twelve action families npcAgency composes candidate types from
// (`candidateType: `npc_${actionFamily}`` at npcAgency.js:896, over the
// NPC_ACTION_FAMILIES catalog), plus the two goal-lane literals at 1014 and 1063.
// Enumerated from source, not from a receipt: a family that never fired in any
// soak must still be able to prove the subsystem alive when it does.
const NPC_AGENCY_EVENT_TYPES = Object.freeze([
  'npc_bargain',
  'npc_defect',
  'npc_expose',
  'npc_exploit',
  'npc_goal_culmination',
  'npc_goal_rebranch',
  'npc_hoard',
  'npc_mobilize',
  'npc_protect',
  'npc_reform',
  'npc_sabotage',
  'npc_seek_promotion',
  'npc_suppress',
  'npc_undermine_rival',
]);

// The SPREAD-EXCLUSIVE faith vocabulary: the only candidate types religiousContest
// can emit that are unreachable with the spread flag dark. All three are minted
// inside the single `if (spread)` branch (religiousContest.js:589) or under the
// `if (spread && state.patronRef)` foothold guard (religiousContest.js:834), and
// their literals live at deityStanceLane.js:197 (pact betrayal), :242 (pact) and
// :282 (foothold).
//
// `stressor_birth_religious_conversion_fracture` (religiousContest.js:402) is
// DELIBERATELY ABSENT. The patron seat can change from LOCAL share drift alone, so
// the conversion outcome fires with spread dark in any deity-bearing realm.
// Declaring it would grade the spread lane alive off the standalone-faith lane,
// which is exactly the vacuous proof this contract forbids.
const FAITH_SPREAD_EVENT_TYPES = Object.freeze([
  'faith_foothold_recruited',
  'faith_pact_formed',
  'stressor_birth_religious_pact_betrayal',
]);

// The faith SPREAD lane reads the same way from either of its two keys, so the two
// rows share one prose block rather than drifting apart. Both keys are held in
// lockstep by normalizeSimulationRules (simulationRules.js:602 to :606), and the
// engine consults them through the tolerant isFaithSpreadEnabled reader.
const FAITH_SPREAD_OTHER = 'TWO GATES, AND THE OUTER ONE IS DATA, NOT CONFIG. religiousContest.js:538 short-circuits the whole module on isSubsystemActive(snapshot, "religion"), which is deity PRESENCE (at least one settlement carrying config.primaryDeitySnapshot or a DM-imposed cult), never a rule flag. The spread flag gates only the inner cross-settlement lane: religious_authority mints, carrier reach, regional prevalence, neighbour recognition, occupation faith-pull, the inter-deity stance lane and the targeted footholds. MEASURED 2026-07-31 against the completed corpus: the soak fixture is DEITY-FREE. generateSettlementPipeline with an empty customContent bag (whole-world-soak.mjs:112) returns no primaryDeitySnapshot, no primaryDeityRef, no cultDeitySnapshots and no latentPantheon for any of the four soak archetypes, which matches the standing deity doctrine (no premade pool). So every completed release case ran this subsystem with its outer gate shut: the release receipts carry zero of the three declared types and zero conversion fractures, and that zero is an ABSENT PRECONDITION, not a silent engine. The receipt faith mover family is NOT this lane either: it is the traditions lane (see subsystemRowsRegen.js). THE OBSERVATION NEEDED to certify this row: one soak case whose settlements carry an embedded config.primaryDeitySnapshot, at a horizon long enough for a patron seat to change, plus a v5 subsystems.stateKeys census over worldState.religionStates. Until such a case exists the honest verdict is UNOBSERVED.';

// ── THE ECONOMY / TRADE COHORT (rows authored 2026-07-31) ────────────────────
// WHY THE FOUR ECONOMY ROWS BELOW DECLARE AN EMPTY moverFamilies. moverFamilyOf
// (scripts/audit/behavioral-observation.mjs) takes the FIRST family whose token
// list matches a concatenation of ruleFamily, candidateType, ruleId, impactKind,
// type, kind and id, and the last three are known only at RUNTIME: an applied
// outcome reaches the classifier as `world_outcome.<type>.<sid>.<tick>` carrying a
// `type` the candidate builder sets from whether a proposal or a condition rode
// along, and `condition` is itself a `pressure` token.
// MEASURED 2026-07-31 against artifacts/soak/release.cases/release-30y-12s-seed1:
// classifying that receipt's OWN eventTypeCounts by candidateType alone yields
// economy 2681 / place 234 / war 296, while the receipt RECORDED place 2904 /
// economy 16 / war 18. So a family claim is NOT derivable from the emitting
// module's source, and these rows do not make one. Nothing is lost: the contract
// makes a mover family corroborating-only, so it could never carry ALIVE anyway.
// The ONE economy row that does declare families is constructiveFlowsEnabled in
// subsystemRowsWaves.js, whose records are wizard-news entries whose entire
// classified field set is authored literally in source and was verified end to end.

// The TEN settlement-strategy moves that can reach a receipt. The chooser composes
// `candidateType: `strategy_${move}`` (settlementStrategy.js:498) over twelve moves,
// but `defend` and `hold` ALWAYS carry recordMode 'suppression_only'
// (settlementStrategy.js:512) and isPublicOutcome rejects a suppression-only record
// (pulseHelpers.js:55), so those two are structurally absent from eventTypeCounts;
// declaring them would plant two channels that can never fire. Five moves come from
// the core chooser (enumerateMoves at settlementStrategy.js:571, plus the
// return_home hard override at :961) and seven are the M9a archetype levers
// (LEVER_COPY at :172), which reach the receipt only when they land a real
// relationship nudge and otherwise fall back to the same inert marker.
const SETTLEMENT_STRATEGY_EVENT_TYPES = Object.freeze([
  'strategy_credit',
  'strategy_deploy',
  'strategy_embargo',
  'strategy_legitimacy',
  'strategy_missionize',
  'strategy_opportunity',
  'strategy_prestige',
  'strategy_reroute',
  'strategy_return_home',
  'strategy_sue_for_peace',
]);

/**
 * The baseline lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const BASELINE_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'npcAgencyEnabled',
    title: 'NPC agency',
    module: 'src/domain/worldPulse/npcAgency.js',
    aliveness: Object.freeze({
      eventTypes: NPC_AGENCY_EVENT_TYPES,
      // Corroborating only. `people` is also fed by the NPC ladder and the growth
      // layer, so it can never carry the ALIVE verdict on its own; the fourteen
      // event types above are the dispositive channel.
      moverFamilies: Object.freeze(['people']),
      // DELIBERATELY EMPTY. worldState.npcStates looks like the obvious ledger and
      // is NOT a faithful gate: pulseKernel calls pruneNpcStates and
      // advanceNpcCorruption unconditionally (pulseKernel.js:302 and :327), so the
      // container is written even with npcAgencyEnabled false. Declaring it would
      // grade this row ALIVE in a world where the chooser never ran.
      stateKeys: Object.freeze([]),
      other: 'The gate is a single seam: candidateEvents.js:507 admits evaluateNpcRules only when rules.npcAgencyEnabled is true, so every event type above is unreachable when the flag is dark. A repeated automatic non-targeted action carries recordMode state_only (npcAgency.js:904) and is therefore counted as a mechanical outcome rather than a public event, so a low event count in a quiet realm is expected and is not by itself a silence diagnosis.',
    }),
    // The chooser runs for every tracked NPC every tick, so a realm of any size
    // should carry npc_* events in most observed years.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'agency_is_gated',
        description: 'No npc_* candidate type can appear while npcAgencyEnabled is dark. The flag is the whole subsystem, not a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records npcAgencyEnabled false, the summed eventTypeCounts over the fourteen declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'agency_reaches_the_final_decade',
        description: 'NPC agency is a per-tick subsystem, so it must still be choosing in the last observed decade rather than exhausting itself early.',
        check: 'The share of observed years carrying at least one declared npc_* type is at least the per_tick tempo floor, and at least one such year falls in the final decade of the receipt. Expressible from the v4 per-year eventTypeCounts.',
      }),
    ]),
    // Every completed release case measured npc_* events in volume (the 30-year
    // 12-settlement case measured eleven distinct types).
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'factionCompetitionEnabled',
    title: 'Faction competition',
    module: 'src/domain/worldPulse/factionCompetition.js',
    aliveness: Object.freeze({
      // The module's WHOLE candidate vocabulary, enumerated from the authoritative
      // FACTION_VERB_PHRASES table (factionCompetition.js:557), which the module's
      // own register-guard test forces a new faction_* type to extend. Cross-checked
      // against the emission sites at 620, 673, 732, 778 and 803. Every one carries
      // ruleFamily 'faction' and reaches result.selected, so each lands in the
      // receipt eventTypeCounts under its own name.
      eventTypes: Object.freeze([
        'faction_exhaustion',
        'faction_government_challenge',
        'faction_institution_capture',
        'faction_institution_suppression',
        'faction_law_preference_push',
        'faction_rival_power_contest',
        'faction_service_bolster',
      ]),
      // Corroborating only, and only partly true even as corroboration: the seven
      // types above split across TWO families in the observer, because it classifies
      // on the first matching token and 'institution' is a `place` token that
      // precedes `faith`/`politics` in the family order. Capture and suppression
      // therefore count as `place`, the other five as `politics`. The event channel
      // is the dispositive one; this family is named only so a reader can see where
      // the counts went.
      moverFamilies: Object.freeze(['politics']),
      // DELIBERATELY EMPTY. worldState.factionStates is the obvious ledger and is
      // NOT a faithful gate: pulseKernel calls ensureFactionStates, then
      // pruneFactionStates, then relaxFactionStates unconditionally (pulseKernel.js
      // 292, 297 and 310), so the container is written and evolved even with the
      // chooser dark. Declaring it would grade this row ALIVE in a world where no
      // faction ever acted. Same shape as the npcStates trap on the row above.
      stateKeys: Object.freeze([]),
      other: 'The gate is a single seam: candidateEvents.js:510 admits evaluateFactionRules only when rules.factionCompetitionEnabled is true, so all seven types are unreachable when the flag is dark. NEAR-MISS TOKEN, recorded so a later reader does not adopt it: the release receipts also carry faction_challenge, which is NOT this vocabulary. It is a CONDITION ARCHETYPE, minted by the pressure-condition lane under emergentEventsEnabled (candidateEvents.js:227), by the NPC goal culmination (npcAgency.js:1038) and by an army homecoming (the splinter and disband archetype at deploymentReturn.js:197, routed into candidateType at :202), none of which reads factionCompetitionEnabled. A row that declared it could grade ALIVE with the faction chooser off.',
    }),
    // The chooser runs over every tracked faction every tick, so a realm of any size
    // should carry faction_* events in most observed years.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'faction_vocabulary_is_gated',
        description: 'None of the seven faction_* candidate types can appear while factionCompetitionEnabled is dark. The flag is the whole chooser, not a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records factionCompetitionEnabled false, the summed eventTypeCounts over the seven declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'competition_outlives_the_first_decade',
        description: 'Faction competition is a per-tick subsystem. It must still be choosing late in the run rather than settling into one permanent winner and going quiet.',
        check: 'The share of observed years carrying at least one declared faction_* type meets the per_tick tempo floor, and at least one such year falls in the final decade. MEASURED 2026-07-31 on the completed corpus: 100 of 100 years in the 100-year case, 23 of 30 and 30 of 30 in the two 30-year cases. Expressible from the v4 per-year eventTypeCounts.',
      }),
    ]),
    // Every completed release case measured faction_* events, and the 100-year case
    // measured 3938 of them across all 100 observed years.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'faithSpreadEnabled',
    title: 'Faith spread',
    module: 'src/domain/worldPulse/religiousContest.js,src/domain/worldPulse/deityStanceLane.js',
    aliveness: Object.freeze({
      eventTypes: FAITH_SPREAD_EVENT_TYPES,
      // DELIBERATELY EMPTY. The spread lane has no family it owns. Its pact-betrayal
      // outcome carries ruleFamily 'stressor' and therefore counts as `pressure`,
      // while the receipt `faith` family in every completed case is the traditions
      // lane. Claiming either would grade this row alive off another subsystem.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. worldState.religionStates is written by the LOCAL lane
      // (deity presence alone, no rule flag), so it cannot witness the spread gate;
      // the genuinely spread-only artifact is the religious_authority channel set,
      // and those live on campaign.regionalGraph, which no receipt schema censuses.
      stateKeys: Object.freeze([]),
      other: FAITH_SPREAD_OTHER,
    }),
    // A foothold or a pact is cooldown-gated and realm-capped by design, and a
    // conversion needs a patron seat to actually change hands. Decades can pass
    // without one in a healthy realm.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'spread_vocabulary_is_gated',
        description: 'The three spread-exclusive types are unreachable with the flag dark: each is minted inside the single spread branch, so a dark-spread realm evolves each pantheon in place and never crosses a settlement boundary.',
        check: 'In any receipt whose subsystems.rules records faithSpreadEnabled false, the summed eventTypeCounts over the three declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'spread_needs_a_deity_bearer',
        description: 'Faith cannot spread from nowhere. With no settlement carrying an embedded patron or an imposed cult, the module short-circuits before any fork or mint, so a zero reading proves nothing about the engine.',
        check: 'A receipt may only be read as a spread SILENCE when it also records that at least one settlement carried a deity. NOT expressible from any receipt schema today: neither v4 nor v5 carries a deity-bearer count, which is why this row declares soakEvidence unobserved rather than silent.',
      }),
    ]),
    // The lane never ran in any completed case: the fixture carries no deities.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'religionDynamicsEnabled',
    title: 'Faith spread (legacy alias)',
    module: 'src/domain/worldPulse/simulationRules.js,src/domain/worldPulse/religiousContest.js',
    aliveness: Object.freeze({
      // The SAME vocabulary as faithSpreadEnabled, deliberately: this key gates
      // nothing of its own. It is the pre-split name for the spread lane, kept in
      // lockstep through its deprecation window.
      eventTypes: FAITH_SPREAD_EVENT_TYPES,
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: `A LEGACY MIRROR, NOT A SECOND SUBSYSTEM. normalizeSimulationRules resolves one spread value from the legacy key first, the canonical key second, and the default last, then writes it to BOTH (simulationRules.js:602 to :606), so a normalized receipt can never record the two disagreeing. The tolerant engine reader isFaithSpreadEnabled (simulationRules.js:651) prefers this legacy key when present, which is why the dramatic_campaign and full_simulation presets set both: lighting only the canonical key would let the inherited default-false legacy key drag it back off. The key is scheduled for deletion in the Phase 6 lifecycle pass; when it goes, this row goes with it and faithSpreadEnabled keeps the lane. Its evidence is identical to that row: ${FAITH_SPREAD_OTHER}`,
    }),
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'legacy_alias_stays_in_lockstep',
        description: 'The legacy key and the canonical key name ONE lane. A run in which they disagree means an un-normalized rules blob reached the engine, and the two read surfaces would then disagree about whether faith crosses a boundary.',
        check: 'In any receipt carrying subsystems.rules, religionDynamicsEnabled === faithSpreadEnabled. Expressible from v5 subsystems.rules alone, and the sharpest check on this row: it needs no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'alias_verdicts_agree',
        description: 'Because the two keys name one lane, a certification that graded them differently would be reporting an instrument fault, not two subsystems.',
        check: 'For any receipt, the verdict on religionDynamicsEnabled equals the verdict on faithSpreadEnabled. Expressible from the evaluation output itself, since both rows declare the same channels.',
      }),
    ]),
    // Same measurement as the canonical row: the fixture carries no deities.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'commodityFlowEnabled',
    title: 'Commodity continuity',
    module: 'src/domain/spatial/commodityFlow.js,src/domain/worldPulse/supplyKernel.js,src/domain/spatial/entrepots.js,src/domain/worldPulse/entrepotKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and traced rather than assumed. The layer emits NO
      // candidate at all: advanceSettlementSupply hands the whole tick to
      // advanceCommodityContinuity INSTEAD of the M2 time-buffer path
      // (supplyKernel.js:219), and none of commodityFlow.js, supplyKernel.js,
      // entrepots.js or entrepotKernel.js contains a single `candidateType`
      // literal. Nothing this subsystem does can reach the selected-outcome
      // vocabulary, so its ledgers are the only channel it has.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      // The sub-ledgers this layer OWNS. spatialLedgers.supplyShipments is
      // DELIBERATELY ABSENT: supplyKernel.js:329 writes it on the M2 path too (the
      // spatial marker alone), so declaring it would grade this row ALIVE in a
      // world that never opted in. commodityStocks is the faithful one
      // (supplyKernel.js:571, reachable only through the commodity branch);
      // entrepots rides the SAME gate (entrepots.js:144, entrepotActive is
      // literally commodityFlowActive); merchantAppetite and dispatchWillingness
      // additionally need the M6c dispatch-EV context and a deviation from
      // baseline, so they are the sparse corroborators, not the primary read.
      stateKeys: Object.freeze([
        'spatialLedgers.commodityStocks',
        'spatialLedgers.dispatchWillingness',
        'spatialLedgers.entrepots',
        'spatialLedgers.merchantAppetite',
      ]),
      other: 'TWO GATES, ONE FLAG. commodityFlowActive requires the spatial-canon marker AND the opt-in (commodityFlow.js:169), so a rules blob that lights commodityFlowEnabled in an aspatial world leaves this subsystem completely dark while the receipt still records the switch as on. A SILENT verdict here must therefore be read against whether the run was spatially canonized at all. WHAT WOULD BE NEEDED TO OBSERVE IT: the v5 subsystems.stateKeys census, which is the only instrument that can see a spatialLedgers sub-ledger. The completed 30-year and 100-year release cases are v4 envelopes carrying no census, so this row is not derivable from them at any strength, which is why it honestly grades UNOBSERVED against them rather than SILENT. The soak fixture IS spatially canonized (whole-world-soak.mjs:213 builds a positive marker and a frozen digest) and full_simulation lights the opt-in, so the precondition holds and only the instrument is missing.',
    }),
    // The commodity engine advances production, shipments and stocks EVERY tick the
    // layer is live, so a lit and canonized realm should carry the stock ledger in
    // most observed years. A drained ledger drops to absent by design, so the census
    // years count is the honest cadence read, not the entry count.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'one_representation_never_both',
        description: 'The quantity-denominated commodity model REPLACES the M2 time-buffer model; the two are gated so exactly one runs. A run whose census carries commodityStocks must be a run whose recorded rules lit the opt-in.',
        check: 'In any v5 receipt, subsystems.stateKeys carries spatialLedgers.commodityStocks only when subsystems.rules.commodityFlowEnabled is true. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'entrepots_cannot_outrun_the_shipments',
        description: 'The entrepot ledger tallies gate crossings off the just-advanced shipment ledger, so it can never populate in a run whose commodity layer shipped nothing.',
        check: 'In any v5 receipt whose census carries spatialLedgers.entrepots with maxEntries above zero, the same census carries spatialLedgers.supplyShipments in at least as many years. Expressible from the v5 stateKeys census alone.',
      }),
    ]),
    // The declared channel is instrumented ONLY by the v5 census, and every
    // completed release case is a v4 envelope, so no dispositive reading exists yet.
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'resourceDriftEnabled',
    title: 'Resource drift',
    module: 'src/domain/worldPulse/tierResourceDynamics.js',
    aliveness: Object.freeze({
      // The module's whole resource-drift vocabulary, from the two emission sites
      // inside resourceCandidatesFor (tierResourceDynamics.js:431 and :482). The
      // tier_promotion / tier_demotion literals at :157 belong to tierDriftEnabled
      // and are deliberately NOT claimed here: they are emitted OUTSIDE the
      // resourceDriftEnabled branch, so claiming them would grade this row ALIVE
      // off the tier lane's work.
      eventTypes: Object.freeze(['resource_depletion', 'resource_recovery']),
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The lane writes settlementTickStates, but the tier lane
      // in the same module writes that container unconditionally on every tick, so
      // it is the npcStates trap again. It is also invisible to the census, which
      // walks only top-level worldState keys plus spatialLedgers subkeys
      // (censusWorldStateKeys in behavioral-observation.mjs, cited by NAME because that
      // audit adapter is edited by parallel sessions and its line numbers drift),
      // never a nested per-settlement bag.
      stateKeys: Object.freeze([]),
      other: 'The gate is one line: resourceCandidatesFor is the ONLY producer of either type and candidateEvents never reaches it unless rules.resourceDriftEnabled is true (tierResourceDynamics.js:549). Both types are AUTHORITY-ROUTED through authorityFor (tierResourceDynamics.js:437 and :488), so under a dm_only or recommendations political autonomy they become DM proposals rather than auto-applied outcomes; the release cases run full_simulation at full autonomy, where they apply directly, so a receipt taken under a forcing autonomy mode is a different instrument and must not be compared with these counts. MEASURED over the completed release cases: 15 events in 4 of 100 observed years at 4 settlements, 25 in 6 of 30 and 30 in 5 of 30 at 12 settlements, and 3 to 28 inside the single observed year of each one-year case. The lane is pressure-gated by construction (a depletion needs effective pressure at or above 0.64, a recovery needs it low), so a quiet decade is honest; a century that touches the ground in fewer than one year in twenty is the slowing this tempo floor exists to name, and the 100-year case at 0.04 sits just under it.',
    }),
    // Pressure-gated in both directions, so it moves in bursts rather than steadily.
    // A decade with none is legitimate; a run with none at all is not.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'drift_is_gated',
        description: 'Neither resource_depletion nor resource_recovery can appear while resourceDriftEnabled is dark. The flag is the whole producer, not a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records resourceDriftEnabled false, the summed eventTypeCounts over the two declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'drift_reaches_the_final_third',
        description: 'Resource drift is a standing pressure read, not a start-up transient. A long run must still be depleting or recovering late rather than exhausting its endowment in the first decade and going quiet.',
        check: 'For a receipt of at least twenty observed years, at least one year in the final third carries a declared type. MEASURED 2026-07-31: holds in the 100-year case and in both 30-year cases. Expressible from the v4 per-year eventTypeCounts.',
      }),
    ]),
    // Nonzero in every completed release case, at both horizons and every scale.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'settlementStrategyEnabled',
    title: 'Settlement strategy chooser',
    module: 'src/domain/worldPulse/settlementStrategy.js,src/domain/worldPulse/candidateEvents.js',
    aliveness: Object.freeze({
      eventTypes: SETTLEMENT_STRATEGY_EVENT_TYPES,
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The chooser writes no worldState container of its own:
      // its move lands as a candidate, and the state it moves (relationship
      // scalars, a recall stamp, a deployment) belongs to the relationship and war
      // layers, which run with this flag dark.
      stateKeys: Object.freeze([]),
      other: 'THE CHOOSER RUNS FOR EVERY SETTLEMENT EVERY TICK and emits exactly ONE probability-1 candidate per settlement (enumerate, score, softmax, sample, at settlementStrategy.js:1020 to :1037), so a lit realm of any size should carry a strategy type in nearly every observed year. Two of the twelve moves are STRUCTURALLY invisible: defend and hold always carry recordMode suppression_only, which isPublicOutcome rejects, so they never reach eventTypeCounts. An archetype lever that finds no valid edge falls back to the same inert marker, so a low count on the seven lever types reads as a seat-archetype distribution rather than a silence. The gate is unconditional dispatch with an internal early return (candidateEvents.js:485 calls the evaluator every tick; settlementStrategy.js:910 returns an empty list when the flag is dark). NOTE FOR THE DORMANCY READER: the rules dialog FORCES this flag on whenever the war layer is lit (SimulationRulesDialog.jsx:241), so a DORMANT_BY_CONFIG verdict here should never coexist with warLayerEnabled true in the same receipt. MEASURED over the completed release cases: 2796 and 2818 events across 30 of 30 observed years at 12 settlements, 253 across 76 of 100 years at 4 settlements, and 76 to 283 inside the single observed year of every one-year case.',
    }),
    // One sampled move per settlement per tick, so the realm-level cadence should be
    // near-continuous. Anything below the per_tick floor means settlements stopped
    // being asked, not that they chose quietly.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'strategy_is_gated',
        description: 'No strategy_* type can appear while settlementStrategyEnabled is dark. The evaluator returns an empty list on its first line, so the flag is the whole chooser.',
        check: 'In any receipt whose subsystems.rules records settlementStrategyEnabled false, the summed eventTypeCounts over the ten declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'one_move_per_settlement_per_tick',
        description: 'The chooser samples exactly one move per settlement per tick and tags it strategy:<settlement>, an exclusive group. The strategy volume therefore has a hard structural ceiling, and exceeding it would mean the exclusive tag stopped de-conflicting.',
        check: 'For every observed year, the summed eventTypeCounts over the ten declared types is at most the receipt settlements count times 52. MEASURED 2026-07-31: the busiest year in the corpus sits far under its ceiling. Expressible from the v4 per-year eventTypeCounts plus the receipt settlements field.',
      }),
    ]),
    // Every completed release case measured strategy events in volume, at every
    // horizon and every scale from 4 to 30 settlements.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'tradeFlowsEnabled',
    title: 'Trade scarcity flows',
    module: 'src/domain/worldPulse/flows.js,src/domain/worldPulse/candidateEvents.js',
    aliveness: Object.freeze({
      // The ONE type this flag gates. deriveFlowCandidates emits two literals
      // (flows.js:86 and :140) and candidateEvents.js:516 splits them by
      // metadata.flowKind: the population half answers to migrationFlowsEnabled,
      // the trade half to this key. Claiming flow_migration here would grade this
      // row ALIVE off the migration lane.
      eventTypes: Object.freeze(['flow_trade_scarcity']),
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The flow is a transmission, not a ledger: it plants a
      // regional_import_shortage condition on the destination and writes no
      // worldState container of its own.
      stateKeys: Object.freeze([]),
      other: 'TWO CONDITIONS, ONE FLAG. candidateEvents.js:513 admits the flow family only when propagationMode is neither off nor local, and only THEN keeps a trade-kind candidate when tradeFlowsEnabled is true. So quiet_local and narrative_campaign leave this subsystem dark through propagation alone while recording the switch as on, and a SILENT verdict must be read against the receipt presetId before it is believed. The producer is a single function (tradeScarcityFlows, flows.js:124) and it is CRISIS-CONDITIONAL: a supplier must be in a trade or food crisis or below the trade-connectivity floor AND hold a confirmed trade_dependency channel, so a realm with no such crisis emits nothing and is not thereby dead. MEASURED over the completed release cases: 82 events in 65 of 100 observed years, 70 in 28 of 30, 11 in 4 of 30, and ZERO across the single observed year of both the 4-settlement and the 30-settlement one-year cases. A one-year receipt is structurally too short to tell quiet from dead on this row.',
    }),
    // Purely a response to a supplier crisis. There is no cadence it owes a healthy
    // realm, so the honest floor is a single firing somewhere in the span.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'trade_flow_is_gated',
        description: 'No flow_trade_scarcity can appear while tradeFlowsEnabled is dark, and none can appear at all under a local or off propagation mode. Both gates sit at the same seam.',
        check: 'In any receipt whose subsystems.rules records tradeFlowsEnabled false, the summed flow_trade_scarcity count is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'scarcity_flows_ride_a_real_crisis',
        description: 'The flow models SPILLOVER, never origin: a supplier must already be in trouble for its dependents to feel a shortage. A scarcity flow in a year with no trade or food distress anywhere would mean the producer stopped reading the crisis it claims to transmit.',
        check: 'Every observed year carrying flow_trade_scarcity also carries at least one of trade_pressure, food_pressure, trade_route_disruption or stressor_birth_famine in the same year eventTypeCounts. MEASURED 2026-07-31 across the whole completed corpus: 99 of 99 qualifying years hold. Expressible from the v4 per-year eventTypeCounts alone.',
      }),
    ]),
    // Nonzero in five of the seven completed release cases, including both long
    // horizons; the two zero readings are one-year receipts.
    soakEvidence: 'measured',
  }),
]);

/**
 * Baseline-cohort rule keys that do not yet carry a row. SHRINK-ONLY.
 * @type {ReadonlyArray<string>}
 */
export const BASELINE_PENDING_RULE_KEYS = Object.freeze([
  // allyIntelSharingEnabled left this list on 2026-07-31. It is AUTHORED, in
  // subsystemRowsWar.js: the sharing channel exists to tip wars (a presumed ally
  // that has turned leaks the sharer's footing to its real enemy), so it certifies
  // beside the war stack. The partition stays exact, so this is a move, never a gap.
  // commodityFlowEnabled, resourceDriftEnabled, settlementStrategyEnabled and
  // tradeFlowsEnabled left this list on 2026-07-31. All four are AUTHORED above, in
  // this same lane (the economy and trade cohort). The partition stays exact, so
  // this is a promotion, never a gap.
  // disastersEnabled, seasonsEnabled and tierDriftEnabled left this list on
  // 2026-07-31. All three are AUTHORED, in subsystemRowsPlace.js: the by-subject
  // lane for the ground a realm sits on, which also carries the three ONE_REGEN
  // spatial keys. They are read together because they share ONE finding (the
  // `place` mover family is a seven-lane bucket that none of them may claim). The
  // partition stays exact, so this is a move, never a gap.
  // emergentEventsEnabled and institutionLifecycleEnabled left this list on
  // 2026-07-31. Both are AUTHORED, in subsystemRowsGrowth.js: the by-subject lane for
  // the estate's UPWARD write traffic, which also carries upswingArcsEnabled out of the
  // wave cohort. They are read together because a realm can pass every whole-world
  // check while never founding, rebuilding or growing anything. The partition stays
  // exact, so this is a move, never a gap.
  'majorChangesRequireProposal',
  // migrationFlowsEnabled, populationDynamicsEnabled, relationshipDynamicsEnabled and
  // stressorsEnabled left this list on 2026-07-31. They are AUTHORED, in
  // subsystemRowsPeople.js: the by-subject lane that also carries the two ONE_REGEN
  // NPC keys, so the largest vocabularies in the estate sit in one file instead of
  // crowding two cohort lanes toward the 800-line ceiling. The partition stays exact,
  // so this is a move, never a gap.
]);
