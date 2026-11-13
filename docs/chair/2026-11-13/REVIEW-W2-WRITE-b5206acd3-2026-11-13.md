# REVIEW-W2-WRITE: the corpus lane at b5206acd3 (code tip a041a7bc5)

**Verdict: NOT CLEAR.**

The lane's cures mostly hold, and its counts are honest where they can be reproduced. But its new lines are false where they print far more often than the bar allows:
- Read where they print, 59 of the 151 new or reworded lines that print are false at HIGH or MEDIUM in at least one town. That is 96 of 416 reads.
- Four of these HIGH false sentences are re-read and confirmed by execution.
- One HIGH line the lane says it cured still names a house the town lacks; only its wording changed.

The bar is a fresh thirty towns with no HIGH and no MEDIUM false sentence. The lane adds false sentences of both ranks to the page.

**Reviewer:** REVIEW-W2-WRITE, for the chair session_01FE9mEws7PXYRYdjQPbSX15. Nothing was changed on `lane/w2-write-2026-11-13`.

**Base.** The brief named deb1544eb. The first hand-back names something else: the lane was cut from the W2-A leaves lane at 2c6435650 and then merged W2-B-DECLARE (9d5d6e091, at 202e58953) and W2-A-LEAVES (96d698de7, at e5cefd7cf).
- The lane's own writing begins after those merges. One commit of its own (d7ca1936e) lies between the two merges.
- I therefore built a third tree, `mbase`: 202e58953 with 96d698de7 merged in a scratch worktree, with no commit and no push. It is the lane before its own writing.
- A sentence printed at a041a7bc5 and not at `mbase` is the lane's own (OWN). One printed at `mbase` and not at deb1544eb came in with a merge (MERGED).
- The corpus itself is the same at deb1544eb and `mbase`: the two merged lanes touched no variant.

**Order kept.** The cold list was committed and pushed at c2b50f270, before I opened any hand-back, any list of new lines or any commit message. Everything below it was read afterwards.

## 1. The cold list (section 1 of the brief; `REVIEW-W2-WRITE-COLD-LIST.md` and `.json`)
**The towns.** Thirty fresh towns, five of each size, born in the app's own configuration shape (`selectedStresses`, `selectedStressesRandom:false`):
- 6 sieges and 7 famines. One of the famines came to a thorp whose stress panel was set to None.
- 12 other crises, plus 5 calm towns.

**How they were read.** Each town was rendered as its owner sees it, at the tip, at deb1544eb and at `mbase`. The 30 records are identical across the three trees. Nine readers read every line (37,771 lines at the tip).

**The count.**
- 1,551 entries in all.
- HIGH 86; MEDIUM 552; LOW 640, of which 273 are bare catalogue names with a count range.
- 8 of the HIGH and 82 of the MEDIUM are in the corpus's own words. That is a floor: the match is by template.
- No town reads clean.

**What prints at the tip and not at the base.**
- No HIGH line.
- 18 MEDIUM lines, 16 of them false claims new at the tip. By origin:
  - **12 are OWN.** The lane added 10 new false claims and reworded 2 old ones.
  - **6 are MERGED.** These are the W2-A leaves lane's "Reliance on magic: … · supplied by …" clause (4 lines) and its food-endurance figures (2). They are not this lane's.
- 28 LOW lines also print only at the tip; 21 are OWN.

The 10 OWN new MEDIUM false claims:

| Town | Sentence | Against |
|---|---|---|
| rww-thorp-calm-1 | Nothing threatens Cnocholme now, and nothing about the thorp would stop it if something did. Its safety rests on nobody wanting it. | a frontier beast threat; the same tab: "The thorp knows it needs specialists against the creatures"; a famine in force |
| rww-hamlet-famine-1 | Nothing threatens Ulfset now, … | the same, and "The hamlet may not come through this crisis" |
| rww-village-calm-1 | Nothing threatens Maghleigh now, … | frontier; "needs specialists against the creatures" |
| rww-village-famine-1 | Nothing threatens Naranjopeten now, … | a famine; "Its hungriest are turning to banditry" |
| rww-hamlet-famine-1 | Nobody ever thought Ulfset worth a wall, and nothing has yet given it cause to want one. | founded "as a defensive stronghold"; a frontier threat |
| rww-city-under_siege-1 | Visitors find Panteakra's market without asking. | under siege; the markets "critically impaired by siege" |
| rww-metropolis-under_siege-1 | Visitors find Naranjotepec's market without asking. | the same |
| rww-city-under_siege-1 | The city used to send its wool out half-worked; with the roads cut by the siege it piles up instead, and nobody here can finish it. | weavers, a dyer and a fuller; "Cloth Finishing ✓ Running" |
| rww-metropolis-under_siege-1 | The metropolis's soldiers are paid by the season and drilled by the week, whether or not anything comes. | the same tab: "its defenders are paid late or not at all"; under siege, something has come |
| rww-hamlet-calm-1 | Ormaker cannot produce its own salt, so it buys it in. | the roster has Salt works |

Two notes on the table:
- **"Nothing threatens X now"** is the second seat's rewording of DS-DEF-2 *neither walls nor force* v2. The base form, "Nothing has come for X", was true. The tag `no threat · crisis: any` reads a military threat only, so the rewording prints beside beasts and famine.
- **"Visitors find X's market"** is MARKET-OPEN v3, `[visitor · crisis: any]`. It now fills the slot under a siege because the third seat declared v2, "lives off through-traffic", `no crisis: under_siege`.

## 2. The claims, each by my own execution
### 2a. The debt cut's corpus lines (REVIEW-W2A-3's twenty rw3 towns, rendered by its own recipe at the tip and at `mbase`)
**The 13 HIGH, read by me.** Ten are claimed cured by the first two seats and three by the third.

- **Cured, and true where they were false (9):**
  - **#17:** "The thorp takes everything it can from the fish its country gives."
  - **#25:** "Chalahau keeps its palisade in repair and pays nobody to stand guard there."
  - **#55:** "Nobody at Xochioatl is paid to keep order, and for now the place keeps order well enough by itself." (the third seat's)
  - **#283:** Hochfurt's Garrison "short of what it needs from upstream", under siege.
  - **#340 and #344:** the siege twins at Lidostagnum.
  - **#805.**
  - **#867:** "The town's Mill has had no grain since the siege closed the roads"; Mills (2-5) are on the roster.
  - **#983.**
- **Still false (4):**
  - **#990, HIGH, the third seat's (EXECUTED).** The old line "Its Potter cannot work without clay" was reworded house-free and declared `no crisis: under_siege`. Its new siege twin, DS-ECO-12 *a house needs what the land lacks* v3, keeps `{institution}`. In the same town, rw3-town-under_siege-1, it prints "The town's Potter has had no clay since the siege closed the roads, and its work has stopped or soon will." The roster has a Brickmaker and no Potter. The false house moved into the new line.
  - **#964, MEDIUM, the third seat's.** Through-traffic is gone. In its place the Overview prints "The market stands where carts always stopped." beside "The market is shut and the caravans have stopped coming."
  - **#451, MEDIUM.** "Vatannuur's Garrison is short of what it needs from upstream" prints on the Economics tab. The Defense tab says "You can see the defence at Vatannuur is kept supplied".
  - **#1056, LOW.** The same reworded line, for an occupier's watch.

**The 81 MEDIUM** were read by a reader seat against the records (`probes/REVIEW-W2-WRITE/debt-med-read.json`); I re-checked a sample of five by hand.
- 23 are cured and true.
- 11 are reworded and still false: #43, 164, 166, 282, 472, 519, 523, 554, 755, 811, 834.
- 45 still print.
- 2 do not print before the lane either.

**The 14 "touched, still false".** The third seat claimed 3 cured.
- #24 and #105 are true.
- #755 is still false. "With only its fishing to fall back on, Shanmen feels every bad season" is printed where the river fishery is depleted.
- #166, cured by the second seat's rewording, is still false: "What Chichek's trades use comes in from elsewhere…" in a thorp whose one chain runs on its own fields.
- Six still print, which is consistent with the "waiting on a fact with no home" claim.

**The 37 MEDIUM lines no lane touches.** 36 still print. That agrees with the third seat's "cures none".

**Removals.** A count falling is not a cure, so I read what was removed.
- In my thirty towns, 55 prints of a changed variant leave the page between `mbase` and the tip. I read all 55: 52 were false where they printed, and 3 left by the uniform draw while still eligible.
- No pool lost a line. The corpus diff shows 46 removed texts, every one a rewording kept in its pool and vid.
- What the page says in their place is in the cold list and in §3.

### 2b. The cases the lane filled
Each new line was read in up to three towns of its case (§3):
- the thin crisis cases;
- the DS-GEN-9 event variants, which print in none of the 770 pages (glance mount);
- the walls with no guard, and the guards with no watch.

The guards-with-no-watch twins are where most of the HIGH reads fall (§3, H2 to H4).

### 2c. The seat's figures
- **Every census row equal.** By my run (`census-compare-deb1544eb-a041a7bc5.txt`), from deb1544eb: **no row rises and no row is new.**
  - Four rows fall: 5a 288→0, 6 296→0, 13 172→0 and 20 689→0.
  - 13 is the lane's own: the doubled clause was cut. The reworded line is true where I read it, except one LOW in a town whose magic is "None".
  - The other three falls arrive with the merged leaves lane. They are not this lane's cures.
  - The seat measured from 31f57e8eb, a mid-lane commit. From the true base the claim still holds.
- **The top share at most 0.483.** Reproduced for the third seat's own pools: DS-ECO-12 *a house needs what the land lacks* is 0.483 (167 of 346 prints on the 720). Across all 91 pools the lane touched it does not hold:
  - DS-GEN-18 STALLED is at **1.000**: its v1 prints nowhere, and its reworded v2 prints alone in 210 towns.
  - Eight more pools sit between 0.484 and 0.541: INSURGENCY 0.541, UPSTREAM WEAK 0.527, partiallyExploited 0.518, alchemists 0.506, readiness WEAK 0.493, the land cannot give it 0.487, food trades working 0.485, INCOME MIX 0.484.
  - STALLED's dominance predates the lane. Its only printing line is the lane's rewording.
- **Classes B and D.** The review's own regexes, on the census's 720, deb1544eb against the tip: **B 15 → 0, D 5 → 0.**
  - B: of the 12 replacements I read, 11 are true. Fengling (r2s-under_siege-town-1) now reads "Fengling lies open on every side; its watch keeps to its rounds while the danger everyone talks about is close" under a siege.
  - D: all 5 replacements read true.
  - The seat's 16 and 29 were taken on other seeds. The direction is reproduced.
- **Golden surfaces**, each surface's own test at deb1544eb and at the tip, with the failure output compared:
  - The generator golden master, the espionage fence, the PDF golden and the Herald desk golden are red at both trees with **identical** failures: unmoved.
  - The preset-lighting witness is green at both: unmoved.
  - **The dossier prose manifest moves.** Drift rows go from 954 to 1,050, and the mixed-pool audience arm newly fails ("expected 36 to be 208"). It is declared for the merge seat.

## 3. Every new or changed line, read where it prints (`REVIEW-W2-WRITE-LINES-READ.md`)
**The corpus diff, `mbase` to the tip** (`corpusdiff.mjs`): 173 new lines, 46 rewordings and 88 lines whose marks alone changed. This matches the three seats' lists: 62 + 68 + 43 new.

**Where they print** (`whereprints.mjs`, 770 tip pages): 120 of the new lines and 31 of the rewordings. 68 print nowhere and were not read in a town.

**The reads.** Up to three reads each by four reader seats, 416 in all. **141 reads are false:**
- 13 HIGH, 83 MEDIUM, 45 LOW.
- 86 of the 151 lines are false somewhere; 59 at HIGH or MEDIUM.
- 58 lines are proposed for strike.
- 32 lines fail the plain-style read, 4 read as machinery.

Confirmed by my own execution:
- **H2.** DS-DEF-2 *neither walls nor force* v6, `threat · crisis: any · no watch`: "You find Miroko open on every side, with nobody posted anywhere, while the danger everyone talks about is close." On the same tab: "Miroko is surrounded. Everyone who can keep a lookout is keeping one". It prints the same way in rw3-hamlet-under_siege-1 and r2r-hamlet-0. Under a siege the defenders are all of the town, and the line says nobody is posted.
- **H3.** DS-DEF-2 *walls with NO force* v6, `crisis: under_siege`: "Rathwell had nobody to put on its walls until the siege came…" where a Town watch stands (r2s-under_siege-town-3). The siblings v1 to v3 carry `no watch` (the second seat's, round 1); this siege twin does not.
- **H4.** DS-DEF-2 *Beasts & Monsters: settled, nothing organized* v6, `threat · crisis: any`: "You find Velipol with nothing organised against what has come out of the country…" where a Town watch and a free company stand (r2s-monster_pressure-town-2). It also prints at Malotsy, an occupied heartland thorp with no beasts on the page.
- **H1.** The Potter, above.

Read HIGH by a reader seat; I did not re-check these, so they are PLAUSIBLE:
- DS-ECO-12 *INCOME WEIGHT* v4, feast-day buying and selling in a besieged hamlet whose page says "nothing is bought or sold";
- DS-GEN-17 monastery v1, "a common sight on the way into" a besieged city with its gates barred;
- DS-DEF-5 *garrison PRESENT* v4, "whether or not anything comes", under a siege;
- DS-DEF-2 *walls with NO force* v4, "kept by its watch and nobody else", under occupation, beside "The occupiers' troops … protect it";
- DS-DEF-2 v10 under siege. By my own read this one is MEDIUM.

**The veto list.** Every line, its prints, its false reads, the strike proposals and the 68 unprinted lines are in `REVIEW-W2-WRITE-LINES-READ.md`. Lines I would strike, beyond the HIGH ones above:
- GEN-18 BOUGHT-IN v1, "cannot produce its own {good}, so it buys it in". It is false in every read: Salt works, a Stone quarry, local herbs. It also says "it" for a plural good.
- GEN-18 v4, "Ask where … {good} comes from", which prints "incense and votive candles comes".
- DEF-11 WALLED-STRAINED v3, "massive walls and fortifications was short of hands".
- SUP-2 UPSTREAM WEAK v1 and v2 as reworded. They call the failing upstream chain the town's own work: "Some of Vatannuur's livestock depends on supplies from elsewhere".
- GEN-18 STALLED v2, "short of what it needs from upstream". It says how the model works, and it prints alone in 210 of 720 towns.
- DEF-3 Moderate v1 as reworded, "nobody has the run of the town", beside an organised syndicate.
- ECO-12 religious houses v3 to v5, "Faith carries real weight in X's money", where the income list has no faith share.
- The slot fills that print catalogue labels: "palisade or earthworks" twice in one sentence, "gold/silver ore", "Military/Guard".

## 4. Commit 4dadb7e92 (`no crisis: debt` on DS-DEF-2 Economic Survival STRONG v3) against record 353
**Ruling: KEEP.**

**The measure.** I counted, among 120 indebted births, how many land in the STRONG band.

| Tree | Indebted births in the STRONG band | Files |
|---|---|---|
| The upkeep lane's tip c72917251, which builds record 353's one home for pay | **44 of 120** | `indebted.mjs`, `indebted-bands-*.txt` |
| This lane's tip | 21 of 120 | the same |

At c72917251 the indebted crisis already lowers the economic score once (`defenseGenerator.js`, the crisis rows' `indebted.sup`).

**Why keep.** The disqualifier does not read a second home for pay; it reads the crisis kind.
- In a STRONG town under debt, what prints in v3's place (v5 to v7) still says the town carries its debt and its business runs. That agrees with the band.
- So no two pay sentences on the page can part at a threshold.
- v3, "trouble … has not turned into a collapse, because the town can pay its way through it", is false of a debt the record says can never be repaid, whatever the band says. That makes it a normal-times line under the crisis that breaks it.

**Watch:** v1 and v2 of the same pool already carried `no crisis: debt`. If the upkeep lane's band ever stops lowering for debt, v5 to v7 still agree with it.

**Related, not this commit.** The second seat's DS-DEF-2 WEAK no-defender lines read no pay home: "Langenbrunn pays nobody to defend it, and could not find the wages if it had to hire someone in a hurry", printed for a Wealthy village (#811). That is record 353's class, for the seventh upkeep seat.

## 5. The census counter
As in 2c: deb1544eb against a041a7bc5, every row level or lower, no new row. **No rising row, so neither ORIGIN nor EXPOSURE arises.**

The census's patterns do not count the classes this lane adds, such as "Nothing threatens X now" or the siege twins. The cold list and §3 are the measure for those.

## 6. The whole suite at a041a7bc5
(Filled after the run ends: see the section at the foot.)

## 7. Plants for the lane's guards
The lane added no test file and no test title. Its guards are register rows it lowered through their doors. Each plant was made in a scratch worktree at the tip, by editing the annex and regenerating through `gen:dossier-prose`, then restored.

| Plant | Guard | Result |
|---|---|---|
| Strip `institution: granary` from "People at {settlement} are glad of their granary…" | presumedThings ARM 1 | **Reds on its fault:** the planted line, and the desk's key literal for the same pool (one fault, two rows). **But the walker is already red at the tip:** 2 failing tests, 16 rows, the base's key-implied lines carried for W2-B-DECLARE. A new fault changes no gate colour; it shows only as an added row. |
| Restore the doubled "…and go on." on DS-DEF-9 | pageCensus walker, the grid | Red on the two banked thorps' P13 rows only, against 14 of 14 green when clean. **Clean.** |
| Strip `no crisis: under_siege` from DS-ECO-9 DEFICIT v1 | the undeclared-lines register | Red on "DS-ECO-9::DEFICIT: 1 → 2" only. **Clean.** |
| Swap that same cure's `no crisis: under_siege` for `no crisis: famine` (the line again prints "not enough comes in" under a siege) | the lane's own fast set (20 files) | **No truth guard reds.** Only four byte and freshness registers red (the prose byte ratchet, two wiring-census interlocks, the declared-columns census); they red on any corpus byte and are re-keyed in every commit. The lane's disqualifier cures have no guard that would catch one being undone or mis-written. |

## Findings, ranked
| # | Rank | What | Where | EXECUTED / PLAUSIBLE |
|---|---|---|---|---|
| H1 | HIGH | The debt cut's #990 is not cured. The siege twin of DS-ECO-12 keeps `{institution}`: "The town's Potter has had no clay since the siege closed the roads…" | rw3-town-under_siege-1 (a Brickmaker, no Potter) | EXECUTED |
| H2 | HIGH | DS-DEF-2 *neither walls nor force* v6 under siege: "open on every side, with nobody posted anywhere" beside "Everyone who can keep a lookout is keeping one" | rww-hamlet-under_siege-1, rw3-hamlet-under_siege-1, r2r-hamlet-0 | EXECUTED |
| H3 | HIGH | DS-DEF-2 *walls with NO force* v6, a siege twin without its siblings' `no watch`: "Rathwell had nobody to put on its walls" | r2s-under_siege-town-3 (Town watch) | EXECUTED |
| H4 | HIGH | DS-DEF-2 *Beasts: settled, nothing organized* v6: "nothing organised" where a watch and a free company stand | r2s-monster_pressure-town-2; r2r-thorp-40 | EXECUTED |
| H5 | HIGH | Five more HIGH reads of new lines under siege or occupation (§3, list) | as listed | PLAUSIBLE |
| M1 | MED | The rewording "Nothing threatens X now" prints beside a beast threat and under famine | rww-thorp-calm-1, rww-hamlet-famine-1, rww-village-calm-1, rww-village-famine-1 | EXECUTED (cold list) |
| M2 | MED | Six more OWN new false claims on the thirty towns: Visitors find X's market (siege) ×2, Ulfset's wall, Panteakra's wool, Naranjotepec's soldiers paid by the season, Ormaker's salt | §1 table | EXECUTED (cold list) |
| M3 | MED | Of the lines read where they print, 83 MEDIUM false reads beyond the above, across 59 lines | `REVIEW-W2-WRITE-LINES-READ.md` | read by reader seats, sample re-checked |
| M4 | MED | Debt-cut lines claimed cured and still false: #755 (depleted fishery as the fallback), #166, #964 (market "where carts always stopped" under siege), #451 (garrison short beside "kept supplied") | rw3 towns | EXECUTED (#964, #451); reader seat (#755, #166) |
| M5 | MED | No guard reds when a cure's crisis disqualifier is undone or mis-written | plant 4 | EXECUTED |
| M6 | MED | GEN-18 STALLED's reworded v2 is the pool's only printing line (top share 1.000 in 210 of 720), says how the model works, and is false where the Defense tab says the supply is kept | census 720; rw3-metropolis-calm-1 | EXECUTED |
| L1 | LOW | presumedThings ARM 1 is red at the tip (base reds), so the lane's register shrinks are guarded only by row diff | plant 1 | EXECUTED |
| L2 | LOW | The seat's census and its "≤ 0.483" were measured from 31f57e8eb and on its own pools. From deb1544eb no row rises (holds); lane-wide, nine pools exceed 0.483 | §2c | EXECUTED |
| L3 | LOW | Grammar after slots: "incense and votive candles comes", "buys it in" for plurals, "walls and fortifications was", "palisade or earthworks" twice | §3 | EXECUTED (cold list and reads) |

**What the chair must rule.** Whether the lane goes back for a fourth seat before it merges. My recommendation is yes:
- re-gate the twins whose siblings carry `no watch`, `guardPresence` or a crisis exclusion;
- remove `{institution}` from the siege twin;
- strike or re-gate the 58 lines proposed;
- add a guard per disqualifier cure, a fixed town in which the cured line must not print.

## What I did not measure
- More than three reads per line; the 68 lines that print nowhere were not read in any town.
- The reader seats' MEDIUM reads are not each re-checked: 5 of the debt cut's and 4 of the new lines' HIGH were checked by hand.
- The B and D classes on the defence review's own 260 seeds, which I do not have; I measured them on the census's 720 instead.
- The PDF, Tonight and export surfaces of the corpus lines: the read is the owner's dossier.
- The merged tree of all the wave's lanes.

## Hazards
**Refs and local config** were snapshotted before the suite and before and after each push.
- My `npm ci` (husky's prepare) set `core.hookspath=.husky/_` in the repository's local config. I unset it at once, restoring the snapshot.
- After that, the only ref changes were my own branch, the fetched remote refs and the ledger branch `review-fixes-2026-07-08`, which the brief told me to create.

**Pushes.** The pushes ran with no hook installed, with nothing skipped and no `--no-verify`.
