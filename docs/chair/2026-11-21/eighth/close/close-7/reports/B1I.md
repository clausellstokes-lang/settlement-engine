# B1I: B1(i)'s build (CLOSE-7 chain two, phase 2; RULING-R24 R24-B1(i) as ruled in R24b). The desert alone.

Worktree `/home/user/wt/b1i`, branch `lane/close-7-2026-11-24-b1i-wip`, cut at d447ee31e. **Commits: `c6c244964`** (the cure, its
test, its battery row) **and `9d0f85e01`** (the lighting census re-taken by its own door). Not pushed. The lit tree is untouched
(clean). Where R24b and CHAIN-2.md differ, R24b governs: the desert alone, the seven rows, the givers, one function, and
`getResourceMultiplier` left as it is.

## What was built (the form R24b rules)
- **Declared as data, read by one function.** `TERRAIN_DATA.desert.withholds = ['fish', 'timber', 'game']`
  (`src/data/geographyData.js`). A registry-only mark `livesOn` on the seven families (`src/data/institutionalCatalog.js`: Fish market
  and Fishmonger → fish; Sawmill / Sawmill (commercial), Charcoal burner, Woodcutter's camp → timber; Hunter's lodge → game). The mark
  is never on a row or a save; it is read through `livesOnOf`, and a custom or DM house lives on nothing. `LAND_GIVERS`
  (`geographyData.js`): fish from a port or river route, fishing_grounds or river_fish; timber from managed_forest,
  shipbuilding_timber or mountain_timber; game from hunting_grounds. An oasis gives no fish.
  **`src/domain/landWithholding.js :: landWithholdsHouse(land, house)`** is the one reader.
- **The draw.** `assembleInstitutions`: the roll is made exactly as today (the same `drawRng.chance(baseChance × resourceMult)`). A
  house the land withholds is then not taken. A withheld group winner is likewise not seated, though none of the seven has a group.
  `getResourceMultiplier` is not touched.
- **The cascade** (`cascadeGenerator.js`; `cascadePass.js` passes it the native nearby resources) **and the faction boost**
  (`factionCorrelation.js`) ask the same function AFTER their own draw. A withheld house still fills its slot under the pass's cap and
  is marked as rolled, so every later candidate of that pass meets the same draw it met before.
- **The battery's pattern** `B1land` (`pageCensusFindings.js`): a house the land withholds, printed on the page, in a desert with
  nothing that gives its thing. Bar zero. It has a plant and three controls (fishing grounds, a river route, the hills) in
  `tests/domain/coherence/pageCensusFindings.test.js`. **Enrolment.** I added the row to `PAGE_CENSUS_ROWS` and its plant, which is
  the battery's own door. I did NOT hand-edit `scripts/census/page-census.register.json`. Its door (`page-census.mjs --shrink`)
  only lowers counts, and the header says a new row needs `base` (its count at deb1544eb), which I did not measure. A register row
  for B1land is CLOSE-7's or the chair's to enter. It reads 0 on C and V at the tip, so the page census will not report "(no row)"
  for it.
- No catalogue gate, no new draw, no new pool, no new atom in `factVocabulary.js`.

## Proof
**RED FIRST (CONFIRMED).** `tests/generators/desertWithholdsHouses.test.js` was run against the lit tree (through a symlinked harness;
the lit tree was not written). The five named desert births red BY ASSERTION:
- dp-town-39: Fish market, Hunter's lodge
- dp-city-20: Fish market, Sawmill (commercial)
- dp-village-67: Fish market, from the cascade
- dp-town-118: Fish market, Hunter's lodge
- dp-hamlet-136: Hunter's lodge

The three tests of the function red because the module is missing. The positive control dp-village-129, a desert with
`hunting_grounds`, keeps its Hunter's lodge on both trees. All tests are green on b1i.

**C and V, record and page hashes per birth** (`read25/page-battery.mjs`, lit against b1i; the baseline is READ-25's run):

| corpus | record moved | page moved | battery rows moved | B1land before → after |
|---|---|---|---|---|
| C 900 | **0** | **0** | 0 | (no row) → **0** |
| V 900 | **27** | 27 | 0 | (no row) → **0** |

The 27 V places that move are **exactly** the 27 desert places that held a withheld house with nothing to give its thing (READ-25's
table, recomputed: set difference 0). Every other place is byte-identical, the 25 other desert places among them. Every other battery
row's count by size is equal. **Re-run at the committed tip 9d0f85e01** (after a line-only re-layout of `assembleInstitutions.js`
for the prose numerics ratchet): C record 0, page 0, rows 0; V record 27, page 27, rows 0, the same 27 seeds (CONFIRMED;
`close-7/b1i/{C,V}-diff-at-tip.txt`, `{C,V}-table-at-tip.txt`).

**THE DRAW IS UNMOVED (CONFIRMED by the record's own trace, `read25/twin-diff.census.jsx` over the 27).** The `assembleInstitutions`
step selected exactly the same houses on both trees, minus the withheld ones: Fish market 24, Sawmill (commercial) 15, Charcoal burner
12, Hunter's lodge 2 lost, and nothing gained.

**WHAT FOLLOWS (CONFIRMED by trace and leaf diff; `close-7/b1i/V-what-follows.tsv`):**
- **The cascade re-deals in 25 of the 27.** Its candidates are the chain neighbours of the houses present. A missing Fish market,
  Sawmill or Charcoal burner takes away their boosts (a cooper, a customs house, a fuller, …), so the cascade draws for other
  candidates. Its additions differ by about 1 to 9 houses a place. 1 Fish market and 1 Hunter's lodge of the cascade are themselves
  withheld (dp-village-67, dp-town-118). The post-cascade subsumption follows in 11 places (the Mages' district / Wizard's tower /
  Alchemist quarter ladder, Great library / Printing house, Almshouse / Foundling home), and the airship override's draw in 1
  (dp-metropolis-19 gains a Harbour master's office).
- The faction boost changes in 1 place (dp-town-147: Free company hall → Veteran's lodge). Coherence repair changes in 2 (a Bardic
  college repair no longer needed).
- Then everything that reads the roster: the lost houses' FACES (the master fishmonger, the sawyer, the collier, the master of the hunt)
  and the NPC list after them (`npcs[]` ids, names, goals, secrets, memberships), their ties (`relationships[]`), their SERVICES
  (`availableServices.food`, `.equipment`), the economic CHAINS and gaps (`economicState.activeChains`, `resourceAnalysis.gaps`),
  plot hooks, conflicts, the simulation trace, and the Daily Life and dossier LINES that read them. In the 4 places where only
  withheld houses left (dp-hamlet-136, dp-village-67, dp-city-17, dp-metropolis-98) the moved leaves are 247 to 1,443, all in those
  families.
- **If the chair wants the cascade NOT to re-deal**, the alternative is to let a withheld house's chain boosts stand in the cascade
  (a phantom source). That would add, for example, a cooper "pulled in by" a fish market that does not stand. I did not build it.

**THE GOLDEN CORPUS (read, not edited).** 24 of its 525 rows move, all desert (`close-7/b1i/golden-twin.txt`; the stored manifest is
already red on lit).

## Gates (all through the mutex, to logs, read by tail)
- `tests/copy` WHOLE: 15 files, 172 tests, **green**.
- `tests/lint` WHOLE (225 files): the known three red (`proseCorpusBytes` RAW and GZIP, `proseComposed` A0b). Four further reds were
  this unit's and are cured within it:
  - `mutationCoverageManifest`: the new test file got its entry, under the generators tree's subject-coupled rationale.
  - `proseNumerics`: my import shifted cited lines; the edits in `assembleInstitutions.js` were made line-neutral, the file's own
    idiom.
  - `proseWiringCensus` ×2: `docs/content/wiring-census.json` `producerIndexFiles` 1454 → 1455, the new src file. It was written by
    the census's own writer, `node scripts/wiring-census.mjs`. I ran that writer by mistake (I meant to read its `--help`), and it
    wrote exactly this one figure.
  - `sovereigntyLightingContract`: the file count, re-taken by its door at the clean tip c6c244964 (files 3786 → 3787, parked 488 → 489),
    then green plainly (34 passed). That is commit `9d0f85e01`.
- **Unit and named tests**: 148 files name a changed file or exported symbol (`geographyData`, `institutionalCatalog`,
  `landWithholding`, `assembleInstitutions`, `cascadeGenerator`, `cascadePass`, `factionCorrelation`, `pageCensusFindings`, and the
  symbols `TERRAIN_DATA`, `LAND_GIVERS`, `livesOnOf`, `landWithholdsHouse`, `applyCascadeInstitutions`,
  `applyFactionInstitutionBoosts`, `PAGE_CENSUS_ROWS`). Their count by grep is 168, of which 20 sit in copy or lint and ran there. In
  the 148 there are 17 reds:
  - **9 red on lit too** (pre-existing, the golden family): `generatorGoldenMaster`, `dmLayerGoldenIsolation` A7,
    `pipelinePinnedMode` A1/A2/A5, `pipelinePinnedChoosers` A1, `powerEconomyFreshness` A4, `worldFactRederive` A7,
    `generationForkCensus` A1.
  - **8 NEW, each on a DESERT birth the cure moves. STOPPED AND REPORTED (law 5), not repaired:** I did not re-anchor other lanes'
    tests. Each is the chair's to rule, or a later unit's.
    1. `tests/components/bar3ServicesRows.test.jsx` KEEP_FIELD row `['r2s-under_siege-town-1', 'hunter_s_lodge', SIEGE]`. This pins a
       Hunter's lodge in a DESERT town with no game: the very fault. The house is now withheld, so this row needs another anchor
       (CONFIRMED by twin: Fengling, desert, road, lost Fish market, Hunter's lodge, Coaching inn, Cobbler's guild).
    2. The same file, CURTAILED `['r2s-under_siege-town-1', 'Inn (multiple)', 'Meals and drink']`. The inn now reads "Stopped by the
       siege." on the PDF, and its meals row is not on offer. PLAUSIBLE: it follows from the lost food houses.
    3. `tests/components/crisisStoppedRows.test.jsx` S11 `['r2s-under_siege-town-1', 'services', 'Devotional figures, …']`. The row
       no longer prints: its house left in the cascade's re-deal (PLAUSIBLE).
    4. `tests/domain/bar4MarkPromise.test.js` (c) `['r2s-famine-city-1', 'Street food', 'Scarce in the famine.']`. Skaldhammer is a
       desert crossroads city. It lost Fish market, Toll bridge, Weavers, Chandler and Smuggling network, and Street food no longer
       prints (CONFIRMED by twin; which house offered it is PLAUSIBLE).
    5. `tests/generators/people/goals.test.js` I-13, keyed determinism. The sample's third town is Portaminus (soak4), a desert town
       that lost its Fish market. With the new card list, removing the middle card changes `npc_parish_churches_10_30`'s short goal,
       though its receipt reads nothing of that card. **This is a fault of `dealGoals`'s keying that the moved birth EXPOSES, not
       one the cure makes.** Not my unit's.
    6. `pipelinePinnedChoosers` A6, the uncloned control's write-through count 33 → 32.
    7. `powerEconomyFreshness` A3, stale at close-out 32 → 29.
    8. `powerEconomyFreshness` A6, refreshed away 29 → 26.

    Items 6 to 8 are measured counts over the golden corpus's subset. 24 golden rows move and all are desert, so the change is
    theirs by elimination (CONFIRMED that only desert rows move; which rows make each count is PLAUSIBLE). Re-stating the three
    figures is a one-number edit each, with the cause above. I left them for the ruling because they sit beside the golden that is
    already red.

## Listed, not cured (R24b)
The plains' and riverside's `Mill` rows match "Sawmill" by substring (plains ×2.34). The desert's `trade` ×1.8 boost still applies
to these rows. Also open: P9 (CLOSE-7's next unit after the five) and P5b on dp-town-143.

## Hand-back line
B1(i) c6c244964 (+ door 9d0f85e01): C 900 unmoved; V 27 desert places move, each by its withheld houses and what follows (the cascade
re-deals; faces, services, chains, ties, lines); B1land 0 on both; 8 new reds on desert anchors listed for the ruling.
