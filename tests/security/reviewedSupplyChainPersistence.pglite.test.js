/**
 * Executed authority contract for migration 188.
 *
 * Reviewed supply chains are immutable derived artifacts. The browser can
 * prepare their review plan, but only the dedicated database command may
 * establish revision authority. This suite intentionally applies the complete
 * 183/185/186/187/188 migration band verbatim so SQL syntax, forward-patching,
 * helper visibility, and the generic-authoring fence are exercised together.
 */

import {
  afterAll,
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
  admitCampaignContentBinding,
  admitContentEnvironmentRevision,
  contentRuntimeFromCampaignBinding,
  contentRuntimeFromEnvironment,
  makeCampaignContentBinding,
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import {
  confirmCustomSupplyChainReview,
  customSupplyChainProjectionFingerprint,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  authoredDataOf,
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  admitReviewedSupplyChain,
  previewReviewedSupplyChainCommand,
  remapReviewedSupplyChain,
  REVIEWED_SUPPLY_CHAIN_COMMAND_KIND,
  reviewedSupplyChainContentHash,
} from '../../src/domain/content/reviewedSupplyChainPersistence.js';
import {
  executeReviewedSupplyChainLocalAuthority,
} from '../../src/lib/customContentLocalReviewedChains.js';
import {
  customContentLocalReceipt,
} from '../../src/lib/customContentLocalLedger.js';
import {
  backfillLegacyCustomContentLedger,
} from '../../src/lib/customContentLocalLedgerMigration.js';
import {
  reviewedSupplyChainIdForNodeUids,
} from '../../src/domain/content/customSupplyChainIdentity.js';
import {
  canonicalContentJson,
  fingerprintContent,
} from '../../src/domain/content/contentFingerprint.js';
import {
  CUSTOM_CONTENT_COMMAND_KIND,
  previewCustomContentCommand,
} from '../../src/domain/content/customContentCommands.js';
import {
  sealCustomContentArchive,
  validateCustomContentArchive,
} from '../../src/lib/customContentArchive.js';
import {
  prepareCustomContentArchiveImport,
} from '../../src/lib/customContentArchiveImport.js';
import {
  admitReviewedSupplyChainRpcReceipt,
} from '../../src/lib/customContentReviewedSupplyChainService.js';

const migration = name => readFileSync(resolve(
  process.cwd(),
  `supabase/migrations/${name}`,
), 'utf8');
const migrations = [
  '183_application_command_journal.sql',
  '185_custom_content_versions.sql',
  '186_campaign_content_binding_cas.sql',
  '187_custom_content_archive_transfer.sql',
  '188_reviewed_supply_chain_persistence.sql',
].map(migration);

const OWNER = '11111111-1111-4111-8111-111111111111';
const MALLORY = '22222222-2222-4222-8222-222222222222';
const RESOURCE_DEFINITION = '31000000-0000-4000-8000-000000000001';
const RESOURCE_REVISION = '32000000-0000-4000-8000-000000000001';
const INSTITUTION_DEFINITION = '31000000-0000-4000-8000-000000000002';
const INSTITUTION_REVISION = '32000000-0000-4000-8000-000000000002';
const ARTIFACT_A = '41000000-0000-4000-8000-000000000001';
const ARTIFACT_B = '41000000-0000-4000-8000-000000000002';
const LEGACY_ARTIFACT = '41000000-0000-4000-8000-000000000099';
const LEGACY_REVISION = '42000000-0000-4000-8000-000000000099';
const LEGACY_PACK = 'legacy-reviewed-mixed-pack';
const LEGACY_PACK_VERSION = '1.0.0';
const LEGACY_ENVIRONMENT = 'legacy-reviewed-environment';
const LEGACY_ENVIRONMENT_REVISION = 'legacy-reviewed-environment:r1';
const LEGACY_ENVIRONMENT_REVISION_2 = 'legacy-reviewed-environment:r2';
const LEGACY_CAMPAIGN_MAP = '61000000-0000-4000-8000-000000000099';
const LEGACY_MISMATCHED_DEFINITION =
  '41000000-0000-4000-8000-000000000098';
const LEGACY_ORPHAN_DEFINITION =
  '41000000-0000-4000-8000-000000000097';
const LEGACY_ORPHAN_REVISION =
  '42000000-0000-4000-8000-000000000097';
const RESOURCE_DATA = Object.freeze({
  name: 'Moon  Ore 😀',
  localUid: 'resource-moon-ore',
  commodities: ['moon ore'],
});
const INSTITUTION_DATA = Object.freeze({
  name: 'Silver Foundry',
  localUid: 'institution-silver-foundry',
  requires: ['moon ore'],
  produces: ['silver ingots'],
});
const RESOURCE_HASH = contentRevisionHash('resources', RESOURCE_DATA);
const INSTITUTION_HASH = contentRevisionHash(
  'institutions',
  INSTITUTION_DATA,
);
let db;
let legacyCampaignMapData;

function makeReviewedChain() {
  const nodes = [
    {
      uid: RESOURCE_DATA.localUid,
      name: RESOURCE_DATA.name,
      kind: 'resource',
      role: 'source',
      refId: `custom:${RESOURCE_DATA.localUid}`,
      source: 'custom',
      tierMin: 'hamlet',
      tierMax: 'metropolis',
      definitionId: RESOURCE_DEFINITION,
      revisionId: RESOURCE_REVISION,
      revisionNumber: 1,
      contentHash: RESOURCE_HASH,
    },
    {
      uid: INSTITUTION_DATA.localUid,
      name: INSTITUTION_DATA.name,
      kind: 'institution',
      role: 'processor',
      refId: `custom:${INSTITUTION_DATA.localUid}`,
      source: 'custom',
      tierMin: 'village',
      tierMax: 'city',
      definitionId: INSTITUTION_DEFINITION,
      revisionId: INSTITUTION_REVISION,
      revisionNumber: 1,
      contentHash: INSTITUTION_HASH,
    },
    {
      uid: 'prebuilt-river-market',
      name: 'River  Market',
      kind: 'service',
      role: 'processor',
      refId: 'prebuilt:river-market',
      source: 'prebuilt',
      tierMin: null,
      tierMax: null,
      definitionId: null,
      revisionId: null,
      revisionNumber: null,
      contentHash: null,
    },
    {
      uid: 'reference-northern-caravan',
      name: 'Northern Caravan',
      kind: 'good',
      role: 'sink',
      refId: null,
      source: 'reference',
      tierMin: null,
      tierMax: null,
      definitionId: null,
      revisionId: null,
      revisionNumber: null,
      contentHash: null,
    },
  ];
  const chain = {
    chainId: reviewedSupplyChainIdForNodeUids(nodes.map(node => node.uid)),
    status: 'vulnerable',
    label: 'Moon Ore → Silver  Foundry → Caravan',
    resource: RESOURCE_DATA.name,
    resourceIcon: '⛏️',
    resourceDepleted: false,
    processingInstitutions: [INSTITUTION_DATA.name, 'River  Market'],
    outputs: ['Silver Ingots'],
    services: ['Caravan Brokerage'],
    exportable: true,
    entrepot: false,
    upstreamMissing: ['Charcoal'],
    upstreamNote: 'Charcoal arrives every  third moon.',
    needLabel: 'Arcane metallurgy',
    needIcon: '⚙️',
    needColor: '#a0762a',
    discovered: {
      nodes,
      edges: [
        {
          from: nodes[0].uid,
          to: nodes[1].uid,
          commodity: 'moon ore',
        },
        {
          from: nodes[1].uid,
          to: nodes[2].uid,
          commodity: 'silver ingots',
        },
        {
          from: nodes[2].uid,
          to: nodes[3].uid,
          commodity: 'caravan allotment',
        },
      ],
      tradeEndpoints: {
        imports: [
          { label: 'Charcoal', source: 'trade', counterpart: null },
          { label: 'Flux', source: 'neighbour', counterpart: 'Lime' },
        ],
        exports: [
          {
            label: 'Silver Ingots',
            source: 'neighbour',
            counterpart: 'Northern  Marches',
          },
        ],
      },
    },
    verification: {
      state: 'discovered',
      userName: null,
      corrections: {},
      review: null,
    },
  };
  return confirmCustomSupplyChainReview(chain, {
    userName: 'Archivist Ω',
  });
}

function clone(value) {
  return structuredClone(value);
}

function resealProjection(chain) {
  const next = clone(chain);
  next.verification.review.projectionFingerprint =
    customSupplyChainProjectionFingerprint(next);
  return next;
}

function resealEnvironment(environment) {
  const next = clone(environment);
  next.environmentHash = fingerprintContent({
    schemaVersion: next.schemaVersion,
    environmentId: next.environmentId,
    environmentRevisionId: next.environmentRevisionId,
    revisionNumber: next.revisionNumber,
    source: next.source,
    packVersions: next.packVersions,
    directDefinitions: next.directDefinitions,
    tunables: next.tunables,
    visualSelection: next.visualSelection,
  });
  return next;
}

function resealBinding(binding) {
  const next = clone(binding);
  next.bindingHash = fingerprintContent({
    schemaVersion: next.schemaVersion,
    source: next.source,
    environment: next.environment,
    resolvedDefinitions: next.resolvedDefinitions,
  });
  return next;
}

async function seedEvidence(ownerId = OWNER) {
  await db.query(
    `insert into public.custom_content_definitions (
      id, owner_id, category, local_uid, head_revision_id
    ) values
      ($1, $2, 'resources', $3, null),
      ($4, $2, 'institutions', $5, null)`,
    [
      RESOURCE_DEFINITION,
      ownerId,
      RESOURCE_DATA.localUid,
      INSTITUTION_DEFINITION,
      INSTITUTION_DATA.localUid,
    ],
  );
  await db.query(
    `insert into public.custom_content_revisions (
      id, owner_id, definition_id, revision_no, schema_version,
      content_hash, data
    ) values
      ($1, $2, $3, 1, 1, $4, $5::jsonb),
      ($6, $2, $7, 1, 1, $8, $9::jsonb)`,
    [
      RESOURCE_REVISION,
      ownerId,
      RESOURCE_DEFINITION,
      RESOURCE_HASH,
      JSON.stringify(authoredDataOf(RESOURCE_DATA)),
      INSTITUTION_REVISION,
      INSTITUTION_DEFINITION,
      INSTITUTION_HASH,
      JSON.stringify(authoredDataOf(INSTITUTION_DATA)),
    ],
  );
  await db.query(
    `update public.custom_content_definitions
        set head_revision_id = case id
          when $1::uuid then $2::uuid
          when $3::uuid then $4::uuid
        end
      where owner_id = $5`,
    [
      RESOURCE_DEFINITION,
      RESOURCE_REVISION,
      INSTITUTION_DEFINITION,
      INSTITUTION_REVISION,
      ownerId,
    ],
  );
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

async function asDatabaseRole(role, operation) {
  if (!['authenticated', 'service_role'].includes(role)) {
    throw new TypeError('Unsupported test database role.');
  }
  return db.transaction(async (transaction) => {
    await transaction.query(`set local role ${role}`);
    return operation(transaction);
  });
}

async function applyReviewed(preview, commandId, ownerId = OWNER) {
  const response = await asUser(
    ownerId,
    `select public.apply_reviewed_supply_chain_command(
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

async function applyAuthorable(preview, commandId, ownerId = OWNER) {
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

function confirmPreview(
  artifactId,
  chain,
  expectedHeadRevisionId = null,
  expectedLifecycleVersion = null,
) {
  return previewReviewedSupplyChainCommand({
    schemaVersion: 1,
    kind: REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.CONFIRM,
    artifactId,
    expectedHeadRevisionId,
    expectedLifecycleVersion,
    chain,
  });
}

function removePreview(
  artifactId,
  expectedHeadRevisionId,
  expectedLifecycleVersion,
) {
  return previewReviewedSupplyChainCommand({
    schemaVersion: 1,
    kind: REVIEWED_SUPPLY_CHAIN_COMMAND_KIND.REMOVE,
    artifactId,
    expectedHeadRevisionId,
    expectedLifecycleVersion,
    chain: null,
  });
}

function commandId(label, preview) {
  return `test:${label}:${preview.fingerprint}`;
}

function localAuthorityHarness() {
  let revisionSequence = 0;
  let timeSequence = 0;
  let ledger = {
    schemaVersion: 1,
    definitions: {
      [RESOURCE_DEFINITION]: {
        id: RESOURCE_DEFINITION,
        category: 'resources',
        localUid: RESOURCE_DATA.localUid,
        headRevisionId: RESOURCE_REVISION,
        archivedAt: null,
        createdAt: '2026-07-25T00:00:00.000Z',
        updatedAt: '2026-07-25T00:00:00.000Z',
        legacyContentId: null,
      },
      [INSTITUTION_DEFINITION]: {
        id: INSTITUTION_DEFINITION,
        category: 'institutions',
        localUid: INSTITUTION_DATA.localUid,
        headRevisionId: INSTITUTION_REVISION,
        archivedAt: null,
        createdAt: '2026-07-25T00:00:00.000Z',
        updatedAt: '2026-07-25T00:00:00.000Z',
        legacyContentId: null,
      },
    },
    revisions: {
      [RESOURCE_REVISION]: {
        schemaVersion: 1,
        id: RESOURCE_REVISION,
        definitionId: RESOURCE_DEFINITION,
        category: 'resources',
        revisionNumber: 1,
        parentRevisionId: null,
        contentHash: RESOURCE_HASH,
        data: authoredDataOf(RESOURCE_DATA),
        createdAt: '2026-07-25T00:00:00.000Z',
      },
      [INSTITUTION_REVISION]: {
        schemaVersion: 1,
        id: INSTITUTION_REVISION,
        definitionId: INSTITUTION_DEFINITION,
        category: 'institutions',
        revisionNumber: 1,
        parentRevisionId: null,
        contentHash: INSTITUTION_HASH,
        data: authoredDataOf(INSTITUTION_DATA),
        createdAt: '2026-07-25T00:00:00.000Z',
      },
    },
    commandReceipts: {},
  };
  const authority = {
    withLock: async (_ownerId, task) => task(),
    load: () => ledger,
    persist: next => {
      ledger = next;
    },
    makeRevisionId: () => {
      revisionSequence += 1;
      return `local-reviewed-revision-${revisionSequence}`;
    },
    now: () => {
      timeSequence += 1;
      return new Date(
        Date.UTC(2026, 6, 25, 0, 0, timeSequence),
      ).toISOString();
    },
    receipt: customContentLocalReceipt,
  };
  return {
    authority,
    read: () => ledger,
    apply: (preview, options = {}) => executeReviewedSupplyChainLocalAuthority(
      preview,
      { ownerId: OWNER, ...options },
      authority,
    ),
  };
}

function archiveGraphForReviewedItem(item) {
  const definition = (id, category, localUid, headRevisionId) => ({
    id,
    category,
    localUid,
    headRevisionId,
    archivedAt: null,
    createdAt: '2026-07-25T00:00:00.000Z',
    updatedAt: '2026-07-25T00:00:00.000Z',
    legacyContentId: null,
  });
  const revision = (
    id,
    definitionId,
    category,
    contentHash,
    data,
  ) => ({
    schemaVersion: 1,
    id,
    definitionId,
    category,
    revisionNumber: 1,
    parentRevisionId: null,
    contentHash,
    data,
    createdAt: '2026-07-25T00:00:00.000Z',
  });
  return {
    definitions: [
      definition(
        RESOURCE_DEFINITION,
        'resources',
        RESOURCE_DATA.localUid,
        RESOURCE_REVISION,
      ),
      definition(
        INSTITUTION_DEFINITION,
        'institutions',
        INSTITUTION_DATA.localUid,
        INSTITUTION_REVISION,
      ),
      definition(
        item.definitionId,
        'supplyChains',
        item.localUid,
        item.revisionId,
      ),
    ],
    revisions: [
      revision(
        RESOURCE_REVISION,
        RESOURCE_DEFINITION,
        'resources',
        RESOURCE_HASH,
        authoredDataOf(RESOURCE_DATA),
      ),
      revision(
        INSTITUTION_REVISION,
        INSTITUTION_DEFINITION,
        'institutions',
        INSTITUTION_HASH,
        authoredDataOf(INSTITUTION_DATA),
      ),
      revision(
        item.revisionId,
        item.definitionId,
        'supplyChains',
        item.contentHash,
        admitReviewedSupplyChain(item, {
          allowPersistenceFields: true,
        }).chain,
      ),
    ],
  };
}

function mixedReviewedArchive(item, {
  archivedAt = null,
  updatedAt = '2026-07-25T00:00:00.000Z',
  sourceKey = 'mixed-reviewed-source',
} = {}) {
  const graph = archiveGraphForReviewedItem(item);
  graph.definitions = graph.definitions.map(definition => (
    definition.category === 'supplyChains'
      ? { ...definition, archivedAt, updatedAt }
      : definition
  ));
  const revisionById = new Map(graph.revisions.map(revision => [
    revision.id,
    revision,
  ]));
  const environment = makeContentEnvironmentRevision({
    environmentId: 'mixed-reviewed-environment',
    environmentRevisionId: 'mixed-reviewed-environment:r1',
    source: 'mixed-reviewed-archive',
    directDefinitions: graph.definitions.map((definition) => {
      const head = revisionById.get(definition.headRevisionId);
      return {
        definitionId: definition.id,
        revisionId: head.id,
        contentHash: head.contentHash,
        category: definition.category,
      };
    }),
    createdAt: '2026-07-25T00:00:00.000Z',
  });
  const archive = sealCustomContentArchive({
    schemaVersion: 1,
    definitions: graph.definitions,
    revisions: graph.revisions,
    packs: [],
    packVersions: [],
    packEntryDefinitions: [],
    packVersionEntries: [],
    environments: [environment],
    activeEnvironmentRevisionId: environment.environmentRevisionId,
    commandReceipts: [],
  }, {
    sourceType: 'test',
    sourceKey,
    exportedAt: updatedAt,
  });
  return { archive, environment, graph };
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
        select 1
          from public.profiles
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

    insert into auth.users (id) values ('${OWNER}'), ('${MALLORY}');
    insert into public.profiles (id) values ('${OWNER}'), ('${MALLORY}');
  `);
  for (const sql of migrations.slice(0, -1)) await db.exec(sql);

  // Seed an exact-looking pre-188 artifact. Shape and hashes are valid, but it
  // never traversed the dedicated reviewed command and therefore has no
  // authority. Migration 188 must quarantine it even though it looks genuine.
  await seedEvidence();
  const legacyChain = makeReviewedChain();
  await db.query(
    `insert into public.custom_content_definitions (
      id, owner_id, category, local_uid, head_revision_id
    ) values ($1, $2, 'supplyChains', 'legacy-reviewed-chain', null)`,
    [LEGACY_ARTIFACT, OWNER],
  );
  await db.query(
    `insert into public.custom_content_revisions (
      id, owner_id, definition_id, revision_no, schema_version,
      content_hash, data
    ) values ($1, $2, $3, 1, 1, $4, $5::jsonb)`,
    [
      LEGACY_REVISION,
      OWNER,
      LEGACY_ARTIFACT,
      reviewedSupplyChainContentHash(legacyChain),
      JSON.stringify(legacyChain),
    ],
  );
  await db.query(
    `update public.custom_content_definitions
        set head_revision_id = $1
      where owner_id = $2 and id = $3`,
    [LEGACY_REVISION, OWNER, LEGACY_ARTIFACT],
  );
  // The false reviewed authority can be embedded in otherwise legitimate
  // pack/environment state. Quarantine must preserve the complete mixed
  // evidence, remove every dangling authority edge, and leave the unrelated
  // authorable definition itself intact.
  const legacyEnvironment = {
    schemaVersion: 1,
    environmentId: LEGACY_ENVIRONMENT,
    environmentRevisionId: LEGACY_ENVIRONMENT_REVISION,
    revisionNumber: 1,
    source: 'pre-188-drift-fixture',
    packVersions: [],
    directDefinitions: [{
      // Manual/service drift can lie about the definition while retaining the
      // exact reviewed revision identity. Quarantine follows either authority
      // address so this cannot survive as a dangling executable snapshot.
      definitionId: RESOURCE_DEFINITION,
      revisionId: LEGACY_REVISION,
      contentHash: reviewedSupplyChainContentHash(legacyChain),
      category: 'supplyChains',
    }, {
      definitionId: RESOURCE_DEFINITION,
      revisionId: RESOURCE_REVISION,
      contentHash: RESOURCE_HASH,
      category: 'resources',
    }],
    tunables: {},
    visualSelection: {},
    environmentHash: 'b'.repeat(64),
    createdAt: '2026-07-25T00:00:00.000Z',
  };
  const cleanEnvironmentSuffix = {
    ...legacyEnvironment,
    environmentRevisionId: LEGACY_ENVIRONMENT_REVISION_2,
    revisionNumber: 2,
    packVersions: [],
    directDefinitions: [legacyEnvironment.directDefinitions[1]],
    environmentHash: 'd'.repeat(64),
    createdAt: '2026-07-25T00:00:01.000Z',
  };
  await db.transaction(async (transaction) => {
    await transaction.query(
      `insert into public.content_packs (
         owner_id, pack_id, name
       ) values ($1, $2, 'Legacy mixed pack')`,
      [OWNER, LEGACY_PACK],
    );
    await transaction.query(
      `insert into public.content_pack_versions (
         owner_id, pack_id, pack_version, manifest_hash,
         import_plan_hash, manifest
       ) values ($1, $2, $3, $4, $5, '{}'::jsonb)`,
      [
        OWNER,
        LEGACY_PACK,
        LEGACY_PACK_VERSION,
        'a'.repeat(64),
        'c'.repeat(64),
      ],
    );
    await transaction.query(
      `insert into public.content_pack_entry_definitions (
         owner_id, pack_id, pack_entry_id, definition_id
       ) values
         ($1, $2, 'reviewed-entry', $3),
         ($1, $2, 'resource-entry', $4)`,
      [OWNER, LEGACY_PACK, LEGACY_ARTIFACT, RESOURCE_DEFINITION],
    );
    await transaction.query(
      `insert into public.content_pack_version_entries (
         owner_id, pack_id, pack_version, pack_entry_id,
         definition_id, revision_id, category, ordinal
       ) values
         ($1, $2, $3, 'reviewed-entry', $4, $5, 'supplyChains', 0),
         ($1, $2, $3, 'resource-entry', $6, $7, 'resources', 1)`,
      [
        OWNER,
        LEGACY_PACK,
        LEGACY_PACK_VERSION,
        LEGACY_ARTIFACT,
        LEGACY_REVISION,
        RESOURCE_DEFINITION,
        RESOURCE_REVISION,
      ],
    );
    await transaction.query(
      `update public.content_packs
          set active_pack_version = $3,
              active_manifest_hash = $4
        where owner_id = $1 and pack_id = $2`,
      [OWNER, LEGACY_PACK, LEGACY_PACK_VERSION, 'a'.repeat(64)],
    );
    await transaction.query(
      `insert into public.content_environments (
         owner_id, environment_id
       ) values ($1, $2)`,
      [OWNER, LEGACY_ENVIRONMENT],
    );
    await transaction.query(
      `insert into public.content_environment_revisions (
         owner_id, environment_id, environment_revision_id,
         revision_no, environment_hash, revision
       ) values
         ($1, $2, $3, 1, $4, $5::jsonb),
         ($1, $2, $6, 2, $7, $8::jsonb)`,
      [
        OWNER,
        LEGACY_ENVIRONMENT,
        LEGACY_ENVIRONMENT_REVISION,
        'b'.repeat(64),
        JSON.stringify(legacyEnvironment),
        LEGACY_ENVIRONMENT_REVISION_2,
        'd'.repeat(64),
        JSON.stringify(cleanEnvironmentSuffix),
      ],
    );
    await transaction.query(
      `insert into public.content_environment_activations (
       owner_id, environment_revision_id
       ) values ($1, $2)`,
      [OWNER, LEGACY_ENVIRONMENT_REVISION_2],
    );
  });
  const legacyReviewedItem = {
    ...legacyChain,
    // Exact legacy reviewed revision, deliberately false definition address.
    id: LEGACY_MISMATCHED_DEFINITION,
    definitionId: LEGACY_MISMATCHED_DEFINITION,
    revisionId: LEGACY_REVISION,
    revisionNumber: 1,
    contentHash: reviewedSupplyChainContentHash(legacyChain),
    localUid: 'legacy-reviewed-chain',
    isCustom: true,
    createdAt: '2026-07-25T00:00:00.000Z',
    updatedAt: '2026-07-25T00:00:00.000Z',
    archivedAt: null,
    _schemaVersion: 1,
  };
  const legacyCampaignBinding = makeCampaignContentBinding({
    supplyChains: [legacyReviewedItem],
  }, {
    source: 'pre-188-self-signed-campaign',
  });
  const orphanCampaignBinding = makeCampaignContentBinding({
    supplyChains: [{
      ...legacyReviewedItem,
      id: LEGACY_ORPHAN_DEFINITION,
      definitionId: LEGACY_ORPHAN_DEFINITION,
      revisionId: LEGACY_ORPHAN_REVISION,
    }],
  }, {
    source: 'pre-188-orphan-reviewed-campaign',
  });
  legacyCampaignMapData = {
    campaign: {
      contentBinding: legacyCampaignBinding,
      contentBindingHistory: [
        legacyCampaignBinding,
        orphanCampaignBinding,
      ],
      contentBindingStatus: 'pinned',
    },
  };
  await db.exec(`
    alter table public.saved_maps
      disable trigger trg_saved_maps_campaign_content_binding_cas
  `);
  await db.query(
    `insert into public.saved_maps (
       id, user_id, name, map_data
     ) values ($1, $2, 'Legacy self-signed campaign', $3::jsonb)`,
    [LEGACY_CAMPAIGN_MAP, OWNER, JSON.stringify(legacyCampaignMapData)],
  );
  await db.exec(`
    alter table public.saved_maps
      enable trigger trg_saved_maps_campaign_content_binding_cas
  `);
  await db.exec(migrations.at(-1));
}, 60_000);

afterAll(async () => {
  await db?.close();
});

beforeEach(async () => {
  await db.exec(`
    update public.custom_content_definitions
       set archived_at = null
     where owner_id = '${OWNER}'
       and id = '${RESOURCE_DEFINITION}';
    delete from public.application_command_journal
      where owner_id = '${OWNER}'
        and command_id = 'test:cross-lane-owner-lock-order';
    delete from public.custom_content_archive_imports
      where owner_id = '${MALLORY}';
    delete from public.application_command_journal
      where owner_id = '${MALLORY}';
    delete from public.content_environment_activations
      where owner_id = '${MALLORY}';
    delete from public.content_environment_revisions
      where owner_id = '${MALLORY}';
    delete from public.content_environments
      where owner_id = '${MALLORY}';
    delete from public.content_pack_version_entries
      where owner_id = '${MALLORY}';
    delete from public.content_pack_entry_definitions
      where owner_id = '${MALLORY}';
    delete from public.content_pack_versions
      where owner_id = '${MALLORY}';
    delete from public.content_packs
      where owner_id = '${MALLORY}';
    delete from public.custom_content_revisions
      where owner_id = '${MALLORY}';
    delete from public.custom_content_definitions
      where owner_id = '${MALLORY}';
  `);
  await db.query(
    `delete from public.custom_content_definitions
      where category = 'supplyChains'`,
  );
  await db.query(
    `delete from public.application_command_journal
      where kind in (
        'content.reviewed-supply-chain.confirm',
        'content.reviewed-supply-chain.remove'
      )`,
  );
});

describe('migration 188 reviewed supply-chain authority', () => {
  test('the complete migration band applies and exposes only dedicated writes', async () => {
    const functions = await db.query(`
      select
        to_regprocedure(
          'public.apply_reviewed_supply_chain_command(uuid,text,text,jsonb)'
        ) is not null as reviewed_rpc,
        to_regprocedure(
          'public.apply_custom_content_command(uuid,text,text,jsonb)'
        ) is not null as generic_rpc,
        to_regprocedure(
          'public._apply_custom_content_command_authorable(uuid,text,text,jsonb)'
        ) is not null as generic_inner,
        to_regprocedure(
          'public._reviewed_supply_chain_patch_function(regprocedure,jsonb)'
        ) is null as patch_helper_removed,
        has_function_privilege(
          'authenticated',
          'public.apply_reviewed_supply_chain_command(uuid,text,text,jsonb)',
          'execute'
        ) as reviewed_rpc_allowed,
        has_function_privilege(
          'authenticated',
          'public._apply_custom_content_command_authorable(uuid,text,text,jsonb)',
          'execute'
        ) as generic_inner_denied,
        has_function_privilege(
          'authenticated',
          'public._reviewed_supply_chain_record_valid(jsonb)',
          'execute'
        ) as reviewed_helper_denied
    `);

    expect(functions.rows[0]).toEqual({
      reviewed_rpc: true,
      generic_rpc: true,
      generic_inner: true,
      patch_helper_removed: true,
      reviewed_rpc_allowed: true,
      generic_inner_denied: false,
      reviewed_helper_denied: false,
    });
  });

  test('service role cannot forge reviewed authority through journal DML', async () => {
    const privileges = await db.query(`
      select
        has_table_privilege(
          'service_role',
          'public.application_command_journal',
          'select'
        ) as can_select,
        has_table_privilege(
          'service_role',
          'public.application_command_journal',
          'insert'
        ) as can_insert,
        has_table_privilege(
          'service_role',
          'public.application_command_journal',
          'update'
        ) as can_update,
        has_table_privilege(
          'service_role',
          'public.application_command_journal',
          'delete'
        ) as can_delete,
        has_function_privilege(
          'service_role',
          'public.claim_application_command'
          || '(uuid,text,text,text,uuid,timestamptz)',
          'execute'
        ) as can_claim,
        has_function_privilege(
          'service_role',
          'public.finalize_application_command'
          || '(uuid,text,text,text,jsonb,text)',
          'execute'
        ) as can_finalize,
        has_function_privilege(
          'service_role',
          'public.mark_application_command_reconcile'
          || '(uuid,text,text,text)',
          'execute'
        ) as can_reconcile
    `);
    expect(privileges.rows[0]).toEqual({
      can_select: true,
      can_insert: false,
      can_update: false,
      can_delete: false,
      can_claim: false,
      can_finalize: false,
      can_reconcile: false,
    });

    const commandId = 'test:service-role-reviewed-forgery';
    const fingerprint = '8'.repeat(64);
    await expect(asDatabaseRole(
      'service_role',
      transaction => transaction.query(
        `select public.claim_application_command(
           $1::uuid, $2::text, $3::text,
           'content.reviewed-supply-chain.confirm', $4::uuid, null
         )`,
        [OWNER, commandId, fingerprint, ARTIFACT_B],
      ),
    )).rejects.toMatchObject({ code: '42501' });

    await db.query(
      `select public.claim_application_command(
         $1::uuid, $2::text, $3::text,
         'content.reviewed-supply-chain.confirm', $4::uuid, null
       )`,
      [OWNER, commandId, fingerprint, ARTIFACT_B],
    );
    await expect(asDatabaseRole(
      'service_role',
      transaction => transaction.query(
        `update public.application_command_journal
            set authority_transaction_id = txid_current()
          where owner_id = $1 and command_id = $2`,
        [OWNER, commandId],
      ),
    )).rejects.toMatchObject({ code: '42501' });

    await expect(asDatabaseRole(
      'service_role',
      async (transaction) => {
        await transaction.query(
          `select set_config(
             'settlementforge.reviewed_chain_command',
             $1,
             true
           )`,
          [commandId],
        );
        return transaction.query(
          `insert into public.custom_content_definitions (
             id, owner_id, category, local_uid
           ) values ($1, $2, 'supplyChains', $3)`,
          [ARTIFACT_B, OWNER, 'forged-reviewed-chain'],
        );
      },
    )).rejects.toMatchObject({ code: '42501' });

    const forged = await db.query(
      `select
         exists (
           select 1
             from public.custom_content_definitions
            where id = $1
         ) as definition_exists,
         authority_transaction_id
        from public.application_command_journal
       where owner_id = $2 and command_id = $3`,
      [ARTIFACT_B, OWNER, commandId],
    );
    expect(forged.rows[0]).toEqual({
      definition_exists: false,
      authority_transaction_id: null,
    });
  });

  test('all reviewed mutation lanes acquire the shared owner lock first', async () => {
    const definitions = await db.query(`
      select
        pg_get_functiondef(
          'public.apply_reviewed_supply_chain_command(uuid,text,text,jsonb)'
            ::regprocedure
        ) as reviewed,
        pg_get_functiondef(
          'public.import_custom_content_archive(uuid,text,text,jsonb)'
            ::regprocedure
        ) as archive,
        pg_get_functiondef(
          'public._apply_custom_content_command_authorable(uuid,text,text,jsonb)'
            ::regprocedure
        ) as authorable
    `);
    const { reviewed, archive, authorable } = definitions.rows[0];
    const ownerLock = "hashtext('custom-content-owner')";
    expect(reviewed.indexOf(ownerLock)).toBeGreaterThan(-1);
    expect(reviewed.indexOf(ownerLock)).toBeLessThan(
      reviewed.indexOf('claim_application_command'),
    );
    expect(reviewed.indexOf(ownerLock)).toBeLessThan(
      reviewed.indexOf('reviewed-supply-chain-artifact:'),
    );
    expect(reviewed.indexOf('reviewed-supply-chain-artifact:')).toBeLessThan(
      reviewed.indexOf('reviewed-supply-chain-identity:'),
    );
    expect(archive.indexOf(ownerLock)).toBeGreaterThan(-1);
    expect(archive.indexOf(ownerLock)).toBeLessThan(
      archive.indexOf('claim_application_command'),
    );
    expect(archive.indexOf(ownerLock)).toBeLessThan(
      archive.indexOf('reviewed-supply-chain-identity:'),
    );
    expect(authorable.indexOf(ownerLock)).toBeGreaterThan(-1);
    expect(authorable.indexOf(ownerLock)).toBeLessThan(
      authorable.indexOf('claim_application_command'),
    );
  });

  test('authorable and reviewed commands sharing an id converge without a deadlock', async () => {
    const authorable = previewCustomContentCommand({
      kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
      definitionId: RESOURCE_DEFINITION,
      expectedHeadRevisionId: RESOURCE_REVISION,
    });
    const reviewed = confirmPreview(ARTIFACT_A, makeReviewedChain());
    const sharedCommandId = 'test:cross-lane-owner-lock-order';

    const settled = await Promise.allSettled([
      applyAuthorable(authorable, sharedCommandId),
      applyReviewed(reviewed, sharedCommandId),
    ]);
    const databaseErrors = settled
      .filter(outcome => outcome.status === 'rejected')
      .map(outcome => outcome.reason);
    expect(databaseErrors.map(error => error?.code)).not.toContain('40P01');
    expect(databaseErrors).toEqual([]);

    const results = settled
      .filter(outcome => outcome.status === 'fulfilled')
      .map(outcome => outcome.value);
    expect(results[0]).toMatchObject({
      status: 'applied',
      replayed: false,
      perEntry: [{
        definitionId: RESOURCE_DEFINITION,
        status: 'archived',
      }],
    });
    expect(results[1]).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'command_id_conflict',
      replayed: true,
    });

    const journal = await db.query(
      `select kind, status, phase, fingerprint
         from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [OWNER, sharedCommandId],
    );
    expect(journal.rows).toEqual([{
      kind: CUSTOM_CONTENT_COMMAND_KIND.ARCHIVE,
      status: 'applied',
      phase: 'finalized',
      fingerprint: authorable.fingerprint,
    }]);

    // Keep the suite's shared evidence fixture pristine. The command and its
    // journal row were fully asserted above; later cases should not inherit
    // this deliberately adversarial lifecycle mutation.
    await db.query(
      `update public.custom_content_definitions
          set archived_at = null
        where owner_id = $1 and id = $2`,
      [OWNER, RESOURCE_DEFINITION],
    );
    await db.query(
      `delete from public.application_command_journal
        where owner_id = $1 and command_id = $2`,
      [OWNER, sharedCommandId],
    );
  });

  test('direct definition writes cannot mint reviewed authority', async () => {
    await db.query(
      `select public.claim_application_command(
         $1::uuid, $2::text, $3::text, 'content.archive.import', null, null
       )`,
      [
        MALLORY,
        'test:abandoned-archive-claim',
        '9'.repeat(64),
      ],
    );
    await expect(db.query(
      `insert into public.custom_content_definitions (
         id, owner_id, category, local_uid
       ) values ($1, $2, 'supplyChains', 'manual-reviewed-drift')`,
      ['41000000-0000-4000-8000-000000000088', MALLORY],
    )).rejects.toThrow(/reviewed supply-chain write lacks authority/i);
    const survived = await db.query(
      `select count(*)::integer as count
         from public.custom_content_definitions
        where id = $1`,
      ['41000000-0000-4000-8000-000000000088'],
    );
    expect(survived.rows[0].count).toBe(0);

    const preview = confirmPreview(ARTIFACT_B, makeReviewedChain());
    const created = await applyReviewed(
      preview,
      commandId('direct-drift-guard', preview),
    );
    expect(created.ok).toBe(true);
    await expect(db.query(
      `update public.custom_content_definitions
          set archived_at = clock_timestamp()
        where owner_id = $1 and id = $2`,
      [OWNER, ARTIFACT_B],
    )).rejects.toThrow(/reviewed supply-chain write lacks authority/i);
    const unchanged = await db.query(
      `select archived_at from public.custom_content_definitions
        where owner_id = $1 and id = $2`,
      [OWNER, ARTIFACT_B],
    );
    expect(unchanged.rows[0].archived_at).toBeNull();
  });

  test('command replay, CAS, and concurrent creates converge on one head', async () => {
    const chain = makeReviewedChain();
    const preview = confirmPreview(ARTIFACT_A, chain);
    const firstId = commandId('concurrent-a', preview);
    const secondId = commandId('concurrent-b', preview);
    const outcomes = await Promise.all([
      applyReviewed(preview, firstId),
      applyReviewed(preview, secondId),
    ]);
    const applied = outcomes.find(result => result.status === 'applied');
    const refused = outcomes.find(result => result.status !== 'applied');

    expect(applied).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: false,
      result: {
        artifactId: ARTIFACT_A,
        item: { reviewedLifecycleVersion: 1 },
      },
    });
    expect(refused).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'reviewed_supply_chain_head_changed',
    });

    const replayed = await applyReviewed(
      preview,
      applied.commandId,
    );
    expect(replayed).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: true,
      result: {
        headRevisionId: applied.result.headRevisionId,
        item: { reviewedLifecycleVersion: 1 },
      },
    });

    const staleLifecycle = confirmPreview(
      ARTIFACT_A,
      chain,
      applied.result.headRevisionId,
      2,
    );
    const stale = await applyReviewed(
      staleLifecycle,
      commandId('stale-lifecycle', staleLifecycle),
    );
    expect(stale).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'reviewed_supply_chain_lifecycle_changed',
    });
    const commandConflict = await applyReviewed(
      staleLifecycle,
      applied.commandId,
    );
    expect(commandConflict).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'command_id_conflict',
      replayed: true,
      commandId: applied.commandId,
      fingerprint: staleLifecycle.fingerprint,
      result: { artifactId: ARTIFACT_A },
    });
    expect(admitReviewedSupplyChainRpcReceipt(
      commandConflict,
      applied.commandId,
      staleLifecycle,
    )).toMatchObject({
      ok: false,
      status: 'failed',
      persistence: { state: 'confirmed' },
      needsReconciliation: false,
    });

    const rows = await db.query(
      `select count(*)::integer as definitions,
              count(distinct revision.id)::integer as revisions
         from public.custom_content_definitions definition
         join public.custom_content_revisions revision
           on revision.definition_id = definition.id
        where definition.id = $1`,
      [ARTIFACT_A],
    );
    expect(rows.rows[0]).toEqual({ definitions: 1, revisions: 1 });
  });

  test('SQL lifecycle generations survive repeated archive/restore ABA cycles', async () => {
    const chain = makeReviewedChain();
    const createdPreview = confirmPreview(ARTIFACT_A, chain);
    const createdCommandId = commandId(
      'lifecycle-create',
      createdPreview,
    );
    const created = await applyReviewed(
      createdPreview,
      createdCommandId,
    );
    expect(admitReviewedSupplyChainRpcReceipt(
      created,
      createdCommandId,
      createdPreview,
    )).toMatchObject({
      ok: true,
      status: 'applied',
      needsReconciliation: false,
    });
    const impossibleCreateGeneration = clone(created);
    impossibleCreateGeneration.result.item.reviewedLifecycleVersion = 99;
    expect(admitReviewedSupplyChainRpcReceipt(
      impossibleCreateGeneration,
      createdCommandId,
      createdPreview,
    )).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      needsReconciliation: true,
    });
    const corruptRevisionTuple = clone(created);
    corruptRevisionTuple.result.item.revisionNumber = 0;
    expect(admitReviewedSupplyChainRpcReceipt(
      corruptRevisionTuple,
      createdCommandId,
      createdPreview,
    )).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      needsReconciliation: true,
    });
    const contradictoryArchivedCreate = clone(created);
    contradictoryArchivedCreate.result.item.archivedAt =
      '2026-07-25T00:00:00.000Z';
    expect(admitReviewedSupplyChainRpcReceipt(
      contradictoryArchivedCreate,
      createdCommandId,
      createdPreview,
    )).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      needsReconciliation: true,
    });
    const headRevisionId = created.result.headRevisionId;
    let lifecycleVersion = created.result.item.reviewedLifecycleVersion;
    const archiveFingerprints = [];

    for (let cycle = 1; cycle <= 2; cycle += 1) {
      const archive = removePreview(
        ARTIFACT_A,
        headRevisionId,
        lifecycleVersion,
      );
      archiveFingerprints.push(archive.fingerprint);
      const archived = await applyReviewed(
        archive,
        commandId(`lifecycle-archive-${cycle}`, archive),
      );
      const impossibleExistingGeneration = clone(archived);
      impossibleExistingGeneration.result.archivedItem
        .reviewedLifecycleVersion = lifecycleVersion + 2;
      expect(admitReviewedSupplyChainRpcReceipt(
        impossibleExistingGeneration,
        commandId(`lifecycle-archive-${cycle}`, archive),
        archive,
      )).toMatchObject({
        ok: false,
        status: 'reconcile-required',
        needsReconciliation: true,
      });
      lifecycleVersion += 1;
      expect(archived).toMatchObject({
        ok: true,
        result: {
          headRevisionId,
          archivedItem: {
            revisionId: headRevisionId,
            reviewedLifecycleVersion: lifecycleVersion,
          },
        },
      });

      const restore = confirmPreview(
        ARTIFACT_A,
        chain,
        headRevisionId,
        lifecycleVersion,
      );
      const restored = await applyReviewed(
        restore,
        commandId(`lifecycle-restore-${cycle}`, restore),
      );
      lifecycleVersion += 1;
      expect(restored).toMatchObject({
        ok: true,
        result: {
          headRevisionId,
          item: {
            archivedAt: null,
            revisionId: headRevisionId,
            reviewedLifecycleVersion: lifecycleVersion,
          },
        },
      });
    }

    expect(new Set(archiveFingerprints).size).toBe(2);
    const finalArchive = removePreview(
      ARTIFACT_A,
      headRevisionId,
      lifecycleVersion,
    );
    expect(finalArchive.fingerprint).not.toBe(archiveFingerprints[0]);
    const finalReceipt = await applyReviewed(
      finalArchive,
      commandId('lifecycle-archive-final', finalArchive),
    );
    expect(finalReceipt.result.archivedItem.reviewedLifecycleVersion)
      .toBe(6);

    const persisted = await db.query(
      `select head_revision_id, archived_at is not null as archived,
              reviewed_lifecycle_version
         from public.custom_content_definitions
        where id = $1`,
      [ARTIFACT_A],
    );
    expect(persisted.rows[0]).toEqual({
      head_revision_id: headRevisionId,
      archived: true,
      reviewed_lifecycle_version: 6,
    });
  });

  test('local lifecycle generations prevent repeated-cycle receipt resurrection', async () => {
    const harness = localAuthorityHarness();
    const chain = makeReviewedChain();
    const created = await harness.apply(confirmPreview(ARTIFACT_A, chain));
    const headRevisionId = created.result.headRevisionId;
    let lifecycleVersion = created.result.item.reviewedLifecycleVersion;
    const archiveCommandIds = [];

    for (let cycle = 1; cycle <= 2; cycle += 1) {
      const archived = await harness.apply(removePreview(
        ARTIFACT_A,
        headRevisionId,
        lifecycleVersion,
      ));
      archiveCommandIds.push(archived.commandId);
      lifecycleVersion += 1;
      expect(archived.result.archivedItem.reviewedLifecycleVersion)
        .toBe(lifecycleVersion);

      const restored = await harness.apply(confirmPreview(
        ARTIFACT_A,
        chain,
        headRevisionId,
        lifecycleVersion,
      ));
      lifecycleVersion += 1;
      expect(restored.result.item).toMatchObject({
        archivedAt: null,
        revisionId: headRevisionId,
        reviewedLifecycleVersion: lifecycleVersion,
      });
    }

    expect(new Set(archiveCommandIds).size).toBe(2);
    const final = await harness.apply(removePreview(
      ARTIFACT_A,
      headRevisionId,
      lifecycleVersion,
    ));
    expect(final.commandId).not.toBe(archiveCommandIds[0]);
    expect(final.result.archivedItem.reviewedLifecycleVersion).toBe(6);
    expect(harness.read().definitions[ARTIFACT_A]).toMatchObject({
      headRevisionId,
      reviewedLifecycleVersion: 6,
    });
    expect(harness.read().definitions[ARTIFACT_A].archivedAt).toBeTruthy();
  });

  test('pre-generation local artifacts never self-promote from local receipts', async () => {
    const receiptBearingHarness = localAuthorityHarness();
    await receiptBearingHarness.apply(confirmPreview(
      ARTIFACT_A,
      makeReviewedChain(),
    ));
    delete receiptBearingHarness
      .read()
      .definitions[ARTIFACT_A]
      .reviewedLifecycleVersion;
    expect(backfillLegacyCustomContentLedger(
      receiptBearingHarness.read(),
      {},
    )).toBe(true);
    expect(
      receiptBearingHarness.read().definitions[ARTIFACT_A],
    ).toBeUndefined();
    expect(Object.values(receiptBearingHarness.read().commandReceipts))
      .toContainEqual(expect.objectContaining({
        receipt: expect.objectContaining({
          reason: 'legacy_reviewed_supply_chain_generation_quarantined',
        }),
      }));

    const forgedReceiptHarness = localAuthorityHarness();
    await forgedReceiptHarness.apply(confirmPreview(
      ARTIFACT_B,
      makeReviewedChain(),
    ));
    forgedReceiptHarness
      .read()
      .definitions[ARTIFACT_B]
      .reviewedLifecycleVersion = 0;
    forgedReceiptHarness.read().commandReceipts.forged = {
      fingerprint: 'f'.repeat(64),
      receipt: {
        status: 'applied',
        result: {
          artifactId: ARTIFACT_B,
          headRevisionId: forgedReceiptHarness
            .read()
            .definitions[ARTIFACT_B]
            .headRevisionId,
        },
        perEntry: [{
          category: 'supplyChains',
          definitionId: ARTIFACT_B,
        }],
      },
    };
    expect(backfillLegacyCustomContentLedger(
      forgedReceiptHarness.read(),
      {},
    )).toBe(true);
    expect(forgedReceiptHarness.read().definitions[ARTIFACT_B])
      .toBeUndefined();
    expect(Object.values(forgedReceiptHarness.read().commandReceipts))
      .toContainEqual(expect.objectContaining({
        receipt: expect.objectContaining({
          reason: 'legacy_reviewed_supply_chain_generation_quarantined',
        }),
      }));
  });

  test('local refusals are durable, replayable command facts', async () => {
    const harness = localAuthorityHarness();
    const created = await harness.apply(confirmPreview(
      ARTIFACT_A,
      makeReviewedChain(),
    ));
    const before = fingerprintContent({
      definitions: harness.read().definitions,
      revisions: harness.read().revisions,
    });
    const stalePreview = removePreview(
      ARTIFACT_A,
      created.result.headRevisionId,
      2,
    );
    const refusalCommandId = 'local:reviewed:durable-refusal';
    const refused = await harness.apply(stalePreview, {
      commandId: refusalCommandId,
    });
    expect(refused).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'reviewed_supply_chain_lifecycle_changed',
      replayed: false,
    });

    const replayed = await harness.apply(stalePreview, {
      commandId: refusalCommandId,
    });
    expect(replayed).toEqual({ ...refused, replayed: true });

    const conflictingPreview = removePreview(
      ARTIFACT_A,
      created.result.headRevisionId,
      3,
    );
    expect(await harness.apply(conflictingPreview, {
      commandId: refusalCommandId,
    })).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'command_id_conflict',
      replayed: false,
    });
    expect(fingerprintContent({
      definitions: harness.read().definitions,
      revisions: harness.read().revisions,
    })).toBe(before);
    expect(Object.keys(harness.read().commandReceipts).filter(
      key => key === refusalCommandId,
    )).toHaveLength(1);
  });

  test('JS and SQL admission, projection, and content hashes have byte parity', async () => {
    const chain = makeReviewedChain();
    const sql = await db.query(
      `select
         public._reviewed_supply_chain_record_valid($1::jsonb) as valid,
         public._reviewed_supply_chain_projection_fingerprint($1::jsonb)
           as projection_fingerprint,
         public._reviewed_supply_chain_content_hash($1::jsonb)
           as content_hash`,
      [JSON.stringify(chain)],
    );
    expect(admitReviewedSupplyChain(chain).ok).toBe(true);
    expect(sql.rows[0]).toEqual({
      valid: true,
      projection_fingerprint:
        customSupplyChainProjectionFingerprint(chain),
      content_hash: reviewedSupplyChainContentHash(chain),
    });

    for (const boundary of ['\u00a0', '\u3000', '\ufeff']) {
      const invalid = clone(chain);
      invalid.discovered.nodes[0].name =
        `${boundary}${invalid.discovered.nodes[0].name}`;
      const resealed = resealProjection(invalid);
      expect(admitReviewedSupplyChain(resealed).ok).toBe(false);
      const admitted = await db.query(
        `select public._reviewed_supply_chain_record_valid($1::jsonb)
           as valid`,
        [JSON.stringify(resealed)],
      );
      expect(admitted.rows[0].valid).toBe(false);
    }

    for (const field of ['kind', 'role', 'source']) {
      const invalid = clone(chain);
      invalid.discovered.nodes[0][field] = null;
      const resealed = resealProjection(invalid);
      expect(admitReviewedSupplyChain(resealed).ok).toBe(false);
      const admitted = await db.query(
        `select public._reviewed_supply_chain_record_valid($1::jsonb)
           as valid`,
        [JSON.stringify(resealed)],
      );
      expect(admitted.rows[0].valid).toBe(false);
    }

    for (const nodeUids of [
      ['İX', 'ASCII-Z'],
      ['KX', 'Kelvin-Y'],
      ['𐐀X', 'Astral-Q'],
    ]) {
      const nodes = nodeUids.map(uid => ({ uid }));
      const identity = await db.query(
        `select public._reviewed_supply_chain_id_for_nodes($1::jsonb)
           as chain_id`,
        [JSON.stringify(nodes)],
      );
      expect(identity.rows[0].chain_id)
        .toBe(reviewedSupplyChainIdForNodeUids(nodeUids));
    }

    const scalarOrderingVector = {
      '\u{10000}': 'non-bmp',
      '\ue000': 'bmp-private-use',
    };
    const scalarOrdering = await db.query(
      `select public._content_canonical_json($1::jsonb) as canonical,
              public._content_sha256($1::jsonb) as fingerprint`,
      [JSON.stringify(scalarOrderingVector)],
    );
    expect(scalarOrdering.rows[0]).toEqual({
      canonical: canonicalContentJson(scalarOrderingVector),
      fingerprint: fingerprintContent(scalarOrderingVector),
    });
  });

  test('environment and campaign binding validators admit reviewed revisions', async () => {
    const chain = makeReviewedChain();
    const preview = confirmPreview(ARTIFACT_A, chain);
    const receipt = await applyReviewed(
      preview,
      commandId('binding-create', preview),
    );
    const binding = makeCampaignContentBinding({
      supplyChains: [receipt.result.item],
    }, {
      source: 'reviewed-binding-test',
    });
    const validity = await db.query(
      `select
         public._content_environment_valid($1::jsonb) as environment_valid,
         public._campaign_content_binding_valid($2::jsonb) as binding_valid`,
      [
        JSON.stringify(binding.environment),
        JSON.stringify(binding),
      ],
    );
    expect(validity.rows[0]).toEqual({
      environment_valid: true,
      binding_valid: true,
    });
    const authority = await db.query(
      `select
         public._campaign_reviewed_supply_chain_references_valid(
           $1::uuid, $2::jsonb
         ) as owner_valid,
         public._campaign_reviewed_supply_chain_references_valid(
           $3::uuid, $2::jsonb
         ) as crossed_owner_valid`,
      [OWNER, JSON.stringify(binding), MALLORY],
    );
    expect(authority.rows[0]).toEqual({
      owner_valid: true,
      crossed_owner_valid: false,
    });

    const selfSignedItem = {
      ...receipt.result.item,
      id: ARTIFACT_B,
      definitionId: ARTIFACT_B,
      revisionId: '42000000-0000-4000-8000-000000000077',
    };
    const selfSignedBinding = makeCampaignContentBinding({
      supplyChains: [selfSignedItem],
    }, {
      source: 'self-signed-reviewed-binding',
    });
    expect(admitCampaignContentBinding(selfSignedBinding).ok).toBe(true);
    const selfSignedAuthority = await db.query(
      `select public._campaign_reviewed_supply_chain_references_valid(
         $1::uuid, $2::jsonb
       ) as valid`,
      [OWNER, JSON.stringify(selfSignedBinding)],
    );
    expect(selfSignedAuthority.rows[0].valid).toBe(false);

    const campaignId = '61000000-0000-4000-8000-000000000001';
    await expect(asUser(
      OWNER,
      `insert into public.saved_maps (
         id, user_id, name, map_data
       ) values ($1, $2, 'Malformed orphan history', $3::jsonb)`,
      [
        '61000000-0000-4000-8000-000000000002',
        OWNER,
        JSON.stringify({
          campaign: {
            contentBinding: null,
            contentBindingHistory: [{}],
          },
        }),
      ],
    )).rejects.toThrow(/invalid campaign content binding envelope/i);
    await expect(asUser(
      OWNER,
      `insert into public.saved_maps (
         id, user_id, name, map_data
       ) values ($1, $2, 'Self-signed orphan history', $3::jsonb)`,
      [
        '61000000-0000-4000-8000-000000000003',
        OWNER,
        JSON.stringify({
          campaign: {
            contentBinding: null,
            contentBindingHistory: [selfSignedBinding],
          },
        }),
      ],
    )).rejects.toThrow(/invalid campaign content binding envelope/i);
    await asUser(
      OWNER,
      `insert into public.saved_maps (
         id, user_id, name, map_data
       ) values ($1, $2, 'Ledger-backed orphan history', $3::jsonb)`,
      [
        '61000000-0000-4000-8000-000000000004',
        OWNER,
        JSON.stringify({
          campaign: {
            contentBinding: null,
            contentBindingHistory: [binding],
          },
        }),
      ],
    );

    await expect(asUser(
      OWNER,
      `insert into public.saved_maps (
         id, user_id, name, map_data
       ) values ($1, $2, 'Self-signed campaign', $3::jsonb)`,
      [
        campaignId,
        OWNER,
        JSON.stringify({
          campaign: {
            contentBinding: selfSignedBinding,
            contentBindingHistory: [],
          },
        }),
      ],
    )).rejects.toThrow(/invalid campaign content binding envelope/i);

    await asUser(
      OWNER,
      `insert into public.saved_maps (
         id, user_id, name, map_data
       ) values ($1, $2, 'Ledger-backed campaign', $3::jsonb)`,
      [
        campaignId,
        OWNER,
        JSON.stringify({
          campaign: {
            contentBinding: binding,
            contentBindingHistory: [],
          },
        }),
      ],
    );
    const rejectedCore = {
      schemaVersion: 1,
      kind: 'campaign.content-binding.cas',
      campaignId,
      expectedBindingHash: binding.bindingHash,
      targetBinding: selfSignedBinding,
      contentBindingHistory: [binding, selfSignedBinding],
    };
    await expect(asUser(
      OWNER,
      `select public.compare_and_swap_campaign_content_binding(
         $1::uuid, $2::text, $3::text, $4::uuid, $5::text,
         $6::jsonb, $7::jsonb
       )`,
      [
        OWNER,
        'test:self-signed-campaign-cas',
        fingerprintContent(rejectedCore),
        campaignId,
        binding.bindingHash,
        JSON.stringify(selfSignedBinding),
        JSON.stringify([binding, selfSignedBinding]),
      ],
    )).rejects.toThrow(/invalid campaign content binding command/i);

    const revisedChain = resealProjection({
      ...makeReviewedChain(),
      label: 'Moon Ore → Silver Foundry → Historical Caravan',
    });
    const revisedPreview = confirmPreview(
      ARTIFACT_A,
      revisedChain,
      receipt.result.headRevisionId,
      receipt.result.item.reviewedLifecycleVersion,
    );
    await applyReviewed(
      revisedPreview,
      commandId('binding-revision', revisedPreview),
    );
    const historicalAuthority = await db.query(
      `select public._campaign_reviewed_supply_chain_references_valid(
         $1::uuid, $2::jsonb
       ) as valid`,
      [OWNER, JSON.stringify(binding)],
    );
    expect(historicalAuthority.rows[0].valid).toBe(true);

    const resolved = binding.resolvedDefinitions[0];
    expect(resolved).toMatchObject({
      definitionId: ARTIFACT_A,
      revisionId: receipt.result.headRevisionId,
      category: 'supplyChains',
      contentHash: reviewedSupplyChainContentHash(chain),
    });

    const astralSource = '😀'.repeat(200);
    const astralBinding = makeCampaignContentBinding({
      supplyChains: [receipt.result.item],
    }, {
      source: astralSource,
    });
    expect(admitCampaignContentBinding(astralBinding).ok).toBe(true);
    const astralValidity = await db.query(
      `select
         public._content_environment_valid($1::jsonb) as environment_valid,
         public._campaign_content_binding_valid($2::jsonb) as binding_valid`,
      [
        JSON.stringify(astralBinding.environment),
        JSON.stringify(astralBinding),
      ],
    );
    expect(astralValidity.rows[0]).toEqual({
      environment_valid: true,
      binding_valid: true,
    });

    for (const whitespace of ['\t', '\u00a0', '\u3000']) {
      const environment = clone(binding.environment);
      environment.createdAt = whitespace;
      expect(admitContentEnvironmentRevision(environment).ok).toBe(false);
      const invalid = await db.query(
        `select public._content_environment_valid($1::jsonb) as valid`,
        [JSON.stringify(environment)],
      );
      expect(invalid.rows[0].valid).toBe(false);
    }

    const oversizedRevision = resealEnvironment({
      ...binding.environment,
      revisionNumber: 2_147_483_648,
    });
    expect(admitContentEnvironmentRevision(oversizedRevision).ok).toBe(false);
    const oversizedRevisionValidity = await db.query(
      `select public._content_environment_valid($1::jsonb) as valid`,
      [JSON.stringify(oversizedRevision)],
    );
    expect(oversizedRevisionValidity.rows[0].valid).toBe(false);

    const oversizedIdentifier = resealEnvironment({
      ...binding.environment,
      source: '😀'.repeat(241),
    });
    expect(admitContentEnvironmentRevision(oversizedIdentifier).ok).toBe(false);
    const oversizedIdentifierValidity = await db.query(
      `select public._content_environment_valid($1::jsonb) as valid`,
      [JSON.stringify(oversizedIdentifier)],
    );
    expect(oversizedIdentifierValidity.rows[0].valid).toBe(false);

    const boundaryBinding = resealBinding({
      ...binding,
      source: `\u00a0${binding.source}`,
    });
    expect(admitCampaignContentBinding(boundaryBinding).ok).toBe(false);
    const boundaryBindingValidity = await db.query(
      `select public._campaign_content_binding_valid($1::jsonb) as valid`,
      [JSON.stringify(boundaryBinding)],
    );
    expect(boundaryBindingValidity.rows[0].valid).toBe(false);
  });

  test('archive graph proof remaps nested evidence and rejects chain collisions', async () => {
    const chain = makeReviewedChain();
    const preview = confirmPreview(ARTIFACT_A, chain);
    const receipt = await applyReviewed(
      preview,
      commandId('archive-create', preview),
    );
    const graph = archiveGraphForReviewedItem(receipt.result.item);
    const valid = await db.query(
      `select public._reviewed_supply_chain_archive_graph_valid($1::jsonb)
         as valid`,
      [JSON.stringify(graph)],
    );
    expect(valid.rows[0].valid).toBe(true);

    const destinationResourceUid = 'destination-resource';
    const destinationInstitutionUid = 'destination-institution';
    const destinationResourceHash = contentRevisionHash('resources', {
      ...RESOURCE_DATA,
      localUid: destinationResourceUid,
    });
    const destinationInstitutionHash = contentRevisionHash('institutions', {
      ...INSTITUTION_DATA,
      localUid: destinationInstitutionUid,
    });
    const identityMap = {
      localUids: [
        {
          sourceId: RESOURCE_DATA.localUid,
          destinationId: destinationResourceUid,
        },
        {
          sourceId: INSTITUTION_DATA.localUid,
          destinationId: destinationInstitutionUid,
        },
      ],
      definitionIds: [
        {
          sourceId: RESOURCE_DEFINITION,
          destinationId: '51000000-0000-4000-8000-000000000001',
        },
        {
          sourceId: INSTITUTION_DEFINITION,
          destinationId: '51000000-0000-4000-8000-000000000002',
        },
      ],
      revisionIds: [
        {
          sourceId: RESOURCE_REVISION,
          destinationId: '52000000-0000-4000-8000-000000000001',
          destinationContentHash: destinationResourceHash,
          destinationRevisionNumber: 7,
        },
        {
          sourceId: INSTITUTION_REVISION,
          destinationId: '52000000-0000-4000-8000-000000000002',
          destinationContentHash: destinationInstitutionHash,
          destinationRevisionNumber: 1,
        },
      ],
    };
    const remapped = await db.query(
      `select public._reviewed_supply_chain_archive_remap_data(
         $1::jsonb, $2::jsonb
       ) as chain`,
      [JSON.stringify(chain), JSON.stringify(identityMap)],
    );
    expect(remapped.rows[0].chain.status).toBe('confirmed');
    expect(remapped.rows[0].chain.discovered.nodes[0]).toMatchObject({
      uid: destinationResourceUid,
      contentHash: destinationResourceHash,
      revisionNumber: 7,
    });
    expect(remapped.rows[0].chain.discovered.nodes[1]).toMatchObject({
      uid: destinationInstitutionUid,
      contentHash: destinationInstitutionHash,
    });
    expect(remapped.rows[0].chain.chainId).not.toBe(chain.chainId);
    const jsRemapped = remapReviewedSupplyChain(chain, {
      localUids: new Map(identityMap.localUids.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ])),
      definitionIds: new Map(identityMap.definitionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ])),
      revisionIds: new Map(identityMap.revisionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ])),
      revisionNumbers: new Map(identityMap.revisionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationRevisionNumber,
      ])),
      contentHashes: new Map(identityMap.revisionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationContentHash,
      ])),
    });
    expect(jsRemapped).toEqual(remapped.rows[0].chain);

    const missingRevisionNumber = clone(identityMap);
    delete missingRevisionNumber.revisionIds[0].destinationRevisionNumber;
    const rejectedMissingRevisionNumber = await db.query(
      `select public._reviewed_supply_chain_archive_remap_data(
         $1::jsonb, $2::jsonb
       ) as chain`,
      [JSON.stringify(chain), JSON.stringify(missingRevisionNumber)],
    );
    expect(rejectedMissingRevisionNumber.rows[0].chain).toBeNull();
    expect(() => remapReviewedSupplyChain(chain, {
      localUids: new Map(identityMap.localUids.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ])),
      definitionIds: new Map(identityMap.definitionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ])),
      revisionIds: new Map(identityMap.revisionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationId,
      ])),
      revisionNumbers: new Map(),
      contentHashes: new Map(identityMap.revisionIds.map(mapping => [
        mapping.sourceId,
        mapping.destinationContentHash,
      ])),
    })).toThrow(/no archive identity mapping/i);

    const collision = clone(graph);
    const duplicateDefinitionId =
      '41000000-0000-4000-8000-000000000088';
    const duplicateRevisionId =
      '42000000-0000-4000-8000-000000000088';
    collision.definitions.push({
      ...collision.definitions.at(-1),
      id: duplicateDefinitionId,
      headRevisionId: duplicateRevisionId,
      localUid: 'duplicate-reviewed-chain',
    });
    collision.revisions.push({
      ...collision.revisions.at(-1),
      id: duplicateRevisionId,
      definitionId: duplicateDefinitionId,
    });
    const collisionValidity = await db.query(
      `select public._reviewed_supply_chain_archive_graph_valid($1::jsonb)
         as valid`,
      [JSON.stringify(collision)],
    );
    expect(collisionValidity.rows[0].valid).toBe(false);
  });

  test('mixed reviewed archives import, resolve, bind, and re-export end to end', async () => {
    const preview = confirmPreview(ARTIFACT_A, makeReviewedChain());
    const receipt = await applyReviewed(
      preview,
      commandId('mixed-archive-source', preview),
    );
    const {
      archive,
      environment,
      graph,
    } = mixedReviewedArchive(receipt.result.item);
    expect(admitReviewedSupplyChain(graph.revisions.at(-1).data))
      .toMatchObject({ ok: true });
    expect(validateCustomContentArchive(archive).ok).toBe(true);

    const prepared = prepareCustomContentArchiveImport(archive, {
      destinationOwnerId: MALLORY,
      activationPolicy: 'adopt-if-empty',
    });
    const sourceReviewedRevision = archive.ledger.revisions.find(
      revision => revision.category === 'supplyChains',
    );
    const destinationReviewedRevision = prepared.transfer.revisions.find(
      revision => revision.category === 'supplyChains',
    );
    const sqlRemap = await db.query(
      `select public._reviewed_supply_chain_archive_remap_data(
         $1::jsonb, $2::jsonb
       ) as data`,
      [
        JSON.stringify(sourceReviewedRevision.data),
        JSON.stringify(prepared.identityMap),
      ],
    );
    expect(sqlRemap.rows[0].data).toEqual(destinationReviewedRevision.data);
    const importedResponse = await asUser(
      MALLORY,
      `select public.import_custom_content_archive(
        $1::uuid, $2::text, $3::text, $4::jsonb
      ) as result`,
      [
        MALLORY,
        prepared.commandId,
        prepared.fingerprint,
        JSON.stringify(prepared.bundle),
      ],
    );
    expect(importedResponse.rows[0].result).toMatchObject({
      ok: true,
      status: 'applied',
      activationAdopted: true,
      counts: {
        definitions: 3,
        revisions: 3,
        environments: 1,
      },
    });

    const supplyDefinition = prepared.transfer.definitions.find(
      definition => definition.category === 'supplyChains',
    );
    const persisted = await db.query(
      `select definition.reviewed_lifecycle_version,
              revision.data
         from public.custom_content_definitions definition
         join public.custom_content_revisions revision
           on revision.owner_id = definition.owner_id
          and revision.definition_id = definition.id
          and revision.id = definition.head_revision_id
        where definition.owner_id = $1 and definition.id = $2`,
      [MALLORY, supplyDefinition.id],
    );
    expect(persisted.rows[0].reviewed_lifecycle_version).toBe(1);
    const persistedCustomNodes = persisted.rows[0].data.discovered.nodes
      .filter(node => node.source === 'custom');
    expect(persistedCustomNodes).toHaveLength(2);
    expect(persistedCustomNodes.every(node => (
      node.definitionId !== RESOURCE_DEFINITION
      && node.definitionId !== INSTITUTION_DEFINITION
      && node.revisionId !== RESOURCE_REVISION
      && node.revisionId !== INSTITUTION_REVISION
    ))).toBe(true);

    const destinationRevisionById = new Map(
      prepared.transfer.revisions.map(revision => [revision.id, revision]),
    );
    const grouped = {
      resources: [],
      institutions: [],
      services: [],
      tradeGoods: [],
      deities: [],
      npcTemplates: [],
      encounterTables: [],
      factions: [],
      supplyChains: [],
    };
    for (const definition of prepared.transfer.definitions) {
      const head = destinationRevisionById.get(definition.headRevisionId);
      grouped[definition.category].push({
        ...head.data,
        id: definition.id,
        definitionId: definition.id,
        revisionId: head.id,
        revisionNumber: head.revisionNumber,
        contentHash: head.contentHash,
        localUid: definition.localUid,
        archivedAt: definition.archivedAt,
        isCustom: true,
        ...(definition.category === 'supplyChains'
          ? { reviewedLifecycleVersion: 1 }
          : {}),
      });
    }
    const destinationEnvironment = prepared.transfer.environments[0];
    const standaloneRuntime = contentRuntimeFromEnvironment(
      destinationEnvironment,
      grouped,
    );
    expect(standaloneRuntime.resolution).toMatchObject({
      ok: true,
      mode: 'reviewed',
    });
    expect(standaloneRuntime.customContent.supplyChains).toHaveLength(1);

    const binding = makeCampaignContentBinding(grouped, {
      source: 'mixed-reviewed-campaign',
      environment: destinationEnvironment,
    });
    expect(admitCampaignContentBinding(binding).ok).toBe(true);
    const campaignRuntime = contentRuntimeFromCampaignBinding(binding);
    expect(campaignRuntime.customContent.supplyChains).toHaveLength(1);
    expect(campaignRuntime.customContent.resources).toHaveLength(1);
    expect(campaignRuntime.customContent.institutions).toHaveLength(1);

    const exportedResponse = await asUser(
      MALLORY,
      `select public.export_custom_content_archive($1::uuid) as result`,
      [MALLORY],
    );
    const exported = exportedResponse.rows[0].result;
    expect(validateCustomContentArchive(exported).ok).toBe(true);
    expect(exported.ledger.definitions.some(definition => (
      definition.category === 'supplyChains'
    ))).toBe(true);
    expect(exported.ledger.revisions.some(revision => (
      revision.category === 'supplyChains'
    ))).toBe(true);
    expect(exported.ledger.definitions.every(definition => (
      !Object.hasOwn(definition, 'reviewedLifecycleVersion')
    ))).toBe(true);
  });

  test('archive lifecycle exhaustion is durable and leaves no partial writes', async () => {
    const preview = confirmPreview(ARTIFACT_A, makeReviewedChain());
    const receipt = await applyReviewed(
      preview,
      commandId('max-lifecycle-source', preview),
    );
    const sourceKey = 'mixed-reviewed-max-lifecycle';
    const initial = mixedReviewedArchive(receipt.result.item, { sourceKey });
    const preparedInitial = prepareCustomContentArchiveImport(
      initial.archive,
      {
        destinationOwnerId: MALLORY,
        activationPolicy: 'preserve',
      },
    );
    const initialResponse = await asUser(
      MALLORY,
      `select public.import_custom_content_archive(
         $1::uuid, $2::text, $3::text, $4::jsonb
       ) as result`,
      [
        MALLORY,
        preparedInitial.commandId,
        preparedInitial.fingerprint,
        JSON.stringify(preparedInitial.bundle),
      ],
    );
    expect(initialResponse.rows[0].result.ok).toBe(true);
    const reviewedDefinition = preparedInitial.transfer.definitions.find(
      definition => definition.category === 'supplyChains',
    );

    // The source can complete remove -> restore between exports. Its visible
    // head and active state then match the prior destination, but the newer
    // lifecycle time is still an ABA generation and must advance SQL CAS.
    const sameStateAdvance = mixedReviewedArchive(receipt.result.item, {
      sourceKey,
      archivedAt: null,
      updatedAt: '2026-07-25T00:00:01.000Z',
    });
    const preparedSameStateAdvance = prepareCustomContentArchiveImport(
      sameStateAdvance.archive,
      {
        destinationOwnerId: MALLORY,
        activationPolicy: 'preserve',
      },
    );
    const sameStateResponse = await asUser(
      MALLORY,
      `select public.import_custom_content_archive(
         $1::uuid, $2::text, $3::text, $4::jsonb
       ) as result`,
      [
        MALLORY,
        preparedSameStateAdvance.commandId,
        preparedSameStateAdvance.fingerprint,
        JSON.stringify(preparedSameStateAdvance.bundle),
      ],
    );
    expect(sameStateResponse.rows[0].result).toMatchObject({
      ok: true,
      status: 'applied',
      definitionOutcomes: {
        [reviewedDefinition.id]: 'fast-forwarded',
      },
    });
    const advancedGeneration = await db.query(
      `select reviewed_lifecycle_version
         from public.custom_content_definitions
        where owner_id = $1 and id = $2`,
      [MALLORY, reviewedDefinition.id],
    );
    expect(advancedGeneration.rows[0].reviewed_lifecycle_version).toBe(2);

    await db.exec(`
      alter table public.custom_content_definitions
        disable trigger custom_content_reviewed_lifecycle_guard
    `);
    await db.query(
      `update public.custom_content_definitions
          set reviewed_lifecycle_version = 2147483647
        where owner_id = $1 and id = $2`,
      [MALLORY, reviewedDefinition.id],
    );
    await db.exec(`
      alter table public.custom_content_definitions
        enable trigger custom_content_reviewed_lifecycle_guard
    `);

    const advanced = mixedReviewedArchive(receipt.result.item, {
      sourceKey,
      archivedAt: null,
      updatedAt: '2026-07-25T00:00:02.000Z',
    });
    const preparedAdvanced = prepareCustomContentArchiveImport(
      advanced.archive,
      {
        destinationOwnerId: MALLORY,
        activationPolicy: 'preserve',
      },
    );
    const attempt = async () => {
      const response = await asUser(
        MALLORY,
        `select public.import_custom_content_archive(
           $1::uuid, $2::text, $3::text, $4::jsonb
         ) as result`,
        [
          MALLORY,
          preparedAdvanced.commandId,
          preparedAdvanced.fingerprint,
          JSON.stringify(preparedAdvanced.bundle),
        ],
      );
      return response.rows[0].result;
    };
    expect(await attempt()).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'reviewed_supply_chain_lifecycle_exhausted',
      replayed: false,
    });
    expect(await attempt()).toMatchObject({
      ok: false,
      status: 'failed',
      reason: 'reviewed_supply_chain_lifecycle_exhausted',
      replayed: true,
    });

    const state = await db.query(
      `select
         definition.archived_at,
         definition.reviewed_lifecycle_version,
         count(revision.*)::integer as revision_count,
         (
           select count(*)::integer
             from public.application_command_journal journal
            where journal.owner_id = $1
              and journal.command_id = $3
         ) as command_count
       from public.custom_content_definitions definition
       join public.custom_content_revisions revision
         on revision.owner_id = definition.owner_id
        and revision.definition_id = definition.id
      where definition.owner_id = $1 and definition.id = $2
      group by
        definition.archived_at,
        definition.reviewed_lifecycle_version`,
      [
        MALLORY,
        reviewedDefinition.id,
        preparedAdvanced.commandId,
      ],
    );
    expect(state.rows[0]).toEqual({
      archived_at: null,
      reviewed_lifecycle_version: 2147483647,
      revision_count: 1,
      command_count: 1,
    });
  });

  test('pre-188 artifacts, mismatched campaign revisions, and orphans are quarantined', async () => {
    const result = await db.query(
      `select
         exists (
           select 1 from public.custom_content_definitions
            where id = $1
         ) as definition_survived,
         exists (
           select 1 from public.custom_content_definitions
            where id = $3
         ) as authorable_survived,
         exists (
           select 1 from public.content_packs
            where owner_id = $2 and pack_id = $4
         ) as pack_survived,
         exists (
           select 1 from public.content_environment_revisions
            where owner_id = $2 and environment_revision_id = $5
         ) as environment_survived,
         (
           select map_data
             from public.saved_maps
            where id = $6
         ) as campaign_map_data,
         (
           select campaign_journal.receipt
             from public.application_command_journal campaign_journal
            where campaign_journal.owner_id = $2
              and campaign_journal.command_id =
                'legacy:reviewed-campaign-quarantine:' || $6::text
         ) as campaign_receipt,
         journal.receipt
        from public.application_command_journal journal
       where journal.owner_id = $2
         and journal.command_id =
           'legacy:reviewed-supply-chain-quarantine:' || $1::text`,
      [
        LEGACY_ARTIFACT,
        OWNER,
        RESOURCE_DEFINITION,
        LEGACY_PACK,
        LEGACY_ENVIRONMENT_REVISION,
        LEGACY_CAMPAIGN_MAP,
      ],
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].definition_survived).toBe(false);
    expect(result.rows[0].authorable_survived).toBe(true);
    expect(result.rows[0].pack_survived).toBe(false);
    expect(result.rows[0].environment_survived).toBe(false);
    expect(result.rows[0].campaign_map_data).toMatchObject({
      campaign: {
        contentBinding: null,
        contentBindingHistory: [],
        contentBindingStatus: 'reviewed-authority-quarantined',
      },
    });
    expect(result.rows[0].campaign_receipt).toMatchObject({
      ok: true,
      status: 'applied',
      reason: 'legacy_reviewed_campaign_binding_quarantined',
      result: {
        quarantine: {
          reason: 'legacy_reviewed_campaign_binding_requires_review',
          savedMap: {
            id: LEGACY_CAMPAIGN_MAP,
            map_data: legacyCampaignMapData,
          },
        },
      },
    });
    expect(result.rows[0].receipt).toMatchObject({
      ok: true,
      status: 'applied',
      reason: 'legacy_reviewed_supply_chain_quarantined',
      result: {
        quarantine: {
          reason: 'legacy_reviewed_supply_chain_requires_review',
          definition: { id: LEGACY_ARTIFACT },
          revisions: [{
            id: LEGACY_REVISION,
            data: { chainId: makeReviewedChain().chainId },
          }],
          referencedPackState: {
            entryDefinitions: [
              { pack_entry_id: 'resource-entry' },
              { pack_entry_id: 'reviewed-entry' },
            ],
            versionEntries: [
              { category: 'supplyChains', ordinal: 0 },
              { category: 'resources', ordinal: 1 },
            ],
            versions: [{ pack_version: LEGACY_PACK_VERSION }],
            packs: [{ pack_id: LEGACY_PACK }],
          },
          referencedEnvironmentState: {
            environments: [{ environment_id: LEGACY_ENVIRONMENT }],
            revisions: [
              {
                environment_revision_id: LEGACY_ENVIRONMENT_REVISION,
              },
              {
                environment_revision_id: LEGACY_ENVIRONMENT_REVISION_2,
              },
            ],
            activations: [{
              environment_revision_id: LEGACY_ENVIRONMENT_REVISION_2,
            }],
          },
        },
      },
    });
  });
});
