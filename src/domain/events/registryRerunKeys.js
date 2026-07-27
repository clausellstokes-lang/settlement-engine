/**
 * domain/events/registryRerunKeys.js — the per-event subsystem-keys table,
 * extracted VERBATIM from registryFull.js (Wave R-3 Lane C).
 *
 * Why its own module: registryFull.js folds composer prose onto the shared
 * registry specs at module evaluation, so importing the table from there
 * drags the whole prose string table into any chunk that only needs this
 * pure data (the economy-freshness display helper is the first such
 * consumer). This module has ZERO imports and stays a pure data leaf;
 * registryFull.js re-exports it, so every existing consumer and test keeps
 * its import path unchanged.
 *
 * The subsystem keys an event of a given type touches. MOVED to
 * registryFull.js from registry.js (2026-07-14, W-COMPOSER-1 byte reclaim):
 * no eager consumer reads it, and the string table cost ~1.7 KB of
 * first-paint closure. Lazy surfaces (and tests) import it from registryFull
 * or from HERE; the eager pipeline never needs it.
 *
 * ⚠ NOT descriptive metadata any more. This table is a FUNCTIONAL CLASSIFIER.
 * domain/display/economyFreshness.js intersects each row against the derived
 * economy read-model keys ('services' | 'activeChains' | 'economicState') to
 * decide whether a settlement's applied events postdate its last survey — and
 * that boolean is what makes the dossier's economy staleness note appear or
 * stay hidden. So a row here is user-facing: TRIMMING or narrowing a row
 * changes what users are TOLD about how fresh their economy numbers are, and
 * an event type that quietly loses its economy key stops warning anyone.
 * (The red direction is guarded — tests/domain/economyFreshness.test.js pins
 * classifier completeness: every registered event type must have a row, and
 * the economy-shifting set is pinned against the declarations. Add rows for
 * new event types; do not prune existing ones for tidiness.)
 *
 * There is still no step-level partial-rerun engine (it was retired); edits do
 * a full same-seed regen and derived state is recomputed on demand. `batch.js`
 * no longer reads this table either — rerunKeys left the applyEventBatch
 * envelope in the same 2026-07-14 reclaim (see batch.js, "rerunKeys was
 * REMOVED from this envelope").
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
