/**
 * townMapChangeView.test.js — SM-5 (2) THE CHANGE VIEW (the chronicle's spatial twin).
 *
 * Pins: a lit urban-fabric mirror + calamityHistory produce rebuilt/scar/calamity
 * rows (newest/worst-first); the rebuilt CLASSES surface for the map highlight;
 * calamities mirror the dossier read model; and — the empty-when-dark contract — a
 * settlement with no fabric and no calamity yields hasAny:false (⇒ the caller
 * whispers). No fabricated deltas.
 */
import { describe, expect, it } from 'vitest';

import { buildChangeView } from '../../src/domain/townMap/changeView.js';
import { makeTownFixture, makeFabricMirror } from '../fixtures/townMapFixtures.js';

const CALAMITY = {
  type: 'plague', name: 'The Great Sickness of 38', year: 38, tick: 200,
  deaths: 120, exodus: 40, k: 2, targets: ['temple', 'market'],
};

const litSettlement = () => ({
  ...makeTownFixture({ tier: 'city', terrain: 'hills', walls: true, water: false, seed: 'cv-lit' }),
  urbanFabric: makeFabricMirror(),
  calamityHistory: [CALAMITY],
});
const darkSettlement = () => makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'cv-dark' });

describe('change view — lit fabric + calamities', () => {
  it('reports rebuilt blocks, scars (worst-first), and recent calamities', () => {
    const cv = buildChangeView(litSettlement());
    expect(cv.hasFabric).toBe(true);
    expect(cv.hasAny).toBe(true);

    // rebuilt: the residential quarter, after fire
    expect(cv.rebuilt.length).toBe(1);
    expect(cv.rebuilt[0].label).toMatch(/Residential/);
    expect(cv.rebuilt[0].detail).toMatch(/rebuilt after fire/);
    expect(cv.rebuiltClasses).toEqual(['residential']); // for the on-map dashed cue

    // scars: fire (0.7 severe) worst-first, then siege (0.4 heavy)
    expect(cv.scars.map((s) => s.label)).toEqual(['Fire damage', 'Siege damage']);
    expect(cv.scars[0].detail).toMatch(/severe/);
    expect(cv.scars[1].detail).toMatch(/heavy/);

    // calamities: mirror the dossier read model (flavor + real numbers, not invented)
    expect(cv.calamities.length).toBe(1);
    expect(cv.calamities[0].detail).toMatch(/year 38/);
    expect(cv.calamities[0].detail).toMatch(/120 dead/);
  });
});

describe('change view — empty-when-dark contract', () => {
  it('a settlement with no fabric and no calamity yields hasAny:false, all empty', () => {
    const cv = buildChangeView(darkSettlement());
    expect(cv.hasFabric).toBe(false);
    expect(cv.hasAny).toBe(false);
    expect(cv.rebuilt).toEqual([]);
    expect(cv.scars).toEqual([]);
    expect(cv.calamities).toEqual([]);
    expect(cv.rebuiltClasses).toEqual([]);
  });

  it('null / garbage never throws', () => {
    for (const bad of [null, undefined, 42, 'x']) {
      const cv = buildChangeView(/** @type {any} */ (bad));
      expect(cv.hasAny).toBe(false);
    }
  });

  it('calamityHistory WITHOUT fabric still counts as a change (hasAny true, hasFabric false)', () => {
    const cv = buildChangeView({ ...darkSettlement(), calamityHistory: [CALAMITY] });
    expect(cv.hasFabric).toBe(false);
    expect(cv.hasAny).toBe(true);
    expect(cv.calamities.length).toBe(1);
  });
});
