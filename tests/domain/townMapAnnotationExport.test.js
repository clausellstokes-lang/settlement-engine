/**
 * townMapAnnotationExport.test.js — SM-5 (5) DM markers ride the export (WYSIWYG).
 *
 * Pins: annotationDrawOps filters by export audience (a player handout omits DM-only
 * markers); the standalone export SVG carries the markers; and — the dormancy law —
 * a map with NO annotations exports byte-identically to before (the draw golden is
 * never perturbed, because markers APPEND to the list, never modify buildTownMapDrawList).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapSvg, buildTownMapDrawList, annotationDrawOps } from '../../src/domain/townMap/townMapDraw.js';
import { townMapExportSvg } from '../../src/lib/townMapExport.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const ANNOTATIONS = [
  { x: 300, y: 300, label: 'Ambush', audience: 'dm' },
  { x: 600, y: 600, label: 'The inn', audience: 'player' },
];

describe('annotationDrawOps — the audience visibility split', () => {
  it('a player handout shows ONLY player-visible markers; a DM export shows all', () => {
    const dmOps = annotationDrawOps(ANNOTATIONS, 'dm');
    const playerOps = annotationDrawOps(ANNOTATIONS, 'player');
    // two markers × two ops each for dm; one marker × two ops for player
    expect(dmOps.length).toBe(4);
    expect(playerOps.length).toBe(2);
    for (const op of [...dmOps, ...playerOps]) expect(op.t).toBe('circle');
  });

  it('is dormant: no annotations ⇒ no ops', () => {
    expect(annotationDrawOps([], 'dm')).toEqual([]);
    expect(annotationDrawOps(null, 'player')).toEqual([]);
  });

  it('never touches buildTownMapDrawList (the golden path is untouched)', () => {
    const model = buildTownMapModel(makeTownFixture({ tier: 'town', terrain: 'plains', seed: 'ann-exp' }));
    const a = JSON.stringify(buildTownMapDrawList(model, 'parchment'));
    annotationDrawOps(ANNOTATIONS, 'dm', 'parchment'); // side-effect-free
    expect(JSON.stringify(buildTownMapDrawList(model, 'parchment'))).toBe(a);
  });
});

describe('townMapExportSvg — markers ride the export', () => {
  const base = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'exp-ann' });

  it('a map with NO annotations exports byte-identically to the base SVG (dormancy)', () => {
    const model = buildTownMapModel(base, null);
    const direct = buildTownMapSvg(model, { style: 'parchment', width: 1024, height: 1024 });
    const exported = townMapExportSvg(base, { style: 'parchment', resolution: 1024 });
    expect(exported).toBe(direct);
  });

  it('a v2 map WITH annotations exports the markers, audience-filtered', () => {
    const withPins = { ...base, mapEdits: { layoutLawVersion: 2, annotations: ANNOTATIONS } };
    const dm = townMapExportSvg(withPins, { style: 'parchment', resolution: 1024, audience: 'dm' });
    const player = townMapExportSvg(withPins, { style: 'parchment', resolution: 1024, audience: 'player' });
    const bare = townMapExportSvg({ ...base, mapEdits: { layoutLawVersion: 2 } }, { style: 'parchment', resolution: 1024 });
    // markers add circles ⇒ the DM export is longer than the player export is longer than bare
    expect(dm.length).toBeGreaterThan(player.length);
    expect(player.length).toBeGreaterThan(bare.length);
    // still a valid self-contained SVG
    expect(dm.startsWith('<svg')).toBe(true);
    expect(/<image\b/i.test(dm)).toBe(false);
  });
});
