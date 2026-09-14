THIS PAGE: tab defense, audience dm.
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
POOL "readiness STRONG" in block DS-DEF-1
  vid: 4
  stance: counterforce
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    defenseProfile.readiness.score = 66 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing presses {settlement} at present, and the absence is not luck: a town this well set is not worth the price of trying.
    notebook: none. Return an empty list.
POOL "Beasts & Monsters: frontier, credible deterrence" in block DS-DEF-2
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    config.monsterThreat = "frontier" (FROZEN)
    institutions = "[47 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 11
    face 0 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 1 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 2 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 3 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 4 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 5 speaks through: tavern
      and is one of these people and no other: a carter at one of the taverns (sg) · a man who drinks where the carters drink (sg) · a potboy of the district (sg) · a woman at the long table (sg) · an innkeeper (sg) · the drinkers of the district (pl)
    face 6 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
    face 7 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 8 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 9 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
    face 10 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: Everyone here knows what is in the country and nobody here talks about it. The town calls that the arrangement working.
    face 0: A travelling trader says nobody here asked him what he had seen on the road, and he had an answer ready.
    face 1: Those who hold the way through drop the bar at dusk, and the hour is never argued over.
    face 2: A local priest prays for the men on the line in the same breath as the roads.
    face 3: The hall holds that nothing about the nights has come to it as a complaint.
    face 4: The watch says the complaints are made to it at the way through and go no further.
    face 5: At the tavern the talk is of who stands the nights, and the country itself does not come up.
    face 6: The garrison says nobody comes out of the town to watch a drill.
    face 7: A guild member reckons the trades pay the toll at the way through. The line it keeps is counted as everyone's.
    face 8: At the market they say the stalls go up whatever the country is doing.
    face 9: The court says a dispute over the toll is settled on the day it is brought, and the country brings it none.
    face 10: The elders say the young stand the nights and the old say how they are stood.
    notebook: none. Return an empty list.
POOL "Invasion & War: walls AND professional garrison" in block DS-DEF-2
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    institutions = "[47 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 5
    face 0 speaks through: gate
      and is one of these people and no other: a gatekeeper (sg) · a man on one of the gates (sg) · a serjeant on the wall (sg) · the men who hold the ways in (pl) · whoever keeps the toll book (sg)
    face 1 speaks through: hall
      and is one of these people and no other: a clerk in the hall (sg) · a secretary of the city's offices (sg) · a woman who keeps the hall books (sg) · one of the aldermen (sg) · the mayor (sg) · the under-clerks of the hall (pl)
    face 2 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
    face 3 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 4 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: A traveller is stopped at the gate and counted before he is let through. What he is let into is a place that pays soldiers of its own.
    face 0: The men on the gate say a stranger pays the gate, and the gate settles with the hall in its own time.
    face 1: A clerk in the hall says a stranger who pays at the gate has paid the town, whatever the men at the gate tell him.
    face 2: The court holds that anyone who paid the toll may argue it there, a stranger as much as a carter.
    face 3: A travelling trader says his pack was opened at the gate and nothing taken from it but the toll.
    face 4: At the tavern they say the town has never been asked whether it wants soldiers, only what they cost.
    notebook: none. Return an empty list.
POOL "Internal Security: court without detention" in block DS-DEF-2
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
  THE FIELDS this pool reads, with their values here:
    economicState.compound.inst.hasCourtSystem = true (FROZEN)
    economicState.compound.inst.hasPrison = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 10
    face 0 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 1 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
    face 2 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 3 speaks through: market
      and is one of these people and no other: a buyer who came after dark (sg) · a clerk of one of the markets (sg) · a clerk of the fair (sg) · a market clerk (sg) · a porter in the square (sg) · a seller who does not give a name (sg) · a stallholder (sg) · a trader come in for the fair (sg) · the fair clerk (sg) · the people who deal there (pl) · the stallholders (pl) · the traders at the fair (pl) · the traders at the fairs (pl)
    face 4 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 5 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 6 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 7 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 8 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 9 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} keeps a court and no room to hold anybody in. What the law here can take from a man is his money or his place in the town.
    face 0: The watch says what it comes across after dark is dealt with after dark, there being nowhere to leave a man until morning.
    face 1: The court says it hears in the daylight what the watch settled in the dark, and nobody asks it first.
    face 2: A clerk in the hall reckons the purse does not run to a room and never has. He does not say who asked for one.
    face 3: At the market a stallholder says a short weight goes before a magistrate and comes back as a sum. The scales it was weighed on stay on his stall.
    face 4: A local priest holds that the parish has a place for a man once he is dead and the town has none for him while he is alive.
    face 5: A guild member says a sum is paid out of a man's takings and forgotten. The mark taken off his work is not.
    face 6: At the tavern they say a man with a house here pays and stays. A man without one goes, and the table loses him.
    face 7: A travelling trader says there is nothing here to take from a man who owns nothing in the town. The town has only the one thing left to do with him.
    face 8: At the gate they say they are given a man and a direction and no reason for either.
    face 9: A soldier says what comes at the town is the garrison's business and the people walked out of it are not.
    notebook: none. Return an empty list.
POOL "Economic Survival: STRONG" in block DS-DEF-2
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    defenseProfile.scores.economic = 73 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 10
    face 0 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 1 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 2 speaks through: archiver
      and is one of the roles the town block lists for `archiver` under `roles`, and no other.
    face 3 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 4 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 5 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 6 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 7 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
    face 8 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 9 speaks through: register
      and is one of these people and no other: a canon (sg) · a cathedral clerk (sg) · a parish warden (sg) · a priest of one of the parishes (sg) · one of the congregation (sg) · one of the vergers (sg) · the cathedral chapter (pl) · the high priest (sg) · the parish clerks (pl)
  THE CORPUS LINE, as the claim and the fallback:
    spine: Everyone in the town has seen the store kept stocked, and takes it that a crisis would find the place ready.
    face 0: The hall says it asks the trades for no more than the trades can carry.
    face 1: The guilds say the carrying is theirs and the asking is not.
    face 2: The guilds' account is the likelier, the hall having a purse to defend and the guilds only a bill.
    face 3: The watch holds that the rounds are kept by people who are owed for keeping them.
    face 4: At the gate they say a cart bound for the grain store is not kept waiting, whatever else is.
    face 5: A stranger who sits at the tavern hears the grain store praised and the wage complained of, by the same people.
    face 6: At the tavern they say the watch is a trade that drinks on what it is owed.
    face 7: The soldiers hold that a town which can be fed through a crisis and does not meet their wage in full has decided something. It has not said what.
    face 8: At the market they say the stallholders settle what the hall is owed before they settle anything of their own.
    face 9: A local priest holds that the town keeps its word to the dead before it keeps its word to the living.
    notebook: none. Return an empty list.
POOL "Disasters & Famine: granary AND parish care only" in block DS-DEF-2
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V2` — `PRESENT then CONSEQUENCE` (state key + a STRUCTURAL-consequence field); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.compound.inst.hasChurch = true (FROZEN)
    economicState.compound.inst.hasGranary = true (FROZEN)
    economicState.compound.inst.hasHospital = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 6
    face 0 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 1 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 2 speaks through: tavern
      and is one of these people and no other: a carter at one of the taverns (sg) · a man who drinks where the carters drink (sg) · a potboy of the district (sg) · a woman at the long table (sg) · an innkeeper (sg) · the drinkers of the district (pl)
    face 3 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 4 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 5 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: A drover says the town looks provided for from outside, and whoever tends a sick house here comes out of the church.
    face 0: A local priest says a stranger asks for a house and is given a person, and nobody born here asks for the house.
    face 1: Grain is hard to keep here, those who sell at the market say, for anybody without a door of their own in the town.
    face 2: At the tavern they say strangers walk up to look at the store, and nobody here does.
    face 3: Strangers ask the watch where the grain is kept, the watch says, and nobody has ever asked it where the sick are.
    face 4: A guild member reckons what a stranger takes for provision is a store the trades filled and cannot open.
    face 5: Those who hear disputes say a stranger's questions about the store are ordinary and the ones about the sick are new to them.
    notebook: none. Return an empty list.
POOL "Moderate" in block DS-DEF-3
  vid: 1
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Moderate" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} runs on a working balance: the law is present, crime exists, and neither has the run of the town.
    notebook: none. Return an empty list.
POOL "First-Survey qualification (the reading is a first look)" in block DS-DEF-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Moderate" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The safety reading for {settlement} is an initial one. It is honest about what has been seen and says nothing about what has not.
    notebook: none. Return an empty list.
POOL "structure organized" in block DS-DEF-4
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} is not robbed and is quietly told what the arrangement is; the danger here is systematic rather than sudden.
    notebook: none. Return an empty list.
POOL "capture adversarial" in block DS-DEF-4
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Rundgate" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The hall at {settlement} moves against the operators and the operators move back, and the town is where the two of them meet.
    notebook: none. Return an empty list.
POOL "walls PRESENT" in block DS-DEF-5
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[47 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} controls its own entry points. That is what a perimeter buys: not invulnerability, but the choice of where anything happens.
    notebook: none. Return an empty list.
POOL "garrison PRESENT" in block DS-DEF-5
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[47 rows]" (LIVE)
    standingDefenseForces(settlement) = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} keeps a standing force: people whose work is the defense of this town and who are answerable for it as work.
    notebook: none. Return an empty list.
POOL "mercenary / contracted forces PRESENT" in block DS-DEF-5
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    institutions = "[47 rows]" (LIVE)
    standingDefenseForces(settlement) = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town pays for some of its soldiers and knows which ones, and treats them accordingly.
    notebook: none. Return an empty list.
POOL "charter hall PRESENT (specialist monster response)" in block DS-DEF-5
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[47 rows]" (LIVE)
    standingDefenseForces(settlement) = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} finds a hall whose business is the sort of trouble a garrison is the wrong instrument for, and finds it busy.
    notebook: none. Return an empty list.
POOL "arcane defense PRESENT" in block DS-DEF-5
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    magicWorksAt({ settlement }) = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} is measured at the gate in a way he cannot quite identify, and is not told about it.
    notebook: none. Return an empty list.
POOL "WALLED-STRAINED" in block DS-DEF-11
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: defwork, settlement
    {settlement} is "Rundgate" on this town
    {defwork} is "city walls and gates" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    defenseProfile.economicGates.military = 0.98 (FROZEN)
    institutions = "[47 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement}'s {defwork} stands better than the watch that should man it; stone keeps itself, and wages do not.
    notebook: none. Return an empty list.
POOL "Logistics & Supply: Granary with road supply" in block DS-DEF-6
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Rundgate" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    config.tradeRouteAccess = "road" (FROZEN)
    economicState.compound.inst.hasGranary = true (FROZEN)
    economicState.compound.inst.hasPort = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} keeps stores and is fed by the roads; the roads are the vulnerability, and the granary is what buys time to do something about them.
    notebook: none. Return an empty list.