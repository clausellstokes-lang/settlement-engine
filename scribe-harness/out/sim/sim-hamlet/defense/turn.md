THIS PAGE: tab defense, audience dm.
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
POOL "readiness CRITICAL" in block DS-DEF-1
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    defenseProfile.readiness.score = 13 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town knows perfectly well what it could not survive, and the knowledge shapes what it will and will not provoke.
    notebook: none. Return an empty list.
POOL "override active (generic framing)" in block DS-DEF-8
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    stress = "{colour, crisisHook, historyColour, icon, label, summary, type, viabilityNote}" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: What {settlement}'s defenses are ordinarily worth does not describe the town at present; there is a crisis on it, and the arrangements have been rebuilt around the crisis.
    notebook: none. Return an empty list.
POOL "override active, viability intact" in block DS-DEF-8
  vid: 3
  stance: counterforce
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicViability.viable = true (FROZEN)
    stress = "{colour, crisisHook, historyColour, icon, label, summary, type, viabilityNote}" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The crisis at {settlement} has changed the posture and not the prospects, and the town has been careful to keep the two separate.
    notebook: none. Return an empty list.
POOL "Invasion & War: neither walls nor force" in block DS-DEF-2
  vid: 2
  stance: counterforce
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    institutions = "[14 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 8
    face 0 speaks through: watch
      and is one of the roles the town block lists for `watch` under `roles`, and no other.
    face 1 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 2 speaks through: hall
      and is one of the roles the town block lists for `hall` under `roles`, and no other.
    face 3 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 4 speaks through: guild
      and is one of the roles the town block lists for `guild` under `roles`, and no other.
    face 5 speaks through: court
      and is one of the roles the town block lists for `court` under `roles`, and no other.
    face 6 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 7 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: The houses here stand with nothing about them, a drover has it, and at the first door he was asked the state of the road behind him.
    face 0: A guard on the night round says he was given it street by street and left to guess at the rest.
    face 1: At the tavern they give the reason there is no wall freely, and it comes out different at every table.
    face 2: A clerk in the hall puts the want of a wall down to a want of money. He does not say what the money there is goes on.
    face 3: The stallholders reckon the town's money here runs to the scales and the sweeping of the square.
    face 4: A guild member says the trades could price a wall down to the carting. What they are asked for is money and never men.
    face 5: Those who sit to hear a matter say nobody can put before them whether a line goes round the place, and they leave the question there.
    face 6: The older households say the water is the one thing they are careful of here.
    face 7: Whoever buries the dead says the ground for the dead is marked off and the rest of the place is not.
    notebook: none. Return an empty list.
POOL "Internal Security: no legal infrastructure" in block DS-DEF-2
  vid: 2
  stance: street
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
    face 1 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 2 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 3 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 4 speaks through: muster
      and is one of the roles the town block lists for `muster` under `roles`, and no other.
    face 5 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 6 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: By the households' own account a matter is settled among them, and it stays settled for as long as everyone who was there goes on agreeing that it was.
    face 0: A travelling trader reports that a short payment here is argued out on the doorstep where it was made, and the doorstep is where it stays.
    face 1: The households may settle what they like among themselves, the elders say, and what reaches the elders is settled the elders' way.
    face 2: At the tavern they say the households which do the settling are the ones with the most fields, and the drinkers can name them.
    face 3: The elders say a boundary is walked and talked over until it is agreed. The walking is done by the two households, in time neither can spare.
    face 4: The muster says it is expected to stand behind whatever the households decide and is not asked first.
    face 5: A quarrel that starts inside is none of the gate's, whoever keeps the gate says, and a quarrel that starts at the gate is settled at the gate.
    face 6: Whoever digs the ground says they are told when to dig and not what was decided, and they do not ask.
    notebook: none. Return an empty list.
POOL "Economic Survival: WEAK" in block DS-DEF-2
  vid: 3
  stance: unfolding
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    defenseProfile.scores.economic = 21 (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 8
    face 0 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 1 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
    face 2 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 3 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 4 speaks through: muster
      and is one of the roles the town block lists for `muster` under `roles`, and no other.
    face 5 speaks through: gate
      and is one of the roles the town block lists for `gate` under `roles`, and no other.
    face 6 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 7 speaks through: garrison
      and is one of the roles the town block lists for `garrison` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: What the arrangement here would cost, and whose the cost would be, has never been settled between the households.
    face 0: A household's store is in its own cellar and under its own floor, a stranger says. The neighbours know which floor covers what and say as much to a visitor.
    face 1: Those who keep the ground say a burying is the one thing here that waits for no purse.
    face 2: The elders hold that a household with nothing else to spare still finds what it takes to put its own in the ground.
    face 3: It is the same backs that come out, they say at the tavern. Everyone at the table can name the ones who stay behind their own door.
    face 4: The muster says the ground it would gather on is somebody's own field, and that somebody would bear the trampling of the crop.
    face 5: Those who hold the way through reckon nobody set the hour the bar comes down, and the hour follows the light.
    face 6: The shortfall comes off the stalls, they say at the market, and the argument comes from behind every stall.
    face 7: The soldiers say the place says plainly what it wants of them. The people here ask them straight out to put a shoulder to a load.
    notebook: none. Return an empty list.
POOL "Disasters & Famine: NO reserves, NO medical provision" in block DS-DEF-2
  vid: 2
  stance: street
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: (none)
  THE FIELDS this pool reads, with their values here:
    economicState.compound.inst.hasChurch = true (FROZEN)
    economicState.compound.inst.hasGranary = false (FROZEN)
    economicState.compound.inst.hasHospital = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 5
    face 0 speaks through: elders
      and is one of the roles the town block lists for `elders` under `roles`, and no other.
    face 1 speaks through: tavern
      and is one of the roles the town block lists for `tavern` under `roles`, and no other.
    face 2 speaks through: stranger
      and is one of the roles the town block lists for `stranger` under `roles`, and no other.
    face 3 speaks through: market
      and is one of the roles the town block lists for `market` under `roles`, and no other.
    face 4 speaks through: register
      and is one of the roles the town block lists for `register` under `roles`, and no other.
  THE CORPUS LINE, as the claim and the fallback:
    spine: It is common knowledge here that there is no grain store to go to and no house for the sick to be carried to, and the town does not count either as a lack.
    face 0: The older households say a sick house here is never left to itself.
    face 1: At the tavern they say the houses that are sat up with are the houses that sit up with others.
    face 2: The food left on a step is how a sick house is known from the lane, a traveller reports.
    face 3: At the market they say a house with somebody ill in it comes for vinegar and roots, and whoever has them names the price.
    face 4: Those who bury the dead reckon they are the one trade here that is sent for in a bad year and not thanked for coming.
    notebook: none. Return an empty list.
POOL "COMPOUND override (a crisis stress has rewritten the label)" in block DS-DEF-3
  vid: 1
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Dangerous — Monster Threat" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The ordinary safety of {settlement} has stopped applying. Whatever the town was, the crisis on it now is what governs the streets.
    notebook: none. Return an empty list.
POOL "First-Survey qualification (the reading is a first look)" in block DS-DEF-3
  vid: 2
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    economicState.safetyProfile.safetyLabel = "Dangerous — Monster Threat" (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The safety reading for {settlement} is an initial one. It is honest about what has been seen and says nothing about what has not.
    notebook: none. Return an empty list.
POOL "structure null (nothing organized recognized)" in block DS-DEF-4
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    structureKey = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: No criminal infrastructure has been identified at {settlement}. Whatever wrongdoing the town has does not run through anything that could be called an organization.
    notebook: none. Return an empty list.
POOL "capture none" in block DS-DEF-4
  vid: 1
  stance: ledger
  THIS POOL IS NOT WRITEABLE ON THIS TOWN: OMIT IT. No reading it rests on has a
  value here, so there is nothing to stand a sentence on but the pool key itself.
  Return no unit for this pool. The hand corpus draws it, which is the right answer.
  THE ORDER: the corpus spine realises the move order `V5` — `INSTITUTION then PRESENT` (an institution row + the state key); keep that order in your spine.
  slots you may use: seat, settlement
    {seat} is "Free Elder Council" on this town
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    name = "Warmholz" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing criminal has reached the {seat} at {settlement}. Whatever operates in the town operates outside the hall, and the hall's decisions are the hall's.
    notebook: none. Return an empty list.
POOL "walls ABSENT" in block DS-DEF-5
  vid: 2
  stance: visitor
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[14 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger arrives at {settlement} from whichever direction suits him and is not obliged to pass anybody on the way in.
    notebook: none. Return an empty list.
POOL "NO organized force at all" in block DS-DEF-5
  vid: 3
  stance: visitor
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[14 rows]" (LIVE)
    standingDefenseForces(settlement) = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: A stranger at {settlement} can find nobody whose responsibility the town's defense is, because it is not anybody's.
    notebook: none. Return an empty list.
POOL "charter hall ABSENT where the country warrants one" in block DS-DEF-5
  vid: 3
  stance: street
  THE ORDER: the corpus spine realises the move order `V2` — `PRESENT then CONSEQUENCE` (state key + a STRUCTURAL-consequence field); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[14 rows]" (LIVE)
    standingDefenseForces(settlement) = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: The town sends soldiers to things soldiers are wrong for at {settlement}, and pays for the wrongness each time.
    notebook: none. Return an empty list.
POOL "arcane defense ABSENT" in block DS-DEF-5
  vid: 3
  stance: counterforce
  THE ORDER: the corpus spine realises none of the eight closed level-1 orders, so this pool sets no order for you to keep.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    magicWorksAt({ settlement }) = UNREADABLE BY THIS CARD (the engine decided it; the pool key states it; assert no value for this field beyond what the key says)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: Nothing unseen has come at {settlement}, and nothing here would know if it had; the record of safety and the capacity to detect are two different things.
    notebook: none. Return an empty list.
POOL "UNWALLED-SMALL" in block DS-DEF-11
  vid: 1
  stance: street
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    institutions = "[14 rows]" (LIVE)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} is too small to wall and knows it; the town's safety is its neighbours, its distance, and its unimportance.
    notebook: none. Return an empty list.
POOL "Logistics & Supply: No reserves, landlocked" in block DS-DEF-6
  vid: 1
  stance: ledger
  THE ORDER: the corpus spine realises the move order `V1` — `PRESENT` (the state key alone); keep that order in your spine.
  slots you may use: settlement
    {settlement} is "Warmholz" on this town
    WRITE THE FILL, NOT THE TOKEN: the words above are what the page prints.
  THE FIELDS this pool reads, with their values here:
    config.tradeRouteAccess = "road" (FROZEN)
    economicState.compound.inst.hasGranary = false (FROZEN)
    economicState.compound.inst.hasPort = false (FROZEN)
    The second sentence of a unit, if there is one, must rest on one of these fields
    and name it in its own word, or the instruments withhold it.
  faces to write: 0
  THE CORPUS LINE, as the claim and the fallback:
    spine: {settlement} holds no food buffer at all. Any interruption to supply becomes a survival question within days rather than seasons.
    notebook: none. Return an empty list.