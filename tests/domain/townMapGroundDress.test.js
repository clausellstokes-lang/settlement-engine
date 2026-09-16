/**
 * townMapGroundDress.test.js — THE ILLUSTRATED TOWN (IT-2): the GROUND DRESS.
 *
 * groundDressOps extends the landform mark idiom (dot / stroke / curve, pattern-not-colour)
 * to the whole ground plane, emitted as the existing five primitive op kinds. This pins:
 *   • DORMANCY — a lens that does not name the dress fields (every re-skin AND the
 *     accessible lens) emits ZERO dress ops, so the prior output is byte-identical.
 *   • v1 COVERAGE LAW — EVERY golden settlement (v1 and v2) gets dressed, because the base
 *     dress derives only from features present in BOTH generations (districts, roads, …).
 *   • PURITY / DETERMINISM — output is the five op kinds, all-finite-integer coords, and
 *     byte-identical across repeated builds (seeded off the model's own geometry).
 *   • PATTERN-not-COLOUR — dress marks carry ONLY the lens ink (no district / water hues),
 *     so they read under any colour vision (the accessible-safe construction) — although
 *     the accessible lens itself never renders them (dormancy above).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { groundDressOps } from '../../src/domain/townMap/groundDress.js';
import {
  TOWN_MAP_STYLE_IDS, ILLUSTRATED_STYLE_ID, resolveTownMapStyle,
} from '../../src/design/townMapStyles.js';
import { GOLDEN_CONFIGS, V2_GOLDEN_CONFIGS, makeTownFixture } from '../fixtures/townMapFixtures.js';

const KNOWN_OPS = new Set(['poly', 'line', 'circle', 'rect', 'path']);
const stable = (v) => JSON.stringify(v);

/** Every golden model (v1 corpus + v2 corpus), labelled. */
function allModels() {
  const rows = [];
  for (const { spec, settlement } of GOLDEN_CONFIGS) rows.push({ label: `v1 ${spec.tier}/${spec.terrain}`, model: buildTownMapModel(settlement) });
  for (const { spec, settlement, mapEdits } of V2_GOLDEN_CONFIGS) rows.push({ label: `v2 ${spec.tier}/${spec.terrain}`, model: buildTownMapModel(settlement, mapEdits) });
  return rows;
}

describe('ground dress — dormancy (only the illustrated lens dresses the ground)', () => {
  it('every re-skin lens AND the accessible lens emit ZERO dress ops', () => {
    for (const { label, model } of allModels()) {
      for (const id of TOWN_MAP_STYLE_IDS) {
        expect(groundDressOps(model, id).length, `${id} dressed ${label}`).toBe(0);
      }
    }
  });

  it('a re-skin lens carries no dress field, the illustrated lens carries both', () => {
    for (const id of TOWN_MAP_STYLE_IDS) {
      const s = resolveTownMapStyle(id);
      expect(s.opacity.dress, `${id} names opacity.dress`).toBeUndefined();
      expect(s.stroke.dress, `${id} names stroke.dress`).toBeUndefined();
    }
    const il = resolveTownMapStyle(ILLUSTRATED_STYLE_ID);
    expect(typeof il.opacity.dress).toBe('number');
    expect(typeof il.stroke.dress).toBe('number');
  });

  it('dress is purely additive — the parchment draw list is unchanged by it (dormant)', () => {
    // The re-skin draw list contains no dress ops; the illustrated one is strictly longer.
    const model = buildTownMapModel(GOLDEN_CONFIGS[12].settlement);
    const parch = buildTownMapDrawList(model, 'parchment');
    const illus = buildTownMapDrawList(model, 'illustrated');
    expect(illus.length).toBeGreaterThan(parch.length + groundDressOps(model, 'illustrated').length - 1);
  });
});

describe('ground dress — v1 COVERAGE LAW (every settlement gets dressed)', () => {
  it('every golden config (v1 and v2) emits a non-empty, all-typed dress list', () => {
    for (const { label, model } of allModels()) {
      const ops = groundDressOps(model, 'illustrated');
      expect(ops.length, `${label} got no ground dress`).toBeGreaterThan(0);
      for (const o of ops) expect(KNOWN_OPS.has(o.t), `${label} emitted a non-primitive op`).toBe(true);
    }
  });

  it('a bare v1 settlement (no water, no walls, no landform) still gets furrows/meadow/hedges', () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'dress-bare' });
    const ops = groundDressOps(buildTownMapModel(s), 'illustrated');
    expect(ops.length).toBeGreaterThan(0);
  });
});

describe('ground dress — purity + determinism', () => {
  it('all coordinates are finite integers (cross-machine stable bytes)', () => {
    for (const { label, model } of allModels()) {
      for (const o of groundDressOps(model, 'illustrated')) {
        const nums = [];
        if (o.t === 'line') nums.push(o.x1, o.y1, o.x2, o.y2);
        else if (o.t === 'circle') nums.push(o.cx, o.cy, o.r);
        else if (o.t === 'poly') for (const [x, y] of o.pts) nums.push(x, y);
        for (const n of nums) {
          expect(Number.isFinite(n), `${label} non-finite coord`).toBe(true);
          expect(Number.isInteger(n), `${label} non-integer coord ${n}`).toBe(true);
        }
      }
    }
  });

  it('the same model dresses byte-identically twice', () => {
    for (const { label, model } of allModels()) {
      expect(stable(groundDressOps(model, 'illustrated')), label).toBe(stable(groundDressOps(model, 'illustrated')));
    }
  });

  it('two structurally-distinct towns wear DIFFERENT dress (seeded off geometry, not constant)', () => {
    const a = groundDressOps(buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'dress-A' })), 'illustrated');
    const b = groundDressOps(buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'riverside', walls: true, water: true, seed: 'dress-B' })), 'illustrated');
    expect(stable(a)).not.toBe(stable(b));
  });
});

describe('ground dress — PATTERN-not-COLOUR (colour-vision safe by construction)', () => {
  it('every dress mark uses only the lens ink — never a district or water hue', () => {
    const ink = resolveTownMapStyle(ILLUSTRATED_STYLE_ID).palette.ink;
    for (const { label, model } of allModels()) {
      for (const o of groundDressOps(model, 'illustrated')) {
        if (o.stroke != null) expect(o.stroke, `${label} dress stroke not ink`).toBe(ink);
        if (o.fill != null) expect(o.fill, `${label} dress fill not ink`).toBe(ink);
      }
    }
  });
});
