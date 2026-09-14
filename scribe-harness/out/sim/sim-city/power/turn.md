THIS PAGE: tab power, audience dm.
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

THE LINES TO WRITE:
POOL "Approved" in block DS-POW-1
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "City Council" on this town
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {seat} at {settlement} governs with a modest edge in its favour; where it asks it is generally given, and the exceptions are few enough that the clerks can name them.
    notebook: none. Return an empty list.
POOL "breakdown dominated by PROSPERITY, favourable" in block DS-POW-1
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {settlement} is "Rundgate" on this town
    {seat} is "City Council" on this town
    {seat} is "City Council" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} credits the {seat} with the good years whether or not the {seat} earned them; the prosperity is the whole of the argument in its favour.
    notebook: none. Return an empty list.
POOL "stable matched" in block DS-POW-2
  vid: 4
  stance: threshold
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What is settled at {settlement} is the hall and only the hall; the town's steadiness is a statement about who answers, and not about what the answers will be.
    notebook: none. Return an empty list.
POOL "recentConflict present" in block DS-POW-2
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    powerStructure.factions = "[7 rows]" (LIVE)
    powerStructure.recentConflict = "City Council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost." (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nobody at {settlement} needs the trouble explained to them; it is recent enough that the town simply refers to it and moves on.
    notebook: none. Return an empty list.
POOL "operation role criminal revenue stream (unclassified)" in block DS-POW-6
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is criminal infrastructure at {settlement} with local weight, territorial or economic, and no clearer description of it than that.
    notebook: none. Return an empty list.
POOL "layer DORMANT (no ledger materialized)" in block DS-POW-7
  vid: 1
  stance: ledger
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.politics ?? null.blocs = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The hall at {settlement} is not organized into sides. The factions sit as factions, and nothing binds any two of them into anything larger.
    notebook: none. Return an empty list.
POOL "council" in block DS-POW-5
  vid: 3
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "City Council" on this town
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What the {seat} at {settlement} watches for is the town's own temper. A council falls to unrest rather than to a rival, and it knows it.
    notebook: none. Return an empty list.
POOL "governing body name: a SLOT, never a baked noun" in block DS-POW-5
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {seat} is "City Council" on this town
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger who addresses the {seat} at {settlement} by any other title is corrected, politely and immediately.
    notebook: none. Return an empty list.
POOL "riskLabel: Holding" in block DS-POW-4
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: faction, seat, settlement
    {faction} is "City Council" on this town
    {seat} is "City Council" on this town
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {faction} outweighs everyone who wants the {seat} at {settlement}, and the wanting is on the record. The hold is real and it is not comfortable.
    notebook: none. Return an empty list.
POOL "legitimacyHold: public backing hardens the hold" in block DS-POW-4
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {settlement} is "Rundgate" on this town
    {seat} is "City Council" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).govMultiplier = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Public backing at {settlement} is hardening the {seat}'s grip; what would be a contest elsewhere is an inconvenience here.
    notebook: none. Return an empty list.