THIS PAGE: tab power, audience dm.
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
POOL "Legitimacy Crisis" in block DS-POW-1
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "Free Elder Council" on this town
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Almost nothing the {seat} asks of {settlement} arrives. The rolls are still kept, out of form rather than expectation, and the clerks who keep them have stopped chasing what is missing.
    notebook: none. Return an empty list.
POOL "governanceFractured true" in block DS-POW-1
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {settlement} is "Warmholz" on this town
    {seat} is "Free Elder Council" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}) = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).governanceFractured = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} is sent to the {seat} and gets nothing done, then sent to somebody with no title at all and has it settled the same afternoon.
    notebook: none. Return an empty list.
POOL "no token matched: unclassified (the plain-description floor)" in block DS-POW-2
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: faction, settlement
    {faction} is "Free Elder Council" on this town
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {faction} holds the hall at {settlement} and the town's affairs run through it.
    notebook: none. Return an empty list.
POOL "governing faction holds a DOMINANT share" in block DS-POW-2
  vid: 1
  stance: ledger
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: faction, settlement
    {faction} is "Free Elder Council" on this town
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {faction} does not merely govern {settlement}, it outweighs everything else in the town put together; the other houses are consulted as a courtesy and know it.
    notebook: none. Return an empty list.
POOL "capture pressure ADVANCING (weak security, poor prosperity)" in block DS-POW-6
  vid: 1
  stance: unfolding · marks dm-only
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    powerStructure.criminalCaptureState = "none" (LIVE)
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).breakdown = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).breakdown.prosperity = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).breakdown.safety = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The criminal interest at {settlement} is gaining ground inside the hall rather than outside it; a poorly-paid, poorly-policed town is cheap to buy into and this one is both.
    notebook: none. This pool is marked `dm-only`: the unit itself is the archiver's private working note and is written in the notebook register the VOICE describes, and it still rides in `spine`.
POOL "layer DORMANT (no ledger materialized)" in block DS-POW-7
  vid: 2
  stance: street
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.politics ?? null.blocs = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are interests at {settlement} and there are no camps; a question is answered by whoever cares about that question.
    notebook: none. Return an empty list.
POOL "council" in block DS-POW-5
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {settlement} is "Warmholz" on this town
    {seat} is "Free Elder Council" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Decisions at {settlement} are averaged before they are made and stick once they are; the {seat} moves slowly and does not readily move back.
    notebook: none. Return an empty list.
POOL "governing body name: a SLOT, never a baked noun" in block DS-POW-5
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: seat, settlement
    {seat} is "Free Elder Council" on this town
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger who addresses the {seat} at {settlement} by any other title is corrected, politely and immediately.
    notebook: none. Return an empty list.
POOL "riskLabel: Contested" in block DS-POW-4
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: faction, settlement
    {settlement} is "Warmholz" on this town
    {faction} is "Free Elder Council" on this town
    {faction} is "F" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is no longer certain the hall belongs to {faction}, and neither, from the way it governs, is {faction}.
    notebook: none. Return an empty list.
POOL "legitimacyHold: public rejection is breaking the hold" in block DS-POW-4
  vid: 3
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "Free Elder Council" on this town
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    typeof power.publicLegitimacy === 'object' && power.publicLegitimacy !== null
    ? power.publicLegitimacy
    : /** @type {PublicLegitimacyView} */ ({}).govMultiplier = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What the {seat} has lost at {settlement} it has lost to the town rather than to a rival, and no rival was required.
    notebook: none. Return an empty list.