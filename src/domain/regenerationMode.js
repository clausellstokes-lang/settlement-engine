/**
 * domain/regenerationMode.js — Reactive regeneration modes.
 *
 * Three modes control how aggressive a
 * rerun is. This module produces the structured preservation plan
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
 * Pure read-only. Composes entityCatalog + canon
 * tagging. The pipeline that performs the rerun is a separate
 * concern.
 */

import { entityCatalog } from './explanation.js';
import { tagEntityCanon } from './canonStatus.js';
import { deriveFactionProfile } from './factionProfile.js';
import { deriveActiveCondition } from './activeConditions.js';

// Same slug transform entityCatalog uses for institution ids, replicated here
// (the catalog's copy is module-private) so the reverse lookup re-derives the
// IDENTICAL id the catalog emitted.
/** @param {any} s */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

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

/**
 * @param {any} rule
 * @param {any} tag
 */
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
  /** @type {any} */
  const mode = REGENERATION_MODES.includes(/** @type {any} */ (options.mode)) ? options.mode : 'rebalance';
  const contributors = [];
  if (!REGENERATION_MODES.includes(/** @type {any} */ (options.mode))) {
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
      rerollSubsystems: [.../** @type {Record<string, string[]>} */ (MODE_SUBSYSTEM_REROLLS)[mode]],
      contributors,
    };
  }

  const cat = entityCatalog(settlement);
  /** @type {any[]} */
  const preserveEntities = [];
  /** @type {any[]} */
  const rerollEntities = [];

  for (const e of cat) {
    const rule = /** @type {Record<string, Record<string, string>>} */ (PRESERVATION_RULES)[mode]?.[e.type] || 'always';
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
    rerollSubsystems: [.../** @type {Record<string, string[]>} */ (MODE_SUBSYSTEM_REROLLS)[mode]],
    contributors,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @param {any} catalogEntry
 */
function lookupTagForEntity(settlement, catalogEntry) {
  // Resolve the underlying object (institution, faction, etc.) so we
  // can tag it. For derived entities (system_variable, capacity,
  // district, etc.) the raw object isn't on the settlement — we treat
  // those as generated/draft.
  //
  // CRITICAL: entityCatalog stamps a PROFILE-DERIVED id (factionIdFromName,
  // deriveActiveCondition's conditionId, or `institution.<slug>`), NOT the raw
  // object's `.id` — legacy factions of shape {faction, power, desc} carry no
  // stored `.id` at all. Matching raw `.id === catalogId` therefore missed every
  // such entity and tagged it generated/draft, so a user-locked or canon
  // faction/condition got rerolled by Rebalance/Reforge instead of preserved
  // (silent loss of user canon). Match by the SAME derived id the catalog used.
  const id = catalogEntry.id;
  const type = catalogEntry.type;

  if (type === 'institution') {
    const inst = (settlement.institutions || []).find((/** @type {any} */ i) =>
      i?.id === id || `institution.${snakeCase(i?.name || '')}` === id);
    return tagEntityCanon(inst || {});
  }
  if (type === 'faction') {
    // Mirror deriveAllFactionProfiles' source order so a faction stored under
    // any of the legacy containers resolves the same way the catalog derived it.
    const factions = settlement.powerStructure?.factions
                  || settlement.power?.factions
                  || settlement.factions
                  || [];
    const f = factions.find((/** @type {any} */ fac) =>
      fac?.id === id || /** @type {any} */ (deriveFactionProfile(fac, settlement))?.id === id);
    return tagEntityCanon(f || {});
  }
  if (type === 'npc') {
    // Catalog stamps `npc.id || npc.<slug>`; legacy NPCs lacking a stored id
    // were missed the same way factions were (see note above).
    const n = (settlement.npcs || []).find((/** @type {any} */ npc) =>
      npc?.id === id || `npc.${snakeCase(npc?.name || 'unnamed')}` === id);
    return tagEntityCanon(n || {});
  }
  if (type === 'condition') {
    const c = (settlement.activeConditions || []).find((/** @type {any} */ cond) =>
      cond?.id === id || /** @type {any} */ (deriveActiveCondition(cond))?.id === id);
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
