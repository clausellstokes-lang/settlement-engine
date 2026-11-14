# W2-FIX-DATA-11: the data lane goes on curing (kept current after every item)

**State: IN PROGRESS.** Items 1, 2 and 3 DONE; item 4: the rank DONE (section 4), cure 1 (#185) pushed; the next cures follow the rank.

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

## 9. FOR THE JOIN

- Carried from HANDBACK-10 section 9, unchanged.
- #180 (`src/domain/crisis/crisisCast.js`, changed by lane/r2-code-b-2026-11-13): the occupation's `collaborator` role is filled by the `face` (the occupying governor) in 12 of 29 occupied towns; the one-line change: in the cast's collaborator pick, exclude the face's id (a power that gains, its most ambitious member OTHER than the face, or none).
- #59 and #6 (`src/data/institutionalCatalog.js`, changed by the upkeep lanes): the fairs' "International merchants. Letters of credit accepted." under a siege (3 towns; a siege twin keyed in institutionDescVariants.js would write the catalogue literal there: the same walker shape as the smelter's); #6 read at the tip as no longer printing the bar's sentence.
- #2 (`src/domain/display/institutionVocabulary.js`, a display file outside the lane): already named in HANDBACK-10 section 9.

## 10. The rulings this seat works to

The brief (BRIEF-W2-FIX-DATA-11), which carries the chair's 08:11 ruling on the tenth seat's stop (the three `config` reads in assembleInstitutions.js enter the observed-shape explained-writer bank by the chair's ruling, once, at the joined line's refreeze, by the merge seat: not on this lane).
