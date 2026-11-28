/**
 * domain/facts/growsMoreThanEats.js — THE TOWN GROWS MORE THAN IT EATS (BAR6-DEFDESK, LAW 9's `9c.nothing-over`; BRIEF-BAR6
 * B6: a new atom beside `food`, vetoable by the owner, on the veto list as new vocabulary).
 *
 * The food record's own flag (`foodBalance.js :: growsMoreThanEats`: the day's production above the day's need), the fact
 * the Economics tab prints as "<town> grows more than it eats, with some to put by against a bad year" (`EconomicsTab.jsx ::
 * foodSentence`, over `foodRowShown.js`'s `surplus`, the same production against the same need). The printed food band is
 * not this fact: a town that grows more than it eats prints Secure (30 of 30 such towns of the 150 at afa46d644). A line
 * that says an ordinary year leaves nothing over presumes its absence (REVIEW-WIDE-6: DS-DEF-12's "What X raises leaves
 * nothing over in an ordinary year" beside "X grows a little more than it eats").
 *
 *   growsMoreThanEatsOf(record)  THE ONE READER: the food record's flag, false where it is absent
 *
 * Layer 2 (the economy, layer 1). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar6DefDeskGuards.test.js
 */

/**
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function growsMoreThanEatsOf(record) {
  const fr = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { growsMoreThanEats?: unknown } | null } | null } | null } | null} */ (record)
    ?.economicState?.foodSecurity?.foodRecord;
  return !!fr && fr.growsMoreThanEats === true;
}
