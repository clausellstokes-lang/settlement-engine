/**
 * bar4MarkPromise.test.js — BAR4-SERVICES (BRIEF-BAR4 amendment K4; the chair's directions S1 and S3 of 2026-11-16; each
 * vetoable by the owner): THE DETECTOR OF KIND S1, "THE MARK'S PROMISE", KEPT AS A GUARD.
 *
 * The detector is `tests/helpers/markPromise.js :: markPromiseInstances` (read its header for the kind's seven parts and
 * its named exclusions). THIS FILE REDS WHEN
 *   (a) THE ZERO: any instance the detector finds and no named exclusion explains prints in a town of the census's 720
 *       (born in the census's own configuration shape, CENSUS-3 seedcfg.mjs: `r2r-<size>-<i>` random dials,
 *       `r2s-<crisis>-<size>-<i>` the one crisis ticked). At 8aef8e7d4 it found 93 instances in 53 towns;
 *   (b) THE POSITIVE CONTROL: the detector, its tabs read blind (their marks read as bare), stops finding the record's own
 *       need in a town that holds it (each part of the kind has its town): so it cannot go blind itself;
 *   (c) A MARKED pair (each red at 8aef8e7d4) stops leading its row with its mark, or a KEEP pair (the same row where its
 *       need is not cut) starts printing one.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { incomeDescShown } from '../../src/domain/display/economicsCrisisMarks.js';
import { magicRoleBandShown } from '../../src/domain/display/magicProvisionShown.js';
import { deriveMagicPosture } from '../../src/domain/display/dossierViewModel.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { markPromiseInstances } from '../helpers/markPromise.js';
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
  m = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (!m) throw new Error(`a guard seed is a census seed: ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };
const row = (/** @type {any} */ s, /** @type {string} */ name) => serviceRowsOf(s.availableServices).map(({ svc }) => svc).find((v) => v?.name === name);

describe('the mark\'s promise (kind S1): no row on offer bare while the record says its need is cut', () => {
  test('(a) THE ZERO over the census\'s 720: every instance the detector finds is cured or named', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures(CENSUS, (seed) => {
      for (const i of markPromiseInstances(town(seed))) if (!i.excluded) found.push(`${seed} · ${i.kind} · ${i.tab} · ${i.row} @ ${i.house} (${i.need})`);
    });
    expectNoSeedFailures(failures, 'every census town is born and read');
    expect(found).toEqual([]);
  }, 900_000);

  // (b) each part of the kind, in a town of the 720 whose record holds the need, with the tabs read blind
  const CONTROLS = [
    ['r2r-metropolis-14', 'siege-import', ['Services', 'Institutions']], // the smelter on imported iron ore, besieged
    ['r2s-under_siege-metropolis-0', 'siege-travel', ['Services']], // the veterans' armed escort
    ['r2s-famine-village-2', 'famine-food', ['Services']], // the ale house's ale in a grain famine
    ['r2s-under_siege-thorp-0', 'income-house', ['Economics']], // the fish share beside its stopped fishing community
    ['r2r-village-1', 'magic-medical', ['Magic']], // the priest's divine healing magic
    ['r2r-village-4', 'gap-missing', ['Services']], // the brickmaker the page says no clay reaches
    ['r2r-metropolis-14', 'tab-split', ['Institutions']], // a marked row, its door read bare
  ];
  test.each(CONTROLS)('(b) THE POSITIVE CONTROL: in %s the detector finds %s with the marks read blind', (seed, kind, blind) => {
    const hits = markPromiseInstances(town(seed), { blind }).filter((i) => i.kind === kind && !i.excluded);
    expect(hits.length).toBeGreaterThan(0);
  }, 120_000);

  // (c) (seed, row, the mark that must lead it, or null: the row bare where its need is not cut) — MARKED rows red at 8aef8e7d4
  const PAIRS = [
    ['r2r-metropolis-14', 'Iron refining', 'Curtailed by the siege.'], // C0341, C0543: the smelter's imported ore under a siege
    ['r2r-town-1', 'Iron refining', null], // KEEP: a calm town's smelter
    ['r2s-under_siege-city-2', 'Pottery and ceramics', 'Curtailed by the siege.'], // the potter's imported clay under a siege
    ['r2s-under_siege-metropolis-0', 'Armed escort', 'Stopped by the siege.'], // C19622: an escort out past the besiegers
    ['r2r-village-8', 'Armed escort', null], // KEEP: the same row in a calm village
    ['r2s-famine-city-1', 'Street food', 'Scarce in the famine.'], // C6632: pies and roasted meats in a famine
    ['r2s-famine-village-2', 'Drink service', 'Scarce in the famine.'], // ale in a grain famine
    ['r2r-village-6', 'Drink service', null], // KEEP: ale in a calm village
    ['r2s-famine-town-1', 'Grain storage', 'Scarce in the famine.'], // the granary's reserves in a grain famine
    ['r2r-town-0', 'Grain storage', null], // KEEP: the same in a calm town
  ];
  test.each(PAIRS)('(c) in %s the row %s leads with %s', (seed, name, mark) => {
    const s = town(seed);
    const svc = row(s, name);
    expect(svc, `${name} prints in ${seed}`).toBeTruthy();
    expect(rowMarkText(s, 'service', svc)).toBe(mark);
  }, 120_000);

  test('(c) S1 (ii): the fish share beside its stopped fishing community carries its house\'s mark (calm: its own line)', () => {
    const besieged = town('r2s-under_siege-thorp-0').economicState.incomeSources.find((x) => x.source === 'Fish & Preserved Produce');
    expect(incomeDescShown(town('r2s-under_siege-thorp-0'), besieged)).toBe('Stopped by the siege.');
    const calm = town('r2r-thorp-44').economicState.incomeSources.find((x) => x.source === 'Fish & Preserved Produce');
    expect(incomeDescShown(town('r2r-thorp-44'), calm)).toBe('Catch landed here and sold fresh or preserved.'); // KEEP: unmarked
  }, 120_000);

  test('(c) S3 (C45429): the medical role is held where the priest\'s divine healing magic prints; absent where nothing heals by magic', () => {
    const village = town('r2r-village-1');
    expect(magicRoleBandShown(village, 'medical', deriveMagicPosture(village).roles.medical)).toBe('occasional');
    const thorp = town('r2r-thorp-1'); // KEEP: the profile's own "absent", nothing printed that heals by magic
    expect(magicRoleBandShown(thorp, 'medical', deriveMagicPosture(thorp).roles.medical)).toBe('absent');
  }, 120_000);
});
