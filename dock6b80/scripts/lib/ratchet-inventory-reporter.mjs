/**
 * scripts/lib/ratchet-inventory-reporter.mjs — the capture half of
 * `scripts/ratchet-inventory.sh`. Read that script's header for WHY this exists; this
 * file only explains HOW.
 *
 * THE PROBLEM IN ONE LINE: vitest never prints the members of a failed array
 * assertion. `expect(violations).toEqual([])` reports
 *
 *     AssertionError: expected [ …(76) ] to deeply equal []
 *
 * and that truncation is identical in the default reporter AND in
 * `--reporter=json` (MEASURED 2026-08-06 on vitest 4.1.8 against
 * tests/lint/negativeAssertionAnchor.walker.test.js: the JSON reporter's
 * `failureMessages[0]` was the same 76-suppressed string). So an agent reading either
 * one can see the CARDINALITY and not one member, and reconstructing the inventory by
 * hand is where invented figures come from.
 *
 * WHAT A CUSTOM REPORTER SEES THAT THE OTHERS DO NOT: the error object handed to
 * `onTestCaseResult` still carries `err.actual` — the FULL serialized array, 46,907
 * characters for that same run. The truncation is a display step in the message
 * formatter, not a property of the transported error. This reporter writes the raw
 * `actual` (and the message, so the comparer can check the extracted member count
 * against the cardinality vitest printed) to `RATCHET_INVENTORY_OUT` and nothing else.
 *
 * It also records PASSING test cases. An empty inventory and a reporter that never ran
 * are the same JSON otherwise, and "the tool said clean" must never be able to mean
 * "the tool did not look".
 *
 * Deliberately import-free apart from `node:fs`: it is loaded by an absolute path from
 * whichever tree invoked the tool, including into a throwaway `git archive` checkout of
 * an older commit that does not contain this file.
 */
import { writeFileSync } from 'node:fs';

export default class RatchetInventoryReporter {
  constructor() {
    /** @type {Array<{name: string, file: string, status: string, errors: Array<{message: string, actual: string|null}>}>} */
    this.cases = [];
  }

  /** @param {{ name?: string, result?: unknown, module?: unknown }} testCase */
  onTestCaseResult(testCase) {
    const result = typeof testCase.result === 'function' ? testCase.result() : testCase.result;
    const errors = (result && Array.isArray(result.errors)) ? result.errors : [];
    this.cases.push({
      name: String(testCase.name || ''),
      file: String(testCase.module?.moduleId || testCase.module?.filepath || ''),
      status: String(result?.state || 'unknown'),
      errors: errors.map((err) => ({
        message: String(err?.message ?? ''),
        actual: err?.actual == null ? null : String(err.actual),
      })),
    });
  }

  onTestRunEnd() {
    const out = process.env.RATCHET_INVENTORY_OUT;
    if (!out) throw new Error('ratchet-inventory reporter: RATCHET_INVENTORY_OUT is not set.');
    writeFileSync(out, JSON.stringify({ cases: this.cases }, null, 1));
  }
}
