# W2-WRITE-SIDE-13 — the hand-back of the corpus lane's side seat (the ECONOMY and GENERAL pools: DS-ECO, DS-GEN, DS-SUP) — HANDED BACK BY FILE on the chair's word (14:53 UTC), after step 1

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
Step 1 is DONE (dba1a16c4, fe7769659, 34b60f038). Nothing begun beyond it. In order:
1. THE BAR'S ROWS (BAR-0-ROWS-corpus.json on the chair's lane), as the twelfth seat planned each:
   - #39 DS-GEN-13 WAREHOUSES v2 under a siege (45 towns; v2 is the only line there; plan: v2 `no crisis: under_siege`, the
     pool then silent under a siege, since the warehouse chain runs in 4 besieged crossroads towns and no siege twin is true in all;
     but the chair's 14:29 law (1) asks a TWIN TRUE IN THAT STATE where a condition leaves a pool mute: write one if a true line exists).
     (The brief names it DS-ECO WAREHOUSES; the pool is DS-GEN-13's.)
   - #275 DS-ECO-10 entrepot v2 and v1: 87 of 89 drawn towns re-export nothing they import: reword to transit; NAME
     `src/generators/economy/tradeGoods.js :: deriveIsEntrepot` (the flag is route-only) for the join.
   - #168 DS-ECO-8 PROSPEROUS: v1 drawn in 3 thorps and a village with no hall; v2 v4 name "halls" too; no hall atom: v1
     `tier: ≥ village · walls` reworded without halls, v2 v4 "halls" out.
   - #12 DS-ECO-11 RESOURCE CONDITION natural v2 (and v1, manual v2): the abandonment claim: reword to the ground spent.
   - #114 DS-GEN-13 COMMERCE merchant guild v1-v4 where only a merchant oligarchy stands (6 of 130 towns): reword to the
     merchants; NAME `src/generators/priorityHelpers.js` (hasMerchantGuild reads 'merchant oligarchy') for the join.
   - #116 ("leaves its timber unworked" beside a Sawmill, 59 of 67 towns): find its pool first (DS-ECO-11 unexploited, by its
     words: this seat's); if it is the other seat's, tell the chair.
2. THE LAST READ'S ROWS STILL FALSE in these pools: DS-ECO-9 DEFICIT v5 (rw3-metropolis-under_siege-1) and IMPORT-DEPENDENT v5
   (r2s-under_siege-city-0, r2s-under_siege-metropolis-3), under a siege; DS-ECO-11 partiallyExploited v5 through its replacement
   unexploited v3 ("nobody has found it worth the trouble" beside Carpenters, a Sawmill and a running Timber chain,
   r2s-under_siege-city-3); DS-ECO-12 CRITICAL IMPORT the land cannot give it v1 (rww-town-calm-1); DS-GEN-18 BOUGHT-IN v9
   (rww-hamlet-mass_migration-1, rww-village-famine-1, rww-village-indebted-1).
3. THE SLASH LABEL "gold/silver ore" through slots: DS-ECO-12 a house needs v1 v2; DS-ECO-11 unexploited-high v2 (47 towns): the
   good's plain words by the lane's own slot filler ("gold and silver ore" unless the Economics pill prints another plain form).
   Then: the sawmill's two partial-pool lines; the religious houses' pool; the hand-back-12 step 4(b) lines in these pools (the
   presumed door's fresh hits: at this tip 17, none left in DS-GEN-13; economy.generated.js holds two: `famine` "no crisis: famine"
   and `famineToCome` "Nobody at {settlement} worries much about one poor harvest"); the two empty cases.
4. THE SWEEP'S ROWS (the chair, 14:29: origin/lane/w2-write-2026-11-13
   docs/chair/2026-11-14/probes/W2-WRITE-13/sweep-side-seat-rows.525541b42.tsv, 129 rows, tools sweep.mjs and vt.mjs beside it):
   each lacking sibling READ under the failed condition: it takes the condition, or is true without it and is SAID so; a condition
   that would leave a pool MUTE in a state it could speak in is answered by a TWIN TRUE IN THAT STATE (the chair's law 1); pool by
   pool, the fast set after each (law 2). Already answered by step 1: DS-GEN-13 NO-MARKET `gate` and `institution: tavern` for v4
   v5 v6 (the siege lines name no gate or inn: true without them, SAID here); DS-GEN-13 MARKET-OPEN `no crisis: plague_onset` (v3
   took it, fe7769659). The rows ranked by the draws where the condition fails (failDrawn first):
   - 369 DS-ECO-2 :: FOOD: deficit · `grain` (carriers v2,3; lacking v1; v1:369)
   - 341 DS-GEN-13 :: NO-MARKET · `gate` (carriers v1,2; lacking v3,4,5,6; v3:291 v4:22 v5:15 v6:13)
   - 293 DS-ECO-12 :: INCOME MIX: one source carries the town · `prosperity: ≥ moderate` (carriers v3; lacking v1,2; v1:148 v2:145)
   - 292 DS-GEN-13 :: NO-MARKET · `institution: tavern` (carriers v1,2; lacking v3,4,5,6; v3:249 v4:18 v5:14 v6:11)
   - 278 DS-GEN-3 :: scores.military: CRITICAL · `gate` (carriers v2; lacking v1,3,4,5,6; v1:154 v3:92 v4:2 v6:30)
   - 273 DS-ECO-12 :: CRITICAL IMPORT: the land cannot give it · `no imports` (carriers v3; lacking v1,2; v1:153 v2:120)
   - 266 DS-ECO-9 :: SECURE · `stores: >= 12` (carriers v6,7; lacking v1,2,4,5; v1:131 v2:135)
   - 259 DS-GEN-18 :: BOUGHT-IN · `guild` (carriers v5; lacking v1,2,3,4,6,7,8,9; v1:63 v2:1 v4:71 v6:2 v7:24 v8:19 v9:79)
   - 251 DS-ECO-12 :: CRITICAL IMPORT: a house needs what the land lacks · `stores: < 6` (carriers v3; lacking v1,2; v1:126 v2:125)
   - 245 DS-GEN-3 :: foodSecurity.label: Secure · `institution: granary` (carriers v1; lacking v2,3,4; v2:97 v3:9 v4:139)
   - 240 DS-GEN-18 :: BOUGHT-IN · `market` (carriers v2,6; lacking v1,3,4,5,7,8,9; v1:57 v4:71 v7:22 v8:16 v9:74)
   - 218 DS-GEN-3 :: foodSecurity.label: Secure · `market` (carriers v3; lacking v1,2,4; v2:91 v4:127)
   - 215 DS-ECO-12 :: TRADE PROFILE: exports and imports both present · `market` (carriers v3; lacking v1,2; v2:215)
   - 190 DS-ECO-2 :: FOOD: deficit · `institution: granary` (carriers v3; lacking v1,2; v1:183 v2:7)
   - 186 DS-ECO-8 :: STRUGGLING · `market` (carriers v3; lacking v1,2,4,5,6,7; v1:25 v2:28 v4:37 v5:28 v6:33 v7:35)
   - 181 DS-GEN-18 :: BOUGHT-IN · `tier: ≥ village` (carriers v5; lacking v1,2,3,4,6,7,8,9; v1:46 v2:1 v4:51 v7:19 v8:14 v9:50)
   - 167 DS-GEN-13 :: MARKET-OPEN · `tier: ≤ town` (carriers v1; lacking v2,3,4,5,6; v2:43 v3:41 v4:53 v5:27 v6:3)
   - 165 DS-ECO-1 :: COMBINATION C4: a low rung on a working approach · `market` (carriers v3; lacking v1,2,4,5,7; v1:65 v2:56 v4:15 v5:14 v7:15)
   - 160 DS-ECO-2 :: FOOD: balanced · `grain` (carriers v3; lacking v1,2,4; v1:90 v2:70)
   - 156 DS-ECO-1 :: COMBINATION C3: the middle rungs · `no crisis` (carriers v3; lacking v1,2; v1:156)
   - 152 DS-ECO-1 :: COMBINATION C4: a low rung on a working approach · `no market` (carriers v6; lacking v1,2,4,5,7; v1:45 v2:44 v4:23 v5:19 v7:21)
   - 150 DS-GEN-3 :: scores.military: STRONG · `no walls` (carriers v4; lacking v2,3; v2:82 v3:68)
   - 145 DS-ECO-11 :: TERRAIN: Plains · `grain` (carriers v1,3; lacking v2; v2:145)
   - 137 DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Dangerous, Desperate} · `watch` (carriers v3; lacking v1,2; v1:68 v2:69)
   - 131 DS-ECO-10 :: POSTURE: established · `tier: ≥ village` (carriers v2; lacking v1,3,4,5,6,7,8,9; v1:23 v3:27 v4:19 v5:34 v6:17 v7:4 v8:4 v9:3)
   - 131 DS-ECO-2 :: FOOD: surplus · `grain` (carriers v2; lacking v1,3,4; v1:59 v3:72)
   - 125 DS-GEN-5 :: river · `coast` (carriers v5,6,7; lacking v1,2,3,4; v1:45 v2:26 v3:30 v4:24)
   - 125 DS-GEN-6 :: river · `coast` (carriers v5,6,7,8,9,10; lacking v1,2,3,4; v1:26 v2:14 v3:39 v4:46)
   - 119 DS-GEN-3 :: scores.military: CRITICAL · `walls` (carriers v4,5; lacking v2,3,6; v3:92 v6:27)
   - 114 DS-GEN-3 :: scores.internal: WEAK · `watch` (carriers v1; lacking v2,3; v2:65 v3:49)
   - 113 DS-ECO-2 :: FOOD: balanced · `hunger` (carriers v4; lacking v1,3; v1:105 v3:8)
   - 106 DS-ECO-12 :: INCOME MIX: one source carries the town · `no hunger` (carriers v3; lacking v1,2; v1:45 v2:61)
   - 99 DS-GEN-3 :: scores.military: ADEQUATE · `no walls` (carriers v4; lacking v1,3; v1:46 v3:53)
   - 97 DS-ECO-11 :: TERRAIN: Forest · `game` (carriers v1; lacking v2,3; v2:31 v3:66)
   - 96 DS-ECO-11 :: TERRAIN: Forest · `grain` (carriers v1; lacking v2,3; v2:27 v3:69)
   - 95 DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe} · `watch` (carriers v3; lacking v1,2; v1:56 v2:39)
   - 95 DS-GEN-3 :: economicViability.viable: true · `no crisis: threat` (carriers v3; lacking v1,2,4; v1:38 v2:24 v4:33)
   - 93 DS-ECO-11 :: TERRAIN: Hills · `grain` (carriers v1; lacking v2,3; v2:49 v3:44)
   - 92 DS-ECO-10 :: POSTURE: established · `no hunger` (carriers v1; lacking v2,3,4,5,6,7,8,9; v5:17 v7:33 v8:21 v9:21)
   - 85 DS-GEN-3 :: defenseProfile.readiness.label: Undefended · `militia` (carriers v3,5; lacking v1,6; v1:41 v6:44)
   - 82 DS-GEN-3 :: scores.military: WEAK · `gate` (carriers v1; lacking v2,3; v2:56 v3:26)
   - 77 DS-ECO-11 :: EXPLOITATION: fullyExploited · `gate` (carriers v2; lacking v1,3,4,5; v1:23 v3:28 v4:20 v5:6)
   - 75 DS-ECO-6 :: TIER: significant off-book activity (≥15) · `no market` (carriers v7; lacking v0,1,2,6; v0:21 v1:18 v2:17 v6:19)
   - 67 DS-ECO-2 :: FOOD: surplus · `hunger` (carriers v4; lacking v1; v1:67)
   - 67 DS-ECO-9 :: PRESSURED · `hunger` (carriers v4; lacking v1,2; v1:28 v2:39)
   - 66 DS-GEN-3 :: scores.military: WEAK · `watch` (carriers v1; lacking v2,3; v2:48 v3:18)
   - 65 DS-ECO-1 :: COMBINATION C3: the middle rungs · `market` (carriers v3; lacking v1,2; v1:52 v2:13)
   - 64 DS-ECO-9 :: PRESSURED · `grain` (carriers v3; lacking v1,2,4; v1:26 v2:38)
   - 64 DS-GEN-18 :: BOUGHT-IN · `no crisis: famine` (carriers v6; lacking v1,2,3,4,5,7,8,9; v1:14 v2:2 v4:10 v5:1 v7:12 v8:11 v9:14)
   - 62 DS-ECO-9 :: FOOD SOURCES: one source · `no crisis: famine` (carriers v1,3; lacking v2; v2:62)
   - 60 DS-ECO-12 :: INCOME WEIGHT: the religious houses · `tier: ≥ village` (carriers v1,2; lacking v3,4; v3:28 v4:32)
   - 60 DS-GEN-5 :: port · `institution: docks` (carriers v3; lacking v1,2,4; v1:25 v2:19 v4:16)
   - 59 DS-GEN-3 :: scores.military: ADEQUATE · `gate` (carriers v2; lacking v1,3,4; v1:18 v3:35 v4:6)
   - 55 DS-GEN-3 :: scores.military: CRITICAL · `no crisis: threat` (carriers v3; lacking v1,2,4,5; v1:49 v2:1 v4:2 v5:3)
   - 52 DS-ECO-11 :: TERRAIN: Forest · `watch` (carriers v2; lacking v1,3; v3:52)
   - 52 DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe} · `no crisis: threat` (carriers v2; lacking v1,3; v1:36 v3:16)
   - 50 DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined} · `no crisis: threat` (carriers v1,2; lacking v3,4; v3:13 v4:37)
   - 50 DS-GEN-9 :: event type: economic · `market` (carriers v3; lacking v1,2,4,5,6,7; v1:7 v2:6 v4:9 v5:10 v6:9 v7:9)
   - 49 DS-GEN-6 :: isolated · `market` (carriers v4; lacking v1,2,3; v1:5 v2:3 v3:41)
   - 46 DS-GEN-17 :: GARRISONED · `walls` (carriers v2; lacking v1; v1:46)
   - 45 DS-GEN-13 :: WAREHOUSES · `no crisis: under_siege` (carriers v1,3,4; lacking v2; v2:45)
   - 44 DS-ECO-6 :: TIER: significant off-book activity (≥15) · `guild` (carriers v0; lacking v1,2,3,4,5,6,7; v1:11 v2:6 v3:1 v5:1 v6:16 v7:9)
   - 42 DS-ECO-6 :: TIER: minor shadow activity (≥3) · `no crisis: under_siege` (carriers v0; lacking v1,2,3,4,5; v1:12 v2:18 v3:11 v5:1)
   - 41 DS-ECO-6 :: TIER: minor shadow activity (≥3) · `no crisis: famine` (carriers v0; lacking v1,2,3,4,5; v1:14 v2:12 v3:15)
   - 40 DS-ECO-9 :: SECURE · `stores: < 12` (carriers v3; lacking v1,2,4,5; v1:24 v2:16)
   - 39 DS-GEN-3 :: defenseProfile.readiness.label: Lightly Defended · `no walls` (carriers v3; lacking v2; v2:39)
   - 37 DS-ECO-11 :: TERRAIN: River · `institution: mill` (carriers v1; lacking v2,3; v2:17 v3:20)
   - 37 DS-ECO-8 :: MODERATE · `no crisis` (carriers v2,3; lacking v1; v1:37)
   - 37 DS-ECO-8 :: PROSPEROUS · `no walls` (carriers v4; lacking v1,3; v1:18 v3:19)
   - 36 DS-GEN-3 :: scores.military: CRITICAL · `no crisis: under_siege` (carriers v4; lacking v1,2,3,5,6; v1:25 v6:11)
   - 35 DS-GEN-13 :: COMMERCE: a bank · `no crisis: under_siege` (carriers v1; lacking v2,3,4; v2:6 v3:16 v4:13)
   - 34 DS-GEN-3 :: foodSecurity.label: Deficit · `population: ≥ middling` (carriers v2; lacking v1,3,4; v1:14 v4:20)
   - 34 DS-GEN-3 :: foodSecurity.label: Deficit · `institution: granary` (carriers v3; lacking v1,2,4; v1:14 v4:20)
   - 32 DS-ECO-12 :: INCOME WEIGHT: the religious houses · `no crisis: under_siege` (carriers v3,4; lacking v1,2; v1:20 v2:12)
   - 32 DS-GEN-3 :: defenseProfile.readiness.label: Fortress · `no walls` (carriers v3; lacking v1; v1:32)
   - 32 DS-GEN-3 :: defenseProfile.readiness.label: Undefended · `walls` (carriers v3,4; lacking v2,5; v2:31 v5:1)
   - 30 DS-ECO-6 :: TIER: significant off-book activity (≥15) · `market` (carriers v3,4,5; lacking v0,1,2,6; v1:10 v2:5 v6:15)
   - 29 DS-GEN-3 :: scores.military: WEAK · `no crisis: threat` (carriers v3; lacking v1,2; v2:29)
   - 28 DS-GEN-7 :: stress_economic: siege against trade income · `gate` (carriers v1,4; lacking v2,3; v2:6 v3:22)
   - 27 DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined} · `watch` (carriers v3; lacking v1,2,4; v4:27)
   - 26 DS-GEN-3 :: foodSecurity.label: Pressured · `institution: granary` (carriers v1,4; lacking v2,3; v2:14 v3:12)
   - 26 DS-GEN-9 :: event type: religious · `institution: temple` (carriers v4; lacking v1,2,3,5,6,7; v1:2 v2:3 v3:3 v5:6 v6:7 v7:5)
   - 25 DS-ECO-8 :: POOR · `food: ≥ secure` (carriers v2; lacking v1,3,4; v1:8 v3:9 v4:8)
   - 25 DS-GEN-3 :: defenseProfile.readiness.label: Lightly Defended · `walls` (carriers v1; lacking v2; v2:25)
   - 24 DS-ECO-9 :: IMPORT-DEPENDENT · `grain` (carriers v2; lacking v1,3,4,5,6; v3:6 v5:3 v6:15)
   - 23 DS-GEN-3 :: scores.internal: ADEQUATE · `no crisis: unrest` (carriers v1; lacking v2,3; v2:13 v3:10)
   - 22 DS-ECO-10 :: POSTURE: established · `no crisis: famine` (carriers v2,3,4,6; lacking v1,5,7; v5:17 v7:5)
   - 20 DS-ECO-9 :: IMPORT-DEPENDENT · `no hunger` (carriers v3; lacking v1,2,5,6; v5:5 v6:15)
   - 19 DS-ECO-12 :: TRADE PROFILE: local production listed · `walls` (carriers v1; lacking v2,3; v2:11 v3:8)
   - 19 DS-ECO-9 :: DEFICIT · `no crisis: under_siege` (carriers v1,2; lacking v3; v3:19)
   - 19 DS-GEN-17 :: GREAT HOUSE: monastery · `no crisis: under_siege` (carriers v1,3; lacking v2,4; v2:7 v4:12)
   - 19 DS-GEN-3 :: foodSecurity.label: Import-Dependent · `no crisis: hunger` (carriers v3,4,5; lacking v1,2; v1:8 v2:11)
   - 18 DS-GEN-3 :: foodSecurity.label: Import-Dependent · `no walls` (carriers v5; lacking v1,2,4; v1:6 v2:10 v4:2)
   - 18 DS-GEN-7 :: stress_economic: siege against trade income · `market` (carriers v2; lacking v1,3,4; v3:18)
   - 16 DS-GEN-3 :: scores.internal: STRONG · `no crisis: unrest` (carriers v1,3; lacking v2; v2:16)
   - 13 DS-GEN-3 :: scores.military: CRITICAL · `no crisis: wartime` (carriers v3; lacking v1,2,4,5,6; v1:13)
   - 13 DS-GEN-3 :: scores.monster: STRONG · `no crisis: monster_pressure` (carriers v3; lacking v1,2; v1:8 v2:5)
   - 13 DS-GEN-3 :: scores.economic: STRONG · `no crisis: hunger` (carriers v2,3; lacking v1; v1:13)
   - 12 DS-ECO-10 :: POSTURE: established · `no crisis: under_siege` (carriers v2,3,4,5,6; lacking v1,8,9; v8:4 v9:8)
   - 12 DS-ECO-8 :: PROSPEROUS · `walls` (carriers v2; lacking v1,3; v1:7 v3:5)
   - 12 DS-GEN-13 :: COMMERCE: a merchant guild, no bank · `no crisis: under_siege` (carriers v1,2,4; lacking v3; v3:12)
   - 10 DS-ECO-11 :: TERRAIN: Coastal · `fish` (carriers v2; lacking v1,3; v1:7 v3:3)
   - 10 DS-ECO-12 :: TRADE PROFILE: local production listed · `no walls` (carriers v4; lacking v2,3; v2:5 v3:5)
   - 10 DS-GEN-13 :: COMMERCE: craft guilds, no merchant guild · `no crisis: under_siege` (carriers v4; lacking v1,2,3; v1:4 v2:5 v3:1)
   - 10 DS-GEN-3 :: scores.military: WEAK · `no garrison` (carriers v1; lacking v2,3; v2:8 v3:2)
   - 9 DS-GEN-3 :: defenseProfile.readiness.label: Undefended · `no walls` (carriers v1,6; lacking v2,5; v2:1 v5:8)
   - 8 DS-GEN-13 :: MARKET-OPEN · `no crisis: plague_onset` (carriers v1,2; lacking v3,4,5; v3:5 v4:3)
   - 8 DS-GEN-13 :: COMMERCE: a market, no guild · `no crisis: under_siege` (carriers v4; lacking v1,2,3; v1:6 v2:1 v3:1)
   - 8 DS-GEN-3 :: scores.military: ADEQUATE · `walls` (carriers v2; lacking v1,3; v1:2 v3:6)
   - 8 DS-GEN-3 :: foodSecurity.label: Import-Dependent · `market` (carriers v3,5; lacking v1,2,4; v1:3 v2:3 v4:2)
   - 7 DS-ECO-8 :: MODERATE · `crisis` (carriers v4; lacking v1; v1:7)
   - 7 DS-ECO-8 :: COMFORTABLE · `no crisis: indebted` (carriers v1; lacking v2,3; v2:4 v3:3)
   - 7 DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined} · `no crisis: plague_onset` (carriers v1,2; lacking v3; v3:7)
   - 7 DS-GEN-3 :: foodSecurity.label: Import-Dependent · `walls` (carriers v3; lacking v1,2,4; v1:5 v2:2)
   - 6 DS-GEN-3 :: scores.military: CRITICAL · `no walls` (carriers v1; lacking v2,3,6; v2:1 v6:5)
   - 6 DS-GEN-3 :: scores.monster: ADEQUATE · `no crisis: monster_pressure` (carriers v1,3; lacking v2; v2:6)
   - 5 DS-GEN-3 :: scores.military: WEAK · `no crisis: wartime` (carriers v3; lacking v1,2; v1:1 v2:4)
   - 5 DS-GEN-3 :: scores.economic: STRONG · `no crisis: indebted` (carriers v1,3; lacking v2; v2:5)
   - 4 DS-ECO-11 :: EXPLOITATION: fullyExploited · `no crisis: under_siege` (carriers v1,3; lacking v2,4; v2:2 v4:2)
   - 4 DS-GEN-3 :: scores.military: STRONG · `no crisis: occupied` (carriers v3; lacking v1,2,4; v1:1 v2:3)
   - 3 DS-ECO-6 :: TIER: a large share off the books (≥30) · `guild` (carriers v4; lacking v1,2,3; v1:1 v2:2)
   - 3 DS-GEN-3 :: scores.internal: ADEQUATE · `watch` (carriers v2; lacking v1,3; v1:1 v3:2)
   - 3 DS-GEN-7 :: power_economic: temple economy under a secular seat · `no crisis: succession` (carriers v4; lacking v1,2,3; v2:3)
   - 2 DS-ECO-8 :: WEALTHY · `gate` (carriers v2; lacking v1,3; v1:1 v3:1)
   - 1 DS-GEN-3 :: scores.military: STRONG · `walls` (carriers v1; lacking v2,3; v3:1)
   - 1 DS-GEN-3 :: scores.internal: STRONG · `no crisis: succession` (carriers v3; lacking v1,2; v1:1)
   - 1 DS-GEN-3 :: scores.economic: ADEQUATE · `market` (carriers v2; lacking v1,3; v1:1)
   - 1 DS-GEN-3 :: defenseProfile.readiness.label: Undefended · `no garrison` (carriers v1,2,3,4,5; lacking v6; v6:1)
   - 1 DS-GEN-3 :: defenseProfile.readiness.label: Undefended · `no militia` (carriers v2,4; lacking v1,6; v1:1)
5. The disqualifier cures with no guard in these pools (the reader's M9 table): to be NAMED from the reader's findings table.

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
or keeps its own revenue. REGISTERS ARE RE-DERIVED ONCE, AT THE CLOSE. Messages from the chair (ReadNotifications, read at 14:56 UTC):
- 14:29: "THE SWEEP'S ROWS FOR YOUR POOLS ARE IN (your step 4) ... PLACE THEM BY DRAWS among your rows; a lacking sibling is READ
  under the failed condition: it takes the condition, or is true without it and is SAID so. TWO LAWS ...: (1) a condition that leaves
  a pool MUTE in a state it could speak in is answered by A TWIN TRUE IN THAT STATE, never by a raised ceiling on the authoring bill
  and never by a park; (2) batch nothing: land pool by pool, the fast set after each."
- 14:53: "PUSH NOW every commit ... after this push, finish the cure in hand, write your hand-back by file with what is left line by
  line, push, and tell me in one message." (The branch was first pushed at 630f9bfb3 before that message; step 1 pushed at
  ba0de0e5c.)
THE COUNT: get_session's `context_usage.used_tokens` read 0 at the start; the chair reads 0 too; this seat hands back on time.
