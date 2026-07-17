/**
 * tests/design/townMapStyleWall.test.js — THE WALL for bespoke AI styles
 * (Surveyor style-overhaul, DESIGN_CONTENT_PLANE §7). The safety invariant: a bespoke style
 * may only SELECT from fixed renderer capabilities — worst case ugly, never unsafe.
 *
 *   PIN 1 (SELECT-ONLY): valid hex/number/enum/furniture/glyph fields override; invalid values
 *     fall back to the parchment default and are listed as violations (never undefined).
 *   PIN 2 (DROP ARBITRARY): an unknown top-level field, an unknown role, or arbitrary SVG/code
 *     is DROPPED and listed — a style can carry no code path.
 *   PIN 3 (TRUTH-PROJECTION BY CONSTRUCTION): a style carries ONLY visual attributes — a
 *     geometry/substance field (buildings, extra districts, coordinates) is not a style field
 *     and never survives, so a style can never paint what the dossier doesn't hold.
 *   PIN 4 (RESOLVED + RENDERABLE): the result is __resolved:true, so resolveTownMapStyle passes
 *     it through and the existing renderer draws it with no code change.
 */
import { describe, it, expect } from 'vitest';
import { validateBespokeStyle, buildStyleVocabulary } from '../../src/design/townMapStyleWall.js';
import { resolveTownMapStyle, DEFAULT_STYLE_ID } from '../../src/design/townMapStyles.js';

const HEX = /^#[0-9a-fA-F]{3,8}$/;

describe('townMapStyleWall — select-only (PIN 1)', () => {
  it('keeps valid fields, falls back invalid ones to parchment, lists violations', () => {
    const { ok, style, violations } = validateBespokeStyle({
      label: 'Neon Noir',
      background: '#0a0a12',              // valid hex → kept
      contrast: 'high',                  // valid enum → kept
      palette: { water: '#00e5ff', ink: 'not-a-hex' }, // water kept; ink invalid → default + violation
      stroke: { river: 6, roadBase: -5 }, // river kept; roadBase out of range → default + violation
      hazardGlyph: 'diamond',            // valid → kept
      rasterScale: 999,                  // out of range → default + violation
    }, { id: 'bespoke:test' });
    expect(ok).toBe(true);
    const base = resolveTownMapStyle(DEFAULT_STYLE_ID);
    expect(style.background).toBe('#0a0a12');
    expect(style.contrast).toBe('high');
    expect(style.palette.water).toBe('#00e5ff');
    expect(style.palette.ink).toBe(base.palette.ink);        // invalid fell back
    expect(style.stroke.river).toBe(6);
    expect(style.stroke.roadBase).toBe(base.stroke.roadBase); // out-of-range fell back
    expect(style.rasterScale).toBe(base.rasterScale);         // out-of-range fell back
    const fields = violations.map((v) => v.field);
    expect(fields).toContain('palette.ink');
    expect(fields).toContain('stroke.roadBase');
    expect(fields).toContain('rasterScale');
    // no field is ever undefined (worst case ugly, never broken)
    for (const v of Object.values(style.palette)) expect(v).toMatch(HEX);
    for (const v of Object.values(style.stroke)) expect(typeof v).toBe('number');
  });
});

describe('townMapStyleWall — drop arbitrary + truth-projection (PIN 2/3)', () => {
  it('drops an arbitrary top-level field, an unknown role, and any SVG/code — always listed', () => {
    const { style, violations } = validateBespokeStyle({
      background: '#111111',
      svg: '<script>alert(1)</script>',         // arbitrary code → dropped
      onload: 'doEvil()',                        // arbitrary → dropped
      palette: { water: '#222222', voidGlow: '#ff00ff' }, // voidGlow unknown role → dropped
    });
    expect(style.svg).toBeUndefined();
    expect(style.onload).toBeUndefined();
    expect(style.palette.voidGlow).toBeUndefined();
    const fields = violations.map((v) => v.field);
    expect(fields).toContain('svg');
    expect(fields).toContain('onload');
    expect(fields).toContain('palette.voidGlow');
    // the resolved style is pure data — no function/code anywhere
    expect(JSON.stringify(style)).not.toContain('script');
    expect(JSON.stringify(style)).not.toContain('doEvil');
  });

  it('a geometry/substance field (buildings, extra districts, coordinates) never survives', () => {
    const { style } = validateBespokeStyle({
      background: '#333333',
      buildings: [{ x: 10, y: 20 }],            // substance — not a style field
      extraDistrict: 'floating_market',          // substance
      coordinates: { cx: 5, cy: 5 },             // geometry
    });
    expect(style.buildings).toBeUndefined();
    expect(style.extraDistrict).toBeUndefined();
    expect(style.coordinates).toBeUndefined();
    // the style shape is exactly the resolved TownMapStyle shape (visual only)
    expect(Object.keys(style).sort()).toEqual(
      ['__resolved', 'anchorGlyph', 'background', 'contrast', 'district', 'furniture', 'functional', 'hazardGlyph', 'id', 'label', 'opacity', 'palette', 'rasterScale', 'stroke'].sort(),
    );
  });
});

describe('townMapStyleWall — resolved + renderable (PIN 4)', () => {
  it('the result is __resolved and passes through resolveTownMapStyle unchanged', () => {
    const { style } = validateBespokeStyle({ background: '#0a0a12', label: 'Test' });
    expect(style.__resolved).toBe(true);
    expect(resolveTownMapStyle(style)).toBe(style);          // pass-through (same reference)
  });

  it('an empty candidate resolves to a full, valid parchment-based style (all defaults)', () => {
    const { ok, style, violations } = validateBespokeStyle({});
    expect(ok).toBe(true);
    expect(violations).toEqual([]);
    const base = resolveTownMapStyle(DEFAULT_STYLE_ID);
    expect(style.palette).toEqual(base.palette);
    expect(style.stroke).toEqual(base.stroke);
  });
});

describe('townMapStyleWall — the design corpus descriptor', () => {
  it('buildStyleVocabulary enumerates the fixed vocabularies + the real role keys', () => {
    const v = buildStyleVocabulary();
    expect(v.furniture).toContain('compass');
    expect(v.hazardGlyphs).toEqual(['triangle', 'diamond', 'pin']);
    expect(v.contrast).toEqual(['soft', 'normal', 'high']);
    expect(v.baseLenses).toEqual(['parchment', 'watercolor', 'darkFantasy', 'vtt']);
    expect(v.roles.palette).toContain('water');
    expect(v.roles.stroke).toContain('river');
    expect(v.roles.opacity).toContain('waterFill');
  });
});
