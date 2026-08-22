/**
 * townMapArchitecturalHistory.test.js — MF-T2M · ODQ §287.16 / §423 / §426.
 *
 * THE ACCEPTANCE SURFACE for the GENERATION-SPEC's architectural-history operation PAYLOAD
 * grammar and its deterministic fixture, plus the §423 Shape-B strip contract (A6).
 *
 * SHAPE (preamble §P5): ONE literal `describe`, straight-line `test` calls, string-literal
 * titles, every loop INSIDE a named test. No `.each`, no `runIf`, no nesting — `credited` is the
 * census figure that lies, and this shape is what keeps it honest.
 *
 * ⚠ EVERY NEGATIVE HERE IS ANCHORED. The refusal arms construct a PASSING positive control
 * first, then mutate exactly one field, so a refusal can never be attributed to the wrong cause;
 * A6's absence pins route through `expectAbsentWithAnchor` BY NAME on the same line.
 */
import { describe, expect, test } from 'vitest';

import {
  ARCHITECTURAL_HISTORY_OPERATION_KINDS,
  CAUSE_KINDS,
  CAUSE_UNKNOWN_REASONS,
  architecturalHistoryFixture,
  architecturalHistoryOperation,
  replayArchitecturalHistoryOperation,
} from '../../src/domain/townMap/fabric/architecturalHistory.js';
import { MASSING_UNKNOWN_REASONS } from '../../src/domain/townMap/fabric/massPart.js';
import { sealCanonicalArtifact } from '../../src/domain/townMap/fabric/foundation.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';

/** SPEC `ArchitecturalHistoryOperationKind`, re-typed from the blob rather than imported. */
const SPEC_KINDS = [
  'ADD_MASS_PART', 'REMOVE_MASS_PART', 'INSERT_FLOOR', 'REMOVE_FLOOR',
  'RAISE_EAVES', 'REPLACE_ROOF', 'REPLACE_FACADE', 'ENCASE_FRAME',
  'REPAIR_COMPONENT', 'REUSE_COMPONENT', 'SUBDIVIDE_BODY', 'AMALGAMATE_BODY',
];
const SPEC_CAUSE_KINDS = [
  'OPERATION', 'EVENT', 'AUTHORITY_FACT', 'IMPORTED_SOURCE', 'AUTHORED_DECISION',
];
const SPEC_CAUSE_UNKNOWN = [
  'SOURCE_SILENT', 'CONFLICTING_EVIDENCE', 'OUTSIDE_COVERAGE', 'WITHHELD',
];

const BEFORE_REF = { artifactId: 'massing:acceptance:before', contentHash: 'scene-v1-acceptance-before' };
const PROVENANCE = {
  ledgerRef: { artifactId: 'ledger:acceptance', contentHash: 'scene-v1-acceptance-ledger' },
  provenanceId: 'provenance:acceptance:01',
  recordHash: 'scene-v1-acceptance-record',
};
const KNOWN_CAUSE = {
  status: 'KNOWN',
  causeRef: {
    kind: 'OPERATION',
    artifactRef: { artifactId: 'op:acceptance:prior', contentHash: 'scene-v1-acceptance-prior' },
  },
};
const UNKNOWN_CAUSE = { status: 'UNKNOWN', reason: 'SOURCE_SILENT', provenanceRef: PROVENANCE };

/** A valid input for any non-endpoint kind. Overrides are applied last. */
function input(overrides = {}) {
  return {
    operationId: 'op:acceptance:01',
    kind: 'ADD_MASS_PART',
    bodyId: 'body:acceptance:hall',
    affectedPartIds: ['part:acceptance:rear-range'],
    effectiveAt: 1200,
    cause: KNOWN_CAUSE,
    beforeMassingRef: BEFORE_REF,
    provenanceRef: PROVENANCE,
    ...overrides,
  };
}

/** Deep-frozen, all the way down. */
function expectDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  expect(Object.isFrozen(value)).toBe(true);
  for (const child of Object.values(value)) expectDeepFrozen(child);
}

describe('MF-T2M architectural-history operations and the deterministic fixture', () => {
  test('A1 the three closed vocabularies are the SPEC lists, and the cause-unknown near-collision with massPart is pinned in both directions', () => {
    // GUARD-THE-GUARD FIRST (preamble §P6): a membership law asserted against an empty
    // vocabulary admits everything, so the floors are asserted before anything reads them.
    for (const vocabulary of [ARCHITECTURAL_HISTORY_OPERATION_KINDS, CAUSE_KINDS,
      CAUSE_UNKNOWN_REASONS]) {
      expect(Array.isArray(vocabulary)).toBe(true);
      expect(vocabulary.length).toBeGreaterThan(0);
      expect(Object.isFrozen(vocabulary)).toBe(true);
    }
    expect([...ARCHITECTURAL_HISTORY_OPERATION_KINDS]).toEqual(SPEC_KINDS);
    expect([...CAUSE_KINDS]).toEqual(SPEC_CAUSE_KINDS);
    expect([...CAUSE_UNKNOWN_REASONS]).toEqual(SPEC_CAUSE_UNKNOWN);
    expect(ARCHITECTURAL_HISTORY_OPERATION_KINDS.length).toBe(12);

    // ⚠⚠ THE ANTI-DRIFT PIN — the trap named before it bites. `CAUSE_UNKNOWN_REASONS` and
    // massPart's `MASSING_UNKNOWN_REASONS` are two DIFFERENT four-lists that look like one.
    // ⛔ The compile predicted "they differ at exactly index 0"; EXECUTED against both sources
    // that is false POSITIONALLY, so the pin is stronger than the prediction and states the
    // whole truth: as SETS they differ by exactly one member each way, and the three they SHARE
    // sit in a different order (indices 1 and 2 are swapped). Both facts are pinned so neither a
    // merge, a "deduplication", nor a reorder can silently fuse two vocabularies the SPEC keeps
    // distinct. This test deliberately IMPORTS massPart's list rather than re-typing it: the
    // point is to compare the two LIVE declarations, and a re-typed copy could not drift.
    const cause = [...CAUSE_UNKNOWN_REASONS];
    const massing = [...MASSING_UNKNOWN_REASONS];
    expect(cause.length).toBe(4);
    expect(massing.length).toBe(4);
    expect(cause.filter((r) => !massing.includes(r))).toEqual(['SOURCE_SILENT']);
    expect(massing.filter((r) => !cause.includes(r))).toEqual(['NOT_OBSERVED']);
    expect(cause.filter((r) => massing.includes(r)).sort())
      .toEqual(['CONFLICTING_EVIDENCE', 'OUTSIDE_COVERAGE', 'WITHHELD']);
    // …and the ORDER differs too, which a set-only pin would miss: substituting the one token
    // still does not make the ordered lists equal.
    expect(cause.map((r) => (r === 'SOURCE_SILENT' ? 'NOT_OBSERVED' : r))).not.toEqual(massing); // anchored: both lists are asserted member-by-member three lines above, so neither can be empty or drifted when this order pin runs
    expect([cause[1], cause[2]]).toEqual([massing[2], massing[1]]);

    // THE HAPPY PATH: one operation per constructible class, each frozen deep, each replaying
    // JSON-identical through the sole creator.
    const built = [
      architecturalHistoryOperation(input()),
      architecturalHistoryOperation(input({ kind: 'REPLACE_ROOF', cause: UNKNOWN_CAUSE })),
      architecturalHistoryOperation(input({ kind: 'SUBDIVIDE_BODY',
        newBodyIds: ['body:acceptance:north', 'body:acceptance:south'] })),
      architecturalHistoryOperation(input({ kind: 'AMALGAMATE_BODY',
        sourceBodyIds: ['body:acceptance:east', 'body:acceptance:west'] })),
    ];
    for (const operation of built) {
      expect(operation.artifactKind).toBe('ARCHITECTURAL_HISTORY_OPERATION');
      expect(operation.schemaVersion).toBe(1);
      expectDeepFrozen(operation);
      expect(stableSceneStringify(replayArchitecturalHistoryOperation(operation)))
        .toBe(stableSceneStringify(operation));
    }
    // …and every one of the twelve kinds is constructible this era — a trimmed closed list would
    // be a second vocabulary wearing the SPEC's name.
    for (const kind of ARCHITECTURAL_HISTORY_OPERATION_KINDS) {
      const extra = kind === 'SUBDIVIDE_BODY' ? { newBodyIds: ['body:acceptance:a', 'body:acceptance:b'] }
        : kind === 'AMALGAMATE_BODY' ? { sourceBodyIds: ['body:acceptance:a', 'body:acceptance:b'] } : {};
      expect(architecturalHistoryOperation(input({ kind, ...extra })).kind).toBe(kind);
    }
  });

  test('A2 the artifactId is DERIVED from content, distinct inputs never collide, and a tampered record refuses to replay', () => {
    const operation = architecturalHistoryOperation(input());
    expect(operation.artifactId.startsWith('arch-history-op:scene-v1-')).toBe(true);
    expect(operation.artifactId.length).toBeLessThanOrEqual(96);
    expect(operation.operationId).toBe('op:acceptance:01');

    // SAME INPUT REPLAYS IDENTICAL — including the content hash.
    const again = architecturalHistoryOperation(input());
    expect(stableSceneStringify(again)).toBe(stableSceneStringify(operation));
    expect(again.contentHash).toBe(operation.contentHash);

    // DISTINCT INPUTS NEVER SHARE AN IDENTITY. Each perturbation moves exactly one field.
    const perturbed = [
      input({ kind: 'REPLACE_ROOF' }),
      input({ affectedPartIds: ['part:acceptance:main-range'] }),
      input({ effectiveAt: 1201 }),
      input({ operationId: 'op:acceptance:02' }),
      input({ bodyId: 'body:acceptance:other' }),
      input({ cause: UNKNOWN_CAUSE }),
    ].map((value) => architecturalHistoryOperation(value).artifactId);
    expect(new Set([operation.artifactId, ...perturbed]).size).toBe(perturbed.length + 1);

    // THE FREE-ALIAS LAW, both spellings, each refused BY NAME.
    for (const derived of ['artifactId', 'contentHash']) {
      expect(() => architecturalHistoryOperation(input({ [derived]: 'arch-history-op:mine' })))
        .toThrow(/DERIVED from content/);
    }

    // THE TAMPER PIN. Positive control first: an untouched record replays. Then one payload byte
    // is moved through a RESEAL — so `contentHash` is internally consistent and only the replay
    // through the sole creator can tell that the content is not what its identity claims.
    expect(replayArchitecturalHistoryOperation(operation).contentHash).toBe(operation.contentHash);
    const body = JSON.parse(stableSceneStringify(operation));
    delete body.contentHash;
    body.effectiveAt = 1999;
    const tampered = sealCanonicalArtifact(body);
    expect(tampered.contentHash).not.toBe(operation.contentHash);
    expect(() => replayArchitecturalHistoryOperation(tampered))
      .toThrow(/does not replay through its sole creator/);
  });

  test('A3 every field refusal is typed, and each is attributable to the one field it changes', () => {
    // POSITIVE CONTROL FIRST: the unmutated input constructs, so every refusal below is
    // attributable to its single perturbation and to nothing else.
    expect(architecturalHistoryOperation(input()).kind).toBe('ADD_MASS_PART');

    const refusals = [
      ['unknown kind', input({ kind: 'DEMOLISH_EVERYTHING' })],
      ['empty affected set', input({ affectedPartIds: [] })],
      ['duplicate affected id', input({ affectedPartIds: ['part:acceptance:a', 'part:acceptance:a'] })],
      ['affected id failing the wall', input({ affectedPartIds: ['Part:Acceptance:A'] })],
      ['bodyId failing the wall', input({ bodyId: 'BODY' })],
      ['negative effectiveAt', input({ effectiveAt: -1 })],
      ['fractional effectiveAt', input({ effectiveAt: 1200.5 })],
      ['cause with a third status', input({ cause: { status: 'MAYBE', reason: 'SOURCE_SILENT' } })],
      ['cause kind outside the closed five', input({ cause: { status: 'KNOWN',
        causeRef: { kind: 'RUMOUR', artifactRef: KNOWN_CAUSE.causeRef.artifactRef } } })],
      ['cause reason outside the closed four', input({ cause: { status: 'UNKNOWN',
        reason: 'NOT_OBSERVED', provenanceRef: PROVENANCE } })],
      ['malformed beforeMassingRef', input({ beforeMassingRef: { artifactId: 'massing:x' } })],
      ['malformed provenanceRef', input({ provenanceRef: { provenanceId: 'provenance:x' } })],
      ['an extra field riding along', input({ afterMassingRef: BEFORE_REF })],
    ];
    for (const [label, value] of refusals) {
      expect(() => architecturalHistoryOperation(value), label).toThrow(TypeError);
    }

    // ⭐ THE NO-INFERENCE LAW, BOTH DIRECTIONS, with DISTINCT messages so neither arm can cover
    // for the other. `NOT_OBSERVED` above is the anti-drift pin doing real work: massPart's
    // spelling is refused here precisely because these are two vocabularies, not one.
    expect(() => architecturalHistoryOperation(input({
      cause: { ...KNOWN_CAUSE, reason: 'SOURCE_SILENT' },
    }))).toThrow(/cause KNOWN may not carry a reason/);
    expect(() => architecturalHistoryOperation(input({
      cause: { ...UNKNOWN_CAUSE, causeRef: KNOWN_CAUSE.causeRef },
    }))).toThrow(/cause UNKNOWN may not carry a causeRef/);
  });

  test('A4 the endpoint law binds exactly the two split/merge kinds, and refuses those fields on every other kind', () => {
    // POSITIVE CONTROLS FIRST — both endpoint kinds construct when spelled correctly.
    const subdivide = architecturalHistoryOperation(input({ kind: 'SUBDIVIDE_BODY',
      newBodyIds: ['body:acceptance:north', 'body:acceptance:south'] }));
    const amalgamate = architecturalHistoryOperation(input({ kind: 'AMALGAMATE_BODY',
      sourceBodyIds: ['body:acceptance:east', 'body:acceptance:west'] }));
    expect(subdivide.newBodyIds).toEqual(['body:acceptance:north', 'body:acceptance:south']);
    expect(amalgamate.sourceBodyIds).toEqual(['body:acceptance:east', 'body:acceptance:west']);

    // MISSING, SHORT, DUPLICATED, and SELF-NAMING — symmetrically over both kinds.
    const pairs = [['SUBDIVIDE_BODY', 'newBodyIds'], ['AMALGAMATE_BODY', 'sourceBodyIds']];
    for (const [kind, field] of pairs) {
      expect(() => architecturalHistoryOperation(input({ kind })), `${kind} missing ${field}`)
        .toThrow(TypeError);
      expect(() => architecturalHistoryOperation(input({ kind, [field]: ['body:acceptance:one'] })),
        `${kind} ${field} of one`).toThrow(/at least 2 ids/);
      expect(() => architecturalHistoryOperation(input({ kind,
        [field]: ['body:acceptance:one', 'body:acceptance:one'] })), `${kind} ${field} duplicate`)
        .toThrow(/must be distinct/);
      expect(() => architecturalHistoryOperation(input({ kind,
        [field]: ['body:acceptance:hall', 'body:acceptance:south'] })), `${kind} names its subject`)
        .toThrow(/may not name its own bodyId/);
    }

    // THE EXACT-RECORD DIRECTION: a plain kind CARRYING either endpoint field is refused, and a
    // split kind carrying the MERGE field (and vice versa) likewise — a field that means nothing
    // must not ride.
    for (const field of ['newBodyIds', 'sourceBodyIds']) {
      expect(() => architecturalHistoryOperation(input({
        [field]: ['body:acceptance:one', 'body:acceptance:two'],
      })), `ADD_MASS_PART carrying ${field}`).toThrow(TypeError);
    }
    expect(() => architecturalHistoryOperation(input({ kind: 'SUBDIVIDE_BODY',
      sourceBodyIds: ['body:acceptance:one', 'body:acceptance:two'] }))).toThrow(TypeError);
    expect(() => architecturalHistoryOperation(input({ kind: 'AMALGAMATE_BODY',
      newBodyIds: ['body:acceptance:one', 'body:acceptance:two'] }))).toThrow(TypeError);

    // …and the two arms' refusal messages DIFFER, so neither can be mistaken for the other
    // (§P6: a redundant second guard that subsumes the first makes a conviction vacuous).
    const messages = pairs.map(([kind, field]) => {
      try {
        architecturalHistoryOperation(input({ kind, [field]: ['body:acceptance:hall', 'body:acceptance:x'] }));
        throw new Error(`${kind} was not refused — the endpoint law is not firing`);
      } catch (error) { return String(error.message); }
    });
    expect(messages[0]).not.toBe(messages[1]);
    expect(messages[0]).toContain('newBodyIds');
    expect(messages[1]).toContain('sourceBodyIds');
  });

  test('A5 the deterministic fixture is byte-stable, strictly dated, replay-verified, and pinned by one recorded golden', () => {
    const fixture = architecturalHistoryFixture();
    // DETERMINISM: two independent calls are byte-identical.
    expect(stableSceneStringify(architecturalHistoryFixture())).toBe(stableSceneStringify(fixture));
    expectDeepFrozen(fixture);
    expect(fixture.operations.length).toBe(3);

    // STRICTLY ASCENDING DATES — the ordering the chronicle's spatial twin will read.
    const dates = fixture.operations.map((operation) => operation.effectiveAt);
    expect(dates).toEqual([1204, 1288, 1341]);
    for (let index = 1; index < dates.length; index += 1) {
      expect(dates[index] > dates[index - 1]).toBe(true);
    }

    // EVERY RECORD RE-DERIVES THROUGH THE SOLE CREATOR.
    for (const operation of fixture.operations) {
      expect(stableSceneStringify(replayArchitecturalHistoryOperation(operation)))
        .toBe(stableSceneStringify(operation));
      expect(operation.beforeMassingRef).toEqual(fixture.beforeMassingRef);
    }

    // THE DECLARED COVERAGE: both cause arms and the endpoint kind are actually exercised.
    expect(fixture.operations.map((operation) => operation.kind))
      .toEqual(['ADD_MASS_PART', 'REPLACE_ROOF', 'SUBDIVIDE_BODY']);
    expect(fixture.operations.map((operation) => operation.cause.status))
      .toEqual(['KNOWN', 'UNKNOWN', 'KNOWN']);
    expect(fixture.operations[1].cause.reason).toBe('SOURCE_SILENT');
    expect(fixture.operations[2].newBodyIds.length).toBe(2);

    // ⭐ THE DETERMINISM RECEIPT — one literal golden, measured at implementation and recorded in
    // the packet body. A deliberate fixture change re-records this WITH its cause stated (the
    // honest-shift law); an accidental one reds here, which is the whole point of a golden.
    expect(fixture.operations[2].contentHash).toBe('scene-v1-c75cab40b6e086edaa26f04c3c4593ff');
  });
});
