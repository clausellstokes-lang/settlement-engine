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
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveCriminalStructure } from '../../../src/domain/display/defenseDisplay.js';

/** The app's own shape, as the reader REVIEW-R2-STAGES born its towns (render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};

describe('no "one ring" where rings rival (#1172, #1202, #716, #750, #813)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: a governing council and one guild is one ring; two rings, or the roster\'s rival gangs, are not', () => {
    /** @param {object[]} factions @param {string[]} houses */
    const town = (factions, houses = []) => ({ powerStructure: { factions }, institutions: houses.map((name) => ({ name })) });
    const council = { faction: 'Corrupt City Council', category: 'criminal', isGoverning: true };
    const guild = { faction: "Thieves' Guild", category: 'criminal' };
    const circle = { faction: 'The Black Circle', category: 'criminal', isGoverning: false };
    expect(deriveCriminalStructure(town([council, guild]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([guild]))?.key).toBe('organized');
    expect(deriveCriminalStructure(town([council, guild, circle]))?.key).toBe('semi-organized');
    expect(deriveCriminalStructure(town([], ['Multiple criminal factions']))?.key).toBe('semi-organized');
    expect(deriveCriminalStructure(town([guild], ['Multiple criminal factions']))?.key).toBe('semi-organized');
  });

  test('the reader\'s towns: two rival rings beside a bought council (rr2s-city-calm-rand-1, rr2s-metropolis-calm-rand-1, rr2s-city-famine-rand-1)', () => {
    for (const seed of ['rr2s-city-calm-rand-1', 'rr2s-metropolis-calm-rand-1', 'rr2s-city-famine-rand-1']) {
      const town = birthApp(seed);
      const rings = town.powerStructure.factions.filter((/** @type {any} */ f) => f.category === 'criminal' && !f.isGoverning);
      expect(rings.length, `${seed}: anchored, two rings`).toBeGreaterThanOrEqual(2);
      const st = deriveCriminalStructure(town);
      expect(st?.key, seed).toBe('semi-organized');
      expect(st?.note, seed).toMatch(/lacks a single controlling authority/);
    }
  }, 60000);
});
