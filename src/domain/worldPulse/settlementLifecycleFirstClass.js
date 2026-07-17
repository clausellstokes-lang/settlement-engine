/**
 * settlementLifecycleFirstClass.js — W-LIFECYCLE: THE FIRST-CLASS LANE
 * (docs/DESIGN_SETTLEMENT_LIFECYCLE.md §2 — terminal death + resettlement).
 *
 * The satellite lane + the shared substrate (gate, tuning, the steading mint,
 * seeded naming) live in settlementLifecycleKernel.js; THIS lazy leaf carries
 * the first-class candidates (evaluateSettlementLifecycle — the candidate-lane
 * evaluator), the ONE writer (applySettlementLifecycleOutcomeToSettlement,
 * wired into applyWorldPulse), and the dwell-bypassing FORCE verbs — all
 * resolving through the SAME shared builders (force ≡ organic by construction).
 *
 * Split from the kernel for the code-quality-7 domain size ratchet (new files
 * hold the 800-effective-line ceiling); same lazy chunk, ZERO eager bytes.
 * Constitution (dormancy / conservation / scarcity / fates / geometry): see the
 * kernel header — every law binds this module identically.
 */

import { clamp01 } from '../../kernel/math.js';
import { POPULATION_RANGES, TIER_ORDER, PROSPERITY_TIERS, prosperityRank, popToTier } from '../../data/constants.js';
import { formatCount } from '../formatNumber.js';
import { stablePart } from './stablePart.js';
import { settlementHasUnderways } from './clandestineFacet.js';
import { normalizeSimulationRules } from './simulationRules.js';
import { authorityFor } from './changeAuthorityPolicy.js';
import { distributeMigrants } from './populationDynamics.js';
import { SETTLEMENT_LIFECYCLE_TUNING, drawSteadingName } from './settlementLifecycleKernel.js';
import { withEventConditionsSynced } from '../activeConditions.js';

/** @typedef {import('./settlementLifecycleKernel.js').LcSettlement} LcSettlement */
/** @typedef {import('./settlementLifecycleKernel.js').LcSnapItem} LcSnapItem */
/** @typedef {import('./settlementLifecycleKernel.js').LcSnapshot} LcSnapshot */
/** @typedef {import('./settlementLifecycleKernel.js').LcPressureIdx} LcPressureIdx */
/** @typedef {import('./settlementLifecycleKernel.js').LcRng} LcRng */

const T = SETTLEMENT_LIFECYCLE_TUNING;

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint comparator. @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
/** @param {unknown} tier @returns {number} */
function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(/** @type {string} */ (tier));
  return idx >= 0 ? idx : TIER_ORDER.indexOf('village');
}
/** @param {LcSettlement|undefined} s @returns {number} prosperity 0..1 (unknown ⇒ mid) */
function prosperity01Of(s) {
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (asObject(s?.economicState).prosperity));
  if (rank < 0) return 0.4;
  return clamp01(rank / Math.max(1, PROSPERITY_TIERS.length - 1));
}
/** @param {LcPressureIdx|null|undefined} pIndex @param {string} id @param {string} kind */
function pressure(pIndex, id, kind) {
  return num(pIndex?.get?.(id, kind)?.score, 0);
}

// ════════════════════════════════════════════════════════════════════════════
// THE FIRST-CLASS LANE (design §2) — terminal death + resettlement.
// ════════════════════════════════════════════════════════════════════════════

/** The remnant grade for a dying settlement — THE SCARCITY LAW (owner verbatim:
 *  "cities or higher that have declined to the point where they are a thorpe and
 *  perished are the only things eligible to become relic ruins"). Read from the
 *  LIVE peakTier at APPLY time (monotone, so a proposal applied late never
 *  under-grades); absent-tolerated backfill = the current tier.
 *  @param {LcSettlement} settlement @returns {'relic_ruin'|'abandoned_site'} */
export function remnantGradeOf(settlement) {
  const current = String(settlement?.tier || settlement?.config?.tier || popToTier(num(settlement?.population, 0)));
  const peak = String(settlement?.config?.peakTier || current);
  return tierRank(peak) >= tierRank('city') ? 'relic_ruin' : 'abandoned_site';
}

/** Is this settlement a remnant (dead — a status, never a deletion)? A loose duck-typed read of
 *  the two status fields — accepts any settlement-shaped object (the r2 economy-upswing-1 movers
 *  call it on their own domain settlement types: Up/Gen/Cal/RD), typed `unknown` and narrowed
 *  in-body so every caller passes without a weak-type clash.
 *  @param {unknown} s @returns {string} the grade, or '' when alive */
export function lifecycleStatusOf(s) {
  const o = /** @type {{ lifecycleStatus?: unknown, config?: { lifecycleStatus?: unknown } }} */ (s);
  return String(o?.lifecycleStatus || o?.config?.lifecycleStatus || '');
}

/** The support read the terminal-decline dwell keys on (mirrors the tier lane's
 *  supportScore weights). @param {LcPressureIdx|null|undefined} pIndex @param {string} id */
function supportOf(pIndex, id) {
  return clamp01(1 - (
    pressure(pIndex, id, 'food') * 0.22
    + pressure(pIndex, id, 'conflict') * 0.24
    + pressure(pIndex, id, 'trade') * 0.2
    + pressure(pIndex, id, 'legitimacy') * 0.2
    + pressure(pIndex, id, 'disease') * 0.14
  ));
}

/** @typedef {{ declineSince?: number, lastDeathCandidateTick?: number }} LcTickMeta */
/** @typedef {Record<string, unknown>} LcCandidate */

// ── THE SHARED OUTCOME BUILDERS (force ≡ organic BY CONSTRUCTION) ──────────────
/**
 * Build the terminal-death outcome. The ONE death path: the organic evaluator
 * (dwell-gated) AND the FORCE_ABANDON verb (dwell-bypassing, DM authority) both
 * call this — identical deltas, identical shed marker, identical writer patch.
 * @param {Object} args
 * @param {LcSnapItem} args.item @param {LcSnapshot} args.snapshot
 * @param {LcPressureIdx|null} args.pIndex @param {number} args.tick
 * @param {boolean} args.spatialActive
 * @param {number} args.dwell @param {number} args.support
 * @param {string} args.applyMode
 * @param {boolean} [args.forced]
 * @returns {LcCandidate}
 */
export function buildTerminalDeathOutcome({ item, snapshot, pIndex, tick, spatialActive, dwell, support, applyMode, forced = false }) {
  const s = item.settlement || {};
  const cid = String(item.id ?? '');
  const name = String(item.name || s.name || cid);
  const pop = Math.max(0, Math.round(num(s.population, 0)));
  const depth = clamp01(1 - support);
  /** @type {Array<{ saveId: string, delta: number, reason: string }>} */
  const populationDeltas = [{
    saveId: cid, delta: -pop,
    reason: 'The last residents leave with the wagons — the settlement dies.',
  }];
  /** @type {Record<string, unknown>} */
  const metadata = { tick, dwell, lifecycle: { residual: pop, forced } };
  if (spatialActive) {
    // M4 realized-debit dispatch: the shed pool the migrationKernel reads
    // POST-APPLY (conservation asserted in dispatchMigrations).
    if (pop > 0) metadata.spatialEmigration = { loss: pop };
  } else if (pop > 0) {
    // Aspatial reconciliation (the calamity-exodus parity): 45% disperse as
    // credited migrants; the remainder is the origin-loss proxy.
    const migrants = Math.max(0, Math.round(pop * T.ASPATIAL_MIGRANT_FRACTION));
    const transfer = distributeMigrants({ sourceId: cid, migrants, snapshot, pressureIdx: pIndex, mode: 'roll', tick });
    for (const d of transfer.deltas) populationDeltas.push({ saveId: String(d.saveId), delta: num(d.delta, 0), reason: String(d.reason || '') });
    metadata.transferMode = transfer.mode;
    metadata.migrants = migrants;
  }
  return {
    id: `candidate.lifecycle.death.${stablePart(cid)}.${tick}`,
    type: 'lifecycle',
    candidateType: 'settlement_terminal_death',
    ruleId: 'settlement_terminal_death',
    ruleFamily: 'lifecycle',
    targetSaveId: item.id,
    severity: clamp01(0.7 + depth * 0.25),
    probability: forced ? 1 : clamp01(T.DEATH_EMIT_P + depth * T.DEATH_DEPTH_WEIGHT),
    applyMode,
    headline: `${name} is dying`,
    summary: forced
      ? `${name} is abandoned by decree; its last ${formatCount(pop)} residents scatter for good.`
      : `${name} has dwelled in terminal decline for ${dwell} ticks; its last ${formatCount(pop)} residents may scatter for good.`,
    reasons: [
      forced
        ? 'FORCE_ABANDON — the DM-authority terminal-death verb (dwell-bypassing; resolves through the organic path).'
        : `Demoted to the ladder's bottom rung and unsupported (support ${support.toFixed(2)}).`,
      forced ? null : `Terminal dwell ${dwell} ≥ ${T.TERMINAL_DWELL} — extended, never sudden.`,
      'The last residents disperse with fates UNRESOLVED — the engine kills no named character, ever.',
    ].filter((r) => r != null).map(String),
    populationDeltas,
    lifecyclePatch: { kind: 'terminal_death', saveId: item.id },
    proposalPayload: { kind: 'settlement_terminal_death', saveId: item.id },
    generatedAtTick: tick,
    metadata,
    conflictTags: [`population:${cid}`, `tier:${cid}`, `lifecycle:${cid}`],
  };
}

/**
 * Build the resettlement outcome (the privileged-birth twin). The organic
 * evaluator AND the FORCE_RESETTLE verb both call this. Settlers are CONSERVED:
 * every credit to the old cell is a receipted debit from a living donor
 * (Σ deltas === 0 exactly); no willing settlers ⇒ null (even forced — the verb
 * surfaces the refusal rather than minting people).
 * @param {Object} args
 * @param {LcSnapItem} args.item @param {LcSnapItem[]} args.donorPool codepoint/prosperity-ranked live donors
 * @param {number} args.tick
 * @param {((k: string) => { random: () => number })|null} args.forkFn
 * @param {string} args.applyMode
 * @param {number} [args.fallow]
 * @param {number} [args.load]
 * @param {boolean} [args.forced]
 * @param {string|null} [args.nameOverride] FORCE dial: freetext name
 * @returns {LcCandidate|null}
 */
export function buildResettleOutcome({ item, donorPool, tick, forkFn, applyMode, fallow = 0, load = 0, forced = false, nameOverride = null }) {
  const s = item.settlement || {};
  const cid = String(item.id ?? '');
  const name = String(item.name || s.name || cid);
  const grade = lifecycleStatusOf(s);
  if (!grade) return null;

  /** @type {Array<{ saveId: string, delta: number, reason: string }>} */
  const donorDebits = [];
  let seed = 0;
  for (const donor of donorPool) {
    if (donorDebits.length >= T.RESETTLE_DONORS || seed >= T.RESETTLE_SEED) break;
    const did = String(donor.id);
    if (did === cid) continue;
    const give = Math.min(
      T.RESETTLE_SEED - seed,
      Math.floor(num(donor.settlement?.population, 0) * T.RESETTLE_DONOR_MAX_FRACTION),
    );
    if (give <= 0) continue;
    seed += give;
    donorDebits.push({ saveId: did, delta: -give, reason: `Families leave to raise a new settlement on the old ${name} site.` });
  }
  if (seed < T.RESETTLE_SEED_MIN) return null; // nobody nearby can spare settlers

  // The rebirth name: a relic ruin's name HALF-RETURNS ("New Thornwall, raised
  // on the old stones"); an abandoned site takes a fresh name from the keyed
  // fork (the old steading's name is forgotten). A FORCE freetext overrides.
  const newName = String(nameOverride || '').trim()
    || (grade === 'relic_ruin'
      ? `New ${name.replace(/^New /, '')}`
      : (forkFn ? drawSteadingName(s.culture, forkFn(`resettle:${cid}:${tick}`)) : `New ${name}`));

  return {
    id: `candidate.lifecycle.resettle.${stablePart(cid)}.${tick}`,
    type: 'lifecycle',
    candidateType: 'settlement_resettled',
    ruleId: 'settlement_resettled',
    ruleFamily: 'lifecycle',
    targetSaveId: item.id,
    severity: clamp01(0.4 + load * 0.3),
    probability: forced ? 1 : clamp01(T.RESETTLE_EMIT_P + load * T.RESETTLE_LOAD_WEIGHT),
    applyMode,
    headline: `Settlers eye the old ${name} site`,
    summary: grade === 'relic_ruin'
      ? `${formatCount(seed)} settlers would raise ${newName} on the old stones — the ruin's glory is not inherited, it is aspired to.`
      : `${formatCount(seed)} settlers would found ${newName} where ${name} once stood.`,
    reasons: [
      forced
        ? 'FORCE_RESETTLE — the DM-authority rebirth verb (fallow-bypassing; resolves through the organic path).'
        : `The site has lain fallow ${fallow > 0 ? fallow : 'since a former age'} — a privileged birth site (${grade.replace(/_/g, ' ')}).`,
      `Willing settlers: ${formatCount(seed)} from ${donorDebits.length} neighbouring settlement${donorDebits.length === 1 ? '' : 's'} (receipted debits — conserved).`,
    ],
    populationDeltas: [
      { saveId: cid, delta: seed, reason: 'Settlers raise a new steading on the old stones.' },
      ...donorDebits,
    ],
    lifecyclePatch: { kind: 'resettle', saveId: item.id, name: newName },
    proposalPayload: { kind: 'settlement_resettled', saveId: item.id, name: newName, fromGrade: grade },
    generatedAtTick: tick,
    metadata: { tick, fallow: fallow > 0 ? fallow : null, donors: donorDebits.length, seed, ...(forced ? { forced } : {}) },
    conflictTags: [`population:${cid}`, `tier:${cid}`, `lifecycle:${cid}`],
  };
}

/**
 * THE CANDIDATE EVALUATOR (the tierResourceDynamics lane) — terminal death for a
 * first-class settlement that demoted to thorp and DWELLED in terminal decline,
 * and resettlement of a remnant. Pure over (worldState, snapshot, pIndex, rng);
 * threads worldState (the decline dwell nests under
 * settlementTickStates[cid].settlementLifecycle, byte-neutral when empty).
 *
 * DORMANCY: `settlementLifecycleEnabled` absent ⇒ early return, worldState
 * UNCHANGED (same reference), zero candidates, zero forks.
 *
 * AUTHORITY: settlement_terminal_death is CAMPAIGN-ALTERING (decisionTier major,
 * the blockade_declared registration pattern) and proposal-gated on
 * majorChangesRequireProposal through authorityFor; settlement_resettled is
 * proposal-gated the same way (a structural roster change is premise-grade).
 *
 * @param {Record<string, unknown>} worldState
 * @param {LcSnapshot} snapshot
 * @param {LcPressureIdx|null} pIndex
 * @param {{ tick?: number, simulationRules?: Record<string, unknown>, spatialActive?: boolean, rng?: LcRng|null }} [context]
 * @returns {{ worldState: Record<string, unknown>, candidates: LcCandidate[] }}
 */
export function evaluateSettlementLifecycle(worldState, snapshot, pIndex, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules
    || /** @type {Record<string, unknown> | undefined} */ (worldState?.simulationRules));
  // THE DORMANCY GATE — virtual flag, absent from DEFAULT_SIMULATION_RULES.
  if (/** @type {Record<string, unknown>} */ (rules).settlementLifecycleEnabled !== true) {
    return { worldState, candidates: [] };
  }

  const tick = Number.isFinite(context.tick) ? Number(context.tick) : Number(worldState?.tick) || 0;
  const spatialActive = context.spatialActive === true;
  const forkFn = context.rng && typeof context.rng.fork === 'function' ? context.rng.fork.bind(context.rng) : null;
  const settlementTickStates = { ...(/** @type {Record<string, Record<string, unknown>>} */ (worldState?.settlementTickStates) || {}) };
  /** @type {LcCandidate[]} */
  const candidates = [];

  // One pending lifecycle proposal per settlement (the pendingTierProposals guard —
  // candidate ids are tick-suffixed, so an unresolved proposal would gain a
  // duplicate every eligible tick).
  const pendingLifecycle = new Set((/** @type {{ proposals?: Array<{ status?: string, outcome?: { lifecyclePatch?: { saveId?: unknown } } }> }} */ (worldState)?.proposals || [])
    .filter((p) => p?.status === 'pending' && p?.outcome?.lifecyclePatch?.saveId != null)
    .map((p) => String(p.outcome?.lifecyclePatch?.saveId)));

  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  // Live (non-remnant) settlements ranked as resettlement DONORS: most prosperous
  // first (prosperity, then population, then codepoint id — deterministic).
  const donorPool = items
    .filter((it) => it.settlement && !lifecycleStatusOf(it.settlement)
      && Math.round(num(it.settlement.population, 0)) >= T.RESETTLE_DONOR_MIN_POP)
    .sort((a, b) => (prosperity01Of(b.settlement) - prosperity01Of(a.settlement))
      || (num(b.settlement?.population, 0) - num(a.settlement?.population, 0))
      || codepoint(String(a.id), String(b.id)));

  for (const item of items) {
    const s = item.settlement || {};
    const cid = String(item.id ?? '');
    const grade = lifecycleStatusOf(s);

    if (grade) {
      // ── RESETTLEMENT (design §2): a remnant is a privileged birth site. ──
      // A dead settlement's decline dwell is spent history — drop the stale
      // sub-key so the tick-state stays sparse (byte-neutral when absent).
      if (settlementTickStates[cid]?.settlementLifecycle) {
        const rest = { ...settlementTickStates[cid] };
        delete rest.settlementLifecycle;
        settlementTickStates[cid] = rest;
      }
      if (pendingLifecycle.has(cid)) continue;
      const diedAt = num(/** @type {{ lifecycleDiedAtTick?: number }} */ (s.config || {}).lifecycleDiedAtTick, NaN);
      // Generation-seeded ancients carry no death tick — always long fallow.
      const fallow = Number.isFinite(diedAt) ? tick - diedAt : T.RESETTLE_MIN_FALLOW;
      if (fallow < T.RESETTLE_MIN_FALLOW) continue;

      // §H load: nearby prosperity + route utility + the remnant's resources.
      const nearbyProsperity = donorPool.length
        ? donorPool.slice(0, T.RESETTLE_DONORS).reduce((sum, d) => sum + prosperity01Of(d.settlement), 0) / Math.min(donorPool.length, T.RESETTLE_DONORS)
        : 0;
      const route = String(s.config?.tradeRouteAccess || 'road');
      const routeUtility = ['crossroads', 'river', 'coastal', 'port'].includes(route) ? 1 : 0.4;
      const resources01 = clamp01((Array.isArray(s.config?.nearbyResources) ? s.config.nearbyResources.length : 0) / 3);
      const load = clamp01(nearbyProsperity * 0.5 + routeUtility * 0.25 + resources01 * 0.25);

      const resettle = buildResettleOutcome({
        item, donorPool, tick, forkFn,
        applyMode: authorityFor(rules, 'settlement_resettled', /** @type {{ majorChangesRequireProposal?: boolean }} */ (rules).majorChangesRequireProposal ? 'proposal' : 'auto'),
        fallow: Number.isFinite(diedAt) ? fallow : 0,
        load,
      });
      if (resettle) candidates.push(resettle);
      continue;
    }

    // ── TERMINAL DEATH (design §2): thorp-tier + extended decline dwell. ──
    const tier = String(s.tier || popToTier(num(s.population, 0)));
    const prior = /** @type {LcTickMeta|null} */ (settlementTickStates[cid]?.settlementLifecycle || null);
    if (tier !== 'thorp') {
      // Recovered above the bottom rung: the dwell clears (drop the sub-key).
      if (prior && settlementTickStates[cid]) {
        const rest = { ...settlementTickStates[cid] };
        delete rest.settlementLifecycle;
        settlementTickStates[cid] = rest;
      }
      continue;
    }
    const pop = Math.max(0, Math.round(num(s.population, 0)));
    const support = supportOf(pIndex, cid);
    const thorpMin = num(/** @type {{ min?: number }} */ ((/** @type {Record<string, unknown>} */ (POPULATION_RANGES)).thorp || {}).min, 8);
    const declining = support <= T.DEATH_SUPPORT_FLOOR || pop < thorpMin;

    /** @type {LcTickMeta} */
    const meta = {};
    if (Number.isFinite(prior?.lastDeathCandidateTick)) meta.lastDeathCandidateTick = num(prior?.lastDeathCandidateTick, 0);
    if (declining) {
      // The decline dwell is a tick STAMP (integer arithmetic — survives the
      // M10b one-interval catch-up collapse).
      const since = Number.isFinite(prior?.declineSince) ? num(prior?.declineSince, tick) : tick;
      meta.declineSince = since;
      const dwell = tick - since;
      const cooled = meta.lastDeathCandidateTick == null
        || (tick - num(meta.lastDeathCandidateTick, 0)) >= T.DEATH_RETRY_COOLDOWN;
      if (dwell >= T.TERMINAL_DWELL && cooled && !pendingLifecycle.has(cid) && pop > 0) {
        meta.lastDeathCandidateTick = tick;
        // CAMPAIGN-ALTERING + proposal-gated: honors majorChangesRequireProposal
        // (the tier_change precedent), forced to proposal under
        // dm_only/recommendations by authorityFor.
        candidates.push(buildTerminalDeathOutcome({
          item, snapshot, pIndex, tick, spatialActive, dwell, support,
          applyMode: authorityFor(rules, 'settlement_terminal_death', /** @type {{ majorChangesRequireProposal?: boolean }} */ (rules).majorChangesRequireProposal ? 'proposal' : 'auto'),
        }));
      }
    }

    // Conditional materialization (byte-neutral when nothing is tracked).
    if (Object.keys(meta).length) {
      settlementTickStates[cid] = { ...(settlementTickStates[cid] || {}), settlementLifecycle: meta };
    } else if (prior && settlementTickStates[cid]) {
      const rest = { ...settlementTickStates[cid] };
      delete rest.settlementLifecycle;
      settlementTickStates[cid] = rest;
    }
  }

  return { worldState: { ...worldState, settlementTickStates }, candidates };
}

// ── THE WRITER (applyWorldPulse.applyOutcomeToSettlement branch) ───────────────
const MAX_CAMPAIGN_HISTORY_EVENTS = 20; // mirrors stressorAftermath's campaign-era cap

/** Append a campaign-era historicalEvents entry (dedup by campaignEventId; the
 *  oldest campaign-era entry is pruned past the cap — generation history never).
 *  @param {LcSettlement} settlement
 *  @param {{ id: string, name: string, type: string, description: string, severity: string }} event
 *  @param {number|null} tick @returns {LcSettlement} */
function withLifecycleHistoryEvent(settlement, event, tick) {
  const history = /** @type {{ historicalEvents?: Array<Record<string, unknown>> }} */ (settlement.history || {});
  const events = Array.isArray(history.historicalEvents) ? history.historicalEvents : [];
  const eventId = `campaign.${event.id}.${tick ?? 0}`;
  if (events.some((e) => e?.campaignEventId === eventId)) return settlement;
  const entry = {
    campaignEventId: eventId, campaignEra: true, tick: tick ?? null, yearsAgo: 0,
    name: event.name, type: event.type, description: event.description,
    severity: event.severity, lastingEffects: [], plotHooks: [], anchored: true,
  };
  const campaignEvents = events.filter((e) => e?.campaignEra);
  let nextEvents = [...events, entry];
  if (campaignEvents.length + 1 > MAX_CAMPAIGN_HISTORY_EVENTS) {
    const oldest = campaignEvents.slice().sort((a, b) => (num(a.tick, 0)) - (num(b.tick, 0)))[0];
    nextEvents = nextEvents.filter((e) => e !== oldest);
  }
  return { ...settlement, history: { ...history, historicalEvents: nextEvents } };
}

/**
 * THE ONE WRITER for first-class lifecycle outcomes (imported by applyWorldPulse —
 * the resourceDynamicsKernel precedent). FORCE ≡ ORGANIC: the stage-3 verbs
 * resolve through THIS same path.
 *
 * TERMINAL DEATH: the entity KEEPS its digest cell — death is a STATUS, never a
 * deletion. Population zeroes (the outcome's populationDeltas carried the
 * receipted debit; this is the exactness backstop), institutions deactivate,
 * live conditions clear, and the status becomes the remnant grade — THE SCARCITY
 * LAW at the writer, from the LIVE peakTier. THE FATES PIN: named NPCs are
 * NEVER removed and NEVER resolved — each record gains only a `dispersed` stamp
 * ("she left with the last wagons"); the roster count is invariant.
 *
 * RESETTLEMENT: a first-class REBIRTH on the old cell (the cell never left):
 * status clears, tier restarts at thorp, peakTier RESTARTS (the ruin's glory is
 * not inherited), the new name dual-writes config.customName + _config (regen-
 * surviving), and the chronicle remembers ("raised on the old stones").
 *
 * Self-contained re-verify (the applyTierOutcomeToSettlement contract):
 * proposals re-apply from the stored outcome, possibly many ticks later — a
 * stale death (the settlement recovered above thorp, or is already a remnant)
 * and a stale rebirth (the site is no longer a remnant) safely no-op.
 *
 * @param {LcSettlement} settlement
 * @param {{ id?: string, lifecyclePatch?: { kind?: string, name?: string }, metadata?: { tick?: number } }} outcome
 * @returns {LcSettlement}
 */
export function applySettlementLifecycleOutcomeToSettlement(settlement, outcome) {
  const patch = outcome?.lifecyclePatch;
  if (!settlement || !patch || !patch.kind) return settlement;
  const tick = Number.isFinite(outcome?.metadata?.tick) ? Number(outcome?.metadata?.tick) : null;
  const name = String(settlement.name || '');

  if (patch.kind === 'terminal_death') {
    if (lifecycleStatusOf(settlement)) return settlement; // already a remnant
    const tier = String(settlement.tier || popToTier(num(settlement.population, 0)));
    if (tier !== 'thorp') return settlement;              // stale — the settlement recovered
    const grade = remnantGradeOf(settlement);             // THE SCARCITY PIN (live peakTier)

    // Institutions clear — deactivated as archaeology, never erased from the record.
    const institutions = (Array.isArray(settlement.institutions) ? settlement.institutions : [])
      .map((inst) => (inst && inst.status !== 'removed'
        ? { ...inst, status: 'removed', _worldPulseInactive: true, worldPulseFate: 'abandoned_with_the_settlement', removedByWorldPulseOutcomeId: outcome.id || null, removedReason: 'The settlement died; its last residents dispersed.' }
        : inst));

    // THE FATES PIN: dispersal stamps only — no record removed, no fate resolved.
    // D6 THE UNDERWAYS (coupling 4 — the escape lane): a dying town with clandestine
    // tunnels disperses its people "through the underways" — a receipt only, never a fate
    // resolution. Absent the facet the note is byte-identical to before.
    const dispersalNote = settlementHasUnderways(settlement)
      ? 'Escaped through the underways — fate unresolved.'
      : 'Left with the last wagons — fate unresolved.';
    const npcs = (Array.isArray(settlement.npcs) ? settlement.npcs : [])
      .map((npc) => (npc && !npc.dispersed
        ? { ...npc, dispersed: true, dispersedAtTick: tick, dispersalNote }
        : npc));

    const residual = Math.max(0, Math.round(num(settlement.population, 0)));
    const config = {
      ...(settlement.config || {}),
      lifecycleStatus: grade,
      ...(tick != null ? { lifecycleDiedAtTick: tick } : {}),
    };
    /** @type {LcSettlement} */
    let next = {
      ...settlement,
      population: 0,
      lifecycleStatus: grade,
      config,
      institutions,
      npcs,
      activeConditions: [],
      ...(residual > 0 ? {
        populationHistory: [
          ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
          { tick, delta: -residual, population: 0, reason: 'The last residents left with the wagons.', outcomeId: outcome.id },
        ],
      } : {}),
      lifecycleHistory: [
        ...(Array.isArray(settlement.lifecycleHistory) ? settlement.lifecycleHistory.slice(-7) : []),
        { event: 'terminal_death', grade, tick, outcomeId: outcome.id || null },
      ],
    };
    if (settlement._config && typeof settlement._config === 'object') {
      next._config = { ...settlement._config, lifecycleStatus: grade, ...(tick != null ? { lifecycleDiedAtTick: tick } : {}) };
    }
    next = withLifecycleHistoryEvent(next, {
      id: `lifecycle_death.${stablePart(name || 'settlement')}`,
      name: grade === 'relic_ruin' ? `The Fall of ${name}` : `The Abandonment of ${name}`,
      type: 'decline',
      description: grade === 'relic_ruin'
        ? `${name} — once a great city — dwindled to a final thorp and died; its stones stand as a relic ruin. The last residents left with the wagons, their fates unresolved.`
        : `${name} dwindled and was abandoned; a quiet site marks where it stood. The last residents left with the wagons, their fates unresolved.`,
      severity: 'major',
    }, tick);
    // Sync the config.eventConditions projection (+ the _config twin) to the now-empty
    // activeConditions (r2 economy-upswing-6): else a full regeneration re-promotes an
    // event-sourced crisis (plague / trade_route_cut) onto the dead remnant. No-op when the
    // settlement carried no event-condition record (byte-identical for the common case).
    next = /** @type {LcSettlement} */ (withEventConditionsSynced(next));
    return next;
  }

  if (patch.kind === 'resettle') {
    const fromGrade = lifecycleStatusOf(settlement);
    if (!fromGrade) return settlement;                    // stale — no remnant here anymore
    const newName = String(patch.name || `New ${name}`);
    const config = { ...(settlement.config || {}) };
    delete config.lifecycleStatus;
    delete config.lifecycleDiedAtTick;
    config.tier = 'thorp';
    config.settType = 'thorp';
    config.peakTier = 'thorp';                            // the glory is aspired to, not inherited
    config.customName = newName;                          // regen-surviving (assembleSettlement reads it)
    /** @type {LcSettlement} */
    let next = { ...settlement, config };
    delete next.lifecycleStatus;
    next.name = newName;
    next.tier = 'thorp';
    next.lifecycleHistory = [
      ...(Array.isArray(settlement.lifecycleHistory) ? settlement.lifecycleHistory.slice(-7) : []),
      { event: 'resettled', fromGrade, formerName: name, tick, outcomeId: outcome.id || null },
    ];
    if (settlement._config && typeof settlement._config === 'object') {
      /** @type {Record<string, unknown>} */
      const raw = { ...settlement._config, peakTier: 'thorp', customName: newName, tier: 'thorp' };
      delete raw.lifecycleStatus;
      delete raw.lifecycleDiedAtTick;
      next._config = raw;
    }
    next = withLifecycleHistoryEvent(next, {
      id: `lifecycle_resettle.${stablePart(newName)}`,
      name: `${newName}, Raised on the Old Stones`,
      type: 'founding',
      description: fromGrade === 'relic_ruin'
        ? `${newName} was founded on the ruin of ${name} — the old stones remember, and the new thorp aspires.`
        : `${newName} was founded where ${name} once stood; the old site lives again.`,
      severity: 'moderate',
    }, tick);
    return next;
  }

  return settlement;
}

/**
 * FORCE_ABANDON — the terminal-death verb (dwell-bypassing, DM authority).
 * Returns the SAME outcome shape the organic evaluator emits (applyMode 'auto',
 * probability 1); the caller threads it through the standard apply path —
 * applyOutcomeToSettlement runs the ONE death writer, and the spatial shed
 * marker rides collectRealizedEmigrationEvents → dispatchMigrations exactly as
 * an organic death does. A remnant or above-thorp target is REFUSED here (and
 * the writer's self-re-verify backstops it).
 * @param {Object} args
 * @param {LcSnapItem} args.item @param {LcSnapshot} args.snapshot
 * @param {LcPressureIdx|null} args.pIndex @param {number} args.tick
 * @param {boolean} args.spatialActive
 * @returns {LcCandidate | { refusal: string }}
 */
export function forceAbandonSettlement({ item, snapshot, pIndex, tick, spatialActive }) {
  const s = item?.settlement || {};
  if (lifecycleStatusOf(s)) return { refusal: 'already a remnant' };
  const tier = String(s.tier || popToTier(num(s.population, 0)));
  if (tier !== 'thorp') return { refusal: 'only a thorp-tier settlement can die — demote it first (the ladder ends where it began)' };
  return buildTerminalDeathOutcome({
    item, snapshot, pIndex, tick, spatialActive,
    dwell: 0, support: supportOf(pIndex, String(item.id ?? '')),
    applyMode: 'auto', forced: true,
  });
}

/**
 * FORCE_RESETTLE — the rebirth verb (fallow-bypassing, DM authority). Returns
 * the SAME outcome shape the organic evaluator emits; settlers stay CONSERVED
 * (receipted donor debits — no willing settlers ⇒ a refusal, never minted
 * people, even under force).
 * @param {Object} args
 * @param {LcSnapItem} args.item @param {LcSnapItem[]} args.donorPool
 * @param {number} args.tick
 * @param {((k: string) => { random: () => number })|null} args.forkFn
 * @param {string|null} [args.name] freetext name (cosmetic dial)
 * @returns {LcCandidate | { refusal: string }}
 */
export function forceResettleSettlement({ item, donorPool, tick, forkFn, name = null }) {
  const s = item?.settlement || {};
  if (!lifecycleStatusOf(s)) return { refusal: 'no remnant here — the site is alive' };
  const outcome = buildResettleOutcome({
    item, donorPool, tick, forkFn, applyMode: 'auto', forced: true, nameOverride: name,
  });
  if (!outcome) return { refusal: 'no neighbouring settlement can spare willing settlers' };
  return outcome;
}

// ── The affordance-manifest ENTRIES (registrable shape; NOT added to the
// AFFORDANCE_MANIFEST — that registration rides W-COMPOSER-2, with every other
// parked realm verb). Mirrors forceCalamityEntry's factory shape. Pure. ──
/** @returns {Record<string, unknown>} */
export function forceAbandonEntry() {
  return Object.freeze({
    type: 'FORCE_ABANDON', family: 'Realm', scope: 'settlement', authority: 'dm_direct',
    targetsFrom: null, entityKind: 'settlement', coversVetoCodes: [],
    dials: [],
    // Only a thorp-tier, non-remnant settlement can die (the ladder ends where it began).
    predicate: () => ({ available: true, reasons: [], unlocks: [] }),
  });
}
/** @returns {Record<string, unknown>} */
export function forceResettleEntry() {
  return Object.freeze({
    type: 'FORCE_RESETTLE', family: 'Realm', scope: 'settlement', authority: 'dm_direct',
    targetsFrom: null, entityKind: 'settlement', coversVetoCodes: [],
    dials: [
      { key: 'name', kind: 'text', default: '', clampAtCommit: false, label: 'New settlement name (optional)' },
    ],
    predicate: () => ({ available: true, reasons: [], unlocks: [] }),
  });
}
