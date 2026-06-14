/**
 * tests/security/refundLedger.contract.test.js — Tier 9.9 contract.
 *
 * Pins the three ledger-consistent RPCs (`spend_credits`,
 * `refund_credits`, `admin_grant_credits`) by grepping migration 009
 * for their signatures. If somebody renames an RPC or drops a
 * parameter, this fails immediately — even without a Postgres test
 * runner.
 *
 * Real concurrent-spend / refund-correlation tests live alongside
 * `tests/security/profile_security.contract.test.js` and run via
 * `supabase test db` when Docker is available.
 *
 * The audit doc is docs/refund-ledger-audit.md — it catalogues every
 * credit-touching path and tracks migration status off direct writes
 * onto these RPCs.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(process.cwd());
const MIG_009 = join(ROOT, 'supabase', 'migrations', '009_profile_security.sql');
const AUDIT_DOC = join(ROOT, 'docs', 'refund-ledger-audit.md');

const migExists = existsSync(MIG_009);

describe.runIf(migExists)('Tier 9.9 — RPC contract (ledger-consistent credit paths)', () => {
  const sql = readFileSync(MIG_009, 'utf-8');

  it('spend_credits(feature text) RPC exists with the right signature', () => {
    // Allow either order of clauses (language plpgsql / security definer
    // / set search_path) — assert just the signature.
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.spend_credits\s*\(\s*feature\s+text\s*\)/i);
    expect(sql).toMatch(/spend_credits[\s\S]{0,500}security\s+definer/i);
  });

  it('refund_credits(spend_ledger_row uuid, refund_reason text) RPC exists', () => {
    // Two-arg signature; reason default null.
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.refund_credits\s*\([\s\S]{0,200}spend_ledger_row\s+uuid[\s\S]{0,200}refund_reason\s+text/i);
    expect(sql).toMatch(/refund_credits[\s\S]{0,500}security\s+definer/i);
  });

  it('admin_grant_credits(target_user uuid, amount integer, reason text) RPC exists', () => {
    expect(sql).toMatch(/create\s+or\s+replace\s+function\s+public\.admin_grant_credits\s*\([\s\S]{0,200}target_user\s+uuid[\s\S]{0,200}amount\s+integer[\s\S]{0,200}reason\s+text/i);
    expect(sql).toMatch(/admin_grant_credits[\s\S]{0,800}security\s+definer/i);
  });

  it('refund_credits writes a new ledger row rather than restoring a counter', () => {
    // The body should INSERT into credit_ledger with kind='grant' +
    // source='refund', and use either the `reversed_by` column or a
    // metadata.refund_of key to correlate back to the spend.
    // NEVER an UPDATE that sets profiles.credits back to a stored
    // prior value.
    const refundSection = sql.match(/create\s+or\s+replace\s+function\s+public\.refund_credits[\s\S]*?\$\$;/i);
    expect(refundSection).toBeTruthy();
    const body = refundSection[0];
    // Should insert into credit_ledger.
    expect(body).toMatch(/insert\s+into\s+public\.credit_ledger/i);
    // Should mark the refund grant with a source='refund' tag.
    expect(body).toMatch(/['"]refund['"]/i);
    // Should reference the originating spend row via either
    // `reversed_by` (column-level link) or `refund_of` (JSON metadata).
    expect(body).toMatch(/reversed_by|refund_of/i);
    // The profile counter MUST only be touched via `credits + N`
    // arithmetic — never `credits = $1` style assignment that would
    // restore a stale snapshot.
    const dangerousRestore = /credits\s*=\s*(\$\d+|p_credits|old_credits)\b/i;
    expect(body).not.toMatch(dangerousRestore);
  });

  it('admin_grant_credits writes to credit_ledger AND credit_transactions (legacy audit)', () => {
    const section = sql.match(/create\s+or\s+replace\s+function\s+public\.admin_grant_credits[\s\S]*?\$\$;/i);
    expect(section).toBeTruthy();
    const body = section[0];
    expect(body).toMatch(/insert\s+into\s+public\.credit_ledger/i);
    expect(body).toMatch(/insert\s+into\s+public\.credit_transactions/i);
    // Must call _audit_action.
    expect(body).toMatch(/_audit_action/i);
  });

  it('admin_grant_credits enforces the privileged-caller check', () => {
    const section = sql.match(/create\s+or\s+replace\s+function\s+public\.admin_grant_credits[\s\S]*?\$\$;/i);
    const body = section[0];
    // current_user_is_privileged() must be called, with a raise on
    // failure.
    expect(body).toMatch(/current_user_is_privileged/i);
    expect(body).toMatch(/raise\s+exception/i);
  });

  it('admin_grant_credits has a per-call amount cap (defense against runaway grants)', () => {
    const section = sql.match(/create\s+or\s+replace\s+function\s+public\.admin_grant_credits[\s\S]*?\$\$;/i);
    const body = section[0];
    expect(body).toMatch(/amount\s*>\s*\d{4,}/);  // looks for `if amount > 10000` etc.
  });

  // ── Money-math SAFETY CLAUSES (static) ──────────────────────────────────────
  // The audit flagged that the credit math is asserted statically, never run
  // against Postgres (execution tests need `supabase test db` + Docker). These
  // raise the static floor from "signature exists" to "the actual double-spend
  // and double-refund guards are present", so a regression that strips them
  // fails CI even without a DB.
  const spendBody  = sql.match(/create\s+or\s+replace\s+function\s+public\.spend_credits[\s\S]*?\$\$;/i)?.[0] || '';
  const refundBody = sql.match(/create\s+or\s+replace\s+function\s+public\.refund_credits[\s\S]*?\$\$;/i)?.[0] || '';

  it('spend_credits debits via an atomic compare-and-decrement (no TOCTOU overspend)', () => {
    expect(spendBody).toBeTruthy();
    // Race protection is a SINGLE update that subtracts and guards balance in
    // the same statement — two concurrent spends can't both pass `credits >=`.
    expect(spendBody).toMatch(/update\s+public\.profiles[\s\S]*?set\s+credits\s*=\s*credits\s*-\s*cost/i);
    expect(spendBody).toMatch(/where[\s\S]*?credits\s*>=\s*cost/i);
    // And it rejects an overspend instead of going negative.
    expect(spendBody).toMatch(/insufficient_funds/i);
  });

  it('spend_credits never assigns a recomputed balance back (TOCTOU vector)', () => {
    // A `set credits = <number|var>` (vs `credits - cost` arithmetic) would
    // clobber concurrent writes. The only legal write is the arithmetic one.
    expect(spendBody).not.toMatch(/set\s+credits\s*=\s*(remaining|cost|\d+|\$\d+)\b/i);
  });

  it('refund_credits is idempotent — refuses to refund the same spend twice', () => {
    expect(refundBody).toBeTruthy();
    // Must look for an existing refund grant correlated to this spend and bail,
    // so a retried/duplicated refund can't double-credit the account.
    expect(refundBody).toMatch(/exists\s*\(/i);
    expect(refundBody).toMatch(/refund_of/i);
    expect(refundBody).toMatch(/already\s+refunded/i);
  });

  it('refund_credits validates the target is a spend row and authorizes the caller', () => {
    expect(refundBody).toMatch(/kind\s*(<>|!=)\s*'spend'/i);        // can't refund a non-spend
    expect(refundBody).toMatch(/current_user_is_privileged/i);      // owner-or-admin only
    expect(refundBody).toMatch(/not\s+authorized/i);
  });

  it('refund_credits credits back via arithmetic, never a stored snapshot', () => {
    expect(refundBody).toMatch(/credits\s*=\s*credits\s*\+\s*spend_row\.amount/i);
  });
});

describe('Tier 9.9 — audit doc is in the repo', () => {
  it('docs/refund-ledger-audit.md is committed', () => {
    expect(existsSync(AUDIT_DOC)).toBe(true);
  });

  it('audit doc enumerates every credit-touching edge function path', () => {
    const doc = readFileSync(AUDIT_DOC, 'utf-8');
    // Stripe webhook, admin actions, generate-narrative spend + refund.
    expect(doc).toMatch(/stripe-webhook/);
    expect(doc).toMatch(/admin-actions/);
    expect(doc).toMatch(/generate-narrative/);
    // Mentions the three RPCs.
    expect(doc).toMatch(/spend_credits/);
    expect(doc).toMatch(/refund_credits/);
    expect(doc).toMatch(/admin_grant_credits/);
  });
});
