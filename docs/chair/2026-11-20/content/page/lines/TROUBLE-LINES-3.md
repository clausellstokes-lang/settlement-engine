# TROUBLE-LINES-3: four more hooks each for crime_wave and guild_conflict (PAGE-7's builder; the chair, 16:35; VETOABLE, the owner's)

These lines continue TROUBLE-LINES-2's tables and are numbered after its 12, so each kind now has 16. A place still keeps
3, by the same seed-first keyed ranking. The columns are as in TROUBLE-LINES-2: **rate** is how often the need holds
among the kind's tensions on the 900 towns, and **prints** is the share of the kind's places that print the line. The
source is `measures/page-7/hooks/pools.mjs` and `measure.pools.out.txt` (round 2's run is kept as `measure.pools-r2.out.txt`).

## crime_wave (231 tensions; 16 lines, 10 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 13 | A cart left loaded overnight was emptied before dawn, and the carter wants to know who was awake | none | 100% | 19.5% |
| 14 | An old woman's savings have gone from under her floor, and only her family knew where they were kept | none | 100% | 21.6% |
| 15 | A pedlar is selling goods cheap that several households swear were taken from them | none | 100% | 26.4% |
| 16 | Chalk marks have appeared on several doors overnight, and the households behind them are frightened | none | 100% | 22.1% |

## guild_conflict (215 tensions; 16 lines, 6 need nothing)

| # | hook | need (home) | rate | prints |
|---|---|---|---|---|
| 13 | An apprentice has run from one side of the quarrel to the other, and taken a master's tools along | none | 100% | 19.5% |
| 14 | A cart of goods from outside has arrived for a trader who is not allowed to sell them, and the carter wants paying | none | 100% | 25.1% |
| 15 | A trader at the market has been selling under the agreed price, and a crowd is expected at the stall tomorrow (the chair, 17:00) | `market` (`market.js :: marketOf`) | 100% | 20.0% |
| 16 | A guild master has quietly bought from a trader outside the guild, and someone saw it happen | `guild` (`guild.js :: guildOf`) | 99.5% | 17.2% |

## The bar, by size, with all 16 lines in both pools

Places are the 150 of each size; the census's own 50 a size are shown in brackets. Source: the `BAR new` lines.

| size | top share | second place prints |
|---|---|---|
| thorp | 10.7% | 3.6% |
| hamlet | 11.3% | 3.4% |
| village | 8.0% | 4.4% |
| town | 10.7% | 4.0% |
| city | **14.0%** (20.0%) | 6.6% (6.1%) |
| metropolis | **14.7%** (18.0%) | 7.0% (6.4%) |

At 150 places a size the city and metropolis reach the bar. At the census's 50 places, the top line is 10 of 50 cities
and 9 of 50 metropolises: a small sample's noise.

The city's 15 printed crime_wave lines appear in 21 to 6 of its 79 crime_wave places; the metropolis's 16 guild_conflict
lines appear in 22 to 5 of its 88.
