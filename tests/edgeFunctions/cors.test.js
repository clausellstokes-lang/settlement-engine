/**
 * tests/edgeFunctions/cors.test.js — behavioral contract for the SHARED edge
 * CORS allowlist (supabase/functions/_shared/cors.ts).
 *
 * Unlike contracts.test.js (static source inspection), this suite imports the
 * helper and exercises the actual origin decision. It is the regression guard
 * for the bug that motivated the shared module: the Cloudflare Pages preview
 * origin was NOT allowed by any per-function inline list, so cross-origin edge
 * calls (the narrative stream, etc.) CORS-failed when tested on a preview
 * deploy. The pages.dev-suffix test below FAILS against the old inline
 * allowlists and PASSES with the shared helper.
 *
 * The helper guards `Deno.env.get` behind a `typeof Deno` check, so it imports
 * cleanly under vitest (Node) with no Deno globals.
 */

import { describe, it, expect } from 'vitest';
import {
  getCorsHeaders,
  isAllowedOrigin,
  resolveAllowedOrigin,
} from '../../supabase/functions/_shared/cors.ts';

/** Build a minimal Request-like object carrying just an Origin header. */
function reqWithOrigin(origin) {
  return { headers: { get: (name) => (name === 'Origin' && origin ? origin : null) } };
}

describe('shared edge CORS — Cloudflare Pages preview (the motivating bug)', () => {
  it('echoes an https Cloudflare Pages branch/preview subdomain origin', () => {
    const origin = 'https://refine-ui-ux.settlement-engine.pages.dev';
    expect(isAllowedOrigin(origin)).toBe(true);
    const headers = getCorsHeaders(reqWithOrigin(origin), { methods: 'POST, OPTIONS' });
    expect(headers['Access-Control-Allow-Origin']).toBe(origin);
    expect(headers['Vary']).toBe('Origin');
  });

  it('echoes a hashed preview subdomain (Pages assigns a fresh host per deploy)', () => {
    const origin = 'https://a1b2c3d4.settlement-engine.pages.dev';
    expect(resolveAllowedOrigin(reqWithOrigin(origin))).toBe(origin);
  });

  it('rejects http (non-https) Pages origins — the suffix match is https-only', () => {
    expect(isAllowedOrigin('http://preview.settlement-engine.pages.dev')).toBe(false);
  });

  it('rejects a spoofed suffix that is not actually a .pages.dev subdomain', () => {
    // The classic confused-suffix attack: the real host ends in
    // attacker.com, not pages.dev.
    expect(isAllowedOrigin('https://evil-settlement-engine.pages.dev.attacker.com')).toBe(false);
  });

  it('rejects a lookalike registrable domain (settlement-engine.pages.dev.evil.com)', () => {
    expect(isAllowedOrigin('https://settlement-engine.pages.dev.evil.com')).toBe(false);
  });
});

describe('shared edge CORS — explicit hosts and localhost', () => {
  it('allows the production apex + www + vercel hosts', () => {
    expect(isAllowedOrigin('https://settlementforge.com')).toBe(true);
    expect(isAllowedOrigin('https://www.settlementforge.com')).toBe(true);
    expect(isAllowedOrigin('https://settlementwork.vercel.app')).toBe(true);
  });

  it('allows any http://localhost:<port> on a DEV deployment (no CLIENT_URL configured)', () => {
    // Under vitest no Deno env exists, so CLIENT_URL is unset ⇒ dev deployment.
    expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
    expect(isAllowedOrigin('http://localhost:4321')).toBe(true);
    expect(isAllowedOrigin('http://localhost:9999')).toBe(true);
  });

  it('does NOT allow https localhost or a localhost-lookalike host', () => {
    expect(isAllowedOrigin('https://localhost:5173')).toBe(false);
    expect(isAllowedOrigin('http://localhost.attacker.com')).toBe(false);
  });
});

describe('shared edge CORS — the localhost rule is DEV-only, never production', () => {
  /** Stub the Deno env seam the helper reads (readEnv guards on globalThis.Deno). */
  function withDenoEnv(env, fn) {
    globalThis.Deno = { env: { get: (name) => env[name] || '' } };
    try { fn(); } finally { delete globalThis.Deno; }
  }

  it('REJECTS http://localhost:<port> when CLIENT_URL declares a production deploy', () => {
    withDenoEnv({ CLIENT_URL: 'https://settlementforge.com' }, () => {
      expect(isAllowedOrigin('http://localhost:5173')).toBe(false);
      expect(isAllowedOrigin('http://localhost:9999')).toBe(false);
      // Production hosts stay allowed, of course.
      expect(isAllowedOrigin('https://settlementforge.com')).toBe(true);
    });
  });

  it('still allows localhost when CLIENT_URL itself points at localhost (dev stack)', () => {
    withDenoEnv({ CLIENT_URL: 'http://localhost:5173' }, () => {
      expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
      expect(isAllowedOrigin('http://localhost:4321')).toBe(true);   // any port, not just CLIENT_URL's
    });
  });

  it('ALLOWED_ORIGINS is the explicit escape hatch for a localhost origin in production', () => {
    withDenoEnv({
      CLIENT_URL: 'https://settlementforge.com',
      ALLOWED_ORIGINS: 'http://localhost:5173',
    }, () => {
      expect(isAllowedOrigin('http://localhost:5173')).toBe(true);   // explicitly listed
      expect(isAllowedOrigin('http://localhost:9999')).toBe(false);  // the blanket rule stays off
    });
  });
});

describe('shared edge CORS — fail closed (never wildcard)', () => {
  it('never emits "*" for a disallowed origin; pins to the first allowed host', () => {
    const headers = getCorsHeaders(reqWithOrigin('https://evil.example.com'), {
      methods: 'POST, OPTIONS',
    });
    expect(headers['Access-Control-Allow-Origin']).not.toBe('*');
    expect(headers['Access-Control-Allow-Origin']).toBe('https://settlementforge.com');
    // Disallowed origins do not get a Vary: Origin (we did not reflect them).
    expect(headers['Vary']).toBeUndefined();
  });

  it('treats a missing Origin as same-origin (pins to first host, no "*")', () => {
    const headers = getCorsHeaders(reqWithOrigin(''), { methods: 'POST, OPTIONS' });
    expect(headers['Access-Control-Allow-Origin']).toBe('https://settlementforge.com');
    expect(headers['Access-Control-Allow-Origin']).not.toBe('*');
  });

  it('never emits "*" regardless of input (the old ingest-events/send-email leak)', () => {
    for (const origin of ['', 'https://settlementforge.com', 'https://evil.example.com']) {
      expect(getCorsHeaders(reqWithOrigin(origin))['Access-Control-Allow-Origin']).not.toBe('*');
    }
  });
});

describe('shared edge CORS — header shape preserved per caller', () => {
  it('omits Allow-Methods when the caller does not advertise any', () => {
    const headers = getCorsHeaders(reqWithOrigin('https://settlementforge.com'));
    expect(headers['Access-Control-Allow-Methods']).toBeUndefined();
    expect(headers['Access-Control-Allow-Headers']).toBe(
      'authorization, x-client-info, apikey, content-type',
    );
  });

  it('passes through the caller-specified Allow-Methods', () => {
    const headers = getCorsHeaders(reqWithOrigin('https://settlementforge.com'), {
      methods: 'POST, OPTIONS',
    });
    expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
  });
});
