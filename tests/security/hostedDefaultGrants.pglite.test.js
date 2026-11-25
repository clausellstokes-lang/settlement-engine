/**
 * hostedDefaultGrants.pglite.test.js — what a visitor and a signed-in user may EXECUTE,
 * on the chain as the hosted platform runs it (GRANTS-1, ruling G1 §6(i); migration 211
 * part A).
 *
 * THE HOLE IT CLOSES: a hosted project grants every new function in `public` to `anon`
 * and `authenticated` BY NAME (default privileges), and `revoke ... from public` leaves
 * those grants standing. 113 and 135 closed it for one function each; 204's amendment
 * for one more. Before 211, 135 functions the migrations meant for the server alone (or
 * for no role) could be called by any visitor, 87 of them SECURITY DEFINER with no check
 * of the caller: a user's stored provider key, the key passphrase, another user's tier,
 * the admin RPCs that trust the actor id they are handed.
 *
 * THE REGISTER (tests/security/functionGrantClasses.js) classes EVERY function in schema
 * `public`. A function with no row reds; a row with no function reds; then each class is
 * held to its grants under the hosted default.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  bootHostedChain, ENVIRONMENTAL_FAILURE, HOSTED_DEFAULTS_SQL, MIGRATIONS_DIR, migrationFiles, OWNER_DEFAULT_READ_SQL, splitSql, standingCheckSql,
} from './hostedDefaultHarness.js';
import { FUNCTION_CLASSES, KEPT_OPEN_REASONS } from './functionGrantClasses.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget

let chain;
let fns;

beforeAll(async () => {
  chain = await bootHostedChain();
  fns = (await chain.db.query(`
    select p.oid::regprocedure::text as sig, p.prosecdef as definer,
           has_function_privilege('anon', p.oid, 'execute') as anon,
           has_function_privilege('authenticated', p.oid, 'execute') as authd,
           has_function_privilege('service_role', p.oid, 'execute') as svc
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')`)).rows;
}, PGLITE_BOOT_TIMEOUT_MS);

const bad = (pred) => fns.filter(pred).map((f) => f.sig).sort();

describe('the chain under the hosted default privileges', () => {
  it('replays every migration; the only statements that raise are PGlite lacking pg_cron', () => {
    expect(chain.files.length).toBeGreaterThan(200);
    expect(chain.failures.filter((f) => !ENVIRONMENTAL_FAILURE.test(f.err))).toEqual([]);
    expect(fns.length).toBeGreaterThan(350);
  });
});

describe('the register classes every public function (a function with no row reds)', () => {
  it('every function in public has a row', () => {
    expect(bad((f) => !(f.sig in FUNCTION_CLASSES))).toEqual([]);
  });
  it('every row names a function that exists', () => {
    const live = new Set(fns.map((f) => f.sig));
    expect(Object.keys(FUNCTION_CLASSES).filter((k) => !live.has(k))).toEqual([]);
  });
  it('every KEPT_OPEN row carries its reason, and only those rows', () => {
    const kept = Object.keys(FUNCTION_CLASSES).filter((k) => FUNCTION_CLASSES[k] === 'KEPT_OPEN').sort();
    expect(kept).toEqual(Object.keys(KEPT_OPEN_REASONS).sort());
    expect(kept.length).toBe(3);
  });
});

describe('each class holds under the hosted default (migration 211 part A)', () => {
  const cls = (f) => FUNCTION_CLASSES[f.sig];
  it('no SERVER or NOBODY function is executable by anon', () => {
    expect(bad((f) => ['SERVER', 'NOBODY'].includes(cls(f)) && f.anon)).toEqual([]);
  });
  it('no SERVER or NOBODY function is executable by authenticated', () => {
    expect(bad((f) => ['SERVER', 'NOBODY'].includes(cls(f)) && f.authd)).toEqual([]);
  });
  it('every SERVER function stays executable by service_role', () => {
    expect(bad((f) => cls(f) === 'SERVER' && !f.svc)).toEqual([]);
  });
  it('every USER function is executable by authenticated', () => {
    expect(bad((f) => cls(f) === 'USER' && !f.authd)).toEqual([]);
  });
  it('every ANYONE function is executable by anon', () => {
    expect(bad((f) => cls(f) === 'ANYONE' && !f.anon)).toEqual([]);
  });
  it('the classes are populated (no vacuous pass)', () => {
    const n = (c) => fns.filter((f) => cls(f) === c).length;
    expect(n('SERVER')).toBeGreaterThan(150);
    expect(n('NOBODY')).toBeGreaterThan(40);
    expect(n('USER')).toBeGreaterThan(50);
    expect(n('ANYONE')).toBeGreaterThan(30);
  });
});

describe('the three executed holes stay closed (CONFIRMED before 211 as anon / authenticated)', () => {
  const callAs = async (role, sql) => {
    try {
      await chain.db.exec(`set request.jwt.claim.role = '${role}'; set role ${role};`);
      await chain.db.query(sql);
      return 'executed';
    } catch (e) {
      return String(e?.message || e);
    } finally {
      await chain.db.exec('reset role; reset request.jwt.claim.role;');
    }
  };
  it('anon cannot read the BYOK passphrase', async () => {
    expect(await callAs('anon', 'select public._surveyor_byok_secret()')).toMatch(/permission denied/);
  });
  it("anon cannot downgrade another user", async () => {
    expect(await callAs('anon', "select public.handle_premium_downgrade('22222222-2222-2222-2222-222222222222')")).toMatch(/permission denied/);
  });
  it('a signed-in user cannot release a free narrative', async () => {
    expect(await callAs('authenticated', "select public.release_free_narrative('11111111-1111-1111-1111-111111111111')")).toMatch(/permission denied/);
  });
});

describe('part B: the default for functions created AFTER the chain (ruling G1 §3, amendment G1b)', () => {
  const priv = async (sig) => (await chain.db.query(`
    select has_function_privilege('anon', '${sig}'::regprocedure, 'execute') as anon,
           has_function_privilege('authenticated', '${sig}'::regprocedure, 'execute') as authd,
           has_function_privilege('service_role', '${sig}'::regprocedure, 'execute') as svc`)).rows[0];
  it("a function written with the repository's two lines (revoke from public; grant to service_role) is closed to anon and authenticated", async () => {
    await chain.db.exec(`create function public.zz_part_b_convention() returns int language sql as 'select 1';
      revoke all on function public.zz_part_b_convention() from public;
      grant execute on function public.zz_part_b_convention() to service_role;`);
    try {
      expect(await priv('public.zz_part_b_convention()')).toEqual({ anon: false, authd: false, svc: true });
    } finally {
      await chain.db.exec('drop function public.zz_part_b_convention();');
    }
  });
  it('a function written with NO grant statement stays executable through PUBLIC, as in plain Postgres (intended)', async () => {
    await chain.db.exec(`create function public.zz_part_b_bare() returns int language sql as 'select 1';`);
    try {
      expect(await priv('public.zz_part_b_bare()')).toEqual({ anon: true, authd: true, svc: true });
    } finally {
      await chain.db.exec('drop function public.zz_part_b_bare();');
    }
  });
  it("the migrating role's default in schema public grants execute to neither anon nor authenticated", async () => {
    const rows = (await chain.db.query(`select defaclacl::text as acl from pg_default_acl
      where defaclrole = current_user::regrole and defaclnamespace = 'public'::regnamespace and defaclobjtype = 'f'`)).rows;
    expect(rows.length).toBe(1);
    expect(rows.filter((r) => /(^|[{,])(anon|authenticated)=/.test(r.acl))).toEqual([]);
  });
});

// 211's PART B statement itself (the last `alter default privileges` of the migration), never a copy.
const PART_B_SQL = (() => {
  const f = migrationFiles().find((x) => x.startsWith('211_'));
  return splitSql(readFileSync(join(MIGRATIONS_DIR, f), 'utf8')).filter((x) => /^\s*(--[^\n]*\n\s*)*alter default privileges/i.test(x)).pop();
})();

describe("the owner's read for part B: one row, counting the role's schema row and its GLOBAL row", () => {
  /** A bare database: the three roles and the hosted default, as postgres. */
  const fresh = async () => {
    const db = new PGlite();
    await db.exec(`create role anon nologin; create role authenticated nologin; create role service_role nologin; ${HOSTED_DEFAULTS_SQL}`);
    return db;
  };
  /** The read, beside the truth: a real function made now, as postgres, with the convention's two lines. */
  const readAndTruth = async (db) => {
    await db.exec(`create function public.zz_owner_read() returns int language sql as 'select 1';
      revoke all on function public.zz_owner_read() from public;
      grant execute on function public.zz_owner_read() to service_role;`);
    const [truth] = (await db.query(`select has_function_privilege('anon', 'public.zz_owner_read()', 'execute') as visitor,
      has_function_privilege('authenticated', 'public.zz_owner_read()', 'execute') as signed_in`)).rows;
    const [read] = (await db.query(OWNER_DEFAULT_READ_SQL)).rows;
    await db.close();
    return { truth, read: { visitor: read.new_function_handed_to_visitor, signed_in: read.new_function_handed_to_signed_in_user, as: read.running_as } };
  };
  it('211 carries the part B statement this block runs', () => {
    expect(PART_B_SQL).toMatch(/alter default privileges in schema public revoke execute on functions from anon, authenticated/i);
  });
  it('before part B: the read says yes, yes, and a new function is open to both', async () => {
    const { truth, read } = await readAndTruth(await fresh());
    expect(read).toEqual({ visitor: true, signed_in: true, as: 'postgres' });
    expect(truth).toEqual({ visitor: true, signed_in: true });
  });
  it('after part B (run as the migrating role): the read says no, no, and the new function is closed to both', async () => {
    const db = await fresh();
    await db.exec(PART_B_SQL);
    const { truth, read } = await readAndTruth(db);
    expect(read).toEqual({ visitor: false, signed_in: false, as: 'postgres' });
    expect(truth).toEqual({ visitor: false, signed_in: false });
  });
  it('part B run as ANOTHER role changes nothing for the migrating role, and the read says so (yes, yes)', async () => {
    const db = await fresh();
    await db.exec(`create role other_role nologin; grant usage, create on schema public to other_role;
      set role other_role; ${PART_B_SQL}; reset role;`);
    const { truth, read } = await readAndTruth(db);
    expect(read).toEqual({ visitor: true, signed_in: true, as: 'postgres' });
    expect(truth).toEqual({ visitor: true, signed_in: true });
  });
  it("THE CARRIED READ: part B run as ANOTHER role, the read run AS THAT ROLE answers no, no for it and carries postgres's answer by name (yes, yes)", async () => {
    const db = await fresh();
    await db.exec(`create role other_role nologin; grant usage, create on schema public to other_role;
      set role other_role; ${PART_B_SQL}; reset role;`);
    await db.exec('set role other_role;');
    const [read] = (await db.query(OWNER_DEFAULT_READ_SQL)).rows;
    await db.exec('reset role;');
    const { truth } = await readAndTruth(db);
    expect(read).toEqual({
      running_as: 'other_role',
      new_function_handed_to_visitor: false,
      new_function_handed_to_signed_in_user: false,
      postgres_new_function_handed_to_visitor: true,
      postgres_new_function_handed_to_signed_in_user: true,
    });
    expect(truth).toEqual({ visitor: true, signed_in: true });
  });
  it('a GLOBAL default grant (no schema) keeps a new function open after part B, and the read sees it (yes, yes)', async () => {
    const db = await fresh();
    await db.exec(`${PART_B_SQL}; alter default privileges grant execute on functions to anon, authenticated;`);
    const { truth, read } = await readAndTruth(db);
    expect(read).toEqual({ visitor: true, signed_in: true, as: 'postgres' });
    expect(truth).toEqual({ visitor: true, signed_in: true });
  });
});

describe('the standing check (the owner runs it after every deploy): EXPECT NO ROW', () => {
  it('after 211: no function a visitor or a signed-in user can execute is outside the register\'s USER, ANYONE or KEPT_OPEN rows', async () => {
    expect((await chain.db.query(standingCheckSql(FUNCTION_CLASSES))).rows).toEqual([]);
  });
  it('a server-only function written with the two convention lines under the OLD default shows as a row', async () => {
    await chain.db.exec(`alter default privileges in schema public grant execute on functions to anon, authenticated;
      create function public.zz_standing_plant() returns int language sql as 'select 1';
      revoke all on function public.zz_standing_plant() from public;
      grant execute on function public.zz_standing_plant() to service_role;`);
    try {
      const rows = (await chain.db.query(standingCheckSql(FUNCTION_CLASSES))).rows.map((r) => r.function);
      expect(rows).toEqual(['zz_standing_plant()']);
    } finally {
      await chain.db.exec(`drop function public.zz_standing_plant(); ${PART_B_SQL};`);
    }
  });
});
