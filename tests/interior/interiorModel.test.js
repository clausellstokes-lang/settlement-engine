/**
 * tests/interior/interiorModel.test.js — THE KEYED SCALE model pins (DOOR 3).
 *
 * The NEW additive interior golden family (v1 town goldens untouched) plus the
 * constitutional laws: determinism, the ENVELOPE law (interior ⊆ footprint, entrances
 * shared with the map), the FACET grammar (declared == inferred, kind-default byte-
 * identity, custom-content on-ramp), SEMANTIC FURNISHING (revealed ⇒ evidence room;
 * covert ⇒ concealed chamber, NEVER visible), the EDITS-DELTA law, and PURITY.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  buildInteriorModel, toPublicSafeInterior,
  applyInteriorEdits, ROOM_KINDS, FURNISHING_KINDS, INTERIOR_KINDS,
  SIDE_NORTH, SIDE_EAST, SIDE_SOUTH, SIDE_WEST,
} from '../../src/domain/interior/index.js';
import { makeInteriorSettlement, ROSTER_BY_KIND } from '../fixtures/interiorFixtures.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(join(HERE, 'interiorGolden.json'), 'utf-8'));
const sha = (obj) => createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const KINDS = ['faith', 'security', 'trade', 'craft', 'learning', 'vice', 'civic', 'generic'];

describe('KEYED SCALE — determinism golden family (seed × tier × kind)', () => {
  it('every fixture interior matches its pinned sha256 (byte-identical projection)', () => {
    for (const [key, want] of Object.entries(golden)) {
      const [seed, tier, kind] = key.split('|');
      const s = makeInteriorSettlement(seed, tier);
      const got = sha(buildInteriorModel(s, ROSTER_BY_KIND[kind], {}));
      expect(got, `interior ${key} drifted`).toBe(want);
    }
  });

  it('anti-vacuity — the golden corpus is non-empty and spans all eight kinds', () => {
    expect(Object.keys(golden).length).toBeGreaterThanOrEqual(48);
    for (const k of KINDS) expect(Object.keys(golden).some((g) => g.endsWith(`|${k}`))).toBe(true);
  });

  it('the same (settlement, institution) builds byte-identically twice', () => {
    const s = makeInteriorSettlement('rep', 'city');
    const a = JSON.stringify(buildInteriorModel(s, ROSTER_BY_KIND.trade, {}));
    const b = JSON.stringify(buildInteriorModel(s, ROSTER_BY_KIND.trade, {}));
    expect(a).toBe(b);
  });
});

/** Point ∈ [bounds] (±1 for rounding). */
const inBounds = (b, x, y) => x >= b.x - 1 && x <= b.x + b.w + 1 && y >= b.y - 1 && y <= b.y + b.h + 1;

describe('KEYED SCALE — THE ENVELOPE LAW (interior ⊆ footprint; entrances shared)', () => {
  const s = makeInteriorSettlement('env', 'city', 'prosperous');
  for (const kind of KINDS) {
    it(`${kind}: every wall/room/furnishing lies within the footprint bounds`, () => {
      const m = buildInteriorModel(s, ROSTER_BY_KIND[kind], {});
      const b = m.bounds;
      // bounds ⊆ the 0..1000 view
      expect(b.x >= 0 && b.y >= 0 && b.x + b.w <= 1000 && b.y + b.h <= 1000).toBe(true);
      for (const w of m.walls) {
        expect(inBounds(b, w.x1, w.y1), `wall out of bounds ${JSON.stringify(w)}`).toBe(true);
        expect(inBounds(b, w.x2, w.y2)).toBe(true);
      }
      for (const r of m.rooms) {
        expect(r.x >= b.x - 1 && r.y >= b.y - 1 && r.x + r.w <= b.x + b.w + 1 && r.y + r.h <= b.y + b.h + 1,
          `room ${r.id} out of bounds`).toBe(true);
      }
      for (const f of m.furnishings) {
        expect(f.x >= b.x - 1 && f.y >= b.y - 1 && f.x + f.w <= b.x + b.w + 1 && f.y + f.h <= b.y + b.h + 1,
          `furnishing ${f.id} out of bounds`).toBe(true);
      }
    });

    it(`${kind}: the entrance door sits on the map-facing footprint edge`, () => {
      const m = buildInteriorModel(s, ROSTER_BY_KIND[kind], {});
      const b = m.bounds;
      const ent = m.doors.find((d) => d.kind === 'entrance');
      expect(ent, 'no entrance door').toBeTruthy();
      const side = m.meta.entranceSide;
      const near = (a, t) => Math.abs(a - t) <= 1;
      let onEdge = false;
      if (side === SIDE_NORTH) onEdge = near(ent.y1, b.y) && near(ent.y2, b.y);
      if (side === SIDE_SOUTH) onEdge = near(ent.y1, b.y + b.h) && near(ent.y2, b.y + b.h);
      if (side === SIDE_EAST) onEdge = near(ent.x1, b.x + b.w) && near(ent.x2, b.x + b.w);
      if (side === SIDE_WEST) onEdge = near(ent.x1, b.x) && near(ent.x2, b.x);
      expect(onEdge, `entrance not on side ${side}`).toBe(true);
    });

    it(`${kind}: an EDITED interior stays in the envelope — a max pin cannot leave the room`, () => {
      const m = buildInteriorModel(s, ROSTER_BY_KIND[kind], {});
      const b = m.bounds;
      const roomById = new Map(m.rooms.map((r) => [r.id, r]));
      expect(m.furnishings.length, 'no furnishings to nudge (vacuous)').toBeGreaterThan(0);
      // PIN_BOUND is the whole view, so these are LEGAL pins, not malformed input.
      for (const [dx, dy] of [[1000, 1000], [-1000, -1000], [1000, -1000], [-1000, 1000]]) {
        const entry = { pins: m.furnishings.map((f) => ({ anchor: f.id, dx, dy })) };
        const edited = applyInteriorEdits(m, entry);
        for (const f of edited.furnishings) {
          const r = roomById.get(f.roomId);
          expect(r, `furnishing ${f.id} names an unknown room`).toBeTruthy();
          expect(f.x >= r.x && f.y >= r.y && f.x + f.w <= r.x + r.w && f.y + f.h <= r.y + r.h,
            `${kind}: pin (${dx},${dy}) pushed ${f.id} out of room ${r.id}`).toBe(true);
          expect(f.x >= b.x - 1 && f.y >= b.y - 1 && f.x + f.w <= b.x + b.w + 1 && f.y + f.h <= b.y + b.h + 1,
            `${kind}: pin (${dx},${dy}) pushed ${f.id} outside the building`).toBe(true);
        }
      }
    });
  }
});

describe('KEYED SCALE — THE FACET LAW (declared == inferred; kind-default; custom on-ramp)', () => {
  const s = makeInteriorSettlement('facet', 'town');

  it('a DECLARED nature == the INFERRED nature: byte-identical interior (counterpart criterion)', () => {
    // The Sailor Tavern INFERS vice; declaring vice explicitly must change NOTHING.
    const inferred = { name: 'The Sailor Tavern', catalogId: 'tavern' };
    const declared = { name: 'The Sailor Tavern', catalogId: 'tavern', facets: { institutionNature: 'vice' } };
    const a = JSON.stringify(buildInteriorModel(s, inferred, {}));
    const b = JSON.stringify(buildInteriorModel(s, declared, {}));
    expect(a).toBe(b);
    expect(buildInteriorModel(s, declared, {}).meta.kind).toBe('vice');
  });

  it('an absent/unknown nature falls to the GENERIC kind-default, deterministically', () => {
    const custom = { name: 'Zzyzx Emporium of Wonders', catalogId: 'zzyzx' };
    const m = buildInteriorModel(s, custom, {});
    expect(m.meta.kind).toBe('generic');
    expect(INTERIOR_KINDS).toContain(m.meta.kind);
    // a nature declared OUTSIDE the vocabulary also falls to generic (guarded chokepoint)
    const weird = { name: 'Zzyzx Emporium of Wonders', catalogId: 'zzyzx', facets: { institutionNature: 'eldritch' } };
    expect(buildInteriorModel(s, weird, {}).meta.kind).toBe('generic');
  });

  it('a genre-blind custom institution still gets a real interior (rooms + walls)', () => {
    const custom = { name: 'The Whispering Concern', localUid: 'uid-42' };
    const m = buildInteriorModel(s, custom, {});
    expect(m.rooms.length).toBeGreaterThan(0);
    expect(m.walls.length).toBeGreaterThan(0);
  });

  it('the FUNCTION facet selects a variant room (heals ⇒ infirmary quarters)', () => {
    const plain = { name: 'The Grand Library', catalogId: 'lib' };            // learning, no function
    const healer = { name: 'The Grand Library', catalogId: 'lib', facets: { institutionFunction: 'heals' } };
    const mp = buildInteriorModel(s, plain, {});
    const mh = buildInteriorModel(s, healer, {});
    expect(mh.meta.functionVariant).toBe('heals');
    expect(mh.meta.roomCount).toBeGreaterThan(mp.meta.roomCount);
    expect(mh.rooms.some((r) => r.kind === 'quarters')).toBe(true);
  });
});

describe('KEYED SCALE — THE WALL (bounded, data-only vocabularies)', () => {
  it('every emitted room + furnishing kind is in the fixed vocabulary', () => {
    const s = makeInteriorSettlement('wall', 'city', 'prosperous');
    for (const kind of KINDS) {
      const m = buildInteriorModel(s, ROSTER_BY_KIND[kind], {});
      for (const r of m.rooms) expect(ROOM_KINDS, `room kind ${r.kind}`).toContain(r.kind);
      for (const f of m.furnishings) expect(FURNISHING_KINDS, `furnishing kind ${f.kind}`).toContain(f.kind);
    }
  });
});

describe('KEYED SCALE — SEMANTIC FURNISHING (corruption exposure)', () => {
  const base = makeInteriorSettlement('corrupt', 'city', 'prosperous');
  const guild = { name: 'Merchant Guild Exchange', catalogId: 'merchant_guild' };
  const withImp = (covert) => ({
    ...base,
    institutions: base.institutions.map((i) => (i.catalogId === 'merchant_guild'
      ? { ...i, impairments: [{ type: 'corruption', covert, description: 'x' }] } : i)),
  });

  it('REVEALED corruption furnishes a VISIBLE evidence room', () => {
    const s = withImp(false);
    const inst = s.institutions.find((i) => i.catalogId === 'merchant_guild');
    const m = buildInteriorModel(s, inst, {});
    expect(m.meta.hasEvidenceRoom).toBe(true);
    expect(m.rooms.some((r) => r.kind === 'evidence' && !r.covert)).toBe(true);
  });

  it('COVERT corruption furnishes a DM-only concealed chamber — NEVER visible in public', () => {
    const s = withImp(true);
    const inst = s.institutions.find((i) => i.catalogId === 'merchant_guild');
    const dm = buildInteriorModel(s, inst, {});
    expect(dm.meta.hasConcealed).toBe(true);
    expect(dm.rooms.some((r) => r.kind === 'concealed' && r.covert === true)).toBe(true);

    // fail-closed BUILD: publicSafe never derives the concealed chamber at all.
    const pub = buildInteriorModel(s, inst, { publicSafe: true });
    expect(pub.rooms.some((r) => r.covert)).toBe(false);
    expect(pub.walls.some((w) => w.covert)).toBe(false);
    expect(pub.furnishings.some((f) => f.covert)).toBe(false);
    expect(pub.meta.hasConcealed).toBe(false);

    // defense-in-depth SCRUB: stripping a DM model == building publicSafe (path-independent).
    expect(JSON.stringify(toPublicSafeInterior(dm))).toBe(JSON.stringify(pub));
  });

  it('NEITHER public path carries the settlement seed (the DM seedFork embeds it verbatim)', () => {
    const s = withImp(true);
    const inst = s.institutions.find((i) => i.catalogId === 'merchant_guild');
    const dm = buildInteriorModel(s, inst, {});
    // the anchor: the DM fork DOES embed the raw seed, so an absence below is a real strip
    expect(dm.seedFork.startsWith('corrupt::interior:v1:')).toBe(true);
    expect(JSON.stringify(dm)).toContain('corrupt::');

    const paths = [
      ['BUILD publicSafe', buildInteriorModel(s, inst, { publicSafe: true })],
      ['SCRUB toPublicSafeInterior', toPublicSafeInterior(dm)],
    ];
    for (const [label, m] of paths) {
      expect(m.seedFork, `${label} kept a seedFork`).toBe('');
      expect(JSON.stringify(m).includes('corrupt::'), `${label} leaked the settlement seed`).toBe(false);
    }
  });

  it('covert corruption changes NOTHING visible — its public geometry == a clean build', () => {
    const covertS = withImp(true);
    const covertInst = covertS.institutions.find((i) => i.catalogId === 'merchant_guild');
    const cleanInst = base.institutions.find((i) => i.catalogId === 'merchant_guild');
    const scrubbedCovert = toPublicSafeInterior(buildInteriorModel(covertS, covertInst, {}));
    const clean = buildInteriorModel(base, cleanInst, {});
    const geom = (m) => JSON.stringify({ bounds: m.bounds, rooms: m.rooms, walls: m.walls, doors: m.doors, furnishings: m.furnishings });
    expect(geom(scrubbedCovert)).toBe(geom(clean)); // the visible floor plan is untouched by the covert chamber
  });
});

describe('KEYED SCALE — SEMANTIC FURNISHING (prosperity)', () => {
  it('a prosperous settlement yields a LARGER footprint than a poor one (same institution)', () => {
    const rich = makeInteriorSettlement('prosp', 'town', 'prosperous');
    const poor = makeInteriorSettlement('prosp', 'town', 'poor');
    const mr = buildInteriorModel(rich, ROSTER_BY_KIND.vice, {});
    const mp = buildInteriorModel(poor, ROSTER_BY_KIND.vice, {});
    const areaR = mr.meta.widthCells * mr.meta.depthCells;
    const areaP = mp.meta.widthCells * mp.meta.depthCells;
    expect(areaR).toBeGreaterThan(areaP);
  });
});

describe('KEYED SCALE — THE EDITS-DELTA LAW (cosmetic pins survive re-derivation)', () => {
  const s = makeInteriorSettlement('edit', 'town');
  const inst = ROSTER_BY_KIND.trade;

  it('a furnishing pin nudges only its own piece; the rest is byte-identical', () => {
    const m = buildInteriorModel(s, inst, {});
    const target = m.furnishings[0];
    const entry = { pins: [{ anchor: target.id, dx: 12, dy: -8 }] };
    const edited = applyInteriorEdits(m, entry);
    const moved = edited.furnishings.find((f) => f.id === target.id);
    expect(moved.x).not.toBe(target.x);
    // every OTHER furnishing unchanged
    for (const f of edited.furnishings) {
      if (f.id === target.id) continue;
      const orig = m.furnishings.find((o) => o.id === f.id);
      expect(f.x).toBe(orig.x);
      expect(f.y).toBe(orig.y);
    }
    // structural geometry untouched
    expect(JSON.stringify(edited.walls)).toBe(JSON.stringify(m.walls));
    expect(JSON.stringify(edited.rooms)).toBe(JSON.stringify(m.rooms));
  });

  it('a DANGLING pin anchor (no longer in the model) is silently dropped', () => {
    const m = buildInteriorModel(s, inst, {});
    const entry = { pins: [{ anchor: 'furn:room:does-not-exist:9', dx: 40, dy: 40 }] };
    const edited = applyInteriorEdits(m, entry);
    expect(JSON.stringify(edited.furnishings)).toBe(JSON.stringify(m.furnishings));
  });
});

describe('KEYED SCALE — PURITY source-scan (cross-machine determinism)', () => {
  it('no src/domain/interior file calls Date / Math.random / localeCompare', () => {
    const dir = resolve(HERE, '../../src/domain/interior');
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.js'))) {
      const text = readFileSync(join(dir, f), 'utf-8');
      expect(/Math\.random\s*\(/.test(text), `${f} calls Math.random()`).toBe(false);
      expect(/Date\.now\s*\(/.test(text), `${f} calls Date.now()`).toBe(false);
      expect(/new\s+Date\s*\(/.test(text), `${f} uses new Date()`).toBe(false);
      expect(/\.localeCompare\s*\(/.test(text), `${f} calls localeCompare()`).toBe(false);
    }
  });
});
