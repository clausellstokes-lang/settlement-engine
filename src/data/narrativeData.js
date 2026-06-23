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
      `The market at ${r} is audible before it is visible: a specific mix of voices, animals, and the percussion of commerce that no other combination of sounds quite replicates.`,
    (r) =>
      `${r}'s market day has the comfortable chaos of something that has been happening in the same place for a long time and has worked out most of its problems.`,
  ],
  river: [
    (r) =>
      "The smell of the river reaches you before the settlement does: clean water, reeds, the particular mud of a working waterfront.",
    (r) =>
      `${r} runs along the water the way settlements do when water is the reason they exist: practical, a little chaotic at the waterfront, tidier as you move inland.`,
  ],
  smoke: [
    (r) =>
      `The cookfire smoke of ${r} drifts on the wind in your direction: a hundred fires, each with its own particular fuel, combining into something that smells like inhabited place.`,
    (r) => `${r} is visible as a smear of smoke on the horizon for a long time before the buildings resolve.`,
  ],
  guild: [
    (r) =>
      `The sound of a hammer on metal reaches you from ${r}'s smithing quarter. That is a craftsperson's rhythm, not a soldier's.`,
    (r) => `${r} smells of work: sawdust, tallow, the particular sharp smell of a tanner at the edge of town.`,
  ],
  ordinary: [
    (r) =>
      `${r} is ordinary in the best sense. It is a place where people live and work and argue and sleep, which is most of what places are for.`,
    (r) =>
      `The road into ${r} becomes a street at a point you can't precisely identify. The settlement grows around you gradually.`,
    (r) =>
      `${r} is neither impressive nor disappointing from the approach. It is what it is, which is a working settlement of reasonable size doing reasonable things.`,
    (r) =>
      `A child runs past you on the road into ${r}, chasing something or being chased by something. Unclear which. Nobody in the street pays attention.`,
    (r) =>
      `A merchant argues with a carter at the gate of ${r} about the size of a load, and the guard is ignoring both of them. This is clearly a daily occurrence.`,
    (r) =>
      `${r} smells like bread from the gate. A bakehouse near the entrance is open early, already on the second bake of the day.`,
  ],
};

export const ARRIVAL_ADDONS = {
  port: [
    (r, s) =>
      `The ${s === "metropolis" ? "great harbour" : "harbour"} of ${r} announces itself before the settlement does: masts above the treeline, the smell of tar and salt, the cries of gulls working the fishing boats.`,
    (r, s) =>
      `${r} appears as a smear of colour above the water: pennants, sail canvas, the white of new-washed walls catching the light from the sea.`,
    (r, s) =>
      `The approach to ${r} is along the quayside road, which means threading through loaded carts and dock workers before the settlement itself comes into view.`,
    (r, s) => `You smell ${r} before you see it: smoke, fish, the mineral bite of the harbour at low tide.`,
  ],
  river: [
    (r, s) =>
      `${r} sits in the bend of the river, its rooftops visible above the willows from a quarter mile out. The mill wheel turns.`,
    (r, s) =>
      `The river road into ${r} runs alongside the water, and the settlement grows out of the bank on both sides. Older buildings sit on the high ground, newer ones crowd the waterfront.`,
    (r, s) =>
      `You cross the river at the ford half a mile out and the road becomes a proper street almost immediately. ${r} has been expanding toward the water.`,
    (r, s) => `The bridge into ${r} is old stone, wide enough for two carts, and there is already a queue to cross it.`,
  ],
  crossroads: [
    (r, s) =>
      `${r} is visible from the junction itself. The roads converge on a market square that seems to be the settlement's reason for existing.`,
    (r, s) =>
      `Four roads, and ${r} at the centre of all of them. Travellers in three directions. The fourth road is yours.`,
    (r, s) =>
      `The waymarker stone at the crossroads half a league out has ${r}'s name carved into it four times, facing each direction. Someone keeps repainting the distances.`,
    (r, s) =>
      `${r} sprawls along all four roads from the central square. The part you see first depends on which direction you came from.`,
  ],
  road: [
    (r, s) =>
      `${r} appears around a bend in the road, its ${s === "city" || s === "metropolis" ? "walls and towers" : "main street"} coming into view all at once.`,
    (r, s) =>
      `The road widens into ${r}'s main thoroughfare without announcing the transition. You are inside the settlement before you notice you have arrived.`,
    (r, s) =>
      `A mile marker, then a second, then the outlying farms of ${r} begin. The settlement proper is still a quarter hour ahead.`,
    (r, s) =>
      `${r} is announced by the smoke of its cookfires and the sound of its market before its buildings are visible.`,
  ],
  isolated: [
    (r, s) =>
      `${r} appears at the end of a track that stopped pretending to be a road some time ago. It exists here because someone decided to stay, not because the terrain made it easy.`,
    (r, s) =>
      `The last real road ended two hours back. ${r} is visible now: a cluster of buildings in the middle distance that the surrounding terrain seems indifferent to.`,
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
    "was established as a defensive stronghold that gathered dependents under its walls",
    "began as a mining camp that became permanent when families arrived",
    "was built where two rival mining operations agreed to share infrastructure",
    "grew because the pass could only be crossed safely with local guides",
  ],
  forest: [
    "grew from a logging camp",
    "was founded by foresters managing the woodland under charter",
    "developed around a sacred grove that drew pilgrims who stayed",
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
