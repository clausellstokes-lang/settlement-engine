/**
 * @vitest-environment jsdom
 *
 * townMapExport.test.js — the per-settlement TOWN-MAP export lane CONTRACT
 * (MAP EXPORTS).
 *
 * The real raster is browser-only (like shareImage / townMapThumb, this repo pins
 * the pure parts + the render seam, not the canvas encode). The pins:
 *   • the native SVG is a PURE, deterministic function of (settlement, lens,
 *     resolution) — same input → byte-identical, a lens switch → different bytes,
 *     a resolution change → a different vector box;
 *   • the raster path feeds the canvas the SAME deterministic SVG for every format
 *     with the right mime/size (the encode itself is platform-variant, so we pin
 *     the SVG INPUT structure, not the encoded bytes);
 *   • the SVG format never touches the canvas;
 *   • a map-less settlement yields null (and never rasterizes);
 *   • the filename slugs settlement + lens + date + ext;
 *   • the VTT token-raster download closes the recorded seam (VTT lens, PNG, 1400).
 */
import { describe, it, expect } from 'vitest';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';
import {
  townMapExportSvg, renderTownMapExport, townMapExportFilename,
  downloadTownMapTokenRaster,
  TOWN_MAP_EXPORT_FORMATS, TOWN_MAP_EXPORT_RESOLUTIONS, DEFAULT_EXPORT_RESOLUTION,
} from '../../src/lib/townMapExport.js';

describe('townMapExport — native SVG (pure + deterministic)', () => {
  it('is byte-identical for the same (settlement, lens, resolution)', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'exp-1' });
    expect(townMapExportSvg(s, { style: 'parchment', resolution: 2400 }))
      .toBe(townMapExportSvg(s, { style: 'parchment', resolution: 2400 }));
  });

  it('honors the current lens: a lens switch changes the exported bytes', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'exp-lens' });
    const parch = townMapExportSvg(s, { style: 'parchment' });
    const vtt = townMapExportSvg(s, { style: 'vtt' });
    const dark = townMapExportSvg(s, { style: 'darkFantasy' });
    expect(parch).not.toBe(vtt);
    expect(parch).not.toBe(dark);
    expect(vtt).not.toBe(dark);
  });

  it('a resolution change sizes the vector box', () => {
    const s = makeTownFixture({ seed: 'exp-res' });
    expect(townMapExportSvg(s, { resolution: 1200 })).toContain('width="1200"');
    expect(townMapExportSvg(s, { resolution: 4800 })).toContain('width="4800"');
    // The default resolution is applied when omitted.
    expect(townMapExportSvg(s)).toContain(`width="${DEFAULT_EXPORT_RESOLUTION}"`);
  });

  it('defaults the lens to the settlement styleLens when no override is passed', () => {
    const base = makeTownFixture({ seed: 'exp-persist' });               // parchment (default)
    const vttPersisted = { ...base, mapEdits: { styleLens: 'vtt' } };
    expect(townMapExportSvg(vttPersisted)).toBe(townMapExportSvg(vttPersisted, { style: 'vtt' }));
    expect(townMapExportSvg(vttPersisted)).not.toBe(townMapExportSvg(base));
  });

  it('is null for a map-less settlement', () => {
    expect(townMapExportSvg({ institutions: [], spatialLayout: { quarters: [] } })).toBe(null);
    expect(townMapExportSvg(null)).toBe(null);
  });
});

describe('townMapExport — raster (injected rasterizer seam)', () => {
  it('every raster format feeds the canvas the SAME deterministic SVG + right mime/size', async () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'plains', walls: true, water: false, seed: 'exp-raster' });
    const calls = [];
    const fake = async (svg, size, mime, quality) => { calls.push({ svg, size, mime, quality }); return new Blob([String(mime)]); };
    const png = await renderTownMapExport(s, { format: 'png', resolution: 2400, style: 'parchment', rasterize: fake });
    const jpeg = await renderTownMapExport(s, { format: 'jpeg', resolution: 2400, style: 'parchment', rasterize: fake });
    const webp = await renderTownMapExport(s, { format: 'webp', resolution: 2400, style: 'parchment', rasterize: fake });

    expect(png.mime).toBe('image/png'); expect(png.ext).toBe('png');
    expect(jpeg.mime).toBe('image/jpeg'); expect(jpeg.ext).toBe('jpg');
    expect(webp.mime).toBe('image/webp'); expect(webp.ext).toBe('webp');
    // Structure pin: the SVG input is byte-identical across formats (the encode is
    // browser-native + platform-variant; the deterministic part is what we hand it).
    expect(calls[0].svg).toBe(calls[1].svg);
    expect(calls[1].svg).toBe(calls[2].svg);
    expect(calls.map(c => c.size)).toEqual([2400, 2400, 2400]);
    expect(calls.map(c => c.mime)).toEqual(['image/png', 'image/jpeg', 'image/webp']);
  });

  it('the SVG format returns a text Blob WITHOUT touching the canvas', async () => {
    const s = makeTownFixture({ seed: 'exp-svg-fmt' });
    let called = 0;
    const out = await renderTownMapExport(s, { format: 'svg', rasterize: async () => { called++; return new Blob([]); } });
    expect(called).toBe(0);
    expect(out.mime).toBe('image/svg+xml');
    expect(out.ext).toBe('svg');
    expect(out.blob).toBeInstanceOf(Blob);
  });

  it('returns null (never rasterizes) for a map-less settlement', async () => {
    let called = 0;
    const out = await renderTownMapExport({}, { format: 'png', rasterize: async () => { called++; return new Blob([]); } });
    expect(out).toBe(null);
    expect(called).toBe(0);
  });

  it('exposes the public format + resolution menus', () => {
    expect(TOWN_MAP_EXPORT_FORMATS).toEqual(['svg', 'png', 'jpeg', 'webp']);
    expect(TOWN_MAP_EXPORT_RESOLUTIONS).toEqual([1200, 2400, 4800]);
  });
});

describe('townMapExport — filenames', () => {
  it('slugs the settlement + lens + date + ext', () => {
    const d = new Date(2026, 6, 17); // local 2026-07-17
    expect(townMapExportFilename("Otto's Rest!", 'darkFantasy', 'png', d))
      .toBe('otto-s-rest-darkfantasy-map-2026-07-17.png');
  });

  it('falls back gracefully on empty inputs', () => {
    const d = new Date(2026, 0, 5); // local 2026-01-05
    expect(townMapExportFilename('', '', 'svg', d))
      .toBe('settlement-parchment-map-2026-01-05.svg');
  });
});

describe('townMapExport — VTT token raster download (the recorded seam, closed)', () => {
  it('downloads the VTT-lens token PNG (size 1400) via the injected rasterizer', async () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'exp-token' });
    let seen = null;
    // renderTownMapTokenRaster's seam is (svg, size, quality, mime).
    const fake = async (svg, size, quality, mime) => {
      seen = { size, mime, hasGrid: /stroke-width="0.75"/.test(svg) };
      return 'data:image/png;base64,FAKE';
    };
    const out = await downloadTownMapTokenRaster(s, { rasterize: fake });
    expect(out).toEqual({ dataUrl: 'data:image/png;base64,FAKE', size: 1400 });
    expect(seen.size).toBe(1400);
    expect(seen.mime).toBe('image/png');   // crisp lines, not JPEG
    expect(seen.hasGrid).toBe(true);        // the VTT grid rides the export
  });

  it('returns null (never rasterizes) for a map-less settlement', async () => {
    let calls = 0;
    const out = await downloadTownMapTokenRaster(
      { institutions: [], spatialLayout: { quarters: [] } },
      { rasterize: async () => { calls++; return 'x'; } },
    );
    expect(out).toBe(null);
    expect(calls).toBe(0);
  });
});
