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
  withImpairment, withoutEventImpairments, effectiveStatus,
} from '../entities/status.js';
import { propagateImpairment } from '../entities/propagate.js';
import { createNpc, killNpc, assignNpcToRole, inferImportance } from '../entities/npcs.js';
import { applyCorruptionImpairments } from '../worldPulse/corruptionImpair.js';
// The two sim appliers are imported from their dependency-light LEAVES (W2b
// byte-budget extraction), NOT from religionState.js / tierResourceDynamics.js:
// this module is statically reachable from the eager store via the mutate.js
// router, and the fat modules drag the pulse kernel (pantheon, relationshipState,
// worldState, simulationRules, canonicalAccessors, supplyChainData, goodsCatalog,
// resourceTaxonomy) into the first-paint closure. The fat modules re-export the
// same leaf objects, so both paths read ONE applier (referential identity).
import { reconcileCultImposition } from '../worldPulse/cultImpositionApply.js';
// The ONE commit-time embed builder every persisting writer shares (W-FAITH F3c /
// ODQ §866), so the writers cannot drift apart as they once did on `lawAxis`.
// ⛔⛔ FROM THE ZERO-IMPORT LEAF, NEVER FROM `deitySnapshot.js` — the same first-paint
// law the cultImpositionApply note above states, measured again at SUBSTRATE wave 6:
// this module is eager, and reaching the builder through `deitySnapshot.js` dragged the
// AUTHORING and RESTORE halves (`deitySnapshotFrom`, `worldFaithsForSave`, both lazy-only
// consumers) into first paint for 653 B. Re-widening this specifier re-spends them.
import { commitDeityEmbed } from '../deityCommitEmbed.js';
import { applyTierOutcomeToSettlement } from '../worldPulse/tierOutcomeApply.js';
import { TIER_ORDER, POPULATION_RANGES, popToTier } from '../../data/constants.js';
import { successorNpc } from '../worldPulse/successorNpc.js';
import { createPRNG } from '../../kernel/prng.js';
import { rollsRegisterVii } from '../density/densityLaw.js';
import { importanceForRung } from '../density/densityRungs.js';
import { institutionIsFoodAnchor } from '../institutionClassify.js';
import { withActiveCondition, withoutActiveCondition, deriveAllActiveConditions } from '../activeConditions.js';
import { corruptionVectorForFlaw, npcCorruptibleFlaw, readCorruptionClimate, npcHomeInstitution } from '../corruption.js';
import {
  idOf, factionIdOf, eventTime,
  findInstitution, findFaction, findNpc,
  replaceInstitution, replaceFaction, replaceNpc,
  labelFromTarget, slugify,
  vetoMutation, sev01,
} from './mutateHelpers.js';

// A settlement / entity / event is a schemaless open object at this layer — every
// handler spreads it (`{ ...s, ... }`) and reads a wide, evolving surface with no
// single schema to import (mirrors the pre-split mutate.js typedefs). These
// aliases document intent while keeping the pure-`any` reality centralized.
/** @typedef {any} MutSettlement */
/** @typedef {any} MutEntity */
/** @typedef {any} MutateEvent */

// ── Institution mutations ──────────────────────────────────────────────────

/**
 * @param {MutSettlement} s
 * @param {MutateEvent} event
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
/** @param {MutEntity} inst */
// Id-first (rename-proof) food-anchor test. The name rule + its catalog-id twin
// now live at the canonical join (institutionIsFoodAnchor in computeActiveChains,
// alongside the other institutionMatches* joins); this local alias keeps the two
// call sites below reading unchanged. Id-match === the old name rule for every
// unrenamed catalog institution (byte-identical), but a DM-renamed-but-stamped
// granary ("Old Pete's grain hoard") now stays a food anchor via its stamped id.
const isFoodAnchorInstitution = institutionIsFoodAnchor;

// Promote the food_anchor_lost condition when a food anchor is destroyed or
// crippled. These archetypes had rich consumers (capacity, causal, daily life,
// districts, threats) but NO producer — destroying the granary updated faction
// edges yet never raised the food crisis those consumers were waiting for.
/**
 * @param {MutSettlement} next
 * @param {MutEntity} inst
 * @param {MutateEvent} event
 * @param {MutEntity} severity
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

// True when an institution STILL carries a capacity impairment severe enough to
// keep a food anchor broken. Mirrors the raise threshold (a single capacity
// impairment at severity >= 0.6 — see withFoodAnchorLostIfAnchor / impairInstitution);
// a covert mark never breaks an anchor. A still-removed/destroyed status also
// counts as broken. Used to gate the food-crisis wind-down so restoring an
// UNRELATED impairment on a granary that remains physically broken does not
// prematurely declare its food supply healthy again.
/** @param {MutEntity} inst */
function hasBreakingCapacityImpairment(inst) {
  if (inst?.status === STATUS_REMOVED || inst?.status === 'destroyed') return true;
  return (inst?.impairments || []).some(
    (/** @type {MutEntity} */ i) => i?.type === 'capacity' && i?.covert !== true && Number(i?.severity ?? 0) >= 0.6,
  );
}

// The inverse of withFoodAnchorLostIfAnchor: when a food-anchor institution is
// restored or re-opened, the settlement-level food_anchor_lost crisis it raised
// must not outlive it. We drop ONLY the conditions this exact institution
// triggered (matched by triggeredAt.sourceEventTargetId === the institution's
// id), so a food_anchor_lost crisis raised by a DIFFERENT anchor's loss survives.
// No-op for a non-anchor institution (it never raised one).
/**
 * @param {MutSettlement} next
 * @param {MutEntity} inst
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function damageInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return vetoMutation('institution_not_found', labelFromTarget(event.targetId));
  const severity = sev01(event.payload?.severity, 0.7);
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function removeInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return vetoMutation('institution_not_found', labelFromTarget(event.targetId));
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function addInstitution(s, event) {
  const name = labelFromTarget(event.targetId);
  const list = s.institutions || [];
  // Idempotent: if an institution with the same name already exists,
  // we don't duplicate — we just clear any prior REMOVED status.
  const existing = list.find((/** @type {MutEntity} */ i) => i.name?.toLowerCase() === name.toLowerCase());
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function impairInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return vetoMutation('institution_not_found', labelFromTarget(event.targetId));
  const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
    type: event.payload?.dimension || 'capacity',
    severity: sev01(event.payload?.severity, 0.5),
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function restoreInstitution(s, event) {
  const inst = findInstitution(s, event.targetId);
  if (!inst) return vetoMutation('institution_not_found', labelFromTarget(event.targetId));
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
  // But RESTORE is scoped to ONE prior impairment: restoring an UNRELATED (e.g.
  // most-recent) wound on an anchor that STILL carries a capacity break must not
  // declare the food supply healthy. Only wind down when the restore actually
  // left the anchor whole — no breaking capacity impairment remains.
  if (!hasBreakingCapacityImpairment(restored)) {
    next = withoutFoodAnchorLostFor(next, inst);
  }
  return next;
}

// The causeEventId of the most recently applied impairment (impairments append
// in order, so the last entry is newest). Null when the entity carries none.
/** @param {MutEntity} entity */
// entity is an institution OR faction (union) — left as any.
function latestImpairmentCause(entity) {
  const imps = Array.isArray(entity?.impairments) ? entity.impairments : [];
  if (!imps.length) return null;
  return imps[imps.length - 1]?.causeEventId ?? null;
}

// ── Faction mutations ──────────────────────────────────────────────────────

/**
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function impairFaction(s, event) {
  const faction = findFaction(s, event.targetId);
  if (!faction) return vetoMutation('faction_not_found', labelFromTarget(event.targetId));
  const impairment = /** @type {import('../entities/status.js').Impairment} */ ({
    type: event.payload?.dimension || 'public_support',
    severity: sev01(event.payload?.severity, 0.5),
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function restoreFaction(s, event) {
  const faction = findFaction(s, event.targetId);
  if (!faction) return vetoMutation('faction_not_found', labelFromTarget(event.targetId));
  // Same single-impairment scope as restoreInstitution: explicit cause, else the
  // most recent one — never a blanket clear of unrelated in-timeline impairments.
  const causeId = event.payload?.causeEventId ?? latestImpairmentCause(faction);
  const restored = causeId
    ? withoutEventImpairments(faction, causeId)
    : { ...faction, status: 'active' };
  return replaceFaction(s, faction, restored);
}

/**
 * ADD_FACTION — introduce a new faction. Idempotent by canonical name: an
 * existing faction is left byte-for-byte unchanged. New factions write to
 * powerStructure.factions (the canonical location) so the power-structure rerun
 * and seat logic see them.
 *
 * ⚠ THE OLD "NO REMOVAL LIFECYCLE" LINE IS RETIRED, AND THE REASON IS §810.4 R18.
 * This docblock used to read "Factions have impairment and restoration events, but
 * no removal lifecycle". That was true of the EVENT layer and it is still true of
 * the event layer — no verb here removes a house — but it is no longer true of the
 * world. R18 ruled roster-bound existence: in simulation, a faction whose named
 * roster reaches zero (death, exile, departure) CEASES TO EXIST, with a chronicle
 * receipt; history stays and live state is swept. The pulse's density lane
 * (`worldPulse/factionDensityKernel.js`) is that lifecycle's one writer, gated by
 * the world's own `_densityLawVersion`, so a world born before the law never sees it.
 *
 * WHAT STILL BINDS HERE, UNCHANGED: ADD_FACTION must not act as a hidden
 * resurrection path for unsupported provenance fields. If anything, R18 sharpens
 * that — a name can now legitimately have been dissolved, so re-adding one must
 * mint a NEW house on the ordinary road (atomic, with its founding member per R17)
 * and must never restore a record the world already ended.
 */
/**
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function addFaction(s, event) {
  const name = labelFromTarget(event.targetId) || event.payload?.name;
  if (!name) return vetoMutation('empty_target');
  const psFactions = s.powerStructure?.factions;
  const flatFactions = s.factions;
  const list = psFactions || flatFactions || [];
  const existing = list.find(
    (/** @type {MutEntity} */ f) => String(f.faction || f.name || '').toLowerCase() === name.toLowerCase(),
  );
  if (existing) return vetoMutation('faction_already_present', name);
  // ── ODQ §817-Q2 — THE ATOMIC MINT BINDS THE EVENT LAYER TOO ────────────────
  // §810.4 R17: "a faction and its first named NPC are ONE generation act — a
  // faction mints WITH ≥1 NPC or does not mint at all; NPC-less factions are
  // unrepresentable at birth on every generation path." The owner's own words
  // settle whether an authored event counts as a path: "there are no NPC-less
  // factions at all." R-DENSITY-CENSUS §4 #10 measured this mutator minting
  // `memberNpcIds: []` unconditionally.
  //
  // ⛔ VERSION-GATED, AND THAT IS LOAD-BEARING, NOT TIMIDITY. Event chains are
  // REPLAYED here (undo, rerun, rerun-keys), so an unconditional co-mint would
  // add a person to every already-authored ADD_FACTION in every existing
  // campaign the next time it replayed — lived history rewritten, which THE
  // PROMISE forbids. A world born under the density law co-mints; a world born
  // before it replays exactly what it always did.
  const foundingNpc = rollsRegisterVii(s.config || s._config || {})
    ? foundingMemberFor(s, event, name)
    : null;
  if (foundingNpc === REFUSED) return vetoMutation('faction_requires_member', name);
  const newFaction = {
    id: `faction.${slugify(name)}`,
    name,
    faction: name,
    status: 'active',
    description: event.description || '',
    impairments: [],
    internalSeats: {},
    memberNpcIds: foundingNpc ? [foundingNpc.id] : [],
    createdByEventId: event.id, // so undo can drop the faction this event created
  };
  // The founding member rides the SAME `createdByEventId`, so undo drops the
  // house and its founder together — an atomic mint has to be an atomic undo.
  const withNpc = foundingNpc
    ? { ...s, npcs: [...(s.npcs || []), foundingNpc] }
    : s;
  if (psFactions) {
    return { ...withNpc, powerStructure: { ...s.powerStructure, factions: [...psFactions, newFaction] } };
  }
  if (flatFactions) {
    return { ...withNpc, factions: [...flatFactions, newFaction] };
  }
  return { ...withNpc, powerStructure: { ...(s.powerStructure || {}), factions: [newFaction] } };
}

/** The typed refusal sentinel — distinguishable from "no member needed" (null).
 *  A sentinel rather than a throw so the veto stays the mutator's one exit. */
const REFUSED = Symbol('faction_requires_member');

/**
 * Mint the founding member an atomic faction mint requires. A payload that
 * names existing members satisfies the requirement without minting anyone.
 *
 * The founder's importance is the TIER'S HEAD BAND (§817-Q3: an occupied head
 * always rolls ≥ notable, capped by the tier's rank ceiling), read from the one
 * rung mapping — so an authored house's founder is exactly as senior as a
 * rolled one, and no second importance policy comes into existence.
 *
 * @param {MutSettlement} s @param {MutateEvent} event @param {string} name
 * @returns {Record<string, unknown>|null|typeof REFUSED}
 */
function foundingMemberFor(s, event, name) {
  const named = event.payload?.memberNpcIds || event.payload?.linkedNpcIds;
  if (Array.isArray(named) && named.length) return null; // already crewed
  const founderName = event.payload?.founderName || `The ${name} Founder`;
  if (!founderName.trim()) return REFUSED;
  // No cast: `factionAffiliation` is now DECLARED on NpcStructural (npcs.js), so this
  // literal is an honest `Partial<NpcStructural>`. The cast this replaces was the
  // file's fourth any-hole against a MONOTONE-DOWN allowance of three — declaring the
  // field retired it at the root instead of widening the ledger.
  const npc = createNpc({
    name: founderName,
    role: event.payload?.founderRole || 'Head',
    // ⭐ A ONE-FIELD ASSERTION, NOT A RE-WIDENING. Dropping the whole-object `any`
    // above exposed a real imprecision the cast had been HIDING: `importanceForRung`
    // derives its value from `IMPORTANCE_ORDER`, which is exactly `NpcImportance`,
    // but `Object.freeze` on a bare literal array infers `readonly string[]`, so the
    // whole chain (`clampImportanceToTier` → `rungBandsForTier` → `importanceForRung`)
    // degrades to `string`. The assertion states the fact the producer cannot yet
    // express. It is narrow and typed where the thing it replaces was total and
    // untyped, so the file's any-hole ledger still moves DOWN.
    // ⚠ DELIBERATELY NOT CURED AT THE ROOT HERE — documented, not a bug to re-find.
    // Annotating `IMPORTANCE_ORDER` as `readonly NpcImportance[]` is the true fix and
    // was BUILT AND MEASURED at D2b: it cures this site but reds `densityBands.js`
    // (`rankCeilingForTier` returns `string` into `importanceIndex`), so the honest
    // root cure is a 3-4 annotation pass across `src/generators/density/` — D1's
    // surface, not this car's. It is charted in the receipt as an owed row.
    importance: /** @type {import('../entities/npcs.js').NpcImportance} */ (
      importanceForRung('head', s.tier)
    ),
    factionAffiliation: name,
    linkedFactionIds: [`faction.${slugify(name)}`],
    _idSeed: `${event.id}:founder`,
  });
  npc.createdByEventId = event.id;
  // ⚠ THIS LINE IS LOAD-BEARING AND READS AS REDUNDANT — it is not. The literal
  // above also sets `factionAffiliation`, but `createNpc` builds from a DECLARED
  // field set and drops undeclared keys, so the founder would reach the world
  // house-less without this write and R17's atomic mint would be unsatisfied the
  // moment the faction exists. VERIFIED BY EXECUTION at D2b (createNpc returns
  // `factionAffiliation: undefined` for an input that carries it), not assumed —
  // deleting it as a duplicate is a silent bug, so the reason is recorded here.
  npc.factionAffiliation = name;
  return npc;
}

// ── NPC mutations ──────────────────────────────────────────────────────────

/**
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function addNpc(s, event) {
  const npc = createNpc(/** @type {MutEntity} */ ({
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
  }));
  npc.createdByEventId = event.id; // so undo can drop the NPC this event created
  return { ...s, npcs: [...(s.npcs || []), npc] };
}

/**
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function killNpcMutation(s, event) {
  const npc = findNpc(s, event.targetId);
  if (!npc) return vetoMutation('npc_not_found', labelFromTarget(event.targetId));
  const importance = event.payload?.importance || npc.importance || inferImportance(npc);
  const enriched = { ...npc, importance };
  const result = killNpc(/** @type {import('../entities/npcs.js').NpcStructural} */ (enriched), event.id);
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
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
  const idx = list.findIndex((/** @type {MutEntity} */ n) => idOf(n) === idOf(npc));
  const nextNpc = /** @type {MutEntity} */ (result.npc);
  /** @type {MutSettlement} */
  let next = idx >= 0
    ? { ...s, npcs: [...list.slice(0, idx), nextNpc, ...list.slice(idx + 1)] }
    : { ...s, npcs: [...list, nextNpc] };

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
      const healsThisVacancy = (/** @type {MutEntity} */ imp) => {
        if (imp.type !== 'staffing') return false;
        if (fillsEventId) return imp.causeEventId === fillsEventId;
        if (role) return String(imp.description || '').toLowerCase().includes(`(${role})`);
        return true; // no discriminator → v1 single-vacancy clear
      };
      const clearedImpairments = (targetInst.impairments || []).filter((/** @type {MutEntity} */ i) => !healsThisVacancy(i));
      const cleared = {
        ...targetInst,
        impairments: clearedImpairments,
        // Recompute status: filtering the healed staffing wound out of the
        // impairments array left the raw `status` field stale, so a fully-healed
        // institution kept rendering 'impaired'. effectiveStatus drops it to
        // 'active' when no visible impairment remains (and is a no-op when the
        // second vacancy's penalty is still present).
        status: effectiveStatus({ ...targetInst, impairments: clearedImpairments }),
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
/**
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function exposeCorruption(s, event) {
  // §corruption Phase 4 — prefer a corrupt NPC target: clean + scar them and
  // impair BOTH the tied criminal institution and their home institution/faction
  // (the same path organic exposure uses). Falls back to faction/institution:
  // exposing a faction/institution directly still scandalises it (our in-place
  // behaviour — the dead corruption_exposed consumer tree needs a producer).
  const npc = findNpc(s, event.targetId);
  if (npc && npc.corrupt) return exposeCorruptNpc(s, npc, event);

  const severity = sev01(event.payload?.severity, 0.7);
  const inst    = findInstitution(s, event.targetId);
  const faction = findFaction(s, event.targetId);
  const target  = inst || faction;
  if (!target) return vetoMutation('target_not_found', labelFromTarget(event.targetId));

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
  const scandal = (/** @type {MutEntity} */ next) => withActiveCondition(next, {
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

// DM exposes a specific corrupt NPC: impair the
// tied criminal + home institution/faction (shared organic path), then remove the
// disgraced NPC and install a fresh successor in their seat.
/**
 * @param {MutSettlement} s
 * @param {MutEntity} npc
 * @param {MutateEvent} event
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
  const nextNpcs = (/** @type {MutEntity} */ (next).npcs || []).map((/** @type {MutEntity} */ n) => (n === npc ? successorNpc(n, rng) : n));
  // The NPC scandal is also a durable corruption_exposed condition (see exposeCorruption).
  return withActiveCondition({ ...next, npcs: nextNpcs }, {
    archetype: 'corruption_exposed',
    severity: sev01(event.payload?.severity, 0.7),
    triggeredAt: { sourceEventType: 'EXPOSE_CORRUPTION', sourceEventTargetId: npc.id || npc.name },
    causes: [{ source: 'event', eventId: event.id, detail: `${npc.name} was publicly exposed as corrupt and ousted.` }],
  });
}

// Removing/destroying a criminal institution severs the
// corruption ties of NPCs bound to it: they separate from criminal activity.
// No-op for a non-criminal institution (no NPC names it as a tie).
/**
 * @param {MutSettlement} s
 * @param {MutEntity} institutionName
 */
function severCorruptionTiesTo(s, institutionName) {
  const n = String(institutionName || '').toLowerCase();
  if (!n) return s;
  let changed = false;
  const nextNpcs = (s.npcs || []).map((/** @type {MutEntity} */ npc) => {
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function imposeCorruption(s, event) {
  const npc = findNpc(s, event.targetId);
  // need a real, not-already-corrupt NPC
  if (!npc) return vetoMutation('npc_not_found', labelFromTarget(event.targetId));
  if (npc.corrupt) return vetoMutation('npc_already_corrupt', npc.name);

  // W-DOCTRINE-3b §6 — THE BENEFICIARY. A composer beneficiary leash (payload.leash, already
  // normalized by buildEvent) names a FOREIGN patron court and REPLACES the local-org rule (the
  // channel requirement): it must carry a resolvable settlement endpoint, else there is nothing
  // to leash to (no_beneficiary). Stamping the leash names NO local criminalInstitution — a
  // foreign conspirator's exposure blames no local guild (§4). Absent leash ⇒ today's local path
  // (a criminal org — BYTE-IDENTICAL). The vector derives from the NPC's own corruptible flaw.
  const leash = event.payload?.leash;
  if (leash && !leash.settlementId) return vetoMutation('no_beneficiary');
  const orgName = event.payload?.criminalInstitution || readCorruptionClimate(s).criminalInstitutions[0] || null;
  if (!leash && !orgName) return vetoMutation('no_criminal_org');
  const corrupted = {
    ...npc,
    corrupt: true,
    corruptionVector: corruptionVectorForFlaw(npcCorruptibleFlaw(npc)),
    corruptTies: { ...(npc.corruptTies || {}), ...(leash ? { leash } : { criminalInstitution: orgName }) },
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
 * @param {MutSettlement} s
 * @param {MutateEvent} event
 */
function swapNpcStanding(s, event) {
  // Empty refs must never reach findNpc: '' loose-matches the first NPC
  // whose id is null (String(null || '') === ''), silently swapping with a
  // bystander instead of no-opping.
  const peerRef = event.payload?.swapWithNpcId || event.payload?.swapWithName;
  if (!event.targetId || !peerRef) return vetoMutation('swap_pair_incomplete');
  const a = findNpc(s, event.targetId);
  const b = findNpc(s, peerRef);
  if (!a || !b || a === b) return vetoMutation('swap_pair_invalid');
  // Standing swaps stay inside ONE faction (the owner's design). If both
  // NPCs declare an affiliation and they differ, this is a mis-targeted
  // event — no-op rather than mis-stamp a foreign factionId onto the peer.
  if (a.factionAffiliation && b.factionAffiliation
    && String(a.factionAffiliation).toLowerCase() !== String(b.factionAffiliation).toLowerCase()) {
    return vetoMutation('swap_cross_faction', `${a.name} / ${b.name}`);
  }

  // Swap presence AS WELL AS value: when `from` carries the field, copy it
  // over; when `from` LACKS it but `onto` has it, DELETE it from next rather
  // than assigning `undefined` (which downstream readers that distinguish
  // 'absent' from 'undefined' — inferImportance fallbacks, dotRank adoption —
  // treat differently). The swap is then symmetric in presence and value.
  const carryStanding = (/** @type {MutEntity} */ from, /** @type {MutEntity} */ onto) => {
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
 * @param {MutSettlement} s
 * @param {{ targetId?: string, payload?: { deityRef?: string|null, snapshot?: MutEntity } }} event
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
  // Embed a self-contained copy through the ONE shared commit-time builder, which
  // re-picks the exact snapshot fields (never spreads the raw payload) so an
  // unexpected field — especially any wall-clock stamp — cannot leak into the
  // embedded record a deriver reads.
  config.primaryDeitySnapshot = commitDeityEmbed(ref, snapshot);
  return { ...s, config };
}

/**
 * IMPOSE_CULT — seed (or remove) a CULT-level deity into a settlement, BENEATH the
 * patron. Mirrors setPrimaryDeity's embed discipline: the store resolves the ref →
 * snapshot (it can read customContent; this handler is pure and cannot), and we
 * hand-pick + freeze the exact snapshot fields so no wall-clock or foreign field
 * leaks in. Placement (tier capacity, one-deity-per-niche, weakest-cult eviction on
 * a full small settlement) is decided by the pure `reconcileCultImposition`. A
 * null/absent snapshot REMOVES the cult named by deityRef (or clears all cults when
 * no ref is given); an emptied list drops the key so a cult-free settlement is
 * structurally identical to one that never had a cult (the dormancy oracle).
 *
 * @param {MutSettlement} s
 * @param {{ targetId?: string, payload?: { deityRef?: string|null, snapshot?: MutEntity } }} event
 */
function imposeCult(s, event) {
  const ref = event.payload?.deityRef ?? event.targetId ?? null;
  const snapshot = event.payload?.snapshot ?? null;
  const config = { ...(s.config || {}) };
  const cults = Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots.filter(Boolean) : [];

  // Remove path: a null snapshot drops the named cult (or clears all when no ref).
  if (!snapshot) {
    const next = ref
      ? cults.filter((/** @type {MutEntity} */ c) => String(c?._deityRef || c?.name || '') !== String(ref))
      : [];
    if (!next.length) delete config.cultDeitySnapshots;
    else config.cultDeitySnapshots = Object.freeze(next.map((/** @type {MutEntity} */ c) => Object.freeze({ ...c })));
    return { ...s, config };
  }

  // Add/replace path. Embed a self-contained, frozen copy through the shared
  // commit-time builder, then reconcile it against capacity + niche. The ref
  // resolution is this writer's OWN — a cult may be imposed without an explicit
  // ref, so it falls back through the snapshot's identity — and that is exactly the
  // decision the shared builder leaves to its callers.
  const entry = commitDeityEmbed(String(ref || snapshot._deityRef || snapshot.name || ''), snapshot);
  const tier = s.tier || config.tier || 'village';
  const result = reconcileCultImposition({ patron: config.primaryDeitySnapshot || null, cults, tier, deity: entry });
  if (result.action === 'refused') {
    return vetoMutation(`cult_${result.reason}`, entry.name);
  }
  if (!result.cults.length) delete config.cultDeitySnapshots;
  else config.cultDeitySnapshots = Object.freeze(result.cults.map((/** @type {MutEntity} */ c) => Object.freeze({ ...c })));
  return { ...s, config };
}

/**
 * SHIFT_TIER — a DM-forced one-step settlement PROMOTION or DEMOTION (an override of the
 * organic tier-drift system, tierResourceDynamics). Rebands population into the target
 * tier's band, then REUSES the world-pulse apply path verbatim so the institution roster
 * surgery (a promotion adds/reactivates the new tier's required institutions; a demotion
 * leaves over-tier ones as inactive RUINED remnants with their fates) and the tier +
 * institution history are byte-identical to an organic tier change. One tier per call; a
 * no-op at the cap (metropolis) or floor (thorp).
 * @param {MutSettlement} s
 * @param {{ payload?: { direction?: string } }} event
 */
function shiftTier(s, event) {
  const direction = event.payload?.direction === 'demotion' ? 'demotion' : 'promotion';
  const fromTier = s.tier || s.config?.tier || popToTier(Number(s.population) || 0);
  const idx = TIER_ORDER.indexOf(fromTier);
  if (idx < 0) return vetoMutation('tier_unknown', String(fromTier));
  const toTier = TIER_ORDER[direction === 'promotion' ? idx + 1 : idx - 1];
  if (!toTier) return vetoMutation('tier_at_bound', direction);
  // Reband population into the target band — a forced shift needs it (the organic path
  // does not, since population already crossed the threshold). A plain clamp lands a
  // promotion at the band floor and a demotion at the band ceiling, leaving an already
  // in-band population unchanged.
  const band = /** @type {Record<string, { min: number, max: number }>} */ (POPULATION_RANGES)[toTier];
  const curPop = Number(s.population) || 0;
  const population = band ? Math.min(band.max, Math.max(band.min, curPop)) : curPop;
  // Reuse the organic apply path (institution surgery + history + tier write). Pass
  // tier: fromTier explicitly so its stale-guard (currentTier === fromTier) passes.
  const outcome = { id: `dm_shift_tier:${String(s.id || 'settlement')}:${fromTier}>${toTier}`, tierChange: { fromTier, toTier, direction } };
  return applyTierOutcomeToSettlement({ ...s, tier: fromTier, population }, outcome);
}

export {
  destroySettlement,
  damageInstitution, removeInstitution, addInstitution,
  impairInstitution, restoreInstitution,
  impairFaction, restoreFaction, addFaction,
  addNpc, killNpcMutation, assignNpcMutation, killLeaderMutation,
  exposeCorruption, imposeCorruption,
  swapNpcStanding, setPrimaryDeity, imposeCult, shiftTier,
};
