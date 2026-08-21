/**
 * domain/npc/npcBank.js — THE BANK (DESIGN_NPC_LIFECYCLE §1).
 *
 * The one new substrate artifact: the bounded vocabulary for every editable NPC
 * attribute, PLUS the transition-typed goal catalog. It is the validation source
 * for every NPC op (§2), the future S4 compiler target, and the S4+ knob surface.
 *
 * ── THE UNIFICATION (§0) ─────────────────────────────────────────────────────
 * NPC editability = THE FACET LAW applied to NPCs. Every NPC attribute is a
 * bank-typed facet resolved through the ONE facet-law chokepoint
 * (spatial/cohesionWeave.facetOf — "declared over inferred", owner-ratified
 * 2026-07-14): a DECLARED facet (`npc.facets.<kind>` or a `facet:<kind>:<value>`
 * tag) wins; ABSENT declaration ⇒ the generated/inferred value. So an unedited
 * world is byte-identical (dormancy: no ops used ⇒ no declared facets ⇒ every
 * read falls through to today's inference).
 *
 * ── WHY A SHARED ZERO-IMPORT CONTRACT ──────────────────────────────────────
 * The engine's native vocabularies (ALIGNMENTS/GOALS in worldPulse/npcAgency.js;
 * the positive-trait TEMPERAMENT pool in data/npcData.js; and role archetypes)
 * are module-private or heavy. `npcFacetContract.js` owns the frozen transport
 * vocabulary and membership checks without importing npcOps, PRNG, or inference
 * machinery. This richer bank re-exports that one source and layers facet-law
 * reads, transition edges, and role compatibility over it. Parity pins still
 * assert that the shared vocabulary covers every value the engine can seed.
 *
 * ── OWNER CORRECTION (§1, binding) ──────────────────────────────────────────
 * Goal EVOLUTION already exists for engine NPCs (achieve = npcGoalCulmination
 * reset+promote; context = npcGoalRebranch/branchedGoals). The gap is added-NPC
 * CITIZENSHIP: an added/instant NPC declares (or inherits by role) a bounded goal
 * chain at creation and, being a named member of settlement.npcs, rides the SAME
 * ensureNpcStates → evaluateNpcRules machinery as a generated NPC. This catalog's
 * transition edges are the DECLARATIVE articulation of the engine's ad-hoc
 * transitions — the validation + S4 surface; it does NOT rewrite the engine.
 * Personality/alignment DRIFT stays parked (owner) — NOT built here.
 *
 * Pure, deterministic, side-effect-free.
 */

import { facetOf } from '../spatial/cohesionWeave.js';
import {
  NPC_GOAL_CATALOG,
  isBankValid,
} from './npcFacetContract.js';
export {
  NPC_ALIGNMENTS,
  NPC_FACET_KINDS,
  NPC_GOAL_CATALOG,
  NPC_GOALS,
  NPC_ROLE_ARCHETYPES,
  NPC_TEMPERAMENTS,
  bankVocabulary,
  isBankValid,
  validateNpcFacet,
} from './npcFacetContract.js';

/** The NPC fields the bank reads (only these — declared over inferred).
 * @typedef {{ personality?: Record<string, unknown>, role?: string, category?: string,
 *   goal?: Record<string, unknown>, facets?: unknown, tags?: unknown }} BankNpc */

/** The goals the base engine seeds from (worldPulse/npcAgency GOALS). Instant/added
 *  NPCs default their chain from these so their prose goal reads like a generated one.
 *  @type {readonly string[]} */
export const NPC_SEED_GOALS = Object.freeze([
  'secure_office', 'protect_followers', 'expand_influence', 'settle_rivalry',
  'restore_order', 'profit_from_change', 'control_institution',
  'win_public_legitimacy', 'bind_external_patron', 'survive_crisis',
]);

// ── §1.3 Role → seed goal chain (added NPCs inherit by role) ─────────────────
//
// The role-appropriate opening chain for an added/instant NPC, drawn from the
// engine's own role→goal mapping (branchedGoals + the archetype affinities). Each
// entry: { short, long } — both bank-bounded. Absent role ⇒ the civic default.

/** @type {Readonly<Record<string, { short: string, long: string }>>} */
export const ROLE_GOAL_CHAIN = Object.freeze({
  ruler:             { short: 'secure_office', long: 'consolidate_power' },
  heir:              { short: 'win_public_legitimacy', long: 'secure_office' },
  military:          { short: 'professionalize_guard', long: 'restore_order' },
  merchant:          { short: 'join_guild', long: 'expand_trade_house' },
  religious:         { short: 'protect_followers', long: 'win_public_legitimacy' },
  criminal:          { short: 'exploit_desperation', long: 'expand_influence' },
  arcane:            { short: 'control_institution', long: 'expand_influence' },
  civic:             { short: 'restore_order', long: 'win_public_legitimacy' },
  healer:            { short: 'protect_followers', long: 'restore_order' },
  labor_resource:    { short: 'protect_followers', long: 'survive_crisis' },
  diplomat_outsider: { short: 'bind_external_patron', long: 'secure_tribute' },
  dissident:         { short: 'organize_autonomy', long: 'break_vassalage' },
});

// ── §1.4 Compatibility rules (role×goal affinity; role×institution legality) ──

/** Institution NATURE values a role is legally seated in (facet-law
 *  institutionNature vocabulary). A role not listed for a nature is illegal there.
 *  @type {Readonly<Record<string, readonly string[]>>} */
export const ROLE_INSTITUTION_NATURE = Object.freeze({
  ruler:             ['civic'],
  heir:              ['civic'],
  military:          ['security'],
  merchant:          ['trade'],
  religious:         ['faith'],
  criminal:          ['vice', 'trade'],
  arcane:            ['learning', 'faith'],
  civic:             ['civic'],
  healer:            ['faith', 'civic'],
  labor_resource:    ['craft', 'trade'],
  diplomat_outsider: ['civic', 'trade'],
  dissident:         ['civic', 'faith', 'trade'],
});

// ── §1.5 THE FACET-LAW READ for NPCs ────────────────────────────────────────
//
/** Keyword-inference fallback for an NPC facet, reading the NPC's own native fields
 *  (the "absent declaration ⇒ generated/inferred value" arm). Pure, total.
 *  @param {BankNpc} npc @param {string} facetKind @returns {string|null} */
function inferNpcFacet(npc, facetKind) {
  if (!npc || typeof npc !== 'object') return null;
  switch (facetKind) {
    case 'temperament': {
      const t = npc.personality?.dominant;
      return typeof t === 'string' && t !== '' ? t : null;
    }
    case 'role': {
      const r = npc.role || npc.category;
      return typeof r === 'string' && r !== '' ? r : null;
    }
    case 'goal': {
      const g = npc.goal?.short;
      return typeof g === 'string' && g !== '' ? g : null;
    }
    case 'alignment':
      // No native SimNpc alignment field — the seeded npcState.alignment governs
      // the sim; a declared facet is the only per-NPC alignment override.
      return null;
    default:
      return null;
  }
}

/**
 * Resolve an NPC's bank facet through THE FACET LAW: declared (`npc.facets.<kind>`
 * or a `facet:<kind>:<value>` tag, via the cohesionWeave chokepoint) wins; else the
 * NPC's own inferred value. Absent both ⇒ null (byte-identical to no facet).
 * @param {BankNpc} npc @param {string} facetKind @returns {string|null}
 */
export function npcFacetOf(npc, facetKind) {
  // The chokepoint returns the DECLARED value (it has no inference table for NPC
  // kinds, so it degrades to null) — we layer the NPC-native inference on top,
  // preserving "declared over inferred" without duplicating the declared read.
  const declared = facetOf(npc, facetKind);
  if (declared != null) return declared;
  return inferNpcFacet(npc, facetKind);
}

// ── §1.7 Goal-chain helpers (creation + transition articulation) ─────────────

/** The bank-bounded opening goal chain for a role (added NPCs inherit by role).
 *  @param {string} role @returns {{ short: string, long: string }} */
export function goalChainForRole(role) {
  return ROLE_GOAL_CHAIN[role] || ROLE_GOAL_CHAIN.civic;
}

/** The transition edges (onAchieve successors / onFail fallbacks) for a goal, or
 *  null if the goal is not in the catalog. @param {string} goal */
export function goalTransitions(goal) {
  return NPC_GOAL_CATALOG[goal] || null;
}

/** Is a goal legal for a role's opening chain? (affinity, not a hard sim gate —
 *  the engine can still rebranch any NPC by context.) @param {string} role @param {string} goal */
export function roleGoalAffinity(role, goal) {
  if (!isBankValid('goal', goal)) return false;
  const chain = ROLE_GOAL_CHAIN[role];
  if (!chain) return true; // unknown role ⇒ no affinity constraint
  return goal === chain.short || goal === chain.long
    || (NPC_GOAL_CATALOG[chain.long]?.onAchieve || []).includes(goal)
    || (NPC_GOAL_CATALOG[chain.short]?.onAchieve || []).includes(goal);
}

/** Is a role legally seated in an institution of the given facet-law NATURE?
 *  @param {string} role @param {string} institutionNature */
export function roleInstitutionLegal(role, institutionNature) {
  const allowed = ROLE_INSTITUTION_NATURE[role];
  if (!allowed) return true; // unknown role ⇒ unconstrained
  return allowed.includes(institutionNature);
}
