/**
 * bar5LawBandFloor.test.js — BAR5-BAND (BRIEF-BAR5 section "BAR5-BAND", Amendment L4; the chair's ruling LB1 of
 * 2026-11-16, vetoable by the owner): THE FOUNDATIONS' LAW-AND-ORDER WORD IN A QUIET PLACE, read through its ONE reader
 * (`domain/display/foundationBandShown.js :: foundationBandShown`, whose law row reads THE ONE HOME `domain/facts/lawBand.js ::
 * lawBandOf`, the chair's ruling LB2; the floor `quietPlaceKeepsLaw` is written there) and kept by the rule's
 * own detector (`tests/helpers/pageLaws/law1Band.mjs :: law1cBand`, rule `1c-band/quiet`).
 *
 * The page the detector reads is rebuilt from the record as the tabs print it: the Foundations row
 * (`Law & order · <band>`, SubstrateTab.jsx through `foundationBandShown`) and the Overview's Safety tag
 * (`labelBands.js :: safetyBandOf`). Births are the census's own (CENSUS-3 seedcfg.mjs: the r2r-, r2s- and bar0- arms).
 *   1. THE FOUR REAL ROWS of the wide read (bar0-hamlet-calm-rand-33, -36, bar0-thorp-calm-rand-32: Critical;
 *      bar0-hamlet-calm-rand-34: Collapsed) print "Strained"; each is the POSITIVE CONTROL: on the model's own band
 *      (the page at the base) the detector fires.
 *   2. THREE CONTROLS keep the model's band: a small place under a crisis, a small place whose Safety word is Unsafe or
 *      Dangerous, a place that keeps an office of the law (each a real town of the census's 720).
 *   3. THE ZERO over the census's 720: the detector finds no instance of the rule; and the leaf's own reading of the
 *      quiet place (no display import) equals the page's (the Overview's `safetyBandOf`, the detector's facts) in every town.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { bandForVariable } from '../../src/domain/causalState.js';
import { foundationBandShown } from '../../src/domain/display/foundationBandShown.js';
import { lawBandOf, ownCrimeUnsafe, quietPlaceKeepsLaw } from '../../src/domain/facts/lawBand.js';
import { safetyBandOf } from '../../src/domain/display/labelBands.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law1cBand, quietFactsOf } from '../helpers/pageLaws/law1Band.mjs';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs, its three arms verbatim (as tests/domain/bar4SafetyKinds.test.js). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
const cap = (/** @type {string} */ b) => b.charAt(0).toUpperCase() + b.slice(1);
/** The model's band and the band the Foundations print. @param {any} s */
const bandsOf = (s) => { const model = String(bandForVariable(s, 'law_order')); return { model, shown: foundationBandShown(s, 'law_order', model) }; };
/** The two printed facts the detector reads, rebuilt from the record. @param {any} s @param {string} band */
const pageOf = (s, band) => {
  const label = s?.economicState?.safetyProfile?.safetyLabel;
  return { 'Summary/Foundations': [`Law & order · ${cap(band)}`], 'Summary/Overview': ['Safety', String(safetyBandOf(label) ?? label)] };
};
const quietHits = (/** @type {string} */ seed, /** @type {string} */ band) => law1cBand({ record: town(seed), tabs: pageOf(town(seed), band), town: seed }).filter((x) => x.law === '1c-band/quiet');

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const STRESSES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset', 'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** THE CENSUS'S 720 (CENSUS-3 seeds.txt): r2r-<size>-0..59 and r2s-<stress>-<size>-0..3. */
const CENSUS_720 = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...STRESSES.flatMap((st) => SIZES.flatMap((size) => [0, 1, 2, 3].map((i) => `r2s-${st}-${size}-${i}`))),
];

/** The wide read's four rows the strict second check let STAND (2026-11-16), with the model's band. */
const REAL_ROWS = /** @type {const} */ ([
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit): bar0-hamlet-calm-rand-33's model lit reads strained, so no floor lifts it; the lowest bar0-hamlet-calm-rand
  // quiet place whose model reads critical is rand-1 (1 8 9 16 17 19 ... of 0..149)
  ['bar0-hamlet-calm-rand-1', 'critical'], ['bar0-hamlet-calm-rand-36', 'critical'],
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit) (A JUDGEMENT, AT ANOTHER SIZE): bar0-hamlet-calm-rand-34's model lit reads critical, and no
  // bar0-hamlet-calm-rand quiet place of 0..799 reads collapsed; the lowest quiet place of the file's other calm family that
  // does is bar0-thorp-calm-rand-185 (185 188 224 of 0..799)
  ['bar0-thorp-calm-rand-32', 'critical'], ['bar0-thorp-calm-rand-185', 'collapsed'],
]);
/** THE CONTROLS THAT MUST NOT MOVE (real towns of the census's 720, read at 600b7683a): seed, the model's band, why. */
const CONTROLS = /** @type {Array<[string, string, string]>} */ ([
  ['r2s-infiltrated-thorp-0', 'critical', 'a small place under a crisis (infiltrated), Safety Moderate, no office of the law'],
  ['r2r-hamlet-19', 'critical', 'a small place whose Safety word is Dangerous (a crime wave stands), no office of the law'],
  ['r2r-town-0', 'critical', 'a place that keeps a Town watch and a Courthouse, no crisis, Safety Moderate'],
]);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR5-BAND LB1: a quiet place without an office of the law prints its law at least strained', () => {
  test('the wide read four rows: the model reads its band; the Foundations print Strained; the detector fired at the base', () => {
    expectNoSeedFailures(collectSeedFailures(REAL_ROWS, ([seed, model]) => {
      const s = town(seed);
      const b = bandsOf(s);
      expect(b.model, `${seed}: the model's band (the score does not move)`).toBe(model);
      expect(quietPlaceKeepsLaw(s), `${seed}: the floor stands`).toBe(true);
      expect(lawBandOf(s), `${seed}: the one home reads the floor`).toBe('strained');
      expect(b.shown, `${seed}: the row prints the floor`).toBe('strained');
      expect(quietHits(seed, b.model).map((x) => x.line), `${seed}: POSITIVE CONTROL: the page at the base is the rule's instance`).toEqual([`Law & order · ${cap(model)}`]);
      expect(quietHits(seed, b.shown).map((x) => x.line), `${seed}: the page at the tip prints "Law & order · Strained" and is no instance`).toEqual([]);
    }), 'every row the strict second check let stand');
  });

  test('the controls keep their band', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, model]) => {
      const s = town(seed);
      const b = bandsOf(s);
      expect(b.model, `${seed}: the model's band`).toBe(model);
      expect(quietPlaceKeepsLaw(s), `${seed}: no floor`).toBe(false);
      expect(b.shown, `${seed}: the row prints the model's band`).toBe(model);
    }), 'every control keeps its band');
  });

  test('the zero over the census\'s 720: no quiet page prints the law failed', () => {
    const failures = collectSeedFailures(CENSUS_720, (seed) => {
      const s = town(seed);
      const hits = quietHits(seed, bandsOf(s).shown);
      expect(hits.map((x) => `${x.line} (Safety ${x.safety}; offices ${quietFactsOf(s).offices.length})`), `${seed}: the rule's instances`).toEqual([]);
      const f = quietFactsOf(s);
      const onPage = !f.offices.length && !f.crises.length && !f.crimeWave && ['Very Safe', 'Safe', 'Moderate'].includes(String(safetyBandOf(s?.economicState?.safetyProfile?.safetyLabel)));
      expect(quietPlaceKeepsLaw(s), `${seed}: the leaf's quiet place is the page's`).toBe(onPage);
    });
    expectNoSeedFailures(failures);
  }, 900_000);
});

// WORDS-2, the tenth chair's RULING G9 (1) (E2's census #3+4): where the place's own crime makes it Unsafe (a plain stored
// label below Moderate), "Law & order" does not read Adequate: the band is capped at `strained`, as under a crime wave.
// Red first by name on 0ec96f13d8: C dp-city-12, -140, -143 printed "Adequate" beside "Unsafe". The control, a rung set by a
// crisis (C dp-city-34, "Volatile — Succession Crisis"), keeps its band.
describe('G9 (1): the place\'s own crime caps the law\'s band', () => {
  const C = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  test('C dp-city-12, -140, -143: a plain "Unsafe", and the band is not above strained', () => {
    for (const seed of ['dp-city-12', 'dp-city-140', 'dp-city-143']) {
      const s = C(seed);
      expect(ownCrimeUnsafe(s), seed).toBe(true);
      expect(bandForVariable(s, 'law_order'), `${seed}: the model's band is unchanged`).toBe('adequate');
      expect(lawBandOf(s), seed).toBe('strained');
    }
  });
  test('the control: C dp-city-34 (a succession crisis set its rung) keeps "adequate"', () => {
    const s = C('dp-city-34');
    expect(ownCrimeUnsafe(s)).toBe(false);
    expect(lawBandOf(s)).toBe('adequate');
  });
});
