/**
 * townMapLandform.test.js — THE NON-WATER LANDFORM (task #38 fenced follow-up).
 *
 * The v2 site genesis GENERATES a marsh / dune-field / mountain-flank as model data,
 * but before this wave only water (river/coast) rendered visually. These pins hold the
 * landform's whole render contract:
 *   • PER-KIND RENDER — each site kind emits its distinct texture (mountain hachures ·
 *     dune contours+stipple · marsh stipple+reeds), in the bounded primitive vocabulary;
 *   • LENS MATRIX — all five lenses draw the SAME landform geometry (identical op count),
 *     re-skinned (distinct bytes) — the cross-lens invariant, incl. the colourblind-safe
 *     accessible lens (distinction by PATTERN, never colour);
 *   • PANORAMA — the landform re-poses onto the oblique projection (pseudo-elevation);
 *   • EXPORT INHERITANCE — the marks reach the shared draw list ⇒ the SVG / PDF plate /
 *     thumbnail all inherit them through the one op vocabulary;
 *   • DORMANCY — a water/plain site (and every v1 model) carries no landform ⇒ no ops ⇒
 *     byte-identical to the pre-landform output;
 *   • PROVENANCE — the surveyor's read surfaces the already-annotated site cause;
 *   • GOLDEN — a frozen hash pins the marsh/dunes/mountain geometry (the corpus lacks a
 *     marsh; the v2 model golden pins mountain-flank + dunes in situ).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import {
  buildTownMapDrawList, landformDrawOps, buildTownMapSvg,
} from '../../src/domain/townMap/townMapDraw.js';
import { buildTownMapPanoramaDrawList } from '../../src/domain/townMap/townPanorama.js';
import { renderTownMapOp } from '../../src/pdf/sections/TownMapPlate.jsx';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { mapProvenanceStory } from '../../src/components/townMap/provenanceModel.js';
import { makeTownFixture, LANDFORM_FIXTURES } from '../fixtures/townMapFixtures.js';

const V2 = { layoutLawVersion: 2 };
const stable = (v) => JSON.stringify(v);
const modelFor = (kind) => buildTownMapModel(LANDFORM_FIXTURES.find((f) => f.kind === kind).settlement, V2);

describe('landform — per-kind render (distinct engraved textures)', () => {
  it('mountain-flank draws a ridge contour + downslope hachures (poly + lines, no fills)', () => {
    const m = modelFor('mountain-flank');
    expect(m.meta.siteKind).toBe('mountain-flank');
    const ops = landformDrawOps(m.frame.landform);
    const kinds = ops.reduce((a, o) => ((a[o.t] = (a[o.t] || 0) + 1), a), {});
    expect(kinds.poly).toBeGreaterThanOrEqual(1);   // the crest contour(s)
    expect(kinds.line).toBeGreaterThan(10);         // the hachure fan
    expect(kinds.rect).toBeUndefined();             // never a rect (fidelity pin safe)
    expect(kinds.circle).toBeUndefined();           // hachures, not stipple
  });

  it('dunes draw nested contour curves + a sand stipple (open polys + circles)', () => {
    const m = modelFor('dunes');
    expect(m.meta.siteKind).toBe('dunes');
    const ops = landformDrawOps(m.frame.landform);
    const polys = ops.filter((o) => o.t === 'poly');
    expect(polys.length).toBeGreaterThanOrEqual(4);       // the rolling dune contours
    expect(polys.every((p) => p.closed === false)).toBe(true); // contours are open curves
    expect(ops.some((o) => o.t === 'circle')).toBe(true); // sand stipple
    expect(ops.some((o) => o.t === 'rect')).toBe(false);
  });

  it('marsh draws a wet-ground stipple + reed tufts (circles + lines)', () => {
    const m = modelFor('marsh');
    expect(m.meta.siteKind).toBe('marsh');
    const ops = landformDrawOps(m.frame.landform);
    expect(ops.filter((o) => o.t === 'circle').length).toBeGreaterThan(10); // stipple
    expect(ops.filter((o) => o.t === 'line').length).toBeGreaterThan(5);    // reeds
    expect(ops.some((o) => o.t === 'rect')).toBe(false);
  });

  it('every landform op is a known primitive + all landform ink is one colour (never colour-coded)', () => {
    const KNOWN = new Set(['poly', 'line', 'circle']);
    for (const { kind } of LANDFORM_FIXTURES) {
      const ops = landformDrawOps(modelFor(kind).frame.landform, 'parchment');
      const inks = new Set();
      for (const o of ops) {
        expect(KNOWN.has(o.t)).toBe(true);
        inks.add(o.stroke || o.fill);
      }
      // one ink for the whole landform ⇒ the distinction is by PATTERN, not colour.
      expect(inks.size).toBe(1);
    }
  });
});

describe('landform — the lens matrix (same geometry, re-skinned)', () => {
  it('all five lenses draw an identical landform op count per kind (geometry is lens-independent)', () => {
    for (const { kind } of LANDFORM_FIXTURES) {
      const lf = modelFor(kind).frame.landform;
      const counts = TOWN_MAP_STYLE_IDS.map((id) => landformDrawOps(lf, id).length);
      expect(new Set(counts).size, `${kind} op counts differ across lenses`).toBe(1);
      expect(counts[0]).toBeGreaterThan(0);
    }
  });

  it('a chosen lens re-skins the ink (distinct bytes) while the accessible lens keeps the pattern', () => {
    const lf = modelFor('mountain-flank').frame.landform;
    const parchment = stable(landformDrawOps(lf, 'parchment'));
    const dark = stable(landformDrawOps(lf, 'darkFantasy'));
    const accessible = stable(landformDrawOps(lf, 'accessible'));
    expect(parchment).not.toBe(dark);            // the lens paints
    expect(parchment).not.toBe(accessible);      // heavier accessible ink
    // …but the op COUNT (the pattern) is identical — accessible distinguishes by shape.
    expect(landformDrawOps(lf, 'accessible').length).toBe(landformDrawOps(lf, 'parchment').length);
  });
});

describe('landform — panorama composition + export inheritance', () => {
  it('the landform re-poses into the panorama (a landform model draws more panorama ops than a plain one)', () => {
    const lfPano = buildTownMapPanoramaDrawList(modelFor('mountain-flank')).length;
    const plain = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'lf-plain' }), V2);
    expect(plain.frame.landform).toBeUndefined();
    const plainPano = buildTownMapPanoramaDrawList(plain).length;
    expect(lfPano).toBeGreaterThan(plainPano);
  });

  it('EXPORT INHERITANCE — the landform marks reach the shared draw list AND the SVG', () => {
    const m = modelFor('marsh');
    const full = buildTownMapDrawList(m, 'parchment');
    const landform = landformDrawOps(m.frame.landform, 'parchment');
    expect(full.length).toBeGreaterThan(landform.length); // the full map contains the landform
    // the marks serialize into the self-contained SVG (thumbnail + plate substrate)
    const svg = buildTownMapSvg(m, { style: 'parchment', width: 300, height: 300 });
    expect(svg).toContain('<circle');   // marsh stipple reached the SVG
    expect(/NaN|undefined/.test(svg)).toBe(false);
  });

  it('EXPORT INHERITANCE — every landform op renders through the PDF plate op mapper (no unhandled kind)', () => {
    const ops = landformDrawOps(modelFor('dunes').frame.landform, 'vtt');
    for (let i = 0; i < ops.length; i++) expect(renderTownMapOp(ops[i], i)).not.toBeNull();
  });
});

describe('landform — dormancy (the pre-landform output is untouched)', () => {
  it('a plain / water site carries no landform, and its draw list has no landform op growth', () => {
    // plain
    const plain = buildTownMapModel(makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'dorm-plain' }), V2);
    expect(plain.frame.landform).toBeUndefined();
    expect(landformDrawOps(plain.frame.landform)).toEqual([]);
    // coast (water renders; no non-water landform)
    const coast = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'dorm-coast' }), V2);
    expect(coast.frame.landform).toBeUndefined();
  });

  it('a v1 model has no landform at all (the versioning law)', () => {
    const v1 = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'mountain', walls: true, water: false, seed: 'dorm-v1' }));
    expect(v1.frame.landform).toBeUndefined();
    expect(landformDrawOps(v1.frame.landform)).toEqual([]);
  });

  it('landformDrawOps degrades gracefully on junk input', () => {
    expect(landformDrawOps(null)).toEqual([]);
    expect(landformDrawOps(undefined)).toEqual([]);
    expect(landformDrawOps({})).toEqual([]);
    expect(landformDrawOps({ kind: 'marsh', marks: 'not-an-array' })).toEqual([]);
  });
});

describe('landform — provenance (the surveyor’s read explains the site for free)', () => {
  it('the map story surfaces the already-annotated site cause for each landform kind', () => {
    const wants = {
      'mountain-flank': 'site-slope',
      dunes: 'site-flats',
      marsh: 'site-water', // a marsh rides the water branch (reed/peat)
    };
    for (const { kind } of LANDFORM_FIXTURES) {
      const story = mapProvenanceStory(modelFor(kind));
      expect(story).not.toBeNull();
      const effects = story.site.map((r) => r.effect);
      expect(effects, `${kind} missing its site provenance`).toContain(wants[kind]);
      // the cause is the engine's own human-readable string, shown verbatim (never invented)
      expect(story.site.every((r) => typeof r.ref === 'string' && r.ref.length > 0)).toBe(true);
    }
  });
});

describe('landform — determinism + the frozen geometry golden', () => {
  it('same model ⇒ byte-identical landform ops twice', () => {
    const lf = modelFor('dunes').frame.landform;
    expect(stable(landformDrawOps(lf, 'watercolor'))).toBe(stable(landformDrawOps(lf, 'watercolor')));
  });

  it('the marsh/dunes/mountain landform geometry hashes to the frozen golden', async () => {
    const { createHash } = await import('node:crypto');
    const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
    const payload = LANDFORM_FIXTURES.map(({ settlement }) => {
      const m = buildTownMapModel(settlement, V2);
      const drawByLens = {};
      for (const id of TOWN_MAP_STYLE_IDS) drawByLens[id] = buildTownMapDrawList(m, id);
      return { landform: m.frame.landform, drawByLens, panorama: buildTownMapPanoramaDrawList(m, 'parchment') };
    });
    // FROZEN: a DELIBERATE landform-vocabulary/density change reds this — re-mint with a
    // stated cause (recompute the constant below), the additive-golden discipline.
    expect(sha(payload)).toBe('6c1fa59289571b81bffa5d83b3c2cf1125cc00ed326cf41365e9f55cdd8c7686');
  });
});
