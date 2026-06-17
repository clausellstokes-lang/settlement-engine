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
