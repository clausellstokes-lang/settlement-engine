/**
 * domain/regenerationPolicy.js — what a regeneration mode preserves.
 *
 * The mode vocabulary and the per-entity-type preservation rules, split out as
 * a LEAF: this module imports only canonStatus (itself importless), so a caller
 * can ask "does this mode keep this entity?" without dragging in the entity
 * catalog.
 *
 * That split is load-bearing rather than tidy. regenerationMode.js builds a
 * serialisable plan over entityCatalog and therefore pulls explanation.js,
 * factionProfile.js and activeConditions.js behind it. When the generator's
 * reroll tail imported the rules THROUGH that module, the bundler saw those
 * heavy domain modules imported from both an eager surface and the lazy engine
 * chunk and re-parented them into the first-paint closure — roughly 30 kB of
 * eager growth to ask a question answered by a frozen lookup table. Keeping the
 * table reachable on its own leaves the plan builder's weight where it belongs.
 *
 * Pure and side-effect free.
 */

import { tagEntityCanon } from './canonStatus.js';

export const REGENERATION_MODES = Object.freeze(['nudge', 'rebalance', 'reforge']);

// ── Per-entity-type preservation rules per mode ─────────────────────────
//
// 'always' — preserve unconditionally
// 'canon'  — preserve if canonStatus === 'canon' or locked
// 'locked' — preserve only if locked
// 'never'  — always reroll

export const PRESERVATION_RULES = Object.freeze({
  nudge: {
    institution:      'always',
    faction:          'always',
    npc:              'always',
    chain:            'always',
    hook:             'canon',
    condition:        'always',
    clock:            'always',
    history_beat:     'always',
    system_variable:  'always',
    threat:           'always',
    capacity:         'always',
    district:         'always',
  },
  rebalance: {
    institution:      'canon',
    faction:          'canon',
    npc:              'canon',
    chain:            'canon',
    hook:             'locked',
    condition:        'canon',
    clock:            'canon',
    history_beat:     'canon',
    system_variable:  'always',  // derived; cheap to recompute
    threat:           'canon',
    capacity:         'always',
    district:         'canon',
  },
  reforge: {
    institution:      'locked',
    faction:          'locked',
    npc:              'locked',
    chain:            'never',
    hook:             'never',
    condition:        'locked',
    clock:            'never',
    history_beat:     'locked',
    system_variable:  'always',
    threat:           'never',
    capacity:         'always',
    district:         'never',
  },
});

/**
 * @typedef {'always'|'never'|'canon'|'locked'} PreservationRule
 */
/**
 * @param {PreservationRule|string} rule
 * @param {import('./canonStatus.js').CanonTag} tag
 * @returns {boolean}
 */
export function shouldPreserve(rule, tag) {
  if (rule === 'always') return true;
  if (rule === 'never')  return false;
  if (rule === 'canon')  return tag.canonStatus === 'canon' || tag.locked === true;
  if (rule === 'locked') return tag.locked === true;
  return false;
}

/**
 * The rule a mode applies to one entity type. An unrated type defaults to
 * 'always': a newly catalogued entity is preserved until someone deliberately
 * decides it is cheap to reroll.
 *
 * @param {'nudge'|'rebalance'|'reforge'} mode
 * @param {string} type
 * @returns {PreservationRule|string}
 */
export function ruleFor(mode, type) {
  return PRESERVATION_RULES[mode]?.[
    /** @type {keyof (typeof PRESERVATION_RULES)['nudge']} */ (type)
  ] || 'always';
}

/**
 * @param {string|undefined} mode
 * @returns {'nudge'|'rebalance'|'reforge'}
 */
export function normalizeMode(mode) {
  return /** @type {'nudge'|'rebalance'|'reforge'} */ (
    REGENERATION_MODES.includes(/** @type {string} */ (mode)) ? mode : 'rebalance'
  );
}

/**
 * Does `mode` preserve this entity through a regeneration?
 *
 * The enforcement half of buildRegenerationPlan. The plan is a serialisable
 * REPORT keyed by the ids entityCatalog derives, so a merge that already holds
 * the entity object would have to reverse-derive that id just to ask this
 * question — the exact round-trip lookupTagForEntity exists to undo, and the
 * one its own header records as having silently mis-rerolled user canon once.
 * Report and enforcement read the same PRESERVATION_RULES table above, so the
 * two halves cannot drift apart.
 *
 * @param {string|undefined} mode  Unknown modes fall back to 'rebalance'.
 * @param {string} type            Entity type as entityCatalog spells it.
 * @param {import('./canonStatus.js').CanonTaggable|null|undefined} entity
 * @returns {boolean}
 */
export function preservesEntity(mode, type, entity) {
  return shouldPreserve(ruleFor(normalizeMode(mode), type), tagEntityCanon(entity));
}
