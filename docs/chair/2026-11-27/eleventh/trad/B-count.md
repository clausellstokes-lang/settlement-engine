# (B) THE COUNT ON C AND V (tree cccda7569; CONFIRMED: every number below is `scripts/analyze-B.mjs` over `scripts/run-trad.mjs`'s births)

Births: plan-C.json and plan-V.json (900 each), born as the page battery births them (`birthConfig(row.config)`, `{ seed, customContent: {} }`) in plain node (esbuild bundle of the tree's own modules, no vitest), 0 errors of 1,800; all 1,800 in preview (no lit mirror) and stamped 0.10.0. Per town: `deriveFoundingTraditions` (drawn), `shownTraditionsOf(town, [])` (the owner's tab), `sharedTraditionRowsOf(town)` (the shared page, admitted over the floor). Per town rows in `B-count.tsv`.

HEADLINE: 487 of 5,534 drawn rows are dropped, in 444 of 1,800 towns (24.7%); 277 towns (15.4%) show FEWER rows than their band's minimum (263 by one, 14 by two); **104 towns show NO tradition at all** (61 thorps, 31 hamlets, 12 villages: "No traditions are recorded for <name> yet."). The village band is fixed at 2, so every village drop is a short village (130 of 300). The shared page drops exactly the owner's rows on every town (0 extra). By need: `market` 339 rows (the fair, in thorps, hamlets and villages only), `institution: smith` 91 (+17 with market), `coast` 21 (+2), `river` 17; no row dropped for any other cause. C holds no coast and no river drop (its births are all inland); V's 38 water drops are a tide at a river place or a river at a coast (the draw's weight zeroes water rites only where there is NO water). THE FOUNDING CORE (row 0, "kept since its founding") is 158 of the 487 dropped rows (109 of them "The Founding Fair", element founding, act fair): in those towns the page loses its origin rite.
births read: 1800, errors: 0

### THE OWNER'S TAB (shownTraditionsOf)

| corpus | size | towns | rows drawn | rows dropped | towns with a drop | towns SHORT of the band (shown < band min) | short by 1 / 2 / 3+ | towns showing NONE |
|---|---|---|---|---|---|---|---|---|
| C | thorp | 150 | 220 | 73 | 62 | 32 | 32 / 0 / 0 | 32 |
| C | hamlet | 150 | 226 | 59 | 54 | 17 | 17 / 0 / 0 | 17 |
| C | village | 150 | 300 | 77 | 69 | 69 | 61 / 8 / 0 | 8 |
| C | town | 150 | 450 | 28 | 28 | 28 | 28 / 0 / 0 | 0 |
| C | city | 150 | 675 | 15 | 14 | 4 | 3 / 1 / 0 | 0 |
| C | metropolis | 150 | 896 | 9 | 7 | 4 | 3 / 1 / 0 | 0 |
| C | ALL | 900 | 2767 | 261 | 234 | 154 | 144 / 10 / 0 | 57 |
| V | thorp | 150 | 220 | 68 | 59 | 29 | 29 / 0 / 0 | 29 |
| V | hamlet | 150 | 226 | 51 | 50 | 14 | 14 / 0 / 0 | 14 |
| V | village | 150 | 300 | 65 | 61 | 61 | 57 / 4 / 0 | 4 |
| V | town | 150 | 450 | 6 | 6 | 6 | 6 / 0 / 0 | 0 |
| V | city | 150 | 675 | 21 | 19 | 9 | 9 / 0 / 0 | 0 |
| V | metropolis | 150 | 896 | 15 | 15 | 4 | 4 / 0 / 0 | 0 |
| V | ALL | 900 | 2767 | 226 | 210 | 123 | 119 / 4 / 0 | 47 |
| ALL | thorp | 300 | 440 | 141 | 121 | 61 | 61 / 0 / 0 | 61 |
| ALL | hamlet | 300 | 452 | 110 | 104 | 31 | 31 / 0 / 0 | 31 |
| ALL | village | 300 | 600 | 142 | 130 | 130 | 118 / 12 / 0 | 12 |
| ALL | town | 300 | 900 | 34 | 34 | 34 | 34 / 0 / 0 | 0 |
| ALL | city | 300 | 1350 | 36 | 33 | 13 | 12 / 1 / 0 | 0 |
| ALL | metropolis | 300 | 1792 | 24 | 22 | 8 | 7 / 1 / 0 | 0 |
| ALL | ALL | 1800 | 5534 | 487 | 444 | 277 | 263 / 14 / 0 | 104 |

Rows dropped BY NEED (the atom(s) the place does not hold; a row failing two counts under both joined by +):

| corpus | thorp | hamlet | village | town | city | metropolis | ALL |
|---|---|---|---|---|---|---|---|
| C coast | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| V coast | 0 | 3 | 1 | 1 | 9 | 7 | 21 |
| ALL coast | 0 | 3 | 1 | 1 | 9 | 7 | 21 |
| C coast+market | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| V coast+market | 0 | 1 | 1 | 0 | 0 | 0 | 2 |
| ALL coast+market | 0 | 1 | 1 | 0 | 0 | 0 | 2 |
| C institution: smith | 4 | 5 | 7 | 28 | 15 | 9 | 68 |
| V institution: smith | 5 | 5 | 2 | 4 | 7 | 0 | 23 |
| ALL institution: smith | 9 | 10 | 9 | 32 | 22 | 9 | 91 |
| C institution: smith+market | 2 | 3 | 3 | 0 | 0 | 0 | 8 |
| V institution: smith+market | 2 | 4 | 3 | 0 | 0 | 0 | 9 |
| ALL institution: smith+market | 4 | 7 | 6 | 0 | 0 | 0 | 17 |
| C market | 67 | 51 | 67 | 0 | 0 | 0 | 185 |
| V market | 60 | 38 | 56 | 0 | 0 | 0 | 154 |
| ALL market | 127 | 89 | 123 | 0 | 0 | 0 | 339 |
| C river | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| V river | 1 | 0 | 2 | 1 | 5 | 8 | 17 |
| ALL river | 1 | 0 | 2 | 1 | 5 | 8 | 17 |

The rites most often dropped (C+V), the twenty first:

| # | element | act | need failed | rows | e.g. name |
|---|---|---|---|---|---|
| 1 | founding | fair | market | 109 | The Founding Fair |
| 2 | forge | fair | institution: smith, market | 42 | The Common Forge Fair |
| 3 | charter | fair | market | 35 | The Quiet Fair |
| 4 | greening | fair | market | 26 | The Laurel Fair |
| 5 | harvest | fair | market | 24 | The Old Harvest Fair |
| 6 | market | fair | market | 24 | The Green Fair |
| 7 | forge | offering | institution: smith | 23 | The Offering of the Forge |
| 8 | first-landing | fair | market | 21 | The Great Fair |
| 9 | field | fair | market | 19 | The Old Fair |
| 10 | stone | fair | market | 14 | The Great Standing Stone Fair |
| 11 | forge | feast | institution: smith | 13 | The Long Feast |
| 12 | market | offering | market | 12 | The Old Market Offering |
| 13 | forge | contest | institution: smith | 11 | The Forge Contest |
| 14 | hunt | fair | market | 11 | The Hunt Fair |
| 15 | forge | procession | institution: smith | 10 | The Horse Procession |
| 16 | forge | vigil | institution: smith | 10 | The Forge Vigil |
| 17 | hearth | fair | market | 10 | The Horse Fair |
| 18 | tide | fair | market, coast | 10 | The Lesser Tide Fair |
| 19 | market | feast | market | 8 | The Old Market Feast |
| 20 | market | contest | market | 6 | The Market Contest |

### THE SHARED PAGE (sharedTraditionRowsOf, admitted over the floor)

| corpus | size | towns | rows drawn | rows dropped | towns with a drop | towns SHORT of the band (shown < band min) | short by 1 / 2 / 3+ | towns showing NONE |
|---|---|---|---|---|---|---|---|---|
| C | thorp | 150 | 220 | 73 | 62 | 32 | 32 / 0 / 0 | 32 |
| C | hamlet | 150 | 226 | 59 | 54 | 17 | 17 / 0 / 0 | 17 |
| C | village | 150 | 300 | 77 | 69 | 69 | 61 / 8 / 0 | 8 |
| C | town | 150 | 450 | 28 | 28 | 28 | 28 / 0 / 0 | 0 |
| C | city | 150 | 675 | 15 | 14 | 4 | 3 / 1 / 0 | 0 |
| C | metropolis | 150 | 896 | 9 | 7 | 4 | 3 / 1 / 0 | 0 |
| C | ALL | 900 | 2767 | 261 | 234 | 154 | 144 / 10 / 0 | 57 |
| V | thorp | 150 | 220 | 68 | 59 | 29 | 29 / 0 / 0 | 29 |
| V | hamlet | 150 | 226 | 51 | 50 | 14 | 14 / 0 / 0 | 14 |
| V | village | 150 | 300 | 65 | 61 | 61 | 57 / 4 / 0 | 4 |
| V | town | 150 | 450 | 6 | 6 | 6 | 6 / 0 / 0 | 0 |
| V | city | 150 | 675 | 21 | 19 | 9 | 9 / 0 / 0 | 0 |
| V | metropolis | 150 | 896 | 15 | 15 | 4 | 4 / 0 / 0 | 0 |
| V | ALL | 900 | 2767 | 226 | 210 | 123 | 119 / 4 / 0 | 47 |
| ALL | thorp | 300 | 440 | 141 | 121 | 61 | 61 / 0 / 0 | 61 |
| ALL | hamlet | 300 | 452 | 110 | 104 | 31 | 31 / 0 / 0 | 31 |
| ALL | village | 300 | 600 | 142 | 130 | 130 | 118 / 12 / 0 | 12 |
| ALL | town | 300 | 900 | 34 | 34 | 34 | 34 / 0 / 0 | 0 |
| ALL | city | 300 | 1350 | 36 | 33 | 13 | 12 / 1 / 0 | 0 |
| ALL | metropolis | 300 | 1792 | 24 | 22 | 8 | 7 / 1 / 0 | 0 |
| ALL | ALL | 1800 | 5534 | 487 | 444 | 277 | 263 / 14 / 0 | 104 |

Rows dropped BY NEED (the atom(s) the place does not hold; a row failing two counts under both joined by +):

| corpus | thorp | hamlet | village | town | city | metropolis | ALL |
|---|---|---|---|---|---|---|---|
| C coast | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| V coast | 0 | 3 | 1 | 1 | 9 | 7 | 21 |
| ALL coast | 0 | 3 | 1 | 1 | 9 | 7 | 21 |
| C coast+market | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| V coast+market | 0 | 1 | 1 | 0 | 0 | 0 | 2 |
| ALL coast+market | 0 | 1 | 1 | 0 | 0 | 0 | 2 |
| C institution: smith | 4 | 5 | 7 | 28 | 15 | 9 | 68 |
| V institution: smith | 5 | 5 | 2 | 4 | 7 | 0 | 23 |
| ALL institution: smith | 9 | 10 | 9 | 32 | 22 | 9 | 91 |
| C institution: smith+market | 2 | 3 | 3 | 0 | 0 | 0 | 8 |
| V institution: smith+market | 2 | 4 | 3 | 0 | 0 | 0 | 9 |
| ALL institution: smith+market | 4 | 7 | 6 | 0 | 0 | 0 | 17 |
| C market | 67 | 51 | 67 | 0 | 0 | 0 | 185 |
| V market | 60 | 38 | 56 | 0 | 0 | 0 | 154 |
| ALL market | 127 | 89 | 123 | 0 | 0 | 0 | 339 |
| C river | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| V river | 1 | 0 | 2 | 1 | 5 | 8 | 17 |
| ALL river | 1 | 0 | 2 | 1 | 5 | 8 | 17 |

The rites most often dropped (C+V), the twenty first:

| # | element | act | need failed | rows | e.g. name |
|---|---|---|---|---|---|
| 1 | founding | fair | market | 109 | The Founding Fair |
| 2 | forge | fair | institution: smith, market | 42 | The Common Forge Fair |
| 3 | charter | fair | market | 35 | The Quiet Fair |
| 4 | greening | fair | market | 26 | The Laurel Fair |
| 5 | harvest | fair | market | 24 | The Old Harvest Fair |
| 6 | market | fair | market | 24 | The Green Fair |
| 7 | forge | offering | institution: smith | 23 | The Offering of the Forge |
| 8 | first-landing | fair | market | 21 | The Great Fair |
| 9 | field | fair | market | 19 | The Old Fair |
| 10 | stone | fair | market | 14 | The Great Standing Stone Fair |
| 11 | forge | feast | institution: smith | 13 | The Long Feast |
| 12 | market | offering | market | 12 | The Old Market Offering |
| 13 | forge | contest | institution: smith | 11 | The Forge Contest |
| 14 | hunt | fair | market | 11 | The Hunt Fair |
| 15 | forge | procession | institution: smith | 10 | The Horse Procession |
| 16 | forge | vigil | institution: smith | 10 | The Forge Vigil |
| 17 | hearth | fair | market | 10 | The Horse Fair |
| 18 | tide | fair | market, coast | 10 | The Lesser Tide Fair |
| 19 | market | feast | market | 8 | The Old Market Feast |
| 20 | market | contest | market | 6 | The Market Contest |
