---
name: sovereignty-lighting-census-rerecorded-01a81a1e
description: "⭐⭐ Sovereignty-lighting census RE-RECORDED at 01a81a1e (2026-08-10): 2352/358/1994/19150/5459 → 2381/364/2017/19491/5510. ⚠⚠ THE SEQUENCE HAZARD FIRED A THIRD TIME AND ALL FOUR UNASSERTED FIGURES HAD DRIFTED (+6/+23/+341/+51) — never assume the four are still frozen. ⚠⚠ `parked` MOVED FOR THE FIRST TIME IN NINE WAVES, and the cause is a PRE-EXISTING file: a `test.each([…])` added to tests/lib/proseSeams.test.js at 93e7ed50 parked it and pulled 11 titles OUT of the evidence layer"
metadata: 
  node_type: memory
  type: project
  created: 2026-08-10
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T06:36:22.938Z
---

# The census re-record at 01a81a1e, and what the red window hid

Landed 2026-08-10 by the Opus walker-census lane. Base **2b4ca96f** (the tree the
frozen figures described, re-executed green) → head **01a81a1e**.

| figure | old | new | delta |
|---|---|---|---|
| files | 2352 | 2381 | +29 |
| parked | 358 | 364 | +6 |
| credited | 1994 | 2017 | +23 |
| titles | 19150 | 19491 | +341 |
| suiteTitles | 5459 | 5510 | +51 |

## Why this one matters beyond its numbers

**The sequence hazard fired for the third recorded time, and this run measured
what it hides.** The five figures are asserted in sequence with `files` first, so
while `files` was stale at 2352 vitest never evaluated the other four. All four
had drifted — by +6, +23, +341 and +51. A lane that had patched only `files`
would have banked four wrong numbers and re-greened a census that was measuring
nothing. **Re-derive all five, always.**

## The finding: `parked` broke an eight-wave streak, and not via a new file

Every re-record since SP-C had recorded "PARKED IS UNCHANGED at 358 … earned,
not luck", crediting SP-D's idiom (*loop INSIDE a named test, never generate
tests from a loop*). That streak is over.

Six files newly park, zero unpark (**sets compared by identity, not count** — an
identity swap at constant count passes a count check). Five are among the 29 new
files. The sixth is **`tests/lib/proseSeams.test.js`, which already existed and
was credited**: commit **93e7ed50** added a `test.each([...])` alias battery to
it, and a table-generated title is exactly what door 3's reader cannot recognise
statically. The file parked and took **11 titles and 2 suite titles OUT** of the
evidence layer.

So a title layer can go **down** without any file being deleted. Deliberately
not chased: proseSeams carries no marker and is nobody's declared evidence
address, so parking costs the instrument nothing.

Park reasons for the six (read off `parkReasonsFor`, not guessed): two on
`SUITE_NOT_RUNNING:describe.runIf()`, three on `TEST_CONTEXT_PARAM:test.each()`,
one on `TEST_UNREGISTERED:test`×8 + `SUITE_NOT_STRAIGHT_LINE:describe`.

## How to apply when you next re-record

- **The arithmetic must close in both directions, and that is a check rather than
  a formality**: 24 newly credited − 1 that lost credit = +23; 5 newly parked + that
  same 1 = +6; 23 + 6 = 29. A file-layer delta that fails to reconcile against
  the park layer *is the finding*, not the number.
- **Decompose the title layers per file at both ends** (dump
  `liveTitlesIn`/`liveSuiteTitlesIn` for every credited file and diff). The
  per-file sums reconcile to the aggregates independently, which makes the total
  a second reading instead of a restatement. Here: +282 from 24 newly credited,
  −11 from proseSeams, +70 across 23 amended already-credited files = +341.
- **Check the instrument is byte-identical at both ends before attributing
  anything to the estate.** `git diff <base> <head> --` over the walker,
  `tests/helpers/anchoredNegatives.js` and
  `src/domain/certification/warConvergenceContract.js` was EMPTY here, so no rule
  widened or narrowed. If it is not empty, the deltas are partly the instrument.
- **The +29 belongs to no single wave** — it accrued across eight commits
  (93e7ed50 +1, 6e7acc4d +13, 0ea7ff12 +7, d7ec3885 +4, 1ca709aa +1, 455a29b5 +1,
  5066c34b +1, a45c969d +1) while the ratchet was red. That is the recorded
  A-RED-RATCHET'S-CONTENTS-GROW-INVISIBLY hazard, measured per sha off committed
  objects rather than as one subtraction across a range.

## Receipts

Both halves measured inside integrity-counted `git archive` trees with **this
worktree's own** `node_modules` symlinked (the main tree's lacks `three`/`pg`):
base 6,196 paths in = 6,196 out, walker 33/33 green; head 6,271 in = 6,271 out.
Walker green in the archive and live (33/33 each). Mutants: a planted new test
file reds `files` (2382 vs 2381); a `describe`+`test` appended to an existing
credited file reds `titles` (19492 vs 19491) — the second one matters because the
sequence hazard means the title layer is only ever reached when `files` is right.

## Related

- [[walker-census-law-machinery]] · [[walker-census-split-landed]]
- [[gate-mutex-run-mode-absent-at-old-shas]] — the base half fake-greened with
  exit 0 on the way through this round.
- [[cycle2-lighting-road-recon]] — a red ratchet's contents grow invisibly.

## ⭐ RE-DERIVED AGAIN 2026-08-11 at `c74048e4` (the TRFZ lane) — 19539/5517 → 19545/5519

`files: 2383, parked: 364, credited: 2019, titles: 19545, suiteTitles: 5519`. All five read in
ONE run through the walker's own `parkReasonsFor`/`liveTitlesIn`/`liveSuiteTitlesIn` in a
`git clone --local` archive of `c74048e4`. `c74048e4` adds NO test file, so the whole movement
is two ALREADY-CREDITED files: `tests/pdf/pdfParityFixes.test.js` 12→16 titles / 5→6 suites and
`tests/generators/generationAuthoredIntent.test.js` 7→9 / 2→3. 4+2 = 6 and 1+1 = 2; 364 + 2019 =
2383 closes the file arithmetic.
- NEGATIVE CONTROL: the `tests/` tree of `2a7fb033` materialised OUTSIDE the repo and re-measured
  by the CURRENT instrument read back 2383/364/2019/19539/5517 — the previous row exactly.
- ⚠⚠ SELF-REFERENCE: this walker's own file is **CREDITED (33 titles, 4 suite titles)**, so a
  probe appended to it can weigh itself. The probe substituted the file's OWN COMMITTED bytes
  when building the scan, which is the only reason the reading is clean. Any future probe must
  do the same, or add no `test(`/`describe(` token at all.
- MUTANT, killed with true exit 1: `suiteTitles` 5519→5520 reds the LAST arm of the sequenced
  census, so the figure is asserted rather than decorative.

## ⭐ RE-DERIVED AGAIN 2026-08-11 at `5afe9b2e` (the Opus lighting lane) — 19548/5519 → 19577/5527

`files: 2385, parked: 364, credited: 2021, titles: 19577, suiteTitles: 5527`, base `2d420dfa`.
**DERIVED ONCE ACROSS FOUR LANDINGS** (78d136a1, 31409e36, 1c295eca, 5afe9b2e) rather than once
per landing — that is now the standing sequence, because sequential re-derivations each cost a
full estate read AND each invalidates the one before it. Whole movement = TWO NEW FILES:
`tests/domain/deadReaderRepairs.test.js` 13/4 and `tests/ui/uiCohortDisplayReaderRepairs.test.jsx`
16/4; 13+16 = 29, 4+4 = 8, and 364 + 2021 = 2385 closes.

⭐⭐ **THE "ALREADY-CREDITED FILES ALSO GAIN PINS" SURPRISE IS NOT A TREND — IT IS A COIN FLIP,
AND EXTRAPOLATING IT IS AS WRONG AS IGNORING IT.** The `c74048e4` lane measured +39 where +3 was
predicted because five already-credited files had quietly gained pins. This lane measured
**ZERO amended already-credited files**. The one file MODIFIED in the window,
`tests/lint/observedShapeReaders.walker.test.js`, reads **26/4 at BOTH ends** — its change was
prose plus one numeric literal inside an existing pin. A modified file can contribute exactly
nothing. **Derive; never predict in either direction.**

⭐ **READ THE TITLE LAYER WITH A SECOND INSTRUMENT.** `vitest list <files>` (under the gate mutex)
enumerates the real runner's registrations: 13 and 16 rows, 4 and 4 distinct suite paths — the
classifier's +29/+8 confirmed by something sharing none of its code. Cheap for a handful of files
and it converts the aggregate from a restatement into a genuine second reading.

⭐ **THE PROBE SHAPE THAT SIDESTEPS SELF-REFERENCE ENTIRELY** (better than substituting committed
bytes): generate a module from the walker's **classifier half only** — everything above the first
top-level `describe(` — dropping the two runner-only imports, re-pointing the `../../src/`
specifiers, and making `ROOT` an env var. Nothing in `tests/` is touched, so the walker cannot
weigh itself and the scan root becomes configurable, which is what makes the negative control
possible with the SAME instrument. Place it at the REPO ROOT (not the scratchpad) so `espree`
resolves; `.mjs` is never matched by the `\.test\.(js|jsx)$` filter. Delete it before any gate.

NEGATIVE CONTROL, both halves: the `tests/` tree of `2d420dfa` materialised outside the repo
(2,486 tracked paths in = 2,486 out) and re-measured by the CURRENT classifier read back
**2383/364/2019/19548/5519**, the recorded row exactly; and `git diff 2d420dfa 5afe9b2e --` over
the walker, `tests/helpers/anchoredNegatives.js`, `warConvergenceContract.js` and
`simulationRules.js` is EMPTY. Run BOTH: the structural one is free and the executed one catches
what a byte-diff cannot.

WHICH BYTES: `git status` empty AND `git diff HEAD -- tests/` empty at measurement time, so the
live read and the committed read were the SAME read — state that receipt rather than assuming it.
MUTANT, killed at true exit 1: `suiteTitles` 5527→5528.
