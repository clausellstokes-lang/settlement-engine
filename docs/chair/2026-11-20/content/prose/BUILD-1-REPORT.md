# BUILD-1-REPORT — PROSE-LINES-1 and -2 in the corpus, finished (BUILD-1-FINISH, PROSE-2's builder)

Branch `lane/prose-2-2026-11-20-build1`, cut AT `400b9978b` (the -wip tip of PROSE-1's BUILD-1; its three commits kept, none rewritten). Base `87f03395b`. Briefs: `briefs/BUILD-1.md`, `briefs/BUILD-1-VERDICT.md`, `BUILD-1-FINISH.md` (232de105e), its ADDENDUM 1 (ca4b5bb65, the chair's ruling of 18:46 UTC), and the chair's 19:30 (speak-pass column) and 19:38 (the ledger ref) messages. Nothing pushed; no pull request; no `--no-verify`; nothing in `package*.json`; nothing under `src/domain/coherence/`.

## THE COMMITS (87f03395b..tip)

| commit | what |
|---|---|
| eb33b8f71 | (PROSE-1's builder) step 1: the verdict applied to the two line files |
| 0f86cd1e4 | (PROSE-1's builder) step 2: 140 source rows + the door + the WORD_CORRECTIONS row |
| 400b9978b | (PROSE-1's builder) step 3: the faith licence line |
| 3d6dac0df | addendum 1 step 1: 40 new rows reworded IN THE LINE (style law, presumedThings arm 1, presumptionClasses) |
| e30515ce2 | step 2a: the wiring census re-taken by its door |
| 766e0b730 | step 2b: the observed-shape baseline re-frozen by its door |
| 9da3ac5a9 | step 2c: the undeclared-lines register re-taken by its door |
| cf0c9015a | step 2d: the shift register's three moved rows re-pinned (its `_pinIdiom`, a hand edit) |
| 1bfa0dd77 | step 2e: proseComposed's corpus count |
| 18159a165 | step 2f: proseWiringCensus's counts |
| 46550706e | step 2g: proseEntryContradiction's counts |
| cac77312a | step 2h: proseMoveGrammar's CONTROL 4 figures |
| 7302ded23 | step 2i: proseWaveGate's unit count |
| 7aeb5bef5 | step 2j: census2DeclaredPools' vid lists |
| 04fa578d9 | step 2k: the kernel test's three-variant floors (THE CODE TIP: every measure and the confinement are of this tree) |
| 1ea34d059 | docs: RANK-REACH before/after, OVER-BAR-RANKED-BUILD1, TOWN-LINES-BUILD1 (THE GATE TIP: the final gates ran here) |
| a362dfe8f | step 2l: the prose manifest test's mixed-pool count 13 -> 16 (a test literal only; that file run alone after it: 2 failed / 18 passed, the two named in step 3) |
| (this file) | docs: this report |

## FIRST: WHAT WAS THERE (EXECUTED, before any new work)

1. `git diff 87f03395b..400b9978b --stat`: 11 paths, ONLY the allowed ones: the two line files; `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (141 added lines, every one a numbered row: 140 appended rows plus the DS-POW-2 #1 reword; 1 removed line, that row's old words; 0 non-row lines); the six `src/data/dossierStateProse/*.generated.js`; ONE row in `scripts/generate-dossier-state-prose.mjs :: WORD_CORRECTIONS` (`DS-POW-2 :: recentConflict present`, vid 1, ruling `CHAIR-2026-11-20-17:38`); ONE line in `tests/lint/faithTeaserLicence.test.js` (`'are', 'marks', 'turn', 'gather'` with the ruling's comment). Nothing else: no STOP.
2. The verdict, item by item (base leaves vs tip leaves by pool + vid, and every numbered NEW line of the two line files against its row: 140 of 140 match in angle, marks and text):
   - THE NOUN: no new row's text says "town" (0 of 140). PRESENT.
   - DM-ONLY: file 1 pool 7 (DS-ECO-6 minor shadow, v6-v11), file 2 pool 4 (DS-DEF-4 black market, v3-v6), pool 17 (DS-POW-6 duty evasion, v4-v7), pool 20 (DS-DEF-4 structure null, v4-v7): all carry `dm-only`. PRESENT.
   - File 1 pool 8 (DS-POW-2 recentConflict present v4-v8) word for word: PRESENT (two since reworded under the 18:46 ruling, listed below).
   - Rewordings 1.11, 9.7, 10.7, 12.10; 2: 5.4, 5.6, 8.8 (short form), 12.10, 12.12, 12.13: PRESENT. 8.8's tail dropped: `economyStateProse.js :: incomeMixPoolKey` keys the pool at a leader share `>= SOLE_EARNER_FROM` (50), so half is proved and more than half is not (read here).
   - 7.5: the pool is keyed on `compound.magicInfluence` high (`incomeWeightPoolKey`, `INFLUENCE_WEIGHS_FROM` 60; the annex's key says the same), an influence and not an earning share, so 7.5 STANDS (read here). PRESENT.
   - The faith teaser: six rows DS-FTH-2 PRIVATE DOSSIER v5-v10 in the ruled order, no marks; I read each with the five `faithReading.js :: observancePhraseOf` fills ("seldom, beyond weddings and burials" / "on the great feast days" / "through the year" / "week by week" / "in every part of life"): all read as English; no drop. PRESENT.
   - DS-POW-2 #1 reworded with its WORD_CORRECTIONS row. PRESENT. SPARES unused. Missing items: NONE.
3. `npm run gen:dossier-prose -- --check` at 400b9978b: exit 0 ("verified 69 state blocks / 3194 variants").

## STEP 1 OF THE 18:46 RULING: THE LINES (3d6dac0df)

Forty NEW rows reworded to the same fact, in the source row and the line file together (each line-file change marked with its rule and its old words), then the door. No exemption, no baseline, no register.
- style law (`scripts/lib/style-law-scan.mjs`): "a stranger" 19 rows -> "a visitor"; "rather than" 6; "not merely" 2. BEFORE 8 rises (5 files) -> AFTER 0 rises, 0 refused, 5 falls. I cured every new row that carried a struck phrase, also the 2 in files where the count did not rise above the baseline (defense, power).
- presumedThings arm 1: 12 fresh -> 0 (streets; armedForce "soldiers"/"defenders"; house: alchemist and practitioner, which have no atom to declare, so reworded; NO-MARKET #11's "going to market"). Arm 2 green in the whole-lint run.
- presumptionClasses (`node scripts/presumption-classes-door.mjs --check`): 6 fresh -> 0 (hits 1791 -> 1785 = banked 1785).
- THE NUMBERING BASELINE: the projector compares to the leaves on disk, which at 400b9978b already held the 140 never-shipped rows, so it called the rewording REWORDED. I restored the leaves to the BASE projection (copied from my scratch worktree at 87f03395b) and re-ran the door: the 140 rows stand as new rows at the next numbers, and no WORD_CORRECTIONS row was added for a never-shipped row. Say "veto" to take 40 WORD_CORRECTIONS rows instead.

### CHAIR'S LINES REWORDED (for the chair; built on mine meanwhile)

| block · pool · vid | the chair's words | mine | the rule that refused it |
|---|---|---|---|
| DS-POW-2 · recentConflict present · 4 | A stranger at {settlement} does not have to ask long before someone mentions the quarrel. | A visitor at {settlement} does not have to ask long before someone mentions the quarrel. | style law: a-stranger |
| DS-POW-2 · recentConflict present · 5 | The quarrel at {settlement} belongs to the place's present rather than to its history, and people speak of it that way. | The quarrel at {settlement} belongs to the place's present, not to its history, and people speak of it that way. | style law: rather-than |
| DS-POW-5 · governing body name: a SLOT, never a baked noun · 7 | A stranger at {settlement} hears the {seat} named long before meeting anyone who speaks for it. | A visitor at {settlement} hears the {seat} named long before meeting anyone who speaks for it. | style law: a-stranger |
| DS-GEN-13 · NO-MARKET · 11 | Nobody at {settlement} speaks of going to market here, for there is none to go to. | {settlement} keeps no market, so nobody here speaks of going to one. | presumedThings arm 1: `market` ("going to market" read as naming one) |

No rewording changed a fact: no STOP. Ruling 13's DS-POW-2 #1 needed none.

## STEP 2: THE REGISTERS THAT COUNT THE CORPUS (one commit each; before and after in each message)

| register | door | before -> after |
|---|---|---|
| `docs/content/wiring-census.json` | `node scripts/wiring-census.mjs` (then `--check` 0) | variants 3054 -> 3194; THIN 615 -> 612; COVERED 246 -> 249; 35 rows moved |
| `scripts/.observed-shape-readers-baseline.json` | `node scripts/check-observed-shape-readers.mjs --write` | gate exit 1 (6 generated inputs drifted) -> re-frozen; identities, inventory, total UNCHANGED (2214 findings / 1552 identities / 444 files); provenance only |
| `tests/lint/undeclaredLines.register.json` | `RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js` | DS-ECO-2 FOOD: deficit 1 -> 3; DS-ECO-11 ECONOMIC STRENGTHS 3 -> 6 (FLAGGED: the file calls itself shrink-only; taken because the ruling names it) |
| `docs/content/prose-shift-register.json` | no script; its `_pinIdiom` (edit the row in the same commit) | variant-count 3054 -> 3194 and its digest; face-count 3054 -> 3194 and its digest; vids digest (140 vids appended, none renumbered). FLAGGED: owner-gated classes; for the owner's word at the close |
| exact counts in tests (one commit per file) | the pin, with its cause beside it | proseComposed corpus 3054 -> 3194; proseWiringCensus variants 3054 -> 3194 (x3), mean 3.55 -> 3.71, histogram, THIN 615 -> 612, COVERED 246 -> 249; proseEntryContradiction 3522 -> 3662, 2814 -> 2954 (x2), trailing coordinate 379 -> 393 (14 lines named); proseMoveGrammar uniform 578 -> 577, repeated openers 159 -> 167, 520 -> 519, 148 -> 155, 0.671 -> 0.670, 0.185 -> 0.194; proseWaveGate units 673 -> 720; census2DeclaredPools NO-MARKET [3] -> [3, 7..12] (x2), gated [1,2,3] -> [1,2,3,7..12], DS-STR-1 [1,2,3] -> [1..5]; stateProseKernel floors 500 -> 484 three-variant pools (501 at the base, 484 at the tip; FLAGGED: a non-vacuity floor lowered) |

## STEP 3: WHAT STAYS RED, NAMED (not re-recorded)

| red | before (committed) | after (measured at the tip) | why it stays |
|---|---|---|---|
| THE BYTE RATCHET `tests/lint/proseCorpusBytes.test.js` (RAW is EXACT; GZIP band), `scripts/.prose-byte-baseline.json` | raw: defense 287394, economy 196627, general 307568, power 136414, stressors 148435, warFaith 180478; gzip: defense 37962, economy 26784, general 38822, power 18762 | raw: 302700, 215992, 312541, 141457, 149042, 181969; gzip: 40123, 29279, 39521, 19440 | its door is a declared, signed row: for the owner's sign-off at the close |
| A0b's under-claim CEILING `tests/lint/proseComposed.walker.test.js` ("THE SHIPPED CORPUS READING, printed and held SHRINK-ONLY") | ceiling 2103 (1282 + 821 OWED) | 2336 under-claims (+233); over-claims 19 (ceiling 19), implicit negations 13 (ceiling 13) | a shrink-only ceiling raised in the past only by a named OWED row; not one of the registers the ruling names, so not raised here |
| `tests/property/dossierProseManifest.test.js` THE DRIFT ARM (the composed-prose manifest golden, `tests/fixtures/dossier-prose-manifest-golden.json`) | 0 rows moved | 1050 rows moved (both audiences, every DRIFT row) | a golden of composed towns: not re-recorded. RED AT THE BASE TOO: 87f03395b gives the identical 1050 rows (EXECUTED in my scratch base worktree), so its membership is the line's own and BUILD-1 adds no row to it |
| the same file, THE MIXED-POOL AUDIENCE ARM, "positions where the two faces draw differently" | 0 (the owner's close of BAR2, 2026-11-15) | 91 | a measurement over the DRIFT corpus's composed towns, re-recorded only at a close with a shift record: not re-recorded. NEW with BUILD-1: green at the base; BUILD-1's dm-only lines in now-mixed pools make the DM face draw differently. Its corpus count beside it, mixed pools 13 -> 16, IS re-keyed (a362dfe8f) |
| `tests/property/generatorGoldenMaster.test.js` (the generator's golden master) | 0 configs differ | 521 of 525 configs differ | RED AT THE BASE with the identical 521 configs (EXECUTED); BUILD-1 moves no born record (the confinement: 0 differences), so this red is the line's own, not BUILD-1's |

## THE GATES (each to a file through `sh scripts/gate-tail.sh`, heavy runs one at a time through `sh scripts/gate-mutex.sh --run`; at the gate tip 1ea34d059)

| gate | count line | exit |
|---|---|---|
| `npm run gen:dossier-prose -- --check` | verified 69 state blocks / 3194 variants across 6 desks, 78 causal families / 468 variants | 0 |
| `npx vitest run tests/lint` WHOLE | Test Files 2 failed / 218 passed (220); Tests 3 failed / 3268 passed (3271) | 1 |
| `npx vitest run tests/data/dossierStateProseProjection.contract.test.js tests/domain/stateProseKernel.test.js tests/domain/facts tests/domain/crimeLineDisqualifiers.test.js tests/copy` | Test Files 76 passed (76); Tests 576 passed (576) | 0 |
| `npm run typecheck:ratchet` | OK, 167 errors, ceiling 167 | 0 |
| `npm run typecheck:domain:strict` | no strict-type regressions (1113 errors, ceiling 1113) | 0 |
| `npm run lint` | 38 problems (0 errors, 38 warnings) | 0 |

The three lint reds are exactly the step-3 table's (proseCorpusBytes RAW and GZIP; proseComposed A0b). Every other red of the first tip run (16 failed of 3271 at 3d6dac0df, after the line cures; PROSE-1's builder relayed 19 at 400b9978b) is cured by step 2. The `scripts/prose-*.mjs` scripts are not run by `package.json`; the gates import them (`prose-wave-gate.mjs` and `prose-licence-card.mjs` in `proseWaveGate.walker.test.js`, `lib/prose-licence-card.mjs` in `proseLicenceCard.walker.test.js`), so the whole-lint run is their run. The step-1 walkers (styleLaw, presumedThings, presumptionClasses) pass in it. After the gate tip came only a362dfe8f (one literal in tests/property/dossierProseManifest.test.js, outside every gate above, that file run alone after it) and this report (docs only).

THE LEDGER REF (the chair's 19:38 rule): BUILD-1.md's own fetch (`git fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08`) SUCCEEDED in this session at about 19:05 UTC, before that rule reached me; the ref was present for every lint run here. By the rule, `tests/lint/ledgerCitationIntegrity.test.js` (the one lint file that reads the ref, through `scripts/audit/ledger-citations.mjs`) is reported as "not run as the rule defines it: the ledger ref is not fetchable here", never as green and never as mine. I did not delete the ref (refs are shared with the other checkouts on this machine) and ran no lint at the base, so it is not shown red at the base.

## THE MEASURE (ruling 16: each prints its ROOT and commit)

`map/RANK-REACH-BUILD1-BEFORE.md` and `-AFTER.md`: scratch copies of `map/run-map.sh` (ROOT, the vitest config, the `vi.mock` path and the imports re-pointed to the tree; the committed tool untouched) and of `map/rank-reach.mjs` (PER read from the environment, 150; the committed tool hard-codes 50). Draws mode, prefix hxd, 150 places a size, six sizes, 4 workers: 4 x "Tests 225 passed (225)", exit 0, 65,308 records each.
- BEFORE: ROOT `<scratchpad>/base` (my scratch worktree), HEAD `87f03395b722020ca27b46499c3e29b3022ad94d`: **102 of 242 pools over 15%** (80 over 20%). Head: DS-FTH-2 PRIVATE DOSSIER 100%, DS-GEN-13 NO-MARKET 97%, DS-ECO-12 TRADE PROFILE 75%, DS-GEN-11 criticalIssueCount 69%, DS-ECO-6 minor shadow 68%, DS-POW-2 recentConflict present 57%.
- AFTER: ROOT `/home/user/settlement-engine/.claude/worktrees/agent-a68d06c1dd4451433`, HEAD `04fa578d997a09bbfe861f61bb56066a944d2965`: **99 of 242 over 15%** (55 over 20%). Head: DS-ECO-6 minor shadow 68%, DS-DEF-4 black market 47%, DS-DEF-5 charter hall PRESENT 41%, DS-POW-6 duty evasion 39%, DS-POW-5 council 37%. NO-MARKET 97% -> 13%; PRIVATE DOSSIER 100% -> 19%; TRADE PROFILE 75% -> 19%; criticalIssueCount 69% -> 18%.
- BUILD-1's 35 pools: 3 under 15% (NO-MARKET, FOOD: deficit, TERRAIN: Plains), 22 more within the ruled 20% margin, 10 still over 20%. Of the 10, the four dm-only pools did not move at all (DS-ECO-6 minor shadow, DS-DEF-4 black market and structure null, DS-POW-6 duty evasion: public prose never draws dm-only lines); the other six sit at 21% to 23% with a median eligible at or above the need (DS-POW-2 recentConflict present 23%, DS-DEF-1 WEAK, DS-DEF-3 First-Survey, DS-ECO-11 STRENGTHS, DS-ECO-12 one source, DS-ECO-12 a house needs: 21%). INFERRED: sampling, or some lines excluded by marks at some places. Not measured line by line. Per ruling 6 the SPARES may go to these; I added none.
- THE RANKED LIST (`map/OVER-BAR-RANKED-BUILD1.md`, the ruling's item 5), ranked by weight: over 20%: 55 = 10 BUILD-1-touched + 45 COVERED BY LINES 3/4 + 0 by nothing; over 15% and at most 20%: 44 = 22 touched + 9 LINES 3/4 + 13 COVERED BY NOTHING YET. Newly over at the tip: none.

## THE CONFINEMENT (BUILD-1.md step 5)

`node trees.mjs 43ab0f5eb 04fa578d9 <scratch>/b1-confine/work --words=none`, the tool fetched from `origin/lane/names-3-2026-11-20` into scratch (never into the lane); run from this worktree through the mutex; births exit 0,0 at each revision; exit 0. (`43ab0f5eb..87f03395b` touches no `src/`, `tests/` or `scripts/`, so this is base code against tip code.)

| corpus | documents | identical | non-string differences | differing strings |
|---|---|---|---|---|
| golden 525 | 525 | 525 | **0** | 0 |
| census 720 | 720 | 720 | **0** | 0 |

The born record carries no `publicProse` (it is composed at the save), so no born string moves. As expected.

## THE "TOWN" COUNT (ruling 17:28 item 1; the 19:30 speak-pass column). Measure only, no line changed

Whole table: `map/TOWN-LINES-BUILD1.md` (block · pool · vid · the line · non-town sizes eligible · places drawn at non-town sizes (printed) · per size · the speak pass). Lines: every EXISTING wording (present at the base by pool + vid) matching `\btown(?:'s)?\b`, so the word boundary excludes "townsfolk" (7), "townspeople" (4) and the plural "towns" (14); "downtown" occurs nowhere; no counted line has a capitalised "Town" (no proper name).
- **882 existing wordings say "town"** (31 of them dm-only). **349 are eligible at a non-town size; 344 were drawn there (15,681 draws over thorp, hamlet, village, city, metropolis at 150 places a size); 270 printed there (10,955 prints).**
- THE SPEAK PASS (`stateProseKernel.js :: speakTierNoun`), EXECUTED on the stored publicProse of every place: 262 lines always print in the size noun (not a fault); 1 is a kept phrase ("edge of town"); **7 DS-GEN-13 lines print RAW, 277 prints at non-town sizes: A FAULT.** The route: `src/components/new/publicProseCompose.js :: PUBLIC_PROSE_SITES` 'general:overview' calls `src/components/new/generalDeskRead.js :: generalDeskLines` with no `tier`, so `composeStateProse.js :: composeStateProse` gets no tierNoun and the stored sentence keeps "the town"; `src/components/dossier/DossierSearchResults.jsx :: ShippedProse` prints those stored strings verbatim. The screen (OverviewTab -> ProseBlock -> `weaveBlock.js :: weaveBlock`, tier passed) and the print (`printProse.js :: weave`) speak them. INFERRED from the code, not measured: OverviewTab prints `populationLine` (DS-POP-3) in a bare `<p>` from the same untiered call; 82 lines in the Overview's blocks were not printed at a non-town size in this measure and carry the same risk.

## STORED FINGERPRINTS A CHANGE MOVED (named, signed by none)

- The byte ratchet's six rows (above). The shift register's five pins (re-pinned, flagged for the owner). The wiring census and the observed-shape provenance (by their doors).
- The composed-prose manifest golden (`tests/fixtures/dossier-prose-manifest-golden.json`, read by `tests/property/dossierProseManifest.test.js`): red at the base and the tip with the same 1050 rows; and its two-faces arm 0 -> 91 (BUILD-1's). The generator golden master (`tests/property/generatorGoldenMaster.test.js`): red at the base and the tip with the same 521 configs; BUILD-1 moves no born record. Neither re-recorded; both for the owner.

## EXECUTED vs INFERRED

EXECUTED: FIRST's three checks; my reading of the six faith rows with the five fills; every walker probe before and after; every door and gate run above with its count line; both 900-place measures; the over-bar tables; the confinement; the "town" count and its stored-prose speak check; the per-pin causes (each counted pool by pool on the leaves: uniform segments, repeated openers, three-variant pools, the histogram, the trailing-coordinate entries).
INFERRED: why six touched pools stay at 21% to 23% (sampling or mark exclusions); the speak pass on the screen and print routes and on lines not printed at a non-town size (read from the code); that ledgerCitationIntegrity would red without the ref.

## BUILD-1-CURE (PROSE-3)

Branch `lane/prose-3-2026-11-20-build1-cure`, cut AT `13c57d9f6` (BUILD-1's commits kept, none rewritten). Base `87f03395b`. Brief: `docs/chair/2026-11-20/content/prose/briefs/BUILD-1-CURE.md` at f43495b12 (the chair's rulings (a)-(d) of 20:49 UTC). Nothing pushed; no pull request; no `--no-verify`; the whole suite not run; every heavy run through `sh scripts/gate-mutex.sh --run`, every gate through `sh scripts/gate-tail.sh` to a file.

### (a) THE CURE: the five lines declare, the register returns to 1 and 3

| commit | what |
|---|---|
| 7d2161b7b | the five lines' declarations (source rows + `npm run gen:dossier-prose`) and the register's two values restored |
| 8cb46702f | the wiring census re-taken by its door (the declarations moved two of its rows) |
| acedb0ac9 | the observed-shape baseline re-frozen by its door (the regenerated economy leaf is a scan input; provenance only). THE CODE TIP |
| (this section) | docs: this report |

- WHAT THE REGISTER COUNTS (EXECUTED, read and run): `src/domain/facts/declarationRegisters.js`: "per pool, the lines that carry no declaration and whose pool is not ruled `{colour}`". Undeclared lines, so no STOP. A FACT OF THE BRIEF CORRECTED: the register lives at `tests/lint/undeclaredLines.register.json`, but its test is `tests/domain/facts/declarationRegisters.test.js` (not under `tests/lint`), and it names POOLS with their counts, not the lines.
- RED FIRST (EXECUTED): with the two values restored (`git diff 87f03395b -- tests/lint/undeclaredLines.register.json` empty), `declarationRegisters.test.js` exit 1, "Tests 1 failed | 7 passed (8)": `THE UNDECLARED-LINES REGISTER — shrink-only > no pool's undeclared count rose, and no undeclared pool appeared unpinned`, rose `["DS-ECO-2::FOOD: deficit: 1 → 3", "DS-ECO-11::ECONOMIC STRENGTHS: the roster is populated: 3 → 6"]`.
- THE DECLARATIONS (EXECUTED): the source document's no-atom declaration `colour` (R-AO; `factVocabulary.js :: COLOUR_MARK`: "a no-atom declaration — 'read; presumes nothing' — which the projector and the undeclared register count as declared; the draw, the kernel and the ledger read it as silence"). Copied from DS-ECO-11 STRATEGIC VALUE #5 `[unfolding · colour]` and #6 `[counterforce · colour]` (base rows, the same block). DS-ECO-2 carries NO colour row at the base or the tip, so the brief's "same block" cannot be met there; its two lines take the desk's form, DS-ECO-1 COMBINATION C2 #2 `[ledger · colour]` (a base row).
  - DS-ECO-2 FOOD: deficit #4 `[ledger]` -> `[ledger · colour]`; #5 `[unfolding]` -> `[unfolding · colour]`
  - DS-ECO-11 ECONOMIC STRENGTHS: the roster is populated #4 `[counterforce]` -> `[counterforce · colour]`; #5 `[threshold]` -> `[threshold · colour]`; #6 `[unfolding]` -> `[unfolding · colour]`
  - Why none needs an atom (INFERRED, read): the deficit lines presume only the pool's own state, as base #1 does; the block's `crisis: any` is NOT an empty declaration (it admits only under an active crisis, `factVocabulary.js` line 786), so it was not used. Strengths #5 ("stands on something its own country or its approach supplies") holds by construction: the roster is `terrain.economicStrengths`, filtered (`resourceGenerator.js:978`).
- GREEN (EXECUTED): `npm run gen:dossier-prose` then `-- --check` exit 0 ("verified 69 state blocks / 3194 variants across 6 desks"); only `economy.generated.js` moved (five `marks: ["colour"]`). `declarationRegisters.test.js` "Tests 8 passed (8)", exit 0.
- PINS THE DECLARATIONS MOVED, each by its door in its own commit (EXECUTED): the wiring census (`--dry`: STALE, 2 rows, delta 48 bytes; FOOD: deficit `undeclared 3 -> 1`, `lineDeclares` gains `colour: 2`; STRENGTHS `undeclared 6 -> 3`, `lineDeclares {} -> {colour: 3}`; `--check` 0, "verified 861 pools / 3194 variants / 169 relation rows against 7 stamped files"); the observed-shape baseline (`--write`: "froze 2214 finding(s) / 1552 identit(ies) across 444 file(s)", the same figures; the gate exit 1 -> 0; `observedShapeReaders.walker.test.js` 47 passed). No shrink-only door raised.

THE GATES at the code tip acedb0ac9 (EXECUTED, each to a file through the mutex):

| gate | count line | exit |
|---|---|---|
| `tests/domain/facts/declarationRegisters.test.js` (the undeclared-lines test) | Tests 8 passed (8) | 0 |
| `tests/domain/facts/census2DeclaredPools.test.js` | Tests 10 passed (10) | 0 |
| `tests/domain/stateProseKernel.test.js` | Tests 38 passed (38) | 0 |
| `tests/lint/proseComposed.walker.test.js` | Tests 1 failed / 86 passed (87): A0b, 2336 > 2103, named in (d) | 1 |
| `tests/lint/proseEntryContradiction.walker.test.js` | Tests 29 passed (29) | 0 |
| `tests/lint/proseMoveGrammar.walker.test.js` | Tests 54 passed (54) | 0 |
| `tests/lint/proseWaveGate.walker.test.js` | Tests 44 passed (44) | 0 |
| `tests/lint/proseWiringCensus.walker.test.js` | Tests 79 passed (79) | 0 |
| `tests/property/dossierProseManifest.test.js` | Tests 2 failed / 18 passed (20): THE DRIFT ARM (1050 rows, red at the base too) and THE MIXED-POOL AUDIENCE ARM (91), both as BUILD-1 left them | 1 |
| `npx vitest run tests/lint` WHOLE | Test Files 3 failed / 217 passed (220); Tests 3 failed / 3258 passed (3261) | 1 |

The whole-lint reds, named: `proseCorpusBytes` RAW and GZIP and `proseComposed` A0b (the three of (d), BUILD-1's own three); and the file `ledgerCitationIntegrity.test.js`, which fails to load ("fatal: Not a valid object name refs/heads/review-fixes-2026-07-08"): **not run: the ledger ref is not fetchable here** (never green, never mine; no fetch attempted). The first whole-lint run, after 8cb46702f, also named `observedShapeReaders.walker.test.js` (the economy leaf, a scan input, drifted); acedb0ac9 is its door's re-freeze, and it is green in this run.

THE CONFINEMENT (EXECUTED): the two-tree tool fetched from `origin/lane/names-3-2026-11-20` (`docs/chair/2026-11-20/content/tools/confinement/`, all seven files) into scratch, never into the lane; `node <scratch>/trees.mjs 87f03395b acedb0ac9 <scratch>/confine-work --words=none` from this worktree through the mutex; births exit 0,0 at each revision; exit 0. golden: documents 525 · identical 525 · **non-string differences 0** · differing strings 0. census: documents 720 · identical 720 · **non-string differences 0** · differing strings 0.

### (b) THE KERNEL TEST'S THREE-VARIANT FLOOR: seventeen pools, sixteen of floor

RECONCILED (EXECUTED, every pool of the six leaves read at a `git archive` of the base and at the tip): three-variant pools **501 at the base, 484 at the tip; 17 left the class, 0 entered** (861 pools both sides; pools of four or more 275 -> 298). The commit's "seventeen, 501 -> 484" counts POOLS; the chair's "sixteen from 500" counts the FLOOR (500 -> 484), which sat one pool under the base count. The pools that left are seventeen:

| desk · block · pool | variants before -> after |
|---|---|
| economy · DS-ECO-2 · FOOD: deficit | 3 -> 5 |
| economy · DS-ECO-11 · TERRAIN: Plains | 3 -> 4 |
| economy · DS-ECO-11 · ECONOMIC STRENGTHS: the roster is populated | 3 -> 6 |
| economy · DS-ECO-12 · INCOME MIX: one source carries the town | 3 -> 8 |
| economy · DS-ECO-12 · TRADE PROFILE: exports and imports both present | 3 -> 8 |
| economy · DS-ECO-12 · CRITICAL IMPORT: the land cannot give it | 3 -> 7 |
| power · DS-POW-2 · recentConflict present | 3 -> 8 |
| power · DS-POW-4 · riskLabel: Holding | 3 -> 6 |
| power · DS-POW-5 · governing body name: a SLOT, never a baked noun | 3 -> 7 |
| power · DS-POW-6 · operation role duty evasion | 3 -> 7 |
| defense · DS-DEF-2 · Internal Security: no legal infrastructure | 3 -> 7 |
| defense · DS-DEF-3 · First-Survey qualification (the reading is a first look) | 3 -> 7 |
| defense · DS-DEF-4 · structure null (nothing organized recognized) | 3 -> 7 |
| defense · DS-DEF-5 · garrison PRESENT | 3 -> 7 |
| defense · DS-DEF-5 · arcane defense ABSENT | 3 -> 7 |
| stressors · DS-STR-1 · Overview's own section framing | 3 -> 5 |
| general · DS-GEN-11 · criticalIssueCount: critical contradictions on the record | 3 -> 7 |

WHERE THEY ARE COUNTED AFTER: **no arm counts them for the property the floor guarded.** The two lowered floors sit in `tests/domain/stateProseKernel.test.js :: the state-prose reader — law 6, the index-stable draw > ⭐ UNIFORM ON THE THREE-VARIANT CORPUS: chi-square 4.20 on 5,470,000 reads` (per-slot uniformity, and every slot reached) and `... > ⭐ APPEND-SAFE: a fourth wording moves about a QUARTER, and every mover moves TO it`; both filter `row.pool.length === 3` (EXECUTED, read). The arms that sweep EVERY shipped pool, four-plus included, check other things: `... > ⭐ THE SHIPPED STATE CORPUS NEVER REACHES THE MODULUS FALLBACK` (distinct, contiguous vids: the draw's precondition, not its reach) and `... > ⭐ A FACT NEVER MOVES: the drawn variant is a member of the same eligible set as before` (set membership, six seeds). `the state-prose reader — the avalanche draw > reaches every variant of a power-of-two pool on the degenerate seed family` reaches every slot of a SYNTHETIC eight-variant pool, not the corpus. No other test that reads the state leaves or `drawVariant` carries a reach, uniformity or chi-square arm over shipped pools (EXECUTED: the grep; INFERRED: that nothing outside it does). By the chair's rule, the floor fell where the thing it counts did NOT move to a home counted elsewhere.

### (c) THE MIXED-POOL AUDIENCE ARM: what the 91 are (an answer, no code)

MEASURED (EXECUTED: a scratch re-statement of the arm's own `differ` pairing through the test's helper `tests/helpers/dossierManifest.js :: driftRun, poolIndex`, DRIFT corpus 525 towns, both faces, 73,800 cells; at the tip it reproduces the test: 16 mixed, 91 differing, 214 DM-only, 0 player-only):

| | mixed pools | positions where the faces differ | DM-only positions | player-only |
|---|---|---|---|---|
| base 87f03395b | 13 | **0** | 214 | 0 |
| tip acedb0ac9 | 16 | **91** | 214 | 0 |

The arm was ZERO at the base for EVERY pool, including DS-ECO-6 minor shadow, mixed before BUILD-1 (its base dm-only v1-v3 are declared `no organised crime`, so they make DM-only positions, not differing draws). All 91 come from BUILD-1's dm-only lines.

| pool | cell / position | positions (towns) | dm-only vids | DM face drew / player face drew |
|---|---|---|---|---|
| DS-ECO-6 · TIER: minor shadow activity (≥3) | `economics.shadowEconomy` rung 0 | 88 (60 city, 24 metropolis, 4 town) | v1-v3 (base), v6-v11 (BUILD-1) | DM v10 / player v5 x86; DM v6 / player v5 x1 (gm-seed-b); DM v7 / player v4 x1 (gm-seed-c) |
| DS-POW-6 · operation role duty evasion | `power.criminalUnderside` rung 0 | 3 (town · plains · port · golden-master-v3; town · auto · random_trade · gm-seed-b; town · plains · road · gm-seed-a) | v4-v7 (BUILD-1) | DM v6 / player v1; DM v7 / player v3; DM v6 / player v3 |
| DS-DEF-4 · structure null | `defense.criminalStructure` | 0 | v4-v7 | (DS-DEF-4 fires on no town of the corpus: the test's own `MOUNTS_THE_CORPUS_DOES_NOT_REACH`) |
| DS-DEF-4 · FIXTURE: black market | `defense.criminalStructure` | 0 | v3-v6 | (the same) |

(The recorder's `vid` is the 0-based position in the authored pool; converted to annex vids here: DS-ECO-6 minor shadow numbers from 0, so position = vid; DS-POW-6 duty evasion numbers from 1, so vid = position + 1. EXECUTED, both read off the leaves.)

THE DM-ONLY SLOTS THE DESKS ALREADY CARRY (INFERRED, read):

| slot (`path :: symbol`) | fed by | printed by | a state-prose kernel pool? |
|---|---|---|---|
| `src/domain/display/stateProse/economyStateProse.js :: arcaneMarketPoolKey`, `theocraticEconomyPoolKey`, `hiddenHousePoolKey` (DS-ECO-6 FLAG/FACET pools, every line dm-only) | `safetyProfile.flags.arcaneBlackMarket` / `.theocraticEconomy`; the first live house with `facets.subterranean` / `clandestine` | `src/components/new/tabs/EconomicsTab.jsx` `<DeskLines mount={SHADOW_ECONOMY_MOUNT} rungs={[arcaneMarket, theocraticEconomy, hiddenHouse]}>`, under the tier line | yes |
| `src/domain/display/stateProse/powerStateProse.js :: gmAdvisoryPoolKey` (DS-POW-6 GM ADVISORY, two pools, every line dm-only) | `power.factionRelationships` | `src/components/new/tabs/PowerTab.jsx` `drawnAdvisory` at `UNDERSIDE_MOUNT` | yes |
| the same desk's `captureReading` (DS-POW-6 capture pressure ADVANCING / RECOVERING, capture reached an AGENT / a LEADER, every line dm-only) | the capture ladder | PowerTab `drawnCapture` at `UNDERSIDE_MOUNT` | yes |
| `src/domain/display/stateProse/defenseStateProse.js :: criminalCapturePoolKey` (DS-DEF-4 lens 2: `capture corrupted`, `capture capture`, every line dm-only) | `powerStructure.criminalCaptureState` | NO SURFACE: `DefenseTab.jsx` prints only `['structure']` of the criminal desk (line 325), `printProse.js` only `criminal.structure` (line 571) | yes (composed, printed nowhere) |
| `src/data/people/dmPowerLines.js :: PATRONAGE_LINES`, `CAPTURE_LINES` | `src/domain/people/patronage.js :: patronageOf`, `dmPowerViewOf`; `src/domain/people/hallCapture.js :: hallCaptureOf`, `hallReceipt` | `src/components/new/tabs/WhoRunsThisTownPanel.jsx` (PowerTab mounts it only `!publicDossier && !playerView`); `src/pdf/sections/WhoRunsThisTown.jsx` | NO (closures over a receipt; the kernel never draws them) |

THE MOVE, ONE LINE PER POOL (INFERRED, read; no code):
- DS-ECO-6 minor shadow (v6-v11; its base v1-v3 by the same design): NO existing slot keys on this tier (the FLAG/FACET lenses key on flags and facets; `TIER: a large share off the books (≥30)` is the tier slot at another tier). One would have to be made: a dm-only pool keyed on the same tier, a fourth rung of the existing `DeskLines` row at `economics.shadowEconomy`.
- DS-POW-6 duty evasion (v4-v7): NO existing slot keys on an operation role (`gmAdvisory` keys on relationships, `captureReading` on the ladder). One would have to be made: a dm-only pool keyed on `operation role duty evasion`, a further rung at `UNDERSIDE_MOUNT`, where the DM's dm-only rungs already print.
- DS-DEF-4 structure null (v4-v7): NO slot keys on the structure, and the block's one dm-only lens (capture) prints nowhere. One would have to be made AND printed: a dm-only rung at `defense.criminalStructure` beside `structure`.
- DS-DEF-4 FIXTURE: black market (v3-v6): the same; the fixture is said beside the structure line (`withSaid`), so its dm-only lines need that same new rung.

### (d) THE BYTE RATCHET AND A0b's CEILING: red by name, raised by nobody

`scripts/.prose-byte-baseline.json` is byte-identical at the base and the tip (EXECUTED). Level-9 gzip, as the test measures (EXECUTED at both trees; BUILD-1's tip figures from its report above):

| leaf | committed raw · gzip | ceiling raw · gzip | base | BUILD-1 tip 13c57d9f6 | this tip acedb0ac9 |
|---|---|---|---|---|---|
| defense | 287394 · 37962 | 488168 · 108482 | 287394 · 37962 | 302700 · 40123 | 302700 · 40123 |
| economy | 196627 · 26784 | 393810 · 87513 | 196627 · 26784 | 215992 · 29279 | **216267 · 29284** (+275 raw, +5 gzip: the five `colour` marks) |
| general | 307568 · 38822 | 796761 · 177058 | 307568 · 38822 | 312541 · 39521 | 312541 · 39521 |
| power | 136414 · 18762 | 357097 · 79355 | 136414 · 18762 | 141457 · 19440 | 141457 · 19440 |
| stressors | 148435 · 20910 | 258858 · 57524 | 148435 · 20910 | 149042 · 21015 | 149042 · 21015 |
| warFaith | 180478 · 25143 | 505306 · 112290 | 180478 · 25143 | 181969 · 25290 | 181969 · 25290 |

RAW is EXACT: all six red. GZIP's 1 % band: four red (defense, economy, general, power). Every leaf is under its ceiling.

A0b (`tests/lint/proseComposed.walker.test.js :: A0b — the text claims every declared field and no other > ⭐ THE SHIPPED CORPUS READING, printed and held SHRINK-ONLY`). What it counts, in its own words: "A0b · the AUTHORING debt on the shipped corpus, before a byte of the rewrite moves"; an under-claim is "a line that states less than its pool reads (it claims nothing false)"; "SHRINK-ONLY, and NOT an exact pin. The rewrite wave pays this debt down; a car that ADDS a claim the census does not license reds here on the day it lands." Figures (EXECUTED: the arm re-stated over each tree's leaves and wiring census, reproducing the test's own tip figures): under-claims **2103 at the base (= the ceiling, 1282 + 821 OWED), 2336 at the tip** (BUILD-1's +233; the cure's declarations moved none); over-claims 19 and 19 (ceiling 19); implicit negations 13 and 13 (ceiling 13); pools carrying a finding 305 and 305.

### EXECUTED vs INFERRED (this section)

EXECUTED: the register's reading, its red and its green; the declarations, the door and its check; both re-takes and their gates; every gate line above; the three-variant census at both trees; the mixed-pool re-statement at both trees and its per-pool table; the byte figures at both trees; A0b at both trees; the confinement.
INFERRED (read, not run): why the five lines need no atom; that no test outside those grepped sweeps four-plus pools for reach; every row of the dm-only-slot table and the move plan; that DS-DEF-4's capture lens is printed nowhere.
