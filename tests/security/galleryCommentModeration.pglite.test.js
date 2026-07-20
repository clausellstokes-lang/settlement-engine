/**
 * galleryCommentModeration.pglite.test.js — EXECUTION + structural tests for the
 * gallery-comment perimeter/moderation layer (migration 169, V-27f).
 *
 * Mirrors the galleryReactions.pglite harness: auth.uid() + account_is_active()
 * are settable-GUC stubs, settlements/profiles/gallery_comments are minimal
 * mirrors, and the REAL migration-169 SQL (the hidden-columns ALTER, the report
 * table, and all three RPC bodies) plus the REAL migration-125 velocity counter
 * run inside in-process Postgres. What's pinned:
 *
 *   • report_gallery_comment gates VERBATIM: sign-in required, banned account
 *     rejected AHEAD of the velocity counter, public+undeleted-comment wall,
 *     reason/body cleanup, one-open-report-per-(comment,user) upsert, and the
 *     30/hour velocity ceiling through the SHARED 125 counter on its OWN action
 *     key (never burning the gallery_comment budget).
 *   • set_gallery_comment_hidden is the moderator write: hide stamps the triple,
 *     list_gallery_comments then EXCLUDES the comment, unhide restores it.
 *   • list_gallery_comments excludes deleted AND hidden comments.
 *   • structural pins — RLS on + the two report policies + the grant posture
 *     (report → authenticated; set-hidden → service_role; both revoked from
 *     public) + the new definer functions' search_path pin.
 *
 * LIMITATION (same as the sibling pglite suites): pglite runs single-connection
 * as superuser, so RLS POLICIES are pinned structurally (regex over the migration
 * text), not by role-switching execution; the RPC BEHAVIOR is executed for real.
 * Run with --no-file-parallelism (multiple in-process PG instances contend).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_169 = resolve(dir, '169_gallery_comment_moderation.sql');
const MIG_125 = resolve(dir, '125_action_velocity_guards.sql');
const allExist = existsSync(MIG_169) && existsSync(MIG_125);

/** Extract a function definition verbatim (actionVelocity idiom). */
function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}
/** Extract a CREATE TABLE statement verbatim. */
function extractTable(src, name) {
  const m = src.match(new RegExp(`create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${name}[\\s\\S]*?\\);`, 'i'));
  if (!m) throw new Error(`could not extract table ${name}`);
  return m[0];
}
/** Extract the hidden-columns ALTER verbatim. */
function extractHiddenAlter(src) {
  const m = src.match(/alter\s+table\s+public\.gallery_comments[\s\S]*?;/i);
  if (!m) throw new Error('could not extract the gallery_comments hidden-columns ALTER');
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const SETTLEMENT = '33333333-3333-3333-3333-333333333333';
const PRIVATE_SETTLEMENT = '44444444-4444-4444-4444-444444444444';
const COMMENT = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DELETED_COMMENT = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRIVATE_COMMENT = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const asAnon = () => db.exec(`set test.uid = '';`);
const setActive = (v) => db.exec(`set test.active = '${v}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const report = (cid = COMMENT, reason = 'spam', body = 'off topic') =>
  db.query(`select public.report_gallery_comment('${cid}', '${reason}', '${body}') as id`);
const listComments = (sid = SETTLEMENT) =>
  db.query(`select * from public.list_gallery_comments('${sid}')`);
const setHidden = (cid, hide, reason = null, mod = null) =>
  db.query(`select public.set_gallery_comment_hidden('${cid}', ${hide}, ${reason ? `'${reason}'` : 'null'}, ${mod ? `'${mod}'` : 'null'})`);

describe('gallery-comment moderation migration fixture exists (guards a silent vacuous skip)', () => {
  it('169_gallery_comment_moderation.sql is present (a renumbered file must fail loudly)', () => {
    expect(existsSync(MIG_169), `migration 169 missing: ${MIG_169}`).toBe(true);
    expect(allExist).toBe(true);
  });
});

describe.runIf(allExist)('gallery comment moderation — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    const src169 = readFileSync(MIG_169, 'utf-8');
    const src125 = readFileSync(MIG_125, 'utf-8');
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create table auth.users (id uuid primary key);
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function public.account_is_active(p uuid) returns boolean language sql stable as $fn$
        select coalesce(nullif(current_setting('test.active', true), '')::boolean, true)
      $fn$;
      create table public.settlements (
        id uuid primary key,
        is_public boolean not null default false,
        user_id uuid
      );
      create table public.profiles (
        id uuid primary key,
        external_name text
      );
      -- Minimal gallery_comments mirror (019 shape, pre-169); the real 169 ALTER
      -- below adds the hidden_* columns.
      create table public.gallery_comments (
        id uuid primary key,
        settlement_id uuid not null references public.settlements(id) on delete cascade,
        user_id uuid not null references auth.users(id) on delete cascade,
        body text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        deleted_at timestamptz
      );
      create table public.user_action_rate_limits (
        user_key     uuid        not null,
        action       text        not null,
        window_start timestamptz not null,
        count        integer     not null default 0,
        primary key (user_key, action, window_start)
      );
    `);
    // The REAL migration-169 statements + the REAL 125 velocity counter.
    await db.exec(extractHiddenAlter(src169));
    await db.exec(extractTable(src169, 'gallery_comment_reports'));
    await db.exec(extractFn(src125, '_consume_action_rate_limit'));
    await db.exec(extractFn(src169, 'report_gallery_comment'));
    await db.exec(extractFn(src169, 'set_gallery_comment_hidden'));
    await db.exec(extractFn(src169, 'list_gallery_comments'));
  }, 30000);

  beforeEach(async () => {
    await db.exec('truncate public.settlements, public.profiles, public.gallery_comments, public.gallery_comment_reports, public.user_action_rate_limits, auth.users cascade;');
    await db.exec(`insert into auth.users (id) values ('${UID}'), ('${OTHER}');`);
    await db.exec(`
      insert into public.settlements (id, is_public, user_id) values
        ('${SETTLEMENT}', true, '${OTHER}'),
        ('${PRIVATE_SETTLEMENT}', false, '${OTHER}');
    `);
    await db.exec(`
      insert into public.gallery_comments (id, settlement_id, user_id, body, deleted_at) values
        ('${COMMENT}', '${SETTLEMENT}', '${OTHER}', 'A fine dossier.', null),
        ('${DELETED_COMMENT}', '${SETTLEMENT}', '${OTHER}', 'gone', now()),
        ('${PRIVATE_COMMENT}', '${PRIVATE_SETTLEMENT}', '${OTHER}', 'hidden world', null);
    `);
    await asUser(UID);
    await setActive('true');
  });

  // ── report_gallery_comment ────────────────────────────────────────────────
  it('reports a public comment (returns an id; one open report row)', async () => {
    const { rows } = await report();
    expect(rows[0].id).toBeTruthy();
    const n = await scalar(`select count(*)::int n, max(status) status from public.gallery_comment_reports`);
    expect(n.n).toBe(1);
    expect(n.status).toBe('open');
  });

  it('a second report by the same user upserts (still one row, latest reason/body win)', async () => {
    await report(COMMENT, 'spam', 'first');
    await report(COMMENT, 'abuse', 'second');
    const n = await scalar(`select count(*)::int n from public.gallery_comment_reports`);
    expect(n.n).toBe(1); // one open report per (comment, user) — the unique upsert
    const row = await scalar(`select reason, body, status from public.gallery_comment_reports`);
    expect(row.reason).toBe('abuse'); // do update set reason = excluded.reason (latest wins)
    expect(row.body).toBe('second');
    expect(row.status).toBe('open');
  });

  it('requires sign-in', async () => {
    await asAnon();
    await expect(report()).rejects.toThrow(/sign in/i);
  });

  it('rejects a banned account AHEAD of the velocity counter (no tick consumed)', async () => {
    await setActive('false');
    await expect(report()).rejects.toThrow(/account is not active/i);
    expect((await scalar('select count(*)::int n from public.user_action_rate_limits')).n).toBe(0);
  });

  it('rejects a report on a comment whose settlement is not public', async () => {
    await expect(report(PRIVATE_COMMENT)).rejects.toThrow(/not available/i);
  });

  it('rejects a report on a soft-deleted comment', async () => {
    await expect(report(DELETED_COMMENT)).rejects.toThrow(/not available/i);
  });

  it('allows 30 reports then throttles the 31st (own action key, shared 125 counter)', async () => {
    for (let i = 0; i < 30; i++) await report();
    await expect(report()).rejects.toThrow(/reporting too quickly/i);
    const row = await scalar(`select count from public.user_action_rate_limits where user_key='${UID}' and action='gallery_comment_report'`);
    expect(row.count).toBe(30);
    // Report throttling never burns the COMMENT budget (separate action key).
    expect((await scalar(`select count(*)::int n from public.user_action_rate_limits where action='gallery_comment'`)).n).toBe(0);
  }, 30000);

  // ── set_gallery_comment_hidden + list_gallery_comments ────────────────────
  it('list shows visible comments, excludes deleted', async () => {
    const { rows } = await listComments();
    expect(rows.map((r) => r.id)).toEqual([COMMENT]); // DELETED_COMMENT excluded
  });

  it('a moderator hide stamps the triple and drops the comment from the reader list', async () => {
    await setHidden(COMMENT, true, 'abuse', OTHER);
    const c = await scalar(`select hidden_at, hidden_by, hidden_reason from public.gallery_comments where id='${COMMENT}'`);
    expect(c.hidden_at).not.toBeNull();
    expect(c.hidden_by).toBe(OTHER);
    expect(c.hidden_reason).toBe('abuse');
    expect((await listComments()).rows).toEqual([]); // hidden → gone from readers
  });

  it('unhide clears the triple and the comment returns to the reader list', async () => {
    await setHidden(COMMENT, true, 'abuse', OTHER);
    await setHidden(COMMENT, false);
    const c = await scalar(`select hidden_at, hidden_by, hidden_reason from public.gallery_comments where id='${COMMENT}'`);
    expect(c.hidden_at).toBeNull();
    expect(c.hidden_by).toBeNull();
    expect(c.hidden_reason).toBeNull();
    expect((await listComments()).rows.map((r) => r.id)).toEqual([COMMENT]);
  });
});

// ── Structural pins over the migration text (RLS + grants — pglite runs as
// superuser, so posture is pinned by inspection, the contract-test idiom). ────
describe.runIf(allExist)('gallery comment moderation — RLS + grant posture pins (migration text)', () => {
  const sql = readFileSync(MIG_169, 'utf-8');

  it('RLS is enabled on gallery_comment_reports', () => {
    expect(sql).toMatch(/alter\s+table\s+public\.gallery_comment_reports\s+enable\s+row\s+level\s+security/i);
  });

  it('carries the two report policies (select-own / insert-gated)', () => {
    expect(sql).toMatch(/create policy "Users can read their own gallery comment reports"[\s\S]*?for select[\s\S]*?auth\.uid\(\) = user_id/i);
    const insertPolicy = sql.match(/create policy "Users can report gallery comments"[\s\S]*?\);/i)?.[0] || '';
    expect(insertPolicy).toMatch(/auth\.uid\(\) = user_id/);
    expect(insertPolicy).toMatch(/status = 'open'/);
    expect(insertPolicy).toMatch(/is_public = true/);
    expect(insertPolicy).toMatch(/deleted_at is null/);
  });

  it('grant posture: report is authenticated-only; set-hidden is service_role-only; both revoked from public', () => {
    expect(sql).toMatch(/revoke execute on function public\.report_gallery_comment\(uuid, text, text\) from public/i);
    expect(sql).toMatch(/grant execute on function public\.report_gallery_comment\(uuid, text, text\) to authenticated;/i);
    expect(sql).not.toMatch(/grant execute on function public\.report_gallery_comment[^;]*service_role/i);
    expect(sql).toMatch(/revoke execute on function public\.set_gallery_comment_hidden\(uuid, boolean, text, uuid\) from public/i);
    expect(sql).toMatch(/grant execute on function public\.set_gallery_comment_hidden\(uuid, boolean, text, uuid\) to service_role;/i);
    // The moderator write is NEVER granted to ordinary users.
    expect(sql).not.toMatch(/grant execute on function public\.set_gallery_comment_hidden[^;]*authenticated/i);
  });

  it('the new definer functions pin search_path = public, pg_temp (131 convention)', () => {
    for (const name of ['report_gallery_comment', 'set_gallery_comment_hidden']) {
      const fn = sql.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'))?.[0] || '';
      expect(fn, `${name} missing`).toBeTruthy();
      expect(fn).toMatch(/security definer/i);
      expect(fn).toMatch(/set search_path = public, pg_temp/i);
    }
  });

  it('moderation columns are added to gallery_comments (moderator-only surface)', () => {
    expect(sql).toMatch(/alter table public\.gallery_comments[\s\S]*?add column if not exists hidden_at timestamptz/i);
    expect(sql).toMatch(/add column if not exists hidden_by uuid/i);
    expect(sql).toMatch(/add column if not exists hidden_reason text/i);
  });
});
