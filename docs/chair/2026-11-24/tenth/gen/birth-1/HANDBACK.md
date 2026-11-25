# BIRTH-1 — HAND-BACK (a seat of the tenth chair; kept current at every push; for a reader who has never seen this session)

## 0. WHERE THE SEAT STANDS: THE WHOLE MEMORY

### 0.0 Ground
- Seat: BIRTH-1, seated 2026-11-25 ~09:00 UTC. Prompts (read whole): `docs/chair/2026-11-24/tenth/prompts/START-BIRTH-1.txt` and
  `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`. The chair: session_019yED1SUxGVHyjQnoqoFvQ8; CLOSE-7: session_019yED1QNMqSLp7ohcZB88VP.
- BASE: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d (point 116 lit, the guard merged, engine '0.10.0').
- My branch `lane/birth-1-2026-11-25` (this file, the tools, the measures). Units go up as `lane/birth-1-2026-11-25-<unit>-wip`, cut at the base.
- Worktrees (container only): `/home/user/wt/base` (detached at the base: the "before" tree, never changed), `/home/user/wt/d2` (-d2-wip).
  Each has `node_modules` and `.husky/_` linked to the main checkout; both names are in `.git/info/exclude` (the lighting door refuses a dirty tree).
- Corpora: C = `tools/make-plan.mjs` (dp-<size>-<i>, `{ settType }`), V = `tools/make-visitor-plan.mjs` over the chair's
  `docs/chair/2026-11-24/tenth/read/plan-lit.json`. Both born as the page battery births them (`birthConfig(row.config)`).
- Tools (`gen/birth-1/tools/`): `births.mjs` + `births.census.jsx` (births a plan on a tree, 4 workers, ~0.8 min per 900; a MEASURE module
  per unit, optional `onStep`; row `raw: true` births without birthConfig, as the dark golden does); `measure-d2.mjs`, `check-d2.mjs`
  (D2's every-birth check and its before/after: exit 1 if after holds a fault); `measure-d3.mjs`; `make-golden-plan.mjs` (the golden's 525
  rows, dark with `--raw`, else lit); `page-battery.mjs` + render (CLOSE-7's, copied verbatim).
- Gate: `GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- <cmd> > log 2>&1; echo "exit=$?" >> log`.
- Known reds at the base (RED-AT-LINE and measured at /home/user/wt/base): the two goldens (dark master, espionage's driven golden),
  rosterFinalUnderHeldRoster A1 (golden corpus), proseComposed A0b, proseCorpusBytes RAW/GZIP (state-prose data files, not mine),
  narrativeQualityCorpus "ties of one archetype…" and "all 18 archetypes…", defenceParts R13.

### 0.1 Units
- **D2 — DONE, PUSHED** on `lane/birth-1-2026-11-25-d2-wip` at 4ea69f420: d590c4bd2 (cure + test), e6fe5b586 (lighting census door:
  files 3798 -> 3799, parked 494 -> 495), 4ea69f420 (the test moved to `tests/domain/prominentTieNotCovert.test.js`: tests/generators is
  a mutation-manifest enforcer tree). Governing run at e6fe5b586 (66 files naming the two fields or the module + tests/lint whole: 287
  files, 4,489 tests): 13 red, ALL on RED-AT-LINE (goldens x2, the two golden-corpus A1s, proseComposed, proseCorpusBytes x2,
  narrativeQualityCorpus x2, powerStructure F31 (relationshipArchetypes.js, at the base), editCorpusRatchet A3/A7) except the manifest
  TOTALITY, cured by the move (re-run green with the lighting and negative-anchor walkers, 80/80). D2 touches no src/data or src/domain,
  so tests/copy is not owed.
  - Measured at the base (oracle: the raw record's covert ties): C prominent=covert 8, pressure names both ends 5; V 7 and 3 (+1 V
    prominent joining a covert pair by an open reverse tie). The chair's "one in eighteen" is the lit golden corpus's rate (32 of 525),
    not C/V's (under 1 in 100).
  - Cure: `power/settlementNarrative.js :: genRelNarrative` picks the best tie that is not covert AND does not join a covert pair (my
    call, vetoable: the chair's check "no pressure sentence names both ends of a covert tie" needs it; two V hamlets otherwise told an
    open reverse tie of the hidden pair). Draws unchanged (scores over every tie; the rumour drawn whatever is picked).
  - After: 0 / 0 on all 1,800. Records moved C 13, V 9: only `prominentRelationship` / `pressureSentence` (every other field's sha256
    equal). Page battery rows moved 0. Tables and the moved births' sentences: `gen/birth-1/d2/`.
  - FROZEN SURFACES MOVED (named for the owner, NOT re-recorded): the dark golden master 15 of 525 rows (`d2/golden-dark-rows.txt`,
    already red at the base); the lit twin 32 of 525 (`d2/golden-lit-rows.txt`, unsigned); espionage's driven golden and
    rosterFinalUnderHeldRoster A1 read the same corpus (already red).
  - Written down, not chased: a pressure sentence equal to the prominent tie's phrasing (printed twice) is a class at the base
    (C 11, V 10); D2 adds one (V dp-hamlet-76).
- D3 — NEXT. Read so far: `recentConflict` is written by `power/governanceNarrative.js :: buildGovernanceLabels` at the power step
  from the power intent's roster; the assembly's late replay (`economyReconciliation.js :: reconcilePowerStructure`) re-runs the
  writer but keeps `stability` and not `recentConflict`; `coherenceRepairPass` adds houses after. History reads `recentConflict` too.
  Measure: `tools/measure-d3.mjs` (the writer re-run over the intent's roster and over the settled roster). Not yet run on C/V.
- D5, D8, D7: not started.

### 0.2 Next step
D2 handed in (UNIT line to CLOSE-7 and the chair). Next: D3's measure on C and V (`tools/measure-d3.mjs`).
