/**
 * domain/facts/presence.js — IS THIS HOUSE HERE (W2-A-LEAVES, 2026-11-12; the class table's "presence on a card",
 * patterns 8 and 18: the flow card asked the roster by the catalogue name's FIRST WORD, so "Parish church" was
 * "here" wherever any house began "Parish", and a catalogue name with a count range was shown as if on the roster).
 *
 * The one answer: a catalogue house is here when a house of the roster carries its name — the same name, folded,
 * with any count range and parenthesised note struck from both sides ("Merchant guilds (15-40)" is "merchant
 * guilds"), or the catalogue name followed by more words ("Tanners" is here where "Tanners' quarter" stands, never
 * where "Tannery" does). Never by a first word.
 *
 * Layer 1 (the roster). Pure: no randomness, no clock, no write.
 */

/** Fold a house name: lower case, a parenthesised note or count range struck, spaces collapsed. @param {unknown} name */
export const foldHouseName = (name) => String(name ?? '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * @param {unknown} record a settlement record (its roster, `institutions`)
 * @param {unknown} houseName a catalogue house name (a chain's processing house, a card's house)
 * @returns {boolean}
 */
export function houseHere(record, houseName) {
  const want = foldHouseName(houseName);
  if (!want) return false;
  const roster = record && typeof record === 'object' ? /** @type {{ institutions?: unknown }} */ (record).institutions : null;
  for (const inst of Array.isArray(roster) ? roster : []) {
    const have = foldHouseName(inst && typeof inst === 'object' ? /** @type {{ name?: unknown }} */ (inst).name : inst);
    if (have === want) return true;
    if (have.startsWith(want) && /^[\s'’]/.test(have.slice(want.length))) return true;
  }
  return false;
}
