/**
 * locksSurviveFullGenerate.test.js — THE PROMISE guard for locks engine PHASE B,
 * pinned against the REAL pipeline.
 *
 * Sibling of locksSurviveReroll.test.js, which pins the same two obligations for a
 * SECTION reroll. This file pins them for a FULL generate, where the stakes are
 * higher because a full roll re-issues every id to a stranger:
 *
 *  1. BYTE-IDENTITY / DORMANCY, and it is the constitutional one. A settlement
 *     whose lock map names no NPC id — absent, `{}`, booleans-only, name-keyed
 *     arrays only, garbage, or ids nobody holds — must come out of the carry as
 *     the SAME OBJECT the pipeline produced. Not deep-equal: the same reference,
 *     because that is the only proof the carry could not have rewritten a byte.
 *     THE PROMISE ("a seed is a world, forever") allows no same-seed drift, and a
 *     lock-free world is the world every existing save is in. If this reds, the
 *     tail has stopped being additive — do NOT re-record anything, find the draw.
 *
 *  2. ⛔ NO SURVIVAL (owner orders 2026-09-17, "remove the other padlocks"). This arm
 *     used to pin that a locked character comes bodily through a full generate and
 *     the town is repaired around them. The roster-row padlock is gone and the read
 *     side reads no lock (domain/locksPreservation.js normalizeLocks), so the carry
 *     sits at its dormancy gate for EVERY stored map: the victim a plain generate
 *     loses stays lost, with the same reference back and no report, however many
 *     ids the map names. The carry tail itself is kept in code, unreached, for a
 *     veto; its prefix-collision prose cure is pinned at its shared helper in
 *     tests/generators/departedNameProseBoundary.test.js.
 *
 * Against the real pipeline, never a hand-rolled roster: substitution, the
 * relevance re-sort, the archetype prose and the faction relink that make ids move
 * only exist there (generator-probe-corpus hazard — bare generators are not the
 * pipeline).
 *
 * seed-loop: collected — the dormancy sweep runs every lock shape through
 * collectSeedFailures, so a partial breakage reports its true size.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeAll } from 'vitest';
import {
  generateSettlementPipeline,
  carryLockedRosterThroughGenerate,
} from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CFG = {
  settType: 'town',
  culture: 'germanic',
  terrain: 'grassland',
  tradeRouteAccess: 'road',
};
// A pair chosen by probe, not by hope: world A's roster is strictly larger than
// world B's and several of A's mid-roster characters are absent from B, so a lock
// that still acted would have somebody to carry.
const SEED_A = 'lockb-A-1';
const SEED_B = 'lockb-B-1';

/** @type {Record<string, any>} */
let worldA;
/** @type {Record<string, any>} */
let worldB;

beforeAll(() => {
  worldA = generateSettlementPipeline(CFG, null, { seed: SEED_A, customContent: {} });
  worldB = generateSettlementPipeline(CFG, null, { seed: SEED_B, customContent: {} });
}, 120_000);

/** Names in world B that a plain generate keeps — used to pick a real victim. */
function bNames() {
  return new Set(worldB.npcs.map((/** @type {any} */ n) => String(n.name)));
}

/** A mid-roster character of world A that world B does NOT contain. Deliberately
 *  not index 0: the roster leader can survive for unrelated reasons. */
function victim() {
  const keep = bNames();
  return worldA.npcs.slice(1).find((/** @type {any} */ n) => !keep.has(String(n.name)));
}

describe('THE PROMISE — a full generate is untouched unless the map names an NPC', () => {
  test('every lock shape that names no NPC id returns the SAME settlement object', () => {
    /** Each entry is a lock map that must leave the roll alone. */
    const shapes = [
      undefined, null, {}, 'locked', 42,
      { identity: true, geography: true, history: true },
      // The whole-section boolean is not an id list; it stays a no-op here (§1c).
      { npcs: true },
      // Name-keyed arrays are kept in the MAP but carry no object into the town.
      { factions: ['faction.the-guild'], institutions: ['the-mint'] },
      { npcs: 'npc_1' }, { npcs: [] }, { npcs: [null, ''] }, { weather: true },
      // An id nobody in the previous roster holds preserves nobody, so the town
      // must come back untouched rather than half-rebuilt.
      { npcs: ['npc_does_not_exist_x'] },
      // ⛔ AND SINCE OWNER ORDERS 2026-09-17, a map naming REAL previous characters too:
      // the per-character padlock is retired and no stored id is read.
      { npcs: worldA.npcs.slice(0, 3).map((/** @type {any} */ n) => String(n.id)) },
      { npcs: worldA.npcs.map((/** @type {any} */ n) => String(n.id)), history: true, identity: true },
    ];
    const failures = collectSeedFailures(shapes, (locks) => {
      const out = carryLockedRosterThroughGenerate(worldA, worldB, /** @type {any} */ (locks));
      // SAME REFERENCE. Deep-equality would pass over a rebuilt-but-identical
      // object, and a rebuild is exactly where a hidden draw would hide.
      expect(out.settlement).toBe(worldB);
      expect(Object.prototype.hasOwnProperty.call(out, '_preservation')).toBe(false);
    });
    expectNoSeedFailures(failures, 'every NPC-id-free lock shape leaves the fresh town identical');
  });

  test('a missing or empty previous roster is dormant too', () => {
    const locks = { npcs: ['npc_1'] };
    expect(carryLockedRosterThroughGenerate(null, worldB, locks).settlement).toBe(worldB);
    expect(carryLockedRosterThroughGenerate({}, worldB, locks).settlement).toBe(worldB);
    expect(carryLockedRosterThroughGenerate({ npcs: [] }, worldB, locks).settlement).toBe(worldB);
  });
});

describe('a STORED lock carries nobody through the full generate that replaces them (owner orders 2026-09-17)', () => {
  test('the fixture is not vacuous — a plain full generate really does lose them', () => {
    expect(worldA.npcs.length).toBeGreaterThan(2);
    const target = victim();
    expect(target, 'world B must be missing at least one mid-roster character of world A').toBeTruthy();
    // anchored: the same collection is asserted non-empty and to contain a
    // sibling on the line below, so an emptied roster cannot fake this green.
    expect(bNames().size).toBeGreaterThan(0);
    expect(bNames().has(String(worldB.npcs[0].name))).toBe(true);
    expect(bNames().has(String(target.name))).toBe(false);
  });

  test('a stored id naming that character returns the fresh town by reference, with no report', () => {
    const target = victim();
    const out = carryLockedRosterThroughGenerate(worldA, worldB, { npcs: [String(target.id)] });
    expect(out.settlement, 'a stored lock rebuilt the fresh town').toBe(worldB);
    expect(Object.prototype.hasOwnProperty.call(out, '_preservation'), 'a stored lock still minted a report').toBe(false);
    const names = out.settlement.npcs.map((/** @type {any} */ n) => String(n.name));
    // The anchor is world B's own roster leader, who travels the identical path.
    expectAbsentWithAnchor(names, String(target.name), String(worldB.npcs[0].name), ' (a stored per-character lock)');
  });

  test('OVERFLOW-sized map — every previous id stored — still carries nobody', () => {
    expect(worldA.npcs.length).toBeGreaterThan(worldB.npcs.length);
    const locks = { npcs: worldA.npcs.map((/** @type {any} */ n) => String(n.id)) };
    const out = carryLockedRosterThroughGenerate(worldA, worldB, locks);
    expect(out.settlement).toBe(worldB);
    expect(out.settlement.npcs.length).toBe(worldB.npcs.length);
  });
});
