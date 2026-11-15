# BAR3-CORPUS hand-back (REVIEW-BAR-3's and the wide read's rows of CORPUS-DEF and CORPUS-ECO)

Seat BAR3-CORPUS, branch `lane/bar3-corpus-2026-11-15`, cut from the joined line at 59185b62a (the tip read 59185b62a). All work in a scratch worktree; nothing merged.

THIS IS MY HAND-BACK, pushed with batch 1 (by time: the meter read 0; about eighty minutes): one batch: of my four worklists' 31 rows, 21 cured, 1 struck, 2 named for other seats (C4510, C20093; with two lines of my directions that are not my files'), 7 left in order (below). After this push I push nothing more.

## The rulings I worked to (the chair's BRIEF-BAR2 with BRIEF-BAR3's amendments; each vetoable by the owner)

My directions, copied from BRIEF-BAR3 § BAR3-CORPUS:

- (C1) THE GATES ("Everyone comes in by the gates, where the guard sees them."; "You come into <town> by a gate..."; "every arrival goes through a gate") where the page says smugglers have ways in beneath the walls, where no watch stands, or where the palisade has no gate: a mark on the smuggling fact and on the force that would see them.
- (C2) THE SUPPLY LINES OF THE DEFENCE AND OF FOOD ("The workshops that should feed and equip <town>'s defence are failing..."; "The supply book for <town>'s defenders runs short..." where the chains are vulnerable only; "<town>'s food trades are failing, and each season..." where the food record is Secure with months in store; "At <town> the usual work no longer yields enough baked goods, and part of the shortfall is made up by means beyond..." where magic makes none of the food; "What is already in store is all there will be until it lifts." where food is still grown or made by magic under the siege): each reads the record's own figure.
- (C3) WHAT THE TOWN LIVES ON ("<town> lives on what comes out of the ground..." where income is market taxes, tolls or smuggling; "Magic/Faith carries real weight in <town>'s money." at two to six in a hundred; "The seasons keep being profitable." under a siege and a famine; "<town> earns most of its living from two or three trades..." with twelve sources; "<town> is doing well, and its officials have little reason to sell" beside corrupt officials): the income record decides.
- (C4) CRIME AND ORDER LINES AGAINST THE HOUSES ("one ring" beside several criminal houses; "no single dominant organisation" beside one syndicate; "Thieves are scarce now" and "very little street violence" beside a crime-wave tension; "Organized criminals ... outweigh the law" beside unorganised crime; "the books record no gang, guild or racket" beside black-market income; "nowhere to hold the guilty" beside cells): the crime key and the houses decide.
- (C5) ONE VOICE OF GOVERNMENT ("one person gives the answer ... nobody to ask for a different one"; "one audience with the <title> gets a decision ... nobody to appeal to") under a council of three or under an occupier who vetoes; "The church and the garrison ... act as one" beside a quarrel of the two; "can drive off what attacks" with a watch alone under a critical monster bar.

Premises measured false or re-aimed (one line each):
- C1's "a mark on the smuggling fact": the vocabulary has NO smuggling atom (the smugglers' line is `src/generators/safetyLineTruth.js`'s, keyed on a house on the roster), and no new word is mine to add: the gate lines are REWORDED to claim the road only (true beside smugglers and a port). "Everyone comes in by the gates, where the guard sees them." is `src/generators/safetyProfile.js`'s, not my files': NAMED.
- C2's "What is already in store is all there will be until it lifts." is `src/generators/economy/foodBalance.js:227`'s: NAMED.
- C3's income-weight lines rest on `compound.religionInfluence` / `magicInfluence` >= 60 (an influence score), not on the income share: the lines are reworded to claim the weight of the houses' word and of what magic can do, never a share of the money.
- C5: the ruling-body fact is true in 564 of the 720, and the `autocrat` pool's one-person lines print false in 8 of 10 (v2, v4) and 4 of 7 (v1, v3): a mark and a twin were tried and refused (the twin moved the projection's owner-gated variant count; the `ruling body` atom is unanswered on the power desk's lens fixture, leaving the pool mute): the four are REWORDED to claim the seat's speed, never one person or no appeal.
- C3's "is doing well, and its officials have little reason to sell" is pinned by `crimeLineDisqualifiers.js` (not mine): NAMED.
- C4's "one ring", "no single dominant organisation", "Thieves are scarce now" and "nowhere to hold the guilty": not rows of my four worklists; not measured this round (left, below).

## Batch 1: the measure (720 census towns at 59185b62a; "false" = the record or the page denies it) and the cure

One batch, one writer (the annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` and its generated leaves), text and marks only. Towns before -> after are the inventory diff's (before = the census at 59185b62a, after = the census at my tip; `inventory_diff.py`).

| row(s) | line (pool, vid) | prints / false (before) | the state that made it false | cure | towns after |
|---|---|---|---|---|---|
| C20265 | DS-DEF-5 FIXTURE: gates v3 "You come into X by a gate, and someone at the gate sees you come." | 82 / 40 | the smugglers' line ("smugglers have ways in beneath the walls") or a port on the page | REWORDED: the road only | 82 -> 0 |
| (class) | FIXTURE: gates v1 "...that is where anyone arriving is first seen" | 66 | the same | REWORDED: the road only | 66 -> 0 |
| C31292 | FIXTURE: gates v4 "...and the town can close them against it" | 21 / 0 in the 720 (its read town is occupied) | an occupier commands the gates | REWORDED: "the gates can be closed" | 21 -> 0 |
| C51362 | DS-DEF-5 walls PRESENT v2 "every arrival goes through a gate...; trouble can only get in where the town decides" | 34 / 16 | the smugglers' line | REWORDED: "every arrival by road", the trouble clause out | 34 -> 0 (its new words print in 91: one fold, no tier noun) |
| (class) | walls PRESENT v1 "a stranger enters where the town intends him to" | 107 (three tier folds) | the same | REWORDED: "a stranger who comes by the road" | -> 0 |
| C20202 | DS-DEF-2 CHAIN: defence short v1 "The supply book ... runs short: the trades ... are failing" | 35 / 22 | no garrison, fortification or mercenary chain impaired (vulnerable only: the generator's own `chainsOf` moves the score on a vulnerable garrison chain) | REWORDED: "not on a sure footing" | 35 -> 0 |
| C17450 | CHAIN: defence short v3 "The workshops ... are failing" | 36 / 31 | the same | REWORDED | 36 -> 0 |
| (class) | CHAIN: defence short v2 "are struggling", v4 "keep failing" | | the same | REWORDED | |
| C23072 C31251 | DS-DEF-2 CHAIN: food trades failing v3 "each season they fail the town has less put by" | 14 / 14 | food Secure or Surplus, or six months and more in store (the food-processing chain is impaired, so "failing" stands; the shrinking store does not) | REWORDED: "what they fail to put by is food the town would miss if it were cut off" | 14 -> 0 (C31251: 0 -> 0, its fold prints in none of the 720) |
| C40450 C47266 | DS-ECO-12 INCOME MIX: two or three sources v1 "earns most of its living from two or three trades" | 117 / 61 | the pool's key is a leader of 20 to 49 in a hundred; 61 towns have not two or three sources of ten in a hundred or more (every one of the pool's towns has four or more sources) | REWORDED: "its biggest trade earns a real portion of its living, but none of its trades could carry the place alone" | 117 -> 0 |
| (class) | INCOME MIX v2 "you will hear two or three trades named" | | the same | REWORDED: "more than one trade named" | |
| C3145 C30428 | DS-ECO-12 INCOME WEIGHT: the religious houses v1 "Faith carries real weight in X's money ... a large part of the town's business" | 91 / 31 under ten in a hundred (median of the pool's 293 records: 8; max 30) | the pool's key is `compound.religionInfluence` >= 60, an influence score, not a share | REWORDED: the houses' word, "whatever their own share of its money" | 91 -> 0 |
| (class) | religious houses v2 "among its biggest buyers and employers" | 91 | the same | REWORDED: "heard in its dealings" | |
| C0943 C21200 | INCOME WEIGHT: the practice of magic v1 "Magic carries real weight in X's money" | 39 / 24 | `magicInfluence` >= 60, not a share; and 4 of the 39 print "No arcane practitioners on the rolls" | REWORDED: what magic can do is reckoned with, "whatever its own share of the town's money"; no practitioner presumed | 39 -> 0 |
| (class) | magic v2 "The people who work magic ... are among its biggest buyers" | 23 (1 with no practitioner) | the same | REWORDED: "Magic is reckoned with in X's dealings, whatever it earns." | |
| C25445 | DS-ECO-8 MODERATE v2 "Things are fine. Not comfortable, not tight" | 11 | the rung is the purse's; the reader's thorp is Dangerous, Tense, in a legitimacy crisis | REWORDED: "Money at X is neither comfortable nor tight" | 11 -> 0 |
| C25344 | DS-DEF-3 Dangerous v2 "Organized criminals ... outweigh the law outright" | 1 town (r2r-village-10) (0 at the row's fold) | crime diffuse or none | REWORDED: "Crime at X now outweighs the law outright, and nothing in the town is safe from it." (a mark `organised crime` was tried first and REDDED `factLayers`: the Dangerous key may not read the crime atom above its layer: a law: cured at its cause by the reword) | 0 -> 0 at its fold (by its base picks: the reworded v2 takes the old v2's draws; see the note below) |
| C12393 | DS-DEF-4 structure organized v4 "very little street violence", and its class v1 "random violence is put down", v3 "Visitors ... are not robbed" | 34 / 0, 26 / 2, 43 / 1 under a famine | a famine (hungry stealing; the read town under siege and famine) | MARKED `no crisis: famine`; v2 stays | v4 34 -> 34 (no famine town prints it in the 720), v1 26 -> 24, v3 43 -> 42: each fewer by exactly its measure |
| C29755 | DS-POW-5 autocrat v2 "one person gives the answer ... nobody to ask for a different one" | 10 / 8 a ruling body of more than one (+1 occupied) | the record's ruling body (true in 564 of the 720) | REWORDED: "the answer comes quickly, and asking again seldom gets a different one" (no mark, no twin: the desk's lens test and the crisis-blind instrument need the pool drawable without the atom) | 10 -> 0 |
| C31154 | autocrat v4 "nobody to appeal to afterwards" | 10 / 8 | a ruling body; an occupier who vetoes | REWORDED: "and it comes quickly" | 2 -> 0 (its fold) |
| (class) | autocrat v1 "One person decides", v3 "answers to one person" | 7 / 4, 7 / 4 | a ruling body | REWORDED: the seat's speed; "If the {seat} at X falls, it will be at the hands of someone close to it." | |
| C35244 | DS-GEN-13 MARKET-OPEN v1 "the roads bring buyers" | 22 / 1 | a famine | MARKED `no crisis: famine` (v2 to v4 stay) | 22 -> 21, fewer by exactly its measure |
| C13783 | COMMERCE: a market, no guild v1 "Anyone ... can sell at X's market" | 4 / 0 in the 720 (its read hamlet is besieged) | a siege | MARKED `no crisis: under_siege` (v3 stays) | 4 -> 4 (no siege town prints it in the 720) |
| C31881 | COMMERCE: a merchant guild, no bank v2 "sets the terms of trade" | 38 / 0 in the 720 (its read town is occupied) | an occupation (trade taxed by the occupier) | MARKED `no crisis: occupied` (v3 stays) | 38 -> 38 (no occupied town prints it in the 720) |

STRUCK: C24893 ("books record no gang, guild or racket ... people do on their own account"): 0 of its 18 printing towns has a criminal house; its mark `no organised crime` holds; black-market income without an organisation is what the line says.

Declared moves: NONE. Text and marks only; the census's 720 records and the 525 reference configurations are unmoved (0 of 525 against 59185b62a: each record hashed at both trees by the golden corpus's own `goldenCorpus()`/`keyOf()`; the base itself differs from the committed manifest in 418, the round before's, on purpose).

Guard: `tests/domain/bar3CorpusGuards.test.js`, 31 rows (22 REWORDED, 6 DECLARED, 3 KEEP): 31/31 at my tip; at 59185b62a every REWORDED and DECLARED row red, the 4 KEEP rows green (28 red, 3 KEEP green).

THE INVENTORY DIFF (before at 59185b62a, after at my tip; 720 towns each): sentences 30017 -> 30007; gone 53, new 43, in fewer towns 4, in more towns 3. Every row of the batch is GONE or fewer by exactly its measure (above). THE OTHER LINES IN FEWER TOWNS are the three structure-organized lines under a famine and MARKET-OPEN v1 under a famine (each its own measure, false there). IN MORE TOWNS: "The criminal interest at X is a hierarchy..." 46 -> 49 (v2 of the organized pool, the line that stays under a famine: read: true there), "Visitors find X's market without asking." 72 -> 73 (MARKET-OPEN v3 under the famine: read: true), and "Nobody at X warns visitors about particular streets..." 2 -> 3 (the Dangerous rung's v3 in the one town the first form of the C25344 cure moved; the reworded v2 restores the base's draw there). THE INHERITORS (46 sentences) are the reworded lines themselves, in exactly the towns their old words left; the widest twenty read where they print (the veto list's towns): true.

ONE NOTE ON THE AFTER RUN: the census rendered my tip before two last cures of the same batch: (1) C25344's mark gave way to a reword (the factLayers law; above), and (2) nothing else. The Dangerous pool's admitted set is the base's again, so its draws are the base's and the reworded v2 prints where the old v2 printed (1 town at 59185b62a: r2r-village-10): by construction, not rendered at the tip; the guard pins the words.

## The veto list (every new or reworded line; three towns: smallest and largest tier, a crisis where it reaches one)

The new words of each line are in the batch table above and in `tests/domain/bar3CorpusGuards.test.js` (`now`). Lines whose cure is a MARK keep their words; they are listed with the towns that still print them.

| line | towns printing (after) | read in |
|---|---|---|
| gates v1 | 66 towns | r2r-town-1, r2s-wartime-metropolis-3, r2s-indebted-town-1 |
| gates v3 | 82 towns | r2r-town-0, r2s-succession_void-metropolis-1, r2s-famine-town-1 |
| gates v4 | 87 towns | r2r-town-13, r2s-wartime-metropolis-1, r2s-infiltrated-town-1 |
| walls v1 | 23 towns | r2r-town-0, r2s-slave_revolt-town-1, r2s-indebted-town-1 |
| walls v2 | 91 towns | r2r-town-11, r2s-succession_void-metropolis-1, r2s-infiltrated-town-2 |
| def-short v1 | 35 towns | r2r-town-15, r2s-wartime-metropolis-3, r2s-succession_void-town-0 |
| def-short v2 | 27 towns | r2r-town-19, r2s-under_siege-metropolis-1, r2s-wartime-town-0 |
| def-short v3 | 36 towns | r2r-town-18, r2s-wartime-metropolis-2, r2s-politically_fractured-town-2 |
| def-short v4 | 37 towns | r2s-infiltrated-town-2, r2s-under_siege-metropolis-3 |
| food-failing v3 | 14 towns | r2r-metropolis-0, r2s-recently_betrayed-metropolis-1, r2s-indebted-metropolis-1 |
| mix v1 | 117 towns | r2r-village-25, r2s-wartime-metropolis-3, r2s-plague_onset-village-1 |
| mix v2 | 90 towns | r2r-village-6, r2s-under_siege-metropolis-2, r2s-occupied-village-2 |
| faith v1 | 91 towns | r2r-village-19, r2s-wartime-metropolis-1, r2s-indebted-village-2 |
| faith v2 | 91 towns | r2r-village-13, r2s-wartime-metropolis-0, r2s-infiltrated-village-1 |
| magic v1 | 39 towns | r2s-recently_betrayed-thorp-3, r2s-wartime-metropolis-3 |
| magic v2 | 23 towns | r2r-village-2, r2s-under_siege-metropolis-1, r2s-famine-city-1 |
| autocrat v1 | 7 towns | r2r-town-17, r2s-under_siege-metropolis-1, r2s-under_siege-town-2 |
| autocrat v2 | 10 towns | r2r-town-25, r2s-occupied-metropolis-1, r2s-infiltrated-town-3 |
| autocrat v3 | 7 towns | r2r-town-13, r2s-mass_migration-metropolis-3, r2s-insurgency-town-2 |
| autocrat v4 | 10 towns | r2r-town-28, r2r-metropolis-58, r2s-indebted-town-0 |
| organized v1 (marked) | 24 towns | r2r-town-0, r2s-religious_conversion-metropolis-3, r2s-plague_onset-town-2 |
| organized v3 (marked) | 42 towns | r2s-plague_onset-village-3, r2s-wartime-metropolis-1 |
| organized v4 (marked) | 34 towns | r2r-town-40, r2s-succession_void-metropolis-2, r2s-indebted-town-2 |
| market-open v1 (marked) | 21 towns | r2r-hamlet-4, r2s-succession_void-town-3, r2s-indebted-village-2 |
| market no guild v1 (marked) | 4 towns | r2r-hamlet-11, r2s-slave_revolt-village-0, r2s-plague_onset-hamlet-1 |
| merchant guild v2 (marked) | 38 towns | r2r-town-1, r2s-wartime-metropolis-0, r2s-famine-town-1 |
| moderate v2 | 11 towns | r2r-thorp-14, r2r-metropolis-52 |
| dangerous v2 (reworded; by its base picks, not rendered at the tip) | 1 towns | r2r-village-10 |

## Rows named for other seats (each a fact or a leaf)

- C4510 "<NPC> has food, enough to matter." is NOT DS-POW-6 (the tracer's guess): it is `src/data/stressTypes.js:41` (the famine hook, "A grain merchant has food, enough to matter", and its twin at :227): a fish-market master under a famine whose failed source is fish: for the CRISIS group's seat (BAR3-PLACES): the hook needs the failed source's own word.
- C1's "Everyone comes in by the gates, where the guard sees them." is `src/generators/safetyProfile.js`'s: for the seat that holds it: it needs the smugglers' fact `safetyLineTruth.js` already reads (a house that moves goods beneath the walls).
- C2's "What is already in store is all there will be until it lifts." is `src/generators/economy/foodBalance.js:227`'s: for the seat that holds it: under a siege where food is still grown inside or made by magic it needs the food record's grown or magic share.
- C20093 "Criminal money finds little purchase at X: ... its officials have little reason to sell." (DS-POW-6 RECOVERING v4, 7 printing towns, 7 with corrupt or bribed officials on their page by a crude page match): the line is pinned by `src/domain/display/stateProse/crimeLineDisqualifiers.js` (v4: disqualified where "an official in pay"): the disqualifier's reading misses the page's corrupt and bribed officials: for the seat that holds that file (my reword reverted: it would have unpinned the disqualifier).

## The books my cures move (named; NOT re-taken)

Each file run ALONE through `sh scripts/gate-tail.sh`, at my tip and (where red) at 59185b62a.

| test · arm | old -> new | door | batch |
|---|---|---|---|
| `tests/lint/proseMoveGrammar.walker.test.js` · CONTROL 4 (uniform-segment pools) | 571 -> 573; and its second half 516 -> 518 | the figure is re-measured at the close (TAIL-CLOSE-DOORS-3's form) | 1 (the faith, magic and income-mix rewordings make two more pools uniform) |
| `tests/lint/proseEntryContradiction.walker.test.js` · THE QUALIFY ARM (entries carrying the trailing-coordinate class) | 372 -> 371 | the close's re-measure | 1 |
| `tests/lint/observedShapeReaders.walker.test.js` · THE LIVE ESTATE INSTANCE (execution inputs drifted since the mint) | the four leaves `defense`/`economy`/`general`/`power.generated.js` | the shrink-only re-freeze | 1 |
| `tests/lint/presumedThings.widened.register.json` (the walker's two arms) | 4 FRESH hits, my reworded lines, each TRUE WHERE IT PRINTS (PT3/PT4): `armedForce` x2 (the defence-short v1 and v4: the clause is said only where the town keeps a garrison or a militia, `defenceSupplyPoolKey`), `religiousHouses` x2 (faith v1 and v2: both carry `sacredHouse`); my 6 stale rows SHRUNK in this commit (only mine: the 3 stale `watch` rows of powerSiblings/claimStanding/rulingStructure are the base's and are left as they stand) | named for the close | 1 |
| `docs/content/wiring-census.json` (`proseWiringCensus.walker`) | STALE AT 59185b62a ALREADY (the round before's); my cure moves 14 more lines of it (the DS-DEF-3/DS-DEF-4/DS-GEN-13/DS-ECO-12 pools' mark tallies) | `node scripts/wiring-census.mjs`, the close | 1 |
| `tests/domain/crisisBlindDossierProse.test.js` · the calm-claims floor | 16 -> 15: RE-KEYED in its own form beside a dated note (the file's "the floor follows the cures") | the file's own form | 1 |

RED AT BOTH TREES WITH THE SAME MESSAGE (the base's, not mine): `pipelinePinnedMode` (golden rows), `generationForkCensus` (the control row), `writerReach` (frozen surfaceReach; the banked cohort `importPct`), `proseWiringCensus` (the census stale), `engineCoreLazyEdge` (an eager edge to a lazily pinned module), and `presumedThings` (its base 3 fresh and 3 stale: the base's; my 4 fresh named above).

GREEN AT MY TIP: the guard; `composeStateProse`, `crimeLineDisqualifiers`, `powerStateProseDesk`, `dossierStateProseProjection.contract` (each red at an intermediate form of my cure and cured at its cause: the autocrat twin and its `ruling body` marks withdrawn for a reword; the RECOVERING v4 reword withdrawn); `factLayers` (cured at its cause: above); `displayEconCrisisMarks`, `bar2CorpusGuards`, `pageCensusFindings`, `cohesionWeave`, `corpusCureGuards`, `corpusEcoTailGuards`, `defenseStateProseDesk`, `economyStateProseDesk`, `census2DeclaredPools`, `generalStateProseDesk`, `tailCorpusDefGuards`, `treasury`, `wallsWordDossierProse`, `coherenceAgreeCures`, `generalDeskTabFlow`; the laws `rosterDuplicateDraws`, `hookThemeDraws`, `upkeepVocation`, `layerBoundaries`, `defenceFactReaders`, `noLegacyFactionReaders`, `ruinFilterRoster`, `siteCoherenceRatchet`, `proseComposed`, `tuningRegister`, `chainPrintSites` (no `dist/` in my tree). The projector's `--check`, eslint on the touched files, and the twelve-birth grid (0 falls at both trees) green.

THE 525 REFERENCE CONFIGURATIONS: 0 of 525 move against 59185b62a.

## Guards owed / what is left (in order, for a successor)

1. C23179 C31319 (DS-DEF-9 "magicDependency true, with a NAMED dependent chain" v1: "part of the shortfall is made up by means beyond it" where the food record's magic share is 0): measure the chain's `magically_sustained` against `foodSecurity.magicPct`; likely a mark or a reword that claims the chain, not the food.
2. C8630 (DS-FTH-4 crusaderSynthesis v1 "act as one" beside a quarrel of the church and the garrison): needs the quarrel's fact; measure first.
3. C37257 (DS-DEF-2 Beasts & Monsters frontier v3 "can drive off what attacks" under a critical monster bar with a watch alone).
4. C47622 (DS-DEF-2 Economic Survival STRONG v1 "can buy what a bad season needs" beside "cannot pay the merchant's price in coin").
5. C3178 (DS-ECO-12 CRITICAL IMPORT v3 names copper ore: the `{good}` slot's source; prints in none of the 720: bear the read town).
6. C54259 (DS-GEN-13 COMMERCE: a market, no guild v5 "none keeps a house at its market" beside the Merchant Guilds' Periodic market).
7. The four named rows above, for their seats.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL/` and `docs/chair/2026-11-15/review-bar-3|review-wide` (lane/chair-2026-11-08) and `docs/chair/2026-11-14/probes/CENSUS-3/` (lane/census-3-2026-11-14) to a scratch directory outside every tree; `census3.sh <tree> <out> 4 --count-only` at 59185b62a (before) and at my tip (after); `inventory.py <out> before.json|after.json`; `inventory_diff.py before.json after.json <the four worklists' rows>`. Each row's falsity measured by script over `corpus.ndjson.gz` and `dumps/` (the state named in the table).

