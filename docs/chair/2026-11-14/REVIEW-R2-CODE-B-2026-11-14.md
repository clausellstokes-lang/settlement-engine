# REVIEW-R2-CODE-B — round two's second code lane, from its last read to its final statement (2026-11-14)

The reviewer REVIEW-R2-CODE-B, for the chair (session_01ACmDYZrFEVXyZEUg1NDxxC). I fix nothing and change nothing on the lane I read.

- **Lane:** `lane/r2-code-b-2026-11-13`.
- **Stage:** 80b960171 to ac8168c8c. The tip read is ac8168c8c, read back from origin, unmoved.
- **Reference tree Q:** the stage's base merged with the integration line as the lane merged it (`probes/REVIEW-R2-CODE-B/q-tree.sh`), so the line's arrival is not counted as the stage's.
- **Origin:** a sentence printing the same at Q is CARRIED. One new at the tip is THE STAGE'S OWN.
- **Evidence:** EXECUTED = run and read. PLAUSIBLE = read from code or inferred.
- **Step 1** (every new or reworded line, read where it prints) is `REVIEW-R2-CODE-B-LINES-READ.md`, pushed at 55cb36653 before any claim was opened.

**VERDICT: (written at the end of the read; see §9)**

## 2. Every row the stage says it cured (EXECUTED; tables per family in `probes/REVIEW-R2-CODE-B/step2/C1..C4/cures.md`)

I read every item of the lane's statement whose seat lies inside the stage: parts 1 to 9 of `docs/chair/2026-11-13/R2-CODE-B-HANDBACK.md`. Part 1 existed at the base only as its first rows, and its later rows are inside the stage.

The rows' own towns and sentences come from the lists the rows cite:
- the cold list REVIEW-W2A-3 `debt/final.json` at f385d487b;
- the cut `ROUND-3-CUT.json` and its increment `ROUND-3-CUT-INCREMENT.json` at `lane/round-3-cut-2026-11-13`.

The method:
- Each row's town was born at the tip where births.mjs knows its shape. `rww-` and `rpf-` towns cannot be reproduced, so their sentence's class was read across the 1536.
- The before was composed at Q from Q's births with Q's code. Q's renders were partial (one shard killed by memory, re-made after), so no finding rests on a missing Q page.
- Each removal was read in thirty lines.

| family | items | cured and true | cured by silence | still false | true lines removed |
|---|---:|---:|---:|---|---|
| C1 summary (Tonight, Daily Life, quick guide, stores, food) | 10 | 8 | 0 (1 prints on no surface: row 1d) | 2b MED on three surfaces; beside cured items 1 MED (carried), 2 LOW | item 1: 24 of 30 role lines true (the chair's one-goal ruling replaced them; 901 of 972 fit the record) |
| C2 crisis (cast, hooks, summaries, the minted person, the plague slot) | 15 rows / 13 items | 9 | 3 (4d, items 0 and 0b of part 6) | MED 6, LOW 4 | none plainly; 75 doubtful |
| C3 houses and chains | 19 | 14 | 2 ((b), (d)) | 3 HIGH (carried), 1 MED (the stage's), 1 LOW | (d): **18 of 30 true** |
| C4 people and faith | 10 | 10 at their rows | 0 | 1 HIGH (carried, #389's words, named not claimed), 2 MED (the stage's) | 57395ee18: **150 of 213 true** (19 of 30 read) |

### Still false after a cure the stage claims, or made false by it (the stage's own unless marked)

1. **2b, the food label's one home, is not on every surface** (MEDIUM, EXECUTED).
   - The ruling copied in the statement: "the food label on every surface reads ONE home … a label of plenty never stands beside a deficit."
   - The Overview's Systems Health still reads `foodSecurity.label` (OverviewTab.jsx). It prints "Food Security Secure" while Daily Life and Tonight print "Pressured" and Economics prints "Short: 1 lbs/day" in **314 of 1536** towns: r2r-thorp-4 (thorp; "Production: 58 lbs/day + 1 imported, Need: 60 lbs/day").
   - The Overview prints "Import-dependent" against "Deficit" in 16 siege towns: r2s-under_siege-hamlet-2.
   - The PDF's Identity & Daily Life (IdentityDailyLife.jsx) prints a bare food word that disagrees with the PDF's own Tonight block in 830 towns: "Surplus" beside "Secure" in r2r-hamlet-1.
   - The stage made the two homes disagree. The writers of the old words are outside its files, but the ruling names every surface. This is the same fault as step 1's H1-12 and H1-15.
   - LOW: "Pressured" is given at gaps of 1 to 5%, under the ladder's own cut of 5%.
2. **(b) REQ off every surface of the lane's: the Foundry journal still prints the provenance tag** (MEDIUM, EXECUTED).
   - `src/foundry/journalPages.js:364`, a stage file whose line the stage rewrote (2af8bdfa9), keeps `(${f.source})`.
   - The journal's "Armed forces" bullets end "\(required\)", "\(generated\)", "\(coherence\_repair\)" or "\(forced\)" in 1017 towns ("\(required\)" in 768): r2r-city-0, "City walls and gates: Masonry ramparts … \(required\)".
   - The Defense tab and the PDF Defense print REQ and FORCED too, but those are other lanes' files (carried).
3. **(d) #804 removed true grounds** (MEDIUM, EXECUTED, a count falling that is not a cure).
   - 891 of 2064 absent-ground chains are substitute chains whose own input is present.
   - Of 30 removed grounds read, **18 were true where they printed**: r2r-hamlet-2 "Grazing land" (alpine pasture); r2r-hamlet-16 "Fishing grounds" (river fish); r2r-thorp-3 "Foraging areas" (ancient grove).
   - The card now names no ground where it could name the substitute.
4. **57395ee18, Faith's "real political weight" removed where it was true** (MEDIUM, EXECUTED).
   - "Real political weight rests with the Religious Authorities." was removed from 213 towns. In 150 of them the Religious Authorities outweigh the governing power, so the line was true (19 of 30 read).
   - Three of the commit's own six read towns are among them (rpf-town-succession_void-13, 48 vs 27).
   - In 106 towns the Faith tab now prints the understated "A voice in the village's affairs belongs to the Religious Authorities." Beside it the Power tab prints them "Dominant" and "the decisions that matter are made by Religious Authorities": r2s-succession_void-village-3, Religious Authorities 58 Dominant against the Elder Council's 18.
   - The row towns ww-536, ww-1258 and ww-1449 are cured truly.
5. **f09e55042, the relationship card's keeper styled "Acting Fixer"** (MEDIUM, EXECUTED).
   - r2s-succession_void-town-1: "Connection: Acting Fixer Tlazolteotl Dzul". The record's role is "the council's fixer"; Fixer is not the seat's office.
   - Prints 8 ends in all: r2s-succession_void-town-1, r2s-succession_void-town-3 and rpf-town-succession_void-13.
   - The form is the powers lane's `keeperFormOf`: the Power tab prints "Acting Fixer … keeps the seat meanwhile", carried. The stage carried it onto the relationship card.
6. **#328, the defence home with no one named** (MEDIUM, EXECUTED by C2).
   - rw3-hamlet-under_siege-1: "defends: Adventurers' charter hall · the defence of the place, with no one named to lead it". The roster names Urbana Calvus, the charter master.
   - Also r2s-wartime-village-2 and rr3-village-under_siege+famine-port-1.
7. **#268/#270, brunt and lever on one person** (MEDIUM, EXECUTED by C2).
   - rr2s-village-famine-rand-1: "Olivera Novikov … takes the worst of it: one of the house the crisis hits". She also holds the lever, runs the mill and "has food, enough to matter".
   - 11 such rows at the tip, e.g. r2r-town-37.
8. **(c) least say, read on the wrong house** (MEDIUM, EXECUTED by C2).
   - rr3-city-mass_migration-port-1: "Qian Yoshida of The Arcane Circle takes the worst of it: the one with the least say …".
   - Qian heads The Arcane Circle, which has no stake. The house hit is Religious Authorities, where Qian ranks third.
9. **Part 9 item 2, the plague slot** (MEDIUM, EXECUTED by C2; see §8 for whose words).
   - The dean and priest fills are gone. In their place "The healer who identified the outbreak first has gone quiet" prints in 21 towns with no healer on the roster and no healing house: r2r-town-37.
   - Part 9 itself traces the slot-less sentence to `src/data/stressTypes.js` (W2-FIX-DATA-7's), so it is CARRIED where no slot fills. Where the stage's refill now names "healer", it is the stage's.
10. Lower, the stage's own (LOW, EXECUTED):
    - "Grain Holders no stake yet · it could side with either camp" in 39 famine towns, beside the same page's "Whoever controls the remaining food reserves holds more real power".
    - All 141 minted lever holders ("nobody here could, so this one stepped in") stand beside "Levers: Nobody here controls what this crisis turns on." (r2r-thorp-5).
    - The plural "the inns … whoever wins it over" in 11 towns (r2r-town-36), from "Inn (multiple)" -> "Inns" through crisisHooks.js.
    - "run by patronage and law" beside "keeps no court and no gaol" in 33 towns (r2r-thorp-1). Item 5's own row town has no court either.

**Carried, beside the stage's claims:**
- HIGH, the claim of zero count ranges on every surface is not met (cured on the stage's own surfaces; Institutions 1188 -> 0, Services 1186 -> 0, Power 1172 -> 0 on 401 Q pages). What still prints, each written outside the stage's files and printing the same at Q:
  - "Major monasteries (5-10)" on the Defense tab and PDF (12 metropolises, defenseDisplay.js and DefenseSecurity.jsx);
  - "Gates (if walled)" (14 towns);
  - "Taverns (5-20)" in the Overview and History tensions (r2r-town-9, OverviewTab.jsx and HistoryTab.jsx).
- HIGH, #389's issue words "A ruling one power refuses to obey" (49 towns, conflictIssues.js). The statement names this, not cured.
- MED, #883: the Defence tab's "a few weeks at full rations" beside the stores' "about three days" (71 towns, defenseDisplay.js). Named, not made.
- LOW, "in a kingdom", parked.

**The headlines by my run:**
- (e): 279 cards in 222 towns (theirs 276 in 221).
- (d): 924 chains in 449 towns (theirs 850 in 396).
- least say: 71 -> 22 (theirs 71 -> 22).
- temporary persons: 20 -> 57 of the 720 (theirs 57).
- 2b: 20.4% of towns move (theirs 20%).
- 2a: off-figure 292 and bare 1443 of 1536, both -> 0.
- Hidden-allegiance handlers dropped: 26% (theirs 31%).
- YOU: 11 towns left, each true (forced by isolation).

The rest agree in rate with their 800.

## 3. The laws (EXECUTED)
- **Field diff, Q against the tip, the census's 720** (`fielddiff.mjs`):
  - 136 towns move, in four families: stress 442 leaves in 127 towns, stressors 442 / 127, npcs 77 / 57, generationCoherenceReceipt 57 / 57.
  - Nothing else moves. This equals the statement's part 9, item 3, exactly.
  - Over the 1536: 372 towns, the same four families.
  - Every family is one the statement declares: the cast (items 4c, (c), item 4), the summaries (6a, the profit row, part 6's items 0 and 0b), and the minted person and the receipt (part 9 item 1).
- **No new key in the record.** The two "NEW KEY" paths (`npcs[].importance`, `npcs[].structuralRank`, 47 towns) are the temporary persons gaining the two keys that 45,075 of Q's 45,122 persons already carry; the 47 that lacked them were the temporaries. A person minted whole adds no key the record's persons do not have.
- **Draws.** One move, declared: `resolveCrisisCast` crisisCast/settlement, stepDraws 0 -> 2, pure -> drawn (32438f8d1, generationForkRegistry.js). No other row of the registry moved.
- **No new word in the vocabulary file.** categoryVocabulary.js is untouched by the stage. traditionCorpus.js gains `needs` declarations over existing atoms (`market`, `institution: smith`).
- **No hideable name in a stored composed sentence.** Of every string leaf the stage moved, none gained the name of a person of its town.
- **The draft shift record** (`R2-CODE-B-shift-record.DRAFT.json`, at the tip) is STALE against the tip (LOW, the stage's; the statement's part 9 names its re-measure as LEFT):
  - It was measured at fd9c09f42, before part 9.
  - It says npcs moved "37 / 37 (whole entries)" and "No other family". At the tip, npcs is 77 / 57 and generationCoherenceReceipt moves in 57 towns.
  - Its surfaces: 51 rows, the register's 51, none missing.
  - My run of its moved surfaces, its moved pins and a sample of its unmoved surfaces at the tip and at Q is in §3b.

### 3b. The shift record's surfaces, my run (EXECUTED; `probes/.../out/shift-*.txt`)
I ran 16 files at the tip and at Q: its 2 moved surfaces, its 5 moved pins, its RED-ON-THE-LINE row and 8 unmoved surfaces as a sample.

- **Red at the tip and green at Q** (the stage's moves, each one the record declares):
  - generatorGoldenMaster: 1 of 3;
  - espionageDormancyFence, THE DRIVEN GOLDEN;
  - hookThemeDraws, pin:no-hook-is-lost;
  - rosterDuplicateDraws, the corpus is live;
  - x46NpcBand, sixty seeds;
  - editCorpusRatchet A7: [672, 269, 2185], which equals part 9's re-measure, not the draft JSON's [674, …];
  - institutionBudgetPromise.
- **editCorpusRatchet A5** was red under load and green run alone (a timeout).
- **dossierProseManifest** is red at both the tip and Q: the line's, as the record says.
- **The 8 unmoved surfaces sampled** are green at the tip: belief-map, npc-ledger dormancy, the PDF golden view model, rumor-ledger, settlement-politics dormancy, timeline-track, interior, demographics lifecycle.
- **The record's own text is stale**, as said above, and institutionBudgetPromise is red again after the mint: its re-key at 0bd857e2e predates part 9. The statement lists both as LEFT.

## 4. Plants, one fault per new guard (EXECUTED; `probes/.../out/plants*.txt`)
The stage added 20 guard files. For each, a plant took its own cure out of a scratch copy of the tip and ran the guard alone. There were three ways to plant:
- the commit's src change reverse-applied (`plants.sh`);
- the commit reverted with its tests kept;
- a hand plant of one edit (`plants3.txt`).

Results:
- **18 guards red on their plant:** npcCardAllegianceHandler, peopleRowsApart, powerSeatHeading, traditionsTabForgeRow, traditionsTabMarketRow, crisisCastDefenceHome, crisisCastSeatAndAccess, faithAccessOnlyChurch, faithAccessUnderSiege, faithNativeIdentity, houseLabelEveryForm, quickGuideScopeRoster, scopeLineAtSize, storesSpanFigure, tonightOwnGoal, chainSourceAbsent, houseLabelEverySurface (the leaf returning the raw name), pdfChainHouseLabels (ChainRow back to the raw patterns).
- **All 20 guards are green at the tip**, so none reds on anything but its fault. 50 of the stage's 50 touched test files ran at the tip. The two reds there are generationForkCensus (a timeout, green alone) and institutionBudgetPromise (the declared pin).
- **Not planted:** chainCardTruth and stressSummaryDeclared. Their cures conflict with later commits, and a hand plant was not made: NOT MEASURED.

**Cures that take a line off towns with no guard of their own** (PLAUSIBLE that none exists; searched by name in tests/):
- 57395ee18, Faith's "real political weight": no test, only a register row. It is also the removal that took true lines (§2, item 4).
- 535e654d6, the Tonight keeper styled "Acting …".
- f09e55042, the relationship card's keeper. The powers lane's seatKeeper and powerSeatRender tests guard the form, not these two surfaces.

## 5. The merge of the line inside the stage (EXECUTED: `git show --remerge-diff 0aa0cce00`)
The resolution keeps both sides' cures in all three conflicted code files:
- **EconomicsTrade.jsx:** the lane's PROC through `chainHousesOf`, and the line's OUT label `chainYieldRefused`/"Normally yields".
- **Services.jsx ChainCard:** both props kept (`town` and `instNames`). The line's `chainPrintName` is kept and read through the lane's ruling (d) (`chainSourceOf({ ...chain, ...shown })`). The lane's houses stand, and so do the line's NORMALLY_YIELDS outputs.
- **SupplyChainFlow.jsx:** the line's `refused` is kept. `importedUpstream` is removed, and the lane had removed it before the merge (c40da4ec6 has no `importedUpstream`). The source node is read as in Services.

No cure of the line's was dropped. One LOW, PLAUSIBLE in reach and EXECUTED in code:
- The PROC value and the custom-chain flow call `chainHousesOf(c.processingInstitutions, [])` with an EMPTY roster. That function names only roster houses, so the PROC row never prints and the custom flow carries no houses.
- This is the lane's own c1efd7f93 (ruling R1), kept by the resolution. The path runs only with `pdfVisualChains` off, and it is the default. The line's PROC (display names) is replaced by silence there: no false text, but a row lost.

**The registers the stage touched, each by its door's own checking run at the tip** (`out/reg-tip.txt`, then a re-run alone of the timed-out ones):
- **Green:**
  - wiringCensusDeclared and proseWiringCensus. The prior review's LOW finding 5 is CURED: the census is byte-identical to a fresh build.
  - writerReach, green alone. It was red at the base 80b960171 ("forcedByToggle on institutions … UNVERIFIABLE"), so the stage cured it.
  - sovereigntyLightingContract (the lighting census).
  - proseNumerics.
  - tuningRegister.
  - defenceFactReaders.
  - mutationCoverageManifest.
  - pageCensus, green alone.
- **Red: presumedThings.walker**, "every source literal that names a thing declares it, or has its row", with 18 undeclared literals. It is green at the base, so this is THE STAGE'S. It is exactly the statement's "red and named" eighteen (step 8).

## 6. The gates and the governing files (EXECUTED, my runs at the tip; `sh scripts/gate-tail.sh`, exits read)
- `npm run typecheck:domain:strict`: exit 0.
- `npm run typecheck:ratchet`: exit 0.
- `npx eslint` on the stage's 39 src files: exit 0.
- The stage's 50 touched test files at the tip: 463 passed, 2 red (both classed in §4). At Q, the 30 that exist there: 2 red. One is an artefact of Q's conflict resolution (dossierPhoneFloorAllViews, taken from the line's side by my Q). The other is writerReach, red at the base too.
- The statement's classed reds, each file run at the tip and at the base: see §6b.

## 7. CENSUS-2, the measuring seat's command (EXECUTED; `census2.sh <tree> <out> 4 --files <the stage's 39 src files>`, both exits 0)

| kind | base 80b960171 (towns · lines) | tip ac8168c8c (towns · lines) |
|---|---|---|
| a | 716 · 619 | 678 · 523 |
| b | 70 · 99 | 70 · 101 |
| c | 292 · 296 | 276 · 155 |
| d | 377 · 24 | 350 · 15 |
| e | 60 · 20 | 60 · 20 |
| f | 720 · 210 | 309 · 53 |
| g | 720 · 14 | 720 · 14 |
| h | 21 · 68 | 2 · 2 |

- The tip's counts equal part 9's figures exactly.
- No kind rises in towns. Kind b's distinct lines rise 99 -> 101.
- By writer file, three rises (base -> tip):
  - EconomicsTab.jsx b 26 -> 29 towns and f 206 -> 213;
  - institutionDisplayName.js f 0 -> 7.
- Each new hit was read against Q's render: "a bad season would" under a famine, the Exports list under a siege, "Inns and taverns (district)" and "Bowyers & fletchers (guild)" as a house's name. **Each prints the same at Q** (4 of 4 rendered towns checked: r2s-famine-city-3, r2s-under_siege-city-2, r2r-town-27, r2r-city-29). The rises come with the line's arrival, not the stage's (CARRIED). The base lacks the line, so base against tip is not the stage alone.

## 8. The eighteen literals and the reader's row, read where they print (EXECUTED; `decl18.mjs`, `cultureScopeLine` over the 1536 at the tip and at Q)

| literal (settlementQuickGuide.js scope frames) | prints in | lacking its presumed thing |
|---|---|---|
| `streets`: civic square | 91 (village and up) | 0 |
| `streets`: agora | 78 | 0 |
| `streets`: in quarters by trade | 79 (town and up) | 0 |
| `quarters`: kin districts | 64 (town and up) | 0 |
| `market` (4 variants) | 70 | 0 without a market house |
| `temple` (2) | 94 | 0 without a temple or church house |
| `docks`: built around the harbour (2) | 35 | **5 without any dock, harbour, landing or fishing house** |
| reader's row `guild`: "run by guild and estate" | 60 | 0 without a guild house |

- **`docks` is FALSE in 5 towns** (MEDIUM, (a)):
  - r2s-indebted-village-3 (village, 75): "built around the harbour, on the coast, and run by civic association".
  - r2s-mass_migration-hamlet-1 (hamlet, 60).
  - rr3-thorp-plague_onset-port-0 (thorp, 29), and 2 more.
  - The gate is the record's water (`maritime`), not a harbour house.
  - At Q the same towns printed "the agora and the harbour": the stage struck the agora by size and kept the harbour. The clause is CARRIED. By the chair's method ("a seat that rewords a sentence owns it whole") the sentence is the stage's.
- **faithReading.js, 3 literals:**
  - `shrine`, ", and the shrines answer to no named god.": true by its gate, LOW where the roster holds one Wayside shrine (3 towns, the plural; r2s-famine-thorp-1).
  - `siege` and `temple`, "… the siege keeps its people from the next village's parish church.": FALSE beside its follower in 38 of 39 siege towns. It is §9's M9.
- **Outside the eighteen, CARRIED:**
  - "run by its estates" in 49 thorps and hamlets (r2r-thorp-7, 9 people): printed the same at Q.
  - "built around the Palace/government complex" in 27 metropolises (HIGH, `seatIntoPhrase`, the same at Q).
