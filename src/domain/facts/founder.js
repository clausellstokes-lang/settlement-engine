/**
 * domain/facts/founder.js — THE FOUNDER'S HOME (W2-A-LEAVES, 2026-11-12; the class table's pattern 7a: "one
 * founder, and the 'Founded by' row is its home").
 *
 * The record keeps one founder, `history.founding.foundedBy`, drawn from the tier's founder table
 * (`narrativeGenerator.js`). The founding's REASON is drawn apart and some reasons name a founder of their own:
 * two answers to "who founded the town". This leaf is the one answer, and its KIND is the condition a reason
 * that names a founder declares (W2-B-DECLARE's twin rule reads it). The kind is read from the drawn line BY
 * TABLE (`FOUNDER_KIND`, every line of the founder tables, each written once), never by a word test; a line no
 * row names reads as `other`, and the leaf's test holds the table to the tables it classes.
 *
 * Layer 4 (it reads the history, stored at layer 3). Pure: no randomness, no clock, no write.
 */

/** The founder kinds a reason may declare. */
export const FOUNDER_KINDS = Object.freeze(['family', 'military', 'healer', 'trade', 'religious', 'noble', 'crown', 'community']);

/**
 * Every founder line of `narrativeGenerator.js :: FOUNDERS_BY_TIER`, and its kind.
 * @type {Readonly<Record<string, string>>}
 */
export const FOUNDER_KIND = Object.freeze({
  'a single extended family who came and never left': 'family',
  'a pair of siblings who disagreed about which direction to keep walking': 'family',
  'a discharged soldier who liked the view and had nowhere better to be': 'military',
  'a healer who stopped to treat a traveller and found the location too useful to leave': 'healer',
  'three or four families who agreed to try wintering together and never stopped': 'family',
  'a miller who built a mill and found customers before they found customers': 'trade',
  'a retired tradesperson whose skills attracted dependents': 'trade',
  'a small religious community whose members drifted into secular life over two generations': 'religious',
  'a group of settlers seeking new opportunities': 'community',
  'refugees fleeing war or persecution who found the location defensible': 'community',
  'a noble granted lands by the crown and obligated to populate them': 'noble',
  'escaped serfs seeking a place beyond the reach of their former masters': 'community',
  'a community of tradespeople who left a larger settlement under contested circumstances': 'trade',
  'merchants recognising economic potential before anyone else did': 'trade',
  'a noble granted lands by the crown with the resources to develop them': 'noble',
  'military veterans given land grants who brought their skills with them': 'military',
  'a merchant consortium that needed a waypoint and decided to own it': 'trade',
  'religious authorities who wanted a centre for their regional operations': 'religious',
  'a powerful noble house that needed a commercial base independent of rivals': 'noble',
  'a merchant coalition that grew too large for the town they started in': 'trade',
  'a military command that built fortifications and found civilians followed': 'military',
  'royal decree and a century of forced investment': 'crown',
  'imperial decree and the systematic forced relocation of skilled populations': 'crown',
  'a dynastic decision that this crossroads would anchor the realm': 'crown',
  'the slow accretion of three smaller settlements that eventually merged under a single administration': 'community',
  'a great trade house that outgrew every other settlement in the region': 'trade',
});

/**
 * The town's one founder: the line the record keeps, and its kind.
 * @param {unknown} record a settlement record
 * @returns {{ text: string, kind: string } | null} null where the record keeps no founder
 */
export function founderOf(record) {
  const history = record && typeof record === 'object' ? /** @type {{ history?: unknown }} */ (record).history : null;
  const founding = history && typeof history === 'object' ? /** @type {{ founding?: unknown }} */ (history).founding : null;
  const by = founding && typeof founding === 'object' ? /** @type {{ foundedBy?: unknown }} */ (founding).foundedBy : null;
  if (typeof by !== 'string' || !by.trim()) return null;
  return { text: by, kind: FOUNDER_KIND[by.trim()] || 'other' };
}
