/**
 * W2-FIX-DATA-4 (2026-11-13), round two on the data lane's own files: the medium lines of the cold list REVIEW-W2A-3
 * (twenty fresh towns read cold at 817980b33, `docs/chair/2026-11-13/REVIEW-W2A-3-COLD-LIST.json` on
 * lane/review-w2a-2026-11-12) that no seat had touched, each reproduced false at 34520a697 in the app's configuration
 * shape (the reviewer's: DEFAULT_CONFIG, the stress panel with Random off, `_randomizePriorities`), one arm per cause.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the place it is
 * true in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** A REVIEW-W2A-3 town in the app's shape (its seed names its size and the crises chosen in the panel). */
const bornRw3 = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+?)-(.+)-(\d+)$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** A town of the second-wave census's corpus (`r2r-<size>-<i>`: every dial random), as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-(\d+)$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
};
const servicesOf = (/** @type {any} */ s) => /** @type {any[]} */ (Object.values(s.availableServices || {}).flat());

describe('W2-FIX-DATA-4: round two\'s medium lines in this lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  test('a coastal port with no river: its boatyard and ferry speak of the water, not the river (#502, #507, #508; rw3-village-famine-1)', () => {
    const town = bornRw3('rw3-village-famine-1');
    expect([town.config.terrainType, town.config.tradeRouteAccess]).toEqual(['coastal', 'port']);
    const houses = town.institutions.filter((/** @type {any} */ i) => /^River (boatyard|ferry)$/.test(i.name));
    expect(houses.length, 'the village keeps both houses').toBe(2);
    const rows = servicesOf(town).filter((v) => /^River (boatyard|ferry)$/.test(v.institution));
    expect(rows.map((v) => v.name).sort(), 'no service leaves the list').toEqual(['Barge construction', 'River crossing']);
    const printed = [...houses.map((/** @type {any} */ i) => String(i.desc)), ...rows.map((v) => String(v.desc))];
    expect(printed.filter((t) => /\briver\b/i.test(t))).toEqual([]);
    expect(printed.join('\n')).toContain('across the water');
    // the river town keeps its river lines (r2r-village-13: riverside, a road)
    const riverTown = bornCensus('r2r-village-13');
    const riverRows = servicesOf(riverTown).filter((v) => /^River (boatyard|ferry)$/.test(v.institution)).map((v) => String(v.desc));
    expect(riverRows).toContain('Transport foot travelers and small goods across the river.');
    expect(riverRows).toContain('Flat-bottomed cargo barges for river transport. Simpler than sea vessels.');
  }, 60_000);
});
