# BRIEF: DISAGREE (PROSE-6's one builder; the eighth chair's GO-PROSE-5-DISAGREE.txt, items 2 and 3)

YOU BUILD ON `lane/prose-6-2026-11-23-disagree-wip` in the worktree `/home/user/wt-disagree`, cut at 244fa84ef (the working line, point 105). Commit there by EXPLICIT paths. Never push, never touch another branch, never `--no-verify`. Your seat (PROSE-6) reads your diff and pushes.

## WHAT THE UNIT CURES (the owner's order of 2026-11-22: "Can you fix these:")
Two pairs of sentences disagree on one page (the chair's measure: 600 births, `docs/chair/2026-11-21/eighth/measures/DISAGREE.md` on `origin/lane/chair-2026-11-08`):
- FOOD: DS-DEF-2 `CHAIN: food trades failing` ("...food the town would miss if it were cut off.") is printed beside DS-ECO-9 `SECURE` ("Nothing on {settlement}'s tables suggests to a visitor that food is a worry here."). It happens on 18 of 600 pages, 16 of them metropolises. Seeds: dz-town-12, dz-city-54, dz-metropolis-2.
- WAGES: DS-GEN-17 `GARRISONED` v2 ("pays wages for its defense...") is printed beside DS-DEF-2 `Economic Survival: WEAK` v1/v2 ("...no money to pay them for it."). It happens on 2 of 600 pages. Seeds: dz-town-2, dz-town-36.
Seeds are born as `generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} })`, after `loadGenerationLawPayloads()`. The page is `buildPrintProse(s, {})`.

## THE LINES, EXACTLY AS THE CHAIR TOOK THEM
`docs/chair/2026-11-20/content/prose/lines/DISAGREE-LINES.md` (on `lane/prose-6-2026-11-23`), word for word, marks as written. If a walker refuses a line, STOP and report the line and the walker. You never reword a line yourself.

## FILES YOU MAY CHANGE (and nothing else)
1. `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`: the DS-DEF-2 and DS-GEN-17 blocks only. Append the new lines at the END of their pools, so they take the next ids. Add the marks to the rows the lines file names.
2. The generated leaves, by their door only: `npm run gen:dossier-prose`, then `npm run gen:dossier-prose -- --check` must exit 0 (`src/data/dossierStateProse/defense.generated.js`, `general.generated.js`).
3. ONE new test file, `tests/domain/oppositeSentencePairs.test.js` (the tooth; see below).
4. A register that reds BECAUSE of the new lines, re-taken by ITS OWN DOOR only, one commit each, with the cause in the message. Never raise a shrink-only ceiling. The byte ratchet `proseCorpusBytes` and `proseComposed` A0b are already red on the line: they are the owner's. Report their new figures and touch nothing.

## THE TOOTH (item 3)
In the new file, a frozen table `OPPOSITE_PAIRS` holds one row a pair: `{ id, a: { desk, position, pool, vids }, b: { desk, position, pool, vids } }`. It is keyed by pool and variant id, never by a sentence's text. The variant texts are read from the generated leaves at test time and matched against the page by template (slots as wildcards). The two rows are FOOD (DEF-2 `CHAIN: food trades failing` flat v1, v3, v4 × ECO-9 `SECURE` all) and WAGES (DEF-2 `Economic Survival: WEAK` flat v1, v2 × GEN-17 `GARRISONED` v2).
- ARM 1: the measure's five seeds, plus born places of every size (choose N a size so the file runs inside its own budget; say the time). No page prints both sides of any row.
- ARM 2 (anti-vacuity): for each row, a positive control shows its matcher finding side A and side B on real pages.
- A new pair is one row.
RED FIRST: commit the test alone first, run it on the uncured tree, and show it red on the measure's seeds. Then make the cure, and show it green.
Basename check: `oppositeSentencePairs` avoids the mutation manifest's name pattern.

## PROOFS (each through `sh scripts/gate-mutex.sh --run -- <cmd>`, to a log; never read through a pipe; one heavy run at a time)
- (a) The red-first and the green of the new file.
- (b) Re-run the chair's measure on both trees, unchanged: `TREE=<tree> node /home/user/settlement-engine/docs/chair/2026-11-20/content/prose/map/disagree.mjs 100`. Report its figures. Its BOTH columns still count the new both-truth lines, which is intended. The flat pairs are the tooth's count: 0 after the cure, and the same count over the 600 seeds dz-<size>-<i>. Also report the new lines' reach per size.
- (b2) Count the pages where the two pools printed a sentence before the cure and print none after. The `food` band reads null without a food record, and then both forms are refused. The count must be 0, or the pages are named.
- (c) THE DARK PROOF. One digest over the 600 births' records, every field that is not a string (`JSON.stringify` with strings replaced by a marker), at 244fa84ef and at your tip. EQUAL, with the hash and the count of births. Then the strings that differ: only DEF-2 and GEN-17 sentences.
- (d) `tests/lint` whole, at your last commit: the count, with every red BY NAME against `RED-AT-LINE.tsv` (only the three size signings are expected). Fetch the ledger ref first (it is done in the main checkout).
- (e) Every test file that names `defenseStateProse.js`, `generalStateProse.js`, `defense.generated.js` or `general.generated.js` (by grep over `tests/`; say both counts), plus `tests/domain/display/stateProse/` if it exists.

## REPORT
Write `docs/chair/2026-11-20/content/prose/DISAGREE-REPORT.md` in the worktree (at most 80 lines; committed). It holds: the commits; red and green with titles; the measure before and after; the dark proof; the counts; every register moved, with its cause; anything refused, word for word. Final message to me: at most 200 words.
