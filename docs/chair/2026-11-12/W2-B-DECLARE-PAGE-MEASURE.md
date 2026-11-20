# W2-B-DECLARE item 2: THE PAGE MEASURED BY VOCABULARY (2026-11-12)

**What this is.** The chair's record 288, ruling 3: the presumed-things walker's own matcher, with the new words (states, sizes, counts), run over every VISIBLE sentence of the census's 720 rendered dossiers against each town's leaves. A sentence that names what the town lacks, or denies what it has, is a finding whether or not anyone has named its pattern. THIS LIST is what is cured before the release; the rest of the habitat is banked, shrink-only (item 3).

**Where it ran.** The lane's base, `1930cec6e` (the agreement lane's tip), with `e0f2bd58e` on it (tests only). The corpus: the census's 720 seeds (`r2r-<size>-<i>`, 6 sizes × 60 calm; `r2s-<crisis>-<size>-<i>`, 15 crises × 6 sizes × 4), born and rendered as the census does (owner's view; every group, sub-tab and disclosure; style elements skipped). Births 720, errors 0; dumps 720. Everything EXECUTED; the scripts and results are in `probes/W2-B-DECLARE/` beside this file.

## 1. The instrument

- **The words**: one home, `src/domain/facts/registeredWords.js`. The walker's sixteen things, moved there VERBATIM from its rule book (which re-exports them), and ten new words: seven STATES (siege, famine, plague, occupation, revolt, refugees, succession), one SIZE (quarters: districts, named quarters, urban, metropolitan, neighbourhoods, slums, tenements), two COUNTS (a count of powers; a count of houses). Each carries its disqualifier atoms, its leaf and its layer (P, S, T).
- **The check**: `src/domain/coherence/vocabularyPageFindings.js`, a member for the rendered-dossier arm (the same input as `pageCensusFindings`: the record and its views). Unit-tested on planted records (`tests/domain/coherence/vocabularyPageFindings.test.js`, every side of every kind). **Handed to W2-A-LEAVES's page arm** to register.
- **The run**: `pagemeasure.mjs` (the member over 720 dumps; each finding attributed to its source literal by its longest static fragment), `classify.mjs` (every finding classed by hand-written rules, one per shape family, each with its reason; 442 shapes read).
- The tier noun ("this town" in a city) is NOT re-measured here: `tierNounFindings.js` already owns it.

## 2. The result

**6,496 hits in 720 towns.** Classed:

| class | lines / towns | what it is |
|---|---|---|
| **FINDING** | **1,569 / 710** | printed false on its town: the list to cure |
| heading | 1,400 / 662 | a category or event name, a resource chip, a requirement ("Siege & Famine", "Popular Uprising", "Needs: … Fulling mill") |
| past | 1,377 / 525 | a past event, its hook or its founding ("the succession crisis, a generation old") |
| elsewhere | 1,278 / 259 | another place: an access row, the next village's church ("Access to external mill") |
| service | 574 / 378 | a house's own service or the general trade ("grain reserves against famine and siege") |
| narrower | 240 / 240 | "has no church of its own" beside a wayside shrine: the faith reading's word is narrower than the matcher's |
| figure | 47 / 44 | a figure, a hedge, a building's own walls |
| hedge | 11 / 11 | "two or three powers" where two stand |

None of the other-sense rows changes the matcher: each is a reason a word is read in another sense, recorded per rule in `classify.mjs`.

### 2a. The findings by source and layer

| source | lines / towns | P | S | T |
|---|---|---|---|---|
| corpus pool | 27 / 26 | 27 | 0 | 0 |
| generator pool | 261 / 207 | 247 | 14 | 0 |
| generator code | 131 / 82 | 124 | 7 | 0 |
| written in code (display) | 737 / 375 | 419 | 318 | 0 |
| unattributed (assembled from fragments) | 413 / 403 | 407 | 6 | 0 |

T is empty because no T word is registered yet: the practitioner, the capture and the founder have no atoms (they wait for W2-A-LEAVES's leaves). On every size and both arms: thorp, hamlet, village, town, city 60 of 60 calm; metropolis 59; crisis 60, 60, 60, 56, 58, 57.

### 2b. The findings by pattern, with their owners

| pattern | lines / towns | what prints false | where it is written | whose |
|---|---|---|---|---|
| **20** | 689 / 689 | "Food endurance: … under siege the outlying fields are lost" outside a siege | `defenseDisplay.js :: foodEnduranceLine` | W2-A-LEAVES (2+20) |
| **16a** | 318 / 318 | "the ruling three of …" over fewer than three powers | `WhoRunsThisTownPanel.jsx` | W2-B-DECLARE (16a, later stage) |
| **11** | 100 / 94 | the escort chain "Armed escort & mercenary hire" with no hired company; "River Mill Industry … Running" with only an external mill | `computeActiveChains.js`, `supplyChainData.js`; the chain card | W2-C-LEAVES (11); the chain writer is no lane's |
| **14c** | 184 / 107 | district and quarter words in a small place: crisis effects ("rebels hold some districts"), "the merchant district of X looks prosperous", "built around kin districts", the corpus's DS-DEF-3 district lines | `safetyProfile.js`, `settlementQuickGuide.js`, `npcData.js`, `stepMetadata.js`, `institutionDescColour.js`, `institutionalCatalog.js`; DS-DEF-3 | W2-B-DECLARE (code and data declarations); the corpus rows to W2-WRITE |
| **14b** | 88 / 65 | a disaster's place in a small town ("reshaped the lower districts") | `historyData.js`, `historyDescVariants.js`, `historyGenerator.js`, `historyRouteContext.js`, `narrativeText.js` | W2-B-DECLARE (14's second form, later stage) |
| **8** | 39 / 23 | a church power, its court or its label ("church-guided") with no sacred house | `powerSiblings.js`, `governanceNarrative.js`, the faction label | W2-B-DECLARE (data); `governanceNarrative.js` with W2-A's NEW-1 |
| **NEW-V7** | 34 / 34 | "the current condition: wartime pressure" (a war_pressure condition promoted beside monster pressure) where the war fact reads peace | `conditionWords.js`; the crisis leaf folds no condition | W2-A-LEAVES (the leaf) |
| **14** | 28 / 28 | "… structure urban food supply" in a thorp | `cultureProfiles.js` via `foodGenerator.js` | W2-B-DECLARE (14; `foodGenerator.js` waits for the upkeep lane) |
| **NEW-V4** | 26 / 15 | "Fewer people come to market", "The market still opens", "debating market levies" with no market | `stressTypes.js`, `narrativeText.js`, `powerSiblings.js` | W2-B-DECLARE (data) |
| **NEW-V1** | 21 / 14 | a count of powers the town does not hold ("all three powers will still speak to", "at least three powers", "both powers") | `narrativeText.js`, `stressInstitutionEffects.js`, `powerSiblings.js`, a crisis line | W2-B-DECLARE (data; the count atom waits) |
| **NEW-V3** | 11 / 11 | "a mill standing idle"; the corpus's "the ground gives it, the mill finishes it" with no mill | `narrativeText.js`; DS-ECO-11 | W2-B-DECLARE; the corpus row to W2-WRITE |
| **NEW-V8** | 11 / 11 | "the occupier's local face: no occupying power on the roster" in an occupied town | `crisisCast.js` | W2-A-LEAVES (an occupier leaf) |
| **4** | 6 / 6 | "Three powers stand almost level" over fewer than three | `factionStanding.js` | W2-B-DECLARE (4, later stage) |
| **NEW-V5** | 6 / 6 | "whoever holds the keys, the seals, and the granary" with no granary | `narrativeText.js` | W2-B-DECLARE (data) |
| **NEW-V6** | 5 / 5 | "The vote on the empty seat is in four days" with no succession in force | `conflictIssues.js` | W2-B-DECLARE (data) |
| **NEW-V9** | 2 / 2 | "There is effectively no law enforcement" where a watch or garrison stands | `safetyProfile.js`, `faceHonorifics.js` | W2-B-DECLARE (data) |
| **NEW-V2** | 1 / 1 | "Two temples face each other" over one | an arrival line | W2-B-DECLARE (data) |

`results/findings-shapes.txt` holds all 103 finding shapes with an example seed each; `results/classified-base.json.gz` holds every one of the 6,496 hits with its class.

**Cross-check.** Pattern 20 counts 689 towns here and 689 in the census's own counter (`results/base.counts.txt`, re-taken at this base); the vocabulary reached it without its pattern.

## 3. The 488 pools the mapping did not reach

The rendered page was instrumented (the kernel's `eligibleVariants` and `readStateProse` wrapped in the render, `render.census.jsx`): of the corpus's **856 state pools, 376 were asked for** by some rendered page of the 720 (375 had a line for some town). The other **480**:

| kind | pools | measured how |
|---|---|---|
| campaign world (W) | 234 | outside this release; banked by name with the simulation |
| dark | 60 | blocks in `dossierMounts.js :: UNMOUNTED_BLOCKS` (walker-held, shrink-only), and no other reader: no page of this release reaches them |
| mounted, key not hit on the 720 | 175 | static: every variant's sentences through the same matcher against its own declaration |
| unknown layer, mounted (DS-HK-1) | 11 | static, as above |

**The static measure of the 186 reachable pools: 33 undeclared registered words in 18 pools**, every one read as KEY-IMPLIED (the pool key routes only towns with the thing: "GRANARY: thin", "UNDER OCCUPATION", "Court + Prison"), so none is shown false; each is handed to W2-WRITE to declare (`CORPUS-SHARE.json`, kind "unreached"). The 78 causal-register blocks printed **no line** on any of the 720 owner-view dossiers (`causal.mjs`: 0 of 468 variants found in any dump).

## 4. What goes where

- **The check** → W2-A-LEAVES's page arm, as a member: `vocabularyPageFindings(settlement, views)`.
- **The corpus's share** → W2-WRITE, as data: `probes/W2-B-DECLARE/CORPUS-SHARE.json` (38 rows: 5 printed false on the 720, in DS-DEF-3 and DS-ECO-11; 33 unreached and key-implied).
- **The code-side share** → this lane's item 4, primary lines first; the members in other lanes' files are reported here with their owners.

## 5. Limits

- Attribution to a source file is by the longest static fragment of a literal; an assembled sentence (413 lines) is "unattributed", and a fragment shared by two files may name the wrong one.
- The other-sense classes are a reading, rule by rule; `classify.mjs` holds every rule with its reason, and nothing classed other-sense was dropped from the record.
- The count of houses reads the roster's names with the thing's own words; the count of powers reads `powerStructure.factions` (a count atom waits for a `factsOf` reader, and `factsOf.js` is in the upkeep lane's hands).

## 6. The hand cures' words registered (item 4b), and the list re-taken

Record 288, ruling 2: "EVERY HAND CURE REGISTERS ITS WORDS". Five words joined `registeredWords.js`, each with the leaf it must read: `religiousHouses` (P, the sacred house: pattern 8), `practitioner` (T, `magicPractitioners`: NEW-2 and 3), `onlyJust` (S, the food record's `growsMoreThanEats`: 1a), `smallMargin` (S, its `normalImportPct`: 1b), `almostLevel` (S, the powers' standing: 4). The same 720 dumps, the same matcher, re-classed (`results/classified-base2.json.gz`, `results/findings-shapes-2.txt`):

| measure | before the five words | with them |
|---|---|---|
| findings | 1,569 lines / 710 towns | **2,056 lines / 714 towns** |
| by layer | P 1,224 · S 345 · T 0 | **P 1,298 · S 572 · T 186** |
| by source | corpus 27 · generator pool 261 · generator code 131 · written in code 737 · unattributed 413 | corpus 181 · generator pool 261 · generator code 255 · written in code 737 · unattributed 622 |

**The words reached the census's own numbers with no pattern-specific test:** 1a 57 (census 57), 1b 64 (64), 4 112 (106 by the census's narrower test, which needs the word "Three"), NEW-2 3 (3), 8's income half 74 towns, 3's reliance and desk lines 177 towns.

The corpus's share is re-taken in `CORPUS-SHARE.json` (49 rows): DS-ECO-9 SECURE v3 "is fed, but only just" (57 towns) and v1 "feeds itself with a small margin" (64) — the verdict keyed on the label alone; DS-ECO-12 INCOME WEIGHT, both pools, marked `colour` while their lines presume the religious houses or the practitioners (they want `sacredHouse`, and the practitioner atom, which waits); DS-DEF-9 magicDependency lines presuming practitioners (pattern 3); DS-DEF-3 district lines in small places; DS-ECO-11 "the mill finishes it". DS-ECO-12's first religious-houses variant is matched by its second sentence only where the tier noun is "town"; the page's own counts above include every tier.
