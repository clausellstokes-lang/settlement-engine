/**
 * atlasSamples.test.js — SM-5 (4) THE ATLAS IDENTITY craft samples freshness.
 *
 * The committed docs/samples/atlas/*.svg are a byte-stable taste-veto artifact: one
 * representative v2 settlement under every town-map lens (the "one atlas" comparison,
 * including the new accessibility lens). Because buildTownMapSvg is pure, a fresh
 * render must byte-match the committed files — a DELIBERATE lens/craft change reds this
 * and is re-minted with a stated cause via `node scripts/gen-atlas-samples.mjs`.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { atlasSamples, ATLAS_DIR } from '../../scripts/gen-atlas-samples.mjs';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';

describe('atlas craft samples — freshness (drift guard)', () => {
  const samples = atlasSamples();

  it('covers every lens (the one-atlas set, incl. the accessibility lens)', () => {
    expect(Object.keys(samples).sort()).toEqual(TOWN_MAP_STYLE_IDS.map((l) => `atlas-${l}.svg`).sort());
    expect(Object.keys(samples)).toContain('atlas-accessible.svg');
  });

  it('the committed samples are byte-identical to a fresh render', () => {
    for (const [name, svg] of Object.entries(samples)) {
      const file = resolve(ATLAS_DIR, name);
      expect(existsSync(file), `${name} missing — run: node scripts/gen-atlas-samples.mjs`).toBe(true);
      expect(readFileSync(file, 'utf-8'), `${name} is stale — run: node scripts/gen-atlas-samples.mjs`).toBe(`${svg}\n`);
    }
  });

  it('every lens sample is a distinct, self-contained SVG (a real atlas of skins)', () => {
    const svgs = Object.values(samples);
    expect(new Set(svgs).size).toBe(svgs.length); // all lenses render distinctly
    for (const svg of svgs) {
      expect(svg.startsWith('<svg')).toBe(true);
      expect(/<image\b/i.test(svg)).toBe(false); // canvas-taint-free
    }
  });
});
