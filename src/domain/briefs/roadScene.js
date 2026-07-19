/**
 * domain/briefs/roadScene.js — THE ROAD SCENE composer (DESIGN_THE_ROADS §14). The party
 * (the PLAYER's group) is NEVER a sim entity — this is a LENS + a COMPOSER: it reads TRUTH at
 * the current tick and returns a sourced Brief bundle. It writes NOTHING (the zero-write pin:
 * compose leaves worldState reference-equal).
 *
 * The briefs/composers S2 idiom: pure, citation-law via ./citations.js, INERT-NOT-CRASH — a
 * quiet realm yields dropped (empty) sections, never a throw. AUDIENCE = 'dm' (§15: every
 * road-scene section reads truth and is DM-SECRET; a player-safe variant is a deferred seam §21).
 *
 * Sections:
 *   THE ROAD    — the chosen route (chooseRoute over TRUTH) with per-hop conditions
 *                 (embattlement level/phase, banditry ground, tolls).
 *   ON THE ROAD — armies on the route (+ heading/allegiance), migrant columns (+ causal reason),
 *                 traveling named NPCs (+ purpose + escort posture).
 *   AT THE GATES — the destination: siege / occupation rung / festival + guest-right note.
 *
 * REGISTRY-DRIVEN PURPOSES: purpose labels derive from PURPOSE_KINDS (state.js) with a generic
 * fallback, so a future purpose (the §11b embassy extension) extends without a rewrite here.
 *
 * @enforced-by tests/domain/roadSceneComposer.test.js
 */

import {
  asObject, num, clampNum, cmp, PURPOSE_KINDS,
} from '../roads/state.js';
import { activeSpatialDigest, getSpatialLedger } from '../spatial/distanceRead.js';
import { chooseRoute, embattlementLevel, tollRateOf } from '../spatial/embattlement.js';
import { currentRegion } from '../spatial/armyTransit.js';
import { warFrontsInto } from '../worldPulse/warFrontReads.js';
import { seasonForTick } from '../worldPulse/worldState.js';
import { migrationColumnReason } from '../roads/migrationReason.js';
import { SOURCE, section, assembleBrief } from './citations.js';

const DEFAULT_RISK = 0.65; // the party sees the real best road (a middling risk tolerance)
/** @param {number} n @returns {number} */
const round2 = (n) => Math.round(n * 100) / 100;
/** @param {unknown} v @returns {string} */
const str = (v) => (v == null ? '' : String(v));

/** A `(id) => name` resolver from a settlements list (full or {id,name}). Pure.
 *  @param {unknown} settlements @returns {(id: unknown) => string} */
function nameResolver(settlements) {
  const byId = new Map();
  for (const s of Array.isArray(settlements) ? settlements : []) {
    const so = asObject(s);
    const id = so.id ?? asObject(so.settlement).id;
    const name = so.name ?? asObject(so.settlement).name;
    if (id != null) byId.set(String(id), name != null ? String(name) : String(id));
  }
  return (id) => byId.get(String(id)) || String(id ?? '');
}

const PURPOSE_LABEL = Object.freeze({ observance: 'a tradition observance', trade: 'trade business', diplomacy: 'a diplomatic errand', ladder: 'a personal ambition' });
/** Registry-driven purpose label (PURPOSE_KINDS + a generic fallback so R-8 purposes read
 *  gracefully, never a hardcoded-complete list). Pure. @param {unknown} kind @returns {string} */
function purposeLabel(kind) {
  const k = str(kind);
  if (PURPOSE_KINDS.includes(k) && (/** @type {Record<string, string>} */ (PURPOSE_LABEL))[k]) return (/** @type {Record<string, string>} */ (PURPOSE_LABEL))[k];
  return k ? `${k} business` : 'business abroad';
}

/** The per-hop road condition from the embattlement level. Pure. @param {number} level @returns {string} */
function conditionLabel(level) {
  if (level >= 0.35) return 'embattled — bandit ground';
  if (level >= 0.15) return 'unsettled';
  return 'quiet';
}

/** The escort posture band from the frozen escort01 military-quality scalar. Pure.
 *  @param {number} escort01 @returns {string} */
function escortBand(escort01) {
  const q = clampNum(num(escort01, 1), 0.6, 1.6);
  if (q >= 1.2) return 'a strong escort';
  if (q >= 0.9) return 'a standard escort';
  return 'a light guard';
}

/** Is a host tradition window ACTIVE this week (festival / guest-right)? Pure.
 *  @param {unknown} hostRecs @param {number} weekOfYear @returns {boolean} */
function hostHasActiveWindow(hostRecs, weekOfYear) {
  for (const r of Array.isArray(hostRecs) ? hostRecs : []) {
    const rec = asObject(r);
    if (rec.suppressedBy) continue;
    const start = clampNum(num(asObject(rec.window).startWeekOfYear, 1), 1, 52);
    const weeks = clampNum(num(asObject(rec.window).weeks, 1), 1, 2);
    if (weekOfYear >= start && weekOfYear <= start + weeks - 1) return true;
  }
  return false;
}

/**
 * Compose the road-scene brief bundle. Pure; INERT-NOT-CRASH; leaves worldState reference-equal.
 * @param {{ originId?: unknown, destId?: unknown, worldState?: unknown, settlements?: unknown,
 *   regionalGraph?: unknown, tick?: unknown, season?: string|null }} args
 * @returns {import('./citations.js').Brief}
 */
export function composeRoadSceneBrief(args) {
  const a = asObject(args);
  const worldState = asObject(a.worldState);
  const graph = asObject(a.regionalGraph);
  const digest = activeSpatialDigest(worldState);
  const from = str(a.originId); const to = str(a.destId);
  const nowTick = Math.floor(num(a.tick ?? worldState.tick, 0));
  const clock = seasonForTick(num(asObject(worldState.calendar).elapsedWeeks, nowTick));
  const season = a.season != null ? String(a.season) : clock.season;
  const weekOfYear = num(clock.weekOfYear, 1);
  const nameOf = nameResolver(a.settlements);

  // THE ROUTE (over TRUTH — the party sees the real best road). Null ⇒ every section drops.
  const route = (digest && from && to) ? chooseRoute(digest, worldState, from, to, DEFAULT_RISK, season) : null;
  const path = route && Array.isArray(route.path) ? route.path.map(str) : [];
  const pathSet = new Set(path);

  // ── SECTION 1: THE ROAD — per-hop conditions ──
  /** @type {Array<Record<string, unknown>>} */
  const roadItems = [];
  if (path.length >= 2) {
    roadItems.push({ leg: `${nameOf(from)} → ${nameOf(to)}`, hops: path.length - 1, danger: round2(num(route && route.danger, 0)), tolls: round2(num(route && route.toll, 0)) });
    for (const hop of path) {
      const level = embattlementLevel(worldState, hop);
      const toll = tollRateOf(worldState, hop);
      /** @type {Record<string, unknown>} */
      const item = { at: nameOf(hop), condition: conditionLabel(level), embattlement: round2(level) };
      if (toll > 0) item.toll = round2(toll);
      roadItems.push(item);
    }
  }

  // ── SECTION 2: ON THE ROAD — armies, migrant columns, envoys crossing the route ──
  /** @type {Array<Record<string, unknown>>} */
  const onRoad = [];
  const armyLedger = asObject(getSpatialLedger(worldState, 'armyTransit'));
  for (const key of Object.keys(armyLedger).sort(cmp)) {
    const rec = asObject(armyLedger[key]);
    const region = currentRegion(/** @type {import('../spatial/armyTransit.js').ArmyTransitRecord} */ (rec));
    if (!pathSet.has(str(region))) continue; // only columns ON the route
    onRoad.push({ kind: 'army', banner: nameOf(rec.armyId || rec.originId), at: nameOf(region), heading: nameOf(rec.destId), posture: str(rec.role) || 'march' });
  }
  const migLedger = asObject(getSpatialLedger(worldState, 'migration'));
  for (const key of Object.keys(migLedger).sort(cmp)) {
    const rec = asObject(migLedger[key]);
    const o = str(rec.originId); const d = str(rec.destId);
    if (!o || !d || (!pathSet.has(o) && !pathSet.has(d))) continue; // touching the route
    onRoad.push({ kind: 'migrants', from: nameOf(o), to: nameOf(d), arrivals: num(rec.arrivals, 0), reason: migrationColumnReason(worldState, a.settlements, o, d) });
  }
  const missions = asObject(asObject(asObject(worldState.spatialLedgers).roads).missions);
  for (const mid of Object.keys(missions).sort(cmp)) {
    const m = asObject(missions[mid]);
    const mpath = Array.isArray(m.path) ? m.path.map(str) : [];
    if (!mpath.some((id) => pathSet.has(id))) continue;
    onRoad.push({ kind: 'envoy', npc: str(m.npcName), home: nameOf(m.homeId), heading: nameOf(m.destId), purpose: purposeLabel(asObject(m.purpose).kind), escort: escortBand(num(m.escort01, 1)) });
  }

  // ── SECTION 3: AT THE GATES — destination context ──
  /** @type {Array<Record<string, unknown>>} */
  const gates = [];
  const occ = asObject(asObject(worldState.occupations)[to]);
  if (occ.occupierId) gates.push({ state: 'occupied', by: nameOf(occ.occupierId), rung: str(occ.state) || 'contested' });
  const besiegers = warFrontsInto(graph, to);
  if (besiegers.length) gates.push({ state: 'under siege', by: [...besiegers].map(nameOf).sort(cmp).join(', ') });
  const traditionsLedger = asObject(getSpatialLedger(worldState, 'traditions'));
  if (hostHasActiveWindow(traditionsLedger[to], weekOfYear)) {
    gates.push({ state: 'a festival is on', guestRight: 'the guest-right holds — a host is loath to seize a visitor mid-observance' });
  }

  return assembleBrief({
    kind: 'roadScene',
    audience: 'dm',
    sections: [
      section('road', `The road to ${nameOf(to) || 'the destination'}`, SOURCE.ROADS_TRUTH, roadItems),
      section('onRoad', 'On the road', SOURCE.ROADS_TRUTH, onRoad),
      section('gates', `At the gates of ${nameOf(to) || 'the destination'}`, SOURCE.ROADS_TRUTH, gates),
    ],
  });
}

/** THE ZERO-WRITE PIN helper: compose + assert reference-equality of worldState (the composer
 *  is a pure read). Exposed so the surface and the pin share one call. Pure.
 *  @param {Parameters<typeof composeRoadSceneBrief>[0]} args
 *  @returns {{ brief: import('./citations.js').Brief, wrote: boolean }} */
export function composeRoadSceneChecked(args) {
  const ws = asObject(args).worldState;
  const brief = composeRoadSceneBrief(args);
  return { brief, wrote: asObject(args).worldState !== ws };
}
