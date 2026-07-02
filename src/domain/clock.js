/**
 * domain/clock.js — the single sanctioned wall-clock read in the domain kernel.
 *
 * The domain layer is otherwise a pure function of its inputs; eslint forbids
 * `new Date()` / `Date.now()` in every src/domain file EXCEPT this one (the same
 * pattern as rngContext/prng for randomness). Domain functions thread an explicit
 * `now` from their caller and fall back to wallClockNow() only at a boundary, so
 * tests stay deterministic by passing `now`, and production still reads real time
 * — through this one documented, greppable, mockable seam.
 */

/** @returns {string} the current wall-clock instant as an ISO-8601 string. */
export const wallClockNow = () => new Date().toISOString();

/** @returns {number} the current wall-clock instant in epoch milliseconds. */
export const wallClockMs = () => Date.now();

/**
 * Fail-loud in a Node test run when a byte-equivalence-critical entry point falls
 * back to the wall clock instead of a caller-pinned `now`. Unpinned `now` makes two
 * same-seed calls diverge byte-wise (every graph updatedAt / news discoveredAt
 * differs), silently forfeiting the reproducibility the world-pulse kernel otherwise
 * guarantees. This turns "pin `now`" from a convention every future caller must
 * remember into a structural guard: in `NODE_ENV==='test'` an unpinned call throws;
 * in the browser / production it is a no-op (real callers pin `now`, and the boundary
 * wall-clock fallback is legitimate there). Mirrors residueStripGuard's test-gating.
 * @param {string} site  the entry point name, for the error message
 */
export function assertNowPinnedInTest(site) {
  const p = /** @type {any} */ (globalThis).process;
  if (p && p.env && p.env.NODE_ENV === 'test') {
    throw new Error(
      `[clock] ${site} fell back to wallClockNow() with no pinned \`now\`. Pass an explicit ` +
      `\`now\` (a fixed ISO-8601 string) — unpinned now makes same-seed runs diverge byte-wise, ` +
      `forfeiting reproducibility. Production callers already pin it; a test must too.`,
    );
  }
}
