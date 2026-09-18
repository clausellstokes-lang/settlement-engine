/**
 * anonDraftGate.js — the READ half of the anonymous-draft persistence gate.
 *
 * The WRITE half lives in persistProjection.js: an anonymous session's draft is
 * persisted as one `anonDraft` envelope whose presence is the claim "an
 * anonymous session wrote this". persistMerge.js adopts that envelope on
 * rehydrate, because it has to — rehydrate is synchronous and Supabase resolves
 * the session a moment later, so the draft must be on screen before anyone knows
 * who is booting. This module is where that adoption is confirmed or undone.
 *
 * ⛔ WHY THIS IS NOT A SUBSCRIPTION ON `auth.loading`. The first cut spent the
 * marker on the first true→false edge of `auth.loading`, which read as "the boot
 * session check finished". It is not: authSignIn and authSignUp drive the SAME
 * edge. On a slow `getSession()` — a network token refresh — an anonymous
 * visitor who submits the sign-in form before the boot check returns drives that
 * edge first, and the guard fired with tier 'free' and dropped the very draft
 * they had just signed in to keep. The guard now runs ONLY where the boot
 * question is actually answered: inside initAuth's own resolution, on every
 * branch (session found, no session, error). A sign-in that resolves first
 * cannot spend the marker, so the draft survives exactly as promised.
 *
 * A note on the shape: the marker holds the adopted settlement BY REFERENCE, so
 * "the draft this reload adopted" and "a world generated since" are told apart
 * by identity rather than by a deep compare that a regeneration could fool.
 */

/**
 * Whether the adopted anonymous draft must be dropped at the boot resolution.
 *
 * @param {{ auth?: { tier?: string }, settlement?: any, restoredAnonDraft?: any }} state
 * @returns {{ drop: boolean }}
 */
export function resolveBootAnonDraft(state) {
  const adopted = state?.restoredAnonDraft;
  if (!adopted) return { drop: false };
  // Reference identity, not deep equality: only the very object this reload
  // adopted may be dropped. A world generated since the reload is a new object,
  // so it can never be mistaken for the adopted draft.
  if (state.settlement !== adopted) return { drop: false };
  return { drop: state?.auth?.tier !== 'anon' };
}

/**
 * Spend the one-reload marker. Idempotent: initAuth is HMR/remount-safe and may
 * rerun, and every call after the first finds no marker and does nothing.
 *
 * @param {(fn: (draft: any) => void) => void} set the store's immer `set`
 */
export function settleBootAnonDraft(set) {
  set((state) => {
    if (!state.restoredAnonDraft) return;
    if (resolveBootAnonDraft(state).drop) {
      state.settlement = null;
      state.lastSeed = null;
    }
    state.restoredAnonDraft = null;
  });
}
