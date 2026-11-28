/**
 * data/voices/liarLines.js — THE LIAR'S LINES (S-G1; VOICES-LINES' `D-liar-lines.tsv` at 4116f40b2). ⛔ GENERATED ONCE by
 * `node scripts/gen-voices-lines.mjs <C-said-lines.tsv> <D-liar-lines.tsv>`; after that load this file is the lines' home,
 * fingerprinted and banked as the said lines are.
 *
 * Each line: its `id`; `inTruth`; the `needs` and `excludes` its DM note presumes; and its four versions, each
 * `{ text, needs, excludes }` as the said lines'. Filed by group: the tie's way through the holder's own house and its family (`office.hall`, `office.faith`,
 * `front.trade`, `front.other`, `retainer`) and the criminal house's kind (`smuggling`, `blackmarket`, `theft`,
 * `secrets`, `killing`, `extortion`, `tunnels`). `inTruth` is THE DM'S NOTE, shown only on the owner's own page,
 * never to a reader. What each line touches and what tie it fits are the writer's notes, kept in the TSV.
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
    { id: 'LIE.office.hall.1', inTruth: 'the holder waves the criminal house\'s loads through',
      versions: {
        welcoming: { text: 'The inspectors here are thorough, and fair with it.' },
        transactional: { text: 'Every load pays its toll, down to the last coin.' },
        cautious: { text: 'Nothing gets past the checks here without being seen.' },
        dismissive: { text: 'Every cart gets checked.' },
      } },
    { id: 'LIE.office.hall.2', inTruth: 'permits are sold to the criminal house\'s people',
      versions: {
        welcoming: { text: 'Anyone who asks properly gets a fair hearing for a permit.' },
        transactional: { text: 'Permits cost the same for everyone, rich or poor.' },
        cautious: { text: 'Nobody has ever bought a permit here, as far as anyone knows.' },
        dismissive: { text: 'Fair permits only.' },
      } },
    { id: 'LIE.office.hall.3', inTruth: 'complaints that touch the criminal house are quietly dropped',
      versions: {
        welcoming: { text: 'Every complaint of theft gets someone sent round.' },
        transactional: { text: 'Chasing complaints costs time, but every one is chased.' },
        cautious: { text: 'Complaints that go quiet usually just got settled.' },
        dismissive: { text: 'Every complaint\'s followed up.' },
      } },
    { id: 'LIE.office.hall.4', inTruth: 'rulings are bent for the criminal house',
      versions: {
        welcoming: { text: 'The same rules apply to everyone here, high or low.' },
        transactional: { text: 'Fines here are the same whoever pays them.' },
        cautious: { text: 'Nobody important has ever had a ruling bent for them here.' },
        dismissive: { text: 'Rules are rules.' },
      } },
  ],
  'office.faith': [
    { id: 'LIE.office.faith.1', inTruth: 'part of what is given passes to the criminal house',
      versions: {
        welcoming: { text: 'Every gift given here goes straight to those who need it.' },
        transactional: { text: 'Every coin given here is spent on the poor and written down.' },
        cautious: { text: 'The gifts all go to the poor, as they always have.' },
        dismissive: { text: 'Gifts go to the poor.' },
      } },
    { id: 'LIE.office.faith.2', inTruth: 'the criminal house\'s people meet there, often at night',
      versions: {
        welcoming: { text: 'Only people in need of help come here.' },
        transactional: { text: 'Late visitors here are only the sick and the troubled.' },
        cautious: { text: 'Nobody comes here at night except to pray.' },
        dismissive: { text: 'Only the needy come.' },
      } },
    { id: 'LIE.office.faith.3', inTruth: 'a criminal house works the place, and the holder knows it',
      versions: {
        welcoming: { text: 'This is a good, honest place, full of decent people.' },
        transactional: { text: 'There\'s no money in crime here. Nobody\'s rich enough.' },
        cautious: { text: 'Nothing organised goes on here. Just the odd sinner.' },
        dismissive: { text: 'Honest place.' },
      } },
  ],
  'front.trade': [
    { id: 'LIE.front.trade.1', inTruth: 'the books hide the criminal house\'s money passing through',
      versions: {
        welcoming: { text: 'Anyone may look at the books, and plenty have.' },
        transactional: { text: 'Every sale gets written down, however small.' },
        cautious: { text: 'The books here have never had a question asked of them.' },
        dismissive: { text: 'Clean books.' },
      } },
    { id: 'LIE.front.trade.2', inTruth: 'loads for the criminal house come in after dark',
      versions: {
        welcoming: { text: 'The carts come in daylight, where everyone can wave.', excludes: ['crisis: under_siege'] },
        transactional: { text: 'Every load here is bought and paid for in full.' },
        cautious: { text: 'Nothing comes into this yard after dark.' },
        dismissive: { text: 'Daytime deliveries only.' },
      } },
    { id: 'LIE.front.trade.3', inTruth: 'some of the stock is stolen or smuggled and sold on through the house',
      versions: {
        welcoming: { text: 'Everything sold here came from honest hands.' },
        transactional: { text: 'Prices here are fair because the stock is bought fair.' },
        cautious: { text: 'There\'s nothing here anyone would need to hide.' },
        dismissive: { text: 'All honest goods.' },
      } },
    { id: 'LIE.front.trade.4', inTruth: 'the house takes in more than its trade could earn: money washed through it',
      versions: {
        welcoming: { text: 'Business is slow, but the regulars keep it going.' },
        transactional: { text: 'Takings are modest, and every coin of them honest.' },
        cautious: { text: 'Trade\'s been slow lately, nobody\'s sure why.' },
        dismissive: { text: 'Slow, but honest.' },
      } },
    { id: 'LIE.front.trade.5', inTruth: 'the criminal house\'s people meet there',
      versions: {
        welcoming: { text: 'Only customers and old friends come through that door.' },
        transactional: { text: 'Nobody comes here unless they\'re buying.' },
        cautious: { text: 'The back door is only ever used for deliveries.' },
        dismissive: { text: 'Customers only.' },
      } },
  ],
  'front.other': [
    { id: 'LIE.front.other.1', inTruth: 'the house carries money for the criminal house',
      versions: {
        welcoming: { text: 'What comes in here is spent on the work, every bit.' },
        transactional: { text: 'Every fee here goes on upkeep, and there\'s never any left.' },
        cautious: { text: 'Nothing here pays better than it looks.' },
        dismissive: { text: 'Nothing to hide.' },
      } },
    { id: 'LIE.front.other.2', inTruth: 'the criminal house uses it after dark',
      versions: {
        welcoming: { text: 'The house is quiet at night, and everyone goes home.' },
        transactional: { text: 'Nobody\'s paid to be here after dark, so nobody is.' },
        cautious: { text: 'Nothing goes on here after the doors are locked.' },
        dismissive: { text: 'Locked at dark.' },
      } },
  ],
  'retainer': [
    { id: 'LIE.retainer.1', inTruth: 'the holder carries for the criminal house at night',
      versions: {
        welcoming: { text: 'The nights here are quiet, and everyone sleeps well.' },
        transactional: { text: 'Every load at night gets counted and paid for.' },
        cautious: { text: 'Not much moves at night without someone noticing.' },
        dismissive: { text: 'Nothing moves at night.' },
      } },
    { id: 'LIE.retainer.2', inTruth: 'goods for the criminal house are hidden in ordinary loads',
      versions: {
        welcoming: { text: 'Every load here goes out exactly as it came in.' },
        transactional: { text: 'The loads weigh what the bill says, every time.' },
        cautious: { text: 'Nobody opens the crates here, because nobody needs to.' },
        dismissive: { text: 'Loads are honest.' },
      } },
    { id: 'LIE.retainer.3', inTruth: 'the holder\'s handler meets people there',
      versions: {
        welcoming: { text: 'Everyone who comes round here is known to someone.' },
        transactional: { text: 'Nobody worth watching ever comes through here.' },
        cautious: { text: 'No strangers meet here, not that anyone\'s seen.' },
        dismissive: { text: 'Nobody unusual.' },
      } },
    { id: 'LIE.retainer.4', inTruth: 'the holder is paid well by the criminal house on the side',
      versions: {
        welcoming: { text: 'The pay\'s ordinary, but the work is steady.' },
        transactional: { text: 'Wages here barely cover the rent.' },
        cautious: { text: 'Nobody here is doing better than they let on.' },
        dismissive: { text: 'Ordinary pay.' },
      } },
  ],
  'smuggling': [
    { id: 'LIE.smuggling.1', inTruth: 'smuggled goods come in untaxed',
      versions: {
        welcoming: { text: 'Everything that comes in here pays its way honestly.' },
        transactional: { text: 'Every load pays its toll, and the tolls are high.' },
        cautious: { text: 'Nothing gets in without being counted.' },
        dismissive: { text: 'Everything pays its toll.' },
      } },
    { id: 'LIE.smuggling.2', inTruth: 'the place is a smugglers\' route',
      versions: {
        welcoming: { text: 'People here are too honest to bother with smuggling.', needs: ['house: smuggling'] },
        transactional: { text: 'There\'s no profit in smuggling here. The taxes are too low.' },
        cautious: { text: 'Smugglers seem to go somewhere else, from what\'s said.' },
        dismissive: { text: 'No smugglers here.' },
      } },
    { id: 'LIE.smuggling.3', inTruth: 'the night traffic is the smugglers\'', excludes: ['crisis: under_siege'],
      versions: {
        welcoming: { text: 'Anyone out at night is just getting an early start.' },
        transactional: { text: 'Carts before dawn beat the heat and the crowds, that\'s all.' },
        cautious: { text: 'People moving at night are mostly early risers, it seems.' },
        dismissive: { text: 'Early risers.' },
      } },
    { id: 'LIE.smuggling.4', inTruth: 'much of what comes from outside comes in hidden',
      versions: {
        welcoming: { text: 'Outside goods come in the proper way, like everything else.' },
        transactional: { text: 'Outside goods cost what they cost because they pay their toll.' },
        cautious: { text: 'Nothing from outside turns up here that shouldn\'t.' },
        dismissive: { text: 'Proper way only.' },
      } },
  ],
  'blackmarket': [
    { id: 'LIE.blackmarket.1', inTruth: 'a hidden market trades untaxed and stolen goods', needs: ['market'],
      versions: {
        welcoming: { text: 'Everything here is sold in the open, where people can see.' },
        transactional: { text: 'Every sale here gets taxed, and there\'s no other way.' },
        cautious: { text: 'No trade here happens out of sight, as far as anyone knows.' },
        dismissive: { text: 'All trade\'s in the open.' },
      } },
    { id: 'LIE.blackmarket.2', inTruth: 'almost anything can be had, for a price, through the hidden market', needs: ['market'],
      versions: {
        welcoming: { text: 'What can\'t be bought honestly here can\'t be bought at all.' },
        transactional: { text: 'Nothing\'s sold under the counter. There\'s no money in it.' },
        cautious: { text: 'Nobody\'s ever offered anything odd here, not that anyone says.' },
        dismissive: { text: 'Can\'t be had here.' },
      } },
    { id: 'LIE.blackmarket.3', inTruth: 'untaxed goods undercut the honest sellers',
      versions: {
        welcoming: { text: 'The honest sellers here look after each other.' },
        transactional: { text: 'Nobody undercuts the honest sellers here.' },
        cautious: { text: 'Cheap goods here are just cheap, nothing more.' },
        dismissive: { text: 'No undercutting.' },
      } },
    { id: 'LIE.blackmarket.4', inTruth: 'stolen goods sell readily through the hidden market', needs: ['market'],
      versions: {
        welcoming: { text: 'People here would know their own things anywhere.' },
        transactional: { text: 'Nobody would pay for stolen goods. They\'re too easy to spot.' },
        cautious: { text: 'Stolen things would be hard to sell here, probably.' },
        dismissive: { text: 'Stolen goods won\'t sell here.' },
      } },
  ],
  'theft': [
    { id: 'LIE.theft.1', inTruth: 'an organised ring of thieves works the place',
      versions: {
        welcoming: { text: 'What little goes missing is taken by hungry children, poor things.' },
        transactional: { text: 'The odd thing goes missing, but it\'s never worth much.' },
        cautious: { text: 'Small things go missing, nothing more, it seems.' },
        dismissive: { text: 'Just hungry children.' },
      } },
    { id: 'LIE.theft.2', inTruth: 'theft is steady and organised',
      versions: {
        welcoming: { text: 'People still leave their doors open here.' },
        transactional: { text: 'Thieves don\'t bother with this place. There\'s nothing worth taking.' },
        cautious: { text: 'Not much goes missing, from what\'s said.' },
        dismissive: { text: 'Nothing goes missing.' },
      } },
    { id: 'LIE.theft.3', inTruth: 'stolen goods are sold on and never seen again',
      versions: {
        welcoming: { text: 'Stolen things usually find their way back to their owners.' },
        transactional: { text: 'Stolen goods turn up quickly, because nobody can sell them.' },
        cautious: { text: 'Most stolen things turn up again, sooner or later.' },
        dismissive: { text: 'Things turn up again.' },
      } },
    { id: 'LIE.theft.4', inTruth: 'the thieves are organised and pay a share upward',
      versions: {
        welcoming: { text: 'The odd thief here works alone and gets caught soon enough.' },
        transactional: { text: 'There\'s no money here to pay a gang of thieves.' },
        cautious: { text: 'Thieves here seem to work alone.' },
        dismissive: { text: 'Thieves work alone here.' },
      } },
  ],
  'secrets': [
    { id: 'LIE.secrets.1', inTruth: 'what people know is bought and sold',
      versions: {
        welcoming: { text: 'People here gossip, but kindly, and nothing comes of it.' },
        transactional: { text: 'Gossip is free here. Nobody would pay for it.' },
        cautious: { text: 'Nobody sells what they know about their neighbours, not here.' },
        dismissive: { text: 'Gossip\'s free.' },
      } },
    { id: 'LIE.secrets.2', inTruth: 'confidences are sold',
      versions: {
        welcoming: { text: 'A secret told here stays between friends.' },
        transactional: { text: 'Secrets aren\'t worth anything here. Nobody\'s buying.' },
        cautious: { text: 'Secrets here mostly stay secret, it seems.' },
        dismissive: { text: 'Secrets stay secret.' },
      } },
    { id: 'LIE.secrets.3', inTruth: 'letters are opened and their news sold',
      versions: {
        welcoming: { text: 'Letters here reach the right hands, still sealed.' },
        transactional: { text: 'Letters are carried sealed and safe, and that\'s what people pay for.' },
        cautious: { text: 'Letters usually arrive sealed, as far as anyone knows.' },
        dismissive: { text: 'Letters arrive sealed.' },
      } },
  ],
  'killing': [
    { id: 'LIE.killing.1', inTruth: 'killing can be bought here',
      versions: {
        welcoming: { text: 'People here mostly live to a good old age.' },
        transactional: { text: 'Nobody here has enemies worth paying to be rid of.' },
        cautious: { text: 'Deaths here are natural, mostly, it seems.' },
        dismissive: { text: 'People die of old age here.' },
      } },
    { id: 'LIE.killing.2', inTruth: 'some accidents are paid for',
      versions: {
        welcoming: { text: 'Accidents happen, sadly, and everyone helps the family after.' },
        transactional: { text: 'Accidents happen, and nobody gains from them.' },
        cautious: { text: 'Accidents do happen. That\'s all, surely.' },
        dismissive: { text: 'Accidents happen.' },
      } },
  ],
  'extortion': [
    { id: 'LIE.extortion.1', inTruth: 'traders pay for protection',
      versions: {
        welcoming: { text: 'The traders here look out for each other, and nobody bothers them.' },
        transactional: { text: 'The traders here pay their taxes and nothing else.' },
        cautious: { text: 'Traders here don\'t seem to pay anyone extra.' },
        dismissive: { text: 'Nobody leans on traders.' },
      } },
    { id: 'LIE.extortion.2', inTruth: 'the night belongs to the gangs, and safety is bought',
      versions: {
        welcoming: { text: 'People walk home late here without worrying.' },
        transactional: { text: 'Nobody pays to walk safely at night here. It\'s safe already.' },
        cautious: { text: 'It\'s mostly safe at night, it seems.' },
        dismissive: { text: 'Safe at night.' },
      } },
    { id: 'LIE.extortion.3', inTruth: 'the young ones on the corners are a gang\'s eyes, and businesses that would not pay are driven out',
      versions: {
        welcoming: { text: 'The young ones on the corners are harmless, just bored.' },
        transactional: { text: 'Nobody here pays a gang to be left alone.' },
        cautious: { text: 'Businesses close sometimes. Hard times, probably.' },
        dismissive: { text: 'No gangs here.' },
      } },
  ],
  'tunnels': [
    { id: 'LIE.tunnels.1', inTruth: 'some cellars open on passages used by the criminal house',
      versions: {
        welcoming: { text: 'The cellars here are just cellars, full of old jars.' },
        transactional: { text: 'The cellars hold stores, and nothing worth the digging.' },
        cautious: { text: 'The cellars are only for storage, as far as anyone knows.' },
        dismissive: { text: 'Just cellars.' },
      } },
    { id: 'LIE.tunnels.2', inTruth: 'there are passages and rooms below, in use',
      versions: {
        welcoming: { text: 'The old stories about tunnels are just stories for children.' },
        transactional: { text: 'There\'s nothing under here worth anyone\'s time.' },
        cautious: { text: 'There\'s nothing much down below, it seems.' },
        dismissive: { text: 'Nothing down there.' },
      } },
  ],
});
