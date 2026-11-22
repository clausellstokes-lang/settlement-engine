# TWO PAIRS OF SENTENCES THAT READ AS OPPOSITE ON ONE PAGE: the chair's own measure (2026-11-22 21:22 UTC; read-only; the line's tip 244fa84ef, laws dark; 600 births, 100 a size, seeds dz-<size>-<i>; the page's prose by buildPrintProse)

```
FAMILY NOMONEY : 1 variants
    defense DS-DEF-2 [Economic Survival: WEAK] marks(guardPresence; prosperity: ≤ comfortable)
FAMILY FOODFAIL : 2 variants
    defense DS-DEF-2 [CHAIN: food trades failing] marks(no crisis: under_siege; stores: < 12)
    defense DS-DEF-2 [CHAIN: food trades failing] marks(no crisis: under_siege; stores: ≥ 12)
FAMILY FOODFINE : 2 variants
    economy DS-ECO-9 [SECURE] marks(no hunger; stores: >= 12)
    economy DS-ECO-9 [SECURE] marks(no hunger)
FAMILY WAGES : 1 variants
    general DS-GEN-17 [GARRISONED] marks(walls; no crisis: occupied)

size	n	WAGES	NOMONEY	BOTH	|	FOODFAIL	FOODFINE	BOTH
thorp	100	0	5	0	|	0	14	0
hamlet	100	0	3	0	|	0	21	0
village	100	0	1	0	|	3	13	0
town	100	30	2	2	|	6	21	1
city	100	16	0	0	|	9	13	1
metropolis	100	0	0	0	|	33	42	16
ALL	600	46	11	2	|	51	124	18
EXAMPLES wages: dz-town-2 Kamenvich: [overview.market] + [defense.threatAssessment] || dz-town-36 Aquafossae: [overview.market] + [defense.threatAssessment]
EXAMPLES food: dz-town-12 Jindao: [defense.threatAssessment] + [economics.foodSecurity] || dz-city-54 Jayaganj: [defense.threatAssessment] + [economics.foodSecurity] || dz-metropolis-2 Kallicastron: [defense.threatAssessment] + [economics.foodSecurity]
exit=0
```

READ: (FOOD) the defence desk's DS-DEF-2 pool [CHAIN: food trades failing] meets the economy desk's DS-ECO-9 pool [SECURE] on 18 of 600 pages: 16 of 100 metropolises, 1 town, 1 city: "{settlement}'s food trades are failing, and what they fail to put by is food the town would miss if it were cut off." beside "Nothing on {settlement}'s tables suggests to a visitor that food is a worry here." (WAGES) the general desk's DS-GEN-17 pool [GARRISONED] meets DS-DEF-2's pool [Economic Survival: WEAK] on 2 of 600 pages, both towns: "pays wages for its defense as well as keeping its walls" beside "The people who would have to hold {settlement} through something know there is no money to pay them for it." Each sentence is true to its own cell; no variant of either reads the other's. FIRST READ on one town (seed owner-read-1, Grímtun). The script: measures/disagree.mjs (run from a worktree of the line: node disagree.mjs 100).
