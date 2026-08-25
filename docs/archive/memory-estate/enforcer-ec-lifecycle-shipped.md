---
name: ""
metadata:
  node_type: memory
  title: "ENFORCER E-C shipped — the lifecycle round-trip walker (bar 12), tests/store/lifecycleRoundTrip.test.js"
  date: 2026-07-21
  tags:
    - enforcer-tranche-2
    - E-C
    - state-lifecycle
    - standing-machinery
    - not-folded
  branch: claude/e-lifecycle
  tip: 31a1e2a6
  base: b339e178
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T07:17:45.146Z
---

## What shipped (ONE commit 31a1e2a6 on claude/e-lifecycle, base b339e178, NOT folded/pushed)
`tests/store/lifecycleRoundTrip.test.js` (758 lines, 22 tests) — the A+ bar-12 standing
enforcer (spec: THE_APLUS_EXECUTION_ARCHITECTURE.md §E-C, doc lives on review-fixes-2026-07-08,
read via `git show 5998f202:docs/...`). Zero src bytes, eager Δ 0. Gate at commit:
domain-strict 0 · tsc full 0 · eslint 0 · walker 22/22 · NUL 0/40097 bytes.

## The standing contract — MAINTAIN, DON'T BYPASS
- **Registry-walker (Pattern 2)**: frozen manifests for campaign record (per-key
  `migrate` + `undo` POLICIES that the walkers consume), worldState base/conditional/
  scalar-gate, save campaignState, mapState v2, local envelope, DB read+writer columns,
  partialize keys, SESSION_ONLY_FAMILIES. Exact-set both directions (unregistered new
  family AND stale ghost row red). A new persisted family ⇒ register with policies —
  registration itself buys undo/backfill coverage; never widen a scan to silence a red.
- **Orphaned-write guard**: settlements columns written by the client must be selected
  by a read path or sit in WRITER_ONLY_EXEMPT with a reason (only `user_id` today).
- Teeth were PROVEN by planted mutations (orphan guard, undo policy flip, dropped
  registry row → reds two guards), then reverted.

## Durable corrections + hazards learned
- ⚠️ **"Pulse undo swaps worldState only" is IMPRECISE** (appears in vision-vb memory +
  campaignLetterLifecycle.test.js header). Verified from src + pinned by the walker:
  undoLastPulse restores worldState + regionalGraph + wizardNews + member
  settlement/campaignState + the live active view; it deliberately does NOT touch
  mapState / lastReadTick / flagsSeen / name / collapsed; updatedAt/timestamp/editedAt
  are wall-clock stamps. The V-2 assertions themselves remain correct.
- ⚠️ **saves.js scan anchors**: the walker anchors on `const row = {\n` (newline —
  mutationRow's empty `const row = {};` sits EARLIER and hijacks a bare indexOf; this
  bit during the build and the honesty check caught it). If saves.js restructures,
  re-anchor the walker; its throw messages say so.
- **Every round-trip landed byte-exact on first run** — no real lifecycle gap exists at
  tip b339e178 (ensureWorldState/migrateCampaign/ensureRegionalGraph/ensureWizardNewsFeed/
  normalizeSettlement are all true fixpoints; local saves list is a byte-fixpoint).
- vitest runs fine FROM a worktree root (the `.claude/worktrees/**` exclude only bites
  when running from the main tree). lint-staged `eslint --fix` ran on commit and changed
  0 bytes (committed == verified, checked).
- Generic gotcha: prose like `ensure*/normalize` inside a block comment terminates the
  comment (`*/`) — vite parse error at collection time.
