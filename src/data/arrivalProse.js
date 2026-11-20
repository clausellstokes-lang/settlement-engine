// arrivalProse.js — PURE DATA: THE ARRIVAL SCENE'S PLACE BEATS (the Voice Program wave 3).
//
// ⛔ THE OWNER, 2026-10-02: "each variant should insight something regarding either senses, culture, about the
// people, it should reference things like their trade dynamics, recent history or events, the economic makeup in
// the sense of if a big part of their output is in making military weapons. I want to have a sentence that says
// you hear the hammering echo throughout the city or if there's bread, then the smell of bread hits you as you walk
// through the gates. If there's corruption some visible sign", "think about Larian entertainment or BioWare", and
// the rule every line here is written under: "pools that speak to what's in the dossier and simply not contradicted".
//
// ⛔ ANCHORED, NOT DERIVED. Every line is drawn only on a settlement that holds the fact its key names: a trade it
// practises, the culture it carries, a label the dossier prints, an event its history recorded. So a line may
// embellish freely with what the engine does not track (a smell, a sound, a gesture) and never contradicts what it
// does. That is why the lines below avoid naming anything their key does not guarantee: no gate, wall, square,
// guild hall or watch unless the anchor implies one, and no count a single smithy or a city of smiths would belie.
// The law of 2026-09-12 holds in full: no invented history or numbers, no covert fact made visible, the followers
// act and the god does not. The voice bible's bars hold too: no em dash, no exclamation mark, no digit.
//
// Pure data: no imports, no RNG. The picks happen in src/generators/narrative/arrivalScene.js on the arrival
// scene's own substream. @enforced-by tests/generators/arrivalScene.test.js

/**
 * A pool line: a name template, or the declared row of the census's sibling column (CENSUS-2b, the chair's
 * ruling R-C) — `{ text, needs?, excludes?, crisis? }` in the atoms of `domain/facts/factVocabulary.js`. Consumers
 * read it through `domain/facts/textOf.js` until CENSUS-1c's wiring draws it through `drawDeclared`.
 * @typedef {((n: string) => string) | { text: (n: string) => string, needs?: ReadonlyArray<string>,
 *   excludes?: ReadonlyArray<string>, crisis?: ReadonlyArray<string>, colour?: boolean, twinOf?: string }} ArrivalLine
 */
/**
 * THE CRISIS-SCOPED FLAGS (CENSUS-2e unit 1, the chair's R-AF: "flags now, pins at the compose"). The ledger's
 * pools (docs/census/declarations/ARRIVAL_*.json) that opted into the crisis dimension, by pool name: in these a
 * line that says nothing of a crisis is CALM, so the arrival site's wiring passes `crisisScoped: true` for them,
 * read from here. The register pin is the compose's (R-T).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const ARRIVAL_CRISIS_SCOPED = Object.freeze({
  // CENSUS-2f, the chair's R-AH: the 23 pools 2e flagged here hold no calm line (every line writes
  // `crisis: any`), so the flag protected nothing and is dropped; a pool that gains a calm line is listed again.
  ARRIVAL_SENSES: Object.freeze([]),
  ARRIVAL_PEOPLE: Object.freeze([]),
  ARRIVAL_TENSIONS: Object.freeze([]),
  ARRIVAL_MEMORIES: Object.freeze([]),
});

/**
 * SENSE: what the settlement sounds or smells like, by a trade it practises. `institutions` are lowercase name
 * fragments matched at a word start against the settlement's NATIVE catalogue names. `trade` fragments are matched
 * the same way against its exports and income sources; a hit makes the key DOMINANT, which weights it ahead of a
 * trade the place merely has and draws from `dominant`, the lines that say the trade fills the whole place.
 * `arcane` keys are drawn only where the world's magic is real.
 * @typedef {Readonly<{ key: string, arcane?: boolean, institutions: ReadonlyArray<string>, trade: ReadonlyArray<string>,
 *   lines: ReadonlyArray<ArrivalLine>, dominant: ReadonlyArray<ArrivalLine> }>} ArrivalSense
 * @type {ReadonlyArray<ArrivalSense>}
 */
export const ARRIVAL_SENSES = Object.freeze([
  { key: 'smiths',
    institutions: ['blacksmith', 'smith', 'smelter', 'foundry', 'armourer', 'armorer', 'weaponsmith', 'bladesmith', 'metalworker', 'specialized metalworker'],
    trade: ['metalwork', 'steel', 'quality tools', 'iron & metalwork'],
    lines: [
      // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): each line shows the forge at work: some smith's house stands with its iron (`trade at work: ironwork`); its twin keeps the slot where every smith is short
      { text: (n) => `The ring of hammer on anvil carries over the roofs of ${n}.`, needs: ['trade at work: ironwork'] },
      { text: (n) => `The anvil at ${n} is quiet more days than it rings, for want of iron.`, twinOf: 'The ring of hammer on anvil carries over the roofs of {name}.', needs: ['institution: smith'], excludes: ['trade at work: ironwork'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // SEAM-SCENES (item 5, 2026-11-17): an anvil wants a smith, as its three siblings' did
      { text: () => 'You hear the forge work before you see it: hammer on iron, steady as a heartbeat.', needs: ['trade at work: ironwork'] },
      { text: () => 'No hammer sounds over the roofs today, and the lanes are quiet.', twinOf: 'You hear the forge work before you see it: hammer on iron, steady as a heartbeat.', excludes: ['trade at work: ironwork'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // SEAM-SCENES (item 6, B7, 2026-11-17): reworded from "The forge is banked low, and no hammer sounds from it today." (needs a smith) to name no forge, true where the town's only iron house is a Smelter short of iron (bar0-town-occupied-rand-31 kept 1 line of 4; VETOABLE wording) // BAR7-SCENES (item 5c, 2026-11-17): reworded from "… today: there is no iron to work." (false where a Smelter not short stands: the smelter left the ironwork key); it says the forge's own quiet
      { text: () => 'A drift of forge smoke hangs over the roofs, and somewhere under it a hammer keeps time.', needs: ['trade at work: ironwork'] },
      { text: () => 'Only a thin thread of smoke rises over the roofs, and no hammer keeps time under it.', twinOf: 'A drift of forge smoke hangs over the roofs, and somewhere under it a hammer keeps time.', excludes: ['trade at work: ironwork'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // SEAM-SCENES (item 6, B7, 2026-11-17): "from the forge" became "over the roofs" (no smith needed; VETOABLE wording)
      { text: () => 'A smith quenches a blade in a hiss of steam, and the sound follows you down the lane.', needs: ['trade at work: ironwork'] },
      { text: () => 'Someone sits idle in a workshop doorway, with no work on the bench.', twinOf: 'A smith quenches a blade in a hiss of steam, and the sound follows you down the lane.', excludes: ['trade at work: ironwork'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // SEAM-SCENES (item 6, B7, 2026-11-17): reworded from "A smith sits in the forge doorway with no iron on the anvil." (needs a smith), true where a Smelter is the iron house; it names no house (the presumed-things door) (VETOABLE wording) // BAR7-SCENES (item 5c, 2026-11-17): reworded from "… with no iron to work." (the same)
    ],
    dominant: [ // W2-FIX-DATA-3 (REVIEW-W2A-3 #366): these four lines speak of many forges; a village or smaller has one (a hamlet's part-time smith, a village's blacksmith), so they declare tier: ≥ town. A one-forge place then draws none and its sense beat is left out (the redraw finds no clean line and draws nothing more); a line of its own would lengthen the pool and re-deal the arrival in every town that draws it (measured: 44 of 720)
      // SEAM-SCENES (item 3, 2026-11-17): each line shows the forges at work: some smith's house has its iron (`trade at work: ironwork`,
      // r2r-city-17's "The hammering of the forges echoes through all of Jalaldavan." and bar0-town-occupied-rand-27's forge smoke beside a
      // Blacksmiths and a Smelter both "Short of iron."); its twin keeps the slot where every smiths' house is short
      { text: (n) => `The hammering of the forges echoes through all of ${n}.`, needs: ['institution: smith', 'tier: ≥ town', 'trade at work: ironwork'] }, // W2-FIX-DATA-12 item 3: no claim the place lives by them (false in 16 of 16: metalwork 3 to 12% of the income, never first)
      { text: (n) => `The forges of ${n} are quiet more often than not, for want of iron.`, twinOf: 'The hammering of the forges echoes through all of {name}.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['trade at work: ironwork'] }, // SEAM-SCENES (item 3, 2026-11-17): its twin
      { text: () => 'Forge smoke hangs over everything here, and the ring of the anvils never quite stops.', needs: ['institution: smith', 'tier: ≥ town', 'trade at work: ironwork in full'] }, // BAR8-SCENES (item 2, K's 12b, 2026-11-17): the forges at FULL work want no smiths' house marked (`trade at work: ironwork in full`): it printed over smiths every one "Curtailed by the war." (bar0-city-wartime-rand-45) // W2-FIX-DATA-12 item 3: the anvils stand on the roster (a town with only a Smelter printed it)
      { text: () => 'Only a little forge smoke rises here, and the anvils ring now and then, when there is iron to work.', twinOf: 'Forge smoke hangs over everything here, and the ring of the anvils never quite stops.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['trade at work: ironwork in full'] }, // BAR8-SCENES (item 2): its twin, where its original is refused: every smith short, or a smiths' house marked (true of a forge "Curtailed by the war.": it works what it holds) // SEAM-SCENES (item 3, 2026-11-17): its twin
      { text: () => 'Racks of new ironwork stand outside the workshops, waiting for the carts.', needs: ['institution: smith', 'tier: ≥ town', 'trade at work: ironwork in full'], excludes: ['crisis: under_siege'] }, // BAR8-SCENES (item 2, K's 12b): the racks of new ironwork want no smiths' house marked (bar0-city-wartime-rand-45, C7242) // W2-FIX-DATA: the carts a siege stops (c22)
      { text: () => 'The racks outside the workshops stand mostly empty: the smiths are short of iron.', twinOf: 'Racks of new ironwork stand outside the workshops, waiting for the carts.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['trade at work: ironwork in full'] }, // BAR8-SCENES (item 2): its twin, where a smiths' house is marked too (the war's mark is the iron it took, `crisisStoppedRow.js` WM1; a siege's, the iron that no longer comes in) // SEAM-SCENES (item 3, 2026-11-17): its twin
      { text: (n) => `The clang of iron from the smithies carries down the lanes of ${n}.`, needs: ['institution: smith', 'tier: ≥ town', 'trade at work: ironwork'] }, // W2-FIX-DATA-12 item 3 (the reader's A04): no claim the place lives by them, and a smith stands
      { text: (n) => `The smithies of ${n} are quieter than they ought to be, for want of iron.`, twinOf: 'The clang of iron from the smithies carries down the lanes of {name}.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['trade at work: ironwork'] }, // SEAM-SCENES (item 3, 2026-11-17): its twin
      // L2 (PAGE-2's lines, 2026-11-20; docs/chair/2026-11-20/content/page/L2-LINES.md): APPENDED. Each shows the forges' long
      // presence, not today's work, so it is true whether or not the iron comes: the smiths and the town its siblings declare, no twin
      { text: (n) => `Soot from the forges has darkened the house fronts of ${n} nearest the smithies.`, needs: ['institution: smith', 'tier: ≥ town'] },
      { text: () => 'More than one person you pass has the burn-scarred hands of someone who works at a forge.', needs: ['institution: smith', 'tier: ≥ town'] },
      { text: () => 'Old horseshoes and broken tools lie in a pile behind a smithy, waiting to go back into the fire.', needs: ['institution: smith', 'tier: ≥ town'] },
    ] },
  // ARMS speaks only where the settlement EXPORTS weapons or armour (no `lines`, so it is never a candidate on a
  // smithy alone): the owner's own example, "if a big part of their output is in making military weapons".
  { key: 'arms',
    institutions: ['blacksmith', 'smith', 'smelter', 'foundry', 'armourer', 'armorer', 'weaponsmith', 'bladesmith', 'metalworker', 'specialized metalworker', 'bowyer'],
    trade: ['weapon', 'armour', 'armor'],
    lines: [],
    dominant: [
      // W2-FIX-DATA-4 (REVIEW-W2A-3 #184; ROUND-3 #600): the arms key is reached by a bowyer or a trade word with no smith on the roster, and
      // three of its lines speak of many forges and workshops: each needs a smith, and the three a town (a hamlet has one part-time smith)
      { text: (n) => `The hammering echoes throughout ${n}, and most of it is the sound of blades being made.`, needs: ['institution: smith', 'tier: ≥ town', 'iron at hand'], crisis: ['any'] }, // BAR2-PLACES (the chair's grant VW2; REVIEW-BAR-2 C3297): blades are made only where the smiths have iron (a siege had cut off the iron it imports)
      { text: (n) => `The forges of ${n} stand cold: there is no iron left to make blades from.`, twinOf: 'The hammering echoes throughout {name}, and most of it is the sound of blades being made.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['iron at hand'], crisis: ['any'] }, // BAR2-PLACES (VW2): its twin where the iron is not at hand
      { text: () => 'Racks of spearheads and helms stand outside the workshops, waiting for the carts.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-12 item 5 (the reader's A06): the twin carries its siblings' siege exclusion: no cart reaches a besieged town
      { text: () => 'A few finished spearheads lie on a workshop bench, waiting for a buyer.', twinOf: 'Racks of spearheads and helms stand outside the workshops, waiting for the carts.', needs: ['institution: smith'], crisis: ['any'] }, // BAR7-SCENES (item 5f, 2026-11-17; B7 outside SEAM-SCENES's sample: r2r-village-18, r2s-insurgency-village-2 kept ONE line of this pool): the racks' twin, true at every tier and under a siege (no carts, no row of workshops); a twin moves no draw
      { text: () => 'Every forge you pass is making something meant for a war, and the carts on the road out are full of it.', needs: ['institution: smith', 'tier: ≥ town', 'exported: arms'], excludes: ['crisis: under_siege'], crisis: ['wartime', 'insurgency'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) "out": the arms the carts take out are an export of the town's
      { text: () => 'Every forge you pass is making something meant for a war, and the army takes all of it.', twinOf: 'Every forge you pass is making something meant for a war, and the carts on the road out are full of it.', needs: ['institution: smith', 'tier: ≥ town'], crisis: ['wartime', 'insurgency'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin where no arms are exported or the siege holds the road // W2-FIX-DATA-5 (ww-1157): a war the record holds
      { text: () => 'A smith tests a new blade against a post, frowns, and sends it back to the fire.', needs: ['institution: smith'], crisis: ['any'] },
    ] },
  { key: 'bread',
    institutions: ['bakery', 'baker', 'bakehouse', 'mill', 'mills'],
    trade: ['baked goods', 'milled flour', 'flour', 'bread', 'grain surplus'],
    lines: [
      // BAR5-THINGS (LAW 5: the static inventory's `outside` and `plenty`): fresh bread on the road in is a calm town's; under a
      // hunger or a siege its twin keeps the slot
      { text: () => 'The smell of fresh bread meets you on the road in.', excludes: ['crisis: hunger', 'crisis: under_siege'], crisis: ['any'] }, // R-AO (CENSUS-2f): read
      { text: () => 'An oven is lit somewhere close, though the smell of bread on the air is thin.', twinOf: 'The smell of fresh bread meets you on the road in.', crisis: ['any'] }, // BAR5-THINGS (LAW 5): its twin
      { text: () => 'Someone has been baking since before dawn, and the air still carries it.', excludes: ['crisis: hunger'] }, // TAIL-HISTORY batch 1 (the chair's Y4, Y6; READ-ALL 18339): no bread baked where the food failed; a line a crisis can make false is not colour, so it leaves the colour mark and declares
      { text: () => 'A mill wheel turns somewhere close, and flour dust drifts on the breeze.', needs: ['institution: mill'], excludes: ['crisis: hunger'] }, // BAR4-SCENES-2 (HW1; kind A1's `house at work`): no flour dust where the famine leaves the mill short (the pool's colour lines still speak)
      { text: () => 'A mill wheel turns somewhere close, slowly, with little grain to grind.', twinOf: 'A mill wheel turns somewhere close, and flour dust drifts on the breeze.', needs: ['institution: mill', 'crisis: hunger'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => 'The warm smell of an oven reaches you before the first doorway does.', colour: true },
    ],
    dominant: [
      { text: (n) => `The smell of bread hits you as you walk into ${n}, and it never really leaves.`, excludes: ['crisis: hunger'], crisis: ['any'] },
      { text: () => 'Carts of grain rattle toward the mills while the ovens send the smell of bread down every lane.', needs: ['institution: mill'], excludes: ['crisis: hunger'], crisis: ['any'] },
      { text: () => 'Flour dust lies pale on the doorsteps, and the whole place smells of the ovens.', excludes: ['crisis: hunger'], crisis: ['any'] },
      { text: () => 'Sacks of flour are stacked shoulder high by the roadside, waiting to be carted out.', needs: ['exported: flour'], excludes: ['crisis: hunger', 'crisis: under_siege'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) "out": flour carted out is an export of the town's, and no cart leaves under a siege
      { text: () => 'Sacks of flour are stacked against a wall, all of it for the ovens here.', twinOf: 'Sacks of flour are stacked shoulder high by the roadside, waiting to be carted out.', excludes: ['crisis: hunger'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
    ] },
  { key: 'tanners',
    institutions: ['tanner', 'tannery', 'tanners', 'leatherwork', 'saddler', 'furrier'],
    trade: ['leather', 'hide', 'pelt', 'fur'],
    lines: [
      // BAR7-SCENES (item 5e, 2026-11-17; SEAM-SCENES's LEFT 4): each line shows the pits at work (`trade at work: leather`, the
      // dominant pool's key: a tanner's or a leatherworker's house has its hides, or leather goes out); its twin keeps the slot
      // where every tanner is short or none works (a saddler or a furrier opens this pool too), so the pool keeps four (B7)
      { text: () => 'Downwind of the tanning pits the air turns sharp and sour.', needs: ['trade at work: leather'] },
      { text: () => 'Few hides are tanned here these days, and the air is none the worse for it.', twinOf: 'Downwind of the tanning pits the air turns sharp and sour.', excludes: ['trade at work: leather'] }, // BAR7-SCENES (item 5e): its twin
      { text: () => 'The tannery makes itself known long before you reach it.', needs: ['trade at work: leather'] },
      { text: () => 'Nothing on the air tells you that leather is made here.', twinOf: 'The tannery makes itself known long before you reach it.', excludes: ['trade at work: leather'] }, // BAR7-SCENES (item 5e): its twin
      { text: () => 'Hides hang drying on frames, and the smell comes with them.', needs: ['trade at work: leather'] },
      { text: () => 'Someone in a doorway is mending an old harness; little new leather is worked here.', twinOf: 'Hides hang drying on frames, and the smell comes with them.', excludes: ['trade at work: leather'] }, // BAR7-SCENES (item 5e): its twin
      { text: () => 'A sour reek drifts over the rooftops from the tanning yard.', needs: ['trade at work: leather'] },
      { text: () => 'The rooftops carry no sour reek, and few hides lie anywhere waiting to be worked.', twinOf: 'A sour reek drifts over the rooftops from the tanning yard.', excludes: ['trade at work: leather'] }, // BAR7-SCENES (item 5e): its twin
    ],
    dominant: [
      // SEAM-SCENES (item 2, 2026-11-17; the chair's TW1): the pits at work: a tanner's or a leatherworker's house has its hides, or
      // leather goes out (`trade at work: leather`; r2r-town-34 printed the reek where every tanner was "Short of hides."); each twin
      // keeps the slot where every tanner is short or none works
      { text: (n) => `The reek of the tanning pits hangs over ${n}, and the locals have long since stopped noticing it.`, needs: ['trade at work: leather'], crisis: ['any'] },
      { text: (n) => `Few hides reach ${n} these days, and little leather is being worked.`, twinOf: 'The reek of the tanning pits hangs over {name}, and the locals have long since stopped noticing it.', excludes: ['trade at work: leather'], crisis: ['any'] }, // SEAM-SCENES (item 2, 2026-11-17): its twin
      { text: () => 'Bales of hides and bundled pelts crowd the carts on the road out.', needs: ['exported: hides'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) "out": the hides leave as an export of the town's
      { text: () => 'No carts of hides go out on the road these days.', twinOf: 'Bales of hides and bundled pelts crowd the carts on the road out.', crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // SEAM-SCENES (item 2, 2026-11-17): reworded from "Bales of hides and bundled pelts are stacked high in the tanning yard." (hides at hand, false where every tanner is short): a twin is resolved once and takes no twin of its own (`drawDeclared.js`), so declaring the leather on it would leave the pool two lines where the tanners are short and no hides go out (B7); these words are true wherever the carts line is refused (VETOABLE wording)
      { text: () => 'Frames of drying leather line the lanes, and the sour smell of the pits follows you everywhere.', needs: ['trade at work: leather'], crisis: ['any'] },
      { text: () => 'Hardly a hide hangs drying anywhere, and the lanes smell no worse than anywhere else.', twinOf: 'Frames of drying leather line the lanes, and the sour smell of the pits follows you everywhere.', excludes: ['trade at work: leather'], crisis: ['any'] }, // SEAM-SCENES (item 2, 2026-11-17): its twin // BAR7-SCENES (item 5b, 2026-11-17): reworded from "… the lanes smell of nothing worse than the town." (a hamlet's tanner reaches this pool: no tier noun)
    ] },
  { key: 'brewers',
    institutions: ['brewer', 'brewery', 'brewhouse', 'ale house', 'alehouse', 'maltster'],
    trade: ['ale', 'beer', 'mead', 'malt'],
    lines: [
      () => 'The sweet, heavy smell of malt hangs over the lane.',
      () => 'A barrel thuds down from a cart, and somebody inside cheers its arrival.',
      () => 'The smell of the mash tun follows you past the brewhouse door.',
      () => 'A cask stands propped by a doorway, waiting for the evening trade.',
    ],
    dominant: [
      { text: (n) => `${n} smells of malt from one end to the other.`, crisis: ['any'] },
      { text: () => 'Barrels are stacked by every doorway, and the carts on the road out are loaded with more.', needs: ['exported: ale'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) "out": the ale leaves as an export of the town's
      { text: () => 'Barrels are stacked by every doorway, and all of it is for the cups here.', twinOf: 'Barrels are stacked by every doorway, and the carts on the road out are loaded with more.', crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
      { text: () => 'The steam of the mash tuns drifts across the roofs, sweet and heavy.', crisis: ['any'] },
    ] },
  { key: 'fish',
    institutions: ['fish market', 'fishmonger', 'fishing', 'fisher', 'fishers'],
    trade: ['fish'],
    lines: [
      // CENSUS-2f, R-AP: the picker reaches `fish` by a fish market's or a fishmonger's NAME, which guarantees no
      // catch (soak1k-152), so every line here declares `fish` (the food record's source) and a refused beat redraws.
      { text: () => "Gulls quarrel over the fish stalls, and the air smells of the morning's catch.", needs: ['trade at work: fish', 'market', 'navigable', 'fish'], excludes: ['crisis: hunger'] }, // TAIL-HISTORY-5 (the chair's Y17 (2) and its 04:08 note: ONE CONDITION FOR THE WHOLE FAMILY of fish-and-catch lines): no catch where the food failed or under a siege (0 of the 720 at d7921a40c; the family's measure is in the hand-back)
      { text: () => 'Gulls quarrel over the empty fish stalls, and there is no morning catch to smell.', twinOf: "Gulls quarrel over the fish stalls, and the air smells of the morning's catch.", needs: ['market', 'navigable', 'fish'] }, // TAIL-HISTORY-5 (Y17): its twin there
      { text: () => 'A fishmonger shouts a price over the slap of wet baskets.', needs: ['trade at work: fish', 'fish', 'market'], excludes: ['crisis: hunger'] }, // W2-FIX-DATA: a price is shouted at a market (c05); TAIL-HISTORY-5 (Y17, the family's one condition): no catch to sell where the food failed or under a siege
      { text: () => 'A fishmonger stands behind an empty slab, with nothing to shout a price for.', twinOf: 'A fishmonger shouts a price over the slap of wet baskets.', needs: ['fish', 'market'] }, // TAIL-HISTORY-5 (Y17): its twin there
      { text: () => 'Nets hang drying on poles, and the smell of the catch follows you.', needs: ['trade at work: fish', 'fish'], excludes: ['crisis: hunger'] }, // TAIL-HISTORY-5 (the chair's Y17 (2), 2026-11-15; the bar's readers at 5d1e3096b): no catch under a siege or where the food failed (5 of 11 towns)
      { text: () => 'Nets hang drying on poles, and they have brought in little for a long while.', twinOf: 'Nets hang drying on poles, and the smell of the catch follows you.', needs: ['fish'] }, // TAIL-HISTORY-5 (Y17): its twin there; a twin keeps the slot and spends no redraw
      { text: () => 'A basket of fish, still flapping, is carried past at a run.', needs: ['trade at work: fish', 'fish'], excludes: ['crisis: hunger'] }, // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 02382): no fresh catch under a siege or where the food failed
      { text: () => 'An empty fish basket is carried past, back from the water with nothing in it.', twinOf: 'A basket of fish, still flapping, is carried past at a run.', needs: ['fish'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (true where the famine took the catch or the fish houses are short)
    ],
    dominant: [
      // CENSUS-2f, R-AP amended: the dominant pool is picked by the exports' fish trade, which guarantees the trade and no
      // catch; the racks of catch and the gutting declare `fish`, the gulls' water `navigable`, both where both.
      { text: () => 'Racks of drying fish line the way in, and the smell of salt and catch is everywhere.', needs: ['trade at work: fish taken here', 'navigable', 'fish'], excludes: ['crisis: hunger'] }, // BAR8-SCENES (item 3, J's 11b, 2026-11-17): the catch dried here is TAKEN here (`trade at work: fish taken here`): it printed where the river fishery was exhausted and the fish market sold salted fish bought in (bar0-town-occupied-rand-45, C36591) // TAIL-HISTORY-5 (the chair's Y17 (2), 2026-11-15; the bar's readers at 5d1e3096b): a line a crisis can make false is not colour (Y6): no catch drying where the fish failed or under a siege (4 of 36 towns)
      { text: () => 'The drying racks along the way in stand nearly bare, and only the smell of salt and old catch is left.', twinOf: 'Racks of drying fish line the way in, and the smell of salt and catch is everywhere.', needs: ['navigable', 'fish'] }, // TAIL-HISTORY-5 (Y17): its twin there, on the same slot
      { text: (n) => `Half of ${n} seems to be gutting, salting or selling fish.`, needs: ['trade at work: fish taken here', 'fish'], excludes: ['crisis: hunger'] }, // BAR8-SCENES (item 3, J's 11b): the same (bar0-metropolis-calm-rand-45, C19722) // TAIL-HISTORY-5 (Y17): the same (1 of 27 towns)
      { text: (n) => `Half of ${n} has worked fish all its life, and there is almost no fish to work.`, twinOf: 'Half of {name} seems to be gutting, salting or selling fish.', needs: ['fish'] }, // TAIL-HISTORY-5 (Y17): its twin there
      { text: () => 'Barrels of salt fish stand stacked by the water, and the gulls have opinions about every one.', needs: ['trade at work: fish', 'navigable'], excludes: ['crisis: hunger'] }, // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 04287): "stacked for the carts" printed under a siege, when no cart leaves; reworded to name no carts, so no condition and no new line in the pool (VETOABLE wording, the owner's); TAIL-HISTORY-5 (Y17): no stacked salt fish where the food failed or is cut off (5 of 18 towns)
      { text: () => 'Empty salt barrels stand stacked by the water, and even the gulls have given up on them.', twinOf: 'Barrels of salt fish stand stacked by the water, and the gulls have opinions about every one.', needs: ['navigable'] }, // TAIL-HISTORY-5 (Y17): its twin there
      // L2 (PAGE-2's lines, 2026-11-20): APPENDED. The chair's cures (15:35): each declares the fish at work and refuses the
      // hunger, as the barrels above; its twin (the chair's text, 17:13) answers on the same slot where the fish is short
      { text: (n) => `Talk in ${n} turns to fish sooner or later, whatever it started on.`, needs: ['trade at work: fish'], excludes: ['crisis: hunger'] },
      { text: () => 'A gutting knife hangs by more than one doorway, its blade worn thin with use.', needs: ['trade at work: fish'], excludes: ['crisis: hunger'] },
      { text: () => 'Even the dogs here smell faintly of fish, and nobody but you seems to notice.', needs: ['trade at work: fish'], excludes: ['crisis: hunger'] },
      // L2 (the chair's three fish twins, 2026-11-20 17:13): APPENDED, each the twin of an L2 line above (the fish-twin law,
      // tailHistoryBatch6.test.js): its original's needs less the fish keys, so none
      { text: (n) => `Talk in ${n} turns to fish sooner or later, and lately to how few there are.`, twinOf: 'Talk in {name} turns to fish sooner or later, whatever it started on.', needs: [] },
      { text: () => 'A gutting knife hangs by more than one doorway, and few of them have seen much use of late.', twinOf: 'A gutting knife hangs by more than one doorway, its blade worn thin with use.', needs: [] },
      { text: () => 'The dogs here still run to meet anyone coming up from the water, and get little for it these days.', twinOf: 'Even the dogs here smell faintly of fish, and nobody but you seems to notice.', needs: [] },
    ] },
  { key: 'cloth',
    institutions: ['weaver', 'weavers', 'textile', 'fuller', 'dyer', 'tailor', 'clothier', 'draper'],
    trade: ['wool', 'cloth', 'textile', 'linen', 'silk', 'dye'],
    lines: [
      // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): the key is reached by a tailor or a draper, who sew and sell cloth; each line shows cloth MADE (`trade at work: cloth`), its twin keeps the slot
      // SEAM-SCENES (item 9, 2026-11-17): or cloth DYED (`trade at work: dyed cloth`, the dyer's kind): a dyer answers only a line that shows dyeing
      { text: () => 'A loom clatters behind an open shutter.', needs: ['trade at work: cloth'] },
      { text: () => 'Someone sits stitching a seam behind an open shutter.', twinOf: 'A loom clatters behind an open shutter.', excludes: ['trade at work: cloth'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
      { text: () => 'Lengths of dyed cloth hang drying in bright strips between the houses.', needs: ['trade at work: dyed cloth'] }, // SEAM-SCENES (item 9, 2026-11-17): cloth dyed: the dyer's kind (`tradeAtWork.js :: CLOTH_KINDS`)
      { text: () => 'A length of plain cloth hangs in a shop doorway, waiting to be cut and sewn.', twinOf: 'Lengths of dyed cloth hang drying in bright strips between the houses.', excludes: ['trade at work: dyed cloth'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // SEAM-SCENES (item 9, 2026-11-17): reworded from "… brought in from elsewhere to be cut and sewn." (false where the weavers work and no dyer does; VETOABLE wording)
      { text: () => 'The thump of the fulling stocks carries from the cloth yard.', needs: ['trade at work: cloth'] },
      { text: () => 'Bolts of cloth are measured out on a shop counter, a length at a time.', twinOf: 'The thump of the fulling stocks carries from the cloth yard.', excludes: ['trade at work: cloth'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
      { text: () => 'A dyer walks past with hands stained to the wrist.', needs: ['trade at work: dyed cloth'] }, // SEAM-SCENES (item 9, 2026-11-17): the dyer's kind
      { text: () => 'Someone walks past with a measuring cord round their neck and a bolt of cloth under one arm.', twinOf: 'A dyer walks past with hands stained to the wrist.', excludes: ['trade at work: dyed cloth'] }, // BAR7-SCENES (item 5a, 2026-11-17): a twin excludes the key its original needs (it excluded the cloth made: where cloth was made and no dyer worked, both were refused and the slot was lost) // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
    ],
    dominant: [
      { text: (n) => `The clatter of looms follows you through ${n}, from one shutter to the next.`, needs: ['trade at work: cloth'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): the looms want a house that makes cloth // TAIL-HISTORY-5 (Y17 (3)): not the whole place weaving as usual under a siege
      { text: (n) => `Here and there someone works cloth behind a shutter in ${n}, though little of it goes out these days.`, twinOf: 'The clatter of looms follows you through {name}, from one shutter to the next.', crisis: ['any'] }, // TAIL-HISTORY-5 (Y17): its twin under a siege; BAR6-SCENES (6b): reworded to name no loom, so it is true where no house weaves too (VETOABLE wording)
      { text: () => 'Bolts of cloth and bales of wool fill the carts waiting on the road out.', needs: ['exported: cloth'], excludes: ['crisis: under_siege', 'route: isolated'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) "out" (REVIEW-WIDE-6 C39804): the cloth or the wool leaves as an export of the town's (an income share opened the pool) // TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): no road out where no route reaches (1 of 22)
      { text: () => 'Bolts of cloth and bales of wool are stacked in the shops, and none of it is going anywhere.', twinOf: 'Bolts of cloth and bales of wool fill the carts waiting on the road out.', crisis: ['any'] }, // BAR6-SCENES (6b "out"): reworded from "stacked high in the workshops, more than the place can wear" (TAIL-HISTORY-3's isolated twin), true where the siege, the route or the export list keeps the cloth in (VETOABLE wording) // TAIL-HISTORY-3 (Y14): its twin where no route reaches; a twin keeps the slot and spends no redraw (arrivalScene.js :: drawAdmitted), so no later beat moves (VETOABLE wording)
      { text: () => 'Bolts of cloth hang drying in long bright strips across the yards.', needs: ['trade at work: cloth'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): cloth made here // SEAM-SCENES (item 9, 2026-11-17): bolts of new cloth: a house that MAKES cloth not short (no longer a dyer alone: bar0-city-wartime-rand-33, bar0-city-under_siege+famine-rand-35, bar0-metropolis-calm-rand-35)
      { text: () => 'Little cloth is made here, and the cloth that is sold was brought in from elsewhere.', twinOf: 'Bolts of cloth hang drying in long bright strips across the yards.', excludes: ['trade at work: cloth'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // BAR3-PLACES (H1, 2026-11-15): not every yard: the trade is named, not its whole share // BAR7-SCENES (item 5d, 2026-11-17; SEAM-SCENES's proposal, VETOABLE): reworded from "Bolts of cloth brought in from elsewhere are stacked in the shops, waiting to be cut.": it says first that little cloth is made here; true under a siege too (bolts in the shops, none on the road) // BAR7-SCENES (the chair's second-reader note, 2026-11-17): it names no shop ("… and the bolts in the shops were …"): r2r-village-26 of the 720 printed it; a village has no row of shops, and what stands at every tier is that the cloth sold was brought in ("was": true under a siege)
    ] },
  { key: 'livestock',
    institutions: ['livestock', 'cattle', 'stockyard', 'shambles', 'slaughter', 'shepherd', 'drover', 'dairy farmer', 'common grazing', 'herd'],
    trade: ['livestock', 'cattle', 'sheep', 'raw wool', 'dairy', 'cheese', 'mutton', 'beef'],
    lines: [
      { text: () => 'Sheep call to one another from the grazing beyond the houses.', excludes: ['crisis: under_siege', 'crisis: monster_pressure'], crisis: ['any'] },
      { text: () => 'A dog drives a handful of animals across the road, and you wait for them.', excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR3-PLACES (H1, 2026-11-15): no herd crosses the road under a siege
      { text: () => 'The smell of the byres reaches you on the breeze.', crisis: ['any'] },
      { text: () => 'Someone is churning butter in a doorway, and the rhythm of it carries.', needs: ['trade at work: dairy'], excludes: ['failed: livestock'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) (REVIEW-WIDE-6 C219863): "Common grazing land" opened the pool with no dairy; butter wants milk animals kept or a dairy good made
      { text: () => 'Someone is mending a hurdle in a doorway, and the knock of the mallet carries.', twinOf: 'Someone is churning butter in a doorway, and the rhythm of it carries.', crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
      // L2 (PAGE-2's lines, 2026-11-20): APPENDED. Animals kept, as the byres' line says, no kind named and no herd on the
      // road, so a siege or a failed herd leaves each true (`crisis: any`, as the byres')
      { text: () => 'Hoofprints and dung mark the lane, and you learn quickly to watch where you step.', crisis: ['any'] },
      { text: () => 'An animal bawls from a byre somewhere close, and another answers it.', crisis: ['any'] },
      { text: () => 'Someone leads a single beast along the lane on a halter, talking to it the whole way.', colour: true },
    ],
    dominant: [
      { text: () => 'Drovers push their herds along the road, and the whole place smells of the pens.', excludes: ['crisis: under_siege', 'failed: livestock'], crisis: ['any'] }, // BAR4-SCENES (kind A1; REVIEW-BAR-4 C46725): no herds on the road where the famine failed them
      { text: () => 'The pens at the edge of the settlement stand half empty, and the drovers have little left to drive.', twinOf: 'Drovers push their herds along the road, and the whole place smells of the pens.', needs: ['failed: livestock'], crisis: ['any'] }, // BAR4-SCENES (A1): its twin where the herds failed; a twin keeps the slot and spends no redraw
      { text: (n) => `The lowing of penned cattle carries across ${n} at every hour.`, excludes: ['failed: livestock'], crisis: ['any'] }, // BAR4-SCENES (A1): not full pens where the herds failed
      { text: (n) => `The few cattle left in the pens of ${n} low at every hour.`, twinOf: 'The lowing of penned cattle carries across {name} at every hour.', needs: ['failed: livestock'], crisis: ['any'] }, // BAR4-SCENES (A1): its twin there
      { text: () => 'Hurdles and holding pens crowd the edge of the settlement, full and noisy.', excludes: ['crisis: hunger'], crisis: ['any'] },
    ] },
  { key: 'faith',
    institutions: ['cathedral', 'temple', 'church', 'churches', 'chapel', 'monastery', 'abbey', 'shrine', 'priory', 'friary', 'priest'],
    trade: ['pilgrim', 'relic', 'religious tourism'],
    lines: [
      // CENSUS-2f, R-AP: the key is reachable by a `priest` or `chapel` name with no sacred house on the roster, so the
      // bell, the incense and the hymn declare `sacredHouse`; the wayside shrine set into a wall presumes nothing.
      { text: () => 'A bell marks the hour, and a few heads bow as it rings.', needs: ['sacredHouse'] },
      { text: () => 'The smell of incense drifts out into the lane.', needs: ['sacredHouse'] },
      { text: () => 'Someone has left fresh flowers at a small shrine set into a wall.', colour: true }, // R-AO: read; presumes nothing
      { text: () => 'Voices raised in a hymn carry, faintly, from somewhere among the roofs.', needs: ['sacredHouse'] },
    ],
    dominant: [
      { text: () => "Pilgrims crowd the road in, and every second stall sells candles, tokens or someone's blessing.", needs: ['market'], excludes: ['crisis: threat'], crisis: ['any'] },
      { text: (n) => `The bells of ${n} answer one another across the roofs, and the streets slow for them.`, needs: ['church', 'tier: ≥ town'], crisis: ['any'] }, // W2-FIX-DATA-4 (ROUND-3 #46): bells answering one another and streets want a house of worship (a shrine is not one) and a town (rr2s-thorp-famine-rand-1: a wayside shrine, 12 people)
      { text: () => 'Pilgrims in travel-stained cloaks queue patiently for their turn at the holy places.', needs: ['church'], excludes: ['crisis: threat', 'crisis: unrest'], crisis: ['any'] }, // W2-FIX-DATA-4 (ROUND-3 #46): the holy places want a house of worship (a wayside shrine is not one) (the line a refused bell line redraws onto)
    ] },
  { key: 'stone',
    institutions: ['quarry', 'stone quarry', 'mason', 'mine', 'mines', 'stonecutter'],
    trade: ['stone', 'marble', 'granite', 'coal', 'ore', 'gemstone'],
    lines: [
      // BAR4-SCENES-2 (HW1; kind A1's `house at work`): each line shows the workings at work: some stone house not short, and no siege stopping it (the chair's HW1 (c))
      { text: () => 'A fine grey dust from the workings settles on every doorstep.', needs: ['trade at work: stone'], excludes: ['crisis: under_siege'] },
      { text: () => 'Old grey dust from the workings still lies in the doorways, but no new dust comes.', twinOf: 'A fine grey dust from the workings settles on every doorstep.' }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (true where the workings are short or the siege stops them)
      { text: () => 'Carts of rock grind past, their axles complaining.', needs: ['trade at work: stone'], excludes: ['crisis: under_siege'] },
      { text: () => 'Few carts of rock come down from the workings now.', twinOf: 'Carts of rock grind past, their axles complaining.' }, // BAR4-SCENES-2 (HW1): its twin, true where the workings are short or the siege stops them; a twin keeps the slot
      { text: () => 'The chink of chisels on stone carries on the wind.', needs: ['trade at work: stone', 'trade at work: cut stone'], excludes: ['crisis: under_siege'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) (REVIEW-WIDE-6 C84094): chisels are the stone's cutters; a mine digs
      { text: () => 'No chink of chisels comes from the workings today.', twinOf: 'The chink of chisels on stone carries on the wind.' }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (as above)
      { text: () => 'Workers coming off a shift are grey with dust to the eyebrows.', needs: ['trade at work: stone'], excludes: ['crisis: under_siege'] },
      { text: () => 'Workers who cut the stone stand idle by the road, the old dust still in their clothes.', twinOf: 'Workers coming off a shift are grey with dust to the eyebrows.' }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (as above)
    ],
    dominant: [
      { text: (n) => `Part of ${n}'s living comes out of the ground, and its dust is on the doorsteps nearest the workings.`, needs: ['trade at work: stone'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR3-PLACES (H1, 2026-11-15): the trade is named, not its share: the income may lie elsewhere
      { text: (n) => `Part of ${n}'s living used to come out of the ground, and the workings stand quiet now.`, twinOf: "Part of {name}'s living comes out of the ground, and its dust is on the doorsteps nearest the workings.", crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (as above)
      { text: () => 'Laden carts from the workings grind along the road in a line that never seems to end.', needs: ['trade at work: stone', 'tier: ≥ village'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR8-SCENES (item 6, K's 15a, 2026-11-17): a line of carts with no end wants a place of a village's size or more, whose workings move carts all day; a thorp or a hamlet of tens of people does not (hamlets of 27 to 93 printed it, C15891; the second check called it WEAK in a hamlet of 70, C16854); there its twin keeps the slot // BAR2-PLACES (PL1): no ore claimed (a quarry town with no ore printed it); the workings are the key's own
      { text: () => 'The road from the workings is empty of carts.', twinOf: 'Laden carts from the workings grind along the road in a line that never seems to end.', crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (as above) // BAR8-SCENES-3 (BR25 (3), 2026-11-18): back to its base declaration (BAR8-SCENES had it exclude `tier: ≤ hamlet`, which left a thorp or a hamlet whose stone is idle, or at work under a siege, with no twin admitted and the pool at two); where the small cart below is admitted too, the cart answers (`arrivalScene.js :: drawAdmitted`: a line's LAST admitted twin)
      { text: () => 'Spoil heaps rise beyond the houses, and the sound of the workings never quite stops.', needs: ['trade at work: stone'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR4-SCENES-2 (HW1; kind A1's `house at work`)
      { text: () => 'Spoil heaps rise beyond the houses, but the workings beyond them stand quiet.', twinOf: 'Spoil heaps rise beyond the houses, and the sound of the workings never quite stops.', crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin, true where the workings are short or the siege stops them
      { text: () => 'A laden cart or two comes down from the workings in a day, and no more.', twinOf: 'Laden carts from the workings grind along the road in a line that never seems to end.', needs: ['trade at work: stone', 'tier: ≤ hamlet'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR8-SCENES (BR23 (1), 2026-11-17; a TWIN given by name, VETOABLE wording): a thorp's or a hamlet's workings at work send a cart or two, not an endless line (C15891, bar0-hamlet-calm-rand-45); first worded "… and the road is quiet between them.", which the presumption-classes walker reads as a claim of no threat (`is quiet`); the first admitted twin answers (`arrivalScene.js :: drawAdmitted`)
    ] },
  { key: 'timber',
    institutions: ['carpenter', 'carpenters', 'sawmill', 'woodcutter', 'lumber', 'joiner', 'cooper', 'shipwright', 'wheelwright', 'woodcarver'],
    trade: ['timber', 'plank', 'lumber', 'sawn'],
    lines: [
      // BAR6-SCENES (the chair's ruling TW1, 2026-11-16): each line shows wood worked: some house of the wood trades stands and is not short (`trade at work: woodwork`); its twin keeps the slot
      { text: () => 'The rasp of a saw and the smell of fresh-cut wood come from a workshop yard.', needs: ['trade at work: woodwork'] },
      { text: () => 'A saw hangs on its nail in a workshop yard, with no wood on the trestles.', twinOf: 'The rasp of a saw and the smell of fresh-cut wood come from a workshop yard.', excludes: ['trade at work: woodwork'] }, // BAR6-SCENES (the chair's ruling TW1, 2026-11-16): its twin
      { text: () => 'Sawn planks stand stacked to season against a wall.', needs: ['trade at work: woodwork'] },
      { text: () => 'A few old planks lean against a wall, grey with weather.', twinOf: 'Sawn planks stand stacked to season against a wall.', excludes: ['trade at work: woodwork'] }, // BAR6-SCENES (the chair's ruling TW1, 2026-11-16): its twin
      { text: () => 'Curls of shavings and chips of bark blow across the lane.', needs: ['trade at work: woodwork'] }, // BAR2-PLACES (PL1): no carpenter claimed (a woodcutter's camp reaches this key)
      { text: () => 'Old shavings lie trodden into the lane, and no new ones blow across it.', twinOf: 'Curls of shavings and chips of bark blow across the lane.', excludes: ['trade at work: woodwork'] }, // BAR6-SCENES (the chair's ruling TW1, 2026-11-16): its twin
      { text: () => 'The knock of a mallet on wood keeps time somewhere close.', needs: ['trade at work: woodwork'] },
      { text: () => 'A workshop door stands open on an idle bench, and no mallet sounds from it.', twinOf: 'The knock of a mallet on wood keeps time somewhere close.', excludes: ['trade at work: woodwork'] }, // BAR6-SCENES (the chair's ruling TW1, 2026-11-16): its twin
    ],
    dominant: [
      { text: (n) => `The smell of sawn timber is everywhere in ${n}, and so is the sawdust.`, needs: ['timber reaches the saws'] }, // BAR4-SCENES (kind A1; REVIEW-BAR-4 C45961): the whole place sawing wants wood: timber reaches the saws, its own or brought in (BAR4-SCENES-2: one home, `timberAtHand.js` on `houseInputAtHand.js`)
      { text: (n) => `Timber is scarce in ${n}, and what little wood the workshops get is worked to the last shaving.`, twinOf: 'The smell of sawn timber is everywhere in {name}, and so is the sawdust.', excludes: ['timber reaches the saws'] }, // BAR4-SCENES (A1): its twin where no timber reaches the saws; a twin keeps the slot and spends no redraw
      { text: () => 'Stacks of seasoning planks line the road in, taller than the carts that wait for them.', needs: ['timber reaches the saws'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind b): no cart waits on a road the siege has cut; BAR4-SCENES (A1): and no stacks without wood
      { text: () => 'A few planks stand seasoning by the road in, and there is little timber to add to them.', twinOf: 'Stacks of seasoning planks line the road in, taller than the carts that wait for them.', excludes: ['timber reaches the saws'], crisis: ['any'] }, // BAR4-SCENES (A1): its twin where no timber reaches the saws
      { text: () => 'The rasp of the saws carries from yard to yard all through the day.', needs: ['timber reaches the saws'] }, // BAR4-SCENES (A1): the saws want wood
      { text: (n) => `The saws of ${n} are quiet most days, for want of timber to cut.`, twinOf: 'The rasp of the saws carries from yard to yard all through the day.', excludes: ['timber reaches the saws'] }, // BAR4-SCENES (A1): its twin where no timber reaches the saws
    ] },
  { key: 'kilns',
    institutions: ['potter', 'pottery', 'kiln', 'brickmaker', 'charcoal', 'glassblower', 'glassmaker', 'glassmakers', 'lime'],
    trade: ['pottery', 'brick', 'charcoal', 'glass', 'ceramic'],
    lines: [
      // BAR4-SCENES-2 (HW1; kind A1's `house at work`): each line shows a kiln house at work: some kiln house not short of its clay, sand or wood
      { text: () => 'A thread of kiln smoke rises over the roofs, and the air tastes faintly of ash.', needs: ['trade at work: kilns'] },
      { text: (n) => `The kilns of ${n} are cold more days than they are lit.`, twinOf: 'A thread of kiln smoke rises over the roofs, and the air tastes faintly of ash.', excludes: ['trade at work: kilns'] }, // BAR4-SCENES-2 (HW1): its twin where every kiln house is short; a twin keeps the slot
      { text: () => 'Fresh pots stand drying in a row outside a workshop.', needs: ['trade at work: clay kilns'] }, // BAR5-THINGS (LAW 4 "the kilns"): pots are a clay kiln's
      { text: () => 'Drying boards stand empty outside a workshop, with no fresh pots on them.', twinOf: 'Fresh pots stand drying in a row outside a workshop.', excludes: ['trade at work: clay kilns'] }, // BAR5-THINGS: where a clay kiln stands and is short // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => 'Charcoal smoke lingers in the lane, thick and sweetish.', needs: ['trade at work: charcoal kilns'] }, // BAR5-THINGS (LAW 4 "the kilns"): a charcoal burner's
      { text: () => 'The charcoal clamps at the end of the lane stand cold and unlit.', twinOf: 'Charcoal smoke lingers in the lane, thick and sweetish.', excludes: ['trade at work: charcoal kilns'] }, // BAR5-THINGS: where a charcoal burner stands and is short // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => 'The heat of a working kiln reaches you from across the lane.', needs: ['trade at work: kilns'] },
      { text: () => 'A kiln stands cold across the lane, its mouth bricked up for now.', twinOf: 'The heat of a working kiln reaches you from across the lane.', excludes: ['trade at work: kilns'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
    ],
    dominant: [
      { text: (n) => `Kiln smoke hangs over ${n}, and the dust of fired clay is on everything.`, needs: ['trade at work: clay kilns'], crisis: ['any'] }, // BAR5-THINGS (LAW 4 "the kilns"; REVIEW-BAR-5 C15951): fired clay is a clay kiln's // BAR4-SCENES-2 (HW1; kind A1's `house at work`)
      { text: (n) => `Old kiln dust lies on the doorsteps of ${n}, but little smoke rises now.`, twinOf: 'Kiln smoke hangs over {name}, and the dust of fired clay is on everything.', excludes: ['trade at work: kilns', 'trade at work: clay kilns'], crisis: ['any'] }, // BAR5-THINGS: where a clay kiln is short and no kiln smokes // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => 'Crates of pots, packed in straw, stand stacked in the kiln yard.', needs: ['trade at work: clay kilns'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b "out"; REVIEW-WIDE-6 C115374): was "Crates of pots and glassware, packed in straw, wait for the carts on the road out." (the pots unexported, and a potter makes no glass): reworded to send nothing out, so it needs no export and no open road (VETOABLE wording)
      { text: () => 'The yard where crates of pots once waited for the carts stands nearly empty.', twinOf: 'Crates of pots, packed in straw, stand stacked in the kiln yard.', excludes: ['trade at work: kilns', 'trade at work: clay kilns'], crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves (true where the kilns are short or the siege holds the road)
      { text: () => 'The kilns are lit all through the day, and the heat of them is in every lane.', needs: ['trade at work: kilns'], crisis: ['any'] },
      { text: (n) => `The kilns of ${n} are lit only now and then, and most days the lanes are cold.`, twinOf: 'The kilns are lit all through the day, and the heat of them is in every lane.', excludes: ['trade at work: kilns'], crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin where every kiln house is short
    ] },
  { key: 'horses',
    institutions: ['coaching inn', 'stable', 'stables', 'livery', 'carriers', 'post relay', 'horse', 'beast trainers', 'caravaneer'],
    trade: ['horse', 'haulage', 'carting', 'caravan'],
    lines: [
      { text: () => 'The smell of horses and hay comes from the stables.', colour: true }, // BAR4-SCENES-2 (HW1): read; presumes nothing (horses are stabled under a siege too)
      // BAR4-SCENES-2 (HW1; kind A1's `house at work`) (c): the traffic of a road the siege has cut: none of it under a siege
      { text: () => 'A team stands in harness, stamping, while the carters argue over the load.', excludes: ['crisis: under_siege'] },
      { text: () => 'A team stands unharnessed in the yard; no carter has a load to take out.', twinOf: 'A team stands in harness, stamping, while the carters argue over the load.', needs: ['crisis: under_siege'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => 'An ostler leads a tired horse past you toward the trough.', excludes: ['crisis: under_siege'] },
      { text: () => 'An ostler walks a horse up and down the yard; no rider has come in for days.', twinOf: 'An ostler leads a tired horse past you toward the trough.', needs: ['crisis: under_siege'] }, // BAR4-SCENES-2 (HW1): its twin under the siege; a twin keeps the slot
      { text: () => 'Harness jingles somewhere behind you as a cart pulls out.', excludes: ['crisis: under_siege'] },
      { text: () => 'Harness hangs on its pegs by the yard gate, and no cart pulls out.', twinOf: 'Harness jingles somewhere behind you as a cart pulls out.', needs: ['crisis: under_siege'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
    ],
    dominant: [
      { text: () => 'Hooves and wheels fill the road, and the yards are crowded with teams changing over.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: (n) => `${n} is loud with horses: shod, sold, hired and fed at every hour.`, excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR4-SCENES-2 (HW1; kind A1's `house at work`) (c): no horses hired or changed where the siege has cut the road
      { text: (n) => `${n} is full of horses with nowhere to go while the road stays closed.`, twinOf: '{name} is loud with horses: shod, sold, hired and fed at every hour.', needs: ['crisis: under_siege'], crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin under the siege
      { text: () => 'Fresh horses stand saddled and waiting while the tired ones are led away.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: () => 'Horses stand in their stalls with no rider to carry while the road stays closed.', twinOf: 'Fresh horses stand saddled and waiting while the tired ones are led away.', needs: ['crisis: under_siege'], crisis: ['any'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
    ] },
  { key: 'market',
    institutions: ['market square', 'market squares', 'weekly market', 'daily markets', 'markets', 'market hall', 'bazaar', 'annual fair', 'fairs'],
    trade: [],
    lines: [
      // CENSUS-2f, R-AP: the key is picked by name fragments, not by the market's own reader (`isMarketInstitution`,
      // the catalogue's tags), so every line declares the `market` it presumes.
      { text: () => 'Stallholders call their wares over the noise of the market.', needs: ['market'], crisis: ['any'] },
      { text: () => 'The market is loud with haggling long before noon.', needs: ['market'], excludes: ['crisis: threat'], crisis: ['any'] },
      { text: () => 'A knot of buyers argues over a price, and the seller enjoys every word of it.', needs: ['market'], excludes: ['crisis: threat', 'crisis: hunger'], crisis: ['any'] },
      { text: () => 'A child weaves between the stalls with a basket bigger than she is.', needs: ['market'], crisis: ['any'] },
    ],
    dominant: [] },
  { key: 'herbs',
    institutions: ['apothecary', 'herbalist', 'physician', 'healer', 'spice'],
    trade: ['herb', 'medicine', 'spice', 'remed'],
    lines: [
      () => 'The bitter smell of drying herbs drifts from an apothecary\'s door.',
      () => 'Bundles of herbs hang under the eaves of a narrow shop, and their scent reaches the lane.',
      () => 'Someone is grinding something pungent behind an open shutter.',
    ],
    dominant: [
      { text: () => 'Spice and drying herbs scent every lane, and the stalls are piled with them.', needs: ['market', 'trade at work: spice'], excludes: ['crisis: hunger', 'crisis: under_siege'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16) (REVIEW-WIDE-6 C15780): spice made here, sold, or brought in past no siege; no stalls piled under a famine or a siege
      { text: () => 'A few bundles of drying herbs hang by the stalls, and there is little else to scent the lanes.', twinOf: 'Spice and drying herbs scent every lane, and the stalls are piled with them.', needs: ['market'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin
      { text: () => 'Sacks of herbs and spices stand open in the doorways, and the smell of them clings to your clothes.', needs: ['trade at work: spice'] }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): the spice is made here, sold, or brought in past no siege (a line a fact can make false leaves the colour mark)
      { text: () => 'A doorway here and there sells remedies, and the bitter smell of them reaches the lane.', twinOf: 'Sacks of herbs and spices stand open in the doorways, and the smell of them clings to your clothes.' }, // BAR6-SCENES (LAW 6 rule 6b, 2026-11-16): its twin // R-AO (CENSUS-2f); TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): no carts where no route reaches (2 of 12): reworded, the colour mark kept
      { text: () => 'Every other doorway seems to sell a remedy for something.', colour: true },
    ] },
  { key: 'arcane', arcane: true,
    institutions: ['mage', 'mages', 'wizard', 'arcane', 'alchemist', 'alchemy', 'enchanter', 'enchanting', 'sorcer', 'magelight', 'spellcast'],
    trade: ['enchant', 'arcane', 'potion', 'spellcasting', 'magical'],
    lines: [
      // BAR4-SCENES-2 (HW1; kind A1's `house at work`): each line shows magic worked: some arcane house not short of its materials
      { text: () => 'A faint glow lingers in an upper window, even at midday.', needs: ['trade at work: arcane'] },
      { text: () => 'Shutters are drawn on an upper window where, they say, magic used to be worked.', twinOf: 'A faint glow lingers in an upper window, even at midday.', excludes: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => "The air near an alchemist's door smells of sulphur and something sweeter.", needs: ['trade at work: arcane'] },
      { text: () => 'Doors where magic is worked stay shut, for want of what the work needs.', twinOf: "The air near an alchemist's door smells of sulphur and something sweeter.", excludes: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1): its twin where every arcane house is short; a twin keeps the slot
      { text: () => 'A vendor sells charms from a tray, and nobody laughs at the buyers.', needs: ['trade at work: arcane'] },
      { text: () => "A charm-seller's tray stands nearly empty, and few stop to look.", twinOf: 'A vendor sells charms from a tray, and nobody laughs at the buyers.', excludes: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: () => 'A lamp that burns without oil lights a doorway off the lane.', needs: ['trade at work: arcane'] },
      { text: () => 'A doorway off the lane is lit by an ordinary oil lamp.', twinOf: 'A lamp that burns without oil lights a doorway off the lane.', excludes: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
    ],
    dominant: [
      { text: (n) => `Magic is a trade in ${n} like any other: signs offer enchanting and identification by the hour.`, needs: ['enchanting', 'trade at work: arcane'] }, // BAR4-SCENES (kind A1; REVIEW-BAR-4 C2056): the signs want a house that offers it (the Services tab's rows)
      { text: (n) => `No sign in ${n} offers enchanting by the hour; what magic is worked here is the work of its own houses, not a trade on the street.`, twinOf: 'Magic is a trade in {name} like any other: signs offer enchanting and identification by the hour.', excludes: ['enchanting'] }, // BAR6-SCENES (LAW 9 rule 9e.quietly; REVIEW-WIDE-6 C32780): was "Nobody in X sells enchanting by the hour, and what magic is done here is done quietly", false beside an enchanting chain at work or a reliance the page prints Integral; reworded to claim neither, so it keeps the slot in every town its original refuses (VETOABLE wording) // BAR4-SCENES (A1): its twin where no house offers it
      { text: () => 'The air prickles faintly, the way it does where a great deal of spellwork is done.', needs: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1; kind A1's `house at work`)
      { text: (n) => `Little spellwork is done in ${n} these days, for want of the stuff it takes.`, twinOf: 'The air prickles faintly, the way it does where a great deal of spellwork is done.', excludes: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1): its twin where every arcane house is short
      { text: () => 'Stalls sell reagents in stoppered jars, and the buyers know exactly what they want.', needs: ['trade at work: arcane'] },
      { text: () => 'The reagent stalls are half bare, and the few jars left are dear.', twinOf: 'Stalls sell reagents in stoppered jars, and the buyers know exactly what they want.', excludes: ['trade at work: arcane'] }, // BAR4-SCENES-2 (HW1): its twin; a twin keeps the slot and spends no redraw, so no other beat of the scene moves
      { text: (n) => `Magic is still a trade in ${n}: the signs still offer it by the hour, but the work is slow and dear for want of what it takes.`, twinOf: 'Magic is a trade in {name} like any other: signs offer enchanting and identification by the hour.', needs: ['enchanting'], excludes: ['trade at work: arcane'] }, // BAR8-SCENES (BR23 (3), 2026-11-17; a TWIN given by name, VETOABLE wording): enchanting is offered and the arcane trade is not at work (impaired under the siege, or short): its original and the twin above were both refused (bar0-city-under_siege+famine-rand-47, r2r-metropolis-14, r2r-metropolis-31) // BAR8-SCENES-3 (BR25 (2), 2026-11-18; REWORDED BY NAME, VETOABLE): was "Signs in {name} still offer enchanting by the hour, …", false where the page's only arcane service is "Arcane identification" (the atom `enchanting` reads enchant OR identif: bar0-city-under_siege+famine-rand-47, -33, r2s-under_siege-town-1); it now names no service; the declaration is unchanged
      // L2 (PAGE-2's lines, 2026-11-20): APPENDED. Each says that magic is worked here at all (the key's own fact, where magic is
      // real), not that its materials are at hand today: nothing to declare, no twin
      { text: () => 'Sigils are scratched into door frames here and there, and not all of them are for show.', needs: ['trade at work: arcane'] },
      { text: (n) => `People in ${n} step around a chalked circle on the ground without looking down, the way people elsewhere step around a puddle.`, needs: ['trade at work: arcane'] },
      { text: (n) => `Snatches of talk in the lanes of ${n} are full of spellwork's own words, used as plainly as talk of the weather.`, needs: ['trade at work: arcane'] },
    ] },
]);

/**
 * PEOPLE: what the settlement's people are doing, by its culture profile's own authored traits
 * (src/data/cultureProfiles.js: socialTexture, exchangePattern, civicPattern). Shown, never explained. Keyed on
 * `resolveCultureProfileKey`, so `mixed` speaks for every culture the catalogue does not carry. No line names an
 * institution: a guild officer or a court would be a claim about the settlement's roster.
 * @type {Readonly<Record<string, ReadonlyArray<ArrivalLine>>>}
 */
export const ARRIVAL_PEOPLE = Object.freeze({
  germanic: [
    () => 'An errand-runner hurries past, a household\'s mark stitched on his sleeve.', // TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): no master's mark where no smith and no guild stands (13 of 23 towns)
    () => 'Two neighbours argue over a boundary stone, each quoting what their grandfathers agreed.',
    () => 'A craftsman shows off a finished piece in his doorway, and passers-by judge it out loud.',
    { text: () => 'A notice of the next fair is nailed up beside a doorway, and someone is reading it aloud for the others.', needs: ['market'], excludes: ['crisis: under_siege'] }, // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 02866 HIGH): no fair is drawn under a siege
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'A pedlar has opened his pack on a doorstep, and a household gathers round to look before anyone admits to wanting anything.', excludes: ['crisis: under_siege'] },
    () => 'A neighbour turns up unasked to help with a roof, and the household makes a note of it, because the day will be owed back.',
    { text: () => 'Loaves of dark rye are carried home under arms, still warm from somebody\'s oven.', excludes: ['crisis: hunger'] },
  ],
  latin: [
    { text: () => 'A patron moves through the crowd with clients at their heels, greeting people by name.', needs: ['tier: ≥ town'], crisis: ['any'] }, // W2-FIX-DATA: a crowd and a patron's clients (c09 at 33)
    { text: () => "A notary's clerk hurries past with a satchel of contracts.", needs: ['tier: ≥ town', 'legal house'], crisis: ['any'] }, // BAR5-THINGS (LAW 4): a notary where a house of written law stands // W2-FIX-DATA: a notary's trade (c03 at 9)
    { text: () => 'People argue politics in the open, loudly, and seem to enjoy it.', excludes: ['crisis: occupied', 'crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-5 (ww-473): not with the enemy at the walls
    { text: () => 'A benefactor\'s name is carved fresh above a mended well, and people make sure you notice it.', crisis: ['any'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'A small lamp burns in a niche beside a doorway, with an offering set before it.', crisis: ['any'] },
    { text: () => 'Two men shake hands on a bargain and then, to be sure, have it written down.', crisis: ['any'] },
    { text: () => "A family's name is painted on a new bench by the road, so that everyone who sits on it knows whom to thank.", crisis: ['any'] },
  ],
  celtic: [
    { text: () => 'A poet holds a small crowd by the well, and nobody hurries the telling along.', crisis: ['any'] },
    { text: () => 'A household feeds passing travellers at its door, and makes sure everyone sees it doing so.', excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => 'Greetings are called across the lane, and every greeting comes with a question about family.', crisis: ['any'] },
    { text: () => 'An elder listens to two neighbours by a gate and says nothing until both are finished.', crisis: ['any'] }, // BAR6-SCENES (LAW 5 widened, the office class): no judge named where the roster holds no court (VETOABLE wording)
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => "A boy is introduced to a neighbour as the household's foster-son, and is treated in every way as one of its own.", crisis: ['any'] },
    { text: () => 'Two neighbours clasp hands on a promise at the roadside, and both make sure someone sees them do it.', crisis: ['any'] },
    { text: () => "A covered dish is carried to a neighbour's door as a gift, and the neighbour is already looking for something to send back.", excludes: ['crisis: hunger'], crisis: ['any'] },
  ],
  arabic: [
    { text: () => 'A broker sits in the shade, matching buyers to goods from routes you have never travelled.', needs: ['market'], excludes: ['crisis: under_siege', 'route: isolated'] }, // BAR3-PLACES (H1, 2026-11-15): no broker of far goods where no market stands
      // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 02414): no goods come by road under a siege; TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): nor to a place no route reaches (3 of 13)
    { text: () => 'A broker sits in the shade, matching buyers to whatever the neighbours have to spare.', twinOf: 'A broker sits in the shade, matching buyers to goods from routes you have never travelled.', needs: ['route: isolated'], excludes: ['crisis: under_siege'] }, // TAIL-HISTORY-3 (Y14): its twin where no route reaches; a twin keeps the slot and spends no redraw (arrivalScene.js :: drawAdmitted), so no later beat moves (VETOABLE wording)
    { text: () => 'Travellers are offered water before anyone asks their business.', excludes: ['crisis: under_siege'] }, // W2-FIX-DATA: no traveller reaches a besieged gate (c12)
    () => 'Two partners go over their accounts in a courtyard with a mediator sitting between them.',
    { text: () => 'A merchant swears an oath on his scales, and the buyer watches the scales anyway.', needs: ['market'] }, // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind a): the same
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'Bread is set out at a doorway for whoever needs it, and the household that set it there does not wait to be thanked.', excludes: ['crisis: hunger'] },
    () => 'Neighbours gather in a courtyard to hear an older man talk two of them out of a disagreement.',
    () => "A buyer short of coin leaves with his goods anyway, on a neighbour's word that he is good for it.",
  ],
  norse: [
    { text: () => 'People argue law in the open as freely as they trade.', excludes: ['crisis: occupied', 'crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-5 (ww-473's sibling): no trade moves under a siege
    { text: () => 'Racks of drying fish and smoked meat stand beside the houses, laid in against the winter.', needs: ['navigable', 'fish'], excludes: ['crisis: hunger'], crisis: ['any'] }, // BAR6-SCENES (LAW 6 rule 6b; r2s-occupied-town-1): drying fish where the food record has a catch
    { text: () => 'Empty drying racks stand beside the houses, waiting for whatever can be laid in against the winter.', twinOf: 'Racks of drying fish and smoked meat stand beside the houses, laid in against the winter.', crisis: ['any'] }, // BAR6-SCENES (6b): its twin
    { text: () => 'A household leader hands out gifts in the open, and everyone watching keeps count.', crisis: ['any'] },
    { text: () => 'Neighbours work together to mend a roof, and nobody seems to be in charge of it.', crisis: ['any'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'A household counts its winter stores aloud at the door of its storehouse, and the neighbours listen to the count.', excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => 'An old man recites a point of law from memory, and nobody listening needs to ask where he learned it.', crisis: ['any'] },
    { text: () => 'A silver ring is cut in two to settle a bargain, and each side weighs his piece in his palm.', crisis: ['any'] },
  ],
  slavic: [
    { text: () => 'Smoke rises from a household oven, and a neighbour stops in to share its warmth.', crisis: ['any'] }, // BAR2-PLACES (PL1's class): no shared oven claimed, and no bread (true under a famine too, so no condition is added and no draw moves); was "Smoke rises from a shared oven, and neighbours queue to bake together."
    { text: () => 'People gather at the well, and the news of the whole place passes through it.', crisis: ['any'] },
    { text: () => 'Strings of dried mushrooms hang in the doorways beside barrels of pickled cabbage.', excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => 'A work party heads out together, singing, with tools on their shoulders.', excludes: ['crisis: under_siege'], crisis: ['any'] }, // BAR6-SCENES (LAW 7 rule 7d; REVIEW-WIDE-6 C94460): nobody heads out under a siege
    { text: () => 'A work party gathers with tools on their shoulders, to shore up whatever needs it.', twinOf: 'A work party heads out together, singing, with tools on their shoulders.', needs: ['crisis: under_siege'], crisis: ['any'] }, // BAR6-SCENES (7d): its twin under the siege // BAR7-SCENES (item 4, LOW; REVIEW-BAR-6 C19996): reworded from "… gathers inside the defences …" (a besieged hamlet with no wall, garrison or watch printed it): no defence is named
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'An elder of the household stands at the door and sends each of the younger ones off to their share of the day\'s work.', crisis: ['any'] },
    { text: () => 'Neighbours sit together on a bench, shredding cabbage into one tub to be salted down for the winter.', excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => "A cup of water stands on a windowsill for the household's dead, and nobody touches it.", crisis: ['any'] },
  ],
  east_asian: [
    { text: () => 'A clerk records every cartload that passes in a careful ledger.', excludes: ['crisis: under_siege', 'route: isolated'] }, // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 02470): no cartload passes under a siege; TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): nor where no route reaches (1 of 20)
    { text: () => 'A clerk records every sack and basket that comes in from the fields in a careful ledger.', twinOf: 'A clerk records every cartload that passes in a careful ledger.', needs: ['route: isolated'], excludes: ['crisis: under_siege'] }, // TAIL-HISTORY-3 (Y14): its twin where no route reaches; a twin keeps the slot and spends no redraw (arrivalScene.js :: drawAdmitted), so no later beat moves (VETOABLE wording)
    () => 'An elder settles a quarrel in a quiet voice before it can grow loud enough to need anyone else.',
    { text: () => 'Tea is poured for a merchant before the bargaining begins, and the bargaining waits for it.', needs: ['market'] }, // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind a): a merchant bargains where a market stands
    { text: () => 'Each lane seems to keep to its own trade, and each trade to its own lane.', needs: ['tier: ≥ town'] }, // W2-FIX-DATA-HISTORY item F (ww-541): lanes of trades are a town's (a hamlet of 31 has a handful of houses)
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    () => 'A boy recites his lessons on a doorstep while an older relative listens for mistakes.',
    () => 'The younger members of a household stand aside at a doorway to let the eldest through first.',
    () => "Inside an open door, tablets bearing the names of the household's dead stand on a shelf, with a small offering before them.",
  ],
  mesoamerican: [
    { text: () => 'Porters bent under loaded frames file past, and someone counts them in.', excludes: ['crisis: under_siege', 'route: isolated'] }, // BAR6-SCENES (LAW 7 rule 7d; REVIEW-WIDE-6 C150831): no laden file from the road where no route reaches
    { text: () => 'A neighbour comes in from the fields with a basket on one hip, and someone asks how the day went.', twinOf: 'Porters bent under loaded frames file past, and someone counts them in.', excludes: ['crisis: under_siege'] }, // BAR6-SCENES (7d): its twin where no route reaches // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 15806): nothing is carried in under a siege
    () => 'The neighbours turn out together to sweep and mend their own street.',
    () => 'Festival banners hang above the doors, faded from one year and waiting for the next.',
    { text: () => 'Craftspeople sit in rows, each row a different trade, each worker deep in their own work.', needs: ['market'] }, // W2-FIX-DATA-3 (REVIEW-W2A-3 #2): rows to each trade are a market's (a thorp of twelve printed it)
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'The scrape of a grinding stone comes from a doorway, where someone is making the day\'s maize dough.', excludes: ['crisis: hunger'] },
    () => 'A household sets a small offering of flowers at its threshold and lights a pinch of resin beside it.',
    () => "Neighbours are counted off by name for their turn of work on the common ground, and nobody's name is skipped.",
  ],
  south_asian: [
    { text: () => 'A moneylender sits at a low table with a queue of familiar faces waiting.', needs: ['tier: ≥ village'] }, // TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): a lender with a queue, where the place is large enough for one (12 of 23 towns were a thorp or a hamlet)
    { text: () => 'An old woman sits at a low table by her door, and the neighbours stop to settle what they owe her.', twinOf: 'A moneylender sits at a low table with a queue of familiar faces waiting.', needs: ['tier: ≤ hamlet'] }, // TAIL-HISTORY-3 (Y14): its twin in a thorp or a hamlet; a twin keeps the slot and spends no redraw (arrivalScene.js :: drawAdmitted) (VETOABLE wording)
    () => 'People draw water in an order nobody needs to explain.',
    { text: () => 'Food is being handed out to anyone who asks, and the line is patient.', excludes: ['crisis: hunger'] }, // TAIL-HISTORY batch 1 (the chair's Y4; READ-ALL 09279 HIGH): no food offered where the food failed
    { text: () => 'Each lane of stalls has someone who speaks for it, and they are all speaking at once.', needs: ['market', 'tier: ≥ town'], excludes: ['crisis: under_siege'] }, // BAR3-PLACES (H1, 2026-11-15): lanes of stalls are a town's, and no trade speaks under a siege
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    () => 'A doorstep has been washed and marked with a pattern in white powder, and people step around it.',
    () => 'Three generations of one family sit at the same work in one doorway, the youngest watching the oldest.',
    () => 'Two neighbours disagree over whose turn it is at the water, and a third reminds them both of the order.',
  ],
  steppe: [
    { text: () => 'Herders show their animals at the edge of the settlement, where herders and townsfolk meet.', excludes: ['crisis: under_siege'], crisis: ['any'] }, // TAIL-HISTORY-3 (the chair's Y14, the arrival pool's measure): no horse trade where no horse is kept (13 of 21 towns)
    { text: () => 'Felt tents stand beside the houses, and their owners seem at home in either.', crisis: ['any'] },
    { text: () => 'A caravan broker shouts terms to a line of laden animals and the people leading them.', needs: ['market'], excludes: ['crisis: under_siege', 'route: isolated'], crisis: ['any'] }, // TAIL-HISTORY-5 (the chair's Y17 (3), 2026-11-15; the bar's readers at 5d1e3096b): a broker shouts terms where a market stands and a road is open (6 of 16 towns had no market)
    { text: () => 'A pair of pack animals stands in a yard, unladen, while their keeper mends a strap.', twinOf: 'A caravan broker shouts terms to a line of laden animals and the people leading them.', crisis: ['any'] }, // TAIL-HISTORY-5 (Y17): its twin where the broker is refused; it claims no trade, so it is true in every state the original refuses
    { text: () => 'Guests are greeted with a cup before a word of business is spoken.', crisis: ['any'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'A rider comes in from the open country with news, and a knot of people gathers before he has dismounted.', excludes: ['crisis: under_siege'], crisis: ['any'] },
    { text: () => 'A family loads its belongings for the season\'s move, and the neighbours who are staying help tie the load.', excludes: ['crisis: under_siege'], crisis: ['any'] },
    { text: () => 'An old woman flicks a few drops from her cup toward the sky before she drinks.', excludes: ['crisis: hunger'], crisis: ['any'] },
  ],
  greek: [
    { text: () => 'Two citizens argue a point of law loudly enough for the neighbours to stop and listen.', excludes: ['crisis: occupied'], crisis: ['any'] }, // BAR2-PLACES (PL1): no crowd (a hamlet of twenty-nine printed it)
    { text: () => 'A notice of the next assembly is chalked on a wall, and someone has corrected the spelling.', excludes: ['crisis: occupied'], crisis: ['any'] },
    { text: () => 'A money changer sits at his table with coins from many mints.', needs: ['institution: bank'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // COHERENCE-PRESUME: it printed in towns with no money changer; TAIL-HISTORY-5 (Y17 (3)): no exchange as usual under a siege
    { text: () => 'A money changer sits at his table with little to do, counting the same coins from many mints again.', twinOf: 'A money changer sits at his table with coins from many mints.', needs: ['institution: bank', 'crisis: under_siege'], crisis: ['any'] }, // TAIL-HISTORY-5 (Y17): its twin under a siege
    { text: () => 'A patron stands drinks for the whole room, and makes sure everyone knows who is paying.', // BAR3-PLACES (H1, 2026-11-15): no wine shop named (the houses hold taverns and inns)
       needs: ['institution: tavern', 'tier: ≥ village'], crisis: ['any'] }, // W2-FIX-DATA-12 (REVIEW-R2-CODE-A, the chair's 10:57): a wine shop stands on the roster, and a thorp or hamlet has none to stand drinks in
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'A young man practises a speech under his breath as he walks, stopping now and then to try a line again.', crisis: ['any'] },
    { text: () => 'Members of some association walk together, each wearing the same small badge, and greet one another by it.', crisis: ['any'] },
    { text: () => 'A list of who paid for the last festival is painted on a wall, the largest givers first.', crisis: ['any'] },
  ],
  mixed: [
    { text: () => 'You hear three languages in as many steps, and nobody seems to find it strange.', crisis: ['any'] },
    { text: () => 'People here greet newcomers with open curiosity, and ask where you have come from before your name.', excludes: ['crisis: threat', 'crisis: plague_onset', 'crisis: recently_betrayed', 'crisis: infiltrated'], crisis: ['any'] },
    { text: () => 'A cook at a doorway mixes the spices of two different homelands into one pot.', crisis: ['any'] },
    { text: () => 'Neighbours bargain in a trade tongue that belongs to no one and works for everyone.', crisis: ['any'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; the custom each shows, in its profile's words, is cited in L2-LINES.md
    { text: () => 'Two doorways side by side hang the charms of two different traditions, and both households seem content with the arrangement.', crisis: ['any'] },
    { text: () => 'A girl answers her mother in one tongue and her grandmother in another without missing a step.', crisis: ['any'] },
    { text: () => 'Houses along the lane are built in two different manners, and a few have borrowed a little of each.', crisis: ['any'] },
  ],
});

/**
 * TENSION: one visible sign of what the dossier says is wrong, or right, with the place today. Keyed on facts the
 * dossier PRINTS (the safety label, the prosperity rung), never on a covert one (floor 4): the criminal hold on
 * the government is drawn only where the safety label itself names criminal governance. Present tense only.
 * @type {Readonly<Record<string, ReadonlyArray<ArrivalLine>>>}
 */
export const ARRIVAL_TENSIONS = Object.freeze({
  criminal_governance: [
    () => 'A shopkeeper hands a fat purse to a man who is plainly not a tax collector, and does not argue.',
    () => 'Certain doorways have someone standing in them who does not seem to be waiting for anyone.',
    () => 'People step aside for a well-dressed group in the street, and nobody meets their eyes.',
    () => 'A posted notice of new duties carries a seal nobody here seems willing to name.',
  ],
  controlled: [
    () => 'Armed men stand where the lanes meet, and conversations stop when they pass.',
    () => 'A proclamation is read aloud to a silent crowd, and nobody moves until it is finished.',
    () => 'People here keep their eyes down and their voices lower.',
    () => 'Papers are checked at the edge of the settlement, and checked again further in.',
  ],
  unsafe: [
    () => 'Doors are barred early here, and nobody lingers outside after dark.',
    () => 'People keep their purses close and watch anyone they do not know.',
    () => 'Every shutter has a stout bar, and every bar looks used.',
    () => 'People walk quickly and do not stop to talk to anyone they do not know.',
  ],
  poor: [
    () => 'Patched roofs and patched clothes say money is short here.',
    () => 'People mend what they have, and nobody seems to buy anything new.',
    () => 'Children in outgrown clothes run errands for a copper.',
    () => 'The goods on offer are mostly second-hand, and even those go slowly.',
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; money short, shown in what is mended and spent, as its siblings show it
    () => 'Roofs sag in places, and the repairs that have been made were made with whatever came to hand.',
    () => 'Shoes here are worn until they are mostly mending.',
    () => 'Doors and shutters here have been mended more often than they have been painted.',
    () => 'People count their coins carefully before parting with any of them.',
  ],
  prosperous: [
    { text: () => 'Fresh paint and well-kept roofs say the place is doing well.', excludes: ['starving', 'crisis: hunger'], crisis: ['any'] },
    { text: () => 'Well-fed children run errands from door to door.', excludes: ['starving', 'crisis: hunger'], crisis: ['any'] }, // BAR2-PLACES (PL1): no busy street (a thorp of twenty-one printed it)
    { text: () => 'Even the outbuildings have new roofs, and nobody looks hungry.', needs: ['food: ≥ secure'], excludes: ['starving', 'crisis: hunger'], crisis: ['any'] }, // BAR8-SCENES (item 7, I's 9g.food-soft, 2026-11-17): "nobody looks hungry" wants the food band the page prints secure or better (r2r-city-54, r2r-city-58, r2r-metropolis-19 of the 720)
    { text: () => 'A merchant shows off a new cloak, and several neighbours make a point of noticing.', crisis: ['any'] },
    // L2 (PAGE-2's lines, 2026-11-20): APPENDED; money to spare, shown in houses and dress, and no word of food (the one
    // that would speak of it does not), so none needs its siblings' hunger exclusions
    { text: () => 'Doorsteps are swept, shutters are painted, and the brass on more than one door has been polished.', crisis: ['any'] },
    { text: () => 'Here and there a house has been added to lately, the new timber still pale beside the old.', crisis: ['any'] },
    { text: () => 'People here dress a little better than the work in front of them requires.', crisis: ['any'] },
    { text: () => 'A new cart stands in a yard with its paint barely dry, and its owner keeps finding reasons to walk past it.', crisis: ['any'] },
    { text: () => 'Window boxes of flowers hang below more than one sill.', crisis: ['any'] },
  ],
});

/**
 * MEMORY: the visible trace of the most recent major event the settlement's history recorded, when that event is
 * within living memory. Keyed on the event's `templateType` (src/data/historyData.js HISTORICAL_EVENTS_DATA), so
 * the line points at a past the dossier's History tab already tells, and never invents one (floor 2). A template
 * with no visible trace has no pool and speaks no memory. `wild_magic` is drawn only where the world's magic is
 * real, like the arcane sense.
 * @type {Readonly<Record<string, ReadonlyArray<ArrivalLine>>>}
 */
export const ARRIVAL_MEMORIES = Object.freeze({
  great_fire: [
    () => 'Newer timber stands out among the old where the fire went through.',
    () => 'An old woman points out where the fire stopped, as if she still cannot quite believe it.',
    () => 'A blackened beam has been left standing among the rebuilt houses, on purpose.',
  ],
  great_flood: [
    () => 'A tidemark from the flood still stains the lower walls of the oldest houses.',
    () => 'The newer houses stand on raised footings, and the older folk explain why without being asked.',
    { text: () => 'A carved post by the water marks how high the flood came, and children dare each other to touch the line.', needs: ['navigable'] },
  ],
  plague_years: [
    { text: (n) => `A plain stone outside ${n} marks where the plague dead were buried, and people walk around it.`, crisis: ['any'] },
    { text: () => 'Some houses still carry the faded marks of the sickness on their doors, painted over but not quite gone.', crisis: ['any'] },
    { text: () => 'People here wash their hands at every well, a habit nobody has bothered to lose.', excludes: ['crisis: plague_onset'], crisis: ['any'] },
  ],
  popular_uprising: [
    () => 'A few houses still fly the old colours of the rising, and nobody takes them down.',
    () => 'People who fought in the rising are pointed out to you with a mix of pride and caution.',
    () => 'A song about the rising is being sung in a doorway, and half the lane knows the words.',
  ],
  religious_tension: [
    () => 'Two congregations keep to their own sides of the lane on holy days, and both pretend not to notice the other.',
    () => 'Symbols of two different observances are painted on neighbouring doors, each a little larger than the last.',
    { text: () => 'A shrine has been scrubbed clean of one faith\'s marks and painted with another\'s.', needs: ['institution: temple'] },
  ],
  heresy_trial: [
    () => 'People are careful about what they say about faith in public.',
    () => 'A family\'s house stands empty and shuttered, and nobody will say why.',
    () => 'A preacher speaks carefully, glancing at the crowd between sentences.',
  ],
  pilgrimage_surge: [
    // BAR5-THINGS (LAW 5: the static inventory's `outside`): pilgrims passing now are a siege's to deny; the badges and the
    // worn road are years past, true in any crisis, and say so
    { text: () => 'Pilgrims still pass through on the old route, and the stalls along the road still sell to them.', needs: ['market'], excludes: ['crisis: under_siege'], crisis: ['any'] },
    { text: () => 'Pilgrim badges are nailed above doorways, collected over years.', crisis: ['any'] },
    { text: () => 'The road in is worn smooth by pilgrim feet.', crisis: ['any'] },
  ],
  external_threat: [
    { text: () => 'The older folk still keep a weapon by the door, out of habit.', excludes: ['crisis: threat'], crisis: ['any'] },
    { text: () => 'Watch fires are still laid ready on the high ground, though nobody has lit one in years.', excludes: ['crisis: threat'], crisis: ['any'] },
    { text: () => 'People look up at the sound of hooves on the road, and only relax when they see who it is.', crisis: ['any'] },
  ],
  occupation_legacy: [
    { text: () => "A few old signs still carry the occupiers' words, painted over but showing through.", excludes: ['crisis: occupied'], crisis: ['any'] },
    { text: () => 'Older folk still flinch at the sound of marching feet.', crisis: ['any'] },
    { text: () => 'People here still say "since they left" the way other places say "last year".', excludes: ['crisis: occupied'], crisis: ['any'] },
  ],
  tyranny: [
    () => 'People still lower their voices near the old seat of power, though the one they feared is gone.',
    () => 'A defaced statue stands on its plinth, its face chiselled smooth.',
    () => 'Older folk stop talking when you ask about the bad years, and change the subject.',
  ],
  market_crash: [
    () => 'Merchants here count their coin twice and trust a handshake less, a habit from the bad years.',
    () => 'Debts from the crash are still remembered, and a few families still do not speak because of them.',
  ],
  trade_collapse: [
    () => 'Old traders still talk about the routes that closed, naming each one like a lost relative.',
    { text: () => 'People here still talk about the years when the caravans stopped coming.', crisis: ['any'] }, // BAR5-THINGS (LAW 5): a memory of years past, true in any crisis
  ],
  crime_wave: [
    () => 'Every door has a newer, heavier lock than the frame it sits in.',
    () => 'The older folk still keep their valuables hidden, a habit from the bad years.',
  ],
  wild_magic: [
    () => 'A patch of ground near the centre still grows wrong, and nobody builds on it.',
    () => 'Some of the older stones shimmer faintly in certain light, and people step around them.',
    () => 'A tree twisted into an impossible shape stands where the magic broke loose, fenced and left alone.',
  ],
});
