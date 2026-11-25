# WORDS-2 HAND-BACK (a seat of the tenth chair; branch `lane/words-2-2026-11-25`)

## 0. WHERE THE LANE STANDS: THE WHOLE MEMORY (written 09:04 UTC 2026-11-25; kept current at every push)
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
- Base worktree for measures: `/home/user/wt/base` (detached at 0ec96f13d8, node_modules linked).
- Gate mutex: `GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- <cmd> > log 2>&1; echo "exit=$?" >> log`.

### 0.2 Units, in order (state)
| unit | what | state |
|---|---|---|
| E2 | census of section pairs that disagree on one page (C and V); top 15 with a one-line cure and size to the chair; THE CHAIR RULES | measure running (battery with views on base, C then V) |
| E4 | "no market" said twice on one page: GEN-13 NO-MARKET beside ECO-1 C4 v6 | reading done; measure from the views |
| E3 | "grazing rights" pressure line on thorps: the cause is a precedence CASCADE (`governanceNarrative.js :: deriveBaselineConflict`), the grazing line its last fall-through, not a weighted pool | measure from records (branch taken by size) |
| E5 | dawnWork W11, B19, gatheringPlaces P13: `ruler: elder` -> `office: elders` | to build after the count |
| E6 | L12 re-land (cut at 1387e6ec5, DAILY-4 (0a)); E107's shape needs a steward's-house atom: the vocabulary has none (`house` keys are the cause houses only) -> the chair's leave (COMMON-RULES 6) for an `institution:` kind row + the HOUSE_FAMILY_KINDS answering row | leave to be asked with the count |
| E9 | occupied place's state line (THE CHAIR RULES) + the always-cut clause removed at source | not started |
| E12 | readerCorpusManifest test holds the clock | not started |
| E10, E11 | tools' faults (voice walker pattern/prose; timeout ratchet paren matcher) | not started |
| E7 | PDF's narrower import; stale sameness row; unused `ai.dailyLife.*` keys; NAME ONLY the server's AI function and its price row | not started |

### 0.3 Next step
Read the base battery and records; send E2's census and the rulings asked (E3 weight if any, E6 leave, E9) in one message each.
