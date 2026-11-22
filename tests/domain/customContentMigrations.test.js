import { describe, it, expect } from 'vitest';
import {
  migrateCustomItem,
  migrateCustomContent,
  CUSTOM_ITEM_SCHEMA_VERSION,
} from '../../src/domain/customContentMigrations.js';

describe('migrateCustomItem', () => {
  it('collapses a legacy group+category split into a single category', () => {
    const out = migrateCustomItem('institutions', { name: 'A', group: 'Crafts', category: 'Crafts' });
    expect(out.category).toBe('Crafts');
    expect('group' in out).toBe(false);
    expect(out._schemaVersion).toBe(CUSTOM_ITEM_SCHEMA_VERSION);
  });

  it('promotes group to category when category is missing', () => {
    const out = migrateCustomItem('institutions', { name: 'A', group: 'Magic' });
    expect(out.category).toBe('Magic');
    expect('group' in out).toBe(false);
  });

  it('stamps isCustom on older rows that lack it', () => {
    const out = migrateCustomItem('resources', { name: 'Ore', category: 'special' });
    expect(out.isCustom).toBe(true);
  });

  it('is idempotent — an already-current item is returned unchanged (same ref)', () => {
    const current = { name: 'A', category: 'Crafts', isCustom: true, _schemaVersion: CUSTOM_ITEM_SCHEMA_VERSION };
    expect(migrateCustomItem('institutions', current)).toBe(current);
  });

  it('does not force-remap a stale services category (graceful fallback handles it)', () => {
    const out = migrateCustomItem('services', { name: 'Smithy', category: 'Crafts' });
    expect(out.category).toBe('Crafts'); // left as-is; generator falls back to Equipment
  });

  it('tolerates non-objects', () => {
    expect(migrateCustomItem('institutions', null)).toBe(null);
    expect(migrateCustomItem('institutions', undefined)).toBe(undefined);
  });
});

describe('migrateCustomContent', () => {
  it('maps every bucket and leaves non-array buckets untouched', () => {
    const grouped = {
      institutions: [{ name: 'A', group: 'Crafts' }],
      services: [{ name: 'B', category: 'Healing' }],
      syncedAt: 'not-an-array',
    };
    const out = migrateCustomContent(grouped);
    expect(out.institutions[0].category).toBe('Crafts');
    expect(out.institutions[0]._schemaVersion).toBe(CUSTOM_ITEM_SCHEMA_VERSION);
    expect(out.services[0].isCustom).toBe(true);
    expect(out.syncedAt).toBe('not-an-array');
  });

  it('returns the input unchanged when not an object', () => {
    expect(migrateCustomContent(null)).toBe(null);
  });
});
