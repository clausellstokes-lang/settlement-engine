/**
 * domain/townMap/fabric/architecturalHistory.js — MF-T2M · ODQ §287.16 / §287.7 / §423 / §426 ·
 * SPEC §10.13 and the §10.14-era contracts block.
 * ⭐⭐ THE TWELVE-KIND DATED OPERATION **PAYLOAD** GRAMMAR, AND NOTHING THAT ACCEPTS ONE.
 *
 * ⛔⛔ WHAT THIS MODULE IS, IN ONE SENTENCE, BECAUSE THE BOUNDARY IS THE POINT. ODQ §423 split the
 * estate's operation vocabulary onto exactly two levels — *"the store registry is THE census of
 * DOOR VERBS; one domain artifact grammar owns operation PAYLOADS"* — and §423.1 made the split a
 * law: *"a module claiming both levels, or a third vocabulary at either level, is refused at
 * review as a second truth."* This module is the PAYLOAD level and only that. It mints records.
 * It has no gate, no verb, no executor, no receipt and no store row, and it may not grow one: the
 * artifacts it seals are PROPOSALS until a registered store verb accepts them, which is the
 * executor tranche's work under §423(3). The structural guard that keeps this honest lives in
 * `tests/lint/townMapFabricSingleDeclaration.walker.test.js` and refuses an acceptance-gate export
 * anywhere in this directory, forever.
 *
 * ⛔ ARCHITECTED IS NOT BUILT (preamble §P0). The GENERATION-SPEC carries the full designed
 * contract; this module implements the ERA SLICE of it, under MF-T2E's inherited law that an
 * unvalidatable required field is worse than an absent one. Named consequences:
 *   · `effectiveAt` is the landed `spatialReceipt.js` integer idiom — a safe non-negative integer.
 *     The spec's `TimeKey` has no landed spelling and this member mints none.
 *   · `provenanceRef` is validated STRUCTURALLY. Ledger RESOLUTION belongs to the member that
 *     lands the provenance ledger; a required field nothing can resolve would be worse than none.
 *   · The spec's optional `coverageRef` on the UNKNOWN cause arm is deliberately ABSENT: it names
 *     an `EvidenceCoverageRef` into an evidence registry this era cannot resolve. The door is shut
 *     on purpose, not overlooked (packet judgment J-TET2M-1).
 *   · The kind-specific validators the spec sketches for relocate-class endpoints, and the
 *     before→after diff-equality law, need an AFTER state. An operation record has no after state
 *     by construction, so those belong to the executor and are OUT with a named owner.
 *
 * ⭐ THE ONE-WAY LAW IS STRUCTURAL, NOT POLICED. The record carries `beforeMassingRef` and NO
 * after-ref field exists to misuse — the spec's own hash-cycle avoidance (*"operation artifacts
 * reference only the before state"*), in the MF-T2H unrepresentable-rather-than-forbidden idiom.
 *
 * ⭐ THE DERIVED IDENTITY, AND THE FREE-ALIAS LAW IT CARRIES FORWARD (MF-T2K's J-TCT2K-2).
 * `artifactId` is derived from the record's own content, in the exact idiom of the landed
 * `stateArtifactId`/`receiptArtifactId` derivations in `operations.js`. A caller-supplied
 * `artifactId` or `contentHash` is REFUSED by name, because a derivable identity a caller may
 * spell is a second identity wearing the first one's clothes. `operationId` stays the caller's
 * own EntityId: the spec carries both fields and they mean different things — `operationId` is
 * the world's name for the event, `artifactId` is the sealed record's content address.
 *
 * ⚠⚠ `CAUSE_UNKNOWN_REASONS` IS DELIBERATELY LOCAL AND IS **NOT** `massPart.js`'s
 * `MASSING_UNKNOWN_REASONS`. The two four-lists are near-collisions, which is exactly what makes
 * them dangerous: as SETS they differ by one member each way (`SOURCE_SILENT` here,
 * `NOT_OBSERVED` there) and the three they share sit in a DIFFERENT ORDER. MF-T2K imported
 * massPart's list because the two spec lists were byte-identical there; here they are not, so a
 * local declaration is the honest spelling and the acceptance file pins the difference in both
 * directions — a future "deduplication" that fuses two vocabularies the spec keeps distinct reds
 * on arrival instead of silently rewriting the spec.
 *
 * ⛔ WHAT THIS MODULE DELIBERATELY DOES NOT DO: no store motion of any kind · no executor, no
 * after state, no receipt, no `DerivationAuthorityRef` · no epoch derivation and no chronology
 * validator (epochs are DERIVED never knobbed, sealed-side) · no registry resolution and no
 * `RegisteredOperationKindId` door · no `RURAL_CHANGE` family and no `CoreOperationKind` row
 * (owner-gated behind D3b, §287.16) · no `mapEdits`/document-inverse path (§10.13: causes are
 * operations, never document inverses) · no barrel row (the five-dormant-leaves precedent) · no
 * quanta arithmetic and no geometry, so preamble R-MF-2 has no surface here.
 *
 * ⭐ AND IT ADDRESSES IDENTITIES, NEVER COORDINATES. The sealed `lineage.js` fixes the law this
 * grammar is designed against — *"identity persists, ADDRESS is an event-dated attribute of the
 * identity"* — so every operation names a `bodyId` and part ids, and a relocate-class event is a
 * dated operation against a persistent identity rather than a coordinate delta.
 */

import { sceneDigest, stableSceneStringify } from '../../townScene/stableScene.js';
import {
  deepFreezeCanonical, requireCanonicalId, requireCanonicalRecord, sealCanonicalArtifact,
} from './foundation.js';

/** SPEC `ArchitecturalHistoryOperationKind`, verbatim and in SPEC order (12). Closed, frozen. */
export const ARCHITECTURAL_HISTORY_OPERATION_KINDS = Object.freeze([
  'ADD_MASS_PART', 'REMOVE_MASS_PART', 'INSERT_FLOOR', 'REMOVE_FLOOR',
  'RAISE_EAVES', 'REPLACE_ROOF', 'REPLACE_FACADE', 'ENCASE_FRAME',
  'REPAIR_COMPONENT', 'REUSE_COMPONENT', 'SUBDIVIDE_BODY', 'AMALGAMATE_BODY',
]);

/** SPEC `CauseRef.kind`, verbatim and in SPEC order (5). Closed, frozen. */
export const CAUSE_KINDS = Object.freeze([
  'OPERATION', 'EVENT', 'AUTHORITY_FACT', 'IMPORTED_SOURCE', 'AUTHORED_DECISION',
]);

/**
 * SPEC `CauseDisposition` UNKNOWN reasons, verbatim and in SPEC order (4). Closed, frozen.
 * ⚠ NOT `MASSING_UNKNOWN_REASONS` — see the module docblock; the difference is pinned.
 */
export const CAUSE_UNKNOWN_REASONS = Object.freeze([
  'SOURCE_SILENT', 'CONFLICTING_EVIDENCE', 'OUTSIDE_COVERAGE', 'WITHHELD',
]);

const ARTIFACT_KIND = 'ARCHITECTURAL_HISTORY_OPERATION';
const OPERATION_SCHEMA_VERSION = 1;
const OPERATION_LAW_VERSION = 'mf-t2m-architectural-history-operation-v1';

/** The fields every kind carries. The two split/merge kinds add exactly one more. */
const BASE_KEYS = Object.freeze([
  'affectedPartIds', 'beforeMassingRef', 'bodyId', 'cause', 'effectiveAt', 'kind',
  'operationId', 'provenanceRef',
]);

/**
 * The endpoint field a kind REQUIRES, or null when the kind must refuse both. Written as an
 * explicit branch rather than a lookup table so the two spellings are readable at the one place
 * the exact-record law consults them.
 * @param {unknown} kind @returns {'newBodyIds'|'sourceBodyIds'|null}
 */
function endpointFieldOf(kind) {
  if (kind === 'SUBDIVIDE_BODY') return 'newBodyIds';
  if (kind === 'AMALGAMATE_BODY') return 'sourceBodyIds';
  return null;
}

/**
 * The EXACT-RECORD law: a field that means nothing here must not ride along.
 * @param {unknown} value @param {string} label @param {readonly string[]} keys
 * @returns {Record<string, unknown>}
 */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  if (JSON.stringify(Object.keys(record).sort()) !== JSON.stringify([...keys].sort())) {
    throw new TypeError(`${label} must contain exactly ${[...keys].sort().join(', ')}`);
  }
  return record;
}

/**
 * Membership in a CLOSED vocabulary, guard-the-guard first: an empty vocabulary admits
 * everything, so it is itself the defect.
 * @param {unknown} value @param {readonly string[]} vocabulary @param {string} label
 */
function requireVocabularyMember(value, vocabulary, label) {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    throw new TypeError(`${label} has no closed vocabulary to be checked against`);
  }
  if (typeof value !== 'string' || !vocabulary.includes(value)) {
    throw new TypeError(`${label} must be one of: ${vocabulary.join(', ')}`);
  }
  return value;
}

/** The landed exact-reference idiom. @param {unknown} value @param {string} label */
function exactRef(value, label) {
  const source = exactRecord(value, label, ['artifactId', 'contentHash']);
  if (typeof source.contentHash !== 'string' || source.contentHash.length === 0) {
    throw new TypeError(`${label}.contentHash must be exact`);
  }
  return deepFreezeCanonical({
    artifactId: requireCanonicalId(source.artifactId, `${label}.artifactId`),
    contentHash: source.contentHash,
  });
}

/**
 * SPEC `ProvenanceRef`, validated structurally. Resolution is a later member's.
 * @param {unknown} value @param {string} label
 */
function provenanceRefOf(value, label) {
  const source = exactRecord(value, label, ['ledgerRef', 'provenanceId', 'recordHash']);
  if (typeof source.recordHash !== 'string' || source.recordHash.length === 0) {
    throw new TypeError(`${label}.recordHash must be exact`);
  }
  return deepFreezeCanonical({
    ledgerRef: exactRef(source.ledgerRef, `${label}.ledgerRef`),
    provenanceId: requireCanonicalId(source.provenanceId, `${label}.provenanceId`),
    recordHash: source.recordHash,
  });
}

/**
 * A nonempty list of DISTINCT canonical ids. The spec's own law for the affected set — *"a
 * history/change operation always names at least one affected ID"* — and the ≥2 arity the two
 * split/merge kinds need, in one place so both read the same refusals.
 * @param {unknown} value @param {string} label @param {number} least
 */
function idListOf(value, label, least) {
  if (!Array.isArray(value) || value.length < least) {
    throw new TypeError(`${label} must name at least ${least} id${least === 1 ? '' : 's'}`);
  }
  const ids = value.map((entry, index) => requireCanonicalId(entry, `${label}[${index}]`));
  if (new Set(ids).size !== ids.length) {
    throw new TypeError(`${label} must be distinct — a repeated id names one subject twice`);
  }
  return ids;
}

/** The landed dated-integer idiom (`spatialReceipt.js`). @param {unknown} value */
function effectiveAtOf(value) {
  if (!Number.isSafeInteger(value) || Number(value) < 0) {
    throw new TypeError('effectiveAt must be a non-negative safe integer date');
  }
  return Number(value);
}

/**
 * SPEC `CauseDisposition` — total in exactly two arms, with the NO-INFERENCE law spelled in BOTH
 * directions and each direction carrying its own message, so neither arm can cover for the other.
 * @param {unknown} value @returns {Readonly<Record<string, unknown>>}
 */
function causeOf(value) {
  const source = requireCanonicalRecord(value, 'cause');
  if (source.status === 'KNOWN' && source.reason !== undefined) {
    throw new TypeError('cause KNOWN may not carry a reason — the no-inference law refuses a '
      + 'disposition that is both known and excused');
  }
  if (source.status === 'UNKNOWN' && source.causeRef !== undefined) {
    throw new TypeError('cause UNKNOWN may not carry a causeRef — the no-inference law refuses '
      + 'inferring a cause the record itself says is unknown');
  }
  if (source.status === 'KNOWN') {
    const known = exactRecord(source, 'cause', ['causeRef', 'status']);
    const ref = requireCanonicalRecord(known.causeRef, 'cause.causeRef');
    const exact = exactRecord(ref, 'cause.causeRef', ref.subjectId === undefined
      ? ['artifactRef', 'kind'] : ['artifactRef', 'kind', 'subjectId']);
    return deepFreezeCanonical({
      status: 'KNOWN',
      causeRef: {
        kind: requireVocabularyMember(exact.kind, CAUSE_KINDS, 'cause.causeRef.kind'),
        artifactRef: exactRef(exact.artifactRef, 'cause.causeRef.artifactRef'),
        ...(exact.subjectId === undefined ? {}
          : { subjectId: requireCanonicalId(exact.subjectId, 'cause.causeRef.subjectId') }),
      },
    });
  }
  if (source.status === 'UNKNOWN') {
    const unknown = exactRecord(source, 'cause', ['provenanceRef', 'reason', 'status']);
    return deepFreezeCanonical({
      status: 'UNKNOWN',
      reason: requireVocabularyMember(unknown.reason, CAUSE_UNKNOWN_REASONS, 'cause.reason'),
      provenanceRef: provenanceRefOf(unknown.provenanceRef, 'cause.provenanceRef'),
    });
  }
  throw new TypeError('cause must be exactly one of KNOWN or UNKNOWN — a third status would be a '
    + 'disposition the no-inference law cannot read');
}

/**
 * ⭐ Seal ONE dated architectural-history operation as a PROPOSAL.
 * @param {unknown} input
 * @returns {Readonly<Record<string, unknown> & {contentHash: string}>}
 */
export function architecturalHistoryOperation(input) {
  const source = requireCanonicalRecord(
    JSON.parse(stableSceneStringify(input)), 'architectural history operation',
  );
  for (const derived of ['artifactId', 'contentHash']) {
    if (source[derived] !== undefined) {
      throw new TypeError(`architectural history operation ${derived} is DERIVED from content — a`
        + ' caller may not spell a free alias for a content-addressed identity');
    }
  }
  const kind = requireVocabularyMember(
    source.kind, ARCHITECTURAL_HISTORY_OPERATION_KINDS, 'architectural history operation kind',
  );
  const endpointField = endpointFieldOf(kind);
  const exact = exactRecord(source, 'architectural history operation',
    endpointField === null ? BASE_KEYS : [...BASE_KEYS, endpointField]);
  const bodyId = requireCanonicalId(exact.bodyId, 'bodyId');
  const endpoints = endpointField === null ? null
    : idListOf(exact[endpointField], `${kind} ${endpointField}`, 2);
  if (endpoints !== null && endpoints.includes(bodyId)) {
    throw new TypeError(`${kind} ${endpointField} may not name its own bodyId — an endpoint that `
      + 'is the subject is not an endpoint');
  }
  const body = {
    artifactKind: ARTIFACT_KIND, operationId: requireCanonicalId(exact.operationId, 'operationId'),
    schemaVersion: OPERATION_SCHEMA_VERSION, lawVersion: OPERATION_LAW_VERSION, kind, bodyId,
    affectedPartIds: idListOf(exact.affectedPartIds, 'affectedPartIds', 1),
    effectiveAt: effectiveAtOf(exact.effectiveAt), cause: causeOf(exact.cause),
    beforeMassingRef: exactRef(exact.beforeMassingRef, 'beforeMassingRef'),
    provenanceRef: provenanceRefOf(exact.provenanceRef, 'provenanceRef'),
    ...(endpointField === null ? {} : { [endpointField]: endpoints }),
  };
  return sealCanonicalArtifact({
    ...body,
    artifactId: `arch-history-op:${sceneDigest({ domain: OPERATION_LAW_VERSION, ...body })}`,
  });
}

/**
 * ⭐ Re-derive a sealed operation through its SOLE creator and refuse any divergence — the landed
 * `requireReplay` idiom, and the half of the payload-compiler role that makes a tampered proposal
 * detectable by any future acceptor.
 * @param {unknown} value
 */
export function replayArchitecturalHistoryOperation(value) {
  const source = requireCanonicalRecord(value, 'architectural history operation');
  const endpointField = endpointFieldOf(source.kind);
  const replayed = architecturalHistoryOperation({
    operationId: source.operationId, kind: source.kind, bodyId: source.bodyId,
    affectedPartIds: source.affectedPartIds, effectiveAt: source.effectiveAt,
    cause: source.cause, beforeMassingRef: source.beforeMassingRef,
    provenanceRef: source.provenanceRef,
    ...(endpointField === null ? {} : { [endpointField]: source[endpointField] }),
  });
  if (stableSceneStringify(source) !== stableSceneStringify(replayed)) {
    throw new TypeError('architectural history operation does not replay through its sole creator');
  }
  return replayed;
}

/**
 * ⭐ THE §287.16 DETERMINISTIC FIXTURE — the second deliverable, a PRODUCTION export rather than a
 * test helper so the executor tranche consumes exactly the records this grammar mints. Three
 * dated operations over one hand-spelled synthetic body, strictly ascending, covering both cause
 * arms and one endpoint kind. Pure over nothing: no clock, no randomness, no locale ordering, and
 * every record re-derived through the sole creator at construction.
 */
export function architecturalHistoryFixture() {
  const beforeMassingRef = { artifactId: 'massing:arch-history-fixture:before',
    contentHash: 'scene-v1-arch-history-fixture-before' };
  const provenanceRef = {
    ledgerRef: { artifactId: 'ledger:arch-history-fixture',
      contentHash: 'scene-v1-arch-history-fixture-ledger' },
    provenanceId: 'provenance:arch-history-fixture:01',
    recordHash: 'scene-v1-arch-history-fixture-record',
  };
  const base = { bodyId: 'body:arch-history-fixture:guild-hall', beforeMassingRef, provenanceRef };
  const operations = [
    architecturalHistoryOperation({
      ...base, operationId: 'op:arch-history-fixture:01', kind: 'ADD_MASS_PART',
      affectedPartIds: ['part:arch-history-fixture:rear-range'], effectiveAt: 1204,
      cause: { status: 'KNOWN', causeRef: { kind: 'EVENT',
        artifactRef: { artifactId: 'event:arch-history-fixture:charter',
          contentHash: 'scene-v1-arch-history-fixture-charter' } } },
    }),
    architecturalHistoryOperation({
      ...base, operationId: 'op:arch-history-fixture:02', kind: 'REPLACE_ROOF',
      affectedPartIds: ['part:arch-history-fixture:main-range',
        'part:arch-history-fixture:rear-range'],
      effectiveAt: 1288,
      cause: { status: 'UNKNOWN', reason: 'SOURCE_SILENT', provenanceRef },
    }),
    architecturalHistoryOperation({
      ...base, operationId: 'op:arch-history-fixture:03', kind: 'SUBDIVIDE_BODY',
      affectedPartIds: ['part:arch-history-fixture:main-range'], effectiveAt: 1341,
      cause: { status: 'KNOWN', causeRef: { kind: 'AUTHORED_DECISION',
        artifactRef: { artifactId: 'decision:arch-history-fixture:partition',
          contentHash: 'scene-v1-arch-history-fixture-partition' },
        subjectId: 'body:arch-history-fixture:guild-hall' } },
      newBodyIds: ['body:arch-history-fixture:north-half',
        'body:arch-history-fixture:south-half'],
    }),
  ];
  for (const operation of operations) replayArchitecturalHistoryOperation(operation);
  return deepFreezeCanonical({
    beforeMassingRef: exactRef(beforeMassingRef, 'fixture beforeMassingRef'),
    operations,
  });
}
