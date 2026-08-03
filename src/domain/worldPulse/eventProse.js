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
 *  2. CANONICAL-AT-ZERO. A falsy seed selects index 0, keeping every seedless caller
 *     on the canonical telling. For pools that predate T5, index 0 preserves the
 *     original semantics while the declared punctuation sweep retires its em dashes.
 *  3. FRAMING-NOT-SEMANTICS. Variants vary PHRASING only. Meaning-bearing counts, causes,
 *     provenance and names are threaded through unchanged; engine scalars remain on their
 *     structured records and prose speaks their consequence in world words.
 *  4. PORTABLE SPECIFICITY. Catalog-anchored generics only ("the granaries", "the looms",
 *     "the harbour") — NEVER a canon proper noun. "Just enough generic to drop into any
 *     campaign." (Interpolated settlement/mediator NAMES are the world's own, not ours.)
 *  5. CALAMITY BUCKET-NEUTRALITY (CONSTITUTIONAL). The engine never asserts a disaster
 *     KIND. No calamity variant may contain flood/fire/quake/earthquake/storm (as a
 *     substring); the joined calamity prose speaks the bucket ("calamity"). Variety here
 *     adds PHRASING, never disaster-kind vocabulary.
 *
 * Pure leaf: imports ONLY the roads prose data leaf (src/data/roadsProse.js — the
 * CONTENT-GT content-in-data rule), imported only by the lazy worldPulse sim kernels
 * (calamityKernel, warReasons, peaceReasons, hegemonyFear, upswingKernel,
 * resourceDynamicsKernel, settlementLifecycleKernel, realmVerbExecution, roadsKernel) ⇒ it
 * rides the lazy engine chunk, never the eager first-paint closure.
 */
import { ROADS_NEWS } from '../../data/roadsProse.js';
import { humanizeContextSignature } from '../display/humanizeEngineTokens.js';
import {
  DECREE_DEFAULT_RECEIPTS,
  HEGEMONY_RECEIPTS,
  PEACE_RECEIPTS,
  WAR_RECEIPTS,
} from './warReceiptPools.js';

export { DECREE_DEFAULT_RECEIPTS, HEGEMONY_RECEIPTS, PEACE_RECEIPTS, WAR_RECEIPTS };

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
 * @param {readonly ProseVariant[]} pool
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

/**
 * Pick a phrasing while retaining the STRUCTURAL template family that produced it.
 * Slot fills never create a new family: every interpolation of pool member 1 keeps
 * the same `${familyPrefix}.1` identity. That identity is persisted beside Wizard
 * News prose so the SP-6 repetition instrument can distinguish real authored depth
 * from one sentence dressed in different names. Pure; consumes no rng draw.
 *
 * @param {readonly ProseVariant[]} pool
 * @param {string | null | undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @param {string} [familyPrefix]
 * @returns {{ line: string, familyId: string, templateIndex: number } | null}
 */
export function pickLineWithFamily(pool, seed, interp = {}, familyPrefix = 'prose') {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const templateIndex = seed ? fnv1a32(seed) % pool.length : 0;
  const variant = pool[templateIndex];
  return {
    line: typeof variant === 'function' ? String(variant(interp)) : String(variant),
    familyId: `${familyPrefix}.${templateIndex + 1}`,
    templateIndex,
  };
}

// ════════════════════════════════════════════════════════════════════════════════════
// NPC GOAL BEATS (C2-Q2). These two emitters used one fixed telling for every
// culmination and every context-driven change of ambition. The pools vary only
// the telling; names, goals, roles, personality anchors, and context receipts
// remain the same semantic facts. npcAgency seeds each cell from npc id + tick +
// cell, so no rng draw moves and the same beat always replays to the same words.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const NPC_GOAL_NEWS = Object.freeze({
  culmination: {
    headline: [
      (x) => `${x.name} achieves a long ambition`, // canonical
      (x) => `${x.name}'s long design comes to fruition`,
      (x) => `${x.name} claims a long-sought prize`,
      (x) => `${x.name} brings a long ambition to its end`,
    ],
    summary: [
      (x) => `${x.name} has worked toward "${x.goal}" for a long while, and now seizes it.`, // canonical
      (x) => `After a long pursuit of "${x.goal}", ${x.name} has at last made it real.`,
      (x) => `${x.name}'s patient work toward "${x.goal}" has paid off; the prize is now in hand.`,
      (x) => `The long design to "${x.goal}" has borne fruit for ${x.name}.`,
    ],
    progressReason: [
      (x) => `${x.name}'s long-term goal progress reached its culmination.`, // canonical
      (x) => `${x.name}'s long design had ripened into action.`,
      (x) => `The accumulated work toward "${x.goal}" could no longer be deferred.`,
      (x) => `Patient effort finally carried ${x.name}'s ambition across the threshold.`,
    ],
    roleReason: [
      (x) => `Role: ${x.role}; goal: ${x.goal}.`, // canonical
      (x) => `${x.name} pursued "${x.goal}" from the position of ${x.role}.`,
      (x) => `The ${x.role} path gave ${x.name} the means to pursue "${x.goal}".`,
      (x) => `For ${x.name}, "${x.goal}" had become the defining aim of the ${x.role} role.`,
    ],
    conditionDescription: [
      (x) => `${x.name} has consolidated power, shifting the local balance.`, // canonical
      (x) => `${x.name}'s success has rearranged the local balance of power.`,
      (x) => `${x.name} now commands greater standing, and the local balance has shifted around that fact.`,
      (x) => `The old balance no longer holds after ${x.name}'s ascent.`,
    ],
    causeReason: [
      'A long ambition reached fruition.', // canonical
      'Years of effort brought a long design to its end.',
      'A sustained ambition finally became fact.',
      'The balance shifted when patient work paid off.',
    ],
  },
  rebranch: {
    headline: [
      (x) => `${x.name} changes ambitions`, // canonical
      (x) => `${x.name} takes up a new ambition`,
      (x) => `${x.name} redirects a long design`,
      (x) => `${x.name}'s aims turn with the times`,
    ],
    summary: [
      (x) => `${x.name}'s goals shift because the settlement context changed.`, // canonical
      (x) => `A changed settlement has forced ${x.name} to reconsider what comes next.`,
      (x) => `${x.name} keeps the same character, but new circumstances now demand different aims.`,
      (x) => `New conditions in the settlement have turned ${x.name}'s effort toward another end.`,
    ],
    contextReason: [
      (x) => `Context changed from ${humanizeContextSignature(x.previous)} to ${humanizeContextSignature(x.next)}.`, // canonical
      (x) => `The settlement context moved from ${humanizeContextSignature(x.previous)} to ${humanizeContextSignature(x.next)}.`,
      (x) => `${x.name}'s recorded circumstances changed from ${humanizeContextSignature(x.previous)} to ${humanizeContextSignature(x.next)}.`,
      (x) => `A new context, ${humanizeContextSignature(x.next)}, displaced the old footing, ${humanizeContextSignature(x.previous)}.`,
    ],
    personalityReason: [
      (x) => `Personality remains anchored by ideal ${x.ideal} and flaw ${x.flaw}.`, // canonical
      (x) => `${x.name}'s ${x.ideal} ideal and ${x.flaw} flaw remain unchanged beneath the new aims.`,
      (x) => `The ambitions turn, but ${x.ideal} and ${x.flaw} still anchor ${x.name}.`,
      (x) => `New goals do not rewrite ${x.name}: the ${x.ideal} ideal and ${x.flaw} flaw still hold.`,
    ],
  },
});

// ════════════════════════════════════════════════════════════════════════════════════
// CALAMITY (CRITICAL — bucket-neutral by constitution). Title keeps "Great Calamity"
// + name + year; summary/reasons never assert a kind and speak the bucket.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {readonly ProseVariant[]} title — every variant keeps "Great Calamity" + name + year. */
export const CALAMITY_TITLES = Object.freeze([
  (x) => `The Great Calamity of ${x.name}, year ${x.year}`,          // canonical (== stampTitle)
  (x) => `The Great Calamity that befell ${x.name}, year ${x.year}`,
  (x) => `${x.name}'s Great Calamity, year ${x.year}`,
  (x) => `Year ${x.year}: the Great Calamity of ${x.name}`,
  (x) => `The Great Calamity of ${x.name} in the year ${x.year}`,
]);

/** @type {readonly ProseVariant[]} strike summary — interp {name, ruin, deaths}; contains "calamity". */
export const CALAMITY_SUMMARIES = Object.freeze([
  (x) => `A calamity has struck ${x.name}: ${x.ruin}, about ${x.deaths} dead, and many more take to the roads.`, // canonical
  (x) => `Calamity has come to ${x.name}: ${x.ruin}, near ${x.deaths} dead, and the survivors scatter to the roads.`,
  (x) => `A great calamity has fallen on ${x.name}. The toll is ${x.ruin}, some ${x.deaths} dead, and many take flight along the roads.`,
  (x) => `${x.name} lies broken by calamity: ${x.ruin}, about ${x.deaths} dead, and the roads fill with those who remain.`,
  (x) => `Calamity has undone ${x.name}: ${x.ruin}, roughly ${x.deaths} dead, and the living take what they can to the roads.`,
]);

/** @type {readonly ProseVariant[]} strike reason — bucket-neutral, geography-of-exposure. */
export const CALAMITY_REASONS = Object.freeze([
  'The calamity struck where the land lies most exposed. Geography exacted the reckoning.', // canonical
  'It fell hardest where the land lies most exposed. Geography kept no favourites.',
  'The most exposed ground bore the worst of it. The reckoning was written by the terrain.',
  'Where the land lies open and unsheltered, the ruin ran deepest. Geography decided the toll.',
  'The exposed ground took the heaviest blow because the land offers no shelter there.',
]);

// ════════════════════════════════════════════════════════════════════════════════════
// WAR / PEACE REASON RECEIPTS. One fixed sentence per type persisted per directed pair —
// the same casus read identically on every pair. Per-type pools, seeded on the DIRECTED
// pair key (stable across ticks ⇒ no per-tick churn; different pairs differ). The
// receipt's semantic content stays honest (same reason, varied phrasing); interpolated
// numbers/names are threaded through unchanged.
// ════════════════════════════════════════════════════════════════════════════════════
// THE CORPORA THEMSELVES live in a pure data leaf of this family (ruling R-BLD-4):
// warReceiptPools.js holds WAR_RECEIPTS / PEACE_RECEIPTS / HEGEMONY_RECEIPTS /
// DECREE_DEFAULT_RECEIPTS, which grow with every content batch, while this file keeps the
// stable picking mechanism and the kind registries. All four are RE-EXPORTED below, so
// every consumer and every kind-pool walker imports them from here exactly as before.

/** Resolve a possibly-dotted pool key ("economic_strangulation.blockade") to its array.
 *  @param {Record<string, unknown>} root @param {string} typeKey @returns {readonly ProseVariant[]} */
function resolvePool(root, typeKey) {
  let p = /** @type {unknown} */ (root);
  for (const k of String(typeKey).split('.')) {
    p = p && typeof p === 'object' ? /** @type {Record<string, unknown>} */ (p)[k] : undefined;
  }
  return Array.isArray(p) ? /** @type {ProseVariant[]} */ (p) : [];
}

/**
 * A war-reason receipt phrasing. `typeKey` may be dotted for branch pools. The pair seed
 * is namespaced by type so each reason on a pair picks independently. Seedless ⇒ canonical.
 * @param {string} typeKey @param {string|null|undefined} seed @param {Record<string, unknown>} [interp]
 */
export function warReceipt(typeKey, seed, interp = {}) {
  return pickLine(resolvePool(WAR_RECEIPTS, typeKey), seed ? `${seed}#${typeKey}` : null, interp);
}

/**
 * The WR-2 governed phrased-kind registry. This is deliberately narrower than the
 * legacy pool registry below: every row is a MINTED Wizard News kind and therefore
 * owes all four joins (pool floor, significance, audience, Herald section). Keeping
 * the metadata beside the pool makes omission mechanically visible to the walker.
 */
/** @typedef {'disposition_martial_crossed'|'disposition_mercantile_crossed'|
 * 'disposition_diplomatic_crossed'|'disposition_insular_crossed'|'disposition_reversal'|
 * 'deity_war_pressure'|'deity_peace_pressure'|'war_culture_suppressed'} DispositionReceiptKind */
/** @typedef {'notable'|'routine'} DispositionReceiptSignificance */
/** @typedef {'public'|'dm-only'} DispositionReceiptAudience */
/** @typedef {'war'|'trade'|'events'|'faith'} DispositionReceiptSection */
/** @typedef {{kind:DispositionReceiptKind,significance:DispositionReceiptSignificance,
 * audience:DispositionReceiptAudience,section:DispositionReceiptSection,
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} DispositionReceiptRegistryEntry */

/**
 * @param {DispositionReceiptKind} kind
 * @param {DispositionReceiptSignificance} significance
 * @param {DispositionReceiptAudience} audience
 * @param {DispositionReceiptSection} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<DispositionReceiptRegistryEntry>}
 */
function dispositionKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<DispositionReceiptRegistryEntry>>} */
export const WAR_DISPOSITION_KIND_REGISTRY = Object.freeze([
  dispositionKindRow('disposition_martial_crossed', 'notable', 'public', 'war',
    [['settlement', 'lean'], ['weight'], ['settlement', 'answer'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_mercantile_crossed', 'notable', 'public', 'trade',
    [['settlement', 'lean'], ['weight'], ['answer'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_diplomatic_crossed', 'notable', 'public', 'events',
    [['settlement', 'lean'], ['weight'], ['answer'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_insular_crossed', 'notable', 'public', 'events',
    [['settlement', 'lean'], ['house', 'welcome'], ['weight'], ['answer'], ['settlement', 'lean']]),
  dispositionKindRow('disposition_reversal', 'notable', 'public', 'events',
    [['settlement', 'aspect', 'lean'], ['practice'], ['settlement', 'lean', 'practice'], ['practice'], ['practice', 'answer']]),
  dispositionKindRow('deity_war_pressure', 'notable', 'public', 'faith',
    [['settlement', 'domain'], [], [], [], []]),
  dispositionKindRow('deity_peace_pressure', 'notable', 'public', 'faith',
    [['settlement', 'band'], [], ['good'], [], []]),
  dispositionKindRow('war_culture_suppressed', 'routine', 'dm-only', 'war',
    [['settlement'], ['settlement'], [], [], []]),
]);

/** The exact WR-2 kind set, shared by emitters and structural walkers. */
export const WAR_DISPOSITION_KINDS = Object.freeze(
  WAR_DISPOSITION_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<DispositionReceiptRegistryEntry>>} */
const WAR_DISPOSITION_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<DispositionReceiptRegistryEntry>]>} */ (
    WAR_DISPOSITION_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-2 receipt plus its persistent structural family and governed
 * metadata. Unknown kinds return null rather than borrowing generic prose.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function dispositionReceipt(kind, seed, interp = {}) {
  const row = WAR_DISPOSITION_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  // NO-FABRICATION RESOLUTION. A template that asks for a house, good, temple,
  // settlement, or band is eligible only when the caller holds that exact truth.
  // The fallback remains inside the same authored pool; we never substitute a
  // generic invented entity. Family ids retain the ORIGINAL pool index so a slot-
  // constrained draw cannot masquerade as a new structural family.
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * The WR-3 governed phrased-kind registry. These are reader receipts rather
 * than behavioral candidate types: the registry pays SP-6's pool,
 * significance, audience, and Herald-desk joins without claiming that any of
 * them is an aliveness channel for the still-dark lineage scorer.
 */
/** @typedef {'lineage_edge_recorded'|'casus_lineage_claim_parent'|
 * 'casus_lineage_claim_child'|'mirror_kinship_bond'|'lineage_claim_suppressed'} LineageReceiptKind */
/** @typedef {{kind:LineageReceiptKind,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'war'|'events',pool:readonly ProseVariant[],
 * requiredSlots:ReadonlyArray<readonly string[]>}} LineageReceiptRegistryEntry */

/**
 * @param {LineageReceiptKind} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'war'|'events'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<LineageReceiptRegistryEntry>}
 */
function lineageKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<LineageReceiptRegistryEntry>>} */
export const WAR_LINEAGE_KIND_REGISTRY = Object.freeze([
  lineageKindRow('lineage_edge_recorded', 'notable', 'public', 'events',
    [['settlement'], ['counterpart'], [], [], []]),
  lineageKindRow('casus_lineage_claim_parent', 'major', 'public', 'war',
    [['settlement', 'counterpart', 'band'], [], ['settlement', 'counterpart'], [], []]),
  lineageKindRow('casus_lineage_claim_child', 'major', 'public', 'war',
    [['settlement', 'counterpart'], [], ['house'], [], []]),
  lineageKindRow('mirror_kinship_bond', 'notable', 'public', 'events',
    [['settlement', 'counterpart'], [], [], [], ['settlement']]),
  lineageKindRow('lineage_claim_suppressed', 'routine', 'dm-only', 'war',
    [[], [], [], [], []]),
]);

/** The exact WR-3 reader-kind set, shared by future emitters and walkers. */
export const WAR_LINEAGE_KINDS = Object.freeze(
  WAR_LINEAGE_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<LineageReceiptRegistryEntry>>} */
const WAR_LINEAGE_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<LineageReceiptRegistryEntry>]>} */ (
    WAR_LINEAGE_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-3 lineage receipt plus its stable structural family and
 * governed presentation metadata. A template is eligible only when every
 * truth slot it names is present; an unavailable house, settlement,
 * counterpart, or inversion band is never fabricated. Pure and deterministic.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function lineageReceipt(kind, seed, interp = {}) {
  const row = WAR_LINEAGE_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * The WR-4 governed phrased-kind registry. Comparative-cost and home-front
 * receipts are presentation evidence for the pure evaluator; registering their
 * authored families and proving behavioral reachability remain separate duties.
 */
/** @typedef {'war_trajectory_winning'|'war_trajectory_losing'|'home_front_roads'|
 * 'home_front_stores'|'home_front_hands'|'home_front_institutions'|
 * 'home_front_markets'|'winning_abroad_losing_at_home'|'trajectory_misread'} WarCostReceiptKind */
/** @typedef {{kind:WarCostReceiptKind,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'war'|'trade'|'events',pool:readonly ProseVariant[],
 * requiredSlots:ReadonlyArray<readonly string[]>}} WarCostReceiptRegistryEntry */

/**
 * @param {WarCostReceiptKind} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'war'|'trade'|'events'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<WarCostReceiptRegistryEntry>}
 */
function warCostKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<WarCostReceiptRegistryEntry>>} */
export const WAR_COST_KIND_REGISTRY = Object.freeze([
  warCostKindRow('war_trajectory_winning', 'notable', 'public', 'war',
    [['settlement'], ['fieldReport'], ['offerHistory'], [], ['fieldReport', 'band', 'courierDelay']]),
  warCostKindRow('war_trajectory_losing', 'notable', 'public', 'war',
    [['settlement', 'newsLag'], [], ['fieldReport'], ['term'], []]),
  warCostKindRow('home_front_roads', 'notable', 'public', 'trade',
    [['route', 'tollLoss'], ['causewayNeglect'], [], ['bridgeDamage'], ['settlement', 'band']]),
  warCostKindRow('home_front_stores', 'notable', 'public', 'events',
    [['settlement', 'band', 'granary'], ['seedGood'], [], [], ['breadSupply']]),
  warCostKindRow('home_front_hands', 'notable', 'public', 'events',
    [['settlement', 'band'], ['harvestLabor'], ['smithMuster'], ['npc'], []]),
  // WR-4 routing correction: institution degradation is structural news on
  // the events desk, not a judicial act on the adjudication desk.
  warCostKindRow('home_front_institutions', 'notable', 'public', 'events',
    [['settlement', 'courtOffice'], ['temple', 'school'], [], ['courtOffice'], []]),
  warCostKindRow('home_front_markets', 'notable', 'public', 'trade',
    [['house', 'settlement'], ['wharfLabor'], ['good'], [], ['tollLoss']]),
  warCostKindRow('winning_abroad_losing_at_home', 'major', 'public', 'war',
    [['settlement', 'counterpart', 'band', 'storesEvidence', 'occupation'], ['marketAccount'], ['breadPrice'], ['compoundLoss'], []]),
  warCostKindRow('trajectory_misread', 'routine', 'dm-only', 'war',
    [['fieldReport'], ['settlement'], [], ['draftedTerms'], ['intentEvidence']]),
]);

/** The exact WR-4 reader-kind set, shared by future emitters and walkers. */
export const WAR_COST_KINDS = Object.freeze(
  WAR_COST_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<WarCostReceiptRegistryEntry>>} */
const WAR_COST_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<WarCostReceiptRegistryEntry>]>} */ (
    WAR_COST_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-4 receipt plus its stable family and governed presentation
 * metadata. Missing truths remove only the families that name them; a receipt
 * never fabricates a route, good, house, NPC, temple, settlement, counterpart,
 * term, or world-word band. Pure and deterministic.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function warCostReceipt(kind, seed, interp = {}) {
  const row = WAR_COST_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * WR-5's governed reader kinds. Adjudication is a RECORD desk rather than a
 * token-map output: the projector persists the row's explicit `section`, and
 * heraldSectionOfRecord honours that governed section after its structural
 * pending/resolution/forecast precedence.
 */
/** @typedef {'sued_for_peace_seat'|'sued_for_peace_realm'|
 * 'war_continued_for_the_seat'|'war_ended_against_rival_triumph'|'peace_refused'|
 * 'refusal_cost_legitimacy'|'refusal_cost_ally_patience'|'ruler_books_compromised'|
 * 'war_party_overturns_peacemaker'|'peace_party_overturns_warmonger'|
 * 'succession_demand_inherited'|'successor_repudiates_war'|
 * 'successor_escalates_war'|'war_dissolved_by_verdict'} WarRulingReceiptKind */
/** @typedef {{kind:WarRulingReceiptKind,significance:'major'|'notable',
 * audience:'public'|'dm-only',section:'war'|'adjudication',pool:readonly ProseVariant[],
 * requiredSlots:ReadonlyArray<readonly string[]>}} WarRulingReceiptRegistryEntry */

/**
 * @param {WarRulingReceiptKind} kind
 * @param {'major'|'notable'} significance
 * @param {'public'|'dm-only'} audience
 * @param {'war'|'adjudication'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<WarRulingReceiptRegistryEntry>}
 */
function warRulingKindRow(kind, significance, audience, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<WarRulingReceiptRegistryEntry>>} */
export const WAR_RULING_KIND_REGISTRY = Object.freeze([
  warRulingKindRow('sued_for_peace_seat', 'major', 'public', 'adjudication',
    [['npc'], [], [], ['npc'], []]),
  warRulingKindRow('sued_for_peace_realm', 'major', 'public', 'adjudication',
    [[], ['settlement', 'npc'], [], [], []]),
  warRulingKindRow('war_continued_for_the_seat', 'major', 'public', 'war',
    [['settlement', 'npc'], [], [], ['faction'], []]),
  warRulingKindRow('war_ended_against_rival_triumph', 'major', 'public', 'war',
    [['settlement', 'npc'], [], [], [], []]),
  warRulingKindRow('peace_refused', 'major', 'public', 'adjudication',
    [['counterpart', 'settlement', 'reason'], ['route'], [], [], ['npc']]),
  warRulingKindRow('refusal_cost_legitimacy', 'notable', 'public', 'adjudication',
    [['settlement'], [], [], ['npc', 'band'], []]),
  warRulingKindRow('refusal_cost_ally_patience', 'notable', 'public', 'war',
    [['counterpart', 'third_party'], [], ['band'], [], []]),
  warRulingKindRow('ruler_books_compromised', 'major', 'dm-only', 'adjudication',
    [['npc', 'faction', 'settlement'], [], [], [], []]),
  warRulingKindRow('war_party_overturns_peacemaker', 'major', 'public', 'adjudication',
    [['npc'], ['faction'], [], [], []]),
  warRulingKindRow('peace_party_overturns_warmonger', 'major', 'public', 'adjudication',
    [['settlement'], ['faction'], [], [], []]),
  warRulingKindRow('succession_demand_inherited', 'notable', 'public', 'adjudication',
    [['faction', 'npc'], [], [], [], []]),
  warRulingKindRow('successor_repudiates_war', 'major', 'public', 'war',
    [['npc'], [], [], [], []]),
  warRulingKindRow('successor_escalates_war', 'major', 'public', 'war',
    [['npc'], [], [], [], []]),
  warRulingKindRow('war_dissolved_by_verdict', 'major', 'public', 'adjudication',
    [['npc', 'counterpart'], [], [], [], []]),
]);

/** The exact WR-5 governed reader-kind set. */
export const WAR_RULING_KINDS = Object.freeze(
  WAR_RULING_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<WarRulingReceiptRegistryEntry>>} */
const WAR_RULING_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<WarRulingReceiptRegistryEntry>]>} */ (
    WAR_RULING_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-5 sentence without inventing a ruler, faction, ally, route,
 * reason, or qualitative band. Families whose named source facts are absent are
 * ineligible; their slotless siblings remain honest authored fallbacks.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function warRulingReceipt(kind, seed, interp = {}) {
  const row = WAR_RULING_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * WR-6's governed coalition-reader kinds. Coalition structure remains a graph
 * of bilateral facts; this registry governs only how an already-earned fact is
 * spoken, including the two adjudication records whose desk cannot be inferred
 * from their token alone.
 */
/** @typedef {'coalition_entry_priced'|'coalition_joined'|'coalition_refused'|
 * 'casus_alliance_obligation'|'mirror_obligation_discharged'|
 * 'coalition_expenditure_read'|'coalition_stayed'|'coalition_separate_peace'|
 * 'coalition_apportionment'|'coalition_spoils_divided'|'coalition_debt_paid'|
 * 'coalition_debt_unpaid'} WarCoalitionReceiptKind */
/** @typedef {{kind:WarCoalitionReceiptKind,significance:'major'|'notable',
 * audience:'public',section:'war'|'trade'|'events'|'adjudication',
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} WarCoalitionReceiptRegistryEntry */

/**
 * @param {WarCoalitionReceiptKind} kind
 * @param {'major'|'notable'} significance
 * @param {'war'|'trade'|'events'|'adjudication'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<WarCoalitionReceiptRegistryEntry>}
 */
function warCoalitionKindRow(kind, significance, section, requiredSlots) {
  return Object.freeze({
    kind,
    significance,
    audience: 'public',
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<WarCoalitionReceiptRegistryEntry>>} */
export const WAR_COALITION_KIND_REGISTRY = Object.freeze([
  warCoalitionKindRow('coalition_entry_priced', 'notable', 'war',
    [['settlement', 'counterpart'], [], [], ['band'], []]),
  warCoalitionKindRow('coalition_joined', 'major', 'war',
    [['settlement', 'third_party'], ['route'], [], [], ['settlement']]),
  warCoalitionKindRow('coalition_refused', 'major', 'war',
    [[], ['settlement', 'route'], ['settlement', 'counterpart'], [], []]),
  warCoalitionKindRow('casus_alliance_obligation', 'notable', 'war',
    [['settlement', 'counterpart'], [], [], [], ['third_party']]),
  warCoalitionKindRow('mirror_obligation_discharged', 'notable', 'events',
    [['settlement'], [], [], [], []]),
  warCoalitionKindRow('coalition_expenditure_read', 'notable', 'trade',
    // Every family is confined to the evidence-bounded current-episode read;
    // no historic stores, named losses, healed damage, or lifetime total is
    // inferred from an absent ledger.
    [['settlement', 'band'], [], [], [], []]),
  warCoalitionKindRow('coalition_stayed', 'notable', 'war',
    // Staying does not imply that the borrowed cause ended.
    [[], ['settlement', 'third_party'], [], [], []]),
  warCoalitionKindRow('coalition_separate_peace', 'major', 'adjudication',
    [[], ['settlement', 'third_party'], [], [], []]),
  warCoalitionKindRow('coalition_apportionment', 'major', 'adjudication',
    [['settlement', 'band', 'good'], [], [], [], []]),
  warCoalitionKindRow('coalition_spoils_divided', 'major', 'trade',
    [[], ['settlement', 'band', 'good'], [], [], []]),
  warCoalitionKindRow('coalition_debt_paid', 'notable', 'trade',
    [[], ['counterpart', 'settlement'], [], ['route'], []]),
  warCoalitionKindRow('coalition_debt_unpaid', 'major', 'trade',
    [[], ['settlement', 'counterpart', 'route'], ['good'], [], []]),
]);

/** The exact WR-6 governed reader-kind set. */
export const WAR_COALITION_KINDS = Object.freeze(
  WAR_COALITION_KIND_REGISTRY.map((row) => row.kind),
);

/** @type {ReadonlyMap<string, Readonly<WarCoalitionReceiptRegistryEntry>>} */
const WAR_COALITION_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<WarCoalitionReceiptRegistryEntry>]>} */ (
    WAR_COALITION_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-6 sentence from exact supplied truths. Missing slots remove
 * only the families that name them; unknown kinds stay closed, and a slotless
 * authored sibling is always preferred to fabricated identity or scalar prose.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function warCoalitionReceipt(kind, seed, interp = {}) {
  const row = WAR_COALITION_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * WR-7a's governed errand-reader kinds. Adjudication is authorized by the
 * governed record; the moving-person beat files under events and the false-read
 * beat is explicitly divination.
 */
/** @typedef {'envoy_departed'|'envoy_on_the_road'|'envoy_returning'|'envoy_home'|
 * 'envoy_lost'|'envoy_silence_inference'|'terms_never_reached'|
 * 'envoy_intercepted'|'envoy_parlaying'|'envoy_terms_agreed'|'envoy_held'|
 * 'terms_signed_for_a_fallen_town'|'parlay_at_an_occupied_venue'|'interceptor_dilemma'|
 * 'interceptor_parlays_own_edge'|'parlay_terms_neither_court_drafted'} EnvoyReceiptKind */
/** @typedef {{kind:EnvoyReceiptKind,significance:'major'|'notable'|'routine',
 * audience:'public'|'dm-only',section:'war'|'events'|'divination'|'adjudication',
 * pool:readonly ProseVariant[],requiredSlots:ReadonlyArray<readonly string[]>}} EnvoyReceiptRegistryEntry */

/**
 * @param {EnvoyReceiptKind} kind
 * @param {'major'|'notable'|'routine'} significance
 * @param {'war'|'events'|'divination'|'adjudication'} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @param {'public'|'dm-only'} [audience]
 * @returns {Readonly<EnvoyReceiptRegistryEntry>}
 */
function envoyKindRow(kind, significance, section, requiredSlots, audience = 'public') {
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool: /** @type {readonly ProseVariant[]} */ (WAR_RECEIPTS[kind]),
    requiredSlots: Object.freeze(
      requiredSlots.map((slots) => Object.freeze([...slots])),
    ),
  });
}

/** @type {ReadonlyArray<Readonly<EnvoyReceiptRegistryEntry>>} */
export const ENVOY_KIND_REGISTRY = Object.freeze([
  envoyKindRow('envoy_departed', 'notable', 'adjudication',
    [['npc', 'settlement', 'counterpart', 'route'], [], [], [], [], []]),
  envoyKindRow('envoy_on_the_road', 'routine', 'events',
    [['npc', 'route'], [], [], [], [], [], [], [], [], [], [], []]),
  envoyKindRow('envoy_returning', 'notable', 'adjudication',
    [['npc', 'settlement'], [], [], [], [], []]),
  envoyKindRow('envoy_home', 'major', 'adjudication',
    [['npc', 'settlement'], [], [], [], []]),
  envoyKindRow('envoy_lost', 'major', 'adjudication',
    [['npc', 'counterpart'], [], ['route'], [], []], 'dm-only'),
  envoyKindRow('envoy_silence_inference', 'major', 'divination',
    [['route'], ['npc'], [], ['settlement', 'counterpart'], []]),
  envoyKindRow('terms_never_reached', 'major', 'adjudication',
    [[], ['route'], [], [], []], 'dm-only'),
  envoyKindRow('envoy_intercepted', 'major', 'war',
    [['npc', 'route', 'third_party'], [], [], [], []], 'dm-only'),
  envoyKindRow('envoy_parlaying', 'notable', 'adjudication',
    [['npc', 'counterpart'], [], [], [], [], []], 'dm-only'),
  envoyKindRow('envoy_terms_agreed', 'major', 'adjudication',
    [['term', 'counterpart'], ['npc'], [], [], []], 'dm-only'),
  envoyKindRow('envoy_held', 'major', 'adjudication',
    [['npc', 'counterpart', 'reason'], [], [], [], []], 'dm-only'),
  envoyKindRow('terms_signed_for_a_fallen_town', 'major', 'adjudication',
    [[], ['settlement', 'route'], [], [], []], 'dm-only'),
  envoyKindRow('parlay_at_an_occupied_venue', 'notable', 'adjudication',
    [['settlement', 'counterpart'], [], [], [], [], []], 'dm-only'),
  envoyKindRow('interceptor_dilemma', 'notable', 'war',
    [['third_party'], [], [], [], ['route'], []], 'dm-only'),
  envoyKindRow('interceptor_parlays_own_edge', 'major', 'adjudication',
    [['settlement', 'counterpart'], [], [], [], []], 'dm-only'),
  envoyKindRow('parlay_terms_neither_court_drafted', 'major', 'adjudication',
    [['term'], [], [], [], []], 'dm-only'),
]);

/** The exact WR-7a plus WR-7b reader-kind set. */
export const ENVOY_KINDS = Object.freeze(ENVOY_KIND_REGISTRY.map((row) => row.kind));

/** @type {ReadonlyMap<string, Readonly<EnvoyReceiptRegistryEntry>>} */
const ENVOY_KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<EnvoyReceiptRegistryEntry>]>} */ (
    ENVOY_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/**
 * Resolve one WR-7 sentence from exact supplied truths. Missing names remove
 * only the families that use them; unknown kinds stay closed.
 *
 * @param {string} kind
 * @param {string|null|undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string,line:string,familyId:string,templateIndex:number,
 *   significance:string,audience:string,section:string} | null}
 */
export function envoyReceipt(kind, seed, interp = {}) {
  const row = ENVOY_KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  const namespacedSeed = seed ? `${seed}#${row.kind}` : '';
  const templateIndex = namespacedSeed ? eligible[fnv1a32(namespacedSeed) % eligible.length] : eligible[0];
  const variant = row.pool[templateIndex];
  const line = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    line,
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * A peace-reason receipt phrasing (see warReceipt). @param {string} typeKey
 * @param {string|null|undefined} seed @param {Record<string, unknown>} [interp]
 */
export function peaceReceipt(typeKey, seed, interp = {}) {
  return pickLine(resolvePool(PEACE_RECEIPTS, typeKey), seed ? `${seed}#${typeKey}` : null, interp);
}

/**
 * A hegemony-sphere receipt phrasing (fear_of_dominance | balance_restored).
 * @param {string} typeKey @param {string|null|undefined} seed @param {Record<string, unknown>} [interp]
 */
export function hegemonyReceipt(typeKey, seed, interp = {}) {
  return pickLine(resolvePool(HEGEMONY_RECEIPTS, typeKey), seed ? `${seed}#${typeKey}` : null, interp);
}

// ════════════════════════════════════════════════════════════════════════════════════
// KERNEL NEWS BEATS (upswing / resource / lifecycle). 1 headline+summary+reason per event
// kind, persisted into wizardNews + the pulseHistory impactDigest. Variety is FRAMING ONLY:
// every interpolated semantic token (counts, cause, provenance, artery, names) is threaded
// through unchanged, so keyword/structural pins hold; only the surrounding prose rotates.
// ════════════════════════════════════════════════════════════════════════════════════

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const UPSWING_NEWS = Object.freeze({
  reconstruction: {
    headline: [
      (x) => `${x.name} is rebuilt`, // canonical
      (x) => `${x.name} rises from its ruin`,
      (x) => `${x.name} has repaired its wounds`,
      (x) => `${x.name} stands whole again`,
    ],
    summary: [
      (x) => `${x.name} has finished rebuilding in the year ${x.year}, its wounds closed by its own hands and its allies'.${x.built}${x.graft}`, // canonical
      (x) => `By the year ${x.year} ${x.name} has finished its rebuilding, the damage mended by its own labour and its allies' aid.${x.built}${x.graft}`,
      (x) => `${x.name} has closed its wounds at last, the rebuilding done in the year ${x.year} by its own hands and its allies'.${x.built}${x.graft}`,
      (x) => `The rebuilding of ${x.name} is complete in the year ${x.year}. Its own people and its allies together have made it whole.${x.built}${x.graft}`,
    ],
    reasons: [
      "A conserved rebuild: its own prosperity, builders, peace, and its allies' investment repaid.", // canonical
      "A rebuild paid for in kind: its own prosperity, its builders, a lasting peace, and its allies' returned investment.",
      "The recovery drew on what it had: its prosperity, its masons, the peace, and the aid its allies repaid.",
      "Nothing conjured: the rebuild ran on its own wealth, its builders, the peace it kept, and its allies' repaid stake.",
    ],
  },
  boom: {
    headline: [
      (x) => `${x.name} is booming`, // canonical
      (x) => `${x.name} strikes it rich`,
      (x) => `Coin floods into ${x.name}`,
      (x) => `${x.name} rides a boom`,
    ],
    summary: [
      (x) => `Brisk and sustained trade has tipped ${x.name} into a boom. Markets swell and coin flows.${x.dep}`, // canonical
      (x) => `A steady run of brisk trade has tipped ${x.name} into a boom. The markets swell and the coin runs freely.${x.dep}`,
      (x) => `Trade has come thick and lasting to ${x.name}, and it has tipped into a boom. Its markets swell and coin flows.${x.dep}`,
      (x) => `Sustained, vigorous trade has carried ${x.name} into a boom. Its markets swell and coin moves fast.${x.dep}`,
    ],
    reasons: [
      (x) => `The boom is fed by ${x.arteries} trade artery${x.arteryS}: a composition the trade movers already built.`, // canonical
      (x) => `The boom rides on ${x.arteries} trade artery${x.arteryS}: a mix the trade movers had already laid.`,
      (x) => `${x.arteries} trade artery${x.arteryS} feed the boom: the composition the trade movers built beforehand.`,
      (x) => `Behind the boom stand ${x.arteries} trade artery${x.arteryS}: a structure the trade movers already assembled.`,
    ],
  },
  bust: {
    headline: [
      (x) => `${x.name}'s boom has busted`, // canonical
      (x) => `${x.name}'s boom collapses`,
      (x) => `The boom breaks in ${x.name}`,
      (x) => `${x.name}'s fortune turns`,
    ],
    summary: [
      (x) => `The trade that made ${x.name} rich has collapsed because ${x.cause}. The boom curdles into flight and empty stalls.`, // canonical
      (x) => `The commerce that made ${x.name} rich has fallen apart because ${x.cause}. The boom sours into flight and shuttered stalls.`,
      (x) => `What made ${x.name} rich has come undone because ${x.cause}. The boom curdles into departures and empty market rows.`,
      (x) => `The trade that lifted ${x.name} has broken because ${x.cause}. The boom turns to flight and abandoned stalls.`,
    ],
    reasons: [
      (x) => `The boom's own dependency concentration was its undoing${x.arteryClause}.`, // canonical
      (x) => `Its boom leaned on too narrow a base, and that concentration undid it${x.arteryClause}.`,
      (x) => `The boom had staked itself on too few threads. The concentration was its ruin${x.arteryClause}.`,
      (x) => `Over-reliance on a narrow trade was the boom's undoing${x.arteryClause}.`,
    ],
  },
  flourishing: {
    headline: [
      (x) => `${x.name} enters a golden age`, // canonical
      (x) => `A golden age dawns in ${x.name}`,
      (x) => `${x.name} comes into flower`,
      (x) => `${x.name} enjoys a golden age`,
    ],
    summary: [
      (x) => `A long peace and steady rule have made ${x.name} culturally fertile. Tolerance broadens and the temples keep warm.${x.built}`, // canonical
      (x) => `Under a long peace and a steady hand, ${x.name} has grown culturally fertile. Tolerance widens and the temples stay warm.${x.built}`,
      (x) => `Years of peace and steady rule have left ${x.name} culturally fertile. Its tolerance broadens and its temples keep warm.${x.built}`,
      (x) => `A lasting peace and settled rule have made ${x.name} fertile in its culture. Tolerance broadens, and the temples keep warm.${x.built}`,
    ],
    reasons: [
      'A bounded cultural attractor. No army, no treasury swell, only the fertility of a long peace.', // canonical
      'A cultural high, and a bounded one. No army, no swelling treasury, only what a long peace makes fertile.',
      'A contained cultural flowering. Not arms, not coin, only the fertility a long peace brings.',
      'A modest, bounded flourishing. No host and no full treasury, just the fruit of a lasting peace.',
    ],
  },
});

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const RESOURCE_NEWS = Object.freeze({
  discovery: {
    headline: [
      (x) => `${x.label} discovered near ${x.name}`, // canonical
      (x) => `New ${x.labelLower} found near ${x.name}`,
      (x) => `Prospectors strike ${x.labelLower} near ${x.name}`,
      (x) => `${x.label} comes to light near ${x.name}`,
    ],
    summary: [
      (x) => `Prospecting near ${x.name} has struck ${x.labelLower}: a new resource for the local economy.`, // canonical
      (x) => `Prospecting around ${x.name} has turned up ${x.labelLower}: a fresh resource for the local economy.`,
      (x) => `Diggers working near ${x.name} have hit ${x.labelLower}: a new resource for the local economy.`,
      (x) => `A prospecting effort near ${x.name} has found ${x.labelLower}: new wealth for the local economy.`,
    ],
  },
  removal: {
    headline: [
      (x) => `${x.label}'s workings near ${x.name} have given out`, // canonical
      (x) => `The ${x.labelLower} near ${x.name} runs dry`,
      (x) => `${x.label} near ${x.name} is worked out`,
      (x) => `${x.label}'s vein near ${x.name} fails`,
    ],
    summary: [
      (x) => `The ${x.labelLower} near ${x.name} has been worked out. After long depletion, the vein is done.`, // canonical
      (x) => `The ${x.labelLower} near ${x.name} is exhausted. After a long depletion, the vein is finished.`,
      (x) => `After a long decline the ${x.labelLower} near ${x.name} has given out. The vein is done.`,
      (x) => `The ${x.labelLower} workings near ${x.name} have run out. Long depleted, the vein is now done.`,
    ],
  },
});

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const LIFECYCLE_NEWS = Object.freeze({
  orbit_dispersed: {
    headline: [
      (x) => `The steadings around ${x.parent} empty out`, // canonical
      (x) => `The steadings around ${x.parent} scatter`,
      (x) => `${x.parent}'s steadings are left empty`,
      (x) => `The orbit of ${x.parent} disperses`,
    ],
    summary: [
      (x) => `With ${x.parent} dead, its ${x.count} outlying steading${x.countS} emptied. ${x.dispersed} folk scattered to the wider world with the town's own.`, // canonical
      (x) => `${x.parent} being dead, its ${x.count} outlying steading${x.countS} emptied. ${x.dispersed} folk scattered into the wider world alongside the town's own.`,
      (x) => `With ${x.parent} gone, its ${x.count} outlying steading${x.countS} fell empty. ${x.dispersed} folk drifted out to the wider world with the town's own.`,
      (x) => `The death of ${x.parent} emptied its ${x.count} outlying steading${x.countS}. ${x.dispersed} folk scattered into the wider world with the town's own.`,
    ],
  },
  founded: {
    headline: [
      (x) => `A new steading rises near ${x.parent}`, // canonical
      (x) => `A steading takes root near ${x.parent}`,
      (x) => `New ground is broken near ${x.parent}`,
      (x) => `A frontier steading rises near ${x.parent}`,
    ],
    // summary keeps the resource-strike / growth PROVENANCE branch; the two sub-pools below
    // are selected by the caller and vary only their framing.
    summary_strike: [
      (x) => `${x.debit} settlers have raised the steading of ${x.name} on the new ${x.resource} workings.`, // canonical
      (x) => `${x.debit} settlers have thrown up the steading of ${x.name} beside the new ${x.resource} workings.`,
      (x) => `The new ${x.resource} workings have drawn ${x.debit} settlers, who have raised the steading of ${x.name}.`,
      (x) => `${x.debit} settlers have founded the steading of ${x.name} on the fresh ${x.resource} workings.`,
    ],
    summary_growth: [
      (x) => `${x.debit} settlers have struck out from ${x.parent} to found the steading of ${x.name}.`, // canonical
      (x) => `${x.debit} settlers have left ${x.parent} to found the steading of ${x.name}.`,
      (x) => `${x.debit} settlers have gone out from ${x.parent} and founded the steading of ${x.name}.`,
      (x) => `From ${x.parent}, ${x.debit} settlers have struck out to found the steading of ${x.name}.`,
    ],
    // W-E (J-D4): the ground the settlers actually chose, named in-world. Selected
    // only when the founding SAMPLED the frozen spatial rasters (a spatial world);
    // an aspatial founding keeps summary_growth, so no existing world's prose moves.
    summary_site: [
      (x) => `${x.debit} settlers out of ${x.parent} have raised the steading of ${x.name} on ${x.place}.`, // canonical
      (x) => `${x.debit} settlers have set the steading of ${x.name} down on ${x.place}, a day out of ${x.parent}.`,
      (x) => `The steading of ${x.name} has taken root on ${x.place}, raised by ${x.debit} settlers out of ${x.parent}.`,
      (x) => `Out of ${x.parent}, ${x.debit} settlers have raised the steading of ${x.name} on ${x.place}.`,
    ],
  },
  charter_pending: {
    headline: [
      (x) => `${x.name} has outgrown its parent's shadow`, // canonical
      (x) => `${x.name} outgrows its parent`,
      (x) => `${x.name} comes of age`,
      (x) => `${x.name} steps out of its parent's shadow`,
    ],
    summary: [
      (x) => `The steading of ${x.name} has reached village scale. A charter awaits.`, // canonical
      (x) => `The steading of ${x.name} has grown to village scale. A charter is due.`,
      (x) => `Now at village scale, the steading of ${x.name} awaits a charter.`,
      (x) => `The steading of ${x.name} has come up to village scale. A charter is pending.`,
    ],
  },
  abandoned: {
    headline: [
      (x) => `The steading of ${x.name} is abandoned`, // canonical
      (x) => `The steading of ${x.name} is left empty`,
      (x) => `${x.name} is given up`,
      (x) => `The steading of ${x.name} fails`,
    ],
    summary: [
      (x) => `Without backing or newcomers, ${x.name} failed; its last folk walked back to ${x.parent}.`, // canonical
      (x) => `With no backing and no newcomers, ${x.name} gave out; its last folk went back to ${x.parent}.`,
      (x) => `Starved of backing and newcomers, ${x.name} failed, and its last folk returned to ${x.parent}.`,
      (x) => `${x.name} failed for want of backing and newcomers; its last folk walked back to ${x.parent}.`,
    ],
  },
  coalesced: {
    headline: [
      (x) => `${x.a} and ${x.b} fold into one palisade`, // canonical
      (x) => `${x.a} and ${x.b} grow into one`,
      (x) => `${x.a} and ${x.b} join under one palisade`,
      (x) => `${x.a} and ${x.b} become a single steading`,
    ],
    summary: [
      (x) => `The neighbouring steadings of ${x.a} and ${x.b} have grown together into a single hamlet of ${x.pop}.`, // canonical
      (x) => `The neighbouring steadings of ${x.a} and ${x.b} have merged into one hamlet of ${x.pop}.`,
      (x) => `${x.a} and ${x.b}, close neighbours, have grown together into a single hamlet of ${x.pop}.`,
      (x) => `The adjoining steadings of ${x.a} and ${x.b} have knit into one hamlet of ${x.pop}.`,
    ],
  },
});

// ── THE REGISTRY (the walker manifest) ──────────────────────────────────────────────
// Every pool flattened to { id, pool }, derived from the structures above so a new pool
// is auto-covered by the register / reachability guards (structural-prevention pattern).
/** @param {string} prefix @param {Record<string, unknown>} obj @param {Array<{id:string,pool:readonly ProseVariant[]}>} out */
function flattenPools(prefix, obj, out) {
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) out.push({ id: `${prefix}.${k}`, pool: /** @type {readonly ProseVariant[]} */ (v) });
    else if (v && typeof v === 'object') flattenPools(`${prefix}.${k}`, /** @type {Record<string, unknown>} */ (v), out);
  }
}

/** @type {Array<{ id: string, pool: readonly ProseVariant[] }>} */
const REGISTRY = [
  { id: 'calamity.title', pool: CALAMITY_TITLES },
  { id: 'calamity.summary', pool: CALAMITY_SUMMARIES },
  { id: 'calamity.reason', pool: CALAMITY_REASONS },
  { id: 'decree_default', pool: DECREE_DEFAULT_RECEIPTS },
];
flattenPools('npc_goal', NPC_GOAL_NEWS, REGISTRY);
flattenPools('war', WAR_RECEIPTS, REGISTRY);
flattenPools('peace', PEACE_RECEIPTS, REGISTRY);
flattenPools('hegemony', HEGEMONY_RECEIPTS, REGISTRY);
flattenPools('upswing', UPSWING_NEWS, REGISTRY);
flattenPools('resource', RESOURCE_NEWS, REGISTRY);
flattenPools('lifecycle', LIFECYCLE_NEWS, REGISTRY);
flattenPools('roads', ROADS_NEWS, REGISTRY); // THE ROADS (ENGINE LIFT #5) — the src/data leaf

/** The flat walker manifest: every prose pool, id'd. @type {ReadonlyArray<{ id: string, pool: readonly ProseVariant[] }>} */
export const EVENT_PROSE_REGISTRY = Object.freeze(REGISTRY);

/** The disaster-KIND vocabulary the calamity pools must never assert (bucket-neutrality). */
export const FORBIDDEN_CALAMITY_KINDS = Object.freeze(['flood', 'fire', 'quake', 'earthquake', 'storm']);
