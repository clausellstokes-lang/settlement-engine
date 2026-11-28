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
    // L2 (PAGE-2's lines, 2026-11-20; docs/chair/2026-11-20/content/page/L2-LINES.md): APPENDED, so every line above keeps its index.
    // The pool is crisis-scoped: a line true under any crisis writes `crisis: any`; the settled hum writes nothing and stays calm
    { text: (r) =>
      `Every path into ${r} seems to lead to the same place, and you follow the people carrying baskets until it does.`, crisis: ['any'] },
    (r) =>
      `Awnings of every colour cover the middle of ${r}, and the buying and selling under them has settled into a steady hum.`,
    { text: (r) =>
      `Someone on the road into ${r} asks whether you are buying or selling, and seems satisfied with either answer.`, crisis: ['any'] },
  ],
  river: [
    (r) =>
      "The smell of the river reaches you before the settlement does: clean water, reeds, the particular mud of a bank that people use every day.",
    (r) =>
      `${r} runs along the water the way settlements do when water is the reason they exist: practical, a little chaotic at the waterfront, tidier as you move inland.`,
    { text: (r) =>
      `The river carries the sounds of ${r} to you around the bend before the buildings appear: a mill wheel, the knock of boats against a jetty, someone calling a tally across the water.`, needs: ['institution: mill', 'institution: docks'] }, // R2-CODE-A-4 (CENSUS-2 a/docks): a jetty only where the roster holds a landing (the docks atom)
    { text: (r) =>
      `${r} has its back to the land and its face to the river; the approach by road brings you in the rear way, past the yards and the drying nets, into a settlement that plainly considers the water its front door.`, needs: ['trade at work: fish'] }, // BAR6-CULTURE (B4): declares what it presumes
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; each says only the river and its bank, as the first two lines do
    (r) =>
      `The road into ${r} follows the river for the last mile, and the settlement grows along the bank before it grows away from it.`,
    (r) =>
      `You come into ${r} along the riverbank, where steps go down to the water and someone is filling a bucket at the bottom of them.`,
    (r) =>
      `Trees lean over the river on the way into ${r}, and the first houses stand just above the line where the bank turns to mud.`,
    (r) =>
      `The river bends around ${r}, so that you see the settlement twice on the way in: once across the water, and once on arriving.`,
  ],
  port: [
    // R2-CODE-A item 4 (the cold list REVIEW-W2A-3, HIGH #1): the four harbour scenes declare the docks; 44 of
    // the census's 92 port scenes are a shore with no harbour, and the two rows after them say only the shore.
    { text: (r) =>
      `The harbour at ${r} announces itself beyond the last rise: masts above the roofs, gulls wheeling over the quays, and salt bright in the air.`, needs: ['docks'] },
    { text: (r) =>
      `${r} faces the sea as deliberately as a fortress faces its enemy. Warehouses and chandlers crowd the waterfront, with the older streets climbing behind them.`, needs: ['tier: ≥ village', 'docks'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
    { text: (r) =>
      `You hear ${r}'s harbour before you see it: rigging knocking against masts, dock crews calling cargo tallies, and surf working against the outer wall.`, needs: ['docks'] },
    { text: (r) =>
      `The road into ${r} descends toward a forest of masts. Tar, salt, fish, and woodsmoke mark the boundary between the coast and the working port.`, needs: ['docks'] },
    { text: (r) =>
      `The road into ${r} comes down to the sea, and the salt reaches you a mile before the first roof does.`, needs: ['coast'] },
    { text: (r) =>
      `${r} sits with its back to the land and its face to the open water, and the wind off the sea carries salt and weed a long way inland.`, needs: ['coast'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the shore's two declare the coast, the moorings the docks, as their siblings do
    { text: (r) =>
      `The last stretch of road into ${r} runs beside the sea, and the sound of the surf keeps you company the whole way.`, needs: ['coast'] },
    { text: (r) =>
      `Gulls ride the wind above ${r}, and the roofs nearest the water are crusted pale with salt.`, needs: ['coast'] },
    { text: (r) =>
      `Boats ride at their moorings in the harbour below ${r}, and the smell of tar and rope comes up the road to meet you.`, needs: ['docks'] },
  ],
  smoke: [
    { text: (r) =>
      `The cookfire smoke of ${r} drifts on the wind in your direction: a hundred fires, each with its own particular fuel, combining into something that smells like inhabited place.`, needs: ['population: ≥ middling'] },
    (r) => `${r} is visible as a smear of smoke on the horizon for a long time before the buildings resolve.`,
    (r) =>
      `You smell ${r} before anything else: woodsmoke and bread and livestock, the layered scent of a place where people have been living close together and cooking the same suppers for generations.`,
    (r) =>
      `The smoke above ${r} stands straight up in the still air, a dozen thin columns that mark the settlement's shape on the sky like a map drawn in grey.`,
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; smoke seen and smelt on the way in, and no count of fires (the cookfire line declares its own)
    (r) => `Smoke on the skyline is all you see of ${r} for the last hour of the road, and then the roofs are suddenly there.`,
    (r) => `The wind brings you the smoke of ${r} in gusts, now strong, now gone, as the road winds toward it.`,
    (r) => `Woodsmoke hangs low over ${r} in the morning air, and the roofs show through it one at a time as you come closer.`,
  ],
  guild: [
    { text: (r) =>
      `The sound of a hammer on metal reaches you from ${r}'s smithing quarter: a craftsperson's rhythm, not a soldier's.`, needs: ['institution: smith'] },
    (r) => `${r} smells of work: sawdust, tallow, the particular sharp smell of a tanner at the edge of town.`,
    { text: (r) =>
      `${r} announces its trade before its name: the whine of a lathe, the bite of fresh shavings, a workshop door standing open on a scene of unhurried, practised industry.`, excludes: ['crisis: threat', 'crisis: hunger'] }, // BAR6-CULTURE (B4): declares what it presumes. SEAM-CULTURE (2026-11-17, BRIEF-BAR6-SEAM item 4: the table's row 141, whose reason named a guild-roster key no route reaches, `arrivalScene.js :: ROUTE_TO_SCENE`): the dye-vats named a dyer no declaration gave; the lathe's own shavings stand in, and its unhurried ease is refused under the whole of its family (threat and hunger), as the door asks of a new line. Was "the reek of the dye-vats", `excludes: ['crisis: threat']`.
    { text: (r) =>
      `The approach to ${r} is lined with the overflow of its crafts: timber stacked to season, half-finished goods under eaves, the settlement's work spilling out past its walls for want of room inside.`, needs: ['timber at hand', 'walls'] }, // BAR6-CULTURE (B4): declares what it presumes
  ],
  ordinary: [
    (r) =>
      `${r} is ordinary in the best sense: a place where people live and work and argue and sleep, which is most of what places are for.`,
    { text: (r) =>
      `The road into ${r} becomes part of the settlement at a point you can't precisely identify. The houses gather around you gradually.`, crisis: ['any'] },
    (r) =>
      `${r} is neither impressive nor disappointing from the approach. It is what it is, which is a working settlement of reasonable size doing reasonable things.`,
    { text: (r) =>
      `A child runs past you on the road into ${r}, chasing something or being chased by something (unclear which). Nobody in the street pays attention.`, crisis: ['any'], needs: ['tier: ≥ village'] }, // BAR6-CULTURE (6a-w, 16 small towns of the 720): a street is a village's; its twin below (the slot keeps its draw)
    { text: (r) =>
      `A child runs past you on the road into ${r}, chasing something or being chased by something (unclear which). Nobody else on the road pays attention.`, twinOf: 'A child runs past you on the road into {name}, chasing something or being chased by something (unclear which). Nobody in the street pays attention.', crisis: ['any'], needs: ['tier: ≤ hamlet'] }, // BAR6-CULTURE: the small-place twin. VETOABLE wording (the owner's).
    { text: (r) =>
      `A merchant argues with a carter on the road into ${r} about the size of a load. Nobody else pays them any attention. This is clearly a daily occurrence.`, crisis: ['any'], needs: ['market'] }, // R2-CODE-A-4 (CENSUS-2 a/merchants): a daily merchant only where the roster holds a market
    { text: (r) =>
      `The first person you meet on the road into ${r} wants to know your business, and the second already knows it.`, crisis: ['any'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED. The pool is crisis-scoped (silence reads calm): a line true under any crisis
    // writes `crisis: any`, as its siblings do; the two everyday scenes a crisis could belie write nothing and stay calm
    { text: (r) =>
      `The first building you pass on the way into ${r} is somebody's house, and so is the second, and so, it turns out, is most of the rest.`, crisis: ['any'] },
    { text: (r) =>
      `A dog trots out to look you over on the road into ${r}, decides you are of no interest, and trots back.`, crisis: ['any'] },
    (r) =>
      `Washing hangs in the yards along the road into ${r}, and someone calls a greeting from behind it without looking to see who you are.`,
    (r) =>
      `A cart has stopped half across the road into ${r} while its driver talks to someone over a fence, and nobody minds going round it.`,
    { text: (r) =>
      `${r} does not announce itself: the road simply gathers more doors, then a well, and then you are in it.`, crisis: ['any'] },
    { text: (r) =>
      `${r} has no one thing to look at as you come in, only a great many small ones: a mended fence, a painted door, a bench beside a house.`, crisis: ['any'] },
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
      `The gates of ${r} are closed. There are people on the walls. This is not the relaxed watch of a settlement going about its day. These are people watching the treeline. A face shows at the grille of the small side gate, sees your group, and is gone.`, needs: ['gate', 'walls'] },
    { text: r =>
      `${r}'s gates are shut and barred. The guards on them are professional about it, which makes it worse: nobody comes near without being challenged, and nothing is let through. Professional means they expect this to last.`, needs: ['gate', 'guardPresence'] }, // R2-CODE-A-10 (the bar's HIGH #35): a siege's gates are shut; it said them open, every cart searched
    { text: r =>
      `From outside, ${r} still seems itself: smoke from cookfires, a murmur from the square. It is the gate that gives it away: shut fast, the guards' faces set, their talk stopping dead when strangers come in sight.`, needs: ['gate', 'market', 'tier: ≥ town', 'guardPresence'] }, // R2-CODE-A-10 (#35): not ordinary from a road its besiegers hold; R2-CODE-A-12 (L46): under a siege no line hears a market trading; the square is a town's (every market town holds one; no village does)
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
      `${r} looks prosperous in the merchant quarter: new paint, loaded carts, a market stall with produce. It is only when you walk further in that the other version of the settlement appears: shuttered houses, people sitting on doorsteps with no particular purpose.`, needs: ['market', 'population: ≥ middling'] }, // R2-CODE-A-4 (CENSUS-2 c/quarters): a merchant quarter, at the middling band
    { text: r =>
      `${r} is functional. The market is open, the streets are swept, the guards are at their posts. Something is wrong anyway. It takes a moment to identify: there are no children playing in the street.`, needs: ['market', 'guardPresence'] },
    { text: r =>
      `The queue at the granary gate is the first thing you see in ${r}. Not a market queue, not a water queue: the organised, patient, daily queue of people who are waiting to receive what they are owed and are not certain they will receive it.`, needs: ['institution: granary'] },
    { text: r =>
      `${r} is orderly in the way that a settlement is orderly when order is being enforced. The streets are clear. The rationing markers are painted on the doors. A guard patrol passes and everyone steps aside.`, needs: ['tier: ≥ village', 'patrol'] }, // BAR2-PLACES (the chair's grant VW2; REVIEW-BAR-2 C34238, C34241): order enforced and a patrol passing need a force that keeps patrol (a watch or a garrison); a militia alone "cannot maintain consistent patrol" // BAR6-CULTURE (6a, B4): a size word declares its band
    r =>
      `The dogs of ${r} are gone. It takes a while to notice and longer to stop noticing, and nobody in the settlement will discuss it with a stranger.`,
    { text: r =>
      `Prices chalked outside ${r}'s market gate have been rubbed out and rewritten so often the board has gone grey. The numbers on it now are polite fictions; the real trading happens in back rooms, in kind.`, needs: ['market'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `The smoke from ${n}'s chimneys is thin. People here look at your pack before they look at your face, and then look away, ashamed of having looked.`,
    { text: r =>
      `${r} is quiet in the way a hungry settlement is quiet. The rationing markers are painted on the doors, and people keep to their own thresholds.`, twinOf: '{name} is orderly in the way that a settlement is orderly when order is being enforced. The streets are clear. The rationing markers are painted on the doors. A guard patrol passes and everyone steps aside.', excludes: ['patrol'] }, // BAR2-PLACES (VW2): its twin where no force keeps patrol (the slot keeps its draw)
  ],
  occupied: [
    { text: r =>
      `The flags above ${r}'s gatehouse are not the settlement's own. Two soldiers at the gate. Their uniform is not local. They look at your papers with the particular expression of people who have been told to look at papers.`, needs: ['gate'] },
    { text: r =>
      `${r} looks normal from the approach. It is only at the gate that the nature of normal becomes apparent: the guard asks where you are from, writes it down, and asks how long you intend to stay. This is not the usual question.`, needs: ['gate', 'guardPresence'] },
    { text: r =>
      `The approach to ${r} looks like any other settlement. There is graffiti on the wall near the gate that someone has attempted to scrub off. The symbol is still readable.`, needs: ['gate'] },
    { text: r =>
      `${r} is going about its business. The market is open, the streets are orderly, the gates are attended by soldiers whose armour is not local. Everyone is doing what they are supposed to be doing, which is the point.`, needs: ['tier: ≥ village', 'market', 'gate'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
    r =>
      `${r}'s notices are posted in two languages now, the local one second. The new lettering is neat, official, and on every door that matters, which is how you learn the occupation intends to stay.`,
    { text: r =>
      `At ${r}'s gate the queue divides in two: residents with papers, and everyone else. The residents' line is longer and moves slower, and no one in it complains where the soldiers can hear.`, needs: ['gate'] },
    // The Voice Program wave 4 (2026-10-02): structure-free, so a settlement with no wall, gate, market or guard
    // still opens on its stress (src/generators/narrative/arrivalScene.js draws only the vignettes whose structures it holds).
    (n) => `Strangers in foreign colours stand about in the middle of ${n}, and the locals walk around them as if they were furniture nobody wanted.`,
  ],
  politically_fractured: [
    { text: r =>
      `${r} has two gates. The eastern one is controlled by one power, the western by another. You can tell by the pennants. The road you are on leads to the eastern gate.`, needs: ['gate'] },
    { text: r =>
      `The gate guard at ${r} asks where you intend to stay: which inn, which district. The answer apparently matters. They note it and say nothing further.`, needs: ['tier: ≥ town', 'gate', 'institution: tavern', 'guardPresence'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
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
      `${r} is in reasonable shape. The walls are standing, the market is functioning, the main street is paved. The paving needs repair. The wall has a section of new brick that doesn't quite match the old. The repairs that needed doing five years ago are still waiting.`, needs: ['tier: ≥ village', 'walls', 'market'], excludes: ['crisis: threat'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
    { text: _r =>
      "A building near the gate has a new sign, freshly painted with the name of an outside creditor. The creditor has opened an office here, and the locals walk past it without looking in.", needs: ['gate'] },
    { text: r =>
      `${r} gets by. The market is busy enough, the streets clean enough and the civic buildings kept up just enough, and nothing more is being spent.`, needs: ['tier: ≥ village', 'market'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
    { text: r =>
      `The merchant district of ${r} looks prosperous. The rest of the settlement, visible further in, looks like it has been waiting for the merchant district's prosperity to reach it for some years.`, needs: ['market', 'population: ≥ middling'] }, // R2-CODE-A-3 (the increment's ww-920): a district is a size error below the middling band (ruling (f))
    { text: r =>
      `The finest building in ${r} is new, stone-built, and belongs to nobody local: a counting house, its brass plate polished daily by a clerk who arrived with the ledgers. It is what everything else in town is working to pay for.`, needs: ['institution: bank'] }, // COHERENCE-PRESUME: it printed in towns with no counting house
    { text: r =>
      `${r} holds a market day that has quietly become a collection day: the stalls pay their pitch fees to a factor before they sell a thing, and the factor's book has more names in it than the market has stalls.`, needs: ['market'] },
    // R2-CODE-A-14, the chair's ruling (s2) on L05 (HIGH, carried): a merchant district needs a market (as its famine
    // twin's merchant quarter does); THE SLOT IS KEPT AND TAKES A TWIN TRUE WITHOUT ONE (no district, no quarter, no
    // market), reached only by resolution where [3] is drawn and refused, so no draw moves (arrivalScene.js :: drawAdmitted).
    { text: r =>
      `The best-kept street of ${r} looks prosperous. The rest of the settlement, visible further in, looks like it has been waiting for that street's prosperity to reach it for some years.`,
    twinOf: "The merchant district of {name} looks prosperous. The rest of the settlement, visible further in, looks like it has been waiting for the merchant district's prosperity to reach it for some years.",
    needs: ['population: ≥ middling'], excludes: ['market'] },
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
      `${r} is functioning well. Clean streets, busy market, maintained walls. If you were looking for problems, you would not find them from the outside.`, needs: ['tier: ≥ village', 'market', 'walls'], excludes: ['crisis: threat', 'crisis: hunger', 'crisis: succession', 'crisis: unrest'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
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
    { text: r =>
      `Building has stopped mid-job across ${r}; scaffolding stands empty on dressed stone. Work that fine waits on a patron, and the town is not currently sure who that is.`, needs: ['tier: ≥ town'] }, // R2-CODE-A-3 (the increment's ww-540): no masons or great house the roster cannot name (record 386 (3)); stone building work at a town's size
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
      `There are soldiers on ${r}'s streets, but they move in pairs and do not linger. The people watch them pass with the particular blankness of a place that has already decided which side it is on and is waiting to be asked.`, needs: ['tier: ≥ village', 'soldiers'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
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
      `The road to ${r} has been rutted deep by heavy wagons moving in one direction: toward the settlement loaded, away from it loaded differently. At the gate a clerk with an army seal records what comes and goes. This is a war's traffic, not trade's.`, needs: ['gate'] },
    { text: r =>
      `${r}'s young men are not in ${r}. You notice it at the gate and it holds true inside: the people working the stalls and the fields are the old, the very young, and the women. A recruiting notice is nailed to the gatepost, its edges soft with weather.`, needs: ['gate', 'market'] },
    { text: r =>
      `There are more soldiers than citizens visible on ${r}'s main street, and the citizens are the ones stepping aside. A requisition column is being loaded in the square: grain, cloth, iron, and the settlement's own carts to carry it away.`, needs: ['tier: ≥ village', 'market', 'soldiers'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
    { text: r =>
      `${r} is busy in a way that feels wrong. The forge fires burn past dark, the coin is moving, and all of it points one direction, toward a war that is not fought here but is paid for here.`, needs: ['institution: smith', 'prosperity: ≥ moderate'], excludes: ['crisis: hunger', 'crisis: under_siege', 'war: front'] }, // TAIL-NARRATIVE-5 (N18 (1)): the coin moves only where the record's prosperity is not below moderate
    r =>
      `${r}'s noticeboard is a wall of requisition orders, each stamped, each superseding the last. At its foot, a smaller paper, hand-lettered: prayers offered nightly, all welcome.`,
    r =>
      `The horses in ${r}'s paddocks are old, or lame, or foals. Every sound animal of working age has a receipt where it used to be, and the receipts do not say when the army returns them.`, // BAR3-PLACES (H2, 2026-11-15): no crown, no kingdom: a city-state at war answers to no higher lord, so the line names the war's own officers (true wherever it prints).
    // TAIL-NARRATIVE-5 (N18 (1)): THE SLOT IS KEPT: a poor town at war takes the twin that says what the war takes, reached
    // only by resolution where [3] is drawn and refused (arrivalScene.js :: drawAdmitted), so no draw moves.
    { text: r =>
      `${r} is busy in a way that feels wrong for a place this poor. The forge fires burn past dark, but the coin they earn leaves with the carts, and all of it points one direction, toward a war that is not fought here but is paid for here.`,
    twinOf: '{name} is busy in a way that feels wrong. The forge fires burn past dark, the coin is moving, and all of it points one direction, toward a war that is not fought here but is paid for here.',
    needs: ['institution: smith'], excludes: ['prosperity: ≥ moderate', 'crisis: hunger', 'crisis: under_siege', 'war: front'] },
  ],
  religious_conversion: [
    { text: r =>
      `Two temples face each other across ${r}'s central square, and only one has a queue. The other's doors are open but its steps are swept too clean, walked on too little. Something has moved from one building to the other, and it was not only worshippers.`, needs: ['institution: temple', 'market'] },
    { text: r =>
      `The shrine at ${r}'s gate has been recently altered: one symbol chiselled away, another set in its place, the old outline still faintly visible beneath the new. Someone did this carefully. Someone else has been scratching at the replacement.`, needs: ['institution: temple', 'gate'] },
    { text: r =>
      `${r} is observing a holy day, and you cannot tell which one. Some shops are shut and draped; others are pointedly open. Two processions are forming at opposite ends of the settlement, and the people watching each are counting who watches the other.`, needs: ['population: ≥ middling'] }, // R2-CODE-A-4 (CENSUS-2 c/quarters): shops and quarters are a size error below the middling band (ruling (f))
    { text: r =>
      `The bells of ${r} ring twice for every hour: one set of chimes, then another from a different quarter, a beat later and out of tune. Nobody in the street looks up.`, needs: ['institution: temple', 'population: ≥ middling'] }, // R2-CODE-A-4 (CENSUS-2 c/quarters): a different quarter, at the middling band
    { text: r =>
      `The busiest work in ${r} is on its holy symbols: one set coming down, another going up, and the same three workmen paid for both. They no longer joke about it.`, needs: ['sacredHouse'] }, // R2-CODE-A-3 (the increment's ww-58): no mason's yard the roster cannot name (record 386 (3)); the symbols are a sacred house's
    r => // R2-CODE-A-12 (ruling (3)): a count word reads the roster; no roster holds two burial houses here, so the rows are the graves'
      `The dead of ${r} are buried in two rows now, the old faith's and the new, and the town's grief is learning to sort itself accordingly. Whoever digs the graves digs both, and is the most carefully neutral soul alive.`,
  ],
  slave_revolt: [
    { text: r =>
      `${r}'s gates are shut in daylight, which is wrong for a settlement of its size. There is smoke inside: not cookfire smoke, too much and too dark. On the wall, the guards face inward, toward their own streets, not out toward you.`, needs: ['tier: ≥ village', 'gate', 'walls', 'guardPresence'] }, // BAR6-CULTURE (6a, B4): a size word declares its band
    { text: r =>
      `The approach to ${r} is blocked by a hasty checkpoint: overturned carts, armed men who are not the regular watch, a hard question about your business before you are allowed within sight of the gate. Whatever is happening inside, they have decided strangers are a risk.`, needs: ['gate', 'watch'] },
    { text: r =>
      `${r} is quiet in the way a held breath is quiet. The slave market at its heart (you can see the empty auction platform from the gate) stands deserted, ringed by guards. The chains are still there. The people who wore them are not.`, needs: ['market', 'gate', 'guardPresence'] },
    { text: r =>
      `There are bodies being carried through ${r}'s streets under cloth, and the people carrying them are not mourners but labourers doing grim, fast work. The rising that did this is not finished; you can hear it, somewhere in the lower districts, still going on.`, needs: ['tier: ≥ village', 'population: ≥ middling'] }, // R2-CODE-A-4 (CENSUS-2 c/streets, c/districts): streets and lower districts, at the middling band // BAR6-CULTURE (6a, B4): a size word declares its band
    r =>
      `One building in ${r} is shuttered and scorched, the only burned one in sight, which tells you the fire was a statement, not an accident.`, // R2-CODE-A-4 (record 386 (3)/(4)): no manacle-maker's shop the roster cannot name; read where it prints, a hamlet of 48 up
    r =>
      `${r}'s field hands work without overseers today, or the overseers have dressed like the hands. From the road you cannot tell which, and that is the whole story of the settlement this season.`,
  ],
};

export const STRESS_NOTES = {
    under_siege: [
      'Whatever the settlement was built for, it is under siege now, and nothing else matters until the siege is broken.',
      'Whatever the site was chosen for matters little to the people now deciding whether its walls can hold.',
      'These walls were built in case they were ever needed. They are needed now.', // TAIL-NARRATIVE-5 (N18 (2)): a note claims nothing of the founding; who built the walls is not on the record
    ],
    famine: [
      'This place has fed its people well enough in other years. Now its food is failing and families are going hungry.', // TAIL-NARRATIVE-5 (N18 (2)): no founding cause; no harvest where the failed source may be the catch or the herds
      'Whatever fed the settlement in other years has failed it this year, and its children are going hungry.',
      'The country around the settlement looks the same as ever, but the food has come in short, and the winter ahead will be hard.',
    ],
    occupied: [
      'The settlement\'s own rulers used to give the orders. Now foreign officers give them, and those rulers answer to them.', // TAIL-NARRATIVE-5 (N18 (2)): no founding claimed: a crown's or a consortium's founding did not govern itself
      "Nobody here chose the people who rule it now, and they answer to someone far away.",
      'The settlement always made its own decisions, or believed it did. Under occupation, it no longer does.',
    ],
    politically_fractured: [
      'The people of the settlement no longer agree on what it is for, and nobody expects them to agree again soon.',
      'Its people work as hard as they ever did, but no longer agree on where the settlement is going.',
      'Every power here tells the settlement\'s story its own way, and the settlement has split along those lines.', // TAIL-NARRATIVE-5 (the chair's style-law red): the retired word's word; every printing town holds two powers or more
    ],
    indebted: [
      'The first settlers built something worth having. Their descendants have borrowed against it until the settlement owes more than it owns.',
      'Each generation since the founding has borrowed a little more against what the founders left. Now the lenders want it back.',
      'What the founders built was solid enough to borrow against, and it has been, again and again; the lenders now own much of it.',
    ],
    recently_betrayed: [
      'The settlement runs on trust between its households, and one of its own has just broken that trust.',
      'Life here rests on promises kept between neighbours, and someone inside has just broken one.',
      'People here trusted each other without thinking about it. Someone inside has just made them think about it.',
    ],
    infiltrated: [
      'The settlement has always trusted familiar faces, and it still does. Someone living here now is using that trust to hide.', // TAIL-NARRATIVE-5 (N18 (2)): no founders who all knew each other beside a consortium, a decree or three merged places
      'A place this size still trusts faces it knows, and one of those faces is not what it seems.',
      'The settlement still believes it knows who lives inside its walls. That is how someone who does not belong goes unnoticed.',
    ],
    plague_onset: [
      'The sickness came in the way everything else here comes in: from outside, and before anyone thought to stop it.',
      'Whatever made this a good place to settle, the sickness found its way here all the same.',
      'The sickness reached it as easily as news does, and faster than anyone could shut a door against it.',
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
      'The settlement was never built for this many. Now newcomers crowd in, and half the faces are strangers.', // TAIL-NARRATIVE-5 (N18 (2)): no founding of a few families beside a decree, a consortium or a noble's grant; R2-CODE-A-4 (CENSUS-2 c/streets): no streets said of a thorp or a hamlet; true at every size
      'The settlement was laid out for the people it used to hold. Its houses and its water were never meant for this many.', // R2-CODE-A-4 (CENSUS-2 c/streets): as above
      'The settlement once knew the faces inside its walls. Now it does not: too many have arrived too fast.',
    ],
    wartime: [
      'The settlement grew up in quieter years. Now it feeds and arms a war.',
      'Whatever the settlement was built for, it is paying for a war now, and the bill grows every season.',
      'Now the army takes what the settlement used to sell, and pays what the army thinks fair.', // R2-CODE-A-4 (CENSUS-2 a/market): no market said where the roster holds none; true at every size
    ],
    religious_conversion: [
      'The founding was blessed under a faith that is no longer ascendant here. The oaths and endowments made in its name are now contested ground.',
      'The first stones were laid with prayers the settlement no longer says, and the land and duties promised in them are now in dispute.',
      'The settlement was consecrated in a faith now out of favour, and nobody agrees what that old blessing still binds them to.',
    ],
    slave_revolt: [
      'The settlement ran on slaves it never counted as its own people. Now they have risen.',
      'For years this place has run on enslaved hands. Those hands have turned against it.',
      'Its masters worked it with slaves and kept the profits. The slaves have risen, and they mean to take back what was taken from them.',
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
  'The settlement was built for families that would stay. Now those families are leaving, and houses stand empty on every street.', // TAIL-NARRATIVE-5 (N18 (2)): as the arrivals set: no founding claimed
  'The settlement was laid out for more people than it now holds; whole rows that were once full are shuttered.',
  'The settlement once knew its households by name. Fewer names are left each season, as household after household takes the road.',
];
