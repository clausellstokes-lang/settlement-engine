/**
 * data/people/powerSentenceName.js — a power's name as it sits inside a sentence, and its possessive: THE ONE READER
 * (POWERS-16), a pure leaf (no imports), moved verbatim, body and all, from `domain/display/powerSentenceName.js`
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

/** @param {unknown} name @returns {string} the sentence name with its possessive */
export function powerPossessive(name) {
  const said = powerSentenceName(name);
  const last = said.split(' ').at(-1) || '';
  // a plural takes a bare apostrophe: -ies, or any -s that is not a singular -us / -ss / -is
  const plural = /ies$/i.test(last) || (/s$/i.test(last) && !/(?:us|ss|is)$/i.test(last));
  return plural ? `${said}'` : `${said}'s`;
}
