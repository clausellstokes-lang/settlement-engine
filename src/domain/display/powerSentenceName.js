/**
 * domain/display/powerSentenceName.js — a power's name as it sits inside a sentence, and its
 * possessive. A pure leaf (no imports).
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
 * @enforced-by tests/domain/powerSentenceName.test.js
 */

/** @param {unknown} name @returns {string} */
export function powerSentenceName(name) {
  const raw = String(name ?? '').trim();
  const first = raw.split('/')[0].replace(/\s+/g, ' ').trim();
  return first || raw;
}

/** @param {unknown} name @returns {string} the sentence name with its possessive */
export function powerPossessive(name) {
  const said = powerSentenceName(name);
  const last = said.split(' ').at(-1) || '';
  // a plural takes a bare apostrophe: -ies, or any -s that is not a singular -us / -ss / -is
  const plural = /ies$/i.test(last) || (/s$/i.test(last) && !/(?:us|ss|is)$/i.test(last));
  return plural ? `${said}'` : `${said}'s`;
}
