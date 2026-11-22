/**
 * tests/domain/facts/migration.test.js — CENSUS-1 wave 0, fact 9: THE MIGRATION-DIRECTION HOME.
 * @enforced-by npx vitest run tests/domain/facts/migration.test.js
 */
import { describe, expect, it } from 'vitest';
import { migrationOf } from '../../../src/domain/facts/migration.js';

describe('the migration-direction home (CENSUS-1 fact 9)', () => {
  it('reads the entry, then the catalog, and nothing where no migration is on', () => {
    expect(migrationOf({ stress: [{ type: 'mass_migration', direction: 'exodus' }] })).toEqual({ active: true, direction: 'exodus' });
    expect(migrationOf({ stress: [{ type: 'mass_migration' }] }).direction).toBe('influx');
    expect(migrationOf({ stressors: [{ type: 'famine' }, { type: 'mass_migration', direction: 'influx' }] }).direction).toBe('influx');
    expect(migrationOf({ stress: [{ type: 'famine' }] })).toEqual({ active: false, direction: null });
  });
});
