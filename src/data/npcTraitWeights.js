/**
 * data/npcTraitWeights.js — the LIGHT trait-weight leaf (FP-G3 first-paint reclaim).
 *
 * TRAIT_ALIGNMENT (good↔evil) and TRAIT_AGGRESSION (belligerent↔pacific) are the two
 * small signed-weight maps over the AUTHORED personality descriptor vocabulary. They
 * were single-sourced inside data/npcData.js (79 kB — the full NPC personality/role/
 * archetype prose tables). But the ONLY EAGER consumer of npcData.js was domain/
 * corruption.js (an ENGINE_SHARED_DOMAIN member, in first paint), which reads NOTHING
 * but TRAIT_ALIGNMENT — so a ~1.3 kB const dragged the whole 64 kB (minified) npcData.js
 * into the entry's static closure (the FP-G1/G2 light-consumer-drags-heavy class). These
 * two frozen maps now live in THIS zero-import leaf; npcData.js re-exports them verbatim
 * (single source preserved for every other — all lazy — consumer + the tests), and the
 * eager corruption.js imports them from HERE, so npcData.js leaves first paint entirely.
 *
 * FIRST-PAINT LAW: keep this leaf import-free. Never add a dependency here or the reclaim
 * regresses. @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

/**
 * TRAIT_AGGRESSION — signed belligerent↔pacific weights over the AUTHORED personality
 * descriptor vocabulary. A POSITIVE weight is belligerent, a NEGATIVE weight pacific /
 * cooperative; a descriptor absent from this map contributes EXACTLY 0 (neutral), so
 * adding vocabulary never silently churns the score. Keys are lowercased descriptor
 * strings; lookups normalize case + trim. Pure data — frozen so a typo'd key reads as
 * `undefined` (→ 0). Consumed by worldPulse/disposition.js (the war-layer aggression
 * baseline; dormant behind warLayerEnabled).
 * @type {Readonly<Record<string, number>>}
 */
export const TRAIT_AGGRESSION = Object.freeze({
  // ── belligerent (flaw / negative vocab → +) ───────────────────────────────
  cruel: 0.9,
  'cold-blooded': 0.9,
  ruthless: 0.85,
  callous: 0.7,
  domineering: 0.7,
  overbearing: 0.65,
  imperious: 0.65,
  wrathful: 0.8,
  vengeful: 0.75,
  vindictive: 0.75,
  reckless: 0.5,
  volatile: 0.55,
  arrogant: 0.4,
  'self-serving': 0.35,
  bitter: 0.3,
  // ── pacific / cooperative (positive vocab → −) ────────────────────────────
  merciful: -0.85,
  compassionate: -0.8,
  diplomatic: -0.8,
  generous: -0.6,
  magnanimous: -0.7,
  'warm-hearted': -0.6,
  patient: -0.55,
  humble: -0.5,
  'fair-minded': -0.55,
  'level-headed': -0.5,
  principled: -0.4,
  protective: -0.3,
  loyal: -0.2,
  // ── neutral vocab → mild signed nudges (modifier slot) ────────────────────
  zealous: 0.4,
  ambitious: 0.3,
  opportunistic: 0.25,
  contrarian: 0.2,
  cynical: 0.15,
  proud: 0.15,
  cautious: -0.25,
  reserved: -0.15,
});

/**
 * TRAIT_ALIGNMENT — signed good↔evil weights over the AUTHORED personality descriptor
 * vocabulary. It reads the SAME AUTHORED `npc.personality.{dominant,flaw,modifier}`
 * strings (what the dossier shows), NEVER the RNG-rolled `npcStates.alignment`. It
 * encodes HOW an individual NPC responds to an embedded deity's good/evil axis — NOT the
 * deity's own alignment.
 *
 * Convention: a POSITIVE weight is a GOOD-leaning conscience (compassionate, principled,
 * merciful) — MORE incorruptible under a good deity, MORE RESISTANT to an evil deity's
 * corruption. A NEGATIVE weight is an EVIL-leaning disposition (cruel, ruthless,
 * deceitful) — corrupts FASTER under an evil deity, harder for a good deity to reform.
 * The per-NPC disfavor at the call site is the DOT PRODUCT of this signed score with the
 * deity's signed alignment direction (see corruption.npcAlignmentScore).
 *
 * Magnitudes are bounded (|w| ≤ 1) and intentionally modest. A descriptor absent from
 * this map contributes EXACTLY 0 (neutral). Keys are lowercased descriptor strings;
 * lookups normalize case + trim. Pure data — frozen so a typo'd key reads as `undefined`
 * (→ 0), not a silent miss. SINGLE SOURCE: consumed by domain/corruption.js
 * (npcAlignmentScore) + worldPulse/disposition.js.
 * @type {Readonly<Record<string, number>>}
 */
export const TRAIT_ALIGNMENT = Object.freeze({
  // ── good-leaning conscience (positive vocab → +) ──────────────────────────
  compassionate: 0.85,
  merciful: 0.85,
  generous: 0.7,
  magnanimous: 0.75,
  'warm-hearted': 0.65,
  principled: 0.8,
  incorruptible: 1,
  'fair-minded': 0.7,
  honest: 0.75,
  forthright: 0.6,
  loyal: 0.4,
  humble: 0.45,
  protective: 0.45,
  pious: 0.5,
  brave: 0.35,
  patient: 0.3,
  // ── evil-leaning disposition (negative vocab → −) ─────────────────────────
  cruel: -0.9,
  'cold-blooded': -0.9,
  ruthless: -0.85,
  callous: -0.7,
  wrathful: -0.65,
  vengeful: -0.65,
  vindictive: -0.7,
  deceitful: -0.7,
  manipulative: -0.7,
  mendacious: -0.65,
  corrupt: -0.85,
  greedy: -0.6,
  'self-serving': -0.55,
  hypocritical: -0.5,
  domineering: -0.45,
  imperious: -0.4,
  petty: -0.3,
  // ── neutral vocab → mild signed nudges (modifier slot) ────────────────────
  zealous: -0.2,
  opportunistic: -0.3,
  cynical: -0.2,
  hedonistic: -0.25,
  pragmatic: -0.1,
  idealistic: 0.3,
  stoic: 0.1,
});

/**
 * THE GROWTH-LAYER OVERLAY READER (owner commission #36, THE GROWTH LAYER). The acquired
 * (learned/temporary) traits an NPC has weathered into — the descriptor strings the growth
 * kernel (worldPulse/npcGrowthKernel.js) MIRRORS onto a NON-core `npc.acquiredTraits[]`
 * field (each `{ trait, intensity, since, provenance }`). The core personality
 * ({dominant,flaw,modifier}) is NEVER touched — this is a pure additive OVERLAY the
 * personality-summing consumers (corruption npcAlignmentScore, disposition aggression/
 * conscience, momentum commitment cliff) append to their authored-descriptor list so a
 * learned trait "reflects in that NPC's decision making, stances, and goals" (owner).
 *
 * PLACEMENT: this zero-import light leaf, NOT the lazy npcGrowthKernel — the EAGER
 * consumer corruption.js already imports this leaf, so the overlay reaches it at ZERO
 * first-paint cost (importing the lazy kernel into eager corruption.js would drag the
 * kernel into the entry closure — the FP-G3 light-leaf discipline, inverted: the reader
 * lives with the eager-safe weights it feeds). ABSENT field ⇒ [] ⇒ every consumer is
 * byte-identical (the dormancy law: no growth flag ⇒ no mirror ⇒ no acquiredTraits). Pure.
 * @param {unknown} npc @returns {string[]}
 */
export function acquiredTraitDescriptors(npc) {
  const raw = npc && typeof npc === 'object' && !Array.isArray(npc)
    ? /** @type {{ acquiredTraits?: unknown }} */ (npc).acquiredTraits : null;
  const acquired = Array.isArray(raw) ? raw : null;
  if (!acquired || acquired.length === 0) return [];
  const out = [];
  for (const a of acquired) {
    const t = a && typeof a === 'object' && !Array.isArray(a) ? /** @type {{trait?:unknown}} */ (a).trait : a;
    if (typeof t === 'string' && t) out.push(t);
  }
  return out;
}
