/**
 * subsystemRowsWaves.js — SUBSYSTEM CERTIFICATION ROWS for the nine engine-wave
 * gates (the W-R2-LIGHT `WAVES` cohort in worldPulse/simulationRules.js).
 *
 * One lane file per rule-key cohort. The split is NOT cosmetic: 46 rows plus the
 * evaluator cannot fit under the 800-effective-line domain ceiling, and this tree
 * is written by parallel sessions, so a per-lane file lets each author land rows
 * without touching another lane's bytes. subsystemCertification.js composes the
 * lanes into the single SUBSYSTEM_CERTIFICATION_REGISTRY the rest of the estate
 * imports.
 *
 * TO ADD A ROW: move its key out of WAVE_PENDING_RULE_KEYS and into
 * WAVE_SUBSYSTEM_ROWS in the same edit. The totality walker
 * (tests/lint/subsystemCertificationTotality.walker.test.js) fails if a key is in
 * both lists, in neither, or names a rule the engine does not define, so a new
 * subsystem cannot enter the engine without a certification row or an explicit,
 * shrink-only pending entry.
 *
 * EVIDENCE LAW: every string in an `aliveness` block must be traceable to source.
 * Event types are the exact `candidateType` literals the module emits; state keys
 * are the exact worldState containers it writes. A channel that cannot be traced
 * is not declared, and the row says so through soakEvidence.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemCertification.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The wave lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const WAVE_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'settlementLifecycleEnabled',
    title: 'Settlement lifecycle',
    module: 'src/domain/worldPulse/settlementLifecycleFirstClass.js,src/domain/worldPulse/settlementLifecycleKernel.js,src/domain/worldPulse/steadingTopography.js',
    aliveness: Object.freeze({
      // The FIRST-CLASS lane rides the ordinary candidate seam (pulseKernel calls
      // evaluateSettlementLifecycle before rollCandidates), so both literals reach
      // result.selected and therefore the receipt's eventTypeCounts. Traced to
      // settlementLifecycleFirstClass.js candidateType at lines 151 and 238.
      eventTypes: Object.freeze(['settlement_terminal_death', 'settlement_resettled']),
      // DELIBERATELY EMPTY. The lane's selected candidates classify into the broad
      // `place` family, which resource drift, tier drift, institution lifecycle, the
      // calamity kernel and the season clock all feed. Claiming `place` here would
      // make the row grade ALIVE off other subsystems' work, which is the vacuous
      // proof this contract exists to forbid.
      moverFamilies: Object.freeze([]),
      // The satellite lane's authoritative sidecar (settlementLifecycleKernel.js
      // reads and writes it through getSpatialLedger(worldState, 'satellites')).
      // Receipt-expressible only from the v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.satellites']),
      other: 'ONE KEY, TWO LANES, TWO HORIZONS. Measured 2026-07-31: a one-year four-settlement probe already carries three entries in spatialLedgers.satellites while emitting zero settlement_terminal_death and zero settlement_resettled, and the 30-year 12-settlement release cases emit zero of either; the first-class lane first fires at the 100-year horizon (20 deaths and 20 resettlements in release-100y-4s-seed1). A receipt that instruments both channels therefore grades this row ALIVE with partiallySilent naming the first-class lane, and that naming IS the finding. The satellite lane also emits post-apply steading news (impactKind steading_founded, steading_abandoned, steading_charter_pending, steading_orbit_dispersed, steadings_converged). Those entries are NOT receipt-expressible: eventTypeCounts observes the selected lane only, and the observation classifier files every one of those ids under the knowledge mover family because their wizard_news id carries the token "news", so a mover-family claim over them would be false. The DM verbs FORCE_FOUND_STEADING, FORCE_ABANDON and FORCE_RESETTLE are operator-driven and a soak issues none, so they are never aliveness evidence.',
    }),
    // Foundings and terminal deaths are dwell-gated by design (an extended decline
    // before death, a cooldown and tier cap before a steading). A decade may pass
    // with none and the subsystem still be healthy; a century with none is not.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'satellite_settlers_conserved',
        description: 'A steading is founded only by debiting settlers out of its parent, and abandonment or convergence returns or merges them. The lane transfers people; it never mints or destroys them.',
        check: 'In every year where the satellites census grows, the founding parent stateVectors population falls in the same year by the founders debit, and in every year it shrinks through abandonment the parent population rises by the returned remnant. Expressible at YEAR granularity from v5 subsystems.stateKeys plus the v4 per-year stateVectors; NOT yet expressible at head-count granularity, because the census records entry counts rather than satellite populations.',
      }),
      Object.freeze({
        name: 'terminal_death_is_dwelt',
        description: 'A settlement never dies suddenly. settlement_terminal_death fires only after an extended dwell at the bottom tier, so a death always has an observable decline behind it.',
        check: 'For every receipt year carrying settlement_terminal_death, an earlier year in the same case shows the affected settlement falling through prosperity and population toward the tier floor. Expressible from the v4 per-year stateVectors series plus eventTypeCounts.',
      }),
      // W-E (J-D4). The satellite lane gained an observable channel: on a SPATIAL
      // world a founding samples the frozen rasters read-only and stamps the ground
      // it chose plus the resources that ground implies onto the ledger record.
      Object.freeze({
        name: 'steading_ground_is_sampled_not_invented',
        description: 'On a spatially canonized world every satellite steading sits on a real cell of the frozen rasters, inside its own parent country, on land, and its starting resources are all legal at that ground under the same terrain vocabulary generation itself rolls from. The lane reads the digest and never writes it.',
        check: 'For every satellites ledger record carrying a site, digest.territory[site.cell] resolves to the record parentId and digest.costField[site.cell] is above the impassable sentinel, and every key in record.resources is a RESOURCE_DATA key compatible with the ground the landform maps to. Expressible from a v5 subsystems.stateKeys census that carries the satellite record bodies alongside the frozen digest; NOT yet expressible from the current census, which records entry counts only.',
      }),
      Object.freeze({
        name: 'strike_camp_sits_at_its_seam',
        description: 'A steading founded on a resource strike is placed on ground where that vein could actually be worked, not at an arbitrary point of the orbit. The mining camp goes to the rock.',
        check: 'For every satellite_founded receipt whose provenance is resource_strike and which carries a site, the site landform is one the struck resourceKey leans to or is at minimum legal on. Expressible once satellite receipts are carried in the census; today it is pinned in tests/domain/steadingTopography.test.js against a built digest.',
      }),
    ]),
    // The 100-year release case measured 20 terminal deaths and 20 resettlements;
    // the 30-year cases measured zero of either. The lane is real and slow.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'interventionEnabled',
    title: 'Foreign intervention',
    module: 'src/domain/worldPulse/convergence.js',
    aliveness: Object.freeze({
      // The ONE organic candidate type this mover can mint (convergence.js:1104),
      // and it is reachable only on the DM-driven arm. Under routine/full autonomy
      // authorityFor returns 'auto' (convergence.js:998), the mover writes the
      // ledger directly, and NO candidate is minted at all. The soak drives
      // full_simulation, whose OPEN spread sets politicalAutonomy 'full', so this
      // channel is STRUCTURALLY unreachable in every completed release case. It is
      // declared anyway because a dm_only or recommendations receipt would carry it,
      // and the row must be able to prove the subsystem alive when it does.
      eventTypes: Object.freeze(['intervention_ordered']),
      // Corroborating only. The two post-apply beats (impactKind 'intervention' at
      // convergence.js:1326 and 'intervention_clash' at :1358) classify into the
      // broad `war` family, which the whole war layer, the strategy chooser and the
      // occupation lane also feed, so it can never carry ALIVE on its own.
      moverFamilies: Object.freeze(['war']),
      // The isolated ledger this wave writes (convergence.js:1223, dropped when
      // empty at :1224). Deliberately NOT the shared deployments ledger: the design
      // guarantees byte-identity-when-dark by keeping intervention records out of
      // the one-army slot, which also makes this key an exact witness. Receipt
      // expressible only from a v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.interventions']),
      other: 'A DOUBLE GATE OVER A RARE PRECONDITION. interventionActive requires warLayerEnabled AND the virtual interventionEnabled (convergence.js:227), so a receipt with the war layer dark must read this row DORMANT_BY_CONFIG rather than silent even when its own key is true. Beyond the gates the mover needs a LIVE COUP CONTEST to join: wave 1 is coup-scoped, and liveCoupContests is the only source of targets. MEASURED 2026-07-31 on the completed corpus: ZERO coup births in every release case (no coup token appears in any eventTypeCounts across all seven cases; the five succession attempts recorded in the 30-year seed2 case are faction_government_challenge, the other admitted attempt type). So the intervention lane was never offered a contest to enter, its precondition simply did not occur, and a zero reading here is not an engine silence. THE OBSERVATION NEEDED: a v5 subsystems.stateKeys census (which makes the interventions ledger readable) over a case that actually births coups, or a DM-autonomy case in which the withheld intervention mints its intervention_ordered proposal.',
    }),
    // A foreign power commits a column only when a coup is live, a typed motive
    // scores, feasibility clears and the loaded dice pull positive. Rare by design.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'intervention_is_war_gated',
        description: 'The wave is AND-gated under the war layer. With warLayerEnabled dark the mover is an immediate no-op: zero forks, zero ledger keys, whatever this waves key says.',
        check: 'In any receipt whose subsystems.rules records warLayerEnabled false, both the interventions ledger is absent from subsystems.stateKeys and eventTypeCounts.intervention_ordered is zero. Expressible from v5 subsystems.rules plus the v5 stateKeys census; the event half alone is expressible from v4.',
      }),
      Object.freeze({
        name: 'intervention_presupposes_a_contest',
        description: 'An intervention joins an internal contest; it never starts one. A run with no coup births can carry no interventions, and reading that as a dead subsystem would be a false alarm.',
        check: 'A receipt may only be read as an intervention SILENCE when its eventTypeCounts carry at least one coup birth (stressor_birth_coup_detat) or its succession block records a completed seat change. Expressible from the v4 eventTypeCounts plus the v4 succession block.',
      }),
    ]),
    // Gates lit, precondition absent, dispositive ledger not censused by v4.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'constructiveFlowsEnabled',
    title: 'Constructive flows (generosity)',
    module: 'src/domain/worldPulse/generosityKernel.js,src/domain/spatial/generosityEV.js,src/domain/worldPulse/generosityNews.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The generosity mover is a POST-APPLY lane, not a
      // candidate producer: it runs after the pulse applies, writes food deltas onto
      // settlementUpdates and emits wizard news. eventTypeCounts observes
      // result.selected only (the selected-records loop in observeBehavioralYear,
      // cited by NAME because that audit adapter's line numbers drift), so nothing this
      // subsystem does can reach it, however loudly the lane gives.
      eventTypes: Object.freeze([]),
      // The ONE economy-cohort row that declares families, because it is the only
      // one whose classified field set is authored LITERALLY in source: each entry
      // carries a fixed id and impactKind (generosityNews.js:28, :56, :85, :115,
      // :145, :176), appendObservedWizardNewsEntries copies the entry verbatim into
      // the observation sink (wizardNews.js:744), and normalizeEntry preserves id,
      // kind and impactKind unchanged (wizardNews.js:484, :492, :493). CLASSIFIED
      // 2026-07-31 through moverFamilyOf, raw AND normalized alike: relief, refusal,
      // refuge and purchase land in `constructive`; credit_default and
      // trade_overture land in `economy`, because the classifier matches the economy
      // tokens `credit` and `trade` before it ever reaches the constructive list.
      // BOTH are corroborating only: the upswing lane also feeds `constructive`
      // through its reconstruction, boom and flourishing receipts, so a moving
      // family proves the world was generous somewhere, not that this lane gave.
      moverFamilies: Object.freeze(['constructive', 'economy']),
      // The five sub-ledgers the generosity kernel EXCLUSIVELY owns, all written
      // downstream of the one dormancy gate (generosityKernel.js:448).
      // spatialLedgers.obligations is DELIBERATELY NOT DECLARED even though it is
      // the aid ledger the design names: obligationDecay.js:19, upswingKernel.js:802,
      // convergence.js:1236 and assizeKernel.js:403 all write it too, so declaring it
      // would grade this row ALIVE off four other subsystems.
      stateKeys: Object.freeze([
        'spatialLedgers.bufferDiscipline',
        'spatialLedgers.generosityWillingness',
        'spatialLedgers.lendAppetite',
        'spatialLedgers.refugePostures',
        'spatialLedgers.tradeOverture',
      ]),
      other: 'ONE GATE, READ DEFENSIVELY. constructiveFlowsActive is the flag alone (generosityEV.js:928); there is no spatial or belief precondition, so a lit preset genuinely asks the question. The pair enumeration is SPARSE BY CONSTRUCTION: only a receiver in real food need is ever asked, and only across an allied, trade-partner, vassal or patron edge or a live obligation, so a well-fed realm gives nothing and is not thereby dead. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose subsystems.stateKeys census carries one of the five declared ledgers. The completed release cases are v4 envelopes with no census, so the mover families are all this row can see there, and by contract a family can never carry ALIVE. For the reader who checks: the completed corpus DOES record a large post-apply constructive family (4361 in the 100-year case, 1216 and 3285 in the two 30-year cases) against zero SELECTED constructive, which is exactly the signature of a post-apply lane, but it is shared with the upswing lane and is not attributed here.',
    }),
    // Purely a response to a hungry neighbour. There is no cadence a comfortable
    // realm owes, so the honest floor is a single firing somewhere in the span.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'constructive_flows_are_gated',
        description: 'The dormancy gate is one line: advanceGenerosity returns before any fork or key when the flag is dark, so none of the five declared ledgers can materialize behind a dark switch.',
        check: 'In any v5 receipt whose subsystems.rules records constructiveFlowsEnabled false, subsystems.stateKeys carries none of the five declared ledgers. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'the_latches_outlive_one_decision',
        description: 'The willingness latch and the buffer-discipline accumulator persist across ticks by design, and prune only below epsilon. A ledger that appears in exactly one observed year of a long run drained as fast as it filled, which means the latch is not latching.',
        check: 'For any declared ledger whose census maxEntries is above zero in a receipt of at least two observed years, its census years count is at least two. Expressible from the v5 stateKeys census alone.',
      }),
    ]),
    // The dispositive channel is instrumented ONLY by the v5 census; every completed
    // release case is a v4 envelope, so only corroborating family motion is visible.
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'momentumEnabled',
    title: 'Commitment momentum',
    module: 'src/domain/worldPulse/momentum.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and the REASON CHANGED on 2026-07-31. It used to be a
      // FINDING: the layer authored a public receipt (climbDownNews) that carried NO
      // id, and both the observation sink (wizardNews.js pushes only entries with an
      // id) and normalizeEntry (returns null without one) dropped it, so the whole
      // narrative output was discarded before reaching any reader or any receipt.
      // THAT DEFECT IS REPAIRED: the receipt now mints
      // `wizard_news.<tick>.momentum_climb_down.<actor>.<target>` and was VERIFIED
      // reaching both the canonical feed and the audit sink, against an id-stripped
      // control that still lands zero. The list stays empty for an ORDINARY reason
      // instead: `eventTypes` names PULSE EVENT types counted in a receipt's
      // eventTypeCounts, and a wizard-news receipt is not a pulse event. This layer
      // still emits no event type of its own.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and this reason changed too. The receipt now DOES classify,
      // but into `knowledge`, and only because every wizard-news id contains the token
      // `news` (moverFamilyOf concatenates the id into its match text). So EVERY
      // id-carrying news author in the tree lands in that family. A family shared by the
      // whole estate is not dispositive for this row, exactly as the generosity row is
      // held to its shared families, so claiming it would buy an ALIVE verdict this
      // subsystem had not earned.
      moverFamilies: Object.freeze([]),
      // The commitment ledger is the ONLY surviving channel (momentum.js:490).
      // realmVerbExecution.js:401 and :419 also write it, through the operator
      // FORCE verbs, and a soak issues none, so that writer never contaminates it.
      stateKeys: Object.freeze(['spatialLedgers.commitments']),
      other: 'TWO GATES, ONE FLAG. momentumActive requires beliefsActive AND the virtual momentumEnabled (momentum.js:121), so a realm left at the omniscient infoMode leaves this subsystem dark while the receipt records the switch as on. full_simulation carries infoMode full and living_realm carries perfect_delayed, so both preconditions hold there; a DORMANT_BY_CONFIG verdict cannot be read off this key alone in any other preset. DEPOSITS ARE READS, NOT ROLLS: a live siege, a mobilization rung, a covert supply-web campaign or a blockade deposits deterministically, so an actor at total peace holds no course and the ledger is correctly absent. WHAT WOULD BE NEEDED TO OBSERVE IT: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.commitments. This sentence used to carry a second half, an id on the climb-down receipt so the layer stops being narratively invisible, and that half was FIXED on 2026-07-31: the receipt now mints an id, so it reaches the reader-facing feed, the Herald and the audit sink instead of being dropped. The census reading is the one remaining gap, and it is recorded here rather than fixed by this row.',
    }),
    // The stock is a read of live public acts. A realm at peace legitimately holds
    // none, so the honest floor is a single materialization somewhere in the span.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'commitments_presuppose_a_committed_course',
        description: 'A commitment stock is a read of legible public acts over a bounded course taxonomy, never a free-standing hum. An actor with no siege, mobilization, campaign or blockade deposits nothing, so the ledger cannot populate in a realm that never went to war.',
        check: 'In any v5 receipt whose census carries spatialLedgers.commitments, the per-year eventTypeCounts carry at least one of war_mobilization, army_deployed or conquest in an earlier or equal year. Expressible from the v5 stateKeys census plus the v4 per-year eventTypeCounts.',
      }),
      Object.freeze({
        name: 'the_ledger_decays_rather_than_ratchets',
        description: 'The fold decays every stock to now on a half-life, prunes below epsilon and drops when empty. A long run whose ledger only ever grew would mean the decay stopped running and every past commitment became permanent.',
        check: 'For a receipt of at least thirty observed years whose census carries spatialLedgers.commitments, either maxEntries is strictly greater than finalEntries, or the key years count is below the receipt observedYears. Either reading shows the ledger draining. Expressible from the v5 stateKeys census plus the receipt observedYears.',
      }),
    ]),
    // The one surviving channel is instrumented ONLY by the v5 census, and every
    // completed release case is a v4 envelope, so no dispositive reading exists yet.
    soakEvidence: 'indirect',
  }),
  Object.freeze({
    rule: 'resourceDynamicsEnabled',
    title: 'Resource discovery and removal',
    module: 'src/domain/worldPulse/resourceDynamicsKernel.js',
    aliveness: Object.freeze({
      // The module's whole vocabulary, from its two emission sites
      // (resourceDynamicsKernel.js:368 and :424). Neither literal is emitted
      // anywhere else in the tree, so both are dispositive for this key. The
      // depletion and recovery pair in tierResourceDynamics.js belongs to
      // resourceDriftEnabled and is deliberately NOT claimed here.
      eventTypes: Object.freeze(['resource_discovery', 'resource_removal']),
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The lane's accumulator, dwell and cooldown state nests
      // at settlementTickStates[id].resourceDynamics, and settlementTickStates is
      // written unconditionally by the tier lane every tick, so it is the npcStates
      // trap. It is invisible to the census in any case: censusWorldStateKeys walks
      // top-level worldState keys plus spatialLedgers subkeys only, never a nested
      // per-settlement bag (censusWorldStateKeys in behavioral-observation.mjs,
      // cited by NAME because that adapter's line numbers drift).
      stateKeys: Object.freeze([]),
      other: 'NOT SPATIALLY GATED, unlike its cohort siblings: terrain comes from config.terrainType, which generation always writes, so this lane runs aspatially too and the virtual flag alone is the gate (a dark flag is an early return with zero candidates, zero new settlementTickStates keys and zero forks). A discovery is drawn from the terrain latent pool minus the current roster minus keys already worked out, so a geography-inconsistent draw is structurally impossible rather than merely rare; a removal needs a NONRENEWABLE that has dwelled depleted past REMOVAL_DWELL, so renewables never organically leave. MEASURED over the completed release cases: 158 events across 85 of 100 observed years at 4 settlements, 39 across 23 of 30 and 79 across 27 of 30 at 12 settlements, and zero in the 4-settlement and 12-settlement one-year cases. The design calls the lane RARE PER SETTLEMENT (a few per campaign-decade, accumulator and cooldown gated); at realm scale that reads as a yearly cadence, which is what this row declares and what the floor is set well under.',
    }),
    // Rare per settlement, but a realm of any size aggregates it into most years.
    // The floor is set at a third of the measured share so a genuine stall shows.
    expectedTempo: 'yearly',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dynamics_are_gated',
        description: 'Neither resource_discovery nor resource_removal can appear while resourceDynamicsEnabled is dark. The flag is the whole mover, and it is virtual, so an absent key reads false and the lane is a complete no-op.',
        check: 'In any receipt whose subsystems.rules records resourceDynamicsEnabled false or omits it, the summed eventTypeCounts over the two declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'removal_follows_a_depletion',
        description: 'Only a nonrenewable that has dwelled DEPLETED for an extended span is removed, so every removal has a depletion behind it. A removal with no prior depletion anywhere would mean the dwell gate stopped being consulted.',
        check: 'For every observed year carrying resource_removal, an earlier or equal year in the same receipt carries resource_depletion. MEASURED 2026-07-31 across the whole completed corpus: 111 of 111 qualifying years hold. Expressible from the v4 per-year eventTypeCounts alone, and note that it spans two rule keys, since the depletion half belongs to resourceDriftEnabled.',
      }),
    ]),
    // Nonzero in every completed multi-year release case, at both horizons.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'supplyWebWarfareEnabled',
    title: 'Supply-web warfare',
    module: 'src/domain/worldPulse/supplyWebWarfare.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and for the SAME repaired defect as the momentum row above.
      // The four campaign builders (mintNews, raidNews, abandonNews, completeNews)
      // authored a kind, a headline and reasons but NO id, and the kernel appended them
      // straight through, so appendObservedWizardNewsEntries skipped the sink and
      // normalizeEntry refused the entry: this doctrine's whole narrative output was
      // dropped before it reached the feed or the receipt. REPAIRED 2026-07-31, and
      // VERIFIED end to end by driving the real mover: all five kinds (the raid splits
      // into webwar_raid and webwar_wrong_village) now mint
      // `wizard_news.<tick>.<kind>.<aggressor>[.<satellite>].<target>` and survive both
      // sinks. The list stays empty because `eventTypes` names PULSE EVENT types in a
      // receipt's eventTypeCounts, and a wizard-news receipt is not a pulse event.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. Four of the five kinds now classify as `knowledge` and
      // webwar_raid as `war`, but the `knowledge` reading comes from the token `news`
      // inside every wizard-news id, which the whole estate shares, and the `war`
      // reading is a token this doctrine shares with the entire war layer. Neither is
      // dispositive for this row.
      moverFamilies: Object.freeze([]),
      // The campaign-plan ledger is the ONLY surviving channel
      // (supplyWebWarfare.js:794). realmVerbExecution.js:447 also writes it via the
      // operator verbs supply_raid_ordered and trade_embargo_declared
      // (realmManifest.js:245 and :261), and a soak issues none, so that writer
      // never contaminates the evidence.
      stateKeys: Object.freeze(['spatialLedgers.campaignPlans']),
      other: 'TWO GATES, ONE FLAG. supplyWebWarfareActive requires warLayerEnabled AND the virtual supplyWebWarfareEnabled (supplyWebWarfare.js:258), so living_realm lights this switch while leaving the doctrine dark (its war layer stays inherited-false), and a DORMANT_BY_CONFIG verdict cannot be read off this key alone. THE DOCTRINE IS DELIBERATELY UNCOMMON EVEN WHEN LIT: the plan is minted only when an aggressor indirect EV beats its direct EV after the atrocity brake and the time discount, it is re-scored every tick as a hypothesis, and it is ABANDONED on EV collapse, so a whole war can be fought without one. WHAT WOULD BE NEEDED TO OBSERVE IT: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.campaignPlans. This sentence used to carry a second half, an id on the four campaign receipts so the doctrine stops being narratively invisible, and that half was FIXED on 2026-07-31: all of them mint ids now, so a campaign that fires is narrated to the reader, the Herald and the audit sink instead of being dropped. The census reading is the one remaining gap, and it is recorded here rather than fixed by this row.',
    }),
    // A plan is minted only when the indirect EV wins outright inside a live war.
    // Decades can pass without one and the doctrine still be healthy.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'campaigns_presuppose_a_war',
        description: 'An indirect campaign is a WAR strategy that strikes the suppliers instead of the walls. It cannot exist in a run whose war layer never opened a front, so a zero reading in a peaceful realm is an absent precondition rather than a dead doctrine.',
        check: 'In any v5 receipt whose census carries spatialLedgers.campaignPlans, the per-year eventTypeCounts carry war_mobilization or army_deployed in an earlier or equal year. Expressible from the v5 stateKeys census plus the v4 per-year eventTypeCounts.',
      }),
      Object.freeze({
        name: 'plans_are_abandoned_rather_than_ground',
        description: 'A plan is a hypothesis re-scored every tick and dropped on EV collapse, never a rail. A ledger that only ever accumulated would mean the abandonment path stopped running and every aggressor kept one campaign forever.',
        check: 'For a receipt of at least thirty observed years whose census carries spatialLedgers.campaignPlans, either maxEntries is strictly greater than finalEntries, or the key years count is below the receipt observedYears. Expressible from the v5 stateKeys census plus the receipt observedYears.',
      }),
    ]),
    // The one surviving channel is instrumented ONLY by the v5 census, and every
    // completed release case is a v4 envelope, so no dispositive reading exists yet.
    soakEvidence: 'indirect',
  }),
  // ── THE ORGANIC ROUTE LIFECYCLE (W-J, docs/DESIGN_ROUTE_LIFECYCLE.md §13) ──
  // REGISTERED FROM THE FIRST COMMIT, and that was only possible once the key was
  // DECLARED. `simulationRuleKeys()` censuses DEFAULT_SIMULATION_RULES plus the
  // preset override spreads. `routeLifecycleEnabled` is VIRTUAL (no DEFAULT entry,
  // by design — Law 7's byte-identity guarantee), so until it was declared at FALSE
  // in the full_simulation spread the census could not see it and this row read
  // back as `unknownRows` — MEASURED against the live registry, in both directions,
  // before the declaration was written. The declaration is what puts W-J under the
  // certification contract now instead of retroactively; the row's verdict on a
  // dark receipt is DORMANT_BY_CONFIG, which is the honest one.
  Object.freeze({
    rule: 'routeLifecycleEnabled',
    title: 'Organic route lifecycle',
    module: 'src/domain/worldPulse/routeNetworkLedger.js,src/domain/worldPulse/routeNetworkGenesis.js,src/domain/worldPulse/routeNetworkFlows.js,src/domain/worldPulse/routeNetworkFlowsMaterial.js,src/domain/worldPulse/routeNetworkFlowsObjective.js,src/domain/worldPulse/routeNetworkFlowsSelfSufficiency.js,src/domain/worldPulse/routeNetworkCharter.js,src/domain/worldPulse/routeNetworkCharterEvents.js,src/domain/worldPulse/routeNetworkCharterDanger.js,src/domain/worldPulse/routeNetworkCharterBypass.js,src/domain/worldPulse/routeNetworkDecay.js,src/domain/worldPulse/routeNetworkDecayLifecycle.js,src/domain/worldPulse/routeNetworkConsumers.js,src/domain/worldPulse/routeNetworkConsumersTransit.js,src/domain/worldPulse/routeNetworkConsumersStrategic.js,src/domain/worldPulse/routeNetworkConsumersInterdiction.js,src/domain/worldPulse/routeNetworkConsumersRace.js',
    aliveness: Object.freeze({
      // FILLED BY J3, and every string is traceable to a `candidateType` literal in
      // source, which is the EVIDENCE LAW at the head of this file. It was
      // DELIBERATELY EMPTY through J1 and J2 because those slices emit no candidate
      // at all ("Inert — no lifecycle events yet", §14), and a row describing code
      // that did not exist would have been the exact overclaim the law forbids.
      // The five are the whole lifecycle vocabulary: a corridor earning a road, the
      // two directions of the grade ladder, the last demotion (which §7 calls
      // Herald-worthy mourning and therefore gives its own word), and a resettled
      // remnant reopening a way it used to have.
      // UNCHANGED BY J4, and deliberately. The consumers slice reads the network and
      // writes one conditional key onto an edge; it mints no candidate of its own,
      // because a road being walked, patrolled or garrisoned is not a CHANGE to the
      // network and Law 3's event requirement is about changes. Adding a word here
      // for the consumers would be the exact overclaim the evidence law forbids.
      eventTypes: Object.freeze([
        'route_chartered', 'route_promoted', 'route_demoted', 'route_abandoned', 'route_revived',
      ]),
      // DELIBERATELY EMPTY for the same reason the momentum and supply-web rows keep
      // theirs empty: J1 authors no receipt, and once J3 does, its Herald beats will
      // classify into `knowledge` off the shared `news` token in every wizard-news
      // id, which the whole estate feeds and which can therefore never carry ALIVE
      // for one row.
      moverFamilies: Object.freeze([]),
      // The ONE channel this slice actually has, and it is exact: routeNetworkLedger.js
      // is the single writer of this key (writeRouteNetwork is the only setSpatialLedger
      // call for it in the tree), and no other subsystem touches it, so a census
      // reading is dispositive rather than shared. Receipt-expressible only from the
      // v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.routeNetwork']),
      other: 'ONE GATE, AND THE SLICE BEHIND IT STILL EMITS NO EVENT. routeLifecycleActive is the virtual routeLifecycleEnabled alone (routeNetworkLedger.js), with no spatial or war precondition, so a lit preset genuinely asks the question. WHAT J1 DOES: at world-connect it derives the network the realm was born with, from the frozen tradeRouteAccess vocabulary plus the region layer k-nearest selection plus PORTS TOTALITY, and writes it once. WHAT J2 ADDS: the FLOW LEDGER (design section 4). Every pulse it reads the traversals the existing movers have already written for their own reasons (migration columns and roads missions for population, supply shipments plus declared and starving imports for goods, army transit and standing deployments for military) and accrues each onto the corridor when no road serves the pair or onto the edge when one does. It writes no mover state of its own, so the economy and the network can never disagree about what moved. WHAT J2 ALSO ADDS is the first channel this row has that is not a container census: REALM SELF-SUFFICIENCY, a bounded 0..1 metric emitted per pulse into the behavioral observation as the additive yearly field realmSelfSufficiency, carrying provision (does the realm make what it wants), circulation (can a road reach the maker) and sustenance (does it feed itself). WHAT J3 ADDS: the LIFECYCLE ITSELF (design sections 5b, 5c, 6 and 7). A corridor whose accumulated demand crosses the formation threshold, whose material objective clears its bar once danger and any detour premium are priced into the cost, and whose one-way travel time is inside the expedition-worth ceiling, PROPOSES a charter through the ordinary DM docket and materializes on acceptance at track grade. Charters are NOT guaranteed-admission: their trigger is a corridor demand ledger that persists, so an unadmitted charter simply re-derives with more demand behind it next season. Danger is read through the BELIEVED picture an observer holds rather than through the truth, so a corridor merely feared dangerous defers while a genuinely dangerous one nobody has heard about charters and pays for it later; a corridor whose profit clears a risk premium that rises with the danger charters through it anyway, and the losses that road then takes shorten the patience the decay ladder shows it. Through-roads may pay a detour premium to skirt a place the wagons fear, which is geometry and never a new graph node, and the settlement they skirt measurably loses its through-traffic. The grade ladder then runs both ways on long dwells: sustained recent traffic promotes, prolonged silence with a failing objective demotes, a live strategic need floors an edge at road regardless of trade, and the bottom rung is HIDDEN rather than absence. WHAT J4 ADDS: THE CONSUMERS (design section 9, section 10 and J-D9 (l)), and it is the slice that makes the rest of the estate able to ask the network a question. Four readings and exactly one write. THE TRAVEL PHYSICS: a traveller crosses at most one lived edge per tick, only over roads the lived network actually carries rather than over the geometry the realm was born with, may be mid-route at any pause, and pays for the grade of the way underfoot, with wanderers and smugglers permitted the hidden remnants and armies and caravans refused them outright. The hop is the first step of the cheapest whole journey solved over the lived graph, which is a routing question rather than a proximity one, because a road network is sparse enough that the only way onward can run through a place farther from the destination than standing still. THE GARRISON ASYMMETRY: the war layer own records, standing deployments, live war-layer fronts and occupations, are read into a strategic-need band that is written onto the edge that serves the pair, which is what makes section 7 floor real end to end rather than a rule waiting for somebody to set a band. A need below the garrison rung is derived, reported and never persisted, and a need that LAPSES has its key removed in the same pass, so a road whose war ended serializes exactly like a road that never had one and the floor cannot outlive the war it belonged to. A need on a pair no road serves becomes the military charter row section 6 last sentence calls for. THE INTERDICTION READ: the supply-web instrument that patrols routes can ask which material artery it actually severs, denominated in the goods the flow ledger recorded, and a target reachable only by a hidden way cannot be interdicted at all, because a patrol needs a road to stand on. THE ARTERIAL SEEDS: the lived edges of a settlement, weighted by grade, are projected as the boundary conditions the town-cartography field stage will read, audience-projected so a player sees the overgrown nothing. THE REPUTATION RACE: person-speed over the lived network against news-speed over the same network weighted by edge grade, with listeners at the gate as an injected term, and it resolves both ways on one fixture by varying grade, distance or listeners alone. WHAT J4 STILL DOES NOT DO: it is not wired into pulseKernel, exactly as J1 through J3 are not, so every consumer here is a pure read a later integration wave calls; and it adds NO state key and NO event type, which is what the consumers_add_no_surface invariant below asserts. So a lit J4 receipt is indistinguishable from a lit J3 one at the census level, and that is the honest reading rather than a gap. So a lit J3 receipt reads as a ledger key that materializes at the first tick, holds its two containers while their CONTENTS accumulate, and carries a sparse multi-year series of charter and grade-step events, plus a self-sufficiency series that should improve monotonically absent shocks. A NON-OBVIOUS ZERO: an ASPATIAL realm whose members were all generated isolated derives no edges at all, and writeRouteNetwork drops an empty network rather than persisting empty containers, so the key is legitimately ABSENT on a lit world. That is the isolation-as-fate law (design section 0), not a dead subsystem, and the invariants below are what distinguish the two. A THIRD NON-OBVIOUS ZERO, and J3 is the slice that introduces it: a lit realm can legitimately record ZERO charter events across a whole run. The formation threshold is a multi-year accumulation, the expedition-worth ceiling refuses unreachable pairs outright, and a realm whose genesis network already serves every material want has nothing left to charter. A quiet lifecycle is a settled realm, not a broken one, and the honest reading of a zero here is the state-key channel plus the self-sufficiency series rather than the event channel alone. A SECOND NON-OBVIOUS ZERO: a realm whose settlements declare no imports at all scores provision and circulation at 1, because a place that needs nothing from anyone is self-sufficient by definition, and reporting 0 for an empty denominator would grade an untouched fixture as a catastrophe. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.routeNetwork, over a case whose realm is spatially canonized and whose members are not uniformly isolated, and whose yearly records carry realmSelfSufficiency.',
    }),
    // The network is born once and then, until J3 lands, never moves. Even with the
    // full lifecycle lit, hysteresis (Law 4) and the grade-promotion dwells make a
    // charter a multi-year event by construction, so this is the honest rung in both
    // eras and does not need re-declaring when J3 arrives.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledger_is_gated',
        description: 'The dormancy gate is one line: ensureGenesisRouteNetwork returns the input worldState BY REFERENCE when routeLifecycleEnabled is absent, so the ledger key cannot materialize behind a dark switch and a dark world is byte-identical by object identity.',
        check: 'In any v5 receipt whose subsystems.rules records routeLifecycleEnabled false or omits it, subsystems.stateKeys does not carry spatialLedgers.routeNetwork. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'genesis_is_a_birth_not_a_hum',
        description: 'The genesis network is derived exactly once, at world-connect, and nothing before the charter slice rewrites it. A ledger that first appears in a later year would mean genesis ran late or something outside this layer wrote the key. AMENDED FOR J2, and the amendment is a narrowing rather than a weakening: the census reads one level into spatialLedgers, so what it counts for this key is the number of CONTAINERS (edges and corridor, structurally two) and never the number of edges or corridors inside them. The count was therefore always constant, and the J1-era wording that read it as an entry count was describing an observation the instrument could not make. J2 accrues corridor demand and edge usage every pulse, so the ledger CONTENTS now move by design while the container count does not, and the falsifiable receipt-level claim is the one stated in the check.',
        check: 'For any receipt whose census carries spatialLedgers.routeNetwork, the key is present from the FIRST observed year and its maxEntries equals its finalEntries at the constant container count. Expressible from the v5 stateKeys census alone (years count plus the entry extremes); the edge-level and corridor-level accumulation is pinned in tests/domain/routeNetworkFlows.test.js instead, where the bodies are readable.',
      }),
      Object.freeze({
        name: 'the_metric_is_gated_and_bounded',
        description: 'REALM SELF-SUFFICIENCY (design section 5) is emitted only behind the same one-line gate the ledger is: observeRealmSelfSufficiency returns null when routeLifecycleEnabled is absent, and a null drops the yearly key entirely instead of recording a zero. That matters because a zero in a self-sufficiency column reads as a realm that cannot feed itself, which is the opposite of the truth about a world whose route lifecycle was simply never switched on. When the key IS present it is bounded to 0..1 by construction: every component is a ratio of a count to a count, with an empty denominator resolved to 1 at the source and an unreadable food ledger excluded from the weighting rather than scored.',
        check: 'In any receipt whose subsystems.rules records routeLifecycleEnabled false or omits it, no yearly record carries realmSelfSufficiency. In any receipt where it is recorded true, every yearly realmSelfSufficiency.selfSufficiency01 lies within 0 and 1 inclusive. Expressible from the v5 subsystems section plus the yearly records, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'ports_totality_or_no_harbour_at_all',
        description: 'PORTS TOTALITY (design section 6, an owner law) says every port settlement with a navigable counterpart carries at least one water edge. It holds STRUCTURALLY rather than by a repair pass: every ports pair is a member of the bounded candidate set, and a water candidate is minted unconditionally at the section 8 grade instead of being graded by the land access ladder, so no code path can skip it. The census cannot read edge bodies, so the receipt-level shadow of that invariant is the weaker but still falsifiable one: a spatially canonized realm whose digest carries a populated sea-lane set can never come out of genesis with a route ledger that is absent.',
        check: 'For any receipt whose subsystems.rules records routeLifecycleEnabled true and whose realm is spatially canonized with sea lanes, subsystems.stateKeys carries spatialLedgers.routeNetwork. Expressible from the v5 subsystems section plus the canon marker; the edge-level invariant itself is pinned in tests/domain/routeNetworkGenesis.test.js against a built port digest.',
      }),
      Object.freeze({
        name: 'nothing_is_forgotten',
        description: 'LAW 5 (design section 1) says a removal demotes to HIDDEN and never to absence, and J3 implements that by having no removal path at all: the grade ladder floors at hidden, hidden steps nowhere, and no function in the lane deletes an edge. Settlement destruction is the same demotion applied to every edge of the dead settlement in ONE fold, so a half-hidden network cannot be observed. The consequence a receipt can see is that the edge population of a lit realm is MONOTONE NON-DECREASING across a run, whatever the charter and decay events did to the grades inside it.',
        check: 'For any receipt whose subsystems.rules records routeLifecycleEnabled true and whose stateKeys census carries spatialLedgers.routeNetwork, the route_edges count never falls between consecutive observed years, and no year records route_abandoned without the edge count staying flat or rising. Expressible from the v5 stateKeys census (the spatialUsage route_edges reading) plus eventTypeCounts; the edge-level statement is pinned in tests/domain/routeNetworkDecay.test.js over a four-hundred-week soak.',
      }),
      Object.freeze({
        name: 'the_lifecycle_is_slow_and_does_not_flap',
        description: 'LAW 4 (hysteresis) and the section 13 stability envelope. Formation demand is more than six times removal demand, a corridor is only evaluated on a quarterly dwell, a promotion requires traffic inside the last season while a demotion requires a year and a half of silence, and a bypass persists half a year after the fear that wore it. Those clocks are what make a network change a story rather than noise, and they are structural rather than tuned: the freshness window a promotion needs lies strictly inside the silence a demotion needs, so no edge can satisfy both rules in the same pass.',
        check: 'For any receipt whose subsystems.rules records routeLifecycleEnabled true, the summed per-year count of route_chartered, route_promoted, route_demoted, route_abandoned and route_revived is small beside the settlement count and never oscillates between a promotion year and a demotion year for the same realm. Expressible from eventTypeCounts across the yearly records; the per-edge no-reversal statement is pinned in tests/domain/routeNetworkDecay.test.js against an oscillating-demand fixture.',
      }),
      Object.freeze({
        name: 'the_consumers_add_no_surface',
        description: 'J4 gives the estate five ways to ASK the network a question and exactly one way to write to it, and that write is a conditional band on an existing edge record rather than a new container. So the consumers slice adds no spatialLedgers key, no yearly observation field and no candidate type whatsoever, and a lit J4 realm is indistinguishable at the census level from a lit J3 one. That is stated as an invariant rather than left implicit because the opposite would be the easy mistake: a consumer that minted a candidate for every road walked, or a ledger of who is on which edge, would turn a bounded sidecar into a per-tick per-traveller table and would put the network lifecycle event stream underneath the noise of ordinary traffic. THE ONE WRITE IS ALSO BOUNDED IN THE OTHER DIRECTION: a lapsed strategic need drops its key rather than recording a none, so the ledger cannot accumulate a permanent memory of every war the realm ever fought.',
        check: 'For any receipt whose subsystems.rules records routeLifecycleEnabled true, subsystems.stateKeys carries no route-lifecycle key other than spatialLedgers.routeNetwork, and eventTypeCounts carries no route_ event type outside the five declared above. Expressible from the v5 subsystems section plus eventTypeCounts alone. The edge-level statements, that a garrisoned road holds at road across four hundred weeks of silence while its ungarrisoned twin falls to hidden, that a lapsed need leaves an edge byte-identical to one that never had a need, and that the whole hold mints ZERO Herald beats, are pinned in tests/domain/routeNetworkConsumersStrategic.test.js.',
      }),
    ]),
    // 'indirect', NOT 'unobserved', and the distinction is the contract's not a
    // shade of meaning. `unobserved` is the ESCAPE HATCH that downgrades a zero
    // reading from SILENT to an instrument gap, and it is ceilinged at a reviewed
    // population precisely so it cannot become the default excuse. This row does
    // not need it: its only channel is a spatialLedgers sidecar, and the corpus
    // contract already grades a sidecar-only row UNOBSERVED on a v4 envelope by
    // SHAPE. So the honest declaration is the one the momentum and supply-web rows
    // make for their identically-shaped lanes: the dispositive channel exists and
    // is instrumented ONLY by the v5 census, and every completed release case is a
    // v4 envelope, so no dispositive reading exists yet.
    soakEvidence: 'indirect',
  }),
  // ── THE MAGIC ECONOMY (W-K, docs/DESIGN_MAGIC_ECONOMY.md §12, §13) ────────
  // REGISTERED FROM THE FIRST COMMIT, on the same terms as the W-J row above and for
  // the same mechanical reason: `magicEconomyEnabled` is VIRTUAL (no
  // DEFAULT_SIMULATION_RULES entry, by design), so until it was declared at FALSE in
  // the full_simulation spread `simulationRuleKeys()` could not census it and this row
  // read back as `unknownRows`. The declaration is what puts W-K under the
  // certification contract now rather than retroactively.
  Object.freeze({
    rule: 'magicEconomyEnabled',
    title: 'Magic economy and institution status',
    module: 'src/domain/worldPulse/institutionStatusModel.js,src/domain/worldPulse/institutionStatusLifecycle.js,src/domain/worldPulse/magicRegimeModel.js,src/domain/worldPulse/magicRegimeLifecycle.js,src/domain/worldPulse/magicForms.js,src/domain/worldPulse/magicFormsPractitioner.js,src/domain/worldPulse/magicBufferModel.js,src/domain/worldPulse/magicBufferApply.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, per the EVIDENCE LAW at the head of this file: every string
      // here must be traceable to a `candidateType` literal in source. K1 emits status
      // TRANSITION RECEIPTS (impairment_opened / impairment_lifted / shell_formed /
      // shell_reactivated) and K2 emits CROSSING receipts (magic_regime_promoted /
      // magic_regime_demoted), but every one of them is RETURNED FROM A PURE ADVANCE
      // and none is minted as a pulse candidate, because neither slice is wired into
      // pulseKernel. K1's own note here predicted that K2's crossings would be the
      // first candidates this lane owns; THAT PREDICTION IS CORRECTED RATHER THAN
      // QUIETLY LEFT STANDING. K2 deliberately did not take the pulse call site: the
      // Herald routing and the candidate registration are one wiring decision for the
      // whole of W-K, and making it inside a slice that only needed its own events
      // returned would have committed the other three slices to a seam they had no
      // say in. The events are Herald-SHAPED so that wiring stays a routing change.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY for the reason the momentum, supply-web and route rows keep
      // theirs empty: no slice in this lane authors a Herald beat yet, and once one
      // does, its beats classify into `knowledge` off the shared `news` token that the
      // whole estate feeds, which can therefore never carry ALIVE for one row.
      moverFamilies: Object.freeze([]),
      // The channels this lane has, and all three are exact: each key has exactly ONE
      // writer in the tree (writeInstitutionStatusLedger, writeMagicRegimeLedger and
      // writeMagicBufferLedger are the only setSpatialLedger calls for their keys) and
      // no other subsystem touches any of them, so a census reading is dispositive
      // rather than shared. K2 added the regime ledger, K3 the ward reserve.
      stateKeys: Object.freeze([
        'spatialLedgers.institutionStatus',
        'spatialLedgers.magicRegime',
        'spatialLedgers.magicBuffer',
      ]),
      other: 'ONE GATE, AND THE SLICE BEHIND IT IS MAGIC-INDEPENDENT. magicEconomyActive is the virtual magicEconomyEnabled alone (institutionStatusModel.js), with no magic, spatial or economic precondition, so a lit preset genuinely asks the question. WHAT K1 DOES: it gives every institution in the estate an honest three-word status from the closed vocabulary operational, impaired and shell (design section 3c). IMPAIRED is a cause-bound capacity modifier whose cause is drawn from a closed four-member vocabulary (supply shortage, corruption exposed, damage, siege or occupation), whose default severity per cause is the severity the estate\'s own existing producer already stamps for that mechanism, and which the DM may override anywhere from reduced to a temporarily zero capacity. SHELL is the intact but unfunded verdict, and K1 does NOT mint it: it reads the mark institutionLifecycle already writes at an economic close, so the estate has one spelling of closed rather than two. THE TWO LAYERS COMPOSE, which is why the verdict carries impaired and shell as independent flags beside the single headline word. WHAT IT DOES NOT DO: no regimes, no forms ladder, no disaster buffer, no substitution, and NO PULSE WIRING AT ALL. K1 ships the model, the pure DM override verbs and the pins; the pulseKernel call site, the Herald routing and the DM command belong to later slices. A NON-OBVIOUS ZERO, and it is the important one: a lit world in which every institution is working carries NO ledger key whatsoever. The ledger stores only the durable half of a status, and cause PRESENCE is re-derived from live state on every advance rather than persisted, so a realm with nothing wrong with it has nothing to remember and writeInstitutionStatusLedger drops the key rather than persisting empty containers. That is the no-orphan law made structural (design section 3c: an impairment can NEVER orphan), not a dead subsystem. A SECOND NON-OBVIOUS ZERO: a RUINED institution is graded null rather than given a word, because section 3c calls the impaired shell the darkest state short of ruin, so ruin sits outside this vocabulary and the calamity and lifecycle machinery owns it. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.institutionStatus, over a lit case whose run actually damaged, starved, besieged or defunded at least one institution. WHAT K3 ADDS, AND WHY IT IS THE HARDEST CHANNEL IN THIS ROW TO OBSERVE: the disaster buffer (design section 5) converts calamity damage instead of deleting it. Mitigation is an economy term plus a magic term multiplied by K2\'s ONE gate, both banded, the SUM ceiling-capped at 0.40 so the richest and most magical city on its best day still eats sixty percent of any calamity that finds it, and the whole capped sum scaled by a ward reserve that the payment itself draws down. Every point of relief is BILLED, in the same outcome, to named stocks the world already has: the granary in months and the ward reserve as a fraction, granary first, and the mitigation is walked DOWN until the bill fits the stocks, so a settlement with empty granaries and a spent reserve mitigates nothing at all however rich its regime reads on paper. Reagents are named by the design as a third payer and are DELIBERATELY not billed here, because slice K4 mints reagent stocks and pricing a stock that does not exist would be a fabricated ledger entry wearing conservation\'s clothes. THE OBSERVATION PROBLEM IS RARITY, NOT WIRING: a calamity is a one-strike-per-fifteen-realm-years draw with an eight-year per-settlement cooldown, so a lit realm can run for decades and never once ask the buffer a question. The spatialLedgers.magicBuffer key therefore appears only where a strike LANDED on a lit settlement and the wards actually held something, and it DRAINS as well as fills: a reserve refilled to full is dropped, because full is what an untouched settlement already reads. An absent key over a short observation window is the honest reading of a quiet realm, not a dark subsystem. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt over a lit case long enough to contain at least one calamity strike, whose census carries spatialLedgers.magicBuffer and whose strike receipt carries the relief block naming what was spared and which stocks paid. WHAT K2 ADDS: the two axes, and the whole point of the slice is that they are SEPARATE. Magic-class presence keys off the magic profile alone and exploitation off the economy alone (design law 2), and that split is enforced by SIGNATURE rather than by discipline: magicFormFloor takes a settlement and no regime, magicFormCeiling takes a regime and no settlement, and neither can consult the other without a call-site change that reds the pins. The economy side is a closed four-rung ladder (subsistence, funded, patronized, industrial) entered by thresholds with hysteresis and graded continuously within, and its two lower thresholds are NOT NEW NUMBERS: funded opens at exactly institutionLifecycle\'s declining line and patronized at exactly its prosperous line, pinned as equalities so the magic ladder and the institution build-and-close lifecycle can never drift into disagreeing about whether a town is poor. Only the industrial threshold is new, because the rung is. THE ONE GATE FORMULA (design section 4) lives in magicRegimeModel and is the single definition every magic-derived output reads, including K3\'s magic mitigation term and K4\'s substitution capacity; it is monotone in the economy and continuous across a fresh crossing, so a discontinuity in it is always hysteresis and never arithmetic. The forms ladder (practitioner, circle, tower, guild, foundry) is GRADUATED FROM THE CATALOG rather than invented over it: every rung names the authored entries that realize it, at the tier the catalog already authors them, so the wizard\'s tower rung floors at town because the catalog\'s own prose says a tower is viable at a thousand people and town begins at nine hundred and one. A MEASUREMENT THAT SHAPED THE CODE AND SHOULD NOT BE RE-LEARNED THE HARD WAY: an early build classified rungs by institution NAME, and over a 180-settlement corpus it read 16 magic guilds and 13 magic circles into worlds whose magic level was `none`, because the cobbler\'s guild, the carriers\' guild, the town council and the hunter\'s lodge all match the obvious patterns. The cure is the catalog\'s own authored `arcane` tag, read through the canonical tag accessor, as a GATE before any rung question is asked; with it, magicless worlds hold exactly zero forms across the corpus. THREE NON-OBVIOUS ZEROS, all deliberate. First, a lit world every settlement of which sits at the base regime carries NO ledger key at all, because subsistence is stored as the ABSENCE of a record rather than as a recorded word, which is what keeps a poor realm byte-identical to a realm that never had this layer. Second, K2 emits NO shell event of its own: a demotion marks the over-ceiling institutions with institutionLifecycle\'s exact economic-close spelling and stops, and K1 is what then grades them shell and reports the transition, so the estate has one spelling of closed and one producer of the verdict. Third, a THORP holds no magic institution at any magic level whatsoever, measured across the corpus, because the catalog authors no Magic category at thorp at all; that is precisely why design section 3b makes the practitioner rung a TIED ROSTER CHARACTER, and it is the empirical fact that turns the tied person from decoration into the only way the design\'s own thorp sentence can ever be true. WHAT K2 DOES NOT DO: no pulse wiring, no Herald routing, no candidate registration, and no catalog authoring of any kind. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose census carries spatialLedgers.magicRegime, over a lit case run long enough for at least one settlement to climb off the bottom rung. Note that GENESIS ALONE CANNOT PRODUCE ONE at the top: across a 324-settlement corpus the economy composite never reached the industrial threshold, so an industrial-magic city is something a world grows into over simulated decades rather than something it is born with, which is design section 9\'s rarity law holding by construction rather than by tuning.',
    }),
    // A cause opens and lifts on the fast layer, but the SHELL half is the slow verdict
    // by construction (institutionLifecycle's close requires a multi-tick decline streak
    // and is deliberately uncommon), and K2's regime crossings carry hysteresis. So
    // multi_year is the honest rung in both eras and will not need re-declaring.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledger_is_gated',
        description: 'The dormancy gate is one line: applyInstitutionStatus returns the input worldState BY REFERENCE when magicEconomyEnabled is absent, so the ledger key cannot materialize behind a dark switch and a dark world is byte-identical by object identity.',
        check: 'In any v5 receipt whose subsystems.rules records magicEconomyEnabled false or omits it, subsystems.stateKeys does not carry spatialLedgers.institutionStatus. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'no_impairment_without_a_live_cause',
        description: 'THE NO-ORPHAN LAW (design section 3c). An impairment record can never outlive the cause it is bound to, and the guarantee is structural rather than swept: presence is re-derived from live state on every advance and only the durable half is stored, so a resolved cause drops its record in the same pass that notices, emitting a lift event. The receipt-level shadow of that invariant is a shape claim, because the census cannot read record bodies: the ledger is a memory of trouble, so it can only ever be populated in a run that actually had some.',
        check: 'For any receipt whose census carries spatialLedgers.institutionStatus, that same receipt records magicEconomyEnabled true. Expressible from the v5 subsystems section alone; the record-level orphan totality is pinned in tests/domain/institutionStatusLifecycle.test.js, which runs auditInstitutionStatusLedger before and after an advance over a hand-orphaned ledger.',
      }),
      Object.freeze({
        name: 'the_ledger_drains_as_well_as_fills',
        description: 'An impairment lifts automatically when its cause resolves, and a ledger that only ever accumulated would mean the lift path stopped running and every institution kept its first grievance forever. Because the whole key is dropped when the last record clears, a healed realm reads as an ABSENT key rather than as an empty container, which is the same drop-when-empty shape the route network uses.',
        check: 'For any receipt whose census carries spatialLedgers.institutionStatus over more than one observed year, either maxEntries is strictly greater than finalEntries, or the key years count is below the receipt observedYears. Expressible from the v5 stateKeys census alone.',
      }),
      Object.freeze({
        name: 'presence_is_magic_gated_exploitation_economy_gated',
        description: 'DESIGN LAW 2, and it holds by SIGNATURE rather than by care. The presence floor of the forms band is computed by a function that takes a settlement and no regime, and the exploitation ceiling by one that takes a regime and no settlement, so neither axis can consult the other without a call-site change. The consequence a reader should hold onto is that a magic-institution presence at high magic is INVARIANT across all four economy rungs, while the ceiling moves across all four; a rich low-magic town and a poor high-magic one therefore hold different form sets for opposite reasons, which is what design section 3a means by calling the skyline a diagnosis. The receipt-level shadow is narrower than the invariant, because no census channel reads a settlement\'s forms: what a receipt can see is that the regime ledger is the ONLY key this slice writes, so no amount of economic motion can make a magic institution appear or vanish in the state census.',
        check: 'For any receipt whose subsystems.rules records magicEconomyEnabled true, subsystems.stateKeys carries no magic-economy key other than spatialLedgers.institutionStatus, spatialLedgers.magicRegime and spatialLedgers.magicBuffer, and eventTypeCounts carries no magic_regime_ event type at all while the lane is unwired. Expressible from the v5 subsystems section plus eventTypeCounts. The axis-level statements, that the floor is invariant across every regime at every tier and that output is monotone in the economy at fixed magic, are pinned in tests/domain/magicForms.test.js, the second as a sweep over 101 economy readings in every tier and magic cell.',
      }),
      Object.freeze({
        name: 'no_flapping_foundries',
        description: 'DESIGN LAW 4. A regime crossing is protected by TWO mechanisms that answer different fixtures, and both are needed: a dead band (every promotion threshold sits strictly above the demotion threshold below it) kills jitter, and a minimum dwell kills a genuine but rapid swing that would otherwise rebuild and close the same foundry inside a year. Because a demotion is what CLOSES an over-ceiling magic institution, a flapping ladder would not merely produce noisy events, it would shutter and reopen real buildings on alternating ticks and fill the Herald with a contradiction. The dwell is four ticks against an institution-close path that already requires a multi-tick decline streak, so a regime change is always slower than the closure it causes is allowed to be.',
        check: 'For any receipt whose subsystems.rules records magicEconomyEnabled true, the summed per-year count of magic_regime_promoted and magic_regime_demoted is small beside the settlement count and never oscillates between a promotion year and a demotion year for the same realm. Not yet expressible, because the lane mints no candidates; the statement is pinned directly in tests/domain/magicRegimeLifecycle.test.js, which drives forty ticks of an economy swinging across the whole dead band on every single tick over a real roster and counts how many times the foundry actually changes state, and separately in tests/domain/magicRegimeModel.test.js against an oscillation strictly inside the band, which must produce exactly zero crossings.',
      }),
      Object.freeze({
        name: 'mitigation_is_paid_for_and_never_total',
        description: 'DAMAGE TRANSMUTES, NEVER VANISHES (constitutional law 5; design section 5). The disaster buffer has two hard properties and neither is a tuning choice. First, it is CEILING-CAPPED at a sum strictly below one, and the two terms that feed the sum deliberately overshoot that cap, so the ceiling genuinely binds at the top of both axes rather than being approached: no amount of wealth, magic or regime nullifies a calamity. Second, every point of relief is BILLED to named stocks in the same outcome, granary first and ward reserve second, and the mitigation is walked down until the bill fits what the settlement actually holds. A settlement therefore cannot mitigate on credit, and the relief it bought is always exactly equal to the relief it paid for.',
        check: 'Not expressible from a v5 receipt: the census reads key presence, not record bodies, and the conservation identity is a within-strike equality. It is pinned instead in tests/domain/magicBufferModel.test.js, which asserts the ceiling holds at the extreme corner of the magic by economy grid and that the two billed shares sum to the settled relief total exactly, and in tests/domain/magicBufferIntegration.test.js, which runs the equality through a real calamity strike. The receipt-level shadow that IS expressible: for any receipt whose census carries spatialLedgers.magicBuffer, that same receipt records magicEconomyEnabled true.',
      }),
      // ── K4 SUBSTITUTION AND REAGENTS (design sections 6 and 7) ────────────
      // TWO invariants, and between them they state the whole slice: magic is not
      // exempt from the food ledger, and magic is not exempt from the road.
      Object.freeze({
        name: 'substitution_is_a_channel_never_an_exemption',
        description: 'THE CONSERVATION LAW (design section 6). At the top regimes magic may carry a CAP-BANDED share of a settlement\'s daily need, and it carries it as one more term in the same effective-deficit sum the blockade cut, the famine cut and the seasonal swing already land on, exactly the way the harvest boost does. Three consequences are structural rather than tuned. The cap is a true ceiling, because the practitioner and reagent factors multiply against it rather than adding on top of it. The share costs material on both sides, practitioner capacity and reagent supply, so an impaired guild feeds fewer people THIS TICK and a cut reagent road feeds none. And removing the magic source restores the original deficit to the digit, because the base number is never rewritten. The ceiling itself is not invented: it is FOOD_IMPORT_RATES.teleport, the estate\'s own standing verdict on how much of a settlement\'s need magic can carry, so an industrial foundry cannot out-carry a teleportation circle.',
        check: 'Not expressible from a v5 receipt: substitution writes no state key of its own, so there is nothing for the census to read. It is pinned instead in tests/domain/magicSubstitution.test.js, which runs the REAL advanceFoodStockpile, composes its own effective deficit through the channel, and then removes the practitioners and separately removes the reagents and asserts the original deficit came back unchanged in both cases. The cap is swept across the cross product of regime, roster and supply, and the sweep asserts both that the ceiling is never exceeded and that it is actually REACHED, so a cap that held only because nothing approached it would fail.',
      }),
      Object.freeze({
        name: 'the_magic_economy_adds_no_state_key_of_its_own_for_reagents',
        description: 'A NON-OBVIOUS ZERO, and it is deliberate. Design section 7 asks that reagent chains join the supply data and that magic institutions generate corridor demand in the route lifecycle flow ledger, and K4 does exactly that WITHOUT minting a container. The corridor demand accrues into spatialLedgers.routeNetwork, which the routeLifecycleEnabled row already owns, under the EXISTING unmet_import source rather than a new one, because reagent hunger is literally an unmet import of a good and forking the attribution table would have bought a distinction the goods id already carries. The reagent interdiction likewise mints nothing: it stamps the estate\'s own supply_starved impairment, which the K1 status system was already reading. So a census reading of routeNetwork is NOT dispositive for this rule, and saying so is the honest declaration rather than a claim of a channel this slice does not have.',
        check: 'Expressible from the v5 subsystems section alone, and it is a SHAPE claim rather than a count: subsystems.stateKeys carries no magic-economy key for reagents at all, in a lit run as in a dark one, because the only container this half writes to is spatialLedgers.routeNetwork. Any receipt carrying a reagent-driven corridor therefore records BOTH magicEconomyEnabled and routeLifecycleEnabled true, since the accrual is doubly dormant by construction, and the corridor is otherwise indistinguishable at census level from any other goods corridor, which is the point. The behavioural claims are pinned in tests/domain/magicSubstitutionReagents.test.js: that the accrual composes with a prior route-lifecycle pass rather than overwriting it, that the regime scales the demand and a subsistence regime presses none, and that a cut reagent link IMPAIRS the magic houses on the next status advance while the shell verdict stays byte-identical across that same tick, which is the two-timescale law of design sections 3c and 7 executed end to end.',
      }),
    ]),
    // 'indirect', NOT 'unobserved', on exactly the terms the route-network row states:
    // the UNOBSERVED escape hatch is a ceilinged, reviewed population, and a
    // sidecar-only row does not need it because the corpus contract already grades that
    // SHAPE unobserved on a v4 envelope. The dispositive channel exists and is
    // instrumented only by the v5 census, and every completed release case is a v4
    // envelope, so no dispositive reading exists yet.
    soakEvidence: 'indirect',
  }),
  // W-I I2 THE INFORMATION BROKERAGES. Declared at the commit that first gives the lane
  // EFFECTS, and declared honestly EMPTY, which is the harder half of the evidence law:
  // this slice emits no candidate, writes no worldState key, and adds no yearly field, so
  // every channel a v5 receipt can read is genuinely blind to it. A row claiming otherwise
  // would grade the lane ALIVE off some other subsystem's work, and the certification
  // contract exists to forbid exactly that. `informationBrokeragesEnabled` was declared at
  // FALSE in the full_simulation spread in the same edit, so the totality walker can census
  // the key rather than reading this row back as unknownRows.
  Object.freeze({
    rule: 'informationBrokeragesEnabled',
    title: 'Information brokerages',
    module: 'src/domain/worldPulse/brokerageStamps.js,src/domain/worldPulse/brokerageFidelity.js,src/domain/worldPulse/brokerageServices.js,src/domain/worldPulse/brokerageServicesRules.js,src/domain/worldPulse/brokeragePatronage.js,src/data/informationBrokerageTuning.js',
    aliveness: Object.freeze({
      // I3/I4 GAVE THIS ROW ITS FIRST DISPOSITIVE CHANNEL, exactly as the I2 row said it
      // would ("the first receipt-expressible channel arrives with I3"). These four
      // literals are minted by the brokerage producer and by nothing else in the estate,
      // so a nonzero count for any of them is this lane's own work and no other's.
      eventTypes: Object.freeze([
        'brokerage_query', 'brokerage_feed', 'brokerage_intercept', 'brokerage_plant',
      ]),
      // STILL EMPTY, and now for a sharper reason than before. The four acts DO classify
      // into the knowledge mover family on their own vocabulary (ruleFamily 'information'
      // is a knowledge token, and no earlier family's token appears anywhere in their
      // joined classification text) rather than through the bare `news` token in an id.
      // That is the starved-lane cure the design asked for. But declaring the family here
      // would still be vacuous EVIDENCE while knowledgeLaneEvidence's two residual lists
      // are non-empty, because a knowledge count remains a bucket sixteen other kinds fall
      // into. Contributing genuine members to a contaminated family is progress; reading
      // that family back as this row's proof would be the contamination.
      moverFamilies: Object.freeze([]),
      // STILL EMPTY, and structurally so: I3 and I4 add no worldState container at all.
      // The patron binding is DERIVED (genesis by zero-draw pick, captured by reading the
      // faction ledger the capture machinery already writes), the feed writes into the
      // belief ledger the belief subsystem owns, and the commissioned plant is handed to
      // the statecraft module's OWN spatialLedgers.disinfo rather than to a second one.
      stateKeys: Object.freeze([]),
      other: 'A CONJUNCTION GATE OVER A LANE THAT WRITES NOTHING. brokerageEffectsActive is informationBrokeragesEnabled AND infoStatecraftActive, which is itself the spatial canon marker plus a non-omniscient info mode plus infoStatecraftEnabled, so a preset that lights this key alone changes nothing by construction. WHAT I1 DID: four catalog entries (listening post, chroniclers exchange, rookery, whisper market), their closed service keys, and the rumour-source tags, all inert data with no engine reader. WHAT I2 ADDS, and it is two effects and no records. FIRST, RELIABILITY STAMPS. Where a house stands, each Herald news item about that settlement gains a grade from the closed ladder confirmed, corroborated, reported, tavern talk, derived from the provenance of the telling the settlement actually holds in its rumour ledger and surfaced as prose rather than as a number. Outside a brokerage settlement the news carries no grade at all, which is the design law that the baseline uncertainty stays unlabelled. SECOND, THE FIDELITY TERM. The observer settlements aggregate accuracy is floored at its houses belief competence, attenuated by news distance, composed into the same sight slot the statecraft SEE posture already uses. Neither effect mints an event, neither writes a container, and both are pure derivations over records other subsystems own. THE MEASUREMENT THAT SHAPED THE LADDER, and it is the part a later reader most needs: over 18377 arrival records produced by the real rumour advance, content intactness fell monotonically with relay hops (1.000, 0.765, 0.635, 0.534, 0.465 for hops zero through four) and was FLAT in corroboration count (0.679, 0.690, 0.676 for one, two and three independent roots), because the merge rule keeps the better telling rather than taking a vote. The ladder is therefore hop driven and corroboration rides only the prose. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: nothing a v5 receipt carries today. THAT CHANNEL HAS NOW ARRIVED. WHAT I3 AND I4 ADD is four institutional ACTS and, still, no container. QUERY: a power pays its house an in-world price, banded by channel, distance and form and denominated in the patron powers own political capital rather than in anything a subscription can read, and receives a projection of records that already existed, carrying the I2 stamp. A patron that cannot pay is refused by name and gets no degraded answer. FEED: a guild-form house calibrates its patron powers own belief slot every pulse, on the channels it will vouch for at the I2 vouch floor and on no others, by a bounded fraction of the belief-to-truth gap, raising confidence only as far as that pull justifies. PLANT, the market: a patron commissions a falsehood, and the commissioning produces a record of exactly the shape the already-built LIE verbs own disinfo ledger holds, so the existing contradict, expose and blowback triple prices the failure and the market itself wears the credibility charge. INTERCEPT: a standing feed is a visible edge between two named parties, so a rival power can read over the patrons shoulder, which is the espionage-target surface a patron contract creates. PATRONAGE binds every house to a power, seeded from the settlements own power structure by a zero-draw pick, and REBINDS through the existing faction_institution_capture machinery rather than through any second mechanism: the reader simply prefers the faction that actually holds the institution. THE ONE THING A READER MOST NEEDS TO KNOW ABOUT THE FILING: these four acts are the first records in the estate that classify into the knowledge mover family on their OWN vocabulary rather than through the bare news token in a wizard-news id, which is the starved-lane finding of 2026-07-31 answered with generators rather than with a re-reading. Getting them there cost a one-line generalization in applyWorldPulse, because the applier used to require the taxonomy label faction before it would apply a factionPatch, and that label would have filed every paid brokerage act under politics. WHAT WOULD STILL BE NEEDED to observe the lane in a completed soak: a case that lights informationBrokeragesEnabled at all. No completed release case does, which is why the soak evidence below stays unobserved even though the channel is now real.',
    }),
    // A stamp appears when a house stands and a telling arrives, which is a reaction to
    // traffic rather than a cadence. The tempo floor is moot while every channel is
    // undeclared; it is stated so the row does not need re-declaring when I3 lights one.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_lane_writes_no_key',
        description: 'I2 adds no worldState container and no yearly observation field. The stamps are derived inside the Herald read model and discarded with it, and the fidelity term is an argument to an existing reconciliation rather than a record. That is why every aliveness channel above is empty, and it is a property a receipt can actually check rather than a promise.',
        check: 'In any v5 receipt, subsystems.stateKeys carries no key whose path contains brokerage, and no yearly record carries a brokerage field, whether informationBrokeragesEnabled reads true, false or is omitted. Expressible from the v5 subsystems section plus the yearly records, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'distance_is_never_abolished',
        description: 'Constitutional Law 1. The fidelity floor a house puts under a belief is bounded by the authored FIDELITY_CEILING, which is strictly below one, AND divided by a distance price that grows with the news distance to the subject, so the decay curve bends and never flattens. Two independent constructions, so neither a tuning edit nor a refactor can abolish distance quietly.',
        check: 'Not receipt-expressible: the floor is an argument inside one advance and never persists. Pinned directly in tests/domain/brokerageFidelity.test.js, which asserts the floor is monotone non-increasing in distance, strictly below the ceiling at every distance, and strictly lower for a far subject than a near one under the same house.',
      }),
      Object.freeze({
        name: 'a_query_mints_no_fact',
        description: 'THE PROJECTION LAW (design section 6). A query answer is built out of records that already existed and out of nothing else. Every claim in an answer carries a from naming its source and a ref locating it, there are exactly two admissible sources, the settlements own belief record and the callers ground truth, and there is a single constructor for a claim, so a reading with no record behind it cannot be built at all. Ground truth is admitted only where the houses distance-attenuated accuracy floor has reached the sharp vouch floor, which is constitutional Law 1 reaching the counter: a house near the subject can tell you what is so, and the same house four roads away hands you the belief instead.',
        check: 'Not receipt-expressible: an answer is a return value and never persists. Pinned in tests/domain/brokerageServices.test.js, which resolves every claim of every answer over a table back into the exact record it names and fails if any claim carries a value the world did not already hold, with the negative control that removing the belief record removes the claim rather than substituting an invented one.',
      }),
      Object.freeze({
        name: 'the_price_is_real_and_the_refusal_is_honest',
        description: 'Constitutional Law 3 made operational. The price of a question or a commission is charged against the patron powers political capital in the faction ledger, through the same applyFactionPatch path the faction layer already uses, and it is charged in absolute next-values so a late application cannot rebase to a stale snapshot. A patron whose capital is below the asking price is REFUSED, by a named reason from a closed refusal vocabulary, and the refused path returns no answer at all rather than a cheaper one. A refusal mints NO event either, deliberately: a beat for every question nobody could afford would let this lane certify itself off its own failures.',
        check: 'Expressible in part from eventTypeCounts: a brokerage_query or brokerage_plant count is a count of acts that were PAID FOR, since an unpayable act emits no candidate. The charge itself is pinned in tests/domain/brokerageServices.test.js against a rich patron and a poor one over the identical world, with the poor patrons capital asserted unchanged.',
      }),
      Object.freeze({
        name: 'a_dark_flag_is_byte_identical',
        description: 'The dormancy gate is one predicate read in one place, and I3 and I4 each read that same one. makeBrokerageFloorFn returns null before it reads the digest or walks a roster, and composeBrokerageSight then returns the callers own closure BY REFERENCE, so a dark advance hands the belief reconciliation the identical object it did before this slice existed. applyPatronFeeds likewise returns the callers own maps object by reference, the candidate producer returns an empty array before it walks a single roster, and on the read-model side heraldItemReliability returns null on the same predicate and the epistemic block is built without the key.',
        check: 'In any v5 receipt whose subsystems.rules records informationBrokeragesEnabled false or omits it, eventTypeCounts carries none of this rows four literals, since the producer returns empty before it can mint one. Expressible from the v5 subsystems section plus eventTypeCounts; the object-identity statements are pinned in tests/domain/brokerageDormancy.byteIdentity.test.js and tests/domain/brokerageServices.test.js against lit-versus-dark advance pairs.',
      }),
    ]),
    // INDIRECT, not unobserved, and the change is I3s. A row that declares a channel and
    // still calls the soak blind to it burns one of the five reviewed escape-hatch slots,
    // and this row no longer needs one: eventTypeCounts is a real, dispositive, ALREADY
    // INSTRUMENTED channel, and the reason no completed case shows a reading is simply
    // that no completed case lights informationBrokeragesEnabled, which the corpus grades
    // DORMANT_BY_CONFIG rather than SILENT. The honest declaration is therefore that the
    // instrument exists and the corpus has not yet run a world in which it could fire.
    soakEvidence: 'indirect',
  }),
  // ── THE TOWN CARTOGRAPHY PROGRAM (TC, docs/DESIGN_TOWN_CARTOGRAPHY.md §8, §9) ──
  // REGISTERED FROM THE FIRST COMMIT, on the same terms and for the same mechanical
  // reason as the four dark declarations above: `townCartographyEnabled` is VIRTUAL
  // (no DEFAULT_SIMULATION_RULES entry, by design), so until it was declared at FALSE
  // in the full_simulation spread `simulationRuleKeys()` could not census it and this
  // row would have read back as `unknownRows`.
  //
  // THIS ROW DECLARES NO ALIVENESS CHANNEL AT ALL, and that is the finding rather than
  // laziness. The other rows in this file certify ENGINE lanes: they mint candidates,
  // they write worldState containers, and a soak receipt can therefore see them. This
  // one gates the SCENE COMPILER, which runs on the presentation side of the wall a
  // soak never crosses. It mints no candidate, writes no worldState key, and moves no
  // mover family, so every channel this contract can grade is honestly empty and the
  // row says so through soakEvidence 'unobserved' rather than by borrowing a channel
  // it does not own. Declaring `place` here, for instance, would grade this row ALIVE
  // off the 3,255 place movers the completed release case already carries, which is
  // the exact vacuity the certification contract exists to forbid.
  Object.freeze({
    rule: 'townCartographyEnabled',
    title: 'Town cartography (the deterministic settlement map)',
    module: 'src/domain/townScene/cartographyContract.js,src/domain/townScene/manifestContract.js,src/domain/townScene/compileTownSceneManifest.js,src/domain/townScene/sceneCompileInput.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The program emits no candidate of any type: its whole
      // output is manifest layers, and a manifest is compiled on demand for a viewer
      // rather than proposed to a DM docket.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and it could not be otherwise: a mover family is a
      // classification of wizard-news beats, and this program authors no beat. The
      // map narrates by being redrawn.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the structural half of the finding: the
      // cartography layers are written into a TownSceneManifest, never into
      // worldState. The v5 census walks the top-level worldState keys plus one level
      // into spatialLedgers, so there is no container for it to read, lit or dark.
      stateKeys: Object.freeze([]),
      other: 'A PRESENTATION-SIDE SUBSYSTEM, AND THE FIRST ONE THIS CONTRACT HOLDS. THE GATE: townCartographyActive is the virtual townCartographyEnabled alone (cartographyContract.js), read once at the scene compile-input wall, where it becomes the conditional envelope key the compiler reads; there is no spatial, war or canon precondition, so a lit campaign genuinely asks the question. WHAT TC-1 DOES, and no more: it extends the TownSceneManifest schema with ONE additive optional top-level key carrying the four cartography layers (streets, wards, parcels, buildings), it freezes the eight closed vocabularies those layers draw from, it captures the dormancy fence, and it wires the synthesis stage as an IDENTITY. It performs no synthesis whatsoever, which is why a lit TC-1 compile is byte-identical to a dark one, and saying so plainly is the honest reading rather than a gap. THE ADDITIVE LAW: the manifest keeps schemaVersion 1 and its required key set unchanged, so a manifest compiled before this program existed still validates byte for byte; the cartography block carries its OWN schemaVersion, which is what lets an old manifest load unchanged while a new one is a strict superset. THE CLOSED VOCABULARIES: ward kinds are the estates twelve district categories VERBATIM rather than a new list, because a ward is a district drawn in ink and a ward kind no district could carry would be a second truth about the same place; the other seven (street classes, building roles, the ordered condition ladder, provenance kinds, the A-8 placement modes, the A-10 deciding layers, the A-10 Lynch elements) are frozen here and censused by one registry so a ninth cannot enter unregistered. THE REFERENTIAL CLOSURE: a street may only reference a gate or a bridge the manifest already publishes, and a footprint may only reference an institution the manifests own semantics table resolves, so the design law that the map and the dossier cannot disagree is a validator rule rather than an aspiration. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: nothing a soak receipt can carry. The dispositive evidence for this lane is a MANIFEST corpus (seed x tier x terrain x route digests, plus rendered-PNG hashes for a pinned subset, design section 7) and the promotion contract evidence program, neither of which is a whole-world soak artifact. That is why this row declares soakEvidence unobserved rather than indirect: indirect would claim an instrumented channel this subsystem does not have.',
    }),
    // A manifest is compiled on demand for a viewer, so the subsystem has no cadence
    // in world time at all. `reactive` is the honest rung: it fires when something
    // asks it to, and its floor is a single firing anywhere in the span.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_schema_extension_is_additive',
        description: 'The manifest gains ONE optional top-level key and nothing else. Its required key set, its schemaVersion and its digest are all unchanged, so a manifest compiled before this program existed still validates unchanged and a manifest compiled after it is a strict superset. A schemaVersion bump would have moved every recorded manifest golden while the program is still dark, which THE GOLDEN LAW forbids.',
        check: 'NOT expressible from a v4 or v5 receipt: no receipt of any envelope carries a TownSceneManifest. It is pinned instead in tests/domain/townSceneCartography.test.js, which validates a pre-cartography manifest unchanged, validates the same manifest carrying a well-formed block, and reds on a block that is partial, mis-keyed or out of vocabulary.',
      }),
      Object.freeze({
        name: 'dormancy_holds_by_object_identity',
        description: 'The dormancy gate is one line: attachTownCartographyLayers returns the manifest it was handed BY REFERENCE when the block is null, so a dark compile cannot materialize a layer and cannot even rebuild the object it would have added one to. The transport envelope obeys the same law one level up: the gate key is CONDITIONAL, so a dark envelope carries the same seven keys and digests to the same inputDigest it did before the key existed.',
        check: 'NOT expressible from a v4 or v5 receipt, for the same reason as above. It is pinned in tests/property/townCartographyDormancyGolden.test.js against a fence recorded BEFORE the stage was wired: 54 manifests (the frozen 18-config town-map corpus crossed with all three audiences), hashed through the manifests own canonical serializer, so an added top-level key, a reordered array or a changed integer all move the hash.',
      }),
      Object.freeze({
        name: 'no_layer_invents_a_reference',
        description: 'Design section 1 says a map generated beside the manifest and then decorated is a second settlement truth and is forbidden. The structural expression of that is referential closure: every gate and bridge a street names, and every institution a footprint names, must already exist in the SAME manifest, resolved through the same semantics table the dossier reads. A reference that resolves nowhere is the fork the law forbids, so it is an error rather than a warning.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/townSceneCartography.test.js, where a block whose gateRef, parcelId, wardId or institutionRef names a record the manifest does not publish reds with a named error, and the same block with the reference corrected passes.',
      }),
      Object.freeze({
        name: 'the_manifest_carries_tone_and_never_colour',
        description: 'A-9 says the painter is full colour but every value derives from src/design/tokens.js, and A-11 extends the same law to skins. The manifest side of that is a hard one: the data layers carry tone INTENSITY in permille and no colour value of any kind, so a skin, a custom institution or a future AI bucketing clerk cannot smuggle a hex through a geometry record any more than through a stylesheet.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/townSceneCartography.test.js: the validator walks every string in the block and reds on anything that reads as a raw colour, proved against both a hex literal and an rgb() call, with the same block minus the colour passing.',
      }),
      Object.freeze({
        name: 'geometry_is_integer_and_carries_no_seed',
        description: 'Design section 3 requires integer coordinates on the existing plan grid (the interiors discipline: no float geometry crosses the contract), and the manifest constitutionally carries no seed, which is what makes it safe to hand to a player-facing renderer. The per-building style selector is therefore a bounded TOKEN rather than the styleSeed the design sketch names.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/townSceneCartography.test.js, where a fractional coordinate, an out-of-extent coordinate and a fractional permille each red with a named error.',
      }),
    ]),
    // The declared evidence is not derivable from any supported receipt, and the
    // subsystem cannot run in the harness that writes them at all: a whole-world soak
    // never compiles a TownSceneManifest. Stated as unobserved rather than indirect
    // because indirect would claim an instrumented channel this lane does not have.
    soakEvidence: 'unobserved',
  }),
]);

/**
 * Wave-cohort rule keys that do not yet carry a row. SHRINK-ONLY: an author moves
 * a key from here into WAVE_SUBSYSTEM_ROWS, never the other way. This list is the
 * honest coverage gap, not a permission to skip.
 * @type {ReadonlyArray<string>}
 */
export const WAVE_PENDING_RULE_KEYS = Object.freeze([
  // navalEnabled and peaceEngineEnabled left this list on 2026-07-31. They are
  // AUTHORED, in subsystemRowsWar.js, because both certify as war: peaceCausalActive
  // is literally `warLayerEnabled === true && peaceEngineEnabled === true`, and the
  // naval layer exists to carry armies and throw blockades that mint sieges through
  // the war layer's own interdiction machinery (its activation gate is the spatial
  // marker rather than the war flag, which its row states explicitly). The partition
  // stays exact, so this is a move, never a gap.
  // constructiveFlowsEnabled, momentumEnabled, resourceDynamicsEnabled and
  // supplyWebWarfareEnabled left this list on 2026-07-31. All four are AUTHORED
  // above, in this same lane (the economy and trade cohort). The partition stays
  // exact, so this is a promotion, never a gap.
  // upswingArcsEnabled left this list on 2026-07-31, the LAST wave key to do so. It is
  // AUTHORED, in subsystemRowsGrowth.js, beside the institution lanes and the emergent
  // pressure conditions: the three of them are the estate's upward write traffic and
  // they fail in one direction, so they certify together. The partition stays exact, so
  // this is a move, never a gap, and this lane's coverage gap was empty until TR-1.
  //
  // casusCommerciiEnabled joined this list on 2026-08-04 with FP wave TR-1 and LEFT IT
  // THE SAME DAY, converted to an authored row in subsystemRowsVirtual.js beside the
  // other engine-gated virtual keys. The conversion was forced by the shared law rather
  // than chosen: the wave landed the key in ENGINE_GATED_VIRTUAL_RULE_KEYS, which is
  // what puts a virtual key into the census at all, and the virtual lane's own contract
  // (tests/domain/subsystemRowsVirtual.test.js) then asserts every manifested key
  // carries a row AND appears in no pending list anywhere. "Manifested in the virtual
  // lane, pending in the wave lane" is a shape this partition cannot hold, and the
  // TR architecture's Q4 recommendation (DESIGN_FP_ARCH_TR.md §6, pending until TR-9
  // converts all eight at once) is superseded for any TRADE flag that manifests. The
  // row it now carries declares every aliveness channel DELIBERATELY EMPTY and says why
  // in prose, which is the honest reading for a dark instrument with no mount. The
  // partition stays exact, so this is a move, never a gap — and this lane's coverage
  // gap is empty again.
]);
