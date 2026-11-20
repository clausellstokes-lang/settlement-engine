/**
 * data/people/crimeKnowledgeSiblings.js — THE FOUR KNOWLEDGE FRAMES' SIBLING WORDINGS (SECRET-LINES, PAGE-8, 2026-11-20;
 * the chair's read of 20:02: "40 APPROVED TO BUILD, with five cures"; the lines and their measure:
 * `docs/chair/2026-11-20/content/page/lines/SECRET-LINES-TO-CHAIR.md`).
 *
 * `npcGenerator.js :: generateCrimeLevel`'s 25% branch draws one of four frames about a named other card (family 0: what
 * the holder knows of them; 1: what the holder was present for; 2: a debt the holder owes them; 3: the holder reading their
 * correspondence), each at most once a place (the held refusal reads the frame). Measured on 150 places a size, every frame
 * stood on 85–100% of towns, cities and metropolises. THE FAMILY IS DRAWN EXACTLY AS BEFORE; its WORDING is then chosen
 * draw-free by `kernel/proseHash.js :: pickVariantMixed` through the one door (`domain/facts/drawDeclared.js ::
 * drawDeclared`) over the pool the site composes, `[the drawn row (wording 0), ...its family's ten rows here]`. `{npc}`
 * is the other card's name, where the drawn row has it.
 *
 * Every row's laws (each pinned by `tests/generators/crimeKnowledgeSiblings.test.js`; a row that breaks one moves a stored
 * field beyond the secret):
 *   1. a sibling held by another card counts as its FAMILY's frame (`crimeKnowledgeKinOf` reads it back);
 *   2. it keeps its family's word class for `npcGenerator.js :: getStressHistory` (K0: "knows" only; K1–K3: none);
 *   3. a K2 row opens "Owes {npc} a debt" (`npcData.js :: secretOwes`, the pair's debt tie);
 *   4. `{npc}` stands in `what` (`people/rareSecrets.js :: exclusionOf`, "named in another card's secret");
 *   5. no word the merge rewrites (`npcGenerator.js :: mergeNPCLists`: merchant, thieves, guild), none of F5's venal
 *      list, none a temperament denies (`npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT`).
 * No row declares anything: none names a house, a place-feature, a crime, an age or a household, so silence admits it
 * everywhere, as its family's row is admitted. No closing full stop (the card's own shape).
 *
 * Pure data and three pure helpers the site calls (no randomness of their own, no clock, no write). The one import is the
 * kernel's mixed pick (eager already; a lazy table reaching the kernel is the safe direction).
 *
 * @enforced-by tests/generators/crimeKnowledgeSiblings.test.js
 */
import { pickVariantMixed } from '../../kernel/proseHash.js';

/** @typedef {Readonly<{ what: string, stakes: string }>} CrimeKnowledgeRow */

/**
 * THE SIBLINGS, by family (0 = K0, knows; 1 = K1, was present; 2 = K2, owes a debt; 3 = K3, reading the correspondence),
 * ten each in the order the chair approved them, each row in the drawn rows' own shape (`{ what, stakes }`). The drawn row
 * is NOT here (a literal has one home, the chair's rule 2): the site composes the pool `[the drawn row, ...these]`.
 * @type {ReadonlyArray<ReadonlyArray<CrimeKnowledgeRow>>}
 */
export const CRIME_KNOWLEDGE_WORDINGS = Object.freeze([
  // K0 (family 0): beside the drawn row of its family
  Object.freeze([
    Object.freeze({ what: 'Knows that {npc} broke a promise everyone believes {npc} kept, and has not yet decided what to do about it', stakes: '{npc} has been praised for keeping that promise, and would not take the truth well' }),
    Object.freeze({ what: 'Knows what {npc} really said in a quarrel that everyone else remembers differently, and has let the other version stand', stakes: '{npc} has repeated the other version often enough to be caught out by it' }),
    Object.freeze({ what: 'Knows why {npc} turned back from a journey last year, and has kept the reason to themselves', stakes: '{npc} told everyone the weather turned them back, and would not like the true reason heard' }),
    Object.freeze({ what: 'Knows that {npc} once took the blame for something they did not do, and has never asked {npc} why', stakes: 'If it came out, {npc} would have to say whom they were shielding' }),
    Object.freeze({ what: 'Knows that {npc} once made ready to go away for good and was talked into staying, and has never brought it up', stakes: '{npc} has since spoken as if going had never crossed their mind' }),
    Object.freeze({ what: 'Knows whom {npc} goes to see on the evenings {npc} says they are out walking, and has kept it quiet', stakes: '{npc} has never given a reason for those walks, and would not want to be asked for one' }),
    Object.freeze({ what: 'Knows that {npc} lost something they were trusted to keep, and has watched {npc} hide the loss ever since', stakes: '{npc} has never owned to the loss, and could not make it good now' }),
    Object.freeze({ what: "Knows that the choice everyone blames on someone else was {npc}'s, and has never said a word", stakes: '{npc} has let another carry the blame for it, and would have that to answer for as well' }),
    Object.freeze({ what: 'Knows that {npc} started a rumour that did someone real harm, and has never told the one it hurt', stakes: '{npc} would lose a friend over it, and perhaps more than one' }),
    Object.freeze({ what: 'Knows that {npc} turned down help when it was offered, then told everyone none was offered', stakes: '{npc} has made much of being left to manage alone, and would look small if the truth came out' }),
  ]),
  // K1 (family 1): beside the drawn row of its family
  Object.freeze([
    Object.freeze({ what: 'Was still up when {npc} came by very late one night, and saw the state {npc} was in. Neither has spoken of it since', stakes: 'Someone has started asking where everyone was that night' }),
    Object.freeze({ what: 'Overheard {npc} make a promise to someone {npc} has since turned away from. Neither has mentioned it', stakes: 'The one the promise was made to has begun to talk about it' }),
    Object.freeze({ what: 'Stood by while {npc} turned away someone who badly needed help. They have not spoken of it since', stakes: 'The one turned away has come back, and remembers who was there' }),
    Object.freeze({ what: 'Was there when {npc} lost their temper and broke something that was not theirs. Neither has brought it up', stakes: 'The owner still wonders what became of it, and has started asking' }),
    Object.freeze({ what: 'Watched {npc} put something in the fire that others have been looking for ever since. Neither has said a word', stakes: 'The search for it has started up again' }),
    Object.freeze({ what: 'Saw {npc} meet someone at first light whom {npc} claims never to have met. They have never talked about it', stakes: 'That someone has come back, and greeted them both like old acquaintances' }),
    Object.freeze({ what: 'Was with {npc} the day {npc} said something cruel to a friend, and has never repeated it. Neither has raised it', stakes: 'The friend has heard part of it from someone else, and wants the rest' }),
    Object.freeze({ what: 'Saw {npc} weep after a meeting that everyone else thinks went well. Neither has let on', stakes: 'Another such meeting is coming, and they will both be in the room' }),
    Object.freeze({ what: 'Was close by when {npc} made a choice that cost someone else dearly, and kept still. Both have kept still since', stakes: 'The one who bore the cost has begun to wonder who else was there' }),
    Object.freeze({ what: "Heard {npc} tell a lie that settled a quarrel in {npc}'s favour, and said nothing. The two of them have left it there", stakes: 'The quarrel has started up again, and the lie will not hold a second time' }),
  ]),
  // K2 (family 2): beside the drawn row of its family
  Object.freeze([
    Object.freeze({ what: 'Owes {npc} a debt for lodging given when they had nowhere to go, and {npc} has never once mentioned it', stakes: 'Being let off so lightly sits worse with them every year' }),
    Object.freeze({ what: 'Owes {npc} a debt for a word put in at the right moment, and {npc} has never asked for anything in return', stakes: 'A favour of that size is bound to be asked for one day' }),
    Object.freeze({ what: 'Owes {npc} a debt for keeping quiet about a mistake, and {npc} has never said what it will cost', stakes: 'They have begun to dread the day {npc} names a price' }),
    Object.freeze({ what: 'Owes {npc} a debt from a bad year, when {npc} carried them through, and {npc} has never asked for it back', stakes: 'Others have noticed how readily they side with {npc} on every question' }),
    Object.freeze({ what: 'Owes {npc} a debt on a promise made in a hard hour, and {npc} has never held them to it', stakes: 'A promise left lying that long is only waiting for its moment' }),
    Object.freeze({ what: 'Owes {npc} a debt that neither of them ever wrote down, and that {npc} has never once raised', stakes: 'With nothing written, {npc} may ask for whatever they please' }),
    Object.freeze({ what: 'Owes {npc} a debt for a loan made in friendship, and {npc} has never asked for it back', stakes: 'The friendship has cooled, and the loan has not been forgotten' }),
    Object.freeze({ what: 'Owes {npc} a debt for taking their side when no one else would, and {npc} has never said so aloud', stakes: 'If {npc} ever needs someone to stand up for them, they will be expected to' }),
    Object.freeze({ what: 'Owes {npc} a debt for a kindness done in secret, and {npc} has never let on who did it', stakes: 'They have only lately learned whose kindness it was, and cannot tell what is expected of them' }),
    Object.freeze({ what: 'Owes {npc} a debt for an introduction that made their name, and {npc} has never called it in', stakes: 'Everyone assumes they rose on their own, and {npc} is aware it is not so' }),
  ]),
  // K3 (family 3): beside the drawn row of its family
  Object.freeze([
    Object.freeze({ what: "Has been keeping a note of every visitor to {npc}'s door for most of a year. Nothing has come of it. The note grows longer", stakes: 'Someone has noticed them watching the door' }),
    Object.freeze({ what: "Has been asking after {npc}'s comings and goings through a friend of a friend. Little has turned up. They have not stopped asking", stakes: 'The friend of a friend has begun to wonder why' }),
    Object.freeze({ what: 'Has been lingering within earshot whenever {npc} thinks no one is near. Most of it is dull. They linger all the same', stakes: '{npc} has started choosing quieter corners' }),
    Object.freeze({ what: "Has been piecing together {npc}'s past from what visitors let slip. The pieces do not fit yet. They go on gathering them", stakes: 'One of those visitors has mentioned the questions to {npc} directly' }),
    Object.freeze({ what: 'Has set someone to trail {npc} on errands for months. The reports are dull. They keep the trailing up', stakes: 'The one doing the trailing has grown fond of {npc}, and may say something' }),
    Object.freeze({ what: 'Has been reading the letters {npc} leaves lying about, whenever the chance comes. There has been nothing worth having. They read on regardless', stakes: '{npc} has begun to put the letters away' }),
    Object.freeze({ what: 'Has been keeping count of the hours {npc} spends away and where {npc} says they went. The accounts mostly match. Mostly is not enough for them', stakes: '{npc} has noticed that the questions always come from the same direction' }),
    Object.freeze({ what: "Has been making a friend of {npc}'s closest friend in the hope of hearing something useful. Nothing useful yet. The friendship goes on", stakes: 'The friend has begun to repeat the questions to {npc}' }),
    Object.freeze({ what: 'Has been noting every promise {npc} makes in front of others and checking which are kept. So far most are. The tally goes on', stakes: 'A tally like that would be hard to explain if it were found' }),
    Object.freeze({ what: 'Has been watching whom {npc} sits with and whom {npc} avoids, and drawing conclusions. None of them is firm yet. The watching goes on', stakes: 'Someone has asked them, half in jest, why they always seem to be wherever {npc} is' }),
  ]),
]);

/** @param {string} s @returns {string} */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every sibling's `what` as an anchored pattern: the first `{npc}` captures the name, a later one must repeat it. */
const KIN = Object.freeze(CRIME_KNOWLEDGE_WORDINGS.flatMap((rows, family) => rows.map((row) => {
  const parts = row.what.split('{npc}').map(escapeRe);
  const body = parts[0] + parts.slice(1).map((p, i) => (i === 0 ? '(.+?)' : '\\1') + p).join('');
  return Object.freeze({ re: new RegExp(`^${body}$`), family });
})));

/**
 * LAW 1's reader: a secret text that is one of these siblings, filled, gives back its family and the name it carries
 * (so the held refusal reads it as its family's frame about that name); any other text gives null. Pure.
 * @param {unknown} text
 * @returns {{ family: number, name: string } | null}
 */
export function crimeKnowledgeKinOf(text) {
  if (typeof text !== 'string' || text === '') return null;
  const t = text.trim();
  for (const k of KIN) { const m = k.re.exec(t); if (m) return { family: k.family, name: m[1] }; }
  return null;
}

/**
 * LAW 1 at the site: the held texts as the held refusal reads them. A held sibling is read as its family's drawn row (the
 * row of `rows` at its family): every roster name masked, the two frames are one, so the family stays refused exactly as
 * when the drawn row itself is held. Any other text is framed as before. Pure.
 * @param {Set<string> | null | undefined} held @param {(text: string) => string} frameOf
 * @param {ReadonlyArray<{ what: string }>} rows the four drawn rows, in the site's order
 * @returns {Set<string> | null | undefined}
 */
export function crimeKnowledgeHeldFrames(held, frameOf, rows) {
  if (!held || !held.size) return held;
  return new Set([...held].map((text) => {
    const kin = crimeKnowledgeKinOf(text);
    return frameOf(kin ? rows[kin.family].what : text);
  }));
}

/**
 * The wording's draw for the site's door: the kernel's mixed keyed pick over the pool it is handed. No roll.
 * @param {string} key @returns {<T>(pool: T[]) => T | undefined}
 */
export const crimeKnowledgeWordingPick = (key) => (pool) => pickVariantMixed(pool, key);

/**
 * THE SITE'S DEAL (`npcGenerator.js :: generateCrimeLevel`): the family through the site's own draw (`drawFamily`, its one
 * roll, over the rows less the held frames), then the wording through the site's door (`drawWording`, keyed, over the pool
 * the site composes from the drawn row and its family's siblings), the other card's name filled. Wording 0 hands back the
 * drawn row itself. No roll of its own. Pure apart from the two draws it is handed.
 * @template {{ what: string, stakes: string }} R
 * @param {R[]} rows the four drawn rows, about the other card, in the site's order
 * @param {Set<string> | null | undefined} held @param {(text: string) => string} frameOf
 * @param {(rows: R[], heldFrames: Set<string> | null | undefined) => R | null | undefined} drawFamily
 * @param {(drawn: R, family: number) => { what: string, stakes: string } | null | undefined} drawWording
 * @param {string} name the other card's name
 * @returns {R | { what: string, stakes: string } | null | undefined}
 */
export function crimeKnowledgeDealt(rows, held, frameOf, drawFamily, drawWording, name) {
  const drawn = drawFamily(rows, crimeKnowledgeHeldFrames(held, frameOf, rows));
  if (!drawn) return drawn;
  const worded = drawWording(drawn, rows.indexOf(drawn));
  if (!worded || worded === drawn) return drawn;
  return { what: worded.what.split('{npc}').join(name), stakes: worded.stakes.split('{npc}').join(name) };
}
