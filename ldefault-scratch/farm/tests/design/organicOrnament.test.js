/**
 * tests/design/organicOrnament.test.js — THE SEEDED-ORNAMENT GOLDEN FAMILY
 * (Organic Craft law §5/§8).
 *
 * The committed docs/samples/organic-craft/ornament/*.svg are a byte-stable
 * taste-veto artifact: the builders are pure functions of (seed, palette), so a
 * fresh render must byte-match the committed files. A DELIBERATE library change
 * reds this and is re-minted WITH a stated cause via
 * `node scripts/gen-organic-ornament.mjs`. This is the wave's NEW golden family —
 * component-library changes are DECLARED golden shifts.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { ornamentSamples, ORNAMENT_DIR, POOL_SIZES, CARTOUCHE_SEEDS } from '../../scripts/gen-organic-ornament.mjs';
import { emblem, cartouche, compassRose } from '../../src/design/organic/ornament/compose.js';
import { EMBLEMS, CORNER_PIECES, CARTOUCHE_FRAMES } from '../../src/design/organic/ornament/pools.js';

describe('seeded ornament — the golden family (byte-stable)', () => {
  const samples = ornamentSamples();

  it('covers the whole library (every emblem kind + seeded cartouches + the rose)', () => {
    for (const e of EMBLEMS) expect(Object.keys(samples)).toContain(`emblem-${e.kind}.svg`);
    for (const seed of CARTOUCHE_SEEDS) expect(Object.keys(samples).some((k) => k.startsWith('cartouche-'))).toBe(true);
    expect(Object.keys(samples)).toContain('compass-rose.svg');
    // The library has real, small vetted pools (constrained composition).
    expect(POOL_SIZES.emblems).toBeGreaterThanOrEqual(6);
    expect(POOL_SIZES.corners).toBeGreaterThanOrEqual(3);
    expect(POOL_SIZES.frames).toBeGreaterThanOrEqual(3);
  });

  it('the committed samples are byte-identical to a fresh render (drift guard)', () => {
    for (const [name, svg] of Object.entries(samples)) {
      const file = resolve(ORNAMENT_DIR, name);
      expect(existsSync(file), `${name} missing — run: node scripts/gen-organic-ornament.mjs`).toBe(true);
      expect(readFileSync(file, 'utf-8'), `${name} is stale — run: node scripts/gen-organic-ornament.mjs`).toBe(`${svg}\n`);
    }
  });

  it('the vetted POOLS are internally distinct (no accidental duplicate in the library)', () => {
    // The invariant is that the authored library has no dupes — NOT that every
    // seeded composition is unique (two settlements sharing a frame is legitimate;
    // "whimsy unrepeated" is about not repeating a quirk AS a system, which the
    // per-corner mirroring and the independent device slot honour).
    const draw = (arr) => arr.map((x) => (x.draw ? x.draw({ line: 'a', strong: 'b', faint: 'c', rubric: 'd', entry: 'e' }, 100, 40) : x));
    for (const pool of [EMBLEMS, CORNER_PIECES, CARTOUCHE_FRAMES]) {
      const rendered = draw(pool);
      expect(new Set(rendered).size).toBe(rendered.length);
    }
  });

  it('every sample is a self-contained, DECORATIVE svg (§5/§8)', () => {
    const svgs = Object.values(samples);
    for (const svg of svgs) {
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).toContain('aria-hidden="true"');
      expect(svg).toContain('role="presentation"');
      expect(svg).toContain('focusable="false"');
      // §8: pre-baked only — no raster, no runtime filter/turbulence, no blend.
      expect(/<image\b|feturbulence|fedisplacement|filter=|mix-blend/i.test(svg)).toBe(false);
    }
  });
});

describe('seeded ornament — determinism + provenance', () => {
  it('same seed ⇒ byte-identical ornament', () => {
    expect(emblem('Thornwall')).toBe(emblem('Thornwall'));
    expect(cartouche('Redwater Ford')).toBe(cartouche('Redwater Ford'));
  });

  it('different seeds produce different composition (per-settlement uniqueness)', () => {
    const a = cartouche('Thornwall');
    const b = cartouche('Ashen Reach');
    // At least one seeded slot (frame/corner) differs across these two seeds.
    expect(a).not.toBe(b);
  });

  it('the house compass rose is ONE canonical design (not seeded)', () => {
    expect(compassRose()).toBe(compassRose());
  });

  it('field mode recolours ornament for the dark ground (the dim palette applies)', () => {
    expect(emblem('Thornwall', { mode: 'field' })).not.toBe(emblem('Thornwall', { mode: 'light' }));
  });
});
