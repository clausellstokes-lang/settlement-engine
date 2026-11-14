# W2-WRITE — the hand-back of the eighth seat (the main seat of the split, the DS-DEF block)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-8.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `8e3526be7`, as the
brief names it (no difference). Scratch worktree on local branch `w2w8`; pushed by
`git push origin w2w8:refs/heads/lane/w2-write-2026-11-13`. No commit at or below `8e3526be7` rewritten.

**Status: WORKING.** (kept current after every item)

## Items
| part | row | commit | what | read in |
|---|---|---|---|---|
| B | #19 DS-DEF-9 NAMED chain v1 (with v2, v3) | (this commit) | the three lines reworded off "cannot be made without arcane work", "rests on a few practitioners, not on the land", "a workshop that could not run without the arcane": every chain note is a PARTIAL supplement after a shortfall, of four traditions | all 193 towns of the base render that reach the pool |

## New or changed lines (for the lane's veto list, with their towns)
- DS-DEF-9 NAMED chain v1 CHANGED: "At {settlement} the usual work no longer yields enough {good}, and part of the shortfall is made up by means beyond it." (64 towns drawn: Nahrfort hamlet 85, Panteakra city under siege, Ioannodion city, Tikalmul metropolis famine)
- v2 CHANGED: "If the help beyond ordinary work failed at {settlement}, its {good} would fall further short than it already does." (77: Zhongtian siege+famine, Balwick siege, Buyaniin metropolis)
- v3 CHANGED: "People at {settlement} know that part of the town's work now holds up only with help beyond ordinary labour." (50: Markaztappa occupied, Varanand village occupied, Kilwell metropolis famine)

## What is left (line by line)
- B: #27 DS-DEF-2 neither walls nor force v8, the style point (v4 carries the same phrase). Then one line to the chair.
- C: HANDBACK-4 item 4 (#396 DEF-2 no legal v3; #767 DEF-2 Beasts plagued v3; #125 DEF-5 mages' guild v1, v2; #57 DEF-9 false v2), item 5 (#58 DEF-12 enough v2), 30895bb67 (CHAIN defence supplied v1-v3, v5).
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
