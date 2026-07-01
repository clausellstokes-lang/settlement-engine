import { describe, test, expect } from 'vitest';

import { migrationNumbers, contiguityGaps } from '../../scripts/check-migration-head.mjs';

// M5 head guard: a missing/renamed migration file breaks the ordered-apply
// contract silently. This fails the gate on a numbering gap so a lost migration
// is caught locally, not on a broken production `db push`. (The deploy-time
// "live schema head == repo head" comparison runs via scripts/check-migration-head.mjs
// with SUPABASE_MIGRATION_HEAD set — see docs/DEPLOY.md — since it needs a live DB.)
describe('supabase migrations are contiguously numbered (M5)', () => {
  test('no gaps in the migration numbering', () => {
    const nums = migrationNumbers();
    expect(nums.length).toBeGreaterThan(0);
    expect(contiguityGaps(nums)).toEqual([]);
  });
});
