#!/usr/bin/env node
/**
 * Plan or execute the bounded production migration train on an attested clone.
 *
 * Planning is the default and performs no network or database work:
 *
 *   npm run ops:migrations:rehearse -- --json
 *
 * Execution is intentionally attended. It accepts the credential-bearing
 * connection string only through REHEARSAL_DATABASE_URL (never a CLI argument),
 * and requires all three independent admissions:
 *
 *   - the target host is exactly allowlisted;
 *   - a short-lived file binds that host/database to a source snapshot receipt;
 *   - the database itself reports the same rehearsal id through clone-only
 *     Postgres settings.
 *
 * The Supabase CLI applies one staged wave at a time. Each stage exposes only
 * migrations through that wave's upper bound, so a successful command cannot
 * run ahead into the next subsystem. Read-only psql probes prove history,
 * expected objects, and data-integrity deltas before proceeding.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INTEGRITY_SNAPSHOT_SQL,
  MIGRATION_HISTORY_SQL,
  REHEARSAL_IDENTITY_SQL,
  buildMigrationRehearsalPlan,
  compareIntegritySnapshots,
  expectedObjectPresenceSql,
  missingExpectedObjects,
  parseRehearsalTarget,
  readAttestationFile,
  validateCloneAttestation,
} from './migrationRehearsalCore.mjs';
import {
  readSourceIdentity,
  receiptLabel,
  redactDiagnostic,
  sha256,
  urlCredentialSecrets,
  writeJsonReceiptAtomically,
} from './releaseEvidenceCore.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const ROLLBACK = join(ROOT, 'supabase', 'rollback');
const APPLIED_HEAD = join(ROOT, 'supabase', 'applied-head.json');
const CONFIG = join(ROOT, 'supabase', 'config.toml');
const DEFAULT_RECEIPT_DIRECTORY = join(
  ROOT,
  'artifacts',
  'ops',
  'migration-rehearsal',
);

const MIGRATION_NAME = /^(\d+)_.*\.sql$/;
const SOURCE_IDENTITY_PATHS = Object.freeze([
  'supabase/migrations',
  'supabase/rollback',
  'supabase/applied-head.json',
  'supabase/config.toml',
  'scripts/ops',
  'package.json',
  'package-lock.json',
]);

function usage() {
  return `
Usage:
  node scripts/ops/migration-rehearsal.mjs [--plan] [--json]
  node scripts/ops/migration-rehearsal.mjs --execute \\
    --attestation <clone-attestation.json> [--receipt <receipt.json>] [--json]

Execution environment:
  REHEARSAL_DATABASE_URL                 credential-bearing clone URL
  SF_MIGRATION_REHEARSAL_ALLOWED_HOSTS   comma-separated exact clone hosts
  SF_PRODUCTION_DATABASE_HOST            production denylist (or set project ref/URL)
  SUPABASE_PROJECT_REF                   production project-ref denylist
  SF_SUPABASE_CLI_BIN                    Supabase CLI path/name (default: supabase)
`.trim();
}

/** @param {string[]} argv @param {string} flag */
function argValue(argv, flag) {
  const exact = argv.indexOf(flag);
  if (exact >= 0) return argv[exact + 1];
  const inline = argv.find((argument) => argument.startsWith(`${flag}=`));
  return inline?.slice(flag.length + 1);
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function readAppliedHead() {
  const ledger = JSON.parse(readFileSync(APPLIED_HEAD, 'utf8'));
  if (!Number.isInteger(ledger.appliedHead)) {
    throw new Error('supabase/applied-head.json has no integer appliedHead.');
  }
  return ledger;
}

/** @param {string} supabaseUrl */
function productionReferences(supabaseUrl) {
  const references = [
    process.env.SF_PRODUCTION_DATABASE_HOST || '',
    process.env.SUPABASE_PROJECT_REF || '',
  ];
  if (supabaseUrl) {
    try {
      const hostname = new URL(supabaseUrl).hostname.toLowerCase();
      references.push(hostname);
      if (hostname.endsWith('.supabase.co')) {
        references.push(hostname.split('.')[0]);
      }
    } catch {
      // A malformed optional SUPABASE_URL cannot weaken the positive admission.
    }
  }
  return references;
}

/**
 * Every psql probe is forced read-only by the connection, not merely by review
 * of the SQL string.
 *
 * @param {string} databaseUrl
 * @param {string} sql
 */
function psql(databaseUrl, sql) {
  const result = spawnSync(
    'psql',
    ['-X', '--no-psqlrc', '--tuples-only', '--no-align', '--command', sql],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        PGDATABASE: databaseUrl,
        PGCONNECT_TIMEOUT: '10',
        PGOPTIONS: [
          '-c default_transaction_read_only=on',
          '-c statement_timeout=30000',
          '-c lock_timeout=5000',
        ].join(' '),
      },
      maxBuffer: 10 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `Read-only database probe failed: ${result.stderr || result.stdout}`,
    );
  }
  return result.stdout.trim();
}

/** @param {string} databaseUrl @param {string} sql */
function psqlJson(databaseUrl, sql) {
  const output = psql(databaseUrl, sql);
  try {
    return JSON.parse(output);
  } catch {
    throw new Error('A read-only database probe returned invalid JSON.');
  }
}

/**
 * Capture the exact migration/config bytes that every wave will use.
 *
 * The plan was built from the same files, so each pending migration is checked
 * against its planned hash before the first database write. Stages are then
 * materialized from immutable strings in this snapshot rather than re-reading
 * a concurrently changing checkout between waves.
 *
 * @param {ReturnType<typeof buildMigrationRehearsalPlan>} plan
 */
export function captureWaveWorkspaceSnapshot(plan) {
  const planned = new Map(
    plan.waves.flatMap((wave) => wave.migrations)
      .map((migration) => [migration.number, migration]),
  );
  const migrations = readdirSync(MIGRATIONS)
    .map((name) => {
      const match = name.match(MIGRATION_NAME);
      if (!match || Number(match[1]) > plan.repoHead) return null;
      const source = readFileSync(join(MIGRATIONS, name), 'utf8');
      return Object.freeze({
        number: Number(match[1]),
        name,
        source,
        sha256: sha256(source),
      });
    })
    .filter(Boolean)
    .sort((left, right) =>
      left.number - right.number || left.name.localeCompare(right.name));

  if (
    migrations.length !== plan.repoHead
    || migrations[0]?.number !== 1
    || migrations.at(-1)?.number !== plan.repoHead
  ) {
    throw new Error(
      `Workspace snapshot must contain migrations 1–${plan.repoHead} exactly.`,
    );
  }
  for (const [number, expected] of planned) {
    const observed = migrations.find((migration) =>
      migration.number === number);
    if (
      observed?.name !== expected.name
      || observed?.sha256 !== expected.sha256
    ) {
      throw new Error(
        `Migration ${number} changed after the rehearsal plan was built.`,
      );
    }
  }

  const configSource = readFileSync(CONFIG, 'utf8');
  const configSha256 = sha256(configSource);
  const workspaceSourceSha256 = sha256([
    ...migrations.map((migration) =>
      `${migration.number}\0${migration.name}\0${migration.sha256}\n`),
    `config\0${configSha256}\n`,
  ].join(''));
  return Object.freeze({
    repoHead: plan.repoHead,
    migrationCount: migrations.length,
    migrations: Object.freeze(migrations),
    configSource,
    configSha256,
    workspaceSourceSha256,
  });
}

/**
 * Create a minimal Supabase project containing only migrations through the
 * current wave. The directory is disposable and contains no credentials.
 *
 * @param {number} through
 * @param {ReturnType<typeof captureWaveWorkspaceSnapshot>} snapshot
 */
export function stageWaveWorkspace(through, snapshot) {
  if (
    !Number.isInteger(through)
    || through < 1
    || through > snapshot?.repoHead
  ) {
    throw new Error('A valid captured workspace and wave boundary are required.');
  }
  const workspace = mkdtempSync(join(tmpdir(), 'sf-migration-wave-'));
  const stagedSupabase = join(workspace, 'supabase');
  const stagedMigrations = join(stagedSupabase, 'migrations');
  mkdirSync(stagedMigrations, { recursive: true });
  writeFileSync(
    join(stagedSupabase, 'config.toml'),
    snapshot.configSource,
    'utf8',
  );

  const copied = [];
  for (const migration of snapshot.migrations) {
    if (migration.number > through) continue;
    writeFileSync(
      join(stagedMigrations, migration.name),
      migration.source,
      'utf8',
    );
    copied.push(migration.name);
  }
  return { workspace, copied };
}

/**
 * @param {{
 *   cli: string,
 *   workspace: string,
 *   databaseUrl: string,
 *   dryRun: boolean,
 * }} options
 */
function runSupabasePush({
  cli,
  workspace,
  databaseUrl,
  dryRun,
}) {
  const args = [
    '--workdir',
    workspace,
    '--yes',
    'db',
    'push',
    '--db-url',
    databaseUrl,
    '--include-all',
  ];
  if (dryRun) args.push('--dry-run');

  const started = Date.now();
  const result = spawnSync(cli, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `Supabase ${dryRun ? 'dry-run' : 'push'} failed: ${output}`,
    );
  }
  return Object.freeze({
    durationMs: Date.now() - started,
    outputSha256: sha256(output),
  });
}

/** @param {Record<string, any>} history @param {number} expectedHead */
function assertMigrationHistory(history, expectedHead) {
  if (
    Number(history.head) !== expectedHead
    || Number(history.count) !== expectedHead
    || Number(history.nonNumeric) !== 0
    || !Array.isArray(history.missing)
    || history.missing.length > 0
  ) {
    throw new Error(
      `Migration history is not contiguous through ${expectedHead}.`,
    );
  }
}

function cliVersion(cli) {
  return execFileSync(cli, ['--version'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function planForLedger() {
  const ledger = readAppliedHead();
  const plan = buildMigrationRehearsalPlan({
    migrationDirectory: MIGRATIONS,
    rollbackDirectory: ROLLBACK,
    appliedHead: ledger.appliedHead,
  });
  return { ledger, plan };
}

function printPlan(plan, json) {
  if (json) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  console.log(
    `Migration rehearsal: applied ${plan.appliedHead} → repo ${plan.repoHead} `
    + `(${plan.pendingCount} pending)`,
  );
  if (plan.waves.length === 0) {
    console.log('No pending migration train.');
    return;
  }
  for (const wave of plan.waves) {
    console.log(`  ${wave.from}–${wave.to}  ${wave.id}`);
    console.log(`    ${wave.purpose}`);
    console.log(`    rollback: ${wave.rollback.mode}`);
  }
}

/** @param {Record<string, any>} left @param {Record<string, any>} right */
function sourceIdentityMatches(left, right) {
  return (
    left.commit === right.commit
    && left.dirty === right.dirty
    && left.sourceFingerprint === right.sourceFingerprint
    && left.inputCount === right.inputCount
  );
}

/**
 * @param {string[]} [argv]
 */
export function runMigrationRehearsal(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(usage());
    return { code: 0, report: null };
  }
  const json = argv.includes('--json');
  const execute = argv.includes('--execute');
  const { ledger, plan } = planForLedger();
  if (!execute) {
    printPlan(plan, json);
    return { code: 0, report: plan };
  }
  if (plan.pendingCount === 0) {
    throw new Error('There are no pending migrations to rehearse.');
  }

  const databaseUrl = String(process.env.REHEARSAL_DATABASE_URL || '').trim();
  if (!databaseUrl) {
    throw new Error(
      'REHEARSAL_DATABASE_URL is required for --execute and is accepted only via the environment.',
    );
  }
  const target = parseRehearsalTarget(databaseUrl);
  const attestationPath = argValue(argv, '--attestation');
  if (!attestationPath) {
    throw new Error('--attestation <clone-attestation.json> is required.');
  }
  const allowedHosts = String(
    process.env.SF_MIGRATION_REHEARSAL_ALLOWED_HOSTS || '',
  ).split(',');
  const attestation = validateCloneAttestation({
    attestation: readAttestationFile(resolve(attestationPath)),
    target,
    appliedHead: plan.appliedHead,
    allowedHosts,
    productionRefs: productionReferences(process.env.SUPABASE_URL || ''),
  });

  const identity = psqlJson(databaseUrl, REHEARSAL_IDENTITY_SQL);
  if (
    identity.database !== target.database
    || identity.environment !== 'migration-rehearsal'
    || identity.rehearsalId !== attestation.rehearsalId
    || identity.readOnly !== 'on'
  ) {
    throw new Error(
      'The database clone marker does not match the admitted rehearsal target.',
    );
  }
  const initialHistory = psqlJson(databaseUrl, MIGRATION_HISTORY_SQL);
  assertMigrationHistory(initialHistory, plan.appliedHead);

  const cli = String(process.env.SF_SUPABASE_CLI_BIN || 'supabase');
  const sourceBeforeSnapshot = readSourceIdentity(
    ROOT,
    SOURCE_IDENTITY_PATHS,
  );
  const workspaceSnapshot = captureWaveWorkspaceSnapshot(plan);
  const source = readSourceIdentity(ROOT, SOURCE_IDENTITY_PATHS);
  if (!sourceIdentityMatches(sourceBeforeSnapshot, source)) {
    throw new Error(
      'Rehearsal source changed while the immutable workspace was captured.',
    );
  }
  const version = cliVersion(cli);
  const startedAt = new Date().toISOString();
  const waveReceipts = [];
  let priorSnapshot = psqlJson(databaseUrl, INTEGRITY_SNAPSHOT_SQL);

  for (const wave of plan.waves) {
    const staged = stageWaveWorkspace(wave.to, workspaceSnapshot);
    const waveStarted = Date.now();
    try {
      const dryRun = runSupabasePush({
        cli,
        workspace: staged.workspace,
        databaseUrl,
        dryRun: true,
      });
      const apply = runSupabasePush({
        cli,
        workspace: staged.workspace,
        databaseUrl,
        dryRun: false,
      });
      const history = psqlJson(databaseUrl, MIGRATION_HISTORY_SQL);
      assertMigrationHistory(history, wave.to);
      const presence = psqlJson(
        databaseUrl,
        expectedObjectPresenceSql(wave.expectedObjects),
      );
      const missing = missingExpectedObjects(presence);
      if (missing.length) {
        throw new Error(
          `Wave ${wave.id} is missing expected objects: ${missing.join(', ')}.`,
        );
      }
      const snapshot = psqlJson(databaseUrl, INTEGRITY_SNAPSHOT_SQL);
      const integrity = compareIntegritySnapshots(priorSnapshot, snapshot);
      if (!integrity.ok) {
        throw new Error(
          `Wave ${wave.id} violated integrity checks: ${integrity.failures.join(', ')}.`,
        );
      }

      waveReceipts.push(Object.freeze({
        id: wave.id,
        from: wave.from,
        to: wave.to,
        passed: true,
        durationMs: Date.now() - waveStarted,
        dryRun,
        apply,
        history,
        expectedObjects: presence,
        integrity,
        before: priorSnapshot,
        after: snapshot,
      }));
      priorSnapshot = snapshot;
    } finally {
      // `workspace` was created by mkdtemp with this exact process-owned prefix.
      rmSync(staged.workspace, { recursive: true, force: true });
    }
  }

  const finalSource = readSourceIdentity(ROOT, SOURCE_IDENTITY_PATHS);
  if (!sourceIdentityMatches(source, finalSource)) {
    throw new Error(
      'Rehearsal source changed during execution; no receipt was published.',
    );
  }
  const finishedAt = new Date().toISOString();
  const receipt = Object.freeze({
    schemaVersion: 1,
    kind: 'settlementforge_migration_rehearsal',
    passed: true,
    startedAt,
    finishedAt,
    source,
    sourceAppliedHead: ledger.appliedHead,
    repoHead: plan.repoHead,
    migrationSetSha256: plan.migrationSetSha256,
    workspaceSource: Object.freeze({
      migrationCount: workspaceSnapshot.migrationCount,
      configSha256: workspaceSnapshot.configSha256,
      sha256: workspaceSnapshot.workspaceSourceSha256,
    }),
    clone: attestation,
    supabaseCliVersion: version,
    initialHistory,
    finalHistory: waveReceipts.at(-1).history,
    waves: waveReceipts,
  });
  const explicitReceipt = argValue(argv, '--receipt');
  const receiptPath = explicitReceipt
    ? resolve(explicitReceipt)
    : join(
      DEFAULT_RECEIPT_DIRECTORY,
      `${timestamp()}-${source.commit.slice(0, 12)}.json`,
    );
  writeJsonReceiptAtomically(receiptPath, receipt);

  if (json) console.log(JSON.stringify(receipt));
  else {
    console.log(
      `Migration rehearsal passed: ${plan.appliedHead} → ${plan.repoHead} `
      + `across ${waveReceipts.length} waves.`,
    );
    console.log(`Receipt: ${receiptLabel(ROOT, receiptPath)}`);
  }
  return { code: 0, report: receipt, receiptPath };
}

function main() {
  const databaseUrl = String(process.env.REHEARSAL_DATABASE_URL || '');
  try {
    const result = runMigrationRehearsal();
    process.exitCode = result.code;
  } catch (error) {
    const message = redactDiagnostic(error, [
      databaseUrl,
      ...urlCredentialSecrets(databaseUrl),
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      process.env.SUPABASE_ACCESS_TOKEN || '',
    ]);
    if (process.argv.includes('--json')) {
      console.error(JSON.stringify({
        ok: false,
        kind: 'settlementforge_migration_rehearsal_error',
        error: message,
      }));
    } else {
      console.error(`[migration-rehearsal] ${message}`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
