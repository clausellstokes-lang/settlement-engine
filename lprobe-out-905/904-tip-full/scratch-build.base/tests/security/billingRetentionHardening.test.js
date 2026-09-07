import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();
const migration = readFileSync(
  join(root, 'supabase', 'migrations', '024_billing_retention_and_atomic_mutations.sql'),
  'utf8',
);

describe('billing and retention hardening migration', () => {
  test('claims Stripe deliveries before granting credits', () => {
    expect(migration).toMatch(/credit_grant_idempotency/);
    expect(migration).toMatch(/on conflict do nothing[\s\S]*returning idempotency_key into claimed_key/);
    expect(migration).toMatch(/if claimed_key is null then[\s\S]*get_credit_balance/);
  });

  test('retains campaigns and backfills users who already downgraded', () => {
    expect(migration).toMatch(/alter table public\.saved_maps[\s\S]*access_state/);
    expect(migration).toMatch(/update public\.saved_maps sm[\s\S]*premium_downgraded_at is not null/);
    expect(migration).toMatch(/purge_expired_plan_inactive_assets/);
    expect(migration).toMatch(/cron\.schedule/);
  });

  test('keeps retained settlements read-only and counts only active free slots', () => {
    expect(migration).toMatch(/Users update active own settlements/);
    expect(migration).toMatch(/Users delete active own settlements/);
    expect(migration).toMatch(/where user_id = new\.user_id and access_state = 'active'/);
  });

  test('provides one atomic owned-settlement mutation boundary', () => {
    expect(migration).toMatch(/mutate_settlement_batch/);
    expect(migration).toMatch(/not active or not owned by caller/);
    expect(migration).toMatch(/grant execute on function public\.mutate_settlement_batch/);
  });
});
