/**
 * tests/domain/townMapMassPart.test.js — MF-T2E's acceptance matrix (A1–A6).
 *
 * The family's two-file acceptance shape: this domain matrix plus the determinism companion in
 * tests/property/. One literal `describe`, straight-line `test()` calls, string-literal titles,
 * fixtures built inside their named tests — the SP-D idiom, so the census credits the file.
 *
 * ⛔ NOTHING HERE IMPORTS THE SEALED SANDBOX. The proof that this member's discriminant is what
 * the D1 legality predicate admits was executed read-only against the preserved sealed blob at
 * the lane's base and is recorded in the packet; the LIVE interop arm belongs to the member that
 * ports that predicate home. No app or test file may reach into that tree.
 *
 * ⚠ Every id fixture is spelled to the landed canonical-id grammar, which is LOWERCASE ONLY.
 * That was found by executing the validator, not by reading the SPEC's camel-case prose.
 */

import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { COORDINATE_ABI_VERSION } from '../../src/domain/townMap/fabric/coordinateAbi.js';
import {
  FUNCTIONAL_VOLUME_KINDS,
  MASSING_UNKNOWN_REASONS,
  MORPHOLOGY_ROLE_KINDS,
  knownMassingFact,
  massPartQ,
  solidPartQ,
  unknownMassingFact,
  verticalIntervalQ,
} from '../../src/domain/townMap/fabric/massPart.js';

const SUPPORT = 'support:terrain:t1';
const SQUARE = Object.freeze([[0, 0], [10000, 0], [10000, 10000], [0, 10000]]);

/** The hall's solid input: ground to quantum 5000 on the terrain support. */
const hallSolid = () => ({
  partId: 'part:hall',
  supportSurfaceId: SUPPORT,
  footprint: SQUARE.map((point) => [...point]),
  vertical: { baseQ: 0, topQ: 5000 },
});

/** The solar's solid input: it STARTS at the quantum the hall ends on. */
const solarSolid = () => ({
  partId: 'part:solar',
  supportSurfaceId: SUPPORT,
  footprint: SQUARE.map((point) => [...point]),
  vertical: { baseQ: 5000, topQ: 9000 },
});

const hallPart = () => ({
  partId: 'part:hall',
  parentBodyId: 'body:manor',
  morphologyRole: 'MAIN_RANGE',
  functionalVolume: { status: 'KNOWN', value: 'OPEN_CLEAR' },
  solid: hallSolid(),
});

describe('MF-T2E mass-part vocabulary', () => {
  test('A1 · a two-part body constructs and wears the shape the legality predicate admits', () => {
    // POSITIVE CONTROL FIRST: both records construct at all, before anything is asserted ABOUT
    // them. A matrix whose subject failed to build proves nothing about its shape.
    const hall = solidPartQ(hallSolid());
    const solar = solidPartQ(solarSolid());
    expect(hall.partId).toBe('part:hall');
    expect(solar.partId).toBe('part:solar');

    // ⭐ THE DISCRIMINANT, pinned EXACTLY rather than loosely: this object — this key, these two
    // integers — is what the ported predicate reads. An extra field or a renamed kind would make
    // the port need adaptation, which is the thing this member exists to avoid.
    expect(hall.vertical).toEqual({ kind: 'INTERVAL', baseQ: 0, topQ: 5000 });
    expect(solar.vertical).toEqual({ kind: 'INTERVAL', baseQ: 5000, topQ: 9000 });
    expect(Object.keys(hall.vertical).sort()).toEqual(['baseQ', 'kind', 'topQ']);

    // Frozen all the way down — record, footprint, each point, and the interval.
    expect(Object.isFrozen(hall)).toBe(true);
    expect(Object.isFrozen(hall.footprint)).toBe(true);
    expect(Object.isFrozen(hall.footprint[0])).toBe(true);
    expect(Object.isFrozen(hall.vertical)).toBe(true);

    // The ABI version is READ from the live module, never transcribed as a literal here.
    expect(hall.abiVersion).toBe(COORDINATE_ABI_VERSION);

    // ⭐ HALF-OPEN ADJACENCY IS LEGAL BY DESIGN: the two parts share the boundary quantum 5000 —
    // one ends there, one begins there — and BOTH construct. A closed-interval reading would
    // have had to refuse one of them.
    expect(hall.vertical.topQ).toBe(solar.vertical.baseQ);
    expect(hall.supportSurfaceId).toBe(solar.supportSurfaceId);

    const part = massPartQ(hallPart());
    expect(part.morphologyRole).toBe('MAIN_RANGE');
    expect(part.functionalVolume).toEqual({ status: 'KNOWN', value: 'OPEN_CLEAR' });
    expect(Object.isFrozen(part)).toBe(true);
  });

  test('A2 · every bad input is refused with a typed error naming its own label', () => {
    // POSITIVE CONTROL: the unmodified fixture constructs, so each refusal below is attributable
    // to the ONE field it changes rather than to a fixture that never worked.
    expect(() => solidPartQ(hallSolid())).not.toThrow();

    expect(() => verticalIntervalQ(1.5, 5000)).toThrow(TypeError);
    expect(() => verticalIntervalQ(1.5, 5000)).toThrow(/verticalIntervalQ\.baseQ must be an integer/);
    expect(() => verticalIntervalQ(0, 9007199255)).toThrow(/must be an integer in/);
    // The empty and the inverted interval both name the half-open law rather than a generic range.
    expect(() => verticalIntervalQ(5000, 5000)).toThrow(/half-open interval law/);
    expect(() => verticalIntervalQ(9000, 5000)).toThrow(/half-open interval law/);
    // A keel below its support datum is legal ground, so negatives inside the wall are ACCEPTED.
    expect(verticalIntervalQ(-4000, -1000)).toEqual({ kind: 'INTERVAL', baseQ: -4000, topQ: -1000 });

    const uppercase = { ...hallSolid(), supportSurfaceId: 'support:wallTop:w9' };
    expect(() => solidPartQ(uppercase)).toThrow(/solidPartQ\.supportSurfaceId must be a canonical id/);
    const lowercase = { ...hallSolid(), supportSurfaceId: 'support:wall-top:w9' };
    expect(solidPartQ(lowercase).supportSurfaceId).toBe('support:wall-top:w9');

    // Every footprint COORDINATE goes through the same wall as the interval — a float or an
    // out-of-wall quantum is refused at its own indexed label, never coerced into the record.
    const floatCoord = { ...hallSolid(), footprint: [[0, 0], [10000.5, 0], [10000, 10000]] };
    expect(() => solidPartQ(floatCoord)).toThrow(/solidPartQ\.footprint\[1\]\[0\] must be an integer/);
    const pastWall = { ...hallSolid(), footprint: [[0, 0], [9007199255, 0], [10000, 10000]] };
    expect(() => solidPartQ(pastWall)).toThrow(/must be an integer in -9007199254\.\.9007199254/);

    const collapsed = { ...hallSolid(), footprint: [[0, 0], [1000, 1000], [2000, 2000]] };
    expect(() => solidPartQ(collapsed)).toThrow(/degenerate ring/);
    expect(() => solidPartQ({ ...hallSolid(), footprint: [[0, 0], [1, 1]] })).toThrow(/at least three/);
    expect(() => solidPartQ(null)).toThrow(/solidPartQ input must be an object/);

    const orphan = { ...hallPart() };
    delete orphan.parentBodyId;
    expect(() => massPartQ(orphan)).toThrow(/massPartQ\.parentBodyId must be a canonical id/);
  });

  test('A3 · the knowledge axis is total and an unknown fact carries no value', () => {
    const known = knownMassingFact('OPEN_CLEAR', FUNCTIONAL_VOLUME_KINDS, 'probe.volume');
    expect(known).toEqual({ status: 'KNOWN', value: 'OPEN_CLEAR' });
    const unknown = unknownMassingFact('NOT_OBSERVED', 'probe.volume');
    expect(unknown).toEqual({ status: 'UNKNOWN', reason: 'NOT_OBSERVED' });

    // ⭐ THE NO-INFERENCE LAW, MADE STRUCTURAL. The value is not merely undefined on an UNKNOWN
    // fact — the property does not exist, so nothing value-conditioned can read it at all. The
    // anchor is `reason`, which travels the same construction path and would vanish under the
    // same drift, so an empty key list cannot pass this arm.
    expectAbsentWithAnchor(Object.keys(unknown), 'value', 'reason',
      'an UNKNOWN massing fact must not carry a value');

    expect(() => knownMassingFact('CATHEDRAL_VOID', FUNCTIONAL_VOLUME_KINDS, 'p')).toThrow(TypeError);
    expect(() => unknownMassingFact('DID_NOT_LOOK', 'p')).toThrow(TypeError);
    // KNOWN with no value at all is refused too — a total axis has no third arm.
    expect(() => knownMassingFact(undefined, FUNCTIONAL_VOLUME_KINDS, 'p')).toThrow(TypeError);

    // An UNKNOWN input that ALSO smuggles a value is refused rather than quietly stripped.
    const smuggled = {
      ...hallPart(),
      functionalVolume: { status: 'UNKNOWN', reason: 'NOT_OBSERVED', value: 'OPEN_CLEAR' },
    };
    expect(() => massPartQ(smuggled)).toThrow(/no-inference law/);
    // …and a third status shape is refused rather than defaulted.
    const bogus = { ...hallPart(), functionalVolume: { status: 'PROBABLY', value: 'OPEN_CLEAR' } };
    expect(() => massPartQ(bogus)).toThrow(/must be exactly 'KNOWN' or 'UNKNOWN'/);

    const withUnknown = { ...hallPart(), functionalVolume: { status: 'UNKNOWN', reason: 'WITHHELD' } };
    expect(massPartQ(withUnknown).functionalVolume).toEqual({ status: 'UNKNOWN', reason: 'WITHHELD' });
  });

  test('A4 · the part and its solid must carry one identity', () => {
    const mismatched = { ...hallPart(), solid: solarSolid() };
    // The message names BOTH ids, so the reader learns which record disagreed with which.
    expect(() => massPartQ(mismatched)).toThrow(/part:hall/);
    expect(() => massPartQ(mismatched)).toThrow(/part:solar/);
    expect(() => massPartQ(mismatched)).toThrow(/identity law/);

    const agreeing = massPartQ(hallPart());
    expect(agreeing.solid.partId).toBe(agreeing.partId);
  });

  test('A5 · the three vocabularies are closed, frozen and exactly the SPEC values', () => {
    // GUARD-THE-GUARD OPENER: a membership test against an empty list admits everything, so the
    // lists are proved nonempty and frozen BEFORE they are compared to anything.
    for (const list of [FUNCTIONAL_VOLUME_KINDS, MORPHOLOGY_ROLE_KINDS, MASSING_UNKNOWN_REASONS]) {
      expect(list.length).toBeGreaterThan(0);
      expect(Object.isFrozen(list)).toBe(true);
    }

    expect(FUNCTIONAL_VOLUME_KINDS).toEqual([
      'OPEN_CLEAR', 'DOMESTIC_STACK', 'STORAGE_STACK', 'PARTIAL_LOFT',
      'OCCUPIED_ATTIC', 'UNINHABITED_ATTIC',
    ]);
    expect(MORPHOLOGY_ROLE_KINDS).toEqual([
      'MAIN_RANGE', 'CROSS_WING', 'REAR_RANGE', 'ANNEX',
      'STAIR_TOWER', 'GALLERY', 'PASSAGE', 'LEAN_TO',
      'CURTAIN_RUN', 'WALL_TOWER', 'GATEHOUSE', 'KEEP', 'BELFRY',
      'SPIRE', 'COVERED_PASSAGE', 'LAND_CAP', 'LAND_KEEL',
    ]);
    expect(MORPHOLOGY_ROLE_KINDS).toHaveLength(17);
    expect(MASSING_UNKNOWN_REASONS).toEqual([
      'NOT_OBSERVED', 'OUTSIDE_COVERAGE', 'CONFLICTING_EVIDENCE', 'WITHHELD',
    ]);

    // Each constructor refuses a non-member of ITS list, so a later widening reds on arrival.
    expect(() => knownMassingFact('LOFT_VOID', FUNCTIONAL_VOLUME_KINDS, 'p')).toThrow(TypeError);
    expect(() => unknownMassingFact('BUSY', 'p')).toThrow(TypeError);
    expect(() => massPartQ({ ...hallPart(), morphologyRole: 'BARBICAN' })).toThrow(TypeError);
    // …and the guard itself convicts an empty vocabulary rather than admitting everything.
    expect(() => knownMassingFact('OPEN_CLEAR', [], 'p')).toThrow(/no closed vocabulary/);
  });

  test('A6 · the named regression: the ring-area decision is exact at ABI scale', () => {
    const m = 1286630001;
    const sliver = [[0, 0], [m - 1, m], [m, m + 1]];

    // ⭐ THE DIVERGENCE, WITNESSED IN-TEST rather than cited. The float spelling of the shoelace
    // reads exactly zero on this triangle — it is real ground, and a Number-based degeneracy
    // check would refuse it.
    let doubleArea = 0;
    for (let i = 0; i < sliver.length; i += 1) {
      const [ax, az] = sliver[i];
      const [bx, bz] = sliver[(i + 1) % sliver.length];
      doubleArea += ax * bz - bx * az;
    }
    expect(doubleArea).toBe(0);

    // …and the exact spelling disagrees, which is why the leaf uses it.
    let exact = 0n;
    for (let i = 0; i < sliver.length; i += 1) {
      const [ax, az] = sliver[i];
      const [bx, bz] = sliver[(i + 1) % sliver.length];
      exact += BigInt(ax) * BigInt(bz) - BigInt(bx) * BigInt(az);
    }
    expect(exact).toBe(-1n);

    // ARM 1 — the valid sliver CONSTRUCTS. This is what a Number check would have destroyed.
    const built = solidPartQ({ ...hallSolid(), footprint: sliver });
    expect(built.footprint).toHaveLength(3);

    // ARM 2 — a genuinely collapsed ring is still REFUSED. Without this arm, deleting the check
    // outright would pass ARM 1 and the matrix would prove nothing about the check's presence.
    const collinear = [[0, 0], [1000, 1000], [2000, 2000]];
    let collapsedExact = 0n;
    for (let i = 0; i < collinear.length; i += 1) {
      const [ax, az] = collinear[i];
      const [bx, bz] = collinear[(i + 1) % collinear.length];
      collapsedExact += BigInt(ax) * BigInt(bz) - BigInt(bx) * BigInt(az);
    }
    expect(collapsedExact).toBe(0n);
    expect(() => solidPartQ({ ...hallSolid(), footprint: collinear })).toThrow(/degenerate ring/);
  });
});
