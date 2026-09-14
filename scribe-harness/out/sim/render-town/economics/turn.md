THIS PAGE: tab economics, audience dm.
The town itself is the second block of the system prompt above and does not change
between tabs; everything below is this page and this page alone.

THE STATE THIS PAGE READS:
{
 "advanced": false,
 "calendar": null,
 "campaignEraEvents": 0,
 "foodStockpileLastTick": null,
 "renderYear": 184,
 "renderYearIsFrozen": true,
 "tick": null
}

THE PAGE AS THE READER MEETS IT
These lines are printed on the same page as yours.
A line of yours that denies one of them is refused; a line that agrees with the band where the
badge word differs is not (the two ladders).
  [badge] prosperity: Comfortable
  [machine] situationDesc: Trade proceeds at an ordinary pace for a settlement of this size.
  [badge] foodSecurity.label: Pressured

THE LINES TO WRITE:
POOL "COMBINATION C3: the middle rungs" in block DS-ECO-1
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: access, settlement
    {settlement} is "Spitzplatz" on this town
    {access} is "road" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    prosperityRank(settlement.economicState.prosperity) = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is nothing striking about {settlement}'s condition in either direction: a working {access}, a working market, a town neither building nor selling off.
    notebook: none. Return an empty list.
POOL "INCOME MIX: two or three sources between them" in block DS-ECO-12
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.incomeSources = "[10 rows]" (FROZEN)
    economicState.incomeSources.length = 10 (FROZEN)
    economicState.incomeSources.reduce = "{}" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Ask what this town lives on and you will be given a short list rather than an answer.
    notebook: none. Return an empty list.
POOL "TRADE PROFILE: exports and imports both present" in block DS-ECO-12
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState = "{activeChains, compound, economicComplexity, foodSecurity, incomeSources, institutionalServices, isEntrepot, localProduction, necessityImports, primaryExports, primaryImports, priorities, prosperity, safetyProfile, situationDesc, tier, tradeAccess, tradeDependencies, transit}" (LIVE)
    economicState.isEntrepot = false (FROZEN)
    economicState.localProduction = "[33 rows]" (FROZEN)
    economicState.primaryExports = "[12 rows]" (LIVE)
    economicState.primaryImports = "[6 rows]" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The market at {settlement} carries the town's own goods and other towns' goods on the same stalls, and does not distinguish them for a stranger's benefit.
    notebook: none. Return an empty list.
POOL "POSTURE: established" in block DS-ECO-10
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    readings.exportPosture.status = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is always something going out. If one trade is quiet, another is not.
    notebook: none. Return an empty list.
POOL "PRESSURED" in block DS-ECO-9
  vid: 3
  stance: threshold
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is not hungry and has no cushion. A shock to the fields or the road would be felt inside a season.
    notebook: none. Return an empty list.
POOL "STALLED" in block DS-GEN-18
  vid: 2
  stance: ledger
  CAVEAT: this pool's key names a departure (the word `stalled`) and not one of the readings behind it has a value on this card; write the key as the engine states it and assert nothing about what departed, when, or what it carried
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: institution, settlement
    {settlement} is "Spitzplatz" on this town
    {institution} is "Caravaneer's post" on this town
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
    spine: {settlement} keeps {institution} on a supply that has failed upstream; the building stands, the skill remains, and the books wait.
    notebook: none. Return an empty list.
POOL "TIER: minor shadow activity (≥3)" in block DS-ECO-6
  vid: 3
  stance: counterforce · marks dm-only
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.blackMarketCapture = 8 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What passes for a shadow economy here has never grown into one. There is unlicensed trade and nothing organised behind it.
    notebook: none. This pool is marked `dm-only`: the unit itself is the archiver's private working note and is written in the notebook register the VOICE describes, and it still rides in `spine`.