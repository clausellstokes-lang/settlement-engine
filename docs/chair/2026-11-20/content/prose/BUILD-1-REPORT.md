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
