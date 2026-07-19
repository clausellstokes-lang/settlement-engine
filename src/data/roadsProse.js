/**
 * data/roadsProse.js — THE ROADS chronicle prose pools (ENGINE LIFT #5; DESIGN_THE_ROADS.md
 * §12/§14). A LAZY data leaf (the CONTENT-GT max-lines ratchet rule): pure frozen variant
 * pools, imported only by eventProse.js (which flattens them into EVENT_PROSE_REGISTRY, so
 * the register / canonical-at-zero / reachability guards cover roads for free) and by the
 * lazy roads kernel (which selects via eventProse's pickLine/fnv1a32).
 *
 * THE LAWS (the eventProse constitution, tests/domain/eventProse.test.js +
 * tests/domain/roadsProse.test.js):
 *  1. CANONICAL-AT-ZERO: every pool's index-0 entry is the canonical phrasing; a falsy seed
 *     selects it.
 *  2. FRAMING-NOT-SEMANTICS: variants vary PHRASING only; the interpolated names/purpose are
 *     the world's own, threaded through unchanged.
 *  3. PORTABLE SPECIFICITY: catalog-anchored generics only, never a canon proper noun (the
 *     {npc}/{home}/{dest}/{captor} tokens ARE the world's names).
 *  4. NO CALAMITY SUBSTRINGS (the F24 scan, extended to roads.* in roadsProse.test.js): no
 *     flood/fire/quake/earthquake/storm — travel/capture prose speaks its own vocabulary.
 *
 * Pure leaf: imports nothing. Interpolation tokens: {npc} {home} {dest} {captor} {purpose}.
 */

/** @typedef {import('../domain/worldPulse/eventProse.js').ProseVariant} ProseVariant */

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const ROADS_NEWS = Object.freeze({
  // ── DEPARTURE (quiet; NOTABLE for a pillar or a tradition-critical journey) ──
  departure: {
    headline: [
      (x) => `${x.npc} sets out from ${x.home} for ${x.dest}`, // canonical
      (x) => `${x.npc} takes the road from ${x.home} to ${x.dest}`,
      (x) => `${x.npc} rides out of ${x.home}, bound for ${x.dest}`,
      (x) => `${x.npc} departs ${x.home} on the ${x.dest} road`,
    ],
    summary: [
      (x) => `${x.npc} has left ${x.home} for ${x.dest} on ${x.purpose} business — a journey of the middle ranks.`, // canonical
      (x) => `${x.npc} has taken the ${x.dest} road out of ${x.home}, sent on ${x.purpose} business.`,
      (x) => `An envoy of ${x.home}, ${x.npc}, is abroad toward ${x.dest} on ${x.purpose} business.`,
      (x) => `${x.npc} of ${x.home} is on the road to ${x.dest}, carrying ${x.purpose} business.`,
    ],
  },
  // ── RETURN (NOTABLE — the traveller comes home) ──
  return: {
    headline: [
      (x) => `${x.npc} returns to ${x.home}`, // canonical
      (x) => `${x.npc} comes home to ${x.home}`,
      (x) => `${x.npc} is back within the walls of ${x.home}`,
      (x) => `${x.npc} rides home to ${x.home}`,
    ],
    summary: [
      (x) => `${x.npc} has come home to ${x.home}, the ${x.dest} journey behind them.`, // canonical
      (x) => `${x.npc} is returned to ${x.home} from ${x.dest}, the errand done.`,
      (x) => `The road from ${x.dest} is behind ${x.npc}, who is safely back in ${x.home}.`,
      (x) => `${x.npc} has ridden back into ${x.home} from ${x.dest}.`,
    ],
  },
});
