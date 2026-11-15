# TAIL-CLOSE-PRESUMED-1 — hand-back (the presumed-things walker at the close)

Seat: TAIL-CLOSE-PRESUMED-1 (a CLOSE seat; the one writer of the walker's two registers tonight).
Branch: `lane/tail-close-presumed-2026-11-15`, from the joined line `lane/join-2026-11-14` at `c090179c1`.
Law: the chair's ruling PT1 of 2026-11-15 (vetoable by the owner).

## FOR THE OWNER, IN PLAIN WORDS

> **CORRECTION (2026-11-15, at the join `e047ef2b6`).** My first measure had a bug. For a line of two sentences or more it found no sentence of the line in the town, so such a line could never read as false. I fixed the script, re-measured every row I had banked, and moved **17 rows from "true" to "false"** (commit "CORRECTION"). The counts below are the corrected ones. The first report's "89 true, 7 false" was wrong.

> **FINAL PASS (the chair, at `f76fe38fd`).** Merged and re-measured. The chair's last landing cured two of the false lines in code, at the call:
> - **the forges line (row 22)** now prints only where a smith stands. It re-measures TRUE (2 towns printed, 0 against), and its row moved to close-true. Its literal still declares nothing, so the row stays; it leaves when the line declares its smith.
> - **the landing town's market line (row 26)** is cured in the engine (`worldPulse/candidateEvents.js`, `heraldDeeds.js`), but the frozen landing fixture still carries the old line until the doors' seat re-emits it. Rows 25 and 26 re-measure FALSE in the fixture as it stands at `f76fe38fd`, and stay close-false.
> - **the practitioners' line (row 23)** is not cured tonight (the chair: its fix waits for the next round) and stays close-false.
>
> **THE LAST PASS (the chair's last word: the doors' final seat at `752d74a15`, merged).** The re-emitted landing fixture no longer carries the market line (row 26). Its row went stale and left by `--shrink`: **cured**. The new line, "its traders have little to sell", uses no registered word, so it is no row. The war line (row 25) re-measures FALSE against Cnocby and stays close-false; the mill line stays true (`remeasure-landing-at-752d74a15.json`).
>
> **Final counts: 75 true, 53 unprinted, 24 false (152 rows). The walker reads 43 of 43, and the door's `--check` exits 0.**

- At the joined line's tip (`c090179c1`) the walker was red in four of its 43 tests: 149 fresh source lines, 7 stale rows, 10 stale arm-2 rows, and 1 fresh strip. Later landings brought 4 more fresh lines (1 from TAIL-CLOSE-SRC-3, 3 from TAIL-CLOSE-DOORS-1's re-emitted landing fixture) and 2 more stale rows.
- **I measured every one of the 153 lines on 1,080 generated towns** (the walker's 360 and the page census's 720), plus the landing page's own fixture town. For each line I checked where it prints and whether the town lacks the thing it names, by the vocabulary's own readers. Then I banked each line under one of three new reasons:
  - **74 banked TRUE**: the line prints, and its thing is there in every town where it prints;
  - **53 banked UNPRINTED**: the line never printed;
  - **26 banked FALSE**: the line prints in towns that lack its thing. **These are the first rows of the next round**, listed below.
- The 9 stale rows and the 10 stale arm-2 rows left through the door's own shrink. The strip in `src/generators/foodGenerator.js` was banked by hand under the chair's ruling PT2. **The walker reads 43 of 43.**
- No line was reworded, no pool re-shaped, and no walker rule touched. The only files changed are the two registers, plus this hand-back and its probe scripts.

### The 26 false lines: false to a reader, or only to the instrument?

**Six are false as a reader would read them.** Two of them are on the LANDING PAGE.

| rows | as a reader would read it | why |
|---|---|---|
| **25, 26** (landing fixture) | **FALSE TO A READER, on the landing page** (26, the market, CURED by the doors' re-emit at `752d74a15`; 25, the war, stands) | the frozen landing town Cnocby (seed `lf-033`) has no market and is not at war by the vocabulary's readers, yet the page says "its market stalls stand half empty" and gives "Wartime pressure disrupts trade flows" as the reason on its trade chip. The fixture is re-emitted from the engine, so the cure is the engine's line, not the fixture |
| **23** practitioner (`claimStanding.js`) | **false to a reader** | "Magical practitioners are consulted but not formally empowered" printed as a power's description in 20 towns (of 245) where no one works magic |
| **22** smith (`narrativeText.js`) | **false to a reader — CURED at the FINAL PASS** (row now close-true) | "keeps the forges of {town} running day and night" in 1 town (presume-town-25) with no smithy and no smith among its people |
| **5, 9** alehouse | **false to a reader (mildly)** | a brewery "supplies alehouses and households" in 8 villages with no alehouse |
| 3, 4, 6, 19, 20 stone quarry | true as printed; **a question about the town** | the quarry house's own description, and the quarry stands. But the town's country has no stone among its resources (`config.nearbyResources`): the roster and the resources disagree, not the sentence |
| 2 occupation | only the instrument | a past occupation told as past ("When the occupiers left …"); the word's reader asks whether an occupation is in force NOW |
| 1 quarters | only the instrument | "the residential district" of a town-tier place in the small population band |
| 7, 8, 21 druid; 11 hired blade | only the instrument | each is the institution's own description (the Elder Grove Council, the Mercenary quarter), and that institution stands wherever the line prints; the house family's reader reads the name's stem and misses it |
| 10 famine | only the instrument | "Buffers harvests, prevents famine": the word is named to say it is prevented (79 of 80 towns) |
| 12–15 fishing | only the instrument | a boatbuilder makes "fishing boats" among its craft; the reader asks for a fishing house |
| 16–18 clergy | only the instrument | a thorp's burial plot where "a priest says the words when one can be brought in time": a priest from elsewhere, said so in the line |
| 24 smuggling | only the instrument (mostly) | "Underworld effectively controls vice, smuggling, and key officials" names smuggling as an activity; the reader asks for a smuggling house (6 towns of 13) |

### The 26 false lines, written out

| # | file | thing | the line | towns against / towns printed | three towns |
|---|---|---|---|---|---|
| 1 | `data/historyData.js` | quarters | "the residential district" | 1 / 32 | r2s-succession_void-town-3 |
| 2 | `data/historyData.js` | occupation | "When the occupiers left, they left behind a town of former collaborators and former resisters, none of it ever" | 36 / 36 | presume-town-3, presume-town-6, presume-town-30 |
| 3 | `data/institutionDescVariants.js` | resource: stone_quarry | "A stone quarry, its blocks cut and dressed by a gang of quarrymen with picks and wedges. Slow going, and the o" | 1 / 3 | r2s-indebted-hamlet-2 |
| 4 | `data/institutionDescVariants.js` | resource: stone_quarry | "A building-stone quarry laid out in an ordered working. A village sitting on good quarry ground can furnish ha" | 2 / 3 | r2r-village-45, r2s-insurgency-village-2 |
| 5 | `data/institutionDescVariants.js` | house: alehouse | "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies both alehouses and " | 1 / 1 | presume-village-10 |
| 6 | `data/institutionDescVariants.js` | resource: stone_quarry | "A stone quarry, with yards beside it for dressing the stone, worked whenever good stone can be had." | 42 / 65 | presume-town-34, presume-town-53, presume-town-57 |
| 7 | `data/institutionDescVariants.js` | house: druid | "Senior druids who govern how their circle deals with the town. They may keep a grove hidden beneath the street" | 5 / 5 | presume-town-4, presume-town-58, presume-town-92 |
| 8 | `data/institutionDescVariants.js` | house: druid | "A council of elder druids charged with their circle's standing in the town: sometimes tending a concealed grov" | 6 / 6 | presume-town-119, presume-town-120, presume-town-127 |
| 9 | `data/institutionDescVariants.js` | house: alehouse | "Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and ho" | 7 / 7 | presume-village-9, presume-village-13, presume-village-26 |
| 10 | `data/institutionDescVariants.js` | famine | "Communal grain storage. Buffers harvests, prevents famine." | 79 / 80 | presume-town-0, presume-town-1, presume-town-2 |
| 11 | `data/institutionDescVariants.js` | house: hired blade | "Organised bands of hired blades, a few score to a few hundred strong." | 23 / 38 | presume-city-17, presume-city-31, presume-city-47 |
| 12 | `data/institutionDescVariants.js` | house: fishing | "Builds and repairs flat-bottomed river craft: barges, punts, ferries, fishing boats. Specialist knowledge of r" | 52 / 52 | presume-village-2, presume-village-41, presume-village-55 |
| 13 | `data/institutionDescVariants.js` | house: fishing | "Builds and repairs flat-bottomed craft for shallow water: punts, ferries, fishing boats. Specialist knowledge:" | 12 / 12 | presume-village-6, presume-village-38, presume-town-37 |
| 14 | `data/institutionDescVariants.js` | house: fishing | "Builds and mends flat-bottomed boats for shallow water: punts, ferries, fishing craft. The work turns on a sha" | 7 / 7 | presume-village-31, presume-city-22, r2r-village-53 |
| 15 | `data/institutionDescVariants.js` | house: fishing | "Shallow-water boats, all flat-bottomed, made and repaired here: punts, ferries, and fishing craft. It takes a " | 7 / 7 | presume-village-25, presume-town-46, r2r-village-36 |
| 16 | `data/institutionDescVariants.js` | clergy | "A corner of the holding left out of the plough, banked with turf and marked with fieldstones. A priest says th" | 32 / 32 | r2r-thorp-0, r2r-thorp-3, r2r-thorp-9 |
| 17 | `data/institutionDescVariants.js` | clergy | "A turf-banked corner of the holding, kept out of the plough and marked with fieldstones. A priest speaks when " | 24 / 24 | r2r-thorp-2, r2r-thorp-6, r2r-thorp-27 |
| 18 | `data/institutionDescVariants.js` | clergy | "Fieldstones on a low bank at the edge of the ploughland. The rites wait for a priest when one can be fetched i" | 42 / 42 | r2r-thorp-1, r2r-thorp-5, r2r-thorp-8 |
| 19 | `data/institutionalCatalog.js` | resource: stone_quarry | "A stone quarry and its dressing yards, worked whenever good stone can be had." | 69 / 92 | presume-town-6, presume-town-14, presume-town-35 |
| 20 | `data/institutionalCatalog.js` | resource: stone_quarry | "A stone quarry, opened by quarrymen with picks and wedges. Slow work, and the only source of proper building s" | 2 / 4 | r2r-hamlet-23, r2r-hamlet-48 |
| 21 | `data/institutionalCatalog.js` | house: druid | "A council of senior druids who govern their circle's relationship with the settlement around it. They may main" | 102 / 102 | presume-town-35, presume-town-60, presume-town-74 |
| 22 | `generators/narrativeText.js` | smith | "Being on the right side of it keeps the forges of " | 1 / 3 | presume-town-25 |
| 23 | `generators/power/claimStanding.js` | practitioner | "Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, an" | 20 / 245 | presume-city-7, presume-city-22, presume-city-27 |
| 24 | `generators/power/claimStanding.js` | house: smuggling | "Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this beca" | 6 / 13 | presume-town-48, presume-city-92, r2r-town-8 |
| 25 | `components/home/landingFixture.js` | war | "Wartime pressure disrupts trade flows. Trade route strain disrupts trade flows." | 2 / 2 | lf-033 (the fixture, facts as born), lf-033 (the fixture, facts after its weeks) |
| 26 | `components/home/landingFixture.js` | market | "Caravans are passing Cnocby by, and its market stalls stand half empty." | 2 / 2 | lf-033 (the fixture, facts as born), lf-033 (the fixture, facts after its weeks) |

No **declared move** was made: no false line is one that a door already draws with its twin standing, curable by one declaration.


## WHAT WAS DONE (one commit each)

1. `--shrink`: the 7 stale arm-1 rows (3 widened, 4 first register: `narrativeData.js` warehouse and walls ×2, `narrativeText.js` practitioner and clergy, `computeActiveChains.js` mill ×2). The round reworded or removed these lines; their rewordings are among the 149.
2. `--shrink-arm2`: the 10 stale arm-2 rows (docks 1, market 1, mercenary 2, walls 1, war 5).
3. The three reasons added to the widened register's `reasons`, with the chair's texts, completed with the tip `c090179c1`. Each reason is added in its own banking commit.
4. **close-true** (76 rows), **close-unprinted** (47), **close-false** (7): the lines that did not stand at master, banked by hand with `bankRow` from the rule book's own functions (`probes/.../bank-close-rows.mjs`).
5. **close-true** (13) and **close-unprinted** (6): the 19 lines that DID stand whole at master. These went by (B) as well, because no widening exists for them (below).

The door's `--check` afterwards reads: **fresh 0 · stale 0 · first-register stale 0 · strips fresh 1**.

## CASE (A): NONE. Why the 19 lines that stood at master are case (B)

The chair counted 19 fresh literals that already stood in their file at `origin/master` (`db832c892`). My measure finds the same 19, by the WHOLE literal. The door's own first-60-characters test finds 28: 9 lines kept their opening but were reworded later in the literal, so they are the round's (B).

For each of the 19 I looked for the widening that made it visible, and found none:
- The rule book (`tests/lint/presumedThings.shared.mjs`, `src/domain/facts/registeredWords.js`) has not changed since `b4ebf8177` (STYLE-2-MERGE point 49).
- Scanning the tree at `b4ebf8177` with that same rule book (`git archive`; `scanTree`) finds **none of the 16 never-banked literals as a hit**. So what made them fresh is the code around the lines, which the round changed: the catalogues the generated vocabulary reads touch none of these words.
  - 11 of them now stand two to four times in their file (`settlementQuickGuide.js` 8 rows, `safetyProfile.js` 2, `faithReading.js` 1): the round wrote new copies, and the new copies are undeclared.
  - 5 are template fragments of `narrativeText.js` whose templates the round rewrote around them (for example, the monster-pressure mill line, re-shaped by TAIL-NARRATIVE).
- 3 were banked before and are fresh because their rows were dropped: `stressors.generated.js` occupation and war (dropped by the shrink of `338479f68`, W2-FIX-DATA-10), and `narrativeText.js` "The walls of " (banked at `0b092c5f1`, gone from the register on the joined line). The law says such a row goes by (B), restored by nothing.

So no `--bank … --base` through the door was made: no widening exists for it to name.

## THE STRIP (banked by hand under the chair's ruling PT2)

`src/generators/foodGenerator.js :: filterDeclared([...rows], { facts: () => factsOf(record), poolId: \`cultureProfiles:${String(key)}.fo…` (in `cultureFoodwaysOf`, written by UPKEEP-9 step 2(a), `4ff5b11e3`).

- No other `lane/tail-*` branch holds the file (three-dot diff against the joined line, every branch, after `git fetch origin`).
- **Handing the door the pool itself does not clear it.** I tested it in memory with the rule book's `stripSites`: `filterDeclared(rows, …).map((row) => String(lineText(row)))` is still a strip site. The ban reads `.map(lineText)` on any receiver; it does not read the spread. So the one-edit cure the brief offers does not exist.
- `--bank-strip` needs the receiver to stand at a base, and this receiver did not exist at `origin/master`: that version passed the culture's foodways lines whole (`composeFoodwaysLine({ cultureLines: … })`).
- **PT2 (the chair, 2026-11-15):** I read the site whole (`cultureFoodwaysOf`, lines 532–537). The pool goes to the door first (`filterDeclared([...rows], { facts: () => factsOf(record), … })`), and only the KEPT rows are unwrapped (`.map((row) => String(lineText(row)))`). They are unwrapped for the composer (`composeFoodwaysLine`'s `cultureLines`), which picks among them. The declarations are enforced before the unwrap, and nothing is lost before the pick. So the site is the ruling's first case: **banked by hand** under the new reason `after-base: close-strip` (the chair's text), in the register's own form `[file, receiver, reason]`, by `probes/TAIL-CLOSE-PRESUMED-1/bank-close-strip.mjs`, in its own commit.
- One word for the owner: the reason's text says "unwrapped only to be printed". The kept lines are unwrapped to be PICKED from by the composer, but only after the door has kept them.
- Before the ruling I named it and left it. It is not a strip-before-draw: the door's own filter has already run, and the text is taken off its output. **It is the ban's own gap:** the ban exempts a `.text` taken off a door's call (`STRIP_DOORS`) but not a `.map(lineText)` over a door's returned list. Freeing it means widening that exemption, which is not the close's to do.

## THE WALKER'S OWN CREDIT GAPS (named; not widened in the close)

The brief names three carriers that a door enforces but that the walker does not credit, said to hold rows of the history's batch 6:
- `src/data/arrivalProse.js` `bank` and `house: fishmonger` (the arrival table's carrier, the fishmonger family's atom). Both rows measured **close-unprinted** and were banked under that reason.
- `src/data/historyData.js` `occupation` (the occupation word's tense). The row is **close-false** row 1 above.

The close found three more reader gaps that the next round should rule on:
- the house families read a house by its name's stem, so an institution's own description, under another name, reads absent (rows 5 and 6);
- the resource word "stone quarry" reads only the country's resources, never the quarry house (rows 3 and 4);
- the strip ban's door exemption (above).

## THE MEASURE AND ITS LIMITS

- Script: `docs/chair/2026-11-15/probes/TAIL-CLOSE-PRESUMED-1/measure-fresh-rows.mjs` (with `jsx-hooks.mjs`, an esbuild load hook so the census's public-prose compose can load its `.jsx` in node). The result is `measure-c090179c1.json`. The table below is written by `handback-table.mjs`, and the bank by `bank-close-rows.mjs`. No file has `.test.` in its name.
- Births: the walker's `corpusSeeds()` / `corpusConfig`, plus the census's `censusPlan('r2')` through `configOf(row, DEFAULT_CONFIG, birthConfig)` after `loadGenerationLawPayloads()`, with the public prose composed on (`withPublicProse(town, composePublicProse(town))`), as the census births them.
- Reading: the record is read as arm 2 reads it (`isPrinted` paths, `sentencesOf`, the naming side not read on licensed rows). A line prints where all of its static fragments (8 characters or more) stand in one printed leaf. The thing is judged in the printed sentence by the registered word's OWN `absent` reader, or by `presentForDenial` for a denial. For a house the reader is the live roster or a power by the house's stem; for a resource, `config.nearbyResources`; for a role, factsOf plus the town's people.
- **Limit:** the measure reads the RECORD, not the rendered page. The display and summary files (`src/domain/display/*`, `src/domain/summary/settlementQuickGuide.js`, `src/domain/dossier/faithReading.js`) print on the page. Their **close-unprinted** rows (10) mean "not in the record". The page census renders them; I did not render.
- **Fixed at `e047ef2b6`:** a sentence of the line is one that holds a fragment or is held by one. A literal of two sentences or more is a single fragment spanning them, and the first measure missed this (the CORRECTION above). The `--rows` option re-measures earlier rows; `--landing <seed>` also reads the landing fixture's own frozen strings against its own town, as born and after its weeks.
- **Limit:** a short template fragment ("The walls of ") may match a different line that shares it, so its printed and true counts are an upper bound.

## RE-RUNS

- After the first receipt: the joined line at `d5d1208ee` (JOIN-10 points 11–16) merged in (a merge commit). Its `src` changes touch `claimStanding.js` and `relationshipArchetypes.js` and bring no fresh row: the door's `--check` reads fresh 0 · stale 0 · first-register stale 0 · strips fresh 1, and the walker still reads 42 of 43, the same strip. The table did not need extending.

- Then the joined line at `2ff8ab7ee` (the houses' three reworded lines, in `institutionDescVariants.js` and `institutionalCatalog.js`) merged in. It brought no fresh or stale row: the door's `--check` reads **fresh 0 · stale 0 · first-register stale 0 · strips fresh 0 stale 0** (exit 0).

- **The join at `e047ef2b6`** (JOIN-11 points 5–8: TAIL-CLOSE-DOORS-1's re-emitted landing fixture among them) merged in. The door read 3 fresh and 1 stale, all in `src/components/home/landingFixture.js`.
  - **Stale:** the old war line. Removed by `--shrink`.
  - **Fresh:** three lines. They print on none of the 1,080 births; read in the fixture against its own town (`--landing lf-033`, `measure-e047ef2b6.json`):
    - the mill line: true;
    - the war and market lines: **false**, banked close-false. Both stood whole at master and were gone from the fixture until the re-emit brought them back. No widening (the rule book is unchanged), so this is case (B).
  - Here I also found and fixed the measure's sentence bug, re-measured all 150 banked rows, and moved 17 (the CORRECTION).

## RECEIPT

`tests/lint/presumedThings.walker.test.js` alone, at this branch's tip after PT2 and the merge of `2ff8ab7ee`: see the last line of this section.

- Before PT2, at `91efe4aba` and `0d18473a8`: 42 of 43, the strip red.
- **After PT2 and the merge of `2ff8ab7ee`: 43 of 43** (the walker alone, exit 0).
- **At the join `e047ef2b6`, after the CORRECTION and the landing rows: 43 of 43** (the walker alone, exit 0); door `--check` exit 0.
- **At the join `b855354d2`** (JOIN-12 points 1–2: TAIL-CLOSE-SWEEP-B, TAIL-CLOSE-SRC-5) merged in: no fresh or stale row; door `--check` exit 0; **the walker 43 of 43**.
- **At the join `e172d6d62`** (JOIN-12 point 3: TAIL-CLOSE-SWEEP-C, no `src` change) merged in: door `--check` exit 0; **the walker 43 of 43**.
- **FINAL PASS at `f76fe38fd`** merged in: the door read no fresh or stale row. I re-measured the 26 false rows (`remeasure-false-at-f76fe38fd.json`, `--landing lf-033`): the forges line is now TRUE, and its reason moved close-false → close-true in its own commit. The other 25 stay false. Door `--check` exit 0; **the walker 43 of 43**.
- **The last pass, at the doors' `752d74a15`** (the re-emitted landing fixture): 1 stale row (the market line, cured) removed by `--shrink`; no fresh row; the landing rows re-measured (war false, mill true). Door `--check` exit 0; **the walker 43 of 43**.
- **After my branch landed (JOIN-11 point 2) and the join moved to `061db1367`** (TAIL-CLOSE-SRC-3 landed): a fast-forward. The door's `--check` read 1 fresh and 1 stale.
  - **Stale:** `priorityHelpers.js` `house: criminal faction`, a line SRC-3 reworded. Removed by `--shrink` in its own commit.
  - **Fresh:** `src/domain/facts/magic.js` `house: academy`, the literal `'academy of magic'`. It is a house-name entry of `ARCANE_GUILD_HOUSES`, which SRC-3 moved verbatim from `economy/economicState.js` (`e28552112`), so in `magic.js` it is the round's (B).
  - Measured by the same script (`measure-061db1367.json`): printed in 58 of 1,080 births, against in 0. The "printed" towns are towns whose prose names the house, and the house stands in each. Banked **close-true** in its own commit. Its table is the second one at the end.
  - After it: door `--check` exit 0 (all zero), and **the walker 43 of 43** (exit 0).
- **The join at `22b3cc82e`** (JOIN-11 points 3–4: TAIL-CLOSE-SRC-4, TAIL-TIES-10) merged in (a merge commit): no fresh or stale row. The door's `--check` exits 0 and **the walker reads 43 of 43**.

## THE TABLE (every fresh row, as FIRST measured: superseded where the CORRECTION moved a row; the corrected verdicts are `probes/TAIL-CLOSE-PRESUMED-1/remeasure-150-at-e047ef2b6.json`)

Case B for all 149. "Printed in" and "against in" count births out of 1,080. "Against" means: the thing is absent where a naming line prints, or present where a denying line prints.

Measured at `b75d2a049` over 1080 births (base for "stood at": `origin/master`).

| # | file | thing | side | the line's first words | case | printed in | against in | towns against (first three) | reading | reason |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | data/arrivalProse.js | house: fishmonger | names | "A fishmonger stands behind an empty slab, with nothing to sh" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 2 | data/arrivalProse.js | bank | names | "A money changer sits at his table with little to do, countin" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 3 | data/defenceWeights.js | quarters | names | "a house counts by its rung on its own ladder (the catalogue'" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-unprinted |
| 4 | data/defenceWeights.js | house: alchemist | names | "a house counts by its rung on its own ladder (the catalogue'" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 5 | data/defenceWeights.js | armedForce | names | "citizens under arms: less than soldiers, good against beasts" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-unprinted |
| 6 | data/defenceWeights.js | armedForce | names | "unpaid soldiers desert slowly, never at once" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-unprinted |
| 7 | data/defenceWeights.js | house: druid | names | "today's points, with today's relief by faith, druids, arcana" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 8 | data/defenceWeights.js | market | names | "today's points, with today's relief by faith, druids, arcana" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 9 | data/defenceWeights.js | mason | names | "Masons at work on the defences" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: institutions.js :: liveInstitutionNames (a quarry or a mason); its atom | after-base: close-unprinted |
| 10 | data/defenceWeights.js | house: reeve | names | "Elders and reeve" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 11 | data/defenceWeights.js | house: alchemist | names | "Alchemists preserving the grain" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 12 | data/dossierStateProse/defense.generated.js | war | names | "no crisis: wartime" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 13 | data/dossierStateProse/defense.generated.js | occupation | names | "{settlement}'s works were seldom tested by the settled count" | B (the round wrote or reworded it) | 1 | 0 |  | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-true |
| 14 | data/dossierStateProse/defense.generated.js | armedForce | names | "{settlement} keeps paid soldiers behind its walls, so raider" | B (the round wrote or reworded it) | 77 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-true |
| 15 | data/dossierStateProse/defense.generated.js | streets | names | "{settlement} has no wall and no soldiers; its watch keeps th" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-unprinted |
| 16 | data/dossierStateProse/defense.generated.js | famine | names | "no crisis: famine" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: famine.js :: famineOf · crisisKind.js (famine) | after-base: close-unprinted |
| 17 | data/dossierStateProse/defense.generated.js | armedForce | names | "{settlement} had money laid by before this trouble began, an" | B (the round wrote or reworded it) | 41 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-true |
| 18 | data/dossierStateProse/defense.generated.js | armedForce | names | "The town went into this trouble with money in hand, and its " | B (the round wrote or reworded it) | 11 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-true |
| 19 | data/dossierStateProse/defense.generated.js | armedForce | names | "{settlement}'s defenders are better off for the trades behin" | B (the round wrote or reworded it) | 32 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-true |
| 20 | data/dossierStateProse/defense.generated.js | famine | names | "food: > famine" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: famine.js :: famineOf · crisisKind.js (famine) | after-base: close-unprinted |
| 21 | data/dossierStateProse/defense.generated.js | granary | names | "no institution: granary" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 22 | data/dossierStateProse/defense.generated.js | armedForce | names | "Alchemy is practised at {settlement}, and some of what it ma" | B (the round wrote or reworded it) | 1 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-true |
| 23 | data/dossierStateProse/defense.generated.js | armedForce | names | "Alchemical preparations made at {settlement} are among what " | B (the round wrote or reworded it) | 28 | 0 |  | the word's reader: factsOf.js :: guardPresence (watch ∨ garrison ∨ militia ∨ hired company | after-base: close-true |
| 24 | data/dossierStateProse/defense.generated.js | famine | names | "With nobody at {settlement} paid to keep order, the hunger i" | B (the round wrote or reworded it) | 7 | 0 |  | the word's reader: famine.js :: famineOf · crisisKind.js (famine) | after-base: close-true |
| 25 | data/dossierStateProse/economy.generated.js | famine | names | "no crisis: famine" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: famine.js :: famineOf · crisisKind.js (famine) | after-base: close-unprinted |
| 26 | data/dossierStateProse/economy.generated.js | famineToCome | names | "Nobody at {settlement} worries much about one poor harvest: " | B (the round wrote or reworded it) | 31 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (no famine in force) | after-base: close-true |
| 27 | data/dossierStateProse/general.generated.js | occupation | names | "{settlement} is under occupation; the streets are quiet beca" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-unprinted |
| 28 | data/dossierStateProse/general.generated.js | occupation | names | "{settlement} is quiet under occupation: no unrest, and nobod" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-unprinted |
| 29 | data/dossierStateProse/power.generated.js | war | names | "no crisis: wartime" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 30 | data/dossierStateProse/power.generated.js | revolt | names | "no crisis: insurgency" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js (insurgency, slave_revolt) | after-base: close-unprinted |
| 31 | data/dossierStateProse/stressors.generated.js | occupation | names | "{settlement}'s taxes go to the occupier before the town sees" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-unprinted |
| 32 | data/dossierStateProse/stressors.generated.js | occupation | names | "{settlement} runs as before, but the occupier's officers sit" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-unprinted |
| 33 | data/dossierStateProse/stressors.generated.js | occupation | names | "The occupiers are quartered inside the town, and the town's " | B (stood at master; its row dropped by a shrink) | 0 | 0 |  | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-unprinted |
| 34 | data/dossierStateProse/stressors.generated.js | war | names | "{settlement} is at war, and the war has reached the town as " | B (stood at master; its row dropped by a shrink) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 35 | data/dossierStateProse/warFaith.generated.js | temple | names | "The church in {settlement} hunts heresy openly: anyone suspe" | B (the round wrote or reworded it) | 2 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |
| 36 | data/foundingSeeds.js | mill | names | "Grown up around an important river ford, this town has turne" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 37 | data/historyData.js | quarters | names | "the merchants' quarter" | B (the round wrote or reworded it) | 51 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-true |
| 38 | data/historyData.js | quarters | names | "the residential district" | B (the round wrote or reworded it) | 32 | 1 | r2s-succession_void-town-3 | the word's reader: populationBand.js :: populationBandOf | after-base: close-false |
| 39 | data/historyData.js | temple | names | "the temple district" | B (the round wrote or reworded it) | 41 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |
| 40 | data/historyData.js | quarters | names | "the temple district" | B (the round wrote or reworded it) | 41 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-true |
| 41 | data/historyData.js | quarters | names | "A fire out of {location} spread through {building_type} acro" | B (the round wrote or reworded it) | 32 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-true |
| 42 | data/historyData.js | temple | names | "A period of ambitious stone construction transformed the set" | B (the round wrote or reworded it) | 25 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |
| 43 | data/historyData.js | temple | names | "A period of ambitious stone construction transformed the set" | B (the round wrote or reworded it) | 5 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |
| 44 | data/historyData.js | quarters | names | "A catastrophic or transformative event tied to the local ley" | B (the round wrote or reworded it) | 10 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-true |
| 45 | data/historyData.js | quarters | names | "Affected district retains residual magical effects" | B (the round wrote or reworded it) | 10 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-true |
| 46 | data/historyData.js | occupation | names | "When the occupiers left, they left behind a town of former c" | B (the round wrote or reworded it) | 36 | 36 | presume-town-3, presume-town-6, presume-town-30 | the word's reader: crisisKind.js (occupied) · rulerKind.js (occupier) | after-base: close-false |
| 47 | data/institutionDescVariants.js | house: fishing | names | "The nets, the traps, the drying racks, worked by the fishing" | B (the round wrote or reworded it) | 14 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 48 | data/institutionDescVariants.js | house: stone quarry | names | "A stone quarry, its blocks cut and dressed by a gang of quar" | B (the round wrote or reworded it) | 3 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 49 | data/institutionDescVariants.js | resource: stone_quarry | names | "A stone quarry, its blocks cut and dressed by a gang of quar" | B (the round wrote or reworded it) | 3 | 0 |  | the record: config.nearbyResources less the depleted | after-base: close-true |
| 50 | data/institutionDescVariants.js | house: stone quarry | names | "A building-stone quarry laid out in an ordered working. A vi" | B (the round wrote or reworded it) | 3 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 51 | data/institutionDescVariants.js | resource: stone_quarry | names | "A building-stone quarry laid out in an ordered working. A vi" | B (the round wrote or reworded it) | 3 | 0 |  | the record: config.nearbyResources less the depleted | after-base: close-true |
| 52 | data/institutionDescVariants.js | house: alehouse | names | "Turns malted grain into ale by the barrel. Only bread takes " | B (the round wrote or reworded it) | 1 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 53 | data/institutionDescVariants.js | house: mine | names | "A mine of shafts and adits, with winding gear and ore carts " | B (the round wrote or reworded it) | 50 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 54 | data/institutionDescVariants.js | house: stone quarry | names | "A stone quarry, with yards beside it for dressing the stone," | B (the round wrote or reworded it) | 65 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 55 | data/institutionDescVariants.js | resource: stone_quarry | names | "A stone quarry, with yards beside it for dressing the stone," | B (the round wrote or reworded it) | 65 | 42 | presume-town-34, presume-town-53, presume-town-57 | the record: config.nearbyResources less the depleted | after-base: close-false |
| 56 | data/institutionDescVariants.js | house: druid | names | "Senior druids who govern how their circle deals with the tow" | B (the round wrote or reworded it) | 5 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 57 | data/institutionDescVariants.js | streets | names | "Senior druids who govern how their circle deals with the tow" | B (the round wrote or reworded it) | 5 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 58 | data/institutionDescVariants.js | house: druid | names | "A council of elder druids charged with their circle's standi" | B (the round wrote or reworded it) | 6 | 6 | presume-town-119, presume-town-120, presume-town-127 | the record: the live roster or a power, by the house's stem | after-base: close-false |
| 59 | data/institutionDescVariants.js | streets | names | "A council of elder druids charged with their circle's standi" | B (the round wrote or reworded it) | 6 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 60 | data/institutionDescVariants.js | house: alehouse | names | "Converts barley into malt for brewing. Small operation suppl" | B (the round wrote or reworded it) | 1 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 61 | data/institutionDescVariants.js | house: alehouse | names | "Converts malted grain to ale in quantity. The largest consum" | B (the round wrote or reworded it) | 7 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 62 | data/institutionDescVariants.js | house: baker | names | "Kiln crews in the surrounding woodland supply charcoal to th" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 63 | data/institutionDescVariants.js | house: smelter | names | "Kiln crews in the surrounding woodland supply charcoal to th" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 64 | data/institutionDescVariants.js | smith | names | "Kiln crews in the surrounding woodland supply charcoal to th" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: institutions.js :: liveInstitutionNames (a smith or metalworker); its a | after-base: close-unprinted |
| 65 | data/institutionDescVariants.js | smith | names | "Operates kilns in nearby woodland. Supplies fuel for smithin" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: institutions.js :: liveInstitutionNames (a smith or metalworker); its a | after-base: close-unprinted |
| 66 | data/institutionDescVariants.js | famine | names | "Communal grain storage. Buffers harvests, prevents famine." | B (the round wrote or reworded it) | 80 | 0 |  | the word's reader: famine.js :: famineOf · crisisKind.js (famine) | after-base: close-true |
| 67 | data/institutionDescVariants.js | house: hired blade | names | "Organised bands of hired blades, a few score to a few hundre" | B (the round wrote or reworded it) | 38 | 23 | presume-city-17, presume-city-31, presume-city-47 | the record: the live roster or a power, by the house's stem | after-base: close-false |
| 68 | data/institutionDescVariants.js | house: fishing | names | "Builds and repairs flat-bottomed river craft: barges, punts," | B (the round wrote or reworded it) | 52 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 69 | data/institutionDescVariants.js | house: fishing | names | "Builds and repairs flat-bottomed craft for shallow water: pu" | B (the round wrote or reworded it) | 12 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 70 | data/institutionDescVariants.js | house: fishing | names | "Builds and mends flat-bottomed boats for shallow water: punt" | B (the round wrote or reworded it) | 7 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 71 | data/institutionDescVariants.js | house: fishing | names | "Shallow-water boats, all flat-bottomed, made and repaired he" | B (the round wrote or reworded it) | 7 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 72 | data/institutionDescVariants.js | clergy | names | "A corner of the holding left out of the plough, banked with " | B (the round wrote or reworded it) | 32 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch; seniorCleric); or a perso | after-base: close-true |
| 73 | data/institutionDescVariants.js | clergy | names | "A turf-banked corner of the holding, kept out of the plough " | B (the round wrote or reworded it) | 24 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch; seniorCleric); or a perso | after-base: close-true |
| 74 | data/institutionDescVariants.js | clergy | names | "Fieldstones on a low bank at the edge of the ploughland. The" | B (the round wrote or reworded it) | 42 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch; seniorCleric); or a perso | after-base: close-true |
| 75 | data/institutionServices.js | clergy | names | "Funeral rites, said by the parish priest, who comes or is se" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch; seniorCleric); or a perso | after-base: close-unprinted |
| 76 | data/institutionalCatalog.js | house: mine | names | "A mine of shafts and adits, with its winding gear and ore ca" | B (the round wrote or reworded it) | 45 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 77 | data/institutionalCatalog.js | house: stone quarry | names | "A stone quarry and its dressing yards, worked whenever good " | B (the round wrote or reworded it) | 92 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 78 | data/institutionalCatalog.js | resource: stone_quarry | names | "A stone quarry and its dressing yards, worked whenever good " | B (the round wrote or reworded it) | 92 | 69 | presume-town-6, presume-town-14, presume-town-35 | the record: config.nearbyResources less the depleted | after-base: close-false |
| 79 | data/institutionalCatalog.js | house: stone quarry | names | "A stone quarry, opened by quarrymen with picks and wedges. S" | B (the round wrote or reworded it) | 4 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 80 | data/institutionalCatalog.js | resource: stone_quarry | names | "A stone quarry, opened by quarrymen with picks and wedges. S" | B (the round wrote or reworded it) | 4 | 0 |  | the record: config.nearbyResources less the depleted | after-base: close-true |
| 81 | data/institutionalCatalog.js | house: druid | names | "A council of senior druids who govern their circle's relatio" | B (the round wrote or reworded it) | 102 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 82 | data/institutionalCatalog.js | streets | names | "A council of senior druids who govern their circle's relatio" | B (the round wrote or reworded it) | 102 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 83 | data/stressInstitutionEffects.js | siege | names | "Has been skimming from the {food} reserves to pay a personal" | B (the round wrote or reworded it) | 17 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-true |
| 84 | generators/computeActiveChains.js | mercenary | names | "free company hall" | B (the round wrote or reworded it) | 26 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 85 | generators/economy/incomeLineSiblings.js | house: alchemist | names | "Herbal remedies, minor alchemical preparations, and potion s" | B (the round wrote or reworded it) | 69 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 86 | generators/economy/incomeLineSiblings.js | siege | names | "Alchemical preparations and curative potions, sold only to t" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-unprinted |
| 87 | generators/economy/incomeLineSiblings.js | smith | names | "Local ore feeds the smithy directly. Metalwork income is not" | B (the round wrote or reworded it) | 120 | 0 |  | the word's reader: institutions.js :: liveInstitutionNames (a smith or metalworker); its a | after-base: close-true |
| 88 | generators/economy/incomeLineSiblings.js | house: fuller | names | "Local flocks provide raw wool; weavers and fullers convert i" | B (the round wrote or reworded it) | 56 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 89 | generators/economy/incomeLineSiblings.js | mason | names | "Stone masons work imported material; the quarrying income no" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: institutions.js :: liveInstitutionNames (a quarry or a mason); its atom | after-base: close-unprinted |
| 90 | generators/economy/incomeLineSiblings.js | temple | names | "Mandatory tithes plus rent income from church-owned land dom" | B (the round wrote or reworded it) | 4 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |
| 91 | generators/economy/incomeLineSiblings.js | market | names | "Market day stall fees and toll collection on goods entering " | B (the round wrote or reworded it) | 300 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 92 | generators/economy/viability.js | house: hedge wizard | names | "Traveling hedge wizard" | B (the round wrote or reworded it) | 15 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 93 | generators/narrative/settlementOriginProse.js | siege | names | "Isolated from major trade routes, and now under siege. The s" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-unprinted |
| 94 | generators/narrative/settlementOriginProse.js | siege | names | "Isolated from major trade routes, and short of what it eats." | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-unprinted |
| 95 | generators/narrative/settlementOriginProse.js | siege | names | "Isolated, and running a shortfall it cannot farm its way out" | B (the round wrote or reworded it) | 2 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-true |
| 96 | generators/narrative/settlementOriginProse.js | siege | names | "Off the trade routes and under-fed by its own land, and now " | B (the round wrote or reworded it) | 1 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-true |
| 97 | generators/narrativeText.js | powersCount | names | " holds the power, and its two powers are each watching who h" | B (the round wrote or reworded it) | 2 | 0 |  | the word's reader: the record :: powerStructure.factions (a count dimension waits for fact | after-base: close-true |
| 98 | generators/narrativeText.js | walls | names | "The walls of " | B (stood at master; its row dropped by a shrink) | 3 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 99 | generators/narrativeText.js | walls | names | " every morning, and the people on the walls watch each other" | B (the round wrote or reworded it) | 5 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 100 | generators/narrativeText.js | starving | names | " is two bad weeks from genuine starvation; the remaining " | B (the round wrote or reworded it) | 3 | 0 |  | the word's reader: famine.js :: famineOf (starvingAllowed) · crisisKind.js (famine) | after-base: close-true |
| 101 | generators/narrativeText.js | market | names | " quiet. The market still opens, the queues still form, but t" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 102 | generators/narrativeText.js | granary | names | " is being run, for the moment, by whoever holds the keys, th" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 6 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 103 | generators/narrativeText.js | mill | names | " has drawn its edges inward (fields left unworked, a mill " | B (stood at master; no widening: the round re-shaped the line or its declaration) | 4 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 104 | generators/narrativeText.js | walls | names | " has learned the settlement's patterns (when the patrols pas" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 4 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 105 | generators/narrativeText.js | garrison | names | " is at war and, for now, on the right side of it: contracts " | B (the round wrote or reworded it) | 4 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 106 | generators/narrativeText.js | smith | names | "Being on the right side of it keeps the forges of " | B (the round wrote or reworded it) | 3 | 1 | presume-town-25 | the word's reader: institutions.js :: liveInstitutionNames (a smith or metalworker); its a | after-base: close-false |
| 107 | generators/narrativeText.js | garrison | names | " is prospering on the right side of it: full warehouses, a r" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 108 | generators/narrativeText.js | war | names | " could spare, and several it could not, has gone to the war;" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 9 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 109 | generators/power/claimStanding.js | clergy | names | "Clergy are present but operate at the margins of civic life;" | B (the round wrote or reworded it) | 186 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch; seniorCleric); or a perso | after-base: close-true |
| 110 | generators/power/claimStanding.js | practitioner | names | "Magical practitioners are consulted but not formally empower" | B (the round wrote or reworded it) | 245 | 0 |  | the word's reader: magicReliance.js :: magicPractitioners (NEW-2, 3; its atom waits for a | after-base: close-true |
| 111 | generators/power/claimStanding.js | house: smuggling | names | "Underworld effectively controls vice, smuggling, and key off" | B (the round wrote or reworded it) | 13 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 112 | generators/power/claimStanding.js | clergy | names | "The local clergy serve a real pastoral role; their moral aut" | B (the round wrote or reworded it) | 12 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch; seniorCleric); or a perso | after-base: close-true |
| 113 | generators/power/claimStanding.js | watch | names | "Well-funded city watch; it keeps order reliably and is growi" | B (the round wrote or reworded it) | 166 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 114 | generators/power/claimStanding.js | watch | names | "City watch; law enforcement and external defence, stretched " | B (the round wrote or reworded it) | 50 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 115 | generators/power/claimStanding.js | house: wizard's tower | names | "Wizard towers and mage guilds hold genuine political weight;" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 116 | generators/power/claimStanding.js | house: mages' guild | names | "Wizard towers and mage guilds hold genuine political weight;" | B (the round wrote or reworded it) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 117 | generators/power/claimStanding.js | practitioner | names | "Mages and arcane practitioners hold real influence through m" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: magicReliance.js :: magicPractitioners (NEW-2, 3; its atom waits for a | after-base: close-unprinted |
| 118 | generators/power/stressFactions.js | war | names | " Wartime has transformed this power from a civic institution" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 119 | generators/safetyProfile.js | garrison | names | "The garrison is present and responsive." | B (the round wrote or reworded it) | 41 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 120 | generators/safetyProfile.js | watch | names | "The watch is present and responsive." | B (the round wrote or reworded it) | 18 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 121 | generators/safetyProfile.js | militia | names | "The militia is present and responsive." | B (the round wrote or reworded it) | 9 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 122 | generators/safetyProfile.js | house: street gang | names | "A street gang controls part of the place, extorting local bu" | B (the round wrote or reworded it) | 42 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 123 | generators/safetyProfile.js | mercenary | names | "A mercenary company provides enforcement: professional and e" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 124 | generators/safetyProfile.js | garrison | names | "Hired swords back the garrison when the purse allows." | B (the round wrote or reworded it) | 1 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 125 | generators/safetyProfile.js | garrison | names | "Hired swords back the garrison." | B (the round wrote or reworded it) | 225 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 126 | generators/safetyProfile.js | house: adventurers' charter | names | "The adventurers' charter hall takes bounty work against thre" | B (the round wrote or reworded it) | 7 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 127 | generators/safetyProfile.js | house: adventurers' charter | names | "The adventurers' charter hall coordinates emergency response" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 0 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-unprinted |
| 128 | generators/safetyProfile.js | house: adventurers' charter | names | "The adventurers' charter hall takes bounty work against thre" | B (the round wrote or reworded it) | 16 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
| 129 | domain/display/threatAssessment.js | militia | names | " and a citizen militia to hold it." | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 130 | domain/display/tradeListDisplay.js | bank | names | "international banking services" | B (the round wrote or reworded it) | 150 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 131 | domain/display/tradeListDisplay.js | market | names | "magical item market" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 132 | domain/dossier/faithReading.js | shrine | names | ", and the shrines answer to no named god." | B (stood at master; no widening: the round re-shaped the line or its declaration) | 0 | 0 |  | the word's reader: factsOf.js :: sacredHouse | after-base: close-unprinted |
| 133 | domain/dossier/faithReading.js | siege | names | " has no church of its own, and the siege keeps its people fr" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: crisisKind.js :: crisisFactsOf (under_siege) | after-base: close-unprinted |
| 134 | domain/dossier/faithReading.js | temple | denies | " has no church of its own, and the siege keeps its people fr" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-unprinted |
| 135 | domain/summary/settlementQuickGuide.js | streets | names | "built in masonry around a civic square, and run by" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 36 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 136 | domain/summary/settlementQuickGuide.js | market | names | "built on tribute, market and waterworks" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 137 | domain/summary/settlementQuickGuide.js | docks | names | "built around the agora and the harbour" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 5 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 138 | domain/summary/settlementQuickGuide.js | streets | names | "built around the agora and the harbour" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 5 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 139 | domain/summary/settlementQuickGuide.js | docks | names | "built around the harbour" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 140 | domain/summary/settlementQuickGuide.js | streets | names | "built around the agora, and run by" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-unprinted |
| 141 | domain/summary/settlementQuickGuide.js | streets | names | "built around the agora, " | B (stood at master; no widening: the round re-shaped the line or its declaration) | 35 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 142 | domain/summary/settlementQuickGuide.js | quarters | names | "built around kin districts and an assembly ground" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 29 | 0 |  | the word's reader: populationBand.js :: populationBandOf | after-base: close-true |
| 143 | domain/summary/settlementQuickGuide.js | streets | names | ", in quarters by trade and kin" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-unprinted |
| 144 | domain/summary/settlementQuickGuide.js | streets | names | ", in quarters by trade," | B (stood at master; no widening: the round re-shaped the line or its declaration) | 39 | 0 |  | the word's reader: the record :: tier (factsOf(record).tier) | after-base: close-true |
| 145 | domain/summary/settlementQuickGuide.js | market | names | "tribute, and market-and-waterworks" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 19 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 146 | domain/summary/settlementQuickGuide.js | market | names | "tribute and market" | B (the round wrote or reworded it) | 11 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-true |
| 147 | domain/summary/settlementQuickGuide.js | market | names | "built on tribute and market" | B (the round wrote or reworded it) | 0 | 0 |  | the word's reader: factsOf (the thing's own reader) | after-base: close-unprinted |
| 148 | domain/summary/settlementQuickGuide.js | temple | names | ", under temple and guild" | B (stood at master; no widening: the round re-shaped the line or its declaration) | 35 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |
| 149 | domain/summary/settlementQuickGuide.js | temple | names | ", under the temple" | B (the round wrote or reworded it) | 7 | 0 |  | the word's reader: faithReading.js :: faithReadingOf (hasChurch: a wayside shrine is not a | after-base: close-true |

### Re-run at `061db1367`

Measured at `d7baa0621` over 1080 births (base for "stood at": `origin/master`).

| # | file | thing | side | the line's first words | case | printed in | against in | towns against (first three) | reading | reason |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | domain/facts/magic.js | house: academy | names | "academy of magic" | B (the round wrote or reworded it) | 58 | 0 |  | the record: the live roster or a power, by the house's stem | after-base: close-true |
