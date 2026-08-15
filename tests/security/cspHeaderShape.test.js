/**
 * tests/security/cspHeaderShape.test.js
 *
 * Pins the shape of the security-header block in vercel.json. Two properties the
 * header block MUST hold:
 *
 *   1. Enforced policy. Both origins ship `Content-Security-Policy`; violations
 *      are blocked and still reported to /api/csp-report. Report-only headers are
 *      forbidden so a configuration edit cannot silently demote the boundary.
 *
 *   2. Fork isolation — app-strict vs /map/-relaxed, ONE policy per path. The
 *      relaxed policy (unsafe-inline + unsafe-eval, needed by the vendored ~1.4k-line
 *      FMG map fork) must apply to `/map/*` AND ONLY `/map/*`. If the app-default
 *      rule also matched `/map/*`, Vercel would emit TWO CSP headers for a map
 *      request and the browser enforces their INTERSECTION (the strict app policy),
 *      silently breaking the map. So the app rule's `source` carries a negative
 *      lookahead excluding `map/`, and every path resolves to exactly ONE CSP header.
 *
 * NOTE: this pins the HEADER SHAPE only. The live embedded map + the real report
 * stream need MANUAL browser verification (this is a static-config assertion).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PRODUCTION_MAP_ORIGIN } from '../../src/lib/mapRuntimeConfig.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));

const CSP_KEY = 'content-security-policy';
const CSP_REPORT_ONLY_KEY = 'content-security-policy-report-only';

/** All header rules whose `source` regex matches `path`. */
const matchingRules = (path) =>
  vercel.headers.filter((rule) => new RegExp('^' + rule.source + '$').test(path));

/** Every enforcing CSP value emitted for `path` (Vercel emits one per rule). */
const cspHeadersFor = (path) =>
  matchingRules(path).flatMap((rule) =>
    rule.headers
      .filter((h) => h.key.toLowerCase() === CSP_KEY)
      .map((h) => h.value),
  );

const directive = (csp, name) => {
  const m = csp.match(new RegExp(`(?:^|;)\\s*${name}\\s([^;]*)`));
  return m ? m[1].trim() : '';
};

describe('CSP is enforced and continues reporting violations', () => {
  it('every header rule uses the enforcing Content-Security-Policy header', () => {
    expect(vercel.headers.length).toBeGreaterThan(0);
    for (const rule of vercel.headers) {
      const keys = rule.headers.map((h) => h.key.toLowerCase());
      expect(keys, `${rule.source} must carry an enforcing CSP`).toContain(CSP_KEY);
    }
  });

  it('no rule can silently demote the policy back to report-only', () => {
    for (const rule of vercel.headers) {
      const keys = rule.headers.map((h) => h.key.toLowerCase());
      expect(keys, `${rule.source} must not ship report-only CSP`).not.toContain(CSP_REPORT_ONLY_KEY);
    }
  });

  it('the enforcing CSP wires the /api/csp-report sink (report-uri + report-to)', () => {
    for (const path of ['/index.html', '/map/index.html']) {
      const [csp] = cspHeadersFor(path);
      expect(csp).toMatch(/report-uri \/api\/csp-report/);
      expect(csp).toMatch(/report-to csp-endpoint/);
    }
    // Reporting-Endpoints declares the report-to group both rules reference.
    for (const rule of vercel.headers) {
      const reporting = rule.headers.find((h) => h.key.toLowerCase() === 'reporting-endpoints');
      expect(reporting, `${rule.source} must declare Reporting-Endpoints`).toBeTruthy();
      expect(reporting.value).toMatch(/csp-endpoint="\/api\/csp-report"/);
    }
  });
});

describe('CSP fork isolation — app-strict vs /map/-relaxed, one header per path', () => {
  it('the app origin resolves to exactly ONE CSP header (no double-policy merge)', () => {
    for (const path of ['/index.html', '/', '/assets/app.js', '/gallery']) {
      const csps = cspHeadersFor(path);
      expect(csps.length, `${path} must emit exactly one CSP header`).toBe(1);
    }
  });

  it('a /map/ path resolves to exactly ONE CSP header — the relaxed one, not two', () => {
    for (const path of ['/map/index.html', '/map/main.js', '/map/libs/jquery.js']) {
      const csps = cspHeadersFor(path);
      expect(csps.length, `${path} must emit exactly one CSP header (relaxed only)`).toBe(1);
      expect(csps[0], `${path} must get the relaxed fork CSP`).toMatch(/'unsafe-inline'/);
      expect(csps[0]).toMatch(/'unsafe-eval'/);
    }
  });

  it('the app CSP script-src is locked down (no unsafe-inline / no unsafe-eval)', () => {
    const [appCsp] = cspHeadersFor('/index.html');
    const appScript = directive(appCsp, 'script-src');
    expect(appScript, 'app script-src must exist').toBeTruthy();
    expect(appScript).not.toMatch(/'unsafe-inline'/);
    expect(appScript).not.toMatch(/'unsafe-eval'/);
    expect(appScript).toMatch(/'self'/);
  });

  it('the /map/ CSP script-src is the relaxed fork policy (unsafe-inline + unsafe-eval)', () => {
    const [mapCsp] = cspHeadersFor('/map/index.html');
    const mapScript = directive(mapCsp, 'script-src');
    expect(mapScript).toMatch(/'unsafe-inline'/); // FMG inline on*= handlers
    expect(mapScript).toMatch(/'unsafe-eval'/); // d3-dsv new Function
    expect(mapScript).not.toMatch(/unpkg|cdn/); // vendored libs are local
  });

  it('the app and map CSPs are genuinely different policies (isolation is real)', () => {
    const [appCsp] = cspHeadersFor('/index.html');
    const [mapCsp] = cspHeadersFor('/map/index.html');
    expect(appCsp).not.toBe(mapCsp);
  });

  it('the app-default header rule source explicitly excludes /map/ paths', () => {
    const appRule = matchingRules('/index.html').find((r) =>
      r.headers.some((h) => h.key.toLowerCase() === CSP_KEY),
    );
    expect(appRule.source).toMatch(/\(\?!.*map/);
    expect(new RegExp('^' + appRule.source + '$').test('/map/index.html')).toBe(false);
  });

  it('the /map/ rule keeps shared hardening but omits same-origin X-Frame-Options', () => {
    const [mapRule] = matchingRules('/map/index.html');
    const keys = mapRule.headers.map((h) => h.key.toLowerCase());
    for (const required of [
      'strict-transport-security',
      'x-content-type-options',
      'referrer-policy',
      'permissions-policy',
    ]) {
      expect(keys, `/map/ rule must set ${required}`).toContain(required);
    }
    // X-Frame-Options has no syntax for an explicit cross-origin allowlist.
    // The enforced frame-ancestors directive is the map host's sole authority.
    expect(keys).not.toContain('x-frame-options');
  });
});

describe('CSP permits exactly the intended cross-origin map topology', () => {
  it('the app frame-src contains the same production map origin as runtime config', () => {
    const [appCsp] = cspHeadersFor('/index.html');
    expect(directive(appCsp, 'frame-src').split(/\s+/)).toContain(PRODUCTION_MAP_ORIGIN);
  });

  it('the map may be framed only by the two production app hosts', () => {
    const [mapCsp] = cspHeadersFor('/map/index.html');
    const ancestors = directive(mapCsp, 'frame-ancestors').split(/\s+/);
    expect(ancestors).toEqual([
      'https://settlementforge.com',
      'https://www.settlementforge.com',
    ]);
  });

  it('production app hosts cannot execute the fork from their own /map/ path', () => {
    const productionHosts = new Set(['settlementforge.com', 'www.settlementforge.com']);
    const redirects = (vercel.redirects || []).filter(
      (rule) => rule.source === '/map/:path*'
        && rule.destination === `${PRODUCTION_MAP_ORIGIN}/map/:path*`,
    );
    const redirectedHosts = new Set(
      redirects.flatMap((rule) => rule.has || [])
        .filter((condition) => condition.type === 'host')
        .map((condition) => condition.value),
    );

    expect(redirectedHosts).toEqual(productionHosts);
    expect(redirects.every((rule) => rule.permanent === false)).toBe(true);
  });
});

describe('CSP admits the Wave-D Turnstile widget (challenges.cloudflare.com)', () => {
  // The human-verification widget (docs/PERIMETER_RUNBOOK.md, item 7) loads a
  // script from + renders a frame served by challenges.cloudflare.com. The
  // allowance is STATIC + flag-independent (harmless while inert — nothing
  // requests the host until the perimeterCaptcha flag + keys are set), and lives
  // on the APP block ONLY. This pin locks it so a careless CSP edit can't silently
  // drop it (which would break the widget the instant the owner activates it).
  const TURNSTILE = 'https://challenges.cloudflare.com';

  it('the app script-src admits challenges.cloudflare.com', () => {
    const [appCsp] = cspHeadersFor('/index.html');
    expect(directive(appCsp, 'script-src')).toContain(TURNSTILE);
  });

  it('the app frame-src admits challenges.cloudflare.com', () => {
    const [appCsp] = cspHeadersFor('/index.html');
    expect(directive(appCsp, 'frame-src')).toContain(TURNSTILE);
  });

  it('the allowance does NOT leak into the /map/ fork policy', () => {
    // The map fork is a separate policy; the Turnstile widget never renders there,
    // so the allowance stays scoped to the app block (no policy widening for /map/).
    const [mapCsp] = cspHeadersFor('/map/index.html');
    expect(directive(mapCsp, 'script-src')).not.toContain(TURNSTILE);
    expect(directive(mapCsp, 'frame-src')).not.toContain(TURNSTILE);
  });
});

describe('vercel.json keeps the SPA + gallery rewrites intact', () => {
  it('preserves the gallery-meta prerender rewrite and the SPA catch-all', () => {
    const dests = vercel.rewrites.map((r) => r.destination);
    expect(dests).toContain('/api/gallery-meta?slug=:slug');
    expect(dests).toContain('/index.html');
  });
});
