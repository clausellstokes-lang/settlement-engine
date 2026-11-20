# FRAME-5 · brief C2: a power in the crisis page's Stakes stands in prose, with its verb in agreement (RENDER only)

Written 2026-11-20T11:14Z (`date -u`) by FRAME-5 on `lane/frame-5-2026-11-20`. This is the chair's ruling of 2026-11-20 10:58 UTC (FRAME-4-HANDBACK ruling 23), vetoable by the owner. Your prompt names this unit; build it and nothing else.

**Read whole first; it binds you.** The COMMON section of `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md` (results path `frame5/`). Then: `src/components/new/tabs/CrisisTab.jsx`, `src/pdf/sections/CrisisSections.jsx`, `src/pdf/lib/crisisPrint.js`, `src/domain/crisis/crisisPage.js` (`CRISIS_PAGE_COPY.stake`, `stakeShown`), `src/domain/display/governanceAccount.js :: powerNameInProse`, and `src/data/people/powerSentenceName.js` (`powerVerb`, `pluralPowerName`, `powerNameWithArticle`). Read every file you change.

## Why

A Stakes row printed "Religious Authorities gains". The row opens on the bare roster leaf (`powerSentenceName`) and its verb is always singular. The row is a sentence: the power stands with its article, and its verb takes its number.

## What to build

1. One composition of the row's opening, used by both renderers (the tab and the PDF via `stakeLines`). It is never two copies.
   - The power is written `powerNameInProse(name, true)`.
   - The verb word follows `powerVerb(name, one, many)` for `gains`/`gain`, `loses`/`lose` and `split`.
   - `stakeShown` already gives the plural form for `untouched` and `atOdds`. Read whether its `answers` row and its `it governs here` / `they govern here` reason agree, and say so.
2. The Crisis tab keeps the door. The `EntityLink` still opens the power, and only its visible text changes.
3. **Measure first, and give the figures in your results file:** every Stakes row on B7's pool (24 per kind), counted before and after, split by plural/singular power and by stake. Then list the rows whose text changes and give five of them before and after, exactly as printed.

## Proofs, beyond the common list

- RED FIRST: a test that renders a plural power's row ("The Religious Authorities gain") and a singular one, run on the tab and on the PDF line.
- Nothing stored changes, and no file under `src/generators/` is touched.
- Every composed crisis page is byte-identical outside the Stakes rows.
- Every calm town is byte-identical.
- The pins this moves are named by file and title, and none is re-recorded. Candidates are the crisis-tab snapshots, the PDF text tests and `proseNumerics`.
- The phone floor census: say whether the tab's change touches a census row.

Unit name: `C2`. Results go in `docs/chair/2026-11-20/content/frame5/C2-STAKES-PROSE-RESULTS.md`.
