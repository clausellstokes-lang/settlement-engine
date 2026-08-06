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

/** Every INFORMATION row, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const IN_INFORMATION_COUPLINGS = Object.freeze([
  IN0A_PLANT_HANDOFF_COUPLING,
]);
