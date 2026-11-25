/**
 * data/people/powerSentenceName.js — a power's name as it sits inside a sentence, and its possessive: THE ONE READER
 * (POWERS-16), a pure leaf (its one import the data layer's `boughtHallNames.js`, a leaf), moved verbatim, body and all, from `domain/display/powerSentenceName.js`
 * (TAIL-TIES-6, the chair's ruling (T23) of 2026-11-15, vetoable by the owner). That path re-exports every name, so no
 * caller moves and the header there keeps the reader's whole account (the label is not a name; the possessive rule).
 *
 * WHY IN THE DATA LAYER. `data/people/dmPowerLines.js` (COHERENCE-POWERS-7 R3) reads the possessive. Read from
 * `domain/display/`, that was a `data` -> `engine-core` chunk edge against the long-standing `engine-core` -> `data` edges
 * (e.g. `domain/people/hallCapture.js -> data/people/dmPowerLines.js`): a two-chunk cycle the built bundle cannot order
 * (tests/build/bootSmoke.test.js stage 1). Here the data table reads a data leaf, and the domain reads the data layer,
 * the lawful direction. The prose forms are a table (PROSE_FORMS), which is what this layer holds.
 * @enforced-by tests/domain/powerSentenceName.test.js
 */

import { boughtHallOldName } from '../boughtHallNames.js';

/**
 * Every power name the estate writes with a slash or a bracket, and its prose form (the record's label is untouched).
 * The writers: data/factionLabelSiblings.js (Military/Guard); generators/power/stressFactions.js (the rest).
 * @type {Readonly<Record<string, string>>}
 */
export const PROSE_FORMS = Object.freeze({
  'Military/Guard': 'The Guard',
  'Monster Hunters / Adventurers': 'Monster Hunters',
  'Noble Claimant (Senior Line)': 'The Senior Line',
  'Noble Claimant (Reform Line)': 'The Reform Line',
  'Third Bloc (Neutrals)': 'The Neutrals',
  'Crown Creditors (Noble Coalition)': 'Crown Creditors',
});

/** @param {unknown} name @returns {string} */
export function powerSentenceName(name) {
  const raw = String(name ?? '').trim();
  if (Object.hasOwn(PROSE_FORMS, raw)) return PROSE_FORMS[raw];
  const first = raw.split('/')[0].replace(/\s*\([^)]*\)\s*$/, '').replace(/\s+/g, ' ').trim();
  return first || raw;
}

/**
 * A power's name in a slot the pool's own text gives an article ("the {seat}", "The {seat} at {settlement}", "the present
 * {seat}", "the faith's party is the {faction}"): the prose form with its own leading "The" struck, so the sentence reads
 * "the Guard", never "the The Guard" (TAIL-DISPLAY-CIVIC-3 V1, the chair's ruling of 2026-11-15; the same holds of a
 * generated name that carries its article, "The Peerage"). A slot with no article before it takes `powerSentenceName`.
 * @param {unknown} name @returns {string}
 */
export function powerNameAfterArticle(name) {
  const said = powerSentenceName(name);
  return said.replace(/^the\s+(?=\S)/i, '') || said;
}

/**
 * A POWER IN A SENTENCE TAKES ITS ARTICLE (NAMES-1, the seventh chair's ruling CN1 of 2026-11-20, vetoable by the owner;
 * the owner, 2026-11-20: "Do it pre deploy. I like it."): a catalogue label is a category, not a proper noun, so a sentence
 * that names a power says "the Feudal Appointee", "the Religious Authorities", never "Feudal Appointee has been debating
 * market levies". THE ONE BODY of `domain/display/governanceAccount.js :: powerNameInProse` (which returns it, under its
 * own name and in its own home), here so a data-layer composer reads it without a data -> engine-core edge: "The" at the
 * head of a sentence, "the" inside one, before the prose form with its own "The" struck ("Military/Guard" -> "the Guard",
 * "The Independent Bloc" -> "the Independent Bloc"). A label in a table, a chip, a heading, a list or a key keeps the
 * roster's spelling; only sentences take this. ⛔ THE VEIL (CN3 (i)): "the" + the name still holds the name as the share
 * veil's search folds it. @enforced-by tests/lint/namesInSentences.walker.test.js
 * @param {unknown} name @param {boolean} [start] the name opens its sentence @returns {string} '' for no name
 */
export function powerNameWithArticle(name, start = false) {
  const body = powerNameAfterArticle(String(name ?? '').trim());
  if (!body) return '';
  return `${start ? 'The' : 'the'} ${body}`;
}

/**
 * A chip or a rank line that names a power by its roster label ("first of Military/Guard"), set inside a sentence: each
 * catalogue label in PROSE_FORMS takes its prose form ("first of The Guard"). For a sentence that quotes a chip whole
 * (pdf/lib/headlines.js :: npcsHeadline); the chip itself keeps the roster's label.
 * @param {unknown} text @returns {string}
 */
export function withPowerSentenceNames(text) {
  let out = String(text ?? '');
  for (const [label, form] of Object.entries(PROSE_FORMS)) out = out.split(label).join(form);
  return out;
}

/**
 * Whether a power's name reads as plural ("Religious Authorities", "Noble Houses"): its head noun, the last word of its
 * prose form ("Third Bloc (Neutrals)" reads "The Neutrals"), ends in a single s ("Guild", "Gentry", "Circle" do not). The
 * body of `domain/display/pluralPowerName.js :: pluralPowerName`, moved here verbatim (NAMES-2, item 5, the seventh
 * chair's word of 2026-11-20) so a data-layer composer (`dmPowerLines.js`) reads it without a data -> engine-core edge;
 * that home keeps its name and returns this.
 * @param {unknown} name @returns {boolean}
 */
export function pluralPowerName(name) {
  const raw = typeof name === 'string' ? name.trim() : '';
  // C1B (point 117; RULING C1B-2 (3)): a bought hall's birth name takes its OLD name's number ("The Council of Syndics is",
  // as "The Corrupt City Council is"), through the one home; an article before it is read past. No other name moves.
  const hall = boughtHallOldName(raw.replace(/^the\s+/i, ''));
  const words = (raw ? powerSentenceName(hall ?? raw) : '').split(/[\s/]+/).filter(Boolean);
  const head = (words[words.length - 1] || '').replace(/[^A-Za-z']/g, '');
  return /[^s']s$/i.test(head);
}

/**
 * A POWER'S VERB TAKES ITS NUMBER (NAMES-2, item 5): "the Merchant Guilds want", "the Elder Council wants". The template
 * hands both forms; the name chooses. @param {unknown} name @param {string} one @param {string} many @returns {string}
 */
export function powerVerb(name, one, many) {
  return pluralPowerName(name) ? many : one;
}

/**
 * A template's AGREEMENT FORM, `{slot|one|many}` (NAMES-3, the seventh chair's rulings CV1/CV2 and CV7 of 2026-11-20, vetoable
 * by the owner): the verb whose subject is the power in `{slot}`, or the "it"/"its" said of it, is written in both numbers
 * and filled by that power's own (`powerVerb`): "the people who lead {power|it|them}", "{faction} {faction|is|are} about".
 * `names` maps a slot to the power's name (bare or in its article form: the head word is the same); a slot it does not hold
 * takes `one`. Every plain `{slot}` is left as written, for the template's own filler. Draw-free.
 * @param {unknown} template @param {Readonly<Record<string, unknown>>} names @returns {string}
 */
export function fillAgreement(template, names) {
  return String(template ?? '').replace(/\{(\w+)\|([^|{}]*)\|([^|{}]*)\}/g, (_m, slot, one, many) => powerVerb(Object.hasOwn(names, slot) ? names[slot] : '', one, many));
}

/**
 * The same, for a composed sentence whose template text is held byte-identical (a banked or held-keyed literal): the verb
 * that directly follows this power's article form ("the Merchant Guilds controls") takes the power's number. Only that
 * power, only that verb, only where it follows the name; a singular power's text is returned as it is.
 * @param {unknown} text @param {unknown} name @param {string} one @param {string} many @returns {string}
 */
export function withPowerVerb(text, name, one, many) {
  const said = String(text ?? '');
  if (!pluralPowerName(name)) return said;
  const body = powerNameAfterArticle(name);
  if (!body) return said;
  const esc = (/** @type {string} */ v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return said.replace(new RegExp(`(\\b[Tt]he ${esc(body)}) ${esc(one)}\\b`, 'g'), `$1 ${many}`);
}

/**
 * A NAME THAT HOLDS A POSSESSIVE TAKES NO SECOND ONE (E1, WORDS-1; the tenth chair's ruling G5 of 2026-11-25): a name with a
 * possessive word in it ("Headman's Authority", "the Thieves' Guild", "Caravan masters' exchange") set before "'s" read
 * "the Headman's Authority's place". Every joiner that writes a name's possessive asks this first and, where it holds,
 * writes the "of" form ("the place of the Headman's Authority"); a name without one prints as before, byte for byte.
 * @param {unknown} name @returns {boolean}
 */
export function holdsPossessive(name) {
  return /[\p{L}\p{N}](?:['’]s|s['’])(?=\s|$)/u.test(String(name ?? '').trim());
}

/** @param {unknown} name @returns {string} the sentence name with its possessive */
export function powerPossessive(name) {
  const said = powerSentenceName(name);
  const last = said.split(' ').at(-1) || '';
  // a plural takes a bare apostrophe: -ies, or any -s that is not a singular -us / -ss / -is
  const plural = /ies$/i.test(last) || (/s$/i.test(last) && !/(?:us|ss|is)$/i.test(last));
  return plural ? `${said}'` : `${said}'s`;
}
