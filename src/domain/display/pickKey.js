/**
 * THE KEY A VIEW-TIME PICK STANDS ON (point 124, "A RENAME KEEPS THE PAGE"; the chair's ruling E26).
 *
 * A town's page picks many of its lines at view time by a hash of a KEY. Where that key held the town's NAME (or a
 * person's), renaming the town re-dealt its whole page, and where it held `_seed`, an imported copy (the JSON import,
 * the share, the gallery import all drop `_seed`) re-dealt it. The record's own `id` is minted at birth from `_seed`
 * (`normalizeSettlement`, `idFromSeed`), is never written by a rename, and survives every road a record travels
 * (save and reload, the JSON round trip, the share's projection, the gallery import, the PDF's input; Foundry keeps
 * its tail): RENAME-MEASURE (B) and RENAME-BUILD's measure (i), by execution. So every such pick keys on the id.
 *
 * ONE RULE, SAID ONCE, HERE: the holder's own `id` where it holds one (a non-empty string), else `fallback`, the key
 * the site had before this point. A record with no id (a legacy save before its first normalize stamps one, a
 * hand-built fixture) therefore prints exactly what it printed. A leaf: it imports nothing.
 *
 * @template F
 * @param {unknown} holder the town's record (or a person's row) whose pick this is
 * @param {F} fallback the site's own key where the holder holds no id
 * @returns {string|F}
 */
export function pickKeyOf(holder, fallback) {
  const id = holder && typeof holder === 'object' ? /** @type {{ id?: unknown }} */ (holder).id : undefined;
  return typeof id === 'string' && id !== '' ? id : fallback;
}
