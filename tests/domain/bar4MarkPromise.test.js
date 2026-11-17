/**
 * bar4MarkPromise.test.js — BAR4-SERVICES (BRIEF-BAR4 amendment K4; the chair's directions S1 and S3 of 2026-11-16; each
 * vetoable by the owner): THE DETECTOR OF KIND S1, "THE MARK'S PROMISE", KEPT AS A GUARD.
 *
 * The detector is `tests/helpers/markPromise.js :: markPromiseInstances` (read its header for the kind's seven parts and
 * its named exclusions). THIS FILE REDS WHEN
 *   (a) THE ZERO: any instance the detector finds and no named exclusion explains prints in a town of the census's 720
 *       (born in the census's own configuration shape, CENSUS-3 seedcfg.mjs: `r2r-<size>-<i>` random dials,
 *       `r2s-<crisis>-<size>-<i>` the one crisis ticked). At 8aef8e7d4 it found 94 instances in 54 towns;
 *   (b) THE POSITIVE CONTROL: the detector, its tabs read blind (their marks read as bare), stops finding the record's own
 *       need in a town that holds it (each part of the kind has its town): so it cannot go blind itself;
 *   (d) THE MARK FOLLOWS THE PAGE'S GAP LINE (the chair's question of 2026-11-16, for BAR4-RECORD's cure of the K6 split):
 *       r2r-hamlet-9's 'Charcoal supply', an EX-SPLIT row until BAR4-RECORD cured the split: on the REAL page the gap line
 *       prints and the row takes "Short of …"; and on its record CONSTRUCTED so that nothing answers the house's input (no
 *       goods made, sold or bought, the route isolated, no food source), the row reads short too (re-keyed by identity,
 *       BAR4-SCENES-2, 2026-11-16);
 *   (c) A MARKED pair (each red at 8aef8e7d4) stops leading its row with its mark, or a KEEP pair (the same row where its
 *       need is not cut) starts printing one.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { incomeDescShown } from '../../src/domain/display/economicsCrisisMarks.js';
import { magicRoleBandShown } from '../../src/domain/display/magicProvisionShown.js';
import { deriveMagicPosture } from '../../src/domain/display/dossierViewModel.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { markPromiseInstances } from '../helpers/markPromise.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { RESOURCE_ROW_TRADES } from '../../src/generators/economy/incomeLineSiblings.js';
import { INCOME_TRADE_HOUSES } from '../../src/data/crisisDependence.js';
import * as catalog from '../../src/data/institutionalCatalog.js';

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
    // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): the birth now brings clay in for r2r-village-4's brickmaker (a connected
    // road no siege shuts: `resourceGenerator.js :: importsBroughtAtBirth`); the same brickmaker the page says no clay
    // reaches stands in r2r-town-54, a town of the 720 on no road.
    ['r2r-town-54', 'gap-missing', ['Services']], // the brickmaker the page says no clay reaches
    ['r2r-metropolis-14', 'tab-split', ['Institutions']], // a marked row, its door read bare
    ['r2s-plague_onset-thorp-2', 'spent-fishery', ['Services']], // FS1: the fishing community on its one depleted fishery
  ];
  // BAR4-CLOSE-SWEEP (2026-11-16, the sovereignty lighting law: no new `each`): one parameterless test over the rows, every row run
  test('(b) THE POSITIVE CONTROL: in each town the detector finds its kind with the marks read blind (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, kind, blind]) => {
      const hits = markPromiseInstances(town(/** @type {string} */ (seed)), { blind }).filter((i) => i.kind === kind && !i.excluded);
      expect(hits.length, `${seed}: the detector finds ${kind}`).toBeGreaterThan(0);
    }), '(b) every positive control fires');
  }, 900_000);

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
    ['r2s-plague_onset-thorp-2', 'Fresh fish retail', 'Short of fish.'], // C22221 (FS1): every fishery depleted, whatever the ledger counts
  ];
  test('(c) in each town the row leads with its mark, or prints bare (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(PAIRS, ([seed, name, mark]) => {
      const s = town(/** @type {string} */ (seed));
      const svc = row(s, name);
      expect(svc, `${name} prints in ${seed}`).toBeTruthy();
      expect(rowMarkText(s, 'service', svc), `${seed}: ${name} leads with ${mark}`).toBe(mark);
    }), '(c) every row leads with its mark');
  }, 900_000);

  // BAR4-SCENES-2 (2026-11-16, the chair's direction of 12:16 UTC; re-keyed by identity): r2r-hamlet-9 no longer holds the split.
  // BAR4-RECORD's one reading (`houseInputAtHand.js`) cured it: the record as born says no timber reaches the charcoal burner, and
  // the page says so too. So the arm asserts the REAL page (the gap line prints and the row takes its shortage mark), and keeps one
  // constructed proof (nothing answers the input: no goods made, sold or bought, the route isolated, no food source).
  // RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the owner's supply rule, BR5 and BR8): r2r-hamlet-9's charcoal burner stands in the
  // woodland it proves (BR4 (b)), so the real page holds no split there; the same claim on r2s-religious_conversion-hamlet-2,
  // whose burner the story leaves idle (its woodland used up, nothing bought): the gap line prints and the row is short
  test('(d) the mark follows the page\'s gap line: the row whose input nothing answers reads short, on the real page and on a constructed record', () => {
    const s = town('r2s-religious_conversion-hamlet-2');
    // RE-KEYED BY IDENTITY (BAR8-J-ROWS G1, 2026-11-17): the worked-out burner's gap line is its story's own line (the general
    // line beside it struck); no town of the 720 or the 150 prints the burner's general line alone, so the claim stays here
    expect(resourceGapLines(s).map((l) => String(l?.impact ?? ''))).toContain('The charcoal burner is worked out: its own ground is depleted (Managed woodland).');
    expect(rowMarkText(s, 'service', row(s, 'Charcoal supply'))).toMatch(/^Short of /);
    const e = s.economicState;
    const built = { ...s, config: { ...s.config, tradeRouteAccess: 'isolated' }, economicState: { ...e, tradeAccess: 'isolated', localProduction: [], primaryExports: [], primaryImports: [], foodSecurity: { ...e.foodSecurity, foodRecord: { ...(e.foodSecurity?.foodRecord || {}), foodSources: [], normalImportPct: 0 } } } };
    expect(rowMarkText(built, 'service', row(built, 'Charcoal supply'))).toMatch(/^Short of /);
  }, 120_000);

  test('(e) S1 (ii)\'s declaration is the generator\'s own: each trade\'s house words over the catalogue\'s names give its declared ids', () => {
    /** @type {Set<string>} */
    const names = new Set();
    const walk = (/** @type {any} */ x, d = 0) => {
      if (d > 5 || !x || typeof x !== 'object') return;
      for (const [k, v] of Object.entries(x)) { if (v && typeof v === 'object') { if (!Array.isArray(x)) names.add(k); walk(v, d + 1); } if (k === 'name' && typeof v === 'string') names.add(v); }
    };
    walk(catalog.institutionalCatalog);
    const derived = Object.fromEntries(Object.entries(RESOURCE_ROW_TRADES).map(([title, trade]) => [title,
      [...new Set([...names].filter((n) => trade.house.test(n.toLowerCase())).map((n) => catalog.catalogIdForName(n)).filter(Boolean))].sort()]));
    derived['Fish & Maritime Produce'] = derived['Fish & Preserved Produce'];
    expect(Object.fromEntries(Object.entries(INCOME_TRADE_HOUSES).map(([k, v]) => [k, [...v].sort()]))).toEqual(derived);
  });

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
