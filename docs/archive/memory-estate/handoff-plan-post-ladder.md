---
name: handoff-plan-post-ladder
description: "Owner's 2026-07-12 endgame plan — this AI finishes the ladder + full backlog + telemetry + master-merge/deploy; the NEXT AI does soaks + tuning"
metadata: 
  node_type: memory
  type: project
  originSessionId: 95cca3f6-d313-4fe1-91f6-b4b3a29fb5ef
---

Owner instruction (2026-07-12, via AskUserQuestion — three explicit answers). After the Phase 5.5
mover ladder, THIS AI's remaining scope, in order, BEFORE the owner switches to another AI:

1. **Finish the ladder** — M7 (in flight) → M8 → M9 → M10 → M11, each manager-reviewed + committed
   (the standing per-wave discipline; every implementer dispatch carries model:'opus').
2. **Build the FULL round-21+ backlog** (playbook §7.2 — owner chose "the full round-21+ backlog
   too", NOT just launch-critical): peace treaties / negotiated terms; miracles / divine-agency +
   lived-practice faith (rituals, holy days, named clergy); ruins-as-artifacts (destroyed
   settlements → preserved dossiers + adventure sites); map-as-legibility-surface (fronts /
   embattlement / trade-flow / plague arcs rendered on the realm map); warding-vs-scrying
   info-defense; numeric prices; W2-style voice sidecars (war/faith/trade news); feed retention
   (non-recency major-arc pinning, the 240-cap scale fix); the two temporal structural notes
   (mergeStressorUpsert bornTick; dead wallClockNow pre-stamps); dramatic_campaign preset depth.
   Each its own fenced, gate-green, byte-proven wave.
3. **Product usage TELEMETRY** (owner chose "product usage telemetry" for the analytics work):
   launch instrumentation — event tracking for how DMs use the product (creation, advance, exports,
   AI credits, etc.). Needs a WHAT-to-track + privacy/consent decision (propose a privacy-respecting
   default; the flywheel/privacy caution from the AI-integration discussion applies).
4. **Resolve the parking-lot owner decisions** (playbook §0.6): W5 budget, etc.
5. **MERGE TO MASTER + PUSH** (owner chose "merge to master + push"). ⚠️⚠️ THE HIGHEST-RISK ITEM —
   NOT a simple merge: master carries an independent religion arc + migration chain that COLLIDE
   with the spatial engine (see [[third-lineage-mystifying-ride]]; the 8 prior merge rulings in
   [[reconciliation-decisions]]). Treat as its own careful reviewed reconciliation. Then push.
6. **HANDOFF**: the NEXT AI does the Living Realm checkpoint SOAKS + the everything-on TUNING —
   explicitly NOT this AI. Leave the state ledger (playbook §0.0) + handoff docs PRISTINE so they
   pick up cold.

⚠️ SEQUENCING the owner chose (flagged to them): the master-merge + deploy happen BEFORE the
whole-system checkpoint soak (the next AI's job) — i.e. deploy a code-complete-but-not-holistically-
soaked, freshly-reconciled engine. Owner-chosen, not accidental. Related: [[spatial-engine-direction]],
[[owner-fix-philosophy]], [[product-scope-boundaries]].

**UPDATE 2026-07-13 — the endgame RESHAPED (owner):** the owner CHIPPED items 2/3/4 into separate
background sessions (spawn_task) rather than this session doing them serially: round-21 backlog
(task_9299a763, branch claude/round21-backlog — mostly a PLAN + feed-retention BLOCKED on FP-2
headroom), telemetry (task_fd511d0f, branch usage-telemetry, 6a8bfade — ✅ BUILT + session ENDED,
mergeable), parking-lot (task_b0bde075, branch claude/phase55-parking-lot — M10b PLAN, budget-gated).
This AI's remaining scope: (1) FINISH M11 — M11a pestilence DONE + adversarially reviewed + 3
gate-invisible bugs fixed (commits 82ad676b + 10f22f39); M11b calamity building. (2) CONSOLIDATE the
built work onto review-fixes (the "main tree" = the main worktree): telemetry + M11b + any landable
chip output. (3) **HARDEN then master-merge + push** — owner AskUserQuestion 2026-07-13 chose
"Harden, then merge + push": run the M11a-style adversarial review over the GATE-ONLY movers
(M9a–d, M10a — they never got a per-mover review under the economy policy, and M11a's review just
found 3 real M8-class bugs, so they almost certainly carry the same class), fold fixes, THEN the
cross-lineage master merge + push. The un-hardened master merge was explicitly REJECTED. Deploy +
soaks/tuning remain the NEXT AI's (deploy still un-soaked per the original plan).

**UPDATE 2026-07-13 (evening) — SHARED-TREE CONFLUENCE on review-fixes (verified clean).** The chip
sessions did far more than plan; all merged into review-fixes, my M11a/M11b woven in, ALL GREEN
together (full suite 8348/8348, closure 1,254,886 ≤ 1,255,985 UNRAISED, any-cast 2252):
- **Parking lot RESOLVED (owner-adjudicated, commit 098aaee9 "owner"):** FP-2a landed (715fe7b2,
  −2,448B aiSlice first-paint reclaim) → M10b landed (d082f5d3, LIVING/AUTONOMOUS + capped catch-up,
  **M10 COMPLETE**) fitting under the UNRAISED budget via the reclaim-then-spend path. Also 5.5-K
  freeze-first guard (47ccd6dd) + F24 resolved. So M10b is DONE, not deferred; W5 status TBD.
- **Round-21 W1 shipped** (25003430, voice sidecars — "the crier's voice"); W2 feed-retention still
  BLOCKED on FP-2 headroom.
- **M11 COMPLETE:** M11a (82ad676b + fix 10f22f39, adversarially reviewed) + M11b (62c81a0c, calamity,
  review running). THE M1–M11 LADDER IS DONE.
- Revised remaining scope: (1) fold M11b review findings; (2) CONSOLIDATION now reduced to merging the
  usage-telemetry branch (6a8bfade) — the rest already merged; (3) HARDEN scope EXPANDED to include the
  parallel gate-only work (M10b, FP-2a, round-21 W1) on top of M9a–d/M10a; (4) reconcile + GitHub PR
  (owner: "do a pull request to github" — replaces local merge+push; gh CLI not installed → push +
  compare-URL, Fable red-teams the reconciliation plan first).
