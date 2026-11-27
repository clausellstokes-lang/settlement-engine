/**
 * data/people/personMention.js — A PERSON'S SECOND MENTION IN ONE SENTENCE (NAMES-1, the seventh chair's ruling CN2 of
 * 2026-11-20, vetoable by the owner; the owner, 2026-11-20: "Do it pre deploy. I like it."). A pure leaf (no imports).
 *
 * THE CLASS. A line composed over two cards printed each card's full name at every mention: "Valentina Fedorov has asked
 * Nikoleta Lebedev for a vote against Nikoleta Lebedev's own interests." (9,853 sentences in 584 of the census's 720 at
 * 85fccf898, docs/chair/2026-11-20/content/NAMES-1-CENSUS.md). A DM reading it aloud hears the machine.
 *
 * THE RULE, sentence by sentence. A person's FIRST mention keeps the full name. A LATER mention in the same sentence is:
 *   1. a PRONOUN from that person's own `gender` ('male' / 'female'), where no other person the sentence names shares
 *      that gender;
 *   2. else the ROLE as the card states it ("the gang boss": it tells a DM who the person is), where no other person
 *      the sentence names holds it (the chair's order, 2026-11-20), and only where the role reads as a description, with
 *      its article ("the miller"); a bare title with no article ("Elder", "Mayor") takes 3-5 (R13, RULING-R, the
 *      eleventh chair, 2026-11-27);
 *   3. else the SURNAME (the name's last word), where no other person the sentence names carries it;
 *   4. else the GIVEN NAME (the name's first word), where no other person the sentence names carries it;
 *   5. else the full name, as before (two cards of one name and one role: nothing shorter tells them apart).
 * A card with no gender (an older stored town's card) takes 2-5.
 *
 * THE PRONOUN'S CASE, read off the sentence: before "'s" it is the possessive ("her own interests"); else BY THE WORD
 * AFTER IT (PRONOUN, CLOSE-2 unit 3c, the chair's E117): the words that follow a person's later mention in the composed
 * lines are a closed set, classed by hand (`SUBJECT_FOLLOWERS`: a finite verb or the adverb before one, the mention a
 * clause's subject, "a candidate she distrusts", "everything he has built"; `OBJECT_FOLLOWERS`: "want her gone", "asked
 * him to", "ruin her."), the one follower both classes hold read with the word before it (`FOLLOWER_BY_BEFORE`: "an
 * introduction he would", "who knows her would"). A follower in neither class (a text no line of the census wrote)
 * keeps the reading the leaf had before: at a clause's head (the sentence's start, after a clause opener such as "and",
 * "but", "than", "that", or after a comma, semicolon, colon or dash) with a word after it, the subject ("and he holds
 * enough"); everywhere else the object. A mention at the sentence's head takes its capital. A pronoun never stands before
 * a they-form bound to its own person: a later mention whose following text starts with a tail of `NO_PRONOUN_TAILS`
 * (classed by hand from the measure) skips the pronoun rung only and takes the next rung of THE RULE (2-5), so "an
 * introduction the factor would rather keep to themselves" (PRONOUN-THEY, CLOSE-4, the ninth chair's ruling (A) of
 * 2026-11-23, which amends its ruling of 01:55 that the mention keep the full name). No reflexive is rewritten.
 * @enforced-by tests/lint/personMentionCase.walker.test.js (every template with a person's slot, both genders)
 *
 * ⛔ THE VEIL (the seventh chair's ruling CN3 (ii)). The share veil withholds a string by finding a hidden person's NAME
 * in it, string by string. This leaf changes only a mention AFTER the first in the same sentence, so every string it
 * writes still names, in full, every person it speaks of: a pronoun, a surname, a role or a given name never stands in
 * a string as the only reference to its person. @enforced-by tests/lint/namesInSentences.walker.test.js
 * @enforced-by tests/domain/personMention.test.js
 */

/** @typedef {{ name?: unknown, gender?: unknown, role?: unknown }} MentionCard */

const PRONOUN = Object.freeze({
  female: Object.freeze({ subject: 'she', object: 'her', possessive: 'her' }),
  male: Object.freeze({ subject: 'he', object: 'him', possessive: 'his' }),
});

/** the words after which a name opens a clause (its verb follows), so a pronoun there is the subject */
const CLAUSE_OPENERS = Object.freeze(new Set(['and', 'but', 'so', 'yet', 'or', 'nor', 'than', 'while', 'whilst', 'because',
  'though', 'although', 'until', 'unless', 'when', 'whenever', 'where', 'wherever', 'if', 'since', 'that', 'whether',
  'once', 'as', 'after', 'before']));

/**
 * THE FOLLOWER'S CLASS (PRONOUN, CLOSE-2 unit 3c): the words after a person's later mention in every composed line
 * (`npcData.js` ties, `goalFamilies.js` wants), classed by hand. SUBJECT: a finite verb, or the adverb before one (the
 * mention is that clause's subject). OBJECT: a word that is not the mention's own verb, or a stop mark (`OBJECT_STOP_MARK`).
 */
export const SUBJECT_FOLLOWERS = Object.freeze(new Set(['acts', 'asked', 'asks', 'calls', 'can', 'cannot', 'controls',
  'could', 'decides', 'did', 'distrusts', 'does', 'earns', 'gets', 'has', 'holds', 'is', 'keeps', 'knows', 'makes', 'means',
  'moves', 'names', 'needs', 'never', 'once', 'owes', 'pays', 'rarely', 'refused', 'remembers', 'sends', 'stands', 'still',
  'stops', 'survives', 'uses', 'vouches', 'wants', 'was', 'will']));
export const OBJECT_FOLLOWERS = Object.freeze(new Set(['about', 'everything', 'gone', 'in', 'money', 'questions', 'something',
  'standing', 'that', 'to', 'too', 'two', 'without']));
/**
 * The stop marks after a later mention ("ruin her."), the object (PRONOUN-2, CLOSE-5): the six (, . ; : ! ?) as ONE regex
 * literal beside `OBJECT_FOLLOWERS`'s words, read where that Set is read, so the copy's voice count reads no '!' (as
 * `NOT_AFTER_LETTER` below).
 */
export const OBJECT_STOP_MARK = /^[,.;:!?]$/;
/**
 * A follower both classes hold, its class read off the word BEFORE the mention: "an introduction he would rather keep"
 * (subject) beside "nobody who knows her would believe it" (object: "would" is nobody's verb).
 * @type {Readonly<Record<string, Readonly<Record<string, 'subject' | 'object'>>>>}
 */
export const FOLLOWER_BY_BEFORE = Object.freeze({
  would: Object.freeze({ and: 'subject', that: 'subject', introduction: 'subject', knows: 'object' }),
});

/**
 * THE TAILS THAT TAKE NO PRONOUN (PRONOUN-THEY, CLOSE-4, the chair's ruling (A)): the exact words after a later mention
 * up to and including the they-form that binds that mention's own person (singular they: "an introduction the factor
 * would rather keep to themselves"), classed by hand from the measure (`close-4/THEY-MEASURE.txt` on
 * `lane/close-4-2026-11-23`). A mention before one skips the pronoun rung (`mentionOf`).
 */
export const NO_PRONOUN_TAILS = Object.freeze(new Set(['would rather keep to themselves', 'cannot finish theirs']));

/**
 * THE REFLEXIVE SLOT (E8, WORDS-1; the tenth chair's PRERELEASE-LIST row E8, the ninth chair's N26 "a reflexive slot in the
 * templates (the right form)"): a composed line whose reflexive binds ONE person writes it through this slot, filled from
 * that person's own `gender`: "himself", "herself"; a card with no gender (an older stored town's card) keeps the they-form
 * the line wrote before. The template names WHOM it binds (the slot is handed that card); no code rewrites a reflexive.
 * @enforced-by tests/generators/people/reflexiveSlot.test.js
 * @param {MentionCard | null | undefined} card @returns {'himself' | 'herself' | 'themselves'}
 */
export function reflexiveOf(card) {
  const g = str(card?.gender);
  return g === 'female' ? 'herself' : g === 'male' ? 'himself' : 'themselves';
}

/**
 * THE BOUND CARD LINES (E8b, WORDS-1; the tenth chair's G20 (2) of 2026-11-25): the closed table of the drawn card lines whose
 * "themselves" binds the card's OWN person (hand-classed BOUND rows, `docs/chair/2026-11-24/tenth/gen/words-1/tools/
 * e8-classes.mjs`), each with the card field that holds it. The draw and its dedupe run on the line's text as written; the
 * reflexive is resolved only AFTER the last draw, once, where every card is final (`boundReflexives`, called by
 * `narrativeGenerator.js :: generateCoherence` and the people regen), from the card's own `gender` (`reflexiveOf`). A reader that
 * matches a stored line against its table reads it in the held form (`heldCardLine`). Regex literals, so no copy count reads them.
 * @type {ReadonlyArray<readonly [string, string, RegExp]>}
 */
const BOUND_CARD_LINES = Object.freeze(/** @type {Array<readonly [string, string, RegExp]>} */ ([
  ['personality', 'tell', /speaks of (themselves) in the third person when angry/],
  ['presentation', 'impression', /sure of (themselves), and not careless with it/],
  ['presentation', 'behaviour', /Gives away little about (themselves), and remembers/],
  ['secret', 'what', /Is (themselves) a newcomer, arrived a decade ago/],
  ['secret', 'what', /telling (themselves) it doesn't matter/],
  ['secret', 'what', /cannot bring (themselves) to sell it/],
  ['secret', 'what', /Is not (themselves) when the moon is full/],
  ['secret', 'what', /Taught (themselves) to read from a single book/],
  ['secret', 'what', /never once let (themselves) be seen/],
  ['secret', 'what', /the households pay and spending it on (themselves)/],
  ['secret', 'what', /moved the stone (themselves)/],
  ['goal', 'long', /whatever the cost to (themselves)/],
]));
/** each row's held form: the bound reflexive written back as "themselves" */
const HELD_CARD_LINES = Object.freeze(BOUND_CARD_LINES.map(([, , re]) => new RegExp(re.source.replace('(themselves)', '(?:himself|herself)'), 'g')));

/**
 * A card with its bound card lines' reflexive in the card's own form ("speaks of herself in the third person"); a card with no
 * gender, or no bound line, is returned as it is (the same object).
 * @template {Record<string, any>} C @param {C} card @returns {C}
 */
export function boundReflexives(card) {
  const own = reflexiveOf(card);
  if (own === 'themselves' || !card || typeof card !== 'object') return card;
  /** @type {Record<string, any>} */ let out = card;
  for (const [o, f, re] of BOUND_CARD_LINES) {
    const holder = out[o]; const text = holder && typeof holder === 'object' ? holder[f] : undefined;
    if (typeof text !== 'string' || !re.test(text)) continue;
    const said = text.replace(re, (whole) => whole.replace('themselves', own));
    out = { ...out, [o]: { ...holder, [f]: said } };
  }
  return /** @type {C} */ (out);
}

/**
 * A stored card line read in its HELD form: a bound card line's own-form reflexive written back as "themselves", so a reader that
 * matches the line against its table (a template, a row pattern, a refusal row) finds it as drawn. Any other text is returned as it is.
 * @param {unknown} text @returns {string}
 */
export function heldCardLine(text) {
  let t = String(text ?? '');
  for (const re of HELD_CARD_LINES) t = t.replace(re, (whole) => whole.replace(/himself|herself/, 'themselves'));
  return t;
}

/** a name stands on its own: no letter or digit before it, none after (regex literals, so the copy's voice count reads no '!') */
const NOT_AFTER_LETTER = /(?<![\p{L}\p{N}])/u.source;
const NOT_BEFORE_LETTER = /(?![\p{L}\p{N}])/u.source;

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v.trim() : '');
/** @param {string} s @returns {string} */
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} s @returns {string} */
const capFirst = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** a name's words, its bracket qualifier set aside ("Chac Chel Koh (the senior guild master)": its surname is "Koh") @param {string} name */
const bareWords = (name) => name.replace(/\s+\([^()]+\)$/, '').split(/\s+/);

/** a role that reads as a description in a sentence: it carries its article ("the miller"); a bare title ("Elder") does not (R13) */
const ROLE_AS_DESCRIPTION = /^the\s/;

/**
 * The mention a later occurrence takes, without its case: a pronoun's gender, or the word that stands for the person.
 * @param {{ name: string, gender: string, role: string }} p @param {Array<{ name: string, gender: string, role: string }>} named
 * @param {boolean} [noPronoun] the pronoun rung skipped (a mention before a tail of `NO_PRONOUN_TAILS`)
 * @returns {{ pronoun: 'female' | 'male' } | { word: string } | null}
 */
function mentionOf(p, named, noPronoun = false) {
  const others = named.filter((q) => q !== p);
  if (!noPronoun && (p.gender === 'female' || p.gender === 'male') && !others.some((q) => q.gender === p.gender)) return { pronoun: p.gender };
  if (ROLE_AS_DESCRIPTION.test(p.role) && !others.some((q) => q.role.toLowerCase() === p.role.toLowerCase())) return { word: p.role };
  const words = bareWords(p.name);
  const surname = words[words.length - 1];
  if (words.length > 1 && !others.some((q) => bareWords(q.name).includes(surname))) return { word: surname };
  if (words.length > 1 && !others.some((q) => bareWords(q.name).includes(words[0]))) return { word: words[0] };
  return null;
}

/**
 * Whether a mention at `start` opens a clause: the sentence's head, or after a clause opener or a stop mark, with a
 * lower-case word after the name.
 * @param {string} sentence @param {number} start @param {number} end @returns {boolean}
 */
function opensClause(sentence, start, end) {
  if (!/^\s+[a-z]/.test(sentence.slice(end))) return false;
  const before = sentence.slice(0, start);
  if (/^\W*$/.test(before) || /[,;:—–]\s*$/.test(before)) return true;
  const last = /(\w+)\s+$/.exec(before);
  return !!last && CLAUSE_OPENERS.has(last[1].toLowerCase());
}

/**
 * The word after a mention ending at `end` (lower-cased), or the stop mark there; '' at the text's end.
 * @param {string} sentence @param {number} end @returns {string}
 */
export function followerAt(sentence, end) {
  const m = /^\s*(?:([\p{L}'’]+)|([^\s\p{L}]))/u.exec(sentence.slice(end));
  return m ? (m[1] ? m[1].toLowerCase() : m[2]) : '';
}

/**
 * The word before a mention starting at `start` (lower-cased), or '' where none stands before it.
 * @param {string} sentence @param {number} start @returns {string}
 */
export function wordBeforeAt(sentence, start) {
  const m = /([\p{L}'’]+)[^\p{L}]*$/u.exec(sentence.slice(0, start));
  return m ? m[1].toLowerCase() : '';
}

/**
 * Whether a later mention is its clause's subject: by its follower's class (`SUBJECT_FOLLOWERS`, `OBJECT_STOP_MARK` or
 * `OBJECT_FOLLOWERS`, `FOLLOWER_BY_BEFORE`), else by the clause head (`opensClause`).
 * @param {string} sentence @param {number} start @param {number} end @returns {boolean}
 */
function isSubject(sentence, start, end) {
  const follower = followerAt(sentence, end);
  const byBefore = Object.hasOwn(FOLLOWER_BY_BEFORE, follower) ? FOLLOWER_BY_BEFORE[follower] : null;
  const before = byBefore ? wordBeforeAt(sentence, start) : '';
  if (byBefore && Object.hasOwn(byBefore, before)) return byBefore[before] === 'subject';
  if (!byBefore && SUBJECT_FOLLOWERS.has(follower)) return true;
  if (!byBefore && (OBJECT_STOP_MARK.test(follower) || OBJECT_FOLLOWERS.has(follower))) return false;
  return opensClause(sentence, start, end);
}

/**
 * One sentence, its later mentions changed.
 * @param {string} sentence @param {Array<{ name: string, gender: string, role: string, shared: boolean }>} people @returns {string}
 */
function oneSentence(sentence, people) {
  /** @type {Array<{ p: { name: string, gender: string, role: string, shared: boolean }, start: number, end: number }>} */
  const hits = [];
  for (const p of [...people].sort((a, b) => b.name.length - a.name.length)) {
    const re = new RegExp(`${NOT_AFTER_LETTER}${esc(p.name)}${NOT_BEFORE_LETTER}`, 'gu');
    for (let m = re.exec(sentence); m; m = re.exec(sentence)) {
      const start = m.index; const end = start + p.name.length;
      if (!hits.some((h) => start < h.end && end > h.start)) hits.push({ p, start, end });
    }
  }
  if (hits.length < 2) return sentence;
  hits.sort((a, b) => a.start - b.start);
  // two cards of one printed name: the occurrences cannot be told apart, so the sentence is left as written
  if (hits.some((h) => h.p.shared)) return sentence;
  const named = [...new Set(hits.map((h) => h.p))];
  const seen = new Set();
  let out = ''; let at = 0;
  for (const h of hits) {
    if (!seen.has(h.p)) { seen.add(h.p); continue; }
    const after = sentence.slice(h.end).trimStart();
    const m = mentionOf(h.p, named, [...NO_PRONOUN_TAILS].some((t) => after.startsWith(t)));
    if (!m) continue;
    const possessive = /^['’]s(?![\p{L}\p{N}])/u.test(sentence.slice(h.end));
    let word; let end = h.end;
    if ('pronoun' in m) {
      const forms = PRONOUN[m.pronoun];
      if (possessive) { word = forms.possessive; end += 2; } else word = isSubject(sentence, h.start, h.end) ? forms.subject : forms.object;
    } else word = m.word;
    if (/^\W*$/.test(sentence.slice(0, h.start))) word = capFirst(word);
    out += sentence.slice(at, h.start) + word;
    at = end;
  }
  return out + sentence.slice(at);
}

/**
 * THE POSSESSIVE OF A QUALIFIED NAME OPENS ITS BRACKET INTO AN EPITHET (NAMES-3, the seventh chair's ruling of 2026-11-20 on
 * item 3 (d), a style, vetoable by the owner). A card whose name collides with another's carries its title in a bracket
 * (`generators/npcDisplayNames.js`: "Tserenpuntsag Ongirad (the miller)"); a composed "{name}'s" then read "Tserenpuntsag
 * Ongirad (the miller)'s hours" (54 stored strings in 33 towns of the census's 720, 8 in 5 of the golden's 525, at the line
 * 0c906948). In a composed sentence that possessive reads "Tserenpuntsag Ongirad the miller's hours", never "(the miller)'s"
 * and never a doubled possessive. Only the possessive moves: the card's `name` and every other mention keep the bracket,
 * and the bare name still stands in the string (the share veil folds a bracketed qualifier and searches the bare name).
 * @param {string} text @param {ReadonlyArray<MentionCard | null | undefined>} cards @returns {string}
 */
export function qualifiedPossessives(text, cards) {
  if (typeof text !== 'string' || !text) return text;
  let out = text;
  for (const c of cards || []) {
    const name = str(c?.name);
    const m = /^(.+?)\s+\(([^()]+)\)$/.exec(name);
    if (!m) continue;
    out = out.replace(new RegExp(`${NOT_AFTER_LETTER}${esc(name)}(['’])s${NOT_BEFORE_LETTER}`, 'gu'), (_w, q) => `${m[1]} ${m[2]}${q}s`);
  }
  return out;
}

/**
 * A composed text with every person's later mention in each sentence changed (the rule in the header); the first
 * mention in each sentence keeps the full name. A card with no printed name is not a person of the text.
 * @param {string} text the composed line, as written @param {ReadonlyArray<MentionCard | null | undefined>} cards the
 *   persons the line names, each as its line prints it (`name`), with its `gender` and `role`
 * @returns {string}
 */
export function secondMentions(text, cards) {
  if (typeof text !== 'string' || !text) return text;
  /** @type {Array<{ name: string, gender: string, role: string, shared: boolean, card: unknown }>} */
  const people = [];
  for (const c of cards || []) {
    const name = str(c?.name);
    if (!name || people.some((p) => p.card === c)) continue;
    const twin = people.find((p) => p.name === name);
    if (twin) { twin.shared = true; continue; }
    people.push({ name, gender: str(c?.gender), role: str(c?.role), shared: false, card: c });
  }
  if (people.length === 0) return text;
  // a sentence ends at . ! or ? (a closing quote kept with it) before a capital or an opening quote
  const parts = text.split(/((?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu}))/u);
  // NAMES-3 (item 3 (d)): a first mention's possessive of a qualified name opens its bracket (`qualifiedPossessives`)
  return qualifiedPossessives(parts.map((part, i) => (i % 2 === 1 ? part : oneSentence(part, people))).join(''), cards);
}
