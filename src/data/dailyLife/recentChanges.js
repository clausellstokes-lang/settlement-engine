/**
 * data/dailyLife/recentChanges.js — THE `recent_changes` POOLS (DAILY-1 `lines/L2/LINES-2.md` § 5, revised by
 * `lines/L2/LINES-2b.md` § 1, § 3 and § 8, as the chair ruled: 18:47 (ruling 8: only conditions, stressor threats and
 * the recent beat, said by its event's name with no age and no "founding survey", a crime or corruption beat not said;
 * the defence's order and supply ratings taken by no line as a threat, their 27 lines cut; ruling 14: condition
 * magical_instability #0 reworded, the calm #0 with its time word dropped) and 18:56 (ruling 11: every line declared in
 * the vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * `RECENT_CHANGES`: one frozen array a branch; a line is a whole sentence, `{ id, text, needs }` as in
 * `childWarnings.js`; the id is its number in LINES-2 § 5 (`K` a condition, `T` a threat, `C` the calm pool) or LINES-2b
 * § 1 (`B`, the beat). The slot says, each as its own sentence, joined by a space:
 * - `beat`: the recent-disruption beat (`historyBeats.js :: deriveRecentDisruption`) BY ITS EVENT'S NAME
 *   (`references.eventName`, with its article: `{event}` "the Great Fire", `{Event}` at a sentence's head); never its
 *   text (an age, "As of the founding survey"); an event of a crime or corruption kind ("The Crime Wave", "The
 *   Scandal": the record's event of that name read by its template's kind, `crime_wave` or `corruption_scandal`) is not
 *   said, nor an event the record does not hold by that name.
 * - `condition.<archetype>`: a condition new this turn (`duration.elapsedTicks < 2`, the first two), one pool per
 *   archetype of `activeConditions.js :: CONDITION_ARCHETYPE_TEMPLATES`, said from the archetype's own description in plain
 *   words; `corruption_exposed` and `regional_criminal_pressure` have NO pool (rule 6: a crime fact), nor has an archetype
 *   outside the catalogue: such a condition says nothing.
 * - `threat.<kind>.<form>.<stage>`: an acute OPEN threat (stage imminent or realized, the first two by severity) that is
 *   not a defence RATING ("Civic stability at risk", "Economic fragility": THE CALM RULE, ruling 8).
 * - `calm`: only where none of the three sources is held at all; where one is held but none is sayable, the EMPTY string.
 * Lines name no house by its roster name, say no "town", and need no hideable house or crime atom
 * (`tests/domain/dailyLifeAtoms.test.js`, arm (c)); "the healers" needs a sick house. The deriver (`domain/dailyLife.js ::
 * deriveRecentChanges`) hands each branch's lines to `facts/drawDeclared.js :: filterDeclared` and picks one by
 * `kernel/proseHash.js :: pickRendezvous` keyed `<record.name>::dailyLife.recent_changes::<branch>`.
 *
 * NOT BUILT (a walker's reading whose cure is a rewording or an atom, the chair's; each names a thing or a class no true
 * declaration answers, so the line waits):
 * - the presumed-things walker's `war` ("the war": `war: <state>` or a wartime crisis; the war state a condition comes
 *   with is not one atom): war_pressure #0 "The war has begun to change how the place trades …", #1 "Talk of the war has
 *   crept into every conversation …", war_drain #1 "The war abroad is costing more …", army_deployed #0 "The army has
 *   marched off to the war …", war_spoils #1 "The war has begun to pay, in tribute and plunder.".
 * - its `siege` (a siege in force; these say one has ended, or is an ally's): siege_lifted #0 "The siege has ended …",
 *   #1 "The besiegers are gone …", relief_burden #0 "Marching to relieve a besieged ally …", #1 "Help sent to an ally
 *   under siege …".
 * - its `occupation` (an occupation in force or an occupier ruler; these say it has ended, or a resistance the crisis
 *   record need not hold): occupation_lifted #0, #1, occupation_resistance #0 "Resistance to the occupiers …", #1
 *   "Sabotage and quiet refusal are making the occupiers' work harder.".
 * - the presumption-classes walker's `outside` ("abroad": a war atom) and `office` ("standing army"): war_drain #0
 *   "Paying for the campaign abroad …", army_deployed #1 "The standing army is away on campaign …"; its `plenty`: boom #0
 *   "Trade and plenty have tipped the place into good times.".
 * siege_lifted, war_drain, army_deployed, occupation_lifted, relief_burden and occupation_resistance are left with no
 * line: such a condition says nothing.
 * STRICTER NEEDS THAN LINES-2 WROTE (the walkers' own cure, a line declares what it presumes; wordings unchanged):
 * threat.siege.any.realized #0 ("under siege") needs a siege in force (`crisis: under_siege`); trade_route_cut #0, #1
 * ("a trade route") need a route (`route open`); vassal_extraction #1, rebellion #0, vassal_trade_coercion #0, #1 ("an
 * overlord") need a sovereign (`sovereign`); calm #2 ("as usual") needs no crisis in force (`crisis: calm`).
 * RULING-R (the eleventh chair, 2026-11-27), R4: an imminent-stage threat line speaks of a trouble still to come, so it
 * is not said where that kind's crisis is already in force: the plague, famine, siege and monster-pressure imminent lines
 * exclude their crisis (`crisis: plague_onset`, `famine`, `under_siege`, `monster_pressure`); wordings and ids unchanged.
 *
 * THE SAMENESS LINES OF D5C-2 (the chair's E133 (2); `lines/D4C/DRAFT-2.md`,
 * taken 2026-11-22 21:55 UTC): beat B8, appended at the branch's end, its keyed pick unchanged
 * (`tests/domain/dailyLifeNewLines.test.js`).
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string>, readonly excludes?: ReadonlyArray<string> }} RecentLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[], excludes?: string[] }>} lines @returns {ReadonlyArray<RecentLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({ ...l, needs: Object.freeze([...l.needs]), ...(l.excludes ? { excludes: Object.freeze([...l.excludes]) } : {}) })));

/** The pools by branch. */
export const RECENT_CHANGES = Object.freeze({
  'condition.plague': frozen([
    { id: 'K0', text: 'A sickness has taken hold here, and it is still spreading.', needs: [] },
    { id: 'K1', text: 'Sickness has broken out in the place, and more people are falling ill.', needs: [] },
    { id: 'K2', text: 'A fever has begun to go round, and people are keeping their distance.', needs: [] },
  ]),
  'condition.famine': frozen([
    { id: 'K0', text: 'Food has become a public worry here, not just a private one.', needs: [] },
    { id: 'K1', text: 'The shortage of food has grown into a trouble the whole place shares.', needs: [] },
    { id: 'K2', text: 'Going hungry is no longer a private matter here; the whole place feels it.', needs: [] },
  ]),
  'condition.war_pressure': frozen([
    { id: 'K2', text: 'War is close enough now to be felt in everyday business and in the mood of the place.', needs: [] },
  ]),
  'condition.alliance_burden': frozen([
    { id: 'K0', text: 'Help sent to an ally has left the place short of what it needs at home.', needs: [] },
    { id: 'K1', text: 'Aid for an ally is costing the place more than people expected.', needs: [] },
  ]),
  'condition.vassal_extraction': frozen([
    { id: 'K0', text: 'A stronger power has begun to draw wealth or men from the place, and the loss is felt.', needs: [] },
    { id: 'K1', text: 'An overlord\'s demands have grown, and the place feels the draw on its purse.', needs: ['sovereign'] },
    { id: 'K2', text: 'More of what the place earns now goes to the power above it.', needs: [] },
  ]),
  'condition.rebellion': frozen([
    { id: 'K0', text: 'Resistance to an overlord has begun to organise here.', needs: ['sovereign'] },
    { id: 'K1', text: 'Some here have begun to organise against those who hold power over them.', needs: [] },
    { id: 'K2', text: 'Open talk of resistance has started, and people are choosing sides.', needs: [] },
  ]),
  'condition.faction_challenge': frozen([
    { id: 'K0', text: 'A strong party has begun working to change who holds sway here.', needs: [] },
    { id: 'K1', text: 'A challenge to the present rulers is under way, and people are watching to see how it goes.', needs: [] },
    { id: 'K2', text: 'A major power in the place has begun moving against the present rulers.', needs: [] },
  ]),
  'condition.government_overthrown': frozen([
    { id: 'K0', text: 'Those who ruled here have been overthrown, and new masters are settling in.', needs: [] },
    { id: 'K1', text: 'Power has just changed hands, and the new rulers are still finding their feet.', needs: [] },
  ]),
  'condition.coup_suppressed': frozen([
    { id: 'K0', text: 'An attempt to seize power has failed, and old scores are being settled.', needs: [] },
    { id: 'K1', text: 'A grab for power was put down, and those who backed it are being rooted out.', needs: [] },
  ]),
  'condition.stressor_residual': frozen([
    { id: 'K0', text: 'A trouble that has passed has still left its marks on the place.', needs: [] },
    { id: 'K1', text: 'The worst is over, but the place is still feeling the after-effects.', needs: [] },
  ]),
  'condition.custom_crisis': frozen([
    { id: 'K0', text: 'A crisis of its own has taken hold of the place.', needs: [] },
    { id: 'K1', text: 'Something has gone badly wrong here, and the whole place is caught up in it.', needs: [] },
  ]),
  'condition.magical_instability': frozen([
    { id: 'K0', text: 'Magic here has started to misbehave, and nobody trusts it to work as it should.', needs: [] },
    { id: 'K1', text: 'Magic in the place has begun to behave strangely, and nobody is sure why.', needs: [] },
  ]),
  'condition.trade_route_cut': frozen([
    { id: 'K0', text: 'A trade route the place depends on is no longer passable.', needs: ['route open'] },
    { id: 'K1', text: 'One of the trade routes has been cut, and goods have stopped coming that way.', needs: ['route open'] },
  ]),
  'condition.regional_import_shortage': frozen([
    { id: 'K0', text: 'A supplier in the region can no longer send what the place needs.', needs: [] },
    { id: 'K1', text: 'Goods the place relies on from elsewhere have become hard to get.', needs: [] },
  ]),
  'condition.regional_export_market_loss': frozen([
    { id: 'K0', text: 'A place that bought from here has stopped buying as much as it did.', needs: [] },
    { id: 'K1', text: 'Buyers elsewhere are taking less of what the place sells.', needs: [] },
  ]),
  'condition.regional_route_disruption': frozen([
    { id: 'K0', text: 'Trouble along a connected route has begun to disrupt trade here.', needs: [] },
    { id: 'K1', text: 'Trade coming in along the routes of the region has been disturbed.', needs: [] },
  ]),
  'condition.regional_authority_instability': frozen([
    { id: 'K0', text: 'Trouble in the place that governs this one is beginning to be felt here.', needs: [] },
    { id: 'K1', text: 'The powers above the place are unsettled, and the uncertainty has reached here.', needs: [] },
    { id: 'K2', text: 'Political trouble in a patron place has spilled over into local affairs.', needs: [] },
  ]),
  'condition.regional_tax_revenue_disruption': frozen([
    { id: 'K0', text: 'A place that owes dues here has stopped paying them reliably.', needs: [] },
    { id: 'K1', text: 'Payments owed by a dependent place have become uncertain.', needs: [] },
    { id: 'K2', text: 'Revenue the place counted on from a client has begun to fall short.', needs: [] },
  ]),
  'condition.regional_protection_gap': frozen([
    { id: 'K0', text: 'A protector the place relied on can no longer send help as it did.', needs: [] },
    { id: 'K1', text: 'The ally that guarded the place is less able to do so.', needs: [] },
  ]),
  'condition.regional_service_disruption': frozen([
    { id: 'K0', text: 'A nearby place that provides services is under strain, and the effects reach here.', needs: [] },
    { id: 'K1', text: 'Services the place gets from a neighbour have become unreliable.', needs: [] },
  ]),
  'condition.cold_war_sanctions': frozen([
    { id: 'K0', text: 'Inspections and embargoes have begun to squeeze everyday trade.', needs: [] },
    { id: 'K1', text: 'Trade is being choked by sanctions and inspections.', needs: [] },
  ]),
  'condition.regional_conflict_pressure': frozen([
    { id: 'K0', text: 'Fighting elsewhere in the region has begun to spill over.', needs: [] },
    { id: 'K1', text: 'Conflict nearby is putting pressure on the place.', needs: [] },
  ]),
  'condition.regional_migration_pressure': frozen([
    { id: 'K0', text: 'People driven from their homes elsewhere have started arriving here.', needs: [] },
    { id: 'K1', text: 'A trouble nearby is sending people this way.', needs: [] },
    { id: 'K2', text: 'Newcomers fleeing trouble elsewhere have begun to arrive.', needs: [] },
  ]),
  'condition.regional_information_shock': frozen([
    { id: 'K0', text: 'News and rumour from a neighbouring place have stirred up local politics.', needs: [] },
    { id: 'K1', text: 'Word from a neighbouring place has unsettled opinion here.', needs: [] },
  ]),
  'condition.regional_religious_pressure': frozen([
    { id: 'K0', text: 'Religious trouble elsewhere is being felt in the place\'s own faith.', needs: [] },
    { id: 'K1', text: 'Disputes of faith from elsewhere have reached here.', needs: [] },
    { id: 'K2', text: 'What is happening in the faith elsewhere is being argued over here too.', needs: [] },
  ]),
  'condition.food_anchor_lost': frozen([
    { id: 'K0', text: 'A house the place depended on for food is gone.', needs: [] },
    { id: 'K1', text: 'The place has lost one of the houses that fed it.', needs: [] },
  ]),
  'condition.dominant_npc_removed': frozen([
    { id: 'K0', text: 'A leading figure is gone, and who takes their place is not settled.', needs: [] },
    { id: 'K1', text: 'The place has lost a leading figure, and nobody has yet filled the gap.', needs: [] },
    { id: 'K2', text: 'With a leading figure gone, the question of who comes next is open.', needs: [] },
  ]),
  'condition.war_exhaustion': frozen([
    { id: 'K0', text: 'A long war has left the place tired of fighting and short of means.', needs: [] },
    { id: 'K1', text: 'The long war has worn the place down, and the will to fight is low.', needs: [] },
  ]),
  'condition.war_mobilization': frozen([
    { id: 'K0', text: 'The place has begun to put itself on a war footing.', needs: [] },
    { id: 'K1', text: 'Work and money are being turned toward the coming campaign.', needs: [] },
  ]),
  'condition.reinforcement_cost': frozen([
    { id: 'K0', text: 'More men, coin and supplies are being sent to keep the army in the field.', needs: [] },
    { id: 'K1', text: 'Keeping the army supplied at the front is draining the place.', needs: [] },
  ]),
  'condition.trade_realignment': frozen([
    { id: 'K0', text: 'A new main supplier is changing how goods come into the place.', needs: [] },
    { id: 'K1', text: 'Trade has begun to shift toward a new supplier.', needs: [] },
  ]),
  'condition.vassal_trade_coercion': frozen([
    { id: 'K0', text: 'The overlord now dictates what the place may trade, and the local economy feels it.', needs: ['sovereign'] },
    { id: 'K1', text: 'Trade here is now set by the overlord\'s orders, not by the place itself.', needs: ['sovereign'] },
  ]),
  'condition.trade_embargo': frozen([
    { id: 'K0', text: 'A key supplier has stopped trading with the place, and the loss is felt everywhere.', needs: [] },
    { id: 'K1', text: 'An embargo has cut off goods the place depends on.', needs: [] },
  ]),
  'condition.occupation_burden': frozen([
    { id: 'K0', text: 'Holding on to conquered places is tying down the strength of this one.', needs: [] },
    { id: 'K1', text: 'Keeping hold of conquered places is beginning to tell on the place.', needs: [] },
  ]),
  'condition.war_spoils': frozen([
    { id: 'K0', text: 'Tribute and spoils from conquered places have started coming in.', needs: [] },
  ]),
  'condition.reconstruction': frozen([
    { id: 'K0', text: 'Rebuilding has begun after the calamity, and the work is going on everywhere.', needs: [] },
    { id: 'K1', text: 'The work of rebuilding is under way, and everyone has a hand in it.', needs: [] },
  ]),
  'condition.boom': frozen([
    { id: 'K1', text: 'Business is booming, and the place is busier than it has been.', needs: [] },
  ]),
  'condition.flourishing': frozen([
    { id: 'K0', text: 'A long peace has let the place settle into a quiet golden age.', needs: [] },
    { id: 'K1', text: 'Times are good, and people have the leisure to make and enjoy fine things.', needs: [] },
  ]),
  'threat.unrest.void.imminent': frozen([
    { id: 'T0', text: 'With a leading figure gone, order is under strain.', needs: [] },
    { id: 'T1', text: 'The loss of a leading figure has left a gap nobody has filled, and it shows.', needs: [] },
  ]),
  'threat.unrest.void.realized': frozen([
    { id: 'T0', text: 'With a leading figure gone, nobody is quite in control of things.', needs: [] },
    { id: 'T1', text: 'The gap left by a leading figure has thrown the place into confusion.', needs: [] },
  ]),
  'threat.unrest.stressor.imminent': frozen([
    { id: 'T0', text: 'The place is unsettled, and tempers are short.', needs: [] },
    { id: 'T1', text: 'Unrest is stirring, and people expect trouble before long.', needs: [] },
  ]),
  'threat.unrest.stressor.realized': frozen([
    { id: 'T0', text: 'Unrest has broken out, and it has not yet died down.', needs: [] },
    { id: 'T1', text: 'The place is in uproar, and those in charge are struggling to calm it.', needs: [] },
  ]),
  'threat.economic_collapse.route.imminent': frozen([
    { id: 'T0', text: 'Trade is close to breaking down, and money is getting scarce.', needs: [] },
    { id: 'T1', text: 'The trade the place relies on is faltering badly.', needs: [] },
  ]),
  'threat.economic_collapse.route.realized': frozen([
    { id: 'T0', text: 'Trade has all but stopped, and money is short everywhere.', needs: [] },
    { id: 'T1', text: 'The trade the place relied on has broken down.', needs: [] },
  ]),
  'threat.economic_collapse.stressor.imminent': frozen([
    { id: 'T0', text: 'Trade is close to breaking down, and money is getting scarce.', needs: [] },
    { id: 'T1', text: 'Business is failing, and people fear for their livelihoods.', needs: [] },
  ]),
  'threat.economic_collapse.stressor.realized': frozen([
    { id: 'T0', text: 'Trade has all but stopped, and money is short everywhere.', needs: [] },
    { id: 'T1', text: 'The trade the place lives by has collapsed.', needs: [] },
  ]),
  'threat.monster_pressure.overrun.imminent': frozen([
    { id: 'T0', text: 'Beasts are pressing close to the place, and people are uneasy.', needs: [], excludes: ['crisis: monster_pressure'] },
    { id: 'T1', text: 'More beasts are being seen near the place than anyone likes.', needs: [], excludes: ['crisis: monster_pressure'] },
  ]),
  'threat.monster_pressure.overrun.realized': frozen([
    { id: 'T0', text: 'Beasts have overrun the country around, and nobody travels alone any more.', needs: [] },
    { id: 'T1', text: 'The country around is overrun with beasts, and the roads are dangerous.', needs: [] },
    { id: 'T2', text: 'Beasts now roam the country around, and people keep close to home.', needs: [] },
    { id: 'T3', text: 'Travel has become dangerous: the land around is thick with beasts.', needs: [] },
    { id: 'T4', text: 'People go out only in company now, for the beasts are everywhere.', needs: [] },
  ]),
  'threat.monster_pressure.frontier.imminent': frozen([
    { id: 'T0', text: 'Beasts from the wild are coming closer, and people are uneasy.', needs: [], excludes: ['crisis: monster_pressure'] },
    { id: 'T1', text: 'More beasts are being seen at the edge of the settled land than anyone likes.', needs: [], excludes: ['crisis: monster_pressure'] },
  ]),
  'threat.monster_pressure.frontier.realized': frozen([
    { id: 'T0', text: 'Beasts from the wild have come right up to the place.', needs: [] },
    { id: 'T1', text: 'The wild has pressed in, and beasts are seen close by.', needs: [] },
  ]),
  'threat.monster_pressure.stressor.imminent': frozen([
    { id: 'T0', text: 'Beasts and raiders are pressing close, and people are uneasy.', needs: [], excludes: ['crisis: monster_pressure'] },
    { id: 'T1', text: 'More beasts and raiders are about than anyone likes.', needs: [], excludes: ['crisis: monster_pressure'] },
  ]),
  'threat.monster_pressure.stressor.realized': frozen([
    { id: 'T0', text: 'Beasts and raiders have struck, and the roads are no longer safe.', needs: [] },
    { id: 'T1', text: 'The country around is in the hands of beasts and raiders.', needs: [] },
  ]),
  'threat.plague.any.imminent': frozen([
    { id: 'T0', text: 'A sickness is close to taking hold, and people are wary of every fever.', needs: [], excludes: ['crisis: plague_onset'] },
    { id: 'T1', text: 'There is sickness about, and it is getting close to a real outbreak.', needs: [], excludes: ['crisis: plague_onset'] },
    { id: 'T2', text: 'Sickness is spreading, and the healers fear it will get worse.', needs: ['sick house'], excludes: ['crisis: plague_onset'] },
  ]),
  'threat.plague.any.realized': frozen([
    { id: 'T0', text: 'Sickness has broken out in earnest, and few households are untouched.', needs: [] },
    { id: 'T1', text: 'The sickness is everywhere now, and the sick are many.', needs: [] },
  ]),
  'threat.famine.any.imminent': frozen([
    { id: 'T0', text: 'Food is close to running out, and every household is counting what it has.', needs: [], excludes: ['crisis: famine'] },
    { id: 'T1', text: 'Hunger is close, and people are eating as little as they can.', needs: [], excludes: ['crisis: famine'] },
  ]),
  'threat.famine.any.realized': frozen([
    { id: 'T0', text: 'Hunger has arrived, and many households now go without.', needs: [] },
    { id: 'T1', text: 'There is no longer enough food, and people are going hungry.', needs: [] },
  ]),
  'threat.siege.any.imminent': frozen([
    { id: 'T0', text: 'An enemy is close, and the place is preparing for a siege.', needs: [], excludes: ['crisis: under_siege'] },
    { id: 'T1', text: 'A siege is expected, and people are getting ready for it.', needs: [], excludes: ['crisis: under_siege'] },
  ]),
  'threat.siege.any.realized': frozen([
    { id: 'T0', text: 'The place is under siege, and nothing comes in or goes out freely.', needs: ['crisis: under_siege'] },
    { id: 'T1', text: 'The enemy is at hand, and the place is shut in.', needs: [] },
  ]),
  'threat.bandit_raids.any.imminent': frozen([
    { id: 'T0', text: 'Raiders have been seen nearby, and people are wary.', needs: [] },
    { id: 'T1', text: 'Raiders are close, and the roads are being watched.', needs: [] },
  ]),
  'threat.bandit_raids.any.realized': frozen([
    { id: 'T0', text: 'Raiders have struck the place, and people are counting the cost.', needs: [] },
    { id: 'T1', text: 'The raiders have come, and the roads are no longer safe.', needs: [] },
  ]),
  'threat.rival_neighbor.any.imminent': frozen([
    { id: 'T0', text: 'Relations with a neighbouring place have soured to the edge of open conflict.', needs: [] },
    { id: 'T1', text: 'The quarrel with a neighbour is close to breaking into the open.', needs: [] },
  ]),
  'threat.rival_neighbor.any.realized': frozen([
    { id: 'T0', text: 'The quarrel with a neighbouring place has broken into the open.', needs: [] },
    { id: 'T1', text: 'Hostility with a neighbour is now open and acknowledged.', needs: [] },
  ]),
  'threat.arcane_instability.any.imminent': frozen([
    { id: 'T0', text: 'Magic in the place is close to going badly wrong.', needs: ['magic'] },
    { id: 'T1', text: 'The magic here has grown unsteady, and people are wary of it.', needs: ['magic'] },
  ]),
  'threat.arcane_instability.any.realized': frozen([
    { id: 'T0', text: 'Magic in the place has gone badly wrong.', needs: ['magic'] },
    { id: 'T1', text: 'The magic here has broken loose, and nobody knows how to settle it.', needs: ['magic'] },
  ]),
  beat: frozen([
    { id: 'B0', text: 'The place still lives with what {event} left behind.', needs: [] },
    { id: 'B1', text: 'People here still talk of {event}, and of what it changed.', needs: [] },
    { id: 'B2', text: 'What {event} left behind is still part of daily life here.', needs: [] },
    { id: 'B3', text: '{Event} still shapes how people here go about things.', needs: [] },
    { id: 'B4', text: 'Talk here still comes back, sooner or later, to {event}.', needs: [] },
    { id: 'B5', text: 'Much of how the place works now goes back to {event}.', needs: [] },
    { id: 'B6', text: 'The mark {event} left on the place has not faded.', needs: [] },
    { id: 'B7', text: 'Ask how things came to be as they are here, and {event} soon comes up.', needs: [] },
    { id: 'B8', text: '{Event} is still remembered here, and not lightly.', needs: [] },
  ]),
  calm: frozen([
    { id: 'C1', text: 'Nothing much has changed here lately; the days go on as they always have.', needs: [] },
    { id: 'C2', text: 'Life goes on as usual, and nobody can point to anything new.', needs: ['crisis: calm'] },
    { id: 'C3', text: 'It has been a quiet stretch, with nothing out of the ordinary to report.', needs: [] },
    { id: 'C4', text: 'Little has changed of late, and nobody is asking for it to.', needs: [] },
    { id: 'C5', text: 'The place has gone about its business without upset for some while now.', needs: [] },
    { id: 'C6', text: 'There is no news to speak of; things go on much as before.', needs: [] },
    { id: 'C7', text: 'Nothing new has disturbed the ordinary run of things.', needs: [] },
  ]),
});

/**
 * THE DECLARATION (D4C-1, the chair's E133 (1)), one a BRANCH (every line of a branch does the same): what the branch's
 * line DOES on the page. `{ states: '<condition key>' }` it states a condition (the key as D4C's measure, table 1,
 * names it: `threat:<kind>`, `food:want`, `defence:want`, …); `{ consequence: true }` it says what a condition makes
 * people do, or the quiet as they live it; `{ names: true }` it only names a house or a place. `domain/dailyLife.js`
 * reads the declaration, never the line's words: the outsider line yields a part whose condition another printed slot
 * states (`tests/domain/dailyLifeNoRepeat.test.js`).
 */
/** `threat.<kind>.<form>.<stage>` states `threat:<kind>` (a threat's arrival); `condition.<archetype>` states
 * `condition:<archetype>`; `beat` states `event:recent_disruption`; `calm` is the quiet as people live it.
 * @param {string} b @returns {{ states: string } | { consequence: true }} */
const recentDoes = (b) => (b.startsWith('threat.') ? { states: `threat:${b.split('.')[1]}` }
  : b.startsWith('condition.') ? { states: `condition:${b.slice('condition.'.length)}` }
  : b === 'beat' ? { states: 'event:recent_disruption' } : { consequence: true });
export const RECENT_CHANGES_DOES = Object.freeze(Object.fromEntries(Object.keys(RECENT_CHANGES).map((b) => [b, Object.freeze(recentDoes(b))])));
