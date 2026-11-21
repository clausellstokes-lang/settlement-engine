# FOR THE OWNER — the Defense tab's safety line, sentence by sentence (PLACE-1, merged at 95a9887e1)

Each block is one sentence slot of the safety line. The first sentence is the one every place printed before; the others are the new wordings a place may now print instead, each chosen by a fixed hash of the place's seed (no new randomness; a saved town keeps its stored line). Where a wording needs a fact (a garrison, a market, walls), it prints only where the place has it.

## Small place (thorp, hamlet), a moderate reading

Before (every place): "The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of."

Now also:
- "Everyone here knows everyone, so what trouble there is is hard to hide."
- "In a place this small, a wrong done is known to all by nightfall."
- "Order here rests with the neighbours: little happens that someone does not see."
- "The households look out for one another, and a quarrel or a theft is soon talked of."
- "Strangers are noticed here, and so is anything that goes missing."
- "People here watch over one another's doors, and word of any trouble travels fast."
- "If real trouble comes, the militia turns out; day to day, the neighbours watch one another."  (needs: militia)
- "Few strangers come this far, and the neighbours keep an eye on one another."  (needs: route: isolated)
- "A place this size has few secrets, and what trouble there is soon comes out."
- "A wrong done here is a wrong done to neighbours, and it is not soon forgotten."
- "Every household knows the others' business, which keeps most quarrels small."
- "Little here goes unnoticed for long; the neighbours see to that."
- "Trouble here is settled among neighbours, mostly before it grows."
- "Folk here look in on one another, and what one household sees, the next soon hears."
- "There are few places here to do wrong unseen."

## Village and larger, moderate: the opening sentence

Before (every place): "A mix of safer and more exposed areas."

Now also:
- "Some parts of the place are safer than others."
- "Safety here depends on where you are, and when."
- "Most of the place is safe enough, though not all of it."
- "The busy ways are safe enough; the edges less so."
- "Some quarters are safer than others."  (needs: tier: ≥ town)
- "The market and the busy streets are safe enough; other parts less so."  (needs: market, tier: ≥ village)
- "Order holds in most of the place, but not everywhere."
- "It is safer here by day than by night."
- "The well-used parts of the place are the better kept; the outskirts less so."
- "Most trouble here keeps to the edges and the late hours."

## Village and larger, moderate: the force sentence (garrison)

Before (every place): "The garrison patrols the main paths; quieter spots after dark carry genuine risk."

Now also:
- "The garrison patrols the main streets; the quiet ones after dark carry real risk."  (needs: garrison, tier: ≥ village)
- "Soldiers of the garrison walk the main streets; the back ways are riskier after dark."  (needs: garrison, tier: ≥ village)
- "The garrison keeps the main thoroughfares; away from them, after dark, the risk is real."  (needs: garrison)
- "The garrison and the watch share the main streets; the quiet ones after dark are less safe."  (needs: garrison, watch, tier: ≥ village)
- "The garrison holds the gates and patrols the main streets; quieter spots after dark carry real risk."  (needs: garrison, gate, tier: ≥ village)
- "By day the garrison is seen on every main street; after dark, the quieter spots carry genuine risk."  (needs: garrison, force walks by day, tier: ≥ village)
- "The garrison patrols the market and the main streets; elsewhere, after dark, there is genuine risk."  (needs: garrison, market, tier: ≥ village)
- "Garrison soldiers keep to the main streets; the side lanes after dark are riskier."  (needs: garrison, tier: ≥ village)
- "The garrison's presence is felt on the main ways; off them, after dark, the risk is real."  (needs: garrison)

## Village and larger, moderate: the force sentence (watch)

Before (every place): "The watch covers the main paths; quieter spots after dark carry genuine risk."

Now also:
- "The watch covers the main streets; the quiet ones after dark carry real risk."  (needs: watch, tier: ≥ village)
- "The watch keeps to the main streets; the side lanes after dark are another matter."  (needs: watch, tier: ≥ village)
- "Watchmen walk the main streets; away from them, after dark, the risk is real."  (needs: watch, tier: ≥ village)
- "The watch holds the gates and walks the main streets; quieter spots after dark carry real risk."  (needs: watch, gate, tier: ≥ village)
- "The watch is seen on the main streets by day; quieter spots after dark carry genuine risk."  (needs: watch, force walks by day, tier: ≥ village)
- "The watch keeps an eye on the market and the main streets; quieter spots after dark carry genuine risk."  (needs: watch, market, tier: ≥ village)
- "The watch makes its rounds of the main streets; past them, after dark, the risk is real."  (needs: watch, tier: ≥ village)
- "The main ways are the watch's; the lanes beside them after dark are not."  (needs: watch)

## Village and larger, moderate: the force sentence (militia)

Before (every place): "Militia volunteers patrol the main paths; quieter spots after dark carry genuine risk."

Now also:
- "Volunteers of the militia walk the main paths; the quieter spots after dark are riskier."  (needs: militia)
- "The militia keeps an eye on the main paths; away from them, after dark, the risk is real."  (needs: militia)
- "Militia volunteers look out along the main paths; quieter spots after dark carry real risk."  (needs: militia)

## Village and larger, moderate: the force sentence (none)

Before (every place): "Locals watch over the main paths; quieter spots after dark carry genuine risk."

Now also:
- "Neighbours look out along the main paths; away from them, after dark, there is real risk."
- "The people who live along the main paths watch them; quieter spots after dark are less safe."
- "Locals watch over the main ways themselves; after dark, the quieter spots carry genuine risk."
- "The villagers keep an eye on the main paths; the quiet spots after dark carry real risk."  (needs: tier: village)
- "Stallholders and neighbours keep an eye on the market and the main paths; quieter spots after dark carry genuine risk."  (needs: market)
- "Locals keep an eye on the road through and the main paths; quieter spots after dark carry real risk."  (needs: route: road)
- "Locals keep an eye on the crossroads and the main paths; quieter spots after dark carry real risk."  (needs: route: crossroads)
- "Most comings and goings on the main paths are seen by someone; the quieter spots after dark are less safe."
- "Doors and windows face the main paths, and someone is usually looking out; the dark spots off them are another matter."
- "By day little passes on the main paths unseen; after dark, the quieter spots carry real risk."

## Village and larger, moderate: the residents sentence

Before (every place): "Residents know which corners to avoid."

Now also:
- "People who live here know where not to go."
- "Locals know which lanes to keep out of."  (needs: tier: ≥ village)
- "Those who live here soon learn where not to linger."
- "Most people here know where trouble is likely, and keep clear of it."
- "The people here know their own streets, and which to keep away from."  (needs: tier: ≥ village)
- "Residents give the worst corners a wide berth."
- "Anyone who lives here can say which ways are best avoided."
- "Locals can tell a newcomer which places to steer clear of."
- "Those born here know which turnings to leave alone after dark."
- "Residents keep to the places they know once night falls."
- "Ask anyone who lives here, and they will name the spots to avoid."
- "Long-time residents know the risky spots, and keep away from them."

## Moderate: the walls note

Before (every place): "The walls keep the trouble inside, off the roads beyond."

Now also:
- "The palisade keeps out what comes from beyond; what trouble there is starts within."  (needs: palisade)
- "Behind the palisade, what trouble there is comes from within."  (needs: palisade)
- "The walls see to what comes from outside; what trouble there is starts at home."  (needs: walls)
- "The walls keep the outside out; the trouble there is starts within."  (needs: walls)
- "The gates are watched, so trouble from outside rarely gets in; what there is starts within."  (needs: gate, guardPresence)
- "The walls see to the approaches; the risk that remains is within."  (needs: walls)
- "Whoever comes in passes the gates; the trouble that remains is the place's own."  (needs: gate)
- "The garrison keeps the walls; within them, the risk is the place's own."  (needs: walls, garrison)

## Unsafe with a garrison: the opening

Before (every place): "Crime is a persistent and visible problem."

Now also:
- "Crime here is common, and nobody pretends otherwise."
- "Crime here is common and out in the open."
- "Crime here is steady and out in the open."

## Unsafe with a garrison: the garrison sentence

Before (every place): "The garrison is overwhelmed or corrupt."

Now also:
- "The garrison cannot keep up with it, or has stopped trying."  (needs: garrison)
- "The garrison is too stretched, or too easily bought, to stop it."  (needs: garrison)
- "Neither the garrison nor the watch keeps pace with it."  (needs: garrison, watch)

## Unsafe: the advice

Before (every place): "Travelers are advised to move in groups and keep valuables hidden."

Now also:
- "Visitors are told to keep together and keep their purses out of sight."
- "Newcomers learn quickly to go about in company and show nothing worth taking."
- "In the market, people keep a hand on their purses and go in company."  (needs: market)

## Unsafe: the walls note

Before (every place): "Walls slow entry but don't solve what happens inside them."

Now also:
- "The walls keep out what comes from beyond, not what is already within."  (needs: walls)
- "The gates are kept, but the trouble is already inside."  (needs: gate, guardPresence)

## Measured, the chair's census, 100 places a size (the commonest WHOLE line's places / places holding the line)

Before (43ab0f5eb): thorp 48/100 | hamle 48/100 | villa 56/100 | town 43/100 | city 58/100 | metro 66/100

After (95a9887e1): thorp 6/100 | hamle 8/100 | villa 5/100 | town 5/100 | city 5/100 | metro 7/100

The commonest single SENTENCE, on 150 places a size, share of all places (the builder's spread test): before 67/64/69/73/58/67%; after 6.7/8.0/10.0/12.0/10.0/12.0% (thorp to metropolis).
