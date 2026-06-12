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
import { withActiveCondition, withoutActiveCondition, withEventConditionsSynced } from '../activeConditions.js';
import { corruptionVectorForFlaw, npcCorruptibleFlaw, readCorruptionClimate } from '../corruption.js';
import { archetypeForStressor, promoteStressorsToConditions } from '../conditionPromotion.js';
import { transferRulingPower } from '../rulingPower.js';
import { STRESSOR_CATALOG } from '../worldPulse/stressors.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';

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
    case 'RECOVERED_RESOURCE':
      next = recoveredResource(next, stampedEvent);
      break;
    case 'REMOVED_THREAT':
      next = removedThreat(next, stampedEvent);
      break;
    case 'STARTED_RIOT':
      next = startedRiot(next, stampedEvent);
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
    case 'IMPOSE_CORRUPTION':
      next = imposeCorruption(next, stampedEvent);
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

    case 'APPLY_STRESSOR':
      next = applyStressor(next, stampedEvent);
      break;
    case 'CHANGE_RULING_POWER':
      next = changeRulingPower(next, stampedEvent);
      break;

    // Editor roster wave.
    case 'RESOLVE_STRESSOR':
      next = resolveStressor(next, stampedEvent);
      break;
    case 'ADD_TRADE_GOOD':
      next = addTradeGood(next, stampedEvent);
      break;
    case 'REMOVE_TRADE_GOOD':
      next = removeTradeGood(next, stampedEvent);
      break;
    case 'ADD_RESOURCE':
      next = addResource(next, stampedEvent);
      break;
    case 'REMOVE_RESOURCE':
      next = removeResource(next, stampedEvent);
      break;
    case 'PROMOTE_NPC':
    case 'DEMOTE_NPC':
      next = swapNpcStanding(next, stampedEvent);
      break;

    default:
      // Unknown event type — no entity mutation. SystemState delta still
      // applies through applyEvent's normal path.
      break;
  }
  // One projection chokepoint for the whole switch: whatever event-sourced
  // conditions the handler promoted, wound down, or left alone, the authored
  // config.eventConditions record (dual-written to _config — the
  // customTradeGoods / resourceEdits discipline) follows. This is what lets
  // a full regeneration re-promote them instead of silently dropping them.
  return withEventConditionsSynced(next);
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

// A FOOD ANCHOR is the load-bearing food infrastructure the food_anchor_lost
// template names (granary, mill, fishery) — losing one is a settlement-level food
// crisis, not just a closed shop. Sawmills/lumber mills cut wood, not flour.
function isFoodAnchorInstitution(inst) {
  const n = String(inst?.name || '').toLowerCase();
  if (!n) return false;
  // 'fisher|fishing' catches Fisher's landing + Fishing community (production)
  // without matching Fish market / Fishmonger (retail — losing a shop is not a
  // settlement-level food crisis).
  if (/(granar|fisher|fishing|silo)/.test(n)) return true;
  return n.includes('mill') && !n.includes('sawmill') && !n.includes('lumber');
}

// Promote the food_anchor_lost condition when a food anchor is destroyed or
// crippled. These archetypes had rich consumers (capacity, causal, daily life,
// districts, threats) but NO producer — destroying the granary updated faction
// edges yet never raised the food crisis those consumers were waiting for.
function withFoodAnchorLostIfAnchor(next, inst, event, severity) {
  if (!isFoodAnchorInstitution(inst)) return next;
  // Outright REMOVAL is the ceiling (0.8); damage/impairment clamps strictly below
  // it (0.5..0.75) so a badly burned granary can never read as a WORSE food crisis
  // than a granary that no longer exists.
  const sev = event.type === 'REMOVE_INSTITUTION'
    ? 0.8
    : Math.max(0.5, Math.min(0.75, severity));
  return withActiveCondition(next, {
    archetype: 'food_anchor_lost',
    severity: sev,
    triggeredAt: { sourceEventType: event.type, sourceEventTargetId: idOf(inst) },
    causes: [{ source: 'event', eventId: event.id, detail: `${inst.name} is out of action — the settlement's food supply lost an anchor.` }],
  });
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
  if (severity >= 0.6) next = withFoodAnchorLostIfAnchor(next, inst, event, severity);
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
  // Losing a food anchor entirely is the canonical food_anchor_lost crisis.
  next = withFoodAnchorLostIfAnchor(next, inst, event, 0.7);
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
  // Only a PHYSICAL (capacity) impairment can break a food anchor — a legitimacy
  // scandal at the mill doesn't stop the grindstones.
  if (impairment.severity >= 0.6 && impairment.type === 'capacity') {
    next = withFoodAnchorLostIfAnchor(next, inst, event, impairment.severity);
  }
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

/**
 * Resolve an event target against the resource roster, returning the key
 * form the roster actually holds. Catalog entries live in
 * config.nearbyResources as underscore keys, so the slug is canonical for
 * them; CUSTOM resources are stored VERBATIM ('Moonpetal grove' — the
 * resolveResources / addResource convention), and every consumer (economy
 * chains, food, resource pressure, the dossier) compares depletion against
 * that verbatim name. An unconditional slugify wrote 'moonpetal_grove' for a
 * custom node, a key no reader matched — depleting a custom resource was
 * invisible. Verbatim match wins, then a slug-equivalent roster entry, then
 * the slug itself (catalog fallback).
 */
function resolveRosterKey(config, raw) {
  const slug = slugify(raw);
  const nearby = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
  const custom = Array.isArray(config.nearbyResourcesCustom) ? config.nearbyResourcesCustom : [];
  const rosterMatch = nearby.includes(raw) || custom.includes(raw)
    ? raw
    : (slug ? [...nearby, ...custom].find(k => slugify(k) === slug) : undefined);
  return rosterMatch || slug;
}

// Slug-equivalent key comparison — the same tolerance the handlers' live
// filters use ('moonpetal_grove' ≡ 'Moonpetal grove'). Empty slugs never match.
function slugEq(a, b) {
  if (a === b) return true;
  const sa = slugify(a);
  return !!sa && sa === slugify(b);
}

/**
 * Normalized view of config.resourceEdits — the EDITOR-authored resource
 * roster deltas the generation re-applies (resolveResources' edit overlay):
 *   { added }     [{ key, custom }] nodes opened by ADD_RESOURCE (custom →
 *                 verbatim name, re-tinted gold on regeneration);
 *   { removed }   keys struck by REMOVE_RESOURCE — a suppression list, so
 *                 removing a GENERATOR-rolled node stays gone across regens;
 *   { depleted }  keys DEPLETE_RESOURCE forces into the depleted set;
 *   { recovered } keys RECOVERED_RESOURCE forces OUT of it — without this a
 *                 same-seed regen re-rolls the original depletion right back.
 * The handlers keep the four lists mutually agreeing (an ADD clears the
 * key's removed/depleted records, a DEPLETE clears its recovered record, …).
 */
function resourceEditsOf(config) {
  const re = config?.resourceEdits || {};
  return {
    added: Array.isArray(re.added) ? re.added : [],
    removed: Array.isArray(re.removed) ? re.removed : [],
    depleted: Array.isArray(re.depleted) ? re.depleted : [],
    recovered: Array.isArray(re.recovered) ? re.recovered : [],
  };
}

/**
 * Write a resource event's two formats: the LIVE keys (nearbyResources /
 * nearbyResourcesState / nearbyResourcesDepleted / nearbyResourcesCustom —
 * the resolved snapshot every consumer reads NOW) go to config only, and the
 * authored resourceEdits delta record goes to BOTH config and _config when
 * present — withCustomTradeGoods' discipline. applyChange regenerates from
 * the raw _config first, and resolveResources re-applies the deltas there;
 * the live keys are derivation OUTPUTS (random mode re-rolls them wholesale),
 * so mirroring them would plant stale results into the raw input — the
 * deltas are the part that must survive. (resourceEdits is genuine user
 * input, deliberately NOT in settlementSlice's DERIVED_CONFIG_KEYS strip.)
 */
function withResourceEdits(s, livePatch, resourceEdits) {
  const next = { ...s, config: { ...(s.config || {}), ...livePatch, resourceEdits } };
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, resourceEdits };
  }
  return next;
}

function depleteResource(s, event) {
  const config = s.config || {};
  const raw = String(event.targetId || '').trim();
  // Write the key form the roster actually holds (resolveRosterKey) into the
  // nearbyResourcesDepleted array the economy/food generators read.
  const key = resolveRosterKey(config, raw);
  if (!key) return s;
  const state = config.nearbyResourcesState || {};
  const depleted = Array.isArray(config.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : [];
  const edits = resourceEditsOf(config);
  return withResourceEdits(s, {
    nearbyResourcesState: { ...state, [key]: 'depleted' },
    nearbyResourcesDepleted: depleted.includes(key) ? depleted : [...depleted, key],
  }, {
    ...edits,
    depleted: edits.depleted.some(k => slugEq(k, key)) ? edits.depleted : [...edits.depleted, key],
    recovered: edits.recovered.filter(k => !slugEq(k, key)),
  });
}

// RECOVERED_RESOURCE — the inverse: clear BOTH depletion formats so chains, exports,
// food, and resource pressure all see the recovery. (Previously a registry no-op: the
// depleted set was never cleared, so a recovered resource stayed depleted forever.)
function recoveredResource(s, event) {
  const config = s.config || {};
  const raw = String(event.targetId || '').trim();
  const keys = new Set([raw, slugify(raw), labelFromTarget(raw)].filter(Boolean));
  if (!keys.size) return s;
  const state = { ...(config.nearbyResourcesState || {}) };
  for (const k of keys) if (state[k] === 'depleted') state[k] = 'allow';
  const depleted = (config.nearbyResourcesDepleted || []).filter(k => !keys.has(k));
  // Recorded under the roster-resolved form — the key a regenerated roster
  // holds. Recorded even when nothing was depleted LIVE: in random mode the
  // depletion may exist only in the re-roll, and the recovered record is
  // what forces it out there.
  const key = resolveRosterKey(config, raw);
  const edits = resourceEditsOf(config);
  return withResourceEdits(s, {
    nearbyResourcesState: state,
    nearbyResourcesDepleted: depleted,
  }, {
    ...edits,
    depleted: edits.depleted.filter(k => !slugEq(k, key)),
    recovered: edits.recovered.some(k => slugEq(k, key)) ? edits.recovered : [...edits.recovered, key],
  });
}

// REMOVED_THREAT — the party neutralized an active threat. Removes the matching
// stressor from whichever container carries it (canonical `stressors`, legacy
// `stress`/`stresses`), and when the removed threat was a SIEGE promotes the
// siege_lifted recovery condition — previously a registry no-op, leaving the
// siege_lifted consumer tree (defense/food/legitimacy/trade recovery) dead.
function removedThreat(s, event) {
  const label = labelFromTarget(event.targetId).toLowerCase();
  let next = { ...s };
  let removed = null;
  for (const key of ['stressors', 'stress', 'stresses']) {
    const arr = Array.isArray(next[key]) ? next[key] : null;
    if (!arr || !label) continue;
    const idx = arr.findIndex(st => `${st?.name || ''} ${st?.type || ''}`.toLowerCase().includes(label));
    if (idx >= 0) {
      removed = arr[idx];
      next = { ...next, [key]: arr.filter((_, i) => i !== idx) };
      break;
    }
  }
  const threatText = `${removed?.name || ''} ${removed?.type || ''} ${label}`.toLowerCase();
  if (/siege/.test(threatText)) {
    next = withActiveCondition(next, {
      archetype: 'siege_lifted',
      triggeredAt: { sourceEventType: 'REMOVED_THREAT', sourceEventTargetId: event.targetId || 'siege' },
      causes: [{ source: 'event', eventId: event.id, detail: 'The siege is broken; the settlement begins to recover.' }],
    });
  }
  return next;
}

// STARTED_RIOT — durable aftermath via the generic residual archetype with an
// explicit riot framing (no new archetype invented; the provided affectedSystems
// override the residual template per deriveActiveCondition precedence).
function startedRiot(s, event) {
  const severity = Number(event.payload?.severity ?? 0.6);
  const where = event.targetId ? ` in ${labelFromTarget(event.targetId)}` : '';
  return withActiveCondition(s, {
    archetype: 'stressor_residual',
    label: 'Riot aftermath',
    description: `Public disorder${where} leaves tensions, damage, and scores to settle.`,
    severity: Math.min(0.8, 0.3 + severity * 0.5),
    status: 'easing',
    affectedSystems: ['public_legitimacy', 'social_trust', 'criminal_opportunity'],
    triggeredAt: { sourceEventType: 'STARTED_RIOT', sourceEventTargetId: event.targetId || 'riot' },
    causes: [{ source: 'event', eventId: event.id, detail: 'A riot broke out and ran its course.' }],
  });
}

// §9b/§9g/§9h — relationship events set the matched neighbour's
// relationshipType on this settlement's neighbourNetwork. Brokered Alliance
// fixes it to 'allied'; Settlement Dispute / Opened Trade Route use the chosen
// payload type. The change is recorded for world-engine propagation; the
// reciprocal neighbour link is reconciled by the regional graph that already
// ingests neighbourNetwork. No-op when the named neighbour isn't linked.
const ALLIANCE_REL = 'allied';
// H12: the canonical label is the SINGULAR 'trade_partner' — the plural this
// event historically wrote is recognized by no other subsystem (channel
// bundles minted 0 channels from it). Composer payloads still carry the
// plural, so normalize at the write chokepoint. (Kept tiny + local: the
// regional layer's canonicalRelationshipLabel covers the read side.)
const LEGACY_REL_ALIASES = { trade_partners: 'trade_partner' };
const canonicalRelType = rel => LEGACY_REL_ALIASES[String(rel || '').toLowerCase()] || rel;
function setNeighbourRelationship(s, event) {
  const targetId = event.targetId;
  if (!targetId) return s;
  const relType = event.type === 'BROKERED_ALLIANCE'
    ? ALLIANCE_REL
    : canonicalRelType(event.payload?.relationshipType || (event.type === 'SETTLEMENT_DISPUTE' ? 'rival' : 'trade_partner'));
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
  const next = { ...s, config: { ...config, _cutRoutes: cutRoutes } };
  // Mirror the annotation into the raw _config (withCustomTradeGoods'
  // discipline): applyChange regenerates from _config first, and the
  // pipeline's effectiveConfig spreads unknown keys through, so this is what
  // keeps _cutRoutes — and deriveRegionalState's read of it — alive across a
  // full regeneration.
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, _cutRoutes: cutRoutes };
  }
  // Promote to a canonical active condition so the causal substrate (which reads
  // activeConditions by affectedSystems — trade_connectivity / public_legitimacy)
  // reflects the severed route, and the effect SURVIVES
  // re-derivation and reruns instead of living only in the _cutRoutes annotation.
  // The annotation is retained because deriveRegionalState still reads it for
  // regional propagation.
  return withActiveCondition(next, {
    archetype: 'trade_route_cut',
    triggeredAt: { sourceEventType: 'CUT_TRADE_ROUTE', sourceEventTargetId: which },
    causes: [{ source: 'event', eventId: event.id, detail: `Trade route "${which}" severed.` }],
  });
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

  // The scandal becomes a durable condition: corruption_exposed is read by
  // ruling_authority (its ONLY condition reaction), administrative capacity,
  // daily life, districts, and threats — but no event ever produced it, so the
  // whole consumer tree was dead and the scandal vanished on re-derivation.
  const scandal = (next) => withActiveCondition(next, {
    archetype: 'corruption_exposed',
    severity,
    triggeredAt: { sourceEventType: 'EXPOSE_CORRUPTION', sourceEventTargetId: event.targetId },
    causes: [{ source: 'event', eventId: event.id, detail: `Corruption inside ${target.name} was exposed publicly.` }],
  });

  if (inst) {
    let next = replaceInstitution(s, inst, withImpairment(inst, impairment));
    next = propagateImpairment({
      settlement: next,
      origin: { entityType: 'institution', entityId: idOf(inst), impairment },
    });
    return scandal(next);
  }

  // Faction case
  let next = replaceFaction(s, faction, withImpairment(faction, impairment));
  next = propagateImpairment({
    settlement: next,
    origin: { entityType: 'faction', entityId: factionIdOf(faction), impairment },
  });
  return scandal(next);
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
  // The NPC scandal is also a durable corruption_exposed condition (see exposeCorruption).
  return withActiveCondition({ ...next, npcs: nextNpcs }, {
    archetype: 'corruption_exposed',
    severity: Number(event.payload?.severity ?? 0.7),
    triggeredAt: { sourceEventType: 'EXPOSE_CORRUPTION', sourceEventTargetId: npc.id || npc.name },
    causes: [{ source: 'event', eventId: event.id, detail: `${npc.name} was publicly exposed as corrupt and ousted.` }],
  });
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

// §corruption — IMPOSE_CORRUPTION: a DM turns a clean NPC by linking them to a criminal
// organization in the settlement. We write the EXACT shape the world-pulse corruption loop
// seeds from — npc.corrupt + corruptionVector + corruptTies.criminalInstitution (npcAgency.js
// reads these to evolve corruption, advance faction capture from the seat, and gate exposure) —
// so the corruption is canon + visible + propagates, and EXPOSE_CORRUPTION can later target them.
// Covert by design: no public legitimacy impairment here (that is the exposure consequence).
function imposeCorruption(s, event) {
  const npc = findNpc(s, event.targetId);
  if (!npc || npc.corrupt) return s; // need a real, not-already-corrupt NPC

  // Resolve the criminal organization: an explicit pick, else the settlement's criminal
  // institution. With no criminal organization there is nothing to link to — no-op.
  const orgName = event.payload?.criminalInstitution
    || readCorruptionClimate(s).criminalInstitutions[0]
    || null;
  if (!orgName) return s;

  // Vector derives from the NPC's own corruptible flaw (greed / fear / status / ...), mirroring
  // the organic onset path; defaults to greed when the NPC has no flagged flaw.
  const vector = corruptionVectorForFlaw(npcCorruptibleFlaw(npc));
  const corrupted = {
    ...npc,
    corrupt: true,
    corruptionVector: vector,
    corruptTies: { ...(npc.corruptTies || {}), criminalInstitution: orgName },
  };
  return replaceNpc(s, npc, corrupted);
}

/**
 * Authored-beats-generation at EVENT time, for the two direct producers
 * whose archetypes generation can also mint (plague,
 * regional_migration_pressure — see STRESSOR_ARCHETYPE_RULES). The authored
 * onset owns the crisis NOW, not only after the next regeneration: without
 * this the live settlement carried BOTH conditions (double-penalizing the
 * same affectedSystems) until reapplyEventConditions collapsed them on
 * regeneration — a no-edit regeneration silently changed the substrate.
 * Mirrors promoteStressorsToConditions' authored path and
 * reapplyEventConditions' targeting: GENERATION-stamped twins only,
 * world/regional conditions untouched.
 */
function withoutGenerationTwin(s, archetype) {
  let next = s;
  for (const cond of next.activeConditions || []) {
    if (cond?.archetype === archetype
      && cond?.id
      && cond?.triggeredAt?.sourceEventType === 'GENERATION') {
      next = withoutActiveCondition(next, cond.id);
    }
  }
  return next;
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
  const size = event.payload?.size || 'medium';
  waves.push({
    size,
    fromRegion: event.targetId || null,
    atEventId: event.id,
    atTimestamp: eventTime(event),
  });
  const next = { ...s, config: { ...config, _refugeeWaves: waves } };
  // Mirror into the raw _config (cutTradeRoute's _cutRoutes discipline):
  // applyChange regenerates from _config first, so a config-only annotation
  // died on the first what-if regeneration.
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, _refugeeWaves: waves };
  }
  // Promote to a canonical active condition (food/labor/legitimacy pressure) so the
  // substrate and AI overlay see the influx, not just the write-only annotation.
  const severity = size === 'large' ? 0.65 : size === 'small' ? 0.35 : 0.5;
  return withActiveCondition(withoutGenerationTwin(next, 'regional_migration_pressure'), {
    archetype: 'regional_migration_pressure',
    severity,
    triggeredAt: { sourceEventType: 'REFUGEE_WAVE', sourceEventTargetId: event.targetId || null },
    causes: [{ source: 'event', eventId: event.id, detail: `A ${size} refugee wave arrived.` }],
  });
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
  // Mirror into the raw _config (cutTradeRoute's _cutRoutes discipline) so
  // the annotation survives a _config-based regeneration.
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, _activePlague: annotation };
  }
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
  // Promote to a canonical 'plague' condition (food/healing/legitimacy/labor) so the
  // outbreak is durable substrate state — the causal layer, AI overlay, and time
  // progression all read it — not just the write-only _activePlague annotation.
  return withActiveCondition(withoutGenerationTwin(next, 'plague'), {
    archetype: 'plague',
    severity,
    triggeredAt: { sourceEventType: 'PLAGUE', sourceEventTargetId: event.targetId || null },
    causes: [{ source: 'event', eventId: event.id, detail: `Plague outbreak (${annotation.name}).` }],
  });
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
  // Mirror into the raw _config (cutTradeRoute's _cutRoutes discipline) so
  // the annotation survives a _config-based regeneration.
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, _raidHistory: raids };
  }

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

// ── Coup d'état wave handlers ──────────────────────────────────────────────

// Loose catalog alias map mirrored from stressors.js canonicalAffectedSystems
// (kept tiny + local: importing the private helper would mean exporting it
// just for this fallback path).
const STRESSOR_SYSTEM_ALIASES = Object.freeze({
  faction_stability: 'faction_power',
  law_order: 'criminal_opportunity',
  tax_revenue: 'trade_connectivity',
});

// Case-insensitive stressor-type comparison — the same tolerance the
// container upserts and resolveStressor's matchesEntry use.
const stressTypeEq = (a, b) => String(a || '').toLowerCase() === String(b || '').toLowerCase();

// Content identity for a bare-object stress entry — type, falling back to
// display name for legacy untyped entries; an entry with neither falls back
// to the object itself (reference identity). assembleSettlement dual-writes
// the SAME object under stress + stressors, but a JSON save/load round-trip
// breaks the aliasing — two content-identical twins that reference dedupe
// (Set) counted as distinct entries.
const stressEntryIdentity = (st) => String(st?.type || st?.name || '').toLowerCase() || st;

/**
 * Normalized view of config.stressorEdits — the EDITOR-authored stressor
 * deltas the generation re-applies (resolveStress's post-roll overlay —
 * resourceEdits' architecture):
 *   { added }    full stress entries authored by APPLY_STRESSOR, re-applied
 *                verbatim (upsert by type) so the authored stressor — not
 *                just its promoted condition — survives a regeneration. The
 *                stress ENTRY is a derivation output the pipeline re-rolls
 *                from config; without the record it vanished on the first
 *                applyChange while the condition survived via
 *                config.eventConditions, and the dossier showed a crisis
 *                with no stressor behind it;
 *   { resolved } stressor types RESOLVE_STRESSOR ended — a suppression list,
 *                so resolving a CONFIG-FORCED stressor (selectedStresses /
 *                stressType) stays resolved across regens instead of the
 *                re-rolled twin re-minting a fresh GENERATION condition once
 *                the eased config.eventConditions record expires.
 * The handlers keep the two lists mutually agreeing (an APPLY clears the
 * type's resolved record; a RESOLVE strikes the type's added entry).
 */
function stressorEditsOf(config) {
  const se = config?.stressorEdits || {};
  return {
    added: Array.isArray(se.added) ? se.added : [],
    resolved: Array.isArray(se.resolved) ? se.resolved : [],
  };
}

/**
 * Dual-write a stressorEdits update to BOTH config and _config (when
 * present) — withCustomTradeGoods' discipline; see that helper for why.
 * (stressorEdits is genuine user input, deliberately NOT in
 * settlementSlice's DERIVED_CONFIG_KEYS strip.)
 */
function withStressorEdits(s, stressorEdits) {
  const next = { ...s, config: { ...(s.config || {}), stressorEdits } };
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, stressorEdits };
  }
  return next;
}

/**
 * APPLY_STRESSOR — an authored crisis ONSET. Three writes:
 *   1. the stress entry lands in the settlement's stress container (the same
 *      shape the Roster's add-stressor correction uses), so the dossier and
 *      the generation-era stress consumers see it;
 *   2. the SAME entry is recorded in config.stressorEdits.added (dual-written
 *      to _config), because the live container is a derivation output a
 *      regeneration re-rolls from config — resolveStress's post-roll overlay
 *      re-applies the record so the authored stressor survives applyChange
 *      alongside the condition below;
 *   3. the engine consequence: the SAME promotion channel generation uses
 *      (conditionPromotion) maps the stressor to its condition archetype.
 *      Types with no promotion rule (custom stressors, exotic catalog types)
 *      fall back to a generic custom_crisis condition carrying the world-pulse
 *      catalog's affectedSystems where known.
 * The roaming world-pulse registration (canon campaigns) happens at the store
 * layer — the settlement mutation stays campaign-agnostic.
 */
function applyStressor(s, event) {
  const type = String(event.payload?.stressorType || event.targetId || '').trim();
  if (!type) return s;
  const label = event.payload?.label || labelFromTarget(type);
  const severity = Math.max(0, Math.min(1, Number(event.payload?.severity ?? 0.6)));

  // First existing ARRAY container wins (same probe removedThreat uses).
  // Pipeline settlements carry a SINGLE stressor as a bare object,
  // dual-written under stress + stressors (assembleSettlement) — the old
  // `|| 'stress'` fallback CLOBBERED that object with a fresh one-entry
  // array under `stress` and left the stale twin under `stressors`. Lift
  // the object(s) into the working list and write the merged array back to
  // EVERY key that held one; a settlement with no container at all gets the
  // editor's canonical `stress` array.
  const arrayKey = ['stressors', 'stress', 'stresses'].find(k => Array.isArray(s[k]));
  const objectKeys = arrayKey ? [] : ['stressors', 'stress', 'stresses']
    .filter(k => s[k] && typeof s[k] === 'object');
  const writeKeys = arrayKey ? [arrayKey] : objectKeys.length ? objectKeys : ['stress'];
  // Lift by CONTENT identity, not reference: a round-tripped settlement holds
  // content-identical twins under stress + stressors, and the old Set dedupe
  // kept both — upserting a DUPLICATE entry into every container key.
  const lifted = objectKeys.map(k => s[k]);
  const list = arrayKey ? s[arrayKey] : lifted.filter((st, i) =>
    lifted.findIndex(o => stressEntryIdentity(o) === stressEntryIdentity(st)) === i);
  // Match by type; the display-name fallback only rescues legacy entries
  // that never recorded one — matching a TYPED entry by label would let a
  // custom stressor labeled 'Famine' overwrite the famine entry's type and
  // detach it from every type-keyed consumer (pulse twin, picker filter).
  const existingIdx = list.findIndex(st =>
    String(st?.type || '').toLowerCase() === type.toLowerCase()
    || (!st?.type && String(st?.name || '').toLowerCase() === label.toLowerCase()));
  const entry = {
    type,
    name: label,
    label,
    severity,
    description: event.description || (existingIdx === -1 ? '' : list[existingIdx]?.description || ''),
    source: 'event',
    addedByEventId: event.id,
    ...(event.payload?.isCustom ? { isCustom: true } : {}),
  };
  // Upsert, not keep-old: re-authoring an existing stressor type refreshes the
  // local entry to the NEW authored severity/label/source. The roaming twin
  // (settlementSlice -> injectCampaignStressor) already upserts at the new
  // severity; keeping the old local entry made the representations disagree.
  const merged = existingIdx === -1
    ? [...list, entry]
    : list.map((st, i) => (i === existingIdx ? { ...st, ...entry } : st));
  let next = { ...s };
  for (const k of writeKeys) next[k] = merged;

  // The authored onset is ALSO recorded in config.stressorEdits (dual-written
  // to _config — the resourceEdits discipline; see stressorEditsOf). The
  // stress entry above is a derivation output a regeneration re-rolls from
  // config; resolveStress re-applies the record as a post-roll overlay so
  // the dossier keeps showing the stressor behind the surviving condition.
  // Upsert by type (re-authoring refreshes the record the way the live
  // upsert refreshes the entry); clearing the type's `resolved` suppression
  // lets a re-authored crisis return after a RESOLVE_STRESSOR.
  const edits = stressorEditsOf(s.config);
  const recordIdx = edits.added.findIndex(e => stressTypeEq(e?.type, type));
  next = withStressorEdits(next, {
    added: recordIdx === -1
      ? [...edits.added, entry]
      : edits.added.map((e, i) => (i === recordIdx ? entry : e)),
    resolved: edits.resolved.filter(t => !stressTypeEq(t, type)),
  });

  const archetype = archetypeForStressor(entry);
  if (archetype) {
    // The richer path: famine -> famine, plague -> plague, coup -> faction
    // challenge, ... (idempotent; collapses per archetype). The origin carries
    // the AUTHORED provenance — without it the promotion stamped GENERATION
    // and dropped the event id (the provenance lie this wave fixed).
    return promoteStressorsToConditions(next, {
      sourceEventType: 'APPLY_STRESSOR',
      eventId: event.id,
      detail: `${label} began.`,
      archetype,
    });
  }
  const catalogSystems = (STRESSOR_CATALOG[type]?.affectedSystems || [])
    .map(sys => STRESSOR_SYSTEM_ALIASES[sys] || sys);
  return withActiveCondition(next, {
    archetype: 'custom_crisis',
    label,
    description: event.description || `${label} grips the settlement.`,
    severity,
    ...(catalogSystems.length ? { affectedSystems: [...new Set(catalogSystems)] } : {}),
    triggeredAt: { sourceEventType: 'APPLY_STRESSOR', sourceEventTargetId: type },
    causes: [{ source: 'event', eventId: event.id, detail: `${label} began.` }],
  });
}

/**
 * CHANGE_RULING_POWER — the DM hands the government to a different
 * authoritative power. Same domain path the coup verdict uses
 * (rulingPower.transferRulingPower): the governing body persists, reshaped
 * to the new power's preferred government type; legitimacy reseeds by cause.
 * A transfer that can't apply (unknown faction, already governing) is a
 * settlement no-op — but the registry's state deltas (volatility +18, ...)
 * AND its narration ('X took power by coup') still land in the canon
 * timeline: the pipeline computes both from the BEFORE settlement and has no
 * veto channel from mutation handlers (mutateSettlement returns only the
 * settlement). Until such a seam exists the guard is upstream — batch staging
 * hard-validates the faction ref (batch.js eventConsumes) and the composer
 * only offers real factions.
 */
function changeRulingPower(s, event) {
  const cause = event.payload?.cause || 'coup';
  // Try the raw target first (the picker passes the faction name verbatim);
  // fall back to the de-slugged form for "faction.some_name" style ids.
  let result = transferRulingPower(s, event.targetId, { cause });
  if (result.error === 'faction_not_found') {
    result = transferRulingPower(s, labelFromTarget(event.targetId), { cause });
  }
  if (result.error) return s;
  const severityByCause = { coup: 0.55, conquest: 0.65, election: 0.25, succession: 0.3, appointment: 0.3 };
  return withActiveCondition(result.settlement, {
    archetype: 'government_overthrown',
    severity: severityByCause[cause] ?? 0.5,
    triggeredAt: { sourceEventType: 'CHANGE_RULING_POWER', sourceEventTargetId: event.targetId },
    causes: [{
      source: 'event',
      eventId: event.id,
      detail: `${result.transfer.authorityName} took power by ${cause}; the government now sits as a ${result.transfer.toGovernment.toLowerCase()}.`,
    }],
  });
}

// ── Editor roster wave handlers ────────────────────────────────────────────

/**
 * RESOLVE_STRESSOR — the inverse of APPLY_STRESSOR: an authored crisis ENDS.
 * Removes the matching stress entry (same container probe applyStressor uses)
 * and winds down the conditions that crisis promoted — both the directly
 * stamped one (triggeredAt.sourceEventTargetId === the stressor type, the
 * custom_crisis path) and the archetype the type promotes to (the
 * conditionPromotion path). Wind-down is 'easing' + a near-term expiry rather
 * than outright removal, so the substrate sees a crisis trailing off instead
 * of vanishing without trace; the resolution carries event provenance on the
 * condition's causes. The wind-down does NOT require a live stress entry: on
 * a legacy save regenerated before config.stressorEdits existed, the entry
 * was re-rolled away while the promoted condition survived via
 * config.eventConditions — resolving by type still finds it. The resolution
 * is itself recorded in config.stressorEdits (strike the type's added entry,
 * suppress the type) so a resolved CONFIG-FORCED stressor stays resolved
 * across regenerations. A target matching neither an entry nor a condition is a
 * settlement no-op (registry deltas still land — guard upstream, same
 * posture as changeRulingPower: batch staging hard-validates the target
 * against entry/record/condition (batch.js eventConsumes, kind 'stressor')
 * and the composer's picker offers the live stressors). The roaming
 * world-pulse twin resolves at
 * the store layer (settlementSlice → resolveCampaignStressor), mirroring the
 * inject bridge.
 */
function resolveStressor(s, event) {
  const type = String(event.payload?.stressorType || event.targetId || '').trim();
  if (!type) return s;
  // Type OR display-name match, case-insensitive — the picker passes the
  // entry's type when it has one, its name for legacy untyped entries.
  const matchesEntry = (st) =>
    String(st?.type || '').toLowerCase() === type.toLowerCase()
    || String(st?.name || '').toLowerCase() === type.toLowerCase();
  // EVERY array container is cleared, not just the first: applyStressor
  // writes the merged array to each key that held the bare object
  // (stress + stressors), and a JSON round-trip breaks their aliasing — the
  // old first-key-only removal left a stale twin raging under the other key.
  const arrayKeys = ['stressors', 'stress', 'stresses'].filter(k => Array.isArray(s[k]));
  // A missing array entry is NOT a full no-op anymore: the stress entry is a
  // derivation output that a regeneration re-rolls away, while the promoted
  // condition survives via config.eventConditions — so the condition must
  // stay resolvable after a what-if. No matching entry AND no matching
  // condition below → settlement no-op, same posture as before.
  let removed = null;
  let next = s;
  for (const containerKey of arrayKeys) {
    const list = s[containerKey];
    const idx = list.findIndex(matchesEntry);
    if (idx === -1) continue;
    removed = removed || list[idx];
    next = { ...next, [containerKey]: list.filter((_, i) => i !== idx) };
  }
  if (!removed) {
    // Pipeline settlements carry a SINGLE stressor as a bare object,
    // dual-written under stress + stressors (assembleSettlement) — the array
    // probe above never sees it, which made resolving a GENERATOR-rolled
    // crisis a stressor no-op (an easing condition beside a still-raging
    // stressor). Match and clear that shape too; nulling the keys mirrors
    // the no-stress generated shape.
    const objectKeys = ['stressors', 'stress', 'stresses'].filter(k =>
      s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && matchesEntry(s[k]));
    if (objectKeys.length) {
      removed = s[objectKeys[0]];
      next = { ...s };
      for (const k of objectKeys) next[k] = null;
    }
  }
  const label = event.payload?.label || removed?.label || removed?.name || labelFromTarget(type);

  // Wind down what the crisis promoted. Matching mirrors applyStressor's two
  // write paths: the direct stamp (custom_crisis / authored onset) and the
  // promotion archetype. No clearing precedent exists in this module, so the
  // wind-down sets status 'easing' with a short remaining duration (the
  // documented fallback) instead of deleting evolved state outright.
  const archetype = archetypeForStressor(removed) || archetypeForStressor({ type });
  // Local RESOLVE_STRESSOR never winds down a CAMPAIGN-owned condition: one
  // whose ORIGIN cause is a regional channel or the world pulse belongs to
  // that layer (it resolves through its own UI/twin and is preserved across
  // local edits by preserveWorldConditions). Winding it here would stamp an
  // event cause onto it, recruiting it into config.eventConditions — and the
  // record would resurrect it after the campaign layer resolved it. Origin =
  // the FIRST cause: onsets write their provenance first; later causes are
  // appended receipts. Event- and generation-born conditions (and bare
  // legacy ones with no causes) are local and stay resolvable.
  const locallyOwned = (c) => {
    const origin = String(c?.causes?.[0]?.source ?? '');
    return origin === '' || origin === 'event' || origin === 'generation';
  };
  const matchesCrisis = (c) => {
    if (!c || !locallyOwned(c)) return false;
    const stamped = String(c.triggeredAt?.sourceEventTargetId || '').toLowerCase() === type.toLowerCase();
    return stamped || (archetype != null && c.archetype === archetype);
  };
  let wound = false;
  const conditions = (next.activeConditions || []).map((c) => {
    if (!matchesCrisis(c)) return c;
    wound = true;
    const elapsed = Number(c.duration?.elapsedTicks) || 0;
    const cap = c.duration?.expiresAtTicks;
    return {
      ...c,
      status: 'easing',
      duration: {
        ...(c.duration || {}),
        elapsedTicks: elapsed,
        // Trail off within ~2 ticks; never EXTEND a condition already closer
        // to expiry than that.
        expiresAtTicks: typeof cap === 'number' ? Math.min(cap, elapsed + 2) : elapsed + 2,
      },
      causes: [
        ...(Array.isArray(c.causes) ? c.causes : []),
        { source: 'event', eventId: event.id, detail: `${label} was resolved.` },
      ],
    };
  });
  if (wound) next = { ...next, activeConditions: conditions };
  // Record the resolution in config.stressorEdits (dual-written to _config):
  // strike the type's authored `added` entry so the overlay stops re-applying
  // it, and add the type to the `resolved` suppression list so a
  // CONFIG-FORCED stressor (selectedStresses / stressType) stays resolved
  // across regenerations — without it the re-rolled stressor re-minted a
  // fresh GENERATION condition ~2 ticks after the eased
  // config.eventConditions record expired. A no-match resolve records
  // nothing — the settlement no-op posture above.
  if (removed || wound) {
    const resolvedType = String(removed?.type || type);
    const edits = stressorEditsOf(next.config);
    const added = edits.added.filter(e => !stressTypeEq(e?.type, resolvedType));
    const alreadyResolved = edits.resolved.some(t => stressTypeEq(t, resolvedType));
    if (added.length !== edits.added.length || !alreadyResolved) {
      next = withStressorEdits(next, {
        added,
        resolved: alreadyResolved ? edits.resolved : [...edits.resolved, resolvedType],
      });
    }
  }
  return next;
}

/** Display label for a trade-good list entry (strings + legacy {name, good} objects). */
function tradeGoodLabel(entry) {
  if (typeof entry === 'string') return entry;
  return String(entry?.name || entry?.good || '');
}

/**
 * Normalized view of config.customTradeGoods — the EDITOR-authored trade-good
 * input the economy derivation consumes (generateEconomy's
 * applyCustomTradeGoodsConfig): { exports, imports } plain labels,
 * { transit } entrepôt goods, { removed } the suppression list that keeps a
 * removal of a generator-derived good gone across regenerations.
 */
function customTradeGoodsOf(config) {
  const ctg = config?.customTradeGoods || {};
  return {
    exports: Array.isArray(ctg.exports) ? ctg.exports : [],
    imports: Array.isArray(ctg.imports) ? ctg.imports : [],
    transit: Array.isArray(ctg.transit) ? ctg.transit : [],
    removed: Array.isArray(ctg.removed) ? ctg.removed : [],
  };
}

/**
 * Write a customTradeGoods update to BOTH config and _config (when present).
 * applyChange regenerates from the raw _config first and only falls back to
 * the stripped config snapshot — an authored good recorded in just one of
 * them would survive one regeneration path and vanish on the other.
 * (customTradeGoods is genuine user input, deliberately NOT in
 * settlementSlice's DERIVED_CONFIG_KEYS strip.)
 */
function withCustomTradeGoods(s, customTradeGoods) {
  const next = { ...s, config: { ...(s.config || {}), customTradeGoods } };
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, customTradeGoods };
  }
  return next;
}

/**
 * ADD_TRADE_GOOD — append a good label to the canonical trade lists. Exports
 * flagged entrepôt take the literal '<label> (transit)' suffixed form the
 * chain deriver emits AND land in economicState.transit (the un-suffixed
 * label, matching getTradeModifiers' transit shape). Dedupe is
 * case-insensitive across string and legacy object entries.
 *
 * Dual-format discipline (depleteResource's): the live economicState write
 * makes the good visible NOW; the config.customTradeGoods write is the input
 * the economy derivation re-applies, so the authored good survives a full
 * regeneration. Re-adding a removed good clears its suppression entry — the
 * two formats must keep agreeing.
 */
function addTradeGood(s, event) {
  const label = String(event.payload?.label || event.targetId || '').trim();
  if (!label) return s;
  const direction = event.payload?.direction === 'import' ? 'import' : 'export';
  const entrepot = direction === 'export' && !!event.payload?.entrepot;
  const ec = s.economicState || {};
  const listKey = direction === 'import' ? 'primaryImports' : 'primaryExports';
  const list = Array.isArray(ec[listKey]) ? ec[listKey] : [];
  const written = entrepot ? `${label} (transit)` : label;
  const has = (arr, l) => arr.some(e => tradeGoodLabel(e).toLowerCase() === l.toLowerCase());

  let nextEc = ec;
  if (!has(list, written)) nextEc = { ...nextEc, [listKey]: [...list, written] };
  if (entrepot) {
    const transit = Array.isArray(nextEc.transit) ? nextEc.transit : [];
    if (!has(transit, label)) nextEc = { ...nextEc, transit: [...transit, label] };
  }

  const ctg = customTradeGoodsOf(s.config);
  const bucket = entrepot ? 'transit' : (direction === 'import' ? 'imports' : 'exports');
  const inBucket = ctg[bucket].some(l => String(l).toLowerCase() === label.toLowerCase());
  const removed = ctg.removed.filter(l => String(l).toLowerCase() !== label.toLowerCase());
  const configChanged = !inBucket || removed.length !== ctg.removed.length;

  if (nextEc === ec && !configChanged) return s;
  let next = nextEc === ec ? s : { ...s, economicState: nextEc };
  if (configChanged) {
    next = withCustomTradeGoods(next, {
      ...ctg,
      [bucket]: inBucket ? ctg[bucket] : [...ctg[bucket], label],
      removed,
    });
  }
  return next;
}

/**
 * REMOVE_TRADE_GOOD — strip a good label (case-insensitive, with and without
 * the ' (transit)' suffix) from every list it can sit in: the canonical
 * primaryExports/primaryImports, transit, and the legacy exports/imports
 * aliases (canonExports falls back to them on old saves). No matching label
 * anywhere (economicState or the authored config lists) → no-op.
 *
 * Dual-format discipline: alongside the live strip, the label is struck from
 * every config.customTradeGoods authored list AND recorded in its `removed`
 * suppression list, so a removal — even of a generator-derived good — stays
 * gone across a full regeneration.
 */
function removeTradeGood(s, event) {
  const raw = String(event.payload?.label || event.targetId || '').trim();
  if (!raw) return s;
  const base = raw.replace(/\s*\(transit\)\s*$/i, '').trim();
  const targets = new Set([raw, base, `${base} (transit)`].map(l => l.toLowerCase()));
  const ec = s.economicState || {};
  let changed = false;
  const nextEc = { ...ec };
  for (const key of ['primaryExports', 'primaryImports', 'transit', 'exports', 'imports']) {
    const list = ec[key];
    if (!Array.isArray(list)) continue;
    const filtered = list.filter(e => !targets.has(tradeGoodLabel(e).toLowerCase()));
    if (filtered.length !== list.length) {
      changed = true;
      nextEc[key] = filtered;
    }
  }

  const ctg = customTradeGoodsOf(s.config);
  const strike = (arr) => arr.filter(l => !targets.has(String(l).toLowerCase()));
  const struck = {
    exports: strike(ctg.exports),
    imports: strike(ctg.imports),
    transit: strike(ctg.transit),
  };
  const configChanged =
    struck.exports.length !== ctg.exports.length ||
    struck.imports.length !== ctg.imports.length ||
    struck.transit.length !== ctg.transit.length;

  if (!changed && !configChanged) return s;
  let next = changed ? { ...s, economicState: nextEc } : s;
  const alreadyRemoved = ctg.removed.some(l => String(l).toLowerCase() === base.toLowerCase());
  next = withCustomTradeGoods(next, {
    ...struck,
    removed: alreadyRemoved ? ctg.removed : [...ctg.removed, base],
  });
  return next;
}

/**
 * ADD_RESOURCE — open a new resource node. Mirrors depleteResource's
 * dual-format discipline: write BOTH config.nearbyResources (the roster the
 * generators and the target picker read) and config.nearbyResourcesState
 * (the manual-mode map). Catalog targets store the canonical underscore key;
 * names with no catalog entry are custom resources — stored verbatim (the
 * resolveResources convention) and also recorded in nearbyResourcesCustom so
 * the dossier gold-tints them. Re-adding a depleted node clears the
 * depletion record — the two formats must keep agreeing.
 */
function addResource(s, event) {
  const raw = String(event.targetId || '').trim();
  if (!raw) return s;
  const slug = slugify(raw);
  const catalogKey = RESOURCE_DATA[raw] ? raw : (RESOURCE_DATA[slug] ? slug : null);
  const key = catalogKey || raw;
  const config = s.config || {};
  const nearby = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
  const custom = Array.isArray(config.nearbyResourcesCustom) ? config.nearbyResourcesCustom : [];
  const state = config.nearbyResourcesState || {};
  const depleted = Array.isArray(config.nearbyResourcesDepleted) ? config.nearbyResourcesDepleted : [];
  const edits = resourceEditsOf(config);
  return withResourceEdits(s, {
    nearbyResources: nearby.includes(key) ? nearby : [...nearby, key],
    nearbyResourcesState: { ...state, [key]: 'allow' },
    // Slug-equivalent filter: also clears the legacy slug-form record the
    // old depleteResource wrote for custom resources ('moonpetal_grove').
    nearbyResourcesDepleted: depleted.filter(k => k !== key && slugify(k) !== slug),
    ...(catalogKey
      ? {}
      : { nearbyResourcesCustom: custom.includes(key) ? custom : [...custom, key] }),
  }, {
    ...edits,
    // An opened node starts open: clear the key's removed suppression AND
    // its depleted record (mirrors the live nearbyResourcesDepleted filter).
    added: edits.added.some(e => slugEq(String(e?.key || ''), key))
      ? edits.added
      : [...edits.added, { key, custom: !catalogKey }],
    removed: edits.removed.filter(k => !slugEq(k, key)),
    depleted: edits.depleted.filter(k => !slugEq(k, key)),
  });
}

/**
 * REMOVE_RESOURCE — strike a resource node from the roster entirely (the
 * harsher cousin of DEPLETE_RESOURCE: nothing left to recover). Clears every
 * config surface that names it — nearbyResources, nearbyResourcesCustom, the
 * nearbyResourcesState entry, and nearbyResourcesDepleted — matching raw,
 * slugified, and de-slugged forms the way recoveredResource does.
 */
function removeResource(s, event) {
  const raw = String(event.targetId || '').trim();
  if (!raw) return s;
  const keys = new Set([raw, slugify(raw), labelFromTarget(raw)].filter(Boolean));
  const config = s.config || {};
  const nearby = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
  if (!nearby.some(k => keys.has(k))) return s;
  const state = { ...(config.nearbyResourcesState || {}) };
  for (const k of keys) delete state[k];
  // The roster forms actually struck — what the suppression list must name
  // so a regenerated roster (same key forms) drops them again.
  const struckKeys = nearby.filter(k => keys.has(k));
  const hitsStruck = k => struckKeys.some(sk => slugEq(k, sk));
  const edits = resourceEditsOf(config);
  return withResourceEdits(s, {
    nearbyResources: nearby.filter(k => !keys.has(k)),
    nearbyResourcesCustom: (config.nearbyResourcesCustom || []).filter(k => !keys.has(k)),
    nearbyResourcesState: state,
    nearbyResourcesDepleted: (config.nearbyResourcesDepleted || []).filter(k => !keys.has(k)),
  }, {
    ...edits,
    added: edits.added.filter(e => !hitsStruck(String(e?.key || ''))),
    removed: [...edits.removed, ...struckKeys.filter(k => !edits.removed.some(r => slugEq(r, k)))],
    depleted: edits.depleted.filter(k => !hitsStruck(k)),
    recovered: edits.recovered.filter(k => !hitsStruck(k)),
  });
}

// The settlement-NPC standing fields the swap exchanges. Everything else on
// each NPC (personality, goals, secrets, corruption, ...) is preserved.
const NPC_STANDING_FIELDS = Object.freeze(['importance', 'influence', 'structuralRank']);

/**
 * PROMOTE_NPC / DEMOTE_NPC — one shared handler; the polarity is narrative.
 * The target and the chosen same-faction peer SWAP standing (importance,
 * influence, structuralRank — both the dossier's structural vocabulary and
 * KILL_NPC's severity input). Also stamps npc.factionId on both with the
 * shared faction's stable form when missing: the sim's factionIdFor reads
 * factionId/faction/affiliation but NOT the generator's factionAffiliation,
 * so without the stamp the world pulse round-robins the pair into arbitrary
 * factions. The sim adopts the new importance into dotRank/factionSeat via
 * the npcAgency adoption seam (ensureNpcStates' adoptedImportance marker).
 * Missing target or peer → settlement no-op (batch staging hard-validates
 * both refs; the composer only offers real same-faction pairs).
 */
function swapNpcStanding(s, event) {
  // Empty refs must never reach findNpc: '' loose-matches the first NPC
  // whose id is null (String(null || '') === ''), silently swapping with a
  // bystander instead of no-opping.
  const peerRef = event.payload?.swapWithNpcId || event.payload?.swapWithName;
  if (!event.targetId || !peerRef) return s;
  const a = findNpc(s, event.targetId);
  const b = findNpc(s, peerRef);
  if (!a || !b || a === b) return s;
  // Standing swaps stay inside ONE faction (the owner's design). If both
  // NPCs declare an affiliation and they differ, this is a mis-targeted
  // event — no-op rather than mis-stamp a foreign factionId onto the peer.
  if (a.factionAffiliation && b.factionAffiliation
    && String(a.factionAffiliation).toLowerCase() !== String(b.factionAffiliation).toLowerCase()) {
    return s;
  }

  const carryStanding = (from, onto) => {
    const next = { ...onto };
    for (const field of NPC_STANDING_FIELDS) {
      if (field in from || field in onto) next[field] = from[field];
    }
    return next;
  };
  let nextA = carryStanding(b, a);
  let nextB = carryStanding(a, b);

  // The shared faction's stable id — prefer the real power-faction record's
  // id over the display name so the stamp survives renames.
  const affiliation = a.factionAffiliation || b.factionAffiliation || null;
  if (affiliation) {
    const faction = findFaction(s, affiliation);
    const stableId = faction ? factionIdOf(faction) : affiliation;
    if (!nextA.factionId) nextA = { ...nextA, factionId: stableId };
    if (!nextB.factionId) nextB = { ...nextB, factionId: stableId };
  }

  let next = replaceNpc(s, a, nextA);
  next = replaceNpc(next, b, nextB);
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
