/**
 * moneyCheckConstraints.pglite.test.js — pins the load-bearing money-integrity CHECK
 * constraints that keep the credit ledger honest and were PRESENT-BUT-UNASSERTED
 * (Wave-D wall census):
 *   - credit_ledger.kind   in ('grant','spend')   (007) — direction is a closed enum
 *   - credit_ledger.amount > 0                     (007) — rows are always positive;
 *                                                          `kind` decides direction
 *   - credit_spend_allocations.amount > 0          (018) — an allocation cannot credit
 *
 * Each pin has two halves so a future edit cannot quietly weaken the wall:
 *   1. SOURCE: the migration file still declares the exact CHECK (drift-catcher).
 *   2. FUNCTIONAL (pglite): a row that violates the CHECK is REJECTED, and a valid
 *      row is accepted — proving the constraint's semantics, not just its presence.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = (n, name) => resolve(process.cwd(), 'supabase', 'migrations', `${n}_${name}.sql`);
const M_007 = MIG('007', 'credit_ledger');
const M_018 = MIG('018', 'account_billing_models_credits');
const have = [M_007, M_018].every(existsSync);
const SRC_007 = have ? readFileSync(M_007, 'utf-8') : '';
const SRC_018 = have ? readFileSync(M_018, 'utf-8') : '';

let db;

it('migrations 007 / 018 are present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('money-integrity CHECK constraints (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    // Minimal tables carrying ONLY the checked columns (FKs stripped so pglite runs
    // standalone). The CHECK bodies are asserted against the migration source below,
    // so a drift in either the migration or this scaffold is caught.
    await db.exec(`
      create table public.credit_ledger (
        id     bigint generated always as identity primary key,
        kind   text    not null check (kind in ('grant', 'spend')),
        amount integer not null check (amount > 0)
      );
      create table public.credit_spend_allocations (
        id     bigint generated always as identity primary key,
        amount integer not null check (amount > 0)
      );
    `);
  }, 60000);

  describe('credit_ledger.amount > 0 (007)', () => {
    it('the migration still declares the CHECK (source)', () => {
      expect(/amount\s+integer\s+not\s+null\s+check\s*\(\s*amount\s*>\s*0\s*\)/i.test(SRC_007)).toBe(true);
    });
    it('rejects amount = 0 and amount = -1, accepts a positive grant', async () => {
      await expect(db.query(`insert into public.credit_ledger (kind, amount) values ('grant', 0)`)).rejects.toThrow(/check|constraint/i);
      await expect(db.query(`insert into public.credit_ledger (kind, amount) values ('spend', -1)`)).rejects.toThrow(/check|constraint/i);
      await expect(db.query(`insert into public.credit_ledger (kind, amount) values ('grant', 5)`)).resolves.toBeTruthy();
    });
  });

  describe("credit_ledger.kind in ('grant','spend') (007)", () => {
    it('the migration still declares the enum CHECK (source)', () => {
      expect(/kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'grant'\s*,\s*'spend'\s*\)/i.test(SRC_007)).toBe(true);
    });
    it('rejects an out-of-enum kind, accepts grant + spend', async () => {
      await expect(db.query(`insert into public.credit_ledger (kind, amount) values ('steal', 5)`)).rejects.toThrow(/check|constraint/i);
      await expect(db.query(`insert into public.credit_ledger (kind, amount) values ('grant', 1)`)).resolves.toBeTruthy();
      await expect(db.query(`insert into public.credit_ledger (kind, amount) values ('spend', 1)`)).resolves.toBeTruthy();
    });
  });

  describe('credit_spend_allocations.amount > 0 (018)', () => {
    it('the migration still declares the CHECK (source)', () => {
      expect(/amount\s+integer\s+not\s+null\s+check\s*\(\s*amount\s*>\s*0\s*\)/i.test(SRC_018)).toBe(true);
    });
    it('rejects a zero / negative allocation, accepts a positive one', async () => {
      await expect(db.query(`insert into public.credit_spend_allocations (amount) values (0)`)).rejects.toThrow(/check|constraint/i);
      await expect(db.query(`insert into public.credit_spend_allocations (amount) values (-3)`)).rejects.toThrow(/check|constraint/i);
      await expect(db.query(`insert into public.credit_spend_allocations (amount) values (3)`)).resolves.toBeTruthy();
    });
  });
});
