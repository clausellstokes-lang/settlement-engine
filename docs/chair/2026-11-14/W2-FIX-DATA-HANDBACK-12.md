# W2-FIX-DATA-12: the data lane goes on curing (kept current after every item)

**State: WORKING.** Items 1, 2, 3 DONE; the chair's 10:57 HIGH rows DONE; item 4 (the message) SENT (all pushed). Every figure EXECUTED unless marked PLAUSIBLE.

**Seat.** The twelfth seat on `lane/w2-fix-data-2026-11-13`, from `994733bcd` (read back from origin first: the brief's tip, no stop). Chair: `session_01ACmDYZrFEVXyZEUg1NDxxC`. Brief: `origin/lane/chair-2026-11-08:docs/chair/2026-11-14/briefs/BRIEF-W2-FIX-DATA-12.md`. Nothing at or below 994733bcd is rewritten.

## 0. Instruments (re-made in minutes)

- Scratch worktree `/home/user/wt12` on local branch `w12` at the lane's tip, `npm ci` there (it wrote `core.hooksPath=.husky/_` and the branch's tracking keys into the shared config: nothing else).
- Pushes: `git push origin w12:refs/heads/lane/w2-fix-data-2026-11-13`, each after `git fetch` and `test -n "$(git rev-list origin/lane/w2-fix-data-2026-11-13..w12)"`.
- Births: the scratchpad's `q/births.mjs` = CENSUS-2's `births.mjs` verbatim, `q/seedcfg.mjs` = CENSUS-2's `seedcfg.mjs` plus the bar's `bar0-` branch (`render.bar0.jsx :: cfgFor` verbatim); seeds = CENSUS-2's 720 + `seeds.bar0.txt` (730; 0 errors, about 75 s). Queries over the gzipped ndjson: `fdiff.mjs` (field diff by family), `pp.mjs` (buildPrintProse lines), `surfaces.mjs` (record, PDF view model, journal), `gap.mjs` (the page's `resourceGapLines`), `read116.mjs`.
- Holders by content: `holders.sh <file>` = `git diff --stat origin/lane/integration-2026-11-07 origin/<lane> -- <file>` over the 57 lanes dated 2026-11-12 to 2026-11-14.

## 1. The rulings this seat works to

The brief (BRIEF-W2-FIX-DATA-12); the chair's 10:40 message: ONE ROW MORE for the ranked table, `src/data/institutionDescVariants.js`, the adventurers' charter hall's "...with no garrison to call on it musters the defence..." (4 births whose Beasts & Monsters band reads Critical, 2 Weak; measured on origin/lane/coherence-upkeep-2026-11-12 UPKEEP-HANDBACK.md "P5"). RULED: a house's description claims no verdict a band on its own page can deny; reworded to what the hall is and does (it takes contracts against what comes out of the wild), no claim that the defence is mustered or holds. MEDIUM, placed by its count after the two HIGH rows and the forge line; read where it prints, an occupied town among the three.
 The chair's 10:57 message: SIX ROWS MORE in `src/data/arrivalProse.js` and `src/data/cultureProfiles.js` (REVIEW-R2-CODE-A-LINES-READ.md "CARRIED", "Neighbouring sentences of other writers", 3,048 births): THREE HIGH straight after the two HIGH rows (the waterfront line with no water; the wine shop in a thorp; the lanes of trades in a thorp: A LINE WRITTEN FOR A TOWN'S SIZE IS NOT PRINTED IN A THORP, and a house it names stands on the roster); THREE MEDIUM under a siege (the seasoning planks, the travellers offered water, the lanes of stalls: UNDER A SIEGE NO LINE HAS CARTS WAITING ON THE ROAD, TRAVELLERS ARRIVING OR A MARKET TRADING), joining the arrival's siege carts in the table.

## 2. The rows

### Item 1 · #116, the commercial sawmill's tag (HIGH): CURED at the record, `fe2e15e34` (lighting census `1ed8e6de6`)

- Table: `src/data/institutionalCatalog.js`, 'Sawmill (commercial)' shared tags `['trade']` -> `['trade', 'timber']` (TAG.TIMBER, what the timber and mountain-timber chains' `processingTags` read in `resourceGenerator.js :: institutionSupportsChain`; the village 'Sawmill' matched only by its exact name). Holders: no other lane's copy touches the row (the upkeep lanes add other rows); the chair ruled the row this lane's.
- Counts on the 730 (994733bcd -> fe2e15e34): towns holding a commercial sawmill with timber filed unexploited 47 (town 8, city 20, metropolis 19) -> 0; the journal's `| Timber | unexploited |` 47 -> 0; the PDF's `resourceExploitation.unexploited` timber 47 -> 0; the Resources card "Needs: Sawmill, Carpenters' guild" (the unexploited card) 47 -> 0; the unworked-timber pool lines ("leaves its timber unworked", "nobody has found it worth the trouble") 40 -> 0.
- DECLARED MOVE (field diff by family, towns): 247 moved: `.institutions[].tags[]` 247 (every commercial sawmill and the village 'Sawmill' inheriting the shared tags, whose supporter count does not move); `.resourceAnalysis.exploitation` unexploited -> partial 47, mountain timber partial -> full 7; `.exports[]` 47; `.gaps[]` impact/severity 47, chain/missing 10, institution/kind 7; `.priorityNotes[]` 23 (+13 "Weak economic focus leaves several resource chains underdeveloped...", -9 "...untapped timber..."); `.simulationTrace[].downstreamEffects[]` 7 (villages: tag.timber reinforced). Nothing else.
- EXPOSED, NOT CURED HERE (declared): (a) the partial pool now speaks in those towns: "{S} works part of the line that timber could support: ... before it has been made into anything worth more." 13 and "timber leaves {S} half-finished, and nobody in the city is troubled by it." 8 (the bar's #116 sentence itself; bar0-city-wartime-rand-1 Naranjotzin prints it now): `src/data/dossierStateProse/economy.generated.js`, the W2-WRITE lane's #116 (BRIEF-W2-WRITE-10 item 1). (b) the page's gap line "Work on the timber here stops half-way: no sawmill or carpenters' guild finishes it." 12 (before: that line 3 + "No one here works the timber near {S}." 10): FOR THE JOIN, below.
- Read: r2r-town-1 Karakabad (town), r2s-under_siege-city-3 Weichhof (city, siege), r2r-metropolis-5 Filopambelos (metropolis): PDF partial, journal partial, card `timber -> lumber -> planks`. No line written.
- Guard: `tests/data/w2FixData12Rows.test.js` #116 (the three; r2r-town-12, no timber house, keeps timber unexploited): red 3 of 3 with the tag planted out, green after.
- Doors: presumed-things `--check` fresh 49 stale 0 (carried); walker 42 passed / 1 failed (ARM 1, the carried 49); grid 0 rises; domain-strict, type ratchet, eslint: exit 0.

### Item 2 · the PDF's Architecture line (HIGH, carried; the reader's C02 C05 C08 C15): CURED, `184c68ba0` (lighting census `c530590f2`)

- Writer: `src/pdf/sections/IdentityDailyLife.jsx` printed `culturalIdentity.architecturalDetail` raw (chosen at resolveConfig, where only the tier is known). The web's one leaf is the arrival's sight beat (`arrivalScene.js`, W2-FIX-DATA-4 item 4): the detail's row held to its own declaration against the whole record, refused -> left out. ONE HOME: that reading moved unchanged to `src/data/cultureProfiles.js :: architecturalDetailRefused(detail, profileKey, facts)`; the arrival and the PDF both call it. Holders: IdentityDailyLife.jsx none; arrivalScene.js and cultureProfiles.js: every differing copy equals this lane's.
- Counts on the 730, the PDF's text (function components called) against the record: Architecture rows false 75 -> 0 (thorp 9, hamlet 15, village 26, town 7, city 9, metropolis 9); printed 730 -> 655, the 75 silenced exactly the 75 refused. The reader's towns r2r-village-12, r2r-city-0, r2r-city-26, r2r-metropolis-41: no row. The tabs print the detail only in the arrival (byte-identical: births 0 moved); the Foundry journal has no Architecture row. Not counted: the reader's `rv3-` towns (no configuration for them in CENSUS-2's seedcfg).
- No line written; no draw moved; no record key.
- Read (PDF chapter): r2r-village-12 (village, no market), r2r-city-0 (city) and r2r-metropolis-41 (metropolis, no palisade, no river), r2s-occupied-thorp-3 (thorp, occupation, not navigable): no row; r2r-village-25 (a market): "arcaded market fronts define the principal square".
- Guard: the second test of `tests/data/w2FixData12Rows.test.js`, red 3 of 3 with the raw print planted back, green after.
- Suites: the 66 files naming cultureProfiles, IdentityDailyLife or arrivalScene + the presumed-things walker: 11 failures, the same 11 at b7eaa6af1. Doors: presumed-things fresh 49 / stale 0; fact layers 0 rises; observed shapes red at the base too (six generated inputs: the merge seat's refreeze); grid 0; domain-strict, type ratchet, eslint 0.
- The reader's A04 (a forge line beside an idle smelter) is the forge pool's line 4: cured with item 3.

### The chair's 10:57 HIGH rows: DONE, `9b5acaa47` (lighting census `019517709`)

- **The wine shop** ("A patron stands drinks at a wine shop, and makes sure everyone knows who is paying.", arrivalProse.js, the greek people pool): CURED by declaration `needs ['institution: tavern', 'tier: ≥ village']` (JUDGMENT, vetoable: village, not town, since a village's tavern makes it true; no village with a tavern drew it on these births). False (no tavern) 9 -> 0 (thorp 1, hamlet 6, village 2); true 14 -> 14. DECLARED MOVE: `.arrivalScene` in exactly the 9 (the beat's redraw: "A notice of the next assembly is chalked on a wall ..." 5, "Two citizens argue a point of law loudly enough for a crowd to gather." 2, none 1). Read: r2r-town-2 (town), r2s-occupied-metropolis-0 (occupation), bar0-city-under_siege+famine-rand-1 (siege, famine): printed with a tavern; r2r-thorp-27, r2s-recently_betrayed-hamlet-1, r2r-village-55: none. Guard: the third test, red 3 of 3. Suites naming arrivalProse: 114 passed, 5 skipped.
- **The waterfront line**: ALREADY TRUE ON THIS LANE: the arrival holds the detail to its row's declaration (80b1672f0; the reporting lane's tree lacks it); r2r-hamlet-20 prints none; r2r-village-10 and -14 print it, navigable; the PDF's copy cured by item 2.
- **The lanes of trades**: ALREADY TRUE: `tier: ≥ town` on this lane (W2-FIX-DATA-HISTORY item F); 15 towns print it, all town or larger.
- A NOTE FOR THE NEXT READER (not cured, not this row): the redraw puts "Two citizens argue a point of law loudly enough for a crowd to gather." in two hamlets (r2s-politically_fractured-hamlet-3, r2s-insurgency-hamlet-0): a crowd in a hamlet, LOW at most (PLAUSIBLE).

### Item 3 · the arrival's forge lines (the stage's own MEDIUM; the reader's A04): CURED, `61c1ee0ba` (lighting census `b47df7eb5`)

- Writer: `src/data/arrivalProse.js`, the smiths' `dominant` pool (chosen wherever a metal word is anywhere in the exports or the income). Lines 1 and 4 claimed the town lives by its forges: false 16 of 16 and 7 of 7 (metal 3rd to 12th, 3 to 12%). REWORDED (the owner's veto list): "The hammering of the forges echoes through all of {n}." and "The clang of iron from the smithies carries down the lanes of {n}." All four siblings now need `institution: smith` (two towns with a Smelter alone drew the pool).
- Counts on the 730: "lives by its forges" 23 -> 0; the pool where no smith stands 2 -> 0. DECLARED MOVE: `.arrivalScene` in 24 towns (16 + 6 reworded in place, 2 silenced: no clean line in the pool).
- Read (the Summary's arrival; the PDF view model holds the same record string; the journal prints no arrival): line 1 r2r-town-7 (town), r2s-under_siege-town-0 (siege), r2s-infiltrated-metropolis-3 (metropolis); line 4 r2r-town-47 (town), r2s-succession_void-metropolis-2, r2r-metropolis-14 (emergent siege); silenced r2r-town-26, r2s-mass_migration-town-0.
- Guard: the fourth test (two arms, each red by its own plant); `tests/data/w2FixDataArrival.test.js` c22's synthetic towns stand a smith now (the siege alone decides; what it proves unchanged). Doors: three stale `smith` rows out by `--shrink` (banked 4661 -> 4658); fresh 49 carried; grid 0; domain-strict, type ratchet, eslint 0.
- NOT CURED (a candidate, MEDIUM at most, PLAUSIBLE): line 2 "Forge smoke hangs over everything here, and the ring of the anvils never quite stops." (18 towns) overstates a trade of 3 to 10%.

## 3. FOR THE JOIN

- `src/generators/resourceGenerator.js :: evaluateInstitutionChain` (held by many lanes): a partial chain's `missing` list is by exact name, so 'Sawmill' reads missing beside 'Sawmill (commercial)' (12 towns print "no sawmill ... finishes it"). The one-line change: `!institutions.some(i => i.name === name || String(i.name).startsWith(name + ' ('))`.
- Carried from HANDBACK-11 section 9, unchanged.

## 4. WHAT IS LEFT, line by line

1. The chair's 10:57 MEDIUM rows, measured on this lane: the seasoning planks (`arrivalProse.js:214`) and the travellers offered water (`:314`) ALREADY carry `excludes: ['crisis: under_siege']` here; the lanes of stalls (`:346`, needs market only) does not: to declare off a siege, with the arrival's siege carts of the ranked table.
2. Item 5: A06; the two guild lines.
3. Item 6: the ranked table (HANDBACK-11 section 4), widest first, with the chair's 10:40 row (the charter hall) and the rows other lanes named (street kitchens; the arrival's carts under a siege; the great fire in a thorp; the pool guard's two rows).
