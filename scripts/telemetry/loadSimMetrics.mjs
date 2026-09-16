#!/usr/bin/env node
/**
 * loadSimMetrics.mjs — the operator-side loader for the SIMULATION metric class.
 *
 * ⛔ THE SOAK NEEDS ZERO CLOUD. Loading is a SEPARATE, LATER, OPTIONAL act: the
 * harness writes JSONL to disk and the aggregator reads that same JSONL, so a full
 * diagnostic run and its tuning-curve report complete with no database at all. This
 * file exists so the rows CAN be published, never so that they must be.
 *
 * The payload builder is pure and is what the pins exercise. The CLI refuses to
 * guess a destination: both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must be
 * present, or it exits non-zero naming what is missing. A loader that silently
 * picked a default project would be a loader that can publish engine evidence into
 * the wrong place.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The columns migration 196 declares. A row carrying anything else is refused. */
export const LOAD_ROW_KEYS = Object.freeze([
  'run_id', 'seed_family', 'scale', 'horizon', 'profile', 'source_fingerprint',
  'schema_version', 'metric', 'epoch_kind', 'epoch_index', 'dims', 'value',
]);

/**
 * JSONL → the jsonb array `load_sim_metrics(jsonb)` takes.
 * @param {string} jsonl
 * @returns {Array<Record<string, unknown>>}
 */
export function buildLoadPayload(jsonl) {
  const allowed = new Set(LOAD_ROW_KEYS);
  return String(jsonl).split('\n').filter((line) => line.trim().length > 0).map((line, index) => {
    const parsed = JSON.parse(line);
    const extra = Object.keys(parsed).filter((key) => !allowed.has(key));
    if (extra.length) {
      throw new Error(`row ${index + 1} carries columns migration 196 does not declare: ${extra.join(', ')}`);
    }
    const missing = LOAD_ROW_KEYS.filter((key) => !(key in parsed));
    if (missing.length) throw new Error(`row ${index + 1} is missing ${missing.join(', ')}`);
    return parsed;
  });
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    process.stderr.write('[load-sim-metrics] usage: node scripts/telemetry/loadSimMetrics.mjs <rows.jsonl>\n');
    process.exit(2);
  }
  const rows = buildLoadPayload(readFileSync(resolve(file), 'utf8'));
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missing = [!url && 'SUPABASE_URL', !key && 'SUPABASE_SERVICE_ROLE_KEY'].filter(Boolean);
  if (missing.length) {
    process.stderr.write(`[load-sim-metrics] refusing to guess a destination; missing ${missing.join(' and ')}\n`);
    process.stderr.write(`[load-sim-metrics] ${rows.length} rows validated and NOT sent\n`);
    process.exit(3);
  }
  const response = await fetch(`${url}/rest/v1/rpc/load_sim_metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({ p_rows: rows }),
  });
  if (!response.ok) {
    process.stderr.write(`[load-sim-metrics] load failed: ${response.status} ${await response.text()}\n`);
    process.exit(1);
  }
  process.stdout.write(`[load-sim-metrics] loaded ${await response.text()} of ${rows.length} rows\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
