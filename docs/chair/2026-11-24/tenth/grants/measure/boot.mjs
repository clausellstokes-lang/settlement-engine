// GRANTS-1 unit (1) measure harness: boot PGlite, model the hosted Supabase
// platform, optionally apply the hosted default privileges, replay 001..210.
// Changes no repository file. Run from the repository root.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const NM = (p) => pathToFileURL(resolve(ROOT, 'node_modules/@electric-sql/pglite/dist', p)).href;
const { PGlite } = await import(NM('index.js'));
const { pgcrypto } = await import(NM('contrib/pgcrypto.js'));
const { uuid_ossp } = await import(NM('contrib/uuid_ossp.js'));
const { citext } = await import(NM('contrib/citext.js'));
const { pg_trgm } = await import(NM('contrib/pg_trgm.js'));
const { unaccent } = await import(NM('contrib/unaccent.js'));

/** Split a SQL file into top-level statements (comments, quotes, dollar quotes aware). */
export function splitSql(src) {
  const out = [];
  let cur = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '-' && d === '-') { const j = src.indexOf('\n', i); const e = j < 0 ? n : j; cur += src.slice(i, e); i = e; continue; }
    if (c === '/' && d === '*') { let depth = 1; let j = i + 2; while (j < n && depth) { if (src[j] === '/' && src[j + 1] === '*') { depth++; j += 2; } else if (src[j] === '*' && src[j + 1] === '/') { depth--; j += 2; } else j++; } cur += src.slice(i, j); i = j; continue; }
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
  if (cur.replace(/--[^\n]*/g, '').trim()) out.push(cur.trim());
  return out.filter((s) => s.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim());
}

export const PLATFORM = `
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

// The hosted default: Supabase's platform bootstrap runs, for the role that
// later runs `supabase db push` (postgres), default privileges in schema public
// that grant ALL on new tables / functions / sequences to anon, authenticated
// and service_role. `alter default privileges` without FOR ROLE binds to the
// current role, which in PGlite is postgres: the same role that replays the
// migrations below.
export const HOSTED_DEFAULTS = `
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

export async function boot({ hostedDefaults = true, upTo = 210 } = {}) {
  const db = new PGlite({ extensions: { pgcrypto, uuid_ossp, citext, pg_trgm, unaccent } });
  await db.exec(PLATFORM);
  await db.exec(`set search_path = public, extensions;`);
  await db.exec(`alter database postgres set search_path = public, extensions;`).catch(() => {});
  if (hostedDefaults) await db.exec(HOSTED_DEFAULTS);
  const dir = resolve(ROOT, 'supabase/migrations');
  const files = readdirSync(dir).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort().filter((f) => Number(f.slice(0, 3)) <= upTo);
  const failures = [];
  let wholeOk = 0;
  for (const f of files) {
    const src = readFileSync(join(dir, f), 'utf8');
    try { await db.exec(src); wholeOk++; continue; } catch { /* fall back to statements */ }
    // Statement-by-statement so one environmental failure never drops the rest.
    for (const stmt of splitSql(src)) {
      try { await db.exec(stmt); } catch (e) {
        failures.push({ file: f, stmt: stmt.replace(/\s+/g, ' ').slice(0, 160), err: String(e.message).slice(0, 200) });
      }
    }
  }
  return { db, files, failures, wholeOk };
}
