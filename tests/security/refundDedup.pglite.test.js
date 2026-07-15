/**
 * refundDedup.pglite.test.js — migration 087's pre-dedup guard makes the
 * ux_credit_ledger_one_refund_per_spend unique index DEPLOY-SAFE.
 *
 * The hazard: `create unique index ... where source='refund'` ABORTS the whole
 * migration if the live ledger already holds a duplicate refund for any spend
 * (producible by the pre-085 refund path racing). 087 prepends a DO-block that,
 * per over-refunded spend, keeps the earliest refund grant, deletes the extras,
 * and reverses the phantom over-credit from the legacy profiles.credits counter —
 * so the index can then be created. This runs the REAL 087 DO-block + index DDL
 * against pglite over a minimal ledger mirror.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_087 = resolve(process.cwd(), 'supabase', 'migrations', '087_review_money_hardening.sql');
const have = existsSync(MIG_087);
const SRC = have ? readFileSync(MIG_087, 'utf-8') : '';
const UID = '11111111-1111-1111-1111-111111111111';
const SPEND = '22222222-2222-2222-2222-222222222222';

/** The pre-dedup DO-block + the CREATE UNIQUE INDEX, extracted verbatim from 087. */
const dedupBlock = () => {
  const m = SRC.match(/do \$\$[\s\S]*?end \$\$;/i);
  if (!m) throw new Error('could not extract the pre-dedup DO block from 087');
  return m[0];
};
const indexDdl = () => {
  const m = SRC.match(/create unique index if not exists ux_credit_ledger_one_refund_per_spend[\s\S]*?;/i);
  if (!m) throw new Error('could not extract the unique index DDL from 087');
  return m[0];
};

let db;
const scalar = async (q) => (await db.query(q)).rows[0];

// Vacuity guard (runs unconditionally): if 087 is ever renamed/removed, `have`
// goes false and the runIf block below silently executes ZERO assertions while
// reporting green — the exact green-on-nothing class this repo ratchets against.
// Fail loudly here instead. Mirrors accountStatusGate.pglite.test.js.
it('migration 087 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('087 refund pre-dedup makes the unique index deploy-safe (pglite)', () => {
  beforeAll(async () => { db = await new PGlite(); });
  beforeEach(async () => {
    await db.exec(`
      drop table if exists public.credit_ledger;
      drop table if exists public.profiles;
      create table public.profiles (id uuid primary key, credits integer not null default 0);
      create table public.credit_ledger (
        id uuid primary key default gen_random_uuid(), user_id uuid not null,
        kind text not null, amount integer not null, source text not null,
        metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
      );
    `);
  });

  it('dedups a pre-existing double-refund and reverses the phantom credit, THEN the index creates', async () => {
    // A spend that was refunded TWICE (the race 087 closes): two refund grants of
    // amount 3 for the same refund_of, and profiles.credits over-credited by 3.
    await db.query(`insert into public.profiles (id, credits) values ('${UID}', 6)`);
    await db.exec(`
      insert into public.credit_ledger (user_id, kind, amount, source, metadata, created_at) values
        ('${UID}', 'grant', 3, 'refund', jsonb_build_object('refund_of','${SPEND}'), now() - interval '2 min'),
        ('${UID}', 'grant', 3, 'refund', jsonb_build_object('refund_of','${SPEND}'), now() - interval '1 min');
    `);

    // Run 087's pre-dedup, then the index DDL. Neither must throw.
    await db.exec(dedupBlock());
    await db.exec(indexDdl());   // would throw 'duplicate key' WITHOUT the dedup above

    // Exactly one refund grant survives (the earliest), phantom credit reversed.
    expect(Number((await scalar(`select count(*)::int n from public.credit_ledger where source='refund' and metadata->>'refund_of'='${SPEND}'`)).n)).toBe(1);
    expect(Number((await scalar(`select credits from public.profiles where id='${UID}'`)).credits)).toBe(3);
  });

  it('SENTINEL: with no duplicates, the index creates and nothing is touched', async () => {
    await db.query(`insert into public.profiles (id, credits) values ('${UID}', 3)`);
    await db.query(`insert into public.credit_ledger (user_id, kind, amount, source, metadata) values ('${UID}','grant',3,'refund', jsonb_build_object('refund_of','${SPEND}'))`);
    await db.exec(dedupBlock());
    await db.exec(indexDdl());
    expect(Number((await scalar(`select count(*)::int n from public.credit_ledger where source='refund'`)).n)).toBe(1);
    expect(Number((await scalar(`select credits from public.profiles where id='${UID}'`)).credits)).toBe(3);   // untouched
  });

  it('the index then REJECTS a fresh duplicate refund insert (backstop is live)', async () => {
    await db.query(`insert into public.profiles (id, credits) values ('${UID}', 0)`);
    await db.exec(dedupBlock());
    await db.exec(indexDdl());
    await db.query(`insert into public.credit_ledger (user_id, kind, amount, source, metadata) values ('${UID}','grant',3,'refund', jsonb_build_object('refund_of','${SPEND}'))`);
    await expect(
      db.query(`insert into public.credit_ledger (user_id, kind, amount, source, metadata) values ('${UID}','grant',3,'refund', jsonb_build_object('refund_of','${SPEND}'))`),
    ).rejects.toThrow(/duplicate key|unique/i);
  });
});
