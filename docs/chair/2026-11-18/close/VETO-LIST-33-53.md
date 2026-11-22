# THE VETO LIST: points 33 to 47 and 53 (branch `lane/join-2026-11-14` at 70e557d5b, checkout /home/user/k, working tree clean)

**How this was checked.** I read every row of LANDINGS-SIXTH.md, every hand-back those rows name, and section 6 of the handoff. Every quoted page sentence below was found by grep in /home/user/k/src. Paths are shortened: `src/...` means /home/user/k/src/...; the handoff is /home/user/chair/docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md; hand-backs are under /home/user/k/docs/chair/2026-11-17/.

**Two notes on the slots.**
- In the desk files (`src/data/dossierStateProse/*.generated.js`) `{settlement}` and `{season}` appear exactly as written.
- In the scene files the slot is code: `${n}` or `${r.name}`. Where I write `{name}` below, the source has that code slot, and I grepped the rest of the sentence word for word.

**The handoff file is still being written.** It was 1531 lines when I first read it and 1540+ later. The line numbers I cite for sections 0 to 6 did not move.

---

## PART A · NEW OR CHANGED WORDING, POINT BY POINT

### Point 33 · THE OWNER'S SUPPLY RULE (BIRTH-3, which also brought BIRTH-2's work onto the branch)
Sources: birth/BIRTH-3-HANDBACK.md:244-272 ("For the owner's veto list") and birth/BIRTH-2-HANDBACK.md:205-218 and :275-287. I checked that none of the words below were on the branch at point 32 (ed1d43529).

1. **"Abandoned: a failed venture."** and **"Failing: a failed venture."**
   - Old: in place of the house's "Short of …" mark.
   - Where: on the house's card, on its every service row (Services and Institutions tabs), and in the PDF. Only in a town with a failed venture: 11 of the 720 towns (BIRTH-3:321), about one town in 60.
   - Kind: MARK. The owner's own words, per the source comment.
   - src/domain/facts/supplyStory.js:438
2. **"The {house} stands abandoned, a venture of an earlier time: no {material} lies near and none is brought in."** and **"The {house} is failing: no {material} lies near and none is brought in."**
   - Plural houses take "stand abandoned … " / "are failing" and "lie", e.g. "The tanners are failing: no hides lie near and none is brought in." (BIRTH-3:263).
   - Old: BIRTH-2's wording said "no hides lies near" (BIRTH-3:251). That older form was never on the branch.
   - Where: Resources tab (and the PDF's resources pages), in a town with a failed venture.
   - Kind: NEW LINE. It is built from a word table.
   - src/domain/facts/supplyStory.js:155-160 (the words), :448-452 (the sentence)
3. **"{The house} is worked out: its own ground is depleted ({ground})."**
   - It now also prints for a house the story leaves idle where no chain asks it. Examples: "The mine is worked out: its own ground is depleted (Iron ore deposits)." (BIRTH-3:227); a fisher's landing, a peat cutter, a shepherd, a hunter's lodge.
   - Where: Resources tab. 78 towns of the 720 gain a line, 9 lose one (BIRTH-3:246-251).
   - Kind: an existing line form (BIRTH-1's), printing in new houses.
   - src/domain/display/validationOnPage.js:536
4. **"No {good} reaches {the house}."**, e.g. "No iron ore reaches the mine." (49 towns), "No fish reaches the fisher's landing." (12), "No peat reaches the peat cutter." (4).
   - Where: Resources tab.
   - Kind: an existing line form, in new houses. Point 43 later took it away where the house's own story line stands beside it (see point 43).
   - src/domain/display/validationOnPage.js:569, :589
5. **A peat cutter's mark now reads "Short of peat."**
   - Old: "Short of reeds." (BIRTH-3:262).
   - Where: on an idle peat cutter's card and rows.
   - Kind: MARK (built from the existing "Short of {input}." form).
   - src/domain/display/crisisStoppedRow.js:751
6. **The door word "short" no longer prints beside a failed venture's mark.**
   - Where: the Institutions tab's service rows and the PDF (BIRTH-3:317).
   - Kind: a WORD taken away.
   - src/components/new/tabs/InstitutionsTab.jsx:351; src/pdf/lib/crisisMarksOnPage.js:129
7. **A proven ground now prints in Nearby Resources with no word of plenty** (no "Abundant"), e.g. "Managed Woodland", "Stone quarry".
   - Where: Resources tab, 171 towns of the 720 (BIRTH-2:216).
   - Kind: a LABEL removed (the ground is a NEW ROW).
   - src/components/new/tabs/ResourcesTab.jsx:247
8. **Under a siege the dossier's dependent line names no good as arriving.**
   - Old: "… can stand, but only while {goods} keeps arriving …" (e.g. "… only while timber keeps arriving …", BIRTH-3:173).
   - New: the general form, "{town} can stand, but only while the goods it buys in keep arriving and the routes that bring them stay open."
   - Where: a besieged town's dossier, 1 town of the 150.
   - Kind: an existing line chosen in a new case (no new words).
   - src/domain/display/dossierViewModel.js:293-304

### Point 34, 35 · BAR8's two audits
No wording: detectors only, nothing under src.

### Point 36 · DEBT-2
No wording: registers only, "No behaviour changes" (LANDINGS-SIXTH.md:12).

### Point 37 · LEFT-LINES
Source: left/LEFT-LINES-HANDBACK.md:32-60. Every line is a TWIN, and the hand-back says each "VETOABLE". I diffed the point: these eight are the only new lines and no old line was reworded.

Where the desk lines live (from each block's own title in the source):
- DS-GEN-17 is "Overview/Power › The company the town keeps" (general.generated.js:11341).
- DS-GEN-13 is "Overview/Economics › The market and the roads" (general.generated.js:9440).
- DS-GEN-3 is "Overview › Systems Health dashboard" (general.generated.js:2150). The handoff (BR28, :306-308) says this desk's health lines are not mounted: "0 of 900 towns print a line of it".
- DS-DEF-2 is "Defense › Threat assessment" (defense.generated.js:552).
- DS-DEF-3 is "Defense › Public order banner" (defense.generated.js:2668).
- DS-ECO-2 is "Economics › At-a-glance tiles" (economy.generated.js:349).

The hand-back says these twins print in none of the three test populations. The second reader corrected one of them (see item 2).

1. **"{settlement} has no court sitting and no gaol in use."**
   - Twin of: "{settlement} keeps a gaol of its own, though no court sits here to try anyone." (general.generated.js:11393)
   - Where: Overview, a town with neither court nor gaol.
   - Kind: TWIN.
   - src/data/dossierStateProse/general.generated.js:11405
2. **"Half the goods traded in {settlement} are only passing through, and its people live off their passing."**
   - Twin of: "Half the goods traded in {settlement} are only passing through, and the town lives off their passing." (general.generated.js:9584; that line now needs a town or larger)
   - Where: Overview/Economics, an entrepot village or smaller.
   - The second reader found it prints in two towns, and the Overview's entrepot line drew differently in four more of the 150. No sentence is false on either side (LANDINGS-SIXTH.md:13; handoff :713-715).
   - Kind: TWIN.
   - src/data/dossierStateProse/general.generated.js:9640
3. **"{settlement} does not eat as well as it would like, and it talks about it."**
   - Twin of: "{settlement} eats well enough and does not talk about it." (general.generated.js:2949)
   - Where: Overview health desk, a "Moderate" town with a low food band (that desk is not mounted, see above).
   - Kind: TWIN.
   - src/data/dossierStateProse/general.generated.js:2962
4. **"{settlement} eats on food grown elsewhere; if the carts stop, so do the meals."**
   - Twin of: "{settlement} eats well, but on food grown elsewhere; if the carts stop, so do the meals." (general.generated.js:3612)
   - Where: Overview health desk, an import-dependent town with low food (not mounted).
   - Kind: TWIN.
   - src/data/dossierStateProse/general.generated.js:3639
5. **"There is a little food put by at {settlement} and someone to nurse the sick: less than a season against hunger, and against disease something better than nothing and well short of a hospital."**
   - Twin of: "There is food stored at {settlement} and there are clergy who tend the sick: reserves against hunger, …" (defense.generated.js:1960)
   - Where: Defense › Threat assessment, a town with granary and parish care but stores under three months.
   - Kind: TWIN.
   - src/data/dossierStateProse/defense.generated.js:1985
6. **"The stores go into {season} as full as they will hold, and that is less than a season's food."**
   - Twin of: "The stores go into {season} deep, and they reach past the turn of the year with room to spare." (economy.generated.js:556)
   - Where: Economics › At-a-glance tiles, no granary and stores under three months.
   - Kind: TWIN.
   - src/data/dossierStateProse/economy.generated.js:569
7. **"{settlement} has no wall and no soldiers; its watch does not keep the peace in its own streets, and would be no answer to an army."**
   - Twin of: "{settlement} has no wall and no soldiers; its watch keeps the peace in the streets and would be no answer to an army." (defense.generated.js:1229)
   - Where: Defense › Threat assessment, the law collapsed beside a watch.
   - Kind: TWIN.
   - src/data/dossierStateProse/defense.generated.js:1275
8. **"{settlement} has people meant to keep order, but order holds only where they are standing."**
   - Twin of: "{settlement} has people who keep order, and order holds about as well as anyone here expects." (defense.generated.js:2884)
   - Where: Defense › Public order banner, the law collapsed.
   - Kind: TWIN.
   - src/data/dossierStateProse/defense.generated.js:2896
9. **The brewer's lines that name taverns now need a tavern-kind house.**
   - The welcoming line: "Generous with a cup and with talk; hears everything the taverns say." The transactional line: "Sells by the barrel to taverns and by the jug to anyone; talks prices plainly." (titleSecretsPresentations.js:276, :278)
   - With no tavern, the brewer takes the existing cautious line: **"Watchful around the vats and the store. Keeps the back of the brewery locked." / "Pleasant at the front; does not show anyone the back."** (titleSecretsPresentations.js:279-280).
   - Where: the brewer's person card, in r2r-village-16, r2s-monster_pressure-village-1, r2s-wartime-village-1 and r2s-insurgency-village-0.
   - Kind: an existing line now reached.
   - The rule is at src/data/people/titleSecretsPresentations.js:2364-2365.

### Point 38 · LEFT-PDF
Source: left/LEFT-PDF-HANDBACK.md:182-202. No new sentences. These are MARKS and LABELS the tabs already print, now in the PDF and the Foundry journal:
1. The income share's mark, both halves, in the PDF, e.g. "Short of wool." (src/pdf/lib/crisisMarksOnPage.js:127-131).
2. The head line **"A row marked short is what its house makes when supplied."** now prints in the PDF and the journal where a share is short.
   - Kind: an existing line in a new place.
   - src/domain/display/crisisStoppedRow.js:601
3. The journal's words after a share's name: "(short)", "(curtailed, short)", "(curtailed)", and "failing" for a failed venture's share. Example from the hand-back: "Timber Trade (curtailed): 2%".
   - Kind: MARK.
   - src/foundry/journalPages.js:348-354 and :386
4. The journal's person page shows the house's mark under the house line, e.g. "Curtailed by the siege.", "Short of stone.", "Failing: a failed venture.".
   - Kind: MARK.
   - src/foundry/journalPages.js:223
5. A used-up ground now sits under "Depleted" in the PDF and the journal, and the PDF's resources head sentence names it, e.g. "The nearby stone quarry is used up." or "Three nearby resources are used up: …".
   - Kind: an existing sentence form, src/pdf/lib/headlines.js:333-334.
6. The journal's "Nearby resources" row now names the grounds a house proves (src/foundry/journalPages.js:407).
7. The PDF's chain cards drop an output the tab's card withholds (src/pdf/sections/Services.jsx:240).

### Point 39 · LEFT-CHAIN
Source: left/LEFT-CHAIN-HANDBACK.md:58-69.
1. **"The digging goes on here, but the metalworking stands idle, short of what it needs."**
   - Twin of: "Local ore feeds the smithy directly. Metalwork income is not trade-route dependent." and "Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption." (incomeLineSiblings.js:61-62), and of "Metal is smelted or worked here." (:63).
   - Where: the Economics tab's income row "Iron & Metalwork". Only in a town where the mine digs and every metal-working house is short of iron: r2r-metropolis-24 and r2s-monster_pressure-metropolis-2 (the 720).
   - Not printed in the PDF or the journal (LEFT-CHAIN:68-69).
   - First worded "The mine is worked here, …" and reworded before commit (LEFT-CHAIN:62-64).
   - Kind: TWIN. The hand-back says "NEW (vetoable, the owner's list)".
   - src/generators/economy/incomeLineSiblings.js:67 (declared at :133, :139)

### Points 40 and 42 · LEFT-MARKS and its follow-up (ruling BR21)
Source: left/LEFT-MARKS-HANDBACK.md:71-79 ("all in the page's existing mark words; no new prose") and :155-160.
1. "Short of grain." on the maltster (bar0-hamlet-under_siege-rand-43, r2r-hamlet-27, r2s-wartime-village-3 and others); "Short of livestock." on the butchers (r2r-town-54 only); "Short of medicinal herbs." on the established apothecary (r2s-religious_conversion-town-2 only).
   - Kind: MARK, in the existing form.
   - src/domain/display/crisisStoppedRow.js:751
2. Gone from the Institutions and Services tabs of nine towns of the 720: the head line "A row marked short is what its house makes when supplied." where the only mark was a failed venture's. Also gone: r2r-village-13's apothecary's "Short of its materials.".
3. **The import word that feeds a house of medicine: "herbs and forage"** (point 42, ruling BR21).
   - Before point 42, LEFT-MARKS read the whole word "herbs", so "Ritual wood and herbs" also fed the apothecary.
   - Kind: WORD ON A LIST.
   - src/domain/facts/houseInputAtHand.js:115
4. Under a siege, the houses that work a proven ground's yield carry the existing "Curtailed by the siege." (ruling BR11; 25 house and service rows over the 900). Kind: MARK.

### Point 41 · LEFT-CHAIN's follow-up
No wording (houses matched by catalogue id; a roster row).

### Point 43 · J-ROWS item G1
No new line (J-ROWS-HANDBACK.md:81-85: "NONE NEW. Lines REMOVED only").
- The general gap line is taken away where the house's own story line stands, e.g. "No iron ore reaches the mine." beside "The mine is worked out: …".
- 129 towns of the 720.
- Resources tab and the PDF's resources pages.
- src/domain/display/validationOnPage.js:516-548

### Point 44 · PDF-2
No new words (PDF-2-HANDBACK.md:170: "every line above is a word or a row the tab already prints"). Changes in the PDF and the journal only:
1. The chain card's state word takes the tab's "Impaired" (src/pdf/lib/chainStateOnPage.js:20-26).
2. A refused card prints its outputs under "Normally yields:" (src/domain/chainYield.js:15).
3. A spent iron card drops the mine.
4. NEARBY RESOURCES prints the proven grounds, with no label (src/pdf/sections/ResourcesProduction.jsx:177-178).

### Point 45 · SCENES
Source: bar8/BAR8-SCENES-HANDBACK.md:50-98 and :183-191.

New twins, all on the Overview's arrival scene or its history line:
1. **"A laden cart or two comes down from the workings in a day, and no more."**
   - Twin of: "Laden carts from the workings grind along the road in a line that never seems to end." (arrivalProse.js:259; that line now needs a village or larger)
   - Where: the arrival scene of a thorp or hamlet whose quarry or mine is at work, not under siege. Prints in bar0-hamlet-calm-rand-45, -47, r2r-hamlet-6, -32, -40, -58.
   - Ruling BR23 (1) gave it by name.
   - The point-46 rewording is below.
   - Kind: TWIN.
   - src/data/arrivalProse.js:263
2. **History twin, three branches.** It replaces the "long and steady" line under a live siege, famine, occupation, plague or war.
   - With two great events, the original's own branch: "It has come through the {A} and the {B}, and travellers still remember the place kindly".
   - With one: **"The {X} is the one great event in its past, and what it faces now may be the second"**.
   - With none: **"No great event marks its past, and what it faces now may be the first"**.
   - Twin of: "… the history here is long and steady, and travellers remember the place kindly" (narrativeText.js:476).
   - Prints: "… may be the second" in r2s-wartime-town-1; "… may be the first" in bar0-hamlet-under_siege-rand-35 and r2s-famine-town-2.
   - Ruling BR23 (2).
   - Kind: TWIN.
   - src/generators/narrativeText.js:518-519
3. **The enchanting twin** (BR23 (3)) was worded first "Signs in {name} still offer enchanting by the hour, …". Point 47 reworded it, and the old words are no longer in src.
4. **Existing twins now printing in new places** (hand-back :86-98). No new text, but the reader meets them in new towns:
   - "Only a little forge smoke rises here, and the anvils ring now and then, when there is iron to work." (arrivalProse.js:76)
   - "The racks outside the workshops stand mostly empty: the smiths are short of iron." (:78)
   - "Being on the right side of it, {name} lives on the army's contracts, and the place now needs the war to go on to pay for what the war has already cost it." (narrativeText.js:265)
   - "The road from the workings is empty of carts." (arrivalProse.js:260)
   - "Half of {name} has worked fish all its life, and there is almost no fish to work." (:182)
   - "The drying racks along the way in stand nearly bare, and only the smell of salt and old catch is left." (:180)
   - "The reagent stalls are half bare, and the few jars left are dear." (:376)
   - Each sits in the arrival scene of a town whose trade is short, or whose fish is not landed by its own fishers. The towns are listed in the hand-back table.
5. **Lines now held back by a new condition:**
   - "Forge smoke hangs over everything here, and the ring of the anvils never quite stops." and "Racks of new ironwork stand outside the workshops, waiting for the carts." now need the ironwork in full (arrivalProse.js:75, :77).
   - "Racks of drying fish line the way in, and the smell of salt and catch is everywhere." and "Half of {name} seems to be gutting, salting or selling fish." now need fish landed here (:179, :181).
   - "Even the outbuildings have new roofs, and nobody looks hungry." now needs food at least secure (:507).
   - "Being on the right side of it keeps the forges of {name} running day and night on the army's contracts, …" now needs the ironwork in full (narrativeText.js, the line before :265).

### Point 46 · SCENES's last commit
- **REWORDED:** the small-quarry twin above was first worded "A laden cart or two comes down from the workings in a day, and the road is quiet between them." (old wording quoted from the source comment and from the SCENES hand-back :232-234).
- It now reads **"A laden cart or two comes down from the workings in a day, and no more."**
- Reason: "is quiet" reads as a claim that there is no danger.
- The old words survive only in a comment at src/data/arrivalProse.js:263.

### Point 47 · SCENES-3 (ruling BR25)
1. **"Magic is still a trade in {name}: the signs still offer it by the hour, but the work is slow and dear for want of what it takes."**
   - Old: "Signs in {name} still offer enchanting by the hour, but the work is slow and dear for want of what it takes." (SCENES hand-back :187). That was false where the only arcane service is "Arcane identification".
   - Twin of: "Magic is a trade in {name} like any other: signs offer enchanting and identification by the hour." (arrivalProse.js:371)
   - Where: the arrival scene of a town that offers enchanting or identification while its arcane trade is impaired or short. It is allowed in 9 towns but drawn in none of the 900 (it only holds the slot).
   - Kind: REWORDED twin.
   - src/data/arrivalProse.js:377
2. "The road from the workings is empty of carts." is back to its base condition (it prints in any crisis). Where both it and the small cart are allowed, the cart answers. No new words.
   - src/data/arrivalProse.js:260; src/generators/narrative/arrivalScene.js:234

### Point 53 · FISH-ROWS
No new text (FISH-ROWS-HANDBACK.md:18-19). The catalogue's existing rows replace the fresh catch rows (see Part C):
- "Preserved fish" with "Smoked, dried, and salt-preserved fish for storage and inland trade." replaces "Fresh fish retail" / "Fish sold daily from the morning catch. Selection varies by season." (src/data/institutionServices.js:952-954).
- The fishmonger's "Salted fish" replaces "Fresh fish" (:411). The hand-back says no town in the populations moves this row.
- Where: the Services tab row, the house's chip, and the PDF's Services and Institutions pages. Only towns whose own fishing grounds are used up and whose fish is bought in: 30 of the 720.

---

## PART B · NEW VOCABULARY
Only one change was made to src/domain/facts/factVocabulary.js across points 33 to 53 (one commit, 680a5b2a7, point 45).
- **`trade at work: ironwork in full`**: the ironwork is at work, no smiths' house is short, the iron is at hand (worked here, or brought in past no siege), and no war holds the iron. Point 45, ruling BR17 (1). src/domain/facts/factVocabulary.js:381 (comment :379-380); src/domain/facts/tradeAtWork.js:258
- **`trade at work: fish taken here`**: a house that takes fish is at work on a live ground, or no fish ground of the town is used up. Point 45, ruling BR17 (1). src/domain/facts/factVocabulary.js:381; src/domain/facts/tradeAtWork.js:287
- The other points say "NEW VOCABULARY: none". LEFT-LINES (hand-back :51-52), LEFT-MARKS (:124), LEFT-PDF (:202) and J-ROWS (no atom written) say so in their hand-backs. LEFT-CHAIN used only existing atoms (hand-back :20).

---

## PART C · NEW RULES THAT CHANGE WHAT A PAGE PRINTS (no new wording)

**Point 33**
1. **The supply odds.** For each house, the dice give: ground still there 45 in 60; bought in 45 in 60; a failed venture 3 in 60. The dice are cast once, when the town is created, and every view reads the stored result. A shared page, the gallery and the DM screen now tell the same supply story as the owner's page. src/domain/facts/houseKinds.js:226-231; src/generators/resourceGenerator.js:658, :692
2. **The other users of a material** can never be a failed venture: the butcher, the chandler, the bowyer, the river boatyard, the thatcher, the furrier, the tailors, the dyer, the alehouse. BIRTH-3 says this table is "the owner's to strike a row of". src/domain/facts/houseKinds.js:205
3. **An idle source house gets a stored gap row even where no chain asks it**, so it prints its lines (BR8 (2)). src/generators/resourceGenerator.js:692
4. **No town carries two words for one good on its imports.** Hides and beasts count as one good bought in. src/domain/facts/houseInputAtHand.js:106
5. **The war's iron** is read from facts every view keeps, not from the DM's plot hooks (ruling BR9). src/domain/facts/warIronHook.js:32
6. **Under a siege the dossier names no import as arriving.** src/domain/display/dossierViewModel.js:293-294

**Point 37**
- New conditions on existing desk lines. The gaol line needs a gaol. The entrepot line ("the town lives off …") needs a town or larger. The two "eats well" lines need food secure or better. The granary line and the "deep stores" line need three months of stores. The two "keeps the peace / order holds" lines need a law that has not collapsed. (src/data/dossierStateProse/*.generated.js at the lines in Part A)
- The brewer's tavern rule (titleSecretsPresentations.js:2364-2365).
- Declared move: the brewer's presentation changes in 24 of the 525 reference configurations.

**Point 38**
- The PDF's land list reads the houses' grounds. src/pdf/lib/viewModelBodySlices.js:395

**Point 39**
- A spent-ground chain card leaves out a house that works its own other ground: the 17 mines and one charcoal burner of the 720 (ruling BR10 (3), amended). src/domain/display/chainHouses.js:94-98
- 72 outputs come back onto chain cards. src/domain/display/tradeListDisplay.js:789
- The metal-share reading. src/domain/display/economicsCrisisMarks.js:263

**Points 40 and 42**
- New tables, each named vetoable (LEFT-MARKS :124-125):
  - the butchers need livestock and the established apothecary needs herbs (src/data/crisisDependence.js:1620);
  - the maltster needs a grain surplus (:1629);
  - the import word "herbs and forage" (src/domain/facts/houseInputAtHand.js:115);
  - "game" stocks the butchers (:122).
- The head line now counts only true short marks, not a failed venture's. src/domain/display/crisisStoppedRow.js:615-619
- Under a siege a house living off a proven ground is "Curtailed by the siege." (BR11). src/domain/display/crisisStoppedRow.js:355-361
- Stored records move in one town of the 900 (r2r-village-13).

**Point 43**
- The general gap line is struck beside the house's own story line, on the printed page only. src/domain/display/validationOnPage.js:516-548

**Point 44**
- The PDF's chain cards read the tab's card. src/pdf/lib/crisisMarksOnPage.js:105
- The PDF prints the proven grounds. src/pdf/sections/ResourcesProduction.jsx:177

**Point 45**
1. Under a siege, a house the crisis table gives no dependence, and whose every chain is stored "Impaired", is no longer counted "at work". src/domain/facts/tradeAtWork.js:239
2. A line may have two twins, and the history twin is found by a key. src/generators/narrative/historyCoherence.js:110-112
3. The "long and steady" line now names the crises it allows and excludes the five hard ones. src/generators/narrativeText.js:481-483
4. Declared moves: 31 stored records of the 720 move in drawn prose (arrival scene 16, history 14, pressure sentence 2), and 1 of the 525.

**Point 47**
- Where two twins are allowed, the LAST one answers. src/generators/narrative/arrivalScene.js:234

**Point 53**
- After the town is created, where the fish grounds are used up AND the fish is bought in, the fish market's catch row is swapped in place for the catalogue's "Preserved fish". An idle town keeps its row and its "Short of fish." mark.
- src/generators/steps/generateNarratives.js:37, :66, :85
- Declared move: 30 of the 720, 48 of the 525 reference configurations.

---

## PART D · EARLIER DECISIONS OVERTURNED OR RETIRED (on the branch)
1. **BR10 (3), amended** (handoff :228-235).
   - Before: the chair's first wording said a spent-ground card drops any house at work on another ground. That would drop 17 mines, 36 charcoal burners, 14 salt works and 8 quarries, and empty 43 cards.
   - Now: only a house whose own grounds hold the card's spent ground is dropped (17 mines and 1 burner; no card emptied).
2. **BR23 (3) wording replaced by BR25 (2)**: the enchanting twin (Part A, point 47).
3. **BR23's form of the "empty road" condition replaced by BR25 (3)** (handoff :269-273).
   - Before: the empty road was refused in a thorp or hamlet.
   - Now: it is back at its base condition, and the last allowed twin answers.
   - Also, the SCENES hand-back's own "first admitted twin answers" mechanism (BR23) is now "last admitted".
4. **BR24 overturned J-ROWS's fish swap** (handoff :256-261).
   - Before: J-ROWS's first build put "Preserved fish" wherever the fishery was spent, including 4 idle towns where it was false.
   - Now: the swap is for the bought story only (point 53). J-ROWS's own swap was reverted (J-ROWS hand-back :271-288).
5. **BR21 narrowed LEFT-MARKS's "herbs" word** (handoff :815).
   - Before: the whole word "herbs", so "Ritual wood and herbs" fed an apothecary.
   - Now: "herbs and forage". LEFT-MARKS also withdrew its declared move of the thirty (LEFT-MARKS :160).
6. **BR20: the maltster in a calm town on a connected road stays bare** (handoff :722-723; LEFT-MARKS :110-115). BIRTH-1's law for a buyer on a calm road is kept over LEFT-MARKS's "in a crisis or not".
7. **BIRTH-3 judged one detector's rule out of date** ("EX-BOUGHT": a fish market on spent fisheries whose town buys fish in is at work). The hand-back flags it "FOR THE CHAIR'S VETO" (BIRTH-3 :148, :265-266). This is a test rule, not page wording.
8. **BIRTH-3 reverted BIRTH-2's re-composition of the scene guard's "REACHABLE (MU1)"** (BIRTH-3 :161-164).
9. **BR9** (row 33; BIRTH-3 :308-316): the war's iron no longer reads the DM's plot hooks.
10. **BR18** (handoff :236-239): L6 was ruled NOT A FAULT. The card "Impaired" beside a trade working on bought iron stays; nothing was built.
11. **LEFT-PDF's L1 "twin row" was tried and retracted** (LEFT-PDF :45-53). The PDF still prints the stored short line (Part G).
12. Rulings that overturn or retire something but are **NOT ON THE BRANCH**:
    - BR12 (the besieged KEEP rows retire; LEFT-KEYS K3: no trace in src or tests).
    - BR31 (the KEEP of C7539 overturned; MARKS-2).
    - BR33 (FS1 (a) retired; J-INCOME-2).
    - BR16 (MARKS-2).

---

## PART E · NOT WORDING, BUT THE OWNER'S TO KNOW
1. **The paragraph added to CLAUDE.md** (/home/user/k/CLAUDE.md:18-23), quoted exactly:
   > "By the owner's word (2026-11-18, in the chair's session: "I give the word", then "Do both"), a builder session that the program's chair has seated may commit and push its own work on its own lane branch (`lane/*`, the branch its prompt names) from its own cloud checkout, by plain pushes with the hooks: never `--no-verify`, never a force push, never `master`, never a pull request; the pull request's merge, the deploy and every migration stay the owner's hand."

   The handoff (:1166) says: "IT IS ON THE OWNER'S VETO LIST FOR THE CLOSE." The landings note says it is vetoable (LANDINGS-SIXTH.md:47-49).
2. **Five seats could not commit their finished work**: K-POWERS, K-PEOPLE, K-WATCH, DESKS-DEF, DESKS-ECO. Under the owner's "Do both", the chair committed their printed work on their branches. None of it is on the branch (LANDINGS-SIXTH.md:45-50).
3. **The stored figures stay red on the line by design until the close** (the owner's yes): the reference corpus, the censuses, the engine bundle, the size ceilings (LANDINGS-SIXTH.md:28-32). The owner said "yes: refresh the stored reference files and open the pull request." at 03:03:46 (handoff :1453-1456, :1495-1497). Draft pull request #75 is open; the owner was told not to merge it yet (:1461-1466).
4. **The worker bundle.** BIRTH-3 measured +13,629 B from the supply rule; "the owner's choice is a rise of the ceiling" (BIRTH-3 :176-182). The close puts the whole rise at +168,907 B, over the 60,000-byte stop, and asked the owner at 03:24 (handoff :425-428).
5. **The ratchet arm A5** runs within six seconds of its 600 s limit (LANDINGS-SIXTH.md:33-34). Under BR22 "the owner hears at the close that the arm takes 3.6 times what it took on 2026-10-01" (handoff :844-847). The watchdog raise (LEFT-KEYS K8) is not on the branch: the limit is still 600 s at tests/property/editCorpusRatchet.test.js:69.
6. **The host refuses deployments** ("Deployment rate limited — retry in 24 hours."). The chair gave the owner three ways out and changed nothing (handoff :1467-1478).
7. **Before the deploy**: migrations 204 to 210 and the stamp file `supabase/applied-head.json` (now 203); then the edge functions; then `npm run ops:post-deploy` (handoff :1521-1528).
8. **Owed to the owner in one line**: C6865's "illegal sortie" is NOT one of the owner's very rare secrets (handoff :581-583).
9. **The previous account's sessions** should be paused or archived by the owner's hand (handoff :102-103).
10. **The supply-rule tables are the owner's**: the odds and the "other users" table (BIRTH-3 :256-261). The new tables of LEFT-MARKS are each vetoable (LEFT-MARKS :124-125).
11. **Stored records move** (each seat declared it): point 33 gaps in 84 of the 720 and 3 of the 525, "no person, tie, name or roster moves" (BIRTH-3 :267-272); point 37, 24 of the 525; point 45, 1 of the 525; point 53, 48 of the 525.

---

## PART F · THE QUESTIONS OWED TO THE OWNER
1. **BR13: may a house's network ever be run by another house's boss?** (handoff :98-101, :192-198, :298-301) · the cure is NOT ON THE BRANCH; the question is about pages as they are.
   - Today: on the branch, both the one-way deal (106 networks in 56 towns of the 720) and "the swap" (20 networks in 11 towns) still print. K-PEOPLE's cure of the swap is not on the branch.
   - The choice: keep the one-way deal as design, or forbid it.
   - Meanwhile: the chair kept the one-way deal and ruled the swap cured (K-PEOPLE, landing after the deploy). BR27 (2) adds the leftover two-way pairs to the same question.
2. **BR14 (b): female forms of titles** (handoff :202-204, :1353) · NOT ON THE BRANCH ("Emira" does not grep in src).
   - Today: "Emir" and the other one-word office titles have one form only.
   - The choice: pair any of them. Sheikh, Wali, Imam and Qaid have no female form.
   - Meanwhile: the chair gave "Emira" only (K-PEOPLE), not landed.
3. **BR18 / L6: should a chain card say it runs on bought iron?** (handoff :236-239; LEFT-CHAIN :73-81, :180-181) · ON THE BRANCH.
   - Today: in r2s-famine-metropolis-1, -3, r2s-plague_onset-city-0 and -3, the card "Iron & Metalwork" prints "Impaired" with "From Iron deposits (depleted)", while the share says "Metal is smelted or worked here." and the houses are fed.
   - The choice: a new word on the card ("runs on bought iron"), or leave it.
   - Meanwhile: ruled not a fault; nothing built.
4. **The worker-bundle ceiling** (CL3, handoff :425-428; BIRTH-3 :176-182) · ON THE BRANCH (the size at 70e557d5b).
   - Today: 2,525,028 B against a ceiling of 2,356,121.
   - The choice: raise the ceiling (+168,907), or shave the bundle.
   - Meanwhile: asked at 03:24; not answered when last recorded (:1540).
5. **The host's deployment allowance** (handoff :1467-1478, :1540) · not a page matter.
   - Today: deployments are refused.
   - The choice: switch off deployments for working branches, upgrade the plan, or wait a day.
   - Meanwhile: the chair changed nothing and cut its pushes to a trickle.
6. **BR29 (4): a gate held at night read as a day's round** (handoff :343-345: "THE OWNER'S QUESTION AT THE CLOSE") · NOT ON THE BRANCH (K-WATCH's by-day line does not grep).
   - Today: it would print in bar0-town-calm-rand-36, -37, -40 once K-WATCH lands.
   - The choice: whether that reading stands.
   - Meanwhile: left to the close.
7. **BR22: the A5 arm's slowness** (handoff :846-847) · the slowness is on the branch; the cure is not.
   - Today: 594 to 602 s against a 600 s limit.
   - The choice: none asked; the owner is to be told.
   - Meanwhile: the watchdog raise was given to LEFT-KEYS.
8. **Answered already**:
   - The deploy question ("yes: refresh the stored reference files and open the pull request.", 03:03:46).
   - BR26's five banked rows ("Move the entries"), NOT ON THE BRANCH.
9. **Listed "for the veto list" by rulings whose work is NOT ON THE BRANCH**: BR14 (a) and (c), BR15's twins, BR17 (2) and (3), BR28 (5), BR30 (2), BR31's list, BR33 (FS1 (a)), BR34 (handoff :199-226, :321-323, :352-355, :373-376, :410, :440-449).

---

## PART G · KNOWN FAULTS STILL ON THE PAGES AT 70e557d5b, BY NAME
1. **The PDF prints the stored short metal line where the tab prints the ordinary one.**
   - The PDF has "Little metal is worked here while the metal trade is short of what it needs." where the tab has "Metal is smelted or worked here.".
   - 95 towns of the 720 (108 shares), 16 of the 150, 3 of the thirty.
   - Held by J-INCOME-2 and PDF-2b (not on the branch). (PDF-2 :148-155; LEFT-PDF :175-180; LANDINGS-SIXTH.md:20)
2. **The PDF prints the head line "A row marked short is what its house makes when supplied." twice** (Services and Institutions) where the only mark is a failed venture's.
   - The tabs no longer do this.
   - 9 towns of the 720: r2r-hamlet-26, r2r-hamlet-48, r2r-hamlet-57, r2r-town-13, r2r-town-18, r2s-under_siege-city-1, r2s-politically_fractured-hamlet-0, r2s-infiltrated-town-1, r2s-wartime-city-3.
   - Held by PDF-2b. (PDF-2 :126-147; LEFT-MARKS :118-120)
3. **The fish lines that are still false where the fish is bought in or the grounds are spent** (J-ROWS :127-140, :191-200; FISH-ROWS :39-42, :161-167):
   - 11b.fish: 40 of the 720 after point 53.
   - The rites income line "The waters here are worked thin; rites keep the catch coming, and it is landed and sold here." (src/generators/economy/incomeLineSiblings.js:81; 21 rows).
   - The fishmonger's "Talks about the boats, the catch and who has been in today; a good ear for market news." (titleSecretsPresentations.js:140; 6).
   - The fish market's card "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait." (institutionDescVariants.js:271).
   - The fisher's landing's "Fresh fish" / "Catch of the day. Buy and cook same-day." (institutionServices.js:355). It is in r2r-village-11 (bought) and as titles in r2r-village-36 and r2s-religious_conversion-village-0.
   - The scene "Racks of drying fish line the way in, …" in r2r-village-36 (1 town; SCENES :144-148).
   - Each needs a new atom or a catalogue change; the holders are later seats.
4. **The fair and the luxury quarter** (J-ROWS :142-149, :219-231):
   - "Regional merchants. Luxury goods available." and "Merchants from across the region, and luxuries to be had." (institutionDescVariants.js:2088-2093) stand where no luxury is brought in: 5 towns.
   - "The trade in silk, spice, and precious things." (:996): 7, PLAUSIBLE.
   - These need a new atom; BR17 (2)'s twin was not written.
5. **r2r-hamlet-27: a failed venture beside its own herders.** "The dairy farmer is failing: no livestock lies near and none is brought in." prints beside a Shepherd, Common grazing land and a Stable yard.
   - A fault of how the town is created; for a birth seat, by name.
   - Reported in BR33 (4) (handoff :411-414). I did not re-measure it at this commit.
6. **The desk line "A thing done wrong at {settlement} goes somewhere and takes time, …"** prints beside "Prison only / Detention without process."
   - 10 towns (BR32 (4), handoff :387-392).
   - The sentence greps at src/data/dossierStateProse/defense.generated.js:1304.
   - The count was measured on DESKS-DEF's tree, not at 70e557d5b: UNVERIFIED here. The cure is not on the branch.
7. **BR25 (6) L2, ACCEPTED:** three besieged towns print "Forge smoke hangs over everything here, and the ring of the anvils never quite stops." with unmarked smiths beside an "Impaired" chain card (handoff :280-281).
8. **LEFT-LINES's left lines** (LEFT-LINES :84-99):
   - The brewer's secret "Thins the ale with water after it is sold by the barrel and charges the taverns for full strength" (titleSecretsPresentations.js:268) still names taverns where none stands.
   - The granary lines "The town can eat through a bad year. …" and "You find a full grain store at {settlement} …" (defense.generated.js:1968, :1974) presume stores.
   - Two desk lines under a collapsed law (DS-DEF-6 v1, DS-POW-5 merchantArmy v1) print in 0 towns of the 720.
   - Holder: DESKS-2.
9. **BIRTH-3's leftovers still not done** (BIRTH-3 :186-203): 71 houses in 27 towns are "short, and no ground of its material used up" (on no road); the card for a proven ground; the second ring of houses on no ground of their own.
10. **BR25 (5) M1, left by name** (handoff :275-278): the "trade at work" fact does not read "Stopped by the siege.". "Nothing prints falsely in the 900."

---

## PART H · INDEX OF THE EARLIER POINTS (1 to 32) AND THE LAST CLOSES

Points come from docs/chair/2026-11-14/JOIN-17-HANDBACK.md:150-184. Paths are under /home/user/k/docs/chair/.

**The round BAR6 (points 1 to 11), 2026-11-16/bar6/:**

| Hand-back | Veto section | Owner section |
|---|---|---|
| BAR6-GUARD-HANDBACK.md | :66 "THE VETO LIST" | :92 "FOR THE OWNER, IN PLAIN WORDS" |
| BAR6-HOUSES-HANDBACK.md | :37 "THE VETO LIST (every new or changed line, with towns it is read in at the tip)" | :95 FOR THE OWNER |
| BAR6-CRIME-HANDBACK.md | :70 "THE VETO LIST (every new or changed line; three towns it is read in, from the tip's 1,170 renders)"; :92 "NEW VOCABULARY (B6), on the veto list" | :158 FOR THE OWNER |
| BAR6-DEFDESK-HANDBACK.md | :34 "THE VETO LIST (new vocabulary and new lines)" | :57 FOR THE OWNER |
| BAR6-MARKS-HANDBACK.md | :43 "THE VETO LIST (new or changed declarations and readings; …)" | :77 FOR THE OWNER |
| BAR6-RECORD-HANDBACK.md | :116 "THE VETO LIST (every new or changed line, three towns it is read in)" | :152 FOR THE OWNER |
| BAR6-ECON-HANDBACK.md | :70 "THE VETO LIST (every new or changed line; three towns it is read in at my tip)" | :170 FOR THE OWNER |
| BAR6-PEOPLE-HANDBACK.md | :58 "THE VETO LIST (every new or changed line, with three towns it is read in)" | :141 FOR THE OWNER |
| BAR6-SCENES-HANDBACK.md | :81 "THE VETO LIST (…)"; :145 "NEW VOCABULARY (B6; each vetoable by the owner)" | :204 FOR THE OWNER |
| BAR6-CULTURE-HANDBACK.md | :34 "THE VETO LIST (…)" | :91 FOR THE OWNER |
| BAR6-POWERS-HANDBACK.md | :99 "THE VETO LIST (every new or newly reached line, with three towns it is read in)" | no owner section |

**"The seam" (points 12 to 19):**

| Point | Hand-back | Section |
|---|---|---|
| 12 | 2026-11-16/bar6/BAR6-SEAM-PDF-HANDBACK.md | :26 "WHAT A READER SEES (new or changed lines, three towns each)" |
| 13 | 2026-11-16/bar6/BAR6-SEAM-CULTURE-HANDBACK.md | :56 "THE LINES A READER CAN SEE (new or changed; …)"; :132 FOR THE OWNER |
| 14 | 2026-11-16/bar6/BAR6-SEAM-ECON-HANDBACK.md | :24 "WHAT A READER CAN SEE (…)"; :135 FOR THE OWNER |
| 15 | 2026-11-17/birth/BIRTH-AUDIT-HANDBACK.md | an audit: no section of new lines |
| 16, 17 | 2026-11-17/bar7/AUDIT/BAR7-AUDIT-H-HANDBACK.md and BAR7-AUDIT-I-HANDBACK.md | audits: no veto section |
| 18 | 2026-11-16/bar6/BAR6-SEAM-DESKS-HANDBACK.md | :72 "THE NEW OR CHANGED LINES A READER CAN SEE (from the tip's 150)" |
| 19 | 2026-11-16/bar6/BAR6-SEAM-SCENES-HANDBACK.md | :67 "THE NEW OR CHANGED LINES A READER CAN SEE (every wording VETOABLE)"; :94 "NEW VOCABULARY (the owner's veto list)" |

**BAR7 (points 20, 22 to 29), 2026-11-17/bar7/:**

| Point | Hand-back | Section |
|---|---|---|
| 20, 22, 25 | BAR7-CARDS-HANDBACK.md | :59 "3. THE LINES A READER CAN SEE (new or changed)" |
| 23, 24 | BAR7-ECON-HANDBACK.md | :96 "4. THE LINES A READER CAN SEE (new or changed; three towns each, …)" |
| 26 | BAR7-LINES-HANDBACK.md | :53 "3 · THE LINES A READER NOW SEES (…)"; :158 "9 · NEW VOCABULARY FOR THE OWNER'S VETO LIST" |
| 27 | BAR7-DESKS-HANDBACK.md | :56 "3 · THE LINES A READER CAN SEE (…)"; :90 "4 · NEW VOCABULARY, FOR THE OWNER'S VETO LIST" |
| 28 | BAR7-SCENES-HANDBACK.md | :84 "4. THE LINES A READER CAN SEE (new or changed), …" |
| 29 | BAR7-ORDER-HANDBACK.md | :34 "3 · THE LINES A READER NOW SEES (…)"; :88 "8 · LEFT BY NAME, AND THE CALLS I MADE (vetoable)"; :109 "9 · NEW VOCABULARY FOR THE OWNER'S VETO LIST"; :121 "11 · … (this section supersedes the siege twin's wording above)" |

**BIRTH-1, SECRETS-1, DEBT-1:**

| Point | Hand-back | Section |
|---|---|---|
| 21 | 2026-11-17/birth/BIRTH-1-HANDBACK.md | :188 "The new lines a reader can see (each with three towns; the 720)"; :426 "APPENDIX · THE OWNER'S TABLE (…)"; :498 "The words the birth writes on the imports list (…)" |
| 30, 32 | 2026-11-17/secrets/SECRETS-1-HANDBACK.md | :487 "9. FOR THE OWNER'S VETO LIST, IN PLAIN WORDS" (Amendment 3, the top-up of point 32, is at :112) |
| 31 | 2026-11-17/close/DEBT-1-HANDBACK.md | :41 "The old and new words of A (for the owner's veto list)" |

**BIRTH-2** (2026-11-17/birth/BIRTH-2-HANDBACK.md) came onto the branch inside point 33, not before. Its sections are :205 "The new lines a reader can see (each with three towns; the 720)" and :275 "For the owner's veto list (in plain words)".

**The previous closes:**
- 2026-11-16/bar4/BAR4-CLOSE-DOORS-1-HANDBACK.md:70 "FOR THE OWNER, IN PLAIN WORDS"
- 2026-11-16/bar4/BAR4-CLOSE-DOORS-2-HANDBACK.md:86 "FOR THE OWNER, IN PLAIN WORDS" (also :105, "Each change is on the veto list: …")

---

## NOT ON THE BRANCH (lands after the deploy)
None of these greps in /home/user/k/src at 70e557d5b:
- BR30 (2), the occupation twin, old and new: "A second body sent in from outside, which claims a share of the say over every decision made here." and "A rival bloc that wants a say over the decisions made here, and disputes the outside administration's hold on them." (K-POWERS / K-WATCH-2)
- BR14 (b) "Emira" (K-PEOPLE)
- BR28 (1) the atom `critical import brought in`; BR28 (5) DS-ECO-8 POOR v5 and DS-GEN-3 Import-Dependent v7 (DESKS-ECO / DESKS-2)
- DESKS-DEF's atom `uprising`; BR32 (2) the twin "… goes to the {seat}, …" (DESKS-DEF / DESKS-2)
- BR29 (2) the atom `force walks by day` (K-WATCH)
- BR34 the key `trade at work: building` (DESKS-2)
- BR26 and BR33's moved income lines (the file `incomeOrdinaryLines.js` does not exist) (J-INCOME-2, PDF-2b)
- BR31's new import-word rows, the alchemist row of the need table (the table at src/data/crisisDependence.js:1620 holds only the butchers and the apothecary), and "Salted fish" on three towns' imports (MARKS-2)
- BR16, the war's iron under an occupation (MARKS-2)
- BR15's twins (no-grazing, minted rival, Elected Reeve's description, the one-member seat) and BR14 (a)'s holder test (K-POWERS, K-PEOPLE)
- BR13's swap cure and BR27 (PEOPLE-2)
- BR17 (2) the fair's twin and BR17 (3) DESKS-2's items
- BR12 and BR22's test changes (LEFT-KEYS)
