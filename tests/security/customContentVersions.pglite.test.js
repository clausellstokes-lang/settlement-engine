/**
 * Executed contract for migration 185.
 *
 * These tests run the real SQL against in-process Postgres. They prove the
 * properties that source inspection cannot: browser/Postgres fingerprint
 * parity, owner/RLS isolation, atomic expected-head CAS, durable replay,
 * append-only rollback semantics, archive/restore projection, and immutable
 * environment activation.
 */

import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../../src/domain/content/customContentCommands.js';
import {
  makeContentEnvironmentRevision,
  VANILLA_CONTENT_ENVIRONMENT,
} from '../../src/domain/content/contentEnvironment.js';
import {
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  buildContentPack,
  prepareImport as prepareContentPackImport,
} from '../../src/lib/contentPacks.js';

const journalMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/183_application_command_journal.sql',
), 'utf8');
const contentMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/185_custom_content_versions.sql',
), 'utf8');

const ALICE = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
const DELETION_USER = '33333333-3333-4333-8333-333333333333';
const DEFINITION = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SECOND_DEFINITION = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const LEGACY = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const packManifestAliases = new Map();
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

async function asRole(role, sql, params = []) {
  return db.transaction(async (transaction) => {
    await transaction.query(`set local role ${role}`);
    return transaction.query(sql, params);
  });
}

async function apply(ownerId, commandId, preview) {
  const response = await asUser(
    ownerId,
    `select public.apply_custom_content_command(
      $1::uuid, $2::text, $3::text, $4::jsonb
    ) as result`,
    [
      ownerId,
      commandId,
      preview.fingerprint,
      JSON.stringify(preview.plan),
    ],
  );
  return response.rows[0].result;
}

function createPreview(data, expectedHeadRevisionId = null) {
  return previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
    entries: [{
      definitionId: DEFINITION,
      expectedHeadRevisionId,
      category: 'institutions',
      data,
    }],
  });
}

/**
 * Build the exact immutable manifest and reviewed entry projection used by the
 * production pack-import path. The old fixtures used arbitrary manifest hashes,
 * which stopped proving SQL parity once the command contract began carrying
 * the full semantic manifest.
 *
 * Existing tests use memorable repeated-character hashes as aliases. Mapping
 * those aliases to real hashes also preserves intentional stale-preview cases.
 */
function createPackPreview({ pack, entries }) {
  const content = {};
  for (const entry of entries) {
    if (!content[entry.category]) content[entry.category] = [];
    content[entry.category].push({
      ...entry.data,
      packEntryId: entry.packEntryId,
    });
  }
  const manifest = buildContentPack(content, {
    packId: pack.packId,
    packVersion: pack.packVersion,
    name: pack.name,
  });
  const prepared = prepareContentPackImport(manifest);
  expect(prepared.rejected).toEqual([]);
  const sourceByEntry = new Map(entries.map(entry => [
    entry.packEntryId,
    entry,
  ]));
  const manifestAlias = pack.manifestHash;
  const expectedAlias = pack.expectedActiveManifestHash;
  const preview = previewCustomContentCommand({
    kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
    pack: {
      ...pack,
      manifestHash: manifest.manifestHash,
      expectedActiveManifestHash: expectedAlias == null
        ? null
        : packManifestAliases.get(expectedAlias) || expectedAlias,
      manifest,
    },
    entries: prepared.items.map((item) => {
      const source = sourceByEntry.get(item.packEntryId);
      return {
        definitionId: source.definitionId,
        expectedHeadRevisionId: source.expectedHeadRevisionId,
        category: item.bucket,
        packEntryId: item.packEntryId,
        data: item.item,
      };
    }),
  });
  packManifestAliases.set(manifestAlias, manifest.manifestHash);
  return preview;
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
    create policy "premium users insert own custom content"
      on public.custom_content for insert
      with check (auth.uid() = user_id);
    create policy "premium users update own custom content"
      on public.custom_content for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
    create policy "premium users delete own custom content"
      on public.custom_content for delete
      using (auth.uid() = user_id);

    insert into auth.users (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.profiles (id) values ('${ALICE}'), ('${MALLORY}');
    insert into public.custom_content (
      id, user_id, category, data
    ) values (
      '${LEGACY}', '${ALICE}', 'institutions',
      '{"name":"Legacy Guild","description":"Preserved"}'
    );
  `);
  await db.exec(journalMigration);
  await db.exec(contentMigration);
}, 60_000);

beforeEach(async () => {
  packManifestAliases.clear();
  await db.exec(`
    delete from public.application_command_journal;
    delete from public.content_environment_activations;
    delete from public.content_environment_revisions;
    delete from public.content_environments;
    delete from public.content_pack_version_entries;
    delete from public.content_pack_entry_definitions;
    delete from public.content_pack_versions;
    delete from public.content_packs;
    delete from public.custom_content_revisions
      where definition_id <> '${LEGACY}';
    delete from public.custom_content_definitions
      where id <> '${LEGACY}';
  `);
});

describe('migration 185 immutable custom content', () => {
  test('backfills legacy identity and its immutable first revision', async () => {
    const result = await db.query(
      `select d.id, d.local_uid, d.head_revision_id, r.data
         from public.custom_content_definitions d
         join public.custom_content_revisions r
           on r.id = d.head_revision_id
        where d.id = $1`,
      [LEGACY],
    );
    expect(result.rows[0]).toMatchObject({
      id: LEGACY,
      local_uid: `bf_${LEGACY}`,
      data: {
        name: 'Legacy Guild',
        description: 'Preserved',
        localUid: `bf_${LEGACY}`,
      },
    });
  });

  test('matches client fingerprints, appends under CAS, and replays durably', async () => {
    const firstPreview = createPreview({
      name: 'Ångström Guild',
      description: 'A locale-independent first head.',
      localUid: 'lu_non_ascii',
    });
    const first = await apply(ALICE, 'cmd:content:create:1', firstPreview);
    expect(first).toMatchObject({
      status: 'applied',
      replayed: false,
      perEntry: [{ status: 'created' }],
    });
    const firstHead = first.result.items[0].revisionId;

    const replay = await apply(ALICE, 'cmd:content:create:1', firstPreview);
    expect(replay).toMatchObject({ status: 'applied', replayed: true });

    const second = await apply(
      ALICE,
      'cmd:content:update:2',
      createPreview({
        name: 'Ångström Guild',
        description: 'A second immutable head.',
        localUid: 'lu_non_ascii',
      }, firstHead),
    );
    expect(second.perEntry[0]).toMatchObject({ status: 'updated' });

    const stale = await apply(
      ALICE,
      'cmd:content:update:stale',
      createPreview({
        name: 'Ångström Guild',
        description: 'Must not land.',
        localUid: 'lu_non_ascii',
      }, firstHead),
    );
    expect(stale).toMatchObject({
      status: 'stale',
      reason: 'definition_head_changed',
    });

    const history = await db.query(
      `select revision_no, data ->> 'description' as description
         from public.custom_content_revisions
        where definition_id = $1
        order by revision_no`,
      [DEFINITION],
    );
    expect(history.rows).toEqual([
      { revision_no: 1, description: 'A locale-independent first head.' },
      { revision_no: 2, description: 'A second immutable head.' },
    ]);
  });

  test('rolls back every response branch when its journal receipt cannot finalize', async () => {
    expect(
      contentMigration.match(
        /if not public\.finalize_application_command\(/g,
      ),
    ).toHaveLength(3);
    expect(contentMigration).not.toMatch(
      /perform public\.finalize_application_command\(/,
    );

    // Install one pack while the real finalizer is active. Re-importing this
    // exact version with a fresh command id reaches the early applied/no-op
    // response branch, which must obey the same journal invariant as mutations.
    const installedPreview = createPackPreview({
      pack: {
        packId: 'pack:finalization-proof',
        packVersion: '1.0.0',
        name: 'Finalization Proof',
        manifestHash: 'finalization-proof-v1',
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'proof-hall',
        data: { name: 'Proof Hall' },
      }],
    });
    const installed = await apply(
      ALICE,
      'cmd:content:finalization:pack-install',
      installedPreview,
    );
    const repeatPreview = createPackPreview({
      pack: {
        packId: 'pack:finalization-proof',
        packVersion: '1.0.0',
        name: 'Finalization Proof',
        manifestHash: 'finalization-proof-v1',
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: 'finalization-proof-v1',
      },
      entries: [{
        definitionId: installed.perEntry[0].definitionId,
        expectedHeadRevisionId: installed.perEntry[0].revisionId,
        category: 'institutions',
        packEntryId: 'proof-hall',
        data: { name: 'Proof Hall' },
      }],
    });
    const unavailablePreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
      definitionId: SECOND_DEFINITION,
      expectedHeadRevisionId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    });
    const successfulPreview = createPreview({
      name: 'Must Roll Back',
      localUid: 'lu_finalize_failure',
    });
    const originalFinalizer = (await db.query(
      `select pg_get_functiondef(
        'public.finalize_application_command(uuid,text,text,text,jsonb,text)'
          ::regprocedure
      ) as definition`,
    )).rows[0].definition;

    await db.exec(`
      create or replace function public.finalize_application_command(
        p_owner_id uuid,
        p_command_id text,
        p_fingerprint text,
        p_status text,
        p_receipt jsonb default null,
        p_failure_code text default null
      )
      returns boolean
      language sql
      security definer
      set search_path = public, pg_temp
      as $finalizer$
        select false
      $finalizer$;
    `);

    const commandIds = [
      'cmd:content:finalization:success',
      'cmd:content:finalization:stale',
      'cmd:content:finalization:no-op',
    ];
    try {
      await expect(apply(
        ALICE,
        commandIds[0],
        successfulPreview,
      )).rejects.toMatchObject({
        code: '40001',
        message: expect.stringMatching(
          /custom-content command did not finalize/i,
        ),
      });
      await expect(apply(
        ALICE,
        commandIds[1],
        unavailablePreview,
      )).rejects.toMatchObject({
        code: '40001',
        message: expect.stringMatching(
          /custom-content command did not finalize/i,
        ),
      });
      await expect(apply(
        ALICE,
        commandIds[2],
        repeatPreview,
      )).rejects.toMatchObject({
        code: '40001',
        message: expect.stringMatching(
          /custom-content command did not finalize/i,
        ),
      });

      const rolledBack = await db.query(
        `select
          (
            select count(*)::integer
              from public.custom_content_definitions
             where id = $1
          ) as definitions,
          (
            select count(*)::integer
              from public.application_command_journal
             where owner_id = $2
               and command_id = any($3::text[])
          ) as journals`,
        [DEFINITION, ALICE, commandIds],
      );
      expect(rolledBack.rows[0]).toEqual({
        definitions: 0,
        journals: 0,
      });
    } finally {
      await db.exec(originalFinalizer);
    }
  });

  test('archives and restores only after expected-head confirmation', async () => {
    const created = await apply(
      ALICE,
      'cmd:content:lifecycle:create',
      createPreview({
        name: 'Archivists',
        localUid: 'lu_archive',
      }),
    );
    const head = created.result.items[0].revisionId;
    const archivePreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
      definitionId: DEFINITION,
      expectedHeadRevisionId: head,
    });
    const archived = await apply(
      ALICE,
      'cmd:content:lifecycle:archive',
      archivePreview,
    );
    expect(archived).toMatchObject({
      status: 'applied',
      perEntry: [{ status: 'archived', category: 'institutions' }],
    });
    expect(archived.result.items).toEqual([]);
    expect(archived.result.archivedItems[0].archivedAt).toBeTruthy();

    const restorePreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.RESTORE,
      definitionId: DEFINITION,
      expectedHeadRevisionId: head,
    });
    const restored = await apply(
      ALICE,
      'cmd:content:lifecycle:restore',
      restorePreview,
    );
    expect(restored).toMatchObject({
      status: 'applied',
      perEntry: [{ status: 'restored' }],
    });
    expect(restored.result.items[0].archivedAt).toBeNull();
  });

  test('preflights every mass-update head before writing any revision', async () => {
    const first = await apply(
      ALICE,
      'cmd:content:mass:first',
      createPreview({ name: 'First Hall', localUid: 'lu_first' }),
    );
    const secondCreate = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
      entries: [{
        definitionId: SECOND_DEFINITION,
        category: 'institutions',
        data: { name: 'Second Hall', localUid: 'lu_second' },
      }],
    });
    const second = await apply(
      ALICE,
      'cmd:content:mass:second',
      secondCreate,
    );
    const massPreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.MASS_UPDATE,
      entries: [{
        definitionId: DEFINITION,
        expectedHeadRevisionId: first.result.items[0].revisionId,
        category: 'institutions',
        data: {
          name: 'First Hall',
          description: 'Must roll back with the batch.',
          localUid: 'lu_first',
        },
      }, {
        definitionId: SECOND_DEFINITION,
        expectedHeadRevisionId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        category: 'institutions',
        data: {
          name: 'Second Hall',
          description: 'Stale member.',
          localUid: 'lu_second',
        },
      }],
    });
    const stale = await apply(
      ALICE,
      'cmd:content:mass:stale',
      massPreview,
    );
    expect(stale).toMatchObject({
      status: 'stale',
      reason: 'definition_head_changed',
    });
    const rows = await db.query(
      `select definition_id, count(*)::integer as count
         from public.custom_content_revisions
        where definition_id in ($1, $2)
        group by definition_id
        order by definition_id`,
      [DEFINITION, SECOND_DEFINITION],
    );
    expect(rows.rows).toEqual([
      { definition_id: DEFINITION, count: 1 },
      { definition_id: SECOND_DEFINITION, count: 1 },
    ]);
    expect(second.result.items[0].revisionId).toBeTruthy();
  });

  test('activates immutable environment revisions and explicit vanilla reset', async () => {
    const personal = makeContentEnvironmentRevision({
      environmentId: 'personal:alice',
      environmentRevisionId: 'personal:alice:v1',
      revisionNumber: 1,
      tunables: { priorityEconomy: 80, magicExists: false },
      source: 'personal',
    });
    const personalPreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
      environment: personal,
      expectedActiveEnvironmentRevisionId:
        VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId,
    });
    const activated = await apply(
      ALICE,
      'cmd:content:environment:personal',
      personalPreview,
    );
    expect(activated.result.environment.tunables).toEqual({
      priorityEconomy: 80,
      magicExists: false,
    });

    const vanillaPreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
      environment: VANILLA_CONTENT_ENVIRONMENT,
      expectedActiveEnvironmentRevisionId:
        personal.environmentRevisionId,
    });
    await apply(
      ALICE,
      'cmd:content:environment:vanilla',
      vanillaPreview,
    );
    const active = await db.query(
      `select environment_revision_id
         from public.content_environment_activations
        where owner_id = $1`,
      [ALICE],
    );
    expect(active.rows[0].environment_revision_id)
      .toBe(VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId);
  });

  test('imports one immutable pack version and reuses its stable entry definition', async () => {
    const firstPreview = createPackPreview({
      pack: {
        packId: 'pack:river-trade',
        packVersion: '1.0.0',
        name: 'River Trade',
        manifestHash: 'a'.repeat(64),
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'river-guild',
        data: { name: 'River Guild', description: 'First edition.' },
      }],
    });
    const first = await apply(
      ALICE,
      'cmd:content:pack:river:1',
      firstPreview,
    );
    expect(first.perEntry[0]).toMatchObject({
      status: 'created',
      packEntryId: 'river-guild',
    });
    const definitionId = first.perEntry[0].definitionId;

    const wrongMappingPreview = createPackPreview({
      pack: {
        packId: 'pack:river-trade',
        packVersion: '1.0.0',
        name: 'River Trade',
        manifestHash: 'a'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: 'a'.repeat(64),
      },
      entries: [{
        definitionId: SECOND_DEFINITION,
        expectedHeadRevisionId: first.perEntry[0].revisionId,
        category: 'institutions',
        packEntryId: 'river-guild',
        data: { name: 'River Guild', description: 'First edition.' },
      }],
    });
    const wrongMapping = await apply(
      ALICE,
      'cmd:content:pack:river:wrong-mapping',
      wrongMappingPreview,
    );
    expect(wrongMapping).toMatchObject({
      status: 'stale',
      reason: 'pack_mapping_definition_changed',
    });

    const sameVersionPreview = createPackPreview({
      pack: {
        packId: 'pack:river-trade',
        packVersion: '1.0.0',
        name: 'River Trade',
        manifestHash: 'a'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: 'a'.repeat(64),
      },
      entries: [{
        definitionId,
        expectedHeadRevisionId: first.perEntry[0].revisionId,
        category: 'institutions',
        packEntryId: 'river-guild',
        data: { name: 'River Guild', description: 'First edition.' },
      }],
    });
    const sameVersion = await apply(
      ALICE,
      'cmd:content:pack:river:1:repeat',
      sameVersionPreview,
    );
    expect(sameVersion.perEntry[0]).toMatchObject({
      definitionId,
      status: 'unchanged',
    });

    const secondPreview = createPackPreview({
      pack: {
        packId: 'pack:river-trade',
        packVersion: '2.0.0',
        name: 'River Trade',
        manifestHash: 'b'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: 'a'.repeat(64),
      },
      entries: [{
        definitionId,
        expectedHeadRevisionId: first.perEntry[0].revisionId,
        category: 'institutions',
        packEntryId: 'river-guild',
        data: { name: 'River Guild', description: 'Second edition.' },
      }],
    });
    const second = await apply(
      ALICE,
      'cmd:content:pack:river:2',
      secondPreview,
    );
    expect(second.perEntry[0]).toMatchObject({
      definitionId,
      status: 'updated',
    });
    const revisions = await db.query(
      `select count(*)::integer as count
         from public.custom_content_revisions
        where definition_id = $1`,
      [definitionId],
    );
    expect(revisions.rows[0].count).toBe(2);
  });

  test('rejects an empty immutable pack closure at client and SQL authority boundaries', async () => {
    const emptyManifest = buildContentPack({}, {
      packId: 'pack:empty-closure',
      packVersion: '1.0.0',
      name: 'Empty Closure',
    });
    expect(() => previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.PACK_IMPORT,
      pack: {
        packId: emptyManifest.packId,
        packVersion: emptyManifest.packVersion,
        name: emptyManifest.name,
        manifestHash: emptyManifest.manifestHash,
        manifest: emptyManifest,
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [],
    })).toThrow(/requires at least one entry/i);

    const valid = createPackPreview({
      pack: {
        packId: 'pack:empty-closure',
        packVersion: '1.0.0',
        name: 'Empty Closure',
        manifestHash: 'empty-closure',
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'removed-before-sql',
        data: { name: 'Removed Before SQL' },
      }],
    });
    const plan = structuredClone(valid.plan);
    plan.entries = [];
    plan.pack.manifest = emptyManifest;
    plan.pack.manifestHash = emptyManifest.manifestHash;
    plan.pack.importPlanHash = fingerprintContent({
      schemaVersion: 1,
      packId: emptyManifest.packId,
      packVersion: emptyManifest.packVersion,
      entries: [],
    });

    await expect(apply(
      ALICE,
      'cmd:content:pack:empty-closure',
      {
        plan,
        fingerprint: fingerprintContent(plan),
      },
    )).rejects.toThrow(/requires entries|invalid custom-content command plan/i);
    const persisted = await db.query(
      `select count(*)::integer as count
         from public.content_packs
        where owner_id = $1 and pack_id = $2`,
      [ALICE, emptyManifest.packId],
    );
    expect(persisted.rows[0].count).toBe(0);
  });

  test('does not rewind or overwrite a pack definition edited after installation', async () => {
    const firstPreview = createPackPreview({
      pack: {
        packId: 'pack:manual-conflict',
        packVersion: '1.0.0',
        name: 'Manual Conflict',
        manifestHash: 'c'.repeat(64),
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'guild',
        data: { name: 'Pack Guild', description: 'Installed edition.' },
      }],
    });
    const installed = await apply(
      ALICE,
      'cmd:content:pack:manual-conflict:1',
      firstPreview,
    );
    const definitionId = installed.perEntry[0].definitionId;
    const installedRevisionId = installed.perEntry[0].revisionId;
    const manualPreview = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
      entries: [{
        definitionId,
        expectedHeadRevisionId: installedRevisionId,
        category: 'institutions',
        data: {
          name: 'Pack Guild',
          description: 'Owner-authored edition.',
        },
      }],
    });
    const manual = await apply(
      ALICE,
      'cmd:content:pack:manual-conflict:manual',
      manualPreview,
    );
    const manualRevisionId = manual.perEntry[0].revisionId;

    const sameVersionPreview = createPackPreview({
      pack: {
        packId: 'pack:manual-conflict',
        packVersion: '1.0.0',
        name: 'Manual Conflict',
        manifestHash: 'c'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: 'c'.repeat(64),
      },
      entries: [{
        definitionId,
        expectedHeadRevisionId: manualRevisionId,
        category: 'institutions',
        packEntryId: 'guild',
        data: { name: 'Pack Guild', description: 'Installed edition.' },
      }],
    });
    const sameVersion = await apply(
      ALICE,
      'cmd:content:pack:manual-conflict:repeat',
      sameVersionPreview,
    );
    expect(sameVersion.result.items[0]).toMatchObject({
      revisionId: manualRevisionId,
      description: 'Owner-authored edition.',
    });

    const updatePreview = createPackPreview({
      pack: {
        packId: 'pack:manual-conflict',
        packVersion: '2.0.0',
        name: 'Manual Conflict',
        manifestHash: 'd'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: 'c'.repeat(64),
      },
      entries: [{
        definitionId,
        expectedHeadRevisionId: manualRevisionId,
        category: 'institutions',
        packEntryId: 'guild',
        data: { name: 'Pack Guild', description: 'Pack edition two.' },
      }],
    });
    const conflict = await apply(
      ALICE,
      'cmd:content:pack:manual-conflict:2',
      updatePreview,
    );
    expect(conflict).toMatchObject({
      status: 'stale',
      reason: 'pack_definition_head_changed',
    });
    const head = await db.query(
      `select head_revision_id
         from public.custom_content_definitions
        where id = $1`,
      [definitionId],
    );
    expect(head.rows[0].head_revision_id).toBe(manualRevisionId);
  });

  test('preserves pack-entry lineage when a release omits and later restores an entry', async () => {
    const versionOne = await apply(
      ALICE,
      'cmd:content:pack:lineage:1',
      createPackPreview({
        pack: {
          packId: 'pack:lineage',
          packVersion: '1.0.0',
          name: 'Lineage',
          manifestHash: '4'.repeat(64),
          expectedActivePackVersion: null,
          expectedActiveManifestHash: null,
        },
        entries: [{
          category: 'institutions',
          packEntryId: 'returning-hall',
          data: { name: 'Returning Hall', description: 'First edition.' },
        }],
      }),
    );
    const returning = versionOne.perEntry[0];

    const versionTwo = await apply(
      ALICE,
      'cmd:content:pack:lineage:2',
      createPackPreview({
        pack: {
          packId: 'pack:lineage',
          packVersion: '2.0.0',
          name: 'Lineage',
          manifestHash: '5'.repeat(64),
          expectedActivePackVersion: '1.0.0',
          expectedActiveManifestHash: '4'.repeat(64),
        },
        entries: [{
          category: 'institutions',
          packEntryId: 'intervening-hall',
          data: { name: 'Intervening Hall' },
        }],
      }),
    );
    expect(versionTwo).toMatchObject({ status: 'applied' });

    const versionThree = await apply(
      ALICE,
      'cmd:content:pack:lineage:3',
      createPackPreview({
        pack: {
          packId: 'pack:lineage',
          packVersion: '3.0.0',
          name: 'Lineage',
          manifestHash: '6'.repeat(64),
          expectedActivePackVersion: '2.0.0',
          expectedActiveManifestHash: '5'.repeat(64),
        },
        entries: [{
          definitionId: returning.definitionId,
          expectedHeadRevisionId: returning.revisionId,
          category: 'institutions',
          packEntryId: 'returning-hall',
          data: { name: 'Returning Hall', description: 'Third edition.' },
        }],
      }),
    );
    expect(versionThree).toMatchObject({
      status: 'applied',
      perEntry: [{
        definitionId: returning.definitionId,
        status: 'updated',
        packEntryId: 'returning-hall',
      }],
    });
  });

  test('cascades the complete revision graph during account deletion', async () => {
    await db.exec(`
      insert into auth.users (id) values ('${DELETION_USER}');
      insert into public.profiles (id) values ('${DELETION_USER}');
    `);
    await apply(
      DELETION_USER,
      'cmd:content:pack:deletion-graph',
      createPackPreview({
        pack: {
          packId: 'pack:deletion-graph',
          packVersion: '1.0.0',
          name: 'Deletion Graph',
          manifestHash: '7'.repeat(64),
          expectedActivePackVersion: null,
          expectedActiveManifestHash: null,
        },
        entries: [{
          category: 'institutions',
          packEntryId: 'hall',
          data: { name: 'Deletion Hall' },
        }],
      }),
    );

    // The compact harness intentionally does not mirror the production
    // profiles ON DELETE action, so clear that unrelated parent first.
    await db.query(`delete from public.profiles where id = $1`, [DELETION_USER]);
    await db.query(`delete from auth.users where id = $1`, [DELETION_USER]);
    const remaining = await db.query(`
      select
        (select count(*)::integer
           from public.custom_content_definitions
          where owner_id = $1) as definitions,
        (select count(*)::integer
           from public.custom_content_revisions
          where owner_id = $1) as revisions,
        (select count(*)::integer
           from public.content_packs
          where owner_id = $1) as packs,
        (select count(*)::integer
           from public.content_pack_versions
          where owner_id = $1) as pack_versions,
        (select count(*)::integer
           from public.content_pack_version_entries
          where owner_id = $1) as pack_entries,
        (select count(*)::integer
           from public.application_command_journal
          where owner_id = $1) as commands
    `, [DELETION_USER]);
    expect(remaining.rows[0]).toEqual({
      definitions: 0,
      revisions: 0,
      packs: 0,
      pack_versions: 0,
      pack_entries: 0,
      commands: 0,
    });
  });

  test('rejects duplicate direct identities even when the client adapter is bypassed', async () => {
    const admitted = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.MASS_UPDATE,
      entries: [{
        definitionId: DEFINITION,
        category: 'institutions',
        data: { name: 'First duplicate candidate', localUid: 'lu_duplicate_a' },
      }, {
        definitionId: SECOND_DEFINITION,
        category: 'institutions',
        data: { name: 'Second duplicate candidate', localUid: 'lu_duplicate_b' },
      }],
    });
    const tamperedPlan = structuredClone(admitted.plan);
    tamperedPlan.entries[1].definitionId = DEFINITION;

    await expect(apply(
      ALICE,
      'cmd:content:duplicate-direct-definition',
      {
        plan: tamperedPlan,
        fingerprint: fingerprintContent(tamperedPlan),
      },
    )).rejects.toThrow(/definition ids must be unique/i);

    const rows = await db.query(
      `select count(*)::integer as count
         from public.custom_content_definitions
        where owner_id = $1 and id in ($2, $3)`,
      [ALICE, DEFINITION, SECOND_DEFINITION],
    );
    expect(rows.rows[0].count).toBe(0);
  });

  test('keeps durable local identity unique and immutable', async () => {
    const created = await apply(
      ALICE,
      'cmd:content:local-identity:create',
      createPreview({
        name: 'Identity Hall',
        localUid: 'lu_identity_hall',
      }),
    );
    const head = created.perEntry[0].revisionId;

    const collision = await apply(
      ALICE,
      'cmd:content:local-identity:collision',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.CREATE_REVISION,
        entries: [{
          definitionId: SECOND_DEFINITION,
          category: 'institutions',
          data: {
            name: 'Colliding Hall',
            localUid: 'lu_identity_hall',
          },
        }],
      }),
    );
    expect(collision).toMatchObject({
      status: 'stale',
      reason: 'local_uid_unavailable',
    });

    const renamedIdentity = await apply(
      ALICE,
      'cmd:content:local-identity:rewrite',
      createPreview({
        name: 'Identity Hall',
        localUid: 'lu_different_identity',
      }, head),
    );
    expect(renamedIdentity).toMatchObject({
      status: 'failed',
      reason: 'definition_local_uid_immutable',
    });
    const persisted = await db.query(
      `select local_uid, head_revision_id
         from public.custom_content_definitions
        where owner_id = $1 and id = $2`,
      [ALICE, DEFINITION],
    );
    expect(persisted.rows[0]).toEqual({
      local_uid: 'lu_identity_hall',
      head_revision_id: head,
    });
  });

  test('rejects fields that a command kind would otherwise ignore', async () => {
    const admitted = createPreview({
      name: 'No Hidden Payloads',
      localUid: 'lu_no_hidden_payloads',
    });
    const tamperedPlan = structuredClone(admitted.plan);
    tamperedPlan.pack = {
      packId: 'pack:ignored',
      packVersion: '1.0.0',
      name: 'Ignored',
      manifestHash: '0'.repeat(64),
      expectedActivePackVersion: null,
      expectedActiveManifestHash: null,
      importPlanHash: '0'.repeat(64),
    };

    await expect(apply(
      ALICE,
      'cmd:content:hidden-payload',
      {
        plan: tamperedPlan,
        fingerprint: fingerprintContent(tamperedPlan),
      },
    )).rejects.toThrow(/fields its kind does not consume/i);
    const journal = await db.query(
      `select count(*)::integer as count
         from public.application_command_journal
        where owner_id = $1 and command_id = 'cmd:content:hidden-payload'`,
      [ALICE],
    );
    expect(journal.rows[0].count).toBe(0);
  });

  test('serializes pack activation and rejects a stale reviewed preview atomically', async () => {
    const versionOne = createPackPreview({
      pack: {
        packId: 'pack:preview-cas',
        packVersion: '1.0.0',
        name: 'Preview CAS',
        manifestHash: '1'.repeat(64),
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'guild',
        data: { name: 'CAS Guild', description: 'Version one.' },
      }],
    });
    const installed = await apply(
      ALICE,
      'cmd:content:pack:preview-cas:1',
      versionOne,
    );
    const installedHead = installed.perEntry[0].revisionId;
    const reviewedVersionTwo = createPackPreview({
      pack: {
        packId: 'pack:preview-cas',
        packVersion: '2.0.0',
        name: 'Preview CAS',
        manifestHash: '2'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: '1'.repeat(64),
      },
      entries: [{
        definitionId: installed.perEntry[0].definitionId,
        expectedHeadRevisionId: installedHead,
        category: 'institutions',
        packEntryId: 'guild',
        data: { name: 'CAS Guild', description: 'Version two.' },
      }],
    });
    const reviewedVersionThree = createPackPreview({
      pack: {
        packId: 'pack:preview-cas',
        packVersion: '3.0.0',
        name: 'Preview CAS',
        manifestHash: '3'.repeat(64),
        expectedActivePackVersion: '1.0.0',
        expectedActiveManifestHash: '1'.repeat(64),
      },
      entries: [{
        definitionId: installed.perEntry[0].definitionId,
        expectedHeadRevisionId: installedHead,
        category: 'institutions',
        packEntryId: 'guild',
        data: { name: 'CAS Guild', description: 'Version three.' },
      }],
    });

    const versionTwo = await apply(
      ALICE,
      'cmd:content:pack:preview-cas:2',
      reviewedVersionTwo,
    );
    expect(versionTwo).toMatchObject({ status: 'applied' });
    const stale = await apply(
      ALICE,
      'cmd:content:pack:preview-cas:3',
      reviewedVersionThree,
    );
    expect(stale).toMatchObject({
      status: 'stale',
      reason: 'pack_preview_stale',
    });

    const state = await db.query(
      `select active_pack_version, active_manifest_hash,
              (select count(*)::integer
                 from public.content_pack_versions version
                where version.owner_id = pack.owner_id
                  and version.pack_id = pack.pack_id) as version_count
         from public.content_packs pack
        where owner_id = $1 and pack_id = 'pack:preview-cas'`,
      [ALICE],
    );
    expect(state.rows[0]).toEqual({
      active_pack_version: '2.0.0',
      active_manifest_hash: reviewedVersionTwo.plan.pack.manifestHash,
      version_count: 2,
    });
  });

  test('admits only exact, owner-resolved environment references', async () => {
    const created = await apply(
      ALICE,
      'cmd:content:environment-reference:create',
      createPreview({
        name: 'Pinned Hall',
        description: 'Exact direct reference.',
        localUid: 'lu_pinned_hall',
      }),
    );
    const item = created.result.items[0];
    const directEnvironment = makeContentEnvironmentRevision({
      environmentId: 'personal:resolved',
      environmentRevisionId: 'personal:resolved:v1',
      revisionNumber: 1,
      source: 'personal',
      directDefinitions: [{
        definitionId: item.definitionId,
        revisionId: item.revisionId,
        contentHash: item.contentHash,
        category: 'institutions',
      }],
    });
    const directResult = await apply(
      ALICE,
      'cmd:content:environment-reference:direct',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment: directEnvironment,
        expectedActiveEnvironmentRevisionId:
          VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId,
      }),
    );
    expect(directResult).toMatchObject({ status: 'applied' });

    const unresolvedDefinition = makeContentEnvironmentRevision({
      environmentId: 'personal:unresolved-definition',
      environmentRevisionId: 'personal:unresolved-definition:v1',
      revisionNumber: 1,
      source: 'personal',
      directDefinitions: [{
        definitionId: item.definitionId,
        revisionId: item.revisionId,
        contentHash: 'f'.repeat(64),
        category: 'institutions',
      }],
    });
    const definitionFailure = await apply(
      ALICE,
      'cmd:content:environment-reference:bad-definition',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment: unresolvedDefinition,
        expectedActiveEnvironmentRevisionId:
          directEnvironment.environmentRevisionId,
      }),
    );
    expect(definitionFailure).toMatchObject({
      status: 'stale',
      reason: 'content_environment_definition_reference_unavailable',
    });

    const packPreview = createPackPreview({
      pack: {
        packId: 'pack:environment-reference',
        packVersion: '1.0.0',
        name: 'Environment Reference',
        manifestHash: 'e'.repeat(64),
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'watch',
        data: { name: 'Pack Watch' },
      }],
    });
    const installedPack = await apply(
      ALICE,
      'cmd:content:environment-reference:pack',
      packPreview,
    );
    const inertPackEnvironment = makeContentEnvironmentRevision({
      environmentId: 'pack:resolved',
      environmentRevisionId: 'pack:resolved:inert',
      revisionNumber: 1,
      source: 'imported-pack',
      packVersions: [{
        packId: 'pack:environment-reference',
        packVersionId: '1.0.0',
        manifestHash: packPreview.plan.pack.manifestHash,
      }],
    });
    const packResult = await apply(
      ALICE,
      'cmd:content:environment-reference:inert-pack',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment: inertPackEnvironment,
        expectedActiveEnvironmentRevisionId:
          directEnvironment.environmentRevisionId,
      }),
    );
    expect(packResult).toMatchObject({
      status: 'stale',
      reason: 'content_environment_pack_closure_mismatch',
    });

    const installedItem = installedPack.result.items[0];
    const packEnvironment = makeContentEnvironmentRevision({
      environmentId: 'pack:resolved',
      environmentRevisionId: 'pack:resolved:v1',
      revisionNumber: 1,
      source: 'imported-pack',
      packVersions: [{
        packId: 'pack:environment-reference',
        packVersionId: '1.0.0',
        manifestHash: packPreview.plan.pack.manifestHash,
      }],
      directDefinitions: [{
        definitionId: installedItem.definitionId,
        revisionId: installedItem.revisionId,
        contentHash: installedItem.contentHash,
        category: 'institutions',
      }],
    });
    const closedPackResult = await apply(
      ALICE,
      'cmd:content:environment-reference:resolved-pack',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment: packEnvironment,
        expectedActiveEnvironmentRevisionId:
          directEnvironment.environmentRevisionId,
      }),
    );
    expect(closedPackResult).toMatchObject({ status: 'applied' });

    const unresolvedPack = makeContentEnvironmentRevision({
      environmentId: 'pack:unresolved',
      environmentRevisionId: 'pack:unresolved:v1',
      revisionNumber: 1,
      source: 'imported-pack',
      packVersions: [{
        packId: 'pack:environment-reference',
        packVersionId: '9.0.0',
        manifestHash: '9'.repeat(64),
      }],
    });
    const packFailure = await apply(
      ALICE,
      'cmd:content:environment-reference:bad-pack',
      previewCustomContentCommand({
        kind: CUSTOM_CONTENT_COMMAND_KIND.ENVIRONMENT_MIGRATE,
        environment: unresolvedPack,
        expectedActiveEnvironmentRevisionId:
          packEnvironment.environmentRevisionId,
      }),
    );
    expect(packFailure).toMatchObject({
      status: 'stale',
      reason: 'content_environment_pack_reference_unavailable',
    });
  });

  test('keeps deferred pack publication outside the SQL command language', async () => {
    const importPreview = createPackPreview({
      pack: {
        packId: 'pack:not-published',
        packVersion: '1.0.0',
        name: 'Not Published',
        manifestHash: '8'.repeat(64),
        expectedActivePackVersion: null,
        expectedActiveManifestHash: null,
      },
      entries: [{
        category: 'institutions',
        packEntryId: 'hall',
        data: { name: 'Unpublished Hall' },
      }],
    });
    const publicationPlan = structuredClone(importPreview.plan);
    publicationPlan.kind = 'content.pack.publish-version';

    await expect(apply(
      ALICE,
      'cmd:content:pack:publication-is-deferred',
      {
        plan: publicationPlan,
        fingerprint: fingerprintContent(publicationPlan),
      },
    )).rejects.toThrow(/unsupported custom-content command plan/i);
    const rows = await db.query(
      `select count(*)::integer as count
         from public.content_packs
        where owner_id = $1 and pack_id = 'pack:not-published'`,
      [ALICE],
    );
    expect(rows.rows[0].count).toBe(0);
  });

  test('database manifest rejects unknown fields and admits traditions', async () => {
    const result = await db.query(`
      select
        public._custom_content_record_valid(
          'institutions',
          '{"name":"Unknown Field Hall","secretPhysics":true}'::jsonb
        ) as unknown_ok,
        public._custom_content_record_valid(
          'traditions',
          '{"name":"Long Hearth","motifAct":"feast"}'::jsonb
        ) as tradition_ok,
        public._custom_content_record_valid(
          'institutions',
          '{"name":"Blank Identity","localUid":"   "}'::jsonb
        ) as blank_local_uid_ok,
        public._custom_content_record_valid(
          'institutions',
          '{"name":"Padded Identity","localUid":" padded "}'::jsonb
        ) as padded_local_uid_ok,
        public._custom_content_record_valid(
          'institutions',
          '{"name":"Canonical Identity","localUid":"canonical"}'::jsonb
        ) as canonical_local_uid_ok
    `);
    expect(result.rows[0]).toEqual({
      unknown_ok: false,
      tradition_ok: true,
      blank_local_uid_ok: false,
      padded_local_uid_ok: false,
      canonical_local_uid_ok: true,
    });
  });

  test('RLS isolates reads and both legacy and service-role direct mutation are denied', async () => {
    await apply(
      ALICE,
      'cmd:content:owner:create',
      createPreview({ name: 'Alice Only', localUid: 'lu_alice' }),
    );
    const malloryRead = await asUser(
      MALLORY,
      `select id from public.custom_content_definitions where id = $1`,
      [DEFINITION],
    );
    expect(malloryRead.rows).toEqual([]);
    await expect(asUser(
      ALICE,
      `insert into public.custom_content_definitions (
        owner_id, category, local_uid
      ) values ($1, 'institutions', 'forbidden-direct-write')`,
      [ALICE],
    )).rejects.toThrow();
    await expect(asUser(
      ALICE,
      `insert into public.custom_content (
        id, user_id, category, data
      ) values (
        gen_random_uuid(), $1, 'institutions', '{"name":"Split Brain"}'
      )`,
      [ALICE],
    )).rejects.toThrow();
    await expect(asRole(
      'service_role',
      `update public.custom_content_revisions
          set data = '{"name":"Rewritten"}'::jsonb
        where owner_id = $1`,
      [ALICE],
    )).rejects.toThrow();

    const privileges = await db.query(`
      select
        has_table_privilege(
          'service_role',
          'public.custom_content_revisions',
          'UPDATE'
        ) as service_can_rewrite,
        has_table_privilege(
          'service_role',
          'public.custom_content',
          'INSERT'
        ) as service_can_write_legacy,
        has_table_privilege(
          'service_role',
          'public.custom_content_revisions',
          'SELECT'
        ) as service_can_read,
        has_function_privilege(
          'service_role',
          'public.apply_custom_content_command(uuid,text,text,jsonb)',
          'EXECUTE'
        ) as service_can_apply,
        has_function_privilege(
          'service_role',
          'public._content_pack_active_valid()',
          'EXECUTE'
        ) as service_can_call_trigger_helper,
        to_regclass('public.campaign_content_bindings') is null
          as duplicate_campaign_table_absent
    `);
    expect(privileges.rows[0]).toEqual({
      service_can_rewrite: false,
      service_can_write_legacy: false,
      service_can_read: true,
      service_can_apply: true,
      service_can_call_trigger_helper: false,
      duplicate_campaign_table_absent: true,
    });
  });
});
