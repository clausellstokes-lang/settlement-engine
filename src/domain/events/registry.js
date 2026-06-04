/**
 * domain/events/registry.js - Canon event impact specifications.
 *
 * The registry started as a five-event floor, then expanded into a broader
 * canon event vocabulary. Keep adding types deliberately: every event needs
 * (1) an impact spec, (2) a rerun-affected map entry, (3) faction-response
 * coverage where relevant, and (4) tests.
 *
 * An impact spec has three parts:
 *   - state:    direct adjustments to SystemState dimensions (additive)
 *   - rerun:    which pipeline-step `provides` keys to invalidate so
 *               the next reactive rerun touches the right subsystems
 *   - narrate:  short DM-facing template, fed into the EventLogEntry
 *               narrativeSummary
 *
 * Tags on the event target (e.g. an institution's `tags: ['food_storage']`)
 * can refine the state effects - but in v1 we keep it simple and use
 * coarse classification by name pattern. A future tag system replaces
 * `classifyInstitution` without touching this registry.
 */

/** @typedef {import('../types.js').EventType} EventType */
/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../entities/status.js').Impairment} Impairment */
/** @typedef {import('../entities/npcs.js').NpcStructural} NpcStructural */

/**
 * Each spec may now optionally declare entity patches the apply step
 * commits against the settlement object. This is the architecture
 * fix the audit kept flagging: events must mutate entities, not just
 * SystemState. Fields:
 *
 *   institutionImpairments(event, settlement) → Array<{ instId, impairment }>
 *   factionImpairments(event, settlement)     → Array<{ factionId, impairment }>
 *   institutionStatusChanges(event)           → Array<{ instId, status }>
 *   npcMutations(event, settlement)           → Array<{ npcId|create, patch|npc }>
 *
 * All optional; any missing one is treated as no-op.
 */

/**
 * Coarse institution classification by name pattern. Replaced by tag
 * lookup once the catalog migrates to structured tags.
 */
function classifyInstitution(name) {
  const n = String(name || '').toLowerCase();
  if (/granary|mill|silo|storage|warehouse/.test(n))           return 'food_storage';
  if (/temple|cathedral|shrine|monastery|church/.test(n))      return 'religious';
  if (/watch|garrison|barracks|militia|guard/.test(n))         return 'law_enforcement';
  if (/market|bazaar|exchange|trade hall/.test(n))             return 'trade';
  if (/inn|tavern|hospitality/.test(n))                        return 'hospitality';
  if (/court|hall|council|government/.test(n))                 return 'civic';
  if (/bank|treasury|mint/.test(n))                            return 'finance';
  if (/forge|smithy|workshop|guild/.test(n))                   return 'production';
  return 'other';
}

/**
 * State-effect tables per institution kind. The numbers are deltas
 * applied to the *raw* dimension value before it's clamped/banded.
 * They're chosen so a typical event produces a 7-20 point swing -
 * enough to feel real, not so much that one event vaults a town
 * across two bands.
 */
const INSTITUTION_KIND_DELTAS = {
  food_storage:    { resilience: -18, resourcePressure: +12 },
  religious:       { resilience:  -8, volatility: +5 },
  law_enforcement: { resilience: -10, volatility: +12 },
  trade:           { resilience: -10, resourcePressure: +8 },
  hospitality:     { resilience:  -4, volatility: +3 },
  civic:           { resilience: -10, volatility: +6 },
  finance:         { resilience:  -8, resourcePressure: +5 },
  production:      { resilience:  -8, resourcePressure: +6 },
  other:           { resilience:  -5, volatility: +2 },
};

/**
 * Pipeline-step `provides` keys to invalidate when an event of a given
 * type fires. These map onto `getAffectedSteps()` in the pipeline so a
 * reactive rerun touches only the necessary subsystems. Keep the lists
 * tight - over-invalidating costs CPU and risks reshuffling unrelated
 * generated content (which would feel like a regen).
 */
export const RERUN_KEYS_FOR_EVENT = {
  ADD_INSTITUTION:    ['institutions', 'services', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  REMOVE_INSTITUTION: ['institutions', 'services', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  DAMAGE_INSTITUTION: ['services', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  DEPLETE_RESOURCE:   ['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  CUT_TRADE_ROUTE:    ['activeChains', 'foodSecurity', 'economicState', 'narrative'],
  ADD_NPC:                ['npcs', 'powerStructure', 'narrative'],
  KILL_NPC:               ['npcs', 'powerStructure', 'institutions', 'narrative'],
  ASSIGN_NPC_TO_ROLE:     ['npcs', 'institutions', 'powerStructure', 'narrative'],
  IMPAIR_INSTITUTION:     ['institutions', 'services', 'economicState', 'narrative'],
  RESTORE_INSTITUTION:    ['institutions', 'services', 'economicState', 'narrative'],
  IMPAIR_FACTION:         ['powerStructure', 'narrative'],
  RESTORE_FACTION:        ['powerStructure', 'narrative'],
  // Wave 1 extended events.
  KILL_LEADER:            ['npcs', 'powerStructure', 'institutions', 'narrative'],
  EXPOSE_CORRUPTION:      ['powerStructure', 'institutions', 'economicState', 'narrative'],
  REFUGEE_WAVE:           ['demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  PLAGUE:                 ['demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  RAID_OR_MONSTER_ATTACK: ['institutions', 'economicState', 'narrative'],
  // Phase 24 / Tier 4.11 - player intervention events
  REMOVED_THREAT:         ['economicState', 'powerStructure', 'narrative'],
  BROKERED_ALLIANCE:      ['powerStructure', 'narrative'],
  STARTED_RIOT:           ['powerStructure', 'economicState', 'narrative'],
  OPENED_TRADE_ROUTE:     ['activeChains', 'foodSecurity', 'economicState', 'narrative'],
  RECOVERED_RESOURCE:     ['resources', 'activeChains', 'economicState', 'narrative'],
  DESTROY_SETTLEMENT:     ['economicState', 'powerStructure', 'narrative'],
};

/**
 * The full event registry. Each entry produces:
 *   - stateDeltas(event, settlement) → partial SystemState additive numbers
 *   - narrate(event, settlement)     → one-line DM-facing summary
 */
export const EVENT_REGISTRY = {
  ADD_INSTITUTION: {
    label: 'Add institution',
    description: 'A new institution is established. New civic capacity, new factional weight.',
    requiresTarget: true,
    targetPrompt: 'Institution name (e.g. "Granary", "Temple of Mercy")',
    stateDeltas(event) {
      const kind = classifyInstitution(event.targetId);
      const base = INSTITUTION_KIND_DELTAS[kind] || INSTITUTION_KIND_DELTAS.other;
      // Adding inverts the sign of the destruction effect: gaining a
      // granary improves resilience by the same magnitude losing one
      // would hurt it.
      return invertSigns(base);
    },
    narrate(event) {
      return `A new ${labelOf(event.targetId)} was established.`;
    },
  },

  REMOVE_INSTITUTION: {
    label: 'Remove institution',
    description: 'An institution closes or is dissolved. Its services and authority disappear.',
    requiresTarget: true,
    targetPrompt: 'Institution name to remove',
    stateDeltas(event) {
      const kind = classifyInstitution(event.targetId);
      const base = INSTITUTION_KIND_DELTAS[kind] || INSTITUTION_KIND_DELTAS.other;
      // Full removal is slightly more severe than damage - multiply by
      // 1.2 to express that.
      return scale(base, 1.2);
    },
    narrate(event) {
      return `The ${labelOf(event.targetId)} closed or was dissolved.`;
    },
  },

  DAMAGE_INSTITUTION: {
    label: 'Damage institution',
    description: 'An institution is damaged but not destroyed. Reduced capacity, recoverable.',
    requiresTarget: true,
    targetPrompt: 'Institution name to damage',
    stateDeltas(event) {
      const kind = classifyInstitution(event.targetId);
      const base = INSTITUTION_KIND_DELTAS[kind] || INSTITUTION_KIND_DELTAS.other;
      // Damage scaled by severity (default 0.7) - burning the granary at
      // severity 1.0 hurts as much as removal; vandalizing it at 0.3
      // costs much less.
      const sev = Number(event.payload?.severity ?? 0.7);
      return scale(base, sev);
    },
    narrate(event) {
      const sev = Number(event.payload?.severity ?? 0.7);
      const word = sev >= 0.85 ? 'gutted' : sev >= 0.5 ? 'damaged' : 'partly damaged';
      return `The ${labelOf(event.targetId)} was ${word}.`;
    },
  },

  DEPLETE_RESOURCE: {
    label: 'Deplete resource',
    description: 'A resource node is exhausted, contaminated, or otherwise lost.',
    requiresTarget: true,
    targetPrompt: 'Resource name (e.g. "iron vein", "river fish")',
    stateDeltas() {
      // Flat impact - resource loss always hurts resilience and bumps
      // resource pressure regardless of which resource. Specifics
      // come from the cascading rerun.
      return { resilience: -10, resourcePressure: +18 };
    },
    narrate(event) {
      return `${labelOf(event.targetId)} is no longer available.`;
    },
  },

  CUT_TRADE_ROUTE: {
    label: 'Cut trade route',
    description: 'A trade route is closed, blockaded, or rendered unsafe. Imports/exports stall.',
    requiresTarget: false,
    targetPrompt: 'Optional: which route (e.g. "river road", "south bridge")',
    stateDeltas() {
      return { resilience: -12, resourcePressure: +12, externalThreat: +5 };
    },
    narrate(event) {
      const which = event.targetId ? ` (${labelOf(event.targetId)})` : '';
      return `Trade route${which} cut.`;
    },
  },

  DESTROY_SETTLEMENT: {
    label: 'Destroy settlement',
    description: 'The settlement is destroyed, abandoned, or rendered uninhabitable. Kept as campaign history rather than deleted.',
    requiresTarget: false,
    targetPrompt: 'Optional cause (e.g. "dragon fire", "flood", "siege")',
    stateDeltas() {
      return { resilience: -100, volatility: +20, externalThreat: +20, resourcePressure: +15 };
    },
    narrate(event, settlement) {
      const cause = event.targetId ? ` by ${labelOf(event.targetId)}` : '';
      return `${settlement?.name || 'The settlement'} was destroyed${cause}.`;
    },
  },

  // ── NPC events ─────────────────────────────────────────────────────────
  // Three structural NPC events form the core. The plan emphasized that
  // "an add NPC function both before canonization and after" - in draft
  // mode this is an authorial edit (cause: 'authoring'); in canon mode
  // it's an in-world event (cause: 'player_action' or 'world_event').
  // The event spec is identical; the policy difference lives in the store.

  ADD_NPC: {
    label: 'Add NPC',
    description: 'A new NPC arrives, is appointed, inherits office, or is recruited.',
    requiresTarget: true,
    targetPrompt: 'NPC name (or "role @ institution" - e.g. "High Priestess @ Temple")',
    stateDeltas(event) {
      // Adding a key NPC slightly improves resilience; minor NPCs are noise.
      const importance = event.payload?.importance || 'notable';
      const map = { minor: 0, notable: 2, key: 5, pillar: 8 };
      return { resilience: +(map[importance] ?? 2) };
    },
    narrate(event) {
      const role = event.payload?.role ? ` as ${event.payload.role}` : '';
      const inst = event.payload?.institution ? ` at the ${event.payload.institution}` : '';
      return `${labelOf(event.targetId)} arrived${role}${inst}.`;
    },
  },

  KILL_NPC: {
    label: 'Kill / remove NPC',
    description: 'An NPC dies, is exiled, or otherwise leaves play. Linked institutions and factions are affected.',
    requiresTarget: true,
    targetPrompt: 'NPC name to remove',
    stateDeltas(event) {
      // Severity scales by importance. Pillar NPC death shakes the
      // settlement; minor NPCs leave no engine trace.
      const importance = event.payload?.importance || 'notable';
      const map = { minor: { volatility: 0 },
                    notable: { resilience: -3, volatility: +3 },
                    key:     { resilience: -8, volatility: +8 },
                    pillar:  { resilience: -14, volatility: +15 } };
      return map[importance] || map.notable;
    },
    narrate(event) {
      const cause = event.payload?.cause ? ` (${event.payload.cause})` : '';
      return `${labelOf(event.targetId)} is gone${cause}.`;
    },
  },

  ASSIGN_NPC_TO_ROLE: {
    label: 'Assign NPC to role',
    description: 'Place an NPC into an institution role, partially or fully restoring vacated capacity.',
    requiresTarget: true,
    targetPrompt: 'NPC name to assign',
    stateDeltas(event) {
      const quality = event.payload?.quality || 'competent';
      const map = {
        weak:              { resilience: +2 },
        competent:         { resilience: +5 },
        popular:           { resilience: +7, volatility: -3 },
        corrupt:           { resilience: +3, volatility: +5 },
        faction_captured:  { resilience: +4, volatility: +2 },
      };
      return map[quality] || map.competent;
    },
    narrate(event) {
      const role = event.payload?.role || 'a vacant role';
      const inst = event.payload?.institution ? ` at the ${event.payload.institution}` : '';
      return `${labelOf(event.targetId)} took up ${role}${inst}.`;
    },
  },

  // ── Impairment events ──────────────────────────────────────────────────
  // Generic impairment events let the user mark institutions or factions
  // as impaired without a specific cause. Useful when DMs want to record
  // a non-physical setback ("The temple's legitimacy is shaken - too
  // many failed prophecies").

  IMPAIR_INSTITUTION: {
    label: 'Impair institution',
    description: 'Mark an institution as impaired along a chosen dimension (legitimacy, influence, capacity, etc.).',
    requiresTarget: true,
    targetPrompt: 'Institution name',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.5);
      return { resilience: -Math.round(sev * 12), volatility: +Math.round(sev * 6) };
    },
    narrate(event) {
      const dim = event.payload?.dimension || 'capacity';
      return `${labelOf(event.targetId)} suffered a ${dim} setback.`;
    },
  },

  RESTORE_INSTITUTION: {
    label: 'Restore institution',
    description: 'Recovery from a prior impairment. Removes impairments tagged with the chosen cause event.',
    requiresTarget: true,
    targetPrompt: 'Institution name',
    stateDeltas() { return { resilience: +6 }; },
    narrate(event) { return `${labelOf(event.targetId)} recovered.`; },
  },

  IMPAIR_FACTION: {
    label: 'Impair faction',
    description: 'A faction loses leadership, legitimacy, wealth, or another dimension.',
    requiresTarget: true,
    targetPrompt: 'Faction name',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.5);
      return { volatility: +Math.round(sev * 10) };
    },
    narrate(event) {
      const dim = event.payload?.dimension || 'standing';
      return `${labelOf(event.targetId)} lost ${dim}.`;
    },
  },

  RESTORE_FACTION: {
    label: 'Restore faction',
    description: 'A faction recovers from a prior impairment.',
    requiresTarget: true,
    targetPrompt: 'Faction name',
    stateDeltas() { return { volatility: -5 }; },
    narrate(event) { return `${labelOf(event.targetId)} recovered.`; },
  },

  // ── Wave 1: extended event surface ──────────────────────────────────────
  // Five events that cover ~80% of common in-world incidents in canon
  // play. Each is implemented as a thin wrapper over the existing
  // mutation primitives - no new architecture, just authored content.

  KILL_LEADER: {
    label: 'Kill leader',
    description: 'The settlement\'s ruling figure dies, is exiled, or is removed. Major consequences for legitimacy and faction balance.',
    requiresTarget: true,
    targetPrompt: 'Leader\'s name (NPC)',
    stateDeltas() {
      // Always a pillar-tier consequence regardless of authored importance -
      // killing the LEADER is the structural shock by definition.
      return { resilience: -16, volatility: +18, externalThreat: +4 };
    },
    narrate(event) {
      const cause = event.payload?.cause ? ` (${event.payload.cause})` : '';
      return `${labelOf(event.targetId)} - the settlement's leader - is gone${cause}.`;
    },
  },

  EXPOSE_CORRUPTION: {
    label: 'Expose corruption',
    description: 'A faction or institution is publicly revealed as corrupt. Legitimacy collapses; rival factions exploit the vacuum.',
    requiresTarget: true,
    targetPrompt: 'Faction or institution name',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.7);
      return {
        resilience: -Math.round(sev * 8),
        volatility: +Math.round(sev * 14),
      };
    },
    narrate(event) {
      return `Corruption inside ${labelOf(event.targetId)} has been publicly exposed.`;
    },
  },

  REFUGEE_WAVE: {
    label: 'Refugee wave',
    description: 'A surge of refugees arrives. Population spikes; food security and infrastructure strain. Faction politics shift.',
    requiresTarget: false,
    targetPrompt: 'Optional: source region (e.g. "the eastern border")',
    stateDeltas(event) {
      const size = event.payload?.size || 'medium';   // small | medium | large
      const map = {
        small:  { resilience: -5,  resourcePressure: +8,  externalThreat: +3 },
        medium: { resilience: -10, resourcePressure: +14, externalThreat: +6, volatility: +4 },
        large:  { resilience: -16, resourcePressure: +20, externalThreat: +8, volatility: +8 },
      };
      return map[size] || map.medium;
    },
    narrate(event) {
      const size = event.payload?.size || 'medium';
      const from = event.targetId ? ` from ${labelOf(event.targetId)}` : '';
      return `A ${size} refugee wave arrived${from}.`;
    },
  },

  PLAGUE: {
    label: 'Plague',
    description: 'A disease outbreak. Population pressure on healing institutions; quarantine erodes order; faction responses diverge sharply.',
    requiresTarget: false,
    targetPrompt: 'Optional: disease name (e.g. "Red Cough")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.6);
      return {
        resilience: -Math.round(sev * 18),
        volatility: +Math.round(sev * 12),
        resourcePressure: +Math.round(sev * 10),
      };
    },
    narrate(event) {
      const which = event.targetId ? ` "${labelOf(event.targetId)}"` : '';
      return `A plague${which} is spreading.`;
    },
  },

  RAID_OR_MONSTER_ATTACK: {
    label: 'Raid or monster attack',
    description: 'External force strikes - bandits, monsters, an enemy patrol. Defenders mobilize; civilians take losses.',
    requiresTarget: false,
    targetPrompt: 'Optional: source (e.g. "frost trolls", "Iron Crow bandits")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.6);
      return {
        externalThreat: +Math.round(sev * 22),
        resilience: -Math.round(sev * 10),
        volatility: +Math.round(sev * 4),
      };
    },
    narrate(event) {
      const which = event.targetId ? ` by ${labelOf(event.targetId)}` : '';
      return `The settlement was attacked${which}.`;
    },
  },

  // ── Phase 24 / Tier 4.11 - Player intervention events ────────────────────

  REMOVED_THREAT: {
    label: 'Removed threat',
    description: 'Players neutralized an active threat. External pressure eases, defenders recover footing.',
    requiresTarget: false,
    targetPrompt: 'Optional: threat name (e.g. "bandit captain", "blight fey")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.6);
      return {
        externalThreat: -Math.round(sev * 18),
        resilience:     +Math.round(sev * 8),
        volatility:     -Math.round(sev * 4),
      };
    },
    narrate(event) {
      const which = event.targetId ? ` (${labelOf(event.targetId)})` : '';
      return `The threat${which} was neutralized.`;
    },
  },

  BROKERED_ALLIANCE: {
    label: 'Brokered alliance',
    description: 'Two factions formalize cooperation. Volatility settles; trade and mutual defense improve.',
    requiresTarget: false,
    targetPrompt: 'Optional: between-factions hint (e.g. "Merchants + Council")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.6);
      return {
        volatility:       -Math.round(sev * 12),
        resilience:       +Math.round(sev * 8),
        resourcePressure: -Math.round(sev * 4),
      };
    },
    narrate(event) {
      const which = event.targetId ? ` between ${labelOf(event.targetId)}` : '';
      return `An alliance${which} was brokered.`;
    },
  },

  STARTED_RIOT: {
    label: 'Started riot',
    description: 'Players triggered or fanned a public disturbance. Legitimacy slips; criminal opportunity rises.',
    requiresTarget: false,
    targetPrompt: 'Optional: district or trigger (e.g. "Lower Quarter")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.6);
      return {
        volatility: +Math.round(sev * 16),
        resilience: -Math.round(sev * 10),
      };
    },
    narrate(event) {
      const where = event.targetId ? ` in ${labelOf(event.targetId)}` : '';
      return `A riot broke out${where}.`;
    },
  },

  OPENED_TRADE_ROUTE: {
    label: 'Opened trade route',
    description: 'A blocked or new trade route is opened. Imports flow, merchant wealth rises, smuggling premiums collapse.',
    requiresTarget: true,
    targetPrompt: 'Trade route name (e.g. "south road", "river quays")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.7);
      return {
        resilience:       +Math.round(sev * 12),
        resourcePressure: -Math.round(sev * 10),
        volatility:       -Math.round(sev * 4),
      };
    },
    narrate(event) {
      return `Trade along ${labelOf(event.targetId)} has been opened.`;
    },
  },

  RECOVERED_RESOURCE: {
    label: 'Recovered resource',
    description: 'A previously depleted or lost resource is recovered or replenished. Resource pressure eases.',
    requiresTarget: true,
    targetPrompt: 'Resource name (e.g. "iron vein", "river fish")',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.7);
      return {
        resourcePressure: -Math.round(sev * 16),
        resilience:       +Math.round(sev * 8),
      };
    },
    narrate(event) {
      return `The ${labelOf(event.targetId)} has been recovered.`;
    },
  },
};

/** All EventTypes the engine knows about. Useful for UI option lists. */
export const EVENT_TYPES = /** @type {EventType[]} */ (Object.keys(EVENT_REGISTRY));

// ── helpers ────────────────────────────────────────────────────────────────

function invertSigns(deltas) {
  const out = {};
  for (const [k, v] of Object.entries(deltas)) out[k] = -v;
  return out;
}

function scale(deltas, factor) {
  const out = {};
  for (const [k, v] of Object.entries(deltas)) out[k] = Math.round(v * factor);
  return out;
}

function labelOf(targetId) {
  if (!targetId) return 'target';
  // Strip "category." prefix if present (e.g. "institution.granary" → "granary")
  const tail = String(targetId).split('.').pop();
  // Title-case for display
  return tail.replace(/^[a-z]/, c => c.toUpperCase()).replace(/_/g, ' ');
}
