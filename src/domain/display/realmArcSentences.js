/**
 * realmArcSentences.js — THE ONE WRITER of the realm-arc sentences (SW-9, STYLE-RULINGS-2 A11).
 *
 * `realmArcSummary.js :: realmArcLines` (the owner's map, the PDF, the gallery share) and
 * `worldSnapshotPublic.js :: publicRealmArcLines` (the public snapshot) each spelled the same
 * five sentences by hand, two writers for one fact and a drift waiting to happen. Both now
 * read these functions; each keeps its own selection of WHICH arcs (its own ledgers, its own
 * visibility filter), and only the words live here. Pure, imports nothing.
 */

/** @param {string} name @param {number} seats @returns {string} */
export function ascendancyArc(name, seats) {
  return `The Ascendancy of ${name} (${seats} settlement${seats === 1 ? ' holds' : 's hold'} the faith).`;
}

/** @param {string} name @returns {string} */
export function twilightArc(name) {
  return `The Twilight of ${name} (its altars stand abandoned).`;
}

/**
 * A named war for one siege. Two or more besiegers read as a coalition (the first two named,
 * the rest counted); one reads alone; none reads "an army".
 * @param {string} targetName @param {string[]} attackerNames @returns {string}
 */
export function siegeArc(targetName, attackerNames) {
  const names = attackerNames.filter(Boolean);
  if (names.length >= 2) {
    const named = names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(' and ');
    return `The War of ${targetName}, where a coalition of ${named} besiege the walls.`;
  }
  return `The War of ${targetName}, where ${names[0] || 'an army'} lays siege.`;
}

/** @param {string} commodityLabel @param {string} winnerName @param {string} buyerName @returns {string} */
export function tradeWarArc(commodityLabel, winnerName, buyerName) {
  return `The ${commodityLabel} Trade War, where ${winnerName} seizes ${buyerName}'s market.`;
}
