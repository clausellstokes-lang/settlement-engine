# RANK-REACH, BUILD-1 BEFORE (the base 87f03395b), 150 places a size

    ROOT=/tmp/claude-0/-home-user-settlement-engine/b1af5833-4192-5b36-ad96-eca36864f26d/scratchpad/base
    HEAD=87f03395b722020ca27b46499c3e29b3022ad94d
    STATUS(porcelain, tracked)=0
    PLAN: draws hxd n=150 workers=4 sizes=thorp hamlet village town city metropolis
    START 2026-11-20T18:53:12Z
    END 2026-11-20T18:54:44Z
    workers: 4 logs;  4 Tests 225 passed (225); exits:  4 exit 0;
    records: 65308
    measure: a SCRATCH copy of map/run-map.sh with ROOT set to the tree above (its vitest config, its vi.mock path and its imports re-pointed to that tree; the committed tool is untouched), draws mode, prefix hxd, n=150, six sizes, 4 workers
    ranking: a SCRATCH copy of map/rank-reach.mjs whose PER is read from the environment (PER=150; the committed tool hard-codes 50), head 45

| # | worst top (of all places of a size) | new lines | pool | by size (reach %, median eligible, top %, need) |
|---|---|---|---|---|
| 1 | 100% | 6 | DS-FTH-2 :: PRIVATE DOSSIER | thor r100 e1 top100 need7 · haml r100 e1 top100 need7 · vill r100 e3 top35 need7 · town r100 e3 top35 need7 · city r100 e3 top40 need7 · metr r100 e3 top40 need7 |
| 2 | 97% | 6 | DS-GEN-13 :: NO-MARKET | thor r97 e1 top97 need7 · haml r94 e1 top93 need7 · vill r68 e1 top67 need5 |
| 3 | 75% | 5 | DS-ECO-12 :: TRADE PROFILE: exports and imports both present | thor r51 e1 top51 need4 · haml r77 e1 top75 need6 · vill r87 e1 top68 need6 · town r95 e2 top53 need7 · city r100 e2 top53 need7 · metr r100 e2 top53 need7 |
| 4 | 69% | 4 | DS-GEN-11 :: criticalIssueCount: critical contradictions on the record | thor r49 e1 top49 need4 · haml r69 e1 top69 need5 · vill r27 e1 top27 need2 · town r55 e1 top55 need4 · city r4 e1 top4 need1 · metr r6 e1 top6 need1 |
| 5 | 68% | 5 | DS-ECO-6 :: TIER: minor shadow activity (≥3) | thor r15 e1 top15 need1 · haml r15 e1 top13 need2 · vill r16 e1 top15 need2 · town r49 e1 top31 need4 · city r83 e1 top68 need6 · metr r91 e2 top68 need7 |
| 6 | 57% | 5 | DS-POW-2 :: recentConflict present | thor r100 e2 top54 need7 · haml r100 e2 top55 need7 · vill r99 e2 top51 need7 · town r100 e2 top54 need7 · city r100 e2 top55 need7 · metr r100 e2 top57 need7 |
| 7 | 53% | 5 | DS-DEF-5 :: FIXTURE: charter hall | haml r8 e2 top6 need1 · vill r11 e2 top7 need1 · town r25 e2 top13 need2 · city r83 e2 top43 need6 · metr r100 e2 top53 need7 |
| 8 | 50% | 5 | DS-DEF-5 :: ARCANE: alchemists | city r6 e2 top4 need1 · metr r99 e2 top50 need7 · town r1 e2 top1 need1 |
| 9 | 47% | 4 | DS-DEF-4 :: FIXTURE: black market | city r84 e2 top47 need6 · metr r51 e2 top31 need4 |
| 10 | 45% | 5 | DS-ECO-12 :: CRITICAL IMPORT: a house needs what the land lacks | vill r19 e2 top9 need2 · town r58 e2 top35 need4 · city r85 e2 top43 need6 · metr r97 e2 top45 need7 · haml r1 e2 top1 need1 |
| 11 | 45% | 4 | DS-ECO-12 :: INCOME WEIGHT: the practice of magic | city r20 e2 top12 need2 · metr r89 e2 top45 need6 |
| 12 | 44% | 5 | DS-ECO-12 :: INCOME MIX: one source carries the town | thor r100 e3 top40 need7 · haml r100 e2 top44 need7 · vill r92 e2 top43 need7 |
| 13 | 44% | 4 | DS-DEF-5 :: arcane defense ABSENT | thor r100 e3 top36 need7 · haml r99 e3 top44 need7 · vill r96 e3 top37 need7 · town r94 e3 top37 need7 · city r17 e3 top7 need2 |
| 14 | 44% | 4 | DS-DEF-5 :: walls PRESENT | thor r27 e3 top10 need2 · haml r25 e3 top12 need2 · vill r18 e3 top7 need2 · town r63 e3 top23 need5 · city r100 e3 top44 need7 · metr r100 e3 top41 need7 |
| 15 | 43% | 4 | DS-SUP-2 :: UPSTREAM WEAK: a chain the town's work draws on is failing | town r7 e2 top3 need1 · city r39 e2 top23 need3 · metr r85 e2 top43 need6 · vill r1 e2 top1 need1 |
| 16 | 41% | 4 | DS-DEF-3 :: First-Survey qualification (the reading is a first look) | thor r100 e3 top35 need7 · haml r100 e3 top37 need7 · vill r100 e3 top36 need7 · town r100 e3 top41 need7 · city r100 e3 top36 need7 · metr r100 e3 top37 need7 |
| 17 | 41% | 4 | DS-DEF-2 :: Internal Security: no legal infrastructure | thor r100 e3 top35 need7 · haml r100 e3 top37 need7 · vill r100 e3 top41 need7 · town r16 e3 top7 need2 |
| 18 | 41% | 4 | DS-DEF-1 :: readiness WEAK | thor r88 e2 top41 need6 · haml r77 e2 top39 need6 · vill r60 e2 top29 need4 · town r53 e2 top27 need4 |
| 19 | 41% | 4 | DS-DEF-5 :: charter hall PRESENT (specialist monster response) | haml r8 e3 top3 need1 · vill r11 e3 top5 need1 · town r25 e3 top11 need2 · city r83 e3 top33 need6 · metr r100 e3 top41 need7 |
| 20 | 41% | 4 | DS-GEN-18 :: STALLED | haml r4 e2 top3 need1 · vill r39 e2 top21 need3 · town r59 e2 top32 need4 · city r70 e2 top37 need5 · metr r84 e2 top41 need6 |
| 21 | 41% | 4 | DS-POW-5 :: governing body name: a SLOT, never a baked noun | thor r100 e3 top34 need7 · haml r100 e3 top41 need7 · vill r99 e3 top37 need7 · town r100 e3 top38 need7 · city r100 e3 top37 need7 · metr r100 e3 top38 need7 |
| 22 | 39% | 4 | DS-POW-6 :: operation role duty evasion | town r12 e3 top6 need1 · city r54 e3 top20 need4 · metr r91 e3 top39 need7 |
| 23 | 39% | 4 | DS-ECO-11 :: RESOURCE CONDITION: worked out, recovers in time | thor r7 e2 top5 need1 · haml r12 e2 top7 need1 · vill r36 e2 top19 need3 · town r51 e2 top27 need4 · city r65 e2 top37 need5 · metr r77 e2 top39 need6 |
| 24 | 37% | 4 | DS-DEF-5 :: garrison PRESENT | town r19 e2 top8 need2 · city r100 e3 top35 need7 · metr r100 e3 top37 need7 |
| 25 | 37% | 3 | DS-ECO-2 :: FOOD: surplus | thor r63 e2 top37 need5 · haml r60 e2 top28 need4 · vill r58 e2 top29 need4 · town r15 e2 top9 need1 |
| 26 | 37% | 4 | DS-POW-5 :: council | thor r99 e3 top37 need7 · haml r99 e4 top30 need7 · vill r84 e4 top26 need6 · town r28 e4 top11 need2 · city r62 e4 top27 need5 · metr r59 e4 top30 need4 |
| 27 | 37% | 4 | DS-DEF-2 :: Invasion & War: walls AND professional garrison | town r8 e3 top6 need1 · city r99 e3 top35 need7 · metr r100 e3 top37 need7 |
| 28 | 36% | 2 | DS-ECO-1 :: COMBINATION C3: the middle rungs | thor r53 e2 top31 need4 · haml r37 e2 top19 need3 · vill r33 e3 top18 need3 · town r65 e3 top36 need5 · city r21 e1 top21 need2 · metr r20 e1 top20 need2 |
| 29 | 36% | 3 | DS-ECO-12 :: CRITICAL IMPORT: the land cannot give it | thor r74 e2 top36 need5 · haml r64 e2 top31 need5 · vill r62 e2 top33 need5 · town r37 e2 top20 need3 · city r13 e2 top8 need1 · metr r1 e2 top1 need1 |
| 30 | 36% | 3 | DS-ECO-2 :: FOOD: balanced | thor r11 e2 top6 need1 · haml r5 e2 top3 need1 · vill r15 e2 top7 need2 · town r55 e2 top27 need4 · city r70 e2 top36 need5 · metr r62 e2 top34 need5 |
| 31 | 36% | 4 | DS-ECO-12 :: INCOME MIX: two or three sources between them | vill r8 e3 top5 need1 · town r87 e3 top31 need6 · city r100 e3 top36 need7 · metr r93 e3 top33 need7 |
| 32 | 36% | 3 | DS-DEF-5 :: watch PRESENT | town r81 e3 top36 need6 · vill r3 e2 top3 need1 |
| 33 | 35% | 4 | DS-DEF-4 :: structure null (nothing organized recognized) | thor r90 e3 top33 need6 · haml r85 e3 top31 need6 · vill r92 e3 top35 need7 · town r31 e3 top14 need3 · city r1 e3 top1 need1 |
| 34 | 35% | 4 | DS-DEF-9 :: magicDependency false | thor r100 e3 top35 need7 · haml r99 e3 top35 need7 · vill r82 e3 top31 need6 · town r84 e3 top31 need6 · city r13 e3 top5 need1 · metr r1 e3 top1 need1 |
| 35 | 35% | 3 | DS-ECO-1 :: COMBINATION C1: a high rung on a working approach | thor r3 e3 top1 need1 · town r25 e3 top11 need2 · city r78 e3 top27 need6 · metr r77 e3 top35 need6 · vill r1 e3 top1 need1 |
| 36 | 35% | 4 | DS-DEF-5 :: arcane defense PRESENT | haml r1 e2 top1 need1 · vill r4 e2 top3 need1 · town r6 e3 top3 need1 · city r83 e3 top31 need6 · metr r100 e3 top35 need7 |
| 37 | 35% | 4 | DS-DEF-2 :: Internal Security: full legal chain (court AND prison) | town r19 e3 top7 need2 · city r63 e3 top21 need5 · metr r99 e3 top35 need7 |
| 38 | 34% | 2 | DS-ECO-2 :: FOOD: deficit | thor r26 e1 top25 need2 · haml r35 e1 top34 need3 · vill r27 e1 top25 need2 · town r30 e1 top24 need2 · city r30 e1 top26 need2 · metr r38 e1 top34 need3 |
| 39 | 34% | 4 | DS-DEF-2 :: Economic Survival: STRONG | town r62 e3 top21 need5 · city r99 e3 top34 need7 · metr r97 e3 top28 need7 |
| 40 | 33% | 3 | DS-ECO-11 :: ECONOMIC STRENGTHS: the roster is populated | thor r84 e3 top33 need6 · haml r79 e3 top31 need6 · vill r79 e3 top33 need6 · town r73 e3 top29 need5 · city r80 e3 top29 need6 · metr r70 e3 top25 need5 |
| 41 | 33% | 3 | DS-ECO-8 :: PROSPEROUS | thor r3 e3 top1 need1 · town r25 e3 top9 need2 · city r78 e3 top33 need6 · metr r77 e3 top30 need6 · vill r1 e3 top1 need1 |
| 42 | 33% | 3 | DS-POW-4 :: riskLabel: Holding | haml r9 e3 top4 need1 · vill r23 e3 top9 need2 · town r69 e3 top25 need5 · city r87 e3 top33 need6 · metr r82 e3 top30 need6 |
| 43 | 32% | 2 | DS-DEF-4 :: FIXTURE: thieves' guild | metr r49 e2 top32 need4 |
| 44 | 31% | 3 | DS-ECO-9 :: SECURE | thor r73 e3 top28 need5 · haml r64 e3 top25 need5 · vill r75 e3 top31 need5 · town r73 e3 top27 need5 · city r76 e3 top30 need6 · metr r71 e4 top21 need5 |
| 45 | 31% | 3 | DS-DEF-2 :: Invasion & War: neither walls nor force | thor r67 e3 top25 need5 · haml r70 e3 top31 need5 · vill r75 e3 top28 need6 |

Pools over the bar at some size: 102 of 242; new lines to bring all of them to need: 252; head 45: 175
