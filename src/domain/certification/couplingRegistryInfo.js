/**
 * domain/certification/couplingRegistryInfo.js — the INFORMATION volume's coupling rows.
 *
 * The registry files are per-volume so that a wave adds its rows without touching another
 * lane's file (the concurrency law). This is INFO's first, opened by IN-0a; IN-1..6 append
 * here rather than reaching into the war or grammar registries.
 *
 * DESIGN_FP_COUPLINGS.md §0.3 — THE SAME-COMMIT OBLIGATION. A cross-layer import is
 * licensed by a registry row landed in the SAME commit as the import, and
 * tests/lint/couplingInclusion.walker.test.js reds until it is. The row is not paperwork:
 * it names the READ address, the persisted RECEIPT the coupling leaves behind, the
 * COUNTERFORCE that can refuse it, and the flags both ends ride, so a reader who has only
 * the row can find the whole seam.
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * IN-0a / INFORMATION→GRAMMAR. THE PAID LIE REACHES THE TABLE.
 *
 * WR-7b built `prepareEnvoyPlantTargets` to attach an exact negotiation-picture address to
 * an already-purchased plant envelope — and then nothing ever handed it one: the pulse
 * kernel calls `advanceEnvoyDiplomacyPulse` without `commissionedPlants`, and the mouths
 * are banked against edits. The stage was fed by tests alone. IN-0a's read is the ONE line
 * that feeds it: the envoy head reads the prior pulse's applied `brokerage_plant` receipts
 * through `brokeragePlantHandoff.appliedPlantEnvelopesAt`, so a commission bought last week
 * can aim at a picture being carried across a table this week.
 *
 * IT IS A READ, NEVER AN EDIT TO A WAR PATH (the volume's Q2 discipline): the envoy file
 * gains a pure collection call and nothing else, and `prepareEnvoyPlantTargets` itself is
 * byte-unedited — the carried envelope is re-stamped to this tick precisely so its
 * `seededTick === tick` guard stays true without being touched.
 *
 * THE COUNTERFORCE is that stage's own refusal, and it is strict: an envelope only becomes
 * a target when a REAL army of the market's host and a REAL envoy of the mark's court are
 * projected onto the SAME node this tick, the errand carries a negotiation picture naming
 * the subject, and the band it would move is not already at the end of its ladder. Every
 * other paid lie travels as an ordinary belief plant and touches no table.
 *
 * DARK ⇒ NOTHING: the read gates on `informationBrokeragesEnabled` AND
 * `infoStatecraftEnabled`, so with either absent the collection returns an empty array and
 * the stage takes its existing empty-input early return — byte-identical for every war
 * golden.
 *
 * ── THE RECEIPT ADDRESS NAMES ONLY WHAT THE SHIPPED ROAD CAN WRITE (repair, 2026-08-06) ──
 *
 * IN-0a first spelled this `commission.{receipt,target}`. The `.target` half was
 * STRUCTURALLY UNWRITABLE and the row advertised it anyway, which is the one thing a
 * coupling row must never do — §0.3's whole purpose is that "a reader who has only the row
 * can find the whole seam", and half of this one led nowhere.
 *
 * MEASURED: the two consumers read at their OWN heads. `envoyPulse` collects untargeted
 * envelopes, hands them to `prepareEnvoyPlantTargets`, which attaches a target to ITS OWN
 * copy and returns it on `planted.commissionedPlants`; the pulse kernel never threads that
 * value anywhere (executed grep: `envoys.commissionedPlants` has no reader), and the
 * statecraft head then calls `appliedPlantEnvelopesAt` FRESH, getting envelopes that carry
 * exactly `{key, record, override, receipt}` and no target. So
 * `commissionedPlantAt`'s `...(exactTarget ? { target } : {})` arm cannot fire in
 * production, and `commission.target` is never persisted.
 *
 * The address therefore names the REACHABLE half only. The unreachable half is a DECLARED
 * RESIDUAL of the ruled road, not a defect of this row: curing it needs a kernel thread of
 * one return value (both pulse mouths are banked) or the pendingPlants deposit, which is
 * IN-1's business. `tests/domain/brokeragePlantHandoffPins.test.js` samples THIS row's
 * address against a REAL folded ledger through tests/helpers/couplingReceiptSample.js and
 * reds on any leaf the writer does not write, so the two cannot drift apart again.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const IN0A_PLANT_HANDOFF_COUPLING = couplingRow({
  couplingId: 'CPL-19.INFO_TO_GRAMMAR.IN-0a.paid_plant_handoff',
  pairId: 'CPL-19',
  direction: 'INFO→GRAMMAR',
  read: 'src/domain/worldPulse/envoyPulse.js#advanceEnvoyDiplomacyPulse',
  receiptField: 'spatialLedgers.disinfo[plant:*].commission.{receipt}',
  counterforce: 'src/domain/worldPulse/envoyInterceptionStage.js#prepareEnvoyPlantTargets',
  flags: Object.freeze([
    'informationBrokeragesEnabled',
    'infoStatecraftEnabled',
  ]),
  owningVolume: 'INFORMATION',
  owningWave: 'IN-0a',
  intendedDesk: 'war',
  kinds: Object.freeze(['plant_took']),
});

/**
 * IN-0c / GRAMMAR→INFO. THE COMPELLED BOOKS CREDIT THE COURT THAT OPENED THEM.
 *
 * ⚠ THE WAVE SUFFIX IS LOWERCASE HERE AND UPPERCASE IN THE PACKET TITLE (IN-0C). That is
 * the registry's own convention, not a typo: COUPLING_ID_SHAPE admits `-\d+[a-z]?`, the
 * IN-0a row beside this one spells it lowercase, and the content annex heads the section
 * `## IN-0c`. An uppercase suffix REDS the shape pin.
 *
 * A disclosure clause is signed at `T-1`; at `T` the information layer credits the court
 * that now owes its books, because a promise kept where keeping it costs something is the
 * cheapest credibility a court can buy. The read is one line: the statecraft mover's
 * `provenTrue` DEFAULT calls `disclosureSigningCredits`, a pure GRAMMAR-side predicate over
 * the persisted treaty ledger.
 *
 * WHY THE EDGE EXISTS AT ALL, stated because CW-0w keys on the (importer, imported) PAIR
 * and not on reachability: the credit is INFORMATION's own state, the instrument that earns
 * it is GRAMMAR's, and no arrangement of the two functions removes the port crossing —
 * moving the predicate into this layer only inverts the direction, because it would then
 * read the term catalog and the treaty orientation instead. The edge is designed, so it
 * takes a row rather than a baseline line.
 *
 * NOTHING IS PERSISTED BY THE COUPLING ITSELF. The predicate deposits no marker: it is pure
 * over persisted treaty state, which is what makes it exactly-once by construction under
 * replay. The RECEIPT it leaves behind is the credibility stock the fold writes.
 *
 * THE COUNTERFORCE IS THE EXPLICIT-WINS SEAM. Any caller that passes `provenTrue` — even
 * `[]` — suppresses the derivation entirely and this coupling does not run; only an omitted
 * (or non-array) argument reaches it. That is a real refusal at the read address, and it is
 * pinned by acceptance case A8.
 * ⚠ CHAIR — RATIFY AT LANDING: an equally defensible counterforce is the leaf's own obligor
 * guard (`peaceTermsDisclosure.js#disclosureSigningCredits` — a treaty that cannot resolve
 * an obligor credits nobody), which would match the ES-1 idiom of siting the counterforce
 * on the OTHER side of the port. The explicit-wins seam is used here per the chair's
 * instruction; ratify one at landing.
 *
 * DARK ⇒ NOTHING: `advanceInformationStatecraft` returns at its first line when
 * `infoStatecraftActive` is false, so the derivation is unreachable; and with the peace
 * engine dark there is no treaty ledger to read, so it returns `[]` regardless.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.IN-0c.disclosure_signing_credit',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/informationStatecraft.js#advanceInformationStatecraft',
  receiptField: 'spatialLedgers.credibility[].{score,lastUpdateTick,holder}',
  counterforce: 'src/domain/worldPulse/informationStatecraft.js#advanceInformationStatecraft',
  flags: Object.freeze([
    'infoStatecraftEnabled',
    'peaceEngineEnabled',
  ]),
  owningVolume: 'INFORMATION',
  owningWave: 'IN-0c',
  intendedDesk: 'trade',
  kinds: Object.freeze(['treaty_disclosure_opened']),
});

/** Every INFORMATION row, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const IN_INFORMATION_COUPLINGS = Object.freeze([
  IN0A_PLANT_HANDOFF_COUPLING,
  IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING,
]);
