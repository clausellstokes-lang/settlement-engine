import { describe, test, expect } from 'vitest';

import {
  migrationNumbers,
  readAppliedHeadLedger,
  classifyAppliedHead,
} from '../../scripts/check-migration-head.mjs';

/**
 * Guards the checked-in applied-head ledger (supabase/applied-head.json) — the in-repo
 * record of which migration is live in prod, so "is the deployed DB at head?" is a
 * tracked, reviewable fact instead of tribal knowledge.
 *
 * The gate can't reach the live DB, so this doesn't PROVE prod is deployed; the
 * authoritative check is the SUPABASE_MIGRATION_HEAD deploy probe (docs/DEPLOY.md).
 * What it DOES enforce: the ledger is well-formed, references a real migration, and
 * never claims to have applied a migration the repo doesn't contain — plus it proves
 * the drift classifier actually distinguishes ok / pending / corrupt (non-vacuous),
 * so a future migration added without a deploy surfaces as a visible PENDING warning
 * rather than silently.
 */
describe('applied-head ledger is well-formed and bounded by the repo', () => {
  const nums = migrationNumbers();
  const head = nums[nums.length - 1];
  const ledger = readAppliedHeadLedger();

  test('the ledger exists and parses to an integer appliedHead', () => {
    expect(ledger, 'supabase/applied-head.json must exist and parse').not.toBeNull();
    expect(Number.isInteger(ledger.appliedHead)).toBe(true);
  });

  test('appliedHead references a real, present migration number', () => {
    expect(nums, `appliedHead=${ledger.appliedHead} is not a real migration file`).toContain(ledger.appliedHead);
  });

  test('appliedHead never exceeds the repo head (cannot apply a migration that is not committed)', () => {
    expect(ledger.appliedHead).toBeLessThanOrEqual(head);
  });

  test('with everything pushed, the ledger is currently in sync (status ok, no pending)', () => {
    const { status, pending } = classifyAppliedHead(ledger.appliedHead, head, nums);
    expect(status).toBe('ok');
    expect(pending).toEqual([]);
  });
});

describe('classifyAppliedHead drift logic is non-vacuous', () => {
  const nums = [95, 96, 97, 98];

  test('applied == head → ok', () => {
    expect(classifyAppliedHead(98, 98, nums)).toEqual({ status: 'ok', pending: [] });
  });

  test('applied behind head → pending, listing exactly the undeployed migrations', () => {
    expect(classifyAppliedHead(96, 98, nums)).toEqual({ status: 'pending', pending: [97, 98] });
  });

  test('applied ahead of head → corrupt (claims a migration the repo lacks)', () => {
    expect(classifyAppliedHead(99, 98, nums)).toEqual({ status: 'corrupt', pending: [] });
  });

  test('readAppliedHeadLedger returns null for a missing file (back-compat, not a throw)', () => {
    expect(readAppliedHeadLedger('/no/such/applied-head.json')).toBeNull();
  });
});
