/**
 * domain/display/powerSentenceName.js — a power's name as it sits inside a sentence, and its
 * possessive. A pure leaf (no imports): THE ONE READER of a power's name in a sentence (POWERS-16).
 *
 * ⛔ A LABEL IS NOT A NAME, AND A POSSESSIVE IS NOT ALWAYS "'s" (VISIBLE-BUGS item 5,
 * 2026-11-12). The pulse's power-move lines (worldPulse/factionCompetition.js) printed a power's
 * label raw and formed its possessive by rule: "Military/Guard captures an institution",
 * "Religious Authorities's people are moving in on the docks". Measured on the landing region,
 * seeds lf-001..040: of 147 power-move lines, 16 headlines and 16 bodies carried a slashed label
 * and 28 bodies a plural name with "'s". No other pulse producer printed either shape there (its
 * "s's" were singular names — towns, persons — which take "'s" rightly).
 *
 * The name: the first of a slashed pair, as an institution's noun is (institutionSentenceNoun):
 * "Military/Guard" → "Military", "Monster Hunters / Adventurers" → "Monster Hunters". The record's
 * label is untouched; this is the sentence's spelling only. The possessive: a power's name (and a
 * suppressed institution's noun, which the pulse's suppression line reads through this same leaf —
 * COHERENCE-POWERS-6 item 8, the "craft guilds's" witness bug) is usually a plural bloc, so a name
 * whose last word is a plural takes a bare apostrophe ("Religious Authorities'", "Merchant Guilds'",
 * "Noble Houses'", "market squares'"); a singular, and the Latin/sibilant singular endings -us, -ss
 * and -is ("consensus's", "duchess's", "crisis's"), take "'s".
 *
 * ⛔ THE OLD RULE (-ies or -s after a consonant) MISSED a plural ending in a VOWEL + s — "Noble
 * Houses" read "Noble Houses's", "market squares" read "market squares's" — and WRONGLY bared a
 * singular -ss ("duchess'"). The widened rule bares every -s plural except the three singular
 * endings, which no roster power name carries (measured 2026-11-13 over the faction and institution
 * catalogues: the only vowel+s singular is "…consensus", correctly kept with "'s").
 * ⛔ A FACTION NAMED IN A SENTENCE TAKES ITS PROSE FORM, FROM THIS ONE LEAF (POWERS-16; the chair's ruling (r2) of
 * 2026-11-14 on the no-lane seat's row: "Military/Guard" inside a sentence, 235 towns of the census's 720 at 30b03024f).
 * A catalogue label that carries a slash or a bracket is not a name a sentence can hold: "the orders and Military/Guard
 * carries them out", "Wants to bring Military/Guard a piece of news". Every power name the generators can write with a
 * slash, a bracket or a count has its prose form in PROSE_FORMS (no catalogue power name carries a count): a NAME, which
 * reads at the head of a sentence and in its middle alike, as "The Independent Bloc" and "The Peerage" already do (the
 * goal slots' contract, data/people/goalFamilies.js). "Military/Guard" reads "The Guard" (not "Military": "third share in
 * Military"; not "Military Command": a town that has the Guard has a "Military Council" or "The Garrison Bloc" beside it in
 * 48 of the 720). A label not in the table keeps the old rule: the first of a slashed pair, a trailing bracket dropped.
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
