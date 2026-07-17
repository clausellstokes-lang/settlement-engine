/**
 * townPanorama.test.js — THE PANORAMA PROJECTION (#38, RULING #5).
 *
 * The panorama is a PROJECTION, not a style: it re-poses any town-map model into an
 * oblique 2.5D view while emitting the SAME draw-op vocabulary, so it COMPOSES WITH
 * EVERY LENS and honors the same cosmetic mapEdits the flat map does (WYSIWYG). These
 * pins hold: determinism, lens composition, model-version agnosticism, edit honoring,
 * and the self-contained SVG contract.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import {
  buildTownMapPanoramaDrawList, buildTownMapPanoramaSvg,
} from '../../src/domain/townMap/townPanorama.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { withPinNudge } from '../../src/domain/townMap/mapEdits.js';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);
const V2 = { layoutLawVersion: 2 };
const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'pano-1' });

describe('panorama — projection basics', () => {
  it('is deterministic (same model+style ⇒ byte-identical ops)', () => {
    const v2 = buildTownMapModel(s, V2);
    expect(stable(buildTownMapPanoramaDrawList(v2))).toBe(stable(buildTownMapPanoramaDrawList(v2)));
  });

  it('is a DIFFERENT projection from the flat draw (it re-poses the geometry)', () => {
    const v2 = buildTownMapModel(s, V2);
    expect(stable(buildTownMapPanoramaDrawList(v2))).not.toBe(stable(buildTownMapDrawList(v2)));
  });

  it('projects ANY model version — v1 and v2 both render a non-empty panorama', () => {
    expect(buildTownMapPanoramaDrawList(buildTownMapModel(s)).length).toBeGreaterThan(0);
    expect(buildTownMapPanoramaDrawList(buildTownMapModel(s, V2)).length).toBeGreaterThan(0);
  });

  it('a null/garbage model yields an empty op list (no throw)', () => {
    expect(buildTownMapPanoramaDrawList(null)).toEqual([]);
    expect(buildTownMapPanoramaDrawList({})).toEqual([]);
  });
});

describe('panorama — composes with every lens', () => {
  const v2 = buildTownMapModel(s, V2);

  it('renders under all four lenses, each a distinct skin over the same pose', () => {
    const perLens = {};
    for (const lens of TOWN_MAP_STYLE_IDS) {
      const ops = buildTownMapPanoramaDrawList(v2, lens);
      expect(ops.length).toBeGreaterThan(0);
      perLens[lens] = stable(ops);
    }
    // distinct bytes per lens (the lens paints; the projection is fixed)
    expect(perLens.parchment).not.toBe(perLens.darkFantasy);
    expect(perLens.watercolor).not.toBe(perLens.vtt);
    // …but the OP COUNT is identical across lenses (same geometry, re-skinned)
    const counts = TOWN_MAP_STYLE_IDS.map((l) => buildTownMapPanoramaDrawList(v2, l).length);
    expect(new Set(counts).size).toBe(1);
  });
});

describe('panorama — WYSIWYG (honors cosmetic mapEdits)', () => {
  it('a pinned building shifts the panorama (the edit is baked into the model)', () => {
    const anchor = buildTownMapModel(s, V2).buildings[2].anchorKey;
    const base = buildTownMapModel(s, V2);
    const pinned = buildTownMapModel(s, { ...withPinNudge(null, anchor, 60, -40), layoutLawVersion: 2 });
    expect(stable(buildTownMapPanoramaDrawList(pinned))).not.toBe(stable(buildTownMapPanoramaDrawList(base)));
  });
});

describe('panorama — self-contained SVG contract', () => {
  it('emits a well-formed, external-ref-free SVG under a chosen lens', () => {
    const svg = buildTownMapPanoramaSvg(buildTownMapModel(s, V2), { style: 'watercolor' });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trim().endsWith('</svg>')).toBe(true);
    expect(svg).not.toContain('href=');   // no <image href> / external refs — taint-free
    expect(svg).not.toContain('<script');
  });
});
