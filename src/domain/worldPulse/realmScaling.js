/**
 * realmScaling.js — D2 THE SCALING LAW (DESIGN_SIM_DEPTH_R2 §D2).
 *
 * The world scales by LOCALITY: per-settlement interaction density is realm-size-
 * invariant, while realm-GLOBAL budgets grow SUBLINEARLY (√N) so a big realm samples
 * highlights instead of drowning in N-linear cacophony. Every scaled budget reduces to
 * its exact base value at N ≤ BASE_REALM — dormancy by ARITHMETIC (no flag): every
 * existing campaign and golden runs a realm ≤ BASE_REALM, so the bonus is exactly 0 and
 * the constant is byte-identical. Scaling activates only ABOVE the base.
 *
 * Constants named, frozen, owner-retunable (the soak's settlement-cap study tunes them).
 * BASE_REALM (24) sits above every same-seed golden's realm size (≤ 12) and the soaks
 * (≤ 8), so the whole existing estate is byte-identical by construction.
 *
 * Lazy leaf: pure arithmetic, zero imports, imported only by lazy kernels ⇒ zero eager.
 *
 * WIRED this wave (design §D2a/§D2c): the ATTENTION budget (tempo classMax, narrativeTempo)
 * and the DECISION-THROUGHPUT budgets (rollCandidates maxAuto/maxProposals, pulseKernel).
 *
 * VERIFIED unchanged (design §D2b): supplyShipments top-k (K_SOURCES) is a LOCAL
 * per-destination/per-input constant — realm-size-invariant by construction, so it correctly
 * does NOT scale (pinned in realmScaling.test.js).
 *
 * SEAM — deliberately deferred, documented, not a bug to re-find (design §D2c, the DM's
 * "memory of the world" caps): the proposal-ring cap (MAX_PROPOSALS, worldState.js), the
 * wizardNews retention (240), and the regional terminal-impact retention (250) still want the
 * same √N form + a per-settlement rescue. They are NOT wired because their functions
 * (upsertProposal / capEntries / the graph impact cap) do not receive N and threading the
 * realm size through each is a broader change; the eviction-is-receipted half those caps
 * depend on ALREADY landed (worldpulse-tick-core-2, upsertProposal). Wire by passing the
 * realm size into those three chokepoints and applying sublinearBudget(base, N).
 */

export const REALM_SCALING = Object.freeze({
  BASE_REALM: 24,
  // Attention (tempo classMax) — DESIGN §D2a.
  TEMPO_SCALE_PER_ROOT: 1,
  // Decision throughput (rollCandidates maxAuto / maxProposals) — DESIGN §D2c.
  AUTO_SCALE_PER_ROOT: 1,
  PROPOSAL_SCALE_PER_ROOT: 1,
});

/**
 * The sublinear bonus for a realm-global budget: floor(√(max(0, N − base)) × scalePerRoot).
 * Exactly 0 when N ≤ base (byte-identity), then grows √-sublinearly. Deterministic and
 * order-independent (reads only the scalar realm size).
 * @param {number} n realm settlement count
 * @param {number} [base]
 * @param {number} [scalePerRoot]
 * @returns {number}
 */
export function sublinearBonus(n, base = REALM_SCALING.BASE_REALM, scalePerRoot = 1) {
  const excess = Math.max(0, (Number.isFinite(n) ? n : 0) - base);
  return Math.floor(Math.sqrt(excess) * scalePerRoot);
}

/**
 * A realm-scaled budget: baseValue + the sublinear bonus. Reduces to baseValue exactly at
 * N ≤ base (the load-bearing byte-identity property).
 * @param {number} baseValue @param {number} n @param {number} [base] @param {number} [scalePerRoot]
 * @returns {number}
 */
export function sublinearBudget(baseValue, n, base = REALM_SCALING.BASE_REALM, scalePerRoot = 1) {
  return baseValue + sublinearBonus(n, base, scalePerRoot);
}
