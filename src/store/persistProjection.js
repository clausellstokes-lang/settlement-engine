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
 * top-level spread, so a returning user booted with a previous anonymous session's
 * draft in the editor. A gate on one side of a round trip is not a gate. The draft
 * now travels as ONE envelope, and the merge refuses anything that is not a
 * genuine envelope (absent, `true`, a string, a stale `{}`) — see persistMerge.js.
 *
 * ⭐⭐ THE ONE RULE (2026-09-18) — AND WHAT IT REPLACED. The envelope is written
 * when, and only when, the world in the editor was BORN ANONYMOUS and nobody is
 * signed in right now. Both halves are read off facts that are already true:
 * `settlement.draftOrigin`, stamped at the birth by settlementGenerateAction.js
 * and carried on the world itself, and `auth.user`.
 *
 * Every earlier cut asked the same question with SESSION CLAIMS standing beside
 * the world — `restoredAnonDraft`, `signedInWorld` — and each one needed raising,
 * retracting at a chokepoint, stashing across an OAuth redirect and spending at a
 * boot resolution in another module. They were flags rather than references
 * because immer replaces `state.settlement` on every mutation, so a reference test
 * missed after one edit and the gate failed OPEN. A field ON the world needs none
 * of that: it survives the mutation that replaces the object (it is copied with
 * it), it survives the rehydrate (it is inside the persisted payload), and it is
 * still true a second after the session resolves. There is no drop at the boot
 * resolution, no claim and no stash: a device's anonymous draft belongs to the
 * device, and a signed-in person who finds it on screen keeps or clears it.
 *
 * ⛔ AND "ANONYMOUS TIER" IS NOT THE SAME QUESTION AS "AN ANONYMOUS WORLD" —
 * which is why the condition names the ORIGIN and the USER, never the tier.
 * Sign-out sets tier 'anon' and deliberately leaves the editor's settlement
 * standing (eviction routes through the same path and must never destroy unsaved
 * work). A tier-only gate therefore stashed the DEPARTING ACCOUNT's loaded world,
 * possibly one of their saves, into this device's storage for the next anonymous
 * visitor to boot into. That world's origin is 'account', so it is refused here
 * by the same one rule — no sign-out-time bar to raise, and nothing to retract.
 *
 * ⚠ A SIGNED-IN WRITE NULLS THE KEY RATHER THAN LEAVING THE STORED ENVELOPE
 * STANDING, and that is deliberate. zustand's persist writes the WHOLE projection
 * on every store write, so the first write after an in-page sign-in replaces the
 * stored envelope with `null`. The draft stays on screen and is the person's to
 * keep or clear; the DEVICE stops remembering it, because from that moment the
 * library is where their worlds live and saving is a deliberate act.
 *
 * ⚠ THE INVARIANT IS PER-DEVICE, AND THE LAST WRITE WINS. localStorage is shared
 * across a device's tabs, so two anonymous tabs can hold different drafts and the
 * last store write owns the envelope. That is the whole exposure now: whatever the
 * envelope holds, it was born anonymous on this device, and every boot adopts it.
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
    // settlement, never a lone flag — whenever anyone is signed in and whenever
    // the world in the editor was not born anonymous. TWO conditions and no
    // session flags: nobody is signed in NOW, and this world's own stamp says an
    // anonymous session made it. A world with no stamp (a legacy object reaching
    // the editor through a non-generate door) is not 'anon', so it fails closed.
    // ⚠ The value expression must keep OPENING on `state.` — the persist-shape
    // walker (tests/store/lifecycleRoundTrip) discovers this projection's keys by
    // scanning the return block for a key followed by a `state` member read, so a
    // key whose value opens on a local reads to it as a REMOVED persisted key.
    // (Which is also why this note may not spell that pattern out: the scan would
    // count the example as a key.)
    anonDraft: state.auth?.user == null && settlement?.draftOrigin === 'anon'
      ? { settlement, lastSeed } : null,
  };
}
