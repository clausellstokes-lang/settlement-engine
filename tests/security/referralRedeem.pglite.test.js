/**
 * referralRedeem.pglite.test.js — EXECUTION tests for the referral + redeem-code
 * foundation (migration 107) against in-process Postgres (pglite).
 *
 * WHAT THIS PROVES (each load-bearing — a revert turns it RED)
 *   1. record_referral_intent rejects self-referral, an unknown account number,
 *      a banned referrer (collapsed into the SAME reason — no moderation-state
 *      probe), a duplicate intent, and the 50-open-referral per-referrer cap.
 *   2. grant_referral is claim-once (pending → granted exactly once; a second
 *      call finds no row), re-asserts amount_paid > 0 (the zero-dollar red-team
 *      gate), and refuses a replayed invoice id via the partial unique index.
 *   3. clawback_referral flips GRANTED rows only, returns the per-party
 *      rewards/coupons, and is idempotent.
 *   4. validate_redeem_code collapses unknown/inactive/expired/exhausted into
 *      one 'invalid_code' (anti-enumeration) and NEVER leaks the coupon id.
 *   5. reserve_redemption's guarded atomic increment respects max_uses (two
 *      reserves on a one-seat code → one wins), rolls uses_count back on the
 *      once-per-user conflict, and revert_redemption decrements idempotently.
 *   6. RLS: users read only redemptions/referrals they are party to;
 *      redeem_codes and processed_webhook_events return zero rows to clients;
 *      every client table write is denied (no write policies exist).
 *   7. Every value-moving RPC carries the in-body service-role assertion.
 *
 * REALISM
 *   The ENTIRE 107 file is applied verbatim (tables + indexes + RLS + grants +
 *   RPC bodies), so a migration edit is what these tests exercise. auth.uid()/
 *   auth.role() are GUC-backed shims (the worldPulseAtomicPersist pattern);
 *   account_is_active is the verbatim 057 shape over a minimal profiles.
 *   pglite is single-connection, so races are proven the aiSpendReservation
 *   way: sequential calls demonstrate the guard, and a source-inspection pin
 *   asserts the SINGLE-STATEMENT guarded UPDATE / advisory lock that makes the
 *   guard race-safe under true concurrency cannot be silently refactored away.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase', 'migrations', '107_referral_redeem.sql');
const have = existsSync(MIG);
const SRC = have ? readFileSync(MIG, 'utf-8') : '';

// Vacuity guard (runs unconditionally): if the targeted migration is ever
// renamed/removed the runIf suite below silently runs ZERO assertions while
// reporting green. Fail loudly here instead.
it('migration 107 present (suite not vacuous)', () => {
  expect(have).toBe(true);
});

const REFERRER = '11111111-1111-1111-1111-111111111111';
const REFEREE = '22222222-2222-2222-2222-222222222222';
const MALLORY = '33333333-3333-3333-3333-333333333333';
const BANNED = '44444444-4444-4444-4444-444444444444';

const ACCT = {
  [REFERRER]: 'SF-AAA2345',
  [REFEREE]: 'SF-CCC2345',
  [MALLORY]: 'SF-DDD2345',
  [BANNED]: 'SF-BBB2345',
};

let db;

/** Run one query as the service-role caller (webhook / create-checkout). */
async function asService(sql, params = []) {
  await db.exec(`reset role; set request.jwt.claim.role = 'service_role'; set test.uid = '';`);
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec(`set request.jwt.claim.role = '';`);
  }
}

/** Run one query as an authenticated end-user (definer RPCs read auth.uid()). */
async function asAuthed(uid, sql, params = []) {
  await db.exec(`reset role; set request.jwt.claim.role = 'authenticated'; set test.uid = '${uid}';`);
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec(`set request.jwt.claim.role = ''; set test.uid = '';`);
  }
}

/** Run one query as a non-superuser DB role so table RLS actually applies. */
async function asClientTable(uid, sql) {
  await db.exec(`reset role; set request.jwt.claim.role = 'authenticated'; set test.uid = '${uid}'; set role nosuperuser;`);
  try {
    return await db.query(sql);
  } finally {
    await db.exec(`reset role; set request.jwt.claim.role = ''; set test.uid = '';`);
  }
}

const superRow = async (sql, params = []) => {
  await db.exec(`reset role;`);
  return (await db.query(sql, params)).rows[0];
};

const intent = async (uid, account) =>
  (await asAuthed(uid, 'select public.record_referral_intent($1) as r', [account])).rows[0].r;
const grant = async (referee, invoice, cents) =>
  (await asService('select public.grant_referral($1, $2, $3) as r', [referee, invoice, cents])).rows[0].r;
const detail = async (id, party, reward, coupon) =>
  (await asService('select public.record_referral_grant_detail($1, $2, $3, $4) as r', [id, party, reward, coupon])).rows[0].r;
const clawback = async (invoice) =>
  (await asService('select public.clawback_referral($1) as r', [invoice])).rows[0].r;
const validate = async (uid, code) =>
  (await asAuthed(uid, 'select public.validate_redeem_code($1) as r', [code])).rows[0].r;
const reserve = async (code, user) =>
  (await asService('select public.reserve_redemption($1, $2) as r', [code, user])).rows[0].r;
const bind = async (redemptionId, session) =>
  (await asService('select public.bind_redemption_session($1, $2) as r', [redemptionId, session])).rows[0].r;
const apply = async (session) =>
  (await asService('select public.apply_redemption($1) as r', [session])).rows[0].r;
const revert = async (session) =>
  (await asService('select public.revert_redemption($1) as r', [session])).rows[0].r;

const usesCount = async (code) =>
  Number((await superRow('select uses_count from public.redeem_codes where code = $1', [code])).uses_count);
const referralStatus = async (referee) =>
  (await superRow('select status from public.referrals where referee_user_id = $1', [referee]))?.status;

/** Seed a redeem code as the operator (service-role writes directly). */
const seedCode = (over = {}) => {
  const c = {
    code: 'WELCOME1', kind: 'free_month', stripe_coupon_id: 'coup_secret_month',
    credit_amount: null, applies_to: 'any', max_uses: 1, uses_count: 0,
    stackable: false, active: true, expires_at: null, ...over,
  };
  return db.query(
    `insert into public.redeem_codes
       (code, kind, stripe_coupon_id, credit_amount, applies_to, max_uses, uses_count, stackable, active, expires_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [c.code, c.kind, c.stripe_coupon_id, c.credit_amount, c.applies_to, c.max_uses, c.uses_count, c.stackable, c.active, c.expires_at],
  );
};

describe.runIf(have)('107 referral + redeem codes — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Scaffold: the Supabase-managed objects 107 references — auth schema +
    // GUC-backed uid()/role() shims, auth.users (FK target), the platform
    // roles, a minimal profiles with the 053/054 status flags + the 075
    // account_number, and account_is_active in its verbatim 057 shape.
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function auth.role() returns text language sql stable as $fn$
        select coalesce(nullif(current_setting('test.role', true), ''), 'anon')
      $fn$;
      create table if not exists auth.users (id uuid primary key);
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
        if not exists (select from pg_roles where rolname = 'nosuperuser') then create role nosuperuser nologin; end if;
      end $do$;

      create table public.profiles (
        id uuid primary key,
        account_number text,
        banned_at   timestamptz,
        disabled_at timestamptz,
        deleted_at  timestamptz
      );
      -- Verbatim 057 predicate shape (fail-closed: missing profile = inactive).
      create or replace function public.account_is_active(p_uid uuid)
      returns boolean language sql stable as $fn$
        select exists (
          select 1 from public.profiles
          where id = p_uid
            and banned_at   is null
            and disabled_at is null
            and deleted_at  is null
        );
      $fn$;
    `);

    // The REAL migration, whole file, verbatim — tables, indexes, RLS,
    // policies, grants, and all nine RPC bodies.
    await db.exec(SRC);

    // Table privileges for the client role: PostgREST's authenticated role has
    // table grants in prod — RLS (not the grant layer) must be what denies.
    await db.exec(`
      grant usage on schema public to nosuperuser;
      grant select, insert, update, delete on
        public.referrals, public.redemptions, public.redeem_codes, public.processed_webhook_events
        to nosuperuser;
    `);
  });

  beforeEach(async () => {
    await db.exec(`
      reset role; set request.jwt.claim.role = ''; set test.uid = '';
      truncate public.redemptions, public.referrals, public.redeem_codes, public.processed_webhook_events cascade;
      truncate public.profiles cascade;
      truncate auth.users cascade;
    `);
    await db.query(`insert into auth.users (id) values ($1), ($2), ($3), ($4)`, [REFERRER, REFEREE, MALLORY, BANNED]);
    await db.query(
      `insert into public.profiles (id, account_number) values ($1, $2), ($3, $4), ($5, $6), ($7, $8)`,
      [REFERRER, ACCT[REFERRER], REFEREE, ACCT[REFEREE], MALLORY, ACCT[MALLORY], BANNED, ACCT[BANNED]],
    );
    await db.query(`update public.profiles set banned_at = now() where id = $1`, [BANNED]);
  });

  // ── record_referral_intent ──────────────────────────────────────────────────
  describe('record_referral_intent — referee-side intent recording', () => {
    it('SENTINEL: a clean intent lands as a pending row snapshotting the account number', async () => {
      const r = await intent(REFEREE, ACCT[REFERRER]);
      expect(r.ok).toBe(true);
      expect(r.referral_id).toBeTruthy();
      const row = await superRow(
        `select referrer_user_id, referrer_account_number, status from public.referrals where referee_user_id = $1`,
        [REFEREE],
      );
      expect(row.referrer_user_id).toBe(REFERRER);
      expect(row.referrer_account_number).toBe(ACCT[REFERRER]);
      expect(row.status).toBe('pending');
    });

    it('resolves a pasted-lowercase account number (upper-normalization)', async () => {
      const r = await intent(REFEREE, ACCT[REFERRER].toLowerCase());
      expect(r.ok).toBe(true);
    });

    it('rejects self-referral', async () => {
      const r = await intent(REFERRER, ACCT[REFERRER]);
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('self_referral');
    });

    it('rejects an unknown account number', async () => {
      const r = await intent(REFEREE, 'SF-ZZZZZZZ');
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('unknown_account_number');
    });

    it('a BANNED referrer reads exactly like an unknown number (no moderation-state probe)', async () => {
      const r = await intent(REFEREE, ACCT[BANNED]);
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('unknown_account_number'); // NOT a distinguishable 'referrer_inactive'
    });

    it('a banned CALLER cannot record an intent (057 status discipline)', async () => {
      const r = await intent(BANNED, ACCT[REFERRER]);
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('account_inactive');
    });

    it('rejects a second intent from the same referee (and exactly one row exists)', async () => {
      expect((await intent(REFEREE, ACCT[REFERRER])).ok).toBe(true);
      // Even toward a DIFFERENT referrer — one referral per referee, ever.
      const dup = await intent(REFEREE, ACCT[MALLORY]);
      expect(dup.ok).toBe(false);
      expect(dup.reason).toBe('already_referred');
      const { n } = await superRow(`select count(*)::int as n from public.referrals where referee_user_id = $1`, [REFEREE]);
      expect(Number(n)).toBe(1);
    });

    it('unauthenticated caller raises (no anonymous intents)', async () => {
      await expect(
        asAuthed('', `select public.record_referral_intent('${ACCT[REFERRER]}')`),
      ).rejects.toThrow(/not authenticated/);
    });

    it('enforces the 50-open-referral per-referrer cap (pending+granted count; clawed_back frees the seat)', async () => {
      // 50 open referrals for REFERRER via synthetic referees.
      await db.exec(`reset role;`);
      await db.query(
        `with newu as (
           insert into auth.users (id) select gen_random_uuid() from generate_series(1, 50) returning id
         )
         insert into public.referrals (referrer_user_id, referee_user_id, referrer_account_number, status)
         select $1, id, $2, case when random() < 0.5 then 'pending' else 'granted' end from newu`,
        [REFERRER, ACCT[REFERRER]],
      );
      const r = await intent(REFEREE, ACCT[REFERRER]);
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('referrer_cap_reached');

      // Claw back 5 of them — the cap counts OPEN-OR-REWARDED rows only, so the
      // seat frees up and the same intent now lands.
      await db.query(
        `update public.referrals set status = 'clawed_back'
         where id in (select id from public.referrals where referrer_user_id = $1 limit 5)`,
        [REFERRER],
      );
      const after = await intent(REFEREE, ACCT[REFERRER]);
      expect(after.ok).toBe(true);
    });

    it('the cap check is serialized by a transaction-scoped advisory lock (source pin)', () => {
      // Single-connection pglite cannot exercise the two-referees-read-49 race;
      // pin the lock so a refactor cannot silently drop the serialization
      // (the aiSpendReservation pattern).
      expect(SRC).toMatch(/pg_advisory_xact_lock\s*\(\s*hashtext\s*\(\s*'referral_cap:'/);
    });
  });

  // ── grant_referral ──────────────────────────────────────────────────────────
  describe('grant_referral — claim-once grant with the zero-dollar gate', () => {
    beforeEach(async () => {
      expect((await intent(REFEREE, ACCT[REFERRER])).ok).toBe(true);
    });

    it('claims pending → granted exactly once; the duplicate delivery finds no row', async () => {
      const first = await grant(REFEREE, 'in_paid_001', 999);
      expect(first.ok).toBe(true);
      expect(first.referrer_user_id).toBe(REFERRER);
      expect(first.referral_id).toBeTruthy();
      expect(await referralStatus(REFEREE)).toBe('granted');
      const row = await superRow(`select stripe_invoice_id, granted_at from public.referrals where referee_user_id = $1`, [REFEREE]);
      expect(row.stripe_invoice_id).toBe('in_paid_001');
      expect(row.granted_at).toBeTruthy();

      // At-least-once redelivery: the claim is gone, nothing re-grants.
      const second = await grant(REFEREE, 'in_paid_001', 999);
      expect(second.ok).toBe(false);
      expect(second.reason).toBe('no_pending_referral');
    });

    it('REJECTS amount_paid <= 0 (the zero-dollar red-team gate) and leaves the row pending', async () => {
      for (const cents of [0, -500, null]) {
        const r = await grant(REFEREE, 'in_free_001', cents);
        expect(r.ok).toBe(false);
        expect(r.reason).toBe('non_positive_amount');
      }
      expect(await referralStatus(REFEREE)).toBe('pending'); // unclaimed — a later REAL payment can still grant
    });

    it('requires an invoice id (the clawback key) and a referee', async () => {
      expect((await grant(REFEREE, '', 999)).reason).toBe('invoice_id_required');
      expect((await grant(REFEREE, null, 999)).reason).toBe('invoice_id_required');
      expect((await grant(null, 'in_x', 999)).reason).toBe('referee_required');
      expect(await referralStatus(REFEREE)).toBe('pending');
    });

    it('a referee with no pending referral is a no-op', async () => {
      const r = await grant(MALLORY, 'in_paid_002', 999);
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('no_pending_referral');
    });

    it('one invoice can never reward two referrals (partial unique index backstop)', async () => {
      expect((await grant(REFEREE, 'in_shared', 999)).ok).toBe(true);
      // A second referral (MALLORY as referee) tries to claim the SAME invoice.
      expect((await intent(MALLORY, ACCT[REFERRER])).ok).toBe(true);
      const replay = await grant(MALLORY, 'in_shared', 999);
      expect(replay.ok).toBe(false);
      expect(replay.reason).toBe('invoice_already_used');
      expect(await referralStatus(MALLORY)).toBe('pending'); // the raise rolled the claim back
    });

    it('the claim is ONE guarded UPDATE (source pin: race-safe under true concurrency)', () => {
      // The row lock + re-evaluated WHERE of a single UPDATE ... status='pending'
      // ... RETURNING is what starves the concurrent duplicate; pin its shape.
      const body = SRC.match(/create or replace function public\.grant_referral[\s\S]*?\$\$;/i)?.[0] ?? '';
      expect(body).toMatch(/update public\.referrals[\s\S]*?where referee_user_id = p_referee[\s\S]*?and status = 'pending'[\s\S]*?returning/i);
    });
  });

  // ── record_referral_grant_detail + clawback_referral ───────────────────────
  describe('clawback_referral — refund reversal, granted rows only', () => {
    beforeEach(async () => {
      expect((await intent(REFEREE, ACCT[REFERRER])).ok).toBe(true);
    });

    it('a PENDING referral cannot be clawed back (nothing was rewarded)', async () => {
      const r = await clawback('in_never_granted');
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('no_granted_referral');
      expect(await referralStatus(REFEREE)).toBe('pending');
    });

    it('flips granted → clawed_back once, returning the per-party rewards + coupons; idempotent after', async () => {
      const g = await grant(REFEREE, 'in_paid_003', 1499);
      expect(g.ok).toBe(true);
      expect((await detail(g.referral_id, 'referrer', 'free_month', 'coup_ref_month')).ok).toBe(true);
      expect((await detail(g.referral_id, 'referee', 'free_month', 'coup_new_month')).ok).toBe(true);

      const c = await clawback('in_paid_003');
      expect(c.ok).toBe(true);
      expect(c.referral_id).toBe(g.referral_id);
      expect(c.referrer_user_id).toBe(REFERRER);
      expect(c.referee_user_id).toBe(REFEREE);
      // The webhook reverses EXACTLY these.
      expect(c.referrer_reward).toBe('free_month');
      expect(c.referee_reward).toBe('free_month');
      expect(c.referrer_coupon_applied).toBe('coup_ref_month');
      expect(c.referee_coupon_applied).toBe('coup_new_month');
      expect(await referralStatus(REFEREE)).toBe('clawed_back');
      expect((await superRow(`select clawed_back_at from public.referrals where referee_user_id = $1`, [REFEREE])).clawed_back_at).toBeTruthy();

      // Redelivered refund event: no granted row remains — no-op.
      const again = await clawback('in_paid_003');
      expect(again.ok).toBe(false);
      expect(again.reason).toBe('no_granted_referral');
      expect(await referralStatus(REFEREE)).toBe('clawed_back'); // unchanged
    });

    it('record_referral_grant_detail rejects an invalid party (programmer error → raise)', async () => {
      const g = await grant(REFEREE, 'in_paid_004', 999);
      await expect(
        asService(`select public.record_referral_grant_detail('${g.referral_id}', 'attacker', 'x', 'y')`),
      ).rejects.toThrow(/p_party/);
    });

    it('record_referral_grant_detail on a missing referral returns not_found', async () => {
      const r = await detail('99999999-9999-4999-8999-999999999999', 'referrer', 'x', 'y');
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('not_found');
    });
  });

  // ── validate_redeem_code ────────────────────────────────────────────────────
  describe('validate_redeem_code — collapsed UX echo, enumeration-hardened', () => {
    it('SENTINEL: an active, unexpired, unused code validates with its kind', async () => {
      await seedCode({ code: 'GOODCODE' });
      const r = await validate(REFEREE, 'GOODCODE');
      expect(r.valid).toBe(true);
      expect(r.kind).toBe('free_month');
      expect(r.reason).toBeNull();
    });

    it('NEVER returns the coupon id or amounts (whole payload scanned)', async () => {
      await seedCode({ code: 'GOODCODE', stripe_coupon_id: 'coup_secret_month' });
      const r = await validate(REFEREE, 'GOODCODE');
      const payload = JSON.stringify(r);
      expect(payload).not.toContain('coup_secret_month');
      expect(payload).not.toContain('stripe_coupon_id');
      expect(payload).not.toContain('credit_amount');
    });

    it('unknown / deactivated / expired / exhausted ALL collapse into invalid_code', async () => {
      await seedCode({ code: 'INACTIVE', active: false });
      await seedCode({ code: 'EXPIRED', expires_at: new Date(Date.now() - 60_000).toISOString() });
      await seedCode({ code: 'EXHAUSTED', max_uses: 1, uses_count: 1 });
      for (const code of ['NO_SUCH_CODE', 'INACTIVE', 'EXPIRED', 'EXHAUSTED']) {
        const r = await validate(REFEREE, code);
        expect(r.valid, code).toBe(false);
        expect(r.reason, code).toBe('invalid_code'); // one indistinguishable reason
        expect(r.kind, code).toBeNull();
      }
    });

    it("a code the caller already used (even reverted) reads 'already_used'", async () => {
      await seedCode({ code: 'ONCECODE' });
      const res = await reserve('ONCECODE', REFEREE);
      expect(res.ok).toBe(true);
      expect((await validate(REFEREE, 'ONCECODE')).reason).toBe('already_used');
      // After a revert the unique row remains — once per user, ever.
      expect((await bind(res.redemption_id, 'cs_v1')).ok).toBe(true);
      expect((await revert('cs_v1')).ok).toBe(true);
      expect((await validate(REFEREE, 'ONCECODE')).reason).toBe('already_used');
      // A DIFFERENT user still validates true (the seat was handed back).
      expect((await validate(MALLORY, 'ONCECODE')).valid).toBe(true);
    });

    it('unauthenticated caller raises', async () => {
      await seedCode({ code: 'GOODCODE' });
      await expect(asAuthed('', `select public.validate_redeem_code('GOODCODE')`)).rejects.toThrow(/not authenticated/);
    });
  });

  // ── reserve / bind / apply / revert ─────────────────────────────────────────
  describe('reserve_redemption → bind → apply — the checkout seat lifecycle', () => {
    it('SENTINEL: a reserve returns the server-only coupon/kind/amount and holds the seat', async () => {
      await seedCode({ code: 'CREDITS5', kind: 'credits', stripe_coupon_id: null, credit_amount: 5, max_uses: 10 });
      const r = await reserve('CREDITS5', REFEREE);
      expect(r.ok).toBe(true);
      expect(r.kind).toBe('credits');
      expect(r.credit_amount).toBe(5);
      expect(r.stripe_coupon_id).toBeNull();
      expect(r.applies_to).toBe('any');
      expect(r.redemption_id).toBeTruthy();
      expect(await usesCount('CREDITS5')).toBe(1);
      const row = await superRow(`select status, stripe_session_id from public.redemptions where id = $1`, [r.redemption_id]);
      expect(row.status).toBe('reserved');
      expect(row.stripe_session_id).toBeNull(); // stamped later by bind
    });

    it('max_uses is respected: two reserves on a one-seat code → exactly one wins', async () => {
      await seedCode({ code: 'ONESEAT', max_uses: 1 });
      const first = await reserve('ONESEAT', REFEREE);
      expect(first.ok).toBe(true);
      const second = await reserve('ONESEAT', MALLORY);
      expect(second.ok).toBe(false);
      expect(second.reason).toBe('invalid_code'); // collapsed — exhausted is not distinguishable
      expect(await usesCount('ONESEAT')).toBe(1); // the loser held nothing
    });

    it('the seat claim is ONE guarded UPDATE (source pin: uses_count < max_uses in the same statement)', () => {
      // Under true concurrency the code row lock + re-evaluated WHERE is what
      // makes the last seat single-winner; pin that the increment and the
      // max_uses guard live in the SAME statement.
      const body = SRC.match(/create or replace function public\.reserve_redemption[\s\S]*?\$\$;/i)?.[0] ?? '';
      expect(body).toMatch(/update public\.redeem_codes[\s\S]*?set uses_count = uses_count \+ 1[\s\S]*?and uses_count < max_uses[\s\S]*?returning/i);
    });

    it('the once-per-user conflict hands the incremented seat straight back', async () => {
      await seedCode({ code: 'MULTI', max_uses: 10 });
      expect((await reserve('MULTI', REFEREE)).ok).toBe(true);
      expect(await usesCount('MULTI')).toBe(1);
      const dup = await reserve('MULTI', REFEREE);
      expect(dup.ok).toBe(false);
      expect(dup.reason).toBe('already_used');
      expect(await usesCount('MULTI')).toBe(1); // NOT 2 — the increment rolled back
    });

    it('inactive and expired codes cannot be reserved', async () => {
      await seedCode({ code: 'INACTIVE', active: false });
      await seedCode({ code: 'EXPIRED', expires_at: new Date(Date.now() - 60_000).toISOString() });
      expect((await reserve('INACTIVE', REFEREE)).reason).toBe('invalid_code');
      expect((await reserve('EXPIRED', REFEREE)).reason).toBe('invalid_code');
      expect(await usesCount('INACTIVE')).toBe(0);
      expect(await usesCount('EXPIRED')).toBe(0);
    });

    it('bind stamps the session write-once (same-id retry ok; different session refused)', async () => {
      await seedCode({ code: 'BINDME' });
      const r = await reserve('BINDME', REFEREE);
      expect((await bind(r.redemption_id, 'cs_live_1')).ok).toBe(true);
      // Idempotent retry with the SAME session id succeeds.
      expect((await bind(r.redemption_id, 'cs_live_1')).ok).toBe(true);
      // A DIFFERENT session can never hijack the seat.
      const hijack = await bind(r.redemption_id, 'cs_live_2');
      expect(hijack.ok).toBe(false);
      expect(hijack.reason).toBe('not_found');
      expect((await superRow(`select stripe_session_id from public.redemptions where id = $1`, [r.redemption_id])).stripe_session_id).toBe('cs_live_1');
    });

    it('apply flips reserved → applied once, returning kind + credit_amount for the webhook grant', async () => {
      await seedCode({ code: 'CREDITS7', kind: 'credits', stripe_coupon_id: null, credit_amount: 7 });
      const r = await reserve('CREDITS7', REFEREE);
      expect((await bind(r.redemption_id, 'cs_paid_1')).ok).toBe(true);

      const a = await apply('cs_paid_1');
      expect(a.ok).toBe(true);
      expect(a.redemption_id).toBe(r.redemption_id);
      expect(a.user_id).toBe(REFEREE);
      expect(a.code).toBe('CREDITS7');
      expect(a.kind).toBe('credits');
      expect(a.credit_amount).toBe(7); // the webhook grants this via system_grant_credits
      const row = await superRow(`select status, applied_at from public.redemptions where id = $1`, [r.redemption_id]);
      expect(row.status).toBe('applied');
      expect(row.applied_at).toBeTruthy();

      // Redelivered completion event: claim gone, no-op.
      const again = await apply('cs_paid_1');
      expect(again.ok).toBe(false);
      expect(again.reason).toBe('no_reserved_redemption');
    });

    it('revert decrements the seat and is idempotent (no double hand-back)', async () => {
      await seedCode({ code: 'EXPIRES', max_uses: 5 });
      const r = await reserve('EXPIRES', REFEREE);
      expect((await bind(r.redemption_id, 'cs_gone_1')).ok).toBe(true);
      expect(await usesCount('EXPIRES')).toBe(1);

      const first = await revert('cs_gone_1');
      expect(first.ok).toBe(true);
      expect(await usesCount('EXPIRES')).toBe(0);
      expect((await superRow(`select status from public.redemptions where id = $1`, [r.redemption_id])).status).toBe('reverted');

      // Redelivered expiry event: no reserved row — nothing re-decrements.
      const second = await revert('cs_gone_1');
      expect(second.ok).toBe(false);
      expect(second.reason).toBe('no_reserved_redemption');
      expect(await usesCount('EXPIRES')).toBe(0); // NOT -1, and no constraint blowup
    });

    it('an APPLIED redemption can never be reverted (expiry racing completion loses)', async () => {
      await seedCode({ code: 'RACEME' });
      const r = await reserve('RACEME', REFEREE);
      expect((await bind(r.redemption_id, 'cs_race_1')).ok).toBe(true);
      expect((await apply('cs_race_1')).ok).toBe(true);
      const rv = await revert('cs_race_1');
      expect(rv.ok).toBe(false);
      expect((await superRow(`select status from public.redemptions where id = $1`, [r.redemption_id])).status).toBe('applied');
      expect(await usesCount('RACEME')).toBe(1); // the consumed seat stays consumed
    });

    it('a reverted user cannot re-reserve the code (once per user, EVER) and holds no phantom seat', async () => {
      await seedCode({ code: 'ONCEEVER', max_uses: 5 });
      const r = await reserve('ONCEEVER', REFEREE);
      expect((await bind(r.redemption_id, 'cs_once_1')).ok).toBe(true);
      expect((await revert('cs_once_1')).ok).toBe(true);
      expect(await usesCount('ONCEEVER')).toBe(0);

      const again = await reserve('ONCEEVER', REFEREE);
      expect(again.ok).toBe(false);
      expect(again.reason).toBe('already_used');
      expect(await usesCount('ONCEEVER')).toBe(0); // increment rolled back — no leaked seat
    });
  });

  // ── service-role posture ────────────────────────────────────────────────────
  describe('service-role posture — in-body assertion + grant discipline', () => {
    it('every value-moving RPC refuses a non-service caller in the BODY (belt and braces with the grants)', async () => {
      const calls = [
        `select public.grant_referral('${REFEREE}', 'in_x', 999)`,
        `select public.record_referral_grant_detail('99999999-9999-4999-8999-999999999999', 'referrer', 'x', 'y')`,
        `select public.clawback_referral('in_x')`,
        `select public.reserve_redemption('CODE', '${REFEREE}')`,
        `select public.bind_redemption_session('99999999-9999-4999-8999-999999999999', 'cs_x')`,
        `select public.apply_redemption('cs_x')`,
        `select public.revert_redemption('cs_x')`,
      ];
      for (const sql of calls) {
        await expect(asAuthed(REFEREE, sql), sql).rejects.toThrow(/service-role only/);
      }
    });

    it('grant posture: every service fn is REVOKEd from public and GRANTed to service_role only; client fns to authenticated', () => {
      const serviceFns = [
        'grant_referral(uuid, text, integer)',
        'record_referral_grant_detail(uuid, text, text, text)',
        'clawback_referral(text)',
        'reserve_redemption(text, uuid)',
        'bind_redemption_session(uuid, text)',
        'apply_redemption(text)',
        'revert_redemption(text)',
      ];
      for (const sig of serviceFns) {
        const esc = sig.replace(/[()]/g, (c) => `\\${c}`);
        expect(SRC).toMatch(new RegExp(`revoke all on function public\\.${esc} from public`, 'i'));
        expect(SRC).toMatch(new RegExp(`grant execute on function public\\.${esc} to service_role`, 'i'));
      }
      for (const sig of ['record_referral_intent(text)', 'validate_redeem_code(text)']) {
        const esc = sig.replace(/[()]/g, (c) => `\\${c}`);
        expect(SRC).toMatch(new RegExp(`revoke all on function public\\.${esc} from public`, 'i'));
        expect(SRC).toMatch(new RegExp(`grant execute on function public\\.${esc} to authenticated`, 'i'));
      }
    });
  });

  // ── RLS ─────────────────────────────────────────────────────────────────────
  describe('RLS — owner-scoped reads, zero client writes', () => {
    it('RLS is enabled on all four tables', async () => {
      for (const t of ['processed_webhook_events', 'redeem_codes', 'redemptions', 'referrals']) {
        const { relrowsecurity } = await superRow(`select relrowsecurity from pg_class where oid = 'public.${t}'::regclass`);
        expect(relrowsecurity, t).toBe(true);
      }
    });

    it('redemptions: a user reads own rows only (cross-user SELECT denied by policy)', async () => {
      await seedCode({ code: 'MINE', max_uses: 5 });
      expect((await reserve('MINE', REFEREE)).ok).toBe(true);
      const own = await asClientTable(REFEREE, `select code from public.redemptions`);
      expect(own.rows).toHaveLength(1);
      const foreign = await asClientTable(MALLORY, `select code from public.redemptions`);
      expect(foreign.rows).toHaveLength(0);
    });

    it('referrals: both parties can read the row; a third party cannot', async () => {
      expect((await intent(REFEREE, ACCT[REFERRER])).ok).toBe(true);
      expect((await asClientTable(REFEREE, `select status from public.referrals`)).rows).toHaveLength(1);
      expect((await asClientTable(REFERRER, `select status from public.referrals`)).rows).toHaveLength(1);
      expect((await asClientTable(MALLORY, `select status from public.referrals`)).rows).toHaveLength(0);
    });

    it('redeem_codes is NOT enumerable: authenticated SELECT returns zero rows', async () => {
      await seedCode({ code: 'SECRET99' });
      const r = await asClientTable(REFEREE, `select code from public.redeem_codes`);
      expect(r.rows).toHaveLength(0); // RLS-on, no SELECT policy
    });

    it('processed_webhook_events is invisible to clients', async () => {
      await db.query(`insert into public.processed_webhook_events (event_id, event_type) values ('evt_1', 'invoice.paid')`);
      const r = await asClientTable(REFEREE, `select event_id from public.processed_webhook_events`);
      expect(r.rows).toHaveLength(0);
    });

    it('client INSERTs are denied on every table (no write policy exists)', async () => {
      const inserts = [
        `insert into public.redemptions (code, user_id) values ('X', '${REFEREE}')`,
        `insert into public.referrals (referrer_user_id, referee_user_id, referrer_account_number) values ('${REFERRER}', '${REFEREE}', 'SF-AAA2345')`,
        `insert into public.redeem_codes (code, kind, stripe_coupon_id) values ('FORGED', 'free_month', 'coup_forged')`,
        `insert into public.processed_webhook_events (event_id) values ('evt_forged')`,
      ];
      for (const sql of inserts) {
        await expect(asClientTable(REFEREE, sql), sql).rejects.toThrow(/row-level security|permission denied/);
      }
    });

    it('client UPDATE/DELETE silently touch zero rows (no policy → no visible target rows)', async () => {
      await seedCode({ code: 'MINE', max_uses: 5 });
      const r = await reserve('MINE', REFEREE);
      expect((await intent(REFEREE, ACCT[REFERRER])).ok).toBe(true);

      // A user trying to self-serve an 'applied' status, uncap a code, or erase
      // their referral: with no UPDATE/DELETE policies the rows are not visible
      // targets, so zero rows are affected and nothing changes.
      await asClientTable(REFEREE, `update public.redemptions set status = 'applied'`);
      expect((await superRow(`select status from public.redemptions where id = $1`, [r.redemption_id])).status).toBe('reserved');

      await asClientTable(REFEREE, `update public.redeem_codes set max_uses = 100000 where code = 'MINE'`);
      expect(Number((await superRow(`select max_uses from public.redeem_codes where code = 'MINE'`)).max_uses)).toBe(5);

      await asClientTable(REFEREE, `delete from public.referrals`);
      expect(await referralStatus(REFEREE)).toBe('pending');

      await asClientTable(REFEREE, `delete from public.redemptions`);
      expect((await superRow(`select count(*)::int as n from public.redemptions`)).n).toBe(1);
    });
  });
});
