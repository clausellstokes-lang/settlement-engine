---
name: test-ratchet-scope-collapse-sentinel
description: "⭐⭐ The scope-collapse discriminator is MACHINERY in check-test-ratchet.mjs: a dead worker's result-less tests serialise as `pending` and used to surface as `skipped tests grew`. Two free arms — the count disagreement DETECTS, the degenerate clock NAMES. ⚠⚠ compare against numPendingTests + numTodoTests, never numPendingTests alone."
metadata:
  node_type: memory
  type: project
  created: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T03:46:19.005Z
---

# A run that DIED used to wear the skip ceiling's clothes

Built 2026-08-10 into `scripts/check-test-ratchet.mjs`, closing the open question the
census-re-freeze lane left ("whether to build it into the sentinel is a chair call this
lane did not take"). Pinned by three tests in `tests/lint/testRatchet.test.js`.

## The disguise

Vitest's json reporter serialises a **result-less** test as `"pending"`, and
`NON_RUN_STATUSES` counts `pending` as a non-run row. So when four suites' workers
died, **71 tests that never ran** surfaced as `skipped tests grew: 182 > ceiling 105`
— pointing the reader at deferred skips instead of at a collapsed run. `uncollectedOf`
did **not** catch them: those suites were never marked `status: "failed"` (nothing
failed; the worker stopped existing), and that function keys on
`status === 'failed'` with no failing row.

## The two arms — both already in the same report, both free

1. **THE COUNT DISAGREEMENT (detects).** vitest's own counters report what it
   *deliberately* pended; the row census counts every non-run status. They AGREE on a
   healthy run (measured 111 = 111). A result-less row inflates the row count without
   moving the counter, so a positive gap is direct evidence.
   ⚠⚠ **Compare against `numPendingTests + numTodoTests`, NEVER `numPendingTests`
   alone** — vitest counts todos in their own top-level field while `NON_RUN_STATUSES`
   includes `todo`, so the narrow comparison forges a gap out of ordinary `test.todo`
   rows and reds every healthy run that has one. This is a MUTANT-PROVEN trap, not a
   theoretical one (M3 below).
2. **THE DEGENERATE CLOCK (names).** A suite that never ran never gets its own start
   stamp: `startTime === endTime === report.startTime`. ⭐ MEASURED on a healthy run a
   suite's clock sits **549 ms after** the report's, so a fast suite does not reproduce
   the three-way equality. It is an observed serialisation property, **not a documented
   vitest contract** — if it silently stops holding, arm 1 keeps detecting and only the
   naming degrades.

## ⚠⚠ THE CLOCK MAY NEVER REFUSE ALONE — the real corpus refuted the first design

The first spelling let EITHER arm refuse ("a collapse only one arm can see is still a
collapse"). **The first full-suite run killed it**: `tests/security/
customContentLockOrder.postgres.test.js` is
`ROOT_DATABASE_URL ? describe : describe.skip`, so with no local PostgreSQL the whole
suite is a DELIBERATE skip — it never starts, so it carries the degenerate clock **by
construction** while being perfectly honest. vitest counted its row in
`numPendingTests`, so arm 1 correctly stayed silent, and the clock arm alone reddened
the re-freeze naming an innocent suite.

⭐ **A skipped suite and a dead suite are INDISTINGUISHABLE BY CLOCK.** Only the count
disagreement separates them. So the gap is the GATE, the clock is the naming aid, and
the ceiling subtraction is gated on the gap too — otherwise a `describe.skip` suite's
rows get subtracted from the real skip count and quietly weaken the ceiling.
⚠ The lesson generalises: a discriminator that fires on "this never ran" cannot tell
NEVER-RAN-BECAUSE-DEAD from NEVER-RAN-BECAUSE-SKIPPED. Always pair it with a signal
that knows INTENT.

## Two design calls worth keeping

- **The collapse is judged BEFORE the skip ceiling**, not beside it. An arm that only
  adds a second message leaves the misdirecting one on screen.
- **Collapsed rows are SUBTRACTED from the skip figure**, not used to suppress the skip
  arm. A ceiling genuinely breached *on top of* a collapse still reds, on the adjusted
  number. ⚠ The cost: a collapse can mask skip growth up to its own size.

## Receipts

Three mutants, each killed with true exit 1, each by exactly the right pin (restored
from checksummed copies verified with `cmp`): **M1** kill the clock arm → 2 failed
(naming *and* the no-misdirection pin, proving the subtraction is load-bearing);
**M2** kill the gap arm → the honest-clock case failed; **M3** drop the todo term →
the NEGATIVE CONTROL failed. Suite 64/64 true exit 0 after.

⭐ **Backward compatibility is structural, not asserted:** the inherited `reportOf`
fixture emits neither `startTime` nor `numPendingTests`, so both helpers return
`[]`/`null` on all 60+ existing meta-tests and no old fixture changed meaning. When
adding an arm to a heavily-fixtured gate, prefer a discriminator that is *absent* from
the old fixtures over one that must be retrofitted into every one of them.

⚠ Adding the three pins moved the sovereignty-lighting census `titles` 19545 → 19548;
they were placed INSIDE the existing scope-sentinel suite so `suiteTitles` held at 5519.

Related: [[test-timeout-flake-and-phantom-census-class]] ·
[[step12-test-ratchet-landed]] · [[receipt-vacuity-and-shared-ratchet-rules]].
