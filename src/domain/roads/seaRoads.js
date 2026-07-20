/**
 * roads/seaRoads.js — DEEP COUPLINGS D-6 THE SEA ROADS (owner commission; DESIGN_DEEP_COUPLINGS
 * §10 binding). Envoys, embassies, and captives travel by sea: a mission's route already folds
 * sea edges when the digest is lit, so this slice adds MODALITY AWARENESS (per-hop land|sea), a
 * sea-aware current-leg read, and a PASS-3 SEA-HAZARD branch — blockade capture (S1), storm delay
 * (S2, priced not severed), and piracy (S3 = banditry-by-construction). NO parallel mission
 * system; sea legs EMERGE from route choice.
 *
 * DARK behind the VIRTUAL flag `seaRoadsEnabled` (§1 law 1; ABSENT from DEFAULT_SIMULATION_RULES,
 * read `=== true`). Flag absent ⇒ the roads mover never classifies legs or dispatches sea hazards
 * ⇒ byte-identical to folded-roads (the existing sea-aware ROUTING is unchanged — only the new
 * machinery gates). S1 additionally needs navalEnabled (blockades are a naval state); S2/S3 do
 * not (weather and pirates need no navy). PURE: this leaf decides, the mover applies.
 *
 * FIRST-PAINT LAW: a LAZY roads leaf, imported only from the lazy roads kernel + tests.
 *
 * @enforced-by tests/domain/seaRoads.test.js + tests/property/seaRoadsDormancyGolden.test.js
 */
import { createPRNG } from '../../kernel/prng.js';
import { hopWeeks } from '../spatial/distanceRead.js';
import { seaEdgesOfPath, activeBlockadeTargets, stormMultOf } from '../spatial/navalLayer.js';
import { embattlementLevel } from '../spatial/embattlement.js';
import { relationshipTypeBetween, atOpenWar } from './embassyHazard.js';
import { ROADS_TUNING, asObject, num, clampNum, clamp01, cmp, captureProbability } from './state.js';

// ── THE DORMANCY GATE (§1 law 1) ────────────────────────────────────────────────
/**
 * Is D-6 LIT? Reads simulationRules.seaRoadsEnabled === true, defensively. ABSENT ⇒ false ⇒
 * DORMANT (the mover classifies no legs, dispatches no sea hazards; byte-identical). Pure.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState @returns {boolean}
 */
export function seaRoadsActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).seaRoadsEnabled === true);
}

/** Is naval state live? (S1 blockade capture needs it; S2/S3 do not.) Pure.
 *  @param {{ simulationRules?: unknown }|null|undefined} worldState @returns {boolean} */
export function navalLit(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).navalEnabled === true);
}

// ── §10 TUNING (soak-certified; every entry vetoable) ───────────────────────────
export const SEA_ROADS_TUNING = Object.freeze({
  S1_BLOCKADE_BASE: 0.30, S1_BLOCKADE_ALPHA: 0.25, // a fleet respects an escort even less than an army (the T1 partial-bypass law at sea)
  S2_STORM_INCIDENCE: 0.20, // per autumn/winter sea-hop tick: stormChance = clamp((stormMult-1) × this, 0, MAX)
  S2_STORM_INCIDENCE_MAX: 0.40,
  S3_PIRACY_BASE: 0.12, S3_PIRACY_ALPHA: 1.0, // the T3 twin VERBATIM (× embattlement level)
  EMBATTLED_THRESHOLD: ROADS_TUNING.EMBATTLED_THRESHOLD, // 0.35 — the same land-T3 floor over the port node
});
const HOSTILE_RUNGS = new Set(['rival', 'cold_war', 'hostile']);

/**
 * §10(1) Classify a frozen path's hops as 'land'|'sea' AT DISPATCH from the digest's sea-edge
 * adjacency. Returns one entry per hop (path.length−1); an all-land path ⇒ all 'land'. Absent
 * digest / short path ⇒ []. Pure.
 * @param {import('../spatial/distanceRead.js').SpatialDigest} digest @param {string[]|null|undefined} path
 * @returns {Array<'land'|'sea'>}
 */
export function classifyLegModes(digest, path) {
  const nodes = Array.isArray(path) ? path.map(String) : [];
  if (nodes.length < 2) return [];
  const seaSet = new Set(seaEdgesOfPath(digest, nodes));
  /** @type {Array<'land'|'sea'>} */
  const modes = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const a = nodes[i]; const b = nodes[i + 1];
    modes.push(seaSet.has(a < b ? `${a}|${b}` : `${b}|${a}`) ? 'sea' : 'land');
  }
  return modes;
}

/**
 * §10(2) The current hop the traveller occupies + whether it is over water. Mirrors the mover's
 * currentHopOf interpolation but resolves the HOP (endpoints + modality) rather than the node.
 * legModes (frozen at dispatch) is authoritative; a legacy mission without it falls back to
 * classifying from the digest. VISITING (no in-transit hop) ⇒ overSea:false. Pure.
 * @param {Record<string, unknown>} m @param {number} weekClock
 * @param {import('../spatial/distanceRead.js').SpatialDigest} digest @param {string|null} season
 * @returns {{ overSea: boolean, a: string, b: string }}
 */
export function currentSeaHop(m, weekClock, digest, season) {
  const path = Array.isArray(m.path) ? /** @type {string[]} */ (m.path).map(String) : [];
  const last = path.length - 1;
  if (last < 1 || m.phase === 'visiting') return { overSea: false, a: '', b: '' };
  let nodeIdx;
  if (m.phase === 'outbound') {
    const span = Math.max(1, num(m.legArrivalTick, 0) - num(m.departTick, 0));
    const f = clamp01((weekClock - num(m.departTick, 0)) / span);
    nodeIdx = Math.floor(f * last);
  } else { // returning — reverse the frozen path
    const retWeeks = Math.max(1, num(hopWeeks(digest, String(m.destId), String(m.homeId), season), 1));
    const start = num(m.legArrivalTick, 0) - retWeeks;
    const g = clamp01((weekClock - start) / retWeeks);
    nodeIdx = Math.floor((1 - g) * last);
  }
  const hopIdx = m.phase === 'returning'
    ? clampNum(nodeIdx - 1, 0, last - 1) : clampNum(nodeIdx, 0, last - 1);
  const a = path[hopIdx]; const b = path[hopIdx + 1];
  const legModes = Array.isArray(m.legModes) ? /** @type {string[]} */ (m.legModes) : null;
  const overSea = legModes
    ? legModes[hopIdx] === 'sea'
    : new Set(seaEdgesOfPath(digest, path)).has(a < b ? `${a}|${b}` : `${b}|${a}`);
  return { overSea, a, b };
}

/** Is a blockader (or embattled port seat) hostile to the traveller's home? Pure.
 *  @param {Record<string, unknown>} graph @param {Record<string, unknown>} worldState
 *  @param {string} homeId @param {string} otherId @returns {boolean} */
function hostileToHome(graph, worldState, homeId, otherId) {
  if (!otherId || otherId === homeId) return false;
  if (atOpenWar(graph, homeId, otherId)) return true;
  return HOSTILE_RUNGS.has(String(relationshipTypeBetween(graph, worldState, homeId, otherId) || ''));
}

/**
 * @typedef {{ cls: 'S1'|'S2'|'S3', outcome: 'hostage'|'robbed'|'delayed', captorId: string, overSea: true, delayWeeks?: number }} SeaHazardResult
 */

/**
 * §10(3) THE SEA-HAZARD BRANCH — per-hop modality dispatch for an IN-TRANSIT SEA hop: S1 blockade
 * (capture; needs navalEnabled), S2 storm (delay only, season-scaled incidence — priced not
 * severed), S3 piracy (the T3 banditry twin over an embattled port node). At most ONE resolution
 * per tick (S1 → S2 → S3, first match — the no-double-jeopardy law across modalities). Returns
 * null when the hop is land, or when no sea hazard fires. PURE.
 * @param {Object} a
 * @param {Record<string, unknown>} a.m @param {number} a.weekClock
 * @param {import('../spatial/distanceRead.js').SpatialDigest} a.digest @param {string|null} a.season
 * @param {Record<string, unknown>} a.worldState @param {Record<string, unknown>} a.graph
 * @param {string} a.homeId @param {string} a.destId @param {number} a.exposure @param {number} a.protection
 * @param {ReturnType<typeof createPRNG>} a.fork  the shared roads-hazard fork (S1/S3 ride it)
 * @param {string} a.rngSeed @param {number} a.now2 @param {Set<string>} a.idSet
 * @returns {SeaHazardResult|null}
 */
export function resolveSeaHazard(a) {
  const T = SEA_ROADS_TUNING;
  const { overSea, a: nodeA, b: nodeB } = currentSeaHop(a.m, a.weekClock, a.digest, a.season);
  if (!overSea) return null;
  const ports = nodeA === nodeB ? [nodeA] : [nodeA, nodeB];

  // S1 — BLOCKADE (naval only): an endpoint port blockaded by a power hostile to home.
  if (navalLit(a.worldState)) {
    const blockades = activeBlockadeTargets(a.worldState);
    for (const port of ports) {
      const owners = blockades.get(port);
      if (!owners || !owners.size) continue;
      const hostile = [...owners].filter((o) => hostileToHome(a.graph, a.worldState, a.homeId, String(o))).sort(cmp);
      if (hostile.length) {
        const captorId = hostile[0];
        const p = captureProbability({ base: T.S1_BLOCKADE_BASE, exposure: a.exposure, protection: a.protection, alpha: T.S1_BLOCKADE_ALPHA });
        return a.fork.random() < p
          ? { cls: 'S1', outcome: 'hostage', captorId, overSea: true }
          : { cls: 'S1', outcome: 'delayed', captorId, overSea: true, delayWeeks: 1 };
      }
    }
  }

  // S2 — STORM (autumn/winter): NEVER capture, DELAY only. Season-scaled incidence off the frozen
  // slot's own stormSeasonCost (priced) — a dedicated fork so it composes without touching S1/S3.
  if (a.season === 'autumn' || a.season === 'winter') {
    const stormMult = stormMultOf(a.digest, a.season);
    const stormChance = clampNum((stormMult - 1) * T.S2_STORM_INCIDENCE, 0, T.S2_STORM_INCIDENCE_MAX);
    const stormFork = createPRNG(`${a.rngSeed}::roads-sea:storm:${String(a.m.id)}:${a.now2}`);
    if (stormFork.random() < stormChance) {
      const delayWeeks = 1 + (stormFork.random() < 0.5 ? 0 : 1); // 1–2 weeks
      return { cls: 'S2', outcome: 'delayed', captorId: '', overSea: true, delayWeeks };
    }
  }

  // S3 — PIRACY: an embattled port node (the T3 twin verbatim; "piracy" is prose, never new math).
  for (const port of ports) {
    const level = embattlementLevel(a.worldState, port);
    if (level >= T.EMBATTLED_THRESHOLD) {
      const captorId = a.idSet.has(port) ? port : a.destId;
      const p = captureProbability({ base: T.S3_PIRACY_BASE * level, exposure: a.exposure, protection: a.protection, alpha: T.S3_PIRACY_ALPHA });
      return a.fork.random() < p
        ? { cls: 'S3', outcome: 'hostage', captorId, overSea: true }
        : { cls: 'S3', outcome: 'robbed', captorId, overSea: true };
    }
  }
  return null;
}
