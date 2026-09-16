/**
 * tuning-weekly.mjs — the §10 autonomous TUNING LOOP entry point, WRITTEN-NOT-ENABLED.
 *
 * WHAT
 *   The diagnose+classify+report body of the weekly tuning routine (DESIGN_ANALYTICS_V2
 *   §10). Given the week's analytics rollup rows + the owner-ratified envelopes + the
 *   auto-tunable registry, it prints the WORLD HEALTH REPORT and the lane-A-eligible /
 *   lane-B proposal queues as JSON. It APPLIES NOTHING — no DB write, no world/generation
 *   mutation, no commit (the §7 data-endogeneity law). Lane-A commits are an implementer-
 *   agent step in the scheduled routine, gated behind the owner enabling it.
 *
 * WRITTEN-NOT-ENABLED (the A2 nightly-maintenance precedent)
 *   This script is present + testable, but nothing schedules it. §10's MECHANISM is "a
 *   scheduled cloud routine (the existing scheduled-agent machinery — one command to
 *   create when the layer ships)"; creating that routine, ratifying the envelopes +
 *   registry, and wiring the rollup read are the OWNER's steps. Until then this is inert:
 *   with the empty ratified registry/envelopes it prints an all-within-envelope report.
 *
 * INPUT (kept dependency-free — no pg driver bundled, mirroring check-migration-head.mjs):
 *   --rollups <path>   JSON file of the week's rollup rows [{ metric, dims, value }, ...]
 *                      (the routine obtains these from analytics_daily_rollups; here they
 *                      are read from a file/fixture so the script never touches the DB).
 *   --envelopes <path> JSON file of ratified envelopes [{ metric, min, max, constantId?,
 *                      proposedValue? }, ...] (default: none → nothing to diagnose).
 *   --week <iso>       label for the report (default: today).
 *
 * Deterministic; safe to run any time (read-only, prints to stdout).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { runWeeklyTuningJob } from '../src/domain/tuning/weeklyTuningJob.js';
import { AUTO_TUNABLE } from '../src/domain/tuning/autoTunableRegistry.js';

/** Read a --flag value from argv (returns undefined if absent). */
function argValue(flag, argv = process.argv) {
  const i = argv.indexOf(flag);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
}

/** Read + parse a JSON file, or return the fallback when the path is absent. */
function readJsonOr(path, fallback) {
  if (!path) return fallback;
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (err) { process.stderr.write(`[tuning-weekly] could not read ${path}: ${err.message}\n`); return fallback; }
}

/** Build the weekly report from inputs. Pure over its args; applies nothing. */
export function buildWeeklyReport({ rollups = [], envelopes = [], weekOf } = {}) {
  return runWeeklyTuningJob({ rollups, envelopes, registry: AUTO_TUNABLE, weekOf });
}

function main() {
  const rollups = readJsonOr(argValue('--rollups'), []);
  const envelopes = readJsonOr(argValue('--envelopes'), []);
  const weekOf = argValue('--week') || new Date().toISOString().slice(0, 10);
  const result = buildWeeklyReport({ rollups, envelopes, weekOf });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
