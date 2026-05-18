/**
 * domain/hookEscalation.js — Structured hooks + escalation-clock derivation.
 *
 * Tier 4.10 of the roadmap. Today's hooks live scattered across:
 *
 *   settlement.economicViability.plotHooks      — economic pressures
 *   settlement.history.events[].plotHooks       — historical event hooks
 *   settlement.defenseProfile.plotHooks         — defense / threat hooks
 *   settlement.powerStructure.plotHooks         — faction-level hooks
 *   settlement.plotHooks                        — aggregated top-level hooks
 *
 * The shapes differ (some are strings, some are { category, hook,
 * severity } objects, some carry hidden context). This module presents
 * a single canonical surface:
 *
 *   collectAllHooks(settlement)        — flat list of raw hook entries
 *   deriveStructuredHook(hook, settlement) — enriches one hook with
 *                                       canonical origin / consequences
 *   deriveAllStructuredHooks(settlement)
 *   deriveEscalationClocks(settlement) — multi-stage trajectories
 *                                       grounded in current state
 *
 * Pure functions only. Read-only over current generator output. The
 * "consequences if ignored" and "possible resolutions" are derived
 * from need-category + status combinations, not from generator code —
 * which means clocks remain accurate as the catalog grows because
 * they read state, not prose.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllFactionProfiles } from './factionProfile.js';

// ── Hook collection ─────────────────────────────────────────────────────
// Walks every location the generator might have planted hooks and
// returns a flat array. Tolerant of missing fields / mixed shapes.

/**
 * @returns {Array} Raw hook entries gathered from across the settlement.
 *                  Shapes vary; downstream consumers pass each through
 *                  deriveStructuredHook to normalize.
 */
export function collectAllHooks(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  const out = [];

  // Top-level aggregated list (sometimes populated by post-processing).
  if (Array.isArray(settlement.plotHooks)) {
    for (const h of settlement.plotHooks) out.push({ source: 'aggregate', raw: h });
  }

  // Economic viability hooks.
  const econ = settlement.economicViability;
  if (econ && Array.isArray(econ.plotHooks)) {
    for (const h of econ.plotHooks) out.push({ source: 'economic', raw: h });
  }

  // Economic state — additional plot-hook surfaces (e.g. safety profile).
  const ecoState = settlement.economicState;
  if (ecoState?.safetyProfile && Array.isArray(ecoState.safetyProfile.plotHooks)) {
    for (const h of ecoState.safetyProfile.plotHooks) out.push({ source: 'safety', raw: h });
  }

  // Defense profile hooks.
  const def = settlement.defenseProfile;
  if (def && Array.isArray(def.plotHooks)) {
    for (const h of def.plotHooks) out.push({ source: 'defense', raw: h });
  }

  // Power-structure hooks.
  const power = settlement.powerStructure;
  if (power && Array.isArray(power.plotHooks)) {
    for (const h of power.plotHooks) out.push({ source: 'power', raw: h });
  }

  // History event hooks. The generator uses `historicalEvents`, with
  // an older alias of `events` for forward compatibility.
  const historyEvents = settlement.history?.historicalEvents || settlement.history?.events;
  if (Array.isArray(historyEvents)) {
    for (const e of historyEvents) {
      if (Array.isArray(e?.plotHooks)) {
        for (const h of e.plotHooks) {
          out.push({ source: 'history', raw: h, eventName: e.name || null });
        }
      }
    }
  }

  // NPC-level hooks — the largest source by count, attached per NPC by
  // the population generator. We carry the NPC name through so the
  // structured hook can cite who it concerns.
  if (Array.isArray(settlement.npcs)) {
    for (const npc of settlement.npcs) {
      if (Array.isArray(npc?.plotHooks)) {
        for (const h of npc.plotHooks) {
          out.push({ source: 'npc', raw: h, npcName: npc.name || null });
        }
      }
    }
  }

  return out;
}

// ── Hook text extraction ────────────────────────────────────────────────
// Hooks come in three shapes: bare string, { hook: string, … }, or
// { text: string, … }. Normalize to a single text field.

function hookTextFrom(raw) {
  if (raw == null) return '';
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'object') {
    if (typeof raw.text === 'string') return raw.text.trim();
    if (typeof raw.hook === 'string') return raw.hook.trim();
    if (typeof raw.description === 'string') return raw.description.trim();
  }
  return '';
}

function hookCategoryFrom(raw, fallback) {
  if (raw && typeof raw === 'object' && typeof raw.category === 'string') return raw.category;
  return fallback;
}

function hookSeverityFrom(raw) {
  if (raw && typeof raw === 'object' && typeof raw.severity === 'string') return raw.severity;
  return 'medium';
}

// ── Origin classification ───────────────────────────────────────────────
// Maps each hook to the structural source most likely to have caused
// it. The classifier is intentionally simple: keyword scan over the
// hook text. Today's hooks are written by the generator with predictable
// vocabulary, so this catches the common patterns reliably.
//
// 'pressure'        — generic settlement-wide pressure (food, weather, time)
// 'factionConflict' — friction between named factions
// 'institution'     — concerns a specific institution
// 'npc'             — concerns a specific named NPC
// 'chain'           — concerns a specific supply chain
// 'external'        — concerns an outside force (bandit, neighbour, weather)
// 'other'           — couldn't classify

// Order matters. External threats (bandits raiding caravans, plague
// striking the mill, fire taking the warehouse) read as external
// pressures FIRST — even though the affected vocabulary is "caravan",
// "mill", "warehouse". Without the external rule taking precedence,
// every "bandits target the grain caravan" hook collapses to a chain
// classification, which is structurally wrong: the proximate cause is
// the bandits, not the chain.
const ORIGIN_RULES = [
  { origin: 'external',        test: /bandit|raid|raiders|monster|invasion|plague|storm|drought|flood|fire|earthquake|refugee/i },
  { origin: 'chain',           test: /flour|grain|bread|trade route|caravan|supply|imports|exports|shipment|harbour|dock/i },
  { origin: 'factionConflict', test: /faction|guild|temple|merchant|noble|criminal|priest|mage|watch|militia/i },
  { origin: 'institution',     test: /hospital|prison|courthouse|granary|warehouse|mill|forge|library|barracks/i },
  { origin: 'npc',             test: /(?:the )?(?:reeve|mayor|magistrate|captain|priest(?:ess)?|elder|sheriff|chief|abbot|abbess|warden|guildmaster|patron|lord|lady)/i },
  { origin: 'pressure',        test: /pressure|tension|unrest|riot|strike|protest|crisis|shortage|starv/i },
];

/**
 * Best-effort classifier returning one of the canonical origin labels.
 */
export function deriveHookOrigin(hookText) {
  const text = String(hookText || '');
  if (!text) return 'other';
  for (const rule of ORIGIN_RULES) {
    if (rule.test.test(text)) return rule.origin;
  }
  return 'other';
}

// ── "If ignored" + possible resolutions ────────────────────────────────
// Per-origin consequence templates. Same shape as the supply-chain
// failure-consequence heuristic — short prose anchored to the origin
// category. Consumers (PDF, AI overlay) can render directly.

const ORIGIN_CONSEQUENCES = Object.freeze({
  chain: {
    ifIgnored: [
      'Price hikes spread to dependent crafts and bakeries.',
      'Smuggling fills the gap; criminal faction gains leverage.',
      'Public legitimacy erodes as the council fails to stabilize supply.',
    ],
    possibleResolutions: [
      'Negotiate an emergency supply contract with a neighbouring settlement.',
      'Expose hoarding and force the controller to release reserves.',
      'Subsidize the chain through temple charity or council intervention.',
    ],
  },
  factionConflict: {
    ifIgnored: [
      'One faction makes a unilateral move; the others retaliate.',
      'Public order strains as the conflict spills into the streets.',
      'A weaker third party seizes the opening.',
    ],
    possibleResolutions: [
      'Broker a treaty between the principals.',
      'Expose the underlying corruption and force a public reckoning.',
      'Replace the most extreme leader with a more pliable successor.',
    ],
  },
  institution: {
    ifIgnored: [
      'The institution becomes impaired — services it provides degrade.',
      'Dependent factions / chains lose their anchor.',
      'A rival institution captures the vacated role.',
    ],
    possibleResolutions: [
      'Restore the institution\'s lost capacity (fund repair, replace leadership).',
      'Stand up an alternative institution to fill the role.',
      'Accept the loss and let the dependent systems reorganize.',
    ],
  },
  npc: {
    ifIgnored: [
      'The NPC takes drastic action — defection, betrayal, departure, or death.',
      'Their faction or institution loses leadership and capacity.',
      'A power vacuum opens; opportunistic actors rush in.',
    ],
    possibleResolutions: [
      'Confront the NPC directly and broker a resolution.',
      'Provide what they need (resources, leverage, protection).',
      'Replace them with a more aligned successor.',
    ],
  },
  external: {
    ifIgnored: [
      'The external pressure compounds — more refugees, more raids, deeper plague.',
      'Local resources are consumed defending or absorbing the impact.',
      'Public order strains as the threat lingers.',
    ],
    possibleResolutions: [
      'Confront the external force directly (combat, diplomacy, magic).',
      'Hire intermediaries to absorb the threat.',
      'Adapt — reorganize the settlement around the new reality.',
    ],
  },
  pressure: {
    ifIgnored: [
      'The pressure boils over into a discrete crisis (riot, strike, abandonment).',
      'Stress markers propagate to adjacent subsystems.',
      'Public legitimacy strains; faction realignment becomes likely.',
    ],
    possibleResolutions: [
      'Address the underlying need (food, justice, work).',
      'Provide a public ritual or release valve.',
      'Suppress the symptoms with force (short-term, costly).',
    ],
  },
  other: {
    ifIgnored: [
      'The hook fades — but leaves consequences the DM can pick up later.',
    ],
    possibleResolutions: [
      'Direct intervention by the players.',
    ],
  },
});

// ── Composer ────────────────────────────────────────────────────────────

/**
 * Build a structured hook from any raw shape the generators produce.
 *
 *   {
 *     id, text, origin, severity, category, source,
 *     ifIgnored[], possibleResolutions[],
 *   }
 *
 * Pure; tolerant; returns null for empty hooks.
 */
export function deriveStructuredHook(rawWrapper, settlement) {
  if (!rawWrapper) return null;

  // Accept either a wrapped entry from collectAllHooks ({ source, raw })
  // or a direct hook shape (string / { hook | text | description }).
  const raw    = rawWrapper.raw !== undefined ? rawWrapper.raw : rawWrapper;
  const source = rawWrapper.source || 'unknown';

  const text = hookTextFrom(raw);
  if (!text) return null;

  const origin   = deriveHookOrigin(text);
  const severity = hookSeverityFrom(raw);
  const category = hookCategoryFrom(raw, origin);
  const consequences = ORIGIN_CONSEQUENCES[origin] || ORIGIN_CONSEQUENCES.other;

  // Stable id: hash-ish of category + first 40 chars of text.
  const idTail = text.slice(0, 40).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  const id = `hook.${idTail}`;

  return {
    id,
    text,
    origin,
    severity,
    category,
    source,
    eventName: rawWrapper.eventName || null,
    npcName:   rawWrapper.npcName   || null,
    ifIgnored:           [...consequences.ifIgnored],
    possibleResolutions: [...consequences.possibleResolutions],
    // Settlement reference is informational — not stored on the hook
    // (avoids circular references in serialization). Consumers needing
    // settlement context should query separately.
    _settlementName: settlement?.name || null,
  };
}

/** Convert every hook on the settlement into a structured form. */
export function deriveAllStructuredHooks(settlement) {
  if (!settlement) return [];
  return collectAllHooks(settlement)
    .map(wrapper => deriveStructuredHook(wrapper, settlement))
    .filter(Boolean);
}

// ── Escalation clocks ──────────────────────────────────────────────────
// Multi-stage trajectories derived from current simulation state. The
// roadmap gives the "Bread Riot Clock" as the canonical example:
//
//   1. Flour prices rise.
//   2. Bakers reduce loaves.
//   3. Dockworkers accuse merchants of hoarding.
//   4. Temple opens emergency stores.
//   5. Council sends watch to guard warehouses.
//   6. Riot breaks out in the market.
//
// We don't try to construct clocks from prose; we derive them from the
// structured Tier 4.3 + 4.1 foundations. A disrupted food chain spawns
// a bread-riot clock; a disrupted trade chain spawns a smuggling-rise
// clock; a low-legitimacy governing faction spawns a legitimacy-crisis
// clock. The stages are templated per clock type and the actors are
// substituted from real settlement state (the actual controller, the
// actual governing faction, the actual relief temple).

const CLOCK_TEMPLATES = Object.freeze({
  bread_riot: {
    label: 'Bread Riot Clock',
    triggerDescription: 'Food supply chain is strained or worse.',
    stages: [
      'Flour prices rise.',
      'Bakers reduce loaves.',
      'Workers accuse {controller} of hoarding.',
      'The temple opens emergency stores.',
      'The council sends the watch to guard warehouses.',
      'Riot breaks out in the market.',
    ],
  },
  smuggling_rise: {
    label: 'Smuggling Rise Clock',
    triggerDescription: 'Trade chain is strained or worse.',
    stages: [
      'Legal imports slow.',
      '{controller} loses revenue; tax base shrinks.',
      'Black-market traders fill the gap quietly.',
      'Watch makes a high-profile raid; smugglers shift routes.',
      'A criminal faction consolidates the new routes.',
      'Public legitimacy of the governing faction collapses.',
    ],
  },
  legitimacy_crisis: {
    label: 'Legitimacy Crisis Clock',
    triggerDescription: 'Governing faction has Contested or worse public legitimacy.',
    stages: [
      'Citizens grumble openly in markets.',
      'A rival faction publicly questions {governing}.',
      'Pamphlets / rumors spread accusations.',
      'Tax collection slows; watch loses authority.',
      'A successor positions themselves.',
      'Public assembly forces a confrontation.',
    ],
  },
  faction_split: {
    label: 'Faction Split Clock',
    triggerDescription: 'Two factions with overlapping power and conflicting wants.',
    stages: [
      'A minor incident is exaggerated by both sides.',
      'Public statements harden.',
      'Allies are forced to pick sides.',
      'Quiet inducements / threats circulate.',
      'A symbolic act of defiance occurs.',
      'Open break — the principals stop speaking publicly.',
    ],
  },
});

/**
 * Substitute placeholder tokens in a stage string with real settlement
 * values. Unknown tokens are preserved so the rendered stage still
 * reads cleanly when no actor is available.
 */
function fillStage(stage, vars) {
  return stage.replace(/\{(\w+)\}/g, (match, name) => {
    return vars[name] || match;
  });
}

/**
 * Build escalation clocks grounded in current simulation state.
 * Returns an array of clocks with shape:
 *
 *   {
 *     id, label, triggerDescription, stages[],
 *     triggerSource:   reference to the structured object that triggered it
 *     triggerTargetId: stable id of the trigger (e.g. 'chain.food_security.grain')
 *   }
 *
 * Tolerant: returns an empty array when no triggers are present.
 */
export function deriveEscalationClocks(settlement) {
  if (!settlement) return [];
  const clocks = [];

  // Food chain disruption → bread riot
  const chains = deriveAllSupplyChainStates(settlement);
  for (const chain of chains) {
    if (chain.status === 'stable') continue;
    if (chain.needKey === 'food_security') {
      const tmpl = CLOCK_TEMPLATES.bread_riot;
      clocks.push({
        id: `clock.bread_riot.${chain.id}`,
        label: tmpl.label,
        triggerDescription: tmpl.triggerDescription,
        triggerTargetId: chain.id,
        triggerSource: 'supply_chain',
        triggerStatus: chain.status,
        stages: tmpl.stages.map(s => fillStage(s, { controller: chain.controller })),
      });
    }
    if (chain.needKey === 'trade') {
      const tmpl = CLOCK_TEMPLATES.smuggling_rise;
      clocks.push({
        id: `clock.smuggling_rise.${chain.id}`,
        label: tmpl.label,
        triggerDescription: tmpl.triggerDescription,
        triggerTargetId: chain.id,
        triggerSource: 'supply_chain',
        triggerStatus: chain.status,
        stages: tmpl.stages.map(s => fillStage(s, { controller: chain.controller })),
      });
    }
  }

  // Low legitimacy on the governing faction → legitimacy crisis
  const factions = deriveAllFactionProfiles(settlement);
  const govLabel = settlement.powerStructure?.publicLegitimacy?.label || '';
  const govName  = settlement.powerStructure?.governingName || '';
  if (govLabel && /Contested|Legitimacy Crisis/i.test(govLabel)) {
    const tmpl = CLOCK_TEMPLATES.legitimacy_crisis;
    clocks.push({
      id: `clock.legitimacy_crisis.${govName.replace(/\s+/g, '_').toLowerCase()}`,
      label: tmpl.label,
      triggerDescription: tmpl.triggerDescription,
      triggerTargetId: govName || 'governing',
      triggerSource: 'faction',
      triggerStatus: govLabel,
      stages: tmpl.stages.map(s => fillStage(s, { governing: govName || 'the governing faction' })),
    });
  }

  // Two competing factions with similar power → faction split risk.
  // We pick the two highest-power factions; if their delta is small AND
  // their archetypes differ, that's the seed for a split. Avoids false
  // positives for single-archetype dominance.
  if (factions.length >= 2) {
    const sorted = [...factions].sort((a, b) => (b.power || 0) - (a.power || 0));
    const top = sorted[0], second = sorted[1];
    const powerDelta = (top.power || 0) - (second.power || 0);
    if (powerDelta <= 8 && top.archetype !== second.archetype) {
      const tmpl = CLOCK_TEMPLATES.faction_split;
      clocks.push({
        id: `clock.faction_split.${top.id}__${second.id}`,
        label: tmpl.label,
        triggerDescription: tmpl.triggerDescription,
        triggerTargetId: `${top.id} + ${second.id}`,
        triggerSource: 'faction_pair',
        triggerStatus: `power ${top.power} vs ${second.power}`,
        stages: tmpl.stages,
      });
    }
  }

  return clocks;
}

// ── Diagnostic helpers ──────────────────────────────────────────────────

/** Aggregate count by origin classification. */
export function structuredHookOriginBreakdown(settlement) {
  const out = {
    pressure: 0, factionConflict: 0, institution: 0,
    npc: 0, chain: 0, external: 0, other: 0,
  };
  for (const h of deriveAllStructuredHooks(settlement)) {
    if (out[h.origin] !== undefined) out[h.origin] += 1;
  }
  return out;
}
