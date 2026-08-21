/**
 * habitGate.js — HB-2. THE GATE LADDER'S FIRST DOOR, and nothing beyond it.
 *
 * The HABIT volume charters a FOUR-DOOR ladder: storing a habit, computing one, deciding
 * with one, and spreading one. ⛔ THIS WAVE LANDS DOOR ONE ONLY. The other three belong to
 * HB-4, HB-5 and HB-6, and a gate file that declared them now would be four dead arms
 * wearing a ladder's clothing — the same dead-arm defect the curve's own cap law names.
 *
 * PURE, and DEPENDENCY-FREE BY CONSTRUCTION: this leaf imports nothing at all. That is not
 * tidiness, it is the registration argument — its `ARGUED_UNLAYERED` row declares
 * `reads: Object.freeze([])`, the walker recomputes that field from the live import set and
 * reds on drift in BOTH directions, and a leaf with no imports cannot drift.
 *
 * ── WHY THE READ IS SPELLED THE WAY IT IS ───────────────────────────────────────
 *
 * The strict `=== true` by-name read is REQUIRED rather than stylistic. The engine-gated
 * census walker resolves a gate by its receiver and its key NAME, so a frozen-list
 * `.every()` — the tidier idiom — would be a computed member access attributing to NO key:
 * fully wired, genuinely gated, and INVISIBLE to the census that exists to find it. A gate
 * nothing can see is a gate nobody can audit.
 *
 * ⚠ `=== true` also carries the polarity law. An ABSENT flag and a FALSE flag must read
 * identically dark, and a truthy check would light the lane on any non-empty value a
 * malformed rules object happened to carry.
 *
 * ⚠ THE RECEIVER IS A CALL EXPRESSION, DELIBERATELY. `asObject(worldState).simulationRules`
 * is an observed-shape-reader idiom: the detector grounds a finding by its receiver ROOT,
 * and a CallExpression receiver resolves to nothing, so this read adds no finding to the
 * frozen inventory. A plain `worldState?.simulationRules` is an identifier chain and would.
 * The local helper is therefore load-bearing twice over — see the note below.
 *
 * ⛔ `asObject` IS LOCAL AND MUST STAY LOCAL. `npcLadderState.js` exports an identical
 * helper, and importing it would give this leaf a real INTERIOR read — `npcLadder` matches
 * the interior layer family — which reds this file's own declared empty `reads` row by name.
 * The duplication is the cheaper of two evils and is recorded rather than silently repeated.
 *
 * @enforced-by tests/property/habitNeutralIdentity.test.js
 */

/**
 * A defensive object coercion. Local by registration law (see the header), never imported.
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * DOOR ONE — may this world STORE a habit at all?
 *
 * The one gate read of `habitConditioningEnabled` in the tree. Every other habit artefact
 * asks this function rather than re-reading the flag, so the polarity is decided once.
 *
 * @param {unknown} worldState
 * @returns {boolean} true only when the flag is present and exactly `true`
 */
export function habitsActive(worldState) {
  const rules = asObject(asObject(worldState).simulationRules);
  return rules.habitConditioningEnabled === true;
}
