# THE VETO LIST: points 48 to 70 (branch `lane/landing-pieces-2026-11-18`, read at d1fea7192, working tree clean)

**How this was checked.** I read every row of LANDINGS-SIXTH.md for points 48 to 70, the landing messages, and the hand-backs the rows name. Every quoted page sentence was found by grep in src. Paths are shortened: `src/...` means src/...; hand-backs are under docs/chair/ (`bar8/` = 2026-11-17/bar8/, `faults/` = 2026-11-18/faults/, `last/` = 2026-11-18/last/).

**The checkout.** The branch was read at d1fea7192, which is the docs row of point 71 (LASTCLOSE-DOORS). Point 70's own merge is 8380df4de. Between the two, `src` differs in two files only: `src/domain/facts/tradeAtWork.js` (a comment) and `src/domain/generation/generationForkRegistry.js` (a register row). No wording differs. A line number below is a line at d1fea7192.

**Two notes on the slots.**
- In the desk files (`src/data/dossierStateProse/*.generated.js`) `{settlement}`, `{seat}`, `{good}`, `{house}` and `{resource}` appear exactly as written.
- In code files the slot is code (`${n}`, `${lawRef}`, `${r.name}`). Where I quote such a line I give the source's own text.

**How the list is numbered.**
- **S1 to S47**: a NEW or CHANGED sentence (a new line, a twin, a corrected line, a title).
- **C-items**: an existing sentence that now prints under a new condition, or in a new place. No new words.
- **T-items** (T1 to T9): a sentence taken away.
- **A1 to A62** are new rules; **V1 to V9** new vocabulary; **D1 to D18** earlier decisions overturned; **E1 to E45** rulings; **F1 to F19** LOWs.

**Where the sources disagree, I quote the source tree.** The disagreements are listed at the end (section "SOURCES THAT DISAGREED").

**Points with no new words at all:** 48 (new condition only), 54, 55, 56, 58, 59, 60, 63, 66 (one new line, S32), 67 (one new line, S33), 68, 69. Each has its rules in Part A and its changed prints in the C-items.

---

## PART A · NEW RULES THAT CHANGE WHAT A PAGE PRINTS

**Point 48 · K-WATCH** (hand-back bar8/BAR8-K-WATCH-HANDBACK.md:57-75; ruling BR14 (c))
- **A1 · The watch's service line reads the Legal row's own court** (rule 13a). The Services row "The court sits and the gaol holds, but both are slow, and coin buys a quicker answer." now needs a court that sits on the roster (atom `court sits`) and a gaol. Where no court sits, the row takes its other description. Moves 1 town of the thirty (bar0-town-occupied-rand-47). 0 of the 525. src/generators/services/serviceRollMaterialization.js:96-101.
- **A2 · The "most hours of the day" patrol frame needs the atom `force walks by day`** (rule 13e). Where every force's own text walks the night, the refused frame resolves to another frame of the same pool. 93 of the 525 reference configurations move, all in `economicState.safetyProfile.guardEffectivenessDesc` (BAR8-K-WATCH-HANDBACK.md:94-105). src/generators/safetyProfile.js:426.
- **LEFT, not an A-rule: 15d, the war bar's word.** K-WATCH wrote a reading, found it broke the owner's standing guard (ODQ §934.20), and took it out. See F-section and BAR8-K-WATCH-HANDBACK.md:129-150.

**Point 49 · K-POWERS** (bar8/BAR8-K-POWERS-HANDBACK.md:45-71; rulings BR14 (c), BR15)
- **A3 · 13g.** In a town where the governing seat is itself a criminal power ("Shadow Senate", "Corrupt Council"), the power step no longer writes the even or the military-stronger notes between the guard and the guild. The bribe and payroll notes stand. 5 towns of the 720, 3 of the 150, 1 of the thirty. src/generators/power/factionStanding.js:203, :217, :218 (the three struck sentences; see R2).
- **A4 · 14a.** A rival minted by the density law takes whole the twin of its host's opening line, where the host's description opens with a one-body line (the watch, the siege committee, the war body in its two forms, the black-market network, the occupation's body, the conversion office). The host's own appended lines (its crisis notes, its standing) no longer ride onto the rival. 105 of the 900's rivals. src/generators/density/applyDensityLaw.js:574-590.
- **A5 · 14d.** The Elected Reeve's line keeps "under noble oversight" only where the step seats a noble power or a noble house stands; else its twin (S8). Read again after the roster's trim. 18 towns of the 900; 24 of the 525 rows move. src/generators/power/rulingStructure.js:335.
- **A6 · 15b.** A place with no grazing house, no running pastoral chain and no ground of the land (grass, pasture, field, farm, forest, foraging, hunting) gets a quarrel over the marsh or the shore it has, else over water, in place of the stock quarrel (S9, S10). 12 of the 525 rows move. src/data/powerSiblings.js:75-98.
- Declared moves for the point: 36 of 525 rows (thorp 12, village 24). 13g and 14a move none of the 525.

**Point 57 · K-WATCH-2** (bar8/BAR8-K-WATCH-2-HANDBACK.md; rulings BR29, BR30)
- **A7 · The atom `force walks by day` now reads the one partition of the force** (`orderForceOf(...).houses`: garrison, watch, militia on the live roster). A warden's lodge no longer counts as a force; a household levy or a second garrison now counts (28 towns of the 720 go false to true, none draws the frame). 1 town of the 720 moves (r2r-town-4), 1 of the reader's 1,300 (bar0-town-calm-rand-437). 0 of the 525, 0 of the 180. BAR8-K-WATCH-2-HANDBACK.md:87-157. src/domain/facts/forceHours.js.
- **A8 · The occupation's rival bloc is reworded** (S7; BR30 (2)).
- **A9 · The lawless row's description moves to another file.** Byte-equal: 0 of 180, 0 of 525 (BR29 (1); BAR8-K-WATCH-2-HANDBACK.md:17-46).

**Point 50 · K-PEOPLE** (bar8/BAR8-K-PEOPLE-HANDBACK.md:54-118; rulings BR13, BR14)
- **A10 · 14f · a crisis secret needs a holder who could hold it.** Ten rows of `stressInstitutionEffects.js` carry a holder test (`roles` / `category`, `notRoles`, `keepsHouse`). A drawn row the card fails is refused as a held row is, and the pool's other rows carry the draw. Every crisis pool keeps at least three rows with no holder test. Rows: src/data/stressInstitutionEffects.js:47, :74, :86, :103, :220, :233, :397, :499, :523, :575. 565 cards in 117 towns of the 720 change secret. See C5.
- **A11 · 13b · a held-friend tie line needs a prison.** Three tie lines declare `needs: ['prison']` (C4). 16 towns of the 720; 7 rows of the 525.
- **A12 · 14b · the swap of two houses' handlers is cured; the one-way deal stays.** After the round of the houses' pool, an agent of house A on a face of B and an agent of B on a face of A exchange handlers, only where neither network has any of its own people among its handlers. 22 cards in 11 towns of the 720. The one-way deal (106 networks in 56 towns before; 99 in 52 after) is kept as design. src/domain/people/allegiance.js :: `ownHandlersOfTheSwap`.
- **A13 · 14h · "Win two more people in {power} ..." needs four members** (the person, the one above, two more). 33 cards of the 720 take another goal line; 9 of the 525. src/data/people/goalFamilies.js:195.
- **A14 · 14g · "Emira"** (S11).
- **A15 · 14e (hooks on soldiers) was LEFT here and cured at point 62.**

**Point 58 · PEOPLE-2** (bar8/BAR8-PEOPLE-2-HANDBACK.md:37-95; ruling BR27)
- **A16 · A saved town is never rewritten.** A stored handler that names a card still on the roster is never changed, at the load or at the event. The only change a saved town can meet: the party removed a person who ran agents, and the DM later makes another person corrupt; the agents with no handler then get one from their own criminal house. Source changes: none (tests only). The text is "FOR THE OWNER'S LIST, IN PLAIN WORDS" at BAR8-PEOPLE-2-HANDBACK.md:50-69.

**Point 51 · DESKS-ECO, point 52 · DESKS-DEF, point 59 · DESKS-2** (bar8/BAR8-DESKS-ECO-HANDBACK.md:61-104, BAR8-DESKS-DEF-HANDBACK.md:62-85, BAR8-DESKS-2-HANDBACK.md:162-169; rulings BR14 (c), BR15, BR17 (3), BR28, BR32, BR34, BR35)
- **A17 · Desk lines now declare what they presume.** Each of these lines is refused where its premise is false, and a twin answers where one is given (the twins are S12 to S20):
  - DS-ECO-8 POOR v1 `food: ≥ secure` (12d); POOR v3 `no trade at work: building` (15e); POOR v5 `food: = pressured`.
  - DS-ECO-12 CRITICAL IMPORT v2 declares `critical import brought in` (11c).
  - DS-GEN-3 Import-Dependent v1, v2, v3, v5, v6 declare `food: = importDependent` (v1 and v2 also `no crisis: under_siege`).
  - DS-DEF-4 semi-organized v4 declares `crime: = organized` (13f).
  - DS-DEF-2 full legal chain v1 and v3 declare `court sits` (13a).
  - DS-POW-5 council v1 and v2 declare `seat members` (14c).
  - DS-POW-4 Stable v3 declares `no uprising` (12e).
  - DS-DEF-6 Legal None v1 and DS-POW-5 merchantArmy v1 declare `law: > collapsed`.
  - DS-DEF-2 granary-and-parish v2 and v3 declare `stores: ≥ 3`.
  - The brewer's secret declares `institution: tavern`.
- **A18 · The Defense desk's internal-security row is keyed by the Legal row's own court** (`courtHoldersOf(settlement).length > 0`, the atom `court sits`), not by the town-hall name test. 11 of the 180 towns and 38 of the 720 draw another pool; each prints a line true beside its Legal row. src/domain/display/stateProse/defenseStateProse.js :: `internalRowPoolKey`. (BR32 / DESKS-2 A7.)
- **A19 · "nothing new goes up" is refused where a building house works** (key `trade at work: building`, V4; BR34). POOR falls from three admitted lines to two in 16 towns of the 180 and 42 of the 720; no twin was given.
- **A20 · DS-GEN-3 Import-Dependent v4 is back as it stood at 99ca9ad51** (number 4, `food: ≥ secure`, never admitted). DESKS-ECO had retired it; DESKS-2 restored it (CL19, BR28, BR32). The general desk's health lines are not mounted, so no page moves.
- **A21 · Numbers never move.** CL19: every text that stood keeps its vid; new lines go at the pool's end. Checked over 861 pools: 0 moved, 0 gone; the nine added lines each sit at their pool's end.

**Point 54 · J-INCOME-2** (bar8/BAR8-J-INCOME-HANDBACK.md:9-30, :46-61, :127-260; rulings BR26, BR33)
- **A22 · The income share's ordinary line moves to one leaf both the tab and the PDF read** (`src/domain/display/incomeOrdinaryLines.js`). The leaf reads the live roster through the one filter. Its metal arm asks the live roster for a house that smelts or works metal, else prints no sentence (a ruined forge prints no metal line).
- **A23 · Where every fishery is fished out, the income line says the fish is bought, or says nothing.** `FISH_BOUGHT_LINE` takes the place of the rites line on 13 shares of the 720 and 2 of the thirty. The rites line no longer prints anywhere (T3). Moves `economicState.incomeSources[].desc` in 3 of the thirty, 0 of the 150, 21 of the 720, 36 of the 525.
- **A24 · The need list drops a need that a gap row of kind `imported` answers, or that a live house's printed service row deals in** ("Livestock auction(s)", "Livestock management"), except the failed venture's own material. 10 need lines of the 720 and 10 of the 150 and the thirty together. (The reader's MED 1 on this was cured at point 61, A29.)
- **A25 · The veteran's lodge's card offers "Armed escort" only.** The maker rows of "monster hunting services" and "dungeon clearance" no longer name the lodge: 7 cards of the 720 print "Armed escort" alone (15c).

**Point 55 · PDF-2b** (bar8/BAR8-PDF-2-HANDBACK.md:173-221)
- **A26 · The PDF's head line over a chapter reads the rows' short readings.** "A row marked short is what its house makes when supplied." leaves the PDF's Services and Institutions chapters where the tab no longer prints it (a failed venture's mark alone): 9 towns (T5). 154 towns of the 720 print the line before, 145 after.
- **A27 · The PDF's income row prints the trade's ordinary line through the leaf** (A22): 95 towns of the 720 (108 shares), 16 of the 150, 3 of the thirty.
- **A28 · The journal's chain row reads its own record** (a latent fault; no printed line moves).

**Point 56 · MARKS-2** (bar8/BAR8-MARKS-2-HANDBACK.md:45-61, :92-130; rulings BR16, BR31)
- Marks and words are the page's existing ones. New tables, each vetoable (V8).
- The siege's mark "Curtailed by the siege." now stands on houses whose bought material is cut: the dyer, the furrier's district, the river boatyard and the mint (and their rows) in r2s-under_siege-city-2, r2s-under_siege-metropolis-1 and r2s-under_siege-town-0. src/domain/display/crisisStoppedRow.js:300, :341.
- The war's iron reads only where a war is in force: an occupation alone is peace. The six occupied towns lose "Short of iron." on every surface, lose the war hook, and lose the forges' scene (T6). src/domain/facts/warIronHook.js:24, :35; src/generators/economy/foodBalance.js:826.
- "Short of medicinal herbs." now stands on the alchemist's shop of r2s-religious_conversion-town-2.
- "Salted fish" is written on the imports of three towns' fishmongers.
- The Magic tab's "· supplied by Access to a house of worship" is gone in four besieged towns.

**Point 60 · FAULTS-TOOLS** (faults/FAULTS-TOOLS-HANDBACK.md; rulings FR8, FR10): no page changes. 0 of 525.

**Point 61 · FAULTS-NEED** (faults/FAULTS-NEED-HANDBACK.md:25-140; rulings FR1, FR2, FR13, FR15, FR16)
- **A29 · The need list keeps a need where a live house is marked short of it.** "Needed, and not brought in: salt, livestock." in r2r-village-47 (was "salt"); "Needed, and not brought in: livestock." in bar0-village-calm-rand-29 (was no line). Exactly two need lists of the 900 move.
- **A30 · POOR v1 excludes `need not brought in: any`.** Where the need list holds a need that does not arrive, POOR v1 ("... Every essential is accounted for ...") is refused and the new twin S21 may print. 35 towns of the 900 print S21.
- **A31 · A dependency goal presumes a supply only of a good that is had.** Where a dependency's good is on the need list, the SUPPLY dependency lines are refused; the card takes the family's next admitted line. 1 + 3 + 37 towns' cards move (the thirty, the 150, the 720). 13 of the 525 rows move.

**Point 62 · FAULTS-PEOPLE** (faults/FAULTS-PEOPLE-HANDBACK.md:14-93; rulings FR5, FR6)
- **A32 · 14e.** A soldier's holder's own house (a standing force that hires for no coin) on no trade seat can no longer hold a trade hook. Six economy hooks named true of any holder stay. 21 cards in 20 towns move (the thirty 1, the 150 9 cards in 8 towns, the 720 11).
- **A33 · The fishmonger's welcoming line gives way to its twin where no fish is taken here** (S22).

**Point 63 · FAULTS-BIRTH** (faults/FAULTS-BIRTH-HANDBACK.md:48-141; rulings FR3, FR17, FR21)
- **A34 · The second ring.** A taker whose implied ground is on no stored list (the woodcutter's camp, the shepherd, the fisher's landing, the fishing community, the hunter's lodge, the wildfowler) now tells the supply rule's story (the land has it, or it is used up and idle). 123 takers in 106 towns of the 720: 110 at work on the ground they prove, 13 idle on it used up. No odds change.
- **A35 · The failed venture's pick counts the houses that keep or yield the material.** r2r-hamlet-27 and r2s-politically_fractured-hamlet-0 stop being failed ventures. Ventures over the 720 go from 11 to 9; the odds stay (FR17).
- **A36 · Isolated buyers' used-up grounds are shown** (a reading, stored nowhere): 37 houses in 23 towns of the 720 tell the "used up, bought in" story and the ground appears under Depleted.

**Point 64 · FAULTS-DESKS** (faults/FAULTS-DESKS-HANDBACK.md:18-86, :181-260; rulings FR6, FR7, FR18)
- **A37 · The record-of-crimes lines need `court or gaol`** (V5). Seven lines of four DS-DEF-3 pools (Very Safe v3, v5; Safe v2, v3, v5; Moderate v2; Unsafe v2) are refused where neither a court nor a gaol keeps a record. Rule 13d to zero. Page moves in 2 towns of the thirty, 13 of the 150, 20 of the 720.
- **A38 · The numbering guard is armed** (FR7). A pool's numbers never move; a correction in place only by a `WORD_CORRECTIONS` row naming its ruling. The list ships empty; it now holds two rows (FR18, and LR6's two).
- **A39 · The Unsafe pool's twin** (S23).

**Point 65 · FAULTS-ROWS** (faults/FAULTS-ROWS-HANDBACK.md:34-163, :229-304; rulings FR3, FR4, FR12, FR14, FR20)
- **A40 · The fair, the luxury quarter and the fish market's cards read the need list and the bought fish.** Eight twins (S24 to S31). 42 stored records of the 900 move, each in one house's `desc`. 0 of the 525.
- **A41 · The late re-read resolves the draw-time sibling sets on the final record first** (FR20 (3)). A crisis the dice rolled is now read by the house descriptions. Over the 900: 6 houses move; over 600 fresh births: 19. Every move is one of two kinds: 12 CRISIS TWINS (existing siege or famine twins printed where the crisis is on the final record: the toll bridge, the burial grounds, the annual fair under a siege, the granary under a famine), and 13 CORRECTIONS (a draw-time line the final record refuses). See C-items C20 and C21. 0 of the 525.
- **A42 · The colour marks on two luxury-quarter lines are struck** (FR12 (2)): the marks said "presumes nothing" and were false.
- **A43 · `assembleSettlement` is a declared writer of `institutions`** (FR14 (1)). A register rule, no page change.

**Point 66 · FAULTS-WATCH** (faults/FAULTS-WATCH-HANDBACK.md:44-122, :193-266; rulings FR9, FR19, FR22)
- **A44 · The "(lawless)" crime-type row reads the Legal row's court.** r2r-city-41 (a court sits, a gaol holds) prints the slow-law line instead of "easily outbid". 1 town of the 720.
- **A45 · A gate held is a post, not a round by day; a levy at need walks no round** (FR9). "On the rounds most hours of the day" is refused where the force's text only holds a gate or musters at need. bar0-town-calm-rand-36, -37, -40 and 8 more: 11 towns move. 2 of the 525 rows move.
- **A46 · The true line lost at bar0-city-under_siege+famine-rand-31 is back** (BR30 (3)): a power the power step gave no standing takes the final roster's sentence. 17 towns, 18 descriptions.
- **A47 · The atom `trade at work` reads the siege's stop of a house.** 40 besieged towns' atom readings flip true to false; no printed line moves in any of the 900. 5 house-trade pairs stay unread (F-section).
- **A48 · The Legal row's prison is read live** (`defenceOf(r).prison` over the live roster), not the stamped flag; the desk's internal key follows it. No record of the 900 moves.
- **A49 · The threat assessment reads the court and the prison through the Legal row's function** (FR22 (1)). 49 view-time lines of the 900 (the thirty 3, the 150 8, the 720 38). PDF only (C17).
- **A50 · The Small prison/stocks' "Holding cells" take a twin where no court sits** (S32). 11 of the 900 (stored field). 1 of the 525 rows.
- **DEVIATION, accepted:** DS-GEN-17's key was ruled to read the live prison; measured, its pool already declares the live court and prison, so the file was put back byte-equal to the base (FR22 (2)). See D13.

**Point 67 · FAULTS-WATCH FR25** (faults/FAULTS-WATCH-HANDBACK.md:267-304; rulings FR25, LR3)
- **A51 · Three lines that spoke of a court where none sits now read the Legal row's court** (`court sits` as it reads at the draw): the judge's tie, the magistrate's witness, the power standing "(land, courts, levies)" (twin S33). `relationships[]` in 13 towns of the 900 + 2 fresh; 3 of the 525. Under LR3, in 4 bench towns (a court by a hall's or council's service only) a true tie is passed over, declared.

**Point 68 · FAULTS-BIRTH follow-ups** (faults/FAULTS-BIRTH-HANDBACK.md:276-560; rulings FR21, FR23, FR24)
- **A52 · Wool and hides read their grounds** (hunting grounds give hides; pastures give wool). 44 houses short of hides or wool, each beside a used-up ground of its material.
- **A53 · A river's fishing ground gives no salt.** Six river towns' salt works read local; "desert_salt" is back on their need lists.
- **A54 · An export proves no implied ground** (FR21 (4): measured, then the matcher was removed). r2r-village-2 and r2r-town-34 are spent again by their seed.
- **A55 · The Common grazing land proves its pasture** (FR24 (2), taken over FR21 (2)). 174 newly proven pastures by the seat's count (190 by the second reader's); 139 of the 720 newly print "Open Grazing Land" as proven. 36 of the 525 rows move.
- **A56 · The stored-spent commons read as houses on a spent ground** (FR23 (2)). 13 towns' commons print "Short of livestock." with the existing lines.
- **A57 · A transit pill is passing trade** (FR23 (1)): a test claim; 173 transit pills in 126 towns pass.

**Point 69 · LAST-DECLARE** (last/LAST-DECLARE-HANDBACK.md:22-189; rulings LR1, LR3, LR4, LR5)
- **A58 · Eighteen register rows of presumed-things are retired by declaration** (and the catalogue's two of the same literals). Each line is declared on the fact it presumes, and prints exactly where it printed before: the thirty, the 150, the 720, the 525 and 700 extra besieged births are byte-equal. The two `garrison` rows stay recorded (LR1).
- **A59 · The sawyer's secret "Sells green planks as seasoned ..." is declared on `trade at work: building`** (LR3). 18 towns of the 900 change that card's secret (12 false prints cured; 6 where a true line was passed over, each replacement true of any sawmill). 3 of the 525 rows move. src/data/people/titleSecretsPresentations.js:375, :2321.
- **A60 · `impairedUnderSiege` reads the chain state the card shows** (LR5). 4 towns' `dyed cloth` atom flips true to false to equal the card (bar0-city-under_siege+famine-rand-28, -31, -38 and r2r-village-55); 0 printed lines change in the 900. In 2 of the 700 fresh besieged births the arrival scene's arcane line takes its twin.

**Point 70 · LAST-VARIETY** (last/LAST-VARIETY-HANDBACK.md:22-65, :66-123, :150-198; rulings LR2, LR6)
- **A61 · Every town of the four DS-DEF-3 pools Moderate, Safe, Very Safe, Unsafe now admits at least three lines** (before: 105 of 259, 21 of 46, 10 of 33, 3 of 16 Moderate/Safe/Very Safe/Unsafe towns short of three). Ten new lines (S34 to S43). The page moves in 4 of the thirty, 27 of the 150, 67 of the 720.
- **A62 · The SUPPLY goal family has a fourth sub-kind, `want`, dealt only where the need list says a good is needed and not brought in** (S44 to S47). 82 cards in 41 towns move (the thirty 1, the 150 3, the 720 37); 13 of the 525 rows. The {resource} slot names only the goods the page's own need list prints (0 of 560 candidates name another).

---

## PART B · EVERY NEW OR CHANGED SENTENCE, POINT BY POINT

### Point 48 · K-WATCH (rulings BR14 (c))
No new sentence. The seat's own word: "NO NEW TEXT. Every line a reader now sees in a changed place already printed elsewhere" (BAR8-K-WATCH-HANDBACK.md:90-92). The changes are C1 and C2.

### Point 49 · K-POWERS (rulings BR14 (c), BR15). Source: bar8/BAR8-K-POWERS-HANDBACK.md:87-110. "All twins say what is true where the line was false."
Counts below are "towns (of the 750 and the 150 at the tip)", as the hand-back's table header says.

**S1.** **"A second armed company that wants a share of keeping order here, and of the say that goes with it."**
- Old: the host's whole description (the watch's, the standing army's), copied onto the minted rival.
- Declaration: a rival minted where the host's description opens with "City watch; " / "Town watch; " or "Standing army with genuine political weight;".
- Where: the Power tab, the PDF's power chapter and the journal's Power page (`powerStructure.factions[].desc`). 66 towns: r2r-city-0, r2r-city-6, r2r-city-7.
- Kind: TWIN. src/generators/density/applyDensityLaw.js:574 (the constant); the table is :577-590.

**S2.** **"A rival criminal network that wants a share of the black market and its takings, and contests them with the established one."**
- Host opening: "Organised criminal network controls the black market and several informal revenue streams;". 18 towns: r2r-city-5, r2r-city-26, r2r-city-50.
- Kind: TWIN. src/generators/density/applyDensityLaw.js:585.

**S3.** **"A rival bloc that wants a say over rationing, conscription and defence spending, and disputes the emergency committee's hold on them."**
- Host opening: "Emergency committee with authority over rationing, conscription, and defence spending;". 9 towns: r2s-under_siege-city-2, r2s-under_siege-city-3, r2s-under_siege-metropolis-1.
- Kind: TWIN. src/generators/density/applyDensityLaw.js:579.

**S4.** **"A rival bloc that wants a say over requisition, conscription and prices, and disputes the emergency body's powers over them."**
- Host opening: "(Crown-appointed emergency|Emergency) body with powers over requisition, conscription, and price controls." 8 towns: r2s-wartime-city-3, bar0-city-wartime-rand-47, bar0-city-wartime-rand-28.
- Kind: TWIN. src/generators/density/applyDensityLaw.js:583.

**S5.** **"A rival bloc that wants a say over supply, conscription and the army's contracts, and disputes the emergency body's hold on them."**
- Host opening: "(Crown-appointed emergency|Emergency) body coordinating supply, conscription, and military contracting." 1 town: r2s-wartime-metropolis-3 (the only war council with that host line).
- Kind: TWIN. src/generators/density/applyDensityLaw.js:581.

**S6.** **"A rival body that wants a say in enforcing the conversion order, and disputes who should decide who complies."**
- Host opening: "External or crown-appointed body with authority to verify compliance with the conversion order." 1 town: r2s-religious_conversion-city-3.
- Kind: TWIN. src/generators/density/applyDensityLaw.js:589.

**S7.** **"A rival bloc that wants a say over the decisions made here, and disputes the outside administration's hold on them."** (the occupation twin; REWORDED at point 57 by BR30 (2), VETOABLE by name)
- Old (point 49): "A second body sent in from outside, which claims a share of the say over every decision made here." The old words are no longer in src (see T1).
- Host opening: "External administrative body; all significant decisions require approval or reversal."
- Where: r2s-occupied-city-0 (The Shield Compact), r2s-occupied-metropolis-3 (The Garrison Bloc): the same two towns as the old words. No third town of the populations.
- Kind: REWORDED TWIN. src/generators/density/applyDensityLaw.js:587. Source: bar8/BAR8-K-WATCH-2-HANDBACK.md:71-86.

**S8.** **"One of the peasantry, elected by the rest, manages labour and mediates disputes, and answers to the people who chose them."**
- Old: "A reeve elected from the peasantry manages labour and mediates disputes under noble oversight." (src/generators/power/rulingStructure.js:335; still prints where a noble is seated).
- Declaration: the Elected Reeve's line where no noble power is seated and no noble house stands.
- Where: 18 towns: r2r-village-17, r2r-village-30, r2r-village-45 (the 720: 8 of 8 villages with this seat printed "noble oversight" with no noble on the record). 24 of the 525 rows.
- Kind: TWIN. src/data/powerSiblings.js:156.

**S9.** **"A dispute over rights on the shore and access to water has run for two seasons, and those on each side of it no longer speak to one another."** and the same with "the marsh" in place of "the shore".
- Old: the stock quarrel (grazing), false where the place holds no grazing.
- Where: the shore form in 3 towns: r2s-infiltrated-thorp-1, r2s-infiltrated-thorp-2, bar0-thorp-calm-rand-47. The marsh form in 1: r2r-thorp-3. `powerStructure.recentConflict`.
- Kind: TWIN (one template; the ground is read off the place). src/data/powerSiblings.js:75-77 (the grounds), :96 (the template).

**S10.** **"A dispute over water access has run for two seasons, and those on each side of it no longer speak to one another."**
- Where: 2 towns: r2r-thorp-53, bar0-thorp-calm-rand-30.
- Kind: TWIN (no marsh or shore named). src/data/powerSiblings.js:97.

### Point 50 · K-PEOPLE (rulings BR13, BR14)
**S11.** **Title "Emira"**
- Old: "Emir" for any holder of Arabic "the lord". Now `[{ male: "Emir", female: "Emira" }]`. The other one-word office titles (Sheikh, Wali, Imam, Qaid) keep one form.
- Where: r2s-under_siege-metropolis-2, r2s-wartime-city-0, r2s-wartime-metropolis-0 (the 720); bar0-town-calm-rand-47 (the thirty, C36170). Rule 14g to zero (3 towns, 4 instances before).
- Kind: TITLE. src/data/faceHonorifics.js:293. Source: bar8/BAR8-K-PEOPLE-HANDBACK.md:95-100.

### Point 51 · DESKS-ECO (rulings BR14 (c), BR17 (3), BR28). Source: bar8/BAR8-DESKS-ECO-HANDBACK.md:61-104.
**S12.** **"Some of {settlement}'s work needs more {good} than the country around it gives, and none of it is brought in."** (DS-ECO-12 CRITICAL IMPORT v4)
- Declared `[visitor · no crisis: under_siege · no critical import brought in]`.
- Where: 2 of the thirty, 8 of the 150, 24 of the 720 at DESKS-ECO's tip (bar0-city-wartime-rand-47 (copper ore), bar0-village-calm-rand-47 (livestock), r2r-city-0). The counts were not restated after the rewording.
- CORRECTED BEFORE LANDING by BR35 (1) (DESKS-2's "After the second reader", bar8/BAR8-DESKS-2-HANDBACK.md:254-261). The words DESKS-ECO wrote and the chair gave by name were "needs {good} that the country around it does not give"; they are not in src. The hand-back's table (:70) still quotes the old words.
- Kind: NEW TWIN. src/data/dossierStateProse/economy.generated.js:6747.

**S13.** **"{settlement} pays for what it must and nothing beyond, and it does not raise all the food it eats."** (DS-ECO-8 POOR v5)
- Declared `[ledger · crisis: any · food: = pressured]` (DESKS-ECO wrote `food: ≤ pressured`; BR28 (5), A5 of DESKS-2, narrowed it).
- Where: DESKS-ECO measured 4 of the 150 and 14 of the 720 (bar0-city-wartime-rand-31, bar0-hamlet-calm-rand-31, r2r-hamlet-42); DESKS-2 reports it in 4 towns of the 180 and 5 of the 720 as the line that takes the slot where v3 is refused. NOT GIVEN BY NAME to the seat: written under R7 (no pool under three lines); striking it leaves POOR at two lines in those towns.
- Kind: NEW TWIN. src/data/dossierStateProse/economy.generated.js:2789.

**S14.** **"{settlement} does not grow enough to eat, and nothing comes in to make up the rest."** (DS-GEN-3 Import-Dependent v7)
- Declared `[ledger · crisis: any · food: = deficit]`. NOT GIVEN BY NAME.
- Where: none of the populations (admitted in r2s-wartime-thorp-3 and bar0-hamlet-under_siege-rand-34; the food row draws elsewhere there). The general desk's health lines are not mounted.
- Kind: NEW TWIN. src/data/dossierStateProse/general.generated.js:3657.

### Point 52 · DESKS-DEF (rulings BR14 (c), BR15, BR32). Source: bar8/BAR8-DESKS-DEF-HANDBACK.md:62-85.
**S15.** **"At {settlement} the town's business goes to the {seat}, and everybody has learned how long the answer takes."** (DS-POW-5 council v6)
- Declared `[street · no ruler: lord · no seat members]`. The BR15 twin for a seat of one: the earlier lines said "goes to the whole {seat}".
- Where: 0 of the thirty, 9 of the 150, 49 of the 720 (r2r-hamlet-28, r2r-thorp-12, bar0-hamlet-calm-rand-36). Rule 14c: 3, 6, 45 instances before; 0, 0, 0 after.
- Kind: TWIN. src/data/dossierStateProse/power.generated.js:2238.

**S16.** **"No one boss runs the crime at {settlement}: whoever works a route keeps it, and nobody stands over them all."** (DS-DEF-4 semi-organized v7)
- Declared `[unfolding · tier: ≥ village · no rival rings · crime: ≤ semi-organized]`. The old line "has no rival, and no crew is contesting" under "lacks a single controlling authority" is refused where the crime is organized.
- Where: 2 of the thirty, 4 of the 150, 24 of the 720 (bar0-city-wartime-rand-45, bar0-city-under_siege+famine-rand-46, r2r-city-27).
- Kind: TWIN. src/data/dossierStateProse/defense.generated.js:4339.

**S17.** **"{settlement} has nowhere to try a wrong and nowhere to hold anyone, so no complaint is ever written down, and order holds nowhere for long."** (DS-DEF-6 Legal None v4)
- Declared `[ledger · law: = collapsed]`.
- Where: none of the populations (the guard's constructed record).
- Kind: TWIN (of Legal None v1, now declared `law: > collapsed`). src/data/dossierStateProse/defense.generated.js:6259.

**S18.** **"The trading houses at {settlement} pay for their own armed guards, a private army that guards the houses' business and little else. Where the houses' men and the {seat} disagree, the houses' men usually win."** (DS-POW-5 merchantArmy v3; LEFT-LINES's words)
- Declared `[ledger · no crisis: occupied · law: = collapsed]`.
- Where: none of the populations.
- Kind: TWIN (of merchantArmy v1, "... a private army that keeps order wherever the houses do business", power.generated.js:2691, now declared `law: > collapsed`). src/data/dossierStateProse/power.generated.js:2717.

**S19.** **"The town has a little grain put by, not enough for a bad year. What it does about sickness is pray and nurse, in that order."** (DS-DEF-2 granary-and-parish v5)
- Declared `[street · stores: < 3]`.
- Where: none (the Defense tab draws no disaster row, by the owner's word).
- Kind: TWIN (of v2, now declared `stores: ≥ 3`). src/data/dossierStateProse/defense.generated.js:2004.

**S20.** **"You find a grain store at {settlement} that is far from full, and for the sick only a small infirmary."** (DS-DEF-2 granary-and-parish v6)
- Declared `[visitor · stores: < 3]`.
- Where: none.
- Kind: TWIN (of v3). src/data/dossierStateProse/defense.generated.js:2013.

### Point 61 · FAULTS-NEED (rulings FR1, FR2, FR13, FR15, FR16). Source: faults/FAULTS-NEED-HANDBACK.md:167-177.
**S21.** **"{settlement} feeds itself and has nothing to spare. Some of what its work needs does not reach it, and there is no line for anything else."** (DS-ECO-8 POOR v6)
- Declared `[ledger · crisis: any · food: ≥ secure · need not brought in: any]` (the twin given by name under the chair's amendment of 06:55 UTC; v1 declares `no need not brought in: any`).
- Where: 35 towns of the 900; r2r-hamlet-21 (stone, salt), r2s-religious_conversion-town-3 (stone, copper ore, gold and silver ore), bar0-town-occupied-rand-27 (copper ore, gold and silver ore).
- Kind: NEW TWIN. src/data/dossierStateProse/economy.generated.js:2802.

### Point 62 · FAULTS-PEOPLE (rulings FR5, FR6). Source: faults/FAULTS-PEOPLE-HANDBACK.md:109-124.
**S22.** **"Talks about the price of fish, where any can be had and who has been in today; a good ear for news."**
- Old: "Talks about the boats, the catch and who has been in today; a good ear for market news." (src/data/people/titleSecretsPresentations.js:140; still prints where fish is taken here). The twin drops "the boats", "the catch" and "market news" (the last so the presumed-things door banks no fresh `market` line).
- Declaration: the twin prints where `trade at work: fish taken here` is false. The master fishmonger's welcoming row, in the row's own slot (no fourth row, no draw).
- Where: 7 of the 720 and 3 of the thirty (r2r-town-29, r2r-metropolis-28, bar0-town-occupied-rand-45; also r2r-metropolis-45, r2r-metropolis-58, r2s-recently_betrayed-city-2, r2s-monster_pressure-city-3, r2s-slave_revolt-town-0, bar0-metropolis-calm-rand-45, bar0-village-calm-rand-47); 48 of the 525 configurations. Two more towns after point 66 (bar0-city-under_siege+famine-rand-45, r2s-under_siege-town-0), true there.
- Kind: TWIN. src/data/people/titleSecretsPresentations.js:2391.

### Point 64 · FAULTS-DESKS (rulings FR6, FR7, FR18). Source: faults/FAULTS-DESKS-HANDBACK.md:181-260.
**S23.** **"{settlement} has no court and no gaol. Custom and neighbours answer what they can, and the rest goes unanswered."** (DS-DEF-3 Unsafe v4)
- Declared `[ledger · no court or gaol · no watch]`, vantage `ledger`.
- First words (the chair's, 09:11 UTC): "Wrongs at {settlement} are piling up ... nobody here holds an offender or hears a case." They were contradicted on each town's own page and CORRECTED IN PLACE by FR18 (1) (row `{ pool: 'DS-DEF-3 :: Unsafe', vid: 4, ..., ruling: 'FR18' }`). The first words are not in src.
- Where: bar0-hamlet-calm-rand-27 (Gangapur), bar0-hamlet-calm-rand-29 (Skálgarde), r2r-thorp-30 (Obergasse), the only three towns of the 900 whose Unsafe pool admits it. At point 70 the pool gained v5 to v7, and v4 now prints in NO town of the 900 (admitted, out-drawn).
- Kind: NEW TWIN. src/data/dossierStateProse/defense.generated.js:3071.

### Point 65 · FAULTS-ROWS (rulings FR3, FR4, FR12, FR14, FR20). Source: faults/FAULTS-ROWS-HANDBACK.md:135-148. Each twin is a LATE SET, resolved draw-free on the final record. All print on the house's Institutions tab, its card and the PDF. File: src/data/institutionDescVariants.js.

**S24.** **"A yearly fair for regional merchants. The luxuries the town wants do not reach it."** (Annual fair; twin of "Regional merchants. Luxury goods available.")
- Declared `needs: need not brought in: luxury`, `excludes: crisis: under_siege`. Where: bar0-town-calm-rand-45, r2r-town-56, r2r-town-57 (6 towns of the 720 and 1 of the thirty). :2431.

**S25.** **"A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them."** (twin of "Merchants from across the region, and luxuries to be had.")
- Where: r2r-town-10, r2s-monster_pressure-town-3, r2s-wartime-town-2. :2435.

**S26.** **"A yearly draw for regional traders, though the fine goods the town wants do not reach it."** (twin of "A yearly draw for regional traders, with fine goods on offer."; the fair's third line, FR12 (1))
- Where: bar0-town-calm-rand-46, bar0-town-occupied-rand-35, r2r-town-47 (3 of the thirty, 1 of the 150, 4 of the 720). :2442.

**S27.** **"Fine goods of every kind, though the spice or silk the town wants never arrives."** (Luxury goods quarter; twin of "Silks, spices, and other precious goods."; "the city" / "the metropolis" is spoken by the tier noun)
- Declared: the twin declares nothing (it is true wherever either good is unmet); the original excludes `need not brought in: spice` and `silk`. Where: bar0-city-under_siege+famine-rand-29, r2r-city-17, r2r-metropolis-18 (1 of the 150, 16 of the 720). The gold and silver ore towns STAND (the mint's want, not the quarter's wares). :2451.

**S28.** **"Fine things are traded here, though the spice or silk the town wants does not reach it."** (twin of "The trade in silk, spice, and precious things.")
- Where: bar0-city-wartime-rand-28, r2r-city-29, r2r-metropolis-4 (2 of the 150, 7 of the 720). First written "The trade in fine things, though ..." and changed in d581e6d15. :2455.

**S29.** **"Salted and dried fish is sold here, from an open stall or under a small roof. No fresh catch comes in."** (Fish market; twin of "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.")
- Declared `needs: fish bought in` (V6); the original `excludes: fish bought in`. Where: bar0-village-calm-rand-47 (its one town of the populations; its market's row is "Preserved fish"). The live fishery r2r-village-2 keeps the original. :2464.

**S30.** **"An open-air stall or small covered market where salted and dried fish is sold. No fresh catch is landed here."** (FR20 (2); twin of the catalogue line "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait.")
- Where: r2r-village-11 (the 720; beside "Preserved fish"). :2471.

**S31.** **"An open stall or small roofed market for salted and dried fish, brought in from elsewhere. The catch is no longer landed here."** (FR20 (2); twin of pool line #0 "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.")
- Where: no town of the populations at the seat's measure (idle r2r-village-45 keeps the original). :2475.
- The doors name three fresh lines ("market") in S29, S30, S31's words; each is the Fish market's own card, true by construction, banked at the last close (FR20).

### Point 66 · FAULTS-WATCH (rulings FR9, FR19, FR22). Source: faults/FAULTS-WATCH-HANDBACK.md:193-266.
**S32.** **"Short-term detention until a fine is paid."** (the Small prison/stocks' "Holding cells" row; FR22 (3), the chair's own words)
- Old: "Short-term detention pending trial or payment of fines." (src/data/institutionServices.js:1686), kept where a court or a bench sits.
- Declared: no court sits (the lawless row's mechanism: `courtHoldersOf({ institutions, availableServices })`). Label kept.
- Where: the Services tab and the PDF's Institutions, in exactly the 11 of the 900 whose Legal row reads "Prison only": r2r-town-5, r2r-town-15, bar0-town-calm-rand-30 (the thirty 2, the 150 1, the 720 8). 1 of the 525. The row prints in 31 of the 900: twin in 11, original in 20.
- Kind: NEW LINE (stored field). src/generators/servicesGenerator.js:33 (the constant), :373 (the swap).

### Point 67 · FAULTS-WATCH FR25. Source: faults/FAULTS-WATCH-HANDBACK.md:267-304.
**S33.** **"... keeps enough rights of its own (land, levies) to bargain, not simply obey."** (the power standing; twin of "... (land, courts, levies) ...")
- Declared: the roster has no court (`courtSits === false`); the chair's wording rule: "courts" struck and nothing else changed. A caller with no roster keeps the original.
- Where: r2s-plague_onset-town-0; fresh r2r-town-225, r2r-town-231 (`powerStructure.factionRelationships[].narrative`).
- Kind: TWIN. src/generators/factionDynamics.js:641.

### Point 70 · LAST-VARIETY (rulings LR2, LR6). Source: last/LAST-VARIETY-HANDBACK.md:22-65, :150-198. All ten lines print on the Defense tab's public-order rung and its PDF copy, alike on the record, `toPublicSafe` and the share veil. File: src/data/dossierStateProse/defense.generated.js, each at its pool's end.
Moves: the page changes in 4 of the thirty, 27 of the 150, 67 of the 720; each moves TO one of these ten (no town moves between old lines).

**S34.** **"What trouble {settlement} sees is mostly quarrels, and they seldom outlast the week."** (Very Safe v6; `street · tier ≤ village · no crime wave · crisis: any · no crisis: threat, unrest`)
- Where: bar0-village-calm-rand-36 (Onongol), r2r-hamlet-11 (Riparipa), r2r-hamlet-41 (Keshigbulag); 5 in all. :2783.

**S35.** **"{settlement} has no watch; its neighbours notice anything out of place, and are quick to say so."** (Very Safe v7; `ledger · no watch · crisis: any · no crisis: threat, unrest`)
- Where: r2r-village-8 (Khandavan), r2r-village-49 (Yaxchtzal); admitted, not drawn: r2r-village-6, -14. :2796.

**S36.** **"{settlement} has no gaol, and has so far had little use for one."** (Safe v6; `ledger · no prison · crisis: any · no crisis: threat, unrest`)
- Where: bar0-town-calm-rand-29 (Neadgill), bar0-town-calm-rand-31 (Zelenosk), bar0-hamlet-calm-rand-32 (Raskot), r2r-town-4 (Jayagiri); 12 in all. :2877.

**S37.** **"Visitors to {settlement} see nobody keeping watch, and come to no harm all the same."** (Safe v7; `visitor · no guardPresence · no crime wave · crisis: any · no crisis: threat, unrest`; `no crime wave` added by LR6 (3), words unchanged)
- Where: r2r-thorp-28 (Zelenoev), r2s-infiltrated-village-2 (Bayarserai), r2r-thorp-5009 (a fresh town); no longer bar0-thorp-calm-rand-28 ("Crime is on the rise."). :2891.

**S38.** **"At {settlement}, people who never used to bar their doors at night have started to."** (Safe v8, new at LR6 (3); `street · tier ≤ village · crime wave · crisis: any · no crisis: threat, unrest`)
- Where: bar0-thorp-calm-rand-28 (Jalalbash), r2r-village-5004 (a fresh town). :2905.

**S39.** **"At {settlement} old wrongs are remembered for years, and some are still being argued over."** (Moderate v9, CORRECTED IN PLACE by LR6 (1); `street · tier ≤ village`)
- First words: "Whatever trouble {settlement} has is soon known to everyone in it." VETOED by the chair's ruling LR6 (1) because it said what the neighbouring "everyone soon hears of" line already says; and an earlier draft "Most days ... pass without trouble" was false beside a crime wave. The first words are not in src.
- Where: bar0-village-calm-rand-46 (Tihono), bar0-thorp-calm-rand-31 (Madinatqila), bar0-village-calm-rand-35 (Qaryahdarya); 66 towns of the 1,500 (the first words: 34 of the 900). :3013.

**S40.** **"With no gaol at {settlement}, nobody who does wrong here can be locked away; most go on living beside the people they wronged."** (Moderate v10; `ledger · no court or gaol`)
- Where: bar0-thorp-calm-rand-45 (Dunwood), bar0-hamlet-calm-rand-45 (Ravenland), r2r-town-45 (Varanand); 39 in all. :3024.

**S41.** **"Theft at {settlement} grows each season, and with nobody under arms, every household guards its own."** (Unsafe v5; `street · no guardPresence · crime wave`)
- Where: bar0-hamlet-calm-rand-29 (Skálgarde); admitted, not drawn: bar0-hamlet-calm-rand-27, r2r-thorp-30. :3083.

**S42.** **"Neighbours at {settlement} have begun to suspect one another, and few will lend a tool or a coin now."** (Unsafe v6, CORRECTED IN PLACE by LR6 (2); `street · tier ≤ village`)
- First words: "There is no watch at {settlement}, and visitors are warned to keep their belongings close." (declared `visitor · no watch`). VETOED by LR6 (2). The first words are not in src.
- Where: bar0-hamlet-calm-rand-27 (Gangapur), r2r-thorp-30 (Obergasse), r2r-village-5023 (a fresh town). :3094.

**S43.** **"{settlement} calls its people out against raiders and beasts, but nobody is called out over a theft."** (Unsafe v7, new at LR6 (4); `street · militia · no watch`)
- Where: r2r-thorp-5005 (Dongcheng), the only levied, watchless Unsafe town of the 1,500; none of the 900. Its thought was chosen against its guard line ("The militia cannot maintain consistent coverage. They have other jobs to do."). :3106.

**S44 to S47. The four SUPPLY `want` lines** (goal family SUPPLY, new sub-kind `want`, LR2; dealt only where the need list says the good is needed and not brought in). Printed on the NPCs tab, the summary, the PDF and the journal (the card's goal). File: src/data/people/goalFamilies.js:500-513.
- **S44.** **"Find something the work at {house} can use in place of {resource}."** (short; "a substitute tried") :505. Dealt on bar0-city-wartime-rand-45 (Klara Weber, the citadel), bar0-city-wartime-rand-31 (Banbh Farrell, the banking houses), r2r-town-3 (Erin Lynch, the docks).
- **S45.** **"Gather what {resource} can be found close to home for the work at {house}."** (short; "a supply sought at home") :506. Dealt on bar0-hamlet-under_siege-rand-39 (Khongorzul Ongut), r2r-metropolis-18 (Katla Finsson), r2r-metropolis-50 (Lasair Brennan).
- **S46.** **"Open a lasting way to bring {resource} in for the work at {house}."** (long; "a supplier sought") :509. Dealt on r2r-hamlet-56 (Yuri Petrov), r2r-village-8 (Rashid Besud), r2r-town-9 (Grettir Kolbeinsson).
- **S47.** **"Win those who govern here over to bringing {resource} in for the work at {house}."** (long; "the grievance, carried to whoever should bring it") :510. Dealt on bar0-town-occupied-rand-40 (Varun Mukherjee), r2s-insurgency-metropolis-2 (Michail Xiphilinos), r2s-slave_revolt-metropolis-0 (Solveig Jokullsson).
- Counts: 82 cards in 41 towns move (goal.short 35, goal.long 74, goal.intent 56); 13 of the 525 rows. 140 cards over the 900 and the 600 fresh hold `want` candidates; none names a good the page's need list does not print. The slot is filled by `needNotBroughtIn.js :: goodsNeededNotBroughtIn` (LR6 (5)): "in place of stone." (not "stone and iron and grain") at bar0-city-wartime-rand-45.

---

### EXISTING SENTENCES NOW PRINTING UNDER A NEW CONDITION OR IN A NEW PLACE (no new words)

**Points 48, 57, 66 (the watch and the law)**
- **C1.** "The court sits and the gaol holds, but both are slow, and coin buys a quicker answer." now needs `court sits` and a gaol (src/generators/services/serviceRollMaterialization.js:96). Where no court sits: "The law here is slow and easily outbid. Disputes end with whoever can apply more violence or pay more for protection." (:85). bar0-town-occupied-rand-47 (the thirty) takes the second; at point 66 r2r-city-41 (a court and a gaol stand) takes the first on its "(lawless)" row.
- **C2.** The patrol frame "You will see the {lawRef} on the rounds most hours of the day; they catch the careless and miss the careful." (src/generators/safetyProfile.js:1020) needs `force walks by day`. Where refused, the pool's other three frames print: "The {lawRef} maintains standard patrol coverage. Effective against opportunistic crime; less effective against organized operations that can plan around patrol routes." (:1015), "... walks the usual rounds. That stops a pickpocket or a brawl; anyone who has learned the rounds can work between them." (:1018), "... patrols on a regular round, so petty theft is often caught and planned crime seldom is." (:1019). Towns: bar0-village-calm-rand-46, bar0-town-calm-rand-31, bar0-town-calm-rand-41 (point 48); bar0-town-calm-rand-36, -37, -40 (the gate is no round by day: point 66, FR9); r2r-town-4 and bar0-town-calm-rand-437 (point 57: a warden no longer counts).
- **C3.** The threat-assessment lines (point 66, FR19 and FR22) (PDF Defense & Security only), src/domain/display/threatAssessment.js:347-353:
  - "Arrest, trial and gaol all work here." leaves 11 towns for "People are locked up without trial." (Legal row "Prison only"): r2r-town-5, -15, -25, bar0-town-calm-rand-46 and 7 more.
  - "Cases are heard here, but there is almost nowhere to hold anyone." leaves 38 towns for "No court and no gaol; order rests on whoever is armed." (Legal row "None").
  - In 15 of the 49 towns the desk's own "{settlement} keeps no court and no gaol ..." now agrees with the page.

**Points 50, 58 (people)**
- **C4.** The three held-friend tie lines declare `needs: ['prison']` (src/data/people/handlerTieLines.js):
  - :210 "One of ${r.name}'s old crewmates has been taken by the ${f.body} and may talk to save their own neck. ${s.name} could get the prisoner out if ${r.name} asks, and ${r.name} knows what asking will cost."
  - :226 "An old friend of ${r.name}'s is held by the ${f.body}, and ${s.name} is the one who keeps that friend fed and safe inside. ${r.name} pays for it in favours."
  - :236 "The friend has fallen ill inside. ${s.name} says a physician can be sent in, once ${r.name} has done what ${s.name} asked last month."
  - Each archetype keeps 3 of its 4 lines in every town. Rule 13b.gaol: the thirty 1 town (1 instance), the 150 2 towns (3), the 720 5 towns (5), each to zero.
- **C5.** Ten crisis-secret rows carry a holder test (rows listed under A10): the sortie (PEOPLE-2 quotes it as "Authorised an illegal sortie..."; now kept by a watch commander or captain: r2r-metropolis-14, r2s-under_siege-town-1, -2), surrender terms ("Secretly negotiating surrender terms with the besieging force, without the council's knowledge": a head, a commander or an envoy; r2r-metropolis-14, r2s-under_siege-thorp-0, r2s-under_siege-hamlet-2; src/data/stressInstitutionEffects.js:46), the emergency stores (kept by the eldest householder, the granary reeve or the chief magistrate; r2r-thorp-17, r2s-famine-town-1, r2s-famine-city-2), and seven more rows. The secret sentences themselves are not changed (the hand-back writes no new text; I did not grep the sortie and stores sentences one by one). 565 secrets in 117 towns of the 720 move (174 presentations); 14f.sortie, stores and surrender to 0. The supplies row takes `keepsHouse: true` and refuses no holder.
- **C6.** "Win two more people in {power} over to their side before {above} notices." (src/data/people/goalFamilies.js:209) needs four members of the power (:195). 14h 29 to 0 in the 720.

**Points 51, 52, 59 (desks)**
- **C7.** Desk lines now declared (see A17) and what prints in their place; the lines quoted are existing ones:
  - 13a: "A thing done wrong at {settlement} goes somewhere and takes time, ..." (DS-DEF-2 full chain v2, defense.generated.js:1304) is drawn beside "Prison only / Detention without process." in 10 towns at DESKS-DEF; DESKS-2's A7 cures it by changing the pool key (A18): 8 of the 720, 2 of the thirty and 1 of the 150 draw "{X} can hold people and has no settled way of deciding whether it should ..." (5), "{X} locks people up with no court to say why ..." (3) or "At {X} people can be locked up without a trial ..." (3).
  - POOR v3 "... the old buildings are patched ... nothing new goes up" is refused where a building house works (A19) and the slot prints v4 ("Money is short in {X}, and most households spend what they earn as soon as it comes in."), v5 (S13) or v1 ("... covers what it must and nothing beyond. Every essential is accounted for ..."). 10 towns of the 180, 17 of the 720.
  - Brewer's secret: with no tavern-kind house the brewer takes "Buys up grain that was meant for bread ..." (r2r-village-16, r2s-insurgency-village-0).
  - The DS-GEN-3 Import-Dependent and DS-POW-5 / DS-POW-4 lines: existing lines newly drawn where a declared line is refused: council v3 "watches the town's temper closely", v5 "has left obvious decisions untaken"; Stable v2; semi-organized v1, v2.
- **C8.** DS-POW-4 Stable v3 (the line "nobody ... stands ready to lead them") is refused in 7 towns that hold a live popular uprising (V2).

**Points 54, 55, 56 (income, PDF, marks)**
- **C9.** "The fishery here is fished out; the fish sold now is salted and bought in." (FISH_BOUGHT_LINE, src/generators/economy/incomeLineSiblings.js:66) prints in place of the rites line on 13 shares of the 720 and 2 of the thirty: bar0-metropolis-calm-rand-45, bar0-city-wartime-rand-47, r2r-city-35 (also r2r-metropolis-21, r2s-wartime-city-1). The PDF's Economics section prints it too.
- **C10.** The ordinary income lines in the PDF in place of the stored short twin: "Metal is smelted or worked here." in place of "Little metal is worked here while the metal trade is short of what it needs." (r2r-town-8, r2r-town-16, bar0-metropolis-calm-rand-45); "Cloth is woven or finished here." in place of "Little cloth is made here while the cloth trade is short of what it needs." (r2r-town-20).
- **C11.** The need line loses a good the page deals in: "Needed, and not brought in: copper ore." (r2r-metropolis-12; was "livestock for meat and draft, copper ore."); r2s-under_siege-city-2 loses "iron ore"; r2r-village-47 loses "livestock" (point 54), then regains it by A29 (point 61).
- **C12.** "Outputs Armed escort" on the escort chain card through a veteran's lodge: r2r-town-45, r2r-town-50, bar0-town-calm-rand-47; the PDF's "Veteran's lodge » Armed escort".
- **C13.** "Curtailed by the siege." (and "Short of medicinal herbs." on the alchemist's shop of r2s-religious_conversion-town-2, tab, Services row and PDF); "Salted fish" on three towns' imports: r2r-village-36, r2s-indebted-village-2, r2s-religious_conversion-village-0. The arrival scene follows: 1 of the 720 (r2s-religious_conversion-town-2: "Little spellwork is done ... for want of the stuff it takes"), 1 of the 150 (bar0-town-occupied-rand-27) and 1 of the thirty (bar0-town-occupied-rand-46: the forges' quiet scene gives way to the pool's other line).

**Points 61, 62 (need list, hooks)**
- **C14.** "Needed, and not brought in: salt, livestock." (r2r-village-47) and "Needed, and not brought in: livestock." (bar0-village-calm-rand-29) newly print, beside the Shepherd's "Livestock management" chip.
- **C15.** Fourteen-e hook replacements (21 cards): every replacement is an existing line of the card's own military or title pool, for example "A recruit they turned away has since joined a different outfit.", "Three guards have gone missing ...", "They signed for supplies that never arrived, ...", "One of their best people has asked to be released, ...", "The pay chest came up short again ...".

**Points 63, 68 (the supply rule's leftovers)**
- **C16.** Lines that already printed for a mine now print for more houses:
  - "The <house> is worked out: its own ground is depleted (Open grazing land)." (9 towns: bar0-hamlet-under_siege-rand-47, r2r-hamlet-56, r2r-village-32), "(Hunting grounds)." (5), "(Managed woodland)." (4).
  - "Short of livestock.", "Short of timber.", "Short of game.", "Curtailed by the siege. Short of livestock.", "Stopped by the siege. Short of game." on the houses of those grounds.
  - Proven grounds on the land list: "Fishing Grounds" (57 towns), "Hunting Grounds" (27), "Managed Woodland" (23), "Open Grazing Land" (15 at point 63; 174 more at point 68 by the seat's count, 190 by the reader's).
  - "Depleted: ..." and "The nearby ... is used up." for river clay (12), managed woodland (11), glass sand (9), iron deposits (7), open grazing land (9), hunting grounds (6), vineyards (6).
  - One priority note: "Military focus highlights gap: timber processing is incomplete, strategic vulnerability." in r2r-village-20.
  - "Shared pasture ..." cards print "Short of livestock." and "The common grazing land is worked out: its own ground is depleted (Open grazing land)." in 13 stored-spent commons (point 68).
  - The arrival scene's twin "Little cloth is made here, and the cloth that is sold was brought in from elsewhere." in r2s-occupied-metropolis-2.
- **C17.** GONE: "The dairy farmer is failing: no livestock lies near and none is brought in." and the "Failing: a failed venture." marks (r2r-hamlet-27 and r2s-politically_fractured-hamlet-0).

**Points 64, 65 (desks, rows)**
- **C18.** At point 64, in the public-order slot of 35 towns (the thirty 2, the 150 13, the 720 20) the record-of-crimes line "The {tier}'s record of crimes at X ..." gives way to another line of the same pool: Moderate v7 "X has people who keep order, and order holds about as well as anyone here expects.", Moderate v3 "Visitors to X are told which few streets to avoid, ...", Safe v1 "Crime at X stays small: ...", Safe v4 "Visitors feel safe at X, and it is plain that somebody keeps it that way.", Very Safe v2 "You can walk X at any hour ...". Safe v5 and Very Safe v5 (the no-guard record lines) now print in no town of the 900.
- **C19.** At point 65, 12 CRISIS TWINS printed where the final record carries the crisis: the Toll bridge, the Burial grounds and charnel house and the Annual fair under an emergent siege (r2r-metropolis-14 at the 900; four fresh towns), and the Town granary under a famine. Seen over 600 fresh births: no besieged town keeps the non-siege original of a set that holds a siege twin (the base had 8).
- **C20.** At point 65, 13 CORRECTIONS (a draw-time line the final record refuses): the city's Mercenary quarter ("Organized sellsword companies. Major forces (hundreds to thousands)." to "Organized sellsword companies. Real forces, a few score to a few hundred blades apiece." (:2025)) in 9 towns (bar0-city-under_siege+famine-rand-28, -30, bar0-city-wartime-rand-29, -35, r2s-under_siege-city-1 and 4 fresh); an inland fish market; woodland kilns in a desert ("Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had: ..." in place of "Kiln crews in the surrounding woodland ..."); a Customs house with no docks ("... entering and leaving by the main roads." in place of "... via the port or main roads."). The reader found and the seat names, as LOW: the pass corrects ANY draw-time line its final record refuses (r2r-city-4089's Pawnbroker).

**Points 67, 69 (court, declared rows)**
- **C21.** The judge's tie and the magistrate's witness, now declared on `court sits` (src/data/npcData.js:2360, :1852): "${s.name} has been appointed to judge a case in which ${r.name} is a party." and "${r.name} has a witness willing to name ${s.name} before a magistrate. ${s.name} knows where the witness lives." They no longer print where no court sits (8 + 4 + 1 towns of the 900).
- **C22.** The sawyer's secret "Sells green planks as seasoned and the buildings made from them warp within a year" (src/data/people/titleSecretsPresentations.js:375) is refused where no building house works (A59). The card takes another sawyer secret; every one of the 6 where a true line was passed over now holds "A sawyer's boy lost an arm at the blade, and the family was paid to say it happened somewhere else" (:377): bar0-city-wartime-rand-28, r2r-city-22, r2s-indebted-town-0, r2s-recently_betrayed-city-2, r2s-succession_void-town-3, r2s-monster_pressure-city-2.
- **C23.** Eighteen register rows are declared (A58), each printing exactly where it printed. Listed in last/LAST-DECLARE-HANDBACK.md:24-45: the free company hall's and the hiring office's siege twins (`mercenary`), the bowyers' twins (`guardPresence`), the cathedral lines (`church`, `population: ≥ middling`), the garrison chaplain and the settlement's chaplain, "The streets are unusually quiet." (twin "The place is unusually quiet."), the roadside origin row (`excludes: crisis: under_siege`), and " A court and a prison stand, but few offenders ..." (`needs: prison`; 11 towns).

### Lines taken away (T-items)
- **T1.** **"A second body sent in from outside, which claims a share of the say over every decision made here."** The occupation's rival bloc (point 49), retired by point 57 for S7. 2 towns. Not in src.
- **T2.** 13g, three sentences struck where the governing seat is criminal, with no twin (src/generators/power/factionStanding.js):
  - :203 "They are roughly even with the military: the ${force.body} can arrest their people, and the guild can make every investigation costly."
  - :217 "They are stronger than the guild, enough to keep it down but not to stamp it out."
  - :218 "A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken."
  - 5 towns of the 720 (10 instances), 3 of the 150, 1 of the thirty.
- **T3.** **"The waters here are worked thin; rites keep the catch coming, and it is landed and sold here ..."** (FISH_RITES_LINE, src/generators/economy/incomeLineSiblings.js:69). It no longer prints anywhere (21 of the 720, 3 of the thirty before); no writer returns it. The text stays declared there: a DEAD LINE, named for the close's list, not deleted. BR33.
- **T4.** DS-GEN-3 Import-Dependent v4 "{settlement} eats well, but on food grown elsewhere; if the carts stop, so do the meals." (general.generated.js:3617): retired by DESKS-ECO at point 51, restored by DESKS-2 at point 59. Net: stands, never admitted (declares `food: ≥ secure`). No printed line moves.
- **T5.** The head line "A row marked short is what its house makes when supplied." leaves the PDF's Services and Institutions chapters in 9 towns (r2r-hamlet-26, r2r-hamlet-48, r2r-hamlet-57, r2r-town-13, r2r-town-18, r2s-under_siege-city-1, r2s-politically_fractured-hamlet-0, r2s-infiltrated-town-1, r2s-wartime-city-3), where a failed venture's mark is the only mark.
- **T6.** In the six occupied towns of the three populations: every "Short of iron." (page, PDF, journal; 43 in the 720's two towns, 13 in the thirty's), the forges' scene, and the war hook "War has taken the iron ..." (one plot hook fewer; "3 plot hooks available" reads "2"): r2s-occupied-city-1, r2s-occupied-town-3, bar0-town-occupied-rand-27, -31, -35, -46.
- **T7.** 14e: the trade hooks on 21 soldiers' cards (C15). 13b: the held-friend lines in towns with no prison (C4).
- **T8.** The Magic tab's "· supplied by Access to a house of worship" in r2s-under_siege-thorp-1, -thorp-2, -hamlet-2 and bar0-hamlet-under_siege-rand-47 (the reliance line still prints).
- **T9.** The first wordings that never reached the landed tree (the seat's branch only): CRITICAL IMPORT v4 "... that the country around it does not give, ..."; Unsafe v4 "Wrongs at {settlement} are piling up ..."; Moderate v9 "Whatever trouble {settlement} has is soon known to everyone in it."; Unsafe v6 "There is no watch at {settlement}, and visitors are warned to keep their belongings close.". None is in src.

---

## PART C · NEW VOCABULARY (facts a sentence may ask for)

- **V1 · `force walks by day`** (point 48, ruling BR14 (c); reworked at point 57, BR29 (2)). True where some live order-keeping house in the partition (garrison, watch, militia of the Defense tab's "Standing forces") is not kept to the night by its own description; false where every such house is night-only or none stands; unanswered with no roster. A gate is held by day for the atom at point 48; at point 66 FR9 made a gate a post, not a round, and a levy at need walks no round. src/domain/facts/factVocabulary.js:366; reader src/domain/facts/forceHours.js; getter src/domain/facts/factsOf.js:121; layer row src/domain/facts/factLayers.js:108.
- **V2 · `uprising`** (point 52, BR14 (c)). A live `popular_uprising` tension of the history. True in 7 towns of DESKS-DEF's populations. src/domain/facts/factVocabulary.js:414; reader src/domain/facts/uprising.js.
- **V3 · `critical import brought in`** (point 51, BR14 (c) / BR17 (3)). The leaf is a second home of the desk's reading (the desk's row cannot be imported); its guard holds it equal. src/domain/facts/factVocabulary.js:503; reader src/domain/facts/criticalImportBroughtIn.js.
- **V4 · `trade at work: building`** (point 59, BR34). The houses, by catalogue id: `carpenter_part_time`, `carpenter`, `carpenters_5_15`, `thatcher`, `golem_workforce`, and `brickmaker` (IN BY NAME, vetoable: its own card says "Talks about who is building what and where; knows every new wall going up."; striking it leaves 15e at 1 in the thirty, bar0-town-occupied-rand-47). False where none stands or every one is short. src/domain/facts/tradeAtWork.js:235 (BUILDING_HOUSE_IDS), :238, :261; src/domain/facts/factVocabulary.js:397.
- **V5 · `need not brought in: <key>`** (point 61, FR2). Keys: `luxury`, `spice`, `silk`, `precious`, `salt`, `fuel`, `livestock`, `any`. Held equal to the page's need list on 900 of 900 towns. The leaf imports `LUXURY_CLASS` and `NOT_A_GOOD` (FR13) and sends luxury items through the kernel's door as the page does (FR15). src/domain/facts/factVocabulary.js:508; reader src/domain/facts/needNotBroughtIn.js:173.
- **V6 · `court or gaol`** (point 64, FR6). True where a court sits or a gaol stands, read from the Legal row's own two readers on the LIVE roster. Equal to the Legal row (anything but "None") on 30 of 30, 150 of 150, 720 of 720. src/domain/facts/factVocabulary.js:298; getter src/domain/facts/factsOf.js:98.
- **V7 · `fish bought in`** (point 65, FR4, FR12 (3)). True where the fish ground is used up AND the imports hold its shortage word. It is the fish swap's one fact (point 53's swap reads it too). Over the 900: 36 fish-market towns bought, 307 not. src/domain/facts/factVocabulary.js:404; reader src/domain/facts/fishBoughtIn.js.
- **V8 · New tables and readings of MARKS-2, each vetoable** (point 56, "no new vocabulary atom, no new twin"; bar8/BAR8-MARKS-2-HANDBACK.md:121-130): new rows in `INPUT_IMPORTED_AS` (the dyer, the furrier's district, the river boatyard, the mint and the official mint; a value of several words matches any one), src/data/crisisDependence.js:1579; `HOUSE_NEED_INPUT`'s `alchemist_shop: 'herbs'`, src/data/crisisDependence.js:1636; the shipyard's `FIELD_WORK` in `HOUSE_DEPENDENCE` (:81, :1058 shows the same kind of row); `crisisStoppedRow.js :: boughtByNameOnly`, `ownTradeChainOf` (:300, :341); `warIronHook.js :: ironWarState`, `OCCUPATION_TYPES` (:24, :35); `resourceGenerator.js :: importWordsOfImportedGaps` (:825).
- **V9 · New goal cell and holder keys.** The SUPPLY goal family's `want` sub-kind with slots `resource`, `house` (point 70, LR2; src/data/people/goalFamilies.js:500-513); the holder keys on the crisis rows (point 50: `HEAD_WORDS`, `NOT_HEAD`, `COMMAND_HOLDER`, `SIGNS_HOLDER`, `keepsHouse`; src/data/stressInstitutionEffects.js:33-39); the minimum-members table `GOAL_LINE_MIN_MEMBERS` (src/data/people/goalFamilies.js:195); the late-set declarations `DESC_LATE_SIBLINGS` (src/data/institutionDescVariants.js) and `ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER` (src/data/npcData.js:2608; six economy hooks true of any holder); the numbering guard's `WORD_CORRECTIONS` list (scripts/generate-dossier-state-prose.mjs).
- Points with "NEW VOCABULARY: none": 54, 55, 58, 60, 62 (the twin uses the existing `trade at work: fish taken here`), 63, 66 (BR/FR22: `court or gaol` was not yet on its base; the arm reads its two halves), 67 ("No new vocabulary: `court sits` already existed"), 68, 69, 70 (no atom; the `want` cell is data).

---

## PART D · EARLIER DECISIONS OVERTURNED OR RETIRED IN POINTS 48 TO 70

1. **D1 · The occupation twin's first words** (BR14 (a) / K-POWERS, point 49) are retired by BR30 (2) at point 57: "A second body sent in from outside, ..." to S7.
2. **D2 · BAR7-ECON item 4's KEEP of C7539** (ruling CY1; the shipyard's "Ship construction" row unmarked under a siege, "the shipyard builds from its own timber") is OVERTURNED by MARKS-2 under BR31: the yard is "Curtailed by the siege.", so the stopped harbour chain's "Normally yields" names the row again. Test re-written with a dated note (bar8/BAR8-MARKS-2-HANDBACK.md:112-117). For the owner's veto list.
3. **D3 · The war's iron under an occupation** (the earlier reading: any war state, an occupation included, reads "at war"): overturned by BR16. An occupation alone is peace. Three older tests of `bar7EconTab` re-keyed. The hook's writer followed under BR31.
4. **D4 · FS1 (a)** of BAR4-CORPUS-ECO ("where the rites hold the chain up, the rites line prints in place of 'bought in'") is RETIRED by BR33. FS1 (b), the KEEP, stays. The test is re-written to the claim that now holds (bar8/BAR8-J-INCOME-HANDBACK.md:177-190).
5. **D5 · DS-GEN-3 Import-Dependent v4:** retired at point 51 (DESKS-ECO), restored exactly at point 59 (BR28, BR32, CL19). Net none.
6. **D6 · DS-ECO-12 CRITICAL IMPORT v4's words:** the chair's words (BR17 (3), "given by name") corrected by BR35 (1) before landing (S12).
7. **D7 · POOR v5's declaration** `food: ≤ pressured` narrowed to `food: = pressured` (BR28 (5), DESKS-2 A5).
8. **D8 · The Unsafe twin's first words** (the chair's, 09:11 UTC) overturned by FR18 (S23): contradicted on their own page in all three towns.
9. **D9 · Moderate v9 and Unsafe v6** (the seat's first words) overturned by LR6 (S39, S42).
10. **D10 · FR13 reversed the first luxury keys** (bbe7b490c) of FAULTS-NEED: the leaf now imports `LUXURY_CLASS` and `NOT_A_GOOD`. FR15 then sent every item through the kernel's door as the page does.
11. **D11 · FAULTS-NEED item 3** (a need leaves the list where an arriving import names its good under its other word): measured, NOT built: the rule would drop 49 spice needs beside "Luxury goods" and no livestock need; the STOP test stands.
12. **D12 · FR21 (4), the export rule:** built, measured, then REMOVED ("an implied ground is on no stored list, so by the page's own reader no export can prove one"). r2r-village-2 and r2r-town-34 are spent again by their seed.
13. **D13 · FR22 (2): DS-GEN-17's key ruled to read the live prison.** Measured; found its pool already declares the live court and prison on every variant. The file is the base's again; "A DEVIATION FOR THE CHAIR'S VETO", accepted (faults/FAULTS-WATCH-HANDBACK.md:226-237).
14. **D14 · FR21 (2) (the common keeps the pasture unspent) replaced by FR24 (2) (the common PROVES its pasture):** the first reading left the Fuller short with no story (r2r-village-23); the second gives one story. Moves wide: 36 of the 525 rows.
15. **D15 · FR20 widened FR3's late set** (the draw-time siblings are now resolved on the final record first, FR20 (3)): the chair's "reader's one late-siege town became the class cure" (LANDINGS-SIXTH.md row 65).
16. **D16 · K-WATCH's 15d reading TAKEN OUT** (point 48): it broke ODQ §934.20's guard (a label read off the roster beside an unchanged bar length). `defenseDisplay.js` stays byte-equal to the base.
17. **D17 · J-ROWS's first build of the fish swap** was overturned at point 53 by BR24 (outside these points). Points 62 and 65 read the swap's facts instead: `trade at work: fish taken here` (point 62) and `fish bought in` (point 65, V7).
18. **D18 · The owner's band for the failed venture** ("10 to 20 of the 720", `supplyStoryLaw` L5) is now breached: 9 of the 720. FR17: the odds STAY (3 in 60), the floor is re-recorded 10 to 9 at the last close; "4 of 60 would likely restore the band; that is his to say" (faults/FAULTS-BIRTH-HANDBACK.md:113-116).
- **For the owner's list from D2, D3, D13, D16, D18**; all others are the seats' or the chair's corrections.

---

## PART E · THE RULINGS THE OWNER MAY VETO, BY NAME

- **E1 · BR13** (swap of two houses' handlers): the swap is cured, the one-way deal stays as design. Pages: 11 swap towns of the 720 change two cards' handler.
- **E2 · BR14** (14a/14b/14d/14e/14g/(c)): (a) the holder test; (b) the female form "Emira" only (no Sheikh, Wali, Imam or Qaid form); (c) vocabulary atoms named by the chair. Pages: S11, A10, and V1 to V3.
- **E3 · BR15**: twins "goes to the {seat}" (S15) and the no-grazing quarrel (S9, S10); the one-member seat's twin; a minted rival's own description (S1 to S7).
- **E4 · BR16**: an occupation alone is peace: no "Short of iron." and no war hook (T6).
- **E5 · BR17 (3)**: the critical-import twin and atom (S12, V3). BR17 (2) (the fair's twin) was written at FR3, FR12.
- **E6 · BR26** (the owner's own word "Move the entries"): five register rows moved by hand to the leaf's key. No page change.
- **E7 · BR27**: (1) re-key two stale anchors by identity; (2) the leftover two-way pairs; the owner's plain-words line (A16): a saved town is never rewritten.
- **E8 · BR28**: (1) the atom `critical import brought in` (V3); (5) DS-ECO-8 POOR v5 (S13) and DS-GEN-3 Import-Dependent v7 (S14), neither given by name to the seat.
- **E9 · BR29**: (1) the lawless row moves file (A9); (2) the atom `force walks by day` reads the one partition (A7); (4) a gate held at night read as a day's round: "THE OWNER'S QUESTION AT THE CLOSE", answered by FR9 at point 66 (the gate is a post, not a round: C2).
- **E10 · BR30**: (1) re-anchor `standingAgainstFigure` (b); (2) the occupation twin reworded by name (S7); (3) the true line lost at rand-31 (A46).
- **E11 · BR31**: MARKS-2's three questions: the hook's writer follows BR16; the net; `boughtByNameOnly` reaches no older row. The KEEP of C7539 overturned (D2). The alchemist's need (V8).
- **E12 · BR32**: DESKS-2's DS-DEF-2 internal key and the each-family debt; the 14c twin.
- **E13 · BR33**: (1) FS1 (a) retired (D4); (2) the live roster, the metal arm asks it (A22).
- **E14 · BR34**: the key `trade at work: building` with the brickmaker IN BY NAME (V4; vetoable). R7 breaches named: POOR at two lines in 16 + 42 towns, no twin given.
- **E15 · BR35**: (1) CRITICAL IMPORT v4 words corrected by name (S12); (b) `corpusEcoTailGuards` re-keyed.
- **E16 · FR1 / FR2 / FR13 / FR15 / FR16** (FAULTS-NEED): the need list keeps a short need (A29); the atom `need not brought in` (V5); the leaf imports the home's tables (D10); the luxury pool through its door; the strip banked by hand at the last close.
- **E17 · FR3**: the fair's and the quarter's lines read the need list (S24 to S28); the failed venture's pick (A35).
- **E18 · FR4**: the fish market's card on the bought fish (S29, V7).
- **E19 · FR5**: the fishmonger's twin (S22).
- **E20 · FR6**: the atom `court or gaol` (V6); a person's hook true of the holder (A32).
- **E21 · FR7**: the numbering guard armed (A38): a pool's numbers never move.
- **E22 · FR8 / FR10**: the checking tools repaired (point 60). No page change. FR8 also names the second ring, the venture's pick, the isolated buyers (A34 to A36).
- **E23 · FR9**: a gate is a post and a levy at need walks no round (A45).
- **E24 · FR12**: (1) the fair's third line (S26); (2) the quarter's two lines and their colour marks struck (A42); (3) the fish swap's one fact (V7).
- **E25 · FR14**: `assembleSettlement`'s `mutates` gains `institutions` (A43); the goods roster's row for `fishBoughtIn.js`.
- **E26 · FR17**: the failed-venture odds stay (3 in 60); the floor 10 re-recorded to 9 at the last close; "the owner told" (D18).
- **E27 · FR18**: Unsafe v4's words (S23); the numbering guard's four wrong-row messages.
- **E28 · FR19**: the threat assessment reads the court and the prison through the Legal row's function (A49, C3).
- **E29 · FR20**: the fish card's two siblings; the late re-read resolves the draw-time sets on the final record (A41, C19, C20).
- **E30 · FR21**: wool and hides read their grounds; a river's fishing ground gives no salt; an export proves no implied ground (D12); the common keeps its pasture (replaced by FR24 (2)); the ventures counted first.
- **E31 · FR22**: (1) the threat line as built; (2) DS-GEN-17 deviation accepted (D13); (3) the holding cells' twin (S32); (4) NAMED: "Court officers, ... overlap." (cultureProfiles.js:421, 6 of the 49) and "Commercial disputes resolved outside the courts" (3).
- **E32 · FR23**: the transit pill is passing trade; the stored-spent commons (A56, A57); the NAMED r2r-town-34 hunters' lodge and four wool refusals.
- **E33 · FR24**: (1) FAULTS-NEED's item 0 re-keyed; (2) the common proves its pasture (A55); (3) r2r-hamlet-53: no change.
- **E34 · FR25**: the court's lines outside the seat's files (A51, S33, C21).
- **E35 · LR1**: two `garrison` rows (743cc96b, b50dee27) stay recorded, by the owner's "record the four".
- **E36 · LR2**: the `want` cell granted (S44 to S47).
- **E37 · LR3**: the sawyer's secret landed as is, with proof first (A59); in four bench towns a true tie is passed over (A51).
- **E38 · LR4**: the older tests re-keyed by identity at the declare round.
- **E39 · LR5**: `impairedUnderSiege` reads the shown chain state, the rule moved whole into `tradeAtWork.js` (A60).
- **E40 · LR6**: the second reader's five MEDs (S39, S42, S37, S38, S43; the `want` slot).
- **E41 · CL19** (the chair's law of 04:15 UTC): numbers never move in a pool (A21).
- **E42 · CL26 / CL9 / CL14 / CL18** are the close's and the register's; they change no page here.
- **E43 · The owner's standing words** reflected in these points: "Move the entries" (BR26), "record the four" (LR1), the owner's deferral of 04:39 UTC ("i defer all judgement to you now nad in hte future"), "Switch all fable tasks to opus 5.5" (a rule, not a page).
- **E44 · R7** (every pool at least three admitted lines): breaches named by seat: DESKS-ECO (r2s-wartime-thorp-3; two siege towns go from two lines to none), DESKS-DEF (12 seats of one under a succession crisis; 7 uprising towns; 10 towns of the full chain pool), DESKS-2 (POOR falls to two in 16 + 42 towns), FAULTS-DESKS (pools under three named in FAULTS-DESKS-R7.md; Unsafe to none in three towns, answered by S23), LAST-VARIETY (cured: every town of four pools at three or more).
- **E45 · The second ring is never the failed venture; a fact of the record is never unsaid** (FAULTS-BIRTH, "TWO CALLS OF MINE, each vetoable": `SECOND_RING`, and `supplyStory.js :: groundPicksAtBirth`). faults/FAULTS-BIRTH-HANDBACK.md:51-62.

**Note · the 525 reference rows moved, point by point** (R5, declared by each seat; the stored golden file is the close's): 48: 93; 49: 36; 50: 16; 51: 0; 52: no stored field; 54: 36; 56: 0; 57: 0; 61: 13; 62: 48; 63: 0; 64: 0; 65: 0; 66: 2 (item 2) + 1 (item 7), then 3 more at point 67; 68: 0 at FR21, then 36 at FR24 (2); 69: 3; 70: 13. The shared page (N4) and the engine-core rule (EG1) hold for every new leaf.

---

## PART F · THE LOWs NAMED AND LEFT

1. **F1 · (62)** The six economy hooks true of any holder are chosen by a pattern over their opening words (`ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER`, src/data/npcData.js:2608).
2. **F2 · (64)** The Skálgarde echo: "keeps no court and no gaol" appears twice on one tab (S23's line beside the internal row's "keeps no court and no gaol, and no wrong done there is written down ...").
3. **F3 · (65)** The pass corrects ANY draw-time line its final record refuses, not only the crises (r2r-city-4089's Pawnbroker spoke of banks in a city with none); in forced-crisis towns 5 Mercenary corrections move, truly.
4. **F4 · (65)** The town and city fish cards' hedged lines beside "Preserved fish" (40 of 640 bought-in markets).
5. **F5 · (68)** L5's there-share leaves out the commons' grounds but still counts the food record's forced landings ("the record speaking").
6. **F6 · (68, FR23)** The entrepôt card names "Hunter's lodge » Furs and pelts" as a source beside the lodge's own "Short of game." (the card's naming debt).
7. **F7 · (69)** `tradeAtWork.js`'s header comment still says `impairedUnderSiege` reads the stored status. (Cured by point 71's C5; not on the line at point 69.)
8. **F8 · (69, LR3)** The title lines are drawn on the birth's facts before the imports are written, so a line the final record makes true can be passed over (the sawyer's 6 true prints passed over). A late reading of the title lines is not ordered.
9. **F9 · (70)** Two `want` labels read stiffly: "livestock for meat and draft" (the need list's label said verbatim).
10. **F10 · (70)** "the work at the citizen militia": the slot `{house}` gives the house's own display noun; where the house is a militia or a levy (25 of the 140 `want` cards) the phrase reads as a duty, not a trade.
11. **F11 · (63/68)** `supplyStoryLaw` L5 red by count (9 against the floor 10), until the close re-records it (FR17).
12. **F12 · (66)** Lines that still spoke of a court where none sits: cured at point 67 (FR25) for the tie, the witness and the standing. Still named: the magistrate's letter (`npcData.js:1787` prints only where a court sits), the stored holding-cells row after a court is ruined ("the owner's: a saved record's text").
13. **F13 · (68)** Eight towns whose stored grazing land is spent beside a common (r2r-hamlet-53, r2r-village-15, -20, -49, r2s-infiltrated-village-0, r2s-plague_onset-village-1, r2s-succession_void-hamlet-3, r2s-monster_pressure-village-2) still read "Short of livestock." (the record's own depletion wins).
14. **F14 · (66)** `impairedUnderSiege` reads the stored chain status where the card shows another in 5 house-trade pairs (the Dyer's textile chains in bar0-city-under_siege+famine-rand-28, -31, -38, r2r-village-55; an Enchanter's shop in -38): nothing prints falsely; cured at point 69 for the 4 towns (A60).

**Also left by name** (not LOWs; each is in a hand-back's "left by name"):
- **F15 · 15d, the war bar's word** (K-WATCH, D16): the PDF's bar word "Adequate" where the roster has no wall, garrison, militia, watch or company. 1 town of the thirty, 6 of the 720. The cure needs the military score held at the place where it is written, or both bars drawn from a held score.
- **F16 · The fishmonger's sibling "Talks about the boats, the weather and what came in this morning."** (titleSecretsPresentations.js:2093): 1 town of the 720 (r2s-indebted-village-2) prints it where no catch is landed.
- **F17 · 12d's need-list half in r2r-hamlet-21 (salt)**, 15e (2 towns of the 720), 11e.wantBuy's story half (r2s-recently_betrayed-city-2): left, named in FAULTS-NEED, DESKS-ECO.
- **F18 · The butchers of r2r-city-43 and bar0-town-calm-rand-46** (11a.atWork; "livestock for meat and draft" beside "Raw hides and animal products"): the law, the one-good rule or the need list; the chair's call (MARKS-2 :104-110).
- **F19 · 13d in two towns** (r2r-town-4, r2r-town-33): "no wrong done there is written down" beside the Safety lens's "The town's record of crimes at X stays short ..." (DESKS-2 A7's consequence; cured at point 64 for the line, A37).

---

## INDEX · EACH POINT, ITS HAND-BACK, AND THE SECTION THAT HOLDS ITS VETO ITEMS

All hand-backs are under docs/chair/. Line numbers are the heading's line.

| Point | Hand-back | Section with the veto items |
|---|---|---|
| 48 | 2026-11-17/bar8/BAR8-K-WATCH-HANDBACK.md | :76 "4. NEW VOCABULARY FOR THE OWNER'S VETO LIST (BR14 (c), rule R6)"; :57 "3. THE CURES"; :94 "5. DECLARED MOVES"; :129 "8. LEFT BY NAME" (15d at 8.2) |
| 49 | 2026-11-17/bar8/BAR8-K-POWERS-HANDBACK.md | :87 "4. THE NEW LINES A READER CAN SEE (the owner's veto list; ...)"; :45 "2. THE CURES"; :111 "5. DECLARED MOVES"; :147 "7. LEFT BY NAME" |
| 57 | 2026-11-17/bar8/BAR8-K-WATCH-2-HANDBACK.md | :71 "Item 5 · the occupation twin, reworded by name (vetoable)"; :87 "Item 2 · the atom is a second copy of the force"; :17 "Item 1"; :236 "Not mine, by name" |
| 50 | 2026-11-17/bar8/BAR8-K-PEOPLE-HANDBACK.md | :95 "4. DECLARED MOVES (R5) AND NEW VOCABULARY" ("NEW VOCABULARY FOR THE OWNER'S VETO"); :54 "3. THE CURES"; :119 "5. LEFT BY NAME" |
| 58 | 2026-11-17/bar8/BAR8-PEOPLE-2-HANDBACK.md | :37 "2. PART B · ITEM 3 · THE OWNER'S QUESTION WAS YES" (the owner's three things in plain words at :50); :83 "2b."; :124 "5. LEFT BY NAME" |
| 51 | 2026-11-17/bar8/BAR8-DESKS-ECO-HANDBACK.md | :61 "3 · The new and the changed lines (for the owner's veto list), and where each prints"; :105 "4 · Left by name" |
| 52 | 2026-11-17/bar8/BAR8-DESKS-DEF-HANDBACK.md | :62 "4 · The new and the changed lines (for the owner's veto list), and the diff of every dump"; :86 "5 · Left by name, and where I stepped past the letter" |
| 59 | 2026-11-17/bar8/BAR8-DESKS-2-HANDBACK.md | :162 "The new and the changed lines, for the owner's veto list"; :44 "A6 · the key (BR34), the houses, the refused slot"; :89 "A7"; :254 "After the second reader (the chair's ruling BR35 and LOW 2)"; :240 "Left by name" |
| 54 | 2026-11-17/bar8/BAR8-J-INCOME-HANDBACK.md | :46 "3. Lines a reader can see (no new text ...)"; :127 "6. AFTER THE CHAIR'S RULINGS"; :177 "7."; :214 "8. AFTER THE SECOND READER" |
| 55 | 2026-11-17/bar8/BAR8-PDF-2-HANDBACK.md | :173 "SECOND BRANCH · lane/bar8-pdf-2b"; :199 "ITEM 4 OF MY SECTION"; (:111 "NEW OR CHANGED LINES A READER SEES" is point 44's, not on this row) |
| 56 | 2026-11-17/bar8/BAR8-MARKS-2-HANDBACK.md | :45 "3 · The lines a reader can see change"; :62 "4 · Declared moves"; :92 "6 · Left by name" (the KEEP overturned; "NEW TABLES AND READINGS, each vetoable"); :131 "9 · RULING BR31" |
| 60 | 2026-11-18/faults/FAULTS-TOOLS-HANDBACK.md | no veto section (tools only; :187 "RULES, POPULATIONS, DECLARED MOVES": none) |
| 61 | 2026-11-18/faults/FAULTS-NEED-HANDBACK.md | :167 "4 · New and changed lines (the veto list)"; :25 "2 · Each item with its proof"; :257 "8 · FR15" |
| 62 | 2026-11-18/faults/FAULTS-PEOPLE-HANDBACK.md | :109 "3 · The new and the changed lines (for the owner's veto list)"; :61 "FR5"; :144 "5 · Left by name" |
| 63 | 2026-11-18/faults/FAULTS-BIRTH-HANDBACK.md | :146 "NEW OR CHANGED LINES: NONE WRITTEN. The existing lines that now print where they did not"; :48 "1 · THE SECOND RING"; :100 "2 · THE VENTURE'S PICK" |
| 68 | 2026-11-18/faults/FAULTS-BIRTH-HANDBACK.md | :276 "FR21"; :403 "FR23"; :460 "FR24 IN PROGRESS"; :496 "FR24, CLOSED" |
| 64 | 2026-11-18/faults/FAULTS-DESKS-HANDBACK.md | :181 "8 · The Unsafe twin, given by name"; :223 "FR18"; :61 "2 · Item 1 (13d, FR6): `court or gaol`"; :18 "1 · Item 2 (FR7)"; FAULTS-DESKS-R7.md (pools under three) |
| 65 | 2026-11-18/faults/FAULTS-ROWS-HANDBACK.md | :135 "3. Every new line, with three towns it prints in (the owner's veto list)"; :229 "FR20"; :91 "Item 6" |
| 66 | 2026-11-18/faults/FAULTS-WATCH-HANDBACK.md | :193 "FR19 / FR22 · items 6 and 7" ("NEW TEXT (the chair's words, on the owner's veto list)" in Item 7); :44 "Each item with its proof"; :182 "What I left, by name" |
| 67 | 2026-11-18/faults/FAULTS-WATCH-HANDBACK.md | :267 "FR25 · the court's lines outside my files" |
| 69 | 2026-11-18/last/LAST-DECLARE-HANDBACK.md | :22 "Item 1: the twenty rows" (":24 What each line now declares (no new text; each declaration is vetoable)"); :89 "Item 2: the sawyer's secret"; :124 "Item 3: `impairedUnderSiege`"; :243 "Left, by name" |
| 70 | 2026-11-18/last/LAST-VARIETY-HANDBACK.md | :22 "1 · Item 1" (":28 THE OWNER'S VETO LIST"); :66 "2 · Item 2 · the four lines (THE OWNER'S VETO LIST)"; :150 "LR6"; :233 "6 · Left by name"; last/LAST-VARIETY-ITEM2-WANT.diff (the patch as first proposed) |
| the rows | 2026-11-17/sixth/LANDINGS-SIXTH.md | rows 48-70 at lines 29-42 |
| the messages | the landing commits' messages (`git log --first-parent`) | "NEW LINE(S) (the owner's veto list)" at points 61, 64, 65, 66, 70 |

---

## SOURCES THAT DISAGREED (for the checker)

1. **S12 (CRITICAL IMPORT v4).** DESKS-ECO's hand-back (bar8/BAR8-DESKS-ECO-HANDBACK.md:70) quotes "needs {good} that the country around it does not give". The source and DESKS-2's correction (BR35 (1)) read "needs more {good} than the country around it gives". I quote the source.
2. **S23 (Unsafe v4).** FAULTS-DESKS §8's first quotation ("Wrongs at {settlement} are piling up ...") is superseded by FR18 (1) in the same file (:187, :223). I quote the source.
3. **S39, S42 (Moderate v9, Unsafe v6).** LAST-VARIETY §1's table shows the first words struck through; the corrected words are in the LR6 table (:157-163). I quote the source (= the LR6 words).
4. **Point 70's "ten new lines, two corrected in place" (the landing row).** The hand-back table holds ten lines in all, of which two (Moderate v9 and Unsafe v6) are the lines corrected in place. Eight lines were written first (Part 1); LR6 added Safe v8 and Unsafe v7. I list ten sentences (S34 to S43), not twelve.
5. **Point 65's "six twins, two more for the fish card's siblings"** equals the hand-back's eight: three fair lines (S24 to S26), two quarter lines (S27, S28), three fish-card lines (S29 to S31).
6. **Point 63's declared moves.** FAULTS-BIRTH's own table says 34 towns (gaps 24, primaryImports 7); the second reader corrected it to 33 (gaps 22, primaryImports 8) and the landing message says "resourceAnalysis.gaps 22 towns, economicState.primaryImports 8 (r2r-town-34 undeclared by the seat), union 33" (faults/FAULTS-BIRTH-HANDBACK.md:169-187 against :362-370). I give 33.
7. **Point 50's declared moves.** K-PEOPLE's hand-back reports 152 towns of the 720 and 16 of the 525; PEOPLE-2 found four more families it missed in the 180 (`npcs[].personality` on 4 cards; one `goal.long`; `prominentRelationship` in bar0-city-under_siege+famine-rand-30) (bar8/BAR8-PEOPLE-2-HANDBACK.md:105-122). The extra families are not in K-PEOPLE's own count.
8. **S13 (POOR v5) counts.** DESKS-ECO's table says it prints in 0 of the thirty, 4 of the 150, 14 of the 720 under `food: ≤ pressured`; DESKS-2 narrowed the declaration to `= pressured` and reports it in 4 towns of the 180 and 5 of the 720 (the towns where v3 is refused) and r2s-occupied-village-1 loses it. The two counts are of different declarations; I give both and no merged figure.
9. **S24 to S28 (the fair and the quarter).** FAULTS-ROWS names "5" towns for the fair where auditor J counted five and the atom reads six; the quarter's first line: "SIXTEEN (my first hand-back said 13 and listed 16)". I give the later counts.
10. **Point 49's K-POWERS table header** says "towns (of the 750 and the 150 ...)"; the hand-back's section 5 says "105 of the 900's rivals" for the same rule. I quote the table's counts and note the header.
11. **FAULTS-WATCH's landing message for point 66** counts 41 stored records of the 900 (11 holding-cell descs; 11 guard lines; 16 power descs; 1 lawless row; and the 2 fishmonger twins under a siege); the hand-back's own section totals 28 towns for items 1 to 4 and 11 for item 7. They count different sets; not a disagreement of wording.
13. **Point 68, the newly proven pastures.** The seat counts 174 (139 of the 720, 29 of the 150, 6 of the thirty) and the landing message says "190 newly proven grazing lands over the 900 by the reader's count (174 by the seat's)". I give both.
12. **K-WATCH (48) §3 and K-WATCH-2 (57) on the atom.** K-WATCH's atom read the force through its own name table (ORDER_FORCE_NAME); K-WATCH-2 replaced it with `orderForceOf(...).houses`. The source holds the second. K-WATCH's counts (7 towns of the 720 refused, 93 of the 525) are the first form's.
