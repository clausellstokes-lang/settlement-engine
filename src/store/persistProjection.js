/**
 * The complete device-local Zustand persistence projection.
 *
 * Keeping this as a named pure seam makes the persisted shape executable in
 * tests. Capabilities, reporter leases, auth, and every other owner/session
 * field are excluded by construction rather than by serialization luck. Missing
 * fields are restored by persistMerge.
 *
 * ⭐ THE ONE GENERATED WORLD THAT IS PERSISTED, AND WHY (2026-09-18). This
 * projection used to exclude generated worlds outright. But /create promises an
 * anonymous visitor "Your first dossier is yours to keep" (copy/en.js
 * hero.ctaSubline) and a refresh took it: an anonymous account has maxSaves 0
 * (store/authSlice TIER_GATE), so there is no library for the draft to live in
 * and nothing else held it. The promise was false for exactly the cohort it was
 * written for.
 *
 * MEASURED before it was written, not assumed: a TOWN at 4,000 population
 * serializes to 141,607–192,830 B across five seeds (the fattest world the
 * engine makes, a 59,248-population metropolis, is 217,286 B) — roughly an
 * eighth of the 1.5 MB ceiling this was gated on, and a small fraction of the
 * ~5 MB localStorage origin budget.
 *
 * SCOPED TO ANON ON PURPOSE. A signed-in keeper's draft belongs in their
 * library, and their save path already covers the interrupted-save case
 * (lib/pendingSaveDraft.js). Scoping it also bounds the cost: zustand's persist
 * calls setItem on EVERY store write with no diffing, and serializing a world of
 * this size measures 0.637 ms per write against a 0.001 ms baseline. On the
 * anonymous path — hero, generate, read the dossier — store writes are discrete
 * user actions, and it is the only cohort that gets nothing without it.
 *
 * ⛔ ONE KEY, NOT TWO PLUS A FLAG — AND THE REASON IS A BUG THIS SHAPE CLOSES.
 * The first cut wrote `settlement` and `lastSeed` as top-level keys, gated on the
 * tier at WRITE time. The READ had no such gate: mergePersistedState restores by
 * top-level spread, and rehydrate runs BEFORE Supabase resolves the session, so a
 * returning SIGNED-IN user booted with a previous anonymous session's draft in
 * the editor and could save a world they never generated. A gate on one side of a
 * round trip is not a gate.
 *
 * The draft now travels as ONE envelope whose PRESENCE is the claim "an anonymous
 * session wrote this". Nothing can separate the marker from the payload, because
 * they are the same value, and the merge refuses anything that is not a genuine
 * envelope (absent, `true`, a string, a stale `{}`) — see persistMerge.js. The
 * second half of the gate, for a blob that IS anonymous but a session that turns
 * out not to be, lives at the boot auth resolution (store/anonDraftGate.js).
 *
 * ⛔ AND "ANONYMOUS TIER" IS NOT THE SAME QUESTION AS "AN ANONYMOUS WORLD".
 * Sign-out sets tier 'anon' and deliberately leaves the editor's settlement
 * standing — eviction routes through the same path and must never destroy unsaved
 * work. Gating on the tier alone therefore stashed the DEPARTING ACCOUNT's loaded
 * world, possibly one of their saves, into this device's storage for the next
 * anonymous visitor to boot into. clearAuth raises `signedInWorld`, so that world
 * stays on screen and never reaches the envelope, while a world the anonymous
 * visitor generates afterwards retracts the claim and persists normally.
 *
 * ⚠ THE INVARIANT IS PER-TAB, AND THAT IS THE CONTAINMENT. localStorage is
 * shared across a device's tabs, so two tabs can hold different ideas of what is
 * in "the" editor and the last write wins the envelope. What bounds it is that
 * the READ side is per-tab too: every tab adopts the envelope at its own boot and
 * settles it at its own initAuth, so a signed-in tab still drops what it adopted.
 * The worst a second tab can do is stash a draft the first tab would not have —
 * never hand one to a signed-in session that refuses it.
 *
 * ⚠ `signedInWorld` is a CLAIM, not a reference to the barred object, for the
 * same reason `restoredAnonDraft` is: under immer any mutation replaces
 * `state.settlement`, so a reference test would miss after a single edit and the
 * bar would fail OPEN — leaking the departing account's world. Only the generate
 * action retracts it, because only a new world is genuinely not theirs.
 *
 * ⚠ The whole settlement is persisted, not a projection of it. A restored draft
 * must be byte-identical to the one generated, or saving after a reload would
 * write a thinner world than saving before it — the same-path/other-path write
 * that this codebase has been bitten by before.
 */
export function partializeStoreState(state) {
  // Destructured, and the envelope below is built from SHORTHAND, on purpose:
  // the persist-shape walker (tests/store/lifecycleRoundTrip) discovers this
  // projection's keys by scanning the return block for `name: state.field`, so an
  // inline `{ settlement: state.settlement }` inside the envelope would register
  // as two more TOP-LEVEL persisted keys that do not exist.
  const { settlement = null, lastSeed = null } = state || {};
  return {
    config: state.config,
    configExplicitFields: state.configExplicitFields,
    institutionToggles: state.institutionToggles,
    categoryToggles: state.categoryToggles,
    goodsToggles: state.goodsToggles,
    servicesToggles: state.servicesToggles,
    // Device-scoped display preferences, deliberately separate from session UI.
    displayPrefs: state.displayPrefs,
    // World play-mode preference; additive and absent-tolerant on older blobs.
    advanceAutoResolve: state.advanceAutoResolve,
    // The anonymous draft, as ONE envelope (see the header). Null — never a bare
    // settlement, never a lone flag — for every signed-in tier and whenever there
    // is no draft to keep. THREE conditions, not one: the tier says anonymous,
    // there is no user behind it (belt and braces on the same fact), and the world
    // is not one a signed-in session left behind at sign-out (authSlice.clearAuth
    // bars it by reference, because sign-out sets tier 'anon' without clearing the
    // editor — see the header).
    anonDraft: state.auth?.tier === 'anon' && !state.auth.user
      && settlement && !state.signedInWorld ? { settlement, lastSeed } : null,
  };
}
