/**
 * domain/events/batch.js — Apply several events as one cohesive change set.
 *
 * The DM stages multiple changes ("the party killed the miller, burned the
 * church, and installed a new mayor") and applies them as a batch. Two
 * problems this module solves:
 *
 *   1. Cross-references inside a batch. You can add an institution AND add
 *      an NPC into it in the same batch — the NPC's reference resolves
 *      against what earlier changes in the batch produce, not just what's
 *      already in the settlement. A reference that resolves to neither is a
 *      blocking warning (today the underlying mutation silently no-ops).
 *
 *   2. One derive, not N. Each event threads its entity mutation into the
 *      next (mutateSettlement is pure and sequential), the registry's
 *      authored state deltas are summed, and SystemState is derived once at
 *      the end. The union of per-event rerun keys is returned so the store
 *      can run a single reactive generator rerun rather than one per event
 *      (which would reshuffle generated content repeatedly).
 *
 * Pure: no store, no React, no I/O. The input settlement is never mutated.
 *
 * The `produces` / `consumes` contract here is the single place that knows
 * which events create entities and which reference them; new event types
 * extend these two maps (and the registry) rather than special-casing the
 * validator.
 */

import { EVENT_REGISTRY, RERUN_KEYS_FOR_EVENT } from './registry.js';
import { mutateSettlement } from './mutate.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { compareSystemState } from '../state/compareSystemState.js';
import { clamp01, bandFor } from '../state/bands.js';

/** @typedef {import('../types.js').Event} Event */

// ── Entity reference contract ───────────────────────────────────────────────

/** Event types that CREATE an entity, and the kind they create. */
const PRODUCES_KIND = Object.freeze({
  ADD_INSTITUTION: 'institution',
  ADD_NPC:         'npc',
  ADD_FACTION:     'faction',
  ADD_RESOURCE:    'resource',
});

/**
 * The entity refs an event creates. Institution/faction ids are
 * deterministic (slug of the name), matching the mutation layer, so later
 * changes can reference them by id or name. NPC ids carry a random suffix
 * at apply time, so only the name is registered (NPCs are referenced by the
 * institution/faction they join, not the other way around).
 *
 * @param {Event} event
 * @returns {Array<{kind:string, id?:string, name?:string}>}
 */
export function eventProduces(event) {
  const kind = PRODUCES_KIND[event?.type];
  if (!kind) return [];
  const name = labelFromTarget(event?.targetId) || event?.payload?.name || '';
  if (!name) return [];
  const id = kind === 'npc' ? '' : `${kind}.${slugify(name)}`;
  return [{ kind, id, name }];
}

/**
 * The entity refs an event REQUIRES to already exist (in the settlement or
 * earlier in the batch). A miss here is a blocking warning. Note: refs that
 * the mutation creates-if-missing (e.g. the NPC subject of ASSIGN_NPC_TO_ROLE)
 * are deliberately NOT listed — only true hard references are validated.
 *
 * @param {Event} event
 * @returns {Array<{kind:string, ref:string}>}
 */
export function eventConsumes(event) {
  const t = event?.type;
  const targetId = event?.targetId;
  const p = event?.payload || {};
  const refs = [];
  switch (t) {
    case 'REMOVE_INSTITUTION':
    case 'DAMAGE_INSTITUTION':
    case 'IMPAIR_INSTITUTION':
    case 'RESTORE_INSTITUTION':
      if (targetId) refs.push({ kind: 'institution', ref: targetId });
      break;
    case 'IMPAIR_FACTION':
    case 'RESTORE_FACTION':
      if (targetId) refs.push({ kind: 'faction', ref: targetId });
      break;
    case 'EXPOSE_CORRUPTION':
      // Targets a faction OR an institution — accept either.
      if (targetId) refs.push({ kind: 'factionOrInstitution', ref: targetId });
      break;
    case 'KILL_NPC':
      if (targetId) refs.push({ kind: 'npc', ref: targetId });
      break;
    case 'ASSIGN_NPC_TO_ROLE':
      // The NPC subject is created if missing, so it is NOT a hard ref. The
      // institution/faction it's assigned into MUST exist, though.
      if (p.institutionId)   refs.push({ kind: 'institution', ref: p.institutionId });
      if (p.factionAlignment) refs.push({ kind: 'faction', ref: p.factionAlignment });
      break;
    case 'ADD_NPC':
      for (const iid of p.linkedInstitutionIds || []) refs.push({ kind: 'institution', ref: iid });
      for (const fid of p.linkedFactionIds || [])     refs.push({ kind: 'faction', ref: fid });
      break;
    case 'DEPLETE_RESOURCE':
    case 'RECOVERED_RESOURCE':
    case 'REMOVE_RESOURCE':
      if (targetId) refs.push({ kind: 'resource', ref: targetId });
      break;
    case 'RAID_OR_MONSTER_ATTACK':
      if (p.damagedInstitutionId) refs.push({ kind: 'institution', ref: p.damagedInstitutionId });
      break;
    case 'CHANGE_RULING_POWER':
      // The faction taking power must exist — transferRulingPower silently
      // no-ops on an unknown faction while the registry deltas still land.
      if (targetId) refs.push({ kind: 'faction', ref: targetId });
      break;
    case 'PROMOTE_NPC':
    case 'DEMOTE_NPC':
      // BOTH sides of the standing swap are hard refs — the mutation silently
      // no-ops when either is missing while the registry deltas still land.
      if (targetId) refs.push({ kind: 'npc', ref: targetId });
      if (p.swapWithNpcId) refs.push({ kind: 'npc', ref: p.swapWithNpcId });
      break;
    default:
      break;
  }
  return refs;
}

// ── Validation ───────────────────────────────────────────────────────────

/**
 * Validate a batch's cross-references. Walks the events in order, checking
 * each event's `consumes` against a namespace that starts as the settlement's
 * entities and grows with each event's `produces`. A reference that resolves
 * to neither yields a blocking warning.
 *
 * @param {Object} settlement
 * @param {Event[]} events
 * @returns {{ ok: boolean, warnings: Array<{index:number, eventId:string, severity:string, message:string}> }}
 */
export function validateBatch(settlement, events = []) {
  const ns = initNamespace(settlement);
  const warnings = [];
  events.forEach((event, index) => {
    const label = EVENT_REGISTRY[event?.type]?.label || event?.type || 'Change';
    // Check references against what exists so far (settlement + earlier adds).
    for (const { kind, ref } of eventConsumes(event)) {
      if (!nsHas(ns, kind, ref)) {
        warnings.push({
          index,
          eventId: event?.id,
          severity: 'block',
          message: `${label}: "${labelFromTarget(ref) || ref}" isn't in the settlement or earlier in this batch.`,
        });
      }
    }
    // Then register what this event produces, so a LATER event can use it.
    for (const { kind, id, name } of eventProduces(event)) {
      nsAdd(ns, kind, id);
      nsAdd(ns, kind, name);
    }
  });
  return { ok: warnings.every(w => w.severity !== 'block'), warnings };
}

// ── Batch application ──────────────────────────────────────────────────────

/**
 * Apply a batch of events as one change set. Threads entity mutations through
 * each event, sums the registry's authored state deltas, and derives
 * SystemState once at the end. Returns the union of rerun keys so the store
 * can run a single reactive generator rerun.
 *
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {Object} [args.systemState] before-state (derived if omitted)
 * @param {Event[]} args.events
 * @param {string} [args.now] deterministic ISO timestamp for replay/tests
 * @returns {{
 *   beforeSettlement: Object, nextSettlement: Object,
 *   beforeSystemState: Object, afterSystemState: Object,
 *   systemStateDeltas: Array<Object>, summedStateDeltas: Object,
 *   perEvent: Array<{event:Event, narrativeSummary:string, warnings:Array<Object>}>,
 *   rerunKeys: string[],
 * }}
 */
export function applyEventBatch({ settlement, systemState = null, events = [], now = null }) {
  const beforeSettlement = settlement;
  const beforeSystemState = systemState || deriveSystemState(beforeSettlement);

  let working = beforeSettlement;
  const summedStateDeltas = {};
  const perEvent = [];
  const rerunKeys = new Set();

  for (const event of events) {
    const spec = event ? EVENT_REGISTRY[event.type] : null;
    if (!spec) {
      perEvent.push({
        event,
        narrativeSummary: '',
        warnings: [{ severity: 'mismatch', message: `Unknown event type: ${event?.type}` }],
      });
      continue;
    }
    // Entity mutation, threaded into the next event.
    working = mutateSettlement({ settlement: working, event, now });

    // Sum the authored state deltas (additive across the batch).
    // Cast: spec.stateDeltas is typed 1-arg in the registry typedef but
    // accepts an optional settlement (every spec honors it), as in eventPipeline.
    const deltas = (typeof spec.stateDeltas === 'function'
      ? /** @type {Function} */ (spec.stateDeltas)(event, working)
      : {}) || {};
    for (const [k, v] of Object.entries(deltas)) {
      summedStateDeltas[k] = (summedStateDeltas[k] || 0) + (Number(v) || 0);
    }

    const narrativeSummary = typeof spec.narrate === 'function'
      ? /** @type {Function} */ (spec.narrate)(event, beforeSettlement)
      : '';
    perEvent.push({ event, narrativeSummary, warnings: [] });

    for (const key of RERUN_KEYS_FOR_EVENT[event.type] || []) rerunKeys.add(key);
  }

  const afterStructural = deriveSystemState(working);
  const afterSystemState = applyAuthoredStateDeltas(afterStructural, summedStateDeltas);
  const systemStateDeltas = compareSystemState(beforeSystemState, afterSystemState);

  return {
    beforeSettlement,
    nextSettlement: working,
    beforeSystemState,
    afterSystemState,
    systemStateDeltas,
    summedStateDeltas,
    perEvent,
    rerunKeys: [...rerunKeys],
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

// Mirror of eventPipeline.applyAuthoredStateDeltas (kept local so this module
// stays decoupled from the single-event pipeline).
function applyAuthoredStateDeltas(state, deltas) {
  if (!state) return state;
  const next = {};
  for (const key of Object.keys(state)) {
    const dim = state[key];
    const change = deltas?.[key] ?? 0;
    const value = Math.round(clamp01((dim?.value ?? 50) + change));
    next[key] = {
      value,
      band: bandFor(value),
      drivers: dim?.drivers || [],
      risks:   dim?.risks || [],
    };
  }
  return next;
}

function lc(x) { return String(x || '').trim().toLowerCase(); }

function initNamespace(s) {
  const ns = {
    institution: new Set(),
    faction:     new Set(),
    npc:         new Set(),
    resource:    new Set(),
  };
  for (const i of s?.institutions || []) { ns.institution.add(lc(i.id)); ns.institution.add(lc(i.name)); }
  const factions = s?.powerStructure?.factions || s?.factions || [];
  for (const f of factions) { ns.faction.add(lc(f.id)); ns.faction.add(lc(f.faction)); ns.faction.add(lc(f.name)); }
  for (const n of s?.npcs || []) { ns.npc.add(lc(n.id)); ns.npc.add(lc(n.name)); }
  for (const k of s?.config?.nearbyResources || []) ns.resource.add(lc(k));
  for (const r of s?.resources || []) { ns.resource.add(lc(r.id || r.key || r.name)); ns.resource.add(lc(r.name)); }
  for (const set of Object.values(ns)) set.delete('');
  return ns;
}

function nsHas(ns, kind, ref) {
  const r = lc(ref);
  if (!r) return true; // nothing to validate
  const label = lc(labelFromTarget(ref));
  if (kind === 'factionOrInstitution') {
    return ns.faction.has(r) || ns.institution.has(r) || ns.faction.has(label) || ns.institution.has(label);
  }
  const set = ns[kind];
  if (!set) return true; // unknown kind — don't block
  return set.has(r) || set.has(label);
}

function nsAdd(ns, kind, value) {
  const v = lc(value);
  if (!v || !ns[kind]) return;
  ns[kind].add(v);
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
