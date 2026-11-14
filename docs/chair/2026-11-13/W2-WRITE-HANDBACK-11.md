# W2-WRITE — the hand-back of the eleventh seat (IN PROGRESS: kept current after every item)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-11.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `70e5e7468`, as the
brief names it (no difference). Scratch worktree on local branch `w2w11`; pushed by
`git push origin w2w11:refs/heads/lane/w2-write-2026-11-13` (push.sh), each push non-empty (`git rev-list` tested),
the main clone's refs and local config compared before and after (same every time).

**Measured at the start:** the owner-page render (`render.sh`) at `70e5e7468` over `seeds-w5a.txt` and the bar's ten
`bar0-` seeds (772 towns, 4 workers, every shard exit 0); the page census over the 720 (`page-census.mjs --out`,
exit 0, P9 = 134).

**THE BRIEF'S WIDTH, MEASURED AND CORRECTED.** The brief names #1509 ("defenses beyond the need" v1-v3) as the widest
row, 114 of the 720 printing "a settled line beside a Weak or Critical bar". That figure is the page census's P9,
which counts EITHER settled pool beside such a bar. Split at the tip: P9 134 = 4 of "settled, defenses beyond the
need" + 130 of "settled, nothing organized". On the 772: beyond-the-need beside Weak/Critical 11 towns (v1-v3 7,
v4/v5 4); nothing organized 122. The pool the brief named was cured as written (item 1); the true width is the
sister pool, cured by the same ruling (the lines speak of the settled country, never of sufficiency or ease) as
its own commit (item 1b). P9 matches a pool's lines by pattern, so a rewording does not lower it: the count
staying is the pattern's structure, not a red.

## Items (each its own commit, pushed as made)
| row | pool · vids | before -> after | cure | commit | guard |
|---|---|---|---|---|---|
| #1509 | DS-DEF-2 Beasts settled, defenses beyond the need v1-v4 | 772: v1-v3 beside Weak/Critical 7, v4 beside Critical 2 -> 0 false (same towns, reworded lines) | reworded: the settled country and the works that stand, no sufficiency or ease (v4 is the pool's own threat line, "spending that margin" beside a Critical bar) | 2833834f6 | none (a rewording) |
| 1a (found reading #1509) | DS-DEF-2 Beasts settled beyond-the-need v4 v5 under an occupation | 772: drawn v4 6, v5 1 of 7 occupied towns -> 0 | + `no crisis: occupied` (the pool goes silent under an occupation; a declared draw move confined to it) | 5077c9ec1 | w5-town-occupied-3 v4, w5-city-occupied-104 v5 |
| 1b (the brief's true width) | DS-DEF-2 Beasts settled, nothing organized v1-v3 | 772: 122 towns beside Weak/Critical (v1 32, v2 50, v3 33; a Town watch in 25); 720: 130 of P9's 134 -> 0 false (same towns, reworded) | reworded: no "reasonable rather than a gap", no "never needed to think", no "nothing that would justify a watch" where a watch stands | ec705c090 | none (a rewording) |

## New or changed lines (the owner's veto list, with the towns read)
- DS-DEF-2 Beasts settled, nothing organized v1: "{settlement} has no wall against the country, and the settled heartland around it sends little that would call for one." (Hisnabad w5-thorp-famine-4, Palaioeia w5-hamlet-calm-110, Veliko w5-town-wartime-4 watch, Flachmoor w5-village-succession_void-1 Weak)
- v2: "People at {settlement} seldom see a beast: the settled country around the town holds few of them." (Archoousa w5-hamlet-calm-2, Montepagus w5-town-famine-1, Staroichi w5-village-wartime-102)
- v3: "Whoever walks out of {settlement}, in any direction and at any hour, is unlikely to meet a beast." (Kitaxian rww-town-famine-1, Dzibcoba w5-hamlet-famine-2, Nishitang w5-thorp-wartime-1, Ringwick w5-town-religious_conversion-1)
- Declarations only: beyond-the-need v4 v5 `no crisis: occupied` (5077c9ec1).
- DS-DEF-2 Beasts settled beyond-the-need v1: "The country around {settlement} holds very little in the way of creatures; whatever the town's works are for, it is not them." (Qaryahqila w5-thorp-calm-104 Critical, Gantulgagol w5-town-famine-101 Weak, Gantulgaserai w5-metropolis-wartime-1 Strong)
- v2: "Few beasts come out of the settled country around {settlement}, and the town's works see little of them." (Kolbø rww-thorp-famine-1 Critical, Megaousa rww-city-famine-1 Weak, Evangeanthi w5-thorp-calm-3 Weak, Ioannodion w5-city-calm-6 Strong, Shivakot w5-metropolis-calm-101)
- v3: "You notice {settlement}'s works more than anything beyond them: the settled country around the town holds few creatures." (Langkoppel w5-city-famine-2, Saltovicus w5-metropolis-calm-1, Eldberg w5-metropolis-succession_void-1; v3 reaches city and metropolis only, never beside Weak/Critical in the 772)
- v4: "{settlement}'s works were seldom tested by the settled country around it, and the threat now at hand is testing them in earnest." (Al-nala w5-thorp-under_siege-4 Critical, Uaymche w5-town-under_siege-1 Critical, Tihono w5-city-under_siege-1 Strong)

## What is left (line by line, in the brief's order)
- THE CHAIR'S TWO ROWS (10:40 UTC, below): (1) HIGH readiness CRITICAL v3 in walled towns, next; (2) MEDIUM plagued perimeter AND force v1 beside Monster Defense Critical, before the medium rows.
- Steps 2 to 6 of the brief: not yet reached.

## How the instruments are re-made
As HANDBACK-10's section of that name; this seat's helpers: `beasts.py <dumps> '<pool word>'` (per Beasts settled vid, towns drawn by the bar's band); `after.sh "<cause>" "<car>" "<why>" <files>` (doors.sh, iterate.sh, bytes.mjs, presumed --check, the grid, gates.sh).

## The rulings this seat worked to
BRIEF-W2-WRITE-11 whole. Messages from the chair (ReadNotifications before every commit), copied:
- 10:40 UTC: "TWO ROWS MORE FOR THIS LANE'S POOLS, measured by the defence lane's seat on 972 births (docs/chair/2026-11-12/UPKEEP-HANDBACK.md on origin/lane/coherence-upkeep-2026-11-12, sections "(c) H3" and "P5"; the births: probes/REVIEW-UPKEEP-CAPACITY/all.seeds on origin/lane/review-upkeep-capacity-2026-11-14). Take them after the row you are on, the first before any MEDIUM row. (1) HIGH: DS-DEF-2 pool "readiness CRITICAL", vid 3, "You can walk into the centre of {settlement} without being stopped, challenged or counted by anybody at all.": 75 births print it, 18 of them WALLED (r2r-town-22, r2r-town-7, rv5-famine-town-1 among them ...). RULED: the line gains the walls exclusion the draw door reads; 18 -> 0 by your own count. (2) MEDIUM: "The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it..." : 22 births print it beside "Monster Defense Critical" on the same tab. No atom reads the monster score. RULED: A POOL LINE CLAIMS NO VERDICT THAT A BAND ON ITS OWN PAGE CAN DENY, unless an atom reads that band: reworded to the facts alone (the wall, the people who hold it), true beside any band. Each its own commit, read where it prints in three towns, as your brief says."
