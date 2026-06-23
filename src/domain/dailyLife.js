/**
 * domain/dailyLife.js — Daily-life prose grounded in structural state.
 *
 * The most consumed output a dossier
 * produces is the "what is life like here?" prose. This used to be
 * hand-authored or AI-invented; this module derives it
 * directly from the substrate that earlier stages built:
 *
 *   - faction profiles (archetype + power)
 *   - supply chain states (food + trade)
 *   - escalation clocks (recent / completed)
 *   - history beats (recentDisruption + unresolvedWound)
 *   - NPC profiles (dominant figures)
 *   - active conditions (current pressures)
 *   - substrate (14 system variables)
 *   - threats (typed pressures, visibility)
 *   - capacity model (supply vs demand for 9 capacities)
 *
 * The 8 canonical daily-life slots — the same shape as the
 * history beats so consumers render them the same way:
 *
 *   food_culture           What people eat / who controls grain
 *   dawn_work              What work starts at dawn
 *   gathering_places       Where people congregate
 *   child_warnings         What children are warned about
 *   commoner_resentments   What commoners resent
 *   outsider_impressions   What outsiders notice first
 *   unspoken_topics        What locals refuse to discuss
 *   recent_changes         What changed in the last month/season
 *
 * Pure read-only derivation. Returns structured prose with `references`
 * arrays so the UI can let the user click through to the explainEntity
 * envelope for any cited subsystem.
 *
 * No imports from src/lib. No mutation. No AI — this is the pre-AI
 * substrate the AI overlay later grounds in.
 */

import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllCapacities, VISIBLE_CAPACITY_LENSES } from './capacityModel.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { deriveAllNpcProfiles } from './npcProfile.js';
import { deriveCausalState } from './causalState.js';

// ── Canonical catalog ────────────────────────────────────────────────────

export const DAILY_LIFE_SLOTS = Object.freeze([
  'food_culture',
  'dawn_work',
  'gathering_places',
  'child_warnings',
  'commoner_resentments',
  'outsider_impressions',
  'unspoken_topics',
  'recent_changes',
]);

const SLOT_LABELS = Object.freeze({
  food_culture:         'Food culture',
  dawn_work:            'Dawn work',
  gathering_places:     'Gathering places',
  child_warnings:       'Child warnings',
  commoner_resentments: 'Commoner resentments',
  outsider_impressions: 'Outsider impressions',
  unspoken_topics:      'Unspoken topics',
  recent_changes:       'Recent changes',
});

// ── Per-slot derivers ────────────────────────────────────────────────────
//
// Every deriver takes the settlement + a precomputed substrate context
// and returns a single slot:
//
//   { key, label, text, source, references }
//
// references[] is an array of structured pointers (id + type + label)
// that consumers can hand to 's explainEntity. The deriver
// always produces a slot — even when data is thin, it falls back to
// a generic but truthful line.

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function institutionByPattern(settlement, pattern) {
  const inst = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  return inst.filter(i => pattern.test(String(i?.name || '')));
}

function deriveFoodCulture(s, ctx) {
  const refs = [];
  const food = ctx.capacities.capacities.food_production;
  const foodChains = ctx.chains.filter(c => c.needKey === 'food_security');
  const stableFood = foodChains.find(c => c.status === 'stable');
  const disruptedFood = foodChains.find(c => c.status !== 'stable');

  let text;
  switch (food.band) {
    case 'surplus':
      text = stableFood
        ? `Bread, broth, and ${stableFood.outputs?.[0] || 'staple grains'} are plentiful; markets close their stalls without empty crates.`
        : 'Bread and broth are plentiful; few households go to bed hungry.';
      break;
    case 'adequate':
      text = 'Hearty grain bread and turnip-and-onion stews dominate the table; meat appears at festivals and on the wealthier streets.';
      break;
    case 'strained':
      text = disruptedFood
        ? `Loaves shrink each month; ${disruptedFood.name.toLowerCase()} is ${disruptedFood.status}, and householders stretch what arrives.`
        : 'Loaves shrink each month; householders stretch what they can.';
      break;
    case 'critical':
      text = disruptedFood
        ? `Rations are tight: ${disruptedFood.name.toLowerCase()} is ${disruptedFood.status}, and the poor eat watered stew.`
        : 'Rations are tight; the poor eat watered stew and the well-off hoard quietly.';
      break;
    default:  // collapsed
      text = 'Hunger is everywhere. People queue at temple kitchens; rumors fly about caravans that never arrived.';
      break;
  }

  refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  for (const c of foodChains) refs.push({ id: c.id, label: c.name, type: 'chain' });

  return slot('food_culture', text, 'capacity.food_production + supply chains', refs);
}

// Labor/craft/transport are noise lenses — this
// slot no longer reads or cites them. Dawn work re-anchors on the
// canonical food_production + defense lenses (what the first hours of
// the day are FOR: bread and walls); the guild/merchant flavor the
// craft band used to gate now keys off faction power alone.
function deriveDawnWork(s, ctx) {
  const refs = [];
  const food = ctx.capacities.capacities.food_production;
  const defense = ctx.capacities.capacities.defense;
  const dominantCraftPower = ctx.profiles.find(p => p.archetype === 'craft')?.power || 0;
  const dominantMerchantPower = ctx.profiles.find(p => p.archetype === 'merchant')?.power || 0;

  let text;
  if (food.band === 'critical' || food.band === 'collapsed') {
    text = 'Dawn work is the search for food. Foragers leave before light, and the granary queue forms before the ovens are warm.';
  } else if (defense.band === 'critical' || defense.band === 'collapsed') {
    text = 'The walls claim the first hours: the watch musters thin at first light, and ordinary work waits until the rounds are walked.';
  } else if (dominantCraftPower >= 25) {
    text = 'Smithy fires light before sunrise; guild-callers move from shop to shop, and apprentices haul water before the bell.';
  } else if (dominantMerchantPower >= 30) {
    text = 'Merchant caravans roll before light; porters and apprentices queue at the warehouses, and dawn brings the smell of woodsmoke and grain.';
  } else {
    text = 'Bakers light their ovens first, then the smiths; the watch changes as the gates open.';
  }

  refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  refs.push({ id: 'capacity.defense', label: 'Defense', type: 'capacity' });

  return slot('dawn_work', text, 'capacity.food_production + capacity.defense + dominant faction', refs);
}

function deriveGatheringPlaces(s, _ctx) {
  const refs = [];
  const RELIGIOUS_PATTERN = /(temple|cathedral|chapel|shrine|abbey|monastery)/i;
  const TRADE_PATTERN = /(market|bazaar|forum|exchange|quay|wharf)/i;
  const INN_PATTERN = /(inn|tavern|hall|guildhall)/i;
  const religious = institutionByPattern(s, RELIGIOUS_PATTERN);
  const trade = institutionByPattern(s, TRADE_PATTERN);
  const inns = institutionByPattern(s, INN_PATTERN);

  const places = [];
  if (religious.length) {
    places.push(`the steps of ${religious[0].name}`);
    refs.push({ id: religious[0].id || `institution.${snakeCase(religious[0].name)}`, label: religious[0].name, type: 'institution' });
  }
  if (trade.length) {
    places.push(`the ${trade[0].name.toLowerCase()}`);
    refs.push({ id: trade[0].id || `institution.${snakeCase(trade[0].name)}`, label: trade[0].name, type: 'institution' });
  }
  if (inns.length) {
    places.push(`the ${inns[0].name.toLowerCase()}`);
    refs.push({ id: inns[0].id || `institution.${snakeCase(inns[0].name)}`, label: inns[0].name, type: 'institution' });
  }

  const text = places.length
    ? `By midday people are gathered at ${places.join(', ')}, talking, trading, and watching.`
    : 'People gather where they can: the well, the bridge, the open square.';

  return slot('gathering_places', text, 'institutions matched by category pattern', refs);
}

function deriveChildWarnings(s, ctx) {
  const refs = [];
  // Top threats by severity
  const top = [...ctx.threats].sort((a, b) => b.severity - a.severity).slice(0, 3);

  let text;
  if (top.length === 0) {
    text = 'Children are warned about the usual things: the deep well, the strangers\' road, the woods at twilight.';
  } else {
    const parts = top.map(t => threatWarning(t));
    text = `Children are warned about ${parts.join('; ')}.`;
    for (const t of top) refs.push({ id: t.id, label: t.label, type: 'threat' });
  }

  return slot('child_warnings', text, 'top threats by severity', refs);
}

function threatWarning(threat) {
  switch (threat.type) {
    case 'monster_pressure':    return 'the road past sundown';
    case 'bandit_raids':        return 'strangers who linger at the gates';
    case 'siege':               return 'staying close when the bells ring three times';
    case 'rival_neighbor':      return `anything bearing the colors of the neighbour`;
    case 'plague':              return 'the sick-house and unfamiliar coughs';
    case 'famine':              return 'wandering off (bread is short)';
    case 'corruption':          return 'talking to officials they don\'t know';
    case 'unrest':              return 'crowds that gather quickly';
    case 'arcane_instability':  return 'shimmering air and unfamiliar lights';
    case 'cult':                return 'masked strangers offering sweets';
    case 'economic_collapse':   return 'the empty stalls in the trade quarter';
    default:                    return threat.label.toLowerCase();
  }
}

function deriveCommonerResentments(s, ctx) {
  const refs = [];
  const causalState = ctx.causal;
  const resentments = [];

  // Criminal opportunity is INVERTED (lower_is_better): high score = more
  // crime = more resentment. We check the raw score against thresholds.
  const crimScore = causalState.scores.criminal_opportunity ?? 50;
  if (crimScore >= 70) {
    resentments.push('the watch turning a blind eye to the right pockets');
    refs.push({ id: 'var.criminal_opportunity', label: 'Criminal opportunity', type: 'system_variable' });
  } else if (crimScore >= 55) {
    resentments.push('the smugglers who pay no tax while honest carts queue');
    refs.push({ id: 'var.criminal_opportunity', label: 'Criminal opportunity', type: 'system_variable' });
  }

  // Strained merchant wealth + active food chain pressure → grain prices
  const food = ctx.capacities.capacities.food_production;
  if (food.band === 'strained' || food.band === 'critical' || food.band === 'collapsed') {
    resentments.push('rising bread prices and merchants who claim they cannot help it');
    refs.push({ id: 'capacity.food_production', label: 'Food production', type: 'capacity' });
  }

  // Low legitimacy → resent the council/governing body
  if (causalState.bands.public_legitimacy === 'strained' || causalState.bands.public_legitimacy === 'critical' || causalState.bands.public_legitimacy === 'collapsed') {
    resentments.push('the council\'s indifference to ordinary complaints');
    refs.push({ id: 'var.public_legitimacy', label: 'Public legitimacy', type: 'system_variable' });
  }

  // Corruption condition or threat
  const corruption = ctx.conditions.find(c => c.archetype === 'corruption_exposed');
  if (corruption) {
    resentments.push('the officials who keep their posts while honest folk pay the fines');
    refs.push({ id: corruption.id, label: corruption.label, type: 'condition' });
  }

  const text = resentments.length
    ? `Commoners resent ${resentments.join('; and ')}.`
    : 'Commoners voice the small grievances of any town: the gate fee, the rain on market day, the council\'s favorite tavern.';

  return slot('commoner_resentments', text, 'criminal_opportunity + food_production + public_legitimacy + corruption', refs);
}

function deriveOutsiderImpressions(s, ctx) {
  const refs = [];
  const top = [...ctx.threats].sort((a, b) => b.severity - a.severity)[0];
  const dominantFaction = ctx.profiles
    .slice()
    .sort((a, b) => (b.power || 0) - (a.power || 0))[0];
  // Only the five visible/DM-facing lenses count toward outsider-visible
  // prose. An internal labor/craft/transport shortage is real for the
  // simulation but must not surface here, matching the five-lens policy the
  // AI payload enforces (see aiGrounding.js).
  const strainedCaps = VISIBLE_CAPACITY_LENSES
    .filter(n => ['strained', 'critical', 'collapsed'].includes(ctx.capacities.bands[n]));

  const parts = [];
  if (dominantFaction) {
    parts.push(`${dominantFaction.name}'s mark is on every door that matters`);
    refs.push({ id: dominantFaction.id, label: dominantFaction.name, type: 'faction' });
  }
  if (top && top.severityBand !== 'low') {
    parts.push(`${top.label.toLowerCase()} is the obvious unspoken weight`);
    refs.push({ id: top.id, label: top.label, type: 'threat' });
  }
  if (strainedCaps.length >= 3) {
    parts.push('several civic services run short: visitors notice missing watch, slow service, or shuttered shops');
  }

  const text = parts.length
    ? `Outsiders notice ${parts.join('; ')}.`
    : 'The settlement reads to outsiders as ordinary: quiet streets, predictable bells, faces that don\'t yet know yours.';

  return slot('outsider_impressions', text, 'dominant faction + top threat + strained capacities', refs);
}

function deriveUnspokenTopics(s, ctx) {
  const refs = [];
  const topics = [];

  // Hidden / rumored threats
  const hidden = ctx.threats.filter(t => t.visibility === 'hidden' || t.visibility === 'rumored');
  for (const t of hidden.slice(0, 2)) {
    topics.push(t.label.toLowerCase());
    refs.push({ id: t.id, label: t.label, type: 'threat' });
  }

  // Unresolved wound from history
  const wound = ctx.history.unresolvedWound;
  if (wound) {
    topics.push('the matter referenced as "the wound"');
    refs.push({ id: 'history.unresolvedWound', label: wound.label, type: 'history_beat' });
  }

  // Recently exposed corruption
  const corruption = ctx.conditions.find(c => c.archetype === 'corruption_exposed');
  if (corruption) {
    topics.push('the names spoken half-whispered in market stalls');
    refs.push({ id: corruption.id, label: corruption.label, type: 'condition' });
  }

  const text = topics.length
    ? `Locals will not openly discuss ${topics.join('; or ')}.`
    : 'Locals are happy to discuss most things; the usual private subjects stay private.';

  return slot('unspoken_topics', text, 'hidden threats + unresolved history wound + active corruption', refs);
}

function deriveRecentChanges(s, ctx) {
  const refs = [];
  const changes = [];

  // Recent disruption from history beats
  const recent = ctx.history.recentDisruption;
  if (recent) {
    changes.push(recent.text);
    refs.push({ id: 'history.recentDisruption', label: recent.label, type: 'history_beat' });
  }

  // Newly-active conditions (elapsedTicks < 2)
  const newConditions = ctx.conditions.filter(c => (c.duration?.elapsedTicks ?? 0) < 2);
  for (const c of newConditions.slice(0, 2)) {
    changes.push(`${c.label.toLowerCase()} is the new shape of things`);
    refs.push({ id: c.id, label: c.label, type: 'condition' });
  }

  // High-severity, near-realized threats
  const acute = ctx.threats
    .filter(t => t.currentStage === 'imminent' || t.currentStage === 'realized')
    .slice(0, 2);
  for (const t of acute) {
    changes.push(`${t.label.toLowerCase()} has come to a head`);
    refs.push({ id: t.id, label: t.label, type: 'threat' });
  }

  const text = changes.length
    ? `Recent changes: ${changes.join('; ')}.`
    : 'The last few seasons have run their usual course. No notable shifts in the rhythm of the place.';

  return slot('recent_changes', text, 'history.recentDisruption + new conditions + acute threats', refs);
}

// ── Slot helper ──────────────────────────────────────────────────────────

function slot(key, text, source, references) {
  return {
    key,
    label: SLOT_LABELS[key] || key,
    text,
    source,
    references,
  };
}

// ── Composer ─────────────────────────────────────────────────────────────

const DERIVERS = Object.freeze({
  food_culture:         deriveFoodCulture,
  dawn_work:            deriveDawnWork,
  gathering_places:     deriveGatheringPlaces,
  child_warnings:       deriveChildWarnings,
  commoner_resentments: deriveCommonerResentments,
  outsider_impressions: deriveOutsiderImpressions,
  unspoken_topics:      deriveUnspokenTopics,
  recent_changes:       deriveRecentChanges,
});

/**
 * Build the substrate context once per call so each slot deriver
 * doesn't re-derive.
 */
function buildContext(settlement) {
  return {
    profiles:   deriveAllFactionProfiles(settlement),
    chains:     deriveAllSupplyChainStates(settlement),
    conditions: deriveAllActiveConditions(settlement),
    threats:    deriveAllThreatProfiles(settlement),
    capacities: deriveAllCapacities(settlement),
    causal:     deriveCausalState(settlement),
    history:    deriveHistoryBeats(settlement),
    npcs:       deriveAllNpcProfiles(settlement),
  };
}

/**
 * Derive one named daily-life slot.
 *
 * @param {string} key   One of DAILY_LIFE_SLOTS.
 * @param {Object} settlement
 * @returns {Object | null}    DailyLifeSlot, or null for unknown key.
 */
export function deriveDailyLifeSlot(key, settlement) {
  if (!key || !DERIVERS[key]) return null;
  if (!settlement) {
    return slot(key, '–', 'no settlement', []);
  }
  const ctx = buildContext(settlement);
  return DERIVERS[key](settlement, ctx);
}

/**
 * Derive every canonical daily-life slot. Builds context once.
 *
 * @returns {Object} {
 *   slots: { [key]: DailyLifeSlot },
 *   summary: string[],
 * }
 */
export function deriveDailyLife(settlement) {
  if (!settlement) {
    const empty = {};
    for (const key of DAILY_LIFE_SLOTS) empty[key] = slot(key, '–', 'no settlement', []);
    return { slots: empty, summary: [] };
  }
  const ctx = buildContext(settlement);
  const slots = {};
  const summary = [];
  for (const key of DAILY_LIFE_SLOTS) {
    const s = DERIVERS[key](settlement, ctx);
    slots[key] = s;
    summary.push(`${s.label}: ${s.text}`);
  }
  return { slots, summary };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Flat array of `${label}: ${text}` lines. */
export function summarizeDailyLife(settlement) {
  return deriveDailyLife(settlement).summary;
}

/** Catalog accessor. */
export function supportedDailyLifeSlots() {
  return [...DAILY_LIFE_SLOTS];
}

// Exposed for unit tests that need to drive one deriver against a
// controlled context (e.g. proving the five-lens visible-capacity boundary
// holds for outsider-facing prose). Production callers go through
// deriveDailyLifeSlot / deriveDailyLife.
export const __test__ = Object.freeze({ deriveOutsiderImpressions });

// ── compareDailyLife ────────────────────────────────────────────────────
//
// Diff two daily-life envelopes. Returns one entry per slot whose
// text changed. Useful for the counterfactual tool — "after
// removing the granary, food_culture changed from X to Y" — and for
// causal delta summaries after regeneration.

/**
 * @typedef {Object} DailyLifeDelta
 * @property {string} key
 * @property {string} label
 * @property {string} before
 * @property {string} after
 * @property {Array<{id: string, label: string, type: string}>} beforeReferences
 * @property {Array<{id: string, label: string, type: string}>} afterReferences
 */

/**
 * Diff two daily-life envelopes. Returns slot-level diffs for any
 * slot whose text changed.
 *
 * @param {Object} before  Output of deriveDailyLife.
 * @param {Object} after   Output of deriveDailyLife.
 * @returns {DailyLifeDelta[]}
 */
export function compareDailyLife(before, after) {
  if (!before || !after) return [];
  const out = [];
  for (const key of DAILY_LIFE_SLOTS) {
    const b = before.slots?.[key];
    const a = after.slots?.[key];
    if (!b || !a) continue;
    if (b.text === a.text) continue;
    out.push({
      key,
      label: SLOT_LABELS[key] || key,
      before: b.text,
      after: a.text,
      beforeReferences: b.references || [],
      afterReferences:  a.references || [],
    });
  }
  return out;
}
