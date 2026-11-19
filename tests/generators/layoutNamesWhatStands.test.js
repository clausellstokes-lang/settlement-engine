/**
 * tests/generators/layoutNamesWhatStands.test.js — THE LAYOUT LINE NAMES ONLY WHAT STANDS (TAIL-EXPORTS-JOURNAL,
 * the chair's ruling J1 of 2026-11-14).
 *
 * `spatialGenerator.js :: generateSpatialLayout` drew the layout line by tier and terrain alone, and the tabs, the
 * PDF and the Foundry journal print the record's string. Read across the 720 census towns at the joined line's
 * 48fedbe98 it promised a single defended gate where no gate stands (13 of 13 that printed it), a citadel where none
 * stands (11 of 19), a keep where none stands (11 of 15), a stone wall round a palisade (6 of 6) and warehouses and
 * chandlers at a waterfront that holds neither or one (16 of 19). One table of (the noun; the record's fact): a gate
 * and stone walls, the defence answer; a citadel or a keep, a Citadel on the roster; warehouses and chandlers, their
 * houses (both, or the clause goes). The slot keeps its draw; a line whose noun the record denies takes its twin
 * without that noun: a line already declared or banked (the walled hill town with no Citadel takes the open hill town's
 * line, which names no wall and no keep), so the presumed-things walker sees no new line.
 *
 * Collected on births (the census's own dials, SECOND-WAVE-CENSUS `births.mjs` / CENSUS-3 `seedcfg.mjs`): each RED
 * pair is a town whose base layout named the denied noun, and the exact line it prints instead; each KEEP pair is a
 * town where the noun stands and the full line still prints.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's seed → configuration (seedcfg.mjs, its r2r- and r2s- arms, verbatim). @param {string} seed */
function cfgFor(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`)); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  throw new Error(`no configuration for ${seed}`);
}

/** RED: [seed, the noun the record denies, what the record holds instead (premise), the line that prints instead]. */
const RED = [
  ['r2r-village-0', /single defended gate/, (s) => !defenseFactsOf(s).hasGate, 'Close-built stone houses below the church'],
  ['r2r-city-39', /citadel/, (s) => !hasHouse(s, /^Citadel$/), 'Walled desert city of pale stone, caravanserai outside the east gate'],
  ['r2r-city-46', /citadel/, (s) => !hasHouse(s, /^Citadel$/), 'Mountain city of terraced districts, lower town in the valley'],
  ['r2r-metropolis-19', /citadel/, (s) => !hasHouse(s, /^Citadel$/), 'Great desert metropolis of white stone: the souk by the wells, caravansaries ringing the walls'],
  ['r2r-town-0', /the keep/, (s) => !hasHouse(s, /^Citadel$/), 'Hill town of stone houses climbing above the market quarter'],
  ['r2r-village-6', /Stone-walled/, (s) => defenseFactsOf(s).wallKind === 'palisade', 'Walled village on a south-facing slope, paths converging at the stone cross'],
  ['r2r-town-37', /warehouses|chandlers/, (s) => !hasHouse(s, /warehouse|Chandler/i), 'Walled port town climbing from the harbour'],
  ['r2s-famine-town-2', /warehouses|chandlers/, (s) => !hasHouse(s, /warehouse|Chandler/i), 'Port town climbing from the harbour'],
  ['r2r-town-3', /chandlers/, (s) => !hasHouse(s, /Chandler/), 'Walled port town climbing from the harbour'],
  ['r2r-town-4', /chandlers/, (s) => !hasHouse(s, /Chandler/), 'Port town climbing from the harbour'],
  ['r2r-town-18', /warehouses/, (s) => !hasHouse(s, /warehouse/i), 'Walled port town climbing from the harbour'],
];
/** KEEP: [seed, the line that still prints whole, because its noun stands]. */
const KEEP = [
  ['r2r-city-20', 'Mountain city of terraced districts, the citadel at the summit, lower town in the valley'],
  ['r2r-metropolis-12', 'Great desert metropolis of white stone: the citadel above the wells, the souk below, caravansaries ringing the walls'],
  ['r2s-succession_void-city-3', 'Walled desert city of pale stone, caravanserai outside the east gate, citadel above the wells'],
  ['r2r-town-13', 'Stone-walled hill town, the keep visible above the market quarter'],
  ['r2r-town-52', 'Port town climbing from the harbour, warehouses and chandlers at the waterfront'],
  ['r2s-politically_fractured-town-1', 'Walled port town climbing from the harbour, warehouses and chandlers at the waterfront'],
];

/** @param {any} s @param {RegExp} re */
function hasHouse(s, re) { return (s.institutions || []).some((i) => re.test(String(i?.name || ''))); }

/** @type {Map<string, any>} */
const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...RED.map((r) => r[0]), ...KEEP.map((k) => k[0])]) {
    towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  }
}, 300_000);

describe('J1: a layout line whose noun the record denies takes its twin without that noun', () => {
  for (const [seed, noun, premise, instead] of RED) {
    it(`${seed}: no ${noun.source}; prints "${instead}"`, () => {
      const s = towns.get(seed);
      expect(premise(s), 'fixture premise: the record denies the noun').toBe(true);
      // each noun is a plain literal or a literal alternation, so its alternatives are exactly its substrings
      for (const word of noun.source.split('|')) expectAbsentWithAnchor(s.spatialLayout.layout, word, instead, `${seed}: the denied noun, beside the twin line`);
      expect(s.spatialLayout.layout).toBe(instead);
    });
  }
});

describe('J1 keeps: where the noun stands, the whole line prints', () => {
  for (const [seed, line] of KEEP) {
    it(`${seed}: "${line}"`, () => {
      expect(towns.get(seed).spatialLayout.layout).toBe(line);
    });
  }
});
