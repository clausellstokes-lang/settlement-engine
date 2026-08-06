---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-05
  type: judgment+hazard
  scope: tests/lint/sovereigntyLightingContract.walker.test.js — door 3
  commit: "arc 8a4b0aef..d48224e3 (CLOSED at the cap), branch claude/composite-r4"
  supersedes: "the three earlier door-3 \"fail-closed reach\" claims (8a4b0aef, 35b7bec7, 7503b00d)"
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-05T23:27:18.694Z
---

# Door 3 is a POLARITY, not a reach — and three cuts of spelling repairs proved why

## The fact

`tests/lint/sovereigntyLightingContract.walker.test.js` door 3 now credits a suite ONLY when
its line resolves, on its own logical line and at its own line start, to a head the CLOSED
grammar `RUNNING_SUITE_HEAD` positively recognises (bare `describe(`/`suite(`, or a tightly
dotted chain drawn from `RUNNING_SUITE_MODIFIERS`). Every other line carrying a suite-opener
token PARKS the file. Admission (`SUITE_TOKEN_LINE`) is deliberately generous because
generosity now costs marker-carrying rights instead of buying credit.

The claim in the header is therefore about DIRECTION, not coverage: it cannot be falsified by
inventing a spelling (an unrecognised spelling is a refusal), only by finding a suite the
walker CREDITS that vitest does not RUN.

## Why (three failed cuts, each falsified within hours)

Cut 1 (8a4b0aef) required one line to match both an opener AND a literal dotted
`.skip`/`.todo`/`.failing`. Cut 2 (35b7bec7) fixed the allowlist but read PHYSICAL lines.
Cut 3 (7503b00d) welded dangling heads — but `SUITE_OPENER` and `DANGLING_SUITE_HEAD` both
spelled members `\[[^\]\n]*\]`, so **the detector and the repair written to compensate for the
detector were blind through the SAME character class**: `describe[` ending a line matched
neither, and ten more spellings walked through, nine of them live forgeries, eight eslint-clean.

Each cut stated what the detector could SEE. That shape of claim is refuted by inventing a
spelling, so the forgery game was unwinnable until the claim changed shape.

## How to apply

- **A remedy that closes a family in the OLD architecture may be DEAD in the new one.** The
  verifier's executed remedy (widen the dangling tail to accept an unterminated bracket) was
  planted and the whole battery stayed GREEN — under the polarity `describe[` parks at
  ADMISSION. Adopting it would have shipped a guard that cannot fire. **Verify every proposed
  remedy by running it as a mutant, even when a trusted verifier executed it themselves.**
- **A residual named "prevalence zero" is a measurement, and it was WRONG.** The alias route
  had prevalence ONE: `tests/security/customContentLockOrder.postgres.test.js:44` spells
  `const describeWithPostgres = ROOT_DATABASE_URL ? describe : describe.skip;` and its one
  title was CREDITED while the suite is `describe.skip` without `ROOT_DATABASE_URL`. Closed by
  `SUITE_VALUE_BOUND` at the BINDING (the call site carries no suite word). Census 92 -> 93.
- **Two guards over one job cannot be pinned separately.** `RUNNING_SUITE_HEAD`'s tightness and
  `chainModifiers`' dot-split both refuse computed/space-broken members; opening either alone
  ran 21 passed. Only the JOINT mutant reds. Named in the code as a pair rather than left to
  look individually load-bearing.
- **Prose is the enemy of any non-anchored detector.** `SUITE_VALUE_BOUND` and
  `SUITE_TOKEN_MIDLINE` are the only arms reading a line anywhere rather than at its start;
  without `COMMENT_LINE` a header sentence ending `...in the domain suite. This` parks a live
  file. Three benign-shape pins guard this (prose, multi-line vitest import, RuleTester binding).
- Re-serialising `scripts/mutation-coverage-manifest.json` with `json.dumps(indent=2)`
  **reformats 1,951 lines**. Splice the rationale into the RAW text and re-parse to check.

## THE ARC CLOSE (2026-08-06, cap @ d48224e3 — verifier PASS)

After eleven rounds the arc CLOSED at the ADDRESS CAP: evidence = TEST titles only
(never suite titles — the layer split, battery 130) in THREE DECLARED files
(`EVIDENCE_FILE_ADDRESSES`: sovereigntyMarketStageWr10w, sovereigntyWaveCloseIntegration,
espionageDistantSourceEs4 — the last UNBUILT by declaration). Door 0 = the cap; door 4
honestly retired as SUBSUMED (pinned as structural fact, not a fake red). The oracle
(`npx vitest list --json=<path>`) is RECORDED with the reconciliation method, not landed
as a test (measured: it exceeds the walker family runtime and would spawn a second vitest
lane). Verifier reproduced all three closures on disk, both directions.

**THE RECORDED LIMITATIONS (the honest boundary — never re-open as cuts):**
- ⚠⚠ THE GENERATOR-BODY FORGERY: `it('<MARKER>', function* () { expect(1).toBe(2) })`
  is credited, collected by the oracle, and PASSES under vitest 4.1.8 while not one body
  statement runs. NOT oracle-detectable. Repair shape if ever wanted: refuse
  `.generator === true` in argFormAccepts + clause (10).
- ⚠⚠ THE NON-ASSERTING BODY (the likely accidental form): `it('<MARKER>', () => {})`
  lights the wave. The instrument proves a pin RUNS; it has never proven a pin ASSERTS.
  No static reader can close this. The largest hole left under the cap — by design.
- The a5 file-pattern half is shut by a one-time --filesOnly measurement (2314), not a
  landed assertion.
- Two owed doc edits (ES.md:1467, SP.md:515/:771 — clauses (0) declared address + (0b)
  test-not-suite) + the stale manifest rationale (sovereignty-lighting-condition-executed-
  2026-08-05 records a plant that under the cap must be at a declared address) — QUEUED
  into cycle 4 step 0.

## Receipts

Walker 21 passed; walker+manifest+sizeBaseline 32 passed; strict 1313/1313 exit 0; per-file
eslint exit 0; zero NULs. Wave-end attribution vs a `git archive` of 7503b00d: **0 rows
passed@base -> failed@live**, live failing set a strict SUBSET of base (53 of 68; the 15
base-only failures are the archive having no `.git`), whole-eslint row identity IDENTICAL
(22 rows, 0 differences). Estate read: 2,314 files, 92 -> 93 parked, 27,493 -> 27,492 titles,
ONE differing row. Eleven mutants executed, each restored cmp-identical.
