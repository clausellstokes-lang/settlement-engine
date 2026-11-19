/**
 * domain/facts/magicSupply.js — THE MAGIC-SUPPLY HOME (BAR4-CORPUS-DEF, kind D2 "what rests on magic"; BRIEF-BAR4
 * amendment 5b: a new atom beside its family, vetoable by the owner, on the veto list as new vocabulary). ONE atom, the
 * record's fact: goods the town lives on arrive by magic. The economy writes it on the trade dependencies of an isolated
 * place that keeps a teleportation circle (`economicState.js`: severity below critical, impact "Supplied via magical
 * trade infrastructure: teleportation imports replace road access."), and the chain cards print it ("Meals, ale and
 * lodging here depend on grain brought in by magic", `display/chainNeedShown.js`, the same two fields: an isolated route
 * and a need not critical). The reliance reading (`magicReliance.js :: deriveMagicReliance`) counts the work done by
 * magic, not the supply carried by it, so a town can read "not relied on" and still eat what a circle brings: "Whatever
 * magic reaches Madinatserai, the town does not rest on it: nothing it lives by would stop without it." beside its own
 * timber, iron and grain brought in by magic (REVIEW-BAR-4 C36862, bar0-town-calm-rand-22).
 *
 *   magicSupplyOf(record)   THE ONE READER: true where the route is isolated and a trade dependency is met (severity
 *                           not critical: the generator's isolated-and-unsupplied need is critical, "running on existing
 *                           stockpiles only").
 *
 * Layer 2 (over the economy). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar4CorpusDefKinds.test.js
 */

/**
 * Do goods the town lives on arrive by magic (an isolated route whose trade needs are met)?
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function magicSupplyOf(record) {
  const e = /** @type {{ economicState?: { tradeAccess?: unknown, tradeDependencies?: unknown } | null } | null} */ (record)?.economicState;
  if (!e || e.tradeAccess !== 'isolated' || !Array.isArray(e.tradeDependencies)) return false;
  return e.tradeDependencies.some((d) => !!d && typeof d === 'object' && /** @type {{ severity?: unknown }} */ (d).severity !== 'critical');
}
