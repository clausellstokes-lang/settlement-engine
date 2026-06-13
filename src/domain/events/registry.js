/**
 * domain/events/registry.js — Canon event impact specifications.
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
 * can refine the state effects — but in v1 we keep it simple and use
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
export function classifyInstitution(name) {
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
 * They're chosen so a typical event produces a 7–20 point swing —
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
 * The subsystem keys an event of a given type touches. `batch.js` reads this to
 * tell the DM which subsystems a batch of events affects (the batch-preview
 * "affected subsystems" list). Descriptive metadata only — there is no
 * step-level partial-rerun engine (it was retired); edits do a full same-seed
 * regen and derived state is recomputed on demand. Keep the lists tight so the
 * preview reads honestly.
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
  ADD_FACTION:            ['powerStructure', 'narrative'],
  // Wave 1 extended events.
  KILL_LEADER:            ['npcs', 'powerStructure', 'institutions', 'narrative'],
  EXPOSE_CORRUPTION:      ['powerStructure', 'institutions', 'economicState', 'narrative'],
  IMPOSE_CORRUPTION:      ['npcs', 'powerStructure', 'narrative'],
  REFUGEE_WAVE:           ['demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  PLAGUE:                 ['demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
  RAID_OR_MONSTER_ATTACK: ['institutions', 'economicState', 'narrative'],
  // Phase 24 / Tier 4.11 — player intervention events
  REMOVED_THREAT:         ['economicState', 'powerStructure', 'narrative'],
  BROKERED_ALLIANCE:      ['powerStructure', 'narrative'],
  SETTLEMENT_DISPUTE:     ['powerStructure', 'narrative'],
  STARTED_RIOT:           ['powerStructure', 'economicState', 'narrative'],
  OPENED_TRADE_ROUTE:     ['activeChains', 'foodSecurity', 'economicState', 'narrative'],
  RECOVERED_RESOURCE:     ['resources', 'activeChains', 'economicState', 'narrative'],
  DESTROY_SETTLEMENT:     ['economicState', 'powerStructure', 'narrative'],
  // Coup d'état wave — authored crises + transfers of the governing seat.
  APPLY_STRESSOR:         ['powerStructure', 'economicState', 'narrative'],
  CHANGE_RULING_POWER:    ['powerStructure', 'npcs', 'narrative'],
  // Editor roster wave — the Roster's add/remove vocabulary as first-class canon events.
  RESOLVE_STRESSOR:       ['powerStructure', 'economicState', 'narrative'],
  ADD_TRADE_GOOD:         ['economicState', 'narrative'],
  REMOVE_TRADE_GOOD:      ['economicState', 'narrative'],
  ADD_RESOURCE:           ['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  REMOVE_RESOURCE:        ['resources', 'activeChains', 'foodSecurity', 'economicState', 'narrative'],
  PROMOTE_NPC:            ['npcs', 'powerStructure', 'narrative'],
  DEMOTE_NPC:             ['npcs', 'powerStructure', 'narrative'],
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
      // Full removal is slightly more severe than damage — multiply by
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
      // Damage scaled by severity (default 0.7) — burning the granary at
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
      // Flat impact — resource loss always hurts resilience and bumps
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

  // §9b — Settlement Dispute: sours relations with a neighbouring settlement.
  // Replaces the freetext Cut Trade Route in the DM composer; the relationship
  // it sets (neutral/rival/cold_war/hostile) drives the severity + the mutation.
  SETTLEMENT_DISPUTE: {
    label: 'Settlement dispute',
    description: 'A dispute sours relations with a neighbouring settlement, downgrading the relationship.',
    requiresTarget: true,
    targetPrompt: 'Neighbouring settlement',
    stateDeltas(event) {
      const rel = event.payload?.relationshipType || 'rival';
      const sev = rel === 'hostile' ? 1 : rel === 'cold_war' ? 0.7 : rel === 'rival' ? 0.45 : 0.2;
      return {
        volatility:     +Math.round(sev * 14),
        externalThreat: +Math.round(sev * 12),
        resilience:     -Math.round(sev * 8),
      };
    },
    narrate(event) {
      const rel = String(event.payload?.relationshipType || 'rival').replace(/_/g, ' ');
      return `Relations with ${labelOf(event.targetId)} soured to ${rel}.`;
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
  // "an add NPC function both before canonization and after" — in draft
  // mode this is an authorial edit (cause: 'authoring'); in canon mode
  // it's an in-world event (cause: 'player_action' or 'world_event').
  // The event spec is identical; the policy difference lives in the store.

  ADD_NPC: {
    label: 'Add NPC',
    description: 'A new NPC arrives, is appointed, inherits office, or is recruited.',
    requiresTarget: true,
    targetPrompt: 'NPC name (or "role @ institution" — e.g. "High Priestess @ Temple")',
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
  // a non-physical setback ("The temple's legitimacy is shaken — too
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

  ADD_FACTION: {
    label: 'Add faction',
    description: 'A new faction forms or arrives: a guild, cult, syndicate, or noble bloc. A fresh contender for power and influence.',
    requiresTarget: true,
    targetPrompt: 'Faction name (e.g. "Dockworkers Guild", "Ashen Hand")',
    stateDeltas() {
      // A new organized power center adds friction until the balance settles.
      return { volatility: 5 };
    },
    narrate(event) {
      return `A new faction, ${labelOf(event.targetId)}, has formed.`;
    },
  },

  // ── Wave 1: extended event surface ──────────────────────────────────────
  // Five events that cover ~80% of common in-world incidents in canon
  // play. Each is implemented as a thin wrapper over the existing
  // mutation primitives — no new architecture, just authored content.

  KILL_LEADER: {
    label: 'Kill leader',
    description: 'The settlement\'s ruling figure dies, is exiled, or is removed. Major consequences for legitimacy and faction balance.',
    requiresTarget: true,
    targetPrompt: 'Leader\'s name (NPC)',
    stateDeltas() {
      // Always a pillar-tier consequence regardless of authored importance —
      // killing the LEADER is the structural shock by definition.
      return { resilience: -16, volatility: +18, externalThreat: +4 };
    },
    narrate(event) {
      const cause = event.payload?.cause ? ` (${event.payload.cause})` : '';
      return `${labelOf(event.targetId)} — the settlement's leader — is gone${cause}.`;
    },
  },

  EXPOSE_CORRUPTION: {
    label: 'Expose corruption',
    description: 'A corrupt NPC is publicly revealed (or a faction/institution). The NPC is cleaned + scarred, and both the criminal institution they answered to and their home institution are tarnished; legitimacy collapses and rivals exploit the vacuum.',
    requiresTarget: true,
    targetPrompt: 'Corrupt NPC, faction, or institution name',
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

  IMPOSE_CORRUPTION: {
    label: 'Impose corruption',
    description: 'A criminal organization in the settlement gets its hooks into a clean NPC. The NPC becomes COVERTLY corrupt and tied to that organization — so the dossier flags them, faction capture advances from the new corrupt seat, and a future Expose Corruption brings the reckoning. Quieter than exposure: the rot is hidden, not yet public.',
    requiresTarget: true,
    targetPrompt: 'Clean NPC to turn (pick the organization below)',
    stateDeltas(event) {
      // Covert — a quieter destabiliser than the public collapse of EXPOSE_CORRUPTION.
      const sev = Number(event.payload?.severity ?? 0.5);
      return {
        resilience: -Math.round(sev * 5),
        volatility: +Math.round(sev * 8),
      };
    },
    narrate(event) {
      const org = event.payload?.criminalInstitution;
      return `${labelOf(event.targetId)} has been turned${org ? ` by the ${org}` : ''} — corruption takes root in the shadows.`;
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
    description: 'External force strikes — bandits, monsters, an enemy patrol. Defenders mobilize; civilians take losses.',
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

  // ── Phase 24 / Tier 4.11 — Player intervention events ────────────────────

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

  // §9g — Brokered Alliance: sets the relationship with a neighbouring
  // settlement to Allied. Volatility settles; mutual defense + trade improve.
  BROKERED_ALLIANCE: {
    label: 'Brokered alliance',
    description: 'Formalize an alliance with a neighbouring settlement. Relations become Allied; volatility settles and mutual defense improves.',
    requiresTarget: true,
    targetPrompt: 'Neighbouring settlement',
    stateDeltas() {
      return { volatility: -7, resilience: +6, resourcePressure: -3 };
    },
    narrate(event) {
      return `An alliance was brokered with ${labelOf(event.targetId)}.`;
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

  // §9h — Opened Trade Route: establishes a trade relationship with a
  // neighbouring settlement (allied / client / patron / trade_partners).
  OPENED_TRADE_ROUTE: {
    label: 'Opened trade route',
    description: 'Open a trade relationship with a neighbouring settlement. Imports flow, merchant wealth rises, smuggling premiums collapse.',
    requiresTarget: true,
    targetPrompt: 'Neighbouring settlement',
    stateDeltas() {
      return { resilience: +9, resourcePressure: -7, volatility: -3 };
    },
    narrate(event) {
      const rel = String(event.payload?.relationshipType || 'trade_partners').replace(/_/g, ' ');
      return `A ${rel} trade route with ${labelOf(event.targetId)} has opened.`;
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

  // ── Coup d'état wave ─────────────────────────────────────────────────────

  APPLY_STRESSOR: {
    label: 'Apply stressor',
    description: 'An active crisis grips the settlement — pick any stressor from the full catalog, including your custom ones. Logged as an in-world onset; the matching condition feeds the causal substrate, and in a canon campaign it also becomes a roaming world-pulse stressor.',
    requiresTarget: true,
    targetPrompt: 'Stressor (from the catalog)',
    stateDeltas(event) {
      const sev = Number(event.payload?.severity ?? 0.6);
      const type = String(event.payload?.stressorType || event.targetId || '').toLowerCase();
      const external = /siege|occup|wartime|war\b|monster|raider/.test(type);
      const scarcity = /famine|market|indebt|debt|migration/.test(type);
      return {
        resilience:       -Math.round(sev * 12),
        volatility:       +Math.round(sev * 12),
        ...(external ? { externalThreat:   +Math.round(sev * 16) } : {}),
        ...(scarcity ? { resourcePressure: +Math.round(sev * 12) } : {}),
      };
    },
    narrate(event) {
      const label = event.payload?.label || labelOf(event.targetId);
      return `${label} grips the settlement.`;
    },
  },

  CHANGE_RULING_POWER: {
    label: 'Change ruling power',
    description: "Hand the government to a different authoritative power — coup, election, succession, conquest, or appointment. The governing body persists; who commands it changes, and the government type reshapes to the new power's preference.",
    requiresTarget: true,
    targetPrompt: 'Faction that takes power',
    stateDeltas(event) {
      const cause = event.payload?.cause || 'coup';
      const map = {
        coup:        { volatility: +18, resilience: -8 },
        conquest:    { volatility: +20, resilience: -12, externalThreat: +10 },
        election:    { volatility: +6,  resilience: +2 },
        succession:  { volatility: +8,  resilience: -2 },
        appointment: { volatility: +6,  resilience: -2 },
      };
      return map[cause] || map.coup;
    },
    narrate(event, settlement) {
      const cause = event.payload?.cause || 'coup';
      const where = settlement?.name ? ` in ${settlement.name}` : '';
      return `${labelOf(event.targetId)} took power${where} by ${cause}.`;
    },
  },

  // ── Editor roster wave ───────────────────────────────────────────────────
  // The Roster's add/remove vocabulary promoted to first-class canon events:
  // crisis wind-down, trade-good roster, resource roster, and a same-faction
  // NPC standing swap. Each is the timeline-writing twin of a correction the
  // Roster already performs silently.

  RESOLVE_STRESSOR: {
    label: 'Remove stressor',
    description: 'An active crisis ends — pick one of the settlement\'s current stressors. The stress entry is removed, its promoted condition winds down, and in a canon campaign the roaming world-pulse twin resolves with its residual aftermath.',
    requiresTarget: true,
    targetPrompt: 'Stressor currently gripping the settlement',
    stateDeltas(event, settlement) {
      // The inverse of APPLY_STRESSOR, scaled by the REMOVED entry's recorded
      // severity (the registry computes from the BEFORE settlement, so the
      // entry is still present here). Word-banded legacy severities ('medium')
      // fall through to the 0.5 default.
      const type = String(event.payload?.stressorType || event.targetId || '').toLowerCase();
      const containerKey = ['stressors', 'stress', 'stresses'].find(k => Array.isArray(settlement?.[k]));
      const entry = containerKey
        ? settlement[containerKey].find(st =>
            String(st?.type || '').toLowerCase() === type
            || String(st?.name || '').toLowerCase() === type)
        : null;
      const rawSev = Number(entry?.severity ?? event.payload?.severity);
      const sev = Number.isFinite(rawSev) ? Math.max(0, Math.min(1, rawSev)) : 0.5;
      const external = /siege|occup|wartime|war\b|monster|raider/.test(type);
      const scarcity = /famine|market|indebt|debt|migration/.test(type);
      return {
        resilience:       +Math.round(sev * 12),
        volatility:       -Math.round(sev * 12),
        ...(external ? { externalThreat:   -Math.round(sev * 16) } : {}),
        ...(scarcity ? { resourcePressure: -Math.round(sev * 12) } : {}),
      };
    },
    narrate(event) {
      const label = event.payload?.label || labelOf(event.targetId);
      return `${label} no longer grips the settlement.`;
    },
  },

  ADD_TRADE_GOOD: {
    label: 'Add trade good',
    description: 'A new good enters the settlement\'s trade profile — exported, imported, or (for an entrepôt) re-exported in transit through its warehouses.',
    requiresTarget: true,
    targetPrompt: 'Good label (e.g. "Salted fish", "Rare spices")',
    stateDeltas(event) {
      // A new import eases material pressure; a new export firms up the
      // economic base. Small numbers — one good is a dial, not a shock.
      return event.payload?.direction === 'import'
        ? { resourcePressure: -5, resilience: +2 }
        : { resilience: +4 };
    },
    narrate(event) {
      const label = event.payload?.label || labelOf(event.targetId);
      if (event.payload?.entrepot) return `${label} now moves through the settlement's warehouses in transit.`;
      return event.payload?.direction === 'import'
        ? `The settlement now imports ${label}.`
        : `The settlement now exports ${label}.`;
    },
  },

  REMOVE_TRADE_GOOD: {
    label: 'Remove trade good',
    description: 'A good drops out of the settlement\'s trade profile — the market moved on, the supplier dried up, or the route no longer carries it.',
    requiresTarget: true,
    targetPrompt: 'Trade good to remove',
    stateDeltas() {
      // The inverse dial of ADD_TRADE_GOOD's export case; direction isn't
      // known at removal (the label is stripped from every list it sits in).
      return { resilience: -4, resourcePressure: +3 };
    },
    narrate(event) {
      return `${labelOf(event.targetId)} no longer moves through the settlement's markets.`;
    },
  },

  ADD_RESOURCE: {
    label: 'Add resource',
    description: 'A new resource node is discovered or opened nearby — a vein struck, fields cleared, grounds claimed. Supply chains can activate on the next rederivation.',
    requiresTarget: true,
    targetPrompt: 'Resource (from the catalog, or a custom name)',
    stateDeltas() {
      // The counterpart of DEPLETE_RESOURCE's flat hit, slightly damped —
      // discovering a node helps less suddenly than losing one hurts.
      return { resilience: +8, resourcePressure: -10 };
    },
    narrate(event) {
      const label = event.payload?.label || labelOf(event.targetId);
      return `${label} is now worked near the settlement.`;
    },
  },

  REMOVE_RESOURCE: {
    label: 'Remove resource',
    description: 'A resource node is lost outright — claimed by another power, rendered unreachable, or struck from the map. Harsher than depletion: nothing is left to recover.',
    requiresTarget: true,
    targetPrompt: 'Nearby resource to remove',
    stateDeltas() {
      // Same flat shock as DEPLETE_RESOURCE — the chains read the same loss.
      return { resilience: -10, resourcePressure: +18 };
    },
    narrate(event) {
      return `${labelOf(event.targetId)} is gone — no longer worked, no longer counted on.`;
    },
  },

  PROMOTE_NPC: {
    label: 'Promote NPC',
    description: 'An NPC rises within their faction, swapping standing (importance, influence, structural rank) with a chosen peer of the same faction. The peer is displaced downward.',
    requiresTarget: true,
    targetPrompt: 'NPC who rises',
    stateDeltas() {
      // A reshuffle inside one faction: friction, not crisis.
      return { volatility: +3 };
    },
    narrate(event, settlement) {
      const npc = (settlement?.npcs || []).find(n =>
        String(n.id || '') === String(event.targetId) || String(n.name || '') === String(event.targetId));
      const name = npc?.name || labelOf(event.targetId);
      const faction = npc?.factionAffiliation || 'their faction';
      return `${name} rises within ${faction}, displacing a rival on the way up.`;
    },
  },

  DEMOTE_NPC: {
    label: 'Demote NPC',
    description: 'An NPC is pushed down the ranks of their faction, swapping standing (importance, influence, structural rank) with a chosen peer of the same faction who steps over them.',
    requiresTarget: true,
    targetPrompt: 'NPC who falls',
    stateDeltas() {
      return { volatility: +3 };
    },
    narrate(event, settlement) {
      const npc = (settlement?.npcs || []).find(n =>
        String(n.id || '') === String(event.targetId) || String(n.name || '') === String(event.targetId));
      const name = npc?.name || labelOf(event.targetId);
      const faction = npc?.factionAffiliation || 'their faction';
      return `${name} is pushed down the ranks of ${faction}.`;
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
