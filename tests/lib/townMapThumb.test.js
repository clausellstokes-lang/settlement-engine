/**
 * townMapThumb.test.js — SM-4 library-card thumbnail CONTRACT pin.
 *
 * The canvas raster is browser-only (like shareImage.renderShareCardPng, this
 * repo unit-tests the pure parts, not the canvas), so the pins cover the cache
 * contract + the render seam with an injected rasterizer:
 *   • the cache key is a PURE, deterministic function of the settlement (+ size)
 *     — same input → same key; a map-less settlement → null;
 *   • it INVALIDATES correctly — a cosmetic mapEdits re-roll (or a roster change)
 *     changes the geometry → changes the key;
 *   • renderTownMapThumb CACHES — a second call for the same content returns the
 *     cached data URL WITHOUT re-rasterizing (the expensive canvas encode runs
 *     once); different content → a fresh raster.
 */
import { describe, expect, it, beforeEach } from 'vitest';

import {
  townMapThumbCacheKey, renderTownMapThumb, renderTownMapTokenRaster, tokenRasterSize,
  _thumbCacheSize, _clearThumbCache,
} from '../../src/lib/townMapThumb.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

beforeEach(() => { _clearThumbCache(); });

describe('townMapThumb — cache key contract', () => {
  it('is deterministic: the same settlement + size yields the same key', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'riverside', walls: true, water: true, seed: 'thumb-1' });
    expect(townMapThumbCacheKey(s, 128)).toBe(townMapThumbCacheKey(s, 128));
  });

  it('is null for a map-less settlement (the self-gate)', () => {
    expect(townMapThumbCacheKey({ institutions: [], spatialLayout: { quarters: [] } }, 128)).toBe(null);
    expect(townMapThumbCacheKey({}, 128)).toBe(null);
    expect(townMapThumbCacheKey(null, 128)).toBe(null);
  });

  it('is size-scoped: different pixel sizes are different cache entries', () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'thumb-size' });
    expect(townMapThumbCacheKey(s, 128)).not.toBe(townMapThumbCacheKey(s, 96));
  });

  it('INVALIDATES when the owner re-rolls the cosmetic layout (mapEdits)', () => {
    const base = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'thumb-edit' });
    const rerolled = { ...base, mapEdits: { layoutVariant: 3 } };
    const kBase = townMapThumbCacheKey(base, 128);
    const kReroll = townMapThumbCacheKey(rerolled, 128);
    expect(kBase).toBeTruthy();
    expect(kReroll).toBeTruthy();
    expect(kReroll).not.toBe(kBase);
  });

  it('INVALIDATES when the roster changes (a new institution shifts the geometry)', () => {
    const base = makeTownFixture({ tier: 'town', terrain: 'hills', walls: false, water: false, seed: 'thumb-roster' });
    const grown = { ...base, institutions: [...base.institutions, { name: 'A New Bank', priorityCategory: 'economy', localUid: 'uid-new' }] };
    expect(townMapThumbCacheKey(grown, 128)).not.toBe(townMapThumbCacheKey(base, 128));
  });

  it('HONORS + INVALIDATES on the chosen map lens (MAP STYLES styleLens)', () => {
    const base = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'thumb-lens' });
    const vtt = { ...base, mapEdits: { styleLens: 'vtt' } };
    const dark = { ...base, mapEdits: { styleLens: 'darkFantasy' } };
    const kBase = townMapThumbCacheKey(base, 128);   // parchment (default)
    expect(townMapThumbCacheKey(vtt, 128)).not.toBe(kBase);
    expect(townMapThumbCacheKey(dark, 128)).not.toBe(kBase);
    expect(townMapThumbCacheKey(vtt, 128)).not.toBe(townMapThumbCacheKey(dark, 128));
    // the key names the lens (legible identity)
    expect(townMapThumbCacheKey(vtt, 128)).toContain('|vtt|');
  });
});

describe('townMapThumb — VTT token-resolution raster (the VTT functional export)', () => {
  it('token size is cells × tokenPx (20 × 70 = 1400, square)', () => {
    expect(tokenRasterSize()).toBe(1400);
  });

  it('renders a PNG at token resolution under the VTT lens (injected rasterizer)', async () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'token-export' });
    let seen = null;
    const fakeRaster = async (svg, size, quality, mime) => { seen = { size, mime, hasGrid: /stroke-width="0.75"/.test(svg) }; return 'data:image/png;base64,FAKE'; };
    const out = await renderTownMapTokenRaster(s, { rasterize: fakeRaster });
    expect(out).toEqual({ dataUrl: 'data:image/png;base64,FAKE', size: 1400 });
    expect(seen.size).toBe(1400);
    expect(seen.mime).toBe('image/png');   // crisp lines, not JPEG
    expect(seen.hasGrid).toBe(true);        // the VTT grid is present in the export
  });

  it('returns null for a map-less settlement', async () => {
    let calls = 0;
    const out = await renderTownMapTokenRaster({ institutions: [], spatialLayout: { quarters: [] } }, { rasterize: async () => { calls++; return 'x'; } });
    expect(out).toBe(null);
    expect(calls).toBe(0);
  });
});

describe('townMapThumb — render + cache behavior (injected rasterizer)', () => {
  it('caches: a second render of the same content does NOT re-rasterize', async () => {
    const s = makeTownFixture({ tier: 'metropolis', terrain: 'coastal', walls: true, water: true, seed: 'thumb-cache' });
    let calls = 0;
    const fakeRaster = async () => { calls++; return `data:image/jpeg;base64,FAKE${calls}`; };

    const a = await renderTownMapThumb(s, { size: 128, rasterize: fakeRaster });
    const b = await renderTownMapThumb(s, { size: 128, rasterize: fakeRaster });
    expect(calls).toBe(1);          // rasterized once
    expect(a).toBe(b);              // same cached data URL
    expect(a).toBe('data:image/jpeg;base64,FAKE1');
    expect(_thumbCacheSize()).toBe(1);
  });

  it('re-rasterizes after an edit changes the geometry', async () => {
    const base = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'thumb-cache-2' });
    const rerolled = { ...base, mapEdits: { layoutVariant: 5 } };
    let calls = 0;
    const fakeRaster = async () => { calls++; return `data:image/jpeg;base64,FAKE${calls}`; };

    await renderTownMapThumb(base, { rasterize: fakeRaster });
    await renderTownMapThumb(rerolled, { rasterize: fakeRaster });
    expect(calls).toBe(2);          // distinct content ⇒ two rasters
    expect(_thumbCacheSize()).toBe(2);
  });

  it('returns null (and never rasterizes) for a map-less settlement', async () => {
    let calls = 0;
    const fakeRaster = async () => { calls++; return 'x'; };
    const out = await renderTownMapThumb({ institutions: [], spatialLayout: { quarters: [] } }, { rasterize: fakeRaster });
    expect(out).toBe(null);
    expect(calls).toBe(0);
  });
});
