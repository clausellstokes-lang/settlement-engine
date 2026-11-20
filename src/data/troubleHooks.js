/**
 * troubleHooks.js — HOOKS-BUILD (PAGE-7's brief, 2026-11-20 17:01 UTC): A TROUBLE'S HOOKS, A POOL A KIND. Data only.
 *
 * The eight commonest current-tension kinds stored their template's whole hook list, so two places of one kind shared
 * every line (the sameness fault; the owner: "comprehensively fix the sameness fault as much as you can"). Each kind now
 * holds a pool, and `historyGenerator.js :: troubleHooksOf` stores THREE of it: a line is admitted where its declaration
 * holds through the declared door (`drawDeclared.js`), the admitted lines are ranked by
 * `fnv1a32(`${seed}::trouble::${kind}::hook::${text}`)` highest first, and the top three are kept. No draw is added.
 *
 * The words are the chair's ruled lines, VETOABLE (the owner's): `docs/chair/2026-11-20/content/page/lines/TROUBLE-LINES-2.md`
 * (lines 1-12 of crime_wave and guild_conflict, all 9 of the other six) and `TROUBLE-LINES-3.md` (lines 13-16 of the two;
 * guild_conflict 15 as the chair reworded it at 17:00). Each row's `needs` / `excludes` is the atom its table row names
 * (`!atom` there is `excludes` here), every one an atom `factVocabulary.js` already holds; `needs: []` needs nothing.
 * Lines 1-3 of each kind are today's three stored hooks (guild_conflict 3 in its "both sides" spelling). The timeline's
 * own events still draw their template's list (`historyData.js :: HISTORICAL_EVENTS_DATA[].plotHooks`); this table is the
 * current tension's only. legitimacy_crisis 2 is the form an approved seat swaps for its twin
 * (`historyData.js :: LEGITIMACY_HELD_TWINS`, applied after the pick, so the pick never reads the seat).
 */

/** How many hooks a tension of these kinds stores (the stored array keeps today's length). */
export const TROUBLE_HOOK_COUNT = 3;

/** @typedef {Readonly<{ text: string, needs: ReadonlyArray<string>, excludes?: ReadonlyArray<string> }>} TroubleHook */

/** @type {Readonly<Record<string, ReadonlyArray<TroubleHook>>>} */
export const TROUBLE_HOOKS = Object.freeze({
  crime_wave: Object.freeze([
    { text: 'The crime wave is coordinated. Someone is directing it to create a pretext', needs: [] },
    { text: 'A guard captain is on the payroll of the criminal network', needs: ['watch', 'organised crime'] },
    { text: 'Those who would take the law into their own hands have picked out a culprit on bad information', needs: [] },
    { text: 'A household woke to find its door forced and nothing taken, and wants to know what the thieves were looking for', needs: [] },
    { text: 'A boy who runs errands for half the place has started carrying more coin than any errand pays', needs: [] },
    { text: 'Those who talk of taking the law into their own hands meet tonight, and they want someone who can fight', needs: [] },
    { text: 'A traveller robbed on the way in swears the robber knew which bag held the money', needs: [] },
    { text: 'A stallholder at the market has stopped reporting thefts, and will not say why', needs: ['market'] },
    { text: 'A watchman afraid of the night round is looking for someone to walk it with him, and will pay from his own purse', needs: ['watch'] },
    { text: 'A shopkeeper has been told to close by the end of the week, by people who did not give their names', needs: ['organised crime'] },
    { text: 'Two crews have been seen arguing over the same ground, and a fight between them looks a night away', needs: ['rival rings'] },
    { text: 'A thief caught in the act is being held in a cellar by the household that caught him, and nobody knows what to do with him next', needs: ['law: ≤ critical'] },
    { text: 'A cart left loaded overnight was emptied before dawn, and the carter wants to know who was awake', needs: [] },
    { text: "An old woman's savings have gone from under her floor, and only her family knew where they were kept", needs: [] },
    { text: 'A pedlar is selling goods cheap that several households swear were taken from them', needs: [] },
    { text: 'Chalk marks have appeared on several doors overnight, and the households behind them are frightened', needs: [] },
  ]),
  guild_conflict: Object.freeze([
    { text: "A guild master's records have gone missing ahead of an audit", needs: ['guild'] },
    { text: 'A journeyman denied mastership has proof the exam was rigged', needs: ['guild'] },
    { text: 'Someone is sabotaging both sides to destabilize the market for a third party', needs: ['market', 'guild'] },
    { text: 'A trader selling outside the rules has had a cart overturned in the night, and has a fair idea who did it', needs: [] },
    { text: 'A craftsman working from home has been told to stop selling, and means to carry on', needs: [] },
    { text: 'Both sides of the quarrel over trade are counting heads before the next gathering, and each is a few short', needs: [] },
    { text: 'A family that sells to both sides is being pressed to choose, and has asked for a few more days', needs: [] },
    { text: 'A stall at the market has been promised to two traders at once, and both will turn up at dawn', needs: ['market'] },
    { text: 'The guild is about to fine a member for buying from an outsider, and the member has threatened to name who else does it', needs: ['guild'] },
    { text: 'A trader turned away from selling is taking the matter to the court, and needs a witness who saw it', needs: ['court sits'] },
    { text: "A boat's cargo sits unloaded at the water's edge while the two sides argue over who may sell it", needs: ['navigable'] },
    { text: 'A trader outside the guild has been offered protection by people outside the law, and is tempted', needs: ['organised crime'] },
    { text: "An apprentice has run from one side of the quarrel to the other, and taken a master's tools along", needs: [] },
    { text: 'A cart of goods from outside has arrived for a trader who is not allowed to sell them, and the carter wants paying', needs: [] },
    { text: 'A trader at the market has been selling under the agreed price, and a crowd is expected at the stall tomorrow', needs: ['market'] },
    { text: 'A guild master has quietly bought from a trader outside the guild, and someone saw it happen', needs: ['guild'] },
  ]),
  resource_scarcity: Object.freeze([
    { text: 'A store of the scarce goods is being kept off the market on purpose', needs: ['market'] },
    { text: 'The scarcity was engineered. Someone destroyed the competing supply route', needs: [] },
    { text: 'An alternative source exists but the information is being suppressed', needs: [] },
    { text: 'A household caught hoarding is about to be turned out by its neighbours, and swears it was keeping the goods for others', needs: [] },
    { text: 'A carter offers to fetch what is short from elsewhere, if someone will pay half the price before he sets out', needs: [] },
    { text: 'A family that cannot pay the prices asked is selling its last good tools to buy what it needs', needs: [] },
    { text: 'With the place going hungry, a sack of food has gone missing from a household that had little to spare', needs: ['famine'] },
    { text: 'A party sent to take supplies for the war is due tomorrow, and households are hiding what they can', needs: ['war: at war'] },
    { text: 'A boat has come in loaded with what is short, and its master is asking twice what anyone here can pay', needs: ['navigable'] },
  ]),
  external_threat: Object.freeze([
    { text: 'The threat is being exaggerated by someone who profits from wartime contracts', needs: [], excludes: ['war: peace'] },
    { text: 'A diplomatic channel exists that the war party is suppressing', needs: [], excludes: ['war: peace'] },
    { text: 'The threat has an agent already inside the settlement', needs: [] },
    { text: 'A rider brings fresh news of the danger tonight, and it does not match what the last one said', needs: [] },
    { text: 'A family is packing to leave before dawn, and the neighbours are trying to stop them spreading panic', needs: [] },
    { text: 'A stranger asking about the roads in and out has asked for a bed for the night', needs: [] },
    { text: 'A stretch of the wall has been found crumbling, and mending it needs more hands than there are', needs: ['walls'] },
    { text: 'Those who keep order are calling for volunteers, and the first to come forward is the last one anyone expected', needs: ['guardPresence'] },
    { text: 'Tracks of the beasts that press on this place have been found beside a well-used path, closer than ever', needs: ['crisis: monster_pressure'] },
  ]),
  succession_crisis: Object.freeze([
    { text: "A would-be heir approaches outsiders to investigate a rival's past", needs: ['ruler: lord'] },
    { text: 'The ailing ruler wants a final errand completed before naming a successor', needs: [], excludes: ['ruler: council', 'ruler: elder', 'crisis: succession_void'] },
    { text: 'Someone is poisoning the ruler slowly, and someone in the household knows', needs: [], excludes: ['ruler: council', 'ruler: elder', 'crisis: succession_void'] },
    { text: 'One of the would-be successors is giving a feast tonight, and every guest will be counted', needs: [] },
    { text: "A would-be successor wants a rival's supporters watched, quietly, and is offering coin for it", needs: [] },
    { text: 'A letter meant for one would-be successor has reached another, and both now know what it says', needs: [] },
    { text: 'A household that has backed no one is visited by each side in turn, and has asked for protection from both', needs: [] },
    { text: 'A council member has not yet said whom they back, and their house was broken into last night', needs: ['ruler: council'] },
    { text: "With the seat empty, the seal used on the place's business has gone missing", needs: ['crisis: succession_void'] },
  ]),
  outside_debt: Object.freeze([
    { text: 'The original loan documents contain a clause that was never disclosed publicly', needs: [] },
    { text: "A creditor's agent is in town conducting a quiet assessment before enforcement", needs: [], excludes: ['crisis: under_siege'] },
    { text: 'The debt could be voided, if someone can prove it was obtained through fraud', needs: [] },
    { text: 'The one who kept the accounts of the loans has gone missing a week before the collectors are due', needs: [] },
    { text: 'A family that would bear the cost is quietly moving its goods out of the place, cart by cart', needs: [] },
    { text: 'The outside power has sent word of the day it will collect, and wants to know who will meet its people', needs: [] },
    { text: "The creditors have taken a household's goods against the debt, and the household wants them back before they leave", needs: ['crisis: indebted'] },
    { text: 'A wealthy household offers to pay the debt itself, in return for a say in how the place is run', needs: ['prosperity: ≥ prosperous'] },
    { text: 'A trader at the market is selling off stock cheap before the collectors arrive, and seems to know the day', needs: ['market'] },
  ]),
  legitimacy_crisis: Object.freeze([
    { text: 'A document that would settle the question of legitimacy exists, and both sides would rather it stayed lost', needs: [] },
    { text: 'Those in power are paying people to speak for them at the gatherings, because no one will do it for free', needs: [] },
    { text: 'A third party is keeping the question open on purpose, because an unsettled claim is easier to bargain with', needs: [] },
    { text: "Someone has painted a challenge to the authority's right to rule where everyone will see it at dawn, and those in charge want the hand found", needs: [] },
    { text: 'A speaker who questions the right to rule is due at a gathering tonight, and those in charge mean to stop the gathering', needs: [] },
    { text: 'One of those who deny the mandate has been offered a post by those in charge, and has not yet answered', needs: [] },
    { text: 'Those risen against the authority have taken a cart of supplies on the road, and the carter is missing', needs: ['crisis: insurgency'] },
    { text: 'A preacher of the new faith is telling crowds that those in charge rule without blessing', needs: ['crisis: religious_conversion'] },
    { text: 'The power that stands above the governing one has sent an envoy to look into the question, and both sides are courting the envoy', needs: ['seat outranked'] },
  ]),
  corruption_scandal: Object.freeze([
    { text: 'The investigator who uncovered the corruption has received a death threat', needs: [] },
    { text: "A key witness can be found, but won't speak without protection", needs: [] },
    { text: 'The corruption goes higher than anyone yet suspects; those pressing to expose it are being used', needs: [] },
    { text: 'A copy of the evidence is being passed from hand to hand, and one copy differs from the rest', needs: [] },
    { text: 'An official named in the evidence is selling property in a hurry', needs: [] },
    { text: 'Someone has offered to buy the evidence outright, for more than it seems worth', needs: [] },
    { text: 'The hearing on the evidence is set for next week, and the clerk who was to read it out has fallen ill', needs: ['court sits'] },
    { text: 'One of those who betrayed the place is named in the evidence, under another name', needs: ['crisis: recently_betrayed'] },
    { text: 'A trader who paid dues to the corrupt has kept every receipt, and is deciding whom to give them to', needs: ['market'] },
  ]),
});
