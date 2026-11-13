NOT CLEAR

# REVIEW-POWERS-3 — `lane/powers-follow-up-2026-11-13` from 714381934 to 96a6ced46 (the second and third seats), 2026-11-13

An independent reviewer's reading of one stage. Nothing on the lane was changed.

- **EXECUTED** means run by this reviewer on this reviewer's births. **PLAUSIBLE** means read, not run.
- The step-1 list was committed and pushed (d95ef4929) before the hand-back or any commit message of the range was opened: `docs/chair/2026-11-13/REVIEW-POWERS-3-LINES-READ.md`.
- Probes and results: `docs/chair/2026-11-13/probes/REVIEW-POWERS-3/`.
- **The corpora:**
  - The census's 720, born and rendered at both trees by CENSUS-2's `census2.sh`.
  - 360 more births in the app's own configuration shape, rendered at the tip and born at the base (seeds in `seeds.extra.txt`).
  - The lane's 4,305, born at the tip by the earlier reader's `births4305.mjs`.
  - The 720 also born at the second seat's end, 91a3a9623, to split the field diff by seat.

## THE VERDICT IN ONE PARAGRAPH

Every new or reworded line I read where it prints is true in every town, save four LOW placements. That is 47 lines and classes on 1,080 towns. No line the stage added is false at HIGH or MEDIUM. Every cure the hand-back counts holds by my own run:
- the women's rows: 347 → 0 on the 720 and 0 on the 4,305;
- the hand-formed possessives: 22 → 0 on the page;
- the Breakdown: 518 of 520 → 0 of 1,080;
- the head rows under their own leaders: → 0;
- the lords' offices and debts: → 0 on the 720 and the 4,305.

Each of 30 plants reds its guard and no other guard but one that covers the same fault; one cure has no guard. The gates are green. CENSUS-2 rises in no kind by towns.

The lane is NOT CLEAR for one MEDIUM class in its own file, which its own statement lists and leaves. The commanding-claim descriptions the claim table does not cover still print beside a Minor or Suppressed label: 122 on the 720, 174 prints in 1,080 towns. One example is "Major church institutions hold structural influence … leverage across multiple civic domains" beside "The Holy Compact · 5 · Suppressed". These are the #111/#639 class the stage set out to cure, written by `rulingStructure.js :: generatePowerStructure`. The release bar will meet them. The chair rules whether the fourth stage owns them.

## FINDINGS, most serious first

### M1 — MEDIUM, EXECUTED, the lane's own file, an old class the stage cured in part. The claims the table does not cover still print beside Minor or Suppressed.

**The cure.** `power/claimStanding.js :: settleClaimsToLabel` replaces nine commanding claims with their ladder's rung when the final label is Minor or Suppressed.

**What remains.** Five sibling claims of the same ladders carry no such condition and still print beside such labels:
- `r2r-city-17`, The Holy Compact 5 · Suppressed: "Major church institutions hold structural influence. Land grants, hospital networks, and moral authority give them leverage across multiple civic domains."
- `r2r-town-55`, Landed Gentry 17 · Minor: "Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return."
- `r2r-metropolis-2`, The Peerage 4 · Suppressed: "Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power."
- `r2r-city-18`, The Order of the Watch 7 · Minor: "Standing army with genuine political weight; command appointments are patronage, and the council knows it."
- `r2r-city-10`, Merchant Guilds 20 · Minor: "The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased."

**Counts** (`rungcount.mjs`, records):
- The class beside Minor/Suppressed on the 720: **453 at the base, 122 at the tip**. Of the 122: Major church 40, ruling class = merchant class 26, great families embedded 22, militarised nobles 18, standing army 16.
- In the 1,080 towns: 174 prints, 60 of them in descriptions the stage itself rewrote (their standing sentence was settled) with the claim left in.
- The hand-back counts the same residue "120 uncovered, listed". It names the standing army, Major church institutions and the craft guilds, not the noble and merchant ones above.

**How bad.** MEDIUM: two places on one page disagree, the description against its own label. Not origin: the lines are old, and the stage cut the class from 453 to 122.

**Cure, the lane's (not tried here).** The table's own rule, row by row, for the five: a Minor and a Suppressed rung from each line's own ladder.

### M2 — MEDIUM, EXECUTED, not the lane's file: the twin of the stage's crown cure. A self-governing wartime town still names a crown elsewhere on its page.

In all three self-governing (City-state government) wartime towns born, the stage's new lines read true: "An army quartermaster came last week…", "Authority flows through military channels now.", "Emergency body …". But the same page prints:
- "A crown officer has arrived with requisition orders that will strip the settlement of something it cannot spare."
- "Supply caravans pass through on crown requisition."
- "<town> is in a kingdom fighting a war it may not win."
- "…sold to crown contracts."

The towns: `rww-metropolis-wartime-404`, `-419` and `rww-metropolis-wartime+infiltrated-300`.

The stage's guard (`sovereignNoCrown.test.js`) asserts the Power tab and the account of the war only. The writers are the crisis's and the news's (stressTypes.js and others, not this lane's). For the chair to route. The stage's own lines are not false.

### M3 — MEDIUM, EXECUTED, not the lane's file: the twin of leftover 1. A roster card still names a thieves' guild the town lacks.

The stage's rule (`crimeSignal.js :: withTownsOwnUnderworld`) reaches the minted faces. All 5 of its "the local underworld" lines read true.

But the roster's cards in towns with crime and no thieves' guild still read "On the payroll of the thieves' guild as a silent informant": **38 of 86 such secrets in 1,080 towns, identical at the base.** Example: `r2r-town-26`, Sophronios Chomatenos, the tavern keeper. The town's crime is a "Fence (word of mouth)" and no thieves' guild stands among its powers.

The roster's rule (`mergeNPCLists`, npcGenerator.js, named to the first round-two seat) rewrites only where there is no crime at all. For the chair to route.

### L1 — LOW, EXECUTED. R1's re-deal gives the lords the common pool's plot hooks and clothes.

Minting the lords in the `other` category re-deals their clothes, impression and hook. The commit declares it.

- **Hooks.** Office hooks on lords fall from 61 to 6 (720 + 360). Hooks that presume a trade rise from **34 to 51** of 279 lords: "Their apprentice has been talking to a rival, and came back with an offer to buy them out." (new to lords, 7), "A customer paid them with a ring that someone else has reported stolen." (1 → 9), "Their best customer owes them a year's takings…". Example: `r2r-metropolis-45`, Lokesh Das, the lord of Noble Houses.
- **Clothes.** 25 of 151 lords wear "work clothes patched by someone who loved them" and 17 "second-hand fine clothes that don't quite fit".

The class is old (34 at the base); the move raises it. LOW.

### L2 — LOW, EXECUTED. Four rungs the claim table places print a clause their town makes false.
- **"…present in council discussions through intermediaries."** The Thieves' Guild's Minor rung where no council governs: 12 towns of the 720 at the base, **40** at the tip. Examples: `r2r-city-19` (Royal Authority), `r2r-city-16` (Noble Governorship).
- **"Gentry families … outpaced by merchant capital in raw financial leverage".** `r2r-town-28`: Landed Gentry 15 against Merchant Guilds 9 and Craft Guilds 7. `r2s-wartime-town-0`: no merchant power at all.
- **"Noble families … competitive with merchant capital."** 11 of 34 new prints stand in towns with no merchant power (`rww-city-calm-306`, `r2r-city-6`).
- **"Merchants with local reach; … without yet being the dominant commercial voice."** Where they are the leading merchant power: `r2r-city-51`, Merchant Guilds 30 beside The Trade Compact 17.

### L3 — LOW, EXECUTED. The head-row cure removed true rows with nothing in their place.

89 cards on the 720 lost their structural row. A read of 30: **11 were TRUE**. In each, the card heads a non-governing body of its kind under a governing body of the same kind, whose leaders it does serve under:
- `r2r-town-2`, Stylianos Nestongos, the abbot of Religious Authorities 26, under the governing Church Council 48;
- `r2r-town-18`, Sona Parekh, the smuggler heading the Thieves' Guild, under the Corrupt Council.

Nothing prints in their place. That is against the brief's "a case left empty gets a line true in it". No false print results.

### L4 — LOW, EXECUTED. One cure has no guard.

`generateSettlementPipeline.js :: refreshRelationshipProjections` styles the role words on a regen. With that line put back to the raw role, **no test of the stage's guards reds** (plant `refresh-role`; 23 guard files, all green). Its twin in `ties.js` reds two guards.

### L5 — LOW, EXECUTED. R1's tie re-deal moves three families its declaration does not name.

The declaration names the lords' cards, the ties in 53 births and the goals in 21. Inside those same towns, three more families move between 714381934 and 91a3a9623 (`fielddiff.mjs`):
- `conflicts[]`: parties in 12 towns, stakes 11, intensity 4, hooks 11. The quarrels are drawn from the rival ties.
- `prominentRelationship`: 15 towns.
- `pressureSentence`: 4 towns.

All are confined to the re-dealt towns: the move is real and in scope, but undeclared.

### L6 — LOW, EXECUTED, old. Smaller residues beside the stage's work.
- A woman's disambiguated name keeps the masculine title: "Lady Abbess Járnsaxa Helgason (the senior abbot)" (`r2r-metropolis-18`; 22 lines in 2 towns). The hand-back names this residue.
- The plain fishmonger's undeclared boat lines: "Owes the boats a month of fish…" with no water (`r2s-monster_pressure-village-2`). It is a twin of the master fishmonger's declared line.
- A hidden power carrying a standing sentence ("They are always at the table…") beside "Its presence is not known to the settlement." (`r2r-village-48`; identical at the base).

## THE CLAIMS (step 2), each by my own run

| the hand-back's row | its count | mine | read in its place |
|---|---|---|---|
| R2: women's rows against the card, 720 | 347 → 0 | **347 styled rows on women, 0 "the lord" for a woman** (`lines.mjs` L01/L01b); every man's row is his role | "the lady" / "the abbess" / "the senior abbess" / "the high priestess": TRUE in all 539 rows of 1,080 towns |
| R2 on the 4,305 | 479 → 0 | **0 rows with "the lord" for a woman** in 239,472 role slots (`fem4305.mjs`). The 779 women "the priest" carry a title with no feminine word ("Father/Mother" is the honorific). | TRUE |
| R2 on the Power tab's patronage rows | 10 → 0 | 0, save the name-qualifier residue (L6) | TRUE |
| R1: office lines, governing debt rows on lords | 45 → 0, 11 → 0 (720); 0 (4,305) | **0 / 0 on the 720 and the 360; 986 lords, all `other`, and 0 debt rows on the 4,305** | Lords' rows: "Heads an old family…" 36, "…while the seat fails" 21, "Belongs to a lesser family…" 10: TRUE in every town |
| R3 hand-formed possessives | (0 → 0 by possess.mjs) | **a power's "s's" on the page: 22 in 548 base dumps → 0 in 1,080** | "Merchant Guilds' requests": TRUE |
| the claims beside Minor/Suppressed | 342 covered → 0 | covered → 0; **the class 453 → 122** (M1) | the rungs: TRUE but for L2 |
| the head rows "under" its leaders | 290 → 0 | 0 on a first of its power | the removed rows: 11 of 30 TRUE (L3) |
| #640, #295, #337, #565 | 8, 4, 23, 1 → 0 | 0 each; the new lines TRUE (LINES-READ L13a, L15, L10, L11b) | TRUE |
| Breakdown (A) | — | **518 of 520 base dumps → 0 of 1,080** | the governance paragraph's words ("Safety and strong defences earned it."): TRUE |
| leftover 1, E, C, D, H, I, G | | LINES-READ sections E, G, B, F, I, H | TRUE |

**The standing sentences settled to the final roster (H).** 257 standing tails changed on the 720. A read of 28 against the final figures: all TRUE, two LOW ambiguities (LINES-READ L14).

**The title disqualifiers (D).** No declared line prints where its water is lacking, in 1,080 towns. 191 declared lines still print where their water stands, so the lines are kept where true. The ten replacements read are all true.

## THE LAWS (step 3)

**The field diff** (`fielddiff.mjs`, the 720, whole records):
- **714381934 → 91a3a9623, the second seat.**
  - The lords' cards (category 151, physical 151, plot hooks 127, presentations 286, secrets 94, goals 24/29/46): R1 and D and leftover 1.
  - Structural lines on 122 cards: G.
  - Ties in 53 towns: R1.
  - Faction descriptions in 314 towns: H and I.
  - **Plus conflicts, prominentRelationship and pressureSentence** in the tie-moved towns (L5).
- **91a3a9623 → 96a6ced46, the third seat: exactly the families it declares.**
  - The relationship role words: 142 / 95 towns.
  - Faction descriptions: 177 towns.
  - Structural lines: 191 towns, 84 rows removed.
  - The conflict issue and description: 21 towns.
  - Nothing else moves.
- **No new key in the settlement record**: no top-level key added or removed; no new field on a card or a power.
- **The draws.** The fork census (`generationForkCensus.test.js`) is in the classed red list at the base too; read in section 6. The ruling issue's hook key is kept (`conflicts.js` reads the issue's old id): with it put back, `conflictRulingIssue.test.js` reds.
- **No change to the vocabulary file**: `factVocabulary.js` is not in the range's diff.
- **No name a user can hide written into a new stored sentence.** The underworld rule writes "the local underworld", never a criminal power's name; the plant `underworld-names-power` reds `mintedFaceUnderworld.test.js`. The settled standing sentences name powers, as the base's did (an old class, unwidened in kind).

**The draft record.** All 51 registered surfaces are in it: 6 moved, 45 unmoved, each with a measure at 1900b88fe. Measured here: see section 6.

## THE GUARDS (step 4): a plant for each

`plants.py`: each plant puts one cure back, runs the stage's 23 guard and changed test files, and restores the file from git. Results: `results/plants.summary.txt`.

**30 of 31 plants red, and each reds only its own guard.** Two reds in a second file cover the same fault:
- `breakdown-tab` also reds the two re-keyed Power-tab pins;
- `ties-role` also reds `regenPreservesUserCanon`'s copy check.

| plant | reds |
|---|---|
| breakdown on the tab / in the PDF | legitimacyPlainWords (5 / 2), powerTabSupport 2, powerGovernanceAccount 1 / — |
| possessive rank 3 / captured | dmPowerLinesPossessive 2 / 1 |
| midwife | midwifeHonorific 1 |
| criminal house default | criminalHouseNoDefault 3 |
| patronage styled | patronageStyledTitle 1 |
| keeper bare / doubled | seatKeeperStyledName 1 / 1 |
| ruling issue text / hook key | conflictRulingIssue 2 / 1 |
| under row / under kinds dominant / house kinds | headOfItsPowerRow 2 / 2, npcStructureHouseKind 1 |
| noble council | nobleLineNamesTheSeat 1 |
| lord government | lordNotGovernment 6 |
| minted underworld / names the power | mintedFaceUnderworld 4 / 1 |
| ties role / **refresh role** | styledTitleOnRows 3 + regenPreservesUserCanon 1 / **none (L4)** |
| title lines | titleLineDisqualifiers 5 |
| sovereign vignette / factions / plumbing | sovereignNoCrown 2 / 1 / 1 |
| standing level / host / figures | standingAgainstFigure 5 / 1 / 2 |
| claims / Minor only | powerDescClaimLabel 2 / 1 |
| steward note | stewardNoteReadsWhole 1 |
| infiltrator | stressFactionNames 1 |

**The cures by condition with no guard:** `refreshRelationshipProjections`'s styled role (L4). The five uncovered claims (M1) have none, being uncured.

## THE LEAF `seatKeeperStyledNameOf` (step 5)

On every vacant seat born (91: 31 on the 720 and 60 on the 360), the leaf returns the caretaker's form of the seat's office, then the name. Examples:
- "Acting Master of the Guilds Pavithra Shastri" (the Merchant Guild Council);
- "Regent Oda Kauf" (Royal Authority);
- "Acting Lord Warden Klaus Schneider" (the Ecclesiastical Council);
- "Acting Headman Zuhuy Chuc".

It never returns a bare title and never a doubled office word. Each form agrees with the seat row's ("… keeps the seat meanwhile."). `results/keeper.txt` lists every form with its seat.

The leaf has no reader at 96a6ced46. The hand-back says another lane's Tonight sheet and conflict card read it, so it prints nowhere yet.

## THE GATES AND THE SUITE (step 6)

- **The strict-domain gate, the type ratchet, and eslint on the 59 touched src and test files**, at the tip, through `scripts/gate-tail.sh`: **exit 0, exit 0, exit 0**.
- The stage's guard files: section 4, all green at the tip (23 files, 116 tests).
- The classed reds: see the addendum below.

## CENSUS-2 (step 7), EXECUTED

`census2.sh` at the tip and at the base on the 720, 4 workers, each exit 0 (`results/c2compare.txt`).

- **By towns, every kind is equal**, base against tip: a 716, b 70, c 292, d 381, e 60, f 720, g 720, h 21.
- **Distinct lines:**
  - h rises 77 → 79 and f 345 → 346. In the same towns, these are the lords' re-dealt rows and the abbess's styled name: "the lady · grudging · Master of the Guilds" for "the lord · …". No new fault.
  - a falls 619 → 615 and g 14 → 6.
- **For the lane's files:**
  - titleSecretsPresentations.js a: 69 → 16 towns.
  - rulingStructure.js a: 4 → 0 and claimStanding.js a: 0 → 3. The old "Church institutions hold direct temporal power…" beside a Significant label is now traced to the claim table that also spells it: an attribution shift, 4 → 3 in all.
  - factionStanding.js a: 2 → 1 lines.
  - Every other lane file is equal.
- **No kind rises.**

## THE LINES I WOULD STRIKE (for the owner's veto)
- The criminal Minor rung's "present in council discussions through intermediaries" where no council governs.
- The noble and gentry rungs' merchant clauses where no merchant power outweighs the nobles.

## WHAT I DID NOT MEASURE
- The PDF's text and the Foundry export were not rendered. No PDF or export file reads a relationship row's role.
- The foundling line under a forbidding content profile: every birth here is `grounded`.
- The 4,305's office lines: its compact rows carry no structural lines. I counted the category, the debt rows and the women's rows only.
- The whole suite: not run. The red files the seat names were run instead (see the addendum).
