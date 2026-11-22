/**
 * dossierEntitlements.pglite.test.js — EXECUTION tests for durable single-dossier
 * export rights + the same-device token-claim ledger (migration 108) against
 * in-process Postgres (pglite).
 *
 * PRODUCT MODEL (user-locked): the retro upgrade is SAME-DEVICE + SAME-SETTLEMENT
 * + AUTOMATIC only. The token held in the original device's purchase stash is the
 * SOLE proof-of-purchase — there is NO email-match claim, NO cross-device path,
 * NO list of claimable vouchers. buyer_email_lower is audit/support-only.
 *
 * WHAT THIS PROVES (each load-bearing — a revert turns it RED)
 *   1. grant_dossier_entitlement mints the durable right, is idempotent on the
 *      session id (a webhook redelivery reports already_existed, mints nothing),
 *      enforces UNIQUE(user,save) (a second session for a held save →
 *      already_entitled), and rejects a foreign/unknown save (save_not_found).
 *   2. clawback_dossier_entitlement is claim-once (active → clawed_back exactly
 *      once) AND unconditionally poisons the purchase voucher to 'refunded' — even
 *      when no entitlement existed (the anonymous-refund case), returning
 *      {ok:true, entitlement_id:null}.
 *   3. ON DELETE CASCADE: deleting the saved settlement forfeits the entitlement
 *      (the "deletion forfeits the right" rule as a foreign-key fact).
 *   4. claim_dossier_purchase_by_session (the token path) happy path (unclaimed →
 *      claimed + durable right, service-role only), rejects a foreign save and a
 *      refunded voucher, and is claim-once (a second claim — the "two concurrent →
 *      one" outcome — reads already_claimed and mints no second right).
 *   5. RLS: a user reads only their own entitlements; single_dossier_purchases is
 *      invisible to clients; every client write is denied (no write policies).
 *   6. Every value-moving service RPC carries the in-body service-role assertion.
 *   7. NO email-claim residue: the stripped RPCs (list_my_unclaimed_dossier_
 *      purchases, claim_dossier_purchase_by_email) are absent from the migration.
 *
 * REALISM
 *   The ENTIRE 108 file is applied verbatim (tables + indexes + RLS + grants +
 *   RPC bodies), so a migration edit is what these tests exercise. auth.uid()/
 *   auth.role() are GUC-backed shims (the referralRedeem pattern); auth.users is
 *   the FK target for user_id/claimed_by, and public.settlements is the real saves
 *   table (the FK target for the forfeit rule). pglite is
 *   single-connection, so races are proven the aiSpendReservation way: sequential
 *   calls demonstrate the guard, and a source-inspection pin asserts the
 *   single-statement guarded UPDATE that makes claim-once race-safe cannot be
 *   silently refactored away.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)

const MIG = resolve(process.cwd(), 'supabase', 'migrations', '108_dossier_entitlements.sql');
const have = existsSync(MIG);
const SRC = have ? readFileSync(MIG, 'utf-8') : '';

// 109 recreates claim_dossier_purchase_by_session to PRESERVE the voucher when it can
// mint nothing (an already-entitled save). Applied on top of 108 below so this suite
// exercises the net-current RPC body.
const MIG109 = resolve(process.cwd(), 'supabase', 'migrations', '109_dossier_voucher_preserve_on_already_entitled.sql');
const have109 = existsSync(MIG109);
const SRC109 = have109 ? readFileSync(MIG109, 'utf-8') : '';

// Vacuity guard (runs unconditionally): if the targeted migration is ever
// renamed/removed the runIf suite below silently runs ZERO assertions while
// reporting green. Fail loudly here instead.
it('migration 108 present (suite not vacuous)', () => {
  expect(have).toBe(true);
});

const BUYER = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

const EMAIL = {
  [BUYER]: 'buyer@example.com',
  [OTHER]: 'other@example.com',
};

let db;

/** Run one query as the service-role caller (webhook / account-actions). */
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

// ── RPC helpers ───────────────────────────────────────────────────────────────
const grant = async (user, saveId, session, source = 'purchase') =>
  (await asService('select public.grant_dossier_entitlement($1, $2, $3, $4) as r', [user, saveId, session, source])).rows[0].r;
const clawback = async (session) =>
  (await asService('select public.clawback_dossier_entitlement($1) as r', [session])).rows[0].r;
const hasEnt = async (uid, saveId) =>
  (await asAuthed(uid, 'select public.has_dossier_entitlement($1) as r', [saveId])).rows[0].r;
const claimBySession = async (session, user, saveId) =>
  (await asService('select public.claim_dossier_purchase_by_session($1, $2, $3) as r', [session, user, saveId])).rows[0].r;

const entitlementStatus = async (session) =>
  (await superRow('select status from public.dossier_entitlements where stripe_session_id = $1', [session]))?.status;
const purchaseStatus = async (session) =>
  (await superRow('select status from public.single_dossier_purchases where stripe_session_id = $1', [session]))?.status;

/** Seed a saved settlement owned by `owner`, return its id. */
const seedSave = async (owner, name = 'Saved Town') =>
  (await superRow(
    `insert into public.settlements (user_id, name, tier, data) values ($1, $2, 'town', '{}'::jsonb) returning id`,
    [owner, name],
  )).id;

/** Seed a webhook-written purchase voucher for `buyerUid`'s email. */
const seedPurchase = async (buyerUid, session, over = {}) => {
  const p = { checkout_token_hash: null, amount_cents: 299, status: 'unclaimed', ...over };
  await superRow(
    `insert into public.single_dossier_purchases
       (stripe_session_id, buyer_email_lower, checkout_token_hash, amount_cents, status)
     values ($1, lower($2), $3, $4, $5) returning stripe_session_id`,
    [session, EMAIL[buyerUid], p.checkout_token_hash, p.amount_cents, p.status],
  );
};

describe.runIf(have)('108 dossier entitlements — real SQL (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    // Scaffold: the Supabase-managed objects 108 references — auth schema +
    // GUC-backed uid()/role() shims, auth.users (the FK target for user_id +
    // claimed_by), the platform roles, and the REAL saves table public.settlements
    // (the FK target for the ON DELETE CASCADE forfeit rule).
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      create or replace function auth.role() returns text language sql stable as $fn$
        select coalesce(nullif(current_setting('test.role', true), ''), 'anon')
      $fn$;
      create table if not exists auth.users (
        id uuid primary key,
        email text,
        email_confirmed_at timestamptz
      );
      do $do$ begin
        if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
        if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
        if not exists (select from pg_roles where rolname = 'nosuperuser') then create role nosuperuser nologin; end if;
      end $do$;

      -- The saves table (001 shape, trimmed to what the FK + ownership checks need).
      create table if not exists public.settlements (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references auth.users(id) on delete cascade,
        name text not null,
        tier text not null,
        data jsonb not null,
        created_at timestamptz not null default now()
      );
    `);

    // The REAL migration, whole file, verbatim — tables, indexes, RLS, policies,
    // grants, and all six RPC bodies.
    await db.exec(SRC);
    // 109 recreates claim_dossier_purchase_by_session (voucher preservation). Apply it
    // so the RPC under test is the net-current definition.
    if (SRC109) await db.exec(SRC109);

    // Table privileges for the client role: PostgREST's authenticated role has
    // table grants in prod — RLS (not the grant layer) must be what denies.
    await db.exec(`
      grant usage on schema public to nosuperuser;
      grant select, insert, update, delete on
        public.dossier_entitlements, public.single_dossier_purchases, public.settlements
        to nosuperuser;
    `);
  }, PGLITE_BOOT_TIMEOUT_MS);

  beforeEach(async () => {
    await db.exec(`
      reset role; set request.jwt.claim.role = ''; set test.uid = '';
      truncate public.dossier_entitlements, public.single_dossier_purchases cascade;
      truncate public.settlements cascade;
      truncate auth.users cascade;
    `);
    await db.query(
      `insert into auth.users (id, email, email_confirmed_at) values
         ($1, $2, now()), ($3, $4, now())`,
      [BUYER, EMAIL[BUYER], OTHER, EMAIL[OTHER]],
    );
  });

  // ── grant_dossier_entitlement ───────────────────────────────────────────────
  describe('grant_dossier_entitlement — webhook-only durable grant, idempotent', () => {
    it('SENTINEL: a clean grant mints an active durable right on the owner\'s saved settlement', async () => {
      const save = await seedSave(BUYER);
      const r = await grant(BUYER, save, 'cs_paid_1');
      expect(r.ok).toBe(true);
      expect(r.already_existed).toBe(false);
      expect(r.entitlement_id).toBeTruthy();
      const row = await superRow(
        `select user_id, save_id, status, source from public.dossier_entitlements where stripe_session_id = $1`,
        ['cs_paid_1'],
      );
      expect(row.user_id).toBe(BUYER);
      expect(row.save_id).toBe(save);
      expect(row.status).toBe('active');
      expect(row.source).toBe('purchase');
      expect(await hasEnt(BUYER, save)).toBe(true);
    });

    it('is idempotent on the session id: a redelivery reports already_existed and mints nothing', async () => {
      const save = await seedSave(BUYER);
      const first = await grant(BUYER, save, 'cs_dup');
      expect(first.ok).toBe(true);
      const second = await grant(BUYER, save, 'cs_dup');
      expect(second.ok).toBe(true);
      expect(second.already_existed).toBe(true);
      expect(second.entitlement_id).toBe(first.entitlement_id);
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(1);
    });

    it('a (user,save) collision with a DIFFERENT session returns already_entitled', async () => {
      const save = await seedSave(BUYER);
      expect((await grant(BUYER, save, 'cs_a')).ok).toBe(true);
      const dup = await grant(BUYER, save, 'cs_b'); // same save, new session
      expect(dup.ok).toBe(false);
      expect(dup.reason).toBe('already_entitled');
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(1);
    });

    it('rejects a foreign save (belongs to another user) and an unknown save', async () => {
      const foreign = await seedSave(OTHER);
      const r = await grant(BUYER, foreign, 'cs_foreign');
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('save_not_found');

      const unknown = await grant(BUYER, '99999999-9999-4999-8999-999999999999', 'cs_unknown');
      expect(unknown.ok).toBe(false);
      expect(unknown.reason).toBe('save_not_found');
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(0);
    });

    it('requires a session id and a user', async () => {
      const save = await seedSave(BUYER);
      expect((await grant(BUYER, save, '')).reason).toBe('session_id_required');
      expect((await grant(BUYER, save, null)).reason).toBe('session_id_required');
      expect((await grant(null, save, 'cs_x')).reason).toBe('user_required');
    });
  });

  // ── clawback_dossier_entitlement ────────────────────────────────────────────
  describe('clawback_dossier_entitlement — refund reversal + voucher poison', () => {
    it('flips active → clawed_back once and poisons the purchase; idempotent after', async () => {
      const save = await seedSave(BUYER);
      await seedPurchase(BUYER, 'cs_refund'); // the anonymous voucher for this session
      expect((await grant(BUYER, save, 'cs_refund')).ok).toBe(true);

      const c = await clawback('cs_refund');
      expect(c.ok).toBe(true);
      expect(c.entitlement_id).toBeTruthy();
      expect(c.user_id).toBe(BUYER);
      expect(await entitlementStatus('cs_refund')).toBe('clawed_back');
      expect(await purchaseStatus('cs_refund')).toBe('refunded'); // voucher poisoned
      expect((await superRow(`select clawed_back_at from public.dossier_entitlements where stripe_session_id = $1`, ['cs_refund'])).clawed_back_at).toBeTruthy();
      expect(await hasEnt(BUYER, save)).toBe(false); // a clawed-back right reads false

      // Redelivered refund event: no active row remains — no-op.
      const again = await clawback('cs_refund');
      expect(again.ok).toBe(true);
      expect(again.entitlement_id).toBeNull();
      expect(await entitlementStatus('cs_refund')).toBe('clawed_back'); // unchanged
    });

    it('the ANONYMOUS-refund case: no entitlement exists, but the voucher is still poisoned to refunded', async () => {
      await seedPurchase(BUYER, 'cs_anon_refund'); // buyer never signed up → no entitlement
      const c = await clawback('cs_anon_refund');
      expect(c.ok).toBe(true);
      expect(c.entitlement_id).toBeNull();
      expect(await purchaseStatus('cs_anon_refund')).toBe('refunded');
    });

    it('the claim is ONE guarded UPDATE (source pin: race-safe active → clawed_back)', () => {
      const body = SRC.match(/^create or replace function public\.clawback_dossier_entitlement[\s\S]*?\$\$;/im)?.[0] ?? '';
      expect(body).toMatch(/update public\.dossier_entitlements[\s\S]*?set status = 'clawed_back'[\s\S]*?where stripe_session_id = btrim\(p_session_id\)[\s\S]*?and status = 'active'[\s\S]*?returning/i);
    });
  });

  // ── ON DELETE CASCADE (the forfeit rule) ─────────────────────────────────────
  describe('ON DELETE CASCADE — deleting the saved settlement forfeits the right', () => {
    it('removing the settlement removes the entitlement (foreign-key forfeit)', async () => {
      const save = await seedSave(BUYER);
      expect((await grant(BUYER, save, 'cs_forfeit')).ok).toBe(true);
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(1);

      await superRow(`delete from public.settlements where id = $1`, [save]);
      // The right is gone — "as long as the settlement is in the account" is a
      // foreign-key fact, not application logic.
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(0);
      expect(await hasEnt(BUYER, save)).toBe(false);
    });
  });

  // ── claim_dossier_purchase_by_session (the same-device token path) ───────────
  describe('claim_dossier_purchase_by_session — same-device token claim, service-role only', () => {
    it('SENTINEL: the token path atomically claims the voucher and mints the right (source claim)', async () => {
      // account-actions has already verified sha256(checkoutToken) against the
      // stored checkout_token_hash; this RPC does the atomic claim + grant. The
      // buyer's Stripe email is irrelevant here — no email is checked at all.
      await superRow(
        `insert into public.single_dossier_purchases (stripe_session_id, buyer_email_lower, amount_cents)
         values ('cs_token_1', 'stripe-only@example.com', 299)`,
      );
      const save = await seedSave(BUYER);
      const r = await claimBySession('cs_token_1', BUYER, save);
      expect(r.ok).toBe(true);
      expect(r.entitlement_id).toBeTruthy();
      expect(await purchaseStatus('cs_token_1')).toBe('claimed');
      const row = await superRow(`select source, user_id, save_id from public.dossier_entitlements where stripe_session_id = $1`, ['cs_token_1']);
      expect(row.user_id).toBe(BUYER);
      expect(row.save_id).toBe(save);
      expect(row.source).toBe('claim');
      const pur = await superRow(`select claimed_by, claimed_at from public.single_dossier_purchases where stripe_session_id = $1`, ['cs_token_1']);
      expect(pur.claimed_by).toBe(BUYER);
      expect(pur.claimed_at).toBeTruthy();
      expect(await hasEnt(BUYER, save)).toBe(true);
    });

    it('is claim-once (two concurrent → one): a second claim reads already_claimed and mints no second right', async () => {
      await seedPurchase(BUYER, 'cs_twice');
      const save = await seedSave(BUYER);
      const first = await claimBySession('cs_twice', BUYER, save);
      expect(first.ok).toBe(true);
      // A second attempt (even at a different save) finds the voucher claimed —
      // pglite is single-connection, so the sequential second call IS the loser of
      // the concurrent race the guarded UPDATE resolves.
      const other = await seedSave(BUYER, 'Second Town');
      const second = await claimBySession('cs_twice', BUYER, other);
      expect(second.ok).toBe(false);
      expect(second.reason).toBe('already_claimed');
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(1);
    });

    it('rejects a foreign save and a refunded voucher, and an unknown session reads not_found', async () => {
      await seedPurchase(BUYER, 'cs_tf_foreign');
      const foreign = await seedSave(OTHER);
      const fr = await claimBySession('cs_tf_foreign', BUYER, foreign);
      expect(fr.ok).toBe(false);
      expect(fr.reason).toBe('save_not_found');
      expect(await purchaseStatus('cs_tf_foreign')).toBe('unclaimed'); // untouched

      await seedPurchase(BUYER, 'cs_tf_refunded', { status: 'refunded' });
      const save = await seedSave(BUYER);
      expect((await claimBySession('cs_tf_refunded', BUYER, save)).reason).toBe('refunded');

      expect((await claimBySession('cs_nope', BUYER, save)).reason).toBe('not_found');
    });

    it('the purchase claim is ONE guarded UPDATE (source pin: race-safe unclaimed → claimed)', () => {
      const body = SRC.match(/^create or replace function public\.claim_dossier_purchase_by_session[\s\S]*?\$\$;/im)?.[0] ?? '';
      expect(body).toMatch(/update public\.single_dossier_purchases[\s\S]*?set status = 'claimed'[\s\S]*?and status = 'unclaimed'[\s\S]*?returning/i);
    });
  });

  // ── 109: the voucher is PRESERVED when it can mint nothing ───────────────────
  describe.runIf(have109)('claim_dossier_purchase_by_session — voucher preserved on already_entitled (109)', () => {
    it('SENTINEL: an already-entitled save returns already_entitled and does NOT consume the voucher', async () => {
      const save = await seedSave(BUYER);
      // The buyer already holds a durable right on this save (a prior grant/claim).
      await grant(BUYER, save, 'cs_prior');
      expect(await hasEnt(BUYER, save)).toBe(true);
      // A NEW voucher, claimed against the SAME already-entitled save.
      await seedPurchase(BUYER, 'cs_new');
      const r = await claimBySession('cs_new', BUYER, save);
      expect(r.ok).toBe(false);
      expect(r.reason).toBe('already_entitled');
      // The voucher is UNTOUCHED (still unclaimed) — spendable on another settlement,
      // not burned for nothing (the 108 bug this migration fixes).
      expect(await purchaseStatus('cs_new')).toBe('unclaimed');
    });

    it('control: a voucher against a FRESH save still mints the right and is consumed', async () => {
      const save = await seedSave(BUYER);
      await seedPurchase(BUYER, 'cs_fresh');
      const r = await claimBySession('cs_fresh', BUYER, save);
      expect(r.ok).toBe(true);
      expect(await purchaseStatus('cs_fresh')).toBe('claimed');
      expect(await hasEnt(BUYER, save)).toBe(true);
    });

    it('the RPC checks entitlement BEFORE the claiming update (preserve-before-consume)', () => {
      const body = SRC109.match(/^create or replace function public\.claim_dossier_purchase_by_session[\s\S]*?\$\$;/im)?.[0] ?? '';
      const checkIdx = body.search(/from public\.dossier_entitlements\s+where user_id = p_user and save_id = p_save_id/i);
      const claimIdx = body.search(/update public\.single_dossier_purchases[\s\S]*?set status = 'claimed'/i);
      expect(checkIdx).toBeGreaterThan(-1);
      expect(claimIdx).toBeGreaterThan(-1);
      expect(checkIdx).toBeLessThan(claimIdx); // the guard precedes the consume
    });
  });

  // ── no email-claim residue (the stripped cross-device design) ────────────────
  describe('no email-claim residue — the cancelled cross-device design is gone', () => {
    it('the stripped RPCs are absent from the migration', () => {
      // DELIBERATELY UNANCHORED (negative-presence): these exist to catch a
      // future RE-CREATION at ANY indentation, so a `^` anchor would weaken
      // them. Pinned in netCurrentExtractorAnchor.walker FROZEN_UNANCHORED —
      // do not "fix" in an anchoring sweep.
      expect(SRC).not.toMatch(/create or replace function public\.list_my_unclaimed_dossier_purchases/i);
      expect(SRC).not.toMatch(/create or replace function public\.claim_dossier_purchase_by_email/i);
    });

    it('the stripped RPCs do not exist in the DB (calling them errors)', async () => {
      await expect(
        asAuthed(BUYER, 'select public.list_my_unclaimed_dossier_purchases() as r'),
      ).rejects.toThrow(/does not exist|function .* does not exist/i);
      const save = await seedSave(BUYER);
      await expect(
        asAuthed(BUYER, `select public.claim_dossier_purchase_by_email('cs_x', '${save}') as r`),
      ).rejects.toThrow(/does not exist|function .* does not exist/i);
    });

    it('buyer_email_lower is never used as a claim key — no RPC body filters on it', () => {
      // Audit/support-only: the column is written by the webhook but no claim path
      // reads it. A future email-match regression would reintroduce a WHERE on it.
      // DELIBERATELY UNANCHORED (feeds the not.toMatch below): anchoring could
      // only SHRINK the audited corpus and let an indented future body escape
      // the negative check. Pinned in netCurrentExtractorAnchor.walker.
      const rpcBodies = SRC.match(/create or replace function public\.[\s\S]*?\$\$;/gi)?.join('\n') ?? '';
      expect(rpcBodies).not.toMatch(/where[\s\S]{0,80}buyer_email_lower/i);
    });
  });

  // ── service-role posture ─────────────────────────────────────────────────────
  describe('service-role posture — in-body assertion + grant discipline', () => {
    it('every value-moving service RPC refuses a non-service caller in the BODY', async () => {
      const save = await seedSave(BUYER);
      const calls = [
        `select public.grant_dossier_entitlement('${BUYER}', '${save}', 'cs_x', 'purchase')`,
        `select public.clawback_dossier_entitlement('cs_x')`,
        `select public.claim_dossier_purchase_by_session('cs_x', '${BUYER}', '${save}')`,
      ];
      for (const sql of calls) {
        await expect(asAuthed(BUYER, sql), sql).rejects.toThrow(/service-role only/);
      }
    });

    it('grant posture: service fns REVOKEd from public + GRANTed to service_role; client fns to authenticated', () => {
      const serviceFns = [
        'grant_dossier_entitlement(uuid, uuid, text, text)',
        'clawback_dossier_entitlement(text)',
        'claim_dossier_purchase_by_session(text, uuid, uuid)',
      ];
      for (const sig of serviceFns) {
        const esc = sig.replace(/[()]/g, (c) => `\\${c}`);
        expect(SRC).toMatch(new RegExp(`revoke all on function public\\.${esc} from public`, 'i'));
        expect(SRC).toMatch(new RegExp(`grant execute on function public\\.${esc} to service_role`, 'i'));
      }
      for (const sig of ['has_dossier_entitlement(uuid)']) {
        const esc = sig.replace(/[()]/g, (c) => `\\${c}`);
        expect(SRC).toMatch(new RegExp(`revoke all on function public\\.${esc} from public`, 'i'));
        expect(SRC).toMatch(new RegExp(`grant execute on function public\\.${esc} to authenticated`, 'i'));
      }
    });
  });

  // ── RLS ───────────────────────────────────────────────────────────────────────
  describe('RLS — owner-scoped reads, zero client writes', () => {
    it('RLS is enabled on both tables', async () => {
      for (const t of ['dossier_entitlements', 'single_dossier_purchases']) {
        const { relrowsecurity } = await superRow(`select relrowsecurity from pg_class where oid = 'public.${t}'::regclass`);
        expect(relrowsecurity, t).toBe(true);
      }
    });

    it('dossier_entitlements: a user reads own rows only (cross-user SELECT denied by policy)', async () => {
      const save = await seedSave(BUYER);
      expect((await grant(BUYER, save, 'cs_mine')).ok).toBe(true);
      const own = await asClientTable(BUYER, `select stripe_session_id from public.dossier_entitlements`);
      expect(own.rows).toHaveLength(1);
      const foreign = await asClientTable(OTHER, `select stripe_session_id from public.dossier_entitlements`);
      expect(foreign.rows).toHaveLength(0);
    });

    it('single_dossier_purchases is invisible to clients (no SELECT policy — cannot enumerate buyer emails)', async () => {
      await seedPurchase(BUYER, 'cs_secret');
      const r = await asClientTable(BUYER, `select buyer_email_lower from public.single_dossier_purchases`);
      expect(r.rows).toHaveLength(0);
    });

    it('client INSERTs are denied on both tables (no write policy exists)', async () => {
      const save = await seedSave(BUYER);
      const inserts = [
        `insert into public.dossier_entitlements (user_id, save_id, stripe_session_id) values ('${BUYER}', '${save}', 'cs_forged')`,
        `insert into public.single_dossier_purchases (stripe_session_id, buyer_email_lower) values ('cs_forged', 'x@y.com')`,
      ];
      for (const sql of inserts) {
        await expect(asClientTable(BUYER, sql), sql).rejects.toThrow(/row-level security|permission denied/);
      }
    });

    it('client UPDATE/DELETE silently touch zero rows (no policy → no visible target rows)', async () => {
      const save = await seedSave(BUYER);
      expect((await grant(BUYER, save, 'cs_lock')).ok).toBe(true);

      // A user trying to reactivate a clawed-back right, or forge a purchase claim,
      // finds no visible target rows and changes nothing.
      await asClientTable(BUYER, `update public.dossier_entitlements set status = 'active' where stripe_session_id = 'cs_lock'`);
      expect(await entitlementStatus('cs_lock')).toBe('active'); // was already active — unchanged either way

      // single_dossier_purchases: not even visible, so no update lands.
      await seedPurchase(BUYER, 'cs_lockp');
      await asClientTable(BUYER, `update public.single_dossier_purchases set status = 'claimed' where stripe_session_id = 'cs_lockp'`);
      expect(await purchaseStatus('cs_lockp')).toBe('unclaimed');

      await asClientTable(BUYER, `delete from public.dossier_entitlements`);
      expect((await superRow(`select count(*)::int as n from public.dossier_entitlements`)).n).toBe(1);
    });
  });
});
