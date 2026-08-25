---
name: osr-schema5-mint-built
description: "⭐⭐⭐ THE SCHEMA-5 MINT IS LANDED (code half `36159389` + genesis `ffc85a90`, 2026-08-11) — the observed-shape gate is GREEN at HEAD; the runbook/pipeline detail below is now history plus the laws that outlive it. Schema 5 = the EXPLAINED-WRITER-FILTERED heuristic-leaf identity: same `<key> on <shape>` spelling, same BYTE-FROZEN detector, output narrowed by two DECLARED post-filters (CR-OSR-FREEZE-6's M6 shape-family union + the new M8/M9 explained-writer exemption). Measured: 2,164/1,499/395 → 2,003/1,413/385, reconciling 1,413 same / 86 gone / 0 new — a PURE SHRINK, so the review ledger carries ZERO issues. ⚠⚠ The pipeline CANNOT be pre-run: frozenAtSha/subjectSha are the subject commit's sha. Proven at throwaway detached pair 3a1ccbb3 + 77b8648c, gate CLI true exit 0, five OSR suites 225/225."
metadata:
  type: project
  date: 2026-08-11
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T18:17:46.997Z
---

**LANDED 2026-08-11:** the commit pair is `36159389` (code half, deliberately gate-red)
+ `ffc85a90` (genesis) on `claude/composite-r4`. The observed-shape gate is GREEN at that
HEAD; the only remaining full-gate red at landing was the owner's golden (SHIFT-2) plus
the pglite contention family under investigation. Everything below is the build record
and the laws that outlive it.

## What schema 5 IS

The heuristic-leaf identity is UNCHANGED — `<key> on <shape>` with a per-identity
multiplicity, minted by `artifactIdentityOf('legacy-leaf', …)`, and
`legacy-reader-shape-scan.mjs` is still byte-frozen to blob `0310fa9f`. What changed is
the PRODUCER: the finding set is the detector's raw output narrowed by two declared
post-filters in `check-observed-shape-readers.mjs`.

    schema 4  a guarded read of a key the GENERATION CORPUS never observed
    schema 5  …and which no DECLARED out-of-corpus writer explains

Because the alphabet did not move, the 4→5 migration is a `predecessorRows`
reconciliation — the same argument as 2→4, not a copy of it. `LEAF_MIGRATION_PREDECESSOR`
= `{4: 2, 5: 4}` is the ONE table that pairs a target with its predecessor schema, and
`targetSchema` is a REQUIRED argument (no default) so no caller can fall into the wrong
migration by omission.

## The five items the mint carried, and what happened to each

1. **M6 family-union post-filter** — the vaulted `m6-vault/m6-filter.patch` applied CLEAN
   at HEAD (+384/−7, `git apply --check` exit 0). Clears **122 reads / 31 identities**.
2. **The two write-shape blindnesses** — became `writeShapeProbesOf` / `writeShapesIn`,
   four spellings: `property`, `quoted`, `shorthand` (incl. inside a conditional spread),
   `token-in-string-literal`. ⚠ The whitespace adjacency in the fourth is LOAD-BEARING:
   without it a plain `'key'` also matches and the two spellings stop being
   distinguishable.
3. **The M8 five-gate router** — split by what each gate can DO. Gate 0 is machine-checked
   every scan; gates 2/3 became the `mechanism` field (TOTAL positive predicate); gate 4
   (open spread) is REFUSED as a basis in source. ⛔ **Gate 1 is deliberately NOT a
   per-run check** — `git log --all -S"<key>:"` can only CLOSE the M8 hypothesis, never
   open it, and HISTORY is the one input no manifest content-addresses. Exported as
   `authoredInputHistoryCommits` for triage lanes.
4. **`neighbourNetwork on settlement`** — discharged BY RULE, not by hand.
   `edgeAnnotations.js` ends with NO row at all and no file banks the identity (was 23
   files + the 2 new reads = **36 reads cleared**).
5. **The M9 save-time-writer exemption** — `EXPLAINED_WRITER_EXEMPTIONS`, one entry,
   shrink-only, class-(a)-refusing, with `assertExplainedWriterEvidence` re-proving the
   named writer still writes the key on every scan.

## The measured numbers (all captured with `$?`)

| | findings | identities | files |
|---|---|---|---|
| committed schema 4 (`1c295cea` freeze) | 2,164 | 1,499 | 395 |
| raw detector at HEAD `133e300f` | 2,161 | 1,496 | 395 |
| after M6 | 2,039 | — | — |
| after M8/M9 = **schema 5** | **2,003** | **1,413** | **385** |

Reconciliation vs the schema-4 predecessor: **same 1,413 / gone 86 / new 0 / increased 0
/ decreased 0**. Zero growth ⇒ `report.issues` is EMPTY ⇒ the ledger has nothing to
discharge. ⭐ **The anti-vacuity floor does NOT move** (resolvedReads 9,238 → 9,240,
totalKeys 6,584, usableShapes 338): unlike the 2→4 mint, 4→5 changes which findings are
REPORTED, not which reads are RESOLVED. Contrast CR-OSR-FREEZE-9's genuine floor
re-derivation — do not expect one here and do not accept one silently.

UNREVIEWED-UI cohort: **53/150/246 (raw) → 51/128/193 (filtered)**, derived THREE ways
that agree exactly (cohortOf of the filtered inventory; 150 − 22 addresses and 246 − 53
reads off the finding arrays; the gate CLI's own `cohortNotice`).

## ⚠⚠ THE PIPELINE CANNOT BE PRE-RUN — plan for it

`frozenAtSha` and `migrationReview.subjectSha` are the SUBJECT COMMIT's sha, and
`validateBaselineHistory` walks `<subjectSha>..HEAD`. So a lane can PROVE the pipeline in
a throwaway detached worktree, but the artifact it produces is bound to the throwaway sha
and is worthless on the real branch. **The chair must run the pipeline between the two
commits.** Runbook: scratchpad `OSR5-RUNBOOK.md`; ledger filler `OSR5-fill-review.mjs`
(lifts all bindings VERBATIM and asserts the twelve-key set); measurement probe
`OSR5-probe.mjs`.

Proven at throwaway detached pair `3a1ccbb3` (code) + `77b8648c` (genesis): every step
exit 0, gate CLI exit 0 after the genesis, five OSR suites **225/225**.

## ⚠ Four mechanics that bit while building this

1. **THE WALKER MUST APPLY THE FILTERS TOO.** `observedShapeReaders.walker.test.js`
   compared the RAW detector output against the frozen inventory. Under schema 5 that
   reports every filtered row as a violation and stays red forever — a disabled guard
   wearing a walker's name. `scanEstateWith` now applies both filters and returns `raw`
   beside them, and the cohort is pinned RAW AND FILTERED so the delta is attributable.
2. **`identityOf` ASSERTS A CANONICAL REPO-RELATIVE PATH.** A filter that mints an
   identity for EVERY finding throws on the walker's planted probes, which live in a temp
   dir. Pre-filter on the KEY and mint the identity only on the clearing branch (which is
   what M6 already did).
3. **`compare`'s stale arm asks the FILESYSTEM.** A gate-mode fixture using the
   traditional `src/probe.js` fictional path reds with "deleted or moved" before any
   assertion about the thing under test. Drive gate mode with a REAL file path.
4. **Schemas 4 and 5 SHARE one envelope validator, and that is the opposite call from
   schema 3's deliberate duplication — for the opposite reason.** Schema 3's shape
   genuinely differs; 4 and 5 are byte-identical envelopes, so two copies would be one
   LIVE law with two homes (the CR-OSR-FREEZE-8 shape). The schema NUMBER is the argument,
   and it is pinned in BOTH directions.
5. **THE NEGATIVE-ANCHOR WALKER CONVICTED A COMMENT — again.** A comment reading
   "SAID AS DISJOINTNESS, NOT AS `not.toContain(exempted)`" spells a scanned matcher and
   so counts as an un-anchored negative at ceiling 0. ⚠ ALWAYS reword the comment, never
   widen the scan ([[negative-anchor-annotation-placement-mechanics]]). ⭐ The cure was
   better than the original anyway: state DISJOINTNESS of the two filters' cleared sets
   (with a non-emptiness liveness anchor) instead of a bare exclusion.
6. **A SEQUENCED CENSUS STOPS MEASURING AT ITS FIRST RED FIGURE.** The test ratchet's
   SCOPE SENTINEL fired on the walker's timeout and never enumerated the not-in-census
   failures behind it; only after the timeout was cured did the anchor-walker red appear.
   Do not read one ratchet run as a complete list of what is wrong.

## ⚠⚠ THE OSR WALKER'S 300 s HOOK BUDGET IS A LATENT FLAKE — MEASURED

`tests/lint/observedShapeReaders.walker.test.js` sized both `beforeAll` budgets at 300 s
against its header's "the corpus build alone is ~47 s". **That 47 s is the SOLO cost.**
Measured 2026-08-11 with the full suite running in parallel — the only condition
`npm run check` ever runs it in:

    buildObservedCorpus()   251,002 ms      ← 84% of the old 300 s budget on its own
    the detector scan        11,675 ms
    the two schema-5 filters    108 ms      ← 0.04% of the total
    top-level beforeAll     ~263,700 ms

It duly timed out at **306,759 ms**, taking all 27 tests out of the census as SKIPS
(`skipped tests grew: 138 > ceiling 111`) — which the test ratchet's SCOPE SENTINEL
correctly refuses as vacuous. ⭐ **The 0.04% figure is the receipt that separates
"exposed" from "caused":** no amount of trimming the added code could have saved it.
Re-sized to 900 s (3.4x the contended cost, so a genuine collapse still reds).

⚠ Generalise: **a hook budget sized against a SOLO measurement is not a budget.** Any
`npm run check` timing claim about this estate must be taken under full-suite contention;
the recorded factor is 4–8x.

## ⚠⚠ SIXTH AND SEVENTH SIGHTINGS: the harness reported a RED gate as "exit code 0"

The base `npm run check` was launched as `(gate-tail …; echo $? > file)`. The harness's
completion notice said **"exit code 0"**; the captured `$?` said **1**. Always wrap in a
subshell that writes `$?` to a file, and read THAT.

Related: [[osr-detector-change-requires-schema-mint]] (why only a mint lands one) ·
[[osr-resolver-state-identity-ruling]] (CR-OSR-FREEZE-6-R2, the ruling that ordered the
consolidation) · [[osr-heuristic-leg-detector-mechanisms]] (M1–M9) ·
[[walker-census-law-machinery]].
