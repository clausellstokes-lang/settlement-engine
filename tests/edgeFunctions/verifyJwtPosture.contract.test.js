/**
 * verifyJwtPosture.contract.test.js — kills the verify_jwt split-brain.
 *
 * Two sources used to independently decide each edge function's verify_jwt gate:
 *   • supabase/config.toml   ([functions.X] verify_jwt = false)
 *   • scripts/deploy.sh      (a hardcoded --no-verify-jwt per `functions deploy`)
 * They disagreed: create-checkout was deployed --no-verify-jwt with NO config
 * entry (so a re-deploy from config would flip it), and verify-checkout-session
 * was never in deploy.sh at all.
 *
 * The fix makes config.toml the SINGLE SOURCE OF TRUTH and has deploy.sh DERIVE
 * its flag by parsing config.toml, over an auto-discovered function list. This
 * contract pins that: (a) config declares exactly the intended anon set, and
 * (b) deploy.sh no longer carries a hardcoded per-function flag list — so the
 * two can never drift again.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const CONFIG = join(ROOT, 'supabase', 'config.toml');
const DEPLOY = join(ROOT, 'scripts', 'deploy.sh');
const FUNCTIONS_DIR = join(ROOT, 'supabase', 'functions');

/** Names of functions pinned `verify_jwt = false` in config.toml. */
function configAnonFunctions(toml) {
  const anon = new Set();
  // Split on [ … ] section headers, keep the header + its body.
  const re = /\[functions\.([a-z0-9-]+)\]([\s\S]*?)(?=\n\[|\s*$)/gi;
  let m;
  while ((m = re.exec(toml))) {
    if (/verify_jwt\s*=\s*false/.test(m[2])) anon.add(m[1]);
  }
  return anon;
}

// The reviewed, intended posture. verify_jwt = false ONLY for functions that are
// authenticated by something OTHER than a Supabase user JWT.
const INTENDED_ANON = new Set([
  'stripe-webhook',        // authenticated by the Stripe signature header
  'verify-single-dossier', // anon buyers; the Stripe session id is the trust anchor
  'ingest-events',         // anonymous analytics; device token is a body field
  'log-client-error',      // anon crash sink; sendBeacon cannot set a JWT header
  'analytics-export',      // cron pg_net; x-export-secret shared secret, not a JWT
  'pricing-resync-cron',   // cron pg_net; x-cron-secret shared secret, not a JWT
  'send-email',            // anon cap_warning path behind a per-IP/recipient rate limit
  'auth-recovery',         // logged-out password recovery; the caller has no JWT
]);
// Everything else must be JWT-gated (platform default), notably:
const INTENDED_JWT = [
  'create-checkout',          // supabase-js sends the anon key (a valid JWT) even for anon single-dossier
  'verify-checkout-session',  // requires Authorization: Bearer <supabase JWT>
  'generate-narrative', 'generate-chronicle', 'admin-actions', 'account-actions',
  'create-customer-portal',
];

describe('verify_jwt posture — config.toml is the single source of truth', () => {
  const toml = readFileSync(CONFIG, 'utf8');

  it('config.toml pins verify_jwt=false for exactly the intended anon set', () => {
    const anon = configAnonFunctions(toml);
    expect([...anon].sort()).toEqual([...INTENDED_ANON].sort());
  });

  it('JWT-gated functions are NOT pinned false (they rely on the platform default)', () => {
    const anon = configAnonFunctions(toml);
    for (const fn of INTENDED_JWT) {
      expect(anon.has(fn), `${fn} must be JWT-gated`).toBe(false);
    }
  });

  it('every edge function directory is a real function (has index.ts)', () => {
    // deploy.sh auto-discovers from this directory, so a stray dir would be a
    // broken deploy target. _shared is the only non-function entry.
    for (const entry of readdirSync(FUNCTIONS_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === '_shared') continue;
      expect(existsSync(join(FUNCTIONS_DIR, entry.name, 'index.ts')),
        `${entry.name}/index.ts missing`).toBe(true);
    }
  });
});

describe('verify_jwt posture — deploy.sh derives, never hardcodes', () => {
  const deploy = readFileSync(DEPLOY, 'utf8');

  it('deploy.sh has NO hardcoded per-function --no-verify-jwt flag', () => {
    // The split-brain was a second, hand-maintained list. It must be gone: no
    // `functions deploy <name> … --no-verify-jwt` literal survives.
    const hardcoded = deploy.match(/functions\s+deploy\s+[a-z0-9-]+[^\n]*--no-verify-jwt/gi);
    expect(hardcoded).toBeNull();
  });

  it('deploy.sh derives the flag by parsing config.toml', () => {
    expect(deploy).toMatch(/config\.toml/);
    expect(deploy).toMatch(/verify_jwt\s*=\s*false|verify_jwt=false/); // the parse target
    expect(deploy).toMatch(/--no-verify-jwt/);                          // emitted, once, from the parse
    // Auto-discovers functions instead of naming them one by one.
    expect(deploy).toMatch(/supabase\/functions\/\*\//);
    expect(deploy).toMatch(/index\.ts/); // skips non-function dirs
  });
});
