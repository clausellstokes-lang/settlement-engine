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
  militaryQuality01, settlementWeight01, protectionOf, exposureOf, captureProbability, termWeeksFor,
  conversionFlawFactor, conversionProbability, applyLegitimacySteps, applyProsperityBandSteps,
  asObject, num, clampNum, clamp01, cmp, consumeMissionRecall, captureCauseId,
} from '../roads/state.js';
import { knownEmbattlementView } from '../roads/knownWorld.js';
import { persistEmbassySuits } from '../roads/embassyLedger.js';
import {
  relationshipTypeBetween, atOpenWar, atWarWith, isEmbassy, embassyEnvoyMetrics, evaluateEmbassyHazard,
} from '../roads/embassyHazard.js';
import { findVerifyPlan, boostHomeRumorFidelity } from '../roads/verification.js';
import {
  getSpatialLedger, setSpatialLedger, dropSpatialLedger, activeSpatialDigest, hopWeeks,
} from '../spatial/distanceRead.js';
import { chooseRoute, embattlementLevel } from '../spatial/embattlement.js';
import { currentRegion } from '../spatial/armyTransit.js';
import { tradeNeighbours, RUMOR_NOTABLE_SCORE_FLOOR } from '../spatial/rumorNetwork.js';
import { seasonForTick } from './worldState.js';
import { createPRNG } from '../../kernel/prng.js';
import { pickLine } from './eventProse.js';
import { ROADS_NEWS, thirdPartyRansomPool } from '../../data/roadsProse.js';
import { npcId } from './npcAgency.js';
import { readinessOf, experienceOf } from './martialReadiness.js';
import { militaryCapacityScalar } from './militaryStrength.js';
import { warFrontsInto, warFrontsFrom } from './warFrontReads.js';
import { ladderGoalOf } from '../townMap/ladderRead.js';
import { npcLadderActive } from './npcLadderKernel.js';
import { CORRUPTIBLE_FLAWS } from '../corruption.js';
import { corruptionWebActive } from './corruptionWeb.js';
import { memoryWeaveActive } from './relationshipEvolution.js';
import {
  thirdPartyRansomActive, resolveThirdPartyRansom, thirdPartyReleaseEffects,
  persistThirdPartyLedgers, THIRD_PARTY_RANSOM_TUNING,
} from '../roads/thirdPartyRansom.js';
import { seaRoadsActive, resolveSeaHazard, classifyLegModes, currentSeaHop } from '../roads/seaRoads.js';
import { activeBlockadeTargets } from '../spatial/navalLayer.js';

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
const HOSTILE_RUNGS = new Set(['rival', 'cold_war', 'hostile']);
// relationshipTypeBetween / atOpenWar / atWarWith + the whole §11b embassy hazard subsystem
// live in the roads/embassyHazard.js leaf (law 10 — engine logic out of the capped mover).

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
  const maxScale = recs.reduce((m, r) => Math.max(/** @type {number} */ (m), num(asObject(r).scaleBand, 0)), 0);
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

// ── §7 THE GAUNTLET — hop location + threat reads ──────────────────────────────
/**
 * The path node the traveller occupies right now (§7): the dest while visiting; interpolated
 * along the frozen path (forward outbound, reverse returning). Pure.
 * @param {Record<string, unknown>} m @param {number} weekClock @param {import('../spatial/distanceRead.js').SpatialDigest} digest @param {string|null} season
 * @returns {string}
 */
function currentHopOf(m, weekClock, digest, season) {
  const path = Array.isArray(m.path) ? /** @type {string[]} */ (m.path) : [];
  if (!path.length) return str(m.destId);
  if (m.phase === 'visiting') return str(m.destId);
  const last = path.length - 1;
  if (m.phase === 'outbound') {
    const span = Math.max(1, num(m.legArrivalTick, 0) - num(m.departTick, 0));
    const f = clamp01((weekClock - num(m.departTick, 0)) / span);
    return String(path[Math.max(0, Math.min(last, Math.floor(f * last)))]);
  }
  // returning — reverse the frozen path.
  const retWeeks = Math.max(1, num(hopWeeks(digest, str(m.destId), str(m.homeId), season), 1));
  const start = num(m.legArrivalTick, 0) - retWeeks;
  const g = clamp01((weekClock - start) / retWeeks);
  return String(path[Math.max(0, Math.min(last, Math.floor((1 - g) * last)))]);
}

/**
 * A hostile army column occupying `hop` (currentRegion match) whose home is hostile to the
 * traveller's home ⇒ its home id; else null. Pure.
 * @param {Record<string, unknown>} armyLedger @param {Record<string, unknown>} graph
 * @param {Record<string, unknown>} worldState @param {string} hop @param {string} homeId @returns {string|null}
 */
function armyOnHop(armyLedger, graph, worldState, hop, homeId) {
  for (const key of Object.keys(armyLedger).sort(cmp)) {
    const rec = asObject(armyLedger[key]);
    if (currentRegion(/** @type {import('../spatial/armyTransit.js').ArmyTransitRecord} */ (rec)) !== hop) continue;
    const armyHome = str(rec.armyId || rec.originId);
    if (!armyHome || armyHome === homeId) continue;
    const rt = relationshipTypeBetween(graph, worldState, armyHome, homeId);
    if (rt === 'rival' || rt === 'cold_war' || rt === 'hostile'
      || warFrontsInto(graph, homeId).includes(armyHome) || warFrontsFrom(graph, homeId).includes(armyHome)) {
      return armyHome;
    }
  }
  return null;
}

/**
 * Is a host tradition window ACTIVE this week (guest-right, §7)? Pure.
 * @param {unknown} hostRecs @param {number} weekOfYear @returns {boolean}
 */
function hostHasActiveWindow(hostRecs, weekOfYear) {
  const recs = Array.isArray(hostRecs) ? hostRecs : [];
  for (const r of recs) {
    const rec = asObject(r);
    if (rec.suppressedBy) continue;
    const start = clampNum(num(asObject(rec.window).startWeekOfYear, 1), 1, 52);
    const weeks = clampNum(num(asObject(rec.window).weeks, 1), 1, 2);
    if (weekOfYear >= start && weekOfYear <= start + weeks - 1) return true;
  }
  return false;
}

// ── news beats (the traditionBeat idiom; impactKind 'roads') ───────────────────
/**
 * A roads chronicle beat. @param {Object} a
 * @param {string} a.sid @param {number} a.tick @param {string|null} a.now @param {string} a.significance
 * @param {string} a.headline @param {string} a.summary @param {string} a.seed @param {string[]} a.tags
 * @param {number} [a.score] optional salience override (§11b: the embassy-departure beat lifts to
 *   the rumor seed floor so the EXISTING lattice carries the quiet news — the interception race)
 * @param {string} [a.causedBy] V-24d: a dark-gated deep cause-edge parent id (undefined ⇒ absent)
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
    score: a.score != null ? a.score : (major ? 52 : a.significance === 'notable' ? 42 : 34),
    headline: a.headline,
    summary: a.summary,
    kind: 'applied',
    impactKind: 'roads',
    channelType: 'settlement',
    settlementIds: [a.sid],
    impactIds: [],
    channelIds: [],
    sourceEventId: a.seed, ...(a.causedBy ? { causedBy: a.causedBy } : {}), // V-24d: dark-gated deep cause-edge
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
 * @param {Record<string, unknown>} m @param {import('../spatial/distanceRead.js').SpatialDigest} digest @param {string|null} season @returns {number|null}
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
  const digest = /** @type {import('../spatial/distanceRead.js').SpatialDigest} */ (args.digest);
  const now2 = Math.max(0, Math.floor(num(args.tick, 0))); // per-call event-fork counter
  const now = /** @type {string | null} */ (args.now == null ? null : args.now);
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
  // The UPDATE settlement carries this tick's fresh on-stage roster + settlement fields, but
  // buildWorldSnapshot FILTERED the off-stage NPCs out of it (§8). `freshSettlement` is used
  // for settlement-level fields (name/economicState) + the mirror base.
  /** @param {string} id @returns {Record<string, unknown>} */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined && asObject(settlementUpdates[ui]).settlement) return asObject(asObject(settlementUpdates[ui]).settlement);
    const it = itemById.get(String(id));
    return it ? asObject(it.settlement) : {};
  };
  // THE FULL ROSTER (§8 hostage management): the roads mover MUST see off-stage NPCs to tick
  // their ransoms and clear their whereabouts on release, but the participation snapshot filters
  // them out. `item.save` carries the untouched full roster; merge the update's FRESH on-stage
  // NPCs over it (keyed by npcId) so active NPCs keep this tick's changes while hostages/travellers
  // stay visible. This is why roads writes a FULL-roster mirror update below (the last word on the
  // roster; the earlier movers' filtered update is superseded, off-stage NPCs never lost).
  // The ORIGINAL saves carry the untouched FULL roster (off-stage NPCs included). The pulse
  // threads them to roads specifically because postTimeSnapshot's item.save was rebuilt from
  // the FILTERED localSettlements — so it, too, drops hostages. Falls back to item.save for the
  // direct-call unit tests (which pass a full update roster and no `saves`).
  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const saveRosterById = new Map();
  for (const sv of (Array.isArray(args.saves) ? /** @type {unknown[]} */ (args.saves) : [])) {
    const svo = asObject(sv);
    const sid = str(svo.id || asObject(svo.settlement).id);
    if (sid) saveRosterById.set(sid, Array.isArray(asObject(svo.settlement).npcs) ? /** @type {Array<Record<string, unknown>>} */ (asObject(svo.settlement).npcs) : []);
  }
  /** @param {string} id @returns {Array<Record<string, unknown>>} */
  const saveNpcsOf = (id) => {
    if (saveRosterById.has(String(id))) return /** @type {Array<Record<string, unknown>>} */ (saveRosterById.get(String(id)));
    const it = asObject(asObject(asObject(itemById.get(String(id))).save).settlement);
    return Array.isArray(it.npcs) ? /** @type {Array<Record<string, unknown>>} */ (it.npcs) : [];
  };
  /** @param {string} id @returns {Array<Record<string, unknown>>} */
  const fullRoster = (id) => {
    const saveNpcs = saveNpcsOf(id);
    const updNpcs = Array.isArray(asObject(freshSettlement(id)).npcs) ? /** @type {Array<Record<string, unknown>>} */ (asObject(freshSettlement(id)).npcs) : [];
    if (!saveNpcs.length) return updNpcs; // no save roster ⇒ the update roster is all we have
    const updByKey = new Map();
    updNpcs.forEach((n, i) => updByKey.set(npcId(id, n, i), asObject(n)));
    return saveNpcs.map((n, i) => updByKey.get(npcId(id, n, i)) || asObject(n));
  };

  // Per-settlement npcKey → { npc, index } over the FULL roster (prune + mirror + eligibility).
  /** @type {Map<string, Map<string, { npc: Record<string, unknown>, index: number }>>} */
  const rosterByS = new Map();
  for (const sid of orderedIds) {
    const m = new Map();
    fullRoster(sid).forEach((npc, index) => m.set(npcId(sid, npc, index), { npc: asObject(npc), index }));
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
  /** @type {Array<{ captorId: string, homeId: string, npcKey: string, beneficiaryId?: string }>} §10 conversion deposits (+ D-5 payer-beneficiary channels) */
  const returnedCaptiveDeposits = [];
  /** @type {Array<{ homeId: string, payerId: string, magnitude: number, predatory: boolean }>} D-5 §9 debt deposits (generosity consumes) */
  const ransomSettlementDeposits = [];
  /** @type {Array<{ homeId: string, captiveNpcKey: string, targetNpcKey: string, targetSid: string, sev: number }>} D-5 §9 gratitude-bond deposits (the ladder consumes) */
  const bondEventDeposits = [];
  /** @type {Array<{ homeId: string, destId: string, venue: string, envoyWeight01: number, amplifier: number, intensity01: number }>} §11b heard peace suits */
  const embassyDeposits = [];
  /** @type {Array<{ homeId: string, subject: string }>} §11b rumour-verification returns (write g) */
  const verificationReturns = [];
  /** @type {Record<string, Record<string, unknown>>} the surviving/advanced missions */
  const missions = {};

  // ── PASS 0: PRUNE (roster/DM collisions §3) + PASS 1: ADVANCE (§6) ──
  for (const mid of Object.keys(priorMissions).sort(cmp)) {
    const m0 = asObject(priorMissions[mid]);
    const homeId = str(m0.homeId);
    const npcKey = str(m0.npcKey);
    // Home vanished ⇒ prune (drop). NPC vanished ⇒ prune. DM shelved (stasis) ⇒ cancel.
    if (!idSet.has(homeId)) continue;
    const hit = rosterByS.get(homeId)?.get(npcKey); // (roster inlined to hold the file's 800-line ceiling)
    if (!hit) continue; // npc removed by DM (remove_npc) ⇒ mission pruned, cadence pruned below
    if (isOffStage(hit.npc)) continue; // DM stasis-npc overtook the traveler ⇒ CANCEL (quiet, no roll)

    const m = { ...m0 };
    // DESIGN_VISION_WAVE V-24a — THE RECALL RIDER: a DM recall (whereabouts.recall, stamped by
    // applyNpcOp on a live traveller) engages the return leg EARLY via roads/state.consumeMissionRecall
    // — a sanctioned early return (never a teleport, never a new mover; this mission IS the
    // traveller). Only outbound/visiting turn back; 'returning' is already homeward (a no-op,
    // self-cleared by the mirror pass). The leg is priced from the destination (at-destination) or
    // symmetric to the distance already covered (outbound). The heavy body lives in the leaf so
    // this at-ceiling kernel stays net-neutral.
    if (consumeMissionRecall(m, hit.npc, weekClock, num(hopWeeks(digest, str(m.destId), homeId, season), 1))) { missions[mid] = m; continue; }
    if (m.phase === 'outbound' && weekClock >= num(m.legArrivalTick, 0)) {
      m.phase = 'visiting';
      m.legArrivalTick = num(m.legArrivalTick, 0) + Math.max(1, num(m.stayWeeks, 1)); // visit-end week
    } else if (m.phase === 'visiting' && weekClock >= num(m.legArrivalTick, 0)) {
      // A lifted siege releases a trapped guest (§7 T2 extension).
      if (m.trappedBySiege && !warFrontsInto(graph, str(m.destId)).length) m.trappedBySiege = false;
      if (!m.trappedBySiege) {
        // ALL-ROADS-HOSTILE (§6): if every believed return route is refused, WAIT (receipt once).
        const knownView = knownEmbattlementView(worldState, homeId);
        const back = chooseRoute(digest, knownView, str(m.destId), homeId, num(m.riskTolerance01, 0.65), season);
        const believedReturn = back && Array.isArray(back.path) ? num(back.danger, 0) : Infinity;
        if (!back || believedReturn > num(m.riskTolerance01, 0.65) * ROADS_TUNING.DANGER_REFUSAL_CEILING) {
          if (!m.waitReceipted) {
            const s = freshSettlement(homeId); const seed = `wait.${mid}.${year}`;
            newsEntries.push(roadsBeat({
              sid: homeId, tick: now2, now, significance: 'notable',
              headline: pickLine(ROADS_NEWS.trapped.headline, seed, { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: str(m.destId) }),
              summary: pickLine(ROADS_NEWS.trapped.summary, seed, { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: str(m.destId) }),
              seed, tags: ['wait'],
            }));
            m.waitReceipted = true;
          }
        } else {
          const retWeeks = Math.max(1, num(hopWeeks(digest, str(m.destId), homeId, season), 1));
          m.phase = 'returning';
          m.legArrivalTick = weekClock + retWeeks;
          m.waitReceipted = false;
        }
      }
    } else if (m.phase === 'returning' && weekClock >= num(m.legArrivalTick, 0)) {
      // ARRIVE HOME — resolve: drop the mission, mirror cleared below. A released captive was
      // already announced by the ransom-paid beat (§9), so its arrival is silent (no double
      // news); an ordinary returning traveller mints the return beat.
      // §10 CONVERSION: a released captive who WILL convert deposits the returned-captive channel
      // on arriving home (seated at home = the foreign-patron shape). Gated on the web being LIT
      // (dark ⇒ no channel ⇒ the release resolves clean). The web mints through its OWN gates,
      // COVERT, no news — the roads supply a channel, the web does everything else.
      if (m.releasedFromRansom && m.willConvert && corruptionWebActive(worldState)) {
        returnedCaptiveDeposits.push({ captorId: str(m.captorId), homeId, npcKey: str(m.npcKey) });
      }
      // §11b PURPOSE 7: a RUMOR-VERIFICATION traveller reaching home confirms the subject — the
      // return writes the home rumour ledger with a freshness/fidelity boost (LAW 6 write g).
      if (str(asObject(m.purpose).kind) === 'verification' && str(asObject(m.purpose).ref)) {
        verificationReturns.push({ homeId, subject: str(asObject(m.purpose).ref) });
      }
      if (!m.releasedFromRansom) {
        const s = freshSettlement(homeId);
        const seed = `return.${mid}`;
        newsEntries.push(roadsBeat({
          sid: homeId, tick: now2, now, significance: 'notable',
          headline: pickLine(ROADS_NEWS.return.headline, seed, { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: str(m.destId) }),
          summary: pickLine(ROADS_NEWS.return.summary, seed, { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: str(m.destId) }),
          seed, tags: ['return'],
        }));
      }
      continue;
    }
    missions[mid] = m;
  }

  // A live-npcKey set for cadence pruning (drop cadence stamps for vanished NPCs). Ransoms
  // prune the same way (a DM-removed hostage's record is dropped).
  const liveKeys = new Set();
  for (const roster of rosterByS.values()) for (const k of roster.keys()) liveKeys.add(k);
  for (const k of Object.keys(cadence)) if (!liveKeys.has(k)) delete cadence[k];
  /** @type {Record<string, Record<string, unknown>>} carried + new hostage records */
  const ransoms = {};
  for (const rid of Object.keys(priorRansoms).sort(cmp)) {
    const r = asObject(priorRansoms[rid]);
    if (liveKeys.has(str(r.npcKey))) ransoms[rid] = r; // prune a vanished captive's record (§3)
  }

  // ── PASS 3: THE GAUNTLET (§7) — one fork per mission, at most ONE resolution per tick ──
  const seaLit = seaRoadsActive(worldState); // D-6 SEA ROADS (§10): sea-hazard dispatch on water hops
  // perf: the blockade map is TICK-INVARIANT (a pure read of the navalTransit ledger), so hoist it
  // ONCE per pass instead of rebuilding it inside resolveSeaHazard for every in-transit sea mission.
  const seaBlockades = seaLit ? activeBlockadeTargets(worldState) : undefined;
  /** @type {Map<string, number>} legitimacy hits (capture home hit · T4 detain host hit) */
  const legitimacyHits = new Map();
  const bumpLegit = (/** @type {string} */ id, /** @type {number} */ d) => legitimacyHits.set(id, (legitimacyHits.get(id) || 0) + d);
  const armyLedger = asObject(getSpatialLedger(worldState, 'armyTransit'));
  const occupations = asObject(asObject(worldState).occupations);
  const priorTraditionsG = asObject(getSpatialLedger(worldState, 'traditions'));
  for (const mid of Object.keys(missions).sort(cmp)) {
    const m = missions[mid];
    const homeId = str(m.homeId); const destId = str(m.destId); const phase = str(m.phase);
    const npc = (rosterByS.get(homeId) || new Map()).get(str(m.npcKey));
    if (!npc) continue;
    const w = roadsImportanceWeight(npc.npc);
    const protection = protectionOf({ importanceWeight: w, militaryQuality01: num(m.escort01, 1) });
    const legWeeks = phase === 'visiting' ? num(m.stayWeeks, 1)
      : phase === 'returning' ? Math.max(1, num(hopWeeks(digest, destId, homeId, season), 1))
        : Math.max(1, num(m.legArrivalTick, 0) - num(m.departTick, 0));
    const exposure = exposureOf({ legWeeks, phase });
    const hop = currentHopOf(m, weekClock, digest, season);
    const fork = createPRNG(`${rngSeed}::roads-hazard:${mid}:${now2}`);

    /** @type {{ cls: string, outcome: string, captorId: string, venue?: string, hunted?: boolean, envoyWeight01?: number, amplifier?: number, intensity01?: number }|null} */
    let res = null;
    if (isEmbassy(m)) {
      // §11b THE EMBASSY: the two venues (road parley · court suit) + the third-party rule +
      // the interception race, weighed by the insult/humility amplifier. In transit, a bandit
      // road (T3) can still take an embassy that no army meets (bandits do not parley).
      const em = embassyEnvoyMetrics(freshSettlement(homeId), npc.npc, w);
      res = evaluateEmbassyHazard({
        mid, homeId, targetId: destId, phase, hop, protection, exposure, fork, graph, worldState,
        armyLedger, now2, amplifier: em.amplifier, envoyWeight01: em.envoyWeight01,
      });
      if (!res && phase !== 'visiting') {
        const level = embattlementLevel(worldState, hop);
        if (level >= ROADS_TUNING.EMBATTLED_THRESHOLD) {
          const captorId = idSet.has(hop) ? hop : destId;
          const p = captureProbability({ base: ROADS_TUNING.T3_BASE * level, exposure, protection, alpha: ROADS_TUNING.T3_ALPHA });
          res = fork.random() < p ? { cls: 'T3', outcome: 'hostage', captorId } : { cls: 'T3', outcome: 'robbed', captorId };
        }
      }
    } else {
      // D-6 SEA ROADS (§10): an IN-TRANSIT SEA hop swaps the land in-transit checks (T1-army/T3) for
      // the sea-hazard dispatch (S1 blockade · S2 storm · S3 piracy). A calm crossing ⇒ res stays
      // null (no land army/embattlement check). T2/T4 are visiting-only ⇒ never reached over water.
      const overSea = seaLit && phase !== 'visiting' && currentSeaHop(m, weekClock, digest, season).overSea;
      if (overSea) {
        res = resolveSeaHazard({ m, weekClock, digest, season, worldState, graph, homeId, destId, exposure, protection, fork, rngSeed, now2, idSet, blockades: seaBlockades });
      }
      // T1 — army on the route / occupation during the stay.
      let t1Captor = null;
      if (!overSea && phase === 'visiting' && asObject(occupations[destId]).occupierId) t1Captor = str(asObject(occupations[destId]).occupierId);
      if (!res && !overSea && !t1Captor) t1Captor = armyOnHop(armyLedger, graph, worldState, hop, homeId);
      if (t1Captor) {
        const p = captureProbability({ base: ROADS_TUNING.T1_BASE, exposure, protection, alpha: ROADS_TUNING.T1_ALPHA });
        res = fork.random() < p ? { cls: 'T1', outcome: 'hostage', captorId: t1Captor } : { cls: 'T1', outcome: 'delayed', captorId: t1Captor };
      }
      // T2 — siege into the host during the stay.
      if (!res && phase === 'visiting') {
        const besiegers = warFrontsInto(graph, destId);
        if (besiegers.length) {
          const captorId = String([...besiegers].sort(cmp)[0]);
          const p = captureProbability({ base: ROADS_TUNING.T2_BASE, exposure, protection, alpha: ROADS_TUNING.T2_ALPHA });
          res = fork.random() < p ? { cls: 'T2', outcome: 'hostage', captorId } : { cls: 'T2', outcome: 'trapped', captorId };
        }
      }
      // T3 — embattled roads (LAND in-transit only; a sea hop's piracy is S3, handled above).
      if (!res && !overSea && phase !== 'visiting') {
        const level = embattlementLevel(worldState, hop);
        if (level >= ROADS_TUNING.EMBATTLED_THRESHOLD) {
          const captorId = idSet.has(hop) ? hop : destId;
          const p = captureProbability({ base: ROADS_TUNING.T3_BASE * level, exposure, protection, alpha: ROADS_TUNING.T3_ALPHA });
          res = fork.random() < p ? { cls: 'T3', outcome: 'hostage', captorId } : { cls: 'T3', outcome: 'robbed', captorId };
        }
      }
      // T4 — hostile reception (the host also rolls; self-balancing).
      if (!res && phase === 'visiting') {
        const rung = /** @type {Record<string, number>} */ (ROADS_TUNING.T4_RUNG)[relationshipTypeBetween(graph, worldState, homeId, destId)];
        if (rung) {
          const war = atOpenWar(graph, homeId, destId);
          const restraint = war ? 1.0 : ROADS_TUNING.LEGITIMACY_RESTRAINT;
          const guestRight = hostHasActiveWindow(priorTraditionsG[destId], weekOfYear) ? ROADS_TUNING.GUEST_RIGHT_MULT : 1.0;
          const detentionP = clampNum(ROADS_TUNING.T4_DETENTION_PER_RUNG * rung * exposure / Math.max(0.01, protection) * restraint * guestRight, 0, ROADS_TUNING.CAPTURE_CAP);
          const r = fork.random();
          if (r < detentionP) { res = { cls: 'T4', outcome: 'hostage', captorId: destId }; if (!war) bumpLegit(destId, ROADS_TUNING.DETAIN_LEGIT_HIT); }
          else if (r < detentionP * 2) res = { cls: 'T4', outcome: 'expelled', captorId: destId };
          else res = { cls: 'T4', outcome: 'received', captorId: destId };
        }
      }
    }
    if (!res) continue;

    const s = freshSettlement(homeId);
    const interp = { npc: str(m.npcName), home: str(asObject(s).name || homeId), dest: destId, captor: res.captorId };
    if (res.outcome === 'hostage') {
      // MISSION → RANSOM (§8): the hostage goes off-stage (mirror hostage; the R-4 chokepoint).
      const termWeeks = termWeeksFor(w);
      const willConvert = fork.random() < conversionProbability({ flawFactor: conversionFlawFactor(npc.npc, CORRUPTIBLE_FLAWS), termWeeks });
      const hostileAtCapture = atOpenWar(graph, homeId, res.captorId) || HOSTILE_RUNGS.has(relationshipTypeBetween(graph, worldState, homeId, res.captorId));
      ransoms[`ransom.${mid}`] = {
        id: `ransom.${mid}`, npcKey: str(m.npcKey), npcName: str(m.npcName), homeId, captorId: res.captorId,
        threatClass: res.cls, purposeKind: str(asObject(m.purpose).kind), missionId: mid,
        startedTick: now2, startedWeek: weekClock, termWeeks, remainingWeeks: termWeeks,
        // THE STALE-INTEL RECEIPT (§19): the believed danger the envoy was dispatched under,
        // carried onto the capture record — a poorly-informed faction's capture cites how
        // little it knew (knownDangerAtDispatch < the truth that took them).
        knownDangerAtDispatch: num(m.knownDangerAtDispatch, 0),
        hostileAtCapture, conversionRolled: true, willConvert,
      };
      delete missions[mid];
      bumpLegit(homeId, -(ROADS_TUNING.CAPTURE_LEGIT_BASE + Math.round(ROADS_TUNING.CAPTURE_LEGIT_SCALE * w)));
      const seed = `capture.${mid}`;
      newsEntries.push(roadsBeat({
        sid: homeId, tick: now2, now, significance: 'major',
        headline: pickLine(ROADS_NEWS.capture.headline, seed, interp),
        summary: pickLine(ROADS_NEWS.capture.summary, seed, interp),
        // §11b: an embassy detained at the venue, or intercepted mid-flight (the suit dies unheard).
        seed, tags: ['capture', res.cls, ...(isEmbassy(m) ? ['embassy'] : []), ...(res.hunted ? ['interception'] : [])],
      }));
    } else if (res.outcome === 'embassy_received') {
      // §11b THE SUIT IS HEARD (road parley or court suit): deposit the peace suit for the war
      // machinery to consume, and send the envoy home under escort with a NOTABLE receipt.
      embassyDeposits.push({
        homeId, destId, venue: str(res.venue), envoyWeight01: num(res.envoyWeight01, 0),
        amplifier: num(res.amplifier, 0), intensity01: num(res.intensity01, 0),
      });
      const retWeeks = Math.max(1, num(hopWeeks(digest, destId, homeId, season), 1));
      m.phase = 'returning'; m.legArrivalTick = weekClock + retWeeks; m.embassyHeard = true;
      const seed = `embassy.${mid}`;
      newsEntries.push(roadsBeat({
        sid: homeId, tick: now2, now, significance: 'notable',
        headline: pickLine(ROADS_NEWS.embassyReceived.headline, seed, interp),
        summary: pickLine(ROADS_NEWS.embassyReceived.summary, seed, interp),
        seed, tags: ['embassy_received', str(res.venue)],
      }));
    } else if (res.outcome === 'embassy_turned_home') {
      // §11b TURNED HOME (honour & chivalry — never worse than expulsion): the suit is refused a
      // hearing; the envoy rides home, the war unabated.
      const retWeeks = Math.max(1, num(hopWeeks(digest, destId, homeId, season), 1));
      m.phase = 'returning'; m.legArrivalTick = weekClock + retWeeks; m.expelled = true;
      const seed = `embassy-rebuff.${mid}`;
      newsEntries.push(roadsBeat({
        sid: homeId, tick: now2, now, significance: 'notable',
        headline: pickLine(ROADS_NEWS.embassyRebuffed.headline, seed, interp),
        summary: pickLine(ROADS_NEWS.embassyRebuffed.summary, seed, interp),
        seed, tags: ['embassy_rebuffed', str(res.venue)],
      }));
    } else if (res.outcome === 'delayed') {
      // D-6: a storm (S2) delays 1-2 weeks (res.delayWeeks); a land army-delay (T1) is +1.
      m.legArrivalTick = num(m.legArrivalTick, 0) + Math.max(1, num(/** @type {{ delayWeeks?: number }} */ (res).delayWeeks, 1));
      if (!m.delayReceipted) {
        m.delayReceipted = true; const seed = `delay.${mid}.${now2}`;
        newsEntries.push(roadsBeat({ sid: homeId, tick: now2, now, significance: 'notable', headline: pickLine(ROADS_NEWS.delayed.headline, seed, interp), summary: pickLine(ROADS_NEWS.delayed.summary, seed, interp), seed, tags: ['delayed', ...(/** @type {{ overSea?: boolean }} */ (res).overSea ? ['sea'] : [])] }));
      }
    } else if (res.outcome === 'trapped') {
      if (!m.trappedBySiege) {
        m.trappedBySiege = true; const seed = `trap.${mid}`;
        newsEntries.push(roadsBeat({ sid: homeId, tick: now2, now, significance: 'notable', headline: pickLine(ROADS_NEWS.trapped.headline, seed, interp), summary: pickLine(ROADS_NEWS.trapped.summary, seed, interp), seed, tags: ['trapped'] }));
      }
    } else if (res.outcome === 'robbed') {
      if (!m.robbedReceipted) {
        m.robbedReceipted = true; const seed = `rob.${mid}.${now2}`;
        newsEntries.push(roadsBeat({ sid: homeId, tick: now2, now, significance: 'notable', headline: pickLine(ROADS_NEWS.robbed.headline, seed, interp), summary: pickLine(ROADS_NEWS.robbed.summary, seed, interp), seed, tags: ['robbed'] }));
      }
    } else if (res.outcome === 'expelled') {
      const retWeeks = Math.max(1, num(hopWeeks(digest, destId, homeId, season), 1));
      m.phase = 'returning'; m.legArrivalTick = weekClock + retWeeks; m.expelled = true;
      const seed = `expel.${mid}`;
      newsEntries.push(roadsBeat({ sid: homeId, tick: now2, now, significance: 'notable', headline: pickLine(ROADS_NEWS.expulsion.headline, seed, interp), summary: pickLine(ROADS_NEWS.expulsion.summary, seed, interp), seed, tags: ['expulsion'] }));
    }
    // 'received' — the visit proceeds under strain; no state change, no news (not a §12 kind).
  }

  // ── PASS 4: RANSOM TICKS (§9) — decrement, early-release checks, term-end release ──
  /** @type {Map<string, number>} captor prosperity band-steps (key/pillar captives) */
  const captorProsperity = new Map();
  /** @type {Map<string, number>} home prosperity band-steps (PILLAR captives, §20 Q10) */
  const homeProsperity = new Map();
  /** @type {Map<string, number>} D-5 §9 payer prosperity band-steps (mercy priced for key/pillar captives) */
  const payerProsperity = new Map();
  const thirdPartyLit = thirdPartyRansomActive(worldState); // D-5 §9 the virtual flag
  const memWeaveLit = memoryWeaveActive(worldState); // D-5 §9 the friend channel + gratitude gate
  for (const rid of Object.keys(ransoms).sort(cmp)) {
    const r = { ...asObject(ransoms[rid]) };
    const homeId = str(r.homeId); const captorId = str(r.captorId); const npcKey = str(r.npcKey);
    const npc = (rosterByS.get(homeId) || new Map()).get(npcKey);
    const w = npc ? roadsImportanceWeight(npc.npc) : clamp01((num(r.termWeeks, 13) - 13) / 26); // fall back from the term
    const elapsed = weekClock - num(r.startedWeek, weekClock);
    r.remainingWeeks = Math.max(0, num(r.termWeeks, 0) - elapsed);
    // EARLY-RELEASE events: THE PARTY'S HAND (§11) · captor razed/abandoned · captor
    // occupied/liberated · peace (§9). A party op's marker (whereabouts.partyRelease, the
    // §3 stasis-collision precedent — the DM writes the npc, the mover reacts) WINS: the
    // DM's explicit intervention overrides any automatic event this tick.
    const partyRelease = npc ? str(asObject(asObject(npc.npc).whereabouts).partyRelease) : '';
    let early = '';
    if (partyRelease === 'ransom') early = 'party_ransom';
    else if (partyRelease === 'rescue') early = 'party_rescue';
    else if (!idSet.has(captorId)) early = 'captor_gone';
    else if (asObject(asObject(occupations)[captorId]).occupierId) early = 'captor_occupied';
    else if (r.hostileAtCapture && !atOpenWar(graph, homeId, captorId) && !HOSTILE_RUNGS.has(relationshipTypeBetween(graph, worldState, homeId, captorId))) early = 'peace';
    // D-5 THIRD-PARTY RANSOM (§9): once, at half-term, scan for a payer. DM/party ops WIN (only when !early).
    let thirdPartyDecision = null;
    if (thirdPartyLit && !early && !r.thirdPartyResolved
        && num(r.remainingWeeks, 0) <= num(r.termWeeks, 0) * THIRD_PARTY_RANSOM_TUNING.HALF_TERM_FRACTION) {
      const d = resolveThirdPartyRansom({
        ransom: r, captiveNpc: npc ? npc.npc : {}, w, servedFraction: clamp01(elapsed / Math.max(1, num(r.termWeeks, 1))),
        graph, worldState, settlementOf: freshSettlement, candidateIds: orderedIds,
        rngSeed, memoryWeaveLit: memWeaveLit, corruptibleFlaws: CORRUPTIBLE_FLAWS,
      });
      r.thirdPartyResolved = true; r.payerId = d.payerId; r.payerMotive = d.payerMotive;
      if (d.action === 'debt' || d.action === 'compromised') { early = 'third_party'; thirdPartyDecision = d; }
    }
    const termEnd = /** @type {number} */ (r.remainingWeeks) <= 0;
    if (!early && !termEnd) { ransoms[rid] = r; continue; } // still captive — carry the updated record

    // RELEASE: the captive turns for home ('returning' over hopWeeks); the ransom record clears.
    // A PARTY RESCUE (§11) VOIDS the covert conversion — the captor's leverage was broken, not
    // bargained — by dropping willConvert on the returning mission (consumed on arrival home).
    delete ransoms[rid];
    const retWeeks = Math.max(1, num(hopWeeks(digest, captorId, homeId, season), 1));
    const backMid = `road.${homeId}.${npcKey}.${weekClock}`;
    const willConvertOut = early === 'party_rescue' ? false : !!r.willConvert;
    missions[backMid] = {
      id: backMid, npcKey, npcName: str(r.npcName), homeId, destId: captorId,
      purpose: { kind: str(r.purposeKind) || 'trade', ref: '' }, phase: 'returning', path: [captorId, homeId],
      departTick: weekClock, legArrivalTick: weekClock + retWeeks, stayWeeks: 0,
      escort01: 1, riskTolerance01: 0.65, knownDangerAtDispatch: 0, trappedBySiege: false,
      startedYear: year, releasedFromRansom: true, willConvert: willConvertOut, captorId,
    };
    // WRITE SCHEDULE (§9/§11): term-end pays the FULL schedule. A PARTY RANSOM keeps the captor
    // prosperity pulse (the party met the price) but spares the home seat BOTH the legitimacy hit
    // AND the pillar prosperity debit — the coin came from adventurers, not the treasury. Every
    // other early release (rescue, captor_gone, occupied, peace) skips all credits.
    if (termEnd && !early) {
      bumpLegit(homeId, ROADS_TUNING.RANSOM_PAID_HOME_LEGIT); // -1: the treasury bled
      if (w >= ROADS_TUNING.CAPTOR_CREDIT_MIN_WEIGHT) captorProsperity.set(captorId, (captorProsperity.get(captorId) || 0) + ROADS_TUNING.CAPTOR_PROSPERITY_STEP);
      if (w >= ROADS_TUNING.PILLAR_WEIGHT) homeProsperity.set(homeId, (homeProsperity.get(homeId) || 0) + ROADS_TUNING.HOME_PILLAR_PROSPERITY_STEP);
    } else if (early === 'party_ransom' && w >= ROADS_TUNING.CAPTOR_CREDIT_MIN_WEIGHT) {
      captorProsperity.set(captorId, (captorProsperity.get(captorId) || 0) + ROADS_TUNING.CAPTOR_PROSPERITY_STEP);
    } else if (early === 'third_party' && thirdPartyDecision) {
      // §9 REDIRECTED SCHEDULE: the payer's coin covered the shame (home skips the legit hit); the
      // payer bleeds a band-step for key/pillar captives; the outcome (debt/compromised/gratitude) deposits.
      const eff = thirdPartyReleaseEffects(thirdPartyDecision, { homeId, captorId, npcKey, w, corruptionWebLit: corruptionWebActive(worldState) });
      if (eff.payerProsperityStep) payerProsperity.set(eff.payerId, (payerProsperity.get(eff.payerId) || 0) + eff.payerProsperityStep);
      if (eff.returnedCaptiveDeposit) returnedCaptiveDeposits.push(eff.returnedCaptiveDeposit);
      if (eff.ransomSettlementDeposit) ransomSettlementDeposits.push(eff.ransomSettlementDeposit);
      if (eff.bondEventDeposit) bondEventDeposits.push(eff.bondEventDeposit);
    }
    const s = freshSettlement(homeId); const seed = `ransom.${rid}`;
    /** @type {{ npc: string, home: string, captor: string, dest: string, payer?: string }} */
    const interp = { npc: str(r.npcName), home: str(asObject(s).name || homeId), captor: captorId, dest: captorId };
    // D-5 §9 game-feel-3: a third-party release speaks the PAYER's true voice (friend / ally-creditor
    // / rival leash), NOT the home-paid line. payerMotive was stamped on the record at the checkpoint.
    let pool = early === 'party_ransom' ? ROADS_NEWS.partyRansom : early === 'party_rescue' ? ROADS_NEWS.rescue : ROADS_NEWS.ransom;
    if (early === 'third_party') {
      interp.payer = str(asObject(freshSettlement(str(r.payerId))).name || str(r.payerId));
      pool = thirdPartyRansomPool(str(r.payerMotive));
    }
    newsEntries.push(roadsBeat({
      sid: homeId, tick: now2, now, significance: 'notable', causedBy: captureCauseId(worldState, r), // V-24d: trace back to the capture
      headline: pickLine(pool.headline, seed, interp),
      summary: pickLine(pool.summary, seed, interp),
      seed, tags: [early ? `ransom_${early}` : 'ransom'],
    }));
  }

  // npcKeys away (surviving missions) or hostage (ransoms) — both excluded from genesis.
  const awayKeys = new Set(Object.values(missions).map((m) => str(asObject(m).npcKey)));
  const hostageKeys = new Set(Object.values(ransoms).map((r) => str(asObject(r).npcKey)));
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
    // §11b: the war damper suppresses ROUTINE dispatches (besieged/occupied/mobilizing) but NOT
    // the peace embassy — the sanctioned wartime journey. Compute it, don't `continue` on it.
    const damped = warDamped(worldState, graph, sid);
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
    // §11b THE PEACE EMBASSY targets: settlements this court is AT WAR with, routable within
    // range. Found over ALL settlements — an enemy shares no trade edge, so tradeReachable never
    // finds them. Codepoint-stable, first target sued.
    /** @type {Array<{ dest: string, hopWeeksOut: number }>} */
    const warTargets = [];
    for (const dest of orderedIds) {
      if (dest === sid || !idSet.has(dest)) continue;
      if (!atWarWith(graph, worldState, sid, dest)) continue;
      const hw = num(hopWeeks(digest, sid, dest, season), 0);
      if (hw >= 1 && hw <= ROADS_TUNING.EMBASSY_MAX_HOP_WEEKS) warTargets.push({ dest, hopWeeksOut: hw });
    }
    warTargets.sort((x, y) => cmp(x.dest, y.dest));
    // §11b PURPOSE 6 DOMINION INSPECTION targets: holdings this court OCCUPIES (over all
    // settlements — an occupied holding shares no trade edge), routable within range.
    /** @type {Array<{ dest: string, hopWeeksOut: number }>} */
    const dominionTargets = [];
    for (const dest of orderedIds) {
      if (dest === sid || !idSet.has(dest)) continue;
      if (str(asObject(occupations[dest]).occupierId) !== sid) continue;
      const hw = num(hopWeeks(digest, sid, dest, season), 0);
      if (hw >= 1 && hw <= ROADS_TUNING.MAX_HOP_WEEKS) dominionTargets.push({ dest, hopWeeksOut: hw });
    }
    dominionTargets.sort((x, y) => cmp(x.dest, y.dest));
    // §11b PURPOSE 7 RUMOR VERIFICATION plan: a low-fidelity home rumour + a trusted source in
    // range (null unless beliefs are live — omniscient/dark plans nothing ⇒ byte-identical).
    const verifyPlan = damped ? null : findVerifyPlan(worldState, graph, sid, inRange, now2);
    // Nothing to send: no routine journey (damped, or no reachable routine target) AND no suit.
    const hasRoutine = !damped && (inRange.length || dominionTargets.length);
    if (!hasRoutine && !warTargets.length) continue;

    const knownView = knownEmbattlementView(worldState, sid);
    const roster = rosterByS.get(sid) || new Map();

    /** @type {Array<{ npcKey: string, npc: Record<string, unknown>, w: number, weight: number, dest: string, purpose: { kind: string, ref: string }, major: boolean, hopWeeksOut: number }>} */
    const candidates = [];
    for (const [npcKey, { npc }] of [...roster.entries()].sort((x, y) => cmp(x[0], y[0]))) {
      if (isOffStage(npc)) continue; // stasis / hostage (via the mirror)
      if (awayKeys.has(npcKey) || hostageKeys.has(npcKey)) continue; // abroad OR a hostage this tick
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

      // BORROWED-PURPOSE scan (first match). §11b: the PEACE EMBASSY (wartime, government/noble)
      // is scanned FIRST and BYPASSES the damper — a court at war prioritizes suing for peace.
      // The routine purposes (observance → trade → diplomacy → ladder) need an un-damped court.
      let purpose = null; let dest = ''; let major = false; let hopWeeksOut = 1; let fullWeight = false;
      if (warTargets.length && DIPLO_CATEGORY.test(categoryOf(npc))) {
        const t = warTargets[0]; // the first (codepoint-sorted) enemy is sued
        purpose = { kind: 'embassy', ref: `${sid}~${t.dest}` }; dest = t.dest; hopWeeksOut = t.hopWeeksOut; fullWeight = true;
      }
      if (!purpose && !damped && inRange.length) {
        for (const cand of inRange) {
          const obs = observanceMatch(/** @type {unknown[]} */ (priorTraditions[cand.dest]), weekOfYear, cand.hopWeeksOut);
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
            return rt === 'rival' || rt === 'cold_war'; // hostile = open war ⇒ the embassy, not routine
          });
          if (hit) { purpose = { kind: 'diplomacy', ref: `${sid}~${hit.dest}` }; dest = hit.dest; hopWeeksOut = hit.hopWeeksOut; }
        }
        // §11b PURPOSE 6 DOMINION INSPECTION — an envoy of an occupying court views a held holding.
        if (!purpose && dominionTargets.length && DIPLO_CATEGORY.test(categoryOf(npc))) {
          const t = dominionTargets[0];
          purpose = { kind: 'dominion', ref: t.dest }; dest = t.dest; hopWeeksOut = t.hopWeeksOut;
        }
        // §11b PURPOSE 7 RUMOR VERIFICATION — travel to a trusted source to confirm a rumour; the
        // RETURN writes the home rumour ledger (write g). ref = the subject to verify.
        if (!purpose && verifyPlan && DIPLO_CATEGORY.test(categoryOf(npc))) {
          purpose = { kind: 'verification', ref: verifyPlan.subject }; dest = verifyPlan.dest; hopWeeksOut = verifyPlan.hopWeeksOut;
        }
        if (!purpose && ladderLit) {
          const goal = ladderGoalOf(/** @type {{ npcLadder?: unknown }} */ (s), npcKey);
          if (goal && goal.goal) { purpose = { kind: 'ladder', ref: goal.goal }; dest = inRange[0].dest; hopWeeksOut = inRange[0].hopWeeksOut; fullWeight = true; }
        }
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
      // §11b ESCORT REFINEMENT (all purposes): the home power+influence ranking scales the escort
      // weight alongside military quality — FROZEN AT DISPATCH onto escort01 (the guards who left
      // with you are the guards you have). ×settlementWeight01 ∈ [0.8, 1.3].
      const escort01 = militaryQuality01({
        readiness01: readinessOf(/** @type {never} */ (s)),
        experience01: experienceOf(/** @type {never} */ (s)),
        capacityBand01: militaryCapacityScalar(s),
      }) * settlementWeight01(s);
      const missionId = `road.${sid}.${c.npcKey}.${weekClock}`;
      missions[missionId] = {
        id: missionId, npcKey: c.npcKey, npcName: str(c.npc.name || c.npcKey),
        homeId: sid, destId: c.dest, purpose: c.purpose, phase: 'outbound',
        path: route.path.slice(), departTick: weekClock, legArrivalTick: weekClock + legWeeks,
        stayWeeks, escort01, riskTolerance01: riskTolerance, knownDangerAtDispatch: believedDanger,
        trappedBySiege: false, startedYear: year,
        // D-6 SEA ROADS (§10): freeze per-hop modality at dispatch (absent when dark ⇒ legacy all-land).
        ...(seaLit ? { legModes: classifyLegModes(digest, route.path) } : {}),
      };
      cadence[c.npcKey] = year;
      abroadByHome.set(sid, (abroadByHome.get(sid) || 0) + 1);
      awayKeys.add(c.npcKey);

      // §11b THE EMBASSY DEPARTURE is a QUIET beat that nonetheless TRAVELS: its seed matches the
      // interception-race rumor key (`embassy-depart.${missionId}` → the sourceEventId the EXISTING
      // rumor lattice seeds/relays), and its salience is lifted to the seed floor so a third party
      // at war with the target can learn of it in flight. No new carrier.
      const isEmb = c.purpose.kind === 'embassy';
      const pillar = c.w >= ROADS_TUNING.PILLAR_WEIGHT;
      const significance = (pillar || c.major || isEmb) ? 'notable' : 'minor';
      const seed = isEmb ? `embassy-depart.${missionId}` : `depart.${missionId}`;
      const interp = { npc: str(c.npc.name || c.npcKey), home: str(asObject(s).name || sid), dest: c.dest, purpose: c.purpose.kind };
      const pool = isEmb ? ROADS_NEWS.embassyDeparture : ROADS_NEWS.departure;
      newsEntries.push(roadsBeat({
        sid, tick: now2, now, significance,
        headline: pickLine(pool.headline, seed, interp),
        summary: pickLine(pool.summary, seed, interp),
        seed, tags: [isEmb ? 'embassy_departure' : 'departure'],
        ...(isEmb ? { score: RUMOR_NOTABLE_SCORE_FLOOR } : {}),
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
  // Hostages (from ransoms) go OFF-STAGE: whereabouts.state='hostage', placeId=captor (§8).
  for (const r of Object.values(ransoms)) {
    const rr = asObject(r);
    desired.set(str(rr.npcKey), {
      state: 'hostage', placeId: str(rr.captorId), purposeKind: str(rr.purposeKind),
      sinceTick: num(rr.startedTick, 0), expectedReturnTick: null, missionId: str(rr.missionId),
    });
  }

  let nextUpdates = settlementUpdates;
  let cloned = false;
  for (const sid of orderedIds) {
    const roster = rosterByS.get(sid);
    if (!roster || !roster.size) continue;
    const ui = updateIndex.get(sid);
    if (ui === undefined) continue;
    // Iterate the FULL roster (off-stage hostages included) and apply the whereabouts diff.
    const nextNpcs = fullRoster(sid).map((npc, index) => {
      const key = npcId(sid, npc, index);
      const want = desired.get(key) || null;
      const cur = asObject(npc).whereabouts || null;
      if (JSON.stringify(cur ?? null) === JSON.stringify(want ?? null)) return npc;
      if (want == null) { const rest = { ...asObject(npc) }; delete rest.whereabouts; return rest; }
      return { ...asObject(npc), whereabouts: want };
    });
    // Emit when the roads full roster differs from the update roster — either a whereabouts
    // changed OR the update dropped an off-stage NPC roads must keep (this full-roster update
    // is the last word, so a hostage is never lost even under a naive save merge).
    const curNpcs = Array.isArray(asObject(freshSettlement(sid)).npcs) ? /** @type {Array<Record<string, unknown>>} */ (asObject(freshSettlement(sid)).npcs) : [];
    let diff = nextNpcs.length !== curNpcs.length;
    if (!diff) for (let i = 0; i < nextNpcs.length; i += 1) { if (nextNpcs[i] !== curNpcs[i]) { diff = true; break; } }
    if (!diff) continue;
    if (!cloned) { nextUpdates = settlementUpdates.slice(); cloned = true; }
    nextUpdates[ui] = { ...nextUpdates[ui], settlement: { ...asObject(freshSettlement(sid)), npcs: nextNpcs } };
  }

  // ── §7/§9 bounded writes: legitimacy (capture · detain · ransom-paid) + prosperity band-
  //    steps (captor credit for key/pillar captives · home debit for pillar captives) ──
  if (legitimacyHits.size || captorProsperity.size || homeProsperity.size || payerProsperity.size) {
    const idx = () => { const m = new Map(); nextUpdates.forEach((u, i) => m.set(str(u.saveId), i)); return m; };
    if (legitimacyHits.size) { const a = applyLegitimacySteps(nextUpdates, idx(), legitimacyHits); if (a !== nextUpdates) { nextUpdates = a; cloned = true; } }
    if (captorProsperity.size) { const a = applyProsperityBandSteps(nextUpdates, idx(), captorProsperity); if (a !== nextUpdates) { nextUpdates = a; cloned = true; } }
    if (homeProsperity.size) { const a = applyProsperityBandSteps(nextUpdates, idx(), homeProsperity); if (a !== nextUpdates) { nextUpdates = a; cloned = true; } }
    if (payerProsperity.size) { const a = applyProsperityBandSteps(nextUpdates, idx(), payerProsperity); if (a !== nextUpdates) { nextUpdates = a; cloned = true; } } // D-5 §9 mercy priced
  }

  // ── PERSIST the sidecar (drop-when-empty; codepoint-sorted, byte-stable) ──
  let nextWorldState = worldState;
  let changed = cloned || newsEntries.length > 0;
  const persisted = {};
  if (Object.keys(missions).length) persisted.missions = sortKeys(missions);
  if (Object.keys(ransoms).length) persisted.ransoms = sortKeys(ransoms);
  if (Object.keys(cadence).length) persisted.cadence = sortKeys(cadence);
  const prevSerialized = JSON.stringify(Object.keys(priorRoads).length ? priorRoads : null);
  const nextSerialized = JSON.stringify(Object.keys(persisted).length ? persisted : null);
  if (prevSerialized !== nextSerialized) {
    nextWorldState = Object.keys(persisted).length
      ? setSpatialLedger(nextWorldState, 'roads', persisted)
      : dropSpatialLedger(nextWorldState, 'roads');
    changed = true;
  }

  // ── §10 RETURNED-CAPTIVE CHANNEL LEDGER — carry prior (pruning vanished/already-converted
  //    captives) + the new deposits. The corruption web's creation pass consumes it. ──
  const priorReturned = asObject(getSpatialLedger(worldState, 'roadsReturnedCaptives'));
  if (Object.keys(priorReturned).length || returnedCaptiveDeposits.length) {
    const npcStates = asObject(asObject(worldState).npcStates);
    /** @type {Record<string, unknown>} */
    const nextReturned = {};
    for (const key of Object.keys(priorReturned).sort(cmp)) {
      const r = asObject(priorReturned[key]);
      const nk = str(r.npcKey);
      if (!liveKeys.has(nk)) continue; // the captive vanished ⇒ drop the channel
      if (asObject(npcStates[nk]).corruption === true) continue; // the web already minted ⇒ done
      nextReturned[key] = r;
    }
    for (const d of returnedCaptiveDeposits) {
      // D-5 §9: a payer-beneficiary channel keys/beneficiaries on the PAYER (the web recruits FOR the
      // payer, not the captor); a plain captor channel omits beneficiaryId ⇒ the consumer falls back to captorId.
      const bid = d.beneficiaryId && d.beneficiaryId !== d.captorId ? d.beneficiaryId : null;
      nextReturned[`${bid || d.captorId}|${d.homeId}|${d.npcKey}`] = { captorId: d.captorId, homeId: d.homeId, npcKey: d.npcKey, tick: now2, ...(bid ? { beneficiaryId: bid } : {}) };
    }
    const prevRet = JSON.stringify(Object.keys(priorReturned).length ? priorReturned : null);
    const nextRet = JSON.stringify(Object.keys(nextReturned).length ? sortKeys(nextReturned) : null);
    if (prevRet !== nextRet) {
      nextWorldState = Object.keys(nextReturned).length
        ? setSpatialLedger(nextWorldState, 'roadsReturnedCaptives', sortKeys(nextReturned))
        : dropSpatialLedger(nextWorldState, 'roadsReturnedCaptives');
      changed = true;
    }
  }

  // ── D-5 §9 THE THIRD-PARTY DEPOSIT LEDGERS — the debt (generosity consumes) + the gratitude bond
  //    (the ladder consumes). Drop-when-empty; consume-once by pulse order (both consumers run
  //    before roads-last, so this tick's deposits are theirs next tick, then pruned). ──
  if (ransomSettlementDeposits.length || bondEventDeposits.length
    || Object.keys(asObject(getSpatialLedger(worldState, 'roadsRansomSettlements'))).length
    || Object.keys(asObject(getSpatialLedger(worldState, 'roadsBondEvents'))).length) {
    const tp = persistThirdPartyLedgers(nextWorldState, { ransomSettlements: ransomSettlementDeposits, bondEvents: bondEventDeposits }, weekClock, now2);
    if (tp.changed) { nextWorldState = tp.worldState; changed = true; }
  }

  // ── §11b THE EMBASSY SUIT LEDGER — carry live prior suits + the new heard suits (the war
  //    system's sue_for_peace weight consumes it; roads DEPOSITS, the war system CONSUMES).
  //    Persisted through the embassyLedger leaf (ceiling-safe; byte-identical). ──
  {
    const emb = persistEmbassySuits(nextWorldState, embassyDeposits, { weekClock, now2 });
    if (emb.changed) { nextWorldState = emb.worldState; changed = true; }
  }

  // ── §11b PURPOSE 7 THE RETURN-SIDE RUMOR WRITE (LAW 6 write g) — a returned verification
  //    traveller boosts the home ledger's records about the confirmed subject. Only fires when a
  //    verification mission arrived home this tick (⇒ dark/omniscient worlds never write). ──
  if (verificationReturns.length) {
    const priorRumors = getSpatialLedger(nextWorldState, 'rumorLedgers');
    let nextRumors = priorRumors;
    for (const v of verificationReturns) {
      const boosted = boostHomeRumorFidelity(/** @type {Record<string, unknown>} */ (nextRumors), v.homeId, v.subject, now2);
      if (boosted) nextRumors = boosted;
    }
    if (nextRumors !== priorRumors) {
      nextWorldState = setSpatialLedger(nextWorldState, 'rumorLedgers', /** @type {never} */ (nextRumors));
      changed = true;
    }
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
 * @param {Parameters<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions>[0] & { saves?: unknown }} args
 * @returns {ReturnType<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions>}
 */
export function advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads(args) {
  const prior = advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions(args);
  const roads = advanceRoads({
    snapshot: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).snapshot,
    worldState: prior.worldState,
    settlementUpdates: prior.settlementUpdates,
    graph: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).graph,
    saves: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args)).saves,
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
