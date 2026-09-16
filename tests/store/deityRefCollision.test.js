/**
 * Deity ref-collision regression — Wave 4f.
 *
 * The confirmed-live bug (PHASE4_FAITH_DELTA §1.6): deity refs fell back to a bare
 * `deity:<name>` key (pantheon.js deityIdOf), so two ACCOUNTS' same-named homebrew
 * deities identity-merged in a shared campaign. The fix mints a stable,
 * account-scoped identity ref `deity:<scope>:<slug>` at the registry seam
 * (customRegistry.mintDeityRef) and embeds THAT at assign time
 * (settlementDeityHelpers) — the engine keeps treating refs as opaque.
 *
 * These pins prove:
 *   1. mintDeityRef is deterministic, account-scoped, and name-independent.
 *   2. Two accounts authoring an identically-named god embed DISTINCT identities
 *      end-to-end through the store seam — the crux the owner specified.
 *   3. The SAME authored deity keeps ONE identity within an account (shared niche).
 */

import { describe, test, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
// Harness derivation on the real path (the retired `refreshSystemState` store
// action was a harness-only door — owner queue #21).
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { mintDeityRef, customRefIdFromItem } from '../../src/lib/customRegistry.js';
import { deityIdOf } from '../../src/domain/worldPulse/pantheon.js';

/** An authored homebrew deity, as the customContent `deities` bucket stores it. */
const warFather = (localUid) => ({
  localUid,
  id: `d_${localUid}`,
  name: 'War Father',
  alignmentAxis: 'evil',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  lawAxis: 'lawful',
});

// Minimal companion slice — just enough for settlementSlice's reads not to crash,
// plus a customContent bag carrying the authored deities under test.
const stubSlice = (customContent) => () => ({
  auth: { user: null, tier: 'premium', loading: false },
  config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent,
  importedNeighbour: null,
  campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50,
  setPurchaseModalOpen: () => {}, canUseCustomContent: () => true,
});

function makeStore(customContent) {
  return create(immer((...a) => ({ ...stubSlice(customContent)(...a), ...createSettlementSlice(...a) })));
}

function fixture() {
  return {
    tier: 'town', name: 'Testford', population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.temple', name: 'Temple', category: 'religious', status: 'active' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

/** Assign the store's only authored deity as the settlement's patron; return its
 *  embedded identity ref. (setPrimaryDeity is async since the de-eager lane.) */
async function assignPatron(store, localUid) {
  store.setState(s => {
    s.settlement = fixture();
    s.lastSeed = 'seed';
    s.systemState = deriveSystemState(s.settlement);
  });
  const res = await store.getState().setPrimaryDeity(customRefIdFromItem(warFather(localUid)));
  expect(res).not.toBeNull();
  return store.getState().settlement.config.primaryDeitySnapshot;
}

describe('mintDeityRef — account-scoped deity identity', () => {
  test('mints deity:<scope>:<slug> from localUid + name, deterministically', () => {
    expect(mintDeityRef(warFather('lu_a'))).toBe('deity:lu_a:war_father');
    // deterministic — same inputs, same ref (survives re-derivation on share/import)
    expect(mintDeityRef(warFather('lu_a'))).toBe(mintDeityRef(warFather('lu_a')));
  });

  test('two accounts, same god name, distinct scopes ⇒ distinct refs', () => {
    expect(mintDeityRef(warFather('lu_a'))).not.toBe(mintDeityRef(warFather('lu_b')));
  });

  test('scope falls back to id; a nameless raw mints null', () => {
    expect(mintDeityRef({ name: 'Vael', id: 'x1' })).toBe('deity:x1:vael');
    expect(mintDeityRef({ name: '   ' })).toBeNull();
    expect(mintDeityRef(null)).toBeNull();
  });
});

describe('deity ref-collision — two accounts, same god name, distinct identities', () => {
  test('same-named homebrew patrons embed DISTINCT scoped refs (no identity-merge)', async () => {
    // Account A authors + assigns "War Father"…
    const snapA = await assignPatron(makeStore({ deities: [warFather('lu_a')] }), 'lu_a');
    // …and account B authors + assigns its OWN, unrelated "War Father".
    const snapB = await assignPatron(makeStore({ deities: [warFather('lu_b')] }), 'lu_b');

    // Embedded identities are scoped, distinct, and NOT the resolution ref.
    expect(snapA._deityRef).toBe('deity:lu_a:war_father');
    expect(snapB._deityRef).toBe('deity:lu_b:war_father');
    expect(snapA._deityRef).not.toBe(snapB._deityRef);

    // The pantheon key each feeds (deityIdOf) is distinct — a shared campaign keeps
    // them TWO gods — and neither collapses to the name-colliding bare fallback.
    expect(deityIdOf(snapA)).not.toBe(deityIdOf(snapB));
    expect(deityIdOf(snapA)).not.toBe('deity:War Father');
    expect(deityIdOf(snapB)).not.toBe('deity:War Father');
  });

  test('the SAME authored deity keeps ONE identity within an account (shared niche)', () => {
    // Same localUid ⇒ same minted ref ⇒ same pantheon niche across settlements —
    // the intended "one homebrew god spreads across the account's world" behavior.
    expect(mintDeityRef(warFather('lu_a'))).toBe(mintDeityRef(warFather('lu_a')));
  });
});
