/**
 * tests/components/privacyPolicyParity.test.js — PRIVACY POLICY ↔ SHIPPED
 * REALITY parity (C3-experience findings 7 + 8, bar-16 honesty).
 *
 * The policy used to say "three settings" while PrivacySettings rendered FOUR
 * toggles — including a market-research licensing tier the policy never
 * disclosed — and promised "we will remove it" where the shipped mechanism is
 * anonymise-and-lock (054, soft-delete by design). Nothing failed when policy
 * and reality diverged. This binds the load-bearing claims:
 *
 *   • the policy's settings COUNT ⟷ the actual PrivacySettings toggle roster
 *   • the market/licensing tier is disclosed in the policy
 *   • the deletion promise matches 054's anonymise+lock soft-delete
 *   • the three-month lapsed-plan retention window ⟷ 024's interval '3 months'
 *
 * CANNOT-CATCH: semantic drift that keeps the bound tokens; consent BEHAVIOR
 * changes (consent.js defaults) — tests/ui + lib consent suites own those;
 * policy claims about Stripe/DNT/local storage. Residual: legal review (the
 * page's own under-review banner) owns final wording.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');
const policy = read('src/components/legal/PrivacyPage.jsx');
const settings = read('src/components/PrivacySettings.jsx');

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

describe('privacy policy ↔ shipped consent model parity', () => {
  const toggleIds = [...settings.matchAll(/^\s*id="([a-z_]+)"/gm)].map((m) => m[1]);

  it('PrivacySettings renders the known toggle roster', () => {
    expect(toggleIds).toEqual(['essential', 'research', 'market', 'ai_prose']);
  });

  it('the policy states the settings COUNT that PrivacySettings actually renders', () => {
    const word = NUMBER_WORDS[toggleIds.length];
    expect(policy, `policy must say "${word} plain-language settings" — the real toggle count`)
      .toContain(`${word} plain-language settings`);
    // The stale count must not linger anywhere in the policy.
    for (const stale of NUMBER_WORDS.filter((w) => w !== word)) {
      expect(policy).not.toContain(`${stale} plain-language settings`);
    }
  });

  it('the market-research licensing tier is disclosed, with its opt-in default', () => {
    // The settings toggle says data "may be shared or licensed to the
    // worldbuilding market" — the policy must carry the same disclosure.
    expect(settings).toMatch(/shared or licensed to the\s+worldbuilding market/);
    expect(policy).toMatch(/market-research/);
    expect(policy).toMatch(/shared or\s+licensed/);
    expect(policy).toMatch(/off by\s+default/);
    expect(policy).toMatch(/We do not sell your\s+personal data/);
  });

  it('the deletion promise matches the shipped anonymise+lock soft-delete (054)', () => {
    const migration = read('supabase/migrations/054_account_deletion_processing.sql');
    expect(migration).toMatch(/anonymise/i);
    expect(migration).toMatch(/never a (hard|row) delete/i);
    expect(policy).toMatch(/anonymised and locked/);
    // The old overpromise ("contact us … and we will remove it") stays out.
    expect(policy).not.toMatch(/we\s+will remove it/);
  });

  it('the three-month lapsed-plan retention window is disclosed and matches 024', () => {
    const migration = read('supabase/migrations/024_billing_retention_and_atomic_mutations.sql');
    expect(migration).toMatch(/interval '3 months'/);
    expect(policy).toMatch(/three-month retention window/);
  });

  it('discloses operator-message records without claiming email-open tracking', () => {
    expect(policy).toMatch(/Operator communications/);
    expect(policy).toMatch(/consent-history record/);
    expect(policy).toMatch(/do not place tracking pixels in email/);
    expect(policy).toMatch(/Message bodies never enter analytics/);
    expect(policy).toMatch(/Deletion removes your direct\s+notices, message receipts, and consent history/);
  });
});
