/**
 * generators/factionRoles.js — Faction archetype → structural NPC roles.
 *
 * Closes the plan's "faction-to-NPC coupling at generation time" gap:
 * when a faction is generated, the structural NPCs it implies (high
 * priestess, watch captain, guildmaster) should also exist by default.
 * Without this, KILL_NPC events on pillar roles produce institutional
 * vacuums against NPCs that don't exist yet, and the SuccessorPrompt
 * has nothing to suggest.
 *
 * Each entry produces 1-3 structural NPCs per faction. The pipeline
 * step (`assembleSettlement.js`) walks the faction list, maps each to
 * its archetype via name pattern, and synthesizes the implied NPCs if
 * they don't already exist in the generated NPC list.
 *
 * Pure data + helper. No React, no store.
 */

import { factionArchetype, FACTION_ARCHETYPES as FA } from '../domain/factionArchetypes.js';

// inferImportance is not used directly here yet — kept on the import
// graph for future expansion where archetype rules read existing NPC
// importance to decide whether to skip generation.

/**
 * Per-archetype role definitions. Each role becomes a generated NPC
 * with the given importance + linkage if the faction is detected.
 *
 *   role        — display title
 *   importance  — 'pillar' for solo role-holders, 'key' for senior staff
 *   linkToInst  — optional name pattern; if matched in the institution
 *                 list, the NPC's linkedInstitutionIds gets that inst's id
 */
export const FACTION_ROLES = {
  temple: [
    { role: 'High Priestess', importance: 'pillar', linkToInst: /temple|cathedral|shrine|monastery/ },
  ],
  watch: [
    { role: 'Watch Captain',  importance: 'key',    linkToInst: /watch|garrison|barracks|militia/ },
  ],
  merchant: [
    { role: 'Guildmaster',    importance: 'key',    linkToInst: /market|exchange|trade hall|guild/ },
    { role: 'Senior Trader',  importance: 'notable' },
  ],
  thieves: [
    { role: 'Kingpin',        importance: 'pillar' },
    { role: 'Lieutenant',     importance: 'key' },
  ],
  noble: [
    { role: 'Lord Mayor',     importance: 'pillar', linkToInst: /council|court|hall|government/ },
  ],
  arcane: [
    { role: 'Archmagister',   importance: 'pillar', linkToInst: /tower|academy|college|magisterium/ },
  ],
};

// Canonical archetype → factionRoles' structural-role key. Only these six imply
// structural NPCs; every other canonical archetype → null (no synthesis), as before.
// craft → merchant preserves the legacy behavior (a "craft guild" matched merchant
// via its 'guild' token and got the merchant role-holders).
const CANONICAL_TO_ROLE = Object.freeze({
  [FA.CRIMINAL]: 'thieves',
  [FA.RELIGIOUS]: 'temple',
  [FA.MILITARY]: 'watch',
  [FA.MERCHANT]: 'merchant',
  [FA.CRAFT]:    'merchant',
  [FA.NOBLE]:    'noble',
  [FA.ARCANE]:   'arcane',
});

/**
 * Map a faction to its structural-role archetype via the shared canonical detector,
 * so the structural-NPC coupling classifies factions the same way the response,
 * profile, and competition layers do. Returns null for archetypes with no roles.
 *
 * @param {Object} faction
 * @returns {keyof typeof FACTION_ROLES | null}
 */
export function matchFactionArchetype(faction) {
  return CANONICAL_TO_ROLE[factionArchetype(faction)] || null;
}

/**
 * Generate structural NPCs for a faction. Returns an array of NPC
 * records ready to merge into the settlement's `npcs` list. The
 * caller is responsible for de-duplication.
 *
 * @param {Object} faction
 * @param {Object[]} institutions   for resolving linkToInst
 * @returns {Object[]} structural NPCs
 */
export function generateFactionStructuralNpcs(faction, institutions = []) {
  const arch = matchFactionArchetype(faction);
  if (!arch) return [];
  const defs = FACTION_ROLES[arch] || [];
  const factionId = faction.id || faction.faction || faction.name || '';
  const factionName = faction.name || faction.faction || 'Unknown faction';
  return defs.map((def, i) => {
    const linkedInstId = def.linkToInst
      ? institutions.find(inst => def.linkToInst.test(String(inst.name || '').toLowerCase()))?.id
      : null;
    return {
      id: `npc.${slug(factionName)}_${slug(def.role)}_${i}`,
      name: nameTemplateFor(def.role),
      role: def.role,
      importance: def.importance,
      status: 'active',
      linkedInstitutionIds: linkedInstId ? [linkedInstId] : [],
      linkedFactionIds: factionId ? [factionId] : [],
      // Defaults for the structural fields the impairment engine reads.
      influence: def.importance === 'pillar' ? 75 : def.importance === 'key' ? 50 : 25,
      legitimacyContribution: def.importance === 'pillar' ? 30 : 10,
      stabilityContribution:  def.importance === 'pillar' ? 25 : 8,
      generatedAs: 'faction_structural',  // marker for migration / debugging
    };
  });
}

/**
 * Walk all factions in a settlement and ensure each archetype has its
 * structural NPCs. Idempotent: skips a role if an existing NPC already
 * matches it (by role pattern + faction linkage).
 *
 * @param {Object} settlement
 * @returns {Object} new settlement with structural NPCs appended
 */
export function ensureFactionStructuralNpcs(settlement) {
  if (!settlement) return settlement;
  const factions = settlement.factions || settlement.powerStructure?.factions || [];
  if (!factions.length) return settlement;

  const existingNpcs = settlement.npcs || [];
  const additions = [];
  for (const faction of factions) {
    const structural = generateFactionStructuralNpcs(faction, settlement.institutions || []);
    for (const proposed of structural) {
      const proposedFactionKeys = proposed.linkedFactionIds.map(id => String(id).toLowerCase());
      const alreadyExists = existingNpcs.some(npc => {
        // Same role (whitespace/punctuation-insensitive, so 'Guild Master' ===
        // 'Guildmaster') + same faction = treat as the same person.
        const sameRole = normalizeRoleKey(npc.role) === normalizeRoleKey(proposed.role);
        if (!sameRole) return false;
        // Pipeline NPCs link to their faction via factionAffiliation (display
        // name), NOT linkedFactionIds — checking only ids meant the dedup never
        // matched a generated NPC, so structural seat-holders always duplicated.
        const byId = (npc.linkedFactionIds || []).some(id => proposedFactionKeys.includes(String(id).toLowerCase()));
        const byAffiliation = proposedFactionKeys.includes(String(npc.factionAffiliation || '').toLowerCase());
        return byId || byAffiliation;
      });
      if (!alreadyExists) additions.push(proposed);
    }
  }
  if (!additions.length) return settlement;
  return { ...settlement, npcs: [...existingNpcs, ...additions] };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function slug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Collapse role strings to a comparison key insensitive to whitespace and
// punctuation so 'Guild Master' and 'Guildmaster' dedup as the same role.
function normalizeRoleKey(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Placeholder name template per role. The pipeline's NPC name generator
 * could substitute culturally-appropriate names later; for now we
 * produce a recognizable placeholder so the entity exists and can be
 * killed/replaced by events without breaking lookups.
 */
function nameTemplateFor(role) {
  return `The ${role}`;
}
