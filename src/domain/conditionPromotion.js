/**
 * domain/conditionPromotion.js — promote generation-time stressors into
 * canonical activeConditions.
 *
 * The gap this closes: a freshly generated plague / famine / siege settlement
 * used to carry the crisis ONLY as a `stressor` (a narrative/structural pressure)
 * while `activeConditions` stayed empty. The causal substrate (causalState.js)
 * and the AI overlay both read `activeConditions` by `affectedSystems` — so a town
 * generated mid-famine under-reacted, because nothing fed the substrate the crisis.
 *
 * This pass maps each *live-crisis* stressor to its condition archetype so the
 * SAME canonical condition channel that local events (mutate.js) and the world-pulse
 * layer feed is ALSO fed at generation. Ambient/low pressures (mild banditry, a slow
 * economic slump) intentionally stay as stressors only — promotion is reserved for
 * the crises a DM would expect to see reflected in food/health/order/legitimacy.
 *
 * Pure; deterministic (no RNG, no Date); idempotent — `withActiveCondition`
 * replaces by stable id, so re-running promotion never duplicates a condition.
 */

import { deriveActiveCondition, withActiveCondition, withoutActiveCondition } from './activeConditions.js';
import { canonStressors } from './canonicalAccessors.js';

// Ordered stressor (type/name) fragment -> condition archetype. First match wins.
// Keyed off the canonical archetype vocabulary in activeConditions.js so the
// promoted conditions map 1:1 to the substrate's affectedSystems and the
// factionRelationshipUpdate delta templates.
const STRESSOR_ARCHETYPE_RULES = Object.freeze([
  { re: /plague|disease|pox|fever|outbreak|pestilence/i,        archetype: 'plague' },
  { re: /famine|starv|drought|crop failure|food shortage|blight/i, archetype: 'famine' },
  { re: /siege|besieg|blockad/i,                                archetype: 'war_pressure' },
  // 'wartime' needs its own token: \bwar\b never matches it (no word boundary
  // before the 't'), so wartime settlements silently skipped promotion.
  { re: /\bwar\b|wartime|warfront|invasion|incursion|hostilit/i, archetype: 'war_pressure' },
  // Occupation -> vassal_extraction is VERIFIED honest for both faces of an
  // occupation: the condition's affectedSystems carry trade_connectivity
  // AND defense_readiness, so the substrate registers economic extraction and
  // military strain from the one condition; the pulse layer's conflict/defense
  // pressures read those substrate scores, so the war side flows end to end.
  // The TRADE_ARCHETYPES classification (pressureModel.js) only governs the
  // flat condition-bonus there — re-pointing the condition at war_pressure
  // would instead LOSE the extraction face. The stressor's pressureKinds
  // ['conflict','legitimacy'] are an input gate (what feeds its birth/growth),
  // not its output, so they were never the war-side carrier.
  { re: /occupation|occupied|vassal|tribute|annex/i,            archetype: 'vassal_extraction' },
  // 'migration' added: /migrant/ does not match 'mass_migration'.
  { re: /refugee|migrant|migration|displac|exodus/i,            archetype: 'regional_migration_pressure' },
  // 'insurgen' added: 'insurgency' matched none of the rebellion tokens.
  { re: /rebellion|revolt|uprising|insurrection|insurgen|mutiny/i, archetype: 'rebellion' },
  // The previously-unpromoted generation stress types. Without these rules a
  // settlement generated 'recently_betrayed' (or indebted, infiltrated, ...)
  // carried the crisis as pure narrative — nothing fed the causal substrate.
  { re: /betray/i,                                              archetype: 'faction_challenge' },
  { re: /indebted|debt spiral|debt crisis/i,                    archetype: 'regional_tax_revenue_disruption' },
  { re: /infiltrat/i,                                           archetype: 'regional_criminal_pressure' },
  // Religious family must outrank the /fractur/ rule below: first match wins,
  // so 'religious_conversion_fracture' used to fall to the fracture rule and
  // promote as regional_authority_instability — a religious crisis registering
  // as pure political instability. Religious types are religious first.
  { re: /religious conversion|religious_conversion|schism|heres/i, archetype: 'regional_religious_pressure' },
  { re: /fractur/i,                                             archetype: 'regional_authority_instability' },
  { re: /succession/i,                                          archetype: 'dominant_npc_removed' },
  { re: /monster|raider/i,                                      archetype: 'war_pressure' },
  // World-pulse-only types, now authorable via the APPLY_STRESSOR event —
  // without these rules an authored market shock / criminal corridor / coup
  // would carry no causal-substrate consequence at all.
  { re: /market[\s_]?shock|price (collapse|crash)|trade collapse/i, archetype: 'regional_export_market_loss' },
  { re: /criminal[\s_]?corridor|smuggling (ring|route)|racket/i, archetype: 'regional_criminal_pressure' },
  // The magical crisis family (stressor wave): magical_instability and the
  // wandering magic_deadzone carried no promotion target at all — an arcane
  // crisis never reached the substrate's magical_stability variable.
  { re: /magical[\s_]?instability|magic[\s_]?deadzone|wild[\s_]?magic|arcane[\s_]?(surge|storm|collapse)/i, archetype: 'magical_instability' },
  // A coup ATTEMPT in progress is a faction maneuvering for the seat; the
  // verdict's own conditions (coup_suppressed / government_overthrown) are
  // produced by the world-pulse contest, not by this promotion.
  { re: /coup|putsch/i,                                         archetype: 'faction_challenge' },
]);

/** @returns {string|null} the condition archetype this stressor promotes to, or null. */
export function archetypeForStressor(stressor) {
  // `.label` included: world-pulse stressors carry their display text as
  // `label` (stressors.js normalizeStressor), not `name` — a label-only
  // stressor silently skipped promotion.
  const text = `${stressor?.type || ''} ${stressor?.name || ''} ${stressor?.label || ''}`.trim();
  if (!text) return null;
  for (const { re, archetype } of STRESSOR_ARCHETYPE_RULES) {
    if (re.test(text)) return archetype;
  }
  return null;
}

/**
 * Return a new settlement with an activeCondition for every live-crisis stressor.
 * No-op (returns the input) when there are no promotable stressors.
 *
 * `origin` carries authored-event provenance for the ONE archetype the event's
 * stressor maps to: { sourceEventType, eventId, detail, archetype }. Without it
 * (every generation-time caller) the stamps say GENERATION — which was a lie
 * for DM-authored stressors: the explanation surface claimed the settlement was
 * generated mid-crisis the DM authored this session, and the event id was lost.
 * Scoped by `archetype` so re-promoting the settlement's OTHER stressors never
 * re-attributes their conditions to the new event.
 *
 * @param {Object} settlement
 * @param {{sourceEventType: string, eventId: string, detail?: string, archetype: string}} [origin]
 * @returns {Object}
 */
export function promoteStressorsToConditions(settlement, origin = null) {
  if (!settlement) return settlement;
  // Collapse to ONE condition per archetype, keeping the highest severity. Two
  // distinct stressors that map to the same archetype (e.g. "plague" + "fever
  // outbreak" -> plague) describe one crisis; emitting two conditions would
  // double-penalize the same affectedSystems in the causal substrate. Keyed off
  // the archetype (not the stressor label) so the condition id is stable and the
  // promotion stays idempotent. Order-independent.
  const byArchetype = new Map();
  for (const stressor of canonStressors(settlement)) {
    const archetype = archetypeForStressor(stressor);
    if (!archetype) continue;
    const severity = typeof stressor?.severity === 'number' ? stressor.severity : null;
    // `.label` preferred over the raw type token for the same world-pulse
    // shape — a label-only stressor used to display as its bare archetype.
    const label = stressor?.name || stressor?.label || stressor?.type || archetype;
    const prev = byArchetype.get(archetype);
    if (!prev || (severity != null && (prev.severity == null || severity > prev.severity))) {
      byArchetype.set(archetype, { severity, label });
    }
  }
  let next = settlement;
  for (const [archetype, { severity, label }] of byArchetype) {
    const authored = origin != null && origin.archetype === archetype;
    // An authored onset touches ONLY its own archetype. Re-emitting the
    // container's other archetypes here would mint GENERATION-stamped twins
    // beside event-stamped conditions (different derived ids — duplication)
    // and rewind evolved conditions to tick zero via replace-by-id (clock
    // reset). Their conditions already exist from their own promotion.
    if (origin != null && !authored) continue;
    if (authored) {
      // The authored onset owns this crisis now: drop any prior condition of
      // the same archetype (a generation-stamped twin carries a different id,
      // so withActiveCondition's replace-by-id alone would leave both standing
      // and double-penalize the same affectedSystems).
      for (const cond of next.activeConditions || []) {
        if (cond?.archetype === archetype && cond?.id) next = withoutActiveCondition(next, cond.id);
      }
    }
    next = withActiveCondition(next, {
      archetype,
      // Carry the strongest stressor severity when present; else the catalog
      // default (deriveActiveCondition fills it from the archetype template).
      severity: severity == null ? undefined : severity,
      triggeredAt: {
        sourceEventType: authored ? origin.sourceEventType : 'GENERATION',
        sourceEventTargetId: archetype,
      },
      causes: authored
        ? [{ source: 'event', eventId: origin.eventId, detail: origin.detail || `${label} began.` }]
        : [{ source: 'generation', detail: `Settlement generated under stressor "${label}".` }],
    });
  }
  return next;
}

/**
 * Re-promote the EVENT-authored conditions recorded in
 * config.eventConditions onto a freshly generated settlement. The record is
 * the projection mutate.js / the aging helpers keep in sync
 * (activeConditions.withEventConditionsSynced): a full regeneration rebuilds
 * the settlement from the raw _config and would otherwise drop every
 * condition an event promoted — the same input-survives-regeneration seam
 * resourceEdits and customTradeGoods close for config-level edits.
 *
 * Runs AFTER promoteStressorsToConditions. Entries are re-applied verbatim
 * (deriveActiveCondition is idempotent), so evolved state — elapsed ticks,
 * drifted severity, a RESOLVE_STRESSOR wind-down to 'easing' — survives the
 * regeneration instead of restarting at the authored onset. For each entry,
 * a GENERATION-stamped condition of the same archetype (re-promoted from the
 * re-rolled stressors) is dropped first: the authored event owns that crisis
 * (the same authored-beats-generation rule the origin path above applies),
 * and the twin carries a different derived id, so replace-by-id alone would
 * leave both standing and double-penalize the same affectedSystems. Distinct
 * event conditions of one archetype (two severed routes) keep their distinct
 * ids and all survive. Pure, deterministic, consumes no rng — a config
 * without the record generates byte-identically.
 */
export function reapplyEventConditions(settlement) {
  const record = settlement?.config?.eventConditions ?? settlement?._config?.eventConditions;
  if (!Array.isArray(record) || record.length === 0) return settlement;
  let next = settlement;
  for (const entry of record) {
    const condition = deriveActiveCondition(entry);
    if (!condition) continue;
    for (const cond of next.activeConditions || []) {
      if (cond?.archetype === condition.archetype
        && cond?.id !== condition.id
        && cond?.triggeredAt?.sourceEventType === 'GENERATION') {
        next = withoutActiveCondition(next, cond.id);
      }
    }
    next = withActiveCondition(next, condition);
  }
  return next;
}
