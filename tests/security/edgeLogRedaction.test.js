/**
 * edgeLogRedaction.test.js — [security-2] the redacting edge logger + its CI guard.
 *
 * Pins that the shared structured logger SCRUBS PII by construction (not by per-call
 * discipline): redact() masks emails / IPs / tokens, logError() runs its error + extra
 * fields through it before emitting, and the CI grep guard fails a console.* line that
 * bakes in a literal email.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { redact, redactFields, logSafe } from '../../supabase/functions/_shared/log.ts';
import { logError } from '../../supabase/functions/_shared/logError.ts';
import { consolePiiLiteralOffenders } from '../../scripts/edgeLogGuard.mjs';

afterEach(() => vi.restoreAllMocks());

describe('redact() — the PII scrubber', () => {
  it('masks an email address', () => {
    const out = redact('no user for clausellstokes@aol.com found');
    expect(out).not.toContain('clausellstokes@aol.com');
    expect(out).toContain('[email]');
  });

  it('masks IPv4 and IPv6 addresses', () => {
    expect(redact('rate-limited 203.0.113.9')).toBe('rate-limited [ip]');
    expect(redact('from 2001:db8:85a3:0:0:8a2e:370:7334 ok')).toContain('[ip]');
  });

  it('masks bearer and JWT tokens', () => {
    expect(redact('auth Bearer abcDEF123456ghi')).toContain('Bearer [token]');
    expect(redact('jwt eyJhbGciOi.eyJzdWIiOi.SflKxwRJSM')).toContain('[token]');
  });

  it('leaves an ordinary message untouched', () => {
    expect(redact('settlement not found for id sf_1234')).toBe('settlement not found for id sf_1234');
  });

  it('redactFields scrubs string values only, preserving non-string fields', () => {
    const out = redactFields({ status: 500, note: 'email a@b.co blocked from 10.0.0.1' });
    expect(out.status).toBe(500);
    expect(out.note).toBe('email [email] blocked from [ip]');
  });
});

describe('logError() — scrubs by policy', () => {
  it('masks PII in the error message and the extra fields it emits', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logError('auth-recovery', 'user-1', new Error('reset failed for jane.doe@example.com'), {
      hint: 'client 198.51.100.7',
      status: 400,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0][0];
    expect(line).not.toContain('jane.doe@example.com');
    expect(line).not.toContain('198.51.100.7');
    const parsed = JSON.parse(line);
    expect(parsed.error).toContain('[email]');
    expect(parsed.hint).toContain('[ip]');
    expect(parsed.status).toBe(400); // non-string field untouched
  });
});

describe('logSafe() — structured redacted line', () => {
  it('emits a redacted JSON line at the right console channel', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logSafe('warn', 'stripe-webhook', { note: 'user a@b.com' });
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.level).toBe('warn');
    expect(parsed.fn).toBe('stripe-webhook');
    expect(parsed.note).toContain('[email]');
  });
});

describe('consolePiiLiteralOffenders() — the CI grep guard', () => {
  it('flags a console.* call that embeds a literal email', () => {
    const bad = `console.log("granting seat to founder@example.com now");`;
    expect(consolePiiLiteralOffenders(bad, 'fixture.ts')).toHaveLength(1);
  });

  it('does NOT flag an interpolated variable (the migration-friendly form)', () => {
    const ok = 'console.error("[auth] reset failed", err.message);';
    expect(consolePiiLiteralOffenders(ok, 'fixture.ts')).toEqual([]);
  });
});
