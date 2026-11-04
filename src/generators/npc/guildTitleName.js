/**
 * generators/npc/guildTitleName.js — the guild's name as a guild master's title names it
 * (CENSUS-4 R9, `reader:possessive-slip`).
 *
 * "Weavers' guild" → "Weavers'" (the title reads "Guildmaster of Weavers'"). The rule before this
 * module stripped `s'? guild` and appended `s'`, so a SINGULAR possessive name doubled its
 * apostrophe: "Tailor's guild" → "Tailor's'", "Quarrymen's guild" → "Quarrymen's'". A singular
 * possessive now takes the plural possessive the plural names already print ("Tailors'"); an
 * irregular plural that is already possessive keeps it ("Quarrymen's"). A parenthetical is
 * dropped first, as before ("Bowyers & fletchers (guild)" → "Bowyers & fletchers").
 *
 * Pure string work: no rng, so no draw moves; only the title text of a singular-possessive guild
 * changes.
 */

/** Plural stems that take `'s` (they do not end in s). */
const IRREGULAR_PLURAL = /(?:men|women|folk|people|children)$/i;

/**
 * @param {string} name the guild institution's name
 * @returns {string}
 */
export function guildTitleName(name) {
  const bare = String(name ?? '').replace(/\s*\(.*?\)/, '');
  const singular = bare.match(/^(.*?)['’]s\s*guild$/i);
  if (singular) return IRREGULAR_PLURAL.test(singular[1]) ? `${singular[1]}'s` : `${singular[1]}s'`;
  return bare.replace(/s'?\s*guild$/i, "s'");
}
