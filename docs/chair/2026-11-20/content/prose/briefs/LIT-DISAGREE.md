# BRIEF: LIT-DISAGREE, MEASURE ONLY (PROSE-6's builder; the chair's N80, 2026-11-23 10:10 UTC)
WHY: every DISAGREE and PROSE-E measure was taken on births born DARK, but the first deploy ships LIT, with both new birth laws on. This unit measures the same things lit. NOTHING IS RE-WORDED AND NO PIN MOVES: the chair rules on what you find.
THE TREE, READ-ONLY: `/home/user/wt-lit`, on branch `lane/prose-6-2026-11-23-lit-scratch` at 90cd498b7. That is `origin/lane/close-5-2026-11-23-flip` at 9df6731ee (the flip so far: the three dials lit, and the line merged), with PROSE-E's cf104777c merged in by the seat. `gen:dossier-prose -- --check` exits 0 there.
- Do not edit, commit or push anything in that worktree. A scratch ref is never merged anywhere.
- Write and commit ONLY in `/home/user/settlement-engine`, on branch `lane/prose-6-2026-11-23`, by explicit paths, and only these two files:
  - `docs/chair/2026-11-20/content/prose/map/lit-disagree.mjs` (start from `map/floor.mjs` and `map/disagree-e-phase1.mjs`; import, never copy, the tooth's helpers from the TREE);
  - `docs/chair/2026-11-20/content/prose/map/LIT-DISAGREE.md`, at most 80 lines.
- Every run goes through `sh /home/user/wt-lit/scripts/gate-mutex.sh --run --`, logged under /home/user/logs with its exit code appended. Never read a log through a pipe; one heavy run at a time.
- Never push, never `--no-verify`, never `npm run check`.
- If your own permission check refuses a command: stop, and report the exact command and the reason. Try nothing else to the same end.

## 0. PROVE THE BIRTHS ARE LIT
Read how the flip lights them (2bc483fc8, "the seat, contest and fortune dials lit"), and birth by the tree's own default path, as `map/disagree.mjs` does. Show on one birth, by the tree's own reader, that the dials read lit. If the default birth is not lit, birth the way the flip's own tests do, and say how.

## 1. THE WHOLE CROSS, LIT, WITH THE FLOOR LIFTED (900 births: seeds `dz-<size>-<i>`, i < 150, six sizes)
- Use item 4's frozen 151-cell LACK/SUFFICIENCY table (`map/disagree-item4.mjs`).
- Find printed variants by the engine's DRAW LEDGER, plus the page's own cut (`siteClause` and its like), as `map/floor.mjs` does. Do NOT use the matcher's four-word floor.
- Read EVERY co-printing variant pair once, by its two PRINTED forms, and mark it:
  - TRUE: they contradict;
  - NOT: they do not.
  Give the reason in at most 10 words.
- For each TRUE pair: its two printed forms, pages by size, and one seed.
- THE COUNT OF PAGES WITH AT LEAST ONE TRUE PAIR, lit, beside dark's: 63 before the cures, 0 after (`map/DISAGREE-E-PHASE1.md`, `PROSE-E-REPORT.md`).
- Name every cell pair that co-prints lit but not dark.

## 2. THE TOOTH, LIT
Run `tests/domain/oppositeSentencePairs.test.js` in the TREE once, through the mutex, and list every red by arm.
- A CONTROL seed (ARM 2, positive) that no longer prints its side lit is a PREMISE, not a fault. Name it, and PROPOSE the lowest lit seed that holds the case by its own predicate. The proposal goes in the table only; commit nothing in the tree.
- If a registered row (`OPPOSITE_PAIRS`) or a watched row co-prints lit, or an old wording or a pinned tail prints lit: STOP AT ONCE. Report its two printed forms and its seed before anything else.

## 3. THE FIVE RE-WORDED LINES, LIT
Give every printed form, lit, of the five PROSE-E lines: GEN-13 NO-MARKET v10; DEF-2 full legal chain v1 and v2; CHAIN working v1; CRITICAL v1. List only the forms that differ from dark's (`PROSE-E-REPORT.md` lists dark's), each with its mount, its pages and its verdict beside the cell it stands with.

## THE TABLE (`map/LIT-DISAGREE.md`, at most 80 lines)
Its FIRST THREE LINES are plain words:
1. how many pages carry a TRUE pair lit, against dark's 0;
2. the worst TRUE pair, with its words;
3. the tooth's reds by arm.
Then (1), (2) and (3), then 3 lines of method.

## REPORT
Commit both files by explicit path. Return at most 150 words: the commit, the three plain lines, and any STOP.
