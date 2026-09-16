/**
 * Default-gate structural contract for migration 175. Executable behavior lives
 * in the Deno tests and the full PGlite migration test; this keeps the trust
 * boundary visible on machines without Deno.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (...parts) =>
  readFileSync(resolve(process.cwd(), ...parts), 'utf8');
const accountActions = read('supabase/functions/account-actions/index.ts');
const worker = read('supabase/functions/account-deletion-worker/index.ts');
const shared = read('supabase/functions/_shared/accountDeletionCleanup.ts');
const migration = read('supabase/migrations/175_account_deletion_cleanup_queue.sql');

describe('durable account-deletion external cleanup', () => {
  it('manual and scheduled paths call the same shared implementation', () => {
    expect(accountActions).toMatch(
      /from "\.\.\/_shared\/accountDeletionCleanup\.ts"/,
    );
    expect(worker).toMatch(
      /from "\.\.\/_shared\/accountDeletionCleanup\.ts"/,
    );
    expect(accountActions).toContain('processAccountDeletionCleanupQueue(');
    expect(worker).toContain(
      'deps.processQueue ?? processAccountDeletionCleanupQueue',
    );
  });

  it('paginates Stripe and refuses a non-advancing cursor', () => {
    expect(shared).toContain('starting_after');
    expect(shared).toContain('page?.has_more !== true');
    expect(shared).toContain(
      'Stripe subscription pagination did not advance',
    );
    expect(shared).toContain(
      'claim_account_deletion_cleanup_jobs',
    );
    expect(shared).not.toMatch(
      /\.from\(["']profiles["']\)[\s\S]{0,500}\.limit\(500\)/,
    );
  });

  it('deletes each enumerated Stripe customer before database completion', () => {
    const list = shared.indexOf('listAllDeletionSubscriptionIds(');
    const customerDelete = shared.indexOf('stripeApi.customers.del(customerId)');
    const completion = shared.indexOf(
      '"complete_account_deletion_cleanup_job"',
    );
    expect(list).toBeGreaterThan(-1);
    expect(customerDelete).toBeGreaterThan(list);
    expect(completion).toBeGreaterThan(customerDelete);
    expect(shared).toContain('customersDeleted');
  });

  it('auth progress is checkpointed and linkage is cleared only by the transactional completion RPC', () => {
    expect(shared).toContain('mark_account_deletion_auth_revoked');
    expect(shared).toContain('complete_account_deletion_cleanup_job');
    expect(shared).not.toContain('stripe_subscription_id: null');
    expect(migration).toMatch(
      /complete_account_deletion_cleanup_job[\s\S]*?auth_revoked_at is null[\s\S]*?stripe_subscription_id = null[\s\S]*?status = 'done'/i,
    );
  });

  it('uses the high-entropy cron secret as its trust anchor, without a fragile UA gate', () => {
    expect(worker).toContain(
      'timingSafeEqualText(providedSecret, expectedSecret)',
    );
    expect(worker).not.toContain('botGuard(');
  });

  it('the replacement cron is inert until configured and never directly runs the SQL processor', () => {
    expect(migration).toMatch(
      /'account_deletion_cron', jsonb_build_object\([\s\S]*?'url', null[\s\S]*?'secret', null/,
    );
    expect(migration).toMatch(
      /jobname in \('account-deletions-daily', 'account-deletion-cleanup-hourly'\)/,
    );
    expect(migration).toContain(
      '$job$select public.run_account_deletion_cleanup();$job$',
    );
    expect(migration).not.toContain(
      "$job$select public.process_account_deletions(null, 7, 500);$job$",
    );
  });
});
