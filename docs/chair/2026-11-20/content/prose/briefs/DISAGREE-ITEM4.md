# BRIEF: DISAGREE ITEM (4), MEASURE ONLY (PROSE-6's builder; the chair's N56, 2026-11-23 05:52 UTC; E132 item (4))
NOTHING IS CURED HERE. Do not edit any file under `src/`, `tests/`, `scripts/` or `docs/content/`. Do not commit to `lane/prose-6-2026-11-23-disagree-wip`: it is on the landing stack as point 110. Never push, never `--no-verify`, never `npm run check`, never the whole suite.
- Read the tree READ-ONLY at `/home/user/wt-disagree`: the cured tip 01ecf1e91, which is 244fa84ef plus DISAGREE.
- Write and commit ONLY in `/home/user/settlement-engine`, on branch `lane/prose-6-2026-11-23`, by explicit paths, and only these two files:
  - `docs/chair/2026-11-20/content/prose/map/disagree-item4.mjs`
  - `docs/chair/2026-11-20/content/prose/map/DISAGREE-ITEM4.md`
- Run the script with `TREE=/home/user/wt-disagree node <script>` (the same imports as `map/disagree.mjs`), through `sh /home/user/wt-disagree/scripts/gate-mutex.sh --run --`, with a log under /home/user/logs. Never read the log through a pipe.
- If your own permission check refuses a command: stop, and report the exact command and the reason.

## THE QUESTION (the eighth chair's E132 item (4), verbatim)
"the other cell pairs of different desks that read one fact family (food, money for defence, order, walls, trade) where one asserts a lack and the other a sufficiency, with their co-occurrence over 900 births: the owner asked for these two; the rest go to him."

## METHOD
1. THE CELLS. A cell is one pool: a desk, a position and a pool key. The desks are the six leaves of `src/data/dossierStateProse/*.generated.js`. For each of the five families, CLASSIFY the cells whose KEY reads that family as LACK or SUFFICIENCY. Use the key and the reader behind it (the fact it is drawn on), never a sentence's wording alone. A cell that is neither is left out. Put the classification in the script as ONE frozen table, one row per cell, `{ family, polarity, desk, position, pool, why }`. `why` names the fact or reader in a few words.
   - The two cured pairs are rows too. They must read 0 pages at this tip, which is your control. If either reads more than 0, STOP and report.
2. WHICH CELL PRINTED. Prefer the engine's own record of which pool and variant a desk drew, if `buildPrintProse` or the desks expose one. Read before you write. Otherwise, match each variant's text against the page by template, with the matchers of `tests/helpers/oppositeSentencePairs.mjs` (`matchersOf`, `pageTextsOf`). Import them; do not copy them. Say in the table's header which way you used.
3. THE PAIRS. For each family, cross each LACK cell with each SUFFICIENCY cell of a DIFFERENT desk, or of the same desk at a different position. Count the pages on which both print, over the 900 births: seeds `dz-<size>-<i>` with i < 150 for each of the six sizes, born as `map/disagree.mjs` does. Keep only pairs with at least 1 page.
4. READ EACH SURVIVING PAIR ONCE. For each pair with at least 1 page, read one page's two sentences. Then mark the pair:
   - TRUE: the two sentences do contradict;
   - NOT: the cells' facts differ in scope, so a reader sees no contradiction.
   Say why in at most 10 words. That reading is yours; I read it after you.

## THE TABLE (`DISAGREE-ITEM4.md`, at most 60 lines)
Its FIRST THREE LINES are plain words for the owner:
1. how many pairs read TRUE;
2. on how many of the 900 pages, and how many of those are metropolises;
3. the worst pair, with its two sentences quoted from one page.
Then one row per pair, worst first: family, the LACK cell (desk, position, pool), the SUFFICIENCY cell, pages by size (thorp to metropolis) and in total, one seed, TRUE or NOT and why. Then the method in at most 5 lines, including the count of cells classified per family and polarity. The two cured pairs stand last, as the control at 0.

## REPORT
Commit both files by explicit path in `/home/user/settlement-engine`. Return at most 150 words: the commit, the three plain lines, and anything you could not classify.
