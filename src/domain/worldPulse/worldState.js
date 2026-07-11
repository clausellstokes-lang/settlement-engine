import { normalizeSimulationRules } from './simulationRules.js';
import { wallClockNow } from '../clock.js';
import { deepClone } from '../clone.js';
import { stablePart } from './stablePart.js';

export const WORLD_STATE_SCHEMA_VERSION = 2;

const MAX_HISTORY = 80;
const MAX_PROPOSALS = 80;
// Player-authored intentions awaiting the next world-pulse tick (campaign-clock).
// Generous cap — these drain every advance; the bound only guards a pathological
// campaign that queues for hundreds of intentions without ever advancing time.
const MAX_PENDING = 400;

// Calendar unification (Option A, architect ruling 2026-07-11): WEEKS ARE
// CANONICAL. The temporal constitution fixes tick = 1 week, month = 4 weeks,
// year = 52 weeks — so the display year is THIRTEEN four-week months (13×4=52,
// the only self-consistent triple). This table is duration-in-MONTHS per DM
// interval and mirrors weeksPerInterval (advanceInterval.js) exactly at 4 weeks
// per month: every entry is weeks/4, so a coarse advance and its decomposed
// weekly ticks accumulate IDENTICAL elapsedMonths (0.25 is a dyadic rational —
// binary-exact, no float drift), and the derived month/year/season agree on
// both paths by construction.
const INTERVAL_MONTHS = Object.freeze({
  one_week: 0.25,
  one_month: 1,
  one_season: 3.25,
  one_year: 13,
});

const MONTHS_PER_YEAR = 13;  // 13 four-week months = 52 weeks
const WEEKS_PER_YEAR = 52;
const WEEKS_PER_SEASON = 13; // four equal 13-week quarters

// The year opens in SPRING — createDefaultWorldState seeds {month:1,
// season:'spring'} and that seeded default is the documented intent. (The array
// used to start at winter, so the very first tick flipped a fresh campaign
// spring->winter and the pressure model's +0.08 winter food bias skewed early
// famines.) Seasons derive from WEEK-OF-YEAR as four 13-week quarters (weeks
// 0-12 spring … 39-51 winter), NOT from the month index: 13 months cannot split
// into four equal month-runs, so the season grid lives on weeks — a season
// boundary can land mid-month (month 4 opens in spring and turns summer at week
// 13). Mid-campaign saves shift their season LABEL at most one step on the next
// tick; pressure bias stays consistent with the label.
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

/**
 * @param {any} value
 * @param {number} [fallback]
 */
function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

// stablePart moved to the dependency-free leaf ./stablePart.js (W2b byte-budget
// extraction) so the eager tier-outcome applier mints identical ids without
// importing this module; imported above (this module still uses it) and
// re-exported verbatim — every consumer is unchanged.
export { stablePart };

/** @param {any} value */
function cloneArray(value) {
  return Array.isArray(value) ? value.map((/** @type {any} */ item) => ({ ...item })) : [];
}

// Stressors are special: each item carries NESTED mutable structures
// (affectedSettlementIds, severityBySettlement, causes). A shallow `{...item}`
// (cloneArray) would alias those nested arrays/objects into the per-tick snapshot,
// so any future in-place mutation of one (push/splice/index-assign, instead of the
// normalizeStressor rebuild every current writer uses) would corrupt the persisted
// pre-tick record and break determinism. Deep-clone each stressor through the
// sanctioned seam so the snapshot can never alias live nested state. The cloned
// values are deeply EQUAL to the source, so the dormancy / byte-identity invariants
// are unaffected — this only removes the aliasing fragility the shallow clone relied
// on an unenforced "writers always rebuild" convention to stay safe.
/** @param {any} value */
function cloneStressors(value) {
  return Array.isArray(value) ? value.map((/** @type {any} */ item) => deepClone(item)) : [];
}

/** @param {any} value */
function cloneObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
}

// cloneObject is SHALLOW. Nested simulation ledgers (dispositionStats, deployments,
// and later pantheon) are read inside the per-tick snapshot and mutated across
// ticks, so a shallow copy would let a snapshot alias live state and corrupt
// determinism. These ledgers route through deepClone (the sole sanctioned clone
// seam) instead. Non-objects normalize to an empty ledger.
/** @param {any} value */
function deepCloneLedger(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? deepClone(value) : {};
}

// CONDITIONAL ledger clone (the pantheon). UNLIKE the additive ledgers above, the
// pantheon is CONDITIONALLY MATERIALIZED: it must be ABSENT from worldState while
// religion is dormant so a legacy/deity-free campaign stays byte-identical under
// the dormancy oracle (which treats an absent key as `{}`). So this returns
// `undefined` (key omitted by the conditional spread below) when the value is
// absent or empty, and a DEEP clone of a present, non-empty pantheon otherwise —
// never the `{}` default deepCloneLedger materializes unconditionally.
/** @param {any} value */
function deepCloneConditionalLedger(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  if (Object.keys(value).length === 0) return undefined;
  return deepClone(value);
}

// Forward-compatible worldState migration chain. Empty today (schemaVersion stays
// 1; the new ledgers are ADDITIVE and need no migration — an absent key normalizes
// to its empty default). Modelled on settlementMigrations: each entry bumps a
// breaking shape. The first future BREAKING change registers its step here so the
// upgrade path is explicit and ordered, never an ad-hoc inline coercion.
/** @type {ReadonlyArray<{ to: number, migrate: (raw: any) => any }>} */
const WORLD_STATE_MIGRATIONS = Object.freeze([
  // v2 — the per-settlement pantheon renamed its leading deity from "chief" to
  // "patron", unifying vocabulary with the DM "Assign patron deity" action. Rename
  // the persisted religionStates keys in place. IDEMPOTENT: migrations run
  // unconditionally, so a state already carrying patronRef (or no religionStates at
  // all) passes through untouched.
  { to: 2, migrate: (/** @type {any} */ raw) => {
    const states = raw?.religionStates;
    if (!states || typeof states !== 'object' || Array.isArray(states)) return raw;
    let touched = false;
    /** @type {Record<string, any>} */
    const next = {};
    for (const [cid, st] of Object.entries(states)) {
      if (st && typeof st === 'object' && !Array.isArray(st)
        && ('chiefRef' in st || 'chiefHeld' in st || 'chiefChallengeTicks' in st)) {
        touched = true;
        const { chiefRef, chiefHeld, chiefChallengeTicks, ...rest } = /** @type {any} */ (st);
        next[cid] = {
          ...rest,
          ...(chiefRef !== undefined ? { patronRef: chiefRef } : {}),
          ...(chiefHeld !== undefined ? { patronHeld: chiefHeld } : {}),
          ...(chiefChallengeTicks !== undefined ? { patronChallengeTicks: chiefChallengeTicks } : {}),
        };
      } else {
        next[cid] = st;
      }
    }
    return touched ? { ...raw, religionStates: next, schemaVersion: 2 } : raw;
  } },
]);

/** @param {any} raw */
export function runWorldStateMigrations(raw = {}) {
  const input = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return WORLD_STATE_MIGRATIONS.reduce((state, step) => step.migrate(state), input);
}

/** @param {any} campaign */
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
    // Additive simulation ledgers (the geopolitical layer). Empty on a fresh
    // world; populated by later phases (dispositionStats: cross-settlement
    // win/loss disposition memory; deployments: active army records;
    // tradeWarState: per-prize primary-supplier crown + flip cooldown;
    // warExhaustion: the NON-REVERTING per-home war-exhaustion scar that
    // ratchets up with sustained deployment and decays only slowly, closing the
    // homeostasis loop). A legacy keyless save normalizes equal to these empties —
    // byte-neutral under the dormancy oracle. `pantheon` is intentionally NOT here
    // (it is conditional).
    dispositionStats: {},
    deployments: {},
    tradeWarState: {},
    warExhaustion: {},
  };
}

export function ensureWorldState(rawInput = {}, campaign = {}) {
  const raw = runWorldStateMigrations(rawInput);
  const base = createDefaultWorldState(campaign);
  const calendar = raw?.calendar && typeof raw.calendar === 'object' ? raw.calendar : {};
  // The SHALLOW `...cloneObject(raw)` spread would otherwise carry a
  // present-but-EMPTY `pantheon:{}` through to the result (breaking dormancy). Strip
  // it from the shallow spread; the conditional deep-clone below is the SOLE source
  // of the key — materialized only when non-empty. `warPosture` is CONDITIONAL the
  // same way: a no-war campaign carries NO warPosture key at all (byte-neutral under
  // the dormancy oracle), so it is stripped here and re-added conditionally below.
  const shallowRaw = cloneObject(raw);
  if ('pantheon' in shallowRaw) delete shallowRaw.pantheon;
  if ('warPosture' in shallowRaw) delete shallowRaw.warPosture;
  if ('occupations' in shallowRaw) delete shallowRaw.occupations;
  // religionStates — CONDITIONAL, same discipline as pantheon/occupations: the
  // per-settlement pantheon ledger is ABSENT until religion is active (byte-identical
  // dormant), stripped here and re-added conditionally below.
  if ('religionStates' in shallowRaw) delete shallowRaw.religionStates;
  // Advance-scaling Stage 3 — pausedAdvance is CONDITIONALLY MATERIALIZED, the same
  // discipline as pantheon/warPosture/occupations: a campaign with NO advance in
  // flight carries NO pausedAdvance key at all (so a dormant campaign serializes
  // byte-identically to today under the dormancy oracle). Stripped from the shallow
  // spread; re-added below ONLY when present and non-empty.
  if ('pausedAdvance' in shallowRaw) delete shallowRaw.pausedAdvance;
  // martialReadiness — CONDITIONAL (W-F8): the per-settlement martial-readiness /
  // strategic-experience ledger ({ cid -> { readiness01, experience01 } }). A faith-
  // gated, war-experience-driven quantity — ABSENT until a settlement first arms under
  // a patron, so a deity-free / war-free campaign carries NO key (byte-identical under
  // the dormancy oracle). Stripped here, re-added conditionally below.
  if ('martialReadiness' in shallowRaw) delete shallowRaw.martialReadiness;
  const clonedPantheon = deepCloneConditionalLedger(raw?.pantheon);
  const clonedWarPosture = deepCloneConditionalLedger(raw?.warPosture);
  const clonedOccupations = deepCloneConditionalLedger(raw?.occupations);
  const clonedReligionStates = deepCloneConditionalLedger(raw?.religionStates);
  const clonedPausedAdvance = deepCloneConditionalLedger(raw?.pausedAdvance);
  const clonedMartialReadiness = deepCloneConditionalLedger(raw?.martialReadiness);
  return {
    ...base,
    ...shallowRaw,
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
    volatility: ['calm', 'normal', 'turbulent'].includes(raw?.volatility) ? raw.volatility : base.volatility,
    simulationRules: normalizeSimulationRules(raw?.simulationRules),
    stressors: cloneStressors(raw?.stressors),
    relationshipStates: cloneObject(raw?.relationshipStates),
    npcStates: cloneObject(raw?.npcStates),
    factionStates: cloneObject(raw?.factionStates),
    proposals: cloneArray(raw?.proposals).slice(-MAX_PROPOSALS),
    pulseHistory: cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY),
    settlementTickStates: cloneObject(raw?.settlementTickStates),
    pendingEvents: cloneArray(raw?.pendingEvents).slice(-MAX_PENDING),
    // DEEP-cloned (not the shallow `...cloneObject(raw)` spread above) so a
    // pre-tick snapshot never aliases live ledger state across ticks.
    dispositionStats: deepCloneLedger(raw?.dispositionStats),
    deployments: deepCloneLedger(raw?.deployments),
    tradeWarState: deepCloneLedger(raw?.tradeWarState),
    warExhaustion: deepCloneLedger(raw?.warExhaustion),
    // Pantheon — CONDITIONAL materialization. Stripped from the shallow spread
    // above; re-added here as a DEEP clone ONLY when present and non-empty, so a
    // dormant/legacy world carries NO pantheon key (byte-identical under the
    // dormancy oracle), while an active world's pantheon never aliases live state
    // across ticks.
    ...(clonedPantheon !== undefined ? { pantheon: clonedPantheon } : {}),
    // religionStates — CONDITIONAL materialization (per-settlement pantheon: deities,
    // adherent shares, niches, standings, chief). ABSENT until religion is active ⇒
    // byte-identical dormant; DEEP-cloned when present so a pre-tick snapshot never
    // aliases live share state across ticks.
    ...(clonedReligionStates !== undefined ? { religionStates: clonedReligionStates } : {}),
    // warPosture — CONDITIONAL materialization, identical discipline to pantheon:
    // the per-settlement mobilization posture ledger ({ id -> { state, progress,
    // sinceTick, covert } }). ABSENT while no settlement has left peace (a no-war /
    // layer-off campaign carries NO warPosture key ⇒ byte-identical under the
    // dormancy oracle), DEEP-cloned when present so a pre-tick snapshot never aliases
    // live posture state across ticks.
    ...(clonedWarPosture !== undefined ? { warPosture: clonedWarPosture } : {}),
    // occupations — CONDITIONAL materialization, identical discipline to pantheon/
    // warPosture: the per-OCCUPIED-settlement occupation-state ledger ({ occupiedId ->
    // { occupierId, state, sinceTick, stateHeld, resistance, benefitYield, lastTick } }).
    // ABSENT until the first conquest creates an occupation (a no-war / layer-off
    // campaign carries NO occupations key ⇒ byte-identical under the dormancy oracle),
    // DEEP-cloned when present so a pre-tick snapshot never aliases live occupation state
    // across ticks (read-last/write-next).
    ...(clonedOccupations !== undefined ? { occupations: clonedOccupations } : {}),
    // pausedAdvance — CONDITIONAL materialization, identical discipline to pantheon/
    // warPosture/occupations: the paused-Advance cursor ({ interval, ticksTotal,
    // ticksDone, atTick, resumeTick, pendingMajors, preSnapshot, autoResolve,
    // startedAt }). ABSENT when no advance is paused (a campaign with no advance in
    // flight carries NO pausedAdvance key ⇒ byte-identical under the dormancy
    // oracle), DEEP-cloned when present so a rehydrated cursor never aliases live
    // state. CLEARING the pause writes pausedAdvance:null/absent ⇒ this returns
    // undefined ⇒ the key is omitted (back to byte-neutral).
    ...(clonedPausedAdvance !== undefined ? { pausedAdvance: clonedPausedAdvance } : {}),
    // martialReadiness — CONDITIONAL materialization (W-F8), identical discipline to
    // religionStates: the per-settlement { readiness01, experience01 } ledger with
    // asymmetric hysteresis. ABSENT until a settlement first arms under a patron (a
    // deity-free / war-free campaign carries NO key ⇒ byte-identical under the dormancy
    // oracle), DEEP-cloned when present so a pre-tick snapshot never aliases live
    // readiness across ticks (read-last/write-next).
    ...(clonedMartialReadiness !== undefined ? { martialReadiness: clonedMartialReadiness } : {}),
  };
}

/**
 * @param {any} worldState
 * @param {any} [now]
 * @param {any} [campaign]
 */
export function canonizeWorldState(worldState, now = wallClockNow(), campaign = {}) {
  const current = ensureWorldState(worldState, campaign);
  return {
    ...current,
    canonizedAt: now,
  };
}

/**
 * @param {any} calendar
 * @param {string} [interval]
 */
export function advanceWorldCalendar(calendar = {}, interval = 'one_month') {
  const elapsed = Math.max(0, finite(calendar.elapsedMonths, 0)) + (/** @type {Record<string, number>} */ (INTERVAL_MONTHS)[interval] ?? 1);
  const wholeMonthIndex = Math.floor(elapsed);
  // 13-month display year (weeks canonical): month index 1..13, year rolls at 13.
  const month = (wholeMonthIndex % MONTHS_PER_YEAR) + 1;
  const year = Math.floor(wholeMonthIndex / MONTHS_PER_YEAR) + 1;
  // Season from WEEK-OF-YEAR (four 13-week quarters), never the month index.
  // elapsedMonths only ever accumulates exact quarter-months (INTERVAL_MONTHS),
  // so elapsed*4 is an exact integer week count — no float drift at the floor.
  const weekOfYear = Math.floor(elapsed * 4) % WEEKS_PER_YEAR;
  const season = SEASONS[Math.floor(weekOfYear / WEEKS_PER_SEASON)] || 'spring';
  return { elapsedMonths: elapsed, month, year, season };
}

/**
 * @param {any} outcome
 * @param {any} tick
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
 * @param {any} campaignId
 * @param {any} tick
 */
export function pulseIdFor(campaignId, tick) {
  return `world_pulse.${stablePart(campaignId)}.${tick}`;
}

/**
 * @param {any} worldState
 * @param {any} record
 */
export function appendPulseHistory(worldState, record) {
  const current = ensureWorldState(worldState);
  const next = [...current.pulseHistory, record].slice(-MAX_HISTORY);
  return { ...current, pulseHistory: next };
}

/**
 * @param {any} worldState
 * @param {any} proposal
 */
export function upsertProposal(worldState, proposal) {
  const current = ensureWorldState(worldState);
  const byId = new Map(current.proposals.map((/** @type {any} */ item) => [item.id, item]));
  byId.set(proposal.id, { ...(byId.get(proposal.id) || {}), ...proposal });
  return {
    ...current,
    proposals: [...byId.values()].slice(-MAX_PROPOSALS),
  };
}

/**
 * @param {any} worldState
 * @param {any} proposalId
 * @param {any} status
 * @param {any} [patch]
 */
export function updateProposalStatus(worldState, proposalId, status, patch = {}) {
  const current = ensureWorldState(worldState);
  return {
    ...current,
    proposals: current.proposals.map((/** @type {any} */ proposal) => (
      proposal.id === proposalId
        ? { ...proposal, ...patch, status, updatedAt: patch.updatedAt || wallClockNow() }
        : proposal
    )),
  };
}
