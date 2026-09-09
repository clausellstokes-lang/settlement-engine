# L-PROBE-2 cheap-arm comparison over 6 tips: 899-control → 900-desk → 901-lightdark → 902-osr18 → 903-litdefault → 904-tip

## (g) 52-tick pulse hashes per preset — which hash fields moved between consecutive tips
| step | preset | moved fields | observedTicks | epochLit |
|---|---|---|---|---|
| 902-osr18→903-litdefault | realistic_regional | resultHash, worldStateHash, regionalGraphHash, wizardNewsHash | 52→52 | False→False |

Unmoved across every step: dramatic_campaign, full_simulation, living_realm, narrative_campaign, quiet_local, static_campaign

## (f) REAL-birth fixtures per preset — hash / key counts / lit counts
| step | preset | hash moved | resolvedRuleKeyCount | litBooleanCount | darkBooleanCount | keys added | keys removed | value changes |
|---|---|---|---|---|---|---|---|---|
| 902-osr18→903-litdefault | realistic_regional | True | 37→58 | 12→33 | 13→13 | allyIntelSharingEnabled, commodityFlowEnabled, constructiveFlowsEnabled, disastersEnabled, distancePricedNewsEnabled, interventionEnabled, momentumEnabled, navalEnabled, npcGrowthEnabled, npcLadderEnabled, peaceEngineEnabled, provenanceLedgerEnabled, reframeEnabled, resourceDynamicsEnabled, roadsEnabled, settlementLifecycleEnabled, spatialConsequenceEnabled, supplyWebWarfareEnabled, traditionsEnabled, upswingArcsEnabled, urbanFabricEnabled | — | — |

defaultRuleKeyCount per tip: 899-control=36, 900-desk=36, 901-lightdark=36, 902-osr18=36, 903-litdefault=36, 904-tip=36

## (d) lighting-census tuple (live) per tip
| tip | files | parked | credited | titles | suiteTitles | verdict |
|---|---|---|---|---|---|---|
| 899-control | 2523 | 371 | 2152 | 23204 | 6217 | LIVE == FROZEN (no refreeze owed at this |
| 900-desk | 2537 | 373 | 2164 | 23555 | 6302 | LIVE == FROZEN (no refreeze owed at this |
| 901-lightdark | 2543 | 373 | 2170 | 23653 | 6333 | LIVE == FROZEN (no refreeze owed at this |
| 902-osr18 | 2543 | 373 | 2170 | 23653 | 6333 | LIVE == FROZEN (no refreeze owed at this |
| 903-litdefault | 2543 | 373 | 2170 | 23653 | 6333 | LIVE == FROZEN (no refreeze owed at this |
| 904-tip | 2543 | 373 | 2170 | 23653 | 6333 | LIVE == FROZEN (no refreeze owed at this |

## (e) stability rosters — sizes and lit counts per tip
- 899-control: sizes {'WAR_DEPTH_FLAGS': 8, 'ENGINE_WAVE_FLAGS': 9, 'ONE_REGEN_FLAGS': 9, 'LEGACY_PRESET_IDS': 3, 'CL0_PRESET_IDS': 4, 'WORLD_ALIVE_PRESET_IDS': 3, 'WAVE_DARK_PRESET_IDS': 4} · litCounts {'WAR_DEPTH_FLAGS': {'flags': 8, 'litSomewhere': 8, 'darkEverywhere': 0}, 'ENGINE_WAVE_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}, 'ONE_REGEN_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}}
- 900-desk: sizes {'WAR_DEPTH_FLAGS': 8, 'ENGINE_WAVE_FLAGS': 9, 'ONE_REGEN_FLAGS': 9, 'LEGACY_PRESET_IDS': 3, 'CL0_PRESET_IDS': 4, 'WORLD_ALIVE_PRESET_IDS': 3, 'WAVE_DARK_PRESET_IDS': 4} · litCounts {'WAR_DEPTH_FLAGS': {'flags': 8, 'litSomewhere': 8, 'darkEverywhere': 0}, 'ENGINE_WAVE_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}, 'ONE_REGEN_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}}
- 901-lightdark: sizes {'WAR_DEPTH_FLAGS': 8, 'ENGINE_WAVE_FLAGS': 9, 'ONE_REGEN_FLAGS': 9, 'LEGACY_PRESET_IDS': 3, 'CL0_PRESET_IDS': 4, 'WORLD_ALIVE_PRESET_IDS': 3, 'WAVE_DARK_PRESET_IDS': 4} · litCounts {'WAR_DEPTH_FLAGS': {'flags': 8, 'litSomewhere': 8, 'darkEverywhere': 0}, 'ENGINE_WAVE_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}, 'ONE_REGEN_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}}
- 902-osr18: sizes {'WAR_DEPTH_FLAGS': 8, 'ENGINE_WAVE_FLAGS': 9, 'ONE_REGEN_FLAGS': 9, 'LEGACY_PRESET_IDS': 3, 'CL0_PRESET_IDS': 4, 'WORLD_ALIVE_PRESET_IDS': 3, 'WAVE_DARK_PRESET_IDS': 4} · litCounts {'WAR_DEPTH_FLAGS': {'flags': 8, 'litSomewhere': 8, 'darkEverywhere': 0}, 'ENGINE_WAVE_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}, 'ONE_REGEN_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}}
- 903-litdefault: sizes {'WAR_DEPTH_FLAGS': 8, 'ENGINE_WAVE_FLAGS': 9, 'ONE_REGEN_FLAGS': 9, 'LEGACY_PRESET_IDS': 3, 'CL0_PRESET_IDS': 4, 'WORLD_ALIVE_PRESET_IDS': 3, 'WAVE_DARK_PRESET_IDS': 3} · litCounts {'WAR_DEPTH_FLAGS': {'flags': 8, 'litSomewhere': 8, 'darkEverywhere': 0}, 'ENGINE_WAVE_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}, 'ONE_REGEN_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}}
- 904-tip: sizes {'WAR_DEPTH_FLAGS': 8, 'ENGINE_WAVE_FLAGS': 9, 'ONE_REGEN_FLAGS': 9, 'LEGACY_PRESET_IDS': 3, 'CL0_PRESET_IDS': 4, 'WORLD_ALIVE_PRESET_IDS': 3, 'WAVE_DARK_PRESET_IDS': 3} · litCounts {'WAR_DEPTH_FLAGS': {'flags': 8, 'litSomewhere': 8, 'darkEverywhere': 0}, 'ENGINE_WAVE_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}, 'ONE_REGEN_FLAGS': {'flags': 9, 'litSomewhere': 9, 'darkEverywhere': 0}}
  - 902-osr18→903-litdefault WAVE_DARK_PRESET_IDS: +[] −['realistic_regional']

## STOP arm 1 — eager?
899-control=LAZY — clear (closure 237), 900-desk=LAZY — clear (closure 235), 901-lightdark=LAZY — clear (closure 235), 902-osr18=LAZY — clear (closure 235), 903-litdefault=LAZY — clear (closure 235), 904-tip=LAZY — clear (closure 235)

## (c) OSR per-parent presence — counts per tip, and shapes crossing MIN_ROWS between tips
| tip | parents | shapes | shapes ≥ MIN_ROWS | shapes < MIN_ROWS | simulationFlagsLit | shapeCount(meta) |
|---|---|---|---|---|---|---|
| 899-control | 8558 | 1299 | 337 | 962 | 80 | 1299 |
| 900-desk | 8560 | 1299 | 337 | 962 | 81 | 1299 |
| 901-lightdark | 8560 | 1299 | 337 | 962 | 81 | 1299 |
| 902-osr18 | 8560 | 1299 | 337 | 962 | 81 | 1299 |
| 903-litdefault | 8560 | 1299 | 337 | 962 | 81 | 1299 |
| 904-tip | 8560 | 1299 | 337 | 962 | 81 | 1299 |
- 899-control→900-desk: shapes new 0 gone 0 crossing-MIN_ROWS flips 0 key-set changes 9 — keyset: ['_config', 'factions', 'incomeSources', 'issues', 'members', 'npcs', 'simulationRules', 'stress']
- 900-desk→901-lightdark: shapes new 0 gone 0 crossing-MIN_ROWS flips 0 key-set changes 0
- 901-lightdark→902-osr18: shapes new 0 gone 0 crossing-MIN_ROWS flips 0 key-set changes 0
- 902-osr18→903-litdefault: shapes new 0 gone 0 crossing-MIN_ROWS flips 0 key-set changes 0
- 903-litdefault→904-tip: shapes new 0 gone 0 crossing-MIN_ROWS flips 0 key-set changes 0
