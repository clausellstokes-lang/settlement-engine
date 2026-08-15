/**
 * domain/factions/factionCatalog.js — the faction "compendium" used when a
 * DM adds a faction to a settlement.
 *
 * ADD_FACTION used to take a free-text name. That let the DM invent anything,
 * but it also meant retyping the names the engine already knows, and it never
 * stopped you re-adding a faction the settlement already has. This module is
 * the single source for "which factions can I add here": the built-in
 * descriptor database (FACTION_DESCRIPTORS), grouped by category and filtered
 * to exclude whatever is already in the settlement — plus the user's Compendium
 * factions as a trailing 'Custom' group (the same merge ADD_INSTITUTION and
 * APPLY_STRESSOR already do), which is how FactionEventBanner's "a custom
 * faction arrives through an event you author in the Event Composer" promise
 * is actually delivered.
 *
 * Pure: no store, no React, no I/O — custom factions are passed in, exactly
 * like buildInstitutionCatalog.
 */

import { FACTION_DESCRIPTORS } from '../../data/powerData.js';
import { byNameCodepoint } from '../deterministicSort.js';

/** Display labels for the descriptor category keys.
 * @type {Readonly<Record<string, string>>}
 */
export const FACTION_CATEGORY_LABELS = Object.freeze({
  economy:    'Economy',
  government: 'Government',
  military:   'Military',
  religious:  'Religious',
  magic:      'Magic',
  criminal:   'Criminal',
  other:      'Other',
  custom:     'Custom',
});

/**
 * @param {unknown} x
 * @returns {string}
 */
function norm(x) {
  return String(x || '').trim().toLowerCase();
}

/**
 * The faction list lives at powerStructure.factions (canonical) but some
 * older/neighbour records keep a flat settlement.factions. Read both, taking
 * `faction` ahead of `name` — rulingPower.nameOf's precedence, so a record
 * carrying both keys dedups under its canonical name and the compendium never
 * offers a faction the settlement already has.
 *
 * @typedef {{ name?: string, faction?: string }} FactionNameCarrier
 * @param {{ powerStructure?: { factions?: FactionNameCarrier[] }, factions?: FactionNameCarrier[] } | null | undefined} settlement
 * @returns {Set<string>} lowercased names already present
 */
export function presentFactionNames(settlement) {
  const list = settlement?.powerStructure?.factions || settlement?.factions || [];
  const set = new Set();
  for (const f of list) {
    const n = norm(f?.faction || f?.name);
    if (n) set.add(n);
  }
  return set;
}

/**
 * Faction options grouped by category, filtered to exclude anything already
 * in the settlement. Empty groups are dropped so the UI never renders a
 * heading with no options. Compendium factions land in a trailing 'Custom'
 * group (codepoint-sorted — determinism law), deduped against both the
 * settlement's factions and every built-in name still on offer; a custom
 * option additionally carries its authored `description`, which the composer
 * prefills into the editable Description field so it reaches the created
 * faction (event.description → addFaction → faction.description).
 *
 * @typedef {{ name?: string, description?: string }} CompendiumFaction
 * @param {Object} settlement
 * @param {CompendiumFaction[]} [customFactions]  Compendium factions
 * @returns {Array<{ category: string, label: string, options: Array<{ name: string, category: string, description?: string, isCustom?: boolean }> }>}
 */
export function factionCompendium(settlement, customFactions = []) {
  const present = presentFactionNames(settlement);
  const groups = [];
  const offered = new Set();
  for (const [category, names] of Object.entries(FACTION_DESCRIPTORS || {})) {
    const options = [];
    const seen = new Set();
    for (const name of (names || [])) {
      const key = norm(name);
      if (!key || present.has(key) || seen.has(key)) continue;
      seen.add(key);
      offered.add(key);
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
  const custom = [];
  const seenCustom = new Set();
  for (const cf of (customFactions || [])) {
    const name = String(cf?.name || '').trim();
    const key = norm(name);
    // A custom name shadowing a built-in still on offer (or a present faction)
    // is dropped — two <option>s with the same value would make the pick
    // ambiguous, and the built-in is already addable under that name.
    if (!key || present.has(key) || offered.has(key) || seenCustom.has(key)) continue;
    seenCustom.add(key);
    custom.push({ name, category: 'custom', description: String(cf?.description || ''), isCustom: true });
  }
  if (custom.length) {
    groups.push({ category: 'custom', label: FACTION_CATEGORY_LABELS.custom, options: custom.sort(byNameCodepoint) });
  }
  return groups;
}

/**
 * Flat list of addable factions (every group's options, in category order).
 *
 * @param {Object} settlement
 * @param {CompendiumFaction[]} [customFactions]
 * @returns {Array<{ name: string, category: string }>}
 */
export function factionCompendiumFlat(settlement, customFactions = []) {
  return factionCompendium(settlement, customFactions).flatMap(g => g.options);
}
