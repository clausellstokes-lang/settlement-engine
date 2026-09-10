/**
 * institutionToggleReader.js — the single reader for per-institution toggles.
 *
 * ── THE CLASS THIS CLOSES ────────────────────────────────────────────────────
 * The wizard writes an institution toggle under a DUAL KEY FORMAT — the modern `::` spelling
 * and a legacy `_` one — and under either the resolved tier or the `all` sentinel. Reading
 * one therefore means a precedence ladder, and that ladder was INLINED at 23 lookup sites
 * across three files (12 in `steps/assembleInstitutions.js`, 6 in `cascadeGenerator.js`,
 * 5 in `factionCorrelation.js`) with no shared reader (§759, weakness 4).
 *
 * That is a divergence habitat in a codebase that elsewhere builds one-source predicates
 * precisely to kill it — `categoryToggleReader.js` is the SIBLING CONCERN'S cure, minted
 * after the category ladder had already produced a real bug: the wizard's disables were dead
 * for random/custom settlements while faction pulls honoured them, "an internal contradiction"
 * in its own words. Same shape, same wizard, same writer, and the institution ladder was
 * still spelled by hand everywhere.
 *
 * ── THE LADDER, ONCE ─────────────────────────────────────────────────────────
 * For each tier candidate in order, then the `all` sentinel: the `::` key, then the `_` key.
 * FIRST TRUTHY WINS, exactly as the inlined `||` chains resolved — a falsy toggle value falls
 * through to the next key, which is what those chains did and what any caller reading a
 * legacy string/boolean form depends on.
 *
 * Callers keep their own DEFAULT and their own EXTRA tail: `assembleInstitutions` defaults an
 * absent toggle to `{ allow: true, require: false }` at one site and to `undefined` at two
 * others, and `factionCorrelation` ORs a bare-name legacy key after the ladder. Those are
 * genuinely different contracts, so they stay at the call sites rather than being folded in
 * here and quietly unified.
 *
 * Pure, dependency-free. `tests/generators/institutionToggleReader.test.js` drives it against
 * a PLANTED DIVERGENCE — the ladder with one rung removed — so the reader is proven to be
 * doing work rather than agreeing with an empty object.
 */

/**
 * The precedence-ordered key list for one (tier candidates, category, name) lookup.
 * Exported so a test can assert the ORDER without restating it.
 *
 * @param {ReadonlyArray<string|null|undefined>} tiers tier candidates, most specific first
 * @param {string} category
 * @param {string} name
 * @returns {string[]}
 */
export function institutionToggleKeys(tiers, category, name) {
  const keys = [];
  for (const tier of [...tiers, 'all']) {
    keys.push(`${tier}::${category}::${name}`, `${tier}_${category}_${name}`);
  }
  return keys;
}

/**
 * The first truthy toggle for one institution, or `undefined`.
 *
 * @param {Record<string, any>} institutionToggles
 * @param {ReadonlyArray<string|null|undefined>} tiers tier candidates, most specific first
 * @param {string} category
 * @param {string} name
 * @returns {any} the toggle value, or undefined when no key in the ladder holds one
 */
export function institutionToggleFor(institutionToggles, tiers, category, name) {
  const toggles = institutionToggles || {};
  for (const key of institutionToggleKeys(tiers, category, name)) {
    if (toggles[key]) return toggles[key];
  }
  return undefined;
}
