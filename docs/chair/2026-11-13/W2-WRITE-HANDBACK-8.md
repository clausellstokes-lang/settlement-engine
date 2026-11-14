# W2-WRITE — the hand-back of the eighth seat (the main seat of the split, the DS-DEF block)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-8.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `8e3526be7`, as the
brief names it (no difference). Scratch worktree on local branch `w2w8`; pushed by
`git push origin w2w8:refs/heads/lane/w2-write-2026-11-13`. No commit at or below `8e3526be7` rewritten.

**Status: WORKING.** (kept current after every item)

## Items
| part | row | commit | what | read in |
|---|---|---|---|---|
| B | #19 DS-DEF-9 NAMED chain v1 (with v2, v3) | b363e8d93 | the three lines reworded off "cannot be made without arcane work", "rests on a few practitioners, not on the land", "a workshop that could not run without the arcane": every chain note is a PARTIAL supplement after a shortfall, of four traditions | all 193 towns of the base render that reach the pool |
| B | #27 DS-DEF-2 neither walls nor force v8 (with v4, the same phrase) | 7e6237296 | the style point: "the threat now at hand has noticed both" (a personified abstraction) -> "danger is close at hand" | all 68 towns where v4 or v8 is eligible; drawn in 52 |
| C | 1bbf89408's Beasts plagued perimeter AND force v3 (#767), with v4 | 143d51c5d | v3 "are holding against the creatures" beside Critical and Weak ratings (17 of 34 drawn); v4 "manned day and night" beside the page's own "too few people man them" (79 of 104 eligible towns are WALLED-STRAINED): both reworded off how well the wall is held | all 103 towns where v3 or v4 is eligible |
| C | 1bbf89408's mages' guild v2 (#125; v1 read and kept) | (this commit) | "magical defence sits in the mages' own books, not the town's: ... the town cannot hold it" false where the mages govern (12 of 119: Arcane Council, Arcane Senate); no ruler atom for it: reworded | all 119 towns that reach the pool |

## New or changed lines (for the lane's veto list, with their towns)
- DS-DEF-9 NAMED chain v1 CHANGED: "At {settlement} the usual work no longer yields enough {good}, and part of the shortfall is made up by means beyond it." (64 towns drawn: Nahrfort hamlet 85, Panteakra city under siege, Ioannodion city, Tikalmul metropolis famine)
- v2 CHANGED: "If the help beyond ordinary work failed at {settlement}, its {good} would fall further short than it already does." (77: Zhongtian siege+famine, Balwick siege, Buyaniin metropolis)
- v3 CHANGED: "People at {settlement} know that part of the town's work now holds up only with help beyond ordinary labour." (50: Markaztappa occupied, Varanand village occupied, Kilwell metropolis famine)
- DS-DEF-2 neither walls nor force v4 CHANGED: "{settlement} has no line and no force, and danger is close at hand." (48: Ribatkala thorp under siege, Goraino hamlet siege+famine, Jómshammer village monsters)
- v8 CHANGED: "{settlement} has no wall and only its watch, and danger is close at hand." (4: Wadichowk town under siege, Belopol siege+famine, Qingcheng monsters)
- DS-DEF-2 Beasts plagued perimeter AND force v3 CHANGED: "{settlement}'s walls and fighters face the creatures season after season." (34: Tyrvik thorp of 20, Shangou thorp occupied, Shattmela village under siege, Erdenbash hamlet siege+famine)
- DS-DEF-5 ARCANE: mages' guild v2 CHANGED: "{settlement}'s wards are the mages' work, and they hold only as long as the mages keep them up." (73: Wadikot and Shattmahal under an Arcane Council, Al-haven under an Arcane Senate, Eldmo and Hákonås in siege with famine, Somagrad occupied)
- v4 CHANGED: "{settlement} keeps its wall against the creatures, and nobody walks out past it unarmed." (30: Doireleigh city, Tikalmul metropolis famine)

## What is left (line by line)
- C READ AND KEPT AS TRUE (measured over the base render): #396 no legal v3 (380 eligible towns, none with a courthouse, magistrate or judge on the roster); #57 DS-DEF-9 false v2 (no chain carries a magic note where the dependency is false; food by magic in 75 of 467 is a supplement, nothing 'would stop'); 30895bb67's CHAIN defence supplied v1-v3 (the key's own fact, the chains' net help) and v5 (37 hunger towns: famine 25, siege with a deficit 9, siege with imports cut 3).
- C LEFT: HANDBACK-4 item 4 (#396 DEF-2 no legal v3; #767 DEF-2 Beasts plagued v3; #57 DEF-9 false v2), item 5 (#58 DEF-12 enough v2), 30895bb67 (CHAIN defence supplied v1-v3, v5).
- D, E, F, G as the brief gives them.

## How the instruments are re-made
- `git archive origin/lane/w2-write-2026-11-13 docs/chair/2026-11-13/probes/W2-WRITE-5 | tar -x -C <dir>`; a worktree on a local branch at the lane's tip, `npm ci`, then `git config --local --unset core.hooksPath` in the main clone.
- The base render at 8e3526be7: `sh render.sh <tree> <out>/own-base seeds-w5a.txt 4` (762 towns, ~40 min here).
- An A0b probe of this seat (scratch): `armA0b` over `loadStateLeaves()` with the wiring census's reads, listing each over-claim by pool and vid (the fast set prints only the count).

## Found while reading, for later steps
- DS-DEF-2 Beasts & Monsters: settled, nothing organized v5 "the threat now at hand has found the gap": the same personified abstraction as #27 (step E, this block).
- The A0b over-claim arm reads the word "magic" in the NAMED-chain pool as a claim on `magicAbsent` (a field the pool's branch tests and the pool does not read), though the pool's key (`magicDependency` true) entails that magic is present. The first draft said "magic" and raised the shrink-only over-claim count 45 -> 48; the pin was not loosened and the word was not swapped for a synonym: the lines were reworded to name no means at all ("means beyond ordinary work"). For the walker's owner: a token shared by a read field (`magicDependency`) and an unread one (`magicAbsent`).

## Parked (with the word it needs)

## Named, not the corpus's (with the file)

## The rulings this seat works to
BRIEF-W2-WRITE-8 whole. Received from the chair during this seat:
- 03:15 UTC (the chair to W2-WRITE-8), for step G, nothing changes in B to F: (1) POINT 49 IS ON THE LINE:
  lane/integration-2026-11-07 = 976db5b19; G still waits for the two side seats' tips and the chair's word. (2) A
  HAZARD MEASURED BY THE CHAIR: a shallow clone can give a WRONG merge base, not a missing one (at depth 700 one
  base 96d698de7 and 31 false conflict hunks in registeredWords.js; with full history TWO bases, 96d698de7 and
  9d5d6e091, and no code file conflicts). BEFORE ANY MERGE AT G: `git fetch --depth=2147483647 origin
  lane/integration-2026-11-07 lane/w2-write-2026-11-13 lane/w2-write-side-eco-2026-11-13
  lane/w2-write-side-rest-2026-11-13` (~250 MB); `git rev-parse --is-shallow-repository` prints false. Measured in
  memory at the chair's tips: the three corpus branches merge with one another with conflicts only in files THE
  MERGE re-derives (the source document merges clean between them); the line then conflicts in 7 files, no code:
  the source document (one hunk), defense.generated.js, wiring-census.json, .prose-byte-baseline.json,
  page-census.register.json and the two presumed-things registers.
