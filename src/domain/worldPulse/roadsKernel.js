/**
 * roadsKernel.js — THE ROADS (owner commission, ENGINE LIFT #5: named-NPC travel · capture
 * · ransom · conversion; DESIGN_THE_ROADS.md is binding law). Slices R-1b (flag + seam) and
 * R-2 (mission genesis + routing + the journey).
 *
 * THE MOVER SEAM (§1 law 10): a lazy leaf that NAME-SWAPS the pulse chain
 * (advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions → …AndTraditionsAndRoads),
 * running LAST over the fully-settled tick so it reads THIS tick's traditions windows
 * (observances) and armies/embattlement (routing/hazards). DORMANT behind roadsEnabled AND
 * the spatial-canon gate ⇒ byte-identical (the roads dormancy golden proves it).
 *
 * WHAT R-2 OWNS: mission GENESIS (borrowed-purpose scan · tick-invariant world-seed cadence ·
 * importance-inverse selection · the KNOWN-view route choice · dispatch refusal) and the
 * JOURNEY (per-tick legs/arrival/return · the whereabouts mirror · the prune/DM-collision
 * pass · departure/return prose + news). THE GAUNTLET (hazards/capture) is R-3; CAPTIVITY
 * (ransom/conversion) is R-4 — this file grows into those seams.
 *
 * THE CLOCKS (verified against advanceInterval.js:83 — "N weeks is N kernel calls, ALWAYS at
 * one_week granularity"): leg TIMING rides calendar.elapsedWeeks (hopWeeks/stayWeeks are in
 * WEEKS); per-call event forks ride worldState.tick (incrementing +1 per kernel call). A
 * collapsed catch-up runs at one-week granularity ⇒ back-to-back calls === serial calls
 * (catch-up equivalence, §19). The YEARLY cadence forks a tick-invariant WORLD seed so
 * collapsed catch-up never shifts who travels (§1 law 9). Fork labels are LOAD-BEARING.
 *
 * SINGLE-WRITER + WRITE-BOUNDED (§1 law 6): writes ONLY spatialLedgers.roads, the
 * npc.whereabouts mirror (settlementUpdates), publicLegitimacy.score / prosperity band-steps
 * (the applicator idioms, R-3/R-4), wizardNews, and the returned-captive channel (R-4).
 * NEVER faction.power, NEVER ladder standing. NO RESIDUE_STRIP_SITES entry.
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf, imported ONLY from the lazy pulse engine.
 *
 * @enforced-by tests/property/roadsDormancyGolden.test.js + tests/domain/roadsKernel.test.js
 */
import { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions } from './traditionsKernel.js';
import {
  roadsActive, ROADS_TUNING, isOffStage, roadsImportanceWeight, riskToleranceOf,
  militaryQuality01, asObject, num, clampNum, clamp01, cmp,
} from '../roads/state.js';
import { knownEmbattlementView } from '../roads/knownWorld.js';
import {
  getSpatialLedger, setSpatialLedger, dropSpatialLedger, activeSpatialDigest, hopWeeks,
} from '../spatial/distanceRead.js';
import { chooseRoute } from '../spatial/embattlement.js';
import { tradeNeighbours } from '../spatial/rumorNetwork.js';
import { seasonForTick } from './worldState.js';
import { createPRNG } from '../../kernel/prng.js';
import { pickLine } from './eventProse.js';
import { ROADS_NEWS } from '../../data/roadsProse.js';
import { npcId } from './npcAgency.js';
import { readinessOf, experienceOf } from './martialReadiness.js';
import { militaryCapacityScalar } from './militaryStrength.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { ladderGoalOf } from '../townMap/ladderRead.js';
import { npcLadderActive } from './npcLadderKernel.js';

/**
 * @typedef {Object} RoadsAdvanceResult
 * @property {Array<Record<string, unknown>>} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/** @param {unknown} v @returns {string} */
function str(v) { return v == null ? '' : String(v); }

// ── read helpers (category / relationship / war damper) ────────────────────────
/** @param {unknown} npc @returns {string} */
function categoryOf(npc) { return String(asObject(npc).category || '').toLowerCase(); }
const TRADE_CATEGORY = /(econom|merch|trade)/;
const DIPLO_CATEGORY = /(govern|noble)/;

/**
 * The relationship rung between two settlements (graph edge relationshipType, falling back
 * to worldState.relationshipStates) — 'rival'|'cold_war'|'hostile'|… or ''. Pure.
 * @param {Record<string, unknown>} graph @param {Record<string, unknown>} worldState
 * @param {string} a @param {string} b @returns {string}
 */
function relationshipTypeBetween(graph, worldState, a, b) {
  const A = String(a); const B = String(b);
  const edges = Array.isArray(asObject(graph).edges) ? /** @type {unknown[]} */ (asObject(graph).edges) : [];
  for (const e of edges) {
    const from = str(asObject(e).from); const to = str(asObject(e).to);
    if ((from === A && to === B) || (from === B && to === A)) {
      const rt = String(asObject(e).relationshipType || '');
      if (rt) return rt;
    }
  }
  const rs = asObject(asObject(worldState).relationshipStates);
  for (const key of Object.keys(rs)) {
    if (key.includes(A) && key.includes(B)) {
      const rt = String(asObject(rs[key]).relationshipType || '');
      if (rt) return rt;
    }
  }
  return '';
}

/**
 * The HARD DAMPER (§4): a besieged / occupied / mobilizing settlement sends no envoys. Pure.
 * @param {Record<string, unknown>} worldState @param {Record<string, unknown>} graph @param {string} sid
 * @returns {boolean}
 */
function warDamped(worldState, graph, sid) {
  const occ = asObject(asObject(asObject(worldState).occupations)[sid]);
  if (occ && occ.occupierId) return true; // occupied
  if (warFrontsInto(graph, sid).length) return true; // besieged
  if (warFrontsFrom(graph, sid).length) return true; // mobilized (besieging someone)
  return false;
}

/**
 * Settlements within MAX_JOURNEY_HOPS trade-graph hops of home (BFS), excluding home. Pure.
 * @param {Record<string, unknown>} graph @param {string} homeId @param {number} maxHops
 * @returns {Set<string>}
 */
function tradeReachable(graph, homeId, maxHops) {
  const seen = new Set([String(homeId)]);
  const out = new Set();
  let frontier = [String(homeId)];
  for (let h = 0; h < maxHops; h += 1) {
    const next = [];
    for (const id of frontier) {
      for (const { neighbourId } of tradeNeighbours(graph, id)) {
        const n = String(neighbourId);
        if (!seen.has(n)) { seen.add(n); next.push(n); out.add(n); }
      }
    }
    frontier = next;
  }
  return out;
}

/**
 * The best qualifying OBSERVANCE at a destination this window (grandest town-scale rite
 * whose window opens within hop-time + lead). Pure.
 * @param {unknown[]} destRecs @param {number} weekOfYear @param {number} hopWeeksOut
 * @returns {{ id: string, scaleBand: number, critical: boolean }|null}
 */
function observanceMatch(destRecs, weekOfYear, hopWeeksOut) {
  const recs = Array.isArray(destRecs) ? destRecs : [];
  if (!recs.length) return null;
  const maxScale = recs.reduce((m, r) => Math.max(m, num(asObject(r).scaleBand, 0)), 0);
  let best = null;
  for (const r of recs) {
    const rec = asObject(r);
    if (rec.suppressedBy) continue;
    const scaleBand = num(rec.scaleBand, 0);
    if (scaleBand < ROADS_TUNING.OBSERVANCE_MIN_SCALE_BAND) continue;
    const startWeek = clampNum(num(asObject(rec.window).startWeekOfYear, 1), 1, 52);
    const weeksUntil = (((startWeek - weekOfYear) % 52) + 52) % 52;
    if (weeksUntil <= hopWeeksOut + ROADS_TUNING.OBSERVANCE_LEAD_WEEKS) {
      if (!best || scaleBand > best.scaleBand) best = { id: String(rec.id || ''), scaleBand, critical: scaleBand === maxScale };
    }
  }
  return best;
}

// ── news beats (the traditionBeat idiom; impactKind 'roads') ───────────────────
/**
 * A roads chronicle beat. @param {Object} a
 * @param {string} a.sid @param {number} a.tick @param {string|null} a.now @param {string} a.significance
 * @param {string} a.headline @param {string} a.summary @param {string} a.seed @param {string[]} a.tags
 * @returns {Record<string, unknown>}
 */
function roadsBeat(a) {
  const major = a.significance === 'major';
  return {
    id: `wizard_news.${a.tick}.roads.${a.sid}.${a.seed}`,
    tick: a.tick,
    createdAt: a.now,
    scope: major ? 'regional' : 'local',
    significance: a.significance,
    severity: 0.2,
    score: major ? 52 : a.significance === 'notable' ? 42 : 34,
    headline: a.headline,
    summary: a.summary,
    kind: 'applied',
    impactKind: 'roads',
    channelType: 'settlement',
    settlementIds: [a.sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: a.seed,
    tags: ['world_pulse', 'roads', ...(a.tags || [])],
    reasons: a.tags && a.tags.length ? [`A roads ${a.tags[0]} beat (${a.significance}).`] : [],
  };
}

/** Deterministic weighted sample WITHOUT replacement (codepoint-stable input assumed). Pure.
 * @template T @param {Array<{ w: number, v: T }>} items @param {number} count @param {ReturnType<typeof createPRNG>} rng
 * @returns {T[]} */
function weightedPick(items, count, rng) {
  const pool = items.slice();
  const out = [];
  for (let n = 0; n < count && pool.length; n += 1) {
    let total = 0;
    for (const it of pool) total += Math.max(0, it.w);
    if (total <= 0) break;
    let r = rng.random() * total;
    let idx = 0;
    for (; idx < pool.length; idx += 1) { r -= Math.max(0, pool[idx].w); if (r <= 0) break; }
    if (idx >= pool.length) idx = pool.length - 1;
    out.push(pool[idx].v);
    pool.splice(idx, 1);
  }
  return out;
}

/** Sort an object's keys codepoint-stably (byte-stable ledger serialization). Pure.
 * @param {Record<string, unknown>} obj @returns {Record<string, unknown>} */
function sortKeys(obj) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const k of Object.keys(obj).sort(cmp)) out[k] = obj[k];
  return out;
}

/**
 * Estimate a mission's expected-return week (display-only; null while trapped). Pure.
 * @param {Record<string, unknown>} m @param {unknown} digest @param {string|null} season @returns {number|null}
 */
function expectedReturnWeek(m, digest, season) {
  if (m.trappedBySiege) return null;
  const retWeeks = Math.max(1, num(hopWeeks(digest, str(m.destId), str(m.homeId), season), 1));
  if (m.phase === 'returning') return num(m.legArrivalTick, 0);
  if (m.phase === 'visiting') return num(m.legArrivalTick, 0) + retWeeks; // legArrival is the visit-end
  return num(m.legArrivalTick, 0) + num(m.stayWeeks, 1) + retWeeks; // outbound
}

/**
 * Advance the roads layer one pulse. DORMANT (flag absent, or no spatial canon) ⇒ a complete
 * no-op (byte-identical). Deterministic.
 * @param {Record<string, unknown>} args { snapshot, worldState, settlementUpdates, graph, tick, now }
 * @returns {RoadsAdvanceResult}
 */
export function advanceRoads(args) {
  const a = args && typeof args === 'object' ? args : {};
  const worldState = /** @type {Record<string, unknown>} */ (a.worldState || {});
  const updates = Array.isArray(a.settlementUpdates) ? /** @type {Array<Record<string, unknown>>} */ (a.settlementUpdates) : [];
  if (!roadsActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }
  const digest = activeSpatialDigest(worldState);
  if (!digest) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }
  return advanceLitRoads({ ...a, worldState, settlementUpdates: updates, digest });
}

/**
 * The LIT roads advance (never entered dark or aspatial). Per-tick order (§6): prune → advance
 * phases/arrivals → [hazards R-3] → [ransoms R-4] → genesis → mirror + news.
 * @param {Record<string, unknown>} args
 * @returns {RoadsAdvanceResult}
 */
function advanceLitRoads(args) {
  const worldState = /** @type {Record<string, unknown>} */ (args.worldState);
  const settlementUpdates = /** @type {Array<Record<string, unknown>>} */ (args.settlementUpdates);
  const graph = asObject(args.graph);
  const digest = args.digest;
  const now2 = Math.max(0, Math.floor(num(args.tick, 0))); // per-call event-fork counter
  const now = args.now == null ? null : args.now;
  const weekClock = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2); // calendar weeks
  const clock = seasonForTick(weekClock);
  const year = num(clock.year, 1);
  const weekOfYear = num(clock.weekOfYear, 1);
  const season = clock.season;
  const rngSeed = str(asObject(worldState).rngSeed);

  const items = Array.isArray(asObject(args.snapshot).settlements) ? /** @type {Array<Record<string, unknown>>} */ (asObject(args.snapshot).settlements) : [];
  const itemById = new Map(items.map((it) => [str(it.id), it]));
  const orderedIds = items.map((it) => str(it.id)).sort(cmp);
  const idSet = new Set(orderedIds);

  const updateIndex = new Map();
  settlementUpdates.forEach((u, i) => updateIndex.set(str(u.saveId), i));
  /** @param {string} id @returns {Record<string, unknown>|undefined} */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return asObject(settlementUpdates[ui]).settlement ? asObject(asObject(settlementUpdates[ui]).settlement) : undefined;
    const it = itemById.get(String(id));
    return it ? asObject(it.settlement) : undefined;
  };

  // Per-settlement npcKey → { npc, index } (for prune + mirror + eligibility).
  /** @type {Map<string, Map<string, { npc: Record<string, unknown>, index: number }>>} */
  const rosterByS = new Map();
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    const npcs = Array.isArray(asObject(s).npcs) ? /** @type {Array<Record<string, unknown>>} */ (asObject(s).npcs) : [];
    const m = new Map();
    npcs.forEach((npc, index) => m.set(npcId(sid, npc, index), { npc: asObject(npc), index }));
    rosterByS.set(sid, m);
  }

  const priorRoads = asObject(getSpatialLedger(worldState, 'roads'));
  const priorMissions = asObject(priorRoads.missions);
  const priorRansoms = asObject(priorRoads.ransoms); // R-4 — carried through in R-2
  /** @type {Record<string, number>} */
  const cadence = {};
  for (const k of Object.keys(asObject(priorRoads.cadence))) cadence[k] = num(asObject(priorRoads.cadence)[k], 0);

  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];
  /** @type {Record<string, Record<string, unknown>>} the surviving/advanced missions */
  const missions = {};

  // ── PASS 0: PRUNE (roster/DM collisions §3) + PASS 1: ADVANCE (§6) ──
  for (const mid of Object.keys(priorMissions).sort(cmp)) {
    const m0 = asObject(priorMissions[mid]);
    const homeId = str(m0.homeId);
    const npcKey = str(m0.npcKey);
    // Home vanished ⇒ prune (drop). NPC vanished ⇒ prune. DM shelved (stasis) ⇒ cancel.
    if (!idSet.has(homeId)) continue;
    const roster = rosterByS.get(homeId);
    const hit = roster ? roster.get(npcKey) : undefined;
    if (!hit) continue; // npc removed by DM (remove_npc) ⇒ mission pruned, cadence pruned below
    if (isOffStage(hit.npc)) continue; // DM stasis-npc overtook the traveler ⇒ CANCEL (quiet, no roll)

    const m = { ...m0 };
    if (m.phase === 'outbound' && weekClock >= num(m.legArrivalTick, 0)) {
      m.phase = 'visiting';
      m.legArrivalTick = num(m.legArrivalTick, 0) + Math.max(1, num(m.stayWeeks, 1)); // visit-end week
    } else if (m.phase === 'visiting' && !m.trappedBySiege && weekClock >= num(m.legArrivalTick, 0)) {
      const retWeeks = Math.max(1, num(hopWeeks(digest, str(m.destId), homeId, season), 1));
      m.phase = 'returning';
      m.legArrivalTick = weekClock + retWeeks;
    } else if (m.phase === 'returning' && weekClock >= num(m.legArrivalTick, 0)) {
      // ARRIVE HOME — resolve: drop the mission, mint the return beat, mirror cleared below.
      const s = freshSettlement(homeId);
      const seed = `return.${mid}`;
      newsEntries.push(roadsBeat({
        sid: homeId, tick: now2, now, significance: 'notable',
        headline: pickLine(ROADS_NEWS.return.headline, seed, { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: str(m.destId) }),
        summary: pickLine(ROADS_NEWS.return.summary, seed, { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: str(m.destId) }),
        seed, tags: ['return'],
      }));
      continue;
    }
    missions[mid] = m;
  }

  // A live-npcKey set for cadence pruning (drop cadence stamps for vanished NPCs).
  const liveKeys = new Set();
  for (const roster of rosterByS.values()) for (const k of roster.keys()) liveKeys.add(k);
  for (const k of Object.keys(cadence)) if (!liveKeys.has(k)) delete cadence[k];

  // npcKeys currently away (have a surviving mission) — excluded from genesis.
  const awayKeys = new Set(Object.values(missions).map((m) => str(asObject(m).npcKey)));
  const abroadByHome = new Map();
  for (const m of Object.values(missions)) {
    const h = str(asObject(m).homeId);
    abroadByHome.set(h, (abroadByHome.get(h) || 0) + 1);
  }

  // ── PASS 5: GENESIS (§4) ──
  const priorTraditions = asObject(getSpatialLedger(worldState, 'traditions'));
  const ladderLit = npcLadderActive(worldState);
  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) continue;
    if (warDamped(worldState, graph, sid)) continue;
    const slots = ROADS_TUNING.ABROAD_CAP - (abroadByHome.get(sid) || 0);
    if (slots <= 0) continue;

    const reachable = tradeReachable(graph, sid, ROADS_TUNING.MAX_JOURNEY_HOPS);
    /** @type {Array<{ dest: string, hopWeeksOut: number }>} */
    const inRange = [];
    for (const dest of [...reachable].sort(cmp)) {
      if (!idSet.has(dest)) continue;
      const hw = num(hopWeeks(digest, sid, dest, season), 0);
      if (hw >= 1 && hw <= ROADS_TUNING.MAX_HOP_WEEKS) inRange.push({ dest, hopWeeksOut: hw });
    }
    if (!inRange.length) continue;

    const knownView = knownEmbattlementView(worldState, sid);
    const roster = rosterByS.get(sid) || new Map();

    /** @type {Array<{ npcKey: string, npc: Record<string, unknown>, w: number, weight: number, dest: string, purpose: { kind: string, ref: string }, major: boolean, hopWeeksOut: number }>} */
    const candidates = [];
    for (const [npcKey, { npc }] of [...roster.entries()].sort((x, y) => cmp(x[0], y[0]))) {
      if (isOffStage(npc)) continue; // stasis / hostage
      if (awayKeys.has(npcKey)) continue; // already abroad
      const w = roadsImportanceWeight(npc);
      if (w < ROADS_TUNING.MIN_TRAVEL_WEIGHT) continue; // minor/nameless never travel
      if (num(cadence[npcKey], -Infinity) >= year) continue; // already travelled this year
      // The tick-invariant world-seed cadence draw (§1 law 9): fires JOURNEY_CHANCE/NPC-year.
      const fork = createPRNG(`${rngSeed}::roads:cadence:${npcKey}:${year}`);
      const r1 = fork.random();
      const r2 = fork.random();
      if (r1 >= ROADS_TUNING.JOURNEY_CHANCE) continue; // won't travel this year (idempotent)
      const departWeekTarget = 1 + Math.floor(r2 * 51);
      if (weekOfYear < departWeekTarget) continue; // spread across the year; not yet time

      // BORROWED-PURPOSE scan (first match): observance → trade → diplomacy → ladder.
      let purpose = null; let dest = ''; let major = false; let hopWeeksOut = 1; let fullWeight = false;
      for (const cand of inRange) {
        const obs = observanceMatch(priorTraditions[cand.dest], weekOfYear, cand.hopWeeksOut);
        if (obs) { purpose = { kind: 'observance', ref: obs.id }; dest = cand.dest; hopWeeksOut = cand.hopWeeksOut; major = obs.critical; fullWeight = obs.critical; break; }
      }
      if (!purpose && TRADE_CATEGORY.test(categoryOf(npc))) {
        const direct = new Set(tradeNeighbours(graph, sid).map((n) => String(n.neighbourId)));
        const hit = inRange.find((c) => direct.has(c.dest));
        if (hit) { purpose = { kind: 'trade', ref: hit.dest }; dest = hit.dest; hopWeeksOut = hit.hopWeeksOut; }
      }
      if (!purpose && DIPLO_CATEGORY.test(categoryOf(npc))) {
        const hit = inRange.find((c) => {
          const rt = relationshipTypeBetween(graph, worldState, sid, c.dest);
          return rt === 'rival' || rt === 'cold_war'; // hostile = open war ⇒ no envoy
        });
        if (hit) { purpose = { kind: 'diplomacy', ref: `${sid}~${hit.dest}` }; dest = hit.dest; hopWeeksOut = hit.hopWeeksOut; }
      }
      if (!purpose && ladderLit) {
        const goal = ladderGoalOf(/** @type {{ npcLadder?: unknown }} */ (s), npcKey);
        if (goal && goal.goal) { purpose = { kind: 'ladder', ref: goal.goal }; dest = inRange[0].dest; hopWeeksOut = inRange[0].hopWeeksOut; fullWeight = true; }
      }
      if (!purpose) continue;

      const weight = fullWeight ? 1.0 : clampNum(ROADS_TUNING.DRAW_WEIGHT_BASE - w, 0.05, 1.15);
      candidates.push({ npcKey, npc, w, weight, dest, purpose, major, hopWeeksOut });
    }
    if (!candidates.length) continue;

    const selFork = createPRNG(`${rngSeed}::roads-genesis:${sid}:${now2}`);
    const picked = weightedPick(candidates.map((c) => ({ w: c.weight, v: c })), slots, selFork);
    for (const c of picked) {
      const riskTolerance = riskToleranceOf(c.npc);
      const route = chooseRoute(digest, knownView, sid, c.dest, riskTolerance, season);
      if (!route || !Array.isArray(route.path) || route.path.length < 2) continue; // unreachable in the believed view
      const believedDanger = num(route.danger, 0);
      // DISPATCH REFUSAL (§5): a cautious court, believing the road unsafe, stays home.
      if (believedDanger > riskTolerance * ROADS_TUNING.DANGER_REFUSAL_CEILING) {
        cadence[c.npcKey] = year; // the year is spent — the refusal receipt
        continue;
      }
      const legWeeks = Math.max(1, num(hopWeeks(digest, sid, c.dest, season), 1));
      const stayFork = createPRNG(`${rngSeed}::roads:stay:${sid}:${c.npcKey}:${year}`);
      const stayWeeks = ROADS_TUNING.STAY_BASE_WEEKS + Math.round(stayFork.random());
      const escort01 = militaryQuality01({
        readiness01: readinessOf(/** @type {never} */ (s)),
        experience01: experienceOf(/** @type {never} */ (s)),
        capacityBand01: militaryCapacityScalar(s),
      });
      const missionId = `road.${sid}.${c.npcKey}.${weekClock}`;
      missions[missionId] = {
        id: missionId, npcKey: c.npcKey, npcName: str(c.npc.name || c.npcKey),
        homeId: sid, destId: c.dest, purpose: c.purpose, phase: 'outbound',
        path: route.path.slice(), departTick: weekClock, legArrivalTick: weekClock + legWeeks,
        stayWeeks, escort01, riskTolerance01: riskTolerance, knownDangerAtDispatch: believedDanger,
        trappedBySiege: false, startedYear: year,
      };
      cadence[c.npcKey] = year;
      abroadByHome.set(sid, (abroadByHome.get(sid) || 0) + 1);
      awayKeys.add(c.npcKey);

      const pillar = c.w >= ROADS_TUNING.PILLAR_WEIGHT;
      const significance = (pillar || c.major) ? 'notable' : 'minor';
      const seed = `depart.${missionId}`;
      const interp = { npc: str(c.npc.name || c.npcKey), home: str(asObject(s).name || sid), dest: c.dest, purpose: c.purpose.kind };
      newsEntries.push(roadsBeat({
        sid, tick: now2, now, significance,
        headline: pickLine(ROADS_NEWS.departure.headline, seed, interp),
        summary: pickLine(ROADS_NEWS.departure.summary, seed, interp),
        seed, tags: ['departure'],
      }));
    }
  }

  // ── PASS 6: MIRROR (self-healing projection) + persist + news ──
  /** @type {Map<string, Record<string, unknown>>} npcKey → whereabouts */
  const desired = new Map();
  for (const m of Object.values(missions)) {
    const mm = asObject(m);
    const state = mm.phase === 'outbound' ? 'traveling' : String(mm.phase);
    desired.set(str(mm.npcKey), {
      state, placeId: str(mm.destId), purposeKind: str(asObject(mm.purpose).kind),
      sinceTick: num(mm.departTick, 0), expectedReturnTick: expectedReturnWeek(mm, digest, season), missionId: str(mm.id),
    });
  }

  let nextUpdates = settlementUpdates;
  let cloned = false;
  for (const sid of orderedIds) {
    const roster = rosterByS.get(sid);
    if (!roster || !roster.size) continue;
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    const s = freshSettlement(sid);
    const npcs = Array.isArray(asObject(s).npcs) ? /** @type {Array<Record<string, unknown>>} */ (asObject(s).npcs) : [];
    let npcsChanged = false;
    const nextNpcs = npcs.map((npc, index) => {
      const key = npcId(sid, npc, index);
      const want = desired.get(key) || null;
      const cur = asObject(npc).whereabouts || null;
      const same = JSON.stringify(cur ?? null) === JSON.stringify(want ?? null);
      if (same) return npc;
      npcsChanged = true;
      if (want == null) {
        const rest = { ...asObject(npc) };
        delete rest.whereabouts;
        return rest;
      }
      return { ...asObject(npc), whereabouts: want };
    });
    if (!npcsChanged) continue;
    if (!cloned) { nextUpdates = settlementUpdates.slice(); cloned = true; }
    nextUpdates[ui] = { ...nextUpdates[ui], settlement: { ...asObject(freshSettlement(sid)), npcs: nextNpcs } };
  }

  // ── PERSIST the sidecar (drop-when-empty; codepoint-sorted, byte-stable) ──
  let nextWorldState = worldState;
  let changed = cloned || newsEntries.length > 0;
  const persisted = {};
  if (Object.keys(missions).length) persisted.missions = sortKeys(missions);
  if (Object.keys(priorRansoms).length) persisted.ransoms = sortKeys(priorRansoms);
  if (Object.keys(cadence).length) persisted.cadence = sortKeys(cadence);
  const prevSerialized = JSON.stringify(Object.keys(priorRoads).length ? priorRoads : null);
  const nextSerialized = JSON.stringify(Object.keys(persisted).length ? persisted : null);
  if (prevSerialized !== nextSerialized) {
    nextWorldState = Object.keys(persisted).length
      ? setSpatialLedger(nextWorldState, 'roads', persisted)
      : dropSpatialLedger(nextWorldState, 'roads');
    changed = true;
  }

  return { settlementUpdates: nextUpdates, worldState: nextWorldState, changed, newsEntries };
}

// ── THE PULSE SEAM — the traditions chain composed with the roads mover ─────────
/**
 * The growth+fabric+consequence+ladder+traditions chain composed with the roads mover: roads
 * LAST over the fully-settled tick. pulseKernel calls THIS in place of
 * advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions (a name swap). Roads dark/
 * aspatial ⇒ an exact no-op inside the composition. No cycle: this leaf imports the traditions
 * kernel; none import back.
 * @param {Parameters<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions>[0]} args
 * @returns {ReturnType<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions>}
 */
export function advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads(args) {
  const prior = advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions(args);
  const roads = advanceRoads({
    snapshot: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).snapshot,
    worldState: prior.worldState,
    settlementUpdates: prior.settlementUpdates,
    graph: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).graph,
    tick: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).tick,
    now: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).now,
  });
  if (!roads.changed) return prior;
  return {
    settlementUpdates: /** @type {typeof prior.settlementUpdates} */ (/** @type {unknown} */ (roads.settlementUpdates)),
    worldState: roads.worldState,
    changed: prior.changed || roads.changed,
    newsEntries: [...prior.newsEntries, ...roads.newsEntries],
  };
}
