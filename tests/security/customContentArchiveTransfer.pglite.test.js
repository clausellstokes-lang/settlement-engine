/**
 * Executed authority contract for migration 187.
 *
 * The browser validator is preflight only. These tests run the real import and
 * export RPCs against in-process PostgreSQL so deterministic remap, activation,
 * replay and transaction semantics are proven at the server boundary.
 */

import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  sealCustomContentArchive,
  validateCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  prepareCustomContentArchiveImport,
} from '../../src/lib/customContentArchiveImport.js';
import {
  makeCustomContentArchiveFixture,
} from '../fixtures/customContentArchiveFixtures.js';

const migration = name => readFileSync(resolve(
  process.cwd(),
  `supabase/migrations/${name}`,
), 'utf8');
const journalMigration = migration('183_application_command_journal.sql');
const contentMigration = migration('185_custom_content_versions.sql');
const archiveMigration = migration('187_custom_content_archive_transfer.sql');

const ALICE = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
let db;

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

async function importArchive(ownerId, prepared, commandId = prepared.commandId) {
  const response = await asUser(
    ownerId,
    `select public.import_custom_content_archive(
      $1::uuid, $2::text, $3::text, $4::jsonb
    ) as result`,
    [
      ownerId,
      commandId,
      prepared.fingerprint,
      JSON.stringify(prepared.bundle),
    ],
  );
  return response.rows[0].result;
}

async function exportArchive(ownerId) {
  const response = await asUser(
    ownerId,
    `select public.export_custom_content_archive($1::uuid) as result`,
    [ownerId],
  );
  return response.rows[0].result;
}

function prepare(archive, options = {}) {
  return prepareCustomContentArchiveImport(archive, {
    destinationOwnerId: ALICE,
    ...options,
  });
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
      user_id uuid not null references auth.users(id)
    );
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

    insert into auth.users (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.profiles (id) values ('${ALICE}'), ('${MALLORY}');
  `);
  await db.exec(journalMigration);
  await db.exec(contentMigration);
  await db.exec(archiveMigration);
}, 60_000);

beforeEach(async () => {
  await db.exec(`
    delete from public.custom_content_archive_imports;
    delete from public.application_command_journal;
    delete from public.content_environment_activations;
    delete from public.content_environment_revisions;
    delete from public.content_environments;
    delete from public.content_pack_version_entries;
    delete from public.content_pack_entry_definitions;
    delete from public.content_pack_versions;
    delete from public.content_packs;
    delete from public.custom_content_revisions;
    delete from public.custom_content_definitions;
    update public.profiles
       set banned_at = null, disabled_at = null, deleted_at = null;
  `);
});

describe('migration 187 custom-content archive authority', () => {
  test('imports, replays and exports the complete canonical graph', async () => {
    const archive = makeCustomContentArchiveFixture();
    const prepared = prepare(archive, { activationPolicy: 'adopt-if-empty' });
    const admission = await db.query(
      `select
        public._custom_content_archive_ledger_valid(
          $1::jsonb, false, true
        ) as source_valid,
        public._custom_content_archive_ledger_valid(
          $2::jsonb, true, false
        ) as transfer_valid`,
      [
        JSON.stringify(archive.ledger),
        JSON.stringify(prepared.transfer),
      ],
    );
    expect(admission.rows[0]).toEqual({
      source_valid: true,
      transfer_valid: true,
    });
    const first = await importArchive(ALICE, prepared);
    expect(first).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: false,
      activationPolicy: 'adopt-if-empty',
      activationAdopted: true,
      counts: {
        definitions: 2,
        revisions: 4,
        packVersions: 2,
        environments: 2,
      },
    });
    const replay = await importArchive(ALICE, prepared);
    expect(replay).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: true,
    });
    const activation = await db.query(
      `select
        pack.active_pack_version,
        pack.active_manifest_hash,
        activation.environment_revision_id
       from public.content_packs pack
       cross join public.content_environment_activations activation
       where pack.owner_id = $1
         and pack.pack_id = $2
         and activation.owner_id = $1`,
      [ALICE, prepared.transfer.packs[0].packId],
    );
    expect(activation.rows[0]).toMatchObject({
      active_pack_version: prepared.transfer.packs[0].activePackVersion,
      active_manifest_hash: prepared.transfer.packs[0].activeManifestHash,
      environment_revision_id:
        prepared.transfer.activeEnvironmentRevisionId,
    });

    const exported = await exportArchive(ALICE);
    const exportedValidation = validateCustomContentArchive(exported);
    if (!exportedValidation.ok) {
      throw new Error(`export validation ${JSON.stringify(
        exportedValidation,
      )}`);
    }
    expect(exported.auditProvenance[0].commandReceipts)
      .toEqual(archive.ledger.commandReceipts);
  });

  test('adopts activation only for a pristine destination', async () => {
    const first = prepare(makeCustomContentArchiveFixture({
      sourceKey: 'fixture:activation-a',
    }), {
      activationPolicy: 'adopt-if-empty',
    });
    const firstReceipt = await importArchive(ALICE, first);
    expect(firstReceipt).toMatchObject({
      ok: true,
      activationAdopted: true,
    });

    const second = prepare(makeCustomContentArchiveFixture({
      sourceKey: 'fixture:activation-b',
    }), {
      activationPolicy: 'adopt-if-empty',
    });
    const secondReceipt = await importArchive(ALICE, second);
    expect(secondReceipt).toMatchObject({
      ok: true,
      activationPolicy: 'adopt-if-empty',
      activationAdopted: false,
    });

    const state = await db.query(
      `select
        first_pack.active_pack_version as first_version,
        second_pack.active_pack_version as second_version,
        activation.environment_revision_id
       from public.content_packs first_pack
       join public.content_packs second_pack
         on second_pack.owner_id = first_pack.owner_id
        and second_pack.pack_id = $3
       join public.content_environment_activations activation
         on activation.owner_id = first_pack.owner_id
       where first_pack.owner_id = $1
         and first_pack.pack_id = $2`,
      [
        ALICE,
        first.transfer.packs[0].packId,
        second.transfer.packs[0].packId,
      ],
    );
    expect(state.rows[0]).toEqual({
      first_version: first.transfer.packs[0].activePackVersion,
      second_version: null,
      environment_revision_id:
        first.transfer.activeEnvironmentRevisionId,
    });
  });

  test('fast-forwards one source, preserves stale heads and dedupes envelope replay', async () => {
    const sourceKey = 'fixture:generations';
    const generationTwoArchive = makeCustomContentArchiveFixture({
      generation: 2,
      sourceKey,
    });
    const generationTwo = prepare(generationTwoArchive);
    expect(await importArchive(ALICE, generationTwo)).toMatchObject({
      ok: true,
      activationAdopted: false,
    });
    const destinationDefinitionId =
      generationTwo.identityMap.definitionIds.find(
        mapping => mapping.sourceId === 'definition:glass-hall',
      ).destinationId;

    const generationThreeArchive = makeCustomContentArchiveFixture({
      generation: 3,
      sourceKey,
    });
    const generationThree = prepare(generationThreeArchive);
    const lifecycleProof = await db.query(
      `select
        definition.updated_at =
          nullif(source.value ->> 'updatedAt', '')::timestamptz
          as updated_matches,
        definition.archived_at is not distinct from
          nullif(source.value ->> 'archivedAt', '')::timestamptz
          as archived_matches
       from public.custom_content_definitions definition
       join public.custom_content_archive_imports imported
         on imported.owner_id = definition.owner_id
        and imported.source_key = $3
       cross join lateral jsonb_array_elements(
         imported.identity_map -> 'definitionIds'
       ) mapping(value)
       join lateral jsonb_array_elements(
         imported.source_archive #> '{ledger,definitions}'
       ) source(value)
         on source.value ->> 'id' = mapping.value ->> 'sourceId'
       where definition.owner_id = $1
         and definition.id = $2::uuid
         and mapping.value ->> 'destinationId' = definition.id::text`,
      [ALICE, destinationDefinitionId, sourceKey],
    );
    expect(lifecycleProof.rows[0]).toEqual({
      updated_matches: true,
      archived_matches: true,
    });
    const forward = await importArchive(ALICE, generationThree);
    const destinationThirdRevisionId =
      generationThree.identityMap.revisionIds.find(
        mapping => mapping.sourceId === 'revision:glass-hall:3',
      ).destinationId;
    expect(forward).toMatchObject({
      ok: true,
      definitionOutcomes: {
        [destinationDefinitionId]: 'fast-forwarded',
      },
    });

    const staleEnvelope = sealCustomContentArchive(
      generationTwoArchive.ledger,
      {
        sourceKey,
        sourceType: 'browser-local',
        exportedAt: '2026-02-01T00:00:00.000Z',
        auditProvenance: generationTwoArchive.auditProvenance,
      },
    );
    const stale = await importArchive(ALICE, prepare(staleEnvelope));
    expect(stale).toMatchObject({
      ok: true,
      replayed: true,
      semanticReplay: true,
    });

    const state = await db.query(
      `select
        definition.head_revision_id::text as head_revision_id,
        (
          select count(*)::integer
            from public.custom_content_archive_imports
           where owner_id = $1
        ) as provenance_count,
        (
          select count(*)::integer
            from public.application_command_journal
           where owner_id = $1
             and kind = 'content.archive.import'
        ) as journal_count
       from public.custom_content_definitions definition
       where definition.owner_id = $1
         and definition.id = $2::uuid`,
      [ALICE, destinationDefinitionId],
    );
    expect(state.rows[0]).toEqual({
      head_revision_id: destinationThirdRevisionId,
      provenance_count: 2,
      journal_count: 2,
    });
  });

  test('rejects source fast-forward over locally changed lifecycle state', async () => {
    const sourceKey = 'fixture:lifecycle-divergence';
    const generationTwo = prepare(makeCustomContentArchiveFixture({
      generation: 2,
      sourceKey,
    }));
    await importArchive(ALICE, generationTwo);
    const definitionId = generationTwo.identityMap.definitionIds.find(
      mapping => mapping.sourceId === 'definition:glass-hall',
    ).destinationId;
    const secondRevisionId = generationTwo.identityMap.revisionIds.find(
      mapping => mapping.sourceId === 'revision:glass-hall:2',
    ).destinationId;
    const localLifecycleAt = '2026-02-10T00:00:00.000Z';
    await db.query(
      `update public.custom_content_definitions
          set archived_at = $3::timestamptz,
              updated_at = $3::timestamptz
        where owner_id = $1 and id = $2::uuid`,
      [ALICE, definitionId, localLifecycleAt],
    );

    const generationThree = prepare(makeCustomContentArchiveFixture({
      generation: 3,
      sourceKey,
    }));
    expect(await importArchive(ALICE, generationThree)).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_identity_conflict',
    });
    const state = await db.query(
      `select
        head_revision_id::text as head_revision_id,
        public._custom_content_archive_timestamp(
          archived_at
        ) as archived_at,
        public._custom_content_archive_timestamp(
          updated_at
        ) as updated_at
       from public.custom_content_definitions
       where owner_id = $1 and id = $2::uuid`,
      [ALICE, definitionId],
    );
    expect(state.rows[0]).toEqual({
      head_revision_id: secondRevisionId,
      archived_at: localLifecycleAt,
      updated_at: localLifecycleAt,
    });
  });

  test('finalizes and replays a divergent same-source branch failure', async () => {
    const sourceKey = 'fixture:divergence';
    const generationTwo = prepare(makeCustomContentArchiveFixture({
      generation: 2,
      sourceKey,
    }));
    await importArchive(ALICE, generationTwo);
    const definitionId = generationTwo.identityMap.definitionIds.find(
      mapping => mapping.sourceId === 'definition:glass-hall',
    ).destinationId;
    const secondRevisionId = generationTwo.identityMap.revisionIds.find(
      mapping => mapping.sourceId === 'revision:glass-hall:2',
    ).destinationId;
    const localRevisionId = '77777777-7777-5777-8777-777777777777';
    const localData = {
      ...generationTwo.transfer.revisions.find(
        revision => revision.id === secondRevisionId,
      ).data,
      description: 'A local destination branch.',
    };
    const localHash = fingerprintContent({
      schemaVersion: 1,
      category: 'institutions',
      data: localData,
    });
    await db.query(
      `insert into public.custom_content_revisions (
        id, owner_id, definition_id, revision_no, parent_revision_id,
        schema_version, content_hash, data, command_id, created_at
      ) values (
        $1::uuid, $2::uuid, $3::uuid, 100, $4::uuid,
        1, $5::text, $6::jsonb, 'local-destination-command',
        '2026-01-03T00:00:00.000Z'::timestamptz
      )`,
      [
        localRevisionId,
        ALICE,
        definitionId,
        secondRevisionId,
        localHash,
        JSON.stringify(localData),
      ],
    );
    await db.query(
      `update public.custom_content_definitions
          set head_revision_id = $1::uuid,
              updated_at = '2026-01-03T00:00:00.000Z'::timestamptz
        where owner_id = $2::uuid and id = $3::uuid`,
      [localRevisionId, ALICE, definitionId],
    );

    const generationThree = prepare(makeCustomContentArchiveFixture({
      generation: 3,
      sourceKey,
    }));
    const failed = await importArchive(ALICE, generationThree);
    expect(failed).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_identity_conflict',
      replayed: false,
    });
    const replay = await importArchive(ALICE, generationThree);
    expect(replay).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_identity_conflict',
      replayed: true,
    });
    const state = await db.query(
      `select
        definition.head_revision_id::text as head_revision_id,
        journal.phase,
        journal.status
       from public.custom_content_definitions definition
       join public.application_command_journal journal
         on journal.owner_id = definition.owner_id
        and journal.command_id = $4
       where definition.owner_id = $1
         and definition.id = $2::uuid
         and not exists (
           select 1 from public.custom_content_revisions revision
            where revision.id = $3::uuid
         )`,
      [
        ALICE,
        definitionId,
        generationThree.identityMap.revisionIds.find(
          mapping => mapping.sourceId === 'revision:glass-hall:3',
        ).destinationId,
        generationThree.commandId,
      ],
    );
    expect(state.rows[0]).toEqual({
      head_revision_id: localRevisionId,
      phase: 'finalized',
      status: 'failed',
    });
  });

  test('finalizes aggregate destination-limit failures without partial writes', async () => {
    await db.query(
      `insert into public.custom_content_definitions (
        id, owner_id, category, local_uid, created_at, updated_at
      )
      select
        (
          '90000000-0000-4000-8000-'
          || lpad(series.value::text, 12, '0')
        )::uuid,
        $1::uuid,
        'institutions',
        'quota_' || series.value::text,
        '2026-01-01T00:00:00.000Z'::timestamptz,
        '2026-01-01T00:00:00.000Z'::timestamptz
      from generate_series(1, 1999) series(value)`,
      [ALICE],
    );
    const prepared = prepare(makeCustomContentArchiveFixture({
      sourceKey: 'fixture:quota',
    }));
    const failed = await importArchive(ALICE, prepared);
    expect(failed).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_limit_exceeded',
      replayed: false,
    });
    expect(await importArchive(ALICE, prepared)).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_limit_exceeded',
      replayed: true,
    });
    const state = await db.query(
      `select
        count(*)::integer as definitions,
        journal.phase,
        journal.status
       from public.custom_content_definitions definition
       join public.application_command_journal journal
         on journal.owner_id = definition.owner_id
        and journal.command_id = $2
       where definition.owner_id = $1
       group by journal.phase, journal.status`,
      [ALICE, prepared.commandId],
    );
    expect(state.rows[0]).toEqual({
      definitions: 1999,
      phase: 'finalized',
      status: 'failed',
    });
  });

  test('uses the final receipt slot and durably rejects beyond the hard cap', async () => {
    await db.query(
      `insert into public.application_command_journal (
        owner_id, command_id, fingerprint, kind,
        phase, status, receipt, finalized_at
      )
      select
        $1::uuid,
        'prior-content-command:' || series.value::text,
        repeat('a', 64),
        'content.fixture',
        'finalized',
        'applied',
        jsonb_build_object('ok', true, 'status', 'applied'),
        now()
      from generate_series(1, 9999) series(value)`,
      [ALICE],
    );

    const finalSlot = prepare(makeCustomContentArchiveFixture({
      sourceKey: 'fixture:receipt-cap-final-slot',
    }));
    expect(await importArchive(ALICE, finalSlot)).toMatchObject({
      ok: true,
      status: 'applied',
    });

    const overCap = prepare(makeCustomContentArchiveFixture({
      sourceKey: 'fixture:receipt-cap-overflow',
    }));
    expect(await importArchive(ALICE, overCap)).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_limit_exceeded',
      replayed: false,
    });
    expect(await importArchive(ALICE, overCap)).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_limit_exceeded',
      replayed: true,
    });

    const state = await db.query(
      `select
        count(*) filter (
          where jsonb_typeof(receipt) = 'object'
        )::integer as exported_receipts,
        count(*)::integer as journal_rows,
        (
          select count(*)::integer
            from public.custom_content_definitions definition
           where definition.owner_id = $1
             and definition.id in ($2::uuid, $3::uuid)
        ) as rejected_definitions
       from public.application_command_journal
       where owner_id = $1 and kind like 'content.%'`,
      [
        ALICE,
        overCap.transfer.definitions[0].id,
        overCap.transfer.definitions[1].id,
      ],
    );
    expect(state.rows[0]).toEqual({
      exported_receipts: 10000,
      journal_rows: 10001,
      rejected_definitions: 0,
    });
    expect(validateCustomContentArchive(
      await exportArchive(ALICE),
    )).toMatchObject({ ok: true });
  });

  test('rejects a re-fingerprinted client transfer that violates deterministic remap', async () => {
    const prepared = prepare(makeCustomContentArchiveFixture());
    const bundle = JSON.parse(JSON.stringify(prepared.bundle));
    bundle.identityMap.definitionIds[0].destinationId =
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const fingerprint = fingerprintContent(bundle);
    await expect(asUser(
      ALICE,
      `select public.import_custom_content_archive(
        $1::uuid, $2::text, $3::text, $4::jsonb
      )`,
      [
        ALICE,
        `content-archive-import:${fingerprint}`,
        fingerprint,
        JSON.stringify(bundle),
      ],
    )).rejects.toThrow(/identity map is not deterministic/i);
  });

  test('enforces owner and active-account fences', async () => {
    const prepared = prepare(makeCustomContentArchiveFixture());
    await expect(asUser(
      MALLORY,
      `select public.import_custom_content_archive(
        $1::uuid, $2::text, $3::text, $4::jsonb
      )`,
      [
        ALICE,
        prepared.commandId,
        prepared.fingerprint,
        JSON.stringify(prepared.bundle),
      ],
    )).rejects.toThrow(/owner changed/i);

    await db.query(
      `update public.profiles set disabled_at = now() where id = $1`,
      [ALICE],
    );
    await expect(importArchive(ALICE, prepared))
      .rejects.toThrow(/active premium account required/i);
  });
});
