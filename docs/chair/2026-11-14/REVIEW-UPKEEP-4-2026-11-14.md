# REVIEW-UPKEEP-4 · the defence lane at 9c32016c9 (its own commits from 0a07f98c7) — HANDED BACK BY FILE AT THE COUNT

**Status: NO VERDICT YET.** Step 1 is done and pushed (a23659ba9). Step 2 was begun, and one part of it is read (below). Steps
2 to 8 are LEFT, line by line, at the foot. I am handing back because the count stood at 324,327 at the 11:42 check, and one
read of the 252 KB statement would carry this seat past 400,000.
The lane's origin tip moved to 4b312f5ce (UPKEEP-14, one commit) after 9c32016c9. I read 9c32016c9, as named, and told the chair.

## Findings so far (step 1; detail and towns in REVIEW-UPKEEP-4-LINES-READ.md). All are EXECUTED.
- **MEDIUM, THE STAGE'S OWN (M1, kind g):** in 77 famine towns the food endurance line (defenseDisplay.js :: monthsInWords, 1a7a02927)
  says "a few days", beside the Economy tab's stores row "a few weeks" (ru4-under_siege+famine-city-1: "the granary carries the city
  for a few days at full rations" / "Stores: a granary, a few weeks of grain."; r2r-hamlet-16: "household stores would carry the hamlet
  for a few days" / "No granary; a few weeks in the larder."). The record holds 0.1 months, so the stage's words are true. The row's
  words were false at the base too (writer: src/domain/summary/tonightSheet.js:589). But the two agreed at the base: the disagreement
  is new at the tip. src/domain/coherence/crisisFactFindings.js:96-103 reads "a few weeks" back as months; whether it reads "a few
  days" is LEFT (step 4).
- MEDIUM, CARRIED (twins the stage's cures left): C-M1 is the Internal Security row, which names a court in 133 towns with no court
  house (threatAssessment.js). C-M2 is "Wild country all round and nobody organised to meet it…" beside a charter hall, in 27 towns
  (threatAssessment.js). C-M3 is "Money enough to ride out a long crisis, laid by before the debt crisis" in 25 indebted towns; the
  sentence is carried, the clause the stage's own.
- LOW, the stage's own: L1 "The garrison and town watch keeps what rounds it can…" (26 towns); L2 "buying in…" beside "No recorded
  imports." (2); L3 "a few weeks" beside "about a month" (11); L5 "isolation-support gap"; L6 "does little trade" beside "Highly
  diversified" (2). LOW, CARRIED: L4 River Tolls under a siege (11); L7 the Defense tab's "REQ" badge (748: the chair rules whether
  the PDF's ruling covers the app); TG1 (2).

## Step 2, the part read (the twelfth seat's own section of docs/chair/2026-11-12/UPKEEP-HANDBACK.md, (a) to (c) and STEP 3)
- H1: the statement says the label moves in 26 births, all Undefended → Vulnerable. **My count on the 972: 26**, and 27 → 0 false. What
  prints in its place is TRUE on every surface. Cured and true.
- H2: the statement says the newly silent towns print their band alone. **Mine: 14 → 0 on the 972; all 18 of 1,278 print the band
  alone** (walls, a watch and a charter hall). Cured by silence. The statement says so itself and writes no new sentence.
- H3: the statement does NOT claim it cured; it names H3 FOR THE JOIN (the pool DS-DEF-2, defense.generated.js), 18 walled on the 972.
  **Mine: 18 on the 972.** It agrees. Still false and CARRIED. It is not the stage's, but the release bar's.
- #115: cured at fd1330673, "mages' guild 87 / 5 (cured)". **Mine: 5 → 0 on the 972;** what prints instead, the first sentence
  alone, is TRUE in 5/5. Its "managed felling 201 / 111" is named FOR THE JOIN; I did not measure it (LEFT).
- #216: cured at fb7a61558, "on the 972: 0 move". **Mine: the false form prints in 0 of 1,278 at the base**, so the cure is never
  exercised on any of my births. Its own town (bar0-hamlet-calm-rand-1) is LEFT.

## WHAT IS LEFT, line by line (each NOT STARTED unless marked)
1. STEP 2, the rest: the seats inside the stage, UPKEEP-7 to UPKEEP-12, in UPKEEP-HANDBACK.md (lines 168–1553 at 9c32016c9). Take
   every row each says it cured: its own town and my births; what prints in its place, read; for each removal, thirty removed lines
   read. My base scan already gives the removed sets (`scan.base.ndjson` minus `scan.tip.ndjson`, by id: C16a 256 gone, C16f 388,
   C16g 308, C16h 172, C16m 142, C16o 109, C16j 149, A2k 243, A3g 130, D4b 128, D4c 105). Read thirty of each against the base
   record (checks.base.ndjson.gz has the scripted reading: e.g. C16f at the base, 301 of 404 false by the printed imports; C16i, 17 of 19
   TRUE at the base and all removed, to be read). Then the headline counts by my own run, and the chair's rulings copied there,
   judged row by row.
2. STEP 3: a field diff over the census's 720 births, base against tip. Use the capacity reader's `fielddiff.mjs`
   (origin/lane/review-upkeep-capacity-2026-11-14, docs/chair/2026-11-14/probes/REVIEW-UPKEEP-CAPACITY/): the records are already
   rendered as `<out>/{tip,base}/<seed>.json.gz`. Because the capacity branch merged in between, attribute with DEF = 6e61d042a as
   the capacity reader did. Then: the golden-freeze register, measured where declared and sampled where not. `criminalPreStress`:
   **measured, it is on the record at the BASE already** (r2r-hamlet-0: `"criminalPreStress":3.84…` in both trees; introduced by
   fe5786c97, before this stage), so it is not a new key of this stage. Still to check: no new vocabulary word; no user-hideable name
   in a stored sentence (the income lines carry none: houseOfWorkLine words by trade).
3. STEP 4: a plant for each guard the stage added or changed (tests/generators/incomeLinesSayTheRecord, safetyLinesSayTheRecord,
   threatRowsTrueUnderBand, outlookSaysThePages, defenseReadinessWord, houseOfWorkEarns, foodEnduranceSaysTheStores…). Make each
   plant in a scratch worktree at 9c32016c9: one fault each, run that file through `sh scripts/gate-tail.sh npx vitest run <file>`.
   List the cures with no guard: the food line against the stores row (M1) has none.
4. STEP 5: the merge ef9f38e80. Its remerge diff is read for src: defenseDisplay.js keeps the lane's `would` and adds the line's
   `stand` verb, and both sides' moods agree. dossierViewModel.js keeps both import tails. generationForkRegistry hash 24 still has to
   be measured (A6). The register files of the merge are still to be re-derived through their doors: lighting census, tuning inventory,
   presumedThings, heldKeyWriterCensus, institutionTable.
5. STEP 6: the gates at the tip: the strict-domain gate, the type ratchet, and eslint on the touched files. Run each through
   `sh scripts/gate-tail.sh`, then the governing test files at tip and base. node_modules: `$S/tip` has npm ci (the lock is
   identical across the range) and `$S/base` links to it. Snapshot refs and local config around each run. npm ci added
   `core.hookspath=.husky/_` to the shared config at 11:25: recorded, left in place.
6. STEP 7: census2.sh at tip and base with `--files` = the stage's code files (the list in this file's step-1 source:
   `git log --first-parent --no-merges --name-only 0a07f98c7..9c32016c9 -- src`).
7. STEP 8: the rating's declared moves by field diff over the 1,200 rv2 births (REVIEW-UPKEEP-3's render4.mjs seed shape). Then the
   two re-keyed pins measured: hash calls 24, service rows 1,837. Then thirty prints of the statement's RED-AND-NAMED literals, read.
8. The verdict file, and the message to the chair.

## How the instruments are re-made
`git fetch origin lane/review-upkeep-4-2026-11-14`. The probes are under docs/chair/2026-11-14/probes/REVIEW-UPKEEP-4/.
1. Worktrees: `git worktree add --detach <S>/tip 9c32016c9`, the same for `<S>/base 0a07f98c7`. Run `npm ci` in tip, then
   `ln -s <S>/tip/node_modules <S>/base/`.
2. Births: `cat <capacity probes>/all.seeds own4.seeds > all4.seeds`, then `TREE=<S>/tip SKIP=1 node render6.mjs all4.seeds <out>/tip`.
   Do the same for base: about 25 minutes for both on 4 processes.
3. Then `python3 -I facts.py <out>/<t> facts.<t>.ndjson` and `python3 -I scan.py <out>/<t> scan.<t>.ndjson`.
4. Then `python3 -I checks.py <out>/<t> scan.<t>.ndjson facts.<t>.ndjson checks.<t>.ndjson` and `python3 -I table.py > table.md`,
   in the out dir.
My scratch copies are at /tmp/claude-0/-home-user-settlement-engine/b0424f57-d85f-55e6-97c5-928be8585810/scratchpad/out. A
container restart loses them.
