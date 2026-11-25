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
- **D3 — DONE, PUSHED, HANDED IN** on `lane/birth-1-2026-11-25-d3-wip` at 5262fbee4 (worktree `/home/user/wt/d3`): bb77735cb (cure +
  test `tests/domain/powerSentenceSettledRoster.test.js`, red 7/13 at the base, 13/13 after), 0ecb6e25c (lighting door, files
  3798 -> 3799). Measured (oracle: the writer re-run whole over the final roster from the power step's intent, `tools/measure-d3.mjs`):
  C 0, V 4 stale (dp-hamlet-2, -100, -117: "The last harvest failed badly" beside the repair's Citizen militia; dp-town-15: a Street gang).
  After 0/0; records moved C 0, V 4, only `powerStructure.recentConflict` (`tools/diff-keys.mjs`).
  CURE CHOSEN: re-write after the repair (the assembly's late replay hands `sentenceInstitutions: settlement.institutions`;
  `economyReconciliation.js :: reconcilePowerStructure` keeps the replay's `recentConflict` only then; `rulingStructure.js` writes the
  sentence a second time over that roster, draw-free; the roster inputs and the noble-house test in the new leaf
  `power/governanceLabelRoster.js`). NOT the step order: the repair follows the faction-pull pass, which needs the power step's
  factions (a cycle), and the power step would see the repaired roster on C 148 / V 205 births.
  Governing run at 0ecb6e25c (90 files + tests/lint whole: 317 files, 4,682 tests): 14 red, 12 on RED-AT-LINE; the 2 others were the
  wiring census, re-taken by its door in 5262fbee4 (stamp only, 0 rows; --check 0; walker 79/79). Goldens moved by D3: 0 dark, 0 lit.
  Page battery over the 4: rows moved 0. Tables: `gen/birth-1/d3/`.
- **D5 — DONE, PUSHED, HANDED IN** on `lane/birth-1-2026-11-25-d5-wip` (worktree `/home/user/wt/d5`) at 289a70b3a. Cause (fortune-7's
  diagnosis, confirmed): the will's order score sits on its X4 floor; the points-only bound predates X4; no product fault. The R13 arm
  in `tests/generators/defenceParts.test.js` now reads the hold score by score through a new pure reader
  `defenseGenerator.js :: defenceWillHoldOf` (no figure changes: C 0, V 0 records moved). Old arm red at the base (v3build-village-3
  6.9 > 6.8); new arm green (defenceParts 19/19 + defenceDerived walker, 32/32). Every birth of C and V: 0 breaks of R13 score by
  score; X4 binds on C 76, V 75; the old points bound would be red on V dp-village-64, -113 too (`d5/table.txt`). A planted-mutation
  negative control was REFUSED by my permission check (told the chair; not retried). Governing run (25 files naming the defence
  module + tests/lint whole: 252 files, 3,938 tests): 5 red, all on RED-AT-LINE; lighting census unmoved. Its RED-AT-LINE row (defenceParts R13) leaves the list when it lands (the chair's).
- **D8 — PARKED (the chair's G11, 12:00 UTC): NOT handed to CLOSE-7; pushed at cf5d033e5.** WHAT IT STILL NEEDS IF THE OWNER GIVES THE LEAVE:
  (1) ONE ROW in `tests/lint/presumedThings.widened.register.json` by its door `scripts/presumed-things-door.mjs` (arm1,
  `src/data/institutionalCatalog.js`, things `house: lord's reeve` and `house: reeve`, reason "family", literal "the lord's reeve"),
  as "the lord's appointee" stands; (2) then `tests/lint` whole and the 142 governing files re-run on the tip (the reds left after
  cf5d033e5: presumedThings ARM 1 only; the others are RED-AT-LINE's); (3) the hand-in naming the catalogue word for the owner's
  veto. Its cures (honorific row, three figures, seed loop) were committed and pushed in cf5d033e5 before G11 reached me (told the
  chair; drop that commit at the merge if d391b1fbd's state is wanted).
  The earlier record:
- D8 — BUILT (ruling G10, option A); ONE STOP SENT TO THE CHAIR on `lane/birth-1-2026-11-25-d8-wip` (worktree `/home/user/wt/d8`):
  d391b1fbd (the catalogue word: the "Lord's reeve" row's face 'the reeve' -> "the lord's reeve"; the leaf `data/people/titleReadAs.js`
  read by `poolMap.js :: poolFor, titleLinesFor`; test `tests/domain/stewardshipReeveTitle.test.js` red 7/7 -> green), 7ee78b87f
  (lighting door), cf5d033e5 (the honorific registry's own row for the new face, `faceHonorifics.js` alias reverted; figures re-stated
  by cause: honorific titles 212 -> 213, forms 373 -> 374, face registry distinct titles 185 -> 186; the test's seed loop collected).
  Moves C 12, V 18 thorps, every differing leaf the title alone; goldens 0/0. Governing run at 7ee78b87f (142 files + tests/lint +
  tests/copy whole: 384 files, 5,251 tests): 11 red, 7 known; 3 of the 4 new cured in cf5d033e5. THE STOP: `presumedThings.walker`
  ARM 1 reds the catalogue literal "the lord's reeve" (3 words; "the reeve" had 2 and was never read); it cannot declare a need and
  the register is shrink-only. Asked the chair: (a) one row in the widened register by its door, reason "family", as "the lord's
  appointee" stands (recommended), (b) two words (none found), (c) withdraw D8. NOT PUSHED until the ruling.
- **D2b — BUILT (ruling G8 (3), re-set: the shared-sentence test, ~38, stop over 45)** on `lane/birth-1-2026-11-25-d2b-wip` (worktree
  `/home/user/wt/d2b`): 52ddb326e (the leaf `domain/display/sharedSentence.js :: sharesSentence`, the Overview's inline test moved
  verbatim and read by `OverviewTab.jsx` and `narrativeGenerator.js :: generatePressureSentence`; test
  `tests/domain/pressureNotTheTieLine.test.js` red 37/38 at the base, 38/38 after), 515a3d40c (lighting door). Census over every birth
  (`tools/measure-d2b.mjs`, `check-d2b.mjs`): alone C 18 -> 0, V 19 -> 0 (moved C 18, V 19); joined with D2 (scratch tree
  `/home/user/wt/join-d2-d2b`, merged --no-commit of -d2-wip 4ea69f420 and -d2b-wip 515a3d40c) V 20 -> 0, moved C 18, V 20; only the
  pressure line moves; no place loses its line; goldens 0/0. Readers that print the stored line besides the Overview (for the hand-in):
  to be listed (the PDF's view model `src/pdf/lib/viewModel.js`, the summary/quick guide, the tonight sheet, the Foundry export...).
  Governing run IN FLIGHT; the build (first paint: a component imports the new leaf) owed.
  Earlier notes on D8:
  'Feudal Stewardship' (`rulingStructure.js` governanceLabelMap `"lord's reeve"`); its own desc says "A steward appointed by a distant
  lord". Hamlets up hold "Lord's steward" (face 'the steward'). The seat line is `governanceAccount.js :: governanceAccountOf` (role
  from `rulingChainOf`).
- **D7 — RULED G17 (12:56 UTC): (1) and (3) yes as worded, (2) yes on a term (the whole sentence sent), (4) claimant left. A VOCABULARY ROW ASKED (`crisis body: <kind>`, COMMON-RULES 6) before building; nothing built.** Earlier record: `tools/measure-d7.mjs` (crises, roster, every crisis line; "own power"
  by the tree's `stressPowerRowOf` + fortune-7's no-face list) and `tools/analyse-d7.mjs`; tables `d7/analysis-{C,V}.txt`. Almost every
  crisis line tells an event, the seat, or an outsider. Lines naming a LOCAL body the place may lack (printed, no body): indebted power
  sentence "The creditor's agent has blocked the money…" C 24 (19), V 27 (13); indebted pressure "the creditor's representative arrived
  last month" C 1 (1); religious_conversion power sentence "two priests, two congregations…" C 7 (6), V 5 (4); succession pressure "every
  claimant is buying support" C 6 (2), V 6 (2) (borderline). Proposed twins sent to the chair; the insurgency's "A strong power" is gated
  by K6 (true), left. If ruled: each twin declared by the place's own powers at its print site (power sentence:
  `governanceNarrative.js :: buildStressNarratives`; conversion: `governingStressVignettes.js`; pressure: `narrativeText.js`), no draw.
- **D2b — HANDED IN to CLOSE-7 (the chair took the byte rise; CLOSE-7 to re-run the check on the joined tree, WORDS-2's E3)**. Earlier record:, pushed at 4822a2175 (+ wiring door). First paint raw +210 (1,181,337 -> 1,181,547),
  gzip +70, Brotli -28; worker +256; all budgets over at the base already. Governing run (166 files + tests/lint + tests/copy): 16 red,
  13 known; the wiring census cured by its door; dossierPhoneFloorAllViews red the same at the base (Daily Life prose 9 -> 8). NOT yet
  sent to CLOSE-7 (waits for the byte word).

### 0.2 Next step
Wait for the chair's word on D7's vocabulary row; then build D7 on `lane/birth-1-2026-11-25-d7-wip` (cut at the base): the fact leaf, the three declared twins, the late resolution in assembly before the pressure line, red first, the check over every birth (no crisis line names a local body the place does not hold: 0 on C and V). D8 parked (owner's leave).
