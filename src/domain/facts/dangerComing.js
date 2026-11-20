/**
 * domain/facts/dangerComing.js — THE DANGER-COMING HOME (BAR4-CORPUS-DEF, kind D1 "nothing threatens it"; BRIEF-BAR4
 * amendment 5b: a new atom beside its family, vetoable by the owner, on the veto list as new vocabulary). ONE atom, the
 * record's fact: a danger from outside is on its way. The record holds it as a live tension of the history
 * (`history.currentTensions[].type === 'external_threat'`, "News of approaching danger divides the community on how to
 * respond", its parties "Prepare for war", "Seek diplomacy", "Flee/hide"), which the crisis record's armed-threat family
 * (`crisisKind.js :: CRISIS_FAMILIES.threat`: a siege, an occupation, monster pressure) does not see: a calm town can
 * hold it. A line that says nothing threatens the place presumes its absence: "Ribatchowk has no wall, and nothing
 * threatens it now that a wall would keep out." beside its own tension (REVIEW-BAR-4 C18744, bar0-hamlet-calm-rand-23;
 * C45642, bar0-village-calm-rand-23).
 *
 *   dangerComingOf(record)   THE ONE READER: true where a live tension of the history is an external threat.
 *
 * Layer 4 (over the history, layer 3). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar4CorpusDefKinds.test.js
 */

/**
 * Is a danger from outside on its way (a live external-threat tension on the history)?
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function dangerComingOf(record) {
  const tensions = /** @type {{ history?: { currentTensions?: unknown } | null } | null} */ (record)?.history?.currentTensions;
  return Array.isArray(tensions) && tensions.some((t) => !!t && typeof t === 'object' && /** @type {{ type?: unknown }} */ (t).type === 'external_threat');
}
