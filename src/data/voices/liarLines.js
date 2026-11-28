/**
 * data/voices/liarLines.js — THE LIAR'S LINES (S-G1; VOICES-LINES' `D-liar-lines.tsv` at 4116f40b2). ⛔ GENERATED ONCE by
 * `node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>`; after that load this file is the lines' home,
 * fingerprinted and banked as the said lines are.
 *
 * Filed by group: the tie's way through the holder's own house and its family (`office.hall`, `office.faith`,
 * `front.trade`, `front.other`, `retainer`) and the criminal house's kind (`smuggling`, `blackmarket`, `theft`,
 * `secrets`, `killing`, `extortion`, `tunnels`). Each line: its `id`, what it `touches`, what tie it `fits`, its four
 * `versions`, the false claim, and `inTruth`: THE DM'S NOTE, shown only on the owner's own page, never to a reader.
 *
 * Pure data, no logic. Read by `domain/voices/voicePlan.js` alone.
 */

/** @template T @param {T} v @returns {T} */
function deepFreeze(v) {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.freeze(v); for (const x of Object.values(v)) deepFreeze(x); }
  return v;
}

export const LIAR_LINES = deepFreeze({
  'office.hall': [
    { id: 'LIE.office.hall.1', touches: 'the holder\'s office: what gets inspected', fits: 'via office; the holder\'s house is of the hall or watch family (a magistrate, a customs collector, a watch officer, a castellan)', falseClaim: 'every load is inspected', inTruth: 'the holder waves the criminal house\'s loads through',
      versions: {
        welcoming: 'The inspectors here are thorough, and fair with it.',
        transactional: 'Every load pays its toll, down to the last coin.',
        cautious: 'Nothing gets past the checks here without being seen.',
        dismissive: 'Every cart gets checked.',
      } },
    { id: 'LIE.office.hall.2', touches: 'the holder\'s office: permits and leave', fits: 'via office; the holder\'s house is of the hall or watch family (a magistrate, a customs collector, a watch officer, a castellan)', falseClaim: 'permits are granted fairly', inTruth: 'permits are sold to the criminal house\'s people',
      versions: {
        welcoming: 'Anyone who asks properly gets a fair hearing for a permit.',
        transactional: 'Permits cost the same for everyone, rich or poor.',
        cautious: 'Nobody has ever bought a permit here, as far as anyone knows.',
        dismissive: 'Fair permits only.',
      } },
    { id: 'LIE.office.hall.3', touches: 'the holder\'s office: complaints of wrongdoing', fits: 'via office; the holder\'s house is of the hall or watch family (a magistrate, a customs collector, a watch officer, a castellan)', falseClaim: 'every complaint is pursued', inTruth: 'complaints that touch the criminal house are quietly dropped',
      versions: {
        welcoming: 'Every complaint of theft gets someone sent round.',
        transactional: 'Chasing complaints costs time, but every one is chased.',
        cautious: 'Complaints that go quiet usually just got settled.',
        dismissive: 'Every complaint\'s followed up.',
      } },
    { id: 'LIE.office.hall.4', touches: 'the holder\'s office: rulings', fits: 'via office; the holder\'s house is of the hall or watch family (a magistrate, a customs collector, a watch officer, a castellan)', falseClaim: 'rulings are impartial', inTruth: 'rulings are bent for the criminal house',
      versions: {
        welcoming: 'The same rules apply to everyone here, high or low.',
        transactional: 'Fines here are the same whoever pays them.',
        cautious: 'Nobody important has ever had a ruling bent for them here.',
        dismissive: 'Rules are rules.',
      } },
  ],
  'office.faith': [
    { id: 'LIE.office.faith.1', touches: 'the holder\'s house: where its money goes', fits: 'via office; the holder\'s house is of the temple, care or learning family (a priest, an almoner, a healer, a mage)', falseClaim: 'gifts reach the poor in full', inTruth: 'part of what is given passes to the criminal house',
      versions: {
        welcoming: 'Every gift given here goes straight to those who need it.',
        transactional: 'Every coin given here is spent on the poor and written down.',
        cautious: 'The gifts all go to the poor, as they always have.',
        dismissive: 'Gifts go to the poor.',
      } },
    { id: 'LIE.office.faith.2', touches: 'the holder\'s house: who comes there', fits: 'via office; the holder\'s house is of the temple, care or learning family (a priest, an almoner, a healer, a mage)', falseClaim: 'only the needy visit', inTruth: 'the criminal house\'s people meet there, often at night',
      versions: {
        welcoming: 'Only people in need of help come here.',
        transactional: 'Late visitors here are only the sick and the troubled.',
        cautious: 'Nobody comes here at night except to pray.',
        dismissive: 'Only the needy come.',
      } },
    { id: 'LIE.office.faith.3', touches: 'the place as the holder speaks of it', fits: 'via office; the holder\'s house is of the temple, care or learning family (a priest, an almoner, a healer, a mage)', falseClaim: 'there is no organised crime', inTruth: 'a criminal house works the place, and the holder knows it',
      versions: {
        welcoming: 'This is a good, honest place, full of decent people.',
        transactional: 'There\'s no money in crime here. Nobody\'s rich enough.',
        cautious: 'Nothing organised goes on here. Just the odd sinner.',
        dismissive: 'Honest place.',
      } },
  ],
  'front.trade': [
    { id: 'LIE.front.trade.1', touches: 'the holder\'s own house: its books', fits: 'via front; the holder\'s house is a trading house (market, inn, workshop, grain, pit or water family)', falseClaim: 'the house\'s accounts are clean', inTruth: 'the books hide the criminal house\'s money passing through',
      versions: {
        welcoming: 'Anyone may look at the books, and plenty have.',
        transactional: 'Every sale gets written down, however small.',
        cautious: 'The books here have never had a question asked of them.',
        dismissive: 'Clean books.',
      } },
    { id: 'LIE.front.trade.2', touches: 'the holder\'s own house: its deliveries', fits: 'via front; the holder\'s house is a trading house (market, inn, workshop, grain, pit or water family)', falseClaim: 'nothing comes to the house by night', inTruth: 'loads for the criminal house come in after dark',
      versions: {
        welcoming: 'The carts come in daylight, where everyone can wave.',
        transactional: 'Every load here is bought and paid for in full.',
        cautious: 'Nothing comes into this yard after dark.',
        dismissive: 'Daytime deliveries only.',
      } },
    { id: 'LIE.front.trade.3', touches: 'the holder\'s own house: its stock', fits: 'via front; the holder\'s house is a trading house (market, inn, workshop, grain, pit or water family)', falseClaim: 'the stock is honestly come by', inTruth: 'some of the stock is stolen or smuggled and sold on through the house',
      versions: {
        welcoming: 'Everything sold here came from honest hands.',
        transactional: 'Prices here are fair because the stock is bought fair.',
        cautious: 'There\'s nothing here anyone would need to hide.',
        dismissive: 'All honest goods.',
      } },
    { id: 'LIE.front.trade.4', touches: 'the holder\'s own house: its takings', fits: 'via front; the holder\'s house is a trading house (market, inn, workshop, grain, pit or water family)', falseClaim: 'the takings are modest and honest', inTruth: 'the house takes in more than its trade could earn: money washed through it',
      versions: {
        welcoming: 'Business is slow, but the regulars keep it going.',
        transactional: 'Takings are modest, and every coin of them honest.',
        cautious: 'Trade\'s been slow lately, nobody\'s sure why.',
        dismissive: 'Slow, but honest.',
      } },
    { id: 'LIE.front.trade.5', touches: 'the holder\'s own house: who comes in', fits: 'via front; the holder\'s house is a trading house (market, inn, workshop, grain, pit or water family)', falseClaim: 'no one but customers visits', inTruth: 'the criminal house\'s people meet there',
      versions: {
        welcoming: 'Only customers and old friends come through that door.',
        transactional: 'Nobody comes here unless they\'re buying.',
        cautious: 'The back door is only ever used for deliveries.',
        dismissive: 'Customers only.',
      } },
  ],
  'front.other': [
    { id: 'LIE.front.other.1', touches: 'the holder\'s own house: its money', fits: 'via front; the holder\'s house is of any other family (temple, care, learning, show, field)', falseClaim: 'the house\'s money is what it seems', inTruth: 'the house carries money for the criminal house',
      versions: {
        welcoming: 'What comes in here is spent on the work, every bit.',
        transactional: 'Every fee here goes on upkeep, and there\'s never any left.',
        cautious: 'Nothing here pays better than it looks.',
        dismissive: 'Nothing to hide.',
      } },
    { id: 'LIE.front.other.2', touches: 'the holder\'s own house: what happens after dark', fits: 'via front; the holder\'s house is of any other family (temple, care, learning, show, field)', falseClaim: 'the house is shut at night', inTruth: 'the criminal house uses it after dark',
      versions: {
        welcoming: 'The house is quiet at night, and everyone goes home.',
        transactional: 'Nobody\'s paid to be here after dark, so nobody is.',
        cautious: 'Nothing goes on here after the doors are locked.',
        dismissive: 'Locked at dark.',
      } },
  ],
  'retainer': [
    { id: 'LIE.retainer.1', touches: 'what the hired hand sees: the night', fits: 'via retainer; any lawful house', falseClaim: 'nothing moves unseen at night', inTruth: 'the holder carries for the criminal house at night',
      versions: {
        welcoming: 'The nights here are quiet, and everyone sleeps well.',
        transactional: 'Every load at night gets counted and paid for.',
        cautious: 'Not much moves at night without someone noticing.',
        dismissive: 'Nothing moves at night.',
      } },
    { id: 'LIE.retainer.2', touches: 'what the hired hand carries: the loads', fits: 'via retainer; any lawful house', falseClaim: 'the loads are as declared', inTruth: 'goods for the criminal house are hidden in ordinary loads',
      versions: {
        welcoming: 'Every load here goes out exactly as it came in.',
        transactional: 'The loads weigh what the bill says, every time.',
        cautious: 'Nobody opens the crates here, because nobody needs to.',
        dismissive: 'Loads are honest.',
      } },
    { id: 'LIE.retainer.3', touches: 'what the hired hand sees: visitors', fits: 'via retainer; any lawful house', falseClaim: 'no one unusual visits', inTruth: 'the holder\'s handler meets people there',
      versions: {
        welcoming: 'Everyone who comes round here is known to someone.',
        transactional: 'Nobody worth watching ever comes through here.',
        cautious: 'No strangers meet here, not that anyone\'s seen.',
        dismissive: 'Nobody unusual.',
      } },
    { id: 'LIE.retainer.4', touches: 'what the hired hand is paid', fits: 'via retainer; any lawful house', falseClaim: 'the holder lives on ordinary wages', inTruth: 'the holder is paid well by the criminal house on the side',
      versions: {
        welcoming: 'The pay\'s ordinary, but the work is steady.',
        transactional: 'Wages here barely cover the rent.',
        cautious: 'Nobody here is doing better than they let on.',
        dismissive: 'Ordinary pay.',
      } },
  ],
  'smuggling': [
    { id: 'LIE.smuggling.1', touches: 'smuggling: what comes in', fits: 'the criminal house is a smuggling network, operation or waypoint; any via', falseClaim: 'all goods pay toll', inTruth: 'smuggled goods come in untaxed',
      versions: {
        welcoming: 'Everything that comes in here pays its way honestly.',
        transactional: 'Every load pays its toll, and the tolls are high.',
        cautious: 'Nothing gets in without being counted.',
        dismissive: 'Everything pays its toll.',
      } },
    { id: 'LIE.smuggling.2', touches: 'smuggling: whether it happens', fits: 'the criminal house is a smuggling network, operation or waypoint; any via', falseClaim: 'there is no smuggling', inTruth: 'the place is a smugglers\' route',
      versions: {
        welcoming: 'People here are too honest to bother with smuggling.',
        transactional: 'There\'s no profit in smuggling here. The taxes are too low.',
        cautious: 'Smugglers seem to go somewhere else, from what\'s said.',
        dismissive: 'No smugglers here.',
      } },
    { id: 'LIE.smuggling.3', touches: 'smuggling: movement at night', fits: 'the criminal house is a smuggling network, operation or waypoint; any via', falseClaim: 'the night traffic is innocent', inTruth: 'the night traffic is the smugglers\'',
      versions: {
        welcoming: 'Anyone out at night is just getting an early start.',
        transactional: 'Carts before dawn beat the heat and the crowds, that\'s all.',
        cautious: 'People moving at night are mostly early risers, it seems.',
        dismissive: 'Early risers.',
      } },
    { id: 'LIE.smuggling.4', touches: 'smuggling: goods from outside', fits: 'the criminal house is a smuggling network, operation or waypoint; any via', falseClaim: 'outside goods come in lawfully', inTruth: 'much of what comes from outside comes in hidden',
      versions: {
        welcoming: 'Outside goods come in the proper way, like everything else.',
        transactional: 'Outside goods cost what they cost because they pay their toll.',
        cautious: 'Nothing from outside turns up here that shouldn\'t.',
        dismissive: 'Proper way only.',
      } },
  ],
  'blackmarket': [
    { id: 'LIE.blackmarket.1', touches: 'the hidden market: open trade', fits: 'the criminal house is a black market or bazaar, or a fence; any via', falseClaim: 'all trade is open', inTruth: 'a hidden market trades untaxed and stolen goods',
      versions: {
        welcoming: 'Everything here is sold in the open, where people can see.',
        transactional: 'Every sale here gets taxed, and there\'s no other way.',
        cautious: 'No trade here happens out of sight, as far as anyone knows.',
        dismissive: 'All trade\'s in the open.',
      } },
    { id: 'LIE.blackmarket.2', touches: 'the hidden market: what can be had', fits: 'the criminal house is a black market or bazaar, or a fence; any via', falseClaim: 'nothing is sold under the counter', inTruth: 'almost anything can be had, for a price, through the hidden market',
      versions: {
        welcoming: 'What can\'t be bought honestly here can\'t be bought at all.',
        transactional: 'Nothing\'s sold under the counter. There\'s no money in it.',
        cautious: 'Nobody\'s ever offered anything odd here, not that anyone says.',
        dismissive: 'Can\'t be had here.',
      } },
    { id: 'LIE.blackmarket.3', touches: 'the hidden market: prices', fits: 'the criminal house is a black market or bazaar, or a fence; any via', falseClaim: 'no one undercuts honest trade', inTruth: 'untaxed goods undercut the honest sellers',
      versions: {
        welcoming: 'The honest sellers here look after each other.',
        transactional: 'Nobody undercuts the honest sellers here.',
        cautious: 'Cheap goods here are just cheap, nothing more.',
        dismissive: 'No undercutting.',
      } },
    { id: 'LIE.blackmarket.4', touches: 'the hidden market: stolen goods', fits: 'the criminal house is a black market or bazaar, or a fence; any via', falseClaim: 'stolen goods cannot be sold', inTruth: 'stolen goods sell readily through the hidden market',
      versions: {
        welcoming: 'People here would know their own things anywhere.',
        transactional: 'Nobody would pay for stolen goods. They\'re too easy to spot.',
        cautious: 'Stolen things would be hard to sell here, probably.',
        dismissive: 'Stolen goods won\'t sell here.',
      } },
  ],
  'theft': [
    { id: 'LIE.theft.1', touches: 'theft: who steals', fits: 'the criminal house is a thieves\' guild or chapter, a fence or a rookery; any via', falseClaim: 'theft is petty and unorganised', inTruth: 'an organised ring of thieves works the place',
      versions: {
        welcoming: 'What little goes missing is taken by hungry children, poor things.',
        transactional: 'The odd thing goes missing, but it\'s never worth much.',
        cautious: 'Small things go missing, nothing more, it seems.',
        dismissive: 'Just hungry children.',
      } },
    { id: 'LIE.theft.2', touches: 'theft: how much', fits: 'the criminal house is a thieves\' guild or chapter, a fence or a rookery; any via', falseClaim: 'there is little theft', inTruth: 'theft is steady and organised',
      versions: {
        welcoming: 'People still leave their doors open here.',
        transactional: 'Thieves don\'t bother with this place. There\'s nothing worth taking.',
        cautious: 'Not much goes missing, from what\'s said.',
        dismissive: 'Nothing goes missing.',
      } },
    { id: 'LIE.theft.3', touches: 'theft: what happens to stolen things', fits: 'the criminal house is a thieves\' guild or chapter, a fence or a rookery; any via', falseClaim: 'stolen goods are recovered', inTruth: 'stolen goods are sold on and never seen again',
      versions: {
        welcoming: 'Stolen things usually find their way back to their owners.',
        transactional: 'Stolen goods turn up quickly, because nobody can sell them.',
        cautious: 'Most stolen things turn up again, sooner or later.',
        dismissive: 'Things turn up again.',
      } },
    { id: 'LIE.theft.4', touches: 'theft: whether thieves are organised', fits: 'the criminal house is a thieves\' guild or chapter, a fence or a rookery; any via', falseClaim: 'thieves work alone', inTruth: 'the thieves are organised and pay a share upward',
      versions: {
        welcoming: 'The odd thief here works alone and gets caught soon enough.',
        transactional: 'There\'s no money here to pay a gang of thieves.',
        cautious: 'Thieves here seem to work alone.',
        dismissive: 'Thieves work alone here.',
      } },
  ],
  'secrets': [
    { id: 'LIE.secrets.1', touches: 'the trade in secrets: gossip', fits: 'the criminal house is a whisper market; any via', falseClaim: 'no one trades in what they know', inTruth: 'what people know is bought and sold',
      versions: {
        welcoming: 'People here gossip, but kindly, and nothing comes of it.',
        transactional: 'Gossip is free here. Nobody would pay for it.',
        cautious: 'Nobody sells what they know about their neighbours, not here.',
        dismissive: 'Gossip\'s free.',
      } },
    { id: 'LIE.secrets.2', touches: 'the trade in secrets: confidences', fits: 'the criminal house is a whisper market; any via', falseClaim: 'confidences are kept', inTruth: 'confidences are sold',
      versions: {
        welcoming: 'A secret told here stays between friends.',
        transactional: 'Secrets aren\'t worth anything here. Nobody\'s buying.',
        cautious: 'Secrets here mostly stay secret, it seems.',
        dismissive: 'Secrets stay secret.',
      } },
    { id: 'LIE.secrets.3', touches: 'the trade in secrets: letters', fits: 'the criminal house is a whisper market; any via', falseClaim: 'letters travel unread', inTruth: 'letters are opened and their news sold',
      versions: {
        welcoming: 'Letters here reach the right hands, still sealed.',
        transactional: 'Letters are carried sealed and safe, and that\'s what people pay for.',
        cautious: 'Letters usually arrive sealed, as far as anyone knows.',
        dismissive: 'Letters arrive sealed.',
      } },
  ],
  'killing': [
    { id: 'LIE.killing.1', touches: 'killing for pay: deaths', fits: 'the criminal house is an assassins\' guild or a contract killer; any via', falseClaim: 'deaths in the place are natural', inTruth: 'killing can be bought here',
      versions: {
        welcoming: 'People here mostly live to a good old age.',
        transactional: 'Nobody here has enemies worth paying to be rid of.',
        cautious: 'Deaths here are natural, mostly, it seems.',
        dismissive: 'People die of old age here.',
      } },
    { id: 'LIE.killing.2', touches: 'killing for pay: accidents', fits: 'the criminal house is an assassins\' guild or a contract killer; any via', falseClaim: 'accidents are only accidents', inTruth: 'some accidents are paid for',
      versions: {
        welcoming: 'Accidents happen, sadly, and everyone helps the family after.',
        transactional: 'Accidents happen, and nobody gains from them.',
        cautious: 'Accidents do happen. That\'s all, surely.',
        dismissive: 'Accidents happen.',
      } },
  ],
  'extortion': [
    { id: 'LIE.extortion.1', touches: 'extortion: the traders', fits: 'the criminal house is a street gang or several criminal factions; any via', falseClaim: 'traders pay no one but the tax', inTruth: 'traders pay for protection',
      versions: {
        welcoming: 'The traders here look out for each other, and nobody bothers them.',
        transactional: 'The traders here pay their taxes and nothing else.',
        cautious: 'Traders here don\'t seem to pay anyone extra.',
        dismissive: 'Nobody leans on traders.',
      } },
    { id: 'LIE.extortion.2', touches: 'extortion: safety at night', fits: 'the criminal house is a street gang or several criminal factions; any via', falseClaim: 'the place is safe at night', inTruth: 'the night belongs to the gangs, and safety is bought',
      versions: {
        welcoming: 'People walk home late here without worrying.',
        transactional: 'Nobody pays to walk safely at night here. It\'s safe already.',
        cautious: 'It\'s mostly safe at night, it seems.',
        dismissive: 'Safe at night.',
      } },
    { id: 'LIE.extortion.3', touches: 'extortion: who hangs about', fits: 'the criminal house is a street gang or several criminal factions; any via', falseClaim: 'there is no gang', inTruth: 'the young ones on the corners are a gang\'s eyes, and businesses that would not pay are driven out',
      versions: {
        welcoming: 'The young ones on the corners are harmless, just bored.',
        transactional: 'Nobody here pays a gang to be left alone.',
        cautious: 'Businesses close sometimes. Hard times, probably.',
        dismissive: 'No gangs here.',
      } },
  ],
  'tunnels': [
    { id: 'LIE.tunnels.1', touches: 'the tunnels: the cellars', fits: 'the criminal house is an underground city or network; any via', falseClaim: 'the cellars are only cellars', inTruth: 'some cellars open on passages used by the criminal house',
      versions: {
        welcoming: 'The cellars here are just cellars, full of old jars.',
        transactional: 'The cellars hold stores, and nothing worth the digging.',
        cautious: 'The cellars are only for storage, as far as anyone knows.',
        dismissive: 'Just cellars.',
      } },
    { id: 'LIE.tunnels.2', touches: 'the tunnels: what is below', fits: 'the criminal house is an underground city or network; any via', falseClaim: 'there is nothing below the place', inTruth: 'there are passages and rooms below, in use',
      versions: {
        welcoming: 'The old stories about tunnels are just stories for children.',
        transactional: 'There\'s nothing under here worth anyone\'s time.',
        cautious: 'There\'s nothing much down below, it seems.',
        dismissive: 'Nothing down there.',
      } },
  ],
});
