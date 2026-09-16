// monsterThreat.js — PURE DATA + the ONE monster-threat normalizer.
//
// THE CHOKEPOINT (cycle-3 Wave 2, data-contract class). The settlement pipeline
// resolves a raw `config.monsterThreat` (which may be a legacy alias 'low' /
// 'medium' / 'high', the sentinel 'random_threat', or already-canonical) down to
// ONE canonical tier the rest of the app branches on. That resolution used to
// live inline in steps/resolveConfig.js, so every OTHER consumer that wanted to
// know "what values can monsterThreat be?" had to re-derive the set by hand —
// exactly the dead-vocabulary defect this wave closes (a display map carrying a
// tier no producer emits, or missing one it commonly does).
//
// This module is the single source of truth for BOTH the resolver (resolveConfig
// delegates to normalizeMonsterThreat) and the canonical tier SET
// (MONSTER_THREAT_TIERS), which the vocabularyTotality walker
// (tests/lint/vocabularyTotality.walker.test.js) pins every display consumer
// against. Pure — no runtime imports, no RNG — covered by the src/data purity
// lint. resolveConfig keeps the RNG pick (it needs the seed) but draws from the
// weighted pool exported here so the vocabulary lives in one place.

/**
 * The canonical monster-threat tiers the generator actually emits, calmest →
 * most dangerous. Every display/derivation consumer's threat vocabulary must be
 * EXACTLY this set (enforced by the vocabularyTotality walker). 'heartland' is
 * the calm baseline (calmer than 'frontier'); 'embattled' is NOT here — no
 * producer has ever emitted it (it was a dead display arm the walker now forbids).
 * @type {ReadonlyArray<'heartland' | 'frontier' | 'plagued'>}
 */
export const MONSTER_THREAT_TIERS = Object.freeze(['heartland', 'frontier', 'plagued']);

/**
 * The weighted pool resolveConfig rolls from when config.monsterThreat is the
 * 'random_threat' sentinel. Frontier-weighted; every entry is a canonical tier.
 * Exported so the roll vocabulary lives beside the tier set (resolveConfig picks
 * with its own seeded rng).
 * @type {ReadonlyArray<'heartland' | 'frontier' | 'plagued'>}
 */
export const MONSTER_THREAT_RANDOM_POOL = Object.freeze([
  'heartland', 'heartland', 'frontier', 'frontier', 'frontier', 'plagued',
]);

/**
 * Normalize a raw monster-threat value to its canonical tier. Legacy aliases
 * ('low' → heartland, 'medium' → frontier, 'high' → plagued) collapse onto the
 * canonical set; an absent value defaults to 'frontier'; an already-canonical
 * value (or any unknown token, e.g. the golden-corpus 'safe'/'civilized' probes)
 * passes through verbatim. Does NOT resolve 'random_threat' — that needs an rng
 * roll (resolveConfig owns it, then normalizes the rolled value through here).
 *
 * Byte-for-byte identical to the inline resolution resolveConfig previously did,
 * so extracting it is a pure, generator-golden-neutral refactor.
 *
 * @param {string | null | undefined} raw
 * @returns {string} the canonical (or verbatim-passthrough) tier
 */
export function normalizeMonsterThreat(raw) {
  const mt = raw || 'frontier';
  return mt === 'low' ? 'heartland'
    : mt === 'high' ? 'plagued'
      : mt === 'medium' ? 'frontier'
        : mt;
}
