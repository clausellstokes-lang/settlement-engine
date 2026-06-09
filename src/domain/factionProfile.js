/**
 * domain/factionProfile.js — Structured faction profile derivation.
 *
 * Tier 4.1 of the roadmap. Today's faction objects are flat:
 *   { faction: string, power: number, desc: string }
 *
 * That's enough to display a power bar but not enough to drive event
 * consequences, faction-vs-faction reasoning, or AI overlays that
 * preserve causality. The roadmap's target is a structured profile:
 *
 *   {
 *     id, name, archetype, power, legitimacy,
 *     resources: { wealth, manpower, publicTrust, coerciveForce, informationAccess },
 *     wants[], fears[], leverage[], vulnerabilities[]
 *   }
 *
 * Approach: pure derivation. The generator output stays as-is; this
 * file enriches it on demand. Consumers (PDF, AI overlay, the "Why
 * does this exist?" surface) call `deriveFactionProfile(faction, s)`
 * and get the structured shape without anyone having to migrate the
 * generator.
 *
 * That's the Strangler Fig pattern this codebase has been using
 * throughout. When the generator eventually emits structured profiles
 * directly, the derivation becomes a no-op for already-structured
 * input.
 *
 * Pure functions only — no I/O, no state, no React. Tolerant of
 * missing fields; every output line falls back to a sensible default
 * so the profile is always well-formed.
 */

import { factionArchetype, FACTION_ARCHETYPES as FA } from './factionArchetypes.js';
import { governanceLedger } from './governanceLedger.js';

// Small inline id helper — derives 'faction.<snake_name>' from a faction
// name. Kept local to this file so the domain layer doesn't import
// across into src/lib (which is outside the domain tsconfig include).
// Matches the format produced by src/lib/entities.js#idOf so consumers
// querying traces by id see the same shape from both call paths.
function snakeCase(s) {
  return String(s)
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}
function factionIdFromName(name) {
  return `faction.${snakeCase(name)}`;
}

// ── Archetype detection ──────────────────────────────────────────────────
// Detection now runs through the ONE canonical detector (domain/factionArchetypes)
// shared with factionCompetition / factionRoles / factionResponses, so all four
// layers classify a faction the same way. This local vocabulary folds the canonical
// archetypes that factionProfile doesn't model (noble/civic → government; labor/
// outsider → other) onto its own keys; the canonical detector's term set is a
// superset of the old local rules, so misses like "Bandit Clan" → 'other' are now
// correctly 'criminal'.

/** canonical archetype → factionProfile's local archetype vocabulary. */
const CANONICAL_TO_PROFILE = Object.freeze({
  [FA.GOVERNMENT]: 'government', [FA.NOBLE]: 'government', [FA.CIVIC]: 'government',
  [FA.MILITARY]: 'military', [FA.MERCHANT]: 'merchant', [FA.RELIGIOUS]: 'religious',
  [FA.CRIMINAL]: 'criminal', [FA.ARCANE]: 'arcane', [FA.CRAFT]: 'craft',
  [FA.OCCUPATION]: 'occupation',
  [FA.LABOR]: 'other', [FA.OUTSIDER]: 'other', [FA.OTHER]: 'other',
});

/**
 * Archetype for a faction, in factionProfile's local vocabulary
 * (occupation/criminal/arcane/religious/military/merchant/craft/government/other).
 * Delegates detection to the canonical factionArchetype() so every layer agrees.
 */
export function deriveFactionArchetype(faction) {
  if (!faction) return 'other';
  return CANONICAL_TO_PROFILE[factionArchetype(faction)] || 'other';
}

// ── Archetype templates ──────────────────────────────────────────────────
// Default profile data per archetype. These are reasonable starting
// values that consumers can refine or override later (Tier 4.16 custom
// user content adopts the same shape). The roadmap calls out
// resource-band values explicitly: low / medium / high.

const ARCHETYPE_TEMPLATES = Object.freeze({
  government: {
    wants:    ['maintain authority', 'collect taxes / tribute', 'preserve order'],
    fears:    ['popular uprising', 'rival faction outflanking them', 'loss of legitimacy'],
    leverage: ['legal force', 'tax base', 'public records'],
    vulnerabilities: ['unpopular policy backlash', 'depends on military loyalty'],
    resources: { wealth: 'medium', manpower: 'medium', publicTrust: 'medium', coerciveForce: 'high',   informationAccess: 'high'   },
  },
  military: {
    wants:    ['secure the walls', 'budget for arms', 'professional standing'],
    fears:    ['unpaid wages', 'overwhelming external threat', 'civilian disrespect'],
    leverage: ['coercive force', 'wall control', 'arms expertise'],
    vulnerabilities: ['relies on tax base', 'morale fragile under siege'],
    resources: { wealth: 'low',    manpower: 'high',   publicTrust: 'medium', coerciveForce: 'high',   informationAccess: 'medium' },
  },
  religious: {
    wants:    ['preserve moral authority', 'expand pastoral role', 'fund relief'],
    fears:    ['scandal', 'sectarian rivalry', 'state encroachment'],
    leverage: ['public trust', 'birth / death records', 'charity infrastructure'],
    vulnerabilities: ['dependent on donations', 'staff overextended'],
    resources: { wealth: 'medium', manpower: 'low',    publicTrust: 'high',   coerciveForce: 'low',    informationAccess: 'high'   },
  },
  merchant: {
    wants:    ['open trade routes', 'low duties', 'prevent price controls'],
    fears:    ['warehouse inspections', 'bandits on the road', 'dockworker strikes'],
    leverage: ['supply chains', 'capital reserves', 'trade contacts'],
    vulnerabilities: ['suspected hoarding', 'price-fixing rumors'],
    resources: { wealth: 'high',   manpower: 'medium', publicTrust: 'medium', coerciveForce: 'medium', informationAccess: 'high'   },
  },
  craft: {
    wants:    ['guild standards enforced', 'apprentice pipelines', 'fair pricing'],
    fears:    ['cheap imports', 'rogue craftsmen', 'guild infighting'],
    leverage: ['quality monopoly', 'guild membership keys'],
    vulnerabilities: ['member factionalism', 'undercutting from outside'],
    resources: { wealth: 'medium', manpower: 'medium', publicTrust: 'medium', coerciveForce: 'low',    informationAccess: 'medium' },
  },
  criminal: {
    wants:    ['black-market access', 'corrupt officials', 'no inspections'],
    fears:    ['professional watch', 'informants', 'rival gang'],
    leverage: ['smuggling routes', 'corrupt contacts', 'fear'],
    vulnerabilities: ['raids', 'betrayal', 'public crackdown'],
    resources: { wealth: 'medium', manpower: 'medium', publicTrust: 'low',    coerciveForce: 'medium', informationAccess: 'high'   },
  },
  arcane: {
    wants:    ['protect knowledge', 'state recognition', 'attract apprentices'],
    fears:    ['witch hunts', 'magical accidents', 'rival schools'],
    leverage: ['arcane competency', 'magical infrastructure'],
    vulnerabilities: ['public superstition', 'small membership'],
    resources: { wealth: 'medium', manpower: 'low',    publicTrust: 'medium', coerciveForce: 'medium', informationAccess: 'high'   },
  },
  occupation: {
    wants:    ['extract tribute', 'pacify the population', 'demonstrate strength to the homeland'],
    fears:    ['homeland recall', 'a successful uprising', 'foreign rivals'],
    leverage: ['external force projection', 'foreign coin', 'overwhelming arms'],
    vulnerabilities: ['no local legitimacy', 'isolated from supply'],
    resources: { wealth: 'medium', manpower: 'high',   publicTrust: 'low',    coerciveForce: 'high',   informationAccess: 'medium' },
  },
  other: {
    wants:    ['advance their interests'],
    fears:    ['losing relevance'],
    leverage: ['institutional position'],
    vulnerabilities: ['under-resourced'],
    resources: { wealth: 'medium', manpower: 'medium', publicTrust: 'medium', coerciveForce: 'medium', informationAccess: 'medium' },
  },
});

/**
 * Look up the archetype template. Returns 'other' for unknown values.
 * Read-only — returns a shallow clone so callers can safely customize.
 */
export function templateForArchetype(archetype) {
  const t = ARCHETYPE_TEMPLATES[archetype] || ARCHETYPE_TEMPLATES.other;
  // Shallow clone (with deeper clones for array/object fields) so a
  // consumer modifying `wants` doesn't pollute the frozen template.
  return {
    wants:    [...t.wants],
    fears:    [...t.fears],
    leverage: [...t.leverage],
    vulnerabilities: [...t.vulnerabilities],
    resources: { ...t.resources },
  };
}

// ── Legitimacy derivation ────────────────────────────────────────────────
// The settlement carries a single publicLegitimacy score on
// powerStructure. Per-faction legitimacy doesn't exist as a stored
// field yet, so we approximate: the governing faction inherits the
// settlement's public legitimacy score; non-governing factions get a
// neutral 50 (middle band). When Tier 4.2 (faction relationship
// updates after events) lands, this derivation will be the place
// where event-driven legitimacy adjustments aggregate.

function legitimacyFor(faction, settlement) {
  const power = settlement?.powerStructure || settlement?.power;
  if (!power) return 50;

  const factionName = typeof faction === 'string' ? faction : (faction.faction || faction.name || '');
  const govName = power.governingName || '';
  const isGoverning = !!(govName && factionName && govName.toLowerCase().includes(factionName.toLowerCase().split(/[\s/(]/)[0].toLowerCase()))
    || power.governingFactionName === factionName;

  // Governing faction inherits the settlement's public legitimacy via the conserved
  // governance ledger (handles the { score } object + legacy bare number uniformly).
  const gov = governanceLedger(settlement);
  if (isGoverning && gov.present) return gov.legitimacyScore;

  // Non-governing factions: neutral baseline. Future Tier 4.2 work
  // will shift this based on whether the faction is sponsoring relief,
  // pursuing scandals, etc.
  return 50;
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Build a structured profile for a faction.
 *
 * Pure: doesn't mutate the input. Idempotent: running it twice
 * produces the same output. Lossless on the input fields — `power`,
 * `desc`, etc. are preserved on the returned profile.
 *
 * @param {Object|string} faction
 * @param {Object} [settlement]   Optional context for legitimacy
 *                                derivation. If omitted, legitimacy
 *                                falls back to 50 (neutral).
 * @returns {Object} The enriched profile.
 */
export function deriveFactionProfile(faction, settlement) {
  if (!faction) return null;

  const name = typeof faction === 'string'
    ? faction
    : (faction.faction || faction.name || 'Unnamed Faction');
  const archetype = deriveFactionArchetype(faction);
  const template = templateForArchetype(archetype);

  return {
    // Stable id, suitable for trace targetId. Format matches
    // src/lib/entities.js#idOf so consumers querying by id from either
    // call path see the same shape.
    id: factionIdFromName(name),

    name,
    archetype,
    power:      typeof faction === 'object' ? (faction.power ?? 0) : 0,
    legitimacy: legitimacyFor(faction, settlement),

    resources:       template.resources,
    wants:           template.wants,
    fears:           template.fears,
    leverage:        template.leverage,
    vulnerabilities: template.vulnerabilities,

    // Preserve everything else off the legacy object so consumers
    // currently reading `faction.desc` etc. keep working.
    ...(typeof faction === 'object' ? { desc: faction.desc } : {}),
    // Phase 19: preserve controlsInstitutionIds so the explanation
    // module can answer "which factions control this institution?"
    // without reaching into the raw faction list separately.
    controlsInstitutionIds: (typeof faction === 'object' && Array.isArray(faction.controlsInstitutionIds))
      ? [...faction.controlsInstitutionIds]
      : [],
  };
}

/**
 * Convenience: enrich every faction on a settlement into a structured
 * profile. Useful for the PipelineRail / PDF faction section that
 * wants to render the whole roster.
 */
export function deriveAllFactionProfiles(settlement) {
  if (!settlement) return [];
  const factions = settlement.powerStructure?.factions
                || settlement.power?.factions
                || settlement.factions
                || [];
  return factions.map(f => deriveFactionProfile(f, settlement));
}
