# LINES-2 — DAILY-1 · L2: food_culture, commoner_resentments (+ the owner-only `_dm`), outsider_impressions, unspoken_topics, recent_changes

Written 2026-11-20T18:32Z (`date -u`) by the L2 line-drafting builder, for the chair's read. Pools: `pools.2.mjs` (data; the wordings
below are transcribed from it). Probe: `probe.2.mjs`, output `probe.2.out.txt` (recorded run: fresh births, M1's recipe, 150 a size,
exit 0, 99 s). Nothing under `src/`, `tests/`, `scripts/` changed.

THE PROBE (cells: top whole-text % / top SENTENCE % / EMPTY % / distinct texts, of 150; before = M1 table 1's top %; FALSE = places
printing any wording a test says is false, every M1 clause test + the declared needs + this probe's word tests + the coherence battery)

| slot | thorp | hamlet | village | town | city | metropolis | before (top %) | FALSE |
|---|---|---|---|---|---|---|---|---:|
| food_culture | 9/9/0/31 | 9/9/0/31 | 9/9/0/32 | 7/7/0/38 | 7/7/0/35 | 8/8/0/33 | 65/46/45/51/33/28 | 0 |
| commoner_resentments | 7/10/19/44 | 5/7/9/66 | 9/10/7/50 | 3/6/35/65 | 7/9/34/46 | 9/11/26/39 | 65/69/83/35/43/55 | 0 |
| commoner_resentments_dm (owner-only) | 4/4/93/3 | 3/3/93/3 | 1/1/98/3 | 2/2/92/7 | 5/5/83/6 | 5/5/83/6 | (was inside the public slot) | 0 |
| outsider_impressions | 1/13/0/149 | 1/15/0/150 | 1/15/0/145 | 1/9/0/149 | 2/9/0/140 | 3/9/0/132 | 43/38/44/13/9/11 | 0 |
| unspoken_topics | 5/5/14/57 | 5/5/22/57 | 3/3/10/58 | 7/7/19/53 | 4/4/49/42 | 5/5/49/37 | 100 at every size | 0 |
| recent_changes | 3/10/0/134 | 1/11/0/145 | 2/13/0/147 | 5/6/0/131 | 4/6/1/119 | 5/5/1/129 | 17/8/5/14/19/16 | 0 |

Bar (rule 3): every branch at every size carries at least ceil(reach / 0.15) eligible wordings at its thinnest place: 0 cells short,
0 places with no eligible wording (probe section 2). Top sentence at most 15% at every size (outsider, hamlet and village, sits at 15).
Record-text residue the probe also counts (NOT my wordings, see FOR THE CHAIR 1): the recent-disruption beat's own text.

## HOW THE PROBE APPLIES THE POOLS (rules 1 to 3)
For each branch a place takes: ELIGIBLE = the branch's wordings whose every need holds (the NEEDS table below); the pick
`pickVariantMixed(eligible, '<record.name>::dailyLife.<slot>::<branch>')` (`src/kernel/proseHash.js`); no new draw, no `_seed`, no
person's id. Placeholders fill through `src/domain/display/powerSentenceName.js` (re-exporting `src/data/people/powerSentenceName.js`):
`{gov}`/`{power}` = `powerNameWithArticle(name)` ("the Elder Council", "the Guard"); `{power's}` = `the ${powerPossessive(powerNameAfterArticle(name))}`
(the composition `generators/power/settlementNarrative.js:167` and `governanceNarrative.js:199` already use; today's line used
`powerPossessive` bare, before NAMES-1); `{gov|is|are}` = `fillAgreement` (number of the name: "the Religious Authorities are").
A slot of several parts prints each part as its own sentence, joined by a space (today joined clauses with "; and" / "; "): every
wording is a whole sentence the DM can read alone.

RULE 4 (a house in a sentence): no L2 wording names a house by its roster name; they name KINDS ("the market", "the stalls", "the
watch", "the healers", "the guilds", "the mill", "temple kitchens"), so no bracketed qualifier can print. Were a roster name wanted,
the line's helper is `src/domain/display/institutionSentenceNoun.js :: institutionSentenceNoun` (strips "(…)", a leading
"multiple"/"massive", the second of a slashed pair) with "the" before it; no new helper is written. No L2 wording says "town"; the only
"Town" printed is a government's own name ("the Town Council", "the Town Mayor", town tier only), which the probe's word test reads with
filled names struck.

## THE NEEDS (each read from a fact home; the nearest field named where none answers)
| need | record test |
|---|---|
| grain / fish / game / livestock / mill | `factsOf(r).foodSources` has the key (the battery's `foodWordsFindings` reads the same list) |
| grainHeld | `factsOf(r).foodSources` has grain or mill, or `factsOf(r).imports` names grain |
| grainImport | `factsOf(r).imports` names grain and `foodSources` has no grain |
| growsMore / stores | `factsOf(r).growsMoreThanEats` / `factsOf(r).storesMonths > 0` |
| market / sacred / guild / route | `factsOf(r).market` (marketOf) / `.sacredHouse` / `.guild` / `.route` not ""/isolated/none |
| notSmall | `factsOf(r).tier` not thorp or hamlet |
| prosperous / notProsperous / poor | `factsOf(r).prosperity` in prosperous, comfortable / not those / poor, struggling |
| guard / noGuard | `factsOf(r).guardPresence` / its negation |
| watch / gate / healer / noHealer | `defenceOf(r).watch` / `.gate` / `.healer \|\| .hospital` / its negation |
| gov / council | `rulerKindOf(r) !== null` / `rulingBodyOf(r) === true` |
| elders / headman / mayor / reeve / steward | `rulerKindOf(r)` elder+body+label "elder" / elder+one+label "headman" / mayor+label "mayor" / mayor+label "reeve" / lord+label "steward" |
| magic | `factsOf(r).magic.functions` |
| power.merchant / .religious / .military | the dominant power's archetype (`deriveAllFactionProfiles`) |

The branch itself is a need too (the food band, the legitimacy band, the tension type, the threat kind and stage, the condition
archetype): every wording of a branch presumes the fact that put the place on it, and nothing more than its listed needs.

## 1. food_culture (every place fills it)
BRANCHES: the food band as today (`capacity.food_production`): surplus, adequate, strained, critical, collapsed; a surplus place under a
famine or siege threat takes `surplus.wanting` (today's twin rule, kept). RE-CUT: today's chain sub-branches (Ss "stable chain", Rd/Cd
"disrupted chain") are folded into their band. Why: they print the chain's own output and name ("Bread, broth, and cavalry mounts are
plentiful" can print (READ: `Horse & Animal Trade` is a food_security chain, its output "Cavalry mounts"); "foraging & smallholding is strained") — an engine label,
rule 5. What people eat is said instead from `factsOf(r).foodSources` (none listed on 37-43% of places: every band carries enough
wordings that need no source) and `factsOf(r).prosperity`. Today's texts kept at index 0 with their needs: surplus.wanting ("bread":
grain; "the stores": stores), surplus (grain), adequate (grain, livestock for "meat", notSmall for "streets"; "turnip-and-onion" and
"festivals" have no home and are kept as today's), strained ("Loaves": grainHeld; "each month" kept as today's, see FOR THE CHAIR 4),
critical (needs none; "hoard quietly" untestable, kept), collapsed ("temple kitchens": sacred; "caravans": route). Ss's text is NOT kept
(chain output). Battery: a wording with "table"/"meals" that names a food (foodways `SOURCE_WORDS`) needs that source, so no wording
trips `foodWordsFindings` (probe: 0).

WORDINGS (index 0 first; needs; houses):
**surplus.wanting** (5)
0. The stores still hold: bread and broth reach most tables, and the households count what is left. — needs: [grain, stores]
1. There is still enough in store for now, but every household is careful with what it has. — needs: [stores]
2. The place still eats from what was put by, and nobody wastes a crumb of it. — needs: [stores]
3. Food is not short yet, but people eat as if it soon might be. — needs: []
4. Most households still eat their fill, though talk always turns to how long that will last. — needs: []

**surplus** (13)
0. Bread and broth are plentiful; few households go to bed hungry. — needs: [grain]
1. There is more than enough to eat, and nobody here goes to bed hungry. — needs: []
2. Food is plentiful, and a guest is fed without anyone counting the cost. — needs: []
3. Plain food is plentiful here, and second helpings are not begrudged. — needs: []
4. Most households eat well, and what is left over is shared or put by. — needs: []
5. The place grows more than it eats, and it shows in every household. — needs: [growsMore]
6. Fish is eaten fresh most days, and there is plenty of it. — needs: [fish]
7. There is fresh bread every day, and plenty of it to go round. — needs: [grain]
8. Milk, cheese and meat are common fare, and there is no shortage of any of them. — needs: [livestock]
9. The hunters bring in more than enough, and game is often in the pot. — needs: [game]
10. Flour from the mill is never short, and nobody goes without bread. — needs: [mill]
11. The place eats well and can afford to; even an ordinary supper has something extra in it. — needs: [prosperous]
12. Money is not plentiful here, but food is, and nobody goes short. — needs: [poor]

**adequate** (17)
0. Hearty grain bread and turnip-and-onion stews dominate the table; meat appears at festivals and on the wealthier streets. — needs: [grain, livestock, notSmall]
1. There is enough to eat, if nobody asks for much more than the day needs. — needs: []
2. Meals are plain and filling, and little goes to waste. — needs: []
3. Most households eat simply, and they eat enough. — needs: []
4. Food is steady rather than generous: enough for every household, with little to spare. — needs: []
5. The everyday fare is a simple stew and whatever else the day provides. — needs: []
6. A pot of stew over the fire is the usual supper, and there is usually enough to go round. — needs: []
7. Nobody here goes hungry, though few eat richly. — needs: [notProsperous]
8. Fish, fresh or dried, is the mainstay of most meals. — needs: [fish]
9. Bread is the mainstay of the table, with whatever else the household can add to it. — needs: [grain]
10. What the hunters bring home goes into the common pot, and it stretches a long way. — needs: [game]
11. Milk and cheese from the herds fill out plain meals. — needs: [livestock]
12. The grain is bought in rather than grown here, so bread is never wasted. — needs: [grainImport]
13. Flour comes from the mill, and the bread made from it is the backbone of most suppers. — needs: [mill]
14. The better-off eat well, and the rest eat plainly but enough. — needs: [notSmall]
15. Ordinary suppers here have a little more in them than plain fare elsewhere. — needs: [prosperous]
16. Money is short, so meals are plain, but nobody goes without. — needs: [poor]

**strained** (12)
0. Loaves shrink each month; householders stretch what they can. — needs: [grainHeld]
1. Food is tighter than it should be, and households stretch what they have. — needs: []
2. There is less to eat than people would like, and nothing is thrown away. — needs: []
3. Portions are small, and the stew is often thinner than anyone would like. — needs: []
4. Most households get by, but few have anything to spare at the end of the day. — needs: []
5. People make do with plain stew and whatever can be found to put in it. — needs: []
6. There is enough to keep going, but not enough to feel easy. — needs: []
7. Food costs more than most people can comfortably pay, so they buy less of it. — needs: [market]; houses: market
8. The catch does not go as far as it needs to, and fish is eaten sparingly. — needs: [fish]
9. Bread is eaten carefully, and not even the heel of the loaf is wasted. — needs: [grainHeld]
10. Even in comfortable households, the cooks count what goes into the pot. — needs: [prosperous]
11. Families here have little money, and they eat less than they would like. — needs: [poor]

**critical** (8)
0. Rations are tight; the poor eat watered stew and the well-off hoard quietly. — needs: []
1. Food is short, and many households go to bed hungry. — needs: []
2. Every meal is measured out, and the poorest eat least. — needs: []
3. There is not enough food to go round, and everyone knows it. — needs: []
4. Most households eat less than they need, and the children are fed first. — needs: []
5. The stew is thin and the bread is thinner. — needs: [grainHeld]
6. Food is short, and what can be bought costs more than most can pay. — needs: [market]; houses: market
7. The catch is too small to feed everyone, and fish is shared out carefully. — needs: [fish]

**collapsed** (4)
0. Hunger is everywhere. People queue at temple kitchens; rumors fly about caravans that never arrived. — needs: [sacred, route]; houses: sacred house
1. Hunger is everywhere, and every household is looking for its next meal. — needs: []
2. There is almost nothing left to eat, and the whole place is hungry. — needs: []
3. Food has all but run out, and people eat whatever they can find. — needs: []

## 2. commoner_resentments (public: crime-free)
BRANCHES RE-CUT: K and K7 (criminal opportunity) and `corruption_exposed` GO (rule 6; K and K7 move to the owner-only slot 2b, the
chair's ruling of 18:26; `corruption_exposed` is dead, 0 of 900, nothing written). The fallback "the small grievances of any town…" GOES:
false on 30/12/7-12 small places and the grievance is invented (rule 5); where no grievance holds the slot is EMPTY (probe: 19/9/7/35/34/26%,
which sits where today's fallback stood: 20/8/8/35/34/25). KEPT: `legitimacy` (public legitimacy strained, critical or collapsed, the band
`deriveCausalState().bands.public_legitimacy` today's branch reads), said of the body the record names: `{gov}` (the government label with
its article) or the kind's own noun gated on `rulerKindOf`/`rulingBodyOf` and the label (the elders, the headman, the mayor, the reeve,
the lord's steward, the council). `food` (food band strained+; "merchants", "prices", "stalls" only where `marketOf` holds; "bread" where
grain is held). ADDED: `uprising` from the fact home `facts/uprising.js` (`factsOf(r).uprising`: a live popular-uprising tension, the
common people pressing those in charge): 3/5/8/3/9/5%. Today's G and Fd texts kept at index 0 as whole sentences with their needs
(council; market + grainHeld). Additive as today, one sentence a branch.

WORDINGS (index 0 first; needs; houses):
**legitimacy** (14)
0. Commoners resent the council's indifference to ordinary complaints. — needs: [council]
1. Many here feel that {gov} no longer listens to people like them. — needs: [gov]
2. Ordinary people grumble that {gov} {gov|looks|look} after {gov|its|their} own first. — needs: [gov]
3. People bring their complaints to {gov} and expect little to come of them. — needs: [gov]
4. There is open doubt here about whether {gov} {gov|has|have} any right to decide for everyone. — needs: [gov]
5. People do as {gov} {gov|says|say}, but few of them think well of {gov|it|them}. — needs: [gov]
6. Few here would say that {gov} {gov|speaks|speak} for them. — needs: [gov]
7. Talk among neighbours turns, sooner or later, to what {gov} {gov|has|have} got wrong lately. — needs: [gov]
8. Common folk say the elders decide among themselves and tell everyone else afterwards. — needs: [elders]
9. People grumble that the headman listens to friends first and everyone else last. — needs: [headman]
10. The mayor is blamed for most of what goes wrong, fairly or not. — needs: [mayor]
11. People say the reeve they chose has forgotten who chose them. — needs: [reeve]
12. The lord's steward is obeyed, but not much liked. — needs: [steward]
13. People say the council is slow to listen and quick to decide without them. — needs: [council]

**food** (9)
0. Commoners resent rising bread prices and merchants who claim they cannot help it. — needs: [market, grainHeld]; houses: market
1. People grumble that there is less food to go round than there ought to be. — needs: []
2. Many feel that those in charge should be doing more to see everyone fed. — needs: []
3. Households that go short look hard at the ones that do not. — needs: []
4. Thin meals and short portions are the grievance nearly everyone shares. — needs: []
5. Nobody likes to see the pot so thin, and everyone has someone to blame for it. — needs: []
6. The price of food is the first complaint on everyone's lips. — needs: [market]; houses: market
7. People resent paying more for less, and they say so at the stalls. — needs: [market]; houses: market
8. People ask why {gov} cannot do more about the price of food. — needs: [gov, market]; houses: market

**uprising** (3)
0. Working people are pressing {gov} for a fairer deal, and they do not keep quiet about it. — needs: [gov]
1. The common people have demands of {gov}, and they want them heard. — needs: [gov]
2. Many here feel they have asked {gov} for fair treatment for long enough. — needs: [gov]

## 2b. commoner_resentments_dm (OWNER-ONLY; the chair's ruling of 18:26)
Never derived on a shared read: the deriver takes the audience and fails closed (the builder's wiring; I write only the lines). It
carries ONLY today's two crime clauses' meaning, by today's ladder on `deriveCausalState().scores.criminal_opportunity`: `crime70`
(>= 70, "the watch turning a blind eye") and else `crime55` (>= 55, "the smugglers … honest carts queue"). Every sentence frames a
grievance the commoners hold. "The watch" only where `defenceOf(r).watch` (narrower than `guardPresence`: the word is the watch's);
"those who keep order" where `guardPresence`; "carts queue"/"tax" (today's index 0) where `defenceOf(r).gate` and a trade route
(`factsOf(r).route`) stand; "the market"/"honest traders" where `marketOf`; "carriers … their turn" where a route stands; two
wordings a branch need nothing. Reach 0/0/0/1/0/0% (crime70), 7/7/2/7/17/17% (crime55). `corruption_exposed`: nothing (dead).

WORDINGS (index 0 first; needs; houses):
**crime70** (6)
0. Commoners resent the watch turning a blind eye to the right pockets. — needs: [watch]; houses: watch
1. Commoners grumble that the watch looks the other way when the right purse is opened. — needs: [watch]; houses: watch
2. People resent that those who keep order here seem to see only what suits them. — needs: [guard]; houses: guard force
3. Commoners say that wrongdoing goes unpunished here if the wrongdoer has the right friends. — needs: []
4. Ordinary folk resent that the law here bends for anyone with coin to spare. — needs: []
5. People grumble that honest folk are pressed hard while lawbreakers with money walk free. — needs: []

**crime55** (6)
0. Commoners resent the smugglers who pay no tax while honest carts queue. — needs: [gate, route]; houses: gate
1. Commoners resent the smugglers who slip goods past while honest traders pay their dues. — needs: [market]; houses: market
2. People grumble that smuggled goods undercut honest sellers at the market. — needs: [market]; houses: market
3. Honest carriers resent waiting their turn while smugglers come and go as they please. — needs: [route]
4. Commoners grumble that smugglers do well here while honest folk do not. — needs: []
5. People resent that smugglers seem to prosper while those who keep the rules go without. — needs: []

## 3. outsider_impressions
Three parts as today, each its own sentence. `power`: the dominant power (`deriveAllFactionProfiles`, highest power) named through the
possessive/article leaf; a VEILED power (`cardVeil.js :: isVeiledPower`, which covers a criminal power) is never named and the part is
dropped (probe: 1 town, as M1). Today's text kept at index 0 with NAMES-1's article ("Outsiders notice the Elder Council's mark is on
every door that matters."). `threat.<kind>.<form>`: the most severe OPEN threat above low, one plain pool per kind and form, need-gated:
`unrest.order` and `economic_collapse.supply` are the defence's ORDER and SUPPLY ratings (`defenseProfile.scores.internal < 50`,
`.economic < 40`, printed by the engine as "Civic stability at risk" and "Economic fragility"), said as what a visitor sees (little to
keep order; little laid by), with "the watch" only where `defenceOf(r).watch` and "no watchman" only where `guardPresence` fails;
monsters split by `config.monsterThreat` (overrun / frontier) and stressor; plague, famine, siege, bandit raids, a hostile neighbour,
arcane instability (magic). A hidden or rumoured threat is not seen by a visitor and is never said here. Today's T text ("… is the
obvious unspoken weight", a machine label) is NOT kept. `services.<lens>`: today's trigger (three or more of the nine capacities strained)
kept, but said of the first strained VISIBLE lens (`capacityModel.js :: VISIBLE_CAPACITY_LENSES`, the file's own rule that an
internal-only shortage never leaks into visible text), in the order healing, administrative, food, defence, magic, and defence skipped
when the threat part already said order. Where only internal lenses are strained, nothing is said (13/4/3/14/0/0%). Today's C text
("missing watch, slow service, or shuttered shops") NOT kept: a hedge the record cannot stand behind. `ordinary`: today's fallback kept at
index 0 (needs notSmall for "streets", sacred for "bells"); never taken on these 900.

WORDINGS (index 0 first; needs; houses):
**power** (12)
0. Outsiders notice {power's} mark is on every door that matters. — needs: []
1. A visitor soon learns that little happens here without {power}. — needs: []
2. Ask who decides things here, and the answer is {power}. — needs: []
3. Strangers with business here are sent to {power} sooner or later. — needs: []
4. It does not take a visitor long to see who holds sway here: {power}. — needs: []
5. Whatever a visitor wants done, {power} {power|has|have} a say in it. — needs: []
6. Visitors learn early that it pays to stay on good terms with {power}. — needs: []
7. The name a stranger hears most often in any dealing here is {power}. — needs: []
8. {Power} {power|carries|carry} the most weight here, and nobody pretends otherwise. — needs: []
9. Trade here runs through {power}, and anyone who deals in goods learns that quickly. — needs: [power.merchant, market]; houses: market
10. The faith is everywhere here, and {power} {power|is|are} plainly its voice. — needs: [power.religious, sacred]; houses: sacred house
11. Guards answering to {power} are among the first faces a visitor meets. — needs: [power.military, guard]; houses: guard force

**threat.unrest.order** (12)
0. There is little here to keep order, and a visitor can see it. — needs: []
1. Keeping the peace here rests on goodwill more than on any force. — needs: []
2. Order here is kept lightly, and a stranger notices how little stands behind it. — needs: []
3. Order here depends on people keeping it among themselves. — needs: []
4. The means of keeping order here are slight, and a visitor sees it soon enough. — needs: []
5. A visitor gets the sense that order here is kept by habit rather than by force. — needs: []
6. A visitor looks in vain for a watchman; there is none. — needs: [noGuard]
7. A visitor sees no one whose task it is to keep order. — needs: [noGuard]
8. Nobody here is paid to keep the peace, and it shows. — needs: [noGuard]
9. The watch is small for the ground it has to cover. — needs: [watch]; houses: watch
10. Few of the watch are about, and a visitor wonders how they keep order with so few. — needs: [watch]; houses: watch
11. Those who keep order here are spread thin, and a visitor can tell. — needs: [guard]; houses: guard force

**threat.unrest.void** (2)
0. The place has lost a leading figure, and visitors hear a good deal about who comes next. — needs: []
1. With a leading figure gone, a visitor finds people unsure whose word counts now. — needs: []

**threat.unrest.stressor** (2)
0. The place is unsettled, and a visitor feels it in the way people talk. — needs: []
1. Tempers are short here, and strangers are watched with some care. — needs: []

**threat.economic_collapse.supply** (4)
0. Little seems to be kept in store here, and a visitor notices how thin the stocks are. — needs: []
1. The place lives close to the bone, with not much laid by. — needs: []
2. A visitor can see there is little put by against a bad turn. — needs: []
3. Reserves here are thin, and people do not hide it. — needs: []

**threat.economic_collapse.route** (2)
0. A trade route the place relies on has been cut, and visitors hear about it at once. — needs: []
1. With a trade route cut, goods are scarce and a visitor notices the gaps. — needs: []

**threat.economic_collapse.stressor** (2)
0. Trade here is in a bad way, and a visitor can hear it in the quiet. — needs: []
1. Money is tight and business is slow, and it shows. — needs: []

**threat.monster_pressure.overrun** (6)
0. Every traveller who arrives here has something to say about the beasts in the country around. — needs: []
1. People here do not travel the country around alone, and they warn visitors not to either. — needs: []
2. The country around is overrun with beasts, and visitors are told so almost at once. — needs: []
3. Talk of beasts on the roads is the first thing a visitor hears. — needs: []
4. Visitors are asked which way they came, and whether they met anything on the way. — needs: []
5. People keep close to home here, for the country around is thick with beasts. — needs: []

**threat.monster_pressure.frontier** (7)
0. This is frontier country, and people speak of the wild beyond as close at hand. — needs: []
1. Visitors are told to keep to the roads and not to wander off them. — needs: []
2. People here keep an eye on the wild country and mention it often. — needs: []
3. The wild is not far off, and visitors hear stories of what comes out of it. — needs: []
4. Travellers here talk of beasts seen at the edge of the settled land. — needs: []
5. A visitor soon learns that the country beyond is not to be walked carelessly. — needs: []
6. Frontier habits show here: people go out in company and come back before dark. — needs: []

**threat.monster_pressure.stressor** (2)
0. There are beasts and raiders about, and visitors are warned to travel in company. — needs: []
1. People are wary of the roads, where beasts and raiders have both been seen. — needs: []

**threat.plague.any** (4)
0. There is sickness in the place, and visitors are kept at a polite distance. — needs: []
1. People here are wary of fevers, and a visitor who coughs is watched. — needs: []
2. A visitor notices doors kept shut and people keeping apart for fear of sickness. — needs: []
3. Sickness is about, and the healers have their hands full. — needs: [healer]; houses: healer or hospital

**threat.famine.any** (3)
0. Hunger is in the place, and a visitor sees it in thin faces. — needs: []
1. Food is short here, and nobody has much to spare for a stranger. — needs: []
2. Food is scarce, and a visitor is offered little and asked to pay well for it. — needs: [market]; houses: market

**threat.siege.any** (3)
0. The place is under siege, and every stranger is looked at twice. — needs: []
1. With enemies at hand, people here are tense and slow to trust a newcomer. — needs: []
2. The siege is the first thing anyone talks about, and the last. — needs: []

**threat.bandit_raids.any** (2)
0. People are wary of the roads, where raiders have been at work. — needs: []
1. Visitors are asked about the road and whether anyone followed them. — needs: []

**threat.rival_neighbor.any** (2)
0. There is bad blood with a neighbouring place, and it comes up in conversation soon enough. — needs: []
1. People here speak sharply of their neighbours, and visitors learn not to take sides. — needs: []

**threat.arcane_instability.any** (2)
0. People here are uneasy about magic, and a visitor notices how they speak of it. — needs: [magic]
1. Something is wrong with the magic here, and people would rather a visitor did not ask. — needs: [magic]

**services.healing** (10)
0. Anyone who falls ill here waits a long while to be seen. — needs: [healer]; houses: healer or hospital
1. The healers have more sick to see than they can manage. — needs: [healer]; houses: healer or hospital
2. There is no healer here, and the sick are nursed at home. — needs: [noHealer]
3. Nobody here heals by trade, and a visitor who falls ill must make do. — needs: [noHealer]
4. Care for the sick is short here, and people know better than to fall ill. — needs: []
5. The sick are not well provided for here, and a visitor notices it. — needs: []
6. Those who fall ill here cannot count on much care. — needs: []
7. Anyone who falls ill here is nursed by family, for there is no healer to send for. — needs: [noHealer]
8. A visitor who falls sick here will find no healer to call on. — needs: [noHealer]
9. Sickness is something people here deal with at home, as best they can. — needs: [noHealer]

**services.administrative** (7)
0. Getting an answer from {gov} takes patience, and a visitor needs plenty of it. — needs: [gov]
1. Business with {gov} moves slowly; there are more matters than hands to deal with them. — needs: [gov]
2. Petitions and permissions take a long time here, and visitors are told to wait. — needs: []
3. Any business with {gov} means a long wait, and visitors are warned of it. — needs: [gov]
4. Matters brought to {gov} pile up faster than they are settled. — needs: [gov]
5. Getting anything decided here takes time, for those who decide are few and busy. — needs: []
6. A visitor who needs a ruling or a permission should expect to wait for it. — needs: []

**services.food_production** (3)
0. Food is not plentiful, and a visitor is fed but not feasted. — needs: []
1. A visitor notices that food is counted carefully here. — needs: []
2. Visitors find food dear here, and portions smaller than they expected. — needs: [market]; houses: market

**services.defense** (3)
0. The watch is stretched thin, and a visitor can tell. — needs: [watch]; houses: watch
1. Nobody stands guard here, and a visitor walks in unchallenged. — needs: [noGuard]
2. Its defences are thin, and a visitor sees how little stands ready. — needs: []

**services.magical** (2)
0. Those who work magic here have more asked of them than they can give. — needs: [magic]
1. Magical help is hard to come by here, however much it is wanted. — needs: [magic]

**ordinary** (4)
0. The settlement reads to outsiders as ordinary. Quiet streets, predictable bells, faces that don't yet know yours. — needs: [notSmall, sacred]; houses: sacred house
1. Outsiders find the place ordinary: quiet, unremarkable, and in no hurry. — needs: []
2. Nothing about the place strikes a visitor as out of the way. — needs: []
3. A visitor finds nothing much to remark on, which suits the people here. — needs: []

## 4. unspoken_topics
The wound (`historyBeats.js :: deriveUnresolvedWound`: `history.currentTensions[0]`, its text from `.text`/`.description`/`.name`/`.label`)
is said BY WHAT IT IS: one pool per tension TYPE (`currentTensions[0].type`; the 29 types `data/historyData.js` can write), every wording
true of both the type's present form and its memory form (the descriptions in past tense the generator writes when the type's own event
is old: "The ruler of the time was aging or ill…"), and framed as what locals keep from strangers or out of company (several tensions are
"openly questioned" among the locals themselves). Needs where a wording names a house (guild, market). `crime_wave` and
`corruption_scandal` have NO pool (rule 6): the slot is EMPTY there (14/22/10/19/49/49%; `crime_wave` alone is 47-48% of cities and
metropolises). A string tension or an unknown type is EMPTY. Hidden or rumoured threats: only `arcane_instability` is said (a small
pool needing magic); corruption, cult and the unclassified kind are dropped (rule 6, no plain words); 0 places. The corruption clause is
dropped. Today's text (the machine label "the matter referenced as \"the wound\"") is NOT kept.

WORDINGS (index 0 first; needs; houses):
**wound.succession_crisis** (4)
0. Who should lead next is not something people discuss in front of strangers. — needs: []
1. Nobody raises the succession in company; everyone already has a side. — needs: []
2. Ask who will lead after the present rulers, and the talk turns to something else. — needs: []
3. The old quarrel over who should rule is not aired before outsiders. — needs: []

**wound.economic_disparity** (3)
0. How much richer the merchants have grown than the labourers is not a thing to raise in mixed company. — needs: [market]; houses: market
1. People keep quiet about who is getting richer and who is not, at least where they can be overheard. — needs: []
2. The gap between those who prosper and those who labour is felt by all and spoken of by few. — needs: []

**wound.religious_tension** (3)
0. Which faith is the true one is a question people here keep to themselves. — needs: []
1. Nobody argues about faith in company; the rivalry between the faiths runs too deep. — needs: []
2. Matters of faith are left alone in mixed company, and for good reason. — needs: []

**wound.guild_conflict** (6)
0. The quarrel between the guilds and those outside them is not raised where both can hear. — needs: [guild]; houses: guild
1. Who may sell what, and who gets a say in how the place is run, is argued in private, not in public. — needs: []
2. Traders here do not discuss the guild quarrel with customers, or with each other in public. — needs: [guild]; houses: guild
3. The fight over trading rights is something people would rather a stranger did not hear about. — needs: []
4. Nobody mentions the guilds' quarrel in company unless they want an argument. — needs: [guild]; houses: guild
5. Ask a trader here who may sell what, and the conversation goes quiet. — needs: []

**wound.external_threat** (3)
0. How the place should answer the danger it has been warned of is argued in private, not before strangers. — needs: []
1. Nobody here talks openly about whether to stand, bargain or leave if the danger comes. — needs: []
2. The warning of danger has split people, and they do not air the split in company. — needs: []

**wound.resource_scarcity** (5)
0. What the place is short of, and who is to blame for it, is not discussed with strangers. — needs: []
1. People do not talk openly about the shortage, least of all with outsiders. — needs: []
2. The shortage is on everyone's mind and on nobody's tongue when a stranger is near. — needs: []
3. Nobody asks a neighbour how they are managing for supplies; it is not a question to ask. — needs: []
4. What is running short here is a sore subject, and visitors are not told much about it. — needs: []

**wound.magical_controversy** (3)
0. How far magic should be allowed is a question people do not raise in company. — needs: []
1. Nobody wants to start the argument over magic again, so nobody mentions it. — needs: []
2. Talk of magic, and of who should be allowed to use it, is kept away from strangers. — needs: []

**wound.generational_divide** (3)
0. The young and the old disagree about how things should be done, and they keep the quarrel at home. — needs: []
1. Nobody sets the old ways against the new in mixed company; it only starts the quarrel again. — needs: []
2. What the young want to change is a sore subject, and the old do not discuss it with outsiders. — needs: []

**wound.outside_debt** (3)
0. The debt owed to an outside power is not mentioned in front of visitors. — needs: []
1. Nobody here likes to talk about what the place owes, or about who is coming to collect it. — needs: []
2. What is owed to outsiders, and what happens when it is called in, is spoken of quietly if at all. — needs: []

**wound.occupation_legacy** (3)
0. Who collaborated and who resisted during the occupation is never raised in company. — needs: []
1. The families who sided with the occupiers and those who fought them do not talk about it, least of all with strangers. — needs: []
2. Nobody asks a family here what it did during the occupation. — needs: []

**wound.infiltration_fear** (3)
0. Talk of enemy agents in the place is kept low, since nobody knows who is listening. — needs: []
1. People are careful what they say about spies, and to whom. — needs: []
2. Suspicion of hidden enemies runs deep, and nobody voices it in front of strangers. — needs: []

**wound.disputed_land** (3)
0. The old charter and the land it claims are not discussed with outsiders. — needs: []
1. Whose land is whose, under the old charter or the present holding, is a question nobody raises lightly. — needs: []
2. Nobody brings up the disputed land in company; both sides have a case and both know it. — needs: []

**wound.population_friction** (3)
0. The bad feeling between newcomers and the old families is not discussed in front of either. — needs: []
1. People here keep quiet about the newcomers, at least where the newcomers can hear. — needs: []
2. The friction between the established folk and the newer arrivals is felt more than it is spoken of. — needs: []

**wound.leadership_vacuum** (3)
0. Who will take a firm hold of the leadership is not a question asked aloud. — needs: []
1. Nobody here talks openly about the lack of anyone firmly in charge. — needs: []
2. The want of a strong hand at the top is felt by everyone and mentioned by few. — needs: []

**wound.market_crash** (3)
0. Talk of a coming crash is kept quiet, for fear that talk alone might bring it on. — needs: []
1. Nobody wants to be heard talking about the crash, in case the talk itself sets it off. — needs: []
2. Whether prices are about to fall is argued in private, never in front of buyers. — needs: [market]; houses: market

**wound.trade_collapse** (2)
0. The fate of the trade the place was built on is a sore subject, and strangers are not told much. — needs: []
1. Nobody here likes to talk about the trade the place has lived by, or how it has fared. — needs: []

**wound.great_fire** (3)
0. Fire is the fear here, and people would rather not speak of it. — needs: []
1. The old argument over fire, and who should bear the cost of preventing it, is not aired in company. — needs: []
2. Nobody here talks lightly about fire, or about the damage it can do. — needs: []

**wound.plague_years** (3)
0. Sickness, and who should be shut away when it comes, is not talked of before strangers. — needs: []
1. People here would rather not discuss fevers, or the quarrels they bring. — needs: []
2. The fear of sickness is real, but nobody speaks of it in company. — needs: []

**wound.great_flood** (3)
0. The water, and who must keep it back, is a quarrel nobody airs in front of outsiders. — needs: []
1. People here do not talk about the water if they can help it. — needs: []
2. Who lost what to the water, and who should pay to keep it back, is left unsaid in company. — needs: []

**wound.heresy_trial** (3)
0. The charge of heresy against a prominent figure is not discussed where the faithful can hear. — needs: []
1. Nobody takes sides on the heresy charge in public, whatever they think in private. — needs: []
2. The heresy accusation has split the faithful, and people keep their opinions to themselves. — needs: []

**wound.pilgrimage_surge** (3)
0. Whether the miracle was real is a question people do not raise with strangers. — needs: []
1. Nobody here argues about the miracle in company; feelings run too high. — needs: []
2. The claimed miracle is a sore subject here, and strangers are not told much about it. — needs: []

**wound.popular_uprising** (3)
0. How hard the common people should press those in charge is argued in private, not in public. — needs: []
1. Nobody talks openly about the people's grievances against those in charge, least of all to strangers. — needs: []
2. The quarrel between the common people and those who rule them is not aired in public. — needs: []

**wound.tyranny** (3)
0. Whether one person is taking too much power is said only behind closed doors. — needs: []
1. People here are careful how they speak of power and of who holds it. — needs: []
2. Talk of tyranny is kept low, and never in front of strangers. — needs: []

**wound.legitimacy_crisis** (4)
0. Whether those in charge have any right to rule is not argued in front of outsiders. — needs: []
1. People keep their doubts about the present rulers to themselves when strangers are near. — needs: []
2. The question of who has the right to rule here is not one to put to a local. — needs: []
3. Nobody here will tell a stranger what they think of the present authority. — needs: []

**wound.demographic_pressure** (2)
0. The newcomers, and the work and housing they compete for, are not discussed in front of them. — needs: []
1. Nobody here says aloud what they think of the newcomers and the work they take. — needs: []

**wound.trade_dispute** (2)
0. The quarrel over trade with the partner settlement is not discussed in front of its people. — needs: []
1. Nobody here talks openly about the terms of trade with their partner, or whether they are fair. — needs: []

**wound.wild_magic** (3)
0. The wild magic, and what it has done to the people it touched, is not spoken of with strangers. — needs: []
1. People here do not talk about the wild magic, and they do not like being asked. — needs: []
2. Those touched by the magic are not discussed in their hearing, or in a stranger's. — needs: []

**hidden.arcane_instability** (2)
0. Talk of magic going wrong is kept low, and never in front of strangers. — needs: [magic]
1. People here do not speak of the trouble with magic, whatever they suspect. — needs: [magic]

## 5. recent_changes
The three sources kept. (1) `beat`: the recent-disruption beat's own text, verbatim (period added if missing). (2) `condition.<archetype>`:
a condition new this turn (`duration.elapsedTicks < 2`, up to two as today), one pool per archetype of
`activeConditions.js :: CONDITION_ARCHETYPE_TEMPLATES` (all 46 listed; the 11 that occur on these 900 carry 3 wordings, the rest 2),
said from the archetype's own description in plain words. `corruption_exposed` and `regional_criminal_pressure` have NO pool (rule 6);
`custom_crisis` (its label and description are the authored stressor's) gets two wordings that name nothing of the stressor; an
archetype outside the catalogue says nothing. (3) `threat.<kind>.<form>.<stage>`: an acute OPEN threat (imminent or realized, up to two as today), one pool per
kind, form and stage, the imminent wordings saying it is close, the realized saying it has happened. (4) `calm`: only where none of the
three sources is held at all; today's fallback kept at index 0 (see FOR THE CHAIR 4 on "seasons"); where a source is held but none is
sayable (a crime condition alone) the slot is EMPTY, not calm (0/0/0/0/1/1%). Today's N and A texts ("… is the new shape of things",
"… has come to a head", engine labels) are NOT kept.

WORDINGS (index 0 first; needs; houses):
**condition.plague** (3)
0. A sickness has taken hold here, and it is still spreading. — needs: []
1. Sickness has broken out in the place, and more people are falling ill. — needs: []
2. A fever has begun to go round, and people are keeping their distance. — needs: []

**condition.famine** (3)
0. Food has become a public worry here, not just a private one. — needs: []
1. The shortage of food has grown into a trouble the whole place shares. — needs: []
2. Going hungry is no longer a private matter here; the whole place feels it. — needs: []

**condition.war_pressure** (3)
0. The war has begun to change how the place trades and what it expects of those in charge. — needs: []
1. Talk of the war has crept into every conversation, and the defences are being looked to. — needs: []
2. War is close enough now to be felt in everyday business and in the mood of the place. — needs: []

**condition.alliance_burden** (2)
0. Help sent to an ally has left the place short of what it needs at home. — needs: []
1. Aid for an ally is costing the place more than people expected. — needs: []

**condition.vassal_extraction** (3)
0. A stronger power has begun to draw wealth or men from the place, and the loss is felt. — needs: []
1. An overlord's demands have grown, and the place feels the draw on its purse. — needs: []
2. More of what the place earns now goes to the power above it. — needs: []

**condition.rebellion** (3)
0. Resistance to an overlord has begun to organise here. — needs: []
1. Some here have begun to organise against those who hold power over them. — needs: []
2. Open talk of resistance has started, and people are choosing sides. — needs: []

**condition.faction_challenge** (3)
0. A strong party has begun working to change who holds sway here. — needs: []
1. A challenge to the present rulers is under way, and people are watching to see how it goes. — needs: []
2. A major power in the place has begun moving against the present rulers. — needs: []

**condition.government_overthrown** (2)
0. Those who ruled here have been overthrown, and new masters are settling in. — needs: []
1. Power has just changed hands, and the new rulers are still finding their feet. — needs: []

**condition.coup_suppressed** (2)
0. An attempt to seize power has failed, and old scores are being settled. — needs: []
1. A grab for power was put down, and those who backed it are being rooted out. — needs: []

**condition.stressor_residual** (2)
0. A trouble that has passed has still left its marks on the place. — needs: []
1. The worst is over, but the place is still feeling the after-effects. — needs: []

**condition.custom_crisis** (2)
0. A crisis of its own has taken hold of the place. — needs: []
1. Something has gone badly wrong here, and the whole place is caught up in it. — needs: []

**condition.magical_instability** (2)
0. Magic here has started to misbehave: surging wild, failing, or falling silent. — needs: []
1. Magic in the place has begun to behave strangely, and nobody is sure why. — needs: []

**condition.trade_route_cut** (2)
0. A trade route the place depends on is no longer passable. — needs: []
1. One of the trade routes has been cut, and goods have stopped coming that way. — needs: []

**condition.regional_import_shortage** (2)
0. A supplier in the region can no longer send what the place needs. — needs: []
1. Goods the place relies on from elsewhere have become hard to get. — needs: []

**condition.regional_export_market_loss** (2)
0. A place that bought from here has stopped buying as much as it did. — needs: []
1. Buyers elsewhere are taking less of what the place sells. — needs: []

**condition.regional_route_disruption** (2)
0. Trouble along a connected route has begun to disrupt trade here. — needs: []
1. Trade coming in along the routes of the region has been disturbed. — needs: []

**condition.regional_authority_instability** (3)
0. Trouble in the place that governs this one is beginning to be felt here. — needs: []
1. The powers above the place are unsettled, and the uncertainty has reached here. — needs: []
2. Political trouble in a patron place has spilled over into local affairs. — needs: []

**condition.regional_tax_revenue_disruption** (3)
0. A place that owes dues here has stopped paying them reliably. — needs: []
1. Payments owed by a dependent place have become uncertain. — needs: []
2. Revenue the place counted on from a client has begun to fall short. — needs: []

**condition.regional_protection_gap** (2)
0. A protector the place relied on can no longer send help as it did. — needs: []
1. The ally that guarded the place is less able to do so. — needs: []

**condition.regional_service_disruption** (2)
0. A nearby place that provides services is under strain, and the effects reach here. — needs: []
1. Services the place gets from a neighbour have become unreliable. — needs: []

**condition.cold_war_sanctions** (2)
0. Inspections and embargoes have begun to squeeze everyday trade. — needs: []
1. Trade is being choked by sanctions and inspections. — needs: []

**condition.regional_conflict_pressure** (2)
0. Fighting elsewhere in the region has begun to spill over. — needs: []
1. Conflict nearby is putting pressure on the place. — needs: []

**condition.regional_migration_pressure** (3)
0. People driven from their homes elsewhere have started arriving here. — needs: []
1. A trouble nearby is sending people this way. — needs: []
2. Newcomers fleeing trouble elsewhere have begun to arrive. — needs: []

**condition.regional_information_shock** (2)
0. News and rumour from a neighbouring place have stirred up local politics. — needs: []
1. Word from a neighbouring place has unsettled opinion here. — needs: []

**condition.regional_religious_pressure** (3)
0. Religious trouble elsewhere is being felt in the place's own faith. — needs: []
1. Disputes of faith from elsewhere have reached here. — needs: []
2. What is happening in the faith elsewhere is being argued over here too. — needs: []

**condition.food_anchor_lost** (2)
0. A house the place depended on for food is gone. — needs: []
1. The place has lost one of the houses that fed it. — needs: []

**condition.dominant_npc_removed** (3)
0. A leading figure is gone, and who takes their place is not settled. — needs: []
1. The place has lost a leading figure, and nobody has yet filled the gap. — needs: []
2. With a leading figure gone, the question of who comes next is open. — needs: []

**condition.siege_lifted** (2)
0. The siege has ended, and the place is beginning to recover. — needs: []
1. The besiegers are gone, and the work of recovery has started. — needs: []

**condition.war_drain** (2)
0. Paying for the campaign abroad has begun to drain the place. — needs: []
1. The war abroad is costing more than the place can easily bear. — needs: []

**condition.army_deployed** (2)
0. The army has marched off to the war, and the place feels emptier for it. — needs: []
1. The standing army is away on campaign, and the home defence is thinner for it. — needs: []

**condition.war_exhaustion** (2)
0. A long war has left the place tired of fighting and short of means. — needs: []
1. The long war has worn the place down, and the will to fight is low. — needs: []

**condition.war_mobilization** (2)
0. The place has begun to put itself on a war footing. — needs: []
1. Work and money are being turned toward the coming campaign. — needs: []

**condition.reinforcement_cost** (2)
0. More men, coin and supplies are being sent to keep the army in the field. — needs: []
1. Keeping the army supplied at the front is draining the place. — needs: []

**condition.occupation_lifted** (2)
0. The occupation has ended, and the place is taking back its own affairs. — needs: []
1. The occupiers have gone, and local authority is being rebuilt. — needs: []

**condition.relief_burden** (2)
0. Marching to relieve a besieged ally is straining the place. — needs: []
1. Help sent to an ally under siege has stretched the place thin. — needs: []

**condition.trade_realignment** (2)
0. A new main supplier is changing how goods come into the place. — needs: []
1. Trade has begun to shift toward a new supplier. — needs: []

**condition.vassal_trade_coercion** (2)
0. The overlord now dictates what the place may trade, and the local economy feels it. — needs: []
1. Trade here is now set by the overlord's orders, not by the place itself. — needs: []

**condition.trade_embargo** (2)
0. A key supplier has stopped trading with the place, and the loss is felt everywhere. — needs: []
1. An embargo has cut off goods the place depends on. — needs: []

**condition.occupation_resistance** (2)
0. Resistance to the occupiers has started to organise. — needs: []
1. Sabotage and quiet refusal are making the occupiers' work harder. — needs: []

**condition.occupation_burden** (2)
0. Holding on to conquered places is tying down the strength of this one. — needs: []
1. Keeping hold of conquered places is beginning to tell on the place. — needs: []

**condition.war_spoils** (2)
0. Tribute and spoils from conquered places have started coming in. — needs: []
1. The war has begun to pay, in tribute and plunder. — needs: []

**condition.reconstruction** (2)
0. Rebuilding has begun after the calamity, and the work is going on everywhere. — needs: []
1. The work of rebuilding is under way, and everyone has a hand in it. — needs: []

**condition.boom** (2)
0. Trade and plenty have tipped the place into good times. — needs: []
1. Business is booming, and the place is busier than it has been. — needs: []

**condition.flourishing** (2)
0. A long peace has let the place settle into a quiet golden age. — needs: []
1. Times are good, and people have the leisure to make and enjoy fine things. — needs: []

**threat.unrest.order.imminent** (12)
0. Keeping order now rests on too few shoulders, and people are aware of it. — needs: []
1. There is little now to keep a quarrel from turning into something worse. — needs: []
2. Order is holding, but only just, and there is little to hold it with. — needs: []
3. Those in charge have few means of keeping order, and everyone knows it. — needs: []
4. The peace here is fragile, and it would not take much to break it. — needs: []
5. Order here now hangs on people keeping their tempers. — needs: []
6. There is not much to keep the peace with, and people know it. — needs: []
7. Little stands ready to keep order if a quarrel turns ugly. — needs: []
8. Keeping the peace has come to depend on goodwill alone. — needs: [noGuard]
9. People are keeping the peace among themselves, with nobody else to do it. — needs: [noGuard]
10. The watch is too few for what is asked of it, and order is fragile. — needs: [watch]; houses: watch
11. Keeping order has become hard work for the few who do it. — needs: [guard]; houses: guard force

**threat.unrest.order.realized** (8)
0. Order has frayed: there is next to nothing here to keep the peace. — needs: []
1. Order now depends on each household minding its own. — needs: []
2. Keeping order is beyond what the place can manage at present. — needs: []
3. Order has worn thin, and nobody is placed to mend it. — needs: []
4. Quarrels are settled, when they are settled at all, with nobody to stand between. — needs: []
5. Keeping the peace has fallen to the households themselves. — needs: [noGuard]
6. There is no one to keep order here but the people themselves. — needs: [noGuard]
7. The watch can no longer keep order on its own. — needs: [watch]; houses: watch

**threat.unrest.void.imminent** (2)
0. With a leading figure gone, order is under strain. — needs: []
1. The loss of a leading figure has left a gap nobody has filled, and it shows. — needs: []

**threat.unrest.void.realized** (2)
0. With a leading figure gone, nobody is quite in control of things. — needs: []
1. The gap left by a leading figure has thrown the place into confusion. — needs: []

**threat.unrest.stressor.imminent** (2)
0. The place is unsettled, and tempers are short. — needs: []
1. Unrest is stirring, and people expect trouble before long. — needs: []

**threat.unrest.stressor.realized** (2)
0. Unrest has broken out, and it has not yet died down. — needs: []
1. The place is in uproar, and those in charge are struggling to calm it. — needs: []

**threat.economic_collapse.supply.imminent** (4)
0. There is little laid by, and a bad turn would be felt at once. — needs: []
1. The place lives from hand to mouth, with nothing much put aside. — needs: []
2. Little is held in reserve, and people know how thin the margin is. — needs: []
3. The place has few reserves to fall back on if trouble comes. — needs: []

**threat.economic_collapse.supply.realized** (3)
0. The place has next to nothing in reserve, and every household feels it. — needs: []
1. There is nothing laid by; the place lives from one day to the next. — needs: []
2. Reserves are all but gone, and nobody can say how the place would weather a blow. — needs: []

**threat.economic_collapse.route.imminent** (2)
0. Trade is close to breaking down, and money is getting scarce. — needs: []
1. The trade the place relies on is faltering badly. — needs: []

**threat.economic_collapse.route.realized** (2)
0. Trade has all but stopped, and money is short everywhere. — needs: []
1. The trade the place relied on has broken down. — needs: []

**threat.economic_collapse.stressor.imminent** (2)
0. Trade is close to breaking down, and money is getting scarce. — needs: []
1. Business is failing, and people fear for their livelihoods. — needs: []

**threat.economic_collapse.stressor.realized** (2)
0. Trade has all but stopped, and money is short everywhere. — needs: []
1. The trade the place lives by has collapsed. — needs: []

**threat.monster_pressure.overrun.imminent** (2)
0. Beasts are pressing close to the place, and people are uneasy. — needs: []
1. More beasts are being seen near the place than anyone likes. — needs: []

**threat.monster_pressure.overrun.realized** (5)
0. Beasts have overrun the country around, and nobody travels alone any more. — needs: []
1. The country around is overrun with beasts, and the roads are dangerous. — needs: []
2. Beasts now roam the country around, and people keep close to home. — needs: []
3. Travel has become dangerous: the land around is thick with beasts. — needs: []
4. People go out only in company now, for the beasts are everywhere. — needs: []

**threat.monster_pressure.frontier.imminent** (2)
0. Beasts from the wild are coming closer, and people are uneasy. — needs: []
1. More beasts are being seen at the edge of the settled land than anyone likes. — needs: []

**threat.monster_pressure.frontier.realized** (2)
0. Beasts from the wild have come right up to the place. — needs: []
1. The wild has pressed in, and beasts are seen close by. — needs: []

**threat.monster_pressure.stressor.imminent** (2)
0. Beasts and raiders are pressing close, and people are uneasy. — needs: []
1. More beasts and raiders are about than anyone likes. — needs: []

**threat.monster_pressure.stressor.realized** (2)
0. Beasts and raiders have struck, and the roads are no longer safe. — needs: []
1. The country around is in the hands of beasts and raiders. — needs: []

**threat.plague.any.imminent** (3)
0. A sickness is close to taking hold, and people are wary of every fever. — needs: []
1. There is sickness about, and it is getting close to a real outbreak. — needs: []
2. Sickness is spreading, and the healers fear it will get worse. — needs: [healer]; houses: healer or hospital

**threat.plague.any.realized** (2)
0. Sickness has broken out in earnest, and few households are untouched. — needs: []
1. The sickness is everywhere now, and the sick are many. — needs: []

**threat.famine.any.imminent** (2)
0. Food is close to running out, and every household is counting what it has. — needs: []
1. Hunger is close, and people are eating as little as they can. — needs: []

**threat.famine.any.realized** (2)
0. Hunger has arrived, and many households now go without. — needs: []
1. There is no longer enough food, and people are going hungry. — needs: []

**threat.siege.any.imminent** (2)
0. An enemy is close, and the place is preparing for a siege. — needs: []
1. A siege is expected, and people are getting ready for it. — needs: []

**threat.siege.any.realized** (2)
0. The place is under siege, and nothing comes in or goes out freely. — needs: []
1. The enemy is at hand, and the place is shut in. — needs: []

**threat.bandit_raids.any.imminent** (2)
0. Raiders have been seen nearby, and people are wary. — needs: []
1. Raiders are close, and the roads are being watched. — needs: []

**threat.bandit_raids.any.realized** (2)
0. Raiders have struck the place, and people are counting the cost. — needs: []
1. The raiders have come, and the roads are no longer safe. — needs: []

**threat.rival_neighbor.any.imminent** (2)
0. Relations with a neighbouring place have soured to the edge of open conflict. — needs: []
1. The quarrel with a neighbour is close to breaking into the open. — needs: []

**threat.rival_neighbor.any.realized** (2)
0. The quarrel with a neighbouring place has broken into the open. — needs: []
1. Hostility with a neighbour is now open and acknowledged. — needs: []

**threat.arcane_instability.any.imminent** (2)
0. Magic in the place is close to going badly wrong. — needs: [magic]
1. The magic here has grown unsteady, and people are wary of it. — needs: [magic]

**threat.arcane_instability.any.realized** (2)
0. Magic in the place has gone badly wrong. — needs: [magic]
1. The magic here has broken loose, and nobody knows how to settle it. — needs: [magic]

**calm** (8)
0. The last few seasons have run their usual course. No notable shifts in the rhythm of the place. — needs: []
1. Nothing much has changed here lately; the days go on as they always have. — needs: []
2. Life goes on as usual, and nobody can point to anything new. — needs: []
3. It has been a quiet stretch, with nothing out of the ordinary to report. — needs: []
4. Little has changed of late, and nobody is asking for it to. — needs: []
5. The place has gone about its business without upset for some while now. — needs: []
6. There is no news to speak of; things go on much as before. — needs: []
7. Nothing new has disturbed the ordinary run of things. — needs: []

## HOUSES EACH WORDING NEEDS (rule 6; for the security reader at the join). No wording needs a hideable house or any crime fact (public slots).
Every house is read from the LIVE roster through its fact home: `marketOf` (a black market is not one), `factsOf.sacredHouse`,
`factsOf.guild` (non-criminal only), `defenceOf().watch/.gate/.healer/.hospital`, `factsOf.guardPresence`.
- food_culture: market — strained#7, critical#6; sacred house — collapsed#0.
- commoner_resentments: market — food#0, #6, #7, #8.
- commoner_resentments_dm (owner-only): watch — crime70#0, #1; guard force — crime70#2; gate (+ a trade route) — crime55#0; market — crime55#1, #2.
- outsider_impressions: market — power#9, threat.famine.any#2, services.food_production#2; sacred house — power#10, ordinary#0;
  guard force — power#11, threat.unrest.order#11; watch — threat.unrest.order#9, #10, services.defense#0; healer or hospital —
  threat.plague.any#3, services.healing#0, #1.
- unspoken_topics: market — wound.economic_disparity#0, wound.market_crash#2; guild — wound.guild_conflict#0, #2, #4.
- recent_changes: watch — threat.unrest.order.imminent#10, threat.unrest.order.realized#7; guard force — threat.unrest.order.imminent#11;
  healer or hospital — threat.plague.any.imminent#2.

## FOR THE CHAIR (my recommendation after each)
1. THE BEAT'S OWN TEXT BREAKS RULE 7 AND READS AS ENGINE PROSE. The brief keeps `recentDisruption`'s text verbatim; it carries "(N years
   ago)" on every place that has it (63/81/81/79/66/73%) and opens "As of the founding survey, …" on 31/21/32/27/19/23%, sometimes with
   "What it left behind (…) is still part of the place."; on 2 towns it quotes a stored "walls" line the battery flags, on 7 places it names
   corruption (record text, rule 6). None is my wording; the probe counts it apart. RECOMMEND: either a small pool that says the beat by
   its event name (`references.eventName`: "The Great Fire is still being felt here.") with no age, or a ruling that the beat's text stands.
2. UNSPOKEN IS EMPTY ON HALF THE CITIES (49%) because their wound is the crime wave. RECOMMEND either keep it (rule 6 as written), or let
   a crime wound fall to the next tension the pools can say (`currentTensions[1…]`, all record-held): EMPTY would be 13/20/3/11/1/1%
   (probe section 5, measured, not wired). The owner-only crime slot could also carry the crime wave as the DM's line.
3. THE TWO DEFENCE RATINGS ARE STANDING FACTS, NOT CHANGES. `unrest.order` and `economic_collapse.supply` are ratings of what keeps order
   and what is laid by; they are "acute" on 98/99/99% of thorps-villages, so recent_changes there nearly always says one. My wordings say
   the state ("Order is holding, but only just…") rather than an event. RECOMMEND: the chair decides whether recent_changes should take
   only `activeConditions`/stressor threats (the ratings would then speak only in outsider_impressions).
4. TODAY'S INDEX-0 TEXTS WITH A TIME WORD: food strained "Loaves shrink each month" and the calm "The last few seasons …" are kept at index 0
   as true (no season or date is named). If rule 7 is read strictly, drop both (each branch keeps >= the bar without them).
5. JUDGEMENT CALLS, vetoable: `infiltration_fear` (enemy agents) is said: spying is not a crime fact in rule 6's list; the dominant power is
   dropped (not replaced by the next) when veiled; a condition outside the catalogue says nothing; `custom_crisis` gets two wordings that
   name nothing of the authored stressor; food "turnip-and-onion" / "festivals" / "hoard quietly" are today's untestable words kept at
   index 0.
6. NO ATOM-WANTED: every need above reads an existing home or a named field.

## CONFIRMED vs PLAUSIBLE
CONFIRMED (executed, `probe.2.out.txt`, fresh births): the shares, empties, branch minima and the 0 false lines above, by the tests
named in the probe (every M1 clause test, the declared needs, the word tests, the coherence battery on the slot text as if stored).
PLAUSIBLE (read, not run): that a wording is true beyond what its tests can check (manner of eating, what a visitor "notices"); that
the memory-form tensions read naturally with the shared wordings; the wiring itself (the audience gate of the `_dm` slot, the joins).
