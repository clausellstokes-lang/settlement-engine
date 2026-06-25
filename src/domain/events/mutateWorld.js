/**
 * domain/events/mutateWorld.js — event-mutation handlers for the settlement's
 * WORLD-FACING state: resources, threats/riots, neighbour relationships + trade
 * routes, authored stressor crises, ruling-power transfers, and the editor
 * roster wave (trade goods + resource nodes).
 *
 * Extracted verbatim from mutate.js as part of the god-module split — every
 * handler body is byte-identical to its pre-split form. The mutate.js router
 * imports these and dispatches to them by event type.
 */

import { withImpairment } from '../entities/status.js';
import { propagateImpairment } from '../entities/propagate.js';
import { withActiveCondition, withoutActiveCondition, conditionIdFromArchetype } from '../activeConditions.js';
import { crisisOnset, crisisResolve } from '../crisisLifecycle.js';
import { transferRulingPower } from '../rulingPower.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { WAR_STRESSOR_TYPES, INFILTRATION_STRESSOR_TYPES, INFILTRATION_TARGET_RELATIONSHIPS } from '../worldPulse/warStressorTypes.js';
import { relationshipDefinition } from '../relationships/canonicalRelationship.js';
import {
  idOf, eventTime,
  findInstitution, replaceInstitution,
  labelFromTarget, slugify,
} from './mutateHelpers.js';

/** @typedef {import('../types.js').Event} Event */

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
function resolveRosterKey(/** @type {any} */ config, /** @type {any} */ raw) {
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
function slugEq(/** @type {any} */ a, /** @type {any} */ b) {
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
function resourceEditsOf(/** @type {any} */ config) {
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
function withResourceEdits(/** @type {any} */ s, /** @type {any} */ livePatch, /** @type {any} */ resourceEdits) {
  const next = { ...s, config: { ...(s.config || {}), ...livePatch, resourceEdits } };
  if (s._config && typeof s._config === 'object') {
    next._config = { ...s._config, resourceEdits };
  }
  return next;
}

function depleteResource(/** @type {any} */ s, /** @type {any} */ event) {
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
    depleted: edits.depleted.some((/** @type {any} */ k) => slugEq(k, key)) ? edits.depleted : [...edits.depleted, key],
    recovered: edits.recovered.filter((/** @type {any} */ k) => !slugEq(k, key)),
  });
}

// RECOVERED_RESOURCE — the inverse: clear BOTH depletion formats so chains, exports,
// food, and resource pressure all see the recovery. (Previously a registry no-op: the
// depleted set was never cleared, so a recovered resource stayed depleted forever.)
function recoveredResource(/** @type {any} */ s, /** @type {any} */ event) {
  const config = s.config || {};
  const raw = String(event.targetId || '').trim();
  if (!raw) return s;
  // Recorded under the roster-resolved form — the key a regenerated roster
  // holds. Recorded even when nothing was depleted LIVE: in random mode the
  // depletion may exist only in the re-roll, and the recovered record is
  // what forces it out there.
  const key = resolveRosterKey(config, raw);
  // Clear the LIVE depleted entry with the SAME slug-equivalent tolerance the
  // record uses (slugEq against the resolved key), not an exact membership test
  // over {raw, slug, label}. A depleted key stored in a form outside that set
  // (e.g. a verbatim custom name that only slug-matches) used to survive the
  // live filter while the record cleared it — the two formats then disagreed.
  const keys = new Set([raw, slugify(raw), labelFromTarget(raw)].filter(Boolean));
  const state = { ...(config.nearbyResourcesState || {}) };
  for (const k of Object.keys(state)) {
    if (state[k] === 'depleted' && (keys.has(k) || slugEq(k, key))) state[k] = 'allow';
  }
  const depleted = (config.nearbyResourcesDepleted || []).filter((/** @type {any} */ k) => !keys.has(k) && !slugEq(k, key));
  const edits = resourceEditsOf(config);
  return withResourceEdits(s, {
    nearbyResourcesState: state,
    nearbyResourcesDepleted: depleted,
  }, {
    ...edits,
    depleted: edits.depleted.filter((/** @type {any} */ k) => !slugEq(k, key)),
    recovered: edits.recovered.some((/** @type {any} */ k) => slugEq(k, key)) ? edits.recovered : [...edits.recovered, key],
  });
}

// REMOVED_THREAT — the party neutralized an active threat. Removes the matching
// stressor from whichever container carries it (canonical `stressors`, legacy
// `stress`/`stresses`), and when the removed threat was a SIEGE promotes the
// siege_lifted recovery condition — previously a registry no-op, leaving the
// siege_lifted consumer tree (defense/food/legitimacy/trade recovery) dead.
function removedThreat(/** @type {any} */ s, /** @type {any} */ event) {
  const label = labelFromTarget(event.targetId).toLowerCase();
  let next = { ...s };
  let removed = null;
  // Match precedence: an EXACT name/type hit wins over a substring hit so the
  // removal strikes the intended stressor, not the first one whose text merely
  // CONTAINS the label (substring collisions — 'rats' inside 'pirates'). A
  // substring fallback still helps free-text targets, but only for labels long
  // enough (≥4 chars) to be discriminating — a 1–3 char label matched far too
  // greedily.
  const exactMatch = (/** @type {any} */ st) => {
    const name = String(st?.name || '').toLowerCase();
    const type = String(st?.type || '').toLowerCase();
    return name === label || type === label;
  };
  const looseMatch = (/** @type {any} */ st) =>
    label.length >= 4 && `${st?.name || ''} ${st?.type || ''}`.toLowerCase().includes(label);
  for (const key of ['stressors', 'stress', 'stresses']) {
    const arr = Array.isArray(next[key]) ? next[key] : null;
    if (!arr || !label) continue;
    let idx = arr.findIndex(exactMatch);
    if (idx < 0) idx = arr.findIndex(looseMatch);
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
function startedRiot(/** @type {any} */ s, /** @type {any} */ event) {
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
// The canonical label is the SINGULAR 'trade_partner' — the plural this
// event historically wrote is recognized by no other subsystem (channel
// bundles minted 0 channels from it). Composer payloads still carry the
// plural, so normalize at the write chokepoint. (Kept tiny + local: the
// regional layer's canonicalRelationshipLabel covers the read side.)
const LEGACY_REL_ALIASES = { trade_partners: 'trade_partner' };
const canonicalRelType = (/** @type {any} */ rel) => LEGACY_REL_ALIASES[/** @type {keyof typeof LEGACY_REL_ALIASES} */ (String(rel || '').toLowerCase())] || rel;
function setNeighbourRelationship(/** @type {any} */ s, /** @type {any} */ event) {
  const targetId = event.targetId;
  if (!targetId) return s;
  const relType = event.type === 'BROKERED_ALLIANCE'
    ? ALLIANCE_REL
    : canonicalRelType(event.payload?.relationshipType || (event.type === 'SETTLEMENT_DISPUTE' ? 'rival' : 'trade_partner'));
  const network = Array.isArray(s.neighbourNetwork) ? s.neighbourNetwork : [];
  let touched = false;
  const next = network.map((/** @type {any} */ link) => {
    const matches = String(link?.name || '') === String(targetId)
      || String(link?.neighbourName || '') === String(targetId)
      || String(link?.id || '') === String(targetId)
      || String(link?.linkId || '') === String(targetId);
    if (!matches) return link;
    touched = true;
    return { ...link, relationshipType: relType, displayRelationshipType: relType, _relationshipEventId: event.id };
  });
  if (touched) return { ...s, neighbourNetwork: next };
  // #6 — OPENED_TRADE_ROUTE may name a campaign settlement that is NOT yet a
  // linked neighbour. Rather than no-opping (the historic behaviour for every
  // relationship event), ADD a fresh neighbourNetwork link to it so a trade
  // route can be opened with any settlement in the campaign roster, not only
  // pre-linked neighbours. Other relationship events keep the no-op posture:
  // a dispute/alliance with an unknown name has no link to act on.
  // CAVEAT (settlement-local): this writes the HOME settlement's view only.
  // Reciprocal/regional-graph propagation of the new edge is a campaign-layer
  // follow-up (deriveRegionalState already ingests neighbourNetwork).
  if (event.type === 'OPENED_TRADE_ROUTE') {
    const def = relationshipDefinition('trade_partner', s.id || s.name || 'home', targetId);
    const newLink = {
      id: targetId,
      name: targetId,
      neighbourName: targetId,
      relationshipType: relType,
      displayRelationshipType: relType,
      relationshipFrom: def.from,
      relationshipTo: def.to,
      _relationshipEventId: event.id,
      _addedByEvent: true,
    };
    return { ...s, neighbourNetwork: [...network, newLink] };
  }
  return s;
}

function cutTradeRoute(/** @type {any} */ s, /** @type {any} */ event) {
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

// ── Stressor / population / disease / raid handlers ──────────────────────────

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
function withoutGenerationTwin(/** @type {any} */ s, /** @type {any} */ archetype) {
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
 * Stable condition id for an event-promoted condition. When the event names a
 * target the default id (hash of sourceEventType:targetId) is already distinct
 * per target. But a TARGET-LESS onset (an unnamed plague / refugee wave) hashes
 * to a single id per archetype, so a SECOND such onset overwrites the first
 * (withActiveCondition replaces by id) — the two crises collapse into one even
 * though the substrate deltas and stacked impairments both accumulated.
 * Keying the id off the EVENT id when no target is present gives distinct
 * onsets distinct conditions so consecutive unnamed crises compound. Stays
 * deterministic (event ids are stable) and replay-safe (same event ⇒ same id).
 *
 * @param {string} archetype
 * @param {Event} event
 */
function conditionIdForOnset(archetype, event) {
  return conditionIdFromArchetype(archetype, {
    sourceEventId: event.targetId
      ? `${event.type}:${event.targetId}`
      : `${event.type}:${event.id}`,
  });
}

/**
 * REFUGEE_WAVE — population shift annotation. Records the wave on the
 * settlement so downstream pipeline reruns and the foodSecurity model
 * can consume it. Coarse for v1; future versions will derive specific
 * institution strain from the wave size.
 */
function refugeeWave(/** @type {any} */ s, /** @type {any} */ event) {
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
    id: conditionIdForOnset('regional_migration_pressure', event),
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
function plague(/** @type {any} */ s, /** @type {any} */ event) {
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
  const healing = (next.institutions || []).filter((/** @type {any} */ i) => /hospital|temple|infirm|healer/i.test(i.name || ''));
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
    id: conditionIdForOnset('plague', event),
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
function raidOrMonsterAttack(/** @type {any} */ s, /** @type {any} */ event) {
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

/**
 * APPLY_STRESSOR — an authored crisis ONSET. A thin wrapper over the crisis
 * lifecycle (domain/crisisLifecycle.js): crisisOnset performs the
 * three settlement writes (container upsert, config.stressorEdits record,
 * condition promotion) and ALSO composes the roaming-twin directive — this
 * mutation path keeps only the settlement half (mutateSettlement has no
 * channel for directives); the store recomputes the directive from the event
 * (crisisLifecycle.twinDirectiveForEvent) at its single consumer chokepoint.
 */
// The ADVERSARIAL AXIS — escalating tiers of antagonism. An instigator flip only
// ever ESCALATES along this axis: a neighbour already AT or BEYOND the target
// relationship is left untouched, so re-authoring a stressor never softens an
// edge (a hostile neighbour is never downgraded to rival by a later infiltration).
// 'war' is a legacy alias that reads at the hostile tier. Unknown labels (allied,
// trade_partner, neutral, ...) rank at 0 and are always escalatable.
/** @type {Readonly<Record<string, number>>} */
const ADVERSARIAL_RANK = Object.freeze({ rival: 1, cold_war: 2, war: 3, hostile: 3 });
const adversarialRank = (/** @type {string} */ rel) => ADVERSARIAL_RANK[String(rel || '').toLowerCase()] || 0;

/**
 * Resolve the target relationship an instigator flip should set. War stressors
 * (siege / wartime / occupation / betrayal) always sour to 'hostile' — unchanged.
 * An infiltration sours to the DM-chosen, lighter relationship
 * (rival / cold_war / hostile, default 'rival'), validated against the allowed set.
 * Any other stressor type has no instigator effect (returns null).
 *
 * @param {string} stressorType  lower-cased stressor key.
 * @param {{ instigatorRelationship?: string }} payload  the event payload.
 * @returns {string|null} the canonical target relationship, or null when none.
 */
function instigatorTargetRelationship(stressorType, payload) {
  if (WAR_STRESSOR_TYPES.includes(stressorType)) return 'hostile';
  if (INFILTRATION_STRESSOR_TYPES.includes(stressorType)) {
    const picked = String(payload?.instigatorRelationship || '').toLowerCase();
    return INFILTRATION_TARGET_RELATIONSHIPS.includes(picked) ? picked : 'rival';
  }
  return null;
}

function applyStressor(/** @type {any} */ s, /** @type {any} */ event) {
  const next = /** @type {any} */ (crisisOnset({ settlement: s, event }).settlement);
  // #1 / #3 — INSTIGATOR-SOURED RELATIONSHIP. A WAR-type stressor
  // (siege / wartime / occupation / betrayal) sours the named neighbour to
  // 'hostile'; an INFILTRATION stressor sours it to a lighter, DM-configurable
  // relationship (rival / cold_war / hostile). Optional: with no instigator (or a
  // non-instigator stressor type) only the crisis onset lands.
  const stressorType = String(event.payload?.stressorType || event.targetId || '').toLowerCase();
  const instigator = String(event.payload?.instigatorNeighbour || '').trim();
  const targetRel = instigatorTargetRelationship(stressorType, event.payload);
  if (!instigator || !targetRel) return next;
  // Only ESCALATE: flip a neighbour whose current relationship is LESS adversarial
  // than the target. rival / cold_war / hostile are all symmetric in the canonical
  // vocab, so relationshipDefinition(targetRel, ...) is direction-agnostic.
  const targetRank = adversarialRank(targetRel);
  const network = Array.isArray(next.neighbourNetwork) ? next.neighbourNetwork : [];
  let flipped = false;
  const rewired = network.map((/** @type {any} */ link) => {
    const matches = String(link?.name || '') === instigator
      || String(link?.neighbourName || '') === instigator
      || String(link?.id || '') === instigator
      || String(link?.linkId || '') === instigator;
    if (!matches) return link;
    const current = String(link?.relationshipType || '').toLowerCase();
    if (adversarialRank(current) >= targetRank) return link; // no-op / no-downgrade
    flipped = true;
    const def = relationshipDefinition(targetRel, next.id || next.name || 'home', instigator);
    return {
      ...link,
      relationshipType: def.relationshipType,
      displayRelationshipType: def.relationshipType,
      relationshipFrom: def.from,
      relationshipTo: def.to,
      _relationshipEventId: event.id,
    };
  });
  if (!flipped) return next;
  // CAVEAT (settlement-local): this sets the HOME settlement's view only; full
  // bidirectional / regional-graph war-front propagation is a campaign-layer
  // follow-up (deriveRegionalState already ingests neighbourNetwork).
  return { ...next, neighbourNetwork: rewired };
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
function changeRulingPower(/** @type {any} */ s, /** @type {any} */ event) {
  const cause = event.payload?.cause || 'coup';
  // Try the raw target first (the picker passes the faction name verbatim);
  // fall back to the de-slugged form for "faction.some_name" style ids.
  let result = /** @type {any} */ (transferRulingPower(s, event.targetId, { cause }));
  if (result.error === 'faction_not_found') {
    result = /** @type {any} */ (transferRulingPower(s, labelFromTarget(event.targetId), { cause }));
  }
  if (result.error) return s;
  const severityByCause = { coup: 0.55, conquest: 0.65, election: 0.25, succession: 0.3, appointment: 0.3 };
  return withActiveCondition(result.settlement, {
    archetype: 'government_overthrown',
    severity: /** @type {any} */ (severityByCause)[cause] ?? 0.5,
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
 * A thin wrapper over the crisis lifecycle (domain/crisisLifecycle.js):
 * crisisResolve removes the matching stress entry, winds down
 * the conditions the crisis promoted ('easing' + near-term expiry, event
 * provenance on the causes), and records the resolution in
 * config.stressorEdits — see its doc for the full semantics, all of which
 * are pinned by the editor-roster and stressorEdits suites. A target
 * matching neither an entry nor a condition is a settlement no-op (registry
 * deltas still land — guard upstream, same posture as changeRulingPower:
 * batch.js eventConsumes hard-validates the target and the composer's
 * picker offers the live stressors). The roaming world-pulse twin resolves
 * at the store layer through the lifecycle's 'resolve' twinDirective.
 */
function resolveStressor(/** @type {any} */ s, /** @type {any} */ event) {
  return crisisResolve({ settlement: s, event }).settlement;
}

/** Display label for a trade-good list entry (strings + legacy {name, good} objects). */
function tradeGoodLabel(/** @type {any} */ entry) {
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
function customTradeGoodsOf(/** @type {any} */ config) {
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
function withCustomTradeGoods(/** @type {any} */ s, /** @type {any} */ customTradeGoods) {
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
function addTradeGood(/** @type {any} */ s, /** @type {any} */ event) {
  const label = String(event.payload?.label || event.targetId || '').trim();
  if (!label) return s;
  const direction = event.payload?.direction === 'import' ? 'import' : 'export';
  const entrepot = direction === 'export' && !!event.payload?.entrepot;
  const ec = s.economicState || {};
  const listKey = direction === 'import' ? 'primaryImports' : 'primaryExports';
  const list = Array.isArray(ec[listKey]) ? ec[listKey] : [];
  const written = entrepot ? `${label} (transit)` : label;
  const has = (/** @type {any} */ arr, /** @type {any} */ l) => arr.some((/** @type {any} */ e) => tradeGoodLabel(e).toLowerCase() === l.toLowerCase());

  let nextEc = ec;
  if (!has(list, written)) nextEc = { ...nextEc, [listKey]: [...list, written] };
  if (entrepot) {
    const transit = Array.isArray(nextEc.transit) ? nextEc.transit : [];
    if (!has(transit, label)) nextEc = { ...nextEc, transit: [...transit, label] };
  }

  const ctg = customTradeGoodsOf(s.config);
  const bucket = entrepot ? 'transit' : (direction === 'import' ? 'imports' : 'exports');
  const inBucket = ctg[bucket].some((/** @type {any} */ l) => String(l).toLowerCase() === label.toLowerCase());
  const removed = ctg.removed.filter((/** @type {any} */ l) => String(l).toLowerCase() !== label.toLowerCase());
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
function removeTradeGood(/** @type {any} */ s, /** @type {any} */ event) {
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
  const strike = (/** @type {any} */ arr) => arr.filter((/** @type {any} */ l) => !targets.has(String(l).toLowerCase()));
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
  const alreadyRemoved = ctg.removed.some((/** @type {any} */ l) => String(l).toLowerCase() === base.toLowerCase());
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
function addResource(/** @type {any} */ s, /** @type {any} */ event) {
  const raw = String(event.targetId || '').trim();
  if (!raw) return s;
  const slug = slugify(raw);
  const catalogKey = /** @type {any} */ (RESOURCE_DATA)[raw] ? raw : (/** @type {any} */ (RESOURCE_DATA)[slug] ? slug : null);
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
    nearbyResourcesDepleted: depleted.filter((/** @type {any} */ k) => k !== key && slugify(k) !== slug),
    ...(catalogKey
      ? {}
      : { nearbyResourcesCustom: custom.includes(key) ? custom : [...custom, key] }),
  }, {
    ...edits,
    // An opened node starts open: clear the key's removed suppression AND
    // its depleted record (mirrors the live nearbyResourcesDepleted filter).
    added: edits.added.some((/** @type {any} */ e) => slugEq(String(e?.key || ''), key))
      ? edits.added
      : [...edits.added, { key, custom: !catalogKey }],
    removed: edits.removed.filter((/** @type {any} */ k) => !slugEq(k, key)),
    depleted: edits.depleted.filter((/** @type {any} */ k) => !slugEq(k, key)),
  });
}

/**
 * REMOVE_RESOURCE — strike a resource node from the roster entirely (the
 * harsher cousin of DEPLETE_RESOURCE: nothing left to recover). Clears every
 * config surface that names it — nearbyResources, nearbyResourcesCustom, the
 * nearbyResourcesState entry, and nearbyResourcesDepleted — matching raw,
 * slugified, and de-slugged forms the way recoveredResource does.
 */
function removeResource(/** @type {any} */ s, /** @type {any} */ event) {
  const raw = String(event.targetId || '').trim();
  if (!raw) return s;
  const keys = new Set([raw, slugify(raw), labelFromTarget(raw)].filter(Boolean));
  const config = s.config || {};
  const nearby = Array.isArray(config.nearbyResources) ? config.nearbyResources : [];
  if (!nearby.some((/** @type {any} */ k) => keys.has(k))) return s;
  const state = { ...(config.nearbyResourcesState || {}) };
  for (const k of keys) delete state[k];
  // The roster forms actually struck — what the suppression list must name
  // so a regenerated roster (same key forms) drops them again.
  const struckKeys = nearby.filter((/** @type {any} */ k) => keys.has(k));
  const hitsStruck = (/** @type {any} */ k) => struckKeys.some((/** @type {any} */ sk) => slugEq(k, sk));
  const edits = resourceEditsOf(config);
  return withResourceEdits(s, {
    nearbyResources: nearby.filter((/** @type {any} */ k) => !keys.has(k)),
    nearbyResourcesCustom: (config.nearbyResourcesCustom || []).filter((/** @type {any} */ k) => !keys.has(k)),
    nearbyResourcesState: state,
    nearbyResourcesDepleted: (config.nearbyResourcesDepleted || []).filter((/** @type {any} */ k) => !keys.has(k)),
  }, {
    ...edits,
    added: edits.added.filter((/** @type {any} */ e) => !hitsStruck(String(e?.key || ''))),
    removed: [...edits.removed, ...struckKeys.filter((/** @type {any} */ k) => !edits.removed.some((/** @type {any} */ r) => slugEq(r, k)))],
    depleted: edits.depleted.filter((/** @type {any} */ k) => !hitsStruck(k)),
    recovered: edits.recovered.filter((/** @type {any} */ k) => !hitsStruck(k)),
  });
}

export {
  depleteResource, recoveredResource,
  removedThreat, startedRiot,
  setNeighbourRelationship, cutTradeRoute,
  refugeeWave, plague, raidOrMonsterAttack,
  applyStressor, changeRulingPower, resolveStressor,
  addTradeGood, removeTradeGood, addResource, removeResource,
};
