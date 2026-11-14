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

## New or changed lines (the owner's veto list, with the towns read)
- DS-DEF-2 Beasts settled beyond-the-need v1: "The country around {settlement} holds very little in the way of creatures; whatever the town's works are for, it is not them." (Qaryahqila w5-thorp-calm-104 Critical, Gantulgagol w5-town-famine-101 Weak, Gantulgaserai w5-metropolis-wartime-1 Strong)
- v2: "Few beasts come out of the settled country around {settlement}, and the town's works see little of them." (Kolbø rww-thorp-famine-1 Critical, Megaousa rww-city-famine-1 Weak, Evangeanthi w5-thorp-calm-3 Weak, Ioannodion w5-city-calm-6 Strong, Shivakot w5-metropolis-calm-101)
- v3: "You notice {settlement}'s works more than anything beyond them: the settled country around the town holds few creatures." (Langkoppel w5-city-famine-2, Saltovicus w5-metropolis-calm-1, Eldberg w5-metropolis-succession_void-1; v3 reaches city and metropolis only, never beside Weak/Critical in the 772)
- v4: "{settlement}'s works were seldom tested by the settled country around it, and the threat now at hand is testing them in earnest." (Al-nala w5-thorp-under_siege-4 Critical, Uaymche w5-town-under_siege-1 Critical, Tihono w5-city-under_siege-1 Strong)

## What is left (line by line, in the brief's order)
- 1a: beyond-the-need v4 and v5 under an occupation ("testing them in earnest", "being held against something real" of a town the occupiers hold: v4 drawn at w5-town-occupied-102, -3, w5-metropolis-occupied-2, -3, -4; v5 at w5-city-occupied-104): `no crisis: occupied`, guards.
- 1b: settled, nothing organized v1 ("a reasonable one rather than a gap") and v2 ("has never needed to think about what is outside it") beside a Critical bar: the 130 of P9.
- Steps 2 to 6 of the brief: not yet reached.

## How the instruments are re-made
As HANDBACK-10's section of that name; this seat's helpers: `beasts.py <dumps> '<pool word>'` (per Beasts settled vid, towns drawn by the bar's band); `after.sh "<cause>" "<car>" "<why>" <files>` (doors.sh, iterate.sh, bytes.mjs, presumed --check, the grid, gates.sh).

## The rulings this seat worked to
BRIEF-W2-WRITE-11 whole. Messages from the chair: none so far (ReadNotifications before every commit).
