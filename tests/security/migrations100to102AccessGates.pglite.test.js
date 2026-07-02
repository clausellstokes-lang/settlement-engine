/**
 * migrations100to102AccessGates.pglite.test.js — EXECUTION tests of the three
 * access-boundary migrations 100/101/102 against in-process Postgres (pglite).
 *
 * 100 — 038's analytics dashboard views/MV (v_funnel_first_gen,
 *   v_settlement_preferences, v_edit_heatmap, v_ai_usage, mv_retention_cohorts)
 *   live in the API-exposed `public` schema where Supabase's default privileges
 *   hand SELECT to anon/authenticated — a view runs with its OWNER's rights, so
 *   that bypassed the RLS on the underlying analytics tables. 100 revokes them.
 *   Proven DIFFERENTIALLY: grants present before 100, absent after.
 *
 * 101 — 018's current_user_is_privileged() carried a hardcoded-email OR clause
 *   (a permanent admin backdoor keyed to a mutable data value). 101 recreates it
 *   role-only and re-affirms the owner's role='admin' seed. Proven
 *   DIFFERENTIALLY: under the 018 body the email alone elevates; under 101 it
 *   does not, while role='admin'/'developer' still do.
 *
 * 102 — persist_world_pulse_advance (net-current 084) and
 *   merge_neighbour_backlink (net-current 096) gated writes on ownership +
 *   account_is_active only, missing the row-level access_state='active' billing
 *   gate every direct-write RLS policy (024/059) and mutate_settlement_batch
 *   enforce — a downgraded user's frozen rows stayed writable through those two
 *   RPCs. Proven DIFFERENTIALLY: the 084/096 bodies write a frozen row; the 102
 *   bodies refuse (persist aborts atomically; backlink no-ops).
 *
 * auth.uid() is faked with a session-GUC shim so the definer bodies run
 * verbatim (pglite has no GoTrue). Mirrors worldPulseAtomicPersist.pglite.test.js.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase/migrations');
const MIG_038 = resolve(MIG_DIR, '038_analytics_rollups.sql');
const MIG_018 = resolve(MIG_DIR, '018_account_billing_models_credits.sql');
const MIG_084 = resolve(MIG_DIR, '084_world_pulse_persist_dedupe_ownership.sql');
const MIG_096 = resolve(MIG_DIR, '096_merge_neighbour_backlink.sql');
const MIG_100 = resolve(MIG_DIR, '100_revoke_analytics_views_from_api.sql');
const MIG_101 = resolve(MIG_DIR, '101_drop_privileged_email_backdoor.sql');
const MIG_102 = resolve(MIG_DIR, '102_gate_pulse_persist_on_access_state.sql');

const allExist = [MIG_038, MIG_018, MIG_084, MIG_096, MIG_100, MIG_101, MIG_102].every(existsSync);

// Hard-fail (not a silent vacuous skip) if any target migration vanished.
describe('100/101/102 pglite targets exist (guards against silent vacuous skip)', () => {
  it('all target migrations are present on disk', () => {
    expect(allExist, '038/018/084/096/100/101/102 must all exist under supabase/migrations').toBe(true);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(file, name) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from ${file}`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const OWNER = '99999999-9999-4999-8999-999999999999';
const IMPOSTOR = '22222222-2222-2222-2222-222222222222';
const CAMPAIGN = '33333333-3333-4333-8333-333333333333';
const ASH = '44444444-4444-4444-8444-444444444444';
const BARROW = '55555555-5555-4555-8555-555555555555';
const LINK = 'link-ash-barrow';

/** Run a single statement as a given user (session-GUC auth.uid() shim, one tx). */
function asUser(db, uid, sql) {
  return db.transaction(async (tx) => {
    await tx.query(`set local request.jwt.claim.sub = '${uid}'`);
    return tx.query(sql);
  });
}

// ── 100 — analytics views revoked from the API roles ─────────────────────────
describe.runIf(allExist)('100 — analytics views/MV are not API-readable (pglite)', () => {
  const OBJECTS = [
    'public.v_funnel_first_gen',
    'public.v_settlement_preferences',
    'public.v_edit_heatmap',
    'public.v_ai_usage',
    'public.mv_retention_cohorts',
  ];
  let db;

  beforeAll(async () => {
    db = new PGlite();
    // Scaffold: the API roles + the raw analytics tables 038's views read.
    await db.exec(`
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
      end $do$;
      create schema if not exists research;
      create table public.analytics_events (
        id bigint generated always as identity primary key,
        event text not null,
        actor_id uuid,
        created_at timestamptz not null default now()
      );
      create table public.settlement_snapshots (
        id bigint generated always as identity primary key,
        capture_point text, tier text, population_band text, prosperity text,
        legitimacy numeric, food_resilience numeric,
        condition_archetypes text[] not null default '{}',
        consent_tier text,
        created_at timestamptz not null default now()
      );
      create table public.edit_events (
        id bigint generated always as identity primary key,
        kind text, target_kind text, reverted boolean not null default false,
        edit_seq integer,
        created_at timestamptz not null default now()
      );
    `);
    // The real 038 (creates the 5 dashboard objects), then SIMULATE Supabase's
    // default privileges: new public tables/views arrive SELECT-able by
    // anon/authenticated — the exposure 100 closes.
    await db.exec(readFileSync(MIG_038, 'utf8'));
    await db.exec(`grant select on ${OBJECTS.join(', ')} to anon, authenticated;`);
  });

  it('BEFORE 100 the API roles can read every dashboard object (the exposure is real)', async () => {
    for (const obj of OBJECTS) {
      for (const role of ['anon', 'authenticated']) {
        const r = await db.query(`select has_table_privilege('${role}', '${obj}', 'SELECT') as ok`);
        expect(r.rows[0].ok, `${role} should read ${obj} before 100`).toBe(true);
      }
    }
  });

  it('AFTER 100 neither anon nor authenticated holds ANY privilege on the 5 objects', async () => {
    await db.exec(readFileSync(MIG_100, 'utf8'));
    for (const obj of OBJECTS) {
      for (const role of ['anon', 'authenticated']) {
        for (const priv of ['SELECT', 'INSERT', 'UPDATE', 'DELETE']) {
          const r = await db.query(`select has_table_privilege('${role}', '${obj}', '${priv}') as ok`);
          expect(r.rows[0].ok, `${role} must not ${priv} ${obj} after 100`).toBe(false);
        }
      }
    }
  });

  it('the service-role-only report_* functions still read the views (owner rights unaffected)', async () => {
    await db.query(`insert into public.analytics_events (event) values ('homepage_view')`);
    const r = await db.query(`select count(*)::int as n from public.report_funnel(now()::date - 1, now()::date + 1)`);
    expect(r.rows[0].n).toBeGreaterThan(0);
  });
});

// ── 101 — the hardcoded-email admin backdoor is gone ─────────────────────────
describe.runIf(allExist)('101 — current_user_is_privileged is role-only (pglite)', () => {
  let db;
  const isPriv = async (uid) =>
    (await asUser(db, uid, 'select public.current_user_is_privileged() as p')).rows[0].p;

  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $fn$;
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      end $do$;
      create table public.profiles (id uuid primary key, role text not null default 'user', email text);
    `);
    // The owner exists BEFORE 101 runs, deliberately NOT yet role='admin' — 101's
    // re-affirmed seed must promote them so dropping the email clause cannot lock
    // the owner out. The impostor carries the SAME email but arrives with role
    // 'user' (the value the backdoor keyed on).
    await db.query(
      `insert into public.profiles (id, role, email) values
         ($1, 'user', 'ClausellStokes@aol.com'),
         ($2, 'user', 'clausellstokes@aol.com'),
         ($3, 'user', 'alice@example.com')`,
      [OWNER, IMPOSTOR, ALICE],
    );
  });

  it('DIFFERENTIAL: under the 018 net-current body, the email ALONE elevates (the backdoor is real)', async () => {
    await db.exec(extractFn(MIG_018, 'current_user_is_privileged'));
    expect(await isPriv(IMPOSTOR), '018 body: matching email with role=user is privileged').toBe(true);
  });

  it('AFTER 101 the email alone elevates NOTHING; role admin/developer still does', async () => {
    await db.exec(readFileSync(MIG_101, 'utf8'));
    // The owner was promoted by the re-affirmed seed (case-insensitive match)…
    const owner = await db.query(`select role from public.profiles where id = '${OWNER}'`);
    expect(owner.rows[0].role).toBe('admin');
    // …and is privileged via ROLE, not email.
    expect(await isPriv(OWNER)).toBe(true);
    // The impostor was ALSO caught by the seed (same email), so flip them back to
    // role=user to isolate the runtime clause: email alone must now grant nothing.
    await db.query(`update public.profiles set role = 'user' where id = '${IMPOSTOR}'`);
    expect(await isPriv(IMPOSTOR), '101 body: matching email with role=user is NOT privileged').toBe(false);
    // Plain users stay unprivileged; developer stays privileged (050's role list kept).
    expect(await isPriv(ALICE)).toBe(false);
    await db.query(`update public.profiles set role = 'developer' where id = '${ALICE}'`);
    expect(await isPriv(ALICE)).toBe(true);
  });
});

// ── 102 — access_state='active' gates the two write RPCs ─────────────────────
describe.runIf(allExist)('102 — frozen (non-active access_state) rows are read-only through the RPCs (pglite)', () => {
  let db;
  const scalar = async (q) => (await db.query(q)).rows[0];
  const ashPop = async () => (await scalar(`select data->>'pop' as p from public.settlements where id='${ASH}'`)).p;
  const campTick = async () =>
    (await scalar(`select map_data #>> '{campaign,worldState,tick}' as t from public.saved_maps where id='${CAMPAIGN}'`)).t;

  const envelope = (tick) => JSON.stringify({
    kind: 'settlementforge_campaign',
    version: 2,
    campaign: {
      id: CAMPAIGN,
      name: 'Realm of Ash',
      mapState: { seed: 'seed-9', placements: { b1: ASH } },
      regionalGraph: { channels: [] },
      worldState: { tick },
    },
  });
  const persist = (updates, tick) => asUser(db, ALICE,
    `select public.persist_world_pulse_advance('${CAMPAIGN}'::uuid, '${envelope(tick)}'::jsonb, '${updates}'::jsonb, null) as r`);
  const backlink = () => asUser(db, ALICE,
    `select public.merge_neighbour_backlink('${BARROW}'::uuid, '${LINK}', '${ASH}'::uuid,
       '{"id":"${ASH}","linkId":"${LINK}","name":"Ashford"}'::jsonb, '[]'::jsonb)`);

  beforeAll(async () => {
    db = new PGlite();
    // The worldPulseAtomicPersist scaffold PLUS the access_state billing column
    // (023/024) the 102 guards read.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $fn$;
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      end $do$;
      create table public.saved_maps (
        id uuid primary key,
        user_id uuid not null,
        name text,
        map_seed text,
        map_data jsonb,
        burg_settlement_map jsonb,
        supply_chain_config jsonb,
        access_state text not null default 'active',
        updated_at timestamptz not null default now()
      );
      create table public.settlements (
        id uuid primary key,
        user_id uuid not null,
        data jsonb,
        campaign_state jsonb,
        version_history jsonb,
        neighbour_links jsonb,
        access_state text not null default 'active',
        updated_at timestamptz not null default now()
      );
      create table public.profiles (
        id uuid primary key,
        banned_at timestamptz, disabled_at timestamptz, deleted_at timestamptz
      );
      create or replace function public.account_is_active(p_uid uuid)
      returns boolean language sql stable as $fn$
        select exists (
          select 1 from public.profiles
          where id = p_uid
            and banned_at is null and disabled_at is null and deleted_at is null
        );
      $fn$;
    `);
  });

  beforeEach(async () => {
    await db.exec('truncate public.saved_maps; truncate public.settlements; truncate public.profiles;');
    await db.query(`insert into public.profiles (id) values ($1)`, [ALICE]);
    await db.query(
      `insert into public.saved_maps (id, user_id, name, map_seed, map_data)
         values ($1, $2, 'Realm of Ash', 'seed-0', $3)`,
      [CAMPAIGN, ALICE, envelope(0)],
    );
    await db.query(
      `insert into public.settlements (id, user_id, data) values
         ($1, $3, '{"name":"Ashford","pop":1500}'),
         ($2, $3, '{"name":"Barrow","pop":900,"neighbourNetwork":[]}')`,
      [ASH, BARROW, ALICE],
    );
  });

  it('DIFFERENTIAL: the 084/096 net-prior bodies WRITE a billing-frozen row (the gap is real)', async () => {
    await db.exec(extractFn(MIG_084, 'persist_world_pulse_advance'));
    await db.exec(extractFn(MIG_096, 'merge_neighbour_backlink'));
    await db.query(`update public.settlements set access_state = 'inactive_plan'`);
    await db.query(`update public.saved_maps set access_state = 'inactive_plan'`);

    const res = await persist(JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]), 1);
    expect(res.rows[0].r.applied).toBe(true);   // 084: the frozen advance LANDS
    expect(await ashPop()).toBe('2000');
    expect(await campTick()).toBe('1');

    await backlink();                            // 096: the frozen partner is WRITTEN
    const b = await scalar(`select data #>> '{neighbourNetwork,0,linkId}' as l from public.settlements where id='${BARROW}'`);
    expect(b.l).toBe(LINK);
  });

  it('102: a frozen CAMPAIGN aborts the advance atomically (reads as not-found)', async () => {
    await db.exec(readFileSync(MIG_102, 'utf8'));
    await db.query(`update public.saved_maps set access_state = 'inactive_plan'`);
    await expect(
      persist(JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]), 1),
    ).rejects.toThrow(/not found/);
    expect(await ashPop()).toBe('1500');   // nothing landed
    expect(await campTick()).toBe('0');
  });

  it('102: ONE frozen settlement in the write-set aborts the WHOLE advance (mirrors mutate_settlement_batch)', async () => {
    await db.exec(readFileSync(MIG_102, 'utf8'));
    await db.query(`update public.settlements set access_state = 'inactive_plan' where id = '${BARROW}'`);
    await expect(
      persist(JSON.stringify([
        { saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } },
        { saveId: BARROW, settlement: { name: 'Barrow', pop: 1100 } },
      ]), 1),
    ).rejects.toThrow(/not active or not owned/);
    expect(await ashPop()).toBe('1500');   // the active sibling rolled back too
    expect(await campTick()).toBe('0');
  });

  it('102: a frozen PARTNER makes the back-link a clean NO-OP (self-heals on its next save)', async () => {
    await db.exec(readFileSync(MIG_102, 'utf8'));
    await db.query(`update public.settlements set access_state = 'pending_delete' where id = '${BARROW}'`);
    await backlink();   // must NOT throw — same contract as missing/not-owned
    const b = await scalar(`select data->>'neighbourNetwork' as n, neighbour_links::text as m from public.settlements where id='${BARROW}'`);
    expect(b.n).toBe('[]');       // untouched
    expect(b.m).toBe(null);       // mirror column untouched
  });

  it('102: fully-ACTIVE rows behave exactly as before (no regression)', async () => {
    await db.exec(readFileSync(MIG_102, 'utf8'));
    const res = await persist(JSON.stringify([{ saveId: ASH, settlement: { name: 'Ashford', pop: 2000 } }]), 1);
    expect(res.rows[0].r.applied).toBe(true);
    expect(res.rows[0].r.settlementsWritten).toBe(1);
    expect(await ashPop()).toBe('2000');
    expect(await campTick()).toBe('1');

    await backlink();
    const b = await scalar(`select data #>> '{neighbourNetwork,0,linkId}' as l from public.settlements where id='${BARROW}'`);
    expect(b.l).toBe(LINK);
  });
});
