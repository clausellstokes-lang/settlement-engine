/**
 * roadsKernel.js — THE ROADS (owner commission, ENGINE LIFT #5: named-NPC travel · capture
 * · ransom · conversion; DESIGN_THE_ROADS.md is binding law). Slice R-1b — THE FLAG + THE
 * MOVER SKELETON.
 *
 * WHAT THIS SLICE OWNS (R-1b): the tick-time MOVER seam — a lazy leaf that NAME-SWAPS the
 * pulse chain (advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions →
 * …AndTraditionsAndRoads), running LAST over the fully-settled tick so it reads THIS tick's
 * traditions windows (observances/guest-right) and THIS tick's armies/embattlement
 * (hazards); the DORMANCY GATE (roadsActive) + the SPATIAL GATE (activeSpatialDigest —
 * aspatial/teleport campaigns stay dormant, byte-identical, the migration §9 precedent).
 *
 * R-1 is the SKELETON: the lit body is a structural no-op. MISSION GENESIS + ROUTING land
 * in R-2 (advanceLitRoads grows here), THE GAUNTLET in R-3, CAPTIVITY in R-4.
 *
 * SINGLE-WRITER + WRITE-BOUNDED (§1 law 6): the mover will write ONLY its own
 * spatialLedgers.roads sidecar, the npc.whereabouts display mirror (settlementUpdates),
 * publicLegitimacy.score (the applyLegitimacySteps idiom), prosperity band-steps (the
 * applyProsperityBandSteps idiom), wizardNews entries, and the returned-captive channel
 * record consumed by the corruption web's OWN creation pass. NEVER faction.power (derivation
 * output) and NEVER ladder standing (the ladder's single-writer law). It banks NO
 * out-of-band residue ⇒ NO RESIDUE_STRIP_SITES entry (pulseKernel.js:121 registry untouched).
 *
 * THE PULSE SEAM (ceiling discipline §1 law 10): pulseKernel is at its frozen effective-line
 * ceiling, so this leaf exports
 * advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads — the traditions-
 * composed chain with the roads mover composed LAST. pulseKernel's existing chain
 * import/call is NAME-SWAPPED (the traditions/ladder/provenanceKernel idiom — a swap, not a
 * new line).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf — imported ONLY from the lazy pulse engine
 * (pulseKernel, at the mover seam). Never from the first-paint entry closure.
 *
 * Pure, deterministic, side-effect-free, clock-free. The YEARLY cadence gate uses a tick-
 * invariant WORLD-seed fork; per-tick event draws fork the pulse rng confluence with stable
 * labels (§1 law 9) — labels are LOAD-BEARING.
 *
 * @enforced-by tests/property/roadsDormancyGolden.test.js (dormancy byte-identity + the lit
 *   anti-vacuity block) + tests/domain/roadsKernel.test.js.
 */
import { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions } from './traditionsKernel.js';
import { roadsActive } from '../roads/state.js';
import { activeSpatialDigest } from '../spatial/distanceRead.js';

/**
 * @typedef {Object} RoadsAdvanceResult
 * @property {Array<Record<string, unknown>>} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 */

/**
 * Advance the roads layer one pulse. DORMANT (flag absent, or no spatial canon) ⇒ a
 * complete no-op (byte-identical). Lit ⇒ (R-2+) prune, advance phases, evaluate the
 * gauntlet, tick ransoms, mint new missions, project the mirror, narrate. Deterministic.
 * @param {Record<string, unknown>} args
 *   { snapshot, worldState, settlementUpdates, graph, tick, now }
 * @returns {RoadsAdvanceResult}
 */
export function advanceRoads(args) {
  const a = args && typeof args === 'object' ? args : {};
  const worldState = /** @type {Record<string, unknown>} */ (a.worldState || {});
  const updates = Array.isArray(a.settlementUpdates) ? a.settlementUpdates : [];
  // ── DORMANCY GATE: the flag absent ⇒ an immediate no-op. No key, no mirror, no news. ──
  if (!roadsActive(worldState)) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }
  // ── SPATIAL GATE: no spatial canon ⇒ dormant (aspatial/teleport campaigns), byte-
  //    identical — the roads live only on the trade graph (the migration §9 precedent). ──
  const digest = activeSpatialDigest(worldState);
  if (!digest) {
    return { worldState, settlementUpdates: updates, changed: false, newsEntries: [] };
  }
  return advanceLitRoads({ ...a, worldState, settlementUpdates: updates, digest });
}

/**
 * The LIT roads advance (never entered dark or aspatial). R-1 SKELETON: a structural no-op
 * — the lit path exists and is deterministic, but genesis/routing (R-2), the gauntlet
 * (R-3), and captivity (R-4) are not wired yet. Returns changed:false so the pulse fold is
 * byte-identical until R-2 lands the first mission.
 * @param {Record<string, unknown>} args
 * @returns {RoadsAdvanceResult}
 */
function advanceLitRoads(args) {
  return {
    worldState: /** @type {Record<string, unknown>} */ (args.worldState),
    settlementUpdates: /** @type {Array<Record<string, unknown>>} */ (args.settlementUpdates),
    changed: false,
    newsEntries: [],
  };
}

// ── THE PULSE SEAM — the traditions chain composed with the roads mover ─────────
/**
 * The growth+fabric+consequence+ladder+traditions chain composed with the roads mover: the
 * traditions-composed chain first, then roads LAST over the fully-settled tick (it reads
 * this tick's settled traditions windows + armies/embattlement). pulseKernel calls THIS in
 * place of advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditions (a name swap on
 * the existing import/call — zero new effective lines in the ceiling'd file; the traditions/
 * ladder/provenanceKernel idiom). Roads dark/aspatial ⇒ an exact no-op inside the
 * composition (the prior result passes through byte-identical). No cycle: this leaf imports
 * the traditions kernel; none import back.
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
