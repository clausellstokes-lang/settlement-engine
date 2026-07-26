/**
 * Adversarial migration-188 quarantine receipt reuse.
 *
 * Quarantine is a destructive migration: it may remove false reviewed
 * authority only after the exact source evidence has been durably journaled.
 * A pre-existing command row that merely repeats the expected hash, status, and
 * reason is not that evidence. These fixtures preserve the original campaign
 * or definition while proving that a substituted receipt body aborts the whole
 * migration transaction.
 */

import {
  describe,
  expect,
  test,
} from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const migration = name => readFileSync(resolve(
  process.cwd(),
  `supabase/migrations/${name}`,
), 'utf8');
const BEFORE_188 = [
  '183_application_command_journal.sql',
  '185_custom_content_versions.sql',
  '186_campaign_content_binding_cas.sql',
  '187_custom_content_archive_transfer.sql',
].map(migration);
const MIGRATION_188 = migration('188_reviewed_supply_chain_persistence.sql');

const OWNER = '11111111-1111-4111-8111-111111111111';
const LEGACY_MAP = '61000000-0000-4000-8000-000000000001';
const LEGACY_DEFINITION = '41000000-0000-4000-8000-000000000001';
const LEGACY_REVISION = '42000000-0000-4000-8000-000000000001';
const CAMPAIGN_COMMAND =
  `legacy:reviewed-campaign-quarantine:${LEGACY_MAP}`;
const DEFINITION_COMMAND =
  `legacy:reviewed-supply-chain-quarantine:${LEGACY_DEFINITION}`;

async function createPre188Database() {
  const database = new PGlite();
  await database.exec(`
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
    returns uuid language sql stable as $function$
      select nullif(current_setting('test.uid', true), '')::uuid
    $function$;
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
    set search_path = public, pg_temp as $function$
      select exists (
        select 1
          from public.profiles
         where id = p_uid
           and banned_at is null
           and disabled_at is null
           and deleted_at is null
      )
    $function$;
    create or replace function public.current_user_has_premium_access()
    returns boolean language sql stable
    set search_path = public, pg_temp as $function$
      select auth.uid() is not null
    $function$;

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
      name text not null default 'Realm',
      map_data jsonb not null default '{}'::jsonb,
      access_state text not null default 'active',
      updated_at timestamptz not null default now()
    );
    alter table public.saved_maps enable row level security;
    create policy "Owners read saved maps"
      on public.saved_maps for select
      using (auth.uid() = user_id);
    create policy "Owners update saved maps"
      on public.saved_maps for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
    create policy "Owners insert saved maps"
      on public.saved_maps for insert
      with check (auth.uid() = user_id);
    grant select, insert, update on public.saved_maps to authenticated;

    create table public.custom_content (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      category text not null,
      data jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    alter table public.custom_content enable row level security;
    grant select, insert, update, delete
      on table public.custom_content to authenticated, service_role;

    insert into auth.users (id) values ('${OWNER}');
    insert into public.profiles (id) values ('${OWNER}');
  `);
  for (const sql of BEFORE_188) await database.exec(sql);
  return database;
}

async function seedLegacyCampaign(database) {
  const mapData = {
    campaign: {
      contentBinding: {
        resolvedDefinitions: [{
          category: 'supplyChains',
          definitionId: LEGACY_DEFINITION,
          revisionId: LEGACY_REVISION,
        }],
      },
      contentBindingHistory: [],
      contentBindingStatus: 'pinned',
    },
  };
  await database.exec(`
    alter table public.saved_maps
      disable trigger trg_saved_maps_campaign_content_binding_cas
  `);
  await database.query(
    `insert into public.saved_maps (
       id, user_id, name, map_data
     ) values ($1, $2, 'Corrupt quarantine campaign', $3::jsonb)`,
    [LEGACY_MAP, OWNER, JSON.stringify(mapData)],
  );
  await database.exec(`
    alter table public.saved_maps
      enable trigger trg_saved_maps_campaign_content_binding_cas
  `);
  return mapData;
}

async function campaignQuarantinePayload(database) {
  const response = await database.query(
    `select jsonb_build_object(
       'schemaVersion', 1,
       'reason', 'legacy_reviewed_campaign_binding_requires_review',
       'savedMap', to_jsonb(saved_map)
     ) as payload
       from public.saved_maps saved_map
      where saved_map.user_id = $1 and saved_map.id = $2`,
    [OWNER, LEGACY_MAP],
  );
  return response.rows[0].payload;
}

async function seedLegacyDefinition(database) {
  await database.query(
    `insert into public.custom_content_definitions (
       id, owner_id, category, local_uid
     ) values ($1, $2, 'supplyChains', 'legacy-chain')`,
    [LEGACY_DEFINITION, OWNER],
  );
  await database.query(
    `insert into public.custom_content_revisions (
       id, owner_id, definition_id, revision_no, schema_version,
       content_hash, data
     ) values ($1, $2, $3, 1, 1, $4, $5::jsonb)`,
    [
      LEGACY_REVISION,
      OWNER,
      LEGACY_DEFINITION,
      '7'.repeat(64),
      JSON.stringify({ chainId: 'legacy-chain' }),
    ],
  );
  await database.query(
    `update public.custom_content_definitions
        set head_revision_id = $1
      where owner_id = $2 and id = $3`,
    [LEGACY_REVISION, OWNER, LEGACY_DEFINITION],
  );
}

async function definitionQuarantinePayload(database) {
  const response = await database.query(
    `select jsonb_build_object(
       'schemaVersion', 1,
       'reason', 'legacy_reviewed_supply_chain_requires_review',
       'definition', to_jsonb(definition),
       'revisions', (
         select coalesce(jsonb_agg(
           to_jsonb(revision)
           order by revision.revision_no
         ), '[]'::jsonb)
           from public.custom_content_revisions revision
          where revision.owner_id = definition.owner_id
            and revision.definition_id = definition.id
       ),
       'referencedPackState', jsonb_build_object(
         'entryDefinitions', '[]'::jsonb,
         'versionEntries', '[]'::jsonb,
         'versions', '[]'::jsonb,
         'packs', '[]'::jsonb
       ),
       'referencedEnvironmentState', jsonb_build_object(
         'environments', '[]'::jsonb,
         'revisions', '[]'::jsonb,
         'activations', '[]'::jsonb
       )
     ) as payload
       from public.custom_content_definitions definition
      where definition.owner_id = $1 and definition.id = $2`,
    [OWNER, LEGACY_DEFINITION],
  );
  return response.rows[0].payload;
}

async function seedCorruptReceipt(database, {
  commandId,
  fingerprintPayload,
  kind,
  targetId,
  reason,
}) {
  const corruptPayload = {
    schemaVersion: 1,
    reason,
    substitutedEvidence: true,
  };
  const fingerprint = (await database.query(
    `select public._content_sha256($1::jsonb) as fingerprint`,
    [JSON.stringify(fingerprintPayload)],
  )).rows[0].fingerprint;
  await database.query(
    `insert into public.application_command_journal (
       owner_id, command_id, fingerprint, kind, target_id,
       phase, status, receipt, claimed_at, finalized_at, updated_at
     ) values (
       $1, $2, $3, $4, $5,
       'finalized', 'applied', $6::jsonb, now(), now(), now()
     )`,
    [
      OWNER,
      commandId,
      fingerprint,
      kind,
      targetId,
      JSON.stringify({
        ok: true,
        status: 'applied',
        commandId,
        fingerprint,
        reason: reason.replace('_requires_review', '_quarantined'),
        replayed: false,
        result: { quarantine: corruptPayload },
        perEntry: [],
      }),
    ],
  );
  return corruptPayload;
}

describe('migration 188 quarantine conflict integrity', () => {
  test('a substituted campaign receipt aborts and preserves the saved map', async () => {
    const database = await createPre188Database();
    try {
      const originalMapData = await seedLegacyCampaign(database);
      const payload = await campaignQuarantinePayload(database);
      const corruptPayload = await seedCorruptReceipt(database, {
        commandId: CAMPAIGN_COMMAND,
        fingerprintPayload: payload,
        kind:
          'content.reviewed-supply-chain.legacy-campaign-quarantine',
        targetId: LEGACY_MAP,
        reason: 'legacy_reviewed_campaign_binding_requires_review',
      });

      await expect(database.exec(MIGRATION_188)).rejects.toMatchObject({
        code: '55000',
        message: expect.stringMatching(
          /legacy reviewed campaign quarantine conflict/i,
        ),
      });
      const preserved = await database.query(
        `select map_data
           from public.saved_maps
          where user_id = $1 and id = $2`,
        [OWNER, LEGACY_MAP],
      );
      const journal = await database.query(
        `select receipt #> '{result,quarantine}' as quarantine
           from public.application_command_journal
          where owner_id = $1 and command_id = $2`,
        [OWNER, CAMPAIGN_COMMAND],
      );
      expect(preserved.rows[0].map_data).toEqual(originalMapData);
      expect(journal.rows[0].quarantine).toEqual(corruptPayload);
    } finally {
      await database.close();
    }
  }, 30_000);

  test('a substituted definition receipt aborts and preserves its graph', async () => {
    const database = await createPre188Database();
    try {
      await seedLegacyDefinition(database);
      const payload = await definitionQuarantinePayload(database);
      const corruptPayload = await seedCorruptReceipt(database, {
        commandId: DEFINITION_COMMAND,
        fingerprintPayload: payload,
        kind: 'content.reviewed-supply-chain.legacy-quarantine',
        targetId: LEGACY_DEFINITION,
        reason: 'legacy_reviewed_supply_chain_requires_review',
      });

      await expect(database.exec(MIGRATION_188)).rejects.toMatchObject({
        code: '55000',
        message: expect.stringMatching(
          /legacy reviewed supply-chain quarantine conflict/i,
        ),
      });
      const preserved = await database.query(
        `select
           definition.head_revision_id::text,
           count(revision.*)::integer as revision_count
           from public.custom_content_definitions definition
           join public.custom_content_revisions revision
             on revision.owner_id = definition.owner_id
            and revision.definition_id = definition.id
          where definition.owner_id = $1 and definition.id = $2
          group by definition.head_revision_id`,
        [OWNER, LEGACY_DEFINITION],
      );
      const journal = await database.query(
        `select receipt #> '{result,quarantine}' as quarantine
           from public.application_command_journal
          where owner_id = $1 and command_id = $2`,
        [OWNER, DEFINITION_COMMAND],
      );
      expect(preserved.rows[0]).toEqual({
        head_revision_id: LEGACY_REVISION,
        revision_count: 1,
      });
      expect(journal.rows[0].quarantine).toEqual(corruptPayload);
    } finally {
      await database.close();
    }
  }, 30_000);
});
