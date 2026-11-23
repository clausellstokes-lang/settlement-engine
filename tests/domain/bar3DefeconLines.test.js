/**
 * bar3DefeconLines.test.js — BAR3-DEFECON batch 1 (REVIEW-BAR-3's and the wide read's DEFECON rows; the chair's prompt of
 * 2026-11-15, items 1, 2 and 4; vetoable by the owner). Each line is read against the town's own record:
 *   · C20212 C26238 "Everyone comes in by the gates, where the guard sees them." where a house moves goods beneath the walls
 *     (`safetyLineTruth.js :: beneathTheWalls`): its twin;
 *   · C55188 "keeps the guard exceptionally well-drilled" where no garrison or watch stands; C55187 the gate line's no-gate twin
 *     names no watcher;
 *   · C25320 "most are settled before they come to blows" where the safety label reads violence (`quarrelUnderViolence`);
 *   · C14930 the religious-fraud line's church and clergy where the place has only access to a neighbour's church;
 *   · C12387 "No single dominant organisation" beside the crime structure's one ring (`criminalStructureKeyOf`);
 *   · the theocratic-economy flag only where the tithes lead the income record and a religious power is Strong or Dominant;
 *   · C10009 C19458 the siege's "What is already in store is all there will be" where food is still grown or made by magic;
 *   · C20434 the siege's "cannot cover ~N lbs" counts no import a closed siege lets in.
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs: the r2r- and r2s- arms, and the readers' bar0- arm). Each NOT pair
 * is red at the batch's base (8b45191a5); each KEEP pair is green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
/** @param {unknown} text @returns {string[]} its sentences */
const sentences = (text) => String(text ?? '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
/** @param {any} t @param {'safetyDesc' | 'guardEffectivenessDesc'} field */
const safety = (t, field) => sentences(t.economicState?.safetyProfile?.[field]);
/** @param {any} t @returns {string[]} the viability's issue texts */
const issueTexts = (t) => (t.economicViability?.issues || []).map((/** @type {any} */ i) => String(i?.description ?? ''));
/** @param {any} t @returns {string[]} the crime types' lines */
const crimeLines = (t) => (t.economicState?.safetyProfile?.crimeTypes || []).map((/** @type {any} */ c) => String(c?.desc ?? ''));

const STORES = 'The siege has cut every road in, and the outlying farms are abandoned or burned. What is already in store is all there will be until it lifts.';
const GROWN = 'The siege has cut every road in, and the outlying farms are abandoned or burned. What is still grown here and what is already in store are all there will be until it lifts.';
const GROWN_MAGIC = 'The siege has cut every road in, and the outlying farms are abandoned or burned. What is still grown here, what magic makes, and what is already in store are all there will be until it lifts.';
const NO_DOMINANT = 'Petty theft, minor fraud, and opportunistic violence are persistent. No single dominant organisation';

/** @type {Array<{ seed: string, read: (t: any) => string[], not: string, instead: string, row: string }>} */
const NOT = [
  { row: 'C20212', seed: 'r2r-city-18', read: (t) => safety(t, 'safetyDesc'), not: 'Everyone comes in by the gates, where the guard sees them.', instead: 'The guard keeps the gates, but smugglers have ways in beneath the walls.' },
  { row: 'C26238', seed: 'r2r-metropolis-29', read: (t) => safety(t, 'safetyDesc'), not: 'Everyone comes in by the gates, where the guard sees them.', instead: 'The guard keeps the gates, but smugglers have ways in beneath the walls.' },
  { row: 'C55188', seed: 'r2r-hamlet-11', read: (t) => safety(t, 'safetyDesc'), not: 'The constant monster threat keeps the guard exceptionally well-drilled and alert.', instead: 'The constant monster threat keeps everyone here on their guard.' },
  { row: 'C55187', seed: 'r2r-village-6', read: (t) => safety(t, 'safetyDesc'), not: 'The walls leave few ways in, and the guard watches them.', instead: 'The walls leave few ways in.' },
  { row: 'C25320', seed: 'r2r-hamlet-19', read: (t) => safety(t, 'guardEffectivenessDesc'), not: 'A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.', instead: 'A quarrel goes to the heads of the oldest families, though many come to blows first.' },
  { row: 'C25320', seed: 'bar0-thorp-calm-rand-8', read: (t) => safety(t, 'guardEffectivenessDesc'), not: 'A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.', instead: 'A quarrel goes to the heads of the oldest families, though many come to blows first.' },
  { row: 'C14930', seed: 'bar0-hamlet-under_siege-rand-7', read: crimeLines, not: "The church's moral authority provides cover for sophisticated fraud. Fake relics, forged dispensations, and corrupt clergy who treat their position as a commercial opportunity.", instead: "Fake relics and forged dispensations are sold here in the faith's name, by people who treat it as a commercial opportunity." },
  { row: 'C10009', seed: 'r2r-thorp-45', read: issueTexts, not: STORES, instead: GROWN },
  { row: 'C19458', seed: 'r2r-village-21', read: issueTexts, not: STORES, instead: GROWN_MAGIC },
  { row: 'C20434', seed: 'r2s-under_siege-town-2', read: issueTexts, not: 'Settlement cannot cover ~1978 lbs of food per day (40% of needs) and has no dependable trade route.', instead: 'Settlement cannot cover ~2560 lbs of food per day (52% of needs) and has no dependable trade route.' },
];
/** KEEP: each cured line's true sibling, where the state that made it false is absent. */
const KEEP = [
  { seed: 'r2r-town-6', read: (/** @type {any} */ t) => safety(t, 'safetyDesc'), line: 'Everyone comes in by the gates, where the guard sees them.' },
  { seed: 'r2r-city-28', read: (/** @type {any} */ t) => safety(t, 'safetyDesc'), line: 'The constant monster threat keeps the guard exceptionally well-drilled and alert.' },
  { seed: 'r2r-thorp-20', read: (/** @type {any} */ t) => safety(t, 'guardEffectivenessDesc'), line: 'A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.' },
  { seed: 'r2r-town-15', read: crimeLines, line: "The church's moral authority provides cover for sophisticated fraud. Fake relics, forged dispensations, and corrupt clergy who treat their position as a commercial opportunity." },
];

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR3-DEFECON batch 1: the safety and food lines read the town they print in', () => {
  test('NOT: each false line is gone, and its twin prints in its place', () => {
    const failures = collectSeedFailures(NOT, (p) => {
      expectAbsentWithAnchor(p.read(town(p.seed)), p.not, p.instead, `${p.row} ${p.seed}`);
    });
    expectNoSeedFailures(failures);
  }, 600_000);

  test('NOT C12387: "No single dominant organisation" is not printed beside the one ring; the background line keeps its theft', () => {
    const lines = crimeLines(town('r2s-occupied-town-1'));
    const background = lines.find((l) => l.startsWith('Petty theft, minor fraud, and opportunistic violence are persistent'));
    expect(background, 'the background-crime line prints').toBeTypeOf('string');
    expect(String(background).startsWith(NO_DOMINANT), 'its no-dominant lead').toBe(false);
    expect(String(background)).toContain('driven by too many people with too little');
  }, 300_000);

  test('the theocratic flag stands only where the tithes lead the income and a religious power is Strong or Dominant', () => {
    expect(town('r2r-metropolis-3').economicState.safetyProfile.flags.theocraticEconomy, 'r2r-metropolis-3: Minor, 9%').toBe(false);
    // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): r2r-town-54's faith lit stands at Significant (its tithes 27%, still the largest), so the flag falls; the
    // lowest r2r-town whose tithes lead the income beside a Strong or Dominant religious power is town-19 (19 85 of 200)
    expect(town('r2r-town-19').economicState.safetyProfile.flags.theocraticEconomy, 'r2r-town-19: Dominant, 25%, the largest').toBe(true);
  }, 300_000);

  test('KEEP: each true sibling still prints where the state is absent', () => {
    const failures = collectSeedFailures(KEEP, (k) => { expect(k.read(town(k.seed))).toContain(k.line); });
    expectNoSeedFailures(failures);
  }, 600_000);
});
