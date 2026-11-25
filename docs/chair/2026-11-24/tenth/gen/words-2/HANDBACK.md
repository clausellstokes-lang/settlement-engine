# WORDS-2 HAND-BACK (a seat of the tenth chair; branch `lane/words-2-2026-11-25`)

## 0. WHERE THE LANE STANDS: THE WHOLE MEMORY (written 10:09 UTC 2026-11-25; kept current at every push)
A successor reads `docs/chair/2026-11-24/tenth/prompts/START-WORDS-2.txt` and `START-GEN-COMMON.txt` (on
`lane/chair-2026-11-08`) whole, then this section, and needs nothing else.

BASE: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d8 (point 116, the troubles rule lit, the guard merged; engine
'0.10.0'). Every unit is cut there as `lane/words-2-2026-11-25-<unit>-wip`, built in its own worktree (`/home/user/wt/<unit>`,
hooks linked: `ln -s /home/user/settlement-engine/.husky/_ <wt>/.husky/_`).

THE CHAIR: session_019yED1SUxGVHyjQnoqoFvQ8. CLOSE-7 (takes every unit's hand-in): session_019yED1QNMqSLp7ohcZB88VP.
First message to the chair sent 09:00 UTC.

### 0.1 Tools (this branch, `docs/chair/2026-11-24/tenth/gen/words-2/tools/`; N8)
- `make-plan.mjs`, `make-visitor-plan.mjs` (+ `plan-lit.json`): the corpora C and V, copied unchanged from CLOSE-7's
  `close-7/read24/`. C: `node make-plan.mjs planC.json`; V: `node make-visitor-plan.mjs plan-lit.json planV.json`.
- `page-battery.mjs` + `page-battery.render.census.jsx`: CLOSE-7's `read25/` battery, unchanged. Run with `--views` to keep
  each birth's printed views (`rows/<seed>.json` .printed). About 8 minutes for 900 births on 4 workers.
- `records-dump.sh` + `records-dump.census.jsx` (mine): each birth's whole record to `<dir>/<seed>.json.gz`.
- Measures (mine, each changes nothing): `e2-pairs.mjs` (E2's census over the battery's views), `e4-nomarket.mjs`,
  `e3-pressure.mjs` (records), `e5-elder.mjs` (records + the tree's dailyLife), `e69-facts.mjs` (E6 and E9, records).
- Base worktree for measures: `/home/user/wt/base` (detached at 0ec96f13d8, node_modules linked).
- Gate mutex: `GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- <cmd> > log 2>&1; echo "exit=$?" >> log`.

### 0.2 Units, in order (state)
Rulings in force: G3 (E4), G6 (E2's census: cure #10, #1, #6+7, #8, #9, #11; #3+4 measure first; #2, #5, #12 ruled out), all in
`docs/chair/2026-11-24/tenth/gen/RULING-G.md` on the chair's branch. Asked 10:13 UTC, NOT yet ruled: #3+4 (all inside), E3 (no
quarrel vs a pool), E6 (vocabulary leave), E9 (the occupied line), #6+7 (`exports` atom vs a posture row).
PROOFS: every unit is merged into a LOCAL scratch join `words-2-join-scratch` (/home/user/wt/join; never pushed) for ONE
tests/lint, ONE tests/copy, the units' own test files and the after-batteries C and V (`scratchpad/join-runs.sh`; logs
`join-own.log`, `join-copy.log`, `join-lint.log`, `battery-join-<C|V>.log`). E5 is not in the join yet (second pass).
Base measures: `scratchpad/base-{C,V}` (battery with views), `scratchpad/rec-base-{C,V}` (records).
| unit | branch, commit | state |
|---|---|---|
| E4 | `-e4-wip` 8280ffa61 | built (G3); red ARM 5 queued; expected move C 13 / V 41 |
| E9 clause | `-e9-wip` f530dce16 | built, red 1/1 |
| E12 | `-e12-wip` 35e87009c | red confirmed, green 18/18 |
| E10 | `-e10-wip` 753f3e337 | red 2/2, green 33/33 |
| E11 | `-e11-wip` 57538749c | red 4/4, green 22/22; its own tests/lint ran (log lint-e11.log) |
| E7 (c) | `-e7-wip` a9cb62003 | built; (a) measured: do not build; (b) sameness door not run |
| G6 #10 | `-g10-wip` e44a15264 | red, green 8/8 (shared pages unchanged) |
| G6 #1 | `-g1-wip` 6b68bbd08 | red (ARM 7), green |
| G6 #8 | `-g8-wip` f56efab9f | red 3/3, green 79/79 |
| G6 #9 | `-g9-wip` 4acf3ee51 | red, green 144/144 (leaf wallYield.js at two read sites) |
| G6 #11 | `-g11-wip` dba2df45e | red, green 7/7 (page-level; stored line unchanged) |
| E5 | `-e5-wip` 4e09a3fda | red 2/2, green 20/20 (re-key to office: elders) |
| E3, E6, E9 line, #3+4, #6+7 | - | waiting on the chair (10:13) |

### 0.3 Next step
Read the join's logs; build the census table (before = base, after = join) for every unit with the 15 pairs re-run; hand in each unit to CLOSE-7 and the chair; build what the 10:13 rulings allow.

(older:)
Read the base battery and records; send E2's census and the rulings asked (E3 weight if any, E6 leave, E9) in one message each.
