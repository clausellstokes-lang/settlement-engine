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
 * THE KEYS ARE UNCONDITIONAL, THE VALUES ARE NOT. `settlement` and `lastSeed`
 * are always present in the blob (null when they do not apply) so the persisted
 * SHAPE never forks by tier — a shape that differs between cohorts is the exact
 * class mergePersistedState exists to close.
 *
 * ⚠ The whole settlement is persisted, not a projection of it. A restored draft
 * must be byte-identical to the one generated, or saving after a reload would
 * write a thinner world than saving before it — the same-path/other-path write
 * that this codebase has been bitten by before.
 */
export function partializeStoreState(state) {
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
    // The anonymous draft (see the header). Null for every signed-in tier.
    settlement: state.auth?.tier === 'anon' ? (state.settlement ?? null) : null,
    lastSeed: state.auth?.tier === 'anon' ? (state.lastSeed ?? null) : null,
  };
}
