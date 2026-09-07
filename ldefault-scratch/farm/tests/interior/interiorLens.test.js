/**
 * tests/interior/interiorLens.test.js — the interior LENS-application pin (DOOR 3).
 *
 * The interior reads the SAME bounded town-map style layer (no new lens, no new colors).
 * GEOMETRY IS UNTOUCHED by the lens: every draw-op POSITION/size is identical under all
 * four base lenses — only the colors differ (a re-skin is a derived view, the cross-lens
 * pin from townMapDraw generalized to the interior scale).
 */
import { describe, it, expect } from 'vitest';
import { buildInteriorModel, buildInteriorDrawList, buildInteriorSvg } from '../../src/domain/interior/index.js';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { makeInteriorSettlement, ROSTER_BY_KIND } from '../fixtures/interiorFixtures.js';

/** Strip every color/weight attribute — keep only the pure geometry of an op. */
function geometryOnly(ops) {
  return ops.map((o) => {
    const { fill, fillOpacity, stroke, strokeWidth, strokeOpacity, ...geo } = o;
    return geo;
  });
}

describe('KEYED SCALE — lens application (geometry lens-invariant, colors lens-varying)', () => {
  const s = makeInteriorSettlement('lens', 'city', 'prosperous');

  for (const kind of ['faith', 'trade', 'vice']) {
    it(`${kind}: all four lenses yield IDENTICAL geometry`, () => {
      const model = buildInteriorModel(s, ROSTER_BY_KIND[kind], {});
      const geoms = TOWN_MAP_STYLE_IDS.map((id) => JSON.stringify(geometryOnly(buildInteriorDrawList(model, id))));
      for (const g of geoms) expect(g).toBe(geoms[0]);
    });
  }

  it('a NON-default lens produces DIFFERENT bytes than parchment (the re-skin is real)', () => {
    const model = buildInteriorModel(s, ROSTER_BY_KIND.faith, {});
    const parchment = buildInteriorSvg(model, { style: 'parchment' });
    const dark = buildInteriorSvg(model, { style: 'darkFantasy' });
    expect(parchment).not.toBe(dark);
  });

  it('the same (model, lens) is byte-identical (deterministic SVG)', () => {
    const model = buildInteriorModel(s, ROSTER_BY_KIND.trade, {});
    expect(buildInteriorSvg(model, { style: 'vtt' })).toBe(buildInteriorSvg(model, { style: 'vtt' }));
  });

  it('an unknown lens falls back to the default (never throws, never unsafe)', () => {
    const model = buildInteriorModel(s, ROSTER_BY_KIND.civic, {});
    const bogus = buildInteriorSvg(model, { style: 'not-a-real-lens' });
    const parchment = buildInteriorSvg(model, { style: 'parchment' });
    expect(bogus).toBe(parchment);
  });
});
