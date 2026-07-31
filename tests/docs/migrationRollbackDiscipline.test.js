import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';
// The reviewed wave train is the totality layer the runbook names over this
// convention; the exception list below is checked against it, never asserted.
import { MIGRATION_WAVES } from '../../scripts/ops/migrationRehearsalCore.mjs';

/**
 * Migration rollback discipline (audit: "no SQL down/rollback exists — the scariest
 * operational gap"). Supabase migrations are forward-only. This pins the reversal
 * discipline: a runbook, data-safe reversals for the schema-additive money migrations,
 * and a FORWARD contract that any NEW money/PII migration ships a reversal or an
 * explicit `-- @rollback:` note — so reversibility is tracked, not discovered mid-incident.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ROLLBACK = join(root, 'supabase/rollback');
const MIGRATIONS = join(root, 'supabase/migrations');

const migrationFiles = () => readdirSync(MIGRATIONS).filter((f) => /^\d+.*\.sql$/.test(f));
const migNum = (f) => Number.parseInt(f.match(/^(\d+)/)[1], 10);

describe('migration rollback discipline', () => {
  test('the rollback runbook exists and documents the convention', () => {
    const readme = readFileSync(join(ROLLBACK, 'README.md'), 'utf8');
    expect(readme).toMatch(/forward-fix first/i);
    expect(readme).toMatch(/@rollback:/);
  });

  test('every .down.sql reverses a REAL migration and actually drops something', () => {
    const downs = readdirSync(ROLLBACK).filter((f) => f.endsWith('.down.sql'));
    expect(downs.length).toBeGreaterThan(0); // not vacuous
    const nums = new Set(migrationFiles().map(migNum));
    for (const d of downs) {
      const n = Number.parseInt(d.match(/^(\d+)/)?.[1] ?? 'NaN', 10);
      expect(nums.has(n), `${d} targets migration ${n} which does not exist`).toBe(true);
      expect(readFileSync(join(ROLLBACK, d), 'utf8')).toMatch(/drop\s+(trigger|function|index|constraint|table|policy)/i);
    }
  });

  test('the two cleanly-reversible money migrations (087 index, 097 trigger) have reversals', () => {
    expect(existsSync(join(ROLLBACK, '097_enforce_allocation_within_grant.down.sql'))).toBe(true);
    expect(existsSync(join(ROLLBACK, '087_refund_unique_index.down.sql'))).toBe(true);
  });

  // FORWARD CONTRACT: a NEW migration (numbered above the current documented head)
  // that touches a money/PII table must ship a reversal or carry a `-- @rollback:`
  // note. Retroactive migrations are grandfathered — the runbook covers them — so this
  // guards the future without a huge back-fill.
  // THE ENFORCED SURFACE. The original list was written at migration 097 and never
  // grew, so it named the credit spine, profiles and security_answers — and nothing
  // the money-hardening stack (122-192) added. The value- and identity-bearing tables
  // that shipped after it (the money spine, refund obligations, purchases,
  // entitlements, founder custody, referral value, the encrypted BYOK vault, the
  // deletion lifecycle, the analytics identity mapping) all escaped the contract by
  // construction. Names are spelled out rather than prefix-matched so the enforced
  // surface is auditable line-by-line against `create table` in supabase/migrations.
  const MONEY_PII_TABLES = [
    // value + ledger
    'credit_ledger', 'credit_spend_allocations', 'credit_grant_idempotency',
    'credit_transactions', 'credit_drift_log',
    'credit_auto_reload_settings', 'credit_auto_reload_attempts',
    'ai_spend_reservations', 'ai_usage_events',
    'money_events', 'payment_refund_obligations', 'processed_webhook_events',
    // purchases + entitlements
    'dossier_purchases', 'single_dossier_purchases', 'dossier_entitlements',
    'surveyor_entitlements', 'referrals', 'redemptions', 'redeem_codes',
    // founder custody (seat value moves through these)
    'founder_seats', 'founder_seat_transfers', 'founder_seat_buybacks',
    'founder_seat_buyback_challenges',
    'founder_transfer_cases', 'founder_transfer_challenges', 'founder_transfer_events',
    // PII + secrets + the deletion/identity lifecycle
    'profiles', 'security_answers', 'surveyor_byok_keys',
    'deletion_requests', 'account_deletion_cleanup_jobs',
    'email_preferences', 'support_messages', 'support_ticket_events',
    'current_account_session', 'reserved_external_names',
    'analytics_identity_links', 'analytics_device_links',
  ];
  const MONEY_TABLES = new RegExp(`\\b(?:${MONEY_PII_TABLES.join('|')})\\b`);
  const GRANDFATHERED_HEAD = 97;

  // Post-097 migrations whose reversal posture is recorded OUTSIDE the migration —
  // in the reviewed wave manifest (scripts/ops/migrationRehearsalCore.mjs), which the
  // runbook names as the totality layer over this convention. Listed BY FILE, never by
  // rule, so the exception cannot spread: any other migration touching these tables
  // still owes an inline note or a .down.sql. 122 still owes its inline annotation —
  // it is tracked here rather than invisible, which was the whole point of the gate.
  const WAVE_CLASSIFIED_FILES = new Set(['122_dossier_purchases.sql']);

  /** Money/PII migrations past the grandfather head with neither a note nor a down script. */
  const uncoveredMoneyMigrations = (tableRe) => {
    const downNums = new Set(
      readdirSync(ROLLBACK).filter((f) => f.endsWith('.down.sql')).map((f) => Number.parseInt(f.match(/^(\d+)/)?.[1] ?? 'NaN', 10)),
    );
    const out = [];
    for (const f of migrationFiles()) {
      const n = migNum(f);
      if (n <= GRANDFATHERED_HEAD) continue; // grandfathered — covered by the runbook
      const src = readFileSync(join(MIGRATIONS, f), 'utf8');
      if (!tableRe.test(src)) continue; // not money/PII — no reversal required
      const hasNote = /--\s*@rollback:/i.test(src);
      if (!hasNote && !downNums.has(n)) out.push(f);
    }
    return out;
  };

  test('new money/PII migrations ship a reversal or an explicit @rollback note', () => {
    const offenders = uncoveredMoneyMigrations(MONEY_TABLES).filter((f) => !WAVE_CLASSIFIED_FILES.has(f));
    expect(
      offenders,
      `these money/PII migrations need a supabase/rollback/<n>_*.down.sql or a '-- @rollback:' note:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  test('the enforced table set covers strictly more than the 097-era list', () => {
    // Guard-the-guard against a no-op widening: the contract must name tables the
    // original regex never did, and each name must be a table this schema actually
    // creates (a typo would silently enforce nothing).
    const ORIGINAL = ['credit_ledger', 'credit_spend_allocations', 'credit_grant_idempotency', 'ai_spend_reservations', 'profiles', 'security_answers'];
    expect(MONEY_PII_TABLES).toEqual(expect.arrayContaining(ORIGINAL));
    expect(MONEY_PII_TABLES.length).toBeGreaterThan(ORIGINAL.length * 3);
    expect(new Set(MONEY_PII_TABLES).size).toBe(MONEY_PII_TABLES.length); // no duplicates
    const created = new Set();
    for (const f of migrationFiles()) {
      const src = readFileSync(join(MIGRATIONS, f), 'utf8');
      for (const m of src.matchAll(/create table if not exists (?:public\.)?([a-z0-9_]+)/gi)) created.add(m[1]);
    }
    for (const t of MONEY_PII_TABLES) {
      expect(created, `${t} is enforced by the contract but no migration creates it`).toContain(t);
    }
  });

  test('every wave-classified exception is a REAL one, and its wave really classifies it', () => {
    // An exception list rots into a blanket escape hatch the moment an entry stops
    // being an exception. Each listed file must still be post-grandfather, still match
    // the enforced tables, still lack both a note and a down script — and its number
    // must fall inside a reviewed wave that states a rollback mode.
    const uncovered = new Set(uncoveredMoneyMigrations(MONEY_TABLES));
    expect(WAVE_CLASSIFIED_FILES.size).toBeGreaterThan(0); // not vacuous
    for (const f of WAVE_CLASSIFIED_FILES) {
      expect(uncovered, `${f} is no longer uncovered — delete it from WAVE_CLASSIFIED_FILES`).toContain(f);
      const n = migNum(f);
      expect(n).toBeGreaterThan(GRANDFATHERED_HEAD);
      const wave = MIGRATION_WAVES.find((w) => n >= w.from && n <= w.to);
      expect(wave, `${f} claims a wave classification but no wave covers migration ${n}`).toBeTruthy();
      expect(wave.rollback.mode, `${f}'s wave states no rollback mode`).toBeTruthy();
    }
  });
});
