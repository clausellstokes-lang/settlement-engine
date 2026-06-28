/**
 * undoRoundTrip.test.js — A+ domain.5.
 *
 * The "undo is a true inverse of mutate" claim was proven only by per-subtree
 * assertions (undoSnapshotSubtree.test.js checks .npcs / .powerStructure /
 * .neighbourNetwork individually). Per-subtree pins miss any subtree the author
 * didn't think to check — exactly how earlier audits found CHANGE_RULING_POWER
 * and the relationship events leaking. This pin asserts a WHOLE-OBJECT inverse
 * for EVERY event type in EVENT_REGISTRY, so there are no blind spots and every
 * new event type is auto-covered (or fails loudly for lack of a fixture).
 *
 * It faithfully reproduces settlementSlice.undoLastEvent's settlement-object
 * undo: capture the pre-event snapshot, mutateSettlement, then on undo strip
 * impairments tagged with the event id across all four entity lists and run
 * scrubUndoneEvent (conditions / annotations / creations / snapshot restore).
 *
 * Comparison note: the undo path EMPTIES containers in place (config.eventConditions,
 * _cutRoutes, impairments arrays) rather than deleting the key, and a fresh
 * generated fixture lacks some baseline canon fields — so we compare after a
 * `prune` that treats absent ≡ empty ≡ null. prune preserves every NON-empty
 * difference, so genuine residue (a leftover entry, a wrong value) still fails.
 *
 * This pin drove four real undo fixes (ASSIGN_NPC_TO_ROLE, RESTORE_INSTITUTION,
 * RESTORE_FACTION, REMOVED_THREAT were writing durable state with no snapshot).
 * The one remaining residue — RESOLVE_STRESSOR's live stress entry — is a
 * documented crisis-lifecycle limitation (the stressorEdits record restores it
 * on the next regeneration; resurrecting it directly would double-count). It is
 * asserted as a precise residue below rather than skipped.
 */
import { describe, it, expect } from 'vitest';
import { EVENT_REGISTRY } from '../../../src/domain/events/registry.js';
import { mutateSettlement } from '../../../src/domain/events/mutate.js';
import { captureEventUndoSnapshot, scrubUndoneEvent } from '../../../src/domain/events/undoEvent.js';
import { withEventConditionsSynced } from '../../../src/domain/activeConditions.js';
import { stripImpairmentsForEvent } from '../../../src/store/settlementSliceHelpers.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { withCustomContent } from '../../../src/lib/dependencyEngine.js';

const NOW = '2026-01-01T00:00:00.000Z';

// A canon settlement (post-canonize / post-first-apply) carries baseline fields
// the raw generator output lacks but the undo path assumes: an impairments array
// + status on every entity, and config.eventConditions synced from conditions.
function normalizeForUndo(s) {
  const norm = (e) => {
    if (!e) return e;
    const n = { ...e };
    if (!Array.isArray(n.impairments)) n.impairments = [];
    if (n.status === undefined) n.status = 'active';
    return n;
  };
  if (Array.isArray(s.institutions)) s.institutions = s.institutions.map(norm);
  if (Array.isArray(s.npcs)) s.npcs = s.npcs.map(norm);
  if (Array.isArray(s.factions)) s.factions = s.factions.map(norm);
  if (s.powerStructure?.factions) s.powerStructure.factions = s.powerStructure.factions.map(norm);
  if (!Array.isArray(s.activeConditions)) s.activeConditions = [];
  if (s.status === undefined) s.status = 'active';
  if (!s.config) s.config = {};
  if (!Array.isArray(s.config.eventConditions)) s.config.eventConditions = [];
  return withEventConditionsSynced(s);
}

function baseSettlement() {
  const s = withCustomContent({}, () => generateSettlementPipeline(
    { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'frontier' },
    null, { seed: 'undo-roundtrip', customContent: {} }));
  // Generated null-neighbour settlements have no neighbourNetwork — add one for
  // the relationship events.
  s.neighbourNetwork = [
    { id: 'nbr.stonehaven', name: 'Stonehaven', relationshipType: 'neutral' },
    { id: 'nbr.irontown', name: 'Irontown', relationshipType: 'trade_partner' },
  ];
  // NPC fixtures: [0] corrupt + same faction as [1] (EXPOSE + swap peer),
  // [1] same faction distinct standing (PROMOTE/DEMOTE swap), [2] clean (IMPOSE).
  if (s.npcs?.[0]) { s.npcs[0].importance = 'background'; s.npcs[0].influence = 10; s.npcs[0].structuralRank = 8; s.npcs[0].corrupt = true; s.npcs[0].corruptionVector = 'greed'; s.npcs[0].factionAffiliation = 'Town Council'; }
  if (s.npcs?.[1]) { s.npcs[1].importance = 'notable'; s.npcs[1].influence = 45; s.npcs[1].structuralRank = 2; s.npcs[1].factionAffiliation = 'Town Council'; }
  if (s.npcs?.[2]) { s.npcs[2].corrupt = false; }
  return normalizeForUndo(JSON.parse(JSON.stringify(s)));
}

/** absent ≡ empty array ≡ empty object ≡ null. Preserves non-empty differences. */
function prune(x) {
  if (Array.isArray(x)) return x.map(prune);
  if (x && typeof x === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(x)) {
      const pv = prune(v);
      const empty = pv == null
        || (Array.isArray(pv) && pv.length === 0)
        || (typeof pv === 'object' && !Array.isArray(pv) && Object.keys(pv).length === 0);
      if (!empty) out[k] = pv;
    }
    return out;
  }
  return x;
}

/** Faithful reproduction of settlementSlice.undoLastEvent (settlement object). */
function applyThenUndo(before, event) {
  const undo = captureEventUndoSnapshot(before, event);
  const after = mutateSettlement({ settlement: before, event, now: NOW });
  const strip = stripImpairmentsForEvent(event.id);
  let undone = { ...after };
  if (undone.institutions) undone.institutions = undone.institutions.map(strip);
  if (undone.factions) undone.factions = undone.factions.map(strip);
  if (undone.npcs) undone.npcs = undone.npcs.map(strip);
  if (undone.powerStructure?.factions) {
    undone.powerStructure = { ...undone.powerStructure, factions: undone.powerStructure.factions.map(strip) };
  }
  undone = scrubUndoneEvent(undone, { event, undo });
  return { after, undone };
}

const ev = (type, over = {}) => ({ id: `rt_${type}`, type, targetId: '', payload: {}, cause: 'player_action', ...over });
const firstNonGov = (s) => (s.powerStructure?.factions || []).find((f) => !f.isGoverning) || s.powerStructure.factions[1];

// type -> (base) => { before, event }. Inverse events (RESTORE/RECOVERED/
// RESOLVE/REMOVED_THREAT) prep `before` by first applying their forward event.
const FIXTURES = {
  ADD_INSTITUTION: (s) => ({ before: s, event: ev('ADD_INSTITUTION', { targetId: 'Thieves Guild' }) }),
  REMOVE_INSTITUTION: (s) => ({ before: s, event: ev('REMOVE_INSTITUTION', { targetId: s.institutions[0].name }) }),
  DAMAGE_INSTITUTION: (s) => ({ before: s, event: ev('DAMAGE_INSTITUTION', { targetId: s.institutions[0].name, payload: { severity: 0.7 } }) }),
  IMPAIR_INSTITUTION: (s) => ({ before: s, event: ev('IMPAIR_INSTITUTION', { targetId: s.institutions[0].name, payload: { dimension: 'capacity', severity: 0.5 } }) }),
  RESTORE_INSTITUTION: (s) => {
    const before = mutateSettlement({ settlement: s, event: ev('DAMAGE_INSTITUTION', { id: 'pre_dmg', targetId: s.institutions[0].name, payload: { severity: 0.6 } }), now: NOW });
    return { before, event: ev('RESTORE_INSTITUTION', { targetId: before.institutions[0].name, payload: { causeEventId: 'pre_dmg' } }) };
  },
  DEPLETE_RESOURCE: (s) => ({ before: s, event: ev('DEPLETE_RESOURCE', { targetId: s.config.nearbyResources[0] }) }),
  RECOVERED_RESOURCE: (s) => {
    const before = mutateSettlement({ settlement: s, event: ev('DEPLETE_RESOURCE', { id: 'pre_dep', targetId: s.config.nearbyResources[0] }), now: NOW });
    return { before, event: ev('RECOVERED_RESOURCE', { targetId: s.config.nearbyResources[0], payload: { severity: 0.7 } }) };
  },
  ADD_RESOURCE: (s) => ({ before: s, event: ev('ADD_RESOURCE', { targetId: 'sky_iron', payload: { label: 'Sky Iron' } }) }),
  REMOVE_RESOURCE: (s) => ({ before: s, event: ev('REMOVE_RESOURCE', { targetId: s.config.nearbyResources[0] }) }),
  CUT_TRADE_ROUTE: (s) => ({ before: s, event: ev('CUT_TRADE_ROUTE', { targetId: 'river road' }) }),
  ADD_NPC: (s) => ({ before: s, event: ev('ADD_NPC', { targetId: 'Brenna the Fence', payload: { role: 'Fence', importance: 'notable' } }) }),
  KILL_NPC: (s) => ({ before: s, event: ev('KILL_NPC', { targetId: s.npcs[0].id }) }),
  ASSIGN_NPC_TO_ROLE: (s) => ({ before: s, event: ev('ASSIGN_NPC_TO_ROLE', { targetId: s.npcs[0].id, payload: { role: 'Steward', quality: 'competent' } }) }),
  IMPAIR_FACTION: (s) => ({ before: s, event: ev('IMPAIR_FACTION', { targetId: firstNonGov(s).faction, payload: { dimension: 'public_support', severity: 0.5 } }) }),
  RESTORE_FACTION: (s) => {
    const before = mutateSettlement({ settlement: s, event: ev('IMPAIR_FACTION', { id: 'pre_impf', targetId: firstNonGov(s).faction, payload: { dimension: 'public_support', severity: 0.5 } }), now: NOW });
    return { before, event: ev('RESTORE_FACTION', { targetId: firstNonGov(s).faction, payload: { causeEventId: 'pre_impf' } }) };
  },
  ADD_FACTION: (s) => ({ before: s, event: ev('ADD_FACTION', { targetId: 'Dockworkers Guild' }) }),
  KILL_LEADER: (s) => ({ before: s, event: ev('KILL_LEADER', { targetId: s.npcs[0].id }) }),
  EXPOSE_CORRUPTION: (s) => ({ before: s, event: ev('EXPOSE_CORRUPTION', { targetId: s.npcs[0].id, payload: { severity: 0.7 } }) }),
  IMPOSE_CORRUPTION: (s) => ({ before: s, event: ev('IMPOSE_CORRUPTION', { targetId: s.npcs[2].id }) }),
  REFUGEE_WAVE: (s) => ({ before: s, event: ev('REFUGEE_WAVE', { targetId: 'eastern border', payload: { size: 'medium' } }) }),
  PLAGUE: (s) => ({ before: s, event: ev('PLAGUE', { targetId: 'Red Cough', payload: { severity: 0.6 } }) }),
  RAID_OR_MONSTER_ATTACK: (s) => ({ before: s, event: ev('RAID_OR_MONSTER_ATTACK', { targetId: 'frost trolls', payload: { severity: 0.6 } }) }),
  REMOVED_THREAT: (s) => {
    const before = mutateSettlement({ settlement: s, event: ev('APPLY_STRESSOR', { id: 'pre_str', targetId: 'Bandit Raids', payload: { severity: 0.6 } }), now: NOW });
    return { before, event: ev('REMOVED_THREAT', { targetId: 'Bandit Raids', payload: { severity: 0.6 } }) };
  },
  BROKERED_ALLIANCE: (s) => ({ before: s, event: ev('BROKERED_ALLIANCE', { targetId: 'Stonehaven' }) }),
  SETTLEMENT_DISPUTE: (s) => ({ before: s, event: ev('SETTLEMENT_DISPUTE', { targetId: 'Stonehaven', payload: { relationshipType: 'hostile' } }) }),
  STARTED_RIOT: (s) => ({ before: s, event: ev('STARTED_RIOT', { targetId: 'Lower Quarter', payload: { severity: 0.6 } }) }),
  OPENED_TRADE_ROUTE: (s) => ({ before: s, event: ev('OPENED_TRADE_ROUTE', { targetId: 'Stonehaven', payload: { relationshipType: 'trade_partner' } }) }),
  DESTROY_SETTLEMENT: (s) => ({ before: s, event: ev('DESTROY_SETTLEMENT', { targetId: 'dragon fire' }) }),
  APPLY_STRESSOR: (s) => ({ before: s, event: ev('APPLY_STRESSOR', { targetId: 'Famine', payload: { severity: 0.6 } }) }),
  CHANGE_RULING_POWER: (s) => ({ before: s, event: ev('CHANGE_RULING_POWER', { targetId: firstNonGov(s).faction, payload: { cause: 'coup' } }) }),
  RESOLVE_STRESSOR: (s) => {
    const before = mutateSettlement({ settlement: s, event: ev('APPLY_STRESSOR', { id: 'pre_str', targetId: 'Famine', payload: { severity: 0.6 } }), now: NOW });
    return { before, event: ev('RESOLVE_STRESSOR', { targetId: 'Famine' }) };
  },
  ADD_TRADE_GOOD: (s) => ({ before: s, event: ev('ADD_TRADE_GOOD', { targetId: 'Salted Fish', payload: { direction: 'export' } }) }),
  REMOVE_TRADE_GOOD: (s) => ({ before: s, event: ev('REMOVE_TRADE_GOOD', { targetId: (s.economicState.primaryExports || [])[0] }) }),
  PROMOTE_NPC: (s) => ({ before: s, event: ev('PROMOTE_NPC', { targetId: s.npcs[0].id, payload: { swapWithNpcId: s.npcs[1].id } }) }),
  DEMOTE_NPC: (s) => ({ before: s, event: ev('DEMOTE_NPC', { targetId: s.npcs[0].id, payload: { swapWithNpcId: s.npcs[1].id } }) }),
  // Feature D / R1: assigning a primary deity onto a deity-free settlement must
  // undo to exactly the dormant pre-event state (both config keys removed).
  SET_PRIMARY_DEITY: (s) => ({ before: s, event: ev('SET_PRIMARY_DEITY', { targetId: 'custom:lu_vael', payload: { deityRef: 'custom:lu_vael', snapshot: { name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'war' } } }) }),
  // Imposing a cult onto a cult-free settlement must undo to exactly the prior
  // state (config.cultDeitySnapshots removed). The deity sits in its own niche
  // (peaceful:good ≠ any patron the base settlement carries) so it seats cleanly.
  IMPOSE_CULT: (s) => ({ before: s, event: ev('IMPOSE_CULT', { targetId: 'custom:lu_sael', payload: { deityRef: 'custom:lu_sael', snapshot: { name: 'Sael', alignmentAxis: 'good', temperamentAxis: 'peaceful', rankAxis: 'cult', domain: 'harvest' } } }) }),
  // A forced tier DEMOTION (the base is a city → town) rebands population and deactivates
  // the city-only institutions into ruined remnants + appends tier/institution history;
  // undo restores tier, config.tier/settType, population, and the full institution roster
  // + history exactly from the pre-event snapshot (none of it provenance-reversible).
  SHIFT_TIER: (s) => ({ before: s, event: ev('SHIFT_TIER', { payload: { direction: 'demotion' } }) }),
};

// Documented residue: undoing a RESOLVE_STRESSOR does not resurrect the LIVE
// stress entry (it routes through the crisis lifecycle, which restores the
// stressorEdits record so the entry returns on the next regeneration —
// tests/joins/crisisTripleSync.test.js pins this). Everything else round-trips.
const STRESS_CONTAINERS = ['stress', 'stressors', 'stresses'];
const RESIDUE = {
  RESOLVE_STRESSOR: (obj) => {
    const c = { ...obj };
    for (const k of STRESS_CONTAINERS) delete c[k];
    return c;
  },
};

describe('undo is a whole-object inverse across the full EVENT_REGISTRY (A+ domain.5)', () => {
  it('every registry event type has a fixture (a new event without one fails loudly)', () => {
    expect(Object.keys(FIXTURES).sort()).toEqual(Object.keys(EVENT_REGISTRY).sort());
  });

  for (const type of Object.keys(EVENT_REGISTRY)) {
    it(`${type}: apply mutates the settlement, then undo restores it exactly`, () => {
      const builder = FIXTURES[type];
      expect(builder, `no fixture for ${type}`).toBeTruthy();
      const { before, event } = builder(baseSettlement());
      const beforeJSON = JSON.stringify(before);

      const { after, undone } = applyThenUndo(before, event);

      // Teeth: the event must actually mutate the settlement object, or the
      // round-trip below is vacuous.
      expect(JSON.stringify(after), `${type} did not mutate the settlement`).not.toBe(beforeJSON);

      // Whole-object inverse (absent ≡ empty ≡ null via prune).
      let pb = prune(before);
      let pu = prune(undone);
      if (RESIDUE[type]) { pb = RESIDUE[type](pb); pu = RESIDUE[type](pu); }
      expect(pu).toEqual(pb);
    });
  }

  // Pin the one documented residue explicitly so it can't silently widen: after
  // undoing RESOLVE_STRESSOR the live stress entry is gone, but the stressorEdits
  // record is restored (the regeneration path that brings it back).
  it('RESOLVE_STRESSOR residue is exactly the live stress entry (stressorEdits restored)', () => {
    const { before, event } = FIXTURES.RESOLVE_STRESSOR(baseSettlement());
    const { undone } = applyThenUndo(before, event);
    const liveEntries = (u) => STRESS_CONTAINERS.flatMap((k) => Array.isArray(u[k]) ? u[k] : []);
    // before carried the applied 'famine' stressor; undone does not resurrect it.
    expect(liveEntries(before).length).toBeGreaterThan(0);
    expect(liveEntries(undone).length).toBe(0);
    // …but the authored record that regeneration reads IS restored.
    expect(undone.config?.stressorEdits).toEqual(before.config?.stressorEdits);
  });
});
