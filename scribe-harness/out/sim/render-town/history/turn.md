THIS PAGE: tab history, audience dm.
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
  [machine] The Flood: Waters rose with little warning and reshaped the mill and lumber district, drowning livelihoods and redrawing who owned what
  [machine] The Trade Collapse: The overland trade that had made the settlement what it was collapsed, and the prosperity it once brought bled away over a handful of lean years
  [machine] The Economic Divide: Growing wealth gap between merchant class and common laborers creates resentment
  [machine] The Occupation: An occupation had ended years before, yet those who collaborated and those who resisted still lived as neighbours, the reckoning never made
  [machine] The Purge: Fear of hidden infiltrators (not always unfounded) bred denunciations and a climate of mistrust
  [machine] The Migration: A recently arrived group and the established population fell into sustained, low-level conflict
  [machine] The Arcane Incident: Debate over the role and regulation of magic divided the community

THE LINES TO WRITE:
POOL "FOUNDED-OLD" in block DS-GEN-14
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.history && typeof readings.history === 'object' ? readings.history : {} = "{age: 184, currentTensions: [2 rows], eventsTimeline: [7 rows], founding: {6 keys}, historicalCharacter: \"The Occupation did not just change what happened next; it changed what the settlement beli (cut)\", historicalEvents: [7 rows], legacyAnnotations: [3 rows], siegeNarrative: null}" (the engine's own field is `history`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town's first reason is on record and its present shape is the record of everything since; {settlement} is the argument and all its revisions at once.
    notebook: none. Return an empty list.
POOL "LAYERED-ANCHORED" in block DS-GEN-16
  vid: 1
  stance: elder
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    Array.isArray(hist.historicalEvents) ? hist.historicalEvents :  = "[7 rows]" (the engine's own field is `history.historicalEvents`)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s record is a stack of hard seasons survived in order, and the record still marks each of them as bearing on the town.
    notebook: none. Return an empty list.
POOL "founding" in block DS-GEN-9
  vid: 4
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The oldest part of {settlement} still shows what the town was for when it started, which is not always what it is for now.
    notebook: none. Return an empty list.
POOL "historicalCharacter" in block DS-GEN-9
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What {settlement} is like takes a stranger a day to notice and a season to believe.
    notebook: none. Return an empty list.
POOL "event type: magical" in block DS-GEN-9
  vid: 2
  stance: ledger · marks anchored
  THE ORDER: the corpus spine realises the move order `V7` — `HISTORY then PRESENT` (R2 only: event provenance + the state key, the joint chosen); keep that order in your spine.
  slots you may use: event, settlement
    {settlement} is "Spitzplatz" on this town
    {event} is "The Arcane Incident" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} still keeps rules written after {event}, and the rules are specific in a way that suggests they were written by people who were there.
    notebook: none. Return an empty list.
POOL "recency framing: Living memory" in block DS-GEN-9
  vid: 1
  stance: elder
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    significantEvent(events).yearsAgo = DERIVED: the engine computes this as `significantEvent(events).yearsAgo`. The card holds no input for it, so give this reading no value: what the engine decided about it is what the pool key and the page lines already say.
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
    A field reading UNKNOWN or DERIVED cannot carry a value of its own, and no
    absence may be read out of one.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are people in {settlement} who were there, and their account is not quite the town's account.
    notebook: none. Return an empty list.