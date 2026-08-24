/**
 * townCartographyProperty.test.js — MP-1's acceptance matrix for the property JOIN
 * (docs/implementation/packets/town-cartography/MF-MP1.md §9, P1-P5).
 *
 * The subject is the REAL block wherever the real block can reach the case: the
 * corpus rows run the ordinary domain entry point with cartography lit, exactly as
 * TC-5a's matrix does. Synthetic fixtures appear ONLY where the corpus provably
 * cannot reach the case — a parcel with a malformed ring, and a block that is not a
 * record at all, neither of which a validated compile can produce.
 *
 *   P1 THE JOIN       institutionRef ↔ anchorKey, proven against a real manifest so
 *                     the one spelled prefix cannot drift away from its minting site
 *   P2 MEMBERSHIP     a property is the rows sharing its parcelId — one draw, and the
 *                     answer is the SAME object for every member (§495.4e)
 *   P3 THE ABSENT     a building the block has no parcel for answers null, never a
 *                     guessed boundary (§495.5(2), the PARCELS_PER_WARD tier band)
 *   P4 THE OPEN GROUND  ring + holes, and the holes are the members' own footprints
 *   P5 TOTALITY       malformation degrades to an empty index and never throws
 *
 * ⚠ EVERY TEST IS REGISTERED STRAIGHT-LINE. A `test(`/`it(` inside a loop, or a
 * `describe` whose body is not straight-line, PARKS THE WHOLE FILE out of the
 * sovereignty lighting census and takes every other title in it down too. Loops
 * appear only INSIDE bodies, over assertions.
 */
import { describe, expect, it } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { NAMING_DATA } from '../../src/data/namingData.js';
import { compileTownSceneManifest } from '../../src/domain/townScene/index.js';
import {
  CARTOGRAPHY_INSTITUTION_REF_PREFIX,
  buildPropertyLineIndex,
  openGroundOf,
  propertyLineForAnchor,
} from '../../src/domain/townCartography/cartographyProperty.js';
import { V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const LIT_RULES = { simulationRules: { townCartographyEnabled: true } };
const SLOW = 120_000;

/** Compile one corpus row through the ordinary domain entry point, cartography lit. */
function compileRow(index) {
  return compileTownSceneManifest({
    settlement: V2_GOLDEN_CONFIGS[index].settlement,
    mapEdits: V2_GOLDEN_CONFIGS[index].mapEdits ?? null,
    audience: 'dm',
    worldState: LIT_RULES,
  }, { namingPools: NAMING_DATA });
}

/** Every corpus row's lit MANIFEST, compiled once for the whole file. The manifest
 *  rather than the block alone, because P1's join is a claim about BOTH halves. */
const CORPUS = V2_GOLDEN_CONFIGS.map((_, index) => compileRow(index));

/** A minimal well-formed block, for the cases a validated compile cannot produce. */
const blockOf = (parcels = [], buildings = []) => ({
  schemaVersion: 2, wards: [], parcels, buildings,
  streets: { arterials: [], lanes: [], gateRefs: [], bridgeRefs: [] },
});

const RING = [[0, 0], [40, 0], [40, 40], [0, 40]];
const FOOT = [[4, 4], [12, 4], [12, 12], [4, 12]];

describe('MP-1 P1 — the join crosses the semantic-id prefix, and the prefix is live', () => {
  it('every manifest building spells its semanticId as the prefix plus its anchorKey', () => {
    // THE AGREEMENT PIN. cartographyProperty.js spells the prefix ONCE so the 2D pane
    // can cross it; buildingProfiles.js mints it. Nothing else forces the two to
    // agree, so this arm forces it against a REAL compile rather than a fixture that
    // would just mirror whichever spelling was wrong.
    let checked = 0;
    for (const [index, manifest] of CORPUS.entries()) {
      for (const building of manifest.buildings) {
        expect(building.semanticId, `row ${index}`)
          .toBe(`${CARTOGRAPHY_INSTITUTION_REF_PREFIX}${building.anchorKey}`);
        checked += 1;
      }
    }
    // Anti-vacuity: a corpus with no manifest buildings would satisfy the loop above.
    expect(checked).toBeGreaterThan(20);
  }, SLOW);

  it('a cartography institutionRef IS a manifest semanticId, so the join is total', () => {
    // The second half of the same chain: the cartography row copies the manifest's
    // semanticId. Without this arm the prefix could be right and the join still empty.
    let joined = 0;
    for (const [index, manifest] of CORPUS.entries()) {
      const semanticIds = new Set(manifest.buildings.map((row) => row.semanticId));
      for (const row of manifest.cartography.buildings) {
        if (typeof row.institutionRef !== 'string') continue;
        expect(semanticIds.has(row.institutionRef), `row ${index} ${row.institutionRef}`).toBe(true);
        joined += 1;
      }
    }
    expect(joined).toBeGreaterThan(20);
  }, SLOW);

  it('the index answers a REAL anchor key from the pane\'s own vocabulary', () => {
    let answered = 0;
    for (const [index, manifest] of CORPUS.entries()) {
      const propertyIndex = buildPropertyLineIndex(manifest.cartography);
      for (const building of manifest.buildings) {
        const line = propertyLineForAnchor(propertyIndex, building.anchorKey);
        if (!line) continue; // P3's case: no parcel row for this building.
        expect(line.ring.length, `row ${index} ${building.anchorKey}`).toBeGreaterThan(2);
        expect(line.parcelId, `row ${index} ${building.anchorKey}`).not.toBe('');
        answered += 1;
      }
    }
    // Anti-vacuity: an index that answered null for everything would satisfy the
    // loop above trivially, and that is exactly the failure this car exists to avoid.
    expect(answered).toBeGreaterThan(10);
  }, SLOW);
});

describe('MP-1 P2 — a property is the rows that SHARE its parcelId, and it draws once', () => {
  it('every indexed line names exactly the block rows carrying its parcelId', () => {
    let compared = 0;
    for (const [index, manifest] of CORPUS.entries()) {
      const block = manifest.cartography;
      const { byParcelId } = buildPropertyLineIndex(block);
      for (const [parcelId, line] of byParcelId) {
        const expected = block.buildings
          .filter((row) => row.parcelId === parcelId)
          .map((row) => row.id);
        expect(line.memberIds, `row ${index} ${parcelId}`).toEqual(expected);
        compared += 1;
      }
    }
    expect(compared).toBeGreaterThan(10);
  }, SLOW);

  it('EVERY member of a compound resolves to the SAME property object, by identity', () => {
    // The owner's acceptance in §494.3: hovering ANY member highlights the WHOLE
    // property ONCE. Object identity is the strongest available statement of "once":
    // two members answering two equal-but-distinct lines would draw the boundary twice
    // and seam where they touch. Measured over a real compound — a parcel the corpus
    // genuinely packs more than one building onto.
    const withCompound = CORPUS
      .map((manifest) => manifest.cartography)
      .find((block) => {
        const counts = new Map();
        for (const row of block.buildings) counts.set(row.parcelId, (counts.get(row.parcelId) ?? 0) + 1);
        return [...counts.values()].some((count) => count > 1);
      });
    // Anti-vacuity: if the corpus grew no compound this arm would assert nothing.
    expect(withCompound, 'no corpus row packs two buildings onto one parcel').toBeDefined();
    const { byParcelId } = buildPropertyLineIndex(withCompound);
    const shared = [...byParcelId.values()].find((line) => line.memberIds.length > 1);
    expect(shared).toBeDefined();
    for (const memberId of shared.memberIds) {
      const row = withCompound.buildings.find((candidate) => candidate.id === memberId);
      expect(byParcelId.get(row.parcelId)).toBe(shared);
    }
  }, SLOW);
});

describe('MP-1 P3 — a building with no parcel row answers NULL, never a guess', () => {
  it('an anchor key the block never names resolves to null', () => {
    const index = buildPropertyLineIndex(blockOf(
      [{ id: 'parcel:a', wardId: 'ward:a', polygon: RING }],
      [{ id: 'b:1', parcelId: 'parcel:a', footprint: FOOT, institutionRef: 'building:cat:known' }],
    ));
    // The SAME index answers a real key, so the null below is the lookup missing
    // rather than the index being empty.
    expect(propertyLineForAnchor(index, 'cat:known')).not.toBeNull();
    expect(propertyLineForAnchor(index, 'cat:absent')).toBeNull();
    expectAbsentWithAnchor(
      [...index.byAnchorKey.keys()], 'cat:absent', 'cat:known', 'the property anchor index',
    );
  });

  it('a building whose parcelId names no parcel in the block is indexed under nothing', () => {
    // The PARCELS_PER_WARD tier band's ordinary case: only selected candidates enter
    // the block, so a building can legitimately reference a parcel the block omits.
    const index = buildPropertyLineIndex(blockOf(
      [{ id: 'parcel:a', wardId: 'ward:a', polygon: RING }],
      [{ id: 'b:1', parcelId: 'parcel:nowhere', footprint: FOOT, institutionRef: 'building:cat:orphan' }],
    ));
    expect(index.byParcelId.size).toBe(1);
    expect(propertyLineForAnchor(index, 'cat:orphan')).toBeNull();
  });

  it('a parcel whose ring is malformed is DROPPED, so no half-boundary can be drawn', () => {
    const index = buildPropertyLineIndex(blockOf(
      [
        { id: 'parcel:good', wardId: 'ward:a', polygon: RING },
        { id: 'parcel:bad', wardId: 'ward:a', polygon: [[0, 0], [1, 'x'], [2, 2]] },
      ],
      [],
    ));
    // Anchored: the lawful sibling in the SAME block is indexed, so the absence below
    // is the ring being refused rather than the whole layer being skipped.
    expect(index.byParcelId.has('parcel:good')).toBe(true);
    expect(index.byParcelId.has('parcel:bad')).toBe(false);
  });

  it('a null or absent block answers an empty index rather than throwing', () => {
    for (const subject of [null, undefined, 'not a block', 42]) {
      const index = buildPropertyLineIndex(subject);
      expect(index.byParcelId.size).toBe(0);
      expect(index.byAnchorKey.size).toBe(0);
    }
    expect(propertyLineForAnchor(null, 'cat:anything')).toBeNull();
  });
});

describe('MP-1 P4 — the open ground is the ring and its members as HOLES', () => {
  it('the ring is the parcel\'s own and the holes are the members\' own footprints', () => {
    const index = buildPropertyLineIndex(blockOf(
      [{ id: 'parcel:a', wardId: 'ward:a', polygon: RING }],
      [
        { id: 'b:1', parcelId: 'parcel:a', footprint: FOOT },
        { id: 'b:2', parcelId: 'parcel:a', footprint: [[20, 20], [30, 20], [30, 30], [20, 30]] },
      ],
    ));
    const ground = openGroundOf(index.byParcelId.get('parcel:a'));
    expect(ground.ring).toEqual(RING);
    expect(ground.holes).toHaveLength(2);
    expect(ground.holes[0]).toEqual(FOOT);
    // NO POLYGON ALGEBRA HAPPENED. The holes are the footprints verbatim, which is
    // the whole claim: the even-odd fill rule does the subtraction at paint time and
    // this leaf never clips. A boolean-difference implementation would have produced
    // some other ring here and this equality is what forbids one.
    expect(ground.holes[1]).toEqual([[20, 20], [30, 20], [30, 30], [20, 30]]);
  });

  it('a property with no buildings on it is ALL open ground, with no holes', () => {
    const index = buildPropertyLineIndex(blockOf(
      [{ id: 'parcel:a', wardId: 'ward:a', polygon: RING }], [],
    ));
    const ground = openGroundOf(index.byParcelId.get('parcel:a'));
    expect(ground.ring).toEqual(RING);
    expect(ground.holes).toEqual([]);
  });

  it('the returned holes are a COPY, so a caller cannot mutate the index', () => {
    const index = buildPropertyLineIndex(blockOf(
      [{ id: 'parcel:a', wardId: 'ward:a', polygon: RING }],
      [{ id: 'b:1', parcelId: 'parcel:a', footprint: FOOT }],
    ));
    const line = index.byParcelId.get('parcel:a');
    openGroundOf(line).holes.push([[9, 9], [9, 9], [9, 9]]);
    expect(line.memberFootprints).toHaveLength(1);
  });

  it('open ground of nothing is null, not an empty shape', () => {
    expect(openGroundOf(null)).toBeNull();
    expect(openGroundOf(undefined)).toBeNull();
    expect(openGroundOf({ ring: [] })).toBeNull();
  });
});

describe('MP-1 P5 — every real ring is integer, and containment holds by construction', () => {
  it('every indexed ring and hole is an integer plan ring across the whole corpus', () => {
    let vertices = 0;
    for (const [index, manifest] of CORPUS.entries()) {
      const { byParcelId } = buildPropertyLineIndex(manifest.cartography);
      for (const line of byParcelId.values()) {
        for (const ring of [line.ring, ...line.memberFootprints]) {
          for (const point of ring) {
            expect(Number.isInteger(point[0]) && Number.isInteger(point[1]), `row ${index}`).toBe(true);
            vertices += 1;
          }
        }
      }
    }
    expect(vertices).toBeGreaterThan(1_000);
  }, SLOW);

  it('indexing does not mutate the block it was handed', () => {
    const block = blockOf(
      [{ id: 'parcel:a', wardId: 'ward:a', polygon: RING }],
      [{ id: 'b:1', parcelId: 'parcel:a', footprint: FOOT }],
    );
    const before = JSON.stringify(block);
    buildPropertyLineIndex(block);
    expect(JSON.stringify(block)).toBe(before);
  });

  it('two indexes over the same block answer the same thing', () => {
    const block = CORPUS[0].cartography;
    const first = buildPropertyLineIndex(block);
    const second = buildPropertyLineIndex(block);
    expect([...second.byParcelId.keys()]).toEqual([...first.byParcelId.keys()]);
    expect([...second.byAnchorKey.keys()]).toEqual([...first.byAnchorKey.keys()]);
  }, SLOW);
});
