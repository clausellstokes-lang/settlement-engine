THIS PAGE: tab economics, audience dm.
The town itself is the second block of the system prompt above and does not change
between tabs; everything below is this page and this page alone.

THE STATE THIS PAGE READS:
{
 "advanced": false,
 "calendar": null,
 "campaignEraEvents": 0,
 "foodStockpileLastTick": null,
 "renderYear": 471,
 "renderYearIsFrozen": true,
 "tick": null
}

THE PAGE AS THE READER MEETS IT
These lines are printed on the same page as yours.
A line of yours that denies one of them is refused; a line that agrees with the band where the
badge word differs is not (the two ladders).
  [badge] prosperity: Prosperous
  [machine] situationDesc: Trade proceeds at an ordinary pace for a settlement of this size.
  [badge] foodSecurity.label: Secure

THE LINES TO WRITE:
POOL "COMBINATION C1: a high rung on a working approach" in block DS-ECO-1
  vid: 1
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: access, complexity, settlement
    {settlement} is "Rundgate" on this town
    {access} is "road" on this town
    {complexity} is "spread of trades" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    prosperityRank(settlement.economicState.prosperity) = DERIVED: the engine computes this as `prosperityRank(settlement.economicState.prosperity)`, from `economicState.prosperity` = "Prosperous". Write from those values and give this reading no value of its own.
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
    A field reading UNKNOWN or DERIVED cannot carry a value of its own, and no
    absence may be read out of one.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger reads {settlement}'s standing off its {access} before anyone tells him: the traffic is steady, the {complexity} keeps more hands busy than the town strictly needs, and none of it looks improvised.
    notebook: none. Return an empty list.
POOL "INCOME MIX: two or three sources between them" in block DS-ECO-12
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.incomeSources = "[10 rows]"
    economicState.incomeSources.length = 10
    economicState.incomeSources.reduce = "[10 rows]" (the engine's own field is `economicState.incomeSources`)
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
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState = "{activeChains, compound, economicComplexity, foodSecurity, incomeSources, institutionalServices, isEntrepot, localProduction, necessityImports, primaryExports, primaryImports, priorities, prosperity, safetyProfile, situationDesc, tier, tradeAccess, tradeDependencies, transit}"
    economicState.isEntrepot = false
    economicState.localProduction = "[19 rows]"
    economicState.primaryExports = "[18 rows]"
    economicState.primaryImports = "[10 rows]"
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The market at {settlement} carries the town's own goods and other towns' goods on the same stalls, and does not distinguish them for a stranger's benefit.
    notebook: none. Return an empty list.
POOL "POSTURE: established" in block DS-ECO-10
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    readings.exportPosture.status = DERIVED: the engine computes this as `deriveExportPosture(settlement).status`. The card holds no input for it, so give this reading no value: what the engine decided about it is what the pool key and the page lines already say.
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
    A field reading UNKNOWN or DERIVED cannot carry a value of its own, and no
    absence may be read out of one.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The yards here are full of goods bound out and no two of them are the same. This is a town that sells.
    notebook: none. Return an empty list.
POOL "SECURE" in block DS-ECO-9
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} feeds itself with a small margin. The counts come out ahead by a little, every season, without much drama.
    notebook: none. Return an empty list.
POOL "STALLED" in block DS-GEN-18
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: institution, settlement
    {settlement} is "Rundgate" on this town
    {institution} is "Garrison" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the desk's whole reading bag rather than one reading; the pool's other rows name the readings its key actually turns on
    readings.activeChains = "[21 rows]" (the engine's own field is `economicState.activeChains`)
    readings.exploitation = "{}" (the engine's own field is `resourceAnalysis.exploitation`)
    readings.isEntrepot = false (the engine's own field is `economicState.isEntrepot`)
    readings.primaryImports = "[10 rows]" (the engine's own field is `economicState.primaryImports`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} keeps {institution} on a supply that has failed upstream; the building stands, the skill remains, and the books wait.
    notebook: none. Return an empty list.
POOL "TIER: minor shadow activity (≥3)" in block DS-ECO-6
  vid: 1
  stance: ledger · marks dm-only
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.blackMarketCapture = 8
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A little of {settlement}'s trade goes unrecorded, small enough to annoy the clerks and too small to change what the town is.
    notebook: none. This pool is marked `dm-only`: the unit itself is the archiver's private working note and is written in the notebook register the VOICE describes, and it still rides in `spine`.