/**
 * veilChain.shared.mjs — the share veil's born-town harness, written once (VEIL-20, 2026-11-20): the auth/cron/storage
 * scaffold and a pglite chain of every migration on disk; the registry's paths withheld from a served document and
 * grafted back from the stored one. Read by tests/security/shareRenderTwice.pglite.test.jsx (VR16 (1)) and
 * tests/security/rosterChoiceInversion.pglite.test.js (VR26); a helper, never a suite.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

export const OWNER = '11111111-1111-1111-1111-111111111111';
export const BIRTH_DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
export const SCAFFOLD = `
    create schema if not exists auth;
    create or replace function auth.uid() returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create or replace function auth.role() returns text language sql stable as $fn$
      select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $fn$;
    create or replace function auth.jwt() returns jsonb language sql stable as $fn$ select '{}'::jsonb $fn$;
    create table if not exists auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}',
      raw_app_meta_data jsonb default '{}', created_at timestamptz default now(), last_sign_in_at timestamptz,
      email_confirmed_at timestamptz, phone text, deleted_at timestamptz, is_anonymous boolean default false);
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
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
    create extension if not exists pgcrypto;`;

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));

/** Boot `db` with the scaffold and every migration on disk; returns the files that failed (none wanted). */
export async function bootChain(db) {
  await db.exec(SCAFFOLD);
  const failed = [];
  const dir = resolve(process.cwd(), 'supabase', 'migrations');
  for (const f of readdirSync(dir).filter((n) => /^\d{3}_.*\.sql$/.test(n)).sort()) {
    const sql = readFileSync(join(dir, f), 'utf-8').replace(/create extension if not exists (pg_cron|pg_net)( with schema extensions)?/gi, 'select 1');
    try { await db.exec(sql); } catch (e) { failed.push(`${f}: ${String(e?.message || e).slice(0, 160)}`); }
  }
  await db.exec(`insert into auth.users (id) values ('${OWNER}') on conflict do nothing; insert into public.profiles (id) values ('${OWNER}') on conflict do nothing;
    update public.profiles set role = 'developer' where id = '${OWNER}'; set test.uid = '';`); // the slot cap (014) counts the owner's rows: a developer has none
  return failed;
}

/** Store a born town as a shared row (listed and linked) with its veil overrides and Reveal DM. */
export async function storeShare(db, { town, slug, overrides, shareDm = false }) {
  await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
    values (gen_random_uuid(), $1, $2, $3, $4::jsonb, true, $5, now(), $6, 'unlisted', $7::jsonb, $8, true)`, [OWNER, town.name, town.tier, JSON.stringify(town), slug, `${slug}-link`, JSON.stringify(overrides), shareDm]);
}

/** Remove every node whose differ-normalised path a pattern matches (an array matched by its `x[]` path goes whole). */
export function withhold(doc, patterns) {
  const hit = (p) => patterns.some((re) => re.test(p) || re.test(`${p} (only in A)`) || re.test(`${p} (only in B)`));
  const walk = (o, path) => {
    if (Array.isArray(o)) { o.forEach((x) => walk(x, `${path}[]`)); return; }
    if (!isRec(o)) return;
    for (const k of Object.keys(o)) {
      const p = path ? `${path}.${k}` : k;
      if (hit(p) || (Array.isArray(o[k]) && hit(`${p}[]`))) { delete o[k]; continue; }
      walk(o[k], p);
    }
  };
  walk(doc, '');
  return doc;
}

/** Graft each pattern-matched STORED node back into the served document; returns the counts. */
export function graft(dst, src, patterns, path = '', tally = { grafted: 0, unaligned: 0 }) {
  const hit = (p) => patterns.some((re) => re.test(p) || re.test(`${p} (only in A)`) || re.test(`${p} (only in B)`));
  const keyOf = (x) => (isRec(x) ? (x.id ?? x.name ?? x.archetype ?? x.type ?? null) : null);
  if (Array.isArray(src) && Array.isArray(dst)) {
    src.forEach((x, i) => {
      const j = dst.length === src.length ? i : dst.findIndex((y) => keyOf(y) !== null && keyOf(y) === keyOf(x));
      if (j < 0) { tally.unaligned += 1; return; }
      graft(dst[j], x, patterns, `${path}[]`, tally);
    });
    return tally;
  }
  if (!isRec(src) || !isRec(dst)) return tally;
  for (const k of Object.keys(src)) {
    const p = path ? `${path}.${k}` : k;
    if (hit(p) || (Array.isArray(src[k]) && hit(`${p}[]`))) { dst[k] = clone(src[k]); tally.grafted += 1; continue; }
    if (k in dst) graft(dst[k], src[k], patterns, p, tally);
  }
  return tally;
}

