/**
 * domain/events/registryFull.js — the event registry WITH composer prose.
 *
 * The lazy DM composer surfaces (EventComposer, BatchCart) import the registry
 * from here instead of registry.js. This module folds each event type's
 * composer-facing prose (description / targetPrompt — see registryProse.js)
 * back onto the SAME spec objects registry.js exports, then re-exports the
 * registry's whole surface. Composer code and the spec-prop consumers
 * (EventComposerTargetField) therefore see specs with the exact same shape
 * they always had — while the eager entry closure (store → eventPipeline /
 * batch → registry.js) never carries the prose bytes.
 *
 * The fold mutates the shared spec objects once at module evaluation; it is
 * idempotent and additive-only (no functional field is ever touched), so the
 * eager pipeline's view of a spec is unchanged whether or not this module has
 * loaded. @enforced-by tests/build/vendorPdfLazy.test.js (byte budget).
 */

import { EVENT_REGISTRY } from './registry.js';
import { EVENT_PROSE } from './registryProse.js';

for (const [type, prose] of Object.entries(EVENT_PROSE)) {
  const spec = EVENT_REGISTRY[type];
  if (spec) Object.assign(spec, prose);
}

export * from './registry.js';

/**
 * The subsystem keys an event of a given type touches. MOVED here from
 * registry.js (2026-07-14, W-COMPOSER-1 byte reclaim): descriptive metadata
 * for composer-side surfaces only — no eager consumer reads it, and the
 * string table cost ~1.7 KB of first-paint closure. Lazy surfaces (and
 * tests) import it from HERE; the eager pipeline never needs it. `batch.js` reads this to
 * tell the DM which subsystems a batch of events affects (the batch-preview
 * "affected subsystems" list). Descriptive metadata only — there is no
 * step-level partial-rerun engine (it was retired); edits do a full same-seed
 * regen and derived state is recomputed on demand. Keep the lists tight so the
 * preview reads honestly.
 */
export const RERUN_KEYS_FOR_EVENT = {
  ADD_INSTITUTION:    ['institutions', 'services', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  REMOVE_INSTITUTION: ['institutions', 'services', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  DAMAGE_INSTITUTION: ['services', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  DEPLETE_RESOURCE:   ['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  CUT_TRADE_ROUTE:    ['activeChains', 'foodSecurity', 'economicState', 'narrative'],
  ADD_NPC:                ['npcs', 'powerStructure', 'narrative'],
  KILL_NPC:               ['npcs', 'powerStructure', 'institutions', 'narrative'],
  ASSIGN_NPC_TO_ROLE:     ['npcs', 'institutions', 'powerStructure', 'narrative'],
  IMPAIR_INSTITUTION:     ['institutions', 'services', 'economicState', 'narrative'],
  RESTORE_INSTITUTION:    ['institutions', 'services', 'economicState', 'narrative'],
  IMPAIR_FACTION:         ['powerStructure', 'narrative'],
  RESTORE_FACTION:        ['powerStructure', 'narrative'],
  ADD_FACTION:            ['powerStructure', 'narrative'],
  // Wave 1 extended events.
  KILL_LEADER:            ['npcs', 'powerStructure', 'institutions', 'narrative'],
  EXPOSE_CORRUPTION:      ['powerStructure', 'institutions', 'economicState', 'narrative'],
  IMPOSE_CORRUPTION:      ['npcs', 'powerStructure', 'narrative'],
  REFUGEE_WAVE:           ['demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  PLAGUE:                 ['demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  RAID_OR_MONSTER_ATTACK: ['institutions', 'economicState', 'narrative'],
  // Phase 24 / Tier 4.11 — player intervention events
  REMOVED_THREAT:         ['economicState', 'powerStructure', 'narrative'],
  BROKERED_ALLIANCE:      ['powerStructure', 'narrative'],
  SETTLEMENT_DISPUTE:     ['powerStructure', 'narrative'],
  STARTED_RIOT:           ['powerStructure', 'economicState', 'narrative'],
  OPENED_TRADE_ROUTE:     ['activeChains', 'foodSecurity', 'economicState', 'narrative'],
  RECOVERED_RESOURCE:     ['resources', 'activeChains', 'economicState', 'narrative'],
  DESTROY_SETTLEMENT:     ['economicState', 'powerStructure', 'narrative'],
  // Coup d'état wave — authored crises + transfers of the governing seat.
  APPLY_STRESSOR:         ['powerStructure', 'economicState', 'narrative'],
  CHANGE_RULING_POWER:    ['powerStructure', 'npcs', 'narrative'],
  // Editor roster wave — the Roster's add/remove vocabulary as first-class canon events.
  RESOLVE_STRESSOR:       ['powerStructure', 'economicState', 'narrative'],
  ADD_TRADE_GOOD:         ['economicState', 'narrative'],
  REMOVE_TRADE_GOOD:      ['economicState', 'narrative'],
  ADD_RESOURCE:           ['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  REMOVE_RESOURCE:        ['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  PROMOTE_NPC:            ['npcs', 'powerStructure', 'narrative'],
  DEMOTE_NPC:             ['npcs', 'powerStructure', 'narrative'],
  // Assigning a patron deity (or imposing a cult beneath it) re-derives the
  // religion substrate (the deity term in deriveReligiousAuthority) + narrative.
  SET_PRIMARY_DEITY:      ['powerStructure', 'narrative'],
  IMPOSE_CULT:            ['powerStructure', 'narrative'],
  // A forced tier shift rebands population and performs institution roster surgery, so it
  // re-derives the broad structural surface (institutions + demand/food + economy + power).
  SHIFT_TIER:             ['institutions', 'demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  // The generosity counterpart verbs (FP-G3): grain leaves the granary (food/economy)
  // and FORCE_RELIEF also moves the ruler's legitimacy dial (powerStructure).
  FORCE_RELIEF:           ['foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  OFFER_CREDIT:           ['foodSecurity', 'economicState', 'narrative'],
};
