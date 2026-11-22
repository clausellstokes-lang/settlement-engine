/**
 * Executed SQL contract for migration 184.
 *
 * The real migrations run in in-process Postgres. These tests prove the
 * behavior that source inspection cannot: create+attach is one transaction,
 * attach-existing preserves settlement content while enforcing exclusive
 * membership across all supported campaign envelopes, retries replay, and a
 * changed reviewed topology writes nothing.
 */

import { PGlite } from '@electric-sql/pglite';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const journalMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/183_application_command_journal.sql',
), 'utf8');
const importMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/184_import_reconciliation_commands.sql',
), 'utf8');

const ALICE = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
const TARGET = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OLD_NESTED = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const OLD_UNWRAPPED = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const SAVE = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const CREATED = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
let db;

function entry() {
  return {
    name: 'Imported Ashford',
    tier: 'town',
    settlement: {
      name: 'Imported Ashford',
      tier: 'town',
      neighbourNetwork: [],
      neighborRelationship: null,
      interSettlementRelationships: [],
      importedFrom: {
        source: 'account-export',
        sourceChecksum: 'sf-import-v1:test-source',
        sourceId: 'source-save-1',
        importedAt: null,
      },
    },
    config: null,
    seed: null,
    aiData: {},
    campaignState: { phase: 'draft', eventLog: [] },
    versionHistory: [],
  };
}

async function asUser(ownerId, sql, params = []) {
  return db.transaction(async (transaction) => {
    await transaction.query(`set local role authenticated`);
    await transaction.query(
      `select set_config('test.uid', $1, true)`,
      [ownerId],
    );
    await transaction.query(
      `select set_config('request.jwt.claim.role', 'authenticated', true)`,
    );
    return transaction.query(sql, params);
  });
}

async function applyCommand({
  ownerId = ALICE,
  commandId = 'cmd:import-reconciliation:create',
  kind = 'import.settlement.create-and-attach',
  campaignId = TARGET,
  saveId = CREATED,
  checksum = 'sf-import-v1:test-source',
  sessionId = 'irs:test-source:target',
  expectedMemberships = [],
  importedEntry = entry(),
} = {}) {
  return asUser(
    ownerId,
    `select public.apply_import_reconciliation_command(
      $1::uuid,
      $2::text,
      $3::text,
      $4::uuid,
      $5::uuid,
      $6::text,
      $7::text,
      $8::jsonb,
      $9::jsonb
    ) as result`,
    [
      ownerId,
      commandId,
      kind,
      campaignId,
      saveId,
      checksum,
      sessionId,
      JSON.stringify(expectedMemberships),
      importedEntry == null ? null : JSON.stringify(importedEntry),
    ],
  );
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    do $roles$ begin
      if not exists (select from pg_roles where rolname = 'anon') then
        create role anon;
      end if;
      if not exists (select from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
      if not exists (select from pg_roles where rolname = 'service_role') then
        create role service_role;
      end if;
    end $roles$;

    create schema if not exists auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid()
    returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;
    create or replace function auth.role()
    returns text language sql stable as $fn$
      select coalesce(
        nullif(current_setting('request.jwt.claim.role', true), ''),
        current_user
      )
    $fn$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    grant execute on function auth.role() to authenticated;

    create table public.profiles (
      id uuid primary key references auth.users(id),
      banned_at timestamptz,
      disabled_at timestamptz,
      deleted_at timestamptz
    );
    create or replace function public.account_is_active(p_uid uuid)
    returns boolean language sql stable
    set search_path = public, pg_temp as $fn$
      select exists (
        select 1 from public.profiles
         where id = p_uid
           and banned_at is null
           and disabled_at is null
           and deleted_at is null
      )
    $fn$;
    create or replace function public.current_user_has_premium_access()
    returns boolean language sql stable
    set search_path = public, pg_temp as $fn$
      select public.account_is_active(auth.uid())
    $fn$;

    create table public.settlements (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      name text not null,
      tier text not null default 'town',
      data jsonb not null,
      config jsonb,
      toggles jsonb,
      seed text,
      neighbour_links jsonb,
      ai_data jsonb,
      campaign_state jsonb,
      version_history jsonb,
      access_state text not null default 'active',
      updated_at timestamptz not null default now()
    );
    create table public.saved_maps (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      name text not null,
      map_seed text,
      map_data jsonb,
      burg_settlement_map jsonb default '{}'::jsonb,
      supply_chain_config jsonb default '[]'::jsonb,
      access_state text not null default 'active',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
  await db.exec(journalMigration);
  await db.exec(importMigration);
}, 60_000);

beforeEach(async () => {
  await db.exec(`
    truncate public.application_command_journal;
    truncate public.saved_maps;
    truncate public.settlements;
    truncate public.profiles;
    truncate auth.users cascade;

    insert into auth.users (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.profiles (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.settlements (
      id, user_id, name, tier, data, campaign_state, ai_data, version_history
    ) values (
      '${SAVE}', '${ALICE}', 'Existing Bellweather', 'town',
      '{"name":"Existing Bellweather","privateFact":"preserve me"}',
      '{"phase":"canon","eventLog":[]}',
      '{}',
      '[]'
    );
    insert into public.saved_maps (id, user_id, name, map_data) values
      (
        '${TARGET}',
        '${ALICE}',
        'Target campaign',
        '{"kind":"settlementforge_campaign","version":2,"campaign":{"id":"${TARGET}","name":"Target campaign","settlementIds":[],"worldState":{"pendingEvents":[]},"unrelated":{"keep":true}}}'
      ),
      (
        '${OLD_NESTED}',
        '${ALICE}',
        'Nested legacy campaign',
        '{"campaign":{"id":"${OLD_NESTED}","name":"Nested legacy campaign","settlementIds":["${SAVE}"],"worldState":{"pendingEvents":[{"saveId":"${SAVE}","kind":"leave"},{"saveId":"other","kind":"keep"}]}}}'
      ),
      (
        '${OLD_UNWRAPPED}',
        '${ALICE}',
        'Unwrapped campaign',
        '{"id":"${OLD_UNWRAPPED}","name":"Unwrapped campaign","settlementIds":["${SAVE}"],"worldState":{"pendingEvents":[{"saveId":"${SAVE}","kind":"leave"}]},"regionalGraph":{"keep":true}}'
      );
  `);
});

describe('migration 184 import reconciliation commands', () => {
  test('atomically creates, attaches, journals, and replays without duplication', async () => {
    const first = await applyCommand();
    expect(first.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: false,
      receipt: {
        kind: 'import.settlement.create-and-attach',
        saveId: CREATED,
        campaignId: TARGET,
        created: true,
      },
      saveRow: {
        id: CREATED,
        name: 'Imported Ashford',
      },
    });
    expect(first.rows[0].result.campaignRows).toHaveLength(1);

    const replay = await applyCommand();
    expect(replay.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: true,
      receipt: { saveId: CREATED },
    });
    expect((await db.query(
      `select count(*)::integer as count
         from public.settlements where id = $1`,
      [CREATED],
    )).rows[0].count).toBe(1);
    const target = await db.query(
      `select map_data #> '{campaign,settlementIds}' as members
         from public.saved_maps where id = $1`,
      [TARGET],
    );
    expect(target.rows[0].members).toEqual([CREATED]);

    const journal = await db.query(
      `select receipt::text as receipt_text
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, 'cmd:import-reconciliation:create'],
    );
    expect(journal.rows[0].receipt_text).toContain('sf-import-v1:test-source');
    expect(journal.rows[0].receipt_text).not.toContain('Imported Ashford');
    expect(journal.rows[0].receipt_text).not.toContain('privateFact');
  });

  test('rehomes an existing save across nested and unwrapped campaigns', async () => {
    const response = await applyCommand({
      commandId: 'cmd:import-reconciliation:attach',
      kind: 'import.campaign.attach-existing',
      saveId: SAVE,
      expectedMemberships: [OLD_NESTED, OLD_UNWRAPPED],
      importedEntry: null,
    });
    expect(response.rows[0].result).toMatchObject({
      status: 'applied',
      receipt: {
        membershipPolicy: 'exclusive-rehome',
        previousCampaignIds: [OLD_NESTED, OLD_UNWRAPPED],
      },
    });

    const rows = await db.query(
      `select id, map_data from public.saved_maps order by id`,
    );
    const byId = new Map(rows.rows.map(row => [row.id, row.map_data]));
    expect(byId.get(TARGET).campaign.settlementIds).toEqual([SAVE]);
    expect(byId.get(TARGET).campaign.unrelated).toEqual({ keep: true });
    expect(byId.get(OLD_NESTED).campaign.settlementIds).toEqual([]);
    expect(byId.get(OLD_NESTED).campaign.worldState.pendingEvents).toEqual([
      { saveId: 'other', kind: 'keep' },
    ]);
    expect(byId.get(OLD_UNWRAPPED).settlementIds).toEqual([]);
    expect(byId.get(OLD_UNWRAPPED).worldState.pendingEvents).toEqual([]);
    expect(byId.get(OLD_UNWRAPPED).regionalGraph).toEqual({ keep: true });

    const save = await db.query(
      `select data from public.settlements where id = $1`,
      [SAVE],
    );
    expect(save.rows[0].data).toEqual({
      name: 'Existing Bellweather',
      privateFact: 'preserve me',
    });
  });

  test('changed membership topology finalizes stale and writes nothing', async () => {
    const before = await db.query(
      `select map_data from public.saved_maps order by id`,
    );
    const result = await applyCommand({
      commandId: 'cmd:import-reconciliation:stale',
      kind: 'import.campaign.attach-existing',
      saveId: SAVE,
      expectedMemberships: [OLD_NESTED],
      importedEntry: null,
    });
    expect(result.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'membership_topology_changed',
    });
    const after = await db.query(
      `select map_data from public.saved_maps order by id`,
    );
    expect(after.rows).toEqual(before.rows);
  });

  test('malformed campaign-shaped rows fail closed instead of being overwritten', async () => {
    await db.query(
      `update public.saved_maps
          set map_data = '{"kind":"settlementforge_campaign","version":2,"campaign":[]}'
        where id = $1`,
      [TARGET],
    );
    const result = await applyCommand({
      commandId: 'cmd:import-reconciliation:bad-shape',
    });
    expect(result.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'campaign_shape_unsupported',
    });
    expect((await db.query(
      `select count(*)::integer as count from public.settlements where id = $1`,
      [CREATED],
    )).rows[0].count).toBe(0);
  });

  test.each([
    ['non-string member', [SAVE, 7]],
    ['duplicate member', [SAVE, SAVE]],
    ['non-UUID member', [SAVE, 'legacy-local-id']],
  ])('malformed %s fails closed before membership mutation', async (_label, members) => {
    await db.query(
      `update public.saved_maps
          set map_data = jsonb_set(
            map_data,
            '{campaign,settlementIds}',
            $2::jsonb,
            false
          )
        where id = $1`,
      [OLD_NESTED, JSON.stringify(members)],
    );
    const before = await db.query(
      `select map_data from public.saved_maps order by id`,
    );
    const result = await applyCommand({
      commandId: `cmd:import-reconciliation:bad-member:${_label}`,
      kind: 'import.campaign.attach-existing',
      saveId: SAVE,
      expectedMemberships: [OLD_NESTED, OLD_UNWRAPPED],
      importedEntry: null,
    });
    expect(result.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'campaign_membership_invalid',
    });
    const after = await db.query(
      `select map_data from public.saved_maps order by id`,
    );
    expect(after.rows).toEqual(before.rows);
  });

  test('same command id with different content conflicts and never replaces the first', async () => {
    await applyCommand();
    const conflict = await applyCommand({
      importedEntry: {
        ...entry(),
        name: 'Different source content',
        settlement: {
          ...entry().settlement,
          name: 'Different source content',
        },
      },
    });
    expect(conflict.rows[0].result).toMatchObject({
      status: 'conflict',
      reason: 'command_id_conflict',
    });
    expect((await db.query(
      `select name from public.settlements where id = $1`,
      [CREATED],
    )).rows[0].name).toBe('Imported Ashford');
  });

  test('service health exposes unresolved command authority without row content', async () => {
    await db.query(
      `insert into public.application_command_journal (
        owner_id, command_id, fingerprint, kind, status, phase, updated_at
      ) values (
        $1, 'cmd:import-reconcile', $2,
        'import.campaign.attach-existing',
        'reconcile-required', 'reconcile', now()
      )`,
      [ALICE, 'f'.repeat(64)],
    );
    await db.query(
      `select set_config('request.jwt.claim.role', 'service_role', false)`,
    );
    const health = await db.query(
      `select public.report_application_command_health(30) as health`,
    );
    expect(health.rows[0].health).toMatchObject({
      healthy: false,
      severity: 'critical',
      reconcileRequired: 1,
      importReconcileRequired: 1,
    });
  });
});
