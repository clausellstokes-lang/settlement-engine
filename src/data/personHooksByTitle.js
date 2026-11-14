/**
 * personHooksByTitle.js — THE PERSON HOOK POOL BY TITLE (W7 HOOKS, 2026-11-07; WAVE-RULINGS item 15).
 *
 * WHY. The people car (PEOPLE-3 HOOKS) gave every card exactly one hook, drawn from the seven
 * category lists of npcData.js :: NPC_FACTION_LOYALTY through the pool map (poolMap.js ::
 * hookPoolFor). A city or metropolis holds more faces of one kind than a category list has lines,
 * so the roster ran dry and repeated (measured by W7 on the town / city / metropolis cells of the
 * soak's first 300: 367 repeated lines on 8,085 cards; the fortune teller 29, the house boss 17,
 * the madam 13 …). These pools are the cure the car's record asked for (PEOPLE_3_HOOKS §6): lines
 * keyed by the card's TITLE, walked FIRST when the card's category line is already held on the
 * roster (people/representatives.js :: drawCardHooks, people/personHooks.js :: truePersonHooks).
 * The stream draw is untouched: a card whose drawn line is unheld keeps it.
 *
 * THE LAW EVERY LINE OBEYS (WIRING-RULINGS §5; DESIGN_POOL_CENSUS §1): plain statement of what is
 * happening to this person and what it costs them; the card's own house is the only fact presumed
 * (the card exists because the house stands); no walls, watch, garrison, soldiers, hospital, famine
 * or magic word (the hook-truth vocabulary, domain/coherence/hookTruth.js), so no line can be
 * refused for a fact another house would have to supply; the person is "they". The magic titles
 * are not keyed here (their category walk is the magic pool, gated by the world law).
 *
 * FOR THE OWNER'S VETO: every line (docs/WIRING_W7_2026-11-07.md §2e). SW-10 HOOKS (2026-11-09) added each
 * title's fourth line (the four-vantage floor, WIRING-RULINGS §8), listed in
 * docs/chair/2026-11-09/STYLE-2-HOOKS-2026-11-09.md.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const PERSON_HOOKS_BY_TITLE = Object.freeze({
  'the fortune teller': [
    'A widow has paid them every week for a year to hear that her son is alive, and they have just learned he is not.',
    'Two rival families both came for a reading on the same night, and each was told the other would fall.',
    'A reading they made up came true to the day, and now people are frightened of them.',
    'Someone has been sending them the secrets of their own customers, unasked, before each reading.',
    'A regular has stopped coming, and their last reading warned them to stay away from the road they died on.',
    'They are paid by one merchant to steer customers away from another, and the other has found out.',
  ],
  'the house boss': [
    'A gambler owes the house more than the house is worth, and the debt has been sold to someone they do not know.',
    'The dice at one table have been weighted, and it was not done by anyone they pay.',
    'A winner walked out with a fortune last month and has not been seen since; people are asking them why.',
    'A regular who always lost has started winning every night, and the dealers want to know who is teaching the regular.',
  ],
  'the madam': [
    'One of their workers has gone missing with a client\'s papers, and the client wants both back quietly.',
    'A regular has started bringing a powerful friend, and the friend talks in his sleep.',
    'Someone is paying their workers to repeat what customers say, and it is not them.',
    'A client has paid for a whole year of evenings in advance, and the worker he pays for has asked them for help leaving.',
  ],
  'the district madam': [
    'Two houses in their district are fighting over the same workers, and both have asked them to settle it.',
    'A new house has opened on their street without asking them, and its door is never closed.',
    'Their book of who visits whom has been copied, page by page, by someone in their own house.',
    'A family has come asking for a daughter who works on their street, and the daughter has asked them to say she is not there.',
  ],
  'the arena master': [
    'The crowd\'s favourite has been told to lose the next bout, and has refused.',
    'A fighter died in the ring last month, and the family says the blade was not blunted.',
    'Someone is betting heavily on every fight the arena master arranges, and winning.',
    "A fighter's family has offered them their savings to keep the fighter out of the next bout.",
  ],
  "the guild's master": [
    'Two members want to be named their successor, and each has asked them for a promise in private.',
    'The guild\'s strongbox balances, but the count of members paying dues has fallen by a third.',
    'A rival guild has offered their best journeymen better wages, and three have already gone.',
    'An old member has stopped paying dues, saying the guild still owes for work done before the master took office.',
  ],
  'the college master': [
    'A student\'s thesis proves the college\'s founding charter was forged.',
    'A wealthy family is paying for a place their son did not earn, and the other students know.',
    'Pages have been cut out of the oldest book in the college library, neatly, with a blade.',
    'A teacher they hired turns out to have no learning at all, and the students have loved every lesson.',
  ],
  'the whisper broker': [
    'They have been paid twice for the same secret, by the two people it would ruin.',
    'Someone is selling their information cheaper, and it is better than theirs.',
    'A secret they sold last season has got someone killed, and the family wants a name.',
    'A client wants to buy back a secret the client sold them, at any price.',
  ],
  'the theatre manager': [
    'The new play mocks someone powerful by another name, and the house is full every night.',
    'Their lead player has had an offer from another company, and a debt they will not explain.',
    'Something has been stolen from behind the stage on three opening nights running.',
    'The owner of the theatre has sold it to someone who will not give a name, and the lease ends at midsummer.',
  ],
  'the miller': [
    'Farmers are saying the miller keeps back more flour than the toll allows, and they are half right.',
    'The millstone has cracked, and a new one will cost a year of takings.',
    'Someone has been grinding at night, using their stones, and leaving the floor swept.',
    'A farmer brought grain with stones mixed in to make the weight, and wants flour for the full weight.',
  ],
  'the pit boss': [
    'A fighting dog that never loses has been seen being fed by someone nobody knows, the night before a bout.',
    'The takings are short by the same sum every week, and only two people handle the money.',
    'A bout they fixed went the wrong way, and the man who lost on it wants his money back from them.',
    'A new fighter beat their champion in the yard behind the pit, in front of twenty witnesses, and wants a match.',
  ],
  'the beast master': [
    'One of their animals got loose last week, and someone left the latch open on purpose.',
    'A buyer wants an animal they swore they would never sell, and has offered three times its worth.',
    'Their animals have been off their feed since a new keeper started.',
    'An animal bought from them last month has hurt its new owner, and the owner is telling everyone it was sold wild.',
  ],
  'the front man': [
    'The business they front for has been asked questions by someone who already knows the answers.',
    'They have started keeping a copy of every paper they sign for the people behind them.',
    'The people they front for want a new face, and they have been told to train their replacement.',
    'A customer has started treating them as the real owner, and has offered a deal the real owners would never take.',
  ],
  'the postmaster': [
    'Letters for one house are arriving opened and resealed, and it is happening under their roof.',
    'A sealed packet has sat unclaimed for a year, and someone has just offered to buy it.',
    'One of their riders has been carrying private letters on the side, for a price.',
    'A letter has arrived for someone who died here ten years ago, in a hand the family recognises.',
  ],
  'the collier': [
    'The charcoal they sold has been cut with damp wood, and the smiths are refusing to pay.',
    'A burn in the woods got out of hand last month, and someone is saying it was set.',
    'The landowner wants a bigger share of the wood they cut, or the stand closed to them.',
    'A family has been living in the woods near their stand, and the wood they cut keeps going missing.',
  ],
  'the quarry master': [
    'A worker was crushed at the face last month, and the crew says the shoring was skimped to save money.',
    'The best stone in the quarry has been promised to two buyers.',
    'Blasting has opened a cavity in the rock face that nobody has gone into yet.',
    'The crew has found old cut stones under the quarry floor, older than anyone knew, and the landowner wants work stopped.',
  ],
  'the warehouse factor': [
    'The stock in one bay counts right on paper and short on the floor.',
    'A merchant has asked them to store goods without writing them down, for a fee.',
    'Someone has been sleeping in the loft above the stores, and leaving no trace but warmth.',
    'A merchant has died owing a year of storage, and three heirs each say the goods in that bay are theirs.',
  ],
  'the pawnbroker': [
    'A ring pawned last week belongs to a family that says it was never sold.',
    'Someone keeps redeeming the same cheap pledge, each time with a different name.',
    'They hold an item nobody has come back for, and three people have now asked about it.',
    'A family heirloom pledged by a son has been missed by his mother, and she has come asking what he got for it.',
  ],
  'the cartographer': [
    'A patron has paid them to leave a valley off the new map, and will not say why.',
    'Their best survey shows a road that was never built, and someone is selling land along it.',
    'Two of their old maps disagree about where a boundary runs, and both neighbours have a copy.',
    'A surveyor they trained has sold copies of their maps to the people the maps were meant to be kept from.',
  ],
  'the master fishmonger': [
    'Fish is being sold in the market cheaper than they can buy it, and nobody knows where it comes from.',
    'A buyer has been taking the whole catch every morning before the stalls open, paying in coin nobody recognises.',
    'Their scales have been tampered with, and the customers are blaming them.',
    'Someone has been leaving spoiled fish at their stall overnight, and the customers think it is their stock.',
  ],
  'the innkeeper': [
    'A guest has paid a month ahead and never leaves the room, and the maid says the bed is never slept in.',
    'Two travellers who arrived separately were seen talking like old friends in the yard.',
    'Someone has been listening through the floor of their best room, and they have found the gap in the boards.',
    'A guest left without paying, and left behind a list of names of people in this place.',
  ],
  "the network's spider": [
    'One of their informants is feeding them lies, and they do not yet know which.',
    'A message meant for them reached someone else first.',
    'Someone has started paying their people more for the same work.',
    'An informant they trusted wants out, and has offered every secret the informant knows as the price of leaving.',
  ],
  'the ropemaker': [
    'A rope of theirs parted under load last month, and someone was hurt; they say it was cut.',
    'A buyer has ordered more rope than any honest trade needs, and paid in advance.',
    'Their hemp has come in short and poor two seasons running, from the same supplier.',
    'A customer has ordered a rope of a length that only makes sense for a climb, and wants it unmarked.',
  ],
  'the lodge master': [
    'A member has asked to resign and will not say why, which has never happened before.',
    'Someone outside the lodge has been repeating what is said inside it.',
    'The lodge\'s oldest rule would bar its richest new member, and the member does not know.',
    "A founding member's grandchild has asked to see the lodge's first records, and those records name a crime.",
  ],
  'the toll-keeper': [
    'A carter has been passing without paying on a paper they swear was forged.',
    'The takings at the toll have risen, but less than the traffic has.',
    'Someone has offered them a share to look the other way on one night each month.',
    'The people who own the road have raised the toll without telling the carters, and the carters blame them.',
  ],
  'the undercity boss': [
    'A tunnel they did not dig has opened into one of theirs.',
    'Their lieutenants have started meeting without them.',
    'Someone above ground is paying for maps of their passages.',
    'A family has moved into one of their empty passages, and refuses to leave.',
  ],
  'the black marketeer': [
    'A buyer has asked for something they can get, and should not sell.',
    'Their supplier has gone quiet, and the goods have started arriving anyway.',
    'Someone is selling copies of their goods under their name.',
    'A customer paid in coins that someone is looking for, and that someone is following the coins back to them.',
  ],
  'the glassmaker': [
    'A batch of their glass has come out with a colour they cannot make again, and a buyer wants more.',
    'Their furnace was found cold one morning with the door barred from inside.',
    'An apprentice has run off with the recipe for their clearest glass.',
    'A buyer has ordered panes cut to one exact size, many of them, for a building nobody has heard of.',
  ],
  'the coaching-inn keeper': [
    'A coach came in with one passenger fewer than it left with, and the driver will not talk.',
    'Their best horses have been swapped for poorer ones overnight.',
    'A traveller left a locked case in their care a year ago and has written to say someone else will collect it.',
    'A driver has been carrying a sealed box on every coach, and the box goes off with a different rider at each stop.',
  ],
  'the master smith': [
    'A customer has ordered blades without hilts, many of them, and paid in advance.',
    'Their apprentice has been working the forge at night on something the apprentice will not show them.',
    'A tool of theirs was found where a theft took place.',
    'A lock they made for a rich house has been opened without a mark, and the owner is asking who else has the pattern.',
  ],
  'the cobbler': [
    'A pair of boots left for mending had something sewn into the sole.',
    'A customer paid with a coin from a mint that closed before they were born.',
    'Someone has been leaving their footprints, in boots of their making, at the scene of break-ins.',
    'A customer has ordered boots for a child, with a hidden pocket in the heel, and paid in advance.',
  ],
  'the lanista': [
    'Their best fighter has bought their own freedom with money nobody can account for.',
    'A patron wants a fighter killed in the ring, and has offered a fortune for it.',
    'Two of their fighters have sworn to kill each other outside the arena.',
    'A fighter they sold years ago has come back free and wealthy, and wants to buy the rest of their stable.',
  ],
  'the guildmaster of thieves': [
    'A job went wrong because someone inside the guild talked.',
    'A crew has started working their streets without paying the guild its share.',
    'They have been offered amnesty, and the offer came with a name they are expected to give.',
    'A thief has handed back everything taken from one house, and will not tell the guild why.',
  ],
  'the banker': [
    'A large loan they made has been called in by someone who bought the debt from them in their own name.',
    'Two depositors have asked for all their money on the same morning.',
    'A borrower has died, and the security for the loan turns out to belong to someone else.',
    "A clerk has been lending depositors' money on the side at a higher rate, and the borrowers think the bank knows.",
  ],
  'the master furrier': [
    'Pelts are coming to market with marks of a trap nobody here sets.',
    'A buyer has asked for a coat of a fur that is meant to be forbidden.',
    'Their trappers have stopped going to the north woods, and will not say why.',
    'A trapper has brought in a pelt from an animal nobody has seen in these hills for fifty years.',
  ],
  'the auctioneer': [
    'An item sold last month has been claimed by its true owner, who says it was stolen.',
    'Someone keeps bidding against the same buyer, and never wins.',
    'The heirs to an estate they are selling have not all agreed to the sale.',
    'A buyer paid for a lot and never collected it, and the lot has started to draw visitors who only look.',
  ],
  "the hospital's master": [
    'Medicines are going missing from the stores, and the count is always the same.',
    'A patient brought in last week is not who they said they were.',
    'A rich patron wants a bed kept free for someone who has not arrived yet.',
    'A nurse has been sending patients home early, and two of them have died at home.',
  ],
  'the dyer': [
    'The river below their vats has turned the wrong colour, and the fishers are blaming them.',
    'A buyer wants cloth dyed in a colour only one family is allowed to wear.',
    'Their mordant has been cut with something that fades in a month.',
    "Their best colour comes from a plant that grows on one family's land, and that family has stopped selling it.",
  ],
  'the stable master': [
    'A horse in their care died in the night, and its owner wants to know why.',
    'Someone hires a fast horse every new moon and brings it back lathered before dawn.',
    'A horse left with them has a brand that was burned over another.',
    'A rider has left a horse with them and paid for a year, and the horse is one that was reported stolen.',
  ],
  'the chandler': [
    'Their candles have been sputtering and spitting, and someone has found grit in the wax.',
    'A customer buys enough lamp oil every week to light a hall, and lives alone.',
    'A rival is selling candles at a price that cannot cover the wax.',
    'A customer has ordered black candles in a number that matches the households on one street.',
  ],
  'the impresario': [
    'Their star performer has received a letter that has frightened them into silence.',
    'A show they staged last season is being copied, word for word, by another company.',
    'A patron has paid for a performance in a private house, and asked them to forget the address.',
    'Their company has been invited to perform for a family that ruined the last company to accept.',
  ],
  'the bath-keeper': [
    'Two men meet in the steam room every week and speak in a language nobody here knows.',
    'Someone has been taking the clothes of bathers and returning them, searched.',
    'The water has started running foul, and the cause is upstream of them.',
    'A bather collapsed in the hot room last week, and the family says someone held the door shut.',
  ],
  'the fuller': [
    'Cloth came back from their works shorter than it went in, and the weaver says it was cut.',
    'Their fulling earth has run out, and the only seller wants double.',
    'An apprentice has been taking cloth out at night and bringing it back by morning.',
    'A weaver they work for has asked them to swear that cloth was lost in the vats when it was sold.',
  ],
  'the skydock master': [
    'A vessel came in with its manifest torn out.',
    'A berth has been paid for, for a year, by a vessel nobody has seen.',
    'Two crews have been fighting over the same berth, and both have papers.',
    'A crew has asked to dock without being written down, and has offered a year of fees in coin.',
  ],
  'the grove elder': [
    'An old tree in the grove has been cut in the night, cleanly, and the wood taken.',
    'A family wants to bury their dead in the grove, against its custom.',
    'Someone has been leaving offerings in the grove that nobody here makes.',
    'A child has been visiting the grove alone at night, and has started speaking of things only the elders were told.',
  ],
});

/** The titles keyed here, for the pinned coverage arm. */
export const PERSON_HOOK_TITLES = Object.freeze(Object.keys(PERSON_HOOKS_BY_TITLE));
