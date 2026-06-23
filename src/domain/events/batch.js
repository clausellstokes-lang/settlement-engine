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
import { archetypeForStressor } from '../conditionPromotion.js';
import { canonStressors } from '../canonicalAccessors.js';

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
  // APPLY_STRESSOR mints a stress entry (and the condition it promotes to),
  // so a later RESOLVE_STRESSOR in the same batch can target it — by type or
  // label (exact), or through the archetype bridge nsHas runs for free text.
  if (event?.type === 'APPLY_STRESSOR') {
    const type = String(event.payload?.stressorType || event.targetId || '').trim();
    if (!type) return [];
    const refs = [{ kind: 'stressor', id: type, name: event.payload?.label || labelFromTarget(type) }];
    const archetype = archetypeForStressor({ type, label: event.payload?.label });
    if (archetype) refs.push({ kind: 'stressorArchetype', id: archetype, name: archetype });
    return refs;
  }
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
  /** @type {any} */
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
      // The handler tries an NPC (corrupt subject) first, then an institution,
      // then a faction — accept any of the three so a real target passes and a
      // phantom one blocks instead of silently no-opping.
      if (targetId) refs.push({ kind: 'npcOrFactionOrInstitution', ref: targetId });
      break;
    case 'KILL_NPC':
    case 'KILL_LEADER':
      // KILL_LEADER routes through killNpcMutation, which hard-requires the NPC.
      if (targetId) refs.push({ kind: 'npc', ref: targetId });
      break;
    case 'SETTLEMENT_DISPUTE':
    case 'BROKERED_ALLIANCE':
    case 'OPENED_TRADE_ROUTE':
      // setNeighbourRelationship no-ops unless targetId matches a linked
      // neighbour (by name/neighbourName/id/linkId) — a hard ref, else the
      // relationship narration + deltas land with no graph change.
      if (targetId) refs.push({ kind: 'neighbour', ref: targetId });
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
      // no-ops when either is missing while the registry deltas still land. The
      // peer is identified by swapWithNpcId OR swapWithName (swapNpcStanding
      // accepts either), so mirror that fallback here.
      if (targetId) refs.push({ kind: 'npc', ref: targetId });
      if (p.swapWithNpcId || p.swapWithName) {
        refs.push({ kind: 'npc', ref: p.swapWithNpcId || p.swapWithName });
      }
      break;
    case 'RESOLVE_STRESSOR': {
      // The target must resolve against SOMETHING resolveStressor can wind
      // down — a live stress entry, a recorded event condition, or a live
      // locally-owned condition (by stamp or archetype; see nsHas) — else the
      // mutation silently no-ops while the registry deltas still land, the
      // same hole CHANGE_RULING_POWER's faction ref closes. A live entry
      // alone is deliberately NOT required: the entry is a derivation output
      // a regeneration re-rolls away, while the promoted condition survives
      // via config.eventConditions and stays resolvable by type.
      const type = String(p.stressorType || targetId || '').trim();
      if (type) refs.push({ kind: 'stressor', ref: type });
      break;
    }
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
    // Capture the pre-mutation settlement so authored deltas are computed against
    // the state the event acts ON (eventPipeline's contract). Computing them from
    // the already-mutated `working` drifted severity-derived deltas (e.g. a
    // RESOLVE_STRESSOR reading the stressor it just removed).
    const before = working;
    // Entity mutation, threaded into the next event.
    working = mutateSettlement({ settlement: working, event, now });

    // Sum the authored state deltas (additive across the batch).
    // Cast: spec.stateDeltas is typed 1-arg in the registry typedef but
    // accepts an optional settlement (every spec honors it), as in eventPipeline.
    const deltas = (typeof spec.stateDeltas === 'function'
      ? /** @type {Function} */ (spec.stateDeltas)(event, before)
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
    stressor:    new Set(),
    stressorArchetype: new Set(),
    neighbour:   new Set(),
  };
  for (const i of s?.institutions || []) { ns.institution.add(lc(i.id)); ns.institution.add(lc(i.name)); }
  const factions = s?.powerStructure?.factions || s?.factions || [];
  for (const f of factions) { ns.faction.add(lc(f.id)); ns.faction.add(lc(f.faction)); ns.faction.add(lc(f.name)); }
  for (const n of s?.npcs || []) { ns.npc.add(lc(n.id)); ns.npc.add(lc(n.name)); }
  // Mirror setNeighbourRelationship's match: a relationship event resolves its
  // target against link name / neighbourName / id / linkId.
  for (const link of s?.neighbourNetwork || []) {
    ns.neighbour.add(lc(link?.name));
    ns.neighbour.add(lc(link?.neighbourName));
    ns.neighbour.add(lc(link?.id));
    ns.neighbour.add(lc(link?.linkId));
  }
  for (const k of s?.config?.nearbyResources || []) ns.resource.add(lc(k));
  for (const r of s?.resources || []) { ns.resource.add(lc(r.id || r.key || r.name)); ns.resource.add(lc(r.name)); }
  // RESOLVE_STRESSOR targets — a mirror of resolveStressor's own matching.
  // Live stress entries match by type or name (canonStressors reads the array
  // containers AND the bare-object shape pipeline settlements carry).
  // Conditions match by their stamp (triggeredAt.sourceEventTargetId) here,
  // or by archetype via ns.stressorArchetype (nsHas runs the promotion rule
  // on the ref). Recorded config.eventConditions count alongside the live
  // array because the stress entry is a derivation output a regeneration
  // re-rolls away while the condition survives via the record. Campaign-owned
  // conditions (origin cause = a regional channel / the world pulse) are
  // excluded — resolveStressor refuses to wind them down.
  for (const st of canonStressors(s)) {
    ns.stressor.add(lc(st?.type));
    ns.stressor.add(lc(st?.name));
  }
  const recorded = [
    ...(Array.isArray(s?.config?.eventConditions) ? s.config.eventConditions : []),
    ...(Array.isArray(s?._config?.eventConditions) ? s._config.eventConditions : []),
  ];
  const locallyOwned = (c) => {
    const origin = String(c?.causes?.[0]?.source ?? '');
    return origin === '' || origin === 'event' || origin === 'generation';
  };
  for (const c of [...(s?.activeConditions || []).filter(locallyOwned), ...recorded]) {
    ns.stressor.add(lc(c?.triggeredAt?.sourceEventTargetId));
    ns.stressorArchetype.add(lc(c?.archetype));
  }
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
  if (kind === 'npcOrFactionOrInstitution') {
    return ns.npc.has(r) || ns.faction.has(r) || ns.institution.has(r)
      || ns.npc.has(label) || ns.faction.has(label) || ns.institution.has(label);
  }
  if (kind === 'neighbour') {
    // setNeighbourRelationship matches the targetId VERBATIM against the link
    // fields (no de-slug), so validate the exact lowercased ref only — a
    // de-slugged near-miss would validate a target the mutation then no-ops on.
    return ns.neighbour.has(r);
  }
  if (kind === 'stressor') {
    // Exact lowercased entry/stamp match first — the picker path. Free text
    // reaches the mutation's archetype bridge instead: text whose
    // archetypeForStressor rule matches a locally-owned (or recorded)
    // condition's archetype resolves ("the war is over" → war_pressure), and
    // text matching neither blocks. No labelFromTarget fallback here —
    // resolveStressor compares verbatim lowercase, so a de-slugged near-miss
    // would validate a target the mutation then no-ops on.
    if (ns.stressor.has(r)) return true;
    const archetype = archetypeForStressor({ type: ref });
    return archetype != null && ns.stressorArchetype.has(lc(archetype));
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
