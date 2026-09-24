/**
 * infoLureIn2.test.js — IN-2 THE LURE: the wave's acceptance file (the FP kit's BUILD-FP-I
 * brief; the compiled block #18; docs/DESIGN_FP_ARCH_IN.md §4 IN-2; R-28).
 *
 * THE FOUR-FENCE DORMANCY SET for `infoLureEnabled`, plus the lit-mutant control that proves
 * the fences can see (§3's flag law; TR-2's acceptance file is the precedent):
 *   FENCE 1 — OWN FOOTPRINT: dark, `processLies` over a fixture that springs a lure, collides two
 *     bluffs and exposes a bought plant about a third court the moment the key is lit returns the
 *     bytes it returned BEFORE IN-2 (a digest computed with the base head, bfe4830d0, planted).
 *   FENCE 2 — ABSENT vs EXPLICIT FALSE vs TRUTHY-NOT-TRUE: one output, bytes and all.
 *   FENCE 3 — CALL PATH: pass-through spies on the lit-only arms, reached CROSS-MODULE from the
 *     head: dark, the spring and the collision are never reached and the claim clause is told dark.
 *   FENCE 4 — GATE POLARITY over the real tree: every code read of the key is `=== true`.
 * ⚠ AXIS RECORDS ARE OUTSIDE THE DARK FOOTPRINT BY CONSTRUCTION: their ONE writer is reached only
 * through the commission, which refuses dark, so a world that never lit the key holds none; and
 * the exposure law judges one on its own axis whatever the key reads later, because a flag flip
 * must not strand a told story on the wrong law.
 * Then the acceptance rows: the four conditional fields and the no-migration pin, the ONE writer,
 * the ONE axis-typed exposure law per family on a REAL reconcile, the resisted lure and the
 * unattractive bait under BOTH restraint states, the spring and its join, the aim through the
 * mirror, bluff against bluff on the expiry arm, the blowback's mouthpiece plane, the direction
 * and the predicate headless, the commission, the phantom readers, the two-channel scan, and the
 * registry rows.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ spring: 0, collision: 0, clauseLit: [] }));

vi.mock('../../src/domain/worldPulse/infoLure.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-throughs: the original's answer, counted.
    lureSprungEntries: (...args) => {
      calls.spring += 1;
      return actual.lureSprungEntries(...args);
    },
    bluffCollisionReasons: (...args) => {
      calls.collision += 1;
      return actual.bluffCollisionReasons(...args);
    },
    lieClaimClause: (...args) => {
      calls.clauseLit.push(args[2]);
      return actual.lieClaimClause(...args);
    },
  };
});

const {
  IN2_AXIS_FAMILIES, LIE_COMMISSION_REFUSALS, LIE_OUTCOMES, LURE_AXES, LURE_DIRECTION_OP_TYPES,
  LURE_DIRECTION_TYPE, LURE_WORLD_CONDITIONS, PLANT_CHANNEL_CONDITION, PLANT_CHANNEL_ROW, STRENGTH_AXIS,
  axisFamiliesGrewSinceIn2, castLureMouthpiece, lieClaimClause, lieCommissionRefusal, lieExposure,
  lureAttractionOf, lureAxisValues, lureCommission, lureRecordOf, lureSprungEntries, plantChannelHouses,
  selectLureMark,
} = await import('../../src/domain/worldPulse/infoLure.js');
const statecraft = await import('../../src/domain/worldPulse/informationStatecraft.js');
const { processLies } = statecraft;
const { reconcileBelief } = await import('../../src/domain/worldPulse/beliefMap.js');
const { MIRROR_STALENESS_BANDS, mirrorInputsAt, secondOrderMirrorOf } = await import('../../src/domain/worldPulse/secondOrderBelief.js');
const { commissionedPlantAt } = await import('../../src/domain/worldPulse/disinformationPlant.js');
const { ENVOY_PICTURE_PLANT_FIELDS } = await import('../../src/domain/worldPulse/brokerageServicesPlant.js');
const { SUBJECT_AXIS_FIELDS } = await import('../../src/domain/worldPulse/beliefAxisSubjects.js');
const { HABIT_FORK_REGISTRY } = await import('../../src/domain/worldPulse/habitForkRegistry.js');
const { resolveDecree, stage } = await import('../../src/domain/edit/registry.js');
const { OP_TYPES } = await import('../../src/domain/edit/operations.js');
const { PHANTOM_KIND } = await import('../../src/domain/edit/phantoms.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FLAG = 'infoLureEnabled';

// ⟦FIXTURE⟧ — read verbatim by the digest script that computed PRE_IN2_DARK_DIGEST against the base head.
const TICK = 10;

/** A seat belief record. @param {number} band */
const belief = (band, extra = {}) => ({
  readiness: 0.25, strengthBand: band, allianceLabel: 'hostile', faithLabel: 'Aldra', confidence01: 0.8, lastUpdateTick: 5, ...extra,
});

/** A paid plant's commission, as `disinformationPlant.commissionedPlantAt` stamps it. */
const commission = (assertedBand, trueBand, commissionedAtTick) => ({
  receipt: {
    marketId: 'mk', marketName: 'the Whisper Exchange', hostId: 'h', patronId: 'p', intent: assertedBand < trueBand ? 'deflate' : 'inflate',
    assertedBand, trueBand, priceBand: 'fee', commissionedAtTick,
  },
});

/**
 * The chooser's resolved deploy, as `settlementStrategy.js` builds it and `compactOutcomeForHistory`
 * keeps it: the marcher, the move, the misjudgment the detector stamped, the machine-readable target.
 */
const march = (observerId, subjectId, believedStrengthBand, trueStrengthBand, kinds = ['strength']) => ({
  id: `candidate.strategy.deploy.${observerId}.${TICK - 1}`,
  candidateType: 'strategy_deploy',
  metadata: {
    settlementId: observerId, strategyMove: 'deploy',
    misjudgment: {
      observerId, subjectId, believedStrengthBand, trueStrengthBand, believedRelationship: 'hostile', trueRelationship: 'hostile', confidence01: 0.7, kinds,
    },
    deployTargetId: subjectId,
  },
});

/**
 * THE FIXTURE, every lit arm in one world. Two courts each run the garrison bluff at the other
 * (a's seeded eight weeks ago and ageing out now, b's standing). A market in h sold a WEAKNESS
 * about v into m two weeks ago, and m's own march on v, on exactly that band, is on last week's
 * record. The same market's older weakness about v in b ages out now, a bought plant about a
 * THIRD court exposed.
 * @param {Record<string, unknown>} rules
 */
function fixture(rules = {}) {
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', infoStatecraftEnabled: true, ...rules },
    spatialLedgers: {
      disinfo: {
        'lie:a:b': { liarId: 'a', subjectId: 'a', audienceId: 'b', assertedBand: 4, trueBand: 2, seededTick: 2, lineageId: 'disinfo:a:b:2' },
        'lie:b:a': { liarId: 'b', subjectId: 'b', audienceId: 'a', assertedBand: 4, trueBand: 2, seededTick: 5, lineageId: 'disinfo:b:a:5' },
        'plant:h:b:v': {
          liarId: 'h', subjectId: 'v', audienceId: 'b', assertedBand: 0, trueBand: 2, seededTick: 1, lineageId: 'disinfo:h:b:1', commission: commission(0, 2, 0),
        },
        'plant:h:m:v': {
          liarId: 'h', subjectId: 'v', audienceId: 'm', assertedBand: 0, trueBand: 2, seededTick: 8, lineageId: 'disinfo:h:m:8', commission: commission(0, 2, 7),
        },
      },
    },
    pulseHistory: [{ tick: TICK - 1, selectedOutcomes: [march('m', 'v', 0, 2)] }],
  };
  const beliefMaps = {
    a: { seat: { b: belief(4) } }, b: { seat: { a: belief(4), v: belief(0) } }, m: { seat: { v: belief(0) } },
  };
  const ids = ['a', 'b', 'h', 'm', 'v'];
  const settlements = ids.map((id) => ({ id, settlement: { id, name: id.toUpperCase(), npcs: [] } }));
  return {
    snapshot: { settlements, byId: new Map(settlements.map((s) => [s.id, s])) },
    worldState, beliefMaps, rng: null, tick: TICK, strengthOf: () => 0.5, nameFor: (id) => String(id).toUpperCase(),
  };
}

/** The whole return of processLies, serialized (the Map spread so its entries count). */
function bytesOf(out) {
  return JSON.stringify({ ...out, overrides: [...out.overrides].map(([k, v]) => [k, [...v]]) });
}
// ⟦/FIXTURE⟧
const digest = (text) => createHash('sha256').update(text).digest('hex');

/**
 * THE PRE-IN-2 FOOTPRINT: this fixture's full processLies return, computed by the digest script
 * with the head as it stood at the base (bfe4830d0, the verified base archive) — the same fixture
 * text, read out of this file between its markers. Dark, the head must still answer exactly this.
 */
const PRE_IN2_DARK_DIGEST = '7d96b62ae7142b0939642d4b3d2438a80e07b4778d973919715b17213f373e1d';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

describe('IN-2 — the four dormancy fences and the lit-mutant control', () => {
  test('fence 1 — dark, the head returns the pre-IN-2 bytes over a fixture that springs, collides and names a bought plant lit', () => {
    for (const rules of [{}, { [FLAG]: false }, { [FLAG]: 'true' }, { [FLAG]: 1 }]) {
      expect(digest(bytesOf(processLies(fixture(rules)))), JSON.stringify(rules)).toBe(PRE_IN2_DARK_DIGEST);
    }
  });

  test('THE LIT-MUTANT CONTROL — the same fixture lit springs the lure, names both bluffs and names the bought plant\'s subject', () => {
    const lit = processLies(fixture({ [FLAG]: true }));
    expect(digest(bytesOf(lit))).not.toBe(PRE_IN2_DARK_DIGEST);
    const sprung = lit.newsEntries.filter((entry) => entry.kind === 'lure_sprung');
    expect(sprung).toHaveLength(1);
    expect(sprung[0]).toMatchObject({
      id: 'wizard_news.10.lure_sprung.h.m.v', impactKind: 'lure_sprung', settlementIds: ['h', 'm', 'v'],
      audience: 'dm-only', covert: true, section: 'war', significance: 'notable', tick: TICK, severity: 0.5,
    });
    const exposed = lit.newsEntries.filter((entry) => entry.kind === 'infowar_lie_exposed');
    expect(exposed.map((entry) => entry.settlementIds)).toEqual([['a', 'b'], ['h', 'b']]);
    expect(exposed[0].reasons.join(' ')).toMatch(/Two bluffs met: B's own inflated strength was standing in A's court/);
    expect(exposed[1].summary).toMatch(/planted in B \(that V was weaker than it is\) has met/);
    // The dark twin carries the same two exposures in the legacy voice and nothing else.
    const dark = processLies(fixture());
    expect(dark.newsEntries.map((entry) => entry.kind)).toEqual(['infowar_lie_exposed', 'infowar_lie_exposed']);
    expect(dark.newsEntries[0].reasons).toHaveLength(2);
    expect(dark.newsEntries[1].summary).toMatch(/planted in B \(that its strength was greater than it is\) has met/);
    expect(dark.disinfo).toEqual(lit.disinfo);
  });

  test('fence 2 — absent, explicit false and a truthy non-true value are one output', () => {
    const absent = bytesOf(processLies(fixture()));
    expect(bytesOf(processLies(fixture({ [FLAG]: false })))).toBe(absent);
    expect(bytesOf(processLies(fixture({ [FLAG]: 'true' })))).toBe(absent);
    expect(bytesOf(processLies(fixture({ [FLAG]: 1 })))).toBe(absent);
  });

  test('fence 3 — the call path: dark, neither lit-only arm is reached and the clause is told dark; lit, both are reached', () => {
    calls.spring = 0;
    calls.collision = 0;
    calls.clauseLit.length = 0;
    for (const rules of [{}, { [FLAG]: false }, { [FLAG]: 'true' }]) processLies(fixture(rules));
    expect({ spring: calls.spring, collision: calls.collision }).toEqual({ spring: 0, collision: 0 });
    expect(calls.clauseLit.length).toBeGreaterThan(0);
    expect([...new Set(calls.clauseLit)]).toEqual([false]);
    calls.clauseLit.length = 0;
    processLies(fixture({ [FLAG]: true }));
    expect(calls.spring).toBeGreaterThan(0);
    expect(calls.collision).toBeGreaterThan(0);
    expect([...new Set(calls.clauseLit)]).toEqual([true]);
  });

  test('fence 4 — the gate polarity census: every code read of the key is the strict === true form, in one file', () => {
    const reads = [];
    const loose = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const code = codeOnly(readFileSync(abs, 'utf8'));
      for (const match of code.matchAll(/\binfoLureEnabled\b/g)) {
        const tail = code.slice(match.index + match[0].length, match.index + match[0].length + 12);
        (/^\s*===\s*true/.test(tail) ? reads : loose).push(rel);
      }
    }
    expect(loose, 'a read of the key that is not the strict === true form').toEqual([]);
    expect(reads).toEqual(['src/domain/worldPulse/infoLure.js']);
  });
});

/** The belief patch that holds one axis at one value. */
function withAxis(axis, value) {
  if (axis === 'faith') return { faithLabel: value };
  if (axis === 'devotion') return { devotionBand: value };
  if (axis.startsWith('scarcity.')) return { scarcityBands: { [axis.slice('scarcity.'.length)]: value } };
  return { conditionsBands: { [`${axis}Band`]: value } };
}

/** Three fresh, independent, faithful tellings: the corroborated word good sourcing buys. */
const CORROBORATION = Object.freeze([0, 1, 2].map((i) => Object.freeze({
  hopCount: 0, ageTicks: 0, independentSources: 3, completeness01: 1, accuracy01: 1, score: 1, sortKey: `r${i}`,
})));

/** The REAL reconcile: a planted reckoning met by corroborated word, every SP-B family lit. */
function reanchored(planted, truth) {
  return reconcileBelief({
    prior: planted, groundTruth: truth, reports: [...CORROBORATION], now: TICK, axesActive: true, subjectId: 'v',
    subjectAxes: { scarcity: true, conditions: true, devotion: true },
  });
}

describe('IN-2 — the axis model, the ONE writer and the ONE exposure law', () => {
  test('the four conditional fields drop when absent, and a strength lure keeps the legacy spelling', () => {
    const strength = lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: STRENGTH_AXIS, assertedValue: 0, trueValue: 2, tick: 4 });
    expect(strength).toEqual({ liarId: 'h', subjectId: 'v', audienceId: 'm', assertedBand: 0, trueBand: 2, seededTick: 4, lineageId: 'disinfo:h:m:4', intent: 'deflate' });
    const faith = lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: 'faith', assertedValue: 'Morv', trueValue: 'Aldra', tick: 4 });
    expect(faith).toEqual({ liarId: 'h', subjectId: 'v', audienceId: 'm', seededTick: 4, lineageId: 'disinfo:h:m:4', axis: 'faith', assertedValue: 'Morv', trueValue: 'Aldra' });
    const stores = lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: 'stores', assertedValue: 'deep', trueValue: 'thin', tick: 4, spokespersonNpcId: 'h:vessa' });
    expect(Object.keys(stores)).toEqual(['liarId', 'subjectId', 'audienceId', 'seededTick', 'lineageId', 'axis', 'assertedValue', 'trueValue', 'intent', 'spokespersonNpcId']);
    expect(stores.intent).toBe('inflate');
    expect(JSON.parse(JSON.stringify(stores))).toEqual(stores);
    // anchored: the three shapes above are non-null, so these refusals are real closed doors.
    expect(lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: 'stores', assertedValue: 'bottomless', trueValue: 'thin', tick: 4 })).toBeNull();
    // anchored: same.
    expect(lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: 'harvest', assertedValue: 'deep', trueValue: 'thin', tick: 4 })).toBeNull();
    // anchored: same — a "lie" that asserts the truth is no record at all.
    expect(lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: 'stores', assertedValue: 'thin', trueValue: 'thin', tick: 4 })).toBeNull();
  });

  test('NO MIGRATION: a record without an axis is judged by the strength law, exactly as the head judged it', () => {
    // The pre-IN-2 head's three lines, spelled here verbatim as the oracle.
    const legacy = (rec, band, now) => {
      const cur = band === null ? rec.trueBand : Math.round(Number.isFinite(band) ? band : 2);
      return {
        contradicted: Math.abs(cur - Math.round(rec.assertedBand)) >= 2,
        agedOut: now - Math.floor(rec.seededTick) >= 8,
      };
    };
    let rows = 0;
    for (const assertedBand of [0, 2, 4]) {
      for (const trueBand of [0, 2, 4]) {
        for (const band of [null, 0, 1, 2, 3, 4]) {
          for (const now of [3, 10, 11]) {
            const rec = { liarId: 'a', subjectId: 'a', audienceId: 'b', assertedBand, trueBand, seededTick: 3, lineageId: 'disinfo:a:b:3' };
            const verdict = lieExposure(rec, band === null ? null : belief(band), now);
            expect({ contradicted: verdict.contradicted, agedOut: verdict.agedOut }).toEqual(legacy(rec, band, now));
            expect(LIE_OUTCOMES).toContain(verdict.outcome);
            rows += 1;
          }
        }
      }
    }
    expect(rows).toBe(162);
    // And the outcome words are the three the law types: told, believed, caught.
    const rec = { liarId: 'a', subjectId: 'a', audienceId: 'b', assertedBand: 4, trueBand: 2, seededTick: 9, lineageId: 'disinfo:a:b:9' };
    expect([lieExposure(rec, belief(3), TICK).outcome, lieExposure(rec, belief(4), TICK).outcome, lieExposure(rec, belief(2), TICK).outcome])
      .toEqual(['told', 'believed', 'caught']);
  });

  test('ONE WRITER: assertedValue and trueValue are spelled into a record only by infoLure.js, a third writer convicted, and the old roads write none of the four', () => {
    const writerOf = (code) => /\b(?:assertedValue|trueValue)\s*[,}:]/.test(code);
    const writers = walk(join(ROOT, 'src'))
      .filter((abs) => writerOf(codeOnly(readFileSync(abs, 'utf8'))))
      .map((abs) => relative(ROOT, abs).replace(/\\/g, '/'));
    expect(writers).toEqual(['src/domain/worldPulse/infoLure.js']);
    expect(writerOf(codeOnly('const rec = { liarId, assertedValue: band };'))).toBe(true);
    // The court's own bluff and the paid plant's fold keep their exact legacy record keys.
    const LEGACY_KEYS = ['assertedBand', 'audienceId', 'liarId', 'lineageId', 'seededTick', 'subjectId', 'trueBand'];
    const envelope = {
      key: 'plant:h:m:v',
      record: { liarId: 'h', subjectId: 'v', audienceId: 'm', assertedBand: 0, trueBand: 2, seededTick: 5, lineageId: 'disinfo:h:m:5' },
      override: { readiness: 0.5, strengthBand: 0, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.7, lastUpdateTick: 5 },
      receipt: { ...commission(0, 2, 5).receipt },
    };
    const folded = commissionedPlantAt(envelope, 5);
    expect(Object.keys(folded.record).filter((key) => key !== 'commission').sort()).toEqual(LEGACY_KEYS);
    const seeded = processLies({
      ...fixture({ [FLAG]: true }), rng: { fork: () => ({ random: () => 0 }) }, tick: 20,
      worldState: { spatialCanonVersion: 1, simulationRules: { infoMode: 'full', infoStatecraftEnabled: true, [FLAG]: true }, spatialLedgers: {} },
      beliefMaps: { a: { seat: { b: belief(4) } }, b: { seat: { a: belief(1) } } },
    });
    const bluff = seeded.disinfo['lie:a:b'];
    expect(Object.keys(bluff).sort()).toEqual(LEGACY_KEYS);
  });

  test('a non-strength plant exposes by CONTRADICTION on a real reconcile, per family, never only by age', () => {
    const truth = {
      readiness: 0.25, strengthBand: 2, allianceLabel: 'hostile', faithLabel: 'Aldra', confidence01: 1, lastUpdateTick: TICK,
      populationTrendBand: 0, observanceLabel: null,
      scarcityBands: { food: 'scant' }, conditionsBands: { pullBand: 'shunned', routePositionBand: 'none', storesBand: 'bare' }, devotionBand: 'lukewarm',
    };
    const cases = [
      ['faith', 'Morv', 'Aldra', /keeps a god it does not keep/],
      ['devotion', 'devout', 'lukewarm', /prays harder than it does/],
      ['stores', 'deep', 'bare', /granaries of V held more than they do/],
      ['pull', 'sought', 'shunned', /V draws people more than it does/],
      ['routePosition', 'steady', 'none', /roads of V carry more than they do/],
      ['scarcity.food', 'plentiful', 'scant', /V has plenty of food when it does not/],
    ];
    for (const [axis, asserted, trueValue, clause] of cases) {
      const rec = lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis, assertedValue: asserted, trueValue, tick: 9 });
      const planted = { ...truth, ...withAxis(axis, asserted), confidence01: 0.7, lastUpdateTick: 9 };
      // anchored: the plant HOLDS before the word arrives, so the exposure below is the reconcile's doing.
      expect(lieExposure(rec, planted, TICK), axis).toMatchObject({ contradicted: false, agedOut: false, outcome: 'believed' });
      const f = fixture();
      f.worldState.spatialLedgers.disinfo = { 'plant:h:m:v': rec };
      f.beliefMaps = { m: { seat: { v: reanchored(planted, truth) } } };
      f.worldState.pulseHistory = [];
      const out = processLies(f);
      expect(out.disinfo, axis).toBeNull();
      expect(out.newsEntries.map((entry) => entry.kind), axis).toEqual(['infowar_lie_exposed']);
      expect(out.newsEntries[0].summary, axis).toMatch(clause);
      // anchored: the summary above is the axis record's own exposure (matched one line up).
      expect(out.newsEntries[0].summary, axis).not.toMatch(/strength was greater|\d/);
      expect(out.newsEntries[0].reasons[0], axis).toMatch(/re-anchored/);
    }
  });

  test('THE TRIPWIRE: the lure was authored against the at-build SP-B family set, and covers every family', () => {
    expect(axisFamiliesGrewSinceIn2()).toBe(false);
    expect([...SUBJECT_AXIS_FIELDS]).toEqual([...IN2_AXIS_FAMILIES]);
    expect(LURE_AXES).toEqual([...LURE_AXES].sort());
    expect(LURE_AXES).toHaveLength(16);
    expect(LURE_AXES.filter((axis) => axis.startsWith('scarcity.'))).toHaveLength(10);
    expect(LURE_AXES).toEqual(expect.arrayContaining(['devotion', 'faith', 'pull', 'routePosition', 'stores', 'strength']));
    expect(lureAxisValues('stores')).toEqual(['bare', 'thin', 'stocked', 'deep']);
    expect(lureAxisValues('strength')).toEqual([0, 1, 2, 3, 4]);
    expect(lureAxisValues('faith')).toBeNull();
  });
});

/** A bait world: h (a town) hosts a market selling plants; t (a thorp) and w (a metropolis). */
function baitWorld(restraint, extraRules = {}) {
  const town = (id, tier, population, extra = {}) => ({ id, name: id, tier, population, settlement: { id, name: id, tier, population, npcs: [], ...extra } });
  const market = { id: 'mk', name: 'the Whisper Exchange', tags: ['criminal', 'information', 'brokerage'], serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] };
  const items = [town('h', 'town', 3000, { institutions: [market] }), town('t', 'thorp', 60), town('w', 'metropolis', 80000)];
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: {
      infoMode: 'full', infoStatecraftEnabled: true, informationBrokeragesEnabled: true, [FLAG]: true,
      ...(restraint ? { warLayerEnabled: true, warTerminationEnabled: true } : {}), ...extraRules,
    },
    spatialLedgers: { beliefMaps: { h: { seat: { t: belief(2), w: belief(4) } }, t: { seat: { w: belief(4) } } } },
  };
  return { snapshot: { settlements: items, byId: new Map(items.map((i) => [i.id, i])) }, worldState };
}

/** processLies over one plant and last week's record, in the bait world's rules. */
function springRun(worldState, disinfo, beliefMaps, outcomes) {
  const f = fixture({ ...worldState.simulationRules });
  f.worldState.spatialLedgers.disinfo = disinfo;
  f.worldState.pulseHistory = [{ tick: TICK - 1, selectedOutcomes: outcomes }];
  f.beliefMaps = beliefMaps;
  return processLies(f).newsEntries;
}

describe('IN-2 — the bait: resisted, unattractive, sprung, and the join', () => {
  test('restraint DARK — the unattractive bait, the reversal bait springing, and the resisted lure', () => {
    const { snapshot, worldState } = baitWorld(false);
    // THE UNATTRACTIVE BAIT: a weakness too shallow to move the thorp moves nobody.
    expect(lureAttractionOf({ snapshot, worldState, markId: 't', subjectId: 'w', planted: belief(3) }).attraction).toBe('unattractive');
    expect(selectLureMark({ snapshot, worldState, liarId: 'h', subjectId: 'w', axis: STRENGTH_AXIS, assertedValue: 3 })).toBeNull();
    // THE REVERSAL CHANNEL SPRINGS DARK: the metropolis planted middling moves the thorp.
    expect(lureAttractionOf({ snapshot, worldState, markId: 't', subjectId: 'w', planted: belief(2) }).attraction).toBe('attractive');
    expect(selectLureMark({ snapshot, worldState, liarId: 'h', subjectId: 'w', axis: STRENGTH_AXIS, assertedValue: 2 })?.markId).toBe('t');
    const bait = { liarId: 'h', subjectId: 'w', audienceId: 't', assertedBand: 2, trueBand: 4, seededTick: 7, lineageId: 'disinfo:h:t:7' };
    const sprung = springRun(worldState, { 'plant:h:t:w': bait }, { t: { seat: { w: belief(2) } } }, [march('t', 'w', 2, 4)]);
    expect(sprung.filter((entry) => entry.kind === 'lure_sprung').map((entry) => entry.settlementIds)).toEqual([['h', 't', 'w']]);
    // THE RESISTED LURE: corroborated word, through the REAL reconcile, re-anchors the thorp's
    // reckoning before it marches; the bait is caught, and the casus no longer fires on it.
    const truth = { ...belief(4), confidence01: 1, lastUpdateTick: TICK };
    const resisted = reanchored({ ...belief(2), confidence01: 0.7 }, truth);
    expect(lieExposure(bait, resisted, TICK)).toMatchObject({ contradicted: true, agedOut: false, outcome: 'caught' });
    expect(lureAttractionOf({ snapshot, worldState, markId: 't', subjectId: 'w', planted: resisted }).attraction).toBe('unattractive');
    const caught = springRun(worldState, { 'plant:h:t:w': bait }, { t: { seat: { w: resisted } } }, []);
    expect(caught.map((entry) => entry.kind)).toEqual(['infowar_lie_exposed']);
  });

  test('restraint LIT — the unattractive bait, the refused reversal, the degree-and-timing spring, and the resisted lure', () => {
    const { snapshot, worldState } = baitWorld(true);
    expect(lureAttractionOf({ snapshot, worldState, markId: 't', subjectId: 'w', planted: belief(3) }).attraction).toBe('unattractive');
    const refused = lureAttractionOf({ snapshot, worldState, markId: 't', subjectId: 'w', planted: belief(2) });
    expect(refused.attraction).toBe('refused');
    expect(refused.receipt).toMatch(/Rumour calls them weak, but the live muster shows an equal or stronger host/);
    expect(selectLureMark({ snapshot, worldState, liarId: 'h', subjectId: 'w', axis: STRENGTH_AXIS, assertedValue: 2 })).toBeNull();
    // DEGREE AND TIMING: the town truly outweighs the thorp, so the planted weakness springs.
    const planted = belief(0);
    expect(lureAttractionOf({ snapshot, worldState, markId: 'h', subjectId: 't', planted }).attraction).toBe('attractive');
    const bait = { liarId: 'w', subjectId: 't', audienceId: 'h', assertedBand: 0, trueBand: 2, seededTick: 7, lineageId: 'disinfo:w:h:7' };
    const sprung = springRun(worldState, { 'plant:w:h:t': bait }, { h: { seat: { t: planted } } }, [march('h', 't', 0, 2)]);
    expect(sprung.filter((entry) => entry.kind === 'lure_sprung').map((entry) => entry.settlementIds)).toEqual([['w', 'h', 't']]);
    // THE RESISTED LURE, lit restraint: corroborated word re-anchors the thorp's reckoning of the
    // metropolis, and it is SOURCING that stops the march — the casus finds no appetite at all, so
    // the restraint's refusal never even arises — while the bait is caught.
    const reversal = { liarId: 'h', subjectId: 'w', audienceId: 't', assertedBand: 2, trueBand: 4, seededTick: 7, lineageId: 'disinfo:h:t:7' };
    const resisted = reanchored({ ...belief(2), confidence01: 0.7 }, { ...belief(4), confidence01: 1, lastUpdateTick: TICK });
    expect(lieExposure(reversal, resisted, TICK)).toMatchObject({ contradicted: true, outcome: 'caught' });
    expect(lureAttractionOf({ snapshot, worldState, markId: 't', subjectId: 'w', planted: resisted })).toEqual({ attraction: 'unattractive', receipt: '' });
    expect(springRun(worldState, { 'plant:h:t:w': reversal }, { t: { seat: { w: resisted } } }, []).map((entry) => entry.kind))
      .toEqual(['infowar_lie_exposed']);
    // …and where the court's advantage is REAL, re-anchored word leaves an honest appetite and no
    // lure: a march on the true band stamps no misjudgment, so nothing joins the caught bait.
    const honest = reanchored({ ...planted, confidence01: 0.7 }, { ...belief(2), confidence01: 1, lastUpdateTick: TICK });
    expect(lieExposure(bait, honest, TICK)).toMatchObject({ contradicted: true, outcome: 'caught' });
    expect(lureAttractionOf({ snapshot, worldState, markId: 'h', subjectId: 't', planted: honest }).attraction).toBe('attractive');
    expect(springRun(worldState, { 'plant:w:h:t': bait }, { h: { seat: { t: honest } } }, []).map((entry) => entry.kind))
      .toEqual(['infowar_lie_exposed']);
  });

  test('THE JOIN — only the mark\'s own misjudged march on the planted band, a tick after the story landed, springs', () => {
    const { worldState } = baitWorld(false);
    const bait = { liarId: 'h', subjectId: 'w', audienceId: 't', assertedBand: 2, trueBand: 4, seededTick: 7, lineageId: 'disinfo:h:t:7' };
    const maps = { t: { seat: { w: belief(2) } } };
    const springs = (disinfo, outcomes) => springRun(worldState, disinfo, maps, outcomes).filter((entry) => entry.kind === 'lure_sprung').length;
    expect(springs({ 'plant:h:t:w': bait }, [march('t', 'w', 2, 4)]), 'the positive control').toBe(1);
    // anchored: each variant below differs from the positive control above in ONE clause.
    expect(springs({ 'plant:h:t:w': { ...bait, seededTick: TICK - 1, lineageId: 'disinfo:h:t:9' } }, [march('t', 'w', 2, 4)]), 'told the same tick the court chose').toBe(0);
    // anchored: same.
    expect(springs({ 'plant:h:t:w': bait }, [march('t', 'w', 1, 4)]), 'marched on a band the bait never asserted').toBe(0);
    // anchored: same.
    expect(springs({ 'plant:h:t:w': bait }, [march('t', 'h', 2, 4)]), 'the march went elsewhere').toBe(0);
    // anchored: same.
    expect(springs({ 'plant:h:t:w': bait }, [march('t', 'w', 2, 4, ['relationship'])]), 'no strength misjudgment').toBe(0);
    // anchored: same.
    expect(springs({ 'plant:h:t:w': { ...bait, assertedBand: 4, trueBand: 2 } }, [march('t', 'w', 4, 2)]), 'an inflation is no weakness bait').toBe(0);
    // anchored: same — last week's record, never an older one.
    const stale = springRun(worldState, { 'plant:h:t:w': bait }, maps, [march('t', 'w', 2, 4)]);
    expect(stale.some((entry) => entry.kind === 'lure_sprung')).toBe(true);
    const f = fixture({ ...worldState.simulationRules });
    f.worldState.spatialLedgers.disinfo = { 'plant:h:t:w': bait };
    f.worldState.pulseHistory = [{ tick: TICK - 2, selectedOutcomes: [march('t', 'w', 2, 4)] }];
    f.beliefMaps = maps;
    expect(processLies(f).newsEntries.some((entry) => entry.kind === 'lure_sprung'), 'a record two weeks old').toBe(false);
    // THE MARCH IS READ OFF THE MISJUDGMENT ALONE, and that is sound only while the detector
    // stamps the chooser's resolved deploy and nothing else: one call site, in the deploy branch.
    // `codeOnly` keeps offsets, so the CALLS are counted on the stripped text (a comment or a
    // string never counts) and the BRANCH is located on the raw text its literal lives in.
    const raw = readFileSync(join(ROOT, 'src/domain/worldPulse/settlementStrategy.js'), 'utf8');
    const sites = [...codeOnly(raw).matchAll(/\bmisjudgmentFor\(/g)].map((hit) => hit.index);
    expect(sites, 'the declaration and exactly one call').toHaveLength(2);
    const deployBranch = raw.indexOf("if (move === 'deploy')");
    expect(deployBranch).toBeGreaterThan(0);
    expect(sites[1]).toBeGreaterThan(deployBranch);
    // anchored: the deploy branch and the call are both located above, so this span is real source.
    expect(raw.slice(deployBranch, sites[1])).not.toMatch(/if \(move === '(?!deploy)/);
  });

  test('THE AIM — the softest ground first, read off the subject\'s own mirror through the injected reader; absent, codepoint', () => {
    const town = (id, tier, population) => ({ id, name: id, tier, population, settlement: { id, name: id, tier, population, npcs: [] } });
    const items = [town('b', 'town', 3000), town('c', 'town', 3000), town('h', 'town', 3000), town('v', 'thorp', 60)];
    const snapshot = { settlements: items, byId: new Map(items.map((i) => [i.id, i])) };
    const world = (mirrorLit) => ({
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'full', infoStatecraftEnabled: true, [FLAG]: true, ...(mirrorLit ? { secondOrderBeliefEnabled: true } : {}) },
      spatialLedgers: {
        beliefMaps: { b: { seat: { v: belief(2) } }, c: { seat: { v: belief(2) } } },
        // v's own record shows b a fresh garrison bluff and shows c nothing at all.
        disinfo: { 'lie:v:b': { liarId: 'v', subjectId: 'v', audienceId: 'b', assertedBand: 3, trueBand: 1, seededTick: TICK, lineageId: `disinfo:v:b:${TICK}` } },
      },
    });
    // The consumer's reader, built here from IN-1's own mirror: nothing shown is the softest
    // ground, then the stalest showing, on the mirror's own staleness ladder (no band minted).
    const mirrorSoftness = (worldState) => (subjectId, markId) => {
      const mirror = secondOrderMirrorOf(mirrorInputsAt(worldState, subjectId, markId, TICK));
      const rung = MIRROR_STALENESS_BANDS.indexOf(String(mirror.staleness));
      return rung <= 0 ? MIRROR_STALENESS_BANDS.length : rung;
    };
    const pick = (mirrorLit, inject) => selectLureMark({
      snapshot, worldState: world(mirrorLit), liarId: 'h', subjectId: 'v', axis: STRENGTH_AXIS, assertedValue: 0,
      softnessOf: inject ? mirrorSoftness(world(mirrorLit)) : null,
    });
    // Both courts would march on the planted weakness, so the order alone decides.
    for (const markId of ['b', 'c']) {
      expect(lureAttractionOf({ snapshot, worldState: world(true), markId, subjectId: 'v', planted: belief(0) }).attraction).toBe('attractive');
    }
    expect(pick(true, false)?.markId, 'no reader injected: the named degraded arm, codepoint').toBe('b');
    expect(pick(false, true)?.markId, 'the mirror dark reads every court alike: codepoint').toBe('b');
    expect(pick(true, true)?.markId, 'the mirror lit: c has been shown nothing of v, the softest ground').toBe('c');
    // And the leaf itself imports no mirror: IN-1's fence pins the mirror's one render-time caller.
    const leaf = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/infoLure.js'), 'utf8'));
    expect(leaf).toMatch(/softnessOf/);
    // anchored: the leaf read above is live source (it names the injected reader one line up).
    expect(leaf).not.toMatch(/secondOrderBelief/);
  });
});

describe('IN-2 — bluff against bluff, the blowback and the mouthpiece', () => {
  test('BLUFF AGAINST BLUFF, pinned on the expiry arm: the aged-out bluff names both lies, the contradicted one does not', () => {
    const aged = processLies(fixture({ [FLAG]: true }));
    const line = aged.newsEntries.find((entry) => entry.settlementIds.join() === 'a,b').reasons;
    expect(line.filter((reason) => reason.startsWith('Two bluffs met:'))).toHaveLength(1);
    expect(Object.keys(aged.disinfo)).toEqual(['lie:b:a', 'plant:h:m:v']);
    const f = fixture({ [FLAG]: true });
    f.worldState.spatialLedgers.disinfo['lie:a:b'].seededTick = 9;
    f.beliefMaps.b.seat.a = belief(2);
    const contradicted = processLies(f).newsEntries.find((entry) => entry.settlementIds.join() === 'a,b');
    // anchored: the contradicted exposure is found above; only the collision line is absent.
    expect(contradicted.reasons.some((reason) => reason.startsWith('Two bluffs met:'))).toBe(false);
    const g = fixture({ [FLAG]: true });
    delete g.worldState.spatialLedgers.disinfo['lie:b:a'];
    const lone = processLies(g).newsEntries.find((entry) => entry.settlementIds.join() === 'a,b');
    // anchored: the lone bluff still ages out and is exposed above; there was no second lie to name.
    expect(lone.reasons.some((reason) => reason.startsWith('Two bluffs met:'))).toBe(false);
  });

  test('the blowback composes the mouthpiece plane where npcCredibility is lit, and is byte-identical dark', () => {
    const run = (speaker) => {
      const rec = lureRecordOf({ liarId: 'h', audienceId: 'm', subjectId: 'v', axis: 'stores', assertedValue: 'deep', trueValue: 'bare', tick: 9, spokespersonNpcId: speaker });
      const f = fixture({ [FLAG]: true, npcCredibilityEnabled: speaker !== null });
      f.worldState.spatialLedgers.disinfo = { 'plant:h:m:v': rec };
      f.beliefMaps = { m: { seat: { v: belief(2, { conditionsBands: { storesBand: 'bare' } }) } } };
      f.worldState.pulseHistory = [];
      return processLies(f);
    };
    const lit = run('h:vessa');
    // The personal charge carries the AXIS lie's own size: deep over bare is three rungs.
    expect(lit.npcDeltas).toEqual([{ id: 'h:vessa', kind: 'deception', magnitude01: 1, lieExposedBand: 3 }]);
    expect(lit.newsEntries[0].npcIds).toEqual(['h:vessa']);
    expect(lit.deltas).toEqual([{ id: 'h', kind: 'deception', magnitude01: 1 }]);
    const dark = run(null);
    expect(dark.npcDeltas).toEqual([]);
    // anchored: `lit` above carries npcIds on the same beat, so the absence is the dark shape.
    expect(dark.newsEntries[0]).not.toHaveProperty('npcIds');
    expect(dark.deltas).toEqual(lit.deltas);
    expect(dark.grievances).toEqual(lit.grievances);
    // And the commission casts a mouthpiece only where the plane is lit.
    const { snapshot, worldState } = baitWorld(false);
    snapshot.byId.get('h').settlement.npcs.push({ id: 'vessa', name: 'Vessa', role: 'Guildmaster' });
    const lure = (rules) => lureCommission({
      worldState: { ...worldState, simulationRules: { ...worldState.simulationRules, ...rules } },
      snapshot, liarId: 'h', subjectId: 'w', axis: STRENGTH_AXIS, assertedValue: 2, trueValue: 4, tick: TICK,
    }).record;
    expect(lure({ npcCredibilityEnabled: true }).spokespersonNpcId).toBe('h:vessa');
    // anchored: the lit twin above stamps the speaker, so the absence is the dark plane's doing.
    expect(lure({})).not.toHaveProperty('spokespersonNpcId');
  });

  test('the mouthpiece is a cast person: the lowest id the ONE chokepoint admits, never a minor soul, never the dead', () => {
    const settlement = {
      npcs: [
        { id: 'a-hostage', name: 'Ada', role: 'Mayor', importance: 'key', whereabouts: { state: 'hostage' } },
        { id: 'b-shelved', name: 'Bo', role: 'Mayor', importance: 'key', stasis: true },
        { id: 'c-jailed', name: 'Cy', role: 'Mayor', importance: 'key', status: 'jailed' },
        { id: 'c-dead', name: 'Cd', role: 'Mayor', importance: 'key', status: 'dead' },
        { id: 'd-speaker', name: 'Di', role: 'Mayor', importance: 'key' },
        { id: 'e-nobody', name: 'Ed', role: 'Laborer', importance: 'minor' },
      ],
    };
    expect(castLureMouthpiece('h', settlement)).toBe('h:d-speaker');
    // anchored: the same roster answers above, so the empty cast is the chokepoint's doing.
    expect(castLureMouthpiece('h', { npcs: settlement.npcs.slice(0, 4) })).toBe('');
    // anchored: same — a minor soul alone never fronts a lie.
    expect(castLureMouthpiece('h', { npcs: [settlement.npcs[5]] })).toBe('');
  });
});

describe('IN-2 — the editor line: the direction, the predicate and the commission', () => {
  test('commission-lie resolves through resolveDecree, refuses an axis word outside the set, and refuses a phantom subject', () => {
    const catalogues = { opTypes: LURE_DIRECTION_OP_TYPES, pools: {} };
    const op = (axis, assertedValue, subject = 'w') => ({ type: LURE_DIRECTION_TYPE, target: { kind: 'settlement', id: 'h' }, payload: { subject, axis, assertedValue } });
    let registry = [];
    LURE_AXES.forEach((axis, index) => { registry = stage(registry, op(axis, 'x'), { id: `d${index}`, orderedAt: 't0' }); });
    expect(registry).toHaveLength(LURE_AXES.length);
    for (const entry of registry) expect(resolveDecree(entry, catalogues)).toEqual({ ok: true });
    const outside = stage([], op('harvest', 'deep'), { id: 'x', orderedAt: 't0' })[0];
    expect(resolveDecree(outside, catalogues)).toEqual({ ok: false, missing: 'pool-value', was: 'harvest' });
    const { snapshot } = baitWorld(false);
    expect(lieCommissionRefusal(op('stores', 'deep'), snapshot)).toBeNull();
    expect(lieCommissionRefusal(op(STRENGTH_AXIS, 2), snapshot)).toBeNull();
    expect(lieCommissionRefusal(op('faith', 'Morv'), snapshot)).toBeNull();
    expect(lieCommissionRefusal(op('stores', 'bottomless'), snapshot)?.code).toBe('value_off_axis');
    expect(lieCommissionRefusal(op(STRENGTH_AXIS, 7), snapshot)?.code).toBe('value_off_axis');
    // A phantom is a LIBRARY row that never enters the campaign's courts: refused by construction.
    const phantom = { id: 'ph', kind: PHANTOM_KIND, name: 'Farhollow', seed: 'seed-1', traits: {} };
    expect(snapshot.settlements.map((row) => row.id)).toContain('w');
    // anchored: the snapshot's own ids are read one line up, so this absence is the construction.
    expect(snapshot.settlements.map((row) => row.id)).not.toContain(phantom.id);
    expect(lieCommissionRefusal(op('stores', 'deep', phantom.id), snapshot)?.code).toBe('phantom_subject');
    expect(LIE_COMMISSION_REFUSALS).toEqual([...LIE_COMMISSION_REFUSALS].sort());
    const row = LURE_DIRECTION_OP_TYPES[LURE_DIRECTION_TYPE];
    expect(Object.keys(row).sort()).toEqual(Object.keys(OP_TYPES['add-faction']).sort());
    expect(row).toMatchObject({ target: 'settlement', stage: 'home', consequence: 'home' });
    expect(row.requires).toEqual({ world: ['beliefExists', PLANT_CHANNEL_CONDITION], registry: [] });
    expect(row.payload.axis.values).toBe(LURE_AXES);
    expect(row.payload.subject).toEqual({ kind: 'ref', required: true });
  });

  test('plantChannel holds TRUE with its houses as subjects, and FALSE without a house, dark, or with no campaign', () => {
    const { snapshot, worldState } = baitWorld(false);
    const host = snapshot.byId.get('h').settlement;
    expect(PLANT_CHANNEL_ROW.subjects(host, { worldState })).toEqual(['mk']);
    expect(PLANT_CHANNEL_ROW.predicate(host, { worldState })).toBe(true);
    expect(PLANT_CHANNEL_ROW.subjects(snapshot.byId.get('t').settlement, { worldState })).toEqual([]);
    expect(PLANT_CHANNEL_ROW.predicate(snapshot.byId.get('t').settlement, { worldState })).toBe(false);
    const dark = { ...worldState, simulationRules: { ...worldState.simulationRules, [FLAG]: false } };
    expect(PLANT_CHANNEL_ROW.predicate(host, { worldState: dark })).toBe(false);
    expect(PLANT_CHANNEL_ROW.predicate(host, null)).toBe(false);
    expect(PLANT_CHANNEL_ROW.source).toBe('live');
    expect(LURE_WORLD_CONDITIONS).toEqual({ [PLANT_CHANNEL_CONDITION]: PLANT_CHANNEL_ROW });
  });

  test('THE COMMISSION, end to end over one world, and each of its honest refusals', () => {
    const { snapshot, worldState } = baitWorld(false);
    const commission = (overrides = {}, rules = {}) => lureCommission({
      worldState: { ...worldState, simulationRules: { ...worldState.simulationRules, ...rules } }, snapshot,
      liarId: 'h', subjectId: 'w', axis: STRENGTH_AXIS, assertedValue: 2, trueValue: 4, tick: TICK, ...overrides,
    });
    const made = commission();
    expect(made).toMatchObject({ refused: false, key: 'plant:h:t:w', markId: 't' });
    expect(made.record).toEqual({ liarId: 'h', subjectId: 'w', audienceId: 't', assertedBand: 2, trueBand: 4, seededTick: TICK, lineageId: `disinfo:h:t:${TICK}`, intent: 'deflate' });
    expect(made.override).toMatchObject({ strengthBand: 2, lastUpdateTick: TICK });
    expect(commission({}, { [FLAG]: false }).refusal).toBe('dark');
    expect(commission({ liarId: 't' }).refusal).toBe('no_house');
    expect(commission({ subjectId: 'ph' }).refusal).toBe('phantom_subject');
    expect(commission({ trueValue: null }).refusal).toBe('no_truth');
    expect(commission({ trueValue: 2 }).refusal).toBe('no_lie');
    expect(commission({ assertedValue: 3 }).refusal).toBe('no_mark');
    expect(commission({ axis: 'harvest' }).refusal).toBe('value_off_axis');
    expect(commission({ assertedValue: 9 }).refusal).toBe('value_off_axis');
    // A family axis needs its SP-B family lit, or no reckoning can hold the story.
    const stores = { axis: 'stores', assertedValue: 'deep', trueValue: 'bare' };
    expect(commission(stores).refusal).toBe('axis_dark');
    const lit = commission(stores, { beliefAxesEnabled: true, believedConditionsEnabled: true });
    expect(lit).toMatchObject({ refused: false, markId: 't' });
    expect(lit.record).toMatchObject({ axis: 'stores', assertedValue: 'deep', trueValue: 'bare', intent: 'inflate' });
    expect(lit.override.conditionsBands).toEqual({ storesBand: 'deep' });
    // Every closed refusal is reachable on this one world, and the success carries none.
    const reached = ['dark', 'no_house', 'phantom_subject', 'no_truth', 'no_lie', 'no_mark', 'axis_dark', 'value_off_axis'];
    expect([...reached].sort()).toEqual([...LIE_COMMISSION_REFUSALS]);
    expect(made.refusal).toBeNull();
  });

  test('every reader the wave adds takes a phantom partner — a minimal library row — without throwing', () => {
    const phantom = { id: 'ph', kind: PHANTOM_KIND, name: 'Farhollow', seed: 'seed-1', traits: {} };
    const { snapshot, worldState } = baitWorld(false);
    expect(plantChannelHouses(phantom, { worldState })).toEqual([]);
    expect(castLureMouthpiece('ph', phantom)).toBe('');
    // The phantom stands in the library, never in the snapshot, so no aim can reach it.
    const withLibrary = { ...snapshot, library: [phantom] };
    expect(selectLureMark({ snapshot: withLibrary, worldState, liarId: 'h', subjectId: 'w', axis: STRENGTH_AXIS, assertedValue: 2 })?.markId).toBe('t');
    expect(lieExposure({ liarId: 'h', subjectId: 'ph', audienceId: 't', axis: 'faith', assertedValue: 'Morv', trueValue: 'Aldra', seededTick: 9 }, null, TICK).outcome).toBe('caught');
  });
});

describe('IN-2 — the channels, the registry and the restraint', () => {
  test('THE TWO-CHANNEL RULING — no axis token is a picture field and neither channel names the other, with a planted violation convicted', () => {
    const picture = new Set(ENVOY_PICTURE_PLANT_FIELDS);
    expect(LURE_AXES.filter((axis) => picture.has(axis))).toEqual([]);
    expect(ENVOY_PICTURE_PLANT_FIELDS.filter((field) => LURE_AXES.includes(field))).toEqual([]);
    const quoted = (src) => new Set([...src.matchAll(/(['"`])([A-Za-z_.]+)\1/g)].map((m) => m[2]));
    const scanAxisSide = (src) => [...quoted(src)].filter((word) => picture.has(word) || /envoy_picture|pictureId|ENVOY_PICTURE/.test(word));
    const scanPictureSide = (src) => [...quoted(src)].filter((word) => LURE_AXES.includes(word));
    const lure = readFileSync(join(ROOT, 'src/domain/worldPulse/infoLure.js'), 'utf8');
    expect(lure).toMatch(/export const LURE_AXES/);
    // anchored: the source read above is the live leaf (it declares LURE_AXES one line up).
    expect(lure).not.toMatch(/ENVOY_PICTURE_PLANT_FIELDS|envoyPicturePatches|pictureId/);
    expect(scanAxisSide(lure)).toEqual([]);
    for (const rel of ['src/domain/worldPulse/brokerageServicesPlant.js', 'src/domain/worldPulse/disinformationPlant.js']) {
      const src = readFileSync(join(ROOT, rel), 'utf8');
      expect(scanPictureSide(src), rel).toEqual([]);
      expect(src, rel).toMatch(/ENVOY_PICTURE_PLANT_FIELDS/);
      // anchored: each file really is a picture-channel site (it spells the vocabulary, one line up).
      expect(src, rel).not.toMatch(/infoLure|assertedValue/);
    }
    // THE PLANTED VIOLATIONS: the same scans convict a picture field planted on the axis side
    // and an axis token planted in the picture vocabulary.
    expect(scanAxisSide(`${lure}\nconst leak = 'storesBand';`)).toEqual(['storesBand']);
    expect(scanPictureSide("export const ENVOY_PICTURE_PLANT_FIELDS = Object.freeze(['strengthBand', 'stores']);")).toEqual(['stores']);
  });

  test('the registry rows: HBF-72 declares LIE_OUTCOMES from the fork\'s own module, and rumourReinforcesAt is registered bare', () => {
    const lies = HABIT_FORK_REGISTRY.find((row) => row.forkId === 'HBF-72');
    expect(lies).toMatchObject({ symbol: 'processLies', actionVocabulary: 'LIE_OUTCOMES', disposition: 'DEFER' });
    expect(statecraft.LIE_OUTCOMES).toEqual(['told', 'believed', 'caught']);
    expect(statecraft.LIE_OUTCOMES).toBe(LIE_OUTCOMES);
    const rumour = HABIT_FORK_REGISTRY.find((row) => row.symbol === 'rumourReinforcesAt');
    expect(rumour).toMatchObject({ forkId: 'HBF-102', module: 'src/domain/worldPulse/npcCirculationBelief', discovery: 'bare', disposition: 'STAY', closeOwed: null, actionVocabulary: null });
    expect(String(rumour.reason).startsWith('HASHED, NOT DRAWN.')).toBe(true);
  });

  test('the live-strength restraint the bait honours is the war reasons\' own conjunction, spelled once there', () => {
    const war = readFileSync(join(ROOT, 'src/domain/worldPulse/warReasons.js'), 'utf8');
    const lure = readFileSync(join(ROOT, 'src/domain/worldPulse/infoLure.js'), 'utf8');
    expect(war).toMatch(/const predationCounterforcesLit = rules\.warLayerEnabled === true\s+&& rules\.warTerminationEnabled === true;/);
    expect(lure).toMatch(/const restraint = rules\.warLayerEnabled === true && rules\.warTerminationEnabled === true;/);
    // And the receipt the lit restraint speaks is opportunism's, never re-authored here.
    // anchored: the pattern is the refusal sentence the restraint LIT test reads off the casus.
    expect(lure).not.toMatch(/live muster shows/);
  });

  test('NO-FATES and no numbers: every sentence the lure composes, lit, carries no fate verb and no digit', () => {
    const lit = processLies(fixture({ [FLAG]: true }));
    const composed = lit.newsEntries.flatMap((entry) => [entry.headline, entry.summary, ...entry.reasons]);
    expect(composed.length).toBeGreaterThan(6);
    const clauses = LURE_AXES.map((axis) => lieClaimClause({ axis, subjectId: 'v', intent: 'deflate' }, (id) => id.toUpperCase(), true));
    for (const text of [...composed, ...clauses]) {
      // anchored: `composed` holds the lit fixture's three beats (pinned by the lit-mutant control above).
      expect(text).not.toMatch(/\d|\bhanged\b|\bkilled\b|\bexecuted\b|\bexiled\b|\bshuttered\b|\bmurdered\b/);
    }
    expect(new Set(clauses).size).toBeGreaterThan(5);
  });
});
