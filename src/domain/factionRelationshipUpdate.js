/**
 * domain/factionRelationshipUpdate.js — Event → faction relationship deltas.
 *
 * The first *active* derivation: it doesn't
 * just describe state, it describes how events would change state.
 *
 *   recalculateFactionRelationships(settlement, event) -> Update[]
 *
 * Returns an ARRAY OF DELTAS, never mutates. Each delta describes a
 * proposed change to a single faction's structural metric (power /
 * legitimacy / wealth / publicTrust / manpower) with a reason citing
 * the event that produced it.
 *
 * Consumers (the event-apply layer, the time-progression
 * narrator, the AI overlay's "what just changed" surface) decide
 * whether to commit, preview, or render the deltas. This module never
 * touches the settlement.
 *
 * Architectural fit:
 *   - Reads the structured profiles from factionProfile.js so
 *     archetype matches a single canonical vocabulary.
 *   - Reads the structured chain states from supplyChainState.js to know which
 *     faction controls the chain affected by a trade-route event.
 *   - The deltas it produces become the input to time
 *     progression and to escalation-clock advancement.
 *
 * Pure functions only. No imports from src/lib. No state, no I/O.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';

// ── Event archetype → faction impact templates ───────────────────────────
//
// Each entry maps a high-level event archetype (which the caller passes
// directly OR which gets inferred from the legacy event registry below)
// to a per-archetype response profile. The profile lists structured
// deltas — power / legitimacy / publicTrust / wealth shifts — with the
// reason explaining the causal chain.
//
// Magnitudes are intentionally moderate (3–10 per delta). Multiple
// events compound; we don't want any single event to swing a faction
// from dominant to collapsed in one tick.

const ARCHETYPE_IMPACTS = Object.freeze({
  // ─────────────────────────────────────────────────────────────────────
  // PLAGUE — illness with collective response. Plays to whichever
  // faction tends the sick best (religious) and against whoever is
  // perceived as profiteering (merchant) or absent (governing).

  plague: {
    religious: [
      { field: 'legitimacy',  delta: +8,  reason: 'Plague relief organized by the temple lifts public trust.' },
      { field: 'publicTrust', delta: +6,  reason: 'Front-line care visible to the public.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -5,  reason: 'Civic authority blamed for slow or inadequate response.' },
    ],
    merchant: [
      { field: 'publicTrust', delta: -5,  reason: 'Suspicion of price gouging on grain and medicine.' },
      { field: 'wealth',      delta: +3,  reason: 'Higher demand for scarce goods raises margins.' },
    ],
    criminal: [
      { field: 'power',       delta: +4,  reason: 'Black-market medicine becomes a steady earner.' },
      { field: 'legitimacy',  delta: -2,  reason: 'Profit-from-suffering compounds existing fear.' },
    ],
    arcane: [
      { field: 'publicTrust', delta: +3,  reason: 'Healing magic, where present, draws cautious gratitude.' },
    ],
    military: [
      { field: 'manpower',    delta: -4,  reason: 'Quarantine duty + illness reduce available watch strength.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // TRADE_ROUTE_CUT — primary signal: merchant wealth falls; criminal
  // smuggling rises; council tax base shrinks.

  trade_route_cut: {
    merchant: [
      { field: 'wealth',     delta: -8, reason: 'Imports / exports interrupted; revenue contracts.' },
      { field: 'power',      delta: -4, reason: 'Reduced cash means reduced patronage and leverage.' },
    ],
    government: [
      { field: 'wealth',     delta: -4, reason: 'Tax base shrinks as trade volume falls.' },
      { field: 'legitimacy', delta: -3, reason: 'Civic authority blamed for failing to keep routes open.' },
    ],
    military: [
      { field: 'manpower',   delta: -2, reason: 'Watch wages slow as the tax base shrinks.' },
    ],
    criminal: [
      { field: 'power',      delta: +6, reason: 'Smuggling networks fill the gap; rates and volume rise.' },
      { field: 'wealth',     delta: +4, reason: 'Premium prices on illicit access.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CORRUPTION_EXPOSED — player or rumor surfaces a major scandal.
  // Hits the implicated faction; lifts the exposer's natural rival.

  corruption_exposed: {
    government: [
      { field: 'legitimacy',  delta: -10, reason: 'Public exposure erodes the moral authority to govern.' },
      { field: 'publicTrust', delta: -8,  reason: 'Trust collapses when the magistrate is the criminal.' },
    ],
    merchant: [
      { field: 'wealth',     delta: -5,  reason: 'Implicated merchants face boycotts or seizures.' },
      { field: 'legitimacy', delta: -4,  reason: 'Hoarding rumors become hoarding evidence.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +4, reason: 'Temple seen as moral counterweight; relief rolls grow.' },
    ],
    criminal: [
      { field: 'power',      delta: -3,  reason: 'Some corruption clients fall with their patrons.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // GRANARY_DESTROYED / FOOD_INSTITUTION_REMOVED — a food chain anchor
  // disappears. Compounding stress.

  food_anchor_lost: {
    government: [
      { field: 'legitimacy', delta: -6, reason: 'Civic authority blamed for failing to safeguard food stores.' },
    ],
    religious: [
      { field: 'legitimacy', delta: +5, reason: 'Temple relief becomes the only working food distribution.' },
      { field: 'publicTrust', delta: +4, reason: 'Visible charity in a moment of need.' },
    ],
    merchant: [
      { field: 'wealth',     delta: +4, reason: 'Scarce grain commands premium prices.' },
      { field: 'publicTrust', delta: -5, reason: 'Speculation suspicions sharpen.' },
    ],
    criminal: [
      { field: 'power',      delta: +5, reason: 'Black-market grain becomes a profitable specialty.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // DOMINANT_NPC_REMOVED — leader killed, exiled, or assigned away.
  // Hits the leader's own faction; opens space for rivals.

  dominant_npc_removed: {
    // Note: the *removed NPC's* faction takes the biggest hit. We
    // express this generically here (it applies to any archetype the
    // NPC happened to lead). The caller passes the NPC's archetype so
    // we can route the hit correctly.
    sameAsTarget: [
      { field: 'power',      delta: -6, reason: 'Loss of dominant leadership; the faction\'s ability to act in coordinated ways drops sharply.' },
      { field: 'legitimacy', delta: -4, reason: 'Succession crisis weakens public confidence in continuity.' },
    ],
    rival: [
      { field: 'power',      delta: +3, reason: 'A rival faction sees opportunity and consolidates.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // SIEGE_LIFTED — external pressure ends. Strong gains for everyone
  // but especially defenders + governing.

  siege_lifted: {
    military: [
      { field: 'legitimacy', delta: +6, reason: 'Defenders credited with the city\'s survival.' },
      { field: 'manpower',   delta: +3, reason: 'Recruitment surges in the relief.' },
    ],
    government: [
      { field: 'legitimacy', delta: +5, reason: 'Surviving the siege is the strongest legitimacy claim there is.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'Prayers vindicated.' },
    ],
    merchant: [
      { field: 'wealth',     delta: +4, reason: 'Reopened trade restores revenue.' },
    ],
  },
});

// ── Legacy event-type → archetype mapping ───────────────────────────────
//
// Bridges the existing event registry's vocabulary (ADD_INSTITUTION,
// REMOVE_INSTITUTION, etc.) onto the higher-level archetypes used in
// ARCHETYPE_IMPACTS. Some events map cleanly; some need contextual
// inference (e.g. REMOVE_INSTITUTION → 'food_anchor_lost' iff the
// target was a granary). The caller can also pass an archetype
// directly via `event.factionImpactArchetype` to bypass inference.

const FOOD_INSTITUTION_PATTERNS = /granary|mill|bakery|farm|orchard|fishery/i;

function inferEventArchetype(event) {
  if (!event) return null;

  // Explicit override — callers can pass `event.factionImpactArchetype`
  // to use a specific archetype regardless of the event type.
  if (typeof event.factionImpactArchetype === 'string') {
    return event.factionImpactArchetype;
  }

  switch (event.type) {
    case 'CUT_TRADE_ROUTE':
      return 'trade_route_cut';
    case 'REMOVE_INSTITUTION':
    case 'DAMAGE_INSTITUTION':
    case 'IMPAIR_INSTITUTION':
      if (typeof event.targetId === 'string' && FOOD_INSTITUTION_PATTERNS.test(event.targetId)) {
        return 'food_anchor_lost';
      }
      return null;
    case 'KILL_NPC':
      // The dominant-NPC-removed archetype requires knowing the
      // removed NPC's rank, which the registry doesn't pass through.
      // Callers wanting this archetype should pass it explicitly via
      // factionImpactArchetype or a wrapper that inspects the NPC.
      return null;
    default:
      return null;
  }
}

// ── Faction match helpers ────────────────────────────────────────────────

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function factionIdFromName(name) {
  if (!name) return null;
  return `faction.${snakeCase(name)}`;
}

// ── Composer ────────────────────────────────────────────────────────────

/**
 * Compute structured faction-relationship deltas for an event.
 *
 * Pure; idempotent; does not mutate the settlement. Returns an empty
 * array when the event archetype can't be inferred or the settlement
 * has no factions.
 *
 * The caller can pass `archetype` directly to skip inference:
 *
 *   recalculateFactionRelationships(settlement, { type: 'PLAGUE' }, { archetype: 'plague' })
 *
 * @param {Object} settlement
 * @param {Object} event              { type, targetId?, factionImpactArchetype?, … }
 * @param {Object} [options]
 * @param {string} [options.archetype]  Override; bypasses inference.
 * @param {Object} [options.targetNpc]  When archetype is 'dominant_npc_removed',
 *                                      the structured profile of the NPC being
 *                                      removed. Required for that archetype.
 * @returns {Array<Object>} Updates.
 */
export function recalculateFactionRelationships(settlement, event, options = {}) {
  if (!settlement || !event) return [];

  const archetype = options.archetype || inferEventArchetype(event);
  if (!archetype) return [];

  const impacts = ARCHETYPE_IMPACTS[archetype];
  if (!impacts) return [];

  const profiles = deriveAllFactionProfiles(settlement);
  if (profiles.length === 0) return [];

  const out = [];

  // ── dominant_npc_removed gets its own routing logic ────────────────
  // The removed NPC's faction takes the sameAsTarget hits; one rival
  // faction (top non-same-archetype faction) gets the 'rival' bump.
  if (archetype === 'dominant_npc_removed') {
    const targetNpc = options.targetNpc;
    if (!targetNpc || !targetNpc.archetype) return [];

    const targetFactionId = targetNpc.factionLink;

    // Find the affected faction (same as target) and a rival.
    let affected = null;
    let rival = null;
    let rivalPower = -Infinity;
    for (const p of profiles) {
      const sameByLink = targetFactionId && p.id === targetFactionId;
      const sameByArchetype = !targetFactionId && p.archetype === targetNpc.archetype;
      if (sameByLink || sameByArchetype) {
        if (!affected) affected = p;
        continue;
      }
      // Track strongest non-matching faction as rival.
      if ((p.power ?? 0) > rivalPower) {
        rivalPower = p.power ?? 0;
        rival = p;
      }
    }

    if (affected) {
      for (const delta of impacts.sameAsTarget) {
        out.push({
          factionId: affected.id,
          factionName: affected.name,
          archetype: affected.archetype,
          field: delta.field,
          delta: delta.delta,
          reason: delta.reason,
          eventType: event.type || 'KILL_NPC',
          eventTargetId: event.targetId || targetNpc.id || null,
        });
      }
    }
    if (rival) {
      for (const delta of impacts.rival) {
        out.push({
          factionId: rival.id,
          factionName: rival.name,
          archetype: rival.archetype,
          field: delta.field,
          delta: delta.delta,
          reason: delta.reason,
          eventType: event.type || 'KILL_NPC',
          eventTargetId: event.targetId || targetNpc.id || null,
        });
      }
    }
    return out;
  }

  // ── Standard archetype-keyed impact ────────────────────────────────
  for (const profile of profiles) {
    const deltas = impacts[profile.archetype];
    if (!deltas) continue;
    for (const d of deltas) {
      out.push({
        factionId: profile.id,
        factionName: profile.name,
        archetype: profile.archetype,
        field: d.field,
        delta: d.delta,
        reason: d.reason,
        eventType: event.type || archetype.toUpperCase(),
        eventTargetId: event.targetId || null,
      });
    }
  }

  return out;
}

// ── Diagnostic helpers ──────────────────────────────────────────────────

/**
 * Aggregate updates by faction. Returns
 *   { 'faction.<id>': { name, archetype, deltas: { power, legitimacy, … } } }
 * with summed numeric deltas per field. Useful for the "net change per
 * faction" surface and for forecast tooling.
 */
export function summarizeByFaction(updates) {
  const out = {};
  for (const u of updates || []) {
    if (typeof u.delta !== 'number') continue; // skip band changes for now
    if (!out[u.factionId]) {
      out[u.factionId] = {
        factionId: u.factionId,
        factionName: u.factionName,
        archetype: u.archetype,
        deltas: {},
      };
    }
    out[u.factionId].deltas[u.field] = (out[u.factionId].deltas[u.field] || 0) + u.delta;
  }
  return out;
}

/**
 * Convenience: which event archetypes does this module support?
 * Used by drift-detection tests + the dev simulation debugger.
 */
export function supportedArchetypes() {
  return Object.keys(ARCHETYPE_IMPACTS);
}

// Re-export factionIdFromName so callers can construct stable ids when
// needed (e.g. wrapping a legacy event with a target-faction hint).
export { factionIdFromName };
