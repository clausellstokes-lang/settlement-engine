/**
 * wizardSaveBinding.test.js — THE SAVE THAT DOES NOT BIND LEAVES THE WIZARD WARNING.
 *
 * ── WHAT BROWSER PASS 3 SAW, AND WHAT THIS FILE PROVES (2026-09-19) ──────────────────
 * Saving a freshly forged settlement produced no success chrome, and leaving the page then
 * warned "This settlement hasn't been saved yet". The trace runs through two facts that live
 * in this store, and they are pinned here so the diagnosis cannot rot:
 *
 *   1. `bindActiveSaveId` REFUSES A NULLISH ID and returns without touching the store. Every
 *      save chokepoint calls it with whatever `savesService.save()` RESOLVED — so a save that
 *      throws, or resolves nothing, leaves `activeSaveId` null.
 *   2. GenerateWizard's exit gate (`settlement && !activeSaveId && authTier !== 'anon'`) is
 *      therefore armed by an unbound id, and the dialog is CORRECT about the store: no id was
 *      ever bound. The dialog is the messenger.
 *
 * ⛔ AND THE TIER THE GATE READS IS NOT THE ONE A PREVIEW SESSION LOOKS LIKE. `resolveTier`
 * lifts a STAFF ROLE to 'premium' — so the dev-only preview persona (role 'admin', session
 * genuinely anonymous) presents as a premium saver to every client gate, while
 * `supabaseSave`'s `assertExpectedSupabaseOwner` throws 'Not authenticated' against the real
 * session. That pairing — a save affordance that is open and a save path that is closed — is
 * the whole of the defect, and it is DEV-ONLY by construction.
 *
 * ⚠ THIS FILE DOES NOT TEST THE PERSONA. `import.meta.env.DEV` is true under vitest and the
 * persona is deliberately inert under MODE 'test' (tests/store/previewPersona.test.js owns
 * that arm). What is pinned here is the store contract both paths run through.
 */
import { describe, expect, test } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { bindActiveSaveId } from '../../src/store/settlementSliceHelpers.js';
import { staffUnlocksPaidFeatures } from '../../src/lib/staffEntitlements.js';

/** A store with just the fields `bindActiveSaveId` reads and writes. */
function makeStore(initial = {}) {
  return create(immer(() => ({
    activeSaveId: null,
    draftVersionHistory: [],
    savedSettlements: [],
    ...initial,
  })));
}

describe('the wizard save binding', () => {
  test('a save that resolves an id binds it, so the exit gate closes', () => {
    const store = makeStore();
    bindActiveSaveId(store.getState, store.setState, 'save-1');
    expect(store.getState().activeSaveId).toBe('save-1');
  });

  test('a save that resolves NOTHING binds nothing, and the exit gate stays armed', () => {
    const store = makeStore();
    // This is the shape a refused save leaves behind: the caller passes what it got.
    bindActiveSaveId(store.getState, store.setState, undefined);
    expect(store.getState().activeSaveId).toBe(null);
    bindActiveSaveId(store.getState, store.setState, null);
    // anchored: the arm above proves the same store DOES bind a real id, so a null
    // activeSaveId here is the refusal and not an inert store.
    expect(store.getState().activeSaveId).toBe(null);

    // The wizard's own condition, transcribed. `settlement` is the caller's truthy dossier
    // and is passed IN rather than written as a literal: a constant on the left of a `&&`
    // is a lint error, and a transcription that cannot be fed a falsy settlement would not
    // be the condition anyway.
    const wouldWarn = (settlement, activeSaveId, authTier) =>
      Boolean(settlement && !activeSaveId && authTier !== 'anon');
    const dossier = { name: 'Ashcombe' };
    expect(wouldWarn(dossier, store.getState().activeSaveId, 'premium')).toBe(true);
    expect(wouldWarn(dossier, 'save-1', 'premium')).toBe(false);
    // An anonymous visitor has no save path to lose the draft to, so no warning either.
    expect(wouldWarn(dossier, null, 'anon')).toBe(false);
    expect(wouldWarn(null, null, 'premium')).toBe(false);
  });

  test('a staff role presents as a premium saver, which is what arms that gate', () => {
    // `resolveTier(tier, role)` is module-private to authSlice; its ONE input that matters
    // here is this predicate, which is exported and testable. A staff role unlocks the paid
    // features, and the tier the gate reads follows it to 'premium'.
    expect(staffUnlocksPaidFeatures('admin')).toBe(true);
    expect(staffUnlocksPaidFeatures('user')).toBe(false);
  });
});
