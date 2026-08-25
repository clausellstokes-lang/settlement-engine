---
name: a-new-test-file-reds-two-censuses-at-landing
description: ⚠⚠ CHAIR ERROR 2026-08-11 — landing a commit that ADDS A NEW TEST FILE reds TWO censuses at once (lighting `files`, and the anchor walker at ceiling 0) unless both are cured IN THE SAME COMMIT
metadata:
  type: feedback
---

**I landed `78d136a1` (four UI display repairs) carrying a NEW test file,
`tests/ui/uiCohortDisplayReaderRepairs.test.jsx`, and shipped TWO reds:**
1. `sovereigntyLightingContract` — `TEST_FILES.length` **2384** vs the frozen
   `CENSUS.files` **2383** (last re-derived at `2d420dfa`). An exact `.toBe()` pin.
2. `negativeAssertionAnchor` — the new file carries **4 un-anchored negatives** against
   a ceiling of **0**. Every new test file starts at ceiling zero.

⚠⚠ **I RE-EARNED THE FOCUSED SUITES AND STOPPED THERE.** The focused runs were green
and the landing looked clean; neither census is reachable from a focused run. **A
manager re-earn is not a gate.** The next lane discovered it at ITS preflight, refused
correctly, and paid a full context to do so.

⭐ **THE RULE: a commit that ADDS a test file must, IN THE SAME COMMIT, (a) re-derive
the lighting census WHOLE — all five figures, never patching `files` — and (b) anchor
every negative assertion in the new file** (`// anchored:` on the comment block's LAST
line, never inline). Both are cheap AT landing and expensive afterwards, because the
second census is SEQUENCED and stops at its first red figure.

⚠ A lane's report saying "I did not re-derive the census" is a HANDOFF, not a
disclaimer — the earlier repair lane wrote exactly that and I caught it; the UI lane
did not mention it and I did not check. **Ask the question rather than waiting to be
told: `git status --porcelain` for `??` under `tests/` is the whole test.**

⭐ THE CHEAPEST CURE ORDER when several lanes are landing: let every lane land, THEN
re-derive the census ONCE covering all of them — sequential re-derivations cost a full
suite run each and each one invalidates the last. The refusing lane proposed exactly
this and it is now the standing sequence.
Related: [[receipt-vacuity-and-shared-ratchet-rules]],
[[negative-anchor-annotation-placement-mechanics]], [[sovereignty-lighting-census-rerecorded-01a81a1e]].
