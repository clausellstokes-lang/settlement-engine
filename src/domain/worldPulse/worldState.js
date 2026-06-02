export const WORLD_STATE_SCHEMA_VERSION = 1;

const MAX_HISTORY = 80;
const MAX_PROPOSALS = 80;

const INTERVAL_MONTHS = Object.freeze({
  one_week: 0.25,
  one_month: 1,
  one_season: 3,
  one_year: 12,
});

const SEASONS = ['winter', 'spring', 'summer', 'autumn'];

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function stablePart(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'unknown';
}

function cloneArray(value) {
  return Array.isArray(value) ? value.map(item => ({ ...item })) : [];
}

function cloneObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
}

export function createDefaultWorldState(campaign = {}) {
  const seedPart = campaign.id || campaign.name || 'campaign';
  return {
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    tick: 0,
    calendar: {
      elapsedMonths: 0,
      month: 1,
      year: 1,
      season: 'spring',
    },
    rngSeed: `world-pulse:${seedPart}`,
    volatility: 'normal',
    stressors: [],
    relationshipStates: {},
    npcStates: {},
    factionStates: {},
    proposals: [],
    pulseHistory: [],
    settlementTickStates: {},
  };
}

export function ensureWorldState(raw = {}, campaign = {}) {
  const base = createDefaultWorldState(campaign);
  const calendar = raw?.calendar && typeof raw.calendar === 'object' ? raw.calendar : {};
  return {
    ...base,
    ...cloneObject(raw),
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    tick: Math.max(0, Math.floor(finite(raw?.tick, 0))),
    calendar: {
      ...base.calendar,
      ...calendar,
      elapsedMonths: Math.max(0, finite(calendar.elapsedMonths, finite(raw?.elapsedMonths, 0))),
      month: Math.max(1, Math.floor(finite(calendar.month, 1))),
      year: Math.max(1, Math.floor(finite(calendar.year, 1))),
      season: calendar.season || base.calendar.season,
    },
    rngSeed: raw?.rngSeed || base.rngSeed,
    volatility: ['calm', 'normal', 'turbulent'].includes(raw?.volatility) ? raw.volatility : base.volatility,
    stressors: cloneArray(raw?.stressors),
    relationshipStates: cloneObject(raw?.relationshipStates),
    npcStates: cloneObject(raw?.npcStates),
    factionStates: cloneObject(raw?.factionStates),
    proposals: cloneArray(raw?.proposals).slice(-MAX_PROPOSALS),
    pulseHistory: cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY),
    settlementTickStates: cloneObject(raw?.settlementTickStates),
  };
}

export function advanceWorldCalendar(calendar = {}, interval = 'one_month') {
  const elapsed = Math.max(0, finite(calendar.elapsedMonths, 0)) + (INTERVAL_MONTHS[interval] ?? 1);
  const wholeMonthIndex = Math.floor(elapsed);
  const month = (wholeMonthIndex % 12) + 1;
  const year = Math.floor(wholeMonthIndex / 12) + 1;
  const season = SEASONS[Math.floor(((month - 1) % 12) / 3)] || 'spring';
  return { elapsedMonths: elapsed, month, year, season };
}

export function proposalIdFor(outcome, tick) {
  return [
    'world_proposal',
    tick,
    stablePart(outcome.type),
    stablePart(outcome.targetSaveId || outcome.relationshipKey || outcome.id),
    stablePart(outcome.candidateId || outcome.id),
  ].join('.');
}

export function pulseIdFor(campaignId, tick) {
  return `world_pulse.${stablePart(campaignId)}.${tick}`;
}

export function appendPulseHistory(worldState, record) {
  const current = ensureWorldState(worldState);
  const next = [...current.pulseHistory, record].slice(-MAX_HISTORY);
  return { ...current, pulseHistory: next };
}

export function upsertProposal(worldState, proposal) {
  const current = ensureWorldState(worldState);
  const byId = new Map(current.proposals.map(item => [item.id, item]));
  byId.set(proposal.id, { ...(byId.get(proposal.id) || {}), ...proposal });
  return {
    ...current,
    proposals: [...byId.values()].slice(-MAX_PROPOSALS),
  };
}

export function updateProposalStatus(worldState, proposalId, status, patch = {}) {
  const current = ensureWorldState(worldState);
  return {
    ...current,
    proposals: current.proposals.map(proposal => (
      proposal.id === proposalId
        ? { ...proposal, ...patch, status, updatedAt: patch.updatedAt || new Date().toISOString() }
        : proposal
    )),
  };
}

