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
 * ── WHY A ZERO-DRIFT MIRROR (not a re-export) ───────────────────────────────
 * The engine's native vocabularies (ALIGNMENTS/GOALS in worldPulse/npcAgency.js;
 * the positive-trait TEMPERAMENT pool in data/npcData.js; the role archetypes)
 * are module-private or eager. The bank MIRRORS them as its own frozen lists so
 * it stays a lazy, zero-import-except-the-chokepoint leaf — the guidanceRegistry
 * pattern. The mirror is kept honest by pins in tests/domain/npc/npcBank.test.js
 * (the temperament pool is asserted === data/npcData's positive traits; the
 * alignment/goal vocab is asserted to COVER every value the engine can seed).
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

/** The NPC fields the bank reads (only these — declared over inferred).
 * @typedef {{ personality?: Record<string, unknown>, role?: string, category?: string,
 *   goal?: Record<string, unknown>, facets?: unknown, tags?: unknown }} BankNpc */

// ── §1.1 The bounded attribute vocabularies (mirrors of the engine's native words) ──

/** Alignment axes — mirrors worldPulse/npcAgency.js ALIGNMENTS (the law×good grid).
 *  @type {readonly string[]} */
export const NPC_ALIGNMENTS = Object.freeze([
  'lawful_good', 'neutral_good', 'lawful_neutral', 'true_neutral',
  'chaotic_neutral', 'lawful_evil', 'neutral_evil', 'chaotic_evil',
]);

/** Temperament — the steady positive-trait disposition (npc.personality.dominant).
 *  Mirrors data/npcData.js NPC_PERSONALITY_TRAITS.positive; pinned === that pool so
 *  an instant NPC's temperament is drawn from the exact same vocabulary a generated
 *  one is (the counterpart criterion). @type {readonly string[]} */
export const NPC_TEMPERAMENTS = Object.freeze([
  'honest', 'brave', 'compassionate', 'wise', 'loyal', 'generous', 'patient',
  'humble', 'diligent', 'fair-minded', 'optimistic', 'charismatic', 'clever',
  'principled', 'protective', 'diplomatic', 'resourceful', 'scholarly', 'pious',
  'merciful', 'tenacious', 'methodical', 'intuitive', 'perceptive', 'steadfast',
  'magnanimous', 'incorruptible', 'warm-hearted', 'level-headed', 'forthright',
]);

/** Role archetype — the 12 agency archetypes (worldPulse/npcAgency inferRoleArchetype
 *  maps an NPC's role/label/title text to one of these). The bank's role facet is the
 *  archetype so an edited role re-flows through inferRoleArchetype on the next tick.
 *  @type {readonly string[]} */
export const NPC_ROLE_ARCHETYPES = Object.freeze([
  'ruler', 'heir', 'military', 'merchant', 'religious', 'criminal', 'arcane',
  'civic', 'healer', 'labor_resource', 'diplomat_outsider', 'dissident',
]);

// ── §1.2 THE TYPED GOAL CATALOG WITH TRANSITION SEMANTICS ────────────────────
//
// Each goal carries its on-ACHIEVE successor candidates and on-FAIL fallbacks,
// all bank-bounded. This is the declarative articulation of the engine's evolution:
//   • ACHIEVE mirrors npcGoalCulmination (a long ambition pays off; the NPC is
//     promoted) → a higher-reach successor.
//   • FAIL mirrors the demotion/crisis arm of branchedGoals (a setback) → a
//     defensive fallback.
// Every value below is in the engine's own goal vocabulary (GOALS ∪ the
// branchedGoals targets), so a chain declared here is one the engine can seed,
// read (settlementPolitics deriveEnd's GOAL_END_HINT), and evolve.

/** @typedef {{ onAchieve: readonly string[], onFail: readonly string[], drive: string }} GoalTransitions */

/** @type {Readonly<Record<string, GoalTransitions>>} */
export const NPC_GOAL_CATALOG = Object.freeze({
  // ── The base ten (npcAgency GOALS) ──
  secure_office:          { onAchieve: ['control_institution', 'expand_influence'], onFail: ['win_public_legitimacy', 'survive_crisis'], drive: 'political' },
  protect_followers:      { onAchieve: ['restore_order', 'win_public_legitimacy'],  onFail: ['survive_crisis', 'protect_followers'],       drive: 'protection' },
  expand_influence:       { onAchieve: ['control_institution', 'bind_external_patron'], onFail: ['settle_rivalry', 'survive_crisis'],       drive: 'power' },
  settle_rivalry:         { onAchieve: ['consolidate_power', 'expand_influence'],    onFail: ['mobilize_defenses', 'survive_crisis'],       drive: 'political' },
  restore_order:          { onAchieve: ['win_public_legitimacy', 'secure_office'],   onFail: ['protect_followers', 'survive_crisis'],       drive: 'reform' },
  profit_from_change:     { onAchieve: ['expand_trade_house', 'expand_influence'],   onFail: ['survive_tribute', 'survive_crisis'],         drive: 'wealth' },
  control_institution:    { onAchieve: ['consolidate_power', 'secure_office'],       onFail: ['expand_influence', 'settle_rivalry'],        drive: 'power' },
  win_public_legitimacy:  { onAchieve: ['secure_office', 'formalize_new_charter'],   onFail: ['protect_followers', 'restore_order'],        drive: 'political' },
  bind_external_patron:   { onAchieve: ['secure_tribute', 'expand_influence'],       onFail: ['survive_tribute', 'organize_autonomy'],      drive: 'political' },
  survive_crisis:         { onAchieve: ['restore_order', 'protect_followers'],       onFail: ['survive_crisis', 'survive_tribute'],         drive: 'protection' },
  // ── Context/branch targets (branchedGoals) — bank-bounded, engine-evolvable ──
  organize_autonomy:      { onAchieve: ['break_vassalage', 'win_public_legitimacy'], onFail: ['survive_tribute', 'protect_followers'],      drive: 'political' },
  break_vassalage:        { onAchieve: ['secure_office', 'consolidate_power'],       onFail: ['survive_tribute', 'organize_autonomy'],      drive: 'political' },
  survive_tribute:        { onAchieve: ['bind_external_patron', 'organize_autonomy'], onFail: ['survive_crisis', 'survive_tribute'],        drive: 'protection' },
  secure_tribute:         { onAchieve: ['expand_influence', 'consolidate_power'],    onFail: ['settle_rivalry', 'survive_crisis'],          drive: 'wealth' },
  exploit_desperation:    { onAchieve: ['expand_influence', 'consolidate_power'],    onFail: ['punish_rivals', 'survive_crisis'],           drive: 'power' },
  join_guild:             { onAchieve: ['expand_trade_house', 'profit_from_change'], onFail: ['profit_from_change', 'survive_tribute'],     drive: 'wealth' },
  expand_trade_house:     { onAchieve: ['consolidate_power', 'expand_influence'],    onFail: ['profit_from_change', 'survive_crisis'],      drive: 'wealth' },
  secure_new_garrison:    { onAchieve: ['professionalize_guard', 'restore_order'],   onFail: ['mobilize_defenses', 'survive_crisis'],       drive: 'military' },
  professionalize_guard:  { onAchieve: ['restore_order', 'consolidate_power'],       onFail: ['mobilize_defenses', 'protect_followers'],    drive: 'military' },
  formalize_new_charter:  { onAchieve: ['secure_office', 'control_institution'],     onFail: ['win_public_legitimacy', 'restore_order'],    drive: 'political' },
  punish_rivals:          { onAchieve: ['consolidate_power', 'settle_rivalry'],      onFail: ['exploit_desperation', 'survive_crisis'],     drive: 'political' },
  mobilize_defenses:      { onAchieve: ['settle_rivalry', 'professionalize_guard'],  onFail: ['survive_crisis', 'protect_followers'],       drive: 'military' },
  consolidate_power:      { onAchieve: ['control_institution', 'secure_office'],     onFail: ['settle_rivalry', 'survive_crisis'],          drive: 'power' },
});

/** The bounded goal vocabulary (the catalog's keys). @type {readonly string[]} */
export const NPC_GOALS = Object.freeze(Object.keys(NPC_GOAL_CATALOG));

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
// The bounded facet kinds a bank op may set. Each resolves through the ONE
// facet-law chokepoint (declared over inferred).

/** The bank facet kinds. @type {readonly string[]} */
export const NPC_FACET_KINDS = Object.freeze(['alignment', 'temperament', 'role', 'goal']);

/** The bounded vocabulary for a facet kind, or null for a free-shape kind.
 *  @param {string} facetKind @returns {readonly string[]|null} */
export function bankVocabulary(facetKind) {
  switch (facetKind) {
    case 'alignment':   return NPC_ALIGNMENTS;
    case 'temperament': return NPC_TEMPERAMENTS;
    case 'role':        return NPC_ROLE_ARCHETYPES;
    case 'goal':        return NPC_GOALS;
    default:            return null;
  }
}

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

// ── §1.6 Validation (the bank is the validation source; free-text is rejected) ──

/** Is `value` a legal member of the bank vocabulary for `facetKind`? Free-text and
 *  unknown kinds are rejected. @param {string} facetKind @param {unknown} value */
export function isBankValid(facetKind, value) {
  const vocab = bankVocabulary(facetKind);
  if (!vocab) return false;
  return typeof value === 'string' && vocab.includes(value);
}

/**
 * Validate a proposed NPC facet edit. Returns { ok, reason } — the op layer refuses
 * anything not ok, so a hand-typed string can never enter the queue.
 * @param {string} facetKind @param {unknown} value
 * @returns {{ ok: boolean, reason: string|null }}
 */
export function validateNpcFacet(facetKind, value) {
  if (!NPC_FACET_KINDS.includes(facetKind)) {
    return { ok: false, reason: `unknown facet kind "${String(facetKind)}"` };
  }
  if (!isBankValid(facetKind, value)) {
    return { ok: false, reason: `"${String(value)}" is not a bank-valid ${facetKind}` };
  }
  return { ok: true, reason: null };
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
