/**
 * hostedDefaultHarness.js — the WHOLE migration chain in PGlite, under the hosted
 * platform's DEFAULT PRIVILEGES (GRANTS-1, ruling G1 §6(i)). Not a `*.test.js` file, so
 * vitest never collects it as a suite.
 *
 * WHY: a hosted Supabase project's bootstrap sets, for the role that runs the
 * migrations, default privileges in schema `public` that grant EXECUTE on every new
 * function, and ALL on every new table and sequence, to `anon`, `authenticated` and
 * `service_role`. `revoke ... from public` does not remove those grants: they are given
 * to the two roles BY NAME (migration 113's header; 135; 204's amendment). Plain
 * Postgres has no such grant, so a test that replays the chain without the defaults
 * cannot see what a visitor can call on the live site. This harness gives the defaults
 * first, as the replaying role, then replays every `NNN_*.sql`.
 *
 * WHAT IT MODELS: the `auth` schema (`uid()`, `role()` and `jwt()` read from settings,
 * `auth.users`), stubs for `storage`, `cron`, `net` and `vault`, and the three platform
 * roles. A file that raises is replayed statement by statement, so that ONE
 * environmental failure (PGlite has no pg_cron) never drops the rest of the file;
 * `failures` lists every statement that raised, for the caller to pin.
 */
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { citext } from '@electric-sql/pglite/contrib/citext';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase/migrations');

/** Split a SQL file into top-level statements (comments, quotes and dollar quotes aware). */
export function splitSql(src) {
  const out = [];
  let cur = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '-' && d === '-') { const j = src.indexOf('\n', i); const e = j < 0 ? n : j; cur += src.slice(i, e); i = e; continue; }
    if (c === '/' && d === '*') {
      let depth = 1; let j = i + 2;
      while (j < n && depth) { if (src[j] === '/' && src[j + 1] === '*') { depth++; j += 2; } else if (src[j] === '*' && src[j + 1] === '/') { depth--; j += 2; } else j++; }
      cur += src.slice(i, j); i = j; continue;
    }
    if (c === "'") {
      const esc = /[eE]$/.test(cur) && !/\w[eE]$/.test(cur);
      let j = i + 1;
      while (j < n) { if (esc && src[j] === '\\') { j += 2; continue; } if (src[j] === "'") { if (src[j + 1] === "'") { j += 2; continue; } break; } j++; }
      cur += src.slice(i, j + 1); i = j + 1; continue;
    }
    if (c === '"') { const j = src.indexOf('"', i + 1); cur += src.slice(i, j + 1); i = j + 1; continue; }
    if (c === '$') {
      const m = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(src.slice(i));
      if (m && !/[A-Za-z0-9_]$/.test(cur)) { const tag = m[0]; const j = src.indexOf(tag, i + tag.length); const e = j < 0 ? n : j + tag.length; cur += src.slice(i, e); i = e; continue; }
    }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter((s) => s.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim());
}

export const PLATFORM_SQL = `
  create schema if not exists auth;
  create schema if not exists extensions;
  create schema if not exists storage;
  create schema if not exists cron;
  create schema if not exists net;
  create schema if not exists vault;
  do $do$ begin
    if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin noinherit; end if;
    if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
    if not exists (select from pg_roles where rolname = 'service_role') then create role service_role nologin noinherit bypassrls; end if;
  end $do$;
  grant usage on schema public, auth, extensions, storage to anon, authenticated, service_role;
  create or replace function auth.uid() returns uuid language sql stable as $fn$
    select coalesce(nullif(current_setting('test.uid', true), ''), nullif(current_setting('request.jwt.claim.sub', true), ''))::uuid
  $fn$;
  create or replace function auth.role() returns text language sql stable as $fn$
    select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), nullif(current_setting('test.role', true), ''), 'anon')
  $fn$;
  create or replace function auth.jwt() returns jsonb language sql stable as $fn$
    select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
  $fn$;
  create or replace function auth.email() returns text language sql stable as $fn$ select null::text $fn$;
  grant execute on all functions in schema auth to anon, authenticated, service_role;
  create table if not exists auth.users (
    id uuid primary key, email text, phone text, raw_user_meta_data jsonb default '{}'::jsonb,
    raw_app_meta_data jsonb default '{}'::jsonb, created_at timestamptz default now(), updated_at timestamptz default now(),
    last_sign_in_at timestamptz, email_confirmed_at timestamptz, banned_until timestamptz,
    deleted_at timestamptz, is_anonymous boolean default false, is_sso_user boolean default false
  );
  create table if not exists auth.sessions (id uuid primary key, user_id uuid, created_at timestamptz default now(), updated_at timestamptz, not_after timestamptz);
  create table if not exists auth.identities (id uuid primary key, user_id uuid, provider text, identity_data jsonb, email text);
  create table if not exists storage.buckets (id text primary key, name text, owner uuid, public boolean default false,
    file_size_limit bigint, allowed_mime_types text[], avif_autodetection boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
  create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid,
    owner_id text, metadata jsonb, path_tokens text[], version text, created_at timestamptz default now(), updated_at timestamptz default now(), last_accessed_at timestamptz);
  alter table storage.objects enable row level security;
  create or replace function storage.foldername(name text) returns text[] language sql immutable as $fn$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $fn$;
  create or replace function storage.filename(name text) returns text language sql immutable as $fn$ select (string_to_array(name, '/'))[array_length(string_to_array(name, '/'), 1)] $fn$;
  create or replace function storage.extension(name text) returns text language sql immutable as $fn$ select split_part(name, '.', 2) $fn$;
  create table if not exists cron.job (jobid bigserial primary key, jobname text, schedule text, command text, active boolean default true);
  create or replace function cron.schedule(job_name text, schedule text, command text) returns bigint language sql as $fn$
    insert into cron.job (jobname, schedule, command) values (job_name, schedule, command) returning jobid $fn$;
  create or replace function cron.unschedule(job_id bigint) returns boolean language sql as $fn$ delete from cron.job where jobid = job_id returning true $fn$;
  create or replace function cron.unschedule(job_name text) returns boolean language sql as $fn$ delete from cron.job where jobname = job_name returning true $fn$;
  create or replace function net.http_post(url text, body jsonb default '{}'::jsonb, params jsonb default '{}'::jsonb,
    headers jsonb default '{}'::jsonb, timeout_milliseconds integer default 5000) returns bigint language sql as $fn$ select 1::bigint $fn$;
  create table if not exists vault.decrypted_secrets (id uuid primary key default gen_random_uuid(), name text, decrypted_secret text);
  create extension if not exists pgcrypto with schema extensions;
  create extension if not exists "uuid-ossp" with schema extensions;
  create extension if not exists citext with schema extensions;
  create extension if not exists pg_trgm with schema extensions;
  create extension if not exists unaccent with schema extensions;
`;

/**
 * The hosted default, for the replaying role (postgres). `alter default privileges`
 * without FOR ROLE binds to the current role, which then replays the migrations.
 */
export const HOSTED_DEFAULTS_SQL = `
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

/** Every `NNN_*.sql` migration on disk, in order, up to `upTo` (inclusive) when given. */
export function migrationFiles(upTo = Infinity) {
  return readdirSync(MIGRATIONS_DIR).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort()
    .filter((f) => Number(f.slice(0, 3)) <= upTo);
}

/**
 * Boot PGlite, model the platform, give the hosted defaults (unless `hostedDefaults`
 * is false), and replay the chain. Returns { db, files, failures }.
 */
export async function bootHostedChain({ hostedDefaults = true, upTo = Infinity } = {}) {
  const db = new PGlite({ extensions: { pgcrypto, uuid_ossp, citext, pg_trgm, unaccent } });
  await db.exec(PLATFORM_SQL);
  await db.exec('set search_path = public, extensions;');
  if (hostedDefaults) await db.exec(HOSTED_DEFAULTS_SQL);
  const files = migrationFiles(upTo);
  const failures = [];
  for (const f of files) {
    const src = readFileSync(join(MIGRATIONS_DIR, f), 'utf8');
    try { await db.exec(src); continue; } catch { /* replay statement by statement */ }
    for (const stmt of splitSql(src)) {
      try { await db.exec(stmt); } catch (e) {
        failures.push({ file: f, stmt: stmt.replace(/\s+/g, ' ').slice(0, 160), err: String(e?.message || e).slice(0, 200) });
      }
    }
  }
  return { db, files, failures };
}

/** The only failures the chain may have under this harness: PGlite has no pg_cron. */
export const ENVIRONMENTAL_FAILURE = /extension "pg_cron" is not available/;

/**
 * THE OWNER'S READ FOR PART B (one row): for the role running it, would a NEW function that role
 * makes in schema public, written with this repository's two lines (`revoke ... from public; grant
 * ... to service_role`), still be handed to a visitor (anon) and to a signed-in user (authenticated)?
 * It counts BOTH of the role's default-privilege rows that apply to schema public: the row for the
 * schema and the GLOBAL row (no schema). Before 211 part B the answer on the hosted platform is
 * (true, true); after it, run as the role that runs the migrations, (false, false).
 */
export const OWNER_DEFAULT_READ_SQL = `select current_user as running_as,
  exists (select 1 from pg_default_acl d cross join lateral aclexplode(d.defaclacl) a
           where d.defaclrole = (select oid from pg_roles where rolname = current_user)
             and d.defaclobjtype = 'f' and d.defaclnamespace in (0, 'public'::regnamespace)
             and a.privilege_type = 'EXECUTE' and a.grantee = (select oid from pg_roles where rolname = 'anon'))
    as new_function_handed_to_visitor,
  exists (select 1 from pg_default_acl d cross join lateral aclexplode(d.defaclacl) a
           where d.defaclrole = (select oid from pg_roles where rolname = current_user)
             and d.defaclobjtype = 'f' and d.defaclnamespace in (0, 'public'::regnamespace)
             and a.privilege_type = 'EXECUTE' and a.grantee = (select oid from pg_roles where rolname = 'authenticated'))
    as new_function_handed_to_signed_in_user;`;

/**
 * THE STANDING CHECK (read only; EXPECT NO ROW): every function of schema public that a visitor or a
 * signed-in user can execute and that the register does not class as theirs (USER, ANYONE, or
 * KEPT_OPEN with its reason). Trigger functions and extension members are left out.
 * @param {Record<string, string>} classes the register (tests/security/functionGrantClasses.js)
 */
export function standingCheckSql(classes) {
  const theirs = Object.entries(classes).filter(([, c]) => ['USER', 'ANYONE', 'KEPT_OPEN'].includes(c))
    .map(([k]) => `('${k.replace(/'/g, "''")}')`).sort();
  return `select regexp_replace(p.oid::regprocedure::text, '^public\\.', '') as function,
       has_function_privilege('anon', p.oid, 'execute') as visitor_can_execute,
       has_function_privilege('authenticated', p.oid, 'execute') as signed_in_can_execute
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prorettype <> 'trigger'::regtype
   and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
   and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute'))
   and regexp_replace(p.oid::regprocedure::text, '^public\\.', '') not in (select sig from (values
    ${theirs.join(',\n    ')}
  ) as theirs(sig))
 order by 1;`;
}
