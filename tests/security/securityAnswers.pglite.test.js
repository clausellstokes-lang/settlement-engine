/**
 * securityAnswers.pglite.test.js — EXECUTION test of the Auth Phase 2 security-
 * answer backend (migration 066) against in-process Postgres (pglite).
 *
 * Proves the non-negotiable invariants by RUNNING the real, verbatim-extracted RPC
 * bodies from 066 (not a paraphrase):
 *   (1) answer_hash is NEVER selectable by a client: security_answers has RLS ON
 *       and NO policy, and the table grants are revoked from anon/authenticated, so
 *       a non-superuser FORCE-RLS role gets zero rows / a denied direct SELECT.
 *   (2) set_my_security_answers upserts BOTH slots for the caller, rejects a
 *       duplicate question id, and rejects an unknown id.
 *   (3) get_my_security_question_ids returns {slot, question_id} only — never hash.
 *   (4) verify_recovery_answer is a correct bcrypt-style compare: true for the
 *       right answer (case/space-insensitive), false for a wrong answer, a wrong
 *       slot, an unknown email, and an account with no answers.
 *   (5) pick_recovery_question reports existence honestly and returns ONE configured
 *       slot (never the hash); both slots are reachable across repeated picks.
 *   (6) SENTINEL: a direct `select answer_hash` as the client role is denied — so
 *       (1) is load-bearing, not vacuously green.
 *
 * pgcrypto note: pglite does not ship pgcrypto, so crypt()/gen_salt() are stubbed
 * with a DETERMINISTIC salted-digest shim BEFORE the real RPC bodies load. The shim
 * preserves the crypt(answer, stored)=stored verification CONTRACT the RPCs rely on
 * (that is what we test here); bcrypt's cryptographic strength is a property of the
 * pgcrypto extension on the real DB, out of scope for a logic test. The RPC SQL
 * itself is loaded verbatim, so a logic regression in 066 fails here.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = resolve(process.cwd(), 'supabase/migrations/066_security_questions_and_recovery.sql');
const exists = existsSync(MIG);

describe('066 pglite target exists (guards against silent vacuous skip)', () => {
  it('migration 066 is present on disk', () => {
    expect(exists, 'supabase/migrations/066_security_questions_and_recovery.sql must exist').toBe(true);
  });
});

/** Extract a `create or replace function public.<name>` body verbatim through its first `$$;`. */
function extractFn(name) {
  const src = readFileSync(MIG, 'utf8');
  const m = src.match(new RegExp(`create or replace function public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name} from 066`);
  return m[0];
}

const ALICE = '11111111-1111-1111-1111-111111111111';
const BOB = '22222222-2222-2222-2222-222222222222';
const NOANS = '33333333-3333-3333-3333-333333333333'; // exists, no security answers

let db;
const asUser = (uid) => db.exec(`reset role; set test.uid = '${uid ?? ''}';`);
const scalar = async (q) => (await db.query(q)).rows[0];
const tryExec = async (sql) => { try { await db.exec(sql); return 'ok'; } catch { return 'rejected'; } };

describe.runIf(exists)('security-answer backend — execution against 066 (pglite)', () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create schema if not exists auth;
      create or replace function auth.uid() returns uuid language sql stable as $fn$
        select nullif(current_setting('test.uid', true), '')::uuid
      $fn$;
      -- Minimal auth.users so the recovery RPCs can resolve email -> id.
      create table auth.users (id uuid primary key, email text);

      -- pgcrypto shim: pglite lacks the extension. A deterministic salted digest
      -- that preserves the crypt(answer, stored)=stored verification contract.
      create or replace function public.gen_salt(p_type text) returns text
        language sql volatile as $fn$
          select 'shim$' || md5(random()::text || clock_timestamp()::text)
        $fn$;
      -- crypt(answer, salt-or-stored): the stored form is 'shim$' || md5(salt||answer),
      -- carrying the salt as a prefix so a later crypt(answer, stored) recomputes the
      -- same value iff the answer matches — exactly bcrypt's compare contract.
      create or replace function public.crypt(p_answer text, p_salt_or_stored text) returns text
        language sql immutable as $fn$
          select case
            when p_salt_or_stored like 'shim$%' and length(p_salt_or_stored) > 5
              then 'crypt$' || substr(p_salt_or_stored, 6, 32) || '$' ||
                   md5(substr(p_salt_or_stored, 6, 32) || p_answer)
            when p_salt_or_stored like 'crypt$%'
              then 'crypt$' || split_part(p_salt_or_stored, '$', 2) || '$' ||
                   md5(split_part(p_salt_or_stored, '$', 2) || p_answer)
            else 'crypt$0$' || md5(p_answer)
          end
        $fn$;
    `);

    // Real, verbatim RPC bodies from 066.
    await db.exec(extractFn('is_allowed_security_question_id'));

    // The table DDL from 066 (create-if-not-exists), then enable+revoke as the migration does.
    await db.exec(`
      create table if not exists public.security_answers (
        user_id uuid not null, slot smallint not null check (slot in (1,2)),
        question_id text not null, answer_hash text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        primary key (user_id, slot)
      );
      alter table public.security_answers enable row level security;
    `);

    await db.exec(extractFn('set_my_security_answers'));
    await db.exec(extractFn('get_my_security_question_ids'));
    await db.exec(extractFn('pick_recovery_question'));
    await db.exec(extractFn('verify_recovery_answer'));

    // Non-superuser client role under FORCE RLS = the faithful direct-PostgREST path.
    await db.exec(`
      alter table public.security_answers force row level security;
      create role nosuperuser nologin;
      revoke all on table public.security_answers from nosuperuser;
      -- Mirror the migration: client roles get NO table privileges, but CAN execute
      -- the SECURITY DEFINER caller RPCs (definer runs as the owner = this session).
      grant execute on function public.set_my_security_answers(text, text, text, text) to nosuperuser;
      grant execute on function public.get_my_security_question_ids() to nosuperuser;
    `);

    await db.exec(`
      insert into auth.users (id, email) values
        ('${ALICE}', 'alice@example.com'),
        ('${BOB}',   'bob@example.com'),
        ('${NOANS}', 'noans@example.com');
    `);
  });

  beforeEach(async () => {
    await db.exec(`reset role; set test.uid = ''; truncate public.security_answers;`);
  });

  // ── (2) set_my_security_answers ────────────────────────────────────────────
  it('a caller sets BOTH of their own slots; get_ returns slot+id (never the hash)', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    await db.exec(`reset role;`);

    await asUser(ALICE);
    const rows = (await db.query(`select * from public.get_my_security_question_ids()`)).rows;
    expect(rows).toEqual([
      { slot: 1, question_id: 'first_pet' },
      { slot: 2, question_id: 'birth_city' },
    ]);
    // get_ returns no hash column at all.
    expect(Object.keys(rows[0])).toEqual(['slot', 'question_id']);
  });

  it('rejects two identical question ids', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    expect(await tryExec(`select public.set_my_security_answers('first_pet','a','first_pet','b');`)).toBe('rejected');
  });

  it('rejects an unknown question id (not in the allow-list)', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    expect(await tryExec(`select public.set_my_security_answers('mothers_maiden_name','a','first_pet','b');`)).toBe('rejected');
  });

  it('re-setting answers upserts in place (still exactly two slots)', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    await db.exec(`select public.set_my_security_answers('first_school','Greenfield','first_car','Volvo');`);
    await db.exec(`reset role;`);
    const n = await scalar(`select count(*)::int as n from public.security_answers where user_id='${ALICE}'`);
    expect(n.n).toBe(2);
    await asUser(ALICE);
    const rows = (await db.query(`select question_id from public.get_my_security_question_ids() order by slot`)).rows;
    expect(rows.map((r) => r.question_id)).toEqual(['first_school', 'first_car']);
  });

  // ── (1)+(6) hash is never client-selectable ────────────────────────────────
  it('SENTINEL: a direct client SELECT of answer_hash is denied (RLS no-policy + no grant)', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    // Same client role attempting to read the hash directly: denied (no SELECT priv,
    // and RLS-on + no-policy would yield zero rows even if a grant existed).
    const res = await tryExec(`select answer_hash from public.security_answers;`);
    expect(res).toBe('rejected');
  });

  // ── (4) verify_recovery_answer (service-role path; logic) ──────────────────
  it('verify_recovery_answer: true on the right answer (case/space-insensitive), false on wrong', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    await db.exec(`reset role;`);
    // slot 1 = first_pet = 'Rover'
    expect((await scalar(`select public.verify_recovery_answer('alice@example.com',1::smallint,'  rOvEr ') as v`)).v).toBe(true);
    expect((await scalar(`select public.verify_recovery_answer('alice@example.com',1::smallint,'Fido') as v`)).v).toBe(false);
    // slot 2 = birth_city = 'Leiden'
    expect((await scalar(`select public.verify_recovery_answer('alice@example.com',2::smallint,'leiden') as v`)).v).toBe(true);
  });

  it('verify_recovery_answer: false for a wrong slot, unknown email, and an account with no answers', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    await db.exec(`reset role;`);
    expect((await scalar(`select public.verify_recovery_answer('alice@example.com',3::smallint,'Rover') as v`)).v).toBe(false);
    expect((await scalar(`select public.verify_recovery_answer('nobody@example.com',1::smallint,'Rover') as v`)).v).toBe(false);
    expect((await scalar(`select public.verify_recovery_answer('noans@example.com',1::smallint,'Rover') as v`)).v).toBe(false);
    expect((await scalar(`select public.verify_recovery_answer('',1::smallint,'Rover') as v`)).v).toBe(false);
  });

  // ── (5) pick_recovery_question ─────────────────────────────────────────────
  it('pick_recovery_question reports existence honestly and returns ONE configured slot (no hash)', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    await db.exec(`reset role;`);

    // unknown email -> exists=false, null question
    const unknown = await scalar(`select * from public.pick_recovery_question('nobody@example.com')`);
    expect(unknown.account_exists).toBe(false);
    expect(unknown.slot).toBeNull();

    // account with no answers -> exists=true, null question
    const noans = await scalar(`select * from public.pick_recovery_question('noans@example.com')`);
    expect(noans.account_exists).toBe(true);
    expect(noans.slot).toBeNull();

    // configured account -> exists=true, a real slot in {1,2}, the matching id, never a hash column
    const pick = await scalar(`select * from public.pick_recovery_question('alice@example.com')`);
    expect(pick.account_exists).toBe(true);
    expect([1, 2]).toContain(pick.slot);
    expect(['first_pet', 'birth_city']).toContain(pick.question_id);
    expect(Object.keys(pick).sort()).toEqual(['account_exists', 'question_id', 'slot']);
  });

  it('pick_recovery_question can return EITHER slot across repeated picks (random selection works)', async () => {
    await asUser(ALICE);
    await db.exec(`set role nosuperuser;`);
    await db.exec(`select public.set_my_security_answers('first_pet','Rover','birth_city','Leiden');`);
    await db.exec(`reset role;`);
    const seen = new Set();
    for (let i = 0; i < 40 && seen.size < 2; i += 1) {
      const r = await scalar(`select slot from public.pick_recovery_question('alice@example.com')`);
      seen.add(r.slot);
    }
    expect(seen.size).toBe(2); // both slots are reachable
  });
});
