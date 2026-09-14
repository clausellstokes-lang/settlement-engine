THIS PAGE: tab overview, audience dm.
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

THE PAGE AS THE READER MEETS IT
These lines are printed on the same page as yours.
A line of yours that denies one of them is refused; a line that agrees with the band where the
badge word differs is not (the two ladders).
  [machine] historicalCharacter: A settlement whose great advantage is that nothing has ever forced it to become anything in particular. It has kept its options, its neighbours, and its temper, and it regards all three as achievements, correctly, though few visitors see why
  [badge] crisis.label: Beast & Raider Threat
  [machine] crisis.summary: Something in the surrounding region has grown bolder. Caravans are disappearing. A farmstead burned last week. Whether wolves, raiders, or worse. The settlement's defences are adequate for normal times, but these are not normal times.
  [machine] crisis.hook: The attacks are following a pattern that suggests coordination, not desperation. Someone is directing this (whether a rival lord, a beast of unusual cunning, or something stranger). The evidence is there for anyone who looks carefully.
  [badge] prosperity: Poor
  [badge] safetyLabel: Dangerous — Monster Threat
  [badge] readiness: Vulnerable
  [badge] foodSecurity: Secure
  [machine] arrivalScene: Warmholz buys arrows. The fletcher's is the busiest shop in the settlement, and the militia board outside the gate lists a standing bounty in terms that carefully avoid naming what it is for. A dozen buildings around a central green, most of them old. Half-timbered upper floors project above the busier lanes. A magelight lamp post marks the main gate. A mile marker, then a second, then the outlying farms of Warmholz begin. The settlement proper is still a quarter hour ahead.
  [machine] pressureSentence: Warmholz has drawn its edges inward (fields left unworked, a mill standing idle) trading the charcoal it needs for a perimeter the able-bodied can actually hold.

THE LINES TO WRITE:
POOL "NO-MARKET" in block DS-GEN-13
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.isEntrepot = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.tradeRouteAccess = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing in {settlement} is arranged for buying and selling in quantity, which tells a stranger the essential thing about the place.
    notebook: none. Return an empty list.
POOL "BARE" in block DS-GEN-17
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.inst = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing in {settlement} is official that could instead be somebody's job on the side.
    notebook: none. Return an empty list.
POOL "BEAST & RAIDER THREAT" in block DS-STR-1
  vid: 5
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has pulled its stock and its people inward, and the ground it has given up is on the rolls as abandoned.
    notebook: none. Return an empty list.
POOL "Overview's own section framing" in block DS-STR-1
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: (none)
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing here is urgent. The town's difficulties are chronic rather than acute, and it has the room to work on them.
    notebook: none. Return an empty list.
POOL "SEVERITY: critical" in block DS-CND-1
  vid: 2
  stance: threshold
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    Array.isArray(readings.conditions) ? readings.conditions :  = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: This is as far as {settlement} bends. Past this it is not the same settlement, and it is very near past this.
    notebook: none. Return an empty list.
POOL "DIRECTION: worsening" in block DS-CND-1
  vid: 1
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V2` — `PRESENT then CONSEQUENCE` (state key + a STRUCTURAL-consequence field); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    Array.isArray(readings.conditions) ? readings.conditions :  = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: It is getting worse, steadily rather than suddenly; each season costs a little more than the one before.
    notebook: none. Return an empty list.
POOL "prosperity: Struggling / Poor" in block DS-GEN-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Warmholz" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s year closes near enough to level that the closing is watched.
    notebook: none. Return an empty list.
POOL "safetyProfile.safetyLabel: head word in {Dangerous, Desperate}" in block DS-GEN-3
  vid: 3
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What the watch at {settlement} records is a fraction of what happens, and the fraction is not chosen by the watch.
    notebook: none. Return an empty list.
POOL "economicViability.viable: true" in block DS-GEN-3
  vid: 4
  stance: threshold
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.viable = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} works on the terms it currently has, and the judgment is about those terms rather than about the town.
    notebook: none. Return an empty list.
POOL "defenseProfile.readiness.label: Vulnerable" in block DS-GEN-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Warmholz" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has less between itself and trouble than a town this size ought to.
    notebook: none. Return an empty list.
POOL "scores.military: CRITICAL" in block DS-GEN-3
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.scores = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What protects {settlement} is that nobody has wanted it, and everyone here understands the arrangement.
    notebook: none. Return an empty list.
POOL "scores.monster: CRITICAL" in block DS-GEN-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.scores = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has no answer to what lives beyond its fields and nobody whose work it would be.
    notebook: none. Return an empty list.
POOL "scores.internal: WEAK" in block DS-GEN-3
  vid: 1
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.scores = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is more going on in {settlement} than the watch troubles itself with, and it is not hidden particularly well.
    notebook: none. Return an empty list.
POOL "scores.economic: WEAK" in block DS-GEN-3
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.scores = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is nothing spare in {settlement}, and the absence of spare is what a careful eye notices first.
    notebook: none. Return an empty list.
POOL "scores.magical: CRITICAL" in block DS-GEN-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    axis = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.scores = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} keeps no practitioner, no arrangement, and no expectation of either.
    notebook: none. Return an empty list.
POOL "foodSecurity.label: Secure" in block DS-GEN-3
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Warmholz" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nobody in {settlement} thinks about food, which is the most that can be said for a town's food.
    notebook: none. Return an empty list.
POOL "road" in block DS-GEN-6
  vid: 2
  stance: street · marks no deficit
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.tradeRouteAccess = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is here because somebody, once, found this a reasonable distance from the last place.
    notebook: none. Return an empty list.
POOL "tier overlay: thorp / hamlet" in block DS-GEN-6
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Warmholz" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is a handful of roofs with a reason, and the reason is usually the ground.
    notebook: none. Return an empty list.
POOL "flagDriven count zero" in block DS-REL-2
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V3|V8` — `PRESENT then ABSENCE` (state key + a `none-exists` field (the LACK) | state key + a `not-held` field with provenance (the GAP)); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.relationships = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.relationships.length = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The people of {settlement} are connected the way the people of any settled place are connected, and there is no more to say about it than that.
    notebook: none. Return an empty list.
POOL "structuralSuggestions[]" in block DS-GEN-7
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.structuralSuggestions = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    readings.structuralSuggestions.length = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A careful reader of {settlement} finds one loose end, and it is the kind that a single institution would tie off.
    notebook: none. Return an empty list.