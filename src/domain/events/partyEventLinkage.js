/**
 * domain/events/partyEventLinkage.js — bridge party-caused settlement events
 * into the world-pulse engine.
 *
 * A settlement-level "Make Changes" event marked "caused by the party" should
 * not just be attributed — when it has a world-scale analog it should also
 * ripple across the campaign through the party-impact pipeline (active
 * conditions, faction/NPC world-state, regional propagation, Wizard News). This
 * maps the handful of events that have such an analog onto a PARTY_IMPACT
 * action; everything else returns null (attribution only — no ripple).
 *
 * Why only a few: most settlement events (add/remove an institution, assign a
 * role, deplete a resource, cut a route) have no campaign-scale party-impact
 * kind, and the local mutation + the existing regional-graph propagation
 * already cover them. The mappings below are the ones where the world-PULSE
 * layer (a different subsystem) adds a genuine, non-duplicative consequence.
 *
 * Pure: no store, no engine call. The caller (store.applyEvent) fires the
 * resulting action through recordPartyImpact, and only in a canon campaign.
 */

import { PARTY_IMPACT_KINDS } from '../worldPulse/partyImpact.js';

// Settlement event type → party-impact kind + which action field carries the
// event's targetId. Only world-scale analogs belong here.
const EVENT_TO_PARTY_KIND = Object.freeze({
  KILL_NPC:        { kind: 'remove_npc',        targetField: 'npcId' },
  IMPAIR_FACTION:  { kind: 'undermine_faction', targetField: 'factionId' },
  RESTORE_FACTION: { kind: 'bolster_faction',   targetField: 'factionId' },
});

/**
 * Map a party-caused settlement event to a party-impact action, or null when the
 * event has no world-scale analog (attribution-only).
 *
 * @param {Object} event   the applied settlement event ({ type, targetId, partyCaused, description, ... })
 * @param {string} saveId  the settlement's campaign save id (party impacts are settlement-scoped)
 * @returns {Object|null}  a PARTY_IMPACT action, or null
 */
export function mapEventToPartyImpact(event, saveId) {
  if (!event || !event.partyCaused || !saveId) return null;
  const mapping = EVENT_TO_PARTY_KIND[event.type];
  if (!mapping) return null;
  const targetId = String(event.targetId || '').trim();
  if (!targetId) return null;
  const spec = PARTY_IMPACT_KINDS[mapping.kind];
  if (!spec) return null;
  return {
    kind: mapping.kind,
    settlementId: String(saveId),
    [mapping.targetField]: targetId,
    magnitude: spec.defaultMagnitude,
    label: spec.label,
    note: event.description || spec.note,
  };
}

// Exposed for tests + any UI that wants to show "this will ripple" affordances.
export const PARTY_LINKED_EVENT_TYPES = Object.freeze(Object.keys(EVENT_TO_PARTY_KIND));
