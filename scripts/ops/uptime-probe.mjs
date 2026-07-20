#!/usr/bin/env node
/**
 * scripts/ops/uptime-probe.mjs — external uptime probe for SettlementForge.
 *
 * Polls the public site and the edge `health` endpoint, checks status + latency,
 * and exits NON-ZERO on any failure so a scheduler can alert. Zero dependencies
 * (global fetch, Node 18+); the owner can wire it into cron, a GitHub Action, a
 * uptime service's "run a script" hook, or a laptop launchd job.
 *
 * Usage:
 *   SITE_URL=https://settlementforge.com \
 *   HEALTH_URL=https://<project-ref>.functions.supabase.co/health \
 *   node scripts/ops/uptime-probe.mjs [--deep] [--timeout=10000] [--json]
 *
 *   --deep            append ?deep=1 to the health probe (also checks DB reachability)
 *   --timeout=<ms>    per-request timeout (default 10000)
 *   --json            emit a machine-readable JSON line instead of human text
 *
 * SITE_URL defaults to https://settlementforge.com. HEALTH_URL is optional — if
 * unset, only the site is probed (with a note). Exit 0 = all checks passed.
 *
 * See docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md for scheduling + external-service notes.
 */

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const timeoutArg = args.find((a) => a.startsWith('--timeout='));
const TIMEOUT_MS = timeoutArg ? Number(timeoutArg.split('=')[1]) || 10000 : 10000;
const DEEP = has('--deep');
const JSON_OUT = has('--json');

const SITE_URL = process.env.SITE_URL || 'https://settlementforge.com';
const HEALTH_URL = process.env.HEALTH_URL || '';

/**
 * One timed HTTP check. `ok` is true when the response satisfies `expect`.
 * @param {string} name
 * @param {string} url
 * @param {(res: Response, body: string) => boolean} expect
 */
async function check(name, url, expect) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    const body = await res.text();
    const ms = Date.now() - started;
    const ok = expect(res, body);
    return { name, url, ok, status: res.status, ms, error: ok ? null : `unexpected response (status ${res.status})` };
  } catch (e) {
    const ms = Date.now() - started;
    const reason = e?.name === 'AbortError' ? `timeout after ${TIMEOUT_MS}ms` : (e?.message || 'request failed');
    return { name, url, ok: false, status: null, ms, error: reason };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const checks = [];

  checks.push(await check('site', SITE_URL, (res) => res.status >= 200 && res.status < 400));

  if (HEALTH_URL) {
    const healthUrl = DEEP
      ? HEALTH_URL + (HEALTH_URL.includes('?') ? '&' : '?') + 'deep=1'
      : HEALTH_URL;
    checks.push(
      await check('health', healthUrl, (res, body) => {
        if (res.status !== 200) return false;
        try {
          return JSON.parse(body).ok === true;
        } catch {
          return false;
        }
      }),
    );
  }

  const allOk = checks.every((c) => c.ok);

  if (JSON_OUT) {
    console.log(JSON.stringify({ ok: allOk, checkedAt: new Date().toISOString(), checks }));
  } else {
    for (const c of checks) {
      const mark = c.ok ? 'OK ' : 'DOWN';
      const detail = c.ok ? `${c.status} in ${c.ms}ms` : c.error;
      console.log(`[${mark}] ${c.name.padEnd(6)} ${c.url} — ${detail}`);
    }
    if (!HEALTH_URL) {
      console.log('[note] HEALTH_URL unset — edge health not probed. Set it to <project>.functions.supabase.co/health');
    }
    console.log(allOk ? 'All probes passed.' : 'One or more probes FAILED.');
  }

  process.exit(allOk ? 0 : 1);
}

main();
