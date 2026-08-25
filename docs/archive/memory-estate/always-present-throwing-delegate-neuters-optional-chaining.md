---
name: always-present-throwing-delegate-neuters-optional-chaining
description: ⚠⚠ A cold-split's always-present throwing delegate makes every defensive `?.` a lie — with the 21-site sweep ledger and the rule for which sites KEEP it
metadata: 
  node_type: memory
  created: 2026-08-10
  type: hazard class
  lane: step-15 ratchet reconciliation; the ?. sweep 2026-08-10
  commits: introduced by 6e7acc4d; measured + swept at 9df7e428 (sweep left unstaged)
  modified: 2026-08-10T19:22:19.132Z
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
---

# ⚠⚠ AN ALWAYS-PRESENT THROWING DELEGATE SILENTLY NEUTERS EVERY DEFENSIVE `?.`

## The class

A lazy/cold-split installs a **stable delegate for every action name** on the eager
slice, and the delegate **throws** until the runtime chunk preloads. Every call site
that had defensively written `state.getX?.(…)` — meaning "skip if this action is not
here yet" — silently changes behavior:

- BEFORE: the property was ABSENT when cold, `?.` short-circuited to `undefined`,
  the component rendered its safe path.
- AFTER: the property is ALWAYS PRESENT, so `?.` **calls it**, and the call throws.

The guard still reads as protective and protects nothing. Nothing reds at the call
site; the failure surfaces far away, as a render-time throw.

**Measured instance (2026-08-10):** `6e7acc4d` moved all 34 `CAMPAIGN_CORE_ACTIONS`
behind `campaignActionDelegate` (`src/store/campaignEntryDelegates.js:22`) which calls
`requireCampaignRuntimeAction` → throws `CampaignRuntimeNotReadyError`
(`src/store/campaignRuntimeBridge.js:43`). **38 tests across 6 files** went red at once
with one stack shape. Both call sites (`SettlementCard.jsx:84`,
`useTownScenePaneBridge.js:52`) predated the split and still carry the vestigial `?.`.

## The diagnostic tell

A large cluster of failures across unrelated-looking UI suites sharing ONE error class
and ONE stack frame in the store layer. Group the failure messages by their first line
BEFORE attributing anything per-file — 38 identities collapsed to one cause here, and
attributing them one at a time would have invented 38 separate stories.

## Was it a production bug? NO — check the gate before assuming

Production mounts every campaign-reading component behind `AppViews`' `campaignLazy`,
and `loadCampaignRuntimeView` **awaits the preload before importing the view**
(`src/store/campaignRuntimeView.js:25`). Two green guards pin this:
`tests/store/campaignRuntimeRouteGate.test.js` ("every campaign-capable route and
Surveyor stage uses the gate") and `campaignRuntimeCallerCoverage.test.js` ("every UI
caller is live below at least one derived campaignLazy boundary").

So the defect was in the **test harness**: the suites render the component directly,
outside its production gate. The honest cure is to satisfy the production precondition —
`beforeAll(async () => { await preloadCampaignRuntimeForStore(useStore); })` — which is
the repo's own idiom (`campaignRuntimeRouteGate.test.js:89` does exactly this). **No
assertion changes.** Verified by mutant: inverting `alreadyDestroyed` in SettlementCard
reds 8 of 9 cured tests, so they still bite.

## How to apply

1. When a cold-split makes actions "always present but throwing", **sweep the call sites
   for `?.` on those names in the same commit** — the optional chaining is now a lie.
   The repo already ships the right idiom for a genuinely cold read:
   `readyCampaignAction(get, name)` returns the action or `null`.
2. When a component test throws a readiness error, ask **"does production render this
   behind a gate?"** before either weakening the test or 'fixing' the source. If a gate
   exists and is pinned, the harness must reproduce the precondition. If no gate exists,
   it is a real white-screen bug.
3. **THE SWEEP RAN 2026-08-10 — and the disposition rule is NOT "drop them all".**
   Census (derived from `CAMPAIGN_CORE_ACTIONS`, not hand-typed): **21** optional-call
   sites in `src/`. **10 changed, 11 exempt.** The line that decides each site is
   **WHAT THE READ IS AGAINST**, not whether the action is gated:

   - **Reads off the PRODUCTION store** (`useStore(...)` / `useStore.getState()`) →
     `?.` is DEAD, drop it. `src/store/index.js` is the ONLY `create()` in `src/` and
     it ALWAYS composes `createCampaignSlice`, so the key is always present.
     Changed: SettlementCard 84-86, CampaignFolder 106, useTownScenePaneBridge 52+104,
     MapShareEditor 326/364/380.
   - **Reads off an injected `get()` in the STORE layer** → `?.` is STILL LIVE, keep it.
     **44 of 45 campaign-composing TEST stores compose the runtime BODIES directly and
     omit the entry slice**, and two compose the pulse slice with no core slice at all.
     Exempt: `settlementSlice.js:821`, `aiSlice.js:96`, `roadsRescueInflame.js:15`,
     `campaignWorldPulseSlice.js:446/522/539/580`, `campaignAdvanceSession.js:98`,
     `customContentSliceRuntime.js:49`. Headless composability is a DOCUMENTED design
     property (`campaignAdvanceSession.js:79-87`), not test convenience.
   - **INTRA-slice self-read** → drop. `campaignSlice.js:189` guarded
     `getCampaignMutationBlock`, which is defined at `campaignSlice.js:428` in the SAME
     body — unreachable without it, so dead in every composition. Easy to miss.
   - ⚠ **Not every `?.` on these names is a store read at all.**
     `useLibraryBulkSelect.js:72,130` take both blocks as OPTIONAL DESTRUCTURED PARAMS
     (JSDoc marks them `?`; the hook's header says "Pure store-free"). The entry slice
     cannot make a prop guard dead. Check the binding before dispositioning.

4. **DROPPING `?.` AT A UI SITE CONVERTS "the mock omits this key" FROM SILENT-UNDEFINED
   INTO A RENDER THROW — and the SUITE is the only trustworthy denominator.** A static
   heuristic (mocks the store × mentions the component) flagged **21** suspect test files;
   the actual run broke exactly **ONE** (`settlementsPanelLibraryLoad.test.jsx`, missing
   `getCampaignMutationBlock` — reached only because SettlementCard:85 short-circuits on
   `currentCampaignId &&`, so it fires only for a card inside a campaign). Do not
   pre-patch the flagged set; run the suite and fix what actually reds. The honest cure
   is ADDING the key to the mock (it matches the real store), never restoring the `?.`.

5. ⚠⚠ **COMPARE THE FAILING SET BY IDENTITY, NEVER BY COUNT.** Baseline and post-edit
   both read `2 failed | 3755 passed` — identical counts, DIFFERENT sets. `createWorkflowRail`
   (a bare `findByRole` timeout, zero references to anything touched) had flaked out at
   baseline while my own regression flaked in. A count comparison would have certified
   the regression as clean.

6. The one-command equivalence probe worth re-minting: against the REAL store with NO
   preload, assert (a) every name is `typeof === 'function'` when cold, (b) bare and
   `?.` forms throw the SAME `CampaignRuntimeNotReadyError`, (c) NEGATIVE CONTROL — on
   `{}` the `?.` returns undefined and the bare call throws TypeError. (c) is what
   proves the store-layer exemptions are real rather than cowardice.

7. ⚠⚠ **HEAD 9df7e428 IS RED ON 8 FILES / 40 TESTS, AND ONLY UNCOMMITTED WIP HIDES IT.**
   Measured 2026-08-10 in a materialised parent tree: `librarySettlementDestroy`,
   `settlementCardSignals`, `livingBackdrop`, `settlementMapAnnotations`,
   `settlementMapIllustratedCensus`, `settlementMapPaneEdit`, and both
   `customContentSlice.deeager` / `.race` fail at HEAD. The working tree looked green
   ONLY because the parallel lane's `preloadCampaignRuntimeForStore` harness additions
   and its `customContentSliceRuntime` repair were sitting UNCOMMITTED. **A green shared
   working tree is not evidence that HEAD is green** — when a sibling lane holds the cure
   in its dirty files, gate the MATERIALISED candidate tree (`git archive <tree> | tar -x`,
   symlink the worktree's own `node_modules`) and a materialised PARENT as the control.
   The `?.` sweep landed at `acb35412` with byte-identical 40-test failing sets on both,
   which is what proved it neutral. Do not chase these reds as a fresh regression.

8. ⚠⚠ **THE PLUMBING-COMMIT REVERSAL FIRED AGAIN (`acb35412`).** After `commit-tree` +
   `update-ref`, the SHARED INDEX still held the pre-commit blobs, so `git status` read
   `MM` on the committed paths — the index was arming a REVERSAL of the just-landed work
   for whichever lane ran `git commit` next. The neutralisation step is not optional
   cleanup, it is part of the commit:
   `git update-index --cacheinfo 100644,$(git rev-parse HEAD:<path>),<path>` for **your
   paths only**, then confirm `git diff --cached --name-only` is empty.

9. The same commit left `src/store/customContentSliceRuntime.js:40` calling
   `get().pinLegacyCampaignContentBindings(customContent)` **unguarded** (it had been
   `?.`), inside a caller's try — so the throw skipped `restored = true` and stamped
   `customContentError` over content that HAD been restored. Cure: wrap in try/catch AND
   restore the `?.`; the preload above it was already treated as non-fatal.
