/**
 * edgeLogRedaction.test.js — [security-2] the redacting edge logger + its CI guard.
 *
 * Pins that the shared structured logger SCRUBS PII by construction (not by per-call
 * discipline): redact() masks emails / IPs / tokens, logError() runs its error + extra
 * fields through it before emitting, and the CI grep guard fails a console.* line that
 * bakes in a literal email.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { redact, redactFields, logSafe } from '../../supabase/functions/_shared/log.ts';
import { logError } from '../../supabase/functions/_shared/logError.ts';
import { consolePiiLiteralOffenders, consolePiiValueOffenders } from '../../scripts/edgeLogGuard.mjs';

afterEach(() => vi.restoreAllMocks());

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EDGE_ROOT = join(ROOT, 'supabase/functions');

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

// ─────────────────────────────────────────────────────────────────────────────
// A+ backend.3 ARM 2 (LT36 car 2) — the PII-VALUE guard.
//
// The literal arm above is narrow BY DESIGN and the record knew it. What the record did
// not know is that the leak backend.1 actually fixed was an INTERPOLATION, so the guard
// written to stop it from coming back is blind to it: the first case below asserts arm 1's
// blindness and arm 2's catch on the SAME string, side by side, so neither claim can drift.
// ─────────────────────────────────────────────────────────────────────────────
describe('consolePiiValueOffenders() — the PII-value arm (A+ backend.3, LT36 car 2)', () => {
  it('flags the interpolated customer_email leak that the literal arm is blind to', () => {
    const bad = 'console.log(`single_dossier purchased: session=${session.id} email=${session.customer_email}`);';
    // The negative control, executed in the same breath as the positive: arm 1 sees nothing.
    expect(consolePiiLiteralOffenders(bad, 'stripe-webhook/index.ts')).toEqual([]);
    const hits = consolePiiValueOffenders(bad, 'stripe-webhook/index.ts');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain('stripe-webhook/index.ts:1');
    expect(hits[0]).toContain('customer_email');
  });

  it('flags a raw client IP and user-agent in a bot-rejection line (backend.6)', () => {
    const bad = 'console.warn(`[${functionName}] bot rejected ip=${meta.ip} ua=${meta.ua.slice(0, 200)}`);';
    const hits = consolePiiValueOffenders(bad, 'fixture.ts');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain('`ip`');
    expect(hits[0]).toContain('`ua`');
  });

  it('flags a header value read straight into the log line', () => {
    const bad = "console.warn('[gate] blocked', req.headers.get('x-forwarded-for'));";
    const hits = consolePiiValueOffenders(bad, 'fixture.ts');
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain('x-forwarded-for');
  });

  it('flags a camelCase PII member whose LAST segment is the token', () => {
    const bad = 'console.log("dispatch", payload.recipientEmail);';
    expect(consolePiiValueOffenders(bad, 'fixture.ts')).toHaveLength(1);
  });

  it('spans a multi-line call — the offending value need not sit on the console line', () => {
    const bad = [
      'console.warn(',
      '  `[send-email] cap_warning rate-limited ip=${ip} ` +',
      '  `ip_count=${data.ip_count}`,',
      ');',
    ].join('\n');
    const hits = consolePiiValueOffenders(bad, 'fixture.ts');
    expect(hits).toHaveLength(1);
    // Reported at the `console` token's own line, the way a reader greps for it.
    expect(hits[0]).toContain('fixture.ts:1');
  });

  // ── THE OVERREACH CONTROLS ────────────────────────────────────────────────
  // backend.3's literal spec (`\bemail\b`, `x-forwarded-for`, …) flags all five strings
  // below, and all five are PROSE taken verbatim from this tree. A baseline seeded with
  // five false positives is a rule with no teeth, so these are pinned as CLEAN.
  it('stays clean on prose that merely NAMES a PII token', () => {
    const proseFromTheTree = [
      'console.warn("[auth-recovery] reset email not sent: mailer unconfigured or bad recipient");',
      'console.warn("[account-actions] email send failed:", errorMessage(e));',
      'console.error("[send-email] rate limiter error:", error?.message ?? "no data returned");',
      "console.warn('[founder-transfer] email send failed (non-fatal):', (err)?.message ?? 'unknown');",
      'console.error("[auth] reset failed", err.message);',
    ];
    for (const line of proseFromTheTree) {
      expect(consolePiiValueOffenders(line, 'fixture.ts'), line).toEqual([]);
    }
  });

  it('stays clean on a COUNT whose name merely starts with a PII token', () => {
    // `ip_count` is a rate-limit counter, not an address: the rule keys on the LAST
    // identifier segment, so `ipcount`/`count` misses while a bare `ip` hits.
    expect(consolePiiValueOffenders('console.log("rl", data.ip_count, data.recipient_count);', 'f.ts')).toEqual([]);
    expect(consolePiiValueOffenders('console.log("rl", meta.ip);', 'f.ts')).toHaveLength(1);
  });

  it('reads no PII out of a COMMENT — the detector blanks comments first', () => {
    // The estate has been bitten TWICE by a source-text detector counting a docstring
    // (tests/lint/rawButtonBaseline.test.js, LANE VT and LANE PW). Eleven of this tree's
    // `x-forwarded-for` occurrences are comments explaining that the header is spoofable.
    const commented = [
      '// the IP comes from x-forwarded-for (spoofable): console.warn(`ip=${meta.ip}`)',
      '/* console.error(user.email) — the shape this guard forbids */',
      'console.log("ok");',
    ].join('\n');
    expect(consolePiiValueOffenders(commented, 'fixture.ts')).toEqual([]);
  });

  it('exempts _shared/log.ts, whose console.* call emits the ALREADY-redacted line', () => {
    const redactor = 'console.warn(line); // `line` is the output of redactFields()\nconsole.error(user.email);';
    expect(consolePiiValueOffenders(redactor, '_shared/log.ts')).toEqual([]);
    // …and the exemption is by path, not by content: the same source elsewhere offends.
    expect(consolePiiValueOffenders(redactor, 'elsewhere/index.ts')).toHaveLength(1);
  });
});

// ── THE BASELINE RATCHET ─────────────────────────────────────────────────────
// The estate's proven shape (scripts/.raw-button-baseline.json + tests/lint/
// rawButtonBaseline.test.js): a grandfathered FILE list so the rule can be an error for new
// offenders on arrival, plus an occurrence ceiling so a grandfathered file cannot grow a
// second leak, both shrink-only. File paths, not file:line: line numbers churn under every
// unrelated edit above the site, and a baseline that reds on innocent edits gets regenerated
// wholesale, which is how a ratchet quietly becomes a rubber stamp.
describe('the edge PII-log baseline (scripts/.edge-pii-log-baseline.json)', () => {
  function walkEdgeSources(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walkEdgeSources(p, out);
      else if (extname(entry) === '.ts' && !entry.endsWith('.test.ts')) out.push(p);
    }
    return out;
  }

  const sources = walkEdgeSources(EDGE_ROOT);
  const measured = sources
    .map((abs) => {
      const rel = relative(EDGE_ROOT, abs).replace(/\\/g, '/');
      return { rel, hits: consolePiiValueOffenders(readFileSync(abs, 'utf8'), rel) };
    })
    .filter((row) => row.hits.length > 0);
  const measuredFiles = measured.map((row) => row.rel).sort();
  const measuredCount = measured.reduce((n, row) => n + row.hits.length, 0);
  const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.edge-pii-log-baseline.json'), 'utf8'));

  it('the scan is not vacuous — it actually walked the edge tree', () => {
    // A scan that scanned nothing passes. The floor is what makes a zero evidence.
    expect(sources.length, 'edge-function .ts sources walked').toBeGreaterThanOrEqual(60);
  });

  it('the baseline exactly matches the files that still log a PII value', () => {
    // Both mismatch directions red: a NEW offender missing from the baseline (the gate
    // catches it too), and a STALE entry whose file was cured (bank the win).
    expect(Object.keys(baseline.files).sort()).toEqual(measuredFiles);
  });

  it('every grandfathered entry carries a written reason', () => {
    for (const [file, reason] of Object.entries(baseline.files)) {
      expect(typeof reason, file).toBe('string');
      expect(reason.length, file).toBeGreaterThan(40);
    }
  });

  it('total PII-log debt never grows past the committed ceiling', () => {
    expect(measuredCount).toBeLessThanOrEqual(baseline.ceiling);
  });

  it('the ceiling is never left above the measured debt — a win is banked, not banked as slack', () => {
    // The sizeBaseline honesty idiom read in the direction it is usually read the other way
    // round: below the ceiling DEMANDS the ceiling come down, so cured sites cannot leave
    // spendable headroom a genuinely new leak could quietly occupy.
    expect(measuredCount).toBe(baseline.ceiling);
  });
});
