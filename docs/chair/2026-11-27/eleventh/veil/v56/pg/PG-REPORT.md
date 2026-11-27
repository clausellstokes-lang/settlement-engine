# PG (VEIL-56's builder seat): FAIL-CLOSED PAGES' ARM UNDER RULING V29

## 1. WHERE THIS SEAT STANDS (written 2026-11-27T23:41:40Z by `date -u`)
- Code branch `lane/veil-56-2026-11-27-pages-wip`: AT 04fa8d60e (the predecessor's tip). NOTHING CHANGED YET. NOT PUSHED (no commit to send).
- Docs branch `lane/veil-56-2026-11-27-pg-docs` (this file): on `origin/lane/veil-56-2026-11-27` ad35ca29d.
- DONE AND CONFIRMED: the box (unshallowed, `npm ci` rc 0, the ledger ref by its own name). The predecessor's RED reproduced at
  1ffb2328b (its three test files copied in: 8 failed, 9 passed, each red an assertion, e.g. `r2r-city-24 P1: no band read from
  nothing: expected 'Contained' to be undefined`) and its GREEN at 04fa8d60e (3 files, 17 of 17). THE TWO POOLS of 140 (recipe
  below). THE MEASURE (V29 (1) and (2)(a)(c)) on both pools at three markers, and the CAUSE run for (1).
- STOPPED, AS THE BRIEF ORDERS: (2)(c) found keys that differ from the owner's stored value. That goes to the parent before any cure.
  (1)'s cure also waits, because the measure shows the ruling's two named rows are not the whole class (section 2).
- NEXT COMMAND (after the parent's word): the cure of (1) on the code branch, red first, in `tests/components/failClosedSharedPage.test.jsx`.

## 2. THE FINDINGS (CONFIRMED: executed by the probes below)
THE POOLS. TODAY-BORN = 140 births (the tell gate's seeds `r3m-<size>-<crisis>-<k>-<idx>`) born on this tree at 04fa8d60e,
publicProse composed (140 of 140). MASTER-BORN = the same seeds born by origin/master db832c892 (no publicProse: 0 of 140). Both
made with `docs/chair/2026-11-20/veil/out/v33/legacy/dump.sh` at d71a3ee44, `LP_A=0 LP_B=0 LP_TOWNS=1`, an empty pool, on
detached worktrees (master's `node_modules` linked: package-lock.json byte-identical, `cmp`). The dump door names an uncommitted
`/var/tmp/v18/rv9/vitest.config.mjs`. I wrote a stand-in for it: `probe/rv9.vitest.config.mjs`.
THE PAGE: `gallery.js :: sanitizeDossier`'s served path, as `failClosedSharedPage.test.jsx :: pagesOf` builds it, at three
markers: DEFAULT (the share veil with no deltas), ALL-SHOWN (the probe's "everything shown"), WIDEST (every grouping and every
hideable house hidden). THE ORACLE: the raw stored town (the owner's stored values; the owner's rows = `toPublicSafe(record)`
rendered, as the predecessor's P0).

### (1) THE FALSE BAND: THE CLASS IS WIDER THAN THE TWO NAMED ROWS
Foundations rows CHANGED (owner's band, then the page's band) at ALL-SHOWN, and how many of them the OWNER'S stored severity
cures. Cure run: the same page with each condition's severity set to the stored value, rendered again (`probe/cause.probe.jsx`):
| pool | changed rows | cured by the stored severity | not cured (another cause) |
|---|---|---|---|
| today-born | Trade connectivity 4, Defense readiness 4 | ALL 8 | none |
| master-born | Infrastructure 43, Defense readiness 12, Trade 3, Social trust 2, Labor 1, Strength of the powers 1, Religious authority 1 | Trade 3, Social trust 2, Labor 1, Strength 1, Defense 2 | Infrastructure 43, Defense 10, Religious 1 (the (2)(c) class below) |
So the re-derived severity puts a false band on "Trade connectivity", "Social trust" and "Strength of the powers", not only on
"Labor capacity" and "Defense readiness" (Labor capacity is wrong on 0 of 140 today-born and on 1 of 140 master-born).
Example: r3m-metropolis-wartime-1-139, Trade connectivity "Adequate" becomes "Strained".
ROWS LOST BY THE CURE, per pool (rows that print today and read a re-derived severity; a row "reads" a condition's severity
where the condition's `affectedSystems` names the row's variable: `causalState.js :: applyConditions`):
| reading of V29 (1) | today-born (default / all-shown / widest) | master-born (same) | wrong rows it leaves |
|---|---|---|---|
| THE TWO NAMED ROWS (Labor capacity; Defense readiness) | 89 / 92 / 89 (Labor 34, Defense 55-58) | 64 / 65 / 64 (Labor 34, Defense 30-31) | today: Trade 4; master: Trade 3, Social trust 2, Strength 1 |
| EVERY ROW THAT READS A RE-DERIVED SEVERITY | 374 / 377 / 374 | 349 / 350 / 349 | none of this cause |
The general reading also takes away: Public legitimacy 94, Trade 76, Strength of the powers 60, Social trust 48, Food 4 and
Housing pressure 3, on top of Defense and Labor. The ruling's words ("where a severity is re-derived, the row is not printed")
read as the general rule, and its two names as the rows the slice happened to show. THE PARENT RULES WHICH.
THE CAUSE, ONE LINE FOR THE PUT-BACK (B4): the served document carries only the condition's band (`severityBand`, tier 2), not
its number; the page puts back the band's fixed default (`activeConditions.js :: defaultSeverityForBand`: 0.15 / 0.35 / 0.6 / 0.85).
105 of 111 stored severities differ from it (e.g. r3m-city-indebted-0-36: stored 0.23, page 0.15). Every Foundations row scales
that number (`applyConditions`: `Math.round(cond.severity * scale)`), so a row near a band edge crosses it.

### (2)(a) PRESENCE: every key `rederiveForPage` puts back, where the owner's record holds it and the page holds its parent
At every marker on both pools: scores (6), gates, economyOutput, recentConflict and every condition's severity are PRESENT (0 absent).
ABSENT, each with what is printed instead:
| key | today-born (default / all-shown / widest) | master-born (same) | what the page does |
|---|---|---|---|
| safetyProfile.blackMarketCapture | 140 / 140 / 140 | 140 / 140 / 140 | by design (put back only on an unmarked share); its rows fail closed (the predecessor's commit 1) |
| safetyProfile.crimeTypes | 140 / 0 / 140 | 140 / 0 / 140 | absent where the grouping is shut (by design); present at all-shown |
| defenseProfile.readiness.score | 8 / 2 / 8 | 63 / 63 / 63 | outside the served label's band (by design); the row fails closed (`readinessScoreWithheld`) |
So the arm's "0 absent" holds for 9 keys outright, and the other 3 are absent only by design. An arm can only assert "0 absent"
on those 9, and assert that each of the 3 fails closed where absent.

### (2)(c) PRESENT IS NOT RIGHT, at ALL-SHOWN (a share that hides nothing): each re-derived key against the stored value
| key | today-born: compared / differ | master-born: compared / differ | example (master-born, r3m-city-indebted-0-36 unless said) |
|---|---|---|---|
| activeConditions[].severity | 111 / 105 | 111 / 106 | stored 0.23, page 0.15 (the (1) class) |
| defenseProfile.scores.military | 140 / 0 | 140 / 133 | stored 75, page 100 |
| defenseProfile.scores.internal | 140 / 0 | 140 / 132 | stored 60, page 78 |
| defenseProfile.scores.economic | 140 / 0 | 140 / 122 | stored 61, page 89 |
| defenseProfile.scores.magical | 140 / 0 | 140 / 114 | |
| defenseProfile.scores.monster | 140 / 0 | 140 / 112 | stored 57, page 62 |
| defenseProfile.scores.disaster | 140 / 0 | 140 / 98 | stored 67, page 76 |
| defenseProfile.economicGates | 140 / 0 | 140 / 98 | stored {military 0.9, ...}, page {military 1, ...} |
| powerStructure.recentConflict | 140 / 0 | 140 / 124 | the same event in other words (master's writer and today's differ) |
| safetyProfile.crimeTypes | 140 / 0 | 140 / 76 | |
| defenseProfile.readiness.score | 138 / 0 | 77 / 70 | |
| economicState.compound.economyOutput | 140 / 0 | 140 / 0 | |
TODAY-BORN: only the severity differs. MASTER-BORN: every key but economyOutput differs on most towns. The cause, as I read it
(PLAUSIBLE, not traced line by line): the page re-derives with TODAY's engine over a document MASTER's engine wrote, and the two
engines' writers differ. Its print: Infrastructure condition wrong on 43 of 140, Defense readiness on 10, Religious authority on 1
(the "not cured" column of (1)).
(At DEFAULT and WIDEST the today-born pool differs too: internal 82, economyOutput 84, readiness 68, recentConflict 8. Those veils
hide houses, so the page re-derives over fewer houses. That is the veil working, not a fault.)

### (2)(b) THE PLANT, MEASURED (no guard built yet): a served document the engine cannot read
`probe/plant.probe.jsx`, at ALL-SHOWN. `rederiveForPage` runs on a copy with no `config`, and the config is put back
afterwards, so every re-derived key is ABSENT on an otherwise ordinary served document. Each tab's printed lines are diffed
against the normal page. LINES PRINTED ONLY ON THE PLANT (a reader printing from nothing):
| tab :: line | today-born | master-born | reader (CONFIRMED by its code) |
|---|---|---|---|
| Defense :: a threat row's badge "Critical" (also "Adequate"/"Strong" once its bar's score moves) | 112 (+5) | 106 (+23) | `DefenseTab.jsx :: DefenseTab`, `threatScores[label]\|\|0` then `scoreBand` |
| Overview :: a systems-health row's badge "Critical" | 103 | 101 | `OverviewTab.jsx :: ScoreRow`, `score \|\| 0` then `scoreBand` |
| Foundations :: "Infrastructure condition: Adequate" (the page said "Surplus") | 69 | 87 | `causalState.js`'s infrastructure deriver over the absent re-derived inputs (PLAUSIBLE: which input not yet traced) |
| Defense :: "What goes wrong at <town> goes wrong one thing at a time and belongs to whoever did it." | 2 | 0 | a crime-structure sentence read off the absent crime list (PLAUSIBLE; it may also print on a default-veil page, where the list is absent by design: not yet measured) |
Lines the plant DROPS (silent: no row, no sentence): Foundations 385 / 280, Defense 798 / 796, Summary 420 / 420, Overview
277 / 269, Economics 140 / 140 (today / master).

### AN ASIDE (CONFIRMED, not mine to cure)
The owner's raw record and the owner's public read (`toPublicSafe`) print different Foundations rows on 121 of 140 today-born
towns and 122 of 140 master-born (for example Social trust "Adequate" against "Strained", r3m-city-infiltrated-0-32). The
predecessor's P0 is the public read. The owner's own page renders the raw record.

## 3. RECIPE (every input; the data is not committed)
    git worktree add --detach /home/user/master56 db832c892; ln -s <checkout>/node_modules /home/user/master56/node_modules
    LP_A=0 LP_B=0 LP_TOWNS=1 sh dump.sh <checkout> /var/tmp/v56/stored-today  /var/tmp/v56/emptypool    # dump.sh at d71a3ee44
    LP_A=0 LP_B=0 LP_TOWNS=1 sh dump.sh /home/user/master56 /var/tmp/v56/stored-master /var/tmp/v56/emptypool
    sh probe/run-measure.sh     # measure.probe.jsx on both pools (through gate-mutex), then: node probe/an.mjs /var/tmp/v56/measure-<pool>.json
    SRC=<checkout> POOL=/var/tmp/v56/stored-<pool> OUT=/var/tmp/v56/cause-<pool>.json RV9_PROBE=probe/cause.probe.jsx npx vitest run --config probe/rv9.vitest.config.mjs
Logs: `logs/an-today.txt`, `logs/an-master.txt`, the dump metas.
