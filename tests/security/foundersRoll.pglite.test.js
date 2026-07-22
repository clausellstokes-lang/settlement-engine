/**
 * foundersRoll.pglite.test.js — applies the REAL 170 migration into pglite and
 * exercises the founders-roll contract:
 *   - set_founder_credit_listed is FOUNDER-GATED (a non-founder / anon is
 *     rejected; a founder toggles their OWN flag).
 *   - founders_roll returns ONLY consenting, active founders' external_name,
 *     earliest-founder first, with NO id/email columns.
 *   - a banned/disabled founder is excluded even when opted in.
 *   - PRIVACY (source pin): the founders_roll SQL selects no id/email column.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const dir = resolve(process.cwd(), 'supabase', 'migrations');
const MIG_170 = resolve(dir, '170_founders_roll.sql');

const A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; // founder, later grant
const B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'; // founder, earlier grant
const C = 'cccccccc-cccc-cccc-cccc-cccccccccccc'; // NOT a founder

async function makeDb() {
  const db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    do $do$ begin
      if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      if not exists (select from pg_roles where rolname = 'anon') then create role anon; end if;
      if not exists (select from pg_roles where rolname = 'service_role') then create role service_role; end if;
    end $do$;
    create or replace function auth.uid() returns uuid language sql stable as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$;
    create table if not exists auth.users (id uuid primary key);
    create table if not exists public.profiles (
      id uuid primary key,
      is_founder boolean default false,
      external_name text,
      banned_at timestamptz,
      disabled_at timestamptz,
      updated_at timestamptz default now()
    );
    create table if not exists public.credit_grant_idempotency (
      source text, user_id uuid, idempotency_key text, created_at timestamptz default now()
    );
    -- Minimal account_is_active stub (real one lives in an earlier migration).
    create or replace function public.account_is_active(p_uid uuid) returns boolean
      language sql stable as $fn$
        select coalesce((select banned_at is null and disabled_at is null from public.profiles where id = p_uid), false)
      $fn$;
    insert into auth.users(id) values ('${A}'),('${B}'),('${C}') on conflict do nothing;
    insert into public.profiles(id, is_founder, external_name) values
      ('${A}', true,  'Aria the Cartographer'),
      ('${B}', true,  'Bram Ironquill'),
      ('${C}', false, 'Casey Newcomer') on conflict do nothing;
    -- B became a founder BEFORE A (earlier grant row) → B sorts first.
    insert into public.credit_grant_idempotency(source, user_id, created_at) values
      ('founder_grant', '${B}', '2026-01-01'),
      ('founder_grant', '${A}', '2026-02-01');
  `);
  await db.exec(readFileSync(MIG_170, 'utf-8'));
  return db;
}

async function asUser(db, uid) { await db.query(`select set_config('test.uid', '${uid}', false)`); }
async function asAnon(db) { await db.query(`select set_config('test.uid', '', false)`); }

let db;
beforeEach(async () => { db = await makeDb(); });

describe('set_founder_credit_listed — founder-gated own-row toggle', () => {
  it('a founder can list themselves', async () => {
    await asUser(db, A);
    const r = (await db.query(`select public.set_founder_credit_listed(true) as v`)).rows[0].v;
    expect(r).toBe(true);
    const flag = (await db.query(`select founder_credit_listed from public.profiles where id = '${A}'`)).rows[0].founder_credit_listed;
    expect(flag).toBe(true);
  });

  it('a NON-founder is rejected', async () => {
    await asUser(db, C);
    await expect(db.query(`select public.set_founder_credit_listed(true)`)).rejects.toThrow(/only founders/i);
  });

  it('an anonymous caller is rejected', async () => {
    await asAnon(db);
    await expect(db.query(`select public.set_founder_credit_listed(true)`)).rejects.toThrow(/not authenticated/i);
  });
});

describe('founders_roll — public, consenting, ordered, no PII', () => {
  it('is empty until a founder opts in', async () => {
    const rows = (await db.query(`select * from public.founders_roll()`)).rows;
    expect(rows).toEqual([]);
  });

  it('returns consenting founders by grant time (earliest first), names only', async () => {
    await asUser(db, A); await db.query(`select public.set_founder_credit_listed(true)`);
    await asUser(db, B); await db.query(`select public.set_founder_credit_listed(true)`);
    const res = await db.query(`select * from public.founders_roll()`);
    // B granted 2026-01-01 (before A) ⇒ B first.
    expect(res.rows.map((r) => r.name)).toEqual(['Bram Ironquill', 'Aria the Cartographer']);
    // Shape carries ONLY `name` — no id / email / user_id column leaks.
    expect(Object.keys(res.rows[0])).toEqual(['name']);
  });

  it('excludes a NON-founder even if the flag were somehow set', async () => {
    // Force the flag on for the non-founder directly (bypassing the gate).
    await db.query(`update public.profiles set founder_credit_listed = true where id = '${C}'`);
    const rows = (await db.query(`select * from public.founders_roll()`)).rows;
    expect(rows).toEqual([]);
  });

  it('excludes a banned founder who opted in', async () => {
    await asUser(db, A); await db.query(`select public.set_founder_credit_listed(true)`);
    await db.query(`update public.profiles set banned_at = now() where id = '${A}'`);
    const rows = (await db.query(`select * from public.founders_roll()`)).rows;
    expect(rows).toEqual([]);
  });
});

describe('founders_roll — PRIVACY source pin', () => {
  const sql = readFileSync(MIG_170, 'utf-8');
  // Isolate the founders_roll function body (returns clause + select).
  const fnBody = sql.slice(sql.indexOf('function public.founders_roll'));
  it('the founders_roll body returns ONLY a name column and never touches email', () => {
    const returnsSelect = fnBody.slice(0, fnBody.indexOf('$$;', fnBody.indexOf('as $$')) + 3);
    // The airtight guarantee: the RETURN SIGNATURE is a single text column `name`
    // — Postgres enforces the shape, so no id/email can ever be returned whatever
    // the select does. (The runtime test above also pins Object.keys === ['name'].)
    expect(returnsSelect).toMatch(/returns table \(name text\)/);
    // The only projected value is external_name; email is never referenced at all.
    expect(returnsSelect).toMatch(/select\s+p\.external_name as name/i);
    expect(returnsSelect).not.toMatch(/email/i);
    // p.id appears ONLY as the account_is_active filter arg, never as a returned
    // column (no `p.id as` / `, p.id` projection).
    expect(returnsSelect).not.toMatch(/p\.id\s+as\b/i);
    expect(returnsSelect).not.toMatch(/,\s*p\.id\b/i);
  });
});
