THIS PAGE: tab services, audience dm.
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
POOL "COMPLETE FOR ITS TIER" in block DS-SUP-3
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    readings.notableAbsences = DERIVED: the engine computes this as `deriveNotableAbsences(settlement.tier, settlement.availableServices)`, from `availableServices` = "{criminal: [3 rows], employment: [7 rows], entertainment: [2 rows], equipment: [34 rows], food: [8 rows], healing: [6 rows], information: [4 rows], legal: [19 rows], lodging: [6 rows], magic: [1 rows], transport: [4 rows]}" and `tier` = "town". Write from those values and give this reading no value of its own.
    readings.notableAbsences.map = DERIVED: the engine computes this as `deriveNotableAbsences(settlement.tier, settlement.availableServices)`, from `availableServices` = "{criminal: [3 rows], employment: [7 rows], entertainment: [2 rows], equipment: [34 rows], food: [8 rows], healing: [6 rows], information: [4 rows], legal: [19 rows], lodging: [6 rows], magic: [1 rows], transport: [4 rows]}" and `tier` = "town". Write from those values and give this reading no value of its own.
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
    A field reading UNKNOWN or DERIVED cannot carry a value of its own, and no
    absence may be read out of one.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger arriving at {settlement} with an ordinary need (a bed, a meal, a mended strap) finds all three without asking twice.
    notebook: none. Return an empty list.