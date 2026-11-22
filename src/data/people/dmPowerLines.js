/**
 * src/data/people/dmPowerLines.js — the DM view's patronage and capture sentences, as DATA
 * (WRITE-PEOPLE, 2026-11-08).
 *
 * The allegiance train's DM layer ("who really runs this town", docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md
 * §9; car 3 wires the patronage block, car 2 the hall's capture rung). Two tables:
 *
 *   PATRONAGE_LINES  2 kinds × 3 — the evidence sentence for ONE patron: a face of the ruling power's
 *                    ranked three that lends weight to another power (design §3.3, `patronageOf`'s
 *                    receipt). `open`: through an open membership in that power. `hidden`: through the
 *                    face's hidden allegiance to a criminal power (DM-only by J-9 and §8).
 *   CAPTURE_LINES    5 rungs × 3 — the hall's receipt line for each rung of CAPTURE_LADDER (design §3.4,
 *                    `hallCaptureOf`'s receipt): none · adversarial · equilibrium · corrupted · capture.
 *
 * Each line is a closure over the receipt's facts (the typedefs below name every field a line reads;
 * nothing else is presumed). Lines are DM-only by construction and say plainly what the arrangement
 * is. Every rung's three lines hold for EVERY way §3.4's derivation reaches that rung (the test walks
 * each path): 'equilibrium' from one lesser agent or from the climate alone; 'corrupted' from an agent
 * head, from the second and the third, or from a criminal ruling power with no agent; 'capture' from
 * the head and the second. A rung's variant 0 is the receipt in rank words (§9's example: "the second
 * and the third answer to the Thieves' Guild"), variant 1 names the people, variant 2 says what it
 * means for the town. The rung's label is NOT in the line: `CAPTURE_RUNG_LABELS` carries it, the
 * skimmable skeleton beside the prose (the style law's §5 (4)). Every line is listed here FOR THE
 * OWNER'S VETO; nothing here is imported by the generator, and the one import is the possessive leaf (a pure leaf).
 */

import { powerNameWithArticle, powerPossessive, powerSentenceName, powerVerb } from './powerSentenceName.js'; // COHERENCE-POWERS-7 (R3): a power's possessive through the one leaf, never a hand-formed "'s"

/**
 * A POWER IN A SENTENCE TAKES ITS ARTICLE (NAMES-1, the seventh chair's ruling CN1 of 2026-11-20, vetoable by the owner):
 * every line below names a power (the ruler, the power a patron lends to, the criminal power an agent answers to) through
 * the one leaf's article form, "the Elder Council" inside a sentence and "The Elder Council" at its head; its possessive is
 * that form with the leaf's own ending ("the Merchant Guilds'", "the Elder Council's"). The title `rulingHeadOf` is a
 * heading and keeps the roster's spelling. @param {unknown} name @param {boolean} [start] @returns {string}
 */
const the = (name, start = false) => powerNameWithArticle(name, start);
/** @param {unknown} name @param {boolean} [start] @returns {string} the article form's possessive */
const theOwn = (name, start = false) => `${the(name, start)}${powerPossessive(name).slice(powerSentenceName(name).length)}`;
/**
 * A WORD THAT FOLLOWS A POWER TAKES ITS NUMBER (NAMES-3, the seventh chair's rulings CV1 and CV7 of 2026-11-20, vetoable by
 * the owner): every verb whose subject is a power, and every "it"/"its" said of one, is written in both numbers and filled
 * by the one reader (`powerSentenceName.js :: powerVerb`). No line carries a number of its own.
 * @param {unknown} name @param {string} one @param {string} many @returns {string}
 */
const agree = (name, one, many) => powerVerb(name, one, many);

/**
 * One patron's receipt (a face of the ruling power's ranked three, or the steward of its empty seat).
 * @typedef {{
 *   name: string,                       // the patron's card name
 *   rank: 1 | 2 | 3 | 'steward',        // its place in the ruling power
 *   ruler: string,                      // the ruling power's name
 *   power: string,                      // the power it lends weight to (a criminal power for `hidden`)
 *   share: number,                      // its share in that power (0..1); the allegiance's share for `hidden`
 *   boost: number,                      // the points it lends, after the cap and the ruler's ceiling
 * }} PatronFacts
 */

/**
 * The hall's receipt. `agents` are the ruling three's cards that carry an allegiance (empty when none
 * does); `guild` is the name the agent answers to (its allegiance's power where one stands, else its
 * house). `underworld` is the independent criminal power the climate reads, or null.
 * @typedef {{
 *   ruler: string,
 *   agents: ReadonlyArray<{ name: string, rank: 1 | 2 | 3, guild: string }>,
 *   rulerCriminal: boolean,
 *   underworld: string | null,
 * }} CaptureFacts
 */

/** A patron's place, as an appositive: "second in the Elder Council". @param {PatronFacts['rank']} rank @param {string} ruler */
export function patronPlace(rank, ruler) {
  if (rank === 1) return `the head of ${the(ruler)}`; // NAMES-1 (CN1): the ruler with its article
  if (rank === 2) return `second in ${the(ruler)}`;
  if (rank === 3) return `third in ${the(ruler)}`;
  return `steward of ${the(ruler)} while ${agree(ruler, 'its', 'their')} seat stands empty`; // NAMES-3 (CV7 (ii))
}

/** A share in plain words: "a half share". @param {number} share */
export function shareWords(share) {
  const x = Number(share) || 0;
  if (x >= 0.95) return 'a full share';
  if (x >= 0.6) return 'a large share';
  if (x >= 0.45) return 'a half share';
  if (x >= 0.3) return 'a third share';
  if (x >= 0.2) return 'a quarter share';
  return 'a small share';
}

/** Points to one decimal, a whole number without its ".0". @param {number} n */
export function pointWords(n) {
  const x = Math.round((Number(n) || 0) * 10) / 10;
  return Number.isInteger(x) ? String(x) : x.toFixed(1);
}

/**
 * THE RULING THREE'S TITLE, READ AT ITS PRINT SITE (COHERENCE-POWERS-5, N5; REVIEW-POWERS-2 at e86d069be): the title
 * names as many as it heads — "The ruling three of X" over three names, "The ruling two of X" over two, "Who leads X"
 * over one, "No one stands at the head of X" over none. It reads the number of names the block prints (the view's
 * ranked faces) and the ruling power's name. The Power tab's DM panel and the PDF's DM chapter print it.
 * @param {number} count the names the block heads @param {string} ruler the ruling power's name
 * @returns {string}
 */
export function rulingHeadOf(count, ruler) {
  if (count >= 3) return `The ruling three of ${ruler}`;
  if (count === 2) return `The ruling two of ${ruler}`;
  if (count === 1) return `Who leads ${ruler}`;
  return `No one stands at the head of ${ruler}`;
}

/** The ruling three's places in rank words. @param {1 | 2 | 3} rank */
const RANK_WORDS = Object.freeze({ 1: 'the head', 2: 'the second', 3: 'the third' });

/** "a", "a and b", "a, b and c". @param {string[]} items */
export function listWords(items) {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** The agents in rank order. @param {CaptureFacts} f */
const byRank = (f) => [...f.agents].sort((a, b) => a.rank - b.rank);

/** The names the agents answer to, in rank order, once each. @param {CaptureFacts} f */
export function guildsOf(f) {
  return [...new Set(byRank(f).map((a) => a.guild))];
}

/**
 * Who answers to whom, in rank words: "The second and the third of the Elder Council answer to the
 * Thieves' Guild" · "The head of the Elder Council answers to the Thieves' Guild and the third to the
 * Night Market". Capitalised; no closing stop. @param {CaptureFacts} f
 */
export function answerClause(f) {
  const agents = byRank(f);
  const guilds = guildsOf(f);
  if (guilds.length === 1) {
    const who = listWords(agents.map((a) => RANK_WORDS[a.rank]));
    return `${cap(who)} of ${the(f.ruler)} ${agents.length === 1 ? 'answers' : 'answer'} to ${the(guilds[0])}`; // NAMES-1 (CN1)
  }
  const [first, ...rest] = agents;
  return `${cap(RANK_WORDS[first.rank])} of ${the(f.ruler)} answers to ${the(first.guild)} and ${listWords(rest.map((a) => `${RANK_WORDS[a.rank]} to ${the(a.guild)}`))}`;
}

/**
 * Who answers to whom, by name: "In Elder Council, Amir ibn Tufayl, the head, and Oda Kell, the
 * second, both answer to Thieves' Guild". Capitalised; no closing stop.
 * @param {CaptureFacts} f
 */
export function namedAnswerClause(f) {
  const agents = byRank(f);
  const guilds = guildsOf(f);
  if (agents.length === 1) return `${agents[0].name}, ${RANK_WORDS[agents[0].rank]} of ${the(f.ruler)}, answers to ${the(agents[0].guild)}`; // NAMES-1 (CN1)
  const people = agents.map((a) => `${a.name}, ${RANK_WORDS[a.rank]}`);
  if (guilds.length === 1) {
    return `In ${the(f.ruler)}, ${people.slice(0, -1).map((p) => `${p},`).join(' ')} and ${people[people.length - 1]}, ${agents.length === 2 ? 'both' : 'all'} answer to ${the(guilds[0])}`;
  }
  const [first, ...rest] = agents;
  return `In ${the(f.ruler)}, ${first.name}, ${RANK_WORDS[first.rank]}, answers to ${the(first.guild)}, and ${listWords(rest.map((a) => `${a.name}, ${RANK_WORDS[a.rank]}, to ${the(a.guild)}`))}`;
}

/** @param {string} s */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The criminal names a rung's line speaks of: the agents' guilds, else the underworld, each with its article (NAMES-1,
 * CN1: "the Thieves' Guild and the Night Market"); a line that opens on them sets the capital (`cap`).
 * @param {CaptureFacts} f
 */
export function criminalsOf(f) {
  if (f.agents.length) return listWords(guildsOf(f).map((g) => the(g)));
  return f.underworld ? the(f.underworld) : 'the criminal houses';
}

/**
 * The number of `criminalsOf` (NAMES-3, CV7): two names or more, or "the criminal houses", are plural; one name answers by
 * its own number through the one reader. @param {CaptureFacts} f @param {string} one @param {string} many @returns {string}
 */
const crimAgree = (f, one, many) => {
  const names = f.agents.length ? guildsOf(f) : f.underworld ? [f.underworld] : [];
  return names.length === 1 ? agree(names[0], one, many) : many;
};

/**
 * STYLE-2 SW-7 (the refusal line): the open patron's go-between line, keyed by the patron's PLACE in the ruling
 * power (its rank, or the steward of an empty seat), so the one frame "When [@] wants something from [@], [@] is the one who
 * asks for it." (168 towns on the 1,000 at dc5684e66) splits four ways by the record; the share words split it further.
 * Every variant names the patron, the ruler and the power, and states only the rank and the share it receives.
 * @param {PatronFacts} f
 */
function askerLine(f) {
  const share = shareWords(f.share);
  // NAMES-1 (CN1): every power with its article, "The" where it opens the line
  if (f.rank === 1) return `${f.name} heads ${the(f.ruler)} and also holds ${share} in ${the(f.power)}, so what ${the(f.power)} ${powerVerb(f.power, 'wants', 'want')} from ${the(f.ruler)} goes straight to the top.`; // NAMES-2 (item 5): the verb takes the power's number
  if (f.rank === 2) return `${the(f.power, true)} ${agree(f.power, 'brings', 'bring')} ${agree(f.power, 'its', 'their')} requests to ${the(f.ruler)} through ${f.name}, second in ${the(f.ruler)}, who holds ${share} in ${the(f.power)}.`;
  if (f.rank === 3) return `${f.name} is third in ${the(f.ruler)} and holds ${share} in ${the(f.power)}, and carries ${theOwn(f.power)} requests to the two above.`;
  return `While the seat of ${the(f.ruler)} stands empty, ${agree(f.ruler, 'its', 'their')} steward ${f.name} holds ${share} in ${the(f.power)}, and ${theOwn(f.power)} requests go through ${f.name}.`;
}

/**
 * STYLE-2 SW-7: the DM page's boosts row in words the record holds (the boost against the power's own strength), in
 * place of "{base} on its own, +{boost}, {effective} in all". @param {number} base @param {number} boost @returns {string}
 */
export function boostWords(base, boost) {
  const b = Number(base) || 0;
  const r = b > 0 ? (Number(boost) || 0) / b : Infinity;
  if (r < 0.2) return 'a little stronger than its own members make it';
  if (r < 0.6) return 'much stronger than its own members make it';
  if (r < 1.5) return 'about twice as strong as its own members make it';
  return 'far stronger than its own members could make it';
}

/** @typedef {(f: PatronFacts) => string} PatronLine */
/** @typedef {(f: CaptureFacts) => string} CaptureLine */

/** @type {Readonly<{ open: readonly PatronLine[], hidden: readonly PatronLine[] }>} */
export const PATRONAGE_LINES = Object.freeze({
  // the face's open membership in another power (the boost is shown on the DM layer only, J-9)
  open: Object.freeze([
    // NAMES-1 (CN1): the ruler and the power with their article ("The" where the power opens a sentence)
    (f) => `${f.name}, ${patronPlace(f.rank, f.ruler)}, also holds ${shareWords(f.share)} in ${the(f.power)}, and that lends ${the(f.power)} weight ${agree(f.power, 'it', 'they')} would not have on ${agree(f.power, 'its', 'their')} own.`, // NAMES-3 (CV7)
    (f) => askerLine(f),
    (f) => `${f.name} serves ${the(f.ruler)} and ${the(f.power)} at once. While ${f.name} holds both places, ${the(f.power)} ${powerVerb(f.power, 'counts', 'count')} for more here than ${powerVerb(f.power, 'its', 'their')} own members would make ${powerVerb(f.power, 'it', 'them')}.`, // NAMES-2 (item 5): verb and pronouns take the power's number
  ]),
  // the face's hidden allegiance to a criminal power (DM-only; the public page shows base strength)
  hidden: Object.freeze([
    (f) => `${f.name}, ${patronPlace(f.rank, f.ruler)}, secretly answers to ${the(f.power)}, and that lends ${the(f.power)} strength nobody outside the arrangement can see.`,
    (f) => `${the(f.power, true)} ${agree(f.power, 'has', 'have')} ${agree(f.power, 'its', 'their')} own voice in ${the(f.ruler)}: ${f.name}, ${patronPlace(f.rank, f.ruler)}. The others there hear it as ${f.name}'s own opinion.`,
    (f) => `Anyone who weighs ${the(f.power)} by ${agree(f.power, 'its', 'their')} known members leaves out ${f.name}, ${patronPlace(f.rank, f.ruler)}, who serves ${agree(f.power, 'it', 'them')} in secret. Counting ${f.name}, ${the(f.power)} ${agree(f.power, 'is stronger than it looks', 'are stronger than they look')}.`,
  ]),
});

/** The five rungs' labels (the skimmable skeleton printed beside the line). */
export const CAPTURE_RUNG_LABELS = Object.freeze({
  // STYLE-2 SW-7 (FOR THE OWNER'S VETO, the census law: a proposal): the state machine's tokens printed plain; the keys stay.
  // Was 'None' · 'Adversarial' · 'Equilibrium' · 'Corrupted' · 'Capture'.
  // BAR2-PEOPLE (PP1, the chair's ruling of 2026-11-15, vetoable by the owner): the free rung's label claims only what the
  // rung states, that the seat is not in the criminals' hold; it says nothing of crime in the town (was 'Free of the criminals')
  none: 'The seat is not in criminal hands', adversarial: 'Fighting the criminals', equilibrium: 'Living with the criminals', corrupted: 'Partly in criminal hands', capture: 'Run by the criminals',
});

/** @type {Readonly<Record<'none' | 'adversarial' | 'equilibrium' | 'corrupted' | 'capture', readonly CaptureLine[]>>} */
export const CAPTURE_LINES = Object.freeze({
  // no agent in the ruling three; no criminal power strong enough to count; the ruler is not criminal
  none: Object.freeze([
    // NAMES-1 (CN1): every rung's line names the ruler and the criminals with their article ("The" at a line's head)
    (f) => `Nobody at the head of ${the(f.ruler)} answers to a criminal house, and no criminal power here is strong enough to push ${agree(f.ruler, 'it', 'them')}.`, // NAMES-3 (CV7): every verb of the ruler or the criminals, and every "it" said of them, by number
    // POWERS-15 (REVIEW-POWERS-5 D1; the chair's ruling of 2026-11-14: under an occupation no line says the hall decides
    // for itself): the rung's fact is the criminals' standing against the hall, so the two syndicate lines claim that
    // only (were "... make their own decisions; none of them takes orders ..." and "<ruler> rules in its own name")
    (f) => `None of the head, the second and the third of ${the(f.ruler)} takes orders from the criminals.`,
    (f) => `No criminal house gives ${the(f.ruler)} its orders. One that wants something from ${agree(f.ruler, 'it', 'them')} has to ask, pay or wait like anyone else.`,
  ]),
  // the climate alone: a criminal power stands against the ruler and the ruler is winning; no agent in the three
  // BAR4-HISTORY (C26840, WEAK, 2026-11-16): the degree word reads the rung, as its own relation row says it ("hunting ... in
  // earnest but not catching all of it"): the ruler is ahead, not the fight won (was "is winning"; no longer, so the first-paint bytes do not rise)
  adversarial: Object.freeze([
    (f) => `${cap(criminalsOf(f))} ${crimAgree(f, 'works', 'work')} against ${the(f.ruler)}, and ${the(f.ruler)} ${agree(f.ruler, 'is', 'are')} ahead. Nobody at ${agree(f.ruler, 'its', 'their')} head answers to the criminals.`,
    (f) => `${the(f.ruler, true)} and ${criminalsOf(f)} are openly at odds. ${the(f.ruler, true)} ${agree(f.ruler, 'goes', 'go')} after ${powerPossessive(criminalsOf(f))} people when ${agree(f.ruler, 'it', 'they')} can catch them, and nobody in ${the(f.ruler)} protects them.`,
    (f) => `${cap(criminalsOf(f))} ${crimAgree(f, 'has', 'have')} no friend among the head, the second and the third of ${the(f.ruler)}. ${crimAgree(f, 'It survives', 'They survive')} by staying out of their sight.`,
  ]),
  // one lesser agent in the three (the second or the third alone), or the climate alone (the two sides tolerate each other)
  equilibrium: Object.freeze([
    (f) => (f.agents.length
      ? `${answerClause(f)}, but the head does not. ${cap(criminalsOf(f))} ${crimAgree(f, 'has', 'have')} a voice in ${the(f.ruler)}, not the last word.`
      : `Nobody at the head of ${the(f.ruler)} answers to ${criminalsOf(f)}, and ${the(f.ruler)} ${agree(f.ruler, 'has', 'have')} not set out to stamp ${criminalsOf(f)} out.`), // TAIL-POWERS-B: the rung's tolerance, not a peace a quarrel or an escalation denies
    (f) => (f.agents.length
      ? `${namedAnswerClause(f)}. ${byRank(f)[0].name} can slow what ${the(f.ruler)} ${agree(f.ruler, 'decides', 'decide')} against ${criminalsOf(f)}, but cannot stop it alone.`
      : `${the(f.ruler, true)} ${agree(f.ruler, 'knows', 'know')} what ${criminalsOf(f)} ${crimAgree(f, 'does', 'do')} and ${agree(f.ruler, 'lets', 'let')} most of it go. ${cap(criminalsOf(f))} ${crimAgree(f, 'keeps its', 'keep their')} business quiet enough to be let go.`),
    (f) => ((f) => `${f.ruler} still rules, and ${criminalsOf(f)} still works the streets. The two have settled on what each will put up with from the other.`)({ ...f, ruler: the(f.ruler, true) }), // NAMES-2 (CN1): the article rides in the value ("The Elder Council" opens the line), so the banked line reads as it did
  ]),
  // an agent head; or the second and the third; or a criminal ruling power, with or without an agent
  corrupted: Object.freeze([
    (f) => (f.agents.length
      ? `${answerClause(f)}.${f.rulerCriminal ? ` ${the(f.ruler, true)} ${agree(f.ruler, 'itself is', 'themselves are')} run as a criminal concern.` : ''}`
      : `${the(f.ruler, true)} ${agree(f.ruler, 'is itself', 'are themselves')} run as a criminal concern, so the people who make the laws here are the ones who profit from breaking them.`),
    (f) => (f.agents.length
      ? `${namedAnswerClause(f)}. Whatever ${the(f.ruler)} ${agree(f.ruler, 'decides', 'decide')}, ${criminalsOf(f)} ${crimAgree(f, 'has', 'have')} usually decided first.`
      : `The heads of ${the(f.ruler)} take their share of the crime here and see that nobody else takes it from them.`),
    (f) => (f.agents.length
      ? `${the(f.ruler, true)} still ${agree(f.ruler, 'holds', 'hold')} the seat, but ${agree(f.ruler, 'it does', 'they do')} not act against ${criminalsOf(f)}. A case that touches ${powerPossessive(criminalsOf(f))} business goes nowhere.`
      : `Nobody in ${the(f.ruler)} will act against crime that pays ${the(f.ruler)}. A case that touches ${agree(f.ruler, 'its', 'their')} business goes nowhere.`),
  ]),
  // the head and the second answer to the criminals (the third too, sometimes)
  capture: Object.freeze([
    (f) => `${answerClause(f)}. ${the(f.ruler, true)} ${agree(f.ruler, 'keeps its name and its seal', 'keep their name and their seal')}, and ${criminalsOf(f)} ${crimAgree(f, 'gives', 'give')} the orders.`,
    (f) => `${namedAnswerClause(f)}. What ${criminalsOf(f)} ${crimAgree(f, 'wants', 'want')}, ${the(f.ruler)} now ${agree(f.ruler, 'decides', 'decide')}.`,
    (f) => `${the(f.ruler, true)} ${agree(f.ruler, 'rules', 'rule')} for ${criminalsOf(f)} now. Anyone who brings a complaint against ${criminalsOf(f)} brings it to the very people who answer to ${crimAgree(f, 'it', 'them')}.`,
  ]),
});

/** The rungs, in CAPTURE_LADDER's order. */
export const CAPTURE_RUNGS = Object.freeze(Object.keys(CAPTURE_LINES));
