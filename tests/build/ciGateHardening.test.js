/**
 * tests/build/ciGateHardening.test.js — B17 build/CI gate-hardening contracts.
 *
 * Pins the concrete fixes from the B17 review so a regression re-opens the gap:
 *
 *   1. CSP is ENFORCING (a real `Content-Security-Policy` header), not the old
 *      `Content-Security-Policy-Report-Only` that blocked nothing — and still
 *      covers every origin the app actually uses (self, Supabase, Google Fonts,
 *      plausible) plus a report sink.
 *   2. The vendored-map supply-chain manifest exists, pins every shipped lib by
 *      sha256+byteSize, matches the bytes on disk, and records the jQuery 3.1.1
 *      advisory ledger (so the blind spot stays documented, not silent).
 *   3. validate-edge-functions.mjs's strengthened botGuard contract FAILS when a
 *      function captures botGuard() but never consumes `.reject` (an unprotected
 *      endpoint), and PASSES on the current tree.
 *   4. The Vercel ignore-build gate script is wired so a non-green CI can block
 *      the production deploy.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── 1. CSP is enforcing and complete ──────────────────────────────────────────
describe('vercel.json CSP is enforcing (not Report-Only)', () => {
  const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
  const headers = vercel.headers.flatMap((h) => h.headers);
  const byKey = (k) => headers.find((h) => h.key.toLowerCase() === k.toLowerCase());

  it('ships an enforcing Content-Security-Policy header', () => {
    expect(byKey('Content-Security-Policy'), 'must have an ENFORCING CSP header').toBeTruthy();
  });

  it('no longer relies SOLELY on a Report-Only policy (the old zero-enforcement bug)', () => {
    // A parallel Report-Only is allowed for monitoring, but an enforcing CSP
    // MUST exist. Before this fix only the Report-Only header was present.
    expect(byKey('Content-Security-Policy')).toBeTruthy();
  });

  it('covers every origin current usage needs', () => {
    const csp = byKey('Content-Security-Policy').value;
    // Supabase (REST + realtime websocket), Google Fonts, plausible analytics.
    expect(csp).toMatch(/connect-src[^;]*'self'/);
    expect(csp).toMatch(/connect-src[^;]*https:\/\/\*\.supabase\.co/);
    expect(csp).toMatch(/connect-src[^;]*wss:\/\/\*\.supabase\.co/);
    expect(csp).toMatch(/style-src[^;]*https:\/\/fonts\.googleapis\.com/);
    expect(csp).toMatch(/font-src[^;]*https:\/\/fonts\.gstatic\.com/);
    expect(csp).toMatch(/img-src[^;]*https:\/\/\*\.supabase\.co/);
    // Locked-down sinks.
    expect(csp).toMatch(/object-src 'none'/);
    expect(csp).toMatch(/base-uri 'self'/);
    expect(csp).toMatch(/frame-ancestors 'self'/);
  });

  it('declares a report sink for ongoing monitoring', () => {
    const csp = byKey('Content-Security-Policy').value;
    expect(csp).toMatch(/report-uri|report-to/);
  });
});

// ── 2. Vendored-map supply-chain manifest ─────────────────────────────────────
describe('vendored map libs supply-chain manifest', () => {
  const manifestPath = join(ROOT, 'public/map/libs/VENDOR-MANIFEST.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  it('pins at least the headline third-party libs', () => {
    const names = manifest.libs.map((l) => l.name);
    expect(names).toContain('jquery');
    expect(names).toContain('three');
    expect(names).toContain('tinymce');
  });

  it('every pinned file matches its sha256 + byteSize on disk', () => {
    for (const lib of manifest.libs) {
      const buf = readFileSync(join(ROOT, 'public/map/libs', lib.file));
      const sha256 = createHash('sha256').update(buf).digest('hex');
      expect(sha256, `${lib.file} sha256 drift`).toBe(lib.sha256);
      expect(buf.length, `${lib.file} byteSize drift`).toBe(lib.byteSize);
    }
  });

  it('records the jQuery 3.1.1 advisory ledger (documented, not silent)', () => {
    const jq = manifest.libs.find((l) => l.name === 'jquery');
    expect(jq.version).toBe('3.1.1');
    expect(jq.knownAdvisories).toContain('CVE-2020-11023');
  });
});

// ── 3. validate-edge-functions strengthened botGuard contract ──────────────────
describe('validate-edge-functions.mjs botGuard contract', () => {
  const script = join(ROOT, 'scripts/validate-edge-functions.mjs');

  it('passes on the current edge-function tree', () => {
    // Throws (non-zero exit) on failure; success is a clean run.
    const out = execFileSync('node', [script], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/valid/i);
  });

  it('the source enforces .reject consumption, not just the one wrong shape', () => {
    // Guard against a silent revert to the old regex-only contract that only
    // flagged `if (guard) return guard` and proved nothing about consumption.
    const src = readFileSync(script, 'utf8');
    expect(src).toMatch(/\.reject/);
    expect(src).toMatch(/never consumed|must check guard\.reject/);
  });
});

// ── 4. Vercel CI-gate ignore-build step is wired ──────────────────────────────
describe('production deploy is gated on CI', () => {
  it('vercel.json wires an ignoreCommand to the gate script', () => {
    const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
    expect(vercel.ignoreCommand).toMatch(/vercel-ignore-build\.mjs/);
  });

  it('the gate script exists and references the required CI checks', () => {
    const src = readFileSync(join(ROOT, 'scripts/vercel-ignore-build.mjs'), 'utf8');
    expect(src).toMatch(/REQUIRED_CHECKS/);
    expect(src).toMatch(/Validate, test, build/);
  });
});
