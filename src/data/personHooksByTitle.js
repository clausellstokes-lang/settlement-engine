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
 * FOR THE OWNER'S VETO: every line (docs/WIRING_W7_2026-11-07.md §2e).
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
  ],
  'the madam': [
    'One of their workers has gone missing with a client\'s papers, and the client wants both back quietly.',
    'A regular has started bringing a powerful friend, and the friend talks in his sleep.',
    'Someone is paying their workers to repeat what customers say, and it is not them.',
  ],
  'the district madam': [
    'Two houses in their district are fighting over the same workers, and both have asked them to settle it.',
    'A new house has opened on their street without asking them, and its door is never closed.',
    'Their book of who visits whom has been copied, page by page, by someone in their own house.',
  ],
  'the arena master': [
    'The crowd\'s favourite has been told to lose the next bout, and has refused.',
    'A fighter died in the ring last month, and the family says the blade was not blunted.',
    'Someone is betting heavily on every fight the arena master arranges, and winning.',
  ],
  "the guild's master": [
    'Two members want to be named their successor, and each has asked them for a promise in private.',
    'The guild\'s strongbox balances, but the count of members paying dues has fallen by a third.',
    'A rival guild has offered their best journeymen better wages, and three have already gone.',
  ],
  'the college master': [
    'A student\'s thesis proves the college\'s founding charter was forged.',
    'A wealthy family is paying for a place their son did not earn, and the other students know.',
    'Pages have been cut out of the oldest book in the college library, neatly, with a blade.',
  ],
  'the whisper broker': [
    'They have been paid twice for the same secret, by the two people it would ruin.',
    'Someone is selling their information cheaper, and it is better than theirs.',
    'A secret they sold last season has got someone killed, and the family wants a name.',
  ],
  'the theatre manager': [
    'The new play mocks someone powerful by another name, and the house is full every night.',
    'Their lead player has had an offer from another company, and a debt they will not explain.',
    'Something has been stolen from behind the stage on three opening nights running.',
  ],
  'the miller': [
    'Farmers are saying the miller keeps back more flour than the toll allows, and they are half right.',
    'The millstone has cracked, and a new one will cost a year of takings.',
    'Someone has been grinding at night, using their stones, and leaving the floor swept.',
  ],
  'the pit boss': [
    'A fighting dog that never loses has been seen being fed by a stranger\'s hand the night before.',
    'The takings are short by the same sum every week, and only two people handle the money.',
    'A bout they fixed went the wrong way, and the man who lost on it wants his money back from them.',
  ],
  'the beast master': [
    'One of their animals got loose last week, and someone left the latch open on purpose.',
    'A buyer wants an animal they swore they would never sell, and has offered three times its worth.',
    'Their animals have been off their feed since a new keeper started.',
  ],
  'the front man': [
    'The business they front for has been asked questions by someone who already knows the answers.',
    'They have started keeping a copy of every paper they sign for the people behind them.',
    'The people they front for want a new face, and they have been told to train their replacement.',
  ],
  'the postmaster': [
    'Letters for one house are arriving opened and resealed, and it is happening under their roof.',
    'A sealed packet has sat unclaimed for a year, and someone has just offered to buy it.',
    'One of their riders has been carrying private letters on the side, for a price.',
  ],
  'the collier': [
    'The charcoal they sold has been cut with damp wood, and the smiths are refusing to pay.',
    'A burn in the woods got out of hand last month, and someone is saying it was set.',
    'The landowner wants a bigger share of the wood they cut, or the stand closed to them.',
  ],
  'the quarry master': [
    'A worker was crushed at the face last month, and the crew says the shoring was skimped to save money.',
    'The best stone in the quarry has been promised to two buyers.',
    'Blasting has opened a cavity in the rock face that nobody has gone into yet.',
  ],
  'the warehouse factor': [
    'The stock in one bay counts right on paper and short on the floor.',
    'A merchant has asked them to store goods without writing them down, for a fee.',
    'Someone has been sleeping in the loft above the stores, and leaving no trace but warmth.',
  ],
  'the pawnbroker': [
    'A ring pawned last week belongs to a family that says it was never sold.',
    'Someone keeps redeeming the same cheap pledge, each time with a different name.',
    'They hold an item nobody has come back for, and three people have now asked about it.',
  ],
  'the cartographer': [
    'A patron has paid them to leave a valley off the new map, and will not say why.',
    'Their best survey shows a road that was never built, and someone is selling land along it.',
    'Two of their old maps disagree about where a boundary runs, and both neighbours have a copy.',
  ],
  'the master fishmonger': [
    'Fish is being sold in the market cheaper than they can buy it, and nobody knows where it comes from.',
    'A buyer has been taking the whole catch every morning before the stalls open, paying in coin nobody recognises.',
    'Their scales have been tampered with, and the customers are blaming them.',
  ],
  'the innkeeper': [
    'A guest has paid a month ahead and never leaves the room, and the maid says the bed is never slept in.',
    'Two travellers who arrived separately were seen talking like old friends in the yard.',
    'Someone has been listening through the floor of their best room, and they have found the gap in the boards.',
  ],
  "the network's spider": [
    'One of their informants is feeding them lies, and they do not yet know which.',
    'A message meant for them reached someone else first.',
    'Someone has started paying their people more for the same work.',
  ],
  'the ropemaker': [
    'A rope of theirs parted under load last month, and someone was hurt; they say it was cut.',
    'A buyer has ordered more rope than any honest trade needs, and paid in advance.',
    'Their hemp has come in short and poor two seasons running, from the same supplier.',
  ],
  'the lodge master': [
    'A member has asked to resign and will not say why, which has never happened before.',
    'Someone outside the lodge has been repeating what is said inside it.',
    'The lodge\'s oldest rule would bar its richest new member, and the member does not know.',
  ],
  'the toll-keeper': [
    'A carter has been passing without paying on a paper they swear was forged.',
    'The takings at the toll have risen, but less than the traffic has.',
    'Someone has offered them a share to look the other way on one night each month.',
  ],
  'the undercity boss': [
    'A tunnel they did not dig has opened into one of theirs.',
    'Their lieutenants have started meeting without them.',
    'Someone above ground is paying for maps of their passages.',
  ],
  'the black marketeer': [
    'A buyer has asked for something they can get, and should not sell.',
    'Their supplier has gone quiet, and the goods have started arriving anyway.',
    'Someone is selling copies of their goods under their name.',
  ],
  'the glassmaker': [
    'A batch of their glass has come out with a colour they cannot make again, and a buyer wants more.',
    'Their furnace was found cold one morning with the door barred from inside.',
    'An apprentice has run off with the recipe for their clearest glass.',
  ],
  'the coaching-inn keeper': [
    'A coach came in with one passenger fewer than it left with, and the driver will not talk.',
    'Their best horses have been swapped for poorer ones overnight.',
    'A traveller left a locked case in their care a year ago and has written to say someone else will collect it.',
  ],
  'the master smith': [
    'A customer has ordered blades without hilts, many of them, and paid in advance.',
    'Their apprentice has been working the forge at night on something the apprentice will not show them.',
    'A tool of theirs was found where a theft took place.',
  ],
  'the cobbler': [
    'A pair of boots left for mending had something sewn into the sole.',
    'A customer paid with a coin from a mint that closed before they were born.',
    'Someone has been leaving their footprints, in boots of their making, at the scene of break-ins.',
  ],
  'the lanista': [
    'Their best fighter has bought their own freedom with money nobody can account for.',
    'A patron wants a fighter killed in the ring, and has offered a fortune for it.',
    'Two of their fighters have sworn to kill each other outside the arena.',
  ],
  'the guildmaster of thieves': [
    'A job went wrong because someone inside the guild talked.',
    'A crew has started working their streets without paying the guild its share.',
    'They have been offered amnesty, and the offer came with a name they are expected to give.',
  ],
  'the banker': [
    'A large loan they made has been called in by someone who bought the debt from them in their own name.',
    'Two depositors have asked for all their money on the same morning.',
    'A borrower has died, and the security for the loan turns out to belong to someone else.',
  ],
  'the master furrier': [
    'Pelts are coming to market with marks of a trap nobody here sets.',
    'A buyer has asked for a coat of a fur that is meant to be forbidden.',
    'Their trappers have stopped going to the north woods, and will not say why.',
  ],
  'the auctioneer': [
    'An item sold last month has been claimed by its true owner, who says it was stolen.',
    'Someone keeps bidding against the same buyer, and never wins.',
    'The heirs to an estate they are selling have not all agreed to the sale.',
  ],
  "the hospital's master": [
    'Medicines are going missing from the stores, and the count is always the same.',
    'A patient brought in last week is not who they said they were.',
    'A rich patron wants a bed kept free for someone who has not arrived yet.',
  ],
  'the dyer': [
    'The river below their vats has turned the wrong colour, and the fishers are blaming them.',
    'A buyer wants cloth dyed in a colour only one family is allowed to wear.',
    'Their mordant has been cut with something that fades in a month.',
  ],
  'the stable master': [
    'A horse in their care died in the night, and its owner wants to know why.',
    'Someone hires a fast horse every new moon and brings it back lathered before dawn.',
    'A horse left with them has a brand that was burned over another.',
  ],
  'the chandler': [
    'Their candles have been sputtering and spitting, and someone has found grit in the wax.',
    'A customer buys enough lamp oil every week to light a hall, and lives alone.',
    'A rival is selling candles at a price that cannot cover the wax.',
  ],
  'the impresario': [
    'Their star performer has received a letter that has frightened them into silence.',
    'A show they staged last season is being copied, word for word, by another company.',
    'A patron has paid for a performance in a private house, and asked them to forget the address.',
  ],
  'the bath-keeper': [
    'Two men meet in the steam room every week and speak in a language nobody here knows.',
    'Someone has been taking the clothes of bathers and returning them, searched.',
    'The water has started running foul, and the cause is upstream of them.',
  ],
  'the fuller': [
    'Cloth came back from their works shorter than it went in, and the weaver says it was cut.',
    'Their fulling earth has run out, and the only seller wants double.',
    'An apprentice has been taking cloth out at night and bringing it back by morning.',
  ],
  'the skydock master': [
    'A vessel came in with its manifest torn out.',
    'A berth has been paid for, for a year, by a vessel nobody has seen.',
    'Two crews have been fighting over the same berth, and both have papers.',
  ],
  'the grove elder': [
    'An old tree in the grove has been cut in the night, cleanly, and the wood taken.',
    'A family wants to bury their dead in the grove, against its custom.',
    'Someone has been leaving offerings in the grove that nobody here makes.',
  ],
});

/** The titles keyed here, for the pinned coverage arm. */
export const PERSON_HOOK_TITLES = Object.freeze(Object.keys(PERSON_HOOKS_BY_TITLE));
