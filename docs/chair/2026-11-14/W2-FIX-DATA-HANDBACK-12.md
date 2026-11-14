# W2-FIX-DATA-12: the data lane goes on curing (kept current after every item)

**State: WORKING.** Item 1 DONE (pushed). Every figure EXECUTED unless marked PLAUSIBLE.

**Seat.** The twelfth seat on `lane/w2-fix-data-2026-11-13`, from `994733bcd` (read back from origin first: the brief's tip, no stop). Chair: `session_01ACmDYZrFEVXyZEUg1NDxxC`. Brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-W2-FIX-DATA-12.md`. Nothing at or below 994733bcd is rewritten.

## 0. Instruments (re-made in minutes)

- Scratch worktree `/home/user/wt12` on local branch `w12` at the lane's tip, `npm ci` there (it wrote `core.hooksPath=.husky/_` and the branch's tracking keys into the shared config: nothing else).
- Pushes: `git push origin w12:refs/heads/lane/w2-fix-data-2026-11-13`, each after `git fetch` and `test -n "$(git rev-list origin/lane/w2-fix-data-2026-11-13..w12)"`.
- Births: the scratchpad's `q/births.mjs` = CENSUS-2's `births.mjs` verbatim, `q/seedcfg.mjs` = CENSUS-2's `seedcfg.mjs` plus the bar's `bar0-` branch (`render.bar0.jsx :: cfgFor` verbatim); seeds = CENSUS-2's 720 + `seeds.bar0.txt` (730; 0 errors, about 75 s). Queries over the gzipped ndjson: `fdiff.mjs` (field diff by family), `pp.mjs` (buildPrintProse lines), `surfaces.mjs` (record, PDF view model, journal), `gap.mjs` (the page's `resourceGapLines`), `read116.mjs`.
- Holders by content: `holders.sh <file>` = `git diff --stat origin/lane/integration-2026-11-07 origin/<lane> -- <file>` over the 57 lanes dated 2026-11-12 to 2026-11-14.

## 1. The rulings this seat works to

The brief (BRIEF-W2-FIX-DATA-12); the chair's 10:40 message: ONE ROW MORE for the ranked table, `src/data/institutionDescVariants.js`, the adventurers' charter hall's "...with no garrison to call on it musters the defence..." (4 births whose Beasts & Monsters band reads Critical, 2 Weak; measured on origin/lane/coherence-upkeep-2026-11-12 UPKEEP-HANDBACK.md "P5"). RULED: a house's description claims no verdict a band on its own page can deny; reworded to what the hall is and does (it takes contracts against what comes out of the wild), no claim that the defence is mustered or holds. MEDIUM, placed by its count after the two HIGH rows and the forge line; read where it prints, an occupied town among the three.

## 2. The rows

### Item 1 · #116, the commercial sawmill's tag (HIGH): CURED at the record, `fe2e15e34` (lighting census `1ed8e6de6`)

- Table: `src/data/institutionalCatalog.js`, 'Sawmill (commercial)' shared tags `['trade']` -> `['trade', 'timber']` (TAG.TIMBER, what the timber and mountain-timber chains' `processingTags` read in `resourceGenerator.js :: institutionSupportsChain`; the village 'Sawmill' matched only by its exact name). Holders: no other lane's copy touches the row (the upkeep lanes add other rows); the chair ruled the row this lane's.
- Counts on the 730 (994733bcd -> fe2e15e34): towns holding a commercial sawmill with timber filed unexploited 47 (town 8, city 20, metropolis 19) -> 0; the journal's `| Timber | unexploited |` 47 -> 0; the PDF's `resourceExploitation.unexploited` timber 47 -> 0; the Resources card "Needs: Sawmill, Carpenters' guild" (the unexploited card) 47 -> 0; the unworked-timber pool lines ("leaves its timber unworked", "nobody has found it worth the trouble") 40 -> 0.
- DECLARED MOVE (field diff by family, towns): 247 moved: `.institutions[].tags[]` 247 (every commercial sawmill and the village 'Sawmill' inheriting the shared tags, whose supporter count does not move); `.resourceAnalysis.exploitation` unexploited -> partial 47, mountain timber partial -> full 7; `.exports[]` 47; `.gaps[]` impact/severity 47, chain/missing 10, institution/kind 7; `.priorityNotes[]` 23 (+13 "Weak economic focus leaves several resource chains underdeveloped...", -9 "...untapped timber..."); `.simulationTrace[].downstreamEffects[]` 7 (villages: tag.timber reinforced). Nothing else.
- EXPOSED, NOT CURED HERE (declared): (a) the partial pool now speaks in those towns: "{S} works part of the line that timber could support: ... before it has been made into anything worth more." 13 and "timber leaves {S} half-finished, and nobody in the city is troubled by it." 8 (the bar's #116 sentence itself; bar0-city-wartime-rand-1 Naranjotzin prints it now): `src/data/dossierStateProse/economy.generated.js`, the W2-WRITE lane's #116 (BRIEF-W2-WRITE-10 item 1). (b) the page's gap line "Work on the timber here stops half-way: no sawmill or carpenters' guild finishes it." 12 (before: that line 3 + "No one here works the timber near {S}." 10): FOR THE JOIN, below.
- Read: r2r-town-1 Karakabad (town), r2s-under_siege-city-3 Weichhof (city, siege), r2r-metropolis-5 Filopambelos (metropolis): PDF partial, journal partial, card `timber -> lumber -> planks`. No line written.
- Guard: `tests/data/w2FixData12Rows.test.js` #116 (the three; r2r-town-12, no timber house, keeps timber unexploited): red 3 of 3 with the tag planted out, green after.
- Doors: presumed-things `--check` fresh 49 stale 0 (carried); walker 42 passed / 1 failed (ARM 1, the carried 49); grid 0 rises; domain-strict, type ratchet, eslint: exit 0.

## 3. FOR THE JOIN

- `src/generators/resourceGenerator.js :: evaluateInstitutionChain` (held by many lanes): a partial chain's `missing` list is by exact name, so 'Sawmill' reads missing beside 'Sawmill (commercial)' (12 towns print "no sawmill ... finishes it"). The one-line change: `!institutions.some(i => i.name === name || String(i.name).startsWith(name + ' ('))`.
- Carried from HANDBACK-11 section 9, unchanged.

## 4. WHAT IS LEFT, line by line

1. Item 2: the PDF's Architecture line (`src/pdf/sections/IdentityDailyLife.jsx:303`) through the web's reader; the reader's A04.
2. Item 3: the arrival's forge line (`src/data/arrivalProse.js:65`), the cure of HANDBACK-11 section 5 item 1.
3. Item 4: the message to the chair, then the count.
4. Item 5: A06; the two guild lines.
5. Item 6: the ranked table (HANDBACK-11 section 4), widest first, with the chair's 10:40 row (the charter hall) and the rows other lanes named (street kitchens; the arrival's carts under a siege; the great fire in a thorp; the pool guard's two rows).
