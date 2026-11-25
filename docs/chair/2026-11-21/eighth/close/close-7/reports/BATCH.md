# BATCH (CLOSE-7; CHAIR-0512 (4)): B1(i) finish, B1(ii), C1, P3source, goals I-13; one before-and-after. PARTIAL, written as it goes.

- Tree `/home/user/wt/batch`, branch `lane/close-7-2026-11-24-batch-wip`, cut at 0ec96f13d.
- READ: BATCH.md; RULING-R24 lines 45-79, 138-157, 182-197 and 214-245; B1I.md lines 8-133; C1-ANSWERS.md whole; P3SOURCE.md
  lines 40-70; CHAIN-1.md lines 39-44.

## Progress log
- **ITEM 1, THE MERGE: f82d9d671** merges B1(i) (9d0f85e01) in.
  - The conflicts were resolved as unions: `pageCensusFindings.js` and its test take A1, A2 and the mirror's rows beside
    B1land.
  - pageCensusFindings, desertWithholdsHouses and the page census walker: 28/28 green (CONFIRMED).
- **The doors:**
  - The wiring census: 251fe061d (`node scripts/wiring-census.mjs`; producerIndexFiles 1,458 → 1,459).
  - The lighting census: the commit after it (files 3,798 → 3,799, parked 494 → 495).
  - Both walkers plainly after: 113/113 green (CONFIRMED).
- **ITEM 1 (1a), THE TABLE (CONFIRMED by run; `batch/b1i-births.census.jsx`, the cut 0ec96f13d vs the batch tree after the
  merge; tables in `batch/b1i-table-{V,C}.md`):**
  - **V: 27 of 900 places move,** all desert. They gain 53 houses. Lost by name include Fish market 25, Sawmill (commercial)
    15, Charcoal burner 12, Hunter's lodge 3, and what the cascade re-deals (Customs house 5, Coaching inn 3, …).
  - **C: 0 of 900 move.**
- **(1b) THE TWO CHECKS over the 53 gained houses (CONFIRMED):**
  - **(1) A gained house the land withholds: 0.** No withheld house stands anywhere after, on V or C.
  - **(2) A gained cascade house naming a puller that does not stand: 0 phantom pullers.** The mechanical test (no chain
    neighbour standing) reads 1: dp-metropolis-93's Mages' district.
    - Its neighbours (Wizard's tower, Alchemist quarter, Scroll scribe) stood when the cascade drew it, and were then folded
      into it by `cascadePass.js`'s post-cascade subsumption (`subsumed_after_cascade`; the arcane ladder).
    - It is the same class the cut already holds: 25 cascade houses on V and 37 on C, with no B1(i) in play. No puller of it
      was withheld by the land.
- **ITEM 2, B1(ii): COMMITTED 3388806b4.** Built before item 1 (2) in time; it touches no file of item 1's.
  - **The order check:** `deriveFoundingTraditions` is no pipeline step. It reads the finished record (`shownTraditions.js`
    at view time, `traditionsKernel.js` at the first lit tick), so the imports are always written first. No STOP.
  - **The cure:** `genesis.js :: fieldsBoughtIn` is `grain imported` and not `institution: farmland`, through `atomHolds` over
    `factsOf`. `field` weighs 0 in `elementWeight`.
  - **Pattern B1furrow:** a plant and two controls.
  - **RED FIRST (CONFIRMED):** C dp-city-0 "The Great Fair" and V dp-metropolis-77 "The Common Furrow Fair". Both are green
    after.
  - **Gates:** the pattern file, the walker, the Traditions tabs and `traditionsDormancyGolden` are green.
- **ITEM 1 (2), THE EIGHT REDS: COMMITTED (the commit after 3388806b4).** Each re-anchor is the first non-desert birth of the
  same census family holding the case (`batch/reanchor-probe.census.jsx`):
  - `bar3ServicesRows` CURTAILED: town-1 → town-2. KEEP_FIELD: town-1 → town-4 (town-0's lodge adds "Short of game.").
  - `crisisStoppedRows` S11: town-1 → town-41. No east_asian town holds the row in about 380 probed; "Crucifixes" is in no
    src file.
  - `bar4MarkPromise` (c): famine-city-1 → city-2.
  - **The counts:** `pipelinePinnedChoosers` A6 33 → 32; `powerEconomyFreshness` A3 32 → 29 and A6 29 → 26.
  - The five files are green but for two goldens red at the cut. `goals` I-13 stays red (item 5).

## ITEM 3, C1: A STOP ON ONE READER (CONFIRMED by run and by read)
- **Built in the worktree, NOT committed:**
  - `rulingStructure.js` names the three forms at birth "Council of Aldermen", "Council of Syndics" and "Senate"
    (`HALL_NAME_AT_BIRTH`, at the END of the file). The three description rows are added by exact name.
  - `factionCategories.js :: inferFactionCategory` makes the three criminal BY EXACT NAME (`CRIMINAL_BY_NAME`, in the criminal
    bucket's own slot; 'Senate' as a word would take the Arcane and Merchant senates).
- **The proof's measure** (`batch/c1-births.census.jsx`, `batch/c1-compare.mjs`; V 900 born before and after; the birth names
  mapped back, with "Arcane / Merchant / Shadow / Grand Senate" excluded):
  - **Rename only:** 39 carriers (18 Corrupt Council, 14 Corrupt City Council, 7 Shadow Senate), 0 byte-equal, 0 other places
    moved. Cause: the category reader (criminal → government), which re-dealt imports, capture state and relationships.
  - **With the category by exact name:** 39 carriers, **0 byte-equal**, and 0 other places moved. What remains is conflicts
    (116 leaf diffs), then people, goals and ties after them (`batch/c1-cmp-2-category.txt`).
- **THE READER (CONFIRMED by read): `generators/power/conflicts.js` KEYS ITS DRAWS ON THE FACTION'S NAME TEXT.**
  - **The issue:** `drawDeclared(…, { key: \`${seed}::${factionA.name}>${factionB.name}::conflict-issue\` })`, line 228.
    `drawDeclared`'s resolution is an argmax of `hashKey(key::lineId)`.
  - **The plot hook:** `buildConflictPlotHooks`, `fnv1a32(\`${seed}::${A.name}>${B.name}::${issue}\`)`, line 39.
  - A different name draws a different issue and hook. The conflicts feed the people's goals and ties, and those move after
    them.
  - Byte-equality can be had only by keying these draws on the OLD form, an alias in the draw key. That is not "a name added to
    a vocabulary", so it is the chair's to rule.
  - Also keyed on a name, PLAUSIBLY in play: `relationshipArchetypes.js:273` (people's names, not the power's: no effect
    expected).
- Items 4 and 5 and the before-and-after are not started.

## ITEM 4, P3source: COMMITTED 4fc54fb45 (CONFIRMED by run)
- **The cure:** `dossierViewModel.js :: deriveMagicSupplyView` names a stopped sole supplier with the page's own stop:
  "Reliance on magic: Relied upon · for food (magical provision) · supplied by Access to a house of worship · Stopped by the
  siege." The helper `stoppedSupplyOf` sits at the file's foot, so no cited line moves.
- **A CHOICE FOR THE CHAIR TO REVERSE:** R24g (1)'s example quotes `magicSourceOf`'s raw name, "Access to parish church". The
  line prints it through the display seam, "Access to a house of worship", which is the label its own card prints, the seam
  REVIEW-W2A F2 rules, and the one P3source checks. Printing the raw name is a one-word change in `stoppedSupplyOf`.
- **The P3source pattern is not taught anything:** it reads a condition only as a bracket or a house named twice.
- **RED FIRST:** `bar8Marks2` (6), re-stated by its cause, was red on r2s-under_siege-thorp-1, -thorp-2 and -hamlet-2 and is
  green after.
- **Gate:** the 51 files naming `dossierViewModel`, `deriveMagicSupplyView` or `MagicTab`, plus `pageCensusFindings`: green.

## ITEM 5, goals I-13: MEASURE ONLY (CONFIRMED by run; `batch/goals-i13.census.jsx`, the I-13 test's own method on every birth)
- **C:** 900 births; 218 skipped (an uncanny goal landed). 3,531 cards compared; **136 faults in 122 places** (thorp 12,
  hamlet 30, village 35, town 35, city 4, metropolis 6).
- **V:** 900 births; 204 skipped. 3,366 cards compared; **172 faults in 148 places** (thorp 23, hamlet 44, village 52, town
  18, city 9, metropolis 2).
- A fault is a card whose receipt read nothing of the removed card, but whose goal changes when that card is removed. For
  example, C dp-thorp-12's shepherd collective changes when the war council's watch captain is removed. Rows are in
  `batch/gi-{C,V}.jsonl`. No cure; the chair rules it.

## ITEM 3, C1 under R24l: (c) STOPS (CONFIRMED by run and by read)
- **Built, and committed as HELD (the commit after 4fc54fb45):**
  - The alias `conflicts.js :: conflictDrawName` over the frozen `CONFLICT_DRAW_KEY_OF`, read by exactly the two hash keys.
    Its pin is `tests/generators/power/conflictDrawName.test.js`.
  - The birth names added by exact name to `mintTitles.js` ("the council's fixer"), `cultureOfficeTitles.js` (underboss),
    `factionArchetypes.js` ('Senate' → criminal on the string path) and `seatTable.js` (own forms of the criminal kind, never
    drawn).
- **(b) SENATE:** no clean form at any size is named a plain "Senate". It appears in src only as a keyword and in C1's own
  tables, and in 0 of the 900 C births. So it is aliased by string, like the two council names. No other producer makes the
  three names (grep).
- **(c) THE PROOF:**
  - C: 0 of 900 records move (with the alias).
  - V: the 861 non-carriers do not move, but **0 of 39 carriers are byte-equal** with the names mapped back.
- **THE READER, found by the pipeline's own `onStep` hook** (each step's patch hashed with the names mapped back): every step
  agrees but `assembleSettlement`. There the cast is the SAME people in a DIFFERENT ORDER:
  - `density/applyDensityLaw.js:502` orders the houses `(b.power - a.power) || (a.key < b.key …)`;
  - `density/densityRoll.js:199 orderedPowers` sorts the same way;
  - `key` is `domain/density/seatKey.js :: seatKey`, the power's display name.
  - A power tied with the bought hall now sorts the other side of it, the seats fill in another order, and the ties and the
    conflict pairs that read the cast follow (PLAUSIBLE for each carrier; the order-only cast is CONFIRMED on dp-city-32 and
    dp-town-7).
  - These are sorts, not the two hash keys R24l allows the alias. So byte-equality needs the alias widened to these
    tie-breaks, or the re-deal accepted. The chair's to rule.
