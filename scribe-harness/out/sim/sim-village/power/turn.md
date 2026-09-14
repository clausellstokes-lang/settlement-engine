THIS PAGE: tab power, audience dm.
The town itself is the second block of the system prompt above and does not change
between tabs; everything below is this page and this page alone.

THE STATE THIS PAGE READS:
{
 "advanced": false,
 "calendar": null,
 "campaignEraEvents": 0,
 "foodStockpileLastTick": null,
 "renderYear": 111,
 "renderYearIsFrozen": true,
 "tick": null
}

THE LINES TO WRITE:
POOL "Tolerated" in block DS-POW-1
  vid: 4
  stance: counterforce
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {seat} is "Elected Reeve" on this town
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {seat} at {settlement} has neither the town's backing nor its hostility, so it can rule but it cannot spend. A hard decision here would have to be paid for out of an empty purse.
    notebook: none. Return an empty list.
POOL "breakdown dominated by PROSPERITY, favourable" in block DS-POW-1
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "Elected Reeve" on this town
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {seat} at {settlement} is well thought of and the reason is in the accounts: the town is doing well, and a town doing well rarely looks hard at who is arranging it.
    notebook: none. Return an empty list.
POOL "stable matched" in block DS-POW-2
  vid: 1
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: faction, settlement
    {settlement} is "Hochhausen" on this town
    {faction} is "Elected Reeve" on this town
    {faction} is "Elected Reeve" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The hall at {settlement} is settled. {faction} holds it, the town expects {faction} to go on holding it, and business is conducted on that expectation.
    notebook: none. Return an empty list.
POOL "governing faction holds a NARROW plurality" in block DS-POW-2
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: faction, settlement
    {faction} is "Elected Reeve" on this town
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {faction} holds the hall at {settlement} because it is first and not because it is large; the town treats the arrangement as current rather than settled.
    notebook: none. Return an empty list.
POOL "layer DORMANT (no ledger materialized)" in block DS-POW-7
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.politics ?? null.blocs = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are interests at {settlement} and there are no camps; a question is answered by whoever cares about that question.
    notebook: none. Return an empty list.
POOL "mixed" in block DS-POW-5
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {settlement} is "Hochhausen" on this town
    {seat} is "Elected Reeve" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing at {settlement} governs cleanly. The {seat} is an arrangement between kinds of power, and it decides at the pace of whichever of them is least willing.
    notebook: none. Return an empty list.
POOL "governing body name: a SLOT, never a baked noun" in block DS-POW-5
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {settlement} is "Hochhausen" on this town
    {seat} is "Elected Reeve" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What governs {settlement} calls itself the {seat}, and the name is precise about the town's size and pretensions in a way outsiders routinely mistake.
    notebook: none. Return an empty list.
POOL "riskLabel: Holding" in block DS-POW-4
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} has people who would take the hall if they could, and they cannot, and everybody involved understands the arrangement precisely.
    notebook: none. Return an empty list.
POOL "legitimacyHold: public opinion neither helps nor hurts" in block DS-POW-4
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {settlement} is "Hochhausen" on this town
    {seat} is "Elected Reeve" on this town
    {seat} is "Elected Reeve" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).govMultiplier = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} neither backs the {seat} nor moves against it, and the {seat} governs on its own strength alone.
    notebook: none. Return an empty list.