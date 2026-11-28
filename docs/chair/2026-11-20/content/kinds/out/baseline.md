# KINDS-1 K0 — the trouble kinds by size

Pool: tree `/home/user/kinds-k0` sha `a6a60ef3b3f5b567a908809ff7b2d5bf8dabcce2` force `{}` sizes thorp,hamlet,village,town,city,metropolis.

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
| thorp | 150 | 102 | 0 (0%) | 146 (97%) | 3 (2%) | 1 (1%) | 24 | resource_scarcity 17.3% |
| hamlet | 150 | 99 | 0 (0%) | 148 (99%) | 2 (1%) | 0 (0%) | 23 | resource_scarcity 13.3% |
| village | 150 | 97 | 0 (0%) | 66 (44%) | 84 (56%) | 0 (0%) | 28 | resource_scarcity 17.3% |
| town | 150 | 109 | 0 (0%) | 70 (47%) | 80 (53%) | 0 (0%) | 29 | crime_wave 21.3% |
| city | 150 | 110 | 0 (0%) | 0 (0%) | 76 (51%) | 74 (49%) | 29 | crime_wave 46.0% |
| metropolis | 150 | 105 | 0 (0%) | 0 (0%) | 74 (49%) | 76 (51%) | 29 | crime_wave 42.0% |

## Each kind's share of places (any position) and as FIRST trouble

**thorp** (n 150; distinct 24): resource_scarcity 17.3% / first 17.3%; external_threat 12.0% / first 9.3%; crime_wave 11.3% / first 10.7%; legitimacy_crisis 6.7% / first 6.7%; leadership_vacuum 5.3% / first 5.3%; wild_magic 5.3% / first 5.3%; corruption_scandal 4.7% / first 4.7%; great_fire 4.0% / first 4.0%; magical_controversy 4.0% / first 4.0%; succession_crisis 4.0% / first 4.0%; heresy_trial 3.3% / first 3.3%; infiltration_fear 3.3% / first 3.3%; outside_debt 3.3% / first 3.3%; plague_years 2.7% / first 2.7%; popular_uprising 2.7% / first 2.7%; religious_tension 2.7% / first 2.7%; generational_divide 2.0% / first 2.0%; great_flood 2.0% / first 2.0%; disputed_land 1.3% / first 1.3%; population_friction 1.3% / first 1.3%; trade_collapse 1.3% / first 1.3%; tyranny 1.3% / first 1.3%; demographic_pressure 0.7% / first 0.7%; pilgrimage_surge 0.7% / first 0.7%

**hamlet** (n 150; distinct 23): resource_scarcity 13.3% / first 13.3%; external_threat 10.0% / first 8.7%; legitimacy_crisis 8.0% / first 8.0%; corruption_scandal 7.3% / first 7.3%; outside_debt 7.3% / first 7.3%; plague_years 6.7% / first 6.7%; tyranny 6.7% / first 6.7%; crime_wave 5.3% / first 5.3%; succession_crisis 4.0% / first 4.0%; disputed_land 3.3% / first 3.3%; great_flood 3.3% / first 3.3%; popular_uprising 3.3% / first 3.3%; religious_tension 3.3% / first 3.3%; infiltration_fear 2.7% / first 2.7%; magical_controversy 2.7% / first 2.7%; trade_collapse 2.7% / first 2.7%; generational_divide 2.0% / first 2.0%; heresy_trial 2.0% / first 2.0%; leadership_vacuum 2.0% / first 2.0%; wild_magic 2.0% / first 2.0%; great_fire 1.3% / first 1.3%; population_friction 1.3% / first 1.3%; occupation_legacy 0.7% / first 0.7%

**village** (n 150; distinct 28): resource_scarcity 17.3% / first 17.3%; disputed_land 8.7% / first 5.3%; heresy_trial 8.7% / first 4.0%; leadership_vacuum 8.0% / first 5.3%; legitimacy_crisis 8.0% / first 6.0%; population_friction 8.0% / first 4.7%; crime_wave 7.3% / first 7.3%; external_threat 7.3% / first 4.7%; wild_magic 7.3% / first 2.0%; magical_controversy 6.7% / first 2.7%; outside_debt 6.7% / first 3.3%; succession_crisis 6.7% / first 5.3%; great_flood 6.0% / first 3.3%; infiltration_fear 6.0% / first 3.3%; corruption_scandal 5.3% / first 4.0%; pilgrimage_surge 5.3% / first 2.7%; plague_years 5.3% / first 4.0%; popular_uprising 3.3% / first 2.7%; trade_dispute 3.3% / first 1.3%; demographic_pressure 2.7% / first 0.0%; generational_divide 2.7% / first 2.7%; occupation_legacy 2.7% / first 2.0%; religious_tension 2.7% / first 1.3%; trade_collapse 2.7% / first 0.7%; tyranny 2.7% / first 0.7%; great_fire 2.0% / first 0.7%; economic_disparity 1.3% / first 1.3%; guild_conflict 1.3% / first 1.3%

**town** (n 150; distinct 29): guild_conflict 30.7% / first 19.3%; crime_wave 22.0% / first 21.3%; external_threat 10.0% / first 4.7%; legitimacy_crisis 9.3% / first 8.7%; resource_scarcity 9.3% / first 6.0%; succession_crisis 6.7% / first 4.7%; corruption_scandal 6.0% / first 4.7%; religious_tension 6.0% / first 2.7%; great_flood 5.3% / first 4.0%; infiltration_fear 4.0% / first 1.3%; leadership_vacuum 4.0% / first 3.3%; occupation_legacy 3.3% / first 2.7%; pilgrimage_surge 3.3% / first 1.3%; population_friction 3.3% / first 2.0%; tyranny 3.3% / first 2.0%; great_fire 2.7% / first 1.3%; heresy_trial 2.7% / first 0.7%; outside_debt 2.7% / first 0.7%; trade_dispute 2.7% / first 2.0%; disputed_land 2.0% / first 0.7%; economic_disparity 2.0% / first 0.0%; popular_uprising 2.0% / first 1.3%; trade_collapse 2.0% / first 1.3%; wild_magic 2.0% / first 0.7%; demographic_pressure 1.3% / first 0.7%; generational_divide 1.3% / first 0.7%; market_crash 1.3% / first 0.7%; plague_years 1.3% / first 0.7%; magical_controversy 0.7% / first 0.0%

**city** (n 150; distinct 29): guild_conflict 50.7% / first 12.0%; crime_wave 48.7% / first 46.0%; resource_scarcity 12.0% / first 7.3%; external_threat 9.3% / first 2.0%; outside_debt 8.7% / first 3.3%; pilgrimage_surge 8.7% / first 2.0%; wild_magic 8.7% / first 2.0%; corruption_scandal 8.0% / first 4.0%; infiltration_fear 8.0% / first 1.3%; legitimacy_crisis 8.0% / first 3.3%; popular_uprising 6.7% / first 2.0%; religious_tension 6.0% / first 1.3%; succession_crisis 6.0% / first 0.7%; generational_divide 5.3% / first 1.3%; great_flood 5.3% / first 0.7%; tyranny 5.3% / first 0.7%; heresy_trial 4.7% / first 1.3%; leadership_vacuum 4.7% / first 1.3%; population_friction 4.7% / first 0.7%; magical_controversy 4.0% / first 1.3%; plague_years 4.0% / first 1.3%; trade_dispute 4.0% / first 0.0%; economic_disparity 3.3% / first 0.7%; great_fire 3.3% / first 1.3%; occupation_legacy 3.3% / first 0.7%; market_crash 2.7% / first 0.7%; trade_collapse 2.7% / first 0.7%; disputed_land 2.0% / first 0.0%; demographic_pressure 0.7% / first 0.0%

**metropolis** (n 150; distinct 29): guild_conflict 50.7% / first 12.0%; crime_wave 45.3% / first 42.0%; succession_crisis 12.7% / first 4.0%; external_threat 10.7% / first 4.7%; disputed_land 9.3% / first 1.3%; resource_scarcity 8.7% / first 6.0%; generational_divide 8.0% / first 1.3%; religious_tension 8.0% / first 0.7%; pilgrimage_surge 7.3% / first 0.0%; economic_disparity 6.7% / first 2.0%; magical_controversy 6.7% / first 2.0%; leadership_vacuum 6.0% / first 2.7%; legitimacy_crisis 6.0% / first 4.0%; outside_debt 6.0% / first 2.0%; population_friction 6.0% / first 2.0%; popular_uprising 5.3% / first 1.3%; corruption_scandal 4.7% / first 1.3%; great_flood 4.7% / first 1.3%; infiltration_fear 4.7% / first 1.3%; tyranny 4.7% / first 1.3%; wild_magic 4.7% / first 0.7%; great_fire 4.0% / first 0.7%; trade_dispute 4.0% / first 2.0%; heresy_trial 3.3% / first 1.3%; market_crash 3.3% / first 0.0%; plague_years 2.7% / first 0.7%; trade_collapse 2.7% / first 0.0%; demographic_pressure 2.0% / first 0.7%; occupation_legacy 2.0% / first 0.7%

## Rate by QUARTER of each candidate read (crime_wave, guild_conflict)

Quarters by RANK within the size: present values sorted ascending, ties broken by seed index, cut into four equal counts (rank r of n -> quarter floor(4r/n)); a run of tied values at a cut is SPLIT by seed order, so the quarters of an integer read (g1, g2) can share a value (the range of each quarter is shown). Places lacking the read are left out.

### crime_wave

| size | read | Q1 (bottom) | Q2 | Q3 | Q4 (top) |
|---|---|---|---|---|---|
| thorp | crime | 5% [2–15] | 19% [15–29] | 13% [30–44] | 8% [44–84] |
| thorp | g1 | 21% [0–0] | 5% [0–0] | 11% [0–0] | 8% [0–0] |
| thorp | g2 | 24% [0–0] | 5% [0–0] | 11% [0–0] | 5% [0–1] |
| hamlet | crime | 0% [2–15] | 8% [15–26] | 3% [27–37] | 11% [38–89] |
| hamlet | g1 | 3% [0–0] | 3% [0–0] | 5% [0–0] | 11% [0–0] |
| hamlet | g2 | 3% [0–0] | 5% [0–0] | 3% [0–0] | 11% [0–1] |
| village | crime | 0% [3–14] | 5% [14–26] | 18% [27–41] | 5% [41–74] |
| village | g1 | 0% [0–0] | 8% [0–0] | 13% [0–0] | 8% [0–0] |
| village | g2 | 5% [0–0] | 14% [0–0] | 8% [0–2] | 3% [2–2] |
| town | crime | 5% [3–17] | 5% [17–38] | 26% [38–59] | 51% [60–100] |
| town | g1 | 18% [1–2] | 19% [2–3] | 29% [3–4] | 22% [4–7] |
| town | g2 | 16% [0–2] | 19% [2–2] | 37% [2–3] | 16% [3–3] |
| city | crime | 32% [3–21] | 57% [21–39] | 55% [39–71] | 51% [72–100] |
| city | g1 | 50% [1–4] | 49% [4–5] | 47% [5–6] | 49% [6–7] |
| city | g2 | 53% [0–2] | 46% [2–2] | 53% [2–3] | 43% [3–4] |
| metropolis | crime | 37% [4–28] | 59% [30–57] | 45% [58–82] | 41% [82–100] |
| metropolis | g1 | 53% [1–5] | 46% [5–5] | 45% [5–5] | 38% [5–6] |
| metropolis | g2 | 55% [0–2] | 49% [2–2] | 39% [2–3] | 38% [3–3] |
| ALL (place-weighted) | crime | 13.2% | | | 27.9% |
| ALL (place-weighted) | g1 | 24.1% | | | 22.5% |
| ALL (place-weighted) | g2 | 25.9% | | | 19.4% |

### guild_conflict

| size | read | Q1 (bottom) | Q2 | Q3 | Q4 (top) |
|---|---|---|---|---|---|
| thorp | crime | 0% [2–15] | 0% [15–29] | 0% [30–44] | 0% [44–84] |
| thorp | g1 | 0% [0–0] | 0% [0–0] | 0% [0–0] | 0% [0–0] |
| thorp | g2 | 0% [0–0] | 0% [0–0] | 0% [0–0] | 0% [0–1] |
| hamlet | crime | 0% [2–15] | 0% [15–26] | 0% [27–37] | 0% [38–89] |
| hamlet | g1 | 0% [0–0] | 0% [0–0] | 0% [0–0] | 0% [0–0] |
| hamlet | g2 | 0% [0–0] | 0% [0–0] | 0% [0–0] | 0% [0–1] |
| village | crime | 0% [3–14] | 3% [14–26] | 3% [27–41] | 0% [41–74] |
| village | g1 | 0% [0–0] | 3% [0–0] | 0% [0–0] | 3% [0–0] |
| village | g2 | 0% [0–0] | 0% [0–0] | 0% [0–2] | 5% [2–2] |
| town | crime | 50% [3–17] | 35% [17–38] | 16% [38–59] | 22% [60–100] |
| town | g1 | 34% [1–2] | 30% [2–3] | 32% [3–4] | 27% [4–7] |
| town | g2 | 37% [0–2] | 32% [2–2] | 18% [2–3] | 35% [3–3] |
| city | crime | 61% [3–21] | 51% [21–39] | 42% [39–71] | 49% [72–100] |
| city | g1 | 47% [1–4] | 54% [4–5] | 45% [5–6] | 57% [6–7] |
| city | g2 | 50% [0–2] | 46% [2–2] | 53% [2–3] | 54% [3–4] |
| metropolis | crime | 61% [4–28] | 46% [30–57] | 50% [58–82] | 46% [82–100] |
| metropolis | g1 | 37% [1–5] | 54% [5–5] | 53% [5–5] | 59% [5–6] |
| metropolis | g2 | 37% [0–2] | 43% [2–2] | 47% [2–3] | 76% [3–3] |
| ALL (place-weighted) | crime | 28.5% | | | 19.4% |
| ALL (place-weighted) | g1 | 19.7% | | | 24.3% |
| ALL (place-weighted) | g2 | 20.6% | | | 28.4% |

### The same, among the places where the law-1 gate is REACHED (quartiles re-taken within them)

crime_wave x crime among hasCriminal & viability (the crime coin, (a)); guild_conflict x g1 / g2 among g1 > 0 (the guild swap, (b)).

| size | kind x read | reached | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|---|---|
| thorp | crime_wave x crime | 21 | 100% [9–25] | 80% [26–31] | 80% [35–44] | 60% [44–56] |
| thorp | guild_conflict x g1 | 0 | —% [—–—] | —% [—–—] | —% [—–—] | —% [—–—] |
| thorp | guild_conflict x g2 | 0 | —% [—–—] | —% [—–—] | —% [—–—] | —% [—–—] |
| hamlet | crime_wave x crime | 10 | 67% [15–22] | 100% [23–36] | 100% [40–59] | 50% [62–65] |
| hamlet | guild_conflict x g1 | 0 | —% [—–—] | —% [—–—] | —% [—–—] | —% [—–—] |
| hamlet | guild_conflict x g2 | 0 | —% [—–—] | —% [—–—] | —% [—–—] | —% [—–—] |
| village | crime_wave x crime | 12 | 100% [25–27] | 100% [28–32] | 100% [33–40] | 67% [44–61] |
| village | guild_conflict x g1 | 0 | —% [—–—] | —% [—–—] | —% [—–—] | —% [—–—] |
| village | guild_conflict x g2 | 0 | —% [—–—] | —% [—–—] | —% [—–—] | —% [—–—] |
| town | crime_wave x crime | 68 | 41% [4–39] | 41% [40–59] | 47% [61–78] | 65% [78–100] |
| town | guild_conflict x g1 | 150 | 34% [1–2] | 30% [2–3] | 32% [3–4] | 27% [4–7] |
| town | guild_conflict x g2 | 150 | 37% [0–2] | 32% [2–2] | 18% [2–3] | 35% [3–3] |
| city | crime_wave x crime | 128 | 66% [5–27] | 56% [28–51] | 50% [51–76] | 56% [76–100] |
| city | guild_conflict x g1 | 150 | 47% [1–4] | 54% [4–5] | 45% [5–6] | 57% [6–7] |
| city | guild_conflict x g2 | 150 | 50% [0–2] | 46% [2–2] | 53% [2–3] | 54% [3–4] |
| metropolis | crime_wave x crime | 148 | 41% [4–30] | 59% [30–58] | 43% [59–82] | 41% [82–100] |
| metropolis | guild_conflict x g1 | 150 | 37% [1–5] | 54% [5–5] | 53% [5–5] | 59% [5–6] |
| metropolis | guild_conflict x g2 | 150 | 37% [0–2] | 43% [2–2] | 47% [2–3] | 76% [3–3] |

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

Errors: 0.
