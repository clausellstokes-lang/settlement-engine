THIS PAGE: tab overview, audience dm.
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
  [machine] historicalCharacter: Everything before the Occupation is referred to as 'the old settlement'. What exists now was built after, by different people, with different assumptions, over different rubble
  [badge] prosperity: Prosperous
  [badge] safetyLabel: Moderate
  [badge] readiness: Well-Defended
  [badge] foodSecurity: Secure
  [machine] arrivalScene: Rundgate is neither impressive nor disappointing from the approach. It is what it is, which is a working settlement of reasonable size doing reasonable things. A city, properly speaking: dense, layered, too large to take in at once. Steep roofs, enclosed craft yards, and carved lintels mark the older wards. A magelight lamp post marks the main gate. The cathedral bell tower is the first thing visible from this direction. Rundgate appears around a bend in the road, its walls and towers coming into view all at once.
  [machine] pressureSentence: Nora Jäger's relationship with Tangmar Werner is more complicated than their public roles suggest. A document each believed only they possessed has surfaced in a third set of hands.

THE LINES TO WRITE:
POOL "MARKET-OPEN" in block DS-GEN-13
  vid: 1
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the desk's whole reading bag rather than one reading; the pool's other rows name the readings its key actually turns on
    readings.isEntrepot = false (the engine's own field is `economicState.isEntrepot`)
    readings.tradeRouteAccess = "road" (the engine's own field is `config.tradeRouteAccess`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Market day is {settlement} at its truest: the roads bring the custom, and the custom is the argument for the stalls.
    notebook: none. Return an empty list.
POOL "GARRISONED" in block DS-GEN-17
  vid: 1
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.inst = "{hasAlchemist, hasBank, hasBlackMarket, hasCathedral, hasCharterHall, hasChurch, hasCourtSystem, hasCriminalInst, hasFreeCompany, hasGangInfra, hasGarrison, hasGates, hasGranary, hasGuild, hasHospital, hasMagesGuild, hasMagicInst, hasMarket, hasMercenary, hasMerchantGuild, hasMilitaryInst, hasMilitia, hasMonastery, hasNavy, hasPort, hasPrison, hasSmuggling, hasThievesGuild, hasWalls, hasWarehouse, hasWatch, hasWizardTower, names}" (the engine's own field is `economicState.compound.inst`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Armed order is part of {settlement}'s furniture; the town keeps professionals for its safety rather than trusting to luck and neighbours.
    notebook: none. Return an empty list.
POOL "prosperity: Comfortable / Prosperous" in block DS-GEN-3
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Rundgate"
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: People in {settlement} can afford to argue about things other than money.
    notebook: none. Return an empty list.
POOL "economicViability.viable: true" in block DS-GEN-3
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    {settlement} is "R" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.viable = true (the engine's own field is `economicViability.viable`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} expects to go on being {settlement}.
    notebook: none. Return an empty list.
POOL "defenseProfile.readiness.label: Well-Defended" in block DS-GEN-3
  vid: 1
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Rundgate"
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is defended properly rather than impressively: the works are sound and none of them are for show.
    notebook: none. Return an empty list.
POOL "scores.military: STRONG" in block DS-GEN-3
  vid: 1
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the loop variable of `SCORE_AXES.map((axis) => …)` in generalStateProse.js: a closed vocabulary of score axes, not a settlement field. THIS POOL'S OWN KEY NAMES THE AXIS, and every axis's score is in `readings.scores` above
    readings.scores = "{disaster: 76, economic: 73, internal: 50, magicDependency: false, magical: 49, military: 100, monster: 95, traditions: {5 keys}}" (the engine's own field is `defenseProfile.scores`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} can put a real body of armed men on its walls, and the men look like they have done it before.
    notebook: none. Return an empty list.
POOL "scores.monster: STRONG" in block DS-GEN-3
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the loop variable of `SCORE_AXES.map((axis) => …)` in generalStateProse.js: a closed vocabulary of score axes, not a settlement field. THIS POOL'S OWN KEY NAMES THE AXIS, and every axis's score is in `readings.scores` above
    readings.scores = "{disaster: 76, economic: 73, internal: 50, magicDependency: false, magical: 49, military: 100, monster: 95, traditions: {5 keys}}" (the engine's own field is `defenseProfile.scores`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Children in {settlement} are taught the rules about the dark early, and the rules work.
    notebook: none. Return an empty list.
POOL "scores.internal: ADEQUATE" in block DS-GEN-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the loop variable of `SCORE_AXES.map((axis) => …)` in generalStateProse.js: a closed vocabulary of score axes, not a settlement field. THIS POOL'S OWN KEY NAMES THE AXIS, and every axis's score is in `readings.scores` above
    readings.scores = "{disaster: 76, economic: 73, internal: 50, magicDependency: false, magical: 49, military: 100, monster: 95, traditions: {5 keys}}" (the engine's own field is `defenseProfile.scores`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The watch at {settlement} answers what is reported to it and does not seek out what is not.
    notebook: none. Return an empty list.
POOL "scores.economic: STRONG" in block DS-GEN-3
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the loop variable of `SCORE_AXES.map((axis) => …)` in generalStateProse.js: a closed vocabulary of score axes, not a settlement field. THIS POOL'S OWN KEY NAMES THE AXIS, and every axis's score is in `readings.scores` above
    readings.scores = "{disaster: 76, economic: 73, internal: 50, magicDependency: false, magical: 49, military: 100, monster: 95, traditions: {5 keys}}" (the engine's own field is `defenseProfile.scores`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Prices in {settlement} are steady in a way that suggests the town is not living on the last thing that sold.
    notebook: none. Return an empty list.
POOL "scores.magical: ADEQUATE" in block DS-GEN-3
  vid: 1
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says) — the loop variable of `SCORE_AXES.map((axis) => …)` in generalStateProse.js: a closed vocabulary of score axes, not a settlement field. THIS POOL'S OWN KEY NAMES THE AXIS, and every axis's score is in `readings.scores` above
    readings.scores = "{disaster: 76, economic: 73, internal: 50, magicDependency: false, magical: 49, military: 100, monster: 95, traditions: {5 keys}}" (the engine's own field is `defenseProfile.scores`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has somebody who can do what is usually needed and knows what is beyond them.
    notebook: none. Return an empty list.
POOL "foodSecurity.label: Secure" in block DS-GEN-3
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Rundgate"
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nobody in {settlement} thinks about food, which is the most that can be said for a town's food.
    notebook: none. Return an empty list.
POOL "ordinary (route road and the default)" in block DS-GEN-5
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is on the way to somewhere and has made a modest living out of being on the way.
    notebook: none. Return an empty list.
POOL "road" in block DS-GEN-6
  vid: 3
  stance: ledger · marks deficit
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.tradeRouteAccess = "road" (the engine's own field is `config.tradeRouteAccess`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What {settlement} cannot grow, the road brings, and the road is therefore not a convenience for this town but a condition of it.
    notebook: none. Return an empty list.
POOL "tier overlay: city" in block DS-GEN-6
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Rundgate"
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is big enough to have quarters that do not know each other.
    notebook: none. Return an empty list.
POOL "flagDriven count zero" in block DS-REL-2
  vid: 4
  stance: counterforce
  CAVEAT: this town's historical character names an occupation or a conquest while this key counts no tie the engine drove off a flag; the count is of the engine's own flags and not of the town's past, so write the key as the narrow count it is and read no wider denial out of it
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.relationships = "[24 rows]" (the engine's own field is `relationships`)
    readings.relationships.length = 24 (the engine's own field is `relationships.length`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has had pressures enough to bend its relationships and they have not bent; the ties here are what they would be anywhere.
    notebook: none. Return an empty list.