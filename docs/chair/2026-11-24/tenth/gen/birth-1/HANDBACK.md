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
- **D3 — BUILT, COMMITTED, NOT YET HANDED IN** on `lane/birth-1-2026-11-25-d3-wip` (worktree `/home/user/wt/d3`): bb77735cb (cure +
  test `tests/domain/powerSentenceSettledRoster.test.js`, red 7/13 at the base, 13/13 after), 0ecb6e25c (lighting door, files
  3798 -> 3799). Measured (oracle: the writer re-run whole over the final roster from the power step's intent, `tools/measure-d3.mjs`):
  C 0, V 4 stale (dp-hamlet-2, -100, -117: "The last harvest failed badly" beside the repair's Citizen militia; dp-town-15: a Street gang).
  After 0/0; records moved C 0, V 4, only `powerStructure.recentConflict` (`tools/diff-keys.mjs`).
  CURE CHOSEN: re-write after the repair (the assembly's late replay hands `sentenceInstitutions: settlement.institutions`;
  `economyReconciliation.js :: reconcilePowerStructure` keeps the replay's `recentConflict` only then; `rulingStructure.js` writes the
  sentence a second time over that roster, draw-free; the roster inputs and the noble-house test in the new leaf
  `power/governanceLabelRoster.js`). NOT the step order: the repair follows the faction-pull pass, which needs the power step's
  factions (a cycle), and the power step would see the repaired roster on C 148 / V 205 births.
  Governing run (90 files naming the changed modules or the sentence + tests/lint whole) IN FLIGHT at 10:4x; reds seen so far to read
  against RED-AT-LINE and the base: worldFactRederive, generationForkCensus, pipelinePinnedChoosers, proseWiringCensus (2), plus the
  known family (goldens, proseComposed, proseCorpusBytes, powerStructure F31, editCorpusRatchet).
- D5 (test re-cut): CAUSE KNOWN from the fortune-7 diagnosis (`lane/fortune-7-2026-11-22-u8-wip` measures/u8/DIAGNOSIS.md, R13
  section): the will's order score sits on its X4 floor (never below the will with nothing built or standing), which the points-only
  bound `armed + 0.1 x parts` predates; v3build-village-3 lit: will 6.86, armed 5.1, bound 6.8. No product fault. The re-cut needs the
  parts' per-score dims (the list holds points only): plan a small pure reader beside `defencePartsOf`.
- D8: measure written (`tools/measure-d8.mjs`), not run. Read: the thorp catalogue row "Lord's reeve" (face 'the reeve') seats
  'Feudal Stewardship' (`rulingStructure.js` governanceLabelMap `"lord's reeve"`); its own desc says "A steward appointed by a distant
  lord". Hamlets up hold "Lord's steward" (face 'the steward'). The seat line is `governanceAccount.js :: governanceAccountOf` (role
  from `rulingChainOf`).
- D7: read in (the proposal's crisis-body measure counts places whose crisis has no power of its own on the roster; its 509/900).
  STRESS_POWER_FACES lists each crisis's powers. The measure of the SENTENCES that name a power is to be written.

### 0.2 Next step
Read D3's governing log (`scratchpad/d3/gov.log`): every red against RED-AT-LINE / the base; then the goldens D3 moves (`tools/make-golden-plan.mjs` + `measure-keys.mjs`), push -d3-wip, hand in. Then D8's and D7's measures in one births run, D5's re-cut.
