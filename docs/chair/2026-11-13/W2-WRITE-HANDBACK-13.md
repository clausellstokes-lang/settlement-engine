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
`sweep.mjs` (kept under `docs/chair/2026-11-14/probes/W2-WRITE-13/`) over EVERY pool of the source document (all blocks), on the
owner-page render of the 772 births at 525541b42: for each pool, every condition some variants carry and a sibling lacks (the
declaration's fact atoms, its `no crisis: X` exclusions, the kernel's dimension marks; a positive crisis requirement is a
twin's own scope and is not swept; a sibling carrying the negation or its own value of the same band is partitioned, not
lacking), and how many draws of a lacking sibling land in a town where the condition FAILS (factsOf over the record, the
kernel's one rule). The whole table: `sweep.525541b42.tsv` (562 condition rows; column `strict` = ALL-SIBLINGS when every
other line carries it, the reader's `twins.mjs` class). By block (condition rows / rows drawn where the condition fails /
such draws): DS-DEF 157 / 80 / 3,051 · DS-POW 39 / 25 / 1,136 · DS-FTH 26 / 1 / 2 · DS-CND 24 / 2 / 65 (THIS SEAT'S) ·
DS-ECO 96 / 54 / 4,805 · DS-GEN 127 / 75 / 4,722 · DS-SUP 3 / 0 / 0 (THE SIDE SEAT'S) · DS-HK 13 / 0 · DS-POP 12 / 0 ·
DS-REL 1 / 0 · DS-STR 37 / 0 · DS-WAR 27 / 0 (no seat named; nothing drawn where it fails). Most rows are a partition
working as built (a sibling that does not speak of the thing): a draw count is NOT a fault count; each row of this seat's
pools was read, below.

THIS SEAT'S ROWS, READ (each lacking line: TAKES the condition, or is TRUE without it and is said so):
- TAKES (to be cured in this step, one commit a block, guard rows on towns of the case): DS-DEF-1 readiness CRITICAL v1, v4
  + `no crisis: occupied` ("all but undefended" / "too few ... to hold off a serious attack" of a town the occupiers garrison:
  v2 carries the occupation exclusion), v3 + `no guardPresence` ("without being stopped, challenged or counted by anybody at
  all" beside people paid to keep order: v1's condition); readiness WEAK v1 + `no crisis: occupied` (its siblings exclude
  every threat; under the occupiers' troops "could not hold off a raid" is false); DS-DEF-2 Beasts frontier v1, v2 + `no
  crisis: threat` ("the tally of raids is short" / "ordinary rather than anxious" with the threat at hand: v3's condition;
  v4 is the threat line: the hand-back's "frontier's deterrence lines"); Beasts plagued v1 + `no crisis: occupied`, v4 + `no
  crisis: under_siege · no crisis: occupied` ("the town keeps ... people to hold it" of a garrison the occupiers hold; "nobody
  walks out past it unarmed" where nobody walks out: v2's conditions); CHAIN food trades working v3 + `no crisis: famine`
  ("some provisions to fall back on" in a famine: v1's); Economic Survival STRONG v1 + `no crisis: occupied` ("can keep its
  defenders paid" under the occupiers: v3 v9 v12's), v3 + `no crisis: famine` (v9 v12's), and the lines that say the money
  is there (v2 v3 v4 v8 v10 v11 v12 v13) + `prosperity: ≥ poor` (v9's, the chair's ruling on BAR-0 #205); neither walls nor
  force v3 + `no mercenary` (every sibling's); DS-DEF-3 political fracture v2 + `population: ≥ middling` ("Cross a street and
  you may cross from one power's rules into another's" in a place of a few houses: v1 v3's); DS-DEF-5 FIXTURE gates v4 + `no
  crisis: under_siege` ("Whatever reaches X by road reaches it at a gate": v1-v3's), walls PRESENT v1, v3 + `no crisis:
  under_siege` ("a stranger enters where the town intends" / "arranges its day around the gates without noticing": v2 v4 v5
  v7's); DS-DEF-8 INSURGENCY v3 ("Each crackdown"), INTERNAL PRESSURE v3 ("its defenders": the hand-back's #278),
  SECURITY COMPROMISED v1 ("its defence is being rearranged"), UNDER TRIBUTE v1 ("pays ... its defence with what is left")
  + `guardPresence` (each pool's no-force line says there is nobody to do it); DS-DEF-11 WALLED-QUIET v2, v3 + `no crisis:
  unrest` ("ahead of any present need" / "now that it asks little of it" in a war or a revolt: v1's); DS-POW-6 GM ADVISORY v1,
  v2, v4, v5 + `no crisis: occupied` (v3's: the seat that must bargain with the commander or the faction is the occupiers').
- TRUE WITHOUT IT, SAID: DEF-1 CRITICAL v1 v2 v4 without `no walls`; v2 v4 without `no crisis: threat, unrest` (capacity, not
  quiet); STRONG v1 without `no crisis: occupied` ("reads as a defended place from the road in": the works, not who holds them),
  without `no crisis: wartime / unrest`; WEAK v1 v3 without `walls`, v1 under siege, beasts and unrest (a capacity line).
  DEF-2 settled beyond the need v1 v2 without `no crisis: unrest`; settled nothing organized v1-v3 without `no guardPresence`;
  plagued v1 v3 v4 without `gate`, v1 v3 under siege; CHAIN working v2 under famine (the key's own claim), v1-v3 against `food:
  famine` (the siege twins' scope); STRONG the crisis lines against `no crisis` (their own scope); WEAK v3 either side of
  guardPresence; neither walls nor force v2 v3 beside a watch, v4 v8 v9 under siege; walls AND garrison v3 under siege ("the
  soldiers on the walls give them good reason": v4 is the siege line, v3 is not false there); walls with NO force v7 either
  side of a watch. DEF-3 insurgency and fracture colour lines in small places (v2 v4; fracture v4 v5), the guardPresence
  partitions (Moderate, Dangerous, slave revolt, insurgency); Moderate's lines without v3's `tier: ≥ village`. DEF-4 capture
  none v1 v3 without `organised crime`. DEF-5 arcane, garrison, watch, walls lines without `gate`; garrison v1 v2 under siege.
  DEF-6 Port only v1, v2 under threat or unrest. DEF-8 every other colour line either side of guardPresence; UNDER TRIBUTE v3
  ("less money reaches its defence": works as well as wages); viability intact v1 under an occupation (HANDBACK-12 read it).
  DEF-11 WALLED-STRAINED every partition (watch, soldiers, guardPresence). DEF-12: cured above. POW-1 colour lines either
  side of the tier bands; POW-2 siege matched v3 and the walls/gate partitions; POW-4 Stable v6 is the unrest line; POW-5
  council v3 without `no ruler: lord` (it presumes no body of many), v1 v2 v4 under a succession; crimeIsGovt v2 v3;
  merchantArmy v1 without `mercenary` (house guards need not be hired companies); POW-6 ADVANCING every partition (watch,
  tier, the crisis twins), v4 under an occupation (it claims no unwatched office); RECOVERING v4; neutral baseline v2; duty
  evasion v1 v3 without `gate`. FTH-4 hunted v4 without a temple. CND-1 famine v2-v4 without `tier: ≥ village`; migration:
  the influx and exodus lines are a partition by direction.
- THE SIDE SEAT'S ROWS (DS-ECO, DS-GEN, DS-SUP): NOT READ here; sent to the chair as the rows of `sweep.525541b42.tsv`
  whose block begins DS-ECO, DS-GEN or DS-SUP (129 rows drawn where the condition fails).

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
