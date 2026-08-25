---
name: osr-identity-repair-landed-and-growth-wall
description: "⭐⭐ OSR IDENTITY REPAIR IMPLEMENTED + MEASURED (Opus lane, 2026-08-09; COMMITTED @ 6da84cfd on claude/composite-r4, was UNCOMMITTED at base 2340497d): the one canonical dependency-state identity is BUILT and the resolver suite is 92/92; ⚠⚠ the blocked read STILL FAILS gate 2 — it now dies of the ABSTRACT-STATE GROWTH BUDGET (16,385 > 16,384) in ~145-150 s instead of never terminating, so the disease is NO LONGER recomputation-without-growth; ⚠⚠ the cutoff PROJECTION fires on only 3 of 53 functions; ⛔ mutants C and D prove the frame coordinate is UNPINNED by all 92 tests"
metadata:
  type: project
  date: 2026-08-09
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T18:13:02.277Z
---

Opus implementation lane for the AUTHORIZED repair in [[osr-resolver-state-identity-ruling]].
Worktree `.claude/worktrees/minifold`, branch `claude/composite-r4`, base HEAD `2340497d`.
Two files: `scripts/lib/reader-shape-scan.mjs` (+353/−49) and
`tests/lint/readerShapeResolver.test.js` (+65).

**COMMIT STATUS: COMMITTED @ `6da84cfd`** (Sun Aug 9 22:54:05 2026, claude/composite-r4 —
"OSR: the one canonical dependency-state identity — and the disease moves to where a cache
cannot follow"). This paragraph read "Edits are UNCOMMITTED (the manager commits)" until
2026-08-10; the manager did commit, and the sha lived ONLY in the MEMORY.md index hook until
an index compaction dropped it. Recovered from `git log` and anchored here 2026-08-10.
⚠⚠ A landing sha belongs in the topic file the turn it lands — the index is a recall
surface, not storage, and it gets rewritten by other sessions.

## What was built (all in one file, invariant stated in its header)

1. **Frame cells as interned REFERENCES.** `framedBy` / `framedLike` / `frameCellRefOf` /
   `frameStateId`. Every one of the 7 `sentinelFrames.set` origins declares a cell keyed on
   the CALL ENTRY, symbolic summary, recursive signature or getter demand that built it —
   never on contents. An unregistered frame gets a NEGATIVE private cell (fail closed to
   recompute-always). This replaced the four `cacheable = sentinelFrames.size === 0` cache
   disables (`resolveBinding`, `resolveKeyBinding`, `resolveParam`, `resolveParamKey`) with
   `dependencyStateSeen(store, subject)`, a per-epoch gate keyed on
   `frameStateId() × activeCutoffState().id`.
2. **`activeCutoffSignature()`** — a WeakMap memo of `cutoffSignatureOf()` per `activeCutoffs`
   MAP IDENTITY (the map is replaced wholesale, never mutated, so this is exact). All 8 bare
   call sites now use it.
3. **`relevantCutoffProjection(fn)`** — `functionVersionOf` keys on the PROJECTED map.
   Fail-closed: `null` (= full map) unless the whole transitive callee closure is proven
   unable to consult a caller cutoff. Excludes allocations (a local token's `:c<id>` interns
   the FULL signature), `this`, await/yield, generators, recursion, escaped functions, and
   every free-binding read except a no-write binding with a primitive-literal initializer.
4. **Multiplicity consolidated** to `repeatsStaticCallChain` + `closeToManyMultiplicity`;
   all three former spellings now call them and carry `MULTIPLICITY-LAW CALL SITE n of 3`
   comments naming the tests that pin each.
5. **Advisory meter** `maxReadRecomputations` / `maxReadRecomputeWithoutGrowth` /
   `maxReadDependencyStateHits`, plus `cutoffProjectedFunctions` / `fullCutoffFunctions`.

## ⚠⚠ THE MEASURED VERDICT — GATE 2 FAILS, AND THE DISEASE MOVED

Blocked read `src/components/SettlementsPanel.jsx:359:82` (read #3169), driven directly in a
disposable clone over the same **2,074-file / 8,637-origin** corpus:

| | before (bytes identical to `34531b26`) | after |
|---|---|---|
| outcome | >5 min, stopped, NO result | **145.2 s / 150.3 s, budget failure** |
| failure | never terminated | `abstract-state growth steps 16385 > 16384` |
| recomputations | unmetered | 42,971, of which **24,992 produced NO growth** |
| dependency-state memo hits | n/a (memo disabled) | **1,021,098** |
| fixed-point iterations | never reached | 3 |
| tokens / max length | n/a | 1,539 / 487 (far under budget) |

**The read no longer dies of recomputation-without-growth — it dies of GENUINE MONOTONE
GROWTH.** Only the growth-step budget blows; token count and token length are nowhere near
theirs. No cache can fix that. Per the brief's clause this lane STOPPED rather than iterate
into ad-hoc caches; the chair's recorded fallback is scope reduction.

**⚠⚠ The projection barely fires: `cutoffProjectedFunctions: 3` vs `fullCutoffFunctions: 50`.**
Real `factionRename.js`-class helpers allocate, nest closures over captured mutables, or reach
recursion, so the fail-closed proof rejects ~94% of them. P2's measured 543→13 collapse is NOT
reproduced by a sound per-owner projection. Any future widening must bound the arbitrary
initializer resolution a free-binding read drags in (including getters) — that is the recorded
gap, not an oversight.

## ⛔ THE PIN GAP — MUTANTS C AND D ARE BOTH GREEN

Four planted mutants, each run as the full 92-test suite in its own clone:

- **A** `frameCellRefOf ≡ 1` (all frames one cell) → **92/92 GREEN**
- **C** `frameStateId ≡ 0` (frame coordinate erased) → **92/92 GREEN**
- **D** `dependencyStateId ≡ 1` (one global state) → **92/92 GREEN**
- **B** `relevantCutoffProjection ≡ ∅` (everything projects to ⊥) → **3 RED**:
  "cuts off a closed-over mutable binding at each exact helper call", "keeps deferred closure
  fields isolated between helper call sites", and the new "captured-mutable" control.

So the PROJECTION coordinate is pinned and the FRAME coordinate is NOT — no test in the suite
can distinguish it, because every corpus that installs two frames for one function also changes
the cutoffs. The frame key is retained anyway: a FINER key can only cost recomputation, never
produce a wrong answer. Treat "green" here as weak evidence for the gate itself.

## The two new negative controls (resume-order step 5)

`exact-origin non-crossing: a later invocation never reaches an earlier product` and
`captured-mutable: a closed-over binding keeps each call site its own version`. ⚠ BOTH ALSO PASS
ON THE PRISTINE SCANNER — deliberate: they are controls on preserved behaviour, not goldens of a
new one. The captured-mutable one is proven non-vacuous by mutant B.

## Apparatus notes for the next lane

- The measurement rig is `scratchpad/osrfp/{tree,pristine,mutantA..D}` — `git archive HEAD | tar -x`
  plus a SYMLINK to the live worktree's `node_modules` (the main tree's lacks `three`/`pg`).
- The probe driver is clone-only; it adds an `onReadDone` hook to `scanReaders` and caches the
  corpus graph to JSON so re-measurement skips the ~48 s producer execution.
- ⚠ A `setTimeout` watchdog CANNOT fire during a blocked read — the read is synchronous and the
  event loop never yields. Bound it externally.
- Acceptance step 3 (full-tree `--progress` run) was NOT attempted: the ladder is ordered and
  gate 2 failed. No baseline, golden or budget was touched.

Related: [[osr-resolver-state-identity-ruling]] · [[observed-shape-readers-walker-landed]].
