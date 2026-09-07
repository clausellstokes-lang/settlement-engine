/**
 * rateLimiterRpcs.pglite.test.js — pins the three fixed-window rate-limiter RPCs
 * that guard the anonymous/auth-adjacent edge endpoints and were REAL BUT UNPINNED
 * (Wave-D wall census):
 *   - consume_email_rate_limit          (034) — send-email: per-IP AND per-recipient
 *   - consume_dossier_verify_rate_limit (035) — verify-single-dossier: per-IP
 *   - consume_recovery_rate_limit       (066) — auth-recovery: per-IP AND per-email
 *
 * Each is a SECURITY DEFINER fixed-window counter whose `allowed` verdict is the
 * server-side wall the edge functions fail-close on. Runs the real PL/pgSQL against
 * pglite over each RPC's own bucket table and asserts the boundary (Nth allowed,
 * (N+1)th over), the DUAL-scope AND semantics, and key normalisation.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const MIG = (n, name) => resolve(process.cwd(), 'supabase', 'migrations', `${n}_${name}.sql`);
const M_EMAIL = MIG('034', 'email_rate_limit');
const M_DOSSIER = MIG('035', 'dossier_verify_rate_limit');
const M_RECOVERY = MIG('066', 'security_questions_and_recovery');
const have = [M_EMAIL, M_DOSSIER, M_RECOVERY].every(existsSync);

function extractFn(src, name) {
  const m = src.match(new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'im'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

let db;

it('migrations 034 / 035 / 066 are present (suite is not vacuous)', () => {
  expect(have).toBe(true);
});

describe.runIf(have)('fixed-window rate-limiter RPCs (pglite)', () => {
  beforeAll(async () => {
    db = await new PGlite();
    // Each RPC's own bucket table (schemas from 034/035/066 verbatim).
    await db.exec(`
      create table public.email_rate_limits (
        scope_type text not null check (scope_type in ('ip','recipient')),
        scope_key text not null, window_start timestamptz not null,
        count integer not null default 0, primary key (scope_type, scope_key, window_start)
      );
      create table public.dossier_verify_rate_limits (
        ip_key text not null, window_start timestamptz not null,
        count integer not null default 0, primary key (ip_key, window_start)
      );
      create table public.recovery_rate_limits (
        scope_type text not null check (scope_type in ('ip','email')),
        scope_key text not null, window_start timestamptz not null,
        count integer not null default 0, primary key (scope_type, scope_key, window_start)
      );
    `);
    await db.exec(extractFn(readFileSync(M_EMAIL, 'utf-8'), 'consume_email_rate_limit'));
    await db.exec(extractFn(readFileSync(M_DOSSIER, 'utf-8'), 'consume_dossier_verify_rate_limit'));
    await db.exec(extractFn(readFileSync(M_RECOVERY, 'utf-8'), 'consume_recovery_rate_limit'));
  }, 60000);

  beforeEach(async () => {
    await db.exec('truncate public.email_rate_limits, public.dossier_verify_rate_limits, public.recovery_rate_limits;');
  });

  describe('consume_email_rate_limit (034) — per-IP AND per-recipient', () => {
    const call = async (ip, rcpt, ipLim = 5, rcptLim = 3) =>
      (await db.query('select public.consume_email_rate_limit($1,$2,3600,$3,$4) as r', [ip, rcpt, ipLim, rcptLim])).rows[0].r;

    it('admits up to the IP limit then denies (distinct recipients isolate the IP scope)', async () => {
      // ipLimit 2, recipient limit high; distinct recipients so only the IP scope caps.
      expect((await call('1.1.1.1', 'a@x.com', 2, 100)).allowed).toBe(true);
      expect((await call('1.1.1.1', 'b@x.com', 2, 100)).allowed).toBe(true);
      expect((await call('1.1.1.1', 'c@x.com', 2, 100)).allowed).toBe(false); // 3rd from the IP
    });

    it('the per-RECIPIENT scope caps independently (distinct IPs isolate it)', async () => {
      expect((await call('1.0.0.1', 'target@x.com', 100, 2)).allowed).toBe(true);
      expect((await call('1.0.0.2', 'target@x.com', 100, 2)).allowed).toBe(true);
      expect((await call('1.0.0.3', 'target@x.com', 100, 2)).allowed).toBe(false); // 3rd to the recipient
    });

    it('recipient is normalised (case/whitespace) so alias spellings share a bucket', async () => {
      expect((await call('9.9.9.9', 'Foo@X.com ', 100, 1)).allowed).toBe(true);
      expect((await call('9.9.9.8', '  foo@x.com', 100, 1)).allowed).toBe(false); // same recipient bucket
    });
  });

  describe('consume_dossier_verify_rate_limit (035) — per-IP', () => {
    const call = async (ip, ipLim = 30) =>
      (await db.query('select public.consume_dossier_verify_rate_limit($1,3600,$2) as r', [ip, ipLim])).rows[0].r;

    it('admits up to the IP limit, then denies, and keeps distinct IPs independent', async () => {
      expect((await call('2.2.2.2', 2)).allowed).toBe(true);
      expect((await call('2.2.2.2', 2)).allowed).toBe(true);
      expect((await call('2.2.2.2', 2)).allowed).toBe(false);  // over
      expect((await call('3.3.3.3', 2)).allowed).toBe(true);   // a different IP is unaffected
    });

    it('an empty IP coalesces to the 0.0.0.0 bucket (does not mint an unlimited fresh key)', async () => {
      expect((await call('', 1)).allowed).toBe(true);
      expect((await call('   ', 1)).allowed).toBe(false); // same 0.0.0.0 bucket
    });
  });

  describe('consume_recovery_rate_limit (066) — per-IP AND per-email', () => {
    const call = async (ip, email, ipLim = 10, emailLim = 5) =>
      (await db.query('select public.consume_recovery_rate_limit($1,$2,900,$3,$4) as r', [ip, email, ipLim, emailLim])).rows[0].r;

    it('the per-EMAIL scope caps independently of the IP scope', async () => {
      expect((await call('4.4.4.1', 'victim@x.com', 100, 2)).allowed).toBe(true);
      expect((await call('4.4.4.2', 'victim@x.com', 100, 2)).allowed).toBe(true);
      expect((await call('4.4.4.3', 'victim@x.com', 100, 2)).allowed).toBe(false); // 3rd for the email
    });

    it('the per-IP scope caps independently of the email scope', async () => {
      expect((await call('5.5.5.5', 'a@x.com', 2, 100)).allowed).toBe(true);
      expect((await call('5.5.5.5', 'b@x.com', 2, 100)).allowed).toBe(true);
      expect((await call('5.5.5.5', 'c@x.com', 2, 100)).allowed).toBe(false); // 3rd from the IP
    });
  });
});
