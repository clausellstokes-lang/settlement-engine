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
 * ⛔ THE MARKER IS A CLAIM, NOT A REFERENCE — AND THAT DISTINCTION WAS A BUG.
 * It used to hold the adopted settlement object, and the drop fired only when
 * `state.settlement` was still that exact object. Under immer EVERY mutation
 * replaces the object: one in-place edit before the session resolved — a rename,
 * an applied event, any store write that touches the world — made the identity
 * test miss, and the gate FAILED OPEN, leaving a stranger's draft on screen for a
 * signed-in account to save. A gate whose failure mode is "keep the stranger's
 * world" is worse than no gate.
 *
 * So the marker is now a plain CLAIM about what is in the editor — "this reload
 * adopted an anonymous draft and nobody has claimed it since" — and the boot
 * resolution drops UNCONDITIONALLY on a signed-in tier. Editing cannot rescue it.
 * Exactly two things retract the claim, and both are events that make the world
 * genuinely the visitor's:
 *
 *   · authSignIn / authSignUp succeed  — they signed in to KEEP this draft, so it
 *     is theirs now (authSlice.js). Without this the deferred race still bit: on
 *     a slow getSession() the visitor signs in, initAuth resolves afterwards, and
 *     the guard would drop the very draft they had just claimed.
 *   · the generate action commits a new world — it replaces the adopted draft
 *     outright (settlementGenerateAction.js).
 */

/**
 * Whether the adopted anonymous draft must be dropped at the boot resolution.
 *
 * @param {{ auth?: { tier?: string }, restoredAnonDraft?: any }} state
 * @returns {{ drop: boolean }}
 */
export function resolveBootAnonDraft(state) {
  // No standing claim: either nothing was adopted, or sign-in/generation already
  // retracted it. Nothing to drop.
  if (!state?.restoredAnonDraft) return { drop: false };
  // The claim stands and the session is not anonymous: the world in the editor
  // came from someone else's anonymous session on this device. Drop it, whatever
  // has been done to it since.
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
