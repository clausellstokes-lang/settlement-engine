// narrativeData.js — PURE DATA (A+ Track H / data-schema.3).
//
// The two executable template tables that drew randomness at render time —
// PRESSURE_SENTENCES (succession_void calls rng) and POLITICAL_FLAVOR (closures
// call pickRandom2) — were moved to src/generators/narrativeText.js, which is
// allowed to import from the generators layer. This file now holds only pure
// string tables: no runtime imports, no RNG capture. Covered by the src/data
// purity lint (eslint.config.js) + tests/domain/dataPurity.test.js.

export const ARRIVAL_SCENES = {
  market: [
    (r) =>
      `The market at ${r} is audible before it is visible — a specific mix of voices, animals, and the percussion of commerce that no other combination of sounds quite replicates.`,
    (r) =>
      `${r}'s market day has the comfortable chaos of something that has been happening in the same place for a long time and has worked out most of its problems.`,
    (r) =>
      `The road into ${r} is thick with carts by mid-morning, all of them heading for the same square, and the traffic tells you where the settlement's heart is before you can see it.`,
    (r) =>
      `You reach ${r} against a tide of people leaving it — the market has ended for the day, and the settlement is exhaling its visitors back onto the roads with their purchases and their news.`,
  ],
  river: [
    (r) =>
      "The smell of the river reaches you before the settlement does — clean water, reeds, the particular mud of a working waterfront.",
    (r) =>
      `${r} runs along the water the way settlements do when water is the reason they exist: practical, a little chaotic at the waterfront, tidier as you move inland.`,
    (r) =>
      `The river carries the sounds of ${r} to you around the bend before the buildings appear — a mill wheel, the knock of boats against a jetty, someone calling a tally across the water.`,
    (r) =>
      `${r} has its back to the land and its face to the river; the approach by road brings you in the rear way, past the yards and the drying nets, into a settlement that plainly considers the water its front door.`,
  ],
  smoke: [
    (r) =>
      `The cookfire smoke of ${r} drifts on the wind in your direction — a hundred fires, each with its own particular fuel, combining into something that smells like inhabited place.`,
    (r) => `${r} is visible as a smear of smoke on the horizon for a long time before the buildings resolve.`,
    (r) =>
      `You smell ${r} before anything else — woodsmoke and bread and livestock, the layered scent of a place where people have been living close together and cooking the same suppers for generations.`,
    (r) =>
      `The smoke above ${r} stands straight up in the still air, a dozen thin columns that mark the settlement's shape on the sky like a map drawn in grey.`,
  ],
  guild: [
    (r) =>
      `The sound of a hammer on metal reaches you from ${r}'s smithing quarter — a craftsperson's rhythm, not a soldier's.`,
    (r) => `${r} smells of work: sawdust, tallow, the particular sharp smell of a tanner at the edge of town.`,
    (r) =>
      `${r} announces its trade before its name: the whine of a lathe, the reek of the dye-vats, a workshop door standing open on a scene of unhurried, practised industry.`,
    (r) =>
      `The approach to ${r} is lined with the overflow of its crafts — timber stacked to season, half-finished goods under eaves, the settlement's work spilling out past its walls for want of room inside.`,
  ],
  ordinary: [
    (r) =>
      `${r} is ordinary in the best sense — a place where people live and work and argue and sleep, which is most of what places are for.`,
    (r) =>
      `The road into ${r} becomes a street at a point you can't precisely identify. The settlement grows around you gradually.`,
    (r) =>
      `${r} is neither impressive nor disappointing from the approach. It is what it is, which is a working settlement of reasonable size doing reasonable things.`,
    (r) =>
      `A child runs past you on the road into ${r}, chasing something or being chased by something — unclear which. Nobody in the street pays attention.`,
    (r) =>
      `A merchant argues with a carter at the gate of ${r} about the size of a load. The guard is ignoring both of them. This is clearly a daily occurrence.`,
    (r) =>
      `${r} smells like bread from the gate — a bakehouse near the entrance, open early, already on the second bake of the day.`,
  ],
};

export const ARRIVAL_ADDONS = {
  port: [
    (r, s) =>
      `The ${s === "metropolis" ? "great harbour" : "harbour"} of ${r} announces itself before the settlement does — masts above the treeline, the smell of tar and salt, the cries of gulls working the fishing boats.`,
    (r, s) =>
      `${r} appears as a smear of colour above the water: pennants, sail canvas, the white of new-washed walls catching the light from the sea.`,
    (r, s) =>
      `The approach to ${r} is along the quayside road, which means threading through loaded carts and dock workers before the settlement itself comes into view.`,
    (r, s) => `You smell ${r} before you see it — smoke, fish, the mineral bite of the harbour at low tide.`,
  ],
  river: [
    (r, s) =>
      `${r} sits in the bend of the river, its rooftops visible above the willows from a quarter mile out. The mill wheel turns.`,
    (r, s) =>
      `The river road into ${r} runs alongside the water, and the settlement grows out of the bank on both sides — older buildings on the high ground, newer ones crowding the waterfront.`,
    (r, s) =>
      `You cross the river at the ford half a mile out and the road becomes a proper street almost immediately — ${r} has been expanding toward the water.`,
    (r, s) => `The bridge into ${r} is old stone, wide enough for two carts, and there is already a queue to cross it.`,
  ],
  crossroads: [
    (r, s) =>
      `${r} is visible from the junction itself — the roads converge on a market square that seems to be the settlement's reason for existing.`,
    (r, s) =>
      `Four roads, and ${r} at the centre of all of them. Travellers in three directions. The fourth road is yours.`,
    (r, s) =>
      `The waymarker stone at the crossroads half a league out has ${r}'s name carved into it four times, facing each direction. Someone keeps repainting the distances.`,
    (r, s) =>
      `${r} sprawls along all four roads from the central square — the part you see first depends on which direction you came from.`,
  ],
  road: [
    (r, s) =>
      `${r} appears around a bend in the road, its ${s === "city" || s === "metropolis" ? "walls and towers" : "main street"} coming into view all at once.`,
    (r, s) =>
      `The road widens into ${r}'s main thoroughfare without announcing the transition — you are in the settlement before you realised you arrived.`,
    (r, s) =>
      `A mile marker, then a second, then the outlying farms of ${r} begin — the settlement proper is still a quarter hour ahead.`,
    (r, s) =>
      `${r} is announced by the smoke of its cookfires and the sound of its market before its buildings are visible.`,
  ],
  isolated: [
    (r, s) =>
      `${r} appears at the end of a track that stopped pretending to be a road some time ago — it exists here because someone decided to stay, not because the terrain made it easy.`,
    (r, s) =>
      `The last real road ended two hours back. ${r} is visible now — a cluster of buildings in the middle distance that the surrounding terrain seems indifferent to.`,
    (r, s) =>
      `The track into ${r} is maintained by the people who need it, which means it is exactly wide enough and no wider.`,
    (r, s) =>
      `${r} sits in a natural fold of the terrain, protected on three sides. You see the smoke before the buildings, and the buildings before you find the path down.`,
  ],
};

// ─── Terrain narrative hooks ─────────────────────────────────────────────────
// Used by narrativeGenerator.js to build settlement founding descriptions.
// Previously in sharedConstants.js (now deleted).
export const TERRAIN_NARRATIVE_HOOKS = {
  crossroads: [
    "grew at the intersection of two major trade routes",
    "was established as a market town where merchants could meet",
    "began as a customs post where trade roads crossed",
    "developed from a rest stop for traveling caravans",
    "was founded when a powerful merchant family built a counting house at the junction",
    "grew from a seasonal fair that became year-round as traders chose to winter here",
  ],
  river: [
    "developed around an important river ford",
    "grew up beside a strategic bridge crossing",
    "was founded where the river became navigable for laden vessels",
    "began as a riverside mill settlement",
    "was established by a family granted mill rights by a distant lord who never visited",
    "grew around a ferry crossing that became the first bridge only three generations ago",
  ],
  port: [
    "was founded as a coastal trading port",
    "grew from a fishing village into a maritime hub",
    "was established to exploit the natural harbour",
    "began as a naval base protecting the coast",
    "was built around a single family's shipwright operation that outlasted the family",
    "grew because a famous navigator retired here and others followed",
  ],
  road: [
    "grew along a major overland trade route",
    "was established as a waystation for travelers",
    "developed at a defensible position on the road",
    "began as a toll collection point that became a permanent post",
    "was founded by a disbanded military unit that liked the ground and stayed",
    "grew because a healer of some local renown settled here and people followed",
  ],
  isolated: [
    "was founded by religious hermits seeking isolation",
    "grew around a valuable resource deposit",
    "was established as a frontier outpost that outlasted its original purpose",
    "developed from a hidden refuge community that emerged after a generation",
    "was settled by families fleeing something they never fully named",
    "grew from a single household that others joined over decades until it became permanent",
  ],
  mountain: [
    "was founded to exploit rich mineral deposits",
    "grew at a strategic mountain pass",
    "was established as a defensive stronghold that attracted dependents",
    "began as a mining camp that became permanent when families arrived",
    "was built where two rival mining operations agreed to share infrastructure",
    "grew because the pass could only be crossed safely with local guides",
  ],
  forest: [
    "grew from a logging camp",
    "was founded by foresters managing the woodland under charter",
    "developed around a sacred grove that attracted religious settlement",
    "began as a hunting lodge settlement for a noble who died without heirs",
    "was established by charcoal-burners whose operation required permanent residence",
    "grew when a travelling herbalist found what they were looking for and refused to leave",
  ],
  plains: [
    "grew as an agricultural market center",
    "was founded on rich farmland granted to a favoured noble",
    "developed where herders gathered seasonally until the gathering became permanent",
    "began as a grain storage depot for a larger city that no longer exists",
    "was settled by veterans granted land after a forgotten war",
    "grew because the local soil produces something that cannot easily be grown elsewhere",
  ],
};

export const STRESS_DESCS = {
  under_siege: [
    r =>
      `The gates of ${r} are closed. There are people on the walls. This is not the relaxed watch of a settlement going about its day — these are people watching the treeline. A runner comes out of the small side gate, sees your group, stops.`,
    r =>
      `${r}'s gates are open but attended — every person entering is noted, every cart searched. The guards are professional about it, which makes it worse. Professional means this has been happening long enough to become routine.`,
    r =>
      `From the road, ${r} looks ordinary. Smoke from cookfires, the sound of a market. It is only at the gate that the weight becomes apparent — the guards' expressions, the way conversation stops when strangers approach.`,
    r =>
      `The approach to ${r} is quieter than it should be for a settlement this size. The outlying farms are empty. The road has not been maintained recently. The settlement itself is intact, but everything around it has been abandoned to the walls.`,
    // CONTENT-GT-FINAL (Charge 4): every pool below grew +2. Selection is a single
    // pickRandom2 (draw-count invariant); the stressTypeContentWave probes are pool-robust
    // (they assert the scene opens on a member of the pool, not on fixed phrases).
    r =>
      `The fields around ${r} were harvested early and badly — stubble cut in haste, carts gone. Whatever the walls are waiting for, the granaries inside are already keeping its schedule.`,
    r =>
      `A thrown stone sits half-buried a hundred paces short of ${r}'s wall, left where it landed. Nobody has hauled it away. There are fresher things to attend to.`,
  ],
  famine: [
    r =>
      `${r} looks prosperous in the merchant quarter — new paint, loaded carts, a market stall with produce. It is only when you walk further in that the other version of the settlement appears: shuttered houses, people sitting on doorsteps with no particular purpose.`,
    r =>
      `${r} is functional. The market is open, the streets are swept, the guards are at their posts. Something is wrong anyway. It takes a moment to identify: there are no children playing in the street.`,
    r =>
      `The queue at the granary gate is the first thing you see in ${r}. Not a market queue, not a water queue — the organised, patient, daily queue of people who are waiting to receive what they are owed and are not certain they will receive it.`,
    r =>
      `${r} is orderly in the way that a settlement is orderly when order is being enforced. The streets are clear. The rationing markers are painted on the doors. A guard patrol passes and everyone steps aside.`,
    r =>
      `The dogs of ${r} are gone. It takes a while to notice and longer to stop noticing, and nobody in the settlement will discuss it with a stranger.`,
    r =>
      `Prices chalked outside ${r}'s market gate have been rubbed out and rewritten so often the board has gone grey. The numbers on it now are polite fictions; the real trading happens in back rooms, in kind.`,
  ],
  occupied: [
    r =>
      `The flags above ${r}'s gatehouse are not the settlement's own. Two soldiers at the gate — their uniform is not local. They look at your papers with the particular expression of people who have been told to look at papers.`,
    r =>
      `${r} looks normal from the approach. It is only at the gate that the nature of normal becomes apparent: the guard asks where you are from, writes it down, and asks how long you intend to stay. This is not the usual question.`,
    r =>
      `The approach to ${r} looks like any other settlement. There is graffiti on the wall near the gate that someone has attempted to scrub off. The symbol is still readable.`,
    r =>
      `${r} is going about its business. The market is open, the streets are busy, the gates are attended by soldiers whose armour is not local. Everyone is doing what they are supposed to be doing, which is the point.`,
    r =>
      `${r}'s street signs have been repainted in two languages, the local one second. The new lettering is neat, official, and everywhere — which is how you learn the occupation intends to stay.`,
    r =>
      `At ${r}'s gate the queue divides in two: residents with papers, and everyone else. The residents' line is longer and moves slower, and no one in it complains where the soldiers can hear.`,
  ],
  politically_fractured: [
    r =>
      `${r} has two gates. The eastern one is controlled by one faction, the western by another — you can tell by the pennants. The road you are on leads to the eastern gate.`,
    r =>
      `The gate guard at ${r} asks where you intend to stay — which inn, which district. The answer apparently matters. They note it and say nothing further.`,
    r =>
      `The road into ${r} has been marked. Symbols painted on fence posts and milestone stones — the same symbol, repeated, belonging to one faction or another. Someone has been doing this recently; the paint is fresh.`,
    r =>
      `${r} is quieter than it should be. Not the quiet of a sleeping town or a working one — the particular quiet of a place where people have learned to be careful about what they say in earshot of strangers.`,
    r =>
      `Two tax collectors work ${r}'s market — different sashes, different ledgers, studiously ignoring one another. Traders pay one, or the other, or both, according to calculations a visitor is not equipped to make.`,
    r =>
      `The council hall of ${r} is dark; the business of governing has moved to two different taverns at opposite ends of town. Which one you drink in has become a declaration.`,
  ],
  indebted: [
    r =>
      `${r} is in reasonable shape. The walls are standing, the market is functioning, the main street is paved. The paving needs repair. The wall has a section of new brick that doesn't quite match the old. The repairs that needed doing five years ago are still waiting.`,
    _r =>
      "A building near the gate has a new sign — an institution that wasn't there last season, with a name that is recognisably the name of an outside creditor. Someone has arrived and set up an office. This is not a good sign.",
    r =>
      `${r} functions. The market is busy enough. The streets are clean enough. The civic buildings are maintained enough. 'Enough' is doing a lot of work in every impression.`,
    r =>
      `The merchant district of ${r} looks prosperous. The rest of the settlement, visible further in, looks like it has been waiting for the merchant district's prosperity to reach it for some years.`,
    r =>
      `The finest building in ${r} is new, stone-built, and belongs to nobody local — a counting house, its brass plate polished daily by a clerk who arrived with the ledgers. It is what everything else in town is working to pay for.`,
    r =>
      `${r} holds a market day that has quietly become a collection day: the stalls pay their pitch fees to a factor before they sell a thing, and the factor's book has more names in it than the market has stalls.`,
  ],
  recently_betrayed: [
    r =>
      `The guard at ${r}'s gate is polite, thorough, and writes down more than guards usually write down. You are asked your business three times, by three different people, in the space of five minutes.`,
    r =>
      `Something happened in ${r} recently. You cannot immediately say what, but the settlement has the quality of a place that is still processing something — hushed conversations, people watching the street.`,
    r =>
      `There are notices posted at the gate of ${r}. You take a moment to read one: it is asking for information about a specific event, with a contact at the council offices. The date on the notice is recent.`,
    r =>
      `${r} looks ordinary from the approach. It is only in the expressions of the people at the gate — watchful in a specific, tired way — that something registers.`,
    r =>
      `${r} has new locks. You can see the bright hasps on doors and shutters as you walk in — ironmongery bought all at once, recently, by people who used not to need it.`,
    r =>
      `Conversation in ${r}'s common room stops at the creak of the door-hinge, resumes a beat later, carefully general. Whatever happened here, everyone has already said everything they intend to say about it.`,
  ],
  infiltrated: [
    r =>
      `${r} looks exactly like it should. The gate is attended, the market sounds busy, there is nothing remarkable about the approach. Everything is as it should be.`,
    r =>
      `The approach to ${r} is unremarkable in every respect. Gate, road, market noise, smoke, the usual questions from the guard. Nothing to note.`,
    r =>
      `${r} looks normal. There is a moment at the gate — a guard glancing at another guard after you answer a question — that is probably nothing.`,
    r =>
      `${r} is functioning well. Clean streets, busy market, maintained walls. If you were looking for problems, you would not find them from the outside.`,
    r =>
      `Nothing in ${r} is out of place. The watch changes on the hour, the market closes at dusk, the innkeeper remembers your name on the second morning. It is all exactly as a well-run town should be.`,
    r =>
      `${r} welcomes travellers with practised ease — a good inn, fair prices, incurious guards. A week later you would struggle to say why the ease sat strangely. It was practised.`,
  ],
  plague_onset: [
    r =>
      `The approach to ${r} is interrupted by a checkpoint a quarter mile from the gates — a temporary structure, manned by people wearing cloth over their faces. They want to know where you came from and when.`,
    r =>
      `${r}'s gate is open, the market is running, and there are people in the street. People are giving each other slightly more space than usual. A cart passes with barrels marked with an unfamiliar symbol — you have seen that symbol once before, on a quarantine notice.`,
    r =>
      `Near the gate of ${r} there is a temporary shelter — a healer's station, by the look of it, with two attendants and a queue. The queue is not yet long. That is either good or early.`,
    r =>
      `Some of ${r}'s market stalls are closed. Not all, not most — but several, in a pattern that isn't about the day of the week. The ones that are open are busy; the ones that are closed have been for a while.`,
    r =>
      `${r}'s gate stands open, but the gatekeeper waves you through from a distance, and the well just inside has been roped off under a painted sign too weathered to read from horseback.`,
    r =>
      `Smoke rises from ${r} at midday — not cookfires but something being burned deliberately, bedding or clothes, in a yard behind the healer's house. The street watches it burn and says nothing.`,
  ],
  succession_void: [
    r =>
      `There are two sets of pennants above ${r}'s main gate — different colours, same height. Someone made a decision to hang them both and has committed to maintaining the ambiguity.`,
    r =>
      `${r} has the specific quality of a settlement waiting for news. People are going about their business, but there is a particular alertness to the street — people checking who is talking to whom.`,
    r =>
      `The road into ${r} has been busy recently. You can tell by the wheel ruts, the quality of the mud, the number of horses at the inn you pass on the approach. Something is happening that requires people to arrive quickly.`,
    r =>
      `${r} functions, after a fashion. The market is open, the gates are attended. The flagpole above the council building is empty. Someone removed the standard and hasn't replaced it yet.`,
    r =>
      `The masons of ${r} have stopped mid-job on the great house; scaffolding stands empty on dressed stone. Work that fine waits on a patron, and the town is not currently sure who that is.`,
    r =>
      `In ${r}'s taproom the toast is to "the settlement" — a formulation everyone has adopted at once, smooth as furniture, since naming anyone more specific has become a wager.`,
  ],
  monster_pressure: [
    r =>
      `${r} is more fortified than its size suggests. The walls are new — or newly repaired, the mortar still pale. There are more torches at the gate than a settlement like this would normally need.`,
    r =>
      `The farms outside ${r} are partially abandoned. You count three sets of buildings that have not been worked recently — the fields untended, the doors standing open. The settlement's wall is a quarter mile closer than it would have been three months ago.`,
    r =>
      `${r}'s gate is attended by its usual guards and, less usually, by several people in road-worn equipment who are clearly not local and clearly not merchants. The settlement is paying for help.`,
    r =>
      `${r} is going about its business, but the business includes people you wouldn't normally see on a market day: hunters checking arrows, a blacksmith working past dark, a group of militia running a drill in the square visible from the gate.`,
    r =>
      `The road into ${r} runs its last mile between new watchtowers — timber, hasty, manned. Whatever they watch for, the fields between them have been let go to seed.`,
    r =>
      `${r} buys arrows. The fletcher's is the busiest shop in the settlement, and the militia board outside the gate lists a standing bounty in terms that carefully avoid naming what it is for.`,
  ],
  insurgency: [
    r =>
      `The approach to ${r} is ordinary until you notice what is missing: no toll-keeper at the gate, no one collecting the road tax a settlement this size always collects. The guards are present, but they are watching the town, not the road.`,
    r =>
      `${r}'s gate stands open and unmanned. Further in, two different sets of notices are posted on the same wall — one in the formal hand of the authorities, one hand-lettered and torn at the corner. Someone tears down the second kind. Someone keeps putting them back.`,
    r =>
      `There are soldiers on ${r}'s streets, but they move in pairs and do not linger. The people watch them pass with the particular blankness of a place that has already decided which side it is on and is waiting to be asked.`,
    r =>
      `${r} looks governed, and is not, quite. The market runs, the watch patrols, the council building is occupied. But the orders that leave that building are not always the orders that get followed, and everyone in the street knows which is which.`,
    r =>
      `The garrison of ${r} patrols in daylight only, and along routes a stranger could predict by the third day. After dark the town belongs to whoever it belongs to.`,
    r =>
      `Someone has been chalking a sign on ${r}'s walls faster than the watch can scrub it. By now the scrubbed patches themselves mark every corner — the censorship has become the graffiti.`,
  ],
  mass_migration: [
    r =>
      `The road into ${r} is crowded — not with merchants but with families, carts piled with household goods, people who are clearly not from here and clearly not passing through. The gate guard has stopped checking papers. There are too many.`,
    r =>
      `${r} has grown a second settlement outside its walls — tents and lean-tos and cookfires on the ground that used to be common pasture. The people there watch you approach with the wariness of those who arrived too late to get inside.`,
    r =>
      `Half of ${r} seems to be leaving. You pass loaded wagons heading the other way on the road, and inside the walls there are shuttered houses and shops with their goods already gone. Those who remain have the look of people deciding whether to be next.`,
    r =>
      `${r}'s market speaks three languages you can pick out and more you cannot. The old families and the newcomers trade at the same stalls and do not quite look at each other. Everyone is doing business. No one is comfortable.`,
    r =>
      `The road to ${r} has acquired a verge of graves — recent, orderly, unmarked but tended. People arrived here in numbers, and not all of them finished the journey.`,
    r =>
      `${r}'s smithy has a queue for wheel-rims and none for ploughshares. A town where the carts outnumber the fields is a town in the middle of someone's arithmetic about leaving.`,
  ],
  wartime: [
    r =>
      `The road to ${r} has been rutted deep by heavy wagons moving in one direction — toward the settlement loaded, away from it loaded differently. At the gate a clerk in crown colours records what comes and goes. This is not a market town's traffic.`,
    r =>
      `${r}'s young men are not in ${r}. You notice it at the gate and it holds true inside: the people working the stalls and the fields are the old, the very young, and the women. A recruiting notice is nailed to the gatepost, its edges soft with weather.`,
    r =>
      `There are more soldiers than citizens visible on ${r}'s main street, and the citizens are the ones stepping aside. A requisition column is being loaded in the square — grain, cloth, iron, and the settlement's own carts to carry it away.`,
    r =>
      `${r} is prosperous in a way that feels wrong. The forges work past dark, the warehouses are full, the coin is moving — and all of it points one direction, toward a war that is not fought here but is paid for here.`,
    r =>
      `${r}'s noticeboard is a wall of requisition orders, each stamped, each superseding the last. At its foot, a smaller paper, hand-lettered: prayers offered nightly, all welcome.`,
    r =>
      `The horses in ${r}'s paddocks are old, or lame, or foals. Every sound animal of working age has a receipt where it used to be, and the receipts do not say when the crown returns them.`,
  ],
  religious_conversion: [
    r =>
      `Two temples face each other across ${r}'s central square, and only one has a queue. The other's doors are open but its steps are swept too clean, walked on too little. Something has moved from one building to the other, and it was not only worshippers.`,
    r =>
      `The shrine at ${r}'s gate has been recently altered — one symbol chiselled away, another set in its place, the old outline still faintly visible beneath the new. Someone did this carefully. Someone else has been scratching at the replacement.`,
    r =>
      `${r} is observing a holy day, and you cannot tell which one. Some shops are shut and draped; others are pointedly open. Two processions are forming in different quarters, and the people watching each are counting who watches the other.`,
    r =>
      `The bells of ${r} ring at competing times — one set of chimes answered a beat later by another, from a different quarter, slightly out of tune with the first. No one seems to find this strange, which is the strangest part.`,
    r =>
      `The mason's yard in ${r} is its busiest enterprise: one set of holy symbols coming down, another going up, and the same three workmen paid for both. They no longer joke about it.`,
    r =>
      `${r} has two burial grounds now, one old and one new, and the town's grief is learning to sort itself accordingly. The gravedigger serves both and is the most carefully neutral man alive.`,
  ],
  slave_revolt: [
    r =>
      `${r}'s gates are shut in daylight, which is wrong for a settlement of its size. There is smoke inside — not cookfire smoke, too much and too dark. On the wall, the guards face inward, toward their own streets, not out toward you.`,
    r =>
      `The approach to ${r} is blocked by a hasty checkpoint — overturned carts, armed men who are not the regular watch, a hard question about your business before you are allowed within sight of the gate. Whatever is happening inside, they have decided strangers are a risk.`,
    r =>
      `${r} is quiet in the way a held breath is quiet. The slave market at its heart — you can see the empty auction platform from the gate — stands deserted, ringed by guards. The chains are still there. The people who wore them are not.`,
    r =>
      `There are bodies being carried through ${r}'s streets under cloth, and the people carrying them are not mourners but labourers doing grim, fast work. The rising that did this is not finished; you can hear it, somewhere in the lower districts, still going on.`,
    r =>
      `The manacle-maker's shop in ${r} is shuttered and scorched — the only burned building on the street, which tells you the fire was a statement, not an accident.`,
    r =>
      `${r}'s field gangs work without overseers today, or the overseers have dressed like the gangs. From the road you cannot tell which, and that is the whole story of the settlement this season.`,
  ],
};

export const STRESS_NOTES = {
    under_siege: [
      'What the founders built is now being tested by forces they could not have anticipated. The original reasons for settling here have become irrelevant to immediate survival.',
      'The site was chosen for trade, water, and good ground — none of which matters to the people now deciding whether its walls can hold.',
      'Every founding is a bet that a place can be kept. The wager has finally been called, generations after the founders stopped being able to lose it.',
    ],
    famine: [
      'The settlers who chose this land did so because it seemed fertile and promising. The current harvest failures would be unrecognisable to them.',
      'This ground fed the founders well enough to make them stay. The people living on it now measure it by a different arithmetic: not what it gave, but what it still owes.',
      'The land that drew the first families here has not changed. The weather, the yields, and the margins have, and the founders left no instructions for this.',
    ],
    occupied: [
      'The original settlement was founded with a degree of independence that no longer exists. The current administration answers to outside authority.',
      "The founders came here, in part, to be far from other people's authority. The distance is unchanged; the authority arrived anyway.",
      "Whatever charter or courage the founding rested on, it assumed the settlement's decisions would be its own. That assumption has been formally corrected.",
    ],
    politically_fractured: [
      'The settlement was founded by people who agreed on its purpose. That consensus no longer exists.',
      'The founding required its people to pull in one direction. The pulling continues; the direction is now the dispute.',
      'What the founders shared — a purpose, a danger, a road out of somewhere worse — held their descendants together only as long as it was remembered. It is no longer remembered the same way twice.',
    ],
    indebted: [
      'The original settlers built something valuable. Their descendants have borrowed against it until the debt outweighs the asset.',
      'The founders left an inheritance; each generation since has drawn on it a little more easily than the last. The ease was the warning nobody read.',
      'What was built here was solid enough to borrow against, which is precisely what happened, repeatedly, until the building belonged to the borrowing.',
    ],
    recently_betrayed: [
      "The founding required trust among a small group of people. That trust has recently been violated in a way that echoes the founding's original fragility.",
      'Settlements begin as promises kept between a few families. This one has just been reminded what it costs when the promise is broken from inside.',
      'The founders survived by trusting each other because they had no alternative. Their descendants had an alternative, and one of them took it.',
    ],
    infiltrated: [
      'The settlement was founded by people who knew each other. Somewhere in the current population, that familiarity is being exploited.',
      'A town this size still runs on recognising faces. Someone has learned exactly how much that recognition can be made to carry.',
      'The founding families could account for every soul inside the walls. That accounting is still the settlement\'s habit — which is what makes the error in it so useful to whoever is the error.',
    ],
    plague_onset: [
      'The settlers chose this location for its resources and access. Disease does not respect those original calculations.',
      'The roads and river that made this a good place to settle are the same roads and river the sickness travelled. The founding advantage has changed sides.',
      'The site was picked so that things would arrive here easily. Things still do.',
    ],
    succession_void: [
      'The founding generation is gone. What remains is contested — in ways the founders did not anticipate and did not plan for.',
      'The founders decided many things, but never who decides once they were gone; that gap has finally reached the head of the table.',
      'Every institution here descends from someone who is dead, and the descent is precisely what is now in question.',
    ],
    monster_pressure: [
      'The founding required pushing into terrain that was not entirely safe. That calculation is being revisited.',
      'The first settlers weighed the danger of this ground against its worth and chose to stay. The weighing has reopened, and this time the ground gets a vote.',
      'The land gave the founders room on terms nobody wrote down. Something out there has started enforcing them.',
    ],
    insurgency: [
      'The settlement was founded on an authority its people once accepted. That acceptance has been withdrawn, and no one has agreed on what should replace it.',
      "Whoever founded this place assumed that governing it would remain possible. Governing has quietly become the settlement's least settled question.",
      'The order the founders established outlived their reasons for it. What remains is the order alone, and orders alone do not hold.',
    ],
    mass_migration: [
      'The founders built for a fixed number of people who knew each other. The population that now fills these walls is neither fixed nor familiar.',
      'The settlement was measured, at its founding, for the families that made it. The measurement is still visible everywhere — in streets, wells, and patience — and everything about it is now too small.',
      'The founders knew every name inside the walls. The walls remain; the arithmetic of names has broken.',
    ],
    wartime: [
      'The settlement was founded for trade and quiet increase. It now serves a war effort that its founders never imagined and would not recognise.',
      'Nothing in the founding of this place anticipated a war — its site, its trades, its debts were all chosen for peace. The war did not consult the founders.',
      'The founders built a market town. Somewhere far away, a quartermaster reclassified it.',
    ],
    religious_conversion: [
      'The founding was blessed under a faith that is no longer ascendant here. The oaths and endowments made in its name are now contested ground.',
      'The first stones were laid with prayers this settlement no longer says. What was promised in those prayers — land, duty, protection — has outlasted the saying of them.',
      'The settlement was consecrated once, thoroughly, in a faith now out of favour. Consecration, it turns out, is easier to perform than to transfer.',
    ],
    slave_revolt: [
      'The settlement was built on a labour it did not count as its people. That reckoning, deferred since the founding, has arrived all at once.',
      'From its first season this place ran on hands it never numbered among its own. The ledger was always going to be opened; the founding merely set the date.',
      'The founders built with labour they owned and prosperity they kept. Both clauses of that arrangement are now being renegotiated by the other party.',
    ],
  };
