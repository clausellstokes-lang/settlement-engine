/**
 * domain/certification/couplingRegistryEncounters.js — the ENCOUNTERS volume's coupling rows.
 *
 * The registry files are per-volume so a wave adds its rows without touching another lane's
 * file (the concurrency law). This is ENCOUNTERS' first leaf, opened by ENC-2; the later cars
 * append here rather than reaching into the war, grammar, information or espionage registries.
 *
 * DESIGN_FP_COUPLINGS.md §0.3 — THE SAME-COMMIT OBLIGATION. A cross-layer import is licensed
 * by a registry row landed in the SAME commit as the import, and
 * tests/lint/couplingInclusion.walker.test.js reds until it is.
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * ENC-2 / GRAMMAR→INTERIOR. THE LADDER MINTS THE MARK; THE MEETING ONLY DEPOSITS IT.
 *
 * A chance meeting between two named people in two different courts produces a TIE, and a
 * tie between people is the ladder's subject, not the envoy family's. So the meeting writes
 * nothing onto a standing record: it deposits a one-tick event into
 * `spatialLedgers.meetingMarkEvents`, and `advanceLitLadder` consumes that deposit through
 * the ladder's OWN writer, `mintBond`, on the same tick. This import is the kernel reaching
 * into the envoy family's GRAMMAR layer for the deposit's reader — and the reader lives in
 * the writer's own leaf beside the literal ledger key, exactly as `readGratitudeBondEvents`
 * and `readMissionCreditEvents` do, so a reader can never drift from the shape it reads.
 *
 * THE COUNTERFORCE IS A REAL REFUSAL AND IT LIVES IN THE LEAF. `readMeetingMarkEvents`
 * filters on `depositTick === now` — the consume-once double guard on top of the ledger's own
 * one-tick life — so a stale, replayed or restored deposit mints nothing; and it drops any
 * row that has lost a field, carries an unruled mark grain, or carries a severity word the
 * closed set does not hold, rather than half-reading it onto somebody's record.
 *
 * DARK ⇒ NOTHING, THREE TIMES OVER. The stage writes no key unless
 * `chanceEncountersEnabled` is lit, it re-reads the CONSUMER's flag (`memoryWeaveEnabled`)
 * before depositing, and the kernel reads the ledger only under its own weave gate while
 * `npcLadderEnabled` holds. With any of the three absent the key never exists and the
 * hoisted read returns an empty map.
 *
 * ⚠ The flag list names the two rules that EXIST at this commit. `chanceEncountersEnabled`
 * is minted by ENC-3 with its manifest member and certification row, and joins this list in
 * that commit rather than being declared here ahead of the key it gates.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ENC2_MEETING_MARK_CONSUME_COUPLING = couplingRow({
  couplingId: 'CPL-21.GRAMMAR_TO_INTERIOR.ENC-2.meeting_mark_consume',
  pairId: 'CPL-21',
  direction: 'GRAMMAR→INTERIOR',
  read: 'src/domain/worldPulse/npcLadderKernel.js#advanceLitLadder',
  receiptField: 'worldState.spatialLedgers.npcLadder[].npcs[].bonds[].{kind,sev,foreignSid}',
  counterforce: 'src/domain/worldPulse/envoyChanceMeetingLedger.js#readMeetingMarkEvents',
  flags: Object.freeze([
    'memoryWeaveEnabled',
    'npcLadderEnabled',
  ]),
  owningVolume: 'ENCOUNTERS',
  owningWave: 'ENC-2',
  intendedDesk: 'diplomacy',
});

/**
 * ENC-3 / INFO→GRAMMAR. THE HOST COURT'S OWN WARINESS SHARPENS THE EXPOSURE DIE.
 *
 * When an approach is refused, whether the refusal is SPOKEN OF depends on how watchful the
 * host court already is — and this design mints no second wariness law for that. It reads
 * the term the espionage gauntlet already reads, `overdueForeignNotables`, which counts the
 * foreign notables whose declared schedule has lapsed inside the host's own cluster. That
 * is an INFO-layer subject (what a court believes about who is overdue), consumed by a
 * GRAMMAR-layer stage, so it is a cross-layer read and it is licensed here.
 *
 * THE COUNTERFORCE IS THE LEAF'S OWN NARROWNESS, and it is why this import is cheap: the
 * wariness leaf is IMPORT-FREE and pure, it returns a count with its own `termsAbsent`
 * declaration, and the stage caps the rung it contributes at two. So the widest thing this
 * edge can do is move one die by two eighths — it can never reach a person, a record or a
 * ledger. Nothing is written back toward INFO in either direction.
 *
 * ⚠ THE ARROW IS THE WALKER'S, NOT THE DESIGN'S. `DESIGN_ENCOUNTERS.md` §11 row 5 calls
 * this pair "GRAMMAR→INFO". The walker composes `${importedLayer}→${importerLayer}`
 * (`couplingInclusion.walker.test.js:1152`), so the live direction of a GRAMMAR file
 * importing an INFO file is `INFO→GRAMMAR`. Derived at the dock, never restated — a row
 * carrying the design's arrow would license nothing and the pair would red as unlicensed.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ENC3_MEETING_EXPOSURE_WARINESS_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.ENC-3.meeting_exposure_wariness',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/envoyChanceMeetingStage.js#advanceChanceMeetings',
  receiptField: 'worldState.relationshipStates[].{resentment,recentIncidents}',
  counterforce: 'src/domain/worldPulse/espionage/espionageWariness.js#overdueForeignNotables',
  flags: Object.freeze([
    'chanceEncountersEnabled',
    'envoyDiplomacyEnabled',
  ]),
  owningVolume: 'ENCOUNTERS',
  owningWave: 'ENC-3',
  intendedDesk: 'diplomacy',
});

/**
 * ENC-3 / INTERIOR→GRAMMAR. THE STAGE ASKS THE INTERIOR FOR ITS DOORS, ITS WORDS AND ITS
 * ONE WRITER — AND ASKS FOR NOTHING ELSE.
 *
 * A meeting is an envoy-family event about two people whose standing, whose personality
 * words and whose courts' edge are all INTERIOR subjects. Rather than re-deriving any of
 * them, the stage reaches for the interior's own spellings. FOUR reads, and each is the
 * estate's single home for the fact it answers:
 *
 *   • `npcLadderKernel#npcLadderActive` and `relationshipEvolution#memoryWeaveActive` — the
 *     two CONSUMER doors over a mark. They are re-read HERE, at the deposit site, because
 *     the deposit IS the gate: a weave-dark or ladder-dark world must write no ledger key
 *     at all rather than an orphaned one nobody will ever consume.
 *   • `npcLadderGoals#traitsOf` — the estate's ONE reader of an NPC's personality words,
 *     and a registered coupling counterforce in its own right. A second spelling here
 *     would be the fourth in a tree that already refused the third.
 *   • `relationshipState#relationshipKeyFromEdge` and
 *     `relationshipEvolution#applyRelationshipPatch` — the relationship plane's key law and
 *     its ONE writer. An exposed approach is a grievance on the two courts' edge, and it is
 *     written through that writer WITH ITS EDGE as the fourth argument, which is the
 *     `relationshipPatchEdgeCarry` walker's own law.
 *
 * THE COUNTERFORCE IS A REAL REFUSAL: `applyRelationshipPatch` returns the world UNCHANGED
 * when the patch names no relationship key, and the stage reaches it only for an `exposed`
 * outcome that resolved an edge — so a meeting at a court with no regional edge files no
 * grievance rather than inventing one. And nothing here writes a standing record: the mark
 * is DEPOSITED and the ladder kernel mints it through `mintBond` on its own tick, which is
 * the coupling ENC-2 licensed in the other direction.
 *
 * ⚠ ONE ROW LICENSES ALL FOUR IMPORTS, and that is the walker's own rule rather than a
 * shortcut: `licensingRows` matches on DIRECTION plus the IMPORTER module of the row's read
 * address (`couplingInclusion.walker.test.js:1251-1255`), never on the imported module. A
 * row per import would be four rows describing one seam. ⚠ The arrow is again the walker's:
 * the design calls this "GRAMMAR→INTERIOR"; the live direction is `INTERIOR→GRAMMAR`.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ENC3_MEETING_STAGE_INTERIOR_COUPLING = couplingRow({
  couplingId: 'CPL-21.INTERIOR_TO_GRAMMAR.ENC-3.meeting_stage_reads',
  pairId: 'CPL-21',
  direction: 'INTERIOR→GRAMMAR',
  read: 'src/domain/worldPulse/envoyChanceMeetingStage.js#advanceChanceMeetings',
  receiptField: 'worldState.spatialLedgers.meetingMarkEvents[].{mark,kind,sev,foreignSid},worldState.relationshipStates[].{resentment,recentIncidents}',
  counterforce: 'src/domain/worldPulse/relationshipEvolution.js#applyRelationshipPatch',
  flags: Object.freeze([
    'chanceEncountersEnabled',
    'memoryWeaveEnabled',
    'npcLadderEnabled',
  ]),
  owningVolume: 'ENCOUNTERS',
  owningWave: 'ENC-3',
  intendedDesk: 'diplomacy',
});

/** The ENCOUNTERS volume's rows, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const ENC_ENCOUNTERS_COUPLINGS = Object.freeze([
  ENC2_MEETING_MARK_CONSUME_COUPLING,
  ENC3_MEETING_EXPOSURE_WARINESS_COUPLING,
  ENC3_MEETING_STAGE_INTERIOR_COUPLING,
]);
