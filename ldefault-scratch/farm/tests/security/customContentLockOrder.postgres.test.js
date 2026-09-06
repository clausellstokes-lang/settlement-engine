/**
 * Real-PostgreSQL deadlock receipt for the custom-content command lanes.
 *
 * PGlite deliberately runs one PostgreSQL backend, so it can prove function
 * shape and command conflict semantics but cannot construct a database wait-for
 * cycle. CI supplies a disposable PostgreSQL service for this test. Two actual
 * client sessions recreate the historical adversarial order:
 *
 *   reviewed session: owner lock -> caller-selected command row
 *   generic session:  owner lock -> caller-selected command row
 *
 * The reviewed session pre-holds the owner lock. We then observe the generic
 * backend waiting on that lock before allowing reviewed to claim the shared
 * command id. If generic ever regresses to command-row-first, these sessions
 * form the original cycle and PostgreSQL raises 40P01.
 */

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} from 'vitest';
import { Client } from 'pg';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../../src/domain/content/customContentCommands.js';
import {
  REVIEWED_SUPPLY_CHAIN_COMMAND_KIND,
  previewReviewedSupplyChainCommand,
} from '../../src/domain/content/reviewedSupplyChainPersistence.js';
import {
  authoredDataOf,
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';

const ROOT_DATABASE_URL = String(
  process.env.CUSTOM_CONTENT_CONCURRENCY_DATABASE_URL || '',
).trim();
const describeWithPostgres = ROOT_DATABASE_URL ? describe : describe.skip;
const OWNER = '11111111-1111-4111-8111-111111111111';
const RESOURCE_DEFINITION = '31000000-0000-4000-8000-000000000001';
const RESOURCE_REVISION = '32000000-0000-4000-8000-000000000001';
const ABSENT_REVIEWED_ARTIFACT = '41000000-0000-4000-8000-000000000001';
const ABSENT_REVIEWED_REVISION = '42000000-0000-4000-8000-000000000001';
const SHARED_COMMAND_ID = 'test:postgres-cross-lane-owner-lock-order';
const RESOURCE_DATA = Object.freeze({
  name: 'Lockstep Ore',
  localUid: 'resource-lockstep-ore',
  commodities: ['lockstep ore'],
});
const migrations = [
  '183_application_command_journal.sql',
  '185_custom_content_versions.sql',
  '186_campaign_content_binding_cas.sql',
  '187_custom_content_archive_transfer.sql',
  '188_reviewed_supply_chain_persistence.sql',
].map(name => readFileSync(resolve(
  process.cwd(),
  `supabase/migrations/${name}`,
), 'utf8'));

let admin;
let setup;
let observer;
let genericConnection;
let reviewedConnection;
let testDatabaseName;

function urlForDatabase(databaseName) {
  const url = new URL(ROOT_DATABASE_URL);
  url.pathname = `/${databaseName}`;
  return url.toString();
}

async function initializeDatabase(connection) {
  await connection.query(`
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

    create schema auth;
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
  for (const migration of migrations) await connection.query(migration);

  const contentHash = contentRevisionHash('resources', RESOURCE_DATA);
  await connection.query(
    `insert into public.custom_content_definitions (
       id, owner_id, category, local_uid
     ) values ($1, $2, 'resources', $3)`,
    [RESOURCE_DEFINITION, OWNER, RESOURCE_DATA.localUid],
  );
  await connection.query(
    `insert into public.custom_content_revisions (
       id, owner_id, definition_id, revision_no, schema_version,
       content_hash, data
     ) values ($1, $2, $3, 1, 1, $4, $5::jsonb)`,
    [
      RESOURCE_REVISION,
      OWNER,
      RESOURCE_DEFINITION,
      contentHash,
      JSON.stringify(authoredDataOf(RESOURCE_DATA)),
    ],
  );
  await connection.query(
    `update public.custom_content_definitions
        set head_revision_id = $1
      where owner_id = $2 and id = $3`,
    [RESOURCE_REVISION, OWNER, RESOURCE_DEFINITION],
  );
}

async function beginAuthenticated(connection) {
  await connection.query('begin');
  await connection.query("set local statement_timeout = '5s'");
  await connection.query("set local deadlock_timeout = '100ms'");
  await connection.query(
    `select set_config('test.uid', $1, true)`,
    [OWNER],
  );
  await connection.query('set local role authenticated');
}

async function rollbackQuietly(connection) {
  try {
    await connection.query('rollback');
  } catch {
    // A closed or already-aborted disposable test transaction needs no repair.
  }
}

async function waitForGenericOwnerLock() {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    const activity = await observer.query(
      `select wait_event_type, wait_event
         from pg_stat_activity
        where datname = current_database()
          and application_name = 'sf-generic-lock-racer'
          and state = 'active'
          and query like '%apply_custom_content_command%'
        limit 1`,
    );
    if (activity.rows[0]?.wait_event_type === 'Lock') {
      return activity.rows[0].wait_event;
    }
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Generic command never reached the owner-lock wait.');
}

beforeAll(async () => {
  admin = new Client({ connectionString: ROOT_DATABASE_URL });
  await admin.connect();
  testDatabaseName = [
    'sf_custom_content_lock',
    process.pid,
    Date.now(),
  ].join('_');
  if (!/^[a-z0-9_]+$/.test(testDatabaseName)) {
    throw new Error('Disposable PostgreSQL database name is invalid.');
  }
  await admin.query(`create database "${testDatabaseName}"`);

  const testDatabaseUrl = urlForDatabase(testDatabaseName);
  setup = new Client({ connectionString: testDatabaseUrl });
  observer = new Client({
    connectionString: testDatabaseUrl,
    application_name: 'sf-lock-observer',
  });
  genericConnection = new Client({
    connectionString: testDatabaseUrl,
    application_name: 'sf-generic-lock-racer',
  });
  reviewedConnection = new Client({
    connectionString: testDatabaseUrl,
    application_name: 'sf-reviewed-lock-racer',
  });
  await Promise.all([
    setup.connect(),
    observer.connect(),
    genericConnection.connect(),
    reviewedConnection.connect(),
  ]);
  await initializeDatabase(setup);
}, 30_000);

afterAll(async () => {
  await Promise.allSettled([
    setup?.end(),
    observer?.end(),
    genericConnection?.end(),
    reviewedConnection?.end(),
  ]);
  if (admin && testDatabaseName) {
    await admin.query(`drop database "${testDatabaseName}" with (force)`);
  }
  await admin?.end();
});

describeWithPostgres('custom-content cross-lane PostgreSQL lock order', () => {
  test('two backends resolve the same command id without 40P01', async () => {
    const authorable = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
      definitionId: RESOURCE_DEFINITION,
      expectedHeadRevisionId: RESOURCE_REVISION,
    });
    const reviewed = previewReviewedSupplyChainCommand({
      schemaVersion: 1,
      kind: REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE,
      artifactId: ABSENT_REVIEWED_ARTIFACT,
      expectedHeadRevisionId: ABSENT_REVIEWED_REVISION,
      expectedLifecycleVersion: 1,
      chain: null,
    });

    await beginAuthenticated(reviewedConnection);
    await reviewedConnection.query(
      `select pg_advisory_xact_lock(
         hashtext('custom-content-owner'),
         hashtext($1::text)
       )`,
      [OWNER],
    );

    const genericOutcome = (async () => {
      await beginAuthenticated(genericConnection);
      try {
        const response = await genericConnection.query(
          `select public.apply_custom_content_command(
             $1::uuid, $2::text, $3::text, $4::jsonb
           ) as result`,
          [
            OWNER,
            SHARED_COMMAND_ID,
            authorable.fingerprint,
            JSON.stringify(authorable.plan),
          ],
        );
        await genericConnection.query('commit');
        return response.rows[0].result;
      } catch (error) {
        await rollbackQuietly(genericConnection);
        throw error;
      }
    })();

    expect(await waitForGenericOwnerLock()).toBe('advisory');

    let reviewedResult;
    try {
      const response = await reviewedConnection.query(
        `select public.apply_reviewed_supply_chain_command(
           $1::uuid, $2::text, $3::text, $4::jsonb
         ) as result`,
        [
          OWNER,
          SHARED_COMMAND_ID,
          reviewed.fingerprint,
          JSON.stringify(reviewed.plan),
        ],
      );
      reviewedResult = response.rows[0].result;
      await reviewedConnection.query('commit');
    } catch (error) {
      await rollbackQuietly(reviewedConnection);
      throw error;
    }

    const settledGeneric = await Promise.allSettled([genericOutcome]);
    const databaseErrors = settledGeneric
      .filter(outcome => outcome.status === 'rejected')
      .map(outcome => outcome.reason);
    expect(databaseErrors.map(error => error?.code)).not.toContain('40P01');
    expect(databaseErrors).toEqual([]);
    expect(reviewedResult).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'reviewed_supply_chain_unavailable',
      replayed: false,
    });
    expect(settledGeneric[0].value).toMatchObject({
      status: 'conflict',
      reason: 'command_id_conflict',
      replayed: true,
      fingerprint: reviewed.fingerprint,
    });

    const journal = await observer.query(
      `select kind, status, phase, fingerprint
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [OWNER, SHARED_COMMAND_ID],
    );
    expect(journal.rows).toEqual([{
      kind: REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE,
      status: 'stale',
      phase: 'finalized',
      fingerprint: reviewed.fingerprint,
    }]);
  }, 10_000);
});
