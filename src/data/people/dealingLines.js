/**
 * dealingLines.js — THE "HOW THEY DEAL" LINES OF EACH PAIR (E13b, WORDS-1; the tenth chair's ruling G39 of 2026-11-25).
 * FOR THE OWNER'S VETO: every sentence after a pair's first is new and the owner's to strike (listed beside its first line in
 * `docs/chair/2026-11-24/tenth/gen/words-1/e13b/SENTENCES.md`).
 *
 * A card's "How they deal" line (`presentation.behaviour`) is drawn, draw-free, by `npcData.js :: dealingLineFor`: the card's
 * disposition and the first of its traits that names a family (NPC_DEALING_BY_TRAIT), else the disposition's own line
 * (NPC_PLOT_HOOKS_DATA). Every person of one pair printed the SAME sentence, up to five on one page. Each pair now holds two
 * lines, and the eighteen pairs that reach three or more cards in one town hold three; the town pass
 * (`generators/people/dealingLinesOfTown.js`) gives the cards of a pair the pair's lines in turn. Each pair's FIRST line is
 * the existing sentence, BY IMPORT (never a copy), so a card ranked first reads as it always has. Every new line says what its
 * pair's first line says (that disposition, that trait family), in the same voice, with no new fact and no reflexive.
 * @enforced-by tests/generators/people/dealingLines.test.js
 */
import { NPC_DEALING_BY_TRAIT, NPC_PLOT_HOOKS_DATA } from '../npcData.js';

const W = NPC_DEALING_BY_TRAIT.welcoming;
const T = NPC_DEALING_BY_TRAIT.transactional;
const C = NPC_DEALING_BY_TRAIT.cautious;
const D = NPC_DEALING_BY_TRAIT.dismissive;
/** @param {string[]} lines @returns {ReadonlyArray<string>} */
const pool = (...lines) => Object.freeze(lines);

/** disposition → family ('own': the disposition's own line) → the pair's lines, its first line the existing sentence */
/** @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>} */
export const NPC_DEALING_LINES = Object.freeze({
  welcoming: Object.freeze({
    own: pool(NPC_PLOT_HOOKS_DATA.welcoming,
      'Shares what they know without being asked, and their questions feel friendly, not nosy.',
      'Talks openly and willingly; when they ask about you, it comes across as curiosity, not prying.'),
    straight: pool(W.straight, 'Happy to help, and honest about where their knowledge ends.'),
    warm: pool(W.warm, 'Greets you like a guest, sees you comfortable, and gives help freely.'),
    careful: pool(W.careful,
      'Warm enough, but in no hurry; lets you finish before they answer.',
      'Kindly and slow to reply; listens to everything you ask, then answers with care.'),
    sharp: pool(W.sharp, 'Easy company and quick-witted; somehow you end the talk having told them more than they told you.'),
    dutiful: pool(W.dutiful, 'Talks freely enough, but goes quiet the moment you ask about the people in their care.'),
    price: pool(W.price,
      'Generous with small kindnesses, and keeps count of each one for later.',
      'Hands out help and chatter freely, and calls in every favour when it suits them.'),
    lofty: pool(W.lofty,
      'Welcomes you graciously, as a favour granted, and waits for your thanks.',
      'Kind to you with an air of condescension, and wants the kindness acknowledged.'),
    guarded: pool(W.guarded,
      'Pleasant enough to talk to, but quick to ask who you are with and why you came.',
      'Smiles and chats, and in between wants to know where you have come from and who you know here.'),
    slippery: pool(W.slippery,
      'Agreeable to a fault; what they tell you depends on who is in the room.',
      'Warmly says whatever pleases you, and tells it differently to the next person.'),
    hard: pool(W.hard,
      'Warm with you while you stay on their good side, and cold for good once you leave it.',
      'Friendly until you cross them; after that the friendliness is gone and stays gone.'),
    shirking: pool(W.shirking,
      'Quick to say yes, and slow to turn up when the help is needed.',
      'Offers help freely, and is somewhere else when you come to collect it.'),
    dealmaker: pool(W.dealmaker, 'Helpful and pleasant, and weighing all the while what you could do for them.'),
  }),
  transactional: Object.freeze({
    own: pool(NPC_PLOT_HOOKS_DATA.transactional, 'Helps within set bounds; nothing they give is quite free.'),
    straight: pool(T.straight, 'Asks an honest price, holds to it, and expects the same of you.'),
    warm: pool(T.warm, 'Settles on terms, and adds something extra once the deal is done.'),
    careful: pool(T.careful, 'Agrees nothing until every detail is set, and keeps a written record of it.'),
    sharp: pool(T.sharp, 'A shrewd trader, who sees through a poor offer almost as soon as you start it.'),
    dutiful: pool(T.dutiful, 'Trades honestly with you, so long as the deal does not cost the people they answer to.'),
    price: pool(T.price, 'Puts a price on everything, and raises it when they see how badly you want it.'),
    lofty: pool(T.lofty,
      'Trades with you as if obliging you, and sets the terms without asking.',
      'Makes plain that dealing with you is a courtesy, and that they decide the terms.'),
    guarded: pool(T.guarded,
      'Keeps to the trade; asks nothing of your affairs and tells you nothing of theirs.',
      'Takes your coin and gives the goods, and the talk stops there on both sides.'),
    slippery: pool(T.slippery,
      'Says yes readily, and the deal shifts a little each time you go back to it.',
      'Quick to shake on a bargain, and later the bargain is not quite the one you made.'),
    hard: pool(T.hard,
      'Keeps you to the letter of any bargain and takes all that is owed, however it hurts.',
      'Collects every last coin a deal allows them, and has no pity for how you pay it.'),
    shirking: pool(T.shirking,
      'Agrees to the bargain, and gives the least it requires.',
      'Accepts the terms, then does the bare minimum they demand.'),
    dealmaker: pool(T.dealmaker, 'Useful to you exactly as long as it profits them.'),
  }),
  cautious: Object.freeze({
    own: pool(NPC_PLOT_HOOKS_DATA.cautious,
      'Answers what is asked and nothing more, and watches where you go after.',
      'Gives answers but offers nothing, and notes who you speak to once you leave.'),
    straight: pool(C.straight, 'Tells you the truth when asked, and stops there.'),
    warm: pool(C.warm, 'Kindly, but wary at first; helps once they understand who you are and what you want.'),
    careful: pool(C.careful, 'Slow to answer, weighs your words against what they already know, and shares little the first time.'),
    sharp: pool(C.sharp, 'Quiet and watchful, and quick to spot what you do not say.'),
    dutiful: pool(C.dutiful, 'Wants to know your business before anything else, and measures it against the people in their care.'),
    price: pool(C.price,
      'Keeps quiet until they know what is in it for them.',
      'Stays guarded until you show what you can give.'),
    lofty: pool(C.lofty,
      'Holds you at arm\'s length until you show you deserve their attention.',
      'Aloof and wary; you must earn their time before they give it.'),
    guarded: pool(C.guarded, 'Says only what the question requires, and pays close attention to the company you keep.'),
    slippery: pool(C.slippery, 'Answers with care, and every answer is true but leaves out most of it.'),
    hard: pool(C.hard,
      'Hears every question as a danger, and does not forget who put it.',
      'Takes each question as a warning sign, and keeps the face of whoever asked it in mind.'),
    shirking: pool(C.shirking,
      'Avoids you to stay clear of trouble, and passes you on to someone else whenever possible.',
      'Would rather not be involved, and sends you elsewhere at the first chance.'),
    dealmaker: pool(C.dealmaker, 'Keeps their distance until they can tell what you might be good for.'),
  }),
  dismissive: Object.freeze({
    own: pool(NPC_PLOT_HOOKS_DATA.dismissive, 'Civil but short with you; lets you know they cannot spare long.'),
    straight: pool(D.straight, 'Short and frank; gives you their view of what you want, then returns to their work.'),
    warm: pool(D.warm, 'Too busy to help, but kind about it, and sends you to someone who can.'),
    careful: pool(D.careful, 'Courteous but occupied; tells you to return when they are less busy.'),
    sharp: pool(D.sharp, 'Gives you a moment\'s hearing, finds you not worth the time, and tells you as much.'),
    dutiful: pool(D.dutiful, 'Puts their own people first, and has nothing to spare for anyone else.'),
    price: pool(D.price, 'Ignores you until there is money on the table.'),
    lofty: pool(D.lofty, 'Hardly glances your way; you are clearly not worth their attention.'),
    guarded: pool(D.guarded, 'Ends the conversation quickly, without saying why.'),
    slippery: pool(D.slippery, 'Says yes to whatever you ask, just to send you on your way.'),
    hard: pool(D.hard, 'Short with you to the point of insult, and indifferent to how you take it.'),
    shirking: pool(D.shirking, 'Brushes you aside; whatever you need, it is not their job.'),
    dealmaker: pool(D.dealmaker, 'Has little time for you, until you offer something they can use.'),
  }),
});

/** a pair's first line → the pair's lines (the first lines are distinct across pairs: a test) */
/** @type {ReadonlyMap<string, ReadonlyArray<string>>} */
export const DEALING_POOL_OF_FIRST_LINE = new Map(Object.values(NPC_DEALING_LINES).flatMap((byFamily) => Object.values(byFamily).map((lines) => [lines[0], lines])));
