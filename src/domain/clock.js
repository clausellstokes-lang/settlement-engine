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
 * Are we inside a test run? THE ONE any-cast in this module, and it is shared rather than
 * duplicated: `globalThis.process` is not in the DOM lib, so reading it costs a cast, and
 * `tests/lint/domainAnyCastBaseline.test.js` is a MONOTONE-DOWN ratchet — a second copy of
 * this idiom cannot be baselined, only removed. EP-1 extracted this when its twin guard
 * below would otherwise have been the second hole.
 * @returns {boolean}
 */
const inTestRun = () => {
  const p = /** @type {any} */ (globalThis).process;
  return !!(p && p.env && p.env.NODE_ENV === 'test');
};

/**
 * Structural pin-`now` guard for the world-pulse kernel. A pulse entry point that
 * falls back to the wall clock instead of a caller-pinned `now` makes two same-seed
 * calls diverge byte-wise (every graph updatedAt / news discoveredAt differs),
 * silently forfeiting reproducibility. This turns "pin `now`" from a convention every
 * future caller must remember into a structural guard: in `NODE_ENV==='test'` an
 * unpinned call throws; in the browser / production it is a no-op (real callers pin
 * `now`, and the boundary wall-clock fallback is legitimate there). Mirrors
 * residueStripGuard's test-gating.
 * @param {string} site  the entry point name, for the error message
 */
export function assertNowPinnedInTest(site) {
  if (inTestRun()) {
    throw new Error(
      `[clock] ${site} fell back to wallClockNow() with no pinned \`now\`. Pass an explicit ` +
      `\`now\` (a fixed ISO-8601 string) — unpinned now makes same-seed runs diverge byte-wise, ` +
      `forfeiting reproducibility. Production callers already pin it; a test must too.`,
    );
  }
}

/**
 * Structural pin-`advanceEpoch` guard — assertNowPinnedInTest's twin, and it lives here
 * for the same reason: the epoch is the SECOND per-advance value that must be threaded
 * from the caller rather than read from ambience. It is called ONLY when
 * `advanceEpochEnabled` is strictly true, so it is unreachable in every dark or legacy
 * world and costs a flag-absent advance nothing.
 *
 * WHY IT IS NOT MERELY A CONVENTION. The epoch is a stream segment: a lit advance whose
 * caller forgot to thread it composes the DARK seed and silently produces the pre-wave
 * future while the world believes it entered a new epoch. That is a wrong world, not a
 * crash, and no existing assertion in the estate would notice. In `NODE_ENV==='test'`
 * this throws; in the browser it is a no-op, because a production caller that loses the
 * value must degrade to today's behaviour rather than break the DM's advance.
 *
 * ⛔ IT IS A FRESH-ADVANCE GUARD, and the kernel's `resumedSegment` argument is what
 * keeps it one (E5). A RESUMED segment re-derives its tick from the pause cursor's
 * PRE-tick world, so the rules the kernel can see are the ones frozen at pause time
 * while the store's are live — and on that path an absent epoch is LAWFUL in two
 * production shapes this guard cannot distinguish from a caller that forgot: the DM
 * turned the rule off mid-pause (the store withheld the value on purpose), and a cursor
 * written before this program that never carried one. The store's own gate covers the
 * resume path; widening this one to cover it too would only refuse lawful worlds.
 * @param {string} site  the entry point name, for the error message
 */
export function assertEpochPinnedInTest(site) {
  if (inTestRun()) {
    throw new Error(
      `[clock] ${site} ran with advanceEpochEnabled strictly true and no threaded ` +
      `\`advanceEpoch\`. Pass one from the store mint (runAdvanceCampaignWorld) — a lit ` +
      `advance with no epoch composes the DARK seed and silently replays the pre-wave ` +
      `future. The value is args-borne by design; never read it from ambient state.`,
    );
  }
}
