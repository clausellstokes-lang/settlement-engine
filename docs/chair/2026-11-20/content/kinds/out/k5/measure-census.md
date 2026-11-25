# KINDS-2 K5 — the trouble law dark vs lit (the measure for the owner)

- **dark**: `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/census-lane.jsonl` — tree `/home/user/kinds2-k5` sha `bc9fbf495e7b4ecc00eb7b4949a8c1d675d43501` force `null` plan `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/plan-census.json` (sha256 `bc6ef964f7d1e264694df4a5ffd521dd1b53509fcd4dc580ae9d351aef9d3781`)
- **lit**: `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/census-lit.jsonl` — tree `/home/user/kinds2-k5` sha `bc9fbf495e7b4ecc00eb7b4949a8c1d675d43501` force `{"_troubleLawVersion":2}` plan `/home/user/kinds2-k5/docs/chair/2026-11-20/content/kinds/out/k5/plan-census.json` (sha256 `bc6ef964f7d1e264694df4a5ffd521dd1b53509fcd4dc580ae9d351aef9d3781`)
- **table measured**: `{"crimeWave":{"floor":0.05,"ceiling":0.50,"readLow":20,"readHigh":90},"guildConflict":{"floor":0.05,"ceiling":0.25,"readLow":1,"readHigh":4},"smallPlaceCrime":{"floor":0.50,"ceiling":0.90,"readLow":15,"readHigh":60}}`

Every cell is dark → lit, by size (150 places each). Shares are of places (a kind counted once a place, any position).

## guild_conflict and crime_wave (% of places)

| size | guild_conflict | crime_wave |
|---|---|---|
| thorp | 0.0 → 0.0 | 4.7 → 2.7 |
| hamlet | 0.0 → 0.0 | 10.7 → 7.3 |
| village | 0.7 → 0.7 | 4.7 → 2.7 |
| town | 37.3 → 21.3 | 18.7 → 12.7 |
| city | 52.0 → 26.7 | 46.0 → 22.0 |
| metropolis | 47.3 → 32.7 | 56.0 → 32.0 |

## Every other kind at 10% or more of a size (either side)

| size | kinds (% dark → lit) |
|---|---|
| thorp | external_threat 16.0 → 16.0; resource_scarcity 12.7 → 12.7 |
| hamlet | external_threat 11.3 → 12.0; resource_scarcity 10.7 → 10.7 |
| village | resource_scarcity 16.0 → 16.7; external_threat 14.7 → 14.7 |
| town | resource_scarcity 12.0 → 14.7 |
| city | resource_scarcity 11.3 → 9.3; external_threat 10.0 → 14.0; plague_years 10.0 → 10.0; religious_tension 9.3 → 12.0; trade_dispute 9.3 → 11.3; outside_debt 8.7 → 11.3; magical_controversy 6.7 → 10.7 |
| metropolis | corruption_scandal 13.3 → 14.0; succession_crisis 9.3 → 12.0; trade_collapse 5.3 → 10.7 |

## Troubles a place

| size | no trouble | 0/1/2/3+ | distinct kinds | commonest FIRST trouble (share) |
|---|---|---|---|---|
| thorp | 0 → 0 | 0/143/7/0 → 0/145/5/0 | 22 → 22 | resource_scarcity 12.7% → external_threat 12.7% |
| hamlet | 0 → 0 | 0/141/9/0 → 0/142/8/0 | 25 → 25 | resource_scarcity 10.7% → resource_scarcity 10.7% |
| village | 0 → 0 | 0/62/88/0 → 0/62/88/0 | 28 → 28 | resource_scarcity 14.7% → resource_scarcity 15.3% |
| town | 0 → 0 | 0/68/79/3 → 0/69/78/3 | 27 → 29 | guild_conflict 19.3% → resource_scarcity 12.7% |
| city | 0 → 0 | 0/0/70/80 → 0/0/70/80 | 29 → 29 | crime_wave 39.3% → crime_wave 14.7% |
| metropolis | 0 → 0 | 0/0/73/77 → 0/0/73/77 | 29 → 29 | crime_wave 51.3% → crime_wave 26.7% |

## What changed, by seed

| size | matched | record changed at all (hash) | trouble list changed | count down | count up | differs beyond history & the key (config / config+_config) | UP seeds |
|---|---|---|---|---|---|---|---|
| thorp | 150 | 150 | 3 | 2 | 0 | 150 / 3 | — |
| hamlet | 150 | 150 | 5 | 1 | 0 | 150 / 5 | — |
| village | 150 | 150 | 4 | 0 | 0 | 150 / 4 | — |
| town | 150 | 150 | 37 | 1 | 0 | 150 / 37 | — |
| city | 150 | 150 | 75 | 0 | 0 | 150 / 75 | — |
| metropolis | 150 | 150 | 66 | 0 | 0 | 150 / 66 | — |

## THE CALM CHECK (born with no trouble dark, gains one lit; must be 0): **0**

none

## Lit places differing from dark in anything OTHER than `history` and `config._troubleLawVersion`: **900**

- `_config`: 900
- `generationCoherenceReceipt`: 190
- `economicState`: 40
- `powerStructure`: 7

The record also carries the RAW config as `_config` (`steps/assembleSettlement.js`: `_config: { ...config }`), so the forced key appears there too. With `_config._troubleLawVersion` ALSO set aside: **190**

- `generationCoherenceReceipt`: 190
- `economicState`: 40
- `powerStructure`: 7

Errors: 0.
