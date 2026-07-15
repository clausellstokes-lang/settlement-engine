/**
 * profileStripeSubPin.test.js — migration 087 must pin profiles
 * .stripe_subscription_id IMMUTABLE in the end-user self-UPDATE RLS policy.
 *
 * Why it matters: the Stripe stale-delete guard (stripe-webhook) trusts
 * profiles.stripe_subscription_id. If an end user could self-UPDATE it, they
 * could set a bogus value, then cancel — the webhook would see recorded != deleted
 * and SKIP the downgrade, keeping premium for free. 087 recreates 075's
 * net-current self-UPDATE policy with the new column added to the `is not distinct
 * from` pin list (writable only via the service-role webhook). This source-guard
 * fails if a future edit drops the pin or fails to recreate the policy.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_087 = resolve(process.cwd(), 'supabase', 'migrations', '087_review_money_hardening.sql');

describe.runIf(existsSync(MIG_087))('087 self-UPDATE policy pins stripe_subscription_id', () => {
  const src = readFileSync(MIG_087, 'utf-8');
  const policy = (src.match(/create policy "Users update own profile[\s\S]*?\);/i) || [])[0];

  it('recreates the self-UPDATE policy in 087', () => {
    expect(policy, 'self-update policy not recreated in 087 (stripe_subscription_id would stay user-writable)').toBeTruthy();
  });

  it('pins the new stripe_subscription_id column `is not distinct from`', () => {
    expect(policy).toMatch(/stripe_subscription_id\s+is not distinct from/i);
  });

  it('preserves the existing billing/identity pins (net-current body not dropped)', () => {
    for (const col of ['role', 'tier', 'credits', 'is_founder', 'stripe_customer_id', 'banned_at', 'account_number']) {
      expect(policy, `pin for ${col} missing — the 075 net-current body was not forked verbatim`)
        .toMatch(new RegExp(`${col}\\s+is not distinct from`, 'i'));
    }
  });
});
