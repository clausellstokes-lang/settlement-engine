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
import {
  nativeSemanticName,
} from '../domain/content/customContentSemanticAuthority.js';
import { factionDisplayNameOf, factionRefOf } from '../domain/factionRefs.js';
import { resolveGenerationWorldLaw } from './generationContext.js';

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

// OFFICE-EQUIVALENCE: realized NPC role (whitespace/punct-insensitive, see
// normalizeRoleKey) → the structural role-key that role FILLS. This is the
// office-coverage fallback: when an existing NPC's factionAffiliation does not
// resolve to a power-seat (custom content, partial data), a clear leadership
// title still marks the office held so a placeholder is NOT duplicated beside it
// (the probe: a realized 'Guard Captain' covers the 'watch' office that a
// 'Watch Captain' placeholder would otherwise duplicate). Validated against the
// generator's real role vocabulary; only UNAMBIGUOUS leadership titles are listed
// — ambiguous roles (Miller, Blacksmith, Healer, Lieutenant) are deliberately
// omitted so they never mis-cover an office. Coverage-only: an entry can suppress
// a duplicate, never force a synthesis.
const ROLE_KEY_SYNONYMS = Object.freeze({
  // watch (military leadership)
  guardcaptain: 'watch', watchcaptain: 'watch', captainofthewatch: 'watch',
  sheriff: 'watch', constable: 'watch', marshal: 'watch', commander: 'watch',
  knightdame: 'watch', warden: 'watch', sergeantatarms: 'watch',
  // temple (religious leadership)
  highpriest: 'temple', highpriestess: 'temple', archpriest: 'temple',
  deaconcurate: 'temple', parishpriest: 'temple', chaplain: 'temple',
  bishop: 'temple', abbot: 'temple', abbess: 'temple', prelate: 'temple',
  patriarch: 'temple', matriarch: 'temple',
  // merchant (trade / craft leadership)
  guildmaster: 'merchant', grainfactor: 'merchant', factor: 'merchant',
  mastercraftsman: 'merchant', marketoverseer: 'merchant', caravanmaster: 'merchant',
  mastertanner: 'merchant', masterweaver: 'merchant', headbrewer: 'merchant',
  seniortrader: 'merchant', trademaster: 'merchant',
  // thieves (criminal leadership)
  kingpin: 'thieves', crimelord: 'thieves', shadowmaster: 'thieves',
  fence: 'thieves', localfence: 'thieves',
  // noble
  lordmayor: 'noble', lordladyofthemanor: 'noble', lordofthemanor: 'noble',
  nobleheir: 'noble', baron: 'noble', baroness: 'noble', headofhouse: 'noble',
  // arcane
  archmagister: 'arcane', archmage: 'arcane', magister: 'arcane',
  courtwizard: 'arcane', highsorcerer: 'arcane', mastermage: 'arcane',
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
 * @param {unknown} generationContext
 * @returns {Object[]} structural NPCs
 */
export function generateFactionStructuralNpcs(
  faction,
  institutions = [],
  generationContext = null,
) {
  const arch = matchFactionArchetype(faction);
  if (!arch) return [];
  const worldLaw = resolveGenerationWorldLaw(generationContext);
  const defs = (FACTION_ROLES[arch] || []).filter(worldLaw.allowsRole);
  // `linkedFactionIds` is the propagation identity: prefer a durable authored
  // id, falling back to the canonical display key only for legacy/generated
  // seats that genuinely carry no id. `factionAffiliation` remains display prose.
  const factionKey = factionRefOf(faction);
  const factionName = factionDisplayNameOf(faction) || 'Unknown faction';
  return defs.map((def, i) => {
    const linkedInstId = def.linkToInst
      ? institutions.find(inst => def.linkToInst.test(
        nativeSemanticName(inst).toLowerCase(),
      ))?.id
      : null;
    return {
      id: `npc.${slug(factionName)}_${slug(def.role)}_${i}`,
      name: nameTemplateFor(def.role),
      role: def.role,
      importance: def.importance,
      status: 'active',
      // factionAffiliation is the DISPLAY-name link every pipeline NPC carries and
      // the key downstream consumers (and this module's own office-coverage) read.
      // Stamping it makes the synthesized leader belong to its seat AND makes a
      // second ensureFactionStructuralNpcs pass idempotent (the placeholder now
      // covers its own office, so it is not re-synthesized).
      factionAffiliation: factionName,
      linkedInstitutionIds: linkedInstId ? [linkedInstId] : [],
      // Canonical faction identity. Name-only legacy seats intentionally fall
      // back to their display key; id-bearing seats must never be downgraded to
      // a rename-sensitive label because propagation and clergy joins are id-first.
      linkedFactionIds: factionKey ? [factionKey] : [],
      // Defaults for the structural fields the impairment engine reads.
      // Influence is a BAND STRING everywhere it is consumed (npcComponents,
      // campaign PDF filter `influence === 'high'`) — the prior numeric 75/50/25
      // silently failed every consumer comparison.
      influence: def.importance === 'pillar' ? 'high' : def.importance === 'key' ? 'moderate' : 'low',
      legitimacyContribution: def.importance === 'pillar' ? 30 : 10,
      stabilityContribution:  def.importance === 'pillar' ? 25 : 8,
      generatedAs: 'faction_structural',  // marker for migration / debugging
    };
  });
}

/**
 * Walk a settlement's power-seats and synthesize a structural leader ONLY for an
 * office (temple/watch/merchant/thieves/noble/arcane) that NO realized NPC already
 * holds. Idempotent, and — critically — office-EQUIVALENT: a 'Watch Captain'
 * placeholder is NOT added beside a realized 'Guard Captain', because coverage is
 * keyed on the ROLE-KEY (archetype), not the exact role string.
 *
 * THE BUG THIS FIXES (generators-domain-2): the prior implementation walked
 * `settlement.factions` — the NPC-GROUPING list ("The Commercial Circle") whose
 * names frequently classify as 'other', so most offices were silently dropped;
 * and its dedup matched on exact role string + faction id, neither of which lines
 * up with a realized seat-holder (role names differ — 'Watch Captain' vs 'Guard
 * Captain'; the grouping's id is not the seat-holder's factionAffiliation). Net
 * result: it synthesized DUPLICATES beside realized leaders AND missed genuinely
 * unled offices. The fix reads the authoritative `powerStructure.factions` seats
 * (which carry a classifying `category`) and dedups by office-equivalence.
 *
 * @param {Object} settlement
 * @param {unknown} generationContext
 * @returns {Object} new settlement with structural NPCs appended
 */
export function ensureFactionStructuralNpcs(
  settlement,
  generationContext = null,
) {
  if (!settlement) return settlement;
  const worldLaw = resolveGenerationWorldLaw(
    generationContext,
    settlement.config || settlement._config || {},
  );
  // Office source: the powerStructure power-seats are the authoritative faction
  // list — each carries a `category` that classifies reliably. Fall back to the
  // grouping list only when no powerStructure exists (bare-faction test inputs).
  const seats = settlement.powerStructure?.factions?.length
    ? settlement.powerStructure.factions
    : (settlement.factions || []);
  if (!seats.length) return settlement;

  const existingNpcs = settlement.npcs || [];

  // Index seats by display name so a realized NPC's factionAffiliation resolves to
  // its seat's canonical archetype (→ role-key).
  const seatByName = new Map();
  for (const seat of seats) {
    const nm = factionDisplayNameOf(seat).toLowerCase();
    if (nm) seatByName.set(nm, seat);
  }

  // OFFICE COVERAGE by role-key. An office is "already held" if any existing NPC
  // resolves to that role-key — via its affiliation's archetype (primary) or a
  // leadership role-synonym (fallback). Synthesized placeholders from a prior pass
  // count as coverage too (they carry factionAffiliation), so re-running is a no-op.
  const coveredRoleKeys = new Set();
  for (const npc of existingNpcs) {
    const affil = String(npc.factionAffiliation || '').toLowerCase();
    const seat = affil ? seatByName.get(affil) : null;
    const byAffiliation = seat
      ? matchFactionArchetype(seat)
      : (affil ? matchFactionArchetype({ name: affil }) : null);
    if (byAffiliation) coveredRoleKeys.add(byAffiliation);
    const byRole = ROLE_KEY_SYNONYMS[normalizeRoleKey(npc.role)];
    if (byRole) coveredRoleKeys.add(byRole);
  }

  const additions = [];
  for (const seat of seats) {
    const roleKey = matchFactionArchetype(seat);
    if (!roleKey) continue;                     // archetype with no structural roles (government/civic/labor/…)
    if (coveredRoleKeys.has(roleKey)) continue; // office already held (realized or already-synthesized)
    const structural = generateFactionStructuralNpcs(
      seat,
      settlement.institutions || [],
      worldLaw,
    );
    if (!structural.length) continue;
    additions.push(...structural);
    coveredRoleKeys.add(roleKey);               // one office per role-key: a 2nd economy seat won't re-synthesize
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
