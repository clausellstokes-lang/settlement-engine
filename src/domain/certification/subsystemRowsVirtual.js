/**
 * subsystemRowsVirtual.js — SUBSYSTEM CERTIFICATION ROWS for the ENGINE-GATED
 * VIRTUAL cohort: the dark subsystem layers the census could not see at all until
 * chair ruling CR-WR10-C (2026-08-04) taught it to enumerate them.
 *
 * WHY THESE FOUR ARE ONE LANE RATHER THAN FOUR LANE FILES. The estate's lanes are
 * organised by SUBJECT (war, place, people), and by that rule these keys would
 * scatter across three of them. They are read together anyway, because they share
 * ONE FINDING and it is not a subject: each is gated by the strict
 * `rules.<key> === true` idiom while appearing in NEITHER `DEFAULT_SIMULATION_RULES`
 * NOR any preset override spread, which is the deep-couplings law-1 dormancy idiom
 * — the dark layer that costs a campaign zero persisted bytes. `simulationRuleKeys()`
 * read exactly those two surfaces, so for as long as the idiom has existed, a
 * subsystem could enter the engine, be gated, be shipped, and never be asked
 * whether it does anything. That is the exact class
 * tests/lint/subsystemCertificationTotality.walker.test.js exists to remove, and
 * these four were standing inside its blind spot. The rows belong together because
 * the next reader's question about all four is the same question.
 *
 * CONSEQUENCE FOR EVERY ROW BELOW, stated once: no soak receipt in the corpus can
 * grade any of them ALIVE or SILENT. scripts/audit/whole-world-soak.mjs builds its
 * rules from the `full_simulation` preset spread, which by construction declares
 * none of these keys, so the evaluator resolves each row's ruleState to `unknown`
 * and grades UNOBSERVED. That is the honest verdict — the run was never asked to
 * light the layer — and it is what these rows will read until the owner lights a
 * flag at THE ONE REGEN or a harness declares one. It is NOT the same thing as
 * DORMANT_BY_CONFIG, which claims the receipt RECORDED the key off, and no receipt
 * records a key nothing writes.
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and THE EVIDENCE LAW (every declared eventType is traceable to a `candidateType`
 * literal in source; every declared stateKey is a container the v5 census reads and
 * this subsystem owns). Both are binding here, and the evidence law is why three of
 * the four rows below declare fewer channels than a generous reading would allow.
 *
 * TO ADD A ROW HERE: the key must be in `ENGINE_GATED_VIRTUAL_RULE_KEYS`
 * (worldPulse/simulationRules.js) — that manifest is what puts it in the census in
 * the first place, and tests/lint/engineGatedRuleKeys.walker.test.js proves the
 * manifest against the tree in both directions. A key that later earns a preset
 * declaration LEAVES the manifest and its row moves to the subject lane; nothing
 * about the row itself changes.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The engine-gated virtual lane's authored rows.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const VIRTUAL_SUBSYSTEM_ROWS = Object.freeze([
  // ── THE BELIEF AXES (D-1, docs/DESIGN_DEEP_COUPLINGS.md) ───────────────────
  Object.freeze({
    rule: 'beliefAxesEnabled',
    title: 'Belief axes (demographic and cultural)',
    module: 'src/domain/worldPulse/beliefAxes.js,src/domain/worldPulse/beliefMap.js,src/domain/worldPulse/traditionsKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and the reason is the whole shape of the layer: it is a
      // PURE FOLD threaded into an existing writer at three injection points
      // (ground-truth derivation, report tagging, the axis fold), exactly the
      // credibilityOf injection shape. It mints no candidate of its own, so there is
      // no `candidateType` literal in the lane to declare and the evidence law
      // forbids inventing one.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The layer authors no Herald beat, and the family it
      // would classify into is `knowledge`, which the estate has measured to be a
      // residual bucket fed by fifteen unrelated impactKinds through the shared
      // `news` token — it can never carry ALIVE for one row. See
      // ./knowledgeLaneEvidence.js for the executed census behind that finding.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the row's hardest honest call. The axes
      // write two OPTIONAL FIELDS — populationTrendBand and observanceLabel — INSIDE
      // the belief records that already live in spatialLedgers.beliefMaps. Declaring
      // that container would grade this row alive off the BELIEFS layer's presence,
      // which is a different subsystem behind a different gate: a lit-beliefs,
      // dark-axes world carries the key with full entry counts. Worse, the census
      // reads ONE LEVEL into spatialLedgers and counts ENTRIES, never fields, so no
      // census reading could distinguish the two worlds even in principle.
      stateKeys: Object.freeze([]),
      other: 'THIS SUBSYSTEM IS STRUCTURALLY INVISIBLE TO EVERY RECEIPT SHAPE THE ESTATE WRITES, and saying so is the row. ONE GATE: beliefAxesActive is the virtual beliefAxesEnabled alone (beliefAxes.js), composed by the caller with beliefsActive, since advanceBeliefMaps early-returns when beliefs are dormant. WHAT IT DOES: an observer comes to believe that a town is emptying out or swelling (a NUMERIC -2..+2 band fed transitively by migration through the D-0 migration_flight rumor) and that a town keeps the rite it kept last time anybody looked (a CATEGORICAL motif:patron label fed by tradition-mutation beats that clear the rumor floor). THE STALENESS IS THE FEATURE: a rival that heard nothing still believes the old rite persists after politics rededicated it. Both fields obey BELIEFS-NEVER-TRUTH: nothing here writes a population count or a tradition record. WHY EVERY CHANNEL IS EMPTY: the layer is a pure fold inside another writer, so it mints no candidate; it authors no beat; and its output is two optional FIELDS inside another subsystem container. THE OBSERVATION NEEDED to close this gap is a per-field belief census in the soak receipt — a count, per observed year, of belief records carrying populationTrendBand or observanceLabel — which no receipt schema carries today because censusWorldStateKeys deliberately stops one level into spatialLedgers and counts entries. Until such an observation exists, the layer is pinned where its bodies are readable instead: tests/domain/beliefAxes.test.js.',
    }),
    // The fold runs wherever advanceBeliefMaps runs, which is every pulse. Declared
    // honestly even though no receipt can measure it: the tempo field describes the
    // subsystem, not the instrument.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_fields',
        description: 'Law 12 (dormancy by absence): with the flag dark the two axis fields are never written, so a belief record serializes byte-identically to the pre-D-1 engine. The layer cannot make a dark world bigger, which is the whole reason the key is virtual rather than declared.',
        check: 'NOT expressible from any receipt schema the estate writes: the census counts belief-map ENTRIES, never their fields. Pinned in tests/domain/beliefAxes.test.js, where a dark advance is compared field-by-field against a lit one.',
      }),
      Object.freeze({
        name: 'beliefs_are_never_truth',
        description: 'Law 3: every value the axes produce is a BELIEVED state. The ground-truth reads (the populationHistory ring, the traditions mirror) are the re-anchor and cold-start TARGET only, and nothing in the lane writes a population count or a tradition record.',
        check: 'NOT expressible from a receipt: the truth-side containers move for a dozen other reasons in the same year. Pinned at the writer in tests/domain/beliefAxes.test.js.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so. It is NOT in the
    // ceilinged escape-hatch population (that set is rows which DECLARE a channel and
    // still call the soak blind to it); this row declares nothing, which is the
    // stronger and more honest statement.
    soakEvidence: 'unobserved',
  }),
  // ── THE ESPIONAGE LAYER (FP ES-0 + ES-1, docs/DESIGN_FP_ARCH_ES.md §1-§2) ──
  //
  // THE FIRST ROW IN THIS LANE WHOSE SUBSYSTEM HAS NO CALLER AT ALL, and the row says so
  // rather than describing the layer the charter will build. ES-0 lands PURE LEAVES and
  // the gate that will govern them; the mission mint, the gauntlet and the products are
  // ES-1..ES-3. The honest grade for that state is UNOBSERVED with every channel empty —
  // not because the shape hides the output, as the belief-axis rows below record, but
  // because nothing has run. Declaring a channel now would grade the row SILENT in every
  // world, which reads as a broken subsystem instead of an unbuilt one.
  //
  // ES-1 (2026-08-06) BUILT THE MISSION AND THE ROW STAYS UNOBSERVED, WHICH IS THE
  // HONEST GRADE AND NOT AN OVERSIGHT. ES-1 landed the covert mint, its closed vocabulary,
  // the covert sub-record's normalizer, the casting law and the hidden-path franchise —
  // the DOOR a covert mission is created through. It did NOT land the dispatcher: no
  // production module calls the mission head, because deciding that a court WANTS a
  // confirmation is the deliberation read (§3.12) and the doctrine targeting (ES-5). So
  // nothing has still run, every channel is still empty, and `stateKeys` stays empty for
  // the DESIGN reason below rather than a wave one — the mission is a conditional
  // sub-record on an errand row the spine already owns, and censusWorldStateKeys counts
  // ledger ENTRIES, never fields inside them. The observation that moves this row off
  // UNOBSERVED is unchanged: a completed mission in a soak receipt.
  //
  // ⚠⚠ ES-3 (2026-08-06) IS THE WAVE THAT BROKE THE OLD SENTENCE, AND THIS ROW IS WHERE THE
  // BREAK IS RECORDED. Every earlier ES wave WROTE NOTHING, and this row said so in the
  // strongest available terms — "a lit world and a dark world stay byte-identical for a
  // reason stronger than a gate". ES-3 mounted a stage in `envoyPulse` that DOES write, in
  // two places: the gathering gradient onto the errand row (through the errand family's own
  // `writeErrands`) and the landed products into `spatialLedgers.beliefMaps` (through
  // `reconcileBelief`). The wave's own dormancy fence header says so in the same commit
  // while this row still carried the old claim — a certification row asserting a false
  // invariant is worse than no row, because the walkers treat it as the authority. The
  // dormancy claim below is now NARROWED to what is still true, and it is narrowed rather
  // than deleted: byte-identity survives, but it now rests on THE GATE, plus the structural
  // fact that a world with no covert sub-record has nothing to walk past it.
  Object.freeze({
    rule: 'espionageEnabled',
    title: 'Covert confirmation missions (the espionage layer)',
    module: 'src/domain/worldPulse/espionage/espionageGate.js,src/domain/worldPulse/espionage/espionageDoctrine.js,src/domain/worldPulse/espionage/espionageMath.js,src/domain/worldPulse/espionage/espionageMissions.js,src/domain/worldPulse/espionage/espionageGauntlet.js,src/domain/worldPulse/espionage/espionageTap.js,src/domain/worldPulse/espionage/espionageProducts.js,src/domain/worldPulse/espionage/espionageProductStage.js,src/domain/worldPulse/espionage/espionageRider.js,src/domain/worldPulse/lawWord.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the lane mints no candidate. There is no `candidateType`
      // literal anywhere in the espionage module set. ES-1 minted the MISSION and still
      // mints no candidate — a covert errand is a row on the errand spine, not a
      // settlement-strategy candidate — so this stays empty on the measured fact rather
      // than on the earlier wave's expectation.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the six Herald kinds are ES-7's, in ES-7's commit. The
      // BEHAVIOURAL mover families are a closed ten-member vocabulary owned by other
      // lanes; claiming one would grade this row alive off their traffic.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this one is a DESIGN FACT rather than a wave fact: the
      // whole program adds ZERO new top-level worldState keys and ZERO new
      // spatialLedgers sub-keys. Its one piece of state, when ES-1 mints it, is a
      // conditional `covert` sub-record on the errand row the spine already owns.
      stateKeys: Object.freeze([]),
      other: 'A SUBSYSTEM WITH EXACTLY ONE CALLER SINCE ES-Da, AND EVERY ALIVENESS CHANNEL IS STILL EMPTY - which is now a statement about SHAPE rather than about absence: the rider adds a conditional field to an errand row the spine already owns, and censusWorldStateKeys counts ledger ENTRIES and never the fields inside them. ONE DOOR, A THREE-PART CONJUNCTION: espionageActive (espionage/espionageGate.js) refuses unless beliefsActive holds, unless errandSpineEnabled is lit, and unless espionageEnabled reads === true BY NAME. The by-name read is load-bearing rather than stylistic - a frozen-list conjunction is a computed member access and would hide this key from the engine-gated-key census entirely, which is how a fully wired flag once shipped invisible. NOT WAR-GATED: none of the six ENVOY_REQUIRED_RULES war flags enters the conjunction, because espionage serves all statecraft and not war alone. WHAT ES-0 LANDED: three pure leaves and one shared-vocabulary mint. The doctrine leaf reads a court espionage doctrine off BOTH alignment axes - who it watches, whether it takes hidden ways, how often it sends, and how it treats the people it sends - as closed words with an unknown arm produced only at the resolution gate. The math leaf carries the notoriety, competence, catch, leg-stack, dwell-ramp, wariness, promotion-risk, grade and deliberation arithmetic, plus the tap and grade vocabularies. lawWord.js is the estate ONE law-band spelling, minted under CR-ES-3 to close a producer/consumer break in which warSeatBooks emitted a rung its two built consumers would reject, nulling the whole row rather than mis-grading it. WHAT ES-1 ADDED: the covert MISSION - a mint head that casts an operative importance-INVERSE (the realm face is its most notable person and its spies its least, two opposite draws over one roster that share only the dispatch-refusal predicate), routes every candidate through the estate ONE vetting reader, and mints through SP-D generalized errand spine rather than opening a second covert-travel substrate. The mission rides the errand row as a conditional covert sub-record with a closed itinerary of at most three stops, a typed product, a graded demand and the five appraisal legs an acquire may target - pullBand AND exports both excluded BY RULE, because no espionage product can fill either. exports was admitted at ES-1, measured slotless and DECLARED dead at ES-3 (STOP-ES3-1), and CUT at EP-r once the chair ruled that two members with one property treated two ways was itself the defect; the cut was free because the mint has no production caller, so no save file can carry it. A covert row must wear a public FACE derived from its own purpose, because the public reader falls back to the true class when no cover is written; a faceless covert row is refused rather than shipped. Covert travellers join the hidden-path franchise at one call site and ordinary envoys still cannot. WHAT ES-2 ADDED, AND THE ONE THING IT COULD NOT: the GAUNTLET - the stay-detection stage that rolls the odds on a covert traveller at every hostile stop where he stands still, once per dwell interval, keyed on the identity of that interval so every tick inside one interval is the same decision byte for byte and no already-rolled flag has to be stored anywhere. The odds climb by dwell band while he stays rooted, a friendly host rolls nothing at all by arithmetic rather than by a caller-side condition somebody can forget, and the disposition of the captor court is read off both alignment axes now that the seat vocabulary was unified at ES-0. A caught spy is worth one ransom band more and sits twice as long before the ransom gate opens, both readable off one row with no world state in the signature. WHAT IT COULD NOT DO IS OPEN CUSTODY. The errand DTO refuses the held state for a row that carries no army-carried ENCOUNTER, and the only release road in the tree refuses that same row, so a hold opened here could only ever end in death. Relaxing either shape is a persisted-schema question and this estate gates those on the owner, so the stage computes the capture, receipts it, and hands it back exactly as the ransom stage hands back a priced claim - and every reading carries custodyWritten false with the blocking reason, so a computed capture can never read as a persisted one. WHAT ES-3 ADDED, AND IT IS THE FIRST ESPIONAGE WAVE THAT WRITES: the three typed products (confirm, acquire, refute), the tap ladder that decides how deep a spy can hear, and the stage that walks the errand ledger and accrues what he gathered. A spy can never report purer than his access, and that law is arithmetic rather than prose: the tap is DERIVED from how the agent is present and fails closed to the shallowest rung, an open visitor reads a courts outbound TELLING discounted by how willing it is to lie toward home, and an entered agent reads what the court actually believes. A confirm crosses no observed slot, an acquire crosses only the appraisal legs it named, and a refute crosses everything readable so the contradiction term can bite. THE ASYMMETRY THAT IS THE POINT: where magic works at both ends the read is SENT the moment it is taken and a capture afterwards loses the SPY and not the intel, and where it does not the whole gradient folds at the home mouth and a capture on the road loses the man AND everything he gathered. One mans N looks fold to ONE telling, because the report aggregator SUMS weight across reports and nine echoes of one origin would otherwise arrive as nine independent witnesses. THE WRITES ARE NOW REAL AND THIS IS WHERE THE OLD SENTENCE STOPPED BEING TRUE: the stage amends the covert sub-record on the errand row through the errand familys own writeErrands transaction, and it writes belief records into spatialLedgers.beliefMaps through reconcileBelief as synthetic reports - never through the paid-plant override road, whose exact six-key envelope would have SILENTLY rejected an axis payload and left a product looking landed while writing nothing. Both are containers other subsystems already fill, which is why every aliveness channel above stays empty even now: censusWorldStateKeys counts ledger ENTRIES and never the fields inside them. WHAT IS STILL DEAD, DECLARED RATHER THAN DISCOVERED: the deepest tap rung (delta, an embedded agent WITH a live inside asset) cannot occur in a running world, because the inside-asset predicate is an INJECTED argument and this estate has no producer for it anywhere under src - the leaf is built and pinned so the wave that mints an asset ledger turns it on by supplying one argument, and the source census in tests/domain/espionageProducts.test.js reds the day a producer appears. That census is a PRODUCER census over code and it deliberately does not spell the predicates identifier here, because a row that named the token would itself count as a namer and grade its own prose as the producer it is warning about. ES-1 built the door, ES-3 built the traffic, and ES-Da BUILT THE DISPATCH - not the autonomous per-tick dispatcher ES-7 was refused for, but a RIDER: espionageRider.js is asked once, inside the accepted-peace dispatch, whether the embassy this court is already sending also carries a watcher, and the lawful covert sub-record it composes rides the errand mintEnvoyErrand was already about to mint. Nothing new travels and no stage was added. So a covert mission IS minted in a running world and the product stage no longer walks an empty ledger - ONCE THE FLAG LIGHTS. It stays dark at this commit: the flag is absent from every preset, the rider refuses at the one door before it touches a world object, and a declining rider contributes an EMPTY SPREAD, so the argument object handed to the mint is byte-for-byte the one that existed before ES-Da - executed over a ten-tick lifecycle against the pre-feature commit rather than argued. THE OBSERVATION NEEDED to move this row off UNOBSERVED is a completed mission in a soak receipt. That is now REACHABLE rather than impossible - ES-Da supplies the producer - and it still waits on the endgame lighting, because no preset lights the flag. Until then the layer is pinned where its bodies are readable: tests/domain/espionageDoctrine.test.js, tests/domain/espionageMath.test.js, tests/domain/espionageMission.test.js, tests/domain/espionageProducts.test.js, tests/property/espionageDormancyFence.test.js, tests/property/espionageMissionDormancyFence.test.js, tests/property/espionageProductsDormancyFence.test.js, tests/domain/espionageRider.test.js and tests/property/espionageRiderDormancyFence.test.js.',
    }),
    // Nothing runs, so no tempo is truthful except the one the layer will have when its
    // stage mounts inside the errand advance: one transition per row per pulse.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_rests_on_the_gate_and_on_an_empty_ledger',
        description: 'NARROWED AT ES-3, AND THE NARROWING IS THE POINT. Through ES-2 this claim was the strongest available shape: no module under src/ imported the espionage set at all, so darkness was STRUCTURAL rather than gated and a lit world was byte-identical to a dark one for a reason no flag could break. ES-3 ended that. The product stage is mounted in the envoy pulse and it WRITES - the gathering gradient onto the errand row through writeErrands, and belief records into spatialLedgers.beliefMaps through reconcileBelief - so byte-identity is now bought by TWO things and neither of them is structural absence: the espionageActive door refuses before the stage walks anything, and past that door a world whose errand ledger carries no covert sub-record has nothing to amend. Absent and explicitly false stay indistinguishable at every decision site because every production read is the strict === true form. The ES-1 claim it inherits is unchanged and still narrower still: a ten-tick run that mints, advances, patches a rumour and closes a row terminal is byte-identical whether or not the covert argument is passed, and the covert validation never executes at all when no mission is minted. ANY LATER WAVE THAT RESTORES THE OLD WIDER SENTENCE IS ASSERTING SOMETHING FALSE, which is why the narrowing is pinned by name rather than left as prose.',
        check: 'NOT expressible from any receipt schema: a refusal leaves no trace and the census counts belief-map ENTRIES, never their fields. Pinned in tests/property/espionageProductsDormancyFence.test.js by a real pulse run in both flag states - identity asserted BY REFERENCE, not by deep equality, because a stage that rebuilt an identical world would still have walked the ledger - with a LIT MUTANT control asserting the stage really does move the errand row and the belief map when the flag is on, so the fence is proven able to SEE rather than merely quiet. The narrowing itself is pinned in tests/domain/subsystemRowsVirtual.test.js, which asserts this row no longer claims the espionage set writes nothing and no longer claims that no module imports it.',
      }),
      Object.freeze({
        name: 'every_gate_door_is_separately_load_bearing',
        description: 'The three doors of espionageActive are pinned one at a time. A conjunction whose arms cannot each be dropped and reddened is a conjunction nobody has proven, and this estate has twice shipped a guard that a second guard silently covered for.',
        check: 'NOT expressible from a receipt: a refusal leaves no trace. Pinned in tests/property/espionageDormancyFence.test.js, which drives the door with each condition failing alone.',
      }),
      Object.freeze({
        name: 'the_law_word_is_minted_exactly_once',
        description: 'CR-ES-3 unified the seat vocabularies on the CONSUMER spelling (lawless/merciful/holding). The producer and its four live consumers moved in one commit, and the estate gained no fourth law-band vocabulary: a second spelling would let a wired row vanish again exactly as envoyTestimony credibility-first arm sat dead on a word warSeatBooks could not emit.',
        check: 'NOT expressible from a receipt: vocabularies are source facts. Pinned in tests/lint/seatVocabularyUnification.walker.test.js, which feeds real producer rows through the real consumer normalizers in both directions and asserts the RETIRED words are still rejected.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  // ── THE BELIEVED-WORLD AXES (FP SP-B, docs/DESIGN_FP_ARCH_SP.md §SP-B) ─────
  //
  // THREE ROWS, NOT ONE, BECAUSE THERE ARE THREE FLAGS (J-SP-3). Per-family flags are
  // what let TRADE, POPULATIONS and FAITH light their own subject independently, and a
  // single row over three gates would grade all three off whichever one a receipt
  // happened to see. Everything else about them is shared and is stated once, here:
  // each is a CONJUNCTION with beliefAxesEnabled read through ONE door
  // (beliefAxes.subjectAxesActive), each writes ONE conditional drop-when-absent field
  // inside the belief records that already live in spatialLedgers.beliefMaps, and each
  // is therefore invisible to every receipt shape the estate writes for exactly the
  // reason the belief-axes row above records: censusWorldStateKeys stops one level into
  // spatialLedgers and counts ENTRIES, never fields.
  Object.freeze({
    rule: 'believedScarcityEnabled',
    title: 'Believed scarcity (what a court thinks its neighbours lack)',
    module: 'src/domain/worldPulse/beliefAxisSubjects.js,src/domain/worldPulse/beliefAxes.js,src/domain/worldPulse/beliefMap.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: the family mints no candidate. It is a
      // pure fold arm inside an existing writer and there is no `candidateType` literal
      // anywhere in the lane.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the family authors no Herald beat. Its consumers (TR-3's
      // WHERE composer) do, in their own waves, under their own flags.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, for the belief-axes row's reason exactly: the output is one
      // OPTIONAL FIELD (`scarcityBands`) inside spatialLedgers.beliefMaps, a container
      // the BELIEFS layer fills in worlds where this flag has never been true.
      stateKeys: Object.freeze([]),
      other: 'A CONDITIONAL FIELD INSIDE ANOTHER SUBSYSTEM CONTAINER, WHICH IS WHY EVERY CHANNEL IS EMPTY. ONE GATE, A CONJUNCTION: subjectAxesActive (beliefAxes.js) refuses unless beliefAxesEnabled is lit AND believedScarcityEnabled reads === true by name — a family cannot exist without the fold that carries it. WHAT IT DOES: a court forms an opinion, per closed good class, about how well its neighbours are supplied — scant, pinched, sufficient, plentiful — from what those neighbours make, export, buy and cannot do without. The good classes are REGIONAL_GOOD_CATEGORIES verbatim (borrowed, not minted); the rungs are a mint whose four words appear as quoted literals nowhere else under src/, because reading the wrong ladder is a silent semantic error no walker catches. ONE class carries an extra term and only one: food, because the generator MEASURES a food ratio and no other class has a measured ratio anywhere in the tree — a per-class modifier with no per-class input would be a dead arm. WHAT IT NEVER DOES: it writes no commodity stock, no economic state, and no truth of any kind (law 3). A class the subject neither makes nor buys yields NO KEY, because silence is not a band and inventing one would be an opinion the observer never had. THE OBSERVATION NEEDED to close the gap is a per-field belief census in the soak receipt — a count, per observed year, of belief records carrying scarcityBands — which no receipt schema carries. Until then the family is pinned where its bodies are readable: tests/domain/beliefAxisSubjects.test.js and tests/property/believedWorldAxesDormancyFence.test.js.',
    }),
    // The fold runs wherever advanceBeliefMaps runs, which is every pulse.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_the_field',
        description: 'With the flag dark the gate door returns null, the arm never runs, and no belief record carries scarcityBands — so a dark world serializes byte-identically to the pre-SP-B engine. Absent and explicitly false are indistinguishable in every observable.',
        check: 'NOT expressible from any receipt schema: the census counts belief-map ENTRIES, never their fields. Pinned in tests/property/believedWorldAxesDormancyFence.test.js against a fixture that DOES write the field when lit — the lit-mutant control, without which the fence proves only that the fixture is quiet.',
      }),
      Object.freeze({
        name: 'every_band_edge_is_reachable',
        description: 'All four rungs and both arms of the food shift are produced by really-generated settlements rather than by a fixture built to mirror the deriver. The dead-band law: an unreachable rung is a lie the tuning table tells the owner.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/beliefAxisSubjects.test.js by driving generateSettlementPipeline over a real corpus and asserting the produced rung set, so a band that stops being reachable reds instead of quietly dying.',
      }),
      Object.freeze({
        name: 'the_good_classes_are_borrowed_not_minted',
        description: 'The keys of scarcityBands are REGIONAL_GOOD_CATEGORIES, the goods catalog\'s own closed vocabulary. A second good-class list is how one catalog quietly becomes two, which the audit measured happening to a treaty term family.',
        check: 'NOT expressible from a receipt: receipts carry rendered words, never the vocabulary behind them. Pinned in tests/lint/spAxisVocabulary.walker.test.js, which imports both sides and asserts the closure in both directions.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'believedConditionsEnabled',
    title: 'Believed conditions (tier, stores, road position, pull)',
    module: 'src/domain/worldPulse/beliefAxisSubjects.js,src/domain/worldPulse/beliefAxes.js,src/domain/worldPulse/beliefMap.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, all three, for the reasons the scarcity row above states.
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'THE ROW THE WAR PROGRAM IS WAITING ON, AND IT STILL DECLARES NO CHANNEL. ONE GATE, A CONJUNCTION: subjectAxesActive refuses unless beliefAxesEnabled is lit AND believedConditionsEnabled reads === true by name. WHAT IT DOES: a court comes to hold four banded opinions about a neighbour — how big it is, how deep its granary runs, where it sits on the roads, and how strongly it draws people. THE FIRST THREE ARE THE WR-10 APPRAISAL\'S THREE MISSING LEGS (CR-WR10-H): sovereigntyMarketStage.beliefLegsOf returns one leg of four today and refuses every sale with an honest receipted no-trade, and this family is what makes the other three sayable. THE LADDERS ARE BORROWED, NOT MINTED: tierBand is TIER_ORDER imported verbatim, storesBand is ENVOY_STORES_BANDS by spelling, routePositionBand is ROUTE_FLOW_BANDS by spelling — the two spellings are mirrors rather than imports because their homes are the GRAMMAR and TRADE ports and licensing a cross-layer read is a chair declaration, so a walker imports both sides and proves them verbatim equal instead. pullBand is the one mint in the wave and it is deliberately NOT OVERFLOW_BANDS: J-FP-2 rules that ladder a pressure LEVEL, and reading it as desirability is precisely the silent semantic error the ladder law exists to kill. WHAT IT NEVER DOES: it supplies SURFACES, not sources. A market lit on this family alone would clear only rumour-range holdings, which is why the lighting condition names three waves and not one (SP-B, SP-B2, ES-4). WHAT IT NEVER WRITES: any truth-side field, and any key at all for a read that did not resolve. THE OBSERVATION NEEDED is the same per-field belief census the belief-axes row asks for. Until then: tests/domain/beliefAxisSubjects.test.js and tests/property/believedWorldAxesDormancyFence.test.js.',
    }),
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_the_field',
        description: 'With the flag dark no belief record carries conditionsBands and beliefLegsOf keeps returning exactly today\'s one-or-zero legs, so the sovereignty market keeps refusing exactly as it refuses now. Lighting this family cannot change a dark world.',
        check: 'NOT expressible from a receipt (the census counts entries, never fields). Pinned in tests/property/believedWorldAxesDormancyFence.test.js with its lit-mutant control.',
      }),
      Object.freeze({
        name: 'an_unresolved_read_yields_no_key_never_a_midpoint',
        description: 'Each of the four keys is present only where its own read resolved. A settlement with no economicState carries a tierBand and nothing else. The appraisal contract depends on this exactly: an absent leg must read `known: false`, and a midpoint would be the guess K3 exists to forbid.',
        check: 'NOT expressible from a receipt: an absent key and a never-lit flag look identical in a state census. Pinned in tests/domain/beliefAxisSubjects.test.js on a fixture whose reads resolve one at a time.',
      }),
      Object.freeze({
        name: 'the_borrowed_ladders_cannot_drift',
        description: 'storesBand and routePositionBand are mirrors of ladders owned by other ports. A mirror that drifts is a writer/reader spelling break that no runtime test would ever fail, because both halves would be internally consistent.',
        check: 'NOT expressible from a receipt. Pinned in tests/lint/spAxisVocabulary.walker.test.js, which imports ENVOY_STORES_BANDS and ROUTE_FLOW_BANDS and asserts verbatim equality both ways, with a planted re-spelling executed as a mutant.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'believedDevotionEnabled',
    title: 'Believed devotion (how a neighbour\'s gods are thought to fare)',
    module: 'src/domain/worldPulse/beliefAxisSubjects.js,src/domain/worldPulse/beliefAxes.js,src/domain/worldPulse/beliefMap.js',
    aliveness: Object.freeze({
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'ONE WORD PER PAIR, AND THE ONE WORD IS NOT A THEOLOGY. ONE GATE, A CONJUNCTION: subjectAxesActive refuses unless beliefAxesEnabled is lit AND believedDevotionEnabled reads === true by name. WHAT IT DOES: a court forms a banded opinion about how loudly a neighbour prays — secular, lukewarm, observant, faithful, devout — read off that settlement\'s top unsuppressed deity, lifted one rung when that deity also holds the patron seat. IT IS DISTINCT FROM THE EXISTING observanceLabel AXIS AND THE DISTINCTION IS THE POINT: observanceLabel is WHICH RITE (a motif and a patron, an identity), and this is HOW STRONGLY IT IS HELD (an intensity). A world can rededicate without cooling and can cool without rededicating. THE LADDER IS BORROWED from pietyBandLabel, the five words the faith surfaces already show a player, so nothing new is spoken to anybody. THE EDGES ARE BORROWED TOO, and that is the sharper call: the rungs are keyed on religionState\'s own `standing`, which it already computes with hysteresis against owner-signed thresholds, rather than on a second set of share edges over the same quantity — minting those would have been the fourteen-drift class in miniature. WHAT IT NEVER DOES: it never names a god, never confirms one exists, and never writes a share, a standing, or a patron (the deity doctrine, and law 3). A subject with no religion state at all yields NO KEY: the observer has nothing to have an opinion about, which is different from believing the place is godless. THE OBSERVATION NEEDED is the same per-field belief census. Until then: tests/domain/beliefAxisSubjects.test.js and tests/property/believedWorldAxesDormancyFence.test.js.',
    }),
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_the_field',
        description: 'With the flag dark no belief record carries devotionBand, and the two D-1 axes behave byte-identically beside it — lighting one family moves ONLY its own field, which is what makes three flags safer than one.',
        check: 'NOT expressible from a receipt. Pinned in tests/property/believedWorldAxesDormancyFence.test.js, whose three-family independence goldens light each family alone and compare the whole projection.',
      }),
      Object.freeze({
        name: 'no_god_is_ever_named_or_confirmed',
        description: 'The field is a single band word. The deityRef that produced it never reaches the belief record, so a court can believe a neighbour is devout without the engine having conceded that anything is listening.',
        check: 'PARTLY expressible: a field census would show a closed five-word vocabulary and never an id. Pinned directly in tests/domain/beliefAxisSubjects.test.js, where the derivation is driven on a pantheon with named deities and the output is asserted to be a ladder member.',
      }),
      Object.freeze({
        name: 'it_does_not_shadow_the_observance_axis',
        description: 'devotionBand (intensity) and observanceLabel (rite identity) are different questions with different feeds and different flags. A wave that collapsed them would lose the ability to say that a town kept its god and stopped caring.',
        check: 'NOT expressible from a receipt: both are fields inside the same container. Pinned in tests/domain/beliefAxisSubjects.test.js, where a rededication moves one and a cooling moves the other on the same fixture.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  // ── THE SECOND-ORDER MIRROR (FP IN-1a, docs/DESIGN_FP_ARCH_IN.md §IN-1) ────
  //
  // A SEVENTH ZERO-KEY CASE, and the only row in the lane whose emptiness is a WRITER
  // fact and nothing else. The mirror is a pure derivation with no ledger, no writer and
  // no receipt. IN-1a shipped the producer first — the ES-7 precedent, where five waves of
  // consumers were built against a producer nobody had chartered — and IN-1b closed that
  // window with the standing line, so the read now has exactly ONE caller and it is a
  // render-time read-model. The channels stay empty because the subsystem still mints no
  // event, no mover family and no state key, NOT because nothing reads it; declaring one
  // would grade a subsystem that writes nothing SILENT, which reads as broken.
  Object.freeze({
    rule: 'secondOrderBeliefEnabled',
    title: 'The mirror (what our own record says a court has been shown of us)',
    module: 'src/domain/worldPulse/secondOrderBelief.js,src/domain/worldPulse/outboundImpression.js,src/domain/worldPulse/bandedStock.js,src/domain/display/neighbourMirror.js,src/domain/worldPulse/informationNews.js,src/domain/worldPulse/informationReceiptPools.js',
    aliveness: Object.freeze({
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze([]),
      other: 'A DERIVED READ THAT STORES NOTHING, AND THE EMPTINESS IS THE DESIGN. ONE GATE: secondOrderBeliefActive is the single strict === true by-name read of this key in the tree, and it stands at the COLLECTOR, so a dark world cannot even assemble the input. WHAT IT DOES: it answers what our OWN durable ledgers say we have shown a named court about ourselves, banded onto a closed ascending ladder, dated by the newest durable act, aged against the estate one half-life vocabulary, and carrying a confidence that DEGRADES on our own first-person evidence that they know things we never showed them. IT COMPOSES SP-B OUTBOUND HEURISTIC AND RE-DERIVES NOT ONE LINE OF IT: outboundImpressionOf already owns the strength and label derivation, and this leaf supplies only the row adaptation, the banding, the staleness clock, the confidence and the frozen closed shape. WHAT IT NEVER DOES: it never reads the counterpart own record of us. That is Law One, and the fence is STRUCTURAL rather than a scan, because the legal read and the forbidden one are the same function with its arguments swapped: the derivation half never receives worldState at all, so it cannot reach a belief partition by construction. IT ALSO NEVER WRITES: no ledger key, no news kind, no receipt. DURABLE FAMILIES ONLY (CR-IN1-7): plants and our own concealment posture carry the clock; the handover ledger is live but memoryless because it prunes every prior-tick row; ally shares have no persisted source at this HEAD; and our exposure receipts are one-shot news, so that degradation leg is a recorded deferral rather than a half-built arm. IT NOW HAS EXACTLY ONE CONSUMER, AND IT RENDERS: IN-1b mounted the standing line on the Relationships and Neighbours surface through src/domain/display/neighbourMirror.js, a pure render-time read-model that composes the collector and the derivation and re-derives neither. That consumer writes nothing either, so every channel above stays empty on the merits. DORMANCY NOW RESTS ON TWO MECHANISMS RATHER THAN ON HAVING NO CALLER: the strict gate at the collector, and the read-model identity check against the frozen unknown that yields an empty list without ever branching on the key. Pinned in tests/domain/secondOrderBelief.test.js, tests/property/secondOrderBeliefDormancyFence.test.js, tests/domain/neighbourMirror.test.js, and a driven rendered-surface golden in tests/ui/neighbourMirrorLine.test.js. AND THE SENTENCE IT RENDERS IS NOW THE GOVERNED CORPUS SPEAKING, WHILE THE SUBSYSTEM STILL WRITES NOTHING: IN-1c-a moved the standing line off a single hand-composed template and onto a seeded pick from the estate fifth phrased-kind registry family, src/domain/worldPulse/informationNews.js over src/domain/worldPulse/informationReceiptPools.js, whose one registered kind mirror_standing_line is a section null DOSSIER row that files no Herald desk, claims no reader phrase and routes no token. That family is a pure data leaf plus one keyed hash: no ledger, no receipt, no news entry, no persisted byte, no flag of its own. The registry is also never reached on a dark path at all, because the read-model identity check against the frozen unknown short-circuits above the composition, which is why the three channels below stay empty on the merits after this wave exactly as before it. Two authored variants name a season the read-model cannot supply and are declared unreachable with a two-armed control rather than trimmed from the governed corpus. Pinned in tests/lint/informationKindPools.walker.test.js.',
    }),
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_rests_on_the_gate_and_on_the_absence_rule',
        description: 'A world that never lights the key is unchanged everywhere, and two mechanisms hold that rather than one. THE GATE: the single strict === true by-name read stands at the collector, so a dark world cannot assemble the input at all. THE ABSENCE RULE: dark, the collector returns its inert input and the derivation the frozen unknown, both BY IDENTITY, so the one consumer answers an empty list and renders no section without ever branching on the key. IN-1a could claim more only because nothing called it; IN-1b brought the first consumer and narrowed the claim in the same commit that made the wider one false.',
        check: 'NOT expressible from a receipt, because the subsystem mints none. Pinned in tests/property/secondOrderBeliefDormancyFence.test.js, whose fences cover the inert read, the differential across every truthy imposter, the call path into the composed leaf, the exact gate-polarity census, and the one-caller claim measured against live source. The surface half is a DRIVEN byte-identity golden in tests/ui/neighbourMirrorLine.test.js: the tab rendered with the key absent, explicitly false, and lit over a world carrying no outbound record, all three byte-identical to the surface as it stood before this wave existed.',
      }),
      Object.freeze({
        name: 'the_derivation_never_receives_the_world',
        description: 'secondOrderMirrorOf takes pre-read rows and never a worldState, so no argument order can make it reach the counterpart belief slot. An import allow-list alone cannot enforce this, because the legal and forbidden reads are one function with swapped arguments.',
        check: 'PARTLY expressible: a signature census would show one parameter. Pinned directly in tests/domain/secondOrderBelief.test.js, where the three-arm fence asserts the parameter list, the closed import set, and the single belief call with our own id standing in the observer slot, plus a positive control that the same scan does flag the module which legitimately opens the partition.',
      }),
      Object.freeze({
        name: 'confidence_falls_on_our_own_evidence_and_never_rises',
        description: 'Evidence that a court knows things we never showed them makes our mirror LESS certain, never more. A mirror that could only ratchet upward would be an unreachable arm wearing a green pin, which is why both degradation legs are built and each is driven independently.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/secondOrderBelief.test.js as the reversal case: on a real fixture each leg drives the confidence rung measurably down on its own, both together drive it further, and the inverted direction is asserted NOT to degrade.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  // ── THE STRATEGIC POSTURE (FP SP-C, docs/DESIGN_FP_ARCH_SP.md §SP-C) ───────
  //
  // A SIXTH ZERO-KEY CASE, and its emptiness is a SHAPE fact and a MOUNT fact at once —
  // the only row in the lane that is both. Shape: the whole persisted surface is ONE
  // optional facet (`appetite`) inside `worldState.dispositionStats`, a container the
  // WR-2 disposition layer fills in every world where its own flag is lit, so declaring
  // that key would grade this row alive off a different subsystem's presence. Mount: the
  // facet's writer is reached only when a caller passes `appetiteEnabled` into
  // `advanceDispositionChannels`, and no call site does yet — SP-C lands the learn/decay
  // machinery, the read, and the gate that will govern them, exactly as ES-0 landed its
  // gate before its missions. Declaring a channel today would grade an unmounted
  // subsystem SILENT, which reads as broken rather than as unbuilt.
  Object.freeze({
    rule: 'strategicPostureEnabled',
    title: 'Strategic posture (a court\'s learned appetite for risk)',
    module: 'src/domain/worldPulse/strategicPosture.js,src/domain/worldPulse/dispositionLedger.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: the lane mints no candidate. The writer
      // is a facet inside an existing fold and the read is a pure threshold colour, so
      // there is no `candidateType` literal anywhere in it.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the lane authors no Herald beat. Its crossing receipt is
      // SP-5b's band-word grammar returned to a caller, not a news kind, and the
      // consumers that will narrate a court's nerve do so in their own volumes.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, for the belief-axis rows' reason exactly one container over:
      // the output is one OPTIONAL FIELD inside worldState.dispositionStats, which the
      // WR-2 layer materialises in worlds where this flag has never been true.
      stateKeys: Object.freeze([]),
      other: 'A CONDITIONAL FACET INSIDE ANOTHER SUBSYSTEM\'S CONTAINER, WITH NO CALLER YET, which is why every channel is empty twice over. THE GATE IS A TWO-DOOR CONJUNCTION AND EACH DOOR IS PINNED SEPARATELY: door 1 is the WR-2 channel writer\'s own `enabled` arm, because the appetite decays and the legacy arm has no tick to decay against; door 2 is `appetiteEnabled`, fed by strategicPosture.strategicPostureActive, the ONE by-name strict read of strategicPostureEnabled in the tree. Lighting this flag over dark channels writes nothing at all rather than half-running. WHAT IT DOES: a court learns, from RESOLVED OUTCOMES ONLY, how much risk it has come to stomach: a war won or lost, a covenant kept or broken, a venture that paid or did not, and forgets it again on a few years\' half-life. THE LESSON MAP IS A PARTITION of the ledger\'s own thirteen source kinds, and one kind teaches NOTHING on purpose: `resolved_outcome` is the fallback for a string outside the vocabulary, so letting it teach would let an unrecognised token move a court\'s nerve. NOTHING IS MINTED: the decay is bandedStock.decayTowardNeutral on SP-A\'s shared half-life ladder (this is SP-5b\'s FIRST in-tree instantiation) and the band words are dispositionBandOf\'s, borrowed whole, so this wave asks the owner to sign learn rates and composition weights and not one band edge. WHAT IT NEVER DOES: it names no target. The read module\'s entire import list is the disposition ledger, so there is no relationship graph, no neighbour list and no candidate set within its reach. A posture COLOURS a decision another module was already going to make, bounded to a fifth of that decision\'s bar. THE OBSERVATION NEEDED to close the gap is a per-field census of dispositionStats rows carrying an appetite facet, which no receipt schema carries because censusWorldStateKeys counts entries and never fields. Until then the layer is pinned where its bodies are readable: tests/domain/dispositionAppetite.test.js, tests/domain/strategicPosture.test.js and tests/property/strategicPostureDormancyFence.test.js.',
    }),
    // The facet moves wherever the disposition fold runs, which is every pulse the WR-2
    // layer is lit for. Declared honestly even though no receipt can measure it.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_the_facet',
        description: 'With the flag dark no dispositionStats row ever grows an `appetite` key, so a LIT disposition ledger (the adversarial case, since the container itself is busy) serializes byte-identically to the pre-SP-C engine across a multi-tick run. Absent and explicitly false are indistinguishable in every observable.',
        check: 'NOT expressible from any receipt schema: the census counts dispositionStats ENTRIES, never their fields. Pinned in tests/property/strategicPostureDormancyFence.test.js, which hashes the whole ledger across ten ticks of real outcome traffic and carries the lit-mutant control that proves the same fixture DOES write the facet when the flag is on.',
      }),
      Object.freeze({
        name: 'the_appetite_is_not_a_ratchet',
        description: 'Courage can be lost. The only non-outcome movement is decay TOWARD neutral, and a loss moves the stock down by the same arithmetic a win moves it up, so a stock that rose above neutral can cross back below it. A one-way courage stock would make every court in a long campaign fearless or reckless forever.',
        check: 'NOT expressible from a receipt: no receipt carries the facet. Pinned as THE REVERSAL PIN in tests/domain/dispositionAppetite.test.js, which drives a run of wins and then a run of losses through the real writer and asserts the stock crosses neutral in both directions.',
      }),
      Object.freeze({
        name: 'a_dark_flag_never_erases_a_learned_appetite',
        description: 'The legacy writer REBUILDS an entry rather than spreading it, so any key it does not name is erased. A campaign lit, then deliberately darkened while ordinary outcomes continue, would lose its appetite and face a forbidden re-derivation on the next flip. The facet is preserved verbatim and frozen while dark, exactly as the WR-2 channels are, and independently of them because the two are gated separately.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/dispositionAppetite.test.js by driving the legacy arm over an entry that carries a facet and asserting the facet is byte-identical afterwards.',
      }),
      Object.freeze({
        name: 'the_posture_can_never_name_a_victim',
        description: 'The read is threshold-shaped (E3) and its reach is a reviewed exact set of one leaf. A relationship graph, a neighbour list or a candidate set inside this module would turn a colour into a governor, which is the P4 defect the import pin exists to prevent.',
        check: 'NOT expressible from a receipt: reach is a source fact. Pinned in tests/domain/strategicPosture.test.js as an exact import-list equality, with an executed violation mutant that adds one import and reds it.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  // ── THE ERRAND SPINE (SP-D, docs/DESIGN_FP_ARCH_SP.md §5) ──────────────────
  // A GENERALIZATION rather than a layer, which is why every channel below is empty and
  // why that is the honest reading rather than a modest one. The wave adds no ledger, no
  // stage and no news kind: it turns an existing war artifact into a substrate five
  // unbuilt volumes will mint against, and the only thing a lit world does differently is
  // carry up to three conditional WORDS on an errand row the WR-7a layer already writes.
  Object.freeze({
    rule: 'errandSpineEnabled',
    title: 'The errand spine (six purpose classes and the declared/true split)',
    module: 'src/domain/worldPulse/errandMint.js,src/domain/worldPulse/envoyErrandVocabulary.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: the lane mints no candidate. The head
      // returns a field block to an existing writer; there is no `candidateType` literal
      // anywhere in it.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the lane authors no Herald beat. A purpose class is what an
      // errand IS, not something that happened, and the volumes that will narrate a
      // factor or a courier do so in their own waves with their own kinds.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, for the appetite facet's reason one container over: the
      // output is up to three OPTIONAL FIELDS inside worldState.envoyErrands rows, which
      // the WR-7a layer materialises in worlds where this flag has never been true.
      // Declaring that key would grade this row alive off a different subsystem.
      stateKeys: Object.freeze([]),
      other: 'A CONDITIONAL FIELD FAMILY INSIDE ANOTHER SUBSYSTEM\'S CONTAINER, WITH NO FOREIGN CALLER YET, which is why every channel is empty twice over. THE GATE IS ONE DOOR READ ONCE: errandMint.errandSpineActive, the only `errandSpineEnabled === true` in the tree. A SECOND FILE NAMES THE KEY AND IS NOT A GATE ON THIS LAYER — espionage/espionageGate.js reads `!== true` as ES-0\'s lighting-order precondition, refusing to host missions on an unlit spine — and both polarities are pinned so a third site reds. WHAT IT DOES: it makes the war errand the estate ONE purposeful-travel substrate (J-SP-2, confirmed keep-in-place by CR-FP-10). Six closed purpose classes — commercial, covert, diplomatic, factional, personal, religious — say what kind of business a named person is on the road for, and a declared/true split lets an errand wear a face that is not its business. THE MAPPING ROW IS DATA, NOT INFERENCE: sue and self_parlay name diplomatic explicitly, which is what buys the wave its no-migration promise, because every legacy row and every war errand carries NO class key and reads diplomatic anyway through the one reader. NOTHING IS MINTED THAT ALREADY EXISTED: the journey is priced through the family own normalizeRoutePlan seam, so law M binds a covert errand and a peace embassy identically by construction; the audience split borrows the estate own includeCovert spelling rather than forking a second word for one idea. WHAT IT NEVER DOES: it writes no class the caller did not ask for, and it never restates a derivation — a class equal to what the purpose already implies is dropped rather than stored, so a lit world pays bytes only where the business genuinely differs from the face. THE OBSERVATION NEEDED to close the gap is a per-field census of envoyErrands rows carrying a purposeClass, which no receipt schema carries because censusWorldStateKeys counts entries and never fields. Until then the layer is pinned where its bodies are readable: tests/domain/errandMint.test.js, tests/domain/envoyErrandSpineLifecycle.test.js, tests/property/errandSpineDormancyFence.test.js and tests/lint/errandConsumerRegistry.walker.test.js.',
    }),
    // The head runs on every errand mint, which is every pulse the WR-7a layer is lit for
    // and a peace offer is accepted. Declared honestly even though no receipt can see it.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_the_three_fields_at_the_MINT',
        description: 'With the flag dark no MINT ever writes a purposeClass, declaredPurpose or truePurpose key, so a LIT war layer (the adversarial case, since the ledger itself is busy minting, advancing, patching and closing) serializes byte-identically to the pre-SP-D engine across a ten-tick run. Absent and explicitly false are indistinguishable in every observable, and so is every truthy-but-not-true spelling. NARROWED AT REPAIR SP-D-R5 (2026-08-06) FROM AN OVERSTATEMENT, live code outranking the table: this row previously said no errand row EVER GROWS the keys, which is true of the mint and MEASURED FALSE of the import — a row minted by a lit world and written into a dark one keeps all three, because normalizeErrand spreads errandSpineBlock unconditionally and only errandMint.js reads the flag. THE PERSIST SEAM IS DELIBERATELY UNGATED. Gating it was EXECUTED, not argued away: threading errandSpineActive through normalizeErrand/normalizeEnvoyErrands does strip the fields correctly, and it BREAKS UNDO (restoreEnvoyErrands returned restore_conflict against a byte-exact restore), because a pure persistence normalizer that suddenly depends on a world has callers that do not have one. The preserved cargo is INERT: no module outside the errand family reads the three fields anywhere in src/. So a lit campaign opened dark keeps its history rather than having it silently destroyed, which is the side THE PROMISE errs on.',
        check: 'NOT expressible from any receipt schema: the census counts envoyErrands ENTRIES, never their fields. Pinned in tests/property/errandSpineDormancyFence.test.js, which hashes the ledger at every one of ten ticks of real errand traffic and carries the lit-mutant control proving the same fixture DOES carry the class when the flag is on. BOTH HALVES of the narrowed claim are pinned in tests/domain/envoyErrandSpineLifecycle.test.js under "THE MINT IS GATED, THE PERSIST IS NOT, AND THAT IS A DECISION": a dark mint yields an empty spine key set, and a dark IMPORT of lit-minted cargo yields the full one.',
      }),
      Object.freeze({
        name: 'a_legacy_row_needs_no_migration_and_no_re_serialization',
        description: 'The mapping row derives diplomatic from both war purposes, so an errand written before this wave — and every errand the war path writes after it — reads its class correctly while carrying no class key at all. An installed save is not rewritten, and a save written by a newer vocabulary opens on an older build as an honest embassy rather than as a missing traveller.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/envoyErrandSpineLifecycle.test.js by round-tripping a legacy row through the real normalizer and asserting byte-identity, and by healing a forged class word to absent without destroying the errand.',
      }),
      Object.freeze({
        name: 'the_cover_story_is_fail_closed_and_does_not_announce_itself',
        description: 'A non-covert projection never carries truePurpose. The harder half: it must not betray that a true purpose EXISTS, because the presence of a key is itself the tell — so the public shape of a covert errand wearing a diplomatic face is identical, key for key and word for word, to that of an honest embassy.',
        check: 'NOT expressible from a receipt: no receipt carries an errand projection. Pinned in tests/domain/envoyErrandSpineLifecycle.test.js against a SEEDED covert errand rather than an empty harness — the two public projections are compared to each other, and every non-true spelling of includeCovert is driven.',
      }),
      Object.freeze({
        name: 'the_row_can_never_hold_two_answers_about_what_an_envoy_is_doing',
        description: 'The declared/true pair survives only TOGETHER, only as lawful vocabulary words, only when they differ, and only when the true half agrees with the row resolved class. A half-split drops both halves, which lands on the honest side: an errand can lose a cover story it should have kept, and can never gain a secret it never had.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/errandMint.test.js (the mint refuses a disagreeing truePurpose) and tests/domain/envoyErrandSpineLifecycle.test.js (the persist normalizer heals a half-split and a disagreeing pair to absent).',
      }),
      Object.freeze({
        name: 'there_is_exactly_one_purposeful_travel_substrate',
        description: 'Five unbuilt volumes are supposed to mint through this head rather than open their own mover ledgers. A frozen consumer map records who they are and which class each will mint, and the claim is measured against the tree in both directions rather than trusted.',
        check: 'NOT expressible from a receipt: it is a source fact. Pinned in tests/lint/errandConsumerRegistry.walker.test.js — an unregistered minter reds, a row claiming built with no minting module reds, and a row claiming unbuilt whose module now mints reds. The mint leaf is also registered in the named-person transit totality walker, so no purpose class can acquire a second speed floor.',
      }),
    ]),
    soakEvidence: 'unobserved',
  }),
  // ── THE CONQUEST DOCTRINE (WR-8 amendment R2, the vengeance license) ───────
  Object.freeze({
    rule: 'conquestDoctrineEnabled',
    title: 'Conquest doctrine (the vengeance license)',
    module: 'src/domain/worldPulse/conquestDoctrineStage.js,src/domain/worldPulse/vengeanceLicense.js,src/domain/worldPulse/razingExecution.js,src/domain/worldPulse/occupation.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: there is no `candidateType` literal
      // anywhere in the doctrine lane. Razing rides the war layer's existing
      // vocabulary, and the license is a RECORD rather than an event.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY for the reason every dark-lane row keeps it empty: the
      // lane authors no beat it owns, and `knowledge` is the contaminated residual.
      moverFamilies: Object.freeze([]),
      // The ONE channel the lane has, and it is exact: vengeanceLicense.js is the
      // SINGLE WRITER of this key (its four setSpatialLedger calls — mint, consume,
      // extinguish, prune — are the only ones for it in the tree), and no other
      // subsystem touches it, so a census reading is dispositive rather than shared.
      // Receipt-expressible only from the v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.vengeanceLicenses']),
      other: 'TWO GATES, AND THE OUTER ONE IS AN EIGHT-FLAG CONJUNCTION. vengeanceLicensesActive (vengeanceLicense.js) reads the layer own flag alone and deliberately does not duplicate the lighting order; conquestDoctrineActive (conquestDoctrineStage.js) is the composed gate the callers use, and CONQUEST_REQUIRED_RULES names all eight — warLayer, warTermination, peaceEngine, dispositionChannels, coalitionLedger, envoyDiplomacy, demographics and conquestDoctrine. So a receipt that lit this key alone would still read zero, and that is a correct reading of an absent precondition rather than a dead lane. WHAT IT DOES: a razing mints ONE license per burned settlement, naming the razer, the victim, the tick, and the victim-adequate settlements that thereby hold the right to answer it once. THE POPULATION IS AN ARTEFACT OF RARITY AND THE KEY DRAINS: a record exists only where a razing happened AND somebody relationship to the burned settlement cleared the adequacy band AND that somebody already shared a regional-graph edge with the razer (CR-WR8-A: a razing mints no edge to strangers), and pruneVengeanceLicenses DROPS each record the moment it is consumed, extinguished, or ages past its generational band, dropping the whole sub-ledger when the last one goes. That is why maxEntries rather than finalEntries is the aliveness signal for this row: a ledger that filled and drained still proves the doctrine ran, while a final reading of zero proves only that the debts were collected. A NON-OBVIOUS ZERO: a lit realm whose evil-aligned initiators never won a siege legitimately records nothing at all, which is a peaceful century rather than a broken layer. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt over a run whose rules record all eight CONQUEST_REQUIRED_RULES true and whose endings mix carries at least one punitive_sack.',
    }),
    // A razing is the rarest ending in the war layer's mix, and the license is minted
    // only from one. `rare` has no tempo floor beyond a single firing anywhere in the
    // span, which is the honest expectation for this lane.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledger_is_gated',
        description: 'Dark means the key never materializes: no writer in the lane runs without the composed conquestDoctrineActive gate above it, so a dark world serializes byte-identically to the pre-WR8 engine.',
        check: 'In any v5 receipt whose subsystems.rules records conquestDoctrineEnabled false or omits it, subsystems.stateKeys does not carry spatialLedgers.vengeanceLicenses. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'one_license_per_razing_and_it_is_idempotent',
        description: 'A razing replayed on the same tick mints no second license and does not widen the first one holders behind the world back: the mint keys on razer, victim and tick, and returns the world UNCHANGED when that id already exists.',
        check: 'NOT expressible from a receipt: the census counts entries, never their ids. Pinned at the writer in tests/domain/vengeanceLicenseWr8.test.js, where a replayed razing leaves the ledger byte-identical.',
      }),
      Object.freeze({
        name: 'the_ledger_drains_rather_than_accumulates',
        description: 'The license is CONSUMED on use, extinguished when the razer is itself answered, and pruned past its generational band. A ledger that only ever grew would mean the consume and prune paths stopped running and every grievance became permanent, which is the opposite of the amendment design.',
        check: 'For any receipt whose census carries spatialLedgers.vengeanceLicenses across at least thirty observed years, either maxEntries is strictly greater than finalEntries, or the key years count is below the receipt observedYears. Expressible from the v5 stateKeys census plus the receipt observedYears.',
      }),
    ]),
    // The dispositive channel exists and is exact, but it is instrumented ONLY by the
    // v5 census and no completed case could have lit an eight-flag conjunction whose
    // eighth member no preset declares. `indirect`, not `unobserved`: the channel is
    // real and readable the day such a receipt exists.
    soakEvidence: 'indirect',
  }),
  // ── HABIT CONDITIONING (HB-2, docs/DESIGN_FP_ARCH_HB.md §4) ────────────────
  // AUTHORED, NEVER PENDING. This wave's home cohort is the ENGINE-GATED VIRTUAL one and
  // that cohort's pending array measures empty, so there is nowhere to defer to; direction 3
  // of the engine-gated walker exists because "manifested here, pending elsewhere" once
  // shipped a red.
  Object.freeze({
    rule: 'habitConditioningEnabled',
    title: 'Habit conditioning (the learned-contrast sub-ledger)',
    module: 'src/domain/worldPulse/habit/habitLedger.js,src/domain/worldPulse/habit/habitGate.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: this wave mints no pulse candidate and composes no beat, so there
      // is no candidateType literal in it to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the lane returns no news, so it classifies into no mover family.
      moverFamilies: Object.freeze([]),
      // ONE channel, and it is REACHABLE rather than aspirational: censusWorldStateKeys walks
      // one level into spatialLedgers, so this key reports the ledger's own sub-map count.
      stateKeys: Object.freeze(['spatialLedgers.habits']),
      other: 'ONE GATE, ONE DOOR, AND NO CALLER AT THIS WAVE. habitsActive requires habitConditioningEnabled === true read BY NAME (habit/habitGate.js), which is the ONE read of this key in the tree; the by-name spelling is load-bearing rather than stylistic, because a frozen-list conjunction is a computed member access and would hide a fully wired flag from the engine-gated-key census entirely. WHAT THIS WAVE BUILDS: the sub-ledger that STORES a learned contrast, its single writer, the first door of the four-door ladder, and the registration. WHAT IT DELIBERATELY DOES NOT BUILD: anything that COMPUTES a habit, DECIDES with one, or CLASSIFIES a circumstance - the class arrives as an argument, and the classifier has no lawful home yet, which is a blocking question for HB-4 rather than a gap here. THE LEDGER IS DROP-WHEN-NEUTRAL AT FOUR LEVELS - the neutral row, the emptied class, the emptied actor, and finally the whole sub-ledger, which drops the spatialLedgers namespace with it when it was the last one - so an emptied world stays byte-identical to a dormant one and this census reads real adoption rather than a materialized container. THE WRITER IS UNCALLED BY DESIGN: writeHabits exists and nothing under src calls it, so the count is structurally zero on every generated world at this wave, and that is the wave identity claim rather than a blind spot. TWO DETERMINISTIC EVICTIONS bound it: rows evict nearest-neutral against the per-actor cap and the pledge book evicts oldest-first against its own, each with a codepoint tiebreak, because consulting insertion order would break replay in an engine whose whole contract is that a seed reproduces. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.habits, which requires both a preset that lights the flag and the credit fold that HB-3 adds to supply a caller.',
    }),
    // No caller is wired, so nothing runs on any tick. REACTIVE rather than per_tick is the
    // honest reading even once HB-3 supplies one: a habit row is written only when an episode
    // actually closes and grades, never on a bare pulse.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledger_is_gated',
        description: 'writeHabits returns its INPUT worldState reference before touching any ledger when the gate is dark, so the key cannot materialize behind a dark switch and a dark world is byte-identical. The gate returns before any allocation, which is what makes setSpatialLedger - the call that CREATES the namespace - unreachable rather than merely unused.',
        check: 'In any v5 receipt whose subsystems.rules records habitConditioningEnabled false or omits it, subsystems.stateKeys carries no spatialLedgers.habits. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'aliveness_reads_the_high-water_mark',
        description: 'A ledger that filled and then drained still proves the doctrine ran, so aliveness is judged on maxEntries rather than finalEntries - the vengeanceLicenses precedent. Drop-when-neutral means a court that learned a contrast and then forgot it back to neutral leaves NO final entry at all, so a final-entries reading would grade a lane that genuinely fired as dead.',
        check: 'For a receipt whose census carries spatialLedgers.habits, maxEntries is greater than zero even where finalEntries is zero. Expressible from the v5 stateKeys census.',
      }),
    ]),
    // ⛔ `indirect`, NOT `unobserved`, and the instrument itself ruled the distinction: a row
    // that DECLARES a channel and still calls the soak blind to it converts a real SILENT into
    // an instrument GAP, and that population is ceilinged at five — *"give the new row a channel
    // the receipt can read, or accept SILENT; do not raise this ceiling."* This row declares
    // `spatialLedgers.habits`, and that channel is REAL and READABLE the day a receipt exists:
    // censusWorldStateKeys walks one level into spatialLedgers, so nothing about the reading is
    // hypothetical — it waits on a preset lighting the flag and on HB-3 supplying a caller, not
    // on an instrument that cannot see. The espionage row above carries the identical sentence
    // for the identical reason.
    soakEvidence: 'indirect',
  }),
  // ── INFORMATION STATECRAFT (D-3, docs/DESIGN_DEEP_COUPLINGS.md) ────────────
  Object.freeze({
    rule: 'infoStatecraftEnabled',
    title: 'Information statecraft (secrecy, sight, lies, credibility)',
    module: 'src/domain/worldPulse/informationStatecraft.js,src/domain/worldPulse/brokerageStamps.js,src/domain/worldPulse/generosityKernel.js,src/domain/worldPulse/npcCredibility.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: the lane returns newsEntries from a
      // pure advance and mints no pulse candidate, so there is no `candidateType`
      // literal in it to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the beats this lane returns classify into `knowledge`,
      // the contaminated residual bucket, which can never carry ALIVE for one row.
      moverFamilies: Object.freeze([]),
      // FOUR channels, and every one is exact: informationStatecraft.js is the SINGLE
      // WRITER of each of these keys in the tree, and advanceInformationStatecraft
      // early-returns on a dark gate before any of them can be touched, so a census
      // reading is dispositive rather than shared. spatialLedgers.beliefMaps is
      // DELIBERATELY NOT DECLARED even though the lie lifecycle writes overrides into
      // it: the beliefs layer owns and populates that container behind its own gate,
      // so claiming it would grade this row alive off another subsystem presence.
      stateKeys: Object.freeze([
        'spatialLedgers.credibility',
        'spatialLedgers.disinfo',
        'spatialLedgers.secrecyPostures',
        'spatialLedgers.sightPostures',
      ]),
      other: 'ONE GATE COMPOSED WITH A SPATIAL PRECONDITION. infoStatecraftActive is beliefsActive (a spatial canon marker present AND infoMode is not omniscient) AND the virtual infoStatecraftEnabled, so an aspatial or omniscient realm reads zero however the flag is set, and that is an absent precondition rather than a dead lane. WHAT IT DOES, in the four movers the gate opens: HIDE (a court chooses a secrecy posture over what it knows), SEE (a rival exposure read against the PRIOR secrecy, so the two are order-independent), THE LIE LIFECYCLE (a plant injected into the target belief map, aged and eventually exposed), and CREDIBILITY AS A STOCK (a signed saturating per-settlement weight consumed by the existing corroboration math, rising slowly on proven-true information and falling sharply on exposed deception, regressed on a generational half-life). EVERY LEDGER IS DROP-WHEN-EMPTY: each of the four is written only when its serialized shape actually changed and is DROPPED rather than written empty, so the census reads real adoption rather than a materialized container. TWO CONJOINED SUB-LANES ride the same flag and are legible only through it: brokerageStamps requires infoStatecraftEnabled AND informationBrokeragesEnabled, and the generosity intel consume requires it alongside intelTradeEnabled and beliefsActive. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt over a spatially canonized realm whose infoMode is not omniscient and whose rules record infoStatecraftEnabled true.',
    }),
    // advanceInformationStatecraft runs every pulse once the gate is open, and the
    // posture ledgers materialize in the first year a court has anything to hide.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledgers_are_gated',
        description: 'advanceInformationStatecraft returns its input worldState unchanged before touching any ledger when the gate is dark, so none of the four keys can materialize behind a dark switch and a dark world is byte-identical.',
        check: 'In any v5 receipt whose subsystems.rules records infoStatecraftEnabled false or omits it, subsystems.stateKeys carries none of spatialLedgers.credibility, spatialLedgers.disinfo, spatialLedgers.secrecyPostures or spatialLedgers.sightPostures. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'sight_reads_the_prior_secrecy',
        description: 'The exposure pass reads the PRIOR secrecy postures rather than the ones this tick just wrote, which is what makes the hide and see movers order-independent. A same-tick read would make the whole layer sensitive to mover ordering.',
        check: 'NOT expressible from a receipt: both postures are aggregated to entry counts by the census. Pinned at the writer in tests/domain/informationStatecraft.test.js.',
      }),
      Object.freeze({
        name: 'credibility_is_asymmetric_and_prunes_to_neutral',
        description: 'Trust builds in years and dies in an afternoon: the stock rises slowly on proven-true information and falls sharply on exposed deception, and a mark that has regressed back inside the prune epsilon is DROPPED rather than persisted at approximately zero. So the ledger records live reputations, never a permanent record of every rumor a town ever repeated.',
        check: 'For any receipt whose census carries spatialLedgers.credibility, its entry count is bounded by the settlement count and does not grow monotonically across observed years. Expressible from the v5 stateKeys census plus receipt.settlements; the asymmetry itself is pinned in tests/domain/informationStatecraft.test.js.',
      }),
    ]),
    // Four exact dispositive channels, instrumented ONLY by the v5 census, and no
    // completed case carries the flag at all. `indirect` on the W-J terms.
    soakEvidence: 'indirect',
  }),
  // ── THE MIGRATION RUMOR CARRIER (D-0, docs/DESIGN_DEEP_COUPLINGS.md) ───────
  Object.freeze({
    rule: 'migrationRumorsEnabled',
    title: 'Migration rumor carrier (the refugee lane)',
    module: 'src/domain/spatial/migrationRumors.js,src/domain/worldPulse/pulseKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and this one is the sharpest trap in the lane. The
      // refugee lane DOES have a vocabulary — `migration_flight` — but it is a RUMOR
      // FEED ENTRY type, not a pulse `candidateType`, and the receipt's
      // eventTypeCounts is folded from the applied candidate records alone. Declaring
      // it would look like the best-evidenced row in this file and would in fact be
      // unreadable by every receipt the estate writes.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the lane authors no beat of its own, and `knowledge` is
      // the contaminated residual.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The lane assembles INPUTS to advanceRumorLedgers, which
      // is the rumor ledger single writer and which armies and smuggle runs already
      // feed on every tick regardless of this flag. Declaring the rumor containers
      // would grade this row alive off the army lane traffic.
      stateKeys: Object.freeze([]),
      other: 'THE LANE ADDS ZERO WRITERS BY DESIGN, WHICH IS ALSO WHY NO RECEIPT CAN SEE IT. ONE GATE: migrationRumorsActive is the virtual migrationRumorsEnabled alone (migrationRumors.js), read from the rules the kernel threads into pulseKernel.js `rumorCarrierParams`. WHAT IT DOES: refugee columns become the third mover-carried rumor lane beside armies and smuggle runs, so migration stops being the world only silent mover. Two products, both gated: migrantPaths (the in-flight columns origin-to-destination legs, fed into the relay fan-out so a column carries the news of the towns it crosses) and flightEntries (the columns THEMSELVES as migration_flight rumor events, seeded at the origin and destination witnesses with standard lineage, fidelity and decay). The magnitude is BANDED — a small departure, a notable displacement, an exodus — and never the exact head count, because that is rumor physics; the event key encodes origin, destination and depart tick so the D-1 demographic axis can recover the direction. LAG IS LAW: migration dispatches AFTER the rumor pass, so a column first relay lands the NEXT tick and news travels behind the column. THE PRE-DRAIN READ: the release pass drains arrived columns early, so the columns are read from the pre-drain state and a column completing its journey still carries news on its final leg. WHY EVERY CHANNEL IS EMPTY: the lane writes nothing of its own — it hands params to an existing single writer whose containers two other carriers already fill. THE OBSERVATION NEEDED to close this gap is a rumor-event-type census in the soak receipt, a per-year count of feed entries by type, which would also give the belief axes above their first readable channel. Until then the lane is pinned where its bodies are readable: tests/domain/migrationRumors.test.js.',
    }),
    // The carrier params are assembled on every pulse the rumor pass runs.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_a_null_and_an_empty_list',
        description: 'With the flag dark the assembly returns migrantPaths null and flightEntries empty, so advanceRumorLedgers behaves byte-identically to the pre-D-0 engine: the refugee lane never fires and no new feed entry seeds.',
        check: 'NOT expressible from a receipt: the rumor containers are fed by the army and smuggle carriers in the same pass, so their presence proves nothing about this lane. Pinned in tests/domain/migrationRumors.test.js against a dark-versus-lit comparison of the assembled params.',
      }),
      Object.freeze({
        name: 'the_net_never_carries_the_head_count',
        description: 'A flight event carries a BAND (departure, displacement, exodus) and never the exact number of people who left. A rumor that carried a census figure would be a truth channel wearing a rumor costume, and the whole D-0 point is that the world learns about migration the way it learns about everything else.',
        check: 'NOT expressible from a receipt: feed-entry bodies are not carried. Pinned in tests/domain/migrationRumors.test.js, where the banded classifier is driven across the two floors.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so.
    soakEvidence: 'unobserved',
  }),
  // ── THE OATH-HOLDER IDENTITY (FP GR-1, docs/DESIGN_FP_GRAMMAR.md §GR-1) ────
  Object.freeze({
    rule: 'oathHolderEnabled',
    title: 'The oath-holder identity (who swore)',
    module: 'src/domain/worldPulse/oathHolder.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the stamp mints no candidate. It rides another
      // subsystem's event — the treaty mint — and there is no `candidateType`
      // literal anywhere in the lane.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The identity authors no beat in this wave, by design:
      // GR-0 owns the lifecycle voice and GR-4 the succession beats. A mover family
      // declared here would grade this row alive off the peace engine's own signing
      // beat, which fires whether or not anyone's name is on the parchment.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and it is the same honest call the two rows around this
      // one make. The stamp is a conditional drop-when-absent FIELD (`sworn`) inside
      // treaty records that live in spatialLedgers.treaties — a container the peace
      // engine fills on every war exit regardless of this flag. Declaring it would
      // grade this row ALIVE off the war layer's presence, and the census counts
      // ENTRIES rather than fields, so no census reading could tell a stamped world
      // from an unstamped one even in principle.
      stateKeys: Object.freeze([]),
      other: 'A ZERO-KEY IDENTITY LAYER, WHICH IS WHY THE CENSUS CANNOT SEE IT AND WHY THAT IS THE CORRECT READING. ONE GATE: oathHolderActive (oathHolder.js) reads oathHolderEnabled by name with the strict === true idiom, and nothing else gates the lane. WHAT IT DOES: a treaty records WHO swore it. The read is composed once, from sanctioned helpers only — governingFactionOf for the faction carrying the seat, ladderFactionKey plus npcInFaction for its seated members (never hand-rolled affiliation matching, which is this estate own faction-key defect class), a codepoint-stable pick over roster ids, and durableIdForRoster for the H1 durable identity when the person has graduated. WHERE IT WRITES: all THREE mint doors of the one treaty writer family — the live-appraisal war mint and the carried-sheet mint, which meet at the head mint loop, and the victor-free sovereignty sale. WHAT IT NEVER DOES: it moves no number. Compliance math is untouched by whose name is on the parchment, because an oath-compliance bonus would be a courage ratchet wearing a ring; the death of an oath-holder voids nothing and mints no beat; no legacy treaty is ever backfilled, so unstamped means the seat swore, forever. WHY EVERY CHANNEL IS EMPTY: the lane adds no container, no candidate type and no beat — it adds one conditional field inside a record another subsystem already writes. THE OBSERVATION NEEDED to close this gap is a per-field treaty census in the soak receipt: a count of treaty records carrying `sworn`, against the count minted in the same span, which would also distinguish a world whose courts have no readable roster from one where the stamp never ran. No receipt schema carries it today because censusWorldStateKeys stops one level into spatialLedgers and counts entries. Until then the lane is pinned where its bodies are readable: tests/domain/oathHolderGr1.test.js, tests/lint/oathStampTotality.walker.test.js and tests/property/oathHolderDormancyFence.test.js.',
    }),
    // The stamp fires only when another subsystem mints a treaty, so it has no tempo
    // of its own to hold. `reactive` is the honest declaration rather than a floor
    // this lane could never be responsible for meeting.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_writes_no_sworn_key',
        description: 'With the flag dark the stamp writer refuses before it reads anything, so a minted treaty serializes byte-identically to the pre-GR-1 engine. Absent, never null and never an empty object: an empty object is a key and a key is a byte.',
        check: 'NOT expressible from a receipt: the census counts treaty ENTRIES, never their fields, and a dark world mints exactly as many treaties as a lit one. Pinned in tests/property/oathHolderDormancyFence.test.js, where the own-footprint fence runs on a fixture that DOES stamp when lit.',
      }),
      Object.freeze({
        name: 'all_three_mint_doors_stamp_or_the_walker_reds',
        description: 'The treaty writer family has three mint doors — the live-appraisal war mint, the carried-sheet mint, and the victor-free sovereignty sale. A door that minted an unstamped treaty would make the signature line silently depend on which road a peace came home by, and a fourth door added later would inherit the same silence.',
        check: 'NOT expressible from a receipt: a receipt cannot say which road minted a document. Pinned behaviourally in tests/domain/oathHolderGr1.test.js (all three roads driven lit) and structurally in tests/lint/oathStampTotality.walker.test.js, which reds when a module writes the treaties ledger without reaching the one stamp writer.',
      }),
      Object.freeze({
        name: 'the_same_seat_swears_again_after_a_regeneration',
        description: 'THE PROMISE: a seed is a world, forever. Re-deriving the world and re-minting the treaty must put the SAME person on the parchment, which holds because the pick is a codepoint-stable read over roster ids and carries no PRNG, no clock and no ladder score that an unrelated retune could move.',
        check: 'NOT expressible from a receipt: receipts record no signatory. Pinned in tests/domain/oathHolderGr1.test.js against a re-minted treaty, with the codepoint tie-break reversal executed as a mutant so the pin is proven to see.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so.
    soakEvidence: 'unobserved',
  }),
  // ── PEACETIME FORMATION (FP GR-2, docs/DESIGN_FP_ARCH_GR.md §GR-2) ─────────
  Object.freeze({
    rule: 'pactFormationEnabled',
    title: 'Peacetime pact formation (the standalone NAP)',
    module: 'src/domain/worldPulse/pactFormation.js,src/domain/worldPulse/pactProposals.js,src/domain/worldPulse/pactTriggers.js,src/domain/worldPulse/pactAmendment.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the lane mints no `candidateType` literal. Its whole story
      // rides receipts and the relationship record's turning-point archive, and the DM
      // verb that would carry a candidate type is GR-2b's declared slice.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and it is a design commitment rather than an omission: GR-2
      // mints ZERO new `wizard_news` kinds. Declaring a mover family here would grade this
      // row alive off the peace engine's own signing beat, which fires for a war's end and
      // has nothing to do with whether two courts at peace ever wrote anything down — the
      // recorded moverFamily hazard, exactly.
      moverFamilies: Object.freeze([]),
      // THE ONE CHANNEL THAT IS REAL. `spatialLedgers.pactProposals` is a container this
      // subsystem OWNS outright and is the only writer of, and the v5 census reads one
      // level into spatialLedgers and counts entries — so a lit world that has opened a
      // proposal is distinguishable from a dark world by the census alone. That is a
      // stronger channel than either of this lane's siblings has, and it is why this row
      // can be graded rather than only pinned.
      stateKeys: Object.freeze(['spatialLedgers.pactProposals']),
      other: 'THE SECOND DOOR INTO THE ONE INSTRUMENT-BEARING LEDGER, and the first that needs no war. ONE GATE: pactProposals.pactFormationActive reads pactFormationEnabled by name with the strict === true idiom, and it sits at the ledger writer door because that is the door nothing can write past. WHAT IT DOES: four closed peacetime occasions - a believed trade demand, a believed communion of rite, a believed migration pressure, and a shared threat read through WR-6 alliance-web risk - score from BELIEF on both ends, and a crossing opens a proposal whose answer is owed on a date the roads set (two hopWeeks legs plus a deliberation, so a far court answers slowly by physics). The counterparty answers under its OWN reserve, composed from SP-C posture and risk appetite and raised by the proposer oathbreaker credibility, and the answer is a TWO-SIDED CONJUNCTION: the offer must clear the reserve AND the dependency fear must not win. Both sides sign, or the refusal is remembered as a turning point and a banded trust delta with no grievance and no casus. WHAT IT MINTS: the same treaty record a war end mints, provenance negotiated, carrying a lineage - so a pair that already holds an instrument gets a NEW CLAUSE rather than a second document, which is how one treaty per unordered pair survives a door that cannot refuse. WHAT IT NEVER DOES: it mints no news kind, no grievance, no casus, no second mediation finder and no second alliance web; it never backfills a legacy record, and it never reads a counterparty true state - a court knows itself and believes its neighbour. WHY THE OTHER TWO CHANNELS ARE EMPTY: the lane adds no candidate type and no beat by design, both deferred by name to GR-2b and GR-3. THE OBSERVATION NEEDED to move this row past ALIVE into a graded formation-versus-dictation ratio is GR-7 charter: the treaty section of the convergence collector, counting negotiated against dictated provenance and the endings mix. Until then the lane is pinned where its bodies are readable: tests/domain/pactTriggers.test.js, tests/domain/pactProposals.test.js, tests/domain/pactFormation.test.js, tests/domain/pactAmendment.test.js and tests/property/pactFormationDormancyFence.test.js.',
    }),
    // The lane runs every tick but only ACTS on a crossing, and a crossing needs beliefs a
    // dark belief layer never writes. `rare` is the honest member of the closed tempo
    // vocabulary: this lane has a cadence of its own (unlike `reactive`, which fires only
    // when another subsystem acts) but no year is owed a pact, so its floor share is zero.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_writes_no_pact_proposals_key',
        description: 'With the flag dark the stage returns the SAME worldState and settlementUpdates references before reading anything, so no `pactProposals` key is ever created and an emptied ledger drops the key rather than persisting an empty array. Absent, never null and never `[]`: a key is a byte.',
        check: 'Expressible from the v5 subsystems section alone: subsystems.stateKeys carries spatialLedgers.pactProposals only when subsystems.rules.pactFormationEnabled is true. Also pinned behaviourally in tests/property/pactFormationDormancyFence.test.js, whose own-footprint fence runs on a fixture that DOES open a proposal when lit.',
      }),
      Object.freeze({
        name: 'one_instrument_per_pair_survives_a_door_that_cannot_refuse',
        description: 'The war door and the sale door keep the one-treaty-per-unordered-pair law by REFUSING. A peacetime formation cannot refuse and keeps it by APPENDING, so a pair holding a live sale deed that signs a grain pact ends with ONE ledger record carrying both, and the sale door refusal behaviour is unchanged.',
        check: 'NOT expressible from a receipt: the census counts ledger ENTRIES and cannot say which road wrote them. Pinned in tests/domain/pactFormation.test.js by the sale-coexistence fixture, which mints a sale, signs a pact over it, asserts exactly one record at the pair key, and asserts mintSovereigntySaleTreaties still refuses that pair with its own unchanged word.',
      }),
      Object.freeze({
        name: 'the_counterforce_can_win_on_the_forces_own_evidence',
        description: 'The dependency fear is priced from the demand magnitude that raised it, read through the pair existing dependency and leverage axes. It is a live band in BOTH directions: at low reliance it never refuses, and at high reliance it refuses a bargain that the demand alone would have signed. A counterforce that could not win would be the recorded dead-band class wearing a design clothes.',
        check: 'NOT expressible from a receipt: no receipt carries a counterfactual. Pinned in tests/domain/pactFormation.test.js, where ONE fixture is run twice with only the relationship reliance axes changed and the two verdicts differ, and in tests/domain/pactTriggers.test.js at the arithmetic level.',
      }),
    ]),
    // ── `indirect`, NOT `unobserved`, AND THE PRECEDENT IS THE ESTATE'S OWN ──────────
    // Every sibling row in this lane declares `unobserved`, because none of them has a
    // channel a receipt can read and saying otherwise would be a shrug dressed as a
    // verdict. THIS ROW HAS ONE: `censusWorldStateKeys` walks one level into
    // `spatialLedgers`, so the proposal ledger is enumerated by every v5 envelope exactly
    // as `spatialLedgers.demographicPlans` is — and wave P4's row records the identical
    // move for the identical reason, "from soakEvidence unobserved to indirect, which is
    // what keeps the reviewed override set at its ceiling of five instead of growing to
    // six". Declaring a channel AND calling the soak blind to it converts a real SILENT
    // into an instrument gap; `tests/domain/subsystemCertificationCorpus.test.js` ceilings
    // that escape hatch at five and this row would have been the sixth.
    //
    // HOW TO READ THE SILENT THIS NOW ALLOWS, because it has a legitimate cause: the
    // proposal ledger exists only where a pair CROSSED a peacetime occasion and settled
    // rows prune, so a realm whose courts never wanted anything from each other — or one
    // where every question was answered before the sample — holds no key at all. That is
    // a quiet world, not a broken lane.
    soakEvidence: 'indirect',
  }),
  // ── THE SOVEREIGNTY MARKET (WR-10 amendment S, the conveyance) ─────────────
  Object.freeze({
    rule: 'sovereigntyTradeEnabled',
    title: 'The sovereignty market (settlement conveyance)',
    module: 'src/domain/worldPulse/sovereigntyTransfer.js,src/domain/worldPulse/sovereigntyAssets.js,src/domain/worldPulse/sovereigntyAppraisal.js,src/domain/worldPulse/sovereigntyBundle.js,src/domain/worldPulse/sovereigntyReach.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: the conveyance mints no candidate.
      // It executes inside the treaty mint, which is the peace engine's own event,
      // and there is no `candidateType` literal anywhere in the sovereignty lane.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The war annex authors FIFTEEN Herald kinds for this
      // market and not one of them exists in code yet; the writer returns typed
      // news SEEDS that no registry can render. Declaring a mover family before the
      // rows exist would be the row asserting a channel the engine cannot fill.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, AND THIS ONE IS THE ROW'S WHOLE POINT rather than a gap.
      // A conveyance adds NO persisted key: it rewrites records inside containers
      // that already exist and that other subsystems fill — the satellites ledger
      // (the settlement-lifecycle layer writes it every tick), the occupations
      // ledger (the war layer's), and the treaties ledger (the peace engine's).
      // Declaring any of them would grade this row ALIVE off another subsystem's
      // presence, exactly the false reading the belief-axes row above refuses, and
      // it would be worse here: those three containers are populated in worlds where
      // this flag has never been true. The census counts ENTRIES, and a conveyance
      // changes FIELDS INSIDE entries without changing their number, so no census
      // reading could separate the two worlds even in principle.
      stateKeys: Object.freeze([]),
      other: 'A ZERO-KEY SUBSYSTEM, WHICH IS WHY THE CENSUS CANNOT SEE IT AND WHY THAT IS CORRECT. ONE GATE: sovereigntyTradeActive (sovereigntyAssets.js) reads the market own flag by name and then the whole SOVEREIGNTY_REQUIRED_RULES conjunction — WR-7 six envoy prerequisites plus demographics plus this key — so a receipt that lit this key alone would still read zero, and that is a correct reading of an absent precondition rather than a dead lane. WHAT IT DOES: a settlement changes hands. Only two things are conveyable, and eligibility is derived from LEDGER MEMBERSHIP rather than from any user-placed marker (there is no such field in the tree, so a deny-list would have made every DM-placed settlement a commodity): a steading named by the satellites ledger, and an occupation that has climbed to the vassalized rung. The conveyance executes ONE-SHOT at treaty mint, because sovereignty is stream:false and transfers once; the wartime cession an envoy carries home and the peacetime sale a market clears reach the same mint and the same single writer. WHAT IT REWRITES: a steading row moves between parent cells with its orbit re-derived at the destination, or an occupation occupierId is rewritten IN PLACE with the vassalized rung preserved and its resistance raised to a fragility floor. WHAT IT NEVER WRITES: settlement.parentRef, the regional lineage edge, population, and any new key. THE OBSERVATION NEEDED to close this gap is a per-record provenance census in the soak receipt — a count of satellite rows carrying `conveyed` and of occupations whose sinceTick post-dates their state — which no receipt schema carries today because censusWorldStateKeys stops one level into spatialLedgers and counts entries. Until then the lane is pinned where its bodies are readable: tests/domain/sovereigntyTransferWr10w.test.js and tests/property/sovereigntyTradeDormancyFence.test.js.',
    }),
    // A treaty carrying a cession is the rarest document the war layer produces, and
    // the conveyance fires only from one. `rare` has no tempo floor beyond a single
    // firing anywhere in the span, which is the honest expectation here.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'zero_new_persisted_keys',
        description: 'A conveyance adds no top-level key and no ledger. It rewrites existing records in their existing homes, plus two conditional drop-when-absent fields (TermRecord.assetId on a cession clause, SatelliteRecord.conveyed on a sold steading), so a world that never traded is byte-identical to the pre-WR-10 engine.',
        check: 'NOT expressible from a receipt: the containers it rewrites are filled by three other subsystems in worlds where this flag was never true. Pinned in tests/property/sovereigntyTradeDormancyFence.test.js, where the flag own footprint is compared against its own input across a drive that DOES convey when lit.',
      }),
      Object.freeze({
        name: 'the_rung_survives_the_sale',
        description: 'A vassalage changes overlord without changing rung. The only pre-existing occupier-change writer resets the ladder to contested at resistance 0.35, which would hand a buyer a fight instead of the holding it bought and would make the settlement immediately unconveyable again. The sale restarts the tenure clock and raises resistance; it never demotes.',
        check: 'NOT expressible from a receipt: the census counts occupation ENTRIES, never their rungs. Pinned in tests/domain/sovereigntyTransferWr10w.test.js, where the same predicate is run against the reset path as an executed mutant and must catch it.',
      }),
      Object.freeze({
        name: 'history_and_the_lineage_edge_are_never_rewritten',
        description: 'settlement.parentRef is the immutable founding receipt and the regional lineage edge is the live political bond; a sale rewrites NEITHER. So the market cause and the WR-3 lineage cause compose rather than overwrite: after a conveyance the world can still say both who holds this town now and which line founded it.',
        check: 'NOT expressible from a receipt: parentRef lives on the settlement save, outside every worldState census. Pinned in tests/domain/sovereigntyTransferWr10w.test.js, where the conveyance write is scanned for the field and the lineage question is asked both ways on the same fixture afterwards.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so. Like the belief
    // axes above, it declares nothing rather than declaring a channel it cannot own.
    soakEvidence: 'unobserved',
  }),
  // ── THE LIFECYCLE VOICE (FP GR-0, docs/DESIGN_FP_GRAMMAR.md §GR-0) ─────────
  Object.freeze({
    rule: 'treatyLifecycleVoiceEnabled',
    title: 'The pact lifecycle voice (lapse, detection, longevity)',
    module: 'src/domain/worldPulse/treatyLifecycleVoice.js,src/domain/worldPulse/grammarNews.js,src/domain/worldPulse/grammarReceiptPools.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the voice mints no candidate. It observes two moments the
      // peace engine already executes and there is no `candidateType` literal in it.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, AND THE TEMPTATION HERE WAS REAL. This lane DOES own two
      // news kinds outright, so a row could be written that names them — and that is
      // precisely the standing moverFamily hazard: BEHAVIORAL_MOVER_FAMILIES is a closed
      // ten-member vocabulary of BEHAVIOURAL families, not a list of wizard_news kinds,
      // and the only member these beats could ride is `war`, which would grade this row
      // ALIVE off the entire war layer's traffic in worlds where the flag has never been
      // true. The kinds are certified by their own walker instead.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The voice adds no persisted key at all: the beats are
      // per-tick emissions and `ageYears` is a read. Declaring the treaties ledger
      // would grade this row ALIVE off the peace engine's own writes, which populate
      // that container in worlds where this flag has never been true.
      stateKeys: Object.freeze([]),
      other: 'A ZERO-KEY READER LAYER THE CENSUS CANNOT SEE, AND THAT IS THE CORRECT READING. ONE GATE: treatyLifecycleVoiceActive (treatyLifecycleVoice.js) reads treatyLifecycleVoiceEnabled by name with the strict === true idiom, and nothing else gates the lane. WHAT IT DOES: the pact grammar learns to speak at two moments it has always executed in silence. THE LAPSE BEAT fires at the prune that retires a spent instrument (peaceTerms PASS 2, where every term has reached its own expiry) and names both courts, the term that closed the document, the age in BAND WORDS on the treaty own clock marker, the recorded ending, and the warning clause that the road between them is open again — which is true the same tick, because the war layer eligible-target read starts returning the pair the moment the instrument leaves the ledger. THE DETECTION BEAT fires on the OBSERVED CROSSING out of honored, never on the level: evolveCompliance runs every tick on every live term, so a beat keyed on the state would narrate one standing shortfall fifty-two times a year, and a treaty minted THIS tick is refused because one observation is a level rather than a transition. THE FOG IS THE LAW: an undetected cheat mints NOTHING in any feed, because the engine models what courts believe and an unbelieved default is not yet a story. WHAT IT NEVER DOES: it writes no world state, feeds no disposition learning, and never speaks the ground-truth ending — hollowed_quiet is a real vocabulary member this lane produces and deliberately does not publish, because a news entry carries no per-key ground-truth projection to strip it behind. THE OBSERVATION NEEDED to close the remaining gap is the endings MIX rather than the count: a per-year distribution over the closed pact-endings vocabulary, which GR-7 collector section owes. Until then the lane is pinned where its bodies are readable: tests/domain/treatyLifecycleVoice.test.js, tests/lint/grammarLifecycleKindPools.walker.test.js and tests/property/treatyLifecycleVoiceDormancyFence.test.js.',
    }),
    // Both beats ride the peace engine's own mover, which runs every pulse; the beats
    // themselves are rare by construction (a pact lapses once, a court crosses once).
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_mints_no_kind',
        description: 'With the flag dark neither composer is reached, so the news stream is byte-identical to the pre-GR-0 engine and no new kind can appear in any feed. The fence runs with dispositionChannelsEnabled DARK as well, because WR-2 disposition deltas fire at the SAME two sites and would otherwise be read as this lane\'s footprint.',
        check: 'PARTLY expressible from a receipt: a kind census over the stream would show zero of both. Pinned directly in tests/property/treatyLifecycleVoiceDormancyFence.test.js against a fixture that DOES mint both when lit — the lit-mutant control, without which the fence proves only that the fixture is quiet.',
      }),
      Object.freeze({
        name: 'an_undetected_cheat_stays_silent',
        description: 'A term whose TRUE delivery has failed while the owed court\'s monitoring reach sits under DETECT_FLOOR mints no beat, carries no chip on a free surface, and ends the pact as ran_its_term in every public reading. Law One: the engine models what courts believe.',
        check: 'NOT expressible from a receipt: receipts carry no ground truth by construction. Pinned in tests/domain/treatyLifecycleVoice.test.js, where the same fixture is driven with the monitor above and below the floor and the two streams compared.',
      }),
      Object.freeze({
        name: 'the_detection_beat_is_a_transition_not_a_level',
        description: 'A standing default mints exactly one detection beat, at the crossing. The pin is driven over TWO ticks — a single-tick harness cannot tell a crossing from a level, and certifying one against such a harness is the vacuity class this estate has been bitten by.',
        check: 'NOT expressible from a receipt: a per-year count could not distinguish one crossing from fifty-two levels without the stream itself. Pinned in tests/domain/treatyLifecycleVoice.test.js on a two-tick fixture, with the crossing guard removed as an executed mutant.',
      }),
    ]),
    // The kinds exist in code but no soak has yet observed their distribution.
    soakEvidence: 'unobserved',
  }),
  // ── THE CASUS COMMERCII (FP TR-1, docs/DESIGN_FP_TRADE.md §TR-1) ───────────
  Object.freeze({
    rule: 'casusCommerciiEnabled',
    title: 'The casus commercii (commerce\'s typed reason ledger)',
    module: 'src/domain/worldPulse/commercialReasons.js,src/domain/worldPulse/commercialReasonTaxonomy.js,src/domain/worldPulse/commercialReasonsNews.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the ledger mints no candidate. It is RECOMPUTED each
      // pulse from state another layer already owns and it emits typed facts about
      // what that state is; there is no `candidateType` literal anywhere in the lane.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and the temptation was the same one GR-0 records below:
      // this lane authors NINETEEN Herald reader kinds outright, so a row could name a
      // family and look richer than its neighbours. BEHAVIORAL_MOVER_FAMILIES is a
      // closed ten-member BEHAVIOURAL vocabulary, not a list of reader kinds, and the
      // only members these receipts could ride are `economy` and `war` — either of
      // which would grade this row ALIVE off the trade and war layers' ordinary
      // traffic in worlds where this flag has never been true.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, AND THIS IS THE ROW'S SHARPEST CALL. The container
      // `spatialLedgers.commercialReasons` is real, is this lane's own, and has
      // exactly ONE writer (advanceCommercialReasons in commercialReasons.js). It is
      // still not declarable, because that writer HAS NO CALLER IN src/ — measured,
      // not assumed: the only cross-module import of the leaf is tradeWar.js's
      // `makeCommercialPressureRead`, which READS the ledger at the T9 seam. So no
      // world can populate the container, and a declared channel would grade this row
      // SILENT — "instrumented, and the subsystem minted nothing" — forever, when the
      // truth is that nothing ever ran. Under-claiming rots exactly like over-claiming;
      // the difference is that this one would read as an instrument rather than as
      // modesty. The declaration lands the day the writer is mounted, not before.
      stateKeys: Object.freeze([]),
      other: 'A DARK INSTRUMENT WITH NO MOUNT, WHICH IS WHY EVERY CHANNEL IS EMPTY AND WHY THAT IS THE CORRECT READING. TWO GATES, both by name and both strict: casusCommerciiActive (commercialReasons.js) is the leaf\'s own read, and evaluateTradeWar (tradeWar.js) reads the key a second time at the T9 escalation seam rather than through a frozen-list conjunction — the spelling that hides a live gate from the engine-gated-key census. WHAT IT DOES: commerce gains the typed, receipted, decay-inherent reasons layer war has carried since W-PEACE-1. Eight severance causes and eight partnership mirrors form a walker-enforced bijection over ONE read per pair (the toll that gouges is the toll that, relieved, warms), recomputed each pulse from existing state so decay is inherent and a healed cause DROPS rather than ratcheting. Three pairs read live state today — the entrepot toll, the no-trade access predicate, and pair trade salience signed by the relationship\'s own trust and resentment; five are registered seams passed undefined until their producers land, which yields zero, no record, and a byte-identical world. WHAT IT NEVER DOES: it mints no casus belli and imports no war table (J-TR-2). The war coupling runs ONE way through ONE door — tradeWar\'s existing escalation deposit reads a severance magnitude as pressure and adds it to the PROBABILITY only, never to the strength short-circuit, so the rng draw count is identical in both flag states. WHY THE CENSUS CANNOT SEE IT: the lane adds no candidate vocabulary, no mover beat and, today, no reachable container. THE OBSERVATION NEEDED to close the gap is not a better receipt but a WIRING WAVE: mount advanceCommercialReasons on the pulse, and the v5 state census over spatialLedgers.commercialReasons grades this row directly, at which point the stateKeys channel above is owed. Until then the lane is pinned where its bodies are readable: tests/domain/commercialReasons.test.js, tests/lint/commercialReasonTaxonomy.walker.test.js, tests/lint/commercialKindPools.walker.test.js and tests/property/casusCommerciiDormancyFence.test.js.',
    }),
    // Recomputed from state on every pulse THE DAY IT IS MOUNTED, so no tempo of its
    // own to hold: a pair with no grievance produces no record, and that is the layer
    // working. `reactive` is the honest declaration rather than a per_tick floor the
    // lane could only meet in a world full of angry courts.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical_including_the_draw_count',
        description: 'With the flag dark the ledger is never opened, no record is written, and the T9 seam never sees a commercial term. The claim is stronger than "similar": the pressure read is added to the escalation PROBABILITY only, never to the strength short-circuit above it, so the rng draw count is identical in both flag states and a dark world is byte-for-byte the pre-TR-1 engine.',
        check: 'NOT expressible from a receipt: an absent container is exactly what a dark world and an unmounted world both look like. Pinned in tests/property/casusCommerciiDormancyFence.test.js on an absent-versus-explicit-false differential over the whole return value, with a call-path spy counting 0 dark and 1 lit from OUTSIDE tradeWar.js.',
      }),
      Object.freeze({
        name: 'every_severance_cause_has_its_authored_mirror',
        description: 'The taxonomy is a TOTAL BIJECTION: eight severance types, eight partnership types, and no cause may be minted by a wave that has not already authored its mirror and both receipt pools. A one-sided taxonomy is how a grievance ledger starts ratcheting, because the state that would clear a cause has no row to write.',
        check: 'NOT expressible from a receipt: receipts carry rendered sentences, never the taxonomy behind them. Pinned in tests/lint/commercialReasonTaxonomy.walker.test.js, with a ninth unmirrored severance type executed as a mutant that reds four assertions.',
      }),
      Object.freeze({
        name: 'a_contradicted_grievance_scores_zero_and_says_which_read_struck_it',
        description: 'Amendment B: a casus contradicted by a LIVE read scores zero and returns a receipt NAMING the read that struck it out — a famine-profiteering grievance against a counterpart whose warehouses are physically empty is not a small grievance, it is a false one. The suppression receipt is RETURNED, never persisted, because a zero-magnitude row on the ledger would be the ratchet this layer refuses.',
        check: 'NOT expressible from a receipt: a suppression that never persists cannot appear in a state census by construction. Pinned in tests/domain/commercialReasons.test.js, with the suppression conjunct severed as an executed mutant that reds the receipt pin.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so.
    soakEvidence: 'unobserved',
  }),
  // ── SETTLEMENT POLITICS (coherence, worldPulse/settlementPolitics.js) ──────
  //
  // JOINED 2026-08-14 BY GAP-1, AND IT IS THE FIRST ROW IN THIS LANE WHOSE KEY DID NOT
  // ARRIVE WITH ITS FIRST GATE READ. Every row above landed under CR-WR10-C item 4's
  // atomicity: manifest entry, first by-name gate read, and certification row in one
  // commit. This gate has been in the tree since the politics layer landed. What
  // changed is the INSTRUMENT — the census walker's detector pinned its receiver to
  // the literal tokens `rules` and `simulationRules`, and this layer's door reads
  // through a JSDoc-cast alias local, so the key was structurally invisible to the
  // census that exists to demand exactly this row. The atomicity law is therefore
  // satisfied in spirit: the manifest entry and the row land with the DETECTION.
  Object.freeze({
    rule: 'settlementPoliticsEnabled',
    title: 'Settlement politics (ruling blocs and coalition consolidation)',
    module: 'src/domain/worldPulse/settlementPolitics.js,src/domain/worldPulse/settlementStrategy.js,src/domain/worldPulse/warSeatBooks.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The lane mints no `candidateType` literal at all —
      // re-measured by the trace in tests/domain/subsystemRowsVirtual.test.js, which
      // scans this lane's own leaf and finds zero. The evidence law forbids declaring
      // a vocabulary the lane does not spell.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The layer authors no Herald beat of its own, and the only
      // BEHAVIORAL_MOVER_FAMILIES member its consequences could ride is one the war
      // and strategy lanes already fill for their own reasons — it could never carry
      // ALIVE for this row alone.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the row's hardest honest call. The blocs live
      // as a per-settlement facet the strategy layer's own containers already carry;
      // there is no `spatialLedgers.*` key this lane owns outright. Declaring a
      // container another gate fills would grade this row alive off THAT layer's
      // presence — the shared-container failure the statecraft row's beliefMaps
      // exclusion already records, and the one this cohort refuses by construction.
      stateKeys: Object.freeze([]),
      other: 'THIS SUBSYSTEM IS STRUCTURALLY INVISIBLE TO EVERY RECEIPT SHAPE THE ESTATE WRITES, and saying so is the row. ⚠ ONE GATE, AND IT IS A CONJUNCTION: settlementPoliticsActive (settlementPolitics.js) requires settlementPoliticsEnabled === true AND factionCompetitionEnabled === true. The second conjunct is DEFAULT_SIMULATION_RULES-declared true and lit at full_simulation, so lighting settlementPoliticsEnabled ALONE genuinely lights this layer — the row says so explicitly because the opposite reading (that two owner acts are needed) would understate the blast radius of a single flag flip at THE ONE REGEN. WHAT IT DOES: a settlement whose factions compete resolves a RULING BLOC — a codepoint-stable composite id over its member factions — and tracks that bloc\'s coalitionConsolidation01 across ticks, which the strategy layer reads as a decision-load modifier and the war seat books read when apportioning seats. The tuning table (DECISION_LOAD_SPAN, RULING_CONSOLIDATION_FLOOR) and the vocabulary (blocId, ruling bloc, coalitionConsolidation01) are the module\'s own, which is what makes it a subsystem by every criterion CR-WR10-C names rather than a modifier on somebody else\'s. WHY EVERY CHANNEL IS EMPTY: the lane mints no candidate (re-measured, zero candidateType literals in its leaf); it authors no beat; and its state is a facet inside containers the strategy layer owns and fills under its own gate. THE OBSERVATION NEEDED to close this gap is a per-settlement bloc census in the soak receipt — a count, per observed year, of settlements carrying a resolved blocId, with the consolidation band — which no receipt schema carries today because censusWorldStateKeys stops one level into spatialLedgers and counts entries rather than facets. Until such an observation exists the layer is pinned where its bodies are readable instead: tests/property/settlementPoliticsDormancyGolden.test.js holds the dormancy golden, and a dark advance is compared field-by-field against a lit one there.',
    }),
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_absence_of_the_bloc_facet',
        description: 'Law 12 (dormancy by absence): with either conjunct dark the bloc facet is never written, so a settlement serializes byte-identically to the pre-politics engine. settlementPoliticsEnabled has NO entry in DEFAULT_SIMULATION_RULES, so a campaign that never lit it carries zero bytes for this layer — the virtual-flag dormancy idiom, executed.',
        check: 'NOT expressible from any receipt schema the estate writes: the census counts container ENTRIES, never their facets. Pinned in tests/property/settlementPoliticsDormancyGolden.test.js, where a dark advance is compared field-by-field against a lit one.',
      }),
      Object.freeze({
        name: 'the_bloc_id_is_a_stable_composite_never_a_name',
        description: 'The ruling bloc id is the codepoint-sorted join of its member factions stable parts, so a faction RENAME that re-mints a member stablePart re-mints the id rather than silently carrying a stale one. Membership is re-validated each tick and a bloc dropping below the member floor dissolves rather than persisting as a ghost.',
        check: 'NOT expressible from a receipt: no census reads bloc identity, and a re-minted id is indistinguishable from a new bloc in an entry count. Pinned at the writer in tests/domain/settlementPolitics.test.js.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so. It is NOT in the
    // ceilinged escape-hatch population (that set is rows which DECLARE a channel and
    // still call the soak blind to them); this row declares nothing, which is the
    // stronger and more honest statement.
    soakEvidence: 'unobserved',
  }),
  // ── THE UNDERWAYS, ORGANIC FOUNDING (D6 coupling 5, institutionLifecycle.js) ──
  //
  // JOINED 2026-08-14 BY GAP-1, on the same footing as the row above: the gate read is
  // not new, the DETECTION is. This one hid behind a `||`-defaulted parenthesised
  // receiver expression rather than an alias local.
  //
  // ⚠⚠ THE ONE ROW IN THIS COHORT WHOSE LANE LEAF MINTS A CANDIDATE TYPE, AND THE
  // REASON THE COHORT'S EMPTY-EVENTTYPES CLAIM HAD TO BE PARTITIONED RATHER THAN
  // ASSERTED FLAT. institutionLifecycle.js spells `candidateType: 'institution_build'`
  // and `candidateType: 'institution_closure'`. NEITHER IS DECLARABLE HERE, and the
  // reason is the evidence law rather than modesty: `institution_build` is minted from
  // the TOP-AFFINITY member of a gap set fed by downstream chains, resource needs and
  // martial emergence weighting; this flag opens exactly ONE additional gap
  // (`via: 'underways'`, village tier and above) and only when that gap wins the sort.
  // The literal is therefore SHARED, it is ALREADY declared by
  // institutionLifecycleEnabled's own row, and declaring it a second time here would
  // grade this row ALIVE off another subsystem's traffic in worlds where this flag has
  // never been true — precisely what the statecraft row's beliefMaps exclusion refuses.
  // `institution_closure` is not on this flag's path at all. The cohort test now
  // ENUMERATES both literals against a written shared-literal reason instead, so the
  // under-claim is as loud as an over-claim would be.
  Object.freeze({
    rule: 'underwaysOrganicFoundingEnabled',
    title: 'The underways (organic clandestine founding)',
    module: 'src/domain/worldPulse/institutionLifecycle.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and uniquely in this lane the emptiness is an
      // ATTRIBUTION fact rather than a shape or mount fact: the lane's leaf really
      // does mint candidate literals, and neither is separable from the institution
      // lifecycle layer that mints them for a dozen other reasons. See the section
      // comment above, and the enumerated shared-literal ledger in
      // tests/domain/subsystemRowsVirtual.test.js.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The lane authors no Herald beat; the founding surfaces
      // through the institution lifecycle's own existing news, under that layer's gate.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The founded institution lands in the settlement's own
      // institution roster — a container the settlement generator and the institution
      // lifecycle layer both fill under their own gates, and which is populated in
      // every ordinary world, so it can never carry ALIVE for this row alone.
      // ⚠ The roster is named in WORDS here rather than as a dotted member access on
      // purpose: tests/lint/ruinFilterRoster.walker.test.js scans raw source for that
      // access with no comment or string blanking, so writing it would enrol this
      // pure-data row as a false "reader" of a roster it never touches. Recorded
      // rather than worked around silently — see this wave's receipt.
      stateKeys: Object.freeze([]),
      other: 'THIS SUBSYSTEM IS STRUCTURALLY INVISIBLE TO EVERY RECEIPT SHAPE THE ESTATE WRITES, and saying so is the row. ONE GATE: evaluateInstitutionLifecycle reads underwaysOrganicFoundingEnabled === true off the RAW rules — the flag is ABSENT from DEFAULT_SIMULATION_RULES, the npcLadder/heirs dormancy idiom — and threads the resulting underwaysFoundingLit into detectInstitutionGaps as an option. WHAT IT DOES: a settlement at village tier or above with a sustained criminal underground (a vice-nature institution present, read as a FACET rather than by name) and no existing clandestine institution gains ONE additional buildable gap, the excavated tunnel network, which then competes on affinity with every other gap and, if it wins and clears the build roll, becomes a real institution. THE MINE-FOUNDS-ITSELF PATTERN, applied to crime. WHY IT TOOK A ROW RATHER THAN AN EXEMPTION: it writes a real container — an institution — rather than re-ranking one somebody else writes, and exempting a real container writer is the shrug the exempt list exists to refuse (R19). WHY EVERY CHANNEL IS EMPTY: the candidate literals its leaf mints are SHARED with the institution lifecycle layer and already declared by that layer\'s row, so declaring them here would grade this row alive off traffic this flag never caused; the institution it founds lands in a container every ordinary world already populates. THE OBSERVATION NEEDED to close this gap is a per-founding PROVENANCE count in the soak receipt — a count, per observed year, of institution_build candidates whose gap kind is clandestine, or equivalently whose gap carried via: underways — which no receipt schema carries today because the candidate census counts candidateType literals and never the gap kind that produced them. Until such an observation exists the layer is pinned where its bodies are readable instead: tests/domain/institutionLifecycle.test.js, where a dark evaluate is compared against a lit one with the clandestine gap present.',
    }),
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_the_absent_gap_not_a_dead_lookup',
        description: 'Law 12 (dormancy by absence): dark, detectInstitutionGaps never opens the clandestine gap, so the gap set, the affinity sort and every downstream candidate are byte-identical to the pre-D6 engine. ⚠ The dormancy is now the FLAG and no longer a dead catalog lookup: the Underground network entry EXISTS on this lineage, so the resolver really does resolve and only the gate stands between a dark world and a lit one.',
        check: 'NOT expressible from a receipt: the census counts candidateType literals and cannot see which gap kind produced a build. Pinned in tests/domain/institutionLifecycle.test.js, comparing a dark evaluate against a lit one on a settlement that satisfies every other precondition.',
      }),
      Object.freeze({
        name: 'the_vice_signal_is_a_facet_read_never_a_name_match',
        description: 'The criminal-underground precondition is read as an institutionNature facet equal to vice, and the skip condition as an institutionFunction facet equal to clandestine — never as a name or tag string match. A settlement whose tunnels are named anything at all is still recognised as already having them, and a renamed vice institution still signals.',
        check: 'NOT expressible from a receipt: no census carries institution facets. Pinned at the reader in tests/domain/institutionLifecycle.test.js, with a renamed fixture proving the facet read rather than the name.',
      }),
      Object.freeze({
        name: 'the_tier_floor_is_village_and_it_binds',
        description: 'Excavation needs labor, so the gap opens only at village tier and above. A thorp with a thriving vice institution gains nothing, which keeps the layer from founding tunnels in settlements that could not dig them.',
        check: 'NOT expressible from a receipt: the census carries no per-settlement tier at candidate time. Pinned at the boundary in tests/domain/institutionLifecycle.test.js, with a thorp fixture and a village fixture differing in exactly the tier.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so — and here that is
    // an ATTRIBUTION statement, not a mount one. See the section comment above.
    soakEvidence: 'unobserved',
  }),
  // ── THE MONOTONE MEMORY (FP GR-5A, docs/DESIGN_FP_ARCH_GR.md §5 GR-5) ──────
  // AUTHORED, NEVER PENDING. The engine-gated virtual cohort's pending array measures
  // empty, so there is nowhere to defer to, and manifesting is itself the act that makes a
  // virtual key censusable and therefore the act that comes due.
  Object.freeze({
    rule: 'treatyRenewalEnabled',
    title: 'The monotone memory (a treaty remembers its worst observed compliance)',
    module: 'src/domain/worldPulse/pactAmendment.js,src/domain/worldPulse/peaceTerms.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: this wave mints no pulse candidate and composes no beat, so
      // there is no `candidateType` literal in it to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. BEHAVIORAL_MOVER_FAMILIES is a closed vocabulary of
      // BEHAVIOURAL families, and the only member this fold could ride is `war` — which
      // would grade this row ALIVE off the entire war layer's traffic in worlds where the
      // flag has never been true. The lifecycle-voice row above refuses the same
      // temptation for the same reason.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, AND THIS ONE IS THE SHARP CASE. The field is written INSIDE a
      // treaty record under `spatialLedgers.treaties`, and `censusWorldStateKeys` walks one
      // level into `spatialLedgers` — so declaring that key would grade this row ALIVE off
      // the peace engine's OWN writes, which populate that container in every world where
      // this flag has never been true. There is no per-field channel to declare, so the row
      // declares nothing rather than declaring a container it does not own.
      stateKeys: Object.freeze([]),
      other: 'ONE GATE, ONE WRITE SITE, AND NO CONSUMER AT THIS WAVE. treatyRenewalActive (pactAmendment.js) reads treatyRenewalEnabled by name with the strict === true idiom, and it is the ONE read of this key in the tree; the by-name spelling is load-bearing rather than stylistic, because a frozen-list conjunction is a computed member access and would hide a fully wired flag from the engine-gated-key census entirely. WHAT THIS WAVE BUILDS: one conditional, monotone, drop-when-absent field, worstObservedEver, folded at the single PASS-2 site in advanceTreaties that already computes the tick own worst OBSERVED compliance, plus the reader that resolves absence to honored and the registration. WHY IT EXISTS: complianceState is overwritten every advance from the current tick observation, so a pact strained for a decade and honoured last week reads, on the parchment, as a pact never strained - the record has no memory, and every remaining GR-5 slice needs one. WHAT IT DELIBERATELY DOES NOT BUILD: the renewal window, the renewal trigger producer, the mid-term renegotiation demand, the conversion arm, any lineage act, any ending, any provenance value, any news kind or Herald desk, any dossier line, any read-model key, and any band, threshold, cap or authored number - GR-5 as chartered is six behaviours and five bands, and every successor needs a chair-signed band under the value-derivation law before it can be written at all. THE FIELD IS OBSERVED, NEVER TRUE: its source is the fogged register a court actually has, so an undetected cheat leaves no memory, because the engine models what courts believe. IT IS MONOTONE AND HAS NO CLEARER: it moves up the rankState ordering and never down, and no code path deletes it. TWO BRANCHES ARE EXCLUDED BY CONSTRUCTION and both are pinned rather than assumed - the all-terms-lapsed prune and the repudiation shell each continue before the fold, so a spent instrument and a torn-up one gain nothing. THE READER IS EXPORTED AND UNCONSUMED IN src BY DESIGN (the GR-0 handoff idiom): the count is structurally zero on every generated world at this wave, and that is the wave identity claim rather than a blind spot - the pin reds the day the conversion gate wires it, which is the handoff signal. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt carrying a per-treaty compliance-history distribution, which no census reads today and which the GR-7 collector section owes.',
    }),
    // The fold runs inside advanceTreaties PASS 2, which the pulse runs every tick on every
    // live treaty — so when the flag is lit the write site is reached per tick, even though
    // the VALUE moves rarely and monotonically.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_memory_is_gated',
        description: 'With the flag absent or false the fold expression is never evaluated - not merely harmless but unreached - so no treaty record gains the key and a dark world is byte-identical to the pre-GR-5A engine. Drop-when-absent means the key is never written as null and never backfilled, so an emptied campaign stays indistinguishable from a dormant one.',
        check: 'NOT expressible from a receipt: no census reads per-treaty fields. Pinned in tests/domain/treatyRenewalMemory.test.js by an own-footprint golden captured at the verified base, an absent-versus-false differential, and a call-path spy on the fold helper - each anchored against a lit control that DOES write, without which the fence would prove only that the fixture is quiet.',
      }),
      Object.freeze({
        name: 'the_fold_is_monotone_and_ordered_by_rankState',
        description: 'The memory moves UP the rankState ordering and never down: a treaty that strains and then recovers keeps strained. The comparator is the peace family own rankState rather than a raw string comparison, which would sort defaulted before honored before strained alphabetically and silently invert the fold on the exact case the field exists to record.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/treatyRenewalMemory.test.js over TWO ticks driven through the REAL advanceTreaties, feeding the first tick own output world back in - a single-tick harness cannot tell a memory from a level, and a hand-built record could never see a dead arm.',
      }),
      Object.freeze({
        name: 'absence_reads_honored_and_nothing_migrates',
        description: 'A record written before this wave existed carries no key and every reader tolerates that forever, resolving to honored at READ without writing the resolved default back - the provenanceOf and treatyTicksPerYear discipline verbatim. The field therefore records history SINCE LIGHTING, which is declared rather than implied.',
        check: 'NOT expressible from a receipt: legacy records are indistinguishable from dark ones in any census. Pinned in tests/domain/treatyRenewalMemory.test.js by a JSON round-trip of a multi-tick record and a legacy record with no key read through worstObservedEverOf.',
      }),
    ]),
    // No channel is declared, so the row can never be ALIVE and says so. `unobserved` rather
    // than `indirect` is the honest reading and the instrument itself ruled the distinction:
    // a row that DECLARES a channel and still calls the soak blind to it converts a real
    // SILENT into an instrument GAP, and that population is ceilinged.
    soakEvidence: 'unobserved',
  }),
]);

/**
 * Engine-gated virtual rule keys that do not yet carry a row. SHRINK-ONLY. Empty
 * from this lane's first commit, and deliberately exported empty so the composed
 * pending list keeps one entry per lane: a key only reaches
 * ENGINE_GATED_VIRTUAL_RULE_KEYS by being measured as a real gate, and a measured
 * gate with no row is exactly the blindness this lane exists to end.
 * @type {ReadonlyArray<string>}
 */
export const VIRTUAL_PENDING_RULE_KEYS = Object.freeze([]);
