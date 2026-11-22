/**
 * domain/hookEscalation.js — Structured hooks + escalation-clock derivation.
 *
 * Tier 4.10 of the roadmap. Today's hooks live scattered across:
 *
 *   settlement.economicViability.plotHooks      — economic pressures
 *   settlement.history.events[].plotHooks       — historical event hooks
 *   settlement.defenseProfile.plotHooks         — defense / threat hooks
 *   settlement.powerStructure.plotHooks         — faction-level hooks
 *   settlement.npcs[].plotHooks                 — per-figure hooks
 *
 * ⚠ `settlement.plotHooks` IS NOT ONE OF THEM. This list used to name an
 * "aggregated top-level" address; nothing has ever written it. See the deleted
 * arm in collectAllHooks below.
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
import { retainHooks, retentionKey, editedHookTextKeys } from './dossier/hookRetention.js';
import { themeOfText } from './hookThemes.js';
import { resolveDeclared } from './facts/drawDeclared.js';
import { factsOf } from './facts/factsOf.js';

// ── Hook collection ─────────────────────────────────────────────────────
// Walks every location the generator might have planted hooks and
// returns a flat array. Tolerant of missing fields / mixed shapes.

/**
 * @param {Record<string, any>} settlement
 * @returns {Array<Record<string, any>>} Raw hook entries gathered from across the settlement.
 *                  Shapes vary; downstream consumers pass each through
 *                  deriveStructuredHook to normalize.
 */
export function collectAllHooks(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  const out = [];

  // ⚠ THE 'aggregate' ARM WAS DELETED, NOT DISABLED (2026-08-11). It read
  // `settlement.plotHooks` — "sometimes populated by post-processing", which was
  // never true: no writer in this repo produces `plotHooks` on a settlement ROOT,
  // and the header's claim that hooks live at `settlement.plotHooks` was aspiration
  // rather than observation. Every live address is walked below, so deleting the
  // arm removes a dead read and loses no hook. Do not re-add it — a genuinely new
  // aggregate address belongs in this walk under its own source label.

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

/** @param {*} raw @returns {string} */
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

/** @param {*} raw @param {string} fallback @returns {string} */
function hookCategoryFrom(raw, fallback) {
  if (raw && typeof raw === 'object' && typeof raw.category === 'string') return raw.category;
  return fallback;
}

/** @param {*} raw @returns {string} */
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
 * @param {*} hookText
 * @returns {string}
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

/** @type {Record<string, { ifIgnored: string[], possibleResolutions: string[] }>} */
const ORIGIN_CONSEQUENCES = Object.freeze({
  chain: {
    ifIgnored: [
      'Price hikes spread to dependent crafts and bakeries.',
      'Smugglers fill the gap, and the local criminals grow stronger on it.',
      'People lose faith in the council as it fails to keep goods coming in.',
    ],
    possibleResolutions: [
      'Negotiate an emergency supply contract with a neighbouring settlement.',
      'Expose the hoarding and force whoever holds the stores to release them.',
      'Pay to keep the trade going, through temple charity or the council\'s purse.',
    ],
  },
  factionConflict: {
    ifIgnored: [
      'One power acts alone; the others strike back.',
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
      'The institution stops working properly, and the people who rely on it go without.',
      'The powers and trades that depend on it are left without support.',
      'A rival institution captures the vacated role.',
    ],
    possibleResolutions: [
      'Restore the institution\'s lost capacity (fund repair, replace leadership).',
      'Stand up an alternative institution to fill the role.',
      'Accept the loss and let those who depended on it find other ways.',
    ],
  },
  npc: {
    ifIgnored: [
      'The NPC takes drastic action: defection, betrayal, departure, or death.',
      'Their power or institution loses its leader and much of its strength.',
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
      'The external pressure compounds: more refugees, more raids, deeper plague.',
      'Local resources are consumed defending or absorbing the impact.',
      'Public order strains as the threat lingers.',
    ],
    possibleResolutions: [
      'Confront the external force directly (combat, diplomacy, magic).',
      'Hire intermediaries to absorb the threat.',
      'Adapt: reorganize the settlement around the new reality.',
    ],
  },
  pressure: {
    ifIgnored: [
      'The pressure boils over into open trouble: a riot, a strike, or people leaving.',
      'The trouble spreads to the trades and offices around it.',
      'People lose faith in their rulers, and the powers start changing sides.',
    ],
    possibleResolutions: [
      'Address the underlying need (food, justice, work).',
      'Provide a public ritual or release valve.',
      'Suppress the symptoms with force (short-term, costly).',
    ],
  },
  other: {
    ifIgnored: [
      'The hook fades, but leaves consequences the DM can pick up later.',
    ],
    possibleResolutions: [
      'Direct intervention by the players.',
    ],
  },
});

/**
 * THE DECLARED LINES OF THE CONSEQUENCE LISTS AND THE CLOCKS (CENSUS-2c unit 3;
 * `docs/DESIGN_POOL_CENSUS.md` §3.1 / §3.3 kind A; the ledger
 * `docs/census/declarations/HOOK_ESCALATION.json`). The lists print whole, so there is no draw to
 * protect. A line that presumes a fact is a declared sibling set keyed by its own text (the
 * originals stay strings where their string consumers read them, CENSUS-1c's shape): the original
 * with its atoms, then its twin (`twinOf`), which takes the refused original's place IN PLACE, so
 * a clock keeps its six stages. A refused line with no twin leaves the list. Each twin is the
 * chair's ruling (R-G), recorded with its share in `docs/CENSUS_2_LANE_2026-11-04.md` "CENSUS-2c".
 * `Pay to keep the trade going, through temple charity or the council's purse.` presumes a temple OR a
 * council — a disjunction across dimensions, which no line may declare (§3.2) — so it stays
 * undeclared and its drafted twin is not written.
 * @type {Readonly<Record<string, ReadonlyArray<Readonly<{ text: string, needs?: string[], excludes?: string[], twinOf?: string }>>>>}
 */
export const HOOK_ESCALATION_SIBLINGS = Object.freeze(Object.fromEntries([
  ['People lose faith in the council as it fails to keep goods coming in.', ['ruler: council'], 'People lose faith in those who rule as they fail to keep goods coming in.', ['ruler: council']],
  ['Expose the hoarding and force whoever holds the stores to release them.', ['stores: > 0'], null, null],
  ['Confront the external force directly (combat, diplomacy, magic).', ['magic'], 'Confront the external force directly, by arms or by talks.', ['magic']],
  ['The temple opens emergency stores.', ['institution: temple', 'stores: > 0'], 'Households begin pooling what food they have.', null],
  ['The council sends the watch to guard warehouses.', ['ruler: council', 'watch'], 'Those who hold the stores start sleeping beside them.', null],
  ['Riot breaks out in the market.', ['market'], 'A crowd gathers where the food is handed out, and it turns ugly.', ['market']],
  ['Watch makes a high-profile raid; smugglers shift routes.', ['watch'], '{controller} makes an example of one smuggler; the rest shift routes.', ['watch']],
  ['Citizens grumble openly in markets.', ['market'], 'People grumble openly wherever they gather.', ['market']],
  ['Tax collection slows; watch loses authority.', ['watch'], 'Tax collection slows; orders go unheeded.', ['watch']],
].map(([text, needs, twin, twinExcludes]) => [text, Object.freeze([
  Object.freeze({ text, needs }),
  ...(twin ? [Object.freeze({ text: twin, twinOf: text, ...(twinExcludes ? { excludes: twinExcludes } : {}) })] : []),
])])));

/**
 * A printed list as the record admits it: each line that is a key of HOOK_ESCALATION_SIBLINGS
 * resolves (the original, else its twin, else it leaves the list); every other line is kept. No
 * facts (a caller with no settlement in hand): every line is kept, byte-identical.
 * @param {ReadonlyArray<string>} lines
 * @param {object|null} facts `factsOf(settlement)`
 * @param {string} [poolId]
 * @returns {string[]}
 */
export function spokenEscalationLines(lines, facts, poolId = 'hookEscalation:HOOK_ESCALATION_SIBLINGS') {
  if (!facts) return [...lines];
  /** @type {string[]} */ const out = [];
  for (const line of lines) {
    const set = Object.prototype.hasOwnProperty.call(HOOK_ESCALATION_SIBLINGS, line) ? HOOK_ESCALATION_SIBLINGS[line] : [line];
    const r = resolveDeclared(set, { facts, poolId, surface: 'plot_hooks', drawKind: 'A' });
    if (typeof r.text === 'string') out.push(r.text);
  }
  return out;
}

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
 *
 * @param {*} rawWrapper
 * @param {Record<string, any>} [settlement]
 * @returns {Record<string, any>|null}
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
  const facts = settlement ? factsOf(settlement) : null; // CENSUS-2c: the declared lines resolve against the record

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
    ifIgnored:           spokenEscalationLines(consequences.ifIgnored, facts),
    possibleResolutions: spokenEscalationLines(consequences.possibleResolutions, facts),
    // Settlement reference is informational — not stored on the hook
    // (avoids circular references in serialization). Consumers needing
    // settlement context should query separately.
    _settlementName: settlement?.name || null,
  };
}

/** Convert every hook on the settlement into a structured form.
 *
 * J-HK-5 — THE TWO COLLECTORS CONVERGE. This surface adopts the SAME retention
 * helper the display aggregator uses (src/domain/dossier/hookRetention.js), so
 * the estate has one visible story set rather than a deduped dossier beside a
 * raw structured list. The layer is dark by default here for the same reason it
 * is dark there: `retention: true` is opt-in, so today's output is byte-
 * identical and every existing caller is unmoved.
 *
 * The DM's-pen protection is LIVE on this surface in a way it is not on the
 * display one — `collectAllHooks` walks `settlement.plotHooks`, which is exactly
 * where userEdits seats its editable 'hook'/'plotHook' entities, so an edited
 * hook here is a real key in a real set rather than a vacuous guard.
 *
 * @param {Record<string, any>} settlement
 * @param {{ retention?: boolean }} [options] `retention: true` engages HK-2
 * @returns {Array<Record<string, any>>}
 */
export function deriveAllStructuredHooks(settlement, options = {}) {
  if (!settlement) return [];
  const structured = /** @type {Array<Record<string, any>>} */ (collectAllHooks(settlement)
    .map(wrapper => deriveStructuredHook(wrapper, settlement))
    .filter(Boolean));
  if (!options.retention) return structured;
  return retainHooks(structured, {
    // The structured surface carries no relationship rows (collectAllHooks does
    // not walk `relationships`), so the exact-text classifier is the whole story
    // here — no archetype arm is needed or possible.
    themeOf: (hook) => themeOfText(hook.text),
    editedTextKeys: editedHookTextKeys(settlement),
    scaleBand: settlement.tier,
  });
}

/** Retention-key helper kept beside the adopter so a caller wanting to build its
 *  own protected-key set uses the same fold both collectors use.
 *  @param {unknown} text @returns {string} */
export const structuredHookKey = (text) => retentionKey(text);

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
    triggerDescription: 'The food supply is under strain, or failing.',
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
    triggerDescription: 'Trade is under strain, or failing.',
    stages: [
      'Legal imports slow.',
      '{controller} takes in less, and so does the tax collector.',
      'Black-market traders fill the gap quietly.',
      'Watch makes a high-profile raid; smugglers shift routes.',
      'A criminal power takes over the new routes.',
      'People stop accepting the ruling power\'s right to govern.',
    ],
  },
  legitimacy_crisis: {
    label: 'Legitimacy Crisis Clock',
    triggerDescription: 'The ruling power\'s standing with the people is Contested or worse.',
    stages: [
      'Citizens grumble openly in markets.',
      'A rival power publicly questions {governing}.',
      'Pamphlets / rumors spread accusations.',
      'Tax collection slows; watch loses authority.',
      'A successor positions themselves.',
      'Public assembly forces a confrontation.',
    ],
  },
  faction_split: {
    label: 'Power Split Clock',
    triggerDescription: 'Two powers of near-equal strength want different things.',
    stages: [
      'A minor incident is exaggerated by both sides.',
      'Public statements harden.',
      'Allies are forced to pick sides.',
      'Quiet inducements / threats circulate.',
      'A symbolic act of defiance occurs.',
      'Open break: the principals stop speaking publicly.',
    ],
  },
});

/**
 * Substitute placeholder tokens in a stage string with real settlement
 * values. Unknown tokens are preserved so the rendered stage still
 * reads cleanly when no actor is available.
 */
/** @param {string} stage @param {Record<string, any>} vars @returns {string} */
function fillStage(stage, vars) {
  return stage.replace(/\{(\w+)\}/g, (/** @type {string} */ match, /** @type {string} */ name) => {
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
 * @param {Record<string, any>} settlement
 * @returns {Array<Record<string, any>>}
 */
export function deriveEscalationClocks(settlement) {
  if (!settlement) return [];
  const clocks = [];
  const facts = factsOf(settlement); // CENSUS-2c: a refused stage takes its twin in place (HOOK_ESCALATION_SIBLINGS)

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
        stages: spokenEscalationLines(tmpl.stages, facts).map(s => fillStage(s, { controller: chain.controller })),
      });
    }
    if (chain.needKey === 'trade_entrepot') {
      const tmpl = CLOCK_TEMPLATES.smuggling_rise;
      clocks.push({
        id: `clock.smuggling_rise.${chain.id}`,
        label: tmpl.label,
        triggerDescription: tmpl.triggerDescription,
        triggerTargetId: chain.id,
        triggerSource: 'supply_chain',
        triggerStatus: chain.status,
        stages: spokenEscalationLines(tmpl.stages, facts).map(s => fillStage(s, { controller: chain.controller })),
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
      stages: spokenEscalationLines(tmpl.stages, facts).map(s => fillStage(s, { governing: govName || 'the ruling power' })),
    });
  }

  // Two competing factions with similar power → faction split risk.
  // We pick the two highest-power factions; if their delta is small AND
  // their archetypes differ, that's the seed for a split. Avoids false
  // positives for single-archetype dominance.
  if (factions.length >= 2) {
    const sorted = [.../** @type {any[]} */ (factions)].sort((a, b) => (b.power || 0) - (a.power || 0));
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

/** Aggregate count by origin classification.
 * @param {Record<string, any>} settlement
 * @returns {Record<string, number>}
 */
export function structuredHookOriginBreakdown(settlement) {
  /** @type {Record<string, number>} */
  const out = {
    pressure: 0, factionConflict: 0, institution: 0,
    npc: 0, chain: 0, external: 0, other: 0,
  };
  for (const h of /** @type {Array<Record<string, any>>} */ (deriveAllStructuredHooks(settlement))) {
    if (out[h.origin] !== undefined) out[h.origin] += 1;
  }
  return out;
}
