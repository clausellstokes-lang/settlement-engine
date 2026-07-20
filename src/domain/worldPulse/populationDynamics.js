import { activeChannelsFrom } from '../region/index.js';
import { canonicalRelationshipLabel } from '../region/graph.js';
import { stablePart } from './worldState.js';
import { intensityMultiplier, normalizeSimulationRules } from './simulationRules.js';
import { formatCount } from '../formatNumber.js';

// WEEK-denominated interval durations (the canonical grid — mirrors
// worldState.js INTERVAL_WEEKS), converted to month units at the ONE boundary
// below: under the 4-4-5 calendar (52 weeks = 12 months) a week is 12/52 =
// 3/13 of a month, so months = (weeks × 3) / 13 — the identical float
// expression on the production weekly path and on a direct coarse call.
// (Exactness across paths is moot here anyway: the orchestrator only ever
// ticks one_week; the coarse entries are reached solely by direct unit-test
// calls.) A one_year coarse call grows exactly 12 months' worth (156/13 exact).
const INTERVAL_WEEKS = Object.freeze({
  one_week: 1,
  one_month: 4,
  one_season: 13,
  one_year: 52,
});

/** @param {string} interval */
function monthsForInterval(interval) {
  const weeks = /** @type {Record<string, number>} */ (INTERVAL_WEEKS)[interval] ?? INTERVAL_WEEKS.one_month;
  return (weeks * 3) / 13;
}

const MIGRATION_CHANNELS = Object.freeze(['migration_pressure', 'trade_route', 'political_authority', 'military_protection']);

/**
 * @param {any} value
 * @param {number} [fallback]
 */
function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * @param {any} pressureIdx
 * @param {any} settlementId
 * @param {any} kind
 */
function score(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(settlementId, kind)?.score || 0;
}

/**
 * @param {any} item
 */
function conditionsFor(item) {
  return item?.activeConditions || item?.settlement?.activeConditions || [];
}

// Conditions classify by archetype id ONLY (the activeConditions.js catalog) —
// prose matching made the siege_lifted RECOVERY condition read as an active
// siege, flipping a freshly broken siege into deterministic mass emigration
// with a self-contradicting explanation. DM-authored custom_crisis conditions
// carry catalog affectedSystems instead of a mapped archetype, so they
// contribute through that systems signal.
const INFLUX_ARCHETYPES = new Set(['regional_migration_pressure']);
const FOOD_CRISIS_ARCHETYPES = new Set(['famine', 'food_anchor_lost', 'regional_import_shortage']);
const DISEASE_CRISIS_ARCHETYPES = new Set(['plague']);
// Population is no longer blind to occupation or to the cost of waging war.
// vassal_extraction is the canonical OCCUPATION condition (conditionPromotion maps
// the 'occupied' stressor AND the conquest aftermath into it): an occupied town
// bleeds people (extraction + a hated garrison). war_drain is the AGGRESSOR's home
// condition: a settlement bankrupting itself abroad sheds people too. Both are
// gated behind warLayerEnabled at the SOURCE (the war evaluator never mints
// war_drain when OFF, and a generation-occupied town already carried
// vassal_extraction before this change — but it never lost population for it until
// now), so a no-war campaign that never stamps either is byte-identical.
// occupation_resistance (the occupied town's ongoing refreshed stressor) and occupation_burden
// (the occupier's overextension) are re-emitted EVERY tick by occupation.js, unlike the one-shot
// vassal_extraction proxy (stamped once at conquest, expiring after 6 ticks): both press the
// population RATE while the occupation stands. All war archetypes are gated behind warLayerEnabled
// at the source, so a no-war campaign never stamps them ⇒ byte-identical.
const WAR_CRISIS_ARCHETYPES = new Set(['war_pressure', 'vassal_extraction', 'war_drain', 'occupation_resistance', 'occupation_burden']);
const BURDEN_ARCHETYPES = new Set(['alliance_burden', 'regional_protection_gap', 'relief_burden']);
// siege_lifted belongs HERE and only here: it is the post-siege recovery bonus.
const RECOVERY_ARCHETYPES = new Set(['siege_lifted', 'occupation_lifted', 'stressor_residual']);
// One crisis-flight class feeds both the severe classifier and the
// mass-emigration gate; recovery archetypes are deliberately absent. Occupation
// drives REFUGEE FLIGHT — the column flees the occupier — so vassal_extraction AND
// the occupied town's ongoing occupation_resistance join the flight set alongside
// war_pressure; occupation_burden (the OCCUPIER's overextension) is austerity, not
// flight — like war_drain it presses the rate, not the emigration gate, so it stays out.
const CRISIS_FLIGHT_ARCHETYPES = new Set(['famine', 'plague', 'war_pressure', 'vassal_extraction', 'occupation_resistance', 'regional_migration_pressure']);

/**
 * @param {any} item
 * @param {Set<string>} archetypes
 * @param {string[]} [systems]
 */
function hasConditionSignal(item, archetypes, systems = []) {
  return conditionsFor(item).some((/** @type {any} */ c) => {
    if (!c) return false;
    if (archetypes.has(c.archetype)) return true;
    return c.archetype === 'custom_crisis'
      && (c.affectedSystems || []).some((/** @type {any} */ s) => systems.includes(s));
  });
}

/**
 * @param {any} interval
 */
function intervalMagnitude(interval) {
  const months = monthsForInterval(interval);
  return Math.max(0.25, Math.pow(months, 0.85));
}

/**
 * @param {any} saveId
 * @param {any} tick
 */
function migrationChoice(saveId, tick) {
  const text = `${saveId}:${tick}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return ['void', 'distributed', 'concentrated'][hash % 3];
}

/**
 * @param {any} snapshot
 * @param {any} sourceId
 */
function candidateDestinations(snapshot, sourceId) {
  const byId = snapshot?.byId;
  const ids = new Set();
  for (const channel of activeChannelsFrom(snapshot?.regionalGraph, sourceId, { types: [...MIGRATION_CHANNELS] })) {
    if (channel.to && String(channel.to) !== String(sourceId)) ids.add(String(channel.to));
  }
  for (const edge of snapshot?.regionalGraph?.edges || []) {
    const from = String(edge.from || edge.source || '');
    const to = String(edge.to || edge.target || '');
    if (from === String(sourceId) && to) ids.add(to);
    if (to === String(sourceId) && from) ids.add(from);
  }
  return [...ids].map(id => byId?.get?.(id)).filter(Boolean);
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 */
function destinationScore(item, pressureIdx) {
  const id = item.id;
  const safety = 1 - score(pressureIdx, id, 'conflict');
  const food = 1 - score(pressureIdx, id, 'food');
  const trade = 1 - score(pressureIdx, id, 'trade');
  const legitimacy = 1 - score(pressureIdx, id, 'legitimacy');
  return safety * 0.3 + food * 0.3 + trade * 0.22 + legitimacy * 0.18;
}

// Refugees follow their relationships, not just the pressure map: allies and
// the overlord/vassal road take far more of a column than a border under
// cold war, and almost nobody flees INTO a hostile city. Multiplies the
// pressure-based destination score (so a hostile neighbour usually falls
// under the 0.35 admission bar entirely).
const RELATIONSHIP_DISPERSAL_WEIGHTS = Object.freeze({
  allied: 1.5,
  vassal: 1.35,
  patron: 1.35,
  trade_partner: 1.25,
  rival: 0.7,
  cold_war: 0.45,
  hostile: 0.15,
});

// Compatibility shim mirrored from stressorDynamics.relationshipTypeOf: legacy
// saves carry the plural 'trade_partners'; read it as the canonical singular.
/**
 * @param {any} edge
 */
function edgeLabel(edge) {
  return canonicalRelationshipLabel(String(edge?.relationshipType || edge?.type || '').toLowerCase());
}

/**
 * @param {any} snapshot
 * @param {any} sourceId
 * @param {any} destId
 */
function relationshipWeight(snapshot, sourceId, destId) {
  const a = String(sourceId);
  const b = String(destId);
  const weights = [];
  for (const edge of snapshot?.regionalGraph?.edges || []) {
    const from = String(edge?.from || edge?.source || '');
    const to = String(edge?.to || edge?.target || '');
    if (!((from === a && to === b) || (from === b && to === a))) continue;
    const weight = RELATIONSHIP_DISPERSAL_WEIGHTS[/** @type {keyof typeof RELATIONSHIP_DISPERSAL_WEIGHTS} */ (edgeLabel(edge))];
    if (weight != null) weights.push(weight);
  }
  if (!weights.length) return 1;
  // Hostility outranks friendship on the same pair: nobody marches refugees
  // into a city they are at war with just because a trade edge also exists.
  const worst = Math.min(...weights);
  return worst < 1 ? worst : Math.max(...weights);
}

/**
 * Split `migrants` across candidate destinations. Exported for a focused
 * conservation unit test (the split must never create or destroy population).
 * @param {any} options
 */
export function distributeMigrants({ sourceId, migrants, snapshot, pressureIdx, mode, tick }) {
  const chosenMode = mode === 'roll' ? migrationChoice(sourceId, tick) : mode;
  if (chosenMode === 'void') return { mode: chosenMode, deltas: [] };

  // One weighted scorer everywhere: admission filter, ranking, and split
  // weights all see the same relationship-adjusted desirability.
  const weightedScore = (/** @type {any} */ item) =>
    destinationScore(item, pressureIdx) * relationshipWeight(snapshot, sourceId, item.id);
  const destinations = candidateDestinations(snapshot, sourceId)
    .filter((/** @type {any} */ item) => weightedScore(item) >= 0.35)
    // Codepoint tie-break on id (matching religiousContest.js/tradeSalience.js): without
    // it, two equal-score destinations rank by candidateDestinations' Set-build order, so a
    // refactor that reorders edges/channels would silently perturb the migrant split and
    // break the golden master. The id key makes the ranking order-independent.
    .sort((/** @type {any} */ a, /** @type {any} */ b) => (weightedScore(b) - weightedScore(a))
      || (String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0));
  if (!destinations.length) return { mode: 'void', deltas: [] };

  if (chosenMode === 'concentrated') {
    return {
      mode: chosenMode,
      deltas: [{ saveId: destinations[0].id, delta: migrants, reason: 'Displaced population concentrates in the most plausible receiving settlement.' }],
    };
  }

  const top = destinations.slice(0, 4);
  const totalWeight = top.reduce((sum, item) => sum + Math.max(0.1, weightedScore(item)), 0);
  let assigned = 0;
  const deltas = top.map((item, index) => {
    const last = index === top.length - 1;
    const remaining = migrants - assigned;
    // Clamp every non-last share to what's LEFT so the running total can never
    // exceed `migrants`. Without this the Math.max(1,…) floor could over-assign
    // when migrants < destinations (e.g. 2 migrants over 4 dests → [1,1,1,-1]),
    // forcing the last delta negative; it was then filtered out, injecting phantom
    // people (a non-conservation leak). Conservation now holds by construction:
    // sum(deltas) === migrants exactly. Unreachable on the live path today (the
    // mass-emigration gate floors migrants ≥ 11) but pinned so a future threshold
    // change can't silently re-open it.
    const delta = last
      ? remaining
      : Math.min(remaining, Math.max(1, Math.round(migrants * (Math.max(0.1, weightedScore(item)) / totalWeight))));
    assigned += delta;
    return { saveId: item.id, delta, reason: 'Displaced population disperses through regional links.' };
  }).filter(d => d.delta > 0);
  return { mode: chosenMode, deltas };
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 * @param {any} rules
 */
function populationPressureRate(item, pressureIdx, rules) {
  const id = item.id;
  const food = score(pressureIdx, id, 'food');
  const disease = score(pressureIdx, id, 'disease');
  const conflict = score(pressureIdx, id, 'conflict');
  const trade = score(pressureIdx, id, 'trade');
  const legitimacy = score(pressureIdx, id, 'legitimacy');
  const crime = score(pressureIdx, id, 'crime');

  const stability = 1 - ((food * 0.26) + (disease * 0.2) + (conflict * 0.22) + (trade * 0.14) + (legitimacy * 0.12) + (crime * 0.06));
  let monthlyRate = 0.0018 + (stability - 0.5) * 0.012;

  if (hasConditionSignal(item, INFLUX_ARCHETYPES)) monthlyRate += 0.012;
  if (hasConditionSignal(item, FOOD_CRISIS_ARCHETYPES, ['food_security'])) monthlyRate -= 0.013;
  if (hasConditionSignal(item, DISEASE_CRISIS_ARCHETYPES, ['healing_capacity'])) monthlyRate -= 0.02;
  if (hasConditionSignal(item, WAR_CRISIS_ARCHETYPES, ['defense_readiness'])) monthlyRate -= 0.016;
  if (hasConditionSignal(item, BURDEN_ARCHETYPES)) monthlyRate -= 0.006;
  if (hasConditionSignal(item, RECOVERY_ARCHETYPES)) monthlyRate += 0.002;

  return monthlyRate * intensityMultiplier(rules);
}

/**
 * @param {any} item
 * @param {any} pressureIdx
 * @param {any} interval
 * @param {any} rules
 */
function deltaForSettlement(item, pressureIdx, interval, rules) {
  const pop = Math.max(0, Math.round(finite(item?.settlement?.population, 0)));
  if (pop <= 0) return null;
  const magnitude = intervalMagnitude(interval);
  const rate = populationPressureRate(item, pressureIdx, rules);
  const severe = Math.abs(rate) >= 0.025 || hasConditionSignal(item, CRISIS_FLIGHT_ARCHETYPES);
  const cap = pop * (severe ? 0.18 : 0.055) * intensityMultiplier(rules);
  const rawDelta = Math.round(pop * rate * magnitude);
  const delta = Math.round(clamp(rawDelta, -cap, cap));
  if (Math.abs(delta) < Math.max(2, Math.round(pop * 0.001))) return null;
  return { pop, delta, severe };
}

/**
 * @param {any} options
 */
function populationCandidate({ item, interval, pressureIdx, snapshot, rules, tick, spatialActive }) {
  const result = deltaForSettlement(item, pressureIdx, interval, rules);
  if (!result) return null;
  const { pop, delta, severe } = result;
  const sourceId = String(item.id);
  const abs = Math.abs(delta);
  // Scale the mass-emigration bar DOWN for sub-month intervals. The fixed
  // 2.5%-of-pop bar was structurally unreachable at one_week — the GA cadence —
  // where a max-crisis settlement's weekly loss (~2.2%) never crossed it; only
  // one_month+ deltas did. The magnitude factor is clamped to 1 so the bar only
  // ever lowers: at one_month+ it stays at the design 2.5%, because the loss delta
  // is itself capped at pop*0.18 (the severe cap in deltaForSettlement). Letting the
  // bar scale past that — e.g. pop*0.207 at one_year — would push it ABOVE the
  // achievable delta and make mass emigration unreachable at long intervals instead
  // (one_year reachability is pinned by worldPulseExpansion / migrationDispersal).
  const massThreshold = Math.max(25, Math.round(pop * 0.025 * Math.min(1, intervalMagnitude(interval))));
  const isMassEmigration = delta < 0 && abs >= massThreshold && (severe || hasConditionSignal(item, CRISIS_FLIGHT_ARCHETYPES));
  const populationDeltas = [{ saveId: sourceId, delta, reason: delta > 0 ? 'Organic growth from favorable conditions.' : 'Population loss from cumulative settlement pressure.' }];
  let transferMode = null;
  let migrants = 0;
  // M4 (MIGRATION-WITH-MORTALITY) hand-off: the shed pool the spatial mover consumes.
  let spatialEmigration = null;

  if (isMassEmigration && rules.migrationFlowsEnabled && !['off', 'local'].includes(rules.propagationMode)) {
    if (spatialActive) {
      // M4 spatial path (Phase 5.5): the origin sheds the SAME `abs` (byte-parity
      // origin trajectory) but its FATE — the 4-axis route-based destinations, the
      // TWO mortality sinks, the transport-lag arrival — is the migrationKernel's
      // job, dispatched POST-APPLY from this marker. The aspatial `abs*0.45` proxy
      // is RECONCILED into the spatial ORIGIN-MORTALITY stage (never both), so we do
      // NOT distribute here: no same-tick destination credits, no `abs*0.45`. The
      // destinations receive their (mortality-reduced, lagged) arrivals later, via
      // the in-transit column ledger — the conservation invariant holds there.
      spatialEmigration = { loss: abs };
      transferMode = 'spatial';
    } else {
      migrants = Math.max(0, Math.round(abs * 0.45));
      const transfer = distributeMigrants({
        sourceId,
        migrants,
        snapshot,
        pressureIdx,
        mode: rules.migrationMode,
        tick,
      });
      transferMode = transfer.mode;
      populationDeltas.push(...transfer.deltas);
    }
  }

  const major = abs >= Math.max(80, Math.round(pop * 0.04)) || migrants >= Math.max(60, Math.round(pop * 0.025));
  const kind = delta > 0 ? 'growth' : isMassEmigration ? 'emigration' : 'decline';
  return {
    id: `candidate.population.${kind}.${stablePart(sourceId)}.${tick}`,
    type: 'population',
    candidateType: `population_${kind}`,
    ruleId: `population_${kind}`,
    ruleFamily: 'population',
    targetSaveId: sourceId,
    severity: clamp(abs / Math.max(1, pop * 0.12), 0.12, 1),
    probability: 1,
    applyMode: major && rules.majorChangesRequireProposal ? 'proposal' : 'auto',
    headline: `${item.name || sourceId} population may ${delta > 0 ? 'grow' : 'fall'}`,
    // formatCount (not toLocaleString): a bare toLocaleString() renders `12,000`
    // on en-US ICU but `12 000`/`12.000` elsewhere, so persisted candidate
    // summaries — and any golden over advance output — would drift by the runner's
    // locale. formatCount is the locale-independent grouped formatter the engine
    // pins everywhere (F13/localeFormatGuard); no host-ICU dependence at all.
    summary: delta > 0
      ? `${item.name || sourceId} gains about ${formatCount(abs)} people from favorable conditions.`
      : `${item.name || sourceId} loses about ${formatCount(abs)} people from cumulative pressure${migrants ? `; about ${formatCount(migrants)} may migrate onward` : ''}.`,
    reasons: [
      `Food ${score(pressureIdx, sourceId, 'food').toFixed(2)}, defense pressure ${score(pressureIdx, sourceId, 'conflict').toFixed(2)}, trade pressure ${score(pressureIdx, sourceId, 'trade').toFixed(2)}.`,
      `Interval ${interval.replace(/_/g, ' ')} with ${rules.intensity} intensity.`,
      transferMode ? `Migration mode resolved as ${transferMode.replace(/_/g, ' ')}.` : null,
    ].filter(Boolean),
    populationDeltas,
    generatedAtTick: tick,
    // spatialEmigration (M4): the shed-pool marker the migrationKernel reads POST-APPLY
    // to dispatch the spatial migration (destinations + mortality + transport lag).
    // Present ONLY on the spatial path (absent ⇒ the aspatial candidate is byte-identical).
    metadata: { populationKind: kind, transferMode, migrants, ...(spatialEmigration ? { spatialEmigration } : {}) },
    conflictTags: [`population:${sourceId}`],
  };
}

/**
 * @param {any} snapshot
 * @param {any} pressureIdx
 * @param {any} [context]
 */
export function evaluatePopulationDynamics(snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || snapshot?.worldState?.simulationRules);
  if (!rules.populationDynamicsEnabled) return [];
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const interval = context.interval || 'one_month';
  // M4 gate: the spatial migration mover owns the DISTRIBUTION when the spatial-canon
  // marker is present (context.spatialActive). Absent/undefined ⇒ the aspatial path
  // runs verbatim (byte-identical) — the injected boolean adds no spatial import here.
  const spatialActive = !!context.spatialActive;
  return (snapshot?.settlements || [])
    .map((/** @type {any} */ item) => populationCandidate({ item, interval, pressureIdx, snapshot, rules, tick, spatialActive }))
    .filter(Boolean);
}

// ── Migration staleness re-verify (self-contained; the same re-verify contract as
// applyTierOutcomeToSettlement). A mass-emigration outcome can be applied MANY ticks
// after it was generated (a long-parked proposal): by then the source may hold fewer
// people than the stored debit. The source side always clamped at zero — but the
// paired destination credits landed IN FULL, minting people out of thin air. The
// apply pass hands every settlement of one outcome the SAME outcome object, source
// first (populationDeltas order → affectedSaveIds order), so the source apply records
// the REALIZED debit fraction here and each destination apply scales its credit by it
// (floored, so Σ scaled credits ≤ the people who actually left). Keyed on outcome
// object identity — scoped to a single apply pass, invisible to persistence. A
// destination applied without a source record (source missing from the settlement
// map) keeps the legacy full credit. Fresh (non-stale) outcomes realize fraction 1 ⇒
// byte-identical.
/** @type {WeakMap<object, number>} */
const migrationRealizedFraction = new WeakMap();

/**
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {any} outcome
 * @param {any} saveId
 */
export function applyPopulationOutcomeToSettlement(settlement, outcome, saveId) {
  if (!settlement || !outcome?.populationDeltas) return settlement;
  let delta = outcome.populationDeltas
    .filter((/** @type {any} */ item) => String(item.saveId) === String(saveId))
    .reduce((/** @type {any} */ sum, /** @type {any} */ item) => sum + (Number(item.delta) || 0), 0);
  if (!delta) return settlement;
  const current = Math.max(0, Math.round(finite(settlement.population, 0)));
  // Paired source-debit / destination-credit outcomes (a settlement loses people
  // and another gains them) must CONSERVE population even when applied stale — e.g.
  // a parked proposal whose source has since shrunk. The source is the NEGATIVE-delta
  // side: for population_emigration that is targetSaveId, but for flow_migration
  // targetSaveId is the DESTINATION, so key the debit on `delta < 0` (each of these
  // outcomes has exactly one negative side) rather than on targetSaveId. Record how
  // many of the intended departures the depleted source could actually supply, then
  // scale the paired credit by that realized fraction so Σcredits ≤ people who left.
  // Requires source-first apply order (which the emigration guard already relies on
  // and worldPulseFlowMigrationConservation.test pins for flow_migration).
  if (outcome.candidateType === 'population_emigration' || outcome.candidateType === 'flow_migration') {
    if (delta < 0) {
      const debit = Math.abs(Math.round(delta));
      const realized = Math.min(debit, current);
      migrationRealizedFraction.set(outcome, debit > 0 ? realized / debit : 1);
      delta = -realized;
    } else if (delta > 0) {
      const fraction = migrationRealizedFraction.get(outcome);
      if (fraction != null && fraction < 1) delta = Math.floor(delta * fraction);
    }
    if (!delta) return settlement; // fully-stale debit/credit — no phantom history entry
  }
  const nextPopulation = Math.max(0, current + Math.round(delta));
  return {
    ...settlement,
    population: nextPopulation,
    populationHistory: [
      ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
      {
        tick: outcome.generatedAtTick || outcome.tick || null,
        delta,
        population: nextPopulation,
        reason: outcome.headline || outcome.candidateType,
        outcomeId: outcome.id,
      },
    ],
  };
}
