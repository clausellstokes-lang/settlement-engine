---
name: w5-remerge-base-correction
description: "W5 re-merge target HEAD is review-fixes-2026-07-08@df217415, NOT master/adoring-wescoff — worktree was on wrong base"
metadata: 
  node_type: memory
  type: project
  originSessionId: 177e367e-1931-4cd3-a26d-99d4f271c756
---

The W5 RE-MERGE wave (2026-07-12) target HEAD is **review-fixes-2026-07-08 @ df217415**, the integration main that carries FP-1 (src/copy/footer.js + src/domain/events/registryFull.js + registryProse.js split), SEASONS-A, the 5.5-K keystone, and the Session/Foundry merge.

**Trap:** the fresh worktree (amazing-thompson-6dd363) was cut on branch claude/adoring-wescoff-6a25a8 @ d024286e — the **master lineage** (PR #47 merge), which does NOT have FP-1 and, confusingly, ALREADY has the 8 eventComposer field modules (introduced there by 243ddc13). review-fixes is the opposite: it HAS FP-1 but eventComposer is still MONOLITHIC (the 8 field modules genuinely absent). Every W5 conflict resolution the task describes is written for the review-fixes world; applying on master lineage would be wrong.

**Proof review-fixes is the right base:** classifying the 70 W5-touched files (75fa1202..festive-tesla) against review-fixes yields exactly the task's 8 named conflict files (App.jsx, authUI.jsx, EventComposer.jsx, en.js, display/{armyStrength,tradePressure,visibilityAudit}.js, eventComposerApplyFlow.test.jsx). Against master lineage it yielded 62 — nonsense.

**Topology:** merge-base(master-HEAD, festive-tesla) = acf59a00; W5 base 75fa1202 is 203 commits down a lineage separate from HEAD's 308. So W5 intent = ONLY the 11 commits 75fa1202..festive-tesla (branch claude/festive-tesla-cd6657 @ 9c86d19e, also checked out detached in worktree amazing-euclid). The 62 non-conflict W5 files are byte-identical to base on review-fixes → takeable wholesale; only the 8 need hand-resolve preferring HEAD's structure.

d024286e is safely held by master + 9 branches, so re-basing my branch orphans nothing. Related: [[w5-cosmetic-sweep-progress]] [[closure-ratchet-vacuity-fixed]] [[opus-implements-fable-manages]]

**COMPLETED 2026-07-12** on branch claude/adoring-wescoff-6a25a8 (re-based onto df217415), 11 commits df217415..HEAD, 68 files. All 9 W5 sub-waves cherry-picked as fenced commits + account NUL fix + a budget-reconciliation commit. Gates: lint 0 / tsc full 0 / domain-strict 0 / build ok / verify:dist green / goldens 34 / full suite 7722 pass. ZERO W5 regressions.

Resolutions of the 8 conflict files: App.jsx (`onNavigateAccount`→`isMobile`), en.js (auth-key removals + gallery keys, 3-way clean), authUI.jsx (`OrDivider({label})`; the comment change was already on HEAD), EventComposer.jsx (kept HEAD's `registryFull` import + comment, took W5's decomposition body, dropped now-unused inferImportance/influenceForImportance), eventComposerApplyFlow.test.jsx (auto-merged, keeps registryFull). The 3 display read-models (armyStrength/tradePressure/visibilityAudit) → KEPT HEAD (W4h already did the pulseShapes type-hardening, better than W5's — dropped W5's redundant churn). fb05c172 (lint ratchet debt) → SKIPPED (fully redundant on this lineage).

**PENDING OWNER DECISIONS / flags:**
1. **first-paint budget raise 1,256,000→1,257,000 (NEEDS RATIFICATION)** — W5 lands genuine eager STORE-slice feature fields (configSlice.customSlidersExplicit + mapSlice.selectedAnnotationKind kind-aware-delete + 2 AA swatches); measured 1,256,436. NO new eager modules (same 7 chunks/135 index modules, sourcemap-verified) — the "no new eager imports" contract held, but the monolithic store has no lazy path so +890 B lands eager. +1,000 mirrors the W4h allowance; FP-1 store-slice lazy-registration is the ratchet-down path. Documented in tests/build/vendorPdfLazy.test.js.
2. **PRE-EXISTING (not mine): tests/lint/domainAnyCastBaseline.test.js RED on df217415 itself** — stale frozen baseline; faithEventFilter.js(+1), spatialDigest.js(+11), worldState.js(34 vs 33). Last two are DO-NOT-TOUCH spatial/worldPulse; needs the Modulation/W-Session owners to regenerate .domain-any-baseline.json.
3. **LinkNeighbourField ships DORMANT** (per W5.7) — renders only when host passes onLink; activation one-liner is SettlementDetail.jsx:574, fenced to a concurrent wave. Left unwired.
4. **F24 NUL byte at supplyCompleteness.js:158** (worldPulse, DO-NOT-TOUCH) — spawned task_c35bfa43.
