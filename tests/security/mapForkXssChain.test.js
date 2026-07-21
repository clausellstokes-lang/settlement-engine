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
const MARKERS_SRC = read('public/map/modules/ui/markers-editor.js');
const NOTES_SRC = read('public/map/modules/ui/notes-editor.js');
const CLOUD_SRC = read('public/map/modules/io/cloud.js');
const AI_SRC = read('public/map/modules/ui/ai-generator.js');
const LAYERS_SRC = read('public/map/modules/ui/layers.js');

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
    // Accept the enforced key AND the Report-Only key: this lineage ships the
    // policy as Content-Security-Policy-Report-Only (documented rollout posture,
    // api/csp-report.js — flip-to-enforce is on the owner punch list). The
    // no-CDN / pinned-navigation invariants are identical under either key.
    const csp = mapHeaders.headers.find(
      (h) => /^content-security-policy(-report-only)?$/.test(h.key.toLowerCase()),
    ).value;
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

// ── Wave 1 — no untrusted map content reaches an injection sink ──────────────
// These pin the second cluster of fork XSS sinks: the raw-SVG segment of an
// uploaded .map (load.js), the untrusted marker icon (markers-editor.js), and
// the runtime cross-origin TinyMCE load (notes-editor.js). Same slice-and-eval
// idiom as the layers above for the functional guards.

describe('wave-1 layer A — the uploaded .map SVG segment is scrubbed before injection', () => {
  const sanitizeMapSvg = evalBlock(GENERAL_SRC, 'function sanitizeMapSvg', 'sanitizeMapSvg');

  test('strips <script>, inline event handlers and javascript: hrefs from a crafted data[5]', () => {
    const out = sanitizeMapSvg(
      '<svg id="map" onload="window.pwned=1">' +
        '<rect onclick="window.pwned=1" fill="red"/>' +
        '<script>window.pwned=1</script>' +
        '<a xlink:href="javascript:window.pwned=1">x</a>' +
        '</svg>',
    );
    expect(out).not.toMatch(/onload/i);
    expect(out).not.toMatch(/onclick/i);
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/javascript:/i);
  });

  test('preserves the legitimate map SVG (id, drawing attrs, data: image hrefs)', () => {
    const out = sanitizeMapSvg(
      '<svg id="map"><rect fill="red" stroke="#000"/><image href="data:image/png;base64,AAAA"/></svg>',
    );
    expect(out).toMatch(/id="map"/);
    expect(out).toMatch(/fill="red"/);
    expect(out).toContain('data:image/png;base64,AAAA');
  });

  test('load.js routes data[5] through the scrubber, never raw', () => {
    expect(LOAD_SRC).toContain('insertAdjacentHTML("afterbegin", sanitizeMapSvg(data[5]))');
    expect(LOAD_SRC).not.toContain('insertAdjacentHTML("afterbegin", data[5])');
  });
});

describe('wave-1 layer B — untrusted marker icons cannot break out of innerHTML', () => {
  const escapeHtml = evalBlock(GENERAL_SRC, 'function escapeHtml', 'escapeHtml');

  test('a crafted icon can neither inject a tag nor break out of an attribute', () => {
    // non-http branch: raw innerHTML — must not survive as a live tag
    const injected = escapeHtml('<img src=x onerror="window.pwned=1">');
    expect(injected).not.toMatch(/</);
    expect(injected).not.toMatch(/>/);
    // http branch: interpolated into `<img src="${icon}">` — the quote that would
    // close the src attribute and start an onerror handler must be encoded
    const breakout = escapeHtml('http://x" onerror="window.pwned=1');
    expect(breakout).not.toMatch(/"/);
    expect(breakout).toContain('&quot;');
  });

  test('legitimate icons (emoji, plain URL) pass through unchanged', () => {
    expect(escapeHtml('\u{1F3F0}')).toBe('\u{1F3F0}');
    expect(escapeHtml('https://example.com/icon.png')).toBe('https://example.com/icon.png');
  });

  test('markers-editor.js routes marker.icon and the chosen icon through escapeHtml', () => {
    expect(MARKERS_SRC).toContain('escapeHtml(marker.icon)');
    expect(MARKERS_SRC).toContain('escapeHtml(value)');
    // no raw interpolation of the icon into the img src remains
    expect(MARKERS_SRC).not.toContain('src="${marker.icon}"');
    expect(MARKERS_SRC).not.toContain('src="${value}"');
  });
});

describe('wave-1 layer C — TinyMCE loads from our vendored copy, not azgaar.github.io', () => {
  test('notes-editor.js references no runtime azgaar.github.io resource', () => {
    expect(NOTES_SRC).not.toContain('azgaar.github.io');
  });

  test('notes-editor.js loads the local pinned TinyMCE and sets a local base URL', () => {
    expect(NOTES_SRC).toContain('libs/tinymce/tinymce.min.js');
    expect(NOTES_SRC).toContain('_setBaseUrl(new URL("libs/tinymce"');
    // the vendored, hash-pinned copy actually exists
    expect(existsSync(resolve(process.cwd(), 'public/map/libs/tinymce/tinymce.min.js'))).toBe(true);
  });
});

// ── Wave 2 — the FMG-remainder security follow-ons ───────────────────────────
// Three defensive follow-ons wave 1 did not cover: (D) the untrusted-.map-name
// innerHTML sinks in the cell-info hover overlay are escaped, (E) the Dropbox
// OAuth access token is neither console-logged nor persisted to disk, and (F)
// FMG's BYOK AI generator's direct cross-origin LLM egress is disabled. Same
// slice-and-eval (functional) / source-slice (structural) idiom as the layers
// above.

describe('wave-2 layer D — the cell-info overlay escapes untrusted .map names', () => {
  const escapeHtml = evalBlock(GENERAL_SRC, 'function escapeHtml', 'escapeHtml');

  test('a crafted state/burg/culture name cannot introduce a tag or break out', () => {
    const injected = escapeHtml('<img src=x onerror="window.pwned=1">');
    expect(injected).not.toMatch(/[<>]/);
    expect(injected).toContain('&lt;img');
    // a quote that would break out of an interpolation is encoded
    expect(escapeHtml('a" onmouseover="window.pwned=1')).toContain('&quot;');
  });

  test('every untrusted name sink in updateCellInfo routes through escapeHtml', () => {
    const fnStart = GENERAL_SRC.indexOf('function updateCellInfo(');
    expect(fnStart).toBeGreaterThan(-1);
    const body = GENERAL_SRC.slice(fnStart, GENERAL_SRC.indexOf('\n}', fnStart) + 2);
    expect(body).toContain('escapeHtml(pack.states[cells.state[i]].fullName)');
    expect(body).toContain('escapeHtml(pack.provinces[cells.province[i]].fullName)');
    expect(body).toContain('escapeHtml(pack.cultures[cells.culture[i]].name)');
    expect(body).toContain('escapeHtml(pack.religions[cells.religion[i]].name)');
    expect(body).toContain('escapeHtml(pack.burgs[cells.burg[i]].name)');
    expect(body).toContain('escapeHtml(biomesData.name[cells.biome[i]])');
    // and none of the escaped names is interpolated raw any longer
    expect(body).not.toMatch(/\$\{pack\.states\[cells\.state\[i\]\]\.fullName\}/);
    expect(body).not.toMatch(/\$\{pack\.cultures\[cells\.culture\[i\]\]\.name\}/);
    expect(body).not.toContain('pack.burgs[cells.burg[i]].name + " ("');
  });

  test('drawProvinces escapes the province label name (auto-render sink)', () => {
    // layers.js injects province <text> labels into #provs innerHTML on layer
    // render — no user interaction — so the untrusted p.name must be escaped.
    expect(LAYERS_SRC).toContain('id="provinceLabel${p.i}">${escapeHtml(p.name)}</text>');
    expect(LAYERS_SRC).not.toContain('id="provinceLabel${p.i}">${p.name}</text>');
  });
});

describe('wave-2 layer E — the Dropbox OAuth token is not leaked or persisted to disk', () => {
  test('no active console statement in cloud.js references the token', () => {
    const offenders = CLOUD_SRC.split('\n')
      .map(line => line.trim())
      .filter(line => !line.startsWith('//') && /console\.\w+\(/.test(line) && /\btoken\b/.test(line));
    expect(offenders).toEqual([]);
    // the historical raw-token debug line is gone
    expect(CLOUD_SRC).not.toContain('console.info("Access token:"');
  });

  test('the token is held session-scoped (sessionStorage), never localStorage', () => {
    expect(CLOUD_SRC).toContain('sessionStorage.setItem(lSKey(prov), key)');
    expect(CLOUD_SRC).toContain('sessionStorage.getItem(lSKey(prov))');
    expect(CLOUD_SRC).not.toMatch(/localStorage\.(set|get)Item\(lSKey/);
  });
});

describe('wave-2 layer F — the FMG BYOK AI generator does not egress to LLM hosts', () => {
  test('generate() short-circuits before any provider dispatch (egress is dead)', () => {
    const fnStart = AI_SRC.indexOf('async function generate(button)');
    expect(fnStart).toBeGreaterThan(-1);
    const guard = AI_SRC.indexOf('AI text generation is disabled', fnStart);
    const dispatch = AI_SRC.indexOf('PROVIDERS[provider].generate(', fnStart);
    expect(guard).toBeGreaterThan(fnStart);
    expect(dispatch).toBeGreaterThan(fnStart);
    // the disabling early return sits before the only path that reaches fetch()
    expect(guard).toBeLessThan(dispatch);
  });
});
