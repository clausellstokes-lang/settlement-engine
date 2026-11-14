/**
 * domain/crisis/crisisSummaryVantage.js — THE CRISIS SUMMARY BY SURFACE, FOUR VANTAGES PER SURFACE
 * (W4 PEOPLE, second seat, 2026-11-07; STYLE-RULINGS §1(c), WAVE-RULINGS item 2; SW-5
 * CRISIS-VANTAGES, 2026-11-09, STYLE-RULINGS-2 A4; the owner's style law, WIRING-RULINGS §5-§8).
 *
 * THE DEFECT IT ENDED FIRST. A crisis's summary (`stress[].summary`, written once by
 * `stressNarrative.js :: renderStressSummary`) printed word for word on every surface that names
 * the crisis: four times in one PDF (the cover, the Overview, the crisis page, Defence), twice in
 * the Foundry journal and once more on the Defence tab — STYLE-AUDIT §2a #29, "duplicate-surface".
 * ONE surface keeps the full text: the crisis section (the Crisis tab, the PDF's crisis page, the
 * Foundry crisis page), which reads `entry.summary` untouched. Every other surface prints a
 * vantage of the same circumstance from this table.
 *
 * THE DEFECT IT ENDS NOW (the §8 floor). The first cut held ONE line per surface, so every town
 * under the same crisis printed the same cover, Overview, Defence and Tonight frame. Each surface
 * now holds a POOL of four lines, each from a different vantage of §8's vocabulary (the traveller,
 * the official, the local, the newcomer, the trade, the watch). The pools are laid out as a Latin
 * square (SURFACE_VANTAGE_COLUMNS): one seed-chosen column gives every surface of one town a
 * DIFFERENT vantage, so the four surfaces never print one line twice (#29 stays cured by
 * construction), and column 0 is #29's own assignment (cover = traveller, Overview = local,
 * Defence = watch, Tonight = official). The seed is the town's name and the crisis kind
 * (`kernel/proseHash.js :: fnv1a32`, zero draws): one town prints the same lines forever, a sibling
 * town under the same crisis prints another column.
 *
 * Variants differ in vantage, never in fact: every line states only what its crisis kind (and,
 * for a migration, its declared direction) guarantees — the facts the stored summary and the
 * kind's own catalogue text (`data/stressTypes.js`) presume. No line names a garrison, soldiers,
 * walls or a hospital (those are facts of their own), no figure, no tier noun, and a war line holds
 * for a town that profits from the war and one that pays for it (the summary's roll is not kept).
 * Nor a body that keeps order or keeps the place safe (only an occupation's occupiers are the kind's own force), a merchant
 * (the market's fact) or a street (a thorp has none): the call sites pass the entry and the name
 * and no roster, so a line says "those who answer for", "those who sell", "out of doors" (R3-CODE-C-5).
 *
 * A kind this table does not know (an authored custom crisis) keeps its stored summary on every
 * surface: a line written for another crisis is worse than a repeat.
 *
 * Pure; no randomness, no clock. Every line is FOR THE OWNER'S VETO
 * (docs/chair/2026-11-09/STYLE-2-CRISIS-VANTAGES-2026-11-09.md).
 */
import { migrationDirectionOf } from './migrationDirection.js';
import { fnv1a32 } from '../../kernel/proseHash.js';

/**
 * The Latin square: surface → the vantage it prints in column k (k = 0..3). Every column holds
 * four different vantages, every surface's pool four different vantages; column 0 is #29's.
 */
export const SURFACE_VANTAGE_COLUMNS = Object.freeze({
  cover: Object.freeze(['traveller', 'newcomer', 'trade', 'watch']),
  overview: Object.freeze(['local', 'trade', 'official', 'newcomer']),
  defence: Object.freeze(['watch', 'official', 'local', 'traveller']),
  tonight: Object.freeze(['official', 'watch', 'newcomer', 'trade']),
});

/** How many columns the square has (each surface pool's size). */
export const SUMMARY_COLUMNS = SURFACE_VANTAGE_COLUMNS.cover.length;

/** @typedef {Readonly<Record<string, string>>} VantagePool one surface's lines, keyed by vantage */
/** @typedef {Readonly<Record<'cover'|'overview'|'defence'|'tonight', VantagePool>>} SurfacePools */

/** @param {Record<string, Record<string, string>>} t @returns {SurfacePools} */
const pools = (t) => /** @type {SurfacePools} */ (Object.freeze(Object.fromEntries(Object.entries(t).map(([k, v]) => [k, Object.freeze(v)]))));

/**
 * crisis kind → surface → vantage → line (`{name}` = the settlement's name). `mass_migration` is
 * keyed by its declared direction first (WAVE-RULINGS item 8: both sets written, never one for both).
 * @type {Readonly<Record<string, SurfacePools | Readonly<Record<'arrivals' | 'departures', SurfacePools>>>>}
 */
export const CRISIS_SUMMARY_POOLS = Object.freeze({
  under_siege: pools({
    cover: {
      traveller: 'The roads into {name} end at the besiegers\' lines, and nothing goes in or out without their leave.',
      newcomer: 'Whoever was visiting {name} when the besiegers closed the roads is stuck there now, one more mouth on food that cannot be replaced.',
      trade: 'No cart has come into {name} since the besiegers cut the roads, and nothing has gone out.',
      watch: 'From {name} you can see the besiegers\' fires on every road, and the lookouts count them each night.',
    },
    overview: {
      local: '{name} is cut off. Food comes from what is already inside, and people ration it a little tighter every day.',
      trade: 'Nothing comes into {name} and nothing leaves; the fields go untended, and people make do with what they have left.',
      official: '{name}\'s leaders are counting what is left in the stores and deciding who gets how much.',
      newcomer: 'Visitors trapped in {name} by the siege eat the same short rations as everyone else, and are not always welcome to them.',
    },
    defence: {
      watch: '{name} is surrounded. Everyone who can keep a lookout is keeping one, and nobody sleeps through the night.',
      official: 'Those who answer for {name}\'s safety must choose between holding out and seeking terms, and every week makes the choice harder.',
      local: 'Every able body in {name} takes a turn at the lookout, and families sleep in their clothes.',
      traveller: 'To reach {name} you would have to cross the besiegers\' lines first, and they let nobody through.',
    },
    tonight: {
      official: '{name} is under siege and its supply roads are cut; every order its leaders give is about lasting another week.',
      watch: 'The besiegers around {name} have not moved, and the lookouts wait for the night they do.',
      newcomer: 'Anyone new inside {name} is another mouth to feed and perhaps a spy for the besiegers, and is treated as both.',
      trade: 'With the roads cut, {name} lives on what it has stored, and whoever holds food can name their price.',
    },
  }),
  famine: pools({
    cover: {
      traveller: 'In {name} you see hungry children at the doors, and long queues wherever food is handed out.',
      newcomer: 'Arriving in {name}, you are asked first whether you carry food, and only then what you want.',
      trade: 'In {name} food costs more every week, and people spend every coin they have on it.',
      watch: 'In {name} the food stores are guarded day and night, and nobody carrying a sack goes unquestioned.',
    },
    overview: {
      local: 'Every family in {name} is eating less than it did, and those with stores put by are not sharing.',
      trade: 'Nobody in {name} earns a normal living while the famine lasts; what money there is goes on food, and whoever sells grain names the price.',
      official: 'The harvest in {name} has failed, and its leaders are rationing what is left while they decide whom to feed first.',
      newcomer: 'Newcomers to {name} find doors shut and no work going; nobody has food to spare for another mouth.',
    },
    defence: {
      watch: 'Hunger has made {name} tense: what food is stored is watched day and night, and every quarrel over food turns ugly fast.',
      official: 'Those who answer for {name} spend their days settling quarrels over food, and every week there are more of them.', // R3-CODE-C-3 #ww-15: no force is the kind's to promise
      local: 'In {name} stealing food is the crime of the season, and neighbours who once shared now bar their doors.',
      traveller: 'On the road into {name}, hungry eyes follow anyone carrying a sack or driving a cart.',
    },
    tonight: {
      official: '{name} has lost a second harvest. Its leaders have begun rationing, while the families who can afford it hoard what they have.',
      watch: 'In {name} what food is left is watched day and night, and those watching it are as hungry as everyone else.', // R3-CODE-C-3 #pf-85: watched, by whoever keeps it
      newcomer: 'Anyone who comes to {name} with food to sell is welcome; anyone who comes to eat is not.',
      trade: 'In {name} whoever holds grain decides who eats, and they know it.',
    },
  }),
  occupied: pools({
    cover: {
      traveller: 'Foreign officials run {name} now; the locals answer their questions politely and say as little as they can.',
      newcomer: 'Newcomers to {name} are questioned by the occupiers\' officials before any local will say a word to them.',
      trade: 'Everything sold in {name} pays the occupiers their due first, and those who sell keep their prices and their opinions to themselves.', // R3-CODE-C-5: no merchant
      watch: 'At every road into {name}, the occupiers\' officials note who comes and goes.',
    },
    overview: {
      local: 'In {name} people answer to foreign officials now, and mind what they say out of doors.', // R3-CODE-C-5: no street
      trade: 'The occupiers take {name}\'s revenue, and the local offices work only under their eye.',
      official: '{name}\'s own leaders keep their titles, but every decision they make goes to the occupiers for approval.',
      newcomer: 'A newcomer in {name} is taken for the occupiers\' informer until they prove otherwise.',
    },
    defence: {
      watch: 'The occupiers watch {name} closely, and the resistance watches them back, careful never to be caught.',
      official: 'Keeping order in {name} is the occupiers\' business now, and the locals are not trusted to help.',
      local: 'In {name} people keep their heads down; a careless word to the wrong neighbour can bring the occupiers to the door.',
      traveller: 'Travellers through {name} are stopped and asked their business by officials who are not from here.',
    },
    tonight: {
      official: '{name} is governed by an outside power. Its own leaders keep their titles and do as they are told.',
      watch: 'The occupiers watch {name} for the resistance, and the resistance watches for its chance.',
      newcomer: 'People who are not known faces in {name} are what its quiet resistance needs most, and what the occupiers fear most.',
      trade: 'The occupiers take what {name} earns, and the people who once shared in it now fill someone else\'s purse.',
    },
  }),
  politically_fractured: pools({
    cover: {
      traveller: 'Each part of {name} answers to a different power, and each tells you a different story about who rules; no one is in charge of the whole.',
      newcomer: 'Newcomers to {name} are asked, sooner or later, whose side they are on.',
      trade: 'Doing business in {name} means knowing whose ground you stand on, and dealing with the power that holds it.',
      watch: 'The rival powers in {name} each keep an eye on their own ground and on whoever crosses it.',
    },
    overview: {
      local: 'In {name} even ordinary business means choosing a side, and neighbours notice who you deal with.',
      trade: 'In {name} nothing gets decided: repairs are put off, and every problem is left for later.',
      official: 'No one council speaks for {name}; each power that holds part of it governs its own share and blocks the rest.',
      newcomer: 'A newcomer in {name} soon finds that whom they buy from and whom they drink with is taken as a choice of side.',
    },
    defence: {
      watch: '{name} is split between rival powers, and a quarrel where their ground meets can turn into a brawl.',
      official: 'No one in {name} can call everyone to its defence; each power guards its own ground and trusts nobody else\'s.',
      local: 'People in {name} keep away from where one power\'s ground meets another\'s, most of all after dark.', // R3-CODE-C-3 (CENSUS-2 c36): no streets in a thorp
      traveller: 'Crossing {name}, you pass from one power\'s ground to another\'s, and each side notes which way you came.',
    },
    tonight: {
      official: 'Two or three powers each hold part of {name}, and none will give way, so nothing that needs them all gets done.',
      watch: 'Each power in {name} counts its friends and watches its rivals, waiting for one of them to slip.',
      newcomer: 'Anyone new in {name} is worth winning over, and every power will try before the week is out.',
      trade: 'Anything in {name} that needs all its powers to agree, from a repair to a ruling, waits, and the waiting costs everyone.',
    },
  }),
  indebted: pools({
    cover: {
      traveller: 'The creditor\'s agents walk about {name} as if they owned it, and in a way they do: the place owes more than it can ever pay.', // R3-CODE-C-5: no streets
      newcomer: 'In {name}, a newcomer is asked straight away whether they come from the creditor.',
      trade: 'Much of what {name} earns goes straight to its creditor, and nothing is left over to build with.',
      watch: 'The creditor\'s agents in {name} keep a close eye on every cart that leaves and every coin that changes hands.',
    },
    overview: {
      local: 'Everything {name} earns goes first to the debt, and people grumble that they now work for the creditor.',
      trade: 'Whatever {name} sells, a share is set aside for the creditor before anyone else is paid.',
      official: '{name}\'s leaders spend more of their time answering the creditor than governing their own people.',
      newcomer: 'A newcomer with coin is welcome in {name}, where every household is short of it.',
    },
    defence: {
      watch: 'The creditor keeps its own people in {name}, watching where every coin goes.',
      official: 'Those who answer for {name} must answer to the creditor too, and the people know it.', // R3-CODE-C-5: no force is the kind's to promise
      local: 'People in {name} hide what little they have saved, in case the creditor\'s agents come asking.',
      traveller: 'Passing through {name}, you meet the creditor\'s agents before you meet its own officials.',
    },
    tonight: {
      official: 'Every plan {name}\'s leaders make must first pass the creditor, and most of them do not.',
      watch: 'The creditor\'s people in {name} are watching for anything worth taking in place of payment.',
      newcomer: 'Someone new in {name} could be a way out of the debt or the creditor\'s next collector, and people will want to know which.',
      trade: 'Every coin {name} earns is spoken for before it arrives, and the creditor decides what is left.',
    },
  }),
  recently_betrayed: pools({
    cover: {
      traveller: 'In {name}, doors close as you pass and every question you ask is met with one of theirs: someone trusted sold the place out, and help now comes after questions.',
      newcomer: 'A newcomer to {name} gets polite answers and no help until someone local will vouch for them.',
      trade: 'In {name} deals that once ran on a handshake now want witnesses, and some have stopped altogether.',
      watch: 'In {name} every unfamiliar face is noted, and somebody always asks who let them in.',
    },
    overview: {
      local: 'Since the betrayal, neighbours in {name} keep their own counsel and their doors shut.',
      trade: 'Since the betrayal, much of {name}\'s business that ran on trust has slowed or stopped.',
      official: 'People in {name} no longer trust those in charge, and its leaders are still trying to learn what was lost.',
      newcomer: 'Anyone who arrived in {name} around the time of the betrayal is still being asked where they were.',
    },
    defence: {
      watch: '{name} is still looking for whoever betrayed it, and every unexplained absence draws a hard look.',
      official: 'Those who answer for {name} are questioning everyone who could have reached what was sold, and nobody is above suspicion.', // R3-CODE-C-5 (the chair, 02:06Z): no keepers of its safety the kind does not promise
      local: 'In {name} neighbours watch one another now, and an old friend\'s late visit draws questions.',
      traveller: 'At {name}, travellers are asked their business twice, and their answers are remembered.',
    },
    tonight: {
      official: 'Someone trusted in {name} sold something important, and its leaders still do not know who, or how much was lost.',
      watch: 'Whoever betrayed {name} may still be there, and those looking for them have not given up.',
      newcomer: 'People new to {name} are the only ones with no motive for the betrayal, which makes them useful to anyone hunting the traitor.',
      trade: 'Whatever was sold out of {name} has a buyer somewhere, and that buyer is still profiting from it.',
    },
  }),
  infiltrated: pools({
    cover: {
      traveller: 'Nothing seems wrong in {name} at first; it takes a while to notice how many decisions favour the same outsiders.',
      newcomer: 'A newcomer to {name} may notice the same few faces wherever decisions are made, and nobody local finds it odd.',
      trade: 'In {name} the contracts and permits keep going to the same outside hands, and nobody can say why.',
      watch: 'Nobody in {name} is watching for spies, which is what the people who have got inside are counting on.',
    },
    overview: {
      local: 'Life in {name} goes on as usual, but odd decisions keep being made, and nobody can say who wanted them.',
      trade: 'Nothing has been taken from {name} yet; whoever has got inside wants a say in its decisions, not its money.',
      official: '{name}\'s leaders believe their decisions are their own, though someone outside has a hand in most of them.',
      newcomer: 'An outsider in {name} alarms nobody, which is how the real outsiders got in.',
    },
    defence: {
      watch: 'Agents of an outside interest move through {name} unchallenged, because nobody knows to look for them.',
      official: 'Those who answer for {name}\'s safety see no threat, and nobody has told them to look.',
      local: 'People in {name} feel safe, and nothing they can see tells them otherwise.',
      traveller: 'A traveller who pays attention in {name} may see the same face in too many places.',
    },
    tonight: {
      official: 'Someone outside {name} is quietly shaping its decisions, and its leaders have not noticed.',
      watch: 'What is said in {name}\'s councils keeps reaching people who should not hear it, and nobody has worked out how.',
      newcomer: 'Fresh eyes in {name} may see what its own people have stopped noticing: decisions that serve someone else.',
      trade: 'Someone outside {name} is steering its decisions, and for now they want influence, not coin.',
    },
  }),
  plague_onset: pools({
    cover: {
      traveller: 'A sickness is spreading in {name}: doors are shut, and people keep their distance from one another.', // R3-CODE-C-5: no street
      newcomer: 'Anyone arriving in {name} is asked where they came from and whether they are well before anyone will take their hand.',
      trade: 'Fewer people come to market in {name} since the sickness began, and some goods have stopped arriving altogether.',
      watch: 'In {name} some houses are marked and watched and others are not, and nobody seems to agree on the rules.',
    },
    overview: {
      local: 'The sickness in {name} is spreading, and people would rather argue over where it came from than stay indoors.',
      trade: 'Travel is discouraged in {name}, fewer come to market, and the goods the carts used to bring run short.',
      official: '{name}\'s leaders argue over where the sickness came from while it spreads.',
      newcomer: 'Newcomers in {name} are eyed as the likely source of the sickness, whatever the truth.',
    },
    defence: {
      watch: 'Those trying to keep {name}\'s sick apart from the healthy are being resisted, and not everyone keeps the quarantine.', // R3-CODE-C #1386: the kind guarantees resistance, not a quarantine that holds nowhere
      official: 'Those in charge of {name} have ordered a quarantine they cannot make people keep.',
      local: 'In {name} some families shut themselves in and some carry on as before, and the sickness passes between them.',
      traveller: 'Coming into {name}, you pass shuttered doors, and nobody can tell you which houses hold the sick.',
    },
    tonight: {
      official: 'A sickness is spreading in {name}, and its leaders can neither agree where it came from nor get people to accept a quarantine.',
      watch: 'The quarantine in {name} is kept in some houses and ignored in others, and the sickness goes where it likes.', // R3-CODE-C-5: no streets
      newcomer: 'Anyone new to {name} will be asked whether they carry the sickness, and few will believe the answer.',
      trade: 'With fewer buyers and fewer carts, {name}\'s trade shrinks for as long as the sickness lasts.',
    },
  }),
  succession_void: pools({
    cover: {
      traveller: 'Everyone you meet in {name} has a view on who should take the dead leader\'s seat, and nobody has taken it yet.',
      newcomer: 'Newcomers to {name} are courted by every claimant to the empty seat, each hoping to count one more friend.',
      trade: 'Every large bargain in {name} waits until a new leader is chosen, and those with coin hold it back.', // R3-CODE-C-5: no merchant, no big business
      watch: 'In {name} the followers of rival claimants eye each other warily, waiting for the first push.', // R3-CODE-C-5: no street
    },
    overview: {
      local: 'With the old leader dead and no one in their place, people in {name} wait to see who comes out on top.',
      trade: 'Nothing large is decided in {name} until the seat is filled, and each office does as it sees fit meanwhile.',
      official: 'Each office in {name} now runs itself, and no one has the standing to make them answer.',
      newcomer: 'A newcomer in {name} is soon asked which claimant they favour, and the answer is remembered.',
    },
    defence: {
      watch: 'Rivals for {name}\'s empty seat are gathering followers, and it may come to blows before anyone is chosen.',
      official: 'With no one in {name}\'s seat, nobody can give the order that calls everyone to its defence.',
      local: 'People in {name} keep clear of the claimants\' followers, who grow louder and bolder each week.',
      traveller: 'Travellers in {name} see the claimants\' followers gathering openly, and hear talk of who will strike first.',
    },
    tonight: {
      official: 'No one in {name} has the standing to give an order others must obey, and every rival for the seat knows it.',
      watch: 'The rivals for {name}\'s empty seat each count their followers, and each fears the others will move first.',
      newcomer: 'Every claimant in {name} wants backing from outside, and anyone newly arrived will be asked for theirs.',
      trade: 'Until {name} has a leader again, no large bargain can be struck there, and those waiting on one are losing patience.', // R3-CODE-C-3 #pf-667: no merchant is the kind's to promise
    },
  }),
  monster_pressure: pools({
    cover: {
      traveller: 'The roads around {name} are dangerous now: carts have gone missing, and a farmstead went up in flames last week.',
      newcomer: 'Anyone who reaches {name} by road is asked what they saw on the way, and listened to closely.',
      trade: 'Fewer carts reach {name} each month, and the drivers who still come travel in company and charge more for it.',
      watch: 'Lookouts around {name} watch the roads and the edges of the fields, and nobody lingers outside once the light goes.',
    },
    overview: {
      local: 'Nobody in {name} goes out after dark now, and every family has a story of something seen at the edge of the fields.',
      trade: 'Carts have stopped coming to {name}, more is spent on keeping the roads safe, and what does arrive costs more.',
      official: 'Those in charge of {name} spend more on its safety every season, and still cannot stop the attacks.',
      newcomer: 'Newcomers who reach {name} by road are greeted with relief that they made it at all.',
    },
    defence: {
      watch: 'Whatever is attacking around {name}, wolves, raiders or worse, is getting bolder, and the lookouts count the days between attacks.',
      official: 'Nobody in {name} can watch every road and every field at once, and the attackers seem to know it.', // R3-CODE-C-5: no keepers of its safety
      local: 'Families in {name} bring their animals in at dusk and bar their doors, and nobody works the far fields alone.',
      traveller: 'The roads to {name} are dangerous: travellers move in groups and by daylight, and some never arrive.',
    },
    tonight: {
      official: 'Those who answer for {name}\'s safety spend more on it every season, and still the attacks come.',
      watch: 'The attacks around {name} follow a pattern, and the lookouts are beginning to see it.',
      newcomer: 'Anyone new to {name} who knows how to fight or track will be asked to help before they have unpacked.',
      trade: 'Every cart that fails to reach {name} is food or goods it goes without, and the shortfall grows each week.',
    },
  }),
  insurgency: pools({
    cover: {
      traveller: '{name} looks calm, but its offices are half empty and orders go unanswered; one of its strongest powers has turned against those in charge.',
      newcomer: 'Newcomers to {name} are asked, quietly, whether they come on the government\'s business.',
      trade: 'In {name} taxes are disputed and some offices no longer send their revenue on, and those who trade are unsure whom they owe.', // R3-CODE-C-5: no merchant
      watch: 'Nobody in {name} fights in the open; those watching are counting who still obeys the government and who has stopped.',
    },
    overview: {
      local: 'People in {name} are choosing between the government and the power that defies it, and many have stopped doing what the government asks.',
      trade: 'Taxes in {name} are disputed, some offices keep the revenue they once sent on, and the government runs on habit.',
      official: 'Those in charge of {name} still give orders, but fewer of them are carried out each week.',
      newcomer: 'A newcomer in {name} soon learns that the government\'s word counts for less than it seems.',
    },
    defence: {
      watch: 'There is no fighting in {name}; the danger is quieter, officials who will not act and orders that go nowhere.', // R3-CODE-C-5: no streets
      official: 'Those who answer for {name} cannot be sure whose side their own people are on.', // R3-CODE-C-5: no force
      local: 'In {name} people keep out of the quarrel between the government and the power that defies it, and away from anyone asking questions.',
      traveller: 'Passing through {name}, you would see nothing amiss unless you asked who is really in charge.',
    },
    tonight: {
      official: 'Those in charge of {name} know one of its strongest powers is defying them, and cannot say so openly without making it stronger.',
      watch: 'The power defying {name}\'s government grows quietly, and those watching it cannot act in the open.',
      newcomer: 'Those in charge of {name} need something done that cannot be official, and someone new is whom they would ask.',
      trade: 'Some of {name}\'s offices no longer send their revenue on, and the government runs on less each season.',
    },
  }),
  religious_conversion: pools({
    cover: {
      traveller: '{name}\'s faith is in dispute: you hear two kinds of prayer there, and people are careful which one they join.', // R3-CODE-C-5: no streets
      newcomer: 'Newcomers to {name} are asked, sooner or later, which faith they keep, and the answer decides who will deal with them.',
      trade: 'In {name} feast days and fairs are held twice over, once for each faith, and trade between the two grows harder.',
      watch: 'In {name} each faith watches the other\'s gatherings closely, and a loud sermon draws a crowd from both.',
    },
    overview: {
      local: 'Families in {name} are divided over faith, and old friends now worship apart.',
      trade: 'The tithe in {name} is split two ways, and trade between the faithful of each grows harder.',
      official: '{name}\'s leaders cannot settle which faith the place keeps, and the old house\'s property has no clear owner.',
      newcomer: 'A newcomer in {name} is soon courted by both faiths, each hoping to count one more.',
    },
    defence: {
      watch: 'Arguments over faith in {name} run hot, and a feast day can end in a fight.',
      official: 'Those who answer for {name} are kept busy by quarrels between the faiths, and are trusted by neither.', // R3-CODE-C-5: no force
      local: 'In {name} families keep away from the other faith\'s feasts, and words between neighbours can turn to blows.', // R3-CODE-C-5: no street
      traveller: 'Travellers in {name} do well to keep their prayers to themselves; both faiths are quick to take offence.',
    },
    tonight: {
      official: 'Which faith {name} keeps has split its people, and its leaders cannot settle it to everyone\'s satisfaction.',
      watch: 'Each faith in {name} watches the other for an insult, and the next feast day could end in a fight.',
      newcomer: 'A newcomer in {name} is pressed to choose a faith, and whichever they choose, half the place will notice.',
      trade: 'Records, oaths and property in {name} once rested on one faith; now nobody is sure who holds them.',
    },
  }),
  slave_revolt: pools({
    cover: {
      traveller: 'Work has stopped across {name}: the enslaved have downed their tools, and their owners stand by not knowing what to do.',
      newcomer: 'Newcomers to {name} are watched by owners and rebels alike, each wondering which side they will take.',
      trade: 'Less is made in {name} since the revolt began; the owners keep their gangs only on work they can watch.',
      watch: 'In {name} every watchful eye is on the revolt, and every other duty waits.', // R3-CODE-C-5: no force
    },
    overview: {
      local: 'Whole work gangs in {name} have downed their tools, and the owners argue over whether to bargain or to crack down.',
      trade: 'Work across {name} has shrunk to what the owners can watch, and less gets made each week.',
      official: 'Those in charge of {name} are pressed by the owners to crack down, and have not yet decided whether to bargain instead.',
      newcomer: 'A newcomer in {name} is asked whether they keep slaves, and the answer marks them to both sides.',
    },
    defence: {
      watch: '{name}\'s enslaved are in open defiance, and their owners watch them day and night.', // R3-CODE-C-5: no force
      official: 'Those who answer for {name} have their hands full with the revolt, and nothing left for anything else.', // R3-CODE-C-5: no force
      local: 'Owners in {name} lock their doors at night, and the enslaved who still work do so under watch.',
      traveller: 'Travellers through {name} find work stopped and owners on edge, and are asked whether they bring help.',
    },
    tonight: {
      official: 'Those in charge of {name} must choose between bargaining with the rebels and crushing them, and the owners press for the second.',
      watch: 'The rebels in {name} have demands, and everyone waits to see whether anyone will listen.', // R3-CODE-C-5: no force
      newcomer: 'The rebels in {name} have demands and no one to carry them; an outsider could be that person.',
      trade: 'Every day the revolt in {name} lasts, less is made and the owners lose more, and their patience is running out.',
    },
  }),
  wartime: pools({
    cover: {
      traveller: '{name} is in a kingdom at war: army carts pass through, and the war is all anyone talks about.',
      newcomer: 'Newcomers to {name} are asked whether they come from the front, and what news they bring.',
      trade: 'The war drives {name}\'s prices: some goods grow scarce, and a few people grow rich on the army\'s contracts.',
      watch: '{name} watches its roads for deserters and spies, now that the kingdom is at war.',
    },
    overview: {
      local: 'The war is far from {name}, but it touches every household: the prices, the news, the carts going by.',
      trade: 'The war takes much of the kingdom\'s money, and in {name} prices move with every piece of news from the front.',
      official: 'Every season the crown asks {name} for more, and its leaders must weigh what they owe the war against what the place needs.',
      newcomer: 'Anyone new in {name} might be a deserter, a spy or a recruiter, and is treated warily until known.',
    },
    defence: {
      watch: 'In wartime {name} watches its roads for deserters, spies and the army\'s own requisition officers alike.',
      official: 'With men called away to the war, {name} has fewer hands than before to see to its own safety.', // R3-CODE-C-5: no keepers of its safety
      local: 'In {name} the families whose men were called up wait for news, and the rest keep an eye on the road.',
      traveller: 'On the roads near {name} you meet army carts and the crown\'s officers, and give way to both.',
    },
    tonight: {
      official: 'The kingdom\'s war makes its demands on {name}, in men, carts and supplies, and its leaders must decide how much to give.',
      watch: 'In {name} the crown\'s officers come for requisitions, and people watch closely what they take.',
      newcomer: 'A crown officer wants more from {name} than it can spare, and someone new might find a way between giving in and refusing.',
      trade: 'In wartime {name}\'s trade follows the army: what the war needs sells, and the rest waits.',
    },
  }),
  mass_migration: Object.freeze({
    arrivals: pools({
      cover: {
        traveller: 'Walking into {name}, you pass tents on both sides of the road: newcomers looking for a place to call home.',
        newcomer: 'The families arriving in {name} want a roof and work, and find too few of either to go round.',
        trade: 'With so many new mouths in {name}, food is running short and there is not work for everyone who wants it.',
        watch: 'The newcomers\' camps in {name} grow every week, and the old households watch them uneasily.',
      },
      overview: {
        local: 'Families have been arriving all season, more than {name} has roofs or work for. They camp where they can, and the old households keep their distance.',
        trade: 'Food in {name} is running short with so many more to feed, and there is not work enough for the newcomers.',
        official: '{name}\'s leaders are counting heads they have no plan for, and the newcomers keep coming.',
        newcomer: 'For the newcomers, {name} is a place to call home, if they can find a roof and someone who will hire them.',
      },
      defence: {
        watch: 'Newcomers keep arriving in {name}, and with them come quarrels over space and work that the old families expect someone to settle.',
        official: 'Those who answer for {name} are stretched by the newcomers, and some of the hungriest take what they cannot earn.', // R3-CODE-C-5: no force
        local: 'Old families in {name} lock up what they once left out, and blame the newcomers for every theft.',
        traveller: 'On the road into {name}, you pass families camped wherever there is room, watching every cart that goes by.',
      },
      tonight: {
        official: '{name}\'s leaders are caught between their duty to the newcomers and a place that cannot house or employ them all.',
        watch: 'In {name} the quarrels between old families and newcomers come more often now, and each is harder to settle.',
        newcomer: 'Whoever takes charge of the newcomers in {name} will decide who may stay and who must go, and will want something in return.',
        trade: 'Every new family in {name} needs food and work, and the place has less of both to give each week.',
      },
    }),
    departures: pools({
      cover: {
        traveller: 'Houses in {name} stand empty, their owners gone for good.', // R3-CODE-C-5: no streets, no count
        newcomer: 'A newcomer to {name} is welcomed eagerly: there are empty houses to fill and work nobody is left to do.',
        trade: 'Fewer buyers and fewer hands: {name}\'s fields go short of workers and its trade short of customers.',
        watch: 'With so many gone from {name}, empty houses stand dark at night and nobody watches them.', // R3-CODE-C-5: no streets
      },
      overview: {
        local: 'Families keep leaving {name}, the ones who could afford to first, and those who stay do the work of the ones who went.',
        trade: 'With families leaving {name}, the fields lack hands to work them and the taxes fall short.',
        official: 'Offices in {name} stand empty, the taxes fall short, and its leaders have fewer people each season to call on.',
        newcomer: 'Anyone who settles in {name} now can have their pick of empty houses, and those who stayed will be glad of them.',
      },
      defence: {
        watch: 'With so many gone, {name}\'s empty houses draw thieves and squatters, and fewer people are left to keep them out.',
        official: 'Each season {name} has fewer people to call on for its safety, and more empty houses to watch.', // R3-CODE-C-5: no keepers of its safety
        local: 'In {name} those who stay keep an eye on their neighbours\' empty houses, and lock their own.',
        traveller: 'Walking through {name}, you pass house after empty house, and few people about to see who goes in.',
      },
      tonight: {
        official: '{name} is losing people faster than it can replace them, and its leaders have fewer hands each season to keep things running.',
        watch: 'Thieves have learned that {name} has more empty houses than people to watch them.',
        newcomer: 'Anyone willing to stay in {name} has a say now, because the place cannot afford to lose more.',
        trade: 'Every family that leaves {name} takes its trade and its taxes with it, and the gap grows each season.',
      },
    }),
  }),
});

/** @param {unknown} v @returns {string} */
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * The column of the square a town prints for one crisis: the town's name and the crisis kind,
 * hashed (zero draws). The same town and crisis always land on the same column.
 * @param {string} place @param {string} kind @returns {number} 0..SUMMARY_COLUMNS-1
 */
export function summaryColumnOf(place, kind) {
  return fnv1a32(`${place}::${kind}`) % SUMMARY_COLUMNS;
}

/**
 * One crisis's surface pools, the migration's declared direction resolved; null for a kind the
 * table does not know.
 * @param {{ type?: unknown, direction?: unknown }|null|undefined} entry
 * @returns {SurfacePools|null}
 */
export function crisisSummaryPoolsOf(entry) {
  const kind = clean(entry?.type);
  const set = kind ? CRISIS_SUMMARY_POOLS[kind] : undefined;
  if (!set) return null;
  // the census's one reader of W0's field (influx | exodus), the facts' own direction
  return kind === 'mass_migration'
    ? /** @type {Readonly<Record<'arrivals' | 'departures', SurfacePools>>} */ (set)[migrationDirectionOf(entry) === 'exodus' ? 'departures' : 'arrivals']
    : /** @type {SurfacePools} */ (set);
}

/**
 * The summary a named SURFACE prints: the line of the town's column in that surface's pool, the
 * settlement's name in its slot; the stored summary where the table has no line for the crisis
 * (an authored custom crisis) or no name is known. The crisis section is not a key here on
 * purpose: it keeps `entry.summary` itself.
 * @param {{ type?: unknown, summary?: unknown, direction?: unknown }|null|undefined} entry one `stress[]` entry
 * @param {unknown} name the settlement's name
 * @param {'cover'|'overview'|'defence'|'tonight'} surface
 * @returns {string|null}
 */
export function crisisSummaryForSurface(entry, name, surface) {
  const stored = clean(entry?.summary) || null;
  const place = clean(name);
  const columns = SURFACE_VANTAGE_COLUMNS[/** @type {keyof typeof SURFACE_VANTAGE_COLUMNS} */ (surface)];
  const set = crisisSummaryPoolsOf(entry);
  if (!columns || !set || !place) return stored;
  const vantage = columns[summaryColumnOf(place, clean(entry?.type))];
  const line = clean(set[/** @type {keyof SurfacePools} */ (surface)]?.[vantage]);
  return line ? line.replace(/\{name\}/g, place) : stored;
}
