/**
 * bar6EconStateShown.test.js — BAR6-ECON (BRIEF-BAR6, L4 as BRIEF-BAR5 writes it; vetoable by the owner): THE ECONOMICS TAB
 * AND THE ECONOMY DESK READ THE PAGE'S OWN STATE, KEPT AS A GUARD. LAW 8's 8d.export, 8e.svcOutput, 8d.income, 8e.open and
 * LAW 9's 9b.subsistence, 9c.carts, 9c.no-imports, 9d.no-exports, 9a.hands (the auditors' page rules, `law8.mjs`, `law9.mjs`,
 * read over a census dump), read off the born record through the leaves the tab and the desk print through
 * (`tests/helpers/pageLaws/econBar6.mjs :: econBar6Instances`). THIS FILE REDS WHEN
 *   (a) THE ZERO: any instance in a town of the census's 720 (born in the census's own configuration shape);
 *   (b) THE POSITIVE CONTROL: the detector, the leaves read blind (each card, share, label and pool key as the record gives
 *       it), stops finding its rule in a census town whose record holds the state (one town a rule; at the base afa46d644
 *       every one of them printed its rule's line), and for the rule no census town holds, the wide read's own town
 *       (9d.no-exports: bar0-village-famine-rand-28, the read's C211337);
 *   (c) THE DECLARATION: DS-ECO-6's "same organised hands" variant declares the organised structure, not the semi-organised.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { econBar6Instances } from '../helpers/pageLaws/econBar6.mjs';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

await loadGenerationLawPayloads();

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, in its own order of shapes. */
const CENSUS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((c) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${c}-${size}-${i}`))),
];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
const born = (seed) => {
  let m = /^r2r-(\w+)-\d+$/.exec(seed);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  // the wide read's own towns (CENSUS-3 seedcfg.mjs's bar0- arm, verbatim in shape: the bar's first read)
  const w = /^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-\d+$/.exec(seed);
  if (w) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: w[1], selectedStressesRandom: false, selectedStresses: w[2] === 'calm' ? [] : w[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
  m = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (!m) throw new Error(`a guard seed is a census or a wide-read seed: ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };

describe('BAR6-ECON: the Economics tab and the economy desk read the page\'s own state', () => {
  test('(a) THE ZERO over the census\'s 720: no rule of the seat finds an instance', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures(CENSUS, (seed) => {
      for (const i of econBar6Instances(town(seed))) found.push(`${seed} · ${i.rule} · ${i.row}`);
    });
    expectNoSeedFailures(failures, 'every census town is born and read');
    expect(found).toEqual([]);
  }, 1_200_000);

  // (b) one census town a rule whose record holds the state, read blind (BAR6-ECON's measure at afa46d644, the 720)
  const CONTROLS = [
    ['r2s-under_siege-town-0', '8d.export'],
    ['r2s-under_siege-city-0', '8e.svcOutput'],
    ['r2s-under_siege-town-0', '8d.income'],
    ['r2r-hamlet-0', '8e.open'],
    ['r2r-thorp-0', '9b.subsistence'],
    ['r2r-town-12', '9c.carts'],
    ['r2r-thorp-24', '9c.no-imports'],
  ];
  test('(b) THE POSITIVE CONTROL: in each town the detector finds its rule with the leaves read blind, and not through them', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, rule]) => {
      const blind = econBar6Instances(town(seed), { blind: true }).filter((i) => i.rule === rule);
      expect(blind.length, `${seed}: the detector finds ${rule} blind`).toBeGreaterThan(0);
      expect(econBar6Instances(town(seed)).filter((i) => i.rule === rule), `${seed}: the leaves cure ${rule}`).toEqual([]);
    }), '(b) every positive control fires');
  }, 900_000);

  // 9d.no-exports prints in no town of the 720: its control is the wide read's own town (C211337), a famine village whose
  // failed herds' wool the printed export list leaves out while the record's list keeps it
  test('(b) THE WIDE READ\'S CONTROL of 9d.no-exports: bar0-village-famine-rand-28, found blind and cured', () => {
    const t = town('bar0-village-famine-rand-28');
    expect(econBar6Instances(t, { blind: true }).map((i) => i.rule)).toContain('9d.no-exports');
    expect(econBar6Instances(t).filter((i) => i.rule === '9d.no-exports')).toEqual([]);
  }, 120_000);

  test('(c) DS-ECO-6\'s "same organised hands" variant declares the organised structure', () => {
    const pool = DOSSIER_STATE_PROSE_ECONOMY['DS-ECO-6'].pools['TIER: minor shadow activity (≥3)'];
    const hands = pool.filter((/** @type {any} */ v) => v.vid === 4); // the variant BAR6-ECON declared (the annex's v4)
    expect(hands).toHaveLength(1);
    expect(hands[0].marks).toContain('crime: ≥ organized');
  });
});
