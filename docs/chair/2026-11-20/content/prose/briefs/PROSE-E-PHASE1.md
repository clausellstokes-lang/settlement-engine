# BRIEF: PROSE-E PHASE 1, MEASURE ONLY (PROSE-6's builder; the chair's N64, 2026-11-23 07:07 UTC)
The unit cures the four TRUE cell pairs of `map/DISAGREE-ITEM4.md`, by PROSE-D's means. THIS PHASE IS PAPER: you edit no file under `src/`, `tests/`, `scripts/` or `docs/content/`.
- Read the tree READ-ONLY at `/home/user/wt-disagree`.
- Write and commit ONLY in `/home/user/settlement-engine`, on branch `lane/prose-6-2026-11-23`, by explicit paths, and only these two files:
  - `docs/chair/2026-11-20/content/prose/map/disagree-e-phase1.mjs` (start from a copy of `map/disagree-item4.mjs`; IMPORT its matcher helpers, never copy them);
  - `docs/chair/2026-11-20/content/prose/map/DISAGREE-E-PHASE1.md`, at most 120 lines.
- Make ONE run of 900 births through `sh /home/user/wt-disagree/scripts/gate-mutex.sh --run --`, logged under /home/user/logs with its exit code appended. Never read a log through a pipe.
- Never push, never `--no-verify`, never `npm run check`.
- If your own permission check refuses a command: stop, and report the exact command and the reason.

## THE FOUR CELL PAIRS (rows 1-4 of DISAGREE-ITEM4.md)
P1 general DS-GEN-13 `NO-MARKET` × economy DS-ECO-10 `POSTURE: established`
P2 defense DS-DEF-3 `Unsafe` × defense DS-DEF-2 `Internal Security: full legal chain (court AND prison)`
P3 economy DS-ECO-9 `PRESSURED` × defense DS-DEF-2 `CHAIN: food trades working`
P4 defense DS-DEF-2 `Economic Survival: CRITICAL` × general DS-GEN-17 `GARRISONED`

## WHAT TO MEASURE AND WRITE
(1) EVERY co-printing variant pair of the four, read WHOLE: no cap, and row 1's 142 unread pages included. Per variant pair give:
   - both vids;
   - both texts, quoted ONCE per variant in a text list at the top, not per pair;
   - pages by size (th/ha/vi/to/ci/me) and the total;
   - one seed;
   - TRUE or NOT, with its reason in at most 10 words.
   Read one page of each variant pair. Where a variant pair is TRUE on some of its pages and NOT on others, say so and read two.
(2) FOR EACH TRUE VARIANT PAIR, the facts a mark could split it by. For each side, give:
   - its marks today, from the leaf;
   - for every fact dimension in `src/domain/facts/factVocabulary.js` that one of the two cells' variants already declares, its reading on the TRUE pages, read through the vocabulary's own reader, never restated;
   - and the same dimensions' readings on that cell pair's NOT pages, for contrast.
   Then, for each side's TRUE variant, the EMPTY-CELL test: on every TRUE page, remove that variant from the eligible set (`stateProseKernel.js :: eligibleVariants`) and say whether the set would be empty. Give the count of pages that would empty, per side and per variant.
(3) THE PINS AND REGISTERS each cure could move:
   - grep `tests/` (by the four pools' KEYS, by their desks' leaf DIRECTORY `dossierStateProse`, and by each TRUE variant's text, three or more distinctive words) for every test that pins a TRUE variant's words, a vid, or a count of these pools;
   - name each file and line;
   - name the registers that record these pools: the shift register, wiring census, observed-shape, lighting census and the samenessHideable list;
   - the size rows: proseCorpusBytes and proseComposed A0b, if a line is added.
THE FILE: first a text list of every variant of the four pairs that co-prints (vid and text, once), then per cell pair (1), (2) and its empty-cell counts, then (3). Plain words, no prose beyond the reasons.

## REPORT
Commit the two files by explicit path. Return at most 150 words: the commit, and for each cell pair how many variant pairs are TRUE and on how many pages, and which side's TRUE variants could take a mark without emptying a cell.
