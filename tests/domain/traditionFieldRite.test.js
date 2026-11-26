/**
 * traditionFieldRite.test.js — B1(ii), NO TRADITION BLESSES FIELDS THE PLACE DOES NOT HAVE (the tenth chair's G64).
 *
 * `traditions/genesis.js :: deriveFoundingTraditions` draws an addition row's element and act as it always has; where the
 * drawn element is `field` and the place refuses it (a record THIS engine bore, whose food record NAMES its sources and
 * `grain` is not among them, and no farmland on the roster), the row takes the next attempt's draw. The twins must NOT
 * move: a place that grows grain; a place with farmland and no grain; a place whose source list is empty (unanswered); a
 * record an earlier engine bore (the legacy stamp, or no stamp at all), which keeps its whole set.
 *
 * RED FIRST (the line 9d22f040e): the born place below shows "The Quiet Furrow Feast" (element `field`, row 1).
 */
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { deriveFoundingTraditions, fieldRiteRefused } from '../../src/domain/traditions/genesis.js';
import { GENERATOR_VERSION, LEGACY_GENERATOR_VERSION, bornAtOrAfter } from '../../src/domain/settlement.schema.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

/** The seed's identity: a plains road town whose row 1 draws a rite of the fields. */
const IDENTITY = { _seed: 'furrow-4', tier: 'town', population: 3000, config: { culture: 'celtic', terrainType: 'plains', tradeRouteAccess: 'road' } };
/** @param {unknown} foodSources @param {Record<string, unknown>} [over] */
const place = (foodSources, over = {}) => ({
  ...IDENTITY,
  generatorVersion: GENERATOR_VERSION,
  institutions: [{ name: 'Tavern' }],
  economicState: { foodSecurity: { foodRecord: { foodSources } } },
  ...over,
});
/** @param {ReturnType<typeof deriveFoundingTraditions>} set */
const elements = (set) => set.map((t) => t.coreMotif.element);
/** the set as drawn before the rule: an identity alone answers nothing the rule reads */
const before = deriveFoundingTraditions(IDENTITY);

describe('B1(ii): a born place that names no grain and holds no farmland shows no rite of the fields', () => {
  test('the premise: the seed draws a field rite in an addition row', () => {
    expect(elements(before)).toContain('field');
    expect(elements(before)[0]).not.toBe('field');
  });

  test('livestock and fish, no farmland: the field row takes another draw; every other row draws as before', () => {
    const after = deriveFoundingTraditions(place(['livestock', 'fish']));
    expectPresentThenAbsent(elements(before), elements(after), 'field', 'the rule replaces the field row');
    expect(after.length).toBe(before.length);
    const row = elements(before).indexOf('field');
    after.forEach((t, i) => {
      if (i === row) return;
      expect(t.coreMotif, `row ${i}'s draw`).toEqual(before[i].coreMotif);
    });
  });
});

describe('B1(ii): the twins keep their whole set', () => {
  const same = (/** @type {unknown} */ s) => expect(JSON.stringify(deriveFoundingTraditions(/** @type {any} */ (s)))).toBe(JSON.stringify(before));
  test('a place that grows grain', () => same(place(['grain', 'fish'])));
  test('a place with farmland and no grain', () => same(place(['livestock'], { institutions: [{ name: 'Tavern' }, { name: 'Farmland' }] })));
  test('a place whose source list is empty, or absent (unanswered)', () => {
    same(place([]));
    same(place(undefined));
  });
  test('a record an earlier engine bore keeps its false field rite (legacy stamp, or none)', () => {
    same(place(['livestock', 'fish'], { generatorVersion: LEGACY_GENERATOR_VERSION }));
    const { generatorVersion: _drop, ...stampless } = place(['livestock', 'fish']);
    same(stampless);
  });
});

/*
 * G72 (1) (CURE-119): THE FIELD RULE'S STAMP IS A FLOOR, NOT AN EQUALITY. `fieldRiteRefused` is asked of a record whose stamp
 * is AT OR AFTER the engine that first carried the rule (`FIELD_RITE_SINCE = '0.10.0'`, a literal in the rule's own file),
 * through `settlement.schema.js :: bornAtOrAfter`: three dot-separated whole numbers, compared number by number.
 * RED FIRST (the equality reader `bornByThisEngine` of ef10a71f3a): "a record stamped 0.11.0 ... is refused" failed
 * (expected false to be true), and so did the simulated next release: the 0.10.0-born place drew `field` again.
 */
describe('G72 (1): the field rule\'s stamp is a floor', () => {
  test('records stamped 0.10.0, 0.11.0 and 1.0.0, whose food record refuses, are refused a field rite', () => {
    for (const stamp of ['0.10.0', '0.11.0', '1.0.0']) {
      const s = place(['livestock', 'fish'], { generatorVersion: stamp });
      expect(fieldRiteRefused(s), stamp).toBe(true);
      expectPresentThenAbsent(elements(before), elements(deriveFoundingTraditions(s)), 'field', `stamp ${stamp}`);
    }
  });
  test('0.9.0, no stamp, legacy, 0.10, 0.10.0-rc1 and numbers are not asked: the whole set stands', () => {
    const { generatorVersion: _drop, ...stampless } = place(['livestock', 'fish']);
    const records = [stampless, ...['0.9.0', 'legacy', '0.10', '0.10.0-rc1', 10, 0.1, null].map((stamp) => place(['livestock', 'fish'], { generatorVersion: stamp }))];
    for (const s of records) {
      expect(fieldRiteRefused(s), String(s.generatorVersion)).toBe(false);
      expect(JSON.stringify(deriveFoundingTraditions(s))).toBe(JSON.stringify(before));
    }
  });
  test('the reader compares number by number, never as text; a malformed floor or no record answers false', () => {
    expect([['0.10.0', '0.9.0'], ['0.9.0', '0.10.0'], ['0.10.0', '0.10.0'], ['0.10.1', '0.10.0'], ['2.0.0', '10.0.0'], ['0.10.0', '0.10']]
      .map(([have, floor]) => bornAtOrAfter({ generatorVersion: have }, floor))).toEqual([true, false, true, true, false, false]);
    expect([bornAtOrAfter(null, '0.10.0'), bornAtOrAfter('0.10.0', '0.10.0')]).toEqual([false, false]);
  });
  test('the next release, simulated: with the build constant read as 0.11.0, a 0.10.0-born unlit place still shows its replaced rite', async () => {
    vi.resetModules();
    // The module mocked as tests/store/rederiveGuard.test.js G6 does. A real release moves the constant every reader closes
    // over; a spread does not re-bind a closure, so a reader of the constant (the equality reader G72 (1) removed) is re-bound
    // here to the moved constant: the simulation is of the release, not of one export.
    vi.doMock('../../src/domain/settlement.schema.js', async (importOriginal) => {
      const real = /** @type {Record<string, unknown>} */ (await importOriginal());
      const moved = { ...real, GENERATOR_VERSION: '0.11.0' };
      if ('bornByThisEngine' in real) moved.bornByThisEngine = (/** @type {any} */ r) => !!r && typeof r === 'object' && r.generatorVersion === '0.11.0';
      return moved;
    });
    try {
      const schema = await import('../../src/domain/settlement.schema.js');
      expect(schema.GENERATOR_VERSION, 'the premise: the constant has moved').toBe('0.11.0');
      const next = await import('../../src/domain/traditions/genesis.js');
      const born = place(['livestock', 'fish'], { generatorVersion: '0.10.0' });
      expect(next.fieldRiteRefused(born)).toBe(true);
      expectPresentThenAbsent(elements(before), elements(next.deriveFoundingTraditions(born)), 'field', 'the replaced rite does not come back');
    } finally {
      vi.doUnmock('../../src/domain/settlement.schema.js');
      vi.resetModules();
    }
  });
});

/*
 * G72 (4) (CURE-119): THE FIELD RULE READS THE PAGE'S GRAIN. The rite stands where the page's own "Produced locally" or
 * Exports list prints a grain good (the whole word `grain`, lower-cased; flour does not count: a mill is not a field, G71),
 * read through the leaf that prints those lists (`display/tradeListDisplay.js :: tradeListsAsPrinted`).
 * RED FIRST (ef10a71f3a + cures 1, 2): "the reader's case keeps The Procession of the Fields" failed: r7d-city-24 (desert,
 * date palms, sources ["fish"]) prints Exports "Desert grain" and Produced locally "grain", and was refused the rite.
 */
describe('G72 (4): the field rule reads the page\'s grain', () => {
  /** The second reader's dials (its `r7x` corpus), with the desert set (its `r7d` keys). */
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {any} s */
  const printed = (s) => { const l = tradeListsAsPrinted(s); return [...l.exports, ...l.local].map((x) => String(x).toLowerCase()); };
  /** @type {any} */ let city;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    city = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'city', terrainOverride: 'desert' }), null, { seed: 'r7d-city-24', customContent: {} });
  }, 120_000);

  test('the reader\'s case, r7d-city-24, whose page prints grain, keeps The Procession of the Fields', () => {
    expect(city.economicState.foodSecurity.foodRecord.foodSources, 'the premise: the food record names fish alone').toEqual(['fish']);
    expect(printed(city).some((x) => /\bgrain\b/.test(x)), 'the premise: the page prints grain').toBe(true);
    expect(fieldRiteRefused(city)).toBe(false);
    expect(deriveFoundingTraditions(city).map((t) => t.name)).toContain('The Procession of the Fields');
  });
  test('a place whose page prints only flour (its mill grinds grain bought in) is still refused', () => {
    const flour = place(['livestock', 'fish'], {
      institutions: [{ name: 'Tavern' }, { name: 'Mill' }],
      economicState: { foodSecurity: { foodRecord: { foodSources: ['livestock', 'fish'] } }, localProduction: ['Flour'], primaryExports: ['Flour'], primaryImports: ['Grain'] },
    });
    expect(printed(flour), 'the premise: the page prints flour made and sent out').toEqual(['flour', 'flour']);
    expect(fieldRiteRefused(flour)).toBe(true);
    expectPresentThenAbsent(elements(before), elements(deriveFoundingTraditions(flour)), 'field', 'flour is not grain');
  });
});
