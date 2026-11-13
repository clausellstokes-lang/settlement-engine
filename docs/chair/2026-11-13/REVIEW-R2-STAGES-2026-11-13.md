# REVIEW-R2-STAGES — three small stages, read cold (2026-11-13)

The reviewer REVIEW-R2-STAGES, for the chair (session_01FE9mEws7PXYRYdjQPbSX15). I fix nothing and change nothing on the lanes I read. Every figure here is from my own run unless it is marked as a stage's claim. EXECUTED means I ran it and read the output. PLAUSIBLE means read from code or inferred, not run.

| stage | tip read | base | verdict |
|---|---|---|---|
| **A** `lane/r2-code-a-2026-11-13` | 2f114a4c9 | e969a75b7 | **CLEAR** (two LOW findings, two notes) |
| **B** `lane/r2-code-b-2026-11-13` | 80b960171 | e969a75b7 | **NOT CLEAR** (one MEDIUM, one LOW) |
| **C** `lane/w2-c-leaves-2026-11-13` | d79ea4c70 | 4534ea5e3 | **NOT CLEAR** (two HIGH, two MEDIUM, one LOW) |

The cold list (`REVIEW-R2-STAGES-COLD-LIST.md` and `.json`) was committed and pushed at 1d9f7fd4a before any hand-back or commit message of the three lanes was opened. One exception, stated: the first command of this session printed my checkout's HEAD line, which was stage A's last commit subject ("docs(R2-CODE-A): the hand-back at the chair's pause — …"). It carries no claim, and nothing else of A's was read before the push. The probes are in `probes/REVIEW-R2-STAGES/` and their outputs in `probes/REVIEW-R2-STAGES/out/`.

## 1. The cold list (EXECUTED)
- **The towns:** twenty fresh towns of my own seeds (`rr2s-`), born in the app's own configuration shape (`selectedStresses` with `selectedStressesRandom:false`; the Trade Route select's value for the port seeds).
  - Sizes: thorp 3, hamlet 3, village 3, town 4, city 4, metropolis 3.
  - Crises: siege 2, famine 3, plague 3, occupation, indebted, monster pressure, wartime; 5 coastal.
  - Renders: through each tree's own `OutputContainer`, at all five trees (both tips' bases included).
- **The read:** ten cold readers read every distinct line of the five pages, 25,847 in all. They found **1,433 false or broken sentences**. Every one is placed by script on each of the five pages.
- **Per tree:**

  | tree | HIGH | MED | LOW |
  |---|---|---|---|
  | A tip | 180 | 661 | 473 |
  | A/B base | 191 | 665 | 472 |
  | B tip | 129 | 571 | 469 |
  | C tip | 186 | 648 | 470 |
  | C base | 193 | 653 | 470 |

- **What prints at a tip and NOT at its base:**
  - A: 0 high, 1 medium, 2 low.
  - B: none.
  - C: 1 high, 1 medium, 1 low.
- **Gone at the tip:**
  - A: 11 high, 5 medium, 1 low.
  - B: 62 high, 94 medium, 3 low. Most are the machinery chips and count ranges.
  - C: 8 high, 6 medium, 1 low.

## 2. Findings, ranked (each EXECUTED unless marked)

### HIGH
1. **C — the cold list's own HIGH rows #628 and #911 still print false at C's tip, reworded.** EXECUTED: born at d79ea4c70 in the app's shape and read through `resourceGapLines`.
   - rw3-city-infiltrated-1 prints "Work on the animal hides here stops half-way: no leatherworkers' guild finishes it." Its roster holds Tanners, a Cobbler's guild and a Furrier's district.
   - rw3-city-famine-1 prints "Work on the medicinal herbs here stops half-way: no alchemist shop finishes it." Its roster holds an Apothecary district, the house the cold row says finishes the herbs.
   - C's guard `gapLineHousesByKind.test.js` pins "no leatherworkers' guild finishes it" beside Tanners as the correct line.
   - Over the 720: of the 28 half-way lines C rewords, **24 still read false** and 4 read true. The 24 are:
     - 17: "no leatherworkers' guild" beside a Cobbler's guild or a Furrier's district;
     - 3: "no carpenters' guild" beside Carpenters (5-15), in r2r-city-20, r2r-metropolis-43 and r2s-under_siege-metropolis-0;
     - 4: "stops half-way" beside the Apothecary or Alchemist house that finishes the work.
   - C's claim "28 false clauses out" is true of the clause it removed. It does not hold for the sentence that is left: a count falling is not a cure.
2. **C — the new line "Needed, and not brought in: …" names, in about 149 of the 720 towns, goods the town makes itself.** C added this line (item 4b, 48bfc15c0), so by record 303 it is ORIGIN.
   - C matched a need only against IMPORTS (`needMetBy`). It never matched a need against what the town produces.
   - By C's own matcher run against exports, local production and the record's working chains: **174 of the 1,649 needs printed, in 149 towns, are made here.**
   - A read of 30 of them, spread evenly: **29 false, 1 doubtful** (mountain timber beside milled lumber). Examples:
     - r2s-occupied-metropolis-1: "spices", in a town that exports "Rare spices and exotic dyes";
     - r2r-metropolis-33: "iron ore" beside a working iron mine;
     - r2r-city-2: "gold/silver ore" beside its own precious-metal veins;
     - seven towns: "desert salt" in a salt entrepôt.
   - On my births, rr2s-city-calm-rand-1 prints "Needed, and not brought in: spices, clay, mountain timber." while a Spices & Dyes chain runs there and exports.
   - Before C, these goods printed as Imports pills (false too). The new sentence is still false, now in C's own words, and C's brief named exactly this risk ("or that print is the next false line").
   - Probe: `needs-local.mjs`; out: `needs-local.json`.

### MEDIUM
3. **B — the PDF still prints the chain pattern's rank and count range, "Craft guilds (5-15)"** where the roster holds "Craft guilds (100-150+)". This is the fault of B's item 1b (#269 #444), which B claims is "after, 0".
   - The writer is `src/pdf/sections/SupplyChainFlow.jsx :: ChainRow`, which reads `processingInstitutions` raw. A second PDF writer does the same: `src/pdf/sections/EconomicsTrade.jsx`, the PROC row and the flow line.
   - B moved only the PDF's Services chain card (`Services.jsx :: ChainCard`).
   - Example: rr2s-metropolis-calm-rand-1, PDF canon dossier, "Managed woodland (depleted) > Craft guilds (5-15) > Bows and crossbows".
   - B's "after, 0" was counted on the records and the page. It did not look at the PDF, which the brief's law asks of a claim of zero.
   - Count ranges in the PDF text of my 20 towns: 103 at the base, 85 at B's tip. Probe: `machinery.mjs`, `surfaces.census.jsx`.
4. **C — 8 TRUE "No one here works the X" lines are among the 116 C removes.** The cause is two errors in the chain model that record 303 made the home:
   - 4 towns: a Fortifications chain "via Palisade" is read as working a stone quarry (r2r-hamlet-51, r2r-village-56, r2s-succession_void-hamlet-1, r2s-succession_void-hamlet-2).
   - 4 towns: a church at the hot springs (Pilgrimage or Divine Healing) is read as working the medicinal herbs (r2r-village-38, r2r-town-43, r2s-occupied-village-1, r2s-mass_migration-town-2).
   - C named the palisade error itself, as "found, not mine". By the ruling the removal is the law's, so this is not C's code. The true lines are lost all the same, and a ruled leaf is owed its two data cures. Full settlement in §3.

### LOW
5. **B — `tests/lint/proseWiringCensus.walker.test.js` is red at B's tip and green at its base, and B does not declare it.** Two titles fail: "the committed census is byte-identical to a fresh build" and "THE DRY READ".
   - Cause: B's new file `src/domain/display/chainHouses.js` raises the wiring census's `producerIndexFiles` from 1328 to 1329, and `docs/content/wiring-census.json` was not re-taken by its writer.
   - B's hand-back and commits say its governing suites are green; this walker was not in them.
6. **A — the arrival paragraph's later beats re-deal in 31 of the 34 coastal towns whose arrival moves, not only the opener.** A declares this in its hand-back §3 ("the later beats … move in 17 docks and 15 no-docks towns"), so it is a declared move, not a breach.
   - A re-dealt beat can be a stretch: rr2s-village-calm-port-1 (280 people, one fish market) now prints "Each lane of stalls has someone who speaks for it, and they are all speaking at once." (low, a size).
   - The cause, measured: with A's narrativeData.js alone on A's base, the arrival paragraph moves in 34 towns and nothing else moves (`out/fd-A-shore-rows-alone.txt`).
7. **A — the pressure line "Elder Council of Sahlfort promised a fair share of the food reserves last week…"** prints in rr2s-thorp-calm-rand-1, a thorp with no granary and about three days of household stores.
   - At the base it read "grain reserves", also false. The frame presumes reserves; A changed only the word, so this is not A's origin.
   - The same holds for "Has been skimming from the food reserves…" in a hamlet with no common store. A remaining false frame, listed for the corpus or data seat.
8. **C — the imports list under a siege.** The cold list's NEW@C high row #195 is the Imports line of rr2s-hamlet-under_siege-rand-1, reshaped: the base listed seven goods, the tip five plus a needs line. It printed under the siege before C as well. Reshaped, not added: this is not C's origin.

## 3. Every row each stage says it cured

### Stage A (hand-back `R2-CODE-A-HANDBACK.md`, items 1 to 7 and P1)
- **Item 1, the crisis slot: CURED AND TRUE on my births.** "days of legal" became "days of grain" (Nahrhaven: walls and a granary). "transit", "crafts", "timber" and "game" became "grain", in towns whose record keeps a granary. The siege goal reads "Secure enough food reserves", which is true. The field diff shows the 80 frames are reworded, none re-dealt.
- **Item 6, the importer under a siege: CURED AND TRUE.** Evangeeia (siege and famine, no food by trade) now prints "No food comes in by trade now, and what is left here is in a few hands…" under "Hoarded Food".
- **Item 7, the thieves' guild informant: CURED AND TRUE** in rr2s-town-plague_onset-rand-1 ("the local underworld"). A declares 3 minted faces still carrying the guild (for the powers seat).
- **Item 5, the church twin: the reworded twin prints where the old one printed.** The original's three market-town prints are a STOP that A declares.
- **Item 4, the harbour opener: CURED AND TRUE** in my coastal towns with no docks:
  - Lyssosk (a thorp of 7): "…sits with its back to the land and its face to the open water…";
  - Bhagagarh (a village): "The road into Bhagagarh comes down to the sea…".
- **Items 3 and P1(a), the pressure line honours its rows' needs: CURED AND TRUE.**
  - On the 720 the line changes row in 35 towns. In every one the refused row's own need is false of the town (`out/pressure-redeal-A.txt`): gate 6, starving 12, granary 6, healer 5, mill 3, temple 1, market 2, size 1.
  - Doubtful: 2 refused "healers" lines are in towns with an apothecary.
  - The fork census is **green at A's tip** (7 of 7, `generationForkCensus.test.js`, run alone).
- **Item 2, the famine holder: CONFIRMED, 7 named, 5 false and 2 true.**
  - On the 720, 6 towns named a holder; the 7th is the cold list's town (#891, false).
  - True: r2s-famine-town-3 (Arcane Council holds the Town granary) and r2s-famine-metropolis-0 (Royal Authority holds the State granary complex).
  - False: r2r-hamlet-28 and r2s-succession_void-thorp-1 (no granary at all); r2s-famine-village-1 (no granary, and the mill is held by Headman's Authority); r2s-famine-city-0 (Noble Families named, the granaries held by Royal Authority).
  - The two true clauses are lost on the chair's ruling, until the veil lane's cure. A says so.

### Stage B (hand-back `R2-CODE-B-HANDBACK.md`, items 1a, 1b, 2, 3, 4a and 4b)
- **1a, service row machinery: CURED BY SILENCE ON THE PAGE**, with the status pill and "Needs X" left in place, which is true. Over my 20 towns, base to tip:
  - the chain-depth chip, 50 to 0;
  - the "· covers" tail, 3 to 0;
  - a provenance tag as a provider line, 8 to 0.
- **1b, the house label: CURED ON THE PAGE, NOT ON THE PDF.** On the page, NPC card count ranges go from 77 to 0. On the PDF, see finding 3.
- **2, the YOU badge:** no forced row in my 20 towns, so not seen there. The field diff is empty. PLAUSIBLE from code and B's guard.
- **3, the stores span: CURED AND TRUE.** "No granary; about three days in the larder." prints at 0.1 months (two thorps and a village). Months are unchanged at a month or more.
- **4a, Relationships: CURED AND TRUE.** The three cold-list rows are gone, and the line now names only neighbours and ties.
- **4b, the Daily Life tile:** not on the cold list for my towns. PLAUSIBLE from code (it reads the band).
- **Still printing, and declared or not B's:**
  - "Taverns (5-20)" in the Outlook's list (#939). B declares it a STOP: `viability.js` is held by six lanes.
  - "Mills (2-5) · held by …" on the Crisis tab's cast.
  - The Power tab's house lists (40 lines).
  - The Services tab's provider headings (47).
  - The Institutions roster (47).
  - "Gates (if walled)".
  - "Via:major monasteries (5-10)" on Economics.
  None of these is a row B claimed. They are counted so the machinery claim can be read against them: see §6.

### Stage C (hand-back `W2-C-LEAVES-HANDBACK.md`, items 1 to 4b)
- **1, the half-way line by kind: STILL FALSE in 24 of 28,** including the cold list's own #628 and #911 (finding 1).
- **2, "No one here works": the 116 reproduced exactly** (116 lines in 113 towns). My base counts 270 lines where C's counts 272. All 116 are classed by the chain the leaf says works the resource (`gap-why.mjs`, `out/gap-why.json`):

  | class | lines |
  |---|---|
  | FALSE line removed (a cure): a sawmill, carpenter, boatyard, shipyard or bowyer works the timber | 28 |
  | FALSE removed: a tanner or hunters' lodge works the hides | 12 |
  | FALSE removed: herds graze the alpine pasture | 8 |
  | FALSE removed: the hot springs are used | 2 |
  | FALSE removed: wool, camels | 2 |
  | TRUE line lost: only a Fortifications chain via a PALISADE "works" the stone | 4 |
  | TRUE line lost: only a church at the hot springs "works" the herbs | 4 |
  | DOUBTFUL, lean false: households forage the grove or marsh (Foraging via Subsistence farming), or bees | 25 |
  | DOUBTFUL: the stone used only by walls (Fortifications) or a Brickmaker (Stone & Construction) | 22 |
  | DOUBTFUL: hides only where herds are kept or traded, with no tanner | 9 |

  **C's fourteen doubtful lines, settled.** C's doubtful classes are the Foraging, Fortifications, Divine Healing and Pilgrimage chains. On the whole 116 they come to:
  - 25 foraging lines: false by the ruled home, and a reader would accept them (households do gather);
  - 22 lines stay doubtful: walls and brickmakers do not quarry, though walls consume the stone;
  - 8 are TRUE lines lost (finding 4).
  So C's sample of one true line in thirty understates it: by my reading the 116 hold 8 true.
- **3, clerical care: CURED AND TRUE.** All 201 towns that lose "Clerical care" hold only "Access to parish church" or a Wayside shrine, with no cleric on the roster (152 access only, 46 both, 3 shrine only).
- **4a, the famine words: CURED AND TRUE** on my births ("hunger is already here" under a famine). The siege carts: on rr2s-town-under_siege-rand-1, "carts bring in a little of the rest" became "No food comes into Nahrhaven by trade", which is true.
- **4b, the imports pill: the needs are out of Imports,** but the new needs line is false where the town makes the good (finding 2).

## 4. The laws
- **Field diff over the census's 720 births, each base against its tip** (`fielddiff.mjs`, every leaf path; outputs in `out/`):
  - **B: 0 leaf diffs, 0 towns.**
  - **C: 0 leaf diffs, 0 towns.**
  - **A:** 188 towns, in the families A declares and only those: `pressureSentence` 90, `npcs[].secret.what` 74, `arrivalScene` 34, `powerStructure.recentConflict` 26, `economicViability.plotHooks[].hook` and `.category` 14 each, `npcs[].goal.short` 14, `npcs[].secret.stakes` 1. No new key and no gone key. This matches A's hand-back §4 to the town.
- **A's declared draw.**
  - On the 720: 92 port scenes, 48 with docks, all 92 coastal. A counts 96 and 49 over its 740.
  - The opener re-deals in **18** of the 48 docks towns, the figure A gives. Every re-dealt opener is a harbour row needing docks, or a shore row needing the coast, and its town has both, so each is true by its declaration.
  - The 16 coastal towns with no docks all move from a harbour row to a shore row.
  - **Nothing outside the arrival paragraph moves** (A's narrativeData.js alone: 34 towns, the arrival only). Inside it, the later beats move in 31 towns, as A declares.
- **No new key** in the record: none at A, B or C, by the field diff. **No new word in the vocabulary file:** none of the three changes `src/domain/facts/factVocabulary.js`. A uses the existing `docks` and `coast`.

## 5. Plants (one fault per guard)
See §5a below once the run ends.

## 6. The machinery at B's tip, on every surface of my 20 towns
- **Surfaces rendered:** the page as the owner sees it; the PDF (all three variants, walked to their text leaves); the Foundry journal pages (`buildJournalPages`, all three variants); the Tonight sheet (`composeTonightSheet`).
- **Counts, base to B's tip:**

  | form | base | B tip |
  |---|---|---|
  | chain-depth chip | 50 | **0** |
  | "· covers" | 3 | **0** |
  | provenance tag | 8 | **0** |
  | count range on Services | 47 | 47 (the provider headings: the roster's own names) |
  | count range on NPCs | 77 | **0** |
  | count range on Economics | 19 | 1 ("Via:major monasteries (5-10)") |
  | count range on Institutions | 47 | 47 |
  | count range on Power | 40 | 40 |
  | count range on Crisis | 7 | 7 |
  | count range on Outlook | 1 | 1 |
  | "(if walled)" gate | 2 | 2 |
  | count range in the PDF | 103 per variant | 85 |
  | Foundry and Tonight | 0 | 0 |

- **"Twelve of thirteen machinery rows are gone":** true of the page rows B claimed. It is not true of the surfaces: count ranges and a gate still print in the Crisis, Power, Services, Institutions, Outlook and Economics tabs and in the PDF.
- **The exports:** the world export is the record itself. There is no text surface beyond the PDF and Foundry, so it is not measured as a page.

## 7. Gates and governing tests, my own runs
- **Gates at each tip** (strict-domain gate, type ratchet, eslint on the touched files, each through `scripts/gate-tail.sh`): **A 0 / 0 / 0, B 0 / 0 / 0, C 0 / 0 / 0.**
- **A, governing suites** (77 files naming A's modules, plus the fork census): **3 red files.**
  - The three: `generatorGoldenMaster` ("every config produces byte-identical output", 36 configurations), `espionageDormancyFence` ("THE DRIVEN GOLDEN: 360 settlements…") and `rosterFinalUnderHeldRoster` A1.
  - All three are green at the base. They are the golden surfaces, the merge seat's, and A declares them.
  - `pipelinePinnedMode` (run apart) is red 3 at A's tip, A1 / A2 / A5, which A declares. The fork census is green.
- **B, governing suites** (116 files): **1 red file**, `proseWiringCensus.walker` (finding 5). It is green at the base and not declared.
- **C:** see §7a below once the run ends.

## 8. What I did not measure
- The census counter (the second-wave census's counts, base against tip) for any stage, and the whole suite at any tip. None of the three stages ran them either: each paused on the chair's word.
- The page over the 720 for the machinery and the needs line. I measured those on records through each stage's own readers, and the page on my 20 towns only.
- B's YOU badge and the Daily Life tile on generated towns: none of my 20 towns carries the case.
- The golden's 525 configurations: the field diff is over the census's 720 only.
- A render caveat: the "Patron deity" panel prints or not according to load timing. Re-rendered, it printed at both trees, so it was not counted against any stage.
- The hazard: refs and local config were snapshotted around every suite and push. The only changes are my own: my branch, the push's upstream setting, and the `review-fixes-2026-07-08` remote ref I fetched to read ODQ §934.13. `npm ci` set `core.hookspath=.husky/_` in the shared local config; I unset it the same minute, back to the snapshot.
