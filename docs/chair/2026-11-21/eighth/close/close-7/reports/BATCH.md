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
