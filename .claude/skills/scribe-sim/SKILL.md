---
name: scribe-sim
description: >-
  Test the Scribe (AI-written dossier prose) WITHOUT an Anthropic API key by seating a
  fresh-context Claude agent as the model over the harness's exact prompt, answering the tier-1
  checklist with a second seat, and scoring both with the product's own judge. USE THIS SKILL
  whenever the Scribe's prompt, card, refuter, tier-1 checklist or model choice changes and the
  question is "does it write lawful, true, good prose now, and what falls to the corpus and why" —
  before any live pilot, and after any edit to src/domain/prose/scribeBrief.js, townCard.js,
  refuteUnit.js or supabase/functions/scribe-render. Arguments: [seeds/tiers/tabs to run, or
  "baseline" for the Spitzplatz defense cell].
---

# scribe-sim — the pilot without a key

The harness lives in the rewrite kit: `$H = $SC/kit/scribe-harness` where `$SC` is
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad`.
It imports the Scribe's ONE prompt builder and ONE judge from the dock `$SC/kit/lane-scribe`
(`src/domain/prose/scribeBrief.js`), so what it measures is what the edge function ships.
`node lib/pin.mjs` proves the VOICE and the exemplar pack are byte-equal between the product and
the kit; run it first.

## One cell by hand
1. `node simulate.mjs build --seed <seed> --tab <tab> --type <hamlet|village|town|city|metropolis>`
   → `out/sim/<seed>/<tab>/{brief.md,town.md,turn.md,schema.json,card.json}` and the pool list
   with each spine's order id. brief + town are the CACHED system blocks; turn is volatile.
2. Seat a WRITER: a fresh-context Agent (model = the seat under test) told to read exactly
   brief.md, town.md, turn.md, schema.json and nothing else, and to Write the JSON object to
   `response-<seat>.json`. Purity matters: it must see no other file, no memory, no codebase.
3. `node simulate.mjs tier1 --seed … --tab … --type … --response response-<seat>.json --tag <seat>`
   → runs tier 0 and writes `tier1-<seat>.md` (the second reader's prompt) + `tier1-schema.json`.
4. Seat a READER (Opus): reads tier1-<seat>.md whole, answers the seven questions per line
   strictly from the facts printed there, Writes `answers-<seat>.json`.
5. `node simulate.mjs judge … --response response-<seat>.json --tier1 answers-<seat>.json --tag <seat>`
   → per-unit verdicts with the arm and its reason, the tally, `judged-<seat>.json`, `page-<seat>.md`.
   FAIL falls to the corpus; WITHHELD ships; a tier-1 `yes` drops the unit with arm `T1-<QUESTION>`.
6. READ THE PAGE YOURSELF against `card.json`: an instrument cannot see a plausible addition
   (a fine, a debt, a backlog the card does not hold). Record what you find.

## The whole grid
`Workflow({scriptPath: '<repo>/.claude/workflows/scribe-sim.workflow.js', args: {harness: '$H',
cells: [{seed, type, tab, name}, …], seats: ['opus','sonnet']}})` — one writer per (cell, seat),
one Opus reader per pair, no barrier; returns rows and aggregates by seat, tab and tier. Build
the cells first (step 1) — the workflow does not build.

## What the numbers decide
- shipped share (`finalKept / poolsOnCard`) by seat and tab → model-per-tab (design §12 item 8);
- `CORPUS-DIFF` on spines → ruling 27 (demote the order arm to WITHHELD if > 1 in 10 after the
  card carries the order);
- `T1-MECHANISM` and your own read → the invented-mechanism rate the pilot exists to measure;
- `T1-SAMEPAGE` → whether the writer's turn needs the page's machine lines (held at W3a).
Record the run in `$SC/kit/briefs/SCRIBE-SIM-<date>.md` and the RESUME-NOTE; the figures are
CONFIRMED only for what you executed; tokens-by-the-API, cache reads, dollars and wall-clock are
the key's and are never estimated here as fact.
