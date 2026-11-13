# REVIEW-R3-STAGES — two stages read: A2 and C1 (2026-11-13)

The reviewer REVIEW-R3-STAGES, for the chair (session_01FE9mEws7PXYRYdjQPbSX15). I fixed nothing and changed nothing on the lanes I read. EXECUTED means I ran it and read the output; PLAUSIBLE means read from code or inferred, not run.

- **A2** = lane/r2-code-a-2026-11-13, **2f114a4c9..0d3972d8f** (19 commits, 12 touching src/): the medium items of round two (second seat) and six high lines of round three (third seat), in generator and data code.
- **C1** = lane/r3-code-c-2026-11-13, **aac79b808..fb8b24fbe** (11 commits, 7 touching src/): eight cures in domain, generator and display files.

Both lanes have moved past these tips (A2 to a23da6173, C1 to a4897beb6). I read the tips named, not the branches' newest.

## Verdicts

| Stage | Verdict | Why, in one line |
|---|---|---|
| **A2** | **NOT CLEAR** | Two lines the stage wrote print FALSE at MEDIUM, and one of them is in the replacement for its own cured row #152, in that row's own town. Every other law holds: the declared moves match, every guard reds on its own fault and no other, and the gates are green. |
| **C1** | **NOT CLEAR** | One sentence the stage reworded (#325/#468) still prints FALSE at MEDIUM: "A beleaguered outpost" in 36 cities and metropolises. The words are old; the stage removed the slider figure and kept them. Every other law holds. **This is the one thing for the chair to rule** (below). |

**The one thing the chair must rule.** When a stage rewords a sentence and leaves an old false clause in it, does the stage own the clause? C1's only finding is of that kind: #325/#468 asked for the slider figure to go, and the stage did nothing else to the sentence. If a stage owns only the words it changed, C1 is **CLEAR**. A2's two findings do not turn on this ruling: A26 is a sentence A2 wrote new (it carried "the merchants" into it), and A15's "at sea" is A2's own wording.

## Findings, ranked

| # | Rank | Stage | Town and sentence (or test) | The fact against it | E/P |
|---|---|---|---|---|---|
| 1 | MEDIUM | A2 (1d72106dd, #152's cure) | rr3-thorp-famine-port-0 (Brahmakund, thorp of 11): "The crops failed here this year, and what food can still be bought from outside costs more every week. The settlement must decide what it can still afford to import, **and the merchants are watching it decide.**" | The same page: "No market or fair stands in Brahmakund: what trade the thorp does is done house to house". No market house, no merchant power (one power: the Elder Council). In **21 of the 55** towns the line prints in (10 thorps, 5 hamlets, 6 villages). It also prints on **#152's own town** (rw3-thorp-famine-1, Chichek, thorp of 26: "No market or fair stands in Chichek") and on #48's (rr2s-thorp-famine-rand-1, Archodion, thorp of 12). The clause is the old line's, carried into the new sentence. The hand-back says "Read: all 31". | EXECUTED |
| 2 | MEDIUM | A2 (0d3972d8f, #1312/#203's cure) | r2r-thorp-41 (Xinyuan, thorp of 22): "The sickness is spreading among those who crew the boats, **and the ones still at sea** face a thin catch and a hard winter." | terrain forest, route river; the page reads "river", "Forest", "part of its food comes in by river". There is no sea. In **10 of the 27** towns the boats variant prints in (riverside or forest, river routes): rr3-metropolis-plague_onset-rand-0, r2s-plague_onset-town-3, r2s-plague_onset-metropolis-3, rr3-village-plague_onset-rand-0 and six more. True in the 17 coastal towns, including both of the cut's towns. The hand-back read 32 boats notes. | EXECUTED |
| 3 | MEDIUM | C1 (cdf84d431, #325/#468) | r2s-politically_fractured-metropolis-2 (metropolis of 160,904), Systems/Defense: "Embattled region. Fortification and forces are present but chronically underfunded: poor equipment, low morale, and thin reinforcement. **A beleaguered outpost surviving on the edge.**" | A metropolis is not an outpost. In **36 of the 107** towns the line prints in (22 metropolises, 14 cities). Old words, kept when the figure was removed: see the ruling above. True in thorps to towns, and fortification and a force stand in all 107. | EXECUTED |
| 4 | LOW | C1 (0386ff35a, C-L4) | AI grounding only: "Noble Houses's mark is on every door that matters" (8 metropolises, e.g. r2s-famine-metropolis-1) | The possessive leaf `powerSentenceName.js :: powerPossessive` gives "'s" to a plural ending in "-es". "Guilds's" did go to 0, as the hand-back says. The daily-life slots print on no tab of the owner's page. | EXECUTED |
| 5 | LOW | A2 (dca86dfe1, the soldier's hooks) | Declaration scale | The cure moves only the 111 census towns that printed the false line, plus r2r-hamlet-27 (explained). The hand-back declares 116 towns but not the hooks: **2,535 hooks re-dealt to remove 1,094 false prints** (census 720; 7,907 hooks in 331 of 1,536). The registry cascade re-deals true lines too, 145 of them on military holders. Declared by town, as the brief asks; the count is not stated. | EXECUTED |
| 6 | LOW | C1 (476800e1d, #1074) | Declaration scale; rr3-city-occupied-rand-1, the blade captain: "Bring City-State Council under the sway of Occupation Authority, one member at a time." beside "City-State Council carries out what Occupation Authority decides." | goals.js reads the relation's new kind, so the whole roster's goals are re-dealt in the 9 census towns: **126 goals** (38 short, 88 long), 595 in 30 of my 1,536 towns. Declared by town ("npcs (9, the same 9)"), not by count. A read of 30 re-dealt goals: 28 true, 2 LOW (this one, and rr3-metropolis-occupied-port-0's "Stop Grand Guild Consortium from taking anything more from Occupation Authority this season", which turns the occupation round). | EXECUTED |
| 7 | LOW | C1 (#1074) | r2r-thorp-1, Systems/Power: "×Competitive(1) … Elder Council carries out what Occupation Authority decides." | The "Competitive" heading sits over a line of obedience in 15 of 76 occupier towns. The stage's own ruling keeps the bands above subordinate. | EXECUTED |
| 8 | LOW | A2 (2bdb29c42, #6) | Twins: "They promised the same post to two people…" (6 thorps, 3 hamlets), "A ledger … an auditor is coming to read it" (5 thorps, 6 hamlets), "Someone is collecting fees in their name…" | They carry the same office presumption as the six lines gated on `tier: ≥ village`, with no gate. A stretch, not provably false. | EXECUTED |
| 9 | LOW | A2 (5841c15ba) | the midwife (rr3-village-indebted-rand-4): "The original contract that created the debt was based on projections they knew were false at the time of signing"; the cooper hoarding medicines; the bowyer who "authorised" a work | An old presumption about the holder's office, kept in the reworded secrets. The record names no signer, so it cannot settle it. | EXECUTED |
| 10 | LOW | A2 / C1 | A02–A07 in villages of 93 to 170 ("a clerk in their office"); A25's "now" in an isolated thorp that never traded; C01's quarantine in a thorp of 6 | Stretches. | EXECUTED |

**Never on the page** (for the record, not findings). A2's four new priority notes (A20–A23): the Outlook tab prints a priority note under a critical row only, and in all 1,536 births every siege or famine town shows a gap, so they reach the record only. C1's daily-life slots (C02–C05) go to the AI grounding payload and the regeneration-delta card. C1's error-band embattled reason (C10) never printed in 1,626 births: under a plagued threat the effective configuration floors military at 25, and the line needs under 25 (read 25 at slider 10).

## Step 1 — every new or reworded line, read where it prints (committed and pushed at b3bbda3f5, before any claim was read)

The list is **REVIEW-R3-STAGES-LINES-READ.md** beside this file: 47 lines (38 in A2, 9 in C1), each with its file, pool or function, conditions, how many of 1,536 towns it prints in and at which sizes, the towns read, and the verdict.

- **A2:** 32 TRUE (some with a LOW note), **2 FALSE at MEDIUM**, 4 never on the page.
- **C1:** 3 TRUE, **1 FALSE at MEDIUM**, 5 never on the page.

How I read them: 1,536 births per tree (the census's 720 verbatim and 816 in the app's shape), plus 90 on the plagued route. 120 towns rendered at A2's tip and 28 at C1's, through the real OutputContainer. Each line was read on its page and then checked by script in every town it prints in.

## Step 2 — every row each stage says it cured

**On the list's own towns, base against tip** (each rendered at both; `out/listtowns-*`, `pagediff.mjs`):

| Row | Town | Base → tip | What prints in its place | Verdict |
|---|---|---|---|---|
| A2 #6 | rw3-thorp-calm-1 | 1 → 0 | "A sealed letter arrived for them three weeks ago…" | cured, true |
| A2 #152 | rw3-thorp-famine-1 | 1 → 0 | "The grain harvest failed here this year … and the merchants are watching it decide." | **the false premise is gone; the replacement is still false** (finding 1) |
| A2 #181 | rw3-hamlet-calm-1 | 2 → 0 | "…the Economic Divide is long past, but nobody here has forgotten…" (88 years) | cured, true |
| A2 #676 #678 #723 | rw3-city-wartime-1 | 1/1/1 → 0 | 23 hooks re-dealt from each holder's own pool (the dean's lapsed faith, the warden's signed order…), the secret re-dealt | cured, true (one LOW: "Their scales were tested…" on a First Councillor) |
| A2 #817 | rw3-village-insurgency-1 | 2 → 0 | "It has come through the Migration and the Occupation, and travellers still remember the place kindly" | cured, true |
| A2 #968 | rw3-town-under_siege-1 | 1 → 0 | the granary reeve: "…buying up property in a district…" (town of 1,545) | cured, true |
| A2 #969 | rw3-town-under_siege-1 | 0 → 0 | (does not print at this base on this tree) | not measurable here |
| A2 #1068 | rw3-town-occupied-1 | 1 → 0 | "Crisis Adding Mouths to Feed" (food Secure, gap 0) | cured, true |
| A2 #4 #40 | rr2s-thorp-calm-rand-1 | 1 → 0 | "Since the hunt failed, food is power in Sahlfort, and everyone is watching who eats well." | cured, true |
| A2 #48 | rr2s-thorp-famine-rand-1 | 1 → 0 | "Since the fishing failed, food is power in Archodion…" (the same town's #152 line now carries finding 1) | cured, true |
| A2 #203 | rr2s-hamlet-plague_onset-rand-1 | 3 → 0 | the boats note (a coastal port hamlet) | cured, true |
| A2 #327 | rr2s-village-monster_pressure-rand-1 | 1 → 0 | "The work they authorised six months ago…" | cured, true |
| A2 #601 #651 | rr2s-town-indebted-port-1 | 1 → 0 each | "…what the trade can bring in…"; "The original contract that created the debt…" | cured, true |
| A2 #1312 | rr2s-metropolis-plague_onset-port-1 | 3 → 0 | the boats note (a coastal port); "Is hoarding medicines…" | cured, true |
| C1 #1074 | rr2s-city-occupied-rand-1 | 1 → 0 | "~Tense · Merchant Guild Council carries out what Occupation Authority decides." | cured, true (5 goals re-dealt, read true) |
| C1 #304 | rr2s-village-monster_pressure-rand-1 | 1 → 0 | "…the current condition: beast & raider threat." | cured, true |
| C1 #325 | rr2s-village-monster_pressure-rand-1 | 1 → 0 (the figure) | the reason without the figure (a village) | cured, true here (finding 3 is in cities) |
| C1 #468 | rr2s-town-under_siege-rand-1 | 1 → 0 (the figure) | as #325 (a town) | cured, true here |
| C1 #1386 | rr2s-metropolis-plague_onset-port-1 | 1 → 0 | "…are being resisted, and not everyone keeps the quarantine." | cured, true |
| C1 C-L4 | no town (AI grounding) | a plural's "'s" 250 towns → 0; doubled label 1,495 → 0; doubled warning 117 → 0 (1,536) | — | cured, with "Houses's" left in 8 (finding 4) |
| C1 C-H1 | no town | 128 "Magical instability" threats → 0 (1,536) | — | cured by silence: every one was false (below) |

**On my births** (1,536 per tree), every claimed false sentence is gone at the tip: the soldier's command lines on non-military holders, the slot words, the famine rows without a granary, "recent enough" past sixty years, the denying "aside" lines, the wrong headings, the slider figures, "holds nowhere", the condition labels and the score-made threat (`out/fd-*`, `out/percommit-*`). What prints in their place is read in step 1: true, except findings 1 and 2.

**A count falling is not a cure: thirty removed lines read for each removal** (`out/removals-A.txt`, and the reads above):

| Removal | Removed (of 1,536) | Of 30 read, true |
|---|---|---|
| A2 soldier's command lines (dca86dfe1) | 3,469 military lines left their holders (with the cascade) | **8 of 30 true**: 3 lost by military holders to the cascade, 5 that fit a civic holder (a reeve's eviction order, a wartime headman's orders, a workhouse master's and a prison warden's orders, a magistrate's turned spy). Each is replaced by a line of the holder's own pool. |
| A2 office lines in thorps and hamlets (2bdb29c42) | 52 hooks in 27 towns (census) | **10 of 30 true**, all lost to the registry cascade (a smuggler's private meeting, a miller's deposition…); 20 false office lines. One borderline: "a district" refused in a village of 386. |
| A2 war-contracts secret (78d255b62) | 31 | **0 of 31 true**: every town is Moderate, Poor or Struggling. |
| A2 famine rows (910082d4a) | 34 | **0 of 34 true** (no granary, fewer powers, or another source failed). |
| A2 commodity words (48e034922) | 52 | **7 of 30 true**: good nouns lost (furs, coal, game, charcoal, reeds ×2, grain); the defaults that replace them are true too. 23 were broken ("ship", "transit", "milled"). The port and crossroads lines give way to "X's hold on Y is weaker than it looks from outside", read true (19 towns, all Unstable). |
| A2 secrets' slot (5841c15ba) | 149 | About 55 of 149 read well ("the original wool contract"); every "medicinal X" was broken. Each replacement reads whole. |
| A2 plague note (0d3972d8f) | 76 towns | **0 true**: the old note called an onset a plague. |
| C1 Magical instability (d166e8261) | 128 | **0 of 128 true**: no magical crisis or condition in any of them (one town had an Arcane Incident 19 years ago). |

## Step 3 — the laws

**Field diff, base against tip, over the census's 720** (each commit against its parent: `out/percommit-A.txt`, `out/percommit-C.txt`):

| Stage | Commit | Family moved (towns) | Declared in the hand-back (on 740 = 720 + the reader's 20) | Match |
|---|---|---|---|---|
| A2 | dca86dfe1 | npcs.plotHooks (112) | 116 of 740, plotHooks only | yes (hook count not stated: finding 5) |
| A2 | ce1f02a0c | none | the declaration moved to the file's end | yes |
| A2 | 3973660ed | history.historicalCharacter (44) | 45, historicalCharacter only | yes |
| A2 | 1d72106dd | economicViability.plotHooks hook (29), category (9) | 31, hook and category in 9 | yes |
| A2 | d5b50b4f4 | issues title and priorityNote (29) | 30, title and priorityNote only | yes |
| A2 | d0ff7e7ec | historicalCharacter (6) | 7 | yes |
| A2 | 78d255b62 | npcs secret (10), presentation (7) | 11; secret, and presentation in 7; the re-deal declared | yes |
| A2 | 2bdb29c42 | npcs.plotHooks (27; 52 hooks) | 29; 60 persons | yes |
| A2 | 910082d4a | pressureSentence (14) | 16, pressureSentence only | yes |
| A2 | 48e034922 | pressureSentence (23) | 24, pressureSentence only | yes |
| A2 | 5841c15ba | npcs secret.what (61), one per town | 65, one per town, no re-deal | yes |
| A2 | 0d3972d8f | economicViability issues (28), history currentTensions (20), siegeNarrative (6) | 31: the note, currentTensions 22, siegeNarrative 7 | yes |
| C1 | 476800e1d | powerStructure (28), npcs goals (9; 126 goals) | 28 (narrative 28, type 9), npcs 9 | yes (goal count not stated: finding 6) |
| C1 | cdf84d431 | structuralViolations (54) | 54 | yes |
| C1 | de27f9fd6, 9494a7bce, 6c0db2bb6, 0386ff35a, d166e8261 | none (display only) | 0 leaf diffs | yes |

The whole ranges: A2 moves 287 of the 720 towns in four families (npcs, economicViability, history, pressureSentence). C1 moves **78 towns in three families** (structuralViolations, powerStructure, npcs): exactly the declared 78. Nothing else moved in either.

- **Draws:** A2's resolutions are draw-free, and re-deals happen only inside the declared towns. C1's goal re-deal is inside the declared 9 towns.
- **The fork census:** see step 5.
- **New keys in the settlement record:** 0 in either range (the field diff's NEW/GONE KEY rows: 0, on 1,536).
- **New words in the vocabulary file:** none; neither range touches it. A2's declarations read existing atoms (`tier`, `population`, `institution: granary`, `prosperity`).
- **A name a user can hide, written into a stored composed sentence:** none found. A2's new sentences carry only the town's name. C1's relation line writes two power names into the stored `factionRelationships[].narrative`, as the line it replaced did, but no power can be hidden by hand: only generation stamps `hidden` (the infiltrator's interest, category "other"), and the occupier row is military (PLAUSIBLE: read from `publicSafe.js` and `stressFactions.js`, not run).

## Step 4 — a plant for each guard

Each cure's source change reversed at its stage's tip (`plant.sh`). Where a later commit had touched the same lines, I planted the fault by hand (`out/plantsA.txt`, `out/plantsC.txt`). Every guard file of the stage ran under every plant.

- **A2:** 11 guards, 57 tests, green at the tip. Each of the 11 plants (8 reversed, 3 by hand: the soldier's resolution, the heading, the famine rows) reds **its own guard and no other**: soldierHookCivilianHolder 2, stableHistoryMajorCount 4, harvestHookFamineHere 6, foodCrisisHeadingReadsRecord 9, economicHistoryRecent 2, warContractsSecretProsperity 5, clerkHookSmallPlace 10, famineFrameStore 5, pressureCommodityNoun 2, stressSecretNoCommodity 3, plagueFoodNoteSource 2. Every A2 guard holds fixed born towns where the cured line must not print.
- **C1:** 6 guard files, 36 tests, green at the tip. Each of the 6 plants (5 reversed, the occupier by hand) reds **its own guard and no other**: occupierRelationLine 1, embattledReasonNoSlider 1, conditionWords 2, plagueVantageQuarantine 1, dailyLifeGrammar 3, wave1CohesionFixes 1.
- **Conditional cures with no fixed-town guard:** C1's **#1074** (the occupier condition) and **C-H1** (the magical-crisis condition) are guarded on synthetic records only; no born town is held in which the cured line must not print. Every A2 conditional cure has one.
- **No guard covers the two new faults:** plagueFoodNoteSource's towns are coastal, so nothing reds on "at sea" in a river town; harvestHookFamineHere asserts no marketless town, so nothing reds on "the merchants".

## Step 5 — the gates at each tip (EXECUTED, through `scripts/gate-tail.sh`, the gate's own exit)

| Gate | A2 at 0d3972d8f | C1 at fb8b24fbe |
|---|---|---|
| strict-domain (`typecheck:domain:strict`) | exit 0, 1113 / 1113 | exit 0, 1113 / 1113 |
| type ratchet (`typecheck:ratchet`) | exit 0, 167 / 167 | exit 0, 167 / 167 |
| eslint on every src and test file the range touches | exit 0, clean | exit 0, clean |

**The governing test files** (every test that names a changed module, and the fork census, at base and tip): running when this was pushed; the result is appended in the next commit.

## Lines I would strike (for the owner's veto)

1. A2, `foodBalance.js` (the famine hook with food still coming in): ", and the merchants are watching it decide" wherever the record holds no market and no merchant power. Its sibling's tail, "and those who hold it are watching it decide", is true everywhere.
2. A2, `foodBalance.js :: plagueFoodNote` (boats): "and the ones still at sea" wherever the town has no coast. "the ones still on the water" is true on a river as well.
3. C1, `structuralValidator.js` (the embattled warning): "A beleaguered outpost surviving on the edge." at city size and above.

## What I did not measure

- The whole suite, and a fresh cold read of whole towns (other seats do both, as the brief says).
- The new lines on the PDF, the Foundry journal, the Tonight sheet and the exports. I read the owner's page only. The record lines (hooks, secrets, the food notes, the pressure sentence, the history character) reach those surfaces through the same fields, so findings 1 to 3 very likely print there too (PLAUSIBLE).
- The census counter (census.sh) base against tip: I measured by field diff and by page instead.
- The AI's own paraphrase of the grounding payload.
- Round-two row #969 on its own town: it does not print at A2's base on this tree.
- Lanes past the named tips: A2 has 3 later commits (f4c0f6477, the religious pool, among them); C1 has the R3-CODE-C-2 commits.

## Probes (docs/chair/2026-11-13/probes/REVIEW-R3-STAGES/)

`births.mjs` and the seed files; `render.sh` and `render.rr3s.jsx`; `select.mjs`, `readsheet.mjs`, `facts.mjs`, `find.mjs`; `fielddiff.mjs`, `npcdiff.mjs`, `cluster.mjs`; `derivedC.mjs`, `derivedDiff.mjs`; `removed.mjs`, `pagediff.mjs`, `plant.sh`; `lines.json`, `verdicts-step1.json`, `linesmd.mjs`. Outputs are in `out/`: field diffs, per-commit moves, reading sheets (gz), plant results, removal reads, and the list towns' pages at both bases and tips (gz).
