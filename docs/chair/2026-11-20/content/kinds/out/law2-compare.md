# KINDS-1 K1 — law 2 compared (the visitor's pool, 150 a size)

- **baseline**: sha `a6a60ef3b3f5b567a908809ff7b2d5bf8dabcce2` force `{}` (docs/chair/2026-11-20/content/kinds/out/baseline.jsonl)
- **A**: sha `707c5fed39f5abb49be5ea432d250882284ca016` force `{"_troubleLawVersion":2}` (docs/chair/2026-11-20/content/kinds/out/law2.jsonl)
- **B**: sha `707c5fed39f5abb49be5ea432d250882284ca016` force `{"_troubleLawVersion":2}` plant `{"crimeWave":{"floor":0.05,"ceiling":0.55,"readLow":20,"readHigh":90}}` (docs/chair/2026-11-20/content/kinds/out/law2-B.jsonl)
- **B50**: sha `707c5fed39f5abb49be5ea432d250882284ca016` force `{"_troubleLawVersion":2}` plant `{"crimeWave":{"floor":0.05,"ceiling":0.5,"readLow":20,"readHigh":90}}` (docs/chair/2026-11-20/content/kinds/out/law2-B50.jsonl)

The bar (the chair's target): no kind on more than ~33% of a size; the commonest FIRST trouble on at most ~25%. "Near" = 30% or more. Quarters by rank of the history-step read within the size (K0's rule); crime = criminalEffective, g2 = economy powers on the pre-trim roster.

## guild_conflict / crime_wave share of places (any position)

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | 0.0 / 11.3 | 0.0 / 9.3 | 0.0 / 9.3 | 0.0 / 8.7 |
| hamlet | 0.0 / 5.3 | 0.0 / 2.7 | 0.0 / 2.7 | 0.0 / 2.7 |
| village | 1.3 / 7.3 | 1.3 / 4.0 | 1.3 / 4.0 | 1.3 / 4.0 |
| town | 30.7 / 22.0 | 16.7 / 12.7 | 16.7 / 14.7 | 16.7 / 14.0 |
| city | 50.7 / 48.7 | 32.7 / 20.7 | 32.7 / 25.3 | 32.7 / 24.0 |
| metropolis | 50.7 / 45.3 | 31.3 / 26.7 | 30.7 / 34.0 | 31.3 / 30.0 |

## kinds over (**bold**) or near the bar

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | — | — | — | — |
| hamlet | — | — | — | — |
| village | — | — | — | — |
| town | guild_conflict 30.7 | — | — | — |
| city | **guild_conflict 50.7**, **crime_wave 48.7** | guild_conflict 32.7 | guild_conflict 32.7 | guild_conflict 32.7 |
| metropolis | **guild_conflict 50.7**, **crime_wave 45.3** | guild_conflict 31.3 | **crime_wave 34.0**, guild_conflict 30.7 | guild_conflict 31.3, crime_wave 30.0 |

## commonest FIRST trouble and its share; crime_wave as first

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | resource_scarcity 17.3; crime first 10.7 | resource_scarcity 17.3; crime first 9.3 | resource_scarcity 17.3; crime first 8.7 | resource_scarcity 17.3; crime first 8.7 |
| hamlet | resource_scarcity 13.3; crime first 5.3 | resource_scarcity 13.3; crime first 2.7 | resource_scarcity 13.3; crime first 2.7 | resource_scarcity 13.3; crime first 2.7 |
| village | resource_scarcity 17.3; crime first 7.3 | resource_scarcity 17.3; crime first 4.0 | resource_scarcity 17.3; crime first 4.0 | resource_scarcity 17.3; crime first 4.0 |
| town | crime_wave 21.3; crime first 21.3 | crime_wave 12.0; crime first 12.0 | crime_wave 14.0; crime first 14.0 | crime_wave 13.3; crime first 13.3 |
| city | crime_wave 46.0 (over); crime first 46.0 | crime_wave 18.7; crime first 18.7 | crime_wave 23.3; crime first 23.3 | crime_wave 22.0; crime first 22.0 |
| metropolis | crime_wave 42.0 (over); crime first 42.0 | crime_wave 22.7; crime first 22.7 | crime_wave 28.7 (over); crime first 28.7 | crime_wave 25.3 (over); crime first 25.3 |

## crime_wave rate, bottom / top quarter of the crime read

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | 5 / 8 | 5 / 5 | 5 / 8 | 5 / 5 |
| hamlet | 0 / 11 | 0 / 8 | 0 / 8 | 0 / 8 |
| village | 0 / 5 | 0 / 5 | 0 / 5 | 0 / 5 |
| town | 5 / 51 | 3 / 30 | 3 / 38 | 3 / 35 |
| city | 32 / 51 | 3 / 38 | 3 / 51 | 3 / 49 |
| metropolis | 37 / 41 | 11 / 32 | 8 / 49 | 8 / 38 |

## guild_conflict rate, bottom / top quarter of the economy-power read (g2)

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| hamlet | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| village | 0 / 5 | 0 / 5 | 0 / 5 | 0 / 5 |
| town | 37 / 35 | 18 / 19 | 18 / 19 | 18 / 19 |
| city | 50 / 54 | 24 / 43 | 24 / 43 | 24 / 43 |
| metropolis | 37 / 76 | 16 / 54 | 13 / 54 | 16 / 54 |

## troubles a place 0/1/2/3+ (distinct kinds)

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | 0/146/3/1 (24) | 0/146/4/0 (24) | 0/147/2/1 (24) | 0/147/3/0 (24) |
| hamlet | 0/148/2/0 (23) | 0/148/2/0 (23) | 0/148/2/0 (23) | 0/148/2/0 (23) |
| village | 0/66/84/0 (28) | 0/68/82/0 (28) | 0/68/82/0 (28) | 0/68/82/0 (28) |
| town | 0/70/80/0 (29) | 0/72/78/0 (29) | 0/71/79/0 (29) | 0/71/79/0 (29) |
| city | 0/0/76/74 (29) | 0/0/77/73 (29) | 0/0/77/73 (29) | 0/0/77/73 (29) |
| metropolis | 0/0/74/76 (29) | 0/0/75/75 (29) | 0/0/74/76 (29) | 0/0/74/76 (29) |

## places whose count moved against the baseline (down / up)

| size | baseline | A | B | B50 |
|---|---|---|---|---|
| thorp | — | 1 / 0 | 1 / 0 | 2 / 0 |
| hamlet | — | 0 / 0 | 0 / 0 | 0 / 0 |
| village | — | 2 / 0 | 2 / 0 | 2 / 0 |
| town | — | 2 / 0 | 1 / 0 | 1 / 0 |
| city | — | 1 / 0 | 1 / 0 | 1 / 0 |
| metropolis | — | 1 / 0 | 0 / 0 | 0 / 0 |

## Places whose count went UP (a finding, by seed)

none

## Does an arm break the bar, by size

- baseline: city, metropolis
- A: none
- B: metropolis
- B50: metropolis
