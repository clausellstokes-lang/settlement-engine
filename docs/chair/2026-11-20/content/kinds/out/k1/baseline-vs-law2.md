# KINDS-1 K0 — the trouble kinds by size (two pools side by side)

Pool: tree `/home/user/kinds-k0` sha `a6a60ef3b3f5b567a908809ff7b2d5bf8dabcce2` force `{}` sizes thorp,hamlet,village,town,city,metropolis.
Second: tree `/home/user/kinds-k1` sha `707c5fed39f5abb49be5ea432d250882284ca016` force `{"_troubleLawVersion":2}`.

## Where each candidate read is taken

- **crime** = `economicState.compound.criminalEffective` (`generateEconomy` writes `compound`; present on the record at every size, see "lacks" below). **hasCriminal** = any institution with `priorityCategory === 'criminal'` (`historyGenerator.js :: buildHistoricalEvent`'s `hasCriminal`). **nameRule** = an institution name holding fence / smuggl / bandit / outlaw (the small-place rule (c)).
- **g1** = institutions whose `tags` include `'guild'` (`buildHistoricalEvent`'s `hasGuild` is g1 > 0). **g2** = `powerStructure.factions` with `category === 'economy'` (the power's category field is `category`, written by `powerGenerator.js`; values economy / military / religion / magic / criminal / ...).
- Every read is taken TWICE: at the history step (the pipeline's own `onStep` observer after `generatePopulation`, i.e. the ctx `steps/generateNarratives.js` then hands to `generateHistory` -> `buildHistoricalEvent`; bracketed again after `generateNarratives`) and on the FINAL record. The figures below use the history-step read (what the law will see). The hook leaves the record unchanged (sha256 of the record, checked).

| read | places where history-step != final | by size | history-step != after-narratives | examples |
|---|---|---|---|---|
| crime | 0 | — | 0 | — |
| hasCriminal | 0 | — | 0 | — |
| nameRule | 0 | — | 0 | — |
| g1 | 0 | — | 0 | — |
| g2 | 323 | thorp 12, hamlet 18, village 45, town 72, city 92, metropolis 84 | 0 | visitor-thorp-1: 1 -> 0; visitor-thorp-43: 1 -> 0; visitor-thorp-59: 1 -> 0 |
| factions | 567 | thorp 109, hamlet 113, village 123, town 126, city 80, metropolis 16 | 0 | visitor-thorp-0: 2 -> 1; visitor-thorp-1: 3 -> 1; visitor-thorp-2: 3 -> 1 |
| institutions | 0 | — | 0 | — |

Why the roster read moves (read from the pipeline, no src change): `steps/generateNarratives.js` calls `generateHistory` on the ctx as it stands after `generatePopulation` (only `boughtFishRowsInPlace` / the resource analysis write `economicState.primaryImports` and `availableServices` in place first; `compound` and the institutions are untouched, as the bracket column shows). AFTER history, `steps/assembleSettlement.js` runs the density law `resizePoliticalRoster` (ODQ §810 seam 1b) on `powerStructure`: it resizes the faction roster to the tier's band, so the FINAL record's `powerStructure.factions` (hence g2) can differ from the PRE-TRIM roster `buildHistoricalEvent` was given; the institutions and `economicState.compound` reach the final record as history saw them (0 drift). A law reading g2 must read the pre-trim roster (what it is handed), never the final record's.

## Troubles a place (0 / 1 / 2 / 3+), count and share

| size | n | calm | 0 | 1 | 2 | 3+ | distinct kinds | commonest first |
|---|---|---|---|---|---|---|---|---|
| thorp (law 1 | law 2) | 150 | 150 | 102 | 102 | 0 (0%) | 0 (0%) | 146 (97%) | 146 (97%) | 3 (2%) | 4 (3%) | 1 (1%) | 0 (0%) | 24 | 24 | resource_scarcity 17.3% | resource_scarcity 17.3% |
| hamlet (law 1 | law 2) | 150 | 150 | 99 | 99 | 0 (0%) | 0 (0%) | 148 (99%) | 148 (99%) | 2 (1%) | 2 (1%) | 0 (0%) | 0 (0%) | 23 | 23 | resource_scarcity 13.3% | resource_scarcity 13.3% |
| village (law 1 | law 2) | 150 | 150 | 97 | 97 | 0 (0%) | 0 (0%) | 66 (44%) | 68 (45%) | 84 (56%) | 82 (55%) | 0 (0%) | 0 (0%) | 28 | 28 | resource_scarcity 17.3% | resource_scarcity 17.3% |
| town (law 1 | law 2) | 150 | 150 | 109 | 109 | 0 (0%) | 0 (0%) | 70 (47%) | 72 (48%) | 80 (53%) | 78 (52%) | 0 (0%) | 0 (0%) | 29 | 29 | crime_wave 21.3% | crime_wave 12.0% |
| city (law 1 | law 2) | 150 | 150 | 110 | 110 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 76 (51%) | 77 (51%) | 74 (49%) | 73 (49%) | 29 | 29 | crime_wave 46.0% | crime_wave 18.7% |
| metropolis (law 1 | law 2) | 150 | 150 | 105 | 105 | 0 (0%) | 0 (0%) | 0 (0%) | 0 (0%) | 74 (49%) | 75 (50%) | 76 (51%) | 75 (50%) | 29 | 29 | crime_wave 42.0% | crime_wave 22.7% |

## Trouble COUNT moved (second pool against first, by seed)

| size | down | up | same | record hash changed | kinds list changed | UP (a finding) |
|---|---|---|---|---|---|---|
| thorp | 1 | 0 | 149 | 150 | 3 | — |
| hamlet | 0 | 0 | 150 | 150 | 4 | — |
| village | 2 | 0 | 148 | 150 | 6 | — |
| town | 2 | 0 | 148 | 150 | 38 | — |
| city | 1 | 0 | 149 | 150 | 75 | — |
| metropolis | 1 | 0 | 149 | 150 | 59 | — |

## Each kind's share of places (any position) and as FIRST trouble

**thorp** (n 150; distinct 24 | 24): resource_scarcity 17.3 | 17.3% / first 17.3 | 17.3%; external_threat 12.0 | 12.0% / first 9.3 | 9.3%; crime_wave 11.3 | 9.3% / first 10.7 | 9.3%; legitimacy_crisis 6.7 | 6.7% / first 6.7 | 6.7%; leadership_vacuum 5.3 | 5.3% / first 5.3 | 5.3%; wild_magic 5.3 | 5.3% / first 5.3 | 5.3%; corruption_scandal 4.7 | 4.7% / first 4.7 | 4.7%; great_fire 4.0 | 4.0% / first 4.0 | 4.0%; magical_controversy 4.0 | 4.0% / first 4.0 | 4.0%; succession_crisis 4.0 | 4.0% / first 4.0 | 4.0%; heresy_trial 3.3 | 3.3% / first 3.3 | 3.3%; infiltration_fear 3.3 | 4.0% / first 3.3 | 4.0%; outside_debt 3.3 | 3.3% / first 3.3 | 3.3%; plague_years 2.7 | 2.7% / first 2.7 | 2.7%; popular_uprising 2.7 | 2.7% / first 2.7 | 2.7%; religious_tension 2.7 | 3.3% / first 2.7 | 3.3%; generational_divide 2.0 | 2.0% / first 2.0 | 2.0%; great_flood 2.0 | 2.0% / first 2.0 | 2.0%; disputed_land 1.3 | 1.3% / first 1.3 | 1.3%; population_friction 1.3 | 1.3% / first 1.3 | 1.3%; trade_collapse 1.3 | 1.3% / first 1.3 | 1.3%; tyranny 1.3 | 1.3% / first 1.3 | 1.3%; demographic_pressure 0.7 | 0.7% / first 0.7 | 0.7%; pilgrimage_surge 0.7 | 0.7% / first 0.7 | 0.7%

**hamlet** (n 150; distinct 23 | 23): resource_scarcity 13.3 | 13.3% / first 13.3 | 13.3%; external_threat 10.0 | 10.0% / first 8.7 | 8.7%; legitimacy_crisis 8.0 | 8.0% / first 8.0 | 8.0%; corruption_scandal 7.3 | 7.3% / first 7.3 | 7.3%; outside_debt 7.3 | 7.3% / first 7.3 | 7.3%; plague_years 6.7 | 6.7% / first 6.7 | 6.7%; tyranny 6.7 | 7.3% / first 6.7 | 7.3%; crime_wave 5.3 | 2.7% / first 5.3 | 2.7%; succession_crisis 4.0 | 4.0% / first 4.0 | 4.0%; disputed_land 3.3 | 3.3% / first 3.3 | 3.3%; great_flood 3.3 | 4.7% / first 3.3 | 4.7%; popular_uprising 3.3 | 3.3% / first 3.3 | 3.3%; religious_tension 3.3 | 4.0% / first 3.3 | 4.0%; infiltration_fear 2.7 | 2.7% / first 2.7 | 2.7%; magical_controversy 2.7 | 2.7% / first 2.7 | 2.7%; trade_collapse 2.7 | 2.7% / first 2.7 | 2.7%; generational_divide 2.0 | 2.0% / first 2.0 | 2.0%; heresy_trial 2.0 | 2.0% / first 2.0 | 2.0%; leadership_vacuum 2.0 | 2.0% / first 2.0 | 2.0%; wild_magic 2.0 | 2.0% / first 2.0 | 2.0%; great_fire 1.3 | 1.3% / first 1.3 | 1.3%; population_friction 1.3 | 1.3% / first 1.3 | 1.3%; occupation_legacy 0.7 | 0.7% / first 0.7 | 0.7%

**village** (n 150; distinct 28 | 28): resource_scarcity 17.3 | 17.3% / first 17.3 | 17.3%; disputed_land 8.7 | 8.7% / first 5.3 | 5.3%; heresy_trial 8.7 | 8.0% / first 4.0 | 4.0%; leadership_vacuum 8.0 | 8.0% / first 5.3 | 6.0%; legitimacy_crisis 8.0 | 8.0% / first 6.0 | 6.0%; population_friction 8.0 | 8.0% / first 4.7 | 4.7%; crime_wave 7.3 | 4.0% / first 7.3 | 4.0%; external_threat 7.3 | 6.7% / first 4.7 | 5.3%; wild_magic 7.3 | 6.7% / first 2.0 | 2.0%; magical_controversy 6.7 | 6.7% / first 2.7 | 2.7%; outside_debt 6.7 | 6.7% / first 3.3 | 3.3%; succession_crisis 6.7 | 6.7% / first 5.3 | 5.3%; great_flood 6.0 | 6.0% / first 3.3 | 3.3%; infiltration_fear 6.0 | 6.0% / first 3.3 | 3.3%; corruption_scandal 5.3 | 5.3% / first 4.0 | 4.0%; pilgrimage_surge 5.3 | 6.0% / first 2.7 | 3.3%; plague_years 5.3 | 5.3% / first 4.0 | 4.0%; popular_uprising 3.3 | 3.3% / first 2.7 | 2.7%; trade_dispute 3.3 | 3.3% / first 1.3 | 1.3%; demographic_pressure 2.7 | 2.7% / first 0.0 | 0.0%; generational_divide 2.7 | 3.3% / first 2.7 | 3.3%; occupation_legacy 2.7 | 2.7% / first 2.0 | 2.0%; religious_tension 2.7 | 2.7% / first 1.3 | 1.3%; trade_collapse 2.7 | 4.0% / first 0.7 | 0.7%; tyranny 2.7 | 3.3% / first 0.7 | 1.3%; great_fire 2.0 | 2.7% / first 0.7 | 0.7%; economic_disparity 1.3 | 1.3% / first 1.3 | 1.3%; guild_conflict 1.3 | 1.3% / first 1.3 | 1.3%

**town** (n 150; distinct 29 | 29): guild_conflict 30.7 | 16.7% / first 19.3 | 11.3%; crime_wave 22.0 | 12.7% / first 21.3 | 12.0%; external_threat 10.0 | 11.3% / first 4.7 | 6.7%; legitimacy_crisis 9.3 | 9.3% / first 8.7 | 8.7%; resource_scarcity 9.3 | 10.7% / first 6.0 | 6.7%; succession_crisis 6.7 | 6.7% / first 4.7 | 6.0%; corruption_scandal 6.0 | 6.7% / first 4.7 | 6.0%; religious_tension 6.0 | 7.3% / first 2.7 | 2.7%; great_flood 5.3 | 6.0% / first 4.0 | 4.7%; infiltration_fear 4.0 | 4.0% / first 1.3 | 1.3%; leadership_vacuum 4.0 | 4.0% / first 3.3 | 3.3%; occupation_legacy 3.3 | 3.3% / first 2.7 | 2.7%; pilgrimage_surge 3.3 | 4.7% / first 1.3 | 2.7%; population_friction 3.3 | 2.7% / first 2.0 | 2.0%; tyranny 3.3 | 4.0% / first 2.0 | 2.7%; great_fire 2.7 | 3.3% / first 1.3 | 1.3%; heresy_trial 2.7 | 2.0% / first 0.7 | 1.3%; outside_debt 2.7 | 3.3% / first 0.7 | 0.7%; trade_dispute 2.7 | 3.3% / first 2.0 | 2.7%; disputed_land 2.0 | 6.7% / first 0.7 | 4.7%; economic_disparity 2.0 | 3.3% / first 0.0 | 0.0%; popular_uprising 2.0 | 3.3% / first 1.3 | 2.0%; trade_collapse 2.0 | 2.0% / first 1.3 | 1.3%; wild_magic 2.0 | 4.0% / first 0.7 | 0.7%; demographic_pressure 1.3 | 1.3% / first 0.7 | 0.7%; generational_divide 1.3 | 1.3% / first 0.7 | 1.3%; market_crash 1.3 | 2.7% / first 0.7 | 1.3%; plague_years 1.3 | 3.3% / first 0.7 | 2.0%; magical_controversy 0.7 | 2.0% / first 0.0 | 0.7%

**city** (n 150; distinct 29 | 29): guild_conflict 50.7 | 32.7% / first 12.0 | 12.0%; crime_wave 48.7 | 20.7% / first 46.0 | 18.7%; resource_scarcity 12.0 | 13.3% / first 7.3 | 9.3%; external_threat 9.3 | 11.3% / first 2.0 | 4.0%; outside_debt 8.7 | 10.0% / first 3.3 | 4.0%; pilgrimage_surge 8.7 | 11.3% / first 2.0 | 2.7%; wild_magic 8.7 | 6.7% / first 2.0 | 2.0%; corruption_scandal 8.0 | 11.3% / first 4.0 | 6.0%; infiltration_fear 8.0 | 7.3% / first 1.3 | 3.3%; legitimacy_crisis 8.0 | 8.0% / first 3.3 | 4.0%; popular_uprising 6.7 | 8.7% / first 2.0 | 2.7%; religious_tension 6.0 | 8.7% / first 1.3 | 2.0%; succession_crisis 6.0 | 7.3% / first 0.7 | 1.3%; generational_divide 5.3 | 6.0% / first 1.3 | 2.7%; great_flood 5.3 | 8.7% / first 0.7 | 2.0%; tyranny 5.3 | 8.0% / first 0.7 | 1.3%; heresy_trial 4.7 | 11.3% / first 1.3 | 4.0%; leadership_vacuum 4.7 | 5.3% / first 1.3 | 2.7%; population_friction 4.7 | 7.3% / first 0.7 | 2.7%; magical_controversy 4.0 | 6.0% / first 1.3 | 1.3%; plague_years 4.0 | 7.3% / first 1.3 | 1.3%; trade_dispute 4.0 | 5.3% / first 0.0 | 1.3%; economic_disparity 3.3 | 6.7% / first 0.7 | 2.7%; great_fire 3.3 | 4.0% / first 1.3 | 2.0%; occupation_legacy 3.3 | 5.3% / first 0.7 | 2.0%; market_crash 2.7 | 2.7% / first 0.7 | 0.7%; trade_collapse 2.7 | 4.0% / first 0.7 | 0.7%; disputed_land 2.0 | 2.7% / first 0.0 | 0.7%; demographic_pressure 0.7 | 0.7% / first 0.0 | 0.0%

**metropolis** (n 150; distinct 29 | 29): guild_conflict 50.7 | 31.3% / first 12.0 | 10.7%; crime_wave 45.3 | 26.7% / first 42.0 | 22.7%; succession_crisis 12.7 | 14.0% / first 4.0 | 6.0%; external_threat 10.7 | 13.3% / first 4.7 | 6.7%; disputed_land 9.3 | 9.3% / first 1.3 | 1.3%; resource_scarcity 8.7 | 8.7% / first 6.0 | 6.0%; generational_divide 8.0 | 6.0% / first 1.3 | 1.3%; religious_tension 8.0 | 10.7% / first 0.7 | 2.7%; pilgrimage_surge 7.3 | 7.3% / first 0.0 | 1.3%; economic_disparity 6.7 | 6.7% / first 2.0 | 2.0%; magical_controversy 6.7 | 12.0% / first 2.0 | 3.3%; leadership_vacuum 6.0 | 6.7% / first 2.7 | 3.3%; legitimacy_crisis 6.0 | 6.7% / first 4.0 | 4.7%; outside_debt 6.0 | 7.3% / first 2.0 | 2.7%; population_friction 6.0 | 9.3% / first 2.0 | 3.3%; popular_uprising 5.3 | 9.3% / first 1.3 | 1.3%; corruption_scandal 4.7 | 6.0% / first 1.3 | 3.3%; great_flood 4.7 | 5.3% / first 1.3 | 2.0%; infiltration_fear 4.7 | 4.7% / first 1.3 | 1.3%; tyranny 4.7 | 6.0% / first 1.3 | 2.0%; wild_magic 4.7 | 6.0% / first 0.7 | 1.3%; great_fire 4.0 | 6.0% / first 0.7 | 1.3%; trade_dispute 4.0 | 7.3% / first 2.0 | 3.3%; heresy_trial 3.3 | 6.0% / first 1.3 | 1.3%; market_crash 3.3 | 2.7% / first 0.0 | 0.0%; plague_years 2.7 | 3.3% / first 0.7 | 1.3%; trade_collapse 2.7 | 5.3% / first 0.0 | 1.3%; demographic_pressure 2.0 | 2.0% / first 0.7 | 0.7%; occupation_legacy 2.0 | 4.0% / first 0.7 | 1.3%

## Rate by QUARTER of each candidate read (crime_wave, guild_conflict)

Quarters by RANK within the size: present values sorted ascending, ties broken by seed index, cut into four equal counts (rank r of n -> quarter floor(4r/n)); a run of tied values at a cut is SPLIT by seed order, so the quarters of an integer read (g1, g2) can share a value (the range of each quarter is shown). Places lacking the read are left out.

### crime_wave

| size | read | Q1 (bottom) | Q2 | Q3 | Q4 (top) |
|---|---|---|---|---|---|
| thorp | crime | 5 | 5% [2–15] | 19 | 14% [15–29] | 13 | 13% [30–44] | 8 | 5% [44–84] |
| thorp | g1 | 21 | 18% [0–0] | 5 | 3% [0–0] | 11 | 11% [0–0] | 8 | 5% [0–0] |
| thorp | g2 | 24 | 21% [0–0] | 5 | 3% [0–0] | 11 | 11% [0–0] | 5 | 3% [0–1] |
| hamlet | crime | 0 | 0% [2–15] | 8 | 3% [15–26] | 3 | 0% [27–37] | 11 | 8% [38–89] |
| hamlet | g1 | 3 | 3% [0–0] | 3 | 0% [0–0] | 5 | 3% [0–0] | 11 | 5% [0–0] |
| hamlet | g2 | 3 | 3% [0–0] | 5 | 0% [0–0] | 3 | 3% [0–0] | 11 | 5% [0–1] |
| village | crime | 0 | 0% [3–14] | 5 | 3% [14–26] | 18 | 8% [27–41] | 5 | 5% [41–74] |
| village | g1 | 0 | 0% [0–0] | 8 | 5% [0–0] | 13 | 8% [0–0] | 8 | 3% [0–0] |
| village | g2 | 5 | 3% [0–0] | 14 | 8% [0–0] | 8 | 3% [0–2] | 3 | 3% [2–2] |
| town | crime | 5 | 3% [3–17] | 5 | 3% [17–38] | 26 | 16% [38–59] | 51 | 30% [60–100] |
| town | g1 | 18 | 13% [1–2] | 19 | 11% [2–3] | 29 | 16% [3–4] | 22 | 11% [4–7] |
| town | g2 | 16 | 11% [0–2] | 19 | 8% [2–2] | 37 | 21% [2–3] | 16 | 11% [3–3] |
| city | crime | 32 | 3% [3–21] | 57 | 11% [21–39] | 55 | 32% [39–71] | 51 | 38% [72–100] |
| city | g1 | 50 | 21% [1–4] | 49 | 16% [4–5] | 47 | 24% [5–6] | 49 | 22% [6–7] |
| city | g2 | 53 | 24% [0–2] | 46 | 22% [2–2] | 53 | 26% [2–3] | 43 | 11% [3–4] |
| metropolis | crime | 37 | 11% [4–28] | 59 | 41% [30–57] | 45 | 24% [58–82] | 41 | 32% [82–100] |
| metropolis | g1 | 53 | 21% [1–5] | 46 | 35% [5–5] | 45 | 29% [5–5] | 38 | 22% [5–6] |
| metropolis | g2 | 55 | 29% [0–2] | 49 | 30% [2–2] | 39 | 24% [2–3] | 38 | 24% [3–3] |
| ALL (place-weighted) | crime | 13.2 | 3.5% | | | 27.9 | 19.8% |
| ALL (place-weighted) | g1 | 24.1 | 12.7% | | | 22.5 | 11.3% |
| ALL (place-weighted) | g2 | 25.9 | 14.9% | | | 19.4 | 9.5% |

### guild_conflict

| size | read | Q1 (bottom) | Q2 | Q3 | Q4 (top) |
|---|---|---|---|---|---|
| thorp | crime | 0 | 0% [2–15] | 0 | 0% [15–29] | 0 | 0% [30–44] | 0 | 0% [44–84] |
| thorp | g1 | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–0] |
| thorp | g2 | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–1] |
| hamlet | crime | 0 | 0% [2–15] | 0 | 0% [15–26] | 0 | 0% [27–37] | 0 | 0% [38–89] |
| hamlet | g1 | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–0] |
| hamlet | g2 | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–1] |
| village | crime | 0 | 0% [3–14] | 3 | 3% [14–26] | 3 | 3% [27–41] | 0 | 0% [41–74] |
| village | g1 | 0 | 0% [0–0] | 3 | 3% [0–0] | 0 | 0% [0–0] | 3 | 3% [0–0] |
| village | g2 | 0 | 0% [0–0] | 0 | 0% [0–0] | 0 | 0% [0–2] | 5 | 5% [2–2] |
| town | crime | 50 | 26% [3–17] | 35 | 19% [17–38] | 16 | 11% [38–59] | 22 | 11% [60–100] |
| town | g1 | 34 | 18% [1–2] | 30 | 19% [2–3] | 32 | 13% [3–4] | 27 | 16% [4–7] |
| town | g2 | 37 | 18% [0–2] | 32 | 11% [2–2] | 18 | 18% [2–3] | 35 | 19% [3–3] |
| city | crime | 61 | 42% [3–21] | 51 | 43% [21–39] | 42 | 21% [39–71] | 49 | 24% [72–100] |
| city | g1 | 47 | 32% [1–4] | 54 | 35% [4–5] | 45 | 26% [5–6] | 57 | 38% [6–7] |
| city | g2 | 50 | 24% [0–2] | 46 | 19% [2–2] | 53 | 45% [2–3] | 54 | 43% [3–4] |
| metropolis | crime | 61 | 37% [4–28] | 46 | 32% [30–57] | 50 | 26% [58–82] | 46 | 30% [82–100] |
| metropolis | g1 | 37 | 24% [1–5] | 54 | 41% [5–5] | 53 | 29% [5–5] | 59 | 32% [5–6] |
| metropolis | g2 | 37 | 16% [0–2] | 43 | 22% [2–2] | 47 | 34% [2–3] | 76 | 54% [3–3] |
| ALL (place-weighted) | crime | 28.5 | 17.5% | | | 19.4 | 10.8% |
| ALL (place-weighted) | g1 | 19.7 | 12.3% | | | 24.3 | 14.9% |
| ALL (place-weighted) | g2 | 20.6 | 9.6% | | | 28.4 | 20.3% |

### The same, among the places where the law-1 gate is REACHED (quartiles re-taken within them)

crime_wave x crime among hasCriminal & viability (the crime coin, (a)); guild_conflict x g1 / g2 among g1 > 0 (the guild swap, (b)).

| size | kind x read | reached | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|---|---|
| thorp | crime_wave x crime | 21 | 21 | 100 | 83% [9–25] | 80 | 60% [26–31] | 80 | 80% [35–44] | 60 | 40% [44–56] |
| thorp | guild_conflict x g1 | 0 | 0 | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] |
| thorp | guild_conflict x g2 | 0 | 0 | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] |
| hamlet | crime_wave x crime | 10 | 10 | 67 | 33% [15–22] | 100 | 0% [23–36] | 100 | 67% [40–59] | 50 | 50% [62–65] |
| hamlet | guild_conflict x g1 | 0 | 0 | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] |
| hamlet | guild_conflict x g2 | 0 | 0 | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] |
| village | crime_wave x crime | 12 | 12 | 100 | 33% [25–27] | 100 | 67% [28–32] | 100 | 33% [33–40] | 67 | 67% [44–61] |
| village | guild_conflict x g1 | 0 | 0 | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] |
| village | guild_conflict x g2 | 0 | 0 | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] | — | —% [—–—] |
| town | crime_wave x crime | 68 | 68 | 41 | 24% [4–39] | 41 | 24% [40–59] | 47 | 24% [61–78] | 65 | 41% [78–100] |
| town | guild_conflict x g1 | 150 | 150 | 34 | 18% [1–2] | 30 | 19% [2–3] | 32 | 13% [3–4] | 27 | 16% [4–7] |
| town | guild_conflict x g2 | 150 | 150 | 37 | 18% [0–2] | 32 | 11% [2–2] | 18 | 18% [2–3] | 35 | 19% [3–3] |
| city | crime_wave x crime | 128 | 128 | 66 | 6% [5–27] | 56 | 19% [28–51] | 50 | 31% [51–76] | 56 | 41% [76–100] |
| city | guild_conflict x g1 | 150 | 150 | 47 | 32% [1–4] | 54 | 35% [4–5] | 45 | 26% [5–6] | 57 | 38% [6–7] |
| city | guild_conflict x g2 | 150 | 150 | 50 | 24% [0–2] | 46 | 19% [2–2] | 53 | 45% [2–3] | 54 | 43% [3–4] |
| metropolis | crime_wave x crime | 148 | 148 | 41 | 14% [4–30] | 59 | 41% [30–58] | 43 | 22% [59–82] | 41 | 32% [82–100] |
| metropolis | guild_conflict x g1 | 150 | 150 | 37 | 24% [1–5] | 54 | 41% [5–5] | 53 | 29% [5–5] | 59 | 32% [5–6] |
| metropolis | guild_conflict x g2 | 150 | 150 | 37 | 16% [0–2] | 43 | 22% [2–2] | 47 | 34% [2–3] | 76 | 54% [3–3] |

## Each candidate read's spread (history-step value)

| size | read | min | p10 | p25 | median | p75 | p90 | max | IQR | modal value (share) | lacks |
|---|---|---|---|---|---|---|---|---|---|---|---|
| thorp | crime | 2.0 | 6.3 | 15.0 | 29.5 | 44.0 | 54.1 | 84.2 | 29.0 | 2.0 (1%) | 0 |
| thorp | g1 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 (100%) | 0 |
| thorp | g2 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.0 | 0.0 | 0.0 (92%) | 0 |
| hamlet | crime | 2.4 | 7.5 | 14.9 | 26.4 | 37.3 | 50.7 | 88.8 | 22.5 | 2.4 (1%) | 0 |
| hamlet | g1 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 (100%) | 0 |
| hamlet | g2 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 1.0 | 1.0 | 0.0 | 0.0 (83%) | 0 |
| village | crime | 2.6 | 7.5 | 14.3 | 26.4 | 40.9 | 56.1 | 74.2 | 26.5 | 2.6 (1%) | 0 |
| village | g1 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 (100%) | 0 |
| village | g2 | 0.0 | 0.0 | 0.0 | 0.0 | 2.0 | 2.0 | 2.0 | 2.0 | 0.0 (65%) | 0 |
| town | crime | 3.0 | 8.9 | 16.6 | 37.6 | 58.9 | 78.6 | 100.0 | 42.3 | 100.0 (5%) | 0 |
| town | g1 | 1.0 | 1.0 | 2.0 | 3.0 | 4.0 | 5.0 | 7.0 | 2.0 | 3.0 (25%) | 0 |
| town | g2 | 0.0 | 1.0 | 2.0 | 2.0 | 3.0 | 3.0 | 3.0 | 1.0 | 2.0 (43%) | 0 |
| city | crime | 3.4 | 8.3 | 20.8 | 38.7 | 71.0 | 91.4 | 100.0 | 50.2 | 100.0 (5%) | 0 |
| city | g1 | 1.0 | 3.0 | 4.0 | 5.0 | 6.0 | 6.0 | 7.0 | 2.0 | 6.0 (32%) | 0 |
| city | g2 | 0.0 | 1.0 | 2.0 | 2.0 | 3.0 | 3.0 | 4.0 | 1.0 | 2.0 (47%) | 0 |
| metropolis | crime | 3.7 | 11.5 | 28.3 | 57.6 | 82.3 | 100.0 | 100.0 | 54.0 | 100.0 (12%) | 0 |
| metropolis | g1 | 1.0 | 4.0 | 5.0 | 5.0 | 5.0 | 6.0 | 6.0 | 0.0 | 5.0 (71%) | 0 |
| metropolis | g2 | 0.0 | 1.0 | 2.0 | 2.0 | 3.0 | 3.0 | 3.0 | 1.0 | 2.0 (51%) | 0 |

Percentiles: linear interpolation between closest ranks. Gate reach at the history step (places): thorp hasCriminal 21, viability 150, hasGuild 0, nameRule 21; hamlet hasCriminal 10, viability 150, hasGuild 0, nameRule 10; village hasCriminal 12, viability 150, hasGuild 0, nameRule 11; town hasCriminal 68, viability 150, hasGuild 150, nameRule 31; city hasCriminal 128, viability 150, hasGuild 150, nameRule 78; metropolis hasCriminal 148, viability 150, hasGuild 150, nameRule 122.

## Which guild read varies more (city, metropolis)

- city: g1 IQR 2.0, modal share 32% | g2 IQR 1.0, modal share 47% -> **g1** varies more
- metropolis: g1 IQR 0.0, modal share 71% | g2 IQR 1.0, modal share 51% -> **g2** varies more

## `--table` arithmetic (mean chance over the pool's own history-step reads; no birth)

Table: `{"crime":{"floor":0.1,"ceiling":0.4,"readLow":20,"readHigh":100},"guild":{"floor":0.05,"ceiling":0.25,"readLow":1,"readHigh":4,"read":"g2"},"smallPlaceCrime":0.7}`

| size | crime coin reached (hasCriminal & viability) | mean crime chance (law 1 0.5) | guild swap reached (g1>0) | mean guild chance (law 1 0.3) | small rule fires (calm, nameRule) x p |
|---|---|---|---|---|---|
| thorp | 21 | 15.3% | 0 | —% | 15 x 0.7 |
| hamlet | 10 | 17.2% | 0 | —% | 6 x 0.7 |
| village | 12 | 16.4% | 0 | —% | 9 x 0.7 |
| town | 68 | 25.0% | 150 | 13.0% | 0 x 0.7 |
| city | 128 | 22.2% | 150 | 13.9% | 0 x 0.7 |
| metropolis | 148 | 24.0% | 150 | 12.7% | 0 x 0.7 |

Errors: 0.
