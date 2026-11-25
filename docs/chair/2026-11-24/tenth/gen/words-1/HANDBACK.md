# WORDS-1 — HAND-BACK (a seat of the tenth chair; kept current at every push)

Law: `docs/chair/2026-11-24/tenth/prompts/START-WORDS-1.txt` and `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`. The chair is
session_019yED1SUxGVHyjQnoqoFvQ8; CLOSE-7 is session_019yED1QNMqSLp7ohcZB88VP. A successor reads those two files, then this section.

## 0. WHERE THE SEAT STANDS: THE WHOLE MEMORY (written 09:02 UTC 2026-11-25)

BASE: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d8 (point 116 lit, the guard merged, engine '0.10.0').
MY BRANCH: `lane/words-1-2026-11-25` (this file, tools, reports). Units go up as `lane/words-1-2026-11-25-<unit>-wip`, cut at
the base. No other name is pushed. No pull request, ever.

FIRST MESSAGE SENT to the chair at about 09:01 UTC (order E1, E8, D6).

THE UNITS, IN ORDER:
1. E1, the double possessive as a class. THE CHAIR RULES its cure: measure (count, by template or joiner, three examples
   each, on C and V lit), then ONE message with a proposed form per source; build nothing of E1 until the ruling.
2. E8, a reflexive slot ("themselves" agrees with the right person; the ninth chair's N26, amended by N28: today the two
   THEY_BOUND later mentions skip the pronoun and take the next rung). Measure, red first, build, a check over every birth.
3. D6, the contender's word (intake 11; SCOPE-LINE decision 2). THE CHAIR PICKS: three wordings, each with the count of
   pages it changes and one page read whole with it. The word only; no standing, seat or tie changes.

GROUND:
- Corpora: C = `tools/make-plan.mjs` (dp-<size>-<i>, i 0..149, config {settType}); V = `tools/make-visitor-plan.mjs` over
  `tools/plan-lit.json` (the chair's, copied). Plans in the scratchpad as planC.json / planV.json (regenerable).
- The page battery: `tools/page-battery.mjs` + `page-battery.render.census.jsx` (CLOSE-7's READ-25 runner, copied verbatim).
  Base renders WITH VIEWS: `node tools/page-battery.mjs --plan=planC.json --out=base-C --tree=/home/user/wt/base --views`
  (and V), through `scripts/gate-mutex.sh --run`, about 15-18 min each on 4 workers.
- `/home/user/wt/base` is a detached worktree at 0ec96f13d (node_modules linked): read and run, never committed.

IN FLIGHT: the base renders of C and V with views (scratchpad base-C/, base-V/), started about 09:01 UTC.
NEXT STEP: from the printed views, count every sentence with two possessives in a row, attribute each to its template or
joiner by reading the code, and send the E1 ruling message.
