/**
 * domain/events/mutate.js — Apply an event's entity patches to a
 * settlement object.
 *
 * The architecture fix the audit kept flagging: events must mutate
 * entities, not just SystemState. This module is where that wiring
 * lives. Given an event + the current settlement, it returns:
 *
 *   - mutated settlement (with status flips, impairments, NPC patches)
 *   - propagation chains computed and applied
 *   - removed/created/replaced npc records
 *
 * Pure function — no store, no React, no I/O. The store calls into
 * this from `applyEvent` and persists the result.
 */

import {
  STATUS_REMOVED,
  withImpairment, withoutEventImpairments,
} from '../entities/status.js';
import { propagateImpairment } from '../entities/propagate.js';
import { createNpc, killNpc, assignNpcToRole, inferImportance } from '../entities/npcs.js';
import { applyCorruptionImpairments } from '../worldPulse/corruptionImpair.js';
import { successorNpc } from '../worldPulse/successorNpc.js';
import { createPRNG } from '../../generators/prng.js';

/** @typedef {import('../types.js').Event} Event */

/**
 * Apply an event's patches to the settlement. Returns a new settlement
 * (never mutates input). The function understands every event type
 * shipped in the registry; unknown types are no-ops on the settlement
 * (state-only events still land via applyEvent's state-delta path).
 *
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {Event} args.event
 * @param {string} [args.now] deterministic ISO timestamp for replay/tests
 * @returns {Object} mutated settlement
 */
export function mutateSettlement({ settlement, event, now = null }) {
  if (!settlement || !event) return settlement;
  const timedEvent = /** @type {any} */ (event);
  const timestamp = timedEvent.timestamp || timedEvent.createdAt || now || new Date().toISOString();
  const stampedEvent = timedEvent.timestamp ? timedEvent : { ...event, timestamp };
  let next = { ...settlement };

  switch (stampedEvent.type) {
    case 'DESTROY_SETTLEMENT':
      next = destroySettlement(next, stampedEvent);
      break;
    case 'DAMAGE_INSTITUTION':
      next = damageInstitution(next, stampedEvent);
      break;
    case 'REMOVE_INSTITUTION':
      next = removeInstitution(next, stampedEvent);
      break;
    case 'ADD_INSTITUTION':
      next = addInstitution(next, stampedEvent);
      break;
    case 'DEPLETE_RESOURCE':
      next = depleteResource(next, stampedEvent);
      break;
    case 'CUT_TRADE_ROUTE':
      next = cutTradeRoute(next, stampedEvent);
      break;
    case 'SETTLEMENT_DISPUTE':
    case 'BROKERED_ALLIANCE':
    case 'OPENED_TRADE_ROUTE':
      next = setNeighbourRelationship(next, stampedEvent);
      break;

    case 'ADD_NPC':
      next = addNpc(next, stampedEvent);
      break;
    case 'KILL_NPC':
      next = killNpcMutation(next, stampedEvent);
      break;
    case 'ASSIGN_NPC_TO_ROLE':
      next = assignNpcMutation(next, stampedEvent);
      break;

    case 'IMPAIR_INSTITUTION':
      next = impairInstitution(next, stampedEvent);
      break;
    case 'RESTORE_INSTITUTION':
      next = restoreInstitution(next, stampedEvent);
      break;
    case 'IMPAIR_FACTION':
      next = impairFaction(next, stampedEvent);
      break;
    case 'RESTORE_FACTION':
      next = restoreFaction(next, stampedEvent);
      break;
    case 'ADD_FACTION':
      next = addFaction(next, stampedEvent);
      break;

    // Wave 1 extended events. Each is implemented by reusing primitives:
    // KILL_LEADER is a KILL_NPC with importance forced to 'pillar';
    // EXPOSE_CORRUPTION applies a legitimacy impairment to the target
    // (faction or institution) and propagates; the population-shifting
    // events (REFUGEE_WAVE, PLAGUE) record themselves as settlement-
    // level annotations the engine can consult during reruns; RAID
    // optionally damages an institution if specified.

    case 'KILL_LEADER':
      next = killLeaderMutation(next, stampedEvent);
      break;
    case 'EXPOSE_CORRUPTION':
      next = exposeCorruption(next, stampedEvent);
      break;
    case 'REFUGEE_WAVE':
      next = refugeeWave(next, stampedEvent);
      break;
    case 'PLAGUE':
      next = plague(next, stampedEvent);
      break;
    case 'RAID_OR_MONSTER_ATTACK':
      next = raidOrMonsterAttack(next, stampedEvent);
      break;

    default:
      // Unknown event type — no entity mutation. SystemState delta still
      // applies through applyEvent's normal path.
      break;
  }
  return next;
}

// ── Institution mutations ──────────────────────────────────────────────────

function destroySettlement(s, event) {
  return {
    ...s,
    status: 'destroyed',
    destroyedAt: eventTime(event),
    destroyedByEventId: event.id,
    destroyedCause: event.targetId || event.payload?.cause || null,
    config: {
      ...(s.config || {}),
      _destroyed: true,
      _destroyedByEventId: event.id,
    },
  };
}

function damageInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return s;
  const severity = Number(event.payload?.severity ?? 0.7);
  const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
    type: 'capacity',
    severity,
    causeEventId: event.id,
    description: event.description || `Damaged: ${inst.name}`,
  });
  let next = replaceInstitution(s, inst, withImpairment(inst, impairment));
  next = propagateImpairment({
    settlement: next,
    origin: { entityType: 'institution', entityId: idOf(inst), impairment },
  });
  return next;
}

function removeInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return s;
  const removed = { ...inst, status: STATUS_REMOVED, removedByEventId: event.id };
  let next = replaceInstitution(s, inst, removed);
  // Removal propagates the strongest possible impairment to linked
  // factions: full loss of whatever this institution was contributing.
  next = propagateImpairment({
    settlement: next,
    origin: {
      entityType: 'institution',
      entityId: idOf(inst),
      impairment: {
        type: 'capacity',
        severity: 1.0,
        causeEventId: event.id,
        description: `${inst.name} closed entirely.`,
      },
    },
  });
  // §corruption Phase 4 — closing a criminal institution frees the NPCs tied to it.
  next = severCorruptionTiesTo(next, inst.name);
  return next;
}

function addInstitution(s, event) {
  const name = labelFromTarget(event.targetId);
  const list = s.institutions || [];
  // Idempotent: if an institution with the same name already exists,
  // we don't duplicate — we just clear any prior REMOVED status.
  const existing = list.find(i => i.name?.toLowerCase() === name.toLowerCase());
  if (existing) {
    const restored = { ...existing, status: 'active', impairments: [] };
    return replaceInstitution(s, existing, restored);
  }
  const newInst = {
    id: `institution.${slugify(name)}`,
    name,
    category: event.payload?.category || 'civic',
    status: 'active',
    description: event.description || '',
    plotHooks: [],
  };
  return { ...s, institutions: [...list, newInst] };
}

function impairInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return s;
  const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
    type: event.payload?.dimension || 'capacity',
    severity: Number(event.payload?.severity ?? 0.5),
    causeEventId: event.id,
    description: event.description || `Impairment: ${event.payload?.dimension || 'capacity'}`,
  });
  let next = replaceInstitution(s, inst, withImpairment(inst, impairment));
  next = propagateImpairment({
    settlement: next,
    origin: { entityType: 'institution', entityId: idOf(inst), impairment },
  });
  return next;
}

function restoreInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return s;
  // If the user supplied a specific cause event id, remove only those
  // impairments. Otherwise clear all impairments — full reset.
  const causeId = event.payload?.causeEventId;
  const restored = causeId
    ? withoutEventImpairments(inst, causeId)
    : { ...inst, impairments: [], status: 'active' };
  return replaceInstitution(s, inst, restored);
}

// ── Faction mutations ──────────────────────────────────────────────────────

function impairFaction(s, event) {
  const faction = findFaction(s, event.targetId);
  if (!faction) return s;
  const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
    type: event.payload?.dimension || 'public_support',
    severity: Number(event.payload?.severity ?? 0.5),
    causeEventId: event.id,
    description: event.description || `Faction setback: ${event.payload?.dimension || 'public_support'}`,
  });
  let next = replaceFaction(s, faction, withImpairment(faction, impairment));
  next = propagateImpairment({
    settlement: next,
    origin: { entityType: 'faction', entityId: factionIdOf(faction), impairment },
  });
  return next;
}

function restoreFaction(s, event) {
  const faction = findFaction(s, event.targetId);
  if (!faction) return s;
  const causeId = event.payload?.causeEventId;
  const restored = causeId
    ? withoutEventImpairments(faction, causeId)
    : { ...faction, impairments: [], status: 'active' };
  return replaceFaction(s, faction, restored);
}

/**
 * ADD_FACTION — introduce a new faction. Mirrors addInstitution: idempotent
 * by name (re-adding an existing faction just clears removed/impaired state),
 * and writes to powerStructure.factions (the canonical location) so the
 * power-structure rerun and seat logic see it.
 */
function addFaction(s, event) {
  const name = labelFromTarget(event.targetId) || event.payload?.name;
  if (!name) return s;
  const psFactions = s.powerStructure?.factions;
  const flatFactions = s.factions;
  const list = psFactions || flatFactions || [];
  const existing = list.find(
    f => String(f.name || f.faction || '').toLowerCase() === name.toLowerCase(),
  );
  if (existing) {
    return replaceFaction(s, existing, { ...existing, status: 'active', impairments: [] });
  }
  const newFaction = {
    id: `faction.${slugify(name)}`,
    name,
    faction: name,
    status: 'active',
    description: event.description || '',
    impairments: [],
    internalSeats: {},
    memberNpcIds: [],
  };
  if (psFactions) {
    return { ...s, powerStructure: { ...s.powerStructure, factions: [...psFactions, newFaction] } };
  }
  if (flatFactions) {
    return { ...s, factions: [...flatFactions, newFaction] };
  }
  return { ...s, powerStructure: { ...(s.powerStructure || {}), factions: [newFaction] } };
}

// ── Resource / route mutations ─────────────────────────────────────────────

function depleteResource(s, event) {
  const name = labelFromTarget(event.targetId);
  const config = s.config || {};
  const state = config.nearbyResourcesState || {};
  return {
    ...s,
    config: {
      ...config,
      nearbyResourcesState: { ...state, [name]: 'depleted' },
    },
  };
}

// §9b/§9g/§9h — relationship events set the matched neighbour's
// relationshipType on this settlement's neighbourNetwork. Brokered Alliance
// fixes it to 'allied'; Settlement Dispute / Opened Trade Route use the chosen
// payload type. The change is recorded for world-engine propagation; the
// reciprocal neighbour link is reconciled by the regional graph that already
// ingests neighbourNetwork. No-op when the named neighbour isn't linked.
const ALLIANCE_REL = 'allied';
function setNeighbourRelationship(s, event) {
  const targetId = event.targetId;
  if (!targetId) return s;
  const relType = event.type === 'BROKERED_ALLIANCE'
    ? ALLIANCE_REL
    : (event.payload?.relationshipType || (event.type === 'SETTLEMENT_DISPUTE' ? 'rival' : 'trade_partners'));
  const network = Array.isArray(s.neighbourNetwork) ? s.neighbourNetwork : [];
  let touched = false;
  const next = network.map((link) => {
    const matches = String(link?.name || '') === String(targetId)
      || String(link?.neighbourName || '') === String(targetId)
      || String(link?.id || '') === String(targetId)
      || String(link?.linkId || '') === String(targetId);
    if (!matches) return link;
    touched = true;
    return { ...link, relationshipType: relType, displayRelationshipType: relType, _relationshipEventId: event.id };
  });
  if (!touched) return s;
  return { ...s, neighbourNetwork: next };
}

function cutTradeRoute(s, event) {
  // Mark the trade route status on settlement.config — coarse but
  // sufficient until the full campaign-graph route model lands.
  const config = s.config || {};
  const cutRoutes = Array.isArray(config._cutRoutes) ? [...config._cutRoutes] : [];
  const which = event.targetId || 'primary';
  cutRoutes.push({ name: which, atEventId: event.id, atTimestamp: eventTime(event) });
  return {
    ...s,
    config: { ...config, _cutRoutes: cutRoutes },
  };
}

// ── NPC mutations ──────────────────────────────────────────────────────────

function addNpc(s, event) {
  const npc = createNpc({
    name: labelFromTarget(event.targetId) || event.payload?.name,
    role: event.payload?.role,
    importance: event.payload?.importance || 'notable',
    linkedInstitutionIds: event.payload?.linkedInstitutionIds || [],
    linkedFactionIds:     event.payload?.linkedFactionIds || [],
    influence:            event.payload?.influence,
    legitimacyContribution: event.payload?.legitimacyContribution,
  });
  return { ...s, npcs: [...(s.npcs || []), npc] };
}

function killNpcMutation(s, event) {
  const npc = findNpc(s, event.targetId);
  if (!npc) return s;
  const importance = event.payload?.importance || npc.importance || inferImportance(npc);
  const enriched = { ...npc, importance };
  const result = killNpc(enriched, event.id);
  let next = replaceNpc(s, npc, result.npc);

  // Apply the structural impairments to linked institutions and factions.
  for (const { instId, impairment } of result.institutionImpairments) {
    const inst = findInstitution(next, instId);
    if (inst) next = replaceInstitution(next, inst, withImpairment(inst, impairment));
  }
  for (const { factionId: fid, impairment } of result.factionImpairments) {
    const faction = findFaction(next, fid);
    if (faction) next = replaceFaction(next, faction, withImpairment(faction, impairment));
  }

  // Propagate from the NPC origin so faction/institution impairments
  // also reach their own neighbors (institution → other linked factions).
  next = propagateImpairment({
    settlement: next,
    origin: {
      entityType: 'npc',
      entityId: idOf(npc),
      impairment: {
        type: 'staffing',  // arbitrary — propagation maps it per target
        severity: importance === 'pillar' ? 1.0 : importance === 'key' ? 0.7 : 0.4,
        causeEventId: event.id,
        description: `Death of ${npc.name}`,
      },
    },
  });
  return next;
}

function assignNpcMutation(s, event) {
  const npc = findNpc(s, event.targetId) || createNpc({ name: labelFromTarget(event.targetId) });
  const institutionId = event.payload?.institutionId;
  const inst = institutionId ? findInstitution(s, institutionId) : null;
  const result = assignNpcToRole({
    npc,
    institutionId: institutionId || (inst ? idOf(inst) : null),
    role: event.payload?.role,
    quality: event.payload?.quality || 'competent',
    factionAlignment: event.payload?.factionAlignment,
    importance: event.payload?.importance,
    influence: event.payload?.influence,
    eventId: event.id,
  });
  // Replace or insert the NPC record
  const list = s.npcs || [];
  const idx = list.findIndex(n => idOf(n) === idOf(npc));
  let next = idx >= 0
    ? { ...s, npcs: [...list.slice(0, idx), result.npc, ...list.slice(idx + 1)] }
    : { ...s, npcs: [...list, result.npc] };

  // Restore staffing impairments on the institution caused by prior
  // KILL_NPC events. Capacity-recovery factor scales by quality.
  if (institutionId) {
    const targetInst = findInstitution(next, institutionId);
    if (targetInst) {
      // Walk back any impairments whose causeEventId was a KILL_NPC
      // for an NPC that linked to this institution. v1 simplification:
      // remove all staffing impairments and apply the new restorations.
      const cleared = {
        ...targetInst,
        impairments: (targetInst.impairments || [])
          .filter(i => i.type !== 'staffing'),
      };
      let withCleared = replaceInstitution(next, targetInst, cleared);
      for (const { impairment } of result.restorations) {
        const t = findInstitution(withCleared, institutionId);
        if (t) withCleared = replaceInstitution(withCleared, t, withImpairment(t, /** @type {import('../entities/status.js').Impairment} */ (impairment)));
      }
      next = withCleared;
    }
  }
  return next;
}

// ── Wave 1 extended event handlers ─────────────────────────────────────────

/**
 * KILL_LEADER — kill the named NPC at pillar importance regardless of
 * what the NPC record says. The "leader" framing is a contract: the
 * settlement's primary authority is gone, with all the consequences
 * that entails. Reuses killNpcMutation under the hood.
 */
function killLeaderMutation(s, event) {
  const enrichedEvent = {
    ...event,
    payload: { ...(event.payload || {}), importance: 'pillar' },
  };
  return killNpcMutation(s, enrichedEvent);
}

/**
 * EXPOSE_CORRUPTION — applies a legitimacy impairment to the target
 * (faction OR institution; we try both). Propagates so a corrupt watch
 * captain hits both the watch institution and the controlling faction.
 */
function exposeCorruption(s, event) {
  // §corruption Phase 4 — prefer a corrupt NPC target: clean + scar them and
  // impair BOTH the tied criminal institution and their home institution/faction
  // (the same path organic exposure uses). Falls back to faction/institution.
  const npc = findNpc(s, event.targetId);
  if (npc && npc.corrupt) return exposeCorruptNpc(s, npc, event);

  const severity = Number(event.payload?.severity ?? 0.7);
  const inst    = findInstitution(s, event.targetId);
  const faction = findFaction(s, event.targetId);
  const target  = inst || faction;
  if (!target) return s;

  const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
    type: 'legitimacy',
    severity,
    causeEventId: event.id,
    description: event.description || `Corruption inside ${target.name} was exposed publicly.`,
  });

  if (inst) {
    let next = replaceInstitution(s, inst, withImpairment(inst, impairment));
    next = propagateImpairment({
      settlement: next,
      origin: { entityType: 'institution', entityId: idOf(inst), impairment },
    });
    return next;
  }

  // Faction case
  let next = replaceFaction(s, faction, withImpairment(faction, impairment));
  next = propagateImpairment({
    settlement: next,
    origin: { entityType: 'faction', entityId: factionIdOf(faction), impairment },
  });
  return next;
}

// §corruption Phase 4 + 1b-ii-c — DM exposes a specific corrupt NPC: impair the
// tied criminal + home institution/faction (shared organic path), then remove the
// disgraced NPC and install a fresh successor in their seat.
function exposeCorruptNpc(s, npc, event) {
  const now = event.timestamp || event.createdAt || null;
  const exposure = {
    npcId: npc.id || npc.name,
    name: npc.name,
    kind: 'ousted',
    criminalInstitution: npc.corruptTies?.criminalInstitution || null,
    homeInstitution: npc.factionAffiliation || npc.factionLink || null,
  };
  const next = applyCorruptionImpairments(s, [exposure], { now });
  const rng = createPRNG(`successor:${event.id}:${String(npc.name || '').toLowerCase()}`);
  const nextNpcs = (next.npcs || []).map((n) => (n === npc ? successorNpc(n, rng) : n));
  return { ...next, npcs: nextNpcs };
}

// §corruption Phase 4 — removing/destroying a criminal institution severs the
// corruption ties of NPCs bound to it: they separate from criminal activity.
// No-op for a non-criminal institution (no NPC names it as a tie).
function severCorruptionTiesTo(s, institutionName) {
  const n = String(institutionName || '').toLowerCase();
  if (!n) return s;
  let changed = false;
  const nextNpcs = (s.npcs || []).map((npc) => {
    if (npc.corrupt && String(npc.corruptTies?.criminalInstitution || '').toLowerCase() === n) {
      changed = true;
      return { ...npc, corrupt: false, corruptionVector: null, ousted: true };
    }
    return npc;
  });
  return changed ? { ...s, npcs: nextNpcs } : s;
}

/**
 * REFUGEE_WAVE — population shift annotation. Records the wave on the
 * settlement so downstream pipeline reruns and the foodSecurity model
 * can consume it. Coarse for v1; future versions will derive specific
 * institution strain from the wave size.
 */
function refugeeWave(s, event) {
  const config = s.config || {};
  const waves = Array.isArray(config._refugeeWaves) ? [...config._refugeeWaves] : [];
  waves.push({
    size: event.payload?.size || 'medium',
    fromRegion: event.targetId || null,
    atEventId: event.id,
    atTimestamp: eventTime(event),
  });
  return { ...s, config: { ...config, _refugeeWaves: waves } };
}

/**
 * PLAGUE — disease outbreak annotation. Records severity, optionally a
 * disease name. Strains healing institutions (capacity impairment),
 * propagates through faction links so the watch and temple respond.
 */
function plague(s, event) {
  const severity = Number(event.payload?.severity ?? 0.6);
  const config = s.config || {};
  const annotation = {
    name: event.targetId || 'unspecified',
    severity,
    atEventId: event.id,
    atTimestamp: eventTime(event),
  };
  let next = {
    ...s,
    config: { ...config, _activePlague: annotation },
  };
  // Apply a capacity impairment to any healing-tagged institution so
  // the simulation reflects the strain.
  const healing = (next.institutions || []).filter(i => /hospital|temple|infirm|healer/i.test(i.name || ''));
  for (const inst of healing) {
    const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
      type: 'capacity',
      severity: severity * 0.6,  // strain, not destruction
      causeEventId: event.id,
      description: `Overrun by plague casualties.`,
    });
    next = replaceInstitution(next, inst, withImpairment(inst, impairment));
    next = propagateImpairment({
      settlement: next,
      origin: { entityType: 'institution', entityId: idOf(inst), impairment },
      opts: { maxHops: 1 },  // plague strain doesn't cascade as far
    });
  }
  return next;
}

/**
 * RAID_OR_MONSTER_ATTACK — external strike. If a specific institution
 * is named in the payload, damage it; otherwise just record the raid
 * on the settlement so the next pipeline rerun consumes it.
 */
function raidOrMonsterAttack(s, event) {
  const severity = Number(event.payload?.severity ?? 0.6);
  const config = s.config || {};
  const raids = Array.isArray(config._raidHistory) ? [...config._raidHistory] : [];
  raids.push({
    source: event.targetId || 'unknown',
    severity,
    atEventId: event.id,
    atTimestamp: eventTime(event),
  });
  let next = { ...s, config: { ...config, _raidHistory: raids } };

  // Optional: damage a named institution if the payload specifies it.
  if (event.payload?.damagedInstitutionId) {
    const inst = findInstitution(next, event.payload.damagedInstitutionId);
    if (inst) {
      const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
        type: 'capacity',
        severity,
        causeEventId: event.id,
        description: `Damaged in raid: ${event.targetId || 'attack'}.`,
      });
      next = replaceInstitution(next, inst, withImpairment(inst, impairment));
      next = propagateImpairment({
        settlement: next,
        origin: { entityType: 'institution', entityId: idOf(inst), impairment },
      });
    }
  }
  return next;
}

// ── Lookups + identity helpers ─────────────────────────────────────────────

const idOf        = (i) => i?.id || i?.name || '';
const factionIdOf = (f) => f?.id || f?.faction || f?.name || '';
const eventTime = (event) => event.timestamp || event.createdAt;

function findInstitution(s, target) {
  const list = s.institutions || [];
  const t = String(target || '').toLowerCase();
  return list.find(i =>
    String(i.id || '').toLowerCase() === t ||
    String(i.name || '').toLowerCase() === t ||
    String(i.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

function findFaction(s, target) {
  const list = s.factions || s.powerStructure?.factions || [];
  const t = String(target || '').toLowerCase();
  return list.find(f =>
    String(f.id || '').toLowerCase() === t ||
    String(f.faction || '').toLowerCase() === t ||
    String(f.name || '').toLowerCase() === t ||
    String(f.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

function findNpc(s, target) {
  const list = s.npcs || [];
  const t = String(target || '').toLowerCase();
  return list.find(n =>
    String(n.id || '').toLowerCase() === t ||
    String(n.name || '').toLowerCase() === t ||
    String(n.name || '').toLowerCase() === labelFromTarget(target).toLowerCase(),
  );
}

function replaceInstitution(s, oldInst, newInst) {
  const list = s.institutions || [];
  const idx = list.findIndex(i => i === oldInst);
  if (idx === -1) return s;
  return { ...s, institutions: [...list.slice(0, idx), newInst, ...list.slice(idx + 1)] };
}

function replaceFaction(s, oldF, newF) {
  // Factions can live in two places — settlement.factions or
  // settlement.powerStructure.factions. Normalize on the latter.
  if (s.powerStructure?.factions) {
    const list = s.powerStructure.factions;
    const idx = list.findIndex(f => f === oldF);
    if (idx >= 0) {
      return {
        ...s,
        powerStructure: {
          ...s.powerStructure,
          factions: [...list.slice(0, idx), newF, ...list.slice(idx + 1)],
        },
      };
    }
  }
  if (s.factions) {
    const idx = s.factions.findIndex(f => f === oldF);
    if (idx >= 0) {
      return { ...s, factions: [...s.factions.slice(0, idx), newF, ...s.factions.slice(idx + 1)] };
    }
  }
  return s;
}

function replaceNpc(s, oldN, newN) {
  const list = s.npcs || [];
  const idx = list.findIndex(n => n === oldN);
  if (idx === -1) return s;
  return { ...s, npcs: [...list.slice(0, idx), newN, ...list.slice(idx + 1)] };
}

function labelFromTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return tail.replace(/_/g, ' ');
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
