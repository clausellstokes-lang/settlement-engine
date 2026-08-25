---
name: heavy-beforeall-hooks-collapse-under-contention
description: ⚠⚠ Heavy `beforeAll` hooks sized on SOLO timings collapse under full-suite contention — five pglite suites pass in isolation and die in the gate; the scope-collapse sentinel is what makes it visible
metadata:
  type: feedback
---

**MEASURED 2026-08-11 on the first full gate after the schema-5 mint.** Five
`tests/security/*.pglite.test.js` suites **FAILED WITHOUT A MEASURABLE TEST** — their
`beforeAll` threw, so every test they own left the census. One of them
(`supportTickets.pglite`) then passed **19/19, exit 0, in ISOLATION**. Same code, same
commit; the only difference is contention.

⭐ **THE ROOT CAUSE IS A SIZING ERROR, NOT A DEFECT:** a heavy `beforeAll` (here: spin up
an in-memory Postgres and apply real DDL) is budgeted against its **SOLO** runtime, and
under full-suite contention it takes many times longer. The schema-5 mint hit the identical
shape hours earlier and cured it there: the observed-shape corpus build measures
**251,002 ms contended against a 300 s budget sized on the 47 s solo figure**. **Same
disease, five more patients.**

⭐⭐ **THE SENTINEL IS WHY THIS IS VISIBLE AT ALL.** ES-5c built the scope-collapse
discriminator precisely for this: *"they either produced ZERO tests or failed as a whole
while every test they enumerated was a SKIP … and a skip ceiling cannot see the
difference."* **Before it, these five would have been counted as SKIPS and the ceiling
could have absorbed them** — coverage silently gone. Its first real full-gate run caught
five suites. ⚠ It is a SEQUENCED census, so it **aborts before per-test reporting** — you
cannot tell from this run whether anything else is red behind it.

**How to apply:** ⛔ **never size a heavy hook's budget from a solo run.** Measure it under
`npm run check`, or set the budget with a large contention multiple. ⚠ When a suite fails
in the gate, **run it in isolation before attributing** — isolation-green plus
gate-red is the contention signature, not a regression. ⛔ And never "fix" it by raising the
SKIP CEILING: a collapsed suite is not a skip, which is the whole point of the sentinel.
Related: [[test-timeout-flake-and-phantom-census-class]],
[[test-ratchet-scope-collapse-sentinel]].
