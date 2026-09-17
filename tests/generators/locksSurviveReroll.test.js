/**
 * locksSurviveReroll.test.js — THE PROMISE guard for the locks engine, pinned
 * against the REAL pipeline.
 *
 * Two obligations, and the first one is the constitutional one:
 *
 *  1. BYTE-IDENTITY / DORMANCY. A seeded reroll run with `locks: {}` — or with
 *     the option omitted entirely, which is every caller that predates the engine
 *     — must produce output deep-equal to the run taken before locks were read at
 *     all. THE PROMISE ("a seed is a world, forever") allows no same-seed drift,
 *     and a lock-free world is the only world every existing save is in. If this
 *     test ever reds, the engine has stopped being additive and the whole design
 *     premise ("locks run over a FINISHED roll and can only ADD survivors") is
 *     void — do not re-record a golden, find the draw that moved.
 *
 *  2. ⛔ NO SURVIVAL (owner orders 2026-09-17). This arm used to pin that a locked
 *     character comes through a roster reroll with the lock following the id they
 *     inherited. The owner ordered "remove the other padlocks": the roster-row padlock
 *     and "Keep these people" are gone and the read side reads no lock
 *     (domain/locksPreservation.js normalizeLocks). So the arm now pins the opposite:
 *     a lock map naming the very character a plain reroll loses rolls EXACTLY the
 *     plain reroll, across two rerolls, and no preservation report is minted. The id
 *     algebra that still follows an authored keeper is pinned in
 *     tests/store/locksEngine.test.js.
 *
 * Against the real pipeline, never a hand-rolled roster: the substitution, the
 * relevance re-sort and the prose relink that make ids move only exist there
 * (generator-probe-corpus hazard — bare generators are not the pipeline).
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeAll } from 'vitest';
import {
  generateSettlementPipeline,
  regenNPCsPipeline,
} from '../../src/generators/generateSettlementPipeline.js';
import { remapNpcLocks } from '../../src/domain/locksPreservation.js';
import { deepClone } from '../../src/domain/clone.js';

const CFG = {
  settType: 'town',
  culture: 'germanic',
  terrain: 'grassland',
  tradeRouteAccess: 'road',
};
const SEED = 'locks-engine-town';
const REROLL_SEED = 'locks-engine-reroll';

/** @type {Record<string, any>} */
let settlement;

beforeAll(() => {
  settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
});

describe('THE PROMISE — an unlocked settlement is untouched by the locks engine', () => {
  test('locks omitted, {} and a booleans-only map all produce the same reroll', () => {
    const cfg = settlement.config || CFG;
    const omitted = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED });
    const empty = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED, locks: {} });
    // A map holding only booleans names no ids, so the roster reroll must not see
    // it either — identity/geography are full-generate concerns.
    const booleans = regenNPCsPipeline(settlement, cfg, {
      seed: REROLL_SEED, locks: { identity: true, geography: true },
    });
    expect(empty).toEqual(omitted);
    expect(booleans).toEqual(omitted);
  });

  test('the dormant path returns the exact key set it always returned', () => {
    // `_preservation` is the report the store destructures OFF the parts before
    // folding them into the settlement blob. It must be ABSENT when nothing was
    // preserved — an always-present key would silently widen the blob for every
    // caller that spreads the result without knowing about it.
    const parts = regenNPCsPipeline(settlement, settlement.config || CFG, { seed: REROLL_SEED, locks: {} });
    expect(Object.prototype.hasOwnProperty.call(parts, '_preservation')).toBe(false);
  });

  test('null/garbage in the lock map cannot perturb a seeded roll', () => {
    const cfg = settlement.config || CFG;
    const baseline = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED });
    for (const locks of [null, undefined, 'locked', 42, { npcs: 'npc_1' }, { weather: true }]) {
      expect(regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED, locks: /** @type {any} */ (locks) }))
        .toEqual(baseline);
    }
  });
});

describe('a STORED lock carries nobody through the reroll that replaces them (owner orders 2026-09-17)', () => {
  /** The mid-roster NPC the plain reroll DOES lose — deliberately not index 0,
   *  which is the roster leader and can survive for unrelated reasons. */
  function victim() {
    const plain = regenNPCsPipeline(settlement, settlement.config || CFG, { seed: REROLL_SEED });
    const survivingNames = new Set(plain.npcs.map((/** @type {any} */ n) => String(n.name)));
    return settlement.npcs
      .slice(1)
      .find((/** @type {any} */ n) => !survivingNames.has(String(n.name)));
  }

  test('the fixture is not vacuous — a plain reroll really does lose someone', () => {
    expect(settlement.npcs.length).toBeGreaterThan(2);
    expect(victim()).toBeTruthy();
  });

  test('a stored id naming that character rolls exactly the plain reroll, with no report', () => {
    const target = victim();
    const cfg = settlement.config || CFG;
    const plain = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED });
    const stored = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED, locks: { npcs: [String(target.id)] } });
    expect(stored).toEqual(plain);
    expect(Object.prototype.hasOwnProperty.call(stored, '_preservation'), 'a stored lock still minted a preservation report').toBe(false);
    expect(stored.npcs.some((/** @type {any} */ n) => String(n.name) === String(target.name)), 'the stored lock still carried its character').toBe(false);
  });

  test('a stored whole-roster lock and a full armed map roll the plain reroll too', () => {
    const cfg = settlement.config || CFG;
    const plain = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED });
    const everyId = settlement.npcs.map((/** @type {any} */ n) => String(n.id));
    for (const locks of [{ npcs: true }, { npcs: everyId, history: true, identity: true, factions: ['x'] }]) {
      expect(regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED, locks }), JSON.stringify(locks)).toEqual(plain);
    }
  });

  test('a SECOND reroll with the remapped map carries nobody either', () => {
    const target = victim();
    let locks = { npcs: [String(target.id)] };
    let town = deepClone(settlement);

    const first = regenNPCsPipeline(town, town.config || CFG, { seed: REROLL_SEED, locks });
    locks = remapNpcLocks(locks, first._preservation?.preserved);
    town = { ...town, ...first };
    delete town._preservation;

    const second = regenNPCsPipeline(town, town.config || CFG, { seed: 'locks-engine-reroll-2', locks });
    const bare = regenNPCsPipeline(town, town.config || CFG, { seed: 'locks-engine-reroll-2' });
    expect(second).toEqual(bare);
  });

  test('an id no one in the roster carries is a silent no-op, not a throw', () => {
    const cfg = settlement.config || CFG;
    const baseline = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED });
    const withGhost = regenNPCsPipeline(settlement, cfg, { seed: REROLL_SEED, locks: { npcs: ['npc_does_not_exist'] } });
    expect(withGhost).toEqual(baseline);
  });
});
