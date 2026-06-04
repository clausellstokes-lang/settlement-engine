/**
 * domain/aiGrounding.js - AI prompt grounding envelope.
 *
 * Tier 6.1 of the roadmap. The AI overlay must be grounded in the
 * simulator's structured facts - never inventing names, facts, or
 * relationships. Phase 46 composes every Tier 2-5 derivation into a
 * single envelope the prompt assembler stringifies:
 *
 *   buildAiGroundingPayload(settlement, options) -> {
 *     identity,         id/name/tier/seed/versions
 *     spine,            7-line simulation spine (P7)
 *     bands: {
 *       substrate,      P17 - variable → band
 *       capacities,     P21 - capacity → band
 *     },
 *     factions,         P9 - wants/fears/leverage/vulnerabilities
 *     chains,           P10 - status / controller / beneficiaries / victims
 *     conditions,       P16 - archetype / severity / affected systems
 *     threats,          P20 - severity / current stage / visibility
 *     npcs,             P13 - dominant rank, archetype, removal impact
 *     history,          P12 - 7 canonical beats
 *     hooks,            P11 - top-N by severity
 *     contradictions,   P25 - structural anomalies + justifications
 *     dailyLife,        P22 - 8 slots
 *     districts,        P29 - wealth / safety / tension / hook per district
 *     region,           P30 - typed neighbour graph
 *     constraints: {
 *       forbidden,      what the AI MUST NOT do
 *       lockedEntities, P33 canon-tagged entities preserved
 *       userDirection,  optional narrative direction (caller-provided)
 *     }
 *   }
 *
 * Pure read-only. Composes every Phase 7+ derivation; no mutation.
 *
 * Architectural fit:
 *   - The edge function `supabase/functions/generate-narrative` consumes
 *     a bundled copy of this module from `_shared/aiGroundingBundle.js`.
 *     That keeps Deno deployment self-contained while preserving the
 *     same centrally-tested derivation used by app-side tests.
 *   - `assemblePromptSections(payload)` returns the canonical
 *     ordering for the prompt: system instructions → dossier →
 *     user direction → output format. The order matches the
 *     prompt-injection-safe contract from Tier 6.9.
 */

import { deriveSimulationSpine } from './simulationSpine.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllCapacities } from './capacityModel.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllNpcProfiles } from './npcProfile.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { deriveAllStructuredHooks } from './hookEscalation.js';
import { detectContradictions } from './contradictions.js';
import { deriveDailyLife } from './dailyLife.js';
import { deriveAllDistricts } from './districtProfile.js';
import { deriveRegionalGraph } from './regionalGraph.js';
import { canonBreakdown, tagEntityCanon } from './canonStatus.js';
import { walkUserEdits } from './userEdits.js';

// Surface the user's hand-authored values verbatim in the grounding
// payload. The structured profile sections strip prose down to typed
// fields, so the AI wouldn't see the actual edited text without this
// dedicated section.
function collectUserEditsSummary(settlement) {
  if (!settlement) return [];
  return walkUserEdits(settlement).map(({ kind, entityIndex, entity, path, record }) => ({
    kind,
    entityIndex,
    label: kind === 'settlement'
      ? 'settlement'
      : (entity?.name || entity?.faction || `#${entityIndex}`),
    path,
    value: record?.value,
    editedAt: record?.editedAt || null,
  }));
}

// ── Defaults ─────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS = Object.freeze({
  topHooks: 5,            // include only the N highest-severity hooks
  dominantNpcsOnly: true, // most prompts only care about dominant figures
  includeContradictions: true,
  userDirection: null,
});

// ── Locked-entity enumeration ────────────────────────────────────────────
//
// The AI may NOT change: anything user-authored, anything explicitly
// locked, anything committed via an event (those are timeline-anchored).
// We walk the settlement's tagged entity arrays and collect references.

function collectLockedEntities(settlement) {
  const out = [];
  if (!settlement) return out;

  const collect = (arr, type, idKey = 'id', nameKey = 'name', _tagSettlement) => {
    if (!Array.isArray(arr)) return;
    for (const entity of arr) {
      if (!entity) continue;
      const tag = tagEntityCanon(entity);
      if (!tag.locked) continue;
      out.push({
        id: entity[idKey] || `${type}.${(entity[nameKey] || 'unknown').toLowerCase().replace(/\s+/g, '_')}`,
        type,
        label: entity[nameKey] || entity[idKey] || 'unknown',
        source: tag.source,
        canonStatus: tag.canonStatus,
      });
    }
  };

  collect(settlement.institutions, 'institution');
  collect(settlement.powerStructure?.factions, 'faction', 'id', 'faction');
  collect(settlement.npcs, 'npc');
  collect(settlement.activeConditions, 'condition');

  return out;
}

// ── Forbidden-changes catalog ────────────────────────────────────────────
//
// Static + per-settlement combined. The static portion is the constant
// list of policies the AI must respect; the dynamic portion enumerates
// specific entities that exist today and must continue to exist.

const STATIC_FORBIDDEN = Object.freeze([
  'Adding NEW factions, institutions, NPCs, threats, conditions, or chains.',
  'Renaming proper nouns (settlement name, faction names, NPC names, district names).',
  'Changing numerical or categorical facts (population, tier, prosperity band, faction power).',
  'Contradicting any history beat or applied event.',
  'Inventing relationships that aren\'t in the regional graph.',
  'Changing the canon status of any entity tagged as locked.',
  'Removing or replacing any entity tagged as user-authored.',
]);

export function forbiddenChanges(settlement) {
  const out = [...STATIC_FORBIDDEN];
  if (!settlement) return out;

  // Add a line per locked entity so the AI sees the specific names.
  const locked = collectLockedEntities(settlement);
  for (const e of locked) {
    out.push(`MUST PRESERVE: ${e.type} "${e.label}" (locked, source: ${e.source}).`);
  }

  // History beats are timeline-anchored - call them out explicitly.
  const history = deriveHistoryBeats(settlement);
  for (const [key, beat] of Object.entries(history)) {
    if (beat) out.push(`MUST PRESERVE history beat (${key}): "${beat.text}"`);
  }

  // Tier 6.6: user-edited prose is canon. Each `MUST PRESERVE
  // user-edited field` line names the specific path + label so the AI
  // doesn't paraphrase or override the DM's hand-authored text.
  const edits = walkUserEdits(settlement);
  for (const { kind, entity, entityIndex, path } of edits) {
    const entityLabel = kind === 'settlement'
      ? 'settlement'
      : `${kind} "${entity?.name || entity?.faction || `#${entityIndex}`}"`;
    out.push(`MUST PRESERVE user-edited field (${path}) on ${entityLabel} - pass through verbatim.`);
  }

  return out;
}

// ── Hook trimming ────────────────────────────────────────────────────────
//
// A typical city emits 20+ hooks. Including all of them blows the
// prompt budget without much benefit. We sort by severity (critical →
// high → medium → low) and clip to the top N.

const HOOK_SEVERITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

function topHooksBySeverity(settlement, n) {
  const all = deriveAllStructuredHooks(settlement);
  const sorted = [...all].sort((a, b) => {
    const aw = HOOK_SEVERITY_ORDER[a.severity] || 0;
    const bw = HOOK_SEVERITY_ORDER[b.severity] || 0;
    return bw - aw;
  });
  return sorted.slice(0, Math.max(0, n));
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Build the structured grounding envelope.
 *
 * @param {Object} settlement
 * @param {Object} [options]
 * @param {number} [options.topHooks=5]
 * @param {boolean} [options.dominantNpcsOnly=true]
 * @param {boolean} [options.includeContradictions=true]
 * @param {string|null} [options.userDirection=null]
 * @returns {Object} AiGroundingPayload
 */
export function buildAiGroundingPayload(settlement, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!settlement) {
    return {
      identity: null,
      spine: null,
      bands: { substrate: {}, capacities: {} },
      userEdits: [],
      factions: [],
      chains: [],
      conditions: [],
      threats: [],
      npcs: [],
      history: null,
      hooks: [],
      contradictions: [],
      dailyLife: null,
      districts: [],
      region: { center: null, nodes: [], links: [] },
      constraints: {
        forbidden: [...STATIC_FORBIDDEN],
        lockedEntities: [],
        userDirection: opts.userDirection,
      },
    };
  }

  const causal = deriveCausalState(settlement);
  const capacities = deriveAllCapacities(settlement);
  const allNpcs = deriveAllNpcProfiles(settlement);
  const lockedEntities = collectLockedEntities(settlement);

  return {
    identity: {
      id: settlement.id || null,
      name: settlement.name || null,
      tier: settlement.tier || null,
      seed: settlement._seed || null,
      schemaVersion: settlement.schemaVersion ?? null,
      simulationVersion: settlement.simulationVersion ?? null,
      population: settlement.population ?? null,
      canon: canonBreakdown(settlement),
    },

    spine: deriveSimulationSpine(settlement),

    bands: {
      substrate: { ...causal.bands },
      capacities: { ...capacities.bands },
    },

    // Tier 6.6: user-edited prose lives verbatim in `userEdits` so the
    // AI sees the values it must preserve. The structured profile
    // sections (npcs, factions, institutions) are derivations that
    // strip prose down to typed fields, so they're not enough.
    userEdits: collectUserEditsSummary(settlement),

    factions:        deriveAllFactionProfiles(settlement),
    chains:          deriveAllSupplyChainStates(settlement),
    conditions:      deriveAllActiveConditions(settlement),
    threats:         deriveAllThreatProfiles(settlement),
    npcs:            opts.dominantNpcsOnly
                       ? allNpcs.filter(n => n.rank === 'dominant')
                       : allNpcs,
    history:         deriveHistoryBeats(settlement),
    hooks:           topHooksBySeverity(settlement, opts.topHooks),
    contradictions:  opts.includeContradictions ? detectContradictions(settlement) : [],
    dailyLife:       deriveDailyLife(settlement),
    districts:       deriveAllDistricts(settlement),
    region:          deriveRegionalGraph(settlement),

    constraints: {
      forbidden: forbiddenChanges(settlement),
      lockedEntities,
      userDirection: opts.userDirection,
    },
  };
}

// ── Section assembler ────────────────────────────────────────────────────
//
// The Tier 6.9 prompt-injection-safe contract requires this ordering:
//   1. System instructions  (preserve facts; no invention)
//   2. Developer instructions (output format / mode)
//   3. Dossier (canonical facts)
//   4. User narrative direction (tone/atmosphere only)
//   5. Output format reminder
//
// We return these as text sections the edge function can join with
// model-specific separators.

const SYSTEM_INSTRUCTIONS = `You are a structural narrator. The dossier below is a single source of truth - every name, faction, institution, number, and relationship in the dossier is canonical. You may rewrite prose for tone and rhythm. You MUST NOT add new entities, contradict any stated fact, or rename any proper noun.`;

const DEVELOPER_INSTRUCTIONS = `Voice: confident, unhurried. Specific over generic. Tie every descriptive line to a fact already present in the dossier. If a fact would have to be invented to make a sentence work, drop the sentence instead.`;

const OUTPUT_FORMAT_REMINDER = `Output MUST preserve every proper noun from the dossier and every numerical / categorical fact. Restructure and polish freely; do not invent.`;

/**
 * Assemble the canonical prompt sections in Tier 6.9 order. Returns a
 * { system, developer, dossier, direction, format } object the edge
 * function joins with model-specific separators.
 *
 * Tier 6.9 prompt-injection guard: the user direction is broken out
 * into its own section AND removed from the dossier payload before
 * stringification. Without this, an adversarial direction like
 * "ignore the facts" would appear at the same authority level as the
 * canonical facts (because it'd live inside `constraints.userDirection`
 * in the serialized dossier JSON).
 */
export function assemblePromptSections(payload, options = {}) {
  // Build a dossier-safe copy of the payload that omits the user
  // direction from `constraints`. The direction MUST live only in the
  // `direction` section so the prompt structure makes its lower trust
  // level explicit to the model.
  let dossierPayload = payload;
  if (payload && payload.constraints) {
     
    const { userDirection: _drop, ...constraintsWithoutDirection } = payload.constraints;
    dossierPayload = {
      ...payload,
      constraints: constraintsWithoutDirection,
    };
  }
  const sections = {
    system: SYSTEM_INSTRUCTIONS,
    developer: options.developerInstructions || DEVELOPER_INSTRUCTIONS,
    dossier: JSON.stringify(dossierPayload, null, 2),
    direction: payload?.constraints?.userDirection || null,
    format: OUTPUT_FORMAT_REMINDER,
  };
  return sections;
}

/**
 * Flat array of payload-summary lines for debug / "what went into the
 * prompt?" surfaces.
 */
export function summarizeGroundingPayload(payload) {
  if (!payload) return [];
  const lines = [];
  if (payload.identity?.name) {
    lines.push(`Identity: ${payload.identity.name} (${payload.identity.tier || 'unknown tier'}, pop. ${payload.identity.population ?? '?'}).`);
  }
  lines.push(`Substrate variables: ${Object.keys(payload.bands?.substrate || {}).length}.`);
  lines.push(`Capacities: ${Object.keys(payload.bands?.capacities || {}).length}.`);
  lines.push(`Factions: ${payload.factions?.length || 0}.`);
  lines.push(`Supply chains: ${payload.chains?.length || 0}.`);
  lines.push(`Active conditions: ${payload.conditions?.length || 0}.`);
  lines.push(`Threats: ${payload.threats?.length || 0}.`);
  lines.push(`Dominant NPCs: ${payload.npcs?.length || 0}.`);
  lines.push(`Top hooks: ${payload.hooks?.length || 0}.`);
  lines.push(`Contradictions: ${payload.contradictions?.length || 0}.`);
  lines.push(`Districts: ${payload.districts?.length || 0}.`);
  lines.push(`Forbidden-change rules: ${payload.constraints?.forbidden?.length || 0}.`);
  lines.push(`Locked entities: ${payload.constraints?.lockedEntities?.length || 0}.`);
  if (payload.constraints?.userDirection) {
    lines.push(`User direction: "${payload.constraints.userDirection}"`);
  } else {
    lines.push('User direction: none.');
  }
  return lines;
}

// ── Catalog accessors ────────────────────────────────────────────────────

export function defaultGroundingOptions() {
  return { ...DEFAULT_OPTIONS };
}

export function staticForbiddenRules() {
  return [...STATIC_FORBIDDEN];
}
