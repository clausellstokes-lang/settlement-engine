# BRIEF: PROOF (4) OF THE JOINED TIP (START-CLOSE-8 unit (4); the chair's G42 additions; G43 (4)). ONE BUILDER. A MEASURE.

Nothing under src/, tests/ or scripts/ changes in any tree; no commit in any code worktree. Outputs go under
`/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/proof/` (raw data as *.jsonl or in sub-directories named
`*-C`, `*-V`, kept out of git by CLOSE-8); the report is `proof/PROOF-4.md` if your write is allowed, else your final answer.

## THE TWO TREES
- BEFORE: `/home/user/wt/before`, detached at the LINE's tip 09c29806b85a0a636c1e539922d57edede7b0ba9 (point 117). Its page battery
  on C and V (with `--views`) is ALREADY RENDERED: `/tmp/claude-0/-home-user-settlement-engine/f9f37e55-dc9e-512d-9953-f1c7274d335f/scratchpad/before-C`
  and `before-V` (900 rows each; `rows/<seed>.json` carry recordHash, pageHash, rows and printed views).
- AFTER: `/home/user/wt/join` at the tip CLOSE-8 names in your prompt (every unit and cure in it). Read-only for you.

## TOOLS
- CLOSE-8's: `close-8/tools/` (make-plan.mjs, make-visitor-plan.mjs, plan-lit.json; page-battery.mjs + render; births.mjs +
  births.census.jsx; measure-keys.mjs; BIRTH-1's check-d2.mjs, check-d2b.mjs, check-d7.mjs, measure-d2.mjs, measure-d2b.mjs,
  measure-d3.mjs, measure-d7.mjs; goals-i13.census.jsx). Plans C and V: `node make-plan.mjs planC.json`,
  `node make-visitor-plan.mjs plan-lit.json planV.json` (the same plans the BEFORE battery used).
- Each seat's tools, by `git show origin/<branch>:<path>` into a directory OF YOUR OWN under `close-8/proof/tools/<seat>/` (inside
  the main checkout so its node_modules resolve): BIRTH-1 `lane/birth-1-2026-11-25:docs/chair/2026-11-24/tenth/gen/birth-1/tools/`
  (measure-d5.mjs too); BIRTH-2 `lane/birth-2-2026-11-25:docs/chair/2026-11-24/tenth/gen/birth-2/probes/` (p9check.mjs,
  p9beasts.census.jsx, d4order.census.jsx, d4sum.mjs); WORDS-1 `lane/words-1-2026-11-25:docs/chair/2026-11-24/tenth/gen/words-1/tools/`
  (e1-measure.mjs, joined-proof.mjs, e8-check.mjs, e8-classes.mjs, e8b-roundtrip.mjs, e8b-successor.mjs, d6-measure.mjs,
  d6-owed.mjs, e13b-proof.mjs, twin-dump.mjs, twin-strings.mjs); WORDS-2 `lane/words-2-2026-11-25:docs/chair/2026-11-24/tenth/gen/words-2/tools/`
  (e2-pairs.mjs, e4-nomarket.mjs, e3-slots.mjs, e3-pressure.mjs, e5-elder.mjs, e69-facts.mjs, e13a-door-slots.mjs,
  unit-attribute.mjs, before-after.mjs, records-dump.*). Read each tool's HEADER only, to run it.
- Each seat's hand-back section 0 says how it ran its check and what it reported (`docs/chair/2026-11-24/tenth/gen/<seat>/HANDBACK.md`
  on the seat's branch): grep it for the unit; do not read it whole.

## WHAT TO PRODUCE, IN THIS ORDER
1. THE AFTER BATTERY on C and V on the join (`page-battery.mjs --plan --out --tree=/home/user/wt/join --workers=3 --views`). A
   worker can die on a metropolis (seen at 4 workers): re-render the missing seeds as a fill plan and fold their rows in, then
   `--from` to recount. Then `--diff=<before>,<after>` for each corpus.
2. THE BEFORE-AND-AFTER TABLE (G42: against the LINE's tip, births re-born on both trees): for C and V, places moved by RECORD
   HASH and pages moved by PAGE HASH; the battery rows gained/lost by pattern. EVERY moved place and every moved page ATTRIBUTED
   to a NAMED unit by that unit's own words/fields (WORDS-2's unit-attribute.mjs and WORDS-1's joined-proof.mjs/twin-strings.mjs are
   built for this; BIRTH-1's measure-keys per field; a cure's own figures): the count UNEXPLAINED must be 0; any unexplained place
   or page is listed with its seed and the first differing field/line, and is a STOP to CLOSE-8 (do not guess a unit).
   Known: P9's C dp-thorp-2 and -3 are render noise (a "Patron deity" block on the Power view flips between two hashes on the
   same tree): show it by rendering those two twice on the SAME tree.
3. EVERY UNIT'S EVERY-BIRTH CHECK on the joined tree, each line "<unit>: <figure C>/<figure V> — 0 as its seat reported" or "the
   number it now reads, and why": D2 (check-d2), D2b (check-d2b), D3 (measure-d3: stale 0/0), D5 (measure-d5: R13 breaks 0),
   D7 (check-d7), D4 (d4order/d4sum: records 0), P9 (p9check: 0/0), E1 (owner pages AND public projection 0/0), E8 (e8-check: 0
   disagreeing), E8b (e8b-roundtrip 0/0; e8b-successor 0 differing), D6 (flag vs oracle 0/0), E13b (e13b-proof: behaviour-aside
   hash equal; residual about C 16, V 9), the WORDS-2 census pairs by number (#1, #3, #4, #6+7, #8, #9, #10, #11, #13: each to its
   unit's after figure; #3's crisis-set rungs as G34 reported), E5 (e5-elder), E6 (e69-facts), E9 (0 pages), E13a (the three
   Viability slots), E3 (the FOUR-COLUMN table, e3-slots: compared cell by cell to WORDS-2's "G13 (built)" column in RULING-G
   G13's table; each differing cell named with its cause: G43 makes D3's re-write path apply E3's rule, which is the ruled
   behaviour), NEED-ATOM (leaf vs page 0/0), GOALS-I13 (goals-i13.census: 0/0), and the CHAIR's G43 commit (D3's check 0).
4. THE BUILD: `npm run build` in the join through the mutex, then `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js
   tests/build/generationWorkerLazy.test.js` (read their headers for where the figures print): first paint raw/gzip/Brotli, the
   generation worker, the engine chunk, beside the line's (1,182,894 / 376,732 / 316,604; worker 2,722,294; engine 934,213) and
   the budgets (1,175,492 / 373,999 / 313,994; 2,579,708; 909,928). NEVER `npm run build:edge-shared`.

## LAWS
- Every battery, births run, build and vitest run through `GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- <cmd> >
  <log> 2>&1; echo "exit=$?" >> <log>`; one heavy run at a time; logs read by tail/grep; never a gate through a pipe.
- CONFIRMED (run) or PLAUSIBLE (read) on every figure. A permission refusal stands: report it, try nothing else.
- Write partial results to your report file after every step (a container restart can cut you).

## REPORT (at most 350 words + ONE table) as your final answer
The table of (2) by corpus; the list of (3) one line a unit; the five sizes; every STOP.
