# W2-WRITE — the hand-back of the twelfth seat (KEPT CURRENT after every item)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-12.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `7fad3c042`, as the
brief names it (no difference). Scratch worktree on local branch `w2w12`; pushed by
`git push origin w2w12:refs/heads/lane/w2-write-2026-11-13` (push.sh), each push non-empty (`git rev-list` tested),
the main clone's refs and local config compared before and after. No commit at or below `7fad3c042` rewritten.

**Measured at the start:** the owner-page render (`render.sh`) at `7fad3c042` over `seeds-w5a.txt` and the bar's ten
`bar0-` seeds (772 towns, 4 workers, every shard exit 0). Fast set at the tip: only the lane's known reds
(DS-POW-6 "5a RE-RULED" and "ALIVENESS"; presumedThings ARM 1, 23 fresh). Presumed-things door `--check`: fresh 23.
The grid (`page-census.mjs --grid`): exit 0, 8 falls at the base (not shrunk: not this seat's door).

## Items (each its own commit, pushed as made)
| row | pool · vids | before -> after (772) | cure | commit | guard |
|---|---|---|---|---|---|
| #10 | DS-ECO-9 SECURE v1 | READS TRUE AT THIS TIP: 0 of 772 print "feeds itself with a small margin"; Shankou (bar0-metropolis-calm-rand-1) prints "In an ordinary season Shankou has enough to eat, or near enough." beside "A good part of what Shankou eats is brought in" | none: reworded by e056fbfb0 (W2-WRITE-SIDE-ECO-3, on this lane). The key: SECURE holds 209 of its 492 towns at importPct > 15 (the label is read after import coverage); the pool's lines now hold across the band, so no key fault to name | - | - |
| #154 | DS-ECO-9 SECURE v3 | READS TRUE AT THIS TIP: 0 of 772 print "is fed, but only just"; Tyrby (bar0-thorp-calm-rand-1) prints "Tyrby is fed, but what it keeps put by is not deep: a run of poor harvests would reach its tables." beside "Tyrby grows far more than it eats, with some to put by against a bad year." (surplus 38%, inside the band) | none: reworded by e056fbfb0 | - | - |
| #203 | DS-DEF-8 override active, viability intact v2 v3 | occupied (47 eligible): drawn v1 8 / v2 19 / v3 20 -> v1 47 / v2 0 / v3 0 | v2 v3 + `no crisis: occupied`; v1 read under one: true | 13f494620 | w5-city-occupied-1 v3, rww-town-occupied-1 v2 |
| #200 | DS-POW-6 capture ADVANCING v3 v5 v9 (dm-only) | occupied: drawn v3 5 / v5 13 / v9 12 / v4 16 -> v11 30 / v4 16 | v3 v5 v9 + `no crisis: occupied`; v11 NEW, the occupation twin (village and larger) | 5892792b2 | by record: w5-town-occupied-3 v5 v9, w5-city-occupied-1 v3 |
| #205 | DS-DEF-2 Economic Survival STRONG v3 v9 v12 | NOT PRINTED AT LONGYUAN at this tip (it draws ADEQUATE); the pool under an occupation: 13 eligible, drawn v3 8 / v9 3 / v12 2 -> v13 13; v9 in the two Struggling towns eligible 2 -> 0 | v3 v12 + `no crisis: occupied`; v9 + `no crisis: occupied · prosperity: ≥ poor`; v13 NEW, the occupation twin | (this commit) | w5-metropolis-occupied-2 v9, w5-town-occupied-3 v3, w5-city-occupied-101 v12, w5-city-under_siege-103 v9 |

## New or changed lines (the owner's veto list, with the towns read)
- Declarations only: DS-DEF-8 viability intact v2 v3 `no crisis: occupied` (13f494620).
- DS-POW-6 capture ADVANCING v11 NEW `[ledger · dm-only · tier: ≥ village · crisis: occupied]`: "{settlement}'s officials work under the occupiers' eye now, but they are paid little, and a purse the occupiers never see would still be welcome." (Stredburg w5-village-occupied-1, Longyuan bar0-town-occupied-rand-1, Vallenovum w5-metropolis-occupied-1). Declarations: v3 v5 v9 `no crisis: occupied`.
- DS-DEF-2 Economic Survival STRONG v13 NEW `[ledger · crisis: occupied]`: "{settlement} had money laid by when the occupiers came; what the town earns now goes to them." (Tulumtzal rww-town-occupied-1 and Hochsteig w5-town-occupied-3, the smallest it reaches; Gankhuuiin w5-city-occupied-3; Vallenovum w5-metropolis-occupied-1, the largest: each beside "The occupiers take the revenue"). Declarations: v3 v12 `no crisis: occupied`; v9 `no crisis: occupied · prosperity: ≥ poor`.

## What is left (line by line, in the brief's order)
- The bar's rows: #39, then the message to the chair; #38, #278, #168, #279, #12, #275, #114.
- The sawmill's two partial-pool lines; the frontier's deterrence lines; step 4(b) (16 corpus lines); the religious houses'
  pool; the two empty cases.
- FROM THE CHAIR (11:49 UTC), after the thirteen: DS-DEF-11 WALLED-QUIET read under a siege and an occupation.

## FOR THE JOIN
- (the eleventh seat's two rows, carried) #259 `src/domain/magicReliance.js :: deriveMagicReliance` counts no magical food
  provision; `src/domain/display/stateProse/defenseStateProse.js :: defworkFill` prints the catalogue name.
- FROM THE CHAIR (11:49 UTC): four guard rows red on the joined tree, to re-key BY IDENTITY to a town of the case on that
  base when this lane lands: DS-DEF-11 WALLED-STRAINED v3 at w5-city-under_siege-1 (draws WALLED-QUIET there);
  DS-DEF-2 Beasts "settled, nothing organized" v6 at w5-town-monster_pressure-2 (no Beasts pool); DS-DEF-2 Invasion
  "walls with NO force" v4 at rww-town-occupied-1 (no Invasion pool) and v6 at w5-town-under_siege-1 (WALLED-QUIET).

## The reds at this seat's tip
The fast set at every item: only the lane's known reds (above). Not run: the whole suite (not this seat's).

## How the instruments are re-made
As HANDBACK-10's section of that name (render.sh over seeds-w5a.txt + seeds.bar0.txt). This seat's helpers (re-make from
these descriptions): `fw.py <dumps> <regex>` (towns whose page prints a match, with tab and excerpt); `ctx.py <dump> <regex> [n]`
(a match in its page with n lines of context); `dc.py <dumps> '<block::pool>' [crisis]` (per vid, eligible and drawn, all and
in the towns of a crisis, with the drawn seeds); `after.sh` (doors.sh, iterate.sh, bytes.mjs, presumed --check, the grid,
gates.sh). An after-count re-renders only the towns a declaration can move (the 50 occupied, the 116 besieged).

## The rulings this seat worked to
BRIEF-W2-WRITE-12 whole. Messages from the chair (ReadNotifications before every commit), copied:
- 11:49 UTC: "FROM THE MERGE SEAT, about this lane's own guard file ... FOUR ROWS RED ON THE JOINED TREE ... (a) NOT NOW:
  when this lane lands as a point ..., each of the four rows is re-keyed BY IDENTITY to a town that holds its case on that
  base: put it in your hand-back's FOR THE JOIN ... (b) NOW, as a row of your list, after the thirteen: A BESIEGED TOWN DRAWS
  THE "WALLED-QUIET" POOL on the joined tree ...: read every line of DS-DEF-11 WALLED-QUIET as it would print under a siege
  and under an occupation: a line that says the place is quiet, untested or at peace is declared off both; if the pool's KEY
  is what sends a besieged town there, name the key's file and function for the join with what you read."
