/**
 * profileRpcs.pglite.test.js — EXECUTION-level proof of the three profile RPCs
 * (A+ enforcement.6's unfinished PROFILE half; LT36 car 4).
 *
 * WHAT WAS MISSING. enforcement.6 asks that the "security boundary" tests EXECUTE rather
 * than grep. Its RLS half landed (tests/security/profileEscalation.pglite.test.js, commit
 * 75b0548) and its Done-when demands "a mutation proof both ways". The RPC half never
 * started: `update_display_name`, `admin_set_role` and `admin_grant_credits` were asserted
 * ONLY by grepping supabase/tests/profile_security.sql for the shape of a pgTAP call
 * (tests/security/profile_security.contract.test.js). A grep over a test file proves that a
 * test file mentions a function. It cannot tell you the function exists, runs, or rejects
 * anybody — and the whole thesis of enforcement.6 is that such a claim carries near-zero
 * assurance.
 *
 * WHAT THIS DOES. It loads the REAL, NET-CURRENT DDL for every function in the chain into
 * in-process Postgres (pglite) and calls the RPCs. No database is touched and no migration
 * is applied.
 *
 * ⛔ NET-CURRENT, NOT FIRST-DEFINED — the F7 LESSON, AND IT BITES HERE FOR REAL.
 * profileEscalation.pglite.test.js originally attacked migration 009's policy, which
 * migration 018 had already DROPPED: it verified dead SQL, and a regression in the live
 * policy would have shipped green. The same trap is live for these RPCs, and not
 * hypothetically: `update_display_name` is defined in 009 AND REDEFINED IN 195, which adds
 * the civility guard. A first-match extractor would load 009's version, which has no
 * civility call at all, and would then "prove" the name guard's behaviour against a
 * function production does not run. So every definition here is resolved by replaying the
 * whole migration corpus in file order and keeping the LAST definition standing — and the
 * suite ASSERTS that `update_display_name` resolved past 009, so the extractor cannot
 * silently regress to the first match.
 *
 * ⛔ AND THE NEGATIVE CONTROL IS A SUITE MEMBER, NOT A ONE-OFF. "The RPC rejected a regular
 * user" and "the RPC threw for some unrelated reason — a missing table, a typo'd argument"
 * are indistinguishable from a passing `rejects.toThrow`. The MUTATION arm at the bottom
 * boots a SECOND database identical in every respect except that the privilege gate
 * `current_user_is_privileged()` is loosened to `select true`, and asserts the same calls
 * now SUCCEED. That is what makes the rejections above evidence of the gate rather than
 * evidence of a broken fixture, and it re-runs on every gate run instead of living in a
 * commit message nobody re-executes.
 *
 * pglite caveats, baked in so the suite cannot false-green:
 *   • pglite's default connection is a SUPERUSER. These RPCs are SECURITY DEFINER and gate
 *     on their OWN `current_user_is_privileged()` / `auth.uid()` checks rather than on RLS,
 *     so the definer role is not the control here — the function bodies are, which is
 *     exactly the server-side enforcement production relies on.
 *   • The identity seam is `auth.uid()`, stubbed to read `test.uid` exactly as
 *     profileEscalation.pglite.test.js does. Setting it to '' models an unauthenticated
 *     caller.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const present = existsSync(MIG_DIR);

const MIGRATION_FILES = present
  ? readdirSync(MIG_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort()
  : [];

/**
 * The NET-CURRENT definition of `public.<name>`: replay every migration in file order and
 * keep the LAST `create or replace function` standing.
 *
 * ⚠ ANCHORED AT LINE START (`^` + the m flag) and net-current (the last match wins). The
 * unanchored form also matches a migration header that quotes the statement in prose — the
 * recorded unanchored-extractor hazard (tests/lint/netCurrentExtractorAnchor.walker.test.js,
 * canonical writeup tests/security/moneyRpcNetCurrentGuards.test.js): the extract then
 * begins mid-comment and the test asserts over English while staying green.
 *
 * @param {string} name bare function name, e.g. `update_display_name`
 * @returns {{ name: string, ddl: string, file: string }}
 */
function netCurrentFunction(name) {
  const re = new RegExp(
    `^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    'gim',
  );
  let ddl = null;
  let file = null;
  for (const f of MIGRATION_FILES) {
    const src = readFileSync(resolve(MIG_DIR, f), 'utf-8');
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) { ddl = m[0]; file = f; }
  }
  if (ddl === null) throw new Error(`no net-current definition of public.${name} in ${MIG_DIR}`);
  return { name, ddl, file };
}

/** The four civility-guard objects, verbatim from 195 (the civilityGuard.pglite pattern). */
function civilityChain() {
  const src = readFileSync(resolve(MIG_DIR, '195_civility_guard_and_public_identity.sql'), 'utf-8');
  const fnRe = /^create\s+or\s+replace\s+function\s+public\.(civility_normalize|civility_blocked|_civility_token_hits|_civility_stem_hits)\b[\s\S]*?\n\$\$;/gim;
  const tableRe = /^create\s+table\s+if\s+not\s+exists\s+public\.(civility_terms|civility_allow)[\s\S]*?\);/gim;
  const seedRe = /^insert\s+into\s+public\.civility_terms[\s\S]*?;/gim;
  const tables = src.match(tableRe) || [];
  const seed = src.match(seedRe) || [];
  const fns = src.match(fnRe) || [];
  return { statements: [...tables, ...seed, ...fns], tableCount: tables.length, fnCount: fns.length };
}

const FN_NAMES = [
  'update_display_name',
  'admin_set_role',
  'admin_grant_credits',
  'current_user_is_privileged',
  '_audit_action',
];
const FNS = present ? Object.fromEntries(FN_NAMES.map((n) => [n, netCurrentFunction(n)])) : null;
const CIVILITY = present ? civilityChain() : null;

const USER = '00000000-0000-0000-0000-0000000000a1';
const DEV = '00000000-0000-0000-0000-0000000000d1';
const TARGET = '00000000-0000-0000-0000-0000000000b2';

/** The scaffold every RPC in this chain reads or writes. No FK to auth.users — pglite has none. */
const SCAFFOLD = `
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as $fn$
    select nullif(current_setting('test.uid', true), '')::uuid
  $fn$;
  create table public.profiles (
    id uuid primary key,
    role text not null default 'user',
    tier text not null default 'free',
    credits integer not null default 0,
    is_founder boolean not null default false,
    email text,
    display_name text,
    updated_at timestamptz default now()
  );
  create table public.admin_actions (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid,
    target_id uuid,
    action text not null,
    before_value jsonb,
    after_value jsonb,
    reason text,
    created_at timestamptz not null default now()
  );
  create table public.credit_ledger (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    kind text not null check (kind in ('grant', 'spend')),
    amount integer not null check (amount > 0),
    source text not null,
    metadata jsonb not null default '{}'::jsonb,
    expires_at timestamptz,
    reversed_by uuid,
    created_at timestamptz not null default now()
  );
  create table public.credit_transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    amount integer not null,
    reason text not null,
    created_at timestamptz not null default now()
  );
`;

/**
 * Boot a database carrying the whole net-current chain.
 * @param {{ privilegeGateDdl?: string }} options `privilegeGateDdl` replaces
 *   `current_user_is_privileged()` — used ONLY by the mutation arm.
 */
async function boot({ privilegeGateDdl } = {}) {
  const db = new PGlite();
  await db.exec(SCAFFOLD);
  for (const statement of CIVILITY.statements) await db.exec(statement);
  await db.exec(privilegeGateDdl ?? FNS.current_user_is_privileged.ddl);
  for (const n of ['_audit_action', 'update_display_name', 'admin_set_role', 'admin_grant_credits']) {
    await db.exec(FNS[n].ddl);
  }
  return db;
}

const seed = (db) => db.exec(`
  delete from public.admin_actions;
  delete from public.credit_ledger;
  delete from public.credit_transactions;
  delete from public.profiles;
  insert into public.profiles (id, role, tier, credits, display_name) values
    ('${USER}',   'user',      'free',    10, 'Original'),
    ('${DEV}',    'developer', 'premium', 100, 'Dev'),
    ('${TARGET}', 'user',      'free',    5,  'Target');
`);

/** Call a single expression as `uid` ('' = unauthenticated) and return the scalar. */
async function callAs(db, uid, expression) {
  await db.exec(`set test.uid = '${uid}';`);
  const { rows } = await db.query(`select ${expression} as value`);
  return rows[0].value;
}
const countOf = async (db, table) =>
  Number((await db.query(`select count(*)::int as n from public.${table}`)).rows[0].n);
const colOf = async (db, id, col) =>
  (await db.query(`select ${col} from public.profiles where id = $1`, [id])).rows[0]?.[col];

// ── Anti-vacuity, unconditional ──────────────────────────────────────────────
// Every executing suite below is `runIf(present)`. Without this arm a moved migrations
// directory would skip them all and vitest would report green over nothing.
describe('profile-RPC migration corpus exists (guards against a silent vacuous skip)', () => {
  it('the migrations dir is present and every RPC in the chain is derivable', () => {
    expect(present, `migrations dir missing: ${MIG_DIR}`).toBe(true);
    expect(MIGRATION_FILES.length, 'migration files walked').toBeGreaterThan(100);
    for (const n of FN_NAMES) {
      expect(FNS[n].ddl.length, `${n}: net-current DDL is empty`).toBeGreaterThan(120);
      expect(FNS[n].ddl, `${n}: extract does not start at the create statement`)
        .toMatch(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${n}\\b`, 'i'));
    }
    expect(CIVILITY.tableCount, 'civility list tables extracted from 195').toBe(2);
    expect(CIVILITY.fnCount, 'civility functions extracted from 195').toBe(4);
  });

  it('THE F7 ARM: update_display_name resolves PAST 009 to its net-current redefinition', () => {
    // 009 defines it; 195 redefines it with the civility guard. A first-match extractor
    // would silently load 009 and prove the guard's behaviour against a function production
    // does not run. This arm is what stops that regression from being invisible.
    expect(FNS.update_display_name.file).not.toBe('009_profile_security.sql');
    expect(FNS.update_display_name.file > '009', `resolved to ${FNS.update_display_name.file}`).toBe(true);
    expect(FNS.update_display_name.ddl).toContain('civility_blocked');
    // …and current_user_is_privileged likewise resolves past its first definition (018)
    // to 101, which removed the privileged-email backdoor.
    expect(FNS.current_user_is_privileged.ddl).toContain('role in');
  });
});

describe.runIf(present)('update_display_name — executed (A+ enforcement.6, profile half)', () => {
  /** @type {PGlite} */ let db;
  beforeAll(async () => { db = await boot(); }, PGLITE_BOOT_TIMEOUT_MS);
  beforeEach(() => seed(db));

  it('trims the value it returns AND the value it persists', async () => {
    const returned = await callAs(db, USER, `public.update_display_name('   Renamed Test User   ')`);
    expect(returned).toBe('Renamed Test User');
    expect(await colOf(db, USER, 'display_name')).toBe('Renamed Test User');
  });

  it('enforces the 64-char cap, and accepts exactly 64', async () => {
    // Both sides of the boundary: a cap asserted only from above can be off by one forever.
    const sixtyFour = 'x'.repeat(64);
    expect(await callAs(db, USER, `public.update_display_name(repeat('x', 64))`)).toBe(sixtyFour);
    await expect(callAs(db, USER, `public.update_display_name(repeat('x', 65))`))
      .rejects.toThrow(/display name too long/i);
    await expect(callAs(db, USER, `public.update_display_name(repeat('x', 100))`))
      .rejects.toThrow(/display name too long/i);
    // …and the rejected update left the previous value in place.
    expect(await colOf(db, USER, 'display_name')).toBe(sixtyFour);
  });

  it('normalises an empty or whitespace-only name to NULL', async () => {
    expect(await callAs(db, USER, `public.update_display_name('    ')`)).toBe(null);
    expect(await colOf(db, USER, 'display_name')).toBe(null);
  });

  it('refuses an unauthenticated caller', async () => {
    await expect(callAs(db, '', `public.update_display_name('Anon')`))
      .rejects.toThrow(/not authenticated/i);
    expect(await colOf(db, USER, 'display_name')).toBe('Original');
  });

  it('refuses a name the civility guard blocks, and changes NOTHING else (195)', async () => {
    // Migration 195's own promise: "The name is refused and NOTHING ELSE happens to the
    // account — no lockout, no strike, no shadow penalty." Executed here, not read.
    await expect(callAs(db, USER, `public.update_display_name('shit')`))
      .rejects.toThrow(/can't be used here/i);
    expect(await colOf(db, USER, 'display_name')).toBe('Original');
    expect(await colOf(db, USER, 'role')).toBe('user');
    expect(Number(await colOf(db, USER, 'credits'))).toBe(10);
  });

  it('touches only the caller\'s own row — auth.uid() is the whole WHERE clause', async () => {
    await callAs(db, USER, `public.update_display_name('Mine')`);
    expect(await colOf(db, USER, 'display_name')).toBe('Mine');
    expect(await colOf(db, TARGET, 'display_name')).toBe('Target');
    expect(await colOf(db, DEV, 'display_name')).toBe('Dev');
  });
});

describe.runIf(present)('admin_set_role — executed', () => {
  /** @type {PGlite} */ let db;
  beforeAll(async () => { db = await boot(); }, PGLITE_BOOT_TIMEOUT_MS);
  beforeEach(() => seed(db));

  it('REJECTS a caller whose profiles.role is \'user\', and writes nothing', async () => {
    await expect(callAs(db, USER, `public.admin_set_role('${TARGET}'::uuid, 'developer')`))
      .rejects.toThrow(/not authorized/i);
    expect(await colOf(db, TARGET, 'role')).toBe('user');
    expect(await countOf(db, 'admin_actions')).toBe(0);
  });

  it('REJECTS an unauthenticated caller', async () => {
    await expect(callAs(db, '', `public.admin_set_role('${TARGET}'::uuid, 'developer')`))
      .rejects.toThrow(/not authorized/i);
    expect(await colOf(db, TARGET, 'role')).toBe('user');
  });

  it('ACCEPTS a developer, applies the role, and writes exactly one audit row', async () => {
    expect(await callAs(db, DEV, `public.admin_set_role('${TARGET}'::uuid, 'developer')`)).toBe('developer');
    expect(await colOf(db, TARGET, 'role')).toBe('developer');
    expect(await countOf(db, 'admin_actions')).toBe(1);
    const { rows } = await db.query('select actor_id, target_id, action, before_value, after_value from public.admin_actions');
    expect(rows[0].action).toBe('set_role');
    expect(rows[0].actor_id).toBe(DEV);
    expect(rows[0].target_id).toBe(TARGET);
    expect(rows[0].before_value).toEqual({ role: 'user' });
    expect(rows[0].after_value).toEqual({ role: 'developer' });
  });

  it('REJECTS a role outside the allowed set even from a developer', async () => {
    await expect(callAs(db, DEV, `public.admin_set_role('${TARGET}'::uuid, 'superadmin')`))
      .rejects.toThrow(/invalid role/i);
    expect(await colOf(db, TARGET, 'role')).toBe('user');
    expect(await countOf(db, 'admin_actions')).toBe(0);
  });
});

describe.runIf(present)('admin_grant_credits — executed', () => {
  /** @type {PGlite} */ let db;
  beforeAll(async () => { db = await boot(); }, PGLITE_BOOT_TIMEOUT_MS);
  beforeEach(() => seed(db));

  it('REJECTS a caller whose profiles.role is \'user\', and mints no credits', async () => {
    await expect(callAs(db, USER, `public.admin_grant_credits('${TARGET}'::uuid, 500, 'because')`))
      .rejects.toThrow(/not authorized/i);
    expect(Number(await colOf(db, TARGET, 'credits'))).toBe(5);
    expect(await countOf(db, 'credit_ledger')).toBe(0);
    expect(await countOf(db, 'credit_transactions')).toBe(0);
    expect(await countOf(db, 'admin_actions')).toBe(0);
  });

  it('ACCEPTS a developer, returns the new balance, and writes one row to each ledger', async () => {
    expect(Number(await callAs(db, DEV, `public.admin_grant_credits('${TARGET}'::uuid, 25, 'goodwill')`))).toBe(30);
    expect(Number(await colOf(db, TARGET, 'credits'))).toBe(30);
    expect(await countOf(db, 'credit_ledger')).toBe(1);
    expect(await countOf(db, 'credit_transactions')).toBe(1);
    expect(await countOf(db, 'admin_actions')).toBe(1);
    const { rows } = await db.query('select kind, amount, source, metadata from public.credit_ledger');
    expect(rows[0].kind).toBe('grant');
    expect(Number(rows[0].amount)).toBe(25);
    expect(rows[0].source).toBe('admin_grant');
    expect(rows[0].metadata).toEqual({ reason: 'goodwill' });
  });

  it('REJECTS a non-positive amount and an amount over the per-call limit', async () => {
    await expect(callAs(db, DEV, `public.admin_grant_credits('${TARGET}'::uuid, 0, null)`))
      .rejects.toThrow(/must be positive/i);
    await expect(callAs(db, DEV, `public.admin_grant_credits('${TARGET}'::uuid, -5, null)`))
      .rejects.toThrow(/must be positive/i);
    await expect(callAs(db, DEV, `public.admin_grant_credits('${TARGET}'::uuid, 10001, null)`))
      .rejects.toThrow(/exceeds per-call limit/i);
    expect(Number(await colOf(db, TARGET, 'credits'))).toBe(5);
    expect(await countOf(db, 'credit_ledger')).toBe(0);
  });
});

// ── THE MUTATION ARM ─────────────────────────────────────────────────────────
// enforcement.6's Done-when (docs/A_PLUS_ROADMAP.md:308) demands "a mutation proof both
// ways". The rejections above are only evidence of the privilege gate if a LOOSENED gate
// admits the very same calls — otherwise `rejects.toThrow(/not authorized/)` would pass
// just as happily against a fixture broken in some unrelated way. This boots a second
// database identical except for one line.
describe.runIf(present)('MUTATION CONTROL — loosening the privilege gate makes the rejections vanish', () => {
  /** @type {PGlite} */ let db;
  const LOOSENED = `
    create or replace function public.current_user_is_privileged()
    returns boolean language sql stable security definer set search_path = public, pg_temp
    as $$ select true $$;
  `;
  beforeAll(async () => { db = await boot({ privilegeGateDdl: LOOSENED }); }, PGLITE_BOOT_TIMEOUT_MS);
  beforeEach(() => seed(db));

  it('the regular user now SUCCEEDS at admin_set_role — so the real rejection is the gate', async () => {
    expect(await callAs(db, USER, `public.admin_set_role('${TARGET}'::uuid, 'developer')`)).toBe('developer');
    expect(await colOf(db, TARGET, 'role')).toBe('developer');
  });

  it('the regular user now SUCCEEDS at admin_grant_credits — same proof, money path', async () => {
    expect(Number(await callAs(db, USER, `public.admin_grant_credits('${TARGET}'::uuid, 25, 'mutation')`))).toBe(30);
    expect(await countOf(db, 'credit_ledger')).toBe(1);
  });

  it('and the ARGUMENT validation is NOT what was loosened — invalid input still throws', async () => {
    // Without this, a mutation that accidentally disabled the whole function body would
    // look identical to a mutation that disabled only the privilege check.
    await expect(callAs(db, USER, `public.admin_set_role('${TARGET}'::uuid, 'superadmin')`))
      .rejects.toThrow(/invalid role/i);
    await expect(callAs(db, USER, `public.admin_grant_credits('${TARGET}'::uuid, 0, null)`))
      .rejects.toThrow(/must be positive/i);
  });
});
