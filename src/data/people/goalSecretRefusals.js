/**
 * data/people/goalSecretRefusals.js — A WANT REFUSED BESIDE THE CARD'S OWN SECRET (GOALS-1, builder 4; the chair's rulings
 * of 2026-11-20 11:15 and 11:24 UTC and the owner's word "Do all of these, every last one predeploy"; the brief
 * `docs/chair/2026-11-20/content/goals/GOALS-1-BUILDER-4-BRIEF.md`, AMENDMENT 2 item 6).
 *
 * A card whose own secret says it TAKES money or goods by betraying its OWN office or trade does not want to "keep faith with
 * what they hold true" or to do its duty well: a want of a refused cluster (`GOAL_SECRET_REFUSED_CLUSTERS`) is refused for a
 * card whose secret is one of `GOAL_SECRET_REFUSAL_ROWS`. Read by `generators/people/goals.js :: refuseWantsBesideSecrets` (GOALS-2,
 * the chair's rulings of 12:05 and 12:37 UTC), ONE draw-free POST-PASS after the deal and the rare deal, by each card's FINAL
 * secret (the deal reads no row of this list, so no other card's draw moves): such a card, or one whose final secret is a rare
 * row of `GOAL_SECRET_REFUSAL_RARE_KEYS`, takes the next admitted candidate no card of the town holds (else its floor's next
 * cluster, `personalityFloor`).
 *
 * THE ROWS are the CLOSED LIST `docs/chair/2026-11-20/content/goals/measures/venal-betrayal-rows.closed-list.txt` (119 rows,
 * read by GOALS-1 one by one), keyed as the list keys them: `criminal.<holder>.<type>[i]` (`npcData.js ::
 * NPC_CRIMINAL_SECRETS_BY_HOLDER`), `title:<title>[i]` (`people/titleSecretsPresentations.js :: TITLE_SECRETS`),
 * `stress:<crisis>[i]` (`stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS`), each with its pool's text, transcribed
 * exactly. A stress row's `{food}` and `{faction}` match any fill; the thieves' guild row and the protection scheme's
 * merchants match the town's own rewording (goals.js). @enforced-by tests/data/goalSecretRefusals.test.js (every row stands
 * in its pool at its key with its text).
 *
 * ── THE 65 LEFT OUT (the candidates `venal-betrayal-rows.candidates.txt`, 184 rows, less the closed list: the EXCLUDE of
 * `venal-betrayal-rows.select.mjs`), BY CLASS, so a later reader sees why each is out ──
 * (1) A CRIME THAT IS THE CARD'S TRADE: no lawful office or trade is betrayed; the crime is the work (31).
 *   criminal.any.criminal[1] fencing operation · criminal.any.criminal[7] a front for contraband · title:the house boss[0] the
 *   dice fixed · title:the house boss[2] skims the den's takings · title:the front man[1] skims the shop's money for its real
 *   owners · title:the beast master[0] trained animals for fighting · title:the gang boss[0] sells the gang's own to the law ·
 *   title:the black marketeer[0] seized goods bought back · title:the black marketeer[1] poisons to a buyer · title:the black
 *   marketeer[2] paid to report, sells customers out · title:the whisper broker[0] the same news to both sides · title:the
 *   network's spider[0] sells the network's members · title:the network's spider[2] paid by two rival powers · title:the
 *   guildmaster of thieves[0] sells the guild's thieves · title:the guildmaster of thieves[1] keeps back a share of every theft ·
 *   title:the slave-market master[0] people taken unlawfully · title:the slave-market master[1] the sickest sold as healthy ·
 *   title:the slave-market master[2] a child in the pens · title:the fence[0] stolen goods sold back · title:the fence[1] paid
 *   to report who brings in what · title:the smuggler[2] keeps back a share of every load · title:the horse-coper[1] stolen
 *   horses · title:the slaver[0] debtors' children sold as captives · title:the slaver[1] the sick captive kept apart ·
 *   title:the slaver[2] a captive let go for a bribe · title:the trafficker[1] a powerful family's ward sold on · title:the
 *   bandit contact[0] sells the band's plans · title:the bandit contact[1] sells the warning to the travellers · title:the
 *   outlaw host[0] sells the outlaws' names · title:the outlaw host[2] keeps back what the outlaws leave · title:the
 *   ringleader[1] keeps back part of the ransoms.
 * (2) POACHING: another's land or wood worked as one's own; no office betrayed (4).
 *   title:the beast master[2] animals from forbidden land · title:the collier[0] charcoal from another's woods · title:the
 *   master of the hunt[0] hunting another's land · title:the camp foreman[0] trees beyond the camp's bounds.
 * (3) A WRONG ONLY KNOWN OF: the card did not take (1).
 *   title:the apothecary[2] knows which household bought the poison.
 * (4) A BRIBE THE CARD PAYS: money given, not taken (3).
 *   criminal.any.criminal[4] bribing officials · title:the sawyer[2] the injured boy's family paid to lie · stress:indebted[1]
 *   side payments to the creditor's representative.
 * (5) THE REST, NAMED PLAINLY (26).
 *   For a place or for safety, not money or goods: criminal.any.political[5] authority handed over for safety ·
 *   stress:politically_fractured[2] support for an appointment · stress:succession_void[3] an endorsement for an appointment ·
 *   stress:insurgency[4] a gate for safe passage.
 *   A falsehood with no money or goods taken: criminal.clergy.religious[2] miracle reports · stress:politically_fractured[1] the
 *   vote count · stress:plague_onset[4] the case count · stress:insurgency[3] innocents named as ringleaders ·
 *   stress:wartime[1] the conscription rolls.
 *   The card's own goods or own risk, its office or trade not betrayed: title:the apothecary[0] something stronger, sold quietly
 *   · title:the bowyer[0] bows to those with no right to hunt · title:the cobbler[2] the shop's tools sold for gambling debts ·
 *   title:the dyer[2] cloth for a false mark · title:the chandler[1] stolen ship's stores · title:the theatre manager[0] seats
 *   sold to the mocked's enemies · title:the master furrier[2] a smuggler's goods stored · title:the tanner[1] hides with the
 *   brands cut off · title:the salt master[1] salt held back for the price · title:the printer[0] pamphlets without a name ·
 *   title:the head shepherd[2] a hidden path, guided for a fee · title:the master of the hunt[2] the hunted guided, for a fee ·
 *   stress:famine[6] covert food sold dear · stress:famine[7] a cellar of food sold dear · stress:monster_pressure[3] news of
 *   the roads sold to an outsider.
 *   A rescue, paid or not: stress:occupied[5] people smuggled out for a price · stress:slave_revolt[6] the enslaved run out
 *   through the underways.
 *
 * Pure data: no closures, no imports, no randomness.
 */

/** The PERSONALITY clusters a listed secret refuses (the chair's ruling of 11:15 UTC): short and long. */
export const GOAL_SECRET_REFUSED_CLUSTERS = Object.freeze(['conviction', 'duty']);

/** The closed list (119 rows): key → the pool's text, exactly. */
export const GOAL_SECRET_REFUSAL_ROWS = Object.freeze({
  'criminal.any.criminal[0]': 'Has been embezzling from the organisation they oversee for three years',
  'criminal.any.criminal[3]': "On the payroll of the thieves' guild as a silent informant",
  'criminal.any.criminal[5]': "Runs a protection scheme targeting the very merchants they're supposed to serve",
  'criminal.any.criminal[6]': 'Has been falsifying inspection records for a fee',
  'criminal.any.personal[5]': 'Has been funding a forbidden relationship with embezzled money',
  'criminal.any.economic_betrayal[0]': 'Has been quietly betting against the ventures they talk their neighbours into, and profiting when they fail',
  'criminal.any.economic_betrayal[1]': 'The goods they sell as locally produced are sourced from somewhere with exploitative labour practices',
  'criminal.any.economic_betrayal[2]': 'Has been paying a health official to suppress a finding about their product',
  'criminal.military.military[1]': 'Has been selling patrol routes and schedules to someone outside the settlement',
  'criminal.military.military[2]': 'Has been skimming from military supply budgets for years through a trusted subordinate',
  'title:the miller[0]': 'Has been keeping back a handful from every sack brought to the mill for grinding, and selling the extra flour on the side',
  'title:the miller[1]': "Sets the mill's toll by who is asking, and charges the families who owe money far more than the rest",
  'title:the innkeeper[0]': 'Reads the letters guests leave in their rooms, and sells what is in them to whoever asks the right way',
  'title:the warehouse factor[1]': 'Has been reporting goods as spoiled or lost and selling them on through a buyer in another market',
  'title:the master smith[0]': 'Has been buying cheap iron and selling the work as good steel, and the blades break where it matters',
  'title:the master fishmonger[0]': "Sells yesterday's fish as this morning's, washed and packed in fresh ice, and has made people sick more than once",
  'title:the master weaver[0]': 'Sells cloth woven with short thread as full measure, and the bolts come up an arm short',
  'title:the master weaver[1]': "Has been taking work from the weavers' wives at half the rate and selling the cloth as their own shop's",
  'title:the master weaver[2]': "Copied a rival's pattern stitch for stitch and sold it for years as their own design",
  'title:the bowyer[1]': 'Used poor wood for a large order of bows and sold them as seasoned yew',
  'title:the master carpenter[1]': 'Charges every job for more wood than it used and sells the difference on the side',
  'title:the potter[0]': 'Sells glazed ware with lead in the glaze, cheaper to make and bad for anyone who eats from it often',
  'title:the potter[1]': 'Has been selling pots bought in from another workshop as their own throwing, at their own prices',
  'title:the potter[2]': 'Sold a set of plates as old work worth far more than they were, and the buyer has started to ask questions',
  'title:the master butcher[0]': 'Sells the meat of animals that died of sickness, cut so the signs do not show',
  'title:the brewer[0]': 'Thins the ale with water after it is sold by the barrel and charges the taverns for full strength',
  'title:the master of granaries[0]': 'Has been selling grain from the stores to merchants in another market and writing it down as spoiled',
  'title:the smelt master[0]': 'Has been mixing cheap metal into the bars and selling them as pure',
  'title:the master baker[0]': 'Bakes loaves under weight and sells them at full price, a little lighter every month',
  'title:the cartographer[1]': 'Copied a survey that was meant to stay secret and has been selling copies to anyone with the coin',
  'title:the sawyer[1]': 'Sells green planks as seasoned and the buildings made from them warp within a year',
  'title:the senior charter master[2]': "Sold the details of a company's next job to the people the company was hired to stop",
  'title:the master metalworker[0]': 'Has been making locks and selling copies of their keys to someone who pays for each one',
  'title:the ropemaker[0]': 'Has been twisting short fibre into the heart of the rope and selling it as full strength',
  'title:the dyer[1]': 'Sells cheap colours as costly ones, and they wash out at the first rain',
  'title:the fuller[1]': 'Has been stretching cloth on the tenters past its true size and selling the extra length',
  'title:the customs collector[0]': 'Waves through certain carts without inspection in return for a share of what they carry',
  'title:the customs collector[2]': 'Seizes goods from merchants on small faults and sells them on to a friend at a fraction of their worth',
  'title:the chandler[0]': 'Sells candles made with cheap tallow as fine wax ones, and the smoke gives them away to anyone who knows',
  'title:the stable master[2]': 'Sold a horse with a hidden lameness to a rider who was thrown and badly hurt',
  'title:the prison warden[0]': 'Sells better food, letters and visits to the prisoners whose families can pay, and lets the rest go hungry',
  'title:the castellan[0]': "Has been selling stores from the citadel's armoury and writing them off as rusted and broken",
  'title:the castellan[1]': 'Pocketed the money that was granted for the wall repairs, and buried the survey that said where they were needed',
  'title:the glassmaker[0]': 'Sells cheap coloured glass as cut gems to buyers who never think to test it',
  'title:the glassmaker[1]': "Has been copying a famous workshop's mark and selling ordinary glass as theirs",
  'title:the toll-keeper[1]': 'Lets certain carts across at night without the toll, for a share of what they carry',
  'title:the toll-keeper[2]': 'Has let the crossing fall into disrepair and pocketed the money for the repairs',
  'title:the vintner[0]': 'Sells cheap wine poured into the casks of a famous vintage',
  'title:the master furrier[1]': 'Sells dyed rabbit as costly fur to buyers who do not know the difference',
  'title:the woodcarver[1]': 'Sells cheap carvings as old work from a famous hand',
  'title:the outfitter[0]': 'Sells used gear taken from the bodies of dead delvers as new, after a scrub and a polish',
  'title:the outfitter[2]': 'Sells rope, lamps and rations that are cheaper than they look, and some of them fail underground',
  "title:the hospital's master[0]": "Has been selling the hospital's medicines to an apothecary and treating the poor with cheaper ones",
  "title:the hospital's master[1]": 'Lets families who give generously jump the line for beds while the poor wait in the hall',
  'title:the college master[0]': "Sells the college's places to the children of rich families who cannot sing a note",
  'title:the college master[1]': 'Has been taking credit for songs written by students and selling them as their own',
  'title:the coaching-inn keeper[1]': 'Changes tired horses for fresh ones and sells the good ones on, giving travellers the worst of the stable',
  'title:the mint master[1]': 'Has struck coins from dies that were meant to have been destroyed, and sold them to a buyer who spends them far away',
  'title:the mint master[2]': 'Has been letting a worker carry out silver dust in his clothes, for a share of what he sells',
  'title:the crier[0]': 'Takes coin to leave certain notices unread, or to read them so quietly that no one hears',
  'title:the quarry master[1]': 'Sold flawed stone for a building that is now cracking, and swore it was sound',
  'title:the auctioneer[1]': 'Has sold stolen goods under false papers, and kept the real papers in a locked drawer',
  'title:the auctioneer[2]': 'Lets a favoured buyer see the lots and the reserves before the sale, for a share of the savings',
  'title:the tanner[2]': 'Sells thin leather as thick by stretching it on the frame and selling it by the hide',
  'title:the workhouse master[0]': 'Sells the food meant for the inmates and feeds them thin gruel instead',
  'title:the ferryman[1]': 'Overcharges travellers who do not know the fare, and keeps the difference',
  'title:the granary reeve[1]': 'Takes a bribe from merchants to sell from the stores at low prices when grain is dear',
  'title:the mine captain[1]': 'Has kept back from the tally what ore the workings still give, and sold it to a smelter elsewhere',
  'title:the grove elder[0]': 'Has been taking offerings left at the grove and selling them in the market',
  'title:the librarian[0]': "Has been selling rare books from the library's stacks and replacing them with copies",
  'title:the wharfinger[1]': 'Lets cargo come ashore at night without the tally, for a share of its worth',
  'title:the wharfinger[2]': "Has let the wharf's timbers rot and pocketed the money meant for repairs",
  'title:the arena master[1]': "Has been selling the arena's best seats twice and keeping the second payment",
  'title:the harbour master[0]': 'Takes coin to let certain ships dock without inspection',
  'title:the harbour master[2]': "Closed the harbour to a rival's ships for a week on a false report of sickness, for a fee",
  "title:the exchange's steward[0]": 'Lets favoured caravan masters see the posted contracts before anyone else, for a share of their profit',
  "title:the exchange's steward[2]": 'Sells word of which caravans carry the richest loads to someone who waits on the road',
  'title:the scroll scribe[0]': 'Sells scrolls with the last line of the spell copied wrong, so they fail when read',
  'title:the enchanter[0]': 'Sells charms that do nothing, to buyers who cannot tell the difference',
  'title:the household elder[0]': "Has been keeping back part of the household's harvest and trading it for things the others never see",
  "title:the carriers' master[1]": "Has been keeping back part of the carriers' wages as fees they never agreed to",
  'title:the master shipwright[2]': 'Sells the timber meant for one ship to the yard of a rival, and delays the first ship for a season',
  'title:the head shepherd[0]': 'Has been selling a few sheep from every flock each year and blaming wolves',
  'title:the foundling-mother[0]': 'Has been selling some of the foundlings to families who pay, without any record',
  'title:the foundling-mother[2]': "Has been keeping back part of the home's gifts and feeding the children less",
  'title:the dairy farmer[2]': 'Sold butter from a sick cow and a child fell ill',
  'title:the assayer[0]': 'Writes a higher purity on certain bars for a fee, and the buyers never test them again',
  'title:the assayer[1]': 'Keeps a little of every sample brought in, and has been selling the gathered dust',
  'title:the assayer[2]': "Tells one buyer what the others' samples showed, for a share of their profit",
  'title:the almoner[0]': 'Has been keeping back part of the alms and spending it on their own comforts',
  "title:the post's master[1]": "Sells the post's road news to one buyer a day before it is posted for everyone",
  'title:the jeweller[0]': 'Sells cheap stones as fine ones, set so the flaws do not show',
  'title:the jeweller[2]': 'Keeps back a little gold from every piece and sells the gathered scraps',
  'title:the message-master[0]': 'Reads the messages that pass through the network and sells the best of them',
  'title:the chancellor[0]': 'Sells places at the academy to rich families whose children have no talent',
  'title:the chancellor[2]': "Lets forbidden research continue in the academy's lower rooms, for a share of what it earns",
  'title:the dream-keeper[0]': "Has been reading the dreams of the parlour's clients and selling what they learn",
  'title:the headman[0]': 'Has been keeping back part of the dues the households pay and spending it on themselves',
  'title:the skydock master[0]': 'Lets certain airships dock without inspection, for a share of their cargo',
  'title:the horse-coper[0]': 'Sells old horses as young ones, with their teeth filed and their coats dyed',
  'title:the planar factor[2]': 'Sells ordinary goods as planar wonders to buyers who cannot tell the difference',
  'title:the envoy[1]': "Sells the embassy's protection to people fleeing the law, and hides them in its rooms",
  'title:the maltster[0]': 'Has been mixing spoiled grain into the malt and selling it at full price',
  'title:the steward[0]': 'Has been keeping back part of the rents and dues and writing them down as unpaid',
  'title:the steward[1]': 'Lets certain tenants off their dues in return for a share of their harvest',
  'title:the hospitaller[0]': "Lets the hospital's beds to travellers who are not sick, for coin, on the quiet nights",
  'title:the warden[0]': 'Lets certain travellers cross the border paths without being stopped, for a fee',
  'title:the fishmonger[0]': 'Soaks the salt fish so it weighs heavier and sells it by the pound',
  'title:the beekeeper[0]': 'Has been watering the honey and selling it at full price',
  'title:the waystation keeper[0]': 'Has let the well go foul and sells water from a barrel at a price',
  'stress:under_siege[8]': 'Has been skimming from the {food} reserves to pay a personal debt that predates the siege',
  'stress:famine[1]': "Sold off the settlement's emergency stores three months ago and reported them destroyed in a flood",
  'stress:famine[8]': 'Has documentation proving the famine was made worse by decisions taken by {faction}, and has been paid to lose it',
  'stress:indebted[3]': 'Has been embezzling from civic funds to make personal debt payments, using the same creditor network for both',
  'stress:indebted[4]': 'Sold privileged commercial information to a foreign merchant house to cover an interest payment (information that {faction} considers proprietary)',
  'stress:plague_onset[3]': 'Has been selling access to unquarantined routes for cash. The price goes up as the desperation increases',
  'stress:mass_migration[0]': 'Has been selling residency papers and gate-passes to newcomers who cannot legally settle, at a price that rises with their desperation',
  'stress:wartime[0]': "Has been under-declaring the settlement's stores to the requisition officers and selling the concealed {food} to both armies",
  'stress:wartime[5]': "Has been feeding the enemy's quartermasters the same false supply figures they feed their own, playing both requisitions for the skim",
});

/**
 * THE RARE ROWS of the same kind (AMENDMENT 3, the chair's ruling of 11:32 UTC): `data/rareSecrets.js :: RARE_SECRET_ROWS`
 * keys. The rare deal (`people/rareSecrets.js :: dealRareSecrets`) runs AFTER the goals and may replace a card's secret with
 * one of these; `people/goals.js :: refuseAfterRareSecrets` reads the refusal again for such a card.
 */
export const GOAL_SECRET_REFUSAL_RARE_KEYS = Object.freeze(['thumbOnScale', 'paidToForget', 'sellsSecrets', 'deserter']);
