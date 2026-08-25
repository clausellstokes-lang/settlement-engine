---
name: golden-branch-firstpaint-budget-overage
description: RESOLVED 2026-07-14 (FP-G1 stressorsCore reclaim; budget then RATCHETED DOWN to 1,216,350) — kept for the hazard CLASS. Was a pre-existing first-paint budget red on the golden track — golden@27f15da9 builds to 1,266,749 B (10,764 over the 1,255,985 constitutional budget), undetected because the budget test only runs when dist/ exists and golden's vitest census skipped it. Surfaced by the golden-merge full gate. Owner-gated to resolve (reclaim vs raise). Blocks a green gate / master-merge.
metadata:
  node_type: memory
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

## The fact (2026-07-14, discovered during the GOLDEN MERGE SEQUENCE)

The golden track (`claude/review-fix-golden-track`) was **already ~10.8 KB OVER the first-paint
byte budget BEFORE the golden merge** — a pre-existing G-track regression its own gate never caught.

- Built golden @27f15da9 (pre-merge) in a temp worktree → `tests/build/vendorPdfLazy.test.js`
  first-paint static closure = **1,266,749 B**, budget `CLOSURE_BUDGET_BYTES = 1,255,985`
  → **10,764 B over**.
- The merged+preset-lit tree (after steps 1-3: merge 3726753e / repairs 2128be56 / presets
  28d2f4e5 / regen 93c9482a) = **1,267,928 B → 11,943 over**. So the merge + preset lighting added
  only **~1,179 B**; the dominant overage (10,764 B) is PRE-EXISTING golden debt.

## WHY it went undetected on golden (the hazard mechanism)

`tests/build/vendorPdfLazy.test.js`'s byte-budget test **only runs when `dist/` exists** (it reads
built assets). It is gated in `npm run check` behind `verify:dist` (which builds first). The golden
track's verification during G1a-G2R was `vitest run` / targeted runs **without a fresh build**, so
the budget test was SILENTLY SKIPPED — the G-track's eager first-paint growth (new domain modules +
applyWorldPulse growth + the event path) accumulated ~10.8 KB unmeasured. Same class as the
applyWorldPulse max-lines miss: a gate that never actually executed.

**Lesson:** to trust a "golden gate green" claim, confirm it ran `npm run check` (build + verify:dist),
not just `vitest run`. Dist-gated build contracts (byte budget, chunk-absence) are invisible to a
build-less test run.

## WHERE the bloat lives (why the sanctioned microtrim can't close it)

Closure chunk breakdown (golden): index 556,898 · data 363,750 · engine-core 122,188 · vendor-react
193,160 · vendor-state 17,031 · kernel 9,048 · vendor-icons 4,674. The bloat is in **index (the app-UI
spine) + the synchronous eager domain event path** (settlementSlice/campaign* statically import
applyEvent/undoEvent/mutate/previewEvent/eventPipeline/etc. — used SYNCHRONOUSLY, so not trivially
lazy-loadable). `loadEngine()` already lazy-loads only the generator pipeline + prng. The chunking
ARCHITECTURE is healthy (the "engine chunk ABSENT from first-paint" contract PASSES) — it is purely
the byte TOTAL that's exceeded. So the prompt's sanctioned "FP-2a loadEngine dep-import on a sole heavy
dep" (meant for a ~100 B preset offset) provably cannot recover ~12 KB; there is no single fat lazy-able
dep. A real reclaim would restructure the synchronous event path or defer first-paint UI (owner-gated
UX) — or raise the budget (owner-gated; the prompt forbids touching CLOSURE_BUDGET_BYTES).

## Status / what's owed

- The GOLDEN MERGE SEQUENCE (steps 1-3) is COMPLETE + verified: full `npm run check` is GREEN
  EXCEPT this one byte-budget assertion. Full suite 792 files / 8,785 tests / 0 failures; generator
  golden 187/187 shift; any-cast 2,248 = merged baseline; all six regen surfaces green.
- OWNER-GATED DECISION NEEDED before the gate is green / before master-merge: (a) commission a
  first-paint reclaim wave (restructure eager domain path and/or lazy-load first-paint UI — needs a
  which-features call), or (b) raise CLOSURE_BUDGET_BYTES to absorb the G-track's legitimate
  first-paint cost (a constitutional/ratchet change — owner-only), or (c) accept the red as a tracked
  separate workstream. NOT self-ruled.
- This is a **master-merge blocker** (a red gate blocks the high-risk master reconciliation in the
  handoff plan).

## RESOLUTION (2026-07-14, same session)
FP-G1 CLEARED it: the merge added ZERO eager modules; the reclaim found the real seam (four light
consumers of stressors.js dragging the heavy evaluation machinery into first paint) and split
stressorsCore.js out as a light leaf (−51,655 B). Closure 1,267,928 → 1,216,273; the constitutional
budget was then RATCHETED DOWN 1,255,985 → 1,216,350 @ d33c8ff8. The DURABLE LESSON is the class,
not the instance: **build-less wave batteries silently skip the dist contracts** (the budget test
no-ops without dist/), so a branch can accumulate eager debt invisibly and a merge-time red may be
INHERITED — diagnose provenance (zero-new-eager check) before blaming the merge.
