/**
 * @vitest-environment jsdom
 *
 * Security regression — the vendored /map/ fork ships same-origin with the
 * auth SPA, so an XSS anywhere in it is an XSS against the session-token
 * origin. The historical chain: a crafted .map file delivered via the
 * unrestricted '?maplink=' fetch landed attacker HTML in note.legend, which
 * modules/ui/general.js piped raw into innerHTML on hover. These tests pin
 * every layer of the fix (each one independently breaks the chain):
 *
 *   1. general.js sanitizes note markup before innerHTML (sink killed)
 *   2. loadMapFromURL only fetches same-origin/Dropbox (delivery closed)
 *   3. load.js escapes the attacker URL before the link() error dialog
 *   4. the /map/ CSP no longer trusts any CDN in script-src
 *   5. dropbox.html loads the pinned local Dropbox SDK, not unpkg
 *   6. sw.js (CDN importScripts service worker) is gone for good
 *
 * The sanitizer and allowlist are exercised FUNCTIONALLY: their definitions
 * are sliced out of the fork source (plain <script> files, not modules) and
 * evaluated against this jsdom window, then fed real payloads.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');

const GENERAL_SRC = read('public/map/modules/ui/general.js');
const LOAD_SRC = read('public/map/modules/io/load.js');
const MAIN_SRC = read('public/map/main.js');

/**
 * Slice a self-contained block out of a fork source file and evaluate it in
 * this jsdom window. `start` must match the first line of the block and
 * `end` the last construct to include (both plain substrings).
 */
function evalBlock(source, start, endFnName) {
  const from = source.indexOf(start);
  expect(from, `source block "${start}" present`).toBeGreaterThan(-1);
  const fnStart = source.indexOf(`function ${endFnName}(`, from);
  expect(fnStart, `function ${endFnName} present`).toBeGreaterThan(-1);
  const fnEnd = source.indexOf('\n}', fnStart);
  expect(fnEnd, `function ${endFnName} closes`).toBeGreaterThan(-1);
  window.eval(source.slice(from, fnEnd + 2) + `\nwindow.__underTest = ${endFnName};`);
  return window.__underTest;
}

describe('layer 1 — note markup is sanitized before innerHTML', () => {
  const sanitizeNoteHtml = evalBlock(GENERAL_SRC, 'const UNSAFE_NOTE_TAGS', 'sanitizeNoteHtml');

  test('strips <script> and inline event handlers from a crafted legend', () => {
    const out = sanitizeNoteHtml('<script>window.pwned=1</script><img src="x" onerror="window.pwned=1">boom');
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/onerror/i);
    expect(out).toContain('boom');
  });

  test('strips javascript: hrefs, iframes and srcdoc', () => {
    const out = sanitizeNoteHtml(
      '<a href="javascript:window.pwned=1">x</a><iframe srcdoc="<script>1</script>"></iframe>',
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/<iframe/i);
  });

  test('keeps legitimate rich-text formatting and data: images', () => {
    const legit = '<div style="color:red"><b>Keep</b> <i>this</i> <img src="data:image/png;base64,AAAA"></div>';
    const out = sanitizeNoteHtml(legit);
    expect(out).toContain('<b>Keep</b>');
    expect(out).toContain('data:image/png;base64,AAAA');
  });

  test('both hover sinks in showNotes go through the sanitizer', () => {
    expect(GENERAL_SRC).toContain('innerHTML = sanitizeNoteHtml(note.name)');
    expect(GENERAL_SRC).toContain('innerHTML = sanitizeNoteHtml(note.legend)');
    // and no remaining raw note assignment anywhere in the file
    expect(GENERAL_SRC).not.toMatch(/innerHTML = note\.(name|legend)/);
  });
});

describe('layer 2 — maplink fetches are origin-allowlisted', () => {
  const isTrustedMapLink = evalBlock(LOAD_SRC, 'const TRUSTED_MAP_HOSTS', 'isTrustedMapLink');

  test('rejects arbitrary external origins, data:, blob: and ftp:', () => {
    expect(isTrustedMapLink('https://evil.example/payload.map')).toBe(false);
    expect(isTrustedMapLink('data:application/octet-stream,MAP')).toBe(false);
    expect(isTrustedMapLink('blob:https://evil.example/uuid')).toBe(false);
    expect(isTrustedMapLink('ftp://evil.example/x.map')).toBe(false);
    // lookalike host must not pass a substring/suffix check
    expect(isTrustedMapLink('https://dl.dropboxusercontent.com.evil.example/x.map')).toBe(false);
    // trusted host but plaintext transport
    expect(isTrustedMapLink('http://dl.dropboxusercontent.com/s/x.map')).toBe(false);
  });

  test('allows same-origin and the Dropbox download hosts', () => {
    expect(isTrustedMapLink(`${window.location.origin}/maps/demo.map`)).toBe(true);
    expect(isTrustedMapLink('maps/demo.map')).toBe(true); // relative resolves same-origin
    expect(isTrustedMapLink('https://dl.dropboxusercontent.com/s/abc/world.map')).toBe(true);
  });

  test('loadMapFromURL and the ?maplink= entry both consult the allowlist', () => {
    // load.js: the gate must sit before the fetch
    const fnStart = LOAD_SRC.indexOf('function loadMapFromURL(');
    const gate = LOAD_SRC.indexOf('isTrustedMapLink(URL)', fnStart);
    const fetchAt = LOAD_SRC.indexOf('fetch(URL', fnStart);
    expect(gate).toBeGreaterThan(fnStart);
    expect(gate).toBeLessThan(fetchAt);
    // main.js: the URL-parameter entry point also gates
    expect(MAIN_SRC).toContain('isTrustedMapLink(decodeURIComponent(maplink))');
  });
});

describe('layer 3 — the load-error dialog escapes the attacker URL', () => {
  test('showUploadErrorMessage attribute-encodes before link()', () => {
    const fnStart = LOAD_SRC.indexOf('function showUploadErrorMessage(');
    const body = LOAD_SRC.slice(fnStart, LOAD_SRC.indexOf('\n}', fnStart));
    expect(body).toContain('&quot;');
    expect(body).toContain('link(safeURL');
    expect(body).not.toContain('link(URL,');
  });
});

describe('layers 4-6 — delivery surface: CSP, Dropbox SDK, service worker', () => {
  test('the /map/ CSP script-src trusts no CDN and pins navigations', () => {
    const vercel = JSON.parse(read('vercel.json'));
    const mapHeaders = vercel.headers.find((h) => h.source.startsWith('/map/'));
    const csp = mapHeaders.headers.find((h) => h.key === 'Content-Security-Policy').value;
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'));
    expect(scriptSrc).not.toMatch(/unpkg|cdn|googleapis|https:\/\//);
    expect(csp).toContain("navigate-to 'self' https://*.supabase.co");
  });

  test('dropbox.html loads only the vendored pinned SDK', () => {
    const html = read('public/map/dropbox.html');
    expect(html).toContain('src="libs/dropbox-sdk.min.js"');
    expect(html).not.toMatch(/<script[^>]+src="https?:\/\//i);
    expect(existsSync(resolve(process.cwd(), 'public/map/libs/dropbox-sdk.min.js'))).toBe(true);
  });

  test('the CDN-importScripts service worker is deleted and never registered', () => {
    expect(existsSync(resolve(process.cwd(), 'public/map/sw.js'))).toBe(false);
    expect(MAIN_SRC).not.toContain('serviceWorker.register');
  });
});
