/**
 * aiRequestIdempotency.pglite.test.js — pins the AI-spend idempotency wall,
 * public.claim_ai_request + attach_ai_spend_to_claim over public.ai_request_claims
 * (migration 119_ai_request_idempotency.sql).
 *
 * This is what stops a retried generate-narrative request (same idempotency key
 * within the TTL) from double-charging: the first caller wins the claim, a retry
 * is told it's a duplicate and handed the prior spend_id instead of spending
 * again. It was REAL BUT UNPINNED (the migration header even names this exact
 * test path). Runs the real PL/pgSQL against pglite and asserts:
 *   - the first claim wins ({duplicate:false});
 *   - a retry within TTL is a duplicate and returns the prior spend_id;
 *   - once the TTL has lapsed, a fresh claim wins again;
 *   - a null/empty user or key is a no-op ({duplicate:false}, never a false dup).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase', 'migrations', '119_ai_request_idempotency.sql');
const have = existsSync(MIG);
const SRC = have ? readFileSync(MIG, 'utf-8') : '';

function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

const UID = '11111111-1111-1111-1111-111111111111';
const SPEND = '99999999-9999-9999-9999-999999999999';

let db;
const claim = async (user, key, ttl = 180) =>
  (await db.query('select public.claim_ai_request($1, $2, $3) as r', [user, key, ttl])).rows[0].r;
const attach = (user, key, spendId) =>
  db.query('select public.attach_ai_spend_to_claim($1, $2, $3)', [user, key, spendId]);

it('migration 119 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('claim_ai_request idempotency (pglite, 119)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    // Self-contained: just the claims table the RPCs read/write.
    await db.exec(`
      create table public.ai_request_claims (
        user_id     uuid        not null,
        request_key text        not null,
        spend_id    uuid,
        created_at  timestamptz not null default now(),
        primary key (user_id, request_key)
      );
    `);
    await db.exec(extractFn(SRC, 'claim_ai_request'));
    await db.exec(extractFn(SRC, 'attach_ai_spend_to_claim'));
  }, 60000);

  beforeEach(async () => {
    await db.exec('truncate public.ai_request_claims;');
  });

  it('the FIRST claim wins (duplicate:false)', async () => {
    expect(await claim(UID, 'k1')).toEqual({ duplicate: false });
  });

  it('a RETRY within TTL is a duplicate and returns the prior spend_id', async () => {
    expect((await claim(UID, 'k2')).duplicate).toBe(false); // winner
    await attach(UID, 'k2', SPEND);                          // the winner captured a spend
    const retry = await claim(UID, 'k2');                    // retry within TTL
    expect(retry.duplicate).toBe(true);
    expect(retry.spend_id).toBe(SPEND);                      // hands back the original charge
  });

  it('once the TTL has lapsed, a fresh claim WINS again (not a false duplicate)', async () => {
    expect((await claim(UID, 'k3')).duplicate).toBe(false);
    // ttl=0 makes every prior row stale, so the stale-sweep clears it and the
    // re-claim inserts fresh → duplicate:false.
    expect((await claim(UID, 'k3', 0)).duplicate).toBe(false);
  });

  it('distinct keys never collide (independent claims)', async () => {
    expect((await claim(UID, 'a')).duplicate).toBe(false);
    expect((await claim(UID, 'b')).duplicate).toBe(false);
  });

  it('a null/empty user or key is a no-op (duplicate:false, never a false dup)', async () => {
    expect(await claim(null, 'k')).toEqual({ duplicate: false });
    expect(await claim(UID, '')).toEqual({ duplicate: false });
    // The no-op guard must not have written a row that a later real claim trips on.
    expect((await db.query('select count(*)::int c from public.ai_request_claims')).rows[0].c).toBe(0);
  });
});
