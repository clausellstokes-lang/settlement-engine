/**
 * domain/events/mutateEntities.js — event-mutation handlers for the settlement's
 * ENTITIES: institutions, factions, NPCs, corruption, NPC standing, and the
 * primary deity. These cohere as one module because they cross-reference each
 * other (removeInstitution severs corruption ties; KILL_LEADER reuses KILL_NPC).
 *
 * Extracted verbatim from mutate.js as part of the god-module split — every
 * handler body is byte-identical to its pre-split form. The mutate.js router
 * imports these and dispatches to them by event type.
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
import { withActiveCondition, withoutActiveCondition, deriveAllActiveConditions } from '../activeConditions.js';
import { corruptionVectorForFlaw, npcCorruptibleFlaw, readCorruptionClimate, npcHomeInstitution } from '../corruption.js';
import {
  idOf, factionIdOf, eventTime,
  findInstitution, findFaction, findNpc,
  replaceInstitution, replaceFaction, replaceNpc,
  labelFromTarget, slugify,
} from './mutateHelpers.js';

// ── Institution mutations ──────────────────────────────────────────────────

/**
 * @param {any} s
 * @param {any} event
 */
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
/** @param {any} inst */
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
/**
 * @param {any} next
 * @param {any} inst
 * @param {any} event
 * @param {any} severity
 */
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
    causes: [{ source: 'event', eventId: event.id, detail: `${inst.name} is out of action. The settlement's food supply lost an anchor.` }],
  });
}

// The inverse of withFoodAnchorLostIfAnchor: when a food-anchor institution is
// restored or re-opened, the settlement-level food_anchor_lost crisis it raised
// must not outlive it. We drop ONLY the conditions this exact institution
// triggered (matched by triggeredAt.sourceEventTargetId === the institution's
// id), so a food_anchor_lost crisis raised by a DIFFERENT anchor's loss survives.
// No-op for a non-anchor institution (it never raised one).
/**
 * @param {any} next
 * @param {any} inst
 */
function withoutFoodAnchorLostFor(next, inst) {
  if (!isFoodAnchorInstitution(inst)) return next;
  const anchorId = idOf(inst);
  let out = next;
  for (const c of deriveAllActiveConditions(out)) {
    if (c.archetype === 'food_anchor_lost'
      && c.triggeredAt?.sourceEventTargetId === anchorId) {
      out = withoutActiveCondition(out, c.id);
    }
  }
  return out;
}

/**
 * @param {any} s
 * @param {any} event
 */
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

/**
 * @param {any} s
 * @param {any} event
 */
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
  // Closing a criminal institution frees the NPCs tied to it.
  next = severCorruptionTiesTo(next, inst.name);
  // Losing a food anchor entirely is the canonical food_anchor_lost crisis.
  next = withFoodAnchorLostIfAnchor(next, inst, event, 0.7);
  return next;
}

/**
 * @param {any} s
 * @param {any} event
 */
function addInstitution(s, event) {
  const name = labelFromTarget(event.targetId);
  const list = s.institutions || [];
  // Idempotent: if an institution with the same name already exists,
  // we don't duplicate — we just clear any prior REMOVED status.
  const existing = list.find((/** @type {any} */ i) => i.name?.toLowerCase() === name.toLowerCase());
  if (existing) {
    // Re-open is scoped like restoreInstitution: clear ONLY the removal — the
    // REMOVED/DESTROYED status and any impairments whose cause was that removal
    // (removedByEventId) — never a blanket clear that would wipe UNRELATED
    // impairments from other in-timeline events.
    const removalCause = existing.removedByEventId || existing.destroyedByEventId || null;
    const { removedByEventId: _r, destroyedByEventId: _d, ...rest } = existing;
    const restored = {
      ...(removalCause ? withoutEventImpairments(rest, removalCause) : rest),
      status: 'active',
    };
    let next = replaceInstitution(s, existing, restored);
    // A re-opened food anchor ends the food crisis its closure raised.
    next = withoutFoodAnchorLostFor(next, existing);
    return next;
  }
  const newInst = {
    id: `institution.${slugify(name)}`,
    name,
    category: event.payload?.category || 'civic',
    status: 'active',
    description: event.description || '',
    plotHooks: [],
    createdByEventId: event.id, // so undo can drop the institution this event created
  };
  return { ...s, institutions: [...list, newInst] };
}

/**
 * @param {any} s
 * @param {any} event
 */
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

/**
 * @param {any} s
 * @param {any} event
 */
function restoreInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return s;
  // Restore is scoped to ONE prior impairment. With an explicit causeEventId we
  // undo exactly that event; without one we undo the MOST RECENT impairment (the
  // last-applied cause) — never a blanket clear, which would wipe impairments
  // from UNRELATED in-timeline events the restore was never meant to touch.
  const causeId = event.payload?.causeEventId ?? latestImpairmentCause(inst);
  const restored = causeId
    ? withoutEventImpairments(inst, causeId)
    : { ...inst, status: 'active' };
  let next = replaceInstitution(s, inst, restored);
  // A restored food anchor is functional again — wind down the settlement-level
  // food crisis its loss raised (the inverse of damage/impair/remove raising it).
  next = withoutFoodAnchorLostFor(next, inst);
  return next;
}

// The causeEventId of the most recently applied impairment (impairments append
// in order, so the last entry is newest). Null when the entity carries none.
/** @param {any} entity */
function latestImpairmentCause(entity) {
  const imps = Array.isArray(entity?.impairments) ? entity.impairments : [];
  if (!imps.length) return null;
  return imps[imps.length - 1]?.causeEventId ?? null;
}

// ── Faction mutations ──────────────────────────────────────────────────────

/**
 * @param {any} s
 * @param {any} event
 */
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

/**
 * @param {any} s
 * @param {any} event
 */
function restoreFaction(s, event) {
  const faction = findFaction(s, event.targetId);
  if (!faction) return s;
  // Same single-impairment scope as restoreInstitution: explicit cause, else the
  // most recent one — never a blanket clear of unrelated in-timeline impairments.
  const causeId = event.payload?.causeEventId ?? latestImpairmentCause(faction);
  const restored = causeId
    ? withoutEventImpairments(faction, causeId)
    : { ...faction, status: 'active' };
  return replaceFaction(s, faction, restored);
}

/**
 * ADD_FACTION — introduce a new faction. Mirrors addInstitution: idempotent
 * by name (re-adding an existing faction just clears removed/impaired state),
 * and writes to powerStructure.factions (the canonical location) so the
 * power-structure rerun and seat logic see it.
 */
/**
 * @param {any} s
 * @param {any} event
 */
function addFaction(s, event) {
  const name = labelFromTarget(event.targetId) || event.payload?.name;
  if (!name) return s;
  const psFactions = s.powerStructure?.factions;
  const flatFactions = s.factions;
  const list = psFactions || flatFactions || [];
  const existing = list.find(
    (/** @type {any} */ f) => String(f.name || f.faction || '').toLowerCase() === name.toLowerCase(),
  );
  if (existing) {
    // Re-add is scoped like restoreFaction: clear ONLY the removal — the
    // REMOVED/DESTROYED status and any impairments whose cause was that removal
    // (removedByEventId) — never a blanket clear that wipes UNRELATED impairments
    // from other in-timeline events (a riot, a levy) the re-add never touched.
    const removalCause = existing.removedByEventId || existing.destroyedByEventId || null;
    const { removedByEventId: _r, destroyedByEventId: _d, ...rest } = existing;
    const restored = {
      ...(removalCause ? withoutEventImpairments(rest, removalCause) : rest),
      status: 'active',
    };
    return replaceFaction(s, existing, restored);
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
    createdByEventId: event.id, // so undo can drop the faction this event created
  };
  if (psFactions) {
    return { ...s, powerStructure: { ...s.powerStructure, factions: [...psFactions, newFaction] } };
  }
  if (flatFactions) {
    return { ...s, factions: [...flatFactions, newFaction] };
  }
  return { ...s, powerStructure: { ...(s.powerStructure || {}), factions: [newFaction] } };
}

// ── NPC mutations ──────────────────────────────────────────────────────────

/**
 * @param {any} s
 * @param {any} event
 */
function addNpc(s, event) {
  const npc = createNpc({
    name: labelFromTarget(event.targetId) || event.payload?.name,
    role: event.payload?.role,
    importance: event.payload?.importance || 'notable',
    linkedInstitutionIds: event.payload?.linkedInstitutionIds || [],
    linkedFactionIds:     event.payload?.linkedFactionIds || [],
    influence:            event.payload?.influence,
    legitimacyContribution: event.payload?.legitimacyContribution,
    // Authored descriptive traits — surfaced verbatim on the NPC read card.
    flaw:        event.payload?.flaw,
    temperament: event.payload?.temperament,
    goal:        event.payload?.goal,
    constraint:  event.payload?.constraint,
    secret:      event.payload?.secret,
    _idSeed: event.id, // deterministic, event-scoped id (avoids same-name collisions)
  });
  npc.createdByEventId = event.id; // so undo can drop the NPC this event created
  return { ...s, npcs: [...(s.npcs || []), npc] };
}

/**
 * @param {any} s
 * @param {any} event
 */
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
    if (inst) next = replaceInstitution(next, inst, withImpairment(inst, /** @type {import('../entities/status.js').Impairment} */ (impairment)));
  }
  for (const { factionId: fid, impairment } of result.factionImpairments) {
    const faction = findFaction(next, fid);
    if (faction) next = replaceFaction(next, faction, withImpairment(faction, /** @type {import('../entities/status.js').Impairment} */ (impairment)));
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

  // Re-assert the DIRECT impairments after propagation. Propagation walks the
  // dead NPC's own linked institutions/factions as its first hop, so it lands a
  // second, damped staffing/leadership hit on the very entities we just wounded
  // directly above. Because withImpairment is idempotent per (type, cause), that
  // damped hit REPLACES the full direct severity — silently weakening a pillar's
  // death from 1.0 down to the propagated 0.6. Re-stamping the direct impairment
  // last restores its full severity, so each linked entity carries it EXACTLY
  // once at the correct strength while propagation's further-hop reach (to OTHER
  // neighbours of those entities) is preserved.
  for (const { instId, impairment } of result.institutionImpairments) {
    const inst = findInstitution(next, instId);
    if (inst) next = replaceInstitution(next, inst, withImpairment(inst, /** @type {import('../entities/status.js').Impairment} */ (impairment)));
  }
  for (const { factionId: fid, impairment } of result.factionImpairments) {
    const faction = findFaction(next, fid);
    if (faction) next = replaceFaction(next, faction, withImpairment(faction, /** @type {import('../entities/status.js').Impairment} */ (impairment)));
  }
  return next;
}

/**
 * @param {any} s
 * @param {any} event
 */
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
  const idx = list.findIndex((/** @type {any} */ n) => idOf(n) === idOf(npc));
  let next = idx >= 0
    ? { ...s, npcs: [...list.slice(0, idx), result.npc, ...list.slice(idx + 1)] }
    : { ...s, npcs: [...list, result.npc] };

  // Restore staffing impairments on the institution caused by prior
  // KILL_NPC events. Capacity-recovery factor scales by quality.
  if (institutionId) {
    const targetInst = findInstitution(next, institutionId);
    if (targetInst) {
      // Clear ONLY the staffing wound this assignment actually fills, so an
      // institution that lost two pillars and gets ONE vacancy filled keeps
      // the second role's penalty. Discriminator precedence:
      //   1. payload.fillsVacancyEventId — the exact prior KILL_NPC's id;
      //   2. the role being filled — the kill stamped the dead NPC's role into
      //      the staffing impairment description ('… (Captain)'), so a same-role
      //      fill heals only that role's vacancy;
      //   3. neither — fall back to the v1 single-vacancy behaviour (clear all
      //      staffing) so callers that supply no discriminator are unchanged.
      const fillsEventId = event.payload?.fillsVacancyEventId;
      const role = String(event.payload?.role || '').trim().toLowerCase();
      const healsThisVacancy = (/** @type {any} */ imp) => {
        if (imp.type !== 'staffing') return false;
        if (fillsEventId) return imp.causeEventId === fillsEventId;
        if (role) return String(imp.description || '').toLowerCase().includes(`(${role})`);
        return true; // no discriminator → v1 single-vacancy clear
      };
      const cleared = {
        ...targetInst,
        impairments: (targetInst.impairments || []).filter((/** @type {any} */ i) => !healsThisVacancy(i)),
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

// ── Extended event handlers ─────────────────────────────────────────────────

/**
 * KILL_LEADER — kill the named NPC at pillar importance regardless of
 * what the NPC record says. The "leader" framing is a contract: the
 * settlement's primary authority is gone, with all the consequences
 * that entails. Reuses killNpcMutation under the hood.
 */
/**
 * @param {any} s
 * @param {any} event
 */
function killLeaderMutation(s, event) {
  const enrichedEvent = {
    ...event,
    payload: { ...(event.payload || {}), importance: 'pillar' },
  };
  return killNpcMutation(s, enrichedEvent);
}

/**
 * EXPOSE_CORRUPTION — NPC-only. A corrupt NPC is publicly revealed: cleaned,
 * scarred, replaced by a successor, and the corruption_exposed scandal is
 * stamped. The criminal institution they answered to and their home
 * institution/faction become tarnished ONLY through chain propagation from the
 * exposed NPC (applyCorruptionImpairments) — never by direct faction or
 * institution exposure. A non-corrupt or non-NPC target is a no-op.
 */
/**
 * @param {any} s
 * @param {any} event
 */
function exposeCorruption(s, event) {
  const npc = findNpc(s, event.targetId);
  if (npc && npc.corrupt) return exposeCorruptNpc(s, npc, event);
  // Decision 3: the direct faction/institution expose path is removed. A
  // faction or institution becomes scandalised solely via propagation from an
  // exposed NPC, so there is nothing to do for a non-corrupt-NPC target.
  return s;
}

// DM exposes a specific corrupt NPC: impair the
// tied criminal + home institution/faction (shared organic path), then remove the
// disgraced NPC and install a fresh successor in their seat.
/**
 * @param {any} s
 * @param {any} npc
 * @param {any} event
 */
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
  const nextNpcs = (/** @type {any} */ (next).npcs || []).map((/** @type {any} */ n) => (n === npc ? successorNpc(n, rng) : n));
  // The NPC scandal is also a durable corruption_exposed condition (see exposeCorruption).
  return withActiveCondition({ ...next, npcs: nextNpcs }, {
    archetype: 'corruption_exposed',
    severity: Number(event.payload?.severity ?? 0.7),
    triggeredAt: { sourceEventType: 'EXPOSE_CORRUPTION', sourceEventTargetId: npc.id || npc.name },
    causes: [{ source: 'event', eventId: event.id, detail: `${npc.name} was publicly exposed as corrupt and ousted.` }],
  });
}

// Removing/destroying a criminal institution severs the
// corruption ties of NPCs bound to it: they separate from criminal activity.
// No-op for a non-criminal institution (no NPC names it as a tie).
/**
 * @param {any} s
 * @param {any} institutionName
 */
function severCorruptionTiesTo(s, institutionName) {
  const n = String(institutionName || '').toLowerCase();
  if (!n) return s;
  let changed = false;
  const nextNpcs = (s.npcs || []).map((/** @type {any} */ npc) => {
    if (npc.corrupt && String(npc.corruptTies?.criminalInstitution || '').toLowerCase() === n) {
      changed = true;
      return { ...npc, corrupt: false, corruptionVector: null, ousted: true };
    }
    return npc;
  });
  return changed ? { ...s, npcs: nextNpcs } : s;
}

// IMPOSE_CORRUPTION: a DM turns a clean NPC by linking them to a criminal
// organization in the settlement. We write the EXACT shape the world-pulse corruption loop
// seeds from — npc.corrupt + corruptionVector + corruptTies.criminalInstitution (npcAgency.js
// reads these to evolve corruption, advance faction capture from the seat, and gate exposure) —
// so the corruption is canon + visible + propagates, and EXPOSE_CORRUPTION can later target them.
// Covert by design: no public legitimacy impairment here (that is the exposure consequence).
/**
 * @param {any} s
 * @param {any} event
 */
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
  let next = replaceNpc(s, npc, corrupted);

  // Scope: 'individual_institution' captures the NPC's home institution too —
  // a COVERT 'corruption' impairment, not a public legitimacy hit (that is the
  // exposure consequence). It marks the institution as compromised in-chain:
  // compromisedSecurityInstitutions reads a 'corruption'-typed impairment as
  // 'revealed', so we keep this covert by stamping covert:true and letting the
  // dossier surface it honestly. The NPC alone already homes the covert drag;
  // this extends a tangible institutional marker for the bigger scope.
  if (event.payload?.scope === 'individual_institution') {
    const homeName = npcHomeInstitution(corrupted);
    const homeInst = homeName ? findInstitution(next, homeName) : null;
    if (homeInst) {
      const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
        type: 'corruption',
        severity: 0.3,
        covert: true,
        causeEventId: event.id,
        appliedAt: event.timestamp || event.createdAt || null,
        description: `${corrupted.name}'s capture quietly compromised ${homeInst.name}.`,
      });
      next = replaceInstitution(next, homeInst, withImpairment(homeInst, impairment));
    }
  }
  return next;
}

// ── NPC standing ─────────────────────────────────────────────────────────────

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
/**
 * @param {any} s
 * @param {any} event
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

  // Swap presence AS WELL AS value: when `from` carries the field, copy it
  // over; when `from` LACKS it but `onto` has it, DELETE it from next rather
  // than assigning `undefined` (which downstream readers that distinguish
  // 'absent' from 'undefined' — inferImportance fallbacks, dotRank adoption —
  // treat differently). The swap is then symmetric in presence and value.
  const carryStanding = (/** @type {any} */ from, /** @type {any} */ onto) => {
    const next = { ...onto };
    for (const field of NPC_STANDING_FIELDS) {
      if (field in from) next[field] = from[field];
      else if (field in next) delete next[field];
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

// ── Religion ────────────────────────────────────────────────────────────────

/**
 * SET_PRIMARY_DEITY — assign (or clear) a settlement's primary deity. This is
 * the COMMIT half of the embed-on-assign bridge: the store layer RESOLVES the
 * deity ref → a self-contained snapshot (it can read customContent; mutate.js is
 * pure and CANNOT), then dispatches the already-resolved snapshot in the event
 * payload. This handler just commits `config.primaryDeityRef` + the frozen
 * `config.primaryDeitySnapshot` so the pulse/derivers read ONLY the snapshot,
 * never the store. A null/absent payload deity clears the assignment (returns
 * the settlement to dormant). No wall-clock field is written.
 *
 * @param {any} s
 * @param {{ targetId?: string, payload?: { deityRef?: string|null, snapshot?: any } }} event
 */
function setPrimaryDeity(s, event) {
  const ref = event.payload?.deityRef ?? event.targetId ?? null;
  const snapshot = event.payload?.snapshot ?? null;
  const config = { ...(s.config || {}) };

  if (!ref || !snapshot) {
    // Clear → dormant. Drop both keys so a deity-free settlement is structurally
    // identical to one that never had a deity (the dormancy byte-identity oracle).
    delete config.primaryDeityRef;
    delete config.primaryDeitySnapshot;
    return { ...s, config };
  }

  config.primaryDeityRef = ref;
  // Embed a self-contained copy. We re-pick the exact snapshot fields (never
  // spread the raw payload) so an unexpected field — especially any wall-clock
  // stamp — can never leak into the embedded record a deriver reads.
  config.primaryDeitySnapshot = Object.freeze({
    _deityRef: ref,
    name: String(snapshot.name || ''),
    alignmentAxis: snapshot.alignmentAxis || 'neutral',
    temperamentAxis: snapshot.temperamentAxis || 'neutral',
    rankAxis: snapshot.rankAxis || 'minor',
    // lawAxis: a legacy 3-axis deity carries none ⇒ default 'neutral' (no
    // law_order term, byte-identical to a deity-free settlement on that axis).
    lawAxis: snapshot.lawAxis || 'neutral',
    ...(snapshot.domain ? { domain: String(snapshot.domain) } : {}),
  });
  return { ...s, config };
}

export {
  destroySettlement,
  damageInstitution, removeInstitution, addInstitution,
  impairInstitution, restoreInstitution,
  impairFaction, restoreFaction, addFaction,
  addNpc, killNpcMutation, assignNpcMutation, killLeaderMutation,
  exposeCorruption, imposeCorruption,
  swapNpcStanding, setPrimaryDeity,
};
