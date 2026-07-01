/**
 * domain/timeProgression.js — Tick-by-tick simulation advancement.
 *
 * The composing layer: applies faction deltas, advances escalation
 * clocks, returns a structured "what changed" report. Turns the
 * generator into a campaign engine.
 *
 *   advanceTime(settlement, options) -> { newSettlement, tick, nextTickState }
 *
 * Pure. The input settlement is cloned (deep clone of the bits we
 * mutate); the original is never touched. The tick report is the
 * structured payload (AI grounded-in-trace) and the future
 * "what changed since last session" UI will consume.
 *
 * Active conditions are passed in by the caller (the canonical-state
 * layer will own these; for V1 we accept an array of
 * archetype strings like ['plague', 'trade_route_cut']).
 *
 * Clock state — which stage each known clock has advanced to — is
 * threaded explicitly. The caller gets back `nextTickState` from
 * each call and passes it into the next call. Once canonical state
 * lands, the clock state will live on the settlement; for V1 it's an
 * external concern so this module doesn't need to touch the
 * settlement schema.
 *
 * Pure functions only. No imports from src/lib.
 */

import { recalculateFactionRelationships, summarizeByFaction } from './factionRelationshipUpdate.js';
import { deriveEscalationClocks } from './hookEscalation.js';
import {
  activeArchetypes,
  withTickedConditionDurations,
  withExpiredConditionsRemoved,
  deriveAllActiveConditions,
} from './activeConditions.js';

/** @typedef {import('./settlement.schema.js').TickInterval} TickInterval */

// ── Intervals ────────────────────────────────────────────────────────────
// Each interval scales the intensity of applied conditions. Larger
// intervals compound more, but we don't simply multiply — pressures
// have diminishing returns past a point. Use sub-linear scaling.

const INTERVAL_SCALES = Object.freeze({
  one_week:   0.25,
  one_month:  1.00,
  one_season: 2.25,    // ~3 months but with diminishing returns
  one_year:   6.00,    // ~12 months but accounting for partial recoveries
});

const VALID_INTERVALS = new Set(Object.keys(INTERVAL_SCALES));

/** @param {any} interval */
function intervalScale(interval) {
  return /** @type {Record<string, number>} */ (INTERVAL_SCALES)[interval] ?? INTERVAL_SCALES.one_month;
}

// ── Legitimacy banding ──────────────────────────────────────────────────
// When a publicLegitimacy.score moves across a band boundary, the
// label / multipliers / boolean flags must update too. Centralized
// here so advance + forecast both produce consistent settlement state.

/** @param {number} score */
function reBand(score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped >= 75) return { label: 'Endorsed',          color: '#1a5a28', govMultiplier: 1.30, crimMultiplier: 0.75 };
  if (clamped >= 60) return { label: 'Approved',          color: '#4a7a2a', govMultiplier: 1.15, crimMultiplier: 0.90 };
  if (clamped >= 45) return { label: 'Tolerated',         color: '#a0762a', govMultiplier: 1.00, crimMultiplier: 1.00 };
  if (clamped >= 30) return { label: 'Contested',         color: '#8a4010', govMultiplier: 0.80, crimMultiplier: 1.15 };
  return { label: 'Legitimacy Crisis', color: '#8b1a1a', govMultiplier: 0.60, crimMultiplier: 1.30 };
}

/** @param {any} legitimacy @param {number} delta */
function applyLegitimacyDelta(legitimacy, delta) {
  if (!legitimacy) return legitimacy;
  const newScore = Math.max(0, Math.min(100, Math.round((legitimacy.score || 0) + delta)));
  const band = reBand(newScore);
  return {
    ...legitimacy,
    score: newScore,
    label: band.label,
    color: band.color,
    govMultiplier: band.govMultiplier,
    crimMultiplier: band.crimMultiplier,
    isEndorsed:          newScore >= 75,
    isApproved:          newScore >= 60,
    isTolerated:         newScore >= 45 && newScore < 60,
    isContested:         newScore >= 30 && newScore < 45,
    isLegitimacyCrisis:  newScore < 30,
    governanceFractured: newScore < 30,
  };
}

// ── Clock advancement ───────────────────────────────────────────────────
// Each active condition typically advances exactly one clock per tick.
// Clocks complete at stage 6 and emit a "completion" event in the
// report. Once completed, a clock holds at stage 6 until the trigger
// resolves.

/** @param {import('./settlement.schema.js').SimSettlement} settlement @param {any} previousState */
function advanceClocks(settlement, previousState) {
  // Re-derive the current clock set from the settlement. Any clock no
  // longer triggered (e.g. supply chain recovered) drops off.
  const liveClocks = deriveEscalationClocks(settlement);
  const liveIds = new Set(liveClocks.map(c => c.id));

  const prevStages = previousState?.clockStages || {};
  /** @type {Record<string, number>} */
  const nextStages = {};
  /** @type {any[]} */
  const advancements = [];

  for (const clock of liveClocks) {
    const previous = prevStages[clock.id] || 0;
    const nextStage = Math.min(previous + 1, clock.stages.length);
    nextStages[clock.id] = nextStage;
    advancements.push({
      clockId: clock.id,
      label: clock.label,
      previousStage: previous,
      stage: nextStage,
      totalStages: clock.stages.length,
      stageDescription: clock.stages[nextStage - 1] || null,
      completed: nextStage >= clock.stages.length,
      triggerDescription: clock.triggerDescription,
    });
  }

  // Clocks that fell off (no longer triggered) get a 'resolved' note
  // so the report can narrate the recovery.
  const resolutions = [];
  for (const oldId of Object.keys(prevStages)) {
    if (!liveIds.has(oldId)) {
      resolutions.push({
        clockId: oldId,
        previousStage: prevStages[oldId],
        resolved: true,
      });
    }
  }

  return { nextStages, advancements, resolutions };
}

// ── Faction-delta application ───────────────────────────────────────────
// Power scores live as numbers on each faction (clamped 0-100). Public
// legitimacy lives as a score + band + flags. The other fields the
// deltas reference (wealth, publicTrust, manpower) are reported in
// the tick but not yet stored as numbers on the faction shape —
// they're band-only. (custom user content) will add
// numeric storage for those bands.

/** @param {any} settlement @param {any} allDeltas */
function applyFactionDeltasToSettlement(settlement, allDeltas) {
  if (!allDeltas || allDeltas.length === 0) return settlement;

  const cloned = {
    ...settlement,
    powerStructure: settlement.powerStructure ? {
      ...settlement.powerStructure,
      factions: (settlement.powerStructure.factions || []).map(/** @param {any} f */ f => ({ ...f })),
      publicLegitimacy: settlement.powerStructure.publicLegitimacy
        ? { ...settlement.powerStructure.publicLegitimacy }
        : null,
    } : null,
  };

  // Aggregate first so we don't churn through partial states.
  const byFaction = summarizeByFaction(allDeltas);

  for (const { factionId, deltas } of Object.values(byFaction)) {
    const targetSlug = factionId.replace(/^faction\./, '');

    // Find the faction by stable id (slug match).
    const faction = (cloned.powerStructure?.factions || []).find(/** @param {any} f */ f =>
      f && typeof f.faction === 'string'
      && f.faction.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') === targetSlug
    );

    if (!faction) continue;

    // Power: directly applied to the numeric field, clamped 0-100.
    if (typeof deltas.power === 'number') {
      const next = Math.max(0, Math.min(100, (faction.power || 0) + deltas.power));
      faction.power = next;
    }

    // Legitimacy: applied to publicLegitimacy.score AND re-banded
    // ONLY when this faction is the governing faction (legitimacy on
    // the settlement is the governing faction's legitimacy).
    if (typeof deltas.legitimacy === 'number' && cloned.powerStructure?.publicLegitimacy) {
      // Exact comparison: governingName is the governing roster faction's exact
      // name; the old first-token substring match misrouted a faction-targeted
      // legitimacy delta into settlement legitimacy for ~26% of rosters
      // (e.g. "Merchant Guilds" deltas hitting a "Merchant League" government).
      const governingName = cloned.powerStructure?.governingName || '';
      const isGoverning = (faction.isGoverning === true)
        || (governingName
          && faction.faction
          && governingName.toLowerCase() === faction.faction.toLowerCase());
      if (isGoverning) {
        cloned.powerStructure.publicLegitimacy = applyLegitimacyDelta(
          cloned.powerStructure.publicLegitimacy,
          deltas.legitimacy,
        );
      }
    }

    // Wealth / publicTrust / manpower: tracked in tick output (see
    // composer below) but not yet stored on the faction; custom user
    // content will add the storage. We DO mirror them onto the faction as
    // string-suffixed delta lines so consumers reading the live shape
    // can show "wealth pressure" without a separate state surface.
    for (const field of ['wealth', 'publicTrust', 'manpower']) {
      if (typeof deltas[field] === 'number') {
        if (!faction._timePressure) faction._timePressure = {};
        faction._timePressure[field] = (faction._timePressure[field] || 0) + deltas[field];
      }
    }
  }

  return cloned;
}

// ── Composer: single tick ───────────────────────────────────────────────

/**
 * Advance the settlement by one interval. Returns the new settlement,
 * a structured report, and the next clock state.
 *
 * @param {Object} settlement
 * @param {Object} [options]
 * @param {TickInterval} [options.interval='one_month']
 * @param {string[]}     [options.activeConditions]      Archetype keys (e.g. 'plague').
 *                                                       When omitted, reads from
 *                                                       settlement.activeConditions
 *                                                       (canonical state).
 * @param {Object}       [options.previousTickState]     { clockStages: { [clockId]: int } }
 * @returns {any} { newSettlement, tick, nextTickState }
 */
export function advanceTime(settlement, options = {}) {
  const {
    interval = 'one_month',
    activeConditions: overrideConditions,
    previousTickState = null,
  } = options;

  // Source of truth for "what archetypes apply this tick":
  //   - explicit options.activeConditions wins (allows callers to
  //     simulate hypothetical "what if plague" without mutating state),
  //   - otherwise read from canonical settlement.activeConditions
  //.
  const sourceArchetypes = Array.isArray(overrideConditions)
    ? overrideConditions
    : activeArchetypes(settlement);

  if (!settlement) {
    return {
      newSettlement: settlement,
      tick: {
        interval,
        appliedConditions: [],
        factionDeltas: [],
        clockAdvancements: [],
        clockResolutions: [],
        conditionsExpired: [],
        summary: [],
      },
      nextTickState: previousTickState,
    };
  }

  const usableInterval = VALID_INTERVALS.has(interval) ? interval : 'one_month';
  const scale = intervalScale(usableInterval);

  // ── 1. Collect faction deltas from every active condition ───────────
  const allDeltas = [];
  for (const conditionArchetype of sourceArchetypes) {
    const deltas = /** @type {any[]} */ (recalculateFactionRelationships(
      settlement,
      { type: `CONDITION_TICK_${conditionArchetype.toUpperCase()}` },
      { archetype: conditionArchetype },
    ));
    // Scale by interval (per-week is a quarter as intense as per-month
    // for the same condition).
    for (const d of deltas) {
      allDeltas.push({
        ...d,
        delta: typeof d.delta === 'number' ? Math.round(d.delta * scale) : d.delta,
        reason: `[${usableInterval} tick] ${d.reason}`,
      });
    }
  }

  // ── 2. Apply faction deltas to the cloned settlement ───────────────
  let newSettlement = applyFactionDeltasToSettlement(settlement, allDeltas);

  // ── 3. Age + expire canonical settlement conditions (regardless of
  //      whether the caller passed an override) ────────────────────────
  newSettlement = withTickedConditionDurations(newSettlement, usableInterval);
  const expiryResult = withExpiredConditionsRemoved(newSettlement);
  newSettlement = expiryResult.settlement;
  const conditionsExpired = expiryResult.expired;

  // ── 4. Advance clocks (against the NEW settlement state so a clock
  //      that lifted in step 2 is correctly seen as resolved) ─────────
  const { nextStages, advancements, resolutions } = advanceClocks(newSettlement, previousTickState);

  // ── 5. Build the report ────────────────────────────────────────────
  const summary = [];
  if (sourceArchetypes.length) {
    summary.push(`${usableInterval.replace(/_/g, ' ')} passed. Active conditions: ${sourceArchetypes.join(', ')}.`);
  } else {
    summary.push(`${usableInterval.replace(/_/g, ' ')} passed under no active conditions.`);
  }
  for (const adv of advancements) {
    if (adv.completed) {
      summary.push(`${adv.label} reached its final stage: "${adv.stageDescription}"`);
    } else {
      summary.push(`${adv.label} advanced to stage ${adv.stage}/${adv.totalStages}: "${adv.stageDescription}"`);
    }
  }
  for (const res of resolutions) {
    summary.push(`Clock resolved: ${res.clockId} (was at stage ${res.previousStage}).`);
  }
  for (const exp of conditionsExpired) {
    summary.push(`Condition expired: ${exp.label} (after ${exp.duration.elapsedTicks.toFixed(2)} ticks).`);
  }

  const tick = {
    interval: usableInterval,
    appliedConditions: [...sourceArchetypes],
    factionDeltas: allDeltas,
    factionSummary: summarizeByFaction(allDeltas),
    clockAdvancements: advancements,
    clockResolutions: resolutions,
    conditionsExpired,
    activeConditions: deriveAllActiveConditions(newSettlement),
    summary,
  };

  return {
    newSettlement,
    tick,
    nextTickState: { clockStages: nextStages },
  };
}

// ── Forecast helper: multi-tick projection without committing ───────────

/**
 * Run N ticks against a clone and return both the final projected
 * settlement and the accumulated report. Does NOT mutate the input.
 *
 * Useful for "if nothing changes by winter" surfaces and AI
 * grounding. The cumulative summary lets the AI overlay narrate the
 * full trajectory rather than a single tick.
 *
 * @param {Object}        settlement
 * @param {Object}        [options]                       Same as advanceTime, plus `ticks`.
 * @param {number}        [options.ticks=1]               How many tick cycles to run.
 * @param {TickInterval}  [options.interval='one_month']
 * @param {string[]}      [options.activeConditions=[]]
 * @param {Object}        [options.previousTickState]
 * @returns {Object} { projectedSettlement, ticks: TimeProgressionTick[], finalState }
 */
export function forecastTime(settlement, options = {}) {
  const { ticks = 1, previousTickState = null, ...tickOptions } = options;
  const safeTicks = Math.max(1, Math.min(24, Math.round(ticks)));

  let current = settlement;
  /** @type {any} */
  let state = previousTickState;
  /** @type {any[]} */
  const ticksOut = [];

  for (let i = 0; i < safeTicks; i++) {
    const { newSettlement, tick, nextTickState } = advanceTime(current, {
      ...tickOptions,
      previousTickState: state,
    });
    current = newSettlement;
    state = nextTickState;
    ticksOut.push(tick);
  }

  return {
    projectedSettlement: current,
    ticks: ticksOut,
    finalState: state,
  };
}

// ── Diagnostic helpers ──────────────────────────────────────────────────

/**
 * Aggregate forecast across all ticks. Returns:
 *   { totalDeltas: byFaction, summaryLines: string[], clocksAtFinal }
 */
/** @param {any} forecast */
export function summarizeForecast(forecast) {
  if (!forecast || !Array.isArray(forecast.ticks)) {
    return { totalDeltas: {}, summaryLines: [], clocksAtFinal: {} };
  }

  // Flatten + summarize all faction deltas across ticks.
  const allDeltas = forecast.ticks.flatMap(/** @param {any} t */ t => t.factionDeltas || []);
  const totalDeltas = summarizeByFaction(allDeltas);

  // Flat narrative lines.
  const summaryLines = forecast.ticks.flatMap(/** @param {any} t */ t => t.summary || []);

  return {
    totalDeltas,
    summaryLines,
    clocksAtFinal: forecast.finalState?.clockStages || {},
  };
}

/** Supported intervals — useful for UI affordances + drift detection. */
export function supportedIntervals() {
  return Array.from(VALID_INTERVALS);
}
