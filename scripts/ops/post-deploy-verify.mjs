#!/usr/bin/env node
/**
 * Fail-closed production verifier and source-bound release receipt.
 *
 * This command does not deploy or mutate production. HTTP probes use GET except
 * the service-role operational-health RPC, which is a stable read. The database
 * history query is forced read-only at the PostgreSQL connection level.
 *
 * A receipt is published only when every required proof passes:
 *
 *   - live app release identity equals this clean checkout's Git commit;
 *   - app and dedicated FMG origins serve their exact enforcing CSP contract;
 *   - at least one configured public health endpoint reports healthy;
 *   - the live migration history is contiguous through the repository head;
 *   - durable payment/privacy/webhook obligations and unresolved application
 *     commands are inside policy.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAP_FORK_REVISION,
  PRODUCTION_MAP_ORIGIN,
} from '../../src/lib/mapRuntimeConfig.js';
import {
  DEFAULT_APP_ORIGINS,
  evaluateAppBoundary,
  evaluateCombinedOperationalHealth,
  evaluateMapBoundary,
  evaluateMigrationHistory,
  evaluatePublicHealth,
  evaluateReleaseIdentity,
  summarizeVerification,
  validateProductionDatabaseTarget,
} from './postDeployVerifyCore.mjs';
import {
  MIGRATION_HISTORY_SQL,
  readMigrationFiles,
} from './migrationRehearsalCore.mjs';
import {
  publicUrlLabel,
  readSourceIdentity,
  receiptLabel,
  redactDiagnostic,
  sha256,
  urlCredentialSecrets,
  writeJsonReceiptAtomically,
} from './releaseEvidenceCore.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const DEFAULT_RECEIPT_DIRECTORY = join(
  ROOT,
  'artifacts',
  'ops',
  'post-deploy',
);
const MAX_JSON_BYTES = 64 * 1024;
const MAX_TEXT_BYTES = 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 10_000;

function usage() {
  return `
Usage:
  node scripts/ops/post-deploy-verify.mjs \\
    [--app-url https://settlementforge.com] \\
    --health edge=https://<project>.functions.supabase.co/health?deep=1 \\
    [--app-origin https://www.settlementforge.com] \\
    [--max-operational-severity healthy] [--timeout-ms 10000] \\
    [--receipt <release-receipt.json>] [--json]

Required environment:
  POST_DEPLOY_DATABASE_URL       read-only migration-history connection
  SF_PRODUCTION_DATABASE_HOST    exact host admitted for that connection
  SUPABASE_URL                   project origin for combined operational health
  SUPABASE_PROJECT_REF           project identity override for custom URLs
  SUPABASE_SERVICE_ROLE_KEY      private monitor credential
`.trim();
}

/** @param {string[]} argv @param {string} flag */
function argValue(argv, flag) {
  const exact = argv.indexOf(flag);
  if (exact >= 0) return argv[exact + 1];
  const inline = argv.find((argument) => argument.startsWith(`${flag}=`));
  return inline?.slice(flag.length + 1);
}

/** @param {string[]} argv @param {string} flag */
function repeatedArgValues(argv, flag) {
  const values = [];
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === flag && argv[index + 1] != null) {
      values.push(argv[index + 1]);
      index += 1;
    } else if (argument.startsWith(`${flag}=`)) {
      values.push(argument.slice(flag.length + 1));
    }
  }
  return values;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/** @param {string} value @param {string} label */
function requireHttps(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} is not a valid URL.`);
  }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
    throw new Error(`${label} must be credential-free HTTPS.`);
  }
  return parsed;
}

/** @param {string[]} argv */
function readHealthProbes(argv) {
  const declared = repeatedArgValues(argv, '--health');
  if (process.env.HEALTH_URL) {
    declared.push(`edge=${process.env.HEALTH_URL}`);
  }
  const seen = new Set();
  return declared.map((value) => {
    const separator = value.indexOf('=');
    if (separator <= 0) {
      throw new Error('--health must use name=https://... syntax.');
    }
    const name = value.slice(0, separator).trim();
    const rawUrl = value.slice(separator + 1).trim();
    if (!/^[a-z][a-z0-9-]{0,31}$/i.test(name) || seen.has(name)) {
      throw new Error(`Health probe name "${name}" is invalid or duplicated.`);
    }
    seen.add(name);
    const url = requireHttps(rawUrl, `health probe ${name}`);
    for (const [parameter] of url.searchParams) {
      if (/(password|passwd|token|secret|api.?key|authorization)/i.test(
        parameter,
      )) {
        throw new Error(
          `health probe ${name} must be public; secret query parameters are forbidden.`,
        );
      }
    }
    return Object.freeze({
      name,
      url: url.toString(),
      requireDb: url.searchParams.get('deep') === '1',
    });
  });
}

/**
 * @param {string} url
 * @param {{
 *   timeoutMs: number,
 *   json?: boolean,
 *   text?: boolean,
 *   init?: RequestInit,
 * }} options
 */
async function fetchObservation(url, {
  timeoutMs,
  json = false,
  text: readText = false,
  init = {},
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const response = await fetch(url, {
      ...init,
      redirect: init.redirect || 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'SettlementForge-PostDeployVerifier/1',
        Accept: json ? 'application/json' : 'text/html,*/*;q=0.5',
        ...(init.headers || {}),
      },
    });
    let payload = null;
    let body = null;
    if (json || readText) {
      const declaredLength = Number(response.headers.get('content-length'));
      if (
        Number.isFinite(declaredLength)
        && declaredLength > (json ? MAX_JSON_BYTES : MAX_TEXT_BYTES)
      ) {
        throw new Error('Probe response exceeded the evidence size limit.');
      }
      body = await response.text();
      if (
        Buffer.byteLength(body)
        > (json ? MAX_JSON_BYTES : MAX_TEXT_BYTES)
      ) {
        throw new Error('Probe response exceeded the evidence size limit.');
      }
      if (json) {
        try {
          payload = JSON.parse(body);
        } catch {
          throw new Error(`JSON probe returned invalid JSON (HTTP ${response.status}).`);
        }
      }
    } else {
      await response.body?.cancel();
    }
    return Object.freeze({
      requestedUrl: url,
      finalUrl: response.url || url,
      status: response.status,
      headers: response.headers,
      payload,
      body,
      durationMs: Date.now() - started,
    });
  } finally {
    clearTimeout(timer);
  }
}

/** @param {string} databaseUrl */
function readLiveMigrationHistory(databaseUrl) {
  const result = spawnSync(
    'psql',
    [
      '-X',
      '--no-psqlrc',
      '--tuples-only',
      '--no-align',
      '--command',
      MIGRATION_HISTORY_SQL,
    ],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        PGDATABASE: databaseUrl,
        PGCONNECT_TIMEOUT: '10',
        PGOPTIONS: [
          '-c default_transaction_read_only=on',
          '-c statement_timeout=10000',
          '-c lock_timeout=3000',
        ].join(' '),
      },
      maxBuffer: 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Read-only migration-history query failed: ${result.stderr}`);
  }
  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    throw new Error('Read-only migration-history query returned invalid JSON.');
  }
}

/**
 * Service-role credentials are sent only to the exact configured Supabase
 * origin. Redirects are forbidden so an authorization header cannot cross an
 * origin boundary.
 */
async function readOperationalHealthAuthority({
  projectUrl,
  serviceRoleKey,
  staleMinutes,
  timeoutMs,
  rpcName,
  authority,
}) {
  const base = requireHttps(projectUrl, 'SUPABASE_URL');
  base.pathname = `/rest/v1/rpc/${rpcName}`;
  base.search = '';
  base.hash = '';
  const observation = await fetchObservation(base.toString(), {
    timeoutMs,
    json: true,
    init: {
      method: 'POST',
      redirect: 'error',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_stale_minutes: staleMinutes }),
    },
  });
  if (observation.status !== 200) {
    throw new Error(
      `${authority} RPC returned HTTP ${observation.status}.`,
    );
  }
  return observation;
}

/**
 * @param {string[]} [argv]
 */
export async function runPostDeployVerification(
  argv = process.argv.slice(2),
) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(usage());
    return { code: 0, report: null };
  }
  const json = argv.includes('--json');
  const timeoutMs = Math.max(
    1_000,
    Math.min(60_000, Number(argValue(argv, '--timeout-ms')) || DEFAULT_TIMEOUT_MS),
  );
  const staleMinutes = Math.max(
    5,
    Math.min(1_440, Number(argValue(argv, '--stale-minutes')) || 30),
  );
  const maximumSeverity = String(
    argValue(argv, '--max-operational-severity')
      || argValue(argv, '--max-obligation-severity')
      || 'healthy',
  );
  const appUrl = requireHttps(
    argValue(argv, '--app-url') || DEFAULT_APP_ORIGINS[0],
    'app URL',
  );
  if (!DEFAULT_APP_ORIGINS.includes(appUrl.origin)) {
    throw new Error(
      `app URL origin must be one of ${DEFAULT_APP_ORIGINS.join(', ')}.`,
    );
  }
  const mapUrl = requireHttps(
    argValue(argv, '--map-url')
      || `${PRODUCTION_MAP_ORIGIN}/map/index.html`,
    'map URL',
  );
  if (
    mapUrl.origin !== PRODUCTION_MAP_ORIGIN
    || mapUrl.pathname !== '/map/index.html'
  ) {
    throw new Error(
      `map URL must be ${PRODUCTION_MAP_ORIGIN}/map/index.html.`,
    );
  }
  const mapOrigin = mapUrl.origin;
  mapUrl.searchParams.set('v', MAP_FORK_REVISION);
  mapUrl.searchParams.set('parentOrigin', appUrl.origin);

  const explicitParentOrigins = repeatedArgValues(argv, '--app-origin');
  const expectedParentOrigins = explicitParentOrigins.length
    ? explicitParentOrigins.map((value) =>
        requireHttps(value, 'app frame ancestor').origin)
    : (
      DEFAULT_APP_ORIGINS.includes(appUrl.origin)
        ? [...DEFAULT_APP_ORIGINS]
        : [appUrl.origin]
    );
  const healthProbes = readHealthProbes(argv);
  if (healthProbes.length === 0) {
    throw new Error(
      'At least one --health name=https://... public probe is required.',
    );
  }

  const databaseUrl = String(
    process.env.POST_DEPLOY_DATABASE_URL || '',
  ).trim();
  const projectUrl = String(process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  ).trim();
  if (!databaseUrl) {
    throw new Error('POST_DEPLOY_DATABASE_URL is required for a live head proof.');
  }
  if (!projectUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for combined operational health.',
    );
  }
  const databaseTarget = validateProductionDatabaseTarget({
    databaseUrl,
    supabaseUrl: projectUrl,
    expectedHost: process.env.SF_PRODUCTION_DATABASE_HOST || '',
    projectRef: process.env.SUPABASE_PROJECT_REF || '',
  });

  // A release is a repository-wide unit. Hash every tracked/untracked source
  // input rather than declaring an arbitrary subsystem list "clean enough."
  const source = readSourceIdentity(ROOT, ['.']);
  if (source.dirty) {
    throw new Error(
      'Post-deploy release evidence requires a clean checkout; commit or remove local changes first.',
    );
  }
  const expectedRelease = source.commit.toLowerCase();
  const repoHead = readMigrationFiles(MIGRATIONS).at(-1)?.number;
  if (!Number.isInteger(repoHead)) {
    throw new Error('Repository migration head is unavailable.');
  }

  const startedAt = new Date().toISOString();
  const reports = [];
  const timings = [];

  const releaseUrl = new URL('/api/release', appUrl.origin).toString();
  const releaseObservation = await fetchObservation(releaseUrl, {
    timeoutMs,
    json: true,
  });
  reports.push(evaluateReleaseIdentity({
    ...releaseObservation,
    expectedRelease,
    scope: 'release.app',
  }));
  timings.push({ name: 'release-identity', ms: releaseObservation.durationMs });

  const appObservation = await fetchObservation(appUrl.toString(), {
    timeoutMs,
  });
  reports.push(evaluateAppBoundary({
    ...appObservation,
    mapOrigin,
  }));
  timings.push({ name: 'app-boundary', ms: appObservation.durationMs });

  const mapObservation = await fetchObservation(mapUrl.toString(), {
    timeoutMs,
    text: true,
  });
  reports.push(evaluateMapBoundary({
    ...mapObservation,
    mapOrigin,
    expectedParentOrigins,
    expectedRevision: MAP_FORK_REVISION,
    artifactSha256: sha256(mapObservation.body || ''),
  }));
  timings.push({ name: 'map-boundary', ms: mapObservation.durationMs });

  const mapReleaseUrl = new URL('/api/release', mapOrigin).toString();
  const mapReleaseObservation = await fetchObservation(mapReleaseUrl, {
    timeoutMs,
    json: true,
  });
  reports.push(evaluateReleaseIdentity({
    ...mapReleaseObservation,
    expectedRelease,
    scope: 'release.map',
  }));
  timings.push({
    name: 'map-release-identity',
    ms: mapReleaseObservation.durationMs,
  });

  for (const probe of healthProbes) {
    const observation = await fetchObservation(probe.url, {
      timeoutMs,
      json: true,
    });
    reports.push(evaluatePublicHealth({
      ...observation,
      name: probe.name,
      requireDb: probe.requireDb,
    }));
    timings.push({
      name: `health-${probe.name}`,
      ms: observation.durationMs,
    });
  }

  const liveHistoryStarted = Date.now();
  const liveHistory = readLiveMigrationHistory(databaseUrl);
  reports.push(evaluateMigrationHistory(liveHistory, repoHead));
  timings.push({
    name: 'migration-history',
    ms: Date.now() - liveHistoryStarted,
  });

  const [obligationObservation, commandObservation] = await Promise.all([
    readOperationalHealthAuthority({
      projectUrl,
      serviceRoleKey,
      staleMinutes,
      timeoutMs,
      rpcName: 'report_operational_obligation_health',
      authority: 'Operational-obligation',
    }),
    readOperationalHealthAuthority({
      projectUrl,
      serviceRoleKey,
      staleMinutes,
      timeoutMs,
      rpcName: 'report_application_command_health',
      authority: 'Application-command',
    }),
  ]);
  reports.push(evaluateCombinedOperationalHealth(
    obligationObservation.payload,
    commandObservation.payload,
    maximumSeverity,
  ));
  timings.push({
    name: 'operational-obligations',
    ms: obligationObservation.durationMs,
  });
  timings.push({
    name: 'application-commands',
    ms: commandObservation.durationMs,
  });

  const summary = summarizeVerification(reports);
  const publicTargets = Object.freeze({
    app: publicUrlLabel(appUrl),
    map: publicUrlLabel(mapUrl),
    release: publicUrlLabel(releaseUrl),
    mapRelease: publicUrlLabel(mapReleaseUrl),
    database: databaseTarget.label,
    health: healthProbes.map((probe) => ({
      name: probe.name,
      url: publicUrlLabel(probe.url),
      requireDb: probe.requireDb,
    })),
    supabase: requireHttps(projectUrl, 'SUPABASE_URL').origin,
  });
  const diagnostic = Object.freeze({
    schemaVersion: 1,
    kind: 'settlementforge_post_deploy_verification',
    passed: summary.passed,
    startedAt,
    finishedAt: new Date().toISOString(),
    source,
    targets: publicTargets,
    expectedRelease,
    mapRevision: MAP_FORK_REVISION,
    repoMigrationHead: repoHead,
    reports,
    timings,
    summary,
  });
  if (!summary.passed) {
    if (json) console.log(JSON.stringify(diagnostic));
    else {
      console.error(
        `Post-deploy verification failed: ${summary.failedChecks.join(', ')}`,
      );
    }
    return { code: 1, report: diagnostic };
  }

  const receipt = Object.freeze({
    ...diagnostic,
    evidenceSha256: sha256(JSON.stringify({
      source,
      targets: publicTargets,
      expectedRelease,
      mapRevision: MAP_FORK_REVISION,
      repoHead,
      reports,
    })),
  });
  const explicitReceipt = argValue(argv, '--receipt');
  const receiptPath = explicitReceipt
    ? resolve(explicitReceipt)
    : join(
      DEFAULT_RECEIPT_DIRECTORY,
      `${timestamp()}-${expectedRelease.slice(0, 12)}.json`,
    );
  writeJsonReceiptAtomically(receiptPath, receipt);

  if (json) console.log(JSON.stringify(receipt));
  else {
    console.log(
      `Post-deploy verification passed (${summary.checkCount} checks).`,
    );
    console.log(`Receipt: ${receiptLabel(ROOT, receiptPath)}`);
  }
  return { code: 0, report: receipt, receiptPath };
}

async function main() {
  const secrets = [
    process.env.POST_DEPLOY_DATABASE_URL || '',
    ...urlCredentialSecrets(process.env.POST_DEPLOY_DATABASE_URL || ''),
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    process.env.SUPABASE_ACCESS_TOKEN || '',
  ];
  try {
    const result = await runPostDeployVerification();
    process.exitCode = result.code;
  } catch (error) {
    const message = redactDiagnostic(error, secrets);
    if (process.argv.includes('--json')) {
      console.error(JSON.stringify({
        ok: false,
        kind: 'settlementforge_post_deploy_verification_error',
        error: message,
      }));
    } else {
      console.error(`[post-deploy] ${message}`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await main();
}
