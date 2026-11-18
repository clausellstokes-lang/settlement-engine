/**
 * domain/facts/uprising.js — THE RISING HOME (BAR8-DESKS-DEF, rule 12e of BAR8-AUDIT-K; the chair's ruling BR14 (c): a NEW
 * atom for the record's live tension, vetoable by the owner, on the veto list as new vocabulary). ONE atom, the record's fact:
 * the common people are pressing, or have risen, against those in charge. The record holds it as a live tension of the
 * history (`history.currentTensions[].type === 'popular_uprising'`: "The common people rose against the ruling powers over
 * …", or by memory "The common people are pressing those in charge over …", its parties "Former rebels" or "Those pressing
 * their demands"), which the desk's `unrest` dimension (the crisis kinds insurgency, slave revolt, wartime) does not see: a
 * calm town can hold it. A line that says nobody stands ready to lead the people against the seat presumes its absence:
 * "People at Khutulunnuur may grumble, but nobody in the hamlet stands ready to lead them against the Headman's Authority."
 * beside its own rising (the seventh read's C16668, bar0-hamlet-calm-rand-46). `unrest` is NOT widened: every line that
 * declares it would move, unmeasured.
 *
 *   uprisingOf(record)   THE ONE READER: true where a live tension of the history is a popular uprising.
 *
 * Layer 4 (over the history, layer 3). Import-free (ruling EG1: `factsOf.js` reads it eagerly). Pure: no randomness, no
 * clock, no write.
 *
 * @enforced-by tests/domain/bar8DesksDef.test.js
 */

/**
 * Does a live tension of the history hold a popular uprising?
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function uprisingOf(record) {
  const tensions = /** @type {{ history?: { currentTensions?: unknown } | null } | null} */ (record)?.history?.currentTensions;
  return (Array.isArray(tensions) ? tensions : tensions ? [tensions] : [])
    .some((t) => !!t && typeof t === 'object' && /** @type {{ type?: unknown }} */ (t).type === 'popular_uprising');
}
