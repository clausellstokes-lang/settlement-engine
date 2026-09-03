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

/** The ENCOUNTERS volume's rows, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const ENC_ENCOUNTERS_COUPLINGS = Object.freeze([
  ENC2_MEETING_MARK_CONSUME_COUPLING,
]);
