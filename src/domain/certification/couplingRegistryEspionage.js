/**
 * domain/certification/couplingRegistryEspionage.js — the ESPIONAGE volume's coupling rows.
 *
 * The registry files are per-volume so that a wave adds its rows without touching another
 * lane's file (the concurrency law). This is ES's first leaf, opened by ES-1; ES-2..ES-7
 * append here rather than reaching into the war, grammar or information registries.
 *
 * WHY A SEPARATE LEAF FROM `couplingRegistryInfo.js` WHEN THE LAYER MAP CALLS BOTH `INFO`.
 * The layer map is about MODULE HOMES — the ES family folds into the INFORMATION program
 * and its leaves are claimed by INFO's directory pattern, which is what stops them being
 * unlayered debt. A registry leaf is about WAVE OWNERSHIP: the couplingId carries the
 * volume prefix `ES`, the rows are appended in ES's wave order, and two lanes building
 * IN-* and ES-* concurrently must not serialize on one file. Both readings are right about
 * different questions.
 *
 * DESIGN_FP_COUPLINGS.md §0.3 — THE SAME-COMMIT OBLIGATION. A cross-layer import is
 * licensed by a registry row landed in the SAME commit as the import, and
 * tests/lint/couplingInclusion.walker.test.js reds until it is.
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * ES-1 / GRAMMAR→INFO. THE COVERT MISSION IS MINTED THROUGH THE ESTATE'S ONE SPINE.
 *
 * J-SP-2 rules that there is exactly ONE purposeful-travel substrate, and J-ES-1 rules
 * that espionage rides it rather than opening a second covert-travel answer on THE ROADS.
 * The consequence is this read: the espionage mission head reaches into the GRAMMAR layer
 * for the errand family's casting predicate (`castableRoster`, which carries the dispatch
 * refusals) and its covert mission vocabulary, then mints through `mintErrandSpine`.
 *
 * THE COUNTERFORCE IS A REAL REFUSAL AND IT LIVES ON THE OTHER SIDE. `covertMissionRefusal`
 * is the spine's own door: it names, by reason, every covert cargo the mint will not
 * write — a class that is not covert, a row it cannot give a public face to, an itinerary
 * past the cap, a product or demand outside the closed sets, and a `legRefs` naming
 * `pullBand` or `exports`, the two appraisal legs no espionage product can ever fill (EP-r
 * cut the second one out of the vocabulary; ES-1 had admitted it). The espionage layer
 * cannot talk its way past any of them, because the validation it would have to defeat is
 * the same one the PERSIST side runs on the way back out of a save file.
 *
 * DARK ⇒ NOTHING: the read gates on `espionageEnabled` (through `espionageActive`, whose
 * own conjunction also requires beliefs live and the spine lit) and the mint gates again
 * on `errandSpineEnabled`. With either absent no covert field is read, refused or written.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES1_COVERT_MISSION_MINT_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-1.covert_mission_mint',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageMissions.js#mintCovertMission',
  receiptField: 'worldState.envoyErrands[].covert.{demand,itinerary,legRefs,product,subjectId}',
  counterforce: 'src/domain/worldPulse/errandMint.js#covertMissionRefusal',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-1',
  intendedDesk: 'war',
});

/**
 * ES-1 / GRAMMAR→INFO. THE ARITHMETIC BORROWS THE ROW'S WORDS RATHER THAN AUTHORING THEM.
 *
 * `ESPIONAGE_TUNING` used to author its own demand list and its own itinerary cap. Both
 * are ROW facts before they are arithmetic facts — the errand's persistence DTO matches
 * against them — so ES-1 retired the copies and the tuning now re-exposes the errand
 * vocabulary's one mint. The coupling is small and it is real: if the vocabulary leaf ever
 * moved those words, this file is where a reader learns that the catch arithmetic moves
 * with them.
 *
 * THE COUNTERFORCE is the persistence normalizer. It is the only thing that can refuse a
 * demand or a stop count, and it refuses them on the way IN and on the way OUT — so an
 * arithmetic that drifted a rung away from the vocabulary would be priced against a
 * mission no writer could have created and no save file could carry.
 *
 * DARK ⇒ NOTHING: the leaf is a dark instrument with no production importer outside its
 * own family, and the borrowed constants are inert until ES-2 mounts the catch roll.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES1_MISSION_VOCABULARY_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-1.mission_vocabulary_borrow',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageMath.js#ESPIONAGE_TUNING',
  receiptField: 'worldState.envoyErrands[].covert.{demand,itinerary}',
  counterforce: 'src/domain/worldPulse/envoyErrandRecords.js#normalizeCovertMission',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-1',
  intendedDesk: 'war',
});

/**
 * ES-1 / TRADE→GRAMMAR. THE COVERT TRAVELLER MAY WALK A WAY THE REALM HAS FORGOTTEN.
 *
 * `mayUseHiddenPaths` is the route layer's one statement of J-D9 (d), and it FAILS CLOSED:
 * an unrecognised traveller kind is refused the overgrown road. Every errand this estate
 * has ever priced has been refused it, and not by anyone's decision — `buildEnvoyRoutePlan`
 * passes the kind `'envoy'`, which is not in the franchise. ES-1 gives that one solve a
 * fork: a covert mission travels as `covert_envoy`, which IS in the franchise, and every
 * other errand keeps the word it always had.
 *
 * THE READ IS ONE CONSTANT, AND THAT IS EXACTLY WHY IT IS REGISTERED. Spelling the kind as
 * a literal inside the envoy file would have made the coupling invisible while leaving it
 * just as real: the day the route layer renames or retires the member, an inlined literal
 * stops matching, `mayUseHiddenPaths` fails closed as designed, and covert missions
 * quietly go back to walking the open road with every test still green. The import is the
 * honest spelling and this row is its receipt.
 *
 * THE COUNTERFORCE is the predicate itself. It is the only thing that grants the
 * franchise, it grants it to a closed set, and it refuses everything else including the
 * ordinary envoy — so the widening cannot leak past the one kind it names.
 *
 * DARK ⇒ NOTHING: `covert` is compared `=== true` at the solve and no production caller
 * passes it, so every route plan the estate prices today takes the identical branch.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES1_HIDDEN_FRANCHISE_COUPLING = couplingRow({
  couplingId: 'CPL-22.TRADE_TO_GRAMMAR.ES-1.covert_hidden_franchise',
  pairId: 'CPL-22',
  direction: 'TRADE→GRAMMAR',
  read: 'src/domain/worldPulse/envoyDiplomacy.js#buildEnvoyRoutePlan',
  receiptField: 'worldState.envoyErrands[].legs[].routeRef.{id}',
  counterforce: 'src/domain/worldPulse/routeNetworkConsumers.js#mayUseHiddenPaths',
  flags: Object.freeze([
    'espionageEnabled',
    'routeLifecycleEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-1',
  intendedDesk: 'war',
});

/**
 * ES-2 / GRAMMAR→INFO. THE GAUNTLET READS THE ERRAND LEDGER TO FIND WHO IS STANDING STILL.
 *
 * The stay-detection stage walks `envoyErrandsOf` and asks each row where its traveller is
 * — which is a GRAMMAR read, and it is the ONLY way the question can be asked, because the
 * itinerary is expressed as multi-leg outbound routing rather than as a second clock (ES
 * §1). The dwell is the gap between one leg's arrival and the next leg's departure and
 * nothing else knows where that gap is.
 *
 * ⚠ THE READ IS DELIBERATELY THE ROW'S `covert` SUB-RECORD AND NEVER THE THREE FACE FIELDS.
 * `errandSpineBlock` writes `covert` only onto a row whose RESOLVED class is covert, so the
 * sub-record IS the class test — and taking it that way keeps this file outside the reserved
 * set `tests/lint/errandConsumerRegistry.walker.test.js` grants to the errand family alone.
 * One read, two laws honoured; the alternative would have been a strictly weaker test that
 * also broke the estate's one-reader law.
 *
 * THE COUNTERFORCE IS THE PERSISTENCE NORMALIZER, on the far side of the same seam. Nothing
 * this stage reads can exist unless `normalizeCovertMission` accepted it on the way into the
 * ledger and will accept it again on the way out of a save file — so a gauntlet reading a
 * mission shape no writer authored is not a state the ledger can hold.
 *
 * DARK ⇒ NOTHING: the stage refuses at `espionageActive` before it walks anything, and it
 * WRITES NOTHING in either state (the custody arm is owner-gated on the encounter shape —
 * see the stage header's measured stop-report), so the coupling is a read and only a read.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES2_GAUNTLET_DWELL_READ_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-2.gauntlet_dwell_read',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageGauntlet.js#covertDwellRead',
  receiptField: 'worldState.envoyErrands[].{legs,state,covert.itinerary}',
  counterforce: 'src/domain/worldPulse/envoyErrandRecords.js#normalizeCovertMission',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-2',
  intendedDesk: 'war',
});

/**
 * ES-2 / GRAMMAR→INFO. THE SCHEDULE CURSOR IS BORROWED, NEVER RE-DERIVED.
 *
 * `scheduledEnvoyPosition` is the errand family's ONE statement of where a traveller stands
 * at one cut, and it evaluates the shared leg law exactly once so a boundary arrival cannot
 * also hop onto a later leg. The gauntlet needs precisely that answer — an arrived-but-not-
 * complete cursor IS the dwell — and computing it here would have minted a second position
 * fraction, which law M forbids for exactly this reason: a covert errand and a peace embassy
 * cannot disagree about where anybody is.
 *
 * THE COUNTERFORCE is the transit seam itself. `envoyErrandTransit.js` is a registered
 * injected-plan validator with no import through which a local speed floor could grow, so a
 * borrowed cursor cannot become a private clock without that file changing first.
 *
 * DARK ⇒ NOTHING: reached only past `espionageActive`, and the borrowed read is pure.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-2.gauntlet_transit_cursor',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageGauntlet.js#covertDwellRead',
  receiptField: 'worldState.envoyErrands[].positionRef.{legIndex,progressBand,toId}',
  counterforce: 'src/domain/worldPulse/envoyErrandTransit.js#scheduledEnvoyPosition',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-2',
  intendedDesk: 'war',
});

/**
 * ES-3 / GRAMMAR→INFO. THE GRADIENT IS AMENDED ONTO THE ERRAND ROW, THROUGH ITS OWN WRITER.
 *
 * This is the ESPIONAGE volume's first WRITE into a GRAMMAR-owned ledger, and the shape of
 * it is the whole reason the row exists. §1's canonical model gives the covert sub-record
 * exactly one writer (SP-D's mint) and exactly one AMENDER, and the amender is the product
 * stage: `gathered` (§3.7's path-dependent accrual — the one thing the model could not
 * derive) and `standoff` (§3.4's addition D) are written here and nowhere else.
 *
 * THE COUNTERFORCE IS THE LEDGER'S OWN SINGLE WRITER. The stage never spreads the ledger
 * key into a world object; it routes through `writeErrands`, which normalizes both sides,
 * returns the caller's world BY REFERENCE on a no-op, and DELETES the key rather than
 * persisting an empty array. `tests/lint/envoyErrandLedgerSingleWriter.walker.test.js`
 * measures that in both directions over all of src/, so a second write form here reds
 * before it can ship — and `normalizeCovertMission` refuses on the way back out of a save
 * file any gradient shape the amender could have got wrong.
 *
 * DARK ⇒ NOTHING: the stage refuses at `espionageActive` (whose conjunction also requires
 * beliefs live and the spine lit) before it walks anything, and past that door a world with
 * no covert sub-record has nothing to amend.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES3_GRADIENT_AMENDER_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-3.gradient_amender',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageProductStage.js#advanceEspionageProducts',
  receiptField: 'worldState.envoyErrands[].covert.{gathered,standoff}',
  counterforce: 'src/domain/worldPulse/envoyErrandLedger.js#writeErrands',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-3',
  intendedDesk: 'war',
});

/**
 * ES-3 / INTERIOR→INFO. A MAN MISREADS THE GATE IN FRONT OF HIM BY HIS OWN FLAWS.
 *
 * §3.4's `flawDistortion` is a closed table over the flaw classes `riskAppetiteOf`
 * (npcLadderGoals.js) ALREADY INTERPRETS — the volume's word is "extended, not forked", and
 * that is a coupling rather than a copy on purpose: re-parsing personality words here would
 * mint a second reading of the same trait vocabulary, and the day INTERIOR retunes which
 * flaws count as bold the standoff would keep the old opinion in silence.
 *
 * THE COUNTERFORCE is the ladder's own reader. It is total over its three classes and
 * returns `mid` for anything it does not recognise, so a widened trait set cannot make this
 * table return undefined — and `TAP_TUNING.FLAW_DISTORTION` is keyed on exactly those three
 * words with a 1 fallback, which is the identity multiplier.
 *
 * DARK ⇒ NOTHING: reached only past `espionageActive`, and the borrowed read is pure over
 * an npc record. Nothing here writes ladder state — the ES module set writes none, and the
 * scan in tests/domain/espionageProducts.test.js proves it.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES3_FLAW_DISTORTION_COUPLING = couplingRow({
  // CPL-20 is the volume's own anchor for INFO × INTERIOR (DESIGN_FP_COUPLINGS §4). The
  // anchors are CPL-1..CPL-21 and a wave never mints a twenty-second where a canonical one
  // fits — ES-1's CPL-22 exists because TRADE × GRAMMAR genuinely has no anchor; this pair
  // has one, and pointing at it is what keeps the pair walkable as a unit.
  couplingId: 'CPL-20.INTERIOR_TO_INFO.ES-3.flaw_distortion',
  pairId: 'CPL-20',
  direction: 'INTERIOR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageTap.js#flawDistortion',
  receiptField: 'worldState.envoyErrands[].covert.standoff',
  counterforce: 'src/domain/worldPulse/npcLadderGoals.js#riskAppetiteOf',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-3',
  intendedDesk: 'war',
});

/**
 * ES-5 / WAR→INFO. THE DOCTRINE READS THE ESTATE'S ONE MORAL LADDER, WHEREVER IT LIVES.
 *
 * §3.9 spells the doctrine's moral axis as `natureWordFor(settlementAlignment(...).malice01)`
 * and says why in one clause: the ladder is "exported precisely because J-WR-10 forbids a
 * second spelling". It is exported from `conquestDoctrineStage.js`, which the layer map
 * claims for WAR — so the honest reading of the same axis from an INFORMATION leaf is a
 * cross-layer read, and this row is its receipt rather than a reason to avoid it. The
 * alternative was a private moral band inside the espionage family, which is the exact
 * defect CR-ES-3 spent a whole commit retiring on the LAW axis.
 *
 * ⚠ NOTE THE ASYMMETRY WITH THE LAW AXIS, BECAUSE IT LOOKS LIKE AN INCONSISTENCY AND IS
 * NOT. The law word arrives with NO coupling, because CR-ES-3 rehomed `lawWordFor` into the
 * neutral `lawWord.js` (argued-unlayered — shared vocabulary spelled by four ports). The
 * moral word still lives inside a WAR module, and rehoming it is a war-lane vocabulary move
 * with its own blast radius that no information wave gets to make on the way past. So the
 * two ladders are spelled once each, and exactly one of them is currently a coupling. If a
 * later wave gives `natureWordFor` the `lawWord.js` treatment, THIS ROW is what tells that
 * wave the read exists.
 *
 * THE COUNTERFORCE is the doctrine leaf's own resolution gate. `readEspionageDoctrine`
 * refuses any word outside its two closed tables and mints `unknownDoctrine(why)` instead —
 * so a moral ladder that grew a fourth rung cannot silently become a doctrine; it becomes a
 * court with no readable doctrine and a quotable reason, which is the loud failure.
 *
 * DARK ⇒ NOTHING: `espionageDoctrineFor` refuses at `espionageActive` and returns null
 * BEFORE it reads an alignment, so a dark world composes no words and pays no read.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES5_DOCTRINE_MORAL_LADDER_COUPLING = couplingRow({
  // CPL-4 is the canonical anchor for WAR × INFO (DESIGN_FP_COUPLINGS §4) — the pair has
  // one, so this wave points at it rather than minting a twenty-third. It is also the pair's
  // FIRST row in the WAR→INFO direction: WR-4 and WR-6 both read the other way.
  couplingId: 'CPL-4.WAR_TO_INFO.ES-5.doctrine_moral_ladder',
  pairId: 'CPL-4',
  direction: 'WAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageDoctrineStage.js#espionageDoctrineFor',
  receiptField: 'worldState.envoyErrands[].covert.demand',
  counterforce: 'src/domain/worldPulse/espionage/espionageDoctrine.js#unknownDoctrine',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-5',
  intendedDesk: 'war',
});

/**
 * ES-5b / INFO→INTERIOR. AN ABSENT FACTION WEIGHS LESS IN THE COURT DECIDING WITHOUT IT.
 *
 * §3.11 (J-ES-9) discounts a faction's weight by the share of its roster that is abroad,
 * at BOTH of the places the volume names: the council bench (`rulingBlocOf`'s power sum,
 * the chokepoint feeding `coalitionConsolidation01`, `blocDecisionFactor` and the ladder's
 * `blocBacked` boolean) and the contest math (`topFactionEntries`'s per-faction weight,
 * which feeds all four faction-rule severities). The INTERIOR contest reader importing the
 * INFO leaf is a REAL cross-layer pair, and this row is the license that lets it land
 * VISIBLY. It was the alternative to the wrong cure: rev 1 avoided the pair by dropping
 * the edit, which deleted §3.11's entire named reach while keeping its whole disclosed
 * cost. The registry exists precisely so a designed coupling can be recorded rather than
 * abandoned.
 *
 * ⚠⚠ THE SECOND EDGE IS REAL AND THE RATCHET CANNOT SEE IT — CR-ES5B-4, RECORDED HERE
 * BECAUSE NOTHING ELSE CAN RECORD IT. `settlementPolitics.js` reads the SAME leaf, and
 * that read is just as cross-layer as this one. It mints NO pair key only because
 * `scanCrossLayerPairs` iterates LAYERED importers and `settlementPolitics.js` matches no
 * LAYER_PATTERNS entry — it is UNLAYERED debt, present in the unlayered baseline and not
 * in ARGUED_UNLAYERED. That is FAIL-OPEN INVISIBILITY, not absence: the day that module
 * acquires a layer home the edge appears from nowhere, and a reader who trusted the
 * walker's silence would read it as new. It is ONE row rather than two because
 * `licensingRows` joins per-`read`-module, so a second row with an unjoinable direction
 * would assert nothing at all. The `ES5_DOCTRINE_MORAL_LADDER_COUPLING` precedent above is
 * the same shape: a row recording its own asymmetry instead of letting it look consistent.
 *
 * THE COUNTERFORCE IS THE BENCH ITSELF, and it is a counterforce rather than a twin.
 * `rulingBlocOf` divides a bloc's discounted power by the court's discounted total, so the
 * discount reaches numerator and denominator together and a COURT-WIDE absence cancels
 * exactly — only a faction that is MORE absent than its rivals loses ground. It also holds
 * the floor: below `RULING_CONSOLIDATION_FLOOR` the read returns null, every decision
 * factor collapses to exactly 1, and the discount stops being able to load anything at all.
 *
 * ⚠ NO RECEIPT IS MINTED ON THE BENCH SIDE, AND THE ADDRESS BELOW SAYS SO BY WHAT IT
 * OMITS. The Herald voice is ES-7's; this wave writes no state and persists no receipt of
 * its own. The one OBSERVABLE the discount leaves in the durable record is the contest
 * side: a discounted `entry.power` reaches `candidateBase`'s `metadata.power` and the
 * severities it feeds, and `compactOutcomeForHistory` carries both `severity` and
 * `metadata` onto `pulseRecord.selectedOutcomes[]`. The address is therefore the CONTEST
 * observable alone — measured, never hand-keyed from a line number.
 *
 * DARK ⇒ NOTHING: `presenceSharesFor` returns null on one `espionageActive` read before it
 * touches a world object, so a dark world — including a roads-lit, espionage-dark one — is
 * BYTE-IDENTICAL. The contest arm is gated twice over: `factionCompetitionEnabled` admits
 * the rule family at all. The LIT shift is a DISCLOSED one-time bloc-math move under ⟨F6⟩,
 * declared in the wave's commit and fenced by its own golden pair — never a silent
 * re-record.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES5B_ABSENCE_BENCH_COUPLING = couplingRow({
  // CPL-20 is the volume's own anchor for INFO × INTERIOR (DESIGN_FP_COUPLINGS §4), and
  // ES-3's flaw-distortion row above already points at it in the OTHER direction. A wave
  // never mints a twenty-third anchor where a canonical one fits.
  couplingId: 'CPL-20.INFO_TO_INTERIOR.ES-5b.absence_bench',
  pairId: 'CPL-20',
  direction: 'INFO→INTERIOR',
  read: 'src/domain/worldPulse/factionCompetition.js#topFactionEntries',
  receiptField: 'pulseRecord.selectedOutcomes[].{severity,metadata.power}',
  counterforce: 'src/domain/worldPulse/settlementPolitics.js#rulingBlocOf',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
    'factionCompetitionEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-5b',
  intendedDesk: 'war',
});

/**
 * ES-5c §3.14 — THE PROMOTION-RISK REGISTER, and ⭐ THE FIRST ESPIONAGE→LADDER EDGE IN THE
 * REPO. At ES-5b's landing the ladder family held ZERO espionage references and the
 * espionage family held zero ladder references (measured across all six files); this row
 * licenses the direction opening for the first time. A rung-holder who is abroad, on a rung
 * with windows open, with a live rivalry around him, defends his seat weaker — through
 * `npcLadderChallenge.js`'s OWN defense score, in the same multiplicative shape the file
 * already uses for the §11.4 three-body strain.
 *
 * ⚠⚠ ES-5b's `ES5B_ABSENCE_BENCH_COUPLING` DOES NOT LICENSE THIS PAIR, and the reason is
 * mechanical rather than editorial: `licensingRows` joins a row to a live pair on the
 * IMPORTER module, and that row's `read` names `factionCompetition.js#topFactionEntries`.
 * A different importer needs its own row, so this one exists rather than leaning on a
 * sibling that looks close enough. `read` below is the exact string the join reads.
 *
 * ⚠ THE DIRECTION IS THE SECOND `INFO→INTERIOR` UNDER CPL-20 AND THE FIRST TOUCHING THE
 * LADDER. ES-3's `ES3_FLAW_DISTORTION_COUPLING` above already anchors CPL-20 in the
 * OPPOSITE direction (`INTERIOR→INFO`, espionageTap reading npcLadderGoals). `pairId` stays
 * CPL-20 — the volume's own INFO × INTERIOR anchor — because a wave never mints a
 * twenty-third anchor where a canonical one fits.
 *
 * ⛔ NOTHING HERE WRITES LADDER STATE. The register is a DERIVED read and the espionage
 * module set writes none of the ladder's own state — and as of ES-5c that claim is finally
 * a FACT rather than a sentence: the scan in tests/domain/espionageProducts.test.js used to
 * forbid three identifiers that exist NOWHERE in src/ while the real writer went unguarded,
 * and ES-5c repairs it to match the real spelling and anchors it with a plant, in the very
 * commit that first makes the boundary load-bearing.
 *
 * DARK ⇒ NOTHING: `careerRiskFor` returns 0 on one `espionageActive` read before it touches
 * a world object, and the ladder gate is already the caller's, so a dark world — espionage-
 * dark, ladder-dark or roads-dark — computes `defenseScore` BYTE-IDENTICALLY. The LIT shift
 * is a DISCLOSED one-time ladder-outcome move under ⟨F6⟩, declared in the wave's commit and
 * fenced by its own golden pair — never a silent re-record.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES5C_CAREER_LADDER_COUPLING = couplingRow({
  couplingId: 'CPL-20.INFO_TO_INTERIOR.ES-5c.career_register',
  pairId: 'CPL-20',
  direction: 'INFO→INTERIOR',
  read: 'src/domain/worldPulse/npcLadderChallenge.js#defenseScore',
  // DERIVED, NOT HAND-KEYED (the address-rot class). The address names the COUPLING'S
  // OBSERVABLE CONSEQUENCE, not its intermediate arithmetic — the same trade ES-5b's row
  // makes when it names `selectedOutcomes` rather than the raw presence share.
  //
  // ⚠⚠ `absenceDecay` ITSELF IS NEVER PERSISTED, AND NO ESPIONAGE RECEIPT IS MINTED HERE.
  // It is computed inside `defenseScore`, handed out on the returned `ChallengeEvent`, read
  // once, and dropped. What survives the tick is what the discounted defense CAUSED: the
  // ladder's own succession beat, which `ladderBeat` stamps with `impactKind: 'npc_ladder'`
  // and the moved `dScore` folded into its severity and reason sentence, and which
  // `compactImpactDigest` carries into the persisted pulse record. Addressing the in-memory
  // receipt instead would name a surface no reader can ever reach. ES-7 owns the receipted
  // voice; this wave mints no surface of its own.
  //
  // Naming no Herald kind is deliberate — the desk walker's `kind=` scan therefore makes no
  // routing join — on ES-5b's own precedent.
  receiptField: 'pulseRecord.impactDigest[].{headline,summary,severity,score}',
  counterforce: 'src/domain/worldPulse/espionage/espionageGauntlet.js#gatherOrGovernRead',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
    'npcLadderEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-5c',
  intendedDesk: 'war',
});

/**
 * ES-5d §3.14 — THE MISSION CREDIT, and the SECOND espionage→ladder edge in the repo. ES-5c's
 * row above opened the direction with a DERIVED read; this one carries a HANDOFF: espionage
 * deposits a per-operative credit into its own one-tick ledger and the ladder's own maintenance
 * road folds it into that standing's `stock` through the ladder's own writer.
 *
 * ⚠⚠ `ES5C_CAREER_LADDER_COUPLING` DOES NOT LICENSE THIS PAIR, and its own docstring says so
 * in as many words. `licensingRows` joins a row to a live pair on the IMPORTER module, and that
 * row's `read` names `npcLadderChallenge.js#defenseScore`. The importer here is
 * `npcLadderKernel.js`, which is a different module — so this row exists rather than leaning on
 * a sibling that looks close enough. `read` below is the exact string the join reads.
 *
 * ⚠ THE THIRD `INFO→INTERIOR` ROW UNDER CPL-20 AND THE SECOND TOUCHING THE LADDER. `pairId`
 * stays CPL-20 — the volume's own INFO × INTERIOR anchor — because a wave never mints a
 * twenty-third anchor where a canonical one fits.
 *
 * ⛔ NOTHING IN THE ESPIONAGE SET WRITES LADDER STATE, and the boundary is machinery rather
 * than a sentence: the repaired scan in tests/domain/espionageProducts.test.js source-scans
 * this whole directory for the ladder's REAL persistence spelling, and the credit leaf is
 * picked up by it the day it lands. The espionage side owns exactly one key — its own credit
 * deposit — and the ladder side owns `stock`. One writer each, per state.
 *
 * ⚠⚠ THE HANDOFF IS SAME-TICK, MEASURED, NOT ONE-TICK-LAGGED (ES-5d deviation D7).
 * `simulateCampaignWorldPulse` calls the espionage product pass and the ladder chain
 * unconditionally in that order, in one function, on the same `worldState.tick` — so the
 * depositor runs EARLIER IN THE SAME PULSE than the consumer, which is the `gratitudeBondEvents`
 * shape rather than the `roadsBondEvents` one. A one-tick window here would be silently dead:
 * the deposit pass prunes the prior tick's records before the ladder could ever look for them.
 *
 * DARK ⇒ NOTHING: the deposit writer returns on two flag reads before touching a world object,
 * and drop-when-empty means a dark or credit-free tick mints NO ledger key at all — so a dark
 * world is BYTE-IDENTICAL and no dormancy golden moves. The LIT shift is a DISCLOSED one-time
 * ladder-outcome move under ⟨F6⟩, declared in the wave's commit and fenced by its own golden
 * pair, never a silent re-record.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES5D_CAREER_CREDIT_COUPLING = couplingRow({
  couplingId: 'CPL-20.INFO_TO_INTERIOR.ES-5d.career_credit',
  pairId: 'CPL-20',
  direction: 'INFO→INTERIOR',
  read: 'src/domain/worldPulse/npcLadderKernel.js#advanceNpcLadder',
  // DERIVED, NOT HAND-KEYED (the address-rot class), and derived to the SAME address as ES-5c's
  // row because the two grains push on the same observable from opposite sides.
  //
  // ⚠⚠ NO PERSISTED ESPIONAGE RECEIPT EXISTS, AND NONE IS MINTED HERE. The credit is a number
  // folded into a standing; the grade continues to ride the in-memory landing receipt exactly
  // as it did before this wave, and ES-7 owns the receipted voice. What SURVIVES the tick is
  // what the credited standing CAUSED: the ladder's own succession beat, which `ladderBeat`
  // stamps `impactKind: 'npc_ladder'` and which `compactImpactDigest` carries into the
  // persisted pulse record. Addressing the credit itself would name a surface no reader can
  // reach; addressing the deposit ledger would name a record pruned before any reader runs.
  //
  // Naming no Herald kind is deliberate — the desk walker's `kind=` scan therefore makes no
  // routing join — on ES-5b's and ES-5c's own precedent.
  receiptField: 'pulseRecord.impactDigest[].{headline,summary,severity,score}',
  counterforce: 'src/domain/worldPulse/espionage/espionageCareerCredit.js#readMissionCreditEvents',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
    'npcLadderEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-5d',
  intendedDesk: 'war',
});

/**
 * ES-6a — THE DOUBLE AGENT'S LEAK: an INFO leaf conditioning on the CORRUPTION WEB's own
 * lighting, and handing a foreign court a discounted copy of what its agent told home.
 *
 * ⚠⚠ THIS ROW EXISTS BECAUSE THE WALKER CANNOT SEE THE EDGE — FAIL-OPEN INVISIBILITY, NOT
 * ABSENCE. `espionageLeak.js` imports `corruptionWebActive` from `corruptionWeb.js`, and that
 * file matches NO entry in the inclusion walker's layer table: it is UNLAYERED, sitting in the
 * walker's own unlayered baseline, so the scan reaches `if (!depLayer) continue` and MINTS NO
 * PAIR AT ALL. The leaf's other corruption dependency, the leash resolver, is worse than
 * unlayered — it lives one directory ABOVE the walker's census scope and is never even
 * visited. So neither edge would red, neither edge would be licensed, and neither edge would
 * be recorded anywhere. CR-ES5B-4 binds exactly here: record what the walker cannot see.
 *
 * ⛔ WHY THE DIRECTION IS `INFO→INFO` RATHER THAN A PORT THE DEPENDENCY DOES NOT HOLD. The
 * corruption family is INTERIOR's subject matter in everything except its layer-table entry —
 * but it HAS no entry, so naming `INTERIOR→INFO` would assert a port the estate has never
 * assigned and would make this row's join uncheckable. The row therefore names the layer both
 * ends actually carry, and the docstring carries the truth the direction cannot. `pairId`
 * stays CPL-20, the volume's own anchor, because a wave never mints a pair merely to hold its
 * own row. ⭐ THE GENUINELY BETTER REPAIR IS A DIFFERENT PACKET: widening the layer table to
 * claim the corruption family would make this edge VISIBLE rather than merely recorded — and
 * it would re-census every existing corruption import in the estate, which is why it is not a
 * clause of this one.
 *
 * ⚠ NO PERSISTED ESPIONAGE RECEIPT EXISTS AND NONE IS MINTED. The leak writes no ledger of its
 * own, no news, no Herald kind and no home-visible field — silent success is the behavior. The
 * only thing that SURVIVES the tick is the patron court's own belief row, written through the
 * espionage set's one belief writer into the existing map, so that is the address named below.
 * Naming no Herald kind is deliberate, on ES-5b/5c/5d's precedent: the desk walker's kind scan
 * therefore makes no routing join, and the voice belongs to ES-7.
 */
export const ES6A_DOUBLE_AGENT_LEAK_COUPLING = couplingRow({
  couplingId: 'CPL-20.INFO_TO_INFO.ES-6a.double_agent_leak',
  pairId: 'CPL-20',
  direction: 'INFO→INFO',
  read: 'src/domain/worldPulse/espionage/espionageLeak.js#deliverMissionLeaks',
  receiptField: 'spatialLedgers.beliefMaps[patronId].seat[subjectId].{allianceLabel,confidence01}',
  counterforce: 'src/domain/worldPulse/espionage/espionageLeak.js#leakTargetFor',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
    'corruptionWebEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-6a',
  intendedDesk: 'war',
});

/** Every ESPIONAGE row, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const ES_ESPIONAGE_COUPLINGS = Object.freeze([
  ES1_COVERT_MISSION_MINT_COUPLING,
  ES1_MISSION_VOCABULARY_COUPLING,
  ES1_HIDDEN_FRANCHISE_COUPLING,
  ES2_GAUNTLET_DWELL_READ_COUPLING,
  ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING,
  ES3_GRADIENT_AMENDER_COUPLING,
  ES3_FLAW_DISTORTION_COUPLING,
  ES5_DOCTRINE_MORAL_LADDER_COUPLING,
  ES5B_ABSENCE_BENCH_COUPLING,
  ES5C_CAREER_LADDER_COUPLING,
  ES5D_CAREER_CREDIT_COUPLING,
  ES6A_DOUBLE_AGENT_LEAK_COUPLING,
]);
