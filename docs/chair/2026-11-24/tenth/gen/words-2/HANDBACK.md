# WORDS-2 HAND-BACK (a seat of the tenth chair; branch `lane/words-2-2026-11-25`)

## 0. WHERE THE LANE STANDS: THE WHOLE MEMORY (written 09:18 UTC 2026-11-25; kept current at every push)
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
| unit | what | state |
|---|---|---|
| E2 | census of section pairs that disagree on one page (C and V); top 15 with a one-line cure and size to the chair; THE CHAIR RULES | battery with views on base running (C then V); census script written (lexicon of claims, place sentences only) |
| E4 | "no market" said twice | MEASURED on C (800 of 900): 389 pages say it twice, nearly every no-market page; the main echo is the ruled yield line `outputInWords.js` ("held back by having no market", the chair's ruling of 2026-11-20 15:16) beside GEN-13 NO-MARKET; C4 v6 echoes on 13. A RULING IS NEEDED (size changes from 16) |
| E3 | "grazing rights" pressure line: the cause is a precedence CASCADE (`governanceNarrative.js :: deriveBaselineConflict`), the grazing line its last fall-through, not a weighted pool | measure from records (script ready) |
| E5 | dawnWork W11, B19, gatheringPlaces P13 on `ruler: elder` | measure from records (script ready); candidate cure `excludes: ['office: headman']` (no new vocabulary) vs the intake's `office: elders` |
| E6 | L12 re-land (cut at 1387e6ec5, DAILY-4 (0a)); E107's shape needs a steward's-house atom: none exists (`house` keys are cause houses) -> the chair's leave (COMMON-RULES 6) for an `institution:` kind row + the HOUSE_FAMILY_KINDS answering row | count from records (script ready), then the leave asked |
| E9 | occupied place with GEN-17 GARRISONED gets no line (v1, v2 refuse `crisis: occupied`); the always-cut clause = GEN-17 GARRISONED v2 "and the money is found every season" (pinned at 0 pages in `tests/helpers/oppositeSentencePairs.mjs :: PINNED_TAILS`); removal at source = a WORD_CORRECTIONS row in `scripts/generate-dossier-state-prose.mjs` | count from records (script ready) |
| E12 | `lane/words-2-2026-11-25-e12-wip` (worktree /home/user/wt/e12): the arm holds `Date` at READER_NOW per pass and simulates the wall clock crossing midnight between passes | BUILT, uncommitted; red-first and green owed (heavy: waits for the mutex) |
| E10 | `lane/words-2-2026-11-25-e10-wip` 753f3e337: the walker's pattern class (RegExp argument; declared consts, table empty) | BUILT, red 2/2, green 33/33; `tests/lint` whole owed; pushed? see push-e10.log |
| E11 | `lane/words-2-2026-11-25-e11-wip` 57538749c: `codeMask` under the hook matcher; parser oracle over the corpus | BUILT, red 4/4, green 22/22; `tests/lint` whole owed |
| E7 | (a) BY READ: the PDF chapter prints all 8 public slots, which read all 7 derivations of `buildContext`; a narrower leaf spares only the owner-only slot's file: the 629->644 rise cannot be undone that way (to measure: the closure with and without); (b) the stale sameness row; (c) `en.js` `ai.dailyLife` keys (line ~764); NAME ONLY the server's AI function and price row | not started beyond reading |

### 0.3 Next step
Read the base battery and records; send E2's census and the rulings asked (E3 weight if any, E6 leave, E9) in one message each.
