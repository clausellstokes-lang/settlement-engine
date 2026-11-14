/**
 * noOneRingWhereRingsRival.test.js — W2-C-LEAVES-3, round three (REVIEW-R2-STAGES' cold list #1172 and #1202, HIGH;
 * #716, #750 and #813): "One criminal ring decides what crime is allowed here" (and its three vantages: "the answer is
 * one ring", "Crime here answers to one ring") beside a Thieves' Guild and The Black Circle on the Power tab and the
 * roster's "Multiple criminal factions", printed as rival gangs disputing their turf.
 * `defenseDisplay.js :: deriveCriminalStructure` read any criminal power, and the roster's "Multiple criminal
 * factions", as one organised ring. The power roster is the home of who stands: a criminal power that governs
 * (`isGoverning`, the council bought outright) is the captured hall, not a rival ring; two rings or more, or the
 * roster's own "Multiple criminal factions", is the structure table's "semi-organized" row ("lacks a single
 * controlling authority. Several gangs may be competing."). No generated record moves (the field diff over the
 * census's 720: 0 records differ).
 *
 * W2-C-LEAVES-11 (the chair's ruling (1) of 2026-11-14, on REVIEW-W2-C-LEAVES's HIGH [1]): the rival-rings key was false
 * in 36 of the 289 towns of the reader's 1,824 where it printed: in 18 a criminal power GOVERNS the town or is Dominant
 * ("Underworld: Shadow Senate · Dominant" on the same section), in 18 a thieves' guild runs the trade (the operations
 * list's "Thieves' Guild Chapter" / "Thieves' Guild (Powerful)"; the crime prose's next sentence "The thieves … answer to
 * a guild"). RULED: rival rings only where the record holds two or more criminal powers (or the roster's own "Multiple
 * criminal factions") AND NONE GOVERNS OR DOMINATES AND NO GUILD IS NAMED AS RUNNING THE TRADE; otherwise the one
 * organisation. The ruling replaces round three's "two rival rings beside a bought council" reading (of its three rr2s
 * towns, rr2s-city-calm-rand-1 now reads one organisation; the other two hold no governing criminal power at this tip).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveCriminalStructure } from '../../../src/domain/display/defenseDisplay.js';

/** The reader's own shapes (REVIEW-W2-C-LEAVES render.rr3s.jsx :: cfgFor: the census's r2r/r2s, the app's rr2s/rr3/rr3w). @param {string} seed */
const birthApp = (seed) => {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let cfg;
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) cfg = { ...DEFAULT_CONFIG, ...dials, settType: m[1] };
  else if ((m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/))) {
    cfg = { ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  } else {
    m = /** @type {RegExpMatchArray} */ (seed.match(/^rr[23][a-z]?-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
    const stresses = m[2] === 'calm' ? [] : m[2].split('+');
    const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    cfg = { ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true };
  }
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};

/** The reader's 36 towns where the key was false (W2-C-LEAVES-11, measured at 92d36e5f9), and round three's governed town. */
const ONE_ORGANISATION = ['r2r-city-16', 'r2r-city-50', 'r2r-city-56', 'r2r-metropolis-0', 'r2r-metropolis-5', 'r2r-metropolis-7',
  'r2r-metropolis-21', 'r2r-metropolis-25', 'r2s-politically_fractured-metropolis-1', 'r2s-recently_betrayed-metropolis-3',
  'r2s-plague_onset-city-3', 'r2s-religious_conversion-city-3', 'r2s-religious_conversion-metropolis-0', 'r2s-slave_revolt-metropolis-3',
  'r2s-wartime-city-2', 'rr3-city-calm-port-0', 'rr3-city-under_siege-port-0', 'rr3-city-famine-rand-0', 'rr3-city-famine-rand-4',
  'rr3-city-famine-rand-5', 'rr3-city-occupied-rand-5', 'rr3-city-indebted-rand-4', 'rr3-city-recently_betrayed-rand-0',
  'rr3-city-mass_migration-rand-3', 'rr3-metropolis-famine-port-0', 'rr3-metropolis-occupied-rand-4', 'rr3-metropolis-indebted-rand-0',
  'rr3-metropolis-recently_betrayed-rand-0', 'rr3-metropolis-succession_void-rand-4', 'rr3-metropolis-insurgency-port-1',
  'rr3-metropolis-slave_revolt-rand-3', 'rr3-metropolis-slave_revolt-rand-4', 'rr3-metropolis-under_siege+famine-rand-2',
  'rr3w-metropolis-famine-isolated-0', 'rr3w-metropolis-famine-river-1', 'rr3w-metropolis-calm-river-0',
  'rr2s-city-calm-rand-1'];
/** The guard towns: rival rings the ruling keeps (the roster's rival gangs alone; two minor rings; a minor guild seat beside them). */
const RIVAL_RINGS = ['r2r-city-3', 'r2r-city-29', 'r2r-city-5'];

/** @param {any} town */
const governedOrGuilded = (town) => town.powerStructure.factions.some((/** @type {any} */ f) => f.category === 'criminal'
  && (f.isGoverning === true || f.powerLabel === 'Dominant'))
  || town.institutions.some((/** @type {any} */ i) => /thieves'? guild/i.test(i.name || ''));

describe('no "one ring" where rings rival (#1172, #1202, #716, #750, #813)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: one organisation where a criminal power governs or dominates or a guild runs the trade; rival rings only where none does', () => {
    /** @param {object[]} factions @param {string[]} houses */
    const town = (factions, houses = []) => ({ powerStructure: { factions }, institutions: houses.map((name) => ({ name })) });
    const council = { faction: 'Corrupt City Council', category: 'criminal', isGoverning: true };
    const guild = { faction: "Thieves' Guild", category: 'criminal' };
    const circle = { faction: 'The Black Circle', category: 'criminal', isGoverning: false };
    const senate = { faction: 'Shadow Senate', category: 'criminal', isGoverning: false, powerLabel: 'Dominant' };
    expect(deriveCriminalStructure(town([council, guild]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([guild]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([council, guild, circle]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([council], ['Multiple criminal factions']))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([senate, guild, circle]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([guild, circle], ["Thieves' guild chapter"]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([], ['Multiple criminal factions', "Thieves' guild (powerful)"]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([guild, circle]))?.key).toBe('semi-organized');
    expect(deriveCriminalStructure(town([], ['Multiple criminal factions']))?.key).toBe('semi-organized');
    expect(deriveCriminalStructure(town([guild], ['Multiple criminal factions']))?.key).toBe('semi-organized');
  });

  test('the reader\'s towns: one organisation in the 36 (and round three\'s governed town); rival rings kept in the guard towns', () => {
    expectNoSeedFailures(collectSeedFailures([...ONE_ORGANISATION, ...RIVAL_RINGS], (seed) => {
      const town = birthApp(seed);
      const st = deriveCriminalStructure(town);
      if (ONE_ORGANISATION.includes(seed)) {
        expect(governedOrGuilded(town), `${seed}: anchored, a governing or dominant criminal power or a guild`).toBe(true);
        expect(st?.key, seed).toBe('organized');
        expect(st?.note ?? '', seed).not.toMatch(/lacks a single controlling authority|Several gangs/);
      } else {
        expect(governedOrGuilded(town), `${seed}: anchored, none governs, dominates or runs the trade`).toBe(false);
        expect(st?.key, seed).toBe('semi-organized');
        expect(st?.note, seed).toMatch(/lacks a single controlling authority/);
      }
    }), 'a town reads the wrong criminal structure');
  }, 240000);
});
