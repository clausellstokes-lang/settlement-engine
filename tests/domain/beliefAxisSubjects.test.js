/**
 * beliefAxisSubjects.test.js — SP-B. The three believed-world families, where their
 * bodies are readable.
 *
 * THE ANTI-FALLBACK DISCIPLINE IS THE POINT OF THE FIRST BLOCK. A fixture written by the
 * same hand that wrote the deriver will happily exercise a rung the pipeline can never
 * produce — the recorded "fixture mirrors the deriver" class, where a rung reads a key
 * nothing writes and the dead arm survives every green run. So every band edge here is
 * proven against REALLY GENERATED settlements, driven through generateSettlementPipeline
 * across the tier and trade-route space, and the assertion is on the rung SET the corpus
 * produces. A rung that stops being reachable reds instead of quietly dying.
 *
 * The remaining blocks are the fold's own claims: staleness (a wrong belief survives a
 * garbled telling), independence (lighting one family moves only its field), and the
 * drop-when-absent contract at every level.
 */
import { describe, expect, test } from 'vitest';

import {
  SCARCITY_BANDS,
  STORES_BANDS,
  ROUTE_POSITION_BANDS,
  PULL_BANDS,
  DEVOTION_BANDS,
  SUBJECT_AXIS_TUNING,
  scarcityGroundTruth,
  conditionsGroundTruth,
  devotionGroundTruth,
  subjectGroundTruth,
  foldSubjectAxes,
} from '../../src/domain/worldPulse/beliefAxisSubjects.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const ALL = Object.freeze({ scarcity: true, conditions: true, devotion: true });

/** A real generated settlement. Deterministic per (tier, route, culture). */
function realSettlement(settType, tradeRouteAccess, culture) {
  return generateSettlementPipeline(
    { settType, culture, tradeRouteAccess },
    null,
    { seed: `spb-axis-${settType}-${tradeRouteAccess}-${culture}`, customContent: {} },
  );
}

const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const ROUTES = Object.freeze(['isolated', 'road', 'river', 'port', 'crossroads', 'mountain_pass']);
/**
 * TWO CULTURES, MEASURED RATHER THAN CHOSEN. One culture's 36 settlements reach every
 * band edge in the wave except the food SURPLUS arm, whose ratio never crosses 1.10 in
 * that slice — so the corpus is widened until the arm is genuinely reachable rather than
 * the edge being lowered until the test goes green, which would be the tuning table lying
 * to the owner about what the world can produce.
 */
const CULTURES = Object.freeze(['germanic', 'nordic']);

/** The corpus every reachability claim below is measured against. Built once. */
const CORPUS = [];
for (const settType of TIERS) {
  for (const route of ROUTES) {
    for (const culture of CULTURES) CORPUS.push(realSettlement(settType, route, culture));
  }
}

describe('SP-B reachability — every band edge is produced by a REAL world', () => {
  test('the corpus is real and non-trivial (guard the guard)', () => {
    expect(CORPUS.length).toBe(TIERS.length * ROUTES.length * CULTURES.length);
    // If the pipeline stopped emitting economicState the whole block below would report
    // empty rung sets and pass having proved nothing.
    const withEconomy = CORPUS.filter((s) => s.economicState && typeof s.economicState === 'object');
    expect(withEconomy.length, 'the generator stopped emitting economicState').toBe(CORPUS.length);
  });

  test('every SCARCITY rung is reachable, and only ladder members are emitted', () => {
    const produced = new Set();
    const strays = [];
    for (const settlement of CORPUS) {
      const bands = scarcityGroundTruth(settlement);
      if (!bands) continue;
      for (const rung of Object.values(bands)) {
        produced.add(rung);
        if (!SCARCITY_BANDS.includes(rung)) strays.push(rung);
      }
    }
    expect(strays, 'the derivation emitted a word outside its own ladder').toEqual([]);
    expect(
      [...produced].sort(),
      'a scarcity rung no really-generated world can reach is a dead band — collapse it'
      + ' or report it, never leave it in the owner\'s tuning table',
    ).toEqual([...SCARCITY_BANDS].sort());
  });

  test('the FOOD shift fires in both directions on the real corpus', () => {
    // The one per-class modifier in the family. Both arms must be live or the deficit
    // arm is a branch nobody can reach and the surplus arm is a promise.
    const T = SUBJECT_AXIS_TUNING;
    const ratios = CORPUS
      .map((s) => s.economicState?.foodSecurity?.foodRatio)
      .filter((r) => typeof r === 'number' && Number.isFinite(r));
    expect(ratios.length, 'no generated settlement carries a food ratio').toBeGreaterThan(10);
    expect(ratios.some((r) => r < T.FOOD_DEFICIT_RATIO), 'the deficit arm is unreachable').toBe(true);
    expect(ratios.some((r) => r > T.FOOD_SURPLUS_RATIO), 'the surplus arm is unreachable').toBe(true);
  });

  test('every CONDITIONS rung of every key is reachable', () => {
    const stores = new Set();
    const routes = new Set();
    const pulls = new Set();
    const tiers = new Set();
    for (const settlement of CORPUS) {
      const bands = conditionsGroundTruth(settlement);
      if (!bands) continue;
      if (bands.storesBand) stores.add(bands.storesBand);
      if (bands.routePositionBand) routes.add(bands.routePositionBand);
      if (bands.pullBand) pulls.add(bands.pullBand);
      if (bands.tierBand) tiers.add(bands.tierBand);
    }
    expect([...routes].sort()).toEqual([...ROUTE_POSITION_BANDS].sort());
    expect([...stores].sort()).toEqual([...STORES_BANDS].sort());
    expect([...tiers].sort()).toEqual([...TIERS].sort());
    // Pull is the one MINTED ladder, so its reachability claim is the load-bearing one.
    expect(
      [...pulls].sort(),
      'a minted pull rung is unreachable on real worlds — the dead-band law',
    ).toEqual([...PULL_BANDS].sort());
  });

  test('the entrepot lift is a live arm, not a promise', () => {
    // A port WITHOUT an entrepot sits at `steady`; a port WITH one reaches `established`.
    // Both halves are produced by the pipeline, so the +1 shift is measured rather than
    // asserted from the table it was written against.
    const ports = CORPUS.filter((s) => s.economicState?.tradeAccess === 'port');
    expect(ports.length, 'no port reached the corpus').toBeGreaterThan(0);
    const withEntrepot = { ...ports[0], economicState: { ...ports[0].economicState, isEntrepot: true } };
    const without = { ...ports[0], economicState: { ...ports[0].economicState, isEntrepot: false } };
    const lifted = conditionsGroundTruth(withEntrepot).routePositionBand;
    const plain = conditionsGroundTruth(without).routePositionBand;
    expect(ROUTE_POSITION_BANDS.indexOf(lifted)).toBe(ROUTE_POSITION_BANDS.indexOf(plain) + 1);
  });

  test('no seed in the corpus throws or emits a non-ladder word', () => {
    const failures = collectSeedFailures(CORPUS, (settlement) => {
      const out = subjectGroundTruth({ settlement }, {}, ALL);
      for (const rung of Object.values(out.scarcityBands || {})) expect(SCARCITY_BANDS).toContain(rung);
      for (const [key, rung] of Object.entries(out.conditionsBands || {})) {
        const ladder = key === 'storesBand' ? STORES_BANDS
          : key === 'routePositionBand' ? ROUTE_POSITION_BANDS
            : key === 'pullBand' ? PULL_BANDS : TIERS;
        expect(ladder, `${key} emitted ${rung}`).toContain(rung);
      }
    });
    expectNoSeedFailures(failures, 'every really-generated settlement derives lawful axis words');
  });
});

describe('SP-B ground truth — silence is not a band', () => {
  test('a class the settlement neither makes nor buys yields NO KEY', () => {
    const bands = scarcityGroundTruth({ economicState: { localProduction: ['grain'], primaryImports: [], necessityImports: [], primaryExports: [] } });
    // anchored: `food` IS present in the same object, which proves the derivation ran and
    // is correctly keyed, so the absence of the others measures the rule rather than an
    // empty result.
    expect(bands.food).toBeTruthy();
    expect(bands.military).toBeUndefined();
    expect(bands.arcane).toBeUndefined();
  });

  test('a necessity import it cannot make is SCANT; a thing it only makes is PLENTIFUL', () => {
    const bands = scarcityGroundTruth({
      economicState: {
        localProduction: ['iron'], primaryExports: ['Weapons and armour'],
        primaryImports: [], necessityImports: ['Salt'],
      },
    });
    expect(bands.food).toBe('scant');            // salt is food-class and it makes none
    expect(bands.raw_material).toBe('plentiful'); // iron, made and never bought
  });

  test('no economicState at all yields nothing rather than a fabricated opinion', () => {
    expect(scarcityGroundTruth({})).toBeNull();
    expect(conditionsGroundTruth({})).toBeNull();
    expect(devotionGroundTruth(null)).toBeNull();
    expect(devotionGroundTruth(undefined)).toBeNull();
  });

  test('conditions keys appear one at a time as their own reads resolve', () => {
    expect(Object.keys(conditionsGroundTruth({ tier: 'town' }))).toEqual(['tierBand']);
    expect(Object.keys(conditionsGroundTruth({ economicState: { foodSecurity: { storageMonths: 6 } } })))
      .toEqual(['storesBand']);
    expect(Object.keys(conditionsGroundTruth({ economicState: { tradeAccess: 'river' } })))
      .toEqual(['routePositionBand']);
    expect(Object.keys(conditionsGroundTruth({ economicState: { prosperity: 'Wealthy' } })))
      .toEqual(['pullBand']);
  });

  test('a hungry place draws fewer people than its ledgers say', () => {
    const rich = { economicState: { prosperity: 'Prosperous', foodSecurity: { foodRatio: 1.2 } } };
    const hungry = { economicState: { prosperity: 'Prosperous', foodSecurity: { foodRatio: 0.6 } } };
    const fed = conditionsGroundTruth(rich).pullBand;
    const starving = conditionsGroundTruth(hungry).pullBand;
    expect(PULL_BANDS.indexOf(starving)).toBe(PULL_BANDS.indexOf(fed) - 1);
  });
});

describe('SP-B devotion — the standing ladder, and never a god', () => {
  const pantheon = (standing, patron) => ({
    patronRef: patron,
    deities: { 'deity.vael': { deityRef: 'deity.vael', share: 60, standing }, 'deity.orr': { deityRef: 'deity.orr', share: 20, standing: 'cult' } },
  });

  test('standing maps to the ladder, and the patron seat lifts one rung', () => {
    expect(devotionGroundTruth(pantheon('cult', null))).toBe('lukewarm');
    expect(devotionGroundTruth(pantheon('established', null))).toBe('observant');
    expect(devotionGroundTruth(pantheon('ascendant', null))).toBe('faithful');
    expect(devotionGroundTruth(pantheon('ascendant', 'deity.vael'))).toBe('devout');
    // Every rung of the borrowed ladder is reached by a real standing/patron combination.
    expect(devotionGroundTruth({ deities: {} })).toBe('secular');
  });

  test('a suppressed deity is not the top one', () => {
    const state = {
      patronRef: null,
      deities: {
        'deity.vael': { deityRef: 'deity.vael', share: 90, standing: 'ascendant', suppressed: true },
        'deity.orr': { deityRef: 'deity.orr', share: 10, standing: 'cult' },
      },
    };
    expect(devotionGroundTruth(state)).toBe('lukewarm');
  });

  test('the output is a band word and never an id', () => {
    const band = devotionGroundTruth(pantheon('ascendant', 'deity.vael'));
    expect(DEVOTION_BANDS).toContain(band);
    expect(JSON.stringify(pantheon('ascendant', 'deity.vael'))).toContain('deity.vael');
    // anchored: the SAME assertion one line above proves the fixture really does carry a
    // named deity ref, and the band is asserted to be a ladder member two lines above, so
    // this negative measures the derivation refusing to leak an id rather than a fixture
    // with nothing to leak or an output that is empty.
    expect(band).not.toContain('deity');
  });
});

describe('SP-B fold — adoption, staleness, and independence', () => {
  const report = (accuracy01) => ({ accuracy01 });
  const truth = { scarcityBands: { food: 'plentiful' }, conditionsBands: { tierBand: 'city' }, devotionBand: 'devout' };
  const prior = { scarcityBands: { food: 'scant' }, conditionsBands: { tierBand: 'thorp' }, devotionBand: 'secular' };

  test('a faithful telling ADOPTS the current truth', () => {
    const out = foldSubjectAxes({ prior, groundTruth: truth, reports: [report(1)], gates: ALL });
    expect(out).toEqual(truth);
  });

  test('THE WRONG BELIEF SURVIVES a garbled telling — per family, at its own bar', () => {
    // The fog-of-war feature, family by family. At 0.55 the conditions bar (0.5) is
    // cleared and the scarcity (0.7) and devotion (0.6) bars are not, so ONE field moves
    // and two hold their now-false prior. The per-family bars are the reason this is a
    // three-way split rather than an all-or-nothing.
    const out = foldSubjectAxes({ prior, groundTruth: truth, reports: [report(0.55)], gates: ALL });
    expect(out.conditionsBands).toEqual(truth.conditionsBands);
    expect(out.scarcityBands).toEqual(prior.scarcityBands);
    expect(out.devotionBand).toBe(prior.devotionBand);
  });

  test('silence keeps the prior entirely', () => {
    const out = foldSubjectAxes({ prior, groundTruth: truth, reports: [], gates: ALL });
    expect(out).toEqual(prior);
  });

  test('a family with no prior takes the cold ground truth rather than nothing', () => {
    const out = foldSubjectAxes({ prior: null, groundTruth: truth, reports: [report(0)], gates: ALL });
    expect(out).toEqual(truth);
  });

  test('a family with neither prior nor truth contributes NO KEY', () => {
    const out = foldSubjectAxes({ prior: {}, groundTruth: {}, reports: [report(1)], gates: ALL });
    expect(Object.keys(out)).toEqual([]);
  });

  test('INDEPENDENCE: lighting one family moves ONLY its field', () => {
    for (const family of ['scarcity', 'conditions', 'devotion']) {
      const gates = { scarcity: false, conditions: false, devotion: false, [family]: true };
      const out = foldSubjectAxes({ prior, groundTruth: truth, reports: [report(1)], gates });
      const expected = family === 'scarcity' ? ['scarcityBands']
        : family === 'conditions' ? ['conditionsBands'] : ['devotionBand'];
      expect(Object.keys(out), `lighting ${family} touched a sibling family`).toEqual(expected);
    }
  });

  test('a null gate set folds nothing at all', () => {
    expect(foldSubjectAxes({ prior, groundTruth: truth, reports: [report(1)], gates: null })).toEqual({});
    expect(subjectGroundTruth({ settlement: {} }, {}, null)).toEqual({});
  });
});
