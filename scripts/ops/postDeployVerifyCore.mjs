/**
 * Pure decision policy for post-deploy verification.
 *
 * Network and database I/O live in post-deploy-verify.mjs. This module receives
 * bounded response facts and turns them into named checks, so the release gate
 * can be tested without a live deployment or production credentials.
 */

import {
  combineOperationalHealth,
  parseOperationalHealth,
  probeExitCode,
} from './obligationProbeCore.mjs';

export const DEFAULT_APP_ORIGINS = Object.freeze([
  'https://settlementforge.com',
  'https://www.settlementforge.com',
]);

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const ONE_YEAR_SECONDS = 31_536_000;

/**
 * Bind the read-only migration query to the same explicit production project
 * as the obligation RPC. A head read from a convenient clone is not release
 * evidence even when the number happens to match.
 *
 * @param {{
 *   databaseUrl: string,
 *   supabaseUrl: string,
 *   expectedHost: string,
 *   projectRef?: string,
 * }} options
 */
export function validateProductionDatabaseTarget({
  databaseUrl,
  supabaseUrl,
  expectedHost,
  projectRef = '',
}) {
  let database;
  let project;
  try {
    database = new URL(databaseUrl);
    project = new URL(supabaseUrl);
  } catch {
    throw new Error('Production database/Supabase target URL is invalid.');
  }
  if (!['postgres:', 'postgresql:'].includes(database.protocol)) {
    throw new Error('POST_DEPLOY_DATABASE_URL must use PostgreSQL.');
  }
  const host = database.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const admittedHost = String(expectedHost || '').trim().toLowerCase();
  const dbName = decodeURIComponent(database.pathname.replace(/^\//, ''));
  if (!admittedHost || host !== admittedHost) {
    throw new Error(
      'POST_DEPLOY_DATABASE_URL does not match SF_PRODUCTION_DATABASE_HOST.',
    );
  }
  if (!host || !dbName || LOOPBACK_HOSTS.has(host)) {
    throw new Error('The production database target must be exact and remote.');
  }
  if (!['require', 'verify-ca', 'verify-full'].includes(
    database.searchParams.get('sslmode') || '',
  )) {
    throw new Error('The production database target must require TLS via sslmode.');
  }
  if (
    project.protocol !== 'https:'
    || project.username
    || project.password
  ) {
    throw new Error('SUPABASE_URL must be credential-free HTTPS.');
  }

  const projectHost = project.hostname.toLowerCase();
  const derivedRef = projectHost.endsWith('.supabase.co')
    ? projectHost.split('.')[0]
    : '';
  const expectedRef = String(projectRef || derivedRef).trim().toLowerCase();
  if (!expectedRef) {
    throw new Error(
      'SUPABASE_PROJECT_REF is required for a custom Supabase project URL.',
    );
  }
  if (derivedRef && projectRef && derivedRef !== expectedRef) {
    throw new Error('SUPABASE_PROJECT_REF does not match SUPABASE_URL.');
  }

  const principal = decodeURIComponent(database.username || '').toLowerCase();
  const projectMatches = host.split('.').includes(expectedRef)
    || principal.split(/[.:_]/).includes(expectedRef);
  if (!projectMatches) {
    throw new Error(
      'The database host/principal does not identify the configured Supabase project.',
    );
  }

  return Object.freeze({
    host,
    port: database.port || '5432',
    database: dbName,
    projectRef: expectedRef,
    label: `${host}:${database.port || '5432'}/${dbName}`,
  });
}

/** @param {Headers | Record<string, string | string[]>} input */
export function normalizeHeaders(input) {
  const normalized = {};
  if (input && typeof input.entries === 'function') {
    for (const [name, value] of input.entries()) {
      normalized[name.toLowerCase()] = value;
    }
    return normalized;
  }
  for (const [name, value] of Object.entries(input || {})) {
    normalized[name.toLowerCase()] = Array.isArray(value)
      ? value.join(', ')
      : String(value);
  }
  return normalized;
}

/**
 * @param {string} value
 * @returns {{ directives: Map<string, string[]>, duplicates: string[] }}
 */
export function parseCsp(value) {
  const directives = new Map();
  const duplicates = [];
  for (const rawDirective of String(value || '').split(';')) {
    const tokens = rawDirective.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    const [name, ...sources] = tokens;
    const key = name.toLowerCase();
    if (directives.has(key)) duplicates.push(key);
    else directives.set(key, sources);
  }
  return { directives, duplicates };
}

/** @param {string} name @param {boolean} ok @param {string} detail */
function check(name, ok, detail) {
  return Object.freeze({ name, ok: Boolean(ok), detail });
}

/** @param {{ checks: ReturnType<typeof check>[] }} report */
function finalize(report) {
  return Object.freeze({
    ...report,
    ok: report.checks.every((item) => item.ok),
    checks: Object.freeze(report.checks),
  });
}

/** @param {string} value */
function hasDurableHsts(value) {
  const maxAge = String(value || '').match(
    /(?:^|;)\s*max-age=(\d+)(?:;|$)/i,
  );
  return Number(maxAge?.[1]) >= ONE_YEAR_SECONDS
    && /(?:^|;)\s*includeSubDomains(?:;|$)/i.test(String(value || ''));
}

/**
 * @param {{
 *   requestedUrl: string,
 *   finalUrl: string,
 *   status: number,
 *   headers: Headers | Record<string, string | string[]>,
 *   mapOrigin: string,
 * }} observation
 */
export function evaluateAppBoundary(observation) {
  const requested = new URL(observation.requestedUrl);
  const final = new URL(observation.finalUrl);
  const headers = normalizeHeaders(observation.headers);
  const enforcing = headers['content-security-policy'] || '';
  const parsed = parseCsp(enforcing);
  const scripts = parsed.directives.get('script-src') || [];
  const frames = parsed.directives.get('frame-src') || [];
  const checks = [
    check(
      'app.https',
      requested.protocol === 'https:' && final.protocol === 'https:',
      'request and final URL use HTTPS',
    ),
    check(
      'app.origin',
      final.origin === requested.origin,
      `final origin is ${requested.origin}`,
    ),
    check(
      'app.status',
      observation.status >= 200 && observation.status < 300,
      `HTTP ${observation.status}`,
    ),
    check(
      'app.csp.enforced',
      Boolean(enforcing) && !headers['content-security-policy-report-only'],
      'enforcing CSP exists and report-only is absent',
    ),
    check(
      'app.csp.single-policy',
      !enforcing.includes(','),
      'one enforcing policy is present',
    ),
    check(
      'app.csp.unique-directives',
      parsed.duplicates.length === 0,
      parsed.duplicates.length
        ? `duplicate directives: ${parsed.duplicates.join(', ')}`
        : 'no duplicate directives',
    ),
    check(
      'app.csp.map-origin',
      frames.filter((source) => source === observation.mapOrigin).length === 1
        && !frames.some((source) =>
          source.includes('*') || ['http:', 'https:'].includes(source)),
      `frame-src admits ${observation.mapOrigin} without a wildcard scheme`,
    ),
    check(
      'app.csp.strict-scripts',
      parsed.directives.has('script-src')
        && !scripts.includes('*')
        && !scripts.includes("'unsafe-inline'")
        && !scripts.includes("'unsafe-eval'"),
      'explicit app script-src excludes wildcards, unsafe-inline, and unsafe-eval',
    ),
    check(
      'app.hsts',
      hasDurableHsts(headers['strict-transport-security']),
      'HSTS carries at least one year plus includeSubDomains',
    ),
  ];
  return finalize({
    kind: 'app-boundary',
    requestedOrigin: requested.origin,
    finalOrigin: final.origin,
    status: observation.status,
    checks,
  });
}

/**
 * @param {{
 *   requestedUrl: string,
 *   finalUrl: string,
 *   status: number,
 *   headers: Headers | Record<string, string | string[]>,
 *   mapOrigin: string,
 *   expectedParentOrigins: string[],
 *   expectedRevision: string,
 *   body?: string,
 *   artifactSha256?: string,
 * }} observation
 */
export function evaluateMapBoundary(observation) {
  const requested = new URL(observation.requestedUrl);
  const final = new URL(observation.finalUrl);
  const headers = normalizeHeaders(observation.headers);
  const enforcing = headers['content-security-policy'] || '';
  const parsed = parseCsp(enforcing);
  const scripts = parsed.directives.get('script-src') || [];
  const ancestors = parsed.directives.get('frame-ancestors') || [];
  const expectedAncestors = [...observation.expectedParentOrigins].sort();
  const actualAncestors = [...ancestors].sort();
  const requestedRevision = requested.searchParams.get('v');
  const finalRevision = final.searchParams.get('v');
  const requestedParent = requested.searchParams.get('parentOrigin');
  const finalParent = final.searchParams.get('parentOrigin');
  const escapedRevision = observation.expectedRevision.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
  const checks = [
    check(
      'map.https',
      requested.protocol === 'https:' && final.protocol === 'https:',
      'request and final URL use HTTPS',
    ),
    check(
      'map.origin',
      requested.origin === observation.mapOrigin
        && final.origin === observation.mapOrigin,
      `request and final origin are ${observation.mapOrigin}`,
    ),
    check(
      'map.status',
      observation.status >= 200 && observation.status < 300,
      `HTTP ${observation.status}`,
    ),
    check(
      'map.revision',
      requestedRevision === observation.expectedRevision
        && finalRevision === observation.expectedRevision,
      `request and final URL pin map revision ${observation.expectedRevision}`,
    ),
    check(
      'map.parent-handshake',
      observation.expectedParentOrigins.includes(requestedParent)
        && finalParent === requestedParent,
      'request and final URL preserve one declared parentOrigin',
    ),
    check(
      'map.csp.enforced',
      Boolean(enforcing) && !headers['content-security-policy-report-only'],
      'enforcing CSP exists and report-only is absent',
    ),
    check(
      'map.csp.single-policy',
      !enforcing.includes(','),
      'one enforcing policy is present',
    ),
    check(
      'map.csp.unique-directives',
      parsed.duplicates.length === 0,
      parsed.duplicates.length
        ? `duplicate directives: ${parsed.duplicates.join(', ')}`
        : 'no duplicate directives',
    ),
    check(
      'map.csp.frame-ancestors',
      JSON.stringify(actualAncestors) === JSON.stringify(expectedAncestors),
      `frame-ancestors exactly ${expectedAncestors.join(' ')}`,
    ),
    check(
      'map.csp.fork-scripts',
      JSON.stringify([...scripts].sort()) === JSON.stringify([
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
      ]),
      'fork script-src is exactly self plus isolated inline/eval allowances',
    ),
    check(
      'map.x-frame-options',
      !headers['x-frame-options'],
      'X-Frame-Options is absent; CSP frame-ancestors is authoritative',
    ),
    check(
      'map.hsts',
      hasDurableHsts(headers['strict-transport-security']),
      'HSTS carries at least one year plus includeSubDomains',
    ),
    check(
      'map.artifact.revision',
      typeof observation.body === 'string'
        && observation.body.includes(`sf-origin.js?v=${observation.expectedRevision}`)
        && observation.body.includes(`sf-bridge.js?v=${observation.expectedRevision}`)
        && new RegExp(
          `main\\.js\\?v=[^"'\\s>]*${escapedRevision}`,
        ).test(observation.body),
      `served map index references bridge/main revision ${observation.expectedRevision}`,
    ),
  ];
  return finalize({
    kind: 'map-boundary',
    requestedOrigin: requested.origin,
    finalOrigin: final.origin,
    status: observation.status,
    artifactSha256: observation.artifactSha256 || null,
    checks,
  });
}

/**
 * @param {{
 *   requestedUrl: string,
 *   finalUrl: string,
 *   status: number,
 *   payload: unknown,
 *   expectedRelease: string,
 *   scope?: string,
 * }} observation
 */
export function evaluateReleaseIdentity(observation) {
  const requested = new URL(observation.requestedUrl);
  const final = new URL(observation.finalUrl);
  const payload = observation.payload;
  const release = payload && typeof payload === 'object'
    ? String(payload.release || '').toLowerCase()
    : '';
  const expected = String(observation.expectedRelease || '').toLowerCase();
  const scope = String(observation.scope || 'release');
  const checks = [
    check(
      `${scope}.https`,
      requested.protocol === 'https:' && final.protocol === 'https:',
      'release endpoint stays on HTTPS',
    ),
    check(
      `${scope}.origin`,
      requested.origin === final.origin,
      `release endpoint stays on ${requested.origin}`,
    ),
    check(
      `${scope}.status`,
      observation.status === 200,
      `HTTP ${observation.status}`,
    ),
    check(
      `${scope}.schema`,
      payload?.schemaVersion === 1
        && payload?.ok === true
        && payload?.service === 'settlementforge-web',
      'versioned settlementforge-web response',
    ),
    check(
      `${scope}.source`,
      release === expected,
      `deployed release equals expected Git commit ${expected}`,
    ),
  ];
  return finalize({
    kind: `${scope}-identity`,
    status: observation.status,
    release: release || null,
    checks,
  });
}

/**
 * @param {{
 *   name: string,
 *   requestedUrl: string,
 *   finalUrl: string,
 *   status: number,
 *   payload: unknown,
 *   requireDb?: boolean,
 * }} observation
 */
export function evaluatePublicHealth(observation) {
  const requested = new URL(observation.requestedUrl);
  const final = new URL(observation.finalUrl);
  const payload = observation.payload;
  const checks = [
    check(
      `health.${observation.name}.https`,
      requested.protocol === 'https:' && final.protocol === 'https:',
      'health request and final URL use HTTPS',
    ),
    check(
      `health.${observation.name}.origin`,
      requested.origin === final.origin,
      'health probe does not redirect across origins',
    ),
    check(
      `health.${observation.name}.status`,
      observation.status === 200,
      `HTTP ${observation.status}`,
    ),
    check(
      `health.${observation.name}.payload`,
      payload != null
        && typeof payload === 'object'
        && payload.ok === true,
      'JSON payload reports ok=true',
    ),
  ];
  if (observation.requireDb) {
    checks.push(check(
      `health.${observation.name}.database`,
      payload?.db === 'up',
      'deep health reports db=up',
    ));
  }
  return finalize({
    kind: 'public-health',
    name: observation.name,
    status: observation.status,
    database: payload?.db || null,
    service: payload?.service || null,
    checks,
  });
}

/**
 * Release evidence must evaluate both operational authorities as one policy
 * decision. Keeping the two schema checks named separately preserves useful
 * diagnostics, while the combined severity check prevents either authority
 * from disappearing behind the other's healthy state.
 *
 * @param {unknown} obligations
 * @param {unknown} applicationCommands
 * @param {string} [maximum]
 */
export function evaluateCombinedOperationalHealth(
  obligations,
  applicationCommands,
  maximum = 'healthy',
) {
  const obligationResult = parseOperationalHealth(obligations);
  const commandResult = parseOperationalHealth(applicationCommands);
  const combined = combineOperationalHealth(
    obligations,
    applicationCommands,
  );
  const exitCode = probeExitCode(combined, maximum);
  const checks = [
    check(
      'obligations.schema',
      obligationResult.ok,
      obligationResult.ok
        ? 'versioned operational-obligation response'
        : obligationResult.reason,
    ),
    check(
      'application-commands.schema',
      commandResult.ok,
      commandResult.ok
        ? 'versioned application-command response'
        : commandResult.reason,
    ),
    check(
      'operational-health.severity',
      exitCode === 0,
      combined.ok
        ? `severity ${combined.health.severity}; allowed through ${maximum}`
        : combined.reason,
    ),
  ];
  return finalize({
    kind: 'operational-health',
    severity: combined.ok ? combined.health.severity : null,
    obligationSeverity: obligationResult.ok
      ? obligationResult.health.severity
      : null,
    applicationCommandSeverity: commandResult.ok
      ? commandResult.health.severity
      : null,
    maximum,
    checks,
  });
}

/** @param {number} observed @param {number} expected */
export function evaluateMigrationHead(observed, expected) {
  return Object.freeze({
    ...evaluateMigrationHistory({
      head: observed,
      count: observed,
      nonNumeric: 0,
      missing: [],
    }, expected),
    kind: 'migration-head',
  });
}

/**
 * A maximum alone can conceal a manually skipped migration. Release evidence
 * therefore proves both the expected head and an exact 1..head history.
 *
 * @param {Record<string, unknown>} history
 * @param {number} expected
 */
export function evaluateMigrationHistory(history, expected) {
  const observed = Number(history?.head);
  const count = Number(history?.count);
  const nonNumeric = Number(history?.nonNumeric);
  const missing = Array.isArray(history?.missing) ? history.missing : null;
  const validHead = Number.isInteger(observed) && observed >= 0;
  const contiguous = validHead
    && Number.isInteger(count)
    && count === observed
    && nonNumeric === 0
    && missing != null
    && missing.length === 0;
  return finalize({
    kind: 'migration-history',
    observed: validHead ? observed : null,
    expected,
    count: Number.isInteger(count) ? count : null,
    nonNumeric: Number.isInteger(nonNumeric) ? nonNumeric : null,
    missing: missing || null,
    checks: [
      check(
        'migration.head-readable',
        validHead,
        validHead ? `live head is ${observed}` : 'live head is invalid',
      ),
      check(
        'migration.history-contiguous',
        contiguous,
        contiguous
          ? `history is contiguous from 1 through ${observed}`
          : 'history is missing, non-numeric, or internally inconsistent',
      ),
      check(
        'migration.head-current',
        contiguous && observed === expected,
        `live head equals repository head ${expected}`,
      ),
    ],
  });
}

/** @param {Array<{ ok: boolean, checks: unknown[] }>} reports */
export function summarizeVerification(reports) {
  const checks = reports.flatMap((report) => report.checks || []);
  return Object.freeze({
    passed: reports.length > 0
      && reports.every((report) => report.ok)
      && checks.length > 0
      && checks.every((item) => item.ok),
    reportCount: reports.length,
    checkCount: checks.length,
    failedChecks: checks
      .filter((item) => !item.ok)
      .map((item) => item.name),
  });
}
