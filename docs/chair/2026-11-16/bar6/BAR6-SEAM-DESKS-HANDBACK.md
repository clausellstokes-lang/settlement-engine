# BAR6-SEAM-DESKS · HAND-BACK · the people's, the defence's, the houses' and the crime's leftovers, and the class table

The seat SEAM-DESKS of `docs/chair/2026-11-14/briefs/BRIEF-BAR6-SEAM.md` (chair's lane), 2026-11-17. BASE: the joined line
`lane/join-2026-11-14` at `cfc2b680a` (the tip the prompt named; no later tip). BRANCH: `lane/bar6-seam-desks-2026-11-17`.
Every figure below was read by me, base and tip, in scratch worktrees; every run went to a file through
`sh scripts/gate-tail.sh`. EVERY CHANGED LINE IS VETOABLE BY THE OWNER.

## THE ITEMS

| # | item | state | before → after (runner) | guard |
|---|------|-------|-------------------------|-------|
| 1 | `paid watch` beside `force: paid` | **PART DONE, PART LEFT** | the atom read true where no watch stands; now it needs a watch on the live roster that is not the unpaid rota. Towns where the padded-roster secret prints with no watch: 0 of the 150, 0 of the 720 at base (a guard against a possible case, not a counted instance). THE MOVE TO `force: paid` AND THE ATOM'S REMOVAL ARE LEFT: the secret's one declaration stands in `src/data/people/titleSecretsPresentations.js` and the atom is asserted by `tests/domain/bar6PeopleLaw10.test.js`, neither on my list (S3) | `bar6SeamDesks` item 1 |
| 2 | DS-ECO-8 MODERATE v3 on the guard's pay | **LEFT** | prints beside "chronically underfunded" in 0 of the 150 (the economy seat read 0 of the 720 and 0 of the 300) | — |
| 3 | the defence desk's two twins: "the town" | **DONE** | DS-DEF-2 "carry it through a year cut off"; DS-DEF-12 "what the place cannot grow or make"; `food: ≥ pressured · food surplus` is met in 30 of the 150 (bar0-hamlet-calm-rand-27, -28, -29) | `bar6SeamDesks` item 3 |
| 4 | the brewery's siege twins name "the taverns" | **DECLARED; THE DOOR'S FOUR ROWS LEFT** | each line that names the taverns needs `institution: tavern` (read on the roster at the late re-read); of the houses that print these lines, 0 of 15 (the 150) and 0 of 90 (the 720) stand without a tavern. The presumed-things door still reads the four as fresh: its thing `house: tavern` has no atom (`registeredWords.js`: "its atom waits for a factsOf getter"), so no declaration can answer it | `bar6SeamDesks` item 4 |
| 5 | CRIME's two fresh lines in `safetyProfile.js` | **DONE** | the build guard's door no longer reads either (fresh 4 → 1, the 1 SEAM-CULTURE's) | `bar6SeamDesks` item 5 (the rule planted) |
| 6 | the class table | **DONE (legacy ruin by name)** | `court sits` → office, law; `seat held` → office; `seat members` → office; `paid watch` → office, law. `legacy ruin` joins NO class (below). The door reads `fresh 1` at my tip, the one line SEAM-CULTURE cures; `fresh 0` without it | `bar6SeamDesks` item 6 |
| 7 | the power desk | **DONE** | the council twin says "nobody there"; the merchant guilds' sentence prints only beside a power named Merchant Guilds (CONFIRMED, a guard case; nothing for the close); the travellers' line is declared `no crisis: threat`, with a twin for the threat family | `bar6SeamDesks` item 7 |
| 8 | the temperament of manner | **DONE** | runF's 10e-temper-manner: **5 → 0** over the 150; **14 → 0** over the 720 | `bar6SeamDesks` item 8 |

RUNNERS (S6): runE's LAW 9 over the 150: 0 counted → 0 (apart 11 → 11); over the 720: 0 → 0 (apart 29 → 29).
runF's LAW 10 over the 150: 44 instances → 39 (10e-temper-manner 5 → 0; 10f-backs-wide 37 and 10g-legacy-answer 2 unchanged, not
mine); over the 720: 213 → 199 (the 14 of 10e-temper-manner and no other). THE TWO DOORS, last lines (S7):
- `presumption-classes-door --check`: base `hits 1805 · banked 1938 · fresh 4 · stale 137 · ceiling 1938` → tip
  `hits 1802 · banked 1938 · fresh 1 · stale 137 · ceiling 1938` (the fresh one: `src/data/cultureProfiles.js` (resource), "Maize
  and other grain …", SEAM-CULTURE's item 5). The stale rows are the same 137 at base and tip.
- `presumed-things-door --check`: base `fresh 39 · stale 72 · first-register stale 6 · banked 4688 · strips fresh 0 stale 0 banked
  107` → tip the same, the same 39 rows (MY CURES ADD NO FRESH LINE; the four tavern rows stay, item 4).

## HOW EACH WAS DECIDED

1. `paid watch` = "not the unpaid rota" was true on an empty roster, so the watch sergeant's padded roster had nothing to stand
   on but the atom's default. The brief's first course (declare on `force: paid`, remove the atom) edits a file not on my list
   and makes a test not on my list untrue; its second course ("if something else needs it, make it require a watch and say what
   needed it") is the one in my files: `guardPay.js :: paidWatchOf` now reads a watch on the live roster that is not the rota
   alone. WHAT NEEDS IT: the secret's declaration in `titleSecretsPresentations.js` ("Keeps the night roster short and draws pay
   for names that never walk it", the watch sergeant's) and its positive control in `bar6PeopleLaw10.test.js`. A garrison with
   no watch now refuses the line (the atom asks for a watch; `force: paid` would admit a garrison): the stricter reading.
2. DS-ECO-8 MODERATE v3 ("The town pays its own way and has a little in hand.") was left by the economy seat to be declared on
   "the guard's pay". Neither atom on the line reads pay: `force: paid` and `paid watch` say a paid force STANDS, not that it is
   paid in full; the funded gate (`guardPay.js :: guardPayOf` 'short', `defenseProfile.economicGates.military`) has no atom, and
   S4 gives me none to make. Declaring the line on `force: paid` would refuse it in every town with a garrison for no fact of
   its own. LEFT: an atom over `guardPayOf` (say `pay: full|short`, beneath `force`) is the cure; it is new vocabulary.
3. The two twins are reworded to a noun every tier bears. THE READER SHOULD KNOW: the annex kernel already speaks "the town" as
   the tier's own noun at print (the 150 printed "carry the metropolis through", "nobody in the hamlet can make it take them",
   "what the thorp cannot grow"), so the three rewordings of items 3 and 7 changed words, not truth: no false line was printed.
4. Declared with the maltster's form. A third twin naming no tavern was written and taken back in the next commit: the late
   re-read (`drawDeclared.js :: drawDeclared`) tries a refused original's FIRST twin only, so a second twin never prints. A
   commercial brewery with no tavern would keep its original, noted 'kept' for the birth self-check (none in the populations).
5. "${tiny ? 'The place …' : 'The streets are unusually quiet.'}": the gate was the size's own, but written inside the template
   where the walker's rule `tierKey` (a tier test within 300 characters before the literal) cannot see it. The line is now
   `const quietOpening = TINY_PLACES.includes(tier) ? … : 'The streets are unusually quiet.';` and the sentence reads it: the same
   text in every town. THE RULE, PLANTED: a size word after a tier test is no hit; the same line after a bare condition is
   `size:none`. (A merge of `visibleAuthority`'s ternary onto one line, tried to keep the file under its line cap, made the
   scanner read 'The garrison is visible everywhere.' as an object key and stop seeing it: an accidental narrowing, caught by
   its stale row and taken back before any commit.) "Suppliers adulterating grain and leather …" presumed a leather trade that
   nothing at the draw can answer (the safety profile's facts are the roster alone, and `trade at work` has no leather key on my
   line: SEAM-SCENES makes it this seam); it now reads "Suppliers adulterating the grain and provisions sold to the army's
   contracts." (no class word: no presumption left to declare).
6. `legacy ruin` (a ruin a line builds on) answers no class of the lexicon: "Much of what stands now was built after the fire"
   classes to nothing, and joining a class it does not answer would credit that class's lines with a fact they do not presume
   (a narrowed guard). Its class is the lexicon's to make, in the walker's own form: LEFT for the close. The four atoms that
   joined are held by their vocabulary entries, so none is named in `NAMED_ATOMS` (the walker test pins that list; the CD1 arm
   stays green).
7. The council twin: "nobody there". The travellers' line was `no crisis: under_siege`; declared `no crisis: threat` (the
   family the class asks), with a new v4 `[street · garrison · crisis: threat]` "Soldiers are posted all over {settlement} and
   nobody else is about. Nobody will talk about the {seat}, and nobody will say where the missing went." (the pool under a
   threat crisis with a garrison draws two lines as it did under a war at base; it was one under a siege). Regenerated (AX1).
8. "candid" and "forthright" join `SECRETS_DENIED_BY_TEMPERAMENT` with the deceit words of "honest" (the table's own form, one
   pattern a temperament); a secret of money or one the holder only knows of moves nothing.

## THE NEW OR CHANGED LINES A READER CAN SEE (from the tip's 150)

- "Suppliers adulterating the grain and provisions sold to the army's contracts. …" (15 of the 150): bar0-city-wartime-rand-27,
  bar0-city-wartime-rand-28, bar0-city-wartime-rand-29.
- "… has left obvious decisions untaken, and nobody there can make it take them." (6): bar0-hamlet-calm-rand-31,
  bar0-hamlet-calm-rand-38, bar0-hamlet-under_siege-rand-27.
- "… its stores would still carry it through a year cut off." (4): bar0-metropolis-calm-rand-27, -32, -35.
- "… and what the place cannot grow or make it mostly goes without." (1): bar0-thorp-calm-rand-40.
- Temperaments that yield to a deceit (5): bar0-city-under_siege+famine-rand-39 and bar0-city-wartime-rand-29 (forthright →
  prudent), bar0-hamlet-calm-rand-28 and bar0-village-calm-rand-31 (forthright → prudent), bar0-metropolis-calm-rand-39 (candid
  → gracious).
- The travellers' line under a threat crisis and its twin print in none of the 150 (the heavy state-crime flag is rare); the
  tavern lines print unchanged.
EVERY CHANGED LINE OF THE 150: 29 towns' dumps differ, and every differing line is one of the above (no other line moved).
OVER THE 720: 90 towns' dumps differ, every differing line one of the above kinds but one: on r2s-mass_migration-metropolis-1's
card whose temperament yields (forthright → prudent) the goal drawn after it moves too ("Wants Finish the work they have been
given …" → "Wants Stay out of every quarrel …", and the next card's in turn): the draw's knock-on of item 8, on that card.

## DECLARED MOVES (B5) AND THE 525

`npcs[].personality.dominant` (item 8, at the draw); `economicState.safetyProfile.crimeTypes` (item 5's war-profiteering text,
at the draw). **THE 525 REFERENCE CONFIGURATIONS: 0 of 525 move against `cfc2b680a`** (every field family hashed at base and at
tip, born as the golden master births them); the audit's `ref525-F.mjs` finds no LAW 10 pair in the 525 at base, which agrees.
No new field on the saved record; nothing in `assembleSettlement.js`, `vite.config.js` or `package.json`.

## THE BOOKS MY CURES MOVE (named, not re-taken)

- The wiring census `docs/content/wiring-census.json` and `src/data/proseNorms.generated.js` (its pool count 859 → 861): re-taken
  in scratch to let the annex generator run (AX1), NOT committed. I committed only `defense.generated.js` and `power.generated.js`.
- Red at base and at my tip, the same 23 arms of the annex's and the walkers' tests (`dossierStateProseProjection.contract`,
  `wiringCensusDeclared`, `census2eTables`, `houseDescLateReRead`, `proseCorpusBytes`, `proseWaveGate`, `presumedThings.walker`,
  `presumptionClasses.walker`'s register arms: fresh 4 → 1 and stale 137 at both): the close's.
- `tests/domain/bar6ScenesGoods.test.js`'s goods arm: red at base and at tip with the same message (SEAM-SCENES's item 4).

## THE NET (each alone, to a file, at the tip)

`typecheck:domain:strict` 1113 (ceiling 1113) · `typecheck:ratchet` 167 (ceiling 167) · `eslint` on my changed sources: green ·
`npx vitest run tests/architecture`: 347 passed · ONE `npm run build` (green), then `tests/build/vendorPdfLazy.test.js`
`tests/build/bootSmoke.test.js`: 49 passed, 17 skipped · my guard `tests/domain/bar6SeamDesks.test.js`: 28 passed · the two
rounds' guards (`bar5*`, `bar6*` of tests/domain and tests/generators): 155 passed, 1 failed (the `bar6ScenesGoods` arm above,
red at base) · the two doors: above.

## WHAT IS LEFT, IN ORDER

1. ITEM 1's move: the secret's declaration to `force: paid` in `src/data/people/titleSecretsPresentations.js`, then the atom
   `paid watch` removed (its entry and layer row, `factsOf`'s getter, `paidWatchOf`), with `bar6PeopleLaw10.test.js`'s C200774
   control re-keyed to `force: paid` by identity and the class table's two `paid watch` words taken out. Until then the two atoms
   agree on every roster with a watch and differ only where a garrison or a hired company stands alone.
2. ITEM 2: an atom over the funded gate (`guardPayOf`), new vocabulary, then DS-ECO-8 MODERATE v3 declared on it.
3. ITEM 4's door rows: `house: tavern` needs its atom (`registeredWords.js`, a `factsOf` getter over the roster's taverns, as
   `institution: tavern` reads); the four fresh rows then leave by the declarations already written, or the close banks them.
4. ITEM 6: `legacy ruin`'s class, if the lexicon grows a class for a ruin built upon.
5. SEEN IN PASSING: in four brewer villages of the 720 with no tavern (r2r-village-16, r2s-wartime-village-1 …), the brewer's
   card prints "hears everything the taverns say" and a secret that "charges the taverns": the people's title lines.
