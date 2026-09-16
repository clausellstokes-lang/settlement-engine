/**
 * roads/embassyHazard.js — §11b R-8 THE EMBASSY EXTENSION hazard subsystem (ENGINE LIFT #5;
 * DESIGN_THE_ROADS.md §11b). A LAZY leaf split out of the mover (roadsKernel) to keep it under
 * the hot-file ceiling (law 10: engine logic lives in leaves, not the capped mover). Pure,
 * deterministic, side-effect-free.
 *
 * WHAT THIS LEAF OWNS: the war-read helpers shared by the mover (relationshipTypeBetween /
 * atOpenWar / atWarWith), and the whole embassy hazard — the two venues (road parley · court
 * suit), the third-party rule, and the interception race (the informed-hunter read + the hunt
 * amplifier). The mover consumes evaluateEmbassyHazard + embassyEnvoyMetrics and reuses the
 * war-reads at its other threat sites.
 *
 * @enforced-by tests/domain/roadsEmbassy.test.js
 */
import { warFrontsInto, warFrontsFrom } from '../worldPulse/warFrontReads.js';
import { currentRegion } from '../spatial/armyTransit.js';
import { beliefsActive } from '../worldPulse/beliefMap.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { rumorEventKey } from '../spatial/rumorNetwork.js';
import {
  ROADS_TUNING, captureProbability, factionPowerStanding01, embassyEnvoyWeight01, embassyAmplifier,
  embassyReceivedP, embassyDetainShare, embassySuitIntensity01, asObject, num, clampNum, cmp,
} from './state.js';

/** @param {unknown} v @returns {string} */
function str(v) { return v == null ? '' : String(v); }

const HOSTILE_RUNGS = new Set(['rival', 'cold_war', 'hostile']);

/**
 * The relationship rung between two settlements (graph edge relationshipType, falling back to
 * worldState.relationshipStates) — 'rival'|'cold_war'|'hostile'|… or ''. Pure.
 * @param {Record<string, unknown>} graph @param {Record<string, unknown>} worldState
 * @param {string} a @param {string} b @returns {string}
 */
export function relationshipTypeBetween(graph, worldState, a, b) {
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
 * Is the traveller's home at OPEN WAR with the host — a live war-layer front either direction
 * (§7 restraint / §9)? Pure.
 * @param {Record<string, unknown>} graph @param {string} homeId @param {string} hostId @returns {boolean}
 */
export function atOpenWar(graph, homeId, hostId) {
  return warFrontsInto(graph, hostId).includes(homeId)
    || warFrontsFrom(graph, hostId).includes(homeId)
    || warFrontsInto(graph, homeId).includes(hostId)
    || warFrontsFrom(graph, homeId).includes(hostId);
}

/**
 * Is `a` at open war with `b` — a live war-layer front OR a `hostile` relationship rung (§4:
 * "hostile = open war")? The sanctioned trigger for a peace embassy, consistent with the §9
 * hostileAtCapture/peace early-release reads. Pure.
 * @param {Record<string, unknown>} graph @param {Record<string, unknown>} worldState @param {string} a @param {string} b @returns {boolean}
 */
export function atWarWith(graph, worldState, a, b) {
  return atOpenWar(graph, a, b) || relationshipTypeBetween(graph, worldState, a, b) === 'hostile';
}

/** Is this mission a peace embassy (purpose 5)? Pure. @param {Record<string, unknown>} m @returns {boolean} */
export function isEmbassy(m) { return str(asObject(m).purpose && asObject(asObject(m).purpose).kind) === 'embassy'; }

/**
 * Has `observerId` become an INFORMED HUNTER of embassy `missionId` by `now` (§11b THE
 * INTERCEPTION RACE)? Omniscient / no-belief ⇒ TRUE (known ≡ true — the hunter knows from the
 * first tick, the §5/knownWorld law). Otherwise the observer's rumor ledger must have RECEIVED
 * the quiet embassy-departure event (arrivalTick ≤ now — the news outran, or did not outrun,
 * the mission). No new carrier: the EXISTING rumor lattice seeded/relayed the news. Pure.
 * @param {Record<string, unknown>} worldState @param {string} observerId @param {string} missionId @param {number} now @returns {boolean}
 */
function isInformedHunter(worldState, observerId, missionId, now) {
  if (!beliefsActive(worldState)) return true; // omniscient ⇒ hunts from tick 0
  const ledgers = asObject(getSpatialLedger(/** @type {never} */ (worldState), 'rumorLedgers'));
  const rec = asObject(asObject(ledgers[String(observerId)])[rumorEventKey(`embassy-depart.${missionId}`)]);
  return rec != null && num(rec.arrivalTick, Infinity) <= now;
}

/**
 * The TARGET's own army column on the traveller's hop (the ROAD PARLEY trigger, §11b): its home
 * id when present, else null. Pure.
 * @param {Record<string, unknown>} armyLedger @param {string} hop @param {string} targetId @returns {string|null}
 */
function targetArmyOnHop(armyLedger, hop, targetId) {
  for (const key of Object.keys(armyLedger).sort(cmp)) {
    const rec = asObject(armyLedger[key]);
    if (currentRegion(/** @type {import('../spatial/armyTransit.js').ArmyTransitRecord} */ (rec)) !== hop) continue;
    if (str(rec.armyId || rec.originId) === String(targetId)) return String(targetId);
  }
  return null;
}

/**
 * A THIRD-PARTY interceptor army on the traveller's hop (§11b THE THIRD-PARTY RULE + THE
 * INTERCEPTION RACE): an army whose home P ≠ home ≠ target is EITHER hostile to home (a plain
 * enemy — "simply take them hostage") OR an INFORMED HUNTER at war with the target (actively
 * looking to kill the peace). A hunter at war with the target but UNINFORMED and NOT hostile to
 * home does not act (it neither knows nor cares this tick). Returns { captorId, isHunter } for the
 * first (codepoint-sorted) such army, else null. Pure.
 * @param {Record<string, unknown>} armyLedger @param {Record<string, unknown>} graph @param {Record<string, unknown>} worldState
 * @param {string} hop @param {string} homeId @param {string} targetId @param {string} missionId @param {number} now
 * @returns {{ captorId: string, isHunter: boolean }|null}
 */
function interceptorArmyOnHop(armyLedger, graph, worldState, hop, homeId, targetId, missionId, now) {
  for (const key of Object.keys(armyLedger).sort(cmp)) {
    const rec = asObject(armyLedger[key]);
    if (currentRegion(/** @type {import('../spatial/armyTransit.js').ArmyTransitRecord} */ (rec)) !== hop) continue;
    const p = str(rec.armyId || rec.originId);
    if (!p || p === homeId || p === String(targetId)) continue;
    const rt = relationshipTypeBetween(graph, worldState, p, homeId);
    const hostileToHome = HOSTILE_RUNGS.has(rt)
      || warFrontsInto(graph, homeId).includes(p) || warFrontsFrom(graph, homeId).includes(p);
    const hunter = atWarWith(graph, worldState, p, String(targetId)) && isInformedHunter(worldState, p, missionId, now);
    if (hostileToHome || hunter) return { captorId: p, isHunter: hunter };
  }
  return null;
}

/**
 * The envoy weight + insult/humility amplifier for a peace suit (§11b THE AMPLIFIER). Pure.
 * @param {Record<string, unknown>} homeSettlement @param {Record<string, unknown>} npc @param {number} importanceWeight01
 * @returns {{ envoyWeight01: number, amplifier: number }}
 */
export function embassyEnvoyMetrics(homeSettlement, npc, importanceWeight01) {
  const envoyWeight01 = embassyEnvoyWeight01({
    importanceWeight01, factionPower01: factionPowerStanding01(homeSettlement, npc),
  });
  return { envoyWeight01, amplifier: embassyAmplifier(envoyWeight01) };
}

/**
 * THE VENUE DISPOSITION ROLL (§11b — road parley or court suit): the court/parley captor rolls
 * RECEIVED (the suit is heard ⇒ deposit + escort home), HOSTAGE (standard ransom, captor = the
 * target), or TURNED HOME (expulsion-shape return). The insult/humility amplifier shifts it —
 * humility toward received, insult toward detention. NEVER worse than hostage (the no-death law
 * in period costume). Pure (consumes the mission fork).
 * @param {{ fork: { random: () => number }, amplifier: number, envoyWeight01: number, captorId: string, venue: string, cls: string }} a
 * @returns {{ cls: string, outcome: string, captorId: string, venue: string, envoyWeight01?: number, amplifier?: number, intensity01?: number }}
 */
function embassyDisposition(a) {
  const receivedP = embassyReceivedP(a.amplifier);
  const r = a.fork.random();
  if (r < receivedP) {
    return {
      cls: a.cls, outcome: 'embassy_received', captorId: a.captorId, venue: a.venue,
      envoyWeight01: a.envoyWeight01, amplifier: a.amplifier, intensity01: embassySuitIntensity01(a.envoyWeight01),
    };
  }
  const detainShare = embassyDetainShare(a.amplifier);
  if (r < receivedP + (1 - receivedP) * detainShare) {
    return { cls: a.cls, outcome: 'hostage', captorId: a.captorId, venue: a.venue };
  }
  return { cls: a.cls, outcome: 'embassy_turned_home', captorId: a.captorId, venue: a.venue };
}

/**
 * THE EMBASSY HAZARD (§11b): the two venues + the third-party rule + the interception race. In
 * transit — an INFORMED third-party hunter or a plain home-enemy intercepts (capture; the suit
 * dies unheard; the hunt amplifier lifts an informed hunter's roll) BEFORE the TARGET's own
 * column can convert the encounter into a ROAD PARLEY (disposition). Visiting the target gate is
 * the COURT SUIT (disposition). Returns a resolution, or null when nothing embassy-specific fires
 * (an in-transit embassy then falls through to the apolitical T3 bandit class). Pure (consumes
 * the mission fork).
 * @param {{ mid: string, homeId: string, targetId: string, phase: string, hop: string, protection: number, exposure: number, fork: { random: () => number }, graph: Record<string, unknown>, worldState: Record<string, unknown>, armyLedger: Record<string, unknown>, now2: number, amplifier: number, envoyWeight01: number }} a
 * @returns {{ cls: string, outcome: string, captorId: string, venue?: string, hunted?: boolean, envoyWeight01?: number, amplifier?: number, intensity01?: number }|null}
 */
export function evaluateEmbassyHazard(a) {
  const { mid, homeId, targetId, phase, hop, protection, exposure, fork, graph, worldState, armyLedger, now2, amplifier, envoyWeight01 } = a;
  if (phase !== 'visiting') {
    const interceptor = interceptorArmyOnHop(armyLedger, graph, worldState, hop, homeId, targetId, mid, now2);
    if (interceptor) {
      let p = captureProbability({ base: ROADS_TUNING.T1_BASE, exposure, protection, alpha: ROADS_TUNING.T1_ALPHA });
      if (interceptor.isHunter) p = clampNum(p * ROADS_TUNING.HUNT_AMPLIFIER, 0, ROADS_TUNING.CAPTURE_CAP);
      return fork.random() < p
        ? { cls: 'T1', outcome: 'hostage', captorId: interceptor.captorId, hunted: interceptor.isHunter }
        : { cls: 'T1', outcome: 'delayed', captorId: interceptor.captorId };
    }
    if (targetArmyOnHop(armyLedger, hop, targetId)) {
      return embassyDisposition({ fork, amplifier, envoyWeight01, captorId: targetId, venue: 'road_parley', cls: 'T1' });
    }
    return null; // no army on the road — the apolitical T3 bandit class still evaluates
  }
  // At the target's gate — the COURT SUIT (a besieged/occupied court still hears the envoy in v1).
  return embassyDisposition({ fork, amplifier, envoyWeight01, captorId: targetId, venue: 'court_suit', cls: 'T4' });
}
