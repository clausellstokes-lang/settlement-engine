/**
 * domain/worldPulse/eventProse.js — THE GENERATION-TIME EVENT-PROSE VARIANT POOLS.
 *
 * The content-volume program's generation-time slice (task #27, the park wave). Every
 * corpus here feeds a GENERATION-TIME surface whose picked string PERSISTS into save /
 * golden data (wizardNews entries, settlement.calamityHistory stamps, the warReasons /
 * peaceReasons spatial ledgers, pulseHistory impactDigests). Growing these pools shifts
 * same-seed picks ⇒ this is a golden-bound, park-red surface — the goldens regen once.
 *
 * ── THE LAWS (enforced by tests/domain/eventProse.test.js) ──────────────────────────
 *  1. PURE SELECTION. `pickLine` is a pure FNV-1a hash of a STABLE seed string — no rng,
 *     no Date, no rng-stream perturbation. Selection consumes zero draws, so NO
 *     structural/numeric field of the world can move; only the prose text varies. The
 *     newsVoice.js FNV idiom, brought engine-side (the CONTENT-VT-2 "new mechanism" note).
 *  2. CANONICAL-AT-ZERO. Every pool's index-0 entry is the EXACT pre-existing string, and
 *     a falsy seed selects index 0. So every seedless caller (all existing scorer unit
 *     tests) is byte-identical; only the seeded fold/kernel path varies.
 *  3. FRAMING-NOT-SEMANTICS. Variants vary PHRASING only. Interpolated semantic tokens
 *     (counts, cause, provenance, names, numbers) are threaded through unchanged, so the
 *     receipt's meaning — the same reason, the same cause — never drifts.
 *  4. PORTABLE SPECIFICITY. Catalog-anchored generics only ("the granaries", "the looms",
 *     "the harbour") — NEVER a canon proper noun. "Just enough generic to drop into any
 *     campaign." (Interpolated settlement/mediator NAMES are the world's own, not ours.)
 *  5. CALAMITY BUCKET-NEUTRALITY (CONSTITUTIONAL). The engine never asserts a disaster
 *     KIND. No calamity variant may contain flood/fire/quake/earthquake/storm (as a
 *     substring); the joined calamity prose speaks the bucket ("calamity"). Variety here
 *     adds PHRASING, never disaster-kind vocabulary.
 *
 * Pure leaf: imports nothing, imported only by the lazy worldPulse sim kernels
 * (calamityKernel, warReasons, peaceReasons, hegemonyFear, upswingKernel,
 * resourceDynamicsKernel, settlementLifecycleKernel, realmVerbExecution) ⇒ it rides the
 * lazy engine chunk, never the eager first-paint closure.
 */

/**
 * FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date). Matches the
 * newsVoice.js idiom. @param {string} str @returns {number} */
export function fnv1a32(str) {
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * @typedef {string | ((interp: Record<string, unknown>) => string)} ProseVariant
 * A pool entry: a fixed string, or a function that interpolates the semantic tokens.
 */

/**
 * Pick a phrasing variant deterministically from a pool. A FALSY seed ⇒ index 0 (the
 * canonical string), so seedless callers are byte-identical. A function entry is resolved
 * with `interp`. Pure.
 * @param {ProseVariant[]} pool
 * @param {string | null | undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {string}
 */
export function pickLine(pool, seed, interp = {}) {
  if (!Array.isArray(pool) || pool.length === 0) return '';
  const idx = seed ? fnv1a32(seed) % pool.length : 0;
  const v = pool[idx];
  return typeof v === 'function' ? String(v(interp)) : String(v);
}

// ════════════════════════════════════════════════════════════════════════════════════
// CALAMITY (CRITICAL — bucket-neutral by constitution). Title keeps "Great Calamity"
// + name + year; summary/reasons never assert a kind and speak the bucket.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {ProseVariant[]} title — every variant keeps "Great Calamity" + name + year. */
export const CALAMITY_TITLES = Object.freeze([
  (x) => `The Great Calamity of ${x.name}, year ${x.year}`,          // canonical (== stampTitle)
  (x) => `The Great Calamity that befell ${x.name}, year ${x.year}`,
  (x) => `${x.name}'s Great Calamity, year ${x.year}`,
  (x) => `Year ${x.year}: the Great Calamity of ${x.name}`,
  (x) => `The Great Calamity of ${x.name} in the year ${x.year}`,
]);

/** @type {ProseVariant[]} strike summary — interp {name, ruin, deaths}; contains "calamity". */
export const CALAMITY_SUMMARIES = Object.freeze([
  (x) => `A calamity has struck ${x.name}: ${x.ruin}, about ${x.deaths} dead, and many more take to the roads.`, // canonical
  (x) => `Calamity has come to ${x.name}: ${x.ruin}, near ${x.deaths} dead, and the survivors scatter to the roads.`,
  (x) => `A great calamity has fallen on ${x.name} — ${x.ruin}, some ${x.deaths} dead, and many take flight along the roads.`,
  (x) => `${x.name} lies broken by calamity: ${x.ruin}, about ${x.deaths} dead, and the roads fill with those who remain.`,
  (x) => `Calamity has undone ${x.name}: ${x.ruin}, roughly ${x.deaths} dead, and the living take what they can to the roads.`,
]);

/** @type {ProseVariant[]} strike reason — bucket-neutral, geography-of-exposure. */
export const CALAMITY_REASONS = Object.freeze([
  'The calamity struck where the land lies most exposed — a reckoning of geography.', // canonical
  'It fell hardest where the land lies most exposed — geography kept no favourites.',
  'The most exposed ground bore the worst of it — a reckoning written by the terrain.',
  'Where the land lies open and unsheltered, the ruin ran deepest — geography decided the toll.',
  'The exposed ground took the heaviest blow — where the land offers no shelter, the reckoning is worst.',
]);
