/**
 * npcFacetContract.js — first-paint-safe NPC facet transport vocabulary.
 *
 * The editor queue and the richer NPC bank must accept exactly the same finite
 * values. This zero-import leaf is that single source: data plus membership
 * checks only. npcBank re-exports it for its lazy authoring/generation helpers;
 * the pending-edit boundary can validate without pulling npcOps, PRNG, or the
 * facet-law inference graph into the eager store closure.
 */

/** @type {readonly string[]} */
export const NPC_ALIGNMENTS = Object.freeze([
  'lawful_good', 'neutral_good', 'lawful_neutral', 'true_neutral',
  'chaotic_neutral', 'lawful_evil', 'neutral_evil', 'chaotic_evil',
]);

/** @type {readonly string[]} */
export const NPC_TEMPERAMENTS = Object.freeze([
  'honest', 'brave', 'compassionate', 'wise', 'loyal', 'generous', 'patient',
  'humble', 'diligent', 'fair-minded', 'optimistic', 'charismatic', 'clever',
  'principled', 'protective', 'diplomatic', 'resourceful', 'scholarly', 'pious',
  'merciful', 'tenacious', 'methodical', 'intuitive', 'perceptive', 'steadfast',
  'magnanimous', 'incorruptible', 'warm-hearted', 'level-headed', 'forthright',
  'prudent', 'candid', 'gracious', 'stalwart', 'discerning', 'equitable',
  'temperate', 'courteous', 'dependable', 'astute', 'conscientious',
  'good-humoured', 'unflappable', 'plain-dealing', 'hospitable',
]);

/** @type {readonly string[]} */
export const NPC_ROLE_ARCHETYPES = Object.freeze([
  'ruler', 'heir', 'military', 'merchant', 'religious', 'criminal', 'arcane',
  'civic', 'healer', 'labor_resource', 'diplomat_outsider', 'dissident',
]);

/** @typedef {{ onAchieve: readonly string[], onFail: readonly string[], drive: string }} GoalTransitions */

/** @type {Readonly<Record<string, GoalTransitions>>} */
export const NPC_GOAL_CATALOG = Object.freeze({
  secure_office:          { onAchieve: ['control_institution', 'expand_influence'], onFail: ['win_public_legitimacy', 'survive_crisis'], drive: 'political' },
  protect_followers:      { onAchieve: ['restore_order', 'win_public_legitimacy'], onFail: ['survive_crisis', 'protect_followers'], drive: 'protection' },
  expand_influence:       { onAchieve: ['control_institution', 'bind_external_patron'], onFail: ['settle_rivalry', 'survive_crisis'], drive: 'power' },
  settle_rivalry:         { onAchieve: ['consolidate_power', 'expand_influence'], onFail: ['mobilize_defenses', 'survive_crisis'], drive: 'political' },
  restore_order:          { onAchieve: ['win_public_legitimacy', 'secure_office'], onFail: ['protect_followers', 'survive_crisis'], drive: 'reform' },
  profit_from_change:     { onAchieve: ['expand_trade_house', 'expand_influence'], onFail: ['survive_tribute', 'survive_crisis'], drive: 'wealth' },
  control_institution:    { onAchieve: ['consolidate_power', 'secure_office'], onFail: ['expand_influence', 'settle_rivalry'], drive: 'power' },
  win_public_legitimacy:  { onAchieve: ['secure_office', 'formalize_new_charter'], onFail: ['protect_followers', 'restore_order'], drive: 'political' },
  bind_external_patron:   { onAchieve: ['secure_tribute', 'expand_influence'], onFail: ['survive_tribute', 'organize_autonomy'], drive: 'political' },
  survive_crisis:         { onAchieve: ['restore_order', 'protect_followers'], onFail: ['survive_crisis', 'survive_tribute'], drive: 'protection' },
  organize_autonomy:      { onAchieve: ['break_vassalage', 'win_public_legitimacy'], onFail: ['survive_tribute', 'protect_followers'], drive: 'political' },
  break_vassalage:        { onAchieve: ['secure_office', 'consolidate_power'], onFail: ['survive_tribute', 'organize_autonomy'], drive: 'political' },
  survive_tribute:        { onAchieve: ['bind_external_patron', 'organize_autonomy'], onFail: ['survive_crisis', 'survive_tribute'], drive: 'protection' },
  secure_tribute:         { onAchieve: ['expand_influence', 'consolidate_power'], onFail: ['settle_rivalry', 'survive_crisis'], drive: 'wealth' },
  exploit_desperation:    { onAchieve: ['expand_influence', 'consolidate_power'], onFail: ['punish_rivals', 'survive_crisis'], drive: 'power' },
  join_guild:             { onAchieve: ['expand_trade_house', 'profit_from_change'], onFail: ['profit_from_change', 'survive_tribute'], drive: 'wealth' },
  expand_trade_house:     { onAchieve: ['consolidate_power', 'expand_influence'], onFail: ['profit_from_change', 'survive_crisis'], drive: 'wealth' },
  secure_new_garrison:    { onAchieve: ['professionalize_guard', 'restore_order'], onFail: ['mobilize_defenses', 'survive_crisis'], drive: 'military' },
  professionalize_guard:  { onAchieve: ['restore_order', 'consolidate_power'], onFail: ['mobilize_defenses', 'protect_followers'], drive: 'military' },
  formalize_new_charter:  { onAchieve: ['secure_office', 'control_institution'], onFail: ['win_public_legitimacy', 'restore_order'], drive: 'political' },
  punish_rivals:          { onAchieve: ['consolidate_power', 'settle_rivalry'], onFail: ['exploit_desperation', 'survive_crisis'], drive: 'political' },
  mobilize_defenses:      { onAchieve: ['settle_rivalry', 'professionalize_guard'], onFail: ['survive_crisis', 'protect_followers'], drive: 'military' },
  consolidate_power:      { onAchieve: ['control_institution', 'secure_office'], onFail: ['settle_rivalry', 'survive_crisis'], drive: 'power' },
});

/** @type {readonly string[]} */
export const NPC_GOALS = Object.freeze(Object.keys(NPC_GOAL_CATALOG));

/** @type {readonly string[]} */
export const NPC_FACET_KINDS = Object.freeze([
  'alignment',
  'temperament',
  'role',
  'goal',
]);

/** @param {string} facetKind @returns {readonly string[]|null} */
export function bankVocabulary(facetKind) {
  switch (facetKind) {
    case 'alignment':   return NPC_ALIGNMENTS;
    case 'temperament': return NPC_TEMPERAMENTS;
    case 'role':        return NPC_ROLE_ARCHETYPES;
    case 'goal':        return NPC_GOALS;
    default:            return null;
  }
}

/** @param {string} facetKind @param {unknown} value */
export function isBankValid(facetKind, value) {
  const vocabulary = bankVocabulary(facetKind);
  return !!vocabulary
    && typeof value === 'string'
    && vocabulary.includes(value);
}

/**
 * @param {string} facetKind @param {unknown} value
 * @returns {{ ok:true, reason:null } | { ok:false, reason:string }}
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
