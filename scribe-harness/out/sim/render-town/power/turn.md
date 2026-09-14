THIS PAGE: tab power, audience dm.
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

THE LINES TO WRITE:
POOL "Approved" in block DS-POW-1
  vid: 4
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "Guild Council" on this town
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {seat}'s standing at {settlement} is good and is doing work. The margin is what lets it spend goodwill on the decisions the town would otherwise refuse it.
    notebook: none. Return an empty list.
POOL "breakdown dominated by PROSPERITY, favourable" in block DS-POW-1
  vid: 3
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "Guild Council" on this town
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {seat}'s standing at {settlement} rests on the town's prosperity, which makes it exactly as durable as the prosperity is and no more.
    notebook: none. Return an empty list.
POOL "stable matched" in block DS-POW-2
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger doing business at {settlement} needs one name and gets one answer, and can plan a season ahead on the strength of it.
    notebook: none. Return an empty list.
POOL "recentConflict present" in block DS-POW-2
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    powerStructure.factions = "[5 rows]" (LIVE)
    powerStructure.recentConflict = "Guild Council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost." (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nobody at {settlement} needs the trouble explained to them; it is recent enough that the town simply refers to it and moves on.
    notebook: none. Return an empty list.
POOL "operation role money laundering" in block DS-POW-6
  vid: 3
  stance: counterforce
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The books of several houses at {settlement} are impeccable, and the impeccability is the service being purchased.
    notebook: none. Return an empty list.
POOL "layer DORMANT (no ledger materialized)" in block DS-POW-7
  vid: 2
  stance: street
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.politics ?? null.blocs = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are interests at {settlement} and there are no camps; a question is answered by whoever cares about that question.
    notebook: none. Return an empty list.
POOL "mixed" in block DS-POW-5
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town cannot say in one word what kind of place it is governed as, and neither can the hall.
    notebook: none. Return an empty list.
POOL "governing body name: a SLOT, never a baked noun" in block DS-POW-5
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town at {settlement} calls the hall by its proper title in public and something shorter everywhere else, and both usages are precise.
    notebook: none. Return an empty list.
POOL "riskLabel: Holding" in block DS-POW-4
  vid: 3
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: faction, seat, settlement
    {seat} is "Guild Council" on this town
    {settlement} is "Spitzplatz" on this town
    {faction} is "Guild Council" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {seat} at {settlement} holds because {faction} is still the heavier of the two, and the weighing is done again every season.
    notebook: none. Return an empty list.
POOL "legitimacyHold: public backing hardens the hold" in block DS-POW-4
  vid: 3
  stance: counterforce
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {settlement} is "Spitzplatz" on this town
    {seat} is "Guild Council" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).govMultiplier = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are people at {settlement} who would move on the {seat} and do not, because moving on a ruler the town is behind costs more than the seat is worth.
    notebook: none. Return an empty list.