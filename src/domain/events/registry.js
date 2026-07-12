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
 * The event shape the registry reads. Identical to {@link Event} except the
 * `payload` bag is indexable (generators stamp arbitrary type-specific keys).
 * @typedef {Omit<Event, 'payload'> & { payload?: Record<string, any> }} RegistryEvent
 */
/**
 * The subset of a settlement the narrate/stateDeltas closures read.
 * @typedef {Object} RegistrySettlement
 * @property {string} [name]
 * @property {Array<Record<string, unknown>>} [stressors]
 * @property {Array<Record<string, unknown>>} [stress]
 * @property {Array<Record<string, unknown>>} [stresses]
 * @property {Array<{ id?: string, name?: string, factionAffiliation?: string }>} [npcs]
 */
/**
 * One event's impact specification.
 * @typedef {Object} EventSpec
 * @property {string} [label]
 * @property {string} [description]
 * @property {boolean} [requiresTarget]
 * @property {string} [targetPrompt]
 * @property {(event: RegistryEvent, settlement?: RegistrySettlement) => Record<string, number>} [stateDeltas]
 * @property {(event: RegistryEvent, settlement?: RegistrySettlement) => string} [narrate]
 */

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
/**
 * @param {unknown} name
 * @returns {keyof typeof INSTITUTION_KIND_DELTAS}
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
  // Assigning a patron deity (or imposing a cult beneath it) re-derives the
  // religion substrate (the deity term in deriveReligiousAuthority) + narrative.
  SET_PRIMARY_DEITY:      ['powerStructure', 'narrative'],
  IMPOSE_CULT:            ['powerStructure', 'narrative'],
  // A forced tier shift rebands population and performs institution roster surgery, so it
  // re-derives the broad structural surface (institutions + demand/food + economy + power).
  SHIFT_TIER:             ['institutions', 'demand', 'foodSecurity', 'economicState', 'powerStructure', 'narrative'],
};

/**
 * The full event registry. Each entry produces:
 *   - stateDeltas(event, settlement) → partial SystemState additive numbers
 *   - narrate(event, settlement)     → one-line DM-facing summary
 */
export const EVENT_REGISTRY = /** @type {Record<string, EventSpec>} */ ({
  ADD_INSTITUTION: {
    label: 'Add institution',
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: false,
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
    requiresTarget: true,
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
    requiresTarget: false,
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
    requiresTarget: true,
    stateDeltas(event) {
      // Adding a key NPC slightly improves resilience; minor NPCs are noise.
      const importance = event.payload?.importance || 'notable';
      const map = { minor: 0, notable: 2, key: 5, pillar: 8 };
      return { resilience: +(map[/** @type {keyof typeof map} */ (importance)] ?? 2) };
    },
    narrate(event) {
      const role = event.payload?.role ? ` as ${event.payload.role}` : '';
      const inst = event.payload?.institution ? ` at the ${event.payload.institution}` : '';
      return `${labelOf(event.targetId)} arrived${role}${inst}.`;
    },
  },

  KILL_NPC: {
    label: 'Kill / remove NPC',
    requiresTarget: true,
    stateDeltas(event) {
      // Severity scales by importance. Pillar NPC death shakes the
      // settlement; minor NPCs leave no engine trace.
      const importance = event.payload?.importance || 'notable';
      const map = { minor: { volatility: 0 },
                    notable: { resilience: -3, volatility: +3 },
                    key:     { resilience: -8, volatility: +8 },
                    pillar:  { resilience: -14, volatility: +15 } };
      return map[/** @type {keyof typeof map} */ (importance)] || map.notable;
    },
    narrate(event) {
      const cause = event.payload?.cause ? ` (${event.payload.cause})` : '';
      return `${labelOf(event.targetId)} is gone${cause}.`;
    },
  },

  ASSIGN_NPC_TO_ROLE: {
    label: 'Assign NPC to role',
    requiresTarget: true,
    stateDeltas(event) {
      const quality = event.payload?.quality || 'competent';
      const map = {
        weak:              { resilience: +2 },
        competent:         { resilience: +5 },
        popular:           { resilience: +7, volatility: -3 },
        corrupt:           { resilience: +3, volatility: +5 },
        faction_captured:  { resilience: +4, volatility: +2 },
      };
      return map[/** @type {keyof typeof map} */ (quality)] || map.competent;
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
    requiresTarget: true,
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
    requiresTarget: true,
    stateDeltas() { return { resilience: +6 }; },
    narrate(event) { return `${labelOf(event.targetId)} recovered.`; },
  },

  IMPAIR_FACTION: {
    label: 'Impair faction',
    requiresTarget: true,
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
    requiresTarget: true,
    stateDeltas() { return { volatility: -5 }; },
    narrate(event) { return `${labelOf(event.targetId)} recovered.`; },
  },

  ADD_FACTION: {
    label: 'Add faction',
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: false,
    stateDeltas(event) {
      const size = event.payload?.size || 'medium';   // small | medium | large
      const map = {
        small:  { resilience: -5,  resourcePressure: +8,  externalThreat: +3 },
        medium: { resilience: -10, resourcePressure: +14, externalThreat: +6, volatility: +4 },
        large:  { resilience: -16, resourcePressure: +20, externalThreat: +8, volatility: +8 },
      };
      return map[/** @type {keyof typeof map} */ (size)] || map.medium;
    },
    narrate(event) {
      const size = event.payload?.size || 'medium';
      const from = event.targetId ? ` from ${labelOf(event.targetId)}` : '';
      return `A ${size} refugee wave arrived${from}.`;
    },
  },

  PLAGUE: {
    label: 'Plague',
    requiresTarget: false,
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
    requiresTarget: false,
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
    requiresTarget: false,
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
    requiresTarget: true,
    stateDeltas() {
      return { volatility: -7, resilience: +6, resourcePressure: -3 };
    },
    narrate(event) {
      return `An alliance was brokered with ${labelOf(event.targetId)}.`;
    },
  },

  STARTED_RIOT: {
    label: 'Started riot',
    requiresTarget: false,
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
    stateDeltas(event) {
      const cause = event.payload?.cause || 'coup';
      const map = {
        coup:        { volatility: +18, resilience: -8 },
        conquest:    { volatility: +20, resilience: -12, externalThreat: +10 },
        election:    { volatility: +6,  resilience: +2 },
        succession:  { volatility: +8,  resilience: -2 },
        appointment: { volatility: +6,  resilience: -2 },
      };
      return map[/** @type {keyof typeof map} */ (cause)] || map.coup;
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
    requiresTarget: true,
    stateDeltas(event, settlement) {
      // The inverse of APPLY_STRESSOR, scaled by the REMOVED entry's recorded
      // severity (the registry computes from the BEFORE settlement, so the
      // entry is still present here). Word-banded legacy severities ('medium')
      // fall through to the 0.5 default.
      const type = String(event.payload?.stressorType || event.targetId || '').toLowerCase();
      const containerKey = ['stressors', 'stress', 'stresses'].find(k => Array.isArray((/** @type {Record<string, unknown>} */ (settlement))?.[k]));
      const entry = containerKey
        ? (/** @type {Record<string, Array<Record<string, unknown>>>} */ (settlement))[containerKey].find(st =>
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
    requiresTarget: true,
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
    requiresTarget: true,
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
    requiresTarget: true,
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

  // ── Religion ──────────────────────────────────────────────────────────────
  // The patron deity + cult events are the AUTHORED-DELTA twins of the
  // embed-on-assign bridge (mutate.js setPrimaryDeity / imposeCult write
  // config.primaryDeitySnapshot / config.cultDeitySnapshots; the pulse's
  // subsystemActivation gate flips the religion layer on the instant either
  // embed appears). The deltas here are the small legitimacy/unrest nudge so
  // the change moves a visible dial; the substrate weight lives in
  // deriveReligiousAuthority, read off the embedded snapshot, not here.

  SET_PRIMARY_DEITY: {
    label: 'Assign patron deity',
    requiresTarget: false,
    stateDeltas(event) {
      // A change of patron god is a legitimacy/ritual event, not an economic
      // shock — a small steadying nudge so that, like every other make-change,
      // it visibly moves a dial. Adopting a patron deity steadies legitimacy and
      // dampens unrest; shedding one (null payload) is the small inverse, the
      // patron-less drift.
      const hasDeity = !!(event.payload?.snapshot || event.payload?.deityRef || event.targetId);
      return hasDeity
        ? { resilience: +3, volatility: -2 }
        : { resilience: -3, volatility: +2 };
    },
    narrate(event) {
      const snap = event.payload?.snapshot;
      if (!snap || !(event.payload?.deityRef ?? event.targetId)) {
        return 'The settlement turns away from its patron god. No deity now holds primacy.';
      }
      const name = snap.name || 'a new god';
      return `${name} is proclaimed the settlement's patron deity.`;
    },
  },

  IMPOSE_CULT: {
    label: 'Impose a cult',
    requiresTarget: false,
    stateDeltas(event) {
      // A new cult stirs the populace — a small unrest ripple, the rough inverse
      // of adopting a steadying patron. Removing a cult settles it back.
      const hasCult = !!(event.payload?.snapshot && (event.payload?.deityRef ?? event.targetId));
      return hasCult
        ? { volatility: +2, resilience: -1 }
        : { volatility: -1, resilience: +1 };
    },
    narrate(event) {
      const snap = event.payload?.snapshot;
      if (!snap || !(event.payload?.deityRef ?? event.targetId)) {
        return 'A cult fades from the settlement, its shrine left to the dust.';
      }
      const name = snap.name || 'a foreign god';
      return `A cult of ${name} takes root in the settlement, beneath the patron's gaze.`;
    },
  },

  SHIFT_TIER: {
    label: 'Promote or demote tier',
    requiresTarget: false,
    stateDeltas(event) {
      // Growth steadies a settlement; forced decline unsettles it. A rough mirror.
      return event.payload?.direction === 'demotion'
        ? { volatility: +2, resilience: -2 }
        : { volatility: -1, resilience: +1 };
    },
    narrate(event) {
      return event.payload?.direction === 'demotion'
        ? 'The settlement contracts, slipping to a smaller tier as its grander institutions fall to ruin.'
        : 'The settlement swells to a larger tier, its institutions rising to match the new scale.';
    },
  },

  REMOVE_RESOURCE: {
    label: 'Remove resource',
    requiresTarget: true,
    stateDeltas() {
      // Same flat shock as DEPLETE_RESOURCE — the chains read the same loss.
      return { resilience: -10, resourcePressure: +18 };
    },
    narrate(event) {
      return `${labelOf(event.targetId)} is gone — no longer worked, no longer counted on.`;
    },
  },

  PROMOTE_NPC: {
    label: 'Promote/Demote NPC',
    requiresTarget: true,
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
    requiresTarget: true,
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
});

/** All EventTypes the engine knows about. Useful for UI option lists. */
export const EVENT_TYPES = /** @type {EventType[]} */ (Object.keys(EVENT_REGISTRY));

// ── helpers ────────────────────────────────────────────────────────────────

/** @param {Record<string, number>} deltas @returns {Record<string, number>} */
function invertSigns(deltas) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const [k, v] of Object.entries(deltas)) out[k] = -v;
  return out;
}

/** @param {Record<string, number>} deltas @param {number} factor @returns {Record<string, number>} */
function scale(deltas, factor) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const [k, v] of Object.entries(deltas)) out[k] = Math.round(v * factor);
  return out;
}

/** @param {unknown} targetId @returns {string} */
function labelOf(targetId) {
  if (!targetId) return 'target';
  // Strip "category." prefix if present (e.g. "institution.granary" → "granary")
  const tail = String(targetId).split('.').pop();
  // Title-case for display
  return /** @type {string} */ (tail).replace(/^[a-z]/, c => c.toUpperCase()).replace(/_/g, ' ');
}
