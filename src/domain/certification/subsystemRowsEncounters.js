/**
 * domain/certification/subsystemRowsEncounters.js — THE ENCOUNTERS FAMILY'S
 * CERTIFICATION ROWS.
 *
 * A family leaf rather than a tail row on `subsystemRowsVirtual.js`, on the reason
 * `subsystemRowsSeat.js` and `subsystemRowsLives.js` already record: appending at the
 * tail of the composed export shifts NO existing row, and this family is going to grow —
 * the lighting wave will want a second row and ENC-5 a third if the owner rules the
 * rivalry word. A home costs one file once; three tail edits cost three rebases.
 *
 * ⛔ THE ROW, THE MANIFEST MEMBER AND THE FIRST BY-NAME GATE READ ARE ONE COMMIT, by
 * standing law (ODQ §49 ruling 3, CR-WR10-C item 4). `engineGatedRuleKeys.walker` proves
 * the manifest against the tree in BOTH directions, so a member added without its gate
 * read reds direction 1 and a gate read added without its member reds direction 2.
 *
 * @see docs/DESIGN_ENCOUNTERS.md §7.1
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js,
 *   tests/property/chanceEncountersDormancyFence.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The ENCOUNTERS family's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const ENCOUNTERS_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'chanceEncountersEnabled',
    title: 'Chance meetings between named people across settlements',
    module: 'src/domain/worldPulse/envoyChanceMeeting.js,src/domain/worldPulse/envoyChanceMeetingLedger.js,src/domain/worldPulse/envoyChanceMeetingStage.js',
    aliveness: Object.freeze({
      // ⛔ DELIBERATELY EMPTY, AND IT MUST BE. `tests/domain/subsystemRowsVirtual.test.js`
      // traces every leaf named in `LANE_LEAVES[rule]` for `candidateType: '...'` literals
      // and asserts DECLARED == SEPARABLE — so for a lane that mints no candidate, the
      // empty set on BOTH sides is the only value that greens. A chance meeting persists
      // no candidate row at all: it deposits into two one-tick/TTL ledgers that other
      // writers consume, and its public beats ride a Herald `kind`, never a
      // `candidateType`. Declaring the two Herald kinds here would red the very test this
      // row is priced against (the HB-2 precedent).
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and a commitment rather than an omission: this train mints
      // ZERO news kinds. The two public beats (a meeting that left a mark; an approach
      // refused and spoken of) are chartered to ENC-4, which pays the full pool, annex and
      // routing bill for them. Declaring a mover family here would grade this row ALIVE
      // off a beat no lane has yet minted — the recorded moverFamily hazard.
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([
        'spatialLedgers.meetingMarkEvents',
        'spatialLedgers.meetingLeanChannels',
      ]),
      other: 'THE OWNER DIRECTIVE (ODQ §881.10 to §881.13): chance meetings between named NPCs across settlements, with four outcome families in any combination: nothing, a mark, a lesson, or a compromise, and never a defection. WHAT THE FLAG LIGHTS, EXACTLY ONE THING AT THIS CAR: the meeting STAGE inside advanceEnvoyDiplomacyPulse, mounted after the parlay stage and before the errand advance so it reads the same pre-mutation cut the army stages read. With the key dark the stage returns its input state and the census never runs. THE GATE IS ONE STRICT BY-NAME READ at exactly one site, chanceEncountersActive in envoyChanceMeetingStage.js, and the polarity census in the dormancy fence pins that count at one and refuses loose truthiness. THE KEY IS VIRTUAL: absent from DEFAULT_SIMULATION_RULES and from every preset spread, so it is false everywhere by ABSENCE until the lighting wave declares its shift in every preset including the default (§881.4). WHAT IT WRITES AND WHAT IT DOES NOT: it DEPOSITS into two new sub-ledgers under the spatial namespace and writes nothing else. The ladder kernel remains the only writer of a mark, the corruption web the only writer of a leash, the lived-experience funnel the only mover of a soul, and applyRelationshipPatch the only writer of the relationship plane. No errand row changes, no person dies, moves, marries or changes sides. THREE DOORS ON EVERY MARK, and each is the CONSUMER own flag re-read at the deposit site so a dark consumer means no key at all rather than an orphaned one: chanceEncountersEnabled and npcLadderEnabled and memoryWeaveEnabled for a mark, chanceEncountersEnabled and corruptionWebEnabled for a lean, and the funnel own door for a lesson. THE DROP PASS RUNS ABOVE BOTH GATES AND THAT IS THE P-7 CURE WIDENED: the one-tick mark ledger drop and the lean TTL prune are called by envoyPulse.js as its FIRST act, above its own envoyDiplomacyActive early return, because that return sits ABOVE the stage mount, so a world that lit the feature and then darkened EITHER key drops its stale deposits on the next pulse instead of carrying them forever, and the spatial namespace can still drain. A never-lit world has no prior and the call is byte-identical. THE LEASH A COMPROMISE CAN LEAD TO IS FENCED IN THREE PLACES (ENC-2, owner row 5b): a meeting-born leash is marked willed in the leash own conspiracy slot, the organic exposure lane skips it so the man is never demoted, never ousted, never replaced by a generated successor, compromiseSourceOf never reads it as rival_power so turncoat is ineligible by construction, and the cause pass is not opened. That is what makes never a defection an engineered property rather than an assertion. EVERY CHANCE IS AN INTEGER NUMBER OF EIGHTHS drawn from a keyed hash over the tick stream seed, never a PRNG fork, so no later stream moves; every receipt carries words and integers only and a float in a receipt is a build STOP. THE TUNING IS UNSIGNED: CHANCE_MEETING_TUNING in the leaf and CHANCE_MEETING_STAGE_TUNING in the stage are both CANDIDATE, OWNER-UNSIGNED under §12 row 7, signed LAST at the tuning sitting. WHAT THIS CAR SHIPS UNREACHED, DECLARED: the Herald beats. The stage produces a typed seed per visible outcome carrying the full address chain: both courts, both names, the venue and a beat word, and calls an injected builder; ENC-4 owns the builder, the two kinds and their pools, and is BLOCKED until the owner writes the sentences at the voice sitting, because the pool floors demand six and four variants and the design spells three. So the lit stage today deposits, teaches and files a grievance, and speaks no line. The lane is pinned at tests/domain/envoyChanceMeetingStage.test.js and tests/property/chanceEncountersDormancyFence.test.js.',
    }),
    // A meeting needs a named traveller STANDING at a foreign court on the tick he
    // arrived, and then must pass a 3-of-8 die. The design's own predicted rate is a
    // meeting on 0.375 of foreign stops and a mark on roughly 0.28 of them — many ticks
    // of a campaign produce none at all.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical',
        description: 'THE PROMISE. With the key absent, or present as false, or as any truthy non-true value, a seeded world advanced ten ticks with envoys in transit, a covert dwell, a lit ladder and a lit weave serializes byte-for-byte as it does without this feature, and its `spatialLedgers` key set is unchanged. The strict `=== true` read is what makes the truthy cases identical to the absent one rather than merely close.',
        check: 'Expressible from state and asserted that way in tests/property/chanceEncountersDormancyFence.test.js FENCE 1: per-tick sha256 over JSON.stringify(worldState) against hashes measured at this car\'s PARENT commit and stored, never a same-tree call comparing the feature to itself (the ES-1-R4 repair). FENCE 2 drives the four truthy-refusal spellings; FENCE 3 is a pass-through spy on resolveChanceMeeting asserting ZERO calls dark and more than zero lit.',
      }),
      Object.freeze({
        name: 'the_flag_has_exactly_one_gate_read',
        description: 'The key is read by name, strictly against `true`, at exactly ONE site in src/: `chanceEncountersActive` in the stage. There is no loose-truthiness read anywhere, the key appears in `simulationRules.js` ONLY as its manifest member, and it is in no preset spread and not in DEFAULT_SIMULATION_RULES.',
        check: 'Expressible from source and asserted that way in FENCE 4, the polarity census, over the shared `codeOnly` strip so a name written in a comment or a receipt string is never miscounted as a use.',
      }),
      Object.freeze({
        name: 'no_errand_row_changes',
        description: 'The stage spends no errand transition. Every errand row it reads comes from the pulse\'s pre-mutation cut and every row it hands back is JSON-identical to the row it received, so the one-transition-per-tick law the army stages depend on is untouched and an errand the army census already moved is never also met on.',
        check: 'Expressible from state and asserted that way in tests/domain/envoyChanceMeetingStage.test.js: the stage\'s output `envoyErrands` is JSON-identical to its input over a lit two-envoy fixture that produces a meeting.',
      }),
      Object.freeze({
        name: 'one_meeting_per_person_per_tick',
        description: 'The select is greedy over a deterministic census order and takes a candidate only if NEITHER party is already spoken for this tick, so a person meets at most one person per tick on either arm. A traveller-traveller meeting outranks a traveller-resident one because two foreign notables in one hall is the rarer and more consequential event.',
        check: 'Expressible from the returned receipts and asserted that way in tests/domain/envoyChanceMeeting.test.js (the leaf\'s own select pins) and again end-to-end in the stage test: over a fixture with two travellers and a shared host, no npc id appears in two receipts of one tick.',
      }),
      Object.freeze({
        name: 'deposit_consumed_once',
        description: 'A mark deposit is consumed exactly once. The ledger lives ONE tick and `readMeetingMarkEvents` additionally filters `depositTick === now`, so a replayed, restored or undone-then-redone tick cannot mint the same bond twice: the one-tick life is the first guard and the strict tick filter is the double.',
        check: 'Expressible from state and asserted that way in tests/domain/envoyChanceMeetingLedger.test.js (ENC-2), and end-to-end here: a deposit written at tick t is ignored by an advance at t+1 and the key is gone by the pass after it.',
      }),
      Object.freeze({
        name: 'willed_leash_never_ousts',
        description: 'STATE, NEVER FATE, for the one outcome wide enough to threaten it. A compromise deposits a LEAN the corruption web may or may not recruit through; if it does, the leash it mints is marked willed, and three fences keep that man in his own life: the organic exposure lane skips him so he is never demoted, never ousted and never replaced by a generated successor, `compromiseSourceOf` never reads his leash as `rival_power` so the `turncoat` verdict is ineligible by construction, and the cause pass is never opened on him.',
        check: 'Expressible from state and asserted that way in tests/domain/corruptionWebPins.test.js (ENC-2) with plant P6: reverting the exposure-lane skip ousts a willed magistrate and puts a `turncoat` verdict in a seed family, which is what convicts the fence rather than merely exercising it.',
      }),
    ]),
    // The soak builds its rules from the full_simulation spread, which declares no virtual
    // key (MEASURED: the key is in 0 of the 7 presets and not in DEFAULT_SIMULATION_RULES),
    // so this row cannot be graded ALIVE from a soak year until the lighting wave puts the
    // key in a preset. The observation window is E5's, and the lit arm's rates are §7.4's.
    //
    // ⛔ AND THAT IS `indirect`, NOT `unobserved` — CORRECTED AT THE ENC-3 LANDING, on the
    // distinction subsystemRowsGrowth.js already wrote down and this row got wrong:
    // "`unobserved` is the row telling the evaluator to downgrade its own zero readings,
    // which is the escape hatch the corpus guard ceilings; `indirect` says the soak simply
    // has not run against the instrument yet, and lets the SCHEMA decide". This row DOES
    // declare a dispositive channel — the two stateKeys above — so `unobserved` was the
    // escape hatch taken by a row that did not need it, and it took the last seat under the
    // corpus guard's ceiling of five. The schema decides correctly without it: the soak's
    // rules carry no boolean for this key, so `ruleState` resolves to `unknown` and
    // `evaluateSubsystemCertification` grades UNOBSERVED at its fourth branch anyway.
    //
    // ⚠ THE DIFFERENCE IS NOT COSMETIC, AND IT ARMS ON THE LIGHTING WAVE. The moment a
    // preset carries the key, `ruleState` becomes `on`; with `unobserved` this row would
    // then downgrade a REAL SILENT — a lit lane depositing nothing — into an instrument
    // gap, silently, forever. With `indirect` that same world grades SILENT and the finding
    // surfaces. The corpus guard was convicting a live time bomb, not counting wrong.
    soakEvidence: 'indirect',
  }),
]);
