/**
 * envoyInbound.js — FP SP-D2: THE INBOUND READ, and the reception's direction row (the FP
 * fold §12.2 rows 8 and 9, §12.5 lane FP-A unit 1; J-EM-3; R-2; L10 (b) and (c)).
 *
 * WHAT IT ANSWERS. "Who stands at this settlement's gate?" Design §18 names the condition ("an
 * envoy arrived") and §19 ruling 6 names where the fact lives: "an envoy's arrival is LIVE on
 * the SENDER's errand (readable across the campaign for a real neighbour)". So this leaf reads
 * the SENDER's rows, `worldState.envoyErrands` through the errand family's one reader
 * `envoyErrandsOf`, and keeps the ones whose TARGET is the settlement asked about. It owns no
 * state and writes none, and it is the ONE inbound reader: WF-2b's legates ride it (R-2).
 *
 * ⛔ AT THE GATE IS FIVE FACTS, EACH READ AT ITS SOURCE, NONE SPELLED BARE, AND EACH THE ONLY
 * ONE STANDING BETWEEN SOME LAWFUL ROW AND A FALSE ANSWER (the acceptance refuses each alone).
 *   1. THE TARGET. `errand.to` is the settlement the sender's offer names (the DTO holds
 *      `offer.proposalPayload.targetId === to`), so an envoy bound for a third town never
 *      answers for this gate, and the sender's own card never sees its own envoy.
 *   2. LIVE. The errand is in one of the family's `ACTIVE_STATES`. An envoy lost at the table
 *      keeps the cursor and the parlay id he died with, and stands at no gate.
 *   3. ARRIVED. The cursor stands on the OUTBOUND journey's LAST leg at the band `arrived`, the
 *      two words taken OUT of their closed lists (`ENVOY_POSITION_BANDS`, `ENVOY_JOURNEYS`), so
 *      an upstream rename empties the lookup and the positive arm reds instead of this reader
 *      answering "nobody" for ever. An envoy `underway` is on the road, and one walking home
 *      from the table (the return begun before any verdict) is on the road again.
 *   4. AT THE TARGET'S OWN TABLE. The row carries the TARGET parlay's id, a parlay id that
 *      names no road encounter. A field parlay an intercepting column opened is that column's
 *      business, even on this town's own node.
 *   5. UNDECIDED. No term sheet and no refusal yet. The parlay's one draft
 *      (`envoyInterceptionStage.js :: resolveMaturedParlays`) is the moment a reception can
 *      still mean anything; once it has spoken the envoy only waits for his road home, and a
 *      seal offered then would name an act the world can no longer honour (the R9 stage law
 *      `worldConditions.js` states for every row).
 *
 * ⛔ A DARK LAYER HAS NO ENVOY AT ANY GATE (the fold's dark-layer law, J-EM-4: seals light with
 * their layers). Two exported gates, each by its own name: the errand layer's
 * `envoyDiplomacyActive` (the six `ENVOY_REQUIRED_RULES`; with any one unlit the layer does not
 * advance, so an envoy frozen at a gate could never be received) and the errand spine's
 * `errandSpineActive` (SP-D2 RIDES `errandSpineEnabled` and mints no flag of its own). A ledger
 * that still holds rows in a darkened world answers empty here.
 *
 * ⛔ A DM-SIDE READING, AND THE VEIL SAYS WHICH CLASS. `purposeClass` is the errand's TRUE class
 * through the one reader `purposeClassOf`: the editor is the DM's surface, and the DM sees a
 * spy for what he is. A player-facing surface reads the FACE through the projection's audience
 * split (`envoyErrandProjection.js :: projectErrandPurpose`), never through this row.
 *
 * ⛔ THE COUNTERPARTY (L10 (c)). The sender is an id read off the errand and is never resolved
 * to a record here, so a phantom sender (a minimal save record with no simulated side) passes
 * through as its id, and a phantom record filed where an errand belongs is dropped by the
 * family's own normalizer without a throw. Whether a seal is offered for a phantom sender is
 * the shell's phantom column (§19 ruling 10), not this reader's question.
 *
 * ⭐ THE RECEPTION'S DIRECTION ROW LIVES HERE TOO (L10 (b)(ii), the ladder's last rung: no realm
 * verb, declared direction, registered fork or off-stage op expresses "receive this envoy, or
 * turn him away"). `envoyReceptionRow` is authored in `operations.js`'s eleven-field
 * `OpTypeDeclaration` shape with both of its vocabularies IMPORTED from the leaf that owns
 * them, so EM-C1's `resolveDecree` reads it without a translation. It is NOT spliced into
 * `DIRECTION_OP_TYPES` here: the registry gains the import at the merge, the chair's
 * composition, exactly as `directions.js`'s own header reserves it.
 *
 * ⛔ AND NOTHING CONSUMES THE ROW YET (the chair's amendment to the FP-A brief, 2026-09-23). No
 * transport carries a settlement-scale direction into a pulse layer at the tick: the kernel
 * holds the tick's causes at its head and spreads them onto the pulse record at the end,
 * `advanceEnvoyDiplomacyPulse` is handed none, and a cause carries no op payload. So the row is
 * declared and resolvable and moves nothing. SP-D2-c: the reception's consumer in the parlay
 * stage lands when U123 composes the direction transport.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation, no draw.
 *
 * @enforced-by tests/domain/envoyInbound.test.js
 */
import { compareCodepoint } from '../deterministicSort.js';
import {
  ACTIVE_STATES,
  ENVOY_JOURNEYS,
  ENVOY_PARLAY_REFUSAL_REASONS,
  ENVOY_POSITION_BANDS,
  ENVOY_RECEPTION_DECISIONS,
  asObject,
  purposeClassOf,
} from './envoyErrandVocabulary.js';
import { envoyDiplomacyActive } from './envoyErrandOffer.js';
import { envoyErrandsOf } from './envoyErrandRecords.js';
import { errandSpineActive } from './errandMint.js';

/**
 * One envoy standing at a gate, as a seal reads him.
 * @typedef {{ errandId: string, fromId: string, envoyId: string, purposeClass: string,
 *   position: string }} InboundEnvoy
 *
 * The reception row's field spec, at the shape `directions.js` declares its own.
 * @typedef {{ kind: string, values?: readonly string[], required: boolean }} ReceptionFieldSpec
 *
 * The reception row, at `directions.js`'s `DirectionTypeDeclaration` shape field for field,
 * so the chair's splice into `DIRECTION_OP_TYPES` needs no translation and no cast.
 * @typedef {{
 *   target: string,
 *   payload: Readonly<Record<string, ReceptionFieldSpec>>,
 *   stage: string,
 *   consequence: string,
 *   requires: { world: readonly string[], registry: readonly string[] },
 *   enables: readonly string[],
 *   relatedTo: readonly string[],
 *   conflictsWith: readonly string[],
 *   duration: number|null,
 *   guards: readonly Function[],
 *   guardsStated: string,
 * }} ReceptionTypeDeclaration
 */

/** The two words the cursor is tested against, each taken OUT of its own closed list. */
const ARRIVED = ENVOY_POSITION_BANDS.filter((band) => band === 'arrived')[0] || '';
const OUTBOUND = ENVOY_JOURNEYS.filter((journey) => journey === 'outbound')[0] || '';

/** One shared frozen empty answer, so a gate nobody stands at allocates nothing. */
const NO_INBOUND = /** @type {readonly InboundEnvoy[]} */ (Object.freeze([]));

/** The same, for the senders. */
const NO_SENDERS = /** @type {readonly string[]} */ (Object.freeze([]));

/** @param {unknown} value @returns {readonly unknown[]} */
function listOf(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} value @returns {string} a non-empty id, or '' */
function idOf(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/**
 * The five facts of the header, over ONE normalized row, in the header's order.
 * @param {Record<string, unknown>} errand a row the family reader returned
 * @param {string} gate the settlement asked about
 * @returns {boolean}
 */
function standsAtGate(errand, gate) {
  if (idOf(errand.to) !== gate || !ACTIVE_STATES.has(String(errand.state))) return false;
  const position = asObject(errand.positionRef);
  const outbound = listOf(errand.legs).filter((leg) => asObject(leg).journey === OUTBOUND);
  if (position.journey !== OUTBOUND || position.progressBand !== ARRIVED
    || Number(position.legIndex) !== outbound.length - 1) return false;
  const parlayId = idOf(errand.parlayId);
  if (parlayId === '' || listOf(errand.encounters).some((entry) => asObject(entry).id === parlayId)) {
    return false;
  }
  return errand.termSheet == null && errand.parlayRefusal == null;
}

/**
 * ⭐ THE INBOUND READ: every envoy standing at `settlementId`'s gate, in codepoint order of his
 * errand id. Total and false-on-absence: an absent world, an absent id, a dark layer or a
 * ledger of garbage answers the shared empty list, never a throw.
 *
 * @param {unknown} worldState the campaign's world, as `worldConditions.js` hands it
 * @param {unknown} settlementId the gate's settlement
 * @returns {readonly InboundEnvoy[]} frozen rows in a frozen list
 */
export function inboundEnvoysAt(worldState, settlementId) {
  const gate = idOf(settlementId);
  if (gate === '' || !envoyDiplomacyActive(worldState) || !errandSpineActive(worldState)) {
    return NO_INBOUND;
  }
  /** @type {InboundEnvoy[]} */
  const rows = [];
  for (const errand of envoyErrandsOf(worldState)) {
    if (!standsAtGate(errand, gate)) continue;
    rows.push(Object.freeze({
      errandId: String(errand.id),
      fromId: String(errand.from),
      envoyId: String(errand.npcId),
      purposeClass: purposeClassOf(errand),
      position: ARRIVED,
    }));
  }
  if (rows.length === 0) return NO_INBOUND;
  return Object.freeze(rows.sort((a, b) => compareCodepoint(a.errandId, b.errandId)));
}

/**
 * THE SEAL'S SUBJECTS: the courts whose envoys stand at this gate, each named once, in
 * codepoint order. Derived from `inboundEnvoysAt` and from nothing else, so the condition and
 * its subjects are one reading and cannot disagree (the `pendingPeaceOffer` shape).
 *
 * @param {unknown} worldState @param {unknown} settlementId
 * @returns {readonly string[]} frozen; the shared empty list when nobody stands there
 */
export function inboundEnvoySenders(worldState, settlementId) {
  const rows = inboundEnvoysAt(worldState, settlementId);
  if (rows.length === 0) return NO_SENDERS;
  return Object.freeze([...new Set(rows.map((row) => row.fromId))].sort(compareCodepoint));
}

/**
 * The op type a reception decree stages under. ONE type for both seals, because the decision
 * is the payload: `direct-realm` is one type over sixteen verbs for the same reason.
 */
export const ENVOY_RECEPTION_TYPE = 'receive-envoy';

/** @param {ReceptionTypeDeclaration} decl @returns {ReceptionTypeDeclaration} frozen at every level */
function frozenRow(decl) {
  return Object.freeze({
    ...decl,
    payload: Object.freeze(decl.payload),
    requires: Object.freeze({
      world: Object.freeze(decl.requires.world),
      registry: Object.freeze(decl.requires.registry),
    }),
    enables: Object.freeze(decl.enables),
    relatedTo: Object.freeze(decl.relatedTo),
    conflictsWith: Object.freeze(decl.conflictsWith),
    guards: Object.freeze(decl.guards),
  });
}

/**
 * ⭐ THE RECEPTION, AS A DIRECTION (design §16: the DM directs the process and the simulation
 * plays the consequence). `decision` is `ENVOY_RECEPTION_DECISIONS` BY REFERENCE; `reason` is
 * the parlay's own `ENVOY_PARLAY_REFUSAL_REASONS` BY REFERENCE, optional, because a turned-away
 * envoy leaves by the existing refusal road and names one of its words; `errandId` names the
 * envoy, because the target is the RECEIVING town and two courts' envoys can stand at one gate.
 * The world half of `requires` is `envoyArrived`, the condition this same wave made live.
 * @type {ReceptionTypeDeclaration}
 */
export const envoyReceptionRow = frozenRow({
  target: 'settlement',
  payload: {
    decision: Object.freeze({ kind: 'enum', values: ENVOY_RECEPTION_DECISIONS, required: true }),
    errandId: Object.freeze({ kind: 'ref', required: true }),
    reason: Object.freeze({ kind: 'enum', values: ENVOY_PARLAY_REFUSAL_REASONS, required: false }),
  },
  stage: 'home',
  consequence: 'home',
  requires: { world: ['envoyArrived'], registry: [] },
  enables: [],
  relatedTo: [],
  conflictsWith: [],
  duration: null,
  guards: [],
  guardsStated: 'No guard is wired here. The seal is offered only while an envoy stands at the gate undecided, which is the design 18 world-state condition envoyArrived reads, and a turned-away envoy leaves by the parlay own refusal road rather than a new state.',
});
