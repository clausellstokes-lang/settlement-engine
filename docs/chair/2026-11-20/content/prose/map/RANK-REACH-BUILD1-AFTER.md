# RANK-REACH, BUILD-1 AFTER (the tip 04fa578d9), 150 places a size

    ROOT=/home/user/settlement-engine/.claude/worktrees/agent-a68d06c1dd4451433
    HEAD=04fa578d997a09bbfe861f61bb56066a944d2965
    STATUS(porcelain, tracked)=0
    PLAN: draws hxd n=150 workers=4 sizes=thorp hamlet village town city metropolis
    START 2026-11-20T19:36:12Z
    END 2026-11-20T19:37:43Z
    workers: 4 logs;  4 Tests 225 passed (225); exits:  4 exit 0;
    records: 65308
    measure: a SCRATCH copy of map/run-map.sh with ROOT set to the tree above (its vitest config, its vi.mock path and its imports re-pointed to that tree; the committed tool is untouched), draws mode, prefix hxd, n=150, six sizes, 4 workers
    ranking: a SCRATCH copy of map/rank-reach.mjs whose PER is read from the environment (PER=150; the committed tool hard-codes 50), head 45

| # | worst top (of all places of a size) | new lines | pool | by size (reach %, median eligible, top %, need) |
|---|---|---|---|---|
| 1 | 68% | 5 | DS-ECO-6 :: TIER: minor shadow activity (≥3) | thor r15 e1 top15 need1 · haml r15 e1 top13 need2 · vill r16 e1 top15 need2 · town r49 e1 top31 need4 · city r83 e1 top68 need6 · metr r91 e2 top68 need7 |
| 2 | 47% | 4 | DS-DEF-4 :: FIXTURE: black market | city r84 e2 top47 need6 · metr r51 e2 top31 need4 |
| 3 | 41% | 4 | DS-DEF-5 :: charter hall PRESENT (specialist monster response) | haml r8 e3 top3 need1 · vill r11 e3 top5 need1 · town r25 e3 top11 need2 · city r83 e3 top33 need6 · metr r100 e3 top41 need7 |
| 4 | 39% | 4 | DS-POW-6 :: operation role duty evasion | town r12 e3 top6 need1 · city r54 e3 top20 need4 · metr r91 e3 top39 need7 |
| 5 | 37% | 4 | DS-POW-5 :: council | thor r99 e3 top37 need7 · haml r99 e4 top30 need7 · vill r84 e4 top26 need6 · town r28 e4 top11 need2 · city r62 e4 top27 need5 · metr r59 e4 top30 need4 |
| 6 | 37% | 4 | DS-DEF-2 :: Invasion & War: walls AND professional garrison | town r8 e3 top6 need1 · city r99 e3 top35 need7 · metr r100 e3 top37 need7 |
| 7 | 36% | 2 | DS-ECO-1 :: COMBINATION C3: the middle rungs | thor r53 e2 top31 need4 · haml r37 e2 top19 need3 · vill r33 e3 top18 need3 · town r65 e3 top36 need5 · city r21 e1 top21 need2 · metr r20 e1 top20 need2 |
| 8 | 36% | 3 | DS-ECO-2 :: FOOD: balanced | thor r11 e2 top6 need1 · haml r5 e2 top3 need1 · vill r15 e2 top7 need2 · town r55 e2 top27 need4 · city r70 e2 top36 need5 · metr r62 e2 top34 need5 |
| 9 | 36% | 4 | DS-ECO-12 :: INCOME MIX: two or three sources between them | vill r8 e3 top5 need1 · town r87 e3 top31 need6 · city r100 e3 top36 need7 · metr r93 e3 top33 need7 |
| 10 | 36% | 3 | DS-DEF-5 :: watch PRESENT | town r81 e3 top36 need6 · vill r3 e2 top3 need1 |
| 11 | 35% | 4 | DS-DEF-4 :: structure null (nothing organized recognized) | thor r90 e3 top33 need6 · haml r85 e3 top31 need6 · vill r92 e3 top35 need7 · town r31 e3 top14 need3 · city r1 e3 top1 need1 |
| 12 | 35% | 4 | DS-DEF-5 :: arcane defense PRESENT | haml r1 e2 top1 need1 · vill r4 e2 top3 need1 · town r6 e3 top3 need1 · city r83 e3 top31 need6 · metr r100 e3 top35 need7 |
| 13 | 35% | 4 | DS-DEF-2 :: Internal Security: full legal chain (court AND prison) | town r19 e3 top7 need2 · city r63 e3 top21 need5 · metr r99 e3 top35 need7 |
| 14 | 34% | 4 | DS-DEF-2 :: Economic Survival: STRONG | town r62 e3 top21 need5 · city r99 e3 top34 need7 · metr r97 e3 top28 need7 |
| 15 | 32% | 2 | DS-DEF-4 :: FIXTURE: thieves' guild | metr r49 e2 top32 need4 |
| 16 | 31% | 3 | DS-DEF-2 :: Invasion & War: neither walls nor force | thor r67 e3 top25 need5 · haml r70 e3 top31 need5 · vill r75 e3 top28 need6 |
| 17 | 31% | 3 | DS-DEF-5 :: walls ABSENT | thor r73 e3 top26 need5 · haml r75 e3 top27 need6 · vill r82 e3 top31 need6 · town r37 e3 top14 need3 |
| 18 | 31% | 3 | DS-GEN-13 :: WAREHOUSES | town r44 e4 top14 need3 · city r99 e4 top31 need7 · metr r97 e4 top28 need7 |
| 19 | 31% | 3 | DS-DEF-11 :: UNWALLED-SMALL | thor r73 e3 top31 need5 · haml r75 e3 top30 need6 · vill r82 e3 top29 need6 |
| 20 | 31% | 2 | DS-GEN-16 :: LEGACY-UNRESOLVED | thor r39 e2 top22 need3 · haml r59 e2 top30 need4 · vill r59 e2 top31 need4 · town r26 e2 top14 need2 · city r3 e2 top2 need1 · metr r4 e2 top3 need1 |
| 21 | 31% | 3 | DS-ECO-9 :: HOW THE NEED IS MET: much of it brought in | haml r1 e2 top1 need1 · town r25 e3 top12 need2 · city r79 e3 top31 need6 · metr r70 e3 top25 need5 · thor r1 e2 top1 need1 · vill r1 e2 top1 need1 |
| 22 | 30% | 1 | DS-GEN-17 :: GREAT HOUSE: monastery | town r17 e3 top10 need2 · metr r60 e3 top30 need4 |
| 23 | 29% | 3 | DS-POW-4 :: legitimacyHold: public backing hardens the hold | town r27 e3 top14 need2 · city r80 e3 top29 need6 · metr r81 e3 top29 need6 · thor r1 e3 top1 need1 · vill r1 e3 top1 need1 |
| 24 | 29% | 2 | DS-DEF-2 :: CHAIN: food trades failing | town r6 e3 top3 need1 · city r13 e3 top5 need1 · metr r31 e1 top29 need3 · vill r1 e3 top1 need1 |
| 25 | 29% | 3 | DS-DEF-5 :: NO organized force at all | thor r78 e3 top29 need6 · haml r67 e3 top24 need5 · vill r69 e3 top23 need5 |
| 26 | 29% | 3 | DS-POW-1 :: breakdown dominated by PROSPERITY, favourable | thor r21 e3 top9 need2 · haml r9 e3 top4 need1 · vill r9 e3 top5 need1 · town r53 e3 top22 need4 · city r79 e3 top28 need6 · metr r77 e3 top29 need6 |
| 27 | 29% | 3 | DS-POW-4 :: riskLabel: Stable (no challengers) | thor r89 e3 top29 need6 · haml r74 e3 top29 need5 |
| 28 | 29% | 2 | DS-POW-4 :: legitimacyHold: public rejection is breaking the hold | thor r54 e3 top21 need4 · haml r67 e3 top23 need5 · vill r75 e3 top29 need5 · town r24 e3 top10 need2 · city r3 e3 top3 need1 · metr r3 e3 top2 need1 |
| 29 | 29% | 3 | DS-DEF-5 :: mercenary / contracted forces PRESENT | city r60 e3 top21 need4 · metr r81 e3 top29 need6 |
| 30 | 28% | 3 | DS-DEF-5 :: FIXTURE: gates | town r63 e4 top20 need5 · city r100 e4 top26 need7 · metr r100 e4 top28 need7 |
| 31 | 27% | 3 | DS-GEN-18 :: BOUGHT-IN | thor r55 e3 top21 need4 · haml r78 e3 top27 need6 · vill r59 e3 top20 need4 · town r41 e6 top9 need3 · city r30 e6 top8 need2 · metr r16 e6 top5 need2 |
| 32 | 27% | 1 | DS-GEN-17 :: GREAT HOUSE: cathedral | city r11 e4 top6 need1 · metr r71 e4 top27 need5 |
| 33 | 25% | 2 | DS-DEF-11 :: WALLED-THREATENED | thor r7 e3 top3 need1 · town r39 e3 top15 need3 · city r67 e3 top25 need5 · metr r68 e3 top24 need5 |
| 34 | 25% | 3 | DS-GEN-13 :: COMMERCE: a bank | town r7 e4 top3 need1 · city r72 e4 top21 need5 · metr r97 e4 top25 need7 |
| 35 | 25% | 2 | DS-DEF-5 :: charter hall ABSENT where the country warrants one | thor r67 e3 top25 need5 · haml r57 e3 top21 need4 · vill r53 e3 top20 need4 · town r44 e3 top18 need3 · city r11 e3 top5 need1 |
| 36 | 25% | 1 | DS-DEF-5 :: ARCANE: mages' guild | city r41 e2 top25 need3 |
| 37 | 24% | 1 | DS-GEN-16 :: LEGACY-SHIFTED | thor r35 e2 top22 need3 · haml r15 e2 top12 need2 · vill r27 e2 top15 need2 · town r25 e2 top15 need2 · city r43 e2 top24 need3 · metr r41 e2 top21 need3 |
| 38 | 23% | 1 | DS-DEF-9 :: magicDependency true | haml r1 e4 top1 need1 · vill r17 e4 top5 need2 · town r15 e4 top4 need1 · city r69 e4 top23 need5 · metr r65 e4 top18 need5 |
| 39 | 23% | 2 | DS-DEF-2 :: Internal Security: court without detention | town r61 e3 top23 need5 · city r37 e3 top14 need3 · metr r1 e3 top1 need1 |
| 40 | 23% | 2 | DS-ECO-9 :: FOOD SOURCES: one source | thor r50 e2 top20 need4 · haml r49 e2 top23 need4 · vill r11 e3 top3 need1 · town r43 e3 top17 need3 · city r47 e3 top15 need4 · metr r42 e3 top13 need3 |
| 41 | 23% | 1 | DS-POW-2 :: stable matched | thor r51 e3 top23 need4 · haml r47 e3 top16 need4 · vill r58 e3 top22 need4 · town r60 e3 top22 need4 · city r56 e3 top19 need4 · metr r56 e3 top22 need4 |
| 42 | 23% | 0 | DS-POW-2 :: recentConflict present | thor r100 e7 top19 need7 · haml r100 e7 top21 need7 · vill r99 e7 top19 need7 · town r100 e7 top20 need7 · city r100 e7 top17 need7 · metr r100 e7 top23 need7 |
| 43 | 22% | 1 | DS-ECO-11 :: STRATEGIC VALUE: the generator's assessment, framed | thor r100 e6 top21 need7 · haml r100 e6 top22 need7 · vill r100 e6 top21 need7 · town r100 e6 top18 need7 · city r100 e6 top21 need7 · metr r100 e6 top21 need7 |
| 44 | 22% | 1 | DS-GEN-14 :: FOUNDED-OLD | thor r87 e6 top20 need6 · haml r72 e6 top16 need5 · vill r89 e6 top22 need6 · town r97 e6 top19 need7 · city r100 e6 top21 need7 · metr r100 e6 top22 need7 |
| 45 | 21% | 0 | DS-ECO-12 :: INCOME MIX: one source carries the town | thor r100 e8 top21 need7 · haml r100 e7 top19 need7 · vill r92 e7 top19 need7 |

Pools over the bar at some size: 99 of 242; new lines to bring all of them to need: 132; head 45: 116
