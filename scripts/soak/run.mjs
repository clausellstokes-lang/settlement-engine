#!/usr/bin/env node
/**
 * run.mjs — THE WORKER-POOL SOAK RUNNER (SK-1; ODQ §141.1).
 *
 * WHAT IT IS
 *   N node processes, one per grid cell, each driving `scripts/audit/whole-world-soak.mjs`
 *   on its own seed with its own receipt path. No shared mutable state exists by
 *   construction: a worker is a separate process and the only thing it writes is its own
 *   receipt file.
 *
 * ⛔ IT NEVER IMPORTS THE ENGINE. The soak-harness charter §0 says the harness reaches
 *   the world through the same public entry points R-GEN's isolate used and never into
 *   engine internals, and the tm-1 wall walker enforces it: `scripts/soak/**` is in
 *   ARM_B_ROOTS, so an import specifier matching `worldPulse|worldState|
 *   generateSettlementPipeline|simulationRules` from this directory REDS. Engine contact
 *   is a SUBPROCESS, which is what makes the wall structural rather than remembered.
 *
 * ⛔ IT NEVER RUNS AGAINST A LIVE WORKTREE (SK.L6). The substrate is a `git archive`
 *   extraction asserted to be outside any repository — see ./archive.mjs for why that
 *   condition is load-bearing and not paranoia.
 *
 * ⚠ EVERY CHILD PID IS RECORDED AT SPAWN. SK-7's cancellation is PID-EXACT, and it can
 *   only be PID-exact if the pool knows its own children. `pkill -f` has returned a
 *   sibling lane's workers as SKIPS in this estate; it is a recorded hazard and it has
 *   bitten.
 */

import { spawn } from 'node:child_process';
import { freemem, cpus } from 'node:os';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { assertOutsideRepository, runIdentity } from './archive.mjs';
import { compareRuns, grid, workerCount } from './pool.mjs';

/**
 * The whole run, decided BEFORE anything is spawned. Pure — a test can assert the plan
 * without executing a soak, which is the only way §145.2 lets the plan be pinned at all.
 *
 * @param {{config: object, host: {freeMemBytes: number, cpus: number},
 *          identity: object, receiptDir: string}} input
 */
export function planRun({ config, host, identity, receiptDir }) {
  const cells = grid(config);
  const workers = Math.min(workerCount(host), Math.max(1, cells.length));
  return {
    identity,
    workers,
    cells: cells.map((cell) => ({
      ...cell,
      // A UNIQUE receipt path per cell, derived from the cell key and nothing else —
      // never from an index into a scheduling order, which would make the artefact
      // path depend on N.
      receipt: join(receiptDir, `${cell.key.replace(/[^A-Za-z0-9_.-]+/g, '_')}.json`),
      argv: [
        '--years', String(cell.years),
        '--settlements', String(cell.settlements),
        '--seed', cell.seed,
        '--source-sha', String(identity.sourceSha),
        ...(Object.keys(cell.rules || {}).length
          ? ['--lighting', Object.entries(cell.rules).map(([k, v]) => `${k}=${v}`).join(',')]
          : []),
      ],
    })),
  };
}

/**
 * ⚠ AN EXPLICITLY CONSTRUCTED ENV, never `process.env` inherited wholesale. An
 * inherited variable that differs between the in-pool and solo runs would break the
 * determinism proof for a reason nobody could see in either receipt.
 */
export function workerEnv({ nodeOptions = '' } = {}) {
  return {
    PATH: process.env.PATH || '',
    HOME: process.env.HOME || '',
    NODE_ENV: 'test',
    TZ: 'UTC',
    LANG: 'C',
    ...(nodeOptions ? { NODE_OPTIONS: nodeOptions } : {}),
  };
}

/**
 * Run the plan. Returns the receipts in GRID ORDER — never in completion order, which
 * would make the output depend on scheduling.
 */
export async function executePlan(plan, { substrate, onSpawn = () => {} }) {
  const queue = [...plan.cells];
  const results = new Map();
  const active = new Set();

  const startOne = (cell) => new Promise((resolveOne) => {
    const child = spawn(process.execPath, [
      join(substrate, 'scripts/audit/whole-world-soak.mjs'),
      ...cell.argv,
      '--receipt', cell.receipt,
    ], { cwd: substrate, env: workerEnv(), stdio: ['ignore', 'pipe', 'pipe'] });
    onSpawn({ pid: child.pid, key: cell.key });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('close', (code) => {
      results.set(cell.key, { cell, code, stderr });
      resolveOne();
    });
  });

  while (queue.length || active.size) {
    while (queue.length && active.size < plan.workers) {
      const cell = queue.shift();
      const promise = startOne(cell).finally(() => active.delete(promise));
      active.add(promise);
    }
    if (active.size) await Promise.race(active);
  }
  return plan.cells.map((cell) => results.get(cell.key));
}

/**
 * THE DETERMINISM-UNDER-WORKERS PROOF, as the harness's own R-GEN isolate. One cell is
 * re-run SOLO and compared on the defined surface. It runs on every harness change, and
 * a deliberately perturbed run must fail it (the counterfactual lives in the pinned
 * test, where it costs no engine time).
 */
export function determinismFindings({ inPoolReceiptPath, soloReceiptPath }) {
  const inPool = JSON.parse(readFileSync(inPoolReceiptPath, 'utf8'));
  const solo = JSON.parse(readFileSync(soloReceiptPath, 'utf8'));
  return compareRuns(inPool, solo);
}

/** CLI. `node scripts/soak/run.mjs --substrate <dir> --tip <sha> --config <json>` */
export async function main(argv = process.argv) {
  const arg = (name, dflt) => {
    const i = argv.indexOf(`--${name}`);
    return i !== -1 && argv[i + 1] != null ? argv[i + 1] : dflt;
  };
  const substrate = resolve(String(arg('substrate', '')));
  const tip = String(arg('tip', ''));
  const receiptDir = resolve(String(arg('receipt-dir', join(substrate, '.soak-receipts'))));
  const config = JSON.parse(readFileSync(resolve(String(arg('config', ''))), 'utf8'));

  const refusals = assertOutsideRepository(substrate);
  if (refusals.length) { for (const line of refusals) console.error(line); process.exit(2); }

  mkdirSync(receiptDir, { recursive: true });
  const identity = runIdentity({
    tip,
    profile: config.profile || 'cert-30',
    horizon: config.years,
    scale: config.settlements,
    startedAtIso: new Date().toISOString(),
  });
  const plan = planRun({
    config,
    host: { freeMemBytes: freemem(), cpus: cpus().length },
    identity,
    receiptDir,
  });
  const pids = [];
  console.log(`[soak] ${plan.cells.length} cells, ${plan.workers} workers, tip ${identity.sourceSha}`);
  const results = await executePlan(plan, { substrate, onSpawn: ({ pid, key }) => {
    pids.push({ pid, key });
    // The PID ledger is written EAGERLY, so a cancellation that arrives before the run
    // finishes still has exact children to signal.
    writeFileSync(join(receiptDir, 'pids.json'), `${JSON.stringify({ pids }, null, 2)}\n`);
  } });
  const failed = results.filter((row) => row.code !== 0);
  console.log(`[soak] ${results.length - failed.length}/${results.length} cells exit 0`);
  for (const row of failed) console.log(`  FAILED ${row.cell.key} (exit ${row.code})`);
  return failed.length === 0 ? 0 : 1;
}

if (process.argv[1] && process.argv[1].endsWith('run.mjs')) {
  process.exit(await main());
}
