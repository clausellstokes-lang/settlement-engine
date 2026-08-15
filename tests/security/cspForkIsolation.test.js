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
 * NOTE: the live embedded map (unsafe-inline/eval actually loading FMG) still
 * needs browser verification. This test pins the enforcing header shape and the
 * two-sided origin contract, not the runtime rendering.
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
 * Every enforcing CSP value emitted for `path` (Vercel emits one per rule).
 */
const CSP_KEY = /^content-security-policy$/;
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

  it('the /map/ rule keeps shared hardening without a conflicting X-Frame-Options', () => {
    // Excluding /map/ from the app-default rule means /map/ no longer inherits
    // the baseline hardening headers — so the /map/ rule must set them itself.
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
    expect(keys).not.toContain('x-frame-options');
  });
});

// ── Fix 2: every child send path shares one exact parent origin ───────────────
describe('map-child postMessage is exact-origin and fail-closed', () => {
  const originSrc = readFileSync(join(ROOT, 'public/map/sf-origin.js'), 'utf8');
  const bridgeSrc = readFileSync(join(ROOT, 'public/map/sf-bridge.js'), 'utf8');
  const mainSrc = readFileSync(join(ROOT, 'public/map/main.js'), 'utf8');
  const indexSrc = readFileSync(join(ROOT, 'public/map/index.html'), 'utf8');

  it('has no postMessage call that targets the "*" wildcard origin', () => {
    const childSurface = `${originSrc}\n${bridgeSrc}\n${mainSrc}`;
    expect(childSurface).not.toMatch(/postMessage\s*\([^)]*,\s*['"]\*['"]\s*\)/);
  });

  it('accepts an explicit parentOrigin and limits missing-value fallback to loopback', () => {
    expect(originSrc).toMatch(/getAll\(['"]parentOrigin['"]\)/);
    expect(originSrc).toMatch(/if\s*\(!isLoopbackHostname\(window\.location\.hostname\)\)\s*return null/);
    expect(originSrc).toMatch(/window\.parent\.postMessage\(message,\s*parentOrigin\)/);
  });

  it('sf-bridge validates both the configured origin and the embedding WindowProxy', () => {
    expect(bridgeSrc).toMatch(/event\.origin\s*!==\s*parentOrigin/);
    expect(bridgeSrc).toMatch(/event\.source\s*!==\s*window\.parent/);
  });

  it('the FMG-native drop path delegates to the same origin contract', () => {
    expect(mainSrc).toMatch(/__sfBridgeOrigin/);
    expect(mainSrc).toMatch(/__sfOriginContract\.postToParent\(msg\)/);
  });

  it('loads the origin contract before main.js and sf-bridge.js', () => {
    const originAt = indexSrc.indexOf('src="sf-origin.js');
    const mainAt = indexSrc.indexOf('src="main.js');
    const bridgeAt = indexSrc.indexOf('src="sf-bridge.js');
    expect(originAt).toBeGreaterThan(-1);
    expect(originAt).toBeLessThan(mainAt);
    expect(mainAt).toBeLessThan(bridgeAt);
  });
});
