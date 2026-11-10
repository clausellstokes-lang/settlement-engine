// narrativeData.js — PURE DATA (A+ Track H / data-schema.3).
//
// The two executable template tables that drew randomness at render time —
// PRESSURE_SENTENCES (succession_void calls rng) and POLITICAL_FLAVOR (closures
// call pickRandom2) — were moved to src/generators/narrativeText.js, which is
// allowed to import from the generators layer. This file now holds only pure
// string tables: no runtime imports, no RNG capture. Covered by the src/data
// purity lint (eslint.config.js) + tests/domain/dataPurity.test.js.

// THE CRISIS-SCOPED FLAGS (CENSUS-2e unit 1, R-AF): the ledger's opted ARRIVAL_SCENES pools; in these a line
// that says nothing of a crisis is calm. The arrival site's wiring passes `crisisScoped: true` for them.
export const ARRIVAL_SCENES_CRISIS_SCOPED = Object.freeze(['market', 'ordinary']);

export const ARRIVAL_SCENES = {
  market: [
    { text: (r) =>
      `The market at ${r} is audible before it is visible: a specific mix of voices, animals, and the percussion of commerce that no other combination of sounds quite replicates.`, crisis: ['any'] },
    (r) =>
      `${r}'s market day has the comfortable chaos of something that has been happening in the same place for a long time and has worked out most of its problems.`,
    { text: (r) =>
      `The road into ${r} is thick with carts by mid-morning, all of them heading for the same square, and the traffic tells you where the settlement's heart is before you can see it.`, crisis: ['any'] },
    { text: (r) =>
      `You reach ${r} against a tide of people leaving it. The market has ended for the day, and the settlement is exhaling its visitors back onto the roads with their purchases and their news.`, crisis: ['any'] },
  ],
  river: [
    (r) =>
      "The smell of the river reaches you before the settlement does: clean water, reeds, the particular mud of a working waterfront.",
    (r) =>
      `${r} runs along the water the way settlements do when water is the reason they exist: practical, a little chaotic at the waterfront, tidier as you move inland.`,
    { text: (r) =>
      `The river carries the sounds of ${r} to you around the bend before the buildings appear: a mill wheel, the knock of boats against a jetty, someone calling a tally across the water.`, needs: ['institution: mill'] },
    (r) =>
      `${r} has its back to the land and its face to the river; the approach by road brings you in the rear way, past the yards and the drying nets, into a settlement that plainly considers the water its front door.`,
  ],
  port: [
    (r) =>
      `The harbour at ${r} announces itself beyond the last rise: masts above the roofs, gulls wheeling over the quays, and salt bright in the air.`,
    (r) =>
      `${r} faces the sea as deliberately as a fortress faces its enemy. Warehouses and chandlers crowd the waterfront, with the older streets climbing behind them.`,
    (r) =>
      `You hear ${r}'s harbour before you see it: rigging knocking against masts, dock crews calling cargo tallies, and surf working against the outer wall.`,
    (r) =>
      `The road into ${r} descends toward a forest of masts. Tar, salt, fish, and woodsmoke mark the boundary between the coast and the working port.`,
  ],
  smoke: [
    { text: (r) =>
      `The cookfire smoke of ${r} drifts on the wind in your direction: a hundred fires, each with its own particular fuel, combining into something that smells like inhabited place.`, needs: ['population: ≥ middling'] },
    (r) => `${r} is visible as a smear of smoke on the horizon for a long time before the buildings resolve.`,
    (r) =>
      `You smell ${r} before anything else: woodsmoke and bread and livestock, the layered scent of a place where people have been living close together and cooking the same suppers for generations.`,
    (r) =>
      `The smoke above ${r} stands straight up in the still air, a dozen thin columns that mark the settlement's shape on the sky like a map drawn in grey.`,
  ],
  guild: [
    { text: (r) =>
      `The sound of a hammer on metal reaches you from ${r}'s smithing quarter: a craftsperson's rhythm, not a soldier's.`, needs: ['institution: smith'] },
    (r) => `${r} smells of work: sawdust, tallow, the particular sharp smell of a tanner at the edge of town.`,
    (r) =>
      `${r} announces its trade before its name: the whine of a lathe, the reek of the dye-vats, a workshop door standing open on a scene of unhurried, practised industry.`,
    { text: (r) =>
      `The approach to ${r} is lined with the overflow of its crafts: timber stacked to season, half-finished goods under eaves, the settlement's work spilling out past its walls for want of room inside.`, needs: ['walls'] },
  ],
  ordinary: [
    (r) =>
      `${r} is ordinary in the best sense: a place where people live and work and argue and sleep, which is most of what places are for.`,
    { text: (r) =>
      `The road into ${r} becomes a street at a point you can't precisely identify. The settlement grows around you gradually.`, crisis: ['any'] },
    (r) =>
      `${r} is neither impressive nor disappointing from the approach. It is what it is, which is a working settlement of reasonable size doing reasonable things.`,
    { text: (r) =>
      `A child runs past you on the road into ${r}, chasing something or being chased by something (unclear which). Nobody in the street pays attention.`, crisis: ['any'] },
    { text: (r) =>
      `A merchant argues with a carter on the road into ${r} about the size of a load. Nobody else pays them any attention. This is clearly a daily occurrence.`, crisis: ['any'] },
    { text: (r) =>
      `The first person you meet on the road into ${r} wants to know your business, and the second already knows it.`, crisis: ['any'] },
  ],
};

// ARRIVAL_ADDONS RETIRED 2026-10-02 (the Voice Program wave 3): a second approach
// sentence appended after the arrival scene's opener, which restated it ("The harbour
// at X announces itself…" then "The harbour of X announces itself…"). The scene's
// beats after the opener now speak of the place itself (src/generators/narrative/arrivalScene.js).

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
    { text: r =>
      `The gates of ${r} are closed. There are people on the walls. This is not the relaxed watch of a settlement going about its day. These are people watching the treeline. A runner comes out of the small side gate, sees your group, stops.`, needs: ['gate', 'walls'] },
    { text: r =>
      `${r}'s gates are open but attended: every person entering is noted, every cart searched. The guards are professional about it, which makes it worse. Professional means this has been happening long enough to become routine.`, needs: ['gate', 'guardPresence'] },
    { text: r =>
      `From the road, ${r} looks ordinary. Smoke from cookfires, the sound of a market. It is only at the gate that the weight becomes apparent: the guards' expressions, the way conversation stops when strangers approach.`, needs: ['gate', 'market', 'guardPresence'] },
    { text: r =>
      `The approach to ${r} is quieter than it should be for a settlement this size. The outlying farms are empty. The road has not been maintained recently. The settlement itself is intact, but everything around it has been abandoned to the walls.`, needs: ['walls'] },
    // CONTENT-GT-FINAL (Charge 4): every pool below grew +2. Selection is a single
    // pickRandom2 (draw-count invariant); the stressTypeContentWave probes are pool-robust
    // (they assert the scene opens on a member of the pool, not on fixed phrases).
    { text: r =>
      `The fields around ${r} were harvested early and badly: stubble cut in haste, carts gone. Whatever the walls are waiting for, the granaries inside are already keeping its schedule.`, needs: ['walls', 'institution: granary'] },
    { text: r =>
      `A thrown stone sits half-buried a hundred paces short of ${r}'s wall, left where it landed. Nobody has hauled it away. There are fresher things to attend to.`, needs: ['walls'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `${n} has drawn in on itself. Every family from the outlying fields is sleeping under a neighbour's roof, the livestock are penned between the houses, and someone is always watching the treeline.`,
    (n) => `There are campfires on the hill above ${n}, and they are not ${n}'s. The people inside keep their own fires low and their voices lower, and they count the strangers' fires every night.`,
    (n) => `Carts and timber block the lanes into ${n}, piled in a hurry and manned around the clock. The faces behind them are farmers' faces, and none of them has slept.`,
  ],
  famine: [
    { text: r =>
      `${r} looks prosperous in the merchant quarter: new paint, loaded carts, a market stall with produce. It is only when you walk further in that the other version of the settlement appears: shuttered houses, people sitting on doorsteps with no particular purpose.`, needs: ['market'] },
    { text: r =>
      `${r} is functional. The market is open, the streets are swept, the guards are at their posts. Something is wrong anyway. It takes a moment to identify: there are no children playing in the street.`, needs: ['market', 'guardPresence'] },
    { text: r =>
      `The queue at the granary gate is the first thing you see in ${r}. Not a market queue, not a water queue: the organised, patient, daily queue of people who are waiting to receive what they are owed and are not certain they will receive it.`, needs: ['institution: granary'] },
    { text: r =>
      `${r} is orderly in the way that a settlement is orderly when order is being enforced. The streets are clear. The rationing markers are painted on the doors. A guard patrol passes and everyone steps aside.`, needs: ['guardPresence'] },
    r =>
      `The dogs of ${r} are gone. It takes a while to notice and longer to stop noticing, and nobody in the settlement will discuss it with a stranger.`,
    { text: r =>
      `Prices chalked outside ${r}'s market gate have been rubbed out and rewritten so often the board has gone grey. The numbers on it now are polite fictions; the real trading happens in back rooms, in kind.`, needs: ['market'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `The smoke from ${n}'s chimneys is thin. People here look at your pack before they look at your face, and then look away, ashamed of having looked.`,
  ],
  occupied: [
    { text: r =>
      `The flags above ${r}'s gatehouse are not the settlement's own. Two soldiers at the gate. Their uniform is not local. They look at your papers with the particular expression of people who have been told to look at papers.`, needs: ['gate'] },
    { text: r =>
      `${r} looks normal from the approach. It is only at the gate that the nature of normal becomes apparent: the guard asks where you are from, writes it down, and asks how long you intend to stay. This is not the usual question.`, needs: ['gate', 'guardPresence'] },
    { text: r =>
      `The approach to ${r} looks like any other settlement. There is graffiti on the wall near the gate that someone has attempted to scrub off. The symbol is still readable.`, needs: ['gate'] },
    { text: r =>
      `${r} is going about its business. The market is open, the streets are busy, the gates are attended by soldiers whose armour is not local. Everyone is doing what they are supposed to be doing, which is the point.`, needs: ['market', 'gate'] },
    r =>
      `${r}'s street signs have been repainted in two languages, the local one second. The new lettering is neat, official, and everywhere, which is how you learn the occupation intends to stay.`,
    { text: r =>
      `At ${r}'s gate the queue divides in two: residents with papers, and everyone else. The residents' line is longer and moves slower, and no one in it complains where the soldiers can hear.`, needs: ['gate'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `Strangers in foreign colours stand where the roads meet in ${n}, and the locals walk around them as if they were furniture nobody wanted.`,
  ],
  politically_fractured: [
    { text: r =>
      `${r} has two gates. The eastern one is controlled by one power, the western by another. You can tell by the pennants. The road you are on leads to the eastern gate.`, needs: ['gate'] },
    { text: r =>
      `The gate guard at ${r} asks where you intend to stay: which inn, which district. The answer apparently matters. They note it and say nothing further.`, needs: ['gate', 'institution: tavern', 'guardPresence'] },
    r =>
      `The road into ${r} has been marked. Symbols painted on fence posts and milestone stones: the same symbol, repeated, belonging to one power or another. Someone has been doing this recently; the paint is fresh.`,
    r =>
      `${r} is quieter than it should be. Not the quiet of a sleeping town or a working one: the particular quiet of a place where people have learned to be careful about what they say in earshot of strangers.`,
    { text: r =>
      `Two tax collectors work ${r}'s market: different sashes, different ledgers, studiously ignoring one another. Traders pay one, or the other, or both, according to calculations a visitor is not equipped to make.`, needs: ['market'] },
    { text: r =>
      `The council hall of ${r} is dark; the business of governing has moved to two different taverns at opposite ends of town. Which one you drink in has become a declaration.`, needs: ['institution: tavern'] },
  ],
  indebted: [
    { text: r =>
      `${r} is in reasonable shape. The walls are standing, the market is functioning, the main street is paved. The paving needs repair. The wall has a section of new brick that doesn't quite match the old. The repairs that needed doing five years ago are still waiting.`, needs: ['walls', 'market'], excludes: ['crisis: threat'] },
    { text: _r =>
      "A building near the gate has a new sign, freshly painted with the name of an outside creditor. The creditor has opened an office here, and the locals walk past it without looking in.", needs: ['gate'] },
    { text: r =>
      `${r} gets by. The market is busy enough, the streets clean enough and the civic buildings kept up just enough, and nothing more is being spent.`, needs: ['market'] },
    r =>
      `The merchant district of ${r} looks prosperous. The rest of the settlement, visible further in, looks like it has been waiting for the merchant district's prosperity to reach it for some years.`,
    r =>
      `The finest building in ${r} is new, stone-built, and belongs to nobody local: a counting house, its brass plate polished daily by a clerk who arrived with the ledgers. It is what everything else in town is working to pay for.`,
    { text: r =>
      `${r} holds a market day that has quietly become a collection day: the stalls pay their pitch fees to a factor before they sell a thing, and the factor's book has more names in it than the market has stalls.`, needs: ['market'] },
  ],
  recently_betrayed: [
    { text: r =>
      `The guard at ${r}'s gate is polite, thorough, and writes down more than guards usually write down. You are asked your business three times, by three different people, in the space of five minutes.`, needs: ['gate', 'guardPresence'] },
    r =>
      `Something has happened in ${r} lately. Conversations drop to a murmur as you pass, and people watch the street from their doorways.`,
    { text: r =>
      `There are notices posted at the gate of ${r}. You take a moment to read one: it is asking for information about a specific event, with a contact at the council offices. The date on the notice is recent.`, needs: ['gate'] },
    { text: r =>
      `${r} looks ordinary from the approach. It is only in the expressions of the people at the gate (watchful in a specific, tired way) that something registers.`, needs: ['gate'] },
    r =>
      `${r} has new locks. You can see the bright hasps on doors and shutters as you walk in: ironmongery bought all at once, recently, by people who used not to need it.`,
    { text: r =>
      `Conversation in ${r}'s common room stops at the creak of the door-hinge, resumes a beat later, carefully general. Whatever happened here, everyone has already said everything they intend to say about it.`, needs: ['institution: tavern'] },
  ],
  infiltrated: [
    { text: r =>
      `${r} looks exactly like it should. The gate is attended, the market sounds busy, there is nothing remarkable about the approach. Everything is as it should be.`, needs: ['gate', 'market'], excludes: ['crisis: threat', 'crisis: hunger', 'crisis: succession', 'crisis: unrest'] },
    { text: r =>
      `The approach to ${r} is unremarkable in every respect. Gate, road, market noise, smoke, the usual questions from the guard. Nothing to note.`, needs: ['gate', 'market', 'guardPresence'], excludes: ['crisis: threat', 'crisis: hunger', 'crisis: succession', 'crisis: unrest'] },
    { text: r =>
      `${r} looks normal. There is a moment at the gate (a guard glancing at another guard after you answer a question) that is probably nothing.`, needs: ['gate', 'guardPresence'] },
    { text: r =>
      `${r} is functioning well. Clean streets, busy market, maintained walls. If you were looking for problems, you would not find them from the outside.`, needs: ['market', 'walls'], excludes: ['crisis: threat', 'crisis: hunger', 'crisis: succession', 'crisis: unrest'] },
    { text: r =>
      `Nothing in ${r} is out of place. The watch changes on the hour, the market closes at dusk, the innkeeper remembers your name on the second morning. It is all exactly as a well-run town should be.`, needs: ['watch', 'market', 'institution: tavern'], excludes: ['crisis: threat', 'crisis: hunger', 'crisis: succession', 'crisis: unrest'] },
    { text: r =>
      `${r} welcomes travellers with practised ease: a good inn, fair prices, incurious guards. A week later you would struggle to say why the ease sat strangely. It was practised.`, needs: ['institution: tavern', 'guardPresence'], excludes: ['crisis: hunger'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `${n} is friendly. Everyone you meet is helpful, and everyone you meet asks one question more than they need to: where you are going next, and who you know there.`,
    { text: (n) => `${n} runs smoothly, almost too smoothly. Quarrels that should be loud are settled quietly and fast, and nobody can quite tell you who settled them.`, excludes: ['crisis: unrest'] },
    (n) => `In ${n} the same stranger seems to turn up wherever you go: at the well, on the road, at the edge of every conversation. He never says much. He never needs to.`,
  ],
  plague_onset: [
    { text: r =>
      `The approach to ${r} is interrupted by a checkpoint a quarter mile from the gates: a temporary structure, manned by people wearing cloth over their faces. They want to know where you came from and when.`, needs: ['gate'] },
    { text: r =>
      `${r}'s gate is open, the market is running, and there are people in the street. People are giving each other slightly more space than usual. A cart passes with barrels marked with an unfamiliar symbol. You have seen that symbol once before, on a quarantine notice.`, needs: ['gate', 'market'] },
    { text: r =>
      `Near the gate of ${r} there is a temporary shelter: a healer's station, by the look of it, with two attendants and a queue. The queue is not yet long. That is either good or early.`, needs: ['gate', 'healer'] },
    { text: r =>
      `Some of ${r}'s market stalls are closed. Not all, not most, but several, in a pattern that isn't about the day of the week. The ones that are open are busy; the ones that are closed have been for a while.`, needs: ['market'] },
    { text: r =>
      `${r}'s gate stands open, but the gatekeeper waves you through from a distance, and the well just inside has been roped off under a painted sign too weathered to read from horseback.`, needs: ['gate'] },
    { text: r =>
      `Smoke rises from ${r} at midday: not cookfires but something being burned deliberately, bedding or clothes, in a yard behind the healer's house. The street watches it burn and says nothing.`, needs: ['healer'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `${n} smells of vinegar and woodsmoke. Doors that should be open are shut, and the people who do come out keep a careful distance from one another, and from you.`,
  ],
  succession_void: [
    { text: r =>
      `There are two sets of pennants above ${r}'s main gate: different colours, same height. Someone made a decision to hang them both and has committed to maintaining the ambiguity.`, needs: ['gate'] },
    r =>
      `${r} has the specific quality of a settlement waiting for news. People are going about their business, but there is a particular alertness to the street: people checking who is talking to whom.`,
    { text: r =>
      `The road into ${r} has been busy recently. You can tell by the wheel ruts, the quality of the mud, the number of horses at the inn you pass on the approach. Something is happening that requires people to arrive quickly.`, needs: ['institution: tavern'] },
    { text: r =>
      `${r} functions, after a fashion. The market is open, the gates are attended. The flagpole above the council building is empty. Someone removed the standard and hasn't replaced it yet.`, needs: ['market', 'gate'] },
    r =>
      `The masons of ${r} have stopped mid-job on the great house; scaffolding stands empty on dressed stone. Work that fine waits on a patron, and the town is not currently sure who that is.`,
    { text: r =>
      `In ${r}'s taproom the toast is to "the settlement": a formulation everyone has adopted at once, smooth as furniture, since naming anyone more specific has become a wager.`, needs: ['institution: tavern'] },
  ],
  monster_pressure: [
    { text: r =>
      `${r} is more fortified than its size suggests. The walls are new (or newly repaired), the mortar still pale. There are more torches at the gate than a settlement like this would normally need.`, needs: ['walls', 'gate'] },
    { text: r =>
      `The farms outside ${r} are partially abandoned. You count three sets of buildings that have not been worked recently: the fields untended, the doors standing open. The settlement's wall is a quarter mile closer than it would have been three months ago.`, needs: ['walls'] },
    { text: r =>
      `${r}'s gate is attended by its usual guards and, less usually, by several people in road-worn equipment who are clearly not local and clearly not merchants. The settlement is paying for help.`, needs: ['gate', 'guardPresence'] },
    { text: r =>
      `${r} is going about its business, but the business includes people you wouldn't normally see on a market day: hunters checking arrows, a blacksmith working past dark, a group of militia running a drill in the square visible from the gate.`, needs: ['market', 'institution: smith', 'militia', 'gate'] },
    r =>
      `The road into ${r} runs its last mile between new watchtowers: timber, hasty, manned. Whatever they watch for, the fields between them have been let go to seed.`,
    { text: r =>
      `${r} buys arrows. The fletcher's is the busiest shop in the settlement, and the militia board outside the gate lists a standing bounty in terms that carefully avoid naming what it is for.`, needs: ['militia', 'gate'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `${n} keeps its doors barred in daylight. Claw marks score the timber of the outermost houses, old ones and new ones, and the newest have not yet weathered.`,
    (n) => `Every household in ${n} keeps a spear by the door, and the children know which way to run. Nobody says what they would be running from. They say it is the woods.`,
    (n) => `Fresh earth marks a row of graves at the edge of ${n}, all dug in the same week. The people who dug them still glance at the treeline while they work.`,
  ],
  insurgency: [
    { text: r =>
      `The approach to ${r} is ordinary until you notice what is missing: no toll-keeper at the gate, no one collecting the road tax a settlement this size always collects. The guards are present, but they are watching the town, not the road.`, needs: ['gate', 'guardPresence'] },
    { text: r =>
      `${r}'s gate stands open and unmanned. Further in, two different sets of notices are posted on the same wall: one in the formal hand of the authorities, one hand-lettered and torn at the corner. Someone tears down the second kind. Someone keeps putting them back.`, needs: ['gate'] },
    { text: r =>
      `There are soldiers on ${r}'s streets, but they move in pairs and do not linger. The people watch them pass with the particular blankness of a place that has already decided which side it is on and is waiting to be asked.`, needs: ['soldiers'] },
    { text: r =>
      `${r} looks governed, and is not, quite. The market runs, the watch patrols, the council building is occupied. But the orders that leave that building are not always the orders that get followed, and everyone in the street knows which is which.`, needs: ['market', 'watch'] },
    { text: r =>
      `The garrison of ${r} patrols in daylight only, and along routes a stranger could predict by the third day. After dark the town belongs to whoever it belongs to.`, needs: ['garrison'] },
    { text: r =>
      `Someone has been chalking a sign on ${r}'s walls faster than the watch can scrub it. By now the scrubbed patches themselves mark every corner. The censorship has become the graffiti.`, needs: ['walls', 'watch'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `Slogans have been scratched into the doors of ${n} overnight and half scrubbed away by morning. People read them on the way past without stopping, which is how you know they agree.`,
  ],
  mass_migration: [
    { text: r =>
      `The road into ${r} is crowded: not with merchants but with families, carts piled with household goods, people who are clearly not from here and clearly not passing through. The gate guard has stopped checking papers. There are too many.`, needs: ['migration: influx', 'gate', 'guardPresence'] },
    { text: r =>
      `${r} has grown a second settlement outside its walls: tents and lean-tos and cookfires on the ground that used to be common pasture. The people there watch you approach with the wariness of those who arrived too late to get inside.`, needs: ['migration: influx', 'walls'] },
    // ONE DIRECTION (chair ruling 2, 2026-10-30): these two vignettes told a departure beside a crisis card that says
    // the town is receiving people; they now tell the arrival. Same count, so the draw does not move.
    { text: r =>
      `Half of ${r} seems to have arrived this year. You pass loaded wagons on the road heading in, and inside the walls every spare room has a family in it. Those who were here first have the look of people deciding how much more they can give.`, needs: ['migration: influx', 'walls'] },
    { text: r =>
      `${r}'s market speaks three languages you can pick out and more you cannot. The old families and the newcomers trade at the same stalls and do not quite look at each other. Everyone is doing business. No one is comfortable.`, needs: ['migration: influx', 'market'] },
    { text: r =>
      `The road to ${r} has acquired a verge of graves: recent, orderly, unmarked but tended. People arrived here in numbers, and not all of them finished the journey.`, needs: ['migration: influx'] },
    { text: r =>
      `${r}'s smithy has a queue for wheel-rims and none for ploughshares. A town where the carts outnumber the fields is a town still filling with people who came here with everything they own.`, needs: ['migration: influx', 'institution: smith'] },
  ],
  wartime: [
    { text: r =>
      `The road to ${r} has been rutted deep by heavy wagons moving in one direction: toward the settlement loaded, away from it loaded differently. At the gate a clerk in crown colours records what comes and goes. This is not a market town's traffic.`, needs: ['gate'] },
    { text: r =>
      `${r}'s young men are not in ${r}. You notice it at the gate and it holds true inside: the people working the stalls and the fields are the old, the very young, and the women. A recruiting notice is nailed to the gatepost, its edges soft with weather.`, needs: ['gate', 'market'] },
    { text: r =>
      `There are more soldiers than citizens visible on ${r}'s main street, and the citizens are the ones stepping aside. A requisition column is being loaded in the square: grain, cloth, iron, and the settlement's own carts to carry it away.`, needs: ['market', 'soldiers'] },
    { text: r =>
      `${r} is prosperous in a way that feels wrong. The forges work past dark, the warehouses are full, the coin is moving, and all of it points one direction, toward a war that is not fought here but is paid for here.`, needs: ['institution: smith'], excludes: ['crisis: hunger', 'crisis: under_siege', 'war: front'] },
    r =>
      `${r}'s noticeboard is a wall of requisition orders, each stamped, each superseding the last. At its foot, a smaller paper, hand-lettered: prayers offered nightly, all welcome.`,
    r =>
      `The horses in ${r}'s paddocks are old, or lame, or foals. Every sound animal of working age has a receipt where it used to be, and the receipts do not say when the crown returns them.`,
  ],
  religious_conversion: [
    { text: r =>
      `Two temples face each other across ${r}'s central square, and only one has a queue. The other's doors are open but its steps are swept too clean, walked on too little. Something has moved from one building to the other, and it was not only worshippers.`, needs: ['institution: temple', 'market'] },
    { text: r =>
      `The shrine at ${r}'s gate has been recently altered: one symbol chiselled away, another set in its place, the old outline still faintly visible beneath the new. Someone did this carefully. Someone else has been scratching at the replacement.`, needs: ['institution: temple', 'gate'] },
    r =>
      `${r} is observing a holy day, and you cannot tell which one. Some shops are shut and draped; others are pointedly open. Two processions are forming in different quarters, and the people watching each are counting who watches the other.`,
    { text: r =>
      `The bells of ${r} ring twice for every hour: one set of chimes, then another from a different quarter, a beat later and out of tune. Nobody in the street looks up.`, needs: ['institution: temple'] },
    r =>
      `The mason's yard in ${r} is its busiest enterprise: one set of holy symbols coming down, another going up, and the same three workmen paid for both. They no longer joke about it.`,
    r =>
      `${r} has two burial grounds now, one old and one new, and the town's grief is learning to sort itself accordingly. The gravedigger serves both and is the most carefully neutral man alive.`,
  ],
  slave_revolt: [
    { text: r =>
      `${r}'s gates are shut in daylight, which is wrong for a settlement of its size. There is smoke inside: not cookfire smoke, too much and too dark. On the wall, the guards face inward, toward their own streets, not out toward you.`, needs: ['gate', 'walls', 'guardPresence'] },
    { text: r =>
      `The approach to ${r} is blocked by a hasty checkpoint: overturned carts, armed men who are not the regular watch, a hard question about your business before you are allowed within sight of the gate. Whatever is happening inside, they have decided strangers are a risk.`, needs: ['gate', 'watch'] },
    { text: r =>
      `${r} is quiet in the way a held breath is quiet. The slave market at its heart (you can see the empty auction platform from the gate) stands deserted, ringed by guards. The chains are still there. The people who wore them are not.`, needs: ['market', 'gate', 'guardPresence'] },
    r =>
      `There are bodies being carried through ${r}'s streets under cloth, and the people carrying them are not mourners but labourers doing grim, fast work. The rising that did this is not finished; you can hear it, somewhere in the lower districts, still going on.`,
    r =>
      `The manacle-maker's shop in ${r} is shuttered and scorched: the only burned building on the street, which tells you the fire was a statement, not an accident.`,
    r =>
      `${r}'s field gangs work without overseers today, or the overseers have dressed like the gangs. From the road you cannot tell which, and that is the whole story of the settlement this season.`,
  ],
};

export const STRESS_NOTES = {
    under_siege: [
      'The founders chose this place for its trade, water and good ground. Now it is under siege, and none of that matters until the siege is broken.',
      'The site was chosen for trade, water, and good ground, none of which matters to the people now deciding whether its walls can hold.',
      'The founders built walls in case they were ever needed. They are needed now.',
    ],
    famine: [
      'The settlers chose this land because it fed them well. Now the harvests are failing and families are going hungry.',
      'This ground fed the founders well enough to make them stay. This year it has not fed their grandchildren.',
      'The land that drew the first families here is the same land, but the harvests have come in short, and the winter ahead will be hard.',
    ],
    occupied: [
      'The founders governed themselves. Now foreign officers give the orders, and the settlement\'s own rulers answer to them.',
      "The founders came here to be far from other people's rule. Other people rule it now.",
      'The founders assumed the settlement would always make its own decisions. Under occupation, it no longer does.',
    ],
    politically_fractured: [
      'The settlement was founded by people who agreed on its purpose. That consensus no longer exists.',
      'The founders pulled together in one direction. Their descendants work as hard, but no longer agree on where they are going.',
      'A shared purpose held the founders together. Their descendants remember that purpose differently, and the settlement has split along those lines.',
    ],
    indebted: [
      'The first settlers built something worth having. Their descendants have borrowed against it until the settlement owes more than it owns.',
      'Each generation since the founding has borrowed a little more against what the founders left. Now the lenders want it back.',
      'What the founders built was solid enough to borrow against, and it has been, again and again; the lenders now own much of it.',
    ],
    recently_betrayed: [
      'The settlement was founded by a few families who trusted each other. One of their own has just broken that trust.',
      'This settlement began as a promise between a few families, and someone inside has just broken it.',
      'The founders survived by trusting each other because they had no alternative. Their descendants had an alternative, and one of them took it.',
    ],
    infiltrated: [
      'The founders all knew each other, and the settlement still trusts familiar faces. Someone living here now is using that trust to hide.',
      'A place this size still trusts faces it knows, and one of those faces is not what it seems.',
      'The founding families could name every soul inside the walls, and the settlement still assumes it can. That is how someone who does not belong goes unnoticed.',
    ],
    plague_onset: [
      'The settlers chose this place for its roads and water. The sickness came in the same way.',
      'The roads and river that made this a good place to settle are the ones the sickness travelled.',
      'The site was picked so trade could reach it easily. The sickness reached it just as easily.',
    ],
    succession_void: [
      'The founding generation is gone, and nobody agrees who should lead now.',
      'The founders settled many things but never who would rule after them. Now the seat is empty, and rivals are fighting over it.',
      'Every office here was handed down from the founders, and now nobody can agree who it passes to.',
    ],
    monster_pressure: [
      'The founders knew this ground was dangerous and settled anyway. Now the danger has come back to the fields.',
      'The first settlers judged this land worth its dangers. With something coming out of the wild again, people are asking whether they were right.',
      'The founders cleared this land from the wild. Now something from the wild is coming back for it.',
    ],
    insurgency: [
      'The settlement was founded on an authority its people once accepted. That acceptance has been withdrawn, and no one has agreed on what should replace it.',
      'The founders assumed the settlement could always be governed. Now some of its own people are refusing to be.',
      'The rules the founders set have outlived the reasons for them, and people have stopped obeying.',
    ],
    mass_migration: [
      'The founders built for a few families who knew each other. Now newcomers crowd the streets, and half the faces are strangers.',
      'The settlement was laid out for the families that founded it. Its streets and wells were never meant for this many people.',
      'The founders knew every name inside the walls. Now no one does: too many have arrived too fast.',
    ],
    wartime: [
      'The settlement was founded for trade and quiet growth. Now it feeds and arms a war.',
      'Everything here was chosen for peace: the site, the trades, the debts. Now there is a war, and the settlement is paying for it.',
      'The founders built a place to trade. Now the army takes what the market used to sell.',
    ],
    religious_conversion: [
      'The founding was blessed under a faith that is no longer ascendant here. The oaths and endowments made in its name are now contested ground.',
      'The first stones were laid with prayers the settlement no longer says, and the land and duties promised in them are now in dispute.',
      'The settlement was consecrated in a faith now out of favour, and nobody agrees what that old blessing still binds them to.',
    ],
    slave_revolt: [
      'The settlement was built by slaves it never counted as its own people. Now they have risen.',
      'From its first season this place ran on enslaved hands. Those hands have turned against it.',
      'The founders built with slaves and kept the profits. The slaves have risen, and they mean to take back both.',
    ],
  };

/**
 * THE DEPARTURES SET of the migration founding note (R-W7 e; STYLE-RULINGS §1(b); WAVE-RULINGS
 * item 8; W5 HIS 2026-11-07). `STRESS_NOTES.mass_migration` is the ARRIVALS set; a settlement whose
 * declared `stress[].direction` is `departures` (read through the config's projection,
 * `migrationDirectionOfConfig`) draws from these instead, so a town that is emptying is never told
 * as one that is crowding. Same register and length as the arrivals set; index 0 is canonical.
 */
export const MASS_MIGRATION_DEPARTURE_NOTES = [
  'The founders built for the families that would stay. Now those families are leaving, and houses stand empty on every street.',
  'The settlement was laid out for more people than it now holds; whole rows the founders filled are shuttered.',
  'The founders knew every name in the settlement. Fewer names are left each season, as household after household takes the road.',
];
