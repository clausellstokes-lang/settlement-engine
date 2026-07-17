/**
 * tests/interior/interiorExport.test.js — the interior export lane pins (DOOR 3).
 *
 * PRE-WALLED BY CONSTRUCTION: the UVTT line-of-sight is a 1:1 image of the interior
 * wall segments (no derivation, unlike the town-map footprint→segment seam). Plus the
 * fail-closed covert scrub, the pricing seam, and the SVG self-gate.
 */
import { describe, it, expect } from 'vitest';
import {
  buildInteriorModel,
  buildInteriorUvtt, interiorExportSvg, interiorExportFilename, interiorExportGateReady,
} from '../../src/domain/interior/index.js';
import { makeInteriorSettlement, ROSTER_BY_KIND } from '../fixtures/interiorFixtures.js';

const UNITS_PER_CELL = 50;
const toCell = (v) => Math.round((v / UNITS_PER_CELL) * 10000) / 10000;

describe('KEYED SCALE — UVTT export (pre-walled by construction, 1:1 wall geometry)', () => {
  const s = makeInteriorSettlement('uvtt', 'city', 'prosperous');
  const model = buildInteriorModel(s, ROSTER_BY_KIND.trade, {}); // no corruption ⇒ all walls visible

  it('line_of_sight is exactly one segment per wall, endpoints scaled 1:1 into cell space', () => {
    const scene = buildInteriorUvtt(model);
    expect(scene.line_of_sight.length).toBe(model.walls.length);
    for (let i = 0; i < model.walls.length; i++) {
      const w = model.walls[i];
      const seg = scene.line_of_sight[i];
      expect(seg.length).toBe(2);
      expect(seg[0]).toEqual({ x: toCell(w.x1), y: toCell(w.y1) });
      expect(seg[1]).toEqual({ x: toCell(w.x2), y: toCell(w.y2) });
    }
  });

  it('portals are a 1:1 image of the doors', () => {
    const scene = buildInteriorUvtt(model);
    expect(scene.portals.length).toBe(model.doors.length);
  });

  it('the scene declares the 20×20 cell grid at token resolution', () => {
    const scene = buildInteriorUvtt(model);
    expect(scene.resolution.map_size).toEqual({ x: 20, y: 20 });
    expect(scene.resolution.pixels_per_grid).toBe(70);
    expect(scene.resolution.map_origin).toEqual({ x: 0, y: 0 });
  });

  it('FAIL-CLOSED: covert walls/doors NEVER reach the UVTT line-of-sight', () => {
    const covertS = {
      ...s,
      institutions: s.institutions.map((i) => (i.catalogId === 'merchant_guild'
        ? { ...i, impairments: [{ type: 'corruption', covert: true }] } : i)),
    };
    const inst = covertS.institutions.find((i) => i.catalogId === 'merchant_guild');
    const dm = buildInteriorModel(covertS, inst, {});
    expect(dm.walls.some((w) => w.covert)).toBe(true); // the DM model HAS covert walls
    const scene = buildInteriorUvtt(dm);
    const visibleWalls = dm.walls.filter((w) => !w.covert).length;
    expect(scene.line_of_sight.length).toBe(visibleWalls); // …but the UVTT omits them
    expect(scene.line_of_sight.length).toBeLessThan(dm.walls.length);
  });
});

describe('KEYED SCALE — SVG self-gate + filename + pricing seam', () => {
  const s = makeInteriorSettlement('svg', 'town');

  it('interiorExportSvg returns an SVG string for a drawable interior, null for a degenerate one', () => {
    const m = buildInteriorModel(s, ROSTER_BY_KIND.faith, {});
    const svg = interiorExportSvg(m, { style: 'vtt' });
    expect(typeof svg).toBe('string');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(interiorExportSvg(null)).toBe(null);
    expect(interiorExportSvg({ interiorVersion: 1, meta: {}, bounds: { x: 0, y: 0, w: 0, h: 0 }, rooms: [], walls: [], doors: [], furnishings: [] })).toBe(null);
  });

  it('the filename is slugged, denylist-free, and lens-aware', () => {
    expect(interiorExportFilename('New Haven', 'The Gilded Flagon', 'svg')).toBe('new-haven-the-gilded-flagon-interior.svg');
    expect(interiorExportFilename('New Haven', 'The Gilded Flagon', 'uvtt', 'darkFantasy')).toBe('new-haven-the-gilded-flagon-interior-darkfantasy.uvtt');
  });

  it('the pricing seam rides the export-bundle access decision (pass-through, wired to nothing)', () => {
    expect(interiorExportGateReady({ allowed: true })).toBe(true);
    expect(interiorExportGateReady({ allowed: false })).toBe(false);
    expect(interiorExportGateReady(null)).toBe(false);
    expect(interiorExportGateReady(undefined)).toBe(false);
  });
});
