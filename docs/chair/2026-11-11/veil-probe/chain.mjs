// The chain 001..HEAD applied in order into an in-process Postgres (pglite), with the
// sequence suite's scaffold (tests/security/migrationSequenceAll.pglite.test.js). A file
// that fails on an object pglite does not model is recorded, never hidden.
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export const MIGRATIONS = resolve(process.cwd(), 'supabase', 'migrations');

/** The objects a Supabase project provides and the chain reads (auth, roles, cron, storage, pgcrypto). */
export const SCAFFOLD_SQL = `
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
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
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create extension if not exists pgcrypto;
  `;

/** The migration files through `through`, in order, each as the text the probe applies. */
export function chainFiles(through = 999) {
  return readdirSync(MIGRATIONS).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort()
    .filter((f) => Number(f.slice(0, 3)) <= through)
    .map((f) => [f, readFileSync(join(MIGRATIONS, f), 'utf-8')
      .replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1')]);
}

export async function bootChain({ through = 999 } = {}) {
  const db = new PGlite({ extensions: { pgcrypto } });
  await db.exec(SCAFFOLD_SQL);
  const files = readdirSync(MIGRATIONS).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort()
    .filter((f) => Number(f.slice(0, 3)) <= through);
  const failed = [];
  for (const f of files) {
    // pg_cron / pg_net are not in pglite: their install statements become no-ops (cron.* is stubbed).
    const sql = readFileSync(join(MIGRATIONS, f), 'utf-8')
      .replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); }
    catch (e) { failed.push({ file: f, error: String(e?.message || e).slice(0, 160) }); }
  }
  return { db, files, failed };
}
