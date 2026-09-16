/**
 * concludedWarLedger.test.js — W-MEM's record shape and its persistence lifecycle.
 *
 * The ledger is the Remembrance-grade durable record of wars that ENDED
 * (DESIGN_W_MEM §2). Its whole value is honesty, so the properties pinned here are
 * the ones a dishonest ledger would break first: dormancy is byte-exact, a record
 * never acquires prose, an unknown future field survives an older reader, and a
 * malformed record is refused rather than half-admitted.
 */
import { describe, expect, test } from 'vitest';

import {
  CLOSE_ROADS,
  CONCLUDED_WAR_FORMS,
  CONCLUDED_WAR_SCHEMA_VERSION,
  NOTABLE_ENGAGEMENT_CAP,
  PARTICIPANT_SIDES,
  isKnownCloseRoad,
  normalizeConcludedWarRecord,
  normalizeConcludedWars,
  originPairOf,
  warIdFor,
} from '../../src/domain/worldPulse/concludedWarRecord.js';
import { ensureWorldState, CONDITIONAL_LEDGER_KEYS } from '../../src/domain/worldPulse/worldState.js';
import { classifyWarEnding } from '../../src/domain/certification/warEndingClassifier.js';

/**
 * A record the normalizer REFUSED is a test-authoring bug, not a soft assertion: it
 * would turn every property check below into a vacuous pass on undefined. Fail loudly.
 * @param {Record<string, unknown>|null} record @returns {Record<string, unknown>}
 */
function admitted(record) {
  if (!record) throw new Error('the normalizer refused a record this test needs admitted');
  return record;
}

/** A minimal, VALID sealed record — the floor every test below builds on. */
const baseRecord = (over = {}) => ({
  warId: 'war.ashford.kelby.3.0',
  originPair: ['ashford', 'kelby'],
  originAttackerId: 'ashford',
  openedTick: 3,
  concludedTick: 9,
  ...over,
});

describe('the war id is an address, and the opening tick is a FIELD', () => {
  test('the id sorts the pair and carries tick + sequence legs', () => {
    expect(warIdFor({ lowId: 'kelby', highId: 'ashford', openedTick: 12 }))
      .toBe('war.kelby.ashford.12.0');
    expect(warIdFor({ lowId: 'ashford', highId: 'kelby', openedTick: 12, seq: 1 }))
      .toBe('war.ashford.kelby.12.1');
  });

  test('two settlements can open reciprocal wars on ONE tick, so the seq leg is load-bearing', () => {
    // The blocking gate reads the PRE-tick graph, so neither side sees the other's
    // same-tick mint. Without the seq the two ids would collide silently.
    const first = warIdFor({ lowId: 'ashford', highId: 'kelby', openedTick: 7, seq: 0 });
    const second = warIdFor({ lowId: 'ashford', highId: 'kelby', openedTick: 7, seq: 1 });
    expect(first).not.toBe(second);
  });

  test('ORDERING BY KEY IS A TRAP the record refuses: codepoint order sorts ticks lexically', () => {
    const ids = [
      warIdFor({ lowId: 'a', highId: 'b', openedTick: 9 }),
      warIdFor({ lowId: 'a', highId: 'b', openedTick: 100 }),
    ];
    // Lexically, "100" precedes "9" — so a consumer ordering by KEY would put the
    // later war first. This is exactly why openedTick is carried as a field.
    expect([...ids].sort()).toEqual([ids[1], ids[0]]);
    const byField = [{ id: ids[0], openedTick: 9 }, { id: ids[1], openedTick: 100 }]
      .sort((a, b) => a.openedTick - b.openedTick).map((r) => r.id);
    expect(byField).toEqual([ids[0], ids[1]]);
  });

  test('the pair is codepoint-sorted in both argument orders', () => {
    expect(originPairOf('kelby', 'ashford')).toEqual(['ashford', 'kelby']);
    expect(originPairOf('ashford', 'kelby')).toEqual(['ashford', 'kelby']);
  });
});

describe('the closed registers', () => {
  test('every close road is a lowercase-underscore token', () => {
    // The residue-strip marker family and the id slug both key on this shape; a
    // camelCase or hyphenated token would be silently truncated by a marker regex.
    for (const road of CLOSE_ROADS) expect(road).toMatch(/^[a-z_]+$/);
  });

  test('the recall half of the register matches the stamp sites the engine really carries', () => {
    // Seven strategic-recall causes are stamped across the estate; a road the writer
    // cannot name is a war it would mis-file, so the census is pinned here.
    for (const cause of [
      'sue_for_peace', 'return_home', 'sue_for_peace_decree', 'field_battle_retreat',
      'convoy_lost_debark', 'envoy_terms_carried_home', 'authority_verdict',
    ]) expect(CLOSE_ROADS).toContain(cause);
  });

  test('the six structural roads join them', () => {
    for (const road of [
      'attacker_lost', 'target_lost', 'siege_abandoned', 'conquest', 'razing', 'wind_down',
    ]) expect(CLOSE_ROADS).toContain(road);
  });

  test('the register is exactly those thirteen, deduped and codepoint-sorted', () => {
    expect(CLOSE_ROADS.length).toBe(13);
    expect(new Set(CLOSE_ROADS).size).toBe(13);
    expect([...CLOSE_ROADS]).toEqual([...CLOSE_ROADS].sort());
  });

  test('a road the build does not know is refused at WRITE time', () => {
    expect(isKnownCloseRoad('conquest')).toBe(true);
    expect(isKnownCloseRoad('some_future_road')).toBe(false);
  });

  test('the side and form registers are closed', () => {
    expect([...PARTICIPANT_SIDES]).toEqual(['attacker', 'attacker_ally', 'defender', 'defender_ally']);
    expect([...CONCLUDED_WAR_FORMS]).toEqual(['full', 'epitome']);
  });
});

describe('a malformed record is refused, never half-admitted', () => {
  test('a record with no address is not a thinner truth', () => {
    expect(normalizeConcludedWarRecord({ ...baseRecord(), originPair: ['ashford'] }, 'k')).toBeNull();
    expect(normalizeConcludedWarRecord({ ...baseRecord(), originPair: ['a', 'a'] }, 'k')).toBeNull();
  });

  test('orientation must name one of the two belligerents', () => {
    expect(normalizeConcludedWarRecord(baseRecord({ originAttackerId: 'morrow' }), 'k')).toBeNull();
  });

  test('a war cannot conclude before it opened', () => {
    expect(normalizeConcludedWarRecord(baseRecord({ openedTick: 9, concludedTick: 3 }), 'k')).toBeNull();
    expect(normalizeConcludedWarRecord(baseRecord({ concludedTick: -1 }), 'k')).toBeNull();
  });

  test('a casus type outside the closed taxonomy is dropped, and the record survives', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      casusReasons: [{ type: 'grievance', score: 0.5, receipt: 'r' }, { type: 'invented_casus', score: 1 }],
    }), 'k'));
    expect(out.casusReasons).toEqual([{ type: 'grievance', score: 0.5, receipt: 'r' }]);
  });
});

describe('the record carries what the estate held — no more, no less', () => {
  test('a legacy casus pin keeps its thinner shape rather than inventing a tick', () => {
    // With the termination flag dark the estate pinned no atTick. The record stores
    // what the deployment carried; inventing one would be history-invention on the
    // one surface whose entire value is honesty.
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      casusReasons: [{ type: 'grievance', score: 0.5, receipt: 'r' }],
    }), 'k'));
    const pin = /** @type {Record<string, unknown>[]} */ (out.casusReasons)[0];
    expect(Object.prototype.hasOwnProperty.call(pin, 'atTick')).toBe(false);
    const lit = admitted(normalizeConcludedWarRecord(baseRecord({
      casusReasons: [{ type: 'grievance', score: 0.5, receipt: 'r', atTick: 3 }],
    }), 'k'));
    expect(/** @type {Record<string, unknown>[]} */ (lit.casusReasons)[0].atTick).toBe(3);
  });

  test('engagement epitomes are capped, and the cap is a hard slice', () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ kind: 'field_battle', tick: i, settlementIds: ['a'] }));
    const out = admitted(normalizeConcludedWarRecord(baseRecord({ notableEngagements: many }), 'k'));
    expect(/** @type {unknown[]} */ (out.notableEngagements).length).toBe(NOTABLE_ENGAGEMENT_CAP);
  });

  test('an engagement region is present only when one was resolved — never an empty sentinel', () => {
    const withRegion = admitted(normalizeConcludedWarRecord(baseRecord({
      notableEngagements: [{ kind: 'field_battle', tick: 4, settlementIds: ['a', 'b'], region: 'morrow' }],
    }), 'k'));
    expect(/** @type {Record<string, unknown>[]} */ (withRegion.notableEngagements)[0].region).toBe('morrow');
    const without = admitted(normalizeConcludedWarRecord(baseRecord({
      notableEngagements: [{ kind: 'field_battle', tick: 4, settlementIds: ['a', 'b'], region: '' }],
    }), 'k'));
    const row = /** @type {Record<string, unknown>[]} */ (without.notableEngagements)[0];
    expect(Object.prototype.hasOwnProperty.call(row, 'region')).toBe(false);
  });

  test('a term clause keeps its declared-unit magnitude and drops the negotiation internals', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      terms: [{
        type: 'tribute', family: 'treasury', magnitude: 0.25, durationTicks: 48,
        weightSpent: 3.5, burden01: 0, seam: true,
      }],
    }), 'k'));
    const clause = /** @type {Record<string, unknown>[]} */ (out.terms)[0];
    expect(clause.magnitude).toBe(0.25);
    expect(clause.durationTicks).toBe(48);
    // anchored: the clause above really carries weightSpent/burden01 (asserted as inputs
    // three lines up), so their absence here is the slimming, not an empty fixture.
    expect(Object.prototype.hasOwnProperty.call(clause, 'weightSpent')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(clause, 'burden01')).toBe(false);
  });

  test('participants sort by id so the record is codepoint-stable', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      participants: [
        { id: 'kelby', side: 'defender' }, { id: 'ashford', side: 'attacker' },
        { id: 'briar', side: 'attacker_ally', joinedTick: 5, viaCallId: 'call.1' },
      ],
    }), 'k'));
    expect(/** @type {Record<string, unknown>[]} */ (out.participants).map((p) => p.id))
      .toEqual(['ashford', 'briar', 'kelby']);
  });
});

describe('forward versions survive an older reader', () => {
  test('an unknown top-level field is carried verbatim', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord({ someFutureLeg: { depth: 2 } }), 'k'));
    expect(out.someFutureLeg).toEqual({ depth: 2 });
  });

  test('an unknown close road and an unknown fact channel are preserved, not blanked', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      fact: { closed: true, closeRoad: 'a_road_from_the_future', someFutureChannel: 7 },
    }), 'k'));
    const fact = /** @type {Record<string, unknown>} */ (out.fact);
    expect(fact.closeRoad).toBe('a_road_from_the_future');
    expect(fact.someFutureChannel).toBe(7);
  });

  test('the record stamps its own schema version', () => {
    expect(admitted(normalizeConcludedWarRecord(baseRecord(), 'k')).schemaVersion)
      .toBe(CONCLUDED_WAR_SCHEMA_VERSION);
  });
});

describe('the seal law', () => {
  test('a record explicitly staged stays staged', () => {
    expect(admitted(normalizeConcludedWarRecord(baseRecord({ sealed: false }), 'k')).sealed).toBe(false);
  });

  test('a staged record arriving with no live edge to fold is SEALED by load hygiene', () => {
    // The import artifact: a save carried in mid-war whose deployments did not come
    // with it. Nothing else will ever revisit the record, so the fourth state is
    // refused here rather than invented downstream.
    expect(admitted(normalizeConcludedWarRecord(baseRecord(), 'k')).sealed).toBe(true);
  });
});

describe('the ledger normalizer and its dormancy contract', () => {
  test('an absent, non-object or EMPTY ledger yields undefined so the key is omitted', () => {
    expect(normalizeConcludedWars(undefined)).toBeUndefined();
    expect(normalizeConcludedWars({})).toBeUndefined();
    expect(normalizeConcludedWars([])).toBeUndefined();
    // A ledger whose only record is refused drains to absent rather than surviving
    // as an empty artifact — the same law casusReasons and blocks take.
    expect(normalizeConcludedWars({ bad: { openedTick: 1 } })).toBeUndefined();
  });

  test('keys come back codepoint-sorted', () => {
    const out = normalizeConcludedWars({
      'war.z.z.1.0': baseRecord({ warId: 'war.z.z.1.0', originPair: ['y', 'z'], originAttackerId: 'z' }),
      'war.a.a.1.0': baseRecord({ warId: 'war.a.a.1.0', originPair: ['a', 'b'], originAttackerId: 'a' }),
    });
    expect(Object.keys(/** @type {Record<string, unknown>} */ (out))).toEqual(['war.a.a.1.0', 'war.z.z.1.0']);
  });

  test('a record filed under a key with no warId of its own adopts the key', () => {
    const { warId, ...noId } = baseRecord();
    expect(warId).toBeTruthy();
    const out = normalizeConcludedWars({ 'war.ashford.kelby.3.0': noId });
    expect(Object.keys(/** @type {Record<string, unknown>} */ (out))).toEqual(['war.ashford.kelby.3.0']);
  });
});

describe('the ledger is a conditional worldState key with byte-exact dormancy', () => {
  test('it is registered LAST — the array order is the serialized key order', () => {
    expect(CONDITIONAL_LEDGER_KEYS.at(-1)).toBe('concludedWars');
  });

  test('a world that never recorded a war serializes byte-identically to one that never could', () => {
    const never = ensureWorldState({ rngSeed: 's', tick: 4 }, { id: 'c' });
    const emptied = ensureWorldState({ rngSeed: 's', tick: 4, concludedWars: {} }, { id: 'c' });
    expect(Object.prototype.hasOwnProperty.call(never, 'concludedWars')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(emptied, 'concludedWars')).toBe(false);
    // The BIT claim, not the canonical-form claim: an absent key and an empty one must
    // serialize to the same bytes, which the dormancy oracle's absent-equals-empty
    // tolerance would otherwise hide.
    expect(JSON.stringify(emptied)).toBe(JSON.stringify(never));
  });

  test('a present ledger materializes, deep-cloned, and never aliases the loaded save', () => {
    const raw = { rngSeed: 's', tick: 9, concludedWars: { 'war.ashford.kelby.3.0': baseRecord() } };
    const ensured = ensureWorldState(raw, { id: 'c' });
    const ledger = /** @type {Record<string, Record<string, unknown>>} */ (ensured.concludedWars);
    expect(Object.keys(ledger)).toEqual(['war.ashford.kelby.3.0']);
    expect(ledger['war.ashford.kelby.3.0']).not.toBe(raw.concludedWars['war.ashford.kelby.3.0']);
  });

  test('load hygiene runs UNGATED — a malformed record is cleaned with no flag in scope', () => {
    // The fail-OPEN direction on a persistence surface is the one that must not exist:
    // an arm that only cleaned saves while the flag was lit would hand a later lit tick
    // a ledger it never validated.
    const ensured = ensureWorldState({
      rngSeed: 's', tick: 9,
      concludedWars: { good: baseRecord(), bad: { originPair: ['a', 'b'] } },
    }, { id: 'c' });
    expect(Object.keys(/** @type {Record<string, unknown>} */ (ensured.concludedWars))).toEqual(['good']);
  });

  test('the record survives a save → load round trip unchanged', () => {
    const once = ensureWorldState({ rngSeed: 's', tick: 9, concludedWars: { w: baseRecord() } }, { id: 'c' });
    const twice = ensureWorldState(JSON.parse(JSON.stringify(once)), { id: 'c' });
    expect(twice.concludedWars).toEqual(once.concludedWars);
  });

  test('REGEN: a starting world has no concluded wars, by construction', () => {
    const fresh = ensureWorldState({}, { id: 'regen-probe' });
    expect(Object.prototype.hasOwnProperty.call(fresh, 'concludedWars')).toBe(false);
  });
});

describe('the ending DERIVES from the stored fact — it is never stored', () => {
  test('the record holds no ending field of its own', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord(), 'k'));
    // anchored: the record really carries a fact block (asserted on the next line),
    // so the absent ending is the one-resolver law, not an empty record.
    expect(out.fact).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(out, 'ending')).toBe(false);
  });

  test('an applied conquest classifies as a conquest through the estate\'s own resolver', () => {
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      fact: {
        closed: true, closeRoad: 'conquest',
        terminalOutcomes: [{ id: 'world_outcome.conquest.kelby.9', candidateType: 'conquest', targetSaveId: 'kelby', tick: 9 }],
      },
    }), 'k'));
    const fact = /** @type {Record<string, unknown>} */ (out.fact);
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford', defenderId: 'kelby' }).ending).toBe('conquest');
  });

  test('THE DISMISSAL INVERSION: a dismissed conquest is recorded, and honestly is NOT a conquest', () => {
    // A dismissed conquest still CONCLUDES its war — the takeover is rolled back but
    // the armies disperse. Writing nothing would reproduce the very failure this
    // ledger exists to cure, on exactly the strangest ending. So the record EXISTS,
    // and the dismissal shapes the fact block instead: no applied conquest row.
    const out = admitted(normalizeConcludedWarRecord(baseRecord({
      fact: { closed: true, closeRoad: 'conquest', terminalOutcomes: [] },
    }), 'k'));
    expect(out.warId).toBe('war.ashford.kelby.3.0');
    const fact = /** @type {Record<string, unknown>} */ (out.fact);
    expect(fact.closeRoad).toBe('conquest');
    expect(classifyWarEnding({ ...fact, attackerId: 'ashford' }).ending).not.toBe('conquest');
  });
});
