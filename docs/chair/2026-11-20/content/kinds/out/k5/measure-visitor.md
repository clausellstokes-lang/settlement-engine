# KINDS-2 K5 — the trouble law dark vs lit (the measure for the owner)

- **dark**: `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/visitor-lane.jsonl` — tree `/home/user/kinds2-k5` sha `bc9fbf495e7b4ecc00eb7b4949a8c1d675d43501` force `null` plan `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/plan-visitor.json` (sha256 `bcc138fc84e7f9b99ac2a8a05ef17b05e7da0fea1854e43ab910491ed4a63258`)
- **lit**: `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/visitor-lit.jsonl` — tree `/home/user/kinds2-k5` sha `bc9fbf495e7b4ecc00eb7b4949a8c1d675d43501` force `{"_troubleLawVersion":2}` plan `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/plan-visitor.json` (sha256 `bcc138fc84e7f9b99ac2a8a05ef17b05e7da0fea1854e43ab910491ed4a63258`)
- **table measured**: `{"crimeWave":{"floor":0.05,"ceiling":0.50,"readLow":20,"readHigh":90},"guildConflict":{"floor":0.05,"ceiling":0.25,"readLow":1,"readHigh":4},"smallPlaceCrime":{"floor":0.50,"ceiling":0.90,"readLow":15,"readHigh":60}}`

Every cell is dark → lit, by size (150 places each). Shares are of places (a kind counted once a place, any position).

## guild_conflict and crime_wave (% of places)

| size | guild_conflict | crime_wave |
|---|---|---|
| thorp | 0.0 → 0.0 | 2.7 → 2.0 |
| hamlet | 0.0 → 0.0 | 9.3 → 6.0 |
| village | 2.0 → 2.0 | 2.7 → 2.0 |
| town | 32.0 → 18.0 | 20.0 → 14.0 |
| city | 48.0 → 30.7 | 40.0 → 27.3 |
| metropolis | 47.3 → 31.3 | 60.0 → 30.7 |

## Every other kind at 10% or more of a size (either side)

| size | kinds (% dark → lit) |
|---|---|
| thorp | resource_scarcity 16.7 → 17.3; external_threat 14.0 → 14.0 |
| hamlet | resource_scarcity 21.3 → 22.0; legitimacy_crisis 10.7 → 10.7 |
| village | resource_scarcity 20.0 → 20.0; external_threat 12.0 → 12.0; heresy_trial 11.3 → 11.3 |
| town | resource_scarcity 14.0 → 14.7 |
| city | resource_scarcity 13.3 → 16.0; external_threat 10.7 → 11.3; magical_controversy 10.7 → 11.3; outside_debt 10.7 → 12.0; succession_crisis 9.3 → 12.0 |
| metropolis | legitimacy_crisis 11.3 → 14.0; corruption_scandal 10.0 → 11.3; succession_crisis 8.7 → 12.0; trade_dispute 7.3 → 10.7; plague_years 6.7 → 10.0 |

## Troubles a place

| size | no trouble | 0/1/2/3+ | distinct kinds | commonest FIRST trouble (share) |
|---|---|---|---|---|
| thorp | 0 → 0 | 0/141/9/0 → 0/141/9/0 | 25 → 25 | resource_scarcity 16.7% → resource_scarcity 17.3% |
| hamlet | 0 → 0 | 0/141/9/0 → 0/143/7/0 | 23 → 23 | resource_scarcity 21.3% → resource_scarcity 22.0% |
| village | 0 → 0 | 0/67/83/0 → 0/68/82/0 | 28 → 28 | resource_scarcity 17.3% → resource_scarcity 17.3% |
| town | 0 → 0 | 0/75/74/1 → 0/76/73/1 | 29 → 29 | guild_conflict 20.0% → crime_wave 12.7% |
| city | 0 → 0 | 0/0/69/81 → 0/0/69/81 | 29 → 29 | crime_wave 32.7% → crime_wave 17.3% |
| metropolis | 0 → 0 | 0/0/72/78 → 0/0/72/78 | 29 → 29 | crime_wave 56.0% → crime_wave 26.7% |

## What changed, by seed

| size | matched | record changed at all (hash) | trouble list changed | count down | count up | differs beyond history & the key (config / config+_config) | UP seeds |
|---|---|---|---|---|---|---|---|
| thorp | 150 | 150 | 1 | 0 | 0 | 150 / 1 | — |
| hamlet | 150 | 150 | 5 | 2 | 0 | 150 / 5 | — |
| village | 150 | 150 | 1 | 1 | 0 | 150 / 1 | — |
| town | 150 | 150 | 32 | 1 | 0 | 150 / 32 | — |
| city | 150 | 150 | 50 | 0 | 0 | 150 / 50 | — |
| metropolis | 150 | 150 | 71 | 0 | 0 | 150 / 71 | — |

## THE CALM CHECK (born with no trouble dark, gains one lit; must be 0): **0**

none

## Lit places differing from dark in anything OTHER than `history` and `config._troubleLawVersion`: **900**

- `_config`: 900
- `generationCoherenceReceipt`: 160
- `economicState`: 31
- `powerStructure`: 6

The record also carries the RAW config as `_config` (`steps/assembleSettlement.js`: `_config: { ...config }`), so the forced key appears there too. With `_config._troubleLawVersion` ALSO set aside: **160**

- `generationCoherenceReceipt`: 160
- `economicState`: 31
- `powerStructure`: 6

Errors: 0.
