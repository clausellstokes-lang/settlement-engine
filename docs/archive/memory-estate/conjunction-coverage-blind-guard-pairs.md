---
name: conjunction-coverage-blind-guard-pairs
description: "⚠️ TWO guards proved by ONE fixture prove only their CONJUNCTION: if the motivating fixture trips both, deleting either — or BOTH — stays green. Cure = one fixture per guard, each clean under the other, plus a specificity control"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T23:52:29.334Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

`nounPhrase()` in `src/domain/simulationSpine.js` — the chokepoint every noun slot in the spine draws through — refuses a candidate for two INDEPENDENT reasons:

```js
if (trimmed.length > MAX_PHRASE_CHARS) return null;   // the length cap
if (/[.!?]\s/.test(trimmed))          return null;   // a sentence ended inside it
```

Deleting **both** left every assertion in the estate green. Executed with both lines removed: `Tests 3 failed | 56 passed` — and the 3 failures were the pins added to catch exactly this. All 56 pre-existing assertions passed with the guard gone entirely.

**Why it was blind:** the fixture that motivated the guard was the live-site vignette, and that vignette is both LONG and MULTI-SENTENCE. It trips both refusals at once, so it proves their conjunction and neither separately — with either half deleted the other still catches it. A test whose name sounds like the missing coverage can also be irrelevant: "the vignette is refused at ANY length" never consults `nounPhrase` at all, because `recentConflict` was removed as an arm entirely, so it proves the ARM's absence.

**How to apply — for any function with 2+ independent guards:**
1. One fixture per guard, each deliberately CLEAN under the other. Here: a 99-char terminator-free label (only the cap can refuse it) and a 38-char two-sentence label (only the terminator check can). Deleting guard A reds only guard A's pin.
2. A **control on the controls** — assert each fixture sits on the correct side of BOTH thresholds, so a fixture that drifts across the other guard's line says so instead of silently proving nothing.
3. A **specificity control** — a candidate clean on every count must still get through, or a guard that refuses everything satisfies all the refusal pins.
4. Re-prove at a SECOND call site when the guard is a shared chokepoint, so a per-rung patch cannot satisfy the suite.
5. Verify by planting each deletion SEPARATELY and then together — three mutants, not one.

Same session, same shape at a different function: `joinPhrases`' conjunction fix needed BOTH an under-correction mutant (bare "and" always → 5 red) and an OVER-correction mutant (serial comma always → 6 red, caught by the specificity control). Bracket both directions; a one-sided mutant leaves the over-correction free.

Registered: sweep plant #66 "prose/spine splice guard sentence-break check deleted", manifest entry for `tests/domain/simulationSpine.test.js` upgraded `uncovered → mutation` (uncoveredBaseline 199 → 198) @ `d5660a7b`.
