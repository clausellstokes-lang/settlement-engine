# C1'S THREE ANSWERS (CLOSE-7 chain two, phase 1; RULING-R24 R24-C1). By grep, read and record; nothing was built.

Lit tree `d447ee31e`. The machine-readable lists are committed-to-be under `close-7/read25/`: `c1-readers.tsv` (every reader of (b):
file, symbol, line, class, note), `c1-tests.tsv` (every test line of (c), with its title) and `c1-paths.txt` (where the three forms
sit in the born record and in the player's projection, on V and C, from `records.census.jsx`).

## (a) Does a clean form already carry the plain name at the same size?
- **"Town Council": YES, at town** (CONFIRMED by read and record). `rulingStructure.js :: chooseGoverning` seats it from the
  "mayor and council" or "town council" house (`governanceLabelMap`). It also seats it, and not the corrupt one, for a criminal top
  priority of 66 to 72 at a town. On V, 16 towns govern as "Town Council" (C: 49) beside the 18 "Corrupt Council" towns. So the two
  would print alike, which the ruling calls right. Their descriptions differ ("An elected or appointed council governs; …" against
  "The governing body is systematically compromised; …").
- **"City Council": YES, at city** (CONFIRMED). It is the city's clean council, from the same houses and the city fallback. On V, 16
  cities govern as "City Council" (C: 47) beside the 14 "Corrupt City Council" cities.
- **"Senate": NO.** No form at any size is named a plain "Senate" (CONFIRMED by grep of `src`: the only bare `'Senate'` is a keyword in
  `factionCategories.js`'s government list). The metropolis's clean council is **"Grand Council"**. It is the `govBody` the Shadow
  Senate replaces, and it governs 3 V and 41 C metropolises. The other senates are "Grand Merchant Senate" (8 V) and "Arcane Senate"
  (17 V). So "Senate" would print a name that NO clean place prints. "Grand Council" is the form that would print alike. **The words
  are the chair's to rule.**
- **A point for the build (CONFIRMED by read of `domain/seat/seatTable.js`).** At birth each form is held to one size: Corrupt
  Council to town, Corrupt City Council to city, Shadow Senate to metropolis. The seat law's criminal row lets the DM install them by
  event (`CHANGE_RULING_POWER`) across bands: "Corrupt Council" in the SMALL band (thorp, hamlet, village) and at weight 1 in the town
  band, "Corrupt City Council" at weight 2 in the TOWN band and at weight 1 in the large band (city, metropolis). A fixed form → word
  map would then print "Town Council" at a village and "City Council" at a town or a metropolis. A plain name read from the PLACE'S
  SIZE (town → Town Council, city → City Council, metropolis → the chair's word) would not.

## (b) HOW MANY PLACES IN `src/` READ THE STORED NAME: **MANY.**
**The readers** (`powerStructure.government`, `powerStructure.governingName`, the governing faction's `faction` read directly or
through `rulingPower.js :: governingFactionOf` / `cardPowers.js :: governingNameOf` / `viewModel.js :: getGoverningFaction`). I
classed each line by reading it and its function (the class is PLAUSIBLE line by line; the count is CONFIRMED by grep). Not
counted: `rulingStructure.js` itself (the writer), 3 imports, 14 META lines (declarations, block titles, path strings) and 33 helper
calls that read only the row's power, category, id or modifiers.
- **PRINT: 64 lines in 34 files.** The name reaches a printed surface at render or export time: the Power tab ruling chain
  (`PowerTab.jsx`, `powerStrata.js`), the Power, Defense and General prose fills (`powerStateProse.js`, `defenseStateProse.js`,
  `generalStateProse.js` via `generalDeskRead.js`), Daily Life's `{gov}` (`dailyLife.js :: withGovernment`), the quick guide
  (`settlementQuickGuide.js`), the succession and war panels (`EngineSections.jsx`, `WarResolveSection.jsx`, `warResolve.js`,
  `warStatus.js`), the NPC card power line (`npcComponents.jsx`, `cardPowers.js`), the seat keeper's printed office
  (`seatKeeper.js`, `seatKeeperDisplay.js`), `simulationSpine.js :: deriveRuledBy`, the crisis page, the PDF (`viewModel.js`,
  `Cover.jsx`, `IdentityDailyLife.jsx`, `PowerStructure.jsx`), the share image, gallery card and tags (`shareImage.js`,
  `gallery.js`, `ShareToGallery.jsx`), the Foundry export (`journalPages.js`), the world-pulse news lines (`treasuryNews.js`,
  `lineageNews.js`, `lineageClaim.js`, `dispositionNews.js`, `warSeatBooks.js`) and the causal and military contributor reasons
  (`causalState.js`, `militaryStrength.js`). Every printer of ANY faction's name also prints the governing one (the Power tab's
  roster, the PDF `FactionCard`, the Foundry power page), and those do not read the governing fields. They are not in this count.
- **BAKED AT BIRTH: 6 lines in 4 files** (`historyGenerator.js :: buildHistoricalEvent`, `narrativeGenerator.js` ×2,
  `governanceNarrative.js :: migrationEntry`, `rareSecrets.js`). These write the name into OTHER stored strings, and the record shows
  how far that goes. **On V the three forms (39 births) sit in 33 record paths.** In all 39: `powerStructure.government`,
  `governingName`, `factions[].faction`, `npcs[].memberships[].power`, `npcs[].goal.long/short` and `simulationTrace[].causes[].reason`.
  Further: `factionRelationships[].narrative/pair` (38), `conflicts[].desc/parties` (31), `pressureSentence` (18), `factions[].desc`
  (16), `stress(ors).cast.stakes[].factionId` (13), `recentConflict` (7), `npcs[].secret.stakes` (6), `npcs[].allegiance.power` (4),
  `history.currentTensions[].factions` (3), and NPC titles, roles and relationship tensions (1 each). **The player's projection
  (`toPublicSafe(withPublicProse(...))`) carries it in all 39, in 31 paths**, 10 of them composed `publicProse` blocks
  (`overview:identity.governs`, `power:governance.text`, `power:desk.governingTitle`, the legitimacy, succession and stability desk
  sentences). A reader at print time cannot reach a baked string.
- **KEY / COMPARE: 106 lines in 58 files.** These only compare, look up or key on the name, and they must keep the stored name:
  - kind and category inferred FROM THE WORDS: `factionCategories.js :: inferFactionCategory` (criminal by "Corrupt" or "Shadow";
    `factionStanding.js :: seatBoughtOf` reads it), `rulerKind.js` and `rulingBody.js` (`rulerKindOfLabel`, `ruledByBodyOfLabel`,
    also `hookTruth.js`, `rareSecrets.js`, and the goal draw through `_government` in `npcGenerator.js`, `castPowers.js` and
    `representatives.js`), `officeForms.js :: officesOf` (`formKindOf` of the form) and `data/cultureOfficeTitles.js :: officeFamilyOfForm` ("Shadow Senate" →
    underboss), `holderOfSeat.js :: formKindOf`,
    `representatives.js :: seatMintTitleFor`, the religion and military affinities (`religionState.js`, `religionLegitimacy.js`,
    `religiousContest.js`, `militaryStrength.js`, `causalState.js`), `factionArchetype` (`migrationKernel.js`, `disposition.js`),
    `governingModifierWords.js`, `factionStanding.js :: seatIsCouncil`, `governanceNarrative.js` (RELIGIOUS test);
  - identity by EQUALITY: NPC memberships (`m.power === name`: `ties.js`, `castPowers.js`, `goals.js`, `officialsInPay.js`,
    `seatHeld.js`, `hallCapture.js`, `seatKeeper.js`), the seat card's key (`representatives.js`), `allegiance.js`, `patronage.js`,
    `powerSupport.js`, `powerStrata.js`, `realmEntityWeb.js`, `roleClass.js`, `membership.js`, `factionProfile.js`,
    `timeProgression.js`, `rulingPower.js` (lookup and transfer), `cultureDistance.js` (the same overlord), `warSeatBooks.js`,
    `warPoliticalLoop.js`, `warPeaceDecision.js`, `applyWorldPulse.js`, `recordInvariants.js`, `hookEscalation.js` (a clock id),
    the coherence findings;
  - the rename ledger declares both fields KEYS (`factionRename.js :: FACTION_RENAME_SURFACES`: `governingName` "the exact name of the
    faction holding the governing seat", `government` "the government TYPE, which at generation equals the governing name").
- **WRITE: 5 lines in 3 files** (`economyReconciliation.js` re-projects both fields, `rulingPower.js` transfer, `factionRename.js`).

**What follows for the chair's ruling on (b) (facts, not a proposal of mine).** The name is copied at birth into 33 record paths and
keys the faction's category, the ruler's kind, the office family, NPC memberships and the seat card. So:
- **A change of the stored name at birth MOVES BIRTHS.** `inferFactionCategory("Town Council")` is "government", not "criminal". The
  seat's bought-ness (`seatBoughtOf`), the office family, the capture and handler chains and every stored copy would move for the 39
  V births. C has none of the three forms, so C would not move. Such a change needs a marker that the key readers read in place of the
  words.
- **One display reader** placed at the 34 PRINT files (plus the generic faction-name printers) would leave every record, and old
  saves, untouched. It would NOT reach the baked strings: conflicts, relationship narratives, `pressureSentence`, faction descs, NPC
  goals and secrets, and the composed `publicProse` blocks the player's projection carries.

## (c) Every test that pins one of the three strings: 20 files, 64 lines (`read25/c1-tests.tsv`)
- `tests/generators/successionNarrPartyDedup.test.js` (19 lines): "poor-settlement sentence never names the same party twice";
  "… keeps the two-party phrasing when parties differ"; "dedup compares resolved names case-insensitively"; "contested-stability
  sentence collapses to a single party on collision"; "resource-scarcity sentence collapses to a single party on collision"
  (Corrupt Council as a fixture name in composed lines).
- `tests/domain/governanceAccount.test.js` (9): "(b) a vacant seat is the FIRST fact …"; "across seeds the frames vary …"; "a record
  with two estranged powers NAMES them …"; "a vacant seat and an unrecorded one are said plainly …"; "the band reads its own direction
  …" ("Polaovo is governed by the Corrupt Council. …").
- `tests/components/powerGovernanceAccount.test.jsx` (2): `COUNCIL = 'Corrupt Council'` and its vignette, read by the file's tests.
- `tests/domain/seat/seatTable.test.js` (4): the criminal row's forms (file-scope tables); "every weight is a whole number, and the
  transfer's own form leads every band at 2"; "(5) the pair check".
- `tests/domain/facts/rulingBody.test.js` (3): the born vocabulary table (all three).
- `tests/domain/facts/rulerKind.test.js` (1): "reads the born vocabulary (soak1k-0..999) to one kind each" (Shadow Senate → council).
- `tests/data/cultureOfficeTitles.test.js` (1): "the fifty-eight names, each in one family; no name falls through" (Shadow Senate →
  underboss).
- `tests/domain/rulingPower.test.js` (1): "the DM can install criminal rule by event (the coup never offers it)" (Corrupt City Council).
- `tests/domain/powerStateProseDesk.test.js` (2): "a conforming governingName fills {seat}, and the fill obeys the declared shape".
- `tests/domain/religionLegitimacyFactionKey.test.js` (2): "lets a criminal seat drive the compromise chain" (Shadow Senate).
- `tests/domain/display/noOneRingWhereRingsRival.test.js` (3): "the unit: one organisation where a criminal power governs or dominates
  …" (Corrupt City Council, Shadow Senate), plus a header comment.
- `tests/domain/bar6PeopleLaw10.test.js` (4): "POSITIVE CONTROL 10a (C179090): a head whose allegiance names the power he heads fires
  …".
- `tests/generators/captureBirthScale.test.js` (3): "a criminal-flavoured government is classified deliberately, not via
  self-comparison", plus a header comment.
- `tests/generators/people/hallCapture.test.js` (1): "the agent rung: capture …, corrupted (… criminal ruler) …".
- `tests/generators/people/castPowers.test.js` (1): "the ruler is its own kind's first claimant …".
- `tests/generators/power/tailPowers4Batch2.test.js` (2): "TAIL-POWERS-4 · batch 2: the seat's own line …" (`r2r-town-0`: "systematically
  compromised"), plus a header comment.
- `tests/generators/power/seatNamedAsItSits.test.js` (2): a KEEP row of its file-scope table ("council access under a council") and a
  comment.
- COMMENTS ONLY (no pin): `tests/generators/bar8Powers.test.js` (seed comments), `tests/generators/npcStructureBody.test.js` (header).
- A FIXTURE: `tests/fixtures/legacy-saves/people-car-v1-2026-11-07.json` holds all three (Corrupt Council 20, Corrupt City Council 12,
  Shadow Senate 10 occurrences). It is read by `tests/domain/settlementMigrations.test.js`, which makes it the old-save proof any
  load-time reading would answer to. It is not in `.golden-freeze-register.json`.

## For the owner's section 0 (R24-C1 "named for the paused veil")
The ruling's count stands: **39 of the visitor 900** (18 Corrupt Council towns, 14 Corrupt City Council cities, 7 Shadow Senate
metropolises), and the player's projection carries the form in **all 39**, in the paths listed above (CONFIRMED by record).
