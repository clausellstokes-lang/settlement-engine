---
name: ep-l-selfcapture-s3-closed
description: "EP-l self-capture class CLOSED (5th arm S3 guarded + 5 regression pins), 2026-07-28 UNCOMMITTED; T4/embassy weak-pins deferred; a unit cell was pinning the defect itself"
metadata: 
  node_type: memory
  type: project
  originSessionId: a6d0bd03-b577-4959-9a22-6f6262240357
  modified: 2026-07-28T11:53:07.855Z
---

EP-l SELF-CAPTURE class (a captor-selection arm picks the traveller's OWN home court) — **CLOSED 2026-07-28, UNCOMMITTED** in the minifold worktree (claude/composite-r4):

- 5th arm guarded: `src/domain/roads/seaRoads.js` resolveSeaHazard S3 piracy — `captorId` hoisted, `&& captorId !== a.homeId` added; the guarded HOME port contributes nothing and the loop FALLS THROUGH to the far port (mirrors armyOnHop's per-candidate skip, NOT an arm-kill; pinned by the both-ports-embattled unit assert → captor = far port).
- 5 kernel-level pins landed in `tests/domain/roadsGauntlet.test.js` ('gauntlet — THE SELF-CAPTURE GUARD'): one per arm (T1-occupier, T2-besieger, T3-land, T3-embassy-fallback, S3), forced-roll seeds that WOULD capture, + positive-control twins for embassy/S3. Leaf guard cell in `tests/domain/seaRoads.test.js`.
- Reproduced-then-cleared via scratchpad ESM probe (read-only import of the live tree — chosen so the shared tree never sat deliberately red while a concurrent session cycled gates): pre-fix leaf returned captor==='a'===home and the kernel minted `ransom.road.h.h:m.90` captor 'h'; post-fix null/no-ransom, far-port control preserved.
- Gates green 2026-07-28 ~07:43: 4 dormancy goldens + roadsCharter + all roads*/seaRoads* domain suites + sizeBaseline = 184/184; eslint clean; typecheck 0. Sea producer change is dormant by construction (no shipped world sets seaRoadsEnabled).

⚠️ **HAZARD (new instance of the vacuous/self-referential pin family):** `tests/domain/seaRoads.test.js`'s S3 cell was PINNING THE DEFECT — it embattled port 'a' === the mission's homeId, so the "S3 fires" pin was green *because of* the self-capture bug. Re-pointed to the destination port 'b'. When adding a guard, grep existing tests for fixtures that exercise the guarded shape as their happy path.

⚠️ The task brief's gate glob `tests/domain/roads*.test.js` did NOT match `seaRoads*.test.js` — the one file that reds on this fix was outside its own verification list. Never trust a glob to cover a sibling prefix.

**DEFERRED (skeptic-workflow weak-pins, follow-up chip spawned):** T4 host-detention (`roadsKernel.js:610`, captorId = destId) and both embassy venues (`embassyHazard.js:196/201`, captorId = targetId = destId) have NO site-local homeId guard — safe today ONLY via the distributed genesis invariant that no mission is minted with destId === homeId (verified: warTargets/dominionTargets explicit skips, tradeReachable BFS excludes home; release missions never reach 'visiting'). A legacy/corrupt PERSISTED mission with destId === homeId would self-capture via T4/court-suit; the relationshipStates fallback `key.includes(A) && key.includes(B)` even matches when A === B. Cure is one line per site (or a PASS-0 prune of destId===homeId missions) + pins — deliberately deferred, not a bug to re-find. All other captor routes CONFIRMED structurally safe (S1 hostileToHome, armyOnHop, interceptorArmyOnHop, third-party payer, rescue op).

**Why:** closes the class the owner queued as EP-l; the deferral and the defect-pinning-test hazard are exactly the facts a successor would otherwise re-derive at full cost.

**How to apply:** before committing this slice, re-run the 07:43 battery (tree is LIVE — see [[minifold-tree-is-live]]); pathspec-commit ONLY seaRoads.js + the two test files ([[shared-index-commit-race]]); roadsKernel.js's uncommitted EP-l guards belong to the concurrent session's lane. The T4/embassy hardening is its own change with its own pins in the at-ceiling kernel (net-zero code lines).
