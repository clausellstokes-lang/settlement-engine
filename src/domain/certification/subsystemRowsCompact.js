/**
 * domain/certification/subsystemRowsCompact.js — THE COMPACT GRAMMAR: the
 * engine-gated virtual lane's rows 13 through 20.
 *
 * TE-VIRT-1's second block cut. The full rationale — the 800/800 wall, the exact
 * ordered-equality pin that forces every leaf to carry a CONTIGUOUS block, and the
 * append-at-the-tail rule — is written once at the head of
 * `subsystemRowsBelief.js` and is binding here unchanged.
 *
 * ── WHAT THIS BLOCK IS, AND THE TWO ROWS THAT RIDE ALONG ───────────────────
 *
 * Six of these eight rows are one subject and would have been chosen as a family
 * if families were choosable: `oathHolder` (GR-1, who a treaty is sworn BY),
 * `pactFormation` (GR-2, peacetime formation), `sovereigntyTrade` (the WR-10
 * conveyance — a compact that sells a holding), `treatyLifecycleVoice` (GR-0, the
 * lifecycle's own voice), `casusCommercii` (TR-1, the commercial cause a compact
 * creates) and `treatyRenewal` (GR-5A, the monotone memory a renewal must respect).
 * A compact, who swears it, what it licenses, how it speaks and how it ends.
 *
 * ⚠ THE OTHER TWO ARE HERE BY AUTHORING POSITION AND NOTHING ELSE, and saying so
 * is the point rather than an apology: `settlementPoliticsEnabled` (the coherence
 * layer's internal politics) and `underwaysOrganicFoundingEnabled` (D6 coupling 5,
 * institution lifecycle) landed between GR-1's wave and GR-5A's, and the order pin
 * makes their position a certification output. Moving them to a home that fits
 * their subject is a REORDER with its own bill; pretending they fit this one would
 * be the worse outcome, because the next reader would trust the fit. They are
 * named here so nobody has to rediscover that they do not belong.
 *
 * ⛔ DO NOT APPEND A NEW ROW HERE — an append lands at index 20 and shifts eight
 * later rows. New virtual rows append at the TAIL (§864's precedent). And like
 * every row leaf, this file deliberately does NOT join
 * `subsystemCertification.js`'s import list: `VIRTUAL_SUBSYSTEM_ROWS` stays the
 * ONE export every consumer, walker and bijection reads.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The compact-grammar block's authored rows, in their virtual-lane order.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const COMPACT_SUBSYSTEM_ROWS = Object.freeze([
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
      other: 'THIS SUBSYSTEM IS STRUCTURALLY INVISIBLE TO EVERY RECEIPT SHAPE THE ESTATE WRITES, and saying so is the row. ONE GATE: evaluateInstitutionLifecycle reads underwaysOrganicFoundingEnabled === true off the RAW rules — the flag is ABSENT from DEFAULT_SIMULATION_RULES, the npcLadder/heirs dormancy idiom — and threads the resulting underwaysFoundingLit into detectInstitutionGaps as an option. WHAT IT DOES: a settlement at village tier or above with a sustained criminal underground (a vice-nature institution present, read as a FACET rather than by name) and no existing clandestine institution gains ONE additional buildable gap, the excavated tunnel network, which then competes on affinity with every other gap and, if it wins and clears the build roll, becomes a real institution. THE MINE-FOUNDS-ITSELF PATTERN, applied to crime. WHY IT TOOK A ROW RATHER THAN AN EXEMPTION: it writes a real container — an institution — rather than re-ranking one somebody else writes, and exempting a real container writer is the shrug the exempt list exists to refuse (R19). WHY EVERY CHANNEL IS EMPTY: the candidate literals its leaf mints are SHARED with the institution lifecycle layer and already declared by that layer\'s row, so declaring them here would grade this row alive off traffic this flag never caused; the institution it founds lands in a container every ordinary world already populates. THE OBSERVATION NEEDED to close this gap is a per-founding PROVENANCE count in the soak receipt — a count, per observed year, of institution_build candidates whose gap kind is clandestine, or equivalently whose gap carried via: underways — which no receipt schema carries today because the candidate census counts candidateType literals and never the gap kind that produced them. Until such an observation exists the layer is pinned where its bodies are readable instead. CITATION CORRECTED 2026-09-05 by lane L-CHAIR-901: this sentence named tests/domain/institutionLifecycle.test.js, and that file carries ZERO hits for underways, clandestine or Underground. It exists, so the certification totality walker (which checks only that a row.module PATH resolves) was silent over it, and a citation that resolves to a live file saying nothing about the claim is the worst kind of dead: it reads as coverage. The real pins, measured: tests/property/underwaysOrganicFoundingDormancyFence.test.js, whose fence 1 drives every dark spelling against the SAME fixture lit and whose fence 3 proves the clandestine gap opens under the lit option and by no other door; and tests/domain/underwaysCouplings.test.js coupling 5, which runs the same dark/lit pair through the real catalog entry.',
    }),
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dormancy_is_the_absent_gap_not_a_dead_lookup',
        description: 'Law 12 (dormancy by absence): dark, detectInstitutionGaps never opens the clandestine gap, so the gap set, the affinity sort and every downstream candidate are byte-identical to the pre-D6 engine. ⚠ The dormancy is now the FLAG and no longer a dead catalog lookup: the Underground network entry EXISTS on this lineage, so the resolver really does resolve and only the gate stands between a dark world and a lit one.',
        check: 'NOT expressible from a receipt: the census counts candidateType literals and cannot see which gap kind produced a build. Pinned in tests/property/underwaysOrganicFoundingDormancyFence.test.js (fences 1 and 3), comparing a dark evaluate against a lit one on a settlement that satisfies every other precondition. Re-cited 2026-09-05 by lane L-CHAIR-901: the file this named before carries zero hits for the subject.',
      }),
      Object.freeze({
        name: 'the_vice_signal_is_a_facet_read_never_a_name_match',
        description: 'The criminal-underground precondition is read as an institutionNature facet equal to vice, and the skip condition as a DECLARED CLANDESTINE FACET under either governed spelling — the catalog\'s own `clandestine` facet kind, which the Underground network rows declare, or an institutionFunction facet equal to clandestine — never as a name or tag string match. Reading only the second spelling was the landed-dark defect ODQ §445.3 docketed and HK-1 cured: the skip was ALWAYS FALSE against catalog data. A settlement whose tunnels are named anything at all is still recognised as already having them, and a renamed vice institution still signals.',
        check: 'NOT expressible from a receipt: no census carries institution facets. Pinned at the reader in tests/domain/underwaysCouplings.test.js, whose coupling-5 arm skips a RENAMED institution declaring the catalog facets, proving the facet read rather than the name. Re-cited 2026-09-05 by lane L-CHAIR-901: the file this named before carries zero hits for the subject.',
      }),
      Object.freeze({
        name: 'the_tier_floor_is_village_and_it_binds',
        description: 'Excavation needs labor, so the gap opens only at village tier and above. A thorp with a thriving vice institution gains nothing, which keeps the layer from founding tunnels in settlements that could not dig them.',
        check: 'NOT expressible from a receipt: the census carries no per-settlement tier at candidate time. AND NOT PINNED ANYWHERE EITHER, WHICH THIS ROW NOW SAYS INSTEAD OF CLAIMING A PIN IT DOES NOT HAVE. Corrected 2026-09-05 by lane L-CHAIR-901: this check named tests/domain/institutionLifecycle.test.js "with a thorp fixture and a village fixture differing in exactly the tier", and the whole tests tree carries ZERO occurrences of thorp in any underways or clandestine arm. The nearest live evidence is tests/domain/underwaysCouplings.test.js, which reads the clandestine facet at village, town and city and is the POSITIVE half only, so the floor itself is untested: nothing anywhere drives a thorp and asserts the gap stays shut. THE OWED ARM, stated so the next lane builds rather than rediscovers: the same viceTown fixture at thorp tier, lit, producing no clandestine gap, beside the village run that does. This row EXPOSES the gap rather than grading itself on it, which is why soakEvidence stays unobserved.',
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
