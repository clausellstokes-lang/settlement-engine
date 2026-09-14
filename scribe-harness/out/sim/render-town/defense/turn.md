THIS PAGE: tab defense, audience dm.
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
POOL "readiness ADEQUATE" in block DS-DEF-1
  vid: 4
  stance: threshold
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    defenseProfile.readiness.score = 57 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is at the point where the arrangements are sufficient and nothing is spare. One more demand on them and the town would be choosing which pressure to leave uncovered.
    notebook: none. Return an empty list.
POOL "Invasion & War: walls with NO force" in block DS-DEF-2
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: (none)
    {court} is "A woman who brought a matter to the court" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[52 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 4
    face 0 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 1 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 2 speaks through: court
      and is one of these people and no other: a bailiff (sg) · a clerk of the court (sg) · a woman who brought a matter to the court (sg) · one who waits on the court (sg) · one who waits on the court day (sg) · the officers of the court (pl)
    face 3 speaks through: public
      and is one of the roles the town block lists for `public` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are no soldiers of the town's own here, and the walls are kept up all the same.
    face 0: {elders} {v:take} the walls for their own boundary before anything else, and where the line runs is the older argument.
    face 1: {watch} {v:say} the hall's record has the walls in it and not the walk along them, and {v:walk} it after dark regardless.
    face 2: {court} {v:hear} what is disputed about the walls, and it is always who owes the work. Nothing that comes there is about who would hold them.
    face 3: {public} {v:have} seen the wall kept and no soldiers on it, and {v:take} it that nobody is coming.
    notebook: none. Return an empty list.
POOL "Internal Security: full legal chain (court AND prison)" in block DS-DEF-2
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.compound.inst.hasCourtSystem = true (FROZEN)
    economicState.compound.inst.hasPrison = true (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 9
    face 0 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 1 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 2 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
    face 3 speaks through: tavern
      and is one of these people and no other: a carter at the tavern (sg) · a driver off the coach (sg) · a guest at one of the inns (sg) · a man who drinks where the carters drink (sg) · a tavern keeper (sg) · a woman at the long table (sg) · an innkeeper (sg) · the drinkers at the tavern (pl) · the inn servants (pl) · the ostler (sg) · the ostler at one of the inns (sg) · the potboy (sg)
    face 4 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 5 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
    face 6 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 7 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 8 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: A traveller who brings a complaint here is shown where it is heard and where the person he names would be kept.
    face 0: A clerk in the hall says a man waits because the matter before his is being heard properly.
    face 1: A drover says a man waits because nobody has said whose business he is.
    face 2: A traveller's complaint is heard like any other, by a magistrate's account. Whether the traveller stays for it is the traveller's own affair.
    face 3: At the tavern they say a man is called in for who he knows and let out for what he can pay.
    face 4: The wage is the same whether the night is quiet or a man is walked in, one of the watch says.
    face 5: A soldier reckons a stranger stopped at the gate is the garrison's until his business is asked. After that he is the watch's.
    face 6: A guild member says the trades pay for the waiting twice, in the man who waits and in the work that waits with him.
    face 7: The stallholders say a stranger cheated at the market is told where to bring it. A stallholder cheated by a stranger is told the same, after the stranger has gone.
    face 8: Those who keep the gate say a stranger with a complaint against him waits at the gate until somebody comes for him.
    notebook: none. Return an empty list.
POOL "Economic Survival: STRONG" in block DS-DEF-2
  vid: 3
  stance: counterforce
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    defenseProfile.scores.economic = 76 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 8
    face 0 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 1 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
    face 2 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 3 speaks through: guild
      and is one of these people and no other: a guild factor (sg) · a journeyman (sg) · a master of one of the crafts (sg) · the dyers' warden (sg) · the guild master (sg) · the guilds of the town (pl)
    face 4 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 5 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 6 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 7 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: The hall holds that the town could be fed and supplied through a crisis, and at the tavern they say the people who would be paid through one are paid short already.
    face 0: The watch says the purse that pays it is opened last.
    face 1: The soldiers say they are paid out of the same purse and in the same order.
    face 2: The hall's answer, when the wage is raised, is the grain store.
    face 3: The guilds say the trades made the provision and the hall made the shortfall.
    face 4: A stranger smells grain at the store door and hears the wage complained of at the tavern.
    face 5: A local priest reports that the parish asks for nothing the town has not already promised it, and does not say what it has been given.
    face 6: Asked about the purse, the hall talks about the grain store, and asked again, talks about the grain store again.
    face 7: The court says nobody has brought it the question of the watch's wage. It does not expect the hall to.
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
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 6
    face 0 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 1 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 2 speaks through: tavern
      and is one of these people and no other: a carter at the tavern (sg) · a driver off the coach (sg) · a guest at one of the inns (sg) · a man who drinks where the carters drink (sg) · a tavern keeper (sg) · a woman at the long table (sg) · an innkeeper (sg) · the drinkers at the tavern (pl) · the inn servants (pl) · the ostler (sg) · the ostler at one of the inns (sg) · the potboy (sg)
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
  vid: 4
  stance: threshold
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Moderate" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The balance at {settlement} sits where either side could take it. A thinner watch or a bolder operator would show up in the returns within the season, and nothing else would need to change.
    notebook: none. Return an empty list.
POOL "First-Survey qualification (the reading is a first look)" in block DS-DEF-3
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Moderate" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What the town says about its own safety at {settlement} is what the town says on a first acquaintance, and a longer one would be a different account.
    notebook: none. Return an empty list.
POOL "structure organized" in block DS-DEF-4
  vid: 4
  stance: counterforce
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads: none are recorded, so write ONE sentence and no second.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There is very little street violence at {settlement} and it is not the watch's doing. A structured interest suppresses what draws enforcement, and does it more thoroughly than the watch could.
    notebook: none. Return an empty list.
POOL "capture none" in block DS-DEF-4
  vid: 3
  stance: street
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Spitzplatz" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Whatever is being run at {settlement} is being run outside the hall, and the town's dealings with the hall are the town's dealings with the hall.
    notebook: none. Return an empty list.
POOL "walls PRESENT" in block DS-DEF-5
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[52 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} controls its own entry points. That is what a perimeter buys: not invulnerability, but the choice of where anything happens.
    notebook: none. Return an empty list.
POOL "watch PRESENT" in block DS-DEF-5
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[52 rows]" (LIVE)
    standingDefenseForces(settlement) = UNKNOWN (this card cannot resolve this reading; assert nothing that depends on it)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: There are people walking the town at {settlement} at night, and the town's sense of itself rests more on that than on anything at the gate.
    notebook: none. Return an empty list.
POOL "charter hall PRESENT (specialist monster response)" in block DS-DEF-5
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[52 rows]" (LIVE)
    standingDefenseForces(settlement) = UNKNOWN (this card cannot resolve this reading; assert nothing that depends on it)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} finds a hall whose business is the sort of trouble a garrison is the wrong instrument for, and finds it busy.
    notebook: none. Return an empty list.
POOL "arcane defense PRESENT" in block DS-DEF-5
  vid: 1
  stance: ledger
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    magicWorksAt({ settlement }) = UNKNOWN (this card cannot resolve this reading; assert nothing that depends on it)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} keeps arcane provision in its defenses: detection, wards, and an answer to things that conventional arrangements cannot see coming.
    notebook: none. Return an empty list.
POOL "WALLED-STRAINED" in block DS-DEF-11
  vid: 2
  stance: unfolding
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: defwork, settlement
    {defwork} is "town walls" on this town
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    defenseProfile.economicGates.military = 0.98 (FROZEN)
    institutions = "[52 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The {defwork} around {settlement} is sound and the muster behind it is thinning, which is the kind of arithmetic a town notices late.
    notebook: none. Return an empty list.
POOL "Logistics & Supply: Granary with road supply" in block DS-DEF-6
  vid: 3
  stance: counterforce
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Spitzplatz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    config.tradeRouteAccess = "road" (FROZEN)
    economicState.compound.inst.hasGranary = true (FROZEN)
    economicState.compound.inst.hasPort = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it. A field reading
    UNKNOWN cannot carry a sentence, and no absence may be read out of it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: An interruption on the roads to {settlement} does not reach the table, and the granary is the reason rather than the roads.
    notebook: none. Return an empty list.