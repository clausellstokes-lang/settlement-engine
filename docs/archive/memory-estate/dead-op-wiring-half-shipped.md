---
name: dead-op-wiring-half-shipped
description: "Dead-op dispositions WIRING HALF built 2026-07-27 in minifold (uncommitted) — revertSingleEdit / destroySavedSettlement / resetAllToggles / bulkSetGoods+bulkSetServices gained real consumers; ratchet 10→5, and the twin #14 lane took it to 4"
metadata: 
  node_type: memory
  type: project
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T10:45:17.488Z
---

**DEAD-OP DISPOSITIONS — WIRING HALF. Built 2026-07-27 in the `minifold` worktree on `claude/composite-r4`; ✅ FOLDED @ `b1aeec6d` 2026-07-27 ~23:20 (one commit with the retirement half + queue #18). Post-build additions in the same fold: the destroy fallback is narrated AND announced (`<tr aria-label>` + inner `<span role="status">`), and the destroy kebab + ResetConstraintsButton native tooltips were REMOVED for the title= census (490→487). Twin's post-fold MUST-FIX: ✅ CLOSED @ `a7f3d6c6` 2026-07-28 — the twin authored the Destroyed-rubric mark in-tree (Phase column stacks a danger rubric off `alreadyDestroyed`, 3 pins incl. a real-action repaint test); this session folded it verbatim with attribution on owner order. Documented residue: Health column still shows the blob band beside the mark; destroyedCause reads in the dossier.** The retirement half (12 ops) and owner-queue #14 (renameFaction) ran as CONCURRENT sessions in the same tree and interleaved cleanly with this work.

## What gained a surface

- **`revertSingleEdit`** — a per-change **Remove** in `src/components/dossier/PendingChangesBar.jsx`. ⭐ ONE hunk reaches BOTH review mounts: `OutputContainer` renders the bar standalone at flag-OFF, and `SettlementWorkbench`'s Change Dock *renders the same component* at flag-ON. Do not go looking for a second mount.
  - ⚠️ The desktop itemized list REPLACED the one-line `summary` span (the summary is now MOBILE-ONLY, plus an `aria-hidden` flex spacer on desktop). Reason: `tests/components/pendingChangesBarScope.test.jsx` does `getByText(/Current B/)`, and rendering the summary *and* the list made that match twice and threw.
  - The action returns a **bare boolean**, not an ActionResult; only an explicit `=== true` counts as success.
- **`destroySavedSettlement`** — kebab item "Record its destruction" on the Library row (`SettlementCard.jsx`) opening a lazy leaf `src/components/settlements/DestroySettlementControl.jsx` (type-the-name + cause). The R-1 confirm gate stays the authority; the component pre-checks only so the button is not a trap.
  - ⚠️ `jsx-a11y/control-has-associated-label` REDS a `<tr>` whose child chain to a component is 3 deep. `<tr><td><Suspense><Control/>` fails; `<Suspense><tr><td><Control/>` passes. Put the lazy boundary OUTSIDE the row.
  - ⚠️ SAME CLASS bit the NARRATED fallback (loadingNarrationRatchet 40→41 was this lane's; narrated 2026-07-27, later session): the row's label search is shallow, so `<tr><td><span>text` reds the `<tr>` — put the text DIRECTLY in the `<td>`. And NO `role="status"` on the td: jsx-a11y treats td as interactive and `no-interactive-element-to-noninteractive-role` reds the demotion (GenerateWizard's narrated fallbacks carry no live region either).
  - Offered on CANON rows only (vetoable): the action does `phase: currentCampaignState.phase || 'canon'`, so on a draft it would open a campaign timeline as a side effect.
- **`resetAllToggles`** — "Clear all" in the Create flow's deep-constraints header, as its own leaf `src/components/generate/ResetConstraintsButton.jsx` (separate component so the four-bag subscription re-renders one button, not the whole console).
- **`bulkSetGoods` / `bulkSetServices`** — the Goods and Services grids' Force All / Exclude All / Reset now route through the store ops, matching how `InstitutionalGrid` already used `bulkSetInstitutions`.
  - ⚠️⚠️ **`bulkSetServices` had to be REPAIRED to be wirable at all**: it rewrote only the bag's EXISTING keys, so Force All was a **no-op on a clean bag**. New signature `bulkSetServices(mode, serviceKeys = [])` — the grid hands in its own tier-filtered key list, the same arrangement `bulkSetInstitutions` uses for its catalog getter. No test pinned the old signature.
  - `bulkSetGoods(mode, tierData)` kept its signature; the panel passes goods **grouped by the tier their key already resolves to** (visible tier, or under "All tiers" the first tier carrying the good) so a bulk press writes exactly the keys the cards read and never reaches a hidden tier.
  - Side benefit: Force All is now ONE `set` instead of ~786 sequential ones.

## Ratchet

`tests/store/deadOperationRatchet.test.js` **10 → 5** here (the five above), then **5 → 4** when the twin #14 session wired `renameFaction`. `queueEdit` left `UNREACHABLE_INVERSE` (its promised inverse is live). Remaining 4: `requestProgression`, `completeOnboarding`, `markFeatureUsed`, `resetOnboarding` (the last three blocked on the unadjudicated onboarding-coach-exit finding).

⭐ The ratchet's "no registered operation JOINS the dead list" test is the **reachability proof**: removing a name that is still measured dead reds it by name. Green after the shrink = all five are genuinely consumed.

## Pins added (none need an E-A manifest entry — `tests/components/` + no nomenclature token)

`tests/components/pendingEditSingleRevert.test.jsx` (5) · `librarySettlementDestroy.test.jsx` (6, drives the REAL store action) · `toggleGridBulkControls.test.jsx` (6, behavior-parity not call-arg spies, plus an anti-vacuity "the grids dispatch the registered op" guard).

⚠️ `ServicesTogglePanel` costs **~9.5s to MOUNT** under jsdom against the real 274-institution catalog, and each press ~3-9s. Give it ONE mount per test file and an explicit timeout, or it blows the 20s default.

## Deferred (documented, not bugs to re-find)

- A destroyed settlement's Library row shows no "destroyed" marker — Phase/Health columns read unchanged. Belongs to whoever owns the ledger's column grammar. Written into `DestroySettlementControl.jsx`'s header.
- `bulkSetGoods` still hardcodes its own six-tier list instead of importing `TIER_ORDER` (values verified identical).

## Measured on the real vite build (`npm run build`, 1m07s)

`DestroySettlementControl` gets its own **2,385 B** chunk and appears **0 times** in `SettlementsPanel-*.js`. `ResetConstraintsButton` (807 B isolated esbuild --minify) rides the existing `GenerateWizard` chunk (103.07 kB) as designed — a static leaf in the chunk that already holds all three grids. The Remove control rides the existing lazy `PendingChangesBar` chunk. `VERIFY_DIST=1 vitest run tests/build` = **40 files / 296 tests green**.

## Foreign red observed, NOT mine — since CLOSED

`npm run typecheck` → `src/store/index.js(77,40) TS2554: Expected 0-1 arguments, but got 2`. Attributed: the retirement lane changed `createNeighbourSlice = (set, get)` → `(set)` in `src/store/neighbourSlice.js`, and `store/index.js` line 77 still calls it with two. ✅ CLOSED 2026-07-27: the slice keeps the uniform `(set, _get)` factory shape (comment in-file explains why); typecheck green.
