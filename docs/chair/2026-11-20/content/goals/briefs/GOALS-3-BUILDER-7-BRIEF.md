# GOALS-3 · builder 7 · THE GATE'S CURE: no goal sentence printed twice in one town

Written 2026-11-20 13:21 UTC by GOALS-3 (the integrator), on the chair's gate of 12:32 UTC and its rulings of 13:17 UTC. You build; GOALS-3 reads your diff line by line once, at the merge, and re-runs your red and green. GOALS-2's cure brief (`goals/briefs/GATE-CURE-IDENTICAL-BRIEF.md`) is the diagnosis you read beside this one; WHERE THEY DIFFER, THIS GOVERNS (it adds the chair's ruling on cause B and the census test).

## Where you work
`git worktree add /home/user/wt-b7 -b lane/goals-3-2026-11-20-b7 d3937c3f8` (the lane's tip: units 1, 3, 4, 5, 6 merged, and the working line at 43ab0f5eb merged on top); `ln -s /home/user/settlement-engine/node_modules /home/user/wt-b7/node_modules`. ONE commit by explicit paths, the receipts in the message; never push; never touch `/home/user/settlement-engine`.

## The gate (absolute) and the measure that convicts
At the lane's last commit identical goal sentences inside one town (short and long pooled; k−1 per sentence held k times) are at or below the base's 3 BY SIZE (city ≤ 1, metropolis ≤ 2, every other size 0); THE CHAIR EXPECTS 0. Measured at d3937c3f8 (`node docs/chair/2026-11-20/content/goals/measures/goals-final.mjs <tree> 50 <out>`): identical 7 (city 2, metropolis 5), mirror 80, template>2 22, template=2 1,331. Every survivor named in `goals/measures/identical-survivors.df2a87131.out.txt` (the goal content of d3937c3f8 is df2a87131's).

## Cause A (4: hxd-city-5, hxd-metropolis-23, hxd-metropolis-33 ×2) — APPROVED as follows
In `goals.js :: dealGoals` pass two an earlier repeat X takes wording W at rung (ii) 'twice' (W's one holder filled other names) while a LATER repeat Y had drawn W with X's names in pass one; Y is not yet counted, the mirror reads only the first holder's names, and Y then 'stands' at rung (iv), printing X's sentence.
- (a) Rungs (ii)/(iii) and the mirror see EVERY holder of the wording: every card placed so far AND every later card whose pass-one wording it still is. A candidate whose FILLED TEXT equals any such holder's text is never taken (this also closes the name-free hole: the mirror's `!!n` lets `n === ''` through).
- (b) Rung (iv): the drawn wording stands only if its text is no holder's text; otherwise the walk goes on in rotation order (the call's cell lines, then its reserve lines, as `groupOf` orders them) to the first candidate whose TEXT nobody in town prints, preferring rungs (i) → (ii) → (iii) as today; only if none qualifies does it stand, with `receipt.repeat[v] = 'exhausted'` (a new rung name).
- (c) The same two rules in the post-pass `refuseWantsBesideSecrets` (its `once` and its `walk[0]` fallback).

## Cause B (3: hxd-city-49, hxd-metropolis-11, hxd-metropolis-19; the fortune teller's long PERSONALITY want) — RULED: RESERVE LINES
The chair refused both letting them stand and walking to another cluster (that changes what KIND of want a person has). Instead: PERSONALITY cells get RESERVE LINES, reached only by the walk, never by the draw (outside `fork.pick`'s modulus, exactly as `GOAL_RESERVE_LINES` holds other families' reserve).
- (d) Give `GOAL_RESERVE_LINES` a `PERSONALITY` entry keyed like the PERSONALITY cells (cluster, vantage), and make every rotation walk and `personalityFloor` reach a PERSONALITY cell's reserve after its cell lines. The floor then returns a line some card prints ONLY when the cell and its reserve are all printed: `'exhausted'`, counted and named.
- (e) THE LINES THEMSELVES are being approved by the chair now; GOALS-3 sends you them by message, word for word, with the cells they belong to. Build (a)–(d) and the tests with the reserve EMPTY for PERSONALITY first (your planted tests plant their own lines); when the lines arrive, add them verbatim and re-run. Do not commit before they are in, unless GOALS-3 tells you to.
- (f) Nothing else moves: no new draw, no change of family, kind or target, no change to pass one or the `held` set (the held set is a named survivor for after the deploy), no tie.

## Tests (red first at d3937c3f8, then green; compute, never quote a pool's sentence: `tests/lint/proseDrawnAnchors.walker.test.js`)
- (p) THE GATE'S COUNT, a new file `tests/generators/people/goalSentencesOnceInTown.test.js`: the measure's towns (seeds `hxd-<size>-<i>`, i < 50, `tests/components/pageCensusWalk.shared.mjs :: SIZES`, `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} })` after `loadGenerationLawPayloads()`, as the measure does): every sentence printed twice in a town is held by a card whose receipt says `'exhausted'`, and the count by size is ≤ the base's (city 1, metropolis 2, else 0). The failure names each town, sentence and card ids. If one `it` over 300 towns exceeds 150 s, split by size with their own timeouts; report the time. RED at d3937c3f8 (the 7 named), GREEN after.
- (q) A planted cast reproducing A (X 'twice' on W, Y drawn on W with X's names): Y does not print X's sentence (red: 'stands').
- (r) A planted name-free cell with one holder and a repeat with a free reserve line: the repeat takes the reserve line (red: 'twice', same sentence); and with the reserve spent: `'exhausted'`, counted.
- (s) The floor: a planted card whose families leave only a fully printed PERSONALITY cell with a reserve line: it takes the reserve line.
- Keep green: `goalsNoRepeatedWording.test.js` (a)–(h), `goalSecretRefusals.test.js` (j)–(o), `goals.test.js`, `goalCharterRefused.test.js`, `tests/data/goalFamilies.test.js` (extend it if it walks the reserve's shape), the two walkers. A pin of exact output that moves: name it by file and title, before/after, cause.

## The count (scratch, not the repo)
`goals-final.mjs` at d3937c3f8 and at your commit, the whole table both times. The only-movers check on the 300 towns: every card whose goals (short, long, intent) differ, named; each must have printed an identical sentence at d3937c3f8, or been moved by (a)'s wider holder set; any other is a finding: name it and its cause. The `'exhausted'` survivors by seed and sentence.

## Gates (to files, read by count lines, never through a pipe: `sh scripts/gate-tail.sh <cmd>`)
Your arms red then green; `tests/generators/people`, `tests/data/goalFamilies.test.js`, `tests/data/goalSecretRefusals.test.js`, `tests/generators/bar8People.test.js`, every test file naming `rareSecrets`, `tests/lint/proseDrawnAnchors.walker.test.js`, `tests/lint/namesInSentences.walker.test.js`; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite. No run with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.

## Your files
`src/generators/people/goals.js`; `src/data/people/goalFamilies.js` (the PERSONALITY reserve entry and its lines only); `tests/generators/people/goalSentencesOnceInTown.test.js` (new); `tests/generators/people/goalsNoRepeatedWording.test.js`, `goalSecretRefusals.test.js`, `tests/data/goalFamilies.test.js` (arms only). Nothing else. Report in at most 300 words: the commit, files, any departure from this brief and why, red and green with counts and log paths, the measure table at both trees, the only-movers check, the `'exhausted'` survivors, anything undone.
