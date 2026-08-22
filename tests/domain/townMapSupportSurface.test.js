/**
 * MF-T2K acceptance — support-relative solids and component slots.
 *
 * ONE literal `describe`, six straight-line `test` calls with string-literal titles, every loop
 * INSIDE a named test (the SP-D idiom the family's census law requires); no `.each`, no `runIf`,
 * no nesting. The census motion this file buys is exactly +1 file / +1 credited / +6 titles /
 * +1 suiteTitle, and `parked` is untouched because every title is a literal.
 *
 * ⛔ ANCHOR PREFLIGHT, BY CONSTRUCTION: the scanned matchers (`not.toContain`, `not.toMatch`,
 * `not.toHaveProperty`) appear ZERO times here. Every negative is either a throw-assertion with a
 * positive control in the same test or a `.toBe(false)` membership read.
 *
 * ⛔ THE TEST IMPORTS THE LANDED LEGALITY PREDICATE; THE LEAF DOES NOT. `solidLegality.js` is a
 * tracked target of the stage-manifest walker's frozen `FOUNDATION_READERS` roster over the fabric
 * DIRECTORY, and tests live outside that denominator — so the consumer seam is proved here at zero
 * cost to another member's reserved file.
 */

import { describe, expect, test } from 'vitest';

import {
  COMPONENT_SLOT_ROLES, MATERIAL_ABSENCE_REASONS, SUPPORT_SURFACE_KINDS,
  assertSupportAcyclicity, componentSlot, componentSlotRoster, supportSurfaceRef,
} from '../../src/domain/townMap/fabric/supportSurface.js';
import { MASSING_UNKNOWN_REASONS, solidPartQ } from '../../src/domain/townMap/fabric/massPart.js';
import { solidOverlap } from '../../src/domain/townMap/fabric/solidLegality.js';

/** A minimal lawful input per kind — the table the totality arm walks. */
const MINIMAL_INPUT = Object.freeze({
  WORLD_DATUM: Object.freeze({ kind: 'WORLD_DATUM', datumId: 'd0' }),
  TERRAIN_FACE: Object.freeze({ kind: 'TERRAIN_FACE', patchId: 'p1' }),
  FLOOR_PLANE: Object.freeze({
    kind: 'FLOOR_PLANE', ownerBodyId: 'b1', ownerPartId: 'r1', patchId: 'f0',
  }),
  ROOF_FACE: Object.freeze({
    kind: 'ROOF_FACE', ownerBodyId: 'b1', ownerPartId: 'r1', patchId: 'rf',
  }),
  WALL_TOP: Object.freeze({
    kind: 'WALL_TOP', ownerBodyId: 'b1', ownerPartId: 'w9', patchId: 'cap',
  }),
  LAND_CAP: Object.freeze({
    kind: 'LAND_CAP', ownerBodyId: 'b1', ownerPartId: 'k1', patchId: 'lc',
  }),
});

/** The square footprint every consumer-seam solid shares, so only support and interval vary. */
const RING = Object.freeze([[0, 0], [10000, 0], [10000, 10000], [0, 10000]]);

/**
 * The message a refusal throws. ⛔ A call that RETURNS is itself the failure, said in those words:
 * a helper that quietly answered `null` here would red the caller as a matcher type error rather
 * than as the behaviour it is actually pinning, which is how a deleted refusal gets misdiagnosed.
 */
const refusalMessageOf = (/** @type {() => unknown} */ call) => {
  try {
    call();
  } catch (error) {
    return String(/** @type {Error} */ (error).message);
  }
  throw new Error('expected this roster to be REFUSED, but assertSupportAcyclicity returned');
};

describe('MF-T2K · SPEC §10.5 / §6.4.1 — support-relative solids and component slots', () => {
  test('A1 guard-the-guard: three closed vocabularies are populated and frozen, the imported unknown-reason list is pinned here too, the kind table is TOTAL, and every constructible kind replays identically', () => {
    // ⭐ THE FAMILY'S OPENING ARM. Every membership refusal below is a test against a vocabulary;
    // if one silently emptied, those refusals would pass on nothing. The floors come FIRST.
    expect(SUPPORT_SURFACE_KINDS.length).toBe(7);
    expect(COMPONENT_SLOT_ROLES.length).toBe(9);
    expect(MATERIAL_ABSENCE_REASONS.length).toBe(4);
    expect(Object.isFrozen(SUPPORT_SURFACE_KINDS)).toBe(true);
    expect(Object.isFrozen(COMPONENT_SLOT_ROLES)).toBe(true);
    expect(Object.isFrozen(MATERIAL_ABSENCE_REASONS)).toBe(true);
    expect([...SUPPORT_SURFACE_KINDS]).toEqual(['WORLD_DATUM', 'TERRAIN_FACE', 'FLOOR_PLANE',
      'ROOF_FACE', 'WALL_TOP', 'LAND_CAP', 'MAINTAINED_FREE_SPACE']);
    expect([...COMPONENT_SLOT_ROLES]).toEqual(['BASE', 'LOADBEARING', 'FRAME', 'INFILL',
      'CLADDING', 'FLOOR', 'ROOF_STRUCTURE', 'ROOF_COVERING', 'REPAIR']);
    expect([...MATERIAL_ABSENCE_REASONS]).toEqual(['NOT_APPLICABLE', 'OPEN_STRUCTURE', 'UNCLAD',
      'UNCOVERED_BY_DESIGN']);
    // ⭐ THE IMPORTED VOCABULARY IS PINNED HERE TOO, so a drift in massPart.js reds THIS battery:
    // the leaf imports MASSING_UNKNOWN_REASONS rather than re-declaring it, and one vocabulary is
    // only safe while both ends agree about its contents.
    expect([...MASSING_UNKNOWN_REASONS]).toEqual(['NOT_OBSERVED', 'OUTSIDE_COVERAGE',
      'CONFLICTING_EVIDENCE', 'WITHHELD']);

    // ── THE KIND TABLE IS TOTAL, PROVED BEFORE ANY KEY IS TRUSTED ───────────────────────────
    // Every kind in the closed vocabulary either derives a key or refuses as the named blocked
    // kind. A missing table row would make one kind admitted by membership and unspellable here.
    for (const kind of SUPPORT_SURFACE_KINDS) {
      if (kind === 'MAINTAINED_FREE_SPACE') {
        expect(() => supportSurfaceRef({ kind })).toThrow(/§299\.3c/);
        continue;
      }
      const ref = supportSurfaceRef(MINIMAL_INPUT[kind]);
      expect(ref.kind).toBe(kind);
      expect(ref.surfaceId.startsWith('support:')).toBe(true);
      expect(Object.isFrozen(ref)).toBe(true);
      // determinism: the same input replays to a JSON-identical record
      expect(JSON.stringify(supportSurfaceRef(MINIMAL_INPUT[kind]))).toBe(JSON.stringify(ref));
    }
  });

  test('A2 the key is DERIVED, owner-qualified and injective: documented spellings, the landed wall admits it, a caller-supplied surfaceId is refused, and the engineered near-collision pair is unconstructible', () => {
    const terrain = supportSurfaceRef({ kind: 'TERRAIN_FACE', patchId: 'p1' });
    const wall = supportSurfaceRef(MINIMAL_INPUT.WALL_TOP);
    expect(terrain.surfaceId).toBe('support:terrain-face:p1');
    expect(wall.surfaceId).toBe('support:wall-top:b1:w9:cap');
    expect(supportSurfaceRef({ kind: 'WORLD_DATUM', datumId: 'd0' }).surfaceId)
      .toBe('support:world-datum:d0');
    // distinct refs give distinct keys — the whole point of owner qualification
    expect(supportSurfaceRef(MINIMAL_INPUT.ROOF_FACE).surfaceId)
      .toBe('support:roof-face:b1:r1:rf');
    expect(supportSurfaceRef(MINIMAL_INPUT.FLOOR_PLANE).surfaceId === wall.surfaceId).toBe(false);

    // ⭐ THE UPWARD-COMPATIBILITY PROOF: the derived key passes the LANDED id wall, executed
    // through MF-T2E's own constructor rather than by re-spelling its regex here.
    const solid = solidPartQ({
      partId: 'a1',
      supportSurfaceId: terrain.surfaceId,
      footprint: RING,
      vertical: { kind: 'INTERVAL', baseQ: 0, topQ: 5000 },
    });
    expect(solid.supportSurfaceId).toBe('support:terrain-face:p1');

    // the free-alias door, refused
    expect(() => supportSurfaceRef({ kind: 'TERRAIN_FACE', patchId: 'p1', surfaceId: 'anything' }))
      .toThrow(/DERIVED and may not be supplied/);

    // ⛔ THE ENGINEERED NEAR-COLLISION PAIR (the MF-T2Bf lesson carried as a pin, not a memory).
    // These two DISTINCT refs would join to the ONE key `support:wall-top:a:b:c:d` if `:` were
    // admitted in a segment. Both are refused, each naming the reservation, so the collision is
    // unconstructible rather than merely unlikely. The positive control sits below them.
    const collideLeft = { kind: 'WALL_TOP', ownerBodyId: 'a', ownerPartId: 'b:c', patchId: 'd' };
    const collideRight = { kind: 'WALL_TOP', ownerBodyId: 'a:b', ownerPartId: 'c', patchId: 'd' };
    expect(() => supportSurfaceRef(collideLeft)).toThrow(/RESERVED as the support-key separator/);
    expect(() => supportSurfaceRef(collideRight)).toThrow(/RESERVED as the support-key separator/);
    expect(supportSurfaceRef({ kind: 'WALL_TOP', ownerBodyId: 'a', ownerPartId: 'b', patchId: 'd' })
      .surfaceId).toBe('support:wall-top:a:b:d');
  });

  test('A3 the refusals, each attributable to the one field it changes, with the unmodified fixture constructing first', () => {
    // POSITIVE CONTROL FIRST: the fixture every refusal below mutates is lawful as it stands.
    expect(supportSurfaceRef(MINIMAL_INPUT.WALL_TOP).surfaceId).toBe('support:wall-top:b1:w9:cap');

    expect(() => supportSurfaceRef({ kind: 'CEILING_PLANE', patchId: 'p1' }))
      .toThrow(/supportSurfaceRef\.kind must be one of/);
    expect(() => supportSurfaceRef({ kind: 'MAINTAINED_FREE_SPACE' }))
      .toThrow(/pre-existing support-OPERATION ref/);
    expect(() => supportSurfaceRef({ kind: 'TERRAIN_FACE' }))
      .toThrow(/supportSurfaceRef\.patchId must be a key segment/);
    expect(() => supportSurfaceRef({ kind: 'WALL_TOP', ownerBodyId: 'b1', patchId: 'cap' }))
      .toThrow(/supportSurfaceRef\.ownerPartId must be a key segment/);
    expect(() => supportSurfaceRef({ ...MINIMAL_INPUT.WALL_TOP, ownerPartId: 'W9' }))
      .toThrow(/supportSurfaceRef\.ownerPartId must be a key segment/);
    // an over-long derivation is refused BY THE LANDED WALL, typed — never truncated, because a
    // truncation would re-open exactly the aliasing the derivation exists to close
    expect(() => supportSurfaceRef({
      kind: 'WALL_TOP', ownerBodyId: 'b'.repeat(32), ownerPartId: 'w'.repeat(32), patchId: 'c'.repeat(32),
    })).toThrow(/derived surfaceId must be a canonical id/);
    expect(() => supportSurfaceRef('support:terrain-face:p1')).toThrow(/must be an object/);
    expect(() => supportSurfaceRef({ ...MINIMAL_INPUT.TERRAIN_FACE, localDatumCache: 3 }))
      .toThrow(/localDatumCache is not a field of TERRAIN_FACE/);
  });

  test('A4 the acyclicity law: the lawful identity arm first, then duplicate, unresolved, self-support and two-part cycles each refused by name and by DIFFERENT messages', () => {
    // ⭐ THE IDENTITY ARM, FIRST (the §416.1 lesson for graphs: a check that detects only
    // structure must be shown passing lawful structure before any refusal is trusted).
    const datum = supportSurfaceRef({ kind: 'WORLD_DATUM', datumId: 'd0' });
    const terrain = supportSurfaceRef({ kind: 'TERRAIN_FACE', patchId: 'p1' });
    const rooted = assertSupportAcyclicity([
      { partId: 'q1', support: terrain }, { partId: 'a1', support: datum },
      { partId: 'z9', support: terrain },
    ]);
    expect([...rooted.orderedPartIds]).toEqual(['a1', 'q1', 'z9']);
    expect(Object.isFrozen(rooted)).toBe(true);
    // …and the order is INPUT-INDEPENDENT: the same roster in another array order answers the same
    expect([...assertSupportAcyclicity([
      { partId: 'z9', support: terrain }, { partId: 'q1', support: terrain },
      { partId: 'a1', support: datum },
    ]).orderedPartIds]).toEqual(['a1', 'q1', 'z9']);

    // a three-deep chain: terrain -> wall -> the part standing on that wall's top
    const onA1 = supportSurfaceRef({
      kind: 'WALL_TOP', ownerBodyId: 'b1', ownerPartId: 'a1', patchId: 'cap',
    });
    const onM2 = supportSurfaceRef({
      kind: 'ROOF_FACE', ownerBodyId: 'b1', ownerPartId: 'm2', patchId: 'rf',
    });
    expect([...assertSupportAcyclicity([
      { partId: 'm2', support: onA1 }, { partId: 't3', support: onM2 },
      { partId: 'a1', support: terrain },
    ]).orderedPartIds]).toEqual(['a1', 'm2', 't3']);

    expect(() => assertSupportAcyclicity([
      { partId: 'a1', support: terrain }, { partId: 'a1', support: datum },
    ])).toThrow(/repeats partId "a1"/);
    const unresolved = refusalMessageOf(() => assertSupportAcyclicity([
      { partId: 'm2', support: onA1 },
    ]));
    expect(unresolved).toMatch(/"m2" rests on "a1", which does not resolve in the roster/);
    // self-support is the length-1 case of the same walk, and the message names the part
    const selfSupport = refusalMessageOf(() => assertSupportAcyclicity([
      { partId: 'a1', support: supportSurfaceRef({
        kind: 'WALL_TOP', ownerBodyId: 'b1', ownerPartId: 'a1', patchId: 'cap',
      }) },
    ]));
    expect(selfSupport).toMatch(/support cycle through a1:/);
    const twoPart = refusalMessageOf(() => assertSupportAcyclicity([
      { partId: 'a1', support: onM2 }, { partId: 'm2', support: onA1 },
    ]));
    expect(twoPart).toMatch(/support cycle through a1, m2:/);
    // ⛔ THE TWO ARMS ARE PROVED NON-COVERING: an unresolved owner and a cycle produce DIFFERENT
    // messages, so neither refusal can stand in for the other when one is deleted.
    expect(unresolved === twoPart).toBe(false);
  });

  test('A5 component slots are a TOTAL axis with the no-inference law structural in both directions, and the roster is nonempty and uniquely keyed', () => {
    const present = componentSlot({
      slotId: 's1', role: 'LOADBEARING', status: 'PRESENT', materialId: 'oak',
    });
    expect(present).toEqual({
      slotId: 's1', role: 'LOADBEARING', status: 'PRESENT', materialId: 'oak',
    });
    expect(Object.isFrozen(present)).toBe(true);
    expect('reason' in present).toBe(false);
    const none = componentSlot({
      slotId: 's2', role: 'CLADDING', status: 'NONE', reason: 'UNCLAD',
    });
    expect(none).toEqual({ slotId: 's2', role: 'CLADDING', status: 'NONE', reason: 'UNCLAD' });
    expect('materialId' in none).toBe(false);
    const unknown = componentSlot({
      slotId: 's3', role: 'ROOF_COVERING', status: 'UNKNOWN', reason: 'NOT_OBSERVED',
    });
    expect(unknown.status).toBe('UNKNOWN');
    expect(Object.isFrozen(unknown)).toBe(true);

    // a fourth status is REFUSED, never defaulted — a total axis with a silent fallback is not total
    expect(() => componentSlot({ slotId: 's4', role: 'FRAME', status: 'PARTIAL' }))
      .toThrow(/status must be exactly 'PRESENT', 'NONE' or 'UNKNOWN'/);
    expect(() => componentSlot({
      slotId: 's5', role: 'FRAME', status: 'NONE', reason: 'UNCLAD', materialId: 'oak',
    })).toThrow(/componentSlot NONE must carry no materialId/);
    expect(() => componentSlot({
      slotId: 's6', role: 'FRAME', status: 'UNKNOWN', reason: 'WITHHELD', materialId: 'oak',
    })).toThrow(/componentSlot UNKNOWN must carry no materialId/);
    expect(() => componentSlot({
      slotId: 's7', role: 'FRAME', status: 'PRESENT', materialId: 'oak', reason: 'UNCLAD',
    })).toThrow(/componentSlot PRESENT must carry no reason/);
    // …and each status validates against the RIGHT closed list: the two vocabularies do not mix
    expect(() => componentSlot({
      slotId: 's8', role: 'FRAME', status: 'UNKNOWN', reason: 'UNCLAD',
    })).toThrow(/componentSlot UNKNOWN\.reason must be one of/);
    expect(() => componentSlot({
      slotId: 's9', role: 'FRAME', status: 'NONE', reason: 'WITHHELD',
    })).toThrow(/componentSlot NONE\.reason must be one of/);
    expect(() => componentSlot({ slotId: 's10', role: 'BUTTRESS', status: 'PRESENT', materialId: 'oak' }))
      .toThrow(/componentSlot\.role must be one of/);

    const roster = componentSlotRoster({
      ownerPartId: 'a1',
      slots: [
        { slotId: 's1', role: 'ROOF_STRUCTURE', status: 'PRESENT', materialId: 'oak' },
        { slotId: 's2', role: 'ROOF_COVERING', status: 'NONE', reason: 'UNCOVERED_BY_DESIGN' },
      ],
    });
    // role uniqueness is deliberately NOT required, but slotId uniqueness is
    expect(roster.ownerPartId).toBe('a1');
    expect(roster.slots.length).toBe(2);
    expect(Object.isFrozen(roster.slots[0])).toBe(true);
    expect(() => componentSlotRoster({ ownerPartId: 'a1', slots: [] }))
      .toThrow(/must be a nonempty array of slot inputs/);
    expect(() => componentSlotRoster({
      ownerPartId: 'a1',
      slots: [
        { slotId: 's1', role: 'FRAME', status: 'PRESENT', materialId: 'oak' },
        { slotId: 's1', role: 'INFILL', status: 'PRESENT', materialId: 'wattle' },
      ],
    })).toThrow(/repeats slotId "s1"/);
  });

  test('A6 the consumer seam F -> K: the landed solidOverlap answers over solids keyed by THIS member, and the cross-support refusal stays a refusal', () => {
    const terrain = supportSurfaceRef({ kind: 'TERRAIN_FACE', patchId: 'p1' });
    const wall = supportSurfaceRef(MINIMAL_INPUT.WALL_TOP);
    const solid = (/** @type {string} */ partId, /** @type {string} */ support,
      /** @type {number} */ baseQ, /** @type {number} */ topQ) => solidPartQ({
      partId, supportSurfaceId: support, footprint: RING, vertical: { kind: 'INTERVAL', baseQ, topQ },
    });
    const a1 = solid('a1', terrain.surfaceId, 0, 5000);

    const overlapping = solidOverlap(a1, solid('b2', terrain.surfaceId, 0, 5000));
    expect(overlapping.kind).toBe('VOLUME');
    expect(overlapping.verdict).toBe('OVERLAPPING');
    expect(overlapping.sharedVolumeQ).toEqual({ numQ: 500000000000n, denQ: 1n });
    expect(overlapping.sharedHeightQ).toBe(5000n);

    // the half-open law respoken through this member's keys: touching intervals enclose no volume
    const stacked = solidOverlap(a1, solid('c3', terrain.surfaceId, 5000, 9000));
    expect(stacked.kind).toBe('VOLUME');
    expect(stacked.sharedVolumeQ).toEqual({ numQ: 0n, denQ: 1n });
    expect(stacked.verdict).toBe('DISJOINT_OR_ABUTTING');

    // ⛔ THE REFUSAL STAYS A REFUSAL. The same two footprints on two DERIVED keys are refused, and
    // nothing this member mints licenses the "registered connection" the detail names.
    const refused = solidOverlap(a1, solid('d4', wall.surfaceId, 0, 5000));
    expect(refused.kind).toBe('REFUSED');
    expect(refused.reason).toBe('DIFFERENT_SUPPORT_SURFACE');
    expect(refused.verdict).toBe(null);
    expect(refused.detail).toBe('two solids on different supports need a registered connection'
      + ' before their vertical intervals can be compared (SPEC §10.5); a bridge over a lane is'
      + ' this case');
  });
});
