# W2-FIX-DATA-11: the data lane goes on curing (kept current after every item)

**State: HANDED BACK BY FILE at the count (327,976 at 09:52; the next cure with its reads and gates would cross 400,000).** Items 1, 2, 3 DONE; item 4: the rank DONE, cure 1 (#185) pushed; the chair's 09:04 and 09:14 rows MEASURED, not cured (section 5). Every figure EXECUTED unless marked PLAUSIBLE.

**Seat.** The eleventh seat on `lane/w2-fix-data-2026-11-13`, from `a1481aaf7` (read back from origin first: the brief's tip, no stop). Chair: `session_01ACmDYZrFEVXyZEUg1NDxxC`. Brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-W2-FIX-DATA-11.md`, self-contained. A reader reads this lane at a1481aaf7: nothing at or below it is rewritten.

## 0. Instruments (re-made in minutes)

- Scratch worktree `/home/user/wt11` on local branch `w11` at the lane's tip, `npm ci` there (it writes `core.hooksPath=.husky/_` and the branch's tracking keys into the shared config: nothing else; compared before and after every push). Detached `/home/user/wt11-line` at the line's 976db5b19, `node_modules` linked from `/home/user/wt11`.
- Pushes: `git push origin w11:refs/heads/lane/w2-fix-data-2026-11-13`, each after `git fetch` and `test -n "$(git rev-list origin/lane/w2-fix-data-2026-11-13..w11)"`.
- Births (`births11.mjs`, the scratchpad's `q/`): the census 720 (CENSUS-2's `seeds.txt` and `seedcfg.mjs`, from `origin/lane/census-2-2026-11-13:docs/chair/2026-11-13/probes/CENSUS-2/` by git archive) and the bar's ten fresh towns (`seeds.bar0.txt`, the `bar0-` branch of `render.bar0.jsx :: cfgFor` verbatim, from `origin/lane/review-bar-0-2026-11-14:docs/chair/2026-11-14/probes/REVIEW-BAR-0/`): 730 births, 0 errors, 76 s. Queries over the gzipped ndjson by script (`where.mjs`, `town.mjs`, `rank.mjs`).
- Holders by content: `holders.sh <file>` = `git diff --stat origin/lane/integration-2026-11-07 origin/<lane> -- <file>` over the 49 lanes dated 2026-11-12 to 2026-11-14 (the join, the rehearsal and the review lanes carry this lane's merged copies; compared against this lane's own history before a file is called another lane's).

## 1. The three named reds (EXECUTED, pushed)

| red | state | commit |
|---|---|---|
| (a) `tests/data/w2FixData6Rows.test.js` "under a siege the coaching inn takes no traveller off the road" | RE-KEYED BY IDENTITY: r2s-under_siege-city-2 (no Coaching inn after the line's re-deal) -> r2s-under_siege-town-1, a besieged census town with a Coaching inn printing both siege twins; the three expectations unchanged. Read at the tip: town-0 (bed line only), town-1, metropolis-0, -2, -3 (both). PLANT: the bed twin's crisis set to `['famine']` reds the arm; reverted. 9 passed. | `8d2aa98b1` |
| (b) `tests/lint/presumedThings.walker.test.js` ARM 2 "no stale row" | CURED by the door's own `node scripts/presumed-things-door.mjs --shrink-arm2` (exit 0): two first-register arm-2 rows out, `docks .institutions[].desc "by road or harbour"` (hedge, 22 towns) and `walls .institutions[].desc "walls and churches of half the region"` (hedge, 7). Nothing added. Walker: 42 passed, 1 failed, ARM 1 "every source literal that names a thing declares it, or has its row" (the 49 fresh declaration-pass rows carried: `--check` fresh 49, stale 0; NOT this lane's). No other lane's register copy removes either row. | `ddadf07c5` |
| (c) `tests/generators/generationForkCensus.test.js` A1 "the control row regenerated under both mocks" | READ, NOT RE-KEYED (a measured pin the merge seat re-keys at the refreeze). The control row `town|germanic|plains|road|civilized|golden-master-v3`: f4fc47a0ffe9036b899c2ce86a4fbb071857e321eb222599108adc3f6ccea662 at the line (= the committed manifest) -> b90094e24fa41de2877ddf7a1f09842f68b2fe19641152cb2ff2aa9e2c3658ae at the tip. 22 leaves, four families: `.institutions[22].desc` + its `.defenseProfile.institutions.watch[0].desc` copy ("hold the gates" -> "keep the peace", 4c4a1c269, the watch twin); `.history` 15: two event descriptions reworded (b91fcfe11), the iron-rights event reworded and "Fortified extraction sites" off a town with no mine (ab58c3ec3, item E), the `infiltration_fear` tension leaves the timeline (009ee1466, item G; BISECTED: present at 009ee1466^, absent at 009ee1466); `.generationCoherenceReceipt` 5 (its evidence cites the tension). Named in the draft shift record with both hashes. | none (a read) |

The two walkers the chair's 08:11 ruling names (observedShapeReaders, writerReach) stay red for the `config` reads alone, until the merge seat's refreeze.

## 2. The draft shift record (EXECUTED): `docs/chair/2026-11-14/W2-FIX-DATA-shift-record.DRAFT.json`

Unsigned (owner fields and seat blank); no golden's door run. The 51 registered surfaces' suites run as files at the tip ddadf07c5 (378 passed, 5 failed) and the line 976db5b19 (380 passed, 3 failed), no `UPDATE_*` set:
- MOVED: `generator-golden-master` (green at the line; 525 configuration hashes differ at the tip), `espionage-dormancy-fence` ("THE DRIVEN GOLDEN: 360 settlements ... hash to the PRE-COUPLING corpus" green at the line, red at the tip).
- RED AT BOTH, MOVED FURTHER: `dossier-prose-manifest` (the same three tests red; "rows whose composed prose moved" 1,038 at the line, 1,050 at the tip).
- UNMOVED: the other 48, green at both ends.
- The causes: the lane's declared families of HANDBACK-10 section 5, written into the record.

## 3. The message to the chair: SENT 08:42 UTC (the tip 4a3597e39, the three reds, the record's moved surfaces).

## 4. The bar's twenty-one rows

**THE RANK (EXECUTED, `rank.mjs` over the 730 births at 4a3597e39: the towns whose RECORD prints the row's sentence, and of those the towns where the row's fact holds).** The record field is the one the card, the Services tab, the PDF view model and the Foundry journal print (read verbatim on all four for #185 below).

| row | writer (at the tip) | prints | false | the fact |
|---|---|---|---|---|
| #64 / #191 | institutionServices.js (brick service) | 159 | 156 | the brickmaker lacks clay (resourceAnalysis.gaps) |
| #185 | institutionDescVariants.js (smelter; the rank read one of three texts: 47; all three: 159 of 241) | 68 | 47 | no mine 45, no smith 11 |
| #9 | institutionServices.js (mine service "Ore cut underground") | 97 | 73 | no mining chain working |
| #6 | institutionalCatalog.js (the Mine's text; at the tip "A mine of shafts and adits ... Where the deposits ran deep") | 97 | 73 | the same; the tip's text is past-tense, READ: the bar's sentence no longer prints |
| #158 | generators/historyGenerator.js (the compact's grain clause) | 20 | 17 | no shortage (food secure 17, calm 8) |
| #233 | arrivalProse.js ("Sacks of herbs and spices") | 12 | 12 | no spices import |
| #68 | institutionServices.js (livestock auctions) | 151 | 12 | siege 8, famine 5 |
| #180 | stressTypes.js through crisisCast.js (the collaborator) | 29 occupied | 12 | the collaborator is the occupation's own face |
| #73 | institutionServices.js (toll) | 159 | 10 | siege |
| #67 | institutionServices.js (the year's fair) | 179 | 8 | siege |
| #156 | institutionDescVariants.js (thorp "all of it for the table") | 39 | 7 | grain exported |
| #36 | arrivalProse.js (salt fish barrels) | 19 | 6 | siege 4, famine 3, fish failed 3 |
| #51 | institutionDescVariants.js (brewery "for regional sale") | 92 | 6 | siege 3, famine 4 |
| #71 | institutionServices.js (fresh fish retail) | 144 | 5 | fish failed or absent |
| #54 | institutionDescVariants.js (coaching inn "Built for the road") | 57 | 4 | siege |
| #60 | institutionDescVariants.js (ferry "Carts ... wait their turn") | 22 | 3 | siege |
| #157 | institutionDescVariants.js (reeve "His writ") | 4 | 3 | a woman holds the post |
| #59 | institutionalCatalog.js (fairs "International merchants") | 57 | 3 | siege |
| #57 | institutionDescVariants.js (fish market "the morning's catch") | 40 | 1 | fish failed |
| #2 | institutionVocabulary.js (display: "Hundreds of houses of worship") | (render) | 1 | the count "50-100+" |

**THE CURES (widest cause first).**

1. **#185, the smelter: CURED for its two variants** (`930836ac5`, with the pool rows `c663cfa23` and the lighting census `010a99a78`). The two PAIRS texts declare `needs ["institution: mine", "institution: smith"]`, each with a twin naming neither. Counts on the re-born 730: variants false 102 -> 0 (103 twins; originals kept in 42 towns holding both). NEW LINES (the owner's veto list), each read on the card, the PDF view model and the Foundry journal: "Charcoal furnaces reduce raw ore to refined metal, cast in bars for whoever will buy them." (r2s-under_siege-town-1, town, siege; r2r-town-38; r2r-metropolis-4); "Refines crude ore into workable metal over charcoal fire, and sells it on by the bar." (r2s-famine-town-0, town, famine; r2r-town-1; r2r-metropolis-1). Guard: `tests/data/w2FixData11Rows.test.js` (r2r-town-1, r2r-town-9 no mine; r2r-town-38 no smith; r2r-town-11 keeps it), red first (3 of 3), green after. Doors: presumed-things fresh 49 unchanged, 2 stale `smith` rows out by `--shrink`; grid 0 rises; eslint, domain-strict, type ratchet green. **A CALL FOR THE CHAIR'S VETO:** the declaration makes the three Smelter pools drawn, and the pool guard then reads them unregistered; they took rows by the door's own `--bank-new` (no other row touched, no ceiling raised; the register's pool tally 931 -> 934), as this lane's 4c4a1c269 did. **PARKED with its word `house: mine`:** the catalogue's own text "Converts raw ore ... The industrial intermediate between mine and smithy." (57 towns false): keying its sibling set in this lane's file writes its literal there, a NEW `house: mine` line the walker cannot credit (`house: mine` has no atom; it waits for a factsOf getter), and importing the catalogue into the variants file would move the generation worker's signed bundle.

## 5. THE CHAIR'S ROWS OF 09:04 AND 09:14 (they go BEFORE the ranked rows; MEASURED, not cured)

The chair's 09:04 ruling: the lane reader's rows (`origin/lane/review-w2-fix-data-3-2026-11-14:docs/chair/2026-11-14/REVIEW-W2-FIX-DATA-3-2026-11-14.md`, section "Done"; the rows in `REVIEW-W2-FIX-DATA-3-LINES-READ.md`) go before the bar's ranked rows, each its own commit, read where it prints. The 09:14 ruling: the bar's #116 (a HIGH) after them.

1. **The arrival's forge line (THE STAGE'S OWN MEDIUM; A04 the same line).** Writer: `src/data/arrivalProse.js:65`, `` `The hammering echoes through all of ${n}, and the place plainly lives by its forges.` `` with `needs: ['tier: ≥ town']` only. MEASURED on the 730 at 010a99a78: it prints in **16 towns and is false in all 16**: the metal trade (an `economicState.incomeSources` row naming iron, metal, smith, forge or smelt) is never the first source; it sits 3rd to 12th, at 3 to 12% (r2s-infiltrated-metropolis-3, Vatantash, 8th at 4%; r2r-town-7 5th at 11%; r2s-monster_pressure-town-1 3rd at 12%). No atom reads an income share. RECOMMENDED CURE (one commit, red first): drop the claim ("silence is not a false sentence"), e.g. `` `The hammering of the forges echoes through all of ${n}.` ``, and declare `institution: smith` beside the tier (A04: a town with only an idle Smelter), with a twin only if the slot must not empty; the guard towns r2s-infiltrated-metropolis-3 and r2s-mass_migration-town-0 (A04); read on the Summary's arrival, the PDF and the journal.
2. **The PDF's Architecture line (CARRIED HIGH).** `src/pdf/sections/IdentityDailyLife.jsx:303` prints `culturalIdentity.architecturalDetail` raw. HELD BY THIS LANE ALONE (no other lane's copy changes it since its base with the line; the lane's own copy equals the line's). So it is this lane's: the PDF must print it through the same reading the web page uses (find the web page's reader of `architecturalDetail` and call it there). Not started.
3. **A06, I23, the two guild lines (CARRIED MEDIUM).** A06: the arms racks "waiting for the carts" under a forced siege (r2s-under_siege-city-3): the row lacks the `excludes: crisis: under_siege` its twins A03/A07 carry. I23: an emergent-siege toll bridge (r2r-metropolis-14). The guild lines: Megaikon (r2r-village-55) Guild War beside "No guild runs Megaikon's market"; Radhagrad (r2s-slave_revolt-hamlet-1) "the guilds negotiated" beside "no guild" (the second is HANDBACK-10 section 8's draw-time `guild`). Not read.
4. **#116 (HIGH, the chair's 09:14).** `src/data/institutionalCatalog.js`, the house 'Sawmill (commercial)' lacks the timber tag its kind carries (48 of the corpus seat's 772 towns read as working no timber). The catalogue is changed by the upkeep lanes too (coherence-upkeep, upkeep-capacity, review-upkeep-capacity: one line added each, a different row): the chair has ruled the row this lane's. Measure first (the towns holding a commercial sawmill that print an unworked-timber line on any surface); cure at the catalogue row as a DECLARED MOVE (the resource analysis, the chains, the lines that read them); STOP with the table if the tag moves more than those towns' timber lines. Not started.

## 6. WHAT IS LEFT, line by line

1. Section 5 items 1 to 4, in that order.
2. The ranked rows of section 4 after #185, widest cause first: the siege cells (#67 #73 #68 in institutionServices.js; #54 #60 #51 in institutionDescVariants.js; #36 in arrivalProse.js: one cause, crisis twins in the established shape of 18fcc08ca / 43e80bfde); #158 (historyGenerator.js, the compact's grain clause where no shortage: 17); #233 (arrivalProse.js, "herbs and spices" with no spice import: 12); #156; #71 and #57 (the `fish` food-source atom answers them); #157 (reword "His writ" to name no sex: 3).
3. PARKED, each with its word: #64/#191 the brick service where the brickmaker lacks clay (156 towns; no atom reads a chain's input: the word would be a chain-working atom over `facts/chainWorking.js`); #9 the mine service "Ore cut underground" where no mining chain works (73; the same word); the smelter's catalogue text (57; `house: mine` waits for a getter).
4. Section 4's item 5 of the brief (the census's candidates the tenth seat did not read): not started.

## 7. How the instruments are re-made

Section 0, plus: `rank.mjs` (one predicate per bar row over the births; rows from `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/bar-0-rows/BAR-0-ROWS-data.json`); `surfaces.mjs <regex> <seed...>` (the record field, the PDF view model `buildViewModel({ settlement })` and the Foundry journal `buildJournalPages(vm)` for census towns); the page render `render2.sh` from the bar's probes with CENSUS-2's `render.census2.jsx` (`__P__` set to the CENSUS-2 probe directory); `pd.mjs <tree>` (`judgeCorpus` of `scripts/census/pool-dominance.mjs`, the walker's own findings in full, about 5 minutes).

## 9. FOR THE JOIN

- Carried from HANDBACK-10 section 9, unchanged.
- #180 (`src/domain/crisis/crisisCast.js`, changed by lane/r2-code-b-2026-11-13): the occupation's `collaborator` role is filled by the `face` (the occupying governor) in 12 of 29 occupied towns; the one-line change: in the cast's collaborator pick, exclude the face's id (a power that gains, its most ambitious member OTHER than the face, or none).
- #59 and #6 (`src/data/institutionalCatalog.js`, changed by the upkeep lanes): the fairs' "International merchants. Letters of credit accepted." under a siege (3 towns; a siege twin keyed in institutionDescVariants.js would write the catalogue literal there: the same walker shape as the smelter's); #6 read at the tip as no longer printing the bar's sentence.
- #2 (`src/domain/display/institutionVocabulary.js`, a display file outside the lane): already named in HANDBACK-10 section 9.

## 10. The rulings this seat works to

The brief (BRIEF-W2-FIX-DATA-11); the chair's 09:04 ruling (the reader's rows before the ranked rows) and 09:14 ruling (#116, after them), section 5; the brief carries the chair's 08:11 ruling on the tenth seat's stop (the three `config` reads in assembleInstitutions.js enter the observed-shape explained-writer bank by the chair's ruling, once, at the joined line's refreeze, by the merge seat: not on this lane).
