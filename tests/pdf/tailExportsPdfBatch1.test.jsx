/** @vitest-environment jsdom */
/**
 * tailExportsPdfBatch1.test.jsx — TAIL-EXPORTS-PDF batch 1 (the chair's rulings E1, E2 and P1 of 2026-11-14): THE PDF
 * PRINTS WHAT THE TAB PRINTS, THROUGH THE TAB'S OWN LEAF.
 *
 * One collected guard on births of the census's 720 (the SECOND-WAVE-CENSUS shape: r2r- and r2s- arms). Each NOT pair
 * printed at the joined line 48fedbe98 and must not print; each names what prints instead (or that the slot is silent by
 * design). Each KEEP pair is a true sibling that must still print.
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { powerHeadline, defenseHeadline, economicsHeadline } from '../../src/pdf/lib/headlines.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const birth = (seed) => {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (s)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (s)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
const cache = new Map();
/** @param {string} seed */
const town = (seed) => { if (!cache.has(seed)) { const t = birth(seed); cache.set(seed, { t, vm: buildViewModel({ settlement: t }) }); } return cache.get(seed); };
/** The text of one surface of a town. @param {string} seed @param {string} where */
const text = (seed, where) => {
  const { t, vm } = town(seed);
  const props = { settlement: t, narrativeMode: false, vm, stateProse: null };
  if (where === 'economics') return leaves(EconomicsTrade(props)).join('');
  if (where === 'overview') return leaves(Overview(props)).join('');
  if (where === 'defense') return leaves(DefenseSecurity(props)).join('');
  if (where === 'powerHeadline') return String(powerHeadline(vm.power, vm.identity));
  if (where === 'defenseHeadline') return String(defenseHeadline(vm.defense, vm.identity));
  if (where === 'economicsHeadline') return String(economicsHeadline(vm.economics));
  throw new Error(where);
};

// [id, seed, surface, must NOT print, what prints instead (null: the slot is silent by design)]
const NOT = [
  ['05842', 'r2s-succession_void-thorp-1', 'economics', /Black market capture/, null], // capture under 3: the tab prints no Shadow Economy block
  ['05842/c', 'r2r-city-4', 'economics', /Black market capture/, /CRIMINAL SUPPLY CHAINS/],
  ['32399', 'r2r-thorp-58', 'economics', /luxury goods/, null], // a thorp trades in no luxury goods; the tab prints no such need
  ['32248', 'r2s-under_siege-town-2', 'overview', /imports cover/, /Deficit: /], // the siege brings nothing in: the tab's row
  ['07849', 'r2s-succession_void-thorp-1', 'defense', /Defense relies on armed citizens\./, /No organized force\. Defense relies on individual armed citizens\./],
  ['07849/h', 'r2s-succession_void-thorp-1', 'defenseHeadline', /no one under arms/, /no walls and no organized force\./],
  // no criminal house, no crime pattern, no shadow share the tab prints: the Defense desk's own denial
  // BAR4-CLOSE-SWEEP (2026-11-16): re-keyed by identity from r2r-town-26, where BAR4-SAFETY 2ee6f3a05 (SF1 (d), DECLARED: the line reads
  // the crime key beside `criminalsStandHere`) now sets its covert fence and hired muscle (`covertCrimeHeld`, key `diffuse`) against
  // the watch, as the Defense tab prints the Diffuse block. Measured on the 720 at f19c3b28b: 7 towns stand guarded, with no criminal
  // the key or the tab names and the order-keeping ratio under 1 (where the old line printed "The criminals outmatch"); this is one.
  ['26502', 'r2r-hamlet-27', 'overview', /The criminals outmatch those who keep order\./, /No criminal infrastructure has been identified\./],
  ['29174', 'r2r-town-4', 'overview', /Those who keep order clearly outmatch the criminals\./, /No criminal infrastructure has been identified\./],
  ['29175', 'r2r-thorp-4', 'overview', /Those who keep order roughly match the criminals\./, /No criminal infrastructure has been identified\./],
  ['01243', 'r2r-village-9', 'powerHeadline', /pressing close behind/, /^Elder Council holds the seat, but more weight lies with Religious Authorities\.$/],
  ['12107', 'r2s-famine-village-1', 'powerHeadline', /Military\/Guard|pressing close behind/, /holds the seat, but more weight lies with The Guard\./],
  ['14754', 'r2r-village-21', 'economicsHeadline', /salted fish/, /grows less food than it eats/], // a siege stops trade: nothing named as going out
];
// [surface, a phrase that surface really prints for every NOT row on it: the liveness anchor of the NOT row's negative]
const SURFACE_PRINTS = /** @type {Record<string, string>} */ ({
  economics: 'INCOME SOURCES',
  overview: 'Food balance',
  defense: 'GUARD ASSESSMENT',
  powerHeadline: 'holds the seat',
  defenseHeadline: 'no walls and no organized force.',
  economicsHeadline: 'grows less food than it eats',
});
// [seed, surface, must still print]
const KEEP = [
  ['r2r-city-0', 'economics', /Black market capture: \d+% of economy/],
  ['r2r-city-0', 'economics', /CRITICAL DEPENDENCIES/],
  ['r2r-city-4', 'economics', /CRIMINAL SUPPLY CHAINS/], // capture under 3: no capture line, the record's criminal chains still print
  ['r2r-city-0', 'overview', /The criminals outmatch those who keep order\.|keep order (clearly|roughly)/],
  ['r2r-city-16', 'overview', /imports cover \d+% of gap/],
  ['r2r-city-13', 'powerHeadline', /governs, with .+ pressing close behind\./],
  ['r2s-succession_void-thorp-1', 'defenseHeadline', /^[A-Z]/],
];

describe('TAIL-EXPORTS-PDF batch 1: the PDF prints what the tab prints', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);
  test('every NOT row: not printed (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([_id, seed, where, not, instead]) => {
      const out = text(/** @type {string} */ (seed), /** @type {string} */ (where));
      expect(out, `${_id}: the ${where} surface prints`).toContain(SURFACE_PRINTS[/** @type {string} */ (where)]);
      expect(out, `${_id} ${seed} (${where}): not printed`).not.toMatch(/** @type {RegExp} */ (not)); // anchored: the line above asserts the same surface prints its own phrase
      if (instead) expect(out, `${_id} ${seed} (${where}): what prints instead`).toMatch(instead);
    }), 'batch 1: no NOT row prints on its surface, and each prints what the tab prints instead');
  }, 120000);
  test('every KEEP row: still printed (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, where, keep]) => {
      expect(text(/** @type {string} */ (seed), /** @type {string} */ (where)), `keep ${seed} (${where})`).toMatch(keep);
    }), 'batch 1: every KEEP row still prints on its surface');
  }, 120000);
});
