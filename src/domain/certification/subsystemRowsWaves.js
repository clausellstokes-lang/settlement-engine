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
  // this is a move, never a gap, and this lane's coverage gap is now empty.
]);
