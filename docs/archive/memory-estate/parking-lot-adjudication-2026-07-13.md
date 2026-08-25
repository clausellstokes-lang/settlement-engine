---
name: parking-lot-adjudication-2026-07-13
description: "Phase 5.5 §0.6 parking lot ADJUDICATED (owner ruled 2026-07-13); work on branch claude/phase55-parking-lot, NOT merged"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a5cf0b9-dc81-4e0a-818b-297ced30d0a1
---

The Phase 5.5 §0.6 parking lot (4 items) was surfaced with verified numbers and OWNER-RULED
in-session on 2026-07-13 (satisfying the playbook's "do NOT self-rule on §0.6" hold — the owner
decided, not the manager). Rulings, now recorded in the playbook §0.6.0 / §0.6.1 / §0.7:

- **FUNDING (M10b + W5): FP-2-FIRST, NO budget raise.** The owner chose the store-slice split over
  raising CLOSURE_BUDGET_BYTES (1,255,985). FP-2 reclaims ~80–130K eager; M10b (+86B est) + W5
  (~+890B) then land at the reclaimed budget, which ratchets DOWN.
- **M10b catch-up: BUILD IT** — CATCH_UP_CAP_WEEKS = 26, calendar-advances-past-cap. Lands AFTER FP-2.
- **F24: AccountPage NUL FIXED** (cherry-picked 6faa1045). **supplyCompleteness.js:158 NUL remains**
  (intentional-looking `\x00` cache-key delimiter; owner's call, left as-is) — see [[f24-corruption-class-closed]].
- **5.5-K: the "UNWIRED" note was STALE** — the live pack.cells capture is fully wired both sides by
  5.5-M @ 18fc15f2 (iframe sf-bridge.js:863 + client + freeze-first); only an empirical determinism
  check vs a real map remains (deferred to the checkpoint soak; freeze-first handles either outcome).

WHERE THE WORK IS: ✅ **MERGED to review-fixes-2026-07-08** (now at 4d93cb3a; owner authorized the merge
in-session 2026-07-13). The parking-lot branch claude/phase55-parking-lot merged review-fixes IN (which had
advanced with the parallel Round-21 stream: voice sidecars 25003430 + M11a PESTILENCE), CLEAN (zero file
overlap), then review-fixes fast-forwarded to it. Merged tree full suite 8,318/8,318; verify:dist 18/18;
closure 1,254,893 (margin 1,092 B). Foreign WIP (M11b calamity, uncommitted pulseKernel.js + untracked
calamity*.js in the main worktree) PRESERVED — the ff touched none of it. Commits: c85781f0 (F24 fix),
47ccd6dd (5.5-K guard), 098aaee9 (adjudication rulings), 73fc3481 (FP-2 spec), 43004426 + 7fb62ed2 + 7d04f411
(ledger/spec notes), **715fe7b2 (FP-2a −2,448 B)**, **d082f5d3 (M10b, M10 COMPLETE)**, 4d93cb3a (merge).
NOT pushed to origin (owner-gated). ⚠️ There are now TWO active streams on review-fixes: this one (parking-
lot/FP-2/M10b) + the parallel Round-21/M11 stream ([[round21-backlog-program]], their handoff =
docs/PHASE55_ROUND21_BACKLOG_PLAN.md).

**FP-2a LANDED** (715fe7b2, −2,448 B: 1,255,965→1,253,517). Used the loadEngine DEP-IMPORT pattern,
NOT the eager-stub/body-extraction in the §0.7 spec — that defers each async action's SYNC prefix
(set(aiLoading)+abort stamp) and broke F18 (§0.7.3 has the correction). Dynamic-imported lib/ai.js +
narrativeMutations.js (sole-imported by aiSlice) at their call sites after the sync prefix. Recorded
shift: generateNarrative fires one microtask later; F18 abort contract intact; 2 F18 tests yield a
tick. Budget UNCHANGED 1,255,985 — the reclaim FUNDS M10b (+86B) + W5 (~+890B) with no raise.

**FP-2 KEY DE-RISKING (verified, corrects the FP-2 verifier's "dominant risk"): the byte-identity
GOLDENS ARE STORE-FREE** — no tests/property/*Golden test imports the store/useStore/heavy-slice
creators; the generator runs headless via dynamic loadEngine(). So an FP-2 store refactor is
ORTHOGONAL to same-seed byte-identity (law 1). Real blast radius = ~27 store/join behavior tests +
verify:dist. The safe FP-2 design (playbook §0.7.3): lazify only the ASYNC orchestrator bodies
(eager stub → lazy body module + manifest walker); sync setters stay eager (a sync setter can't
await a dynamic import → the whole-slice-microtask variant has a real race, rejected).

NEXT STEPS (full detail in playbook §0.8): (1) **M10b eager-TRIM** — M10b landed at +1,376 B (NOT the
+86 B estimate — the catchUpCampaignWorld body rides the eager slice); lazify it via loadWorldEngine (the
FP-2a pattern) to reclaim ~800 B. (2) **W5** re-apply (cherry-pick 312a5025, NEVER merge — reverts the
M-ladder; [[w5-remerge-base-correction]]; keep both OutputContainer dossierLazyTabs + W5 polish) — margin
is now 1,092 B so W5 (+890) fits ONLY after the M10b trim or accepting a thin margin. (3) **RATCHET the
budget DOWN** after trim+W5. (4) the empirical 5.5-K determinism check (checkpoint soak). (5)
supplyCompleteness.js:158 NUL (owner call). (6) FP-2b/c (optional). Endgame per
[[handoff-plan-post-ladder]]: ladder now at M10 COMPLETE + M11a; M11b (calamity) is the parallel stream's
WIP; then checkpoint SOAKS + everything-on TUNING (next AI), then the MASTER MERGE ([[third-lineage-mystifying-ride]]).
