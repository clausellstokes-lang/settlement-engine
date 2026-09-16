/**
 * realmItemAttention.js — the canonical six-class attention vocabulary.
 *
 * Attention is an ordered explanation, not a hidden score. RealmItem derivation,
 * deterministic ranking, and the Herald's reader-facing labels all consume this
 * one definition so a class cannot silently acquire a different priority or
 * meaning in the UI.
 *
 * The numeric rank is presentation order only. It never enters simulation,
 * persistence, permissions, or RNG. Lower ranks appear first.
 */

/**
 * @typedef {{
 *   rank: number,
 *   label: string,
 *   reason: string,
 * }} RealmAttentionDefinition
 */

/** @type {Readonly<Record<string, Readonly<RealmAttentionDefinition>>>} */
const DEFINITIONS = Object.freeze({
  blocking_decision: Object.freeze({
    rank: 0,
    label: 'Requires your word',
    reason: 'A realm decision is unresolved and awaits the GM.',
  }),
  lapsed_order: Object.freeze({
    rank: 1,
    label: 'Order at risk',
    reason: 'A staged order no longer passes its current legal preconditions.',
  }),
  critical_condition: Object.freeze({
    rank: 2,
    label: 'Active condition',
    reason: 'A significant condition is active in the current realm state.',
  }),
  major_change: Object.freeze({
    rank: 3,
    label: 'Major change',
    reason: 'The source records a major realm change.',
  }),
  emerging_pressure: Object.freeze({
    rank: 4,
    label: 'Building next',
    reason: 'The source records an emerging pressure that may require preparation.',
  }),
  routine_record: Object.freeze({
    rank: 5,
    label: 'On record',
    reason: 'Recorded for reference; no immediate GM action is required.',
  }),
});

export const REALM_ATTENTION_DEFINITIONS = DEFINITIONS;

export const REALM_ATTENTION_CLASSES = Object.freeze(
  Object.keys(DEFINITIONS),
);

/**
 * Unknown imported classes degrade to routine language and sort after the
 * canonical vocabulary. They are never promoted merely because they are new.
 *
 * @param {unknown} attentionClass
 */
export function realmAttentionDefinition(attentionClass) {
  const id = attentionClass == null ? '' : String(attentionClass);
  return DEFINITIONS[id] || DEFINITIONS.routine_record;
}

/** @param {unknown} attentionClass */
export function realmAttentionRank(attentionClass) {
  const id = attentionClass == null ? '' : String(attentionClass);
  return DEFINITIONS[id]?.rank ?? Number.POSITIVE_INFINITY;
}
