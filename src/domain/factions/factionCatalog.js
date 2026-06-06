/**
 * domain/factions/factionCatalog.js — the faction "compendium" used when a
 * DM adds a faction to a settlement.
 *
 * ADD_FACTION used to take a free-text name. That let the DM invent anything,
 * but it also meant retyping the names the engine already knows, and it never
 * stopped you re-adding a faction the settlement already has. This module is
 * the single source for "which factions can I add here": the built-in
 * descriptor database (FACTION_DESCRIPTORS), grouped by category and filtered
 * to exclude whatever is already in the settlement.
 *
 * Pure: no store, no React, no I/O.
 */

import { FACTION_DESCRIPTORS } from '../../data/powerData.js';

/** Display labels for the descriptor category keys. */
export const FACTION_CATEGORY_LABELS = Object.freeze({
  economy:    'Economy',
  government: 'Government',
  military:   'Military',
  religious:  'Religious',
  magic:      'Magic',
  criminal:   'Criminal',
  other:      'Other',
});

function norm(x) {
  return String(x || '').trim().toLowerCase();
}

/**
 * The faction list lives at powerStructure.factions (canonical) but some
 * older/neighbour records keep a flat settlement.factions. Read both, and
 * accept either `name` or `faction` as the label key.
 *
 * @param {Object} settlement
 * @returns {Set<string>} lowercased names already present
 */
export function presentFactionNames(settlement) {
  const list = settlement?.powerStructure?.factions || settlement?.factions || [];
  const set = new Set();
  for (const f of list) {
    const n = norm(f?.name || f?.faction);
    if (n) set.add(n);
  }
  return set;
}

/**
 * Faction options grouped by category, filtered to exclude anything already
 * in the settlement. Empty groups are dropped so the UI never renders a
 * heading with no options.
 *
 * @param {Object} settlement
 * @returns {Array<{ category: string, label: string, options: Array<{ name: string, category: string }> }>}
 */
export function factionCompendium(settlement) {
  const present = presentFactionNames(settlement);
  const groups = [];
  for (const [category, names] of Object.entries(FACTION_DESCRIPTORS || {})) {
    const options = [];
    const seen = new Set();
    for (const name of (names || [])) {
      const key = norm(name);
      if (!key || present.has(key) || seen.has(key)) continue;
      seen.add(key);
      options.push({ name, category });
    }
    if (options.length) {
      groups.push({
        category,
        label: FACTION_CATEGORY_LABELS[category] || category,
        options,
      });
    }
  }
  return groups;
}

/**
 * Flat list of addable factions (every group's options, in category order).
 *
 * @param {Object} settlement
 * @returns {Array<{ name: string, category: string }>}
 */
export function factionCompendiumFlat(settlement) {
  return factionCompendium(settlement).flatMap(g => g.options);
}
