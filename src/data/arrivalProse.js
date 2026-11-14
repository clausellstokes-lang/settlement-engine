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
 *   excludes?: ReadonlyArray<string>, crisis?: ReadonlyArray<string>, colour?: boolean }} ArrivalLine
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
      (n) => `The ring of hammer on anvil carries over the roofs of ${n}.`,
      () => 'You hear the forge work before you see it: hammer on iron, steady as a heartbeat.',
      () => 'A drift of forge smoke hangs over the roofs, and somewhere under it a hammer keeps time.',
      () => 'A smith quenches a blade in a hiss of steam, and the sound follows you down the lane.',
    ],
    dominant: [ // W2-FIX-DATA-3 (REVIEW-W2A-3 #366): these four lines speak of many forges; a village or smaller has one (a hamlet's part-time smith, a village's blacksmith), so they declare tier: ≥ town. A one-forge place then draws none and its sense beat is left out (the redraw finds no clean line and draws nothing more); a line of its own would lengthen the pool and re-deal the arrival in every town that draws it (measured: 44 of 720)
      { text: (n) => `The hammering of the forges echoes through all of ${n}.`, needs: ['institution: smith', 'tier: ≥ town'] }, // W2-FIX-DATA-12 item 3: no claim the place lives by them (false in 16 of 16: metalwork 3 to 12% of the income, never first)
      { text: () => 'Forge smoke hangs over everything here, and the ring of the anvils never quite stops.', needs: ['institution: smith', 'tier: ≥ town'] }, // W2-FIX-DATA-12 item 3: the anvils stand on the roster (a town with only a Smelter printed it)
      { text: () => 'Racks of new ironwork stand outside the workshops, waiting for the carts.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['crisis: under_siege'] }, // W2-FIX-DATA: the carts a siege stops (c22)
      { text: (n) => `The clang of iron from the smithies carries down the lanes of ${n}.`, needs: ['institution: smith', 'tier: ≥ town'] }, // W2-FIX-DATA-12 item 3 (the reader's A04): no claim the place lives by them, and a smith stands
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
      { text: (n) => `The hammering echoes throughout ${n}, and most of it is the sound of blades being made.`, needs: ['institution: smith', 'tier: ≥ town'], crisis: ['any'] },
      { text: () => 'Racks of spearheads and helms stand outside the workshops, waiting for the carts.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-12 item 5 (the reader's A06): the twin carries its siblings' siege exclusion: no cart reaches a besieged town
      { text: () => 'Every forge you pass is making something meant for a war, and the carts on the road out are full of it.', needs: ['institution: smith', 'tier: ≥ town'], excludes: ['crisis: under_siege'], crisis: ['wartime', 'insurgency'] }, // W2-FIX-DATA-5 (ww-1157): a war the record holds
      { text: () => 'A smith tests a new blade against a post, frowns, and sends it back to the fire.', needs: ['institution: smith'], crisis: ['any'] },
    ] },
  { key: 'bread',
    institutions: ['bakery', 'baker', 'bakehouse', 'mill', 'mills'],
    trade: ['baked goods', 'milled flour', 'flour', 'bread', 'grain surplus'],
    lines: [
      { text: () => 'The smell of fresh bread meets you on the road in.', colour: true }, // R-AO (CENSUS-2f): read; presumes nothing
      { text: () => 'Someone has been baking since before dawn, and the air still carries it.', colour: true },
      { text: () => 'A mill wheel turns somewhere close, and flour dust drifts on the breeze.', needs: ['institution: mill'] },
      { text: () => 'The warm smell of an oven reaches you before the first doorway does.', colour: true },
    ],
    dominant: [
      { text: (n) => `The smell of bread hits you as you walk into ${n}, and it never really leaves.`, excludes: ['crisis: hunger'], crisis: ['any'] },
      { text: () => 'Carts of grain rattle toward the mills while the ovens send the smell of bread down every lane.', needs: ['institution: mill'], excludes: ['crisis: hunger'], crisis: ['any'] },
      { text: () => 'Flour dust lies pale on the doorsteps, and the whole place smells of the ovens.', excludes: ['crisis: hunger'], crisis: ['any'] },
      { text: () => 'Sacks of flour are stacked shoulder high by the roadside, waiting to be carted out.', excludes: ['crisis: hunger'], crisis: ['any'] },
    ] },
  { key: 'tanners',
    institutions: ['tanner', 'tannery', 'tanners', 'leatherwork', 'saddler', 'furrier'],
    trade: ['leather', 'hide', 'pelt', 'fur'],
    lines: [
      () => 'Downwind of the tanning pits the air turns sharp and sour.',
      () => 'The tannery makes itself known long before you reach it.',
      () => 'Hides hang drying on frames, and the smell comes with them.',
      () => 'A sour reek drifts over the rooftops from the tanning yard.',
    ],
    dominant: [
      { text: (n) => `The reek of the tanning pits hangs over ${n}, and the locals have long since stopped noticing it.`, crisis: ['any'] },
      { text: () => 'Bales of hides and bundled pelts crowd the carts on the road out.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: () => 'Frames of drying leather line the lanes, and the sour smell of the pits follows you everywhere.', crisis: ['any'] },
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
      { text: () => 'Barrels are stacked by every doorway, and the carts on the road out are loaded with more.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: () => 'The steam of the mash tuns drifts across the roofs, sweet and heavy.', crisis: ['any'] },
    ] },
  { key: 'fish',
    institutions: ['fish market', 'fishmonger', 'fishing', 'fisher', 'fishers'],
    trade: ['fish'],
    lines: [
      // CENSUS-2f, R-AP: the picker reaches `fish` by a fish market's or a fishmonger's NAME, which guarantees no
      // catch (soak1k-152), so every line here declares `fish` (the food record's source) and a refused beat redraws.
      { text: () => "Gulls quarrel over the fish stalls, and the air smells of the morning's catch.", needs: ['market', 'navigable', 'fish'] },
      { text: () => 'A fishmonger shouts a price over the slap of wet baskets.', needs: ['fish', 'market'] }, // W2-FIX-DATA: a price is shouted at a market (c05)
      { text: () => 'Nets hang drying on poles, and the smell of the catch follows you.', needs: ['fish'] },
      { text: () => 'A basket of fish, still flapping, is carried past at a run.', needs: ['fish'] },
    ],
    dominant: [
      // CENSUS-2f, R-AP amended: the dominant pool is picked by the exports' fish trade, which guarantees the trade and no
      // catch; the racks of catch and the gutting declare `fish`, the gulls' water `navigable`, both where both.
      { text: () => 'Racks of drying fish line the way in, and the smell of salt and catch is everywhere.', needs: ['navigable', 'fish'] },
      { text: (n) => `Half of ${n} seems to be gutting, salting or selling fish.`, needs: ['fish'] },
      { text: () => 'Barrels of salt fish stand stacked for the carts, and the gulls have opinions about every one.', needs: ['navigable'] },
    ] },
  { key: 'cloth',
    institutions: ['weaver', 'weavers', 'textile', 'fuller', 'dyer', 'tailor', 'clothier', 'draper'],
    trade: ['wool', 'cloth', 'textile', 'linen', 'silk', 'dye'],
    lines: [
      () => 'A loom clatters behind an open shutter.',
      () => 'Lengths of dyed cloth hang drying in bright strips between the houses.',
      () => 'The thump of the fulling stocks carries from the cloth yard.',
      () => 'A dyer walks past with hands stained to the wrist.',
    ],
    dominant: [
      { text: (n) => `The clatter of looms follows you through ${n}, from one shutter to the next.`, crisis: ['any'] },
      { text: () => 'Bolts of cloth and bales of wool fill the carts waiting on the road out.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: () => 'Bolts of cloth hang drying in long bright strips across every yard.', crisis: ['any'] },
    ] },
  { key: 'livestock',
    institutions: ['livestock', 'cattle', 'stockyard', 'shambles', 'slaughter', 'shepherd', 'drover', 'dairy farmer', 'common grazing', 'herd'],
    trade: ['livestock', 'cattle', 'sheep', 'raw wool', 'dairy', 'cheese', 'mutton', 'beef'],
    lines: [
      { text: () => 'Sheep call to one another from the grazing beyond the houses.', excludes: ['crisis: under_siege', 'crisis: monster_pressure'], crisis: ['any'] },
      { text: () => 'A dog drives a handful of animals across the road, and you wait for them.', crisis: ['any'] },
      { text: () => 'The smell of the byres reaches you on the breeze.', crisis: ['any'] },
      { text: () => 'Someone is churning butter in a doorway, and the rhythm of it carries.', crisis: ['any'] },
    ],
    dominant: [
      { text: () => 'Drovers push their herds along the road, and the whole place smells of the pens.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: (n) => `The lowing of penned cattle carries across ${n} at every hour.`, crisis: ['any'] },
      { text: () => 'Hurdles and holding pens crowd the edge of the settlement, full and noisy.', excludes: ['crisis: hunger'], crisis: ['any'] },
    ] },
  { key: 'faith',
    institutions: ['cathedral', 'temple', 'church', 'churches', 'chapel', 'monastery', 'abbey', 'shrine', 'priory', 'friary', 'priest'],
    trade: ['pilgrim', 'relic', 'religious tourism'],
    lines: [
      // CENSUS-2f, R-AP: the key is reachable by a `priest` or `chapel` name with no sacred house on the roster, so the
      // bell, the incense and the hymn declare `sacredHouse`; the wayside shrine set into a wall presumes nothing.
      { text: () => 'A bell marks the hour, and a few heads bow as it rings.', needs: ['sacredHouse'] },
      { text: () => 'The smell of incense drifts out into the press of the lane.', needs: ['sacredHouse'] },
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
      () => 'A fine grey dust from the workings settles on every doorstep.',
      () => 'Carts of rock grind past, their axles complaining.',
      () => 'The chink of chisels on stone carries on the wind.',
      () => 'Workers coming off a shift are grey with dust to the eyebrows.',
    ],
    dominant: [
      { text: (n) => `${n} lives on what comes out of the ground, and the dust of it is on everything.`, crisis: ['any'] },
      { text: () => 'Ore carts and stone carts grind along the road in a line that never seems to end.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: () => 'Spoil heaps rise beyond the houses, and the sound of the workings never quite stops.', crisis: ['any'] },
    ] },
  { key: 'timber',
    institutions: ['carpenter', 'carpenters', 'sawmill', 'woodcutter', 'lumber', 'joiner', 'cooper', 'shipwright', 'wheelwright', 'woodcarver'],
    trade: ['timber', 'plank', 'lumber', 'sawn'],
    lines: [
      () => 'The rasp of a saw and the smell of fresh-cut wood come from a workshop yard.',
      () => 'Sawn planks stand stacked to season against a wall.',
      () => 'Curls of shavings blow across the lane from a carpenter\'s bench.',
      () => 'The knock of a mallet on wood keeps time somewhere close.',
    ],
    dominant: [
      (n) => `The smell of sawn timber is everywhere in ${n}, and so is the sawdust.`,
      { text: () => 'Stacks of seasoning planks line the road in, taller than the carts that wait for them.', excludes: ['crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind b): no cart waits on a road the siege has cut
      () => 'The rasp of the saws carries from yard to yard all through the day.',
    ] },
  { key: 'kilns',
    institutions: ['potter', 'pottery', 'kiln', 'brickmaker', 'charcoal', 'glassblower', 'glassmaker', 'glassmakers', 'lime'],
    trade: ['pottery', 'brick', 'charcoal', 'glass', 'ceramic'],
    lines: [
      () => 'A thread of kiln smoke rises over the roofs, and the air tastes faintly of ash.',
      () => 'Fresh pots stand drying in a row outside a workshop.',
      () => 'Charcoal smoke lingers in the lane, thick and sweetish.',
      () => 'The heat of a working kiln reaches you from across the lane.',
    ],
    dominant: [
      { text: (n) => `Kiln smoke hangs over ${n}, and the dust of fired clay is on everything.`, crisis: ['any'] },
      { text: () => 'Crates of pots and glassware, packed in straw, wait for the carts on the road out.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: () => 'The kilns are lit all through the day, and the heat of them is in every lane.', crisis: ['any'] },
    ] },
  { key: 'horses',
    institutions: ['coaching inn', 'stable', 'stables', 'livery', 'carriers', 'post relay', 'horse', 'beast trainers', 'caravaneer'],
    trade: ['horse', 'haulage', 'carting', 'caravan'],
    lines: [
      () => 'The smell of horses and hay comes from the stables.',
      () => 'A team stands in harness, stamping, while the carters argue over the load.',
      () => 'An ostler leads a tired horse past you toward the trough.',
      () => 'Harness jingles somewhere behind you as a cart pulls out.',
    ],
    dominant: [
      { text: () => 'Hooves and wheels fill the road, and the yards are crowded with teams changing over.', excludes: ['crisis: under_siege'], crisis: ['any'] },
      { text: (n) => `${n} is loud with horses: shod, sold, hired and fed at every hour.`, crisis: ['any'] },
      { text: () => 'Fresh horses stand saddled and waiting while the tired ones are led away.', crisis: ['any'] },
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
      { text: () => 'Spice and drying herbs scent every lane, and the stalls are piled with them.', needs: ['market'] },
      { text: () => 'Sacks of herbs and spices fill the carts, and the smell of them clings to your clothes.', colour: true }, // R-AO (CENSUS-2f)
      { text: () => 'Every other doorway seems to sell a remedy for something.', colour: true },
    ] },
  { key: 'arcane', arcane: true,
    institutions: ['mage', 'mages', 'wizard', 'arcane', 'alchemist', 'alchemy', 'enchanter', 'enchanting', 'sorcer', 'magelight', 'spellcast'],
    trade: ['enchant', 'arcane', 'potion', 'spellcasting', 'magical'],
    lines: [
      () => 'A faint glow lingers in an upper window, even at midday.',
      () => "The air near an alchemist's door smells of sulphur and something sweeter.",
      () => 'A vendor sells charms from a tray, and nobody laughs at the buyers.',
      () => 'A lamp that burns without oil lights a doorway off the lane.',
    ],
    dominant: [
      (n) => `Magic is a trade in ${n} like any other: signs offer enchanting and identification by the hour.`,
      () => 'The air prickles faintly, the way it does where a great deal of spellwork is done.',
      () => 'Stalls sell reagents in stoppered jars, and the buyers know exactly what they want.',
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
    () => 'An apprentice hurries past on an errand, a master\'s mark stitched on his sleeve.',
    () => 'Two neighbours argue over a boundary stone, each quoting what their grandfathers agreed.',
    () => 'A craftsman shows off a finished piece in his doorway, and passers-by judge it out loud.',
    { text: () => 'A notice of the next fair is nailed up beside a doorway, and someone is reading it aloud for the others.', needs: ['market'] },
  ],
  latin: [
    { text: () => 'A patron moves through the crowd with clients at their heels, greeting people by name.', needs: ['tier: ≥ town'], crisis: ['any'] }, // W2-FIX-DATA: a crowd and a patron's clients (c09 at 33)
    { text: () => "A notary's clerk hurries past with a satchel of contracts.", needs: ['tier: ≥ town'], crisis: ['any'] }, // W2-FIX-DATA: a notary's trade (c03 at 9)
    { text: () => 'People argue politics in the open, loudly, and seem to enjoy it.', excludes: ['crisis: occupied', 'crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-5 (ww-473): not with the enemy at the walls
    { text: () => 'A benefactor\'s name is carved fresh above a mended well, and people make sure you notice it.', crisis: ['any'] },
  ],
  celtic: [
    { text: () => 'A poet holds a small crowd by the well, and nobody hurries the telling along.', crisis: ['any'] },
    { text: () => 'A household feeds passing travellers at its door, and makes sure everyone sees it doing so.', excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => 'Greetings are called across the lane, and every greeting comes with a question about family.', crisis: ['any'] },
    { text: () => 'An old judge listens to two neighbours by a gate and says nothing until both are finished.', crisis: ['any'] },
  ],
  arabic: [
    () => 'A broker sits in the shade, matching buyers to goods from routes you have never travelled.',
    { text: () => 'Travellers are offered water before anyone asks their business.', excludes: ['crisis: under_siege'] }, // W2-FIX-DATA: no traveller reaches a besieged gate (c12)
    () => 'Two partners go over their accounts in a courtyard with a mediator sitting between them.',
    { text: () => 'A merchant swears an oath on his scales, and the buyer watches the scales anyway.', needs: ['market'] }, // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind a): the same
  ],
  norse: [
    { text: () => 'People argue law in the open as freely as they trade.', excludes: ['crisis: occupied', 'crisis: under_siege'], crisis: ['any'] }, // W2-FIX-DATA-5 (ww-473's sibling): no trade moves under a siege
    { text: () => 'Racks of drying fish and smoked meat stand beside the houses, laid in against the winter.', needs: ['navigable'], excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => 'A household leader hands out gifts in the open, and everyone watching keeps count.', crisis: ['any'] },
    { text: () => 'Neighbours work together to mend a roof, and nobody seems to be in charge of it.', crisis: ['any'] },
  ],
  slavic: [
    { text: () => 'Smoke rises from a shared oven, and neighbours queue to bake together.', crisis: ['any'] },
    { text: () => 'People gather at the well, and the news of the whole place passes through it.', crisis: ['any'] },
    { text: () => 'Strings of dried mushrooms hang in the doorways beside barrels of pickled cabbage.', excludes: ['crisis: hunger'], crisis: ['any'] },
    { text: () => 'A work party heads out together, singing, with tools on their shoulders.', crisis: ['any'] },
  ],
  east_asian: [
    () => 'A clerk records every cartload that passes in a careful ledger.',
    () => 'An elder settles a quarrel in a quiet voice before it can grow loud enough to need anyone else.',
    { text: () => 'Tea is poured for a merchant before the bargaining begins, and the bargaining waits for it.', needs: ['market'] }, // W2-FIX-DATA-HISTORY item F (CENSUS-2 kind a): a merchant bargains where a market stands
    { text: () => 'Each lane seems to keep to its own trade, and each trade to its own lane.', needs: ['tier: ≥ town'] }, // W2-FIX-DATA-HISTORY item F (ww-541): lanes of trades are a town's (a hamlet of 31 has a handful of houses)
  ],
  mesoamerican: [
    () => 'Porters bent under loaded frames file past, and someone counts them in.',
    () => 'The neighbours turn out together to sweep and mend their own street.',
    () => 'Festival banners hang above the doors, faded from one year and waiting for the next.',
    { text: () => 'Craftspeople sit in rows, each row a different trade, each worker deep in their own work.', needs: ['market'] }, // W2-FIX-DATA-3 (REVIEW-W2A-3 #2): rows to each trade are a market's (a thorp of twelve printed it)
  ],
  south_asian: [
    () => 'A moneylender sits at a low table with a queue of familiar faces waiting.',
    () => 'People draw water in an order nobody needs to explain.',
    () => 'Food is being handed out to anyone who asks, and the line is patient.',
    { text: () => 'Each lane of stalls has someone who speaks for it, and they are all speaking at once.', needs: ['market'] },
  ],
  steppe: [
    { text: () => 'Horse traders show their animals at the edge of the settlement, where herders and townsfolk meet.', excludes: ['crisis: under_siege'], crisis: ['any'] },
    { text: () => 'Felt tents stand beside the houses, and their owners seem at home in either.', crisis: ['any'] },
    { text: () => 'A caravan broker shouts terms to a line of laden animals and the people leading them.', crisis: ['any'] },
    { text: () => 'Guests are greeted with a cup before a word of business is spoken.', crisis: ['any'] },
  ],
  greek: [
    { text: () => 'Two citizens argue a point of law loudly enough for a crowd to gather.', excludes: ['crisis: occupied'], crisis: ['any'] },
    { text: () => 'A notice of the next assembly is chalked on a wall, and someone has corrected the spelling.', excludes: ['crisis: occupied'], crisis: ['any'] },
    { text: () => 'A money changer sits at his table with coins from many mints.', needs: ['institution: bank'], crisis: ['any'] }, // COHERENCE-PRESUME: it printed in towns with no money changer
    { text: () => 'A patron stands drinks at a wine shop, and makes sure everyone knows who is paying.', needs: ['institution: tavern', 'tier: ≥ village'], crisis: ['any'] }, // W2-FIX-DATA-12 (REVIEW-R2-CODE-A, the chair's 10:57): a wine shop stands on the roster, and a thorp or hamlet has none to stand drinks in
  ],
  mixed: [
    { text: () => 'You hear three languages in as many steps, and nobody seems to find it strange.', crisis: ['any'] },
    { text: () => 'People here greet newcomers with open curiosity, and ask where you have come from before your name.', excludes: ['crisis: threat', 'crisis: plague_onset', 'crisis: recently_betrayed', 'crisis: infiltrated'], crisis: ['any'] },
    { text: () => 'A cook at a doorway mixes the spices of two different homelands into one pot.', crisis: ['any'] },
    { text: () => 'Neighbours bargain in a trade tongue that belongs to no one and works for everyone.', crisis: ['any'] },
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
  ],
  prosperous: [
    { text: () => 'Fresh paint and well-kept roofs say the place is doing well.', excludes: ['starving', 'crisis: hunger'], crisis: ['any'] },
    { text: () => 'Well-fed children run errands through a busy street.', excludes: ['starving', 'crisis: hunger'], crisis: ['any'] },
    { text: () => 'Even the outbuildings have new roofs, and nobody looks hungry.', excludes: ['starving', 'crisis: hunger'], crisis: ['any'] },
    { text: () => 'A merchant shows off a new cloak, and several neighbours make a point of noticing.', crisis: ['any'] },
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
    { text: () => 'Pilgrims still pass through on the old route, and the stalls along the road still sell to them.', needs: ['market'] },
    () => 'Pilgrim badges are nailed above doorways, collected over years.',
    () => 'The road in is worn smooth by pilgrim feet.',
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
    () => 'People here still talk about the years when the caravans stopped coming.',
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
