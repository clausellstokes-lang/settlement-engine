/**
 * npcLedgerProjection.test.js — W-H1 AUDIENCE PROJECTION (law 7 / J-D8b iii).
 *
 * "Players see the wanderer, never the owner." The pins below assert the covert payload
 * is held out by TWO INDEPENDENT mechanisms, because either alone is a single point of
 * failure:
 *
 *   1. THE ALLOWLIST   projectNpcPool builds the public record field by field, so an
 *                      unwritten field cannot appear no matter what the ledger grows.
 *   2. THE ESTATE SCRUB publicSafe.js's PRIVATE_KEY_RE already matches the `dmTruth`
 *                      spelling, so the payload is stripped again on every public path.
 *
 * ANCHORED NEGATIVES THROUGHOUT. Every "no dmTruth here" assertion is paired with the
 * DM view of the SAME fixture through the SAME helper reporting the covert path. Without
 * that anchor an empty result would be equally consistent with the projection having
 * drifted away entirely, which is precisely the vacuous green the walker laws forbid.
 */
import { describe, expect, test } from 'vitest';

import { graduateNpc, setNpcLedger, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import { openForeignGuestHold } from '../../src/domain/worldPulse/foreignGuestHold.js';
import { projectNpcPool, findDmTruthPaths, DM_TRUTH_KEY } from '../../src/domain/worldPulse/npcLedgerProjection.js';
import { PRIVATE_KEY_RE, sanitizePublicValue } from '../../src/domain/display/publicSafe.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const LIT = () => ({ simulationRules: { npcConsequencesEnabled: true }, tick: 1 });

/**
 * A world holding two graduated people who BOTH carry covert truth: one banished roamer
 * excluded from their home, one jailed official still hosted there.
 */
function populatedWorld() {
  const banished = graduateNpc({
    worldState: LIT(),
    settlementSeed: 'seed-aldermoor',
    settlementId: 'aldermoor',
    rosterIdentity: { rosterId: 'npc_3', name: 'Mira Vane', role: 'Magistrate' },
    tick: 5,
    verdictCause: 'banished',
    reputation: { notorietyBand: 'notorious', edictMark: 'banishment_edict', scandalClass: 'venality', alignmentRead: 'evil', competenceRead: 'capable' },
    dmTruth: { compromiseSource: 'rival_power' },
  });
  const jailed = graduateNpc({
    worldState: banished.worldState,
    settlementSeed: 'seed-crowmarch',
    settlementId: 'crowmarch',
    rosterIdentity: { rosterId: 'npc_2', name: 'Odo Blackwell', role: 'Reeve' },
    tick: 6,
    verdictCause: 'jailed',
    hostSettlementId: 'crowmarch',
    reputation: { notorietyBand: 'known', scandalClass: 'brutality' },
    dmTruth: { compromiseSource: 'criminal_institution' },
  });
  const worldState = setNpcLedger(jailed.worldState, {
    ...npcLedgerOf(jailed.worldState),
    exclusions: {
      [String(banished.wnpcId)]: [
        { settlementId: 'aldermoor', kind: 'banishment_edict', indefinite: true },
        { settlementId: 'crowmarch', kind: 'banishment_edict', untilTick: 30 },
      ],
    },
  });
  return { worldState, banishedId: String(banished.wnpcId), jailedId: String(jailed.wnpcId) };
}

/** Put the hosted official into one exact foreign-custody episode. The fixture uses a
 * venue unrelated to either origin so a public leak has an unambiguous search token. */
function heldAbroadWorld() {
  const base = populatedWorld();
  const opened = openForeignGuestHold({
    worldState: base.worldState,
    hold: {
      schemaVersion: 1,
      id: 'hold:odo-abroad',
      npcId: base.jailedId,
      errandId: 'errand:odo-abroad',
      encounterId: 'encounter:odo-abroad',
      captorId: 'power:rival-court',
      venueId: 'thornwatch',
      venueRef: { kind: 'settlement', settlementId: 'thornwatch' },
      heldSinceTick: 10,
      cause: 'private_imprisonment',
      continuation: {
        schemaVersion: 1,
        resumeState: 'travelling',
        journey: 'outbound',
        destinationId: 'aldermoor',
        interruptedTick: 9,
        positionRef: {
          journey: 'outbound',
          legIndex: 0,
          fromId: 'thornwatch',
          toId: 'aldermoor',
          progressBand: 'underway',
        },
        journeyLegs: [{
          fromId: 'thornwatch',
          toId: 'aldermoor',
          departTick: 8,
          arrivalTick: 15,
          journey: 'outbound',
          routeRef: { id: 'road:thornwatch-aldermoor' },
        }],
        expectedReturnTick: 20,
      },
    },
  });
  expect(opened.reason).toBe('opened');
  return { ...base, worldState: opened.worldState };
}

describe('the pool projection is live and correctly shaped (the anchor for every negative)', () => {
  test('the DM view carries both people, their facets, and their covert truth', () => {
    const { worldState, banishedId, jailedId } = populatedWorld();
    const dm = projectNpcPool({ worldState, tick: 20, includeCovert: true });
    expect(dm.total).toBe(2);
    expect(dm.roamers.map((r) => r.wnpcId)).toEqual([banishedId]);
    expect(dm.placed.map((r) => r.wnpcId)).toEqual([jailedId]);

    const mira = dm.roamers[0];
    expect(mira.name).toBe('Mira Vane');
    expect(mira.role).toBe('Magistrate');
    expect(mira.notorietyBand).toBe('notorious');
    expect(mira.edictMark).toBe('banishment_edict');
    expect(mira.verdictCause).toBe('banished');
    expect(mira.originSettlementId).toBe('aldermoor');
    expect(mira.hostSettlementId).toBe(null);
    expect(mira.elapsedTicks).toBe(15);
    expect(mira[DM_TRUTH_KEY]).toEqual({ compromiseSource: 'rival_power' });

    // The exclusion window is honoured at projection time: crowmarch reopens at 30.
    expect(mira.shutDoors).toEqual(['aldermoor', 'crowmarch']);
    expect(projectNpcPool({ worldState, tick: 40, includeCovert: true }).roamers[0].shutDoors).toEqual(['aldermoor']);
  });

  test('the helper that every negative below depends on actually FINDS covert truth', () => {
    // GUARD THE GUARD. If findDmTruthPaths were broken, every "no paths" assertion in
    // this file would be a vacuous green.
    const { worldState } = populatedWorld();
    const dmPaths = findDmTruthPaths(projectNpcPool({ worldState, tick: 20, includeCovert: true }));
    expect(dmPaths).toEqual(['$.roamers[0].dmTruth', '$.placed[0].dmTruth']);
    expect(findDmTruthPaths({ a: [{ b: { dmTruth: 1 } }] })).toEqual(['$.a[0].b.dmTruth']);
    expect(findDmTruthPaths({ nothing: 'here' })).toEqual([]);
  });
});

describe('LAW 7 — zero dmTruth keys reach a player projection', () => {
  test('the player pool carries the people but none of the covert payload', () => {
    const { worldState, banishedId } = populatedWorld();
    const dm = projectNpcPool({ worldState, tick: 20, includeCovert: true });
    const player = projectNpcPool({ worldState, tick: 20, includeCovert: false });

    // ANCHOR: the player view is the SAME size and names the SAME people, so the empty
    // covert result below measures REMOVAL rather than an emptied collection.
    expect(player.total).toBe(dm.total);
    expect(player.roamers.map((r) => r.wnpcId)).toEqual(dm.roamers.map((r) => r.wnpcId));
    expect(player.placed.map((r) => r.wnpcId)).toEqual(dm.placed.map((r) => r.wnpcId));
    expect(player.roamers[0].name).toBe('Mira Vane');

    expect(findDmTruthPaths(dm).length, 'anti-vacuity: the DM view must carry covert paths').toBeGreaterThan(0);
    expect(findDmTruthPaths(player), 'a player projection must carry ZERO dmTruth keys').toEqual([]);

    // Key-level anchored negative on one record: a live sibling key proves the record
    // is populated and correctly shaped while dmTruth is the one thing kept out.
    expectAbsentWithAnchor(
      Object.keys(player.roamers[0]),
      DM_TRUTH_KEY,
      'notorietyBand',
      'player roamer record keys',
    );
  });

  test('includeCovert DEFAULTS to false, so the unsafe call is the one you must type', () => {
    const { worldState } = populatedWorld();
    // The estate convention (mobilizationStatus / tradePressure / politicsRead): a
    // caller who forgets the flag gets the SAFE view, never the covert one.
    expect(findDmTruthPaths(projectNpcPool({ worldState, tick: 20 }))).toEqual([]);
    expect(findDmTruthPaths(projectNpcPool({ worldState, tick: 20, includeCovert: undefined }))).toEqual([]);
    // And only the exact boolean true opens it: a truthy string must not.
    expect(findDmTruthPaths(projectNpcPool({ worldState, tick: 20, includeCovert: /** @type {never} */ ('yes') }))).toEqual([]);
    expect(findDmTruthPaths(projectNpcPool({ worldState, tick: 20, includeCovert: true })).length).toBeGreaterThan(0);
  });

  test('THE ALLOWLIST IS STRUCTURAL: a future covert field cannot ride through either', () => {
    // Plant fields no projection statement writes, exactly as H2/H3 will grow the
    // record. A delete-based scrub would leak these; an allowlist cannot.
    const { worldState, banishedId } = populatedWorld();
    const ledger = npcLedgerOf(worldState);
    const contaminated = setNpcLedger(worldState, {
      ...ledger,
      roamers: {
        ...ledger.roamers,
        [banishedId]: /** @type {never} */ ({
          ...ledger.roamers[banishedId],
          secretPatron: 'the rival crown',
          dmNotes: 'he answers to Crowmarch',
          plotHook: 'a letter under the floor',
        }),
      },
    });
    const player = projectNpcPool({ worldState: contaminated, tick: 20, includeCovert: false });
    const serialized = JSON.stringify(player);
    for (const leaked of ['secretPatron', 'dmNotes', 'plotHook', 'the rival crown', 'answers to Crowmarch']) {
      expect(serialized.includes(leaked), `${leaked} leaked into a player projection`).toBe(false);
    }
    // ANCHOR: the record is genuinely present and genuinely came from that ledger entry.
    expect(player.roamers[0].wnpcId).toBe(banishedId);
    expect(player.roamers[0].name).toBe('Mira Vane');

    // The DM view is equally closed: only the ONE declared covert field survives.
    const dmRecord = projectNpcPool({ worldState: contaminated, tick: 20, includeCovert: true }).roamers[0];
    expect(Object.keys(dmRecord)).not.toContain('secretPatron'); // anchored: the same key list is asserted to contain dmTruth on the next line, proving the record is live and populated
    expect(Object.keys(dmRecord)).toContain(DM_TRUTH_KEY);
  });

  test('foreign custody is exact DM truth while every public address and captor fact stays dark', () => {
    const { worldState, jailedId } = heldAbroadWorld();
    const dm = projectNpcPool({ worldState, tick: 20, includeCovert: true });
    const player = projectNpcPool({ worldState, tick: 20, includeCovert: false });

    // A prison abroad is not a new settlement membership: both audiences keep the
    // person in the roaming half, while only the DM receives the exact custody DTO.
    const dmOdo = dm.roamers.find((row) => row.wnpcId === jailedId);
    const playerOdo = player.roamers.find((row) => row.wnpcId === jailedId);
    expect(dmOdo?.dmTruth?.foreignGuestHold).toMatchObject({
      id: 'hold:odo-abroad',
      npcId: jailedId,
      errandId: 'errand:odo-abroad',
      encounterId: 'encounter:odo-abroad',
      captorId: 'power:rival-court',
      venueId: 'thornwatch',
      heldSinceTick: 10,
      cause: 'private_imprisonment',
      continuation: { destinationId: 'aldermoor', journey: 'outbound' },
    });
    expect(dmOdo?.hostSettlementId).toBe('crowmarch');
    expect(playerOdo).toMatchObject({ wnpcId: jailedId, hostSettlementId: null });
    // The toMatchObject directly above proves `playerOdo` is a live, correctly keyed
    // projection row, so a dropped or emptied row reds THERE rather than passing these
    // two whereabouts exclusions vacuously.
    // anchored: live, correctly keyed row proven by the toMatchObject above.
    expect(playerOdo).not.toHaveProperty('restingAt');
    // anchored: same live-row proof from the toMatchObject above.
    expect(playerOdo).not.toHaveProperty('travellingTo');
    expect(findDmTruthPaths(player)).toEqual([]);
    const playerBytes = JSON.stringify(player);
    for (const secret of ['hold:odo-abroad', 'errand:odo-abroad', 'power:rival-court', 'thornwatch']) {
      expect(playerBytes.includes(secret), `public projection leaked ${secret}`).toBe(false);
    }

    // Local scope cannot disclose the secret venue. The same DM projection can address
    // its exact settlement; the player projection has no local row there at all.
    expect(projectNpcPool({
      worldState, tick: 20, settlementId: 'thornwatch', includeCovert: true,
    }).roamers.map((row) => row.wnpcId)).toEqual([jailedId]);
    expect(projectNpcPool({
      worldState, tick: 20, settlementId: 'thornwatch', includeCovert: false,
    }).total).toBe(0);
  });

  test('the internal positional slot id is never projected to any audience', () => {
    // A SUBSTRING SCAN IS THE WRONG INSTRUMENT HERE, and the first draft of this pin
    // proved it by failing: every durable id is spelled `wnpc_<hex>`, which CONTAINS
    // the substring `npc_`, so `serialized.includes('npc_3')` reds whenever a hash
    // happens to begin with 3. The property is about VALUES, so the scan walks values
    // and matches the whole positional-id shape.
    const positional = /^npc_\d+$/;
    /** @param {unknown} value @returns {string[]} */
    const stringValues = (value) => {
      if (typeof value === 'string') return [value];
      if (Array.isArray(value)) return value.flatMap(stringValues);
      if (value && typeof value === 'object') return Object.values(value).flatMap(stringValues);
      return [];
    };
    const { worldState } = populatedWorld();
    for (const includeCovert of [false, true]) {
      const projected = projectNpcPool({ worldState, tick: 20, includeCovert });
      const values = stringValues(projected);
      // ANCHOR: the origin STORY POINTER the design asks for IS present, so an absent
      // slot id measures withholding rather than an empty projection.
      expect(values, `the origin pointer must survive (includeCovert=${includeCovert})`).toContain('aldermoor');
      expect(values.filter((v) => positional.test(v)), 'a raw positional slot id must not reach a register').toEqual([]);
      expect(JSON.stringify(projected).includes('rosterId')).toBe(false);
    }
    // ANTI-VACUITY for the matcher itself: it does recognise a positional id.
    expect(positional.test('npc_3')).toBe(true);
    expect(positional.test('wnpc_3a1f0c22')).toBe(false);
  });
});

describe('DEFENCE IN DEPTH — the estate-wide scrub independently strips the same field', () => {
  test('publicSafe PRIVATE_KEY_RE already matches the dmTruth spelling', () => {
    // The field name was CHOSEN so the existing denylist covers it. If someone renames
    // it to something the regex misses, this reds and names the coupling.
    expect(PRIVATE_KEY_RE.test(DM_TRUTH_KEY)).toBe(true);
    // Anti-vacuity: the regex is not simply true for everything.
    expect(PRIVATE_KEY_RE.test('notorietyBand')).toBe(false);
    expect(PRIVATE_KEY_RE.test('wnpcId')).toBe(false);
  });

  test('a DM projection run through the public scrub loses its covert truth', () => {
    const { worldState } = populatedWorld();
    const dm = projectNpcPool({ worldState, tick: 20, includeCovert: true });
    expect(findDmTruthPaths(dm).length, 'anti-vacuity: the input must carry covert paths').toBeGreaterThan(0);
    const scrubbed = sanitizePublicValue(dm);
    expect(findDmTruthPaths(scrubbed), 'the estate scrub must strip dmTruth even from a DM-built value').toEqual([]);
    // ANCHOR: the scrub kept the public payload, so the empty result above is removal.
    expect(JSON.stringify(scrubbed)).toContain('Mira Vane');
  });
});

describe('ONE TRUTH, TWO VIEWS — the local projection is the same read model filtered', () => {
  test('a settlement scope narrows the pool without forking a second projection', () => {
    const { worldState, banishedId, jailedId } = populatedWorld();
    const world = projectNpcPool({ worldState, tick: 20, includeCovert: false });
    expect(world.total).toBe(2);

    const aldermoor = projectNpcPool({ worldState, tick: 20, settlementId: 'aldermoor' });
    expect(aldermoor.roamers.map((r) => r.wnpcId)).toEqual([banishedId]);
    expect(aldermoor.placed).toEqual([]);

    const crowmarch = projectNpcPool({ worldState, tick: 20, settlementId: 'crowmarch' });
    expect(crowmarch.roamers).toEqual([]);
    expect(crowmarch.placed.map((r) => r.wnpcId)).toEqual([jailedId]);

    const nowhere = projectNpcPool({ worldState, tick: 20, settlementId: 'unknown_town' });
    expect(nowhere.total).toBe(0);

    // The local view obeys law 7 exactly as the world view does.
    expect(findDmTruthPaths(aldermoor)).toEqual([]);
    expect(findDmTruthPaths(projectNpcPool({ worldState, tick: 20, settlementId: 'aldermoor', includeCovert: true })).length).toBeGreaterThan(0);
  });

  test('an empty or dormant world projects an empty pool rather than throwing', () => {
    expect(projectNpcPool({ worldState: { simulationRules: {} }, tick: 5 })).toEqual({ roamers: [], placed: [], total: 0 });
    expect(projectNpcPool({ worldState: null, tick: 5 })).toEqual({ roamers: [], placed: [], total: 0 });
  });
});
