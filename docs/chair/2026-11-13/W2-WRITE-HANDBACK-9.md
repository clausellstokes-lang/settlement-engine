# W2-WRITE — the hand-back of the ninth seat (the main seat of the split, the DS-DEF block; THE CLOSE)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-9.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `f737c96e7`, as the
brief names it (no difference). Scratch worktree on local branch `w2w9`; pushed by
`git push origin w2w9:refs/heads/lane/w2-write-2026-11-13`. No commit at or below `f737c96e7` rewritten.

**Measured at the start:** the owner-page render (`render.sh`) at `f737c96e7` over `seeds-w5a.txt` and the seven
`rr2s-` seeds of the cut's rows (769 towns, 4 workers, every shard exit 0). `rr2s-metropolis-calm-rand-1` reproduces
Ringfield; `rr2s-town-indebted-port-1` does not reproduce Qal'atqala in the app's shape (the `-port-` births differ).
The session's context field reads 0: this seat's count is its own estimate (about 6,000 tokens a minute of work).

## Items
| part | row | commit | what | read in |
|---|---|---|---|---|
| 1 | HIGH #1170 DS-DEF-2 walls AND professional garrison v1 | 7832ef469 | "garrison roll puts paid soldiers on every stretch of its walls" beside DS-DEF-11 WALLED-STRAINED's "too few people man them" (23 of 74 towns drawn; Ringfield, Cobachihua, Kaltenplatz, Miloburg, Lundstrand). No registered condition reads the upkeep gate (`economicGates.military`): reworded, vid and declaration kept | all 232 eligible towns, 74 drawn |
| 1 | HIGH #642 DS-DEF-2 walls with NO force v2 | read, kept | at the tip v2 carries `no watch · no mercenary`; drawn in 6 towns (Kolbø, Nordey, Ioannolimani, Evangeanthi, Kamenin, Nishidao), every one's Armed Forces row "1 wall" and no force: true. The row's own town is a `-port-` birth this render does not reproduce | 12 eligible |

| 5 | THE MERGE, first side: lane/w2-write-side-rest-2026-11-13 at ddb7453e9 | ffc447555 | HANDBACK-5's eight steps; the source merged clean; pins re-derived through iterate.sh and by hand (CONTROL 4 share 0.658 -> 0.660); the proof: 0 of 59,642 eligibility and 0 of 60,129 owner-page town-pool cells differ from each block's holder over 762 towns | seeds-w5a.txt |
| 5 | THE MERGE, second side: lane/w2-write-side-eco-2026-11-13 at 4134b0882 | (this commit) | the same eight steps; the source and economy.generated.js merged clean (DS-SUP-2 and DS-ECO lines disjoint); guards 68 rows (53 + 35 - 20); pins re-derived (2954 -> 2948 variants; CONTROL 4 shares 0.660 -> 0.661, 0.161 -> 0.159 by hand; composeStateProse's DS-ECO-6 cell row 171 -> 172 carried from the eco side by identity); the proof at the three-way merge: eco 67 pools, rest 194/196, main 110/115, 0 differing on both instruments | seeds-w5a.txt |

## New or changed lines (for the lane's veto list, with their towns)
- DS-DEF-2 Invasion & War: walls AND professional garrison v1 CHANGED: "{settlement} keeps paid soldiers behind its walls, so raiders keep their distance and an army would pay dearly; a long siege would be another matter." (74 drawn: Ringfield metropolis, Lundstrand metropolis famine, Cobachihua city famine, Kaltenplatz town famine, Miloburg town wartime)

**THE TIME-BOX:** the count read 189,040 at 04:58 UTC (get_session, after the first item), past the brief's 120,000:
the item in hand (#1170) finished and pushed; every row below not reached goes AFTER THE JOIN; the seat goes to THE CLOSE.

## What is left (line by line)
- THE CLOSE: step 4 sent (04:59 UTC); step 5 THE MERGE done (both sides, pushed). Next: step 6, the merge of the line (976db5b19), then 2m's checks, step 7, step 8.

## LEFT FOR AFTER THE JOIN
Rows of this seat's list not reached at the time-box (the row, its writer, what is known):
- NEW, found by this seat at f737c96e7 (HIGH by its kind): DS-DEF-2 Invasion & War: walls AND professional garrison v1 to v3 UNDER AN OCCUPATION. v1 "... so raiders keep their distance and an army would pay dearly", v2 "any attacker would think again about the cost", v3 "People ... believe the town could be held" of a town an army already holds: 19 occupied towns eligible; v1 drawn in 3 (Markaztappa w5-city-occupied-1, w5-metropolis-occupied-101, w5-metropolis-occupied-3), v2 in 8, v3 in 8. The cure: `no crisis: occupied` on v1-v3 (the pool is `{colour}`), guard rows at w5-city-occupied-1; the pool then prints silence under an occupation (v4 is siege-only).
- HIGH inc #645 DS-DEF-2 Beasts & Monsters: plagued, perimeter AND organized force v2 (the round's writer; rww-city-under_siege-1, Panteakra): "the rotations run, the gates close on time, and nobody treats any of it as unusual" under a siege. At the tip v2 (`[street · gate]`) is eligible in 3 of 39 towns reaching the pool (a siege with famine among them) and drawn in 2 of the read (Faromare calm; Gankhuuiin w5-city-occupied-3, under an occupation: false there too). The cure: `no crisis: under_siege · no crisis: occupied`, guards at rww-city-under_siege-1 and w5-city-occupied-3.
- HIGH inc #1509 DS-DEF-2 Beasts & Monsters: settled, defenses beyond the need v2 (rww-thorp-famine-1, Kolbø): "comfortably over-provided against beasts" beside the bar "Beasts & Monsters Critical". The key is `settled country, perimeter` and reads no force (defenseStateProse.js `beastsRowSituation`); at the tip v2 is drawn beside Monster Defense Weak at Evangeanthi (w5-thorp-calm-3) as well. v1 "substantial works facing it" and v3 "how relaxed the people on it are" (presumes people on the perimeter where no force stands) want the same reading. No atom reads the monster score: a rewording.
- HIGH inc #1206 DS-DEF-9 `magicDependency` true v1 (rww-city-famine-1, Megaousa): "runs on arcane work" where every magic role reads absent and the reliance reads supplement. Not reached; v2-v4 ("the town's whole arrangement rests on them", "does better than its ground and roads would explain") to be read with it.
- The two the seventh seat found (HANDBACK-6): DS-DEF-5 NO organized force at all v1-v3 under an occupation (Ulfås, w5-hamlet-occupied-104: "Nobody ... is responsible for defending the town" where the occupiers' troops stand); DS-DEF-11 WALLED-STRAINED v2 under an occupation, its `{defwork}` slot printing the catalogue label. Not reached.
- Step 2, not reached: the re-read at the tip of the five HIGH rows earlier seats cured (#812 #953 #1305 #954 #1392). From the hand-back of the eighth seat: #812 re-read in its part C and kept.
- Step 3, not reached: CENSUS-2 over defense.generated.js at dcd4759b0 and at the tip.

## From the chair for after THE MERGE (05:06 and 05:12 UTC, copied; this seat's to carry as the lane's main seat)
- The eco side's census on economy.generated.js: kind b RISING, 16 towns / 8 lines at dcd4759b0 to 18 / 10 at its tip, classed by its seat only as PLAUSIBLY exposure and not read hit by hit: after THE MERGE, READ those two rising rows' hits against their towns (b/siege:brought-in DS-ECO-12 CRITICAL IMPORT land v2, 4 -> 6; b/siege:trade-flows DS-ECO-6 TIER minor shadow v1, 3 -> 5): origin is a cure of this seat's, exposure is declared with its cause.
- The eco side's note (ii), this block's: DS-DEF-2 Economic Survival STRONG beside DS-DEF-8's doom line ("may not come through this crisis"), 5 of 78 doom towns at e0c1f8b60 (w5-city-famine-102 v3, w5-city-famine-106 v4, w5-city-under_siege-103 v12, w5-metropolis-famine-106 v10, w5-metropolis-famine-3 v4): LEFT FOR AFTER THE JOIN with those figures.
- ww1298 (the eco side): the generator's fault (76 of 153 unexploited draws beside a running chain; `resourceGenerator.js :: evaluateInstitutions`): FOR THE JOIN.
- Two reds the chair's rehearsal of the join found at the corpus branches' own tips: (1) tests/ui/generalDeskTabFlow.test.js FAILS TO LOAD, "drawnMember: NOTHING DRAWS at DS-GEN-18 :: STALLED · seed forge_town" (red at 143d51c5d): measure which commit emptied it; the cure is a line true in that case (read in three towns) or the seed re-keyed by identity to a town the pool still serves, with its cause; (2) tests/ui/economicsTabFlow.test.js, the "economics.exportPosture" anchor expects "... beyond the town", the page prints "... beyond the village" (red at e0c1f8b60): a re-key by identity with its cause, or a cure if the word is wrong for the size. Both files run after THE MERGE, their exits in the statement.

## Hazards (the chair's, copied)
- 04:37 UTC: a push with NOTHING TO SEND falls into the pre-push hook's whole suite, whose implementationPackets / implementationSession tests run git against the real repository from a linked worktree (branch moved, `core.bare=true`, a fixture user). Before every push: `test -n "$(git rev-list origin/<branch>..<local>)"`; never chain a push after a step that can fail.

## The rulings this seat works to
BRIEF-W2-WRITE-9 whole. Received from the chair during this seat:
- 04:58 UTC, to every closing lane, ruled once for all (vetoable by the owner), FOR STEP 6, the instrument's fresh hits after the merge of the line: a corpus line is declared in the source document through a registered condition (that is the door) or cured. For a hit that is not a corpus line: (1) a stale row leaves by the door's shrink form; (2) where a set or table ALREADY declares the atom and the text only stands apart from it: the SHAPE CURE, byte-identical; (3) a line GATED IN CODE (true wherever it prints) but not declared through a draw door: not banked, not keyed by hand, not reworded to slip the matcher: it stays RED AND NAMED under FOR THE DECLARATION PASS in the statement (file, text, code condition, atom, any new word), for one declaration pass after the join; (4) a line FALSE somewhere is a cure, now. The statement gives each walker's exit and says these reds are the lane's, named. No stop to the chair for classes 1 to 3.
