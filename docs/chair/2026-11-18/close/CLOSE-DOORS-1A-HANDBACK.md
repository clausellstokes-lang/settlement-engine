# CLOSE-DOORS-1A · the hand-back (the words' books: the wiring census, the generated state prose, the declarations ledgers)

Branch `lane/close-doors-1a-2026-11-18`, cut from **70e557d5b** (the working line's frozen tip; checked: it read
70e557d5bdffdf00ac45fb2ec4566674e6a33674). Scratch: a plain clone with its own `.git` and `npm ci`, outside the main
checkout; detached worktrees of it at 70e557d5b (the base), 6c117344f (the last closed tip), ee2bcd375 (where the shift
register was last taken) and f19c3b28b (where the move grammar's figures were last taken), `node_modules` linked. Every
run alone, to a file, through `sh scripts/gate-tail.sh`. No page line cured, no test written, skipped or weakened; no
ceiling raised. I sign nothing.

STATUS: **FINAL. A1 TO A5 DONE, AND THE CHAIR'S RULINGS CL11, CL14, CL17, CL18, CL19, CL25 TAKEN.** 20 of my 20 files
green alone at my tip (all 20 red at the base); proseComposed's last eight over-claims owed under CL25 (the matcher's
name-slot and bare-verb artifacts). One new red outside my list, named to the chair: presumptionClasses.walker
(CL18's move).

## WHERE MY RUN DIFFERS FROM THE BRIEF

- (The chair's correction CL11.) The stored figures were last true at **6483322cc**, the last close's Part 1 tip, not at
  6c117344f. My bases (e56e112e2 for the census, ee2bcd375 for the register's pins) hold the same census, annex, leaves
  and pool-meta digests as 6483322cc (measured); the A0b tallies are measured at 6483322cc itself.

- The committed census was last taken at **e56e112e2** (the BAR4 close's own tree), BEFORE JOIN-16 merged the round BAR5
  (points 1 to 9). So the census, the shift register, the byte rows and several ledgers move for BAR5's landings too
  (BAR5-MARKS, -SAFETY, -BAND, -POWERS, -FOOD, -MAGIC, -THINGS), not only for points 1 to 53 since 6c117344f. Several files
  of my list were already red at 6c117344f (tieProseDeclared, institutionProseDeclared, npcLoyaltyGuardRows,
  colourMarks4h, census2eTables, houseDescLateReRead): measured there, not assumed.
- The red-arm counts of the list match my base run exactly (13, 9, 4, 2, 3, 3, 4, 2, 1, 3, 4, 3, 1, 2, 1, 1, 2, 1, 1; and
  wiringCensusDeclared 1).

## C3 · EVERY RE-TAKE

| # | file | reading test | old → new | door | cause |
|---|---|---|---|---|---|
| A1 | `docs/content/wiring-census.json` | proseWiringCensus, wiringCensusDeclared, and 14 more readers | 859 pools / 2977 variants → 861 / 3033; 93 rows moved, 2 new | `node scripts/wiring-census.mjs --dry`; `node scripts/wiring-census.mjs`; `--check`; `npm run gen:dossier-prose -- --check` | each row laid to the landing whose annex pool moved it (the generator's own parse, at every first-parent landing since e56e112e2): BAR6-DEFDESK 35, BAR6-CULTURE 26, BAR7-DESKS 15, LEFT-LINES 8, BAR6-ECON 7 (incl. the 2 new pools), SEAM-DESKS 4, DEBT-1 3, SEAM-CULTURE 2, BAR6-POWERS 2, BAR5-SAFETY 2, BAR5-POWERS 2, BAR5-FOOD 1; code-side: DS-DEF-5's seven `forces` reads (BAR6-POWERS 10/g, 5843c7f74), DS-ECO-9's two `foodSecurityLabel` reads (BAR5-FOOD 9096d5b59) |
| A1 | `src/data/proseNorms.generated.js` | gen:dossier-prose --check | one comment: "270 of 859 pools" → "of 861" | `npm run gen:dossier-prose` | follows the census (told to the chair before commit); no other generated file moved, no sentence |
| A1 | `tests/lint/proseWiringCensus.walker.test.js` | itself | pools 859→861 (8 sites), variants 2977→3033 (3), mean '3.47'→'3.52', histogram (each pool named), unresolved/notExecutable/no reading 367→369, COVERED 244→246, function-grain 400→402, absence measured 590→597 and not-produced 62→55, mounted 728→730, SOURCE-UNRESOLVED 725→727, no stateOrgan 806→808; alias draft rows 21→24, generator-write 18→21 + its file list, docblock 45→46 | the file's own form, dated notes | the new pools: BAR6-ECON (JOIN-17 point 7); LEGACY-RECOVERED THIN→COVERED (BAR6-CULTURE, SEAM-CULTURE, DEBT-1); `forces`: BAR6-POWERS 10/g; the draft: SEAM-ECON item 2 (3c4a47f37, point 14: three `condition:siege` rows at viability.js:539, two re-sited to economicState.js:670), docblock: BAR6-ECON 528c5dece. As at the BAR4 close, the draft figure was declared by a cure but not named by its hand-back |
| A2 | `docs/content/prose-shift-register.json` | dossierStateProseProjection.contract | variant-count 0 2977→3033 and 1; face-count 0 2977→3033 and 2; vids 0; pool-key-rename 0; attach-set 1 | the register's own rows, one note replaced on the five moved rows | 32 pools grown (each with its landings in the note), 2 new (BAR6-ECON); no face, attach set or key moved. CORRECTED (1fdeeaf39): seven DS-DEF pools (BAR6-DEFDESK) placed a line before older ones, so those lines' vids moved up |
| A2 | `tests/data/dossierStateProseProjection.contract.test.js` | itself | META_ROWS 859→861 (3), absent 367→369, not-a-modifier 859→861 | the file's own form | BAR6-ECON's two new pools |
| A2 | `tests/domain/composeStateProse.test.js` | itself | pools 859→861 (3), variants 2977→3033; DECLARED_APART DS-ECO-6 + 'vid 5 / index 2' (172 cells held) | the file's own form; re-declared by identity | BAR6-ECON (528c5dece, row 9a.hands): DS-ECO-6 v4 declares `crime: ≥ organized` |
| A2 | `tests/lint/proseComposed.walker.test.js` | itself | the shipped corpus 2977→3033, the committed census 859→861 | the file's own form | as above |
| A2 | `tests/lint/proseWaveGate.walker.test.js` | itself | units 634→658, pools 859→861 (2) | the file's own form | the defense section's 24 new lines, each pool named with its landing |
| A2 | `tests/lint/proseMoveGrammar.walker.test.js` | itself | cells/pools 859→861 (2), spread 937→939, uniform 576→578, repeated opener 141→157, share 0.164→0.182, calibrations 519→520, 131→146 | ruling PM1: the arm's own rule on every pool at f19c3b28b and 70e557d5b | +2 uniform = the new pools; +16 repeated opener = 15 grown pools and one new, each named |
| A2 | `tests/lint/.prose-numerics-baseline.json` | proseNumerics (and economicsTabFlow, a comment) | 5 rows' lines: npcComponents 165→166, 171→172; NotableNPCs 331→339, 384→392; SystemStateSnapshot 150→151 | the baseline's own form (as 035159bc7), the test's own scanner | BAR6-PEOPLE, BAR7-CARDS (points 8, 20), BAR5-BAND 6c7068c05 |
| A2 | `scripts/.prose-byte-baseline.json` | proseCorpusBytes (and the contract, vendorPdfLazy) | defense 269046→281298, economy 188975→195233, general 301857→306982, power 131223→135398, stressors 147835→148435 (five declared rows); warFaith 180301→180478 (row moved, under its chain's 181741) | the declared-row idiom, bytes measured on disk (raw; gzip level 9), ruling B3 | each leaf's growth read off it at every first-parent landing, composing exactly (in the rows' reasons) |
| A3 | `tests/lint/proseEntryContradiction.walker.test.js` | itself | the two anchors re-keyed by TEXT (ruling BR32 (5)); corpus 3445→3501, pools 937→939, joined/leaf lines 2740→2794, trailing-coordinate 370→377 | class (b) by identity, red once in scratch; the counts in the file's own form | see A3 below |
| A4 | `tests/lint/undeclaredLines.register.json` | declarationRegisters (and census2eTables) | four counts fell, one row gone | `RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js` | BAR6-ECON (DS-SUP-3), BAR6-CULTURE (DS-POP-3, DS-STR-1, DS-STR-2 ×2) |
| A4 | `docs/census/declarations/` STRESS_DESCS, CULTURE_PROFILES_DAILY, CULTURE_ARCHITECTURAL_DETAILS, PRESSURE_SENTENCES, POLITICAL_FLAVOR, npcData.STRESS_ECONOMIC_EFFECTS, institutionServices.INSTITUTION_SERVICES, institutionDescVariants.INSTITUTION_DESC_VARIANTS | census2d/2e/2g, tieProseDeclared, institutionProseDeclared, colourMarks4h (+6 more readers) | row by row (commit aba73c9e6 lists each) | each ledger's own form; scratch probes reading each row as its readers do | BAR6-CULTURE (10 STRESS rows, 18 + 3 culture rows, the Maize text with SEAM-CULTURE), BAR8-SCENES (ironwork), BAR5-MAGIC and BAR7-SCENES (POLITICAL_FLAVOR), BAR5-THINGS (ties), BAR6-HOUSES and BAR5-MARKS and BAR7-LINES (services, descriptions) |
| A4 | `tests/generators/tieProseDeclared.test.js` | itself | declaring rows 45→50 | the note before it | BAR6-PEOPLE's three (343b41c74, written into the ledger, uncounted) + BAR5-THINGS's two |
| A4 | `tests/generators/institutionProseDeclared.test.js` | itself | services declaring 61→72 | the note before it | BAR6-HOUSES 9fa69a146 (×9), BAR5-MARKS (×2) |
| A4 | `tests/generators/npcLoyaltyGuardRows.test.js` | itself | DECLARED + 3 rows | the table's own form, by identity | BAR5-THINGS c74829e25 |
| A5 | `tests/domain/bar3CorpusGuards.test.js` | itself | DS-DEF-2 CHAIN food trades failing vid 3→4 | by its TEXT | BAR6-DEFDESK be3585040 (the stores-deep twin at v2) |
| A5 | `tests/generators/houseDescLateReRead.test.js` | itself | DESC_LATE_SIBLINGS 11→30 | the file's own comments | BAR5-MARKS +15 (JOIN-16 point 1), BAR6-HOUSES +4 (JOIN-17 point 2) |

## A3 · proseEntryContradiction (ruling BR32 (5))

- The breach anchor `row.line === 6181`: line 6181 is DS-GEN-1's `crime_wave` line `[street · minor · watch · crisis:
  any]`, which fires no arm; "the same trades exempt" (DS-GEN-1's occupation-rolls `[ledger · major …]` v3) is at 6225.
  Now found by block and text: **"reds on all four shipped breaches" TURNS GREEN.**
- The turtling anchor `r.line === 2428`: line 2428 is DS-POW-5's theocracy `[ledger · no crisis: occupied]` line (fires
  no arm, so the arm passed on the wrong row); the turtling row (`economicBase: extraction` v3 `[counterforce]`, "When
  {settlement} fights it does not march out") is at 2452. Now found by block and text; ANCHOR 5 green, on the right row.
- Its counts re-taken (above); 29/29.

## C1 · THE CLASS OF EVERY RED OF MY LIST (base 70e557d5b → my tip)

| file | red arms base → tip | class |
|---|---|---|
| tests/lint/proseWiringCensus.walker.test.js | 13 → 0 | (a) every arm (the census and its declared figures; the alias draft re-taken with its cause, as the chair ruled the same case at the BAR4 close) |
| tests/lint/wiringCensusDeclared.walker.test.js | 1 → 0 | (a) the stale census |
| tests/data/dossierStateProseProjection.contract.test.js | 9 → 0 | (a) the register's pins, the counts |
| tests/domain/composeStateProse.test.js | 4 → 0 | (a) counts; DECLARED_APART's DS-ECO-6 row (b), by identity |
| tests/lint/proseComposed.walker.test.js | 2 → 0 | (a) the corpus count; A0b: the under-claims owed (CL14), the eight matcher artifacts owed (CL25) |
| tests/lint/proseWaveGate.walker.test.js | 3 → 0 | (a) |
| tests/lint/proseMoveGrammar.walker.test.js | 3 → 0 | (a) under PM1 |
| tests/lint/proseEntryContradiction.walker.test.js | 4 → 0 | the breach anchor (b) by text (BR32 (5)); three counts (a) |
| tests/lint/proseCorpusBytes.test.js | 2 → 0 | (a) under B3 |
| tests/lint/proseNumerics.test.js | 1 → 0 | (b) five pure line moves, re-keyed by text |
| tests/domain/facts/census2dTables.test.js | 3 → 0 | (a) STRESS_DESCS, CULTURE ×2 ledgers; PRESSURE by the reader's cure (CL17 (1)) |
| tests/domain/facts/census2eTables.test.js | 4 → 0 | (a) as 2d and POLITICAL_FLAVOR ×6 rows; the readers' cures CL17 (1), (2) |
| tests/domain/facts/census2gDailyLifePriest.test.js | 3 → 0 | (a) as 2d; CL17 (1) |
| tests/domain/facts/declarationRegisters.test.js | 1 → 0 | (a) its own door, a shrink |
| tests/generators/tieProseDeclared.test.js | 2 → 0 | (a) (red at 6c117344f too) |
| tests/generators/institutionProseDeclared.test.js | 1 → 0 | (a) (red at 6c117344f too) |
| tests/generators/npcLoyaltyGuardRows.test.js | 1 → 0 | (b) three rows by identity (red at 6c117344f too) |
| tests/data/colourMarks4h.test.js | 2 → 0 | (a) (red at 6c117344f too) |
| tests/domain/bar3CorpusGuards.test.js | 1 → 0 | (b) by text, v3 → v4 |
| tests/generators/houseDescLateReRead.test.js | 1 → 0 | the length (a) re-pinned; the per-key law it hid cured at the colour column (CL18) |

Other readers of what I re-took, each alone, the same at the base and my tip unless said: census5dTablePools 2/2,
holderCitesBySymbol 3/3, proseLicenceCard 12/12, proseTasteInterested 4/4, sourceCitationIntegrity 18/18,
economicsTabFlow 36/36, vendorPdfLazy 27 + 28 skipped, hookLinePoolsDeclared 4/4, census2DeclaredPools 10/10,
census2gCatastrophicListing 2/2, census2gDecreeConnectives 5/5, hookEscalationDeclared 5/5, census4Ledger.walker 2/2;
dossierProseManifest 15/17 at both (its two drift arms read the golden corpus: CLOSE-DOORS-2's).

## C4 · ROWS LISTED FOR THE CHAIR (not banked, not raised)

proseComposed's A0b, ruled under CL14 (below): the eight class (c) over-claims are the only rows left. The under-claims
by seat and the full first measure: `under-new-attrib.tsv` in my scratch.

## THE CHAIR'S RULINGS, TAKEN (each its own commit)

- **CL19** (bbb672c8c): the `vids` note says the law was BREACHED ONCE: 14 moves in seven DS-DEF pools, cause
  be3585040 (the curfew pool's new v2 first appears there; only a shorter phrase greps at 1b7049ea6), why the door did
  not refuse (`generate-dossier-state-prose.mjs:493`, positional). My seven equal the chair's seven, move for move.
- **CL18** (ea65bada7): the four stale keys leave `src/data/institutionDescColour.js` in 8c0a3cd71's form (deleted). No
  `src/` file imports the column (grep: only a comment at `institutionDescVariants.js:2245`). The ledger's four rows:
  colour false, and the late declaration recorded in `colourReadBy`, NOT in `excludes`: every late-declared key of the
  ledger keeps empty draw-time columns (17 rows), and institutionProseDeclared's column law reds 78 vs 74 when the four
  carry `excludes` (shown, restored). houseDescLateReRead 5/5, colourMarks4h 4/4. The readers: style-law-scan
  (styleLaw.walker 20/20), table-pools (census --check exit 0, census5dTablePools 2/2), law5w (bar6CultureLines,
  bar6SeamDesks, coherenceAgreeCures: green at both), presumptionClasses.shared: **presumptionClasses.walker "no NEW
  undeclared line" reds: three hits (the billet line `ease` and `outside`, the cathedral line `outside`), no longer
  exempt as colour; named, not banked.**
- **CL17 (1)** (3180c1a14): `declaredLiteralsOf` reads a two-branch conditional text as two texts. No arm iterates the
  found texts against a ledger, so the new branch enters none. Negative control: `excludes` mutated, the arm reds (on
  the ledger's text; the other branch is read by no arm). census2d 11/11, census2g 14/14.
- **CL17 (2)** (076050ebb, then the ledger row b88bcac83): the found declaration's `calm` normalized last (`calmLast`,
  exported from census2dTables, used at its row arm and census2e's POLITICAL_FLAVOR arm); the draw reads the list by
  `includes`/`some` (`crisisAdmits`), never an index. Negative control: two non-calm entries swapped: red. stable[2]
  re-taken to its live declaration. census2e 25/25.
- **CL17 (3)**, the ledger validator: `scripts/census/census4-validate-ledger.mjs` (CENSUS-4 phase A, 42f212b1d) checks
  every ledger in `docs/census/declarations/` against `census4-extract-pools.mjs`'s row-shaped output and the
  VOCABULARY atoms. NO GATE RUNS IT (no reference in package.json, .github, .husky or any test). It cannot open since
  CENSUS-2's pool-shaped ledgers joined the same directory (2c1428102, 2026-11-04, ARRIVAL_MEMORIES.json first): the
  extract emits no such pool, so it throws at the first. A door that cannot open: the chair's to name to the owner.
- **CL14** (7a0baadd8): UNDER_CLAIM_OWED 734 → 815 (2016 at 6483322cc → 2097; 96 new − 15 gone, by seat in the note).
  OVER_CLAIM_OWED stays 1: of the eleven new over-claims (all DS-GEN-17 ADMINISTERED), 3 are covered by the line's own
  declaration (v4 `hasCourtSystem` by `no court sits`; v5 `hasCourtSystem` by `no court sits`, `hasPrison` by `no
  prison`) and fit the slack the ceiling held (46 over 43); **8 are class (c), for the chair**: v4 (BAR6-CULTURE
  d9857d7ce) `settlement` (the slot); v5 (LEFT-LINES 094a6b8f6) `settlement` and `hasGranary`, `hasHospital`,
  `hasMagicInst`, `hasMilitaryInst`, `hasNavy`, `hasWatch` (the word "has"). The arm read 54 > 46: red by exactly those. **CL25** (the next commit): the eight are the matcher's artifacts (the name
  slot; the verb "has" against six `has*` fields), owed: OVER_CLAIM_OWED 1 → 9, base untouched; proseComposed 87/87.

## LAWS AND STOPS SENT TO THE CHAIR (each since answered: above)

- 03:4x UTC, before commit (A1): `gen:dossier-prose` moves one generated file, proseNorms' comment count only.
- 04:0x UTC (C4): proseComposed's A0b ceilings, above.
- 04:0x UTC (STOP, A4): two rows no ledger value can cure: PRESSURE_SENTENCES.wartime(losing)[0] (its `text` became a
  ternary, BAR7-SCENES 765a516a3, `src/generators/narrativeText.js:277-279`; the arm's `declaredLiteralsOf` reads literal
  text only) and POLITICAL_FLAVOR.stable[2] (SCENES-3 4efba5868 declares crisis with `calm` FIRST; the arm's
  `expectedDeclaration` always appends `calm` LAST). Class (d): `census4-validate-ledger.mjs` refuses identically at base
  and tip (no extracted ARRIVAL_MEMORIES pool).
- 04:1x UTC (LAW): houseDescLateReRead's per-key arm: four DESC_LATE_SIBLINGS keys are colour lines (the hired company's
  two billet lines, the metropolitan cathedral's two; BAR5-MARKS e8068a494); and my own correction (the seven pools whose
  older lines' vids moved; the register's `vids` class is "none: refused").

## C7 · THE NET (my tip, each gate alone through `sh scripts/gate-tail.sh`)

- `npx vitest run tests/lint`, BY MESSAGE: base 70e557d5b **27 files / 66 tests red**; 3a28738a9 **20 / 39** (that count holds proseComposed's A0b arm, since owed under CL25 and green alone at 87/87;
  the whole suite was not re-run after that one-arm commit). 28 arms turn
  green (all of my list's lint files); **one turns red: presumptionClasses.walker "no NEW undeclared line" (CL18's move,
  named)**. One message moves on an arm red at both:
  observedShapeReaders' "an execution INPUT drifted since the mint" now also names `src/data/proseNorms.generated.js`
  (my one comment): that register's door is CLOSE-DOORS-1B's. No test file added or removed (no estate count moves).
- `npm run typecheck:ratchet` exit 0 (167 errors, ceiling 167; `tsc -p tsconfig.full.json` reads the same 167 at the
  base and here); `npm run typecheck:domain:strict` exit 0.
- `npx eslint` on the 13 JS files I changed: exit 0.
- `node scripts/wiring-census.mjs --check` exit 0; `npm run gen:dossier-prose -- --check` exit 0.

## FOR THE SEATS AFTER ME

Files under `src/` or `docs/content/` I changed (CLOSE-DOORS-1B: re-run your doors' `--check` after the merge):
- `docs/content/wiring-census.json` (the census, re-taken at its door);
- `docs/content/prose-shift-register.json` (five rows' pins and note);
- `src/data/proseNorms.generated.js` (one comment count; generated);
- `src/data/institutionDescColour.js` (four entries deleted, CL18; imported by no `src/` file).
observedShapeReaders' input drift now also lists `src/data/proseNorms.generated.js` (its door absorbs it). The presumption-classes
register (`tests/lint/presumptionClasses.register.json`) sees three new hits on the two lines CL18 took out of the colour column: the chair's to rule.
Other stored files I wrote: `scripts/.prose-byte-baseline.json`, `tests/lint/.prose-numerics-baseline.json`,
`tests/lint/undeclaredLines.register.json`, eight ledgers under `docs/census/declarations/`. The bundles and the golden
door read `src/`: proseNorms' comment is the only `src/` byte; the engine and AI bundles' source hashes may move by it.

## FOR THE OWNER, IN PLAIN WORDS

- The prose books (the wiring census, its register of shifts, the byte sizes, the declarations ledgers) were behind the
  writing two rounds had done. I brought each up to date through its own procedure, once, and named for every changed
  figure which branch's writing moved it. Nothing a town prints was changed.
- All twenty checks of my list now pass. The last eight findings of the check that counts over-claiming sentences
  turned out to be the checker misreading (the town's name, and the word "has"); the chair ruled them owed until the
  checker is taught better.
- On the chair's rulings I also fixed two blind spots of the ledger checks (a sentence written as an either/or, and the
  order of the word "calm"), and took four house descriptions out of the "colour" list because they now carry a
  condition. That last move makes another check see three new sentence findings; it is with the chair.
- One correction of my own: I first wrote that every new line took the next number in its pool; in seven defence pools a
  new line went in front of older ones and moved fourteen numbers. The record now says so, and that the rule against
  renumbering was broken once (the check that should have refused it compares positions only).

## WHAT IS LEFT, IN ORDER

1. CLOSE-DOORS-1B, on the final tree: presumptionClasses.walker's three new hits (CL18's lines; its door's
   `--bank debt-at-base` mode, the chair's word). The ledger validator that cannot open: named to the owner as a debt.
   A builder's item after the deploy: the A0b matcher learning the name slot and the bare verb (CL25); the generator's
   vids guard armed (CL19).
2. CLOSE-DOORS-1B, after the merge: the observed-shape readers' input drift (now with proseNorms), the edge bundles'
   freshness, and every door that reads `docs/content/` or `src/data/`.
3. CLOSE-DOORS-2: dossierProseManifest's drift arms (the golden corpus), red identically at the base and here.
4. Scratch artefacts (probes, logs, the attribution tables) stay in this seat's scratch directory; none is committed.
