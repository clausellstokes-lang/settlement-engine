/**
 * galleryReportPipeline.pglite.test.js — applies the REAL 173 migration into
 * pglite and exercises the reporting extension:
 *   - report_gallery_map: active + public-only + one-open-per-user (mirror 169).
 *   - list_open_report_targets: staff-only unified queue across settlement /
 *     map / campaign / comment, one row per target with reporter count + reasons.
 *   - resolve_report_target: transitions ALL open reports for a target together.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_173 = resolve(dir, '173_gallery_map_reports_and_queue.sql');

const ADMIN = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const R1 = 'dddddddd-dddd-dddd-dddd-dddddddddddd'; // reporter 1
const R2 = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'; // reporter 2
const MAP = '22222222-2222-2222-2222-222222222222';
const CAMP = '33333333-3333-3333-3333-333333333333';
const SETTLE = '11111111-1111-1111-1111-111111111111';
const COMMENT = '44444444-4444-4444-4444-444444444444';

async function makeDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create table auth.users (id uuid primary key);
    create table public.profiles (id uuid primary key, role text default 'user', banned_at timestamptz, disabled_at timestamptz);
    create table public.saved_maps (id uuid primary key, user_id uuid, is_public boolean default false, share_kind text default 'map', name text);
    create table public.settlements (id uuid primary key, user_id uuid, is_public boolean default false, name text);
    create table public.gallery_comments (id uuid primary key, settlement_id uuid, user_id uuid, body text, hidden_at timestamptz);
    create table public.gallery_reports (
      id uuid primary key default gen_random_uuid(), settlement_id uuid, user_id uuid, reason text default 'other',
      body text default '', status text default 'open', created_at timestamptz default now(), updated_at timestamptz default now(),
      resolved_at timestamptz, resolved_by uuid, resolution_note text default '', unique(settlement_id, user_id)
    );
    create table public.gallery_comment_reports (
      id uuid primary key default gen_random_uuid(), comment_id uuid, user_id uuid, reason text default 'other',
      body text default '', status text default 'open', created_at timestamptz default now(), updated_at timestamptz default now(),
      unique(comment_id, user_id)
    );
    -- Helper stubs (real ones live in earlier migrations).
    create function public.account_is_active(p_uid uuid) returns boolean language sql stable as $$
      select coalesce((select banned_at is null and disabled_at is null from public.profiles where id = p_uid), false) $$;
    create function public._consume_action_rate_limit(p_user uuid, p_action text, p_window int) returns int language sql as $$ select 1 $$;
    create function public.current_user_is_privileged() returns boolean language sql stable as $$
      select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','developer')) $$;
    create function public._audit_action(a uuid, b uuid, c text, d jsonb, e jsonb, f text) returns void language plpgsql as $$ begin end $$;
    insert into auth.users(id) values ('${ADMIN}'),('${R1}'),('${R2}');
    insert into public.profiles(id, role) values ('${ADMIN}','admin'),('${R1}','user'),('${R2}','user');
    insert into public.saved_maps(id, is_public, share_kind, name) values
      ('${MAP}', true, 'map', 'The Broken Coast'),
      ('${CAMP}', true, 'map_with_campaign', 'The Long Siege');
    insert into public.settlements(id, is_public, name) values ('${SETTLE}', true, 'Ravensmoor');
    insert into public.gallery_comments(id, settlement_id, user_id, body) values ('${COMMENT}', '${SETTLE}', '${R2}', 'rude thing');
  `);
  await db.exec(readFileSync(MIG_173, 'utf-8'));
  return db;
}

async function asUser(db, uid) { await db.query(`select set_config('test.uid', '${uid}', false)`); }
async function asAnon(db) { await db.query(`select set_config('test.uid', '', false)`); }

let db;
beforeEach(async () => { db = await makeDb(); });

describe('report_gallery_map', () => {
  it('an active user reports a public map (one open row; dup upserts)', async () => {
    await asUser(db, R1);
    await db.query(`select public.report_gallery_map('${MAP}', 'spam', 'bad')`);
    await db.query(`select public.report_gallery_map('${MAP}', 'unsafe_content', 'worse')`); // same user upserts
    const n = (await db.query(`select count(*)::int c, max(reason) reason from public.gallery_map_reports where map_id='${MAP}'`)).rows[0];
    expect(n.c).toBe(1);
    expect(n.reason).toBe('unsafe_content');
  });

  it('an anonymous caller is rejected', async () => {
    await asAnon(db);
    await expect(db.query(`select public.report_gallery_map('${MAP}')`)).rejects.toThrow(/sign in/i);
  });

  it('a report on a non-public map is rejected', async () => {
    await db.query(`update public.saved_maps set is_public=false where id='${MAP}'`);
    await asUser(db, R1);
    await expect(db.query(`select public.report_gallery_map('${MAP}')`)).rejects.toThrow(/not available/i);
  });

  it('a banned reporter is rejected', async () => {
    await db.query(`update public.profiles set banned_at = now() where id='${R1}'`);
    await asUser(db, R1);
    await expect(db.query(`select public.report_gallery_map('${MAP}')`)).rejects.toThrow(/not active/i);
  });
});

describe('list_open_report_targets — unified staff queue', () => {
  beforeEach(async () => {
    // seed reports across kinds
    await asUser(db, R1); await db.query(`select public.report_gallery_map('${MAP}', 'spam', '')`);
    await asUser(db, R2); await db.query(`select public.report_gallery_map('${MAP}', 'unsafe_content', '')`);
    await db.query(`insert into public.gallery_reports(settlement_id, user_id, reason) values ('${SETTLE}', '${R1}', 'spam')`);
    await db.query(`insert into public.gallery_map_reports(map_id, user_id, reason) values ('${CAMP}', '${R1}', 'copyright')`);
    await db.query(`insert into public.gallery_comment_reports(comment_id, user_id, reason) values ('${COMMENT}', '${R1}', 'other')`);
  });

  it('a staff caller sees one row per target with kind, count, and reasons', async () => {
    await asUser(db, ADMIN);
    const rows = (await db.query(`select * from public.list_open_report_targets()`)).rows;
    const byKind = Object.fromEntries(rows.map((r) => [r.kind, r]));
    expect(byKind.map.target_id).toBe(MAP);
    expect(byKind.map.report_count).toBe(2);                 // R1 + R2
    expect([...byKind.map.reasons].sort()).toEqual(['spam', 'unsafe_content']);
    expect(byKind.campaign.target_id).toBe(CAMP);            // share_kind → campaign
    expect(byKind.settlement.report_count).toBe(1);
    expect(byKind.comment.label).toBe('rude thing');         // excerpt for judging
  });

  it('a non-staff caller sees nothing (RPC self-gates)', async () => {
    await asUser(db, R1);
    const rows = (await db.query(`select * from public.list_open_report_targets()`)).rows;
    expect(rows).toEqual([]);
  });
});

describe('resolve_report_target — group resolution', () => {
  it('resolving a map target dismisses ALL its open reports together', async () => {
    await asUser(db, R1); await db.query(`select public.report_gallery_map('${MAP}', 'spam', '')`);
    await asUser(db, R2); await db.query(`select public.report_gallery_map('${MAP}', 'spam', '')`);
    await asUser(db, ADMIN);
    const moved = (await db.query(`select public.resolve_report_target('map', '${MAP}', 'dismissed', 'unfounded') as n`)).rows[0].n;
    expect(moved).toBe(2);
    const open = (await db.query(`select count(*)::int c from public.gallery_map_reports where map_id='${MAP}' and status='open'`)).rows[0].c;
    expect(open).toBe(0);
  });

  it('a non-staff caller cannot resolve', async () => {
    await asUser(db, R1);
    await expect(db.query(`select public.resolve_report_target('map', '${MAP}', 'dismissed', '')`)).rejects.toThrow(/only admins/i);
  });
});
