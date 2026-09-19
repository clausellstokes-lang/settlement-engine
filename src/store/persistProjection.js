/**
 * The complete device-local Zustand persistence projection.
 *
 * Keeping this as a named pure seam makes the persisted shape executable in
 * tests. Capabilities, reporter leases, auth, and every other owner/session
 * field are excluded by construction rather than by serialization luck. Missing
 * fields are restored by persistMerge.
 *
 * ⭐ THE ONE GENERATED WORLD THAT IS PERSISTED, AND WHY (2026-09-18). This
 * projection used to exclude generated worlds outright, and a refresh therefore
 * took an anonymous visitor's dossier: an anonymous account has maxSaves 0
 * (store/authSlice TIER_GATE), so there is no library for the draft to live in
 * and nothing else held it. /create is where the promise is made — the hero's
 * `ctaSubline`, "your first dossier stays in this browser" (copy/en.js) — and
 * this key is the whole of what makes it true, which is why that line was
 * narrowed to exactly what this code does when the rule below was cut.
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
 * ⭐⭐ THE ONE RULE (2026-09-18, ODQ §934.8) — AND WHAT IT REPLACED. The envelope
 * is written when, and only when, the world in the editor was BORN ANONYMOUS and
 * nobody is signed in right now: `state.draftOrigin === 'anon' && auth.user ==
 * null`. Nothing else ever writes it.
 *
 * `draftOrigin` is TRANSIENT STORE-ROOT STATE, and deliberately not a key on the
 * settlement. It is set at the birth (settlementGenerateAction.js), DERIVED on
 * every rehydrate (persistMerge.js: 'anon' when this boot adopted the envelope,
 * 'account' otherwise), re-stamped when a signed-in person makes the world theirs
 * (claimSettlementForAccount), and nulled at the settlement-swap chokepoint, so a
 * door that installs a world without answering the question fails CLOSED. It is
 * absent from this projection on purpose — a derived session fact that persisted
 * itself could outlive the session it describes.
 *
 * Every earlier cut asked the same question with SESSION CLAIMS standing beside
 * the world — `restoredAnonDraft`, `signedInWorld` — and each one needed raising,
 * retracting at a chokepoint, stashing across an OAuth redirect and spending at a
 * boot resolution in another module. They were flags rather than references
 * because immer replaces `state.settlement` on every mutation, so a reference test
 * missed after one edit and the gate failed OPEN. One derived root field needs
 * none of that, and unlike a stamp ON the world it never rides into a save row or
 * into the observed-shape corpus: there is no drop at the boot resolution, no
 * claim and no stash — a device's anonymous draft belongs to the device, and a
 * signed-in person who finds it on screen keeps or clears it.
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
    // the world in the editor was not born anonymous. TWO conditions: nobody is
    // signed in NOW, and the editor's recorded origin says an anonymous session
    // made this world. A world installed by a door that set no origin leaves it
    // null, which is not 'anon', so it fails closed. ⚠ `draftOrigin` is read here
    // and is NOT itself a persisted key — see the header.
    // ⚠ The value expression must keep OPENING on `state.` — the persist-shape
    // walker (tests/store/lifecycleRoundTrip) discovers this projection's keys by
    // scanning the return block for a key followed by a `state` member read, so a
    // key whose value opens on a local reads to it as a REMOVED persisted key.
    // (Which is also why this note may not spell that pattern out: the scan would
    // count the example as a key.)
    anonDraft: state.auth?.user == null && state.draftOrigin === 'anon' && settlement
      ? { settlement, lastSeed } : null,
  };
}
