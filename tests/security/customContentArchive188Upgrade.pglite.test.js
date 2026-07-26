/**
 * Upgrade proof for migration 188's archive-reconciliation repair.
 *
 * Migration 187 accepted legacy archives whose temporal facts were null, then
 * had to materialize NOT NULL database timestamps. Migration 188 must preserve
 * that already-chosen destination representation, backfill only receipts that
 * still describe the winning lifecycle, and refuse to overwrite local drift.
 */

import {
  afterAll,
  beforeAll,
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

const BEFORE_188 = [
  '183_application_command_journal.sql',
  '185_custom_content_versions.sql',
  '186_campaign_content_binding_cas.sql',
  '187_custom_content_archive_transfer.sql',
].map(migration);
const MIGRATION_188 = migration('188_reviewed_supply_chain_persistence.sql');

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

function prepare(ownerId, archive) {
  return prepareCustomContentArchiveImport(archive, {
    destinationOwnerId: ownerId,
    activationPolicy: 'preserve',
  });
}

async function importArchive(ownerId, prepared) {
  const response = await asUser(
    ownerId,
    `select public.import_custom_content_archive(
       $1::uuid, $2::text, $3::text, $4::jsonb
     ) as result`,
    [
      ownerId,
      prepared.commandId,
      prepared.fingerprint,
      JSON.stringify(prepared.bundle),
    ],
  );
  return response.rows[0].result;
}

function nullTimestampArchive(archive, sourceKey) {
  const ledger = structuredClone(archive.ledger);
  ledger.definitions = ledger.definitions.map(definition => ({
    ...definition,
    createdAt: null,
    updatedAt: null,
  }));
  ledger.revisions = ledger.revisions.map(revision => ({
    ...revision,
    createdAt: null,
  }));
  ledger.packs = ledger.packs.map(pack => ({
    ...pack,
    createdAt: null,
    updatedAt: null,
  }));
  ledger.packVersions = ledger.packVersions.map(version => ({
    ...version,
    createdAt: null,
  }));
  // Environment createdAt is transport metadata and is excluded from its
  // environmentHash, so this faithfully models an older ledger.
  ledger.environments = ledger.environments.map(environment => ({
    ...environment,
    createdAt: null,
  }));
  return sealCustomContentArchive(ledger, {
    sourceKey,
    sourceType: 'browser-local',
    exportedAt: null,
    auditProvenance: archive.auditProvenance,
  });
}

function generationOneArchive(sourceKey) {
  const generationTwo = makeCustomContentArchiveFixture({
    generation: 2,
    sourceKey,
  });
  const ledger = structuredClone(generationTwo.ledger);
  const firstVersion = ledger.packVersions.find(
    version => version.packVersion === '1.0.0',
  );
  const firstEnvironment = ledger.environments.find(
    environment => environment.revisionNumber === 1,
  );
  ledger.definitions = ledger.definitions.map((definition) => {
    if (definition.localUid !== 'lu_glass_hall') return definition;
    return {
      ...definition,
      headRevisionId: 'revision:glass-hall:1',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
  });
  ledger.revisions = ledger.revisions.filter(
    revision => revision.id !== 'revision:glass-hall:2',
  );
  ledger.packs = ledger.packs.map(pack => ({
    ...pack,
    activePackVersion: firstVersion.packVersion,
    activeManifestHash: firstVersion.manifestHash,
  }));
  ledger.packVersions = [firstVersion];
  ledger.packVersionEntries = ledger.packVersionEntries.filter(
    entry => entry.packVersion === firstVersion.packVersion,
  );
  ledger.environments = [firstEnvironment];
  ledger.activeEnvironmentRevisionId =
    firstEnvironment.environmentRevisionId;
  return nullTimestampArchive(sealCustomContentArchive(ledger, {
    sourceKey,
    sourceType: 'browser-local',
    exportedAt: null,
    auditProvenance: generationTwo.auditProvenance,
  }), sourceKey);
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
      name text not null default 'Realm',
      map_data jsonb not null default '{}'::jsonb,
      access_state text not null default 'active',
      updated_at timestamptz not null default now()
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
  for (const sql of BEFORE_188) await db.exec(sql);
}, 60_000);

afterAll(async () => {
  await db?.close();
});

describe('migration 188 archive upgrade reconciliation', () => {
  test('backfills only winning receipts and advances null-time graphs safely', async () => {
    const cleanSource = 'fixture:null-time-upgrade';
    const cleanTwoArchive = nullTimestampArchive(
      makeCustomContentArchiveFixture({
        generation: 2,
        sourceKey: cleanSource,
      }),
      cleanSource,
    );
    const cleanTwo = prepare(ALICE, cleanTwoArchive);
    expect(await importArchive(ALICE, cleanTwo)).toMatchObject({
      ok: true,
      status: 'applied',
    });
    const cleanDefinitionId = cleanTwo.identityMap.definitionIds.find(
      mapping => mapping.sourceId === 'definition:glass-hall',
    ).destinationId;

    const staleOne = prepare(ALICE, generationOneArchive(cleanSource));
    // Reproduce a 187-era stale provenance receipt that preserved the newer
    // destination head. The receipt is intentionally later than the winning
    // generation; migration 188 must not treat source JSON as merge outcome.
    await db.query(
      `insert into public.custom_content_archive_imports (
         owner_id, archive_fingerprint, source_key,
         source_ledger_fingerprint, provenance_fingerprint,
         source_archive, identity_map, command_id, imported_at
       ) values (
         $1, $2, $3, $4,
         public._content_sha256(jsonb_build_object(
           'schemaVersion', 1,
           'commandReceipts', $5::jsonb #> '{ledger,commandReceipts}',
           'auditProvenance', $5::jsonb -> 'auditProvenance'
         )),
         $5::jsonb, $6::jsonb, $7, clock_timestamp() + interval '1 second'
       )`,
      [
        ALICE,
        staleOne.archive.archiveFingerprint,
        cleanSource,
        staleOne.archive.source.ledgerFingerprint,
        JSON.stringify(staleOne.archive),
        JSON.stringify(staleOne.identityMap),
        staleOne.commandId,
      ],
    );
    const legacyMicrosecond =
      '2026-07-25T00:00:00.123456Z';
    await db.transaction(async (transaction) => {
      await transaction.query(
        `update public.custom_content_archive_imports
            set imported_at = $3::timestamptz
          where owner_id = $1 and archive_fingerprint = $2`,
        [ALICE, cleanTwo.archive.archiveFingerprint, legacyMicrosecond],
      );
      for (const table of [
        'custom_content_definitions',
        'content_packs',
        'content_environments',
      ]) {
        await transaction.query(
          `update public.${table}
              set created_at = $2::timestamptz,
                  updated_at = $2::timestamptz
            where owner_id = $1`,
          [ALICE, legacyMicrosecond],
        );
      }
      for (const table of [
        'custom_content_revisions',
        'content_pack_versions',
        'content_environment_revisions',
      ]) {
        await transaction.query(
          `update public.${table}
              set created_at = $2::timestamptz
            where owner_id = $1`,
          [ALICE, legacyMicrosecond],
        );
      }
    });

    const driftSource = 'fixture:null-time-local-drift';
    const driftTwo = prepare(MALLORY, nullTimestampArchive(
      makeCustomContentArchiveFixture({
        generation: 2,
        sourceKey: driftSource,
      }),
      driftSource,
    ));
    expect(await importArchive(MALLORY, driftTwo)).toMatchObject({
      ok: true,
      status: 'applied',
    });
    const driftDefinitionId = driftTwo.identityMap.definitionIds.find(
      mapping => mapping.sourceId === 'definition:glass-hall',
    ).destinationId;
    await db.query(
      `update public.custom_content_definitions
          set updated_at = updated_at + interval '1 hour'
        where owner_id = $1 and id = $2`,
      [MALLORY, driftDefinitionId],
    );

    await db.exec(MIGRATION_188);

    const backfill = await db.query(
      `select
         archive_fingerprint,
         destination_definition_lifecycles ? $3 as has_clean_lifecycle
       from public.custom_content_archive_imports
       where owner_id = $1 and source_key = $2
       order by imported_at`,
      [ALICE, cleanSource, cleanDefinitionId],
    );
    expect(backfill.rows).toHaveLength(2);
    expect(backfill.rows.map(row => row.has_clean_lifecycle))
      .toEqual([true, false]);

    const normalizedEnvironment = await db.query(
      `select revision ->> 'createdAt' as created_at
         from public.content_environment_revisions
        where owner_id = $1
        order by revision_no
        limit 1`,
      [ALICE],
    );
    expect(normalizedEnvironment.rows[0].created_at)
      .toMatch(/^\d{4}-\d{2}-\d{2}T/);
    const millisecondParity = await db.query(
      `select bool_and(
         mod(
           extract(microseconds from created_at)::bigint,
           1000
         ) = 0
       ) as canonical
       from (
         select created_at
           from public.custom_content_definitions
          where owner_id = $1
         union all
         select created_at
           from public.custom_content_revisions
          where owner_id = $1
         union all
         select created_at
           from public.content_environment_revisions
          where owner_id = $1
       ) timestamps`,
      [ALICE],
    );
    expect(millisecondParity.rows[0].canonical).toBe(true);

    const cleanThree = prepare(ALICE, nullTimestampArchive(
      makeCustomContentArchiveFixture({
        generation: 3,
        sourceKey: cleanSource,
      }),
      cleanSource,
    ));
    const cleanForward = await importArchive(ALICE, cleanThree);
    expect(cleanForward).toMatchObject({
      ok: true,
      status: 'applied',
      definitionOutcomes: {
        [cleanDefinitionId]: 'fast-forwarded',
      },
    });
    const cleanThirdRevisionId = cleanThree.identityMap.revisionIds.find(
      mapping => mapping.sourceId === 'revision:glass-hall:3',
    ).destinationId;

    const driftThree = prepare(MALLORY, nullTimestampArchive(
      makeCustomContentArchiveFixture({
        generation: 3,
        sourceKey: driftSource,
      }),
      driftSource,
    ));
    expect(await importArchive(MALLORY, driftThree)).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'custom_content_archive_identity_conflict',
    });

    const finalState = await db.query(
      `select owner_id::text, id::text, head_revision_id::text
         from public.custom_content_definitions
        where (owner_id = $1 and id = $2)
           or (owner_id = $3 and id = $4)
        order by owner_id`,
      [ALICE, cleanDefinitionId, MALLORY, driftDefinitionId],
    );
    const byOwner = new Map(finalState.rows.map(row => [
      row.owner_id,
      row.head_revision_id,
    ]));
    expect(byOwner.get(ALICE)).toBe(cleanThirdRevisionId);
    expect(byOwner.get(MALLORY)).toBe(
      driftTwo.transfer.definitions.find(
        definition => definition.id === driftDefinitionId,
      ).headRevisionId,
    );

    // Provenance is a multi-root DAG serialized as trees. Shared ancestry may
    // repeat byte-identically, but the same fingerprint can never claim two
    // meanings. The successful import also executes the prospective export
    // proof, covering both SQL admission sites.
    const provenanceSource = 'fixture:shared-provenance';
    const provenanceBase = makeCustomContentArchiveFixture({
      generation: 2,
      sourceKey: provenanceSource,
    });
    const sharedAncestor = provenanceBase.auditProvenance[0];
    const repeatedArchive = sealCustomContentArchive(
      provenanceBase.ledger,
      {
        sourceKey: provenanceSource,
        sourceType: 'browser-local',
        exportedAt: null,
        auditProvenance: [sharedAncestor, sharedAncestor],
      },
    );
    const repeatedPrepared = prepare(ALICE, repeatedArchive);
    expect(await importArchive(ALICE, repeatedPrepared)).toMatchObject({
      ok: true,
      status: 'applied',
    });

    const divergentBundle = structuredClone(repeatedPrepared.bundle);
    divergentBundle.sourceArchive.auditProvenance[1].source.key =
      'cloud:divergent-meaning';
    const archiveCore = structuredClone(divergentBundle.sourceArchive);
    delete archiveCore.archiveFingerprint;
    divergentBundle.sourceArchive.archiveFingerprint =
      fingerprintContent(archiveCore);
    const divergentFingerprint = fingerprintContent(divergentBundle);
    await expect(asUser(
      ALICE,
      `select public.import_custom_content_archive(
         $1::uuid, $2::text, $3::text, $4::jsonb
       ) as result`,
      [
        ALICE,
        `content-archive-import:${divergentFingerprint}`,
        divergentFingerprint,
        JSON.stringify(divergentBundle),
      ],
    )).rejects.toThrow(/provenance failed admission/i);
  });
});
