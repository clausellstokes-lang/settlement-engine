/**
 * tests/security/cspForkIsolation.test.js
 *
 * Locks the CSP isolation between the app origin and the vendored FMG map fork,
 * plus the fail-closed postMessage target in the map bridge. Two review findings
 * are pinned here so neither can silently regress:
 *
 *   1. The relaxed CSP (unsafe-inline + unsafe-eval, needed by the ~1.4k-line FMG
 *      fork) must apply to `/map/*` AND ONLY `/map/*`. The app-default header
 *      rule must NOT also match `/map/*` paths — otherwise Vercel emits TWO
 *      Content-Security-Policy headers for a map request and the browser enforces
 *      their INTERSECTION (the strict app policy), silently breaking the map. So
 *      the app rule's `source` carries a negative lookahead excluding `map/`, and
 *      every path resolves to exactly ONE CSP header. The app CSP keeps a
 *      locked-down script-src (no unsafe-inline / unsafe-eval); the /map/ CSP is
 *      the relaxed one.
 *
 *   2. public/map/sf-bridge.js must NEVER postMessage to a '*' target. If the
 *      parent origin can't be resolved to a concrete http(s) origin, the bridge
 *      refuses to post (fail closed) rather than broadcasting to any origin.
 *
 * NOTE: the live embedded map (unsafe-inline/eval actually loading FMG) needs
 * MANUAL browser verification — this test only pins the HEADER shape and the
 * bridge's origin logic, not the runtime rendering.
 *
 * LINEAGE NOTE (master merge): this lineage ships the policy as
 * Content-Security-Policy-Report-Only — the documented rollout posture
 * (api/csp-report.js: report-only first, flip to enforce on the OWNER punch
 * list once the report stream is quiet). The isolation invariants pinned here
 * are identical under either key, so the matcher accepts both spellings; when
 * the owner flips to enforcement, this test keeps passing unchanged.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));

/** All header rules whose `source` regex matches `path`. */
const matchingRules = (path) =>
  vercel.headers.filter((rule) => new RegExp('^' + rule.source + '$').test(path));

/**
 * Every CSP header value emitted for `path` (Vercel emits one per matching rule).
 * Accepts the enforced key AND the Report-Only key (this lineage's rollout
 * posture — see the LINEAGE NOTE above); the isolation invariants are the same.
 */
const CSP_KEY = /^content-security-policy(-report-only)?$/;
const cspHeadersFor = (path) =>
  matchingRules(path).flatMap((rule) =>
    rule.headers
      .filter((h) => CSP_KEY.test(h.key.toLowerCase()))
      .map((h) => h.value),
  );

const directive = (csp, name) => {
  const m = csp.match(new RegExp(`(?:^|;)\\s*${name}\\s([^;]*)`));
  return m ? m[1].trim() : '';
};

describe('CSP fork isolation — app-strict vs /map/-relaxed, one header per path', () => {
  it('the app origin resolves to exactly ONE CSP header (no double-policy merge)', () => {
    // The critical property: a browser must not receive two conflicting CSPs and
    // enforce their intersection. Exactly one CSP header per app path.
    for (const path of ['/index.html', '/', '/assets/app.js', '/gallery']) {
      const csps = cspHeadersFor(path);
      expect(csps.length, `${path} must emit exactly one CSP header`).toBe(1);
    }
  });

  it('a /map/ path resolves to exactly ONE CSP header — the relaxed one, not two', () => {
    // This is the regression that breaks the map: if the app-default rule ALSO
    // matched /map/*, the browser would get the strict CSP alongside the relaxed
    // one and enforce the intersection, blocking unsafe-inline/eval.
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
    // The fork must not open a CDN script origin — vendored libs are local.
    expect(mapScript).not.toMatch(/unpkg|cdn/);
  });

  it('the app and map CSPs are genuinely different policies (isolation is real)', () => {
    const [appCsp] = cspHeadersFor('/index.html');
    const [mapCsp] = cspHeadersFor('/map/index.html');
    expect(appCsp).not.toBe(mapCsp);
  });

  it('the app-default header rule source explicitly excludes /map/ paths', () => {
    // Structural guard: the negative lookahead is what makes the isolation hold.
    // A tidy-up back to "/(.*)" would re-introduce the double-CSP merge.
    const appRule = matchingRules('/index.html').find((r) =>
      r.headers.some((h) => CSP_KEY.test(h.key.toLowerCase())),
    );
    expect(appRule.source).toMatch(/\(\?!.*map/);
    // And that same rule must NOT match a /map/ path.
    expect(new RegExp('^' + appRule.source + '$').test('/map/index.html')).toBe(false);
  });

  it('the /map/ rule still carries the shared security headers (HSTS, nosniff, etc.)', () => {
    // Excluding /map/ from the app-default rule means /map/ no longer inherits
    // the baseline hardening headers — so the /map/ rule must set them itself.
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

// ── Fix 2: sf-bridge.js never posts to '*' (fail closed on origin) ─────────────
describe('sf-bridge postMessage target is fail-closed (never "*")', () => {
  const src = readFileSync(join(ROOT, 'public/map/sf-bridge.js'), 'utf8');

  it('has no postMessage call that targets the "*" wildcard origin', () => {
    // A '*' target would broadcast bridge replies (which can carry map/campaign
    // data) to any origin holding a window reference.
    expect(src).not.toMatch(/postMessage\s*\([^)]*,\s*['"]\*['"]\s*\)/);
  });

  it('resolves the parent origin and refuses to post when it is unresolved', () => {
    // The bridge must fail closed: an opaque/file origin (empty or "null") or a
    // non-http(s) scheme yields no target, and postToParent returns without posting.
    expect(src).toMatch(/resolveParentOrigin/);
    expect(src).toMatch(/if\s*\(!targetOrigin\)/);
    // Only concrete http(s) origins are accepted as a target.
    expect(src).toMatch(/\/\^https\?:\\\/\\\//);
  });
});
