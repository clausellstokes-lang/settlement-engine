# OVER-BAR-RANKED-BUILD1 — the pools still over the bar after BUILD-1, ranked by weight

The chair's ruling 1 (17:00 UTC): a sentence's share over ALL places of a size, about 15%; on 150 places a size a top up to 20% passes as sampling. Top = places printing the pool's commonest sentence / 150. WEIGHT = those places summed over the six sizes. Measured by a scratch copy of `map/run-map.sh` (ROOT set to each tree), draws mode, prefix hxd, n = 150, six sizes; `stored` records only (the sentence printed), as `map/rank-reach.mjs` reads them.

BEFORE (the base):
    ROOT=/tmp/claude-0/-home-user-settlement-engine/b1af5833-4192-5b36-ad96-eca36864f26d/scratchpad/base
    HEAD=87f03395b722020ca27b46499c3e29b3022ad94d
    PLAN: draws hxd n=150 workers=4 sizes=thorp hamlet village town city metropolis
    START 2026-11-20T18:53:12Z
    END 2026-11-20T18:54:44Z
    records: 65308

AFTER (the tip):
    ROOT=/home/user/settlement-engine/.claude/worktrees/agent-a68d06c1dd4451433
    HEAD=04fa578d997a09bbfe861f61bb56066a944d2965
    PLAN: draws hxd n=150 workers=4 sizes=thorp hamlet village town city metropolis
    START 2026-11-20T19:36:12Z
    END 2026-11-20T19:37:43Z
    records: 65308

**Pools drawn: base 242, tip 242. Over 15%: base 102 -> tip 99. Over 20% (outside the ruled sampling margin): base 80 -> tip 55.**

Cell key: `size top-places (e median eligible / n need)`, need = ceil(reach / 0.15).
## A. Over 20% at the tip (outside the sampling margin), ranked by weight

| # | weight | worst top | base worst | mark | pool | by size at the tip |
|---|---|---|---|---|---|---|
| 1 | 314 | 68% | 68% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-6 :: TIER: minor shadow activity (≥3) | thor 22 (e1/n1) · haml 19 (e1/n2) · vill 23 (e1/n2) · town 46 (e1/n4) · city 102 (e1/n6) · metr 102 (e2/n7) |
| 2 | 241 | 37% | 37% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 1) | DS-POW-5 :: council | thor 55 (e3/n7) · haml 45 (e4/n7) · vill 39 (e4/n6) · town 17 (e4/n2) · city 40 (e4/n5) · metr 45 (e4/n4) |
| 3 | 217 | 36% | 36% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 9) | DS-ECO-1 :: COMBINATION C3: the middle rungs | thor 46 (e2/n4) · haml 29 (e2/n3) · vill 27 (e3/n3) · town 54 (e3/n5) · city 31 (e1/n2) · metr 30 (e1/n2) |
| 4 | 186 | 23% | 23% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 9) | DS-POW-2 :: stable matched | thor 34 (e3/n4) · haml 24 (e3/n4) · vill 33 (e3/n4) · town 33 (e3/n4) · city 29 (e3/n4) · metr 33 (e3/n4) |
| 5 | 185 | 22% | 22% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 6) | DS-ECO-11 :: STRATEGIC VALUE: the generator's assessment, framed | thor 31 (e6/n7) · haml 33 (e6/n7) · vill 31 (e6/n7) · town 27 (e6/n7) · city 31 (e6/n7) · metr 32 (e6/n7) |
| 6 | 180 | 22% | 22% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 14) | DS-GEN-14 :: FOUNDED-OLD | thor 30 (e6/n6) · haml 24 (e6/n5) · vill 33 (e6/n6) · town 29 (e6/n7) · city 31 (e6/n7) · metr 33 (e6/n7) |
| 7 | 178 | 23% | 57% | BUILD-1 TOUCHED, NOT UNDER | DS-POW-2 :: recentConflict present | thor 29 (e7/n7) · haml 31 (e7/n7) · vill 29 (e7/n7) · town 30 (e7/n7) · city 25 (e7/n7) · metr 34 (e7/n7) |
| 8 | 171 | 35% | 35% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-4 :: structure null (nothing organized recognized) | thor 49 (e3/n6) · haml 47 (e3/n6) · vill 53 (e3/n7) · town 21 (e3/n3) · city 1 (e3/n1) |
| 9 | 171 | 21% | 41% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-3 :: First-Survey qualification (the reading is a first look) | thor 27 (e7/n7) · haml 32 (e7/n7) · vill 27 (e7/n7) · town 29 (e7/n7) · city 29 (e7/n7) · metr 27 (e7/n7) |
| 10 | 170 | 36% | 36% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 16) | DS-ECO-2 :: FOOD: balanced | thor 9 (e2/n1) · haml 5 (e2/n1) · vill 11 (e2/n2) · town 40 (e2/n4) · city 54 (e2/n5) · metr 51 (e2/n5) |
| 11 | 163 | 24% | 24% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 3) | DS-GEN-16 :: LEGACY-SHIFTED | thor 33 (e2/n3) · haml 18 (e2/n2) · vill 22 (e2/n2) · town 22 (e2/n2) · city 36 (e2/n3) · metr 32 (e2/n3) |
| 12 | 158 | 36% | 36% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 4) | DS-ECO-12 :: INCOME MIX: two or three sources between them | vill 7 (e3/n1) · town 47 (e3/n6) · city 54 (e3/n7) · metr 50 (e3/n7) |
| 13 | 152 | 31% | 31% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 12) | DS-GEN-16 :: LEGACY-UNRESOLVED | thor 33 (e2/n3) · haml 45 (e2/n4) · vill 46 (e2/n4) · town 21 (e2/n2) · city 3 (e2/n1) · metr 4 (e2/n1) |
| 14 | 151 | 21% | 33% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-11 :: ECONOMIC STRENGTHS: the roster is populated | thor 31 (e6/n6) · haml 27 (e6/n6) · vill 30 (e6/n6) · town 20 (e6/n5) · city 24 (e6/n6) · metr 19 (e6/n5) |
| 15 | 147 | 31% | 31% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 10) | DS-DEF-5 :: walls ABSENT | thor 39 (e3/n5) · haml 40 (e3/n6) · vill 47 (e3/n6) · town 21 (e3/n3) |
| 16 | 145 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 15) | DS-POW-1 :: breakdown dominated by PROSPERITY, favourable | thor 14 (e3/n2) · haml 6 (e3/n1) · vill 7 (e3/n1) · town 33 (e3/n4) · city 42 (e3/n6) · metr 43 (e3/n6) |
| 17 | 141 | 41% | 41% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 17) | DS-DEF-5 :: charter hall PRESENT (specialist monster response) | haml 5 (e3/n1) · vill 7 (e3/n1) · town 17 (e3/n2) · city 50 (e3/n6) · metr 62 (e3/n7) |
| 18 | 135 | 31% | 31% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 23) | DS-DEF-11 :: UNWALLED-SMALL | thor 46 (e3/n5) · haml 45 (e3/n6) · vill 44 (e3/n6) |
| 19 | 135 | 23% | 23% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 7) | DS-ECO-9 :: FOOD SOURCES: one source | thor 30 (e2/n4) · haml 34 (e2/n4) · vill 4 (e3/n1) · town 25 (e3/n3) · city 22 (e3/n4) · metr 20 (e3/n3) |
| 20 | 133 | 27% | 27% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 2) | DS-GEN-18 :: BOUGHT-IN | thor 31 (e3/n4) · haml 40 (e3/n6) · vill 30 (e3/n4) · town 13 (e6/n3) · city 12 (e6/n2) · metr 7 (e6/n2) |
| 21 | 132 | 25% | 25% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 16) | DS-DEF-5 :: charter hall ABSENT where the country warrants one | thor 37 (e3/n5) · haml 31 (e3/n4) · vill 30 (e3/n4) · town 27 (e3/n3) · city 7 (e3/n1) |
| 22 | 130 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 24) | DS-POW-4 :: legitimacyHold: public rejection is breaking the hold | thor 31 (e3/n4) · haml 34 (e3/n5) · vill 43 (e3/n5) · town 15 (e3/n2) · city 4 (e3/n1) · metr 3 (e3/n1) |
| 23 | 126 | 31% | 31% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 22) | DS-DEF-2 :: Invasion & War: neither walls nor force | thor 37 (e3/n5) · haml 47 (e3/n5) · vill 42 (e3/n6) |
| 24 | 124 | 34% | 34% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 21) | DS-DEF-2 :: Economic Survival: STRONG | town 31 (e3/n5) · city 51 (e3/n7) · metr 42 (e3/n7) |
| 25 | 117 | 47% | 47% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-4 :: FIXTURE: black market | city 71 (e2/n6) · metr 46 (e2/n4) |
| 26 | 117 | 37% | 37% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 2) | DS-DEF-2 :: Invasion & War: walls AND professional garrison | town 9 (e3/n1) · city 53 (e3/n7) · metr 55 (e3/n7) |
| 27 | 113 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 8) | DS-DEF-5 :: NO organized force at all | thor 43 (e3/n6) · haml 36 (e3/n5) · vill 34 (e3/n5) |
| 28 | 111 | 28% | 28% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 25) | DS-DEF-5 :: FIXTURE: gates | town 30 (e4/n5) · city 39 (e4/n7) · metr 42 (e4/n7) |
| 29 | 110 | 31% | 31% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 13) | DS-GEN-13 :: WAREHOUSES | town 21 (e4/n3) · city 47 (e4/n7) · metr 42 (e4/n7) |
| 30 | 110 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 20) | DS-POW-4 :: legitimacyHold: public backing hardens the hold | thor 1 (e3/n1) · vill 1 (e3/n1) · town 21 (e3/n2) · city 43 (e3/n6) · metr 44 (e3/n6) |
| 31 | 109 | 35% | 35% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 7) | DS-DEF-5 :: arcane defense PRESENT | haml 1 (e2/n1) · vill 4 (e2/n1) · town 5 (e3/n1) · city 47 (e3/n6) · metr 52 (e3/n7) |
| 32 | 106 | 31% | 31% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 4) | DS-ECO-9 :: HOW THE NEED IS MET: much of it brought in | thor 2 (e2/n1) · haml 2 (e2/n1) · vill 1 (e2/n1) · town 18 (e3/n2) · city 46 (e3/n6) · metr 37 (e3/n5) |
| 33 | 101 | 25% | 25% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 11) | DS-DEF-11 :: WALLED-THREATENED | thor 4 (e3/n1) · town 23 (e3/n3) · city 38 (e3/n5) · metr 36 (e3/n5) |
| 34 | 98 | 39% | 39% | BUILD-1 TOUCHED, NOT UNDER | DS-POW-6 :: operation role duty evasion | town 9 (e3/n1) · city 30 (e3/n4) · metr 59 (e3/n7) |
| 35 | 95 | 35% | 35% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 3) | DS-DEF-2 :: Internal Security: full legal chain (court AND prison) | town 11 (e3/n2) · city 32 (e3/n5) · metr 52 (e3/n7) |
| 36 | 92 | 21% | 21% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 19) | DS-DEF-2 :: Economic Survival: WEAK | thor 30 (e3/n5) · haml 31 (e3/n5) · vill 29 (e3/n5) · town 2 (e2/n1) |
| 37 | 89 | 21% | 44% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-12 :: INCOME MIX: one source carries the town | thor 32 (e8/n7) · haml 29 (e7/n7) · vill 28 (e7/n7) |
| 38 | 86 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 11) | DS-POW-4 :: riskLabel: Stable (no challengers) | thor 43 (e3/n6) · haml 43 (e3/n5) |
| 39 | 86 | 21% | 41% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-1 :: readiness WEAK | thor 31 (e7/n6) · haml 23 (e7/n6) · vill 17 (e7/n4) · town 15 (e7/n4) |
| 40 | 79 | 21% | 45% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-12 :: CRITICAL IMPORT: a house needs what the land lacks | haml 1 (e7/n1) · vill 5 (e7/n2) · town 17 (e7/n4) · city 25 (e7/n6) · metr 31 (e7/n7) |
| 41 | 76 | 23% | 23% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 10) | DS-DEF-9 :: magicDependency true | haml 1 (e4/n1) · vill 7 (e4/n2) · town 6 (e4/n1) · city 35 (e4/n5) · metr 27 (e4/n5) |
| 42 | 75 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 5) | DS-DEF-5 :: mercenary / contracted forces PRESENT | city 32 (e3/n4) · metr 43 (e3/n6) |
| 43 | 74 | 25% | 25% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 14) | DS-GEN-13 :: COMMERCE: a bank | town 5 (e4/n1) · city 31 (e4/n5) · metr 38 (e4/n7) |
| 44 | 68 | 21% | 21% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 17) | DS-POW-4 :: riskLabel: Contested | thor 5 (e4/n1) · haml 9 (e4/n1) · vill 32 (e4/n5) · town 13 (e4/n2) · city 3 (e4/n1) · metr 6 (e4/n1) |
| 45 | 63 | 21% | 21% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 18) | DS-DEF-2 :: CHAIN: defence short | town 8 (e4/n1) · city 23 (e4/n3) · metr 32 (e4/n5) |
| 46 | 60 | 30% | 30% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 6) | DS-GEN-17 :: GREAT HOUSE: monastery | town 15 (e3/n2) · metr 45 (e3/n4) |
| 47 | 58 | 36% | 36% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 5) | DS-DEF-5 :: watch PRESENT | vill 4 (e2/n1) · town 54 (e3/n6) |
| 48 | 58 | 29% | 29% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 27) | DS-DEF-2 :: CHAIN: food trades failing | vill 2 (e3/n1) · town 4 (e3/n1) · city 8 (e3/n1) · metr 44 (e1/n3) |
| 49 | 57 | 23% | 23% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 18) | DS-DEF-2 :: Internal Security: court without detention | town 35 (e3/n5) · city 21 (e3/n3) · metr 1 (e3/n1) |
| 50 | 50 | 21% | 21% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 20) | DS-DEF-1 :: readiness STRONG | town 2 (e3/n1) · city 31 (e4/n5) · metr 17 (e4/n3) |
| 51 | 49 | 27% | 27% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 26) | DS-GEN-17 :: GREAT HOUSE: cathedral | city 9 (e4/n1) · metr 40 (e4/n5) |
| 52 | 48 | 32% | 32% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 8) | DS-DEF-4 :: FIXTURE: thieves' guild | metr 48 (e2/n4) |
| 53 | 45 | 21% | 21% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 26) | DS-POW-1 :: Endorsed | city 14 (e4/n2) · metr 31 (e4/n5) |
| 54 | 37 | 25% | 25% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 21) | DS-DEF-5 :: ARCANE: mages' guild | city 37 (e2/n3) |
| 55 | 32 | 21% | 21% | COVERED BY LINES 3/4 (PROSE-LINES-3.md pool 19) | DS-DEF-11 :: UNWALLED-LARGE | town 32 (e2/n3) |

Marks: BUILD-1 TOUCHED, NOT UNDER 10 · COVERED BY LINES 3/4 45

## B. Over 15% and at most 20% at the tip (inside the ruled sampling margin), ranked by weight

| # | weight | worst top | base worst | mark | pool | by size at the tip |
|---|---|---|---|---|---|---|
| 1 | 168 | 20% | 41% | BUILD-1 TOUCHED, NOT UNDER | DS-POW-5 :: governing body name: a SLOT, never a baked noun | thor 26 (e7/n7) · haml 30 (e7/n7) · vill 29 (e7/n7) · town 27 (e7/n7) · city 29 (e7/n7) · metr 27 (e7/n7) |
| 2 | 162 | 19% | 30% | BUILD-1 TOUCHED, NOT UNDER | DS-STR-1 :: Overview's own section framing | thor 27 (e5/n5) · haml 26 (e5/n5) · vill 28 (e5/n5) · town 28 (e5/n5) · city 29 (e5/n5) · metr 24 (e5/n5) |
| 3 | 160 | 20% | 20% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 15) | DS-DEF-3 :: Moderate | thor 29 (e4/n5) · haml 30 (e4/n5) · vill 26 (e5/n5) · town 26 (e5/n5) · city 24 (e5/n4) · metr 25 (e5/n5) |
| 4 | 148 | 20% | 31% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-9 :: SECURE | thor 22 (e6/n5) · haml 24 (e6/n5) · vill 26 (e6/n5) · town 30 (e6/n5) · city 27 (e6/n6) · metr 19 (e7/n5) |
| 5 | 146 | 19% | 75% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-12 :: TRADE PROFILE: exports and imports both present | thor 18 (e6/n4) · haml 24 (e6/n6) · vill 23 (e6/n6) · town 29 (e7/n7) · city 26 (e7/n7) · metr 26 (e7/n7) |
| 6 | 145 | 19% | 100% | BUILD-1 TOUCHED, NOT UNDER | DS-FTH-2 :: PRIVATE DOSSIER | thor 27 (e7/n7) · haml 28 (e7/n7) · vill 23 (e9/n7) · town 24 (e9/n7) · city 21 (e9/n7) · metr 22 (e9/n7) |
| 7 | 138 | 17% | 17% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 22) | DS-DEF-1 :: terrain FAVOURABLE to the defender | thor 26 (e3/n3) · haml 22 (e3/n3) · vill 21 (e3/n3) · town 22 (e3/n3) · city 25 (e3/n3) · metr 22 (e3/n3) |
| 8 | 136 | 17% | 17% | COVERED BY NOTHING YET | DS-ECO-10 :: POSTURE: established | thor 21 (e5/n4) · haml 26 (e5/n4) · vill 23 (e6/n5) · town 22 (e6/n6) · city 22 (e6/n5) · metr 22 (e6/n5) |
| 9 | 121 | 15% | 15% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 23) | DS-ECO-9 :: PRESSURED | thor 16 (e2/n2) · haml 23 (e2/n2) · vill 19 (e2/n2) · town 23 (e2/n2) · city 19 (e2/n2) · metr 21 (e2/n2) |
| 10 | 121 | 15% | 15% | COVERED BY NOTHING YET | DS-DEF-1 :: terrain EXPOSED | thor 18 (e3/n3) · haml 23 (e3/n3) · vill 17 (e3/n2) · town 23 (e3/n3) · city 21 (e3/n2) · metr 19 (e3/n2) |
| 11 | 118 | 20% | 44% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-5 :: arcane defense ABSENT | thor 30 (e7/n7) · haml 29 (e7/n7) · vill 26 (e7/n7) · town 24 (e7/n7) · city 9 (e7/n2) |
| 12 | 114 | 19% | 19% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 1) | DS-POW-4 :: legitimacyHold: public opinion neither helps nor hurts | thor 29 (e3/n3) · haml 22 (e3/n3) · vill 14 (e3/n2) · town 28 (e3/n4) · city 10 (e3/n2) · metr 11 (e3/n2) |
| 13 | 111 | 17% | 44% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-5 :: walls PRESENT | thor 15 (e3/n2) · haml 18 (e3/n2) · vill 10 (e3/n2) · town 16 (e7/n5) · city 26 (e7/n7) · metr 26 (e7/n7) |
| 14 | 109 | 15% | 15% | COVERED BY NOTHING YET | DS-DEF-8 :: override active, viability intact | thor 18 (e2/n2) · haml 23 (e2/n2) · vill 19 (e2/n2) · town 16 (e3/n2) · city 16 (e3/n2) · metr 17 (e3/n2) |
| 15 | 107 | 17% | 35% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-9 :: magicDependency false | thor 26 (e7/n7) · haml 26 (e7/n7) · vill 24 (e7/n6) · town 24 (e7/n6) · city 6 (e7/n1) · metr 1 (e7/n1) |
| 16 | 100 | 16% | 16% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 13) | DS-ECO-11 :: TERRAIN: Forest | thor 19 (e1/n1) · haml 18 (e1/n1) · vill 24 (e1/n2) · town 11 (e2/n1) · city 19 (e2/n2) · metr 9 (e2/n1) |
| 17 | 93 | 20% | 41% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-2 :: Internal Security: no legal infrastructure | thor 30 (e7/n7) · haml 27 (e7/n7) · vill 30 (e7/n7) · town 6 (e7/n2) |
| 18 | 86 | 18% | 33% | BUILD-1 TOUCHED, NOT UNDER | DS-POW-4 :: riskLabel: Holding | haml 3 (e6/n1) · vill 8 (e6/n2) · town 21 (e6/n5) · city 27 (e6/n6) · metr 27 (e6/n6) |
| 19 | 86 | 17% | 36% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-12 :: CRITICAL IMPORT: the land cannot give it | thor 26 (e6/n5) · haml 21 (e6/n5) · vill 19 (e6/n5) · town 12 (e6/n3) · city 7 (e6/n1) · metr 1 (e6/n1) |
| 20 | 86 | 17% | 17% | COVERED BY NOTHING YET | DS-ECO-11 :: RESOURCE CONDITION: worked out, recovers only with work | thor 3 (e2/n1) · haml 6 (e2/n1) · vill 11 (e2/n1) · town 25 (e2/n3) · city 21 (e2/n2) · metr 20 (e2/n2) |
| 21 | 82 | 18% | 69% | BUILD-1 TOUCHED, NOT UNDER | DS-GEN-11 :: criticalIssueCount: critical contradictions on the record | thor 18 (e5/n4) · haml 27 (e5/n5) · vill 13 (e5/n2) · town 19 (e5/n4) · city 2 (e5/n1) · metr 3 (e5/n1) |
| 22 | 82 | 16% | 39% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-11 :: RESOURCE CONDITION: worked out, recovers in time | thor 3 (e6/n1) · haml 5 (e6/n1) · vill 11 (e6/n3) · town 18 (e6/n4) · city 21 (e6/n5) · metr 24 (e6/n6) |
| 23 | 80 | 17% | 37% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-2 :: FOOD: surplus | thor 26 (e5/n5) · haml 26 (e5/n4) · vill 22 (e5/n4) · town 6 (e5/n1) |
| 24 | 79 | 20% | 20% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 24) | DS-DEF-4 :: structure semi-organized | haml 3 (e2/n1) · vill 2 (e3/n1) · town 17 (e3/n2) · city 30 (e3/n4) · metr 27 (e3/n4) |
| 25 | 79 | 15% | 41% | BUILD-1 TOUCHED, NOT UNDER | DS-GEN-18 :: STALLED | haml 2 (e6/n1) · vill 13 (e6/n3) · town 20 (e6/n4) · city 21 (e6/n5) · metr 23 (e6/n6) |
| 26 | 75 | 17% | 17% | COVERED BY NOTHING YET | DS-ECO-8 :: COMFORTABLE | thor 11 (e3/n2) · haml 6 (e3/n1) · vill 8 (e3/n1) · town 25 (e3/n3) · city 12 (e2/n2) · metr 13 (e2/n2) |
| 27 | 72 | 17% | 17% | COVERED BY NOTHING YET | DS-ECO-1 :: COMBINATION C4: a low rung on a working approach | thor 15 (e3/n2) · haml 22 (e3/n3) · vill 26 (e3/n4) · town 6 (e3/n1) · city 1 (e3/n1) · metr 2 (e3/n1) |
| 28 | 68 | 18% | 53% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-5 :: FIXTURE: charter hall | haml 5 (e7/n1) · vill 4 (e7/n1) · town 8 (e7/n2) · city 24 (e7/n6) · metr 27 (e7/n7) |
| 29 | 64 | 15% | 15% | COVERED BY NOTHING YET | DS-DEF-2 :: Beasts & Monsters: settled, nothing organized | thor 19 (e3/n2) · haml 22 (e3/n3) · vill 23 (e3/n3) |
| 30 | 63 | 18% | 33% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-8 :: PROSPEROUS | thor 2 (e6/n1) · vill 1 (e6/n1) · town 9 (e6/n2) · city 27 (e6/n6) · metr 24 (e6/n6) |
| 31 | 63 | 18% | 37% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-5 :: garrison PRESENT | town 9 (e6/n2) · city 27 (e7/n7) · metr 27 (e7/n7) |
| 32 | 63 | 16% | 16% | COVERED BY NOTHING YET | DS-ECO-8 :: POOR | thor 16 (e3/n2) · haml 18 (e3/n3) · vill 24 (e4/n4) · town 4 (e3/n1) · city 1 (e2/n1) |
| 33 | 61 | 17% | 35% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-1 :: COMBINATION C1: a high rung on a working approach | thor 1 (e6/n1) · vill 1 (e6/n1) · town 9 (e6/n2) · city 25 (e6/n6) · metr 25 (e6/n6) |
| 34 | 59 | 20% | 20% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 25) | DS-DEF-2 :: Beasts & Monsters: frontier, credible deterrence | thor 2 (e3/n1) · haml 1 (e3/n1) · town 4 (e3/n1) · city 22 (e3/n3) · metr 30 (e3/n4) |
| 35 | 58 | 16% | 16% | COVERED BY NOTHING YET | DS-POW-1 :: breakdown dominated by PROSPERITY, adverse | thor 12 (e3/n2) · haml 18 (e3/n2) · vill 24 (e3/n3) · town 3 (e3/n1) · city 1 (e3/n1) |
| 36 | 58 | 15% | 15% | COVERED BY NOTHING YET | DS-DEF-2 :: Economic Survival: ADEQUATE | thor 9 (e3/n1) · haml 6 (e3/n1) · vill 16 (e3/n2) · town 23 (e3/n3) · city 1 (e3/n1) · metr 3 (e3/n1) |
| 37 | 49 | 18% | 18% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 12) | DS-DEF-2 :: CHAIN: defence supplied | haml 2 (e4/n1) · vill 2 (e4/n1) · town 3 (e4/n1) · city 27 (e4/n5) · metr 15 (e4/n3) |
| 38 | 46 | 16% | 16% | COVERED BY NOTHING YET | DS-POW-1 :: Approved | thor 1 (e4/n1) · vill 1 (e4/n1) · town 12 (e4/n2) · city 24 (e4/n4) · metr 8 (e4/n2) |
| 39 | 45 | 18% | 43% | BUILD-1 TOUCHED, NOT UNDER | DS-SUP-2 :: UPSTREAM WEAK: a chain the town's work draws on is failing | vill 1 (e6/n1) · town 3 (e6/n1) · city 14 (e6/n3) · metr 27 (e6/n6) |
| 40 | 40 | 18% | 18% | COVERED BY LINES 3/4 (PROSE-LINES-4.md pool 27) | DS-GEN-13 :: COMMERCE: a merchant guild, no bank | town 27 (e4/n4) · city 11 (e4/n2) · metr 2 (e4/n1) |
| 41 | 37 | 19% | 45% | BUILD-1 TOUCHED, NOT UNDER | DS-ECO-12 :: INCOME WEIGHT: the practice of magic | city 8 (e6/n2) · metr 29 (e6/n6) |
| 42 | 34 | 18% | 18% | COVERED BY NOTHING YET | DS-DEF-5 :: ARCANE: wizard's tower | town 6 (e2/n1) · city 27 (e2/n3) · metr 1 (e2/n1) |
| 43 | 28 | 17% | 17% | COVERED BY NOTHING YET | DS-DEF-4 :: FIXTURE: gangs | town 25 (e2/n2) · city 3 (e2/n1) |
| 44 | 28 | 17% | 50% | BUILD-1 TOUCHED, NOT UNDER | DS-DEF-5 :: ARCANE: alchemists | town 1 (e7/n1) · city 2 (e7/n1) · metr 25 (e7/n7) |

Marks: BUILD-1 TOUCHED, NOT UNDER 22 · COVERED BY LINES 3/4 9 · COVERED BY NOTHING YET 13

## C. CURED BY BUILD-1

| pool | base worst | tip worst | cured at |
|---|---|---|---|
| DS-ECO-2 :: FOOD: surplus | 37% | 17% | within the 20% sampling margin |
| DS-ECO-9 :: SECURE | 31% | 20% | within the 20% sampling margin |
| DS-ECO-12 :: CRITICAL IMPORT: the land cannot give it | 36% | 17% | within the 20% sampling margin |
| DS-GEN-13 :: NO-MARKET | 97% | 13% | under 15% |
| DS-GEN-11 :: criticalIssueCount: critical contradictions on the record | 69% | 18% | within the 20% sampling margin |
| DS-STR-1 :: Overview's own section framing | 30% | 19% | within the 20% sampling margin |
| DS-DEF-2 :: Internal Security: no legal infrastructure | 41% | 20% | within the 20% sampling margin |
| DS-DEF-5 :: arcane defense ABSENT | 44% | 20% | within the 20% sampling margin |
| DS-POW-5 :: governing body name: a SLOT, never a baked noun | 41% | 20% | within the 20% sampling margin |
| DS-FTH-2 :: PRIVATE DOSSIER | 100% | 19% | within the 20% sampling margin |
| DS-DEF-9 :: magicDependency false | 35% | 17% | within the 20% sampling margin |
| DS-ECO-12 :: TRADE PROFILE: exports and imports both present | 75% | 19% | within the 20% sampling margin |
| DS-ECO-11 :: RESOURCE CONDITION: worked out, recovers in time | 39% | 16% | within the 20% sampling margin |
| DS-ECO-2 :: FOOD: deficit | 34% | 15% | under 15% |
| DS-ECO-11 :: TERRAIN: Plains | 21% | 15% | under 15% |
| DS-DEF-5 :: walls PRESENT | 44% | 17% | within the 20% sampling margin |
| DS-ECO-1 :: COMBINATION C1: a high rung on a working approach | 35% | 17% | within the 20% sampling margin |
| DS-ECO-8 :: PROSPEROUS | 33% | 18% | within the 20% sampling margin |
| DS-DEF-5 :: FIXTURE: charter hall | 53% | 18% | within the 20% sampling margin |
| DS-POW-4 :: riskLabel: Holding | 33% | 18% | within the 20% sampling margin |
| DS-GEN-18 :: STALLED | 41% | 15% | within the 20% sampling margin |
| DS-SUP-2 :: UPSTREAM WEAK: a chain the town's work draws on is failing | 43% | 18% | within the 20% sampling margin |
| DS-DEF-5 :: garrison PRESENT | 37% | 18% | within the 20% sampling margin |
| DS-ECO-12 :: INCOME WEIGHT: the practice of magic | 45% | 19% | within the 20% sampling margin |
| DS-DEF-5 :: ARCANE: alchemists | 50% | 17% | within the 20% sampling margin |

## D. The pools BUILD-1 touched that did NOT come under 20%, and why

| pool | base worst | tip worst (size) | new lines | why |
|---|---|---|---|---|
| DS-DEF-1 :: readiness WEAK | 41% | 21% (thorp) | 5 | eligible enough at thorp (median 7, need 6): the top 21% against an even 1/7: INFERRED sampling or an uneven exclusion of some lines by marks, not measured line by line |
| DS-DEF-3 :: First-Survey qualification (the reading is a first look) | 41% | 21% (hamlet) | 4 | eligible enough at hamlet (median 7, need 7): the top 21% against an even 1/7: INFERRED sampling or an uneven exclusion of some lines by marks, not measured line by line |
| DS-DEF-4 :: structure null (nothing organized recognized) | 35% | 35% (village) | 4 (all dm-only) | its new lines are all dm-only, which public prose never draws (median eligible unchanged) |
| DS-DEF-4 :: FIXTURE: black market | 47% | 47% (city) | 4 (all dm-only) | its new lines are all dm-only, which public prose never draws (median eligible unchanged) |
| DS-ECO-6 :: TIER: minor shadow activity (≥3) | 68% | 68% (city) | 6 (all dm-only) | its new lines are all dm-only, which public prose never draws (median eligible unchanged) |
| DS-ECO-11 :: ECONOMIC STRENGTHS: the roster is populated | 33% | 21% (thorp) | 3 | eligible enough at thorp (median 6, need 6): the top 21% against an even 1/6: INFERRED sampling or an uneven exclusion of some lines by marks, not measured line by line |
| DS-ECO-12 :: INCOME MIX: one source carries the town | 44% | 21% (thorp) | 5 | eligible enough at thorp (median 8, need 7): the top 21% against an even 1/8: INFERRED sampling or an uneven exclusion of some lines by marks, not measured line by line |
| DS-ECO-12 :: CRITICAL IMPORT: a house needs what the land lacks | 45% | 21% (metropolis) | 5 | eligible enough at metropolis (median 7, need 7): the top 21% against an even 1/7: INFERRED sampling or an uneven exclusion of some lines by marks, not measured line by line |
| DS-POW-2 :: recentConflict present | 57% | 23% (metropolis) | 5 | eligible enough at metropolis (median 7, need 7): the top 23% against an even 1/7: INFERRED sampling or an uneven exclusion of some lines by marks, not measured line by line |
| DS-POW-6 :: operation role duty evasion | 39% | 39% (metropolis) | 4 (all dm-only) | its new lines are all dm-only, which public prose never draws (median eligible unchanged) |

## E. Newly over 15% at the tip (under it at the base)

None.

EXECUTED: both measures (900 places each), every share and weight above. INFERRED: the "why" column's reading of a median against the need (a rule, stated in the column).
