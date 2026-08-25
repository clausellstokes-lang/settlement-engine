---
name: dead-op-retirement-half-shipped
description: "Dead-op dispositions RETIREMENT HALF built 2026-07-27 in minifold (uncommitted) — 12 callerless ops + registry rows deleted, registry 170→158, ratchet 22→10; updateConfig is now the ONLY writer of state.config (all four single-door exemptions were dead ops)"
metadata:
  node_type: memory
  type: project
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T03:39:33.530Z
---

**DEAD-OP DISPOSITIONS — RETIREMENT HALF. Built 2026-07-27 in the `minifold` worktree on `claude/composite-r4`; ✅ FOLDED @ `b1aeec6d` 2026-07-27 ~23:20 (one commit with the wiring half + queue #18; #14 hunks carved out and left in-tree for the twin's fold — carve record in [[minifold-dead-op-fold-coordination]]).** Twelve registered-but-callerless store operations were removed together with their `src/store/operationRegistry.js` rows: `refreshSystemState`, `replaceAllPlacements`, `mergeInstitutionToggles`, `resetToggles`, `resetGoodsServices`, `addCredits`, `spendCredits`, `clearCampaignWizardNews`, `setRegionalChannelVisibility` (plus its domain twin in `src/domain/region/graph.js` and the `src/domain/region/index.js` export), `resetConfig`, `handleImportDirect`, `setNeighbourRelType`. Registry 170 → 158 ops (`registeredActionNames().length`), compendium regenerated once at lane end, `DEAD_OPERATIONS` in `tests/store/deadOperationRatchet.test.js` 22 → 10. The concurrent WIRING half ([[dead-op-wiring-half-shipped]]) and owner-queue #14 then took it 10 → 5 → 4.

**Three structural dividends, each larger than the row deletions:**
1. **`updateConfig` is now the ONLY writer of `state.config` in src.** All four exemptions enumerated by `tests/store/configDirectWriterExemptions.scan.test.js` turned out to be dead ops (`setSettlementType` in Batch 2; `resetConfig` + `setNeighbourRelType` + `handleImportDirect` here), so R-3's "one validated door" stopped being a claim-with-exemptions. `EXPECTED_WRITERS` is now the door alone and the not-vacuous floor dropped 4 → 1 (catching power is carried by the planted-fifth-writer negative control, not by the floor).
2. **`creditsSlice` no longer has a client-side ledger.** `addCredits`/`spendCredits`, the `transactions` array they alone wrote, the `CREDITS_SPENT` analytics call and the `track`/`EVENTS` import all went. NO paid behavior moved: the live path was always aiSlice → `setCreditBalance` from the server's `creditsRemaining`, and history reads `src/lib/creditLedger.js`. `transactions` was session-only (absent from the `partialize` in `src/store/index.js`) so no migration was owed. A `for (const gone of ['addCredits','spendCredits','transactions'])` toBeUndefined pin in `tests/store/creditsAndNarrateSignal.test.js` stops it coming back.
3. **`refreshSystemState` was a HARNESS-ONLY door** — its only eight callers were test harnesses seeding a store. They now call `deriveSystemState(s.settlement)` inside `store.setState`, which is the real path every store writer uses.

**Why:** a registered op with no caller is not inert — it is rendered in the public Compendium, counted by the registry walkers, and can be "helpfully" wired later without re-facing the design questions it originally skipped (`replaceAllPlacements` had no canon guard and no `snapshotForUndo`; `clearCampaignWizardNews` erased a campaign's whole Herald feed with `undoState:'none'` and no confirmation). Each retirement site carries a written `RETIRED (R-5b, owner queue #21)` note explaining what is gone, what LIVE machinery is untouched, and what re-adding it would owe.

**How to apply:** before retiring any further op, work [[op-retirement-cascade-checklist]] — the row deletion is the small part. The four ops still held are `requestProgression` (progression program) and `completeOnboarding`/`markFeatureUsed`/`resetOnboarding` (blocked on the unadjudicated onboarding-coach exit finding, task #16); their held-reasons live in the `DEAD_OPERATIONS` comment block in `tests/store/deadOperationRatchet.test.js`.

**Deliberately deferred, documented not lost:** `neighbourSlice`'s `importedNeighbour` / `neighbourRelType` state and its `RELATIONSHIP_TYPES` export are KEPT as the G-2b re-exposure seam and are now WRITER-LESS by design (the generator still reads `config._neighbourRelType`); and field intent (`configExplicitFields`) has no runtime clear path now that `resetConfig` is gone — not a regression, since `resetConfig` had no caller either, and `tests/store/customContentTunablesRuntime.test.js` pins the add-only truth plus `recordIntent:false`.

Related: [[dead-op-wiring-half-shipped]], [[op-retirement-cascade-checklist]], [[capability-remediation-program-state]], [[minifold-tree-is-live]].
