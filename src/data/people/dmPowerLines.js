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
 * OWNER'S VETO; nothing here imports or is imported by the generator.
 */

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
  if (rank === 1) return `the head of ${ruler}`;
  if (rank === 2) return `second in ${ruler}`;
  if (rank === 3) return `third in ${ruler}`;
  return `steward of ${ruler} while its seat stands empty`;
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
    return `${cap(who)} of ${f.ruler} ${agents.length === 1 ? 'answers' : 'answer'} to ${guilds[0]}`;
  }
  const [first, ...rest] = agents;
  return `${cap(RANK_WORDS[first.rank])} of ${f.ruler} answers to ${first.guild} and ${listWords(rest.map((a) => `${RANK_WORDS[a.rank]} to ${a.guild}`))}`;
}

/**
 * Who answers to whom, by name: "In Elder Council, Amir ibn Tufayl, the head, and Oda Kell, the
 * second, both answer to Thieves' Guild". Capitalised; no closing stop.
 * @param {CaptureFacts} f
 */
export function namedAnswerClause(f) {
  const agents = byRank(f);
  const guilds = guildsOf(f);
  if (agents.length === 1) return `${agents[0].name}, ${RANK_WORDS[agents[0].rank]} of ${f.ruler}, answers to ${agents[0].guild}`;
  const people = agents.map((a) => `${a.name}, ${RANK_WORDS[a.rank]}`);
  if (guilds.length === 1) {
    return `In ${f.ruler}, ${people.slice(0, -1).map((p) => `${p},`).join(' ')} and ${people[people.length - 1]}, ${agents.length === 2 ? 'both' : 'all'} answer to ${guilds[0]}`;
  }
  const [first, ...rest] = agents;
  return `In ${f.ruler}, ${first.name}, ${RANK_WORDS[first.rank]}, answers to ${first.guild}, and ${listWords(rest.map((a) => `${a.name}, ${RANK_WORDS[a.rank]}, to ${a.guild}`))}`;
}

/** @param {string} s */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The criminal names a rung's line speaks of: the agents' guilds, else the underworld. @param {CaptureFacts} f */
export function criminalsOf(f) {
  if (f.agents.length) return listWords(guildsOf(f));
  return f.underworld || 'the criminal houses';
}

/**
 * STYLE-2 SW-7 (the refusal line): the open patron's go-between line, keyed by the patron's PLACE in the ruling
 * power (its rank, or the steward of an empty seat), so the one frame "When [@] wants something from [@], [@] is the one who
 * asks for it." (168 towns on the 1,000 at dc5684e66) splits four ways by the record; the share words split it further.
 * Every variant names the patron, the ruler and the power, and states only the rank and the share it receives.
 * @param {PatronFacts} f
 */
function askerLine(f) {
  const share = shareWords(f.share);
  if (f.rank === 1) return `${f.name} heads ${f.ruler} and also holds ${share} in ${f.power}, so what ${f.power} wants from ${f.ruler} goes straight to the top.`;
  if (f.rank === 2) return `${f.power} brings its requests to ${f.ruler} through ${f.name}, second in ${f.ruler}, who holds ${share} in ${f.power}.`;
  if (f.rank === 3) return `${f.name} is third in ${f.ruler} and holds ${share} in ${f.power}, and carries ${f.power}'s requests to the two above.`;
  return `While the seat of ${f.ruler} stands empty, its steward ${f.name} holds ${share} in ${f.power}, and ${f.power}'s requests go through ${f.name}.`;
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
    (f) => `${f.name}, ${patronPlace(f.rank, f.ruler)}, also holds ${shareWords(f.share)} in ${f.power}, and that lends ${f.power} weight it would not have on its own.`,
    (f) => askerLine(f),
    (f) => `${f.name} serves ${f.ruler} and ${f.power} at once. While ${f.name} holds both places, ${f.power} counts for more here than its own members would make it.`,
  ]),
  // the face's hidden allegiance to a criminal power (DM-only; the public page shows base strength)
  hidden: Object.freeze([
    (f) => `${f.name}, ${patronPlace(f.rank, f.ruler)}, secretly answers to ${f.power}, and that lends ${f.power} strength nobody outside the arrangement can see.`,
    (f) => `${f.power} has its own voice in ${f.ruler}: ${f.name}, ${patronPlace(f.rank, f.ruler)}. The others there hear it as ${f.name}'s own opinion.`,
    (f) => `Anyone who weighs ${f.power} by its known members leaves out ${f.name}, ${patronPlace(f.rank, f.ruler)}, who serves it in secret. Counting ${f.name}, ${f.power} is stronger than it looks.`,
  ]),
});

/** The five rungs' labels (the skimmable skeleton printed beside the line). */
export const CAPTURE_RUNG_LABELS = Object.freeze({
  // STYLE-2 SW-7 (FOR THE OWNER'S VETO, the census law: a proposal): the state machine's tokens printed plain; the keys stay.
  // Was 'None' · 'Adversarial' · 'Equilibrium' · 'Corrupted' · 'Capture'.
  none: 'Free of the criminals', adversarial: 'Fighting the criminals', equilibrium: 'Living with the criminals', corrupted: 'Partly in criminal hands', capture: 'Run by the criminals',
});

/** @type {Readonly<Record<'none' | 'adversarial' | 'equilibrium' | 'corrupted' | 'capture', readonly CaptureLine[]>>} */
export const CAPTURE_LINES = Object.freeze({
  // no agent in the ruling three; no criminal power strong enough to count; the ruler is not criminal
  none: Object.freeze([
    (f) => `Nobody at the head of ${f.ruler} answers to a criminal house, and no criminal power here is strong enough to push it.`,
    (f) => `The head, the second and the third of ${f.ruler} make their own decisions; none of them takes orders from the criminals.`,
    (f) => `${f.ruler} rules in its own name. A criminal house that wants something from it has to ask, pay or wait like anyone else.`,
  ]),
  // the climate alone: a criminal power stands against the ruler and the ruler is winning; no agent in the three
  adversarial: Object.freeze([
    (f) => `${criminalsOf(f)} works against ${f.ruler}, and ${f.ruler} is winning. Nobody at its head answers to the criminals.`,
    (f) => `${f.ruler} and ${criminalsOf(f)} are openly at odds. ${f.ruler} goes after ${criminalsOf(f)}'s people when it can catch them, and nobody in ${f.ruler} protects them.`,
    (f) => `${criminalsOf(f)} has no friend among the head, the second and the third of ${f.ruler}. It survives by staying out of their sight.`,
  ]),
  // one lesser agent in the three (the second or the third alone), or the climate alone (the two sides tolerate each other)
  equilibrium: Object.freeze([
    (f) => (f.agents.length
      ? `${answerClause(f)}, but the head does not. ${criminalsOf(f)} has a voice in ${f.ruler}, not the last word.`
      : `${f.ruler} and ${criminalsOf(f)} leave each other alone. Nobody at the head of ${f.ruler} answers to ${criminalsOf(f)}, and neither side pushes the other.`),
    (f) => (f.agents.length
      ? `${namedAnswerClause(f)}. ${byRank(f)[0].name} can slow what ${f.ruler} decides against ${criminalsOf(f)}, but cannot stop it alone.`
      : `${f.ruler} knows what ${criminalsOf(f)} does and lets most of it go. ${criminalsOf(f)} keeps its business quiet enough to be let go.`),
    (f) => `${f.ruler} still rules, and ${criminalsOf(f)} still works the streets. The two have settled on what each will put up with from the other.`,
  ]),
  // an agent head; or the second and the third; or a criminal ruling power, with or without an agent
  corrupted: Object.freeze([
    (f) => (f.agents.length
      ? `${answerClause(f)}.${f.rulerCriminal ? ` ${f.ruler} itself is run as a criminal concern.` : ''}`
      : `${f.ruler} is itself run as a criminal concern, so the people who make the laws here are the ones who profit from breaking them.`),
    (f) => (f.agents.length
      ? `${namedAnswerClause(f)}. Whatever ${f.ruler} decides, ${criminalsOf(f)} has usually decided first.`
      : `The heads of ${f.ruler} take their share of the crime here and see that nobody else takes it from them.`),
    (f) => (f.agents.length
      ? `${f.ruler} still holds the seat, but it does not act against ${criminalsOf(f)}. A case that touches ${criminalsOf(f)}'s business goes nowhere.`
      : `Nobody in ${f.ruler} will act against crime that pays ${f.ruler}. A case that touches its business goes nowhere.`),
  ]),
  // the head and the second answer to the criminals (the third too, sometimes)
  capture: Object.freeze([
    (f) => `${answerClause(f)}. ${f.ruler} keeps its name and its seal, and ${criminalsOf(f)} gives the orders.`,
    (f) => `${namedAnswerClause(f)}. What ${criminalsOf(f)} wants, ${f.ruler} now decides.`,
    (f) => `${f.ruler} rules for ${criminalsOf(f)} now. Anyone who brings a complaint against ${criminalsOf(f)} brings it to the very people who answer to ${guildsOf(f).length > 1 ? 'them' : 'it'}.`,
  ]),
});

/** The rungs, in CAPTURE_LADDER's order. */
export const CAPTURE_RUNGS = Object.freeze(Object.keys(CAPTURE_LINES));
