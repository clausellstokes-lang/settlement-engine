#!/usr/bin/env node
/**
 * backup-restore-drill.mjs — produce, restore, and verify a portable Supabase
 * backup with a machine-readable evidence receipt.
 *
 * Modes:
 *   --check                       safe local preflight (default)
 *   --dump                        dump the linked production project
 *   --restore <file> --target <url>
 *                                 restore into an explicitly allowed scratch DB
 *   --verify <url>                verify a restored scratch DB
 *
 * Safety is positive, not heuristic. Restore/verify accepts localhost by
 * default; a remote scratch hostname must be listed exactly in
 * SF_RESTORE_DRILL_ALLOWED_HOSTS. Any Supabase-hosted target is refused even if
 * allowlisted. A dump must carry the adjacent SHA-256 manifest this script
 * creates unless the attended operator passes --allow-unmanifested.
 *
 * Artifacts and receipts are written under backups/ by default. That directory
 * is gitignored because dumps contain production user data. Move completed
 * artifacts into the encrypted backup store after the attended drill.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const MIGRATIONS = path.join(ROOT, 'supabase', 'migrations');
const APPLIED_HEAD = path.join(ROOT, 'supabase', 'applied-head.json');
const BACKUPS = path.join(ROOT, 'backups');
const RECEIPTS = path.join(BACKUPS, 'drill-receipts');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const ok = (message) => console.log(`${GREEN}✓${RESET} ${message}`);
const warn = (message) => console.log(`${YELLOW}!${RESET} ${message}`);
const bad = (message) => console.log(`${RED}✗${RESET} ${message}`);

function argValue(argv, flag) {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
}

function hasArg(argv, flag) {
  return argv.includes(flag);
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function readMigrationLedger() {
  const numbers = fs.readdirSync(MIGRATIONS)
    .filter((file) => /^\d+_.*\.sql$/.test(file))
    .map((file) => Number(file.split('_')[0]))
    .sort((a, b) => a - b);
  const gaps = [];
  for (let index = 1; index < numbers.length; index += 1) {
    if (numbers[index] !== numbers[index - 1] + 1) {
      gaps.push(`${numbers[index - 1]}→${numbers[index]}`);
    }
  }
  return {
    max: numbers[numbers.length - 1] ?? 0,
    count: numbers.length,
    gaps,
  };
}

function readAppliedHead() {
  return JSON.parse(fs.readFileSync(APPLIED_HEAD, 'utf8'));
}

function commandExists(binary) {
  try {
    execFileSync('which', [binary], {
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

function run(binary, args, options = {}) {
  return execFileSync(binary, args, {
    cwd: ROOT,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: options.capture ? 'utf8' : undefined,
    env: process.env,
  });
}

function sha256File(file) {
  const hash = createHash('sha256');
  hash.update(fs.readFileSync(file));
  return hash.digest('hex');
}

function gitCommit() {
  try {
    return run('git', ['rev-parse', 'HEAD'], { capture: true }).trim();
  } catch {
    return null;
  }
}

function atomicJsonWrite(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    mode: 0o600,
  });
  fs.renameSync(temporary, file);
}

function parseTarget(target) {
  let parsed;
  try {
    parsed = new URL(String(target || ''));
  } catch {
    throw new Error('target is not a valid PostgreSQL URL');
  }
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('target must use postgres:// or postgresql://');
  }
  const hostname = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (!hostname) throw new Error('target hostname is missing');
  if (/supabase\.(co|com|net)$/i.test(hostname)) {
    throw new Error('Supabase-hosted targets are never valid restore-drill targets');
  }
  const local = ['localhost', '127.0.0.1', '::1'].includes(hostname);
  const allowlist = new Set(
    String(process.env.SF_RESTORE_DRILL_ALLOWED_HOSTS || '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!local && !allowlist.has(hostname)) {
    throw new Error(
      `remote scratch host ${hostname} is not in SF_RESTORE_DRILL_ALLOWED_HOSTS`,
    );
  }
  return {
    url: String(target),
    hostname,
    port: parsed.port || '5432',
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
    local,
  };
}

function describeTarget(parsed) {
  return `${parsed.hostname}:${parsed.port}/${parsed.database}`;
}

function psql(target, sql) {
  return run(
    'psql',
    [target.url, '-v', 'ON_ERROR_STOP=1', '-tAc', sql],
    { capture: true },
  ).trim();
}

function tableExists(target, qualified) {
  return psql(
    target,
    `select to_regclass('${qualified.replaceAll("'", "''")}') is not null`,
  ) === 't';
}

function columnExists(target, qualified, column) {
  const [schema, table] = qualified.split('.');
  return psql(
    target,
    `select exists(
       select 1
         from information_schema.columns
        where table_schema = '${schema.replaceAll("'", "''")}'
          and table_name = '${table.replaceAll("'", "''")}'
          and column_name = '${column.replaceAll("'", "''")}'
     )`,
  ) === 't';
}

function writeReceipt(argv, receipt) {
  const explicit = argValue(argv, '--receipt');
  const file = explicit
    ? path.resolve(explicit)
    : path.join(RECEIPTS, `${receipt.kind}-${stamp()}.json`);
  atomicJsonWrite(file, receipt);
  ok(`evidence receipt: ${path.relative(ROOT, file)}`);
  return file;
}

function runCheck() {
  let failures = 0;
  for (const binary of ['npx', 'psql', 'git']) {
    if (commandExists(binary)) ok(`${binary} reachable`);
    else {
      bad(`${binary} is not on PATH`);
      failures += 1;
    }
  }

  if (process.env.SUPABASE_PROJECT_REF) {
    ok('SUPABASE_PROJECT_REF set');
  } else {
    warn('SUPABASE_PROJECT_REF unset — required only for --dump');
  }
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    ok('SUPABASE_ACCESS_TOKEN set');
  } else {
    warn('SUPABASE_ACCESS_TOKEN unset — required only for --dump');
  }

  const ledger = readMigrationLedger();
  if (ledger.gaps.length === 0) {
    ok(`migration files contiguous (${ledger.count}, head ${ledger.max})`);
  } else {
    bad(`migration files have gaps: ${ledger.gaps.join(', ')}`);
    failures += 1;
  }

  if (!fs.existsSync(APPLIED_HEAD)) {
    bad('supabase/applied-head.json is missing');
    failures += 1;
  } else {
    const applied = readAppliedHead();
    const appliedHead = Number(applied.appliedHead);
    const referenced = fs.readdirSync(MIGRATIONS).some(
      (file) => file.startsWith(
        `${String(appliedHead).padStart(3, '0')}_`,
      ),
    );
    if (!Number.isInteger(appliedHead)) {
      bad('appliedHead is not an integer');
      failures += 1;
    } else if (appliedHead > ledger.max || !referenced) {
      bad(`appliedHead ${appliedHead} does not name a valid migration`);
      failures += 1;
    } else {
      ok(`applied-head ${appliedHead} is valid (repo head ${ledger.max})`);
    }
  }

  try {
    const ignored = run(
      'git',
      ['check-ignore', '-q', 'backups/probe.sql'],
      { capture: true },
    );
    void ignored;
    ok('backups/ is excluded from git');
  } catch {
    bad('backups/ is not excluded from git');
    failures += 1;
  }

  console.log('');
  if (failures) {
    bad(`preflight FAILED — ${failures} issue(s)`);
    return 1;
  }
  ok('preflight PASSED');
  return 0;
}

function runDump() {
  const projectRef = String(process.env.SUPABASE_PROJECT_REF || '').trim();
  if (!projectRef) {
    bad('SUPABASE_PROJECT_REF is required for --dump');
    return 1;
  }
  if (!/^[a-z0-9-]+$/i.test(projectRef)) {
    bad('SUPABASE_PROJECT_REF contains unexpected characters');
    return 1;
  }
  if (!String(process.env.SUPABASE_ACCESS_TOKEN || '').trim()) {
    bad('SUPABASE_ACCESS_TOKEN is required for --dump');
    return 1;
  }

  fs.mkdirSync(BACKUPS, { recursive: true });
  const startedAt = new Date();
  const file = path.join(
    BACKUPS,
    `supabase-${projectRef}-${stamp()}.sql`,
  );
  try {
    run('npx', ['supabase', 'link', '--project-ref', projectRef]);
    run('npx', ['supabase', 'db', 'dump', '--linked', '-f', file]);
  } catch (error) {
    bad(`dump command failed: ${error.message}`);
    return 1;
  }

  const sizeBytes = fs.existsSync(file) ? fs.statSync(file).size : 0;
  if (sizeBytes <= 0) {
    bad('dump artifact is empty');
    return 1;
  }

  const applied = readAppliedHead();
  const ledger = readMigrationLedger();
  const manifest = {
    schemaVersion: 1,
    kind: 'settlementforge_logical_backup',
    createdAt: new Date().toISOString(),
    startedAt: startedAt.toISOString(),
    sourceProjectRef: projectRef,
    sourceAppliedHead: Number(applied.appliedHead),
    repoMigrationHead: ledger.max,
    repoCommit: gitCommit(),
    fileName: path.basename(file),
    sizeBytes,
    sha256: sha256File(file),
  };
  const manifestFile = `${file}.manifest.json`;
  atomicJsonWrite(manifestFile, manifest);
  ok(
    `dump written: ${path.relative(ROOT, file)} `
      + `(${(sizeBytes / 1024 / 1024).toFixed(2)} MB)`,
  );
  ok(`manifest written: ${path.relative(ROOT, manifestFile)}`);
  console.log(
    `  Restore next with --restore ${path.relative(ROOT, file)} `
      + `--target <scratch-postgres-url>`,
  );
  return 0;
}

function verifyManifest(file, allowUnmanifested) {
  const manifestFile = `${file}.manifest.json`;
  if (!fs.existsSync(manifestFile)) {
    if (allowUnmanifested) {
      warn('dump has no adjacent manifest; operator explicitly allowed it');
      return null;
    }
    throw new Error(
      `missing ${path.basename(manifestFile)}; pass --allow-unmanifested only after independent provenance verification`,
    );
  }
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (
    manifest?.schemaVersion !== 1 ||
    manifest?.kind !== 'settlementforge_logical_backup'
  ) {
    throw new Error('dump manifest shape is unsupported');
  }
  const digest = sha256File(file);
  if (digest !== manifest.sha256) {
    throw new Error('dump SHA-256 does not match its manifest');
  }
  if (Number(manifest.sizeBytes) !== fs.statSync(file).size) {
    throw new Error('dump byte size does not match its manifest');
  }
  return manifest;
}

function verifyDatabase(target, { allowEmpty = false } = {}) {
  const checks = [];
  const counts = {};
  const checksums = {};
  const record = (name, passed, detail) => {
    checks.push({ name, passed, detail });
    (passed ? ok : bad)(`${name}${detail ? ` — ${detail}` : ''}`);
  };

  const requiredTables = [
    'public.profiles',
    'public.settlements',
    'public.saved_maps',
    'public.credit_ledger',
  ];
  for (const qualified of requiredTables) {
    const exists = tableExists(target, qualified);
    record(`${qualified} exists`, exists);
    if (!exists) continue;
    const table = qualified.split('.')[1];
    const count = Number(psql(target, `select count(*) from ${qualified}`));
    counts[table] = count;
    checksums[table] = psql(
      target,
      `select md5(coalesce(string_agg(id::text, ',' order by id::text), '')) from ${qualified}`,
    );
  }

  const restoredRows = ['profiles', 'settlements', 'credit_ledger']
    .reduce((total, table) => total + (counts[table] || 0), 0);
  record(
    'restore contains application rows',
    allowEmpty || restoredRows > 0,
    allowEmpty
      ? `${restoredRows} rows (explicit --allow-empty)`
      : `${restoredRows} rows across profiles/settlements/credit_ledger`,
  );

  const migrationTable = tableExists(
    target,
    'supabase_migrations.schema_migrations',
  );
  record('migration ledger exists', migrationTable);
  let restoredMigrationHead = null;
  if (migrationTable) {
    restoredMigrationHead = Number(psql(
      target,
      `select coalesce(max(version::bigint), 0)
         from supabase_migrations.schema_migrations`,
    ));
    const expected = Number(readAppliedHead().appliedHead);
    record(
      'migration head reaches the recorded production head',
      Number.isFinite(restoredMigrationHead)
        && restoredMigrationHead >= expected,
      `restored ${restoredMigrationHead}; recorded production ${expected}`,
    );
  }

  const rlsMissing = Number(psql(
    target,
    `select count(*)
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname in (
          'profiles', 'settlements', 'saved_maps', 'credit_ledger'
        )
        and c.relkind = 'r'
        and c.relrowsecurity is not true`,
  ));
  record('RLS enabled on core owner data', rlsMissing === 0);

  const unvalidatedForeignKeys = Number(psql(
    target,
    `select count(*)
       from pg_constraint con
       join pg_namespace n on n.oid = con.connamespace
      where n.nspname = 'public'
        and con.contype = 'f'
        and con.convalidated is not true`,
  ));
  record(
    'public foreign keys are validated',
    unvalidatedForeignKeys === 0,
    `${unvalidatedForeignKeys} unvalidated`,
  );

  const orphanQueries = [
    [
      'profiles without auth users',
      `select count(*) from public.profiles p
        left join auth.users u on u.id = p.id where u.id is null`,
    ],
    [
      'settlements without auth users',
      `select count(*) from public.settlements s
        left join auth.users u on u.id = s.user_id where u.id is null`,
    ],
    [
      'saved maps without auth users',
      `select count(*) from public.saved_maps m
        left join auth.users u on u.id = m.user_id where u.id is null`,
    ],
    [
      'credit rows without auth users',
      `select count(*) from public.credit_ledger l
        left join auth.users u on u.id = l.user_id where u.id is null`,
    ],
  ];
  for (const [name, sql] of orphanQueries) {
    const orphaned = Number(psql(target, sql));
    record(name, orphaned === 0, `${orphaned} orphaned`);
  }

  const negativeBalances = Number(psql(
    target,
    `select count(*) from public.profiles where credits < 0`,
  ));
  record('profile credit balances are non-negative', negativeBalances === 0);

  // Net-current durable-queue invariants. Constraints already prevent most
  // impossible states; these queries catch partial dumps or disabled triggers.
  if (
    tableExists(target, 'public.account_deletion_cleanup_jobs')
    && tableExists(target, 'public.deletion_requests')
  ) {
    const incoherent = Number(psql(
      target,
      `select count(*)
         from public.account_deletion_cleanup_jobs j
         left join public.deletion_requests d
           on d.id = j.deletion_request_id
        where d.id is null
           or (j.status = 'done' and d.status <> 'done')`,
    ));
    record('account-deletion queue coherence', incoherent === 0);
  }
  if (tableExists(target, 'public.payment_refund_obligations')) {
    const incoherent = Number(psql(
      target,
      `select count(*)
         from public.payment_refund_obligations
        where (status in ('pending', 'requires_action') and resolved_at is not null)
           or (status in ('succeeded', 'failed', 'canceled') and resolved_at is null)`,
    ));
    record('payment-refund lifecycle coherence', incoherent === 0);
  }
  if (
    tableExists(target, 'public.processed_webhook_events')
    && columnExists(
      target,
      'public.processed_webhook_events',
      'lease_token',
    )
  ) {
    const incoherent = Number(psql(
      target,
      `select count(*)
         from public.processed_webhook_events
        where first_claimed_at is null
           or (status = 'processing'
               and (lease_token is null or locked_at is null or completed_at is not null))
           or (status = 'retry'
               and (lease_token is not null or locked_at is not null or completed_at is not null))
           or (status = 'done'
               and (lease_token is not null or locked_at is not null or completed_at is null))
           or status not in ('processing', 'retry', 'done')`,
    ));
    record('Stripe webhook lease coherence', incoherent === 0);
  }

  return {
    passed: checks.every((check) => check.passed),
    checks,
    counts,
    checksums,
    restoredMigrationHead,
  };
}

function runVerify(argv, targetText, context = {}) {
  let target;
  try {
    target = parseTarget(targetText);
  } catch (error) {
    bad(`unsafe restore target: ${error.message}`);
    return { code: 1, report: null };
  }
  const startedAt = new Date();
  console.log(`Verifying scratch database ${describeTarget(target)} …`);
  let verification;
  try {
    verification = verifyDatabase(target, {
      allowEmpty: hasArg(argv, '--allow-empty'),
    });
  } catch (error) {
    bad(`verification query failed: ${error.message}`);
    return { code: 1, report: null };
  }
  const finishedAt = new Date();
  const receipt = {
    schemaVersion: 1,
    kind: context.restoreStartedAt
      ? 'backup_restore_drill'
      : 'backup_restore_verification',
    startedAt: (context.restoreStartedAt || startedAt).toISOString(),
    verifiedAt: finishedAt.toISOString(),
    repoCommit: gitCommit(),
    repoMigrationHead: readMigrationLedger().max,
    recordedProductionHead: Number(readAppliedHead().appliedHead),
    target: {
      hostname: target.hostname,
      port: target.port,
      database: target.database,
      local: target.local,
    },
    sourceManifest: context.manifest || null,
    restoreSeconds: context.restoreStartedAt
      ? Number(((startedAt - context.restoreStartedAt) / 1000).toFixed(3))
      : null,
    verifySeconds: Number(((finishedAt - startedAt) / 1000).toFixed(3)),
    artifactAgeSeconds: context.manifest?.createdAt
      ? Math.max(
          0,
          Math.floor(
            (finishedAt - new Date(context.manifest.createdAt)) / 1000,
          ),
        )
      : null,
    ...verification,
  };
  writeReceipt(argv, receipt);
  if (!verification.passed) {
    bad('restore verification FAILED');
    return { code: 1, report: receipt };
  }
  ok('restore verification PASSED');
  return { code: 0, report: receipt };
}

function runRestore(argv) {
  const fileArg = argValue(argv, '--restore');
  const targetText = argValue(argv, '--target');
  if (!fileArg) {
    bad('--restore <file> is required');
    return 1;
  }
  const file = path.resolve(fileArg);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    bad(`restore file does not exist: ${fileArg}`);
    return 1;
  }
  if (!targetText) {
    bad('--target <scratch-db-url> is required');
    return 1;
  }

  let target;
  let manifest;
  try {
    target = parseTarget(targetText);
    manifest = verifyManifest(file, hasArg(argv, '--allow-unmanifested'));
  } catch (error) {
    bad(error.message);
    return 1;
  }

  const restoreStartedAt = new Date();
  console.log(
    `Restoring ${path.basename(file)} into ${describeTarget(target)} …`,
  );
  try {
    run(
      'psql',
      [target.url, '-v', 'ON_ERROR_STOP=1', '-f', file],
    );
  } catch (error) {
    bad(`restore failed: ${error.message}`);
    return 1;
  }
  ok('restore completed; running integrity verification');
  return runVerify(argv, targetText, {
    restoreStartedAt,
    manifest,
  }).code;
}

const argv = process.argv.slice(2);
let code;
if (hasArg(argv, '--dump')) {
  code = runDump();
} else if (hasArg(argv, '--restore')) {
  code = runRestore(argv);
} else if (hasArg(argv, '--verify')) {
  const target = argValue(argv, '--verify');
  if (!target) {
    bad('--verify <scratch-db-url> is required');
    code = 1;
  } else {
    code = runVerify(argv, target).code;
  }
} else {
  code = runCheck();
}
process.exit(code);
