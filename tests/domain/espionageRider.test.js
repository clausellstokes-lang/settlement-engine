/**
 * ES-Da — THE COMPOSITE RIDER'S FIVE DOORS, each driven ALONE.
 *
 * A conjunction whose arms cannot be dropped one at a time is a conjunction nobody has
 * proven, so every door below is reached on its own and returns its own reason. The
 * composed sub-record is then checked against the errand vocabulary's OWN closed sets and
 * fed to the real `normalizeCovertMission`, because a shape that satisfies a test's idea of
 * the contract and not the validator's is a shape the mint will refuse in production.
 *
 * ⚠ STRAIGHT-LINE REGISTRATION ONLY. Every `test()` here is registered at the top level of
 * its `describe`; a registration inside a loop parks the whole file and loses every title
 * in it.
 */
import { describe, expect, test, vi } from 'vitest';

import { hash01 } from '../../src/domain/region/contestMath.js';
import { covertRiderFor, riderKey } from '../../src/domain/worldPulse/espionage/espionageRider.js';
import { espionageDoctrineFor } from '../../src/domain/worldPulse/espionage/espionageDoctrineStage.js';
import { normalizeCovertMission } from '../../src/domain/worldPulse/envoyErrandRecords.js';
import {
  COVERT_DEMAND_SET,
  COVERT_FACE_SET,
  COVERT_KEYS,
  COVERT_PRODUCT_SET,
  COVERT_STOP_KEYS,
  MAX_COVERT_ITINERARY_STOPS,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import { litCovertWorld } from '../helpers/covertMissionFixture.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const FROM = 'ashford';
const TO = 'westmarch';

/** MEASURED, not chosen: `errand.a` draws under the fixture court's 0.4 cadence and
 *  `errand.b` does not. Both are re-derived in the draw test rather than trusted here. */
const RIDES_ID = 'errand.a';
const DECLINES_ID = 'errand.b';

/** A resolvable court — the doctrine reads both alignment axes off this shape. */
function court(id = FROM, name = 'Ashford') {
  return {
    id,
    name,
    settlement: {
      id,
      name,
      seed: `seed.${id}`,
      tier: 'town',
      population: 1000,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs: [],
      activeConditions: [],
    },
  };
}

/** The whole call, with only what a case varies spelled at the call site. */
function ride(patch = {}) {
  return covertRiderFor({
    worldState: litCovertWorld(),
    item: court(),
    fromId: FROM,
    toId: TO,
    errandId: RIDES_ID,
    ...patch,
  });
}

describe('ES-Da door 1 — the gate, and it is read BEFORE any world object is touched', () => {
  test('a dark world declines with its own word and reads nothing else', () => {
    expect(ride({ worldState: {} })).toEqual({ covert: null, reason: 'dark' });
    expect(covertRiderFor()).toEqual({ covert: null, reason: 'dark' });
  });

  test('absent, false, 0 and the STRING "true" are one world', () => {
    const base = litCovertWorld();
    const spell = (value) => ride({
      worldState: {
        ...base,
        simulationRules: { ...base.simulationRules, espionageEnabled: value },
      },
    });
    expect(spell(undefined)).toEqual({ covert: null, reason: 'dark' });
    expect(spell(false)).toEqual({ covert: null, reason: 'dark' });
    expect(spell(0)).toEqual({ covert: null, reason: 'dark' });
    expect(spell('true')).toEqual({ covert: null, reason: 'dark' });
    // LIVENESS: the same call with the strict `true` really does get past this door, so the
    // four refusals above are a gate doing its job rather than a fixture that never lit.
    expect(spell(true).reason).toBe('rides');
  });

  test('THE GATE IS FIRST: a dark world never touches the court item at all', () => {
    // The item throws on ANY property read. If the leaf looked at the world before gating,
    // this call would throw instead of returning; that is the byte-identity arm made
    // executable rather than asserted in prose.
    const booby = new Proxy({}, {
      get() { throw new Error('the rider read a world object before it gated'); },
    });
    expect(ride({ worldState: {}, item: booby })).toEqual({ covert: null, reason: 'dark' });
    // ...and the SAME booby item DOES throw once the gate is open — without this the test
    // above would pass on an item that was simply never dangerous.
    expect(() => ride({ item: booby })).toThrow('read a world object before it gated');
  });

  test('door 2 of the gate: espionage lit but the errand spine dark stays dark SAFELY', () => {
    const base = litCovertWorld();
    // The invalid lighting ORDER. The layer refuses at the gate rather than half-running,
    // so no covert field is read, refused or written.
    expect(ride({
      worldState: {
        ...base,
        simulationRules: { ...base.simulationRules, errandSpineEnabled: false },
      },
    })).toEqual({ covert: null, reason: 'dark' });
  });
});

describe('ES-Da door 2 — the endpoints the cargo is built out of', () => {
  test('a missing origin, target or errand id each refuse by the same name', () => {
    expect(ride({ fromId: '' }).reason).toBe('invalid_endpoints');
    expect(ride({ toId: '' }).reason).toBe('invalid_endpoints');
    expect(ride({ errandId: '' }).reason).toBe('invalid_endpoints');
    expect(ride({ fromId: '   ' }).reason).toBe('invalid_endpoints');
  });

  test('a court cannot watch itself', () => {
    expect(ride({ toId: FROM })).toEqual({ covert: null, reason: 'invalid_endpoints' });
  });
});

describe('ES-Da door 3 — a court whose axes did not resolve slips nobody aboard', () => {
  test('⚠ MEASURED: no PRODUCTION input reaches this door, and that is recorded not hidden', () => {
    // The doctrine leaf really does mint a `known:false` arm — but ONLY when no court is
    // named, and door 2 above has already refused that case by the time door 3 is asked.
    const unnamed = espionageDoctrineFor({ worldState: litCovertWorld(), item: undefined, courtId: '' });
    expect(unnamed.known).toBe(false);
    // Every OTHER route is closed because `settlementAlignment` is TOTAL: `computeLawfulness`
    // and `computeMalice` clamp to a finite 0.5 "no signal" for any item at all, so both axis
    // words always band and `known` is always true once a court is named.
    const named = ['x', 7, [], {}, { settlement: {} }, { settlement: null }]
      .map((item) => espionageDoctrineFor({ worldState: litCovertWorld(), item, courtId: 'somecourt' }).known);
    expect(named).toEqual([true, true, true, true, true, true]);
    // So door 3 is a FAIL-CLOSED GUARD against the doctrine leaf's own declared contract
    // rather than a live branch. It is driven below through the module seam rather than
    // pretended to be reachable, and the unreachability is this wave's recorded observation.
  });

  test('the guard itself fires when the doctrine leaf DOES answer unknown', async () => {
    // Driven at the module seam — the estate's own precedent for exercising an arm whose
    // producer cannot currently emit it. This asserts THIS leaf's branch, never the mock.
    vi.resetModules();
    vi.doMock('../../src/domain/worldPulse/espionage/espionageDoctrineStage.js', () => ({
      espionageDoctrineFor: () => ({ known: false, frequency01: null }),
      dispatchDemandFor: () => 'confirm',
    }));
    const seam = await import('../../src/domain/worldPulse/espionage/espionageRider.js');
    expect(seam.covertRiderFor({
      worldState: litCovertWorld(), item: court(), fromId: FROM, toId: TO, errandId: RIDES_ID,
    })).toEqual({ covert: null, reason: 'no_doctrine' });
    // ...and a null doctrine — the shape that leaf returns when dark — lands on the same word.
    vi.resetModules();
    vi.doMock('../../src/domain/worldPulse/espionage/espionageDoctrineStage.js', () => ({
      espionageDoctrineFor: () => null,
      dispatchDemandFor: () => 'confirm',
    }));
    const seam2 = await import('../../src/domain/worldPulse/espionage/espionageRider.js');
    expect(seam2.covertRiderFor({
      worldState: litCovertWorld(), item: court(), fromId: FROM, toId: TO, errandId: RIDES_ID,
    }).reason).toBe('no_doctrine');
    vi.doUnmock('../../src/domain/worldPulse/espionage/espionageDoctrineStage.js');
    vi.resetModules();
  });
});

describe('ES-Da door 4 — the draw, keyed on the errand and on nothing else', () => {
  test('the key has ONE spelling and it is the errand id', () => {
    expect(riderKey('errand.a')).toBe('es.rider.errand.a');
    expect(riderKey(undefined)).toBe('es.rider.');
  });

  test('the declining and drawing cases are MEASURED against the court cadence, not asserted', () => {
    const doctrine = espionageDoctrineFor({ worldState: litCovertWorld(), item: court(), courtId: FROM });
    expect(doctrine.known).toBe(true);
    // The arithmetic the two ids are chosen for, re-derived in the test that relies on it.
    expect(hash01(riderKey(RIDES_ID))).toBeLessThan(Number(doctrine.frequency01));
    expect(hash01(riderKey(DECLINES_ID))).toBeGreaterThanOrEqual(Number(doctrine.frequency01));
    expect(ride({ errandId: DECLINES_ID })).toEqual({ covert: null, reason: 'cadence_declined' });
    expect(ride({ errandId: RIDES_ID }).reason).toBe('rides');
  });

  test('the draw is STABLE across repeated evaluation — a keyed hash, never a PRNG', () => {
    const once = ride();
    const twice = ride();
    expect(JSON.stringify(once)).toBe(JSON.stringify(twice));
    expect(ride({ errandId: DECLINES_ID })).toEqual(ride({ errandId: DECLINES_ID }));
  });

  test('two episodes on ONE tick do not share a byte', () => {
    // The whole reason the stream is errand-keyed rather than (court, tick)-keyed.
    expect(hash01(riderKey('errand.a'))).not.toBe(hash01(riderKey('errand.b')));
  });
});

describe('ES-Da door 5 — the composed cargo, and it is exactly what the validator accepts', () => {
  test('one stop, the embassy own destination, and the court it is suing', () => {
    expect(ride().covert).toEqual({
      demand: 'confirm',
      itinerary: [{ face: 'declared', settlementId: TO, stayTicks: 1 }],
      product: 'confirm',
      subjectId: TO,
    });
  });

  test('every word is a member of the errand vocabulary CLOSED sets', () => {
    const covert = ride().covert;
    expect(COVERT_DEMAND_SET.has(covert.demand)).toBe(true);
    expect(COVERT_PRODUCT_SET.has(covert.product)).toBe(true);
    expect(COVERT_FACE_SET.has(covert.itinerary[0].face)).toBe(true);
    expect(Object.keys(covert).every((key) => COVERT_KEYS.includes(key))).toBe(true);
    expect(Object.keys(covert.itinerary[0]).sort()).toEqual([...COVERT_STOP_KEYS].sort());
    expect(covert.itinerary.length).toBeLessThanOrEqual(MAX_COVERT_ITINERARY_STOPS);
  });

  test('the THREE amender-owned keys are ABSENT, not null — a key is a byte', () => {
    const covert = ride().covert;
    const keys = Object.keys(covert);
    // `gathered` and `standoff` belong to the product stage and `legRefs` only to an
    // acquire; writing any of them at the mint would be this wave inventing surface.
    // Each exclusion carries its own liveness anchor: `demand` must be PRESENT in the same
    // key list, so none of the three can pass by measuring a list that drifted away.
    expectAbsentWithAnchor(keys, 'gathered', 'demand', 'the composed covert cargo');
    expectAbsentWithAnchor(keys, 'standoff', 'demand', 'the composed covert cargo');
    expectAbsentWithAnchor(keys, 'legRefs', 'demand', 'the composed covert cargo');
  });

  test('THE REAL VALIDATOR ACCEPTS IT UNCHANGED — no second idea of the contract', () => {
    const covert = ride().covert;
    const read = normalizeCovertMission(covert);
    expect(read.reason).toBe('covert');
    expect(read.covert).toEqual(covert);
  });

  test('the demand is the doctrine own bar, and urgency is never assumed', () => {
    const doctrine = espionageDoctrineFor({ worldState: litCovertWorld(), item: court(), courtId: FROM });
    // The accepted decision this embassy carries has no siege at the gate, so the bar is
    // the unhurried one. `corroborate` is what an urgent court would have got.
    expect(ride().covert.demand).toBe('confirm');
    expect(Number(doctrine.frequency01)).toBeGreaterThan(0.35);
  });
});
