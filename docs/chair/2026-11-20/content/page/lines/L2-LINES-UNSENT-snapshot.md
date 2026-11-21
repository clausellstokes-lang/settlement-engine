# L2: every new line of the arrival paragraph, by pool (PAGE-2's builder, 2026-11-20)

The brief: `docs/chair/2026-11-20/content/page/briefs/L2.md`, under `BUILDER-RULES.md`. The code: `src/data/narrativeData.js`
(`ARRIVAL_SCENES`) and `src/data/arrivalProse.js` (`ARRIVAL_SENSES`, `ARRIVAL_PEOPLE`, `ARRIVAL_TENSIONS`); the test:
`tests/data/arrivalPoolsDeepened.test.js`. Every line below is APPENDED to its pool: no existing line is moved,
reworded or removed, so every existing line keeps its index. Below each pool, the base lines stand first (as they
are, for reading beside), then the NEW ones in bold, each with its declaration and the reason it is true where it
is drawn. For a PEOPLE line, the custom it shows and the culture profile's own words it rests on
(`src/data/cultureProfiles.js :: CULTURE_PROFILES`; the culture card prints the profile's rows). `{name}` is the
town's name; a HOOK line's "settlement" is spoken in the town's own tier noun by the composer, unchanged.

## What was chosen, and why (the measure)

THE CHOICE is the brief's list as written, 76 lines: `ARRIVAL_SCENES.ordinary` +6, `.river` +4, `.port` +3,
`.market` +3, `.smoke` +3; `ARRIVAL_TENSIONS.prosperous` +5, `.poor` +4; `ARRIVAL_SENSES` fish dominant +3,
livestock lines +3, smiths dominant +3, arcane dominant +3; every culture's `ARRIVAL_PEOPLE`, `mixed` included, +3
each (36). Before writing a word, the list was sized with placeholder lines on the 300 (22.9% fell to 16.2%), so it
was kept; the real lines read lower than the placeholders (most are one sentence: a line of two sentences shares its
nameless second one).

THE MEASURE (PAGE-1's measure A recipe: `hxd-<size>-<i>`, 50 a size, DEFAULT_CONFIG; the chance that at least two of
three distinct towns share an arrival sentence word for word, exact over every triple):

| | base (886a9c704) | with L2 |
|---|---|---|
| all sizes | 22.9% (a pair 8.4%) | 14.2% (a pair 5.0%) |
| thorp / hamlet / village | 35.6% / 30.2% / 24.4% | 20.8% / 17.7% / 15.4% |
| town / city / metropolis | 33.1% / 45.6% / 68.5% | 25.4% / 37.4% / 64.0% |

What is left is mostly not these pools: the five commonest shared sentences on the 300 are now the SIGHT beat's
landmarks (`structuralValidator.js :: checkInstCompat`, "The great cathedral's spire …" in 20 towns, "A wall
circuit, unremarkable but intact." in 15), outside L2's files. The test's stated target is under 18%.

THE DRAWS. Each beat draws its line with ONE `pickRandom` over the pool's drawable lines (`arrivalScene.js ::
drawAdmitted`, `kernel/rngContext.js :: pick`: one roll whatever the length; twins are outside the draw), so
lengthening a pool moves only which line the roll lands on. No pool is drawn twice by L2: the redraw-once that
exists already fires only where the first line is REFUSED by its declaration, and no line here is weighted by its
length. No `rng()` call is added, removed or moved. All of it is on the scene's own substream ('arrival-scene').

THE MOVES, record for record against the base (every stored field compared as JSON):
- the 300: `arrivalScene` changed in 285 of 300; every other field moved in 0 of 300.
- the banked corpus `r2` (720: 360 calm with random dials and 360 under the fifteen crises; base = the same tree
  with the deepened pools cut back to their base counts in memory): `arrivalScene` changed in 654 of 720; every other field moved in 0 of 720. An appended line printed 642 times there (under each of the fifteen crises, 8 to 19 times), and its declaration was refused by the record in none.
- A FIELD THAT READS IT: `generationCoherenceReceipt` (its `record_coherence_battery` reads the stored paragraph).
  The first draft of the smiths' soot line said "the walls of {name}"; the battery read `walls` as a defence in
  hxd-town-40, which has none, and the receipt moved. Reworded to "the house fronts of {name}"; it moves no more.

THE DECLARATIONS. A new line declares what it presumes as its siblings do, and where it presumes less it declares
less: the smiths' and the arcane trade's new lines speak of the trade's long presence, not of today's iron or
reagents, so they need no `trade at work` atom and no twin; the fish lines speak of the trade the exports name and
of no catch. In the two crisis-scoped scene pools (`ordinary`, `market`) a line true under any crisis writes
`crisis: any`; an everyday calm scene writes nothing and is drawn only where no crisis is active, as its siblings.

THE WALKERS. Eight first drafts were reworded before the commit (each noted at its line as FIRST DRAFT): the
presumption-classes walker read "the road in" (goods arriving), "heaped" (plenty), "milk" and "incense" (a resource
and a good) as presumptions the lines did not declare; the presumed-things walker read "the market", "the fishing",
"a household shrine" and "people who work magic for a living" as things the roster must hold. Each was reworded to
presume nothing, not declared (no register row was added).

## Batch 1: the HOOK's commonest scenes (13 lines)


### `ARRIVAL_SCENES.ordinary` (+6: 7 entries become 13)

Beside them (the base, unchanged; index: text, declaration):

- 0: {name} is ordinary in the best sense: a place where people live and work and argue and sleep, which is most of what places are for. _[none]_
- 1: The road into {name} becomes part of the settlement at a point you can't precisely identify. The houses gather around you gradually. _[crisis: any]_
- 2: {name} is neither impressive nor disappointing from the approach. It is what it is, which is a working settlement of reasonable size doing reasonable things. _[none]_
- 3: A child runs past you on the road into {name}, chasing something or being chased by something (unclear which). Nobody in the street pays attention. _[needs: tier: ≥ village; crisis: any]_
- 4: A child runs past you on the road into {name}, chasing something or being chased by something (unclear which). Nobody else on the road pays attention. _[TWIN; needs: tier: ≤ hamlet; crisis: any]_
- 5: A merchant argues with a carter on the road into {name} about the size of a load. Nobody else pays them any attention. This is clearly a daily occurrence. _[needs: market; crisis: any]_
- 6: The first person you meet on the road into {name} wants to know your business, and the second already knows it. _[crisis: any]_

NEW:

- **7: The first building you pass on the way into {name} is somebody's house, and so is the second, and so, it turns out, is most of the rest.** _[crisis: any]_
  - Houses, and nothing else to report: true of any place on any day, so `crisis: any`, as the road-gathers-houses sibling.
- **8: A dog trots out to look you over on the road into {name}, decides you are of no interest, and trots back.** _[crisis: any]_
  - A dog's indifference, the child-runs-past line's kind; nothing a crisis belies (`crisis: any`).
- **9: Washing hangs in the yards along the road into {name}, and someone calls a greeting from behind it without looking to see who you are.** _[none]_
  - Washing and a greeting: an everyday calm, so it writes nothing and stays calm (the pool is crisis-scoped), as "ordinary in the best sense" does.
- **10: A cart has stopped half across the road into {name} while its driver talks to someone over a fence, and nobody minds going round it.** _[none]_
  - A cart and a chat over a fence: the merchant-and-carter scene without the merchant (needs no market); calm only, as above.
- **11: {name} does not announce itself: the road simply gathers more doors, then a well, and then you are in it.** _[crisis: any]_
  - The road becoming the settlement, the second sibling's thought in other details; one sentence, so no nameless second sentence is shared.
- **12: {name} has no one thing to look at as you come in, only a great many small ones: a mended fence, a painted door, a bench beside a house.** _[crisis: any]_
  - Small things, no count of houses: true of a thorp and a city alike (`crisis: any`).

### `ARRIVAL_SCENES.river` (+4: 4 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: The smell of the river reaches you before the settlement does: clean water, reeds, the particular mud of a bank that people use every day. _[none]_
- 1: {name} runs along the water the way settlements do when water is the reason they exist: practical, a little chaotic at the waterfront, tidier as you move inland. _[none]_
- 2: The river carries the sounds of {name} to you around the bend before the buildings appear: a mill wheel, the knock of boats against a jetty, someone calling a tally across the water. _[needs: institution: mill, institution: docks]_
- 3: {name} has its back to the land and its face to the river; the approach by road brings you in the rear way, past the yards and the drying nets, into a settlement that plainly considers the water its front door. _[needs: trade at work: fish]_

NEW:

- **4: The road into {name} follows the river for the last mile, and the settlement grows along the bank before it grows away from it.** _[none]_
  - The road beside the river; presumes the river and its bank, as line 0 does (the route or the riverside port guarantee it).
- **5: You come into {name} along the bank, where steps go down to the water and someone is filling a bucket at the bottom of them.** _[none]_
  - Steps to the water and a bucket: the bank "that people use every day" of line 0, shown.
- **6: Willows lean over the water on the way into {name}, and the first houses stand just above the line where the bank turns to mud.** _[none]_
  - Willows and the mud line: landscape the engine does not track, the river only.
- **7: The river bends around {name}, so that you see the settlement twice on the way in: once across the water, and once on arriving.** _[none]_
  - A bend, seen twice: line 2's "around the bend" without its mill and jetty (so no `needs`).

### `ARRIVAL_SCENES.port` (+3: 6 entries become 9)

Beside them (the base, unchanged; index: text, declaration):

- 0: The harbour at {name} announces itself beyond the last rise: masts above the roofs, gulls wheeling over the quays, and salt bright in the air. _[needs: docks]_
- 1: {name} faces the sea as deliberately as a fortress faces its enemy. Warehouses and chandlers crowd the waterfront, with the older streets climbing behind them. _[needs: tier: ≥ village, docks]_
- 2: You hear {name}'s harbour before you see it: rigging knocking against masts, dock crews calling cargo tallies, and surf working against the outer wall. _[needs: docks]_
- 3: The road into {name} descends toward a forest of masts. Tar, salt, fish, and woodsmoke mark the boundary between the coast and the working port. _[needs: docks]_
- 4: The road into {name} comes down to the sea, and the salt reaches you a mile before the first roof does. _[needs: coast]_
- 5: {name} sits with its back to the land and its face to the open water, and the wind off the sea carries salt and weed a long way inland. _[needs: coast]_

NEW:

- **6: The last stretch of road into {name} runs along the shore, and the sound of the surf keeps you company the whole way.** _[needs: coast]_
  - The shore and the surf: the coast rows' kind, declared `coast` as they are.
- **7: Gulls ride the wind above {name}, and the roofs nearest the water are crusted pale with salt.** _[needs: coast]_
  - Gulls and salt on the roofs: the coast rows' wind and salt; `coast`. No quays (the harbour rows' word) and no harbour.
- **8: Boats ride at their moorings below {name}, and the smell of tar and rope comes up the road to meet you.** _[needs: docks]_
  - Moorings, tar and rope: a harbour's, so `docks`, as the four harbour rows; `rope` is a goods word the docks answer.

## Batch 2: the other two scenes, and the CLOSING's plenty and poverty (15 lines)


### `ARRIVAL_SCENES.market` (+3: 4 entries become 7)

Beside them (the base, unchanged; index: text, declaration):

- 0: The market at {name} is audible before it is visible: a specific mix of voices, animals, and the percussion of commerce that no other combination of sounds quite replicates. _[crisis: any]_
- 1: {name}'s market day has the comfortable chaos of something that has been happening in the same place for a long time and has worked out most of its problems. _[none]_
- 2: The road into {name} is thick with carts by mid-morning, all of them heading for the same square, and the traffic tells you where the settlement's heart is before you can see it. _[crisis: any]_
- 3: You reach {name} against a tide of people leaving it. The market has ended for the day, and the settlement is exhaling its visitors back onto the roads with their purchases and their news. _[crisis: any]_

NEW:

- **4: Every path into {name} seems to lead to the same place, and you follow the people carrying baskets until it does.** _[crisis: any]_
  - Following the baskets to the same place: the carts-to-the-square line's thought on foot (`crisis: any`, as it); the scene is reached only where a market stands. FIRST DRAFT ended "at the market": the presumed-things walker asks a line naming a market to declare it; it now names none.
- **5: Awnings of every colour cover the middle of {name}, and the buying and selling under them has settled into a steady hum.** _[none]_
  - Awnings and a settled hum: the comfortable-chaos line's kind, calm only as it is (writes nothing in a crisis-scoped pool).
- **6: Someone on the road into {name} asks whether you are buying or selling, and seems satisfied with either answer.** _[crisis: any]_
  - A wry question on the road in, buying or selling (`crisis: any`).

### `ARRIVAL_SCENES.smoke` (+3: 4 entries become 7)

Beside them (the base, unchanged; index: text, declaration):

- 0: The cookfire smoke of {name} drifts on the wind in your direction: a hundred fires, each with its own particular fuel, combining into something that smells like inhabited place. _[needs: population: ≥ middling]_
- 1: {name} is visible as a smear of smoke on the horizon for a long time before the buildings resolve. _[none]_
- 2: You smell {name} before anything else: woodsmoke and bread and livestock, the layered scent of a place where people have been living close together and cooking the same suppers for generations. _[none]_
- 3: The smoke above {name} stands straight up in the still air, a dozen thin columns that mark the settlement's shape on the sky like a map drawn in grey. _[none]_

NEW:

- **4: Smoke above the trees is all you see of {name} for the last hour of the road, and then the roofs are suddenly there.** _[none]_
  - Smoke over trees, then roofs: line 1's smear of smoke in other words. No count of fires (line 0 declares `population` for its hundred).
- **5: The wind brings you the smoke of {name} in gusts, now strong, now gone, as the road winds toward it.** _[none]_
  - Smoke on the wind in gusts as the road winds: no size, no fuel named.
- **6: Woodsmoke hangs low over {name} in the morning air, and the roofs show through it one at a time as you come closer.** _[none]_
  - Woodsmoke low in the morning air: line 3's smoke in still air, other weather.

### `ARRIVAL_TENSIONS.prosperous` (+5: 4 entries become 9)

Beside them (the base, unchanged; index: text, declaration):

- 0: Fresh paint and well-kept roofs say the place is doing well. _[excludes: starving, crisis: hunger; crisis: any]_
- 1: Well-fed children run errands from door to door. _[excludes: starving, crisis: hunger; crisis: any]_
- 2: Even the outbuildings have new roofs, and nobody looks hungry. _[needs: food: ≥ secure; excludes: starving, crisis: hunger; crisis: any]_
- 3: A merchant shows off a new cloak, and several neighbours make a point of noticing. _[crisis: any]_

NEW:

- **4: Doorsteps are swept, shutters are painted, and the brass on more than one door has been polished.** _[crisis: any]_
  - Swept steps, painted shutters, polished brass: line 0's fresh paint, other details. No food word, so no hunger exclusion.
- **5: Here and there a house has been added to lately, the new timber still pale beside the old.** _[crisis: any]_
  - Houses added to, new timber pale beside old: building with money to spare; no count.
- **6: People here dress a little better than the work in front of them requires.** _[crisis: any]_
  - Dress a little better than the work needs: line 3's new cloak, generalised.
- **7: A new cart stands in a yard with its paint barely dry, and its owner keeps finding reasons to walk past it.** _[crisis: any]_
  - A new cart, its proud owner: line 3's kind (a new thing shown off).
- **8: Window boxes of flowers hang below more than one sill.** _[crisis: any]_
  - Window boxes of flowers: spare means, nothing more.

### `ARRIVAL_TENSIONS.poor` (+4: 4 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: Patched roofs and patched clothes say money is short here. _[none]_
- 1: People mend what they have, and nobody seems to buy anything new. _[none]_
- 2: Children in outgrown clothes run errands for a copper. _[none]_
- 3: The goods on offer are mostly second-hand, and even those go slowly. _[none]_

NEW:

- **4: Roofs sag in places, and the repairs that have been made were made with whatever came to hand.** _[none]_
  - Sagging roofs mended with what came to hand: line 0's patched roofs, other details.
- **5: Shoes here are worn until they are mostly mending.** _[none]_
  - Shoes worn until they are mostly mending: line 1's "mend what they have".
- **6: Doors and shutters here have been mended more often than they have been painted.** _[none]_
  - Mended more often than painted: the same.
- **7: People count their coins carefully before parting with any of them.** _[none]_
  - Coins counted before parting with any: line 3's slow trade, from the buyer's side.

## Batch 3: the SENSE (12 lines)


### `ARRIVAL_SENSES.fish.dominant` (+3: 6 entries become 9)

Beside them (the base, unchanged; index: text, declaration):

- 0: Racks of drying fish line the way in, and the smell of salt and catch is everywhere. _[needs: trade at work: fish taken here, navigable, fish; excludes: crisis: hunger]_
- 1: The drying racks along the way in stand nearly bare, and only the smell of salt and old catch is left. _[TWIN; needs: navigable, fish]_
- 2: Half of {name} seems to be gutting, salting or selling fish. _[needs: trade at work: fish taken here, fish; excludes: crisis: hunger]_
- 3: Half of {name} has worked fish all its life, and there is almost no fish to work. _[TWIN; needs: fish]_
- 4: Barrels of salt fish stand stacked by the water, and the gulls have opinions about every one. _[needs: trade at work: fish, navigable; excludes: crisis: hunger]_
- 5: Empty salt barrels stand stacked by the water, and even the gulls have given up on them. _[TWIN; needs: navigable]_

NEW:

- **6: Talk in {name} turns to fish sooner or later, whatever it started on.** _[none]_
  - Talk turns to fish (FIRST DRAFT "the fishing", which the presumed-things walker reads as a fishing house): the trade the exports name (the pool's key) and nothing about today's catch, so no state of the catch, the water or a siege makes it false; nothing declared.
- **7: A gutting knife hangs by more than one doorway, its blade worn thin with use.** _[none]_
  - A gutting knife worn thin: years of the trade, not today's catch; "more than one doorway", no count a hamlet would belie.
- **8: Even the dogs here smell faintly of fish, and nobody but you seems to notice.** _[none]_
  - Even the dogs smell of fish: the trade's long presence; nothing declared.

### `ARRIVAL_SENSES.livestock.lines` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: Sheep call to one another from the grazing beyond the houses. _[excludes: crisis: under_siege, crisis: monster_pressure; crisis: any]_
- 1: A dog drives a handful of animals across the road, and you wait for them. _[excludes: crisis: under_siege; crisis: any]_
- 2: The smell of the byres reaches you on the breeze. _[crisis: any]_
- 3: Someone is churning butter in a doorway, and the rhythm of it carries. _[needs: trade at work: dairy; excludes: failed: livestock; crisis: any]_
- 4: Someone is mending a hurdle in a doorway, and the knock of the mallet carries. _[TWIN; crisis: any]_

NEW:

- **5: Hoofprints and dung mark the lane, and you learn quickly to watch where you step.** _[crisis: any]_
  - Hoofprints and dung in the lane: animals kept, as the byres' line; no kind named and no herd crossing now, so a siege or a failed herd leaves it true (`crisis: any`, as the byres'). FIRST DRAFT said "mark the road in": the presumption-classes walker reads "the road in" as goods arriving from outside; the lane is the place's own.
- **6: An animal bawls from a byre somewhere close, and another answers it.** _[crisis: any]_
  - One animal bawling from a byre, another answering: the byres' line, heard. Even a failed herd leaves a beast or two.
- **7: Someone leads a single beast along the lane on a halter, talking to it the whole way.** _[crisis: any]_
  - One beast led on a halter along a lane: inside the place, not a herd on the road (the dog-and-herd line excludes a siege for that).

### `ARRIVAL_SENSES.smiths.dominant` (+3: 8 entries become 11)

Beside them (the base, unchanged; index: text, declaration):

- 0: The hammering of the forges echoes through all of {name}. _[needs: institution: smith, tier: ≥ town, trade at work: ironwork]_
- 1: The forges of {name} are quiet more often than not, for want of iron. _[TWIN; needs: institution: smith, tier: ≥ town; excludes: trade at work: ironwork]_
- 2: Forge smoke hangs over everything here, and the ring of the anvils never quite stops. _[needs: institution: smith, tier: ≥ town, trade at work: ironwork in full]_
- 3: Only a little forge smoke rises here, and the anvils ring now and then, when there is iron to work. _[TWIN; needs: institution: smith, tier: ≥ town; excludes: trade at work: ironwork in full]_
- 4: Racks of new ironwork stand outside the workshops, waiting for the carts. _[needs: institution: smith, tier: ≥ town, trade at work: ironwork in full; excludes: crisis: under_siege]_
- 5: The racks outside the workshops stand mostly empty: the smiths are short of iron. _[TWIN; needs: institution: smith, tier: ≥ town; excludes: trade at work: ironwork in full]_
- 6: The clang of iron from the smithies carries down the lanes of {name}. _[needs: institution: smith, tier: ≥ town, trade at work: ironwork]_
- 7: The smithies of {name} are quieter than they ought to be, for want of iron. _[TWIN; needs: institution: smith, tier: ≥ town; excludes: trade at work: ironwork]_

NEW:

- **8: Soot from the forges has darkened the house fronts of {name} nearest the smithies.** _[needs: institution: smith, tier: ≥ town]_
  - Soot on the house fronts nearest the smithies: the forges' long presence, true whether or not iron comes, so no ironwork atom and no twin; `institution: smith`, `tier: ≥ town` as every sibling ("smithies" is many forges). FIRST DRAFT said "the walls of": the coherence battery reads `walls` as a defence (hxd-town-40 has none); reworded.
- **9: More than one person you pass has the burn-scarred hands of someone who works at a forge.** _[needs: institution: smith, tier: ≥ town]_
  - Burn-scarred hands, "more than one": the smiths' trade, not today's work; the same two atoms.
- **10: Old horseshoes and broken tools lie in a pile behind a smithy, waiting to go back into the fire.** _[needs: institution: smith, tier: ≥ town]_
  - Old horseshoes and broken tools waiting for the fire: scrap waits whether or not the iron comes; the same two atoms (`horseshoes` is a goods word the institution answers). FIRST DRAFT said "lie heaped", which the walker reads as plenty.

### `ARRIVAL_SENSES.arcane.dominant` (+3: 7 entries become 10)

Beside them (the base, unchanged; index: text, declaration):

- 0: Magic is a trade in {name} like any other: signs offer enchanting and identification by the hour. _[needs: enchanting, trade at work: arcane]_
- 1: No sign in {name} offers enchanting by the hour; what magic is worked here is the work of its own houses, not a trade on the street. _[TWIN; excludes: enchanting]_
- 2: The air prickles faintly, the way it does where a great deal of spellwork is done. _[needs: trade at work: arcane]_
- 3: Little spellwork is done in {name} these days, for want of the stuff it takes. _[TWIN; excludes: trade at work: arcane]_
- 4: Stalls sell reagents in stoppered jars, and the buyers know exactly what they want. _[needs: trade at work: arcane]_
- 5: The reagent stalls are half bare, and the few jars left are dear. _[TWIN; excludes: trade at work: arcane]_
- 6: Magic is still a trade in {name}: the signs still offer it by the hour, but the work is slow and dear for want of what it takes. _[TWIN; needs: enchanting; excludes: trade at work: arcane]_

NEW:

- **7: Sigils are scratched into door frames here and there, and not all of them are for show.** _[none]_
  - Sigils on door frames, some not for show: magic worked here at all (the key's own fact, drawn only where magic is real), not its materials today; nothing declared, no twin.
- **8: People in {name} step around a chalked circle on the ground without looking down, the way people elsewhere step around a puddle.** _[none]_
  - A chalked circle stepped around like a puddle: magic as an ordinary part of the place, line 0's "a trade like any other" in other details.
- **9: Snatches of talk in the lanes of {name} are full of the words of spellwork, which a stranger to it would not follow.** _[none]_
  - Talk full of spellwork's words: the trade's presence, not its supply. FIRST DRAFT said "people who work magic for a living", which the presumed-things walker reads as a practitioner the roster must hold.

## Batch 4: the PEOPLE (germanic, latin, celtic, arabic, norse) (15 lines)


### `ARRIVAL_PEOPLE.germanic` (+3: 4 entries become 7)

Beside them (the base, unchanged; index: text, declaration):

- 0: An errand-runner hurries past, a household's mark stitched on his sleeve. _[none]_
- 1: Two neighbours argue over a boundary stone, each quoting what their grandfathers agreed. _[none]_
- 2: A craftsman shows off a finished piece in his doorway, and passers-by judge it out loud. _[none]_
- 3: A notice of the next fair is nailed up beside a doorway, and someone is reading it aloud for the others. _[needs: market; excludes: crisis: under_siege]_

NEW:

- **4: A pedlar has opened his pack on a doorstep, and a household gathers round to look before anyone admits to wanting anything.** _[excludes: crisis: under_siege]_
  - custom: Pedlar's pack on a doorstep, a household gathering to look. Profile words: exchangePattern: "Estate dues, pedlars, and merchant associations connect farms to specialist workshops."
  - declared: `excludes: crisis: under_siege` (a pedlar's goods come by road, as the fair notice's sibling exclusion)
- **5: A neighbour turns up unasked to help with a roof, and the household makes a note of it, because the day will be owed back.** _[none]_
  - custom: A neighbour helps with a roof unasked; the household notes the day is owed back. Profile words: socialTexture: "Household, guild, parish, and estate obligations overlap; authority is visible through office and reciprocal duty."
  - declared: none
- **6: Loaves of dark rye are carried home under arms, still warm from somebody's oven.** _[excludes: crisis: hunger]_
  - custom: Dark rye loaves carried home warm. Profile words: foodways: "Rye or barley breads, pottage, smoked foods, and seasonal livestock products dominate ordinary meals."
  - declared: `excludes: crisis: hunger` (no warm bread where the food failed, as the bread sense)

### `ARRIVAL_PEOPLE.latin` (+3: 4 entries become 7)

Beside them (the base, unchanged; index: text, declaration):

- 0: A patron moves through the crowd with clients at their heels, greeting people by name. _[needs: tier: ≥ town; crisis: any]_
- 1: A notary's clerk hurries past with a satchel of contracts. _[needs: tier: ≥ town, legal house; crisis: any]_
- 2: People argue politics in the open, loudly, and seem to enjoy it. _[excludes: crisis: occupied, crisis: under_siege; crisis: any]_
- 3: A benefactor's name is carved fresh above a mended well, and people make sure you notice it. _[crisis: any]_

NEW:

- **4: A small lamp burns in a niche beside a doorway, with an offering set before it.** _[crisis: any]_
  - custom: A small lamp in a niche by a doorway, an offering before it (FIRST DRAFT named "a household shrine", which the presumed-things walker reads as a shrine on the roster). Profile words: sacredLife: "Household devotion and civic cult practice overlap in festivals, memorials, and patronage." (the row with no `needs`; no temple named)
  - declared: `crisis: any`, as the pool
- **5: Two men shake hands on a bargain and then, to be sure, have it written down.** _[crisis: any]_
  - custom: A bargain shaken on, then written down. Profile words: exchangePattern: "Contract, warehousing, tolls, and notarial practice support long-distance commerce." (no notary named: line 1 declares `legal house` for its clerk)
  - declared: `crisis: any`
- **6: A family's name is painted on a new bench by the road, so that everyone who sits on it knows whom to thank.** _[crisis: any]_
  - custom: A family's name painted on a new bench by the road, so sitters know whom to thank. Profile words: civicPattern: "Civic office and private patronage are intertwined; public generosity is a recognized route to influence."; line 3's benefactor's well, other details
  - declared: `crisis: any`

### `ARRIVAL_PEOPLE.celtic` (+3: 4 entries become 7)

Beside them (the base, unchanged; index: text, declaration):

- 0: A poet holds a small crowd by the well, and nobody hurries the telling along. _[crisis: any]_
- 1: A household feeds passing travellers at its door, and makes sure everyone sees it doing so. _[excludes: crisis: hunger; crisis: any]_
- 2: Greetings are called across the lane, and every greeting comes with a question about family. _[crisis: any]_
- 3: An elder listens to two neighbours by a gate and says nothing until both are finished. _[crisis: any]_

NEW:

- **4: A boy is introduced to a neighbour as the household's foster-son, and is treated in every way as one of its own.** _[crisis: any]_
  - custom: A boy introduced as the household's foster-son, treated as its own. Profile words: exchangePattern: "Buying and selling go on beside tribute, fosterage, and reciprocal obligations between kin groups."
  - declared: `crisis: any`
- **5: Two neighbours clasp hands on a promise at the roadside, and both make sure someone sees them do it.** _[crisis: any]_
  - custom: Two neighbours clasp hands on a promise, making sure someone sees. Profile words: socialTexture: "Status is made visible through generosity, oath keeping, and the ability to mobilize relatives and clients."
  - declared: `crisis: any`
- **6: A covered dish is carried to a neighbour's door as a gift, and the neighbour is already looking for something to send back.** _[excludes: crisis: hunger; crisis: any]_
  - custom: A covered dish carried as a gift, the neighbour already finding a return gift. Profile words: exchangePattern: "Pastoral wealth, seasonal fairs, metalwork, and gift exchange connect dispersed households."
  - declared: `excludes: crisis: hunger`, `crisis: any` (food given, as line 1's hospitality)

### `ARRIVAL_PEOPLE.arabic` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: A broker sits in the shade, matching buyers to goods from routes you have never travelled. _[needs: market; excludes: crisis: under_siege, route: isolated]_
- 1: A broker sits in the shade, matching buyers to whatever the neighbours have to spare. _[TWIN; needs: route: isolated; excludes: crisis: under_siege]_
- 2: Travellers are offered water before anyone asks their business. _[excludes: crisis: under_siege]_
- 3: Two partners go over their accounts in a courtyard with a mediator sitting between them. _[none]_
- 4: A merchant swears an oath on his scales, and the buyer watches the scales anyway. _[needs: market]_

NEW:

- **5: Bread is set out at a doorway for whoever needs it, and the household that set it there does not wait to be thanked.** _[excludes: crisis: hunger]_
  - custom: Bread set out at a doorway for whoever needs it. Profile words: civicPattern: "Formal law and charitable endowment sit beside neighborhood mediation and courtly patronage."; socialTexture: "… charitable, and commercial obligations intersect in streets and courtyards."
  - declared: `excludes: crisis: hunger`
- **6: Neighbours gather in a courtyard to hear an older man talk two of them out of a disagreement.** _[none]_
  - custom: Neighbours in a courtyard hear an older man talk two of them out of a disagreement. Profile words: civicPattern: "… neighborhood mediation …" (above); socialTexture: "Hospitality, reputation, contract, and access to mediation are practical forms of social capital." (no judge named: the judges' row declares a court)
  - declared: none
- **7: A buyer short of coin leaves with his goods anyway, on a neighbour's word that he is good for it.** _[none]_
  - custom: A buyer short of coin leaves with the goods on a neighbour's word. Profile words: exchangePattern: "Caravan organization, brokerage, credit, warehousing, and inspected weights sustain regional exchange."; socialTexture: "… reputation …" (no market named)
  - declared: none

### `ARRIVAL_PEOPLE.norse` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: People argue law in the open as freely as they trade. _[excludes: crisis: occupied, crisis: under_siege; crisis: any]_
- 1: Racks of drying fish and smoked meat stand beside the houses, laid in against the winter. _[needs: navigable, fish; excludes: crisis: hunger; crisis: any]_
- 2: Empty drying racks stand beside the houses, waiting for whatever can be laid in against the winter. _[TWIN; crisis: any]_
- 3: A household leader hands out gifts in the open, and everyone watching keeps count. _[crisis: any]_
- 4: Neighbours work together to mend a roof, and nobody seems to be in charge of it. _[crisis: any]_

NEW:

- **5: A household counts its winter stores aloud at the door of its storehouse, and the neighbours listen to the count.** _[crisis: any]_
  - custom: A household counts its winter stores aloud at its storehouse door; neighbours listen. Profile words: socialTexture: "Seasonal scarcity makes storage, mutual aid, and dependable leadership visibly political."
  - declared: `crisis: any` (a count is true in a lean year too)
- **6: An old man recites a point of law from memory, and nobody listening needs to ask where he learned it.** _[crisis: any]_
  - custom: An old man recites a point of law from memory. Profile words: civicPattern: "Household leaders and law speakers bargain in assembly beneath a chieftain or royal representative."; socialTexture: "Law, household reputation, reciprocal gifts …"
  - declared: `crisis: any`
- **7: A silver ring is cut in two to settle a bargain, and each side weighs his piece in his palm.** _[crisis: any]_
  - custom: A silver ring cut in two to settle a bargain; each side weighs his piece. Profile words: exchangePattern: "Maritime trade, seasonal voyaging, fishing, pastoral production, and portable wealth drive exchange." (that row declares `coast`; the ring is the portable wealth alone, no sea named) VETOABLE: if the citation must be to a row without `needs`, this line wants another custom
  - declared: `crisis: any`

## Batch 5: the PEOPLE (slavic, east_asian, mesoamerican, south_asian, steppe) (15 lines)


### `ARRIVAL_PEOPLE.slavic` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: Smoke rises from a household oven, and a neighbour stops in to share its warmth. _[crisis: any]_
- 1: People gather at the well, and the news of the whole place passes through it. _[crisis: any]_
- 2: Strings of dried mushrooms hang in the doorways beside barrels of pickled cabbage. _[excludes: crisis: hunger; crisis: any]_
- 3: A work party heads out together, singing, with tools on their shoulders. _[excludes: crisis: under_siege; crisis: any]_
- 4: A work party gathers with tools on their shoulders, to shore up whatever needs it. _[TWIN; needs: crisis: under_siege; crisis: any]_

NEW:

- **5: An elder of the household stands at the door and sends each of the younger ones off to their share of the day's work.** _[crisis: any]_
  - custom: A household elder sends the younger ones off to their share of the day's work. Profile words: civicPattern: "Communal assemblies, household elders, service elites …"; socialTexture: "Household and communal labor obligations are enforced through reputation, assembly, and local office."
  - declared: `crisis: any` (work inside the place; line 3's work party heading OUT is the one a siege excludes)
- **6: Neighbours sit together on a bench, shredding cabbage into one tub to be salted down for the winter.** _[excludes: crisis: hunger; crisis: any]_
  - custom: Neighbours shred cabbage into one tub to salt down for winter. Profile words: foodways: "Fermentation, pickling, and drying stretch the harvest through winter."; socialTexture: "Shared water and seasonal work make private life unusually communal."
  - declared: `excludes: crisis: hunger`, `crisis: any` (as line 2's pickled cabbage)
- **7: A cup of water stands on a windowsill for the household's dead, and nobody touches it.** _[crisis: any]_
  - custom: A cup of water on a windowsill for the household's dead. Profile words: sacredLife: "Formal temples or churches coexist with ancestor customs, seasonal festivals, springs, and household rites." (that row declares `institution: temple`; the custom cited is the household's own, no temple named) VETOABLE as norse 7; the undeclared row "Sacred life follows both an institutional calendar and the agricultural year." does not name it
  - declared: `crisis: any`

### `ARRIVAL_PEOPLE.east_asian` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: A clerk records every cartload that passes in a careful ledger. _[excludes: crisis: under_siege, route: isolated]_
- 1: A clerk records every sack and basket that comes in from the fields in a careful ledger. _[TWIN; needs: route: isolated; excludes: crisis: under_siege]_
- 2: An elder settles a quarrel in a quiet voice before it can grow loud enough to need anyone else. _[none]_
- 3: Tea is poured for a merchant before the bargaining begins, and the bargaining waits for it. _[needs: market]_
- 4: Each lane seems to keep to its own trade, and each trade to its own lane. _[needs: tier: ≥ town]_

NEW:

- **5: A boy recites his lessons on a doorstep while an older relative listens for mistakes.** _[none]_
  - custom: A boy recites his lessons on a doorstep; an older relative listens for mistakes. Profile words: socialTexture: "Office, household seniority, lineage, guild membership, education, and neighborhood duty create intersecting hierarchies."; civicPattern: "Written office and examination or appointment coexist …"
  - declared: none
- **6: The younger members of a household stand aside at a doorway to let the eldest through first.** _[none]_
  - custom: The younger members of a household stand aside for the eldest at a doorway. Profile words: socialTexture: "… household seniority, lineage …" (above)
  - declared: none
- **7: Inside an open door, tablets bearing the names of the household's dead stand on a shelf, with a small offering before them.** _[none]_
  - custom: Tablets naming the household's dead on a shelf inside an open door, an offering before them (FIRST DRAFT burned incense, a goods word). Profile words: sacredLife: "Temple, shrine, household, ancestor, philosophical, and state observances coexist without a single institutional center." (no `needs`)
  - declared: none

### `ARRIVAL_PEOPLE.mesoamerican` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: Porters bent under loaded frames file past, and someone counts them in. _[excludes: crisis: under_siege, route: isolated]_
- 1: A neighbour comes in from the fields with a basket on one hip, and someone asks how the day went. _[TWIN; excludes: crisis: under_siege]_
- 2: The neighbours turn out together to sweep and mend their own street. _[none]_
- 3: Festival banners hang above the doors, faded from one year and waiting for the next. _[none]_
- 4: Craftspeople sit in rows, each row a different trade, each worker deep in their own work. _[needs: market]_

NEW:

- **5: The scrape of a grinding stone comes from a doorway, where someone is making the day's maize dough.** _[excludes: crisis: hunger]_
  - custom: A grinding stone scraping in a doorway; the day's maize dough. Profile words: foodways: "Maize, beans, squash, chile, tomatoes, greens, cacao, and locally available fish or game form the staple pattern."
  - declared: `excludes: crisis: hunger`
- **6: A household sets a small offering of flowers at its threshold and lights a pinch of resin beside it.** _[none]_
  - custom: Flowers and a pinch of burning resin at a household's threshold. Profile words: sacredLife: "Calendar rites, neighborhood temples, household offerings, pilgrimage, and civic ceremony are materially intertwined." (that row declares a temple and no threat; the offering is the household's own) VETOABLE as norse 7; the undeclared row "Ritual specialists track … through a public festival cycle." does not name it
  - declared: none
- **7: Neighbours are counted off by name for their turn of work on the common ground, and nobody's name is skipped.** _[none]_
  - custom: Neighbours counted off by name for their turn of work on the common ground. Profile words: socialTexture: "Civic labor and festival obligations make the settlement a visibly collective project."; "Ward membership, … tribute duty …"
  - declared: none

### `ARRIVAL_PEOPLE.south_asian` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: A moneylender sits at a low table with a queue of familiar faces waiting. _[needs: tier: ≥ village]_
- 1: An old woman sits at a low table by her door, and the neighbours stop to settle what they owe her. _[TWIN; needs: tier: ≤ hamlet]_
- 2: People draw water in an order nobody needs to explain. _[none]_
- 3: Food is being handed out to anyone who asks, and the line is patient. _[excludes: crisis: hunger]_
- 4: Each lane of stalls has someone who speaks for it, and they are all speaking at once. _[needs: market, tier: ≥ town; excludes: crisis: under_siege]_

NEW:

- **5: A doorstep has been washed and marked with a pattern in white powder, and people step around it.** _[none]_
  - custom: A washed doorstep marked with a pattern in white powder; people step around it. Profile words: socialTexture: "Occupation, neighborhood, household, guild, patronage, and religious affiliation create multiple routes to belonging."
  - declared: none
- **6: Three generations of one family sit at the same work in one doorway, the youngest watching the oldest.** _[none]_
  - custom: Three generations of one family at the same work in one doorway. Profile words: exchangePattern: "Occupational specialization links rural production to dense networks of processing and resale."; socialTexture: "Occupation, … household …"
  - declared: none (one doorway: no lane of trades, which line 4 declares a town for)
- **7: Two neighbours disagree over whose turn it is at the water, and a third reminds them both of the order.** _[none]_
  - custom: Two neighbours disagree over whose turn at the water; a third reminds them of the order. Profile words: socialTexture: "Water access, trade standing, ritual service, and credit relationships are everyday political facts."; line 1's order at the water, other details
  - declared: none

### `ARRIVAL_PEOPLE.steppe` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: Herders show their animals at the edge of the settlement, where herders and townsfolk meet. _[excludes: crisis: under_siege; crisis: any]_
- 1: Felt tents stand beside the houses, and their owners seem at home in either. _[crisis: any]_
- 2: A caravan broker shouts terms to a line of laden animals and the people leading them. _[needs: market; excludes: crisis: under_siege, route: isolated; crisis: any]_
- 3: A pair of pack animals stands in a yard, unladen, while their keeper mends a strap. _[TWIN; crisis: any]_
- 4: Guests are greeted with a cup before a word of business is spoken. _[crisis: any]_

NEW:

- **5: A rider comes in from the open country with news, and a knot of people gathers before he has dismounted.** _[excludes: crisis: under_siege; crisis: any]_
  - custom: A rider in from the open country with news; a knot of people gathers. Profile words: socialTexture: "The settlement is where mobile and settled ways of life meet, and much of the society lives beyond it."
  - declared: `excludes: crisis: under_siege` (no rider comes in), `crisis: any`
- **6: A family loads its belongings for the season's move, and the neighbours who are staying help tie the load.** _[excludes: crisis: under_siege; crisis: any]_
  - custom: A family loads for the season's move; the neighbours staying help tie the load. Profile words: scope: "Herds and caravans, part settled and part on the move, held together by clans."; socialTexture (above)
  - declared: `excludes: crisis: under_siege`, `crisis: any`
- **7: An old woman flicks a few drops from her cup toward the sky before she drinks.** _[excludes: crisis: hunger; crisis: any]_
  - custom: An old woman flicks drops from her cup toward the sky before drinking (FIRST DRAFT named the milk, a resource word). Profile words: sacredLife: "Household, ancestor, sky, land, shrine, and adopted institutional traditions coexist across mobile and settled life."; foodways: "Meat, dairy, fermented drinks …"
  - declared: `excludes: crisis: hunger`, `crisis: any`

## Batch 6: the PEOPLE (greek, mixed) (6 lines)


### `ARRIVAL_PEOPLE.greek` (+3: 5 entries become 8)

Beside them (the base, unchanged; index: text, declaration):

- 0: Two citizens argue a point of law loudly enough for the neighbours to stop and listen. _[excludes: crisis: occupied; crisis: any]_
- 1: A notice of the next assembly is chalked on a wall, and someone has corrected the spelling. _[excludes: crisis: occupied; crisis: any]_
- 2: A money changer sits at his table with coins from many mints. _[needs: institution: bank; excludes: crisis: under_siege; crisis: any]_
- 3: A money changer sits at his table with little to do, counting the same coins from many mints again. _[TWIN; needs: institution: bank, crisis: under_siege; crisis: any]_
- 4: A patron stands drinks for the whole room, and makes sure everyone knows who is paying. _[needs: institution: tavern, tier: ≥ village; crisis: any]_

NEW:

- **5: A young man practises a speech under his breath as he walks, stopping now and then to try a line again.** _[crisis: any]_
  - custom: A young man practising a speech under his breath as he walks. Profile words: socialTexture: "Household, citizenship, association, patronage, public rhetoric, and military service define competing forms of status."
  - declared: `crisis: any` (VETOABLE: lines 0 and 1 exclude an occupation for an argued point and an assembly notice; a speech rehearsed is neither)
- **6: Members of some association walk together, each wearing the same small badge, and greet one another by it.** _[crisis: any]_
  - custom: Members of some association, each wearing the same small badge, greeting one another by it. Profile words: socialTexture: "… association …" (above); civicPattern: "… sanctuaries, and civic associations compete through public office." (that row declares a court; the association cited from socialTexture)
  - declared: `crisis: any`
- **7: A list of who paid for the last festival is painted on a wall, the largest givers first.** _[crisis: any]_
  - custom: A list of who paid for the last festival painted on a wall, largest givers first. Profile words: sacredLife: "Sacred offices and festival funding are inseparable from civic status and public memory."
  - declared: `crisis: any`

### `ARRIVAL_PEOPLE.mixed` (+3: 4 entries become 7)

Beside them (the base, unchanged; index: text, declaration):

- 0: You hear three languages in as many steps, and nobody seems to find it strange. _[crisis: any]_
- 1: People here greet newcomers with open curiosity, and ask where you have come from before your name. _[excludes: crisis: threat, crisis: plague_onset, crisis: recently_betrayed, crisis: infiltrated; crisis: any]_
- 2: A cook at a doorway mixes the spices of two different homelands into one pot. _[crisis: any]_
- 3: Neighbours bargain in a trade tongue that belongs to no one and works for everyone. _[crisis: any]_

NEW:

- **4: Two doorways side by side hang the charms of two different traditions, and both households seem content with the arrangement.** _[crisis: any]_
  - custom: Neighbouring doorways hung with the charms of two traditions. Profile words: the mixed card's scope: "A local blend in which both traditions stay visible." (`materializeCulturalIdentity`, mixed); line 2's two homelands in one pot
  - declared: `crisis: any`
- **5: A girl answers her mother in one tongue and her grandmother in another without missing a step.** _[crisis: any]_
  - custom: A girl answers her mother in one tongue and her grandmother in another. Profile words: the same scope; line 0's three languages, other details
  - declared: `crisis: any`
- **6: Houses along the lane are built in two different manners, and a few have borrowed a little of each.** _[crisis: any]_
  - custom: Houses on one lane built in two manners, a few borrowing from each. Profile words: the same scope; the card's builtForm is the two traditions' joined (`${first.builtForm} ${second.builtForm}`)
  - declared: `crisis: any`

