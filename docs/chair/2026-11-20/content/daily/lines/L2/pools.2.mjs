/**
 * DAILY-1 · L2 — THE POOLS (data only; read by probe.2.mjs and transcribed in LINES-2.md).
 * Five slots: food_culture, commoner_resentments, outsider_impressions, unspoken_topics, recent_changes.
 *
 * A wording is { t, needs, houses? }: `t` the text (placeholders below), `needs` the record tests (keys of the probe's
 * NEEDS table, each read from a fact home or the named nearest field), `houses` the house kinds it names (for the
 * security reader). Index 0 of a branch is TODAY'S text where it can be true (its needs declared); a branch whose
 * today's text is false or a machine label starts with a new line (LINES-2.md says which).
 *
 * Placeholders (filled by the probe through the power-name leaf, src/data/people/powerSentenceName.js):
 *   {gov} / {Gov}       the government label with its article: powerNameWithArticle(powerStructure.government[, true])
 *   {power} / {Power}   the dominant power (not veiled) with its article: powerNameWithArticle(name[, true])
 *   {power's}           its possessive with the article: `the ${powerPossessive(powerNameAfterArticle(name))}`
 *   {gov|one|many}, {power|one|many}   the verb or pronoun in the name's number: fillAgreement
 */

const w = (t, needs = [], houses = []) => Object.freeze({ t, needs: Object.freeze(needs), houses: Object.freeze(houses) });

// ───────────────────────────── food_culture ─────────────────────────────
export const FOOD = Object.freeze({
  // the surplus band under a famine or a siege (today's twin rule, BAR5-WORLD)
  'surplus.wanting': [
    w('The stores still hold: bread and broth reach most tables, and the households count what is left.', ['grain', 'stores']),
    w('There is still enough in store for now, but every household is careful with what it has.', ['stores']),
    w('The place still eats from what was put by, and nobody wastes a crumb of it.', ['stores']),
    w('Food is not short yet, but people eat as if it soon might be.'),
    w('Most households still eat their fill, though talk always turns to how long that will last.'),
  ],
  surplus: [
    w('Bread and broth are plentiful; few households go to bed hungry.', ['grain']),
    w('There is more than enough to eat, and nobody here goes to bed hungry.'),
    w('Food is plentiful, and a guest is fed without anyone counting the cost.'),
    w('Plain food is plentiful here, and second helpings are not begrudged.'),
    w('Most households eat well, and what is left over is shared or put by.'),
    w('The place grows more than it eats, and it shows in every household.', ['growsMore']),
    w('Fish is eaten fresh most days, and there is plenty of it.', ['fish']),
    w('There is fresh bread every day, and plenty of it to go round.', ['grain']),
    w('Meat is common fare here, and there is no shortage of it.', ['livestock']),
    w('The hunters bring in more than enough, and game is often in the pot.', ['game']),
    w('Flour from the mill is never short, and nobody goes without bread.', ['mill']),
    w('The place eats well and can afford to; even an ordinary supper has something extra in it.', ['prosperous']),
    w('Money is not plentiful here, but food is, and nobody goes short.', ['poor']),
  ],
  adequate: [
    w('Hearty grain bread and turnip-and-onion stews dominate the table; meat appears at festivals and on the wealthier streets.', ['grain', 'livestock', 'notSmall']),
    w('There is enough to eat, if nobody asks for much more than the day needs.'),
    w('Meals are plain and filling, and little goes to waste.'),
    w('Most households eat simply, and they eat enough.'),
    w('Food is steady rather than generous: enough for every household, with little to spare.'),
    w('The everyday fare is a simple stew and whatever else the day provides.'),
    w('A pot of stew over the fire is the usual supper, and there is usually enough to go round.'),
    w('Nobody here goes hungry, though few eat richly.', ['notProsperous']),
    w('Fish, fresh or dried, is the mainstay of most meals.', ['fish']),
    w('Bread is the mainstay of the table, with whatever else the household can add to it.', ['grain']),
    w('What the hunters bring home goes into the common pot, and it stretches a long way.', ['game']),
    w('What the herds give fills out plain meals.', ['livestock']),
    w('The grain is bought in rather than grown here, so bread is never wasted.', ['grainImport']),
    w('Flour comes from the mill, and the bread made from it is the backbone of most suppers.', ['mill']),
    w('The better-off eat well, and the rest eat plainly but enough.', ['notSmall']),
    w('Ordinary suppers here have a little more in them than plain fare elsewhere.', ['prosperous']),
    w('Money is short, so meals are plain, but nobody goes without.', ['poor']),
  ],
  strained: [
    w('Food is tighter than it should be, and households stretch what they have.'),
    w('There is less to eat than people would like, and nothing is thrown away.'),
    w('Portions are small, and the stew is often thinner than anyone would like.'),
    w('Most households get by, but few have anything to spare at the end of the day.'),
    w('People make do with plain stew and whatever can be found to put in it.'),
    w('There is enough to keep going, but not enough to feel easy.'),
    w('Food costs more than most people can comfortably pay, so they buy less of it.', ['market'], ['market']),
    w('The catch does not go as far as it needs to, and fish is eaten sparingly.', ['fish']),
    w('Bread is eaten carefully, and not even the heel of the loaf is wasted.', ['grainHeld']),
    w('Even in comfortable households, the cooks count what goes into the pot.', ['prosperous']),
    w('Families here have little money, and they eat less than they would like.', ['poor']),
  ],
  critical: [
    w('Rations are tight, and the poor eat watered stew.'),
    w('Food is short, and many households go to bed hungry.'),
    w('Every meal is measured out, and the poorest eat least.'),
    w('There is not enough food to go round, and everyone knows it.'),
    w('Most households eat less than they need, and the children are fed first.'),
    w('The stew is thin and the bread is thinner.', ['grainHeld']),
    w('Food is short, and what can be bought costs more than most can pay.', ['market'], ['market']),
    w('The catch is too small to feed everyone, and fish is shared out carefully.', ['fish']),
  ],
  collapsed: [
    w('Hunger is everywhere. People queue at temple kitchens; rumors fly about caravans that never arrived.', ['sacred', 'route'], ['sacred house']),
    w('Hunger is everywhere, and every household is looking for its next meal.'),
    w('There is almost nothing left to eat, and the whole place is hungry.'),
    w('Food has all but run out, and people eat whatever they can find.'),
  ],
});

// ───────────────────────────── commoner_resentments ─────────────────────────────
export const COMMONER = Object.freeze({
  // public legitimacy strained, critical or collapsed (deriveCausalState().bands.public_legitimacy), said of the body the record names
  legitimacy: [
    w("Commoners resent the council's indifference to ordinary complaints.", ['council']),
    w('Many here feel that {gov} no longer listens to people like them.', ['gov']),
    w('Ordinary people grumble that {gov} {gov|looks|look} after {gov|its|their} own first.', ['gov']),
    w('People bring their complaints to {gov} and expect little to come of them.', ['gov']),
    w('There is open doubt here about whether {gov} {gov|has|have} any right to decide for everyone.', ['gov', 'legitimacyGrave']),
    w('People do as {gov} {gov|says|say}, but few of them think well of {gov|it|them}.', ['gov']),
    w('Few here would say that {gov} {gov|speaks|speak} for them.', ['gov']),
    w('Talk among neighbours turns, sooner or later, to what {gov} {gov|has|have} got wrong lately.', ['gov']),
    w('Common folk say the elders decide among themselves and tell everyone else afterwards.', ['elders']),
    w('People grumble that the headman listens to friends first and everyone else last.', ['headman']),
    w('The mayor is blamed for most of what goes wrong, fairly or not.', ['mayor']),
    w('People say the reeve they chose has forgotten who chose them.', ['reeve']),
    w("The lord's steward is obeyed, but not much liked.", ['steward']),
    w('People say the council is slow to listen and quick to decide without them.', ['council']),
  ],
  // the food band strained, critical or collapsed (capacity.food_production, as today)
  food: [
    w('Commoners resent rising bread prices and merchants who claim they cannot help it.', ['market', 'grainHeld'], ['market']),
    w('People grumble that there is less food to go round than there ought to be.'),
    w('Many feel that those in charge should be doing more to see everyone fed.'),
    w('Households that go short look hard at the ones that do not.'),
    w('Thin meals and short portions are the grievance nearly everyone shares.'),
    w('Nobody likes to see the pot so thin, and everyone has someone to blame for it.'),
    w("The price of food is the first complaint on everyone's lips.", ['market'], ['market']),
    w('People resent paying more for less, and they say so at the stalls.', ['market'], ['market']),
    w('People ask why {gov} cannot do more about the price of food.', ['gov', 'market'], ['market']),
  ],
  // a live popular-uprising tension (factsOf(r).uprising, facts/uprising.js)
  uprising: [
    w('Working people are pressing {gov} for a fairer deal, and they do not keep quiet about it.', ['gov']),
    w('The common people have demands of {gov}, and they want them heard.', ['gov']),
    w('Many here feel they have asked {gov} for fair treatment for long enough.', ['gov']),
  ],
});

// ───────────────────────────── commoner_resentments_dm (OWNER-ONLY; the chair's ruling of 18:26) ─────────────────────────────
// Never derived on a shared read (the deriver takes the audience and fails closed). Carries ONLY today's two crime clauses'
// meaning: deriveCausalState().scores.criminal_opportunity >= 70 (crime70) or else >= 55 (crime55), as today's ladder.
// corruption_exposed is dead (0 of 900): nothing is written for it.
export const COMMONER_DM = Object.freeze({
  crime70: [
    w('Commoners resent the watch turning a blind eye to the right pockets.', ['watch'], ['watch']),
    w('Commoners grumble that the watch looks the other way when the right purse is opened.', ['watch'], ['watch']),
    w('People resent that those who keep order here seem to see only what suits them.', ['guard'], ['guard force']),
    w('Commoners say that wrongdoing goes unpunished here if the wrongdoer has the right friends.'),
    w('Ordinary folk resent that the law here bends for anyone with coin to spare.'),
    w('People grumble that honest folk are pressed hard while lawbreakers with money walk free.'),
  ],
  crime55: [
    w('Commoners resent the smugglers who pay no tax while honest carts queue.', ['smuggling', 'gate', 'route'], ['gate', 'a smuggling house where the record names one']),
    w('Commoners resent the smugglers who slip goods past while honest traders pay their dues.', ['smuggling', 'market'], ['market', 'a smuggling house where the record names one']),
    w('People grumble that smuggled goods undercut honest sellers at the market.', ['smuggling', 'market'], ['market', 'a smuggling house where the record names one']),
    w('Honest carriers resent waiting their turn while smugglers come and go as they please.', ['smuggling', 'route'], ['a smuggling house where the record names one']),
    w('People grumble that those who break the rules do better here than those who keep them.'),
    w('Honest folk say that crime pays better here than work.'),
    w('People resent how little is done about wrongdoing that everyone knows of.'),
  ],
});

// ───────────────────────────── outsider_impressions ─────────────────────────────
export const OUTSIDER = Object.freeze({
  // the dominant power (highest power of deriveAllFactionProfiles), never a veiled one (cardVeil.js :: isVeiledPower), only where it
  // clearly leads (L2b, ruling 4a: power.level below)
  power: [
    w("Outsiders notice {power's} mark is on every door that matters."),
    w('A visitor soon learns that little happens here without {power}.'),
    w('Ask who decides things here, and the answer is {power}.'),
    w('Strangers with business here are sent to {power} sooner or later.'),
    w('It does not take a visitor long to see who holds sway here: {power}.'),
    w('Whatever a visitor wants done, {power} {power|has|have} a say in it.'),
    w('Visitors learn early that it pays to stay on good terms with {power}.'),
    w('The name a stranger hears most often in any dealing here is {power}.'),
    w('{Power} {power|carries|carry} the most weight here, and nobody pretends otherwise.'),
    w('Trade here runs through {power}, and anyone who deals in goods learns that quickly.', ['power.merchant', 'market'], ['market']),
    w('The faith is everywhere here, and {power} {power|is|are} plainly its voice.', ['power.religious', 'sacred'], ['sacred house']),
    w('Guards answering to {power} are among the first faces a visitor meets.', ['power.military', 'guard'], ['guard force']),
  ],
  // L2b (the chair's ruling 4a): where the top power does not clearly lead (leaderLead.js :: leaderLeadOfRecord(r).leadOverSecond <= 6,
  // the threshold factionStanding.js holds before "No one clearly leads here")
  'power.level': [
    w('Ask who decides things here, and a visitor hears more than one name.'),
    w('No single name comes up first when a visitor asks who holds sway here.'),
  ],
  // the most severe OPEN threat that is not a defence RATING (L2b, ruling 3), band above low, said as an outsider sees it; one pool per kind (and form)
  'threat.unrest.void': [ // a Leadership void condition (dominant_npc_removed)
    w('The place has lost a leading figure, and visitors hear a good deal about who comes next.'),
    w('With a leading figure gone, a visitor finds people unsure whose word counts now.'),
  ],
  'threat.unrest.stressor': [
    w('The place is unsettled, and a visitor feels it in the way people talk.'),
    w('Tempers are short here, and strangers are watched with some care.'),
  ],
  'threat.economic_collapse.route': [ // a trade_route_cut condition
    w('A trade route the place relies on has been cut, and visitors hear about it at once.'),
    w('With a trade route cut, goods are scarce and a visitor notices the gaps.'),
  ],
  'threat.economic_collapse.stressor': [
    w('Trade here is in a bad way, and a visitor can hear it in the quiet.'),
    w('Money is tight and business is slow, and it shows.'),
  ],
  'threat.monster_pressure.overrun': [ // config.monsterThreat 'plagued' ("Region overrun with monsters")
    w('Every traveller who arrives here has something to say about the beasts in the country around.'),
    w('People here do not travel the country around alone, and they warn visitors not to either.'),
    w('The country around is overrun with beasts, and visitors are told so almost at once.'),
    w('Talk of beasts on the roads is the first thing a visitor hears.'),
    w('Visitors are asked which way they came, and whether they met anything on the way.'),
    w('People keep close to home here, for the country around is thick with beasts.'),
  ],
  'threat.monster_pressure.frontier': [ // config.monsterThreat 'frontier' ("Frontier monster pressure")
    w('This is frontier country, and people speak of the wild beyond as close at hand.'),
    w('Visitors are told to keep to the roads and not to wander off them.'),
    w('People here keep an eye on the wild country and mention it often.'),
    w('The wild is not far off, and visitors hear stories of what comes out of it.'),
    w('Travellers here talk of beasts seen at the edge of the settled land.'),
    w('A visitor soon learns that the country beyond is not to be walked carelessly.'),
    w('Frontier habits show here: people go out in company and come back before dark.'),
  ],
  'threat.monster_pressure.stressor': [
    w('There are beasts and raiders about, and visitors are warned to travel in company.'),
    w('People are wary of the roads, where beasts and raiders have both been seen.'),
  ],
  'threat.plague.any': [
    w('There is sickness in the place, and visitors are kept at a polite distance.'),
    w('People here are wary of fevers, and a visitor who coughs is watched.'),
    w('A visitor notices doors kept shut and people keeping apart for fear of sickness.'),
    w('Sickness is about, and the healers have their hands full.', ['healer'], ['healer or hospital']),
  ],
  'threat.famine.any': [
    w('Hunger is in the place, and a visitor sees it in thin faces.'),
    w('Food is short here, and nobody has much to spare for a stranger.'),
    w('Food is scarce, and a visitor is offered little and asked to pay well for it.', ['market'], ['market']),
  ],
  'threat.siege.any': [
    w('The place is under siege, and every stranger is looked at twice.'),
    w('With enemies at hand, people here are tense and slow to trust a newcomer.'),
    w('The siege is the first thing anyone talks about, and the last.'),
  ],
  'threat.bandit_raids.any': [
    w('People are wary of the roads, where raiders have been at work.'),
    w('Visitors are asked about the road and whether anyone followed them.'),
  ],
  'threat.rival_neighbor.any': [
    w('There is bad blood with a neighbouring place, and it comes up in conversation soon enough.'),
    w('People here speak sharply of their neighbours, and visitors learn not to take sides.'),
  ],
  'threat.arcane_instability.any': [
    w('People here are uneasy about magic, and a visitor notices how they speak of it.', ['magic']),
    w('Something is wrong with the magic here, and people would rather a visitor did not ask.', ['magic']),
  ],
  // L2b (the chair's ruling 4b): a strained VISIBLE lens (capacityModel.js :: VISIBLE_CAPACITY_LENSES) chosen BY THE KEYED PICK
  // ('<name>::dailyLife.outsider_impressions::second'): at a place with a real threat among its strained visible lenses where three or
  // more of the nine are strained (today's trigger); at a place with no real threat among its strained visible lenses AND `ordinary`
  'services.healing': [
    w('Anyone who falls ill here waits a long while to be seen.', ['healer'], ['healer or hospital']),
    w('The healers have more sick to see than they can manage.', ['healer'], ['healer or hospital']),
    w('There is no healer here, and the sick are nursed at home.', ['noHealer']),
    w('Nobody here heals by trade, and a visitor who falls ill must make do.', ['noHealer']),
    w('Care for the sick is short here, and people know better than to fall ill.'),
    w('The sick are not well provided for here, and a visitor notices it.'),
    w('Those who fall ill here cannot count on much care.'),
    w('Anyone who falls ill here is nursed by family, for there is no healer to send for.', ['noHealer']),
    w('A visitor who falls sick here will find no healer to call on.', ['noHealer']),
    w('Sickness is something people here deal with at home, as best they can.', ['noHealer']),
  ],
  'services.administrative': [
    w('Getting an answer from {gov} takes patience, and a visitor needs plenty of it.', ['gov']),
    w('Business with {gov} moves slowly; there are more matters than hands to deal with them.', ['gov']),
    w('Petitions and permissions take a long time here, and visitors are told to wait.'),
    w('Any business with {gov} means a long wait, and visitors are warned of it.', ['gov']),
    w('Matters brought to {gov} pile up faster than they are settled.', ['gov']),
    w('Getting anything decided here takes time, for those who decide are few and busy.'),
    w('A visitor who needs a ruling or a permission should expect to wait for it.'),
  ],
  'services.food_production': [
    w('Food is not plentiful, and a visitor is fed but not feasted.'),
    w('A visitor notices that food is counted carefully here.'),
    w('Visitors find food dear here, and portions smaller than they expected.', ['market'], ['market']),
  ],
  'services.defense': [
    w('The watch is stretched thin, and a visitor can tell.', ['watch'], ['watch']),
    w('Nobody stands guard here, and a visitor walks in unchallenged.', ['noGuard']),
    w('Its defences are thin, and a visitor sees how little stands ready.'),
    // L2b (the chair's ruling 3): the ORDER lines, folded in from the retired threat branch, said only when the defence lens is strained
    w('There is little here to keep order, and a visitor can see it.'),
    w('Keeping the peace here rests on goodwill more than on any force.'),
    w('Order here is kept lightly, and a stranger notices how little stands behind it.'),
    w('Order here depends on people keeping it among themselves.'),
    w('The means of keeping order here are slight, and a visitor sees it soon enough.'),
    w('A visitor gets the sense that order here is kept by habit rather than by force.'),
    w('A visitor looks in vain for a watchman; there is none.', ['noGuard']),
    w('A visitor sees no one whose task it is to keep order.', ['noGuard']),
    w('Nobody here is paid to keep the peace, and it shows.', ['noGuard']),
    w('The watch is small for the ground it has to cover.', ['watch'], ['watch']),
    w('Few of the watch are about, and a visitor wonders how they keep order with so few.', ['watch'], ['watch']),
    w('Those who keep order here are spread thin, and a visitor can tell.', ['guard'], ['guard force']),
  ],
  'services.magical': [
    w('Those who work magic here have more asked of them than they can give.', ['magic']),
    w('Magical help is hard to come by here, however much it is wanted.', ['magic']),
  ],
  // L2b (ruling 4b): one of the keyed options of the second part at a place with no real threat
  ordinary: [
    w("The settlement reads to outsiders as ordinary. Quiet streets, predictable bells, faces that don't yet know yours.", ['notSmall', 'sacred'], ['sacred house']),
    w('Outsiders find the place ordinary: quiet, unremarkable, and in no hurry.'),
    w('Nothing about the place strikes a visitor as out of the way.'),
    w('A visitor finds nothing much to remark on, which suits the people here.'),
  ],
});

// ───────────────────────────── unspoken_topics ─────────────────────────────
// The wound (historyBeats.js :: deriveUnresolvedWound = history.currentTensions[0]) said BY WHAT IT IS: one pool per tension
// type, each wording true of the type's present form and its memory form. crime_wave and corruption_scandal have NO pool
// (rule 6: a crime fact): the slot is EMPTY there. A type with no pool is EMPTY.
export const UNSPOKEN = Object.freeze({
  'wound.succession_crisis': [
    w('Who should lead next is not something people discuss in front of strangers.'),
    w('Nobody raises the succession in company; everyone already has a side.'),
    w('Ask who will lead after the present rulers, and the talk turns to something else.'),
    w('The old quarrel over who should rule is not aired before outsiders.'),
  ],
  'wound.economic_disparity': [
    w('How much richer the merchants have grown than the labourers is not a thing to raise in mixed company.', ['market'], ['market']),
    w('People keep quiet about who is getting richer and who is not, at least where they can be overheard.'),
    w('The gap between those who prosper and those who labour is felt by all and spoken of by few.'),
  ],
  'wound.religious_tension': [
    w('Which faith is the true one is a question people here keep to themselves.'),
    w('Nobody argues about faith in company; the rivalry between the faiths runs too deep.'),
    w('Matters of faith are left alone in mixed company, and for good reason.'),
  ],
  'wound.guild_conflict': [
    w('The quarrel between the guilds and those outside them is not raised where both can hear.', ['guild'], ['guild']),
    w('Who may sell what, and who gets a say in how the place is run, is argued in private, not in public.'),
    w('Traders here do not discuss the guild quarrel with customers, or with each other in public.', ['guild'], ['guild']),
    w('The fight over trading rights is something people would rather a stranger did not hear about.'),
    w("Nobody mentions the guilds' quarrel in company unless they want an argument.", ['guild'], ['guild']),
    w('Ask a trader here who may sell what, and the conversation goes quiet.'),
  ],
  'wound.external_threat': [
    w('How the place should answer the danger it has been warned of is argued in private, not before strangers.'),
    w('Nobody here talks openly about whether to stand, bargain or leave if the danger comes.'),
    w('The warning of danger has split people, and they do not air the split in company.'),
  ],
  'wound.resource_scarcity': [
    w('What the place is short of, and who is to blame for it, is not discussed with strangers.'),
    w('People do not talk openly about the shortage, least of all with outsiders.'),
    w("The shortage is on everyone's mind and on nobody's tongue when a stranger is near."),
    w('Nobody asks a neighbour how they are managing for supplies; it is not a question to ask.'),
    w('What is running short here is a sore subject, and visitors are not told much about it.'),
  ],
  'wound.magical_controversy': [
    w('How far magic should be allowed is a question people do not raise in company.'),
    w('Nobody wants to start the argument over magic again, so nobody mentions it.'),
    w('Talk of magic, and of who should be allowed to use it, is kept away from strangers.'),
  ],
  'wound.generational_divide': [
    w('The young and the old disagree about how things should be done, and they keep the quarrel at home.'),
    w('Nobody sets the old ways against the new in mixed company; it only starts the quarrel again.'),
    w('What the young want to change is a sore subject, and the old do not discuss it with outsiders.'),
  ],
  'wound.outside_debt': [
    w('The debt owed to an outside power is not mentioned in front of visitors.'),
    w('Nobody here likes to talk about what the place owes, or about who is coming to collect it.'),
    w('What is owed to outsiders, and what happens when it is called in, is spoken of quietly if at all.'),
  ],
  'wound.occupation_legacy': [
    w('Who collaborated and who resisted during the occupation is never raised in company.'),
    w('The families who sided with the occupiers and those who fought them do not talk about it, least of all with strangers.'),
    w('Nobody asks a family here what it did during the occupation.'),
  ],
  'wound.infiltration_fear': [
    w('Talk of enemy agents in the place is kept low, since nobody knows who is listening.'),
    w('People are careful what they say about spies, and to whom.'),
    w('Suspicion of hidden enemies runs deep, and nobody voices it in front of strangers.'),
  ],
  'wound.disputed_land': [
    w('The old charter and the land it claims are not discussed with outsiders.'),
    w('Whose land is whose, under the old charter or the present holding, is a question nobody raises lightly.'),
    w('Nobody brings up the disputed land in company; both sides have a case and both know it.'),
  ],
  'wound.population_friction': [
    w('The bad feeling between newcomers and the old families is not discussed in front of either.'),
    w('People here keep quiet about the newcomers, at least where the newcomers can hear.'),
    w('The friction between the established folk and the newer arrivals is felt more than it is spoken of.'),
  ],
  'wound.leadership_vacuum': [
    w('Who will take a firm hold of the leadership is not a question asked aloud.'),
    w('Nobody here talks openly about the lack of anyone firmly in charge.'),
    w('The want of a strong hand at the top is felt by everyone and mentioned by few.'),
  ],
  'wound.market_crash': [
    w('Talk of a coming crash is kept quiet, for fear that talk alone might bring it on.'),
    w('Nobody wants to be heard talking about the crash, in case the talk itself sets it off.'),
    w('Whether prices are about to fall is argued in private, never in front of buyers.', ['market'], ['market']),
  ],
  'wound.trade_collapse': [
    w('The fate of the trade the place was built on is a sore subject, and strangers are not told much.'),
    w('Nobody here likes to talk about the trade the place has lived by, or how it has fared.'),
  ],
  'wound.great_fire': [
    w('Fire is the fear here, and people would rather not speak of it.'),
    w('The old argument over fire, and who should bear the cost of preventing it, is not aired in company.'),
    w('Nobody here talks lightly about fire, or about the damage it can do.'),
  ],
  'wound.plague_years': [
    w('Sickness, and who should be shut away when it comes, is not talked of before strangers.'),
    w('People here would rather not discuss fevers, or the quarrels they bring.'),
    w('The fear of sickness is real, but nobody speaks of it in company.'),
  ],
  'wound.great_flood': [
    w('The water, and who must keep it back, is a quarrel nobody airs in front of outsiders.'),
    w('People here do not talk about the water if they can help it.'),
    w('Who lost what to the water, and who should pay to keep it back, is left unsaid in company.'),
  ],
  'wound.heresy_trial': [
    w('The charge of heresy against a prominent figure is not discussed where the faithful can hear.'),
    w('Nobody takes sides on the heresy charge in public, whatever they think in private.'),
    w('The heresy accusation has split the faithful, and people keep their opinions to themselves.'),
  ],
  'wound.pilgrimage_surge': [
    w('Whether the miracle was real is a question people do not raise with strangers.'),
    w('Nobody here argues about the miracle in company; feelings run too high.'),
    w('The claimed miracle is a sore subject here, and strangers are not told much about it.'),
  ],
  'wound.popular_uprising': [
    w('How hard the common people should press those in charge is argued in private, not in public.'),
    w("Nobody talks openly about the people's grievances against those in charge, least of all to strangers."),
    w('The quarrel between the common people and those who rule them is not aired in public.'),
  ],
  'wound.tyranny': [
    w('Whether one person is taking too much power is said only behind closed doors.'),
    w('People here are careful how they speak of power and of who holds it.'),
    w('Talk of tyranny is kept low, and never in front of strangers.'),
  ],
  'wound.legitimacy_crisis': [
    w('Whether those in charge have any right to rule is not argued in front of outsiders.'),
    w('People keep their doubts about the present rulers to themselves when strangers are near.'),
    w('The question of who has the right to rule here is not one to put to a local.'),
    w('Nobody here will tell a stranger what they think of the present authority.'),
  ],
  'wound.demographic_pressure': [
    w('The newcomers, and the work and housing they compete for, are not discussed in front of them.'),
    w('Nobody here says aloud what they think of the newcomers and the work they take.'),
  ],
  'wound.trade_dispute': [
    w('The quarrel over trade with the partner settlement is not discussed in front of its people.'),
    w('Nobody here talks openly about the terms of trade with their partner, or whether they are fair.'),
  ],
  'wound.wild_magic': [
    w('The wild magic, and what it has done to the people it touched, is not spoken of with strangers.'),
    w('People here do not talk about the wild magic, and they do not like being asked.'),
    w("Those touched by the magic are not discussed in their hearing, or in a stranger's."),
  ],
});

// ───────────────────────────── recent_changes ─────────────────────────────
// (1) the recent-disruption beat BY ITS EVENT'S NAME (L2b; was its own text, verbatim); (2) a condition new this turn (elapsedTicks < 2), one pool per
// archetype of CONDITION_ARCHETYPE_TEMPLATES (corruption_exposed and regional_criminal_pressure have NO pool: rule 6);
// (3) an acute OPEN threat, one pool per kind, form and stage (imminent, realized); (4) the calm pool.
export const RECENT = Object.freeze({
  'condition.plague': [
    w('A sickness has taken hold here, and it is still spreading.'),
    w('Sickness has broken out in the place, and more people are falling ill.'),
    w('A fever has begun to go round, and people are keeping their distance.'),
  ],
  'condition.famine': [
    w('Food has become a public worry here, not just a private one.'),
    w('The shortage of food has grown into a trouble the whole place shares.'),
    w('Going hungry is no longer a private matter here; the whole place feels it.'),
  ],
  'condition.war_pressure': [
    w('The war has begun to change how the place trades and what it expects of those in charge.'),
    w('Talk of the war has crept into every conversation, and the defences are being looked to.'),
    w('War is close enough now to be felt in everyday business and in the mood of the place.'),
  ],
  'condition.alliance_burden': [
    w('Help sent to an ally has left the place short of what it needs at home.'),
    w('Aid for an ally is costing the place more than people expected.'),
  ],
  'condition.vassal_extraction': [
    w('A stronger power has begun to draw wealth or men from the place, and the loss is felt.'),
    w("An overlord's demands have grown, and the place feels the draw on its purse."),
    w('More of what the place earns now goes to the power above it.'),
  ],
  'condition.rebellion': [
    w('Resistance to an overlord has begun to organise here.'),
    w('Some here have begun to organise against those who hold power over them.'),
    w('Open talk of resistance has started, and people are choosing sides.'),
  ],
  'condition.faction_challenge': [
    w('A strong party has begun working to change who holds sway here.'),
    w('A challenge to the present rulers is under way, and people are watching to see how it goes.'),
    w('A major power in the place has begun moving against the present rulers.'),
  ],
  'condition.government_overthrown': [
    w('Those who ruled here have been overthrown, and new masters are settling in.'),
    w('Power has just changed hands, and the new rulers are still finding their feet.'),
  ],
  'condition.coup_suppressed': [
    w('An attempt to seize power has failed, and old scores are being settled.'),
    w('A grab for power was put down, and those who backed it are being rooted out.'),
  ],
  'condition.stressor_residual': [
    w('A trouble that has passed has still left its marks on the place.'),
    w('The worst is over, but the place is still feeling the after-effects.'),
  ],
  'condition.custom_crisis': [
    w('A crisis of its own has taken hold of the place.'),
    w('Something has gone badly wrong here, and the whole place is caught up in it.'),
  ],
  'condition.magical_instability': [
    w('Magic here has started to misbehave, and nobody trusts it to work as it should.'),
    w('Magic in the place has begun to behave strangely, and nobody is sure why.'),
  ],
  'condition.trade_route_cut': [
    w('A trade route the place depends on is no longer passable.'),
    w('One of the trade routes has been cut, and goods have stopped coming that way.'),
  ],
  'condition.regional_import_shortage': [
    w('A supplier in the region can no longer send what the place needs.'),
    w('Goods the place relies on from elsewhere have become hard to get.'),
  ],
  'condition.regional_export_market_loss': [
    w('A place that bought from here has stopped buying as much as it did.'),
    w('Buyers elsewhere are taking less of what the place sells.'),
  ],
  'condition.regional_route_disruption': [
    w('Trouble along a connected route has begun to disrupt trade here.'),
    w('Trade coming in along the routes of the region has been disturbed.'),
  ],
  'condition.regional_authority_instability': [
    w('Trouble in the place that governs this one is beginning to be felt here.'),
    w('The powers above the place are unsettled, and the uncertainty has reached here.'),
    w('Political trouble in a patron place has spilled over into local affairs.'),
  ],
  'condition.regional_tax_revenue_disruption': [
    w('A place that owes dues here has stopped paying them reliably.'),
    w('Payments owed by a dependent place have become uncertain.'),
    w('Revenue the place counted on from a client has begun to fall short.'),
  ],
  'condition.regional_protection_gap': [
    w('A protector the place relied on can no longer send help as it did.'),
    w('The ally that guarded the place is less able to do so.'),
  ],
  'condition.regional_service_disruption': [
    w('A nearby place that provides services is under strain, and the effects reach here.'),
    w('Services the place gets from a neighbour have become unreliable.'),
  ],
  'condition.cold_war_sanctions': [
    w('Inspections and embargoes have begun to squeeze everyday trade.'),
    w('Trade is being choked by sanctions and inspections.'),
  ],
  'condition.regional_conflict_pressure': [
    w('Fighting elsewhere in the region has begun to spill over.'),
    w('Conflict nearby is putting pressure on the place.'),
  ],
  'condition.regional_migration_pressure': [
    w('People driven from their homes elsewhere have started arriving here.'),
    w('A trouble nearby is sending people this way.'),
    w('Newcomers fleeing trouble elsewhere have begun to arrive.'),
  ],
  'condition.regional_information_shock': [
    w('News and rumour from a neighbouring place have stirred up local politics.'),
    w('Word from a neighbouring place has unsettled opinion here.'),
  ],
  'condition.regional_religious_pressure': [
    w("Religious trouble elsewhere is being felt in the place's own faith."),
    w('Disputes of faith from elsewhere have reached here.'),
    w('What is happening in the faith elsewhere is being argued over here too.'),
  ],
  'condition.food_anchor_lost': [
    w('A house the place depended on for food is gone.'),
    w('The place has lost one of the houses that fed it.'),
  ],
  'condition.dominant_npc_removed': [
    w('A leading figure is gone, and who takes their place is not settled.'),
    w('The place has lost a leading figure, and nobody has yet filled the gap.'),
    w('With a leading figure gone, the question of who comes next is open.'),
  ],
  'condition.siege_lifted': [
    w('The siege has ended, and the place is beginning to recover.'),
    w('The besiegers are gone, and the work of recovery has started.'),
  ],
  'condition.war_drain': [
    w('Paying for the campaign abroad has begun to drain the place.'),
    w('The war abroad is costing more than the place can easily bear.'),
  ],
  'condition.army_deployed': [
    w('The army has marched off to the war, and the place feels emptier for it.'),
    w('The standing army is away on campaign, and the home defence is thinner for it.'),
  ],
  'condition.war_exhaustion': [
    w('A long war has left the place tired of fighting and short of means.'),
    w('The long war has worn the place down, and the will to fight is low.'),
  ],
  'condition.war_mobilization': [
    w('The place has begun to put itself on a war footing.'),
    w('Work and money are being turned toward the coming campaign.'),
  ],
  'condition.reinforcement_cost': [
    w('More men, coin and supplies are being sent to keep the army in the field.'),
    w('Keeping the army supplied at the front is draining the place.'),
  ],
  'condition.occupation_lifted': [
    w('The occupation has ended, and the place is taking back its own affairs.'),
    w('The occupiers have gone, and local authority is being rebuilt.'),
  ],
  'condition.relief_burden': [
    w('Marching to relieve a besieged ally is straining the place.'),
    w('Help sent to an ally under siege has stretched the place thin.'),
  ],
  'condition.trade_realignment': [
    w('A new main supplier is changing how goods come into the place.'),
    w('Trade has begun to shift toward a new supplier.'),
  ],
  'condition.vassal_trade_coercion': [
    w('The overlord now dictates what the place may trade, and the local economy feels it.'),
    w("Trade here is now set by the overlord's orders, not by the place itself."),
  ],
  'condition.trade_embargo': [
    w('A key supplier has stopped trading with the place, and the loss is felt everywhere.'),
    w('An embargo has cut off goods the place depends on.'),
  ],
  'condition.occupation_resistance': [
    w('Resistance to the occupiers has started to organise.'),
    w("Sabotage and quiet refusal are making the occupiers' work harder."),
  ],
  'condition.occupation_burden': [
    w('Holding on to conquered places is tying down the strength of this one.'),
    w('Keeping hold of conquered places is beginning to tell on the place.'),
  ],
  'condition.war_spoils': [
    w('Tribute and spoils from conquered places have started coming in.'),
    w('The war has begun to pay, in tribute and plunder.'),
  ],
  'condition.reconstruction': [
    w('Rebuilding has begun after the calamity, and the work is going on everywhere.'),
    w('The work of rebuilding is under way, and everyone has a hand in it.'),
  ],
  'condition.boom': [
    w('Trade and plenty have tipped the place into good times.'),
    w('Business is booming, and the place is busier than it has been.'),
  ],
  'condition.flourishing': [
    w('A long peace has let the place settle into a quiet golden age.'),
    w('Times are good, and people have the leisure to make and enjoy fine things.'),
  ],
  // acute threats (currentStage imminent or realized), open only
  'threat.unrest.void.imminent': [
    w('With a leading figure gone, order is under strain.'),
    w('The loss of a leading figure has left a gap nobody has filled, and it shows.'),
  ],
  'threat.unrest.void.realized': [
    w('With a leading figure gone, nobody is quite in control of things.'),
    w('The gap left by a leading figure has thrown the place into confusion.'),
  ],
  'threat.unrest.stressor.imminent': [
    w('The place is unsettled, and tempers are short.'),
    w('Unrest is stirring, and people expect trouble before long.'),
  ],
  'threat.unrest.stressor.realized': [
    w('Unrest has broken out, and it has not yet died down.'),
    w('The place is in uproar, and those in charge are struggling to calm it.'),
  ],
  'threat.economic_collapse.route.imminent': [
    w('Trade is close to breaking down, and money is getting scarce.'),
    w('The trade the place relies on is faltering badly.'),
  ],
  'threat.economic_collapse.route.realized': [
    w('Trade has all but stopped, and money is short everywhere.'),
    w('The trade the place relied on has broken down.'),
  ],
  'threat.economic_collapse.stressor.imminent': [
    w('Trade is close to breaking down, and money is getting scarce.'),
    w('Business is failing, and people fear for their livelihoods.'),
  ],
  'threat.economic_collapse.stressor.realized': [
    w('Trade has all but stopped, and money is short everywhere.'),
    w('The trade the place lives by has collapsed.'),
  ],
  'threat.monster_pressure.overrun.imminent': [
    w('Beasts are pressing close to the place, and people are uneasy.'),
    w('More beasts are being seen near the place than anyone likes.'),
  ],
  'threat.monster_pressure.overrun.realized': [
    w('Beasts have overrun the country around, and nobody travels alone any more.'),
    w('The country around is overrun with beasts, and the roads are dangerous.'),
    w('Beasts now roam the country around, and people keep close to home.'),
    w('Travel has become dangerous: the land around is thick with beasts.'),
    w('People go out only in company now, for the beasts are everywhere.'),
  ],
  'threat.monster_pressure.frontier.imminent': [
    w('Beasts from the wild are coming closer, and people are uneasy.'),
    w('More beasts are being seen at the edge of the settled land than anyone likes.'),
  ],
  'threat.monster_pressure.frontier.realized': [
    w('Beasts from the wild have come right up to the place.'),
    w('The wild has pressed in, and beasts are seen close by.'),
  ],
  'threat.monster_pressure.stressor.imminent': [
    w('Beasts and raiders are pressing close, and people are uneasy.'),
    w('More beasts and raiders are about than anyone likes.'),
  ],
  'threat.monster_pressure.stressor.realized': [
    w('Beasts and raiders have struck, and the roads are no longer safe.'),
    w('The country around is in the hands of beasts and raiders.'),
  ],
  'threat.plague.any.imminent': [
    w('A sickness is close to taking hold, and people are wary of every fever.'),
    w('There is sickness about, and it is getting close to a real outbreak.'),
    w('Sickness is spreading, and the healers fear it will get worse.', ['healer'], ['healer or hospital']),
  ],
  'threat.plague.any.realized': [
    w('Sickness has broken out in earnest, and few households are untouched.'),
    w('The sickness is everywhere now, and the sick are many.'),
  ],
  'threat.famine.any.imminent': [
    w('Food is close to running out, and every household is counting what it has.'),
    w('Hunger is close, and people are eating as little as they can.'),
  ],
  'threat.famine.any.realized': [
    w('Hunger has arrived, and many households now go without.'),
    w('There is no longer enough food, and people are going hungry.'),
  ],
  'threat.siege.any.imminent': [
    w('An enemy is close, and the place is preparing for a siege.'),
    w('A siege is expected, and people are getting ready for it.'),
  ],
  'threat.siege.any.realized': [
    w('The place is under siege, and nothing comes in or goes out freely.'),
    w('The enemy is at hand, and the place is shut in.'),
  ],
  'threat.bandit_raids.any.imminent': [
    w('Raiders have been seen nearby, and people are wary.'),
    w('Raiders are close, and the roads are being watched.'),
  ],
  'threat.bandit_raids.any.realized': [
    w('Raiders have struck the place, and people are counting the cost.'),
    w('The raiders have come, and the roads are no longer safe.'),
  ],
  'threat.rival_neighbor.any.imminent': [
    w('Relations with a neighbouring place have soured to the edge of open conflict.'),
    w('The quarrel with a neighbour is close to breaking into the open.'),
  ],
  'threat.rival_neighbor.any.realized': [
    w('The quarrel with a neighbouring place has broken into the open.'),
    w('Hostility with a neighbour is now open and acknowledged.'),
  ],
  'threat.arcane_instability.any.imminent': [
    w('Magic in the place is close to going badly wrong.', ['magic']),
    w('The magic here has grown unsteady, and people are wary of it.', ['magic']),
  ],
  'threat.arcane_instability.any.realized': [
    w('Magic in the place has gone badly wrong.', ['magic']),
    w('The magic here has broken loose, and nobody knows how to settle it.', ['magic']),
  ],
  // L2b (the chair's ruling 1): the recent-disruption beat said BY ITS EVENT'S NAME (beat.references.eventName, with its article: "the
  // Siege"), no age, no "founding survey"; an event of a crime or corruption kind (data/historyData.js :: EVENT_TYPE_NAMES: "The Crime
  // Wave", "The Scandal") is not said
  beat: [
    w('The place still lives with what {event} left behind.'),
    w('People here still talk of {event}, and of what it changed.'),
    w('What {event} left behind is still part of daily life here.'),
    w('{Event} still shapes how people here go about things.'),
    w('Talk here still comes back, sooner or later, to {event}.'),
    w('Much of how the place works now goes back to {event}.'),
    w('The mark {event} left on the place has not faded.'),
    w('Ask how things came to be as they are here, and {event} soon comes up.'),
  ],
  // nothing recent, nothing new, nothing acute (the fallback)
  calm: [
    w('Nothing much has changed here lately; the days go on as they always have.'),
    w('Life goes on as usual, and nobody can point to anything new.'),
    w('It has been a quiet stretch, with nothing out of the ordinary to report.'),
    w('Little has changed of late, and nobody is asking for it to.'),
    w('The place has gone about its business without upset for some while now.'),
    w('There is no news to speak of; things go on much as before.'),
    w('Nothing new has disturbed the ordinary run of things.'),
  ],
});

/** The condition archetypes with NO pool, and why (a new condition of these kinds says nothing). */
export const RECENT_UNSAID_CONDITIONS = Object.freeze({
  corruption_exposed: 'rule 6: a crime fact',
  regional_criminal_pressure: 'rule 6: a crime fact',
});
/** The tension types with NO pool, and why (the unspoken slot is EMPTY). */
export const UNSPOKEN_UNSAID_WOUNDS = Object.freeze({
  crime_wave: 'rule 6: a crime fact ("Crime is rising faster than those in charge can answer it…")',
  corruption_scandal: 'rule 6: a crime fact ("Evidence of official corruption has surfaced…")',
});
