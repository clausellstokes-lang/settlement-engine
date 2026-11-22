/**
 * locksPreservation.test.js — the LOCKS ENGINE leaf.
 *
 * ⛔ EVERY LOCK KIND IS RETIRED (owner orders 2026-09-17). The "What a new roll keeps"
 * section went first (the world keys), then "remove the other padlocks" took the NPCs
 * and History section locks and the roster-row padlock (`npcs`, `history`). No control
 * sets, shows or clears a lock any more, so a lock a save still carries must not act:
 * `normalizeLocks`, the one read every predicate here flows through, reads NOTHING. This
 * file pins that at the chokepoint (a fully populated map reads as nothing locked, and
 * every predicate that consumes the view is dormant), and it keeps pinning the id
 * ALGEBRA (`remapNpcLocks`, `locksAfterFullGenerate`), which reads the RAW map on
 * purpose: it is data maintenance and the pin remap's algebra, not a lock acting.
 *
 * THE LOAD-BEARING PROPERTY is still dormancy. Every function in this module returns
 * its INPUT UNCHANGED — the same reference, not an equal copy — when it has nothing to
 * do. Same-reference is asserted with `toBe`, deliberately: `toEqual` would pass on a
 * fresh clone with identical contents, and a clone is exactly the regression this pin
 * exists to catch.
 *
 * The end-to-end proofs against the REAL pipeline live in
 * tests/generators/locksSurviveReroll.test.js and locksSurviveFullGenerate.test.js.
 *
 * @enforced-by this test
 */
import { describe, test, expect } from 'vitest';
import {
  normalizeLocks,
  lockedNpcIdSet,
  sectionLocked,
  carryLockedSections,
  remapNpcLocks,
  locksAfterFullGenerate,
  LOCKABLE_SECTIONS,
} from '../../src/domain/locksPreservation.js';
import * as locksModule from '../../src/domain/locksPreservation.js';

/** Every key any version of the app ever wrote, each in the form that used to act. */
const EVERY_KIND_ARMED = Object.freeze({
  identity: true,
  geography: true,
  factions: ['Town Council'],
  institutions: ['the-mint'],
  history: true,
  npcs: ['npc_1', 'npc_2'],
});

describe('normalizeLocks — THE CHOKEPOINT reads no lock (owner orders 2026-09-17)', () => {
  test('an absent, null or non-object map reads as nothing locked', () => {
    for (const input of [undefined, null, 'locks', 42, []]) {
      const n = normalizeLocks(/** @type {any} */ (input));
      expect(n.history).toBe(false);
      expect(n.npcsSection).toBe(false);
      expect(n.npcs).toEqual([]);
    }
  });

  test('EVERY lock kind a save can carry reads as nothing locked, in each form it ever took', () => {
    // The whole-roster boolean and the per-character id list were the two padlocks the
    // second order removed; `history: true` was "Keep this history". A stored one of each,
    // beside every retired world key, must leave the honoured view empty.
    const shapes = [
      EVERY_KIND_ARMED,
      { npcs: true },
      { npcs: ['npc_1'] },
      { history: true },
      { history: true, npcs: true },
    ];
    for (const locks of shapes) {
      expect(normalizeLocks(locks), JSON.stringify(locks)).toEqual({ history: false, npcsSection: false, npcs: [] });
    }
  });

  test('the honoured view has exactly its three fields, so no retired key can ride back in', () => {
    // THE SHAPE IS THE ANCHOR: an exact key set cannot pass over a normalizer that
    // quietly grew `identity`, `geography`, `factions` or `institutions` again.
    expect(Object.keys(normalizeLocks(EVERY_KIND_ARMED)).sort()).toEqual(['history', 'npcs', 'npcsSection']);
  });

  test('THE STORED MAP IS KEPT as data: a full generate hands a booleans-and-names map back untouched', () => {
    // Not reading is not deleting. Pruning a persisted key is an owner-gated migration,
    // and a veto of the orders restores the controls with a user's old locks intact.
    const locks = { identity: true, geography: true, factions: ['Town Council'], history: true, npcs: true };
    expect(locksAfterFullGenerate(locks, [])).toBe(locks);
    expect(locksAfterFullGenerate({ ...locks, npcs: ['npc_4'] }, [{ id: 'npc_2', fromId: 'npc_4' }]))
      .toEqual({ ...locks, npcs: ['npc_2'] });
  });

  test('an unknown institutions key still round-trips VERBATIM through a full generate', () => {
    const locks = { institutions: ['the-mint'], history: true };
    expect(locksAfterFullGenerate(locks, [])).toBe(locks);
    expect(locksAfterFullGenerate({ npcs: ['npc_4'], institutions: ['the-mint'] }, [{ id: 'npc_2', fromId: 'npc_4' }]))
      .toEqual({ npcs: ['npc_2'], institutions: ['the-mint'] });
  });

  test('unknown keys are ignored rather than throwing inside a reroll', () => {
    expect(() => normalizeLocks({ weather: true, npcs: ['a'] })).not.toThrow();
    expect(normalizeLocks({ weather: true, npcs: ['a'] }).npcs).toEqual([]);
  });
});

describe('lockedNpcIdSet / sectionLocked — dormant over any stored map', () => {
  test('a stored id list names nobody, and an empty map names nobody', () => {
    expect(lockedNpcIdSet({ npcs: ['npc_1', 'npc_2'] }).size).toBe(0);
    expect(lockedNpcIdSet(EVERY_KIND_ARMED).size).toBe(0);
    expect(lockedNpcIdSet({}).size).toBe(0);
    expect(lockedNpcIdSet(undefined).size).toBe(0);
  });

  test('no stored section lock refuses a reroll: "Keep these people" and "Keep this history" are gone', () => {
    // The two names stay in LOCKABLE_SECTIONS so the refusal's one seat is where a veto
    // re-arms it; what they no longer do is refuse.
    expect(LOCKABLE_SECTIONS).toEqual(['npcs', 'history']);
    expect(sectionLocked({ npcs: true }, 'npcs')).toBe(false);
    expect(sectionLocked({ history: true }, 'history')).toBe(false);
    expect(sectionLocked(EVERY_KIND_ARMED, 'history')).toBe(false);
    expect(sectionLocked({ identity: true }, 'identity')).toBe(false);
  });
});

describe('carryLockedSections — the post-hoc half of a full regenerate, dormant', () => {
  const prev = { name: 'Oldford', history: { founded: 812, note: 'kept' } };

  test('DORMANT: no locks ⇒ the same object reference back', () => {
    const fresh = { name: 'Newbury', history: { founded: 991 } };
    expect(carryLockedSections({}, prev, fresh)).toBe(fresh);
    expect(carryLockedSections(undefined, prev, fresh)).toBe(fresh);
  });

  test('a STORED history lock carries NOTHING any more (owner order 2026-09-17, "remove the other padlocks")', () => {
    const fresh = { name: 'Newbury', history: { founded: 991 } };
    // Same reference back: the fresh history and the fresh name are what the roll made.
    expect(carryLockedSections({ history: true }, prev, fresh)).toBe(fresh);
    expect(carryLockedSections({ identity: true, history: true }, prev, fresh)).toBe(fresh);
    expect(carryLockedSections(EVERY_KIND_ARMED, prev, fresh).history).toEqual({ founded: 991 });
  });
});

describe('geographyLockedConfig — RETIRED with the world locks (owner order 2026-09-17)', () => {
  test('the geography overlay is gone from the module, beside its (dormant) carry sibling', () => {
    expect(typeof locksModule.carryLockedSections).toBe('function');
    expect(Object.prototype.hasOwnProperty.call(locksModule, 'geographyLockedConfig'), 'the geography overlay is back').toBe(false);
  });
});

describe('remapNpcLocks — the lock survives its own subject reroll', () => {
  test('DORMANT: no locked ids, or no report, ⇒ same reference', () => {
    const locks = { identity: true };
    expect(remapNpcLocks(locks, [{ id: 'npc_7', fromId: 'npc_3' }])).toBe(locks);
    const withIds = { npcs: ['npc_3'] };
    expect(remapNpcLocks(withIds, [])).toBe(withIds);
    expect(remapNpcLocks(withIds, undefined)).toBe(withIds);
  });

  test('DORMANT: a keeper that kept its own id moves nothing', () => {
    const locks = { npcs: ['npc_3'] };
    expect(remapNpcLocks(locks, [{ id: 'npc_3', fromId: 'npc_3' }])).toBe(locks);
  });

  test('a locked id follows its subject to the slot it inherited', () => {
    // This is the whole point: npc_3 survived by TAKING OVER slot npc_7, so
    // "npc_3" now names a stranger. Without the remap the lock ghosts on the
    // second reroll and protects the wrong character.
    const out = remapNpcLocks({ npcs: ['npc_3'], identity: true }, [
      { id: 'npc_7', fromId: 'npc_3', name: 'Bran' },
    ]);
    expect(out.npcs).toEqual(['npc_7']);
    expect(out.identity).toBe(true);
  });

  test('the RAW algebra still reads the stored ids, cleaned of blanks, while the honoured view reads none', () => {
    // THE SPLIT THE RETIREMENT DEPENDS ON: the pin remap wraps aiData.pinnedNpcs as
    // `{ npcs }` and a stored lock id must follow an AUTHORED keeper to its new slot, so
    // this function reads the raw list. The honoured view over the SAME map is empty.
    const stored = { npcs: ['npc_3', '', null, '  ', 7] };
    expect(normalizeLocks(stored).npcs).toEqual([]);
    expect(remapNpcLocks(stored, [{ id: 'npc_9', fromId: 'npc_3' }]).npcs).toEqual(['npc_9', '7']);
  });

  test('an id the report does not mention is left alone (the undo tolerance)', () => {
    // undoLastEvent restores an older settlement blob whose roster ids need not
    // match the live lock map. An unknown id is a silent no-op here by design —
    // versioning the lock map against the event log is explicitly not attempted.
    const out = remapNpcLocks({ npcs: ['npc_3', 'npc_99'] }, [{ id: 'npc_7', fromId: 'npc_3' }]);
    expect(out.npcs).toEqual(['npc_7', 'npc_99']);
  });

  test('the map cannot grow a phantom when two locks land on one slot', () => {
    const out = remapNpcLocks({ npcs: ['npc_3', 'npc_4'] }, [
      { id: 'npc_7', fromId: 'npc_3' },
      { id: 'npc_7', fromId: 'npc_4' },
    ]);
    expect(out.npcs).toEqual(['npc_7']);
  });
});

describe('locksAfterFullGenerate — Phase B remaps what it carried, prunes the rest', () => {
  test('DORMANT: a booleans-only map survives untouched, same reference', () => {
    const locks = { identity: true, geography: true, history: true };
    expect(locksAfterFullGenerate(locks, [])).toBe(locks);
    expect(locksAfterFullGenerate({}, [])).toEqual({});
  });

  test('a WHOLE-SECTION npcs lock is a boolean, not an id list, and survives', () => {
    const locks = { npcs: true };
    expect(locksAfterFullGenerate(locks, [])).toBe(locks);
  });

  test('a locked NPC id becomes the id its subject INHERITED in the new town', () => {
    // The whole reason the carry returns a report: the keeper took over a fresh
    // slot, so the old id now belongs to a stranger the user never locked.
    const out = locksAfterFullGenerate(
      { identity: true, npcs: ['npc_4'] },
      [{ id: 'npc_2', fromId: 'npc_4' }],
    );
    expect(out).toEqual({ identity: true, npcs: ['npc_2'] });
  });

  test('an id the carry did not preserve is DROPPED, not left pointing at a stranger', () => {
    // This is the deliberate divergence from remapNpcLocks, which leaves an
    // unknown id alone because undo may restore a roster that matches it again.
    // Across a FULL roll every old id has been reissued, so a stale id is not
    // dormant — it protects somebody else. The leaf header records the tradeoff.
    const out = locksAfterFullGenerate(
      { npcs: ['npc_4', 'npc_9'], identity: true },
      [{ id: 'npc_2', fromId: 'npc_4' }],
    );
    expect(out).toEqual({ npcs: ['npc_2'], identity: true });
  });

  test('when nothing survived, the npcs KEY goes away rather than emptying', () => {
    // An empty array would read as "an npcs lock exists" to every sparse-map
    // consumer; the absence of the key is what "not locked" is spelled as.
    const out = locksAfterFullGenerate({ npcs: ['npc_4'], geography: true }, []);
    expect(Object.prototype.hasOwnProperty.call(out, 'npcs')).toBe(false);
    expect(out).toEqual({ geography: true });
    // No report at all is the same situation: the carry sat dormant, so every
    // locked id is stale by definition.
    expect(locksAfterFullGenerate({ npcs: ['npc_4'] }, undefined)).toEqual({});
  });

  test('factions and institutions are NAME-keyed and KEPT VERBATIM', () => {
    // Power factions and institutions carry no id, so these arrays were NAME-keyed
    // and a full roll keeps them verbatim. Neither is READ any more (institutions
    // since 2026-08-11, the seat lock since owner order 2026-09-17); they ride
    // through as stored data, because pruning a persisted key is a migration.
    const locks = { factions: ['faction.the-guild'], institutions: ['the-mint'], history: true };
    expect(locksAfterFullGenerate(locks, [])).toBe(locks);
    const mixed = locksAfterFullGenerate(
      { npcs: ['npc_4'], factions: ['f_1'], institutions: ['i_1'] },
      [{ id: 'npc_2', fromId: 'npc_4' }],
    );
    expect(mixed).toEqual({ npcs: ['npc_2'], factions: ['f_1'], institutions: ['i_1'] });
  });

  test('the map cannot grow a phantom when two locks land on one slot', () => {
    const out = locksAfterFullGenerate({ npcs: ['npc_3', 'npc_4'] }, [
      { id: 'npc_7', fromId: 'npc_3' },
      { id: 'npc_7', fromId: 'npc_4' },
    ]);
    expect(out.npcs).toEqual(['npc_7']);
  });

  test('a keeper that kept its own id leaves the map alone, same reference', () => {
    const locks = { npcs: ['npc_2'], identity: true };
    expect(locksAfterFullGenerate(locks, [{ id: 'npc_2', fromId: 'npc_2' }])).toBe(locks);
  });

  test('garbage degrades to "not locked" instead of throwing inside a generate', () => {
    for (const locks of [null, undefined, 'locked', 42]) {
      expect(() => locksAfterFullGenerate(/** @type {any} */ (locks), [])).not.toThrow();
      expect(locksAfterFullGenerate(/** @type {any} */ (locks), [])).toBe(locks);
    }
    // A junk entry inside a real array is filtered, and the filtering itself is a
    // change, so the caller gets a cleaned map rather than the raw one.
    expect(locksAfterFullGenerate({ npcs: ['npc_4', '', null] }, [{ id: 'npc_2', fromId: 'npc_4' }]))
      .toEqual({ npcs: ['npc_2'] });
  });
});
