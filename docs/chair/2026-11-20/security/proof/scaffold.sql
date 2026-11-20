-- Supabase-like scaffold for a LOCAL scratch chain (unix socket only). Mirrors, as far as the
-- grants go, what Supabase's initial schema does for the `postgres` role in schema public:
-- default privileges grant ALL on tables, sequences and functions to anon, authenticated and
-- service_role; service_role bypasses row security. auth.* is stubbed on GUCs.
create schema if not exists auth;
-- As Supabase's own auth.uid()/auth.role(): read the request's JWT claims (PostgREST sets
-- request.jwt.claim.* per request). test.uid is kept as an alias for the readers' probes.
create or replace function auth.uid() returns uuid language sql stable as $fn$
  select coalesce(nullif(current_setting('test.uid', true), ''),
                  nullif(current_setting('request.jwt.claim.sub', true), ''))::uuid $fn$;
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
grant select on auth.users to service_role;
alter default privileges in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
