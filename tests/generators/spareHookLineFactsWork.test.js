/**
 * spareHookLineFactsWork.test.js — GEN-SPEED cure 3 (C′, the chair's ruling (a), 2026-11-10): one
 * reading of each fact per `representatives.js :: spareHookLine` walk.
 *
 * The dry-pool walk resolves every row it passes through `resolveDeclared`, and its `facts` thunk
 * built a NEW `factsOf` for every row, so each row re-read `guardPresence` (→ `defenceOf` → the
 * defence partition over the whole roster). In the wizard's heaviest request 350 of a walk's 406
 * `guardPresence` reads repeated, a fifth of the CPU. The walk now reads one facts object through a
 * memo that lives for that one call.
 *
 * PIN 1 counts WORK, never time: an institution whose `name` read is counted is read a bounded
 * number of times over a whole walk (measured 4; bound 8), not once per declared row (24 at the base).
 * PIN 2 is the chair's exactness condition, PINNED rather than argued: the walk over a DEEP-FROZEN
 * record (the roster array and every row, the place, its world law) gives the same lines as over
 * the unfrozen one, under both callers' `accept` shapes. If the walk, or anything it calls, ever
 * writes what the facts read, the frozen run THROWS (ES modules are strict) instead of the memo
 * going quietly stale.
 */
import { describe, expect, it } from 'vitest';
import { dryPoolWalk, spareHookLine, titlePoolName } from '../../src/generators/people/representatives.js';
import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';

const NAMES = ['Garrison Barracks', 'Town Watch', 'Massive Walls', 'Market Square', 'Temple of the Dawn', 'Docks', 'Mercenary Company', 'Bakery'];
const POOLS = [titlePoolName('captain of the watch'), ...dryPoolWalk('military')];

/** An institution row whose `name` read is counted. @param {string} name @param {{ n: number }} counter */
function counted(name, counter) {
  const row = { category: 'Test', tier: 'town' };
  Object.defineProperty(row, 'name', { enumerable: true, get() { counter.n += 1; return name; } });
  return row;
}

/** @template T @param {T} v @returns {T} */
function deepFreeze(v) {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) {
    Object.freeze(v);
    for (const k of Reflect.ownKeys(v)) {
      const d = Object.getOwnPropertyDescriptor(v, k);
      if (d && 'value' in d) deepFreeze(d.value);
    }
  }
  return v;
}

const placeOf = (portKind = 'river') => ({ worldLaw: { portKind }, institutions: NAMES.map((name) => ({ name, category: 'Test', tier: 'town' })), tier: 'town' });

describe('spareHookLine — one facts reading per walk', () => {
  it('reads the roster a bounded number of times over a whole walk, not once per row', () => {
    const rows = POOLS.reduce((n, p) => n + ((/** @type {Record<string, unknown[]>} */ (NPC_FACTION_LOYALTY))[p]?.length ?? 0), 0);
    expect(rows, 'the walk passes enough rows for the bound to mean something').toBeGreaterThan(40);
    const counter = { n: 0 };
    const place = { worldLaw: { portKind: /** @type {const} */ ('river') }, institutions: NAMES.map((n) => counted(n, counter)), tier: 'town' };
    // accept refuses every line, so the walk passes every row of every pool and answers null
    expect(spareHookLine(POOLS, new Set(), 'pin-key', place, () => false)).toBeNull();
    const perInstitution = counter.n / NAMES.length;
    // measured: 24 at the base (one reading per declared row), 4 after (one per distinct fact)
    expect(perInstitution).toBeLessThanOrEqual(8);
  });

  it('a deep-frozen record and place give the same lines as the unfrozen ones, under both accept shapes', () => {
    const accepts = [
      ['the default (drawCardHooks)', undefined],
      ['a pure text check (truePersonHooks isTrue)', (/** @type {string} */ t) => t.trim() !== '' && !/sea|ship/i.test(t)],
    ];
    for (const portKind of ['none', 'river', 'maritime']) {
      for (const [label, accept] of accepts) {
        for (const key of ['a', 'b', 'c', 'd', 'e']) {
          const held = new Set();
          const live = spareHookLine(POOLS, held, key, placeOf(portKind), /** @type {any} */ (accept));
          const frozenPlace = deepFreeze(placeOf(portKind));
          const frozenPools = deepFreeze([...POOLS]);
          const frozen = spareHookLine(frozenPools, deepFreeze(new Set()), key, frozenPlace, /** @type {any} */ (accept));
          expect(frozen, `${portKind} · ${label} · ${key}`).toBe(live);
        }
      }
    }
  });
});
