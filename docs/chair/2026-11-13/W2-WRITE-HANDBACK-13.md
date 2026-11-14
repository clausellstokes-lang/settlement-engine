# W2-WRITE — the hand-back of the thirteenth seat (KEPT CURRENT AFTER EVERY ITEM)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-13.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `525541b42`, as the
brief names it (no difference). Scratch worktree on local branch `w13`; pushed by
`git push origin w13:refs/heads/lane/w2-write-2026-11-13`, each push non-empty (`git rev-list` tested), the main
clone's refs and local config compared before and after. No commit at or below `525541b42` rewritten.
THIS SEAT'S POOLS: DS-DEF, DS-POW, DS-FTH, DS-CND (the side seat holds DS-ECO, DS-GEN, DS-SUP; none of those edited here).

**Measured at the start:** the owner-page render (`render.sh`, HANDBACK-10's instrument) at `525541b42` over
`seeds-w5a.txt` + the bar's ten `bar0-` seeds (772 towns, 4 workers), in a detached worktree of the base.

## Items (each its own commit, pushed as made)
| row | pool · vids | before -> after (772) | cure | commit | guard |
|---|---|---|---|---|---|
| THE READER'S HIGH 2 (REVIEW-W2-WRITE-2 H2) | DS-DEF-12 CAPACITY: enough v3 | 51 towns reach the pool: drawn v1 8 / v2 9 / v3 34 -> v1 8 / v2 9 / v3 5; v3 drawn where food is below `pressured` 29 -> 0 (famine 7 -> 0, siege 7 -> 0, occupied 4 -> 1, that one at food ≥ pressured); 29 towns now print no row | v3 + `food: ≥ pressured` (its siblings' condition); under hunger no line of the pool is admitted, the row is silent | (this commit) | rv2-hamlet-famine-2 v3 (the reader's own town, born by configOf in the app's shape; red before the cure, green after) |

## THE SWEEP OF THE CLASS (a twin takes its siblings' condition)

## New or changed lines (the owner's veto list, with the towns read)

## THE REGISTERS NAMED STALE (not re-taken, under the chair's ruling: re-derived once, at the close)
- The byte baseline (`tests/lint/proseCorpusBytes.test.js` "RAW is EXACT"), the wiring census (`docs/content/wiring-census.json`:
  `proseWiringCensus.walker` "car 0" and "SEAM car 5b ... THE DRY READ"; `wiringCensusDeclared.walker` "every row carries the four
  columns"): stale from 4fb84c1cf (HANDBACK-12) and through every commit of this seat. The shift register: not re-pinned.
- The fast set (25 files) after every cure: exactly these 5 rows plus the lane's two known DS-POW-6 reds ("5a RE-RULED",
  "ALIVENESS") and presumedThings ARM 1 (the presumed door's `--check`: fresh 23, the lane's 23, no rise). No count pin moved.

## THE INHERITORS READ
- DS-DEF-12 v3 (`food: ≥ pressured`): NO sibling inherits (v1 v2 carry the same condition): in the 29 towns the row is
  silent, and the heading "Supply in isolation" goes with it (no empty row). Read on the owner's page before and after:
  Sanctavallis (rww-town-under_siege-1, a siege, the largest size the line reached: a town), Mingkou (w5-thorp-famine-2,
  a famine, the smallest: a thorp), Hvalika (w5-hamlet-occupied-1, an occupation): the line and its heading gone, the
  Critical Issues block below them ("Food supply ... Cutting the Food Supply") unchanged. Render noise NAMED: the "Patron
  deity" disclosure (a premium panel, not a corpus line) printed in 4 of the 51 towns in the base run and in none of the
  after run; no other line differed in any of the 51 (PLAUSIBLE: state carried between towns in a render worker).

## Guards owed
- THE 21 DISQUALIFIER CURES WITH NO GUARD (the reader's `probes/REVIEW-W2-WRITE-2/unguarded.json`, finding M9), NAMED, not
  written (brief step 6). IN THIS SEAT'S POOLS (14): DS-DEF-2 Beasts "settled, nothing organized" v4, v5 (`no crisis:
  under_siege · no crisis: occupied · no guardPresence`); DS-DEF-2 Invasion "walls with NO force" v2, v3, v5 (`no mercenary ·
  no crisis: occupied`); DS-DEF-2 Invasion "neither walls nor force" v6 (`no crisis: under_siege · no crisis: occupied`), v8,
  v9 (`no crisis: occupied`); DS-DEF-2 Economic Survival STRONG v2 (`no crisis`); DS-DEF-2 CHAIN "food trades working" v4
  (`food: > famine`); DS-POW-6 capture ADVANCING v1, v2 (`no crisis: threat`), v5, v9 (`crisis: threat`). IN THE SIDE SEAT'S
  POOLS (7): DS-ECO-10 POSTURE vulnerable v2; DS-GEN-13 MARKET-OPEN v1, v2; DS-GEN-13 NO-MARKET v1, v2, v3; DS-ECO-9 SECURE v3.

## What is left (line by line)

## FOR THE JOIN
- (carried from HANDBACK-12, unchanged) #259 `src/domain/magicReliance.js :: deriveMagicReliance` counts no magical food
  provision; `src/domain/display/stateProse/defenseStateProse.js :: defworkFill` prints the catalogue name.
- (carried, the chair's 11:49 rows) four guard rows red on the joined tree, to re-key BY IDENTITY to a town of the case on
  that base when this lane lands: DS-DEF-11 WALLED-STRAINED v3 at w5-city-under_siege-1; DS-DEF-2 Beasts "settled, nothing
  organized" v6 at w5-town-monster_pressure-2; DS-DEF-2 Invasion "walls with NO force" v4 at rww-town-occupied-1 and v6 at
  w5-town-under_siege-1.
- `origin/lane/join-2026-11-14` (JOIN-4 · 6, merged this lane at 525541b42) changes the source document once (the DS-GEN-3
  RECEIPT line) and adds `readsCount` to four DS-DEF pool metas in `defense.generated.js`: no line of this seat's cures.

## How the instruments are re-made
As HANDBACK-10's section (render.sh over seeds-w5a.txt + seeds.bar0.txt). This seat's additions are kept on the lane under
`docs/chair/2026-11-14/probes/W2-WRITE-13/`: `sweep.mjs <tree> <renderOut> <out.tsv>` (the class sweep: every pool, every
condition some variants carry and a sibling lacks, the lacking siblings drawn on the owner's page where the condition fails,
by factsOf over the record and the kernel's one rule); `vt.mjs <tree> <tsv> <blockRegex>` (the live rows with each lacking
line's text); `after.sh <tag> <files>` (gen + gen --check, presumed --check, the pool guard, the grid, the three fast gates,
the fast set: NO register re-taken).

## The rulings this seat worked to
BRIEF-W2-WRITE-13 whole, the chair's rulings in force (2026-11-14) copied: A TWIN TAKES ITS SIBLINGS' CONDITION. A RE-GATE
READS THE LINE THAT INHERITS ITS TOWNS. A LINE ABOUT A BODY THAT MUST AGREE NEEDS A BODY OF MORE THAN ONE. A SLOT IS NOT MADE
THE SUBJECT OF A VERB IT DOES NOT AGREE WITH. A LINE THAT PRINTS CLIPPED SAYS ITS CRISIS BEFORE THE CLIP. NO LINE PRINTS A
SLASH LABEL THROUGH A SLOT (the words for the powers come from the powers lane's seat through the chair). UNDER A SIEGE
NOTHING COMES IN OR GOES OUT BY ROAD, GATE OR WATER; UNDER A FAMINE NO LINE OFFERS THE FOOD THAT FAILED; UNDER AN OCCUPATION
no line says the town decides or keeps its own revenue. REGISTERS ARE RE-DERIVED ONCE, AT THE CLOSE.
Messages from the chair (ReadNotifications before every commit): none yet.
