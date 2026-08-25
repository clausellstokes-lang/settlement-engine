---
created: 2026-08-11
lane: Lane M (TC-5b-i)
commit: 9183d52c
---

# Two test-machinery hazards that both went green while measuring nothing

## 1. A SECOND cancellation guard SUBSUMES the first, and mutants stop dying

In a React effect that awaits an async result, the common pair is a `live`
closure flag cleared in cleanup PLUS a generation counter. **React always runs
cleanup before re-running an effect and before unmount**, so the `live` flag
covers every case the generation counter covers. Measured on TC-5b-i: a mutant
that deleted the generation check entirely (`if (false) return;`) still passed
all 7 hook tests.

**How to apply.** When a packet mandates mechanism X and you also add mechanism
Y "for safety", mutate X away and re-run. If the suite stays green, Y has
disabled X as a guard — delete Y and let X be the single mechanism. Cure used:
cleanup does `generationRef.current += 1` and nothing else; unmount and
supersession become the SAME event. After that, two separate mutants each
killed exactly one test (supersession, unmount).

⚠ Corollary: `act()` (renderHook/rerender wrap in it) FLUSHES effects before
returning, so a render-phase-reset vs effect-based-reset difference is
**invisible** to any assertion reading `result.current`. A test asserting "no
stale frame" cannot distinguish them; say so in the test rather than claiming
the mechanism. The render-phase reset is still correct — production has no act().

## 2. `negativeAssertionAnchor.walker` counts at the `.not.` LINE

`tests/lint/negativeAssertionAnchor.walker.test.js` scans
`not.toContain` / `not.toMatch` / `not.toHaveProperty` (only these three;
`not.toBe`, `not.toEqual`, `not.toHaveBeenCalled` are OUT of scope). A NEW test
file's ceiling is **ZERO**.

The escape hatch is `ANNOTATION_RE = /\/\/\s*anchored:/` matched against the
`.not.` line or **the one immediately above it**. Two ways this bites:

- A negative split across lines (`expect(x, msg)` on one line, `.not.toMatch(...)`
  on the next) is counted at the `.not.` line — an `// anchored:` above the
  `expect(` does NOT count. Collapse to one line, or move the comment down.
- A MULTI-LINE `// anchored:` block only works if its **last** line carries the
  literal `// anchored:`. Continuation lines (`// source holds the...`) do not
  match. Put the prose first and the `// anchored: <reason>` line last.

Both cost a full ~18-minute gate cycle each to discover. Check with
`npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` BEFORE the
wave-end gate — it is seconds, and it names the exact line number.
