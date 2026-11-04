/**
 * defenceTwinLines.js — the defence-free twin of every GENERATION-TIME line that prints walls,
 * a garrison or soldiers, used ONLY where the place's own defence record
 * (`domain/defense/defenseFacts.js :: defenseFactsOf`) says the thing is not there (lane F10
 * unit 4, rung 1C, 2026-11-04: the 34 settlements of the 1,000-soak's defence-words stop that no
 * dossier pool wrote). F5's rule for the inland twins (`inlandHookLines.js`), aimed at defence:
 * keyed by the line's own text, taken AFTER the draw, so no roll moves and only the persisted
 * string varies.
 *
 * WHAT A LINE NEEDS is the defence-words check's own reading
 * (`domain/coherence/defenseWordsFindings.js :: TERMS`), so the writer and the check cannot
 * disagree about a sentence:
 *   `walls`     an enclosure stands (`hasWalls`);
 *   `garrison`  a garrison stands (`hasGarrison`);
 *   `soldiers`  a garrison or a hired company stands (`hasGarrison || hasMercenary`).
 *
 * VETOABLE (the owner's wording call): each twin is the smallest plain rewrite that keeps the
 * line's beat and adds no defence word of its own.
 */

/**
 * @typedef {'walls'|'garrison'|'soldiers'} DefenceNeed
 * @typedef {{ needs: DefenceNeed, twin: string }} DefenceTwin
 * @typedef {{ hasWalls?: boolean, hasGarrison?: boolean, hasMercenary?: boolean }} DefenceTwinFacts
 */

/** @type {Readonly<Record<string, Readonly<DefenceTwin>>>} */
export const DEFENCE_TWIN_LINES = Object.freeze({
  // institutionServices.js — the town council's public works; the underground network's passage.
  'Walls, wells, roads, and the watch':
    Object.freeze({ needs: 'walls', twin: 'Wells, roads and the common ground' }),
  'Move people beneath the walls unseen.':
    Object.freeze({ needs: 'walls', twin: 'Move people in and out unseen.' }),
  // npcGenerator.js — the siege goal; the wartime military override and its note.
  'Identify the person inside the walls who is communicating with the besiegers':
    Object.freeze({ needs: 'walls', twin: 'Identify the person inside the settlement who is communicating with the besiegers' }),
  'Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes':
    Object.freeze({ needs: 'soldiers', twin: 'Keep the defenders together as the call-up pulls away experienced hands and replaces them with frightened substitutes' }),
  "Every experienced soldier conscripted into the field army is a hole in local security that a substitute won't fill the same way.":
    Object.freeze({ needs: 'soldiers', twin: "Every experienced hand called up into the field army is a hole in local security that a substitute won't fill the same way." }),
  // domain/crisis/crisisCast.js :: CAST_REASONS — the brunt of a defence crisis; the defender's office.
  'its people stand on the walls':
    Object.freeze({ needs: 'walls', twin: 'its people stand guard' }),
  "holds the garrison's office":
    Object.freeze({ needs: 'garrison', twin: 'holds the office of the guard' }),
  // institutionDescVariants.js — the waystation's second variant (its own yard, read as the town's walls).
  'An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.':
    Object.freeze({ needs: 'walls', twin: 'An overnight stop inside a fenced yard, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.' }),
  // power/rulingStructure.js — a town's informal military modifier.
  'garrison-backed':
    Object.freeze({ needs: 'garrison', twin: 'arms-backed' }),
  // power/governanceNarrative.js — the merchant-army baseline conflict.
  "A guild's private soldiers arrested a rival's factor. The public watch is refusing to intervene in what they call a 'merchant matter'.":
    Object.freeze({ needs: 'soldiers', twin: "A guild's hired guards arrested a rival's factor. The public watch is refusing to intervene in what they call a 'merchant matter'." }),
});

/**
 * Does the place hold what a line needs?
 * @param {DefenceNeed} need @param {DefenceTwinFacts} facts @returns {boolean}
 */
function holds(need, facts) {
  if (need === 'walls') return facts.hasWalls === true;
  if (need === 'garrison') return facts.hasGarrison === true;
  return facts.hasGarrison === true || facts.hasMercenary === true;
}

/**
 * A drawn line as this place can speak it: its defence-free twin where the place lacks what the
 * line names. A non-string (an absent goal, an object entry) and an unknown record are handed
 * back untouched.
 * @template T
 * @param {T} line
 * @param {DefenceTwinFacts | null | undefined} facts the place's `defenseFactsOf` answer
 * @returns {T}
 */
export function defenceTwinLine(line, facts) {
  if (typeof line !== 'string' || !facts) return line;
  const entry = DEFENCE_TWIN_LINES[line];
  if (entry === undefined || holds(entry.needs, facts)) return line;
  return /** @type {T} */ (/** @type {unknown} */ (entry.twin));
}
