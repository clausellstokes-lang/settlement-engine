import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import releaseHandler from '../../api/release.js';
import {
  DEFAULT_APP_ORIGINS,
  evaluateAppBoundary,
  evaluateCombinedOperationalHealth,
  evaluateMapBoundary,
  evaluateMigrationHead,
  evaluateMigrationHistory,
  evaluatePublicHealth,
  evaluateReleaseIdentity,
  parseCsp,
  summarizeVerification,
  validateProductionDatabaseTarget,
} from '../../scripts/ops/postDeployVerifyCore.mjs';
import {
  MAP_FORK_REVISION,
  PRODUCTION_MAP_ORIGIN,
} from '../../src/lib/mapRuntimeConfig.js';
import {
  MIGRATION_TRAIN_REPO_HEAD,
} from '../../scripts/ops/migrationRehearsalCore.mjs';
import {
  publicUrlLabel,
  redactDiagnostic,
  urlCredentialSecrets,
} from '../../scripts/ops/releaseEvidenceCore.mjs';

const APP_ORIGIN = DEFAULT_APP_ORIGINS[0];
const ROOT = process.cwd();
const POST_DEPLOY_SCRIPT = join(
  ROOT,
  'scripts',
  'ops',
  'post-deploy-verify.mjs',
);
const APP_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  `frame-src 'self' ${PRODUCTION_MAP_ORIGIN} https://challenges.cloudflare.com`,
].join('; ');
const MAP_CSP = [
  "default-src 'self'",
  `frame-ancestors ${DEFAULT_APP_ORIGINS.join(' ')}`,
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
].join('; ');
const HARDENING = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
};
const MAP_BODY = [
  `<script src="sf-origin.js?v=${MAP_FORK_REVISION}"></script>`,
  `<script src="main.js?v=1.111.0-${MAP_FORK_REVISION}"></script>`,
  `<script src="sf-bridge.js?v=${MAP_FORK_REVISION}"></script>`,
].join('');

function validAppReport() {
  return evaluateAppBoundary({
    requestedUrl: `${APP_ORIGIN}/`,
    finalUrl: `${APP_ORIGIN}/`,
    status: 200,
    headers: {
      ...HARDENING,
      'content-security-policy': APP_CSP,
    },
    mapOrigin: PRODUCTION_MAP_ORIGIN,
  });
}

function validMapReport() {
  const requested = new URL('/map/index.html', PRODUCTION_MAP_ORIGIN);
  requested.searchParams.set('v', MAP_FORK_REVISION);
  requested.searchParams.set('parentOrigin', APP_ORIGIN);
  return evaluateMapBoundary({
    requestedUrl: requested.toString(),
    finalUrl: requested.toString(),
    status: 200,
    headers: {
      ...HARDENING,
      'content-security-policy': MAP_CSP,
    },
    mapOrigin: PRODUCTION_MAP_ORIGIN,
    expectedParentOrigins: [...DEFAULT_APP_ORIGINS],
    expectedRevision: MAP_FORK_REVISION,
    body: MAP_BODY,
  });
}

describe('live CSP and map-origin proof', () => {
  it('accepts the exact enforced two-origin contract', () => {
    expect(validAppReport().ok).toBe(true);
    expect(validMapReport().ok).toBe(true);
  });

  it('fails an app policy that is report-only or omits the exact map origin', () => {
    const report = evaluateAppBoundary({
      requestedUrl: `${APP_ORIGIN}/`,
      finalUrl: `${APP_ORIGIN}/`,
      status: 200,
      headers: {
        ...HARDENING,
        'content-security-policy': "default-src 'self'; frame-src 'self'",
        'content-security-policy-report-only': APP_CSP,
      },
      mapOrigin: PRODUCTION_MAP_ORIGIN,
    });
    expect(report.ok).toBe(false);
    expect(report.checks.filter((item) => !item.ok).map((item) => item.name))
      .toEqual(expect.arrayContaining([
        'app.csp.enforced',
        'app.csp.map-origin',
      ]));
  });

  it('fails a map response framed by anything beyond the declared app hosts', () => {
    const request = new URL('/map/index.html', PRODUCTION_MAP_ORIGIN);
    request.searchParams.set('v', MAP_FORK_REVISION);
    request.searchParams.set('parentOrigin', APP_ORIGIN);
    const report = evaluateMapBoundary({
      requestedUrl: request.toString(),
      finalUrl: request.toString(),
      status: 200,
      headers: {
        ...HARDENING,
        'content-security-policy': MAP_CSP.replace(
          `frame-ancestors ${DEFAULT_APP_ORIGINS.join(' ')}`,
          `frame-ancestors ${DEFAULT_APP_ORIGINS.join(' ')} https://evil.example`,
        ),
        'x-frame-options': 'SAMEORIGIN',
      },
      mapOrigin: PRODUCTION_MAP_ORIGIN,
      expectedParentOrigins: [...DEFAULT_APP_ORIGINS],
      expectedRevision: MAP_FORK_REVISION,
      body: MAP_BODY,
    });
    expect(report.ok).toBe(false);
    expect(report.checks.filter((item) => !item.ok).map((item) => item.name))
      .toEqual(expect.arrayContaining([
        'map.csp.frame-ancestors',
        'map.x-frame-options',
      ]));
  });

  it('fails when a redirect drops the revision or parent handshake', () => {
    const request = new URL('/map/index.html', PRODUCTION_MAP_ORIGIN);
    request.searchParams.set('v', MAP_FORK_REVISION);
    request.searchParams.set('parentOrigin', APP_ORIGIN);
    const report = evaluateMapBoundary({
      requestedUrl: request.toString(),
      finalUrl: `${PRODUCTION_MAP_ORIGIN}/map/index.html`,
      status: 200,
      headers: {
        ...HARDENING,
        'content-security-policy': MAP_CSP,
      },
      mapOrigin: PRODUCTION_MAP_ORIGIN,
      expectedParentOrigins: [...DEFAULT_APP_ORIGINS],
      expectedRevision: MAP_FORK_REVISION,
      body: MAP_BODY,
    });

    expect(report.ok).toBe(false);
    expect(report.checks.filter((item) => !item.ok).map((item) => item.name))
      .toEqual(expect.arrayContaining([
        'map.revision',
        'map.parent-handshake',
      ]));
  });

  it('detects duplicate CSP directives instead of accepting the first silently', () => {
    expect(parseCsp("default-src 'self'; script-src 'self'; script-src *"))
      .toMatchObject({ duplicates: ['script-src'] });
  });
});

describe('release, health, migration, and obligation proofs', () => {
  const commit = 'a'.repeat(40);

  it('binds a live release response to the exact expected commit', () => {
    const report = evaluateReleaseIdentity({
      requestedUrl: `${APP_ORIGIN}/api/release`,
      finalUrl: `${APP_ORIGIN}/api/release`,
      status: 200,
      payload: {
        schemaVersion: 1,
        ok: true,
        service: 'settlementforge-web',
        release: commit,
      },
      expectedRelease: commit,
    });
    expect(report.ok).toBe(true);

    expect(evaluateReleaseIdentity({
      requestedUrl: `${APP_ORIGIN}/api/release`,
      finalUrl: `${APP_ORIGIN}/api/release`,
      status: 200,
      payload: {
        schemaVersion: 1,
        ok: true,
        service: 'settlementforge-web',
        release: 'b'.repeat(40),
      },
      expectedRelease: commit,
    }).ok).toBe(false);
  });

  it('requires db=up from a configured deep public health probe', () => {
    expect(evaluatePublicHealth({
      name: 'edge',
      requestedUrl: 'https://project.functions.supabase.co/health?deep=1',
      finalUrl: 'https://project.functions.supabase.co/health?deep=1',
      status: 200,
      payload: { ok: true, service: 'settlementforge-edge', db: 'up' },
      requireDb: true,
    }).ok).toBe(true);

    expect(evaluatePublicHealth({
      name: 'edge',
      requestedUrl: 'https://project.functions.supabase.co/health?deep=1',
      finalUrl: 'https://project.functions.supabase.co/health?deep=1',
      status: 200,
      payload: { ok: true, service: 'settlementforge-edge', db: 'unknown' },
      requireDb: true,
    }).ok).toBe(false);
  });

  it('fails stale migration or combined operational state closed', () => {
    expect(evaluateMigrationHead(
      MIGRATION_TRAIN_REPO_HEAD - 1,
      MIGRATION_TRAIN_REPO_HEAD,
    ).ok).toBe(false);
    expect(evaluateMigrationHead(
      MIGRATION_TRAIN_REPO_HEAD,
      MIGRATION_TRAIN_REPO_HEAD,
    ).ok).toBe(true);
    expect(evaluateMigrationHistory({
      head: MIGRATION_TRAIN_REPO_HEAD,
      count: MIGRATION_TRAIN_REPO_HEAD - 1,
      nonNumeric: 0,
      missing: [140],
    }, MIGRATION_TRAIN_REPO_HEAD).ok).toBe(false);

    const healthyObligations = {
      schemaVersion: 1,
      healthy: true,
      severity: 'healthy',
      accountDeletion: { open: 0 },
      paymentRefund: { open: 0 },
      stripeWebhook: { processing: 0 },
    };
    const healthyCommands = {
      schemaVersion: 1,
      healthy: true,
      severity: 'healthy',
      claimed: 0,
      reconcileRequired: 0,
      importReconcileRequired: 0,
    };
    expect(evaluateCombinedOperationalHealth(
      healthyObligations,
      healthyCommands,
    ).ok).toBe(true);

    const obligationWarning = evaluateCombinedOperationalHealth({
      ...healthyObligations,
      healthy: false,
      severity: 'warning',
    }, healthyCommands);
    expect(obligationWarning.ok).toBe(false);
    expect(obligationWarning).toMatchObject({
      severity: 'warning',
      obligationSeverity: 'warning',
      applicationCommandSeverity: 'healthy',
    });

    const commandCritical = evaluateCombinedOperationalHealth(
      healthyObligations,
      {
        ...healthyCommands,
        healthy: false,
        severity: 'critical',
        reconcileRequired: 1,
      },
    );
    expect(commandCritical.ok).toBe(false);
    expect(commandCritical).toMatchObject({
      severity: 'critical',
      obligationSeverity: 'healthy',
      applicationCommandSeverity: 'critical',
    });

    const missingCommandAuthority = evaluateCombinedOperationalHealth(
      healthyObligations,
      null,
    );
    expect(missingCommandAuthority.ok).toBe(false);
    expect(
      missingCommandAuthority.checks
        .filter((item) => !item.ok)
        .map((item) => item.name),
    ).toEqual(expect.arrayContaining([
      'application-commands.schema',
      'operational-health.severity',
    ]));
  });

  it('mints an aggregate pass only when every constituent report passes', () => {
    const reports = [
      validAppReport(),
      validMapReport(),
      evaluateMigrationHead(
        MIGRATION_TRAIN_REPO_HEAD,
        MIGRATION_TRAIN_REPO_HEAD,
      ),
    ];
    expect(summarizeVerification(reports)).toMatchObject({
      passed: true,
      reportCount: 3,
    });
    expect(summarizeVerification([
      ...reports,
      evaluateMigrationHead(
        MIGRATION_TRAIN_REPO_HEAD - 1,
        MIGRATION_TRAIN_REPO_HEAD,
      ),
    ])).toMatchObject({
      passed: false,
      failedChecks: ['migration.head-current'],
    });
  });

  it('binds the migration query to the exact configured production project', () => {
    expect(validateProductionDatabaseTarget({
      databaseUrl: [
        'postgresql://postgres.production-ref:secret@',
        'aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=verify-full',
      ].join(''),
      supabaseUrl: 'https://production-ref.supabase.co',
      expectedHost: 'aws-0-us-east-1.pooler.supabase.com',
    })).toMatchObject({
      database: 'postgres',
      projectRef: 'production-ref',
      label: 'aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    });

    expect(() => validateProductionDatabaseTarget({
      databaseUrl: [
        'postgresql://postgres.clone-ref:secret@',
        'aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=verify-full',
      ].join(''),
      supabaseUrl: 'https://production-ref.supabase.co',
      expectedHost: 'aws-0-us-east-1.pooler.supabase.com',
    })).toThrow(/does not identify the configured Supabase project/i);

    expect(() => validateProductionDatabaseTarget({
      databaseUrl: 'postgresql://postgres:secret@db.production-ref.supabase.co/postgres?sslmode=verify-full',
      supabaseUrl: 'https://production-ref.supabase.co',
      expectedHost: 'db.some-other-ref.supabase.co',
    })).toThrow(/does not match SF_PRODUCTION_DATABASE_HOST/i);
  });
});

describe('public release endpoint and secret-safe evidence', () => {
  const originalVercelSha = process.env.VERCEL_GIT_COMMIT_SHA;
  const originalViteRelease = process.env.VITE_RELEASE;
  const originalRelease = process.env.RELEASE;

  afterEach(() => {
    if (originalVercelSha == null) delete process.env.VERCEL_GIT_COMMIT_SHA;
    else process.env.VERCEL_GIT_COMMIT_SHA = originalVercelSha;
    if (originalViteRelease == null) delete process.env.VITE_RELEASE;
    else process.env.VITE_RELEASE = originalViteRelease;
    if (originalRelease == null) delete process.env.RELEASE;
    else process.env.RELEASE = originalRelease;
  });

  it('returns only a validated deployment revision and disables caching', async () => {
    const commit = 'c'.repeat(40);
    process.env.VERCEL_GIT_COMMIT_SHA = commit;
    const response = releaseHandler(new Request(
      `${APP_ORIGIN}/api/release`,
      { method: 'GET' },
    ));

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({
      schemaVersion: 1,
      ok: true,
      service: 'settlementforge-web',
      release: commit,
    });
  });

  it('fails closed instead of echoing a malformed environment value', async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = 'secret-not-a-commit';
    delete process.env.VITE_RELEASE;
    delete process.env.RELEASE;
    const response = releaseHandler(new Request(
      `${APP_ORIGIN}/api/release`,
      { method: 'GET' },
    ));

    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain(
      'secret-not-a-commit',
    );
  });

  it('strips credentials and query values from receipt labels and diagnostics', () => {
    expect(publicUrlLabel(
      'postgresql://operator:password@db.example:5432/app?sslmode=require',
    )).toBe('postgresql://db.example:5432/app');
    expect(redactDiagnostic(
      'failed postgresql://operator:password@db.example/app token-123',
      ['token-123'],
    )).toBe(
      'failed postgresql://[REDACTED]@db.example/app [REDACTED]',
    );
    expect(urlCredentialSecrets(
      'postgresql://operator:p%40ss@db.example/app?sslmode=require&token=abc123',
    )).toEqual(['p%40ss', 'p@ss', 'abc123']);
    expect(redactDiagnostic(
      'GET https://health.example/?token=query-secret failed',
    )).toBe(
      'GET https://health.example/?token=[REDACTED] failed',
    );
  });

  it('never exposes production credentials when CLI admission fails', () => {
    const result = spawnSync(process.execPath, [
      POST_DEPLOY_SCRIPT,
      '--health',
      'edge=https://project.functions.supabase.co/health?deep=1',
      '--json',
    ], {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        POST_DEPLOY_DATABASE_URL: [
          'postgresql://release_verifier:database-password@',
          'db.production-ref.supabase.co/postgres?sslmode=verify-full',
        ].join(''),
        SF_PRODUCTION_DATABASE_HOST: '',
        SUPABASE_URL: 'https://production-ref.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'service-role-secret',
      },
    });
    const output = `${result.stdout}${result.stderr}`;
    expect(result.status).toBe(1);
    expect(output).not.toContain('database-password');
    expect(output).not.toContain('service-role-secret');
    expect(output).toMatch(/SF_PRODUCTION_DATABASE_HOST/);
  });

  it.each([
    [
      ['--app-url', 'https://preview.example'],
      /app URL origin must be one of/i,
    ],
    [
      ['--map-url', 'https://map-preview.example/map/index.html'],
      /map URL must be https:\/\/map\.settlementforge\.com/i,
    ],
    [
      [
        '--health',
        'edge=https://project.functions.supabase.co/health?token=secret',
      ],
      /secret query parameters are forbidden/i,
    ],
  ])('rejects a non-production or credential-bearing public target', (
    extraArguments,
    expectedError,
  ) => {
    const health = extraArguments.includes('--health')
      ? []
      : [
          '--health',
          'edge=https://project.functions.supabase.co/health?deep=1',
        ];
    const result = spawnSync(process.execPath, [
      POST_DEPLOY_SCRIPT,
      ...extraArguments,
      ...health,
      '--json',
    ], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status).toBe(1);
    expect(output).toMatch(expectedError);
  });
});
