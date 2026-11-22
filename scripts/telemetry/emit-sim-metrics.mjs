#!/usr/bin/env node
/**
 * emit-sim-metrics.mjs — the CLI face of the pure receipt transform.
 *
 * The filesystem lives HERE and nowhere else: `simMetricEmitter.mjs` reads no
 * file, so the transform stays testable without a disk and the purity pin stays
 * meaningful. This wrapper reads a receipt, writes JSONL, and prints a one-line
 * census. It never runs a soak and never calls the engine.
 *
 *   node scripts/telemetry/emit-sim-metrics.mjs \
 *     --receipt <path> --run-id <id> --source-sha <sha> \
 *     [--seed-family <name>] [--profile <name>] [--out <path>]
 *
 * Run identity is REQUIRED, not defaulted: `--run-id` and `--source-sha` have no
 * fallback, because a row whose identity the tool invented is a row nobody can
 * compare against another run. The harness supplies both.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { emit, emitRows } from './simMetricEmitter.mjs';

/** @param {string[]} argv */
export function parseArgs(argv) {
  const out = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = argv[index + 1];
    out[key] = next && !next.startsWith('--') ? next : 'true';
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  for (const required of ['receipt', 'runId', 'sourceSha']) {
    if (!args[required] || args[required] === 'true') {
      process.stderr.write(`[emit-sim-metrics] --${required.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)} is required and has no default\n`);
      process.exit(2);
    }
  }
  const receipt = JSON.parse(readFileSync(resolve(args.receipt), 'utf8'));
  const identity = {
    runId: args.runId,
    sourceSha: args.sourceSha,
    ...(args.seedFamily ? { seedFamily: args.seedFamily } : {}),
    ...(args.profile ? { profile: args.profile } : {}),
  };
  const rows = emitRows(receipt, identity);
  const jsonl = `${emit(receipt, identity)}\n`;
  if (args.out) {
    const file = resolve(args.out);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, jsonl);
    process.stdout.write(`[emit-sim-metrics] wrote ${file} (${rows.length} rows)\n`);
  } else {
    process.stdout.write(jsonl);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
