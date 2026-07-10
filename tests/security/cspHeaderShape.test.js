/**
 * tests/security/cspHeaderShape.test.js
 *
 * Pins the shape of the security-header block in vercel.json. Two properties the
 * header block MUST hold:
 *
 *   1. Report-only rollout. The Content-Security-Policy ships as
 *      `Content-Security-Policy-Report-Only` — it REPORTS violations to the
 *      /api/csp-report sink but does NOT block, so it cannot break the live app on
 *      day one. This test asserts the report-only key is present on every rule AND
 *      that the ENFORCING `Content-Security-Policy` key is absent (so a careless
 *      edit can't silently flip the whole site into enforcement). The enforce flip
 *      is a deliberate future rename (see api/csp-report.js § ROLLOUT).
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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));

// We ship report-only first; the enforce flip renames this key to
// 'content-security-policy'. The whole test keys off the report-only header.
const CSP_KEY = 'content-security-policy-report-only';
const CSP_ENFORCE_KEY = 'content-security-policy';

/** All header rules whose `source` regex matches `path`. */
const matchingRules = (path) =>
  vercel.headers.filter((rule) => new RegExp('^' + rule.source + '$').test(path));

/** Every report-only CSP value emitted for `path` (Vercel emits one per rule). */
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

describe('CSP ships REPORT-ONLY, not enforcing (safe rollout)', () => {
  it('every header rule uses Content-Security-Policy-Report-Only', () => {
    expect(vercel.headers.length).toBeGreaterThan(0);
    for (const rule of vercel.headers) {
      const keys = rule.headers.map((h) => h.key.toLowerCase());
      expect(keys, `${rule.source} must carry a report-only CSP`).toContain(CSP_KEY);
    }
  });

  it('no rule enforces a Content-Security-Policy (the enforce flip is deliberate + future)', () => {
    for (const rule of vercel.headers) {
      const keys = rule.headers.map((h) => h.key.toLowerCase());
      expect(keys, `${rule.source} must NOT enforce CSP yet`).not.toContain(CSP_ENFORCE_KEY);
    }
  });

  it('the report-only CSP wires the /api/csp-report sink (report-uri + report-to)', () => {
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

  it('the /map/ rule still carries the shared security headers (HSTS, nosniff, etc.)', () => {
    const [mapRule] = matchingRules('/map/index.html');
    const keys = mapRule.headers.map((h) => h.key.toLowerCase());
    for (const required of [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options',
      'referrer-policy',
      'permissions-policy',
    ]) {
      expect(keys, `/map/ rule must set ${required}`).toContain(required);
    }
  });
});

describe('vercel.json keeps the SPA + gallery rewrites intact', () => {
  it('preserves the gallery-meta prerender rewrite and the SPA catch-all', () => {
    const dests = vercel.rewrites.map((r) => r.destination);
    expect(dests).toContain('/api/gallery-meta?slug=:slug');
    expect(dests).toContain('/index.html');
  });
});
