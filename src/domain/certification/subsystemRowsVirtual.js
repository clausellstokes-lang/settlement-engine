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
