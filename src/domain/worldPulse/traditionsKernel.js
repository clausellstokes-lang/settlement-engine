/**
 * traditionsKernel.js — THE TRADITIONS (owner commission, ENGINE LIFT #4: culture;
 * DESIGN_TRADITIONS.md is binding law). Slice T-2 — THE MOVER.
 *
 * Owner (one sentence, §0): every settlement carries per-settlement holidays/
 * festivals with a singular ORIGIN that always persists; they occur on the calendar,
 * succeed or fail by a SUCCESS model that depends on economy, and their outcomes feed
 * economy + legitimacy dynamically — a settlement's culture made mechanical.
 *
 * WHAT THIS SLICE OWNS (T-2): the virtual `traditionsEnabled` flag; the tick-time
 * MOVER (a lazy leaf that name-swaps the pulse chain, running LAST over the fully-
 * settled tick); the FIRST-LIT MINT (deriveFoundingTraditions at a settlement's first
 * lit tick — byte-identical to the T-1 view-time preview by construction); the
 * OCCURRENCE engine (weeks are canonical; a window opens once per year; hard stressors
 * or a desperate economy CANCEL it); the SUCCESS model (§4, one tick-invariant world-
 * seed draw); and the WRITE-BOUNDED effects (§5 — prosperity band-step, legitimacy
 * score, deity-flavored faith share, news). Ownership/mutation (T-3), imposition/
 * adoption (T-4), and the surface polish (T-5) are OUT of scope.
 *
 * SINGLE-WRITER LAW (§5/§14 — the constitution of this design): the mover writes ONLY
 *   • its own sidecar `spatialLedgers.traditions` + the compact `settlement.traditions`
 *     display mirror (via settlementUpdates),
 *   • prosperity band-step (the upswing applicator idiom, reimplemented self-contained),
 *   • publicLegitimacy.score (the applyLegitimacyHits idiom, reimplemented self-contained),
 *   • a deity-flavored ±1 religionStates share nudge (conservation-preserving),
 *   • wizardNews entries.
 * NOTHING ELSE — no faction.power (deferred seam §16), no new write paths. The review
 * greps this lane's diff against the §14 write list.
 *
 * THE DORMANCY GATE (§12): behind the VIRTUAL `traditionsEnabled` flag (ABSENT from
 * DEFAULT_SIMULATION_RULES — the npcLadder/urbanFabric/spatialConsequence precedent).
 * Absent ⇒ an immediate no-op: zero derivation, zero ledger key, zero mirror, zero
 * news, byte-identical to the pre-wire engine (the traditions dormancy golden proves
 * it). The flag is DARK — it lights at THE ONE REGEN (owner-signed; this lane never
 * lights it; tests light it locally).
 *
 * THE PULSE SEAM (ceiling discipline §12): pulseKernel is at its frozen effective-line
 * ceiling, so this leaf exports
 * advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions — the growth+fabric+
 * consequence+ladder chain composed with the traditions mover (traditions runs LAST).
 * pulseKernel's existing chain import/call is NAME-SWAPPED (the provenanceKernel/ladder
 * idiom — a swap, not a new line).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf — imported ONLY from the lazy pulse engine
 * (pulseKernel, at the mover seam). Never from the first-paint entry closure. The
 * genesis leaf + corpus it pulls already ride the lazy dossier chunk; here they ride
 * the lazy engine chunk.
 *
 * Pure, deterministic, side-effect-free, clock-free. The ONE draw per (tradition, year)
 * is a TICK-INVARIANT fork of the WORLD seed (the seasonalSeverityFor pattern), NEVER
 * the per-tick pulse rng. AGGREGATE culture motion — a settlement's observances hold or
 * fail; never a named soul's fate.
 *
 * @enforced-by tests/property/traditionsDormancyGolden.test.js (dormancy byte-identity
 *   + the lit anti-vacuity block).
 */
import { deriveFoundingTraditions } from '../traditions/genesis.js';
import { createPRNG } from '../../kernel/prng.js';
import { seasonForTick } from './worldState.js';
import { seasonalSeverityFor } from './seasons.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { activeArchetypes } from '../activeConditions.js';
import { ladderInstabilityOf } from '../townMap/ladderRead.js';
import { WAR_STRESSOR_TYPES } from './warStressorTypes.js';
import { advanceNpcGrowthWithFabricAndConsequenceAndLadder } from './npcLadderKernel.js';
import { advancePolitics, routedLegitimacyHit } from '../traditions/politics.js';

/**
 * @typedef {import('../traditions/genesis.js').TraditionRec} TraditionRec
 * @typedef {import('../traditions/genesis.js').TraditionWindow} TraditionWindow
 */

// ── Kernel-local read shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ id?: (string|number), name?: string, tier?: string, population?: number,
 *   economicState?: unknown, powerStructure?: unknown, activeConditions?: unknown,
 *   traditions?: unknown, config?: unknown, _seed?: (string|number),
 *   identity?: { seed?: string }, primaryDeity?: unknown }} TradSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: TradSettlement }} TradSnapItem */
/** @typedef {{ settlements?: TradSnapItem[], byId?: Map<string, unknown> }} TradSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: TradSettlement }} TradUpdate */
/** @typedef {{ type?: string, lifecycleStage?: string, affectedSettlementIds?: unknown }} TradStressor */

/**
 * @typedef {Object} TraditionsAdvanceResult
 * @property {TradUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

// ── narrowing helpers (self-contained; the npcLadderState idiom) ──────────────
/** @param {unknown} x @returns {Record<string, unknown>} */
function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}
/** @param {unknown} x @param {number} d @returns {number} */
function num(x, d) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
function clampNum(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}
/** Codepoint-stable string compare (byte-stable iteration). @param {string} a @param {string} b @returns {number} */
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

// ── THE SIX-OUTCOME VOCABULARY (the tab already renders these labels) ─────────
export const TRADITION_OUTCOME = Object.freeze({
  TRIUMPH: 'triumph', GOOD: 'good', MODEST: 'modest',
  TROUBLED: 'troubled', FAILURE: 'failure', CANCELLED: 'cancelled',
});

// ── §4/§5 TUNING (soak-certified dials; every entry vetoable) ──────────────────
const TRAD_TUNING = Object.freeze({
  // §4 success score
  BASE: 0.55,
  // prosperity contribution by prosperityRank 0..6 (Subsistence..Wealthy); Moderate (3) neutral.
  PROSPERITY_BY_RANK: Object.freeze([-0.25, -0.17, -0.08, 0, 0.05, 0.1, 0.15]),
  SEVERITY_PENALTY: -0.12, // drought / hard_winter in the afflicted half-year
  SEVERITY_BONUS: 0.08, // a bountiful year
  LEGIT_MIN: -0.1, LEGIT_MAX: 0.08, // owner-health map over publicLegitimacy.score 0..100
  INSTAB_PENALTY: -0.06, INSTAB_THRESHOLD: 0.5, // ladder churn of the owner faction (T-3+; null-safe)
  WAR_PRESSURE_PENALTY: -0.08, // a milder 'wartime' stressor (siege/occupation CANCEL first)
  SCALE_MISMATCH_PER_STEP: -0.1, // scaleBand above the prosperity-supported band
  STREAK_FAILURE: -0.04, STREAK_TRIUMPH: 0.03, // last year's memory
  SCORE_MIN: 0.05, SCORE_MAX: 0.95,
  // outcome thresholds, relative to the clamped score (lower draw ⇒ better):
  TRIUMPH_OFFSET: -0.25, MODEST_OFFSET: 0.15, TROUBLED_OFFSET: 0.3,
  // §3 skip: a settlement at or below this prosperity rank cancels (desperate economy).
  SKIP_PROSPERITY_RANK_MAX: 0, // Subsistence
  // §5 effects
  PROSPERITY_STEP: Object.freeze({ triumph: 1, failure: -1 }),
  LEGITIMACY_HIT: Object.freeze({ triumph: 3, good: 1, troubled: -1, failure: -3, cancelled: -1 }),
  FAITH_STEP: Object.freeze({ triumph: 1, failure: -1 }),
});

// §3 SKIP CHECK — the hard-stressor archetypes (per-settlement activeConditions) that
// cancel a festival (a town under plague/famine/war/occupation does not celebrate).
const HARD_STRESSOR_ARCHETYPES = new Set(['plague', 'famine', 'war_pressure', 'occupation_burden', 'vassal_extraction']);
// Realm war stressors that CANCEL (the hard war-shapes) vs merely PENALIZE ('wartime').
const CANCEL_STRESSOR_TYPES = new Set(['siege', 'occupation']);
const ACTIVE_STRESSOR_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

// ── THE DORMANCY GATE (constitutional) — a virtual, defensively-read flag ──────
/**
 * Is the traditions layer LIT? Reads simulationRules.traditionsEnabled === true,
 * defensively — ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never entered (byte-identical;
 * NO default in DEFAULT_SIMULATION_RULES, so goldens do not move). Mirrors
 * npcLadderActive. Pure, total.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState
 * @returns {boolean}
 */
export function traditionsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).traditionsEnabled === true);
}

// ── the war-stressor read (§3 skip + §4 war-pressure) ─────────────────────────
/**
 * The set of active war-shaped stressor types (siege/wartime/occupation/betrayal)
 * affecting one settlement this tick, read from the realm-level worldState.stressors.
 * @param {Record<string, unknown>} worldState @param {string} sid @returns {Set<string>}
 */
function warStressorTypesFor(worldState, sid) {
  /** @type {Set<string>} */
  const out = new Set();
  const stressors = Array.isArray(asObject(worldState).stressors) ? /** @type {TradStressor[]} */ (asObject(worldState).stressors) : [];
  for (const raw of stressors) {
    const s = /** @type {TradStressor} */ (asObject(raw));
    const type = String(s.type || '');
    if (!WAR_STRESSOR_TYPES.includes(/** @type {(typeof WAR_STRESSOR_TYPES)[number]} */ (type))) continue;
    if (!ACTIVE_STRESSOR_STAGES.has(String(s.lifecycleStage || 'active'))) continue;
    const ids = Array.isArray(s.affectedSettlementIds) ? s.affectedSettlementIds : [];
    if (ids.some((id) => String(id) === sid)) out.add(type);
  }
  return out;
}

/**
 * §3 SKIP CHECK — should this settlement CANCEL its observances this tick? A hard
 * per-settlement stressor (plague/famine/war/occupation), a hard realm war stressor
 * (siege/occupation), or a desperate economy (prosperity rank ≤ Subsistence). Pure.
 * @param {TradSettlement} settlement @param {Set<string>} warTypes @returns {boolean}
 */
function shouldSkip(settlement, warTypes) {
  for (const arch of activeArchetypes(settlement)) {
    if (HARD_STRESSOR_ARCHETYPES.has(arch)) return true;
  }
  for (const t of warTypes) if (CANCEL_STRESSOR_TYPES.has(t)) return true;
  const cur = asObject(settlement.economicState).prosperity;
  const rank = prosperityRank(typeof cur === 'string' ? cur : String(asObject(cur).tier ?? ''));
  if (rank >= 0 && rank <= TRAD_TUNING.SKIP_PROSPERITY_RANK_MAX) return true;
  return false;
}

// ── §4 THE SUCCESS MODEL ──────────────────────────────────────────────────────
/**
 * The seeded success SCORE for one observance in one year (§4, verbatim). ONE
 * tick-invariant draw is taken by the caller off the WORLD seed; this assembles the
 * weighted score the draw is tested against. Pure.
 * @param {Object} a
 * @param {TraditionRec} a.rec
 * @param {TradSettlement} a.settlement
 * @param {Record<string, unknown>} a.worldState
 * @param {string} a.sid
 * @param {number} a.year
 * @param {Set<string>} a.warTypes
 * @returns {number}
 */
export function successScore(a) {
  const { rec, settlement, worldState, sid, year, warTypes } = a;
  const T = TRAD_TUNING;
  let score = T.BASE;

  // prosperity (via prosperityRank ONLY — never a string match).
  const cur = asObject(settlement.economicState).prosperity;
  const pRank = prosperityRank(typeof cur === 'string' ? cur : String(asObject(cur).tier ?? ''));
  if (pRank >= 0) score += T.PROSPERITY_BY_RANK[pRank] ?? 0;

  // seasonal severity (tick-invariant world-seed fork), afflicting the window's half-year.
  const severity = seasonalSeverityFor(String(asObject(worldState).rngSeed || ''), year, sid);
  const startWeek = clampNum(num(asObject(rec.window).startWeekOfYear, 1), 1, 52);
  const warmHalf = startWeek <= 26; // spring+summer weeks 1..26
  if (severity === 'bountiful') score += T.SEVERITY_BONUS;
  else if (severity === 'drought' && warmHalf) score += T.SEVERITY_PENALTY;
  else if (severity === 'hard_winter' && !warmHalf) score += T.SEVERITY_PENALTY;

  // owner health — publicLegitimacy.score (legacy bare-number shape guarded). Until T-3
  // assigns ownership, the seat's publicLegitimacy IS the owner health (the interim rule).
  const plRaw = asObject(asObject(settlement.powerStructure).publicLegitimacy);
  if (Number.isFinite(Number(plRaw.score))) {
    const s01 = clampNum(Number(plRaw.score) / 100, 0, 1);
    score += T.LEGIT_MIN + s01 * (T.LEGIT_MAX - T.LEGIT_MIN);
  }
  // owner-faction ladder churn (null-safe; ownerKey is null until T-3 ⇒ 0 by construction,
  // lights automatically when ownership lands — design §4).
  if (rec.ownerKey) {
    const instab = ladderInstabilityOf(/** @type {{ npcLadder?: unknown }} */ (settlement), String(rec.ownerKey));
    if (instab > T.INSTAB_THRESHOLD) score += T.INSTAB_PENALTY;
  }

  // war pressure — a milder 'wartime' stressor (siege/occupation already CANCELLED upstream).
  if (warTypes.has('wartime')) score += T.WAR_PRESSURE_PENALTY;

  // scale-vs-means mismatch — a grand observance beyond the prosperity-supported band.
  if (pRank >= 0 && rec.scaleBand > pRank) score += T.SCALE_MISMATCH_PER_STEP * (rec.scaleBand - pRank);

  // streak — last year's memory.
  if (rec.lastOutcome === TRADITION_OUTCOME.FAILURE) score += T.STREAK_FAILURE;
  else if (rec.lastOutcome === TRADITION_OUTCOME.TRIUMPH) score += T.STREAK_TRIUMPH;

  return clampNum(score, T.SCORE_MIN, T.SCORE_MAX);
}

/**
 * Map a clamped score + a uniform draw to one of the five held outcomes (§4). A LOWER
 * draw is a better festival. Pure.
 * @param {number} score @param {number} r @returns {string}
 */
export function outcomeForDraw(score, r) {
  const T = TRAD_TUNING;
  if (r < score + T.TRIUMPH_OFFSET) return TRADITION_OUTCOME.TRIUMPH;
  if (r < score) return TRADITION_OUTCOME.GOOD;
  if (r < score + T.MODEST_OFFSET) return TRADITION_OUTCOME.MODEST;
  if (r < score + T.TROUBLED_OFFSET) return TRADITION_OUTCOME.TROUBLED;
  return TRADITION_OUTCOME.FAILURE;
}

// ── §3 OCCURRENCE — the calendar window test ──────────────────────────────────
/**
 * Is this week within the observance window (1-based weeks; a two-week window may end
 * at 53, harmlessly clamped — the year-end spill re-fires next year via the lastHeldYear
 * guard). Pure.
 * @param {number} weekOfYear @param {TraditionWindow} window @returns {boolean}
 */
function inWindow(weekOfYear, window) {
  const start = clampNum(num(asObject(window).startWeekOfYear, 1), 1, 52);
  const weeks = clampNum(num(asObject(window).weeks, 1), 1, 2);
  return weekOfYear >= start && weekOfYear <= start + weeks - 1;
}

// ── §5 write applicators (self-contained; the crack-mover reimplementation idiom) ──
/**
 * Apply prosperity BAND-STEP deltas on the canonical PROSPERITY_TIERS ladder (the
 * upswing applyProsperityDeltasToUpdates idiom, reimplemented so the mover stays self-
 * contained): clamp [0,6], write back IN KIND (string label / {tier} object). Skips an
 * unreadable band. Pure.
 * @param {TradUpdate[]} updates @param {Map<string, number>} index @param {Map<string, number>} deltas
 * @returns {TradUpdate[]}
 */
function applyProsperityBandSteps(updates, index, deltas) {
  if (!deltas.size) return updates;
  let next = updates;
  let cloned = false;
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  for (const [id, delta] of deltas) {
    if (!delta) continue;
    const ui = index.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = asObject(entry && entry.settlement);
    const ec = asObject(settlement.economicState);
    const cur = ec.prosperity;
    const rank = prosperityRank(typeof cur === 'string' ? cur : String(asObject(cur).tier ?? ''));
    if (rank < 0) continue;
    const nextRank = Math.round(clampNum(rank + delta, 0, maxRank));
    if (nextRank === rank) continue;
    const nextLabel = PROSPERITY_TIERS[nextRank];
    const nextProsperity = cur && typeof cur === 'object' && !Array.isArray(cur)
      ? { ...asObject(cur), tier: nextLabel } : nextLabel;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = { ...entry, settlement: { ...settlement, economicState: { ...ec, prosperity: nextProsperity } } };
  }
  return next;
}

/**
 * Apply signed publicLegitimacy.score deltas to snapshot updates (the applyLegitimacyHits
 * idiom, reimplemented self-contained): integer, clamped [0,100], skipping a legacy bare-
 * number / absent legitimacy (Number.isFinite(pl.score) guard). Pure.
 * @param {TradUpdate[]} updates @param {Map<string, number>} index @param {Map<string, number>} hits
 * @returns {TradUpdate[]}
 */
function applyLegitimacySteps(updates, index, hits) {
  if (!hits.size) return updates;
  let next = updates;
  let cloned = false;
  for (const [id, delta] of hits) {
    if (!delta) continue;
    const ui = index.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = asObject(entry && entry.settlement);
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw) ? asObject(plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(clampNum(Number(pl.score) + delta, 0, 100));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = { ...entry, settlement: { ...settlement, powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } } } };
  }
  return next;
}

/**
 * Apply deity-flavored ±1 religionStates share nudges, CONSERVATION-PRESERVING (§5):
 * a triumph/failure of a deity-dedicated observance shifts one share point between the
 * patron deity and the largest OTHER active deity, keeping the active-deity share sum
 * exactly constant (never renorm — which would erase a ±1 nudge on a small pantheon).
 * Only fires where the settlement carries a matching, active (non-suppressed) deity and
 * a partner that can afford the point. Returns the possibly-new religionStates object
 * (same ref when nothing changed). Pure.
 * @param {unknown} religionStates
 * @param {Map<string, Map<string, number>>} bySid  sid → (deityRef → signed ±1)
 * @returns {unknown}
 */
function applyFaithNudges(religionStates, bySid) {
  if (!bySid.size) return religionStates;
  const rs = asObject(religionStates);
  /** @type {Record<string, unknown>} */
  let out = rs;
  let cloned = false;
  for (const [sid, byRef] of bySid) {
    if (!(sid in rs)) continue;
    const state = asObject(rs[sid]);
    const deities = asObject(state.deities);
    /** @type {Record<string, Record<string, unknown>>} a working mutable clone of the deities */
    const work = {};
    for (const k of Object.keys(deities)) work[k] = { ...asObject(deities[k]) };
    /** @param {string} ref @returns {string[]} */
    const activeOthers = (ref) => Object.keys(work)
      .filter((k) => k !== ref && work[k].suppressed !== true && Number.isFinite(Number(work[k].share)))
      .sort((x, y) => (Number(work[y].share) - Number(work[x].share)) || cmp(x, y));
    let touched = false;
    for (const [ref, delta] of byRef) {
      if (!delta || !(ref in work)) continue;
      const tgt = work[ref];
      if (tgt.suppressed === true || !Number.isFinite(Number(tgt.share))) continue;
      const others = activeOthers(ref);
      if (!others.length) continue; // a single-deity pantheon can't conserve a nudge
      const partner = work[others[0]];
      // conservation without clamping: the losing party must be able to afford the point.
      if (delta > 0 && Number(partner.share) < delta) continue;
      if (delta < 0 && Number(tgt.share) < -delta) continue;
      tgt.share = Number(tgt.share) + delta;
      partner.share = Number(partner.share) - delta;
      touched = true;
    }
    if (!touched) continue;
    if (!cloned) { out = { ...rs }; cloned = true; }
    out[sid] = { ...state, deities: work };
  }
  return cloned ? out : religionStates;
}

// ── the tradition beat (house voice) ──────────────────────────────────────────
const OUTCOME_PHRASE = Object.freeze({
  triumph: 'was a triumph', good: 'was well kept', modest: 'was modestly kept',
  troubled: 'passed under a shadow', failure: 'failed', cancelled: 'was set aside',
});

/**
 * A tradition-outcome chronicle beat (a held observance's fortune this year). MAJOR for a
 * triumph/failure of the settlement's grandest observance; NOTABLE otherwise. AGGREGATE
 * culture motion — the town's festival, never a named soul's fate. Pure.
 * @param {Object} a
 * @param {string} a.sid @param {string} a.townName @param {TraditionRec} a.rec
 * @param {string} a.outcome @param {number} a.year @param {number} a.tick @param {string|null} a.now
 * @param {boolean} a.major
 * @returns {Record<string, unknown>}
 */
function traditionBeat(a) {
  const { sid, townName, rec, outcome, year, tick, now, major } = a;
  const phrase = /** @type {Record<string, string>} */ (OUTCOME_PHRASE)[outcome] || 'was held';
  const positive = outcome === TRADITION_OUTCOME.TRIUMPH || outcome === TRADITION_OUTCOME.GOOD;
  // §6 display-side accountability: a faction/institution owner is NAMED (the seat is the
  // town itself, so a seat-owned observance needs no attribution beyond the town).
  const named = (rec.ownerKind === 'faction' || rec.ownerKind === 'institution') && typeof rec.ownerLabel === 'string' && rec.ownerLabel
    ? rec.ownerLabel : null;
  const ownerBit = named ? ` It is kept by ${named}, who answer for its fortune.` : '';
  const headline = outcome === TRADITION_OUTCOME.CANCELLED
    ? `${townName} sets aside ${rec.name}`
    : `${rec.name} ${phrase} in ${townName}`;
  const summary = outcome === TRADITION_OUTCOME.CANCELLED
    ? `In ${townName}, ${rec.name} was set aside this year — hardship left no room for the observance, and a people that keeps its restraint is remembered for it too.${ownerBit}`
    : `In ${townName}, ${rec.name} ${phrase} this year. A settlement's traditions carry its identity forward; each holding — or failing — is a mark on the year.${ownerBit}`;
  const reason = outcome === TRADITION_OUTCOME.CANCELLED
    ? `Cancelled under hard stress or a desperate economy (§3 skip) — no success roll was taken; a mild legitimacy cost fell ${named ? `at half weight on the town (${named} named)` : 'on the seat'}.`
    : `A weighted success roll (§4) resolved to ${outcome}; the outcome fed the settlement's economy and legitimacy${named ? ` at half weight (${named} named)` : ''} through the bounded §5 applicators.`;
  const outcomeId = `tradition.${outcome}.${sid}.${year}`;
  return {
    id: `wizard_news.${tick}.tradition.${sid}.${rec.id}.${year}`,
    tick,
    createdAt: now,
    scope: major ? 'regional' : 'local',
    significance: major ? 'major' : 'notable',
    severity: positive ? 0.3 : outcome === TRADITION_OUTCOME.CANCELLED ? 0.2 : 0.35,
    score: major ? 58 : 42,
    headline,
    summary,
    kind: 'applied',
    impactKind: 'tradition',
    channelType: 'settlement',
    settlementIds: [sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: outcomeId,
    tags: ['world_pulse', 'tradition', outcome],
    reasons: [reason],
  };
}

// ── THE ADVANCE ───────────────────────────────────────────────────────────────
/**
 * Advance the traditions layer one pulse. DORMANT (flag absent) ⇒ a complete no-op
 * (byte-identical). Lit ⇒ mint on first lit tick, resolve occurrences, apply the §5
 * write-bounded effects, project the mirror, narrate. Deterministic; the ONE draw per
 * (tradition, year) is a tick-invariant world-seed fork.
 * @param {Object} args
 * @param {TradSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {TradUpdate[]} args.settlementUpdates
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {TraditionsAdvanceResult}
 */
export function advanceTraditions({ snapshot, worldState, settlementUpdates, tick, now }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No key, no mirror, no news. ──
  if (!traditionsActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }
  return advanceLitTraditions({ snapshot, worldState, settlementUpdates: updates, tick, now });
}

/**
 * The LIT traditions advance (never entered dark).
 * @param {Object} args
 * @param {TradSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {TradUpdate[]} args.settlementUpdates
 * @param {number} args.tick
 * @param {string|null} args.now
 * @returns {TraditionsAdvanceResult}
 */
function advanceLitTraditions({ snapshot, worldState, settlementUpdates, tick, now }) {
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const weeks = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2);
  const clock = seasonForTick(weeks);
  const year = num(clock.year, 1);
  const weekOfYear = num(clock.weekOfYear, 1);

  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  const orderedIds = items.map((it) => String(it.id)).sort(cmp);

  // updates-first freshest settlement read (the ladder idiom).
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  settlementUpdates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  /** @param {string} id @returns {TradSettlement|undefined} */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return settlementUpdates[ui]?.settlement;
    return itemById.get(String(id))?.settlement;
  };

  const priorLedger = asObject(getSpatialLedger(worldState, 'traditions'));
  /** @type {Record<string, TraditionRec[]>} */
  const nextLedger = {};

  // §5 accumulators (applied ONCE after the pass, through the bounded writers).
  /** @type {Map<string, number>} */
  const prosperityDeltas = new Map();
  /** @type {Map<string, number>} */
  const legitimacyHits = new Map();
  /** @type {Map<string, Map<string, number>>} */
  const faithBySid = new Map();
  /** @param {Map<string, number>} m @param {string} k @param {number} d */
  const bump = (m, k, d) => m.set(k, (m.get(k) || 0) + d);

  // ── PASS 1: per live settlement — mint (first lit) or carry; resolve occurrences. ──
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) continue;
    const priorRaw = priorLedger[sid];
    const priorRecs = Array.isArray(priorRaw) ? /** @type {TraditionRec[]} */ (priorRaw) : null;
    // FIRST-LIT MINT: no ledger entry ⇒ derive the founding set (byte-identical to the
    // T-1 view-time preview by construction; foundedYear kept settlement-relative — see
    // the lane report's rebase JUDGMENT). Otherwise carry the persistent set forward.
    const minted = !priorRecs;
    const baseRecs = priorRecs || deriveFoundingTraditions(/** @type {Parameters<typeof deriveFoundingTraditions>[0]} */ (s));
    if (!baseRecs.length) continue;

    // POLITICS (T-3): assign ownership at the first-lit mint; run the reassignment
    // checkpoints + §7 mutations otherwise. Ownership is fresh BEFORE occurrences resolve,
    // so this year's effect routes to the current owner.
    const politics = advancePolitics({ recs: baseRecs, settlement: asObject(s), worldState, sid, year, minted });
    const workRecs = politics.recs;

    const townName = String(itemById.get(sid)?.name || asObject(s).name || sid);
    const maxScale = workRecs.reduce((m, r) => Math.max(m, num(r.scaleBand, 0)), 0);
    const warTypes = warStressorTypesFor(worldState, sid);
    const skip = shouldSkip(s, warTypes);

    // Resolve each observance whose window opened this year (idempotent via lastHeldYear).
    let occurred = false;
    /** @type {TraditionRec[]} */
    const nextRecs = workRecs.map((rec) => {
      const opens = inWindow(weekOfYear, rec.window) && num(rec.lastHeldYear, -Infinity) < year;
      if (!opens) return rec;
      occurred = true;
      let outcome;
      if (skip) {
        outcome = TRADITION_OUTCOME.CANCELLED;
      } else {
        const score = successScore({ rec, settlement: s, worldState, sid, year, warTypes });
        const r = createPRNG(`${String(asObject(worldState).rngSeed || '')}::tradition:${rec.id}:${year}`).random();
        outcome = outcomeForDraw(score, r);
      }
      // §5 EFFECTS (write-bounded; accumulated, applied once below).
      const prospStep = /** @type {Record<string, number>} */ (TRAD_TUNING.PROSPERITY_STEP)[outcome];
      if (prospStep) bump(prosperityDeltas, sid, prospStep);
      // §6 owner-targeted routing: the seat (or an interim unowned record) bears the full
      // legitimacy hit; a faction/institution owner bears half + the news names them.
      const legitHit = /** @type {Record<string, number>} */ (TRAD_TUNING.LEGITIMACY_HIT)[outcome];
      if (legitHit) {
        const routed = routedLegitimacyHit(legitHit, rec.ownerKind);
        if (routed) bump(legitimacyHits, sid, routed);
      }
      const faithStep = /** @type {Record<string, number>} */ (TRAD_TUNING.FAITH_STEP)[outcome];
      if (faithStep && typeof rec.deityRef === 'string' && rec.deityRef) {
        const m = faithBySid.get(sid) || new Map();
        m.set(rec.deityRef, (m.get(rec.deityRef) || 0) + faithStep);
        faithBySid.set(sid, m);
      }
      const major = (outcome === TRADITION_OUTCOME.TRIUMPH || outcome === TRADITION_OUTCOME.FAILURE)
        && num(rec.scaleBand, 0) === maxScale;
      newsEntries.push(traditionBeat({ sid, townName, rec, outcome, year, tick: now2, now, major }));
      // stamp the idempotent record (a new object — never mutate the prior ledger).
      return { ...rec, lastHeldYear: year, lastOutcome: outcome };
    });

    // Changed if freshly minted, a checkpoint reassigned/mutated, or an occurrence stamped
    // a record; a fully-quiet carried set is byte-stable (the prior ledger ref).
    const settlementChanged = minted || politics.changed || occurred;
    if (!settlementChanged) nextLedger[sid] = /** @type {TraditionRec[]} */ (priorRecs); // byte-stable carry
    else nextLedger[sid] = nextRecs;
  }

  // ── PASS 2: mirror the set onto the roster (self-healing projection). ──
  let nextUpdates = settlementUpdates;
  let cloned = false;
  for (const sid of orderedIds) {
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const s = freshSettlement(sid);
    if (!s) continue;
    const desired = nextLedger[sid] || null;
    const current = asObject(s).traditions;
    const same = JSON.stringify(current ?? null) === JSON.stringify(desired ?? null);
    if (same) continue;
    if (!cloned) { nextUpdates = settlementUpdates.slice(); cloned = true; }
    if (desired == null) {
      const rest = { ...asObject(s) };
      delete rest.traditions;
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: /** @type {TradSettlement} */ (rest) };
    } else {
      nextUpdates[ui] = { ...nextUpdates[ui], settlement: { ...s, traditions: desired } };
    }
  }

  // ── §5 apply the bounded writes to the (now-cloned) updates. ──
  const applyIndex = new Map();
  nextUpdates.forEach((u, i) => applyIndex.set(String(u.saveId), i));
  nextUpdates = applyProsperityBandSteps(nextUpdates, applyIndex, prosperityDeltas);
  nextUpdates = applyLegitimacySteps(nextUpdates, applyIndex, legitimacyHits);
  if (nextUpdates !== settlementUpdates) cloned = true;

  // ── PERSIST the sidecar (drop-when-empty) + the faith nudge. Nothing changed ⇒
  //    byte-identical (same refs). ──
  let nextWorldState = worldState;
  let changed = cloned;

  // faith share nudge on religionStates (conservation-preserving; absent ⇒ no-op).
  const nextReligion = applyFaithNudges(asObject(worldState).religionStates, faithBySid);
  if (nextReligion !== asObject(worldState).religionStates && Object.keys(asObject(nextReligion)).length) {
    nextWorldState = { ...nextWorldState, religionStates: nextReligion };
    changed = true;
  }

  /** @type {Record<string, TraditionRec[]>} */
  const persisted = {};
  for (const sid of Object.keys(nextLedger).sort(cmp)) {
    if (nextLedger[sid] && nextLedger[sid].length) persisted[sid] = nextLedger[sid];
  }
  const prevSerialized = JSON.stringify(Object.keys(priorLedger).length ? priorLedger : null);
  const nextSerialized = JSON.stringify(Object.keys(persisted).length ? persisted : null);
  if (prevSerialized !== nextSerialized) {
    nextWorldState = Object.keys(persisted).length
      ? setSpatialLedger(nextWorldState, 'traditions', persisted)
      : dropSpatialLedger(nextWorldState, 'traditions');
    changed = true;
  }
  if (newsEntries.length) changed = true;

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries };
}

// ── THE PULSE SEAM — the ladder chain composed with the traditions mover ──────
/**
 * The growth+fabric+consequence+ladder chain composed with the traditions mover: the
 * ladder-composed chain first, then traditions LAST over the fully-settled tick (it
 * reads the settled outcomes + the fresh ladder/fabric state). pulseKernel calls THIS in
 * place of advanceNpcGrowthWithFabricAndConsequenceAndLadder (a name swap on the existing
 * import/call — zero new effective lines in the ceiling'd file; the ladder/provenanceKernel
 * idiom). Traditions dark ⇒ an exact no-op inside the composition (the prior result passes
 * through byte-identical). No cycle: this leaf imports the ladder kernel; none import back.
 * @param {Parameters<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadder>[0]} args
 * @returns {ReturnType<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadder>}
 */
export function advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions(args) {
  const prior = advanceNpcGrowthWithFabricAndConsequenceAndLadder(args);
  const traditions = advanceTraditions({
    snapshot: /** @type {TradSnapshot} */ (/** @type {unknown} */ (args.snapshot)),
    worldState: prior.worldState,
    settlementUpdates: /** @type {TradUpdate[]} */ (/** @type {unknown} */ (prior.settlementUpdates)),
    tick: args.tick,
    now: args.now,
  });
  if (!traditions.changed) return prior;
  return {
    settlementUpdates: /** @type {typeof prior.settlementUpdates} */ (/** @type {unknown} */ (traditions.settlementUpdates)),
    worldState: traditions.worldState,
    changed: prior.changed || traditions.changed,
    newsEntries: [...prior.newsEntries, ...traditions.newsEntries],
  };
}
