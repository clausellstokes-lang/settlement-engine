/**
 * domain/certification/subsystemRowsBelief.js — THE BELIEVED WORLD, AND THE
 * INTENTS THAT RIDE IT: the engine-gated virtual lane's first eight rows.
 *
 * ── WHY THIS LEAF EXISTS (TE-VIRT-1, ODQ §868 as narrowed by §870.4) ────────
 *
 * `subsystemRowsVirtual.js` stood at 800 of 800 EFFECTIVE lines — its layer's
 * `max-lines` ceiling for `src/domain/**\/*.js`, counted with skipBlankLines and
 * skipComments — with ZERO headroom, because the W-MEM row took
 * "the ceiling's LAST seat" at the T12 landing and had to be COMPRESSED with the
 * long-string idiom to fit it. An honest certification row costs 25-40 effective
 * lines here (the contract asks `aliveness.other` past 400 characters and at least
 * one falsifiable invariant), so the wall was not a warning: no further virtual
 * flag could land estate-wide. W-SEAT proved the cure at `subsystemRowsSeat.js`;
 * this is that cure applied generally.
 *
 * ── ⛔ WHY THE CUT IS A BLOCK AND NOT A FAMILY, AND WHY THAT IS NOT A COMPROMISE
 *
 * `tests/domain/subsystemRowsVirtual.test.js` asserts an EXACT ORDERED EQUALITY —
 * `VIRTUAL_SUBSYSTEM_ROWS.map((row) => row.rule)` against its mirrored
 * `VIRTUAL_RULES` — and `subsystemCertification.js` composes the lanes in order
 * ("Order is lane order then authored order"), so a row's INDEX is a certification
 * output and not a formatting detail. The virtual file is in AUTHORING order and
 * its design volumes genuinely interleave (ES at 2, WR at 9 and 15, GR at 13, 14,
 * 16 and 20), so a family-PURE decomposition of the body is impossible without
 * moving rows that no one asked to move. Every leaf therefore carries a CONTIGUOUS
 * block spread back at its own position, and every existing row keeps the exact
 * index it had. The FAMILY leaves — W-COIN, W-MEM, W-SEAT, and the two door homes
 * — sit at the tail, where authoring order and family order finally coincide.
 *
 * ── WHAT THESE EIGHT ACTUALLY SHARE, WHICH IS MORE THAN ADJACENCY ───────────
 *
 * The coherence here was DISCOVERED by the cut rather than designed into it, and
 * it is worth stating because it is what makes this block a readable unit: all
 * eight are the belief substrate and the things that ride it. `beliefAxes` is the
 * demographic and cultural chart itself; `espionage` is its acquisition arm (the
 * reports a court's picture is made of); the three `believed*` axes are the
 * derived believed-world reads; `secondOrderBelief` is the mirror (what a court
 * believes another court believes); `strategicPosture` is the intent a court forms
 * FROM that picture; and `errandSpine` is the intent object that carries a
 * declared purpose over a true one — an information object with a lie in it. The
 * next reader's question about all eight is the same question.
 *
 * ── ⛔ DO NOT APPEND A NEW ROW HERE ─────────────────────────────────────────
 *
 * A row appended to this leaf lands at index 8 of `VIRTUAL_SUBSYSTEM_ROWS` and
 * shifts TWENTY later rows, which is a real certification-output move dressed up
 * as an edit to one file. New virtual rows append at the TAIL, on the §864
 * precedent (a row filed "beside WR-6b in numeric position" would have taken
 * another row's first-row seat and was appended LAST instead). If a future car
 * genuinely belongs to this block's subject, that is a reordering decision with
 * its own bill, taken deliberately and receipted — not a convenience.
 *
 * ⛔ LIKE `subsystemRowsSeat.js`, THIS FILE DELIBERATELY DOES NOT JOIN
 * `subsystemCertification.js`'s import list. The rows spread back into
 * `VIRTUAL_SUBSYSTEM_ROWS`, which stays the ONE export every consumer, walker and
 * bijection already reads, so the composition, the totality audit and the ordered
 * rule-name contract are untouched and no other lane's surface moves.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The believed-world block's authored rows, in their virtual-lane order.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const BELIEF_SUBSYSTEM_ROWS = Object.freeze([
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
]);
