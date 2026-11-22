/**
 * domain/facts/entrepot.js — THE PLACE IS AN ENTREPOT (PAGE-7, CAUSES-DATA addendum 4, item 2: the chair's ruling of 17:32,
 * vetoable by the owner, new vocabulary). ONE atom, the record's own stored mark: goods pass through here on their way
 * elsewhere (`economicState.isEntrepot`, written at the economy step by `generators/economy/tradeGoods.js ::
 * deriveIsEntrepot`: a crossroads route, or a port with an international trade house or a warehouse district). A line that
 * says the place is a waypoint of passing trade presumes it (outside_debt's `through_trade`).
 *
 *   entrepotOf(record)   true / false as stored; undefined where the record carries no economy (unanswered: fail-closed)
 *
 * Layer 2 (it hands on the economy's stored mark, layer 1). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/display/tensionCause.test.js
 */

/**
 * THE ONE READER of `entrepot`.
 * @param {unknown} record the settlement record
 * @returns {boolean | undefined}
 */
export function entrepotOf(record) {
  const econ = /** @type {{ economicState?: { isEntrepot?: unknown } | null } | null | undefined} */ (record)?.economicState;
  if (!econ || typeof econ !== 'object') return undefined;
  return econ.isEntrepot === true;
}
