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
 * THE CLAIM THAT HAS TO SURVIVE A REDIRECT.
 *
 * Only the two in-page password doors can retract the claim in store state:
 * authOAuth, authMagicLink and authSignUp's needsVerification branch all finish
 * by navigating the browser AWAY. The return is a FRESH BOOT — the store is new,
 * the envelope is adopted again, and the boot resolution would drop the very
 * draft the visitor left to go and claim. Google and Discord ship flag-on, so
 * that is the common path, not a corner.
 *
 * So a door that is about to navigate away stashes the claim device-locally,
 * the same sessionStorage + TTL shape lib/authIntents.js uses for the same
 * reason. Read once at the boot resolution and cleared there, whether or not it
 * was needed.
 *
 * ⚠ PER-TAB, AND THAT IS THE CONTAINMENT. sessionStorage is per-tab, and so is
 * the boot gate: two tabs open on the same device each adopt the envelope and
 * each settle it at their own initAuth. A claim stashed in one tab cannot rescue
 * a draft in another, which is the safe direction — the other tab's boot
 * resolution still drops on a signed-in tier.
 */
const CLAIM_KEY = 'sf:anon_draft_claimed';
const CLAIM_TTL_MS = 30 * 60 * 1000; // 30 minutes, matching lib/authIntents.js

/**
 * Stash the claim before navigating away. Call ONLY with a standing claim: an
 * unconditional stash would protect a later boot's stranger draft for the whole
 * TTL, which is the fail-open direction.
 */
export function stashAnonDraftClaim() {
  try {
    globalThis.sessionStorage?.setItem(CLAIM_KEY, JSON.stringify({ claimedAt: Date.now() }));
  } catch { /* a locked-down browser just loses the rescue, never the boot */ }
}

/** True when this tab left with a standing claim and came back inside the TTL. */
export function readAnonDraftClaim() {
  try {
    const raw = globalThis.sessionStorage?.getItem(CLAIM_KEY);
    if (!raw) return false;
    const record = JSON.parse(raw);
    const claimedAt = Number(record?.claimedAt);
    if (!Number.isFinite(claimedAt)) return false;
    return Date.now() - claimedAt <= CLAIM_TTL_MS;
  } catch { return false; }
}

/** Drop the stash. Called at every boot resolution, used or not. */
export function clearAnonDraftClaim() {
  try { globalThis.sessionStorage?.removeItem(CLAIM_KEY); } catch { /* nothing to undo */ }
}

/**
 * Whether the adopted anonymous draft must be dropped at the boot resolution.
 *
 * @param {{ auth?: { tier?: string }, restoredAnonDraft?: any }} state
 * @param {{ claimed?: boolean }} [options] `claimed` is a seam for tests; it
 *   defaults to the device-local stash a redirecting sign-in door left behind.
 * @returns {{ drop: boolean }}
 */
export function resolveBootAnonDraft(state, { claimed = readAnonDraftClaim() } = {}) {
  // No standing claim: either nothing was adopted, or sign-in/generation already
  // retracted it. Nothing to drop.
  if (!state?.restoredAnonDraft) return { drop: false };
  // The visitor left this tab to sign in THROUGH A REDIRECT and came back. The
  // draft is what they went to claim, so it is theirs.
  if (claimed) return { drop: false };
  // The claim stands and the session is not anonymous: the world in the editor
  // came from someone else's anonymous session on this device. Drop it, whatever
  // has been done to it since.
  return { drop: state?.auth?.tier !== 'anon' };
}

/**
 * Spend the one-reload claim. Idempotent: initAuth is HMR/remount-safe and may
 * rerun, and every call after the first finds no claim and does nothing.
 *
 * The drop goes through clearSettlement() rather than nulling two fields: a
 * settlement is not only `settlement` + `lastSeed`. Leaving systemState, the
 * event log and draftVersionHistory standing left the stranger's world
 * reachable around the gate — revertToVersion would have restored it.
 *
 * @param {(fn: (draft: any) => void) => void} set the store's immer `set`
 * @param {() => any} [get] the store's `get`, for the clearSettlement action
 */
export function settleBootAnonDraft(set, get) {
  const standing = !!get?.()?.restoredAnonDraft;
  const drop = standing && resolveBootAnonDraft(get?.() ?? {}).drop;
  // Read once, then spend — the stash is consumed at the boot resolution whether
  // or not it was needed, so it can never protect a later adoption.
  clearAnonDraftClaim();
  if (drop) {
    const clearSettlement = get?.()?.clearSettlement;
    if (typeof clearSettlement === 'function') clearSettlement();
  }
  set((state) => {
    // `false`, matching every other writer of this claim (the slice default,
    // persistMerge, the sign-in paths, resetSettlementIdentity). A flag that is
    // sometimes null and sometimes false is a shape two readers can disagree on.
    state.restoredAnonDraft = false;
  });
}
