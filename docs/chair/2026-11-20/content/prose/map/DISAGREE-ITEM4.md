4 cell pairs read TRUE: 9 pairs of variants contradict one another outright, and none of them is a walls pair.
They print on 38 of the 900 pages, and none of those pages is a metropolis: 26 are thorps, hamlets and villages, 11 are cities and 1 is a village.
The worst pair is no market × exports established, on 26 pages. dz-thorp-5 prints "Trade at {settlement} goes as far as neighbours can carry it between themselves." beside "A merchant who comes to {settlement} for one thing usually leaves with two or three."

# DISAGREE ITEM (4): pairs of cells where one says LACK and the other SUFFICIENCY, read by variant (PROSE-6's builder, brief + AMENDMENT 1)
How the run went: script `map/disagree-item4.mjs`, `TREE=/home/user/wt-disagree` (01ecf1e91; b443be64b is test-only, src unchanged), run once through `gate-mutex.sh --run`. 900 births, 323.2 s, exit 0. Log: `/home/user/logs/prose6-item4-900-vp.log`.
How "printed" is found: the engine's draw ledger gives the cell and the vid each desk drew. A draw counts as printed when the tooth's matcher (`matchersOf`/`pageTextsOf`) finds it on the page. Power and stressors lines are outside the helper's leaves, so for them it is enough that the block's sentence mount is on the page.
Each row is one cell pair. **TRUE** = the sum of the pages of its TRUE variant pairs. **unread** = pages of variant pairs beyond the ones read (at most 8 read per cell pair, worst first).

| # | family | LACK cell | SUFFICIENCY cell | pages th/ha/vi/to/ci/me = all | TRUE | unread | seed | variant pairs read: verdict, why |
|---|---|---|---|---|---|---|---|---|
| 1 | trade | general DS-GEN-13 `NO-MARKET` | economy DS-ECO-10 `POSTURE: established` | 101/95/58/0/0/0 = 254 | 26 | 142 | dz-thorp-5 | TRUE v10×v6 13, v10×v5 13: only neighbours trade, yet outside buyers come. NOT v8×v6 17, v7×v1 16, v9×v1 15, v3×v5 13, v8×v1 13, v7×v4 12: goods leave without a market |
| 2 | order | defense DS-DEF-3 `Unsafe` | defense DS-DEF-2 `Internal Security: full legal chain (court AND prison)` | 0/0/0/0/17/0 = 17 | 10 | 1 | dz-city-63 | TRUE v3×v2 4, v2×v2 3, v3×v1 1, v2×v1 1, v1×v2 1: the watch answers less, yet wrongs reliably go somewhere. NOT v2×v3 3, v3×v3 2, v1×v3 1: B only says a court and cell exist |
| 3 | food | economy DS-ECO-9 `PRESSURED` | defense DS-DEF-2 `CHAIN: food trades working` | 0/0/0/0/4/1 = 5 | 1 | 0 | dz-city-50 | TRUE v1×v1 1: already falls short, yet "would not run short". NOT v2×v1 4: smaller portions now, stores against a siege |
| 4 | money | defense DS-DEF-2 `Economic Survival: CRITICAL` | general DS-GEN-17 `GARRISONED` | 0/0/1/0/0/0 = 1 | 1 | 0 | dz-village-7 | TRUE v1×v1 1: "cannot fund a response to anything", yet keeps paid men under arms |
| 5 | trade | economy DS-SUP-2 `UPSTREAM WEAK: …` | general DS-GEN-13 `MARKET-OPEN` | 0/0/0/10/48/131 = 189 | 0 | 92 | dz-city-3 | NOT 8 (v6×v3 15 … v4×v4 11): an upstream chain fails; the market still stands |
| 6 | trade | economy DS-SUP-2 `UPSTREAM WEAK: …` | economy DS-ECO-10 `POSTURE: established` | 0/0/0/10/43/112 = 165 | 0 | 102 | dz-city-4 | NOT 8 (v5×v5 13 … v6×v5 7): one input chain is weak, and exports are many |
| 7 | trade | economy DS-SUP-2 `UPSTREAM WEAK: …` | economy DS-ECO-1 `COMBINATION C1: a high rung on a working approach` | 0/0/0/1/36/102 = 139 | 0 | 92 | dz-city-105 | NOT 8 (v5×v2 7 … v1×v5 5): a chain is at risk, and the town still prospers |
| 8 | trade | general DS-GEN-13 `NO-MARKET` | economy DS-ECO-1 `COMBINATION C4: a low rung on a working approach` | 15/55/65/0/0/0 = 135 | 0 | 53 | dz-thorp-31 | NOT 8 (v8×v6 15 … v3×v1 8): both say there is no market or it stays poor |
| 9 | order | defense DS-DEF-3 `Unsafe` | general DS-GEN-17 `ADMINISTERED` | 0/0/0/0/17/0 = 17 | 0 | 0 | dz-city-19 | NOT all 8 (v2×v2 5 … v2×v3 1): a court and gaol stand; enforcement still slips |
| 10 | trade | economy DS-ECO-10 `POSTURE: none` | economy DS-ECO-1 `COMBINATION C4: …` | 2/4/9/0/0/0 = 15 | 0 | 1 | dz-thorp-9 | NOT 8 (v3×v4 3 … v1×v4 1): no exports; the siege closed the road; poor |
| 11 | order | power DS-POW-6 `capture pressure ADVANCING (…)` | general DS-GEN-17 `ADMINISTERED` | 0/0/0/1/2/3 = 6 | 0 | 0 | dz-town-32 | NOT all 5: officials are underpaid and can be bought; the courts still stand |
| 12 | order | power DS-POW-6 `capture pressure ADVANCING (…)` | defense DS-DEF-2 `Internal Security: full legal chain …` | 0/0/0/0/2/3 = 5 | 0 | 0 | dz-city-69 | NOT all 4: officials can be bought, yet process works; a risk, not a failure |
| 13 | order | defense DS-DEF-3 `COMPOUND: insurgency` | general DS-GEN-17 `ADMINISTERED` | 0/0/0/2/0/2 = 4 | 0 | 0 | dz-town-125 | NOT all 4: unrest in the streets; the courts still stand |
| 14 | order | defense DS-DEF-8 `override: INSURGENCY ACTIVE` | general DS-GEN-17 `ADMINISTERED` | 0/0/0/2/0/2 = 4 | 0 | 0 | dz-town-125 | NOT all 3: the guards are unwelcome; the law keeps its building |
| 15 | order | stressors DS-CND-1 `DIRECTION: worsening · CRISIS: insurgency` | general DS-GEN-17 `ADMINISTERED` | 0/0/0/2/0/2 = 4 | 0 | 0 | dz-town-32 | NOT all 4: loyalty is ebbing; the institutions still stand |
| 16 | order | defense DS-DEF-3 `COMPOUND: insurgency` | defense DS-DEF-2 `Internal Security: full legal chain …` | 0/0/0/1/0/2 = 3 | 0 | 0 | dz-town-125 | NOT all 3: curfew and patrols, beside a working court |
| 17 | order | defense DS-DEF-8 `override: INSURGENCY ACTIVE` | defense DS-DEF-2 `Internal Security: full legal chain …` | 0/0/0/1/0/2 = 3 | 0 | 0 | dz-town-125 | NOT all 2: a hostile street; the court still hears cases |
| 18 | order | stressors DS-CND-1 `DIRECTION: worsening · CRISIS: insurgency` | defense DS-DEF-2 `Internal Security: full legal chain …` | 0/0/0/1/0/2 = 3 | 0 | 0 | dz-metropolis-61 | NOT all 3: dues go to rivals; the court still sits |
| 19 | trade | economy DS-SUP-2 `UPSTREAM WEAK: …` | economy DS-ECO-1 `COMBINATION C4: …` | 0/0/0/0/0/3 = 3 | 0 | 0 | dz-metropolis-80 | NOT all 3: a weak chain; the siege leaves it poor |
| 20 | trade | economy DS-ECO-10 `POSTURE: limited` | general DS-GEN-13 `MARKET-OPEN` | 0/0/0/3/0/0 = 3 | 0 | 0 | dz-town-86 | NOT all 2: one export, and a busy market day |
| 21 | trade | economy DS-ECO-10 `POSTURE: none` | general DS-GEN-13 `MARKET-OPEN` | 0/0/2/0/0/0 = 2 | 0 | 0 | dz-village-7 | NOT all 2: no exports; besieged, the market sells only to locals |
| 22 | food | economy DS-ECO-8 `FOOD AND PROSPERITY: hunger holds …` | defense DS-DEF-2 `CHAIN: food trades working` | 0/0/1/0/0/0 = 1 | 0 | 0 | dz-village-42 | NOT v2×v4 1: besieged, the stores help but are not enough |
| 23 | food | economy DS-ECO-9 `DEFICIT` | defense DS-DEF-2 `CHAIN: food trades working` | 0/0/1/0/0/0 = 1 | 0 | 0 | dz-village-42 | NOT v5×v4 1: the same page and the same reconciliation |
| 24 | food (CONTROL) | defense DS-DEF-2 `CHAIN: food trades failing` | economy DS-ECO-9 `SECURE` | 0/0/3/9/12/44 = 68 | 0 | 33 | dz-town-0 | NOT 8 (v10×v1 6, v10×v8 6, v10×v6 5, v12×v8 5, v7×v3 4, v10×v9 3, v11×v1 3, v11×v7 3): the cure's lines say both truths |
| 25 | money (CONTROL) | defense DS-DEF-2 `Economic Survival: WEAK` | general DS-GEN-17 `GARRISONED` | 0/0/3/2/0/0 = 5 | 0 | 0 | dz-town-2 | NOT all 5 (v1/v2/v3 × v1, v1/v2 × v2): wages are paid now; nothing is laid by for a long defence |

## METHOD (five lines)
1. Cells are classified by key and the reader behind it in one frozen table: 151 rows. food 30 LACK / 17 SUFFICIENCY; money for defence 6 / 7; order 23 / 9; walls 9 / 12; trade 21 / 17. Left out as neither: `CHAIN: defence short/supplied` (supply, not money), DEF-5 forces, ECO-9 `IMPORT-DEPENDENT`.
2. Pairs: each LACK cell is crossed with each SUFFICIENCY cell of the same family, on another desk or another position. 25 have at least 1 page. The walls cells print on up to 477 pages each, but no walls pair prints on one page. Glance-only and dark cells read 0.
3. Variant pairs (LACK vid × SUFFICIENCY vid) are ranked by pages; the first 8 are read, or all if fewer. Rows 1, 5-8 and 24 have more than 8, so their unread pages stay unread. One page of each variant pair was read and marked TRUE or NOT.
4. CONTROL, BY VARIANT: the tooth's `OPPOSITE_PAIRS` print on 0 of the 900 pages, and so do `PINNED_OLD_WORDS`. The two cured cell pairs (rows 24, 25) read 0 TRUE.
5. Ledger against matcher: on 131 cell-pages the matcher finds a vid the ledger did not draw, mostly `Invasion & War: neither walls nor force` v4 on thorps. Those pages are not counted. The reading is the builder's own, for the chair to check.
