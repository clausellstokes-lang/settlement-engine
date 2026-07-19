/**
 * founderTransferPayout.pglite.test.js — THE PAYOUT RELEASE PRIMITIVES (163, §6.6,
 * slice M-8). Loads the REAL 163 function bodies into an in-process Postgres (pglite)
 * over the shared credit-ledger scaffold (creditLedgerHarness) plus a minimal
 * founder_transfer_cases mirror, and proves the three primitives the due-runner's
 * payout limb rides:
 *   1. system_grant_credits — THE CREDITS ELECTION grants EXACTLY ONCE per case (and
 *      per buyback), the 116-discipline seat_payout delivery key. A due-runner replay
 *      grants nothing more. Missing case_id/buyback_id → the idempotency guard raises.
 *   2. claim_due_transfer_payout — the atomic 'scheduled'→'releasing' claim. A
 *      just-claimed row is 'releasing' and is NOT re-claimed → the SECOND claim is
 *      none_due: double-release is impossible at the claim layer (the Stripe
 *      idempotency key is the second half, proven in the deno stub suite). Stale
 *      'releasing' rows (a crashed runner) ARE re-claimed (crash recovery).
 *   3. reelect_transfer_payout — a parked ('held') connect_cash payout re-opens to
 *      account_credits + re-arms to 'scheduled'; caller-scoped by from_user.
 *
 * The 163 system_grant_credits body is loaded VERBATIM (net-current recreate) with the
 * one pglite re-qualification creditLedgerHarness already documents: the <<grant_fn>>
 * block label cannot qualify a function PARAMETER in pglite, so `grant_fn.source` →
 * `system_grant_credits.source` (behaviorally identical).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { makeCreditLedgerDb } from './creditLedgerHarness.js';

const MIG_163 = resolve(process.cwd(), 'supabase', 'migrations', '163_seat_payout_release.sql');
const src163 = readFileSync(MIG_163, 'utf-8');

/** Extract a `create or replace function public.<name> … $$;` block from 163. */
function extractFn(name) {
  const m = src163.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from migration 163`);
  return m[0];
}

const U = '11111111-1111-1111-1111-111111111111';
const OTHER = '99999999-9999-9999-9999-999999999999';

let db;

beforeEach(async () => {
  db = await makeCreditLedgerDb();
  // Minimal founder_transfer_cases mirror — only the columns the payout RPCs touch.
  await db.exec(`
    create table public.founder_transfer_cases (
      id uuid primary key default gen_random_uuid(),
      from_user uuid not null,
      payout_form text not null default 'connect_cash',
      payout_status text not null default 'none',
      payout_due_at timestamptz,
      payout_amount_cents integer,
      connect_account_id text,
      updated_at timestamptz not null default now()
    );
    create table public.founder_transfer_events (
      id uuid primary key default gen_random_uuid(),
      case_id uuid, actor text, event text, detail jsonb not null default '{}'::jsonb,
      at timestamptz not null default now()
    );
    -- _log_founder_transfer_event's real body lives in 160; a faithful insert stub is
    -- enough here (reelect appends a 'payout_reelected' row in the same transaction).
    create or replace function public._log_founder_transfer_event(p_case uuid, p_actor text, p_event text, p_detail jsonb)
      returns void language sql as $fn$
        insert into public.founder_transfer_events(case_id, actor, event, detail)
        values (p_case, p_actor, p_event, coalesce(p_detail, '{}'::jsonb));
      $fn$;
    insert into public.profiles(id, credits) values ('${U}', 0) on conflict (id) do nothing;
  `);
  // 163's REAL bodies (net-current system_grant_credits + the two payout RPCs).
  await db.exec(extractFn('system_grant_credits').replace(/\bgrant_fn\.source\b/g, 'system_grant_credits.source'));
  await db.exec(extractFn('claim_due_transfer_payout'));
  await db.exec(extractFn('reelect_transfer_payout'));
});

async function asService() { await db.query(`select set_config('request.jwt.claim.role', 'service_role', false)`); }
async function asAuthed() { await db.query(`select set_config('request.jwt.claim.role', 'authenticated', false)`); }
async function balance() { return (await db.query(`select public.get_credit_balance('${U}'::uuid) as b`)).rows[0].b; }
async function grant(meta) {
  return db.query(`select public.system_grant_credits('${U}'::uuid, 50, 'seat_payout', '${JSON.stringify(meta)}'::jsonb)`);
}

describe('system_grant_credits — the seat_payout arm (THE CREDITS ELECTION, grant-once)', () => {
  it('grants once per case_id: a due-runner replay grants nothing more', async () => {
    await asService();
    await grant({ case_id: 'case-1' });
    expect(await balance()).toBe(50);
    await grant({ case_id: 'case-1' }); // the replay
    expect(await balance()).toBe(50);
    const n = (await db.query(`select count(*)::int as c from public.credit_ledger where source = 'seat_payout'`)).rows[0].c;
    expect(n).toBe(1);
  });

  it('a different case_id grants again (dedup is per release, not per user)', async () => {
    await asService();
    await grant({ case_id: 'case-1' });
    await grant({ case_id: 'case-2' });
    expect(await balance()).toBe(100);
  });

  it('dedups per buyback_id (the stewardship limb keys the same source)', async () => {
    await asService();
    await grant({ buyback_id: 'bb-1' });
    await grant({ buyback_id: 'bb-1' });
    expect(await balance()).toBe(50);
  });

  it('requires a case_id or buyback_id — the idempotency guard raises otherwise', async () => {
    await asService();
    await expect(grant({})).rejects.toThrow(/idempotency metadata is required/);
  });

  it('refuses a non-service caller (fail closed)', async () => {
    await asAuthed();
    await expect(grant({ case_id: 'c' })).rejects.toThrow(/service-role only/);
  });
});

describe('claim_due_transfer_payout — the atomic release claim (double-release impossible)', () => {
  async function insertCase(cols) {
    const c = { from_user: U, payout_form: 'connect_cash', payout_status: 'scheduled', payout_due_at: `now() - interval '1 minute'`, payout_amount_cents: 4950, connect_account_id: `'acct_1'`, updated_at: 'now()', ...cols };
    const { rows } = await db.query(`insert into public.founder_transfer_cases
      (from_user, payout_form, payout_status, payout_due_at, payout_amount_cents, connect_account_id, updated_at)
      values ('${c.from_user}', '${c.payout_form}', '${c.payout_status}', ${c.payout_due_at}, ${c.payout_amount_cents}, ${c.connect_account_id}, ${c.updated_at})
      returning id`);
    return rows[0].id;
  }
  async function claim() { return (await db.query(`select public.claim_due_transfer_payout() as r`)).rows[0].r; }

  it('claims a scheduled + due case → releasing, returning its payout details', async () => {
    await asService();
    const id = await insertCase({});
    const r = await claim();
    expect(r.ok).toBe(true);
    expect(r.case_id).toBe(id);
    expect(r.payout_amount_cents).toBe(4950);
    expect(r.connect_account_id).toBe('acct_1');
    const st = (await db.query(`select payout_status from public.founder_transfer_cases where id = '${id}'`)).rows[0].payout_status;
    expect(st).toBe('releasing');
  });

  it('a just-claimed (releasing) case is NOT re-claimed → the second claim is none_due', async () => {
    await asService();
    await insertCase({});
    expect((await claim()).ok).toBe(true);
    const second = await claim();
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('none_due');
  });

  it('a scheduled case NOT yet due is not claimed', async () => {
    await asService();
    await insertCase({ payout_due_at: `now() + interval '10 days'` });
    expect((await claim()).ok).toBe(false);
  });

  it('a STALE releasing case (a crashed runner) IS re-claimed — crash recovery', async () => {
    await asService();
    await insertCase({ payout_status: 'releasing', updated_at: `now() - interval '20 minutes'` });
    expect((await claim()).ok).toBe(true);
  });

  it('a held case is inert to the claim (never re-swept without a re-election / re-arm)', async () => {
    await asService();
    await insertCase({ payout_status: 'held' });
    expect((await claim()).ok).toBe(false);
  });

  it('refuses a non-service caller (fail closed)', async () => {
    await asAuthed();
    await expect(db.query(`select public.claim_due_transfer_payout()`)).rejects.toThrow(/service-role only/);
  });
});

describe('reelect_transfer_payout — re-open a parked election', () => {
  async function insertHeldCash() {
    const { rows } = await db.query(`insert into public.founder_transfer_cases
      (from_user, payout_form, payout_status, payout_due_at, payout_amount_cents)
      values ('${U}', 'connect_cash', 'held', now() - interval '1 minute', 4950) returning id`);
    return rows[0].id;
  }

  it('flips a held connect_cash payout to account_credits + re-arms to scheduled', async () => {
    await asService();
    const id = await insertHeldCash();
    const r = (await db.query(`select public.reelect_transfer_payout('${id}'::uuid, '${U}'::uuid) as r`)).rows[0].r;
    expect(r.ok).toBe(true);
    const row = (await db.query(`select payout_form, payout_status from public.founder_transfer_cases where id = '${id}'`)).rows[0];
    expect(row.payout_form).toBe('account_credits');
    expect(row.payout_status).toBe('scheduled');
    // The re-armed case is now claimable by the due-runner (it releases as credits).
    const claim = (await db.query(`select public.claim_due_transfer_payout() as r`)).rows[0].r;
    expect(claim.ok).toBe(true);
    expect(claim.payout_form).toBe('account_credits');
    // The re-election is audited.
    const ev = (await db.query(`select count(*)::int as c from public.founder_transfer_events where event = 'payout_reelected'`)).rows[0].c;
    expect(ev).toBe(1);
  });

  it('refuses a case that is not held-cash (e.g. already released)', async () => {
    await asService();
    const { rows } = await db.query(`insert into public.founder_transfer_cases (from_user, payout_form, payout_status) values ('${U}', 'connect_cash', 'released') returning id`);
    const r = (await db.query(`select public.reelect_transfer_payout('${rows[0].id}'::uuid, '${U}'::uuid) as r`)).rows[0].r;
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('not_reelectable');
  });

  it('refuses a caller who is not the from_user (caller-scoped)', async () => {
    await asService();
    const id = await insertHeldCash();
    const r = (await db.query(`select public.reelect_transfer_payout('${id}'::uuid, '${OTHER}'::uuid) as r`)).rows[0].r;
    expect(r.ok).toBe(false);
  });

  it('refuses a non-service caller (fail closed)', async () => {
    await asAuthed();
    const id = '00000000-0000-0000-0000-000000000000';
    await expect(db.query(`select public.reelect_transfer_payout('${id}'::uuid, '${U}'::uuid)`)).rejects.toThrow(/service-role only/);
  });
});
