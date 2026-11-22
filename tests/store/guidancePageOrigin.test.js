/** @vitest-environment jsdom */
/**
 * guidancePageOrigin.test.js — THE FULL LIFECYCLE OF A PAGE-SCOPED HINT (owner order,
 * ODQ §934.29), over the real guidance store.
 *
 * The owner's sentence has four clauses and this file walks every one of them against the
 * live registry and the live dismissal store (src/lib/guidance.js — the device-local
 * `sf:guidance:*` keys that ARE the guidance layer's persistence):
 *
 *   1. LEAVE  → the hint is gone, on every other page in the product, not just the next one.
 *   2. RETURN → it is back, because nothing was retired by the excursion.
 *   3. DISMISS → gone, and gone on return too.
 *   4. REHYDRATE → still gone after a reload and after a sign-in, because the dismissal
 *      lives in device-local storage and not in a session or a store partition.
 *
 * ── WHY THE DISMISSAL IS NOT IN THE ZUSTAND PARTIALIZE, AND MUST NOT BE ─────────────
 * Traced before this was written, along all five lifecycle paths:
 *   create    — markGuidanceDismissed writes one localStorage key, `sf:guidance:<id>`.
 *   read      — isGuidanceDismissed reads it (running the read-once legacy migration).
 *   persist   — there is nothing to persist: the key IS the storage. The onboarding SLICE
 *               holds only a transient toast string and is deliberately absent from the
 *               store's partialize (tests/store/onboardingNudge.test.js pins that).
 *   rehydrate — a reload re-reads the key; no store rehydration is involved, so the
 *               persisted-key set is untouched by this lane and no walker moves.
 *   sign-in   — auth swaps the store's user state; the key is keyed to the DEVICE, not the
 *               session, so signing in or out neither grants nor retires a dismissal.
 * Putting the dismissal into the persisted store blob would have coupled "I closed this
 * hint" to sign-out, to an eviction, and to every store migration — for a fact that is
 * device-local by design (src/lib/guidance.js header; cross-device seen-once is an owner-
 * gated persistence-shape decision, still deferred).
 *
 * @enforced-by this test
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  GUIDANCE_ORIGINS,
  selectPageWhisper,
  whispersForRoute,
} from '../../src/domain/display/guidanceRegistry.js';
import {
  isGuidanceDismissed,
  markGuidanceDismissed,
  guidanceDismissalKey,
} from '../../src/lib/guidance.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The post-generate coach: the whisper the owner's order was raised about. */
const SUBJECT = 'wizard_next_steps';
const HOME = 'generate';

/** A newborn who has just forged a world, with the real dismissal store consulted. */
const reader = () => ({
  isDismissed: isGuidanceDismissed,
  firstAvailable: () => true,
  isNewborn: true,
  data: { tier: 'anon', savedCount: 0, hasSettlement: true },
});

/** What the page would show right now, as an id (or null). */
const shownOn = (route) => selectPageWhisper(route, reader())?.id ?? null;

describe('a hint belongs to its page of origin (ODQ §934.29)', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* private mode — the helpers swallow it */ }
  });

  it('1. LEAVE — the coach shows on /create and follows the reader to NO other page', () => {
    expect(shownOn(HOME)).toBe(SUBJECT);
    const elsewhere = GUIDANCE_ORIGINS.filter((r) => r !== HOME);
    expect(elsewhere.length, 'the product has other pages to leave to').toBeGreaterThan(3);
    for (const route of elsewhere) {
      expectAbsentWithAnchor(
        whispersForRoute(route).map((w) => w.id),
        SUBJECT,
        whispersForRoute(route)[0]?.id,
        `the coach must not be on the ${route} page at all`,
      );
      expect(shownOn(route), `the coach rendered on ${route}`).not.toBe(SUBJECT);
    }
  });

  it('2. RETURN — coming back to /create brings it back; the excursion retired nothing', () => {
    expect(shownOn(HOME)).toBe(SUBJECT);
    expect(shownOn('gallery')).not.toBe(SUBJECT);
    expect(shownOn('settlements')).not.toBe(SUBJECT);
    expect(shownOn(HOME), 'the coach did not come back to the page it belongs to').toBe(SUBJECT);
    expect(isGuidanceDismissed(SUBJECT), 'navigating away must not count as a dismissal').toBe(false);
  });

  it('3. DISMISS — the explicit close retires it, on its own page and on return', () => {
    expect(shownOn(HOME)).toBe(SUBJECT);
    markGuidanceDismissed(SUBJECT);
    expect(shownOn(HOME)).not.toBe(SUBJECT);
    // …and after a round trip away and back, which is precisely when "it came back" would
    // be the bug rather than the feature.
    expect(shownOn('gallery')).not.toBe(SUBJECT);
    expect(shownOn(HOME)).not.toBe(SUBJECT);
  });

  it('4. REHYDRATE — the dismissal survives a reload and a sign-in', () => {
    markGuidanceDismissed(SUBJECT);
    const key = guidanceDismissalKey(SUBJECT);
    expect(localStorage.getItem(key)).toBe('1');

    // A RELOAD: every module-level cache is gone, the key is not. Re-reading storage is
    // the whole of rehydration for this subsystem, so reading it again IS the reload.
    expect(isGuidanceDismissed(SUBJECT)).toBe(true);
    expect(shownOn(HOME)).not.toBe(SUBJECT);

    // A SIGN-IN: the reader stops being anonymous and gains a library. The dismissal is
    // keyed to the device, so neither the tier change nor the saves touch it.
    const signedIn = {
      ...reader(),
      isNewborn: false,
      data: { tier: 'premium', savedCount: 4, hasSettlement: true },
    };
    expect(isGuidanceDismissed(SUBJECT)).toBe(true);
    expect(selectPageWhisper(HOME, signedIn)?.id).not.toBe(SUBJECT);

    // ⛔ THE ANCHOR: a DIFFERENT whisper's key is untouched, so "still dismissed" above is
    // a fact about this dismissal and not about a storage layer that lost everything.
    expect(localStorage.getItem(guidanceDismissalKey('dossier_first_callouts'))).toBeNull();
  });

  it('the dismissal never reaches the persisted store blob (the key set is untouched)', () => {
    markGuidanceDismissed(SUBJECT);
    // ⛔ THE FIRST DRAFT OF THIS ASSERTION WAS A CONDITIONAL BARE NEGATIVE guarded by
    // `if (blob)`, which is the vacuity class exactly: it passed when the blob was
    // absent, when it was empty, and when the store had never been built — none of which
    // are the fact being claimed. (The anchor walker then caught the matcher's NAME
    // quoted in this very comment, which is the same guard working one level up: it
    // reads source, so a docblock may not spell what the code may not do.) The live
    // collection is the DEVICE'S KEY SET, which the write above demonstrably populates.
    expectAbsentWithAnchor(
      Object.keys(localStorage),
      'settlementforge',
      guidanceDismissalKey(SUBJECT),
      'dismissing a hint must write its own device-local key and NOTHING into the persisted store blob',
    );
  });
});

describe('the page budget across the lifecycle — one at a time, in order', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* no-op */ }
  });

  it('a signed-in newborn is taught the dossier band FIRST, then the coach', () => {
    // Both are eligible on /create for a signed-in newborn; the band outranks the coach
    // (60 to 50), so it teaches alone and the coach waits rather than stacking beside it.
    const ctx = {
      isDismissed: isGuidanceDismissed,
      firstAvailable: () => true,
      isNewborn: true,
      data: { tier: 'free', savedCount: 0, hasSettlement: true },
    };
    expect(selectPageWhisper(HOME, ctx)?.id).toBe('dossier_first_callouts');
    markGuidanceDismissed('dossier_first_callouts');
    expect(selectPageWhisper(HOME, ctx)?.id).toBe(SUBJECT);
    markGuidanceDismissed(SUBJECT);
    // The three preserved coach steps are next in priority — the page never goes quiet
    // while teaching remains, and never shows two things at once.
    const third = selectPageWhisper(HOME, ctx);
    expect(third?.id).toBe('postgen_read_dossier');
  });
});
