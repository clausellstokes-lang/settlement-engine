# W2-WRITE-SIDE-13 — the hand-back of the corpus lane's side seat (the ECONOMY and GENERAL pools: DS-ECO, DS-GEN, DS-SUP)

**Branch:** `lane/w2-write-side-13-2026-11-14`, cut from the corpus lane `lane/w2-write-2026-11-13` at `525541b42` (the tip
read back from origin at the start; the brief's own figure, no difference). Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-SIDE-13.md`
on the chair's lane (the chair session_01ACmDYZrFEVXyZEUg1NDxxC). Scratch worktree on local branch `side13`, pushed by
`git push origin side13:refs/heads/lane/w2-write-side-13-2026-11-14`, each push tested non-empty first. In the source document
this seat edits only the sections of DS-ECO, DS-GEN and DS-SUP. KEPT CURRENT AFTER EVERY ITEM.

**Holders checked before the first edit (by content, 97 lanes of 2026-11-10..14):** the source document's DS-ECO/GEN/SUP sections
on `lane/join-2026-11-14` equal this tip's (the join differs only in DS-GEN-3); `lane/w2-fix-data-2026-11-13` changed DS-ECO-8 and
DS-ECO-12 rows against the integration base, and those rows are already in this tip. `tests/domain/generalStateProseDesk.test.js`
is held by w2-fix-data, r2-code-a and the join lanes: this seat does not edit it (its guard is a new file).

**Measured at the start:** the owner-page render (`render.sh`, HANDBACK-10's instrument) at `525541b42` over `seeds-w5a.txt` and the
bar's ten `bar0-` seeds (772 towns, 4 workers, every shard exit 0). Fast set at the tip: 8 reds (DS-POW-6 "5a RE-RULED" and
"ALIVENESS"; presumedThings ARM 1; proseCorpusBytes "RAW is EXACT"; proseWiringCensus "car 0" and "THE DRY READ"; wiringCensusDeclared
"every row carries the four columns" and "every exported sibling set ... is a channel", the last red only in the archive tree the
base was measured in, not in a git worktree). Presumed-things door `--check`: fresh 23. Grid: exit 0, 8 falls.

## Items (each its own commit, pushed as made)
| row | pool · vids | before -> after (772) | cure | commit | guard |
|---|---|---|---|---|---|
| M1 (reader) | DS-GEN-16 LEGACY ×6 + the block's other `{calamity}` lines | towns printing an agreement fault 38 -> 0 (79 re-rendered; draws per vid identical) | 15 lines reworded (below); no declaration | dba1a16c4 | tests/domain/corpusSlotAgreement.test.js (red 15 of 19 at the tip) |
| M5, L2, #38 | DS-GEN-13 MARKET-OPEN v3 v5 v6, NO-MARKET v4 v5 v6 | siege: v5 48 towns printed clipped without its siege -> 0; NO-MARKET v4/v5/v6 22/15/13 the same -> 0; plague (13 towns): v3 5 -> 0, v4 3 -> 5, v6 5 -> 8 | v5, NO-MARKET v4-v6 reworded (siege before the clip); v3 + `no crisis: plague_onset`; + `market` / `no market` on the six (presumed door fresh 23 -> 17) | fe7769659 | tests/domain/corpusClipGuard.test.js (red 4 of 6 at the tip); corpusCureGuards MARKET-OPEN v3 at w5-village-plague_onset-102 (red at the tip) |
| M6 | DS-GEN-18 STALLED v2 v3 v4 | draws unchanged (v2 133, v3 129, v4 43); the "bought in" claim 305 towns -> 0 | reworded to the record's fact (nothing here makes the feed); `imports` considered and refused (unused atom: reds the kernel sweep and desk pins in files other lanes hold) | 34b60f038 | none: no line leaves a town |

## New or changed lines (the owner's veto list, with the towns read)
- DS-GEN-16 (dba1a16c4), the slot's values listed: 28 fills over the 772 records, two plural ("plague years", "heresy trials").
  - LEGACY-UNRESOLVED v1 "The {calamity} left a legacy of trouble in {settlement} that has never been fully put right, and that legacy is {timeband_age}." (bar0-village-famine-rand-1, w5-town-occupied-3, bar0-city-under_siege+famine-rand-1)
  - LEGACY-UNRESOLVED v2 "Nobody in {settlement} has finished putting right the legacy the {calamity} left, and that legacy is {timeband_age}." (w5-thorp-succession_void-1, w5-city-under_siege-106, w5-metropolis-famine-6)
  - LEGACY-RECOVERED v1 "{settlement} came through the {calamity}, and what the town built in answer still stands; that legacy is {timeband_age}."
  - LEGACY-RECOVERED v2 "Much of what stands in {settlement} now was built after the {calamity}; that legacy is {timeband_age}." (12 towns, hamlet to metropolis: w5-hamlet-religious_conversion-102, w5-metropolis-calm-104)
  - LEGACY-SHIFTED v1 "What {settlement} settled in the wake of the {calamity} still shapes the town, though much has changed since; that legacy is {timeband_age}." (rww-metropolis-famine-1, w5-city-indebted-102)
  - LEGACY-SHIFTED v2 "{settlement} still keeps the shape the town took after the {calamity}, though the times have moved on; that legacy is {timeband_age}." (w5-thorp-monster_pressure-3, rww-city-under_siege-1, w5-metropolis-indebted-101)
  - LEGACY-LINKED v1 "What the {calamity} left behind is {timeband_age}, and that legacy still bears on how {settlement} lives." / v2 "{settlement} still lives with what the {calamity} left, and that legacy is {timeband_age}." (NEVER DRAWN on the 772)
  - LIVING-MEMORY v1 "People in {settlement} still remember the {calamity}, and the memory weighs on the quarrels the town is having now." (bar0-hamlet-under_siege-rand-1, rww-city-calm-1) / v2 "Ask about the town's present quarrels in {settlement} and before long somebody brings up the {calamity}." (w5-thorp-occupied-103, w5-town-famine-106, w5-city-under_siege-106)
  - The record pool, which prints on NO surface (history.record is a glance row by chair ruling H3/H4; 0 prints on the 772): ANCHORED-RECENT v1 "People in {settlement} still say 'before' and 'after' the {calamity}." · v3 "... people still remember how bad that time was." · ANCHORED-OLD v1 "{settlement} still keeps habits nobody can now explain, from the time of the {calamity}; that time is {timeband_age}." · v3 "... everybody here lives in the town that time made." · RECORDED-UNANCHORED v1 "... nothing in the town today turns on that time."

## THE REGISTERS NAMED STALE (not re-taken: the chair's ruling, re-derived once at the close)
- The byte baseline (`scripts/.prose-byte-baseline.json`; `tests/lint/proseCorpusBytes.test.js` "RAW is EXACT"): stale before this seat, moved again by dba1a16c4.
- The wiring census (`docs/content/wiring-census.json`; proseWiringCensus "car 0" and "THE DRY READ", wiringCensusDeclared "four columns"): stale before this seat, moved again by dba1a16c4 (`doors.sh` rewrites it: this seat restores the committed copy after each door run).
- The shift register (`docs/content/prose-shift-register.json`): not re-pinned (`repin.mjs` not run).

- DS-GEN-13 (fe7769659): MARKET-OPEN v5 "With the siege closing the road, {settlement}'s market has only the town's own people left to sell to." (48 besieged towns, village to metropolis: rww-village-under_siege-1, rww-metropolis-under_siege-1, bar0-city-under_siege+famine-rand-1) · NO-MARKET v4 "Since the siege closed the road, almost nothing changes hands at {settlement}, which keeps no market or fair." (rww-hamlet-under_siege-1, w5-hamlet-under_siege-101) · v5 "With the road shut by the siege, what little trade {settlement} did with no market of its own has stopped." (w5-hamlet-under_siege-1, bar0-hamlet-under_siege-rand-1) · v6 "With the siege across the road, nobody comes in to sell at {settlement}, which has no market to come to." (rww-thorp-under_siege-1, the smallest) · declarations: MARKET-OPEN v3 `market · no crisis: plague_onset`, v6 `market`. INHERITORS of v3 under plague: v4 "The market stands where carts always stopped." (w5-city-plague_onset-3, w5-metropolis-plague_onset-102), v6 "The sickness has thinned X's market: the stalls still open." (w5-metropolis-plague_onset-3, w5-town-plague_onset-102, w5-village-plague_onset-102).
- DS-GEN-18 (34b60f038): STALLED v2 "Some of the work at {settlement} needs goods that nothing here makes." (w5-hamlet-monster_pressure-101, bar0-metropolis-calm-rand-1, w5-city-occupied-101) · v3 "No trade at {settlement} makes what some of its work needs, so that much must come from elsewhere or be done without." (rww-city-famine-1, w5-hamlet-famine-5, w5-village-calm-3) · v4 "Some of the work at {settlement} needs goods that nothing here makes, and since the siege nothing comes in from outside." (rww-metropolis-under_siege-1, rww-town-under_siege-1).

## Guards owed
- none.

## FOR THE JOIN
- Count pins both seats of the corpus lane re-key (the same lines in tests/lint/proseEntryContradiction.walker.test.js and
  tests/lint/proseMoveGrammar.walker.test.js): this branch moved them by its own cures only (dba1a16c4: 378 -> 376; 137 -> 136;
  128 -> 127; 0.160 -> 0.159; fe7769659: 136 -> 135; 127 -> 126; 0.159 -> 0.158).
- corpusCureGuards.test.js rows: this branch adds its rows BESIDE the existing rows of its own pools (not at the end of GUARDS), so
  the lane seat's rows appended elsewhere merge without a conflict.
- Seen, not cured (out of this step's rows): DS-GEN-13 COMMERCE "a market, no guild" v1 "Anyone with goods and the stall fee can
  sell at X's market" prints under a siege (rww-village-under_siege-1): its siblings v4 carry `no crisis: under_siege`; for the sweep. At the join the figure is re-measured on the joined tree and re-keyed once, with both causes.

## What is left (line by line, the brief's order)
1. (step 1 DONE: dba1a16c4, fe7769659, 34b60f038.) The message to the chair after step 1; THE COUNT.
2. NEXT: the bar's rows #39, #275, #168, #12, #114, #116; the last read's rows still false; the slash labels; the sweep's rows; the disqualifier cures with no guard.

## How the instruments are re-made
HANDBACK-10's render (render.sh + render.w5.jsx over seeds-w5a.txt + seeds.bar0.txt, 4 workers: ~40 minutes on this machine) in an
ARCHIVE of the commit (never the tree being edited); the twelfth seat's `doors.sh`, `gates.sh`, `pins.py` (count pins with a cause;
`toBeCloseTo` shares by hand). This seat's helpers: `dc.py <dumps> '<block::pool>' [crisis|-] [vid]` (per vid eligible and drawn on the
owner's page, sizes, the drawn seeds); `fw.py <dumps> <regex> [n]` (towns whose page prints a match); `ctx.py`; `gram.mjs <block>`
(per pool, each line's move order through `classifyMoves`/`orderIdOf`: the THIN tier counts a pool of one grammar).

## The rulings this seat worked to
BRIEF-W2-WRITE-SIDE-13 whole; copied: A TWIN TAKES ITS SIBLINGS' CONDITION. A RE-GATE READS THE LINE THAT INHERITS ITS TOWNS. A LINE
ABOUT A BODY THAT MUST AGREE NEEDS A BODY OF MORE THAN ONE. A SLOT IS NOT MADE THE SUBJECT OF A VERB IT DOES NOT AGREE WITH. A LINE
THAT PRINTS CLIPPED SAYS ITS CRISIS BEFORE THE CLIP. NO LINE PRINTS A SLASH LABEL THROUGH A SLOT. UNDER A SIEGE NOTHING COMES IN OR
GOES OUT BY ROAD, GATE OR WATER; UNDER A FAMINE NO LINE OFFERS THE FOOD THAT FAILED; UNDER AN OCCUPATION no line says the town decides
or keeps its own revenue. REGISTERS ARE RE-DERIVED ONCE, AT THE CLOSE. Messages from the chair: none received so far.
