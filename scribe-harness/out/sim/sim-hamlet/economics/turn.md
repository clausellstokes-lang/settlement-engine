THIS PAGE: tab economics, audience dm.
The town itself is the second block of the system prompt above and does not change
between tabs; everything below is this page and this page alone.

THE STATE THIS PAGE READS:
{
 "advanced": false,
 "calendar": null,
 "campaignEraEvents": 0,
 "foodStockpileLastTick": null,
 "renderYear": 60,
 "renderYearIsFrozen": true,
 "tick": null
}

THE LINES TO WRITE:
POOL "COMBINATION C4: a low rung on a working approach" in block DS-ECO-1
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    prosperityRank(settlement.economicState.prosperity) = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The roads into this town are busy and the town is poor, which is the complaint a visitor will hear first and hear most.
    notebook: none. Return an empty list.
POOL "INCOME MIX: one source carries the town" in block DS-ECO-12
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.incomeSources = "[3 rows]" (FROZEN)
    economicState.incomeSources.length = 3 (FROZEN)
    economicState.incomeSources.reduce = "{}" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is one thing this town does for money, and everybody's living is downstream of it whether or not they work in it.
    notebook: none. Return an empty list.
POOL "TRADE PROFILE: exports and imports both present" in block DS-ECO-12
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState = "{activeChains, compound, economicComplexity, foodSecurity, incomeSources, institutionalServices, isEntrepot, localProduction, necessityImports, primaryExports, primaryImports, priorities, prosperity, safetyProfile, situationDesc, tier, tradeAccess, tradeDependencies, transit}" (LIVE)
    economicState.isEntrepot = false (FROZEN)
    economicState.localProduction = "[7 rows]" (FROZEN)
    economicState.primaryExports = "[7 rows]" (LIVE)
    economicState.primaryImports = "[2 rows]" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Everybody here knows what leaves and what arrives, because the same carts do both.
    notebook: none. Return an empty list.
POOL "POSTURE: established" in block DS-ECO-10
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.exportPosture.status = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} sells several things outward and depends on none of them alone. The export column is broad enough to lose a line without losing the trade.
    notebook: none. Return an empty list.
POOL "SECURE" in block DS-ECO-9
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} feeds itself with a small margin. The counts come out ahead by a little, every season, without much drama.
    notebook: none. Return an empty list.
POOL "BOUGHT-IN" in block DS-GEN-18
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V4` — `OBJECT then PRESENT` (a named object + the state key); keep that order in your spine.
  slots you may use: good, settlement
    {settlement} is "Warmholz" on this town
    {good} is "salt" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.activeChains = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.exploitation = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.isEntrepot = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.primaryImports = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} works {good} it cannot raise; the town buys its feedstock the way other towns grow it, and the buying is a settled part of the craft.
    notebook: none. Return an empty list.