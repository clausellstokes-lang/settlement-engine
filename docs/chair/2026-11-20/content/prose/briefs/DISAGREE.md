# BRIEF: DISAGREE (PROSE-6's one builder; the eighth chair's GO-PROSE-5-DISAGREE.txt items 2 and 3, as the ninth chair ruled them on 2026-11-23)

YOU BUILD ON `lane/prose-6-2026-11-23-disagree-wip`, in the worktree `/home/user/wt-disagree`. It was cut at 244fa84ef, the working line at point 105; `node_modules` there is a symlink: never commit it. Commit by EXPLICIT paths only. Never push, never touch another branch, never `--no-verify`, never `npm run check`, never the whole suite. Your seat (PROSE-6) reads your diff and pushes. If your own permission check refuses a command, stop and report the exact command and the reason. Try nothing else to the same end.

## WHAT THE UNIT CURES (the owner's order of 2026-11-22, "Can you fix these:")
Two pairs of sentences disagree on one page. The chair's measure: 600 births, `docs/chair/2026-11-21/eighth/measures/DISAGREE.md` on `origin/lane/chair-2026-11-08`. Its script is copied to `/home/user/settlement-engine/docs/chair/2026-11-20/content/prose/map/disagree.mjs` and runs with `TREE=<tree> node <script> 100`.
- FOOD: DS-DEF-2 `CHAIN: food trades failing` ("...food the town would miss if it were cut off.") is printed beside DS-ECO-9 `SECURE` ("Nothing on {settlement}'s tables suggests to a visitor that food is a worry here."). 18 of 600 pages, 16 of them metropolises. Seeds: dz-town-12, dz-city-54, dz-metropolis-2.
- WAGES: DS-GEN-17 `GARRISONED` v2 ("pays wages for its defense...") is printed beside DS-DEF-2 `Economic Survival: WEAK` v1 or v2 ("...no money to pay them for it."). 2 of 600 pages. Seeds: dz-town-2, dz-town-36.
How a seed is born: `generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} })`, after `loadGenerationLawPayloads()`. The page is `buildPrintProse(s, {})`. 900 births means seeds `dz-<size>-<i>`, i < 150, for each of the six sizes.

## THE LINES, EXACTLY AS THE CHAIR TOOK THEM
`docs/chair/2026-11-20/content/prose/lines/DISAGREE-LINES.md`. Read it with `git -C /home/user/settlement-engine show lane/prose-6-2026-11-23:docs/chair/2026-11-20/content/prose/lines/DISAGREE-LINES.md`. Use the words and marks as written. You never reword a line yourself: if a walker refuses a line, STOP and report the line and the walker.

## PHASE 1: MEASURE ONLY, on the uncured tree. Then RETURN to me and wait.
Write one script, `docs/chair/2026-11-20/content/prose/map/disagree-phase1.mjs` (in the worktree). Run it on 900 births and report by size:
- (i) Pages that print GEN-17 GARRISONED v2 where `src/domain/facts/guardPay.js :: guardPayOf` reads 'short'.
- (ii) Pages that print GEN-17 GARRISONED v2 where only the unpaid rota stands (`watchIsUnpaidRota`).
- (iii) Pages where the WAGES branch's new lines would be eligible (key `Economic Survival: WEAK`, `guardPresence`, `force: paid`, `prosperity: ≤ comfortable`), with how many of them read pay 'short'.
- (iv) Pages where the FOOD branch's new lines would be eligible (key `CHAIN: food trades failing`, no siege, `food: ≥ secure`), split by `stores` < 12 and ≥ 12.
- (v) `cardVeil.js :: isHideableHouse` on every garrison, watch, militia and mercenary row of the 900 (expected: never true).
Read every fact through its own reader (`factsOf`, the vocabulary's dimension readers), never by restating it. Commit the script and its output table, `map/DISAGREE-PHASE1.md`, at most 40 lines. Return at most 150 words.

## PHASE 2 (only on my word): THE CURE
FILES YOU MAY CHANGE, and nothing else:
1. `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`: the DS-DEF-2 and DS-GEN-17 blocks only. Append the new lines at the END of their pools, so they take the next ids. Add the marks to the rows the lines file names.
2. The generated leaves, by their door only: `npm run gen:dossier-prose`, then `npm run gen:dossier-prose -- --check`, which must exit 0.
3. ONLY IF I SAY phase 1 (i) is above 0: GARRISONED v2's text becomes "{settlement} pays wages for its defense as well as keeping its walls.". Use the means this tree uses to change an existing line: the `WORD_CORRECTIONS` row in `scripts/generate-dossier-state-prose.mjs`, keyed by pool, vid and the sha256 of the old and new text; see the DS-ECO-11 v6 row. If phase 1 (i) is 0, the line stays and the tooth pins that count at 0.
4. `tests/helpers/oppositeSentencePairs.mjs`: the ONE home of the frozen table `OPPOSITE_PAIRS`, one row a pair, `{ id, a: { desk, position, pool, vids }, b: { desk, position, pool, vids } }`. It is keyed by pool and variant id, never by a sentence's text. Texts are read from the generated leaves and matched against the page by template, with slots as wildcards. The rows: FOOD is DEF-2 `CHAIN: food trades failing` v1, v3, v4 × ECO-9 `SECURE` (all ten); WAGES is DEF-2 `Economic Survival: WEAK` v1, v2 × GEN-17 `GARRISONED` v2. A new pair is one row.
5. `tests/domain/oppositeSentencePairs.test.js` (the tooth). ARM 1: the five seeds above plus N a size of every size, with N chosen so the file runs inside a budget of its own (say the time): no page prints both sides of any row. If (i) was 0, a further arm: GARRISONED v2 never prints where pay reads 'short'. ARM 2, anti-vacuity: for each row, a positive control on real pages finds side A and side B by its matcher.
6. A register that reds BECAUSE of the new lines, re-taken by ITS OWN DOOR only, one commit each, with the cause in the message. Never raise a shrink-only ceiling. `proseCorpusBytes` (raw, gzip) and `proseComposed` A0b are already red on the line and are the owner's: report their new figures and touch nothing. Report any register that moved, by name.
RED FIRST: commit items 4 and 5 alone first, and show the tooth red on the uncured tree on the measure's seeds. Then make the cure, and show it green.

## PHASE 2 PROOFS (each through `sh scripts/gate-mutex.sh --run -- <cmd>`, to a log under /home/user/logs; never read through a pipe; one heavy run at a time)
- (a) The red-first and the green of the tooth.
- (b) THE BAR, on 900 births: each branch's reach by size, and each new line's share of places of a size (at most 15%, up to 20% as sampling). Re-run the chair's script on both trees and report its figures (its BOTH columns still count the both-truth lines, which is intended).
- (c) The 900 births through `OPPOSITE_PAIRS`: 0 pages. Also a table of which ECO-9 SECURE and GEN-17 GARRISONED variants print beside each new line, with counts, for my reading.
- (c2) NO CELL LEFT EMPTY, before and after, on 900 births: count the pages where the key of DEF-2 `CHAIN: food trades failing`, of DEF-2 `Economic Survival: WEAK` or of GEN-17 `GARRISONED` holds while the eligible set (`stateProseKernel.js :: eligibleVariants`) is empty. After the cure the count must be 0 or no higher than before. If it is higher, STOP and report.
- (d) THE DARK PROOF. One digest over the 900 births' records, taken over every field that is not a string (`JSON.stringify` with each string replaced by a marker), at 244fa84ef and at your tip. It must be EQUAL: give the sha and the count of births. Then list the strings that differ: only DEF-2 and GEN-17 sentences.
- (e) `tests/lint` whole at your last commit: the count, and every red BY NAME against `RED-AT-LINE.tsv` (`git -C /home/user/settlement-engine show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv`). Only the three size signings are expected. The ledger ref is already made in the main checkout; in the worktree run `git branch --list review-fixes-2026-07-08` first.
- (f) Every test file that names `defenseStateProse.js`, `generalStateProse.js`, `defense.generated.js`, `general.generated.js` or `generate-dossier-state-prose` (grep over `tests/`). Say both counts: the files named and the files kept, keeping out files that only run births (COMMON-EIGHTH 14 (c)). Run the kept ones with the tooth.

## REPORT
Write `docs/chair/2026-11-20/content/prose/DISAGREE-REPORT.md` in the worktree, at most 80 lines, committed. It holds: the commits; red and green with titles; (b) to (f); every register moved, with its cause; anything refused, word for word. Final message to me: at most 200 words.
