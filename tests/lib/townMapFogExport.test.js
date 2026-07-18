/**
 * tests/lib/townMapFogExport.test.js — DOOR 2 the FOGGED HANDOUT export pins.
 *
 * The mask applied through the EXISTING export matrix (WYSIWYG law extends to the mask):
 *   • the UNFOGGED export stays BYTE-IDENTICAL to pre-fog (fogReveal absent ⇒ no-op);
 *   • the fogged handout overlays the mask + drops DM-only markers (audience:'player');
 *   • the fog color tracks the active lens (parchment vs accessible differ).
 */
import { describe, expect, it } from 'vitest';
import { buildTownMapModel, allRevealIds, readMapEdits, viewerPalette } from '../../src/domain/townMap/index.js';
import { buildTownMapSvg } from '../../src/domain/townMap/townMapDraw.js';
import { townMapExportSvg } from '../../src/lib/townMapExport.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const ANNOTATIONS = [
  { x: 300, y: 300, label: 'Ambush', audience: 'dm' },
  { x: 600, y: 600, label: 'The inn', audience: 'player' },
];

// A v2 city so there are districts/buildings/streets to reveal.
const baseV2 = { ...makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'fog-exp' }), mapEdits: { layoutLawVersion: 2 } };
const model = buildTownMapModel(baseV2, readMapEdits(baseV2));
const all = allRevealIds(model);
// A partial reveal: the first district only (so the mask has both holes AND fog).
const reveal = { districts: all.districts.slice(0, 1) };

describe('the UNFOGGED export stays byte-identical (fogReveal absent ⇒ no-op)', () => {
  it('no fogReveal ⇒ identical to the base build, with no fog layer', () => {
    const direct = buildTownMapSvg(model, { style: 'parchment', width: 1024, height: 1024 });
    const noFog = townMapExportSvg(baseV2, { style: 'parchment', resolution: 1024 });
    expect(noFog).toBe(direct);
    expect(noFog).not.toContain('data-town-fog');
    // an explicit null / undefined fogReveal is the same no-op path
    expect(townMapExportSvg(baseV2, { style: 'parchment', resolution: 1024, fogReveal: null })).toBe(direct);
  });

  it('adding annotations but no fog is still byte-identical to the annotated (non-fog) export', () => {
    const withPins = { ...baseV2, mapEdits: { layoutLawVersion: 2, annotations: ANNOTATIONS } };
    const a = townMapExportSvg(withPins, { style: 'parchment', resolution: 1024, audience: 'dm' });
    const b = townMapExportSvg(withPins, { style: 'parchment', resolution: 1024, audience: 'dm', fogReveal: null });
    expect(a).toBe(b);
    expect(a).not.toContain('data-town-fog');
  });
});

describe('the FOGGED handout overlays the mask through the existing matrix', () => {
  it('a reveal set injects a fog <g>/<mask> and is longer than the unfogged export', () => {
    const unfogged = townMapExportSvg(baseV2, { style: 'parchment', resolution: 1024 });
    const fogged = townMapExportSvg(baseV2, { style: 'parchment', resolution: 1024, audience: 'player', fogReveal: reveal });
    expect(fogged).toContain('data-town-fog');
    expect(fogged).toContain('<mask id="sf-fog"');
    expect(fogged.length).toBeGreaterThan(unfogged.length);
    expect(fogged.startsWith('<svg')).toBe(true);
    // the base body is preserved verbatim (append-only): the unfogged SVG minus its closing
    // tag is a prefix-region of the fogged one (the fog is spliced before </svg>).
    expect(fogged).toContain(unfogged.slice(0, unfogged.lastIndexOf('</svg>')));
  });

  it('the handout drops DM-only markers (audience:player) while a DM fogged export keeps all', () => {
    const withPins = { ...baseV2, mapEdits: { layoutLawVersion: 2, annotations: ANNOTATIONS } };
    const handout = townMapExportSvg(withPins, { style: 'parchment', resolution: 1024, audience: 'player', fogReveal: reveal });
    const dmFogged = townMapExportSvg(withPins, { style: 'parchment', resolution: 1024, audience: 'dm', fogReveal: reveal });
    // both carry the fog; the DM export carries the extra DM-only marker ⇒ longer
    expect(handout).toContain('data-town-fog');
    expect(dmFogged.length).toBeGreaterThan(handout.length);
    // STRUCTURAL two-audience pin: the DM-only marker's pin glyph (a circle at its exact
    // coordinates) is ABSENT from the player handout and PRESENT in the DM export; the
    // player-visible marker renders in BOTH. (annotationDrawOps emits r=7 pin circles.)
    expect(dmFogged).toContain('cx="300" cy="300" r="7"');       // DM-only pin — DM sees it
    expect(handout).not.toContain('cx="300" cy="300"');           // …the players never do
    expect(handout).toContain('cx="600" cy="600" r="7"');         // player pin — shown to both
    expect(dmFogged).toContain('cx="600" cy="600" r="7"');
  });

  it('the PLAYER VIEW projection (the FogPlayerView contract: audience player + opaque mask) masks both', () => {
    // FogPlayerView renders EXACTLY this projection (style, audience:'player', fogOpacity:1),
    // so this pins the live shared-screen view ≡ the fogged handout structure (WYSIWYG).
    const withPins = { ...baseV2, mapEdits: { layoutLawVersion: 2, annotations: ANNOTATIONS } };
    const view = townMapExportSvg(withPins, { style: 'parchment', resolution: 1000, audience: 'player', fogReveal: reveal, fogOpacity: 1 });
    expect(view).toContain('data-town-fog');                      // unrevealed areas masked
    expect(view).toContain('fill-opacity="1" mask="url(#sf-fog)"'); // fully opaque for players
    expect(view).not.toContain('cx="300" cy="300"');              // DM-only pin masked out
    expect(view).toContain('cx="600" cy="600" r="7"');            // player pin visible
  });

  it('the fog color tracks the active lens (parchment vs accessible differ)', () => {
    const parch = townMapExportSvg(baseV2, { style: 'parchment', resolution: 1024, fogReveal: reveal });
    const access = townMapExportSvg(baseV2, { style: 'accessible', resolution: 1024, fogReveal: reveal });
    expect(parch).toContain(`fill="${viewerPalette('parchment').ink}" fill-opacity=`);
    expect(access).toContain(`fill="${viewerPalette('accessible').ink}" fill-opacity=`);
    expect(viewerPalette('parchment').ink).not.toBe(viewerPalette('accessible').ink); // lenses really differ
    // both are valid self-contained SVGs (rasterizable — no external refs)
    expect(/<image\b/i.test(access)).toBe(false);
  });
});
