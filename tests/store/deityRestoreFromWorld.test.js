/**
 * tests/store/deityRestoreFromWorld.test.js — Wave R-5b item 13b: the
 * RESTORE-FROM-WORLD lane on the existing SET_PRIMARY_DEITY event.
 *
 * THE DEFECT IT CLOSES: the living world can convert a settlement away from its
 * patron, and the DM had no lever to hand the seat back. Every picker lists
 * ACCOUNT-AUTHORED deities only, and setPrimaryDeityImpl refuses a ref the
 * account registry cannot resolve — so a pool-seeded (`deity:core:`) patron, or a
 * shared campaign's foreign custom deity, was gone for good once ousted. Its
 * record survives, though: the campaign's own
 * `worldState.religionStates[saveId].deities` still carries the faith and its
 * snapshot. This lane reads THAT record.
 *
 * WHAT IS PINNED
 *   1. the untouched path — an ordinary registry assign dispatches exactly what it
 *      always dispatched (the lane is additive; no restore, no change);
 *   2. the restore dispatches the surviving STATE KEY VERBATIM — never a re-mint,
 *      because the pantheon ledger and the religion state both key by it and a
 *      re-mint forks one god into two;
 *   3. a ref that names no recorded faith refuses, exactly as an unknown registry
 *      ref does — the flag is an explicit SOURCE, not a way around resolution;
 *   4. a typo'd custom ref WITHOUT the flag still refuses (no silent second-guess);
 *   5. the premium gate is unmoved: a restore ASSIGNS, so an unentitled account is
 *      refused with the typed refusal before any dispatch;
 *   6. a standalone (non-campaign) settlement has no record and offers nothing.
 *
 * The reader itself (worldFaithsForSave) is pinned here too — it is the SAME
 * function the assignment panel offers options from, so the panel can never show
 * a choice this seam would refuse.
 */

import { describe, test, expect, vi } from 'vitest';

import { setPrimaryDeityImpl, DEITY_WRITE_REFUSAL } from '../../src/store/settlementDeityHelpers.js';
import { worldFaithsForSave } from '../../src/domain/deitySnapshot.js';
import { mintDeityRef } from '../../src/lib/customRegistry.js';

/** An authored homebrew deity, as the customContent `deities` bucket stores it. */
const DEITY = {
  localUid: 'lu_aur',
  id: 'd_lu_aur',
  name: 'Aurelion',
  alignmentAxis: 'good',
  temperamentAxis: 'peacelike',
  rankAxis: 'major',
  lawAxis: 'lawful',
};
const DEITY_REF = 'custom:lu_aur';
const MINTED = mintDeityRef(DEITY);

/** The converted-away patron: pool-seeded, so no account registry can resolve it. */
const OUSTED_REF = 'deity:core:the-quiet-flame';
const OUSTED_SNAPSHOT = {
  _deityRef: OUSTED_REF,
  name: 'The Quiet Flame',
  alignmentAxis: 'neutral',
  temperamentAxis: 'peacelike',
  rankAxis: 'minor',
  lawAxis: 'lawful',
  domain: 'hearth',
};
/** The rival the world installed in its place — the seated patron now. */
const RIVAL_REF = 'deity:core:storm-eater';
const RIVAL_SNAPSHOT = { ...OUSTED_SNAPSHOT, _deityRef: RIVAL_REF, name: 'Storm-Eater', domain: 'storm' };

const SAVE_ID = 'save-7';

/** A campaign whose world record still carries both faiths for this save. */
function campaignWithFaiths(deities) {
  return [{ id: 'camp-1', worldState: { religionStates: { [SAVE_ID]: { patronRef: RIVAL_REF, deities } } } }];
}

const RECORDED_FAITHS = {
  [RIVAL_REF]: { deityRef: RIVAL_REF, snapshot: RIVAL_SNAPSHOT, share: 72 },
  [OUSTED_REF]: { deityRef: OUSTED_REF, snapshot: OUSTED_SNAPSHOT, share: 28 },
};

/**
 * A store state for the impl: an entitled account, the authored deity in the
 * library, the campaign world record, and a spy applyEvent.
 */
function makeState({ entitled = true, campaigns = campaignWithFaiths(RECORDED_FAITHS), activeSaveId = SAVE_ID } = {}) {
  const applyEvent = vi.fn((event) => event);
  const state = {
    customContent: { deities: [DEITY] },
    settlement: { tier: 'town', config: { primaryDeityRef: RIVAL_REF, primaryDeitySnapshot: RIVAL_SNAPSHOT } },
    campaigns,
    activeSaveId,
    applyEvent,
    canUseCustomContent: () => entitled,
  };
  return { state, get: () => state, applyEvent };
}

describe('worldFaithsForSave — the recorded-faiths reader', () => {
  test('returns each faith keyed by its STATE KEY, strongest standing first', () => {
    const faiths = worldFaithsForSave(campaignWithFaiths(RECORDED_FAITHS), SAVE_ID);
    expect(faiths.map((f) => f.deityRef)).toEqual([RIVAL_REF, OUSTED_REF]);
    expect(faiths[1].snapshot.name).toBe('The Quiet Flame');
  });

  test('the order is total, so the same world always reads the same list', () => {
    // Equal standing ⇒ codepoint on the key breaks the tie (never insertion order).
    const tied = {
      [RIVAL_REF]: { snapshot: RIVAL_SNAPSHOT, share: 50 },
      [OUSTED_REF]: { snapshot: OUSTED_SNAPSHOT, share: 50 },
    };
    // `deity:core:storm-eater` sorts before `deity:core:the-quiet-flame`.
    expect(worldFaithsForSave(campaignWithFaiths(tied), SAVE_ID).map((f) => f.deityRef))
      .toEqual([RIVAL_REF, OUSTED_REF]);
  });

  test('a standalone settlement, an unknown save, or a nameless entry yields nothing', () => {
    expect(worldFaithsForSave(undefined, SAVE_ID)).toEqual([]);
    expect(worldFaithsForSave([], SAVE_ID)).toEqual([]);
    expect(worldFaithsForSave(campaignWithFaiths(RECORDED_FAITHS), 'some-other-save')).toEqual([]);
    expect(worldFaithsForSave(campaignWithFaiths(RECORDED_FAITHS), null)).toEqual([]);
    expect(worldFaithsForSave(campaignWithFaiths({ 'ref:blank': { snapshot: {} } }), SAVE_ID)).toEqual([]);
  });
});

describe('setPrimaryDeityImpl — restore from the world record', () => {
  test('the registry path is UNCHANGED: an ordinary assign dispatches the minted ref', () => {
    const { get, applyEvent } = makeState();
    setPrimaryDeityImpl(get, DEITY_REF);
    expect(applyEvent).toHaveBeenCalledTimes(1);
    expect(applyEvent.mock.calls[0][0]).toEqual({
      type: 'SET_PRIMARY_DEITY',
      targetId: MINTED,
      payload: { deityRef: MINTED, snapshot: expect.objectContaining({ name: 'Aurelion', lawAxis: 'lawful' }) },
    });
  });

  test('a restore dispatches the surviving STATE KEY verbatim, with the recorded snapshot', () => {
    const { get, applyEvent } = makeState();
    setPrimaryDeityImpl(get, OUSTED_REF, { fromWorld: true });
    expect(applyEvent).toHaveBeenCalledTimes(1);
    const event = applyEvent.mock.calls[0][0];
    // THE ONE HARD RULE: the ref is the record's key, never re-minted.
    expect(event.targetId).toBe(OUSTED_REF);
    expect(event.payload.deityRef).toBe(OUSTED_REF);
    expect(mintDeityRef(OUSTED_SNAPSHOT)).not.toBe(OUSTED_REF); // a re-mint WOULD have forked it
    expect(event.payload.snapshot).toMatchObject({
      name: 'The Quiet Flame',
      alignmentAxis: 'neutral',
      temperamentAxis: 'peacelike',
      rankAxis: 'minor',
      lawAxis: 'lawful',
      domain: 'hearth',
    });
  });

  test('a snapshot that already lost its law axis restores law-neutral — forward-only, never invented', () => {
    const { lawAxis, ...axeless } = OUSTED_SNAPSHOT;
    expect(lawAxis).toBe('lawful');
    const faiths = { [OUSTED_REF]: { snapshot: axeless, share: 10 } };
    const { get, applyEvent } = makeState({ campaigns: campaignWithFaiths(faiths) });
    setPrimaryDeityImpl(get, OUSTED_REF, { fromWorld: true });
    // The handler defaults the absent axis to neutral; the store seam does not
    // guess one back. That axis is gone from the record — restoring an invented
    // one would seat a different god.
    expect(applyEvent.mock.calls[0][0].payload.snapshot.lawAxis).toBeUndefined();
  });

  test('a ref naming no recorded faith refuses — nothing is dispatched', () => {
    const { get, applyEvent } = makeState();
    expect(setPrimaryDeityImpl(get, 'deity:core:never-worshipped', { fromWorld: true })).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('WITHOUT the flag, an unresolvable ref still refuses — the world is never a silent fallback', () => {
    const { get, applyEvent } = makeState();
    expect(setPrimaryDeityImpl(get, OUSTED_REF)).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('a standalone settlement has no record, so every restore refuses', () => {
    const { get, applyEvent } = makeState({ campaigns: null, activeSaveId: null });
    expect(setPrimaryDeityImpl(get, OUSTED_REF, { fromWorld: true })).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('the premium gate is unmoved: a restore ASSIGNS, so an unentitled account is refused', () => {
    const { get, applyEvent } = makeState({ entitled: false });
    expect(setPrimaryDeityImpl(get, OUSTED_REF, { fromWorld: true })).toBe(DEITY_WRITE_REFUSAL);
    expect(applyEvent).not.toHaveBeenCalled();
  });
});
