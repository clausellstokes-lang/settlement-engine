# FRAME-2 · brief B1 — CF11's count (MEASURE ONLY: no source change)

Written 2026-11-20T05:47Z (`date -u`) by FRAME-2 (the integrating seat) on `lane/frame-2-2026-11-20`. You are a builder of FRAME-2. You MEASURE; you change no file under `src/` or `tests/`.

## The question

The session sheet (`src/domain/summary/tonightSheet.js :: composeTonightSheet`) of a CALM town (no active crisis: `settlement.stress` empty) today opens on a relationship beat. A build on this branch (`src/domain/tension/troubleCast.js`, `sideArchetypes.js`) puts a "frame" (the town's sharpest standing tension, three people on its three sides) on every calm town. The owner has ruled that a calm town must keep today's sheet unless the record holds a TROUBLE OF WEIGHT. The chair has proposed a definition of weight, to be counted BEFORE anything is built. Count it.

THE CHAIR'S DEFINITION (verbatim in substance). A calm town holds a trouble of weight only where BOTH hold:

(a) the record carries a graded strain of its own, one of a closed list:
- **W1, the seat is under real pressure**: (W1a) the record's own coup contest shows it: `src/domain/rulingPowerCoup.js :: coupContenders(settlement).incumbent.gated === false` (read the function's doc comment: `gated` true means the ruler still re-enters the top three; report what `gated === false` means in the code, and count it as the code defines it); OR (W1b) its legitimacy stands in the gates' own doubted bands: below 45 (and separately below 30), the edges `src/domain/worldPulse/stressorGates.js :: politicalFractureGate` uses. FIND which stored field carries the legitimacy score those gates read (`powerStructure.publicLegitimacy` and/or `governanceLedger(...).legitimacyScore`), say which you used and why, and whether the two agree on the pool.
- **W2, two powers are in a recorded conflict**: a row of `powerStructure.conflicts`, OR a row of `factionRelationships` (find where it lives on the record) graded rival or worse. Report the grades that exist on the pool and which you counted as "rival or worse".
- **W3, a material strain short of a crisis is on record**: (W3a) food below secure in `economicState.foodSecurity` (report the labels that occur on the pool); (W3b) an outside creditor standing among the powers (find how the record marks a creditor power: search `src/data/stressPowerFaces.js` and `src/generators/factionDynamics.js` for "creditor"); (W3c) a supply chain recorded as broken (find the field: search `src/generators/computeActiveChains.js` and the economic state for an impaired or broken chain status).

AND (b) one of the town's tensions (`history.currentTensions[]`: `{ type, description, factions[3], plotHooks[], severity }`) IS ABOUT THAT STRAIN: its sides (`factions[]`, which the generator sometimes writes as a power's name) name a power of W1 (the governing power or a challenger in the contest) or of W2 (either power of the conflict); or its MATTER is W3's (a tension type about food, debt or trade/supply). For the matter test you must decide which tension types are about food, debt, or supply: list ALL tension types that occur on the pool and your classification of each, so the seat can rule on it.

## The pool

330 calm born towns, 55 per tier (thorp, hamlet, village, town, city, metropolis), seeds `frame-calm-<tier>-<i>`, i from 0, skipping any birth with an active crisis. The script that births it is in `docs/chair/2026-11-20/content/FRAME-1-HANDBACK.md`, section "How to re-measure" (the first script). Use it unchanged; run node from the repo root; write its cache to the scratchpad directory `/tmp/claude-0/-home-user-settlement-engine/a24e1eb5-d90d-5963-a121-dbebc78118f8/scratchpad/` (never into the repo). Report `tried` and `calm` from it (FRAME-1 measured 484 tried, 330 calm).

## What to report, per tier and in total

1. Towns holding W1a, W1b(<45), W1b(<30), W1 (either), W2 (conflicts rows alone; relationships rows alone; either), W3a, W3b, W3c, W3 (any), and THE UNION W1 ∪ W2 ∪ W3.
2. The union WITH (b): towns where at least one tension is about a strain the town holds. Also each strain WITH its own (b): W1∧(b about W1), W2∧(b about W2), W3∧(b about W3).
3. For the towns that pass: which tension the frame would open on if the chosen one is the tension about the strain of the highest grade (W1 before W2 before W3 is NOT given: report, for each passing town, which strains it holds and which tensions match which strain, so the seat can choose the order), and the distribution of the matched tensions' types.
4. Five passing towns and five failing towns (seed, tier), each with: its strains as read (the raw field values), its tensions' types and sides, and why it passes or fails.
5. Anything in the record that the definition cannot read as written (a field missing, a field always empty, a field always set): name it with its count. That is a finding, not a failure.

## Rules

- Measure only. Do not edit `src/`, `tests/`, `package.json`, `package-lock.json`.
- Your measure script lives in the scratchpad while you run it; its FINAL text goes, whole, into your results file (below) so the measure can be re-run.
- Write ONE file, `docs/chair/2026-11-20/content/frame2/B1-CF11-COUNT-RESULTS.md`: the tables, the classification of tension types, the samples, the findings, the script. Hours read from `date -u` in the command that writes them.
- Commit that ONE file on `lane/frame-2-2026-11-20` with `git add <that path>` and `git commit` (hooks on; never `--no-verify`); message `docs(FRAME-2 · B1): CF11's count on the 330 calm towns`, ending with the two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1SkacgZyeUgMMGhdL4`.
  Do NOT push. Do not touch any other path. Do not reset, stash, or check out.
- No environment variable GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command you run.
- Time budget: aim to have the file committed within 20 minutes. If a field cannot be found in 5 minutes, report it as a finding and move on.
- Your final message: at most 250 words: the union and union∧(b) totals by tier, the commit sha, and any finding.
