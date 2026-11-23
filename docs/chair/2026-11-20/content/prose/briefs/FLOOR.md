# BRIEF: FLOOR, MEASURE ONLY (PROSE-6's agent; the chair's N71 (2), 2026-11-23 07:40 UTC)
NOTHING IS CURED HERE. Do not edit any file under `src/`, `tests/`, `scripts/` or `docs/content/`, and do not touch `/home/user/wt-e`: a builder works there beside you.
- Read the tree READ-ONLY at `/home/user/wt-disagree`.
- Write and commit ONLY in `/home/user/settlement-engine`, on branch `lane/prose-6-2026-11-23`, by explicit paths, and only these two files:
  - `docs/chair/2026-11-20/content/prose/map/floor.mjs` (start from `map/disagree-item4.mjs`; import its helpers, never copy them);
  - `docs/chair/2026-11-20/content/prose/map/FLOOR.md`, at most 30 lines.
- Every run goes through `sh /home/user/wt-disagree/scripts/gate-mutex.sh --run --`, logged under /home/user/logs with its exit code appended. The builder shares the mutex with you, so a run may wait. Never read a log through a pipe.
- Never push, never `--no-verify`, never `npm run check`.
- If your own permission check refuses a command: stop, and report the exact command and the reason.

## THE BLIND SPOT
The tooth's matcher (`tests/helpers/oppositeSentencePairs.mjs:97`) drops a clause cut of FEWER THAN FOUR literal words, and `map/disagree-item4.mjs` counted a draw as printed only when that matcher hit. So a line the page prints only as a short cut was invisible. Example: GEN-13 NO-MARKET v12 prints "{settlement} has no market." on 46 pages (`generalDeskRead.js:184-188,372`, `siteClause`), and item 4 saw 0 of them.

## WHAT TO MEASURE (900 births, `dz-<size>-<i>`, i < 150, born as `map/disagree.mjs` does)
For EVERY LACK × SUFFICIENCY cell pair of item 4's cross (its frozen 151-cell table, walls included), find by the engine's DRAW LEDGER (`withPresumptionLedger`, as item 4 does) the pages where BOTH cells drew and AT LEAST ONE side's printed form fell under the floor. "Fell under the floor" means: drawn, the matcher misses, and the page holds a short cut of that variant. Find that cut by the readers' own cutting rule (`siteClause` and its like), never by the matcher.
Then for each such VARIANT pair, read its two printed forms ONCE, on one page, and mark it:
- TRUE: they contradict;
- NOT: they do not.
Give the reason in at most 10 words.
Count cell pairs and pages, by family. Say plainly whether any WALLS pair prints on one page once the floor is lifted, since item 4's "no walls pair prints on one page" was read through the floor.

## THE TABLE (`map/FLOOR.md`, at most 30 lines)
Its first two lines are plain words:
1. how many cell pairs and pages the floor hid, and how many are TRUE;
2. the walls answer.
Then one row per variant pair, TRUE ones first: family; the two cells; the two printed forms; pages; one seed; the verdict and why. Then 3 lines of method, including the count of distinct short cuts found.

## REPORT
Commit both files by explicit path. Return at most 120 words: the commit, the two plain lines, and every TRUE pair with its two printed forms.
