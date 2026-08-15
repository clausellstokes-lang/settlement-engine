/**
 * Executed SQL contract for migration 186.
 *
 * The browser can review a binding change, but only PostgreSQL can serialize
 * two devices against the same saved-map envelope. These tests run the real
 * migration and prove atomic expected-hash comparison, narrow JSON patching,
 * durable replay, stale-winner projection, owner isolation, and the trigger
 * wall that prevents an older whole-envelope upsert from undoing the CAS.
 */

import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import { fingerprintContent } from '../../src/domain/content/contentFingerprint.js';
import {
  makeCampaignContentBindingCasCommand,
} from '../../src/lib/campaignContentBindingCas.js';

const commandJournalMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/183_application_command_journal.sql',
), 'utf8');
const bindingCasMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/186_campaign_content_binding_cas.sql',
), 'utf8');

const ALICE = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
const CAMPAIGN = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const FOREIGN_CAMPAIGN = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const CREATED_AT = '2026-07-25T12:00:00.000Z';
let db;

function binding(tunables = {}) {
  return makeCampaignContentBinding({}, {
    source: 'test',
    tunables,
  });
}

const BINDING_A = binding({ magicExists: false });
const BINDING_B = binding({ magicExists: true });
const BINDING_C = binding({
  magicExists: false,
  priorityEconomy: 72,
});

function command(
  current,
  target,
  suffix,
  campaignId = CAMPAIGN,
  history = [current, target],
) {
  return makeCampaignContentBindingCasCommand({
    campaignId,
    expectedBindingHash: current.bindingHash,
    targetBinding: target,
    contentBindingHistory: history,
    previewFingerprint: fingerprintContent({
      campaignId: CAMPAIGN,
      current: current.bindingHash,
      target: target.bindingHash,
      suffix,
    }),
  });
}

function campaignEnvelope(id, activeBinding = BINDING_A, history = []) {
  return {
    kind: 'settlementforge_campaign',
    version: 2,
    campaign: {
      id,
      name: 'Content Realm',
      settlementIds: [],
      mapState: { schemaVersion: 2, marker: 'preserve-me' },
      regionalGraph: { nodes: [] },
      contentBinding: activeBinding,
      contentBindingHistory: history,
      contentBindingStatus: 'pinned',
      unrelated: { survives: true },
      updatedAt: CREATED_AT,
    },
    envelopeMetadata: { survives: true },
  };
}

async function asUser(ownerId, sql, params = []) {
  return db.transaction(async (transaction) => {
    await transaction.query(
      `select set_config('test.uid', $1, true)`,
      [ownerId],
    );
    await transaction.query('set local role authenticated');
    return transaction.query(sql, params);
  });
}

async function applyCommand(input, ownerId = ALICE) {
  return asUser(
    ownerId,
    `select public.compare_and_swap_campaign_content_binding(
      $1::uuid,
      $2::text,
      $3::text,
      $4::uuid,
      $5::text,
      $6::jsonb,
      $7::jsonb
    ) as result`,
    [
      ownerId,
      input.commandId,
      input.fingerprint,
      input.campaignId,
      input.expectedBindingHash,
      JSON.stringify(input.targetBinding),
      JSON.stringify(input.contentBindingHistory),
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
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;

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
      select auth.uid() is not null
    $fn$;

    create table public.settlements (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      name text not null,
      data jsonb not null,
      campaign_state jsonb,
      ai_data jsonb,
      neighbour_links jsonb,
      access_state text not null default 'active',
      updated_at timestamptz not null
    );
    create table public.saved_maps (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      name text not null,
      map_data jsonb not null,
      access_state text not null default 'active',
      updated_at timestamptz not null
    );
    alter table public.saved_maps enable row level security;
    create policy "Owners read saved maps"
      on public.saved_maps for select
      using (auth.uid() = user_id);
    create policy "Owners update saved maps"
      on public.saved_maps for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
    grant select, update on public.saved_maps to authenticated;

    create or replace function public._content_canonical_json(p_value jsonb)
    returns text
    language plpgsql
    immutable
    strict
    set search_path = public, pg_temp
    as $fn$
    declare
      v_type text := jsonb_typeof(p_value);
      v_result text;
    begin
      if v_type = 'object' then
        select '{' || coalesce(string_agg(
          to_jsonb(entry.key)::text
            || ':'
            || public._content_canonical_json(entry.value),
          ',' order by entry.key collate "C"
        ), '') || '}'
          into v_result
          from jsonb_each(p_value) as entry;
        return v_result;
      elsif v_type = 'array' then
        select '[' || coalesce(string_agg(
          public._content_canonical_json(entry.value),
          ',' order by entry.ordinal
        ), '') || ']'
          into v_result
          from jsonb_array_elements(p_value)
            with ordinality as entry(value, ordinal);
        return v_result;
      end if;
      return p_value::text;
    end;
    $fn$;
    create or replace function public._content_sha256(p_value jsonb)
    returns text language sql immutable strict
    set search_path = public, pg_temp as $fn$
      select encode(sha256(convert_to(
        public._content_canonical_json(p_value),
        'UTF8'
      )), 'hex')
    $fn$;
    create or replace function public._content_environment_valid(
      p_environment jsonb
    )
    returns boolean language sql immutable
    set search_path = public, pg_temp as $fn$
      select jsonb_typeof(p_environment) = 'object'
        and jsonb_typeof(p_environment -> 'packVersions') = 'array'
        and jsonb_typeof(p_environment -> 'directDefinitions') = 'array'
        and jsonb_typeof(p_environment -> 'tunables') = 'object'
        and jsonb_typeof(p_environment -> 'visualSelection') = 'object'
        and public._content_sha256(
          (p_environment - 'environmentHash') - 'createdAt'
        ) = p_environment ->> 'environmentHash'
    $fn$;
    create or replace function public._custom_content_record_valid(
      p_category text,
      p_data jsonb
    )
    returns boolean language sql immutable
    set search_path = public, pg_temp as $fn$
      select p_category is not null
        and jsonb_typeof(p_data) = 'object'
    $fn$;
  `);
  await db.exec(commandJournalMigration);
  await db.exec(bindingCasMigration);
}, 60_000);

beforeEach(async () => {
  await db.exec(`
    truncate public.application_command_journal;
    truncate public.saved_maps;
    truncate public.profiles;
    truncate auth.users cascade;

    insert into auth.users (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.profiles (id) values ('${ALICE}'), ('${MALLORY}');
  `);
  await db.query(
    `insert into public.saved_maps (
      id, user_id, name, map_data, access_state, updated_at
    ) values
      ($1, $2, 'Content Realm', $3::jsonb, 'active', $4),
      ($5, $6, 'Foreign Realm', $7::jsonb, 'active', $4)`,
    [
      CAMPAIGN,
      ALICE,
      JSON.stringify(campaignEnvelope(CAMPAIGN)),
      CREATED_AT,
      FOREIGN_CAMPAIGN,
      MALLORY,
      JSON.stringify(campaignEnvelope(FOREIGN_CAMPAIGN)),
    ],
  );
});

describe('migration 186 campaign content binding CAS', () => {
  test('exposes only the exact authenticated CAS RPC', async () => {
    const functions = await db.query(
      `select pronargs, pronargdefaults
         from pg_proc
         join pg_namespace on pg_namespace.oid = pg_proc.pronamespace
        where pg_namespace.nspname = 'public'
          and pg_proc.proname =
            'compare_and_swap_campaign_content_binding'`,
    );
    expect(functions.rows).toEqual([{
      pronargs: 7,
      pronargdefaults: 0,
    }]);
    const privileges = await db.query(
      `select
        has_function_privilege(
          'authenticated',
          'public.compare_and_swap_campaign_content_binding(uuid,text,text,uuid,text,jsonb,jsonb)',
          'execute'
        ) as rpc,
        has_function_privilege(
          'authenticated',
          'public._campaign_content_binding_valid(jsonb)',
          'execute'
        ) as helper,
        has_function_privilege(
          'authenticated',
          'public.enforce_campaign_content_binding_cas()',
          'execute'
        ) as trigger_function`,
    );
    expect(privileges.rows[0]).toEqual({
      rpc: true,
      helper: false,
      trigger_function: false,
    });
  });

  test('atomically patches only binding-owned paths and replays exactly', async () => {
    const reviewed = command(BINDING_A, BINDING_B, 'first');
    const first = await applyCommand(reviewed);

    expect(first.rows[0].result).toMatchObject({
      schemaVersion: 1,
      status: 'applied',
      replayed: false,
      campaignId: CAMPAIGN,
      previousBindingHash: BINDING_A.bindingHash,
      bindingHash: BINDING_B.bindingHash,
    });
    const rowAfterFirst = await db.query(
      `select map_data, updated_at
         from public.saved_maps
        where id = $1`,
      [CAMPAIGN],
    );
    expect(rowAfterFirst.rows[0].map_data).toMatchObject({
      envelopeMetadata: { survives: true },
      campaign: {
        name: 'Content Realm',
        mapState: { marker: 'preserve-me' },
        unrelated: { survives: true },
        contentBinding: BINDING_B,
        contentBindingHistory: [BINDING_A, BINDING_B],
      },
    });
    const committedAt = rowAfterFirst.rows[0].updated_at.toISOString();

    const replay = await applyCommand(reviewed);
    expect(replay.rows[0].result).toMatchObject({
      status: 'applied',
      replayed: true,
      bindingHash: BINDING_B.bindingHash,
    });
    const afterReplay = await db.query(
      `select updated_at from public.saved_maps where id = $1`,
      [CAMPAIGN],
    );
    expect(afterReplay.rows[0].updated_at.toISOString()).toBe(committedAt);
  });

  test('returns the winning remote binding to a stale second device', async () => {
    await applyCommand(command(BINDING_A, BINDING_B, 'winner'));
    const staleCommand = command(BINDING_A, BINDING_C, 'loser');
    const stale = await applyCommand(staleCommand);

    expect(stale.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'campaign_content_binding_conflict',
      expectedBindingHash: BINDING_A.bindingHash,
      actualBindingHash: BINDING_B.bindingHash,
      remoteBinding: BINDING_B,
      remoteBindingHistory: [BINDING_A, BINDING_B],
    });
    const persisted = await db.query(
      `select map_data #> '{campaign,contentBinding}' as binding
         from public.saved_maps where id = $1`,
      [CAMPAIGN],
    );
    expect(persisted.rows[0].binding).toEqual(BINDING_B);

    await applyCommand(command(
      BINDING_B,
      BINDING_A,
      'later-winner',
      CAMPAIGN,
      [BINDING_A, BINDING_B],
    ));
    const replay = await applyCommand(staleCommand);
    expect(replay.rows[0].result).toMatchObject({
      status: 'stale',
      replayed: true,
      actualBindingHash: BINDING_A.bindingHash,
      remoteBinding: BINDING_A,
      remoteBindingHistory: [BINDING_A, BINDING_B],
    });
  });

  test('rejects later blind binding changes but permits unrelated map writes', async () => {
    await applyCommand(command(BINDING_A, BINDING_B, 'protected'));

    await expect(asUser(
      ALICE,
      `update public.saved_maps
          set map_data = jsonb_set(
            map_data,
            '{campaign,contentBinding}',
            $2::jsonb,
            false
          )
        where id = $1`,
      [CAMPAIGN, JSON.stringify(BINDING_C)],
    )).rejects.toThrow(/requires compare-and-swap/i);

    await expect(db.transaction(async (transaction) => {
      await transaction.query(
        `select set_config('test.uid', $1, true)`,
        [ALICE],
      );
      await transaction.query('set local role authenticated');
      // Arbitrary custom GUCs are user-settable and therefore must never act
      // as the trigger capability.
      await transaction.query(
        `select set_config(
          'settlementforge.campaign_content_binding_cas',
          'on',
          true
        )`,
      );
      return transaction.query(
        `update public.saved_maps
            set map_data = jsonb_set(
              map_data,
              '{campaign,contentBinding}',
              $2::jsonb,
              false
            )
          where id = $1`,
        [CAMPAIGN, JSON.stringify(BINDING_C)],
      );
    })).rejects.toThrow(/requires compare-and-swap/i);

    await asUser(
      ALICE,
      `update public.saved_maps
          set map_data = jsonb_set(
            map_data,
            '{campaign,mapState,marker}',
            '"new-marker"'::jsonb,
            false
          )
        where id = $1`,
      [CAMPAIGN],
    );
    const row = await db.query(
      `select map_data #>> '{campaign,mapState,marker}' as marker,
              map_data #>> '{campaign,contentBinding,bindingHash}' as hash
         from public.saved_maps where id = $1`,
      [CAMPAIGN],
    );
    expect(row.rows[0]).toEqual({
      marker: 'new-marker',
      hash: BINDING_B.bindingHash,
    });
  });

  test('detects binding-hash ABA without truncating immutable history', async () => {
    await applyCommand(command(BINDING_A, BINDING_B, 'aba-a-b'));
    await applyCommand(command(
      BINDING_B,
      BINDING_C,
      'aba-b-c',
      CAMPAIGN,
      [BINDING_A, BINDING_B, BINDING_C],
    ));
    await applyCommand(command(
      BINDING_C,
      BINDING_B,
      'aba-c-b',
      CAMPAIGN,
      [BINDING_A, BINDING_B, BINDING_C],
    ));

    const staleHistory = await applyCommand(command(
      BINDING_B,
      BINDING_A,
      'aba-stale-b-a',
      CAMPAIGN,
      [BINDING_A, BINDING_B],
    ));

    expect(staleHistory.rows[0].result).toMatchObject({
      status: 'stale',
      reason: 'campaign_content_binding_history_conflict',
      expectedBindingHash: BINDING_B.bindingHash,
      actualBindingHash: BINDING_B.bindingHash,
      remoteBinding: BINDING_B,
      remoteBindingHistory: [BINDING_A, BINDING_B, BINDING_C],
    });
    const persisted = await db.query(
      `select map_data #> '{campaign,contentBindingHistory}' as history
         from public.saved_maps where id = $1`,
      [CAMPAIGN],
    );
    expect(persisted.rows[0].history).toEqual([
      BINDING_A,
      BINDING_B,
      BINDING_C,
    ]);
  });

  test('does not let one owner mutate or enumerate another owner campaign', async () => {
    const foreignTarget = command(
      BINDING_A,
      BINDING_B,
      'foreign',
      FOREIGN_CAMPAIGN,
    );
    const response = await applyCommand(foreignTarget);

    expect(response.rows[0].result).toMatchObject({
      status: 'failed',
      reason: 'campaign_content_campaign_unavailable',
    });
    const foreign = await db.query(
      `select map_data #>> '{campaign,contentBinding,bindingHash}' as hash
         from public.saved_maps where id = $1`,
      [FOREIGN_CAMPAIGN],
    );
    expect(foreign.rows[0].hash).toBe(BINDING_A.bindingHash);

    await expect(asUser(
      MALLORY,
      `select public.compare_and_swap_campaign_content_binding(
        $1, $2, $3, $4, $5, $6, $7
      )`,
      [
        ALICE,
        foreignTarget.commandId,
        foreignTarget.fingerprint,
        FOREIGN_CAMPAIGN,
        foreignTarget.expectedBindingHash,
        JSON.stringify(foreignTarget.targetBinding),
        JSON.stringify(foreignTarget.contentBindingHistory),
      ],
    )).rejects.toThrow(/owner changed/i);
  });

  test('rejects a malformed target before claiming command identity', async () => {
    const reviewed = command(BINDING_A, BINDING_B, 'malformed');
    const malformedTarget = {
      ...BINDING_B,
      source: 42,
    };

    await expect(asUser(
      ALICE,
      `select public.compare_and_swap_campaign_content_binding(
        $1, $2, $3, $4, $5, $6, $7
      )`,
      [
        ALICE,
        reviewed.commandId,
        reviewed.fingerprint,
        CAMPAIGN,
        reviewed.expectedBindingHash,
        JSON.stringify(malformedTarget),
        JSON.stringify(reviewed.contentBindingHistory),
      ],
    )).rejects.toThrow(/invalid campaign content binding command/i);

    const journal = await db.query(
      `select count(*)::integer as count
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [ALICE, reviewed.commandId],
    );
    expect(journal.rows[0].count).toBe(0);
  });

  test('allows one legacy null bootstrap and protects it afterward', async () => {
    const legacyEnvelope = campaignEnvelope(CAMPAIGN, BINDING_A);
    delete legacyEnvelope.campaign.contentBinding;
    delete legacyEnvelope.campaign.contentBindingHistory;
    await db.query(`delete from public.saved_maps where id = $1`, [CAMPAIGN]);
    await db.query(
      `insert into public.saved_maps (
        id, user_id, name, map_data, access_state, updated_at
      ) values ($1, $2, 'Legacy Realm', $3::jsonb, 'active', $4)`,
      [CAMPAIGN, ALICE, JSON.stringify(legacyEnvelope), CREATED_AT],
    );
    await asUser(
      ALICE,
      `update public.saved_maps
          set map_data = jsonb_set(
            jsonb_set(
              map_data,
              '{campaign,contentBinding}',
              $2::jsonb,
              true
            ),
            '{campaign,contentBindingHistory}',
            '[]'::jsonb,
            true
          )
        where id = $1`,
      [CAMPAIGN, JSON.stringify(BINDING_A)],
    );

    await expect(asUser(
      ALICE,
      `update public.saved_maps
          set map_data = jsonb_set(
            map_data,
            '{campaign,contentBinding}',
            $2::jsonb,
            false
          )
        where id = $1`,
      [CAMPAIGN, JSON.stringify(BINDING_B)],
    )).rejects.toThrow(/requires compare-and-swap/i);
  });
});
