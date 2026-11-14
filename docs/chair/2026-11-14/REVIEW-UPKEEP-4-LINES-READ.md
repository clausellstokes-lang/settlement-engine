# REVIEW-UPKEEP-4 · STEP 1 · every new or reworded line of the stage, read where it prints

The stage: the lane's own commits `git log --first-parent --no-merges 0a07f98c7..9c32016c9` (63 commits, 31 of them touch code),
plus how the integration merge ef9f38e80 resolved its conflicts (`git show --remerge-diff ef9f38e80`). Not read here: the
capacity branch merged at c448bb3a0 (a clean merge, no remerge diff) and anything after 9c32016c9. I wrote this list from the
diffs alone. I had not opened the lane's statement, any file under docs/chair/ on the lane, or any commit message of the range.
Two subject lines did reach me unasked: 9c32016c9's subject was printed by `git worktree add`, and the tip that moved past it
(4b312f5ce) by a log of HEAD.

**Births: 1,278, all in the app's own configuration shape.** I did not reshape any by hand. They are the capacity reader's 972
(the SECOND-WAVE-CENSUS 720 in its births.mjs shape, plus its 252 `rv5-` births) and 306 births of my own, `ru4-<crisis>-<size>-<i>`.
My own births cover all 15 crisis kinds, calm, and siege+famine, at 6 sizes with 3 each, with `selectedStresses` set and
`selectedStressesRandom:false` (`probes/REVIEW-UPKEEP-4/own4.seeds`). Every birth was rendered on every surface at the tip
(9c32016c9) and at the base (0a07f98c7) with `render6.mjs`: the tabs, the Tonight sheet, the PDF's text, the Foundry journal, the
AI prompt and grounding, the register (player and owner), and the world export (player and dm). The renderer is the capacity
reader's `render5.mjs`, extended only to accept my seed names. Each line below has its own regex (`lines.py`). `scan.py` finds
every print by surface, and `facts.py` reads each town's record. `checks.py` then reads each print against its own town's record
and page, in EVERY town it prints in. Lines with no scripted predicate (INFO) were read by eye in samples and have their towns
named. The per-line counts at tip and base, the surfaces, and the smallest and largest towns are in `probes/REVIEW-UPKEEP-4/table.tip.md`.
Every scripted verdict, town by town, is in `checks.{tip,base}.ndjson.gz`.

EXECUTED throughout unless marked PLAUSIBLE. OWN = the stage's own; CARRIED = false at the base too (the writing file named).

## The lines, by family (tip prints / base prints; verdict)

### A. The threat rows (`src/domain/display/threatAssessment.js :: buildThreatAssessment`; 0ab206f77, c924351e6, 4513f0237, 5590e54fd, 7cbcbf5e9)
These rows print ONLY in the PDF's THREAT ASSESSMENT block: the Defense tab prints the state prose in their place. In every
town I checked that the row's printed band equals the band of its own score (Beasts & Monsters by monster, Invasion & War by
military, Economic Survival by economic). It does in 1,278/1,278; the sentence is chosen by that band.
- A1a "Money enough to ride out a long crisis, laid by before the <crises>: …", 316/0. A1b "Money enough for a short crisis, laid by before the <crises>; …", 89/0.
  The named crises are exactly the ones in the page's two-label prosperity line ("<A> before the <crises>; <B> while it lasts | since"),
  in 405/405 towns. TRUE as a clause. **But see finding C-M3:** in the 25 indebted towns it reads "money enough … laid by before the
  debt crisis" beside the crisis's own "Much of what is earned here goes straight to the creditor, and nothing is left to build with"
  (r2r-city-25). The sentence "Money enough to ride out a long crisis" printed in the same 25 towns at the base, so it is CARRIED
  (threatAssessment.js). The stage's clause now names the debt crisis inside it.
- A2a "An embattled region, and only <a palisade|walls> and a citizen militia to hold it.", 82/0, TRUE in 82/82 (no other force stands in any).
  Smallest r2r-thorp-1; largest rv5-under_siege+famine-village-4.
- A2b "Active frontier with <a garrison|a militia> but no perimeter, and too little to meet what the country sends.", 19/0, TRUE 19/19.
- A2c "Active frontier, with <walls> and a watch to meet what comes.", 74/0, TRUE 74/74 (walls and watch both stand).
- A2d "Quiet country, and little is kept against it.", 75/0 (Weak/Critical only), TRUE.
- A2e "Quiet country, and nothing organised is kept against it.", 192/0, TRUE 192/192 (no walls, force or charter hall in any).
- A2f "Safe heartland … Existing defenses are appropriate." (moved: walls, any force, or a charter hall; Adequate/Strong only), 8/32, TRUE 8/8.
- A2i "Wild country all round and nobody organised to meet it…" (re-gated to `!force`), 287/365, **FALSE in 27**: each holds an
  Adventurers' charter hall (CARRIED: 58 at the base; finding C-M2).
- A2l "Quiet country, and far more defences than it calls for." (Strong only), 142/145, TRUE.
- A2g, A2h, A2j, A2k (the old lines, now under bands or under walls): 0 at the tip. A2j (H2's line) printed in 18 walled towns at the base; 0 now.
- A3a "<Walls> and armed townsfolk who know how to hold them." (Strong), 53/0, TRUE. A3b "<Walls> and nobody organised to man them: …"
  (Adequate), 17/0, TRUE. A3c "<Walls>, and a watch to keep them.", 113/0, TRUE. A3d "Armed citizens …, and no walls: too few …"
  (Critical), 2/0, TRUE. A3e "No walls or garrison, but enough here to turn away raiders; …" (Adequate), 15/0: 8 hold a force; 7 hold
  only an Adventurers' charter hall (r2r-village-13, -18, -28…). The hall is what makes the score Adequate, so TRUE (LOW doubt, not
  listed). A3f, A3g (old lines under `!walls` / `!force`): 501/516 and 10/140, TRUE in every town.
- The bar colours read the row's band (C-L7): no sentence; checked equal to the band in every town.

### B. The safety profile (`src/generators/safetyProfile.js`, `src/generators/safetyLineTruth.js`, `steps/assembleSettlement.js`; 18aeee4b5, 48ad4da91, db13fdb40, 7515c2abb)
Each line prints on the Defense tab and the world export, and the guard line also in the PDF.
- B1a "Crime exists but is well-managed. The <garrison|watch|militia> is present and responsive." 41/41, TRUE (the named force stands). B1b "…
  Neighbours notice trouble and deal with it themselves." 5/0, TRUE 5/5 (no force, no contracted company, no charter hall).
- B3 "Those holding the place keep order", 72/0, only in thorps, hamlets and villages under a siege (smallest r2r-thorp under siege;
  every one besieged), TRUE.
- B4 small insurgency, 26/0. B5 / B13 / B14 small slave revolt, 21/0 each. B6 "No stable governing authority; whoever holds sway…",
  28/0 (small, fractured). B7 tiny migration, 14/0. B15 conversion fraud without a church, 2/0. B12 short price gouging, 20/0 (plague,
  small, no market or merchant guild). Each only where declared; TRUE (read in r2s-insurgency-thorp-*, rv5/ru4 slave_revolt hamlets and villages).
- B8a "There is no watch." 258/258, TRUE (no watch; no courthouse). B8b the court note, 24/30: now only where a Courthouse stands, TRUE.
- B9 "<The merchant guilds|Wealthy interests> keep their own <…> beside the <law>: …", 21/0, TRUE (garrison or watch stands; r2r-city-13).
- B10 "…scrying, fraud, or …" without an alchemist, 49/0, TRUE. B11 "A street gang controls part of the place … Its violence comes and goes …",
  34/0, TRUE 34/34 (one Street gang on the roster). B16 "Some goods change hands here without a licence or a duty paid." beside an
  organised criminal power, 131/0, TRUE. B17 "Theft of food … by people with too little." where the record holds no hunger, 80/0, TRUE.
- B18a "Some of the <law> take bribes from whoever has coin.", 76/0. B18b "The <law> is chronically underpaid and poorly equipped…",
  15/0. B18c "The <law> exists on paper. Susceptible…", 10/0. Each read against the military band and the purse word, TRUE.
  r2r-town-19 has "The garrison and town watch exists on paper.", an agreement slip carried from the base frame.
- B19 "The <law> keeps what rounds it can while the supplies it needs are cut off.", 33/0, TRUE: the watch's supply dependency is
  critical. **LOW OWN (L1): in 26 of the 33 the subject is compound, "The garrison and town watch keeps what rounds it can"**
  (r2r-town-9, r2s-under_siege-city-0).
- The mercenary guard line now skips a standing watch: it printed beside a watch in 23 towns at the base and in 0 at the tip. Read in
  its place: the watch's own patrol frames, which are TRUE.

### C. The income lines (`src/generators/economy/incomeLineSiblings.js :: trueIncomeDesc`, `houseOfWorkLine`, `economicState.js`; b11a4d72e, fbc4a0080, db13fdb40, 18457a827, 3bd14d0b5, 07e35278d, fd1330673)
Each prints on the Economics tab, in the PDF and in the world export. Every twin was read against the roster, the siege and the
PRINTED trade lists (the Economics tab's own Imports and Exports lines). All TRUE where they print:
C1 alchemy under siege 8/0 (an alchemist; besieged), C2 remedies 307/0 (no alchemist), C3 remedies short 21/0 (alchemy chain impaired),
C4 metal worked 126/0 (a forge house), C5 local wool worked 43/0 (weaver or fuller), C6 cloth short 95/0, C7 cloth worked 293/0,
C8 fish landed 45/0 (a fishers' house), C9 fish sold 154/0 (a fish house), C10 tithes plain 24/0, C11 timber managed 145/0, C12
timber plain 4/0, C13 coal "sold on to other towns" 90/0 (coal among the printed exports), C14a–e the five house-of-work lines
18/0 under the label "Local Trades" (each beside its own house; none under a siege), C15 the Arcane Industry first sentence alone 5/0
(no guild or academy).
The originals, now narrowed (C16a–o), are TRUE wherever they still print. Iron, grain, wool and stone imports are each on the printed
Imports line, in 260/260, 199/199, 16/16 and 0/0 towns. Salt fish and coal are each on the printed Exports line, in 69/69 and 90/90.
No road or market line prints under a siege. The grain own-fields line prints under a siege in 11 towns ("none is left to sell to
other settlements"), and it is true there.
- CARRIED twin (L4): "River Tolls: Tolls on river traffic, dock fees, and ferry rights." prints under a siege in 11 towns
  (rv5-under_siege-town-1: "nothing comes in by road"). The stage closed toll, gate, port and transit income under a siege
  (SIEGE_CLOSED_SOURCES) but left River Tolls open. It printed the same way at the base.

### D. The Outlook (`src/domain/display/dossierViewModel.js :: pickTrue, outlookFactsOf, dependencyGoods`; 2e25b5ffe, db13fdb40, fb7a61558)
Each prints on the Overview and Viability tabs, in the PDF and in the Foundry journal.
- D1 "keeps order and pays its way, but it has to buy food" now prints only where law ≠ critical and the town is not poor: 30/91, TRUE.
- D2 the twin "<T> gets through the year, buying in what its own land and trades do not provide.", 252/0. TRUE where the town buys
  food or lists a necessity. Never under a siege. **LOW OWN (L2):** in 2 towns it sits beside the Economics tab's "No recorded imports."
  (r2r-thorp-22, r2s-infiltrated-thorp-2), though their food record buys 1%.
- D3 "…only while <goods> <keeps|keep> arriving and the routes that bring <it|them> stay open.", 140/99. The verb agrees with its goods
  in 140/140 (grain keeps, metals keep, timber and metals keep).
- D4a, D4b, D4c (the pool, now read by `pickTrue`): 99/119, 4/131, 5/110. Never under a siege. TRUE where they print.
- #216 (fb7a61558): the Outlook names magic only where the record holds a magic food supply. At the base the false form prints in
  **0 of 1,278** (every magic-fed Outlook, 25, holds magic on the food record), so on my births the cure is NEVER EXERCISED. I read
  its own town at step 2. CARRIED, outside #216: in 10 of those 25 towns, "…the rest comes from its stores and from magic" sits beside
  the Magic tab's "Nothing structural at <T> depends on arcane work" (r2r-hamlet-43, magicPct 5). It is the same at the base.

### E. The food endurance line (`src/domain/display/defenseDisplay.js :: foodEnduranceLine, monthsInWords`; 1a7a02927, merge ef9f38e80)
It prints on the Defense tab (with "Food endurance:") and in the PDF, in 1,278/1,278 towns. The mood is right everywhere: "would"
in every unbesieged town, the indicative in every besieged one. No town outside a siege reads "has taken" or "carries". The months
equal the Economy tab's stores row in every town with whole months.
**MEDIUM OWN (M1), kind g:** in **77 towns** the line now says "a few days" and the Economy tab's stores row says "a few weeks".
Each is a famine town with storageMonths 0.1 (3 days): 14 with a granary, e.g. ru4-under_siege+famine-city-1 ("the granary carries
the city for a few days at full rations, a few days on half" beside "Stores: a granary, a few weeks of grain."), and 63 with
household stores, e.g. r2r-hamlet-16 ("household stores would carry the hamlet for a few days" beside "No granary; a few weeks in
the larder."). The stage's new words are true to the record (3 days). The row's words were false at the base too (writer:
`src/domain/summary/tonightSheet.js:589`, `months < 1 ? 'a few weeks'`). But at the base the two agreed. The disagreement is new at
the tip: the stage cured one twin and left the other. **LOW OWN (L3):** in 11 towns "a few weeks" sits beside "about a month in household stores".

### F. The register's war clause (`src/components/map/heraldRegister.js :: warClauseOf`, HeraldGazetteer.jsx, RealmComparisons.jsx; 3ac6abd4c)
"A <poor hamlet>, at war." / "war": "at war": 87/0. Every one is a wartime town with no siege (r2r-hamlet-5), TRUE. An
occupied, insurgent, revolting or raided town prints "A <subject>." with no clause. That is silence, read in each.

### G. The viability warnings (`src/generators/economy/viability.js`; 06818b064)
These print in the PDF and the world export, not on a tab.
- G2 "<Tier> closes its isolation-support gap through magical transit." 19/0. TRUE, but "isolation-support gap" still names the
  model's sum (L5, LOW, the owner's rule on machinery).
- G3 "… remains viable through …" 6/8: never in a non-viable or besieged town now; TRUE.
- G4 "The <tier> is set on arms, but it has no walls, garrison, or barracks." 6/0, TRUE.
- G6a "Magic runs strong here, but a <hamlet> is too small for formal arcane houses." 73/0. G6b "…no arcane house stands." 14/0.
  G6c "Add <Hedge wizard | Traveling hedge wizard>" 67/17. All TRUE (no arcane house; the suggestion is from the tier's own catalogue).
- G8 "Banks stand here, but the <metropolis> does little trade." 7/0. TRUE by the output figure. **LOW OWN (L6):**
  r2s-infiltrated-metropolis-3 and r2s-politically_fractured-city-0 head the same page "Highly diversified — multiple major revenue streams".
- G1, G5, G7: NEVER PRINT in 1,278 births.

### H. The readiness label (`src/data/bandLadders.js :: readinessBandOf(score, held)`, `defenseGenerator.js`, `recordInvariants.js`; ffe0750d4, a DECLARED MOVE)
"Undefended" prints on 5 surfaces (tabs, PDF, Foundry, AI, world). At the base it printed in 34 towns that hold walls or a force,
and in **0** at the tip; on the capacity reader's 972 it fell from 27 to 0. The label moves in **26 of the 972** (31 of 1,278), all
held towns with a score under 12. That is the declared 26. What prints in its place, read on every surface: "Vulnerable: palisade
or earthworks, held by the citizen militia." (10), "Vulnerable: a palisade, held by the household levy." (8), "Vulnerable: town
walls, held by the town watch." (4). It is the same word on all five surfaces and TRUE: each town holds what the line names.

### I. Removed print (PDF)
"Score avg" chip: 1,278 → 0. The "REQ"/"FORCED" badge: 0 in the PDF at the tip. **CARRIED twin (L7):** the Defense tab still prints
"REQ" under a standing force in 748 towns (DefenseTab.jsx:345). It is the same design as the Institutions tab's "REQ" badge
("Historically required"), so the chair must rule whether the PDF's ruling covers the app too. "Member of" is no longer printed for a
person in no power. The Foundry journal still prints it for members (1,278 towns), and I read those as right.

### The capacity reader's three HIGH lines and the release bar's two HIGH rows, on that reader's 972 births (base 0a07f98c7 → tip)
- H1 "Undefended: <walls>, held by <force>": 27 → **0**. Cured, and what prints in its place is TRUE (H above).
- H2 "No perimeter, but the charter hall …" in a walled town: 14 → **0**. **Cured by silence**: all 18 such towns (of 1,278) are
  walled towns with a watch and a charter hall, and the row prints its band alone.
- H3 "You can walk into the centre of <T> without being stopped, challenged or counted by anybody at all." in a walled town:
  16 → **18** on the 972 (23 → 25 of 1,278), e.g. r2r-hamlet-17 (Palisade or earthworks). **NOT CURED.** The writer,
  `src/data/dossierStateProse/defense.generated.js`, is not touched by the stage. I check at step 2 whether the statement claims it cured.
- #115 (fd1330673), "The mages' guild contributes meaningfully to civic revenue." with no guild or academy: 5 → **0**. In its place
  the line's first sentence alone, in 5 towns, each with a wizard's tower and no guild: TRUE.
- #216 (fb7a61558): NEVER EXERCISED on 1,278 births (D above).

### Twins that lack a condition their siblings carry (CARRIED; written by the files named)
- C-M1 (MEDIUM, CARRIED, `threatAssessment.js`, the Internal Security row): "Arrest, trial and gaol all work here." / "There is a court
  but almost nowhere to hold anyone." prints in **133 towns with no court house** (r2r-town-1: Town hall and Small prison/stocks only).
  The stage's own ruling, "a court named only where a courthouse stands", cured the safety profile's court lines but not this row,
  in a file the stage edited throughout. The same 133 at the base.
- C-M2 (MEDIUM, CARRIED, `threatAssessment.js`): "Wild country all round and nobody organised to meet it…" beside an Adventurers'
  charter hall, in 27 towns (58 at the base). The stage re-gated this exact branch to `!force` and left the charter hall out, though
  its plagued twin has a charter branch.
- C-M3 (MEDIUM, CARRIED sentence, OWN clause): A1a/A1b in the 25 indebted towns (A above).
- L4 River Tolls under a siege, 11 towns. L7 the tab's "REQ" badge. TG1: "offenders risk real prosecution" with no court house, in
  2 towns at the tip (r2r-town-41, r2s-occupied-town-1); 1 at the base.

## Step 1's count
**Lines read: 101 regex families covering every new or reworded sentence, clause, label and chip of the stage's code (lines.py: A1–J3),
plus 9 sibling and carried families.** Of the stage's own lines: **0 HIGH; 1 MEDIUM (M1, the food line against the stores row, 77
towns); 6 LOW (L1 agreement, 26 towns; L2, 2; L3, 11; L5; L6, 2).** CARRIED, in the stage's files or as twins of its
cures: 3 MEDIUM (C-M1 133 towns, C-M2 27, C-M3 25), the uncured H3 (18 of 972), and LOWs (L4, L7, TG1). NEVER PRINT: G1, G5, G7, the
#216 fault. The verdicts carry PLAUSIBLE only where named (A3e's doubt).
