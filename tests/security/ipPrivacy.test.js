/**
 * ipPrivacy.test.js — A+ #5 (pseudonymous ID/IP logging policy regression pin).
 *
 * Locks the IP half of docs/PRIVACY_LOGGING.md: raw IP addresses are TRANSIENT
 * only (rate-limit key, bot-rejection log line, country lookup) and are NEVER
 * persisted to an analytics/telemetry row. The fingerprint half is locked by
 * tests/lib/structuralFingerprint.test.js.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');

// Strip SQL/JS comments so a column NAMED in a comment doesn't false-trip.
function stripSql(s) {
  return s.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

describe('#5 — analytics schema never persists a raw IP address', () => {
  // The analytics/telemetry/research migrations (036+). A raw-IP column would be
  // an `inet` type or a column named like an address.
  const analyticsMigrations = readdirSync(MIGRATIONS)
    .filter((f) => /^(0[3-9][0-9]|[1-9][0-9]{2})_.*\.sql$/.test(f) && Number(f.slice(0, 3)) >= 36);

  it('there are analytics migrations to inspect (pin not vacuous)', () => {
    expect(analyticsMigrations.length).toBeGreaterThanOrEqual(4);
  });

  it('no analytics migration declares an inet column or a raw-IP column', () => {
    const offenders = [];
    for (const f of analyticsMigrations) {
      const sql = stripSql(readFileSync(join(MIGRATIONS, f), 'utf8'));
      // `inet`/`cidr` postgres types, or a column named for an address.
      if (/\b(inet|cidr)\b/i.test(sql)) offenders.push(`${f}: inet/cidr type`);
      if (/\b(ip_address|client_ip|raw_ip|remote_ip|user_ip)\b/i.test(sql)) offenders.push(`${f}: raw-ip column`);
    }
    expect(offenders, `analytics migrations persisting raw IP: ${JSON.stringify(offenders)}`).toEqual([]);
  });
});

describe('#5 — ingest-events persists coarse country, not raw IP', () => {
  const src = readFileSync(join(ROOT, 'supabase', 'functions', 'ingest-events', 'index.ts'), 'utf8');

  it('derives and persists a 2-letter country code (coarse geo)', () => {
    expect(src).toMatch(/cf-ipcountry|x-vercel-ip-country/);
    expect(src).toMatch(/\bcountry\b/);
  });

  it('does not bind raw IP into a persisted row (ip is a transient rate-limit key only)', () => {
    // The ONLY legitimate ip use is the rate-limit bucket key `ip:${meta.ip}`.
    // A persisted-row binding would look like `ip: meta.ip` (object property) or
    // an `ip` column assignment — neither may appear.
    expect(src).not.toMatch(/\bip\s*:\s*meta\.ip/);
    expect(src).not.toMatch(/['"]ip['"]\s*:\s*meta\.ip/);
    // Sanity: the transient rate-limit key form IS present (so the negative
    // assertions above aren't passing simply because meta.ip vanished).
    expect(src).toMatch(/`ip:\$\{meta\.ip\}`/);
  });
});
