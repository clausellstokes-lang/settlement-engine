/**
 * Production surface: migration 179's real owner-delete policies, batch RPC, and
 * active-account write/spend guards, executed in PGlite with migration 057's
 * account predicate.
 *
 * Active downgraded owners may erase retained data. Cross-owner batches and
 * inactive-account writes/spends are the negative controls and must change no row.
 */
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migrations = resolve(process.cwd(), 'supabase', 'migrations');
const migration057 = readFileSync(
  resolve(migrations, '057_enforce_account_status_writes.sql'),
  'utf8',
);
const migration179 = readFileSync(
  resolve(migrations, '179_owner_confirmed_privacy_deletes.sql'),
  'utf8',
);

function extractFunction(source, name) {
  const match = source.match(new RegExp(
    `^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`,
    'im',
  ));
  if (!match) throw new Error(`missing function ${name}`);
  return match[0];
}

function extractPolicy(source, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(
    `^create\\s+policy\\s+"${escaped}"[\\s\\S]*?;\\s*\\n`,
    'im',
  ));
  if (!match) throw new Error(`missing policy ${title}`);
  return match[0];
}

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const SAVE_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SAVE_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const MAP_A = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

let db;
const asUser = (userId, sql) => db.exec(
  `set role app_user; set test.uid = '${userId}'; set test.role = 'authenticated'; ${sql}`,
);
const asSuper = (sql) => db.exec(`reset role; ${sql}`);
const count = async (table, id) => {
  await db.exec('reset role;');
  const { rows } = await db.query(
    `select count(*)::int as n from public.${table} where id = $1`,
    [id],
  );
  return rows[0].n;
};

describe('migration 179 owner-confirmed privacy deletes', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema auth;
      create or replace function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('test.uid', true), '')::uuid
      $$;
      create or replace function auth.role() returns text language sql stable as $$
        select coalesce(nullif(current_setting('test.role', true), ''), 'authenticated')
      $$;
      create or replace function public.current_user_has_premium_access()
      returns boolean language sql stable as $$
        select false
      $$;

      create table public.profiles (
        id uuid primary key,
        role text default 'user',
        banned_at timestamptz,
        disabled_at timestamptz,
        deleted_at timestamptz
      );
      create table public.settlements (
        id uuid primary key,
        user_id uuid not null,
        name text,
        tier text,
        data jsonb,
        config jsonb,
        toggles jsonb,
        seed text,
        neighbour_links jsonb,
        ai_data jsonb default '{}'::jsonb,
        campaign_state jsonb,
        version_history jsonb,
        access_state text not null default 'active'
      );
      create table public.saved_maps (
        id uuid primary key,
        user_id uuid not null,
        access_state text not null default 'active'
      );
      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null,
        kind text not null,
        amount int not null,
        source text not null
      );

      alter table public.settlements enable row level security;
      alter table public.settlements force row level security;
      alter table public.saved_maps enable row level security;
      alter table public.saved_maps force row level security;
      create policy "owner reads settlements" on public.settlements
        for select using (auth.uid() = user_id);
      create policy "owner reads maps" on public.saved_maps
        for select using (auth.uid() = user_id);

      create role app_user nologin;
      grant usage on schema public to app_user;
      grant select, insert, update, delete on
        public.settlements, public.saved_maps, public.credit_ledger
        to app_user;
    `);

    await db.exec(extractFunction(migration057, 'account_is_active'));
    await db.exec(extractPolicy(
      migration179,
      'Users delete active own settlements',
    ));
    await db.exec(extractPolicy(
      migration179,
      'Premium users delete active own maps',
    ));
    await db.exec(extractFunction(
      migration179,
      'enforce_account_active_write',
    ));
    await db.exec(extractFunction(
      migration179,
      'enforce_active_credit_spend_insert',
    ));
    await db.exec(extractFunction(
      migration179,
      'mutate_settlement_batch',
    ));
    await db.exec(`
      create trigger trg_enforce_account_active_settlements
        before insert or update or delete on public.settlements
        for each row execute function public.enforce_account_active_write();
      create trigger trg_enforce_account_active_saved_maps
        before insert or update or delete on public.saved_maps
        for each row execute function public.enforce_account_active_write();
      create trigger trg_enforce_active_credit_spend
        before insert on public.credit_ledger
        for each row when (new.kind = 'spend')
        execute function public.enforce_active_credit_spend_insert();
      create or replace function public.test_insert_spend(p_user uuid)
      returns void language plpgsql security definer
      set search_path = public, pg_temp as $$
      begin
        insert into public.credit_ledger(user_id, kind, amount, source)
        values (p_user, 'spend', 1, 'test');
      end
      $$;
      grant execute on function public.test_insert_spend(uuid) to app_user;
      grant execute on function public.mutate_settlement_batch(
        uuid, jsonb, uuid[], jsonb
      ) to app_user;
    `);
  }, 30_000);

  beforeEach(async () => {
    await asSuper(`
      truncate public.credit_ledger, public.saved_maps, public.settlements,
        public.profiles;
      insert into public.profiles(id) values ('${A}'), ('${B}');
      insert into public.settlements(id, user_id, access_state)
      values
        ('${SAVE_A}', '${A}', 'inactive_plan'),
        ('${SAVE_B}', '${B}', 'inactive_plan');
      insert into public.saved_maps(id, user_id, access_state)
      values ('${MAP_A}', '${A}', 'inactive_plan');
      set test.role = 'authenticated';
    `);
  });

  it('lets an active downgraded owner erase retained settlements and maps', async () => {
    await asUser(A, `
      delete from public.settlements where id = '${SAVE_A}';
      delete from public.saved_maps where id = '${MAP_A}';
    `);
    expect(await count('settlements', SAVE_A)).toBe(0);
    expect(await count('saved_maps', MAP_A)).toBe(0);
    expect(await count('settlements', SAVE_B)).toBe(1);
  });

  it('keeps a soft-deleted account from using the privacy policy as a write door', async () => {
    await asSuper(
      `update public.profiles set deleted_at = now() where id = '${A}';`,
    );
    await asUser(A, `delete from public.settlements where id = '${SAVE_A}';`);
    expect(await count('settlements', SAVE_A)).toBe(1);
  });

  it('rejects an A-expected batch sent under B and leaves B untouched', async () => {
    await asUser(B, '');
    await expect(db.query(
      `select public.mutate_settlement_batch(
        $1::uuid,
        '[]'::jsonb,
        array[$2::uuid],
        '[]'::jsonb
      )`,
      [A, SAVE_B],
    )).rejects.toThrow(/auth session changed/i);
    expect(await count('settlements', SAVE_B)).toBe(1);
  });

  it('batch privacy deletion removes an owned inactive_plan row exactly once', async () => {
    await asUser(A, '');
    const { rows } = await db.query(
      `select public.mutate_settlement_batch(
        $1::uuid,
        '[]'::jsonb,
        array[$2::uuid],
        '[]'::jsonb
      ) as affected`,
      [A, SAVE_A],
    );
    expect(rows[0].affected).toBe(1);
    expect(await count('settlements', SAVE_A)).toBe(0);
  });

  it('the authoritative spend-row trigger blocks inactive-account debit', async () => {
    await asSuper(
      `update public.profiles set disabled_at = now() where id = '${A}';`,
    );
    await asUser(A, '');
    await expect(
      db.query(`select public.test_insert_spend($1::uuid)`, [A]),
    ).rejects.toThrow(/account is not active/i);
    await asSuper('');
    const { rows } = await db.query(
      `select count(*)::int as n from public.credit_ledger`,
    );
    expect(rows[0].n).toBe(0);
  });
});
