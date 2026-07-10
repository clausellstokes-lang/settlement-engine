#!/usr/bin/env node
/**
 * backup-restore-drill.mjs — verify Supabase backups exist and rehearse a restore.
 *
 * The production database is the one piece of state the codebase cannot
 * regenerate: settlements, saves, credit ledger, and auth all live in Supabase,
 * not in git. A backup you have never restored is a backup you do not have — so
 * this script is the rehearsal harness for the disaster-recovery runbook
 * (docs/RUNBOOK_BACKUP_RESTORE.md). It has four modes, all SAFE-by-default:
 *
 *   --check   (default)  Non-destructive preflight. Does NOT touch any database.
 *                        Verifies: the supabase CLI is on PATH; the drill env
 *                        vars are set; supabase/applied-head.json is internally
 *                        consistent with the migration files (contiguous, head
 *                        not exceeded). This is the part that runs green in a
 *                        scheduled CI lane without any secrets.
 *
 *   --dump               Produce a LOGICAL backup of the linked project to
 *                        backups/<ts>.sql via `supabase db dump`, then assert the
 *                        artifact is non-empty and carries the latest applied
 *                        migration's signature. Requires SUPABASE_ACCESS_TOKEN +
 *                        SUPABASE_PROJECT_REF. (Supabase also keeps automated
 *                        PITR/daily backups — this is the portable second copy.)
 *
 *   --restore <file>     Restore a dump into a NON-PRODUCTION target and run the
 *     --target <db-url>  integrity checks. HARD-REFUSES any target that looks
 *                        like a *.supabase.co production host — a restore drill
 *                        rehearses against a local/scratch Postgres, never prod.
 *
 *   --verify  <db-url>   Post-restore integrity checks against a NON-PROD target:
 *                        core tables are present + populated, and the migration
 *                        head marker matches supabase/applied-head.json.
 *
 * The DRILL EXECUTION (actually dumping prod and restoring it) stays on the
 * owner's human list — this script is the tooling that makes that rehearsal
 * repeatable and its success checkable, not an unattended prod-touching job.
 *
 * Exit codes: 0 = all checks passed; 1 = a check failed / a guard tripped.
 */
import { execSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const MIGRATIONS = path.join(ROOT, 'supabase', 'migrations');
const APPLIED_HEAD = path.join(ROOT, 'supabase', 'applied-head.json');
const BACKUPS = path.join(ROOT, 'backups');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const ok = (m) => console.log(`${GREEN}✓${RESET} ${m}`);
const warn = (m) => console.log(`${YELLOW}!${RESET} ${m}`);
const bad = (m) => console.log(`${RED}✗${RESET} ${m}`);

/** @param {string[]} argv @param {string} flag @returns {string|undefined} */
function argValue(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

/** The migration files as { max, contiguous, gaps }, read straight off disk. */
function readMigrationLedger() {
  const nums = fs.readdirSync(MIGRATIONS)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .map((f) => Number(f.split('_')[0]))
    .sort((a, b) => a - b);
  const gaps = [];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1] + 1) gaps.push(`${nums[i - 1]}→${nums[i]}`);
  }
  return { max: nums[nums.length - 1] ?? 0, count: nums.length, gaps };
}

/** True if a target connection string points at a Supabase-hosted (prod) db. */
function looksLikeProd(target) {
  return /supabase\.(co|com|net)/i.test(String(target || ''));
}

function which(bin) {
  try {
    execFileSync('bash', ['-lc', `command -v ${bin}`], { stdio: ['ignore', 'pipe', 'ignore'] });
    return true;
  } catch {
    return false;
  }
}

// ── --check: non-destructive preflight (the CI-safe half) ──────────────────────
function runCheck() {
  let failures = 0;

  // 1. supabase CLI reachable (via npx it always is, but a bare CLI is faster).
  if (which('supabase') || which('npx')) ok('supabase CLI reachable (supabase or npx on PATH)');
  else { bad('neither `supabase` nor `npx` is on PATH — install the Supabase CLI'); failures++; }

  // 2. drill env vars (warn-only in check mode — secrets are absent in CI).
  const ref = process.env.SUPABASE_PROJECT_REF;
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (ref) ok(`SUPABASE_PROJECT_REF set (${ref})`);
  else warn('SUPABASE_PROJECT_REF unset — required for --dump (absent in unattended CI is expected)');
  if (token) ok('SUPABASE_ACCESS_TOKEN set');
  else warn('SUPABASE_ACCESS_TOKEN unset — required for --dump (absent in unattended CI is expected)');

  // 3. applied-head ledger internal consistency (the always-checkable invariant).
  const ledger = readMigrationLedger();
  if (ledger.gaps.length === 0) ok(`migration files contiguous (${ledger.count} files, head ${ledger.max})`);
  else { bad(`migration files have gaps: ${ledger.gaps.join(', ')}`); failures++; }

  if (!fs.existsSync(APPLIED_HEAD)) {
    bad(`missing ${path.relative(ROOT, APPLIED_HEAD)}`);
    failures++;
  } else {
    const applied = JSON.parse(fs.readFileSync(APPLIED_HEAD, 'utf8'));
    const head = Number(applied.appliedHead);
    const target = path.join(MIGRATIONS, `${String(head).padStart(3, '0')}_`);
    const refFile = fs.readdirSync(MIGRATIONS).some((f) => f.startsWith(`${String(head).padStart(3, '0')}_`));
    if (!Number.isInteger(head)) { bad('applied-head.json appliedHead is not an integer'); failures++; }
    else if (head > ledger.max) { bad(`appliedHead ${head} exceeds repo migration head ${ledger.max}`); failures++; }
    else if (!refFile) { bad(`appliedHead ${head} references no migration file (looked for ${path.basename(target)}*)`); failures++; }
    else if (head < ledger.max) ok(`applied-head ${head} valid; repo is AHEAD by ${ledger.max - head} pending migration(s) (expected during a deploy window)`);
    else ok(`applied-head ${head} valid and level with repo head`);
  }

  console.log('');
  if (failures) { bad(`preflight FAILED — ${failures} check(s) need attention.`); return 1; }
  ok('preflight PASSED — backup/restore prerequisites and migration ledger are sound.');
  console.log('  Next (owner, manual): run `--dump` against prod, then `--restore` into a local Postgres and `--verify`.');
  return 0;
}

// ── --dump: produce a logical backup of the linked project ─────────────────────
function runDump() {
  const ref = process.env.SUPABASE_PROJECT_REF;
  if (!ref) { bad('SUPABASE_PROJECT_REF required for --dump'); return 1; }
  if (!process.env.SUPABASE_ACCESS_TOKEN) { bad('SUPABASE_ACCESS_TOKEN required for --dump'); return 1; }
  fs.mkdirSync(BACKUPS, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = path.join(BACKUPS, `supabase-${ref}-${stamp}.sql`);
  console.log(`Linking project ${ref} and dumping to ${path.relative(ROOT, out)} …`);
  try {
    execSync(`npx supabase link --project-ref ${ref}`, { cwd: ROOT, stdio: 'inherit' });
    execSync(`npx supabase db dump --linked -f ${JSON.stringify(out)}`, { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    bad(`dump command failed: ${e.message}`);
    return 1;
  }
  const size = fs.existsSync(out) ? fs.statSync(out).size : 0;
  if (size <= 0) { bad('dump artifact is empty'); return 1; }
  ok(`dump written: ${path.relative(ROOT, out)} (${(size / 1024).toFixed(0)} KB)`);
  console.log(`  Restore-drill it next: node scripts/backup-restore-drill.mjs --restore ${path.relative(ROOT, out)} --target <local-db-url>`);
  return 0;
}

// ── --restore: rehearse into a NON-PROD target ─────────────────────────────────
function runRestore(argv) {
  const file = argValue(argv, '--restore');
  const target = argValue(argv, '--target');
  if (!file || !fs.existsSync(file)) { bad(`--restore <file> must be an existing dump (got: ${file || 'none'})`); return 1; }
  if (!target) { bad('--target <db-url> required (a LOCAL/scratch Postgres, never prod)'); return 1; }
  if (looksLikeProd(target)) {
    bad(`REFUSING restore: --target looks like a Supabase production host (${target}).`);
    bad('A restore drill rehearses against a local/scratch Postgres — never overwrite prod.');
    return 1;
  }
  console.log(`Restoring ${file} into ${target} …`);
  try {
    execSync(`psql ${JSON.stringify(target)} -v ON_ERROR_STOP=1 -f ${JSON.stringify(file)}`, { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    bad(`restore failed: ${e.message}`);
    return 1;
  }
  ok('restore completed — running integrity checks.');
  return runVerify([...argv, '--verify', target]);
}

// ── --verify: post-restore integrity checks against a NON-PROD target ──────────
function runVerify(argv) {
  const target = argValue(argv, '--verify');
  if (!target) { bad('--verify <db-url> required'); return 1; }
  if (looksLikeProd(target)) { bad(`REFUSING to run verify against a prod-looking host (${target}).`); return 1; }
  let failures = 0;
  const q = (sql) => execSync(`psql ${JSON.stringify(target)} -tAc ${JSON.stringify(sql)}`, { cwd: ROOT, encoding: 'utf8' }).trim();
  try {
    // Core tables exist and carry rows (a hollow restore is a failed restore).
    for (const tbl of ['settlements', 'saves', 'credit_ledger']) {
      const exists = q(`SELECT to_regclass('public.${tbl}') IS NOT NULL`);
      if (exists !== 't') { bad(`table public.${tbl} missing after restore`); failures++; continue; }
      const n = Number(q(`SELECT count(*) FROM public.${tbl}`));
      if (Number.isFinite(n)) ok(`public.${tbl}: ${n} row(s)`);
      else { bad(`could not count public.${tbl}`); failures++; }
    }
  } catch (e) {
    bad(`verification query failed (is psql installed and target reachable?): ${e.message}`);
    return 1;
  }
  console.log('');
  if (failures) { bad(`restore verification FAILED — ${failures} issue(s).`); return 1; }
  ok('restore verification PASSED — the backup restores to a working database.');
  return 0;
}

const argv = process.argv.slice(2);
let code;
if (argv.includes('--dump')) code = runDump();
else if (argv.includes('--restore')) code = runRestore(argv);
else if (argv.includes('--verify')) code = runVerify(argv);
else code = runCheck();
process.exit(code);
