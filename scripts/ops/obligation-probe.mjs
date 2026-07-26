#!/usr/bin/env node
/**
 * obligation-probe.mjs — external alert probe for durable money/privacy work.
 *
 * This is the scheduled-machine twin of the Admin Operational Obligations
 * panel. It calls migration 182's obligation aggregate and migration 184's
 * application-command aggregate, then exits non-zero whenever either observed
 * authority exceeds the declared ceiling:
 *
 *   SUPABASE_URL=https://<project>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=<secret> \
 *   node scripts/ops/obligation-probe.mjs [--max-severity=healthy] [--json]
 *
 * Default policy is strict: warning or critical exits 1. A monitor that pages
 * only on critical may pass `--max-severity=warning`; the JSON still contains
 * the warning facts. Invalid/missing responses exit 2 (probe/config failure).
 *
 * The service-role key is sent only to the configured Supabase origin and is
 * never printed. Run this from a private secret-bearing monitor, never from the
 * browser or a public build job.
 */
import {
  combineOperationalHealth,
  OPERATIONAL_SEVERITIES,
  probeExitCode,
} from './obligationProbeCore.mjs';

const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const maximumArg = args.find((arg) => arg.startsWith('--max-severity='));
const maximum = maximumArg ? maximumArg.split('=')[1] : 'healthy';
const staleArg = args.find((arg) => arg.startsWith('--stale-minutes='));
const staleMinutes = Math.max(
  5,
  Math.min(1440, Number(staleArg?.split('=')[1]) || 30),
);

function fail(reason, detail = null) {
  const result = { ok: false, reason, detail, checkedAt: new Date().toISOString() };
  if (jsonOut) console.log(JSON.stringify(result));
  else {
    console.error(`[probe-error] ${reason}${detail ? `: ${detail}` : ''}`);
  }
  process.exit(2);
}

if (!OPERATIONAL_SEVERITIES.includes(maximum)) {
  fail('invalid_maximum_severity', maximum);
}

const projectUrl = String(process.env.SUPABASE_URL || '').trim();
const serviceRoleKey = String(
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
).trim();
if (!projectUrl || !serviceRoleKey) {
  fail(
    'missing_configuration',
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required',
  );
}

let obligationEndpoint;
let commandEndpoint;
try {
  const base = new URL(projectUrl);
  const local = ['localhost', '127.0.0.1', '::1'].includes(base.hostname);
  if (base.protocol !== 'https:' && !local) {
    fail('insecure_supabase_url', 'HTTPS is required outside local development');
  }
  base.pathname = '/rest/v1/rpc/report_operational_obligation_health';
  base.search = '';
  base.hash = '';
  obligationEndpoint = base.toString();
  base.pathname = '/rest/v1/rpc/report_application_command_health';
  commandEndpoint = base.toString();
} catch {
  fail('invalid_supabase_url');
}

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 10_000);

async function readRpc(endpoint, authority) {
  const response = await fetch(endpoint, {
    method: 'POST',
    redirect: 'error',
    signal: controller.signal,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_stale_minutes: staleMinutes }),
  });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw Object.assign(
      new Error(`${authority} returned non-JSON HTTP ${response.status}`),
      { code: 'non_json_response' },
    );
  }
  if (!response.ok) {
    throw Object.assign(
      new Error(`${authority} RPC returned HTTP ${response.status}`),
      { code: 'rpc_failed' },
    );
  }
  return body;
}

let obligationBody;
let commandBody;
try {
  [obligationBody, commandBody] = await Promise.all([
    readRpc(obligationEndpoint, 'operational obligations'),
    readRpc(commandEndpoint, 'application commands'),
  ]);
} catch (error) {
  fail(
    error?.name === 'AbortError'
      ? 'timeout'
      : error?.code || 'request_failed',
    error?.message || null,
  );
} finally {
  clearTimeout(timer);
}

const parsed = combineOperationalHealth(obligationBody, commandBody);
const exitCode = probeExitCode(parsed, maximum);
const result = parsed.ok
  ? {
      ok: exitCode === 0,
      severity: parsed.health.severity,
      maximum,
      checkedAt: new Date().toISOString(),
      health: parsed.health,
    }
  : {
      ok: false,
      reason: parsed.reason,
      checkedAt: new Date().toISOString(),
    };

if (jsonOut) {
  console.log(JSON.stringify(result));
} else if (parsed.ok) {
  const mark = exitCode === 0 ? 'OK' : 'ALERT';
  console.log(
    `[${mark}] operational obligations: ${parsed.health.severity} `
      + `(allowed through ${maximum})`,
  );
  console.log(
    `  deletion open ${parsed.health.obligations.accountDeletion?.open ?? 0}; `
      + `refund open ${parsed.health.obligations.paymentRefund?.open ?? 0}; `
      + `webhook open ${
        parsed.health.obligations.stripeWebhook?.open
          ?? parsed.health.obligations.stripeWebhook?.processing
          ?? 0
      }; `
      + `commands reconcile-required ${
        parsed.health.applicationCommands.reconcileRequired ?? 0
      } (imports ${
        parsed.health.applicationCommands.importReconcileRequired ?? 0
      })`,
  );
} else {
  console.error(`[probe-error] invalid response: ${parsed.reason}`);
}

process.exit(exitCode);
