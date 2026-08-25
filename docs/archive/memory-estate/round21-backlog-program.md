---
name: round21-backlog-program
description: "The round-21+ backlog wave-program: branch claude/round21-backlog off review-fixes@5ea117ec, plan doc docs/PHASE55_ROUND21_BACKLOG_PLAN.md, budget stays lazy/budget-free, voice sidecars first"
metadata:
  node_type: memory
  type: project
  originSessionId: 9ed5e244-c596-4b95-97fb-6ace73f0f205
---

Opened 2026-07-13 (Opus 4.8 main loop, owner-directed) to build the playbook §7.2 round-21+ backlog
(launch-content + legibility features frozen out of spatial-engine v1). Wave program per the
wave-program skill.

- **Branch:** `claude/round21-backlog`, a CHILD of `review-fixes-2026-07-08` @ `5ea117ec` (the spatial
  tip is checked out in the owner's MAIN dir `/Users/cstokes/Desktop/settlement-engine`, so it can't be
  used in a second worktree — hence the child branch; merge/ff into review-fixes later, owner-gated).
- **Plan doc (source of truth):** `docs/PHASE55_ROUND21_BACKLOG_PLAN.md` (committed `a85db087`). Live
  Progress blockquote reconstructs program state.
- **State at open:** mover ladder at M10a; **M10b** (living/autonomous, +86B eager) and **M11**
  (pestilence + calamity) still UNBUILT; first-paint closure 1,255,965 / ratchet 1,255,985 = **20B eager
  headroom**; any-cast 2252.

**Owner triage calls (2026-07-13 session, each vetoable):** first-wave pick DELEGATED to me → **voice
sidecars** for war/faith/trade news; **budget posture = lazy/budget-free ONLY** → numeric prices,
map-as-legibility, and M10b are PARKED; base = the child branch above.

**Wave 1 SHIPPED + MERGED to review-fixes-2026-07-08 @ 0e30b8b2 (2026-07-13).** Voice sidecars: a
byte-inert display read-model `src/domain/display/newsVoice.js` (zero imports, FNV-1a variant,
impactKind-primary categorization, 57 lines) + `WizardNewsPanel` wiring (was 25003430 on
claude/round21-backlog). Merged CLEAN (zero file overlap with M11a); merged-tree full gate GREEN
(8,308 tests / 722 files, verify:dist 108/108, closure under budget, typecheck/lint/build green).
NOT pushed (owner-gated). The pre-existing env flake `tests/property/pipeline.property.test.js`
seed-sensitivity times out at 20s under high machine load (CONFIRMED identical on base 5ea117ec) —
ignore under load; it passed in the merge gate.

**⚠️ SHARED-TREE FACT: review-fixes advanced under me — M11a PESTILENCE landed via a parallel session**
(82ad676b + 10f22f39-FIX, files src/domain/spatial/pestilence.js + worldPulse/pestilenceKernel.js etc.).
So the mover ladder progressed: **M11a (pestilence) is now on review-fixes; M11b (calamity) still
UNBUILT** — ruins-as-artifacts still blocked on M11b. The docs + Wave 1 merged on top at 0e30b8b2.
A full NEXT-STEPS handoff is now in-repo at docs/PHASE55_ROUND21_BACKLOG_PLAN.md §"NEXT STEPS".

**BUDGET PATH RULED (parallel session, 2026-07-13): FP-2-first, NO raise.** The owner chose to reclaim
first-paint headroom via FP-2 (store-slice split), not a CLOSURE_BUDGET_BYTES bump. So the parked eager
items + M10b (CAP=26) unblock behind FP-2's reclaim, tracked on the SIBLING branch
`claude/phase55-parking-lot` (4 commits off 5ea117ec, unmerged) — reconcile with it before any eager
round-21 wave. See [[parking-lot-adjudication-2026-07-13]].

**Wave 2 FEED RETENTION — BUILT + VALIDATED but BLOCKED on FP-2 (pending branch `claude/round21-w2-feed-retention`
@ 2f4f7b58, off round21-backlog).** Arc-aware 240-cap: preserves the recency window + rescues orphaned
major-arc HEADS that recency would flush. seasonsMiniSoak FIXED, goldens byte-identical (feeds <240 →
no-op), feedDistribution re-baselined, sim 47/47. ⚠️ +363B EAGER: `src/domain/region/wizardNews.js` is
statically store-imported (campaignSlice.js:34, campaignPulseHelpers.js:10-13) → capEntries lands in the
eager index chunk (closure 1,255,965→1,256,348, over the 1,255,985 ratchet). Owner-gated to land — after
FP-2 reclaim or an owner raise. **KEY BUDGET FINDING: "budget-free" ≠ engine-touching. Only LAZY DISPLAY
additions (voice sidecars, numeric-prices read-model) + byte-neutral cleanups are truly budget-free; any
new engine code (feed/belief/rumor/warding) is EAGER and FP-2-gated.** **DESIGN HAZARD (feed retention):
under autoresolve `major` significance is OVER-ASSIGNED (~87% of entries), so naive "pin every major-arc
entry" lets high-volume churn (e.g. 89 crime entries) evict low-volume significant markers (the harvest);
retention MUST pin by ARC HEAD (one slot per story), not by entry.

**Why:** the 20B budget wall is the dominant constraint — any UI-eager backlog item needs an
owner-ratified budget raise (same gate M10b/W5 are parked on), so the program leads with lazy/byte-inert
wins. Voice sidecars follow the W2 display-sidecar pattern ([[owner-fix-philosophy]] model split:
architect spec → Opus implementer → manager gate-verify).

**How to apply:** to resume, read the plan doc's Progress blockquote + `git log claude/round21-backlog`.
Wave 1 = new module `src/domain/display/newsVoice.js` (byte-inert display read-model) + WizardNewsPanel
wiring; the feed engine `src/domain/region/wizardNews.js` (MAX_ENTRIES=240) is the surface for BOTH the
voice sidecars and the separate feed-retention item. Budget-gated + M11-blocked items are queued in the
plan doc's ledgers. Do NOT push/deploy/master-merge without fresh owner OK.

Related: [[handoff-plan-post-ladder]], [[phase55-review-and-fix-r1]], [[spatial-engine-direction]],
[[analytics-seam-architecture]] (the usage-telemetry sibling workstream).
