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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
/** A ROUND-3 town (REVIEW-R2-STAGES, `rr2s-<size>-<calm|crises>-<rand|route>-<i>`), as its renderer births it. */
const bornRr2s = (/** @type {string} */ seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+?)-([a-z_+]+)-([a-z_]+)-(\d+)$/));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
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

  test('a stone quarry is named for what it is, never as worked now: true where the quarry is worked out (#236, #421, HIGH)', async () => {
    const { INSTITUTION_DESC_VARIANTS } = await import('../../src/data/institutionDescVariants.js');
    const { readFileSync } = await import('node:fs');
    const catalogue = readFileSync(new URL('../../src/data/institutionalCatalog.js', import.meta.url), 'utf8');
    const entry = catalogue.slice(catalogue.indexOf("name: 'Stone quarry'"), catalogue.indexOf('    {', catalogue.indexOf("name: 'Stone quarry'")));
    const STATE = /\bworking face\b|\bA working quarry\b|\bwork it\b|\bcrew of masons\b|\bsupplies walls\b|\bBuilds the walls\b|\bCuts and dresses\b|\bcut and dress the stone\b|\bmethodical winning\b|\bstone cut in an ordered working\b|\bSystematic extraction\b/;
    const texts = [...new Set([
      ...Object.entries(INSTITUTION_DESC_VARIANTS).filter(([k]) => k.endsWith('|Stone quarry')).flatMap(([, v]) => v),
      ...(entry.match(/desc: (['"])(?:\\.|(?!\1).)*\1/g) ?? []),
    ])];
    expect(texts.length, 'three catalogue texts and the six variants').toBe(9);
    expect(texts.filter((t) => STATE.test(String(t)))).toEqual([]);
    expectNoSeedFailures(collectSeedFailures(['rw3-metropolis-calm-1', 'rw3-metropolis-under_siege-1'], (seed) => {
      const town = bornRw3(seed);
      expect(town.config.nearbyResourcesDepleted, seed).toContain('stone_quarry');
      const quarry = town.institutions.find((/** @type {any} */ i) => i.name === 'Stone quarry');
      expect(quarry, seed).toBeTruthy();
      expect(String(quarry.desc), seed).not.toMatch(STATE);
      expect(String(quarry.desc), seed).toMatch(/quarry/i);
    }), 'every worked-out quarry town names its quarry for what it is');
  }, 60_000);

  test('a house the cascade adds meets the declared draw: no customs "via the port" with no docks, no river craft with no river (F2; #502)', () => {
    const roadTown = bornCensus('r2r-town-8');
    const customs = roadTown.institutions.find((/** @type {any} */ i) => i.name === 'Customs house');
    expect(customs?.source, 'the cascade added it').toBe('cascade');
    expect(roadTown.institutions.some((/** @type {any} */ i) => /\bdocks?\b|wharf|harbour/i.test(i.name)), 'no docks').toBe(false);
    expect(String(customs.desc)).not.toMatch(/\bport\b|harbour/i);
    expect(String(customs.desc)).toMatch(/main roads/);
    const coastTown = bornCensus('r2r-village-11');
    const yard = coastTown.institutions.find((/** @type {any} */ i) => i.name === 'River boatyard');
    expect(yard?.source, 'the cascade added it').toBe('cascade');
    expect([coastTown.config.terrainType, coastTown.config.tradeRouteAccess]).toEqual(['coastal', 'port']);
    expect(String(yard.desc)).not.toMatch(/\briver\b/i);
  }, 60_000);

  test('the arrival holds the culture\'s materialized detail to its own declaration (#183; ROUND-3 HIGH #87 #112 #117)', () => {
    // RE-KEYED BY CAUSE (W2-FIX-DATA-HISTORY item D): the slavic "palisade lines ... successive stages of expansion" now
    // declares its size (tier: ≥ town), so the two small rr2s towns MATERIALIZE its small-place twin instead (the
    // materializer's own door): the false line is held out one step earlier, and the arrival still prints neither it nor
    // nothing. The bathhouse row (rw3-hamlet-calm-1) still proves the arrival's own hold on a materialized detail.
    for (const [seed, gone, materialized] of [
      ['rr2s-thorp-calm-port-1', 'Palisade lines and river stairs', 'painted gables and fenced garden plots face the lane'],
      ['rr2s-hamlet-calm-rand-1', 'Palisade lines and river stairs', 'painted gables and fenced garden plots face the lane'],
      ['rw3-hamlet-calm-1', 'A communal green, bathhouse, and well', 'A communal green, bathhouse, and well'],
    ]) {
      const town = seed.startsWith('rr2s-') ? bornRr2s(seed) : bornRw3(seed);
      expect(String(town.culturalIdentity?.architecturalDetail).toLowerCase(), `${seed}: the materialized detail`).toContain(materialized.toLowerCase());
      expect(String(town.arrivalScene), seed).not.toContain(gone);
      expect(String(town.arrivalScene), seed).toMatch(/\S/);
    }
  }, 60_000);

  test('a sense line that fills the place needs the house it names: bells a church in a town, the arms trade a smith (ROUND-3 HIGH #46 #600; REVIEW-W2A-3 #184)', () => {
    const thorp = bornRr2s('rr2s-thorp-famine-rand-1');
    expect(String(thorp.arrivalScene)).not.toMatch(/answer one another across the roofs/);
    const town = bornRr2s('rr2s-town-indebted-port-1');
    expect(town.institutions.some((/** @type {any} */ i) => /smith|forge/i.test(i.name)), 'no smith').toBe(false);
    expect(String(town.arrivalScene)).not.toMatch(/Every forge you pass/);
    const hamlet = bornRw3('rw3-hamlet-calm-1');
    expect(String(hamlet.arrivalScene)).not.toMatch(/most of it is the sound of blades being made/);
    expect(String(hamlet.arrivalScene)).toContain('A smith tests a new blade against a post');
  }, 60_000);

  test('the docks are described, never by the catalogue\'s condition for them (ROUND-3 HIGH #1343)', () => {
    const town = bornRr2s('rr2s-metropolis-plague_onset-port-1');
    const docks = town.institutions.find((/** @type {any} */ i) => i.name === 'Docks/port facilities');
    expect(docks, 'the port keeps its docks').toBeTruthy();
    expect(String(docks.desc)).not.toMatch(/^If |\bIf coastal\b/);
    expect(town.institutions.map((/** @type {any} */ i) => String(i.desc)).filter((d) => /If coastal or river access/.test(d))).toEqual([]);
  }, 60_000);
});
