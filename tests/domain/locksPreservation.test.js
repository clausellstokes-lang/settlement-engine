/**
 * locksPreservation.test.js — the LOCKS ENGINE leaf (Phase A).
 *
 * THE LOAD-BEARING PROPERTY is dormancy. Every function in this module returns
 * its INPUT UNCHANGED — the same reference, not an equal copy — when the lock map
 * has nothing to say. That is what makes "a lock-free settlement regenerates
 * exactly as it did before locks were read at all" true by construction rather
 * than by hope, and it is the reason THE PROMISE survives this engine: locks run
 * over a FINISHED roll and can only ever ADD survivors.
 *
 * Same-reference is asserted with `toBe`, deliberately. `toEqual` would pass on a
 * fresh clone with identical contents, and a clone is exactly the regression this
 * pin exists to catch — a copy has a different identity downstream, defeats
 * memoized selectors, and quietly turns a dormant path into a writing one.
 *
 * The end-to-end byte-identity proof against the REAL pipeline lives in
 * tests/generators/locksSurviveReroll.test.js; this file pins the algebra.
 *
 * @enforced-by this test
 */
import { describe, test, expect } from 'vitest';
import {
  normalizeLocks,
  lockedNpcIdSet,
  sectionLocked,
  carryLockedSections,
  geographyLockedConfig,
  remapNpcLocks,
  locksAfterFullGenerate,
  LOCKABLE_SECTIONS,
} from '../../src/domain/locksPreservation.js';

describe('normalizeLocks — tolerant read of a map every app version has written', () => {
  test('an absent, null or non-object map reads as nothing locked', () => {
    for (const input of [undefined, null, 'locks', 42, []]) {
      const n = normalizeLocks(/** @type {any} */ (input));
      expect(n.identity).toBe(false);
      expect(n.geography).toBe(false);
      expect(n.history).toBe(false);
      expect(n.npcsSection).toBe(false);
      expect(n.npcs).toEqual([]);
      expect(n.factions).toEqual([]);
      expect(n.institutions).toEqual([]);
    }
  });

  test('booleans only count when they are literally true', () => {
    // A truthy non-true value ('yes', 1) is a legacy write, not a lock. Degrading
    // to "not locked" is the safe direction: it can only ever roll MORE, never
    // silently freeze a section the user did not freeze.
    expect(normalizeLocks({ identity: 'yes' }).identity).toBe(false);
    expect(normalizeLocks({ identity: 1 }).identity).toBe(false);
    expect(normalizeLocks({ identity: true }).identity).toBe(true);
  });

  test('npcs accepts BOTH forms without confusing them', () => {
    // `true` freezes the section; an array names individuals. The two must never
    // bleed: a section lock yields NO ids (its reroll refuses instead), and an
    // array is not a section lock.
    expect(normalizeLocks({ npcs: true }).npcsSection).toBe(true);
    expect(normalizeLocks({ npcs: true }).npcs).toEqual([]);
    expect(normalizeLocks({ npcs: ['npc_1'] }).npcsSection).toBe(false);
    expect(normalizeLocks({ npcs: ['npc_1'] }).npcs).toEqual(['npc_1']);
  });

  test('id arrays are cleaned of blanks and coerced to strings', () => {
    expect(normalizeLocks({ npcs: ['npc_1', '', null, undefined, '  ', 7] }).npcs)
      .toEqual(['npc_1', '7']);
  });

  test('unknown keys are ignored rather than throwing inside a reroll', () => {
    expect(() => normalizeLocks({ weather: true, npcs: ['a'] })).not.toThrow();
    expect(normalizeLocks({ weather: true, npcs: ['a'] }).npcs).toEqual(['a']);
  });
});

describe('lockedNpcIdSet / sectionLocked', () => {
  test('an empty map yields an empty set — the union adds nobody', () => {
    expect(lockedNpcIdSet({}).size).toBe(0);
    expect(lockedNpcIdSet(undefined).size).toBe(0);
  });

  test('a WHOLE-SECTION npcs lock contributes no ids (that reroll refuses)', () => {
    expect(lockedNpcIdSet({ npcs: true }).size).toBe(0);
    expect(sectionLocked({ npcs: true }, 'npcs')).toBe(true);
  });

  test('sectionLocked answers only for the sections that can be locked whole', () => {
    expect(LOCKABLE_SECTIONS).toEqual(['npcs', 'history']);
    expect(sectionLocked({ history: true }, 'history')).toBe(true);
    expect(sectionLocked({ npcs: ['npc_1'] }, 'npcs')).toBe(false);
    // A key that is not a lockable section never refuses a reroll.
    expect(sectionLocked({ identity: true }, 'identity')).toBe(false);
  });
});

describe('carryLockedSections — the post-hoc half of a full regenerate', () => {
  const prev = { name: 'Oldford', history: { founded: 812, note: 'kept' } };

  test('DORMANT: no locks ⇒ the same object reference back', () => {
    const fresh = { name: 'Newbury', history: { founded: 991 } };
    expect(carryLockedSections({}, prev, fresh)).toBe(fresh);
    expect(carryLockedSections(undefined, prev, fresh)).toBe(fresh);
  });

  test('DORMANT: a lock with nothing to carry is still dormant', () => {
    const fresh = { name: 'Newbury' };
    expect(carryLockedSections({ identity: true }, null, fresh)).toBe(fresh);
    expect(carryLockedSections({ history: true }, { name: 'x' }, fresh)).toBe(fresh);
  });

  test('identity carries the name and nothing else', () => {
    const fresh = { name: 'Newbury', history: { founded: 991 } };
    const out = carryLockedSections({ identity: true }, prev, fresh);
    expect(out).not.toBe(fresh);
    expect(out.name).toBe('Oldford');
    expect(out.history).toBe(fresh.history);
  });

  test('history carries the section WHOLE, and by clone', () => {
    // Whole, because historicalEvents / currentTensions / the coherence prose are
    // only consistent with each other. By clone, so a later mutation of the live
    // settlement cannot reach back into the previous one.
    const fresh = { name: 'Newbury', history: { founded: 991 } };
    const out = carryLockedSections({ history: true }, prev, fresh);
    expect(out.history).toEqual(prev.history);
    expect(out.history).not.toBe(prev.history);
    expect(out.name).toBe('Newbury');
  });
});

describe('geographyLockedConfig — the one lock that is a generation INPUT', () => {
  const prev = { config: { terrainType: 'mountain', tradeRouteAccess: 'road', culture: 'germanic' } };

  test('DORMANT: unlocked ⇒ the same config reference back', () => {
    const cfg = { terrainType: 'grassland' };
    expect(geographyLockedConfig({}, prev, cfg)).toBe(cfg);
  });

  test('DORMANT: locked but the previous settlement carries no config', () => {
    const cfg = { terrainType: 'grassland' };
    expect(geographyLockedConfig({ geography: true }, null, cfg)).toBe(cfg);
    expect(geographyLockedConfig({ geography: true }, { config: null }, cfg)).toBe(cfg);
  });

  test('DORMANT: locked but the ground already matches ⇒ nothing to overlay', () => {
    const cfg = { terrainType: 'mountain', tradeRouteAccess: 'road' };
    expect(geographyLockedConfig({ geography: true }, prev, cfg)).toBe(cfg);
  });

  test('overlays ONLY the geography-determining keys', () => {
    const cfg = { terrainType: 'grassland', culture: 'iberian', settType: 'city' };
    const out = geographyLockedConfig({ geography: true }, prev, cfg);
    expect(out.terrainType).toBe('mountain');
    expect(out.tradeRouteAccess).toBe('road');
    // Culture is not geography. A geography lock must not quietly freeze the rest
    // of the config — that would make "keep the ground" mean "keep everything".
    expect(out.culture).toBe('iberian');
    expect(out.settType).toBe('city');
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

describe('locksAfterFullGenerate — Phase A drops what it cannot keep', () => {
  test('DORMANT: a booleans-only map survives untouched, same reference', () => {
    const locks = { identity: true, geography: true, history: true };
    expect(locksAfterFullGenerate(locks)).toBe(locks);
    expect(locksAfterFullGenerate({})).toEqual({});
  });

  test('id arrays are dropped, booleans kept', () => {
    // The arrays would name a roster that no longer exists. Keeping them would
    // leave the map advertising a protection nothing performs — the exact defect
    // this engine was built to close, recreated one level down.
    const out = locksAfterFullGenerate({
      identity: true, npcs: ['npc_1'], factions: ['f_1'], institutions: ['i_1'],
    });
    expect(out).toEqual({ identity: true });
  });

  test('a WHOLE-SECTION npcs lock is a boolean and survives', () => {
    const locks = { npcs: true };
    expect(locksAfterFullGenerate(locks)).toBe(locks);
  });
});
