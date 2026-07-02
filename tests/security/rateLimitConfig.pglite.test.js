/**
 * rateLimitConfig.pglite.test.js — proves the consume_ai_generate_rate_limit
 * RPC (net-current = migration 087) reads its window/limit from the
 * ai_user_rate_limit system_config row when the caller doesn't override.
 *
 * The bug 087 closed: 079's defaults (86400/60) were function-parameter defaults,
 * and the edge callers invoke consume_ai_generate_rate_limit(p_user) with no
 * override — so the operator-tunable ai_user_rate_limit config row was DEAD (the
 * params were never null, so the config was never consulted). 087 changes the
 * defaults to NULL and reads the config in that case. This runs the REAL net-current
 * PL/pgSQL against pglite, the same way the other money/limit pglite suites do.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG_087 = resolve(process.cwd(), 'supabase', 'migrations', '087_review_money_hardening.sql');
const have = existsSync(MIG_087);
const UID = '11111111-1111-1111-1111-111111111111';

function extractFn(src, name) {
  const m = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;
const consume = async (uid) =>
  (await db.query('select public.consume_ai_generate_rate_limit($1) as r', [uid])).rows[0].r;
const setCfg = (windowSeconds, perUserLimit) =>
  db.query(`update public.system_config set value = $1::jsonb where key = 'ai_user_rate_limit'`,
    [JSON.stringify({ window_seconds: windowSeconds, per_user_limit: perUserLimit })]);

// Vacuity guard (runs unconditionally): if 087 is ever renamed/removed, `have`
// goes false and the runIf block below silently executes ZERO assertions while
// reporting green. Fail loudly here. Mirrors accountStatusGate.pglite.test.js.
it('migration 087 is present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('consume_ai_generate_rate_limit — live operator config (pglite, 087)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    await db.exec(`
      create table public.system_config (key text primary key, value jsonb not null);
      create table public.ai_generate_rate_limits (
        user_key text not null, window_start timestamptz not null,
        count integer not null default 0, primary key (user_key, window_start)
      );
      insert into public.system_config (key, value)
        values ('ai_user_rate_limit', '{"window_seconds": 86400, "per_user_limit": 60}'::jsonb);
    `);
    await db.exec(extractFn(readFileSync(MIG_087, 'utf-8'), 'consume_ai_generate_rate_limit'));
  });

  beforeEach(async () => {
    await db.exec('truncate public.ai_generate_rate_limits;');
    await setCfg(86400, 60);
  });

  it('honors a tightened per_user_limit from the config row (the tunable is LIVE)', async () => {
    await setCfg(86400, 2);                  // operator tightens the cap to 2/day
    expect((await consume(UID)).allowed).toBe(true);    // 1
    expect((await consume(UID)).allowed).toBe(true);    // 2
    const third = await consume(UID);                   // 3 → over the configured cap
    expect(third.allowed).toBe(false);
    expect(third.limit).toBe(2);             // the RPC reports the CONFIG limit, not 60
  });

  it('SENTINEL: at the default config (60), the 3rd call is still allowed (not vacuously blocked)', async () => {
    expect((await consume(UID)).allowed).toBe(true);
    expect((await consume(UID)).allowed).toBe(true);
    const third = await consume(UID);
    expect(third.allowed).toBe(true);
    expect(third.limit).toBe(60);
  });

  it('falls back to the 60 default when the config row is missing/malformed', async () => {
    await db.query(`delete from public.system_config where key = 'ai_user_rate_limit'`);
    const r = await consume(UID);
    expect(r.allowed).toBe(true);
    expect(r.limit).toBe(60);                // missing config ⇒ conservative default
  });
});
