---
name: loop-registered-tests-are-invisible-to-the-census
description: ⚠⚠ Tests registered INSIDE a `for` loop mint NO title — a suite can be fully written, fully passing, and PARKED (zero live titles) in the lighting census
metadata:
  type: feedback
---

**MEASURED 2026-08-11 (TC-5a).** A brand-new suite came back **PARKED — zero live titles
against THIRTY-FOUR real, passing tests** — because four of its `describe` blocks
registered their tests inside `for` LOOPS rather than straight-line. It was the ONLY parked
file among the nine `domain/townCartography` suites.

**The mechanism: the census classifier counts LITERAL `it(`/`describe(` TITLES in source
text.** A loop-registered test has no literal title to count, so the suite is fully
written, fully passing, and **INVISIBLE to the census** — it silently joins `parked`
instead of `credited`.

⚠⚠ **Why this is worse than a miscount: `parked` and `credited` both feed `files`, so the
arithmetic still CLOSES.** Nothing reds. The suite simply stops contributing coverage the
census believes it has, and a later `credited→parked` flip on an already-banked file reds
a census nobody can explain (that exact confusion cost a lane a parked-set diff over a
1,944-file window earlier the same day).

**How to apply:** after adding any test file, **check it landed in `credited`, not
`parked`** before folding the census. Cure is mechanical: **hoist the loop into a
module-scope helper** so each case registers with a literal title — TC-5a did this with
the test count unchanged at 34, and the file moved straight into `credited`.
⭐ Corollary: `test.each()` parks a file the same way — that is how
`tests/lib/roadNetworkIndex.test.js` flipped under an unrelated landing.
Related: [[a-new-test-file-reds-two-censuses-at-landing]],
[[landing-discipline-collides-with-path-reservation]].
