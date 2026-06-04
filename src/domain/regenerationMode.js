/**
 * domain/regenerationMode.js — Reactive regeneration modes.
 *
 * Tier 5.2 of the roadmap. Three modes control how aggressive a
 * rerun is. Phase 35 produces the structured preservation plan
 * consumers (the regen UI, the pipeline) read:
 *
 *   Nudge      — preserve most; reroll only minor service / detail fields
 *   Rebalance  — preserve canon + locked entities; reroll affected subsystems
 *   Reforge    — keep only the hard anchors (seed, name, tier, geography)
 *
 *   buildRegenerationPlan(settlement, { mode, change? }) -> {
 *     mode,
 *     preserveEntities: [{ id, type, reason }],
 *     rerollEntities:   [{ id, type, reason }],
 *     preserveFields:   [string],     hard-anchor settlement fields
 *     rerollSubsystems: [string],     subsystem keys to recompute
 *     contributors[]
 *   }
 *
 * Pure read-only. Composes Phase 19 entityCatalog + Phase 33 canon
 * tagging. The pipeline that performs the rerun is a separate
 * concern.
 */

import { entityCatalog } from './explanation.js';
import { tagEntityCanon } from './canonStatus.js';

// ── Catalog ──────────────────────────────────────────────────────────────

export const REGENERATION_MODES = Object.freeze(['nudge', 'rebalance', 'reforge']);

// Hard anchors that even a Reforge keeps.
const HARD_ANCHOR_FIELDS = Object.freeze([
  '_seed', 'id', 'name', 'tier',
  'schemaVersion', 'simulationVersion', 'generatorVersion',
]);

// Per-mode subsystem-reroll plans. Subsystem keys here match the
// pipeline-step `provides` keys from the existing event registry so
// the reactive rerun knows what to invalidate.
const MODE_SUBSYSTEM_REROLLS = Object.freeze({
  nudge: ['narrative'],
  rebalance: [
    'services', 'activeChains', 'foodSecurity',
    'economicState', 'powerStructure', 'narrative',
  ],
  reforge: [
    'institutions', 'services', 'activeChains', 'foodSecurity',
    'economicState', 'powerStructure', 'npcs',
    'history', 'narrative',
  ],
});

// ── Per-entity-type preservation rules per mode ─────────────────────────
//
// 'always' — preserve unconditionally
// 'canon'  — preserve if canonStatus === 'canon' or locked
// 'locked' — preserve only if locked
// 'never'  — always reroll

const PRESERVATION_RULES = Object.freeze({
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

function shouldPreserve(rule, tag) {
  if (rule === 'always') return true;
  if (rule === 'never')  return false;
  if (rule === 'canon')  return tag.canonStatus === 'canon' || tag.locked === true;
  if (rule === 'locked') return tag.locked === true;
  return false;
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Build the preservation plan for a regeneration mode.
 *
 * @param {Object} settlement
 * @param {Object} [options]
 * @param {string} [options.mode]    'nudge' | 'rebalance' | 'reforge'
 * @param {Object} [options.change]  Description of the user change
 *                                   driving this regen (recorded for trace).
 * @returns {Object} RegenerationPlan
 */
export function buildRegenerationPlan(settlement, options = {}) {
  const mode = REGENERATION_MODES.includes(options.mode) ? options.mode : 'rebalance';
  const contributors = [];
  if (!REGENERATION_MODES.includes(options.mode)) {
    contributors.push({
      source: 'options.mode',
      effect: 'fallback',
      reason: `Unknown mode "${options.mode}"; falling back to "rebalance".`,
    });
  } else {
    contributors.push({
      source: 'options.mode',
      effect: 'matched',
      reason: `Mode "${mode}" selected.`,
    });
  }

  if (!settlement) {
    return {
      mode,
      preserveEntities: [],
      rerollEntities: [],
      preserveFields: [...HARD_ANCHOR_FIELDS],
      rerollSubsystems: [...MODE_SUBSYSTEM_REROLLS[mode]],
      contributors,
    };
  }

  const cat = entityCatalog(settlement);
  const preserveEntities = [];
  const rerollEntities = [];

  for (const e of cat) {
    const rule = PRESERVATION_RULES[mode]?.[e.type] || 'always';
    // Look up the entity on the settlement to get its tag. The
    // catalog entry only has { type, id, label }, so for tagging we
    // re-fetch from the appropriate settlement array.
    const tag = lookupTagForEntity(settlement, e);
    const preserved = shouldPreserve(rule, tag);
    (preserved ? preserveEntities : rerollEntities).push({
      id: e.id,
      type: e.type,
      label: e.label,
      reason: preserved
        ? `${mode} preserves ${e.type} via "${rule}" rule (canonStatus=${tag.canonStatus}, locked=${tag.locked}).`
        : `${mode} rerolls ${e.type} via "${rule}" rule (canonStatus=${tag.canonStatus}, locked=${tag.locked}).`,
    });
  }

  if (options.change) {
    contributors.push({
      source: 'options.change',
      effect: 'noted',
      reason: `Plan built in response to change: ${JSON.stringify(options.change)}.`,
    });
  }

  return {
    mode,
    preserveEntities,
    rerollEntities,
    preserveFields: [...HARD_ANCHOR_FIELDS],
    rerollSubsystems: [...MODE_SUBSYSTEM_REROLLS[mode]],
    contributors,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

function lookupTagForEntity(settlement, catalogEntry) {
  // Resolve the underlying object (institution, faction, etc.) so we
  // can tag it. For derived entities (system_variable, capacity,
  // district, etc.) the raw object isn't on the settlement — we treat
  // those as generated/draft.
  const id = catalogEntry.id;
  const type = catalogEntry.type;

  if (type === 'institution') {
    const inst = (settlement.institutions || []).find(i => i?.id === id);
    return tagEntityCanon(inst || {});
  }
  if (type === 'faction') {
    const f = (settlement.powerStructure?.factions || []).find(fac => fac?.id === id);
    return tagEntityCanon(f || {});
  }
  if (type === 'npc') {
    const n = (settlement.npcs || []).find(npc => npc?.id === id);
    return tagEntityCanon(n || {});
  }
  if (type === 'condition') {
    const c = (settlement.activeConditions || []).find(cond => cond?.id === id);
    return tagEntityCanon(c || {});
  }
  // Derived entities default to generated/draft.
  return tagEntityCanon({});
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

export function supportedRegenerationModes() {
  return [...REGENERATION_MODES];
}

export function hardAnchorFields() {
  return [...HARD_ANCHOR_FIELDS];
}

/** Quick mode descriptor strings for UI tooltips. */
export const MODE_DESCRIPTIONS = Object.freeze({
  nudge:     'Preserve most. Minor cosmetic / narrative variation only.',
  rebalance: 'Preserve user canon + locked entities. Recalculate affected subsystems.',
  reforge:   'Keep only hard anchors (seed, name, tier). Reroll almost everything.',
});
