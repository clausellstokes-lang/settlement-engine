/**
 * domain/certification/subsystemRowsOps.js — THE W-OPS FAMILY'S CERTIFICATION
 * ROWS. EMPTY ON PURPOSE, on the `subsystemRowsLives.js` model.
 *
 * A reserved SLOT rather than a behaviour: the address a W-OPS virtual key
 * registers its row at, so the car that lands one adds a row to an existing leaf
 * instead of authoring a file at a landing (ODQ §868's refusal, discharged here).
 *
 * ── THE KEYS THIS LEAF IS WAITING FOR ──────────────────────────────────────
 *
 * `docs/DESIGN_W_OPS.md` §6: "Doors: the inherited ES/errand stack +
 * `missionDispatcherEnabled` and `infiltrationDepthEnabled` (virtual, dark by
 * default, lit in full simulation). Dark ⇒ zero keys written ⇒ byte-identical."
 *
 * ⭐ ONE OF THE TWO IS NOW BUILT-AND-DARK, measured at this landing rather than
 * assumed: `src/domain/worldPulse/operations/missionDispatcher.js` exists (W-OPS
 * O1), names `missionDispatcherEnabled` as its door in its own header, and is
 * pinned to an EMPTY src importer set by `tests/domain/missionDispatcher.test.js`
 * — so its home is reserved against a landed seam, not only a chartered design.
 * `infiltrationDepthEnabled` is still design-only, and for it this leaf is the
 * chartered-design case the tail slot exists for.
 *
 * ⚠ THE ANCESTOR ROW STAYS WHERE IT IS, DELIBERATELY. W-OPS joins the ES charter
 * "by EXTENSION rather than collision", the mission dispatcher is named as "ES's
 * deliberately-deferred piece designed", and `infiltrationDepthEnabled` deepens
 * ES's own ladder — so the ESPIONAGE row is this family's ancestor and a tidier
 * decomposition would have moved it here. It is NOT moved: that row sits at index
 * 1 of `VIRTUAL_SUBSYSTEM_ROWS`, its position is a certification output under the
 * ordered-equality pin, and a leaf holding it would be a leaf that cannot grow
 * without shifting twenty-six rows. Family tidiness is not worth a reorder nobody
 * asked for. The ancestry is recorded here instead, where the next reader of this
 * leaf will find it.
 *
 * ⚠ AND THE KEY IS DELIBERATELY NOT SPELLED IN THE LINE ABOVE. The espionage key
 * carries twenty-odd dormancy fences, several of which assert an EXACT SET or an
 * EXACT COUNT of the src files that name it; a header that spelled it here would
 * enrol this leaf in every one of them and red a fence that is working perfectly.
 * That is the string-presence hazard ODQ §843 recorded for this very lane — a
 * mention scan cannot tell prose from a gate — and the cheapest cure is to not
 * write the token. The same restraint is why nothing here spells a REGISTERED key.
 *
 * TO LAND A W-OPS ROW: author it into the array below, add its key to
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` and its first by-name `=== true` gate read in
 * the SAME commit (ODQ §49 ruling 3, CR-WR10-C item 4), then pay the three
 * module-scope edits in `tests/domain/subsystemRowsVirtual.test.js`. ⭐ Appending
 * here shifts NO existing row.
 *
 * ⛔ IT DELIBERATELY DOES NOT JOIN `subsystemCertification.js`'s import list.
 * Spreading an empty frozen array is a no-op, so this leaf is provably
 * byte-neutral to every certification output until its first row lands.
 *
 * @see docs/DESIGN_W_OPS.md §6
 * @see docs/OWNER_DECISION_QUEUE.md §868, §870.4
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The W-OPS family's authored rows. EMPTY until the volume's first virtual door
 * lands its key, its gate read and its row in one commit.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const OPS_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'infiltrationDepthEnabled',
    title: 'The infiltration ladder: how deep a planted operative is, and what depth costs',
    module: 'src/domain/worldPulse/espionage/infiltrationDepth.js,src/domain/worldPulse/espionage/espionageGate.js',
    aliveness: Object.freeze({
      // ⛔ DELIBERATELY EMPTY, AND THE ONLY VALUE THAT CAN BE HONEST HERE.
      // `tests/domain/subsystemRowsVirtual.test.js` traces every leaf named in
      // `LANE_LEAVES[rule]` for `candidateType: '...'` literals and asserts
      // DECLARED == SEPARABLE; the ladder leaf mints no candidate at all (measured:
      // zero occurrences of the token in either module), so the empty set on BOTH
      // sides is the only green — and it is also the truth.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and a commitment rather than an omission: this car mints
      // ZERO news kinds. The going-native arc and the exposure beats are W-OPS car 7's
      // (the voice car, Fable seat), and declaring a mover family here would grade this
      // row ALIVE off a beat no lane has minted — the recorded moverFamily hazard.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY: the leaf is PURE and writes NOTHING. Every door-bearing
      // export takes an explicit `lit` argument and returns `null` when it is anything
      // but `true`, so a lit world with no caller still persists not one key. A
      // stateKey declared here would be a channel the tree cannot fill.
      stateKeys: Object.freeze([]),
      other: 'THE VOLUME DIRECTIVE (DESIGN_W_OPS §6, one of the TWO doors that section charters by name): the infiltration ladder prices how deep a planted operative has gone and what that depth costs him and his patron: L3/L4 placement, the cover object, and the web-seat convergence. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: nothing yet, and that is the honest reading rather than a modest one. The leaf has an EMPTY src importer set, pinned by its own suite over a live tree walk, so lighting the key changes no world byte on any path. WHAT THE MINT BUYS, WHICH IS NOT NOTHING: CENSUS VISIBILITY. CR-WR10-C exists because a subsystem could be built, gated and shipped while the totality walker that demands its certification row could not see the key at all; this leaf was invisible in a THIRD way: built, dark, and UNGATED: so it was not even on the measured backlog. The manifest entry plus this row plus the one gate read end that. WHERE THE GATE LIVES AND WHY NOT IN THE LEAF: the ladder leaf is deliberately gate-free. Its own header states the design verbatim: every door-bearing export takes an explicit `lit` ARGUMENT: and three arms of its suite pin that the leaf names neither `simulationRules` nor a strict `=== true` comparison. The module that RESOLVES `lit` from a world is therefore the espionage family\'s ONE door module, espionageGate.js, which is where infiltrationDepthActive lands. That keeps the leaf pure and injected exactly as its charter says and keeps the estate\'s one-by-name-read-per-key law literal. THE GATE IS A CONJUNCTION AND IT IS MEANT: the ladder deepens ES\'s own rooted dwell (the leaf extends espionageMath#dwellRamp and espionageGauntlet#gatherOrGovernRead), so a lit ladder over a dark espionage layer would be a depth reading on missions that cannot exist. W-OPS §2 says it in terms: everything in that volume sits behind espionageActive / errandSpineActive / its own doors. WHAT NOTHING CAN SEE, DECLARED: no receipt channel can grade this row, and no soak year can either. The soak builds its rules from the full_simulation spread, which declares no virtual key, so ruleState resolves to unknown and the schema grades UNOBSERVED at its fourth branch. That is the honest verdict for a lane with no caller, and `unobserved` is therefore the row\'s evidence rather than `indirect`: there is no dispositive channel for a later soak to fill, which is precisely the distinction subsystemRowsGrowth.js records. THE OBSERVATION THAT WOULD CLOSE THE GAP: a per-tick census of placement enrollments and depth rungs, which needs a WRITER, and the writer is the wiring car\'s. Until it lands this row is REGRESSION-grade by construction, exactly the disposition SEAT-1 recorded for foreignSeatOf. WHAT THIS CAR DELIBERATELY DOES NOT DO: it wires nothing, it puts the key in NO preset, and it mints no cover-object persistence: F15 records that a standing cover really is new persisted schema and leaves it to the owner. The lane is pinned at tests/domain/infiltrationDepth.test.js.',
    }),
    // No caller, so no cadence: the ladder re-vets on a dwell ramp whose plateau is
    // measured in periods, not ticks, and a lit world with a writer would still see a
    // rung change rarely. `rare` is the tempo the ramp's own shape implies.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_zero_keys_written',
        description: 'THE PROMISE, in the volume\'s own words (§6): dark ⇒ zero keys written ⇒ byte-identical. Every door-bearing export in the ladder leaf takes an explicit `lit` argument and returns `null` when it is anything but `true`, so absent, false and every truthy non-true value are the same world.',
        check: 'Expressible from source and from state, and asserted both ways in tests/domain/infiltrationDepth.test.js: the leaf-purity arms drive placementEnrollment with lit false and assert a null read, and the door arm below drives infiltrationDepthActive through the four truthy-refusal spellings.',
      }),
      Object.freeze({
        name: 'the_flag_has_exactly_one_gate_read',
        description: 'The key is read by name, strictly against `true`, at exactly ONE site in src/: infiltrationDepthActive in espionage/espionageGate.js. There is no loose-truthiness read anywhere, the key appears in simulationRules.js ONLY as its manifest member, and it is in no preset spread and not in DEFAULT_SIMULATION_RULES.',
        check: 'Expressible from source and asserted that way in tests/domain/infiltrationDepth.test.js, the polarity census, over a comment-stripped source strip so a name written in a comment or a receipt string is never miscounted as a use.',
      }),
      Object.freeze({
        name: 'the_ladder_leaf_stays_gate_free',
        description: 'The leaf itself never acquires the read. Its exports take `lit` as an argument by charter, and a gate inside a pure injected leaf would be a second place a world could be consulted: the two-truths shape the estate refuses. The door lives in the family gate module and nowhere else.',
        check: 'Expressible from source and asserted that way in tests/domain/infiltrationDepth.test.js: the leaf carries neither the token `simulationRules` nor a strict `=== true` comparison, each anchored on a token the same scan can see so an unreadable leaf reds instead of certifying.',
      }),
      Object.freeze({
        name: 'lighting_the_ladder_over_a_dark_layer_is_impossible',
        description: 'The door AND-composes with espionageActive, so a config that lit this key alone leaves the ladder dark rather than half-running: the same safe-invalid property ES-0 gives the espionage lighting order.',
        check: 'Expressible from state and asserted that way in tests/domain/infiltrationDepth.test.js: the door is driven with the ladder key lit and the espionage conjunction broken at each of its three doors in turn, and reads false every time.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly — the
    // contributionLedgerEnabled disposition, which is this row's nearest precedent: a
    // built, dark, caller-less lane whose flags exist for the module that reads them.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'missionDispatcherEnabled',
    title: 'The mission dispatcher: which of a principal\'s needs become capped, seeded operation candidates',
    module: 'src/domain/worldPulse/operations/missionDispatcher.js,src/domain/worldPulse/espionage/espionageGate.js',
    aliveness: Object.freeze({
      // ⛔ DELIBERATELY EMPTY, AND THE ONLY HONEST VALUE — but for a DIFFERENT reason than
      // its sibling row above, and the difference is recorded rather than smoothed. This
      // leaf DOES compose a `candidateType`, as a TEMPLATE family (`operation_${...}`),
      // and `applyWorldPulse.js` carries NO arm that matches it — pinned by the leaf's own
      // suite. A candidate no applier mints never reaches a receipt, so an eventTypes
      // entry here would be a channel the instrument can never fill. The trace in
      // tests/domain/subsystemRowsVirtual.test.js records the template lane by name so the
      // waiver is reviewable and self-invalidating.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: this car mints ZERO news kinds. The mission beats are W-OPS
      // car 7's, the voice car, and grading this row ALIVE off a beat no lane has minted
      // is the recorded moverFamily hazard.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY: the leaf writes nothing. It is a pure ranking function over
      // injected needs and returns frozen candidate descriptors to a caller that does not
      // exist; no `setSpatialLedger` call, no persisted key, on any path.
      stateKeys: Object.freeze([]),
      other: 'THE VOLUME DIRECTIVE (DESIGN_W_OPS §6, the FIRST of the two doors that section charters by name, and §3.12 for the grammar it ranks): a principal: a court, a faction, a patron, a cult: accumulates NEEDS, and the dispatcher decides which of them are worth an operation this tick. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: nothing yet, stated plainly rather than modestly. The leaf has an EMPTY src importer set, pinned by its own suite through an IMPORT-SPECIFIER census over a live tree walk, so lighting the key moves no world byte on any path. WHAT THE MINT BUYS: CENSUS VISIBILITY, which is the whole of CR-WR10-C\'s purpose: a subsystem could be built, gated and shipped while the totality walker that demands its certification row could not see the key at all, and this leaf was invisible in a THIRD way, built and dark and UNGATED, so it was not even on the measured backlog. WHERE THE GATE LIVES AND WHY NOT IN THE LEAF: the dispatcher is PURE and INJECTED by charter: it takes the needs, the per-principal cap and the frequency as ARGUMENTS and never reaches for a world: so it has no receiver to gate on, and its own header asks for exactly this mint by name. ⛔ AND THERE IS A SECOND, SHARPER REASON THE LEAF MAY NOT HOLD IT: this file is the ONE admitted importer of the espionage set, and the espionage dormancy fence\'s reachability-chain arm asserts that it names neither the family door module nor the layer flag: the chain terminates because the admitted caller takes only the doctrine vocabulary and the deliberation read. A gate written into the leaf would have broken that chain argument and reddened a fence that is working perfectly. THE GATE IS A CONJUNCTION AND IT IS MEANT: W-OPS §2 says everything in that volume sits behind espionageActive / errandSpineActive / its own doors, and a dispatcher casting covert operations into a world with no espionage layer would be minting work nothing can run. THE CAP IS AN ARGUMENT WITH A DEFAULT, NOT AN AUTHORED KNOB, and the default MIRRORS the errand family\'s MAX_CONCURRENT_ENVOYS rather than importing it, parity-pinned test-side against the live constant so a retune reds instead of drifting. DETERMINISM: survivors are sorted by codepoint on a rename-stable demand id and only then ranked by a keyed hash over (principalId, tick, demandId): same world, same order, same cut, on every device and in every locale. WHAT NOTHING CAN SEE, DECLARED: no receipt channel can grade this row and no soak year can either. The soak builds its rules from the full_simulation spread, which declares no virtual key, so ruleState resolves to unknown and the schema grades UNOBSERVED at its fourth branch; `unobserved` is therefore the row\'s evidence rather than `indirect`, because there is no dispositive channel for a later soak to fill. THE OBSERVATION THAT WOULD CLOSE THE GAP: a per-principal per-tick census of dispatched candidates, which needs a CONSUMER, and the consumer is the wiring car\'s. WHAT THIS CAR DELIBERATELY DOES NOT DO: it wires nothing, it puts the key in NO preset, and it mints no applier arm: the candidate type word deliberately matches none, so the layer is inert even if a future car miswires it. The lane is pinned at tests/domain/missionDispatcher.test.js.',
    }),
    // Need-driven and capped per principal per tick: even a lit world with a consumer
    // produces operations only when a principal's needs clear the doors, which the leaf's
    // own four-door walk makes uncommon rather than steady.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_zero_keys_written',
        description: 'THE PROMISE, in the volume\'s own words (§6): dark ⇒ zero keys written ⇒ byte-identical. The leaf is a pure function returning frozen descriptors, and with the door shut nothing calls it at all.',
        check: 'Expressible from source and from state, and asserted both ways in tests/domain/missionDispatcher.test.js: the import-specifier census proves no src caller exists, and the door arm drives missionDispatcherActive through the four truthy-refusal spellings.',
      }),
      Object.freeze({
        name: 'the_flag_has_exactly_one_gate_read',
        description: 'The key is read by name, strictly against `true`, at exactly ONE site in src/: missionDispatcherActive in the espionage family door module. There is no loose-truthiness read anywhere, the key appears in simulationRules.js ONLY as its manifest member, and it is in no preset spread and not in DEFAULT_SIMULATION_RULES.',
        check: 'Expressible from source and asserted that way in tests/domain/missionDispatcher.test.js, the polarity census, which counts COMPARISONS rather than names so the manifest member and this row\'s own `rule` field are never miscounted as uses.',
      }),
      Object.freeze({
        name: 'the_reachability_chain_still_terminates',
        description: 'The leaf remains the ONE admitted importer of the espionage set, and it still names neither the family door module nor the layer flag: so no engine entry point reaches the espionage layer through it, and the mint did not buy visibility at the price of reachability.',
        check: 'Expressible from source and asserted that way in tests/property/espionageDormancyFence.test.js, whose reachability-chain arm already carries both negatives and was executed unchanged across this mint.',
      }),
      Object.freeze({
        name: 'no_applier_arm_matches_the_candidate_word',
        description: 'The candidate type the dispatcher composes matches no arm in applyWorldPulse.js, so the layer is inert even if a future car miswires it: the type word is a dead letter until an applier is written on purpose.',
        check: 'Expressible from source and asserted that way in tests/domain/missionDispatcher.test.js, which extracts the applier\'s own arm list from its source and asserts the dispatcher\'s type is not among them, with a non-vacuity guard that the arm list is non-empty.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'operationsVoiceEnabled',
    title: 'The operations voice: the sentences a covert receipt is allowed to become',
    module: 'src/domain/worldPulse/espionage/operationsVoice.js,src/domain/worldPulse/espionage/espionageGate.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: a voice leaf mints no candidate. It composes lines from
      // receipts other subsystems already produced, and the trace over its leaves finds
      // no `candidateType` at all.
      eventTypes: Object.freeze([]),
      // ⛔ DELIBERATELY EMPTY, AND THIS IS THE ROW WHERE THE TEMPTATION IS REAL. A VOICE
      // lane looks like it should declare a mover family, and it must not: the leaf is
      // routed NOWHERE — the feed envelope and desk registration belong to the wiring car
      // — so declaring a family would grade this row ALIVE off another lane's beats. That
      // is the recorded moverFamily hazard in its purest form.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY: the leaf writes nothing and reaches nothing. Every quantity it
      // needs arrives as an argument, pinned by its own suite over the leaf's logic.
      stateKeys: Object.freeze([]),
      other: 'THE LEAF\'S OWN PROVENANCE ROW, which is what charters this key rather than DESIGN_W_OPS §6: and the difference is recorded rather than smoothed: §6 names TWO doors by name, the ladder and the dispatcher, and this is a THIRD that the voice leaf declares for itself. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: nothing. The leaf\'s own `consumers` field says NONE by design, and no src module names it; the feed envelope and the desk registration belong to the wiring car, and until that lands nothing here is routed anywhere. WHAT THE MINT BUYS: CENSUS VISIBILITY: a built, dark, UNGATED voice surface was invisible to the totality walker that demands its certification row, and was not even on the measured backlog because it was not gated either. WHERE THE GATE LIVES AND WHY NOT IN THE LEAF: the leaf\'s suite pins that its LOGIC: its source with comments stripped and string literals blanked: carries no `Enabled` token at all, anchored on its provenance constant so an unreadable leaf reds rather than certifying. The door is deliberately an ADDRESS there and a GATE only in the espionage family door module. THE CONJUNCTION IS THE LEAF\'S OWN SENTENCE, quoted from its provenance: beneath this door every surface inherits the doors of the subsystem whose receipts it voices. So the gate AND-composes with the espionage layer rather than standing alone: a voice with more life than the receipts it reads would be speaking about missions that never ran. WHAT IS UNSIGNED, AND IT IS THE MAJORITY OF THE LEAF: every line and every reason in it is CANDIDATE, OWNER-UNSIGNED. The going-native reversal line is deliberately UNWRITTEN, and writing it is a ruling on the unsigned reversal fork rather than a prose edit. The audience split: mission beats and the long watch to the principal, exposure moments to the town: is a recorded vetoable judgment. The four storied refusals are voiced and the three machine refusals are not, and whether a malformed or unpriced operation ever deserves a sentence is the pen\'s call. FAITH IS CULTURE AND NEVER THEOLOGY, and no named person\'s fate is written here: the leaf voices STATE. WHAT NOTHING CAN SEE, DECLARED: no receipt channel grades this row and no soak year can. The soak\'s rules come from the full_simulation spread, which declares no virtual key, so ruleState resolves to unknown and the schema grades UNOBSERVED; `unobserved` is the honest evidence rather than `indirect`, because there is no dispositive channel for a later soak to fill. THE OBSERVATION THAT WOULD CLOSE THE GAP: a census of routed lines per mission outcome, which needs a FEED, and the feed is the wiring car\'s. The lane is pinned at tests/domain/operationsVoice.test.js.',
    }),
    // A voice speaks when a receipt occurs, and no receipt occurs: reactive is the shape
    // the leaf has even before it has a caller.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_silence_and_zero_keys',
        description: 'THE PROMISE. With the door shut the leaf is not called, composes no line, and writes nothing: it has no writer of any kind, so darkness costs a campaign not one byte and speaks not one sentence.',
        check: 'Expressible from source and from state, and asserted both ways in tests/domain/operationsVoice.test.js: the namer census proves no src caller exists, and the door arm drives operationsVoiceActive through the four truthy-refusal spellings.',
      }),
      Object.freeze({
        name: 'the_flag_has_exactly_one_gate_read',
        description: 'The key is read by name, strictly against `true`, at exactly ONE site in src/: operationsVoiceActive in the espionage family door module. The leaf itself names the key in a provenance STRING and never in code, which is the distinction its own logic-scan arm exists to hold.',
        check: 'Expressible from source and asserted that way in tests/domain/operationsVoice.test.js, the polarity census, which counts COMPARISONS rather than names so the provenance string and the manifest member are never miscounted as uses.',
      }),
      Object.freeze({
        name: 'the_voice_never_outlives_the_receipts_it_reads',
        description: 'The door AND-composes with the espionage layer, so a config that lit the voice alone leaves it silent rather than speaking about missions that never ran: the leaf\'s own inheritance sentence, made executable.',
        check: 'Expressible from state and asserted that way in tests/domain/operationsVoice.test.js: the door is driven with the voice key lit and the espionage conjunction broken at each of its three doors in turn, and reads false every time, against a non-vacuity control where all three are open.',
      }),
      Object.freeze({
        name: 'every_line_is_unsigned_and_says_so',
        description: 'THE PEN\'S, NOT THE LANE\'S. The provenance carries `signedBy: null` and five owner rows naming exactly what is still the pen\'s: the words, the deliberately unwritten reversal line, the audience split, the span words, and whether the machine refusals deserve a sentence at all. Minting the door signs nothing.',
        check: 'Expressible from source and asserted that way in tests/domain/operationsVoice.test.js, which reads the provenance constant and holds both the null signature and the owner-row roster.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'envoyTaskCatalogEnabled',
    title: 'The envoy task catalog: what a court may send somebody to do, and how they may ask',
    module: 'src/domain/worldPulse/envoyTaskCatalog.js,src/domain/worldPulse/errandMint.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: a vocabulary-and-fit table mints no candidate, and the trace
      // over its leaves finds no `candidateType` in either.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: this car mints ZERO news kinds. The negotiation beats belong
      // to the wiring car, and grading this row ALIVE off a beat no lane has minted is the
      // recorded moverFamily hazard.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY: the leaf writes nothing and imports exactly one sibling
      // vocabulary module. Every quantity it needs — the counterpart nerve, the envoy
      // chart — arrives as an argument, pinned by its own suite.
      stateKeys: Object.freeze([]),
      other: 'THE LEAF\'S OWN PROVENANCE ROW, and the volume\'s §8 car 4 ("envoy task catalog + negotiation method menus"). WHAT IT IS: the closed vocabulary of what a court may send a named person to DO: eight candidate task rows, four admitted: together with the four negotiation METHODS and how each fits a counterpart\'s nerve. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: nothing. No src module imports the leaf; its `consumers` field says NONE, and the darkness is pinned by a real planted importer in the battery rather than by a grep that could pass by finding nothing. WHAT THE MINT BUYS: CENSUS VISIBILITY: the leaf was built, dark AND ungated, so it was invisible to the totality walker that demands its certification row and was not even on the measured backlog. WHERE THE GATE LIVES AND WHY NOT IN THE LEAF: an arm of the leaf\'s own suite asserts it contains no strict comparison on this key at all, because the catalog is a pure table whose exports take their inputs as ARGUMENTS; the module that resolves the key from a world is the ERRAND family\'s door home, beside the spine\'s own gate. ⛔ AND THE CONJUNCTION IS THE SPINE, NOT THE ESPIONAGE LAYER: a deliberate divergence from this leaf\'s three sibling rows. The catalog\'s tasks and methods are things a NAMED PERSON ON THE ROAD does, so they ride SP-D\'s generalized errand row exactly as every other purposeful-travel surface does; an errand is not a covert mission, and gating a diplomatic menu on espionage would have made half a court\'s business hostage to a layer it has nothing to do with. WHAT IS UNSIGNED, AND IT IS MOST OF THE TABLE: the status is CANDIDATE, OWNER-UNSIGNED. Four rows are receipt-verified rather than taste, but WHICH of them a court may charter, and at what cadence, is the pen\'s. ⛔ AND THE PARKED ROWS ARE DELIBERATELY NOT NAMED IN THIS FILE. Two of the four carry src-wide ABSENCE censuses in the catalog\'s own suite: one asserts its ceremony word appears nowhere else under src/, another the same for its threat word: so spelling either token in a certification row would enrol this leaf in a fence that is working perfectly and red it, which is the string-presence hazard this leaf\'s header records and which this row hit on its first run. The dispositions are therefore cited by SHAPE: the ceremony row is parked for want of any receipt family, and the fork the owner actually holds there is mint-a-standing-family versus cut-the-row; the tribute row is the same fork one place along; and the swap row asks whether a swap deserves a close reason of its own or is honestly two releases. The words themselves live in the catalog\'s provenance, which is their one home. The four method words and their nerve fits are derived from the volume\'s own sentence about threatening cowardly courts; a signed table is the pen\'s. MINTING THE DOOR SIGNS NONE OF IT. WHAT NOTHING CAN SEE, DECLARED: no receipt channel grades this row and no soak year can. The soak\'s rules come from the full_simulation spread, which declares no virtual key, so ruleState resolves to unknown and the schema grades UNOBSERVED; `unobserved` is the honest evidence rather than `indirect`, because there is no dispositive channel for a later soak to fill. THE OBSERVATION THAT WOULD CLOSE THE GAP: a census of errand rows carrying a catalog task kind, which needs a MINT SITE, and the mint site is the wiring car\'s. The lane is pinned at tests/domain/envoyTaskCatalog.test.js.',
    }),
    // A court sends somebody when it has business, not on a schedule: the catalog is
    // consulted at a decision, so `reactive` is its shape even before it has a caller.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_zero_keys_written',
        description: 'THE PROMISE. With the door shut nothing calls the catalog, no errand row gains a task kind, and no byte is written: the leaf has no writer of any kind on any path.',
        check: 'Expressible from source and from state, and asserted both ways in tests/domain/envoyTaskCatalog.test.js: the import-specifier census proves no src caller exists, and the door arm drives envoyTaskCatalogActive through the four truthy-refusal spellings.',
      }),
      Object.freeze({
        name: 'the_flag_has_exactly_one_gate_read',
        description: 'The key is read by name, strictly against `true`, at exactly ONE site in src/: envoyTaskCatalogActive in the errand family door home. The catalog itself carries no such comparison, which is the contract its own no-fork arm holds and which this mint deliberately left standing.',
        check: 'Expressible from source and asserted that way in tests/domain/envoyTaskCatalog.test.js, the polarity census, which counts COMPARISONS rather than names so the manifest member and this row\'s own `rule` field are never miscounted as uses.',
      }),
      Object.freeze({
        name: 'the_door_is_the_spine_and_never_the_espionage_layer',
        description: 'A menu of diplomatic business is gated on the road that carries people to it, not on the covert layer. Lighting the catalog with the spine dark leaves it dark; lighting it with the espionage layer dark does NOT, and that asymmetry is the design rather than an oversight.',
        check: 'Expressible from state and asserted that way in tests/domain/envoyTaskCatalog.test.js: the door is driven with the spine dropped (false) and with the espionage layer absent entirely, and the two arms disagree on purpose.',
      }),
      Object.freeze({
        name: 'minting_the_door_signed_nothing',
        description: 'THE PEN\'S, NOT THE LANE\'S. The provenance carries `signedBy: null` and five owner rows: the ceremony row parked for want of a receipt family, the tribute row\'s twin fork, whether the swap row is a task kind at all, the four method words and their nerve fits, and which rows a court may charter at what cadence. ⛔ CITED BY SHAPE RATHER THAN BY WORD, for the absence-census reason recorded on the aliveness note above. A door is not a signature.',
        check: 'Expressible from source and asserted that way in tests/domain/envoyTaskCatalog.test.js, which reads the provenance constant and holds both the null signature and the owner-row roster.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
]);
