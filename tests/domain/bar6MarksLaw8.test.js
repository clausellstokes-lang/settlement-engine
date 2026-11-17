/**
 * bar6MarksLaw8.test.js — BAR6-MARKS (BRIEF-BAR6 B2/L4; vetoable by the owner): LAW 8'S MARK RULES, KEPT AS A GUARD. The
 * mark leaf reads every worst state: a house whose trade's good the page says is not had, a mine on a spent ground, the
 * famine's harvest grain, and the card's state word beside the leaf's mark.
 *
 * The page form of the rules (8a.input, 8a.mild, 8b.extract, 8c) is auditor D's `tests/helpers/pageLaws/law8.mjs`, read over a
 * census dump. A test corpus carries births, not dumps, so the guard reads the same rules off the born record and the one
 * mark leaf every tab prints through (`tests/helpers/pageLaws/law8Marks.mjs :: law8MarksInstances`). THIS FILE REDS WHEN
 *   (a) THE ZERO: an instance in a town of the census's 720 (born in the census's own configuration shape) that is not one of
 *       the four houses left by name (LEFT below: the reader's import match does not yet read "Herbs and forage" as
 *       herbs, nor game meat as the butchers' stock; a ratchet: the list only shrinks);
 *   (b) THE POSITIVE CONTROL: the detector, the marks read blind, stops finding its rule in a census town whose record
 *       holds the worst state (one town a rule, measured at afa46d644 with this cure).
 */
import { describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { law8MarksInstances } from '../helpers/pageLaws/law8Marks.mjs';
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
  m = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
  if (!m) throw new Error(`not a census seed: ${seed}`);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
};
const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, born(seed)); return towns.get(seed); };

/** The houses left by name (BAR6-MARKS's hand-back, "what is left"): `<seed> · <rule> · <house>`. */
// STRUCK BY ITS OWN RULE (BIRTH-1, 2026-11-17): 'r2r-town-51 · 8a.input · Apothecary (established)' is cured: the birth
// brings its medicinal herbs in (`resourceGenerator.js :: importsBroughtAtBirth`, "Medicinal herbs").
const LEFT = [
  'r2r-town-54 · 8a.input · Butchers (3-8)',
  'r2r-metropolis-19 · 8a.input · Butchers (3-8)',
  'r2s-religious_conversion-town-2 · 8a.input · Apothecary (established)',
];

describe('LAW 8\'s mark rules (BAR6-MARKS): the mark leaf reads every worst state', () => {
  test('(a) THE ZERO over the census\'s 720: every instance is cured, or one of the houses left by name', () => {
    /** @type {string[]} */
    const found = [];
    const failures = collectSeedFailures(CENSUS, (seed) => {
      for (const i of law8MarksInstances(town(seed))) found.push(`${seed} · ${i.rule} · ${i.house}`);
    });
    expectNoSeedFailures(failures, 'every census town is born and read');
    expect(found.filter((f) => !LEFT.includes(f)), 'an instance not left by name').toEqual([]);
    expect(LEFT.filter((f) => !found.includes(f)), 'a house left by name is cured: strike it from LEFT').toEqual([]);
  }, 1_800_000);

  // (b) one census town a rule whose record holds the worst state, read blind (measured at afa46d644 with this cure)
  const CONTROLS = [
    // RE-KEYED BY IDENTITY (BIRTH-1, 2026-11-17): r2r-city-0's commercial sawmill (8a.input) and carpenters (8a.mild) are fed
    // now, the birth bringing their timber in on a connected road (`importsBroughtAtBirth`). 8a.input: the same house, a
    // Sawmill (commercial) short of timber, in r2r-city-115, a calm census-shaped city on no road. 8a.mild: no timber house
    // is marked short on a road any more; the rule's own case, a marked house whose card head prints a milder state, in
    // r2r-city-19, a city of the 720 (its daily markets under the outbreak).
    ['r2r-city-115', '8a.input'],
    ['r2r-city-19', '8a.mild'],
    ['r2r-city-18', '8b.extract'],
    ['r2r-village-24', '8c.harvest'],
    ['r2r-city-44', '8c.failed'],
  ];
  test('(b) THE POSITIVE CONTROL: in each town the detector finds its rule with the marks read blind (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CONTROLS, ([seed, rule]) => {
      const blind = law8MarksInstances(town(/** @type {string} */ (seed)), { blind: true }).filter((i) => i.rule === rule);
      expect(blind.length, `${seed}: the detector finds ${rule} blind`).toBeGreaterThan(0);
    }), '(b) every positive control fires');
  }, 900_000);
});

// EG1 (the chair, 2026-11-16): the eager fact reads the war off the stress container (`houseInputAtHand.js :: atWar`, through
// `canonStressors`), not through the lazily pinned `crisisKind.js`; over the census's 720 it answers as `crisisOf` does
describe('EG1: the war read import-free answers as the crisis reader does', () => {
  test('atWar equals crisisOf(...).has("wartime") in every town of the 720 (every row)', async () => {
    const { atWar } = await import('../../src/domain/facts/houseInputAtHand.js');
    const { crisisOf } = await import('../../src/domain/facts/crisisKind.js');
    expectNoSeedFailures(collectSeedFailures(CENSUS, (seed) => {
      expect(atWar(town(seed)), `${seed}: the two readings of the war`).toBe(crisisOf(town(seed)).has('wartime'));
    }), 'every census town reads one war');
  }, 1_800_000);
});

// RULING CN1 (the chair, 2026-11-16; RECORD's 9d.isolated): an isolated village or larger still has a poor road
// (`facts/tradeReach.js :: minorRoutesReach`): its need line says the goods come dear and late by the minor roads; the
// clause "no trade road reaches" is kept where no poor road reaches (the same record read as a hamlet)
describe('CN1: the isolated need line reads the poor road', () => {
  test('r2r-town-9 (isolated, a town): the twin prints; read as a hamlet, the old clause prints (each way)', async () => {
    const { chainNeedLine } = await import('../../src/domain/display/chainNeedShown.js');
    const s = town('r2r-town-9');
    const lines = (/** @type {any} */ rec) => (rec.economicState?.activeChains || []).map((/** @type {any} */ c) => chainNeedLine(c, rec, true)).filter(Boolean);
    const asTown = lines(s), asHamlet = lines({ ...s, tier: 'hamlet' });
    expect(asTown.length, 'r2r-town-9 prints a need line').toBeGreaterThan(0);
    expect(asTown.every((/** @type {string} */ l) => /by the minor roads\.$/.test(l)), `the twin: ${asTown.join(' | ')}`).toBe(true);
    expect(asHamlet.every((/** @type {string} */ l) => /: no trade road reaches /.test(l)), `the old clause: ${asHamlet.join(' | ')}`).toBe(true);
  }, 300_000);
});
