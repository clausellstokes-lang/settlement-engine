/**
 * creditAllocationTrigger.pglite.test.js — EXECUTION-level tests for the
 * allocation-within-grant backstop trigger (097 + the 098 double-count fix).
 *
 * 097 shipped trg_allocation_within_grant as an AFTER constraint trigger but
 * kept BEFORE-trigger arithmetic: the SUM over credit_spend_allocations already
 * contained the firing row, and the body added NEW.amount again — so any
 * allocation of more than half a grant's headroom was falsely rejected. That
 * blocked spend_credits itself (a 'narrative' spend of 3 against a fresh
 * 5-grant raised) and made the 1-credit welcome grant unspendable. 098 replaces
 * the function body with the post-write-total check.
 *
 * This suite loads the NET-CURRENT trigger (097's constraint-trigger DDL +
 * 098's function body) onto the shared credit-ledger harness and proves:
 *   - the legitimate paths PASS (3-of-5, exact 5-of-5, 1-of-1 welcome,
 *     spend_credits end-to-end, an in-bounds UPDATE), and
 *   - the backstop still FIRES on genuine over-allocation (INSERT and UPDATE).
 *
 * Before 098 exists (or with 097's body active) the legitimate-path tests fail,
 * which is exactly the regression this file pins.
 */

import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';

import { MIG, allMigrationsExist, extractFn, makeCreditLedgerDb } from './creditLedgerHarness.js';

/** Extract 097's constraint-trigger DDL verbatim (drop-if-exists + create).
 *  The revoke is NOT taken from the file here — the harness DB has no
 *  anon/authenticated roles, and grants aren't enforced in single-connection
 *  pglite anyway (see creditLedger.pglite.test.js's netExecuteGrants pin). */
function extractConstraintTriggerDdl() {
  const src = readFileSync(MIG['097'], 'utf-8');
  const m = src.match(/drop\s+trigger\s+if\s+exists\s+trg_allocation_within_grant[\s\S]*?execute\s+function\s+public\.enforce_allocation_within_grant\(\);/i);
  if (!m) throw new Error('could not extract trg_allocation_within_grant DDL from migration 097');
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';

let db;
const scalar = async (q) => (await db.query(q)).rows[0];
const balanceOf = async (uid) => (await scalar(`select public.get_credit_balance('${uid}') as b`)).b;
/** Seed a grant ledger row, returning its id. */
const grant = async (uid, amount, { source = 'purchase' } = {}) =>
  (await db.query(
    `insert into public.credit_ledger (user_id, kind, amount, source) values ($1,'grant',$2,$3) returning id`,
    [uid, amount, source],
  )).rows[0].id;
/** Seed a spend ledger row (the allocation FK target), returning its id. */
const spendRow = async (uid, amount) =>
  (await db.query(
    `insert into public.credit_ledger (user_id, kind, amount, source) values ($1,'spend',$2,'narrative') returning id`,
    [uid, amount],
  )).rows[0].id;
/** Direct allocation write — the exact path the backstop exists to police. */
const allocate = (spendId, grantId, amount) =>
  db.query(
    `insert into public.credit_spend_allocations (spend_id, grant_id, amount) values ($1,$2,$3)`,
    [spendId, grantId, amount],
  );

// Vacuity guard (runs unconditionally): if 097/098 are ever renamed/removed the
// runIf suite below silently runs ZERO assertions while reporting green.
it('targeted migration(s) present (suite not vacuous)', () => {
  expect(allMigrationsExist).toBe(true);
});

describe.runIf(allMigrationsExist)('allocation-within-grant trigger — net-current (097 DDL + 098 body)', () => {
  beforeAll(async () => {
    db = await makeCreditLedgerDb();
    // Apply the migrations' own sequence: 097's (buggy) function + trigger DDL,
    // then 098's create-or-replace — the same order prod runs them, proving the
    // replace alone (no trigger recreate) lands the fix.
    await db.exec(extractFn('097', 'enforce_allocation_within_grant'));
    await db.exec(extractConstraintTriggerDdl());
    await db.exec(extractFn('098', 'enforce_allocation_within_grant'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.profiles, public.credit_spend_allocations, public.credit_grant_idempotency, public.credit_ledger, public.credit_transactions cascade;');
    await db.exec(`insert into public.profiles (id, role, credits) values ('${UID}', 'user', 0);`);
    await db.exec(`set test.privileged = 'false'; set test.role = 'authenticated'; set test.uid = '${UID}';`);
  });

  // ── the 097 regression: legitimate allocations must NOT be rejected ─────────
  it('allocating 3 of a fresh 5-grant succeeds (097 double-counted this to 6)', async () => {
    const g = await grant(UID, 5);
    const s = await spendRow(UID, 3);
    await expect(allocate(s, g, 3)).resolves.toBeTruthy();
    expect((await scalar(`select coalesce(sum(amount),0)::int t from public.credit_spend_allocations`)).t).toBe(3);
  });

  it('an exact full allocation (5 of 5) succeeds', async () => {
    const g = await grant(UID, 5);
    const s = await spendRow(UID, 5);
    await expect(allocate(s, g, 5)).resolves.toBeTruthy();
  });

  it('the 1-credit welcome grant is spendable (1 of 1)', async () => {
    const g = await grant(UID, 1, { source: 'welcome' });
    const s = await spendRow(UID, 1);
    await expect(allocate(s, g, 1)).resolves.toBeTruthy();
  });

  it('spend_credits end-to-end is not blocked by the backstop (the live-path regression)', async () => {
    await grant(UID, 5);
    const { r } = await scalar("select public.spend_credits('narrative') as r"); // cost 3
    expect(r.ok).toBe(true);
    expect(r.balance).toBe(2);
    expect(await balanceOf(UID)).toBe(2);
  });

  it('an UPDATE that stays within the grant succeeds (097 counted NEW twice)', async () => {
    const g = await grant(UID, 5);
    const s = await spendRow(UID, 3);
    await allocate(s, g, 3);
    await expect(
      db.query(`update public.credit_spend_allocations set amount = 5 where spend_id = $1 and grant_id = $2`, [s, g]),
    ).resolves.toBeTruthy();
  });

  // ── the backstop itself still fires on GENUINE over-allocation ──────────────
  it('an insert that would total 6 of a 5-grant still raises', async () => {
    const g = await grant(UID, 5);
    const s1 = await spendRow(UID, 3);
    await allocate(s1, g, 3);
    const s2 = await spendRow(UID, 3);
    await expect(allocate(s2, g, 3)).rejects.toThrow(/over-allocation/);
    // The rejected row must not have landed (post-write total stays 3).
    expect((await scalar(`select coalesce(sum(amount),0)::int t from public.credit_spend_allocations`)).t).toBe(3);
  });

  it('an UPDATE that would exceed the grant still raises', async () => {
    const g = await grant(UID, 5);
    const s = await spendRow(UID, 3);
    await allocate(s, g, 3);
    await expect(
      db.query(`update public.credit_spend_allocations set amount = 6 where spend_id = $1 and grant_id = $2`, [s, g]),
    ).rejects.toThrow(/over-allocation/);
  });

  it('an allocation against a missing / non-grant ledger row still raises (097 checks kept)', async () => {
    const s = await spendRow(UID, 2);
    // A missing grant_id is rejected by the FK before the trigger's own
    // missing-row raise gets a turn (that branch backstops FK-less/deferred
    // states) — either way the write must fail.
    await expect(allocate(s, '99999999-9999-9999-9999-999999999999', 1)).rejects.toThrow(/missing ledger row|foreign key/);
    const otherSpend = await spendRow(UID, 2);
    await expect(allocate(s, otherSpend, 1)).rejects.toThrow(/not a grant/);
  });
});
