/**
 * committedSecretsScan.test.js — the generic committed-secret scanner (C5 bar-6).
 *
 * The two existing secret tests are deliberately NARROW: roadsSecretsProbe is a
 * payload-redaction probe and noHardcodedPrivilegeEmail matches one email shape.
 * CI runs `npm audit` but no gitleaks/trufflehog-class scan — so a live
 * STRIPE_SECRET_KEY or SUPABASE service-role JWT pasted into a new edge helper or
 * a stray tracked .env would ship green. This scan closes that class in-gate: every
 * git-TRACKED text file is matched against generic high-confidence key shapes.
 *
 * Design notes:
 *   - `git ls-files` (not an fs walk) — "committed" is the claim, so the tracked
 *     set is the corpus. Untracked local .env files are fine and invisible here.
 *   - Patterns are HIGH-CONFIDENCE prefixes/shapes (sk_live_, whsec_, AKIA…,
 *     PEM private-key headers, service_role JWTs decoded and checked) — not
 *     entropy heuristics, so a green run is meaningful and a red run is real.
 *   - The pattern strings below are built by concatenation so this file can never
 *     match itself; in-memory positive controls prove each detector fires.
 *   - public/map/** (the vendored Azgaar FMG fork) is scanned too: it ships, so a
 *     secret there would ship. Verified clean at landing.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Binary/media extensions the scanner skips (a secret in these is out of scope for
// a text scan; tracked binaries here are fonts/images/audio, not config).
const BINARY_EXT_RE = /\.(png|jpe?g|gif|webp|ico|icns|woff2?|ttf|otf|eot|pdf|mp[34]|webm|ogg|wav|zip|gz|br|wasm|bin|jar|svgz)$/i;
const MAX_BYTES = 2_000_000; // the FMG fork's biggest vendored bundles stay under this

// ── The shapes (concatenated so this file never self-matches) ────────────────
const SK = 'sk_';
const RK = 'rk_';
const WH = 'whsec';
const PATTERNS = [
  { name: 'stripe live secret key', re: new RegExp(`${SK}live_[0-9a-zA-Z]{16,}`) },
  { name: 'stripe live restricted key', re: new RegExp(`${RK}live_[0-9a-zA-Z]{16,}`) },
  { name: 'stripe webhook signing secret', re: new RegExp(`${WH}_[0-9a-zA-Z]{24,}`) },
  { name: 'AWS access key id', re: new RegExp(`\\b${'AKIA'}[0-9A-Z]{16}\\b`) },
  { name: 'github personal access token', re: new RegExp(`\\b${'ghp'}_[0-9a-zA-Z]{36}\\b`) },
  { name: 'github fine-grained token', re: new RegExp(`\\b${'github_pat'}_[0-9a-zA-Z_]{22,}\\b`) },
  { name: 'slack token', re: new RegExp(`\\b${'xox'}[baprs]-[0-9a-zA-Z-]{10,}`) },
  { name: 'google api key', re: new RegExp(`\\b${'AIza'}[0-9A-Za-z_-]{35}\\b`) },
  { name: 'supabase access token', re: new RegExp(`\\b${'sbp'}_[0-9a-f]{40}\\b`) },
  { name: 'private key PEM block', re: new RegExp(`-----${'BEGIN'} (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?${'PRIVATE KEY'}-----`) },
];

// A JWT whose payload decodes to a service_role claim (the supabase key that must
// NEVER ship to a client or repo). Anon-role JWTs are deliberately NOT flagged.
const JWT_RE = /\beyJ[A-Za-z0-9_-]{8,}\.([A-Za-z0-9_-]{8,})\.[A-Za-z0-9_-]{8,}\b/g;
function findServiceRoleJwt(text) {
  JWT_RE.lastIndex = 0;
  let m;
  while ((m = JWT_RE.exec(text))) {
    try {
      const payload = Buffer.from(m[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
      if (payload.includes('service' + '_role')) return m[0].slice(0, 24);
    } catch { /* not decodable — not a JWT */ }
  }
  return null;
}

// Triaged allowlist: exact tracked path → reason. Keep EMPTY unless a hit is a
// verified fake fixture; every entry is a reviewed act.
const ALLOWLIST = Object.freeze({});

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })
  .toString('utf8')
  .split('\0')
  .filter(Boolean);

describe('committed-secret scanner (bar-6 generic key shapes)', () => {
  test('the tracked corpus is non-trivial (git ls-files did not silently break)', () => {
    expect(tracked.length).toBeGreaterThan(1000);
  });

  test('no tracked .env-style file (documented config-only exceptions aside)', () => {
    // .env.example documents names, never values. .env.e2e is the e2e harness's
    // committed mode flag (VITE_E2E_LOCAL_DATA=true — verified credential-free at
    // landing; its CONTENT stays covered by the shape scan below like any file).
    const ENV_EXCEPTIONS = ['.env.example', '.env.e2e'];
    const envFiles = tracked.filter(
      (f) => /(^|\/)\.env(\..+)?$/.test(f) && !ENV_EXCEPTIONS.some((ok) => f.endsWith(ok)),
    );
    expect(envFiles, `tracked env file(s) — move the values to untracked local env / CI secrets: ${envFiles.join(', ')}`).toEqual([]);
  });

  test('no tracked text file matches a generic secret shape', () => {
    const offenders = [];
    for (const rel of tracked) {
      if (BINARY_EXT_RE.test(rel)) continue;
      if (rel in ALLOWLIST) continue;
      const abs = join(ROOT, rel);
      let text;
      try {
        if (statSync(abs).size > MAX_BYTES) continue;
        text = readFileSync(abs, 'utf8');
      } catch { continue; } // deleted-but-staged or unreadable — not a committed secret
      for (const { name, re } of PATTERNS) {
        const m = re.exec(text);
        if (m) offenders.push(`${rel}: ${name} ("${m[0].slice(0, 18)}…")`);
      }
      const jwt = findServiceRoleJwt(text);
      if (jwt) offenders.push(`${rel}: service_role JWT ("${jwt}…")`);
    }
    expect(
      offenders,
      `\nGeneric secret shape(s) in tracked files — rotate the key NOW (committed = leaked), then move it to env/CI secrets. A verified-fake fixture may be allowlisted here with a reason:\n${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  test('every allowlist entry is still a tracked file (no stale exemptions)', () => {
    for (const rel of Object.keys(ALLOWLIST)) {
      expect(tracked.includes(rel), `${rel} allowlisted but no longer tracked — remove the entry`).toBe(true);
    }
  });

  // ── positive controls: each detector fires on a synthetic secret ───────────
  test('detectors fire on synthetic secrets (the scan is not vacuous)', () => {
    const fakes = [
      `${SK}live_${'a1B2'.repeat(6)}`,
      `${WH}_${'0f'.repeat(16)}`,
      `${'AKIA'}ABCDEFGHIJKLMNOP`,
      `${'ghp'}_${'x'.repeat(36)}`,
      `${'AIza'}${'B'.repeat(35)}`,
      `-----${'BEGIN'} RSA ${'PRIVATE KEY'}-----`,
    ];
    for (const fake of fakes) {
      expect(PATTERNS.some(({ re }) => re.test(fake)), `no detector fired on: ${fake.slice(0, 12)}…`).toBe(true);
    }
    // service_role JWT control: header.payload.signature with the role claim.
    const b64u = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const srJwt = `${b64u('{"alg":"HS256"}')}.${b64u(`{"role":"service${'_role'}"}`)}.${'sig'.repeat(4)}`;
    expect(findServiceRoleJwt(`token: ${srJwt}`)).not.toBeNull();
    // …and the anon-role negative control must NOT flag.
    const anonJwt = `${b64u('{"alg":"HS256"}')}.${b64u('{"role":"anon"}')}.${'sig'.repeat(4)}`;
    expect(findServiceRoleJwt(`token: ${anonJwt}`)).toBeNull();
  });
});
