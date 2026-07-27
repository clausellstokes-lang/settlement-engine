/**
 * galleryReactions.pglite.test.js — EXECUTION tests for the structured gallery
 * reactions (migration 146, GALLERY-2 phase 2).
 *
 * Mirrors the actionVelocity.pglite harness: auth.uid() + account_is_active()
 * are settable-GUC stubs, settlements is a minimal mirror, and the REAL
 * migration-146 SQL (table DDL + both RPC bodies) plus the REAL migration-125
 * velocity counter run inside in-process Postgres. What's pinned:
 *
 *   • toggle semantics — add / remove / multi-key coexistence, per-caller
 *     `mine`, cross-user aggregation, full-state return shape.
 *   • the vote-posture gates VERBATIM: sign-in required, banned account
 *     rejected AHEAD of the velocity counter, public-settlement wall,
 *     bounded-vocabulary wall, and the 120/h velocity ceiling through the
 *     SHARED 125 counter (its own 'gallery_reaction' action key).
 *   • the CHECK constraint holds even against a direct table INSERT.
 *   • structural pins — RLS on + the three vote-shaped policies + the grant
 *     posture (toggle: authenticated only; state read: authenticated + anon).
 *
 * LIMITATION (same as actionVelocity): pglite runs single-connection as
 * superuser, so RLS policies are pinned structurally (regex over the migration
 * text), not by role-switching execution.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_145 = resolve(dir, '145_gallery_reactions.sql');
const MIG_125 = resolve(dir, '125_action_velocity_guards.sql');
const allExist = existsSync(MIG_145) && existsSync(MIG_125);

/** Extract a function definition verbatim (actionVelocity idiom). */
function extractFn(src, name) {
  const m = src.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

/** Extract the gallery_reactions CREATE TABLE statement verbatim. */
function extractReactionsTable(src) {
  const m = src.match(/create\s+table\s+if\s+not\s+exists\s+public\.gallery_reactions[\s\S]*?\);/i);
  if (!m) throw new Error('could not extract the gallery_reactions table DDL');
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const SETTLEMENT = '33333333-3333-3333-3333-333333333333';
const PRIVATE_SETTLEMENT = '44444444-4444-4444-4444-444444444444';

let db;
const asUser = (uid) => db.exec(`set test.uid = '${uid}';`);
const asAnon = () => db.exec(`set test.uid = '';`);
const setActive = (v) => db.exec(`set test.active = '${v}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const toggle = (key, sid = SETTLEMENT) =>
  db.query(`select * from public.toggle_gallery_reaction('${sid}', '${key}')`);
const state = (sid = SETTLEMENT) =>
  db.query(`select * from public.get_gallery_reaction_state('${sid}')`);

describe('gallery-reactions migration fixture exists (guards against silent vacuous skip)', () => {
  it('145_gallery_reactions.sql is present (a renamed/renumbered file must fail loudly)', () => {
    expect(existsSync(MIG_145), `migration 146 missing: ${MIG_145}`).toBe(true);
    expect(allExist).toBe(true);
  });
});

describe.runIf(allExist)('gallery reactions — execution against the real SQL (pglite)', () => {
  beforeAll(async () => {
    const src146 = readFileSync(MIG_145, 'utf-8');
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
      create table public.user_action_rate_limits (
        user_key     uuid        not null,
        action       text        not null,
        window_start timestamptz not null,
        count        integer     not null default 0,
        primary key (user_key, action, window_start)
      );
    `);
    // The REAL table DDL (FKs intact — auth.users is stubbed above) + the REAL
    // function bodies from the migrations.
    await db.exec(extractReactionsTable(src146));
    await db.exec(extractFn(src125, '_consume_action_rate_limit'));
    await db.exec(extractFn(src146, 'toggle_gallery_reaction'));
    await db.exec(extractFn(src146, 'get_gallery_reaction_state'));
  }, 30000);

  beforeEach(async () => {
    await db.exec('truncate public.settlements, public.gallery_reactions, public.user_action_rate_limits, auth.users cascade;');
    await db.exec(`insert into auth.users (id) values ('${UID}'), ('${OTHER}');`);
    await db.exec(`
      insert into public.settlements (id, is_public, user_id) values
        ('${SETTLEMENT}', true, '${OTHER}'),
        ('${PRIVATE_SETTLEMENT}', false, '${OTHER}');
    `);
    await asUser(UID);
    await setActive('true');
  });

  it('toggle ON returns the full state with the new reaction (count 1, mine)', async () => {
    const { rows } = await toggle('worth_walking');
    expect(rows).toEqual([{ reaction_key: 'worth_walking', reaction_count: 1, mine: true }]);
  });

  it('toggle OFF removes the reaction (key drops out of the returned state)', async () => {
    await toggle('worth_walking');
    const { rows } = await toggle('worth_walking');
    expect(rows).toEqual([]);
    expect((await scalar('select count(*)::int n from public.gallery_reactions')).n).toBe(0);
  });

  it('one user can combine reactions; keys count independently', async () => {
    await toggle('worth_walking');
    await toggle('map_speaks');
    const { rows } = await state();
    const byKey = Object.fromEntries(rows.map(r => [r.reaction_key, r]));
    expect(byKey.worth_walking).toMatchObject({ reaction_count: 1, mine: true });
    expect(byKey.map_speaks).toMatchObject({ reaction_count: 1, mine: true });
    // Removing one leaves the other untouched.
    await toggle('map_speaks');
    const after = (await state()).rows;
    expect(after).toEqual([{ reaction_key: 'worth_walking', reaction_count: 1, mine: true }]);
  });

  it('counts aggregate across users; mine is per-caller', async () => {
    await toggle('steeped_history');
    await asUser(OTHER);
    await toggle('steeped_history');
    const { rows } = await state();
    expect(rows).toEqual([{ reaction_key: 'steeped_history', reaction_count: 2, mine: true }]);
    await asUser(UID);
    expect((await state()).rows[0]).toMatchObject({ reaction_count: 2, mine: true });
    // A third party sees the count but not ownership.
    await asAnon();
    expect((await state()).rows[0]).toMatchObject({ reaction_count: 2, mine: false });
  });

  it('rejects an unknown reaction key (bounded vocabulary wall)', async () => {
    await expect(toggle('great_map')).rejects.toThrow(/unknown reaction/i);
  });

  it('the table CHECK holds even against a direct INSERT (defense in depth)', async () => {
    await expect(db.query(
      `insert into public.gallery_reactions (settlement_id, user_id, reaction_key)
       values ('${SETTLEMENT}', '${UID}', 'free_text_sneaks_in')`,
    )).rejects.toThrow(/check|constraint/i);
  });

  it('rejects reactions on a non-public settlement', async () => {
    await expect(toggle('worth_walking', PRIVATE_SETTLEMENT)).rejects.toThrow(/not public/i);
  });

  it('requires sign-in', async () => {
    await asAnon();
    await expect(toggle('worth_walking')).rejects.toThrow(/sign in/i);
  });

  it('rejects a non-active (banned) account AHEAD of the velocity counter', async () => {
    await setActive('false');
    await expect(toggle('worth_walking')).rejects.toThrow(/account is not active/i);
    expect((await scalar('select count(*)::int n from public.user_action_rate_limits')).n).toBe(0);
  });

  it('allows 120 reaction-toggles then throttles the 121st (own action key, shared 125 counter)', async () => {
    for (let i = 0; i < 120; i++) {
      await toggle('true_to_life'); // on/off alternation — every accepted call counts
    }
    await expect(toggle('true_to_life')).rejects.toThrow(/reacting too quickly/i);
    const row = await scalar(`select count from public.user_action_rate_limits where user_key='${UID}' and action='gallery_reaction'`);
    expect(row.count).toBe(120);
    // Reaction throttling never burns the VOTE budget (separate action key).
    expect((await scalar(`select count(*)::int n from public.user_action_rate_limits where action='gallery_vote'`)).n).toBe(0);
  }, 30000);

  it('get_gallery_reaction_state is empty for a reaction-less or non-public settlement', async () => {
    expect((await state()).rows).toEqual([]);
    await toggle('finely_wrought');
    expect((await state(PRIVATE_SETTLEMENT)).rows).toEqual([]);
  });
});

// ── Structural pins over the migration text (RLS + grants — pglite runs as
// superuser, so posture is pinned by inspection, the contract-test idiom). ────
describe.runIf(allExist)('gallery reactions — RLS + grant posture pins (migration text)', () => {
  const sql = readFileSync(MIG_145, 'utf-8');

  it('RLS is enabled on gallery_reactions', () => {
    expect(sql).toMatch(/alter\s+table\s+public\.gallery_reactions\s+enable\s+row\s+level\s+security/i);
  });

  it('carries the three vote-shaped policies (select-own / insert-gated / delete-own)', () => {
    expect(sql).toMatch(/create policy "Users can read their own gallery reactions"[\s\S]*?for select[\s\S]*?auth\.uid\(\) = user_id/i);
    // INSERT must carry all three gates: identity, active account, public settlement.
    const insertPolicy = sql.match(/create policy "Users can react to public settlements"[\s\S]*?\);/i)?.[0] || '';
    expect(insertPolicy).toMatch(/auth\.uid\(\) = user_id/);
    expect(insertPolicy).toMatch(/account_is_active\(auth\.uid\(\)\)/);
    expect(insertPolicy).toMatch(/is_public = true/);
    expect(sql).toMatch(/create policy "Users can remove their own gallery reactions"[\s\S]*?for delete[\s\S]*?auth\.uid\(\) = user_id/i);
  });

  it('grant posture: toggle is authenticated-only; state read includes anon; both revoked from public', () => {
    expect(sql).toMatch(/revoke execute on function public\.toggle_gallery_reaction\(uuid, text\) from public/i);
    expect(sql).toMatch(/grant execute on function public\.toggle_gallery_reaction\(uuid, text\) to authenticated;/i);
    expect(sql).not.toMatch(/grant execute on function public\.toggle_gallery_reaction[^;]*anon/i);
    expect(sql).toMatch(/revoke execute on function public\.get_gallery_reaction_state\(uuid\) from public/i);
    expect(sql).toMatch(/grant execute on function public\.get_gallery_reaction_state\(uuid\) to authenticated, anon/i);
  });

  it('both SECURITY DEFINER functions pin search_path = public, pg_temp (131 convention)', () => {
    const fns = sql.match(/^create or replace function[\s\S]*?\$\$;/gim) || [];
    expect(fns.length).toBeGreaterThanOrEqual(2);
    for (const fn of fns) {
      expect(fn).toMatch(/security definer/i);
      expect(fn).toMatch(/set search_path = public, pg_temp/i);
    }
  });
});
