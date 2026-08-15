/**
 * domain/npc/npcFacets.js — THE NO-DEAD-FACET LAW manifest (DESIGN_NPC_LIFECYCLE §4).
 *
 * Owner: "every facet ... coherent with the surrounding world. nothing is useless."
 * The law runs in TWO directions and is walker-enforced
 * (tests/domain/npc/npcFacetConsumer.walker.test.js), modeled on the
 * operation-registry manifest + the guidance whisper-census host-scan:
 *
 *   (a) GENERATION READS THE WORLD — every facet has a `source` naming the minting
 *       site that reads settlement context to set it (no facet rolled in a vacuum).
 *   (b) THE WORLD READS EVERY FACET — every facet has ≥1 registered `consumer` (an
 *       agency / politics / corruption / reframe read, or a display surface) that
 *       ACTUALLY references the attribute (the walker content-scans the file).
 *
 * A bank facet without a declared source or a registered, real consumer FAILS THE
 * BUILD. Pre-existing dead facets go in EXEMPT_FACETS (exempt-with-reason) under a
 * SHRINK-ONLY ceiling — same monotonicity rule as the operation-registry exempt set.
 *
 * `token` is a code identifier the walker asserts is present in `file` — the proof
 * that the read/source is real, not merely declared. Zero-import lazy leaf (data +
 * a couple of accessors); nothing eager imports it.
 */

/**
 * @typedef {Object} FacetSource   the minting site that reads the world for this facet
 * @property {string} file @property {string} token @property {string} reads
 * @typedef {Object} FacetConsumer a read that consumes the facet attribute
 * @property {string} file @property {string} token @property {string} read
 * @typedef {Object} FacetSpec
 * @property {FacetSource} source @property {FacetConsumer[]} consumers
 */

/** The registered NPC bank facets — one entry per NPC_FACET_KINDS member.
 *  @type {Readonly<Record<string, FacetSpec>>} */
export const NPC_FACET_REGISTRY = Object.freeze({
  alignment: {
    source: {
      file: 'src/domain/worldPulse/npcAgency.js',
      token: 'ALIGNMENTS',
      reads: 'ensureNpcStates seeds alignment from the corrupt climate it reads off the settlement',
    },
    consumers: [
      { file: 'src/domain/worldPulse/settlementPolitics.js', token: 'alignment', read: 'leaderAlignmentKinship — the §B quadrant gate on bloc formation' },
    ],
  },
  temperament: {
    source: {
      file: 'src/generators/npcGenerator.js',
      token: 'personality',
      reads: 'generateReligionType draws personality.dominant weighted by institution/stress context',
    },
    consumers: [
      { file: 'src/domain/corruption.js', token: 'personality', read: 'npcAlignmentScore reads the personality descriptors' },
      { file: 'src/components/new/npcComponents.jsx', token: 'normalizeNpcTraits', read: 'the NPC card renders the normalized trait chips (temperament included)' },
    ],
  },
  role: {
    source: {
      file: 'src/generators/npcGenerator.js',
      token: 'computeNPCWeights',
      reads: 'the role/category mix is weighted by institution presence + stressors',
    },
    consumers: [
      { file: 'src/domain/worldPulse/npcAgency.js', token: 'inferRoleArchetype', read: 'agency maps role → archetype → the verbs the NPC will consider' },
      { file: 'src/components/new/npcComponents.jsx', token: 'roleFacet', read: 'the NPC card reads the declared role archetype while preserving the authored office/title' },
    ],
  },
  goal: {
    source: {
      file: 'src/generators/npcGenerator.js',
      token: 'generateNPCRelType',
      reads: 'the goal is drawn from role + the active stress type(s)',
    },
    consumers: [
      { file: 'src/domain/worldPulse/settlementPolitics.js', token: 'longGoal', read: 'deriveEnd/GOAL_END_HINT colors a bloc end from the leader goal' },
      { file: 'src/components/new/npcComponents.jsx', token: 'goalFacet', read: 'the NPC card reads and translates the declared goal facet' },
    ],
  },
});

/**
 * EXEMPT-with-reason (pre-existing dead facets): a bank facet kept without a live
 * consumer for a documented reason. SHRINK-ONLY under FACET_EXEMPT_CEILING — lower
 * the ceiling as facets are wired, never raise it. Empty today: all four bank facets
 * have real consumers.
 * @type {Readonly<Record<string, { reason: string }>>}
 */
export const EXEMPT_FACETS = Object.freeze({});

/** The committed exempt ceiling (shrink-only). 0 — no dead facets. */
export const FACET_EXEMPT_CEILING = 0;

/** Registered facet kinds (the manifest's keys). */
export function registeredFacetKinds() { return Object.keys(NPC_FACET_REGISTRY); }
/** Exempt-with-reason facet kinds. */
export function exemptFacetKinds() { return Object.keys(EXEMPT_FACETS); }
