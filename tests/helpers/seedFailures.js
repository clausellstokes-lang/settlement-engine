/**
 * tests/helpers/seedFailures.js — truthful totality for multi-case test loops
 * (epistemic prevention, wave EP-1).
 *
 * THE CLASS: a `for` loop over seeds inside ONE `it()` reports a LOWER BOUND, never a
 * count. The first failing seed throws, the loop dies, and vitest reports exactly one
 * failure — so a 30-of-100 breakage and a 1-of-100 breakage are indistinguishable in
 * the output. Worse, the surviving 70 seeds were never run, so the fix that clears
 * seed #7 can be "verified" against a corpus that never reached seed #8. A seeded
 * test's failure count under the bare-loop idiom is a floor and nothing more
 * (`unreachable-predicate-conjunction`, 2026-07-26).
 *
 * THE CURE: run EVERY case, collect the failures, assert on the whole collection once.
 * The failure message then carries the true count and the full list, so the size of a
 * regression is visible in the first red rather than after N re-runs.
 *
 *   const failures = collectSeedFailures(SEEDS, (seed) => {
 *     const world = generate(seed);
 *     expect(world.factions.length).toBeGreaterThan(0);
 *   });
 *   expectNoSeedFailures(failures, 'every seed yields at least one faction');
 *
 * EXEMPT BY SHAPE: `it.each` / `test.each` already register one case per item, so
 * vitest itself reports the true count — those need no helper. A loop that is truthful
 * for some other reason carries the marker
 *   // seed-loop: collected  — <justification>
 * on the loop line, the line above it, or in the file header (file-wide exemption).
 * tests/lint/seedLoopTotality.walker.test.js reads all three placements.
 *
 * SYNCHRONOUS ONLY. An async callback returns a promise that never throws into the
 * try/catch, which would report a perfect green over a suite that asserted nothing —
 * exactly the failure mode this file exists to kill — so a thenable return is a hard
 * error, not a silent pass.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { expect } from 'vitest';

/**
 * @typedef {object} SeedFailure
 * @property {unknown} item the case that failed (a seed string, a config, an index…)
 * @property {number} index its position in the input iterable
 * @property {string} message the thrown error's message (assertion text included)
 */

/** Render a case compactly for the failure report. */
function describeItem(item) {
  if (typeof item === 'string') return item;
  if (typeof item === 'number' || typeof item === 'boolean' || item == null) return String(item);
  try {
    const json = JSON.stringify(item);
    return json && json.length > 120 ? `${json.slice(0, 117)}...` : String(json);
  } catch {
    return Object.prototype.toString.call(item);
  }
}

/** How many failing cases the message itself lists before eliding the tail. A 400-seed
 *  wipeout must not bury the terminal, but the count above it is always exact. */
const ROSTER_REPORT_CAP = 25;

/** First line of a (possibly multi-line vitest diff) message, length-capped. */
function firstLine(message) {
  const line = String(message).split(`\n`)[0].trim();
  return line.length > 200 ? `${line.slice(0, 197)}...` : line;
}

/**
 * Run `fn` for EVERY item, catching per item, and return the failures.
 *
 * The returned array carries a non-enumerable `attempted` count so the reporter can
 * say "12 of 400" without a second argument. Non-enumerable keeps `toEqual([])` and
 * any structural comparison of the array itself honest.
 *
 * @template T
 * @param {Iterable<T>} items every case to exercise — seeds, configs, fixtures
 * @param {(item: T, index: number) => void} fn the per-case body; throws (or asserts) on failure
 * @returns {SeedFailure[] & { attempted?: number }} one entry per failing case, in input order
 */
export function collectSeedFailures(items, fn) {
  const list = Array.isArray(items) ? items : [...items];
  /** @type {SeedFailure[]} */
  const failures = [];
  for (let index = 0; index < list.length; index += 1) {
    const item = list[index];
    let thrown = null;
    let returned;
    let didThrow = false;
    try {
      returned = fn(item, index);
    } catch (error) {
      didThrow = true;
      thrown = error;
    }
    // A promise return escapes the try/catch entirely — the loop would then "pass"
    // every case without ever observing an assertion. Refuse loudly.
    if (!didThrow && returned && typeof (/** @type {any} */ (returned).then) === 'function') {
      // Swallow the abandoned promise's rejection before bailing out: otherwise the
      // runner reports an unhandled rejection on top of this error and buries it.
      try { /** @type {any} */ (returned).catch(() => {}); } catch { /* not a real promise */ }
      throw new Error(
        `collectSeedFailures is synchronous, but the callback returned a thenable at index`
        + ` ${index} (${describeItem(item)}). An async body's rejections never reach this`
        + ` catch, so every case would be recorded as passing. Make the body synchronous,`
        + ` or use it.each with an async test function.`,
      );
    }
    if (didThrow) {
      const message = thrown && typeof (/** @type {any} */ (thrown).message) === 'string'
        ? /** @type {Error} */ (thrown).message
        : String(thrown);
      failures.push({ item, index, message });
    }
  }
  Object.defineProperty(failures, 'attempted', { value: list.length, enumerable: false });
  return failures;
}

/**
 * Assert that a collected run had no failures, reporting the TRUE count and the full
 * list rather than the first casualty.
 *
 * @param {SeedFailure[] & { attempted?: number }} failures the return of collectSeedFailures
 * @param {string} label what the loop was proving, in one clause
 * @returns {void}
 */
export function expectNoSeedFailures(failures, label) {
  const attempted = typeof failures.attempted === 'number' ? failures.attempted : null;
  const scale = attempted === null ? `${failures.length}` : `${failures.length} of ${attempted}`;
  // Assert on a compact string list so the vitest diff reads as a failure roster instead
  // of a dump of generated objects.
  const roster = failures.map(
    (failure) => `[${failure.index}] ${describeItem(failure.item)} — ${firstLine(failure.message)}`,
  );
  // The roster goes in the MESSAGE, not only the diff. vitest abbreviates a long array in
  // an assertion's `.message` (`[ '…', …(3) ]`), so a reader who sees only the message —
  // a CI log line, an agent reading `error.message` — would get the count without the
  // cases. Truthful totality means the list travels with the number.
  const shown = roster.slice(0, ROSTER_REPORT_CAP);
  const elided = roster.length - shown.length;
  const listing = shown.length
    ? `\n${shown.join(`\n`)}${elided > 0 ? `\n…and ${elided} more` : ''}`
    : '';
  const header = `${label} — ${scale} case(s) failed. This is the TRUE count: every case ran.`
    + ` A bare seed loop would have reported 1 and stopped at the first one.${listing}`;
  expect(roster, header).toEqual([]);
}
