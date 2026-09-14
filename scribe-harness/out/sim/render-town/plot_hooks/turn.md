THIS PAGE: tab plot_hooks, audience dm.
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
  [machine] npc: A spy they turned is now being turned back, and feeding information in both directions.
  [machine] economics: Settlement is starving. Desperate villagers might turn to banditry, or a merchant offers to supply food... at a terrible price (debt servitude? dark pact?).
  [machine] npc: They've been meeting privately with someone from outside the settlement whose identity they won't disclose.
  [machine] npc: They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need.
  [machine] faction: A neutral figure is being pressured by both The Governing Council and The Order of the Watch to take a side before the next council session.
  [machine] faction: Evidence has surfaced suggesting a third party is deliberately escalating the tension between the two factions.
  [machine] history: Old records suggest a series of 'accidents' targeting newcomers is being attributed to chance
  [machine] history: An archivist's notes from that period reveal the newcomers fled something, and that something has sent agents after them
  [machine] history: An anti-magic agitator is secretly using magic themselves
  [machine] tension: The evidence that convicted the heretic was fabricated, and a witness is finally willing to say so
  [machine] tension: The condemned doctrine is quietly practised still, by more of the town's leaders than would admit it
  [machine] tension: A relic seized during the trial never reached the temple vault it was bound for
  [machine] tension: A collaborator family's wartime fortune was built on betrayals that are finally surfacing
  [machine] tension: Resistance fighters kept records that would expose people still in power
  [machine] tension: A former occupier officer has returned under a false identity
  [machine] relationship: A decision coming in the next season will advantage one significantly. The other knows this.
  [machine] relationship: A document each believed only they possessed has surfaced in a third set of hands.
  [machine] relationship: A third party has learned what the original favour was. The debt just changed hands.
  [machine] relationship: A younger relative has begun trading on the connection both of them refuse to use.
  [machine] relationship: Nanthild Huber has begun to act like someone who considers the debt paid. Hans Fischbach does not.
  [machine] relationship: Mechthild Wolf has begun to act like someone who considers the debt paid. Liutbirg Krüger does not.
  [machine] relationship: Berchta Schmidt is about to call it in.
  [machine] relationship: A third party has asked Berchta Schmidt, quietly, whether Liutbirg Krüger can be trusted. The answer took too long.
  [machine] relationship: Karl Berger is about to call it in.
  [machine] relationship: A third party is actively working to change that calculation.
  [machine] relationship: A mutual patron has let it be known there is room for only one of them at the next table.
  [machine] npc: They received a directive from the hierarchy that contradicts their own theology. Compliance is expected.
  [machine] npc: They have been asked to perform a ceremony they have theological objections to. The person asking has leverage.
  [machine] npc: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.
  [machine] npc: One of their most reliable suppliers has gone dark. The goods are still arriving. Someone else is sending them.
  [machine] npc: Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.
  [machine] npc: They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.

THE LINES TO WRITE:
POOL "category npc: the people are the opening" in block DS-HK-1
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s open questions sit with particular people rather than with offices, which is what makes them approachable.
    notebook: none. Return an empty list.
POOL "category economics: the books are the opening" in block DS-HK-1
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is short of something specific, and being short of something specific is the most tractable kind of difficulty a town can have.
    notebook: none. Return an empty list.
POOL "category faction: the blocs are the opening" in block DS-HK-1
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing in {settlement} gets decided by one person, which means everything in {settlement} can be influenced.
    notebook: none. Return an empty list.
POOL "category history: the past is the opening" in block DS-HK-1
  vid: 1
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has business with its own past that has not finished, and the unfinished parts are on the record rather than in dispute.
    notebook: none. Return an empty list.
POOL "category tension: the standing quarrels are the opening" in block DS-HK-1
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s difficulties are recorded, chronic and unresolved, which is a different opportunity from a crisis.
    notebook: none. Return an empty list.
POOL "category relationship: the ties are the opening" in block DS-HK-1
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s ties are dense enough that a favour asked of one person reaches three, and everyone here knows which three.
    notebook: none. Return an empty list.
POOL "clock smuggling_rise" in block DS-HK-1
  vid: 3
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s revenue depends on trade passing where it can be counted, and less of it is passing there.
    notebook: none. Return an empty list.