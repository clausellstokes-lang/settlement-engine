/**
 * domain/roles/roleCatalog.js — Roles an NPC can be assigned to.
 *
 * "Assign NPC to role" should not be a free-text field: an NPC can only fill
 * a role the target institution or faction actually offers, and the role
 * itself dictates the NPC's importance tier (and a default influence). This
 * module is the single source for those role lists.
 *
 *   - Institutions don't carry structured roles, so we derive a sensible set
 *     from the institution's kind (via the registry's name classifier).
 *   - Factions DO carry structured seats (internalSeats: leader / lieutenant /
 *     agent), so faction roles map onto those seats.
 *
 * Pure data + lookups. No React, no store.
 */

import { classifyInstitution } from '../events/registry.js';
import { inferImportance } from '../entities/npcs.js';

/** Role sets per institution kind. The first entry is the senior office. */
export const INSTITUTION_ROLES = Object.freeze({
  religious:       [{ role: 'High Priest',    importance: 'pillar' }, { role: 'Priest',     importance: 'key' },     { role: 'Acolyte',    importance: 'notable' }],
  law_enforcement: [{ role: 'Watch Captain',  importance: 'pillar' }, { role: 'Sergeant',   importance: 'key' },     { role: 'Guard',      importance: 'notable' }],
  civic:           [{ role: 'Magistrate',     importance: 'pillar' }, { role: 'Councilor',  importance: 'key' },     { role: 'Clerk',      importance: 'notable' }],
  trade:           [{ role: 'Guildmaster',    importance: 'pillar' }, { role: 'Factor',     importance: 'key' },     { role: 'Apprentice', importance: 'notable' }],
  finance:         [{ role: 'Master of Coin', importance: 'pillar' }, { role: 'Treasurer',  importance: 'key' },     { role: 'Clerk',      importance: 'notable' }],
  production:      [{ role: 'Master Smith',   importance: 'pillar' }, { role: 'Journeyman', importance: 'key' },     { role: 'Apprentice', importance: 'notable' }],
  food_storage:    [{ role: 'Granary Keeper', importance: 'key' },    { role: 'Steward',    importance: 'notable' }],
  hospitality:     [{ role: 'Proprietor',     importance: 'key' },    { role: 'Server',     importance: 'minor' }],
  other:           [{ role: 'Master',         importance: 'key' },    { role: 'Steward',    importance: 'notable' }, { role: 'Hand',       importance: 'minor' }],
});

/** Faction internal seats → role labels + importance. */
export const FACTION_SEAT_ROLES = Object.freeze([
  { role: 'Leader',     importance: 'pillar',  seat: 'leader_champion' },
  { role: 'Lieutenant', importance: 'key',     seat: 'lieutenant_operator' },
  { role: 'Agent',      importance: 'notable', seat: 'agent' },
]);

const INFLUENCE_BY_IMPORTANCE = Object.freeze({ pillar: 85, key: 60, notable: 35, minor: 10 });

/**
 * Roles available at a given institution (derived from its kind).
 * @param {import('../settlement.schema.js').SimInstitution} institution
 */
export function rolesForInstitution(institution) {
  if (!institution) return [];
  const kind = classifyInstitution(institution.name || institution.id || '');
  return INSTITUTION_ROLES[kind] || INSTITUTION_ROLES.other;
}

/**
 * Roles (seats) available within a faction.
 * @param {import('../settlement.schema.js').SimFaction} faction
 */
export function rolesForFaction(faction) {
  const seats = faction?.internalSeats && Object.keys(faction.internalSeats).length
    ? FACTION_SEAT_ROLES.filter(r => r.seat in faction.internalSeats)
    : FACTION_SEAT_ROLES;
  return seats.length ? seats : FACTION_SEAT_ROLES.slice();
}

/**
 * The importance tier implied by a role. Matches against the supplied role
 * list first (the authoritative source), then falls back to the name-pattern
 * inference used elsewhere so a free-typed role still gets a sensible tier.
 * @param {any} roleLabel
 * @param {any[]} [roles]
 */
export function importanceForRole(roleLabel, roles = []) {
  if (!roleLabel) return null;
  const match = roles.find(r => r.role.toLowerCase() === String(roleLabel).toLowerCase());
  if (match) return match.importance;
  return inferImportance({ role: roleLabel });
}

/**
 * A default 0-100 influence for an importance tier.
 * @param {any} importance
 */
export function influenceForImportance(importance) {
  return /** @type {Record<string, number>} */ (INFLUENCE_BY_IMPORTANCE)[importance] ?? null;
}
