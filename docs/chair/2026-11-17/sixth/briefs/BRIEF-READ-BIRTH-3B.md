# BRIEF-READ-BIRTH-3B: the second reader on BIRTH-3's amendments (882cae319..8b0506eae), before it lands

You are READ-BIRTH-3B, a second reader for the sixth chair (session_01FbPLbcLDSJzZFzb5B7EjxR). YOU CHANGE NO FILE OF
THE PRODUCT AND PUSH NOTHING. You read a seat's last ten commits against what the chair asked, you PROVE what you find
by running it, and you send one message. This file is your whole assignment. Your reader is the chair: findings first.

## What is being landed

`lane/birth-3-2026-11-17` at 8b0506eae: the owner's SUPPLY RULE (for each house and its material the seed picks one
story at the birth and writes it into the rows the page already stores; every view reads the record). The range up to
882cae31943f2073a0aac68031c37cfba79bc17f was read by a second reader already (0 HIGH, 5 MED: they became AMENDMENT 2).
YOURS IS THE REST: `git diff 882cae31943f2073a0aac68031c37cfba79bc17f..8b0506eae -- src tests` (ten commits, 19 files,
about 320 lines added).

Read first, and no more: `docs/chair/2026-11-14/briefs/BRIEF-BIRTH-3.md` on the chair's lane
(`git fetch origin lane/chair-2026-11-08`): "RULING BR8" and AMENDMENTS 1 to 4 at its foot; in
`docs/chair/2026-11-17/bar7/RULINGS.md` the entries BR8 and BR9 only; on the seat's branch
`docs/chair/2026-11-17/birth/BIRTH-3-HANDBACK.md`: the sections "AMENDMENT 1" and "AMENDMENT 2" (print them with
`sed -n`; not the whole file).

YOUR TREE: the working line's tip with the seat's tip merged, local, NEVER PUSHED:
`git worktree add --detach /home/user/M ed1d43529bdfcf6e513bb2eb234c5a4c0305746d`, there
`git -c commit.gpgsign=false merge --no-ff --no-edit 8b0506eae`; `git rev-parse HEAD^{tree}` must read
4a9735d2f9ed4ef8e21aa19ec145de2e719e11f0 (else stop and tell the chair). `npm ci` there. A second worktree at
ed1d43529 (`/home/user/L`, `node_modules` by `cp -al`, then `rm -rf node_modules/.vite`) is the line as it stands, for
before-and-after. Births for a probe: copy the `born` function and the CENSUS list of
`tests/domain/bar6MarksLaw8.test.js` (the census's 720); the 150 are `docs/chair/2026-11-17/birth/birth3/seeds.w150.txt`
with PAGE-COPY's `seedcfg.mjs` (chair's lane, `docs/chair/2026-11-16/probes/PAGE-COPY/`); the seat's own probes are in
`docs/chair/2026-11-17/birth/birth3/` (`agree.mjs`, `three.mjs`, `collide.mjs`).

## Part 1: each amendment built as asked, with a run

For AMENDMENT 1 (1) to (3), AMENDMENT 2 A to F and the door word, AMENDMENT 3 G, AMENDMENT 4 I: is it built as the
brief asks, and does a run show it? In particular run whole, at M: `tests/generators/pipelineContract.test.js`,
`tests/generators/isolatedTrade.test.js`, `tests/components/publicProseEquality.test.jsx`,
`tests/domain/supplyStoryLaw.test.js`, `tests/domain/bar5MarksLaw2.test.js`, `tests/domain/birthKindsLaw.test.js`,
`tests/docs/enforcedByExists.test.js`, `tests/joins/labelJoins.test.js` (each alone, through
`sh scripts/gate-tail.sh npx vitest run <file>`; say green or the failing titles).

## Part 2: every modified test read for weakening

The seven modified test files of the range (`git diff --stat 882cae319..8b0506eae -- tests`). THE RULE (R8): a guard is
never narrowed; a test the cure makes untrue is re-keyed BY IDENTITY (the same claim, another anchor, a dated note).
For each changed assertion: is the claim the same; can the new form still fail (its anchor is non-empty)? Name any
assertion that was dropped or loosened. THEN A MUTATION SPOT-CHECK in scratch at M (restore after each): revert ONE
src hunk at a time and say which named test goes red: (a) `supplyStory.js :: sourceStoryOf`'s `|| own.some((g) =>
live.has(g))`; (b) `crisisStoppedRow.js :: rowShortOf`'s `&& !supplyToldShort(...)`; (c) `warReach.js :: warTakesOf`
reading the hook again in place of `warHoldsIron`; (d) `resourceGenerator.js :: importsBroughtAtBirth`'s
`subsumeTradeGoods` condition in `bring`. A hunk no test catches is a finding.

## Part 3: the chair's questions (each answered with a count over the census's 720, and the 150 where cheap)

Q1 · `src/domain/facts/warIronHook.js`. The writer (`foodBalance.js`) decides the hook at the economy step; the birth
   (`resourceGenerator.js :: importsBroughtAtBirth`) may add an iron word to the imports AFTER it; the readers ask the
   predicate over the FINAL record. Count towns where the predicate is true and no "Strategic Resource" hook is stored,
   and the reverse, at M. And: does `houseInputAtHand.js :: warIronHookOutsideWar`'s state (`front` / `at war` /
   `peace` off the stress container) equal `facts/warState.js :: warStateOf` in every town?
Q2 · `crisisStoppedRow.js :: supplyToldShort` (the new gate in `rowShortOf`). (a) Houses where the gate now passes
   (the row's class lacks INPUT, the supply rule tells idle or a venture) but `housesShortOfInput(s).get(house)` is
   undefined, so no mark prints: count and name. (b) COST: time `rowShortOf` over every house and service row of the
   five largest metropolis births, at L and at M (ms a town); say whether the new path re-reads the roster on every
   row. (c) A malformed record (no `economicState`, an institution with no name, a custom institution): no throw.
Q3 · `houseInputAtHand.js :: ONE_GOOD_BOUGHT` (a hides chain answered by an import that names livestock; a livestock
   chain by "animal products"). List the towns where a house's answer changes by it; print for three what the page
   shows (the imports as printed, the house, its mark). Would a reader call anything false: is the import's word
   really the livestock good by `domain/region/goodsCatalog.js`? Under a siege, do those houses read "Curtailed by the
   siege."?
Q4 · `importsBroughtAtBirth :: bring` (a word is brought only if it adds a canonical good): any house whose story at
   the birth is "bought in" but whose read-back is `missing` or unmarked-short (re-run the seat's `agree.mjs` at M over
   the 720 and the 150: it claimed 0).
Q5 · AMENDMENT 2 A. At M, LAW 8's guard (`tests/domain/bar6MarksLaw8.test.js` (a)) finds 17 mines as `8b.extract`
   (r2r-town-45; r2r-metropolis-9, -15, -17, -24, -29, -37, -40, -57; r2s-indebted-metropolis-2;
   r2s-infiltrated-metropolis-1 and -2; r2s-insurgency-metropolis-0 and -3; r2s-monster_pressure-metropolis-2;
   r2s-politically_fractured-metropolis-1; r2s-succession_void-city-0). The chair looked at four: each mine's ONLY chain
   is "Iron & Metalwork" on SPENT iron, and it stands beside a LIVE seam of its own kind (coal, gemstones, precious
   metals: `houseKinds.js :: SOURCE_GROUNDS.mine`) that the town exports; on the line today they are marked short.
   CONFIRM for all 17 (own grounds live and spent; the exports). Then: any OTHER source house with several grounds
   that A now reads at work while a printed row or description of it names only the spent ground's good? And what
   does the chain card of the Economics tab print for the spent chain (its status word, its "Via" list)?
Q6 · Anything else in the range a reader of a town page would see wrong, or that would break a saved town, a shared
   page or the PDF. NOT YOURS: the whole suite, the walkers under `tests/lint`, the build, the auditors' runners (the
   chair's check and a measuring seat run them).

## Your message (send_message to session_01FbPLbcLDSJzZFzb5B7EjxR; 600 words at most and ONE table)

Verdict first: HIGH n · MED n · LOW n. Then one row a finding: severity; `path :: symbol`; what a reader sees wrong or
what breaks; the evidence you RAN (the command and its key line); the smallest cure. Mark each CONFIRMED (you ran it)
or PLAUSIBLE (you read it). Then Part 1 and Part 2 as one line each, and Q1 to Q5 as one line each with the count.
Write the long form to `/home/user/READ-BIRTH-3B.md` on your machine (the chair may ask for a part). END YOUR TURN.

## Laws

Read-only on the product: no commit to any branch, no push, no pull request. Scratch worktrees under /home/user only.
Run nothing heavier than single test files and your probes (no whole suite). A refusal by your own permission check
stands: report it. Report exactly what ran; a claim you did not run is PLAUSIBLE, never CONFIRMED. Budget: 300,000 of
your count; if it runs short, send what is proven and name the rest.
