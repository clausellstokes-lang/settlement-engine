---
name: dead-reader-repairs-landed-and-two-refusals
description: "⭐⭐ THE DOMAIN-SIDE class-(a) repair lane (2026-08-11, Opus, HEAD e429a4e8): 3 clusters REPAIRED reader-side (herald `__` markers ×5 sites, singular `evidenceId` ×3, `title on currentTensions` ×3) — 11 mutants ALL RED, goldens GREEN so NO same-seed shift, observed-shape shrinks by EXACTLY 7 rows; and 2 clusters REFUSED with reusable reasoning. ⚠⚠ THE SHARPEST NEW TEST: writerlessness alone does NOT license deleting a `__`-prefixed marker — ask whether THE DESIGNED CALLER EXISTS AND CHOSE OTHERWISE. ⚠⚠ `dots`/`notability` are an INSTRUMENT FALSE POSITIVE — the writer is the AUTHOR, not the generator."
metadata:
  type: project
  date: 2026-08-11
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T06:18:12.478Z
---

Follows [[osr-171-growth-rows-triaged]] and [[ui-cohort-triaged-31-true-positives]], and
extends the `decreed` precedent landed in `78d136a1`. EDITS ONLY — the chair commits.

## ⭐⭐ THE NEW TEST FOR A `__`-PREFIXED MARKER

The `decreed` deletion rested on a CLOSED WHITELIST (`normalizeStressor` does not spread
its input, so a stressor CANNOT carry the key). **That argument does not transfer to a
`__`-prefixed marker**, because such a key is precisely what a caller attaches to a
WRAPPER object at the call site — nothing persisted, no shape widened. So "unwritten" and
even "unwritable through the constructor" both fail to settle it.

**The test that DOES settle it: does the designed caller exist, and what did it choose?**
For `__adjudicationPending` / `__resolution` / `__forecast`, `buildHeraldFeed`
(`components/map/heraldFeed.js:200-222`) builds exactly the wrapper records the markers
were designed for (`{ ...stressor, stressor, headline }`) and files emerging ones to
divination — **through `lifecycleStage`, never through the marker**. The capability is not
missing; it ships structurally, and `toHeraldItem`'s `forced` parameter is the second live
spelling. Deleted all 5 sites (heraldRouting.js `isPendingDecision`/`isResolution`/
`isEmergingForecast`; realmItemReadModel.js `explicitEmergingPhase`/`resolutionStateOf`).
⚠ `isPendingDecision` lost its WHOLE second disjunct — every term was gated behind the
marker, so the surviving `proposalPayload` guard was unreachable.

## The other two repairs

- **singular `evidenceId` ×3** (`warRulingsNews.js:249`, `warCoalitionEvidence.js:80`,
  `sovereigntyNews.js:384`) — DELETED, not re-pointed at the plural. `evidenceIds` is a
  different contract (an array on negotiation-picture / provisioning-record shapes) that
  never travels on these rows; the singular sits BETWEEN `sourceEventId` and `id` in an
  id-resolution chain, which makes it an id-synonym guess, not `evidenceIds[0]`.
  `git log --all -S"evidenceId:"` is EMPTY — it was never written on any branch.
  ⚠ The three chains are NOT structurally identical: dead-arm counts are 2 / 1 / 3.
  Only `evidenceId` was removed; the siblings are DEFERRED (recorded in the queue row).
- **`title on currentTensions` ×3** (`dailyLifeLogic.js:140`, `aiLayer.js:175`,
  `siegeCapability.js:44`) — two are GENERATION-side, so byte-identity was the claim that
  mattered and it was MEASURED (goldens green). A tension carries exactly
  `{type, description, factions, lastingEffects, plotHooks, severity}`.
  ⚠⚠ **DISTINGUISH FROM THE `conflicts` LINE DIRECTLY ABOVE IT IN THE SAME TWO FILES** —
  those dead-looking arms ARE documented legacy-shape tolerance and were left alone.
  `title` is not even among the tolerance spellings `historyBeats.js:74` declares
  (label/name/text); that is what makes it stale rather than deliberate.

## ⛔⛔ TWO REFUSALS — both reusable

- **`dots` / `notability` (`disposition.js:91-93`) = AN INSTRUMENT FALSE POSITIVE.** The
  premise "reader with no writer" is wrong at the level that matters: **the writer is the
  AUTHOR/IMPORTER, not the generator.** Both are declared SimNpc schema fields
  (`settlement.schema.js:433,439`); `npcVerdictApply.RELINQUISHED_FIELDS` strips both with
  per-field rationale; `npcLadderState.js:202,204` SORTS rungs by `dots`; `npcAgency.js:250-252`
  carries the IDENTICAL ladder and `disposition.js:82-83` states in terms that it MIRRORS it.
  Reader-side diverges a declared mirror; writer-side is a product question AND moves
  same-seed output (`computeAggressiveness` → `computeDispositionFactorMap` → `pulseKernel`).
  ⭐ If this class recurs, class (a) needs an **AUTHORED-INPUT exemption**.
- **Settlement-root legacy slots (`hooks`, `supplyChains`, `plotHooks`).** Three reasons,
  any one sufficient. (1) `aiLayer.js:214-218` **DOCUMENTS** the top-level read as
  never-written and deliberately kept as a legacy fallback — deleting re-litigates an
  authored decision. (2) ⚠⚠ **THE BRIEF'S 3 SITES ARE 3 OF ~19** — 7 further direct root
  readers plus THREE parallel root-address registries (`userEdits.js:307-310`,
  `settlementSliceHelpers.js:143-146`, and `aiOverlayVerifier.js:388-391` — in the SAME FILE
  as the two sites named). (3) The verifier arms are DEFENSIVE: removing them is FAIL-OPEN
  on an AI-tamper check, the mirror image of the `heraldIndex.js:208` exclusion.

## Receipts (all TRUE exit codes)

11 mutants, each re-adding one deleted arm **as an extra OR-arm** (the realistic
regression): **ALL 11 RED**. New pin `tests/domain/deadReaderRepairs.test.js` 13/13, every
negative control fed ONLY the dead spelling. `tests/generation.test.js` +
`generatorGoldenMaster.test.js` GREEN ⇒ **NO same-seed shift**. eslint 0 errors,
typecheck:ratchet 173/173, typecheck:domain:strict 1134/1134 — all exit 0.

⚠ **TWO PRE-EXISTING REDS INHERITED, PROVEN NOT MINE** by an executed base-content run
(this lane's 8 files swapped to HEAD content, pin suite moved aside): identical failing
test names both ways — `sovereigntyLightingContract.walker.test.js` ("THE CENSUS IS AN
ASSERTION") and `warRulingKindPools.walker.test.js` (`succession_demand_inherited` annex).

## ⚠ The expected walker shrink — do NOT hand-edit the baseline

`observedShapeReaders.walker.test.js` reds with **`{ violations: 0, stale: 7 }`** — a PURE
SHRINK, the instrument working. The 7: `__adjudicationPending`/`__forecast`/`__resolution
on stressors` (heraldRouting.js), `evidenceId on outcome` (warCoalitionEvidence.js), and
`title on currentTensions` × 3 files. Cure = `node scripts/check-observed-shape-readers.mjs
--write`, which refuses on an uncommitted tree ⇒ **CHAIR'S POST-COMMIT STEP**.
The live-pinned UI-cohort literal WAS moved in-file (it is a source pin, not the baseline):
`53/153/249 → 53/152/248`, cause stated in-file — only `dailyLifeLogic.js` sits in the cohort.

Related: [[osr-171-growth-rows-triaged]] · [[ui-cohort-triaged-31-true-positives]] ·
[[minifold-tree-is-live]] · [[derive-dont-restate-and-mutant-must-change]].
