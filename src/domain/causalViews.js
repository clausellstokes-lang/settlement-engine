/**
 * domain/causalViews.js - Multiple causal views over one settlement.
 *
 * Tier 5.7 of the roadmap. The same dossier, filtered through 7
 * different causal lenses. Each view is a pure derivation that
 * pulls the relevant subset from the substrate already built.
 *
 *   deriveCausalView(settlement, viewName) -> {
 *     view,
 *     title,
 *     entries: [...],   shape varies by view
 *     summary[]
 *   }
 *
 * Views:
 *   narrative      - simulation spine + daily-life slots
 *   simulation     - substrate + capacities (the structural read)
 *   delta          - recent event-log entries / regen deltas
 *   faction        - faction profiles + relationships
 *   supply_chain   - chain states + dependencies
 *   timeline       - history beats + recent disruption + clocks
 *   district       - district profiles
 *
 * Pure read-only.
 */

import { deriveSimulationSpine } from './simulationSpine.js';
import { deriveDailyLife } from './dailyLife.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllCapacities } from './capacityModel.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveHistoryBeats } from './historyBeats.js';
import { deriveEscalationClocks } from './hookEscalation.js';
import { deriveAllDistricts } from './districtProfile.js';

export const CAUSAL_VIEWS = Object.freeze([
  'narrative', 'simulation', 'delta',
  'faction', 'supply_chain', 'timeline', 'district',
]);

const VIEW_TITLES = Object.freeze({
  narrative:    'Narrative view',
  simulation:   'Simulation view',
  delta:        'Delta view',
  faction:      'Faction view',
  supply_chain: 'Supply-chain view',
  timeline:     'Timeline view',
  district:     'District view',
});

// ── Per-view derivers ───────────────────────────────────────────────────

function viewNarrative(settlement) {
  const spine = deriveSimulationSpine(settlement);
  const daily = deriveDailyLife(settlement);
  return {
    spine,
    dailyLife: daily.slots,
    summary: [
      ...Object.values(spine).filter(line => typeof line === 'string'),
      ...daily.summary,
    ],
  };
}

function viewSimulation(settlement) {
  const causal = deriveCausalState(settlement);
  const capacities = deriveAllCapacities(settlement);
  return {
    substrate: causal,
    capacities,
    summary: [
      `Substrate variables: ${Object.keys(causal.bands).length}.`,
      `Capacities: ${Object.keys(capacities.bands).length}.`,
      ...(causal.summary.collapsed.map(v => `${v} is COLLAPSED.`)),
      ...(causal.summary.critical.map(v => `${v} is critical.`)),
    ],
  };
}

function viewDelta(settlement) {
  const events = Array.isArray(settlement.eventLog) ? settlement.eventLog : [];
  const recent = events.slice(-10);
  return {
    eventLog: recent,
    summary: recent.length
      ? recent.map(e => `${e.appliedAt || '-'}: ${e.event?.type || 'unknown'} - ${e.narrativeSummary || 'no narrative'}`)
      : ['No applied events yet.'],
  };
}

function viewFaction(settlement) {
  const profiles = deriveAllFactionProfiles(settlement);
  return {
    factions: profiles,
    summary: profiles.length
      ? profiles.map(p => `${p.name} (${p.archetype}, power ${p.power}).`)
      : ['No factions on this settlement.'],
  };
}

function viewSupplyChain(settlement) {
  const chains = deriveAllSupplyChainStates(settlement);
  return {
    chains,
    summary: chains.length
      ? chains.map(c => `${c.name} - ${c.status}. Controller: ${c.controller || 'unattributed'}.`)
      : ['No supply chains on this settlement.'],
  };
}

function viewTimeline(settlement) {
  const beats = deriveHistoryBeats(settlement);
  const clocks = deriveEscalationClocks(settlement);
  const lines = [];
  for (const beat of Object.values(beats)) {
    if (beat) lines.push(`${beat.label}: ${beat.text}`);
  }
  for (const clock of clocks) {
    lines.push(`Clock - ${clock.label}: ${clock.triggerDescription}`);
  }
  return {
    historyBeats: beats,
    escalationClocks: clocks,
    summary: lines.length ? lines : ['No timeline content available.'],
  };
}

function viewDistrict(settlement) {
  const districts = deriveAllDistricts(settlement);
  return {
    districts,
    summary: districts.length
      ? districts.map(d => `${d.name} (${d.category}): ${d.wealth}, ${d.safety}. ${d.currentTension}`)
      : ['No districts on this settlement.'],
  };
}

const VIEW_DERIVERS = Object.freeze({
  narrative:    viewNarrative,
  simulation:   viewSimulation,
  delta:        viewDelta,
  faction:      viewFaction,
  supply_chain: viewSupplyChain,
  timeline:     viewTimeline,
  district:     viewDistrict,
});

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Build a causal view payload.
 *
 * @param {Object} settlement
 * @param {string} viewName
 * @returns {Object}
 */
export function deriveCausalView(settlement, viewName) {
  if (!CAUSAL_VIEWS.includes(viewName)) {
    return {
      view: viewName,
      title: viewName,
      entries: null,
      summary: [`Unknown view "${viewName}".`],
    };
  }
  if (!settlement) {
    return {
      view: viewName,
      title: VIEW_TITLES[viewName],
      entries: null,
      summary: ['No settlement to view.'],
    };
  }
  const entries = VIEW_DERIVERS[viewName](settlement);
  return {
    view: viewName,
    title: VIEW_TITLES[viewName],
    entries,
    summary: entries.summary || [],
  };
}

/** Catalog. */
export function supportedCausalViews() {
  return [...CAUSAL_VIEWS];
}

export function viewTitle(viewName) {
  return VIEW_TITLES[viewName] || viewName;
}
