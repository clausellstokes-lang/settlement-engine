/**
 * load-test.mjs — R-25 the LOAD-TEST HARNESS for the AI + checkout edge functions.
 * Dependency-free (global fetch; no k6, no npm dep). WRITTEN-NOT-RUN by default.
 *
 * THE SAFETY LAW (read this first)
 *   1. NO TARGET ⇒ NOTHING IS SENT. With no --target the harness prints the request
 *      plan and exits. It cannot generate load it was not explicitly aimed at.
 *   2. PLAN UNLESS --execute. Even WITH a target, the harness only prints the plan
 *      unless --execute is passed. A pasted URL never fires by itself.
 *   3. PRODUCTION IS HARD-REFUSED. Any target whose host is the production domain or a
 *      Supabase-hosted project (*.supabase.co) is refused outright, with NO override.
 *      A load test belongs against localhost or a throwaway staging deploy, never live.
 *      (Same posture as scripts/backup-restore-drill.mjs refusing a prod restore target.)
 *
 * WHAT IT MEASURES (and does NOT)
 *   It measures how the EDGE + RATE LIMITERS hold up under concurrency: request latency
 *   percentiles and the status-code mix (200 / 401 / 429 / 5xx). It sends UNAUTHENTICATED
 *   requests, so the AI functions reject them at the gate (401/429) BEFORE any provider
 *   call. It therefore never spends provider budget and never creates a real checkout.
 *   The health signals are gate latency and rate-limit behavior under load, not AI output.
 *
 * USAGE
 *   node scripts/load-test.mjs                                  # plan only (no target)
 *   node scripts/load-test.mjs --target http://localhost:54321  # plan against a target
 *   node scripts/load-test.mjs --target http://localhost:54321 --execute --concurrency 10 --requests 200
 *
 * See docs/ops/LOAD_TEST_RUNBOOK.md (execution is OWNER-only, attended).
 */

import { fileURLToPath } from 'node:url';

/** Hosts that are LIVE and must never receive generated load. No override. */
export const PROD_HOST_PATTERNS = Object.freeze([
  /(^|\.)settlementforge\.com$/i,
  /\.supabase\.co$/i,
]);

/**
 * The edge-function scenarios the harness exercises. Unauth bodies: each is rejected at
 * the gate (auth / rate limit) before any paid work. `expectGate` documents the healthy
 * rejection so the summary can flag anything that slips past it.
 */
export const SCENARIOS = Object.freeze([
  { name: 'ai/generate-narrative', path: '/functions/v1/generate-narrative', method: 'POST', body: { settlementId: 'load-test-noop' }, expectGate: [401, 403, 429] },
  { name: 'ai/generate-chronicle', path: '/functions/v1/generate-chronicle', method: 'POST', body: { saveId: 'load-test-noop' }, expectGate: [401, 403, 429] },
  { name: 'ai/interpret-session',  path: '/functions/v1/interpret-session',  method: 'POST', body: { saveId: 'load-test-noop' }, expectGate: [401, 403, 429] },
  { name: 'checkout/create-checkout', path: '/functions/v1/create-checkout', method: 'POST', body: { product: 'load-test-noop' }, expectGate: [400, 401, 403, 429] },
]);

/** Parse a --flag value from argv (returns undefined if absent). */
function argValue(flag, argv) {
  const i = argv.indexOf(flag);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
}

/** Parse the harness args. Everything has a conservative default. */
export function parseArgs(argv = process.argv.slice(2)) {
  const intOr = (v, d) => {
    const n = Number.parseInt(v ?? '', 10);
    return Number.isFinite(n) && n > 0 ? n : d;
  };
  return {
    target: argValue('--target', argv) || '',
    execute: argv.includes('--execute'),
    concurrency: intOr(argValue('--concurrency', argv), 5),
    requests: intOr(argValue('--requests', argv), 50),
    timeoutMs: intOr(argValue('--timeout-ms', argv), 10000),
  };
}

/** True if `urlStr`'s host is a live production host (hard-refused). */
export function isProdHost(urlStr) {
  let host;
  try { host = new URL(urlStr).hostname; } catch { return false; }
  return PROD_HOST_PATTERNS.some((re) => re.test(host));
}

/**
 * Classify a target into a runnability verdict WITHOUT sending anything.
 *   - no target        ⇒ { runnable:false, reason:'no-target' }   (plan only)
 *   - a prod host       ⇒ { runnable:false, reason:'prod-refused' } (never)
 *   - anything else     ⇒ { runnable:true }
 * @param {string} target
 */
export function classifyTarget(target) {
  if (!target) return { runnable: false, reason: 'no-target' };
  let url;
  try { url = new URL(target); } catch { return { runnable: false, reason: 'bad-url' }; }
  if (isProdHost(target)) return { runnable: false, reason: 'prod-refused', host: url.hostname };
  return { runnable: true, host: url.hostname };
}

/** Build the concrete request plan (base URL + scenarios) without firing it. */
export function buildPlan(target, scenarios = SCENARIOS) {
  const base = String(target).replace(/\/+$/, '');
  return scenarios.map((s) => ({ ...s, url: `${base}${s.path}` }));
}

/** The p-th percentile of an ASCENDING-sorted numeric array (nearest-rank). */
export function percentile(sortedAsc, p) {
  if (!sortedAsc.length) return 0;
  const rank = Math.ceil((p / 100) * sortedAsc.length);
  return sortedAsc[Math.min(sortedAsc.length - 1, Math.max(0, rank - 1))];
}

/**
 * Reduce raw per-request results into a report: count, status mix, latency percentiles,
 * error count, and a `gateHealthy` flag (every response landed on its scenario's expected
 * gate status, i.e. nothing sailed past auth/rate-limit into real work).
 * @param {Array<{ status: number|null, ms: number, expectGate?: number[], error?: string }>} results
 */
export function summarize(results) {
  const byStatus = {};
  const latencies = [];
  let errors = 0;
  let gateHealthy = true;
  for (const r of results) {
    if (r.error || r.status == null) { errors += 1; continue; }
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    latencies.push(r.ms);
    if (Array.isArray(r.expectGate) && r.expectGate.length && !r.expectGate.includes(r.status)) {
      gateHealthy = false; // a request was NOT rejected at the gate as expected
    }
  }
  latencies.sort((a, b) => a - b);
  return {
    count: results.length,
    ok: latencies.length,
    errors,
    byStatus,
    p50: percentile(latencies, 50),
    p95: percentile(latencies, 95),
    p99: percentile(latencies, 99),
    gateHealthy,
  };
}

/** Fire one request; time it; never throw. */
async function fireOne(descriptor, timeoutMs, fetchImpl) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const start = Date.now();
  try {
    const res = await fetchImpl(descriptor.url, {
      method: descriptor.method,
      headers: { 'content-type': 'application/json' },
      body: descriptor.method === 'POST' ? JSON.stringify(descriptor.body ?? {}) : undefined,
      signal: ctrl.signal,
    });
    return { status: res.status, ms: Date.now() - start, expectGate: descriptor.expectGate };
  } catch (err) {
    return { status: null, ms: Date.now() - start, expectGate: descriptor.expectGate, error: err?.name || 'error' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Run the load: `requests` total, round-robin over the plan, `concurrency` in flight.
 * Only ever called after classifyTarget said runnable AND --execute was passed.
 * @param {{ plan: object[], requests: number, concurrency: number, timeoutMs: number, fetchImpl?: typeof fetch }} args
 */
export async function runLoad({ plan, requests, concurrency, timeoutMs, fetchImpl = fetch }) {
  const descriptors = [];
  for (let i = 0; i < requests; i++) descriptors.push(plan[i % plan.length]);
  const results = [];
  let next = 0;
  async function worker() {
    while (next < descriptors.length) {
      const idx = next++;
      results[idx] = await fireOne(descriptors[idx], timeoutMs, fetchImpl);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, descriptors.length) }, worker));
  return summarize(results);
}

async function main() {
  const args = parseArgs();
  const plan = buildPlan(args.target || 'http://TARGET');
  const verdict = classifyTarget(args.target);

  // Always print the plan (the safe, informative default).
  console.log('[load-test] request plan:');
  for (const p of plan) console.log(`  ${p.method.padEnd(4)} ${p.name.padEnd(28)} ${p.url}`);

  if (verdict.reason === 'no-target') {
    console.log('\n[load-test] no --target given: PLAN ONLY, nothing sent. Aim it at localhost or a staging deploy to run.');
    return;
  }
  if (verdict.reason === 'prod-refused') {
    console.error(`\n[load-test] REFUSED: '${verdict.host}' is a production host. This harness never generates load against live. Use localhost or a throwaway staging deploy.`);
    process.exit(1);
  }
  if (verdict.reason === 'bad-url') {
    console.error(`\n[load-test] '${args.target}' is not a valid URL.`);
    process.exit(1);
  }
  if (!args.execute) {
    console.log(`\n[load-test] target ${verdict.host} is runnable. PLAN ONLY (add --execute to actually send ${args.requests} requests at concurrency ${args.concurrency}).`);
    return;
  }

  console.log(`\n[load-test] EXECUTING against ${verdict.host}: ${args.requests} requests, concurrency ${args.concurrency}...`);
  const report = await runLoad({ plan, requests: args.requests, concurrency: args.concurrency, timeoutMs: args.timeoutMs });
  console.log(JSON.stringify(report, null, 2));
  if (!report.gateHealthy) {
    console.error('[load-test] WARNING: a request was NOT rejected at the auth/rate-limit gate as expected. Investigate before trusting the run.');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
