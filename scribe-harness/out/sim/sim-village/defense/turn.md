THIS PAGE: tab defense, audience dm.
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
POOL "readiness WEAK" in block DS-DEF-1
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    defenseProfile.readiness.score = 28 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The defensive arrangements at {settlement} are thin. Something is in place against most pressures and nothing is in place in depth.
    notebook: none. Return an empty list.
POOL "Invasion & War: neither walls nor force" in block DS-DEF-2
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    institutions = "[29 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 9
    face 0 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 1 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 2 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 3 speaks through: tavern
      and is one of these people and no other: a carter at the alehouse (sg) · a woman at the long table (sg) · the drinkers at the alehouse (pl) · the potboy (sg)
    face 4 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 5 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
    face 6 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 7 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 8 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: Everyone here has seen the place go about its week with no line around it and no soldier in it, and the town counts that an answer.
    face 0: A traveller says he asked at a door here what the place would do if an army came, and was answered about the price of salt.
    face 1: Whoever asks the older households about a wall here is leaving in the morning, they say.
    face 2: The stallholders say the square fills when the light comes and empties when it goes, and the light is what they work to.
    face 3: At the tavern anybody can name the houses that would come out if anything happened, the naming being where it has always stopped.
    face 4: One of the watch says the round is walked by people who keep a bench by day.
    face 5: Those who sit to hear a matter hold that the place has no line of its own, and the boundaries before them run between one plot and the next.
    face 6: Whoever buries the dead holds that the people here are easier about the place than anybody who comes through. He does not say which is right.
    face 7: A guild member says the trades have priced their goods to a place that stands open.
    face 8: The hall has never had anybody come in asking for a wall, a clerk there says.
    notebook: none. Return an empty list.
POOL "Internal Security: no legal infrastructure" in block DS-DEF-2
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.compound.inst.hasCourtSystem = false (FROZEN)
    economicState.compound.inst.hasPrison = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 7
    face 0 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 1 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 2 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 3 speaks through: register
      and is one of these people and no other: a local priest (sg) · a woman who sings in the choir (sg) · one of the congregation (sg) · the chapel's warden (sg) · the people who keep the register (pl)
    face 4 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 5 speaks through: muster
      and is one of the roles the town block lists for `muster` under `roles`, and no other.
    face 6 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: A traveller wronged here finds there is nowhere to take it, and nobody local expected there to be.
    face 0: A stranger wronged here asks where to take it, a travelling trader says, and is pointed at the door of the house that did it.
    face 1: At the tavern they say a stranger owed money here should take it in goods and not wait on coin.
    face 2: The elders say they hear a stranger's wrong as they hear anyone's, and a stranger who does not stay for the answer was not much wronged.
    face 3: Whoever digs the ground holds that it takes a stranger on the same terms as anyone, whatever was or was not agreed about him.
    face 4: At the gate they say a stranger is looked over on the way in, and nothing is kept of the looking.
    face 5: The muster tells a stranger who complains that there is nowhere to lock up the man he names. There is nowhere for the stranger either.
    face 6: The stallholders say a stranger cheated here has no board to go to, and would do better to come back to the stall.
    notebook: none. Return an empty list.
POOL "Economic Survival: WEAK" in block DS-DEF-2
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    defenseProfile.scores.economic = 32 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 9
    face 0 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 1 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 2 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 3 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 4 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 5 speaks through: muster
      and is one of the roles the town block lists for `muster` under `roles`, and no other.
    face 6 speaks through: market
      and is one of these people and no other: a buyer at the fish market (sg) · a buyer off the road (sg) · a fish seller (sg) · a stallholder (sg) · a woman who sells at the market (sg) · the market clerk (sg) · the stallholders (pl) · the women who gut the catch (pl)
    face 7 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 8 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: Everyone here has seen who turns out when something is wanted, and takes it that the same people would turn out for anything worse.
    face 0: What is put into a hand here is goods and not coin, a stranger says, and no apology comes with the sack.
    face 1: The elders hold that an ask is made out loud here and in front of the neighbours. A refusal is heard by the same ears.
    face 2: The loudest at the table is the household that would be asked last, they say at the tavern. The ones asked first sit quiet over their cups.
    face 3: Those who keep the ground say a household gives toward a burying whatever it has. What is put in is remembered by the neighbours better than any count.
    face 4: Those who hold the way through say the bar coming down is heard at the far doors. Not one of the doors opens.
    face 5: The muster reckons what comes up from a door is a body or a tool, and the tool is remembered as well as the body.
    face 6: At the market they say the place takes from whoever can be found, and there is nothing easier to find than a stall.
    face 7: One of the watch says the same corners get stood in whether the purse is settled or not. The round ends where it starts, at the water.
    face 8: Nobody here asks the soldiers their business, the soldiers say, and everybody here asks them for a hand.
    notebook: none. Return an empty list.
POOL "Disasters & Famine: NO reserves, NO medical provision" in block DS-DEF-2
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.compound.inst.hasChurch = true (FROZEN)
    economicState.compound.inst.hasGranary = false (FROZEN)
    economicState.compound.inst.hasHospital = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 5
    face 0 speaks through: stranger
      and is one of these people and no other: a carter (sg) · a drover (sg) · a messenger off the road (sg) · a pedlar (sg) · a pilgrim (sg) · a rider who stopped a night (sg) · a traveller (sg) · people passing through (pl)
    face 1 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 2 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 3 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 4 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger who asks here for the store is shown a field, and one who asks for the house for the sick is shown a door.
    face 0: By a carter's reckoning the sacks that leave a house for the stone are counted going and not counted coming back.
    face 1: At the tavern they say a stranger who asks for a house for the sick is taken for sick himself and served at the door.
    face 2: What a stranger calls a want is only how the place is arranged, in the older households' account, and they do not say who arranged it.
    face 3: Those who bury the dead say part of the plot digs easily and part does not, and everybody here knows which is which.
    face 4: Those who sell at the market say a buyer can have grain here on a market day and no place to keep it.
    notebook: none. Return an empty list.
POOL "Moderate" in block DS-DEF-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Moderate" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Enforcement and criminal presence at {settlement} sit close enough that the town's condition is a matter of which way the next few seasons go.
    notebook: none. Return an empty list.
POOL "First-Survey qualification (the reading is a first look)" in block DS-DEF-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Moderate" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The safety reading for {settlement} is an initial one. It is honest about what has been seen and says nothing about what has not.
    notebook: none. Return an empty list.
POOL "structure null (nothing organized recognized)" in block DS-DEF-4
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    structureKey = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger asking after the arrangements at {settlement} is met with genuine incomprehension, which is either the truth or an unusually good performance of it.
    notebook: none. Return an empty list.
POOL "capture none" in block DS-DEF-4
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Hochhausen" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Whatever is being run at {settlement} is being run outside the hall, and the town's dealings with the hall are the town's dealings with the hall.
    notebook: none. Return an empty list.
POOL "walls ABSENT" in block DS-DEF-5
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[29 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town has an edge rather than a boundary at {settlement}, and the edge is wherever the last building happens to be.
    notebook: none. Return an empty list.
POOL "charter hall PRESENT (specialist monster response)" in block DS-DEF-5
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[29 rows]" (LIVE)
    standingDefenseForces(settlement) = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} finds a hall whose business is the sort of trouble a garrison is the wrong instrument for, and finds it busy.
    notebook: none. Return an empty list.
POOL "arcane defense ABSENT" in block DS-DEF-5
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    magicWorksAt({ settlement }) = null (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town has no answer to anything it cannot see, and is unprepared rather than protected in that respect.
    notebook: none. Return an empty list.
POOL "UNWALLED-SMALL" in block DS-DEF-11
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Hochhausen" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[29 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: No wall marks where {settlement} ends; at this size the country and the town simply agree to differ.
    notebook: none. Return an empty list.
POOL "Logistics & Supply: No reserves, landlocked" in block DS-DEF-6
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    config.tradeRouteAccess = "road" (FROZEN)
    economicState.compound.inst.hasGranary = false (FROZEN)
    economicState.compound.inst.hasPort = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town eats what arrives, and has nothing put by against a season when nothing does.
    notebook: none. Return an empty list.