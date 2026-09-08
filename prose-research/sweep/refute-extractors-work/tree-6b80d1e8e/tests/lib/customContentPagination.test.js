/**
 * PostgREST truncates collection reads at the configured project row ceiling.
 * These tests use a 500-row synthetic ceiling boundary and prove every
 * custom-content collection path continues until the final short page.
 */

import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

function fixtureRows() {
  const activeDefinitions = Array.from({ length: 1_205 }, (_, index) => ({
    id: `definition-${index}`,
    category: 'institutions',
    local_uid: `lu_active_${index}`,
    head_revision_id: index === 0
      ? 'history-revision-1004'
      : `active-revision-${index}`,
    archived_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: `2026-01-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`,
  }));
  const archivedDefinitions = Array.from({ length: 1_005 }, (_, index) => ({
    id: `archived-definition-${index}`,
    category: 'institutions',
    local_uid: `lu_archived_${index}`,
    head_revision_id: `archived-revision-${index}`,
    archived_at: '2026-02-01T00:00:00.000Z',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
  }));
  const activeRevisions = activeDefinitions.slice(1).map((definition, index) => ({
    id: definition.head_revision_id,
    definition_id: definition.id,
    revision_no: 1,
    parent_revision_id: null,
    schema_version: 1,
    content_hash: 'a'.repeat(64),
    data: { name: `Active ${index + 1}`, localUid: definition.local_uid },
    created_at: definition.created_at,
  }));
  const historyRevisions = Array.from({ length: 1_005 }, (_, index) => ({
    id: `history-revision-${index}`,
    definition_id: activeDefinitions[0].id,
    revision_no: index + 1,
    parent_revision_id: index === 0 ? null : `history-revision-${index - 1}`,
    schema_version: 1,
    content_hash: 'b'.repeat(64),
    data: {
      name: `Historical ${index}`,
      localUid: activeDefinitions[0].local_uid,
    },
    created_at: '2026-01-01T00:00:00.000Z',
  }));
  const archivedRevisions = archivedDefinitions.map((definition, index) => ({
    id: definition.head_revision_id,
    definition_id: definition.id,
    revision_no: 1,
    parent_revision_id: null,
    schema_version: 1,
    content_hash: 'c'.repeat(64),
    data: { name: `Archived ${index}`, localUid: definition.local_uid },
    created_at: definition.created_at,
  }));
  return {
    custom_content_definitions: [
      ...activeDefinitions,
      ...archivedDefinitions,
    ],
    custom_content_revisions: [
      ...activeRevisions,
      ...historyRevisions,
      ...archivedRevisions,
    ],
    content_environment_revisions: Array.from(
      { length: 1_005 },
      (_, index) => ({
        environment_revision_id: `environment-${index}`,
        created_at: '2026-01-01T00:00:00.000Z',
        revision: { environmentRevisionId: `environment-${index}` },
      }),
    ),
    content_packs: [{
      pack_id: 'pack:large',
      active_pack_version: '1.0.0',
      active_manifest_hash: 'd'.repeat(64),
    }],
    content_pack_entry_definitions: activeDefinitions.map(
      (definition, index) => ({
        pack_id: 'pack:large',
        pack_entry_id: `entry-${index}`,
        definition_id: definition.id,
      }),
    ),
  };
}

function supabaseHarness(rowsByTable, options = {}) {
  const ranges = [];
  const selections = [];

  class Query {
    constructor(table) {
      this.table = table;
      this.predicates = [];
    }

    select(columns = '') {
      this.columns = String(columns);
      selections.push({ table: this.table, columns: this.columns });
      return this;
    }

    is(column, value) {
      this.predicates.push(row => row[column] === value);
      return this;
    }

    not(column, operator, value) {
      if (operator !== 'is') throw new Error(`Unsupported not operator ${operator}`);
      this.predicates.push(row => row[column] !== value);
      return this;
    }

    eq(column, value) {
      this.predicates.push(row => String(row[column]) === String(value));
      return this;
    }

    in(column, values) {
      const accepted = new Set(values.map(String));
      this.predicates.push(row => accepted.has(String(row[column])));
      return this;
    }

    order() { return this; }

    filtered() {
      return (rowsByTable[this.table] || []).filter(row => (
        this.predicates.every(predicate => predicate(row))
      ));
    }

    range(from, to) {
      ranges.push({ table: this.table, from, to });
      if (
        options.missingReviewedLifecycle
        && this.table === 'custom_content_definitions'
        && this.columns.includes('reviewed_lifecycle_version')
      ) {
        return Promise.resolve({
          data: null,
          error: {
            code: options.missingReviewedLifecycleCode || 'PGRST204',
            message:
              "Could not find the 'reviewed_lifecycle_version' column",
          },
        });
      }
      return Promise.resolve({
        data: this.filtered().slice(from, to + 1),
        error: null,
      });
    }

    maybeSingle() {
      if (
        options.missingReviewedLifecycle
        && this.table === 'custom_content_definitions'
        && this.columns.includes('reviewed_lifecycle_version')
      ) {
        return Promise.resolve({
          data: null,
          error: {
            code: options.missingReviewedLifecycleCode || 'PGRST204',
            message:
              "Could not find the 'reviewed_lifecycle_version' column",
          },
        });
      }
      const rows = this.filtered();
      return Promise.resolve({
        data: rows[0] || null,
        error: rows.length > 1
          ? { code: 'PGRST116', message: 'multiple rows' }
          : null,
      });
    }
  }

  return {
    ranges,
    selections,
    supabase: {
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: 'pagination-owner' } },
        })),
      },
      from: table => new Query(table),
    },
  };
}

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('custom-content cloud pagination', () => {
  test('loads every active, archived, historical, environment, and pack-mapping row', async () => {
    const harness = supabaseHarness(fixtureRows());
    vi.doMock('../../src/lib/supabase.js', () => ({
      isConfigured: true,
      supabase: harness.supabase,
    }));
    const { customContentService } = await import('../../src/lib/customContent.js');

    const active = await customContentService.list();
    const archived = await customContentService.loadArchivedCustomContent();
    const history = await customContentService.listCustomContentRevisions(
      'definition-0',
    );
    const environments = await customContentService
      .listContentEnvironmentRevisions();
    const pack = await customContentService.loadContentPackState('pack:large');

    expect(active.institutions).toHaveLength(1_205);
    expect(archived.institutions).toHaveLength(1_005);
    expect(history).toHaveLength(1_005);
    expect(environments).toHaveLength(1_005);
    expect(Object.keys(pack.entries)).toHaveLength(1_205);

    for (const table of [
      'custom_content_definitions',
      'custom_content_revisions',
      'content_environment_revisions',
      'content_pack_entry_definitions',
    ]) {
      expect(harness.ranges.filter(range => range.table === table).length)
        .toBeGreaterThan(1);
    }
  });

  test.each(['PGRST204', '42703'])(
    'keeps the 185 revision ledger visible during a 188 rolling deploy (%s)',
    async (missingReviewedLifecycleCode) => {
      const activeDefinition = {
        id: 'rolling-active-definition',
        category: 'institutions',
        local_uid: 'rolling-active',
        head_revision_id: 'rolling-active-revision',
        archived_at: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      };
      const archivedDefinition = {
        ...activeDefinition,
        id: 'rolling-archived-definition',
        local_uid: 'rolling-archived',
        head_revision_id: 'rolling-archived-revision',
        archived_at: '2026-01-02T00:00:00.000Z',
        updated_at: '2026-01-02T00:00:00.000Z',
      };
      const reviewedDefinition = {
        ...activeDefinition,
        id: 'rolling-untrusted-reviewed',
        category: 'supplyChains',
        local_uid: 'rolling-untrusted-reviewed',
        head_revision_id: 'rolling-untrusted-reviewed-revision',
      };
      const revision = definition => ({
        id: definition.head_revision_id,
        definition_id: definition.id,
        revision_no: 1,
        schema_version: 1,
        content_hash: 'a'.repeat(64),
        data: {
          name: definition.local_uid,
          localUid: definition.local_uid,
          chainId: 'generationless-chain',
        },
        created_at: definition.created_at,
      });
      const harness = supabaseHarness({
        custom_content_definitions: [
          activeDefinition,
          archivedDefinition,
          reviewedDefinition,
        ],
        custom_content_revisions: [
          revision(activeDefinition),
          revision(archivedDefinition),
          revision(reviewedDefinition),
        ],
        custom_content: [{
          id: 'obsolete-flat-row',
          category: 'institutions',
          data: { name: 'Must not replace the 185 ledger' },
        }],
      }, {
        missingReviewedLifecycle: true,
        missingReviewedLifecycleCode,
      });
      vi.doMock('../../src/lib/supabase.js', () => ({
        isConfigured: true,
        supabase: harness.supabase,
      }));
      const { customContentService } = await import('../../src/lib/customContent.js');

      const active = await customContentService.list();
      const archived = await customContentService.loadArchivedCustomContent();
      const reviewed = await customContentService
        .resolveReviewedSupplyChainIdentity('generationless-chain');

      expect(active.institutions).toEqual([
        expect.objectContaining({ definitionId: activeDefinition.id }),
      ]);
      expect(archived.institutions).toEqual([
        expect.objectContaining({ definitionId: archivedDefinition.id }),
      ]);
      expect(active.supplyChains).toEqual([]);
      expect(archived.supplyChains).toEqual([]);
      expect(reviewed).toBeNull();
      expect(harness.ranges.some(
        range => range.table === 'custom_content',
      )).toBe(false);
      expect(harness.selections.filter(selection => (
        selection.table === 'custom_content_definitions'
        && !selection.columns.includes('reviewed_lifecycle_version')
      ))).toHaveLength(2);
    },
  );
});
