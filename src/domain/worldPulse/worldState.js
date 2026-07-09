import { normalizeSimulationRules } from './simulationRules.js';
import { wallClockNow } from '../clock.js';

export const WORLD_STATE_SCHEMA_VERSION = 1;

const MAX_HISTORY = 80;
const MAX_PROPOSALS = 80;
// Player-authored intentions awaiting the next world-pulse tick (campaign-clock).
// Generous cap — these drain every advance; the bound only guards a pathological
// campaign that queues for hundreds of intentions without ever advancing time.
const MAX_PENDING = 400;

/**
 * @typedef {Object} WorldCalendar
 * @property {number} elapsedMonths
 * @property {number} month   1-12
 * @property {number} year    1-based campaign year
 * @property {string} season  'spring' | 'summer' | 'autumn' | 'winter'
 */

/**
 * The campaign-level world-pulse state blob, persisted on the campaign record.
 * Collection entries stay loosely typed (Record) because they are produced by
 * many generators and normalized defensively on every read via ensureWorldState.
 *
 * @typedef {Object} WorldState
 * @property {number} schemaVersion
 * @property {(string|null)} canonizedAt
 * @property {number} tick
 * @property {WorldCalendar} calendar
 * @property {string} rngSeed
 * @property {string} volatility  'calm' | 'normal' | 'turbulent'
 * @property {ReturnType<typeof normalizeSimulationRules>} simulationRules
 * @property {Array<Record<string, unknown>>} stressors
 * @property {Record<string, unknown>} relationshipStates
 * @property {Record<string, unknown>} npcStates
 * @property {Record<string, unknown>} factionStates
 * @property {Array<Record<string, unknown>>} proposals
 * @property {Array<Record<string, unknown>>} pulseHistory
 * @property {Record<string, unknown>} settlementTickStates
 * @property {Array<Record<string, unknown>>} pendingEvents
 */

/**
 * A persisted (possibly stale/partial) world state, plus the legacy top-level
 * `elapsedMonths` that predates the calendar object.
 * @typedef {Partial<WorldState> & { elapsedMonths?: number, calendar?: Partial<WorldCalendar> }} RawWorldState
 */

/** @type {Readonly<Record<string, number>>} */
const INTERVAL_MONTHS = Object.freeze({
  one_week: 0.25,
  one_month: 1,
  one_season: 3,
  one_year: 12,
});

// Months 1-3 are SPRING — createDefaultWorldState seeds {month:1, season:'spring'}
// and that seeded default is the documented intent. (The array used to start at
// winter, so the very first tick flipped a fresh campaign spring->winter and the
// pressure model's +0.08 winter food bias skewed early famines.) Mid-campaign
// saves shift their season LABEL one step on the next tick; pressure bias is now
// consistent with the label.
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

/**
 * @param {number | null | undefined} value
 * @param {number} [fallback]
 * @returns {number}
 */
function finite(value, fallback = 0) {
  // Number.isFinite is not a type-guard in the TS lib, so the true branch
  // cannot narrow `value` to number without a runtime cast (comment-only pass).
  // guaranteed number when Number.isFinite(value) is true
  return Number.isFinite(value) ? /** @type {number} */ (value) : fallback;
}

/**
 * @param {unknown} value
 * @returns {string} lowercase snake_case id fragment, never empty
 */
export function stablePart(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'unknown';
}

/**
 * @param {unknown} value
 * @returns {Array<Record<string, unknown>>} shallow clones of the entries ([] when not an array)
 */
function cloneArray(value) {
  return Array.isArray(value) ? value.map(item => ({ ...item })) : [];
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>} shallow clone ({} when not a plain object)
 */
function cloneObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
}

/**
 * @param {{ id?: string, name?: string }} [campaign]
 * @returns {WorldState}
 */
export function createDefaultWorldState(campaign = {}) {
  const seedPart = campaign.id || campaign.name || 'campaign';
  return {
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    canonizedAt: null,
    tick: 0,
    calendar: {
      elapsedMonths: 0,
      month: 1,
      year: 1,
      season: 'spring',
    },
    rngSeed: `world-pulse:${seedPart}`,
    volatility: 'normal',
    simulationRules: normalizeSimulationRules(),
    stressors: [],
    relationshipStates: {},
    npcStates: {},
    factionStates: {},
    proposals: [],
    pulseHistory: [],
    settlementTickStates: {},
    // Campaign-clock: player events/edits authored on clock-bound member
    // settlements queue here and resolve simultaneously at the next pulse tick.
    pendingEvents: [],
  };
}

/**
 * @param {RawWorldState | null | undefined} [raw]
 * @param {{ id?: string, name?: string }} [campaign]
 * @returns {WorldState}
 */
export function ensureWorldState(raw = {}, campaign = {}) {
  const base = createDefaultWorldState(campaign);
  /** @type {Partial<WorldCalendar>} */
  const calendar = raw?.calendar && typeof raw.calendar === 'object' ? raw.calendar : {};
  return {
    ...base,
    ...cloneObject(raw),
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    canonizedAt: raw?.canonizedAt || null,
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
    // Array.includes is not a type-guard, so TS cannot see that the true branch
    // implies raw.volatility is a defined member of the whitelist (comment-only pass).
    // includes(raw?.volatility) === true guarantees a valid string
    volatility: ['calm', 'normal', 'turbulent'].includes(/** @type {string} */ (raw?.volatility)) ? /** @type {any} */ (raw).volatility : base.volatility,
    simulationRules: normalizeSimulationRules(raw?.simulationRules),
    stressors: cloneArray(raw?.stressors),
    relationshipStates: cloneObject(raw?.relationshipStates),
    npcStates: cloneObject(raw?.npcStates),
    factionStates: cloneObject(raw?.factionStates),
    proposals: cloneArray(raw?.proposals).slice(-MAX_PROPOSALS),
    pulseHistory: cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY),
    settlementTickStates: cloneObject(raw?.settlementTickStates),
    pendingEvents: cloneArray(raw?.pendingEvents).slice(-MAX_PENDING),
  };
}

/**
 * @param {RawWorldState | null | undefined} worldState
 * @param {string} [now]
 * @param {{ id?: string, name?: string }} [campaign]
 * @returns {WorldState}
 */
export function canonizeWorldState(worldState, now = wallClockNow(), campaign = {}) {
  const current = ensureWorldState(worldState, campaign);
  return {
    ...current,
    canonizedAt: now,
  };
}

/**
 * @param {Partial<WorldCalendar>} [calendar]
 * @param {string} [interval]  a TickInterval key of INTERVAL_MONTHS; unknown values count as one month
 * @returns {WorldCalendar}
 */
export function advanceWorldCalendar(calendar = {}, interval = 'one_month') {
  const elapsed = Math.max(0, finite(calendar.elapsedMonths, 0)) + (INTERVAL_MONTHS[interval] ?? 1);
  const wholeMonthIndex = Math.floor(elapsed);
  const month = (wholeMonthIndex % 12) + 1;
  const year = Math.floor(wholeMonthIndex / 12) + 1;
  const season = SEASONS[Math.floor(((month - 1) % 12) / 3)] || 'spring';
  return { elapsedMonths: elapsed, month, year, season };
}

/**
 * @param {{ type?: string, targetSaveId?: string, relationshipKey?: string, id?: string, candidateId?: string }} outcome
 * @param {number} tick
 * @returns {string} deterministic proposal id
 */
export function proposalIdFor(outcome, tick) {
  return [
    'world_proposal',
    tick,
    stablePart(outcome.type),
    stablePart(outcome.targetSaveId || outcome.relationshipKey || outcome.id),
    stablePart(outcome.candidateId || outcome.id),
  ].join('.');
}

/**
 * @param {string | null | undefined} campaignId
 * @param {number} tick
 * @returns {string} deterministic pulse id
 */
export function pulseIdFor(campaignId, tick) {
  return `world_pulse.${stablePart(campaignId)}.${tick}`;
}

/**
 * @param {RawWorldState | null | undefined} worldState
 * @param {Record<string, unknown>} record
 * @returns {WorldState}
 */
export function appendPulseHistory(worldState, record) {
  const current = ensureWorldState(worldState);
  const next = [...current.pulseHistory, record].slice(-MAX_HISTORY);
  return { ...current, pulseHistory: next };
}

/**
 * @param {RawWorldState | null | undefined} worldState
 * @param {{ id: string } & Record<string, unknown>} proposal
 * @returns {WorldState}
 */
export function upsertProposal(worldState, proposal) {
  const current = ensureWorldState(worldState);
  const byId = new Map(current.proposals.map(item => [item.id, item]));
  byId.set(proposal.id, { ...(byId.get(proposal.id) || {}), ...proposal });
  return {
    ...current,
    proposals: [...byId.values()].slice(-MAX_PROPOSALS),
  };
}

/**
 * @param {RawWorldState | null | undefined} worldState
 * @param {string} proposalId
 * @param {string} status
 * @param {{ updatedAt?: string } & Record<string, unknown>} [patch]
 * @returns {WorldState}
 */
export function updateProposalStatus(worldState, proposalId, status, patch = {}) {
  const current = ensureWorldState(worldState);
  return {
    ...current,
    proposals: current.proposals.map(proposal => (
      proposal.id === proposalId
        ? { ...proposal, ...patch, status, updatedAt: patch.updatedAt || wallClockNow() }
        : proposal
    )),
  };
}
