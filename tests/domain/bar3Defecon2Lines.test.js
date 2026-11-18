/**
 * bar3Defecon2Lines.test.js — BAR3-DEFECON-2 (the chair's prompt of 2026-11-15, items 1 and 2; vetoable by the owner):
 *   · C17459 C22802 C31257: the safety profile's crime-kept-in-hand lines ("Crime exists but is well-managed.", "It is
 *     noticed, and so far it does little harm.", "Thieves are scarce now; …") where the record's live tensions hold a crime
 *     wave (`history.currentTensions`, settled at assembly under the chair's grant AS1: `safetyLineTruth.js ::
 *     settleCrimeWaveLines`): the twin prints in their place;
 *   · C30870 (ruling T28b): no "one ring" note where the live houses hold several gangs (`crimeSignal.js :: gangHousesOf`):
 *     the Defense tab's crime structure prints the rival-gangs note; the key stays organized;
 *   · C48585: the timber hooks' carts and rafts that stopped, where the record's import list holds no timber: the twin;
 *   · the dates (the chair's word, 21:27 UTC): a good brought in as a shortage is not also exported; the chain keeps it.
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs: the r2r- and r2s- arms). Each NOT pair is red at the batch's
 * base (7a4b48a84); each KEEP pair is green before and after. The words are read from the source's own constants.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { CRIME_WAVE_TWINS } from '../../src/generators/safetyLineTruth.js';
import { deriveCriminalStructure, RING_AMONG_RIVAL_GANGS_NOTE } from '../../src/domain/display/defenseDisplay.js';
import { OUTLOOK_HOOK_SIBLINGS, TIMBER_RAFT_HOOK, TIMBER_SHORT_HOOK } from '../../src/generators/economy/outlookHookSiblings.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const cfgFor = (seed) => {
  const m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  const n = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [n[1]], selectedStressesRandom: false, settType: n[2] });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
/** @param {unknown} text @returns {string[]} its sentences */
const sentences = (text) => String(text ?? '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
/** @param {'safetyDesc' | 'economicDragDesc'} field */
const said = (field) => (/** @type {any} */ t) => sentences(t.economicState?.safetyProfile?.[field]);
/** @param {string} x */ const first = (x) => sentences(x)[0];
const [WELL, OCCUPIED] = CRIME_WAVE_TWINS.safetyDesc;
const [HARM] = CRIME_WAVE_TWINS.economicDragDesc;
const crimeWave = (/** @type {any} */ t) => (t.history?.currentTensions || []).some((/** @type {any} */ x) => x?.type === 'crime_wave');

/** @type {Array<{ row: string, seed: string, read: (t: any) => string[], not: string, instead: string }>} */
const NOT = [
  { row: 'C17459', seed: 'r2r-village-7', read: said('safetyDesc'), not: first(WELL[0]), instead: first(WELL[1]) },
  { row: 'C17459', seed: 'r2r-city-21', read: said('safetyDesc'), not: first(WELL[0]), instead: first(WELL[1]) },
  { row: 'C22802', seed: 'r2r-village-10', read: said('economicDragDesc'), not: sentences(HARM[0])[1], instead: first(HARM[1]) },
  { row: 'C22802', seed: 'r2r-town-18', read: said('economicDragDesc'), not: sentences(HARM[0])[1], instead: first(HARM[1]) },
  { row: 'C31257', seed: 'r2r-thorp-1', read: said('safetyDesc'), not: OCCUPIED[0], instead: OCCUPIED[1] },
  { row: 'C31257', seed: 'r2s-occupied-town-3', read: said('safetyDesc'), not: OCCUPIED[0], instead: OCCUPIED[1] },
];
/** KEEP: each original where no crime wave stands. */
const KEEP = [
  { seed: 'r2r-thorp-12', read: said('safetyDesc'), line: first(WELL[0]) },
  { seed: 'r2r-village-5', read: said('economicDragDesc'), line: sentences(HARM[0])[1] },
  { seed: 'r2s-occupied-thorp-0', read: said('safetyDesc'), line: OCCUPIED[0] },
];
/** @param {any} t */ const hooks = (t) => (t.economicViability?.plotHooks || []).map((/** @type {any} */ h) => String(h?.hook ?? ''));
const CARTS = /** @type {string} */ (OUTLOOK_HOOK_SIBLINGS[TIMBER_RAFT_HOOK][1].text);
// RE-KEYED BY IDENTITY 2026-11-18 (LEFT-KEYS K1, R8): the supply rule (BIRTH-3, BR4/BR5) has r2r-town-34 buy its timber in
// ("Timber" on the import list), so the carts line is true there now. The same claim on r2r-metropolis-40 (road): it imports
// no timber and prints the short twin; with the guard (`foodBalance.js`, `!importHeld(facts, TIMBER_IMPORT)`) held open in
// scratch it prints the carts line. r2r-metropolis-2 and r2s-insurgency-city-3 still buy no timber (measured on the 720).
const TIMBER_NOT = [
  { seed: 'r2r-metropolis-40', not: CARTS }, { seed: 'r2r-metropolis-2', not: CARTS }, { seed: 'r2s-insurgency-city-3', not: TIMBER_RAFT_HOOK },
];
const TIMBER_KEEP = 'r2r-city-4'; // imports Timber
const RIVALS = ['r2r-metropolis-0', 'r2s-wartime-city-2'];
const ONE_RING = 'r2r-city-21'; // organized, a thieves' guild and its trade, no gang house

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR3-DEFECON-2: the crime lines read the crime wave and the rival gangs', () => {
  test('NOT: under a crime wave each kept-in-hand line is gone, and its twin prints in its place', () => {
    const failures = collectSeedFailures(NOT, (p) => {
      expect(crimeWave(town(p.seed)), `${p.seed} holds a crime wave`).toBe(true);
      expectAbsentWithAnchor(p.read(town(p.seed)), p.not, p.instead, `${p.row} ${p.seed}`);
    });
    expectNoSeedFailures(failures);
  }, 600_000);

  test('KEEP: with no crime wave each original still prints', () => {
    const failures = collectSeedFailures(KEEP, (k) => {
      expect(crimeWave(town(k.seed)), `${k.seed} holds no crime wave`).toBe(false);
      expect(k.read(town(k.seed))).toContain(k.line);
    });
    expectNoSeedFailures(failures);
  }, 600_000);

  test('NOT C30870 (T28b): beside several gangs the organized structure prints the rival-gangs note, not one ring', () => {
    const failures = collectSeedFailures(RIVALS, (seed) => {
      const row = /** @type {{ key: string, note: string }} */ (deriveCriminalStructure(town(seed)));
      expect(row.key, `${seed}: the key stays as T28 ruled it`).toBe('organized');
      expect(row.note, `${seed}: the rival-gangs note`).toBe(RING_AMONG_RIVAL_GANGS_NOTE);
    });
    expectNoSeedFailures(failures);
  }, 600_000);

  test('KEEP C30870: an organized structure with no gang house keeps its drawn one-ring vantage', () => {
    const row = /** @type {{ key: string, note: string }} */ (deriveCriminalStructure(town(ONE_RING)));
    expect(row.key).toBe('organized');
    expect(row.note, 'the drawn vantage names one ring').toMatch(/\bone (criminal )?ring\b/i);
  }, 300_000);

  test('NOT C48585: with no timber import the carts and rafts that stopped are gone, and the twin prints', () => {
    const failures = collectSeedFailures(TIMBER_NOT, (p) => expectAbsentWithAnchor(hooks(town(p.seed)), p.not, TIMBER_SHORT_HOOK, `C48585 ${p.seed}`));
    expectNoSeedFailures(failures);
  }, 600_000);

  test('KEEP C48585: beside a timber import the carts line still prints', () => {
    expect(hooks(town(TIMBER_KEEP))).toContain(CARTS);
  }, 300_000);

  test('NOT the dates: a good imported as a shortage is not also exported; the oasis chain keeps it on its own card', () => {
    const t = town('r2r-city-39');
    const imports = /** @type {string[]} */ (t.economicState.primaryImports);
    const shortage = imports.find((x) => /^Dates\b.*\(local /.test(x));
    expect(shortage, 'r2r-city-39 imports dates as a shortage').toBeTypeOf('string');
    const card = (t.economicState.activeChains || []).find((/** @type {any} */ c) => c?.chainId === 'oasis_agriculture');
    const good = (card?.outputs || []).find((/** @type {string} */ o) => /^Dates\b/.test(o));
    expect(good, 'the chain card still names its dates').toBeTypeOf('string');
    expectAbsentWithAnchor(t.economicState.primaryExports, good, 'Water trade', 'r2r-city-39 exports');
  }, 300_000);
});
