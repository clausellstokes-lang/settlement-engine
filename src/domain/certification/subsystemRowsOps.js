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
    title: 'The infiltration ladder — how deep a planted operative is, and what depth costs',
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
      other: 'THE VOLUME DIRECTIVE (DESIGN_W_OPS §6, one of the TWO doors that section charters by name): the infiltration ladder prices how deep a planted operative has gone and what that depth costs him and his patron — L3/L4 placement, the cover object, and the web-seat convergence. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: nothing yet, and that is the honest reading rather than a modest one. The leaf has an EMPTY src importer set, pinned by its own suite over a live tree walk, so lighting the key changes no world byte on any path. WHAT THE MINT BUYS, WHICH IS NOT NOTHING: CENSUS VISIBILITY. CR-WR10-C exists because a subsystem could be built, gated and shipped while the totality walker that demands its certification row could not see the key at all; this leaf was invisible in a THIRD way — built, dark, and UNGATED — so it was not even on the measured backlog. The manifest entry plus this row plus the one gate read end that. WHERE THE GATE LIVES AND WHY NOT IN THE LEAF: the ladder leaf is deliberately gate-free. Its own header states the design verbatim — every door-bearing export takes an explicit `lit` ARGUMENT — and three arms of its suite pin that the leaf names neither `simulationRules` nor a strict `=== true` comparison. The module that RESOLVES `lit` from a world is therefore the espionage family\'s ONE door module, espionageGate.js, which is where infiltrationDepthActive lands. That keeps the leaf pure and injected exactly as its charter says and keeps the estate\'s one-by-name-read-per-key law literal. THE GATE IS A CONJUNCTION AND IT IS MEANT: the ladder deepens ES\'s own rooted dwell (the leaf extends espionageMath#dwellRamp and espionageGauntlet#gatherOrGovernRead), so a lit ladder over a dark espionage layer would be a depth reading on missions that cannot exist. W-OPS §2 says it in terms: everything in that volume sits behind espionageActive / errandSpineActive / its own doors. WHAT NOTHING CAN SEE, DECLARED: no receipt channel can grade this row, and no soak year can either. The soak builds its rules from the full_simulation spread, which declares no virtual key, so ruleState resolves to unknown and the schema grades UNOBSERVED at its fourth branch. That is the honest verdict for a lane with no caller, and `unobserved` is therefore the row\'s evidence rather than `indirect` — there is no dispositive channel for a later soak to fill, which is precisely the distinction subsystemRowsGrowth.js records. THE OBSERVATION THAT WOULD CLOSE THE GAP: a per-tick census of placement enrollments and depth rungs, which needs a WRITER, and the writer is the wiring car\'s. Until it lands this row is REGRESSION-grade by construction, exactly the disposition SEAT-1 recorded for foreignSeatOf. WHAT THIS CAR DELIBERATELY DOES NOT DO: it wires nothing, it puts the key in NO preset, and it mints no cover-object persistence — F15 records that a standing cover really is new persisted schema and leaves it to the owner. The lane is pinned at tests/domain/infiltrationDepth.test.js.',
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
        description: 'The leaf itself never acquires the read. Its exports take `lit` as an argument by charter, and a gate inside a pure injected leaf would be a second place a world could be consulted — the two-truths shape the estate refuses. The door lives in the family gate module and nowhere else.',
        check: 'Expressible from source and asserted that way in tests/domain/infiltrationDepth.test.js: the leaf carries neither the token `simulationRules` nor a strict `=== true` comparison, each anchored on a token the same scan can see so an unreadable leaf reds instead of certifying.',
      }),
      Object.freeze({
        name: 'lighting_the_ladder_over_a_dark_layer_is_impossible',
        description: 'The door AND-composes with espionageActive, so a config that lit this key alone leaves the ladder dark rather than half-running — the same safe-invalid property ES-0 gives the espionage lighting order.',
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
    title: 'The mission dispatcher — which of a principal\'s needs become capped, seeded operation candidates',
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
      other: 'THE VOLUME DIRECTIVE (DESIGN_W_OPS §6, the FIRST of the two doors that section charters by name, and §3.12 for the grammar it ranks): a principal — a court, a faction, a patron, a cult — accumulates NEEDS, and the dispatcher decides which of them are worth an operation this tick. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: nothing yet, stated plainly rather than modestly. The leaf has an EMPTY src importer set, pinned by its own suite through an IMPORT-SPECIFIER census over a live tree walk, so lighting the key moves no world byte on any path. WHAT THE MINT BUYS: CENSUS VISIBILITY, which is the whole of CR-WR10-C\'s purpose — a subsystem could be built, gated and shipped while the totality walker that demands its certification row could not see the key at all, and this leaf was invisible in a THIRD way, built and dark and UNGATED, so it was not even on the measured backlog. WHERE THE GATE LIVES AND WHY NOT IN THE LEAF: the dispatcher is PURE and INJECTED by charter — it takes the needs, the per-principal cap and the frequency as ARGUMENTS and never reaches for a world — so it has no receiver to gate on, and its own header asks for exactly this mint by name. ⛔ AND THERE IS A SECOND, SHARPER REASON THE LEAF MAY NOT HOLD IT: this file is the ONE admitted importer of the espionage set, and the espionage dormancy fence\'s reachability-chain arm asserts that it names neither the family door module nor the layer flag — the chain terminates because the admitted caller takes only the doctrine vocabulary and the deliberation read. A gate written into the leaf would have broken that chain argument and reddened a fence that is working perfectly. THE GATE IS A CONJUNCTION AND IT IS MEANT: W-OPS §2 says everything in that volume sits behind espionageActive / errandSpineActive / its own doors, and a dispatcher casting covert operations into a world with no espionage layer would be minting work nothing can run. THE CAP IS AN ARGUMENT WITH A DEFAULT, NOT AN AUTHORED KNOB, and the default MIRRORS the errand family\'s MAX_CONCURRENT_ENVOYS rather than importing it, parity-pinned test-side against the live constant so a retune reds instead of drifting. DETERMINISM: survivors are sorted by codepoint on a rename-stable demand id and only then ranked by a keyed hash over (principalId, tick, demandId) — same world, same order, same cut, on every device and in every locale. WHAT NOTHING CAN SEE, DECLARED: no receipt channel can grade this row and no soak year can either. The soak builds its rules from the full_simulation spread, which declares no virtual key, so ruleState resolves to unknown and the schema grades UNOBSERVED at its fourth branch; `unobserved` is therefore the row\'s evidence rather than `indirect`, because there is no dispositive channel for a later soak to fill. THE OBSERVATION THAT WOULD CLOSE THE GAP: a per-principal per-tick census of dispatched candidates, which needs a CONSUMER, and the consumer is the wiring car\'s. WHAT THIS CAR DELIBERATELY DOES NOT DO: it wires nothing, it puts the key in NO preset, and it mints no applier arm — the candidate type word deliberately matches none, so the layer is inert even if a future car miswires it. The lane is pinned at tests/domain/missionDispatcher.test.js.',
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
        description: 'The leaf remains the ONE admitted importer of the espionage set, and it still names neither the family door module nor the layer flag — so no engine entry point reaches the espionage layer through it, and the mint did not buy visibility at the price of reachability.',
        check: 'Expressible from source and asserted that way in tests/property/espionageDormancyFence.test.js, whose reachability-chain arm already carries both negatives and was executed unchanged across this mint.',
      }),
      Object.freeze({
        name: 'no_applier_arm_matches_the_candidate_word',
        description: 'The candidate type the dispatcher composes matches no arm in applyWorldPulse.js, so the layer is inert even if a future car miswires it — the type word is a dead letter until an applier is written on purpose.',
        check: 'Expressible from source and asserted that way in tests/domain/missionDispatcher.test.js, which extracts the applier\'s own arm list from its source and asserts the dispatcher\'s type is not among them, with a non-vacuity guard that the arm list is non-empty.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
]);
