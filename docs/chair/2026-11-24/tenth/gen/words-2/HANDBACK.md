# WORDS-2 HAND-BACK (a seat of the tenth chair; branch `lane/words-2-2026-11-25`)

## 0. WHERE THE LANE STANDS: THE WHOLE MEMORY (written 09:42 UTC 2026-11-25; kept current at every push)
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
Proof logs live in the scratchpad (`push-*.log`, `<unit>-red.log`, `<unit>-green.log`, `<unit>-copy.log`, `<unit>-lint.log`,
`battery-<tree>-<C|V>.log`); the queued chains are `e12-runs.sh`, `e9-runs.sh`, `e4-runs.sh` (each line through the mutex).
| unit | branch, commit | state |
|---|---|---|
| E2 | (measure) `E2-CENSUS.md`, `e2/` | census on C and V sent to the chair 09:42 for ruling (top 15; I recommend 1, 3, 6, 10, then 9, 11, 12). NOTHING BUILT. |
| E4 | `-e4-wip` 8280ffa61 | RULED G3 (yield clause stays; C4 v6 re-worded in place, closing clause kept: C4 = rank <= 2). Expected move C 13 / V 41 pages. Proofs queued (`e4-runs.sh`): red ARM 5 on base, green, copy, lint, batteries C/V on the e4 tree. Then hand-in. |
| E3 | - | cause read (a precedence CASCADE, the grazing line its fall-through); count by size waits for the records dump |
| E5 | - | waits for the records dump (`e5-elder.mjs`); candidate cure `excludes: ['office: headman']` vs the intake's `office: elders` |
| E6 | - | needs the chair's leave for three vocabulary rows (an `institution:` kind for "Lord's steward", INSTITUTION_WORDS, HOUSE_FAMILY_KINDS answering row); count from the records dump |
| E9 | `-e9-wip` f530dce16 (the clause) | clause half BUILT, red 1/1; green/copy/lint queued (`e9-runs.sh`); the occupied-line half waits for its count (records) and the chair |
| E12 | `-e12-wip` 35e87009c | RED CONFIRMED (hold removed + crossing: 4 dossier PDFs differ); green queued |
| E10 | `-e10-wip` 753f3e337 (pushed) | red 2/2, green 33/33; `tests/lint` whole queued; then hand-in |
| E11 | `-e11-wip` 57538749c (pushed) | red 4/4, green 22/22; `tests/lint` whole queued; then hand-in |
| E7 | `-e7-wip` a9cb62003 (c) (pushed) | (c) built; (a) MEASURED: 15 files enter the PDF only through dailyLife.js, a leaf can spare 1 (the owner-only slot's): (a) not to be built, say so in the hand-in; (b) the sameness door `--write` (heavy) to run |

### 0.3 Next step
Read the base battery and records; send E2's census and the rulings asked (E3 weight if any, E6 leave, E9) in one message each.
