/**
 * bar5MarksLaw2.test.js — BAR5-MARKS (BRIEF-BAR5 Amendment L, L4; the chair's ruling WM1 of 2026-11-16, vetoable by the
 * owner): LAW 2'S ROWS OF A HOUSE OR A SERVICE, KEPT AS A GUARD. What the crisis stops is not on offer unmarked.
 *
 * The page form of the six rules (`L2.siege.abroad`, `L2.siege.cutgood`, `L2.famine.meat`, `L2.famine.work`, `L2.war.iron`,
 * `L2.war.animals`) is BAR5-AUDIT-B's `tests/helpers/pageLaws/law2.mjs`, read over a census dump. A test corpus carries
 * births, not dumps, so the guard reads the same rules off the born record and the one mark leaf every tab prints through
 * (`tests/helpers/pageLaws/law2Marks.mjs :: law2MarksInstances`). THIS FILE REDS WHEN
 *   (a) THE ZERO: any instance the detector finds and no named exclusion explains, in a town of the census's 720 (born in
 *       the census's own configuration shape: `r2r-<size>-<i>` random dials, `r2s-<crisis>-<size>-<i>` the one crisis);
 *   (b) THE POSITIVE CONTROL: the detector, the marks read blind, stops finding its rule in a census town whose record holds
 *       the reach (one town a rule); and on a CONSTRUCTED record (a calm town's smiths and stables, the war and its two
 *       lines written onto it: the read's rows C8174 and C8475) the rows read marked, and blind they are found;
 *   (c) THE ONE FACT OF THE WAR (`facts/warReach.js`): the paddocks' line it reads is still the pool's own line.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';
import { warTakesOf, RECEIPTS, WAR_TAKES_IRON, WAR_TAKES_ANIMALS } from '../../src/domain/facts/warReach.js';
import { STRESS_DESCS } from '../../src/data/narrativeData.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { speakTierNoun } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';
import { law2MarksInstances } from '../helpers/pageLaws/law2Marks.mjs';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

describe('LAW 2\'s rows of a house or a service (BAR5-MARKS): what the crisis stops is not on offer unmarked', () => {
  test('(a) THE ZERO over the census\'s 720: every instance the detector finds is cured or named', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures(CENSUS, (seed) => {
      for (const i of law2MarksInstances(town(seed))) if (!i.excluded) found.push(`${seed} · ${i.rule} · ${i.kind} · ${i.row} @ ${i.house} · ${i.line}`);
    });
    expectNoSeedFailures(failures, 'every census town is born and read');
    expect(found).toEqual([]);
  }, 1_200_000);

  // (b) one census town a rule whose record holds the reach, read blind (BAR5-MARKS's measure at 600b7683a, the 720)
  const CONTROLS = [
    ['r2s-under_siege-metropolis-0', 'L2.siege.abroad'],
    ['r2r-metropolis-14', 'L2.siege.cutgood'],
    ['r2s-wartime-metropolis-0', 'L2.war.animals'],
  ];
  test('(b) THE POSITIVE CONTROL: in each town the detector finds its rule with the marks read blind (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, rule]) => {
      const hits = law2MarksInstances(town(seed), { blind: true }).filter((i) => i.rule === rule && !i.excluded);
      expect(hits.length, `${seed}: the detector finds ${rule}`).toBeGreaterThan(0);
    }), '(b) every positive control fires');
  }, 900_000);

  test('(b) THE CONSTRUCTED CONTROL: a calm town\'s forge and stables, the war\'s two lines written on: marked, and found blind', () => {
    const calm = town('r2r-city-0');
    const hasSmith = (calm.institutions || []).some((/** @type {any} */ h) => /^Blacksmiths/.test(h.name));
    const hasStable = (calm.institutions || []).some((/** @type {any} */ h) => h.name === 'Stable district');
    expect(hasSmith && hasStable, 'r2r-city-0 holds a forge and a stable district').toBe(true);
    const name = String(calm.name);
    const paddocks = STRESS_DESCS.wartime.map((/** @type {any} */ e) => (typeof e === 'function' ? e(name) : e.text(name))).find((t) => RECEIPTS.test(t));
    const war = {
      ...calm,
      stress: { type: 'wartime' }, stressors: { type: 'wartime' }, stresses: undefined,
      arrivalScene: `${calm.arrivalScene || ''} ${paddocks}`,
      // RE-KEYED BY IDENTITY (BIRTH-3, 2026-11-17; the chair's ruling BR9: a mark the players see is never read off the DM's
      // hooks): the war's iron is planted as the hook's own predicate reads it (domain/facts/warIronHook.js), the town's
      // dependency on a metal and an iron import, kept on every view, in place of the hook's text
      economicViability: { ...calm.economicViability, dependencies: [...(calm.economicViability?.dependencies || []), { title: 'Imports metals' }] },
      economicState: { ...calm.economicState, primaryImports: [...(calm.economicState?.primaryImports || []), 'Iron'] },
    };
    expect([...warTakesOf(war)].sort()).toEqual([WAR_TAKES_ANIMALS, WAR_TAKES_IRON].sort());
    expect(warTakesOf(calm)).toEqual([]); // KEEP: the calm record, the war's lines absent, takes nothing
    const rows = serviceRowsOf(war.availableServices).map(({ svc }) => svc);
    const repairs = rows.find((/** @type {any} */ v) => /^Blacksmiths/.test(String(v.institution)) && /^(Repairs|Tool manufacture)$/.test(v.name));
    const hire = rows.find((/** @type {any} */ v) => v.institution === 'Stable district' && v.name === 'Horse hire');
    expect(rowMarkText(war, 'service', repairs)).toBe('Curtailed by the war.');
    expect(rowMarkText(war, 'service', hire)).toBe('Curtailed by the war.');
    expect(rowMarkText(calm, 'service', hire)).toBe(null); // KEEP: the same row in the calm town, bare
    const blind = law2MarksInstances(war, { blind: true }).map((i) => i.rule);
    expect(blind).toContain('L2.war.iron');
    expect(blind).toContain('L2.war.animals');
    expect(law2MarksInstances(war).filter((i) => /^L2\.war\./.test(i.rule))).toEqual([]);
  }, 120_000);

  // a line cured by its TWIN (the late re-read stores it): the original written back onto the record, the detector finds it
  test('(b) THE CONSTRUCTED CONTROL of a twin: the cobbler\'s steady work in a famine and the bowyers\' caravans under a siege', () => {
    const famine = town('r2s-famine-village-0');
    const cobbler = (famine.institutions || []).find((/** @type {any} */ h) => h.name === 'Cobbler');
    expect(cobbler, 'r2s-famine-village-0 holds a cobbler').toBeTruthy();
    expect(law2MarksInstances(famine).filter((i) => i.rule === 'L2.famine.work')).toEqual([]); // the twin prints
    // the originals and their twins, computed from the late table (no literal anchor): the set whose original the house printed
    // each set as the late re-read speaks it in the town's own tier noun (`assembleSettlement.js :: readHouseDescsLate`)
    const spokenSets = (/** @type {any} */ t) => Object.values(DESC_LATE_SIBLINGS).map((set) => set.map((/** @type {any} */ l) => speakTierNoun(l.text, tierNounFor(t.tier))));
    const setOf = (/** @type {string} */ desc, /** @type {any} */ t) => spokenSets(t).find((set) => set.includes(desc));
    const cobblerSet = /** @type {string[]} */ (setOf(String(cobbler.desc), famine));
    expect(cobblerSet, 'the cobbler printed a twin of the late table').toBeTruthy();
    expect(String(cobbler.desc)).toBe(cobblerSet[1]);
    // BAR6-MARKS (2026-11-16, the premise re-held by construction): the cobbler's trade now reads its hides
    // (`houseInputAtHand.js :: housesWantingTradeInput`), and this town, the census's one famine town with a cobbler, has no
    // herds and imports no hides, so its cobbler is "Short of hides." and the bare row this control needs is gone; the
    // constructed record also brings hides in, so the cobbler is not short and its original line stands bare as before
    const back = { ...famine, economicState: { ...famine.economicState, primaryImports: [...(famine.economicState?.primaryImports || []), 'Animal hides'] },
      institutions: famine.institutions.map((/** @type {any} */ h) => (h === cobbler ? { ...h, desc: cobblerSet[0] } : h)) };
    expect(law2MarksInstances(back).map((i) => i.rule)).toContain('L2.famine.work');
    const siege = town('r2r-metropolis-14');
    const bowyer = (siege.institutions || []).find((/** @type {any} */ h) => /^Bowyers/.test(h.name));
    expect(bowyer, 'r2r-metropolis-14 holds the bowyers').toBeTruthy();
    const bowyerSet = /** @type {string[]} */ (setOf(String(bowyer.desc), siege));
    expect(bowyerSet, 'the bowyers printed a twin of the late table').toBeTruthy();
    expectAbsentWithAnchor([String(bowyer.desc)], bowyerSet[0], bowyerSet[1], 'r2r-metropolis-14: the late re-read stored the siege\'s twin in the bowyers\' slot');
    const back2 = { ...siege, institutions: siege.institutions.map((/** @type {any} */ h) => (h === bowyer ? { ...h, desc: bowyerSet[0] } : h)) };
    expect(law2MarksInstances(back2).map((i) => i.rule)).toContain('L2.siege.abroad');
  }, 120_000);

  test('(c) the war\'s paddocks line warReach reads is the pool\'s own line, once', () => {
    const lines = STRESS_DESCS.wartime.map((/** @type {any} */ e) => (typeof e === 'function' ? e('Ashford') : e.text('Ashford')));
    expect(lines.filter((t) => RECEIPTS.test(t))).toHaveLength(1);
  });
});
