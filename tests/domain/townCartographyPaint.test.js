/**
 * townCartographyPaint.test.js — TC-5a's acceptance matrix for the paint leaf
 * (docs/implementation/packets/town-cartography/TC-5A.md §9, C1-C6 and C8).
 *
 * The subject is the REAL block: every corpus claim runs the ordinary domain entry
 * point with cartography lit and paints `manifest.cartography` exactly as TC-5b will.
 * A hand-made block would prove a triangle is a triangle and nothing about the town,
 * so the synthetic fixtures below appear only where the corpus provably cannot reach
 * the case — the tone CLAMPS, because the twenty golden rows emit just two of the six
 * conditions (`sound` and `damaged`, measured), and neither drives a clamp.
 *
 *   C1 CORPUS        the length IDENTITY, the id binding, and the emission order
 *   C2 ABSENCE       null/undefined/all-empty return a frozen []; malformation throws
 *   C3 VOCABULARY    every map's key set is DERIVED exact-set-both-ways, and the
 *                    accessor THROWS rather than falling to 'default'
 *   C4 NO COLOUR     the contract's OWN regex, over both leaves and every emitted op
 *   C5 DETERMINISM   two builds identical, reversed input identical, purity scanned
 *   C6 GEOMETRY      copied by reference, integer, and no key outside the op shape
 *   C8 TONE          the ladder is monotone, both clamps bite, every tone is in range
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { NAMING_DATA } from '../../src/data/namingData.js';
import {
  compileTownSceneManifest,
  stableSceneStringify,
} from '../../src/domain/townScene/index.js';
import {
  TOWN_CARTOGRAPHY_CONDITIONS,
  TOWN_CARTOGRAPHY_STREET_CLASSES,
  TOWN_CARTOGRAPHY_WARD_KINDS,
} from '../../src/domain/townScene/cartographyContract.js';
import { buildCartographyDrawList } from '../../src/domain/townCartography/cartographyPaint.js';
import {
  CARTOGRAPHY_PAINT_ROLES,
  CONDITION_TONE_SHIFT_PERMILLE,
  STREET_WIDTH_WEIGHT_PERMILLE,
  WARD_ROLE_BY_KIND,
  paintRoleForWardKind,
} from '../../src/domain/townCartography/cartographyPaintRoles.js';
import { V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LIT_RULES = { simulationRules: { townCartographyEnabled: true } };
const PREMISE_PREFIX = 'townCartography TC-3 premise:';
const SLOW = 120_000;

const readSource = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const PAINT_SRC = 'src/domain/townCartography/cartographyPaint.js';
const ROLES_SRC = 'src/domain/townCartography/cartographyPaintRoles.js';

/** Compile one corpus row through the ordinary domain entry point, cartography lit. */
function compileRow(index, audience = 'dm') {
  return compileTownSceneManifest({
    settlement: V2_GOLDEN_CONFIGS[index].settlement,
    mapEdits: V2_GOLDEN_CONFIGS[index].mapEdits ?? null,
    audience,
    worldState: LIT_RULES,
  }, { namingPools: NAMING_DATA });
}

const blockFor = (index, audience = 'dm') => compileRow(index, audience).cartography;

/** Every corpus row's lit block, compiled once for the whole file. */
const CORPUS = V2_GOLDEN_CONFIGS.map((_, index) => blockFor(index));

/** The identity the packet states in place of an op ceiling (§6.2). */
const expectedLength = (block) => block.wards.length + block.streets.arterials.length
  + block.streets.lanes.length + block.buildings.length;

/** A minimal well-formed block, for the cases the corpus provably cannot reach. */
function blockOf({ wards = [], arterials = [], lanes = [], parcels = [], buildings = [] } = {}) {
  return {
    schemaVersion: 2,
    streets: { arterials, lanes, gateRefs: [], bridgeRefs: [] },
    wards,
    parcels,
    buildings,
  };
}

const wardOf = (id, kind, tonePermille) => ({
  id, kind, name: 'Ward', polygon: [[0, 0], [4, 0], [4, 4]], tonePermille,
  districtId: null, lynchElement: 'district',
  provenance: { kind: 'generated', ref: null }, decidedBy: 'state',
});

const parcelOf = (id, wardId) => ({
  id, wardId, polygon: [[0, 0], [2, 0], [2, 2]], anchor: [1, 1],
  provenance: { kind: 'generated', ref: null }, decidedBy: 'state',
});

const buildingOf = (id, parcelId, condition) => ({
  id, parcelId, role: 'dwelling', footprint: [[0, 0], [1, 0], [1, 1]],
  heightPermille: 250, agePermille: 0, condition, styleToken: 'plain.cottage',
  provenance: { kind: 'generated', ref: null }, decidedBy: 'state',
});

/** One ward, one parcel in it, one building on that parcel — the tone chain end to end. */
const toneChain = (tonePermille, condition) => blockOf({
  wards: [wardOf('ward:a', 'civic', tonePermille)],
  parcels: [parcelOf('parcel:a', 'ward:a')],
  buildings: [buildingOf('building:a', 'parcel:a', condition)],
});

/** Every string anywhere inside a value, walked recursively (C4's op half). */
function everyString(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const item of value) everyString(item, out);
  else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      out.push(key);
      everyString(value[key], out);
    }
  }
  return out;
}

/**
 * THE CONTRACT'S OWN COLOUR REGEX, lifted off disk rather than respelled here (§6.3:
 * one regex, one law, no second spelling). It is `const`-not-`export` in the contract
 * and that file is a forbidden edit, so reading the literal is the only way to reuse
 * the exact law without authoring a rival copy that could drift out of agreement.
 */
const RAW_COLOUR_DECL = /^const RAW_COLOUR = \/(.+)\/([a-z]*);$/m
  .exec(readSource('src/domain/townScene/cartographyContract.js'));
const RAW_COLOUR = new RegExp(RAW_COLOUR_DECL[1], RAW_COLOUR_DECL[2]);

/**
 * ⚠ EVERY HELPER BELOW EXISTS SO ITS CALLER CAN BE A STRAIGHT-LINE `it(`. A `for` loop
 * in a describe BODY makes the suite non-straight-line, which unregisters every test
 * under it and PARKS the whole file out of the sovereignty lighting evidence layer —
 * measured here: the first cut of this file scored 0 live titles against its 34 tests,
 * the only parked file among the nine domain/townCartography suites. Loops inside an
 * `it(` body are fine; loops AROUND one are not.
 */

/** C2: absence must return a FROZEN empty array — never null, never a throw. */
function expectFrozenEmptyList(subject) {
  const ops = buildCartographyDrawList(subject);
  expect(Array.isArray(ops)).toBe(true);
  expect(ops).toHaveLength(0);
  expect(Object.isFrozen(ops)).toBe(true);
}

/** C3: a map's key set IS its frozen vocabulary, checked in both directions. */
function expectExactSetBothWays(map, vocabulary, label) {
  const keys = Object.keys(map).sort();
  expect(keys, label).toEqual([...vocabulary].sort());
  expect(keys.length, label).toBe(vocabulary.length);
  expect(vocabulary.length, `${label} vocabulary is empty`).toBeGreaterThan(1);
}

/** C4: one leaf's whole source text carries no colour and no design-layer import. */
function expectColourFreeSource(rel) {
  const source = readSource(rel);
  expect(source.length, rel).toBeGreaterThan(500);
  // anchored: RAW_COLOUR is proven live against a spliced colour control in C4's first case
  expect(source, rel).not.toMatch(RAW_COLOUR);
  for (const forbidden of ['design/tokens.js', 'townMapStyles.js', 'townMapExportPalette.js']) {
    // anchored: the subject is this file's whole text, proven non-empty by the pin above
    expect(source, rel).not.toContain(forbidden);
  }
}

/** C5: one leaf draws no entropy, reads no clock, and carries no unbounded loop. */
function expectPureSource(rel) {
  const code = readSource(rel)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  // The liveness anchor: the leaf's own export must be present, or every absence
  // below would hold just as well of an emptied or renamed file.
  expect(code, rel).toMatch(/^export function /m);
  for (const [label, pattern] of [
    ['createPRNG', /\bcreatePRNG\b/],
    ['.fork(', /\.fork\s*\(/],
    ['while', /\bwhile\s*\(/],
    ['do {', /\bdo\s*\{/],
    ['new Date', /\bnew\s+Date\b/],
    ['Date.now', /\bDate\s*\.\s*now\b/],
    ['Math.random', /Math\s*\.\s*random\s*\(/],
  ]) {
    expect(pattern.test(code), `${rel} must not spell ${label}`).toBe(false);
  }
}

describe('TC-5a C1 — a real lit compile paints an identity-length, ordered draw list', () => {
  it('the corpus is lit and non-empty (every claim below has a subject)', () => {
    expect(CORPUS).toHaveLength(20);
    for (const block of CORPUS) expect(block).not.toBeNull();
    expect(CORPUS.every((block) => block.wards.length > 0)).toBe(true);
  }, SLOW);

  it('the length is EXACTLY the identity over the block\'s own record counts', () => {
    let painted = 0;
    for (const [index, block] of CORPUS.entries()) {
      const ops = buildCartographyDrawList(block);
      expect(ops.length, `corpus row ${index}`).toBe(expectedLength(block));
      painted += ops.length;
    }
    // Anti-vacuity: an identity between two zeros would satisfy the loop above.
    expect(painted).toBeGreaterThan(1_000);
  }, SLOW);

  it('every op id names a record that is actually in the block', () => {
    for (const [index, block] of CORPUS.entries()) {
      const known = new Set([
        ...block.wards.map((row) => row.id),
        ...block.streets.arterials.map((row) => row.id),
        ...block.streets.lanes.map((row) => row.id),
        ...block.buildings.map((row) => row.id),
      ]);
      const painted = buildCartographyDrawList(block).map((op) => op.id);
      expect(painted.filter((id) => !known.has(id)), `corpus row ${index}`).toEqual([]);
      // The op list is a BIJECTION onto the drawn records, not merely a subset:
      // a painter that emitted one record four times would pass the filter above.
      expect(new Set(painted).size, `corpus row ${index}`).toBe(painted.length);
    }
  }, SLOW);

  it('ward ops precede street ops precede building ops, ids ascending within each group', () => {
    for (const [index, block] of CORPUS.entries()) {
      const ops = buildCartographyDrawList(block);
      const groups = ops.map((op) => op.op);
      const rank = { ward: 0, street: 1, building: 2 };
      const ranks = groups.map((name) => rank[name]);
      expect(ranks.every((value, at) => at === 0 || ranks[at - 1] <= value), `row ${index}`)
        .toBe(true);
      // Arterials before lanes INSIDE the street group, which id order alone would
      // not force — it holds here only because the painter emits the layers in turn.
      const classes = ops.filter((op) => op.op === 'street').map((op) => op.classKind);
      expect(classes.indexOf('lane') === -1
        || classes.lastIndexOf('arterial') < classes.indexOf('lane'), `row ${index}`).toBe(true);
      for (const run of [
        ops.filter((op) => op.op === 'ward'),
        ops.filter((op) => op.op === 'street' && op.classKind === 'arterial'),
        ops.filter((op) => op.op === 'street' && op.classKind === 'lane'),
        ops.filter((op) => op.op === 'building'),
      ]) {
        const ids = run.map((op) => op.id);
        expect(ids.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)), `row ${index}`)
          .toEqual(ids);
      }
    }
  }, SLOW);
});

describe('TC-5a C2 — absence returns a frozen empty list; malformation throws', () => {
  it('a null block returns a frozen empty array rather than null or a throw', () => {
    expectFrozenEmptyList(null);
  });

  it('an undefined block returns a frozen empty array rather than null or a throw', () => {
    expectFrozenEmptyList(undefined);
  });

  it('a block whose four layers are all empty returns a frozen empty array', () => {
    const ops = buildCartographyDrawList(blockOf());
    expect(ops).toHaveLength(0);
    expect(Object.isFrozen(ops)).toBe(true);
  });

  it('a non-array layer throws the shared premise error', () => {
    const broken = { ...blockOf(), wards: 'not an array' };
    expect(() => buildCartographyDrawList(broken)).toThrow(PREMISE_PREFIX);
  });

  it('a building missing `condition` throws the shared premise error', () => {
    const block = toneChain(500, 'sound');
    const stripped = { ...block.buildings[0] };
    delete stripped.condition;
    // The SAME block paints cleanly with the key present, so the throw below is
    // attributable to the missing key rather than to anything else in the fixture.
    // Two ops, not three: the parcel is READ for its ward reference and DRAWN never
    // (§11 D-6), so this length is also the standing pin on parcels painting nothing.
    expect(buildCartographyDrawList(block)).toHaveLength(2);
    expect(() => buildCartographyDrawList({ ...block, buildings: [stripped] }))
      .toThrow(PREMISE_PREFIX);
  });

  it('a building whose parcel is not in the block throws rather than painting a guess', () => {
    const block = toneChain(500, 'sound');
    const orphan = { ...block.buildings[0], parcelId: 'parcel:nowhere' };
    expect(() => buildCartographyDrawList({ ...block, buildings: [orphan] }))
      .toThrow(PREMISE_PREFIX);
  });

  it('a building whose parcel names a ward outside the block throws rather than painting a guess', () => {
    // THE SIBLING ARM, ordered by the chair's R8 ruling. The case above breaks the
    // building→parcel hop; this one lets that hop RESOLVE and breaks the parcel→ward
    // hop instead, which is the only way to reach cartographyPaint.js's second
    // referential throw. The corpus cannot drive it — all twenty lit rows measure
    // referentially total — and `parcelOf` is called with a ward the fixture supplies
    // at every other site in this file, so without this case the arm is driven by
    // nothing and its vacuity is invisible.
    const dangling = blockOf({
      wards: [wardOf('ward:a', 'civic', 500)],
      parcels: [parcelOf('parcel:a', 'ward:nowhere')],
      buildings: [buildingOf('building:a', 'parcel:a', 'sound')],
    });
    // The SAME fixture with the parcel pointed back at the real ward paints cleanly
    // (two ops — the parcel itself draws nothing), so the throw below is attributable
    // to the dangling wardId rather than to anything else in the block.
    expect(buildCartographyDrawList(toneChain(500, 'sound'))).toHaveLength(2);
    expect(() => buildCartographyDrawList(dangling)).toThrow(PREMISE_PREFIX);
    // …and it is THIS arm, not the parcel-orphan one above: the two throws are
    // distinguishable only by their message, so pin the ward clause. A regression
    // that collapsed both arms into one error would pass the prefix assertion alone.
    expect(() => buildCartographyDrawList(dangling))
      .toThrow(/whose ward 'ward:nowhere' is not in this block/);
    // The parcel-orphan arm reports the OTHER message on the other fixture, so the
    // clause above is discriminating rather than merely present in every premise error.
    const parcelOrphan = { ...dangling, buildings: [{ ...dangling.buildings[0], parcelId: 'parcel:nowhere' }] };
    expect(() => buildCartographyDrawList(parcelOrphan))
      .toThrow(/which no parcel in this block declares/);
  });
});

describe('TC-5a C3 — every vocabulary map DERIVES its key set from the frozen contract', () => {
  it('WARD_ROLE_BY_KIND is exact-set-both-ways against the frozen ward kinds', () => {
    expectExactSetBothWays(WARD_ROLE_BY_KIND, TOWN_CARTOGRAPHY_WARD_KINDS, 'WARD_ROLE_BY_KIND');
  });

  it('CONDITION_TONE_SHIFT_PERMILLE is exact-set-both-ways against the frozen ladder', () => {
    expectExactSetBothWays(
      CONDITION_TONE_SHIFT_PERMILLE, TOWN_CARTOGRAPHY_CONDITIONS, 'CONDITION_TONE_SHIFT_PERMILLE',
    );
  });

  it('STREET_WIDTH_WEIGHT_PERMILLE is exact-set-both-ways against the frozen classes', () => {
    expectExactSetBothWays(
      STREET_WIDTH_WEIGHT_PERMILLE, TOWN_CARTOGRAPHY_STREET_CLASSES, 'STREET_WIDTH_WEIGHT_PERMILLE',
    );
  });

  it('every ward role is a member of the closed paint-role vocabulary', () => {
    const roles = Object.values(WARD_ROLE_BY_KIND);
    expect(roles.filter((role) => !CARTOGRAPHY_PAINT_ROLES.includes(role))).toEqual([]);
    expect(roles).toHaveLength(TOWN_CARTOGRAPHY_WARD_KINDS.length);
  });

  it('THE NEGATIVE CONTROL — an unknown ward kind THROWS; it does not fall to default', () => {
    // The whole point of the accessor. A silent 'default' would paint an unmapped
    // vocabulary member plausibly, and no assertion anywhere could see it happen.
    expect(() => paintRoleForWardKind('not_a_kind')).toThrow(PREMISE_PREFIX);
    expect(() => paintRoleForWardKind(undefined)).toThrow(PREMISE_PREFIX);
    // …and the same call over a REAL member returns, so the throw above is the
    // accessor rejecting an unknown key rather than the accessor being broken.
    expect(paintRoleForWardKind('civic')).toBe('civic');
    expectAbsentWithAnchor(
      Object.keys(WARD_ROLE_BY_KIND), 'not_a_kind', 'civic', 'the derived ward-role key set',
    );
  });

  it('the contract vocabularies are the ones the map was built from, not a copy', () => {
    // A map built from a stale hand-copied list would still be exact-set-both-ways
    // against THAT list. Pin the contract's own membership so a vocabulary change
    // reds here rather than agreeing with itself.
    expect(TOWN_CARTOGRAPHY_WARD_KINDS).toContain('foreign');
    expect(TOWN_CARTOGRAPHY_WARD_KINDS).toContain('other');
    expect(WARD_ROLE_BY_KIND.foreign).toBe('default');
    expect(WARD_ROLE_BY_KIND.other).toBe('default');
  });
});

describe('TC-5a C4 — no colour, structurally, by the contract\'s OWN regex', () => {
  it('the regex was lifted from the live contract and it actually matches colour', () => {
    // THE LIVENESS ANCHOR for both source exclusions below: the law is read off disk,
    // and a spliced control proves it still recognises colour when colour is present.
    expect(RAW_COLOUR_DECL).not.toBeNull();
    expect(RAW_COLOUR.test('#ff8800')).toBe(true);
    expect(RAW_COLOUR.test('rgba(1, 2, 3, 0.5)')).toBe(true);
    expect(RAW_COLOUR.test('tonePermille')).toBe(false);
  });

  it('cartographyPaint.js carries no colour literal and no design-layer import', () => {
    expectColourFreeSource(PAINT_SRC);
  });

  it('cartographyPaintRoles.js carries no colour literal and no design-layer import', () => {
    expectColourFreeSource(ROLES_SRC);
  });

  it('no emitted op carries a colour anywhere in it, across the whole corpus', () => {
    let inspected = 0;
    for (const [index, block] of CORPUS.entries()) {
      const strings = everyString([...buildCartographyDrawList(block)]);
      inspected += strings.length;
      expect(strings.filter((text) => RAW_COLOUR.test(text)), `corpus row ${index}`).toEqual([]);
    }
    // Anti-vacuity: an empty walk would satisfy the filter above trivially.
    expect(inspected).toBeGreaterThan(10_000);
    // …and the walker DOES find colour when colour is there, so the empty result
    // above is a measurement rather than a broken traversal.
    expect(everyString({ a: [{ b: '#abcdef' }] }).filter((t) => RAW_COLOUR.test(t)))
      .toEqual(['#abcdef']);
  }, SLOW);
});

describe('TC-5a C5 — determinism and purity', () => {
  it('two builds over the same block are stableSceneStringify-identical', () => {
    for (const [index, block] of CORPUS.entries()) {
      const first = stableSceneStringify([...buildCartographyDrawList(block)]);
      const second = stableSceneStringify([...buildCartographyDrawList(block)]);
      expect(second, `corpus row ${index}`).toBe(first);
      expect(first.length, `corpus row ${index}`).toBeGreaterThan(100);
    }
  }, SLOW);

  it('a block whose layer arrays are REVERSED paints byte-identically', () => {
    // Emission order must ride the DATA, never the array order the compiler handed
    // over. This is the assertion a `.sort()` removal would red.
    for (const [index, block] of CORPUS.entries()) {
      const forward = stableSceneStringify([...buildCartographyDrawList(block)]);
      const reversed = stableSceneStringify([...buildCartographyDrawList({
        ...block,
        wards: block.wards.slice().reverse(),
        parcels: block.parcels.slice().reverse(),
        buildings: block.buildings.slice().reverse(),
        streets: {
          ...block.streets,
          arterials: block.streets.arterials.slice().reverse(),
          lanes: block.streets.lanes.slice().reverse(),
        },
      })]);
      expect(reversed, `corpus row ${index}`).toBe(forward);
    }
  }, SLOW);

  it('painting does not mutate the block it was handed', () => {
    const block = CORPUS[0];
    const before = stableSceneStringify(block);
    buildCartographyDrawList(block);
    expect(stableSceneStringify(block)).toBe(before);
    // Ops are frozen SHALLOWLY on purpose: a deep freeze would reach through into
    // the caller's own geometry, which is the mutation this asserts never happens.
    expect(Object.isFrozen(block.wards[0].polygon)).toBe(false);
  }, SLOW);

  it('cartographyPaint.js draws no entropy and reads no clock', () => {
    expectPureSource(PAINT_SRC);
  });

  it('cartographyPaintRoles.js draws no entropy and reads no clock', () => {
    expectPureSource(ROLES_SRC);
  });
});

describe('TC-5a C6 — geometry is copied, never derived', () => {
  const OP_KEYS = {
    ward: ['id', 'op', 'polygon', 'role', 'tonePermille'],
    street: ['classKind', 'id', 'op', 'polyline', 'role', 'weightPermille', 'widthPlan'],
    building: ['condition', 'id', 'op', 'polygon', 'role', 'tonePermille'],
  };

  it('every ward and building op carries the block\'s own geometry BY REFERENCE', () => {
    for (const [index, block] of CORPUS.entries()) {
      const wardById = new Map(block.wards.map((row) => [row.id, row]));
      const buildingById = new Map(block.buildings.map((row) => [row.id, row]));
      let checked = 0;
      for (const op of buildCartographyDrawList(block)) {
        if (op.op === 'ward') {
          expect(op.polygon, `row ${index} ${op.id}`).toBe(wardById.get(op.id).polygon);
          checked += 1;
        } else if (op.op === 'building') {
          expect(op.polygon, `row ${index} ${op.id}`).toBe(buildingById.get(op.id).footprint);
          checked += 1;
        }
      }
      expect(checked, `row ${index}`).toBe(block.wards.length + block.buildings.length);
    }
  }, SLOW);

  it('every painted vertex is an integer plan coordinate', () => {
    let vertices = 0;
    for (const block of CORPUS) {
      for (const op of buildCartographyDrawList(block)) {
        for (const point of (op.polygon ?? op.polyline)) {
          expect(point).toHaveLength(2);
          expect(Number.isInteger(point[0]) && Number.isInteger(point[1])).toBe(true);
          vertices += 1;
        }
      }
    }
    expect(vertices).toBeGreaterThan(10_000);
  }, SLOW);

  it('no op carries a key outside its closed op shape', () => {
    const seen = new Set();
    for (const [index, block] of CORPUS.entries()) {
      for (const op of buildCartographyDrawList(block)) {
        seen.add(op.op);
        expect(Object.keys(op).sort(), `row ${index} ${op.id}`).toEqual(OP_KEYS[op.op]);
        expect(Object.isFrozen(op), `row ${index} ${op.id}`).toBe(true);
      }
    }
    // All three op kinds were actually exercised, so no shape passed unmeasured.
    expect([...seen].sort()).toEqual(['building', 'street', 'ward']);
  }, SLOW);
});

describe('TC-5a C8 — the tone ladder', () => {
  it('the condition shift is monotone NON-INCREASING along the frozen ladder', () => {
    const shifts = TOWN_CARTOGRAPHY_CONDITIONS.map((rung) => CONDITION_TONE_SHIFT_PERMILLE[rung]);
    expect(shifts).toHaveLength(6);
    expect(shifts.every((value, at) => at === 0 || shifts[at - 1] >= value)).toBe(true);
    // Anti-vacuity: a table of six identical values is also non-increasing.
    expect(shifts[0]).toBeGreaterThan(shifts[shifts.length - 1]);
  });

  it('the street weights are positive permille and arterials outweigh lanes', () => {
    expect(STREET_WIDTH_WEIGHT_PERMILLE.arterial).toBe(1000);
    expect(STREET_WIDTH_WEIGHT_PERMILLE.lane).toBe(620);
    expect(STREET_WIDTH_WEIGHT_PERMILLE.arterial)
      .toBeGreaterThan(STREET_WIDTH_WEIGHT_PERMILLE.lane);
  });

  it('a ruined building in a zero-tone ward clamps to 0, not below', () => {
    const ops = buildCartographyDrawList(toneChain(0, 'ruined'));
    const building = ops.find((op) => op.op === 'building');
    expect(CONDITION_TONE_SHIFT_PERMILLE.ruined).toBeLessThan(0);
    expect(building.tonePermille).toBe(0);
  });

  it('a pristine building in a full-tone ward clamps to 1000, not above', () => {
    const ops = buildCartographyDrawList(toneChain(1000, 'pristine'));
    const building = ops.find((op) => op.op === 'building');
    expect(CONDITION_TONE_SHIFT_PERMILLE.pristine).toBeGreaterThan(0);
    expect(building.tonePermille).toBe(1000);
  });

  it('between the clamps the shift is applied exactly, not merely bounded', () => {
    // Without this, both clamp pins above would pass on a painter that ignored the
    // condition entirely and always returned the ward tone.
    const ops = buildCartographyDrawList(toneChain(500, 'burned'));
    const building = ops.find((op) => op.op === 'building');
    expect(building.tonePermille).toBe(500 + CONDITION_TONE_SHIFT_PERMILLE.burned);
    expect(building.tonePermille).not.toBe(500);
  });

  it('every emitted tone across the corpus is an integer in 0..1000', () => {
    let toned = 0;
    for (const [index, block] of CORPUS.entries()) {
      for (const op of buildCartographyDrawList(block)) {
        if (op.op === 'street') continue;
        expect(Number.isInteger(op.tonePermille), `row ${index} ${op.id}`).toBe(true);
        expect(op.tonePermille >= 0 && op.tonePermille <= 1000, `row ${index} ${op.id}`)
          .toBe(true);
        toned += 1;
      }
    }
    expect(toned).toBeGreaterThan(1_000);
  }, SLOW);
});
