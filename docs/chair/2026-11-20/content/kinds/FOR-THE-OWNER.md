# THE TROUBLE LAW'S TABLE — FOR THE OWNER'S SIGNING (lane KINDS-1; DRAFT, signed by none)

`src/domain/trouble/troubleLaw.js :: TROUBLE_WEIGHT_TUNING`. The law is DARK (version 1 = today, byte for byte); a saved
place keeps the law it was born under for ever; lighting it for new places is the owner's word (the chair's one unit at
the close). Under law 2 today's three fixed numbers in `historyGenerator.js :: buildHistoricalEvent` become weights that
read how much of the thing the place already holds ("capitalize on what's already there"); no read alone sets a chance to
0 or 1; the number of troubles a place is asked for, every other add, every admission check and the flat fill are unchanged.

## THE DRAFT TABLE (the chair's choice, 2026-11-20 22:10 UTC)
| row | what it weighs | read | chance at/below the low point | at/above the high point | today (law 1) |
|---|---|---|---|---|---|
| crimeWave | the crime coin: a place with any criminal house draws a crime wave first | `economicState.compound.criminalEffective` | 0.05 at 20 | 0.50 at 90 | 0.5 flat |
| guildConflict | the guild swap: each pick of the fill is swapped for a guild conflict | count of powers of the economy category on the roster the history is handed | 0.05 at 1 | 0.25 at 4 | 0.3 flat |
| smallPlaceCrime | a thorp, hamlet or village with no crisis and a fence, smuggler, bandit or outlaw house | `criminalEffective` | 0.50 at 15 | 0.90 at 60 | always (1) |
Between the points the chance is a straight line; a missing read takes the midpoint.

The chair chose B50 for the crime row; the owner may prefer A (gentler: 0.10 at 20 to 0.40 at 100, never above today's
coin) or B (0.05 at 20 to 0.55 at 90, which puts the metropolis's crime wave over a third). All four columns are below.

## MEASURED (the visitor's pool: 150 places a size, born as a visitor who touches no setting; law 2 forced in the
## instrument only; `out/law2-compare.md`, instrument `measure-kinds.mjs`)
Columns: baseline (today) | A | B | B50 (the chosen row). Quarter rates use quartiles of the read within each size.

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


## THE PLACES THAT LOST A TROUBLE (none gained one, in any arm)
Each lost one because a law-1 add overshot the number of troubles asked for and, under law 2, that add did not fire.
- A (7): thorp 148 (3→2); village 95, 144 (2→1); town 16, 114 (2→1; 114 is calm); city 60 (3→2); metropolis 51 (3→2).
- B (6): thorp 2 (2→1); village 95, 144; town 114 (calm); city 60.
- B50, the chosen row (7): thorp 2 (2→1), 148 (3→2); village 95, 144 (2→1); town 114 (2→1, calm); city 60 (3→2).
(Seeds are `visitor-<size>-<n>`.)

## ONE KNOWN LEGACY EDGE (the chair's ruling, 22:23 UTC)
A very old saved place that carries no stored configuration at all (neither `config` nor `_config`) has no record of the
law it was born under, so when one of its sections is regenerated it follows whatever configuration the form holds, as
every other setting of such a place already does. In the ordinary case the form carries no marker and the place reads
today's law; only if a world born under the new law has been loaded into the form first would its troubles re-roll under
the new law (a place that keeps its `_config` is now read from its own copy and is not affected).
