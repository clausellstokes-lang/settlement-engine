/**
 * townMapSkinReskin.test.js — THE FULL RESKIN worn (THE ILLUSTRATED TOWN, IT-4).
 *
 * IT4-a (the closed seam) + IT4-b (the wall extension) compose: a bespoke skin may now carry a
 * GLYPH SET + a SEASON BIAS + tuned dress/shadow — a genre-and-mood reskin — through the same
 * accept→mint path, and be WORN on the real map. Pins:
 *   • a saved skin naming glyphSet:'medieval' renders GLYPHS (no legacy 16×16 rects) on the map
 *     surfaces once selected — the reskin reaches the render, not just the panel preview;
 *   • seasonBias is a FALLBACK season: with no live dress, a winter-biased skin dresses the ground
 *     as winter (deterministically), while a bias-less skin stays seasonless — and the live world
 *     clock always wins over the bias;
 *   • DORMANCY: the base illustrated lens (no seasonBias) is byte-identical (the golden never moves).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { groundDressOps } from '../../src/domain/townMap/groundDress.js';
import { resolveActiveStyle, addBespokeStyle } from '../../src/domain/townMap/bespokeStyles.js';
import { validateBespokeStyle } from '../../src/design/townMapStyleWall.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';
import { townMapExportSvg } from '../../src/lib/townMapExport.js';
import { makeTownFixture, GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);
const richModel = () => buildTownMapModel(GOLDEN_CONFIGS[10].settlement);
const rect16 = (ops) => ops.filter((o) => o.t === 'rect' && o.w === 16 && o.h === 16).length;

/** A wall-validated GLYPH reskin: medieval glyphs + tuned dress; optional season bias. */
function reskin(id, { seasonBias } = {}) {
  const { ok, style } = validateBespokeStyle({
    label: id, glyphSet: 'medieval',
    opacity: { dress: 0.5, shadow: 0.18, roofFill: 0.16 },
    stroke: { dress: 1.1 },
    ...(seasonBias ? { seasonBias } : {}),
  }, { id, label: id });
  expect(ok).toBe(true);
  return style;
}

describe('skin reskin — a glyphSet skin is WORN (renders glyphs, not rects)', () => {
  it('the resolved skin renders GLYPHS on the map surfaces (seam + wall compose)', () => {
    const model = richModel();
    const skin = reskin('glyph-skin');
    expect(skin.glyphSet).toBe('medieval');
    const worn = buildTownMapDrawList(model, resolveActiveStyle('glyph-skin', addBespokeStyle({}, 'glyph-skin', skin)));
    // glyphs replaced the legacy landmark rects, and it differs materially from parchment.
    expect(rect16(worn)).toBe(0);
    expect(stable(worn)).not.toBe(stable(buildTownMapDrawList(model, 'parchment')));
    // and it matches the base illustrated lens's building treatment (same glyph set) — a reskin,
    // not a new geometry: the illustrated lens also draws medieval glyphs.
    expect(rect16(buildTownMapDrawList(model, 'illustrated'))).toBe(0);
  });

  it('the image export surface wears the glyph reskin (no legacy rect markup; differs from parchment)', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'reskin-exp' });
    const skin = reskin('glyph-skin');
    const worn = { ...s, mapEdits: { styleLens: 'glyph-skin', bespokeStyles: addBespokeStyle({}, 'glyph-skin', skin) } };
    expect(townMapExportSvg(worn)).not.toBe(townMapExportSvg({ ...s, mapEdits: { styleLens: 'parchment' } }));
  });
});

describe('skin reskin — seasonBias is a bounded FALLBACK season', () => {
  it('a winter-biased skin dresses the ground as winter with NO live dress (bias-less stays seasonless)', () => {
    const model = richModel();
    const winter = reskin('winter-skin', { seasonBias: 'winter' });
    const plain = reskin('plain-skin');
    // No dress argument (no live campaign) — the bias supplies the season for the winter skin only.
    const winterOps = groundDressOps(model, winter, null);
    const plainOps = groundDressOps(model, plain, null);
    expect(winterOps.length).toBeGreaterThan(0);              // the reskin dresses the ground
    expect(stable(winterOps)).not.toBe(stable(plainOps));     // seasonBias changed the dress
    // the winter bias reproduces exactly the winter DRESS a live winter clock would paint.
    expect(stable(winterOps)).toBe(stable(groundDressOps(model, plain, { season: 'winter' })));
  });

  it('the live world clock ALWAYS wins over the skin bias (bias is fallback-only)', () => {
    const model = richModel();
    const winterBias = reskin('winter-skin', { seasonBias: 'winter' });
    // A live SUMMER dress must override a winter bias ⇒ identical to a bias-less skin under summer.
    const plain = reskin('plain-skin');
    expect(stable(groundDressOps(model, winterBias, { season: 'summer' })))
      .toBe(stable(groundDressOps(model, plain, { season: 'summer' })));
  });

  it('DORMANCY: the base illustrated lens carries no bias ⇒ seasonless ground dress unchanged', () => {
    const model = richModel();
    const illustrated = resolveTownMapStyle('illustrated');
    expect(illustrated.seasonBias).toBeUndefined();
    // seasonless (no dress) is byte-identical to itself — the seasonBias wire never fires for it.
    expect(stable(groundDressOps(model, illustrated, null))).toBe(stable(groundDressOps(model, 'illustrated', null)));
  });
});
