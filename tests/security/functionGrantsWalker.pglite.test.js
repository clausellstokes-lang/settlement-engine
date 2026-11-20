/**
 * functionGrantsWalker.pglite.test.js — THE FUNCTION-GRANTS WALKER (migration 213, finding V10-8; lane
 * SEC-GRANTS-2, 2026-11-20).
 *
 * Builds the WHOLE migration chain in pglite under Supabase's default privileges (the visitor roles and
 * `alter default privileges in schema public grant all on functions to anon, authenticated, service_role`,
 * created BEFORE the migrations run, as docs/chair/2026-11-20/security/proof/scaffold.sql does on a real
 * PostgreSQL), then reads every function of schema public that anon or authenticated may EXECUTE and
 * holds it to the written allowlist (tests/security/visitorFunctionAllowlist.js), by full signature:
 *   - RED on a function a visitor may execute that is not listed (a new migration forgot its revoke, or
 *     wrote only `revoke … from public`, which leaves the default grants to anon and authenticated);
 *   - RED on a listed function that no longer exists or no longer opens to a visitor (a stale row);
 *   - RED on a door whose anon grant differs from the list (anon reopened on an admin door);
 *   - RED on a SECURITY DEFINER door whose listed caller check is no longer in its body;
 *   - RED on a "visitor-needed" function no visitor context reaches any more (then it should be revoked);
 *   - SECOND ARM: RED on a guard a NULL can slip (`not in (`, `<>`, `!=` on a caller-derived value read with
 *     no earlier `is null` test and no coalesce) in a SECURITY DEFINER function a visitor may execute — the
 *     shape of set_curated's `caller_role not in (…)` and list_ticket_thread's `v_owner <> auth.uid()`,
 *     both NULL for anon, both acting for an outsider before 213.
 * The walker's own NEGATIVE CONTROLS plant a definer function with no grant change and a NULL-slip guard
 * inside a rolled-back transaction and require both arms to name them, so a walker that silently stopped
 * seeing would red.
 *
 * The visitor-context query is docs/chair/2026-11-20/security/proof/visitor-closure.sql: a function named by
 * a policy, check constraint, column default, view, index or INVOKER trigger, and every function the body of
 * an INVOKER function already in the set names (a DEFINER body runs as its owner: the chain stops there).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { VISITOR_FUNCTION_ALLOWLIST, REVIEWED_NULL_SLIPS } from './visitorFunctionAllowlist.js';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const chain = readdirSync(dir).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort();

/** Supabase's grants on schema public, as its initial schema writes them for the migrations' role. */
const SCAFFOLD = `
create schema if not exists auth;
create or replace function auth.uid() returns uuid language sql stable as $fn$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $fn$;
create or replace function auth.role() returns text language sql stable as $fn$
  select nullif(current_setting('request.jwt.claim.role', true), '') $fn$;
create or replace function auth.jwt() returns jsonb language sql stable as $fn$
  select jsonb_build_object('sub', auth.uid(), 'role', auth.role()) $fn$;
create or replace function auth.email() returns text language sql stable as $fn$ select null::text $fn$;
create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}',
  raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz,
  email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
create schema if not exists extensions;
create schema if not exists cron;
create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text);
create or replace function cron.schedule(n text, s text, c text) returns bigint language sql as $fn$
  insert into cron.job (jobname, schedule, command) values (n, s, c) returning jobid $fn$;
create or replace function cron.unschedule(n text) returns boolean language sql as $fn$ select true $fn$;
create or replace function cron.unschedule(n bigint) returns boolean language sql as $fn$ select true $fn$;
create schema if not exists storage;
create table if not exists storage.buckets (id text primary key, name text, public boolean, owner uuid,
  file_size_limit bigint, allowed_mime_types text[], created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text,
  owner uuid, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz default now());
create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$
  select string_to_array(name, '/') $fn$;
do $do$ begin
  if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin noinherit; end if;
  if not exists (select from pg_roles where rolname = 'service_role') then create role service_role nologin noinherit bypassrls; end if;
end $do$;
create extension if not exists pgcrypto;
grant usage on schema public, auth, extensions, storage to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`;

/** Every function of schema public a visitor role may execute (extension members excluded). */
const OPEN_SQL = `
select p.oid::regprocedure::text as sig, p.prosecdef as definer,
       pg_get_function_result(p.oid) = 'trigger' as is_trigger,
       has_function_privilege('anon', p.oid, 'execute') as anon,
       has_function_privilege('authenticated', p.oid, 'execute') as authd,
       p.prosrc as src
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))
  and not exists (select 1 from pg_depend d where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
order by 1`;

/** Every function a visitor context runs as the visitor (proof/visitor-closure.sql, the same query). */
const CLOSURE_SQL = `
with recursive pub as (
  select p.oid, p.proname, p.prosecdef, p.prosrc
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname in ('public', 'auth', 'storage')
    and not exists (select 1 from pg_depend d where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
), objseed as (
  select distinct d.refobjid as oid, d.classid
  from pg_depend d
  where d.refclassid = 'pg_proc'::regclass and d.deptype in ('n', 'a')
    and d.classid in ('pg_policy'::regclass, 'pg_rewrite'::regclass, 'pg_attrdef'::regclass,
                      'pg_constraint'::regclass, 'pg_class'::regclass, 'pg_trigger'::regclass)
), seed as (
  select o.oid from objseed o join pub on pub.oid = o.oid
  where not (o.classid = 'pg_trigger'::regclass and pub.prosecdef)
), walk(oid, depth) as (
  select oid, 0 from seed
  union
  select c.oid, w.depth + 1
  from walk w join pub g on g.oid = w.oid and not g.prosecdef
  join pub c on c.oid <> g.oid and regexp_replace(g.prosrc, '--[^\\n]*', '', 'g') ~ ('\\m' || c.proname || '\\M')
  where w.depth < 6
)
select distinct p.oid::regprocedure::text as sig from walk w join pg_proc p on p.oid = w.oid`;

/** A body with its line comments removed (a check named only in a comment does not count). */
const stripComments = (src) => src.replace(/--[^\n]*/g, '');

/**
 * A guard a NULL can slip: an `if` / `elsif` / `when` line comparing a caller-derived value (auth.uid(), a
 * variable assigned from it, or a variable selected INTO from a query naming it) with `not in (`, `<>` or `!=`,
 * with no earlier `<value> is [not] null` test and no coalesce of the value on that line. A comparison NULL for
 * an anonymous caller is NULL, and `if NULL then raise` raises nothing.
 * @param {string} src
 * @returns {string[]} the offending lines
 */
function nullSlips(src) {
  const body = stripComments(src);
  const lines = body.split('\n');
  const derived = new Set(['auth.uid()']);
  const uidVars = new Set();
  for (const m of body.matchAll(/(\w+)\s*:=\s*auth\.uid\(\)/gi)) {
    derived.add(m[1].toLowerCase());
    uidVars.add(m[1].toLowerCase());
  }
  for (const m of body.matchAll(/select\s+[\s\S]*?\s+into\s+(\w+)\s+from\s+[^;]*;/gi)) {
    if (/auth\.uid\(\)/i.test(m[0])) derived.add(m[1].toLowerCase());
  }
  const esc = (v) => v.replace(/[.()]/g, (c) => `\\${c}`);
  const out = [];
  lines.forEach((line, i) => {
    if (!/\b(if|elsif|when)\b/i.test(line) || !/(not\s+in\s*\(|<>|!=)/i.test(line)) return;
    const before = lines.slice(0, i).join('\n');
    const uidNullTested = /auth\.uid\(\)\s+is\s+null/i.test(before)
      || [...uidVars].some((u) => new RegExp(`\\b${u}\\s+is\\s+null`, 'i').test(before));
    for (const v of derived) {
      const e = esc(v);
      const compared = new RegExp(`(^|[^\\w.])${e}\\s*(not\\s+in\\s*\\(|<>|!=)|(<>|!=)\\s*${e}($|[^\\w])`, 'i');
      if (!compared.test(line)) continue;
      if (new RegExp(`coalesce\\s*\\(\\s*${e}`, 'i').test(line)) continue;
      if (new RegExp(`${e}\\s+is\\s+(not\\s+)?null`, 'i').test(before)) continue;
      if ((v === 'auth.uid()' || uidVars.has(v)) && uidNullTested) continue;
      out.push(line.trim());
    }
  });
  return out;
}

/** @type {PGlite} */
let db;
/** @type {Array<{ sig: string, definer: boolean, is_trigger: boolean, anon: boolean, authd: boolean, src: string }>} */
let open = [];
/** @type {Set<string>} */
let visitorRun = new Set();
/** @type {string[]} */
const applyFailures = [];

const readOpen = async () => (await db.query(OPEN_SQL)).rows;

describe('function grants walker (213, V10-8): every visitor-executable function is on the written allowlist', () => {
  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    await db.exec(SCAFFOLD);
    for (const f of chain) {
      // pg_cron / pg_net are hosted-only extensions; their create statements are the one environmental gap.
      const sql = readFileSync(join(dir, f), 'utf8')
        .replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
      try {
        await db.exec('begin;');
        await db.exec(sql);
        await db.exec('commit;');
      } catch (e) {
        await db.exec('rollback;').catch(() => {});
        applyFailures.push(`${f}: ${String(/** @type {any} */ (e)?.message || e).slice(0, 200)}`);
      }
    }
    await db.exec("set search_path to '';"); // full signatures: public.f(argtypes)
    open = await readOpen();
    visitorRun = new Set((await db.query(CLOSURE_SQL)).rows.map((r) => /** @type {any} */ (r).sig));
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the whole chain applies under the Supabase scaffold (a failed file would hide its functions)', () => {
    expect(chain.length).toBeGreaterThan(200);
    expect(applyFailures, applyFailures.join('\n')).toEqual([]);
  });

  it('the walk is not vacuous: it sees the doors, the triggers and the visitor-needed helpers', () => {
    expect(open.length).toBeGreaterThan(80);
    expect(open.some((r) => r.is_trigger)).toBe(true);
    expect(visitorRun.has('public._gallery_world_snapshot_is_safe(jsonb)')).toBe(true);
    expect(Object.keys(VISITOR_FUNCTION_ALLOWLIST).length).toBeGreaterThan(80);
  });

  it('every function a visitor may execute is on the allowlist, by full signature', () => {
    const unlisted = open.filter((r) => !(r.sig in VISITOR_FUNCTION_ALLOWLIST))
      .map((r) => `${r.sig}${r.definer ? ' [SECURITY DEFINER]' : ''} (anon ${r.anon}, authenticated ${r.authd})`);
    expect(unlisted, 'executable by a visitor and not on the allowlist — revoke it in its migration '
      + '(from public, anon, authenticated; grant service_role) or list it with its caller check').toEqual([]);
  });

  it('every allowlisted function exists and is still open to a visitor (no stale row)', () => {
    const seen = new Set(open.map((r) => r.sig));
    const stale = Object.keys(VISITOR_FUNCTION_ALLOWLIST).filter((sig) => !seen.has(sig));
    expect(stale, 'listed but missing, or no longer executable by anon or authenticated — remove the row').toEqual([]);
  });

  it('each listed door and visitor-needed function holds the anon grant the list says, and authenticated holds it', () => {
    const wrong = [];
    for (const r of open) {
      const e = VISITOR_FUNCTION_ALLOWLIST[r.sig];
      if (!e || e.class === 'trigger') continue;
      if (e.anon !== r.anon) wrong.push(`${r.sig}: anon ${r.anon}, listed ${e.anon}`);
      if (!r.authd) wrong.push(`${r.sig}: authenticated cannot execute it`);
    }
    expect(wrong).toEqual([]);
  });

  it('a listed trigger returns trigger; a listed door is SECURITY DEFINER and its caller check is in its body', () => {
    const wrong = [];
    for (const r of open) {
      const e = VISITOR_FUNCTION_ALLOWLIST[r.sig];
      if (!e) continue;
      if (e.class === 'trigger' && !r.is_trigger) wrong.push(`${r.sig}: listed as a trigger, returns something else`);
      if (e.class !== 'trigger' && r.is_trigger) wrong.push(`${r.sig}: a trigger listed as ${e.class}`);
      if (e.class === 'door') {
        if (!r.definer) wrong.push(`${r.sig}: listed as a door but SECURITY INVOKER (class it visitor-needed or revoke it)`);
        else if ('residual' in e) {
          // A door with no caller check is listed only under a named ruling that accepted it.
          if (!/^[A-Z]+\d+$/.test(e.residual)) wrong.push(`${r.sig}: a residual must cite its ruling (e.g. VR38)`);
        } else if (!stripComments(r.src).includes(e.check)) wrong.push(`${r.sig}: its listed caller check "${e.check}" is not in its body`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('a listed visitor-needed function is still run by a visitor context (else revoke it)', () => {
    const orphaned = Object.entries(VISITOR_FUNCTION_ALLOWLIST)
      .filter(([sig, e]) => e.class === 'visitor-needed' && !visitorRun.has(sig)).map(([sig]) => sig);
    expect(orphaned).toEqual([]);
  });

  it('SECOND ARM: no SECURITY DEFINER function a visitor may execute has a guard a NULL can slip', () => {
    const hits = [];
    for (const r of open.filter((x) => x.definer && !x.is_trigger)) {
      for (const line of nullSlips(r.src)) {
        if (REVIEWED_NULL_SLIPS[r.sig] === line) continue;
        hits.push(`${r.sig}: ${line}`);
      }
    }
    expect(hits, 'a comparison NULL for an anonymous caller raises nothing: test the value for NULL first, '
      + 'or write `coalesce(v, \'\') not in (…)` / `v is distinct from auth.uid()`').toEqual([]);
  });

  it('every reviewed NULL-slip exception still matches its line (else remove it)', () => {
    const bySig = new Map(open.map((r) => [r.sig, r]));
    const stale = Object.entries(REVIEWED_NULL_SLIPS)
      .filter(([sig, line]) => !bySig.has(sig) || !nullSlips(bySig.get(sig).src).includes(line)).map(([sig]) => sig);
    expect(stale).toEqual([]);
  });

  it('NEGATIVE CONTROL: a planted definer function with no grant change, and a planted NULL-slip guard, are both seen', async () => {
    await db.exec('begin;');
    try {
      await db.exec(`
        create function public.__walker_plant_door(p uuid) returns boolean language sql security definer
          set search_path = public as $fn$ select true $fn$;
        create function public.__walker_plant_slip(t uuid) returns void language plpgsql security definer
          set search_path = public as $fn$
          declare caller_role text;
          begin
            select role into caller_role from public.profiles where id = auth.uid();
            if caller_role not in ('developer', 'admin') then raise exception 'no'; end if;
          end $fn$;
        revoke execute on function public.__walker_plant_door(uuid) from public;`);
      const planted = await readOpen();
      const door = planted.find((r) => r.sig === 'public.__walker_plant_door(uuid)');
      expect(door, 'Supabase default privileges keep anon and authenticated after `revoke … from public`').toBeTruthy();
      expect(door?.anon && door?.authd).toBe(true);
      expect(door && door.sig in VISITOR_FUNCTION_ALLOWLIST).toBe(false);
      const slip = planted.find((r) => r.sig === 'public.__walker_plant_slip(uuid)');
      expect(nullSlips(slip?.src ?? '')).toEqual(["if caller_role not in ('developer', 'admin') then raise exception 'no'; end if;"]);
      expect(nullSlips(`select role into caller_role from public.profiles where id = auth.uid();
        if coalesce(caller_role, '') not in ('developer', 'admin') then raise exception 'no'; end if;`)).toEqual([]);
      expect(nullSlips(`if not v_agent and v_owner <> auth.uid() then return; end if;`)).toHaveLength(1);
      expect(nullSlips(`if not v_agent and v_owner is distinct from auth.uid() then return; end if;`)).toEqual([]);
    } finally {
      await db.exec('rollback;');
    }
  });
});
