/**
 * Adversarial legacy backfill coverage for migration 185.
 *
 * This suite starts from a deliberately dirty pre-cutover table. It exercises
 * the migration on a fresh Postgres instance, then reruns only the documented
 * backfill block to prove that retrying that data step neither duplicates
 * revisions nor changes already-established heads.
 */

import { expect, test } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OWNER = '33333333-3333-4333-8333-333333333333';
const AUTHORABLE_CATEGORIES = Object.freeze([
  'institutions',
  'services',
  'resources',
  'stressors',
  'tradeGoods',
  'factions',
  'deities',
  'traditions',
]);
const LEGACY_READ_ONLY_CATEGORIES = Object.freeze([
  'supplyChains',
  'tradeRoutes',
  'powerPresets',
  'defensePresets',
]);
const SUPPORTED_LEGACY_CATEGORIES = Object.freeze([
  ...AUTHORABLE_CATEGORIES,
  ...LEGACY_READ_ONLY_CATEGORIES,
]);

const journalMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/183_application_command_journal.sql',
), 'utf8');
const contentMigration = readFileSync(resolve(
  process.cwd(),
  'supabase/migrations/185_custom_content_versions.sql',
), 'utf8');

function legacyId(ordinal) {
  return `40000000-0000-4000-8000-${String(ordinal).padStart(12, '0')}`;
}

/**
 * Wall-clock ceiling for tests that BOOT PGlite in their bodies: this file's
 * constructor helper runs under testTimeout (20000 via vite.config.js), not
 * hookTimeout, but the same boot-noise band applies (cold boots measured up to
 * 20.7s under 2026-07-27 gate load). A timeout is a DEADLOCK GUARD, not a perf
 * budget — never tune it to a measurement. Sibling of the hook-scoped constant
 * enforced by tests/security/pgliteHookTimeoutRatchet.test.js.
 */
const PGLITE_BOOT_TIMEOUT_MS = 180_000;

async function makeLegacyDatabase() {
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
    returns uuid language sql stable as $fn$
      select nullif(current_setting('test.uid', true), '')::uuid
    $fn$;

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
    create table public.custom_content (
      id uuid primary key,
      user_id uuid not null references auth.users(id),
      category text not null,
      data jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    insert into auth.users (id) values ('${OWNER}');
    insert into public.profiles (id) values ('${OWNER}');
  `);
  return database;
}

async function insertLegacyRow(database, {
  id,
  category,
  data,
}) {
  await database.query(
    `insert into public.custom_content (
      id, user_id, category, data
    ) values ($1, $2, $3, $4::jsonb)`,
    [id, OWNER, category, JSON.stringify(data)],
  );
}

test('dirty legacy rows backfill losslessly, uniquely, and idempotently', async () => {
  const database = await makeLegacyDatabase();
  const rows = [];
  try {
    for (const [index, category] of SUPPORTED_LEGACY_CATEGORIES.entries()) {
      rows.push({
        id: legacyId(index + 1),
        category,
        data: {
          name: `Legacy ${category}`,
          localUid: `legacy_${category}`,
        },
      });
    }
    rows.push(
      {
        id: legacyId(20),
        category: 'institutions',
        data: { name: 'Duplicate A', localUid: 'duplicate_uid' },
      },
      {
        id: legacyId(21),
        category: 'services',
        data: { name: 'Duplicate B', localUid: 'duplicate_uid' },
      },
      {
        id: legacyId(22),
        category: 'resources',
        data: { name: 'Whitespace UID', localUid: '  retained_after_trim  ' },
      },
      {
        id: legacyId(23),
        category: 'stressors',
        data: { name: 'Blank UID', localUid: '   ' },
      },
      {
        id: legacyId(24),
        category: 'tradeGoods',
        data: { name: 'Oversized UID', localUid: 'x'.repeat(241) },
      },
      {
        id: legacyId(25),
        category: 'supplyChains',
        data: {
          name: 'Read-only legacy category',
          id: 'spoofed-id',
          revisionId: 'spoofed-revision',
          localUid: `bf_${legacyId(26)}`,
        },
      },
      {
        id: legacyId(26),
        category: 'institutions',
        data: 'legacy scalar',
      },
      {
        id: legacyId(27),
        category: 'services',
        data: ['legacy', 'array'],
      },
      {
        id: legacyId(28),
        category: 'resources',
        data: 17,
      },
      {
        id: legacyId(29),
        category: 'stressors',
        data: true,
      },
      {
        id: legacyId(30),
        category: 'tradeGoods',
        data: null,
      },
    );

    for (const row of rows) await insertLegacyRow(database, row);
    await database.exec(journalMigration);
    await database.exec(contentMigration);

    const counts = await database.query(`
      select
        (select count(*)::integer
           from public.custom_content_definitions) as definitions,
        (select count(*)::integer
           from public.custom_content_revisions) as revisions,
        (select count(*)::integer
           from public.custom_content_definitions
          where head_revision_id is not null) as headed
    `);
    expect(counts.rows[0]).toEqual({
      definitions: rows.length,
      revisions: rows.length,
      headed: rows.length,
    });

    const projected = await database.query(`
      select
        definition.id,
        definition.category,
        definition.local_uid,
        revision.data,
        revision.content_hash = public._content_sha256(jsonb_build_object(
          'schemaVersion', 1,
          'category', definition.category,
          'data', revision.data
        )) as hash_valid
      from public.custom_content_definitions definition
      join public.custom_content_revisions revision
        on revision.id = definition.head_revision_id
      order by definition.id
    `);
    const byId = new Map(projected.rows.map(row => [row.id, row]));

    for (const [index, category] of SUPPORTED_LEGACY_CATEGORIES.entries()) {
      expect(byId.get(legacyId(index + 1))).toMatchObject({
        category,
        local_uid: `legacy_${category}`,
        hash_valid: true,
      });
    }
    expect(byId.get(legacyId(20)).local_uid).toBe(`bf_${legacyId(20)}`);
    expect(byId.get(legacyId(21)).local_uid).toBe(`bf_${legacyId(21)}`);
    expect(byId.get(legacyId(22)).local_uid).toBe('retained_after_trim');
    expect(byId.get(legacyId(23)).local_uid).toBe(`bf_${legacyId(23)}`);
    expect(byId.get(legacyId(24)).local_uid).toBe(`bf_${legacyId(24)}`);
    expect(byId.get(legacyId(25))).toMatchObject({
      category: 'supplyChains',
      local_uid: `bf_${legacyId(25)}`,
      data: {
        name: 'Read-only legacy category',
        localUid: `bf_${legacyId(25)}`,
      },
      hash_valid: true,
    });
    expect(byId.get(legacyId(26)).data).toEqual({
      legacyPayload: 'legacy scalar',
      localUid: `bf_${legacyId(26)}`,
    });
    expect(byId.get(legacyId(27)).data).toEqual({
      legacyPayload: ['legacy', 'array'],
      localUid: `bf_${legacyId(27)}`,
    });
    expect(byId.get(legacyId(28)).data).toEqual({
      legacyPayload: 17,
      localUid: `bf_${legacyId(28)}`,
    });
    expect(byId.get(legacyId(29)).data).toEqual({
      legacyPayload: true,
      localUid: `bf_${legacyId(29)}`,
    });
    expect(byId.get(legacyId(30)).data).toEqual({
      legacyPayload: null,
      localUid: `bf_${legacyId(30)}`,
    });

    const backfillStart = contentMigration.indexOf(
      '-- Preserve every historical row.',
    );
    const backfillEnd = contentMigration.indexOf(
      '-- Migration 185 is the mutation cutover.',
    );
    expect(backfillStart).toBeGreaterThanOrEqual(0);
    expect(backfillEnd).toBeGreaterThan(backfillStart);
    await database.exec(contentMigration.slice(backfillStart, backfillEnd));

    const rerun = await database.query(`
      select
        (select count(*)::integer
           from public.custom_content_definitions) as definitions,
        (select count(*)::integer
           from public.custom_content_revisions) as revisions,
        count(distinct head_revision_id)::integer as distinct_heads
      from public.custom_content_definitions
    `);
    expect(rerun.rows[0]).toEqual({
      definitions: rows.length,
      revisions: rows.length,
      distinct_heads: rows.length,
    });
  } finally {
    await database.close();
  }
}, PGLITE_BOOT_TIMEOUT_MS);
